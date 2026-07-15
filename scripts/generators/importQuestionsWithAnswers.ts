/**
 * Import questions WITH answers from complete-qa.json into PostgreSQL database
 *
 * Usage:
 *   npx tsx scripts/importQuestionsWithAnswers.ts <json-file-path> <stack-id>
 *
 * Example:
 *   npx tsx scripts/importQuestionsWithAnswers.ts content/domains/java/backend/3-5/spring-boot/auto-configuration/complete-qa.json 219
 */

import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

interface AnswerSection {
  type: string;
  title: string;
  content: string;
  timeToSpeak?: string;
  codeBlocks?: any[];
  diagrams?: any[];
  mistakes?: any[];
  questions?: any[];
}

interface Answer {
  summary: string;
  sections: AnswerSection[];
  metadata: {
    readTime: string;
    lastUpdated: string;
    difficultyLevel: string;
    keyTerms: string[];
  };
}

interface Question {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'low' | 'medium' | 'high';
  seoKeywords: string[];
  searchIntent: string[];
  layer: string;
  interviewFrequency: string;
  realWorldScenario: string;
  tags: string[];
  answer: Answer;
}

interface CompleteQA {
  topic: string;
  topicSlug: string;
  domain: string;
  stack: string;
  experience: string;
  category: string;
  questions: Question[];
}

async function importQuestionsWithAnswers(jsonPath: string, stackId: number) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found: ${jsonPath}`);
    process.exit(1);
  }

  const data: CompleteQA = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`\n📦 Found ${data.questions.length} questions with answers for ${data.topic}`);
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

    // Create or get topic
    const topicSlug = data.topicSlug;
    const topicName = data.topic;

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

    for (const q of data.questions) {
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

        // Extract read time from metadata
        const readTimeMatch = q.answer.metadata.readTime.match(/(\d+)/);
        const readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 10;

        // Insert question
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
            readTime,
            true
          ]
        );

        const questionId = questionResult.rows[0].id;

        // Insert answer sections
        let sectionOrder = 1;
        for (const section of q.answer.sections) {
          let contentWithTitle = `# ${section.title}\n\n`;

          // Handle different section types
          if (section.type === 'common_mistakes' && section.mistakes) {
            // Format common_mistakes
            for (const mistake of section.mistakes) {
              contentWithTitle += `## ❌ ${mistake.mistake}\n\n`;
              contentWithTitle += `**Why it's wrong:** ${mistake.why}\n\n`;
              contentWithTitle += `**✅ Correct approach:** ${mistake.correct}\n\n`;
              contentWithTitle += `---\n\n`;
            }
          } else if (section.type === 'followup_questions' && section.questions) {
            // Format followup_questions
            for (const fq of section.questions) {
              contentWithTitle += `### ${fq.question}\n\n`;
              contentWithTitle += `**Quick Answer:** ${fq.quickAnswer}\n\n`;
              if (fq.linkedQuestionId) {
                contentWithTitle += `*Related: ${fq.linkedQuestionId}*\n\n`;
              }
            }
          } else {
            // Regular content sections
            contentWithTitle += section.content || '';
          }

          await client.query(
            `INSERT INTO answer_sections
             (question_id, section_type, content, section_order, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [
              questionId,
              section.type,
              contentWithTitle,
              sectionOrder++
            ]
          );
        }

        // Link question to stack
        await client.query(
          `INSERT INTO question_stack_index (question_id, stack_id, order_index)
           VALUES ($1, $2, $3)`,
          [questionId, stackId, inserted + 1]
        );

        inserted++;
        console.log(`✅ Inserted: ${q.title} (${q.answer.sections.length} sections)`);
      } catch (err: any) {
        console.error(`❌ Error inserting ${q.slug}: ${err.message}`);
      }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   ✅ Inserted: ${inserted} questions`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${data.questions.length}\n`);

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

  if (args.length < 2) {
    console.log('\n📥 Database Question+Answer Importer\n');
    console.log('Usage: npx tsx scripts/importQuestionsWithAnswers.ts <json-file> <stack-id>\n');
    console.log('Example:');
    console.log('  npx tsx scripts/importQuestionsWithAnswers.ts content/domains/java/backend/3-5/spring-boot/auto-configuration/complete-qa.json 219\n');
    process.exit(1);
  }

  const [jsonPath, stackIdStr] = args;
  const stackId = parseInt(stackIdStr, 10);

  if (isNaN(stackId)) {
    console.error('❌ Invalid stack_id. Must be a number.');
    process.exit(1);
  }

  importQuestionsWithAnswers(jsonPath, stackIdStr).catch(console.error);
}

export { importQuestionsWithAnswers };