# Speakable Redesign — Phase 1 Run Prompt

> **Paste this entire file into a new Cursor chat in this repo.** Phase 0 is complete (see `docs/speakable/PHASE-0-REPORT.md`). Phase 1 builds the tooling: the lint script, the renderer primitives, the unified Speakable component, the TTS serializer, the read-aloud button, the visual story page, and the admin review UI. **No content moves in this phase.** When Phase 1 is done, the site still renders exactly like today — Phase 1 just installs the v2 plumbing alongside the legacy path.

---

## 1. What this run does (and what it does *not* do)

You are running **Phase 1 only** of the Speakable redesign. Phase 1 produces tooling that Phase 2 (golden references) and Phase 3 (parallel agents) will consume. **No content edits, no `complete-qa.json` modifications, no Phase 2 / 3 / 4 work, no `git push`.**

Expected wall time: **2–3 hours**. Eleven deliverables (one preflight + ten functional). Mostly code.

The hard contract: **the live site must render unchanged** for every question that currently exists. Until a question's `speakable_status === "approved"` (which won't happen until Phase 2/3), the renderer must serve the legacy markdown blob exactly as today.

---

## 2. Read these references first (in this order)

Before writing any code, read:

1. **`docs/SPEAKABLE-PLAN.md`** — the plan. Pay special attention to:
   - §10 Renderer redesign (esp. §10.3 layout primitives, §10.4 visual style guide pointer, §10.5 unify the two renderers, §10.7 single TTS serializer, §10.8 CopyButton).
   - §11 Phase 1 deliverables list.
   - §14.5 Per-question approval status table — drives the wrapper's branching.
   - §16 Worked example — the fixture the lint must pass cleanly.
2. **`docs/speakable/PHASE-0-REPORT.md`** — what already exists and where.
3. **`docs/speakable/lint-rules.md`** — the executable spec for `audit_speakable.py`. Every rule in §7.1–§7.8 has a pass criterion and a fail-mode example.
4. **`docs/speakable/visual-style-guide.md`** — the executable spec for the 7 primitives. Numbers are fixed; family choices are yours.
5. **`docs/speakable/archetypes.md`** — required vs forbidden beats per archetype; you'll need this for the lint and the per-archetype layouts.
6. **`docs/speakable/word-ceilings.md`** + **`docs/speakable/depth-markers.md`** — the lint reads them via the JSON derivatives you'll generate in preflight (§7 below).
7. **`frontend/lib/speakable/schema.ts`** — TypeScript types. The renderer dispatches on `archetype` + per-beat `layout` from this file.
8. **`scripts/speakable_schema.json`** — JSON Schema for the lint.
9. **`codex/banned.json`** + **`codex/phrasings.json`** + **`codex/examples.json`** — codex inputs the lint reads.
10. **`frontend/components/question/QuestionPageLayout.tsx`** lines 110–525 — current speakable rendering (the green "Interview Answer" card). You'll thread the new wrapper through here without changing visible output for legacy questions.
11. **`frontend/components/preview/PreviewArticle.tsx`** lines 670–1090 — the magazine "Zone 2" rendering, including the four hardcoded OOP CSS rules (lines 908–927) that come out in §1.9.
12. **`frontend/app/mock-interviews/audio/page.tsx`** lines 1–200 + the `SpeechSynthesisUtterance` usage — the read-aloud button hooks into here.
13. **One existing `complete-qa.json`** (suggest `content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json`) — confirm the legacy shape so your wrapper's discriminator handles it.

That's it. Stop reading after #13.

---

## 3. Locked context from Phase 0

You don't re-decide any of these — they came out of Phase 0 sign-off:

- Schema is final at `frontend/lib/speakable/schema.ts` + `scripts/speakable_schema.json`. **Do not modify either** in Phase 1. If you find a real bug in the schema, log it to `docs/speakable/HUMAN-REVIEW-QUEUE.md` and continue with the schema as-is.
- Codex (3 JSON files + 1 markdown) is final. **Do not modify.** If you spot a missing topic, log it.
- Lint rules doc is the spec. Implement it. **Do not change the rules** — implement them as written. If a rule is genuinely ambiguous, log to the queue with your interpretation and continue.
- Visual style guide is the design source. Numbers are fixed. Font family choices, exact HEX values within roles, and Tailwind utility/CSS-variable style are your call.
- Status field has 7 values: `legacy | pending_review | approved | rolled_back | priority_handcraft | pending_handcraft | pending_handcraft_blocked_by_smoke`. Renderer serves v2 only when `approved`. Everything else falls back to legacy.

---

## 4. Hard boundaries — never cross these

