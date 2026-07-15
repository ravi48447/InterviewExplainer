/**
 * DOMAIN-AWARE QUESTION GENERATOR
 *
 * Connects ALL three layers:
 * 1. MASTER_CONTENT_PHILOSOPHY.md (universal principles)
 * 2. domain-definition.md (experience-level specialization)
 * 3. domain-config.json (stack definitions)
 */

import * as fs from 'fs';
import * as path from 'path';

interface DomainConfig {
  domain: any;
  interviewFocus: any;
  stackCategories: any;
  difficultyDistribution: any;
}

interface StackConfig {
  id: string;
  name: string;
  priority: number;
  interviewFrequency: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  questionCount: any;
  coverage: any[];
  excludes?: string[];
  relatedStacks?: string[];
  prerequisites?: string[];
}

class DomainAwareGenerator {
  private contentRoot: string;
  private philosophy: any;

  constructor() {
    this.contentRoot = path.join(process.cwd(), 'content');
    this.philosophy = this.loadPhilosophy();
  }

  /**
   * Load master philosophy principles
   */
  private loadPhilosophy(): any {
    return {
      principles: {
        layerDistribution: { surface: 15, practical: 40, internal: 30, production: 15 },
        seoFirst: true,
        interviewRealistic: true,
        zeroOverlap: true,
        handCraftedQuality: true
      }
    };
  }

  /**
   * Load domain definition (experience-level specialization)
   */
  private loadDomainDefinition(domainId: string): string {
    const defPath = path.join(this.contentRoot, 'domains', domainId, 'domain-definition.md');
    if (fs.existsSync(defPath)) {
      return fs.readFileSync(defPath, 'utf-8');
    }
    return '';
  }

  /**
   * Load domain config (stack definitions)
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
  private findStack(config: DomainConfig, stackId: string): StackConfig | null {
    for (const category of Object.values(config.stackCategories)) {
      if (category.stacks) {
        const stack = category.stacks.find((s: any) => s.id === stackId);
        if (stack) return stack;
      }
    }
    return null;
  }

  /**
   * Generate comprehensive prompt using all layers
   */
  generatePrompt(domainId: string, stackId: string): string {
    const domainDef = this.loadDomainDefinition(domainId);
    const domainConfig = this.loadDomainConfig(domainId);
    const stack = this.findStack(domainConfig, stackId);

    if (!stack) {
      throw new Error(`Stack ${stackId} not found in ${domainId}`);
    }

    // Extract key insights from domain definition
    const experienceLevel = domainConfig.domain.experienceLevel || '1-3 years';
    const targetRole = domainConfig.domain.targetRoles?.[0] || 'Backend Engineer';
    const targetCompanies = domainConfig.domain.targetCompanies?.join(', ') || 'startups and product companies';

    // Calculate counts
    const targetCount = stack.questionCount?.target || 40;
    const layerCounts = this.calculateLayerCounts(targetCount);
    const difficultyCounts = this.calculateDifficultyCounts(targetCount, domainConfig.difficultyDistribution);

    return this.buildPrompt({
      domainConfig,
      stack,
      experienceLevel,
      targetRole,
      targetCompanies,
      targetCount,
      layerCounts,
      difficultyCounts,
      domainDef
    });
  }

  /**
   * Calculate layer-based counts
   */
  private calculateLayerCounts(total: number) {
    return {
      surface: Math.round(total * 0.15),
      practical: Math.round(total * 0.40),
      internal: Math.round(total * 0.30),
      production: Math.round(total * 0.15)
    };
  }

  /**
   * Calculate difficulty counts
   */
  private calculateDifficultyCounts(total: number, distribution: any) {
    return {
      easy: Math.round(total * distribution.easy / 100),
      medium: Math.round(total * distribution.medium / 100),
      hard: Math.round(total * distribution.hard / 100)
    };
  }

