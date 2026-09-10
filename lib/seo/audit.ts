/**
 * lib/seo/audit.ts — Comprehensive SEO Audit (P02-AD/AE, T421+)
 *
 * Runs a comprehensive SEO audit across all dimensions and produces
 * a report. Used by:
 * - Build-time CI checks
 * - The /dev/v2 audit dashboard
 * - Search Console submission validation
 */

import { auditIndexability } from './indexability'
import { auditRendering } from './ssr'
import { buildCrawlGraph, auditCrawlGraph } from './crawl-graph'
import { auditCrawlAccess } from './crawl-access'
import { auditTitles } from './title-system'
import { auditDescriptions } from './description-system'
import { auditDuplicateContent, auditThinPages } from './content-quality'
import { auditInternalLinks } from './internal-links'
import { validateRobotsTxt } from './robots'
import { validateRegistry } from './route-registry'
import { validateRedirectRegistry } from './redirect-registry'
import { auditRewrites } from './rewrite-registry'
import { getCanonicalOrigin } from './config'
import { auditCanonicals } from './canonical-system'
import type { RouteFamily } from './route-registry'

/** Full audit report. */
export interface SeoAuditReport {
  timestamp: string
  origin: string
  summary: {
    totalChecks: number
    passed: number
    failed: number
    warnings: number
  }
  sections: {
    name: string
    status: 'pass' | 'fail' | 'warning'
    details: unknown
    issues?: string[]
  }[]
}

/** Run the comprehensive audit (T421+). */
export function runComprehensiveAudit(
  contentPages?: { url: string; family: RouteFamily; content: string; title: string; description: string; canonical: string | null }[],
): SeoAuditReport {
  const origin = getCanonicalOrigin()
  const sections: SeoAuditReport['sections'] = []
  let passed = 0
  let failed = 0
  let warnings = 0

  // 1. Route Registry
  const registry = validateRegistry()
  sections.push({
    name: 'Route Registry',
    status: registry.valid ? 'pass' : 'fail',
    details: { issues: registry.issues },
    issues: registry.issues,
  })
  registry.valid ? passed++ : failed++

  // 2. Redirect Registry
  const redirects = validateRedirectRegistry()
  sections.push({
    name: 'Redirect Registry',
    status: redirects.valid ? 'pass' : 'fail',
    details: { chains: redirects.chains, loops: redirects.loops },
    issues: [...redirects.chains.map((c) => `Chain: ${c.source}`), ...redirects.loops],
  })
  redirects.valid ? passed++ : failed++

  // 3. Rewrite Audit
  const rewrites = auditRewrites()
  sections.push({
    name: 'Rewrites',
    status: rewrites.valid ? 'pass' : 'warning',
    details: rewrites,
    issues: rewrites.shadowedRoutes,
  })
  rewrites.valid ? passed++ : warnings++

  // 4. Indexability
  const indexability = auditIndexability()
  const idxStatus = indexability.inconsistencies.length === 0 ? 'pass' : 'warning'
  sections.push({
    name: 'Indexability',
    status: idxStatus,
    details: indexability,
    issues: indexability.inconsistencies,
  })
  idxStatus === 'pass' ? passed++ : warnings++

  // 5. Robots.txt
  const robots = validateRobotsTxt()
  sections.push({
    name: 'robots.txt',
    status: robots.valid ? 'pass' : 'fail',
    details: { issues: robots.issues },
    issues: robots.issues,
  })
  robots.valid ? passed++ : failed++

  // 6. Rendering
  const rendering = auditRendering()
  sections.push({
    name: 'Rendering Strategy',
    status: rendering.issues.length === 0 ? 'pass' : 'fail',
    details: rendering,
    issues: rendering.issues,
  })
  rendering.issues.length === 0 ? passed++ : failed++

  // 7. Crawl Graph
  const graph = buildCrawlGraph()
  const crawlGraph = auditCrawlGraph(graph)
  sections.push({
    name: 'Crawl Graph',
    status: crawlGraph.issues.length === 0 ? 'pass' : 'warning',
    details: crawlGraph,
    issues: crawlGraph.issues,
  })
  crawlGraph.issues.length === 0 ? passed++ : warnings++

  // 8. Crawl Access
  const crawlAccess = auditCrawlAccess()
  sections.push({
    name: 'Crawl Access',
    status: crawlAccess.issues.length === 0 ? 'pass' : 'fail',
    details: crawlAccess,
    issues: crawlAccess.issues,
  })
  crawlAccess.issues.length === 0 ? passed++ : failed++

  // 9–11. Content quality (if pages provided)
  if (contentPages && contentPages.length > 0) {
    // Titles
    const titles = auditTitles(contentPages.map((p) => ({ url: p.url, title: p.title, family: p.family })))
    sections.push({
      name: 'Titles',
      status: titles.duplicates === 0 && titles.tooLong === 0 && titles.tooShort === 0 ? 'pass' : 'warning',
      details: titles,
    })
    titles.duplicates === 0 ? passed++ : warnings++

    // Descriptions
    const descs = auditDescriptions(contentPages.map((p) => ({ url: p.url, description: p.description })))
    sections.push({
      name: 'Descriptions',
      status: descs.duplicates === 0 && descs.tooLong === 0 && descs.tooShort === 0 ? 'pass' : 'warning',
      details: descs,
    })
    descs.duplicates === 0 ? passed++ : warnings++

    // Duplicate content
    const dupes = auditDuplicateContent(contentPages.map((p) => ({ url: p.url, content: p.content })))
    sections.push({
      name: 'Duplicate Content',
      status: dupes.duplicates === 0 ? 'pass' : 'warning',
      details: dupes,
    })
    dupes.duplicates === 0 ? passed++ : warnings++

    // Thin pages
    const thin = auditThinPages(contentPages.map((p) => ({ url: p.url, family: p.family, content: p.content })))
    sections.push({
      name: 'Thin Pages',
      status: thin.thin === 0 ? 'pass' : 'warning',
      details: thin,
    })
    thin.thin === 0 ? passed++ : warnings++

    // Canonicals
    const canonicals = auditCanonicals(contentPages.map((p) => ({ url: p.url, canonical: p.canonical })))
    sections.push({
      name: 'Canonical Tags',
      status: canonicals.missing === 0 && canonicals.invalid === 0 ? 'pass' : 'fail',
      details: canonicals,
    })
    canonicals.missing === 0 && canonicals.invalid === 0 ? passed++ : failed++
  }

  const totalChecks = sections.length
  return {
    timestamp: new Date(0).toISOString(), // Use epoch — Date.now() unavailable in workflow context; caller stamps
    origin,
    summary: { totalChecks, passed, failed: failed + (totalChecks - passed - warnings), warnings },
    sections,
  }
}

// Re-export for convenience
export { auditCanonicals } from './canonical-system'
