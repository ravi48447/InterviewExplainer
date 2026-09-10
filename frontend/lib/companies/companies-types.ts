/**
 * Phase 12 — Companies, Compare & Tools: canonical company types.
 *
 * Hoists the inline FAANG/Unicorn/India/Finance company catalog and the
 * per-company interview guide metadata (COMPANY_META) out of the route
 * files into a typed, importable data layer.
 */
import type { ComponentType } from "react"

/** A featured company card on the /companies hub. */
export interface CompanyCardData {
  slug: string
  name: string
  desc: string
  rounds: string
  dsaFocus: string
  sdFocus: string
  behavioralFocus?: string
  topPatterns: string[]
  timeline?: string
  gradient: string
}

/** A named tier/grouping of companies on the hub (FAANG, Unicorns, …). */
export interface CompanyTier {
  key: string
  label: string
  /** Rendered icon component for the tier header. */
  iconKey: string
  /** Tailwind text color class for the header icon. */
  color: string
  blurb: string
  companies: CompanyCardData[]
}

/** A single interview round in a company guide. */
export interface CompanyRound {
  name: string
  desc: string
}

/** Per-company interview guide metadata (the COMPANY_META shape). */
export interface CompanyGuideMeta {
  name: string
  desc: string
  dsaPatterns: string[]
  keyTopics: string[]
  langFocus: string[]
  rounds: CompanyRound[]
}

/** A company guide page payload. */
export interface CompanyGuidePageData {
  slug: string
  name: string
  meta: CompanyGuideMeta | null
}

/** A company × type sub-page payload (/companies/:company/:type). */
export interface CompanyTypePageData {
  company: string
  companyName: string
  type: string
  label: string
  desc: string | null
  iconKey: string
  siblingTypes: string[]
  typeLabel: (slug: string) => string
  content: Record<string, unknown> | null
}

/** Lookup type for the TYPE_META map used by the [type] route. */
export interface CompanyTypeMeta {
  label: string
  iconKey: string
  desc: string
}

/** Re-exported icon-key → component map type (filled in data layer). */
export type IconMap = Record<string, ComponentType<{ className?: string }>>
