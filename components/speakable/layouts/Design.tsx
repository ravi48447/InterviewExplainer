/**
 * Design — archetype E layout. Phase 1.3.
 *
 * Tweak (Phase 1 prompt §11.3.E): the `options` beat (which uses
 * `grouped_paragraphs`) renders side-by-side as cards on desktop and
 * stacks on mobile. The grid is applied via the
 * `speakable-options-grid` wrapper class (speakable.css extension).
 */

import type { SpeakableE } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

export function Design({ data }: { data: SpeakableE }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => {
        if (b.kind === "options" && b.layout === "grouped_paragraphs") {
          return (
            <div key={i} className="speakable-options-grid">
              <BeatDispatch beat={b} />
            </div>
          );
        }
        return <BeatDispatch key={i} beat={b} />;
      })}
    </SpeakableShell>
  );
}
