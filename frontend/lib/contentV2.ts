/**
 * contentV2.ts — 3-Layer Content Resolution Chain
 *
 * Server-side only. Reads from the new content architecture:
 *   Layer 1: content/shared/     (tools, frontend, architecture, data, behavioral)
 *   Layer 2: content/interview/  (language-specific, with $ref to shared)
 *   Layer 3: content/dsa/        (standalone DSA problems, tagged for contextual surfacing)
 *
 * Does NOT replace content-reader.ts — runs alongside it.
 * The existing pages can call contentV2 functions and get back the same
 * QuestionPagePayload / QuestionSummary types they already use.
 *
 * Resolution order (resolveStackContent):
 *   1. content/interview/{lang}/{track}/{level}/{stack}/complete-qa.json
 *      → If it's a $ref file, resolve references from shared
 *   2. content/shared/tools/{stack}/{level}/complete-qa.json
 *   3. content/shared/frontend/{stack}/{level}/complete-qa.json
 *   4. content/shared/architecture/{stack}/{level}/complete-qa.json
 *   5. content/shared/data/{stack}/{level}/complete-qa.json
 *   6. content/shared/behavioral/all/complete-qa.json  (if stack === 'behavioral')
 *   7. Legacy fallback to content/domains/ via existing content-reader.ts
 */

import fs from 'fs';
import path from 'path';
import type {
  QuestionPagePayload,
  AnswerSection,
  QuestionSummary,
} from './api';
import type {
  Level,
  V2CompleteQA,
  V2RefFile,
  V2QuestionEntry,
  V2AnswerSection,
  V2RefQuestion,
  ResolvedQuestion,
  ResolvedStackContent,
  DSAIndex,
  DSAProblem,
  DSAProblemIndex,
  DSAModule,
  DSALearnPage,
  DSASheet,
  Basic100Catalog,
} from './contentV2-types';
import { isRefFile } from './contentV2-types';

// ─── Paths ───────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.join(process.cwd(), '..');
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content');
const INTERVIEW_ROOT = path.join(CONTENT_ROOT, 'interview');
const SHARED_ROOT = path.join(CONTENT_ROOT, 'shared');
const DSA_ROOT = path.join(CONTENT_ROOT, 'dsa');
const COMPARE_ROOT = path.join(CONTENT_ROOT, 'compare');
const TOPICS_ROOT = path.join(CONTENT_ROOT, 'topics');
const COMPANIES_ROOT = path.join(CONTENT_ROOT, 'companies');

// ─── Global cache (survives HMR) ────────────────────────────────────────────

const g = globalThis as typeof globalThis & {
  _v2_jsonCache?: Map<string, unknown>;
  _v2_resolvedCache?: Map<string, ResolvedStackContent>;
  _v2_dsaIndex?: DSAIndex | null;
};
g._v2_jsonCache ??= new Map();
g._v2_resolvedCache ??= new Map();

const jsonCache = g._v2_jsonCache;
const resolvedCache = g._v2_resolvedCache;

// Hard cap on raw-JSON cache entries. Parsed complete-qa.json files can be
// 10–100 KB each; unbounded growth was causing 5+ GB RSS and GC-death spirals
// in dev (see /docs/perf-post-mortem). 1024 comfortably covers every V2
// content file without thrashing under the hot sidebar-hydration fan-out
// that reads dozens of files back-to-back.
const JSON_CACHE_MAX = 1024;
// Cap the resolved per-stack cache too. Each entry contains the fully merged
// question list for a stack (can be hundreds of KB after $ref resolution); on
// long dev sessions this was the second-largest contributor to RSS growth.
const RESOLVED_CACHE_MAX = 512;

function cachePutBounded<V>(map: Map<string, V>, key: string, value: V, max: number): void {
  if (map.size >= max) {
    const oldest = map.keys().next().value;
    if (oldest !== undefined) map.delete(oldest);
  }
  map.set(key, value);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T | null {
  if (jsonCache.has(filePath)) {
    const hit = jsonCache.get(filePath);
    // Refresh LRU position so hot entries aren't evicted.
    jsonCache.delete(filePath);
    jsonCache.set(filePath, hit);
    return hit as T | null;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    cachePutBounded(jsonCache, filePath, parsed, JSON_CACHE_MAX);
    return parsed;
  } catch (err: unknown) {
    // Only cache "missing" for real ENOENT/EISDIR/ENOTDIR. Transient IO
    // errors (EMFILE/EAGAIN) or parse errors are NOT cached — otherwise one
    // bad read under load permanently turns a valid page into a 404.
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT' || code === 'EISDIR' || code === 'ENOTDIR') {
      cachePutBounded(jsonCache, filePath, null, JSON_CACHE_MAX);
    }
    return null;
  }
}

function fileExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function toDisplayName(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function stripNumericPrefix(s: string): string {
  return s.replace(/^\d+-/, '');
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

function sectionToContent(s: V2AnswerSection): string {
  if (typeof s.content === 'string') return s.content;
  if (Array.isArray(s.content)) {
    return s.content
      .map(item =>
        typeof item === 'string' ? `- ${item}` : `- ${JSON.stringify(item)}`
      )
      .join('\n');
  }
  if (s.content && typeof s.content === 'object') {
    return Object.entries(s.content as Record<string, unknown>)
      .map(([k, v]) => `**${k}:** ${String(v)}`)
      .join('\n\n');
  }
  const items = (s as Record<string, unknown>).items;
  if (Array.isArray(items)) {
    return items
      .map(item => typeof item === 'string' ? `- ${item}` : `- ${JSON.stringify(item)}`)
      .join('\n');
  }
  const points = (s as Record<string, unknown>).points;
  if (Array.isArray(points)) {
    return points
      .map(item => typeof item === 'string' ? `- ${item}` : `- ${JSON.stringify(item)}`)
      .join('\n');
  }
  return '';
}

// ─── $ref Resolution ─────────────────────────────────────────────────────────

/**
 * Parses a $ref string like "shared/tools/kafka/intermediate/complete-qa.json#kafka-producer-acks"
 * into { filePath, questionId }.
 */
function parseRef(ref: string): { filePath: string; questionId: string } | null {
  const parts = ref.split('#');
  if (parts.length !== 2) return null;
  return {
    filePath: path.join(CONTENT_ROOT, parts[0]),
    questionId: parts[1],
  };
}

/**
 * Deep-merges override sections into the base question.
 * Override rules:
 *   - seo: shallow merge (override fields replace base fields)
 *   - answer.sections with replaceSection=true: replace matching type entirely
 *   - answer.sections without replaceSection: append
 */
function applyOverrides(
  base: V2QuestionEntry,
  overrides: V2RefQuestion['overrides']
): ResolvedQuestion {
  if (!overrides) return { ...base, _fromRef: true };

  const result: ResolvedQuestion = { ...base, _fromRef: true };

  if (overrides.seo) {
    result.seo = { ...base.seo, ...overrides.seo };
  }

  if (overrides.answer?.sections && overrides.answer.sections.length > 0) {
    const baseSections = [...(base.answer?.sections ?? [])];
    for (const overrideSec of overrides.answer.sections) {
      if (overrideSec.replaceSection) {
        const idx = baseSections.findIndex(s => s.type === overrideSec.type);
        if (idx !== -1) {
          baseSections[idx] = overrideSec;
        } else {
          baseSections.push(overrideSec);
        }
      } else {
        baseSections.push(overrideSec);
      }
    }
    result.answer = { sections: baseSections };
  }

  return result;
}

/**
 * Resolves a single $ref question entry by loading the shared source
 * and applying overrides.
 */
function resolveRefQuestion(refQ: V2RefQuestion): ResolvedQuestion | null {
  const parsed = parseRef(refQ.$ref);
  if (!parsed) return null;

  const sourceFile = readJson<V2CompleteQA>(parsed.filePath);
  if (!sourceFile || !sourceFile.questions) return null;

  const baseQ = sourceFile.questions.find(q => q.id === parsed.questionId);
  if (!baseQ) return null;

  return applyOverrides(baseQ, refQ.overrides);
}

/**
 * Resolves all questions in a $ref file — each question may have its own $ref.
 */
function resolveRefFile(refFile: V2RefFile): ResolvedStackContent {
  const sourcePath = path.join(CONTENT_ROOT, refFile.$source);
  const sourceData = readJson<V2CompleteQA>(sourcePath);

  const meta = sourceData?.meta
    ? { ...sourceData.meta, ...(refFile.overrides?.meta ?? {}) }
    : {
        stack: '',
        level: 'intermediate' as const,
        last_updated: '',
        description: '',
        ...(refFile.overrides?.meta ?? {}),
      };

  const questions: ResolvedQuestion[] = [];
  for (const refQ of refFile.questions) {
    if (refQ.$ref) {
      const resolved = resolveRefQuestion(refQ);
      if (resolved) questions.push(resolved);
    }
  }

  return { meta, questions };
}

// ─── Content Resolution Chain ────────────────────────────────────────────────

/**
 * Main resolution function. Follows the chain:
 *   interview/{lang}/{track}/{level}/{stack} → shared/tools → shared/frontend
 *   → shared/architecture → shared/data → behavioral
 */
export function resolveStackContent(
  lang: string,
  track: string,
  level: Level,
  stack: string
): ResolvedStackContent | null {
  const cacheKey = `${lang}:${track}:${level}:${stack}`;
  if (resolvedCache.has(cacheKey)) return resolvedCache.get(cacheKey)!;

  let result: ResolvedStackContent | null = null;

  // Step 1: Language-specific file (may be a $ref file or full content)
  const interviewPath = path.join(
    INTERVIEW_ROOT, lang, track, level, stack, 'complete-qa.json'
  );
  if (fileExists(interviewPath)) {
    const data = readJson<V2CompleteQA | V2RefFile>(interviewPath);
    if (data) {
      if (isRefFile(data)) {
        result = resolveRefFile(data);
      } else {
        const validQuestions = data.questions.filter((q: any) => q.slug && !q.$ref);
        result = { meta: data.meta, questions: validQuestions };
      }
    }
  }

  // Step 1b: Prefix-strip fallback — scan level dir (and one level of module
  // subdirs) for a stack dir whose name strips to `stack`.
  // Handles both flat:  intermediate/01-java-fundamentals/
  // and nested:         intermediate/01-java-foundations/01-java-fundamentals/
  if (!result) {
    const levelDir = path.join(INTERVIEW_ROOT, lang, track, level);
    if (fileExists(levelDir)) {
      try {
        const levelEntries = fs.readdirSync(levelDir, { withFileTypes: true })
          .filter(e => e.isDirectory());

        // First try flat match directly under level dir
        const flatMatch = levelEntries.find(e => stripNumericPrefix(e.name) === stack);
        const candidateDirs: string[] = flatMatch
          ? [path.join(levelDir, flatMatch.name)]
          : [];

        // Then try nested match: level/moduleDir/stackDir
        if (candidateDirs.length === 0) {
          for (const moduleEntry of levelEntries) {
            const moduleDir = path.join(levelDir, moduleEntry.name);
            try {
              const nested = fs.readdirSync(moduleDir, { withFileTypes: true })
                .find(e => e.isDirectory() && stripNumericPrefix(e.name) === stack);
              if (nested) {
                candidateDirs.push(path.join(moduleDir, nested.name));
                break;
              }
            } catch { /* skip unreadable dirs */ }
          }
        }

        for (const dir of candidateDirs) {
          const fallbackPath = path.join(dir, 'complete-qa.json');
          if (fileExists(fallbackPath)) {
            const data = readJson<V2CompleteQA | V2RefFile>(fallbackPath);
            if (data) {
              result = isRefFile(data) ? resolveRefFile(data) : { meta: data.meta, questions: data.questions };
            }
            break;
          }
        }
      } catch { /* ignore scan errors */ }
    }
  }

  // Step 2-6: Shared fallback chain (only if no interview-level file)
  if (!result) {
    const sharedPaths = [
      path.join(SHARED_ROOT, 'tools', stack, level, 'complete-qa.json'),
      path.join(SHARED_ROOT, 'frontend', stack, level, 'complete-qa.json'),
      path.join(SHARED_ROOT, 'architecture', stack, level, 'complete-qa.json'),
      path.join(SHARED_ROOT, 'data', stack, level, 'complete-qa.json'),
    ];

    for (const sp of sharedPaths) {
      if (fileExists(sp)) {
        const data = readJson<V2CompleteQA>(sp);
        if (data && data.questions) {
          const validQuestions = data.questions.filter((q: any) => q.slug && !q.$ref);
          result = { meta: data.meta, questions: validQuestions };
          break;
        }
      }
    }
  }

  // Step 6: Behavioral (special case — level-agnostic)
  if (!result && stack === 'behavioral') {
    const behavioralPath = path.join(SHARED_ROOT, 'behavioral', 'all', 'complete-qa.json');
    if (fileExists(behavioralPath)) {
      const data = readJson<V2CompleteQA>(behavioralPath);
      if (data && data.questions) {
        const validQuestions = data.questions.filter((q: any) => q.slug && !q.$ref);
        result = { meta: data.meta, questions: validQuestions };
      }
    }
  }

  if (result) {
    cachePutBounded(resolvedCache, cacheKey, result, RESOLVED_CACHE_MAX);
  }

  return result;
}

// ─── Discovery: List all stacks available for a given lang/track/level ──────

/**
 * Lists all stack slugs available for a specific lang/track/level combo.
 * Scans both interview/{lang}/{track}/{level}/ and shared/ directories.
 */
export function listStacksForPath(
  lang: string,
  track: string,
  level: Level
): string[] {
  // Returns stripped slug names in original numeric order
  const ordered: Array<{ order: number; slug: string }> = [];

  const interviewDir = path.join(INTERVIEW_ROOT, lang, track, level);
  if (!fileExists(interviewDir)) return [];

  function numericOrder(name: string): number {
    const m = name.match(/^(\d+)-/);
    return m ? parseInt(m[1], 10) : 999;
  }

  try {
    const levelEntries = fs.readdirSync(interviewDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => numericOrder(a.name) - numericOrder(b.name));

    for (const entry of levelEntries) {
      const entryPath = path.join(interviewDir, entry.name);

      // Flat stack — has complete-qa.json directly
      if (fileExists(path.join(entryPath, 'complete-qa.json'))) {
        ordered.push({ order: numericOrder(entry.name), slug: stripNumericPrefix(entry.name) });
        continue;
      }

      // Module dir — recurse one level, preserving child order
      try {
        const children = fs.readdirSync(entryPath, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .sort((a, b) => numericOrder(a.name) - numericOrder(b.name));

        for (const child of children) {
          const childQA = path.join(entryPath, child.name, 'complete-qa.json');
          if (fileExists(childQA)) {
            // Use a combined sort key: moduleOrder * 1000 + childOrder
            const sortKey = numericOrder(entry.name) * 1000 + numericOrder(child.name);
            ordered.push({ order: sortKey, slug: stripNumericPrefix(child.name) });
          }
        }
      } catch { /* skip */ }
    }
  } catch { /* dir unreadable */ }

  return ordered.sort((a, b) => a.order - b.order).map(x => x.slug);
}

/**
 * Returns module groups with their leaf stacks, in numeric prefix order.
 * If all stacks are flat (no module dirs), returns a single "ungrouped" module.
 */
export function listModulesWithStacks(
  lang: string,
  track: string,
  level: Level
): Array<{ moduleSlug: string; moduleName: string; stacks: string[] }> {
  const interviewDir = path.join(INTERVIEW_ROOT, lang, track, level);
  if (!fileExists(interviewDir)) return [];

  function numericOrder(name: string): number {
    const m = name.match(/^(\d+)-/);
    return m ? parseInt(m[1], 10) : 999;
  }

  const modules: Array<{ order: number; moduleSlug: string; moduleName: string; stacks: string[] }> = [];

  try {
    const levelEntries = fs.readdirSync(interviewDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => numericOrder(a.name) - numericOrder(b.name));

    const flatStacks: Array<{ order: number; slug: string }> = [];

    for (const entry of levelEntries) {
      const entryPath = path.join(interviewDir, entry.name);

      // Flat stack — no nesting
      if (fileExists(path.join(entryPath, 'complete-qa.json'))) {
        flatStacks.push({ order: numericOrder(entry.name), slug: stripNumericPrefix(entry.name) });
        continue;
      }

      // Module dir — recurse one level
      try {
        const children = fs.readdirSync(entryPath, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .sort((a, b) => numericOrder(a.name) - numericOrder(b.name));

        const childStacks: string[] = [];
        for (const child of children) {
          const childQA = path.join(entryPath, child.name, 'complete-qa.json');
          if (fileExists(childQA)) {
            childStacks.push(stripNumericPrefix(child.name));
          }
        }

        if (childStacks.length > 0) {
          modules.push({
            order: numericOrder(entry.name),
            moduleSlug: stripNumericPrefix(entry.name),
            moduleName: toDisplayName(stripNumericPrefix(entry.name)),
            stacks: childStacks,
          });
        }
      } catch { /* skip */ }
    }

    // If there are flat stacks, bundle them as an ungrouped module
    if (flatStacks.length > 0) {
      flatStacks.sort((a, b) => a.order - b.order);
      modules.push({
        order: 0,
        moduleSlug: '__flat__',
        moduleName: '',
        stacks: flatStacks.map(s => s.slug),
      });
    }
  } catch { /* dir unreadable */ }

  return modules.sort((a, b) => a.order - b.order).map(({ order: _o, ...rest }) => rest);
}

/**
 * Lists all languages that have content under content/interview/.
 */
export function listLanguages(): string[] {
  if (!fileExists(INTERVIEW_ROOT)) return [];
  try {
    return fs.readdirSync(INTERVIEW_ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Lists all tracks for a language (e.g., backend, fullstack, frontend).
 */
export function listTracks(lang: string): string[] {
  const dir = path.join(INTERVIEW_ROOT, lang);
  if (!fileExists(dir)) return [];
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Lists levels that have content for a lang/track combo.
 */
export function listLevels(lang: string, track: string): Level[] {
  const dir = path.join(INTERVIEW_ROOT, lang, track);
  if (!fileExists(dir)) return [];
  const validLevels: Level[] = ['beginner', 'intermediate', 'advanced'];
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory() && validLevels.includes(e.name as Level))
      .map(e => e.name as Level)
      .sort((a, b) => validLevels.indexOf(a) - validLevels.indexOf(b));
  } catch {
    return [];
  }
}

// ─── DSA ─────────────────────────────────────────────────────────────────────

/**
 * Loads the DSA master index (content/dsa/_index.json).
 */
export function getDSAIndex(): DSAIndex | null {
  if (g._v2_dsaIndex !== undefined) return g._v2_dsaIndex;
  const indexPath = path.join(DSA_ROOT, '_index.json');
  const data = readJson<DSAIndex>(indexPath);
  g._v2_dsaIndex = data;
  return data;
}

/**
 * Filters DSA problems matching a specific level and track.
 */
export function getDSAForLevelAndTrack(
  level: Level,
  track: string
): DSAProblemIndex[] {
  const index = getDSAIndex();
  if (!index) return [];
  return index.problems.filter(
    p => p.level_tags.includes(level) &&
         (p.track_tags.includes(track) || p.track_tags.includes('any'))
  );
}

/**
 * Gets DSA problems by category (e.g., 'arrays', 'trees').
 */
export function getDSAByCategory(category: string): DSAProblemIndex[] {
  const index = getDSAIndex();
  if (!index) return [];
  return index.problems.filter(p => p.category === category);
}

/**
 * Gets DSA problems by company tag.
 */
export function getDSAByCompany(company: string): DSAProblemIndex[] {
  const index = getDSAIndex();
  if (!index) return [];
  return index.problems.filter(p => p.company_tags.includes(company));
}

/**
 * Gets all unique DSA categories.
 */
export function getDSACategories(): string[] {
  const index = getDSAIndex();
  if (!index) return [];
  return [...new Set(index.problems.map(p => p.category))].sort();
}

/**
 * Gets all unique pattern slugs across the DSA problem index, with
 * the count of problems tagged with each pattern. Sorted descending by
 * count so the most-used patterns surface first.
 */
export function getDSAPatterns(): Array<{ slug: string; count: number }> {
  const index = getDSAIndex();
  if (!index) return [];
  const counts = new Map<string, number>();
  for (const p of index.problems) {
    for (const pat of p.patterns ?? []) {
      counts.set(pat, (counts.get(pat) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * Gets DSA problems whose `patterns[]` includes the given slug.
 */
export function getDSAByPattern(pattern: string): DSAProblemIndex[] {
  const index = getDSAIndex();
  if (!index) return [];
  return index.problems.filter(p => (p.patterns ?? []).includes(pattern));
}

/**
 * Gets all unique company tags across the DSA problem index, with problem
 * counts. Sorted descending by count.
 */
export function getDSACompanies(): Array<{ slug: string; count: number }> {
  const index = getDSAIndex();
  if (!index) return [];
  const counts = new Map<string, number>();
  for (const p of index.problems) {
    for (const c of p.company_tags ?? []) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * Loads a single DSA problem file.
 */
export function getDSAProblem(category: string, slug: string): DSAProblem | null {
  const filePath = path.join(DSA_ROOT, category, `${slug}.json`);
  return readJson<DSAProblem>(filePath);
}

/**
 * Loads a DSA problem by slug alone, using the index to resolve its
 * category. This is the canonical loader for /dsa/problem/[slug] pages.
 *
 * Falls back to the self-contained "Basic 100" track (category `basics`)
 * when the slug isn't present in the main `_index.json`. Basic 100 problems
 * are intentionally kept out of the main index so they don't flood the
 * curated difficulty/module surfaces; their files still live under
 * `content/dsa/basics/<slug>.json` and render on the standard problem page.
 */
export function getDSAProblemBySlug(slug: string): DSAProblem | null {
  const index = getDSAIndex();
  if (index) {
    const ref = index.problems.find(p => p.slug === slug);
    if (ref) return getDSAProblem(ref.category, slug);
  }
  // Basic 100 fallback — only if the slug is registered in the catalog.
  if (getBasic100Slugs().has(slug)) {
    return getDSAProblem('basics', slug);
  }
  return null;
}

// ─── Basic 100 (fresher track) ───────────────────────────────────────────────

const gBasic = globalThis as typeof globalThis & {
  _v2_basic100?: Basic100Catalog | null;
  _v2_basic100Slugs?: Set<string>;
};

/**
 * Loads the Basic 100 catalog (content/dsa/basic-100/index.json).
 */
export function getBasic100(): Basic100Catalog | null {
  if (gBasic._v2_basic100 !== undefined) return gBasic._v2_basic100;
  const catalogPath = path.join(DSA_ROOT, 'basic-100', 'index.json');
  const data = readJson<Basic100Catalog>(catalogPath);
  gBasic._v2_basic100 = data;
  return data;
}

/**
 * Set of all slugs declared in the Basic 100 catalog. Used by the problem
 * resolver and generateStaticParams to surface basic problem pages.
 */
export function getBasic100Slugs(): Set<string> {
  if (gBasic._v2_basic100Slugs) return gBasic._v2_basic100Slugs;
  const catalog = getBasic100();
  const set = new Set<string>();
  for (const g of catalog?.groups ?? []) {
    for (const p of g.problems) set.add(p.slug);
  }
  gBasic._v2_basic100Slugs = set;
  return set;
}

/**
 * Returns true if a Basic 100 problem has its rich JSON file authored on
 * disk (content/dsa/basics/<slug>.json). Mirrors problemHasAuthoredContent
 * for the main library; lets the hub show "Explained" vs "Queued".
 */
export function basic100ProblemAuthored(slug: string): boolean {
  return fileExists(path.join(DSA_ROOT, 'basics', `${slug}.json`));
}

// ─── DSA Curriculum Modules (pillar-level grouping) ──────────────────────────

/**
 * Returns the curriculum modules declared in content/dsa/_index.json, in the
 * order they are authored (intended learning progression). Empty array if
 * the index file has no `modules[]` overlay yet.
 */
export function getDSAModules(): DSAModule[] {
  const index = getDSAIndex();
  return index?.modules ?? [];
}

/**
 * Looks up a single curriculum module by its slug.
 */
export function getDSAModule(moduleSlug: string): DSAModule | null {
  return getDSAModules().find(m => m.moduleSlug === moduleSlug) ?? null;
}

/**
 * Returns all problems assigned to a given curriculum module, preserving the
 * order in which they are declared in `problems[]`.
 */
export function getDSAProblemsByModule(moduleSlug: string): DSAProblemIndex[] {
  const index = getDSAIndex();
  if (!index) return [];
  return index.problems.filter(p => p.moduleSlug === moduleSlug);
}

/**
 * Builds a lookup map of moduleSlug -> authored problem count. Cheap to
 * call at render time; derived from the in-memory index cache.
 */
export function getDSAModuleProblemCounts(): Record<string, number> {
  const index = getDSAIndex();
  if (!index) return {};
  const counts: Record<string, number> = {};
  for (const p of index.problems) {
    if (!p.moduleSlug) continue;
    counts[p.moduleSlug] = (counts[p.moduleSlug] ?? 0) + 1;
  }
  return counts;
}

/**
 * Loads the theory/learn page for a module, if authored. Returns null when
 * the module is curriculum-declared but its learn page hasn't been written
 * yet — callers render a "theory coming soon" state in that case.
 */
export function getDSALearnPage(moduleSlug: string): DSALearnPage | null {
  const filePath = path.join(DSA_ROOT, 'learn', moduleSlug, 'index.json');
  return readJson<DSALearnPage>(filePath);
}

/**
 * Returns the set of moduleSlugs that have an authored learn page on disk.
 * Used by the hub to render a "Theory" badge next to modules.
 */
export function getDSAModulesWithLearnPages(): Set<string> {
  const learnRoot = path.join(DSA_ROOT, 'learn');
  if (!fileExists(learnRoot)) return new Set();
  try {
    const entries = fs.readdirSync(learnRoot, { withFileTypes: true });
    const result = new Set<string>();
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (fileExists(path.join(learnRoot, e.name, 'index.json'))) {
        result.add(e.name);
      }
    }
    return result;
  } catch {
    return new Set();
  }
}

// ─── DSA sheets (Blind 75, NeetCode 150, Grind 75, …) ────────────────────────

/**
 * Loads a curated DSA sheet from content/dsa/sheets/<slug>/index.json.
 * Returns null when the sheet hasn't been authored yet — callers render a
 * "coming soon" card in that case.
 */
export function getDSASheet(sheetSlug: string): DSASheet | null {
  const filePath = path.join(DSA_ROOT, 'sheets', sheetSlug, 'index.json');
  return readJson<DSASheet>(filePath);
}

/**
 * Returns slugs of all sheets currently authored on disk. Used by the hub
 * to flip sheet cards between "Coming soon" and "Start" states.
 */
export function listDSASheets(): string[] {
  const sheetsRoot = path.join(DSA_ROOT, 'sheets');
  if (!fileExists(sheetsRoot)) return [];
  try {
    const entries = fs.readdirSync(sheetsRoot, { withFileTypes: true });
    const result: string[] = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (fileExists(path.join(sheetsRoot, e.name, 'index.json'))) {
        result.push(e.name);
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

// ─── Shared Content Direct Access (for /tools/, /topics/ hubs) ───────────────

/**
 * Lists all tools in content/shared/tools/.
 */
export function listSharedTools(): string[] {
  const dir = path.join(SHARED_ROOT, 'tools');
  if (!fileExists(dir)) return [];
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Lists all frontend libs in content/shared/frontend/.
 */
export function listSharedFrontendLibs(): string[] {
  const dir = path.join(SHARED_ROOT, 'frontend');
  if (!fileExists(dir)) return [];
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Aggregates all levels of a shared tool/lib into a single list.
 * Used by /tools/{slug} pages.
 */
export function getQuestionsForTool(
  toolSlug: string
): { level: Level; questions: V2QuestionEntry[] }[] {
  const levels: Level[] = ['beginner', 'intermediate', 'advanced'];
  const result: { level: Level; questions: V2QuestionEntry[] }[] = [];

  const searchPaths = [
    path.join(SHARED_ROOT, 'tools', toolSlug),
    path.join(SHARED_ROOT, 'frontend', toolSlug),
    path.join(SHARED_ROOT, 'architecture', toolSlug),
    path.join(SHARED_ROOT, 'data', toolSlug),
  ];

  for (const basePath of searchPaths) {
    if (!fileExists(basePath)) continue;
    for (const level of levels) {
      const filePath = path.join(basePath, level, 'complete-qa.json');
      const data = readJson<V2CompleteQA>(filePath);
      if (data?.questions?.length) {
        result.push({ level, questions: data.questions });
      }
    }
    if (result.length > 0) break;
  }

  return result;
}

// ─── Adapters: V2 → existing QuestionPagePayload shape ───────────────────────

/**
 * Converts a resolved V2 question into the QuestionPagePayload shape
 * so the existing question page component renders without changes.
 */
export function v2ToQuestionPagePayload(
  resolved: ResolvedQuestion,
  allQuestions: ResolvedQuestion[],
  stackSlug: string,
  domainSlug: string
): QuestionPagePayload {
  const currentIdx = allQuestions.findIndex(q => q.slug === resolved.slug);

  const answerSections: AnswerSection[] = (resolved.answer?.sections ?? [])
    .map((s, i) => ({
      id: i,
      sectionType: s.type,
      sectionOrder: i,
      content: sectionToContent(s),
      sectionTitle: s.title ?? '',
    }))
    .filter(s => s.content.length > 0);

  const totalText = answerSections.map(s => s.content).join(' ');

  const mapToSummary = (q: ResolvedQuestion, idx: number): QuestionSummary => ({
    id: 0,
    title: q.title || q.question || toDisplayName(q.slug),
    slug: q.slug,
    difficulty: q.difficulty,
    estimatedReadTime: q.reading_time_minutes ?? 8,
    orderIndex: idx,
    domainSlug,
    stackSlug,
  });

  const quickQuestions: QuestionSummary[] = allQuestions.map((q, i) =>
    mapToSummary(q, i)
  );

  return {
    id: 0,
    title: resolved.title || resolved.question,
    questionText: resolved.question || null,
    slug: resolved.slug,
    difficulty: resolved.difficulty,
    estimatedReadTime: estimateReadTime(totalText),
    metaTitle: resolved.seo?.metaTitle ?? `${resolved.question} | InterviewExplainer`,
    metaDescription: resolved.seo?.metaDescription ?? resolved.direct_answer?.slice(0, 155) ?? null,
    stackId: null,
    stackName: toDisplayName(stackSlug),
    stackSlug,
    domainSlug,
    answerSections,
    previousQuestion: currentIdx > 0 ? mapToSummary(allQuestions[currentIdx - 1], currentIdx - 1) : null,
    nextQuestion: currentIdx < allQuestions.length - 1 ? mapToSummary(allQuestions[currentIdx + 1], currentIdx + 1) : null,
    quickQuestions,
    relatedQuestions: [],
    concepts: [],
    internalLinks: [],
    recommendedQuestions: [],
    peopleAlsoAsk: [],
    interviewCoach: resolved.interviewer_intent
      ? [
          `What they're testing: ${resolved.interviewer_intent.testing}`,
          `Common mistake: ${resolved.interviewer_intent.common_mistake}`,
          `To stand out: ${resolved.interviewer_intent.to_stand_out}`,
        ]
      : [],
    practiceChecklist: resolved.followup_questions ?? [],
    quizzes: [],
  };
}

/**
 * High-level function: get a QuestionPagePayload from V2 content.
 * Returns null if the question is not found in V2 content.
 * The caller can fall back to the legacy content-reader.ts if this returns null.
 */
export function getV2QuestionPagePayload(
  lang: string,
  track: string,
  level: Level,
  stack: string,
  questionSlug: string
): QuestionPagePayload | null {
  const content = resolveStackContent(lang, track, level, stack);
  if (!content) return null;

  const question = content.questions.find(q => q.slug === questionSlug);
  if (!question) return null;

  const domainSlug = `${lang}-${track}-${level}`;

  return v2ToQuestionPagePayload(
    question,
    content.questions,
    stack,
    domainSlug
  );
}

/**
 * Lists all questions in a stack as QuestionSummary[] (V2 format).
 */
export function getV2QuestionsForStack(
  lang: string,
  track: string,
  level: Level,
  stack: string
): QuestionSummary[] {
  const content = resolveStackContent(lang, track, level, stack);
  if (!content) return [];

  const domainSlug = `${lang}-${track}-${level}`;

  return content.questions
    .filter(q => q.slug && typeof q.slug === "string")
    .map((q, i) => ({
    id: 0,
    title: q.title || q.question || toDisplayName(q.slug),
    slug: q.slug,
    difficulty: q.difficulty,
    estimatedReadTime: q.reading_time_minutes ?? 8,
    orderIndex: i,
    domainSlug,
    stackSlug: stack,
  }));
}

// ─── Static Params Generation ────────────────────────────────────────────────

export interface V2QuestionParams {
  lang: string;
  track: string;
  level: Level;
  stack: string;
  questionSlug: string;
}

/**
 * Scans the entire content/interview/ tree and returns all renderable
 * question paths. Used by generateStaticParams in route pages.
 */
export function listAllV2QuestionParams(): V2QuestionParams[] {
  const params: V2QuestionParams[] = [];
  const langs = listLanguages();

  for (const lang of langs) {
    const tracks = listTracks(lang);
    for (const track of tracks) {
      const levels = listLevels(lang, track);
      for (const level of levels) {
        const stacks = listStacksForPath(lang, track, level);
        for (const stack of stacks) {
          const content = resolveStackContent(lang, track, level, stack);
          if (!content) continue;
          for (const q of content.questions) {
            params.push({ lang, track, level, stack, questionSlug: q.slug });
          }
        }
      }
    }
  }

  return params;
}

/**
 * Returns all stack-level params (for stack listing pages).
 */
export function listAllV2StackParams(): Omit<V2QuestionParams, 'questionSlug'>[] {
  const params: Omit<V2QuestionParams, 'questionSlug'>[] = [];
  const langs = listLanguages();

  for (const lang of langs) {
    const tracks = listTracks(lang);
    for (const track of tracks) {
      const levels = listLevels(lang, track);
      for (const level of levels) {
        const stacks = listStacksForPath(lang, track, level);
        for (const stack of stacks) {
          params.push({ lang, track, level, stack });
        }
      }
    }
  }

  return params;
}

// ─── Cache Management ────────────────────────────────────────────────────────

/**
 * Clears all V2 caches. Call during development hot-reload if content
 * files are modified and changes aren't reflected.
 */
export function clearV2Cache(): void {
  jsonCache.clear();
  resolvedCache.clear();
  g._v2_dsaIndex = undefined;
  gBasic._v2_basic100 = undefined;
  gBasic._v2_basic100Slugs = undefined;
}
