/**
 * lib/seo/content-quality.ts — Duplicate Content & Thin Page Prevention
 * (P02-T620–T679)
 *
 * - T620–T649: Duplicate Content Prevention
 *   - T621: canonical to consolidate duplicates
 *   - T622: no indexable duplicate URLs
 *   - T623–T630: parameter handling
 *   - T631–T640: content fingerprinting
 *   - T641–T649: duplicate audit
 *
 * - T650–T679: Thin Page Prevention
 *   - T651: minimum content thresholds
 *   - T652–T660: word count per route family
 *   - T661–T670: content depth checks
 *   - T671–T79: thin page audit
 */

import { type RouteFamily } from './route-registry'

/** ============ DUPLICATE CONTENT (T620–T649) ============ */

/** Content fingerprint for duplicate detection (T631). */
export function contentFingerprint(text: string): string {
  // Simple hash-based fingerprint (normalize first)
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  // Simple hash
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash |= 0
  }
  return `fp_${Math.abs(hash)}`
}

/** Detect duplicate content by fingerprint (T631–T640). */
export function detectDuplicateContent(
  pages: { url: string; content: string }[],
): { fingerprint: string; urls: string[] }[] {
  const fpMap = new Map<string, string[]>()
  for (const page of pages) {
    const fp = contentFingerprint(page.content)
    const arr = fpMap.get(fp) || []
    arr.push(page.url)
    fpMap.set(fp, arr)
  }
  return Array.from(fpMap.entries())
    .filter(([, urls]) => urls.length > 1)
    .map(([fingerprint, urls]) => ({ fingerprint, urls }))
}

/** Parameter handling — which params should be canonicalized (T623–T630). */
export const CANONICAL_PARAMS = {
  // These params are removed from canonical URLs
  ignore: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source', 'gclid', 'fbclid', 'mc_cid', 'mc_eid'],
  // These params affect content and are kept in URLs (but pages may be noindex)
  keep: ['page', 'sort', 'filter'],
} as const

/** Check if a URL variant should be canonicalized away (T622). */
export function shouldCanonicalizeAway(url: string): boolean {
  const urlObj = (() => {
    try {
      return new URL(url)
    } catch {
      return null
    }
  })()
  if (!urlObj) return false
  const params = urlObj.searchParams
  // If all params are "ignore" params, canonicalize away
  let allIgnorable = true
  for (const [key] of params) {
    if (!CANONICAL_PARAMS.ignore.includes(key as typeof CANONICAL_PARAMS.ignore[number])) {
      allIgnorable = false
      break
    }
  }
  return allIgnorable && Array.from(params.keys()).length > 0
}

/** Audit duplicate content (T641–T649). */
export interface DuplicateContentAuditResult {
  total: number
  duplicates: number
  duplicateGroups: { fingerprint: string; urls: string[] }[]
}

export function auditDuplicateContent(pages: { url: string; content: string }[]): DuplicateContentAuditResult {
  const dupes = detectDuplicateContent(pages)
  return {
    total: pages.length,
    duplicates: dupes.reduce((sum, g) => sum + g.urls.length, 0),
    duplicateGroups: dupes,
  }
}

/** ============ THIN PAGE PREVENTION (T650–T679) ============ */

/** Minimum content thresholds per route family (T652). */
export const MIN_CONTENT_THRESHOLDS: Partial<Record<RouteFamily, { words: number; headings: number; paragraphs: number }>> = {
  homepage: { words: 300, headings: 2, paragraphs: 3 },
  domain: { words: 500, headings: 3, paragraphs: 5 },
  stack: { words: 400, headings: 3, paragraphs: 4 },
  pillar: { words: 800, headings: 4, paragraphs: 8 },
  module: { words: 600, headings: 4, paragraphs: 6 },
  question: { words: 300, headings: 2, paragraphs: 3 },
  topic: { words: 400, headings: 3, paragraphs: 4 },
  company: { words: 500, headings: 3, paragraphs: 5 },
  comparison: { words: 600, headings: 4, paragraphs: 6 },
  tool: { words: 400, headings: 3, paragraphs: 4 },
  roadmap: { words: 800, headings: 5, paragraphs: 8 },
  cheatsheet: { words: 500, headings: 4, paragraphs: 5 },
  'dsa-hub': { words: 400, headings: 3, paragraphs: 4 },
  'dsa-problem': { words: 400, headings: 3, paragraphs: 4 },
  'dsa-category': { words: 300, headings: 2, paragraphs: 3 },
  'dsa-pattern': { words: 500, headings: 3, paragraphs: 5 },
  'dsa-sheet': { words: 200, headings: 2, paragraphs: 2 },
  'dsa-company': { words: 300, headings: 2, paragraphs: 3 },
  'dsa-module': { words: 500, headings: 4, paragraphs: 5 },
  career: { words: 500, headings: 3, paragraphs: 5 },
  behavioral: { words: 400, headings: 3, paragraphs: 4 },
  'static-info': { words: 200, headings: 2, paragraphs: 2 },
}

