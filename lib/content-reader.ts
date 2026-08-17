/**
 * content-reader.ts
 *
 * Server-side only. Reads question content directly from the local JSON files
 * under content/domains/{lang}/{track}/{experience}/{stack}/{subcategory}/
 * and returns data in the same shape as QuestionPagePayload / StackSubcategory
 * so the pages can use it as a drop-in replacement for the Spring Boot API.
 *
 * DB is never touched here.
 */

import fs from 'fs';
import path from 'path';
import { resolveContentRoot } from './content-paths';
import type {
  QuestionPagePayload,
  AnswerSection,
  QuestionSummary,
  StackSubcategory,
  ModuleRevision,
  Difficulty,
} from './api';
import { EXPERIENCE_LEVELS, type ExperienceLevelKey, primaryLegacyDir } from './levels';
import { parseDomainSlug, parsedToContentPath } from './domain-display';
import { resolveStackContent } from './contentV2';
import { getV2QuestionPagePayload } from './contentV2';
import type { Level } from './contentV2-types';

// ─── In-process cache (survives HMR via globalThis) ──────────────────────────
// Using globalThis ensures caches are NOT wiped on Next.js hot reloads in dev.

const g = globalThis as typeof globalThis & {
  _ie_jsonCache?:   Map<string, unknown>;
  _ie_stackQCache?: Map<string, QuestionSummary[]>;
  _ie_subcatCache?: Map<string, StackSubcategory[]>;
};
g._ie_jsonCache   ??= new Map();
g._ie_stackQCache ??= new Map();
g._ie_subcatCache ??= new Map();

const _jsonCache   = g._ie_jsonCache;
const _stackQCache = g._ie_stackQCache;
const _subcatCache = g._ie_subcatCache;

// Bound the raw-JSON cache so it can't grow past ~128 parsed files. Parsed
// complete-qa.json files can be 10–100 KB each; without a cap the cache (plus
// its contentV2 twin) can balloon past 100 MB and push V8 into GC-death spirals
// that pin the dev server at 500 % CPU. The higher-level `_stackQCache` /
// `_subcatCache` already memoize the FINISHED per-stack views, so evicting a
// raw JSON entry only costs one re-parse on a cold read.
// We ship ~340 `complete-qa.json` files today. A single home/prep render can
// touch most of them; a too-small cap caused the cache to thrash mid-render,
// re-reading the same files dozens of times and turning one sidebar
// hydration pass into a multi-second IO storm. 1024 comfortably holds every
// content + questions + config JSON across both locked domains with headroom
// for growth, while still being bounded so long-running dev sessions can't
// leak to OOM.
const _JSON_CACHE_MAX = 1024;
// Per-stack derived views are larger (full QuestionSummary[] arrays). 512
// covers every visible stack across all locked + V2 domains while preventing
// unbounded growth across long dev sessions.
const _STACK_CACHE_MAX = 512;

function _cachePutBounded<V>(map: Map<string, V>, key: string, value: V, max: number): void {
  if (map.size >= max) {
    const oldest = map.keys().next().value;
    if (oldest !== undefined) map.delete(oldest);
  }
  map.set(key, value);
}

// ─── Path helpers ────────────────────────────────────────────────────────────

const REPOSITORY_CONTENT_ROOT = resolveContentRoot();
const CONTENT_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'domains');
// New canonical location per MASTER_PLAN.md: content/interview/{lang}/{track}/{level}/{stack}
const CONTENT_INTERVIEW_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'interview');

// ─── Locked-domain registry ──────────────────────────────────────────────────
//
// A "locked" domain has its content pinned to a single flat tree under
// content/<domainSlug>/<moduleSlug>/<topicSlug>/{questions,complete-qa}.json.
// Its _index.json is the authoritative module list (curriculum-ordered).
//
// Modules can declare `contentSource: { domain, moduleSlug }` in their
// _index.json entry to reuse another locked domain's content without
// duplicating files — e.g. java-fullstack-intermediate's `core-java` module
// transparently serves content from java-backend-intermediate/core-java.
//
// Java-Backend-Intermediate is the original locked tree (per
// content/ARCHITECTURE.md). Java-Fullstack-Intermediate is its cross-cutting
// sibling that reuses all 35 backend modules and adds 21 frontend/fullstack
// modules of its own.

const CONTENT_JBI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'java-backend-intermediate');
const CONTENT_JFI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'java-fullstack-intermediate');
const CONTENT_JBF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'java-backend-fresher');
const CONTENT_JFF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'java-fullstack-fresher');
const CONTENT_GOI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'go-intermediate');
const CONTENT_GOF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'go-fresher');
const CONTENT_FEI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'frontend-intermediate');
const CONTENT_FEF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'frontend-fresher');
const CONTENT_PBI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'python-backend-intermediate');
const CONTENT_PBF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'python-backend-fresher');
export const CONTENT_RBI_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'ruby-backend-intermediate');
export const CONTENT_RBF_ROOT = path.join(REPOSITORY_CONTENT_ROOT, 'ruby-backend-fresher');

/**
 * Stack-slug aliases for the Java-Backend-Intermediate migration.
 * Old URL slug → new locked module slug under content/java-backend-intermediate/.
 * Keeps pre-migration URLs working while the canonical URL uses the new slug.
 */
const JBI_STACK_ALIAS: Record<string, string> = {
  'collections-data-structures': 'java-collections',
  'jvm-performance':              'jvm-internals',
  'spring-data-hibernate':        'spring-data-jpa',
  'rest-api-web':                 'rest-api',
  'security':                     'application-security',
  'devops-cicd':                  'cicd',
  'aws':                          'aws-cloud',
  'production-operations':        'production-sre',
  // Split modules — old `advanced-java` is now split; default old URL to java-streams
  // (java-concurrency also exists; users can reach it via its canonical slug).
  'advanced-java':                'java-streams',
  // `testing` was split into `unit-testing` + `advanced-testing`; default to unit-testing.
  'testing':                      'unit-testing',
  // `architecture-design-patterns` was split into design-patterns + architecture-patterns.
  'architecture-design-patterns': 'design-patterns',
  // Aggregate legacy folders merged elsewhere — route them to their new home.
  'database':                     'sql-databases',
  'postgresql':                   'sql-databases',
  'event-driven':                 'messaging-events',
  'event-driven-architecture':    'messaging-events',
  'kafka':                        'messaging-events',
  'caching-performance':          'redis-caching',
  'redis':                        'redis-caching',
  'cloud-deployment':             'cloud-native',
  'git':                          'git-build-tools',
  'maven-gradle':                 'git-build-tools',
  'docker':                       'docker',
};

interface LockedDomainInfo {
  domainSlug: string;
  rootDir: string;
  stackAliases: Record<string, string>;
}

const LOCKED_DOMAINS: Record<string, LockedDomainInfo> = {
  'java-backend-intermediate': {
    domainSlug: 'java-backend-intermediate',
    rootDir: CONTENT_JBI_ROOT,
    stackAliases: JBI_STACK_ALIAS,
  },
  'java-fullstack-intermediate': {
    domainSlug: 'java-fullstack-intermediate',
    rootDir: CONTENT_JFI_ROOT,
    stackAliases: {},
  },
  'java-backend-fresher': {
    domainSlug: 'java-backend-fresher',
    rootDir: CONTENT_JBF_ROOT,
    stackAliases: {},
  },
  'go-intermediate': {
    domainSlug: 'go-intermediate',
    rootDir: CONTENT_GOI_ROOT,
    stackAliases: {},
  },
  'go-fresher': {
    domainSlug: 'go-fresher',
    rootDir: CONTENT_GOF_ROOT,
    stackAliases: {},
  },
  'java-fullstack-fresher': {
    domainSlug: 'java-fullstack-fresher',
    rootDir: CONTENT_JFF_ROOT,
    stackAliases: {},
  },
  'ruby-backend-intermediate': {
    domainSlug: 'ruby-backend-intermediate',
    rootDir: CONTENT_RBI_ROOT,
    stackAliases: {},
  },
  'ruby-backend-fresher': {
    domainSlug: 'ruby-backend-fresher',
    rootDir: CONTENT_RBF_ROOT,
    stackAliases: {},
  },
  'frontend-intermediate': {
    domainSlug: 'frontend-intermediate',
    rootDir: CONTENT_FEI_ROOT,
    stackAliases: {},
  },
  'frontend-fresher': {
    domainSlug: 'frontend-fresher',
    rootDir: CONTENT_FEF_ROOT,
    stackAliases: {},
  },
  'python-backend-intermediate': {
    domainSlug: 'python-backend-intermediate',
    rootDir: CONTENT_PBI_ROOT,
    stackAliases: {},
  },
  'python-backend-fresher': {
    domainSlug: 'python-backend-fresher',
    rootDir: CONTENT_PBF_ROOT,
    stackAliases: {},
  },
};

