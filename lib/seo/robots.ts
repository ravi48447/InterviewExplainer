/**
 * lib/seo/robots.ts — robots.txt Architecture (P02-T144–T159)
 *
 * Rebuilds app/robots.ts from the route registry + indexability engine
 * instead of hardcoded paths. robots.txt is a SYSTEM output, not a
 * hand-maintained file.
 *
 * - T145: single authoritative robots.txt
 * - T146: sitemap reference
 * - T147: crawl-delay for non-production
 * - T148: disallow private routes from registry
 * - T149: allow public routes
 * - T150–T152: bot-specific rules
 * - T153–T155: host directive
 * - T156–T159: validation
 */

import { getCanonicalOrigin, getSeoEnvironment, isIndexableEnvironment, SITE_CONFIG } from './config'
import { getPublicRoutes, getPrivateRoutes, getInternalRoutes } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'

/** Build the robots.txt body from the registry (T145). */
export function buildRobotsTxt(): string {
  const origin = getCanonicalOrigin()
  const env = getSeoEnvironment()

  const lines: string[] = []
  lines.push('# robots.txt — generated from lib/seo/route-registry (P02-T145)')
  lines.push('# Do not edit manually; modify route-registry.ts instead.')
  lines.push('')

  if (!isIndexableEnvironment()) {
    // T147: non-production — disallow all
    lines.push('User-agent: *')
    lines.push('Disallow: /')
    lines.push('')
    lines.push(`# Non-production environment (${env}) — crawling disabled (P02-T147)`)
    lines.push('')
    // Still reference sitemap for structural validation
    lines.push(`# Sitemap: ${origin}/sitemap.xml`)
    lines.push('')
    return lines.join('\n')
  }

  // T150: General rules for all bots
  lines.push('User-agent: *')

  // T148: disallow private routes from registry
  const privateRoutes = getPrivateRoutes()
  const internalRoutes = getInternalRoutes()
  const disallowed = new Set<string>()
  for (const r of privateRoutes) {
    disallowed.add(r.pathTemplate)
  }
  for (const r of internalRoutes) {
    disallowed.add(r.pathTemplate)
  }
  // Common non-content paths
  disallowed.add('/api/*')
  disallowed.add('/_next/*')
  disallowed.add('/static/*')
  disallowed.add('/dev/*')
  disallowed.add('/dashboard/*')
  disallowed.add('/account/*')
  disallowed.add('/profile/*')
  disallowed.add('/admin/*')
  disallowed.add('/mock-interviews/start')
  disallowed.add('/mock-interviews/audio')
  disallowed.add('/mock-interviews/results')
  disallowed.add('/mock-interviews/history')
  disallowed.add('/login')
  disallowed.add('/signup')
  disallowed.add('/forgot-password')
  disallowed.add('/reset-password')

  const sortedDisallow = Array.from(disallowed).sort()
  for (const path of sortedDisallow) {
    lines.push(`Disallow: ${path}`)
  }

  // T149: allow public routes explicitly
  lines.push('')
  lines.push('# Public content routes — allowed (P02-T149)')
  const publicRoutes = getPublicRoutes()
  for (const r of publicRoutes) {
    if (r.pathTemplate !== '/') {
      lines.push(`Allow: ${r.pathTemplate}`)
    }
  }
  lines.push('Allow: /')

  // T152: bot-specific rules
  lines.push('')
  lines.push('# Bot-specific rules (P02-T152)')
  lines.push('User-agent: GPTBot')
  lines.push('Allow: /')
  lines.push('Disallow: /mock-interviews/')
  lines.push('')
  lines.push('User-agent: Google-Extended')
  lines.push('Allow: /')
  lines.push('Disallow: /mock-interviews/')
  lines.push('')

  // T153–T155: host directive (canonical host)
  lines.push(`Host: ${new URL(origin).host}`)

  // T146: sitemap reference
  lines.push('')
  lines.push('# Sitemap references (P02-T146)')
  lines.push(`Sitemap: ${origin}/sitemap.xml`)
  // If we have a sitemap index, reference it too
  lines.push(`Sitemap: ${origin}/sitemap-index.xml`)

  lines.push('')
  return lines.join('\n')
}

/** Build the Next.js MetadataRoute.Robots object (T145). */
export function buildRobotsMetadata() {
  const origin = getCanonicalOrigin()
  const env = getSeoEnvironment()

  if (!isIndexableEnvironment()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${origin}/sitemap.xml`,
      host: new URL(origin).host,
    }
  }

  const privateRoutes = getPrivateRoutes()
  const disallow = [
    '/api/*',
    '/_next/*',
    '/static/*',
    '/dev/*',
    '/dashboard/*',
    '/account/*',
    '/profile/*',
    '/admin/*',
    '/mock-interviews/start',
    '/mock-interviews/audio',
    '/mock-interviews/results',
    '/mock-interviews/history',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    ...privateRoutes.map((r) => r.pathTemplate),
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: Array.from(new Set(disallow)).sort(),
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/mock-interviews/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/mock-interviews/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: new URL(origin).host,
  }
}

/** Validate robots.txt (T156–T159). */
export function validateRobotsTxt(): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const body = buildRobotsTxt()

  if (!body.includes('User-agent: *')) issues.push('Missing default User-agent')
  if (!body.includes('Sitemap:')) issues.push('Missing sitemap reference (T146)')
  if (!body.includes('Disallow: /api/')) issues.push('API routes not disallowed')
  if (!body.includes('Disallow: /dashboard/')) issues.push('Dashboard not disallowed')

  // Check no public route is accidentally disallowed
  const publicRoutes = getPublicRoutes()
  for (const r of publicRoutes) {
    if (r.pathTemplate === '/') continue
    const pattern = r.pathTemplate.replace(/:[^/]+/g, '*')
    if (body.includes(`Disallow: ${pattern}`) && !body.includes(`Allow: ${r.pathTemplate}`)) {
      issues.push(`Public route ${r.pathTemplate} may be disallowed`)
    }
  }

  return { valid: issues.length === 0, issues }
}
