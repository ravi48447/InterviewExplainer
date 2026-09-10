/**
 * Import generated questions from JSON files into PostgreSQL database
 *
 * Usage:
 *   npx tsx scripts/importQuestions.ts <domain> <stack>
 *
 * Example:
 *   npx tsx scripts/importQuestions.ts java-backend core-java
 */

import * as fs from 'fs';
import * as path from 'path';

interface QuestionOnly {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'low' | 'medium' | 'high';
  tags: string[];
}

async function importQuestions(domainSlug: string, stackSlug: string) {
  const questionsPath = path.join(
    process.cwd(),
    'data',
    'questions',
    domainSlug,
    stackSlug,
    'questions-only.json'
  );

  if (!fs.existsSync(questionsPath)) {
    console.error(`❌ File not found: ${questionsPath}`);
    process.exit(1);
  }

  const questions: QuestionOnly[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

  console.log(`\n📦 Found ${questions.length} questions for ${domainSlug}/${stackSlug}`);
  console.log('\n🔄 Converting to SQL INSERT statements...\n');

  // Generate SQL for inserting into PostgreSQL
  const sqlStatements: string[] = [];

  // First, we need to get domain_id and stack_id
  // For now, we'll use placeholders and generate SQL that needs manual domain/stack IDs

  sqlStatements.push(`-- Import questions for ${domainSlug}/${stackSlug}`);
  sqlStatements.push(`-- Step 1: Find your domain_id and category_id manually from database:`);
  sqlStatements.push(`-- SELECT d.id as domain_id, dc.id as category_id, ts.id as stack_id`);
  sqlStatements.push(`-- FROM domains d`);
  sqlStatements.push(`-- JOIN domain_categories dc ON dc.domain_id = d.id`);
  sqlStatements.push(`-- JOIN tech_stacks ts ON ts.category_id = dc.id`);
  sqlStatements.push(`-- WHERE d.slug = '${domainSlug}' AND ts.slug = '${stackSlug}';`);
  sqlStatements.push(`\n-- Step 2: Replace <stack_id> below with the actual stack_id from above query\n`);

  questions.forEach((q, index) => {
    const questionText = q.question.replace(/'/g, "''"); // Escape single quotes for SQL
    const title = q.title.replace(/'/g, "''");
    const tags = q.tags.join(',');
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    const importanceMap = { low: 1, medium: 2, high: 3 };

    sqlStatements.push(
      `INSERT INTO questions (stack_id, title, slug, question_text, answer_text, difficulty_level, importance, tags, created_at, updated_at)\nVALUES (\n  <stack_id>,\n  '${title}',\n  '${q.slug}',\n  '${questionText}',\n  NULL, -- answer_text will be added in Phase 2\n  ${difficultyMap[q.difficulty]},\n  ${importanceMap[q.importance]},\n  '${tags}',\n  NOW(),\n  NOW()\n);\n`
    );
  });

  // Write SQL to file
  const outputPath = path.join(
    process.cwd(),
    'data',
    'questions',
    domainSlug,
    stackSlug,
    'import.sql'
  );

  fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');

  console.log(`✅ SQL import file generated: ${outputPath}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Run the SELECT query in the SQL file to find your stack_id`);
  console.log(`   2. Replace all <stack_id> placeholders with the actual ID`);
  console.log(`   3. Run the SQL file in your PostgreSQL database:`);
  console.log(`      psql -d interview_explainer -f ${outputPath}`);
  console.log(`\n   OR use this command (after replacing <stack_id>):`);
  console.log(`      cat ${outputPath} | docker exec -i <postgres_container> psql -U interview_user -d interview_explainer\n`);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('\n📥 Question Importer\n');
    console.log('Usage: npx tsx scripts/importQuestions.ts <domain> <stack>\n');
    console.log('Example:');
    console.log('  npx tsx scripts/importQuestions.ts java-backend core-java\n');
    process.exit(1);
  }

  const [domain, stack] = args;
  importQuestions(domain, stack).catch(console.error);
}

export { importQuestions };
