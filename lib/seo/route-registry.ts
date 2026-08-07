/**
 * lib/seo/route-registry.ts — Canonical Public Route Registry (P02-T021–T045)
 *
 * The authoritative registry of every public route family. All URL
 * generation, metadata, sitemaps, canonical tags, and structured data
 * resolve through this registry — no route may be public unless it is
 * registered here (T021, T043, T044).
 *
 * Type safety (T008, T043): each route family has a literal string
 * discriminator and a typed parameter set so URL builders are exhaustively
 * checked.
 */

import { PRIVATE_ROUTE_PREFIXES, STATIC_INFO_ROUTES } from './config'

// ── Route family discriminators (T008, T043) ─────────────────────────────────

export type RouteFamily =
  | 'homepage'
  | 'domain'
  | 'stack'
  | 'pillar'
  | 'module'
  | 'question'
  | 'topic'
  | 'company'
  | 'comparison'
  | 'tool'
  | 'roadmap'
  | 'cheatsheet'
  | 'dsa-hub'
  | 'dsa-problem'
  | 'dsa-category'
  | 'dsa-pattern'
  | 'dsa-sheet'
  | 'dsa-company'
  | 'dsa-module'
  | 'career'
  | 'behavioral'
  | 'static-info'
  | 'auth'
  | 'dashboard'
  | 'internal'
  | 'development'

/** Route visibility — only `public` routes get sitemaps/canonical (T021, T041). */
export type RouteVisibility = 'public' | 'private' | 'internal' | 'development'

/** Indexability classification (T118–T130). */
export type IndexabilityClass = 'index' | 'noindex' | 'noindex-follow'

// ── Route contract type (T022–T042) ──────────────────────────────────────────

export interface RouteContract<
  TFamily extends RouteFamily = RouteFamily,
  TParams extends Record<string, string> = Record<string, string>,
> {
  family: TFamily
  /** Path template with `:param` placeholders. */
  pathTemplate: string
  /** Named params the URL generator expects, in segment order. */
  params: (keyof TParams)[]
  visibility: RouteVisibility
  indexability: IndexabilityClass
  /** Sitemap priority 0–1 (only if public+index). */
  sitemapPriority?: number
  /** Sitemap change frequency. */
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  /** Whether this route is a dynamic-content route (needs entity resolution). */
  dynamic?: boolean
  /** Legacy path patterns that 301-redirect to this route (T088, T095–T104). */
  legacyRedirects?: string[]
}

// ── The canonical registry (T021) ────────────────────────────────────────────

