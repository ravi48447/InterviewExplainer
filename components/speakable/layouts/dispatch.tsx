/**
 * Per-beat layout dispatch — Phase 1.3.
 *
 * Walks `beats[]` of a Speakable v2 and renders each beat with the
 * primitive matching its `layout` field. Strict types — the runtime
 * switch is also a TS exhaustiveness check on `BeatLayout`.
 *
 * Per Phase 1 prompt §11 archetype tweak: archetype D's `step_by_step`
 * beat gets the `withRail` variant of `BeatOrderedList`. The `withRail`
 * decision is the one place the dispatch reads `beat.kind` directly.
 */

import type {
  AnyBeat,
  BeatBulletsPayload,
  BeatCalloutPayload,
  BeatGroupedParagraphsPayload,
  BeatMiniTablePayload,
  BeatOrderedListPayload,
  BeatParagraphPayload,
  BeatParagraphsPayload,
} from "@/lib/speakable/schema";
import {
  BeatBullets,
  BeatCallout,
  BeatGroupedParagraphs,
  BeatMiniTable,
  BeatOrderedList,
  BeatParagraph,
  BeatParagraphs,
} from "@/components/speakable/primitives";

export interface DispatchProps {
  beat: AnyBeat;
  /** When true, ordered_list beats render with the faint left rail. */
  withOrderedRail?: boolean;
}

/*
 * AnyBeat = ({kind} & BeatPayload). TS doesn't narrow through the
 * intersection cleanly when switching on `beat.layout`, so we narrow
 * explicitly with one helper per layout. Each helper is a structural
 * test that mirrors the schema's discriminator.
 */

function isParagraph(b: AnyBeat): b is AnyBeat & BeatParagraphPayload {
  return b.layout === "paragraph";
}
function isParagraphs(b: AnyBeat): b is AnyBeat & BeatParagraphsPayload {
  return b.layout === "paragraphs";
}
function isGroupedParagraphs(
  b: AnyBeat,
): b is AnyBeat & BeatGroupedParagraphsPayload {
  return b.layout === "grouped_paragraphs";
}
function isBullets(b: AnyBeat): b is AnyBeat & BeatBulletsPayload {
  return b.layout === "bullets";
}
function isOrderedList(b: AnyBeat): b is AnyBeat & BeatOrderedListPayload {
  return b.layout === "ordered_list";
}
function isMiniTable(b: AnyBeat): b is AnyBeat & BeatMiniTablePayload {
  return b.layout === "mini_table";
}
function isCallout(b: AnyBeat): b is AnyBeat & BeatCalloutPayload {
  return b.layout === "callout";
}

export function BeatDispatch({ beat, withOrderedRail }: DispatchProps) {
  if (isParagraph(beat)) return <BeatParagraph data={beat} />;
  if (isParagraphs(beat)) return <BeatParagraphs data={beat} />;
  if (isGroupedParagraphs(beat)) return <BeatGroupedParagraphs data={beat} />;
  if (isBullets(beat)) return <BeatBullets data={beat} />;
  if (isOrderedList(beat))
    return <BeatOrderedList data={beat} withRail={withOrderedRail} />;
  if (isMiniTable(beat)) return <BeatMiniTable data={beat} />;
  if (isCallout(beat)) return <BeatCallout data={beat} />;
  // Schema validation should keep us from here. Fail loud in dev.
  return <span data-unknown-layout={String((beat as AnyBeat).layout)} />;
}
