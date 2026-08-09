/**
 * resume-seo.ts — SEO metadata for resume intelligence routes (P11-WA, T001..T040).
 *
 * Resume upload, analysis, and job-match routes are authenticated/private
 * (candidate PII), so they are noindex-follow. There is no public landing
 * page for resume content.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildResumeDashboardMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: {},
      title: "Resume intelligence",
      description:
        "Upload your resume, parse job descriptions, and get a skill-gap analysis with a personalized preparation plan.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildResumeAnalysisMetadata(resumeId: string): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: { resumeId },
      title: "Resume analysis",
      description: "Detailed analysis of your resume claims, skills, and experience.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildJobMatchMetadata(resumeId: string, jobId: string): Metadata {
  return {
    ...buildMetadata({
      family: "dashboard",
      params: { resumeId, jobId },
      title: "Job match & skill-gap report",
      description: "See how your resume maps to a target job's requirements and where the gaps are.",
    }),
    robots: { index: false, follow: true },
  };
}
