/**
 * lib/seo/redirect-registry.ts — Central Redirect Registry (P02-T095–T104)
 *
 * One authoritative list of permanent (301) URL migrations. Every legacy
 * URL that should still resolve lives here — not in scattered next.config
 * rewrites, not in middleware, not in ad-hoc response.redirect calls.
 *
 * - classifyRedirect: T097 (permanent vs temporary vs none)
 * - permanent redirects: T098
 * - no chains: T100 (a redirect target must itself not redirect)
 * - no loops: T101
 * - legacy preservation: T103
 * - retirement policy: T104
 */

import { normalizeOrigin } from './config'
import { resolveHistoricalSlug, normalizeSlug } from './slug-utils'

/** Redirect type (T097). */
export type RedirectType = 'permanent' | 'temporary' | 'none'

/** A single redirect entry. */
export interface RedirectEntry {
  /** Source path pattern (supports :param placeholders). */
  source: string
  /** Destination path or absolute URL. */
  destination: string
  /** 301 (permanent) or 307 (temporary, preserves method). */
  type: 301 | 307
  /** Why this redirect exists (audit trail). */
  reason: string
  /** When it was added (ISO date for retirement decisions, T104). */
  addedAt: string
  /** Optional: retire after this date (T104). */
  retireAfter?: string
}

/**
 * The canonical redirect registry (T095, T098, T103).
 * Legacy URLs are preserved here indefinitely unless explicitly retired.
 */
