/**
 * lib/seo/indexability.ts — Indexability Policy Engine (P02-T111–T143)
 *
 * Determines, for any route, whether it should be indexed by search
 * engines. This is a SYSTEM, not a page-by-page decision.
 *
 * - T112: indexability classification per route family
 * - T113: noindex for private/internal/dev routes
 * - T114: noindex for preview/staging (environment-aware)
 * - T115–T119: robots meta tag generation
 * - T120–T125: X-Robots-Tag header alignment
 * - T126–T130: canonical vs noindex interaction
 * - T131–T135: noindex on paginated/filtered variants
 * - T136–T143: indexability validation & audit
 */

import { getSeoEnvironment, isIndexableEnvironment, DEFAULT_INDEXABILITY, PRIVATE_ROUTE_PREFIXES, STATIC_INFO_ROUTES } from './config'
import { classifyRoute, getRouteContract, ROUTE_REGISTRY, type RouteFamily, type IndexabilityClass } from './route-registry'

/** Full indexability decision for a route. */
export interface IndexabilityDecision {
  /** Final robots meta content, e.g. 'index, follow' or 'noindex, follow'. */
  robotsMeta: string
  /** X-Robots-Tag header value (T120). */
  xRobotsTag: string
  /** Whether this route appears in the sitemap (T122). */
  inSitemap: boolean
  /** Whether canonical is emitted (T126). */
  canonicalEmitted: boolean
  /** Human-readable reason for the decision (audit). */
  reason: string
  /** Source classification. */
  classification: IndexabilityClass
}

/** Build robots meta from classification (T115). */
export function buildRobotsMeta(klass: IndexabilityClass): string {
  switch (klass) {
    case 'index':
      return 'index, follow'
    case 'noindex':
      return 'noindex, follow'
    case 'noindex-follow':
      return 'noindex, nofollow'
    default:
      return 'index, follow'
  }
}

/** Determine indexability for a pathname (T112, T113, T114). */
export function resolveIndexability(pathname: string): IndexabilityDecision {
  const env = getSeoEnvironment()

  // T114: non-production environments are never indexable
  if (!isIndexableEnvironment()) {
    return {
      robotsMeta: 'noindex, nofollow',
      xRobotsTag: 'noindex, nofollow',
      inSitemap: false,
      canonicalEmitted: env === 'preview' || env === 'staging',
      reason: `Non-production environment (${env}) — noindex globally (P02-T114)`,
      classification: 'noindex-follow',
    }
  }

  // T113: private/internal/dev routes
  const family = classifyRoute(pathname)
  if (family) {
    const contract = getRouteContract(family)
    if (contract.visibility === 'private' || contract.visibility === 'internal' || contract.visibility === 'development') {
      return {
        robotsMeta: buildRobotsMeta('noindex-follow'),
        xRobotsTag: 'noindex, nofollow',
        inSitemap: false,
        canonicalEmitted: false,
        reason: `Route family '${family}' is ${contract.visibility} — noindex, nofollow (P02-T113)`,
        classification: 'noindex-follow',
      }
    }
    // Use the route contract's indexability class
    const robotsMeta = buildRobotsMeta(contract.indexability)
    return {
      robotsMeta,
      xRobotsTag: robotsMeta,
      inSitemap: contract.indexability === 'index',
      canonicalEmitted: true,
      reason: `Route family '${family}' classified as ${contract.indexability} (P02-T112)`,
      classification: contract.indexability,
    }
  }

  // Check private prefixes (T113)
  const lower = pathname.toLowerCase()
  for (const prefix of PRIVATE_ROUTE_PREFIXES) {
    if (lower === prefix || lower.startsWith(prefix + '/')) {
      return {
        robotsMeta: 'noindex, nofollow',
        xRobotsTag: 'noindex, nofollow',
        inSitemap: false,
        canonicalEmitted: false,
        reason: `Private route prefix '${prefix}' — noindex, nofollow (P02-T113)`,
        classification: 'noindex-follow',
      }
    }
  }

  // Static info routes are indexable
  if (STATIC_INFO_ROUTES.some((r) => lower === r || lower.startsWith(r + '/'))) {
    return {
      robotsMeta: 'index, follow',
      xRobotsTag: 'index, follow',
      inSitemap: true,
      canonicalEmitted: true,
      reason: 'Static info route — indexable (P02-T112)',
      classification: 'index',
    }
  }

  // Default: unknown route → noindex (safe default, T143)
  return {
    robotsMeta: 'noindex, follow',
    xRobotsTag: 'noindex, follow',
    inSitemap: false,
    canonicalEmitted: false,
    reason: 'Unknown route — safe noindex default (P02-T143)',
    classification: 'noindex',
  }
}

