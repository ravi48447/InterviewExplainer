/**
 * lib/seo/internal-links.ts — Internal Linking Architecture (P02-T550–T589)
 *
 * Internal links are generated from the route registry, ensuring:
 * - T551: all internal links use canonical URLs (from url-builder)
 * - T552: no broken links (all link targets exist in registry)
 * - T553: link equity flows from hub → leaf pages
 * - T554–T560: related content links
 * - T561–T570: navigation links
 * - T571–T580: footer links
 * - T581–T589: internal link audit
 */

import { getCanonicalOrigin } from './config'
import { type RouteFamily, ROUTE_REGISTRY } from './route-registry'
import { buildAbsoluteUrl, buildPath } from './url-builder'

/** A typed internal link. */
export interface InternalLink {
  href: string
  label: string
  family: RouteFamily
  params: Record<string, string>
}

/** Build an internal link from a route family + params (T551). */
export function buildInternalLink(
  family: RouteFamily,
  params: Record<string, string>,
  label: string,
): InternalLink {
  return {
    href: buildAbsoluteUrl(family, params),
    label,
    family,
    params,
  }
}

/** Build a relative internal link (for <Link href>). */
export function buildRelativeLink(
  family: RouteFamily,
  params: Record<string, string>,
  label: string,
): InternalLink {
  return {
    href: buildPath(family, params),
    label,
    family,
    params,
  }
}

/** Primary navigation links (T561–T570). */
export function getPrimaryNavLinks(): InternalLink[] {
  return [
    buildRelativeLink('homepage', {}, 'Home'),
    buildRelativeLink('dsa-hub', {}, 'DSA'),
    buildRelativeLink('pillar', { pillarSlug: 'system-design' }, 'System Design'),
    buildRelativeLink('pillar', { pillarSlug: 'behavioral' }, 'Behavioral'),
    buildRelativeLink('career', { slug: 'career-paths' }, 'Careers'),
  ]
}

/** Footer links (T571–T580). */
export function getFooterLinks(): { section: string; links: InternalLink[] }[] {
  return [
    {
      section: 'Company',
      links: [
        buildRelativeLink('static-info', { slug: 'about' }, 'About'),
        buildRelativeLink('static-info', { slug: 'support' }, 'Support'),
      ],
    },
    {
      section: 'Legal',
      links: [
        buildRelativeLink('static-info', { slug: 'privacy' }, 'Privacy Policy'),
        buildRelativeLink('static-info', { slug: 'terms' }, 'Terms of Service'),
        buildRelativeLink('static-info', { slug: 'cookies' }, 'Cookie Policy'),
      ],
    },
    {
      section: 'Learn',
      links: [
        buildRelativeLink('dsa-hub', {}, 'DSA Hub'),
        buildRelativeLink('roadmap', { slug: 'dsa-roadmap' }, 'DSA Roadmap'),
        buildRelativeLink('cheatsheet', { slug: 'dsa-cheatsheet' }, 'DSA Cheatsheet'),
      ],
    },
  ]
}

/** Related content links for a given page (T554–T560). */
export function getRelatedLinks(
  currentFamily: RouteFamily,
  currentParams: Record<string, string>,
  relatedItems: { family: RouteFamily; params: Record<string, string>; label: string }[],
): InternalLink[] {
  return relatedItems
    .filter((item) => !(item.family === currentFamily && JSON.stringify(item.params) === JSON.stringify(currentParams)))
    .map((item) => buildRelativeLink(item.family, item.params, item.label))
}

/** Build "prev/next" navigation for sequential content (T553). */
export function buildPrevNextLinks(
  currentUrl: string,
  allUrls: string[],
  labels: string[],
): { prev?: InternalLink; next?: InternalLink } {
  const idx = allUrls.indexOf(currentUrl)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? { href: allUrls[idx - 1], label: labels[idx - 1] || 'Previous', family: 'question', params: {} } : undefined,
    next: idx < allUrls.length - 1 ? { href: allUrls[idx + 1], label: labels[idx + 1] || 'Next', family: 'question', params: {} } : undefined,
  }
}

/** Validate that a link target exists in the route registry (T552). */
export function validateLinkTarget(href: string): { valid: boolean; reason: string } {
  const origin = getCanonicalOrigin()
  let path = href
  if (path.startsWith(origin)) {
    path = path.replace(origin, '')
  }
  if (!path.startsWith('/')) path = '/' + path

  // Check against registry
  for (const [, contract] of Object.entries(ROUTE_REGISTRY)) {
    if (contract.visibility !== 'public') continue
    if (pathMatchesContract(path, contract.pathTemplate)) {
      return { valid: true, reason: 'Matches public route' }
    }
  }

  // External links are valid
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { valid: true, reason: 'External link' }
  }

  // Anchor links
  if (href.startsWith('#')) {
    return { valid: true, reason: 'Anchor link' }
  }

  return { valid: false, reason: `No matching route for ${path}` }
}

function pathMatchesContract(path: string, template: string): boolean {
  const pSegs = path.split('/').filter(Boolean)
  const tSegs = template.split('/').filter(Boolean)
  if (pSegs.length !== tSegs.length) return false
  for (let i = 0; i < tSegs.length; i++) {
    if (tSegs[i].startsWith(':')) continue
    if (tSegs[i] !== pSegs[i]) return false
  }
  return true
}

/** Audit internal links (T581–T589). */
export interface InternalLinkAuditResult {
  total: number
  valid: number
  broken: number
  nonCanonical: number
  issues: { href: string; problem: string }[]
}

export function auditInternalLinks(links: { href: string; label: string }[]): InternalLinkAuditResult {
  const issues: { href: string; problem: string }[] = []
  let valid = 0
  let broken = 0
  let nonCanonical = 0
  const origin = getCanonicalOrigin()

  for (const link of links) {
    const v = validateLinkTarget(link.href)
    if (!v.valid) {
      broken++
      issues.push({ href: link.href, problem: v.reason })
      continue
    }

    // Check if link uses canonical URL (not a non-canonical variant)
    if (link.href.startsWith('http://') || (link.href.startsWith('https://') && !link.href.startsWith(origin))) {
      // External link — OK
      valid++
    } else if (link.href.startsWith('/') || link.href.startsWith(origin)) {
      // Internal — check it doesn't have trailing slash, uppercase, etc.
      const path = link.href.replace(origin, '').toLowerCase()
      if (path.length > 1 && path.endsWith('/')) {
        nonCanonical++
        issues.push({ href: link.href, problem: 'Has trailing slash (non-canonical)' })
      } else if (link.href !== link.href.toLowerCase() && !link.href.startsWith('http')) {
        nonCanonical++
        issues.push({ href: link.href, problem: 'Has uppercase (non-canonical)' })
      } else {
        valid++
      }
    }
  }

  return { total: links.length, valid, broken, nonCanonical, issues }
}

/** Generate a link equity map (T553).
 * Which pages should link to which to distribute link equity. */
export function getLinkEquityMap(): Record<string, string[]> {
  return {
    homepage: ['domain', 'pillar', 'dsa-hub', 'static-info'],
    domain: ['module', 'stack', 'question', 'pillar'],
    pillar: ['module', 'domain'],
    module: ['question', 'module', 'domain'],
    dsaHub: ['dsaCategory', 'dsaPattern', 'dsaSheet', 'dsaCompany', 'dsaModule'],
    dsaCategory: ['dsaProblem', 'dsaPattern'],
    dsaPattern: ['dsaProblem'],
    dsaSheet: ['dsaProblem'],
  }
}
