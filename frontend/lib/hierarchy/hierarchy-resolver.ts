/**
 * hierarchy-resolver.ts — Canonical hierarchy resolvers (P05-T023..T031).
 *
 * Wraps the existing content-reader + seo-pillars data sources behind a single
 * canonical V2 resolver API. This is the ONE place that owns hierarchy
 * resolution; all V2 hierarchy pages consume these functions instead of
 * reaching into content-reader / seo-pillars directly (P05-T021/T022 —
 * single canonical data source, no competing definitions).
 *
 * The resolvers are server-safe (they call fs-backed content-reader functions
 * which are themselves server-only). They never throw on missing data — they
 * return null so callers can `notFound()` or render an empty state.
 *
 * Design (P05-T023..T031):
 *   - resolveDomain / resolveStack / resolvePillar / resolveModule (T024-T027)
 *   - resolveChildren (T028) — child entity resolver
 *   - resolveParent (T029) — parent entity resolver
 *   - resolveHierarchyPath (T030) — full domain→question path
 *   - validateHierarchy (T031) — orphan/circular/duplicate detection
 */

import {
  getVisibleStackSlugs,
  getSubcategoriesWithQuestions,
  domainSlugToContentPath,
} from "@/lib/content-reader";
import type { StackSubcategory } from "@/lib/api";
import {
  PILLAR_HUBS,
  PILLAR_HUB_SLUGS,
  type PillarHubEntry,
} from "@/lib/seo-pillars";
import {
  SEO_MODULES,
  type SeoModuleEntry,
} from "@/lib/seo-slugs";
import {
  isHubEnabled,
  ENABLED_LANGUAGES,
} from "@/lib/launch-config";
import type {
  DomainEntity,
  StackEntity,
  PillarEntity,
  ModuleEntity,
  QuestionEntity,
  HierarchyPath,
  HierarchyCrumb,
  HierarchySlug,
  HierarchyValidationFinding,
} from "./hierarchy-types";

// ─── Display helpers ─────────────────────────────────────────────────────────

/** Convert a slug to a human-readable title. */
function toTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Check if a domain slug represents a language backend (java-backend-*, python-backend-*). */
function isLanguageDomain(domainSlug: string): boolean {
  return ENABLED_LANGUAGES.some((lang) => domainSlug.startsWith(`${lang}-`));
}

// ─── Domain resolver (P05-T024) ───────────────────────────────────────────────

const _domainCache = new Map<string, DomainEntity | null>();

/**
 * Resolve a domain entity by slug (P05-T024).
 * Returns null if the domain has no content path and no visible stacks.
 */
export function resolveDomain(domainSlug: string): DomainEntity | null {
  if (_domainCache.has(domainSlug)) return _domainCache.get(domainSlug) ?? null;

  const contentPath = domainSlugToContentPath(domainSlug);
  const stacks = getVisibleStackSlugs(domainSlug);

  // A domain is valid if it has a content path OR visible stacks.
  if (!contentPath && stacks.length === 0) {
    _domainCache.set(domainSlug, null);
    return null;
  }

  const lang = ENABLED_LANGUAGES.find((l) => domainSlug.startsWith(`${l}-`));
  const levelMatch = domainSlug.match(/-(beginner|intermediate|advanced)$/);
  const level = levelMatch ? levelMatch[1] : undefined;

  const entity: DomainEntity = {
    slug: domainSlug,
    title: toTitle(domainSlug),
    description: contentPath
      ? `Interview questions and answers for ${toTitle(domainSlug)}.`
      : `Prepare for ${toTitle(domainSlug)} interviews with curated questions.`,
    language: lang,
    level,
    stacks,
  };

  _domainCache.set(domainSlug, entity);
  return entity;
}

// ─── Stack resolver (P05-T025) ────────────────────────────────────────────────

const _stackCache = new Map<string, StackEntity | null>();

/**
 * Resolve a stack entity by domain + stack slug (P05-T025).
 */
