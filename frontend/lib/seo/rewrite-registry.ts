/**
 * lib/seo/rewrite-registry.ts — Rewrite Audit & Separation (P02-T105–T110)
 *
 * Rewrites (next.config.js `rewrites()`) are for INTERNAL routing only:
 * they map a public URL to a different internal render path WITHOUT
 * changing the browser URL. They are NOT redirects.
 *
 * This module audits existing rewrites to ensure:
 * - T106: rewrites never produce a different public URL
 * - T107: rendering paths are separate from public URLs
 * - T108: no rewrite shadows a real public route
 * - T109: rewrites are documented and auditable
 * - T110: rewrite failures are detectable
 */

import { getPublicRoutes } from './route-registry'

/** A single rewrite entry (mirrors next.config rewrites shape). */
export interface RewriteEntry {
  source: string
  destination: string
  reason: string
  internal: boolean
}

/**
 * The canonical rewrite registry (T109).
 * Currently the site uses no internal rewrites — all public URLs map
 * directly to app/ render paths. This registry exists to centralize any
 * future rewrites and audit them.
 */
export const REWRITE_REGISTRY: RewriteEntry[] = []

/** Audit rewrites against the public route registry (T108). */
export interface RewriteAuditResult {
  valid: boolean
  shadowedRoutes: string[]
  publicUrlLeaks: string[]
  undocumentedRewrites: string[]
}

/**
 * Audit the rewrite registry (T106, T107, T108).
 * A rewrite is invalid if it shadows a public route or if its destination
 * is itself a public URL (rendering path must be internal, T107).
 */
export function auditRewrites(): RewriteAuditResult {
  const publicRoutes = getPublicRoutes().map((r) => r.pathTemplate)
  const shadowedRoutes: string[] = []
  const publicUrlLeaks: string[] = []
  const undocumentedRewrites: string[] = []

  for (const entry of REWRITE_REGISTRY) {
    // T108: does the rewrite source shadow a public route?
    for (const pub of publicRoutes) {
      if (patternsOverlap(entry.source, pub)) {
        shadowedRoutes.push(`${entry.source} shadows ${pub}`)
      }
    }
    // T107: is the destination a public URL (not internal)?
    if (entry.destination.startsWith('/') && !entry.internal) {
      for (const pub of publicRoutes) {
        if (patternsOverlap(entry.destination, pub)) {
          publicUrlLeaks.push(`${entry.destination} is a public URL used as render path`)
        }
      }
    }
    // T109: is it documented?
    if (!entry.reason) {
      undocumentedRewrites.push(entry.source)
    }
  }

  return {
    valid: shadowedRoutes.length === 0 && publicUrlLeaks.length === 0 && undocumentedRewrites.length === 0,
    shadowedRoutes,
    publicUrlLeaks,
    undocumentedRewrites,
  }
}

/** Check if two patterns could match the same path. */
function patternsOverlap(a: string, b: string): boolean {
  const aSegs = a.split('/').filter(Boolean)
  const bSegs = b.split('/').filter(Boolean)
  if (aSegs.length !== bSegs.length) return false
  for (let i = 0; i < aSegs.length; i++) {
    const as = aSegs[i]
    const bs = bSegs[i]
    if (as.startsWith(':') || bs.startsWith(':')) continue
    if (as !== bs) return false
  }
  return true
}

/** Get rewrites in next.config format (T110). */
export function getNextRewrites(): { source: string; destination: string }[] {
  return REWRITE_REGISTRY.map((e) => ({ source: e.source, destination: e.destination }))
}

/** Detect rewrite failures at runtime (T110). */
export function detectRewriteFailure(pathname: string): boolean {
  // If a path matches a rewrite source but the destination render path
  // doesn't exist, that's a failure. Currently no rewrites → no failures.
  for (const entry of REWRITE_REGISTRY) {
    if (pathMatchesPattern(entry.source, pathname)) {
      return true // would need to check if destination render path exists
    }
  }
  return false
}

function pathMatchesPattern(pattern: string, path: string): boolean {
  const pSegs = pattern.split('/').filter(Boolean)
  const pathSegs = path.split('/').filter(Boolean)
  if (pSegs.length !== pathSegs.length) return false
  for (let i = 0; i < pSegs.length; i++) {
    if (pSegs[i].startsWith(':')) continue
    if (pSegs[i] !== pathSegs[i]) return false
  }
  return true
}
