/**
 * BeatParagraph — visual-style-guide.md §6.1.
 *
 * Renders one short body paragraph (≤ 60 words enforced by lint 7.5.1).
 * Eyebrow `label` is rendered when present; otherwise omitted.
 *
 * Styling rules: tokens only (no hard-coded HEX, no ad-hoc margins).
 * Spacing comes from speakable.css (.speakable-beat) and the wrapping
 * archetype layout adds the inter-beat margin.
 */

import type { BeatParagraphPayload } from "@/lib/speakable/schema";

interface Props {
  data: BeatParagraphPayload;
}

export function BeatParagraph({ data }: Props) {
  return (
    <div className="speakable-beat">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <p className="speakable-body">{data.text}</p>
    </div>
  );
}
