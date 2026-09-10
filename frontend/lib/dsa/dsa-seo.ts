/**
 * Phase 11 — DSA Practice Hub: canonical SEO builders.
 *
 * Thin wrappers over `lib/seo`'s `buildMetadata` so the DSA routes build
 * metadata from the canonical RouteFamily contracts (dsa-hub, dsa-category,
 * dsa-pattern, dsa-sheet, dsa-company, dsa-module, dsa-problem) instead of
 * hand-rolling titles/canonicals inline.
 */
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import type {
  DSAHubPageData,
  DSAListingPageData,
  DSAModulePageData,
  DSASheetPageData,
  DSAProblemPageData,
} from "./dsa-types"

export function buildDSAHubMetadata(): Metadata {
  return buildMetadata({
    family: "dsa-hub",
    params: {},
    title: "DSA Interview Problems — Java & Python Solutions",
    description:
      "Curated DSA interview problems with multiple approaches, complexity analysis, and line-by-line walkthroughs in Java and Python. Browse by category, pattern, module, sheet, or company.",
  })
}

export function buildDSACategoryMetadata(data: DSAListingPageData): Metadata {
  return buildMetadata({
    family: "dsa-category",
    params: { category: data.slug },
    title: data.title,
    description: data.description,
  })
}

export function buildDSAPatternMetadata(data: DSAListingPageData): Metadata {
  return buildMetadata({
    family: "dsa-pattern",
    params: { slug: data.slug },
    title: data.title,
    description: data.description,
  })
}

export function buildDSACompanyMetadata(data: DSAListingPageData): Metadata {
  return buildMetadata({
    family: "dsa-company",
    params: { company: data.slug },
    title: data.title,
    description: data.description,
  })
}

export function buildDSAModuleMetadata(data: DSAModulePageData): Metadata {
  return buildMetadata({
    family: "dsa-module",
    params: { slug: data.moduleSlug },
    title: data.title,
    description: data.description,
  })
}

export function buildDSASheetMetadata(data: DSASheetPageData): Metadata {
  return buildMetadata({
    family: "dsa-sheet",
    params: { slug: data.sheetSlug },
    title: data.title,
    description: data.description,
  })
}

export function buildDSAProblemMetadata(data: DSAProblemPageData): Metadata {
  return buildMetadata({
    family: "dsa-problem",
    params: { slug: data.slug },
    title: data.title,
    description: data.description,
  })
}

export function buildBasic100Metadata(): Metadata {
  return buildMetadata({
    family: "dsa-sheet",
    params: { slug: "basic-100" },
    title: "Basic 100 — Easy DSA Problems for Beginners",
    description:
      "100 beginner-friendly DSA coding problems — reverse a string, find the max, FizzBuzz — with Java and Python solutions and walkthroughs. The on-ramp to DSA interview prep.",
  })
}

export function buildDSADifficultyMetadata(level: "easy" | "medium" | "hard"): Metadata {
  const title =
    level === "easy"
      ? "Easy DSA Problems — Java & Python Solutions"
      : level === "medium"
        ? "Medium DSA Problems — Java & Python Solutions"
        : "Hard DSA Problems — Java & Python Solutions"
  const description = `${level.charAt(0).toUpperCase() + level.slice(1)} DSA interview problems with multiple approaches, complexity analysis, and line-by-line walkthroughs.`
  return buildMetadata({
    family: "dsa-category",
    params: { category: level },
    title,
    description,
  })
}
