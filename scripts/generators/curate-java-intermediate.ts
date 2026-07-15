/**
 * curate-java-intermediate.ts
 *
 * Curates the Java Backend Intermediate (3-5yr) question set:
 *   1. Writes _config.json { visible: false } for 11 hidden stacks
 *   2. Writes _config.json { visible: false } for hidden subcategories within visible stacks
 *   3. Marks lower-priority questions as visible:false in each questions.json
 *      (no questions are deleted — only a flag is added/updated)
 *
 * Priority for showing a question:
 *   Tier 1: interviewFrequency=high  AND importance=high
 *   Tier 2: interviewFrequency=high  AND importance=medium
 *   Tier 3: interviewFrequency=medium AND importance=high
 *   Tier 4: all others (hidden)
 *
 * Run with: npx ts-node --esm scripts/curate-java-intermediate.ts
 * Or:       npx tsx scripts/curate-java-intermediate.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.join(__dirname, '..', 'content', 'domains', 'java', 'backend', '3-5');

// ─── Configuration ────────────────────────────────────────────────────────────

/** Stacks to hide entirely */
const HIDDEN_STACKS = new Set([
  'architecture-design-patterns',
  'caching-performance',
  'cloud-deployment',
  'collections-data-structures',
  'devops-cicd',
  'engineering-practices',
  'event-driven',
  'event-driven-architecture',
  'observability',
  'production-operations',
  'security',
]);

/**
 * For each visible stack, list the subcategories to SHOW.
 * Any subcategory not in this list will be hidden.
 * null means "show all subcategories for this stack".
 */
const VISIBLE_SUBCATS: Record<string, string[]> = {
  'core-java': [
    'multithreading-concurrency',
    'oop-principles',
    'functional-programming',
    'generics-wildcards',
    'exceptions-best-practices',
    'reflection-annotations',
  ],
  'spring-core': [
    'dependency-injection',
    'bean-lifecycle',
    'aop',
    'spring-internals',
    'custom-components',
  ],
  'spring-boot': [
    'auto-configuration',
    'application-properties',
    'actuator',
    'testing',
    'devtools-profiles',
    'embedded-servers',
  ],
  'spring-data-hibernate': [
    'jpa-fundamentals',
    'entity-relationships',
    'transactions',
    'query-optimization',
    'hibernate-internals',
    'n-plus-one-problem',
  ],
  'spring-security': [
    'authentication',
    'authorization',
    'jwt',
    'oauth2',
    'cors-csrf',
  ],
  'rest-api-web': [
    'rest-fundamentals',
    'exception-handling',
    'spring-mvc-controllers',
    'api-design',
    'versioning',
  ],
  'database': [
    'indexing',
    'query-optimization',
    'connection-pooling',
    'partitioning-sharding',
    'nosql-integration',
  ],
  'microservices': [
    'fundamentals',
    'circuit-breaker',
    'service-discovery',
    'api-gateway',
    'distributed-tracing',
    'saga-pattern',
  ],
  'testing': [
    'unit-testing',
    'integration-testing',
    'tdd-practices',
    'mocking-frameworks',
    'spring-test',
  ],
  'system-design': [
    'design-fundamentals',
    'scalability',
    'database-design',
    'caching-strategy',
    'high-availability',
    'api-design',
  ],
  'jvm-performance': [
    'garbage-collection',
    'jvm-architecture',
    'memory-analysis',
    'profiling-debugging',
  ],
};

/** Max questions to show per subcategory */
const MAX_PER_SUBCAT = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RawQuestion {
  id: string;
  title?: string;
  slug: string;
  question?: string;
  difficulty?: string;
  importance?: string;
  interviewFrequency?: string;
  layer?: string;
  visible?: boolean;
  [key: string]: unknown;
}

function priority(q: RawQuestion): number {
  const freq = q.interviewFrequency ?? 'medium';
  const imp  = q.importance ?? 'medium';
  if (freq === 'high'   && imp === 'high')   return 1;
  if (freq === 'high'   && imp === 'medium')  return 2;
  if (freq === 'medium' && imp === 'high')   return 3;
  if (freq === 'high'   && imp === 'low')    return 4;
  if (freq === 'medium' && imp === 'medium') return 5;
  return 6;
}

