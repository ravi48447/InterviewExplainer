/**
 * search-index.ts — Canonical search document source of truth (P07-T077).
 *
 * Builds the searchable document index from canonical content sources
 * (content-reader, seo-pillars, seo-slugs, hierarchy). This is the ONE
 * place that maps content to SearchDocument — all search consumers read
 * from this index, never from content-reader directly (P07-E).
 *
 * The index is built server-side and cached per-process. It excludes draft
 * content by default (P07-T551) and only includes published entities with
 * canonical URLs (P07-T552).
 */

import {
  getVisibleStackSlugs,
  getSubcategoriesWithQuestions,
  getAllQuestionsForStack,
  domainSlugToContentPath,
} from "@/lib/content-reader";
import { PILLAR_HUBS, PILLAR_HUB_SLUGS } from "@/lib/seo-pillars";
import { SEO_MODULES } from "@/lib/seo-slugs";
import { ENABLED_LANGUAGES } from "@/lib/launch-config";
import type { SearchDocument, SearchEntityType } from "./search-types";

// ─── Index cache ────────────────────────────────────────────────────────────

let _index: SearchDocument[] | null = null;
let _indexMap: Map<string, SearchDocument> | null = null;

/**
 * Build the full search index from canonical content sources (P07-T077).
 * Cached per-process. Excludes draft content.
 */
export function getSearchIndex(): SearchDocument[] {
  if (_index) return _index;

  const docs: SearchDocument[] = [];

  // 1. Domain documents — from enabled languages + content paths.
  for (const lang of ENABLED_LANGUAGES) {
    // Derive domain slugs from content paths.
    // We scan visible stacks per domain to discover domain slugs.
    // For now, use known domain slug patterns.
  }

  // 2. Stack documents — from visible stacks per domain.
  // We iterate known domains derived from content-reader.
  const domainSlugs = discoverDomainSlugs();
  for (const domainSlug of domainSlugs) {
    docs.push(...buildDomainDocuments(domainSlug));
    const stacks = safeGetVisibleStacks(domainSlug);
    for (const stackSlug of stacks) {
      docs.push(...buildStackDocuments(domainSlug, stackSlug));
      // 4. Question documents — from all questions per stack.
      docs.push(...buildQuestionDocuments(domainSlug, stackSlug));
    }
  }

  // 3. Pillar documents — from PILLAR_HUBS.
  for (const pillarSlug of PILLAR_HUB_SLUGS) {
    const hub = PILLAR_HUBS.find((p) => p.pillarSlug === pillarSlug);
    if (!hub) continue;
    docs.push({
      id: `pillar:${pillarSlug}`,
      type: "pillar",
      title: hub.title,
      url: `/prep/${pillarSlug}`,
      description: hub.tagline,
      keywords: [hub.title, hub.pillarSlug],
      status: "published",
    });
  }

  // 5. Module documents — from SEO_MODULES.
  for (const mod of SEO_MODULES) {
    docs.push({
      id: `module:${mod.seoSlug}`,
      type: "module",
      title: mod.title,
      url: `/seo/${mod.seoSlug}`,
      description: mod.intro,
      keywords: [mod.title, mod.moduleSlug, mod.seoSlug, mod.pillarName],
      status: "published",
    });
  }

  // Filter out draft content (P07-T551).
  _index = docs.filter((d) => d.status !== "draft");
  _indexMap = new Map(_index.map((d) => [d.id, d]));
  return _index;
}

/**
 * Get a single document by ID from the index.
 */
export function getSearchDocument(id: string): SearchDocument | undefined {
  if (!_indexMap) getSearchIndex();
  return _indexMap!.get(id);
}

/**
 * Get documents by entity type.
 */
export function getDocumentsByType(type: SearchEntityType): SearchDocument[] {
  return getSearchIndex().filter((d) => d.type === type);
}

// ─── Document builders ──────────────────────────────────────────────────────

function buildDomainDocuments(domainSlug: string): SearchDocument[] {
  return [{
    id: `domain:${domainSlug}`,
    type: "domain",
    title: toTitle(domainSlug),
    url: `/${domainSlug}`,
    description: `Interview questions and answers for ${toTitle(domainSlug)}.`,
    keywords: [domainSlug, toTitle(domainSlug)],
    status: "published",
  }];
}

function buildStackDocuments(domainSlug: string, stackSlug: string): SearchDocument[] {
  let subcats: { slug: string; name: string }[] = [];
  try {
    subcats = getSubcategoriesWithQuestions(domainSlug, stackSlug).map((s) => ({
      slug: s.slug,
      name: s.name,
    }));
  } catch {
    // ignore
  }
  return [{
    id: `stack:${domainSlug}:${stackSlug}`,
    type: "stack",
    title: toTitle(stackSlug),
    url: `/${domainSlug}/${stackSlug}`,
    description: `Interview questions for ${toTitle(stackSlug)} in ${toTitle(domainSlug)}.`,
    hierarchyPath: [toTitle(domainSlug)],
    keywords: [stackSlug, toTitle(stackSlug), domainSlug, ...subcats.map((s) => s.name)],
    status: "published",
  }];
}

function buildQuestionDocuments(
  domainSlug: string,
  stackSlug: string
): SearchDocument[] {
  let questions: { slug: string; title: string; difficulty?: string; estimatedReadTime?: number }[] = [];
  try {
    questions = getAllQuestionsForStack(domainSlug, stackSlug).map((q) => ({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      estimatedReadTime: q.estimatedReadTime,
    }));
  } catch {
    return [];
  }

  return questions.map((q) => ({
    id: `question:${domainSlug}:${stackSlug}:${q.slug}`,
    type: "question",
    title: q.title,
    url: `/${domainSlug}/${stackSlug}/${q.slug}`,
    description: undefined,
    difficulty: normalizeDifficulty(q.difficulty),
    hierarchyPath: [toTitle(domainSlug), toTitle(stackSlug)],
    readTimeMinutes: q.estimatedReadTime,
    language: extractLanguage(domainSlug),
    keywords: [q.title, q.slug],
    status: "published",
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function discoverDomainSlugs(): string[] {
  // Derive domain slugs from content paths via known language/track/level
  // patterns. We check content-reader's domainSlugToContentPath for known
  // domain slug patterns.
  const known: string[] = [];
  for (const lang of ENABLED_LANGUAGES) {
    for (const track of ["backend", "fullstack"]) {
      for (const level of ["beginner", "intermediate"]) {
        const slug = `${lang}-${track}-${level}`;
        if (domainSlugToContentPath(slug)) {
          known.push(slug);
        }
      }
    }
  }
  // Deduplicate.
  return Array.from(new Set(known));
}

function safeGetVisibleStacks(domainSlug: string): string[] {
  try {
    return getVisibleStackSlugs(domainSlug);
  } catch {
    return [];
  }
}

function normalizeDifficulty(raw: string | undefined): "easy" | "medium" | "hard" | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (lower.includes("easy")) return "easy";
  if (lower.includes("hard")) return "hard";
  if (lower.includes("medium") || lower.includes("moderate")) return "medium";
  return undefined;
}

function extractLanguage(domainSlug: string): string | undefined {
  return ENABLED_LANGUAGES.find((l) => domainSlug.startsWith(`${l}-`));
}

function toTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Clear the index cache (for testing or rebuild after content changes).
 */
export function clearSearchIndex(): void {
  _index = null;
  _indexMap = null;
}
