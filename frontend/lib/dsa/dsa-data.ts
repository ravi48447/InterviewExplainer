/**
 * Phase 11 — DSA Practice Hub: canonical data layer.
 *
 * Wraps `lib/contentV2` (the raw content reader) and `lib/dsaPageContent`
 * (the editorial section builders) into the page-shaping payloads the V2
 * DSA components consume. Pages and `generateMetadata` import from here
 * only — never from `contentV2` directly — so the DSA domain has a single
 * canonical surface that can be cached, audited, and swapped.
 */
import {
  getDSAIndex,
  getDSAByCategory,
  getDSAByCompany,
  getDSAByPattern,
  getDSACategories,
  getDSAPatterns,
  getDSACompanies,
  getDSAModules,
  getDSAModule,
  getDSAProblemsByModule,
  getDSAModuleProblemCounts,
  getDSASheet,
  listDSASheets,
  getDSAProblemBySlug,
  getBasic100,
} from "@/lib/contentV2"
import {
  buildCategoryContent,
  buildModuleContent,
  buildPatternContent,
  buildCompanyContent,
  type DSACounts,
} from "@/lib/dsaPageContent"
import type { DSAProblemIndex } from "@/lib/contentV2-types"
import type {
  DSAHubPageData,
  DSAHubStats,
  DSAHubNavItem,
  DSAStatCard,
  DSAExploreItem,
  DSAListingPageData,
  DSAModulePageData,
  DSASheetPageData,
  DSAProblemPageData,
  DSABreadcrumbItem,
  DSASlugCount,
} from "./dsa-types"

/** Title-case a kebab slug ("two-sum" → "Two Sum"). */
export function displaySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/** Derive {total, easy, medium, hard} counts from a problem list. */
export function deriveCounts(problems: DSAProblemIndex[]): DSACounts {
  return {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  }
}

const HUB_NAV: DSAHubNavItem[] = [
  { slug: "categories", label: "Categories", href: "/dsa#categories", icon: "categories" },
  { slug: "modules", label: "Modules", href: "/dsa#modules", icon: "modules" },
  { slug: "patterns", label: "Patterns", href: "/dsa#patterns", icon: "patterns" },
  { slug: "sheets", label: "Sheets", href: "/dsa#sheets", icon: "sheets" },
  { slug: "companies", label: "Companies", href: "/dsa#companies", icon: "companies" },
  { slug: "basic-100", label: "Basic 100", href: "/dsa/basic-100", icon: "basic100" },
]

function toExplore(slugCount: DSASlugCount[], hrefPrefix: string): DSAExploreItem[] {
  return slugCount.map((s) => ({
    slug: s.slug,
    label: displaySlug(s.slug),
    href: `${hrefPrefix}${s.slug}`,
    count: s.count,
  }))
}

/** Aggregate counts for the hub hero. */
export function loadDSAHubStats(): DSAHubStats {
  const index = getDSAIndex()
  const categories = getDSACategories()
  const patterns = getDSAPatterns()
  const companies = getDSACompanies()
  const sheets = listDSASheets()
  const modules = getDSAModules()
  return {
    totalProblems: index?.problems.length ?? 0,
    totalModules: modules.length,
    totalSheets: sheets.length,
    totalCategories: categories.length,
    totalPatterns: patterns.length,
    totalCompanies: companies.length,
  }
}

