/**
 * lib/seo/resolver.ts — Canonical Entity Resolver (P02-T085–T094)
 *
 * Resolves a public URL back to a content entity. This is the read-side
 * complement to url-builder: given a pathname, determine which route
 * family it belongs to, whether the entity exists, and what the canonical
 * URL is (for redirecting noncanonical variants — T088).
 *
 * Resolution distinguishes "not found" (true 404, T087) from "temporary
 * data failure" (500, T086) — never a generic 200 for missing content
 * (T094), never a fallback-to-homepage (T093).
 */

import { classifyRoute, getRouteContract, ROUTE_REGISTRY, type RouteFamily } from './route-registry'
import { resolveHistoricalSlug, normalizeSlug } from './slug-utils'
import { absoluteFromPath } from './url-builder'

/** Resolution result. */
export interface ResolutionResult {
  /** The matched route family, or null if no public route matches. */
  family: RouteFamily | null
  /** Extracted params from the path. */
  params: Record<string, string>
  /** The canonical relative path (after slug normalization). */
  canonicalPath: string
  /** The canonical absolute URL. */
  canonicalUrl: string
  /** True if the input path differs from canonical (needs 301 redirect, T088). */
  needsRedirect: boolean
  /** The original input path. */
  inputPath: string
}

/** Resolution status (T086, T087). */
export type ResolutionStatus = 'found' | 'not-found' | 'redirect' | 'data-error'

/**
 * Match a pathname against the route registry to determine its family.
 * Tries static routes first, then dynamic routes, most specific first.
 */
export function resolvePath(pathname: string): ResolutionResult {
  let clean = pathname
  if (!clean.startsWith('/')) clean = '/' + clean
  // Lowercase for matching (T016)
  clean = clean.toLowerCase()

  // Homepage
  if (clean === '/' || clean === '') {
    return {
      family: 'homepage',
      params: {},
      canonicalPath: '/',
      canonicalUrl: absoluteFromPath('/'),
      needsRedirect: pathname !== '/',
      inputPath: pathname,
    }
  }

  // Try to match against each public route family.
  // Order matters: more specific (deeper) routes first.
  const dynamicOrder: RouteFamily[] = [
    'question', // /:domain/:stack/:question (3 segments)
    'stack', // /:domain/:stack (2 segments)
    'dsa-problem', 'dsa-pattern', 'dsa-sheet', 'dsa-company', 'dsa-module', // /dsa/X/Y
    'dsa-category', // /dsa/:category
    'company', 'comparison', 'tool', 'roadmap', 'cheatsheet', 'topic', // /X/:slug
    'pillar', 'module', 'domain', 'static-info', // /:slug (1 segment)
  ]

  const segments = clean.split('/').filter(Boolean)

  // Check multi-segment dynamic routes
  for (const family of dynamicOrder) {
    const contract = getRouteContract(family)
    if (contract.visibility !== 'public') continue
    const templateSegments = contract.pathTemplate.split('/').filter(Boolean)
    if (templateSegments.length !== segments.length && !templateSegments.some((s) => s.startsWith(':path*'))) continue

    const params: Record<string, string> = {}
    let matched = true
    for (let i = 0; i < templateSegments.length; i++) {
      const ts = templateSegments[i]
      const ss = segments[i]
      if (ts.startsWith(':')) {
        if (ts.endsWith('*')) {
          params[ts.slice(1, -1)] = segments.slice(i).join('/')
          break
        }
        params[ts.slice(1)] = ss
      } else if (ts !== ss) {
        matched = false
        break
      }
    }
    if (matched) {
      // Resolve historical slug migrations (T078, T088)
      const resolvedParams: Record<string, string> = {}
      let slugChanged = false
      for (const [k, v] of Object.entries(params)) {
        const resolved = resolveHistoricalSlug(v)
        resolvedParams[k] = resolved
        if (resolved !== normalizeSlug(v)) slugChanged = true
      }
      // Rebuild canonical path
      const canonicalPath = rebuildPath(family, resolvedParams)
      const needsRedirect = canonicalPath !== clean || slugChanged
      return {
        family,
        params: resolvedParams,
        canonicalPath,
        canonicalUrl: absoluteFromPath(canonicalPath),
        needsRedirect,
        inputPath: pathname,
      }
    }
  }

  // No public route matched
  return {
    family: null,
    params: {},
    canonicalPath: clean,
    canonicalUrl: absoluteFromPath(clean),
    needsRedirect: clean !== pathname.toLowerCase(),
    inputPath: pathname,
  }
}

/** Rebuild a path from a family + params (internal helper). */
function rebuildPath(family: RouteFamily, params: Record<string, string>): string {
  const contract = getRouteContract(family)
  let path = contract.pathTemplate
  for (const paramName of contract.params as readonly string[]) {
    const val = params[paramName] ?? ''
    path = path.replace(`:${paramName}`, encodeURIComponent(val))
  }
  path = path.replace(/\/{2,}/g, '/')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path.toLowerCase()
}

/** Distinguish not-found from data-error (T086, T087). */
export function classifyNotFound(error: unknown): ResolutionStatus {
  if (error instanceof NotFoundError) return 'not-found'
  if (error instanceof DataFetchError) return 'data-error'
  return 'not-found'
}

/** True 404 — entity does not exist (T087). */
export class NotFoundError extends Error {
  constructor(message: string, public readonly entity?: string, public readonly slug?: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

/** Temporary data failure — should 500, not 404 (T086). */
export class DataFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'DataFetchError'
  }
}

/** Prevent duplicate entity resolution (T089) — memoize by canonical path. */
const resolutionCache = new Map<string, ResolutionResult>()
export function resolvePathCached(pathname: string): ResolutionResult {
  const key = pathname.toLowerCase()
  const cached = resolutionCache.get(key)
  if (cached) return cached
  const result = resolvePath(pathname)
  resolutionCache.set(key, result)
  return result
}

/** Validate parent-child route relationships (T090). */
export function validateParentChild(
  parentPath: string,
  childPath: string,
): boolean {
  const parentSegments = parentPath.toLowerCase().split('/').filter(Boolean)
  const childSegments = childPath.toLowerCase().split('/').filter(Boolean)
  if (childSegments.length <= parentSegments.length) return false
  for (let i = 0; i < parentSegments.length; i++) {
    if (parentSegments[i] !== childSegments[i]) return false
  }
  return true
}

/** Remove accidental fallback-to-homepage behavior (T093). */
export function shouldFallbackToHomepage(_pathname: string): false {
  // NEVER fall back to homepage for missing content. Always return false.
  return false
}
