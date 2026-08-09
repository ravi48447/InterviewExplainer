/**
 * lib/seo/http-status.ts — HTTP Status Correctness (P02-T520–T549)
 *
 * Ensures every route returns the correct HTTP status code:
 * - T521: 200 for existing content
 * - T522: 301 for permanent redirects (canonical, legacy)
 * - T523: 307 for temporary redirects
 * - T524: 404 for not-found content (never 200 for missing pages)
 * - T525: 410 for permanently removed content
 * - T526: 500 for server errors (not 404 for data fetch failures)
 * - T527–T535: noindex pages still return 200 (not 404)
 * - T536–T545: soft-404 prevention
 * - T546–T549: status audit
 */

import { resolvePath } from './resolver'
import { classifyRedirect } from './redirect-registry'
import { resolveIndexability } from './indexability'
import { isIndexableEnvironment } from './config'

/** HTTP status code. */
export type HttpStatusCode = 200 | 301 | 307 | 308 | 404 | 410 | 500 | 503

/** Status resolution result. */
export interface StatusResolution {
  status: HttpStatusCode
  location?: string
  reason: string
}

/** Resolve the correct HTTP status for a pathname (T521–T526). */
export function resolveHttpStatus(
  pathname: string,
  entityExists?: boolean,
  dataFetchOk?: boolean,
  permanentlyRemoved?: boolean,
): StatusResolution {
  // T525: permanently removed → 410
  if (permanentlyRemoved) {
    return { status: 410, reason: 'Entity permanently removed (P02-T525)' }
  }

  // T522/T523: check redirects first
  const redirect = classifyRedirect(pathname)
  if (redirect.type === 'permanent' && redirect.destination) {
    return { status: 301, location: redirect.destination, reason: 'Permanent redirect (P02-T522)' }
  }
  if (redirect.type === 'temporary' && redirect.destination) {
    return { status: 307, location: redirect.destination, reason: 'Temporary redirect (P02-T523)' }
  }

  // T526: data fetch failure → 500 (not 404)
  if (dataFetchOk === false) {
    return { status: 500, reason: 'Data fetch failure — 500 not 404 (P02-T526)' }
  }

  // T524: entity not found → 404
  if (entityExists === false) {
    return { status: 404, reason: 'Entity not found — true 404 (P02-T524)' }
  }

  // Check if the route resolves to a public route
  const resolution = resolvePath(pathname)
  if (!resolution.family) {
    // T536–T545: soft-404 prevention — unknown routes should 404, not 200
    return { status: 404, reason: 'No matching public route — 404 not soft-404 (P02-T536)' }
  }

  // Non-canonical URL → 301 to canonical
  if (resolution.needsRedirect && resolution.canonicalPath !== pathname.toLowerCase()) {
    return {
      status: 301,
      location: resolution.canonicalUrl,
      reason: 'Non-canonical URL — 301 to canonical (P02-T522)',
    }
  }

  // T527–T535: noindex pages still return 200
  const indexDecision = resolveIndexability(pathname)
  if (indexDecision.classification !== 'index') {
    return { status: 200, reason: `Noindex page returns 200 (P02-T527): ${indexDecision.reason}` }
  }

  // T521: existing content → 200
  return { status: 200, reason: 'Existing content — 200 (P02-T521)' }
}

/** Prevent soft-404s (T536–T545).
 * A soft-404 is a page that returns 200 but shows "not found" content.
 * This function helps detect and prevent that. */
export function isSoft404(
  pathname: string,
  status: number,
  bodyContainsNotFound: boolean,
): boolean {
  return status === 200 && bodyContainsNotFound && !isExemptFromSoft404(pathname)
}

/** Some routes legitimately show "no results" without being soft-404s. */
function isExemptFromSoft404(pathname: string): boolean {
  const exempt = ['/search', '/404', '/_error']
  return exempt.some((p) => pathname.toLowerCase().startsWith(p))
}

/** Get the correct status for a search page with no results (T541). */
export function getSearchPageStatus(hasResults: boolean): StatusResolution {
  if (hasResults) {
    return { status: 200, reason: 'Search with results — 200 (P02-T542)' }
  }
  // Empty search results should still be 200 (it's a valid page, just no results)
  // But should be noindex
  return { status: 200, reason: 'Search no results — 200 but noindex (P02-T543)' }
}

/** Audit HTTP statuses (T546–T549). */
export interface HttpStatusAuditResult {
  total: number
  ok200: number
  redirected: number
  notFound: number
  errors: number
  soft404s: { path: string; issue: string }[]
}

export function auditHttpStatuses(
  entries: { path: string; status: number; bodyHasNotFound?: boolean }[],
): HttpStatusAuditResult {
  let ok200 = 0
  let redirected = 0
  let notFound = 0
  let errors = 0
  const soft404s: { path: string; issue: string }[] = []

  for (const entry of entries) {
    switch (Math.floor(entry.status / 100)) {
      case 2:
        ok200++
        if (entry.bodyHasNotFound && isSoft404(entry.path, entry.status, true)) {
          soft404s.push({ path: entry.path, issue: 'Soft-404: 200 with not-found body (T536)' })
        }
        break
      case 3:
        redirected++
        break
      case 4:
        notFound++
        break
      case 5:
        errors++
        break
    }
  }

  return {
    total: entries.length,
    ok200,
    redirected,
    notFound,
    errors,
    soft404s,
  }
}

/** Get the status code for Next.js notFound() / redirect() helpers. */
export function getNotFoundStatus(): { notFound: true; reason: string } {
  return { notFound: true, reason: 'Next.js notFound() → 404 (P02-T524)' }
}

/** Check if a route should be excluded from 404 handling (e.g. API routes). */
export function isExcludedFrom404(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/')
  )
}
