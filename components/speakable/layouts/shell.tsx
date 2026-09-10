/**
 * Speakable shell — Phase 1.3.
 *
 * Shared chrome each archetype layout wraps around its beats:
 *   - Hook (typography role `hook`)
 *   - <slot> for the per-archetype beat composition
 *   - Cap (typography role `cap`, italic)
 *   - followup_handoff chip row, label "Likely follow-ups"
 *
 * Spacing / type tokens come from speakable.css. No archetype-specific
 * styling lives here — that goes in each layout component.
 */

import type { ReactNode } from "react";
import type { SpeakableV2 } from "@/lib/speakable/schema";
import { renderSpeakableInline } from "@/components/speakable/primitives/SpeakableInline";

interface Props {
  data: SpeakableV2;
  children: ReactNode;
}

export function SpeakableShell({ data, children }: Props) {
  return (
    <div className="speakable-shell">
      <p className="speakable-hook">{renderSpeakableInline(data.hook)}</p>
      <div className="speakable-beats">{children}</div>
      <p className="speakable-cap">{renderSpeakableInline(data.cap)}</p>
      {data.followup_handoff.length > 0 ? (
        <div className="speakable-followups">
          <p className="speakable-followups-label">Likely follow-ups</p>
          <ul className="speakable-followups-list">
            {data.followup_handoff.map((q, i) => (
              <li key={i} className="speakable-followups-chip">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
