/**
 * lib/seo/performance.ts — Performance Foundations for SEO (P02-AA, T361+)
 *
 * Core Web Vitals directly affect rankings. This module provides:
 * - LCP optimization specs (T361–T370)
 * - CLS prevention (T371–T380)
 * - INP/FID optimization (T381–T390)
 * - Image optimization (T391–T400)
 * - Font loading (T401–T410)
 * - Preload/prefetch hints (T411–T420)
 */

/** Core Web Vitals targets (T361). */
export const CWV_TARGETS = {
  LCP: { good: 2500, needsImprovement: 4000, unit: 'ms' }, // T361
  CLS: { good: 0.1, needsImprovement: 0.25, unit: 'score' }, // T371
  INP: { good: 200, needsImprovement: 500, unit: 'ms' }, // T381
  FCP: { good: 1800, needsImprovement: 3000, unit: 'ms' },
  TTFB: { good: 800, needsImprovement: 1800, unit: 'ms' },
} as const

/** LCP optimization spec (T361–T370). */
export function getLcpOptimizationSpec(): { recommendations: string[]; preloadHints: string[] } {
  return {
    recommendations: [
      'Preload the LCP image (hero image or OG image) with fetchpriority="high" (T362)',
      'Server-render the above-the-fold content (T363)',
      'Inline critical CSS (T364)',
      'Defer non-critical JavaScript (T365)',
      'Use CDN for static assets (T366)',
      'Optimize images: use next/image with priority for LCP image (T367)',
      'Avoid render-blocking resources (T368)',
      'Use font-display: swap for web fonts (T369)',
      'Minimize TTFB with edge rendering (T370)',
    ],
    preloadHints: [
      '<link rel="preload" as="image" href="/og-default.png" fetchpriority="high">',
      '<link rel="preload" as="style" href="/globals.css">',
      '<link rel="preload" as="font" href="/fonts/inter.woff2" type="font/woff2" crossorigin>',
    ],
  }
}

/** CLS prevention spec (T371–T380). */
export function getClsPreventionSpec(): { recommendations: string[] } {
  return {
    recommendations: [
      'Always set width and height on images (T372)',
      'Use CSS aspect-ratio for responsive media (T373)',
      'Reserve space for ads/embeds (T374)',
      'Avoid dynamically injected content above the fold (T375)',
      'Use font-display: swap and font size adjust (T376)',
      'Preconnect to font origins (T377)',
      'Avoid layout shifts from web fonts (T378)',
      'Set explicit dimensions on embeds/iframes (T379)',
      'Use CSS contain for off-screen content (T380)',
    ],
  }
}

/** INP optimization spec (T381–T390). */
export function getInpOptimizationSpec(): { recommendations: string[] } {
  return {
    recommendations: [
      'Break up long tasks (>50ms) (T382)',
      'Use requestIdleCallback for non-critical work (T383)',
      'Debounce/throttle event handlers (T384)',
      'Use React.lazy for below-the-fold components (T385)',
      'Minimize main thread blocking (T386)',
      'Use Web Workers for heavy computation (T387)',
      'Avoid layout thrashing (T388)',
      'Use content-visibility: auto for long lists (T389)',
      'Optimize hydration: selective hydration (T390)',
    ],
  }
}

/** Image optimization spec (T391–T400). */
export function getImageOptimizationSpec(): { recommendations: string[] } {
  return {
    recommendations: [
      'Use next/image for all images (T392)',
      'Serve WebP/AVIF formats (T393)',
      'Set explicit width/height (T394)',
      'Use loading="lazy" for below-the-fold images (T395)',
      'Use fetchpriority="high" for LCP image (T396)',
      'Generate responsive srcset (T397)',
      'Compress images (lossy for photos, lossless for graphics) (T398)',
      'Use blur placeholder for LCP image (T399)',
      'Avoid too many images above the fold (T400)',
    ],
  }
}

/** Font loading spec (T401–T410). */
export function getFontLoadingSpec(): { recommendations: string[]; preconnect: string[] } {
  return {
    recommendations: [
      'Use font-display: swap (T402)',
      'Self-host fonts when possible (T403)',
      'Preload critical font (T404)',
      'Use variable fonts to reduce requests (T405)',
      'Subset fonts to required characters (T406)',
      'Use woff2 format (T407)',
      'Preconnect to font CDN (T408)',
      'Avoid FOIT (Flash of Invisible Text) (T409)',
      'Set font size-adjust to minimize CLS (T410)',
    ],
    preconnect: ['<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'],
  }
}

/** Preload/prefetch hints (T411–T420). */
export interface PreloadHint {
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch'
  as?: string
  href: string
  crossOrigin?: 'anonymous'
  fetchPriority?: 'high' | 'low' | 'auto'
  type?: string
}

/** Get preload hints for a route family. */
export function getPreloadHints(family: string): PreloadHint[] {
  const hints: PreloadHint[] = [
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  ]

  if (family === 'homepage') {
    hints.push({ rel: 'preload', as: 'image', href: '/og-default.png', fetchPriority: 'high' })
  }

  hints.push({ rel: 'preload', as: 'style', href: '/_next/static/css/app.css' })
  hints.push({ rel: 'preload', as: 'font', href: '/fonts/inter.woff2', type: 'font/woff2', crossOrigin: 'anonymous' })

  return hints
}

/** Performance audit (T421–T429). */
export interface PerformanceAuditResult {
  issues: string[]
  recommendations: string[]
}

export function auditPerformance(pageHtml: string): PerformanceAuditResult {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for render-blocking scripts
  if (pageHtml.includes('<script') && !pageHtml.includes('defer') && !pageHtml.includes('async')) {
    issues.push('Render-blocking scripts detected — add defer/async (T365)')
  }

  // Check for images without dimensions
  const imgMatches = pageHtml.match(/<img[^>]*>/gi) || []
  for (const img of imgMatches) {
    if (!img.includes('width=') && !img.includes('height=')) {
      issues.push('Image without explicit dimensions detected (T372)')
      break
    }
  }

  // Check for font preconnect
  if (!pageHtml.includes('preconnect')) {
    recommendations.push('Add preconnect for font origins (T408)')
  }

  // Check for preload
  if (!pageHtml.includes('preload')) {
    recommendations.push('Add preload for LCP asset (T362)')
  }

  return { issues, recommendations }
}