/** Canonical vs noindex interaction (T126–T130).
 * If a page is noindex, it should still emit a canonical IF it's a
 * preview/staging variant or a paginated page — but NOT for private
 * or genuinely excluded content.
 */
export function shouldEmitCanonical(pathname: string): boolean {
  const decision = resolveIndexability(pathname)
  return decision.canonicalEmitted
}

/** Indexability for paginated/filtered variants (T131–T135).
 * Page 2+ should be noindex, follow (T132). Filtered views noindex (T134).
 */
export function resolvePaginationIndexability(
  pathname: string,
  page: number,
  hasFilter: boolean,
): IndexabilityDecision {
  if (page > 1) {
    return {
      robotsMeta: 'noindex, follow',
      xRobotsTag: 'noindex, follow',
      inSitemap: false,
      canonicalEmitted: true,
      reason: `Pagination page ${page} — noindex, follow (P02-T132)`,
      classification: 'noindex',
    }
  }
  if (hasFilter) {
    return {
      robotsMeta: 'noindex, follow',
      xRobotsTag: 'noindex, follow',
      inSitemap: false,
      canonicalEmitted: true,
      reason: 'Filtered view — noindex, follow (P02-T134)',
      classification: 'noindex',
    }
  }
  return resolveIndexability(pathname)
}

/** Audit all routes for indexability consistency (T136–T143). */
export interface IndexabilityAuditResult {
  total: number
  indexable: number
  noindex: number
  noindexFollow: number
  inconsistencies: string[]
}

export function auditIndexability(): IndexabilityAuditResult {
  const inconsistencies: string[] = []
  let indexable = 0
  let noindex = 0
  let noindexFollow = 0

  for (const family of Object.keys(ROUTE_REGISTRY) as RouteFamily[]) {
    const contract = getRouteContract(family)
    const samplePath = samplePathForFamily(family)
    if (!samplePath) continue
    const decision = resolveIndexability(samplePath)
    if (decision.classification === 'index') indexable++
    else if (decision.classification === 'noindex') noindex++
    else noindexFollow++

    // T136: check that contract classification matches engine output
    if (decision.classification !== contract.indexability) {
      // Allow engine to override for private routes
      if (contract.visibility === 'public' && decision.classification !== contract.indexability) {
        inconsistencies.push(`${family}: contract says ${contract.indexability}, engine says ${decision.classification}`)
      }
    }
  }

  return {
    total: indexable + noindex + noindexFollow,
    indexable,
    noindex,
    noindexFollow,
    inconsistencies,
  }
}

function samplePathForFamily(family: RouteFamily): string | null {
  const contract = getRouteContract(family)
  const segs = contract.pathTemplate.split('/').filter(Boolean)
  if (segs.length === 0) return '/'
  return '/' + segs.map((s) => (s.startsWith(':') ? 'sample' : s)).join('/')
}

/** Get the robots meta config for Next.js metadata (T115–T119). */
export function getRobotsMetaConfig(pathname: string) {
  const decision = resolveIndexability(pathname)
  return {
    indexable: decision.classification === 'index',
    follow: decision.classification !== 'noindex-follow',
    googleBot: DEFAULT_INDEXABILITY.googleBot,
  }
}
