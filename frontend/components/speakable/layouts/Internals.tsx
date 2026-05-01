/**
 * Internals — archetype C layout. Phase 1.3.
 *
 * Standard composition. The depth marker lives in `failure_mode`, which
 * the agent typically renders as a `callout` (lint 7.5.8 keeps it to one).
 */

import type { SpeakableC } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

export function Internals({ data }: { data: SpeakableC }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => (
        <BeatDispatch key={i} beat={b} />
      ))}
    </SpeakableShell>
  );
}