function getLockedDomain(domainSlug: string): LockedDomainInfo | null {
  return LOCKED_DOMAINS[domainSlug] ?? null;
}

/** True iff the given domain slug is served by a locked content tree. */
export function isLockedDomain(domainSlug: string): boolean {
  return domainSlug in LOCKED_DOMAINS;
}

/** Returns the resolved module slug under the given locked tree, applying aliases. */
function resolveLockedStackSlug(domainSlug: string, stackSlug: string): string {
  const info = getLockedDomain(domainSlug);
  if (!info) return stackSlug;
  return info.stackAliases[stackSlug] ?? stackSlug;
}

// ─── Locked-domain _index.json (cached per domain) ──────────────────────────

interface LockedIndexEntry {
  moduleNumber?: string;
  pillar?: string;
  pillarName?: string;
  moduleSlug: string;
  title?: string;
  appUrl?: string;
  seoSlug?: string;
  topics?: string[];
  /** When present, resolve this module's content from another locked domain. */
  contentSource?: { domain: string; moduleSlug: string };
}

interface LockedIndexFile {
  appRoot?: string;
  totalModules?: number;
  reusedFrom?: string;
  modules: LockedIndexEntry[];
}

const g2 = globalThis as typeof globalThis & {
  _ie_lockedIndexCache?: Map<string, LockedIndexFile | null>;
};
g2._ie_lockedIndexCache ??= new Map();
const _lockedIndexCache = g2._ie_lockedIndexCache;

function loadLockedIndex(domainSlug: string): LockedIndexFile | null {
  if (_lockedIndexCache.has(domainSlug)) return _lockedIndexCache.get(domainSlug)!;

  const info = getLockedDomain(domainSlug);
  if (!info) {
    _lockedIndexCache.set(domainSlug, null);
    return null;
  }

  const indexPath = path.join(info.rootDir, '_index.json');
  if (!fs.existsSync(indexPath)) {
    _lockedIndexCache.set(domainSlug, null);
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as LockedIndexFile;
    _lockedIndexCache.set(domainSlug, parsed);
    return parsed;
  } catch {
    _lockedIndexCache.set(domainSlug, null);
    return null;
  }
}

/** Returns the _index.json entry for a given locked module, or null. */
export function getLockedModuleEntry(
  domainSlug: string,
  stackSlug: string,
): LockedIndexEntry | null {
  const index = loadLockedIndex(domainSlug);
  if (!index) return null;
  const resolved = resolveLockedStackSlug(domainSlug, stackSlug);
  return (
    index.modules.find(m => m.moduleSlug === resolved) ??
    index.modules.find(m => m.moduleSlug === stackSlug) ??
    null
  );
}

/**
 * Public, lightweight shape of a locked-domain module entry — exposed for
 * UI surfaces that need the next/previous curriculum step. Mirrors the
 * subset of `_index.json.modules[]` callers actually use, with all upstream
 * private types stripped so consumers don't import internal interfaces.
 */
export interface CurriculumModuleRef {
  moduleSlug: string;
  title: string;
  pillarName: string;
  moduleNumber: string;
}

/**
 * Returns the next module in the locked-domain curriculum after `stackSlug`,
 * skipping any modules that have no visible content yet. Returns null when
 * the domain isn't a locked tree, the stack isn't found, or the current
 * module is already the last one with content. Used by the question page
 * "Up next in your roadmap" card.
 */
export function getNextCurriculumModule(
  domainSlug: string,
  stackSlug: string,
): CurriculumModuleRef | null {
  const index = loadLockedIndex(domainSlug);
  if (!index) return null;

  const resolved = resolveLockedStackSlug(domainSlug, stackSlug);
  const ordered = index.modules ?? [];
  const currentIdx = ordered.findIndex(
    (m) => m.moduleSlug === resolved || m.moduleSlug === stackSlug,
  );
  if (currentIdx < 0) return null;

  // Only suggest a next module that actually has visible content — pointing
  // at an empty placeholder module would be a dead-end for the user.
  const visible = new Set(getVisibleStackSlugs(domainSlug));

  for (let i = currentIdx + 1; i < ordered.length; i++) {
    const next = ordered[i];
    if (!next?.moduleSlug) continue;
    if (!visible.has(next.moduleSlug)) continue;
    return {
      moduleSlug: next.moduleSlug,
      title: next.title ?? next.moduleSlug,
      pillarName: next.pillarName ?? "",
      moduleNumber: next.moduleNumber ?? "",
    };
  }
  return null;
}

/**
 * Returns the previous visible module in the locked-domain curriculum before
 * `stackSlug`. Mirrors `getNextCurriculumModule` and is used for explicit
 * "Back to previous module" UX on stack landing pages.
 */
export function getPreviousCurriculumModule(
  domainSlug: string,
  stackSlug: string,
): CurriculumModuleRef | null {
  const index = loadLockedIndex(domainSlug);
  if (!index) return null;

  const resolved = resolveLockedStackSlug(domainSlug, stackSlug);
  const ordered = index.modules ?? [];
  const currentIdx = ordered.findIndex(
    (m) => m.moduleSlug === resolved || m.moduleSlug === stackSlug,
  );
  if (currentIdx < 0) return null;

  const visible = new Set(getVisibleStackSlugs(domainSlug));

  for (let i = currentIdx - 1; i >= 0; i--) {
    const prev = ordered[i];
    if (!prev?.moduleSlug) continue;
    if (!visible.has(prev.moduleSlug)) continue;
    return {
      moduleSlug: prev.moduleSlug,
      title: prev.title ?? prev.moduleSlug,
      pillarName: prev.pillarName ?? "",
      moduleNumber: prev.moduleNumber ?? "",
    };
  }
  return null;
}

/**
 * Resolves the absolute directory on disk where a locked module's content
 * lives. For reused modules (entry.contentSource is set) this recurses into
 * the source domain and returns its dir instead. Returns null when nothing
 * resolves to an existing folder.
 */
function resolveLockedModuleDir(domainSlug: string, stackSlug: string): string | null {
  const info = getLockedDomain(domainSlug);
  if (!info) return null;

  const entry = getLockedModuleEntry(domainSlug, stackSlug);
  if (entry?.contentSource) {
    // Guard against self-reference cycles.
    if (entry.contentSource.domain === domainSlug) return null;
    return resolveLockedModuleDir(entry.contentSource.domain, entry.contentSource.moduleSlug);
  }

  const resolved = resolveLockedStackSlug(domainSlug, stackSlug);
  const localDir = path.join(info.rootDir, resolved);
  return fs.existsSync(localDir) ? localDir : null;
}

/**
 * Full slug → content path table.
 * Includes both legacy numeric slugs (backward compat) and
 * new level-word slugs (beginner / intermediate / advanced).
 */
