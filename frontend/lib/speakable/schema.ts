/**
 * Structured Speakable v2 — TypeScript types.
 *
 * Authoritative source of truth (kept in lockstep with `scripts/speakable_schema.json`).
 * No functions, no React, no imports — pure type declarations consumed by:
 *   - the renderer (Phase 1) to dispatch by archetype + per-beat layout
 *   - the lint script `audit_speakable.py` (Phase 1) via the JSON Schema sibling
 *   - the TTS serializer (Phase 1) to walk beats with layout-aware reading
 *
 * Plan references:
 *   - SPEAKABLE-PLAN.md §3 (archetype taxonomy)
 *   - SPEAKABLE-PLAN.md §5 (data model)
 *   - SPEAKABLE-PLAN.md §10.3 (per-beat layout primitives)
 *   - SPEAKABLE-PLAN.md §15A.2 (status field, 7 states)
 *
 * Co-locates with `frontend/lib/speakable/toSpeech.ts` (Phase 1.4).
 */

// =====================================================================
// Top-level enums
// =====================================================================

/**
 * The 7 archetypes from SPEAKABLE-PLAN.md §3. Drives required/forbidden
 * beat kinds, per-beat ceilings, depth-marker rule, and renderer layout
 * selection.
 */
export type Archetype = "A" | "B" | "C" | "D" | "E" | "F" | "G";

/**
 * The 12 pillars from SPEAKABLE-PLAN.md §4. Drives the per-pillar
 * register rider applied on top of the archetype rules
 * (see docs/speakable/pillar-register.md).
 */
export type Pillar =
  | "P01" // Java Language & Core
  | "P02" // Spring Ecosystem
  | "P03" // Data & Persistence
  | "P04" // APIs, Microservices & Messaging
  | "P05" // Architecture & Design
  | "P06" // System Design
  | "P07" // Security
  | "P08" // Testing & Quality
  | "P09" // DevOps
  | "P10" // Cloud
  | "P11" // Production
  | "P12"; // Interview Readiness

/**
 * Audience assumption per Speakable. Default `beginner` (locked in §15.4).
 * `familiar` is reserved for P05/P06/P11 by default per `pillar-register.md`;
 * `advanced` is opt-in for staff-level prompts.
 */
export type AudienceAssumption = "beginner" | "familiar" | "advanced";

/**
 * Voice register per Speakable. `friendly` is the default. `neutral` is
 * for scenario/SRE answers; `technical` is reserved for staff-level
 * design / internals where the audience can carry technical density.
 */
export type Voice = "friendly" | "neutral" | "technical";

/**
 * Lifecycle status for the v2. The renderer serves v2 only when
 * `approved`; otherwise it falls back to the legacy markdown
 * `speakable_answer` field. (SPEAKABLE-PLAN.md §14.5 + §15A.2.)
 */
export type SpeakableStatus =
  | "legacy"
  | "pending_review"
  | "approved"
  | "rolled_back"
  | "priority_handcraft"
  | "pending_handcraft"
  | "pending_handcraft_blocked_by_smoke";

// =====================================================================
// Beat kinds — declared per-archetype
// =====================================================================

/**
 * Universal beat kinds — present in every archetype.
 *   - `hook` and `cap` are top-level fields, not entries in `beats[]`,
 *     because the lint and renderer treat them specially (open/close
 *     ceilings, no `layout` choice — they are always single sentences).
 *   - This file enumerates the in-`beats[]` kinds per archetype below.
 */
export type CommonBeatKind = never;

/** Archetype A — Conceptual. (Plan §3 A.) */
export type ArchetypeABeatKind =
  | "definition"
  | "why_exists"
  | "parts_or_states"
  | "how_to_use"
  | "example"
  | "pitfalls";

/** Archetype B — Comparison. (Plan §3 B.) */
export type ArchetypeBBeatKind =
  | "what_each_is"
  | "differences"
  | "when_to_pick"
  | "tiny_example";

/** Archetype C — Internals. (Plan §3 C.) `example` is optional. */
export type ArchetypeCBeatKind =
  | "mental_model"
  | "mechanism"
  | "edge_cases"
  | "failure_mode"
  | "example";

/** Archetype D — Scenario. (Plan §3 D.) `definition` is forbidden. */
export type ArchetypeDBeatKind =
  | "clarify"
  | "hypothesis"
  | "step_by_step"
  | "tools"
  | "tradeoff";