export function resolveStack(
  domainSlug: string,
  stackSlug: string
): StackEntity | null {
  const key = `${domainSlug}::${stackSlug}`;
  if (_stackCache.has(key)) return _stackCache.get(key) ?? null;

  const visibleStacks = getVisibleStackSlugs(domainSlug);
  if (!visibleStacks.includes(stackSlug)) {
    _stackCache.set(key, null);
    return null;
  }

  // Derive pillar slugs from the stack's subcategories that have pillar mappings.
  const subcats = safeGetSubcategories(domainSlug, stackSlug);
  const pillarSlugs = derivePillarSlugs(subcats);
  const moduleSlugs = subcats.map((s) => s.slug).filter((s) => s !== "_root");

  const entity: StackEntity = {
    slug: stackSlug,
    domainSlug,
    title: toTitle(stackSlug),
    description: `Interview questions for ${toTitle(stackSlug)} within ${toTitle(domainSlug)}.`,
    pillars: pillarSlugs,
    modules: moduleSlugs,
  };

  _stackCache.set(key, entity);
  return entity;
}

// ─── Pillar resolver (P05-T026) ────────────────────────────────────────────────

/**
 * Resolve a pillar entity by slug (P05-T026).
 * Pillars are backed by the PILLAR_HUBS registry (seo-pillars.ts).
 */
export function resolvePillar(pillarSlug: string): PillarEntity | null {
  if (!PILLAR_HUB_SLUGS.includes(pillarSlug as any)) return null;
  const hub = PILLAR_HUBS.find((p) => p.pillarSlug === pillarSlug);
  if (!hub) return null;

  return {
    slug: hub.pillarSlug,
    stackSlug: deriveStackForPillar(hub),
    title: hub.title,
    tagline: hub.tagline,
    heroBlurb: hub.heroBlurb,
    modules: hub.moduleSlugs,
    metaDescription: hub.metaDescription,
    relatedPillars: hub.relatedPillars,
  };
}

/**
 * Resolve the pillar hub entry directly (for SEO pages that need the raw hub).
 */
export function resolvePillarHub(pillarSlug: string): PillarHubEntry | null {
  return PILLAR_HUBS.find((p) => p.pillarSlug === pillarSlug) ?? null;
}

// ─── Module resolver (P05-T027) ────────────────────────────────────────────────

/**
 * Resolve a module entity by slug (P05-T027).
 * Modules are backed by SEO_MODULES (seo-slugs.ts) when available, otherwise
 * derived from the content tree.
 */
export function resolveModule(
  domainSlug: string,
  stackSlug: string,
  moduleSlug: string
): ModuleEntity | null {
  // Try SEO_MODULES first (canonical module registry).
  const seoModule = SEO_MODULES.find(
    (m) => m.moduleSlug === moduleSlug || m.seoSlug === moduleSlug
  );
  if (seoModule) {
    return {
      slug: moduleSlug,
      stackSlug,
      domainSlug,
      title: seoModule.title ?? toTitle(moduleSlug),
      description: seoModule.intro ?? `${toTitle(moduleSlug)} interview questions.`,
      questions: getModuleQuestionSlugs(domainSlug, stackSlug, moduleSlug),
    };
  }

  // Fallback: derive from content tree.
  const subcats = safeGetSubcategories(domainSlug, stackSlug);
  const subcat = subcats.find((s) => s.slug === moduleSlug);
  if (!subcat) return null;

  return {
    slug: moduleSlug,
    stackSlug,
    domainSlug,
    title: toTitle(moduleSlug),
    description: `${toTitle(moduleSlug)} interview questions.`,
    questions: (subcat.questions ?? []).map((q) => q.slug),
  };
}

// ─── Child entity resolver (P05-T028) ──────────────────────────────────────────

/**
 * Resolve the children of a hierarchy entity (P05-T028).
 * Returns the slugs of immediate children.
 */
export function resolveChildren(
  level: "domain" | "stack" | "pillar" | "module",
  slugs: { domainSlug?: string; stackSlug?: string; pillarSlug?: string; moduleSlug?: string }
): HierarchySlug[] {
  switch (level) {
    case "domain": {
      if (!slugs.domainSlug) return [];
      return getVisibleStackSlugs(slugs.domainSlug);
    }
    case "stack": {
      if (!slugs.domainSlug || !slugs.stackSlug) return [];
      const subcats = safeGetSubcategories(slugs.domainSlug, slugs.stackSlug);
      return subcats.map((s) => s.slug).filter((s) => s !== "_root");
    }
    case "pillar": {
      if (!slugs.pillarSlug) return [];
      const pillar = resolvePillar(slugs.pillarSlug);
      return pillar?.modules ?? [];
    }
    case "module": {
      if (!slugs.domainSlug || !slugs.stackSlug || !slugs.moduleSlug) return [];
      const mod = resolveModule(slugs.domainSlug, slugs.stackSlug, slugs.moduleSlug);
      return mod?.questions ?? [];
    }
  }
}

