/**
 * question-data.ts — Canonical question data resolver (P06-T041..T060).
 *
 * Adapts the existing QuestionPagePayload (from content-reader / api.ts) into
 * the canonical QuestionPageData contract. This is the ONE place that maps
 * content-reader output to the V2 question page; all question components
 * consume QuestionPageData, never the raw payload (P06-T041/T042).
 *
 * Also resolves prev/next, related, and follow-up questions using the
 * hierarchy resolvers (P05) so the question page is integrated with the
 * content-discovery hierarchy.
 */

import {
  getQuestionPagePayload,
  getAllQuestionsForStack,
  getSubcategoriesWithQuestions,
} from "@/lib/content-reader";
import type { QuestionPagePayload, AnswerSection as ApiAnswerSection } from "@/lib/api";
import type {
  QuestionPageData,
  AnswerSection,
  QuestionMetadata,
  RelatedQuestion,
  FollowUpQuestion,
} from "./question-types";
import { resolveBreadcrumbs } from "@/lib/hierarchy";

// ─── Main resolver ────────────────────────────────────────────────────────────

/**
 * Resolve the canonical question page data (P06-T041).
 * Returns null if the question cannot be resolved from the content tree.
 */
export function resolveQuestionPageData(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string
): QuestionPageData | null {
  const payload = getQuestionPagePayload(domainSlug, stackSlug, questionSlug);
  if (!payload) return null;

  const title = payload.title || toTitle(questionSlug);
  const moduleSlug = resolveModuleSlug(domainSlug, stackSlug, questionSlug);

  const sections = adaptAnswerSections(payload);
  const metadata = adaptMetadata(payload);
  const prevNext = resolvePrevNext(domainSlug, stackSlug, questionSlug, payload);
  const related = resolveRelated(domainSlug, stackSlug, questionSlug, payload);
  const followUps = resolveFollowUps(payload);
  const breadcrumbs = resolveBreadcrumbs({
    domainSlug,
    stackSlug,
    questionSlug,
  }).map((c) => ({ label: c.label, href: c.href }));

  return {
    identity: {
      slug: questionSlug,
      title,
      domainSlug,
      stackSlug,
      moduleSlug,
    },
    question: payload.questionText || title,
    sections,
    metadata,
    prevNext,
    related,
    followUps,
    breadcrumbs,
  };
}

// ─── Answer section adapter (P06-T120..T125) ───────────────────────────────────

/**
 * Adapt the API payload's answerSections into our canonical AnswerSection[].
 * The API stores sections with a `sectionType` + `content` string. We map
 * each to the canonical type and split prose/code blocks.
 */
function adaptAnswerSections(payload: QuestionPagePayload): AnswerSection[] {
  const apiSections = payload.answerSections ?? [];
  const sections: AnswerSection[] = [];

  for (let i = 0; i < apiSections.length; i++) {
    const s = apiSections[i];
    const adapted = adaptApiSection(s, i);
    if (adapted) sections.push(...adapted);
  }

  // Fallback: if no sections, try questionText as a single prose block.
  if (sections.length === 0 && payload.questionText) {
    sections.push({
      id: "question-text",
      type: "prose",
      content: payload.questionText,
    });
  }

  return sections;
}

function adaptApiSection(
  s: ApiAnswerSection,
  index: number
): AnswerSection[] | null {
  const content = s.content ?? "";
  const type = s.sectionType?.toLowerCase() ?? "";

  // Map API section types to canonical types.
  if (type.includes("code") || isCodeBlock(content)) {
    return [{
      id: `sec-${index}`,
      type: "code",
      code: extractCode(content),
      language: extractLang(content),
    }];
  }

  if (type.includes("callout") || type.includes("note") || type.includes("tip") || type.includes("warning")) {
    return [{
      id: `sec-${index}`,
      type: "callout",
      calloutVariant: mapCalloutVariant(type),
      calloutTitle: s.sectionTitle,
      content,
    }];
  }

  if (type.includes("table")) {
    return [{
      id: `sec-${index}`,
      type: "table",
      tableHeaders: extractTableHeaders(content),
      tableRows: extractTableRows(content),
    }];
  }

  if (type.includes("heading")) {
    return [{
      id: `sec-${index}`,
      type: "heading",
      heading: s.sectionTitle ?? content,
      level: 2,
    }];
  }

  // Default: prose. Split markdown into sub-sections for better rendering.
  const blocks = splitMarkdownSections(content);
  return blocks.map((block, j) => {
    if (isCodeBlock(block)) {
      return {
        id: `sec-${index}-${j}`,
        type: "code" as const,
        code: extractCode(block),
        language: extractLang(block),
      };
    }
    if (isHeading(block)) {
      const { text, level } = extractHeading(block);
      return {
        id: `sec-${index}-${j}`,
        type: "heading" as const,
        heading: text,
        level,
      };
    }
    return {
      id: `sec-${index}-${j}`,
      type: "prose" as const,
      content: block,
    };
  });
}

