/**
 * Conceptual — archetype A layout. Phase 1.3.
 *
 * Beats render in `beats[]` order via BeatDispatch. No archetype-specific
 * tweak (visual-style-guide.md §6 + Phase 1 prompt §11.3 list nothing
 * special for A — it's the baseline composition).
 */

import type { SpeakableA } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

export function Conceptual({ data }: { data: SpeakableA }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => (
        <BeatDispatch key={i} beat={b} />
      ))}
    </SpeakableShell>
  );
}
