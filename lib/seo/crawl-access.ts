/**
 * lib/seo/crawl-access.ts — Search Engine Access & Rendering (P02-T700–T719)
 *
 * Ensures search engines can access and render all content:
 * - T701: no blocking of CSS/JS in robots.txt
 * - T702: no blocking of rendered content
 * - T703–T710: crawl budget management
 * - T711–T719: rendering audit
 */

import { buildRobotsTxt } from './robots'
import { getPublicRoutes, getPrivateRoutes } from './route-registry'

/** Check that robots.txt doesn't block CSS/JS (T701). */
export function validateRobotsNoBlockAssets(): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const robots = buildRobotsTxt()

  // CSS/JS must not be blocked
  const assetPaths = ['/css/', '/js/', '/_next/static/', '/static/']
  for (const path of assetPaths) {
    if (robots.includes(`Disallow: ${path}`)) {
      issues.push(`robots.txt blocks ${path} — CSS/JS must be accessible (T701)`)
    }
  }

  return { valid: issues.length === 0, issues }
}

/** Crawl budget management (T703–T710).
 * Don't waste crawl budget on low-value pages. */
export interface CrawlBudgetSpec {
  /** Routes that consume crawl budget but return no SEO value. */
  wasteRoutes: string[]
  /** Routes that should be crawled but aren't. */
  missingRoutes: string[]
  /** Total indexable URLs (should be manageable). */
  totalIndexable: number
}

export function analyzeCrawlBudget(): CrawlBudgetSpec {
  const wasteRoutes: string[] = []
  const publicRoutes = getPublicRoutes()
  const privateRoutes = getPrivateRoutes()

  // Private routes in sitemap waste crawl budget
  for (const r of privateRoutes) {
    wasteRoutes.push(r.pathTemplate)
  }

  return {
    wasteRoutes,
    missingRoutes: [],
    totalIndexable: publicRoutes.filter((r) => r.indexability === 'index').length,
  }
}

/** Ensure content is renderable without JavaScript (T702, T711–T719). */
export function getRenderabilityChecklist(): string[] {
  return [
    'Content HTML is in the initial server response (not client-rendered)',
    'CSS is not blocked by robots.txt (T701)',
    'JavaScript is not blocked by robots.txt (T701)',
    'Images use loading="lazy" but above-the-fold images are eager',
    'Critical CSS is inlined or preloaded',
    'No content requires user interaction to become visible',
    'Structured data is in the HTML (not injected client-side)',
    'Internal links are real <a> tags (not JS onclick)',
    'Page title is in the initial HTML <title>',
    'Meta description is in the initial HTML <meta>',
  ]
}

/** Audit crawl access (T711–T719). */
export interface CrawlAccessAuditResult {
  robotsValid: boolean
  assetsBlocked: boolean
  issues: string[]
}

export function auditCrawlAccess(): CrawlAccessAuditResult {
  const issues: string[] = []
  const robotsCheck = validateRobotsNoBlockAssets()
  if (!robotsCheck.valid) {
    issues.push(...robotsCheck.issues)
  }
  const budget = analyzeCrawlBudget()
  if (budget.wasteRoutes.length > 0) {
    issues.push(`${budget.wasteRoutes.length} private routes may waste crawl budget (T703)`)
  }

  return {
    robotsValid: issues.length === 0,
    assetsBlocked: !robotsCheck.valid,
    issues,
  }
}
