# Speakable Redesign — Phase 2 Run Prompt

> **Paste this entire file into a new Cursor chat in this repo.** Phase 0 + Phase 1 are complete (see `docs/speakable/PHASE-0-REPORT.md` and `docs/speakable/PHASE-1-REPORT.md`). Phase 2 hand-crafts the **7 golden references** — one per archetype A–G — and produces the **top-30 hand-craft list**. This is the only phase where humans/agents directly write `speakable_v2` content. Phase 3 (parallel agents) imitates these golden references for the rest of the corpus, so quality here is load-bearing.

---

## 1. What this run does (and what it does *not* do)

You are running **Phase 2 only** of the Speakable redesign.

You will:
1. Hand-craft **7 golden references**, one per archetype, each scoring **≥ 90** on the lint and marked `speakable_status: approved` (the only `approved` items in the entire corpus until Phase 3 review).
2. Produce **`content/_audits/top30-handcraft.md`** ranking the 30 highest-priority questions for human-only hand-craft. Mark those 30 questions' `speakable_status: priority_handcraft` so Phase 3 agents skip them.
3. Resolve **3 small open items** in `docs/speakable/HUMAN-REVIEW-QUEUE.md` that block Phase 3 (see §6 preflight below).

You will **not**:
- Touch any `complete-qa.json` outside the 7 golden targets + the 30 priority-handcraft slugs (the latter only get a single-field `speakable_status` flip — no v2 yet).
- Run any agent fan-out (Phase 3).
- Modify the Phase 0 schema or codex (locked).
- Modify the Phase 1 lint script or renderer (locked).
- `git push`.

Expected wall time: **2–3 hours**. Mostly content thinking, not code.

---

## 2. Read these references first (in this order)

Before writing a single golden reference:

