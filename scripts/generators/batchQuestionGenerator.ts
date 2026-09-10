#!/usr/bin/env tsx

/**
 * Batch Question Generator - Generate questions for ALL stacks in a domain
 *
 * Usage:
 *   npx tsx scripts/batchQuestionGenerator.ts java/backend/1-3-years
 *
 * This will:
 * 1. Read domain-config.json (all stacks)
 * 2. For each stack, call Claude API to generate questions
 * 3. Save to content/domains/{domain}/stacks/{stack}/questions.json
 * 4. Use MASTER_CONTENT_PHILOSOPHY.md + SEO_STRATEGY.md + domain-definition.md
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface Stack {
  id: string;
  name: string;
  priority: number;
  interviewFrequency: string;
  seoKeywords: string[];
  questionCount: {
    minimum: number;
    target: number;
    maximum: string;
  };
  coverage: Array<{
    topic: string;
    subtopics: string[];
    seoKeywords: string[];
    layer: string;
  }>;
  excludes: string[];
}

interface DomainConfig {
  domain: {
    id: string;
    name: string;
    experienceLevel: string;
    targetCompanies: string[];
  };
  stackCategories: {
    [key: string]: {
      name: string;
      description: string;
      priority: number;
      stacks: Stack[];
    };
  };
}

/**
 * Load file content as string
 */
