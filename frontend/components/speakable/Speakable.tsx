/**
 * Speakable — unified renderer entry point. Phase 1.4.
 *
 * Single source of truth for "render the Speakable for this question".
 * Switches on `source.kind`:
 *   - `v2` + `speakable_status === "approved"` → per-archetype layout
 *     from LayoutFor[archetype]. Exhaustive narrowing via TS `never`.
 *   - everything else → Legacy markdown fallback (the §14.5 contract:
 *     v2 only renders when explicitly approved; until then the legacy
 *     blob remains the source of truth).
 *
 * The optional `legacyVariant` prop drives Legacy.tsx's variant choice
 * when falling back. Default is "question" to match the existing
 * QuestionPageLayout green-card output.
 *
 * The Phase 1.8 admin review UI uses `forceV2` to render the v2
 * preview side-by-side with the legacy even before approval. Production
 * call sites (1.9 integration) never set this flag.
 */

"use client";

import "@/components/speakable/speakable.css";
import type { SpeakableEither, SpeakableV2 } from "@/lib/speakable/schema";
import { Legacy, type LegacyVariant } from "./Legacy";
import { LayoutFor } from "./layouts";

export interface SpeakableProps {
  source: SpeakableEither;
  /** Pass through to Legacy when the wrapper falls through. */
  legacyVariant?: LegacyVariant;
  /** Question id forwarded to the legacy question-card variant. */
  questionId?: string | number;
  /** Read time chip on the legacy question-card variant. */
  readTime?: number;
  /** Admin / dev preview only — render v2 even when not approved. */
  forceV2?: boolean;
  /** Optional theme override (defaults to inheriting the wrapping theme). */
  theme?: "light" | "dark";
}

export function Speakable({
  source,
  legacyVariant,
  questionId,
  readTime,
  forceV2,
  theme,
}: SpeakableProps) {
  if (source.kind === "v2") {
    const approved = source.v2.speakable_status === "approved";
    if (approved || forceV2) {
      return (
        <div className="speakable-prose" data-theme={theme}>
          <RenderV2 v2={source.v2} />
        </div>
      );
    }
    return null;
  }
  return (
    <Legacy
      data={source.legacy}
      variant={legacyVariant}
      questionId={questionId}
      readTime={readTime}
    />
  );
}

/**
 * Exhaustive switch on `archetype`. The `never` arm is the TS contract
 * that any future archetype (none planned beyond A-G per §3) gets a
 * compile error here until LayoutFor is extended.
 */
function RenderV2({ v2 }: { v2: SpeakableV2 }) {
  switch (v2.archetype) {
    case "A": {
      const Layout = LayoutFor.A;
      return <Layout data={v2} />;
    }
    case "B": {
      const Layout = LayoutFor.B;
      return <Layout data={v2} />;
    }
    case "C": {
      const Layout = LayoutFor.C;
      return <Layout data={v2} />;
    }
    case "D": {
      const Layout = LayoutFor.D;
      return <Layout data={v2} />;
    }
    case "E": {
      const Layout = LayoutFor.E;
      return <Layout data={v2} />;
    }
    case "F": {
      const Layout = LayoutFor.F;
      return <Layout data={v2} />;
    }
    case "G": {
      const Layout = LayoutFor.G;
      return <Layout data={v2} />;
    }
    default: {
      const _exhaustive: never = v2;
      return <span data-unknown-archetype={String((_exhaustive as SpeakableV2).archetype)} />;
    }
  }
}