/** Full hub landing payload. */
export function loadDSAHub(): DSAHubPageData {
  const stats = loadDSAHubStats()
  const index = getDSAIndex()
  const modules = getDSAModules()
  const sheets = listDSASheets()
    .map((slug) => getDSASheet(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getDSASheet>>[]
  const categories: DSAExploreItem[] = getDSACategories().map((slug) => {
    const problems = getDSAByCategory(slug)
    return { slug, label: displaySlug(slug), href: `/dsa/${slug}`, count: problems.length }
  })
  const heroStats: DSAStatCard[] = [
    { label: "Problems", value: stats.totalProblems, icon: "problems" },
    { label: "Modules", value: stats.totalModules, icon: "modules" },
    { label: "Patterns", value: stats.totalPatterns, icon: "patterns" },
    { label: "Companies", value: stats.totalCompanies, icon: "companies" },
  ]
  return {
    stats,
    hubNav: HUB_NAV,
    heroStats,
    categories,
    patterns: toExplore(getDSAPatterns(), "/dsa/pattern/"),
    companies: toExplore(getDSACompanies(), "/dsa/company/"),
    modules,
    sheets,
    featuredProblems: (index?.problems ?? []).slice(0, 8),
  }
}

const listingHero = (count: number, secondary: number, secondaryLabel: "Modules" | "Patterns"): DSAStatCard[] => [
  { label: "Problems", value: count, icon: "problems" },
  { label: secondaryLabel, value: secondary, icon: secondaryLabel === "Modules" ? "modules" : "patterns" },
  { label: "Categories", value: getDSACategories().length, icon: "categories" },
]

/** Category listing page payload. */
export function loadDSACategory(slug: string): DSAListingPageData | null {
  const problems = getDSAByCategory(slug)
  if (problems.length === 0) return null
  const name = displaySlug(slug)
  const editorial = buildCategoryContent(name, slug, deriveCounts(problems))
  return {
    slug,
    name,
    title: `${name} — DSA Interview Problems`,
    description: `${problems.length} ${name.toLowerCase()} interview problems with multiple approaches, complexity analysis, and line-by-line walkthroughs.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: name },
    ],
    heroStats: listingHero(problems.length, getDSAModules().length, "Modules"),
    problems,
    editorial,
    explore: getDSACategories().map((c) => ({
      slug: c, label: displaySlug(c), href: `/dsa/${c}`, count: getDSAByCategory(c).length,
    })),
  }
}

/** Pattern listing page payload. */
export function loadDSAPattern(slug: string): DSAListingPageData | null {
  const problems = getDSAByPattern(slug)
  if (problems.length === 0) return null
  const name = displaySlug(slug)
  const editorial = buildPatternContent(name, deriveCounts(problems))
  return {
    slug,
    name,
    title: `${name} Pattern — DSA Interview Problems`,
    description: `${problems.length} ${name.toLowerCase()} pattern interview problems with multiple approaches, complexity analysis, and walkthroughs.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: "Patterns", href: "/dsa#patterns" },
      { label: name },
    ],
    heroStats: listingHero(problems.length, getDSAPatterns().length, "Patterns"),
    problems,
    editorial,
    explore: getDSAPatterns().map((p) => ({
      slug: p.slug, label: displaySlug(p.slug), href: `/dsa/pattern/${p.slug}`, count: p.count,
    })),
  }
}

const COMPANY_DISPLAY: Record<string, string> = {
  amazon: "Amazon", google: "Google", microsoft: "Microsoft", meta: "Meta",
  apple: "Apple", netflix: "Netflix", uber: "Uber", bloomberg: "Bloomberg",
  linkedin: "LinkedIn", salesforce: "Salesforce", adobe: "Adobe",
}

/** Resolve a company slug to its display name. */
export function companyDisplayName(slug: string): string {
  return COMPANY_DISPLAY[slug] ?? displaySlug(slug)
}

