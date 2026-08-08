/**
 * Phase 14 — Curriculum V2 canonical SEO.
 *
 * Metadata builders for the interview hierarchy. There are no registered
 * RouteFamilies for /interview/*, so each builder constructs a plain Metadata
 * object with a canonical URL derived from getCanonicalOrigin.
 */

import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";
import type { Level } from "@/lib/contentV2-types";
import type {
  LangHubData,
  LevelHubData,
  RolePageData,
  StackHubData,
  TrackHubData,
} from "./curriculum-types";
import { curriculumToTitle, LEVEL_META } from "./curriculum-data";

/** Metadata for the /interview all-languages hub. */
export function buildInterviewHubMetadata(): Metadata {
  const origin = getCanonicalOrigin();
  return {
    title: "Interview Questions — All Languages & Tracks",
    description:
      "Browse interview questions by language, track, and experience level. Java, Python, Go, Ruby — covering backend, frontend, fullstack, and more.",
    alternates: { canonical: `${origin}/interview` },
  };
}

/** Metadata for /interview/:lang. */
export function buildLangHubMetadata(data: LangHubData): Metadata {
  const origin = getCanonicalOrigin();
  const title = `${data.name} Interview Questions — All Tracks & Levels | InterviewExplainer`;
  const description = `Complete ${data.name} interview preparation: ${data.tracks.map((t) => t.name).join(", ")}. Beginner to advanced answers, DSA, system design, company prep.`;
  return {
    title,
    description,
    alternates: { canonical: `${origin}/interview/${data.lang}` },
    openGraph: { title, description, url: `${origin}/interview/${data.lang}` },
  };
}

/** Metadata for /interview/:lang/:track. */
export function buildTrackHubMetadata(data: TrackHubData): Metadata {
  const origin = getCanonicalOrigin();
  const { langTitle, trackTitle, lang, track } = data;
  const title = `${langTitle} ${trackTitle} Interview Questions — All Levels | InterviewExplainer`;
  const description = `${langTitle} ${trackTitle} interview questions for all experience levels (0–2, 2–5, 5+ years). Beginner to advanced — interview-framed answers with production examples.`;
  return {
    title,
    description,
    alternates: { canonical: `${origin}/interview/${lang}/${track}` },
    openGraph: { title, description, url: `${origin}/interview/${lang}/${track}` },
  };
}

/** Metadata for /interview/:lang/:track/:level. */
export function buildLevelHubMetadata(data: LevelHubData): Metadata {
  const origin = getCanonicalOrigin();
  const { lang, track, level, meta } = data;
  const title = `${curriculumToTitle(lang)} ${curriculumToTitle(track)} ${meta.label} Interview Questions`;
  const description = `${meta.label} level ${curriculumToTitle(lang)} ${curriculumToTitle(track)} interview preparation for ${meta.range} experience developers.`;
  const canonicalUrl = `${origin}/interview/${lang}/${track}/${level}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "InterviewExplainer" },
  };
}

/** Metadata for /interview/:lang/:track/:level/:stack. */
export function buildStackHubMetadata(data: StackHubData): Metadata {
  const origin = getCanonicalOrigin();
  const { lang, track, level, stack, stackName } = data;
  const title = `${stackName} Interview Questions - ${curriculumToTitle(lang)} ${curriculumToTitle(track)} ${LEVEL_META[level]?.label ?? curriculumToTitle(level)}`;
  const description =
    data.description ??
    `${data.questions.length} curated ${stackName} interview questions for ${curriculumToTitle(level)} developers.`;
  const canonicalUrl = `${origin}/interview/${lang}/${track}/${level}/${stack}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "InterviewExplainer" },
  };
}

/** Metadata for a standalone role page (ruby / business-analyst / data-analyst). */
export function buildRolePageMetadata(data: RolePageData): Metadata {
  const origin = getCanonicalOrigin();
  const ROLE_TITLES: Record<string, string> = {
    ruby: "Ruby Interview Questions — Backend, Rails, RSpec | InterviewExplainer",
    "business-analyst":
      "Business Analyst Interview Questions — Requirements, SQL, Case Studies | InterviewExplainer",
    "data-analyst":
      "Data Analyst Interview Questions — SQL, Python, Case Studies | InterviewExplainer",
  };
  const ROLE_DESCS: Record<string, string> = {
    ruby: "Ruby on Rails, Sidekiq, ActiveRecord, RSpec, REST API interview questions. Beginner to advanced, all levels covered.",
    "business-analyst":
      "Business Analyst interview prep: requirements gathering, stakeholder management, SQL basics, Agile/JIRA, process mapping, and STAR behavioral questions.",
    "data-analyst":
      "SQL coding rounds, Python pandas, A/B testing, data visualization, and case study interview questions for Data Analysts. Beginner to advanced.",
  };
  return {
    title: ROLE_TITLES[data.slug] ?? `${data.title} | InterviewExplainer`,
    description: ROLE_DESCS[data.slug] ?? data.description,
    alternates: { canonical: `${origin}/interview/${data.slug}` },
  };
}
