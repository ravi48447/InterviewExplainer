/**
 * lib/seo/pagination.ts — Pagination & Faceted Navigation (P02-T680–T699)
 *
 * - T681: pagination canonical strategy
 * - T682: self-canonical for page 1
 * - T683: noindex for page 2+
 * - T684–T690: rel="prev" / rel="next" (historical but still useful)
 * - T691–T699: faceted navigation handling
 */

import { type RouteFamily } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'
import { getCanonicalOrigin } from './config'

/** Pagination metadata for a page. */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  /** Canonical URL for this page. */
  canonicalUrl: string
  /** Whether this page should be noindex. */
  noindex: boolean
  /** rel="prev" URL if applicable. */
  prevUrl?: string
  /** rel="next" URL if applicable. */
  nextUrl?: string
}

/** Build pagination metadata (T681–T690). */
export function buildPaginationMeta(
  family: RouteFamily,
  params: Record<string, string>,
  currentPage: number,
  totalPages: number,
): PaginationMeta {
  const origin = getCanonicalOrigin()
  const basePath = buildAbsoluteUrl(family, params).replace(origin, '')

  // T682: page 1 self-canonical
  // T683: page 2+ noindex
  const canonicalUrl = currentPage === 1 ? `${origin}${basePath}` : `${origin}${basePath}`

  const meta: PaginationMeta = {
    currentPage,
    totalPages,
    canonicalUrl,
    noindex: currentPage > 1, // T683
  }

  // T684–T690: prev/next
  if (currentPage > 1) {
    meta.prevUrl = currentPage === 2 ? `${origin}${basePath}` : `${origin}${basePath}?page=${currentPage - 1}`
  }
  if (currentPage < totalPages) {
    meta.nextUrl = `${origin}${basePath}?page=${currentPage + 1}`
  }

  return meta
}

/** Faceted navigation handling (T691–T699).
 * Filtered views should be noindex and canonical to the unfiltered version. */
export interface FacetedNavMeta {
  canonicalUrl: string
  noindex: boolean
  reason: string
}

export function buildFacetedNavMeta(
  family: RouteFamily,
  params: Record<string, string>,
  activeFilters: string[],
): FacetedNavMeta {
  const origin = getCanonicalOrigin()
  const basePath = buildAbsoluteUrl(family, params).replace(origin, '')

  if (activeFilters.length === 0) {
    return {
      canonicalUrl: `${origin}${basePath}`,
      noindex: false,
      reason: 'No active filters — indexable (P02-T691)',
    }
  }

  return {
    canonicalUrl: `${origin}${basePath}`, // canonical to unfiltered version (T693)
    noindex: true, // T694
    reason: `Active filters (${activeFilters.join(', ')}) — noindex, canonical to base (P02-T694)`,
  }
}

/** Build the URL for a specific page (T685). */
export function buildPageUrl(
  family: RouteFamily,
  params: Record<string, string>,
  page: number,
): string {
  const base = buildAbsoluteUrl(family, params)
  if (page <= 1) return base
  return `${base}?page=${page}`
}