const SLUG_TO_PATH: Record<string, string> = {
  // ── Legacy numeric slugs → redirect to canonical dirs ──
  'java-backend-0-1':  'java/backend/beginner',
  'java-backend-1-3':  'java/backend/beginner',
  'java-backend-3-5':  'java/backend/intermediate',
  'java-backend-5+':   'java/backend/advanced',
  'java-fullstack-0-1':'java/fullstack/beginner',
  'java-fullstack-1-3':'java/fullstack/beginner',
  'java-fullstack-3-5':'java/fullstack/intermediate',
  'java-fullstack-5+': 'java/fullstack/advanced',
  'python-backend-0-1':'python/backend/beginner',
  'python-backend-1-3':'python/backend/beginner',
  'python-backend-3-5':'python/backend/intermediate',
  'python-backend-5+': 'python/backend/advanced',

  // ── Canonical level-word slugs (current dir names) ──
  'java-backend-beginner':      'java/backend/beginner',
  'java-backend-intermediate':  'java/backend/intermediate',
  'java-backend-advanced':      'java/backend/advanced',

  'java-fullstack-beginner':      'java/fullstack/beginner',
  'java-fullstack-intermediate':  'java/fullstack/intermediate',
  'java-fullstack-advanced':      'java/fullstack/advanced',

  'python-backend-beginner':      'python/backend/beginner',
  'python-backend-intermediate':  'python/backend/intermediate',
  'python-backend-advanced':      'python/backend/advanced',

  'python-fullstack-beginner':    'python/fullstack/beginner',
  'python-fullstack-intermediate':'python/fullstack/intermediate',
  'python-fullstack-advanced':    'python/fullstack/advanced',

  'python-data-engineering-beginner':     'python/data-engineering/beginner',
  'python-data-engineering-intermediate': 'python/data-engineering/intermediate',
  'python-data-engineering-advanced':     'python/data-engineering/advanced',

  'python-ml-ai-beginner':     'python/ml-ai/beginner',
  'python-ml-ai-intermediate': 'python/ml-ai/intermediate',
  'python-ml-ai-advanced':     'python/ml-ai/advanced',

  'javascript-frontend-beginner':     'javascript/frontend/beginner',
  'javascript-frontend-intermediate': 'javascript/frontend/intermediate',
  'javascript-frontend-advanced':     'javascript/frontend/advanced',

  'javascript-backend-beginner':     'javascript/backend/beginner',
  'javascript-backend-intermediate': 'javascript/backend/intermediate',
  'javascript-backend-advanced':     'javascript/backend/advanced',

  'javascript-fullstack-beginner':     'javascript/fullstack/beginner',
  'javascript-fullstack-intermediate': 'javascript/fullstack/intermediate',
  'javascript-fullstack-advanced':     'javascript/fullstack/advanced',

  'typescript-frontend-beginner':     'typescript/frontend/beginner',
  'typescript-frontend-intermediate': 'typescript/frontend/intermediate',
  'typescript-frontend-advanced':     'typescript/frontend/advanced',

  'typescript-backend-beginner':     'typescript/backend/beginner',
  'typescript-backend-intermediate': 'typescript/backend/intermediate',
  'typescript-backend-advanced':     'typescript/backend/advanced',

  'go-backend-beginner':     'go/backend/beginner',
  'go-backend-intermediate': 'go/backend/intermediate',
  'go-backend-advanced':     'go/backend/advanced',

  'kotlin-android-beginner':     'kotlin/android/beginner',
  'kotlin-android-intermediate': 'kotlin/android/intermediate',
  'kotlin-android-advanced':     'kotlin/android/advanced',

  'kotlin-backend-beginner':     'kotlin/backend/beginner',
  'kotlin-backend-intermediate': 'kotlin/backend/intermediate',
  'kotlin-backend-advanced':     'kotlin/backend/advanced',

  'csharp-backend-beginner':     'csharp/backend/beginner',
  'csharp-backend-intermediate': 'csharp/backend/intermediate',
  'csharp-backend-advanced':     'csharp/backend/advanced',

  'devops-cicd-beginner':     'devops/cicd/beginner',
  'devops-cicd-intermediate': 'devops/cicd/intermediate',
  'devops-cicd-advanced':     'devops/cicd/advanced',

  'devops-cloud-beginner':     'devops/cloud/beginner',
  'devops-cloud-intermediate': 'devops/cloud/intermediate',
  'devops-cloud-advanced':     'devops/cloud/advanced',

  'devops-infrastructure-beginner':     'devops/infrastructure/beginner',
  'devops-infrastructure-intermediate': 'devops/infrastructure/intermediate',
  'devops-infrastructure-advanced':     'devops/infrastructure/advanced',

  'devops-sre-beginner':     'devops/sre/beginner',
  'devops-sre-intermediate': 'devops/sre/intermediate',
  'devops-sre-advanced':     'devops/sre/advanced',

  'ruby-backend-beginner':     'ruby/backend/beginner',
  'ruby-backend-intermediate': 'ruby/backend/intermediate',
  'ruby-backend-advanced':     'ruby/backend/advanced',

  'ruby-fullstack-beginner':     'ruby/fullstack/beginner',
  'ruby-fullstack-intermediate': 'ruby/fullstack/intermediate',
  'ruby-fullstack-advanced':     'ruby/fullstack/advanced',

  // Non-engineering roles
  'data-analyst-sql-analytics-beginner':       'data-analyst/sql-analytics/beginner',
  'data-analyst-sql-analytics-intermediate':   'data-analyst/sql-analytics/intermediate',
  'data-analyst-sql-analytics-advanced':       'data-analyst/sql-analytics/advanced',

  'data-analyst-python-analysis-beginner':     'data-analyst/python-analysis/beginner',
  'data-analyst-python-analysis-intermediate': 'data-analyst/python-analysis/intermediate',
  'data-analyst-python-analysis-advanced':     'data-analyst/python-analysis/advanced',

  'data-analyst-visualization-beginner':       'data-analyst/visualization/beginner',
  'data-analyst-visualization-intermediate':   'data-analyst/visualization/intermediate',
  'data-analyst-visualization-advanced':       'data-analyst/visualization/advanced',

  'data-analyst-case-studies-beginner':        'data-analyst/case-studies/beginner',
  'data-analyst-case-studies-intermediate':    'data-analyst/case-studies/intermediate',
  'data-analyst-case-studies-advanced':        'data-analyst/case-studies/advanced',

  'typescript-fullstack-beginner':     'typescript/fullstack/beginner',
  'typescript-fullstack-intermediate': 'typescript/fullstack/intermediate',
  'typescript-fullstack-advanced':     'typescript/fullstack/advanced',


  'business-analyst-analysis-beginner':        'business-analyst/analysis/beginner',
  'business-analyst-analysis-intermediate':    'business-analyst/analysis/intermediate',
  'business-analyst-analysis-advanced':        'business-analyst/analysis/advanced',
};

/**
 * Constructs a canonical domainSlug from lang + track + level params.
 * Used by the new /interview/{lang}/{track}/{level}/ routes.
 */
export function langTrackLevelToSlug(lang: string, track: string, level: string): string {
  return `${lang}-${track}-${level}`;
}

export function domainSlugToContentPath(domainSlug: string): string | null {
  if (SLUG_TO_PATH[domainSlug]) return SLUG_TO_PATH[domainSlug];

  // Smart auto-resolution: handles multi-word lang/track slugs like data-analyst, ml-ai
  const parsed = parseDomainSlug(domainSlug);
  if (parsed) return parsedToContentPath(parsed);

  // Last-resort fallback for simple {lang}-{track}-{suffix}
  const parts = domainSlug.split('-');
  if (parts.length < 3) return null;
  const lang  = parts[0];
  const track = parts[1];
  const suffix = parts.slice(2).join('-') as ExperienceLevelKey;

  if (suffix in EXPERIENCE_LEVELS) {
    const legacyDir = primaryLegacyDir(suffix);
    return `${lang}/${track}/${legacyDir}`;
  }

  return `${lang}/${track}/${suffix}`;
}

