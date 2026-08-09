/**
 * lib/seo/config.ts — Canonical SEO Configuration Source (P02-T005, T011–T020)
 *
 * ONE source of truth for production origin, site name, default metadata,
 * social identity, and indexing defaults. Every other module imports from
 * here; no other file may hardcode the production origin (T012).
 *
 * Environment safety (T006, T018, T019):
 * - In non-production environments, canonical URLs are still *generated* as
 *   production-shaped (so metadata renders correctly), but a flag is exposed
 *   so robots/sitemap can suppress indexing. Localhost/preview domains never
 *   become canonical (T018/T019).
 */

export type SeoEnvironment = 'production' | 'preview' | 'staging' | 'development'

/** Canonical production origin — the ONE definition (T011). */
export const PRODUCTION_ORIGIN = 'https://interviewexplainer.com'

/** Resolve the active environment from Next.js runtime (T006). */
export function getSeoEnvironment(): SeoEnvironment {
  const nodeEnv = process.env.NODE_ENV
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv === 'production') return 'production'
  if (vercelEnv === 'preview') return 'preview'
  if (nodeEnv === 'production' && !vercelEnv) return 'production'
  if (nodeEnv === 'development') return 'development'
  return 'development'
}

/**
 * The canonical origin used for URL building.
 * Always production-shaped (T014 — HTTPS, T013 — non-www, T015 — no trailing
 * slash on origin, T017 — no port). In dev the env var may override for
 * local testing but canonical URLs in metadata remain production-shaped.
 */
export function getCanonicalOrigin(): string {
  // In development, allow a local override for testing, but canonical
  // metadata URLs must never be localhost (T018).
  if (getSeoEnvironment() === 'development') {
    const local = process.env.NEXT_PUBLIC_SITE_URL
    if (local && !local.includes('localhost') && !local.includes('127.0.0.1')) {
      return normalizeOrigin(local)
    }
  }
  return PRODUCTION_ORIGIN
}

/** Normalize an origin string: HTTPS, no www, no trailing slash, no port (T013–T017). */
export function normalizeOrigin(input: string): string {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    return PRODUCTION_ORIGIN
  }
  // Enforce HTTPS (T014)
  url.protocol = 'https:'
  // Strip www (T013)
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4)
  }
  // Strip default ports (T017)
  if (url.port === '443' || url.port === '80') {
    url.port = ''
  }
  // No trailing slash on origin (T015)
  let result = url.protocol + '//' + url.hostname
  if (url.port) result += ':' + url.port
  return result
}

/** Whether the current environment should emit indexable metadata (T006). */
export function isIndexableEnvironment(): boolean {
  return getSeoEnvironment() === 'production'
}

/** Whether to emit sitemaps at all (T006). */
export function shouldEmitSitemaps(): boolean {
  // Sitemaps are generated at build time; only production builds emit them.
  return getSeoEnvironment() === 'production'
}

/** Site identity (T005). */
export const SITE_CONFIG = {
  name: 'InterviewExplainer',
  shortName: 'InterviewExplainer',
  url: PRODUCTION_ORIGIN,
  locale: 'en_US',
  language: 'en',
  description:
    'Browse real interview questions and structured answers for Java, System Design, SQL, and more. Free to read. Sign up to track your progress.',
  tagline: 'Structured Interview Preparation for Developers',
  twitter: '@InterviewExplainer',
  // Social/OG identity (T005)
  social: {
    twitter: 'https://twitter.com/InterviewExplainer',
    github: 'https://github.com/ravi48447/InterviewExplainer',
  },
  ogImage: {
    path: '/og-default.png',
    width: 1200,
    height: 630,
    alt: 'InterviewExplainer',
  },
} as const

/** Default indexing policy (T005). Routes inherit this unless overridden. */
export const DEFAULT_INDEXABILITY = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
} as const

/** Routes that are never public/indexable (T039–T042). */
export const PRIVATE_ROUTE_PREFIXES = [
  '/dashboard',
  '/account',
  '/profile',
  '/admin',
  '/api',
  '/mock-interviews/start',
  '/mock-interviews/audio',
  '/mock-interviews/results',
  '/mock-interviews/history',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/dev',
] as const

/** Static informational routes (T038). */
export const STATIC_INFO_ROUTES = [
  '/about',
  '/support',
  '/privacy',
  '/terms',
  '/cookies',
] as const

/**
 * SEO failure philosophy (T007):
 * In development, invalid slug/URL generation throws. In production it
 * falls back to a safe default + logs. This prevents silently shipping
 * invalid canonical URLs.
 */
export function seoFail(message: string, context?: Record<string, unknown>): void {
  if (getSeoEnvironment() === 'development') {
    throw new Error(`[SEO] ${message}${context ? ' ' + JSON.stringify(context) : ''}`)
  }
  // Production: log, don't crash the render
  console.warn(`[SEO] ${message}`, context ?? '')
}

/** Naming convention (T009): all SEO helpers are prefixed `seo` or live in lib/seo/. */
