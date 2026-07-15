/**
 * Import generated questions directly into PostgreSQL database
 *
 * Usage:
 *   npx tsx scripts/importToDatabase.ts <domain> <stack> <stack_id>
 *
 * Example:
 *   npx tsx scripts/importToDatabase.ts java-backend core-java 219
 */

import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

interface QuestionOnly {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'low' | 'medium' | 'high';
  tags: string[];
}

async function importToDatabase(domainSlug: string, stackSlug: string, stackId: number) {
  // NEW STRUCTURE: content/domains/{domain}/stacks/{stack}/questions.json
  const questionsPath = path.join(
    process.cwd(),
    'content',
    'domains',
    domainSlug,
    'stacks',
    stackSlug,
    'questions.json'
  );

  if (!fs.existsSync(questionsPath)) {
    console.error(`❌ File not found: ${questionsPath}`);
    console.error(`Expected location: content/domains/${domainSlug}/stacks/${stackSlug}/questions.json`);
    process.exit(1);
  }

  const questions: QuestionOnly[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

  console.log(`\n📦 Found ${questions.length} questions for ${domainSlug}/${stackSlug}`);
  console.log(`🎯 Target stack_id: ${stackId}\n`);

  // Connect to database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'interviewexplainer',
    user: 'interviewexplainer',
    password: 'changeme'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if stack exists
    const stackCheck = await client.query('SELECT id, name, slug FROM tech_stacks WHERE id = $1', [stackId]);
    if (stackCheck.rows.length === 0) {
      console.error(`❌ Stack ID ${stackId} not found in database`);
      process.exit(1);
    }
    console.log(`✅ Stack found: ${stackCheck.rows[0].name}\n`);

    // Create or get topic for this stack
    const topicSlug = stackCheck.rows[0].slug;
    const topicName = stackCheck.rows[0].name;

    let topicId: number;
    const topicCheck = await client.query('SELECT id FROM topics WHERE slug = $1', [topicSlug]);

    if (topicCheck.rows.length > 0) {
      topicId = topicCheck.rows[0].id;
      console.log(`✅ Using existing topic ID: ${topicId}\n`);
    } else {
      const topicInsert = await client.query(
        `INSERT INTO topics (name, slug, description, created_at, updated_at, order_index)
         VALUES ($1, $2, $3, NOW(), NOW(), 1)
         RETURNING id`,
        [topicName, topicSlug, `${topicName} interview questions`]
      );
      topicId = topicInsert.rows[0].id;
      console.log(`✅ Created new topic ID: ${topicId}\n`);
    }

    const difficultyMap = { easy: 'easy', medium: 'medium', hard: 'hard' };

    let inserted = 0;
    let skipped = 0;

    for (const q of questions) {
      try {
        // Check if question already exists by slug
        const existing = await client.query(
          'SELECT id FROM questions WHERE slug = $1',
          [q.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`⚠️  Skipping (already exists): ${q.slug}`);
          skipped++;
          continue;
        }

        // Insert question (using schema columns)
        const questionResult = await client.query(
          `INSERT INTO questions
           (topic_id, title, slug, difficulty, estimated_read_time, is_published, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           RETURNING id`,
          [
            topicId,
            q.title,
            q.slug,
            difficultyMap[q.difficulty],
            5, // default estimated_read_time
            true // is_published
          ]
        );

        const questionId = questionResult.rows[0].id;

        // Insert answer section with the question text
        await client.query(
          `INSERT INTO answer_sections
           (question_id, section_type, content, section_order, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [
            questionId,
            'interviewer_expectation', // section type
            q.question, // the question text as content
            1 // section_order
          ]
        );

        // Link question to stack via question_stack_index
        await client.query(
          `INSERT INTO question_stack_index (question_id, stack_id, order_index)
           VALUES ($1, $2, $3)`,
          [questionId, stackId, inserted + 1]
        );

        inserted++;
        console.log(`✅ Inserted: ${q.title}`);
      } catch (err: any) {
        console.error(`❌ Error inserting ${q.slug}: ${err.message}`);
      }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${questions.length}\n`);

  } catch (err: any) {
    console.error(`❌ Database error: ${err.message}`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('\n📥 Database Question Importer\n');
    console.log('Usage: npx tsx scripts/importToDatabase.ts <domain> <stack> <stack_id>\n');
    console.log('Example:');
    console.log('  npx tsx scripts/importToDatabase.ts java-backend core-java 219\n');
    console.log('To find stack_id, check: http://localhost:8080/api/v2/domains/<domain-slug>/categories\n');
    process.exit(1);
  }

  const [domain, stack, stackIdStr] = args;
  const stackId = parseInt(stackIdStr, 10);

  if (isNaN(stackId)) {
    console.error('❌ Invalid stack_id. Must be a number.');
    process.exit(1);
  }

  importToDatabase(domain, stack, stackId).catch(console.error);
}

export { importToDatabase };