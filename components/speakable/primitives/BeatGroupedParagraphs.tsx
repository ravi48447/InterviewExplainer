/**
 * BeatGroupedParagraphs — visual-style-guide.md §6.3.
 *
 * Sub-headings + paragraphs. Each group renders as a small block with a
 * 1px top divider (`--speakable-divider`) — first group has no divider.
 */

import type { BeatGroupedParagraphsPayload } from "@/lib/speakable/schema";
import { renderSpeakableInline } from "./SpeakableInline";

interface Props {
  data: BeatGroupedParagraphsPayload;
}

export function BeatGroupedParagraphs({ data }: Props) {
  return (
    <div className="speakable-beat">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <div className="speakable-grouped">
        {data.groups.map((g, i) => (
          <section key={i} className="speakable-grouped-item">
            <h4 className="speakable-subheading">{renderSpeakableInline(g.heading)}</h4>
            <p className="speakable-body">{renderSpeakableInline(g.text)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
