/**
 * MASTER QUESTION GENERATOR
 *
 * Uses the Universal Content Philosophy to generate questions
 * for ANY domain following the same high-quality standards
 */

import * as fs from 'fs';
import * as path from 'path';

interface MasterPhilosophy {
  principles: {
    interviewRealism: any;
    seoOptimization: any;
    depthHierarchy: any;
    zerOverlap: any;
    answerExcellence: any;
    progressiveDifficulty: any;
    contentFreshness: any;
  };
  qualityChecklist: string[];
  layerDistribution: { [key: string]: number };
}

interface DomainConfig {
  domain: any;
  stackCategories: any;
}

interface StackConfig {
  id: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  questionCount: any;
  coverage: any[];
  excludes: string[];
  difficultyDistribution?: any;
}

class MasterQuestionGenerator {
  private philosophy: MasterPhilosophy;
  private contentRoot: string;

  constructor() {
    this.contentRoot = path.join(process.cwd(), 'content');
    this.philosophy = this.loadPhilosophy();
  }

  /**
   * Load master philosophy
   */
  private loadPhilosophy(): MasterPhilosophy {
    // Hard-coded principles from MASTER_CONTENT_PHILOSOPHY.md
    return {
      principles: {
        interviewRealism: {
          test: "Has this been asked at FAANG/top startups?"
        },
        seoOptimization: {
          template: "[Primary Keyword] vs [Alternative] - [Context]",
          density: "Title contains primary keyword"
        },
        depthHierarchy: {
          layers: {
            surface: 15,
            practical: 40,
            internal: 30,
            production: 15
          }
        },
        zeroOverlap: {
          rule: "Each topic owned by exactly ONE stack"
        },
        answerExcellence: {
          structure: [
            "Quick Answer",
            "Interviewer Expectation",
            "Core Concept",
            "Real-World Scenario",
            "Code Example",
            "Common Mistakes",
            "Follow-Up Questions"
          ]
        },
        progressiveDifficulty: {
          "0-1": { easy: 60, medium: 30, hard: 10 },
          "1-3": { easy: 20, medium: 60, hard: 20 },
          "3-5": { easy: 10, medium: 40, hard: 50 },
          "5+": { easy: 5, medium: 30, hard: 65 }
        },
        contentFreshness: {
          reviewFrequency: "quarterly"
        }
      },
      qualityChecklist: [
        "FAANG interview realistic?",
        "Title contains SEO keywords?",
        "Within stack boundaries?",
        "Tests real job skills?",
        "Correct difficulty level?",
        "Clear context and scenario?"
      ],
      layerDistribution: {
        surface: 15,
        practical: 40,
        internal: 30,
        production: 15
      }
    };
  }

  /**
   * Generate master prompt for ANY stack in ANY domain
   */
  generateMasterPrompt(domainId: string, stackId: string, experienceLevel: string = '1-3'): string {
    const domainConfig = this.loadDomainConfig(domainId);
    const stackConfig = this.findStack(domainConfig, stackId);

    if (!stackConfig) {
      throw new Error(`Stack ${stackId} not found in domain ${domainId}`);
    }

    const difficulty = this.getDifficultyDistribution(stackConfig, experienceLevel);
    const layerCounts = this.calculateLayerCounts(stackConfig.questionCount.target);

    return this.buildMasterPrompt(domainConfig, stackConfig, experienceLevel, difficulty, layerCounts);
  }