1. **Do not `git push`.** Local commits only.
2. **Do not modify any `complete-qa.json` file** (or any file under `content/` or `content-md/`). Phase 1 is plumbing, not content.
3. **Do not modify the schema files** (`schema.ts`, `speakable_schema.json`). Phase 0 locked them.
4. **Do not modify any codex JSON file** (`codex/*.json`). Phase 0 locked them.
5. **Do not change the legacy rendering output for any existing question.** The old code path must produce visually-identical output until you replace it via the unified wrapper, and the wrapper must fall through to legacy when `speakable_status !== "approved"`.
6. **Do not stage or commit the unrelated working-tree changes already present.** `git status` shows hundreds of pre-existing modifications and deletions outside the Speakable scope (deleted `node_modules/`, modified backend Java, etc.). These are *not yours*. Stage only what you create / intentionally edit for Phase 1. If you accidentally touch something outside Speakable, `git restore` it before commit.
7. **Do not invent decisions.** If the plan or the Phase 0 spec is silent on something, log to `docs/speakable/HUMAN-REVIEW-QUEUE.md` with your best-instinct choice and continue. Never halt.
8. **Do not skip the preflight commit (§7 below).** It unblocks everything else.

---

## 5. Quality bar (the gate)

A deliverable is **done** when:

- It compiles / runs without errors (TypeScript strict for frontend; Python 3 stdlib for the lint).
- ReadLints on every file you edit returns clean, or remaining lints are pre-existing and clearly out of scope.
- For frontend deliverables: it renders cleanly on the visual story page (§7 deliverable 1.7) in both light and dark themes.
- For the lint script: it passes against the §16 worked example after the §16-1 preflight fix is committed; it correctly reports a missing v2 as `legacy` (not as a failure) for any current `complete-qa.json`.
- It includes a header docblock pointing back to its plan / Phase 0 source.
- It has zero TODO / TBD / FIXME placeholders.

---

## 6. The 11 deliverables in build order

The order is engineered to make the next step possible at each step. **Do not skip ahead.**

| Step | Deliverable | Path | Phase |
|---|---|---|---|
| 0 | Preflight commit + ceilings/depth-markers JSON | (3 files) | preflight |
| 1 | Lint script | `scripts/audit_speakable.py` | 1.1 |
| 2 | Per-beat layout primitives (7 components) | `frontend/components/speakable/primitives/*` | 1.2 |
| 3 | Visual story page | `frontend/app/dev/speakable-primitives/page.tsx` | 1.7 |
| 4 | Per-archetype layouts (7 components) | `frontend/components/speakable/layouts/*` | 1.3 |
| 5 | Unified wrapper + legacy fallback | `frontend/components/speakable/Speakable.tsx` + `Legacy.tsx` | 1.4 |
| 6 | TTS-clean serializer | `frontend/lib/speakable/toSpeech.ts` | 1.5 |
| 7 | Read-aloud button | `frontend/components/speakable/ReadAloudButton.tsx` + audio-page wiring | 1.6 |
| 8 | Admin review UI | `frontend/app/admin/speakable-review/page.tsx` + supporting API route | 1.8 |
| 9 | Old-renderer integration (Question + Preview) | edits to existing files | 1.9 |
| 10 | Health dashboard generator (run by 1.1) | output: `content/_audits/speakable_health.md` | 1.10 |

---

## 7. Deliverable 0 — Preflight (do this first, before any code)

### 7.1 Commit the §16-1 plan fix

`docs/SPEAKABLE-PLAN.md` has an uncommitted edit on §16 (the worked example) — `layout` fields were added to each beat so the example validates against the schema. This is the resolution of `HUMAN-REVIEW-QUEUE.md` item §16-1.

```bash
# Verify only this one file is modified by the §16-1 fix:
git diff --name-only docs/SPEAKABLE-PLAN.md
# Stage ONLY this file (do not use `git add .` — pre-existing changes pollute the diff):
git add docs/SPEAKABLE-PLAN.md
git commit -m "chore(speakable): Phase 0 follow-up — §16-1 worked example layout fix"
```

After commit: edit `docs/speakable/HUMAN-REVIEW-QUEUE.md` and mark §16-1 as **resolved** with the commit SHA. Commit the queue update separately:

```bash
git add docs/speakable/HUMAN-REVIEW-QUEUE.md
git commit -m "chore(speakable): mark §16-1 resolved in human review queue"
```

### 7.2 Derive `word-ceilings.json` and `depth-markers.json`

The lint reads these as JSON, not markdown. Parse the corresponding markdown tables in `docs/speakable/word-ceilings.md` and `docs/speakable/depth-markers.md` and emit:

- **`scripts/data/word-ceilings.json`** — shape:
    ```json
    {
      "A": {
        "hook":           { "soft": 25, "hard": 35 },
        "definition":     { "soft": 60, "hard": 80 },
        "why_exists":     { "soft": 40, "hard": 60 },
        "parts_or_states":{ "soft": 90, "hard": 130 },
        "how_to_use":     { "soft": 50, "hard": 70 },
        "example":        { "soft": 70, "hard": 100 },
        "pitfalls":       { "soft": 50, "hard": 70 },
        "cap":            { "soft": 25, "hard": 35 },
        "expected_total": { "soft_total": 410, "hard_total": 580 }
      },
      "B": { ... },
      "C": { ... },
      "D": { ... },
      "E": { ... },
      "F": { ... },
      "G": { ... }
    }
    ```
  *(Numbers come from `word-ceilings.md`; copy them verbatim. If the markdown values differ from the example above, prefer the markdown.)*

