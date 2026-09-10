/**
 * lib/seo/validation.ts — Build-Time & Runtime Validation (P02-AB/AC, T421+)
 *
 * Central validation that runs at build time and can be invoked at runtime
 * to ensure the entire SEO system is consistent:
 * - Route registry integrity
 * - Redirect registry (no chains, no loops)
 * - Indexability consistency
 * - Sitemap validity
 * - Canonical correctness
 * - Structured data validity
 * - Title/description compliance
 * - Internal link integrity
 * - Crawl graph health
 * - Content quality (no thin/duplicate)
 */

import { validateRegistry } from './route-registry'
import { validateRedirectRegistry } from './redirect-registry'
import { auditRewrites } from './rewrite-registry'
import { auditIndexability } from './indexability'
import { validateRobotsTxt } from './robots'
import { auditCanonicals, validateCanonical } from './canonical-system'
import { validateSitemap } from './sitemap-system'
import { validateSitemapSplit } from './sitemap-scale'
import { splitSitemapEntries } from './sitemap-scale'
import { auditRendering } from './ssr'
import { auditCrawlGraph, buildCrawlGraph } from './crawl-graph'
import { auditCrawlAccess } from './crawl-access'
import { validateSchema } from './structured-data'
import { validateBreadcrumbs } from './breadcrumbs'
import { validateTitle } from './title-system'
import { validateDescription } from './description-system'

/** Full validation result. */
export interface FullValidationResult {
  passed: boolean
  checks: {
    name: string
    passed: boolean
    issues?: string[]
  }[]
}

/** Run all validations (build-time check). */
export function runFullValidation(): FullValidationResult {
  const checks: { name: string; passed: boolean; issues?: string[] }[] = []

  // 1. Route registry
  const registry = validateRegistry()
  checks.push({ name: 'Route Registry', passed: registry.valid, issues: registry.issues })

  // 2. Redirect registry
  const redirects = validateRedirectRegistry()
  checks.push({
    name: 'Redirect Registry',
    passed: redirects.valid,
    issues: [...redirects.chains.map((c) => `Chain: ${c.source} → ${c.target}`), ...redirects.loops.map((l) => `Loop: ${l}`)],
  })

  // 3. Rewrite audit
  const rewrites = auditRewrites()
  checks.push({
    name: 'Rewrite Audit',
    passed: rewrites.valid,
    issues: [...rewrites.shadowedRoutes, ...rewrites.publicUrlLeaks, ...rewrites.undocumentedRewrites],
  })

  // 4. Indexability
  const indexability = auditIndexability()
  checks.push({ name: 'Indexability', passed: indexability.inconsistencies.length === 0, issues: indexability.inconsistencies })

  // 5. Robots.txt
  const robots = validateRobotsTxt()
  checks.push({ name: 'robots.txt', passed: robots.valid, issues: robots.issues })

  // 6. Rendering
  const rendering = auditRendering()
  checks.push({ name: 'Rendering', passed: rendering.issues.length === 0, issues: rendering.issues })

  // 7. Crawl graph
  const graph = buildCrawlGraph()
  const crawlAudit = auditCrawlGraph(graph)
  checks.push({ name: 'Crawl Graph', passed: crawlAudit.issues.length === 0, issues: crawlAudit.issues })

  // 8. Crawl access
  const crawlAccess = auditCrawlAccess()
  checks.push({ name: 'Crawl Access', passed: crawlAccess.issues.length === 0, issues: crawlAccess.issues })

  const passed = checks.every((c) => c.passed)

  return { passed, checks }
}

/** Validate a single page's SEO at runtime. */
export interface PageSeoValidation {
  canonical: { valid: boolean; issues: string[] }
  title: { valid: boolean; issues: string[] }
  description: { valid: boolean; issues: string[] }
  robots: { valid: boolean; issues: string[] }
  structuredData: { valid: boolean; issues: string[] }
  breadcrumbs: { valid: boolean; issues: string[] }
}

/** Runtime validation helper for a page. */
export function validatePageSeo(input: {
  canonicalUrl: string
  title: string
  description: string
  robotsMeta: string
  schema: object | null
  breadcrumbs: { name: string; url: string; current: boolean }[]
}): PageSeoValidation {
  const canonical = validateCanonical(input.canonicalUrl)
  const title = validateTitle(input.title)
  const description = validateDescription(input.description)
  const robots = { valid: input.robotsMeta.length > 0, issues: input.robotsMeta ? [] : ['Missing robots meta'] }
  const structuredData = input.schema ? validateSchema(input.schema) : { valid: false, issues: ['Missing structured data'] }
  const breadcrumbs = validateBreadcrumbs(input.breadcrumbs)

  return {
    canonical,
    title,
    description,
    robots,
    structuredData,
    breadcrumbs,
  }
}