/** Company listing page payload. */
export function loadDSACompany(slug: string): DSAListingPageData | null {
  const problems = getDSAByCompany(slug)
  if (problems.length === 0) return null
  const name = companyDisplayName(slug)
  const editorial = buildCompanyContent(name, deriveCounts(problems))
  return {
    slug,
    name,
    title: `${name} DSA Interview Problems`,
    description: `${problems.length} DSA interview problems asked at ${name}, with approaches, complexity analysis, and walkthroughs.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: "Companies", href: "/dsa#companies" },
      { label: name },
    ],
    heroStats: listingHero(problems.length, getDSACompanies().length, "Patterns"),
    problems,
    editorial,
    explore: getDSACompanies().map((c) => ({
      slug: c.slug, label: companyDisplayName(c.slug), href: `/dsa/company/${c.slug}`, count: c.count,
    })),
  }
}

/** Module page payload. */
export function loadDSAModule(moduleSlug: string): DSAModulePageData | null {
  const mod = getDSAModule(moduleSlug)
  if (!mod) return null
  const problems = getDSAProblemsByModule(moduleSlug)
  const editorial = buildModuleContent(
    mod.title,
    mod.moduleSlug,
    deriveCounts(problems),
    mod.tagline,
  )
  const counts = getDSAModuleProblemCounts()
  return {
    moduleSlug,
    moduleName: mod.title,
    title: `${mod.title} — DSA Module`,
    description: mod.shortDescription ?? mod.tagline ?? `${problems.length} curated DSA problems in the ${mod.title} module.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: "Modules", href: "/dsa#modules" },
      { label: mod.title },
    ],
    heroStats: [
      { label: "Problems", value: problems.length, icon: "problems" },
      { label: "Modules", value: getDSAModules().length, icon: "modules" },
      { label: "Total in Module", value: counts[moduleSlug] ?? problems.length, icon: "categories" },
    ],
    problems,
    editorial,
    explore: getDSAModules().map((m) => ({
      slug: m.moduleSlug, label: m.title, href: `/dsa/module/${m.moduleSlug}`, count: counts[m.moduleSlug] ?? 0,
    })),
  }
}

/** Sheet page payload. */
export function loadDSASheet(sheetSlug: string): DSASheetPageData | null {
  const sheet = getDSASheet(sheetSlug)
  if (!sheet) return null
  const groups = sheet.groups ?? []
  const total = sheet.totalProblems || groups.reduce((sum, g) => sum + (g.problemSlugs?.length ?? 0), 0)
  return {
    sheetSlug,
    sheetName: sheet.title,
    title: `${sheet.title} — DSA Sheet`,
    description: sheet.description ?? `${total} curated DSA problems in the ${sheet.title} sheet.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: "Sheets", href: "/dsa#sheets" },
      { label: sheet.title },
    ],
    heroStats: [
      { label: "Problems", value: total, icon: "problems" },
      { label: "Groups", value: groups.length, icon: "categories" },
      { label: "Sheets", value: listDSASheets().length, icon: "sheets" },
    ],
    groups,
    totalProblems: total,
  }
}

/** Problem page payload. */
export function loadDSAProblem(slug: string): DSAProblemPageData | null {
  const problem = getDSAProblemBySlug(slug)
  const name = displaySlug(slug)
  return {
    slug,
    title: problem?.title ?? `${name} — DSA Problem`,
    description: problem?.seo?.metaDescription ?? `${name} DSA interview problem with approaches, complexity analysis, and walkthrough.`,
    breadcrumbs: [
      { label: "DSA", href: "/dsa" },
      { label: name },
    ],
    problem,
  }
}

/** Basic-100 catalog (used by /dsa/basic-100). */
export function loadBasic100() {
  return getBasic100()
}

/** Static-params helpers (route generation). */
export function listCategoryParams() {
  return getDSACategories().map((category) => ({ category }))
}
export function listPatternParams() {
  return getDSAPatterns().map((p) => ({ slug: p.slug }))
}
export function listCompanyParams() {
  return getDSACompanies().map((c) => ({ company: c.slug }))
}
export function listModuleParams() {
  return getDSAModules().map((m) => ({ slug: m.moduleSlug }))
}
export function listSheetParams() {
  return listDSASheets().map((slug) => ({ slug }))
}

/** Generic breadcrumb builder. */
export function dsaBreadcrumbs(...items: DSABreadcrumbItem[]): DSABreadcrumbItem[] {
  return [{ label: "Home", href: "/" }, ...items]
}
