/**
 * Single source of truth for experience levels across the entire platform.
 *
 * Keys are used in: URLs (domainSlug suffix), JSON content, localStorage, code.
 * Labels + ranges are shown in the UI.
 *
 * Content directories (canonical):
 *   beginner      → content/.../{lang}/backend/beginner   (0–2 yrs)
 *   intermediate  → content/.../{lang}/backend/intermediate (2–5 yrs)
 */

export type ExperienceLevelKey = 'beginner' | 'intermediate';

export interface ExperienceLevelMeta {
  label: string;
  range: string;
  /** Legacy directory name(s) this level maps to — first one with content wins */
  legacyDirs: string[];
  /** Tailwind / hex colour used in UI badges */
  color: string;
  colorClass: string;
}

export const EXPERIENCE_LEVELS: Record<ExperienceLevelKey, ExperienceLevelMeta> = {
  beginner: {
    label: 'Beginner',
    range: '0–2 yrs',
    legacyDirs: ['beginner', '1-3', '0-1'],
    color: '#22c55e',
    colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  intermediate: {
    label: 'Intermediate',
    range: '2–5 yrs',
    legacyDirs: ['intermediate', '3-5'],
    color: '#f59e0b',
    colorClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
};

export const LEVEL_KEYS = Object.keys(EXPERIENCE_LEVELS) as ExperienceLevelKey[];

/** Display string: "Intermediate (2–5 yrs)" */
export function levelDisplay(key: ExperienceLevelKey): string {
  const lvl = EXPERIENCE_LEVELS[key];
  return `${lvl.label} (${lvl.range})`;
}

/**
 * Derive the experience level key from a legacy directory name or domain slug suffix.
 * Examples:
 *   "1-3"           → "beginner"
 *   "0-1"           → "beginner"
 *   "3-5"           → "intermediate"
 *   "beginner"      → "beginner"
 *   "intermediate"  → "intermediate"
 */
export function levelKeyFromLegacy(legacy: string): ExperienceLevelKey {
  for (const [key, meta] of Object.entries(EXPERIENCE_LEVELS) as [ExperienceLevelKey, ExperienceLevelMeta][]) {
    if (meta.legacyDirs.includes(legacy)) return key;
    if (key === legacy) return key;
  }
  return 'beginner';
}

/**
 * Returns the primary legacy directory for a level key.
 * Used to resolve the content path from the new level slugs.
 */
export function primaryLegacyDir(key: ExperienceLevelKey): string {
  return EXPERIENCE_LEVELS[key].legacyDirs[0];
}

// ─── localStorage helpers (client-side only) ──────────────────────────────────

const LS_KEY = 'ie_level';

/**
 * Default experience level for unauthenticated users.
 * Matches MASTER_PLAN.md: "Default is always intermediate."
 */
export const DEFAULT_LEVEL: ExperienceLevelKey = 'intermediate';

export function getSavedLevel(): ExperienceLevelKey {
  if (typeof window === 'undefined') return DEFAULT_LEVEL;
  const saved = localStorage.getItem(LS_KEY) as ExperienceLevelKey | null;
  return saved && saved in EXPERIENCE_LEVELS ? saved : DEFAULT_LEVEL;
}

export function saveLevel(key: ExperienceLevelKey): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, key);
  // Also set cookie so middleware can redirect content pages to the user's level.
  // 30-day expiry. Path=/ so it applies site-wide.
  const maxAge = 60 * 60 * 24 * 30; // 30 days in seconds
  document.cookie = `ie_level=${key};path=/;max-age=${maxAge};SameSite=Lax`;
}

/**
 * Clears the saved level preference (called on logout).
 * Resets to intermediate (the anonymous/SEO default).
 */
export function clearLevel(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LS_KEY);
  document.cookie = 'ie_level=;path=/;max-age=0';
}

/**
 * Gets the active level for a given user context.
 * - If user has a saved preference → use it.
 * - Otherwise → DEFAULT_LEVEL (intermediate).
 * Use this everywhere we decide which level of content to show.
 */
export function getActiveLevel(userLevelOverride?: ExperienceLevelKey | null): ExperienceLevelKey {
  if (userLevelOverride && userLevelOverride in EXPERIENCE_LEVELS) return userLevelOverride;
  return getSavedLevel();
}
