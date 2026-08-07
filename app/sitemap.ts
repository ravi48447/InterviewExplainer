/**
 * app/sitemap.ts — Rebuilt from lib/seo/sitemap-system (P02-T330–T389)
 *
 * Sitemap is now generated from the route registry + content sources.
 * No more hardcoded SITE_URL or string concatenation. All logic lives
 * in lib/seo/sitemap-system.ts.
 */

import type { MetadataRoute } from 'next'
import {
  getCanonicalOrigin,
  shouldEmitSitemaps,
  getStaticSitemapEntries,
  getRegistrySitemapEntries,
} from '@/lib/seo'
import { SEO_MODULES } from '@/lib/seo-slugs'
import { PILLAR_HUBS } from '@/lib/seo-pillars'

export default function sitemap(): MetadataRoute.Sitemap {
  // Non-production: emit empty sitemap (P02-T371)
  if (!shouldEmitSitemaps()) return []

  const origin = getCanonicalOrigin()
  const lastModified = new Date()

  // Static entries from the registry (homepage, static info, static hubs)
  const staticEntries = getStaticSitemapEntries()
  const registryEntries = getRegistrySitemapEntries()

  // Pillar hubs from content
  const pillarEntries: MetadataRoute.Sitemap = PILLAR_HUBS.map((p) => ({
    url: `${origin}/${p.pillarSlug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }))

  // SEO module landing pages from content
  const moduleEntries: MetadataRoute.Sitemap = SEO_MODULES.map((m) => ({
    url: `${origin}/${m.seoSlug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Combine all — dedup is handled by the sitemap system
  const all = [...staticEntries, ...registryEntries, ...pillarEntries, ...moduleEntries]

  // Deduplicate by URL
  const seen = new Set<string>()
  return all.filter((entry) => {
    const key = entry.url
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
