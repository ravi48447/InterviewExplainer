/**
 * lib/seo/breadcrumbs.ts — Breadcrumb Architecture (P02-T450–T489)
 *
 * Breadcrumbs generated from the route hierarchy. Every non-homepage
 * content page gets breadcrumbs that reflect its position in the site
 * hierarchy — both as visible UI and as BreadcrumbList JSON-LD.
 *
 * - T451: breadcrumb generator from route registry
 * - T452: breadcrumb hierarchy per route family
 * - T453–T460: parent-child traversal
 * - T461–T470: breadcrumb structured data
 * - T471–T480: breadcrumb visual component data
 * - T481–T489: breadcrumb validation
 */

import { getCanonicalOrigin } from './config'
import { type RouteFamily } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'

/** A single breadcrumb item. */
export interface BreadcrumbItem {
  name: string
  url: string
  /** Whether this is the current (last) breadcrumb. */
  current: boolean
}

/** Build breadcrumbs for a route (T451, T452). */
export function buildBreadcrumbs(
  family: RouteFamily,
  params: Record<string, string>,
  entityNames: Record<string, string>,
): BreadcrumbItem[] {
  const origin = getCanonicalOrigin()
  const items: BreadcrumbItem[] = [{ name: 'Home', url: `${origin}/`, current: false }]

  switch (family) {
    case 'domain': {
      const slug = params.domainSlug || ''
      items.push({
        name: entityNames.domainSlug || slug,
        url: buildAbsoluteUrl('domain', { domainSlug: slug }),
        current: true,
      })
      break
    }
    case 'stack': {
      const dSlug = params.domainSlug || ''
      const sSlug = params.stackSlug || ''
      items.push({
        name: entityNames.domainSlug || dSlug,
        url: buildAbsoluteUrl('domain', { domainSlug: dSlug }),
        current: false,
      })
      items.push({
        name: entityNames.stackSlug || sSlug,
        url: buildAbsoluteUrl('stack', { domainSlug: dSlug, stackSlug: sSlug }),
        current: true,
      })
      break
    }
    case 'pillar': {
      const slug = params.pillarSlug || ''
      items.push({
        name: entityNames.pillarSlug || slug,
        url: buildAbsoluteUrl('pillar', { pillarSlug: slug }),
        current: true,
      })
      break
    }
    case 'module': {
      const dSlug = params.domainSlug || ''
      const mSlug = params.moduleSlug || ''
      items.push({
        name: entityNames.domainSlug || dSlug,
        url: buildAbsoluteUrl('domain', { domainSlug: dSlug }),
        current: false,
      })
      items.push({
        name: entityNames.moduleSlug || mSlug,
        url: buildAbsoluteUrl('module', { domainSlug: dSlug, moduleSlug: mSlug }),
        current: true,
      })
      break
    }
    case 'question': {
      const dSlug = params.domainSlug || ''
      const sSlug = params.stackSlug || ''
      const qSlug = params.questionSlug || ''
      items.push({
        name: entityNames.domainSlug || dSlug,
        url: buildAbsoluteUrl('domain', { domainSlug: dSlug }),
        current: false,
      })
      items.push({
        name: entityNames.stackSlug || sSlug,
        url: buildAbsoluteUrl('stack', { domainSlug: dSlug, stackSlug: sSlug }),
        current: false,
      })
      items.push({
        name: entityNames.questionSlug || qSlug,
        url: buildAbsoluteUrl('question', { domainSlug: dSlug, stackSlug: sSlug, questionSlug: qSlug }),
        current: true,
      })
      break
    }
    case 'topic':
    case 'company':
    case 'tool':
    case 'roadmap':
    case 'cheatsheet':
    case 'career':
    case 'behavioral': {
      const slug = params.slug || ''
      items.push({
        name: entityNames.slug || slug,
        url: buildAbsoluteUrl(family, { slug }),
        current: true,
      })
      break
    }
    case 'comparison': {
      const slug = params.slug || ''
      items.push({
        name: 'Comparisons',
        url: `${origin}/compare`,
        current: false,
      })
      items.push({
        name: entityNames.slug || slug,
        url: buildAbsoluteUrl('comparison', { slug }),
        current: true,
      })
      break
    }
    case 'dsa-hub': {
      items.push({ name: 'DSA', url: buildAbsoluteUrl('dsa-hub', {}), current: true })
      break
    }
    case 'dsa-category':
    case 'dsa-pattern':
    case 'dsa-sheet':
    case 'dsa-company': {
      const slug = params.slug || ''
      items.push({ name: 'DSA', url: buildAbsoluteUrl('dsa-hub', {}), current: false })
      items.push({
        name: entityNames.slug || slug,
        url: buildAbsoluteUrl(family, { slug }),
        current: true,
      })
      break
    }
    case 'dsa-problem': {
      const cat = params.categorySlug || ''
      const slug = params.problemSlug || ''
      items.push({ name: 'DSA', url: buildAbsoluteUrl('dsa-hub', {}), current: false })
      if (cat) {
        items.push({
          name: entityNames.categorySlug || cat,
          url: buildAbsoluteUrl('dsa-category', { slug: cat }),
          current: false,
        })
      }
      items.push({
        name: entityNames.problemSlug || slug,
        url: buildAbsoluteUrl('dsa-problem', { categorySlug: cat, problemSlug: slug }),
        current: true,
      })
      break
    }
    case 'dsa-module': {
      const slug = params.slug || ''
      items.push({ name: 'DSA', url: buildAbsoluteUrl('dsa-hub', {}), current: false })
      items.push({
        name: entityNames.slug || slug,
        url: buildAbsoluteUrl('dsa-module', { slug }),
        current: true,
      })
      break
    }
    case 'static-info': {
      const slug = params.slug || ''
      items.push({
        name: entityNames.slug || slug,
        url: buildAbsoluteUrl('static-info', { slug }),
        current: true,
      })
      break
    }
    default:
      break
  }

  return items
}

/** Build BreadcrumbList JSON-LD from breadcrumb items (T461–T470). */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Validate breadcrumbs (T481–T489). */
export function validateBreadcrumbs(items: BreadcrumbItem[]): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const origin = getCanonicalOrigin()

  if (items.length === 0) {
    issues.push('No breadcrumb items')
    return { valid: false, issues }
  }

  // First item should be Home
  if (items[0].name !== 'Home' || items[0].url !== `${origin}/`) {
    issues.push('First breadcrumb should be Home')
  }

  // Last item should be current
  if (!items[items.length - 1].current) {
    issues.push('Last breadcrumb should be marked current')
  }

  // Only last should be current
  const currentCount = items.filter((i) => i.current).length
  if (currentCount !== 1) {
    issues.push(`Expected 1 current breadcrumb, found ${currentCount}`)
  }

  // URLs should be absolute HTTPS
  for (const item of items) {
    if (!item.url.startsWith('https://')) {
      issues.push(`URL not HTTPS: ${item.url}`)
    }
    if (!item.url.startsWith(origin)) {
      issues.push(`URL not on canonical origin: ${item.url}`)
    }
  }

  // Check hierarchy (each URL should be a prefix of the next)
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1].url.replace(/\/$/, '')
    const curr = items[i].url
    if (!curr.startsWith(prev)) {
      issues.push(`Hierarchy break: ${prev} → ${curr}`)
    }
  }

  return { valid: issues.length === 0, issues }
}