function stackDir(domainSlug: string, stackSlug: string): string | null {
  // ── Locked domains: flat tree content/<domain>/<module>/<topic>/{questions,complete-qa}.json
  //    takes precedence. Reused modules resolve via _index.json.contentSource
  //    to the source domain's tree (e.g. JFI's spring-boot → JBI's spring-boot).
  if (isLockedDomain(domainSlug)) {
    const lockedDir = resolveLockedModuleDir(domainSlug, stackSlug);
    if (lockedDir) {
      const hasDirectQA = fs.existsSync(path.join(lockedDir, 'complete-qa.json'));
      const hasSubTopics = fs.readdirSync(lockedDir, { withFileTypes: true })
        .some(e => e.isDirectory() && (
          fs.existsSync(path.join(lockedDir, e.name, 'complete-qa.json')) ||
          fs.existsSync(path.join(lockedDir, e.name, 'questions.json'))
        ));
      if (hasDirectQA || hasSubTopics) return lockedDir;
      // Module folder exists but is empty — fall through so we still serve
      // legacy content during the transition window.
    }
  }

  const rel = domainSlugToContentPath(domainSlug);
  if (!rel) return null;

  // Check V2 first, but only use it if it actually has content
  const newDir = path.join(CONTENT_INTERVIEW_ROOT, rel, stackSlug);
  if (fs.existsSync(newDir)) {
    const hasDirectQA = fs.existsSync(path.join(newDir, 'complete-qa.json'));
    const hasSubcats = fs.readdirSync(newDir, { withFileTypes: true })
      .some(e => e.isDirectory() && (
        fs.existsSync(path.join(newDir, e.name, 'complete-qa.json')) ||
        fs.existsSync(path.join(newDir, e.name, 'questions.json'))
      ));
    if (hasDirectQA || hasSubcats) return newDir;
  }

  // Curriculum-aware: search inside numbered module directories (e.g., 01-java-foundations/01-java-fundamentals)
  const interviewDir = path.join(CONTENT_INTERVIEW_ROOT, rel);
  if (fs.existsSync(interviewDir)) {
    try {
      for (const mod of fs.readdirSync(interviewDir, { withFileTypes: true })) {
        if (!mod.isDirectory() || !mod.name.match(/^\d+-/)) continue;
        // Try exact match first, then fallback to prefix-stripped match
        const modDir = path.join(interviewDir, mod.name);
        let nested = path.join(modDir, stackSlug);
        if (!fs.existsSync(nested)) {
          // Scan for a stack dir whose name strips to stackSlug
          try {
            const stackEntry = fs.readdirSync(modDir, { withFileTypes: true })
              .find(e => e.isDirectory() && stripNumericPrefix(e.name) === stackSlug);
            if (stackEntry) nested = path.join(modDir, stackEntry.name);
            else continue;
          } catch { continue; }
        }
        const hasQA = fs.existsSync(path.join(nested, 'complete-qa.json'));
        const hasSubs = fs.readdirSync(nested, { withFileTypes: true })
          .some(e => e.isDirectory() && (
            fs.existsSync(path.join(nested, e.name, 'complete-qa.json')) ||
            fs.existsSync(path.join(nested, e.name, 'questions.json'))
          ));
        if (hasQA || hasSubs) return nested;
      }
    } catch {}
  }

  // Fall back to legacy: content/domains/{lang}/{track}/{level}/{stack}
  const legacyDir = path.join(CONTENT_ROOT, rel, stackSlug);
  return fs.existsSync(legacyDir) ? legacyDir : null;
}

/** Canonical on-disk folder for `domainSlug` / `stackSlug` (module root). Safe for callers that need FS paths matching `getSubcategorySlugs`. */
export function resolveStackDirectory(domainSlug: string, stackSlug: string): string | null {
  return stackDir(domainSlug, stackSlug);
}

function stripNumericPrefix(slug: string | null | undefined): string {
  if (typeof slug !== 'string' || slug.length === 0) return '';
  return slug.replace(/^\d+-/, '');
}

function toDisplayName(slug: string | null | undefined): string {
  const safe = stripNumericPrefix(slug);
  if (safe.length === 0) return '';
  return safe.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Flatten markdown (bold, code, links) into plain text for meta descriptions. */
function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Visibility helpers ───────────────────────────────────────────────────────

interface DirConfig {
  visible?: boolean;
}

function isDirVisible(dirPath: string): boolean {
  const cfg = path.join(dirPath, '_config.json');
  if (!fs.existsSync(cfg)) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(cfg, 'utf-8')) as DirConfig;
    return parsed.visible !== false;
  } catch {
    return true;
  }
}

// ─── Raw JSON shapes ─────────────────────────────────────────────────────────

interface RawQuestion {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty?: string;
  importance?: string;
  visible?: boolean;
}

interface RawMistake {
  mistake: string;
  why: string;
  correct: string;
}

interface RawFollowup {
  question: string;
  quickAnswer: string;
  related?: string;
}

interface RawSection {
  type: string;
  title?: string;
  content?: string | string[];
  summary?: string;
  language?: string;
  mistakes?: RawMistake[];
  questions?: RawFollowup[];
  timeToSpeak?: string;
}

interface RawQAEntry {
  id: string;
  title: string;
  slug: string;
  question: string;
  difficulty?: string;
  /** Optional explicit ordering inside `complete-qa.json` (lower first). */
  order?: number;
  stub?: boolean;
  /** Optional hero / 30-second answer used as a metadata-description fallback. */
  direct_answer?: string;
  /** Author-supplied SEO overrides; preferred over generated title/description. */
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  answer?: {
    summary?: string;
    sections?: RawSection[];
  };
}

interface RawCompleteQA {
  topic: string;
  topicSlug?: string;
  questions: RawQAEntry[];
}

/** Some topic files use `{ questions: [...] }`; others are a bare `[...]` array. */
function questionsFromCompleteQA(raw: unknown): RawQAEntry[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(
      (q): q is RawQAEntry =>
        q != null && typeof q === 'object' && typeof (q as RawQAEntry).slug === 'string',
    );
  }
  if (typeof raw === 'object' && Array.isArray((raw as RawCompleteQA).questions)) {
    return (raw as RawCompleteQA).questions;
  }
  return [];
}

// ─── Section converters ───────────────────────────────────────────────────────

function mistakesToMarkdown(mistakes: RawMistake[]): string {
  return mistakes
    .map(
      m =>
        `## ❌ ${m.mistake}\n\n**Why it's wrong:** ${m.why}\n\n**✅ Correct approach:** ${m.correct}\n\n---`
    )
    .join('\n\n');
}

function followupsToMarkdown(questions: RawFollowup[]): string {
  return questions
    .map(
      q =>
        `### ${q.question}\n\n**Quick Answer:** ${q.quickAnswer}${
          q.related ? `\n\n*Related: ${q.related}*` : ''
        }`
    )
    .join('\n\n');
}

function comparisonTableToMarkdown(content: { headers: string[]; rows: string[][] }): string {
  const { headers, rows } = content;
  if (!headers?.length || !rows?.length) return '';
  const sep = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');
  const bodyRows = rows.map(r => r.join(' | ')).join('\n');
  return `${headerRow}\n${sep}\n${bodyRows}`;
}

function sectionToContent(s: RawSection): string {
  if (s.content) {
    if (typeof s.content === 'string' && s.content.trim()) return s.content.trim();
    if (Array.isArray(s.content)) return (s.content as string[]).map(item => `- ${item}`).join('\n');
    // comparison_table: {"headers":[...],"rows":[[...]]}
    if (
      typeof s.content === 'object' &&
      !Array.isArray(s.content) &&
      'headers' in (s.content as object)
    ) {
      return comparisonTableToMarkdown(s.content as { headers: string[]; rows: string[][] });
    }
  }
  if (s.summary && typeof s.summary === 'string' && s.summary.trim()) return s.summary.trim();
  if (s.mistakes && s.mistakes.length) return mistakesToMarkdown(s.mistakes);
  if (s.questions && s.questions.length) return followupsToMarkdown(s.questions);
  return '';
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(5, Math.ceil(words / 200));
}

// ─── Safe JSON reader (cached) ────────────────────────────────────────────────

function readJson<T>(filePath: string): T | null {
  if (_jsonCache.has(filePath)) {
    const hit = _jsonCache.get(filePath);
    // Touch for LRU — keep hot entries at the young end.
    _jsonCache.delete(filePath);
    _jsonCache.set(filePath, hit);
    return hit as T | null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    _cachePutBounded(_jsonCache, filePath, parsed, _JSON_CACHE_MAX);
    return parsed;
  } catch (err: unknown) {
    // Only cache negative results when the file genuinely does not exist on
    // disk (`ENOENT`). Transient failures under concurrent IO pressure —
    // `EMFILE`, `ENFILE`, `EAGAIN`, or JSON parse errors from a torn read —
    // must NOT be cached, otherwise a single bad moment permanently turns
    // live content pages into 404s until the dev server is restarted.
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT' || code === 'EISDIR' || code === 'ENOTDIR') {
      _cachePutBounded(_jsonCache, filePath, null, _JSON_CACHE_MAX);
    }
    return null;
  }
}

