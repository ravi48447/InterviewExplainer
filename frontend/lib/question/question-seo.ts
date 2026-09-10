/**
 * question-seo.ts — Question page SEO + structured data (P06-T281..T320).
 *
 * Builds canonical metadata, FAQ structured data, and breadcrumb schema for
 * question pages using the Phase 02 SEO builders + canonical question data.
 */

import type { Metadata } from "next";
import { buildMetadata, type RouteFamily } from "@/lib/seo";
import type { QuestionPageData } from "./question-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

// ─── Question metadata (P06-T281..T290) ───────────────────────────────────────

export function buildQuestionMetadata(data: QuestionPageData): Metadata {
  const { identity, question, metadata } = data;
  const title = `${question} — Interview Question & Answer`;
  const description = buildQuestionDescription(data);

  return buildMetadata({
    family: "question" as RouteFamily,
    params: {
      domainSlug: identity.domainSlug,
      stackSlug: identity.stackSlug,
      questionSlug: identity.slug,
    },
    title,
    description,
    noindex: false,
  });
}

function buildQuestionDescription(data: QuestionPageData): string {
  const { question, metadata } = data;
  const parts: string[] = [question];
  if (metadata.difficulty) {
    parts.push(`${metadata.difficulty} difficulty`);
  }
  if (metadata.companies && metadata.companies.length > 0) {
    parts.push(`asked at ${metadata.companies.slice(0, 3).join(", ")}`);
  }
  parts.push("with a detailed interview answer.");
  return parts.join(" ").slice(0, 160);
}

// ─── FAQ structured data (P06-T291..T300) ─────────────────────────────────────

/**
 * Build FAQPage JSON-LD for a question (P06-T291).
 * Uses the direct answer + first prose section as the Q&A pair.
 */
export function buildQuestionStructuredData(data: QuestionPageData): object {
  const answerText = extractPlainTextAnswer(data);
  const url = `${SITE_URL}/${data.identity.domainSlug}/${data.identity.stackSlug}/${data.identity.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: data.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerText,
        },
      },
    ],
    url,
  };
}

// ─── Breadcrumb structured data (P06-T296) ───────────────────────────────────

export function buildQuestionBreadcrumbStructuredData(
  data: QuestionPageData
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: crumb.href.startsWith("http")
        ? crumb.href
        : `${SITE_URL}${crumb.href}`,
    })),
  };
}

// ─── Speakable content (P06-T301) ─────────────────────────────────────────────

/**
 * Build speakable content selectors for voice assistants (P06-T301).
 */
export function buildQuestionSpeakable(data: QuestionPageData): object {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    cssSelector: ["#question-title", "#direct-answer"],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractPlainTextAnswer(data: QuestionPageData): string {
  const parts: string[] = [];
  for (const s of data.sections) {
    if (s.type === "callout" && s.content) parts.push(s.content);
    if (s.type === "prose" && s.content) parts.push(s.content);
    if (parts.length >= 2) break;
  }
  return parts.join(" ").slice(0, 500) || data.question;
}
