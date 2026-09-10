/**
 * lib/seo/images.ts — Image SEO Architecture (P02-AC, T421+)
 *
 * Image optimization for SEO:
 * - Alt text on all images
 * - Descriptive filenames
 * - Responsive srcset
 * - Lazy loading
 * - Structured data for images
 */

import { type RouteFamily } from './route-registry'

/** Image SEO spec. */
export interface ImageSeoSpec {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
  sizes?: string
}

/** Validate image alt text (T421+). */
export function validateImageAlt(alt: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  if (!alt || alt.trim().length === 0) {
    issues.push('Missing alt text (T421)')
  }
  if (alt.length > 125) {
    issues.push('Alt text too long (>125 chars, T422)')
  }
  if (/^(image|photo|picture|img|graphic)$/i.test(alt.trim())) {
    issues.push('Generic alt text — describe the image (T423)')
  }
  return { valid: issues.length === 0, issues }
}

/** Generate alt text from context (T424). */
export function generateAltText(
  family: RouteFamily,
  entityName: string,
  imageType: 'diagram' | 'screenshot' | 'chart' | 'illustration' | 'photo',
): string {
  const typeMap: Record<string, string> = {
    diagram: 'diagram illustrating',
    screenshot: 'screenshot of',
    chart: 'chart showing',
    illustration: 'illustration of',
    photo: 'photo of',
  }
  const prefix = typeMap[imageType] || 'image of'
  return `${prefix} ${entityName}`
}

/** Get image filename recommendation (T425). */
export function getRecommendedFilename(
  family: RouteFamily,
  entityName: string,
  imageType: string,
): string {
  const slug = entityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug}-${imageType}.webp`
}

/** Image structured data (T426). */
export function buildImageSchema(image: ImageSeoSpec, caption?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: image.src,
    ...(image.width && { width: image.width }),
    ...(image.height && { height: image.height }),
    caption: caption || image.alt,
    description: image.alt,
  }
}

/** Get image loading strategy (T427). */
export function getImageLoadingStrategy(
  position: 'above-fold' | 'below-fold' | 'lcp',
): { loading: 'lazy' | 'eager'; priority: boolean } {
  if (position === 'lcp') {
    return { loading: 'eager', priority: true }
  }
  if (position === 'above-fold') {
    return { loading: 'eager', priority: false }
  }
  return { loading: 'lazy', priority: false }
}