function normalizeDifficulty(raw: string | undefined): Difficulty {
  const d = (raw ?? '').toLowerCase().trim();
  if (d === 'easy' || d === 'beginner' || d === 'basic') return 'easy';
  if (d === 'hard' || d === 'advanced' || d === 'expert' || d === 'difficult') return 'hard';
  return 'medium';
}

/** Applies `order` when at least one question declares it; others keep authored file order behind ordered rows. */
function orderedRawQAEntries(questions: RawQAEntry[]): RawQAEntry[] {
  const any = questions.some(q => q.order != null && !Number.isNaN(Number(q.order)));
  if (!any) return questions;
  let floor =
    Math.max(-1, ...questions.map((_, i) => i)) + questions.length + 99;
  return [...questions]
    .map((q, idx) => ({ q, idx }))
    .sort((a, b) => {
      const ao = a.q.order != null ? Number(a.q.order) : floor + a.idx;
      const bo = b.q.order != null ? Number(b.q.order) : floor + b.idx;
      return ao - bo;
    })
    .map(x => x.q);
}

/**
 * Reads the module-level `_revision.json` for a locked-domain module.
 *
 * Schema (5–6 sections):
 * ```
 * {
 *   "title": "Spring Core — Revision",
 *   "estimatedMinutes": 12,
 *   "sections": [
 *     { "id": "core", "title": "What this module is really about", "body": "..." },
 *     ...
 *   ]
 * }
 * ```
 *
 * Module reuse is honoured via `_index.json.contentSource`: a JFI module
 * pointing at the JBI source domain transparently picks up the source
 * domain's revision file. Returns null when there's no `_revision.json`.
 *
 * Intentionally does **not** use `readJson` — `readJson` negative-caches
 * missing files for the lifetime of the process, which would defeat hot
 * iteration on revision content during authoring.
 */