  /**
   * Build the comprehensive prompt
   */
  private buildPrompt(context: any): string {
    const { domainConfig, stack, experienceLevel, targetRole, targetCompanies, targetCount, layerCounts, difficultyCounts } = context;

    // Build coverage list
    const coverageList = stack.coverage?.map((c: any) =>
      `### ${c.topic}\n${c.subtopics.map((st: string) => `- ${st}`).join('\n')}\n**SEO Keywords**: ${c.seoKeywords.join(', ')}\n**Layer**: ${c.layer}`
    ).join('\n\n') || '';

    // Build exclusion list
    const exclusionList = stack.excludes?.map((ex: string, i: number) =>
      `${i + 1}. ❌ ${ex}`
    ).join('\n') || 'None specified';

    return `
# 🎯 DOMAIN-AWARE QUESTION GENERATION
## Powered by Universal Content Philosophy v1.0
### Specialized for: ${domainConfig.domain.name}

---

## 📊 CONTEXT AWARENESS

**Domain**: ${domainConfig.domain.name}
**Experience Level**: ${experienceLevel}
**Target Role**: ${targetRole}
**Stack**: ${stack.name}
**Interview Frequency**: ${stack.interviewFrequency} of interviews ask this
**Target Companies**: ${targetCompanies}

---

## 🎯 YOUR SPECIALIZED MISSION

You are generating questions for **${experienceLevel} ${targetRole}** preparing for interviews at **${targetCompanies}**.

These engineers:
- Have 1-3 years professional experience
- Work on practical backend systems daily
- Are tested on hands-on skills, not just theory
- Need to pass coding rounds + framework knowledge rounds

**Generate ${targetCount}+ questions that feel:**
✅ Hand-crafted by a senior engineer who interviews candidates
✅ Actually asked at real ${targetCompanies} interviews
✅ Appropriate difficulty for ${experienceLevel} experience
✅ Focused on practical skills they use daily
✅ SEO-optimized to help candidates find this content
✅ Zero overlap with topics covered in other stacks

---

## 📚 STACK SCOPE (EXACTLY WHAT TO COVER)

${coverageList}

---

## 🚫 CRITICAL: WHAT THIS STACK DOES NOT COVER

${exclusionList}

**Rule**: If you mention excluded topics, only REFERENCE them, don't EXPLAIN them.

Example:
✅ "Spring Security can be integrated for authentication" (reference only)
❌ "Spring Security uses filters to..." (explaining - NOT allowed)

---

## 🎯 SEO OPTIMIZATION (CRITICAL FOR DISCOVERY)

**Primary Keywords**: ${stack.seoKeywords?.slice(0, 3).join(', ') || 'Not specified'}
**Secondary Keywords**: ${stack.coverage?.flatMap((c: any) => c.seoKeywords).slice(0, 5).join(', ') || ''}

**Every question title MUST:**
1. Contain at least ONE primary or secondary keyword
2. Be searchable (how candidates actually search)
3. Be specific (not generic like "Explain X")

**Good Title Examples**:
- "Spring Boot @Autowired vs Constructor Injection - When to Use Each"
- "Debugging N+1 Query Problem in JPA Hibernate"
- "REST API Error Handling Best Practices - Status Codes & Responses"

**Bad Title Examples**:
- "Explain Spring Boot" (too generic, no keywords)
- "Question about dependency injection" (vague)
- "What is JPA?" (not searchable)

---

## 📊 QUESTION DISTRIBUTION (STRICT REQUIREMENTS)

**Total Target**: ${targetCount}+ questions (generate MORE if needed for complete coverage)

### By Learning Layer:
- 📖 **Surface Level** (${layerCounts.surface} questions): What it is, basic usage
  - Example: "What is @RestController in Spring Boot?"

- 🔧 **Practical Usage** (${layerCounts.practical} questions): How to use in real projects
  - Example: "How do you validate request body in Spring Boot controller?"

- 🧠 **Internal Mechanisms** (${layerCounts.internal} questions): How it works under the hood
  - Example: "Explain how Spring Boot auto-configuration resolves dependencies"

- 🚀 **Production Mastery** (${layerCounts.production} questions): Debugging, optimization, real issues
  - Example: "Your Spring Boot app has memory leak. Walk through debugging approach."

### By Difficulty (${experienceLevel} level):
- 🟢 **Easy**: ${difficultyCounts.easy} questions (${domainConfig.difficultyDistribution.easy}%)
  - Recall, basic concepts, syntax
  - 2-3 minute answers

- 🟡 **Medium**: ${difficultyCounts.medium} questions (${domainConfig.difficultyDistribution.medium}%)
  - Application, comparison, trade-offs
  - 5-7 minute answers

- 🔴 **Hard**: ${difficultyCounts.hard} questions (${domainConfig.difficultyDistribution.hard}%)
  - Complex scenarios, debugging, optimization
  - 10+ minute answers

---

## 💎 QUESTION QUALITY TEMPLATE

**Each question MUST follow this EXACT format:**

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

## 🌟 EXAMPLES: GOOD vs BAD

### ❌ BAD (Generic, AI-dump feeling):
\`\`\`json
{
  "title": "What is Spring Boot?",
  "question": "Explain Spring Boot.",
  "difficulty": "easy"
}
\`\`\`
**Why Bad**: Too vague, no context, no SEO, feels textbook

---

### ✅ EXCELLENT (Hand-crafted, SEO-optimized):
\`\`\`json
{
  "id": "spring-boot-autowired-vs-constructor-injection",
  "title": "Spring Boot @Autowired vs Constructor Injection - Best Practices",
  "slug": "autowired-vs-constructor-injection",
  "question": "You're reviewing a Spring Boot codebase where services use @Autowired field injection. A senior engineer suggests switching to constructor injection. Explain the differences between @Autowired field injection and constructor injection, why constructor injection is preferred, and when you might still use @Autowired.",
  "difficulty": "medium",
  "importance": "high",
  "seoKeywords": ["spring boot autowired", "constructor injection spring", "dependency injection best practices"],
  "searchIntent": ["autowired vs constructor injection", "spring boot dependency injection"],
  "layer": "practical",
  "interviewFrequency": "high",
  "realWorldScenario": "Code review feedback about injection patterns",
  "tags": ["spring-boot-basics", "dependency-injection", "best-practices"]
}
\`\`\`
**Why Good**: Specific scenario, SEO keywords, practical context, appropriate difficulty

---

## 🎨 EXPERIENCE-LEVEL APPROPRIATENESS

**For ${experienceLevel} engineers, questions should:**

✅ **DO**:
- Focus on practical usage they do daily
- Test framework knowledge, not just theory
- Include common debugging scenarios
- Reflect what ${targetCompanies} actually ask
- Be about tools they use (Spring Boot, JPA, REST APIs)

❌ **DON'T**:
- Ask about advanced architecture (that's 5+ years)
- Deep JVM internals (that's senior level)
- Distributed systems patterns (that's staff level)
- Leadership questions (that's management track)

**Difficulty Calibration**:
- Easy: Things they learned in first 6 months
- Medium: Things they use daily after 1-2 years
- Hard: Complex scenarios they've seen in production

---

## 🚫 ANTI-PATTERNS TO AVOID

### ❌ Out of Scope:
- Don't explain Spring Security internals (separate stack)
- Don't explain microservices patterns (5+ years)
- Don't explain JVM tuning (5+ years)

### ❌ Too Generic:
- "Explain X" → Add scenario: "When building Y, how does X help?"
- "What is X?" → Add context: "You need to solve Y problem. What is X and when to use it?"

### ❌ AI Dump Feeling:
- Avoid: "It's important to note that..."
- Avoid: "In conclusion..."
- Use: Specific numbers, real scenarios, production stories

### ❌ Wrong Difficulty:
- Don't ask junior-level syntax questions (too easy for 1-3 years)
- Don't ask architect-level design questions (too hard for 1-3 years)

---

## ✅ QUALITY VALIDATION CHECKLIST

Before including each question, verify:

1. ✅ **Interview Realistic**: Would ${targetCompanies} actually ask this?
2. ✅ **SEO Optimized**: Does title contain primary/secondary keyword?
3. ✅ **In Scope**: Is this topic owned by THIS stack?
4. ✅ **Right Layer**: Does it match surface/practical/internal/production?
5. ✅ **Right Difficulty**: Appropriate for ${experienceLevel}?
6. ✅ **Has Context**: Is there a scenario, not just "explain X"?
7. ✅ **Hand-Crafted Feel**: Would senior engineer recognize this as real?

**If any answer is NO → Rewrite the question**

---

## 📝 COVERAGE COMPLETENESS

Ensure you cover ALL topics in the stack scope. If a topic needs more questions to be complete, generate them.

**No gaps allowed.**

Check:
${stack.coverage?.map((c: any, i: number) => `- [ ] ${c.topic} (${c.subtopics.length} subtopics covered)`).join('\n') || ''}

---

## ✨ GENERATE NOW

Generate **${targetCount}+ questions** following:

1. ✅ Universal Content Philosophy (hand-crafted quality)
2. ✅ Experience-level specialization (${experienceLevel})
3. ✅ Stack scope (exactly what's in coverage)
4. ✅ Layer distribution (${layerCounts.surface}/${layerCounts.practical}/${layerCounts.internal}/${layerCounts.production})
5. ✅ Difficulty distribution (${difficultyCounts.easy}/${difficultyCounts.medium}/${difficultyCounts.hard})
6. ✅ SEO optimization (keywords in titles)
7. ✅ Zero overlap (respect exclusions)
8. ✅ Interview realism (${targetCompanies} style)

---

## 🎯 OUTPUT FORMAT

Return **ONLY** valid JSON array:

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

**No explanations. No markdown outside JSON. Just the array.**

---

**Generate ${targetCount}+ hand-crafted, interview-realistic, SEO-optimized questions now.**
`.trim();
  }

