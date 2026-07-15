/**
 * PHASE 1: GENERATE QUESTIONS ONLY
 *
 * This generates ONLY question titles and question text
 * Answers, explanations, code examples added later in Phase 2
 */

import { ROLE_PROFILES, EXPERIENCE_LEVELS } from '../questionGenerationSystem';

interface QuestionOnly {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'low' | 'medium' | 'high';
  tags: string[];
  // These will be added in Phase 2
  answer?: null;
  explanation?: null;
  codeExample?: null;
  keywords?: null;
}

function generateQuestionOnlyPrompt(config: {
  domain: string;
  stack: string;
  role: string;
  experienceLevel: string;
  companyType: string;
  count: number;
}): string {
  const roleProfile = ROLE_PROFILES[config.role];
  const expLevel = EXPERIENCE_LEVELS[config.experienceLevel];

  if (!roleProfile || !expLevel) {
    throw new Error('Invalid role or experience level');
  }

  return `
# Generate Interview Questions (Questions ONLY - No Answers Yet)

## Context
Position: **${roleProfile.name}** at **${config.companyType}** company
Domain: **${config.domain}**
Stack: **${config.stack}**
Experience Level: **${expLevel.name}** (${expLevel.yearsOfExperience})

## Role Reality Check:
What they do daily:
${roleProfile.dailyTasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Real scenarios they face:
${roleProfile.realWorldScenarios.slice(0, 3).map((s, i) => `${i + 1}. ${s}`).join('\n')}

Interview focus areas:
${roleProfile.interviewFocus.slice(0, 5).join(', ')}

## Task
Generate **${config.count} interview questions** (QUESTIONS ONLY - we'll add answers later)

### Quality Requirements:
1. **REALISTIC**: Actually asked in real ${config.companyType} interviews
2. **ROLE-SPECIFIC**: What a ${roleProfile.name} needs to know
3. **LEVEL-APPROPRIATE**: Right for ${expLevel.name} (${expLevel.yearsOfExperience})
4. **CLEAR & SPECIFIC**: Candidate knows exactly what to explain
5. **TESTABLE**: Has a clear right/wrong answer
6. **PRACTICAL**: Not theoretical trivia

### Question Mix:
- 30% Fundamentals (core concepts they must know)
- 40% Practical (real work scenarios)
- 20% Problem Solving (debugging, optimization)
- 10% Best Practices (production, code quality)

### Difficulty Distribution:
- ${expLevel.id === 'junior' ? '60% easy, 30% medium, 10% hard' : ''}
- ${expLevel.id === 'mid-level' ? '20% easy, 60% medium, 20% hard' : ''}
- ${expLevel.id === 'senior' ? '10% easy, 40% medium, 50% hard' : ''}
- ${expLevel.id === 'staff-principal' ? '0% easy, 30% medium, 70% hard' : ''}

## Output Format (JSON Array):

\`\`\`json
[
  {
    "id": "unique-slug-id",
    "title": "Clear, specific title (6-10 words)",
    "slug": "url-friendly-slug",
    "question": "The interview question (2-4 sentences with clear context)",
    "difficulty": "easy|medium|hard",
    "importance": "high|medium|low",
    "tags": ["${config.domain}", "${config.stack}", "specific-tag-1", "specific-tag-2"]
  }
]
\`\`\`

## Examples for ${roleProfile.name}:

**Good Question Examples:**

1. **Fundamental (Easy/Medium):**
   Title: "Explain the difference between ${config.stack} concept A and B"
   Question: "What are the key differences between A and B in ${config.stack}? When would you use each one?"

2. **Practical (Medium):**
   Title: "Debug slow ${config.stack} performance"
   Question: "You notice ${config.stack} application is running slow in production. Walk me through your debugging process step by step."

3. **Problem Solving (Medium/Hard):**
   Title: "Optimize ${config.stack} for high traffic"
   Question: "Your ${config.stack} service needs to handle 1000 requests/second. Currently it handles 50. What changes would you make?"

4. **Best Practices (Medium):**
   Title: "${config.stack} error handling patterns"
   Question: "What's your approach to error handling in ${config.stack}? Give specific examples of how you handle different error types."

## What Makes a GOOD Question:

✅ Specific to the stack (mentions ${config.stack} features/concepts)
✅ Has clear context (explains the scenario)
✅ Tests practical knowledge (not trivia)
✅ Can be answered in 2-5 minutes
✅ Has a definitive good/bad answer
✅ Relates to daily work of ${roleProfile.name}

## What Makes a BAD Question:

❌ Too vague: "Explain ${config.stack}" (what about it?)
❌ Trivia: "When was ${config.stack} created?" (doesn't test skill)
❌ Too broad: "Design Facebook" (takes hours, not specific)
❌ Not role-relevant: Asking ${roleProfile.name} about unrelated tech

## Important Rules:

1. Each question must be **standalone** (not dependent on previous questions)
2. Questions should **progressively get harder** throughout the list
3. Mix of **conceptual** (30%), **implementation** (40%), **debugging** (20%), **best practices** (10%)
4. Use **real terminology** from ${config.stack} (no generic placeholders)
5. **No duplicate** or very similar questions

## Generate ${config.count} Questions Now

Return ONLY the JSON array. No other text.
`.trim();
}

// Export for use
export { generateQuestionOnlyPrompt, QuestionOnly };

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('\n📚 Question Generator - Phase 1\n');
    console.log('Usage: npx tsx scripts/generators/generateQuestionsOnly.ts <domain> <stack> [type]\n');
    console.log('Stack Types (determines question count):');
    console.log('  core         - 50 questions (fundamental topics)');
    console.log('  framework    - 40 questions (popular frameworks) [default]');
    console.log('  specialized  - 35 questions (advanced topics)');
    console.log('  niche        - 30 questions (specific tools)\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/generators/generateQuestionsOnly.ts "Java Backend" "Core Java" core');
    console.log('  npx tsx scripts/generators/generateQuestionsOnly.ts "React" "Hooks" framework');
    console.log('  npx tsx scripts/generators/generateQuestionsOnly.ts "AWS" "CloudFormation" niche\n');
    process.exit(1);
  }

  const domain = args[0];
  const stack = args[1];

  console.log('\n' + '='.repeat(80));
  console.log('PHASE 1: QUESTION GENERATION (Questions Only)');
  console.log('='.repeat(80));
  console.log(`\nDomain: ${domain}`);
  console.log(`Stack: ${stack}`);

  // Smart question count based on stack type
  const stackType = args[2] || 'framework'; // core, framework, specialized, niche
  const questionCount = {
    'core': 50,
    'framework': 40,
    'specialized': 35,
    'niche': 30
  }[stackType] || 40;

  console.log(`Stack Type: ${stackType} → ${questionCount} questions\n`);

  const prompt = generateQuestionOnlyPrompt({
    domain,
    stack,
    role: 'backend-engineer',
    experienceLevel: 'mid-level',
    companyType: 'startup',
    count: questionCount
  });

  console.log('COPY THIS PROMPT TO CLAUDE:\n');
  console.log('-'.repeat(80));
  console.log(prompt);
  console.log('-'.repeat(80));
  console.log('\nClaude will return 40 questions in JSON format.');
  console.log('Save the output to: data/questions/{domain}/{stack}/questions.json\n');
}