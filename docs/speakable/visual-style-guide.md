# Speakable visual style guide

> **Scope (locked: §15B.3).** Text spec only. No live React, no production CSS, no Tailwind classes referenced as truth. The Phase 1 deliverable (`frontend/components/speakable/primitives/*`) implements what is specified here. The renderer team has nothing to invent — every dimension, token, and behaviour the lint and renderer need is below.
>
> Mirrors `SPEAKABLE-PLAN.md` §10.3 and §10.4. Cross-references: visual rhythm rules in `docs/speakable/lint-rules.md` §7.5 and the `layout` field in `frontend/lib/speakable/schema.ts`.

---

## 1. Design philosophy

The Speakable should read like a **magazine column**, not a dashboard. Three rules govern every primitive:

1. **Serif body, sans accent.** Prose reads in a serif body face. Labels, sub-headings, and table headers use a sans face for visual contrast. Code identifiers use a monospace face.
2. **Generous vertical rhythm.** Line-height 1.7 inside paragraphs; ≥ 1 rem between beats; ≥ 1.5 rem between sections. The eye should move down the column without effort.
3. **No decorative chrome.** No drop shadows, no gradients, no decorative bullets, no borders that don't earn their keep. The hierarchy comes from typography and spacing alone, with one exception: the `callout` primitive uses a distinct background (sparingly) for depth-marker emphasis.

---

## 2. Typography scale

> Phase 1 picks the actual font family stacks. The roles (serif body / sans accent / mono) are fixed; the family choices are the renderer team's call. Suggested defaults that respect the rules above: serif body `Source Serif 4` or `Charter`; sans accent `Inter` or `Söhne`; mono `JetBrains Mono` or `IBM Plex Mono`.

| Role | Used for | Family role | Size (rem) | Line-height | Weight | Tracking |
|---|---|---|---:|---:|---:|---:|
| **body** | All paragraph text inside any beat | serif body | 1.0625 (~17 px) | 1.7 | 400 | normal |
| **eyebrow / label** | The optional `label` shown above a beat | sans accent | 0.75 (~12 px) | 1.4 | 600 | +0.06em, uppercase |
| **subheading** | `BeatGroupedParagraphs` group `heading`; `BeatMiniTable` column header | sans accent | 0.9375 (~15 px) | 1.4 | 600 | normal |
| **hook** | The Speakable's opening line | sans accent (or serif italic) | 1.375 (~22 px) | 1.4 | 500 | normal |
| **cap** | The Speakable's closing line | serif body italic | 1.125 (~18 px) | 1.5 | 400 italic | normal |
| **mono / code-chip** | Inline code identifiers (`List<String>`, `@Transactional`) | mono | 0.9375 (~15 px) | 1.5 | 500 | normal |

### 2.1 Hook & cap visual treatment

- The **hook** sits above the first beat with **1.5 rem** of bottom margin. It is the only place a slight font-size jump happens; everything else is uniform.
- The **cap** sits below the last beat with **1.5 rem** of top margin and an optional thin top divider (1 px, divider colour token). It is italic to signal "the close".

### 2.2 Hierarchy is type, not size

There are exactly **5 typographic ranks**: hook (largest), cap (italic), body (default), subheading (smaller sans), eyebrow (smallest, uppercase). No other sizes. Renderer must not invent a `text-2xl` for a beat.

---

## 3. Vertical rhythm

| Element | Spacing |
|---|---|
| Inside a paragraph (`<p>`) | line-height 1.7 (typography 2 above) |
| Between paragraphs in `BeatParagraphs` | margin-top 0.875 rem |
| Between `groups[]` items in `BeatGroupedParagraphs` | margin-top 1.25 rem (or a thin divider — see §6.3) |
| Between bullets in `BeatBullets` and `BeatOrderedList` | margin-top 0.5 rem (≥) |
| Between two consecutive **beats** | margin-top 1.5 rem |
| Between the hook and the first beat | margin-top 1.5 rem |
| Between the last beat and the cap | margin-top 1.5 rem |
| Between the cap and `followup_handoff` (if rendered inline) | margin-top 2 rem |
| Top/bottom padding inside a `BeatCallout` | 1.25 rem each |

