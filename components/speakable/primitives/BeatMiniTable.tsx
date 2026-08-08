/**
 * BeatMiniTable — visual-style-guide.md §6.6.
 *
 * Compact 2- or 3-column comparison table. Sticky header on long pages.
 * On `< 640px` (visual-style-guide.md §7) the table collapses to
 * stacked cards: one card per row with axis-name as the card title and
 * `column-name: value` rows underneath. The collapse is CSS-only via
 * `speakable.css` media-queries — both renderings are emitted; only one
 * is visible at a time.
 */

import type { BeatMiniTablePayload } from "@/lib/speakable/schema";
import { renderSpeakableInline } from "./SpeakableInline";

interface Props {
  data: BeatMiniTablePayload;
}

export function BeatMiniTable({ data }: Props) {
  return (
    <div className="speakable-beat">
      {data.label ? <p className="speakable-eyebrow">{data.label}</p> : null}
      <div className="speakable-table-wrapper">
        <table className="speakable-table">
          <thead>
            <tr>
              <th className="speakable-axis-cell">Axis</th>
              {data.columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i}>
                <td className="speakable-axis-cell">{renderSpeakableInline(r.axis)}</td>
                {r.values.map((v, j) => (
                  <td key={j}>{renderSpeakableInline(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="speakable-table-cards" aria-hidden="false">
        {data.rows.map((r, i) => (
          <div key={i} className="speakable-table-card">
            <div className="speakable-table-card-axis">{renderSpeakableInline(r.axis)}</div>
            {r.values.map((v, j) => (
              <div key={j} className="speakable-table-card-row">
                <span className="speakable-table-card-row-key">
                  {data.columns[j] ?? `Column ${j + 1}`}
                </span>
                <span>{renderSpeakableInline(v)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
