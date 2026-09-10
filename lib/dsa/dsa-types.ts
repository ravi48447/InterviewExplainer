/**
 * Phase 11 — DSA Practice Hub: canonical types.
 *
 * Re-exports the rich DSA content types from `lib/contentV2-types` so the
 * canonical `lib/dsa` surface is the single import the page architecture and
 * routes need, plus adds the thin page-shaping types (hero stats, explore
 * bars, hub nav) that the V2 DSA components consume.
 */
import type {
  DSAProblemIndex,
  DSAModule,
  DSAIndex,
  DSASheet,
  DSASheetGroup,
  Basic100Catalog,
  DSALearnPage,
  DSAProblem,
  DSACodeLang,
  DSAFrequency,
  DSAApproach,
  DSARevision,
  DSAInterviewerIntent,
  DSAMistakeDetailed,
  DSADiagram,
  DSAMermaidDiagram,
  DSADryRun,
  DSADryRunStep,
  DSALearnSection,
  DSALearnCallout,
  DSALearnCodeExample,
  Basic100Group,
  Basic100Problem,
  CompareEntry,
  TopicEntry,
} from "@/lib/contentV2-types"
import type { DSAPageContent } from "@/lib/dsaPageContent"

// Re-exported content types — the canonical DSA domain vocabulary.
export type {
  DSAProblemIndex,
  DSAModule,
  DSAIndex,
  DSASheet,
  DSASheetGroup,
  DSALearnPage,
  DSAProblem,
  DSACodeLang,
  DSAFrequency,
  DSAApproach,
  DSARevision,
  DSAInterviewerIntent,
  DSAMistakeDetailed,
  DSADiagram,
  DSAMermaidDiagram,
  DSADryRun,
  DSADryRunStep,
  DSALearnSection,
  DSALearnCallout,
  DSALearnCodeExample,
  Basic100Catalog,
  Basic100Group,
  Basic100Problem,
  CompareEntry,
  TopicEntry,
}

/** Slug + count tuple returned by `getDSAPatterns` / `getDSACompanies`. */
export interface DSASlugCount {
  slug: string
  count: number
}

/** Aggregated counts shown on the DSA hub hero. */
export interface DSAHubStats {
  totalProblems: number
  totalModules: number
  totalSheets: number
  totalCategories: number
  totalPatterns: number
  totalCompanies: number
}

/** A single hub-nav entry (the quick-jump strip on /dsa). */
export interface DSAHubNavItem {
  slug: string
  label: string
  href: string
  icon: "categories" | "modules" | "patterns" | "sheets" | "companies" | "basic100"
}

/** Hero stat card. */
export interface DSAStatCard {
  label: string
  value: number | string
  icon: "problems" | "modules" | "patterns" | "sheets" | "companies" | "categories"
}

/** Explore-bar entry — the horizontal quick-filter row under the hero. */
export interface DSAExploreItem {
  slug: string
  label: string
  href: string
  count: number
}

/** Editorial content (overview / study tips / pitfalls / faqs) for a listing page. */
export type DSAEditorialContent = DSAPageContent

/** Breadcrumb trail item. */
export interface DSABreadcrumbItem {
  label: string
  href?: string
}

/** Page-shaping payload for a DSA listing page (category / pattern / company). */
export interface DSAListingPageData {
  slug: string
  name: string
  title: string
  description: string
  breadcrumbs: DSABreadcrumbItem[]
  heroStats: DSAStatCard[]
  problems: DSAProblemIndex[]
  editorial: DSAEditorialContent
  explore: DSAExploreItem[]
}

/** Page-shaping payload for the DSA hub landing (/dsa). */
export interface DSAHubPageData {
  stats: DSAHubStats
  hubNav: DSAHubNavItem[]
  heroStats: DSAStatCard[]
  categories: DSAExploreItem[]
  patterns: DSAExploreItem[]
  companies: DSAExploreItem[]
  modules: DSAModule[]
  sheets: DSASheet[]
  featuredProblems: DSAProblemIndex[]
}

/** Page-shaping payload for a DSA module page. */
export interface DSAModulePageData {
  moduleSlug: string
  moduleName: string
  title: string
  description: string
  breadcrumbs: DSABreadcrumbItem[]
  heroStats: DSAStatCard[]
  problems: DSAProblemIndex[]
  editorial: DSAEditorialContent
  explore: DSAExploreItem[]
}

/** Page-shaping payload for a DSA sheet page. */
export interface DSASheetPageData {
  sheetSlug: string
  sheetName: string
  title: string
  description: string
  breadcrumbs: DSABreadcrumbItem[]
  heroStats: DSAStatCard[]
  groups: DSASheetGroup[]
  totalProblems: number
}

/** Page-shaping payload for a DSA problem page. */
export interface DSAProblemPageData {
  slug: string
  title: string
  description: string
  breadcrumbs: DSABreadcrumbItem[]
  problem: DSAProblem | null
}
