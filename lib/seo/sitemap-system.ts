/**
 * lib/seo/sitemap-system.ts — Sitemap Architecture (P02-T330–T389)
 *
 * Rebuilds all sitemap generation from the route registry + content
 * data instead of string concatenation with hardcoded SITE_URL.
 *
 * - T331: single sitemap generator function
 * - T332: typed sitemap entries
 * - T333: sitemap from route registry (indexable routes only)
 * - T334–T340: lastmod, changefreq, priority from registry
 * - T341–T350: content sitemap (domains, modules, questions, DSA)
 * - T351–T360: static info sitemap
 * - T361–T370: sitemap index
 * - T371–T380: environment-aware (no sitemap in non-production)
 * - T381–T389: sitemap validation
 */

import type { MetadataRoute } from 'next'
import { getCanonicalOrigin, isIndexableEnvironment, shouldEmitSitemaps, getSeoEnvironment } from './config'
import { getIndexableRoutes, ROUTE_REGISTRY, type RouteFamily } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'
import { resolveIndexability } from './indexability'

/** A single sitemap entry (T332). */
export interface SitemapEntry {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/** Content source for dynamic sitemaps (T341–T350). */
export interface ContentSitemapSource {
  /** Route family these entries belong to. */
  family: RouteFamily
  /** Function returning all URLs for this family. */
  getEntries: () => Promise<SitemapEntry[]>
}

/** Content sources registry — populated by content modules. */
const contentSources: ContentSitemapSource[] = []

export function registerSitemapSource(source: ContentSitemapSource): void {
  contentSources.push(source)
}

export function clearSitemapSources(): void {
  contentSources.length = 0
}

/** Static sitemap entries (always present, T351–T360). */
export function getStaticSitemapEntries(): SitemapEntry[] {
  if (!isIndexableEnvironment()) return []

  const origin = getCanonicalOrigin()
  const entries: SitemapEntry[] = []

  // Homepage
  entries.push({
    url: `${origin}/`,
    changeFrequency: 'daily',
    priority: 1.0,
  })

  // Static info pages
  const staticRoutes = ['about', 'support', 'privacy', 'terms', 'cookies']
  for (const slug of staticRoutes) {
    entries.push({
      url: `${origin}/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.3,
    })
  }

  return entries
}

/** Build sitemap entries from the route registry for static routes (T333). */
export function getRegistrySitemapEntries(): SitemapEntry[] {
  if (!isIndexableEnvironment()) return []

  const origin = getCanonicalOrigin()
  const entries: SitemapEntry[] = []
  const indexable = getIndexableRoutes()

  for (const route of indexable) {
    if ('dynamic' in route && route.dynamic) continue // dynamic routes are handled by content sources
    if (route.pathTemplate === '/') continue // homepage handled above

    const url = `${origin}${route.pathTemplate}`
    const decision = resolveIndexability(route.pathTemplate)
    if (decision.classification !== 'index') continue

    entries.push({
      url,
      changeFrequency: route.changeFrequency,
      priority: route.sitemapPriority,
    })
  }

  return entries
}

/** Build a complete sitemap from all sources (T331). */
export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  if (!shouldEmitSitemaps()) return []

  const entries: SitemapEntry[] = []

  // Static entries
  entries.push(...getStaticSitemapEntries())
  entries.push(...getRegistrySitemapEntries())

  // Content entries (T341–T350)
  for (const source of contentSources) {
    try {
      const sourceEntries = await source.getEntries()
      // Filter to only indexable entries
      for (const entry of sourceEntries) {
        const path = entry.url.replace(getCanonicalOrigin(), '')
        const decision = resolveIndexability(path)
        if (decision.classification === 'index') {
          entries.push(entry)
        }
      }
    } catch (error) {
      console.error(`[SEO] Sitemap source ${source.family} failed:`, error)
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduped = entries.filter((e) => {
    if (seen.has(e.url)) return false
    seen.add(e.url)
    return true
  })

  return deduped.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))
}

/** Build the sitemap index (T361–T370).
 * For large sites, split into multiple sitemaps. */
export function buildSitemapIndex(): MetadataRoute.Sitemap {
  if (!shouldEmitSitemaps()) return []

  const origin = getCanonicalOrigin()
  const now = new Date()

  // Individual sitemaps
  const sitemaps = [
    { url: `${origin}/sitemap-static.xml`, lastModified: now },
    { url: `${origin}/sitemap-content.xml`, lastModified: now },
    { url: `${origin}/sitemap-dsa.xml`, lastModified: now },
  ]

  return sitemaps
}

/** Build the static sitemap (T351–T360). */
export function buildStaticSitemap(): MetadataRoute.Sitemap {
  const entries = [...getStaticSitemapEntries(), ...getRegistrySitemapEntries()]
  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))
}

/** Validate sitemap entries (T381–T389). */
export interface SitemapValidation {
  total: number
  valid: number
  issues: { url: string; problems: string[] }[]
}

export function validateSitemap(entries: SitemapEntry[]): SitemapValidation {
  const issues: { url: string; problems: string[] }[] = []
  const seen = new Set<string>()
  let valid = 0

  for (const entry of entries) {
    const problems: string[] = []
    const origin = getCanonicalOrigin()

    if (!entry.url.startsWith(origin)) {
      problems.push('URL does not use canonical origin')
    }
    if (!entry.url.startsWith('https://')) {
      problems.push('URL is not HTTPS')
    }
    if (entry.url.includes('?')) {
      problems.push('URL contains query params')
    }
    if (entry.url !== origin + '/' && entry.url.endsWith('/')) {
      problems.push('URL has trailing slash')
    }
    if (seen.has(entry.url)) {
      problems.push('Duplicate URL')
    }
    if (entry.priority !== undefined && (entry.priority < 0 || entry.priority > 1)) {
      problems.push('Priority out of range [0,1]')
    }

    seen.add(entry.url)
    if (problems.length === 0) {
      valid++
    } else {
      issues.push({ url: entry.url, problems })
    }
  }

  return { total: entries.length, valid, issues }
}

/** Count sitemap entries by route family (for monitoring, T385). */
export function countSitemapEntries(entries: SitemapEntry[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    const path = entry.url.replace(getCanonicalOrigin(), '')
    const family = classifySitemapEntry(path)
    counts[family] = (counts[family] || 0) + 1
  }
  return counts
}

function classifySitemapEntry(path: string): string {
  if (path === '/') return 'homepage'
  const segments = path.split('/').filter(Boolean)
  if (segments[0] === 'dsa') {
    return `dsa-${segments[1] || 'hub'}`
  }
  if (segments.length === 1) return 'domain-or-static'
  if (segments.length === 2) return 'module-or-stack'
  if (segments.length === 3) return 'question'
  return 'other'
}