- **`scripts/data/depth-markers.json`** — shape:
    ```json
    {
      "A": {
        "rule": "mandatory",
        "valid_beats": ["parts_or_states", "pitfalls", "example"],
        "signal_phrases_codex_key": "depth_markers.A.signals"
      },
      "B": { "rule": "mandatory", "valid_beats": ["differences", "when_to_pick", "tiny_example"], "signal_phrases_codex_key": "depth_markers.B.signals" },
      "C": { "rule": "mandatory", "required_beat": "failure_mode", "signal_phrases_codex_key": "depth_markers.C.signals" },
      "D": { "rule": "mandatory", "required_beat": "tools", "min_count": 2, "signal_phrases_codex_key": "depth_markers.D.signals" },
      "E": { "rule": "mandatory", "required_beat": "rethink_if", "must_contain_threshold": true },
      "F": { "rule": "capacity_numbers", "must_contain_numeric_capacity": true },
      "G": { "rule": "recommended", "valid_beats": ["reflection"], "signal_phrases_codex_key": "depth_markers.G.signals" }
    }
    ```
  *(Mirror exactly what `depth-markers.md` says. If `depth-markers.md` references signal phrases that aren't in the codex yet, log to the queue and use an empty list as the default.)*

Both files go under `scripts/data/` (create the directory). The lint script reads them.

Commit:
```bash
git add scripts/data/word-ceilings.json scripts/data/depth-markers.json
git commit -m "feat(speakable): Phase 1.0 — derive ceilings + depth-markers JSON for lint"
```

Update `docs/speakable/PHASE-STATUS.md`: set `Phase: 1` and add the preflight section. Commit that update separately.

---

## 8. Deliverable 1.1 — `scripts/audit_speakable.py`

The lint script. The executable form of `docs/speakable/lint-rules.md`.

### Inputs
- A `complete-qa.json` file path (or `--all` to walk every `complete-qa.json` under `content/`).
- The schema at `scripts/speakable_schema.json`.
- The codex at `codex/banned.json`, `codex/phrasings.json`, `codex/examples.json`.
- The ceilings at `scripts/data/word-ceilings.json` (from preflight).
- The depth markers at `scripts/data/depth-markers.json` (from preflight).

### Behaviour

For each `complete-qa.json`:

1. Find the question's Speakable. Two sources can be present simultaneously per `§14.1`:
    - Legacy: a section with `type: "speakable_answer"`.
    - Structured: a top-level field `speakable_v2` matching the `SpeakableV2` schema.
2. Determine the question's effective `speakable_status`. If `speakable_v2` is missing, status is implicitly `legacy` and the file passes with a `note` (not a failure) — there's nothing to lint.
3. If `speakable_v2` is present, run all rules in `lint-rules.md` §7.1–§7.8 on it.
4. Compute a 0–100 quality score. Suggested formula (mirror §7.8 reporting):
    - Start at 100.
    - **Structural (7.1):** subtract 25 per unique violation (these are catastrophic).
    - **Familiarity (7.2):** subtract 30 per Layer-2 hit (zero tolerance), 25 per Layer-3 hit (zero tolerance), 5 per Layer-1 hit beyond the per-1000-word allowance, 10 if the definition-equivalent beat lacks a canonical anchor, 8 for missing standard example without override.
    - **Voice (7.3):** subtract 6 per voice rule failure (sentence length, FK, contractions, active voice, second-person imperatives, comma-density, pronoun policy).
    - **Tightness (7.4):** subtract 10 per beat over hard cap; subtract 4 per beat over soft cap (capped at 16 total for soft violations).
    - **Visual rhythm (7.5):** subtract 12 per layout-payload mismatch, 10 per paragraph > 60 words, 10 per missing list-when-many, 8 per visual-variety failure, 6 per code-density violation, 6 per callout-discipline violation.
    - **Depth (7.6):** subtract 20 per missing depth marker (these are heavy because they prove non-superficiality).
    - **TTS-cleanness (7.7):** subtract 10 per residual `*` / backtick / unspoken symbol after `tts_overrides`.
    - Floor at 0.
5. The pass/fail thresholds:
    - **fail** if any zero-tolerance rule (Layer 2, Layer 3, structural validity, schema validation) was violated.
    - **fail** if score < 80 (the §15.12 absolute floor).
    - **warn** if score in [80, 90).
    - **pass** if score ≥ 90.
6. Output:
    - `--check <path>` — print result + reason list to stdout. Exit 0 on pass/warn, 1 on fail (configurable via `--fail-on warn|fail`).
    - `--all` — walk content/, write per-question results, then aggregate.
    - `--all --report` — also write `content/_audits/speakable_health.md` (deliverable 1.10).

### Implementation notes

- Pure Python 3 stdlib + `jsonschema` (only added external dep). If `textstat` would help with FK grade, use it; otherwise implement the FK formula yourself (it's 5 lines).
- Sentence tokenisation: regex `r'(?<=[.!?])\s+(?=[A-Z])'` is sufficient for the spoken-English text Speakable produces. Do **not** pull in nltk/spacy — too heavy for a lint.
- The TTS-clean check is run by passing the v2 through a Python port of `toSpeech.ts` logic. Alternatively, since Phase 1.5 builds the TS version, you can spawn `node` once if it's installed; **prefer the inline Python port** to keep the script self-contained and runnable in CI without Node.
- Print results in a clean ASCII format, no emojis, no colors (or colors only when `sys.stdout.isatty()`).

### Acceptance

- `python scripts/audit_speakable.py --check content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json` — runs without crash; reports `legacy` (no failure) since no v2 yet.
- `python scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` — extracts the §16 YAML worked example, validates it against the schema, lints it, and reports **pass with score ≥ 90**. (Add a `--check-fixture` CLI flag for this purpose; it parses the YAML block from §16 of the plan and runs the standard checks.)
- `python scripts/audit_speakable.py --all` — walks every `complete-qa.json` under `content/`, all current questions report `legacy` (zero failures, only notes).

Commit: `feat(speakable): Phase 1.1 — audit_speakable.py lint script`.

---

## 9. Deliverable 1.2 — Layout primitives

Seven React components implementing the visual style guide.

### Path
`frontend/components/speakable/primitives/`:
- `BeatParagraph.tsx`
- `BeatParagraphs.tsx`
- `BeatGroupedParagraphs.tsx`
- `BeatBullets.tsx`
- `BeatOrderedList.tsx`
- `BeatMiniTable.tsx`
- `BeatCallout.tsx`
- `index.ts` re-exporting all 7.

### Implementation rules

1. **Each component takes one prop** typed against the relevant `Beat*Payload` from `frontend/lib/speakable/schema.ts`. No `any`. No `unknown`. No prop drilling.
2. **No hardcoded colors.** Use CSS variables matching the visual style guide §4 tokens (`--speakable-body`, `--speakable-muted`, `--speakable-accent`, `--speakable-callout-bg`, `--speakable-table-border`, etc.). Define the variables in `frontend/components/speakable/speakable.css` (or as inline CSS via `style={{}}` if the project doesn't have a global CSS path — check `frontend/app/globals.css` first; if it has CSS variables, add to it; otherwise create the new file).
3. **Light + dark.** Variables are scoped to a `.speakable-prose` class (or whatever wrapper `Speakable.tsx` uses). Use `[data-theme="dark"]` selectors inside that scope to swap palettes per visual-style-guide §4.2.
4. **Mobile rules** per visual-style-guide §6.6 (mini-table collapses to stacked cards on `< 640px`).
5. **No decorative chrome** — flat, magazine-column aesthetic.
6. **`label` (eyebrow) is optional everywhere** — render it only when present.
7. **Spacing tokens** — every margin/padding maps to one of `--space-1` through `--space-6` per visual-style-guide §5.
8. **`BeatMiniTable`** — sticky header on overflow, mobile-collapse to stacked `BeatGroupedParagraphs`-like cards.
9. **`BeatCallout`** — distinct background, optional left rail, used sparingly.

### Acceptance

- TypeScript strict-clean; no `any`.
- Each primitive renders without console warnings on the visual story page (deliverable 1.7).
- Light + dark visually verified.
- On mobile breakpoint (< 640px), `BeatMiniTable` collapses cleanly.
- Reads cleanly aloud (the TTS serializer in 1.5 walks these payloads via the schema, not the rendered DOM, so this is a no-op visual-correctness check).

Commit: `feat(speakable): Phase 1.2 — 7 layout primitives`.

---

## 10. Deliverable 1.7 — Visual story page (do this before per-archetype layouts)

This is a **dev-only page** that exercises every primitive with sample data. It's how you verify §1.2 visually before composing them into archetype layouts.

### Path
`frontend/app/dev/speakable-primitives/page.tsx`.

### Behaviour
- Renders one section per primitive, each with hardcoded sample data covering the typical use case.
- Toggle for light / dark theme (via the existing `ThemeContext` if present at `frontend/components/question/ThemeContext.tsx`, else a local toggle).
- Mobile-responsive — should look correct at 320px, 640px, 1024px+.
- Accessible only at `/dev/speakable-primitives`. Not linked from the public site. Do not add a nav entry.

### Acceptance
- Page loads without error.
- All 7 primitives render.
- Light + dark + mobile spot-check passes.

Commit: `feat(speakable): Phase 1.7 — visual story page for primitives`.

---

## 11. Deliverable 1.3 — Per-archetype layouts

Seven layout components, one per archetype. Each composes the primitives in the right order with the right beat-kind labels.

### Path
`frontend/components/speakable/layouts/`:
- `Conceptual.tsx` (A)
- `Comparison.tsx` (B)
- `Internals.tsx` (C)
- `Scenario.tsx` (D)
- `Design.tsx` (E)
- `SystemDesign.tsx` (F)
- `Behavioral.tsx` (G)
- `index.ts` exporting a `LayoutFor[archetype]` map.

### Implementation rules

1. **Each component takes a `SpeakableA` / `SpeakableB` / ... shape** from the schema. Strict types, no narrowing in the body — the wrapper does the narrowing.
2. **Render order:**
    - Hook (typography role `hook` from style guide).
    - Each beat in `beats[]` order, dispatching to the correct primitive based on `beat.layout`.
    - Cap (typography role `cap`, italic).
    - `followup_handoff` rendered as a small chip row below the cap, using the `--speakable-muted` color, label `"Likely follow-ups"`.
3. **Subtle archetype tweaks** per plan §10.2:
    - **D Scenario** — `step_by_step` ordered list gets a faint left rail connector.
    - **E Design** — `options` (which is `BeatGroupedParagraphs` content) renders side-by-side as cards on desktop, stacked on mobile.
    - **F System Design** — phases render with clear section breaks, each as its own labeled block.
    - **G Behavioural** — STAR ribbon labels (S / T / A / R) above each beat, with Reflection getting a distinct treatment.
4. **No hardcoded text** — all copy comes from the data.

### Acceptance
- Each archetype layout renders against a hand-built fixture (one per archetype) — fixtures live in the visual story page (extend §1.7 to add an "Archetype layouts" section).
- TypeScript strict-clean.

Commit: `feat(speakable): Phase 1.3 — 7 per-archetype layouts`.

---

## 12. Deliverable 1.4 — Unified wrapper + Legacy fallback

The renderer entry point. Single source of truth for "render the Speakable for this question".

### Paths
- `frontend/components/speakable/Speakable.tsx` — the wrapper.
- `frontend/components/speakable/Legacy.tsx` — the markdown fallback.
- `frontend/components/speakable/index.ts` — re-exports.

### `Speakable.tsx`

Props: a single `SpeakableEither` (from the schema). Behaviour:

```tsx
export function Speakable({ source }: { source: SpeakableEither }) {
  if (source.kind === "v2" && source.v2.speakable_status === "approved") {
    const v2 = source.v2;
    switch (v2.archetype) {
      case "A": return <Conceptual data={v2} />;
      case "B": return <Comparison data={v2} />;
      // ...all 7
    }
  }
  // anything else → legacy
  if (source.kind === "legacy") return <Legacy data={source.legacy} />;
  // v2 present but not approved yet — also fall back to legacy if available, otherwise render nothing
  return null;
}
```

The renderer **always falls through to legacy** when the v2 isn't `approved`. This is the §14.5 contract.

### `Legacy.tsx`

Renders the legacy markdown blob as it currently renders — not pixel-different from today. **Crucial**: copy the rendering rules out of the existing `QuestionPageLayout.tsx` lines ~475–525 (the green "Interview Answer" card with hook line + body, copy button, mark-complete button) and the `PreviewArticle.tsx` `speakableComponents` block. Both call sites in §1.9 will replace their inline rendering with `<Speakable source={legacy} />` once `Legacy.tsx` is verified to produce identical output.

The simplest first version: just embed the existing JSX from `QuestionPageLayout.tsx`'s speakable block into `Legacy.tsx` verbatim. Then both call sites use the same component. The duplication between Question and Preview pages goes away in §1.9.

### Acceptance
- `Speakable.tsx` compiles strict-clean.
- `Legacy.tsx` renders the worked-example legacy text byte-identically to the current `QuestionPageLayout.tsx` block (verify by reading both side by side).
- The wrapper's branching is exhaustive on `archetype` (TS exhaustiveness check via `never`).

Commit: `feat(speakable): Phase 1.4 — unified Speakable wrapper + Legacy fallback`.

---

## 13. Deliverable 1.5 — TTS-clean serializer

Pure function from `SpeakableV2` to a single string with natural pause cues.

### Path
`frontend/lib/speakable/toSpeech.ts`.

### Behaviour
- Walks the v2 in beat order: hook, then each beat's payload, then cap.
- Per-layout reading rules from `visual-style-guide.md` §6.x and `lint-rules.md` §7.7:
    - `paragraph` / `callout` → read `text`.
    - `paragraphs` → read each, separated by a `". "` natural pause.
    - `grouped_paragraphs` → read each as `"<heading>: <text>."` with a small inter-group pause.
    - `bullets` → enumerate as `"first, …; second, …; third, …"` etc.
    - `ordered_list` → enumerate with explicit "first / second / third / fourth / fifth / sixth / seventh / next" sequence words.
    - `mini_table` → read row-by-row, axis-name first: `"On <axis>, <column1> is <value1>, while <column2> is <value2>."`.
- Apply `tts_overrides` (Map<string, string>) by simple substring replacement on the assembled string.
- Strip residual markdown: `**bold**`, `_italic_`, `` `code` `` (replace backticks with nothing; the override map should have already normalised code identifiers).
- Replace common symbols inline: `==` → "double equals", `!=` → "not equals", `<` → "less than", `>` → "greater than", `&&` → "and", `||` → "or", `->` → "to", `=>` → "becomes". Only replace the **standalone** symbols, not symbols inside identifiers — use word-boundary regex.
- Return one clean string ready to feed `SpeechSynthesisUtterance`.

### Tests (inline, no new test runner required)
Add a `__tests` block at the bottom that runs in dev only (`if (process.env.NODE_ENV !== "production")`). Or add a small `frontend/lib/speakable/toSpeech.test.ts` if a test runner is already configured (check `frontend/package.json`).

Test cases:
1. The §16 worked example serialises to a clean string with no `*`, no backtick, no `**`.
2. `mini_table` with 2 columns, 3 axes serialises row-by-row with axis-name pauses.
3. `ordered_list` with 5 steps serialises with sequence words.
4. `tts_overrides` substitutions are applied.

### Acceptance
- TS strict-clean.
- Manual run on the §16 example: output reads naturally aloud (verify mentally).

Commit: `feat(speakable): Phase 1.5 — TTS-clean serializer`.

---

## 14. Deliverable 1.6 — Read-aloud button

Button + audio-page integration.

### Paths
- `frontend/components/speakable/ReadAloudButton.tsx` — the new button.
- Edit to `frontend/app/mock-interviews/audio/page.tsx` — wire the button in (do not break the existing audio page; the existing recognition + synthesis logic stays).

### Button behaviour
- Props: `{ source: SpeakableEither }`.
- On click: if `source.kind === "v2" && status === "approved"`, run `toSpeech(source.v2)` and feed to `SpeechSynthesisUtterance`. Otherwise, use the existing legacy text path (extract the existing legacy text the same way the current page does).
- Stop button toggles to "Stop reading" while speaking.
- No autoplay. User-initiated only.

### Audio-page integration
- The current `frontend/app/mock-interviews/audio/page.tsx` has its own `SpeechSynthesisUtterance` usage (around lines 100–250). The new button **does not replace** that page's existing logic; it's a separate component the page can use for the question being practiced.
- Locate the place where the current page reads the speakable answer aloud and replace that inline call with the new `<ReadAloudButton source={...}/>` component, preserving the exact triggering UX.

### Acceptance
- The button appears wherever the current audio page reads aloud.
- Reading uses `toSpeech.ts` for v2-approved questions, legacy text otherwise.
- No regression to the existing audio mock page's recognition / transcript flow.

Commit: `feat(speakable): Phase 1.6 — ReadAloudButton + audio-page wiring`.

---

## 15. Deliverable 1.8 — Admin review UI

Where humans approve `pending_review` v2 to flip them to `approved`.

### Paths
- `frontend/app/admin/speakable-review/page.tsx` — the page.
- `frontend/app/api/admin/speakable-review/route.ts` — minimal API route(s) that mutate `complete-qa.json` files on disk.
- (No DB. JSON-on-disk mutations only.)

### Page behaviour
- Lists every question with `speakable_status === "pending_review"`. Group by pillar (P01–P12). Counts at the top.
- Click a question → side-by-side view:
    - **Left:** the legacy speakable rendered via `<Legacy>`.
    - **Right:** the v2 rendered via `<Speakable source={{kind: "v2", v2}}>`. Force render even though status isn't `approved` (use a debug prop, not by mutating data).
    - **Above:** lint score (call the lint script via the API) + golden-reference comparison link + TTS preview button (uses `ReadAloudButton`).
    - **Buttons:** Approve, Reject (with notes), Send back to agent (= reset to `pending_review` with notes appended).
- Approve flips `speakable_status` to `approved` in the JSON file.
- Reject flips to `pending_handcraft` with a notes field.
- Send back to agent flips to `pending_review` with notes appended (this is a no-op action while no agents run, but included for parity with Phase 3's flow).

### API behaviour
- `GET /api/admin/speakable-review/list` — returns the `pending_review` queue.
- `GET /api/admin/speakable-review/lint?question=<slug>` — runs `audit_speakable.py --check <path> --json` and returns the result.
- `POST /api/admin/speakable-review/approve` — body `{ question_slug, decision: "approve" | "reject" | "send_back", notes? }`. Mutates the JSON.

### Auth
- For Phase 1, gate the page behind a simple env var check (`process.env.SPEAKABLE_ADMIN_KEY`) compared to a query param `?key=...` — not production-grade, but enough to prevent accidental access. Note in `HUMAN-REVIEW-QUEUE.md` that real auth needs to come before any external use.

### Acceptance
- The page loads.
- The list is empty in current state (no `pending_review` items exist yet) — render an "All clear" empty state.
- The mutation API successfully writes a `complete-qa.json` field change end-to-end (test with a hand-crafted `pending_review` fixture you create temporarily, then revert before commit).

Commit: `feat(speakable): Phase 1.8 — admin review UI for pending_review queue`.

---

## 16. Deliverable 1.9 — Old-renderer integration (the riskiest step)

Replace the inline speakable rendering in `QuestionPageLayout.tsx` and `PreviewArticle.tsx` with the unified `<Speakable>` wrapper.

### Files touched
- `frontend/components/question/QuestionPageLayout.tsx` — replace lines ~475–525 (the green "Interview Answer" card block) with `<Speakable source={...}/>`.
- `frontend/components/preview/PreviewArticle.tsx` — replace the `speakableComponents` block + the `speakable-prose` rendering with `<Speakable source={...}/>`.
- **Remove** the four hardcoded OOP CSS rules in `PreviewArticle.tsx` lines ~908–927 (the `data-pillar` selectors). Styling is now driven by `archetype + pillar + layout` from the data, not by string-matching headings.

### Critical guardrail
For every existing question (all of which are `legacy` status today), the rendered output must be **byte-equivalent or visually-identical** to today. Before committing, manually verify:
1. Open one OOP question (e.g., `oop-four-pillars-java`) on `/[domainSlug]/[stackSlug]/[questionSlug]` — confirm visual parity with `git stash`'d version.
2. Open one non-OOP question (e.g., a Spring question) — confirm parity.
3. Open the preview page (`/preview/...`) for the same questions — confirm parity.

If any visible difference appears (font, spacing, copy button position, etc.), the `<Legacy>` component is wrong. Fix it before committing.

### Acceptance
- Both call sites compile.
- Visual parity confirmed via the three manual checks above.
- The hardcoded OOP CSS is gone.
- ReadLints clean on both files.

Commit: `feat(speakable): Phase 1.9 — unify renderer paths via Speakable wrapper`.

---

## 17. Deliverable 1.10 — Health dashboard generator

Already implemented inside `audit_speakable.py` (the `--all --report` flag). Just verify it produces a sensible `content/_audits/speakable_health.md` showing:

- By-pillar table: `legacy` count, `pending_review` count, `approved` count, etc.
- By-archetype table: same axis.
- Overall lint-green percentage (against `pending_review` + `approved` v2 — `legacy` is excluded since there's no v2 to lint).
- Top 10 highest-failing questions (when v2 exists).

Run `python scripts/audit_speakable.py --all --report` once at the end; commit the generated `speakable_health.md`:

Commit: `feat(speakable): Phase 1.10 — health dashboard initial snapshot`.

---

## 18. Status tracking — `docs/speakable/PHASE-STATUS.md`

Update after every deliverable. Carry over the Phase 0 history. Format:

```markdown
# Speakable run — live status

Last update: <ISO timestamp>
Phase: 1
Run mode: Phase 1 only — will halt at Phase 1 completion
Time elapsed (this phase): <hh:mm>

## Phase 0 summary (carried over)
- 8 deliverables done, see PHASE-0-REPORT.md.

## Phase 1 deliverables
- [x] Preflight: §16-1 fix + ceilings.json + depth-markers.json — committed (`<sha>`)
- [x] 1.1 audit_speakable.py — committed
- [ ] 1.2 layout primitives — in progress
- [ ] 1.7 visual story page
- [ ] 1.3 per-archetype layouts
- [ ] 1.4 Speakable wrapper + Legacy fallback
- [ ] 1.5 toSpeech.ts
- [ ] 1.6 ReadAloudButton + audio-page wiring
- [ ] 1.8 admin review UI
- [ ] 1.9 renderer integration
- [ ] 1.10 health dashboard initial run

## Open items routed to human
See HUMAN-REVIEW-QUEUE.md (carried-over count + new from this phase).
```

Update after each deliverable commit. One commit per status update is fine (label them `chore(speakable): update Phase 1 status`).

---

## 19. Commit policy (recap)

- **One commit per deliverable.** Same convention as Phase 0.
- **Never `git push`.**
- **Never `git commit --amend`.**
- **Never `--no-verify`.**
- **Stage explicitly.** `git add <specific paths>` only — never `git add .`. The repo has hundreds of unrelated unstaged changes that you must not pick up.
- Status updates can be a separate small commit per deliverable.

---

## 20. Self-checks before each commit

1. **Compile / runtime check.** TS strict-clean for frontend; `python scripts/audit_speakable.py --help` returns without error for the lint.
2. **No content edits leaked.** `git diff --cached -- content/ content-md/` returns empty for every commit.
3. **No schema / codex edits.** `git diff --cached -- frontend/lib/speakable/schema.ts scripts/speakable_schema.json codex/` returns empty for every commit.
4. **Visual parity confirmed** for §1.9 via the three manual checks before committing.

---

## 21. Final report — `docs/speakable/PHASE-1-REPORT.md`

When all deliverables are committed, write this report. Mirror the Phase 0 report structure:

```markdown
# Speakable redesign — Phase 1 report

Completed: <ISO timestamp>
Total wall time: <hh:mm>
Total commits: 11 (deliverables) + N (status / preflight)

## Deliverable status
| # | Path | Status | Commit | Notes |
|---|---|---|---|---|
| Preflight | scripts/data/word-ceilings.json + depth-markers.json | done | <sha> |  |
| 1.1 | scripts/audit_speakable.py | done | <sha> | passes on §16 fixture, score ≥ 90 |
| 1.2 | frontend/components/speakable/primitives/* | done | <sha> | 7 primitives, light + dark, mobile |
| 1.7 | frontend/app/dev/speakable-primitives/page.tsx | done | <sha> |  |
| 1.3 | frontend/components/speakable/layouts/* | done | <sha> | 7 layouts |
| 1.4 | frontend/components/speakable/Speakable.tsx + Legacy.tsx | done | <sha> | byte-identical legacy parity |
| 1.5 | frontend/lib/speakable/toSpeech.ts | done | <sha> |  |
| 1.6 | frontend/components/speakable/ReadAloudButton.tsx | done | <sha> | wired into mock-interviews/audio |
| 1.8 | frontend/app/admin/speakable-review/* | done | <sha> | empty queue, JSON-on-disk mutations |
| 1.9 | renderer integration | done | <sha> | OOP hardcoded CSS removed |
| 1.10 | content/_audits/speakable_health.md | done | <sha> | initial snapshot, all questions = legacy |

## Coverage stats
- Files added: <count>
- Files modified: <count>
- Lines of code (approx): TS=<n>, Python=<n>
- Lint script: passes on §16 fixture, score = <n>
- Existing questions visually unchanged: confirmed (3 manual checks)

## What this run did NOT do
- No `complete-qa.json` modified (zero touches to content/)
- No schema or codex edits (Phase 0 outputs locked)
- No git push
- No Phase 2 (golden references) — that's a fresh chat
- No Phase 3 (parallel agents) — gated by Phase 2

## Open items routed to human
Carried over from Phase 0 + new from Phase 1: see HUMAN-REVIEW-QUEUE.md.

## Recommended next step
Review the Phase 1 deliverables. Visit `/dev/speakable-primitives` and `/admin/speakable-review` locally. When the human reviewer is satisfied, run Phase 2 in a fresh chat: hand-craft the 7 golden references + produce the top-30 hand-craft list.
```

Update `PHASE-STATUS.md` one final time: `Phase 1: complete`.

---

## 22. Stop condition

Phase 1 is **done** when:

1. All 10 functional deliverables exist at the paths in §6 + the preflight is committed.
2. All commits are local; nothing pushed.
3. The lint script passes on the §16 worked-example fixture with score ≥ 90.
4. Existing legacy questions render visually unchanged (the 3-question manual check passed).
5. `PHASE-1-REPORT.md` and `PHASE-STATUS.md` are written and committed.
6. `git diff --name-only HEAD~12 HEAD -- content/ content-md/ codex/ frontend/lib/speakable/schema.ts scripts/speakable_schema.json` returns empty (proof: zero touches to locked content / locked Phase 0 outputs).

When all six are true: **post one summary message to the user and stop.** Do not start Phase 2. The user runs Phase 2 in a fresh chat after reviewing.

---

## 23. Summary message format (when you stop)

```
Phase 1 complete.

Deliverables (10 of 10 + 1 preflight):
- scripts/data/word-ceilings.json + depth-markers.json (preflight)
- scripts/audit_speakable.py
- frontend/components/speakable/primitives/* (7 components)
- frontend/app/dev/speakable-primitives/page.tsx
- frontend/components/speakable/layouts/* (7 archetype layouts)
- frontend/components/speakable/Speakable.tsx + Legacy.tsx
- frontend/lib/speakable/toSpeech.ts
- frontend/components/speakable/ReadAloudButton.tsx (+ audio-page wiring)
- frontend/app/admin/speakable-review/* (page + API)
- renderer integration (QuestionPageLayout + PreviewArticle, OOP hardcoded CSS removed)
- content/_audits/speakable_health.md (initial snapshot)

Verification:
- Lint script passes on §16 worked-example fixture, score = <n>
- Existing legacy questions render visually unchanged (3 manual checks)
- TS strict-clean across all new frontend files
- No content / no schema / no codex modified

Reports:
- docs/speakable/PHASE-1-REPORT.md
- docs/speakable/PHASE-STATUS.md (Phase 1: complete)
- docs/speakable/HUMAN-REVIEW-QUEUE.md updated

Commits: 11 deliverable + N status / preflight, none pushed.

Next step: review locally. Visit /dev/speakable-primitives and /admin/speakable-review (key=...). When approved, run Phase 2 in a fresh chat to hand-craft the 7 golden references + produce the top-30 list.
```

That's the run. Read the plan + Phase 0 artefacts first, do the preflight, then grind through the 10 functional deliverables in the order in §6.