export function getModuleRevision(
  domainSlug: string,
  stackSlug: string,
): ModuleRevision | null {
  const moduleDir = isLockedDomain(domainSlug)
    ? resolveLockedModuleDir(domainSlug, stackSlug)
    : stackDir(domainSlug, stackSlug);
  if (!moduleDir) return null;

  const fp = path.join(moduleDir, '_revision.json');
  if (!fs.existsSync(fp)) return null;

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(fs.readFileSync(fp, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;

  const sr = raw.sections;
  if (!Array.isArray(sr) || sr.length === 0) return null;

  const sections: ModuleRevision['sections'] = [];
  for (let idx = 0; idx < sr.length; idx++) {
    const item = sr[idx];
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === 'string' && o.id.trim() ? o.id : `s${idx}`;
    const title =
      typeof o.title === 'string' && o.title.trim() ? (o.title as string) : `Section ${idx + 1}`;
    const body = typeof o.body === 'string' ? o.body : '';
    if (!body.trim()) continue;
    sections.push({ id, title, body });
  }
  if (sections.length === 0) return null;

  const title =
    typeof raw.title === 'string' && raw.title.trim() ? raw.title : `${toDisplayName(stackSlug)} — Revision`;
  const estimatedMinutes =
    typeof raw.estimatedMinutes === 'number' && !Number.isNaN(raw.estimatedMinutes)
      ? raw.estimatedMinutes
      : undefined;
  return { title, estimatedMinutes, sections };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns visible stack slugs for a domain, respecting _config.json visibility.
 */
export function getVisibleStackSlugs(domainSlug: string): string[] {
  const slugSet = new Set<string>();

  // ── Locked-domain tree ──
  // Two sources are merged:
  //   (a) physical folders under the domain's rootDir (for modules that own
  //       their content, including brand-new ones);
  //   (b) modules declared in _index.json that use `contentSource` to reuse
  //       another locked domain's content — their own rootDir has no folder
  //       but they ARE visible in the listing.
  const info = getLockedDomain(domainSlug);
  if (info && fs.existsSync(info.rootDir)) {
    for (const e of fs.readdirSync(info.rootDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
      const modDir = path.join(info.rootDir, e.name);
      if (!isDirVisible(modDir)) continue;
      const hasContent = fs.existsSync(path.join(modDir, 'complete-qa.json'))
        || fs.readdirSync(modDir, { withFileTypes: true }).some(
          sub => sub.isDirectory() && (
            fs.existsSync(path.join(modDir, sub.name, 'complete-qa.json')) ||
            fs.existsSync(path.join(modDir, sub.name, 'questions.json'))
          )
        );
      if (hasContent) slugSet.add(e.name);
    }

    // Reused modules declared in _index.json with contentSource → expose them
    // when their source dir has content.
    const index = loadLockedIndex(domainSlug);
    if (index) {
      for (const entry of index.modules) {
        if (slugSet.has(entry.moduleSlug)) continue;
        if (!entry.contentSource) continue;
        const sourceDir = resolveLockedModuleDir(
          entry.contentSource.domain, entry.contentSource.moduleSlug,
        );
        if (!sourceDir) continue;
        const hasContent = fs.existsSync(path.join(sourceDir, 'complete-qa.json'))
          || fs.readdirSync(sourceDir, { withFileTypes: true }).some(
            sub => sub.isDirectory() && (
              fs.existsSync(path.join(sourceDir, sub.name, 'complete-qa.json')) ||
              fs.existsSync(path.join(sourceDir, sub.name, 'questions.json'))
            )
          );
        if (hasContent) slugSet.add(entry.moduleSlug);
      }
    }
  }

  const rel = domainSlugToContentPath(domainSlug);
  if (!rel) return [...slugSet].sort();

  // Scan legacy: content/domains/{rel}
  const domainDir = path.join(CONTENT_ROOT, rel);
  if (fs.existsSync(domainDir)) {
    for (const e of fs.readdirSync(domainDir, { withFileTypes: true })) {
      if (e.isDirectory() && isDirVisible(path.join(domainDir, e.name))) {
        slugSet.add(e.name);
      }
    }
  }

  // Scan V2: content/interview/{rel} — only include stacks with actual content
  const interviewDir = path.join(CONTENT_INTERVIEW_ROOT, rel);
  if (fs.existsSync(interviewDir)) {
    for (const e of fs.readdirSync(interviewDir, { withFileTypes: true })) {
      if (!e.isDirectory() || !isDirVisible(path.join(interviewDir, e.name))) continue;
      const v2StackDir = path.join(interviewDir, e.name);
      const hasContent = fs.existsSync(path.join(v2StackDir, 'complete-qa.json'))
        || fs.readdirSync(v2StackDir, { withFileTypes: true }).some(
          sub => sub.isDirectory() && (
            fs.existsSync(path.join(v2StackDir, sub.name, 'complete-qa.json')) ||
            fs.existsSync(path.join(v2StackDir, sub.name, 'questions.json'))
          )
        );
      if (hasContent) slugSet.add(e.name);
    }
  }

  return [...slugSet].sort();
}

/**
 * Returns the ordered list of subcategory slugs for a stack,
 * filtering out any subcategory whose _config.json has visible:false.
 *
 * V2 stacks may have complete-qa.json directly in the stack dir with no
 * subcategory folders.  In that case we return ['_root'] as a synthetic
 * subcategory so callers can treat it uniformly.
 */
export function getSubcategorySlugs(domainSlug: string, stackSlug: string): string[] {
  const dir = stackDir(domainSlug, stackSlug);
  if (!dir) return [];

  const onDisk = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .filter(e => isDirVisible(path.join(dir, e.name)))
    .map(e => e.name);

  // V2 flat structure: complete-qa.json sits directly in the stack dir
  if (onDisk.length === 0 && fs.existsSync(path.join(dir, 'complete-qa.json'))) {
    return ['_root'];
  }

  // Locked domains: honor `_config.json.topics` (or _index.json topics for
  // reused modules whose content lives in a different domain) for
  // learning-sequence ordering. Unknown topics not listed appear after known
  // ones, alpha-sorted.
  if (isLockedDomain(domainSlug)) {
    let configTopics: string[] | null = null;

    const cfgPath = path.join(dir, '_config.json');
    if (fs.existsSync(cfgPath)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as { topics?: string[] };
        if (Array.isArray(cfg.topics)) configTopics = cfg.topics;
      } catch {}
    }

    // Fallback to the _index.json entry (authoritative for reused modules that
    // have no _config.json of their own on this domain's tree).
    if (!configTopics) {
      const entry = getLockedModuleEntry(domainSlug, stackSlug);
      if (entry?.topics) configTopics = entry.topics;
    }

    if (configTopics) {
      const set = new Set(onDisk);
      const known = configTopics.filter(t => set.has(t));
      const extras = onDisk.filter(t => !configTopics!.includes(t)).sort();
      return [...known, ...extras];
    }
  }

  return onDisk.sort();
}

/**
 * Try V2 resolution for a stack — handles $ref files and shared content fallback.
 * Returns QuestionSummary[] if V2 content is found, null otherwise.
 */
function tryV2StackResolution(
  domainSlug: string,
  stackSlug: string
): QuestionSummary[] | null {
  const parsed = parseDomainSlug(domainSlug);
  if (!parsed) return null;

  const v2 = resolveStackContent(
    parsed.langSlug, parsed.trackSlug, parsed.levelKey as Level, stackSlug
  );
  if (!v2 || v2.questions.length === 0) return null;

  return v2.questions.map((q, i) => ({
    id: 0,
    title: q.title || q.question || toDisplayName(q.slug),
    slug: q.slug,
    difficulty: normalizeDifficulty(q.difficulty as string | undefined),
    estimatedReadTime: q.reading_time_minutes ?? 8,
    orderIndex: i,
    domainSlug,
    stackSlug,
    subcategorySlug: '_root',
    subcategoryName: toDisplayName(stackSlug),
  }));
}

/**
 * Checks if a complete-qa.json file is a $ref file (has $source field).
 */
function isRefFileAt(filePath: string): boolean {
  const data = readJson<Record<string, unknown>>(filePath);
  return !!data && '$source' in data;
}

/**
 * Returns all questions for a stack as QuestionSummary[], preserving subcategory
 * and global ordering.
 *
 * Priority:
 *  1. If the stack's root complete-qa.json is a $ref file → resolve via contentV2
 *  2. complete-qa.json slugs are preferred (they have actual content).
 *  3. If a subcategory has a complete-qa.json, its questions come from there.
 *  4. If not, questions come from questions.json (may not have full content yet).
 */
export function getAllQuestionsForStack(
  domainSlug: string,
  stackSlug: string
): QuestionSummary[] {
  const cacheKey = `${domainSlug}::${stackSlug}::qOrdV3`;
  if (_stackQCache.has(cacheKey)) return _stackQCache.get(cacheKey)!;

  const dir = stackDir(domainSlug, stackSlug);
  const locked = isLockedDomain(domainSlug);

  // If the stack root has a $ref file, resolve via V2 chain (non-locked only).
  if (dir && !locked) {
    const rootQA = path.join(dir, 'complete-qa.json');
    if (fs.existsSync(rootQA) && isRefFileAt(rootQA)) {
      const v2Result = tryV2StackResolution(domainSlug, stackSlug);
      if (v2Result) {
        _cachePutBounded(_stackQCache, cacheKey, v2Result, _STACK_CACHE_MAX);
        return v2Result;
      }
    }
  }

  // No directory found — try V2 shared content fallback (non-locked only).
  // For locked domains (JBI, JFI), the locked tree is authoritative;
  // if there's no dir (and no contentSource fallback), there's no content.
  if (!dir) {
    if (locked) {
      _cachePutBounded(_stackQCache, cacheKey, [], _STACK_CACHE_MAX);
      return [];
    }
    const v2Result = tryV2StackResolution(domainSlug, stackSlug);
    if (v2Result) {
      _cachePutBounded(_stackQCache, cacheKey, v2Result, _STACK_CACHE_MAX);
      return v2Result;
    }
    return [];
  }

  const subcats = getSubcategorySlugs(domainSlug, stackSlug);
  const result: QuestionSummary[] = [];
  let orderIdx = 0;

  for (const subcatSlug of subcats) {
    // V2 flat: _root means complete-qa.json is directly in the stack dir
    const qaFile = subcatSlug === '_root'
      ? path.join(dir, 'complete-qa.json')
      : path.join(dir, subcatSlug, 'complete-qa.json');
    const qaQuestions = questionsFromCompleteQA(readJson<unknown>(qaFile));

    if (qaQuestions.length > 0) {
      for (const q of orderedRawQAEntries(qaQuestions)) {
        result.push({
          id: 0,
          title: q.title || toDisplayName(q.slug),
          slug: q.slug,
          difficulty: normalizeDifficulty(q.difficulty),
          estimatedReadTime: 8,
          orderIndex: orderIdx++,
          domainSlug,
          stackSlug,
          subcategorySlug: subcatSlug,
          subcategoryName: subcatSlug === '_root' ? toDisplayName(stackSlug) : toDisplayName(subcatSlug),
        });
      }
      continue;
    }

    // Fallback: questions.json (no complete-qa content yet) — skip for _root
    if (subcatSlug === '_root') continue;

    const questionsFile = path.join(dir, subcatSlug, 'questions.json');
    const rawData = readJson<RawQuestion[] | { questions: RawQuestion[] }>(questionsFile);
    const raw: RawQuestion[] = Array.isArray(rawData)
      ? rawData
      : (rawData as { questions?: RawQuestion[] })?.questions ?? [];

    for (const q of raw) {
      if (q.visible === false) continue;
      result.push({
        id: 0,
        title: q.title || toDisplayName(q.slug),
        slug: q.slug,
        difficulty: normalizeDifficulty(q.difficulty),
        estimatedReadTime: 8,
        orderIndex: orderIdx++,
        domainSlug,
        stackSlug,
        subcategorySlug: subcatSlug,
        subcategoryName: toDisplayName(subcatSlug),
      });
    }
  }

  _cachePutBounded(_stackQCache, cacheKey, result, _STACK_CACHE_MAX);
  return result;
}

/**
 * Returns subcategories with their questions — mirrors the StackSubcategory[]
 * shape returned by the Spring Boot /stacks/{slug}/subcategories endpoint.
 *
 * Same priority as getAllQuestionsForStack: complete-qa.json slugs first.
 */
export function getSubcategoriesWithQuestions(
  domainSlug: string,
  stackSlug: string
): StackSubcategory[] {
  // ::v5 — bumped to invalidate stale empty-question caches from concurrent
  // enrichment writes. Also ensures array-format complete-qa.json questions load.
  const cacheKey = `${domainSlug}::${stackSlug}::subcatsV5`;
  if (_subcatCache.has(cacheKey)) return _subcatCache.get(cacheKey)!;

  const dir = stackDir(domainSlug, stackSlug);
  const locked = isLockedDomain(domainSlug);

  // $ref detection: if the root file is a $ref, resolve via V2 (non-locked only).
  if (dir && !locked) {
    const rootQA = path.join(dir, 'complete-qa.json');
    if (fs.existsSync(rootQA) && isRefFileAt(rootQA)) {
      const v2Qs = tryV2StackResolution(domainSlug, stackSlug);
      if (v2Qs && v2Qs.length > 0) {
        const result: StackSubcategory[] = [{
          slug: '_root',
          name: toDisplayName(stackSlug),
          orderIndex: 0,
          questionCount: v2Qs.length,
          questions: v2Qs,
        }];
        _cachePutBounded(_subcatCache, cacheKey, result, _STACK_CACHE_MAX);
        return result;
      }
    }
  }

  // No directory — try V2 shared fallback (non-locked only).
  if (!dir) {
    if (locked) {
      _cachePutBounded(_subcatCache, cacheKey, [], _STACK_CACHE_MAX);
      return [];
    }
    const v2Qs = tryV2StackResolution(domainSlug, stackSlug);
    if (v2Qs && v2Qs.length > 0) {
      const result: StackSubcategory[] = [{
        slug: '_root',
        name: toDisplayName(stackSlug),
        orderIndex: 0,
        questionCount: v2Qs.length,
        questions: v2Qs,
      }];
      _cachePutBounded(_subcatCache, cacheKey, result, _STACK_CACHE_MAX);
      return result;
    }
    return [];
  }

  const subcats = getSubcategorySlugs(domainSlug, stackSlug);
  let globalOrder = 0;

  const result2 = subcats.map((subcatSlug, idx) => {
    // V2 flat: _root means complete-qa.json is directly in the stack dir
    const qaFile = subcatSlug === '_root'
      ? path.join(dir, 'complete-qa.json')
      : path.join(dir, subcatSlug, 'complete-qa.json');
    const qaQuestions = questionsFromCompleteQA(readJson<unknown>(qaFile));

    if (qaQuestions.length > 0) {
      const orderedQs = orderedRawQAEntries(qaQuestions);
      const questions: QuestionSummary[] = orderedQs.map(q => ({
        id: 0,
        title: q.title || toDisplayName(q.slug),
        slug: q.slug,
        difficulty: normalizeDifficulty(q.difficulty),
        estimatedReadTime: 8,
        orderIndex: globalOrder++,
        domainSlug,
        stackSlug,
        subcategorySlug: subcatSlug,
        subcategoryName: subcatSlug === '_root' ? toDisplayName(stackSlug) : toDisplayName(subcatSlug),
      }));
      return {
        slug: subcatSlug,
        name: subcatSlug === '_root' ? toDisplayName(stackSlug) : toDisplayName(subcatSlug),
        orderIndex: idx,
        questionCount: questions.length,
        questions,
      };
    }

    // Fallback: questions.json — skip for _root
    if (subcatSlug === '_root') {
      return {
        slug: subcatSlug,
        name: toDisplayName(stackSlug),
        orderIndex: idx,
        questionCount: 0,
        questions: [] as QuestionSummary[],
      };
    }

    const questionsFile = path.join(dir, subcatSlug, 'questions.json');
    const rawData = readJson<RawQuestion[] | { questions: RawQuestion[] }>(questionsFile);
    const raw: RawQuestion[] = Array.isArray(rawData)
      ? rawData
      : (rawData as { questions?: RawQuestion[] })?.questions ?? [];

    const questions: QuestionSummary[] = raw
      .filter(q => q.visible !== false)
      .map(q => ({
        id: 0,
        title: q.title || toDisplayName(q.slug),
        slug: q.slug,
        difficulty: normalizeDifficulty(q.difficulty),
        estimatedReadTime: 8,
        orderIndex: globalOrder++,
        domainSlug,
        stackSlug,
        subcategorySlug: subcatSlug,
        subcategoryName: toDisplayName(subcatSlug),
      }));

    return {
      slug: subcatSlug,
      name: toDisplayName(subcatSlug),
      orderIndex: idx,
      questionCount: questions.length,
      questions,
    };
  });

  _cachePutBounded(_subcatCache, cacheKey, result2, _STACK_CACHE_MAX);
  return result2;
}

/**
 * Scans every complete-qa.json file in the stack directory and returns
 * the first matching entry plus its subcategory slug.
 */
function findQAEntryAnywhere(
  dir: string,
  subcatSlugs: string[],
  questionSlug: string
): { qaEntry: RawQAEntry; subcatSlug: string } | null {
  for (const subcatSlug of subcatSlugs) {
    const qaFile = subcatSlug === '_root'
      ? path.join(dir, 'complete-qa.json')
      : path.join(dir, subcatSlug, 'complete-qa.json');
    const qaQuestions = questionsFromCompleteQA(readJson<unknown>(qaFile));
    const entry = qaQuestions.find(q => q.slug === questionSlug);
    if (entry) return { qaEntry: entry, subcatSlug };
  }
  return null;
}

/**
 * Builds a full QuestionPagePayload from JSON content files.
 * Returns null if the question slug cannot be found in the content directory.
 *
 * Strategy:
 *  1. Look up the slug in questions.json (the TOC index).
 *  2. Try the matched subcategory's complete-qa.json first.
 *  3. If not there (slug mismatch between questions.json and complete-qa.json),
 *     search ALL subcategories' complete-qa.json files.
 *  4. If still not found, return null.
 */
export function getQuestionPagePayload(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string
): QuestionPagePayload | null {
  // For locked domains (JBI, JFI, …) the content/<domainSlug>/ tree is the
  // SINGLE source of truth — Phase E moved all V2 content there. We must
  // NOT fall back to V2, because V2 still contains pre-migration copies and
  // would shadow the canonical answer when slugs collide.
  const parsed = parseDomainSlug(domainSlug);
  if (parsed && !isLockedDomain(domainSlug)) {
    const v2Payload = getV2QuestionPagePayload(
      parsed.langSlug, parsed.trackSlug, parsed.levelKey as Level,
      stackSlug, questionSlug
    );
    if (v2Payload) return v2Payload;
  }

  const dir = stackDir(domainSlug, stackSlug);
  if (!dir) return null;

  const subcatSlugs = getSubcategorySlugs(domainSlug, stackSlug);

  // Build the flat ordered list of all questions in this stack (from questions.json)
  const allQuestions = getAllQuestionsForStack(domainSlug, stackSlug);
  const currentIdx = allQuestions.findIndex(q => q.slug === questionSlug);

  let qaEntry: RawQAEntry | null = null;
  let foundSubcatSlug: string | null = null;

  if (currentIdx !== -1) {
    // Try the subcategory recorded in questions.json first (fast path)
    const hintSubcat = allQuestions[currentIdx].subcategorySlug!;
    const hintFile = hintSubcat === '_root'
      ? path.join(dir, 'complete-qa.json')
      : path.join(dir, hintSubcat, 'complete-qa.json');
    const hintEntry =
      questionsFromCompleteQA(readJson<unknown>(hintFile)).find(
        q => q.slug === questionSlug,
      ) ?? null;

    if (hintEntry) {
      qaEntry = hintEntry;
      foundSubcatSlug = hintSubcat;
    }
  }

  // Fall back: scan all subcategories (handles slug mismatches between
  // questions.json and complete-qa.json, and slugs that only appear in complete-qa.json)
  if (!qaEntry) {
    const found = findQAEntryAnywhere(dir, subcatSlugs, questionSlug);
    if (found) {
      qaEntry = found.qaEntry;
      foundSubcatSlug = found.subcatSlug;
    }
  }

  if (!qaEntry) {
    // The slug exists in questions.json (valid URL) but has no complete-qa answer yet.
    // Return a minimal placeholder so the page renders instead of 404-ing.
    if (currentIdx !== -1) {
      const stub = allQuestions[currentIdx];
      const stubPayload: QuestionPagePayload = {
        id: 0,
        title: stub.title,
        questionText: null,
        slug: questionSlug,
        difficulty: stub.difficulty,
        estimatedReadTime: 5,
        metaTitle: `${stub.title} | Interview Question`,
        metaDescription: null,
        stackId: null,
        stackName: toDisplayName(stackSlug),
        stackSlug,
        domainSlug,
        answerSections: [
          {
            id: 0,
            sectionType: 'core_concepts',
            sectionOrder: 0,
            content:
              '> **Detailed answer coming soon.**\n\nThis question is part of our content library and a full structured answer will be added shortly.\n\nIn the meantime, explore related questions in the sidebar.',
          },
        ],
        previousQuestion:
          currentIdx > 0
            ? { ...allQuestions[currentIdx - 1], id: 0, estimatedReadTime: 8, orderIndex: currentIdx - 1 }
            : null,
        nextQuestion:
          currentIdx < allQuestions.length - 1
            ? { ...allQuestions[currentIdx + 1], id: 0, estimatedReadTime: 8, orderIndex: currentIdx + 1 }
            : null,
        quickQuestions: allQuestions,
        relatedQuestions: [],
        concepts: [],
        internalLinks: [],
        recommendedQuestions: [],
        peopleAlsoAsk: [],
        interviewCoach: [],
        practiceChecklist: [],
        quizzes: [],
      };
      return stubPayload;
    }
    return null;
  }

  // Resolve the QuestionSummary for prev/next navigation.
  // If the slug was not in the questions.json index (resolvedIdx === -1), inject
  // a synthetic entry so the question appears correctly in quickQuestions and
  // prev/next can be computed. Without this, currentIdx stays -1 in the layout,
  // which hides both the sticky nav bar and the bottom Next/Prev buttons entirely.
  //
  // IMPORTANT: allQuestions is the cached array — do NOT mutate it. Use a
  // local copy so the cache stays clean across requests.
  let currentQ: QuestionSummary;
  let resolvedIdx = currentIdx;
  let questionsForPayload = allQuestions;
  if (currentIdx !== -1) {
    currentQ = allQuestions[currentIdx];
  } else {
    currentQ = {
      id: 0,
      title: qaEntry.title,
      slug: questionSlug,
      difficulty: (qaEntry.difficulty as QuestionSummary['difficulty']) || 'medium',
      estimatedReadTime: 8,
      orderIndex: allQuestions.length,
      domainSlug,
      stackSlug,
      subcategorySlug: foundSubcatSlug ?? undefined,
      subcategoryName: foundSubcatSlug ? toDisplayName(foundSubcatSlug) : undefined,
    };
    // Build a local copy with the synthetic entry appended. resolvedIdx is
    // set to the last position so previousQuestion correctly points to the
    // real last indexed question.
    questionsForPayload = [...allQuestions, currentQ];
    resolvedIdx = questionsForPayload.length - 1;
  }

  // Convert sections to AnswerSection[]
  const rawSections: RawSection[] = qaEntry.answer?.sections ?? [];
  let answerSections: AnswerSection[] = rawSections
    .map((s, i) => ({
      id: i,
      sectionType: s.type as AnswerSection['sectionType'],
      sectionOrder: i,
      content: sectionToContent(s),
      sectionTitle: s.title ?? '',
    }))
    .filter(s => s.content.length > 0);

  // Stub detection: explicit stub flag OR no usable sections → render the
  // "Detailed answer coming soon" placeholder so pages stay navigable while
  // answers are authored in a later pass.
  if (qaEntry.stub === true || answerSections.length === 0) {
    answerSections = [
      {
        id: 0,
        sectionType: 'core_concepts',
        sectionOrder: 0,
        content:
          '> **Detailed answer coming soon.**\n\nThis question is part of our curated interview-coverage set. A full structured answer (with code, pitfalls, and follow-ups) will be published in the next content pass.\n\nIn the meantime, explore related questions in the sidebar.',
        sectionTitle: '',
      },
    ];
  }

  const totalText = answerSections.map(s => s.content).join(' ');

  const toSummary = (q: QuestionSummary | null): QuestionSummary | null =>
    q
      ? {
          id: 0,
          title: q.title,
          slug: q.slug,
          difficulty: q.difficulty,
          estimatedReadTime: 8,
          orderIndex: q.orderIndex,
          domainSlug,
          stackSlug,
          subcategorySlug: q.subcategorySlug,
          subcategoryName: q.subcategoryName,
        }
      : null;

  return {
    id: 0,
    title: qaEntry.title || currentQ.title,
    questionText: qaEntry.question || null,
    slug: questionSlug,
    difficulty: (qaEntry.difficulty as QuestionPagePayload['difficulty']) || 'medium',
    estimatedReadTime: estimateReadTime(totalText),
    metaTitle:
      qaEntry.seo?.metaTitle?.trim() ||
      (qaEntry.title
        ? `${qaEntry.title} | ${toDisplayName(stackSlug)} Interview Q&A | InterviewExplainer`
        : null),
    metaDescription:
      qaEntry.seo?.metaDescription?.trim() ||
      (qaEntry.direct_answer
        ? stripMarkdown(qaEntry.direct_answer).slice(0, 155)
        : qaEntry.question
          ? `${qaEntry.question.slice(0, 140)}...`
          : null),
    stackId: null,
    stackName: toDisplayName(stackSlug),
    stackSlug,
    domainSlug,
    answerSections,
    previousQuestion: toSummary(resolvedIdx > 0 ? questionsForPayload[resolvedIdx - 1] : null),
    nextQuestion: toSummary(resolvedIdx !== -1 && resolvedIdx < questionsForPayload.length - 1 ? questionsForPayload[resolvedIdx + 1] : null),
    quickQuestions: questionsForPayload,
    relatedQuestions: [],
    concepts: [],
    internalLinks: [],
    recommendedQuestions: [],
    peopleAlsoAsk: [],
    interviewCoach: [],
    practiceChecklist: [],
    quizzes: [],
  };
}

/**
 * For any locked domain (JBI, JFI, …): returns the raw question object
 * (with all V2 extended fields like direct_answer, interviewer_intent,
 * company_tags, followup_questions, last_updated, layout_type, etc.) by
 * scanning every topic's complete-qa.json.
 *
 * When the module reuses content from another locked domain (via
 * _index.json.contentSource) the lookup transparently follows the fallback.
 *
 * Returns null for non-locked domains or if the slug is not found.
 *
 * Kept under the legacy name `getJBIRawQuestion` for backward compatibility
 * with existing call sites.
 */
export function getJBIRawQuestion(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string,
): Record<string, unknown> | null {
  if (!isLockedDomain(domainSlug)) return null;
  const modDir = resolveLockedModuleDir(domainSlug, stackSlug);
  if (!modDir || !fs.existsSync(modDir)) return null;

  // Check a direct complete-qa.json at the module root first (flat layout).
  const rootQA = path.join(modDir, 'complete-qa.json');
  if (fs.existsSync(rootQA)) {
    const match = questionsFromCompleteQA(readJson<unknown>(rootQA)).find(
      q => q.slug === questionSlug,
    );
    if (match) return match as unknown as Record<string, unknown>;
  }

  for (const entry of fs.readdirSync(modDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const qa = path.join(modDir, entry.name, 'complete-qa.json');
    const match = questionsFromCompleteQA(readJson<unknown>(qa)).find(
      q => q.slug === questionSlug,
    );
    if (match) return match as unknown as Record<string, unknown>;
  }
  return null;
}

/**
 * Returns all { domainSlug, stackSlug, questionSlug } combos that exist in the
 * local content tree. Used by generateStaticParams to pre-build question pages.
 */
/** Scan a content root directory and collect all question params. */
function scanContentRoot(
  root: string,
  params: { domainSlug: string; stackSlug: string; questionSlug: string }[],
  seen: Set<string>,
): void {
  const domainSlugs = Object.keys(SLUG_TO_PATH);

  for (const domainSlug of domainSlugs) {
    const rel = SLUG_TO_PATH[domainSlug];
    if (!rel || seen.has(`${root}:${rel}`)) continue;
    seen.add(`${root}:${rel}`);

    const domainDir = path.join(root, rel);
    if (!fs.existsSync(domainDir)) continue;

    for (const stackSlug of fs.readdirSync(domainDir)) {
      const stackPath = path.join(domainDir, stackSlug);
      if (!fs.statSync(stackPath).isDirectory()) continue;

      for (const subcat of fs.readdirSync(stackPath)) {
        const subcatPath = path.join(stackPath, subcat);
        if (!fs.statSync(subcatPath).isDirectory()) continue;

        // Check questions.json (old style)
        const questionsFile = path.join(subcatPath, 'questions.json');
        if (fs.existsSync(questionsFile)) {
          const data = readJson<{ questions: { slug: string }[] }>(questionsFile);
          if (data?.questions) {
            for (const q of data.questions) {
              if (q.slug) params.push({ domainSlug, stackSlug, questionSlug: q.slug });
            }
          }
        }

        // Also check complete-qa.json (new style)
        const qaFile = path.join(subcatPath, 'complete-qa.json');
        if (fs.existsSync(qaFile)) {
          for (const q of questionsFromCompleteQA(readJson<unknown>(qaFile))) {
            if (q.slug) params.push({ domainSlug, stackSlug, questionSlug: q.slug });
          }
        }
      }
    }
  }
}

export function listAllQuestionParams(): {
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
}[] {
  const params: { domainSlug: string; stackSlug: string; questionSlug: string }[] = [];
  const seen = new Set<string>();

  // Scan legacy content/domains/ first
  scanContentRoot(CONTENT_ROOT, params, seen);

  // Then scan new content/interview/ (higher priority — slug deduplication handled by seen set scoped per root)
  if (fs.existsSync(CONTENT_INTERVIEW_ROOT)) {
    scanContentRoot(CONTENT_INTERVIEW_ROOT, params, seen);
  }

  // Deduplicate same questionSlug appearing from both roots
  const uniqueMap = new Map<string, typeof params[0]>();
  for (const p of params) {
    const key = `${p.domainSlug}:${p.stackSlug}:${p.questionSlug}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, p);
  }

  return Array.from(uniqueMap.values());
}
