/**
 * opportunity-seo.ts — SEO metadata for job discovery & application routes
 * (P12-WA, T001..T040).
 *
 * Job discovery and the application pipeline are authenticated/personalized
 * routes, so they are noindex-follow. There is no public job board.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildOpportunitiesMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: {},
      title: "Job opportunities",
      description:
        "Discover relevant job opportunities matched to your career target, and track your applications.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildOpportunityDetailMetadata(opportunityId: string): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: { opportunityId },
      title: "Job opportunity",
      description: "View the role details, requirements, and match score.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildPipelineMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: {},
      title: "Application pipeline",
      description: "Track your job applications from saved through offer.",
    }),
    robots: { index: false, follow: true },
  };
}