// ─── Metadata adapter (P06-T201..T210) ────────────────────────────────────────

function adaptMetadata(payload: QuestionPagePayload): QuestionMetadata {
  return {
    difficulty: normalizeDifficulty(payload.difficulty),
    companies: undefined, // API payload doesn't carry company tags directly
    readTimeMinutes: payload.estimatedReadTime || estimateReadTime(payload),
    isLocked: false,
    updatedAt: undefined,
  };
}

// ─── Prev/next resolver (P06-T221..T240) ──────────────────────────────────────

function resolvePrevNext(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string,
  payload: QuestionPagePayload
): { prev?: RelatedQuestion; next?: RelatedQuestion } {
  // Prefer the API payload's prev/next if present.
  if (payload.previousQuestion) {
    return {
      prev: {
        slug: payload.previousQuestion.slug,
        title: payload.previousQuestion.title,
        href: `/${domainSlug}/${stackSlug}/${payload.previousQuestion.slug}`,
      },
    };
  }
  if (payload.nextQuestion) {
    return {
      next: {
        slug: payload.nextQuestion.slug,
        title: payload.nextQuestion.title,
        href: `/${domainSlug}/${stackSlug}/${payload.nextQuestion.slug}`,
      },
    };
  }

  // Fallback: derive from the flat question list.
  try {
    const all = getAllQuestionsForStack(domainSlug, stackSlug);
    const idx = all.findIndex((q) => q.slug === questionSlug);
    if (idx === -1) return {};

    return {
      prev: idx > 0
        ? {
            slug: all[idx - 1].slug,
            title: all[idx - 1].title ?? toTitle(all[idx - 1].slug),
            href: `/${domainSlug}/${stackSlug}/${all[idx - 1].slug}`,
          }
        : undefined,
      next: idx < all.length - 1
        ? {
            slug: all[idx + 1].slug,
            title: all[idx + 1].title ?? toTitle(all[idx + 1].slug),
            href: `/${domainSlug}/${stackSlug}/${all[idx + 1].slug}`,
          }
        : undefined,
    };
  } catch {
    return {};
  }
}

// ─── Related questions (P06-T241..T250) ───────────────────────────────────────

function resolveRelated(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string,
  payload: QuestionPagePayload,
  limit = 5
): RelatedQuestion[] {
  // Prefer the API payload's relatedQuestions.
  if (payload.relatedQuestions && payload.relatedQuestions.length > 0) {
    return payload.relatedQuestions.slice(0, limit).map((q) => ({
      slug: q.slug,
      title: q.title,
      href: `/${domainSlug}/${stackSlug}/${q.slug}`,
      difficulty: normalizeDifficulty(q.difficulty),
    }));
  }

  // Fallback: derive from the flat question list.
  try {
    const all = getAllQuestionsForStack(domainSlug, stackSlug);
    const idx = all.findIndex((q) => q.slug === questionSlug);
    if (idx === -1 || all.length <= 1) return [];

    const result: RelatedQuestion[] = [];
    for (let i = 1; i < all.length && result.length < limit; i++) {
      const after = all[idx + i];
      if (after) {
        result.push({
          slug: after.slug,
          title: after.title ?? toTitle(after.slug),
          href: `/${domainSlug}/${stackSlug}/${after.slug}`,
          difficulty: normalizeDifficulty(after.difficulty),
        });
      }
      if (result.length >= limit) break;
      const before = all[idx - i];
      if (before) {
        result.push({
          slug: before.slug,
          title: before.title ?? toTitle(before.slug),
          href: `/${domainSlug}/${stackSlug}/${before.slug}`,
          difficulty: normalizeDifficulty(before.difficulty),
        });
      }
    }
    return result.slice(0, limit);
  } catch {
    return [];
  }
}