/** Archetype E — Design. (Plan §3 E.) `definition` is forbidden. */
export type ArchetypeEBeatKind =
  | "optimising_for"
  | "options"
  | "tradeoffs"
  | "decision"
  | "rethink_if";

/** Archetype F — System Design / LLD. (Plan §3 F.) Beats are phases. */
export type ArchetypeFBeatKind =
  | "requirements_fr_nfr"
  | "capacity"
  | "api"
  | "data_model"
  | "high_level"
  | "bottleneck_deep_dive"
  | "tradeoffs";

/** Archetype G — Behavioural / STAR. (Plan §3 G.) */
export type ArchetypeGBeatKind =
  | "situation"
  | "task"
  | "action"
  | "result"
  | "reflection";

// =====================================================================
// Layout — per-beat visual / TTS dispatch
// =====================================================================

/**
 * The 7 layout primitives (Plan §10.3). Picks the renderer primitive
 * AND the TTS reading strategy AND the lint payload validation.
 */
export type BeatLayout =
  | "paragraph"
  | "paragraphs"
  | "grouped_paragraphs"
  | "bullets"
  | "ordered_list"
  | "mini_table"
  | "callout";

/** Sub-block in a `grouped_paragraphs` beat (one heading + paragraph). */
export interface BeatGroup {
  heading: string;
  /** ≤ 60 words per the visual rhythm rule (lint 7.5.1). */
  text: string;
}

/** Row in a `mini_table` beat — one axis, one value per column. */
export interface BeatTableRow {
  /** Row label / axis name (e.g. "Memory layout"). */
  axis: string;
  /** One value per column in `BeatMiniTablePayload.columns`; lengths must match. */
  values: string[];
}

// =====================================================================
// Beat payloads — discriminated by `layout`
// =====================================================================

interface BeatPayloadCommon {
  /** Optional sub-heading shown above the beat (eyebrow label). */
  label?: string;
}

/** `layout: paragraph` — one short paragraph (≤ 60 words). */
export interface BeatParagraphPayload extends BeatPayloadCommon {
  layout: "paragraph";
  text: string;
}

/** `layout: paragraphs` — 2–4 short paragraphs, comfortable rhythm. */
export interface BeatParagraphsPayload extends BeatPayloadCommon {
  layout: "paragraphs";
  paragraphs: string[];
}

/** `layout: grouped_paragraphs` — sub-headings + paragraphs. */
export interface BeatGroupedParagraphsPayload extends BeatPayloadCommon {
  layout: "grouped_paragraphs";
  groups: BeatGroup[];
}

/** `layout: bullets` — clean bulleted list. */
export interface BeatBulletsPayload extends BeatPayloadCommon {
  layout: "bullets";
  items: string[];
}

/** `layout: ordered_list` — numbered steps; sequence-implied. */
export interface BeatOrderedListPayload extends BeatPayloadCommon {
  layout: "ordered_list";
  steps: string[];
}

/** `layout: mini_table` — 2- or 3-column comparison table. */
export interface BeatMiniTablePayload extends BeatPayloadCommon {
  layout: "mini_table";
  columns: string[];
  rows: BeatTableRow[];
}

/** `layout: callout` — depth-marker emphasis, distinct background. */
export interface BeatCalloutPayload extends BeatPayloadCommon {
  layout: "callout";
  text: string;
}

/** Discriminated union over all 7 layout payloads. */
export type BeatPayload =
  | BeatParagraphPayload
  | BeatParagraphsPayload
  | BeatGroupedParagraphsPayload
  | BeatBulletsPayload
  | BeatOrderedListPayload
  | BeatMiniTablePayload
  | BeatCalloutPayload;

// =====================================================================
// Beats — per-archetype unions of (kind, payload)
// =====================================================================

/** A beat in an archetype-A Speakable: kind constrained to A's allowed set. */
export type ArchetypeABeat = { kind: ArchetypeABeatKind } & BeatPayload;
export type ArchetypeBBeat = { kind: ArchetypeBBeatKind } & BeatPayload;
export type ArchetypeCBeat = { kind: ArchetypeCBeatKind } & BeatPayload;
export type ArchetypeDBeat = { kind: ArchetypeDBeatKind } & BeatPayload;
export type ArchetypeEBeat = { kind: ArchetypeEBeatKind } & BeatPayload;
export type ArchetypeFBeat = { kind: ArchetypeFBeatKind } & BeatPayload;
export type ArchetypeGBeat = { kind: ArchetypeGBeatKind } & BeatPayload;

