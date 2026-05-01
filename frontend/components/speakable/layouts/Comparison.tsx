/**
 * Comparison — archetype B layout. Phase 1.3.
 *
 * Standard composition. Lint 7.5.3 mandates that `differences` with 3+
 * axes uses mini_table — the renderer trusts the data and dispatches.
 */

import type { SpeakableB } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

export function Comparison({ data }: { data: SpeakableB }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => (
        <BeatDispatch key={i} beat={b} />
      ))}
    </SpeakableShell>
  );
}
