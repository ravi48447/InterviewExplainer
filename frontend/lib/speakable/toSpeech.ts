/**
 * Speakable v2 → TTS-clean string. Phase 1.5.
 *
 * Pure function. Walks a SpeakableV2 in beat order (hook → beats → cap)
 * and produces a single string suitable for SpeechSynthesisUtterance.
 *
 * Per-layout reading rules from docs/speakable/visual-style-guide.md
 * §6.x and docs/speakable/lint-rules.md §7.7. The Python lint script
 * (scripts/audit_speakable.py `to_speech_text`) is a 1:1 port of this
 * file; keep the two in sync if you change either.
 *
 * Pipeline:
 *   1. Per-beat serialization — layout-aware
 *   2. Joined with ". " sentence pauses
 *   3. tts_overrides (literal substring substitutions)
 *   4. Markdown strip — `bold`, _italic_, `code`
 *   5. Symbol normalisation — `==` → "double equals", etc.
 *   6. Whitespace collapse
 */

import type {
  AnyBeat,
  BeatBulletsPayload,
  BeatCalloutPayload,
  BeatGroupedParagraphsPayload,
  BeatMiniTablePayload,
  BeatOrderedListPayload,
  BeatParagraphPayload,
  BeatParagraphsPayload,
  SpeakableV2,
} from "./schema";

const SEQUENCE_WORDS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "next",
  "then",
  "finally",
] as const;

const SYMBOL_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/(?<![\w!])==(?![=\w])/g, " double equals "],
  [/(?<![\w<>])!=(?![=\w])/g, " not equals "],
  [/(?<![\w<>=-])->(?![\w-])/g, " to "],
  [/(?<![\w=])=>(?![\w=])/g, " becomes "],
  [/(?<![\w&])&&(?![&\w])/g, " and "],
  [/(?<![\w|])\|\|(?![|\w])/g, " or "],
  [/(?<![\w<])<(?![=\w<])/g, " less than "],
  [/(?<![\w>])>(?![=\w>])/g, " greater than "],
];

/**
 * Serialise an entire Speakable v2 to a TTS-ready string.
 *
 * Pure — no side effects. Safe to call repeatedly.
 */
export function toSpeech(v2: SpeakableV2): string {
  const parts: string[] = [];
  const hook = (v2.hook ?? "").trim();
  if (hook) parts.push(hook);
  for (const beat of v2.beats ?? []) {
    const piece = serializeBeat(beat);
    if (piece) parts.push(piece);
  }
  const cap = (v2.cap ?? "").trim();
  if (cap) parts.push(cap);

  let raw = parts.map((p) => p.replace(/\.+$/, "")).filter(Boolean).join(". ") + ".";

  const overrides = v2.tts_overrides ?? {};
  for (const [src, dst] of Object.entries(overrides)) {
    if (!src) continue;
    raw = raw.split(src).join(dst);
  }

  raw = stripMarkdown(raw);
  for (const [pat, repl] of SYMBOL_REPLACEMENTS) {
    raw = raw.replace(pat, repl);
  }
  raw = raw.replace(/\s+/g, " ").trim();
  return raw;
}

function serializeBeat(beat: AnyBeat): string {
  const label = (beat.label ?? "").trim();
  const prefix = label ? `${label}: ` : "";
  switch (beat.layout) {
    case "paragraph":
    case "callout":
      return prefix + serializeParagraphLike(beat);
    case "paragraphs":
      return prefix + serializeParagraphs(beat);
    case "grouped_paragraphs":
      return prefix + serializeGrouped(beat);
    case "bullets":
      return prefix + serializeBullets(beat);
    case "ordered_list":
      return prefix + serializeOrdered(beat);
    case "mini_table":
      return prefix + serializeMiniTable(beat);
    default: {
      const _exhaustive: never = beat;
      return String((_exhaustive as AnyBeat).layout ?? "");
    }
  }
}

function serializeParagraphLike(b: BeatParagraphPayload | BeatCalloutPayload): string {
  return (b.text ?? "").trim();
}

