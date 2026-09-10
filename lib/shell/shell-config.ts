/**
 * lib/shell/shell-config.ts — Shell variant + slot configuration (P03-T001..T010)
 *
 * Pure helpers for deciding which shell variant a route uses and what width
 * tier it should adopt. No React here — this is the shared decision logic the
 * shell components and route-family layouts import.
 *
 * Kept server-compatible (no `window`, no hooks) so it can run in RSC.
 */

import { classifyRoute, type RouteFamily } from '@/lib/seo/route-registry'

/** The four legitimate shell variants (P03-T007). */
export type ShellVariant = 'public' | 'auth' | 'dashboard' | 'app'

/** Page width tiers, mapped to Phase 01 container tokens (P03-T133..T136). */
export type ContainerWidth = 'default' | 'wide' | 'reading' | 'full'

/** Route prefixes that opt into the authenticated (dashboard) shell. */
const DASHBOARD_PREFIXES = ['/dashboard', '/account', '/profile', '/admin'] as const

/** Route prefixes that opt into the auth shell. */
const AUTH_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
] as const

/**
 * Pick the shell variant for a pathname (P03-T002).
 *
 * Unknown paths fall back to the public shell so deep-linkable content stays
 * crawlable — a missing route is a 404, not a hidden shell.
 */
export function resolveShellVariant(pathname: string): ShellVariant {
  const lower = (pathname || '/').toLowerCase()

  if (AUTH_PREFIXES.some((p) => lower === p || lower.startsWith(p + '/'))) {
    return 'auth'
  }
  if (DASHBOARD_PREFIXES.some((p) => lower === p || lower.startsWith(p + '/'))) {
    return 'dashboard'
  }

  // Trust the SEO classifier for the rest. If it says `auth`/`dashboard` we
  // honor that; everything else (incl. unknown) is public.
  const family = classifyRoute(lower)
  if (family === 'auth') return 'auth'
  if (family === 'dashboard') return 'dashboard'

  return 'public'
}

/**
 * Whether a shell variant renders the global footer.
 * Auth + dashboard shells keep the footer off so the user is focused on the
 * task surface (P03-T352, T358).
 */
export function shellHasFooter(variant: ShellVariant): boolean {
  return variant === 'public'
}

/** Whether a shell variant renders the primary public navigation. */
export function shellHasPrimaryNav(variant: ShellVariant): boolean {
  return variant === 'public'
}

/**
 * Default width tier per route family (P03-T133..T136).
 * Routes can override via the slot prop; this is the documented default.
 */
export function defaultWidthForFamily(family: RouteFamily | null): ContainerWidth {
  if (!family) return 'default'
  switch (family) {
    case 'homepage':
    case 'dsa-hub':
    case 'pillar':
      return 'wide'
    case 'question':
    case 'dsa-problem':
      return 'reading'
    default:
      return 'default'
  }
}

/** Routes where a full-bleed (edge-to-edge) hero is legitimate. */
export function allowsFullBleed(family: RouteFamily | null): boolean {
  return family === 'homepage' || family === 'pillar' || family === 'dsa-hub'
}