/** Check if a page is thin (T651, T652). */
export interface ThinPageCheck {
  isThin: boolean
  wordCount: number
  headingCount: number
  paragraphCount: number
  issues: string[]
}

export function checkThinPage(
  family: RouteFamily,
  content: string,
): ThinPageCheck {
  const threshold = MIN_CONTENT_THRESHOLDS[family] || { words: 200, headings: 2, paragraphs: 2 }
  const issues: string[] = []

  // Count words (strip HTML tags roughly)
  const text = content.replace(/<[^>]+>/g, ' ')
  const wordCount = text.split(/\s+/).filter(Boolean).length

  // Count headings
  const headingCount = (content.match(/<h[1-6][^>]*>/gi) || []).length

  // Count paragraphs
  const paragraphCount = (content.match(/<p[^>]*>/gi) || []).length

  if (wordCount < threshold.words) {
    issues.push(`Word count ${wordCount} below minimum ${threshold.words} (T652)`)
  }
  if (headingCount < threshold.headings) {
    issues.push(`Heading count ${headingCount} below minimum ${threshold.headings} (T652)`)
  }
  if (paragraphCount < threshold.paragraphs) {
    issues.push(`Paragraph count ${paragraphCount} below minimum ${threshold.paragraphs} (T652)`)
  }

  return {
    isThin: issues.length > 0,
    wordCount,
    headingCount,
    paragraphCount,
    issues,
  }
}

/** Audit thin pages (T671–T679). */
export interface ThinPageAuditResult {
  total: number
  thin: number
  adequate: number
  pages: { url: string; family: RouteFamily; issues: string[] }[]
}

export function auditThinPages(
  pages: { url: string; family: RouteFamily; content: string }[],
): ThinPageAuditResult {
  const thinPages: { url: string; family: RouteFamily; issues: string[] }[] = []
  let adequate = 0

  for (const page of pages) {
    const check = checkThinPage(page.family, page.content)
    if (check.isThin) {
      thinPages.push({ url: page.url, family: page.family, issues: check.issues })
    } else {
      adequate++
    }
  }

  return {
    total: pages.length,
    thin: thinPages.length,
    adequate,
    pages: thinPages,
  }
}

/** Content depth check (T661–T670).
 * Ensure content has sufficient depth — not just word count, but
 * substance: code examples, explanations, multiple sections. */
export function checkContentDepth(
  family: RouteFamily,
  content: string,
): { sufficient: boolean; issues: string[] } {
  const issues: string[] = []
  const text = content.replace(/<[^>]+>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length

  // Check for code blocks (important for technical content)
  const codeBlocks = (content.match(/<pre[^>]*>/gi) || []).length
  const codeInline = (content.match(/<code[^>]*>/gi) || []).length

  // Check for lists (structured content)
  const lists = (content.match(/<[uo]l[^>]*>/gi) || []).length

  // Technical content should have code examples
  const technicalFamilies: RouteFamily[] = ['module', 'dsa-problem', 'dsa-pattern', 'dsa-module', 'cheatsheet', 'tool']
  if (technicalFamilies.includes(family) && codeBlocks === 0 && codeInline === 0) {
    issues.push('Technical content has no code examples (T665)')
  }

  // Long-form content should have lists
  if (words > 500 && lists === 0) {
    issues.push('Long-form content has no lists for scannability (T667)')
  }

  return {
    sufficient: issues.length === 0,
    issues,
  }
}
