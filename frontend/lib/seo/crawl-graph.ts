/**
 * lib/seo/crawl-graph.ts — Content Hierarchy & Crawl Graph (P02-T590–T619)
 *
 * Models the site as a crawl graph: nodes (pages) and edges (links).
 * This enables:
 * - T591: hierarchy depth analysis (every page within 3 clicks of home)
 * - T592: orphan page detection
 * - T593–T600: crawl priority ordering
 * - T601–T610: internal link depth
 * - T611–T619: crawl graph audit
 */

import { type RouteFamily, getRouteContract, ROUTE_REGISTRY } from './route-registry'
import { buildPath } from './url-builder'

/** A node in the crawl graph. */
export interface CrawlNode {
  url: string
  family: RouteFamily
  depth: number
  inlinks: number
  outlinks: string[]
}

/** Build the crawl graph from the route registry (T590). */
export function buildCrawlGraph(): Map<string, CrawlNode> {
  const graph = new Map<string, CrawlNode>()

  // Homepage at depth 0
  graph.set('/', {
    url: '/',
    family: 'homepage',
    depth: 0,
    inlinks: 0,
    outlinks: [],
  })

  // All public routes
  for (const family of Object.keys(ROUTE_REGISTRY) as RouteFamily[]) {
    const contract = getRouteContract(family)
    if (contract.visibility !== 'public') continue
    if (contract.dynamic) continue // dynamic routes added by content sources
    if (family === 'homepage') continue

    const path = buildPath(family, {})
    const depth = path.split('/').filter(Boolean).length
    graph.set(path, {
      url: path,
      family: family as RouteFamily,
      depth,
      inlinks: 0,
      outlinks: [],
    })
  }

  return graph
}

/** Detect orphan pages (T592) — pages with no internal links pointing to them. */
export function detectOrphanPages(graph: Map<string, CrawlNode>): string[] {
  const orphaned: string[] = []
  for (const [path, node] of graph) {
    if (node.inlinks === 0 && path !== '/') {
      orphaned.push(path)
    }
  }
  return orphaned
}

/** Calculate crawl depth for all nodes (T591, T601). */
export function calculateCrawlDepth(graph: Map<string, CrawlNode>): Map<string, number> {
  const depths = new Map<string, number>()
  depths.set('/', 0)

  // BFS from homepage
  const queue = ['/']
  while (queue.length > 0) {
    const current = queue.shift()!
    const node = graph.get(current)
    if (!node) continue
    const currentDepth = depths.get(current) || 0
    for (const outlink of node.outlinks) {
      const existing = depths.get(outlink)
      if (existing === undefined || existing > currentDepth + 1) {
        depths.set(outlink, currentDepth + 1)
        queue.push(outlink)
      }
    }
  }

  return depths
}

/** Get crawl priority ordering (T593–T600).
 * Higher priority = more important to crawl first. */
export function getCrawlPriority(graph: Map<string, CrawlNode>): { url: string; priority: number }[] {
  const priorities: { url: string; priority: number }[] = []
  for (const [path, node] of graph) {
    const contract = getRouteContract(node.family)
    let priority = contract.sitemapPriority || 0.5
    // Boost pages with more inlinks (more important)
    priority += Math.min(node.inlinks * 0.01, 0.2)
    // Penalize deep pages
    priority -= Math.min(node.depth * 0.05, 0.3)
    priorities.push({ url: path, priority: Math.max(0.1, Math.min(1.0, priority)) })
  }
  return priorities.sort((a, b) => b.priority - a.priority)
}

/** Audit the crawl graph (T611–T619). */
export interface CrawlGraphAuditResult {
  totalNodes: number
  maxDepth: number
  orphanPages: string[]
  deepPages: string[]
  avgDepth: number
  issues: string[]
}

export function auditCrawlGraph(graph: Map<string, CrawlNode>): CrawlGraphAuditResult {
  const issues: string[] = []
  const orphanPages = detectOrphanPages(graph)
  const depths = calculateCrawlDepth(graph)

  let maxDepth = 0
  let totalDepth = 0
  const deepPages: string[] = []
  for (const [path, depth] of depths) {
    maxDepth = Math.max(maxDepth, depth)
    totalDepth += depth
    if (depth > 4) {
      deepPages.push(path)
      issues.push(`${path} is ${depth} clicks from home (max 4 recommended, T591)`)
    }
  }

  if (orphanPages.length > 0) {
    issues.push(`${orphanPages.length} orphan pages detected (T592)`)
  }

  return {
    totalNodes: graph.size,
    maxDepth,
    orphanPages,
    deepPages,
    avgDepth: graph.size > 0 ? totalDepth / graph.size : 0,
    issues,
  }
}

/** Build a content hierarchy tree (for visualization, T590). */
export interface HierarchyNode {
  path: string
  family: RouteFamily
  children: HierarchyNode[]
}

export function buildHierarchyTree(graph: Map<string, CrawlNode>): HierarchyNode {
  const root: HierarchyNode = { path: '/', family: 'homepage', children: [] }

  for (const [path, node] of graph) {
    if (path === '/') continue
    const segments = path.split('/').filter(Boolean)
    let current = root
    let currentPath = ''
    for (const seg of segments) {
      currentPath += '/' + seg
      let child = current.children.find((c) => c.path === currentPath)
      if (!child) {
        child = { path: currentPath, family: node.family, children: [] }
        current.children.push(child)
      }
      current = child
    }
  }

  return root
}
