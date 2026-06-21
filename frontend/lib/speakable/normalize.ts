/**
 * normalizeSpeakableV2 — defensive coercion of raw `speakable_v2` JSON into
 * the canonical {@link SpeakableV2} shape the renderer/primitives expect.
 *
 * The content tree accumulated several generations of the speakable_v2 beat
 * schema (some beats carry `text`, others `content`; some omit `layout`;
 * tables use `columns`/`rows` or `headers`/`rows` or a nested `content`
 * object; lists use `items` or `content`; etc.). The primitives are strict
 * (e.g. `BeatBullets` reads `data.items.map`), so any drift crashes the page.
 *
 * This normalizer runs at the render boundary (Speakable.tsx) and maps every
 * known variant onto the canonical fields, inferring `layout` when missing
 * and falling back to a paragraph rather than throwing. It is intentionally
 * permissive: bad data degrades to readable text, never a runtime error.
 */

import type {
  AnyBeat,
  Archetype,
  BeatLayout,
  SpeakableV2,
} from "./schema";

type Raw = Record<string, unknown>;

function isObj(v: unknown): v is Raw {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Flatten any value into a single display string. */
function asText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join("\n\n");
  if (isObj(v)) return asText(v.text ?? v.content ?? v.body ?? v.value ?? "");
  return "";
}

/** Coerce any value into a clean list of non-empty strings. */
function asTextArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) {
    return v.map((x) => (typeof x === "string" ? x.trim() : asText(x))).filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(/\r?\n+/)
      .map((s) => s.replace(/^\s*[-*•]\s+/, "").trim())
      .filter(Boolean);
  }
  if (isObj(v)) return [asText(v)];
  return [];
}

const LAYOUTS = new Set<BeatLayout>([
  "paragraph",
  "paragraphs",
  "grouped_paragraphs",
  "bullets",
  "ordered_list",
  "mini_table",
  "callout",
]);

function inferLayout(b: Raw): BeatLayout {
  if (typeof b.layout === "string" && LAYOUTS.has(b.layout as BeatLayout)) {
    return b.layout as BeatLayout;
  }
  const content = isObj(b.content) ? (b.content as Raw) : undefined;
  if (
    b.columns ||
    b.headers ||
    b.rows ||
    content?.columns ||
    content?.headers ||
    content?.rows
  ) {
    return "mini_table";
  }
  if (b.groups) return "grouped_paragraphs";
  if (b.steps) return "ordered_list";
  if (b.items) return "bullets";
  if (b.paragraphs) return "paragraphs";
  return "paragraph";
}

function normalizeGroups(v: unknown): { heading: string; text: string }[] {
  const arr = Array.isArray(v) ? v : v == null ? [] : [v];
  return arr
    .map((g) => {
      if (isObj(g)) {
        return {
          heading: asText(g.heading ?? g.label ?? g.title ?? ""),
          text: asText(g.text ?? g.content ?? g.body ?? ""),
        };
      }
      return { heading: "", text: asText(g) };
    })
    .filter((g) => g.heading || g.text);
}

function normalizeTable(b: Raw): {
  columns: string[];
  rows: { axis: string; values: string[] }[];
} {
  const content = isObj(b.content) ? (b.content as Raw) : undefined;
  const rawCols = b.columns ?? b.headers ?? content?.columns ?? content?.headers;
  const rawRows = b.rows ?? content?.rows;

  let columns = Array.isArray(rawCols) ? rawCols.map(asText) : [];
  const rowsArr = Array.isArray(rawRows) ? rawRows : [];

  const rows = rowsArr.map((r) => {
    if (Array.isArray(r)) {
      return { axis: asText(r[0]), values: r.slice(1).map(asText) };
    }
    if (isObj(r)) {
      if ("axis" in r || "values" in r) {
        return {
          axis: asText(r.axis),
          values: Array.isArray(r.values) ? r.values.map(asText) : [],
        };
      }
      const vals = Object.values(r).map(asText);
      return { axis: asText(vals[0]), values: vals.slice(1) };
    }
    return { axis: asText(r), values: [] };
  });

  // When rows arrive as flat arrays, the first column header is the axis
  // label — drop it so the remaining headers line up with `values`.
  const firstRaw = rowsArr[0];
  if (Array.isArray(firstRaw) && columns.length === firstRaw.length && columns.length > 0) {
    columns = columns.slice(1);
  }

  return { columns, rows };
}

function normalizeBeat(raw: unknown): AnyBeat {
  const b = isObj(raw) ? raw : {};
  const layout = inferLayout(b);

  const kind =
    typeof b.kind === "string"
      ? b.kind
      : typeof b.type === "string"
        ? b.type
        : undefined;
  const label =
    typeof b.label === "string"
      ? b.label
      : typeof b.heading === "string" && layout !== "grouped_paragraphs"
        ? b.heading
        : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: any = { kind, layout };
  if (label) out.label = label;

  switch (layout) {
    case "paragraph":
    case "callout":
      out.text = asText(b.text ?? b.content ?? b.body);
      break;
    case "paragraphs": {
      const p = b.paragraphs ?? b.content ?? b.text;
      out.paragraphs = Array.isArray(p)
        ? p.map(asText).filter(Boolean)
        : asTextArray(p);
      if (out.paragraphs.length === 0) {
        out.layout = "paragraph";
        out.text = asText(b.content ?? b.text);
      }
      break;
    }
    case "bullets":
      out.items = asTextArray(b.items ?? b.content ?? b.bullets);
      if (out.items.length === 0) {
        out.layout = "paragraph";
        out.text = asText(b.content);
      }
      break;
    case "ordered_list":
      out.steps = asTextArray(b.steps ?? b.items ?? b.content);
      if (out.steps.length === 0) {
        out.layout = "paragraph";
        out.text = asText(b.content);
      }
      break;
    case "grouped_paragraphs":
      out.groups = normalizeGroups(b.groups ?? b.items ?? b.content);
      if (out.groups.length === 0) {
        out.layout = "paragraph";
        out.text = asText(b.content);
      }
      break;
    case "mini_table": {
      const t = normalizeTable(b);
      out.columns = t.columns;
      out.rows = t.rows;
      if (out.rows.length === 0) {
        out.layout = "paragraph";
        out.text = asText(b.content);
      }
      break;
    }
  }

  return out as AnyBeat;
}

/**
 * Coerce a raw `speakable_v2` object into a renderable {@link SpeakableV2}.
 * Returns null when the input isn't an object at all.
 */
export function normalizeSpeakableV2(raw: unknown): SpeakableV2 | null {
  if (!isObj(raw)) return null;

  const archetype = (
    typeof raw.archetype === "string" ? raw.archetype : "A"
  ) as Archetype;
  const beatsRaw = Array.isArray(raw.beats) ? raw.beats : [];
  const followup = asTextArray(
    raw.followup_handoff ?? raw.followup_questions ?? raw.followups
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v2: any = {
    ...raw,
    archetype,
    hook: asText(raw.hook),
    cap: asText(raw.cap),
    beats: beatsRaw.map(normalizeBeat),
    followup_handoff: followup,
    speakable_status:
      typeof raw.speakable_status === "string"
        ? raw.speakable_status
        : "pending_review",
  };

  return v2 as SpeakableV2;
}