/** Any beat across any archetype — used by the renderer's primitive dispatch. */
export type AnyBeat =
  | ArchetypeABeat
  | ArchetypeBBeat
  | ArchetypeCBeat
  | ArchetypeDBeat
  | ArchetypeEBeat
  | ArchetypeFBeat
  | ArchetypeGBeat;

// =====================================================================
// Top-level Speakable shape — discriminated by `archetype`
// =====================================================================

/**
 * Fields shared by every archetype (every Speakable v2 carries them).
 * Required-vs-optional choices encode the lint contract:
 *   - hook / cap / beats — REQUIRED
 *   - followup_handoff — REQUIRED, ≥ 2 items (lint 7.1.7)
 *   - familiarity_anchors / standard_example — REQUIRED (may be empty
 *     when the topic has no codex entry yet, but the field is present)
 *   - tts_overrides — OPTIONAL (omit when no code/symbols need spoken
 *     replacement)
 *   - familiarity_override / familiarity_override_reason — OPTIONAL
 *     (set together when an example deliberately deviates from the
 *     codex's standard example; lint 7.2.2)
 */
export interface SpeakableCommon {
  pillar: Pillar;
  audience_assumption: AudienceAssumption;
  voice: Voice;
  familiarity_anchors: string[];
  standard_example: string;
  /** Opening line. Lint hard cap: 35 words (see word-ceilings.md). */
  hook: string;
  /** Closing line. Lint hard cap: 35 words. */
  cap: string;
  /** ≥ 2 items required by lint 7.1.7. */
  followup_handoff: string[];
  /** Spoken-form replacements applied by the TTS serializer. */
  tts_overrides?: Record<string, string>;
  /** Lifecycle gate the renderer reads (see SpeakableStatus). */
  speakable_status: SpeakableStatus;
  /** Set true to deliberately use a non-standard example. Requires reason. */
  familiarity_override?: boolean;
  familiarity_override_reason?: string;
}

/** Speakable v2 for archetype A — Conceptual. */
export interface SpeakableA extends SpeakableCommon {
  archetype: "A";
  beats: ArchetypeABeat[];
}

/** Speakable v2 for archetype B — Comparison. */
export interface SpeakableB extends SpeakableCommon {
  archetype: "B";
  beats: ArchetypeBBeat[];
}

/** Speakable v2 for archetype C — Internals. */
export interface SpeakableC extends SpeakableCommon {
  archetype: "C";
  beats: ArchetypeCBeat[];
}

/** Speakable v2 for archetype D — Scenario. */
export interface SpeakableD extends SpeakableCommon {
  archetype: "D";
  beats: ArchetypeDBeat[];
}

/** Speakable v2 for archetype E — Design. */
export interface SpeakableE extends SpeakableCommon {
  archetype: "E";
  beats: ArchetypeEBeat[];
}

/** Speakable v2 for archetype F — System Design / LLD. */
export interface SpeakableF extends SpeakableCommon {
  archetype: "F";
  beats: ArchetypeFBeat[];
}

/** Speakable v2 for archetype G — Behavioural / STAR. */
export interface SpeakableG extends SpeakableCommon {
  archetype: "G";
  beats: ArchetypeGBeat[];
}

/**
 * The discriminated union the renderer and lint walk. Switch on
 * `archetype` to narrow to the per-archetype shape (and its allowed
 * beat kinds).
 */
export type SpeakableV2 =
  | SpeakableA
  | SpeakableB
  | SpeakableC
  | SpeakableD
  | SpeakableE
  | SpeakableF
  | SpeakableG;

// =====================================================================
// Co-existence with the legacy markdown shape
// =====================================================================

/**
 * The legacy section type that has lived in `complete-qa.json` since
 * inception. Kept here as a type alias so the renderer's discriminator
 * can branch (`legacy` markdown vs `v2` structured) without importing
 * a separate file. Plan §14.1 (side-by-side coexistence).
 */
export interface SpeakableLegacy {
  type: "speakable_answer";
  title?: string;
  content: string;
}

/** Helper union for the renderer: "either v2 structured or legacy markdown". */
export type SpeakableEither =
  | { kind: "v2"; v2: SpeakableV2 }
  | { kind: "legacy"; legacy: SpeakableLegacy };
