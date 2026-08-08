import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  EXPERIENCE_LEVELS,
  levelDisplay,
  type ExperienceLevelKey,
} from '@/lib/levels';
import { LANG_DISPLAY, TRACK_DISPLAY } from '@/lib/domain-display';
import { resolveStackContent } from '@/lib/contentV2';
import type { Level } from '@/lib/contentV2-types';
import type { ContentDomain } from '@/lib/types/content-domain';

export type { ContentDomain } from '@/lib/types/content-domain';

// Cache the HTTP response at the framework layer.
export const revalidate = 3600;

// Process-wide cache. This route walks the entire content/ tree (63 MB,
// 1596 complete-qa.json files) and JSON.parses everything — without caching,
// a single navigation to /domains can allocate multi-GB of heap and time out.
// Store result on globalThis so HMR in dev doesn't wipe it.
const g = globalThis as typeof globalThis & {
  _ie_allDomainsCache?: { at: number; body: ContentDomain[] };
  _ie_allDomainsInflight?: Promise<ContentDomain[]>;
};
const ALL_DOMAINS_TTL_MS = 10 * 60 * 1000; // 10 minutes

const CONTENT_ROOT = path.join(process.cwd(), '..', 'content', 'domains');
const CONTENT_INTERVIEW_ROOT = path.join(process.cwd(), '..', 'content', 'interview');

const VALID_LEVELS: ExperienceLevelKey[] = ['beginner', 'intermediate'];

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Question counting ─────────────────────────────────────────────────────

function countQuestionsInStack(stackDir: string): number {
  if (!fs.existsSync(stackDir)) return 0;
  let count = 0;

  const directQA = path.join(stackDir, 'complete-qa.json');
  if (fs.existsSync(directQA)) {
    try {
      const data = JSON.parse(fs.readFileSync(directQA, 'utf-8'));
      if (data.questions && Array.isArray(data.questions)) count += data.questions.length;
    } catch {}
  }

  const directQf = path.join(stackDir, 'questions.json');
  if (fs.existsSync(directQf)) {
    try {
      const d = JSON.parse(fs.readFileSync(directQf, 'utf-8'));
      const arr: Array<{ visible?: boolean }> = Array.isArray(d) ? d : (d.questions ?? []);
      count += arr.filter(q => q.visible !== false).length;
    } catch {}
  }

  try {
    for (const subEntry of fs.readdirSync(stackDir, { withFileTypes: true })) {
      if (!subEntry.isDirectory()) continue;
      const subcatDir = path.join(stackDir, subEntry.name);

      const subcatCfg = path.join(subcatDir, '_config.json');
      if (fs.existsSync(subcatCfg)) {
        try { if (JSON.parse(fs.readFileSync(subcatCfg, 'utf-8')).visible === false) continue; } catch {}
      }

      const subcatQA = path.join(subcatDir, 'complete-qa.json');
      if (fs.existsSync(subcatQA)) {
        try {
          const data = JSON.parse(fs.readFileSync(subcatQA, 'utf-8'));
          if (data.questions && Array.isArray(data.questions)) { count += data.questions.length; continue; }
        } catch {}
      }

      const qf = path.join(subcatDir, 'questions.json');
      if (!fs.existsSync(qf)) continue;
      try {
        const d = JSON.parse(fs.readFileSync(qf, 'utf-8'));
        const arr: Array<{ visible?: boolean }> = Array.isArray(d) ? d : (d.questions ?? []);
        count += arr.filter(q => q.visible !== false).length;
      } catch {}
    }
  } catch {}
  return count;
}

/**
 * Count stacks and questions in a V2 level directory.
 * Uses resolveStackContent to handle $ref files — counts resolved questions.
 */