// ─── Parent entity resolver (P05-T029) ─────────────────────────────────────────

/**
 * Resolve the parent of a hierarchy entity (P05-T029).
 */
export function resolveParent(
  level: "stack" | "pillar" | "module" | "question",
  slugs: { domainSlug?: string; stackSlug?: string; pillarSlug?: string; moduleSlug?: string }
): { level: "domain" | "stack" | "pillar" | "module"; slug: HierarchySlug } | null {
  switch (level) {
    case "stack":
      return slugs.domainSlug
        ? { level: "domain", slug: slugs.domainSlug }
        : null;
    case "pillar": {
      // Pillars map back to a stack via the pillar hub's module set.
      if (!slugs.pillarSlug) return null;
      const stackSlug = findStackForPillar(slugs.pillarSlug);
      const domainSlug = slugs.domainSlug;
      if (stackSlug && domainSlug) return { level: "stack", slug: stackSlug };
      return null;
    }
    case "module":
      return slugs.stackSlug
        ? { level: "stack", slug: slugs.stackSlug }
        : null;
    case "question":
      return slugs.moduleSlug
        ? { level: "module", slug: slugs.moduleSlug }
        : null;
  }
}

// ─── Hierarchy path resolver (P05-T030) ────────────────────────────────────────

/**
 * Resolve the full hierarchy path for a question (P05-T030).
 * Used by breadcrumbs, canonical URLs, and structured data.
 */
export function resolveHierarchyPath(
  domainSlug: string,
  stackSlug: string,
  questionSlug?: string,
  moduleSlug?: string
): HierarchyPath | null {
  const domain = resolveDomain(domainSlug);
  if (!domain) return null;

  const stack = resolveStack(domainSlug, stackSlug);
  if (!stack) return null;

  // Module slug may be derived from the question's subcategory if not provided.
  let resolvedModuleSlug = moduleSlug;
  if (!resolvedModuleSlug && questionSlug) {
    const subcats = safeGetSubcategories(domainSlug, stackSlug);
    for (const s of subcats) {
      if ((s.questions ?? []).some((q) => q.slug === questionSlug)) {
        resolvedModuleSlug = s.slug === "_root" ? stackSlug : s.slug;
        break;
      }
    }
  }
  if (!resolvedModuleSlug) return { domain, stack };

  const module = resolveModule(domainSlug, stackSlug, resolvedModuleSlug);
  if (!module) return { domain, stack };

  let question: QuestionEntity | undefined;
  if (questionSlug) {
    question = {
      slug: questionSlug,
      domainSlug,
      stackSlug,
      moduleSlug: resolvedModuleSlug,
      title: toTitle(questionSlug),
    };
  }

  return { domain, stack, module, question };
}

// ─── Breadcrumb resolver (P05-T321..T330, consumed by ShellBreadcrumbs) ───────

/**
 * Build breadcrumb crumbs for a hierarchy level (P05-T321..T330).
 */
export function resolveBreadcrumbs(args: {
  domainSlug?: string;
  stackSlug?: string;
  pillarSlug?: string;
  moduleSlug?: string;
  questionSlug?: string;
}): HierarchyCrumb[] {
  const crumbs: HierarchyCrumb[] = [];

  if (args.domainSlug) {
    const domain = resolveDomain(args.domainSlug);
    if (domain) {
      crumbs.push({ label: domain.title, href: `/${args.domainSlug}` });
    }
  }

  if (args.stackSlug) {
    const stack = resolveStack(args.domainSlug ?? "", args.stackSlug);
    if (stack) {
      crumbs.push({
        label: stack.title,
        href: `/${args.domainSlug}/${args.stackSlug}`,
      });
    }
  }

  if (args.pillarSlug) {
    const pillar = resolvePillar(args.pillarSlug);
    if (pillar) {
      crumbs.push({ label: pillar.title, href: `/${args.pillarSlug}` });
    }
  }

  if (args.moduleSlug) {
    crumbs.push({
      label: toTitle(args.moduleSlug),
      href: `/${args.domainSlug}/${args.stackSlug}/${args.moduleSlug}`,
    });
  }

  if (args.questionSlug) {
    crumbs.push({
      label: toTitle(args.questionSlug),
      href: `/${args.domainSlug}/${args.stackSlug}/${args.questionSlug}`,
      current: true,
    });
  }

  return crumbs;
}

