/**
 * interview-seo.ts — SEO metadata for mock interview routes (P10-WA, T001..T020).
 *
 * Mock interview setup/history are noindex (not content pages); the landing
 * page is indexable as a feature page.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildInterviewLandingMetadata(): Metadata {
  return buildMetadata({
    family: "question",
    params: {},
    title: "Mock Interviews",
    description:
      "Practice mock interviews with timed questions, self-review, and AI-powered feedback across technical, behavioral, and system-design formats.",
  });
}

export function buildInterviewSetupMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Start a mock interview",
      description: "Choose a domain and interview type to begin a practice session.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildInterviewHistoryMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Interview history",
      description: "Review your past mock interview sessions and scores.",
    }),
    robots: { index: false, follow: true },
  };
}
