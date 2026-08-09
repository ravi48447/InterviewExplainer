/**
 * lib/seo/headings.ts — Heading Hierarchy Architecture (P02-AC, T421+)
 *
 * Ensures a logical, single H1 → H2 → H3 heading hierarchy on every page.
 * Heading structure is critical for both accessibility and SEO.
 *
 * - One H1 per page (the page title)
 * - H2s for major sections
 * - H3s for subsections
 * - No skipped levels (no H2 → H4)
 * - No heading used purely for styling
 */

import { type RouteFamily } from './route-registry'

/** Heading level. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** A heading in the document. */
export interface Heading {
  level: HeadingLevel
  text: string
  id?: string
}

/** Validate a heading hierarchy (T421+). */
export interface HeadingValidation {
  valid: boolean
  h1Count: number
  issues: string[]
}

export function validateHeadings(headings: Heading[]): HeadingValidation {
  const issues: string[] = []
  const h1s = headings.filter((h) => h.level === 1)

  // One H1 per page
  if (h1s.length === 0) {
    issues.push('No H1 found — every page needs exactly one H1 (T421)')
  }
  if (h1s.length > 1) {
    issues.push(`Multiple H1s found (${h1s.length}) — use exactly one H1 (T421)`)
  }

  // No skipped levels
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level
    const curr = headings[i].level
    if (curr > prev + 1 && curr !== 1) {
      issues.push(`Heading level skip: H${prev} → H${curr} (T422)`)
    }
  }

  // No empty headings
  for (const h of headings) {
    if (!h.text || h.text.trim().length === 0) {
      issues.push(`Empty H${h.level} found (T423)`)
    }
  }

  return {
    valid: issues.length === 0,
    h1Count: h1s.length,
    issues,
  }
}

/** Recommended heading structure per route family (T424). */
export function getRecommendedHeadings(family: RouteFamily): { level: HeadingLevel; text: string }[] {
  const structures: Partial<Record<RouteFamily, { level: HeadingLevel; text: string }[]>> = {
    homepage: [
      { level: 1, text: 'Master Interview Prep with InterviewExplainer' },
      { level: 2, text: 'Popular Topics' },
      { level: 2, text: 'DSA Practice' },
      { level: 2, text: 'Career Guides' },
    ],
    domain: [
      { level: 1, text: '{domain} Interview Prep' },
      { level: 2, text: 'Key Topics' },
      { level: 2, text: 'Study Modules' },
      { level: 2, text: 'Practice Questions' },
    ],
    module: [
      { level: 1, text: '{module}' },
      { level: 2, text: 'Overview' },
      { level: 2, text: 'Key Concepts' },
      { level: 2, text: 'Examples' },
      { level: 2, text: 'Practice Questions' },
    ],
    question: [
      { level: 1, text: '{question}' },
      { level: 2, text: 'Answer' },
      { level: 2, text: 'Explanation' },
      { level: 2, text: 'Related Questions' },
    ],
    'dsa-problem': [
      { level: 1, text: '{problem}' },
      { level: 2, text: 'Problem Statement' },
      { level: 2, text: 'Approach' },
      { level: 2, text: 'Solution' },
      { level: 2, text: 'Complexity Analysis' },
    ],
  }

  return structures[family] || [{ level: 1, text: '{title}' }]
}
