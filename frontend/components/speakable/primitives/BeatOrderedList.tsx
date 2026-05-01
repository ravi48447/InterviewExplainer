/**
 * BeatOrderedList — visual-style-guide.md §6.5.
 *
 * Numbered list with a small mono number chip in `--speakable-muted`.
 * The optional `withRail` prop draws the faint left rail used by
 * archetype D's `step_by_step` beat (per visual-style-guide.md §6.5
 * sketch and Phase 1.3 archetype tweaks). All other archetypes omit
 * the rail.
 */

import type { BeatOrderedListPayload } from "@/lib/speakable/schema";

interface Props {
  data: BeatOrderedListPayload;
  withRail?: boolean;
}

export function BeatOrderedList({ data, withRail }: Props) {
  return (
    <div className="speakable-beat">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <ol
        className={
          "speakable-ordered" + (withRail ? " speakable-ordered--rail" : "")
        }
      >
        {data.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
