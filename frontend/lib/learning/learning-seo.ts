/**
 * Phase 15 — Learning surfaces V2 SEO builders.
 *
 * Plain `Metadata` objects for the four static catalog hubs. These routes have
 * no registered `RouteFamily`, so we build `Metadata` directly (title /
 * description / alternates.canonical) using `getCanonicalOrigin()`.
 */

import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";

function canonical(path: string): string {
  return `${getCanonicalOrigin()}${path}`;
}

/* ── Roadmaps ── */

export function buildRoadmapsHubMetadata(): Metadata {
  return {
    title:
      "Interview Roadmaps & Study Plans — FAANG Prep, DSA Plans, Career Paths",
    description:
      "Structured study plans for tech interviews. 4-week sprints, 8-week deep dives, and 12-week comprehensive plans for Java, Python, JavaScript, and every track. Includes DSA study sheets, company-specific prep timelines, and milestone tracking.",
    alternates: { canonical: canonical("/roadmaps") },
  };
}

/* ── Cheatsheets ── */

export function buildCheatsheetsHubMetadata(): Metadata {
  return {
    title: "Interview Cheatsheets — Java, Python, SQL, System Design & More",
    description:
      "Quick reference cheatsheets for tech interviews. Java collections, Python data structures, SQL joins, system design patterns, Big-O complexity, Git commands, Docker, Kubernetes, and more. Print-friendly, interview-focused.",
    alternates: { canonical: canonical("/cheatsheets") },
  };
}

/* ── Behavioral ── */

export function buildBehavioralHubMetadata(): Metadata {
  return {
    title:
      "Behavioral Interview Prep — STAR Method, Question Bank & Company-Specific",
    description:
      "Master behavioral interviews with STAR method framework, 50+ categorized questions, Amazon Leadership Principles prep, and company-specific behavioral guides. Free and comprehensive.",
    alternates: { canonical: canonical("/behavioral") },
  };
}

/* ── Career ── */

export function buildCareerHubMetadata(): Metadata {
  return {
    title:
      "Career Guide for Software Engineers — Resume, Negotiation, Interview Process",
    description:
      "Complete career guide for software engineers. Resume optimization for ATS and recruiters, salary negotiation playbook, interview process breakdowns for FAANG, company tier rankings, and career transition strategies.",
    alternates: { canonical: canonical("/career") },
  };
}

/* ── Prep hub ── */

export function buildPrepHubMetadata(): Metadata {
  return {
    title:
      "Interview Prep Hub — System Design, Java, Python & Frontend | InterviewExplainer",
    description:
      "Choose a prep surface: system design & architecture (language-agnostic), Java backend, Python tracks, or frontend/fullstack. Then open topic hubs, SEO modules, or a full roadmap — 1200+ structured questions.",
    alternates: { canonical: canonical("/prep") },
    openGraph: {
      title: "Interview Prep Hub — System Design, Java, Python & Frontend",
      description:
        "Independent tracks and topic hubs. System design stands alone from Java; Python and React have their own entry points.",
      url: canonical("/prep"),
      type: "website",
      siteName: "InterviewExplainer",
    },
    robots: { index: true, follow: true },
  };
}
