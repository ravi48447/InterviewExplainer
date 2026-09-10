/**
 * hierarchy-types.ts — Canonical content-discovery hierarchy types (P05-T001..T020).
 *
 * The canonical hierarchy is:
 *
 *   DOMAIN → STACK → PILLAR → MODULE → QUESTION
 *
 * Example:
 *   Software Engineering → Java Backend → Spring Boot → Spring Security →
 *   "How does Spring Security authentication work?"
 *
 * These types are the single V2 contract for every hierarchy entity and
 * relationship. They are consumed by the resolvers in `hierarchy-resolver.ts`
 * and by the shared page architecture in `components/hierarchy/`.
 *
 * Design rules (P05-T006..T008):
 *   - Every entity has a stable string `slug` identity (never array position —
 *     P05-T040).
 *   - Parent relationships are single-valued (a stack has one domain; a module
 *     has one stack/pillar) to prevent ambiguous parent relationships
 *     (P05-T008).
 *   - Canonical hierarchy is separate from search categories (P05-T012).
 *   - Required vs optional fields are explicit per entity (P05-T002..T005).
 */

// ─── Entity identity ─────────────────────────────────────────────────────────

/**
 * A stable, URL-safe string identity for a hierarchy entity.
 * Never derived from array position (P05-T040).
 */
export type HierarchySlug = string;

// ─── Level 1: Domain ──────────────────────────────────────────────────────────

/**
 * Domain entity contract (P05-T002).
 * The top of the hierarchy. Represents a broad field, e.g. "Java Backend".
 */
export interface DomainEntity {
  readonly slug: HierarchySlug;
  /** Human-readable title, e.g. "Java Backend Interview Prep". */
  title: string;
  /** One-sentence description for headers and meta. */
  description: string;
  /** Language tag for the domain (java, python, go, ruby, frontend), if applicable. */
  language?: string;
  /** Experience level key (beginner, intermediate, advanced), if applicable. */
  level?: string;
  /** Child stack slugs, in canonical order. */
  stacks: HierarchySlug[];
}

// ─── Level 2: Stack ──────────────────────────────────────────────────────────

/**
 * Stack entity contract (P05-T003).
 * A sub-domain grouping within a domain, e.g. "Spring Boot".
 */
export interface StackEntity {
  readonly slug: HierarchySlug;
  /** Parent domain slug — single-valued (P05-T008). */
  domainSlug: HierarchySlug;
  title: string;
  description: string;
  /** Child pillar slugs, in canonical order. */
  pillars: HierarchySlug[];
  /** Child module slugs, in canonical order (stacks may have modules directly). */
  modules: HierarchySlug[];
}

// ─── Level 3: Pillar ──────────────────────────────────────────────────────────

/**
 * Pillar entity contract (P05-T004).
 * A topical grouping within a stack, e.g. "Spring Security".
 * Pillars are the SEO-hub level of the hierarchy.
 */
export interface PillarEntity {
  readonly slug: HierarchySlug;
  /** Parent stack slug — single-valued (P05-T008). */
  stackSlug: HierarchySlug;
  title: string;
  /** Short tagline for the pillar. */
  tagline: string;
  /** Hand-authored hero blurb (2-3 sentences). */
  heroBlurb?: string;
  /** Child module slugs, in canonical order. */
  modules: HierarchySlug[];
  /** SEO meta description (≤ 160 chars). */
  metaDescription?: string;
  /** Slugs of related pillar hubs for cross-linking. */
  relatedPillars?: HierarchySlug[];
}

// ─── Level 4: Module ──────────────────────────────────────────────────────────

/**
 * Module entity contract (P05-T005).
 * A concrete learning unit within a pillar/stack, e.g. "Spring Security".
 * Modules are the level that groups questions.
 */
export interface ModuleEntity {
  readonly slug: HierarchySlug;
  /** Parent pillar slug, if the module belongs to a pillar. */
  pillarSlug?: HierarchySlug;
  /** Parent stack slug — single-valued (P05-T008). */
  stackSlug: HierarchySlug;
  /** Grandparent domain slug (denormalised for fast lookup). */
  domainSlug: HierarchySlug;
  title: string;
  description: string;
  /** Child question slugs, in canonical order. */
  questions: HierarchySlug[];
}

// ─── Level 5: Question ─────────────────────────────────────────────────────────

/**
 * Question relationship contract (P05-T006).
 * A question must resolve to its canonical hierarchy (domain → stack → module).
 */
export interface QuestionEntity {
  readonly slug: HierarchySlug;
  /** Canonical domain slug. */
  domainSlug: HierarchySlug;
  /** Canonical stack slug. */
  stackSlug: HierarchySlug;
  /** Canonical module slug (the immediate parent). */
  moduleSlug: HierarchySlug;
  title: string;
  /** Difficulty: easy | medium | hard. */
  difficulty?: "easy" | "medium" | "hard";
  /** Whether the question is locked (premium/featured). */
  isLocked?: boolean;
}

// ─── Hierarchy path ───────────────────────────────────────────────────────────

/**
 * A fully-resolved path from domain → question (P05-T030).
 * Used for breadcrumbs, canonical URLs, and hierarchy validation.
 */
export interface HierarchyPath {
  domain: DomainEntity;
  stack: StackEntity;
  pillar?: PillarEntity;
  module?: ModuleEntity;
  question?: QuestionEntity;
}

// ─── Breadcrumb crumb ─────────────────────────────────────────────────────────

/**
 * A single breadcrumb segment (P05-T321..T330, consumed by ShellBreadcrumbs).
 */
export interface HierarchyCrumb {
  label: string;
  href: string;
  /** Whether this is the current page (last crumb). */
  current?: boolean;
}

// ─── Validation results ───────────────────────────────────────────────────────

/**
 * Hierarchy validation finding (P05-T031..T036).
 * Detects orphan stacks/pillars/modules, circular relationships, and
 * near-duplicate entities.
 */
export interface HierarchyValidationFinding {
  readonly code:
    | "ORPHAN_STACK"
    | "ORPHAN_PILLAR"
    | "ORPHAN_MODULE"
    | "ORPHAN_QUESTION"
    | "CIRCULAR_REFERENCE"
    | "DUPLICATE_ENTITY"
    | "AMBIGUOUS_PARENT"
    | "MISSING_PARENT";
  severity: "error" | "warning";
  message: string;
  /** The entity slug(s) involved. */
  entities: HierarchySlug[];
}
