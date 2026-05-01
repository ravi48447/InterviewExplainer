/**
 * BeatBullets — visual-style-guide.md §6.4.
 *
 * Clean bulleted list (3+ short, parallel items). The disc bullet is the
 * only mark — no decorative glyphs. Inter-item spacing is `--space-2`.
 */

import type { BeatBulletsPayload } from "@/lib/speakable/schema";

interface Props {
  data: BeatBulletsPayload;
}

export function BeatBullets({ data }: Props) {
  return (
    <div className="speakable-beat">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <ul className="speakable-bullets">
        {data.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
