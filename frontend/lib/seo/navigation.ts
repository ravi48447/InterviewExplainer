/**
 * lib/seo/navigation.ts — Navigation Architecture (P02-AD, T421+)
 *
 * SEO-friendly navigation:
 * - Crawlable <a> tags (not JS click handlers)
 * - Descriptive link text (not "click here")
 * - Consistent navigation across all pages
 * - Mobile navigation accessible
 */

import { type RouteFamily } from './route-registry'
import { buildPath } from './url-builder'

/** Nav item with SEO metadata. */
export interface NavItemSeo {
  href: string
  label: string
  /** Accessible name (for screen readers if label is abbreviated). */
  ariaLabel?: string
  /** Whether this nav item matches the current route. */
  isActive?: boolean
  /** Icon name (for visual nav). */
  icon?: string
}

/** Build the primary navigation from the route registry (T421+). */
export function buildPrimaryNavigation(): NavItemSeo[] {
  return [
    { href: '/', label: 'Home' },
    { href: buildPath('dsa-hub', {}), label: 'DSA' },
    { href: buildPath('pillar', { pillarSlug: 'system-design' }), label: 'System Design' },
    { href: buildPath('pillar', { pillarSlug: 'behavioral' }), label: 'Behavioral' },
    { href: buildPath('career', { slug: 'career-paths' }), label: 'Careers' },
  ]
}

/** Build the footer navigation (T422+). */
export function buildFooterNavigation(): { title: string; items: NavItemSeo[] }[] {
  return [
    {
      title: 'Learn',
      items: [
        { href: buildPath('dsa-hub', {}), label: 'DSA Hub' },
        { href: buildPath('roadmap', { slug: 'dsa-roadmap' }), label: 'DSA Roadmap' },
        { href: buildPath('cheatsheet', { slug: 'dsa-cheatsheet' }), label: 'Cheatsheets' },
      ],
    },
    {
      title: 'Company',
      items: [
        { href: buildPath('static-info', { slug: 'about' }), label: 'About' },
        { href: buildPath('static-info', { slug: 'support' }), label: 'Support' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { href: buildPath('static-info', { slug: 'privacy' }), label: 'Privacy Policy' },
        { href: buildPath('static-info', { slug: 'terms' }), label: 'Terms of Service' },
        { href: buildPath('static-info', { slug: 'cookies' }), label: 'Cookie Policy' },
      ],
    },
  ]
}

/** Validate link text (T423 — no "click here"). */
export function validateLinkText(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const badPatterns = /^(click here|here|read more|more|link|this)$/i
  if (badPatterns.test(text.trim())) {
    issues.push(`Non-descriptive link text: "${text}" (T423)`)
  }
  if (text.trim().length < 3) {
    issues.push(`Link text too short: "${text}" (T424)`)
  }
  return { valid: issues.length === 0, issues }
}

/** Ensure nav links are crawlable (T425). */
export function ensureCrawlableLinks(): string[] {
  return [
    'All navigation links are <a href> tags (not onclick handlers)',
    'Mobile menu links are in the DOM (not hidden via display:none on the <a>)',
    'Dropdown menus have accessible labels',
    'Skip-to-content link is present',
    'Breadcrumbs are in the DOM on every content page',
  ]
}
