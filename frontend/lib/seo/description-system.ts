/**
 * lib/seo/description-system.ts — Meta Description Architecture (P02-T250–T289)
 *
 * Centralized meta description generation. Descriptions must be unique
 * per URL, within length limits (120–155 chars), and compelling (CTA).
 *
 * - T251: description templates per route family
 * - T252: length validation (120–155 ideal, 160 max)
 * - T253–T260: keyword inclusion
 * - T261–T270: uniqueness enforcement
 * - T271–T280: CTA / action verbs
 * - T281–T289: description audit
 */

import { SITE_CONFIG } from './config'
import { type RouteFamily } from './route-registry'

/** Description constraints (T252). */
export const DESCRIPTION_LIMITS = {
  idealMin: 120,
  idealMax: 155,
  hardMax: 160,
  hardMin: 70,
} as const

/** Description template per route family (T251). */
const DESCRIPTION_TEMPLATES: Partial<Record<RouteFamily, (entity: string, detail?: string) => string>> = {
  homepage: () => SITE_CONFIG.description,
  domain: (entity, detail) =>
    `Comprehensive ${entity} interview prep with questions, answers, and study guides. ${detail || 'Master key concepts and crack your interview.'}`,
  stack: (entity, detail) =>
    `${entity} interview questions and answers${detail ? ` covering ${detail}` : ''}. Practice with real questions and detailed explanations.`,
  pillar: (entity, detail) =>
    `${entity} interview preparation guide${detail ? `: ${detail}` : ''}. Learn concepts, practice problems, and ace your interview.`,
  module: (entity, detail) =>
    `Learn ${entity}${detail ? ` — ${detail}` : ''} for interview success. Detailed explanations, examples, and practice questions.`,
  question: (entity, detail) =>
    `${entity} interview question${detail ? `: ${detail}` : ''} with detailed explanation. Understand the concept and answer confidently.`,
  topic: (entity) =>
    `${entity} interview questions and answers with explanations. Prepare thoroughly and boost your confidence.`,
  company: (entity, detail) =>
    `${entity} interview process${detail ? `: ${detail}` : ''}. Real questions, tips, and strategies to help you succeed.`,
  comparison: (entity) =>
    `${entity} — compare features, pros, and cons to make the right choice for your needs.`,
  tool: (entity, detail) =>
    `${entity} overview${detail ? `: ${detail}` : ''}. Learn how to use this tool effectively in your projects.`,
  roadmap: (entity) =>
    `${entity} learning roadmap. Step-by-step guide to master ${entity} from basics to advanced.`,
  cheatsheet: (entity, detail) =>
    `${entity} cheatsheet${detail ? `: ${detail}` : ''}. Quick reference for essential concepts and syntax.`,
  'dsa-hub': () =>
    'Data structures and algorithms hub. Practice problems, patterns, and sheets to master DSA for interviews.',
  'dsa-problem': (entity, detail) =>
    `${entity} DSA problem${detail ? `: ${detail}` : ''}. Solution approach, complexity analysis, and implementation.`,
  'dsa-category': (entity) =>
    `${entity} DSA category. Explore problems, patterns, and practice sheets for ${entity.toLowerCase()}.`,
  'dsa-pattern': (entity) =>
    `${entity} pattern guide. Learn when and how to apply this DSA pattern with examples.`,
  'dsa-sheet': (entity) =>
    `${entity} practice sheet. Curated DSA problems to prepare for interviews efficiently.`,
  'dsa-company': (entity) =>
    `${entity} DSA interview questions. Practice problems asked in ${entity} interviews.`,
  'dsa-module': (entity, detail) =>
    `${entity} DSA module${detail ? `: ${detail}` : ''}. Learn data structures and algorithms step by step.`,
  career: (entity) =>
    `${entity} career guide. Roles, skills, salary, and growth path in ${entity.toLowerCase()}.`,
  behavioral: (entity) =>
    `${entity} behavioral interview guide. STAR method examples and tips to answer confidently.`,
  'static-info': (_entity, detail) => detail || SITE_CONFIG.description,
}