These numbers are **lint-checkable in spirit** (the lint enforces word ceilings; the renderer enforces these spacings). The Phase 1 visual story page (`/dev/speakable-primitives`) will assert these visually.

---

## 4. Color tokens

Every colour is named. The renderer never hard-codes a hex; it reads from the token. Light + dark palettes below. Suggested HEX values are the Phase 0 baseline; the renderer team may tune within the same role.

### 4.1 Light palette

| Token | Role | Suggested HEX |
|---|---|---|
| `--speakable-body` | Body text | `#1F1F23` |
| `--speakable-muted` | Muted text (eyebrow, caption, table axis labels) | `#6B7280` |
| `--speakable-accent` | Accent text (subheading, hook, link underline) | `#1F4FB6` |
| `--speakable-callout-bg` | `BeatCallout` background | `#FFF7E6` |
| `--speakable-callout-border` | `BeatCallout` left rail (optional) | `#E1A74C` |
| `--speakable-table-border` | `BeatMiniTable` cell + header borders | `#E5E7EB` |
| `--speakable-table-header-bg` | `BeatMiniTable` header row background | `#F8FAFC` |
| `--speakable-divider` | Thin dividers between groups, before cap | `#E5E7EB` |
| `--speakable-code-chip-bg` | Inline code identifier background | `#F3F4F6` |
| `--speakable-code-chip-text` | Inline code identifier text | `#0F172A` |
| `--speakable-page-bg` | Page background under the Speakable column | `#FFFFFF` |

### 4.2 Dark palette

| Token | Role | Suggested HEX |
|---|---|---|
| `--speakable-body` | Body text | `#E7E7EA` |
| `--speakable-muted` | Muted text | `#9CA3AF` |
| `--speakable-accent` | Accent text | `#7AA2FF` |
| `--speakable-callout-bg` | `BeatCallout` background | `#3A2E16` |
| `--speakable-callout-border` | `BeatCallout` left rail | `#E1A74C` |
| `--speakable-table-border` | `BeatMiniTable` borders | `#2A2D33` |
| `--speakable-table-header-bg` | `BeatMiniTable` header row | `#1B1D21` |
| `--speakable-divider` | Thin dividers | `#2A2D33` |
| `--speakable-code-chip-bg` | Inline code chip background | `#1B1D21` |
| `--speakable-code-chip-text` | Inline code chip text | `#E7E7EA` |
| `--speakable-page-bg` | Page background | `#101113` |

### 4.3 Contrast guarantee

Every text-on-background pair below must meet **WCAG AA** (4.5 : 1 for body, 3 : 1 for ≥ 18 px text). The Phase 1 visual story page asserts this via an automated contrast check.

---

## 5. Spacing tokens

A geometric ramp the primitives compose from. Renderer must not introduce ad-hoc margins.

| Token | rem | px (at 16 px root) |
|---|---:|---:|
| `--space-1` | 0.25 | 4 |
| `--space-2` | 0.5  | 8 |
| `--space-3` | 0.75 | 12 |
| `--space-4` | 1.0  | 16 |
| `--space-5` | 1.5  | 24 |
| `--space-6` | 2.0  | 32 |

The vertical rhythm in §3 maps onto these tokens (e.g., "1.5 rem between beats" = `--space-5`).

---

## 6. The 7 primitives

Each section follows the same shape: **purpose**, **when to use**, **when not to**, **ASCII sketch**, **do / don't**.

### 6.1 `BeatParagraph`

- **Purpose.** Render a single short paragraph for a beat that is one coherent thought.
- **When to use.** Almost any beat under 60 words: `definition`, `why_exists`, `tiny_example`, `clarify`, `decision`, `cap`-shaped beats. Default choice when the content fits comfortably in one paragraph.
- **When not to.** When the content runs > 60 words (split to `BeatParagraphs` or `BeatGroupedParagraphs`). When the content enumerates 3+ semantic items (use `BeatBullets` or `BeatOrderedList`).
- **ASCII sketch.**

  ```
  EYEBROW LABEL  (optional, smallcaps, --speakable-muted)

  Body paragraph in serif body, line-height 1.7, max 60 words.
  Comfortable column width (~64 ch). One thought, one paragraph.
  ```