function writeConfig(dir: string, config: Record<string, unknown>): void {
  fs.writeFileSync(path.join(dir, '_config.json'), JSON.stringify(config, null, 2) + '\n');
}

interface WrappedQuestionsFile {
  topic?: string;
  questions: RawQuestion[];
  [key: string]: unknown;
}

function processQuestionsFile(filePath: string, maxVisible: number): void {
  if (!fs.existsSync(filePath)) return;

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    console.warn(`  ⚠ Could not parse ${filePath} — skipping`);
    return;
  }

  // Support both plain array and { topic, questions: [] } object formats
  let questions: RawQuestion[];
  let isWrapped = false;
  let wrapper: WrappedQuestionsFile | null = null;

  if (Array.isArray(raw)) {
    questions = raw as RawQuestion[];
  } else if (raw && typeof raw === 'object' && Array.isArray((raw as WrappedQuestionsFile).questions)) {
    wrapper = raw as WrappedQuestionsFile;
    questions = wrapper.questions;
    isWrapped = true;
  } else {
    console.warn(`  ⚠ ${filePath} — unrecognised format, skipping`);
    return;
  }

  // Sort by priority to decide which to show, but preserve original order in output
  const sorted = [...questions].sort((a, b) => priority(a) - priority(b));
  const showIds = new Set(sorted.slice(0, maxVisible).map(q => q.id));

  let changed = 0;
  const updated = questions.map(q => {
    const shouldShow = showIds.has(q.id);
    const currentVisible = q.visible;

    if (shouldShow && currentVisible === false) {
      changed++;
      return { ...q, visible: true };
    }
    if (!shouldShow && currentVisible !== false) {
      changed++;
      return { ...q, visible: false };
    }
    return q;
  });

  if (changed > 0) {
    const output = isWrapped ? { ...wrapper, questions: updated } : updated;
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n');
    console.log(`    ✓ ${path.basename(path.dirname(filePath))} — showed ${showIds.size}, hid ${questions.length - showIds.size} (${changed} changes)`);
  } else {
    console.log(`    · ${path.basename(path.dirname(filePath))} — no changes needed`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('=== Java Backend Intermediate (3-5yr) Curation ===\n');

  if (!fs.existsSync(CONTENT_ROOT)) {
    console.error(`Content root not found: ${CONTENT_ROOT}`);
    process.exit(1);
  }

  const allStacks = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const stackSlug of allStacks) {
    const stackDir = path.join(CONTENT_ROOT, stackSlug);

    // ── Hidden stack ─────────────────────────────────────────────────────────
    if (HIDDEN_STACKS.has(stackSlug)) {
      console.log(`[HIDE STACK] ${stackSlug}`);
      writeConfig(stackDir, { visible: false });
      continue;
    }

    // ── Visible stack ────────────────────────────────────────────────────────
    console.log(`[SHOW STACK] ${stackSlug}`);

    const allowedSubcats = VISIBLE_SUBCATS[stackSlug];
    if (!allowedSubcats) {
      console.log('  (no subcategory config — showing all)');
      continue;
    }

    const allSubcats = fs
      .readdirSync(stackDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    for (const subcatSlug of allSubcats) {
      const subcatDir = path.join(stackDir, subcatSlug);
      const isVisible = allowedSubcats.includes(subcatSlug);

      if (!isVisible) {
        // ── Hidden subcategory ───────────────────────────────────────────────
        console.log(`  [HIDE SUBCAT] ${subcatSlug}`);
        writeConfig(subcatDir, { visible: false });
      } else {
        // ── Visible subcategory — curate questions ───────────────────────────
        console.log(`  [SHOW SUBCAT] ${subcatSlug}`);
        const qFile = path.join(subcatDir, 'questions.json');
        processQuestionsFile(qFile, MAX_PER_SUBCAT);
      }
    }

    console.log('');
  }

  console.log('\n=== Done ===');
  console.log('All changes written. Hidden items use _config.json or visible:false — nothing deleted.');
}

main();
