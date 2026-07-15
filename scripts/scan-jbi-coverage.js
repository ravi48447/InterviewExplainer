#!/usr/bin/env node
/**
 * Scans content/java-backend-intermediate/ and reports:
 *  - Modules / topics with no complete-qa.json
 *  - Topics where complete-qa.json has 0 questions
 *  - Questions flagged `stub: true` or with empty answer.sections[]
 *  - Slug mismatch between questions.json (TOC) and complete-qa.json
 *  - Topics referenced in _config.json that do not exist on disk
 *
 * Produces a plain-text report + a JSON summary at scripts/output/jbi-coverage.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'content', 'java-backend-intermediate');
const OUT_DIR = path.join(__dirname, 'output');
const INDEX_PATH = path.join(ROOT, '_index.json');

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return null; }
}

function isNonEmptySection(s) {
  if (!s || typeof s !== 'object') return false;
  if (typeof s.content === 'string' && s.content.trim()) return true;
  if (Array.isArray(s.content) && s.content.length > 0) return true;
  if (typeof s.summary === 'string' && s.summary.trim()) return true;
  if (Array.isArray(s.mistakes) && s.mistakes.length > 0) return true;
  if (Array.isArray(s.questions) && s.questions.length > 0) return true;
  return false;
}

function answerIsEmpty(q) {
  if (q.stub === true) return true;
  const sections = q.answer && Array.isArray(q.answer.sections) ? q.answer.sections : [];
  if (sections.length === 0) return true;
  return !sections.some(isNonEmptySection);
}

function listDirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);
}

const index = readJson(INDEX_PATH);
if (!index) {
  console.error('Cannot read _index.json at', INDEX_PATH);
  process.exit(1);
}

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    modules: 0,
    topics: 0,
    questionsIndexed: 0,
    questionsAnswered: 0,
    questionsUnanswered: 0,
    topicsWithNoQA: 0,
    topicsWithZeroQuestions: 0,
    configTopicMissingOnDisk: 0,
  },
  modules: [],
};

for (const mod of index.modules) {
  const modDir = path.join(ROOT, mod.moduleSlug);
  const modExists = fs.existsSync(modDir);
  const cfgPath = path.join(modDir, '_config.json');
  const cfg = readJson(cfgPath);
  const configuredTopics = Array.isArray(mod.topics) ? mod.topics : (cfg && cfg.topics) || [];
  const onDiskTopics = listDirs(modDir);

  const missingOnDisk = configuredTopics.filter(t => !onDiskTopics.includes(t));

  const modSummary = {
    moduleNumber: mod.moduleNumber,
    moduleSlug: mod.moduleSlug,
    title: mod.title,
    exists: modExists,
    configuredTopics,
    onDiskTopics,
    missingOnDisk,
    topics: [],
    totals: { questions: 0, answered: 0, unanswered: 0 },
  };
  report.totals.modules += 1;
  report.totals.configTopicMissingOnDisk += missingOnDisk.length;

  const topicsToScan = [...new Set([...configuredTopics, ...onDiskTopics])];
  for (const topic of topicsToScan) {
    const topicDir = path.join(modDir, topic);
    const onDisk = fs.existsSync(topicDir);
    const qaPath = path.join(topicDir, 'complete-qa.json');
    const qPath = path.join(topicDir, 'questions.json');
    const qa = readJson(qaPath);
    const ql = readJson(qPath);

    const topicRow = {
      topic,
      onDisk,
      hasCompleteQA: !!qa,
      hasQuestionsJson: !!ql,
      questionsInQA: 0,
      answered: 0,
      unanswered: 0,
      unansweredSlugs: [],
      stubSlugs: [],
      tocOnly: [],
      qaOnly: [],
    };

    report.totals.topics += 1;
    if (!onDisk) { /* missing already counted */ }

    if (qa && Array.isArray(qa.questions)) {
      topicRow.questionsInQA = qa.questions.length;
      if (qa.questions.length === 0) report.totals.topicsWithZeroQuestions += 1;
      for (const q of qa.questions) {
        const empty = answerIsEmpty(q);
        if (empty) {
          topicRow.unanswered += 1;
          topicRow.unansweredSlugs.push(q.slug || q.id);
          if (q.stub === true) topicRow.stubSlugs.push(q.slug || q.id);
        } else {
          topicRow.answered += 1;
        }
      }
    } else {
      report.totals.topicsWithNoQA += 1;
    }

    if (ql && qa) {
      const qList = Array.isArray(ql) ? ql : Array.isArray(ql.questions) ? ql.questions : [];
      const qSlugs = new Set(qList.map(q => q.slug));
      const qaSlugs = new Set((qa.questions || []).map(q => q.slug));
      topicRow.tocOnly = [...qSlugs].filter(s => !qaSlugs.has(s));
      topicRow.qaOnly = [...qaSlugs].filter(s => !qSlugs.has(s));
    }

    modSummary.totals.questions += topicRow.questionsInQA;
    modSummary.totals.answered += topicRow.answered;
    modSummary.totals.unanswered += topicRow.unanswered;
    modSummary.topics.push(topicRow);
  }

  report.totals.questionsIndexed += modSummary.totals.questions;
  report.totals.questionsAnswered += modSummary.totals.answered;
  report.totals.questionsUnanswered += modSummary.totals.unanswered;
  report.modules.push(modSummary);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, 'jbi-coverage.json'),
  JSON.stringify(report, null, 2)
);