/** Generate a description for a route (T251, T253). */
export function generateDescription(
  family: RouteFamily,
  entityName: string,
  detail?: string,
): string {
  const template = DESCRIPTION_TEMPLATES[family]
  if (!template) {
    return `${entityName}. ${SITE_CONFIG.description}`
  }
  let desc = template(entityName, detail)
  // Truncate to hard max (T252)
  if (desc.length > DESCRIPTION_LIMITS.hardMax) {
    desc = desc.slice(0, DESCRIPTION_LIMITS.hardMax - 1).trimEnd()
    const lastSpace = desc.lastIndexOf(' ')
    if (lastSpace > DESCRIPTION_LIMITS.hardMax * 0.6) {
      desc = desc.slice(0, lastSpace)
    }
    desc += '…'
  }
  return desc
}

/** Validate a description (T252, T261). */
export interface DescriptionValidation {
  valid: boolean
  length: number
  issues: string[]
}

export function validateDescription(description: string): DescriptionValidation {
  const issues: string[] = []
  const length = description.length

  if (length < DESCRIPTION_LIMITS.hardMin) {
    issues.push(`Description too short (${length} chars, min ${DESCRIPTION_LIMITS.hardMin})`)
  }
  if (length > DESCRIPTION_LIMITS.hardMax) {
    issues.push(`Description too long (${length} chars, max ${DESCRIPTION_LIMITS.hardMax})`)
  }

  // Check for placeholder text
  if (description.includes('lorem') || description.includes('TODO') || description.includes('placeholder')) {
    issues.push('Contains placeholder text')
  }

  return { valid: issues.length === 0, length, issues }
}

/** Enforce description uniqueness (T261–T270). */
const descRegistry = new Map<string, string>()

export function registerDescription(url: string, description: string): boolean {
  // Normalize for comparison (trim, collapse whitespace)
  const normalized = description.toLowerCase().replace(/\s+/g, ' ').trim()
  const existing = descRegistry.get(normalized)
  if (existing && existing !== url) {
    return false
  }
  descRegistry.set(normalized, url)
  return true
}

export function getDescriptionDuplicates(): { description: string; urls: string[] }[] {
  const descToUrls = new Map<string, string[]>()
  for (const [desc, url] of descRegistry) {
    const arr = descToUrls.get(desc) || []
    arr.push(url)
    descToUrls.set(desc, arr)
  }
  return Array.from(descToUrls.entries())
    .filter(([, urls]) => urls.length > 1)
    .map(([desc, urls]) => ({ description: desc, urls }))
}

export function clearDescriptionRegistry(): void {
  descRegistry.clear()
}

/** Audit descriptions (T281–T289). */
export interface DescriptionAuditResult {
  total: number
  valid: number
  tooShort: number
  tooLong: number
  duplicates: number
  placeholders: number
}

export function auditDescriptions(descriptions: { url: string; description: string }[]): DescriptionAuditResult {
  let valid = 0
  let tooShort = 0
  let tooLong = 0
  let duplicates = 0
  let placeholders = 0
  const seen = new Map<string, string[]>()

  for (const { url, description } of descriptions) {
    const v = validateDescription(description)
    if (v.valid) valid++
    if (v.length < DESCRIPTION_LIMITS.hardMin) tooShort++
    if (v.length > DESCRIPTION_LIMITS.hardMax) tooLong++
    if (v.issues.some((i) => i.includes('placeholder'))) placeholders++

    const normalized = description.toLowerCase().replace(/\s+/g, ' ').trim()
    const arr = seen.get(normalized) || []
    arr.push(url)
    seen.set(normalized, arr)
  }

  for (const [, urls] of seen) {
    if (urls.length > 1) duplicates++
  }

  return { total: descriptions.length, valid, tooShort, tooLong, duplicates, placeholders }
}
