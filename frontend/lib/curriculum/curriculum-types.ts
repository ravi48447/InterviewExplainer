/**
 * Phase 14 — Curriculum V2 canonical types.
 *
 * Types for the interview language-track hierarchy:
 *   /interview                          → all-languages hub
 *   /interview/:lang                    → language hub (tracks)
 *   /interview/:lang/:track             → track hub (levels)
 *   /interview/:lang/:track/:level      → level hub (stacks)
 *   /interview/:lang/:track/:level/:stack        → stack (questions list)
 *   /interview/:lang/:track/:level/:stack/:slug  → question detail
 *
 * Plus standalone "coming soon" role pages under /interview (ruby,
 * business-analyst, data-analyst).
 */

import type { Level } from "@/lib/contentV2-types";

/** Level display metadata used across the hub pages. */
export interface LevelMeta {
  label: string;
  range: string;
  color: string;
  colorClass: string;
}

/** A stack preview row on the level page. */
export interface StackPreviewData {
  slug: string;
  name: string;
  description: string | null;
  questionCount: number;
  /** First few questions for inline preview. */
  questions: StackPreviewQuestion[];
}

export interface StackPreviewQuestion {
  slug: string;
  title: string;
  difficulty: string;
  estimatedReadTime?: number;
}

/** Payload for the /interview all-languages hub. */
export interface InterviewHubLangData {
  lang: string;
  tracks: {
    track: string;
    levels: { level: Level; stackCount: number; questionCount: number }[];
    totalStacks: number;
    totalQs: number;
  }[];
  totalStacks: number;
  totalQs: number;
}

/** A track card on the language hub. */
export interface LangTrackRef {
  slug: string;
  name: string;
  iconKey: string;
  desc: string;
  stacks: string;
}

/** Payload for /interview/:lang. */
export interface LangHubData {
  lang: string;
  name: string;
  tracks: LangTrackRef[];
}

/** Payload for /interview/:lang/:track (level cards). */
export interface TrackHubData {
  lang: string;
  track: string;
  langTitle: string;
  trackTitle: string;
  levels: { key: string; meta: LevelMeta; stacks: string[]; domainSlug: string }[];
}

/** Payload for /interview/:lang/:track/:level. */
export interface LevelHubData {
  lang: string;
  track: string;
  level: Level;
  meta: LevelMeta;
  stacks: StackPreviewData[];
  totalQuestions: number;
  availableLevels: Level[];
}

/** Payload for /interview/:lang/:track/:level/:stack. */
export interface StackHubData {
  lang: string;
  track: string;
  level: Level;
  stack: string;
  stackName: string;
  description: string | null;
  questions: StackPreviewQuestion[];
  lvlMeta: LevelMeta;
}

/** A standalone "coming soon" role/topic card. */
export interface ComingSoonTopic {
  name: string;
  emoji?: string;
  desc: string;
}

/** Payload for a standalone role page (ruby / business-analyst / data-analyst). */
export interface RolePageData {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  topics: ComingSoonTopic[];
  accent: "rose" | "amber" | "teal";
}
