/**
 * community-seo.ts — SEO metadata for community knowledge & interview
 * intelligence routes (P13-WA, T001..T040).
 *
 * Public company-intelligence and reported-question pages are INDEXABLE
 * (user-generated content is a discovery surface). The contribution form and
 * moderation queue are noindex (authenticated).
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildCommunityLandingMetadata(): Metadata {
  return buildMetadata({
    family: "company",
    params: {},
    title: "Real interview intelligence",
    description:
      "Community-reported interview questions, experiences, and company intelligence backed by evidence.",
  });
}

export function buildCompanyIntelligenceMetadata(company: string): Metadata {
  const name = decodeURIComponent(company);
  return buildMetadata({
    family: "company",
    params: { company },
    title: `${name} interview questions & process`,
    description: `Real interview questions, difficulty, rounds, and offer rates for ${name}, reported by candidates.`,
  });
}

export function buildReportedQuestionMetadata(questionId: string): Metadata {
  return buildMetadata({
    family: "question",
    params: { questionId },
    title: "Reported interview question",
    description: "A community-reported real interview question with evidence and discussion.",
  });
}

export function buildContributionFormMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: {},
      title: "Share your interview experience",
      description: "Report an interview question or experience to help the community.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildModerationMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "internal",
      params: {},
      title: "Moderation queue",
      description: "Review and moderate community contributions.",
    }),
    robots: { index: false, follow: true },
  };
}
