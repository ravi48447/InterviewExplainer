/**
 * Phase 12 — Compare: canonical types.
 *
 * Hoists the inline COMPARISONS catalog and the ComparisonData (content/compare
 * JSON) shape out of `app/compare/**` into a typed, importable layer.
 */

/** A comparison card on the /compare hub (the COMPARISONS array entry). */
export interface ComparisonCardData {
  slug: string
  title: string
  tag: string
  search: string
  verdict: string
  left: string
  right: string
}

/** A "when to use" side in a comparison detail page. */
export interface ComparisonSide {
  name: string
  conditions: string[]
}

/** A row in the side-by-side comparison table. */
export interface ComparisonRow {
  aspect: string
  a: string
  b: string
}

/** The comparison detail payload (content/compare/<slug>.json). */
export interface ComparisonData {
  title: string
  slug: string
  subtitle?: string
  summary: string
  whenToUse?: { a: ComparisonSide; b: ComparisonSide }
  comparison?: ComparisonRow[]
  interviewTips?: string[]
  relatedComparisons?: string[]
  relatedTools?: string[]
}

/** A comparison detail page payload (data or null → "coming soon"). */
export interface ComparePageData {
  slug: string
  data: ComparisonData | null
}