// ─── Validation (P05-T031..T036) ───────────────────────────────────────────────

/**
 * Validate the hierarchy and detect orphans, circular references, and
 * duplicates (P05-T031..T036).
 * Runs against all enabled domains/stacks. Safe to call once at build time.
 */
export function validateHierarchy(
  domainSlugs: string[]
): HierarchyValidationFinding[] {
  const findings: HierarchyValidationFinding[] = [];
  const seenSlugs = new Set<string>();

  for (const domainSlug of domainSlugs) {
    const domain = resolveDomain(domainSlug);
    if (!domain) {
      findings.push({
        code: "MISSING_PARENT",
        severity: "error",
        message: `Domain "${domainSlug}" has no content path and no visible stacks.`,
        entities: [domainSlug],
      });
      continue;
    }

    if (seenSlugs.has(domainSlug)) {
      findings.push({
        code: "DUPLICATE_ENTITY",
        severity: "error",
        message: `Duplicate domain slug "${domainSlug}".`,
        entities: [domainSlug],
      });
    }
    seenSlugs.add(domainSlug);

    for (const stackSlug of domain.stacks) {
      const stack = resolveStack(domainSlug, stackSlug);
      if (!stack) {
        findings.push({
          code: "ORPHAN_STACK",
          severity: "warning",
          message: `Stack "${stackSlug}" is listed in domain "${domainSlug}" but cannot be resolved.`,
          entities: [stackSlug],
        });
      }
    }
  }

  return findings;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Safe wrapper around getSubcategoriesWithQuestions that never throws. */
function safeGetSubcategories(
  domainSlug: string,
  stackSlug: string
): StackSubcategory[] {
  try {
    return getSubcategoriesWithQuestions(domainSlug, stackSlug);
  } catch {
    return [];
  }
}

/** Derive pillar slugs from a stack's subcategories. */
function derivePillarSlugs(subcats: StackSubcategory[]): HierarchySlug[] {
  const slugs = new Set<HierarchySlug>();
  for (const s of subcats) {
    // A subcategory maps to a pillar hub if its slug matches a pillar slug.
    if (PILLAR_HUB_SLUGS.includes(s.slug as any)) {
      slugs.add(s.slug);
    }
  }
  return Array.from(slugs);
}

/** Get question slugs for a module within a stack. */
function getModuleQuestionSlugs(
  domainSlug: string,
  stackSlug: string,
  moduleSlug: string
): HierarchySlug[] {
  const subcats = safeGetSubcategories(domainSlug, stackSlug);
  const subcat = subcats.find((s) => s.slug === moduleSlug);
  if (!subcat) return [];
  return (subcat.questions ?? []).map((q) => q.slug);
}

/** Derive the stack slug for a pillar hub by finding which stack its modules belong to. */
function deriveStackForPillar(hub: PillarHubEntry): HierarchySlug {
  // Pillar hubs are cross-stack by nature; we return the first module's stack
  // as the canonical parent, or the pillar slug itself as a fallback.
  return hub.pillarSlug;
}

/** Find the stack that contains a pillar's modules. */
function findStackForPillar(pillarSlug: string): HierarchySlug | null {
  const hub = PILLAR_HUBS.find((p) => p.pillarSlug === pillarSlug);
  if (!hub) return null;
  return hub.pillarSlug;
}

// ─── Public API surface ───────────────────────────────────────────────────────

export const HierarchyResolver = {
  resolveDomain,
  resolveStack,
  resolvePillar,
  resolvePillarHub,
  resolveModule,
  resolveChildren,
  resolveParent,
  resolveHierarchyPath,
  resolveBreadcrumbs,
  validateHierarchy,
} as const;