  /**
   * Build prompt using universal template
   */
  private buildMasterPrompt(
    domain: DomainConfig,
    stack: StackConfig,
    experienceLevel: string,
    difficulty: { easy: number; medium: number; hard: number },
    layerCounts: { [key: string]: number }
  ): string {
    const targetCount = stack.questionCount.target;
    const easyCount = Math.round((targetCount * difficulty.easy) / 100);
    const mediumCount = Math.round((targetCount * difficulty.medium) / 100);
    const hardCount = Math.round((targetCount * difficulty.hard) / 100);

    // Build coverage list with SEO
    const coverageList = stack.coverage
      .map(c => `- **${c.topic}**: ${c.subtopics.join(', ')} [Keywords: ${c.seoKeywords.join(', ')}]`)
      .join('\n');

    // Build exclusion list
    const exclusionList = stack.excludes
      .map((ex, i) => `${i + 1}. ${ex} → Covered in different stack`)
      .join('\n');

    // Get SEO keywords
    const primaryKeywords = stack.seoKeywords.slice(0, 3).join(', ');
    const secondaryKeywords = stack.coverage
      .flatMap(c => c.seoKeywords)
      .slice(0, 5)
      .join(', ');

    return `
# 🎯 MASTER INTERVIEW QUESTION GENERATION
## Powered by Universal Content Philosophy v1.0

### Domain: ${domain.domain.name}
### Stack: ${stack.name}
### Experience Level: ${experienceLevel} years
### Quality Standard: Hand-Crafted Excellence

---

## ⚡ YOUR MISSION

Generate **${targetCount}+ interview questions** that:

✅ **Feel hand-crafted** by a senior engineer with 10+ years at top companies
✅ **Actually asked** at Google, Amazon, Meta, Microsoft, top startups
✅ **SEO-optimized** to rank #1 for target search queries
✅ **Complete coverage** of every topic in this stack (no gaps)
✅ **Zero overlap** with topics owned by other stacks
✅ **Production-ready** scenarios, not textbook theory

**The Goal**: Create the BEST ${stack.name} interview resource on the internet.

---

## 📋 STACK SCOPE

### ✅ THIS STACK COVERS (EXACTLY):

${coverageList}

### ❌ THIS STACK DOES NOT COVER (STRICTLY):

${exclusionList}

**Critical**: If a question touches excluded topics, only MENTION them, don't EXPLAIN them.

---

## 🎯 SEO TARGET KEYWORDS

**Primary Keywords**: ${primaryKeywords}
**Secondary Keywords**: ${secondaryKeywords}

**Search Intents to Target**:
- "best ${stack.seoKeywords[0]}"
- "${stack.seoKeywords[0]} interview questions"
- "how to prepare ${stack.seoKeywords[0]}"
- "${stack.seoKeywords[0]} real interview"

**Rule**: Every question title MUST contain at least ONE primary/secondary keyword naturally.

---

## 📊 QUESTION DISTRIBUTION

**Target**: ${targetCount}+ questions (**Generate MORE if needed for complete coverage**)

### By Learning Layer (Philosophy: The Onion Model):
- 📖 **Surface Level** (${layerCounts.surface} questions): What it is, basic concepts
- 🔧 **Practical Usage** (${layerCounts.practical} questions): How to use, common patterns
- 🧠 **Internal Mechanisms** (${layerCounts.internal} questions): How it works internally
- 🚀 **Production Mastery** (${layerCounts.production} questions): Edge cases, optimization, debugging

### By Difficulty (${experienceLevel} years experience):
- 🟢 **Easy**: ${easyCount} questions (${difficulty.easy}%)
- 🟡 **Medium**: ${mediumCount} questions (${difficulty.medium}%)
- 🔴 **Hard**: ${hardCount} questions (${difficulty.hard}%)

---

## 💎 QUESTION QUALITY TEMPLATE

Each question MUST follow this exact structure:

\`\`\`json
{
  "id": "seo-optimized-unique-slug",
  "title": "[Primary Keyword] - [Specific Context/Scenario]",
  "slug": "primary-keyword-specific-context",
  "question": "[3-5 sentences with: scenario/context + specific ask + constraints/requirements]",
  "difficulty": "easy|medium|hard",
  "importance": "high|medium|low",
  "seoKeywords": ["primary-keyword", "secondary-keyword", "long-tail-variation"],
  "searchIntent": ["exact search query 1", "exact search query 2"],
  "layer": "surface|practical|internal|production",
  "experienceLevel": "${experienceLevel}",
  "estimatedAnswerTime": "2-3min|5-7min|10+min",
  "tags": ["${stack.id}", "topic1", "topic2"]
}
\`\`\`

---

## 🌟 EXAMPLES OF EXCELLENCE vs POOR QUALITY

### ❌ POOR (AI Dump):
{
  "title": "What is ${stack.name}?",
  "question": "Explain ${stack.name}."
}
**Why Bad**: Vague, no context, no SEO, feels generic

### ✅ EXCELLENT (Hand-Crafted):
{
  "title": "${stack.seoKeywords[0]} Performance Debugging in Production Systems",
  "question": "You're on-call and receive alerts that your ${stack.name} application has 3000ms p99 latency (normally 200ms). CPU is at 40%, memory stable, but user requests are timing out. Walk through your systematic debugging approach, covering profiling tools, common bottlenecks in ${stack.name}, and how you'd identify if it's network, compute, or external dependency issues.",
  "difficulty": "hard",
  "layer": "production",
  "seoKeywords": ["${stack.seoKeywords[0]} performance", "debugging ${stack.name}", "production latency"],
  "searchIntent": ["${stack.name} slow production", "debug ${stack.name} latency"]
}
**Why Good**: Real scenario, specific numbers, systematic approach, production context, SEO optimized

---

## 🚫 ANTI-PATTERNS TO AVOID

### ❌ Generic Questions:
- "What is X?" → Add context: "When designing Y system, how does X help vs Z?"

### ❌ Textbook Definitions:
- "Explain polymorphism" → Real scenario: "Your API returns different object types. How do you design polymorphic responses?"

### ❌ Out of Scope:
- Don't explain topics from excluded list → Only mention and link

### ❌ No Context:
- "How does X work?" → "In production with 1M users, X fails. How does X work and why might it fail?"

### ❌ AI-Generated Feel:
- Avoid: "It's important to note...", "In conclusion...", "As we know..."
- Use: Specific numbers, war stories, trade-offs, gotchas

---

## 🎯 QUALITY VALIDATION (Every Question Must Pass)

Before including ANY question, verify:

1. ✅ **Realism**: Would Google/Meta interviewer actually ask this?
2. ✅ **SEO**: Does title contain primary/secondary keyword naturally?
3. ✅ **Boundaries**: Is this topic owned by THIS stack (not excluded)?
4. ✅ **Depth**: Does it match the layer (surface/practical/internal/production)?
5. ✅ **Difficulty**: Appropriate for ${experienceLevel} years experience?
6. ✅ **Scenario**: Does it have real-world context (not just "explain X")?
7. ✅ **Completeness**: Is the question clear enough to answer without guessing?

**If any answer is NO → Rewrite the question**

---

## 💡 EXAMPLES BY LAYER

### 🟢 Surface Level (Easy):
"${stack.seoKeywords[0]} vs [Alternative] - When to Use Each"
- Clear comparison, basic trade-offs, syntax/usage

### 🟡 Practical Usage (Medium):
"Building [Real Feature] with ${stack.name} - Best Practices"
- How to use in production, common patterns, configuration

### 🟠 Internal Mechanisms (Medium-Hard):
"How ${stack.name} Handles [Core Process] Internally"
- Under-the-hood mechanics, performance implications

### 🔴 Production Mastery (Hard):
"Debugging ${stack.name} Memory Leak in 10M Request/Day System"
- Complex debugging, edge cases, optimization, scaling

---

## 📝 COVERAGE CHECKLIST

Ensure questions cover ALL topics in stack scope:

${stack.coverage.map(c => `- [ ] ${c.topic} (${c.subtopics.length} subtopics)`).join('\n')}

**No gaps allowed.** If a topic lacks questions, generate more.

---

## ✨ GENERATE NOW

**Generate ${targetCount}+ questions** following:

1. ✅ Universal Content Philosophy
2. ✅ SEO optimization (keywords in titles)
3. ✅ Layer distribution (${layerCounts.surface}/${layerCounts.practical}/${layerCounts.internal}/${layerCounts.production})
4. ✅ Difficulty distribution (${easyCount}/${mediumCount}/${hardCount})
5. ✅ Zero overlap with excluded topics
6. ✅ Real interview scenarios with context
7. ✅ Hand-crafted quality (not AI dump)

---

## 🎯 OUTPUT FORMAT

Return **ONLY** valid JSON array:

\`\`\`json
[
  {
    "id": "unique-slug",
    "title": "SEO-optimized title with keywords",
    "slug": "url-friendly-slug",
    "question": "Full question with context",
    "difficulty": "easy|medium|hard",
    "importance": "high|medium|low",
    "seoKeywords": ["keyword1", "keyword2", "keyword3"],
    "searchIntent": ["search query 1", "search query 2"],
    "layer": "surface|practical|internal|production",
    "experienceLevel": "${experienceLevel}",
    "estimatedAnswerTime": "time",
    "tags": ["${stack.id}", "tag1", "tag2"]
  }
]
\`\`\`

**No explanations. No markdown outside JSON. Just the array.**

---

**Generate ${targetCount}+ high-quality questions now.**
`.trim();
  }