export const ROUTE_REGISTRY = {
  homepage: {
    family: 'homepage',
    pathTemplate: '/',
    params: [],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 1.0,
    changeFrequency: 'weekly',
  },
  domain: {
    family: 'domain',
    pathTemplate: '/:domainSlug',
    params: ['domainSlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.85,
    changeFrequency: 'weekly',
    dynamic: true,
    legacyRedirects: ['/prep/:domainSlug'],
  },
  stack: {
    family: 'stack',
    pathTemplate: '/:domainSlug/:stackSlug',
    params: ['domainSlug', 'stackSlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.8,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  pillar: {
    family: 'pillar',
    pathTemplate: '/:pillarSlug',
    params: ['pillarSlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.95,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  module: {
    family: 'module',
    pathTemplate: '/:seoSlug',
    params: ['seoSlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.9,
    changeFrequency: 'weekly',
    dynamic: true,
    legacyRedirects: ['/prep/:domainSlug/:moduleSlug'],
  },
  question: {
    family: 'question',
    pathTemplate: '/:domainSlug/:stackSlug/:questionSlug',
    params: ['domainSlug', 'stackSlug', 'questionSlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  topic: {
    family: 'topic',
    pathTemplate: '/topics/:concept',
    params: ['concept'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.75,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  company: {
    family: 'company',
    pathTemplate: '/companies/:companySlug',
    params: ['companySlug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.75,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  comparison: {
    family: 'comparison',
    pathTemplate: '/compare/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  tool: {
    family: 'tool',
    pathTemplate: '/tools/:tool',
    params: ['tool'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  roadmap: {
    family: 'roadmap',
    pathTemplate: '/roadmaps/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  cheatsheet: {
    family: 'cheatsheet',
    pathTemplate: '/cheatsheets/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  'dsa-hub': {
    family: 'dsa-hub',
    pathTemplate: '/dsa',
    params: [],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.95,
    changeFrequency: 'weekly',
  },
  'dsa-problem': {
    family: 'dsa-problem',
    pathTemplate: '/dsa/problem/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  'dsa-category': {
    family: 'dsa-category',
    pathTemplate: '/dsa/:category',
    params: ['category'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.8,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  'dsa-pattern': {
    family: 'dsa-pattern',
    pathTemplate: '/dsa/pattern/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  'dsa-sheet': {
    family: 'dsa-sheet',
    pathTemplate: '/dsa/sheet/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
    dynamic: true,
  },
  'dsa-company': {
    family: 'dsa-company',
    pathTemplate: '/dsa/company/:company',
    params: ['company'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  'dsa-module': {
    family: 'dsa-module',
    pathTemplate: '/dsa/module/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.75,
    changeFrequency: 'weekly',
    dynamic: true,
  },
  career: {
    family: 'career',
    pathTemplate: '/career/:slug?',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
  },
  behavioral: {
    family: 'behavioral',
    pathTemplate: '/behavioral/:slug?',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.7,
    changeFrequency: 'monthly',
  },
  'static-info': {
    family: 'static-info',
    pathTemplate: '/:slug',
    params: ['slug'],
    visibility: 'public',
    indexability: 'index',
    sitemapPriority: 0.5,
    changeFrequency: 'yearly',
  },
  auth: {
    family: 'auth',
    pathTemplate: '/auth/:action',
    params: ['action'],
    visibility: 'private',
    indexability: 'noindex',
  },
  dashboard: {
    family: 'dashboard',
    pathTemplate: '/dashboard/:section?',
    params: ['section'],
    visibility: 'private',
    indexability: 'noindex',
  },
  internal: {
    family: 'internal',
    pathTemplate: '/internal/:path*',
    params: ['path'],
    visibility: 'internal',
    indexability: 'noindex',
  },
  development: {
    family: 'development',
    pathTemplate: '/dev/:path*',
    params: ['path'],
    visibility: 'development',
    indexability: 'noindex',
  },
} as const satisfies Record<RouteFamily, RouteContract>

export type RouteRegistryKey = keyof typeof ROUTE_REGISTRY

// ── Registry helpers (T043, T044, T045) ──────────────────────────────────────

/** Get a route contract by family. */
export function getRouteContract<T extends RouteFamily>(family: T): RouteContract<T> {
  const contract = ROUTE_REGISTRY[family]
  if (!contract) {
    throw new Error(`[SEO] Unknown route family: ${family}`)
  }
  return contract as unknown as RouteContract<T>
}

/** All public routes (T021). */
export function getPublicRoutes() {
  return Object.values(ROUTE_REGISTRY).filter((r) => r.visibility === 'public')
}

/** All private routes (T113). */
export function getPrivateRoutes() {
  return Object.values(ROUTE_REGISTRY).filter((r) => r.visibility === 'private')
}

/** All internal routes (T113). */
export function getInternalRoutes() {
  return Object.values(ROUTE_REGISTRY).filter((r) => r.visibility === 'internal' || r.visibility === 'development')
}

/** All indexable routes (for sitemap generation). */
export function getIndexableRoutes() {
  return getPublicRoutes().filter((r) => r.indexability === 'index')
}

/** Classify a pathname into a route family (T041, T042).
 * Returns the matching RouteFamily, or null if no public route matches. */
export function classifyRoute(pathname: string): RouteFamily | null {
  if (pathname === '/' || pathname === '') return 'homepage'
  const lower = pathname.toLowerCase()
  // Check private/internal/dev prefixes
  if (PRIVATE_ROUTE_PREFIXES.some((p) => lower === p || lower.startsWith(p + '/'))) {
    if (lower.startsWith('/dev')) return 'development'
    if (lower.startsWith('/api')) return 'internal'
    if (lower.startsWith('/dashboard')) return 'dashboard'
    if (lower.startsWith('/account') || lower.startsWith('/profile')) return 'dashboard'
    return 'auth'
  }
  // Try to match against public route families
  for (const contract of Object.values(ROUTE_REGISTRY)) {
    if (contract.visibility !== 'public') continue
    if (pathMatchesTemplate(lower, contract.pathTemplate)) {
      return contract.family
    }
  }
  return null
}

function pathMatchesTemplate(path: string, template: string): boolean {
  const pSegs = path.split('/').filter(Boolean)
  const tSegs = template.split('/').filter(Boolean)
  if (pSegs.length !== tSegs.length) return false
  for (let i = 0; i < tSegs.length; i++) {
    if (tSegs[i].startsWith(':')) continue
    if (tSegs[i] !== pSegs[i]) return false
  }
  return true
}

/** Whether a pathname is a static info route (T038). */
export function isStaticInfoRoute(pathname: string): boolean {
  return STATIC_INFO_ROUTES.includes(pathname as (typeof STATIC_INFO_ROUTES)[number])
}

/** Validate the registry — returns result object (T044). */
export function validateRegistry(): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  for (const [key, contract] of Object.entries(ROUTE_REGISTRY)) {
    const templateParams = (contract.pathTemplate.match(/:(\w+)/g) || []).map((m) => m.slice(1))
    const declaredParams = contract.params as readonly string[]
    for (const tp of templateParams) {
      if (!declaredParams.includes(tp)) {
        issues.push(`Route ${key}: template param ":${tp}" not declared in params`)
      }
    }
  }
  return { valid: issues.length === 0, issues }
}
