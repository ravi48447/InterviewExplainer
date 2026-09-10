/**
 * COMPLETE CONTENT GENERATION WORKFLOW
 *
 * Orchestrates the entire process from domain definition to database import
 */

import * as fs from 'fs';
import * as path from 'path';
import { IntelligentQuestionGenerator } from './intelligentQuestionGenerator';

interface WorkflowStep {
  step: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  details?: string;
}

class ContentWorkflow {
  private contentRoot: string;
  private domainId: string;
  private steps: WorkflowStep[] = [];

  constructor(domainId: string) {
    this.contentRoot = path.join(process.cwd(), 'content');
    this.domainId = domainId;
  }

  /**
   * Step 1: Verify domain configuration exists
   */
  async verifyDomainConfig(): Promise<boolean> {
    const configPath = path.join(this.contentRoot, 'domains', this.domainId, 'domain-config.json');

    if (!fs.existsSync(configPath)) {
      console.log(`❌ Domain config not found: ${configPath}`);
      console.log(`\n📝 Create it first with proper stack definitions`);
      return false;
    }

    console.log(`✅ Domain config found`);
    return true;
  }

  /**
   * Step 2: Generate prompts for all stacks
   */
  async generateAllPrompts(experienceLevel: string = '1-3'): Promise<void> {
    console.log(`\n📝 Generating prompts for all stacks...\n`);

    const generator = new IntelligentQuestionGenerator(this.domainId);
    const stacks = generator.listAllStacks();

    let generated = 0;
    for (const { category, stack } of stacks) {
      try {
        const promptPath = generator.savePrompt(stack.id, experienceLevel);
        console.log(`✅ ${stack.priority}. ${stack.name} → ${promptPath}`);
        generated++;
      } catch (err: any) {
        console.error(`❌ ${stack.name}: ${err.message}`);
      }
    }

    console.log(`\n✅ Generated ${generated} prompts\n`);
  }

  /**
   * Step 3: Check which stacks have questions generated
   */
  async checkGenerationStatus(): Promise<{ total: number; generated: number; missing: string[] }> {
    const generator = new IntelligentQuestionGenerator(this.domainId);
    const stacks = generator.listAllStacks();

    const missing: string[] = [];
    let generated = 0;

    for (const { stack } of stacks) {
      const questionsPath = path.join(
        this.contentRoot,
        'questions',
        this.domainId,
        stack.id,
        'questions.json'
      );

      if (fs.existsSync(questionsPath)) {
        generated++;
      } else {
        missing.push(stack.id);
      }
    }

    return { total: stacks.length, generated, missing };
  }

  /**
   * Step 4: Validate questions (check for overlap, quality)
   */
  async validateQuestions(stackId: string): Promise<{ valid: boolean; issues: string[] }> {
    const questionsPath = path.join(
      this.contentRoot,
      'questions',
      this.domainId,
      stackId,
      'questions.json'
    );

    if (!fs.existsSync(questionsPath)) {
      return { valid: false, issues: ['Questions file not found'] };
    }

    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    const issues: string[] = [];

    // Check count
    const generator = new IntelligentQuestionGenerator(this.domainId);
    const stacks = generator.listAllStacks();
    const stack = stacks.find(s => s.stack.id === stackId)?.stack;

    if (stack && questions.length !== stack.questionCount) {
      issues.push(`Expected ${stack.questionCount} questions, got ${questions.length}`);
    }

    // Check for duplicates
    const slugs = questions.map((q: any) => q.slug);
    const uniqueSlugs = new Set(slugs);
    if (slugs.length !== uniqueSlugs.size) {
      issues.push('Duplicate question slugs found');
    }

    // Check required fields
    questions.forEach((q: any, index: number) => {
      if (!q.id || !q.title || !q.slug || !q.question || !q.difficulty) {
        issues.push(`Question ${index + 1} missing required fields`);
      }
    });

    return { valid: issues.length === 0, issues };
  }

