/**
 * INTELLIGENT QUESTION GENERATION SYSTEM
 *
 * This system understands domain hierarchies and prevents question overlap
 * by analyzing stack boundaries and dependencies.
 */

import * as fs from 'fs';
import * as path from 'path';

interface StackDefinition {
  id: string;
  name: string;
  priority: number;
  questionCount: number;
  coverage: string[];
  excludes?: string[];
  difficultyDistribution?: {
    [experienceLevel: string]: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
}

interface DomainCategory {
  description: string;
  stacks: StackDefinition[];
}

interface DomainConfig {
  domain: {
    id: string;
    name: string;
    description: string;
    experienceLevels: string[];
    targetRoles: string[];
  };
  stackHierarchy: {
    [category: string]: DomainCategory;
  };
  totalStacks: number;
  totalQuestions: number;
}

class IntelligentQuestionGenerator {
  private domainConfig: DomainConfig;
  private contentRoot: string;

  constructor(domainId: string) {
    this.contentRoot = path.join(process.cwd(), 'content');
    const configPath = path.join(this.contentRoot, 'domains', domainId, 'domain-config.json');

    if (!fs.existsSync(configPath)) {
      throw new Error(`Domain config not found: ${configPath}`);
    }

    this.domainConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  /**
   * Generate intelligent prompt for a specific stack
   */
  generatePrompt(stackId: string, experienceLevel: string = '1-3'): string {
    const stack = this.findStack(stackId);
    if (!stack) {
      throw new Error(`Stack not found: ${stackId}`);
    }

    const category = this.findCategoryForStack(stackId);
    const relatedStacks = this.getRelatedStacks(stackId);
    const difficultyDist = this.getDifficultyDistribution(stack, experienceLevel);

    return this.buildPrompt(stack, category, relatedStacks, difficultyDist, experienceLevel);
  }

  /**
   * Build comprehensive prompt with context awareness
   */
  private buildPrompt(
    stack: StackDefinition,
    category: string,
    relatedStacks: StackDefinition[],
    difficulty: { easy: number; medium: number; hard: number },
    experienceLevel: string
  ): string {
    const excludedTopics = this.buildExclusionList(stack, relatedStacks);

    return `
# INTELLIGENT QUESTION GENERATION FOR: ${stack.name}

## 🎯 CRITICAL CONTEXT

**Domain**: ${this.domainConfig.domain.name}
**Stack**: ${stack.name}
**Category**: ${category}
**Experience Level**: ${experienceLevel} years
**Target Question Count**: ${stack.questionCount}

## 📋 THIS STACK COVERS (ONLY THESE TOPICS):

${stack.coverage.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

## 🚫 CRITICAL: WHAT THIS STACK DOES NOT COVER

These topics are covered in OTHER stacks. DO NOT include questions about:

${excludedTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

## 🧠 SMART BOUNDARY ENFORCEMENT

**Why boundaries matter**:
- Questions about Spring features belong in Spring stacks, NOT Core Java
- Questions about testing belong in JUnit/Mockito stacks, NOT Core Java
- Questions about REST APIs belong in REST API stack, NOT Spring Boot
- Questions about database queries belong in SQL/JDBC stacks, NOT JPA

**Example of WRONG questions for Core Java**:
❌ "How do you create a REST endpoint in Spring?" (This is Spring REST stack)
❌ "Write a JUnit test for this method" (This is JUnit stack)
❌ "How does @Transactional work?" (This is Spring Data/JPA stack)

**Example of CORRECT questions for Core Java**:
✅ "Explain HashMap internal implementation"
✅ "What's the difference between synchronized and ReentrantLock?"
✅ "How does the Stream API work internally?"

## 📊 DIFFICULTY DISTRIBUTION

Generate exactly:
- **Easy**: ${difficulty.easy}% (${Math.round(stack.questionCount * difficulty.easy / 100)} questions)
- **Medium**: ${difficulty.medium}% (${Math.round(stack.questionCount * difficulty.medium / 100)} questions)
- **Hard**: ${difficulty.hard}% (${Math.round(stack.questionCount * difficulty.hard / 100)} questions)

## 🎨 QUESTION QUALITY REQUIREMENTS

### 1. Specificity
Each question must be:
- Specific to THIS stack's coverage areas
- Not generic or vague
- Testable in an interview (has clear right/wrong answers)

### 2. Real-World Focus
Questions should reflect:
- Actual interview questions from top companies
- Real debugging scenarios
- Production challenges
- Performance considerations

### 3. Depth Levels

**Easy** (for ${experienceLevel} years):
- Fundamental concepts within this stack
- Basic usage and syntax
- Common patterns

**Medium**:
- Internal workings and mechanisms
- Comparison between approaches
- Common pitfalls and debugging
- Production scenarios

**Hard**:
- Advanced optimizations
- Edge cases and corner scenarios
- Performance tuning
- Complex debugging scenarios

## 📝 OUTPUT FORMAT

Return ONLY valid JSON array:

\`\`\`json
[
  {
    "id": "unique-kebab-case-id",
    "title": "Clear, specific question title (6-12 words)",
    "slug": "url-friendly-slug",
    "question": "Full interview question with context (2-4 sentences)",
    "difficulty": "easy|medium|hard",
    "importance": "high|medium|low",
    "tags": ["${stack.id}", "tag1", "tag2", "tag3"]
  }
]
\`\`\`

## 🔍 VALIDATION CHECKLIST

Before finalizing each question, ask:
1. ✅ Is this SPECIFICALLY about ${stack.name}?
2. ✅ Is this NOT covered in: ${stack.excludes?.join(', ')}?
3. ✅ Does this reflect real interview scenarios?
4. ✅ Is the difficulty appropriate for ${experienceLevel} years experience?
5. ✅ Would a candidate need to know this for ${this.domainConfig.domain.name} role?

## 🚀 GENERATE ${stack.questionCount} QUESTIONS NOW

Return ONLY the JSON array. No explanations. No markdown outside the JSON block.
`.trim();
  }

  /**
   * Build comprehensive exclusion list from related stacks
   */
  private buildExclusionList(stack: StackDefinition, relatedStacks: StackDefinition[]): string[] {
    const exclusions: string[] = [];

    // Add explicit exclusions from stack config
    if (stack.excludes) {
      exclusions.push(...stack.excludes);
    }

    // Add coverage from related stacks as exclusions
    relatedStacks.forEach(related => {
      if (related.id !== stack.id) {
        exclusions.push(`${related.name} topics: ${related.coverage.slice(0, 3).join(', ')}`);
      }
    });

    return exclusions;
  }

  /**
   * Get related stacks (same category + dependencies)
   */
  private getRelatedStacks(stackId: string): StackDefinition[] {
    const category = this.findCategoryForStack(stackId);
    if (!category) return [];

    const categoryDef = this.domainConfig.stackHierarchy[category];
    return categoryDef.stacks;
  }

  /**
   * Find stack by ID across all categories
   */
  private findStack(stackId: string): StackDefinition | null {
    for (const category of Object.values(this.domainConfig.stackHierarchy)) {
      const stack = category.stacks.find(s => s.id === stackId);
      if (stack) return stack;
    }
    return null;
  }

  /**
   * Find category name for a stack
   */
  private findCategoryForStack(stackId: string): string {
    for (const [categoryName, category] of Object.entries(this.domainConfig.stackHierarchy)) {
      if (category.stacks.some(s => s.id === stackId)) {
        return categoryName;
      }
    }
    return 'unknown';
  }

  /**
   * Get difficulty distribution for experience level
   */
  private getDifficultyDistribution(stack: StackDefinition, experienceLevel: string): {
    easy: number;
    medium: number;
    hard: number;
  } {
    if (stack.difficultyDistribution && stack.difficultyDistribution[experienceLevel]) {
      return stack.difficultyDistribution[experienceLevel];
    }

    // Default distributions by experience
    const defaults: { [key: string]: { easy: number; medium: number; hard: number } } = {
      '0-1': { easy: 60, medium: 30, hard: 10 },
      '1-3': { easy: 20, medium: 60, hard: 20 },
      '3-5': { easy: 10, medium: 40, hard: 50 },
      '5+': { easy: 5, medium: 30, hard: 65 }
    };

    return defaults[experienceLevel] || defaults['1-3'];
  }

  /**
   * List all stacks in this domain
   */
  listAllStacks(): { category: string; stack: StackDefinition }[] {
    const result: { category: string; stack: StackDefinition }[] = [];

    for (const [categoryName, category] of Object.entries(this.domainConfig.stackHierarchy)) {
      category.stacks.forEach(stack => {
        result.push({ category: categoryName, stack });
      });
    }

    return result.sort((a, b) => a.stack.priority - b.stack.priority);
  }

  /**
   * Get domain summary
   */
  getDomainSummary(): string {
    const stacks = this.listAllStacks();

    let summary = `\n${'='.repeat(80)}\n`;
    summary += `DOMAIN: ${this.domainConfig.domain.name}\n`;
    summary += `${'='.repeat(80)}\n\n`;
    summary += `📊 Overview:\n`;
    summary += `   - Total Stacks: ${this.domainConfig.totalStacks}\n`;
    summary += `   - Total Questions: ${this.domainConfig.totalQuestions}\n`;
    summary += `   - Experience Levels: ${this.domainConfig.domain.experienceLevels.join(', ')}\n\n`;

    let currentCategory = '';
    stacks.forEach(({ category, stack }, index) => {
      if (category !== currentCategory) {
        currentCategory = category;
        summary += `\n📁 ${category.toUpperCase()}:\n`;
        summary += `   ${this.domainConfig.stackHierarchy[category].description}\n\n`;
      }

      summary += `   ${stack.priority}. ${stack.name} (${stack.questionCount}q)\n`;
      summary += `      Coverage: ${stack.coverage.slice(0, 2).join(', ')}...\n`;
    });

    summary += `\n${'='.repeat(80)}\n`;
    return summary;
  }

  /**
   * Save prompt to file for review/editing
   */
  savePrompt(stackId: string, experienceLevel: string = '1-3'): string {
    const prompt = this.generatePrompt(stackId, experienceLevel);
    const outputDir = path.join(this.contentRoot, 'questions', this.domainConfig.domain.id, stackId);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'generation-prompt.md');
    fs.writeFileSync(outputPath, prompt, 'utf-8');

    return outputPath;
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list') {
    // List all stacks in a domain
    const domainId = args[1] || 'java-backend';

    try {
      const generator = new IntelligentQuestionGenerator(domainId);
      console.log(generator.getDomainSummary());
    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }

  } else if (command === 'generate') {
    // Generate prompt for a specific stack
    const domainId = args[1];
    const stackId = args[2];
    const experienceLevel = args[3] || '1-3';

    if (!domainId || !stackId) {
      console.log('\n📝 Intelligent Question Generator\n');
      console.log('Usage:');
      console.log('  npx tsx scripts/intelligentQuestionGenerator.ts list <domain-id>');
      console.log('  npx tsx scripts/intelligentQuestionGenerator.ts generate <domain-id> <stack-id> [experience-level]\n');
      console.log('Examples:');
      console.log('  npx tsx scripts/intelligentQuestionGenerator.ts list java-backend');
      console.log('  npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend core-java 1-3\n');
      process.exit(1);
    }

    try {
      const generator = new IntelligentQuestionGenerator(domainId);
      const promptPath = generator.savePrompt(stackId, experienceLevel);

      console.log(`\n✅ Prompt generated and saved to:\n   ${promptPath}\n`);
      console.log('📋 Next steps:');
      console.log('   1. Review the prompt (optional)');
      console.log('   2. Copy the prompt to Claude');
      console.log('   3. Get JSON response');
      console.log('   4. Save to content/questions/{domain}/{stack}/questions.json\n');

      // Also output the prompt
      const prompt = generator.generatePrompt(stackId, experienceLevel);
      console.log('\n' + '='.repeat(80));
      console.log('PROMPT TO COPY TO CLAUDE:');
      console.log('='.repeat(80) + '\n');
      console.log(prompt);
      console.log('\n' + '='.repeat(80) + '\n');

    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }

  } else {
    console.log('\n📝 Intelligent Question Generator\n');
    console.log('Commands:');
    console.log('  list <domain-id>                              List all stacks in domain');
    console.log('  generate <domain-id> <stack-id> [exp-level]   Generate prompt for stack\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/intelligentQuestionGenerator.ts list java-backend');
    console.log('  npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend spring-boot 1-3\n');
  }
}

export { IntelligentQuestionGenerator };