- **Do / don't.**
  - **Do** keep the paragraph ≤ 60 words (lint 7.5.1).
  - **Do** use the optional `label` for an eyebrow when the beat needs a one-word frame.
  - **Don't** use this for content that should split — the lint will fail you at 7.5.1.
  - **Don't** stack two `BeatParagraph` beats back-to-back as a substitute for `BeatParagraphs`; the rhythm breaks.

### 6.2 `BeatParagraphs`

- **Purpose.** Render 2–4 short paragraphs in a comfortable rhythm when one beat genuinely contains a few connected thoughts.
- **When to use.** A `mental_model` beat that needs a setup-then-image. A `failure_mode` beat that needs the trigger then the consequence. A `mechanism` beat the agent has split on natural sentence boundaries.
- **When not to.** When the paragraphs would each carry their own sub-heading (use `BeatGroupedParagraphs`). When the paragraphs are really list items in disguise (use `BeatBullets`).
- **ASCII sketch.**

  ```
  EYEBROW LABEL

  First short paragraph. ≤ 60 words.

  Second short paragraph. ≤ 60 words. Same column,
  margin-top --space-3 between them.

  (optional third)
  ```

- **Do / don't.**
  - **Do** keep each paragraph ≤ 60 words.
  - **Do** use 2–4 paragraphs; 5+ becomes a wall.
  - **Don't** use `BeatParagraphs` for a single paragraph (use `BeatParagraph`).
  - **Don't** add bold or italic emphasis inside the paragraphs — the rhythm carries the emphasis.

### 6.3 `BeatGroupedParagraphs`

- **Purpose.** Render a beat whose content is several mini-blocks, each with its own sub-heading.
- **When to use.** Archetype A's `parts_or_states` beat when the parts have names ("Encapsulation / Inheritance / Polymorphism / Abstraction"). Archetype E's `options` beat when the options have names ("Interface" / "Abstract class"). Archetype F's `requirements_fr_nfr` beat with "Functional" / "Non-functional".
- **When not to.** When the items are short and unnamed — `BeatBullets` is cleaner. When the items imply order — `BeatOrderedList`.
- **ASCII sketch.**

  ```
  EYEBROW LABEL  (e.g. "The four pillars")

  ┌─────────────────────────────────────────────────────┐
  │ Subheading one (sans, bold)                          │
  │ Mini-paragraph in serif body. ≤ 60 words.            │
  ├─────────────────────────────────────────────────────┤  ← thin divider OR
  │ Subheading two                                       │     alternating bg
  │ Mini-paragraph two. ≤ 60 words.                      │
  └─────────────────────────────────────────────────────┘
  ```

  The divider (1 px, `--speakable-divider`) and an alternating subtle background tint are interchangeable; renderer picks one and applies consistently.

- **Do / don't.**
  - **Do** keep group count to 2–6. Below 2, use `BeatParagraph`; above 6, the listing should probably collapse to bullets.
  - **Do** keep each `groups[].text` ≤ 60 words (lint 7.5.1).
  - **Don't** rely on heavy borders — the divider should be 1 px and quiet.
  - **Don't** vary subheading sizes per group; uniform.

### 6.4 `BeatBullets`

- **Purpose.** Render a clean bulleted list when the beat enumerates 3+ short, parallel items.
- **When to use.** Archetype A's `pitfalls` beat. Archetype D's `tools` beat. Archetype B's `differences` beat **only** when there are ≤ 2 axes (3+ axes must use `BeatMiniTable` per lint 7.5.3).
- **When not to.** When the items are long sentences or carry their own sub-heading (use `BeatGroupedParagraphs`). When the items imply a sequence (use `BeatOrderedList`).
- **ASCII sketch.**

  ```
  EYEBROW LABEL  (optional)

  •  First item — short, parallel phrasing.
  •  Second item — short, parallel phrasing.
  •  Third item — short, parallel phrasing.

  (≥ --space-2 between items, no decorative glyphs)
  ```

- **Do / don't.**
  - **Do** keep items short — ideally one line each, certainly ≤ 25 words.
  - **Do** keep at least `--space-2` (0.5 rem) between items.
  - **Don't** use decorative bullets ("→", "✦", "✓"); a small disc is the only mark.
  - **Don't** mix lengths violently — short, short, very-long jars the rhythm.

