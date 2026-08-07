/**
 * lib/seo/title-system.ts — Title Architecture (P02-T210–T249)
 *
 * Centralized title generation patterns. Titles are the #1 on-page SEO
 * factor — they must be: unique per URL, keyword-aligned, within length
 * limits, and consistently templated.
 *
 * - T211: title templates per route family
 * - T212: title length validation (50–60 chars ideal, 65 max)
 * - T213–T220: keyword placement (primary keyword first)
 * - T221–T230: uniqueness enforcement
 * - T231–T240: site name suffix consistency
 * - T241–T249: title audit
 */

import { SITE_CONFIG } from './config'
import { type RouteFamily } from './route-registry'

/** Title constraints (T212). */
export const TITLE_LIMITS = {
  idealMin: 50,
  idealMax: 60,
  hardMax: 65,
  hardMin: 30,
} as const

/** Title template per route family (T211). */
const TITLE_TEMPLATES: Partial<Record<RouteFamily, (entity: string, context?: string) => string>> = {
  homepage: () => SITE_CONFIG.name,
  domain: (entity) => `${entity} Interview Questions & Prep Guide`,
  stack: (entity, context) => `${entity} ${context ? `${context} ` : ''}Interview Questions`,
  pillar: (entity) => `${entity} Interview Prep: Complete Guide`,
  module: (entity, context) => `${entity}${context ? ` — ${context}` : ''} Interview Guide`,
  question: (entity, context) => `${entity}${context ? ` (${context})` : ''} Interview Q&A`,
  topic: (entity) => `${entity} Interview Questions & Answers`,
  company: (entity) => `${entity} Interview Questions & Process Guide`,
  comparison: (entity) => `${entity} — Which to Choose?`,
  tool: (entity) => `${entity} — Overview & Usage Guide`,
  roadmap: (entity) => `${entity} Learning Roadmap`,
  cheatsheet: (entity) => `${entity} Cheatsheet`,
  'dsa-hub': () => 'Data Structures & Algorithms Hub',
  'dsa-problem': (entity, context) => `${entity}${context ? ` — ${context}` : ''} (DSA Solution)`,
  'dsa-category': (entity) => `${entity} — DSA Category Guide`,
  'dsa-pattern': (entity) => `${entity} Pattern — DSA Guide`,
  'dsa-sheet': (entity) => `${entity} DSA Practice Sheet`,
  'dsa-company': (entity) => `${entity} DSA Interview Questions`,
  'dsa-module': (entity) => `${entity} — DSA Module`,
  career: (entity) => `${entity} Career Guide`,
  behavioral: (entity) => `${entity} — Behavioral Interview Guide`,
  'static-info': (entity) => entity,
}

/** Generate a title for a route (T211, T213). */
export function generateTitle(
  family: RouteFamily,
  entityName: string,
  context?: string,
): string {
  const template = TITLE_TEMPLATES[family]
  if (!template) {
    return `${entityName} | ${SITE_CONFIG.name}`
  }
  const titleBody = template(entityName, context)
  // Append site name if not homepage and not already included
  if (family === 'homepage' || family === 'static-info') {
    return titleBody
  }
  // Check length and truncate if needed (T212)
  const suffix = ` | ${SITE_CONFIG.name}`
  const maxBodyLen = TITLE_LIMITS.hardMax - suffix.length
  let body = titleBody
  if (body.length > maxBodyLen) {
    body = body.slice(0, maxBodyLen - 1).trimEnd()
    // Don't cut mid-word
    const lastSpace = body.lastIndexOf(' ')
    if (lastSpace > maxBodyLen * 0.5) {
      body = body.slice(0, lastSpace)
    }
  }
  return `${body}${suffix}`
}

/** Validate a title (T212, T221). */
export interface TitleValidation {
  valid: boolean
  length: number
  issues: string[]
  truncated: string
}

export function validateTitle(title: string): TitleValidation {
  const issues: string[] = []
  const length = title.length

  if (length < TITLE_LIMITS.hardMin) {
    issues.push(`Title too short (${length} chars, min ${TITLE_LIMITS.hardMin})`)
  }
  if (length > TITLE_LIMITS.hardMax) {
    issues.push(`Title too long (${length} chars, max ${TITLE_LIMITS.hardMax})`)
  }
  if (length >= TITLE_LIMITS.idealMin && length <= TITLE_LIMITS.idealMax) {
    // Ideal range
  } else if (length > TITLE_LIMITS.hardMax) {
    issues.push(`Outside ideal range (${TITLE_LIMITS.idealMin}-${TITLE_LIMITS.idealMax})`)
  }

  // Check for duplicate site name (T231)
  const siteNameCount = (title.match(new RegExp(SITE_CONFIG.name, 'g')) || []).length
  if (siteNameCount > 1) {
    issues.push('Site name appears more than once')
  }

  // Truncate to hard max
  let truncated = title
  if (title.length > TITLE_LIMITS.hardMax) {
    truncated = title.slice(0, TITLE_LIMITS.hardMax - 1).trimEnd()
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > TITLE_LIMITS.hardMax * 0.5) {
      truncated = truncated.slice(0, lastSpace)
    }
    truncated += '…'
  }

  return {
    valid: issues.length === 0,
    length,
    issues,
    truncated,
  }
}

/** Enforce title uniqueness across routes (T221–T230). */
const titleRegistry = new Map<string, string>()

export function registerTitle(url: string, title: string): boolean {
  const existing = titleRegistry.get(title)
  if (existing && existing !== url) {
    return false // duplicate title on different URL (T221)
  }
  titleRegistry.set(title, url)
  return true
}

export function getTitleDuplicates(): { title: string; urls: string[] }[] {
  const titleToUrls = new Map<string, string[]>()
  for (const [title, url] of titleRegistry) {
    const arr = titleToUrls.get(title) || []
    arr.push(url)
    titleToUrls.set(title, arr)
  }
  return Array.from(titleToUrls.entries())
    .filter(([_, urls]) => urls.length > 1)
    .map(([title, urls]) => ({ title, urls }))
}

export function clearTitleRegistry(): void {
  titleRegistry.clear()
}

/** Audit all titles (T241–T249). */
export interface TitleAuditResult {
  total: number
  valid: number
  tooShort: number
  tooLong: number
  duplicates: number
  missingSuffix: number
}

export function auditTitles(titles: { url: string; title: string; family: RouteFamily }[]): TitleAuditResult {
  let valid = 0
  let tooShort = 0
  let tooLong = 0
  let duplicates = 0
  let missingSuffix = 0
  const seen = new Map<string, string[]>()

  for (const { url, title, family } of titles) {
    const v = validateTitle(title)
    if (v.valid) valid++
    if (v.length < TITLE_LIMITS.hardMin) tooShort++
    if (v.length > TITLE_LIMITS.hardMax) tooLong++

    // Check suffix (T231)
    if (family !== 'homepage' && family !== 'static-info' && !title.includes(SITE_CONFIG.name)) {
      missingSuffix++
    }

    // Check duplicates (T221)
    const arr = seen.get(title) || []
    arr.push(url)
    seen.set(title, arr)
  }

  for (const [, urls] of seen) {
    if (urls.length > 1) duplicates++
  }

  return {
    total: titles.length,
    valid,
    tooShort,
    tooLong,
    duplicates,
    missingSuffix,
  }
}
