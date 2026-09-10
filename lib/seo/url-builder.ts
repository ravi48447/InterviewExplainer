/**
 * lib/seo/url-builder.ts — Canonical URL Generator (P02-T020, T046–T072)
 *
 * THE implementation for building canonical public URLs. All absolute
 * public URLs go through here (T020). No other module may concatenate
 * origin + path manually (T012).
 *
 * Guarantees:
 * - Single leading slash, no double slashes (T063, T064)
 * - No trailing slash except homepage (T015)
 * - Lowercase path (T016)
 * - Slugs validated/normalized (T060, T061)
 * - Safe encoding of dynamic segments (T062)
 * - No query params in canonical URLs by default (T065)
 */

import { getCanonicalOrigin, normalizeOrigin, seoFail } from './config'
import { getRouteContract, type RouteFamily } from './route-registry'
import { normalizeSlug, isValidSlug } from './slug-utils'

// ── Path building (relative URLs) ───────────────────────────────────────────

/** Build a relative canonical path from a route family + params (T046). */
export function buildPath<T extends RouteFamily>(
  family: T,
  params: Record<string, string>,
): string {
  const contract = getRouteContract(family)
  let path = contract.pathTemplate

  for (const paramName of contract.params as readonly string[]) {
    const raw = params[paramName]
    if (raw === undefined || raw === '') {
      seoFail(`Missing param "${paramName}" for route "${family}"`, { params })
      // safe fallback so render doesn't crash in prod
      path = path.replace(`:${paramName}`, '')
      continue
    }
    if (!isValidSlug(raw) && family !== 'static-info') {
      // Non-slug params (e.g. question slug with special chars) get normalized
      // rather than rejected, but we log so it's visible.
      seoFail(`Param "${paramName}" is not a valid slug for route "${family}"`, { value: raw })
    }
    const slug = normalizeSlug(raw)
    path = path.replace(`:${paramName}`, encodeURIComponent(slug))
  }

  // Normalize: collapse double slashes (T063), strip trailing slash except root (T015)
  path = path.replace(/\/{2,}/g, '/')
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  // Lowercase the path (T016) — but preserve query/fragment if any (there shouldn't be)
  path = path.toLowerCase()

  return path
}

// ── Absolute URLs (T020, T046–T059) ──────────────────────────────────────────

/** Build an absolute canonical URL from a route family + params (T020). */
export function buildAbsoluteUrl<T extends RouteFamily>(
  family: T,
  params: Record<string, string> = {},
): string {
  const origin = getCanonicalOrigin()
  const path = buildPath(family, params)
  return origin + path
}

/** Build an absolute URL for any known route family (convenience per-workstream). */
export const urlFor = {
  homepage: () => buildAbsoluteUrl('homepage', {}),
  domain: (domainSlug: string) => buildAbsoluteUrl('domain', { domainSlug }),
  stack: (domainSlug: string, stackSlug: string) =>
    buildAbsoluteUrl('stack', { domainSlug, stackSlug }),
  pillar: (pillarSlug: string) => buildAbsoluteUrl('pillar', { pillarSlug }),
  module: (seoSlug: string) => buildAbsoluteUrl('module', { seoSlug }),
  question: (domainSlug: string, stackSlug: string, questionSlug: string) =>
    buildAbsoluteUrl('question', { domainSlug, stackSlug, questionSlug }),
  topic: (concept: string) => buildAbsoluteUrl('topic', { concept }),
  company: (companySlug: string) => buildAbsoluteUrl('company', { companySlug }),
  comparison: (slug: string) => buildAbsoluteUrl('comparison', { slug }),
  tool: (tool: string) => buildAbsoluteUrl('tool', { tool }),
  roadmap: (slug: string) => buildAbsoluteUrl('roadmap', { slug }),
  cheatsheet: (slug: string) => buildAbsoluteUrl('cheatsheet', { slug }),
  dsaHub: () => buildAbsoluteUrl('dsa-hub', {}),
  dsaProblem: (slug: string) => buildAbsoluteUrl('dsa-problem', { slug }),
  dsaCategory: (category: string) => buildAbsoluteUrl('dsa-category', { category }),
  dsaPattern: (slug: string) => buildAbsoluteUrl('dsa-pattern', { slug }),
  dsaSheet: (slug: string) => buildAbsoluteUrl('dsa-sheet', { slug }),
  dsaCompany: (company: string) => buildAbsoluteUrl('dsa-company', { company }),
  dsaModule: (slug: string) => buildAbsoluteUrl('dsa-module', { slug }),
  career: (slug?: string) => buildAbsoluteUrl('career', slug ? { slug } : {}),
  behavioral: (slug?: string) => buildAbsoluteUrl('behavioral', slug ? { slug } : {}),
  staticInfo: (slug: string) => buildAbsoluteUrl('static-info', { slug }),
}

/** Build an absolute URL from an existing relative path (for canonical tags). */
export function absoluteFromPath(path: string): string {
  const origin = getCanonicalOrigin()
  let clean = path
  if (!clean.startsWith('/')) clean = '/' + clean
  clean = clean.replace(/\/{2,}/g, '/')
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1)
  return origin + clean.toLowerCase()
}

/** Build a relative URL from an existing path (for internal links). */
export function relativeFromPath(path: string): string {
  let clean = path
  if (!clean.startsWith('/')) clean = '/' + clean
  clean = clean.replace(/\/{2,}/g, '/')
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1)
  return clean.toLowerCase()
}

/** Reject query params from canonical URLs (T065). */
export function stripQueryParams(url: string): string {
  const qIndex = url.indexOf('?')
  return qIndex >= 0 ? url.slice(0, qIndex) : url
}
