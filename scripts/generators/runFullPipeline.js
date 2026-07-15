#!/usr/bin/env node

/**
 * Full Pipeline Runner — processes ALL complete-qa.json files that need answers
 *
 * Usage:
 *   node scripts/generators/runFullPipeline.js [--dry-run] [--resume] [--force] [--filter=<pattern>]
 *
 * Examples:
 *   node scripts/generators/runFullPipeline.js --dry-run
 *   node scripts/generators/runFullPipeline.js --resume
 *   node scripts/generators/runFullPipeline.js --force               # regenerate ALL questions, even existing ones
 *   node scripts/generators/runFullPipeline.js --force --filter=spring-boot
 *   node scripts/generators/runFullPipeline.js --filter=core-java --resume
 *
 * --force: Regenerates ALL questions in every file, ignoring structural "already good" check.
 *          Use this when existing answers have quality issues (AI dump, bad voice, wrong structure)
 *          even though they pass the structural check (has key_points + speakable + 1500+ chars).
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');

function findAllCompleteQaFiles() {
  const result = execSync(
    `find ${path.join(ROOT, 'content/interview')} -name complete-qa.json`,
    { encoding: 'utf8' }
  );
  return result.trim().split('\n').filter(Boolean).sort();
}

function assessFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const questions = data.questions || [];
  let needsWork = 0;
  let alreadyGood = 0;

  questions.forEach(q => {
    const sections = q.answer?.sections || [];
    const hasKP = sections.some(s => s.type === 'key_points');
    const hasSA = sections.some(s => s.type === 'speakable_answer');
    const deepSections = sections.filter(s => s.type !== 'key_points' && s.type !== 'speakable_answer');
    const deepChars = deepSections.reduce((a, s) => a + (s.content || '').length, 0);

    if (hasKP && hasSA && deepChars > 1500) {
      alreadyGood++;
    } else {
      needsWork++;
    }
  });

  return { total: questions.length, needsWork, alreadyGood };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const resume = args.includes('--resume');
  const force = args.includes('--force');
  const filterArg = args.find(a => a.startsWith('--filter='));
  const filter = filterArg ? filterArg.split('=')[1] : null;

  if (force && resume) {
    console.error('ERROR: --force and --resume are mutually exclusive.');
    console.error('  --force  regenerates everything from scratch');
    console.error('  --resume skips questions that already have quality answers');
    process.exit(1);
  }

  const allFiles = findAllCompleteQaFiles();
  console.log(`Found ${allFiles.length} complete-qa.json files in content/interview/\n`);

  let filteredFiles = filter
    ? allFiles.filter(f => f.includes(filter))
    : allFiles;

  // Assess each file
  const assessments = filteredFiles.map(f => {
    const assessment = assessFile(f);
    const relPath = path.relative(ROOT, f);
    return { path: f, relPath, ...assessment };
  });

  // Sort: files with more questions needing work first
  assessments.sort((a, b) => b.needsWork - a.needsWork);

  // Summary
  const totalQuestions = assessments.reduce((a, f) => a + f.total, 0);
  const totalNeedsWork = assessments.reduce((a, f) => a + f.needsWork, 0);
  const totalGood = assessments.reduce((a, f) => a + f.alreadyGood, 0);

  // --force processes ALL files; otherwise only files where questions structurally need work
  const filesToProcess = force ? assessments : assessments.filter(f => f.needsWork > 0);

  console.log(`Total questions:      ${totalQuestions}`);
  console.log(`Structurally good:    ${totalGood}`);
  console.log(`Structurally missing: ${totalNeedsWork}`);
  if (force) {
    console.log(`Mode:                 FORCE — regenerating all ${totalQuestions} questions`);
  }
  console.log(`Files to process:     ${filesToProcess.length}/${assessments.length}`);
  console.log('');

  if (dryRun) {
    console.log('Files that will be processed:');
    filesToProcess.forEach(f => {
      const label = force ? `${f.total} questions (force)` : `${f.needsWork}/${f.total} need work`;
      console.log(`  ${label} — ${f.relPath}`);
    });
    console.log(`\nRun without --dry-run to process these files.`);
    return;
  }

  // Process each file sequentially
  const pipelinePath = path.join(__dirname, 'answerPipeline.js');
  const results = [];

  for (let i = 0; i < filesToProcess.length; i++) {
    const file = filesToProcess[i];
    console.log(`\n${'═'.repeat(70)}`);
    const label = force ? `${file.total} questions (force)` : `${file.needsWork} questions`;
    console.log(`[${i + 1}/${filesToProcess.length}] ${file.relPath} (${label})`);
    console.log(`${'═'.repeat(70)}`);

    try {
      // --force: no --resume flag so answerPipeline.js processes every question regardless
      // --resume: pass through to skip already-good questions
      const flags = resume ? '--resume' : '';
      execSync(
        `node "${pipelinePath}" "${file.path}" ${flags}`,
        {
          stdio: 'inherit',
          env: { ...process.env },
          timeout: 600000, // 10 min per file
        }
      );
      results.push({ file: file.relPath, status: 'completed' });
    } catch (err) {
      console.error(`ERROR processing ${file.relPath}: ${err.message}`);
      results.push({ file: file.relPath, status: 'failed', error: err.message });
    }
  }

  // Final summary
  console.log(`\n${'═'.repeat(70)}`);
  console.log('PIPELINE COMPLETE');
  console.log(`${'═'.repeat(70)}`);
  console.log(`Completed: ${results.filter(r => r.status === 'completed').length}`);
  console.log(`Failed:    ${results.filter(r => r.status === 'failed').length}`);
  results.forEach(r => {
    const icon = r.status === 'completed' ? '✓' : '✗';
    console.log(`  ${icon} ${r.file}`);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