1. **`docs/SPEAKABLE-PLAN.md`** — re-skim §2 (principles, especially 2.6, 2.7, 2.8), §3 (archetypes), §10 (renderer), §16 (the worked example — that's already a near-golden A).
2. **`docs/speakable/PHASE-0-REPORT.md`** + **`docs/speakable/PHASE-1-REPORT.md`** — what's been built and where.
3. **`docs/speakable/archetypes.md`** — required vs forbidden beats per archetype, decision tree, fully-filled YAML examples.
4. **`docs/speakable/pillar-register.md`** — voice tweaks per pillar, pillar-specific standard examples.
5. **`docs/speakable/familiarity-codex.md`** + the three codex JSONs (`codex/phrasings.json`, `codex/examples.json`, `codex/banned.json`) — the canonical phrasings and standard examples you must echo silently.
6. **`docs/speakable/word-ceilings.md`** + **`scripts/data/word-ceilings.json`** — per-beat caps you must respect.
7. **`docs/speakable/depth-markers.md`** + **`scripts/data/depth-markers.json`** — the depth marker each archetype must land.
8. **`docs/speakable/lint-rules.md`** — the executable spec your output must satisfy.
9. **`frontend/lib/speakable/schema.ts`** — the exact JSON shape every golden reference must take.
10. **`docs/speakable/HUMAN-REVIEW-QUEUE.md`** — the 3 items you'll resolve in preflight.

After reading, run the lint once to confirm the toolchain is wired up:

```bash
python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16
# expect: WARN, score 96/100 (the §3-vs-§16 warn — preflight resolves it)
```

---

## 3. Locked decisions you operate under

- **Refinement, not preservation** (§2.6). Read the legacy `speakable_answer` + `key_points` + `direct_answer` + `interviewer_intent` as raw material, then **rewrite freely**. Quality is judged by the lint, not by what survived from the legacy.
- **Speakable is the answer, not coaching about it** (§2.7). Layer 3 banned vocab is zero-tolerance.
- **Visual rhythm is part of the answer** (§2.8). Every beat declares a `layout`. No paragraph > 60 words. Lists for 3+ items. Tables for 3+ comparison axes. Ordered lists for sequences.
- **Lint score floor is ≥ 80 absolute; golden references must hit ≥ 90** (§14.2).
- **Familiarity from the codex.** Every golden reference's definition-equivalent beat must contain ≥ 1 canonical anchor from `codex/phrasings.json` for the topic. Examples come from `codex/examples.json` unless `familiarity_override: true` with a documented reason.
- **Audience default is `beginner`.** `voice` defaults to `friendly`. Don't promote to `familiar` / `advanced` / `neutral` / `technical` unless the pillar register explicitly says so.
- **`speakable_status: approved` is allowed only for these 7 golden references in this phase.** Every other status flip is forbidden for now (§14.5 contract).

---

## 4. Hard boundaries

1. **Do not `git push`.** Local commits only.
2. **Do not modify** the schema (`frontend/lib/speakable/schema.ts`, `scripts/speakable_schema.json`), the codex (`codex/*.json`), the lint (`scripts/audit_speakable.py`), the per-beat ceilings JSON / markdown, the depth markers JSON / markdown, the visual style guide, the renderer primitives / layouts / wrapper, the Legacy fallback, the TTS serializer, or the admin review UI. **All of those are locked from Phase 0 / Phase 1.** If you find a real bug in any of them during Phase 2, log to `HUMAN-REVIEW-QUEUE.md` with a clear description — **do not fix it in Phase 2**. The fix lands as a separate cleanup PR after Phase 2.
3. **Do not modify any `complete-qa.json` other than the 7 golden targets and the 30 priority-handcraft files.** And for the 30, the only allowed change is adding a top-level `"speakable_status": "priority_handcraft"` to the **question object** (not a `speakable_v2`).
4. **Do not stage unrelated working-tree changes.** As of the last status check, the repo has hundreds of pre-existing modifications and untracked files outside the Speakable scope. Stage explicit paths only — never `git add .`.
5. **Do not invent decisions.** Log unknowns to `HUMAN-REVIEW-QUEUE.md` with your best-instinct call and continue. Never halt waiting for the user.
6. **Do not skip the preflight in §6.**

---

## 5. Quality bar (what "done" means per golden reference)

A golden reference is **done** when **all of these** are true:

1. The v2 lives at the top level of its question's `complete-qa.json`, on the question object that owns the legacy `speakable_answer` section. The legacy section is left untouched alongside it.
2. `speakable_status: "approved"` (and only for these 7).
3. `python3 scripts/audit_speakable.py --check <path>` reports **PASS with score ≥ 90** for that question. No fail-level violations. Warns acceptable only with a logged justification in the Phase 2 report.
4. The TTS-clean serialised text (run mentally — read `frontend/lib/speakable/toSpeech.ts` once and dry-run the §16 fixture through it in your head) reads naturally aloud — no awkward symbol pronunciations, no markdown leaking through.
5. The `/dev/speakable-primitives` page extended with a "Phase 2 — golden references" section renders the v2 cleanly in light + dark.
6. Real-page visual check on the question's actual route renders cleanly (the Speakable wrapper kicks into v2 mode when status is `approved`).

For the **top-30 list**:

7. `content/_audits/top30-handcraft.md` exists, lists 30 questions ranked, has every entry's pillar / archetype-suggestion / question slug / file path / current legacy-Speakable word count / human-handcraft priority rank.
8. Each of the 30 questions has `"speakable_status": "priority_handcraft"` set on its question object in its `complete-qa.json`.
9. The lint correctly skips `priority_handcraft` items in `--all` mode (it should — the existing `legacy` skip path covers it; verify).

---

## 6. Preflight — resolve the 3 blocking review-queue items

Before drafting any golden reference, settle these. Each is a single decision, then a small artefact change.

### 6.1 §3-vs-§16 — is `how_to_use` required or recommended for archetype A?

**Context.** Plan §3 lists `how_to_use` as a required beat for archetype A. The §16 worked example doesn't include it. The lint currently treats it as soft-required (warn, not fail).

**Decision (locked here).** **`how_to_use` is RECOMMENDED, not required, for archetype A.** Rationale: most A-shaped questions don't have a "how to use" angle separate from `example` — e.g. "what are threads" doesn't need an explicit how-to-use beat. Where it does fit (e.g. "what's a stream API"), the agent will include it naturally.

**What to change.**
- Edit `docs/speakable/archetypes.md`: move `how_to_use` from required to recommended for archetype A. Update the per-archetype table at the top accordingly.
- Edit `docs/speakable/lint-rules.md` §7.1.3: clarify "soft-required" handling for archetype A's `how_to_use`. Already correct in the executable lint; the doc should say so explicitly.
- No change to `scripts/audit_speakable.py` (lint already reports as warn).
- Mark §3-vs-§16 as **resolved** in `HUMAN-REVIEW-QUEUE.md`.

Commit: `chore(speakable): resolve §3-vs-§16 — how_to_use is recommended for archetype A`.

### 6.2 §16-MISSING-FIELDS — make §16 canonical

**Context.** The §16 YAML uses `archetype: conceptual` (a long-form alias the lint normalises) and omits `speakable_status`. Production data must use `archetype: A` and an explicit `speakable_status`.

**Decision.** Update §16 to canonical form: `archetype: A`, add `speakable_status: approved` (since this is the canonical fixture).

**What to change.**
- Edit `docs/SPEAKABLE-PLAN.md` §16 — change `archetype: conceptual` → `archetype: A`, add `speakable_status: approved`. Re-run `python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` and confirm PASS / score still ≥ 90 (after 6.1 above the §3-vs-§16 warn should also be gone).
- Mark §16-MISSING-FIELDS as **resolved** in `HUMAN-REVIEW-QUEUE.md`.

Commit: `chore(speakable): canonicalise §16 worked example (archetype A, speakable_status approved)`.

### 6.3 RENDERER-1 — OOP per-pillar accent colors in preview

**Context.** Phase 1.9 removed the four hardcoded OOP CSS rules in `PreviewArticle.tsx` per the explicit Phase 1 instruction. The OOP four-pillars page in `/preview/...` no longer shows per-pillar accent colors (purple / blue / green / amber for Encapsulation / Inheritance / Polymorphism / Abstraction). This is a deliberate trade-off.

**Decision.** **Accept the trade-off — do nothing.** The accent colors were string-matching question text, not data-driven, and would never apply to any other question. The new layout (`grouped_paragraphs`) provides clean visual separation via subheadings, dividers, and rhythm — the per-pillar colors were decorative, not functional.

**What to change.**
- Mark RENDERER-1 as **resolved (accepted trade-off)** in `HUMAN-REVIEW-QUEUE.md` with the above rationale.
- No code change.

Commit (combined with 6.1 + 6.2 if you like): `chore(speakable): close RENDERER-1 with rationale`.

### 6.4 (Bonus, low effort) — Two small lint polish items

The Phase 1 verification surfaced two minor UX issues. Fix them now since you'll be running the lint heavily in this phase:

**6.4a — Wrong-shape file should error, not silently pass.**
In `scripts/audit_speakable.py` `cmd_check` (around the `--check` branch), if `data.get("questions")` is None / missing / not a list, print `error: <path> does not look like a complete-qa.json (no top-level "questions" array)` to stderr and return exit code 2 before falling through to the empty summary.

**6.4b — Rename `fails` array to be unambiguous.**
The current `fails (N)` array contains both zero-tolerance violations (which produce overall FAIL) and non-zero-tolerance violations (which only deduct score and may still PASS). Rename the human-text rendering label from `fails (N)` to `violations (N)`. The JSON output may keep the old key for backward compat, or also rename — your call. Update `lint-rules.md` reporting section (§7.8) to match.

Commit: `fix(speakable): lint UX — wrong-shape error + rename fails to violations`.

After preflight (6.1–6.4), re-run:

```bash
python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16
# expect: PASS, score ≥ 95 (no warn)
```

---

## 7. The 7 golden references — locked targets (slugs and paths verified)

These slugs and file paths were verified against the catalogue at the time of writing. If a slug has moved, log to the queue and pick the closest equivalent in the same module — note the substitution in the Phase 2 report.

| # | Archetype | Question slug | Pillar | File |
|---|---|---|---|---|
| G1 | A Conceptual | `java-thread-lifecycle-states` | P01 | `content/java-backend-intermediate/java-concurrency/threads-and-lifecycle/complete-qa.json` |
| G2 | B Comparison | `difference-between-equals-and-double-equals-java` | P01 | `content/java-backend-intermediate/core-java/scenario-based/complete-qa.json` |
| G3 | C Internals | `hashmap-collision-handling` | P01 | `content/java-backend-intermediate/java-collections/collections-internals/complete-qa.json` |
| G4 | D Scenario | `cpu-spikes-java-applications-debugging` | P11 | `content/java-backend-intermediate/production-sre/debugging-production/complete-qa.json` |
| G5 | E Design | `abstract-class-vs-interface-java-when-to-use` | P01 | `content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json` |
| G6 | F System Design | `design-url-shortener` | P06 | `content/java-backend-intermediate/system-design-cases/url-shortener/complete-qa.json` |
| G7 | G Behavioural | `handle-technical-disagreements` | P12 | `content/java-backend-intermediate/behavioral/conflict-resolution/complete-qa.json` |

**Why G7 is conflict-resolution, not the STAR-method file's `debug-complex-production-issue`:** the latter overlaps thematically with G4 (both about production debugging) — picking conflict-resolution gives the golden references genuine archetype-G coverage (interpersonal STAR) without redundant content.

For each:

1. Open the existing `complete-qa.json`. Locate the question object (the one that matches the slug inside the `questions: []` array).
2. Read the legacy `speakable_answer` content + `key_points` + `direct_answer` + `interviewer_intent` to ground yourself in what the question is actually asking.
3. Hand-craft a v2 in the structured shape (see §8 below for the per-archetype shape rules).
4. Insert it into the question object as a top-level `"speakable_v2"` key, alongside (not replacing) the existing legacy section. Set `"speakable_status": "approved"` on the question object too (top-level, not inside the v2).

> **Schema note**: per `frontend/lib/speakable/schema.ts`, `speakable_status` lives **inside** `SpeakableV2` (not as a sibling). Verify by reading the schema. If the schema places it inside, put it inside; if at the question level, put it there. The lint and the renderer agree on whichever the schema says — do **not** add it in two places.

5. Run `python3 scripts/audit_speakable.py --check <path>` for the file. Iterate until that question shows **PASS with score ≥ 90** with no fails. Don't worry about other questions in the same file — they'll show as `legacy` (no v2 yet).
6. Commit per golden reference: `feat(speakable): Phase 2 — golden reference G<N> (<archetype>) for <slug>`.

---

## 8. Per-archetype hand-craft shape (cheat sheet)

Cross-reference `archetypes.md` for the full spec. The shapes below are the minimum you must produce. Each beat's `layout` is your choice but must satisfy the visual rhythm rules (§7.5 of `lint-rules.md`).

### G1 — Archetype A (Conceptual): Thread basics & lifecycle
- **Hook** ≤ 25 words. Plain, calm, declarative.
- **Beats:** `definition` (paragraph) → `why_exists` (paragraph) → `parts_or_states` (`grouped_paragraphs` for the 5 thread states OR `ordered_list` since states imply progression) → `example` (paragraph) → `pitfalls` (`bullets`).
- **Depth marker** (mandatory): the thread lifecycle states named explicitly (codex topic-id `thread-basics`).
- **Familiarity anchors:** ≥ 1 from codex `thread-basics` phrasings (e.g., "a unit of execution within a process", "OS threads in HotSpot").
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 3 items (golden references over-deliver: virtual threads, Executor framework, deadlock anatomy, etc.).

### G2 — Archetype B (Comparison): `==` vs `equals`
- **Hook** ≤ 25 words.
- **Beats:** `what_each_is` (paragraph) → `differences` (`mini_table` — REQUIRED for B with 3+ axes; here axes are reference vs value, primitives, String pool, custom equals) → `when_to_pick` (paragraph) → `tiny_example` (paragraph).
- **Depth marker** (mandatory): the gotcha — String pool / interned strings make `==` accidentally work for some literals (codex topic-id `==-vs-equals`).
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items.

### G3 — Archetype C (Internals): HashMap internals
- **Hook** ≤ 25 words.
- **Beats:** `mental_model` (paragraph or `paragraphs`) → `mechanism` (paragraph or `grouped_paragraphs` for buckets / hash / load-factor stages) → `edge_cases` (`bullets`) → `failure_mode` (paragraph) → `example` (paragraph, optional).
- **Depth marker** (mandatory): the failure mode beat must name a specific production failure — **resize storm under load** or **collision-driven O(n) lookup at high collision rates** (codex topic-id `hashmap-internals`).
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items.

### G4 — Archetype D (Scenario): Debugging a production issue
- **Hook** ≤ 25 words.
- **Beats:** `clarify` (paragraph) → `hypothesis` (paragraph) → `step_by_step` (`ordered_list` — REQUIRED for D) → `tools` (`bullets` — must name ≥ 2 concrete tools from codex e.g. jstack, async-profiler, EXPLAIN, MDC, dashboards) → `tradeoff` (paragraph).
- **Depth marker** (mandatory): the tools beat names ≥ 2 concrete tools / dashboards / JVM flags (codex topic-id `incident-response`).
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items.

### G5 — Archetype E (Design): Abstract class vs interface — when to use which
- **Hook** ≤ 25 words.
- **Beats:** `optimising_for` (paragraph) → `options` (`grouped_paragraphs` — Interface / Abstract class) → `tradeoffs` (`bullets`) → `decision` (paragraph) → `rethink_if` (paragraph or `callout` — must contain a concrete threshold, e.g. "if you find yourself writing default methods on every interface method").
- **Depth marker** (mandatory): `rethink_if` beat with a concrete trigger condition (codex topic-id `abstract-class-vs-interface`).
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items.

### G6 — Archetype F (System Design / LLD): URL shortener
- **Hook** ≤ 25 words.
- **Beats:** `requirements_fr_nfr` (`grouped_paragraphs` — Functional / Non-functional) → `capacity` (paragraph with **concrete numbers**: e.g. 100M URLs / day → 1.2k QPS, 2 KB per record → 200 GB/yr) → `api` (paragraph or `bullets`) → `data_model` (paragraph or `mini_table`) → `high_level` (paragraph) → `bottleneck_deep_dive` (paragraph — pick one, e.g. ID generation collision under load) → `tradeoffs` (paragraph).
- **Depth marker** (mandatory): concrete capacity numbers in the `capacity` beat (this is F's equivalent of a depth marker — §15.8).
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items.

### G7 — Archetype G (Behavioural / STAR): Tell me about a time
- **Hook** ≤ 25 words.
- **Beats:** `situation` → `task` → `action` → `result` → `reflection`. Use `paragraph` for each (STAR is naturally paragraph-shaped). Visual variety is achieved via the labelled STAR ribbon in the renderer, not via layout switching.
- **Depth marker** (recommended, not mandatory for G): the `reflection` beat names what would be done differently next time + a concrete metric / outcome.
- **Cap** ≤ 25 words.
- **Followup handoff** ≥ 2 items (typical STAR follow-ups: scope challenge, conflict variant, etc.).

> **All 7:** voice rules (≤ 16 wpm avg, FK ≤ 9, contractions ≥ 30%, active voice ≥ 90%, zero second-person imperatives, no Layer 1 hi-tech beyond 2 per 1000 words, zero Layer 2, zero Layer 3) apply to every golden reference. **The lint will catch you.** Iterate.

---

## 9. The top-30 hand-craft list

Produce `content/_audits/top30-handcraft.md` and flip 30 question statuses.

### Ranking method

Walk every `complete-qa.json` under `content/`. For each question, compute a priority score:

```
priority_score = 0.5 × pillar_priority_index + 0.3 × key_points_count_normalised + 0.2 × archetype_difficulty
```

Where:

- `pillar_priority_index`: P01 = 1.0; P02 = 0.95; P03 = 0.9; P04 = 0.85; P05 = 0.8; P06 = 0.95 (system design is high-traffic interview territory); P07 = 0.7; P08 = 0.65; P09 = 0.7; P10 = 0.65; P11 = 0.85 (production / SRE = senior signal); P12 = 0.9 (behavioural = every interview).
- `key_points_count_normalised`: question's `key_points` array length divided by the max across the corpus, clamped to [0, 1]. (`key_points` length is a rough proxy for "this is a meaty topic worth investing in.")
- `archetype_difficulty`: A=0.5, B=0.4, C=0.7, D=0.7, E=0.8, F=1.0, G=0.6 (system design + design questions reward hand-crafting).

Sort descending. Take the **top 30**. Exclude the 7 golden references already hand-crafted (don't double-count).

If `_index.json` ranking data is missing for a module, fall back to: take 2–3 highest-`key_points` questions per pillar, then top up to 30 by `key_points` length across all pillars.

### Output file

`content/_audits/top30-handcraft.md` with this shape:

```markdown
# Top-30 hand-craft list

Generated: <ISO timestamp>
Method: priority_score = 0.5 × pillar_priority + 0.3 × key_points_norm + 0.2 × archetype_difficulty
Excludes the 7 Phase 2 golden references.

| Rank | Question slug | Pillar | Suggested archetype | Module | File | key_points len | priority_score |
|---:|---|---|---|---|---|---:|---:|
| 1 | <slug> | P0X | A/B/C/D/E/F/G | <module-slug> | <relative path> | <n> | 0.91 |
| 2 | ... |
| ... up to 30 ... |

## How to use this list
1. Each question listed here has `speakable_status: priority_handcraft` set on its question object.
2. Phase 3 agents skip every `priority_handcraft` item.
3. A human writes v2 for each, sets `speakable_status: approved`, runs the lint, commits.
4. Once all 30 are `approved`, the renderer picks up v2 for them automatically.

## Substitutions
Any deviations from the algorithmic ranking (e.g. a question pinned manually) listed here.
```

### Status flip

For each of the 30 questions: open the file, find the matching question object, add a top-level `"speakable_status": "priority_handcraft"` to the question object. **Do not add a `speakable_v2`** — that's the human's job in a future hand-craft pass.

Run `python3 scripts/audit_speakable.py --all` after the flips: every one of the 30 should be classified as `legacy` still (since no v2 exists; the new status field doesn't change `legacy` classification). If the lint script special-cases `priority_handcraft` differently, adjust the lint to treat it as `legacy` for now (no v2 to lint = no failure).

Commit: `feat(speakable): Phase 2 — top-30 hand-craft list + priority_handcraft flips`.

---

## 10. Verification gates (run all after each major step)

After each golden reference commit:

```bash
# Lint that one file end-to-end:
python3 scripts/audit_speakable.py --check <path-to-its-complete-qa.json>
# Expect: that question = PASS score ≥ 90, others = legacy.
```

After all 7 golden references:

```bash
# Full sweep:
python3 scripts/audit_speakable.py --all --report
# Expect: 7 approved (PASS), 30 priority_handcraft (legacy classification), rest = legacy.
# Confirm content/_audits/speakable_health.md updated correctly.
```

After top-30 flips:

```bash
git diff --name-only -- content/ | wc -l
# Expect: <= 37 (7 golden + up to 30 priority — some files may host multiple golden / priority items).
```

Visual checks:

1. Extend `frontend/app/dev/speakable-primitives/page.tsx` with a "Phase 2 — golden references" section showing all 7 v2 fixtures inline. Verify each renders cleanly in light + dark.
2. Run the dev server locally (or just inspect the integration code paths). Visit one of the 7 golden-reference question pages — confirm the v2 renders (the wrapper picks v2 once `speakable_status === "approved"`) without breaking the surrounding page chrome.
3. Read each v2 aloud through the read-aloud button (or by mentally running `toSpeech.ts`). Confirm natural cadence, no stray symbols.

---

## 11. Status tracking — `docs/speakable/PHASE-STATUS.md`

Update after every major step. Carry over Phase 0 + Phase 1 history. Format:

```markdown
# Speakable run — live status

Last update: <ISO timestamp>
Phase: 2
Run mode: Phase 2 only — will halt at Phase 2 completion
Time elapsed (this phase): <hh:mm>

## Phase 0/1 summary (carried over)
- Phase 0: 8 deliverables (see PHASE-0-REPORT.md).
- Phase 1: 11 deliverables (see PHASE-1-REPORT.md).

## Phase 2 progress
- [x] Preflight 6.1 §3-vs-§16 resolved (commit <sha>)
- [x] Preflight 6.2 §16-MISSING-FIELDS resolved (commit <sha>)
- [x] Preflight 6.3 RENDERER-1 closed with rationale (commit <sha>)
- [x] Preflight 6.4 lint UX polish (commit <sha>)
- [x] G1 — Conceptual / threads (commit <sha>, score <n>)
- [ ] G2 — Comparison / == vs equals
- [ ] G3 — Internals / HashMap
- [ ] G4 — Scenario / debugging
- [ ] G5 — Design / abstract vs interface
- [ ] G6 — System Design / URL shortener
- [ ] G7 — Behavioural / STAR
- [ ] Top-30 hand-craft list (priority_handcraft flips)
- [ ] Phase 2 report

## Open items routed to human
See HUMAN-REVIEW-QUEUE.md (carried-over count + new from this phase).
```

---

## 12. Commit policy

- One commit per major step (each preflight item, each golden reference, the top-30 list, the report).
- **Never `git push`.** **Never `--amend`.** **Never `--no-verify`.**
- **Stage explicitly.** `git add <specific paths>` only.
- Status updates can be a separate small commit per step.

---

## 13. Final report — `docs/speakable/PHASE-2-REPORT.md`

When all 7 + top-30 + preflight are committed:

```markdown
# Speakable redesign — Phase 2 report

Completed: <ISO timestamp>
Total wall time: <hh:mm>
Total commits: 4 (preflight) + 7 (golden) + 1 (top-30) + N (status / report) = <count>

## Preflight
| Item | Resolution |
|---|---|
| §3-vs-§16 | how_to_use → recommended for archetype A; archetypes.md + lint-rules.md updated |
| §16-MISSING-FIELDS | §16 canonicalised: archetype A, speakable_status approved |
| RENDERER-1 | accepted trade-off (rationale documented) |
| 6.4a lint UX wrong-shape | fixed: errors with exit 2 |
| 6.4b violations rename | done in human text + lint-rules.md |

## Golden references
| # | Archetype | Slug | File | Lint score | Commit |
|---|---|---|---|---:|---|
| G1 | A | <slug> | <path> | <n> | <sha> |
| ... |

## Top-30 hand-craft list
- File: `content/_audits/top30-handcraft.md`
- 30 questions flipped to `priority_handcraft`
- Excluded the 7 golden references from ranking

## Lint health snapshot
After full `--all --report` run:
- approved: 7 (the golden references)
- priority_handcraft: 30
- legacy: <total - 37>
- pending_review: 0
- pending_handcraft: 0
- pending_handcraft_blocked_by_smoke: 0
- rolled_back: 0

## Visual / TTS checks
- Dev story page extended with "Phase 2 — golden references" section: all 7 render in light + dark
- Real-page render verified on <count> question pages (list)
- TTS dry-run notes per golden reference (any phrasings the agent flagged as awkward → log to queue)

## What this run did NOT do
- No agent fan-out (Phase 3)
- No `git push`
- No schema / codex / lint / renderer modifications (locked)

## Open items routed to human
- See HUMAN-REVIEW-QUEUE.md (any new items found while hand-crafting)

## Recommended next step
Review the 7 golden references on the live site (locally). Read each aloud via the read-aloud button. Check the top-30 list and adjust the priority order if needed. When approved, run **Phase 3** in a fresh chat. Phase 3 fans out 12 parallel "agents" (one per pillar, sequentially in a single chat) to refine every non-priority-handcraft Speakable against the plan, using the 7 golden references as the imitation template.
```

---

## 14. Stop condition

Phase 2 is **done** when:

1. All 4 preflight items are committed.
2. All 7 golden references exist, each lint-PASS at score ≥ 90, each marked `speakable_status: approved`.
3. `content/_audits/top30-handcraft.md` is committed with 30 ranked entries.
4. 30 questions have `speakable_status: priority_handcraft` set.
5. `python3 scripts/audit_speakable.py --all --report` runs to completion with: `approved=7`, `priority_handcraft=30`, `legacy=rest`, no fails.
6. `PHASE-2-REPORT.md` and `PHASE-STATUS.md` are written and committed.
7. Dev story page extended with the golden-reference visual check.
8. No file outside the allowed scope (golden targets, top-30 status flips, the 4 preflight artefacts, the report, the dev story page, `speakable_health.md`) is modified.

When all eight are true: post one summary message and **stop**. Do not start Phase 3.

---

## 15. Summary message format (when you stop)

```
Phase 2 complete.

Preflight (4):
- §3-vs-§16 resolved (how_to_use recommended)
- §16-MISSING-FIELDS resolved (canonicalised)
- RENDERER-1 closed (accepted trade-off)
- Lint UX polish (wrong-shape error + violations rename)

Golden references (7 of 7):
- G1 (A Conceptual) <slug>: PASS, score <n>
- G2 (B Comparison) <slug>: PASS, score <n>
- G3 (C Internals) <slug>: PASS, score <n>
- G4 (D Scenario) <slug>: PASS, score <n>
- G5 (E Design) <slug>: PASS, score <n>
- G6 (F System Design) <slug>: PASS, score <n>
- G7 (G Behavioural) <slug>: PASS, score <n>

Top-30 hand-craft list:
- 30 questions ranked, content/_audits/top30-handcraft.md
- All 30 marked speakable_status: priority_handcraft

Health snapshot:
- approved: 7 | priority_handcraft: 30 | legacy: <rest> | rest: 0

Reports:
- docs/speakable/PHASE-2-REPORT.md
- docs/speakable/PHASE-STATUS.md (Phase 2: complete)

Commits: <count>, none pushed.

Next step: human reviews the 7 golden references on the live site (locally), confirms TTS sounds natural, sanity-checks the top-30 ranking. When approved, run Phase 3 in a fresh chat — 12 parallel-agent fan-out using these golden references as the imitation template.
```

That's the run. Read everything in §2 first, do the preflight (§6), then craft G1 → G7, then build the top-30 list, then the report.