### 6.5 `BeatOrderedList`

- **Purpose.** Render a numbered list when order matters.
- **When to use.** Archetype D's `step_by_step` beat (lint 7.5.4 mandates this). Archetype C's `mechanism` beat when the steps imply sequence. Any `parts_or_states` whose parts are a lifecycle (Thread states, request lifecycle, deploy phases).
- **When not to.** When the order is incidental — use `BeatBullets`.
- **ASCII sketch.**

  ```
  EYEBROW LABEL

  │ 1.  First step. The number sits in a small mono chip.
  │ 2.  Second step.
  │ 3.  Third step.
  │ 4.  Fourth step.
   ↑
   optional faint left rail (1 px, --speakable-divider)
   for archetype D, signalling sequence visually.
  ```

  - The numbers are mono, weight 500, in `--speakable-muted` colour.
  - For archetype D the renderer adds a faint vertical left rail joining the numbers; for other archetypes the rail is omitted.

- **Do / don't.**
  - **Do** keep each step short (one or two short sentences).
  - **Do** start each step with an action verb ("Pull...", "Run...", "Cross-reference...").
  - **Don't** use the ordered list for non-sequential content; the visual cues will mislead.

### 6.6 `BeatMiniTable`

- **Purpose.** Render a compact 2- or 3-column comparison table.
- **When to use.** Archetype B's `differences` beat with 3+ axes (lint 7.5.3 mandates this). Any beat that is genuinely a 2-D comparison.
- **When not to.** When the comparison has only 1 axis (use `BeatParagraph`). When the columns aren't truly parallel.
- **ASCII sketch.**

  ```
  EYEBROW LABEL  (optional)

  ┌─────────────────┬───────────────────┬───────────────────┐
  │  Axis           │  Column A         │  Column B         │   ← sans subheading,
  ├─────────────────┼───────────────────┼───────────────────┤      --speakable-table-header-bg
  │  Memory layout  │  array under...   │  nodes with...    │
  ├─────────────────┼───────────────────┼───────────────────┤
  │  Random access  │  O(1)             │  O(n)             │
  ├─────────────────┼───────────────────┼───────────────────┤
  │  Insert middle  │  O(n) shift       │  O(1) once node   │
  └─────────────────┴───────────────────┴───────────────────┘
  ```

  - Header row is sticky on long pages.
  - Borders are 1 px, `--speakable-table-border`.
  - Maximum 3 columns. (Schema enforces; lint enforces; renderer asserts.)

- **Do / don't.**
  - **Do** keep cell content ≤ 8 words ideally; ≤ 15 words hard.
  - **Do** keep all cells within a row symmetric (same approximate length).
  - **Don't** put long prose in a cell — split to multiple rows or move to a paragraph above.
  - **Don't** add column-spanning rows; if you need that, the layout is wrong.

### 6.7 `BeatCallout`

- **Purpose.** Distinct emphasis for the depth-marker beat. Used **at most once per Speakable** (lint 7.5.8) so it stays meaningful.
- **When to use.** The depth-marker beat — `failure_mode` (C), `rethink_if` (E), `bottleneck_deep_dive` (F when the bottleneck is the headline), `reflection` (G when the speaker wants the line to land with weight). The lint warns if used elsewhere.
- **When not to.** As a "this is important too" amplifier on any other beat. As a tip box. As a styling escape hatch.
- **ASCII sketch.**

  ```
  ┃ EYEBROW LABEL  (optional, --speakable-muted)
  ┃
  ┃  Body text, slightly muted background
  ┃  (--speakable-callout-bg), comfortable padding
  ┃  (--space-5 = 1.25 rem top/bottom).
  ┃
  ↑
  3 px left rail, --speakable-callout-border
  ```

- **Do / don't.**
  - **Do** use sparingly — at most one per Speakable.
  - **Do** let the depth marker land naturally; the visual emphasis is doing the work.
  - **Don't** combine bold + italic + callout — pick one signal.
  - **Don't** add icons or emoji inside the callout.

---

## 7. Mobile breakpoint rules

The Speakable column is responsive but never re-laid-out into a sidebar grid.

