/**
 * Phase 13 — Topics V2 canonical types.
 *
 * Types for the cross-language technical-concepts hub (/topics) and the
 * per-concept detail page (/topics/:concept). Hoisted from the inline data
 * that previously lived inside app/topics/page.tsx and
 * app/topics/[concept]/page.tsx.
 */

/** Lucide icon key — a stable string token mapping to a lucide icon. */
export type TopicIconKey =
  | "network"
  | "layers"
  | "git-branch"
  | "radio"
  | "puzzle"
  | "target"
  | "database"
  | "cpu"
  | "globe"
  | "workflow"
  | "shield"
  | "eye"
  | "terminal"
  | "check-circle"
  | "gauge"
  | "book-open";

/** A single topic card on the topics hub. */
export interface TopicCardData {
  slug: string;
  name: string;
  iconKey: TopicIconKey;
  /** Tailwind color classes, e.g. "text-emerald-600 dark:text-emerald-400". */
  color: string;
  /** Tailwind bg classes for the icon chip, e.g. "bg-emerald-100 dark:bg-emerald-950/30". */
  bg: string;
  desc: string;
  subtopics: string[];
  /** Interview frequency label: "Very High" | "High" | "Medium". */
  frequency: string;
}

/** A grouping of topic cards on the hub. */
export interface TopicCategory {
  title: string;
  desc: string;
  topics: TopicCardData[];
}

/** Cross-link to a structured interview track from a concept detail page. */
export interface TopicTrackRef {
  lang: string;
  track: string;
  level: string;
  stack: string;
  label: string;
}

/** Metadata for a per-concept detail page. */
export interface TopicConceptMeta {
  name: string;
  desc: string;
  tracks: TopicTrackRef[];
  tools?: string[];
  comparisons?: string[];
}

/** Payload for the /topics/:concept page. */
export interface TopicConceptPageData {
  concept: string;
  name: string;
  meta: TopicConceptMeta | null;
}
