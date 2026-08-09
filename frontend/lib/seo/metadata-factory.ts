/**
 * lib/seo/metadata-factory.ts — Metadata Factory (P02-T160–T209)
 *
 * THE central metadata generation module. All pages get their metadata
 * from here — no scattered generateMetadata functions with hardcoded
 * SITE_URL (T005). This factory composes: title, description, canonical,
 * robots, OpenGraph, Twitter, alternates — all from the route registry
 * + content data.
 *
 * - T161: single factory function
 * - T162: typed metadata output
 * - T163: composition from route + content
 * - T165–T170: metadataBase from config
 * - T171–T180: canonical from url-builder
 * - T181–T190: robots from indexability engine
 * - T191–T200: OpenGraph
 * - T201–T209: Twitter card
 */

import type { Metadata } from 'next'
import { getCanonicalOrigin, SITE_CONFIG, getSeoEnvironment, isIndexableEnvironment } from './config'
import { getRouteContract, type RouteFamily } from './route-registry'
import { buildAbsoluteUrl, absoluteFromPath } from './url-builder'
import { resolveIndexability } from './indexability'
import { normalizeSlug } from './slug-utils'

/** Input to the metadata factory (T163). */
export interface MetadataInput {
  /** Route family. */
  family: RouteFamily
  /** Route params (slugs). */
  params: Record<string, string>
  /** Page title (without site suffix). */
  title?: string
  /** Meta description (155–160 chars ideal). */
  description?: string
  /** OG image path (relative) or absolute URL. */
  image?: string
  /** Optional keywords (used sparingly, mostly for internal search). */
  keywords?: string[]
  /** Whether this is a paginated page (affects canonical, T131). */
  page?: number
  /** Whether this page has active filters (affects indexability, T134). */
  hasFilter?: boolean
  /** Article publish date (for Article schema + OG article). */
  publishedAt?: string
  /** Article modified date. */
  modifiedAt?: string
  /** Author name (for articles). */
  author?: string
  /** Section/category. */
  section?: string
  /** Tags. */
  tags?: string[]
  /** No-index override (forces noindex regardless of route). */
  noindex?: boolean
}

/** Build a complete Next.js Metadata object (T161). */
export function buildMetadata(input: MetadataInput): Metadata {
  const origin = getCanonicalOrigin()
  const contract = getRouteContract(input.family)
  const canonicalPath = buildPathFromInput(input)
  const canonicalUrl = absoluteFromPath(canonicalPath)
  const env = getSeoEnvironment()

  // Determine indexability (T181–T190)
  const indexDecision = resolveIndexability(canonicalPath)
  const isNoindex = input.noindex || indexDecision.classification !== 'index' || !isIndexableEnvironment()

  // Title (full title system in Workstream L, but basic composition here)
  const pageTitle = input.title || SITE_CONFIG.name
  const titleTemplate = '%s | InterviewExplainer'
  const fullTitle = pageTitle === SITE_CONFIG.name ? SITE_CONFIG.name : `${pageTitle} | ${SITE_CONFIG.name}`

  // Description
  const description = input.description || SITE_CONFIG.description

  // OG image
  const ogImage = resolveOgImage(input.image, canonicalPath)

  // Canonical (T171–T180)
  const shouldCanonical = indexDecision.canonicalEmitted && !input.noindex

  const metadata: Metadata = {
    metadataBase: new URL(origin),
    title: fullTitle,
    description,
    keywords: input.keywords,
    alternates: shouldCanonical
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    robots: {
      index: !isNoindex,
      follow: indexDecision.classification !== 'noindex-follow',
      googleBot: {
        index: !isNoindex,
        follow: indexDecision.classification !== 'noindex-follow',
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: input.family === 'question' || input.family === 'dsa-problem' ? 'article' : 'website',
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }] : undefined,
      locale: SITE_CONFIG.locale,
      ...(input.publishedAt && { publishedTime: input.publishedAt }),
      ...(input.modifiedAt && { modifiedTime: input.modifiedAt }),
      ...(input.author && { authors: [input.author] }),
      ...(input.section && { section: input.section }),
      ...(input.tags && { tags: input.tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitter,
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }

  return metadata
}

/** Build the canonical path from the input (T171). */
function buildPathFromInput(input: MetadataInput): string {
  try {
    return buildAbsoluteUrl(input.family, input.params).replace(getCanonicalOrigin(), '')
  } catch {
    // Fallback: construct from params directly
    const contract = getRouteContract(input.family)
    let path = contract.pathTemplate
    for (const [k, v] of Object.entries(input.params)) {
      path = path.replace(`:${k}`, normalizeSlug(v))
    }
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
    return path.toLowerCase()
  }
}

/** Resolve the OG image to an absolute URL (T191–T200). */
function resolveOgImage(image: string | undefined, _canonicalPath: string): string | undefined {
  if (!image) {
    // Default OG image
    return `${getCanonicalOrigin()}/og-default.png`
  }
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }
  // Relative path → absolute
  const clean = image.startsWith('/') ? image : `/${image}`
  return `${getCanonicalOrigin()}${clean}`
}

/** Build metadata for the homepage specifically. */
export function buildHomepageMetadata(): Metadata {
  return buildMetadata({
    family: 'homepage',
    params: {},
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    image: '/og-default.png',
  })
}

/** Build metadata for a static info page (about, privacy, etc.). */
export function buildStaticInfoMetadata(slug: string, title: string, description: string): Metadata {
  return buildMetadata({
    family: 'static-info',
    params: { slug },
    title,
    description,
  })
}

/** Build a minimal noindex metadata (for error pages, etc.). */
export function buildNoindexMetadata(title?: string): Metadata {
  const origin = getCanonicalOrigin()
  return {
    metadataBase: new URL(origin),
    title: title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    robots: {
      index: false,
      follow: true,
    },
  }
}

/** Get the title template string (for layout.tsx). */
export function getTitleTemplate(): { template: string; default: string } {
  return {
    template: '%s | InterviewExplainer',
    default: SITE_CONFIG.name,
  }
}
