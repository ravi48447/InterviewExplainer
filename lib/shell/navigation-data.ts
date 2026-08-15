/**
 * lib/shell/navigation-data.ts — Canonical shell navigation data (P03-F,G,H,K)
 *
 * Builds the primary navigation, learn dropdown groups, mobile drawer
 * sections, and footer groups from:
 *  - Phase 02 SEO architecture (buildPath → canonical URLs)
 *  - launch-config (ENABLED_HUBS gating)
 *
 * Pure data — no React — so the header can render nav links as a server
 * component and only the interactive bits (mobile drawer, dropdown open
 * state, active-path) become client islands.
 *
 * Rules enforced here (Phase 03):
 *  - Links are real canonical URLs, not JS handlers (T064, T075).
 *  - No link targets a redirect (T063) — every href is a real route.
 *  - No decorative badges in primary nav (T069) — only the "Soon" tag on
 *    explicitly-launching hubs, kept minimal.
 *  - Curation: only major destinations in the top bar (T058), grouped
 *    discovery lives in the Learn dropdown (T080).
 */

import { buildPath } from '@/lib/seo/url-builder'
import type { RouteFamily } from '@/lib/seo/route-registry'
import { isHubEnabled, type HubKey } from '@/lib/launch-config'

/** A single navigation link with SEO + gating metadata. */
export interface ShellNavLink {
  href: string
  label: string
  /** Short description for dropdown/mobile renderings. */
  description?: string
  /** Lucide icon name (consumed by the client islands). */
  icon?: string
  /** Hub gate; undefined = always visible. */
  hub?: HubKey
  /** Small trailing label, e.g. "Soon" for launching hubs. */
  badge?: 'Soon'
  /** Route family for active-state classification. */
  family?: RouteFamily
}

/** A grouped section (used by the Learn dropdown + mobile drawer). */
export interface NavSection {
  title: string
  items: ShellNavLink[]
}

// ── Primary top-bar links (P03-T057, T058) ──────────────────────────────────
// Only major destinations. Grouped discovery lives in the Learn dropdown.

export function buildPrimaryNavLinks(): ShellNavLink[] {
  const links: ShellNavLink[] = []

  if (isHubEnabled('dsa')) {
    links.push({ href: '/dsa', label: 'Practice', icon: 'Code2' })
  }
  if (isHubEnabled('mockInterviews')) {
    links.push({ href: '/mock-interviews', label: 'Interview', icon: 'Mic' })
  }
  if (isHubEnabled('roadmaps')) {
    links.push({ href: '/roadmaps', label: 'Roadmaps', icon: 'Map' })
  }
  if (isHubEnabled('companies')) {
    links.push({ href: '/companies', label: 'Company Prep', icon: 'Building2' })
  }
  links.push({ href: '/pricing', label: 'Pricing', icon: 'Crown' })
  return links
}

// ── Learn dropdown groups (P03-T073, T074, T080) ────────────────────────────

