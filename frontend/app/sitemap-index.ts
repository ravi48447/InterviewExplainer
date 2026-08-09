/**
 * app/sitemap-index.ts — Sitemap Index (P02-T361–T370)
 *
 * Points to individual sitemap files for large set splitting.
 * Generated from lib/seo/sitemap-scale.
 */

import type { MetadataRoute } from 'next'
import { buildSitemapIndex } from '@/lib/seo'

export default function sitemapIndex(): MetadataRoute.Sitemap {
  return buildSitemapIndex()
}
