/**
 * lib/seo/canonical-system.ts — Canonical Tag Architecture (P02-T290–T329)
 *
 * Every indexable page must emit exactly one correct canonical URL.
 * This module computes, validates, and audits canonical tags.
 *
 * - T291: canonical from route registry (not hardcoded)
 * - T292: absolute HTTPS canonical
 * - T293: no query params in canonical
 * - T294: no fragment in canonical
 * - T295: lowercase host
 * - T296: no trailing slash (except root)
 * - T297: sorted/consistent params
 * - T298–T305: paginated page canonical (self-canonical for page 1,
 *   no canonical for page 2+ when noindex)
 * - T306–T315: alternates / hreflang
 * - T316–T329: canonical audit
 */

import { getCanonicalOrigin } from './config'
import { type RouteFamily } from './route-registry'
import { buildAbsoluteUrl, stripQueryParams } from './url-builder'
import { resolveIndexability } from './indexability'

/** Compute the canonical URL for a route (T291–T297). */
export function computeCanonical(
  family: RouteFamily,
  params: Record<string, string>,
  page?: number,
): string {
  let url = buildAbsoluteUrl(family, params)
  // T293: no query params
  url = stripQueryParams(url)
  // T294: no fragment
  const hashIdx = url.indexOf('#')
  if (hashIdx >= 0) url = url.slice(0, hashIdx)
  // T295: lowercase host (buildAbsoluteUrl already lowercases path; ensure host)
  try {
    const u = new URL(url)
    u.host = u.host.toLowerCase()
    url = u.toString()
  } catch {
    // ignore
  }
  // T296: no trailing slash (except root)
  if (url.length > getCanonicalOrigin().length + 1 && url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return url
}

/** Decide whether to emit a canonical tag at all (T298–T305).
 * - Page 1: self-canonical (emits canonical = current URL)
 * - Page 2+: noindex, but still emit canonical to page 1 (consolidation)
 * - Private/noindex non-paginated: no canonical
 */
export function shouldEmitCanonicalTag(
  family: RouteFamily,
  params: Record<string, string>,
  page?: number,
): { emit: boolean; canonicalUrl: string | null; reason: string } {
  const path = buildPathOnly(family, params)
  const decision = resolveIndexability(path)

  if (!decision.canonicalEmitted) {
    return { emit: false, canonicalUrl: null, reason: `Route not canonical-eligible: ${decision.reason}` }
  }

  if (page && page > 1) {
    // T302: paginated page 2+ — noindex but canonical points to page 1
    const canonicalPage1 = computeCanonical(family, params, 1)
    return { emit: true, canonicalUrl: canonicalPage1, reason: 'Paginated page — canonical to page 1 (P02-T302)' }
  }

  // Self-canonical
  const selfCanonical = computeCanonical(family, params, page)
  return { emit: true, canonicalUrl: selfCanonical, reason: 'Self-canonical for indexable route (P02-T291)' }
}

function buildPathOnly(family: RouteFamily, params: Record<string, string>): string {
  try {
    return buildAbsoluteUrl(family, params).replace(getCanonicalOrigin(), '')
  } catch {
    return '/'
  }
}

/** Build alternates / hreflang (T306–T315).
 * Currently the site is English-only, but the structure is here for
 * future localization. */
export function buildAlternates(canonicalUrl: string): { canonical: string; languages?: Record<string, string> } {
  return {
    canonical: canonicalUrl,
  }
}

/** Validate a canonical URL (T316–T323). */
export interface CanonicalValidation {
  valid: boolean
  issues: string[]
}

export function validateCanonical(url: string): CanonicalValidation {
  const issues: string[] = []
  const origin = getCanonicalOrigin()

  // T292: must be absolute HTTPS
  if (!url.startsWith('https://')) {
    issues.push('Canonical must be absolute HTTPS')
  }
  // T292: must use canonical origin
  if (!url.startsWith(origin)) {
    issues.push(`Canonical must use canonical origin (${origin})`)
  }
  // T293: no query params
  if (url.includes('?')) {
    issues.push('Canonical must not contain query params')
  }
  // T294: no fragment
  if (url.includes('#')) {
    issues.push('Canonical must not contain fragment')
  }
  // T295: lowercase host
  try {
    const u = new URL(url)
    if (u.host !== u.host.toLowerCase()) {
      issues.push('Canonical host must be lowercase')
    }
  } catch {
    issues.push('Invalid URL')
  }
  // T296: no trailing slash (except root)
  if (url !== origin + '/' && url !== origin && url.endsWith('/')) {
    issues.push('Canonical must not have trailing slash (except root)')
  }

  return { valid: issues.length === 0, issues }
}

/** Audit canonical tags across the site (T316–T329). */
export interface CanonicalAuditResult {
  total: number
  valid: number
  missing: number
  invalid: number
  issues: { url: string; problems: string[] }[]
}

export function auditCanonicals(entries: { url: string; canonical: string | null }[]): CanonicalAuditResult {
  const issues: { url: string; problems: string[] }[] = []
  let valid = 0
  let missing = 0
  let invalid = 0

  for (const { url, canonical } of entries) {
    if (!canonical) {
      missing++
      issues.push({ url, problems: ['Missing canonical tag'] })
      continue
    }
    const v = validateCanonical(canonical)
    if (v.valid) {
      valid++
    } else {
      invalid++
      issues.push({ url, problems: v.issues })
    }
  }

  return { total: entries.length, valid, missing, invalid, issues }
}

/** Check for canonical conflicts (multiple canonicals on one page, T324). */
export function detectCanonicalConflicts(canonicals: string[]): boolean {
  const unique = new Set(canonicals.map((c) => c.toLowerCase()))
  return unique.size > 1
}