export const REDIRECT_REGISTRY: RedirectEntry[] = [
  // /prep/:domainSlug → /:domainSlug (module route legacy, T103)
  {
    source: '/prep/:domainSlug',
    destination: '/:domainSlug',
    type: 301,
    reason: 'Legacy prep route consolidated into domain root (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /prep/:domainSlug/:moduleSlug → /:domainSlug/:moduleSlug
  {
    source: '/prep/:domainSlug/:moduleSlug',
    destination: '/:domainSlug/:moduleSlug',
    type: 301,
    reason: 'Legacy prep module route consolidated (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /interview-prep/:domainSlug → /:domainSlug
  {
    source: '/interview-prep/:domainSlug',
    destination: '/:domainSlug',
    type: 301,
    reason: 'Legacy interview-prep prefix retired (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /dsa-problems/:slug → /dsa/problems/:slug
  {
    source: '/dsa-problems/:slug',
    destination: '/dsa/problems/:slug',
    type: 301,
    reason: 'DSA route hierarchy normalized (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /dsa-sheets/:slug → /dsa/sheets/:slug
  {
    source: '/dsa-sheets/:slug',
    destination: '/dsa/sheets/:slug',
    type: 301,
    reason: 'DSA route hierarchy normalized (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /dsa-patterns/:slug → /dsa/patterns/:slug
  {
    source: '/dsa-patterns/:slug',
    destination: '/dsa/patterns/:slug',
    type: 301,
    reason: 'DSA route hierarchy normalized (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /roadmaps/:slug → /roadmap/:slug (singular)
  {
    source: '/roadmaps/:slug',
    destination: '/roadmap/:slug',
    type: 301,
    reason: 'Roadmap route singularized (P02-T098)',
    addedAt: '2025-01-15',
  },
  // /cheat-sheets/:slug → /cheatsheet/:slug
  {
    source: '/cheat-sheets/:slug',
    destination: '/cheatsheet/:slug',
    type: 301,
    reason: 'Cheatsheet route normalized (P02-T098)',
    addedAt: '2025-01-15',
  },
  // Trailing-slash variants → no trailing slash (T015)
  {
    source: '/:path*',
    destination: '/:path*',
    type: 301,
    reason: 'Trailing slash normalization (P02-T015)',
    addedAt: '2025-01-15',
  },
]

/** Match a path against a :param source pattern. */
function matchPattern(source: string, path: string): Record<string, string> | null {
  const sourceSegs = source.split('/').filter(Boolean)
  const pathSegs = path.split('/').filter(Boolean)
  if (sourceSegs.length !== pathSegs.length && !sourceSegs.some((s) => s === ':path*')) return null

  const params: Record<string, string> = {}
  for (let i = 0; i < sourceSegs.length; i++) {
    const ss = sourceSegs[i]
    const ps = pathSegs[i]
    if (ss === ':path*') {
      params['path*'] = pathSegs.slice(i).join('/')
      return params
    }
    if (ss.startsWith(':')) {
      params[ss.slice(1)] = ps
    } else if (ss !== ps) {
      return null
    }
  }
  return params
}

/** Apply params to a destination pattern. */
function applyParams(destination: string, params: Record<string, string>): string {
  let result = destination
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(`:${k}`, encodeURIComponent(v))
  }
  return result
}

/** Normalize a path for comparison (lowercase, no trailing slash, T016/T015). */
function normalizeForCompare(path: string): string {
  let p = path.toLowerCase()
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

/**
 * Classify whether a path needs a redirect and what type (T097).
 */
export function classifyRedirect(path: string): { type: RedirectType; destination?: string; entry?: RedirectEntry } {
  const normalized = normalizeForCompare(path)

  // Check historical slug migrations first (T078)
  const segments = normalized.split('/').filter(Boolean)
  if (segments.length > 0) {
    let slugChanged = false
    const resolvedSegments = segments.map((s) => {
      const resolved = resolveHistoricalSlug(s)
      if (resolved !== normalizeSlug(s)) slugChanged = true
      return resolved
    })
    if (slugChanged) {
      const dest = '/' + resolvedSegments.join('/')
      if (dest !== normalized) {
        return { type: 'permanent', destination: dest }
      }
    }
  }

  // Check the explicit redirect registry
  for (const entry of REDIRECT_REGISTRY) {
    const matched = matchPattern(entry.source, normalized)
    if (matched) {
      let dest = applyParams(entry.destination, matched)
      // Special handling for trailing-slash rule
      if (entry.reason.includes('Trailing slash')) {
        if (!path.endsWith('/') || path === '/') continue
        dest = normalized
      }
      if (normalizeForCompare(dest) !== normalized) {
        return { type: entry.type === 301 ? 'permanent' : 'temporary', destination: dest, entry }
      }
    }
  }

  return { type: 'none' }
}

/** Detect redirect chains (T100) — target should not itself redirect. */
export function detectRedirectChains(): { source: string; target: string; chainLength: number }[] {
  const chains: { source: string; target: string; chainLength: number }[] = []
  for (const entry of REDIRECT_REGISTRY) {
    const samplePath = samplePathFromPattern(entry.source)
    if (!samplePath) continue
    const firstDest = classifyRedirect(samplePath)
    if (firstDest.type === 'none' || !firstDest.destination) continue
    const secondHop = classifyRedirect(firstDest.destination)
    if (secondHop.type !== 'none' && secondHop.destination) {
      chains.push({
        source: samplePath,
        target: firstDest.destination,
        chainLength: 2,
      })
    }
  }
  return chains
}

/** Detect redirect loops (T101). */
export function detectRedirectLoops(): string[] {
  const loops: string[] = []
  for (const entry of REDIRECT_REGISTRY) {
    const samplePath = samplePathFromPattern(entry.source)
    if (!samplePath) continue
    const visited = new Set<string>([samplePath])
    let current = samplePath
    for (let i = 0; i < 10; i++) {
      const r = classifyRedirect(current)
      if (r.type === 'none' || !r.destination) break
      if (visited.has(normalizeForCompare(r.destination))) {
        loops.push(samplePath)
        break
      }
      visited.add(normalizeForCompare(r.destination))
      current = r.destination
    }
  }
  return loops
}

/** Generate a sample path from a :param pattern for validation. */
function samplePathFromPattern(source: string): string | null {
  const segs = source.split('/').filter(Boolean)
  if (segs.length === 0) return null
  const result = segs.map((s) => (s.startsWith(':') ? 'sample' : s)).join('/')
  return '/' + result
}

/** Get redirects that should be retired (T104). */
export function getRetiredRedirects(currentDate: string): RedirectEntry[] {
  return REDIRECT_REGISTRY.filter((e) => e.retireAfter && e.retireAfter < currentDate)
}

/** Validate the registry at startup (T100, T101). */
export function validateRedirectRegistry(): { valid: boolean; chains: ReturnType<typeof detectRedirectChains>; loops: string[] } {
  return {
    valid: detectRedirectChains().length === 0 && detectRedirectLoops().length === 0,
    chains: detectRedirectChains(),
    loops: detectRedirectLoops(),
  }
}

/** Normalize an absolute redirect destination (T014, T015). */
export function normalizeRedirectDestination(destination: string): string {
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    return normalizeOrigin(destination)
  }
  return normalizeForCompare(destination)
}
