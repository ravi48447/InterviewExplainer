/**
 * lib/seo/og-images.ts — Open Graph Image Architecture (P02-AB, T421+)
 *
 * Centralized OG image management:
 * - Default OG image for the site
 * - Per-route-family OG images
 * - Dynamic OG image generation spec
 * - OG image dimensions and format standards
 */

import { getCanonicalOrigin } from './config'
import { type RouteFamily } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'

/** OG image dimensions (T421). */
export const OG_DIMENSIONS = {
  default: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const

/** Get the OG image for a route (T422). */
export function getOgImage(
  family: RouteFamily,
  params: Record<string, string>,
  customImage?: string,
): { url: string; width: number; height: number; alt: string } {
  const origin = getCanonicalOrigin()

  if (customImage) {
    const url = customImage.startsWith('http') ? customImage : `${origin}${customImage.startsWith('/') ? '' : '/'}${customImage}`
    return { url, width: OG_DIMENSIONS.default.width, height: OG_DIMENSIONS.default.height, alt: 'InterviewExplainer' }
  }

  // Default OG image
  return {
    url: `${origin}/og-default.png`,
    width: OG_DIMENSIONS.default.width,
    height: OG_DIMENSIONS.default.height,
    alt: 'InterviewExplainer — Interview Prep Guide',
  }
}

/** Get Twitter card image (T423). */
export function getTwitterCardImage(family: RouteFamily, params: Record<string, string>): string {
  return getOgImage(family, params).url
}

/** OG image generation spec (for dynamic OG images, T424–T430). */
export interface OgImageSpec {
  title: string
  description?: string
  domain?: string
  logo?: string
  theme: 'light' | 'dark'
  template: 'default' | 'article' | 'question' | 'minimal'
}

/** Build an OG image spec for dynamic generation. */
export function buildOgImageSpec(
  family: RouteFamily,
  title: string,
  description?: string,
): OgImageSpec {
  const templates: Partial<Record<RouteFamily, OgImageSpec['template']>> = {
    question: 'question',
    'dsa-problem': 'question',
    module: 'article',
    pillar: 'article',
    roadmap: 'article',
    cheatsheet: 'minimal',
    domain: 'default',
    'dsa-hub': 'default',
    homepage: 'default',
  }

  return {
    title,
    description,
    theme: 'light',
    template: templates[family] || 'default',
  }
}
