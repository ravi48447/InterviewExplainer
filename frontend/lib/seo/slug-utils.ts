/**
 * lib/seo/slug-utils.ts — Slug Architecture (P02-T073–T084)
 *
 * Canonical slug policy: lowercase, hyphenated, ASCII, no trailing/leading
 * hyphens, no double hyphens. This is the single slug normalizer — all
 * slugs flow through here (T073, T080).
 *
 * Display names are separate from public slugs (T083). Slugs are stable
 * identifiers (T074, T075) and never derive from unstable array indexes
 * (T082).
 */

import { seoFail } from './config'

/** Validate that a string is a well-formed slug (T080). */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false
  // Lowercase, ASCII, hyphens, digits, dots allowed; no leading/trailing hyphen
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) || /^[a-z0-9]$/.test(slug)
}

/** Normalize any input string into a canonical slug (T061, T073, T080). */
export function normalizeSlug(input: string): string {
  if (!input || typeof input !== 'string') {
    seoFail('normalizeSlug received empty input', { input })
    return ''
  }
  let slug = input
    .trim()
    .toLowerCase()
    // Convert whitespace and underscores to hyphens
    .replace(/[\s_]+/g, '-')
    // Remove non-ascii alphanumeric/hyphen
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
    // Strip leading/trailing hyphens
    .replace(/^-+|-+$/g, '')

  if (!slug) {
    seoFail('normalizeSlug produced empty slug', { input })
    return ''
  }
  return slug
}

/** Prevent empty slugs (T081). Throws in dev, warns in prod. */
export function assertNonEmptySlug(slug: string, context: string): void {
  if (!slug || slug.trim() === '') {
    seoFail(`Empty slug in ${context}`)
  }
}

/** Separate display name from public slug (T083). */
export interface SlugWithDisplay {
  slug: string
  display: string
}

/** Create a slug/display pair from a human name. */
export function slugFromName(name: string): SlugWithDisplay {
  return {
    slug: normalizeSlug(name),
    display: name.trim(),
  }
}

/**
 * Detect duplicate slugs within a collection (T076).
 * Returns a map of slug → count for duplicates only.
 */
export function detectDuplicateSlugs(slugs: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const s of slugs) {
    counts.set(s, (counts.get(s) ?? 0) + 1)
  }
  const dupes = new Map<string, number>()
  for (const [s, c] of counts) {
    if (c > 1) dupes.set(s, c)
  }
  return dupes
}

/**
 * Detect cross-hierarchy slug ambiguity (T077) — the same slug appearing
 * at different hierarchy levels which would make URLs ambiguous.
 * Returns true if any slug is reused across levels.
 */
export function detectCrossHierarchyAmbiguity(
  levels: Record<string, string[]>,
): boolean {
  const allSlugs = new Set<string>()
  for (const [level, slugs] of Object.entries(levels)) {
    for (const s of slugs) {
      if (allSlugs.has(s)) {
        seoFail(`Cross-hierarchy slug ambiguity: "${s}" reused`, { level })
        return true
      }
      allSlugs.add(s)
    }
  }
  return false
}

/**
 * Slug migration mapping (T078, T079) — preserve historical slugs.
 * Key = old slug, value = new canonical slug.
 */
const HISTORICAL_SLUG_MAP = new Map<string, string>()

/** Register a slug rename so the old slug 301-redirects to the new one. */
export function registerSlugMigration(oldSlug: string, newSlug: string): void {
  HISTORICAL_SLUG_MAP.set(normalizeSlug(oldSlug), normalizeSlug(newSlug))
}

/** Resolve a historical slug to its current canonical, or return the input. */
export function resolveHistoricalSlug(slug: string): string {
  const normalized = normalizeSlug(slug)
  return HISTORICAL_SLUG_MAP.get(normalized) ?? normalized
}

/** Get all historical→canonical mappings (for redirect registry). */
export function getHistoricalSlugMappings(): Array<{ from: string; to: string }> {
  return Array.from(HISTORICAL_SLUG_MAP.entries()).map(([from, to]) => ({ from, to }))
}

/** Establish slug change procedure (T084) — document + register migration. */
export function changeSlug(oldSlug: string, newSlug: string, reason: string): void {
  registerSlugMigration(oldSlug, newSlug)
  // The reason is documented via the decision log; this function ensures the
  // redirect mapping is registered atomically with the slug change.
  console.info(`[SEO] Slug change: ${oldSlug} → ${newSlug} (${reason})`)
}