function countV2LevelContent(
  levelDir: string,
  langSlug: string,
  trackSlug: string,
  level: Level,
): { stackCount: number; questionCount: number } {
  let stackCount = 0;
  let questionCount = 0;

  if (!fs.existsSync(levelDir)) return { stackCount, questionCount };

  try {
    for (const entry of fs.readdirSync(levelDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const sDir = path.join(levelDir, entry.name);

      const cfg = path.join(sDir, '_config.json');
      if (fs.existsSync(cfg)) {
        try { if (JSON.parse(fs.readFileSync(cfg, 'utf-8')).visible === false) continue; } catch {}
      }

      // Try V2 resolution (handles $ref files + shared fallback)
      const v2Content = resolveStackContent(langSlug, trackSlug, level, entry.name);
      let qCount = v2Content ? v2Content.questions.length : 0;

      // If V2 didn't find anything, count from filesystem
      if (qCount === 0) {
        qCount = countQuestionsInStack(sDir);
      }

      if (qCount > 0) {
        stackCount++;
        questionCount += qCount;
      }
    }
  } catch {}

  return { stackCount, questionCount };
}

function countLegacyLevelContent(dir: string): { stackCount: number; questionCount: number } {
  let stackCount = 0;
  let questionCount = 0;
  if (!fs.existsSync(dir)) return { stackCount, questionCount };

  const stacksDir = path.join(dir, 'stacks');
  const scanDir = fs.existsSync(stacksDir) ? stacksDir : dir;

  try {
    for (const entry of fs.readdirSync(scanDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const sDir = path.join(scanDir, entry.name);
      const cfg = path.join(sDir, '_config.json');
      if (fs.existsSync(cfg)) {
        try { if (JSON.parse(fs.readFileSync(cfg, 'utf-8')).visible === false) continue; } catch {}
      }
      const stackQs = countQuestionsInStack(sDir);
      if (stackQs > 0) {
        stackCount++;
        questionCount += stackQs;
      }
    }
  } catch {}

  return { stackCount, questionCount };
}

// ─── Legacy directory lookup ────────────────────────────────────────────────

const LEGACY_DIRS: Record<ExperienceLevelKey, string[]> = {
  beginner:     ['beginner', '1-3', '0-1'],
  intermediate: ['intermediate', '3-5'],
};

function findLegacyDir(langSlug: string, trackSlug: string, level: ExperienceLevelKey): string | null {
  for (const dir of LEGACY_DIRS[level]) {
    const fullPath = path.join(CONTENT_ROOT, langSlug, trackSlug, dir);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
}

// ─── Scan ───────────────────────────────────────────────────────────────────
//
// Walks the content tree and builds the full `ContentDomain[]`. Expensive:
// reads ~65 MB of JSON on a cold cache. Extracted into a standalone function
// so it can be called from both the GET handler AND a boot-time warm-up.

// ─── Locked-domain registry ──────────────────────────────────────────────────
//
// Locked domains live under content/<domainSlug>/ and are NOT auto-discoverable
// by the Phase 1/2 filesystem scan (which only walks content/interview/ and
// content/domains/). We inject them statically in Phase 0 so they always show
// up in the /domains browser regardless of question count.
//
// For each entry we read totalModules from the domain's _index.json at runtime.

interface LockedDomainConfig {
  domainSlug: string;
  rootDir: string;
  languageSlug: string;
  trackSlug: string;
  /** Closest ExperienceLevelKey for display; e.g. 'fresher' maps to 'beginner'. */
  level: ExperienceLevelKey;
  /** Override display label when the canonical level label doesn't match (e.g. "Fresher"). */
  levelLabelOverride?: string;
}

const LOCKED_DOMAIN_REGISTRY: LockedDomainConfig[] = [
  {
    domainSlug:   'java-backend-intermediate',
    rootDir:      path.join(process.cwd(), '..', 'content', 'java-backend-intermediate'),
    languageSlug: 'java',
    trackSlug:    'backend',
    level:        'intermediate',
  },
  {
    domainSlug:   'java-fullstack-intermediate',
    rootDir:      path.join(process.cwd(), '..', 'content', 'java-fullstack-intermediate'),
    languageSlug: 'java',
    trackSlug:    'fullstack',
    level:        'intermediate',
  },
  {
    domainSlug:        'java-backend-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'java-backend-fresher'),
    languageSlug:      'java',
    trackSlug:         'backend',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
  {
    domainSlug:   'go-intermediate',
    rootDir:      path.join(process.cwd(), '..', 'content', 'go-intermediate'),
    languageSlug: 'go',
    trackSlug:    'backend',
    level:        'intermediate',
  },
  {
    domainSlug:        'go-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'go-fresher'),
    languageSlug:      'go',
    trackSlug:         'backend',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
  {
    domainSlug:        'java-fullstack-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'java-fullstack-fresher'),
    languageSlug:      'java',
    trackSlug:         'fullstack',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
  {
    domainSlug:        'python-backend-intermediate',
    rootDir:           path.join(process.cwd(), '..', 'content', 'python-backend-intermediate'),
    languageSlug:      'python',
    trackSlug:         'backend',
    level:             'intermediate',
  },
  {
    domainSlug:        'python-backend-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'python-backend-fresher'),
    languageSlug:      'python',
    trackSlug:         'backend',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
  {
    domainSlug:        'ruby-backend-intermediate',
    rootDir:           path.join(process.cwd(), '..', 'content', 'ruby-backend-intermediate'),
    languageSlug:      'ruby',
    trackSlug:         'backend',
    level:             'intermediate',
  },
  {
    domainSlug:        'ruby-backend-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'ruby-backend-fresher'),
    languageSlug:      'ruby',
    trackSlug:         'backend',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
  {
    domainSlug:   'frontend-intermediate',
    rootDir:      path.join(process.cwd(), '..', 'content', 'frontend-intermediate'),
    languageSlug: 'frontend',
    trackSlug:    'frontend',
    level:        'intermediate',
  },
  {
    domainSlug:        'frontend-fresher',
    rootDir:           path.join(process.cwd(), '..', 'content', 'frontend-fresher'),
    languageSlug:      'frontend',
    trackSlug:         'frontend',
    level:             'beginner',
    levelLabelOverride: 'Fresher',
  },
];

function computeAllDomains(): ContentDomain[] {
  const domains: ContentDomain[] = [];
  const seen = new Set<string>();

  // Phase 0: Locked domains — statically registered, not auto-discoverable.
  for (const cfg of LOCKED_DOMAIN_REGISTRY) {
    if (seen.has(cfg.domainSlug)) continue;
    seen.add(cfg.domainSlug);
    // Also mark the standard {lang}-{track}-{level} slug as seen so Phase 1/2
    // don't emit a redundant entry for the same lang+track+level combination.
    seen.add(`${cfg.languageSlug}-${cfg.trackSlug}-${cfg.level}`);

    // Read module count from _index.json (fast: one file per domain).
    let stackCount = 0;
    const indexPath = path.join(cfg.rootDir, '_index.json');
    if (fs.existsSync(indexPath)) {
      try {
        const idx = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as {
          totalModules?: number;
          modules?: unknown[];
        };
        stackCount = idx.totalModules ?? (Array.isArray(idx.modules) ? idx.modules.length : 0);
      } catch {}
    }

    const meta    = EXPERIENCE_LEVELS[cfg.level];
    const langName  = LANG_DISPLAY[cfg.languageSlug]  || toTitleCase(cfg.languageSlug);
    const trackName = TRACK_DISPLAY[cfg.trackSlug]    || toTitleCase(cfg.trackSlug);
    const label     = cfg.levelLabelOverride ?? meta.label;

    domains.push({
      slug:           cfg.domainSlug,
      name:           `${langName} ${trackName}`,
      language:       langName,
      languageSlug:   cfg.languageSlug,
      track:          trackName,
      trackSlug:      cfg.trackSlug,
      level:          cfg.level,
      levelLabel:     label,
      levelRange:     meta.range,
      levelDisplay:   levelDisplay(cfg.level),
      levelColor:     meta.color,
      levelColorClass: meta.colorClass,
      stackCount,
      questionCount:  stackCount,
      contentPath:    cfg.domainSlug,
      hasContent:     stackCount > 0,
    });
  }

  // Phase 1: Auto-discover from content/interview/
  if (fs.existsSync(CONTENT_INTERVIEW_ROOT)) {
    try {
      for (const langEntry of fs.readdirSync(CONTENT_INTERVIEW_ROOT, { withFileTypes: true })) {
        if (!langEntry.isDirectory()) continue;
        const langSlug = langEntry.name;
        const langDir = path.join(CONTENT_INTERVIEW_ROOT, langSlug);

        for (const trackEntry of fs.readdirSync(langDir, { withFileTypes: true })) {
          if (!trackEntry.isDirectory()) continue;
          const trackSlug = trackEntry.name;

          for (const level of VALID_LEVELS) {
            const canonicalSlug = `${langSlug}-${trackSlug}-${level}`;
            if (seen.has(canonicalSlug)) continue;
            seen.add(canonicalSlug);

            const meta = EXPERIENCE_LEVELS[level];
            const v2LevelDir = path.join(CONTENT_INTERVIEW_ROOT, langSlug, trackSlug, level);

            let stackCount = 0;
            let questionCount = 0;

            // Count V2 content
            if (fs.existsSync(v2LevelDir)) {
              const v2Counts = countV2LevelContent(v2LevelDir, langSlug, trackSlug, level);
              stackCount = v2Counts.stackCount;
              questionCount = v2Counts.questionCount;
            }

            // Merge legacy content
            const legacyDir = findLegacyDir(langSlug, trackSlug, level);
            if (legacyDir) {
              const legacyCounts = countLegacyLevelContent(legacyDir);
              // Only use legacy if it has MORE content (V2 is authoritative when both exist)
              if (legacyCounts.questionCount > questionCount) {
                stackCount = legacyCounts.stackCount;
                questionCount = legacyCounts.questionCount;
              }
            }

            const langName = LANG_DISPLAY[langSlug] || toTitleCase(langSlug);
            const trackName = TRACK_DISPLAY[trackSlug] || toTitleCase(trackSlug);

            domains.push({
              slug: canonicalSlug,
              name: `${langName} ${trackName}`,
              language: langName,
              languageSlug: langSlug,
              track: trackName,
              trackSlug,
              level,
              levelLabel: meta.label,
              levelRange: meta.range,
              levelDisplay: levelDisplay(level),
              levelColor: meta.color,
              levelColorClass: meta.colorClass,
              stackCount,
              questionCount,
              contentPath: `${langSlug}/${trackSlug}/${level}`,
              hasContent: questionCount > 0,
            });
          }
        }
      }
    } catch {}
  }

  // Phase 2: Scan legacy content/domains/ for anything not already discovered
  if (fs.existsSync(CONTENT_ROOT)) {
    try {
      for (const langEntry of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
        if (!langEntry.isDirectory()) continue;
        const langSlug = langEntry.name;
        const langDir = path.join(CONTENT_ROOT, langSlug);

        for (const trackEntry of fs.readdirSync(langDir, { withFileTypes: true })) {
          if (!trackEntry.isDirectory()) continue;
          const trackSlug = trackEntry.name;

          for (const level of VALID_LEVELS) {
            const canonicalSlug = `${langSlug}-${trackSlug}-${level}`;
            if (seen.has(canonicalSlug)) continue;
            seen.add(canonicalSlug);

            const meta = EXPERIENCE_LEVELS[level];
            const legacyDir = findLegacyDir(langSlug, trackSlug, level);

            let stackCount = 0;
            let questionCount = 0;

            if (legacyDir) {
              const legacyCounts = countLegacyLevelContent(legacyDir);
              stackCount = legacyCounts.stackCount;
              questionCount = legacyCounts.questionCount;
            }

            const langName = LANG_DISPLAY[langSlug] || toTitleCase(langSlug);
            const trackName = TRACK_DISPLAY[trackSlug] || toTitleCase(trackSlug);

            domains.push({
              slug: canonicalSlug,
              name: `${langName} ${trackName}`,
              language: langName,
              languageSlug: langSlug,
              track: trackName,
              trackSlug,
              level,
              levelLabel: meta.label,
              levelRange: meta.range,
              levelDisplay: levelDisplay(level),
              levelColor: meta.color,
              levelColorClass: meta.colorClass,
              stackCount,
              questionCount,
              contentPath: `${langSlug}/${trackSlug}/${level}`,
              hasContent: questionCount > 0,
            });
          }
        }
      }
    } catch {}
  }

  return domains;
}

// ─── Cache + coalescing ─────────────────────────────────────────────────────

function getAllDomains(): Promise<ContentDomain[]> {
  const cached = g._ie_allDomainsCache;
  if (cached && Date.now() - cached.at < ALL_DOMAINS_TTL_MS) {
    return Promise.resolve(cached.body);
  }
  if (g._ie_allDomainsInflight) return g._ie_allDomainsInflight;

  const started = Date.now();
  const work = new Promise<ContentDomain[]>((resolve) => {
    // Hop off the request microtask so the first concurrent caller doesn't
    // block on the synchronous fs scan any more than one caller already has to.
    setImmediate(() => {
      try {
        const body = computeAllDomains();
        g._ie_allDomainsCache = { at: Date.now(), body };
        const ms = Date.now() - started;
        if (ms > 250) {
          // eslint-disable-next-line no-console
          console.log(`[all-domains] scanned ${body.length} domains in ${ms}ms`);
        }
        resolve(body);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[all-domains] scan failed:', err);
        resolve([]);
      } finally {
        g._ie_allDomainsInflight = undefined;
      }
    });
  });

  g._ie_allDomainsInflight = work;
  return work;
}

// NOTE: We deliberately do NOT kick off a warm-up at module-load time.
// The first /domains visit triggers `getAllDomains()` on-demand and coalesces
// concurrent callers via `_ie_allDomainsInflight`, which is good enough.
// A module-load warm-up would fire a 65 MB fs scan on every Turbopack HMR
// reload of this route module, causing CPU spikes during development.

// ─── GET handler ────────────────────────────────────────────────────────────

export async function GET() {
  const body = await getAllDomains();
  return NextResponse.json(body);
}
