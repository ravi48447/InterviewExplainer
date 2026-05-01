/**
 * SystemDesign — archetype F layout. Phase 1.3.
 *
 * Tweak (Phase 1 prompt §11.3.F): each phase renders inside its own
 * labeled block with a clear section break (top divider). The eyebrow
 * label comes from the agent's beat `label`; if unset, the beat kind
 * is title-cased into a default phase name.
 */

import type { SpeakableF, ArchetypeFBeat } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

const PHASE_LABEL: Record<ArchetypeFBeat["kind"], string> = {
  requirements_fr_nfr: "Requirements",
  capacity: "Capacity",
  api: "API",
  data_model: "Data model",
  high_level: "High-level design",
  bottleneck_deep_dive: "Deep dive",
  tradeoffs: "Trade-offs",
};

export function SystemDesign({ data }: { data: SpeakableF }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => (
        <section key={i} className="speakable-phase-block">
          <p className="speakable-phase-label">
            {b.label ?? PHASE_LABEL[b.kind]}
          </p>
          <BeatDispatch beat={b} />
        </section>
      ))}
    </SpeakableShell>
  );
}
