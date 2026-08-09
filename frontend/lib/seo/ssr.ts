/**
 * lib/seo/ssr.ts — Server Rendering & Crawlable Content (P02-T490–T519)
 *
 * Ensures content is server-rendered (SSR/SSG) and crawlable without
 * JavaScript. Google can render JS but SSR is still better for SEO:
 * faster TTFB, guaranteed content in HTML, no deferred hydration gaps.
 *
 * - T491: identify SSR vs CSR pages
 * - T492: enforce SSR for all indexable content routes
 * - T493–T500: content availability without JS
 * - T501–T510: metadata in initial HTML
 * - T511–T519: rendering audit
 */

import { getRouteContract, ROUTE_REGISTRY, type RouteFamily } from './route-registry'

/** Rendering strategy for a route. */
export type RenderStrategy = 'ssg' | 'ssr' | 'isr' | 'csr'

/** Determine the render strategy for a route family (T491). */
export function getRenderStrategy(family: RouteFamily): RenderStrategy {
  const contract = getRouteContract(family)
  // Static info and hub pages → SSG
  if (family === 'homepage' || family === 'static-info' || family === 'dsa-hub') {
    return 'ssg'
  }
  // Content routes → ISR (revalidate periodically)
  if (contract.dynamic && contract.visibility === 'public') {
    return 'isr'
  }
  // User-specific routes → SSR (always fresh)
  if (contract.visibility === 'private') {
    return 'ssr'
  }
  // Default for public content → ISR
  if (contract.visibility === 'public') {
    return 'isr'
  }
  // Dev/internal → CSR
  return 'csr'
}

/** ISR revalidation periods (T492). */
export const ISR_REVALIDATE = {
  homepage: 3600, // 1 hour
  content: 86400, // 24 hours
  dsa: 86400, // 24 hours
  static: 604800, // 7 days
} as const

/** Get the revalidate period for a route family. */
export function getRevalidatePeriod(family: RouteFamily): number {
  switch (family) {
    case 'homepage':
      return ISR_REVALIDATE.homepage
    case 'static-info':
      return ISR_REVALIDATE.static
    case 'dsa-hub':
    case 'dsa-category':
    case 'dsa-pattern':
    case 'dsa-sheet':
    case 'dsa-company':
    case 'dsa-module':
    case 'dsa-problem':
      return ISR_REVALIDATE.dsa
    default:
      return ISR_REVALIDATE.content
  }
}

/** Check if a route should be server-rendered (T492). */
export function shouldServerRender(family: RouteFamily): boolean {
  const strategy = getRenderStrategy(family)
  return strategy !== 'csr'
}

/** Content availability audit — ensure critical content is in SSR HTML (T493–T500). */
export interface ContentAvailabilitySpec {
  /** Route family. */
  family: RouteFamily
  /** Required elements that must be in SSR HTML (CSS selectors). */
  requiredElements: string[]
  /** Required text content that must be in SSR HTML. */
  requiredText: string[]
}

/** Content availability requirements per route family (T493). */
export const CONTENT_AVAILABILITY: Partial<Record<RouteFamily, ContentAvailabilitySpec>> = {
  homepage: {
    family: 'homepage',
    requiredElements: ['h1', 'nav', 'main'],
    requiredText: ['InterviewExplainer'],
  },
  domain: {
    family: 'domain',
    requiredElements: ['h1', 'main', 'nav'],
    requiredText: [],
  },
  module: {
    family: 'module',
    requiredElements: ['h1', 'h2', 'main', 'article'],
    requiredText: [],
  },
  question: {
    family: 'question',
    requiredElements: ['h1', 'main', 'article'],
    requiredText: [],
  },
  'dsa-problem': {
    family: 'dsa-problem',
    requiredElements: ['h1', 'main', 'article'],
    requiredText: [],
  },
}

/** Check if metadata is in the initial HTML (T501–T510). */
export function getRequiredMetadataInHtml(): string[] {
  return [
    'title',
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'link[rel="canonical"]',
    'meta[name="robots"]',
  ]
}

/** Audit rendering strategy for all routes (T511–T519). */
export interface RenderingAuditResult {
  total: number
  ssr: number
  ssg: number
  isr: number
  csr: number
  issues: string[]
}

export function auditRendering(): RenderingAuditResult {
  const issues: string[] = []
  let ssr = 0
  let ssg = 0
  let isr = 0
  let csr = 0

  for (const family of Object.keys(ROUTE_REGISTRY) as RouteFamily[]) {
    const contract = getRouteContract(family)
    const strategy = getRenderStrategy(family)
    switch (strategy) {
      case 'ssr':
        ssr++
        break
      case 'ssg':
        ssg++
        break
      case 'isr':
        isr++
        break
      case 'csr':
        csr++
        if (contract.visibility === 'public' && contract.indexability === 'index') {
          issues.push(`${family}: CSR for indexable public route — should be SSR/SSG/ISR (T492)`)
        }
        break
    }
  }

  return {
    total: ssr + ssg + isr + csr,
    ssr,
    ssg,
    isr,
    csr,
    issues,
  }
}

/** Ensure content is in the initial server response (T493).
 * This is a spec/checklist that build-time tests can verify. */
export function getContentInHtmlChecklist(family: RouteFamily): string[] {
  const spec = CONTENT_AVAILABILITY[family]
  if (!spec) return []
  return [
    ...spec.requiredElements.map((el) => `HTML contains <${el}>`),
    ...spec.requiredText.map((text) => `HTML contains text "${text}"`),
    'All above-the-fold content is in SSR HTML (no JS required)',
    'Internal links are <a href> tags (not JS click handlers)',
    'Images have alt attributes',
    'Structured data is in <script type="application/ld+json">',
  ]
}