  /**
   * Save prompt to file
   * NEW STRUCTURE v3: content/domains/{lang}/{type}/{experience}/stacks/{stack}/generation-prompt.md
   * Supports both old format (java-backend-1-3) and new format (java/backend/1-3-years)
   */
  savePrompt(domainId: string, stackId: string): string {
    const prompt = this.generatePrompt(domainId, stackId);

    // Support both old and new path formats
    const outputDir = path.join(this.contentRoot, 'domains', domainId, 'stacks', stackId);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      // Also create answers folder
      fs.mkdirSync(path.join(outputDir, 'answers'), { recursive: true });
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

  if (command === 'generate') {
    const domainId = args[1];
    const stackId = args[2];

    if (!domainId || !stackId) {
      console.log('\n🎯 Domain-Aware Question Generator\n');
      console.log('Usage: npx tsx scripts/domainAwareGenerator.ts generate <domain-id> <stack-id>\n');
      console.log('Examples:');
      console.log('  npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics');
      console.log('  npx tsx scripts/domainAwareGenerator.ts generate python-backend-1-3 django-basics\n');
      process.exit(1);
    }

    try {
      const generator = new DomainAwareGenerator();
      const promptPath = generator.savePrompt(domainId, stackId);

      console.log(`\n✅ Domain-aware prompt generated!\n`);
      console.log(`📁 Saved to: ${promptPath}\n`);
      console.log('🔗 This prompt connects:');
      console.log('   ✅ Universal Content Philosophy (quality standards)');
      console.log('   ✅ Domain Definition (experience-level specialization)');
      console.log('   ✅ Stack Config (exact scope and coverage)\n');
      console.log('📋 Next steps:');
      console.log('   1. Review the prompt');
      console.log('   2. Copy to Claude');
      console.log('   3. Get JSON questions');
      console.log('   4. Save to questions.json\n');

      // Output prompt
      const prompt = generator.generatePrompt(domainId, stackId);
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
    console.log('\n🎯 Domain-Aware Question Generator\n');
    console.log('Commands:');
    console.log('  generate <domain-id> <stack-id>   Generate specialized prompt\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics\n');
  }
}

export { DomainAwareGenerator };