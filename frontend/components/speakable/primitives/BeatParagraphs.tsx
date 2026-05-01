/**
 * BeatParagraphs — visual-style-guide.md §6.2.
 *
 * Renders 2–4 short paragraphs in a comfortable rhythm. Each paragraph
 * stays at body type. Per-paragraph margin-top is `--space-3`
 * (speakable.css `.speakable-paragraphs > p + p`).
 */

import type { BeatParagraphsPayload } from "@/lib/speakable/schema";

interface Props {
  data: BeatParagraphsPayload;
}

export function BeatParagraphs({ data }: Props) {
  return (
    <div className="speakable-beat speakable-paragraphs">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      {data.paragraphs.map((p, i) => (
        <p key={i} className="speakable-body">
          {p}
        </p>
      ))}
    </div>
  );
}