  /**
   * Calculate layer-based question counts
   */
  private calculateLayerCounts(totalQuestions: number): { [key: string]: number } {
    return {
      surface: Math.round(totalQuestions * 0.15),
      practical: Math.round(totalQuestions * 0.40),
      internal: Math.round(totalQuestions * 0.30),
      production: Math.round(totalQuestions * 0.15)
    };
  }

  /**
   * Get difficulty distribution
   */
  private getDifficultyDistribution(stack: StackConfig, experienceLevel: string): any {
    if (stack.difficultyDistribution && stack.difficultyDistribution[experienceLevel]) {
      return stack.difficultyDistribution[experienceLevel];
    }
    return this.philosophy.principles.progressiveDifficulty[experienceLevel];
  }

  /**
   * Load domain config
   */
  private loadDomainConfig(domainId: string): DomainConfig {
    const configPath = path.join(this.contentRoot, 'domains', domainId, 'domain-config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error(`Domain config not found: ${configPath}`);
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  /**
   * Find stack in domain config
   */
  private findStack(domain: DomainConfig, stackId: string): StackConfig | null {
    for (const category of Object.values(domain.stackCategories)) {
      const stack = category.stacks.find((s: any) => s.id === stackId);
      if (stack) return stack;
    }
    return null;
  }

  /**
   * Save prompt
   */
  savePrompt(domainId: string, stackId: string, experienceLevel: string = '1-3'): string {
    const prompt = this.generateMasterPrompt(domainId, stackId, experienceLevel);
    const outputDir = path.join(this.contentRoot, 'questions', domainId, stackId);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'master-prompt.md');
    fs.writeFileSync(outputPath, prompt, 'utf-8');

    return outputPath;
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'generate') {
    const domainId = args[1];
    const stackId = args[2];
    const experienceLevel = args[3] || '1-3';

    if (!domainId || !stackId) {
      console.log('\n🎯 Master Question Generator (Universal Philosophy)\n');
      console.log('Usage: npx tsx scripts/masterQuestionGenerator.ts generate <domain> <stack> [exp-level]\n');
      console.log('Examples:');
      console.log('  npx tsx scripts/masterQuestionGenerator.ts generate java-backend spring-boot 1-3');
      console.log('  npx tsx scripts/masterQuestionGenerator.ts generate python-backend django 3-5\n');
      process.exit(1);
    }

    try {
      const generator = new MasterQuestionGenerator();
      const promptPath = generator.savePrompt(domainId, stackId, experienceLevel);

      console.log(`\n✅ Master prompt generated:\n   ${promptPath}\n`);
      console.log('📋 This prompt follows Universal Content Philosophy for:');
      console.log('   ✅ Hand-crafted quality (not AI dump)');
      console.log('   ✅ SEO optimization');
      console.log('   ✅ Interview realism');
      console.log('   ✅ Zero overlap enforcement');
      console.log('   ✅ Complete coverage\n');

      // Output prompt
      const prompt = generator.generateMasterPrompt(domainId, stackId, experienceLevel);
      console.log('='.repeat(80));
      console.log('COPY THIS PROMPT TO CLAUDE:');
      console.log('='.repeat(80) + '\n');
      console.log(prompt);
      console.log('\n' + '='.repeat(80) + '\n');

    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }

  } else {
    console.log('\n🎯 Master Question Generator\n');
    console.log('Commands:');
    console.log('  generate <domain> <stack> [exp]   Generate universal quality prompt\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/masterQuestionGenerator.ts generate java-backend spring-boot 1-3\n');
  }
}

export { MasterQuestionGenerator };