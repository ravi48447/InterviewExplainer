/**
 * Phase 12 — Companies: canonical SEO builders.
 *
 * Thin wrappers over `lib/seo`'s `buildMetadata` for the dynamic company
 * guide + company×type routes. The /companies hub has no registered
 * RouteFamily, so it builds a plain Metadata object (title/description/
 * canonical) directly — matching the established hub-page pattern.
 */
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { getCanonicalOrigin } from "@/lib/seo"
import type {
  CompanyGuidePageData,
  CompanyTypePageData,
} from "./companies-types"

const SITE_ORIGIN = getCanonicalOrigin()

/** Metadata for the /companies hub (no registered family). */
export function buildCompaniesHubMetadata(): Metadata {
  return {
    title:
      "Company Interview Prep — Amazon, Google, Microsoft, Meta & More | InterviewExplainer",
    description:
      "Company-specific interview preparation for FAANG, unicorns, and top tech. Interview process breakdown, DSA patterns, system design focus, behavioral frameworks, and compensation insights.",
    alternates: { canonical: `${SITE_ORIGIN}/companies` },
  }
}

/** Metadata for /companies/:company (company guide). */
export function buildCompanyGuideMetadata(data: CompanyGuidePageData): Metadata {
  const title = `${data.name} Interview Prep — DSA, System Design, Behavioral | InterviewExplainer`
  const description =
    data.meta?.desc ??
    `Complete ${data.name} interview preparation: coding rounds, system design, behavioral questions with interview strategies.`
  return buildMetadata({
    family: "company",
    params: { companySlug: data.slug },
    title,
    description,
  })
}

/** Metadata for /companies/:company/:type (company × type sub-page). */
export function buildCompanyTypeMetadata(data: CompanyTypePageData): Metadata {
  const title = `${data.companyName} ${data.label} — Interview Prep | InterviewExplainer`
  const description = data.desc
    ? `${data.companyName} ${data.label}: ${data.desc}. Complete prep guide with real questions, strategies, and what they actually test.`
    : `${data.companyName} ${data.label} interview preparation — patterns, questions, and strategy.`
  // No dedicated family for the /:company/:type leaf; canonical built directly.
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_ORIGIN}/companies/${data.company}/${data.type}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_ORIGIN}/companies/${data.company}/${data.type}`,
    },
  }
}