const pct = report.totals.questionsIndexed
  ? Math.round((report.totals.questionsAnswered / report.totals.questionsIndexed) * 1000) / 10
  : 0;

console.log('');
console.log('='.repeat(76));
console.log('Java-Backend-Intermediate content coverage');
console.log('='.repeat(76));
console.log(`Modules scanned          : ${report.totals.modules}`);
console.log(`Topics scanned           : ${report.totals.topics}`);
console.log(`Topics w/ no complete-qa : ${report.totals.topicsWithNoQA}`);
console.log(`Topics w/ 0 questions    : ${report.totals.topicsWithZeroQuestions}`);
console.log(`Config topics missing dir: ${report.totals.configTopicMissingOnDisk}`);
console.log(`Total questions          : ${report.totals.questionsIndexed}`);
console.log(`  Answered               : ${report.totals.questionsAnswered}`);
console.log(`  Unanswered (stub/empty): ${report.totals.questionsUnanswered}   (${pct}% answered)`);
console.log('');

// Per-module breakdown with unanswered topics highlighted
const unansweredTopics = [];
for (const m of report.modules) {
  const weak = m.topics.filter(t => !t.hasCompleteQA || t.questionsInQA === 0 || t.unanswered > 0);
  if (weak.length > 0 || m.missingOnDisk.length > 0) {
    console.log(`${m.moduleNumber}  ${m.moduleSlug.padEnd(24)}  Q:${m.totals.questions}  A:${m.totals.answered}  U:${m.totals.unanswered}`);
    if (m.missingOnDisk.length) {
      console.log(`    ! topics missing on disk: ${m.missingOnDisk.join(', ')}`);
    }
    for (const t of weak) {
      const tag = !t.onDisk ? 'MISSING' : !t.hasCompleteQA ? 'NO-QA' : t.questionsInQA === 0 ? 'EMPTY' : `${t.unanswered}/${t.questionsInQA} unanswered`;
      console.log(`    - ${t.topic.padEnd(34)} ${tag}`);
      if (t.unansweredSlugs.length && t.unansweredSlugs.length <= 8) {
        console.log(`        ${t.unansweredSlugs.join(', ')}`);
      } else if (t.unansweredSlugs.length > 8) {
        console.log(`        ${t.unansweredSlugs.slice(0,6).join(', ')} ... (+${t.unansweredSlugs.length-6} more)`);
      }
      unansweredTopics.push(`${m.moduleSlug}/${t.topic}`);
    }
    console.log('');
  }
}

console.log(`Detail JSON: ${path.relative(process.cwd(), path.join(OUT_DIR, 'jbi-coverage.json'))}`);