  /**
   * Display workflow summary
   */
  async displayWorkflow(): Promise<void> {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`CONTENT GENERATION WORKFLOW: ${this.domainId}`);
    console.log(`${'='.repeat(80)}\n`);

    const generator = new IntelligentQuestionGenerator(this.domainId);
    const stacks = generator.listAllStacks();
    const status = await this.checkGenerationStatus();

    console.log(`📊 Progress: ${status.generated}/${status.total} stacks completed\n`);

    console.log(`📋 WORKFLOW STEPS:\n`);
    console.log(`✅ Step 1: Domain configuration defined (${stacks.length} stacks)`);
    console.log(`✅ Step 2: Intelligent prompts ready`);
    console.log(`${status.generated > 0 ? '✅' : '⏳'} Step 3: Generate questions (${status.generated}/${status.total})`);
    console.log(`⏳ Step 4: Import to database`);
    console.log(`⏳ Step 5: Verify on UI\n`);

    if (status.missing.length > 0) {
      console.log(`📝 NEXT STACKS TO GENERATE:\n`);
      status.missing.slice(0, 5).forEach(stackId => {
        const stackInfo = stacks.find(s => s.stack.id === stackId);
        if (stackInfo) {
          console.log(`   ${stackInfo.stack.priority}. ${stackInfo.stack.name} (${stackInfo.stack.questionCount}q)`);
        }
      });
      console.log();
    }

    console.log(`💡 QUICK COMMANDS:\n`);
    console.log(`   # Generate all prompts`);
    console.log(`   npx tsx scripts/contentWorkflow.ts generate-prompts ${this.domainId}\n`);
    console.log(`   # Check status`);
    console.log(`   npx tsx scripts/contentWorkflow.ts status ${this.domainId}\n`);
    console.log(`   # Validate specific stack`);
    console.log(`   npx tsx scripts/contentWorkflow.ts validate ${this.domainId} <stack-id>\n`);

    console.log(`${'='.repeat(80)}\n`);
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const domainId = args[1];

  if (!command || !domainId) {
    console.log('\n📦 Content Generation Workflow\n');
    console.log('Commands:');
    console.log('  workflow <domain-id>                    Show workflow summary');
    console.log('  generate-prompts <domain-id> [exp]      Generate all prompts');
    console.log('  status <domain-id>                      Check generation status');
    console.log('  validate <domain-id> <stack-id>         Validate questions\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/contentWorkflow.ts workflow java-backend');
    console.log('  npx tsx scripts/contentWorkflow.ts generate-prompts java-backend 1-3');
    console.log('  npx tsx scripts/contentWorkflow.ts status java-backend');
    console.log('  npx tsx scripts/contentWorkflow.ts validate java-backend core-java\n');
    process.exit(1);
  }

  const workflow = new ContentWorkflow(domainId);

  (async () => {
    try {
      const configExists = await workflow.verifyDomainConfig();
      if (!configExists) process.exit(1);

      switch (command) {
        case 'workflow':
          await workflow.displayWorkflow();
          break;

        case 'generate-prompts':
          const experienceLevel = args[2] || '1-3';
          await workflow.generateAllPrompts(experienceLevel);
          break;

        case 'status':
          const status = await workflow.checkGenerationStatus();
          console.log(`\n📊 Generation Status: ${status.generated}/${status.total} stacks completed`);
          if (status.missing.length > 0) {
            console.log(`\n⏳ Missing: ${status.missing.join(', ')}\n`);
          }
          break;

        case 'validate':
          const stackId = args[2];
          if (!stackId) {
            console.error('❌ Stack ID required');
            process.exit(1);
          }
          const validation = await workflow.validateQuestions(stackId);
          if (validation.valid) {
            console.log(`✅ ${stackId}: Valid`);
          } else {
            console.log(`❌ ${stackId}: Issues found:`);
            validation.issues.forEach(issue => console.log(`   - ${issue}`));
          }
          break;

        default:
          console.error(`❌ Unknown command: ${command}`);
          process.exit(1);
      }
    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  })();
}

export { ContentWorkflow };