| Breakpoint | Behaviour |
|---|---|
| `≥ 1024 px` (desktop) | Full column width capped at ~720 px (~64 ch). Mini-tables render full-width inside the column. |
| `640–1023 px` (tablet) | Same column, full available width up to 720 px. Mini-tables stay tabular. |
| `< 640 px` (mobile) | Column flexes to viewport with 1 rem horizontal padding. **Mini-tables collapse to stacked cards** (one card per row, each card is `axis: value-A / value-B`). Ordered-list left rail thins to `--space-1`. Eyebrow labels stay sans/uppercase but tracking tightens to +0.04em. |

Hook size scales down by ~2 px on mobile (1.25 rem vs 1.375 rem). All other typographic sizes are unchanged.

---

## 8. TTS reading rules per primitive

The Phase 1 TTS serializer (`frontend/lib/speakable/toSpeech.ts`) is layout-aware. Each primitive specifies how it reads aloud. The lint at 7.7 validates the spoken output.

| Primitive | Spoken behaviour |
|---|---|
| `BeatParagraph` | Reads as one breath group. Eyebrow `label` is read first as a short noun phrase ("The four pillars."), with a half-second pause, then the body. |
| `BeatParagraphs` | Reads paragraph by paragraph with a quarter-second pause between paragraphs. The pauses give the listener room to absorb. |
| `BeatGroupedParagraphs` | For each group: speak the `heading` as a short noun phrase, half-second pause, then the `text`. One-second pause between groups. |
| `BeatBullets` | Reads with natural enumeration cues — "First, ...; Second, ...; Third, ...". A short pause between items. The TTS does **not** say "bullet". |
| `BeatOrderedList` | Reads with explicit ordinals — "Step one, ...; Step two, ...; Step three, ...". For archetype D the ordinals double as a structural cue ("First check the thread dump..."). |
| `BeatMiniTable` | Reads row-by-row with the axis name pronounced. Example: "On memory layout, ArrayList is array under the hood, while LinkedList is nodes with pointers. On random access, ArrayList is constant time, while LinkedList is linear time." Never reads the table as a literal grid. |
| `BeatCallout` | Reads at the same speed but with a slightly emphasised lead-in pause (one full second before, half-second after). The TTS does **not** announce "callout"; the pause carries the weight. |

### 8.1 Code identifiers in TTS

Every inline code chip the user wrote (`List<String>`, `==`, `@Transactional`) is replaced by the matching `tts_overrides` value before reading. The lint catches missing overrides at 7.7.2. Chips without a friendly spoken form fail the lint.

### 8.2 Hook & cap

The hook is read first, with a half-second pause after. The cap is read last, with a one-second lead-in pause to mark "the close". Both are read once, never repeated as a heading callback.

---

## 9. What the renderer must NOT do

These are the failure modes the visual style guide is written to prevent. They are not lint rules (the lint validates content); they are renderer invariants the Phase 1 implementation must hold.

- **Never** mix a `paragraph` layout with a `bullets` layout in the same beat.
- **Never** add decorative chrome (drop shadows, gradients, ornamental dividers).
- **Never** introduce a typographic rank not in §2.
- **Never** read mini-tables as a literal grid in TTS.
- **Never** use the `callout` layout more than once per Speakable.
- **Never** prepend any "you've seen this" / "the canonical" / "every tutorial" framing text to the Speakable. (Plan §10.6 — the renderer never adds invisible-familiarity callbacks.)

---

## 10. Phase-1 acceptance signals

The visual story page (`/dev/speakable-primitives`) is the Phase 1 exit gate for this style guide. It must demonstrate:

1. Each of the 7 primitives in isolation, light + dark, desktop + mobile.
2. The OOP four-pillars worked example (Plan §16) rendered as archetype A composing `BeatParagraph` × 4 + `BeatGroupedParagraphs` + `BeatBullets`.
3. The ArrayList vs LinkedList example rendered as archetype B with `BeatMiniTable` for `differences`.
4. The "debug a slow service" example rendered as archetype D with `BeatOrderedList` (with left rail) for `step_by_step`.
5. The TTS read-aloud working on every primitive, with the spoken cues from §8 audible.

Until that page is signed off, the Speakable migration (Phase 3) does not run.
