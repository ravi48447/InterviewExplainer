/**
 * domain-display.ts — Display name mappings and slug parsing for all domains.
 *
 * Works on both client and server (no fs/path imports).
 * Central authority for converting domain slugs like "data-analyst-sql-analytics-beginner"
 * into structured { langSlug, trackSlug, levelKey, language, track } objects.
 */

import { type ExperienceLevelKey, EXPERIENCE_LEVELS } from './levels';

// ─── Display name maps ──────────────────────────────────────────────────────

export const LANG_DISPLAY: Record<string, string> = {
  'java':             'Java',
  'python':           'Python',
  'javascript':       'JavaScript',
  'typescript':       'TypeScript',
  'go':               'Go',
  'kotlin':           'Kotlin',
  'csharp':           'C#',
  'ruby':             'Ruby',
  'frontend':         'Frontend',
  'devops':           'DevOps',
  'data-analyst':     'Data Analyst',
  'business-analyst': 'Business Analyst',
};

export const TRACK_DISPLAY: Record<string, string> = {
  'backend':          'Backend',
  'frontend':         'Frontend',
  'fullstack':        'Fullstack',
  'cicd':             'CI/CD',
  'cloud':            'Cloud',
  'infrastructure':   'Infrastructure',
  'sre':              'SRE',
  'data-engineering': 'Data Engineering',
  'ml-ai':            'ML & AI',
  'sql-analytics':    'SQL Analytics',
  'python-analysis':  'Python Analysis',
  'visualization':    'Visualization',
  'case-studies':     'Case Studies',
  'analysis':         'Analysis',
};

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Domain slug parser ─────────────────────────────────────────────────────

export interface ParsedDomainSlug {
  langSlug: string;
  trackSlug: string;
  levelKey: ExperienceLevelKey;
  language: string;
  track: string;
}

/**
 * Parses any domain slug into its components, handling multi-word lang/track slugs.
 *
 * Examples:
 *   "java-backend-beginner"                  → { lang: "java", track: "backend", level: "beginner" }
 *   "data-analyst-sql-analytics-intermediate" → { lang: "data-analyst", track: "sql-analytics", level: "intermediate" }
 *   "python-ml-ai-advanced"                  → { lang: "python", track: "ml-ai", level: "advanced" }
 *   "devops-cicd-beginner"                   → { lang: "devops", track: "cicd", level: "beginner" }
 */
export function parseDomainSlug(slug: string): ParsedDomainSlug | null {
  // "fresher" is treated as beginner (0–1 yr, equivalent)
  const LEVEL_ALIASES: Record<string, ExperienceLevelKey> = { fresher: 'beginner' };
  const levelKeys: ExperienceLevelKey[] = ['beginner', 'intermediate'];

  // Step 1: Extract level from the end (including aliases like "fresher")
  let levelKey: ExperienceLevelKey | null = null;
  let prefix: string = slug;
  for (const lk of levelKeys) {
    if (slug.endsWith(`-${lk}`)) {
      levelKey = lk;
      prefix = slug.slice(0, slug.length - lk.length - 1);
      break;
    }
  }
  if (!levelKey) {
    for (const [alias, mapped] of Object.entries(LEVEL_ALIASES)) {
      if (slug.endsWith(`-${alias}`)) {
        levelKey = mapped;
        prefix = slug.slice(0, slug.length - alias.length - 1);
        break;
      }
    }
  }
  if (!levelKey) return null;

  // Step 2: Match lang slug (sorted longest first to prevent partial matches)
  const langSlugs = Object.keys(LANG_DISPLAY).sort((a, b) => b.length - a.length);
  for (const ls of langSlugs) {
    if (prefix.startsWith(`${ls}-`)) {
      const trackSlug = prefix.slice(ls.length + 1);
      if (trackSlug) {
        return {
          langSlug: ls,
          trackSlug,
          levelKey,
          language: LANG_DISPLAY[ls],
          track: TRACK_DISPLAY[trackSlug] || toTitleCase(trackSlug),
        };
      }
    }
  }

  // Step 3: Handle lang-only prefix (e.g. "go" from "go-intermediate")
  if (LANG_DISPLAY[prefix]) {
    return {
      langSlug: prefix,
      trackSlug: '',
      levelKey,
      language: LANG_DISPLAY[prefix],
      track: '',
    };
  }

  // Step 4: Fallback — assume single-word lang with track
  const parts = prefix.split('-');
  if (parts.length < 2) return null;
  const langSlug = parts[0];
  const trackSlug = parts.slice(1).join('-');
  return {
    langSlug,
    trackSlug,
    levelKey,
    language: LANG_DISPLAY[langSlug] || toTitleCase(langSlug),
    track: TRACK_DISPLAY[trackSlug] || toTitleCase(trackSlug),
  };
}

/**
 * Converts a parsed domain slug back to a content path: "java/backend/beginner".
 */
export function parsedToContentPath(p: ParsedDomainSlug): string {
  return `${p.langSlug}/${p.trackSlug}/${p.levelKey}`;
}