export function buildLearnSections(): NavSection[] {
  const skills = ([
    { hub: 'prepCategories', href: '/prep', label: 'Prep by Topic', description: 'Every category & module SEO hub', icon: 'Compass' },
    { hub: 'systemDesign', href: '/system-design', label: 'System Design', description: 'Real problems & architecture', icon: 'Network' },
    { hub: 'dsa', href: '/dsa', label: 'DSA Problems', description: 'Problems by pattern', icon: 'Code2' },
    { hub: 'behavioral', href: '/behavioral', label: 'Behavioral', description: 'STAR method & company-specific', icon: 'Brain' },
    { hub: 'topics', href: '/topics', label: 'Topics & Concepts', description: 'Microservices, caching, security', icon: 'Layers' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const tools = ([
    { hub: 'tools', href: '/tools', label: 'Tools & Technologies', description: 'Docker, Kafka, Redis, AWS', icon: 'Wrench' },
    { hub: 'compare', href: '/compare', label: 'Compare X vs Y', description: 'Side-by-side comparisons', icon: 'ArrowLeftRight' },
    { hub: 'companies', href: '/companies', label: 'Company Prep', description: 'FAANG process & patterns', icon: 'Building2' },
    { hub: 'interviewByLang', href: '/interview', label: 'Browse by Language', description: 'Java, Python, Go & more', icon: 'Target' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const resources = ([
    { hub: 'roadmaps', href: '/roadmaps', label: 'Study Roadmaps', description: 'Prep schedules', icon: 'Map' },
    { hub: 'cheatsheets', href: '/cheatsheets', label: 'Cheatsheets', description: 'Quick reference for interviews', icon: 'Zap' },
    { hub: 'career', href: '/career', label: 'Career Guide', description: 'Resume, negotiation, process', icon: 'Briefcase' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const sections: NavSection[] = []
  if (skills.length) sections.push({ title: 'Interview Skills', items: skills })
  if (tools.length) sections.push({ title: 'Tools & Comparisons', items: tools })
  if (resources.length) sections.push({ title: 'Resources', items: resources })
  return sections
}

/** Whether the Learn dropdown should render at all (T071). */
export function hasLearnMenu(): boolean {
  return buildLearnSections().some((s) => s.items.length > 0)
}

// ── Mobile drawer sections (P03-T085, T086) ──────────────────────────────────

export function buildMobileSections(): NavSection[] {
  const quick = ([
    { hub: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { hub: 'mockInterviews', href: '/mock-interviews', label: 'Mock Interview', icon: 'Mic', badge: 'Soon' },
    { hub: 'search', href: '/search', label: 'Search Questions', icon: 'Search' },
    { href: '/pricing', label: 'Pricing', icon: 'Crown' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const content = ([
    { hub: 'prepCategories', href: '/prep', label: 'Prep by Topic', icon: 'Compass' },
    { hub: 'interviewQA', href: '/domains', label: 'All Interview Paths', icon: 'Compass' },
    { hub: 'interviewByLang', href: '/interview', label: 'Browse by Language', icon: 'BookOpen' },
    { hub: 'companies', href: '/companies', label: 'Company-Specific Prep', icon: 'Building2' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const deep = ([
    { hub: 'systemDesign', href: '/system-design', label: 'System Design', icon: 'Network' },
    { hub: 'dsa', href: '/dsa', label: 'DSA Problems', icon: 'Code2' },
    { hub: 'behavioral', href: '/behavioral', label: 'Behavioral Interview', icon: 'Brain' },
    { hub: 'topics', href: '/topics', label: 'Topics & Concepts', icon: 'Layers' },
    { hub: 'tools', href: '/tools', label: 'Tools & Technologies', icon: 'Wrench' },
    { hub: 'compare', href: '/compare', label: 'Compare X vs Y', icon: 'ArrowLeftRight' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const resources = ([
    { hub: 'roadmaps', href: '/roadmaps', label: 'Study Roadmaps', icon: 'Map' },
    { hub: 'cheatsheets', href: '/cheatsheets', label: 'Cheatsheets', icon: 'Zap' },
    { hub: 'career', href: '/career', label: 'Career Guide', icon: 'Briefcase' },
  ] satisfies ShellNavLink[]).filter((e) => (e.hub ? isHubEnabled(e.hub) : true))

  const sections: NavSection[] = []
  if (quick.length) sections.push({ title: 'Quick Access', items: quick })
  if (content.length) sections.push({ title: 'Interview Content', items: content })
  if (deep.length) sections.push({ title: 'Deep Dive', items: deep })
  if (resources.length) sections.push({ title: 'Resources', items: resources })
  return sections
}

// ── Footer groups (P03-T201..T206) ───────────────────────────────────────────

export interface FooterLink {
  href: string
  label: string
  hub?: HubKey
  badge?: 'Soon'
}

export interface FooterGroup {
  title: string
  items: FooterLink[]
}

export function buildFooterGroups(): FooterGroup[] {
  const platform = ([
    { href: '/domains', label: 'Browse Domains', hub: 'interviewQA' },
    { href: '/dashboard', label: 'Dashboard', hub: 'dashboard' },
    { href: '/mock-interviews', label: 'Mock Interviews', hub: 'mockInterviews', badge: 'Soon' },
    { href: '/search', label: 'Search Questions', hub: 'search' },
    { href: '/prep', label: 'Prep by Topic', hub: 'prepCategories' },
    { href: '/dsa', label: 'DSA Problems', hub: 'dsa' },
  ] satisfies FooterLink[]).filter((l) => (l.hub ? isHubEnabled(l.hub) : true))

  const company: FooterLink[] = [
    { href: '/about', label: 'About' },
    { href: '/support', label: 'Support' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const legal: FooterLink[] = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ]

  const groups: FooterGroup[] = []
  if (platform.length) groups.push({ title: 'Platform', items: platform })
  groups.push({ title: 'Company', items: company })
  groups.push({ title: 'Legal', items: legal })
  return groups
}

// ── Active-state classification (P03-T060, T087) ─────────────────────────────

/** Whether a nav href matches the current pathname (server-safe). */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === href
  if (pathname === href || pathname.startsWith(href + '/')) return true
  // Domain slugs (e.g. /java-backend-fresher) light up the /domains entry.
  if (href === '/domains' && /^\/[a-z]+-[a-z]+-/.test(pathname)) return true
  return false
}

/**
 * Resolve a canonical href for a nav item. For items that map to a known route
 * family, buildPath guarantees the canonical URL (T062, T063). For hardcoded
 * legacy routes (domains, prep, etc.) the href is already canonical.
 */
export function resolveNavHref(link: ShellNavLink | FooterLink): string {
  // Most shell nav items are already canonical paths. This helper exists as
  // the single hook future route-family phases use to re-route through the
  // SEO url-builder when a nav item gains a RouteFamily. FooterLink has no
  // family, so it always returns the static href.
  if ('family' in link && link.family) {
    try {
      // Only families with no params are safe to build from here.
      const path = buildPath(link.family, {})
      if (path && path !== '/') return path
    } catch {
      // fall through to the static href
    }
  }
  return link.href
}
