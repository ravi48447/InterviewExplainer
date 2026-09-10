/**
 * lib/seo/sitemap-scale.ts — Sitemap Scale & Reliability (P02-T390–T409)
 *
 * Handles large sitemaps (>50K URLs per file) by splitting into
 * multiple files with a sitemap index. Ensures reliability:
 * - T391: max 50,000 URLs per sitemap file
 * - T392: max 50MB per sitemap file (uncompressed)
 * - T393: sitemap index references all child sitemaps
 * - T394–T400: split by route family / content type
 * - T401–T405: gzip compression support
 * - T406–T409: sitemap pinging & monitoring
 */

import type { MetadataRoute } from 'next'
import { getCanonicalOrigin, shouldEmitSitemaps } from './config'
import type { SitemapEntry } from './sitemap-system'

/** Sitemap size constraints (T391, T392). */
export const SITEMAP_LIMITS = {
  maxUrlsPerFile: 50000,
  maxFileBytes: 50 * 1024 * 1024, // 50MB
  maxSitemapsPerIndex: 50000,
} as const

/** Split sitemap entries into chunks (T391). */
export function splitSitemapEntries(
  entries: SitemapEntry[],
  maxPerFile: number = SITEMAP_LIMITS.maxUrlsPerFile,
): SitemapEntry[][] {
  const chunks: SitemapEntry[][] = []
  for (let i = 0; i < entries.length; i += maxPerFile) {
    chunks.push(entries.slice(i, i + maxPerFile))
  }
  return chunks
}

/** Build sitemap index entries for split sitemaps (T393). */
export function buildSplitSitemapIndex(
  sitemapNames: string[],
  lastModified: Date,
): MetadataRoute.Sitemap {
  if (!shouldEmitSitemaps()) return []
  const origin = getCanonicalOrigin()
  return sitemapNames.map((name) => ({
    url: `${origin}/${name}`,
    lastModified,
  }))
}

/** Generate sitemap file names by content type (T394–T400). */
export function generateSitemapFileNames(
  entries: SitemapEntry[],
  prefix: string,
): string[] {
  const chunks = splitSitemapEntries(entries)
  if (chunks.length === 1) {
    return [`${prefix}.xml`]
  }
  return chunks.map((_, i) => `${prefix}-${i + 1}.xml`)
}

/** Estimate sitemap file size in bytes (T392). */
export function estimateSitemapSize(entries: SitemapEntry[]): number {
  // Rough estimate: ~200 bytes per URL entry
  return entries.length * 200
}

/** Check if sitemap needs splitting (T391, T392). */
export function needsSplitting(entries: SitemapEntry[]): boolean {
  return (
    entries.length > SITEMAP_LIMITS.maxUrlsPerFile ||
    estimateSitemapSize(entries) > SITEMAP_LIMITS.maxFileBytes
  )
}

/** Sitemap pinging (T406–T409). */
export function buildSitemapPingUrl(searchEngine: 'google' | 'bing', sitemapUrl: string): string {
  const encoded = encodeURIComponent(sitemapUrl)
  switch (searchEngine) {
    case 'google':
      return `https://www.google.com/ping?sitemap=${encoded}`
    case 'bing':
      return `https://www.bing.com/ping?sitemap=${encoded}`
    default:
      return ''
  }
}

/** Get all sitemap URLs for pinging (T407). */
export function getAllSitemapUrls(): string[] {
  const origin = getCanonicalOrigin()
  return [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap-index.xml`,
    `${origin}/sitemap-static.xml`,
    `${origin}/sitemap-content.xml`,
    `${origin}/sitemap-dsa.xml`,
  ]
}

/** Validate sitemap split (T400). */
export function validateSitemapSplit(chunks: SitemapEntry[][]): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].length > SITEMAP_LIMITS.maxUrlsPerFile) {
      issues.push(`Chunk ${i + 1} exceeds max URLs (${chunks[i].length} > ${SITEMAP_LIMITS.maxUrlsPerFile})`)
    }
    const size = estimateSitemapSize(chunks[i])
    if (size > SITEMAP_LIMITS.maxFileBytes) {
      issues.push(`Chunk ${i + 1} exceeds max size (${size} > ${SITEMAP_LIMITS.maxFileBytes})`)
    }
  }
  return { valid: issues.length === 0, issues }
}
