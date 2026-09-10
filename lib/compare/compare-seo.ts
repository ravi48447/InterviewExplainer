/**
 * Phase 12 — Compare: canonical SEO builders.
 *
 * /compare has no registered RouteFamily, so the hub builds a plain
 * Metadata object. /compare/:slug uses the `comparison` family via
 * `buildMetadata`.
 */
import type { Metadata } from "next"
import { buildMetadata, getCanonicalOrigin } from "@/lib/seo"
import type { ComparePageData } from "./compare-types"
import { formatCompareSlug } from "./compare-data"

const SITE_ORIGIN = getCanonicalOrigin()

/** Metadata for the /compare hub. */
export function buildCompareHubMetadata(): Metadata {
  return {
    title: "X vs Y — Tech Comparison Interview Answers | InterviewExplainer",
    description:
      "Kafka vs RabbitMQ, SQL vs NoSQL, Docker vs Kubernetes, React vs Vue — all the classic comparison questions with interview-framed answers and trade-off analysis.",
    alternates: { canonical: `${SITE_ORIGIN}/compare` },
  }
}

/** Metadata for /compare/:slug. */
export function buildCompareMetadata(data: ComparePageData): Metadata {
  const title =
    data.data?.title ??
    `${formatCompareSlug(data.slug)} — Interview Answer | InterviewExplainer`
  const description =
    data.data?.summary ??
    `When to use each, trade-offs, and exactly what to say in the interview. ${formatCompareSlug(data.slug)} explained for engineers.`
  return buildMetadata({
    family: "comparison",
    params: { slug: data.slug },
    title: `${title} | Interview Q&A | InterviewExplainer`,
    description,
  })
}
