/**
 * Scenario — archetype D layout. Phase 1.3.
 *
 * Tweak (Phase 1 prompt §11.3.D): `step_by_step` ordered_list gets a
 * faint left rail connector. The dispatch flips `withRail` for that beat.
 */

import type { SpeakableD } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

export function Scenario({ data }: { data: SpeakableD }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => (
        <BeatDispatch
          key={i}
          beat={b}
          withOrderedRail={b.kind === "step_by_step"}
        />
      ))}
    </SpeakableShell>
  );
}
