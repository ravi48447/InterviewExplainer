/**
 * lib/seo/legacy-cleanup.ts — Legacy SEO Code Cleanup (P02-AR, T421+)
 *
 * Tracks the removal of scattered SEO code that the centralized
 * lib/seo/ system replaces:
 * - 290 scattered SITE_URL references → getCanonicalOrigin()
 * - 22 scattered generateMetadata functions → buildMetadata()
 * - Multiple sitemap files with string concatenation → sitemap-system
 * - Hardcoded robots.ts paths → robots from registry
 *
 * This module provides a migration map and audit function to verify
 * that legacy patterns have been removed.
 */

/** Legacy patterns that should no longer exist in the codebase. */
export const LEGACY_PATTERNS = [
  {
    pattern: /process\.env\.NEXT_PUBLIC_SITE_URL/g,
    replacement: 'getCanonicalOrigin() from "@/lib/seo"',
    reason: 'T012: scattered SITE_URL references',
    file: 'lib/seo/config.ts',
  },
  {
    pattern: /interviewexplainer\.com(?!\/)/g,
    replacement: 'PRODUCTION_ORIGIN from "@/lib/seo/config"',
    reason: 'T014: hardcoded origin strings',
    file: 'lib/seo/config.ts',
  },
  {
    pattern: /\$\{SITE_URL\}/g,
    replacement: 'buildAbsoluteUrl() from "@/lib/seo"',
    reason: 'T020: string concatenation for URLs',
    file: 'lib/seo/url-builder.ts',
  },
] as const

/** Files that used to contain legacy SEO code and have been migrated. */
export const MIGRATED_FILES = [
  {
    file: 'app/layout.tsx',
    legacy: 'Hardcoded SITE_URL and inline metadata',
    migration: 'buildHomepageMetadata() from "@/lib/seo"',
    task: 'T005',
  },
  {
    file: 'app/robots.ts',
    legacy: 'Hardcoded SITE_URL and disallow paths',
    migration: 'buildRobotsMetadata() from "@/lib/seo/robots"',
    task: 'T144',
  },
  {
    file: 'app/sitemap.ts',
    legacy: 'String concatenation with SITE_URL',
    migration: 'getCanonicalOrigin() + sitemap-system from "@/lib/seo"',
    task: 'T330',
  },
  {
    file: 'app/not-found.tsx',
    legacy: 'No metadata (risk of indexing 404)',
    migration: 'buildNoindexMetadata() from "@/lib/seo"',
    task: 'T524',
  },
] as const

/** Audit legacy pattern removal (T421+). */
export interface LegacyCleanupResult {
  totalPatterns: number
  remaining: number
  migrated: number
  details: { pattern: string; foundIn: string[] }[]
}

/**
 * Audit legacy patterns in source code.
 * This is a build-time check that scans for patterns that should
 * have been migrated to the centralized SEO system.
 */
export function auditLegacyCleanup(sourceFiles: { path: string; content: string }[]): LegacyCleanupResult {
  const details: { pattern: string; foundIn: string[] }[] = []
  let remaining = 0
  let migrated = 0

  for (const { pattern, reason } of LEGACY_PATTERNS) {
    const foundIn: string[] = []
    for (const file of sourceFiles) {
      // Skip the lib/seo/ files themselves (they define the replacements)
      if (file.path.startsWith('lib/seo/')) continue
      // Skip node_modules, .next, etc.
      if (file.path.includes('node_modules') || file.path.includes('.next')) continue
      // Check if the pattern exists in the file
      const matches = file.content.match(pattern)
      if (matches && matches.length > 0) {
        foundIn.push(file.path)
      }
    }
    if (foundIn.length > 0) {
      remaining++
      details.push({ pattern: reason, foundIn })
    } else {
      migrated++
    }
  }

  return {
    totalPatterns: LEGACY_PATTERNS.length,
    remaining,
    migrated,
    details,
  }
}

/** Get the migration map for a file (T421+). */
export function getMigrationMap(filePath: string): { legacy: string; migration: string; task: string } | null {
  return MIGRATED_FILES.find((f) => f.file === filePath) || null
}
