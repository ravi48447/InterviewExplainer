/**
 * Migration script: Reads legacy content from content/domains/ and creates
 * V2 complete-qa.json files in content/interview/ for stacks that don't
 * already have V2 content.
 *
 * EXCLUDES: java/backend/intermediate (kept as-is)
 *
 * Usage: npx tsx scripts/migrate-to-v2.ts
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGACY_ROOT = path.join(PROJECT_ROOT, 'content', 'domains');
const V2_ROOT = path.join(PROJECT_ROOT, 'content', 'interview');

interface LegacyQuestion {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty?: string;
  importance?: string;
  visible?: boolean;
  seoKeywords?: string[];
  searchIntent?: string[];
  tags?: string[];
  layer?: string;
  interviewFrequency?: string;
  realWorldScenario?: string;
}

interface V2Question {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty: string;
  importance?: string;
  reading_time_minutes: number;
  tags?: string[];
  seo?: {
    keywords?: string[];
    search_intent?: string[];
  };
  answer: {
    summary: string;
    sections: Array<{
      type: string;
      title: string;
      content: string;
    }>;
  };
}

interface V2CompleteQA {
  meta: {
    stack: string;
    level: string;
    language: string;
    track: string;
    description: string;
    last_updated: string;
  };
  questions: V2Question[];
}

const LEVEL_MAP: Record<string, string> = {
  'beginner': 'beginner',
  '0-1': 'beginner',
  '0-1-years': 'beginner',
  '1-3': 'beginner',
  '1-3-years': 'beginner',
  'intermediate': 'intermediate',
  '3-5': 'intermediate',
  '3-5-years': 'intermediate',
  'advanced': 'advanced',
  '5+': 'advanced',
  '5-plus-years': 'advanced',
};

function toDisplayName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function readJsonSafe<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isVisible(dir: string): boolean {
  const cfg = path.join(dir, '_config.json');
  if (!fs.existsSync(cfg)) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(cfg, 'utf-8'));
    return parsed.visible !== false;
  } catch {
    return true;
  }
}

function migrateStack(
  legacyStackDir: string,
  v2StackDir: string,
  stackSlug: string,
  lang: string,
  track: string,
  level: string
): { migrated: boolean; questionCount: number } {
  // Skip if V2 already has a complete-qa.json
  const v2QAFile = path.join(v2StackDir, 'complete-qa.json');
  if (fs.existsSync(v2QAFile)) {
    const existing = readJsonSafe<V2CompleteQA>(v2QAFile);
    if (existing && existing.questions && existing.questions.length > 0) {
      return { migrated: false, questionCount: 0 };
    }
  }

  // Collect questions from all subcategory questions.json files
  const allQuestions: V2Question[] = [];

  // Check for direct questions.json (flat stack)
  const directQf = path.join(legacyStackDir, 'questions.json');
  const directData = readJsonSafe<LegacyQuestion[] | { questions: LegacyQuestion[] }>(directQf);
  if (directData) {
    const arr: LegacyQuestion[] = Array.isArray(directData)
      ? directData
      : (directData as { questions?: LegacyQuestion[] }).questions ?? [];
    for (const q of arr) {
      if (q.visible === false) continue;
      allQuestions.push(convertQuestion(q));
    }
  }

  // Scan subcategory dirs
  try {
    for (const entry of fs.readdirSync(legacyStackDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const subcatDir = path.join(legacyStackDir, entry.name);
      if (!isVisible(subcatDir)) continue;

      const qf = path.join(subcatDir, 'questions.json');
      const data = readJsonSafe<LegacyQuestion[] | { questions: LegacyQuestion[] }>(qf);
      if (!data) continue;

      const arr: LegacyQuestion[] = Array.isArray(data)
        ? data
        : (data as { questions?: LegacyQuestion[] }).questions ?? [];

      for (const q of arr) {
        if (q.visible === false) continue;
        // Deduplicate by slug
        if (allQuestions.some(existing => existing.slug === q.slug)) continue;
        allQuestions.push(convertQuestion(q));
      }
    }
  } catch {}

  if (allQuestions.length === 0) return { migrated: false, questionCount: 0 };

  // Create V2 complete-qa.json
  const v2Content: V2CompleteQA = {
    meta: {
      stack: toDisplayName(stackSlug),
      level,
      language: lang,
      track,
      description: `${toDisplayName(stackSlug)} interview questions for ${lang} ${track} (${level} level)`,
      last_updated: new Date().toISOString().split('T')[0],
    },
    questions: allQuestions,
  };

  fs.mkdirSync(v2StackDir, { recursive: true });
  fs.writeFileSync(v2QAFile, JSON.stringify(v2Content, null, 2), 'utf-8');

  return { migrated: true, questionCount: allQuestions.length };
}

function convertQuestion(q: LegacyQuestion): V2Question {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    question: q.question,
    difficulty: q.difficulty || 'medium',
    importance: q.importance,
    reading_time_minutes: 5,
    tags: q.tags,
    seo: (q.seoKeywords || q.searchIntent) ? {
      keywords: q.seoKeywords,
      search_intent: q.searchIntent,
    } : undefined,
    answer: {
      summary: `Detailed answer for "${q.title}" coming soon.`,
      sections: [
        {
          type: 'speakable_answer',
          title: 'Answer',
          content: `*Detailed answer coming soon. This question covers: ${q.question}*`,
        },
      ],
    },
  };
}

// Main migration
function main() {
  let totalMigrated = 0;
  let totalQuestions = 0;

  console.log('=== InterviewExplainer Content Migration: Legacy → V2 ===\n');

  // Scan all legacy domain directories
  if (!fs.existsSync(LEGACY_ROOT)) {
    console.log('No legacy content found at', LEGACY_ROOT);
    return;
  }

  for (const lang of fs.readdirSync(LEGACY_ROOT, { withFileTypes: true })) {
    if (!lang.isDirectory()) continue;
    const langDir = path.join(LEGACY_ROOT, lang.name);

    for (const track of fs.readdirSync(langDir, { withFileTypes: true })) {
      if (!track.isDirectory()) continue;
      const trackDir = path.join(langDir, track.name);

      for (const levelDir of fs.readdirSync(trackDir, { withFileTypes: true })) {
        if (!levelDir.isDirectory()) continue;

        const resolvedLevel = LEVEL_MAP[levelDir.name] || levelDir.name;
        const contentPath = `${lang.name}/${track.name}/${levelDir.name}`;

        // SKIP Java Backend Intermediate — user wants to keep it as-is
        if (lang.name === 'java' && track.name === 'backend' && resolvedLevel === 'intermediate') {
          console.log(`SKIP: ${contentPath} (Java Backend Intermediate — preserved)`);
          continue;
        }

        const expDir = path.join(trackDir, levelDir.name);

        // Check for stacks/ subdirectory (Python-style)
        const stacksSubdir = path.join(expDir, 'stacks');
        const scanDir = fs.existsSync(stacksSubdir) ? stacksSubdir : expDir;

        console.log(`\nScanning: ${contentPath}`);

        for (const stackEntry of fs.readdirSync(scanDir, { withFileTypes: true })) {
          if (!stackEntry.isDirectory()) continue;
          if (!isVisible(path.join(scanDir, stackEntry.name))) {
            console.log(`  HIDDEN: ${stackEntry.name} (visible:false)`);
            continue;
          }

          const legacyStackDir = path.join(scanDir, stackEntry.name);
          const v2StackDir = path.join(V2_ROOT, lang.name, track.name, resolvedLevel, stackEntry.name);

          const result = migrateStack(
            legacyStackDir,
            v2StackDir,
            stackEntry.name,
            lang.name,
            track.name,
            resolvedLevel
          );

          if (result.migrated) {
            console.log(`  MIGRATED: ${stackEntry.name} → ${result.questionCount} questions`);
            totalMigrated++;
            totalQuestions += result.questionCount;
          } else if (result.questionCount === 0) {
            console.log(`  EMPTY: ${stackEntry.name} (no questions)`);
          } else {
            console.log(`  EXISTS: ${stackEntry.name} (V2 already has content)`);
          }
        }
      }
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`Stacks migrated: ${totalMigrated}`);
  console.log(`Total questions: ${totalQuestions}`);
}

main();