// ─── Follow-up questions (P06-T251..T260) ─────────────────────────────────────

function resolveFollowUps(payload: QuestionPagePayload): FollowUpQuestion[] {
  // The API payload has quickQuestions / peopleAlsoAsk — use as follow-ups.
  const followUps = payload.quickQuestions ?? payload.peopleAlsoAsk ?? [];
  if (!Array.isArray(followUps) || followUps.length === 0) return [];

  return followUps.slice(0, 5).map((q) => ({
    slug: q.slug,
    title: q.title,
    href: `/${q.domainSlug ?? ""}/${q.stackSlug ?? ""}/${q.slug}`.replace(/\/+/g, "/"),
  }));
}

// ─── Module slug resolver ────────────────────────────────────────────────────

function resolveModuleSlug(
  domainSlug: string,
  stackSlug: string,
  questionSlug: string
): string {
  try {
    const subcats = getSubcategoriesWithQuestions(domainSlug, stackSlug);
    for (const s of subcats) {
      if ((s.questions ?? []).some((q) => q.slug === questionSlug)) {
        return s.slug === "_root" ? stackSlug : s.slug;
      }
    }
  } catch {
    // fall through
  }
  return stackSlug;
}

// ─── Markdown helpers ──────────────────────────────────────────────────────────

function splitMarkdownSections(markdown: string): string[] {
  const blocks: string[] = [];
  let current = "";
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      current += line + "\n";
      continue;
    }
    if (!inCodeBlock && line.trim() === "") {
      if (current.trim()) blocks.push(current.trim());
      current = "";
    } else {
      current += line + "\n";
    }
  }
  if (current.trim()) blocks.push(current.trim());
  return blocks;
}

function isCodeBlock(block: string): boolean {
  return block.trim().startsWith("```");
}

function extractCode(block: string): string {
  const lines = block.trim().split("\n");
  // If it's a fenced code block, extract the inner content.
  if (lines[0].trim().startsWith("```")) {
    return lines.slice(1, lines[0].trim() === "```" ? -1 : -1).join("\n");
  }
  return block;
}

function extractLang(block: string): string {
  const first = block.trim().split("\n")[0];
  const lang = first.replace(/^```/, "").trim();
  return lang || "text";
}

function isHeading(block: string): boolean {
  return /^#{2,4}\s/.test(block.trim());
}

function extractHeading(block: string): { text: string; level: 2 | 3 | 4 } {
  const match = block.trim().match(/^(#{2,4})\s+(.+)$/);
  if (!match) return { text: block.trim(), level: 2 };
  const level = (match[1].length as 2 | 3 | 4) || 2;
  return { text: match[2].trim(), level };
}

function extractTableHeaders(content: string): string[] {
  // Simple markdown table: first line is headers.
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];
  return lines[0].split("|").map((h) => h.trim()).filter(Boolean);
}

function extractTableRows(content: string): string[][] {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 3) return []; // header + separator + rows
  return lines.slice(2).map((line) =>
    line.split("|").map((c) => c.trim()).filter(Boolean)
  );
}

function mapCalloutVariant(
  type: string
): "note" | "tip" | "warning" | "example" | "takeaway" {
  if (type.includes("tip")) return "tip";
  if (type.includes("warning")) return "warning";
  if (type.includes("example")) return "example";
  if (type.includes("takeaway")) return "takeaway";
  return "note";
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeDifficulty(raw: string | undefined): "easy" | "medium" | "hard" | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (lower.includes("easy")) return "easy";
  if (lower.includes("hard")) return "hard";
  if (lower.includes("medium") || lower.includes("moderate")) return "medium";
  return undefined;
}

function estimateReadTime(payload: QuestionPagePayload): number {
  const text = (payload.questionText ?? "").toString();
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