function loadFile(filePath: string): string {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Load domain config JSON
 */
function loadDomainConfig(domainPath: string): DomainConfig {
  const configPath = `content/domains/${domainPath}/domain-config.json`;
  const content = loadFile(configPath);
  return JSON.parse(content);
}

/**
 * Build prompt for a specific stack
 * References actual files instead of copying content
 */
function buildStackPrompt(
  domainPath: string,
  domainConfig: DomainConfig,
  stack: Stack
): string {
  const philosophyPath = 'content/MASTER_CONTENT_PHILOSOPHY.md';
  const seoStrategyPath = 'content/SEO_STRATEGY.md';
  const domainDefPath = `content/domains/${domainPath}/domain-definition.md`;

  // Load reference files
  const philosophy = loadFile(philosophyPath);
  const seoStrategy = loadFile(seoStrategyPath);
  const domainDef = loadFile(domainDefPath);

  // Build coverage section
  const coverageText = stack.coverage
    .map(
      (c) => `
### ${c.topic}
${c.subtopics.map((st) => `- ${st}`).join('\n')}
**SEO Keywords**: ${c.seoKeywords.join(', ')}
**Layer**: ${c.layer}
`
    )
    .join('\n');

  // Build exclusions section
  const exclusionsText = stack.excludes
    .map((ex, idx) => `${idx + 1}. ❌ ${ex}`)
    .join('\n');

  return `# 🎯 DOMAIN-AWARE QUESTION GENERATION
## Powered by Universal Content Philosophy + SEO Strategy + Domain Definition

---

## 📋 REFERENCE DOCUMENTS

This prompt is built on top of three foundational documents:

### 1. MASTER_CONTENT_PHILOSOPHY.md
${philosophy}

---

### 2. SEO_STRATEGY.md
${seoStrategy}

---

### 3. Domain Definition (${domainConfig.domain.name})
${domainDef}

---

## 📊 CONTEXT AWARENESS

**Domain**: ${domainConfig.domain.name}
**Experience Level**: ${domainConfig.domain.experienceLevel}
**Stack**: ${stack.name}
**Interview Frequency**: ${stack.interviewFrequency} of interviews ask this
**Target Companies**: ${domainConfig.domain.targetCompanies.join(', ')}

---

## 📚 STACK SCOPE (EXACTLY WHAT TO COVER)

${coverageText}

---

## 🚫 CRITICAL: WHAT THIS STACK DOES NOT COVER

${exclusionsText}

**Rule**: If you mention excluded topics, only REFERENCE them, don't EXPLAIN them.

---

## 🎯 SEO OPTIMIZATION

**Primary Keywords**: ${stack.seoKeywords.join(', ')}

**Every question title MUST:**
1. Contain at least ONE primary keyword
2. Be searchable (how candidates actually search)
3. Be specific (not generic like "Explain X")

---

## 📊 QUESTION DISTRIBUTION

**Total Target**: ${stack.questionCount.target}+ questions

### By Learning Layer (from MASTER_CONTENT_PHILOSOPHY):
- 📖 **Surface Level** (15%): ${Math.round(stack.questionCount.target * 0.15)} questions
- 🔧 **Practical Usage** (40%): ${Math.round(stack.questionCount.target * 0.4)} questions
- 🧠 **Internal Mechanisms** (30%): ${Math.round(stack.questionCount.target * 0.3)} questions
- 🚀 **Production Mastery** (15%): ${Math.round(stack.questionCount.target * 0.15)} questions

### By Difficulty (from domain definition - 1-3 years):
- 🟢 **Easy**: ${Math.round(stack.questionCount.target * 0.2)} questions (20%)
- 🟡 **Medium**: ${Math.round(stack.questionCount.target * 0.6)} questions (60%)
- 🔴 **Hard**: ${Math.round(stack.questionCount.target * 0.2)} questions (20%)

---

## 💎 QUESTION QUALITY TEMPLATE

Each question MUST follow this EXACT format:

\`\`\`json
{
  "id": "seo-keyword-based-slug",
  "title": "[Primary Keyword] - [Specific Scenario/Context]",
  "slug": "primary-keyword-scenario",
  "question": "[3-5 sentences with context + specific ask + any constraints]",
  "difficulty": "easy|medium|hard",
  "importance": "high|medium|low",
  "seoKeywords": ["primary-keyword", "variation-1", "variation-2"],
  "searchIntent": ["exact search query 1", "exact search query 2"],
  "layer": "surface|practical|internal|production",
  "interviewFrequency": "high|medium|low",
  "realWorldScenario": "brief scenario description",
  "tags": ["${stack.id}", "topic1", "topic2"]
}
\`\`\`

---

## ✨ GENERATE NOW

Generate **${stack.questionCount.target}+ questions** that:

1. ✅ Follow Universal Content Philosophy (hand-crafted quality)
2. ✅ Use SEO Strategy (searchable, keyword-optimized)
3. ✅ Match Domain Definition (${domainConfig.domain.experienceLevel} experience)
4. ✅ Cover Stack Scope (all topics listed above)
5. ✅ Respect Exclusions (no overlap with other stacks)
6. ✅ Interview realistic (${domainConfig.domain.targetCompanies.join(', ')})

---

## 🎯 OUTPUT FORMAT

Return **ONLY** valid JSON array. No explanations. No markdown outside JSON. Just the array.

\`\`\`json
[
  {
    "id": "unique-slug",
    "title": "SEO-optimized title with keywords",
    "slug": "url-friendly-slug",
    "question": "Full question with context and scenario",
    "difficulty": "easy|medium|hard",
    "importance": "high|medium|low",
    "seoKeywords": ["keyword1", "keyword2", "keyword3"],
    "searchIntent": ["search query 1", "search query 2"],
    "layer": "surface|practical|internal|production",
    "interviewFrequency": "high|medium|low",
    "realWorldScenario": "scenario description",
    "tags": ["${stack.id}", "tag1", "tag2"]
  }
]
\`\`\`

**Generate ${stack.questionCount.target}+ hand-crafted, interview-realistic, SEO-optimized questions now.**
`;
}

/**
 * Generate questions for a stack using Claude API
 */
async function generateQuestionsForStack(
  domainPath: string,
  domainConfig: DomainConfig,
  stack: Stack
): Promise<any[]> {
  console.log(`\n📝 Generating questions for: ${stack.name}...`);

  const prompt = buildStackPrompt(domainPath, domainConfig, stack);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON (might be wrapped in markdown code blocks)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${questions.length} questions for ${stack.name}`);

    return questions;
  } catch (error) {
    console.error(`❌ Error generating questions for ${stack.name}:`, error);
    throw error;
  }
}

/**
 * Save questions to JSON file
 */
function saveQuestions(
  domainPath: string,
  stackId: string,
  questions: any[]
): void {
  const outputPath = `content/domains/${domainPath}/stacks/${stackId}/questions.json`;
  const fullPath = path.resolve(process.cwd(), outputPath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`💾 Saved to: ${outputPath}`);
}

/**
 * Main function - Generate questions for all stacks in a domain
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`
❌ Usage: npx tsx scripts/batchQuestionGenerator.ts <domain-path>

Examples:
  npx tsx scripts/batchQuestionGenerator.ts java/backend/1-3-years
  npx tsx scripts/batchQuestionGenerator.ts python/backend/1-3-years

This will generate questions for ALL stacks in the domain.
`);
    process.exit(1);
  }

  const domainPath = args[0];
  console.log(`\n🚀 Batch Question Generator`);
  console.log(`📂 Domain: ${domainPath}`);
  console.log(`\n⏳ Loading domain configuration...`);

  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable not set. Please set it to use Claude API.'
      );
    }

    // Load domain config
    const domainConfig = loadDomainConfig(domainPath);
    console.log(`✅ Loaded domain: ${domainConfig.domain.name}`);

    // Collect all stacks from all categories
    const allStacks: Stack[] = [];
    for (const categoryKey in domainConfig.stackCategories) {
      const category = domainConfig.stackCategories[categoryKey];
      allStacks.push(...category.stacks);
    }

    console.log(`\n📊 Found ${allStacks.length} stacks to process\n`);
    console.log(`${'='.repeat(70)}`);

    // Generate questions for each stack
    for (let i = 0; i < allStacks.length; i++) {
      const stack = allStacks[i];
      console.log(`\n[${i + 1}/${allStacks.length}] Processing: ${stack.name}`);
      console.log(`   Priority: ${stack.priority} | Frequency: ${stack.interviewFrequency}`);

      try {
        // Generate questions
        const questions = await generateQuestionsForStack(
          domainPath,
          domainConfig,
          stack
        );

        // Save to file
        saveQuestions(domainPath, stack.id, questions);

        console.log(`✅ Completed: ${stack.name}`);
      } catch (error) {
        console.error(`❌ Failed: ${stack.name}`);
        console.error(`   Error: ${error}`);
        // Continue with next stack
      }

      // Add delay to avoid rate limits (if needed)
      if (i < allStacks.length - 1) {
        console.log(`   ⏸️  Waiting 2s before next stack...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`\n✨ Batch generation complete!`);
    console.log(`📂 Check: content/domains/${domainPath}/stacks/*/questions.json`);
  } catch (error) {
    console.error(`\n❌ Error:`, error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { buildStackPrompt, generateQuestionsForStack, saveQuestions };