function serializeParagraphs(b: BeatParagraphsPayload): string {
  return (b.paragraphs ?? [])
    .map((p) => (p ?? "").trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ");
}

function serializeGrouped(b: BeatGroupedParagraphsPayload): string {
  const chunks: string[] = [];
  for (const g of b.groups ?? []) {
    const heading = (g.heading ?? "").trim();
    const text = (g.text ?? "").trim();
    if (heading && text) chunks.push(`${heading}: ${text}`);
    else if (text) chunks.push(text);
    else if (heading) chunks.push(heading);
  }
  return chunks.map((c) => c.replace(/\.+$/, "")).join(". ");
}

function serializeBullets(b: BeatBulletsPayload): string {
  const items = (b.items ?? []).map((x) => (x ?? "").trim().replace(/\.+$/, "")).filter(Boolean);
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return items[0] + ", " + items.slice(1).map((it) => `also ${it}`).join(", ");
}

function serializeOrdered(b: BeatOrderedListPayload): string {
  const steps = (b.steps ?? []).map((x) => (x ?? "").trim().replace(/\.+$/, "")).filter(Boolean);
  if (steps.length === 0) return "";
  return steps
    .map((s, i) => {
      const word = i < SEQUENCE_WORDS.length ? SEQUENCE_WORDS[i] : `step ${i + 1}`;
      return `${word}, ${s}`;
    })
    .join("; ");
}

function serializeMiniTable(b: BeatMiniTablePayload): string {
  const cols = b.columns ?? [];
  const rows = b.rows ?? [];
  const out: string[] = [];
  for (const r of rows) {
    const axis = (r.axis ?? "").trim();
    const values = r.values ?? [];
    const pieces = values.map((v, i) => {
      const colName = i < cols.length ? cols[i] : `column ${i + 1}`;
      return `${colName} is ${v}`;
    });
    if (pieces.length === 0) {
      if (axis) out.push(axis);
      continue;
    }
    out.push(`on ${axis}, ` + pieces.join(", while "));
  }
  return out.map((s) => s.replace(/\.+$/, "")).join(". ");
}

/**
 * Drop markdown markers that would be spoken literally.
 * Order matters: bold (`**x**`) before italic (`_x_`) so the asterisks
 * inside `**bold**` aren't mistaken for emphasis.
 */
export function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/[*`]/g, "");
}

/* ------------------------------------------------------------------ */
/*  Inline tests — call __runTests() from a dev console / node script  */
/*  We don't auto-run on import to keep production bundles side-       */
/*  -effect-free; the prompt's `process.env.NODE_ENV` IIFE risks       */
/*  breaking SSR if a fixture import path changes. Manual call only.   */
/* ------------------------------------------------------------------ */

export interface SelfTestReport {
  passed: number;
  failed: number;
  failures: Array<{ name: string; reason: string }>;
}

export function __runTests(): SelfTestReport {
  const report: SelfTestReport = { passed: 0, failed: 0, failures: [] };
  const assert = (name: string, cond: boolean, reason: string) => {
    if (cond) report.passed++;
    else {
      report.failed++;
      report.failures.push({ name, reason });
    }
  };

  // 1. The §16 worked example shape (minimal, archetype A) — no residual markdown
  const fixture: SpeakableV2 = {
    archetype: "A",
    pillar: "P01",
    audience_assumption: "beginner",
    voice: "friendly",
    familiarity_anchors: ["data plus the methods"],
    standard_example: "Dog extends Animal",
    hook: "OOP is just a way of writing code around objects.",
    cap: "OOP is four reinforcing rules, not four to memorise.",
    followup_handoff: ["What's the difference between abstract class and interface?"],
    speakable_status: "approved",
    beats: [
      {
        kind: "definition",
        layout: "paragraph",
        text: "An object is **data** plus the methods that work on that data — `Dog d = new Dog()`.",
      },
      {
        kind: "parts_or_states",
        layout: "grouped_paragraphs",
        groups: [
          {
            heading: "Encapsulation",
            text: "The class controls its own state.",
          },
          { heading: "Inheritance", text: "Dog extends Animal." },
        ],
      },
      {
        kind: "pitfalls",
        layout: "bullets",
        items: ["Don't confuse abstraction with the abstract keyword.", "Avoid deep hierarchies."],
      },
    ],
  };
  const out1 = toSpeech(fixture);
  assert("§16 has no residual `*`", !/\*/.test(out1), `output: ${out1}`);
  assert("§16 has no residual backtick", !/`/.test(out1), `output: ${out1}`);
  assert("§16 contains hook", out1.includes("OOP is just a way"), `output: ${out1}`);
  assert("§16 contains cap", out1.includes("four reinforcing rules"), `output: ${out1}`);
  assert("§16 grouped joins with colon", out1.includes("Encapsulation: The class"), `output: ${out1}`);

  // 2. mini_table with 2 columns × 3 axes serialises row-by-row
  const tableV2: SpeakableV2 = {
    archetype: "B",
    pillar: "P01",
    audience_assumption: "familiar",
    voice: "neutral",
    familiarity_anchors: ["array", "linked nodes"],
    standard_example: "ArrayList vs LinkedList",
    hook: "Two list shapes.",
    cap: "Pick ArrayList by default.",
    followup_handoff: [],
    speakable_status: "approved",
    beats: [
      {
        kind: "differences",
        layout: "mini_table",
        columns: ["ArrayList", "LinkedList"],
        rows: [
          { axis: "Memory", values: ["contiguous array", "linked nodes"] },
          { axis: "Random access", values: ["O(1)", "O(n)"] },
          { axis: "Insert middle", values: ["O(n)", "O(1)"] },
        ],
      },
    ],
  };
  const out2 = toSpeech(tableV2);
  assert("mini_table mentions axis 1", out2.includes("on Memory"), `output: ${out2}`);
  assert("mini_table mentions axis 2", out2.includes("on Random access"), `output: ${out2}`);
  assert("mini_table mentions axis 3", out2.includes("on Insert middle"), `output: ${out2}`);
  assert(
    "mini_table uses 'while' between columns",
    /ArrayList is .*, while LinkedList is /.test(out2),
    `output: ${out2}`,
  );

  // 3. ordered_list with 5 steps uses sequence words
  const orderedV2: SpeakableV2 = {
    archetype: "D",
    pillar: "P11",
    audience_assumption: "familiar",
    voice: "neutral",
    familiarity_anchors: ["jstack"],
    standard_example: "p99 spike",
    hook: "Triage path.",
    cap: "Confirm with profile.",
    followup_handoff: [],
    speakable_status: "approved",
    beats: [
      {
        kind: "step_by_step",
        layout: "ordered_list",
        steps: ["take a thread dump", "check GC log", "run async-profiler", "review histogram", "decide"],
      },
    ],
  };
  const out3 = toSpeech(orderedV2);
  for (const w of ["first,", "second,", "third,", "fourth,", "fifth,"]) {
    assert(`ordered_list emits ${w}`, out3.includes(w), `output: ${out3}`);
  }

  // 4. tts_overrides applied
  const overrideV2: SpeakableV2 = {
    ...fixture,
    tts_overrides: { "OOP": "object oriented programming" },
  };
  const out4 = toSpeech(overrideV2);
  assert("tts_overrides expands OOP", out4.includes("object oriented programming"), `output: ${out4}`);
  assert("tts_overrides removes raw OOP", !/\bOOP\b/.test(out4), `output: ${out4}`);

  // 5. symbol normalisation only on standalone symbols
  const symV2: SpeakableV2 = {
    ...fixture,
    hook: "Use `a == b` not `a != b`; pipe stdin to head -> wc.",
  };
  const out5 = toSpeech(symV2);
  assert("== expanded", out5.includes("double equals"), `output: ${out5}`);
  assert("!= expanded", out5.includes("not equals"), `output: ${out5}`);
  assert("-> expanded", out5.includes(" to "), `output: ${out5}`);
  assert("no raw == left", !/==/.test(out5), `output: ${out5}`);

  return report;
}
