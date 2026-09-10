/**
 * question-types.ts — Canonical question data contract (P06-T041..T060).
 *
 * The single V2 contract for a question page's data. Wraps the existing
 * QuestionPagePayload (from content-reader) behind a clean, typed shape that
 * the question page architecture consumes. No question page reaches into
 * content-reader directly (P06-T041/T042 — single canonical data source).
 *
 * Design (P06-T041..T060):
 *   - Every question resolves to its canonical hierarchy (P06-T046).
 *   - The answer is a structured list of sections (P06-T120..T125).
 *   - Metadata is simplified: difficulty, company tags, related/follow-up
 *     (P06-T201..T210).
 *   - Prev/next and related questions are resolved by the data layer, not
 *     the component (P06-T241..T260).
 */

// ─── Question identity ────────────────────────────────────────────────────────

export interface QuestionIdentity {
  slug: string;
  title: string;
  /** Canonical hierarchy path. */
  domainSlug: string;
  stackSlug: string;
  moduleSlug: string;
}

// ─── Answer section (P06-T120..T125) ──────────────────────────────────────────

/**
 * A single section of an answer. The answer renderer iterates these in order.
 * Each section maps to a Phase 01 content primitive (CodeBlock, Callout,
 * TableWrapper, Prose).
 */
export interface AnswerSection {
  readonly id: string;
  /** Section type — drives which renderer is used. */
  readonly type:
    | "prose"
    | "code"
    | "callout"
    | "table"
    | "figure"
    | "heading";
  /** Heading text (for type="heading"). */
  heading?: string;
  /** Heading level (2-4). Defaults to 2. */
  level?: 2 | 3 | 4;
  /** Prose/markdown content (for type="prose"). */
  content?: string;
  /** Code content (for type="code"). */
  code?: string;
  /** Code language (for type="code"). */
  language?: string;
  /** Callout variant (for type="callout"). */
  calloutVariant?: "note" | "tip" | "warning" | "example" | "takeaway";
  /** Callout title (for type="callout"). */
  calloutTitle?: string;
  /** Table headers (for type="table"). */
  tableHeaders?: string[];
  /** Table rows (for type="table"). */
  tableRows?: string[][];
  /** Figure src/alt (for type="figure"). */
  figureSrc?: string;
  figureAlt?: string;
  figureCaption?: string;
}

// ─── Question metadata (P06-T201..T210) ───────────────────────────────────────

export interface QuestionMetadata {
  difficulty?: "easy" | "medium" | "hard";
  /** Company tags (simplified — no more than 5). */
  companies?: string[];
  /** Estimated read time in minutes. */
  readTimeMinutes?: number;
  /** Whether this question is locked/premium. */
  isLocked?: boolean;
  /** Last updated date (ISO). */
  updatedAt?: string;
}

// ─── Related & follow-up (P06-T241..T260) ─────────────────────────────────────

export interface RelatedQuestion {
  slug: string;
  title: string;
  href: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface FollowUpQuestion {
  slug: string;
  title: string;
  href: string;
}

// ─── Prev/next (P06-T221..T240) ───────────────────────────────────────────────

export interface PrevNextNav {
  prev?: RelatedQuestion;
  next?: RelatedQuestion;
}

// ─── Full question page data (P06-T041) ──────────────────────────────────────

export interface QuestionPageData {
  identity: QuestionIdentity;
  /** The question text shown in the header. */
  question: string;
  /** Structured answer sections, in order. */
  sections: AnswerSection[];
  /** Simplified metadata. */
  metadata: QuestionMetadata;
  /** Previous/next navigation within the module. */
  prevNext: PrevNextNav;
  /** Related questions (same module/stack). */
  related: RelatedQuestion[];
  /** Follow-up questions (deeper exploration). */
  followUps: FollowUpQuestion[];
  /** Breadcrumb crumbs. */
  breadcrumbs: Array<{ label: string; href: string }>;
}

// ─── Loading/error states (P06-T601..T630) ────────────────────────────────────

export type QuestionPageState =
  | { status: "loading" }
  | { status: "error"; code: "not-found" | "server-error"; message?: string }
  | { status: "ready"; data: QuestionPageData };
