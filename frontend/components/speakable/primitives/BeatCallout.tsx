/**
 * BeatCallout — visual-style-guide.md §6.7.
 *
 * Distinct background + 3px left rail. Reserved for the depth-marker
 * beat (lint 7.5.8 enforces "at most one callout per Speakable").
 */

import type { BeatCalloutPayload } from "@/lib/speakable/schema";
import { renderSpeakableInline } from "./SpeakableInline";

interface Props {
  data: BeatCalloutPayload;
}

export function BeatCallout({ data }: Props) {
  return (
    <div className="speakable-beat speakable-callout">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <p className="speakable-body">{renderSpeakableInline(data.text)}</p>
    </div>
  );
}
