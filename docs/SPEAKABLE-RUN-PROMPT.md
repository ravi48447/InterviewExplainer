# Speakable Redesign — Autonomous Run Prompt

> **Paste the contents of this file into a new Cursor chat.** The plan you must follow is at `docs/SPEAKABLE-PLAN.md` in this same repo. Read that first, in full. This prompt only fixes execution boundaries; the plan defines what "done" means.

---

## 1. Mission

Execute the entire Speakable redesign — Phases 0, 1, 2, 3, 4 — in a single autonomous run. No human intervention until you finish. You may run for as long as it takes (expect 6–10 hours of wall time across ~500 questions). When you finish, every Speakable v2 must exist on disk in `pending_review` status, lint-green, awaiting human approval to flip live. **No end-user-visible change happens during this run.** That is the safety contract.

The plan is `docs/SPEAKABLE-PLAN.md`. It is the source of truth for everything: archetypes (§3), pillar register (§4), data model (§5), codex (§6), lint rubric (§7), word ceilings (§8), depth markers (§9), renderer (§10), phase deliverables (§11), parallel-agent model (§12), regression prevention (§14). All §15 decisions are locked. Read the plan first, then come back to this prompt for execution rules.

---

## 2. Locked decisions you operate under

All §15 items are decided. Restating the ones that affect your run:

- **§15.16** — Agents iterate against the lint until lint-green. No fixed re-attempt cap. Escape on impasse only: (a) score plateaus across 5 consecutive iterations with no improvement, (b) per-question budget hit (use **20 lint-correction iterations** as the budget — §15B.2), (c) 3 critic-rejections after lint-green. On any escape: mark `speakable_status: pending_handcraft` with a structured diagnosis and move on.
- **§15B.1 codex sourcing** — You may not scrape the internet. Seed the codex (`codex/phrasings.json`, `codex/examples.json`) from your training-data knowledge of canonical phrasings on GeeksforGeeks / Baeldung / JavaTpoint / Oracle docs. Tag every entry with `"source": "agent-seeded"` so a human can later swap to scraped or hand-curated entries without churn.
- **§15B.3 visual style guide split** — Phase 0 ships the text spec (`visual-style-guide.md`); Phase 1 ships the live primitives. You build both, but they are separate deliverables.
- **§14.3 top-30 hand-craft list** — These are **never** agent-drafted. You produce the list at `content/_audits/top30-handcraft.md` (rank by current question file count + module priority order in `content/java-backend-intermediate/_index.json`), mark each as `speakable_status: priority_handcraft`, and **skip them entirely**. They wait for a human pass.
- **§2.7 Speakable is the answer, not coaching** — Layer 3 banned vocab (no "you should say…", "tell the interviewer…", etc.) is zero-tolerance. The text addresses no one.
- **§2.8 Visual rhythm is part of the answer** — Every beat declares a `layout`. No paragraph > 60 words. Lists for 3+ items. Tables for 3+ comparison axes. Ordered lists for sequences. Visual variety per Speakable.

---

## 3. Hard boundaries — never cross these

1. **Do not push to git remote.** Commit locally only. The user reviews everything before pushing.
2. **Do not flip any `speakable_status` to `approved`.** Every v2 you produce ends as `pending_review`. The renderer still serves legacy for every question.
3. **Do not modify any existing `speakable_answer` field, any markdown under `content-md/`, or any existing `direct_answer` / `key_points` / `interviewer_intent` field.** You read those as raw material; you write to a new `speakable_v2` field on the same question object.
4. **Do not draft any of the top-30 hand-craft list.** Mark them `priority_handcraft` and skip.
5. **Do not change the visual rendering of any *existing* legacy Speakable** (the renderer must keep working for un-migrated questions). The `Legacy.tsx` fallback path stays intact throughout.
6. **Do not delete any legacy data.** Soak before deletion is a separate, future PR.
7. **Do not invent decisions the plan doesn't authorise.** If the plan is silent on a content decision, queue it in `docs/speakable/HUMAN-REVIEW-QUEUE.md` with the question, your best-instinct choice, and continue. Never halt waiting for the user.

---

## 4. Quality substitutes for human gates (since you run alone)

The plan has three human gates. While you run, replace them with these mechanical substitutes — they are stricter than the regular path so quality holds.

### 4.1 Smoke-test gate → auto-critic gate
The plan's smoke test has a human reading the first output of each pillar's agent. While you run alone:
- After producing the **first question's v2 in any pillar**, run `audit_speakable.py` and the critic step in §4.4. The lint score must be **≥ 88** (stricter than the regular ≥ 80 floor) and the critic must approve.
- If either fails, retry up to 3 times. If still failing, halt that pillar (mark every remaining question in the pillar `pending_handcraft_blocked_by_smoke`) and continue with the other pillars.
- If **3 or more pillars** fail their smoke gate, halt the entire run and write `docs/speakable/RUN-HALTED.md` explaining why. Do not continue.

### 4.2 Human review queue → no substitute, just enforce status
Every v2 ends `pending_review`. The renderer's per-status routing (§14.5) ensures no v2 goes live. This is the load-bearing safety property of the whole run.

### 4.3 Top-30 hand-craft → skip with a list
Produce `content/_audits/top30-handcraft.md` with the 30 questions, ranked. Set their status to `priority_handcraft`. These get a v2 only when a human writes them.

### 4.4 The auto-critic step
After every v2 is lint-green, before marking it `pending_review`, run a critic prompt **in your own context** (not a separate sub-agent — just internal reasoning) that asks five fresh-eyes questions:
1. If a junior engineer reads this aloud cold, do they sound natural and confident?
2. Does the depth marker (§9) actually land, or is it pasted in?
3. Is anything in here a Layer-1, Layer-2, or Layer-3 banned phrase that the lint missed (e.g. paraphrased)?
4. Does any beat read as a wall of text (≥ 60 words in one paragraph) despite the layout field?
5. Compared to its archetype's golden reference, is this clearly equally good or better?

If any answer is "no" / "uncertain", re-iterate with notes. Cap at 3 critic-rejections before declaring `pending_handcraft`.

### 4.5 Random 5% per-pillar self-audit
After a pillar finishes, sample 5% of its `pending_review` items at random. Re-read each with the §4.4 critic eyes. Any that fail go back to a `pending_recheck` state for one more pass. This catches drift across long agent runs.

---

## 5. Execution order — work the phases in this exact sequence

### Phase 0 (target: 60–90 min)
Build all design artefacts under `docs/speakable/` and `codex/`. Spec only — no code yet, no content edits.

| # | Deliverable | Path | Acceptance |
|---|---|---|---|
| 0.1 | Archetype taxonomy | `docs/speakable/archetypes.md` | All 7 archetypes (A–G) with: 1-line definition, instinct skeleton (ordered beat list), required vs forbidden beats, soft+hard word ceilings (mirror §8), 3 example questions, 1 fully-filled YAML example using the §5 schema. |
| 0.2 | Pillar register | `docs/speakable/pillar-register.md` | All 12 pillars (P01–P12) with: pillar name, content conventions, topic must-includes, voice tweaks, pillar-specific standard examples, archetypes commonly seen. Use `content/java-backend-intermediate/_index.json` as the source of truth for module/pillar mapping. |
| 0.3 | Schema | `frontend/lib/speakable/schema.ts` + `scripts/speakable_schema.json` | TS types matching §5 (discriminated union by archetype, beat union by `kind` + `layout`). JSON Schema usable by the lint. Both compile / validate clean against the worked example in §16 of the plan. |
| 0.4 | Lint rules | `docs/speakable/lint-rules.md` | Mirrors §7 in full, including visual rhythm rules §7.5. Each rule has a clear pass/fail definition. |
| 0.5 | Codex | `docs/speakable/familiarity-codex.md` + `codex/phrasings.json` + `codex/examples.json` + `codex/banned.json` | ≥ 60 topics covered (every pillar represented). 3–5 canonical phrasings per topic, 1 standard example per topic. Banned vocab in 3 layers per §6.4 (every Layer-2 + Layer-3 phrase from the plan included). Every entry tagged `"source": "agent-seeded"`. |
| 0.6 | Word ceilings | `docs/speakable/word-ceilings.md` | Mirror §8 verbatim. |
| 0.7 | Depth markers | `docs/speakable/depth-markers.md` | Mirror §9 verbatim. |
| 0.8 | Visual style guide | `docs/speakable/visual-style-guide.md` | Typography scale, vertical rhythm rules, color tokens (light + dark, in CSS-variable form), spacing tokens, mobile breakpoints, ASCII layout diagrams of each of the 7 primitives in §10.3. |

**Commit after Phase 0:** `feat(speakable): Phase 0 — foundation specs and codex`

### Phase 1 (target: 90–120 min)
Build all tooling. No content edits.

| # | Deliverable | Path | Acceptance |
|---|---|---|---|
| 1.1 | Lint script | `scripts/audit_speakable.py` | Validates structured Speakables against §7. Emits 0–100 score per §14.2. CLI: `--check <path>`, `--all`, `--fail-on warn`. Writes `content/_audits/speakable_health.md`. Detects all 3 banned-vocab layers, all visual rhythm rules, all per-beat ceilings, all depth markers per archetype. |
| 1.2 | Layout primitives | `frontend/components/speakable/primitives/*.tsx` | All 7 from §10.3: `BeatParagraph`, `BeatParagraphs`, `BeatGroupedParagraphs`, `BeatBullets`, `BeatOrderedList`, `BeatMiniTable`, `BeatCallout`. Light + dark. Mobile-responsive. |
| 1.3 | Per-archetype layouts | `frontend/components/speakable/layouts/*.tsx` | One per archetype A–G, composed from §1.2 primitives. |
| 1.4 | Unified Speakable wrapper + Legacy fallback | `frontend/components/speakable/Speakable.tsx` + `Legacy.tsx` | Speakable picks v2 only if `speakable_status === "approved"`. Otherwise falls back to `Legacy.tsx` which renders the existing markdown blob. **The legacy path must keep working for every existing question; the user should see no visible change in this run.** |
| 1.5 | TTS-clean serializer | `frontend/lib/speakable/toSpeech.ts` | Pure function. Layout-aware (§10.7). Used by 1.6 and the audio mock page. |
| 1.6 | Read-aloud button | `frontend/components/speakable/ReadAloudButton.tsx` | Calls 1.5 + browser SpeechSynthesis. Wire into `frontend/app/mock-interviews/audio/page.tsx` without disturbing existing logic. |
| 1.7 | Visual story page | `frontend/app/dev/speakable-primitives/page.tsx` | Renders all 7 primitives with sample data. Used as a manual visual check. |
| 1.8 | Admin review UI | `frontend/app/admin/speakable-review/page.tsx` | Lists `pending_review` items per pillar; shows legacy + v2 side-by-side; shows lint score; "Approve" / "Reject (with notes)" / "Send back to agent" buttons. **Buttons write status to disk via a small admin API; no DB.** Fine to be visually plain — function over polish. |
| 1.9 | Old renderer integration | edits to `frontend/components/question/QuestionPageLayout.tsx` and `frontend/components/preview/PreviewArticle.tsx` | Replace the existing speakable rendering paths with the unified wrapper from 1.4. The four hardcoded OOP CSS rules in `PreviewArticle.tsx` lines 908–927 are removed. **Visual output for legacy questions must remain unchanged.** Verify with manual snapshot of one OOP question + one non-OOP question. |

**Commit after Phase 1:** `feat(speakable): Phase 1 — lint, primitives, renderer, TTS, admin UI`

### Phase 2 (target: 30–45 min)
Hand-craft the 7 golden references — these calibrate every agent run downstream.

| Archetype | Question | Pillar |
|---|---|---|
| A Conceptual | `java-concurrency / threads-and-lifecycle` | P01 |
| B Comparison | a `==` vs `equals` question under `core-java / comparisons` | P01 |
| C Internals | a HashMap question under `java-collections` | P01 |
| D Scenario | a debugging question under `production-sre` | P11 |
| E Design | abstract class vs interface under `java-oop / oop-principles` | P01 |
| F System Design | URL shortener under `system-design-cases` | P06 |
| G Behavioural | one STAR question under `behavioral` | P12 |

Find each question's `complete-qa.json` from `content/java-backend-intermediate/_index.json` + filesystem search. Hand-craft each as a v2 directly in the JSON. Each must:
- Be lint-green at ≥ 90 (golden references must clear a stricter bar).
- Render correctly in both Question and Preview pages.
- Sound natural when read through `toSpeech.ts`.
- Get `"speakable_status": "approved"` (the only ones in the whole run that you set to `approved` — they are reference templates).

After Phase 2: produce `content/_audits/top30-handcraft.md` ranking the 30 highest-priority questions for human hand-craft (use module priority order from `_index.json` and presence of `key_points` length as a proxy for traffic). Mark those 30 questions' status as `priority_handcraft`. **Do not draft v2 for any of them.**

**Commit after Phase 2:** `feat(speakable): Phase 2 — 7 golden references + top-30 hand-craft list`

### Phase 3 (target: 4–6 hours)
The bulk migration. You play the role of all 12 "agents" sequentially.

For each pillar in order P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12:

1. **Generate the per-pillar agent brief** at `docs/speakable/agent-briefs/<pillar>.md` per §12.3 — the brief is what you would feed a real parallel agent; producing it as an artefact means a future re-run can just load it. Include the pillar's question list, archetype assignments, golden references, lint rules, layout primitives reference, the 3 banned-vocab layers, the work loop, and the §15.16 escape hatches.
2. **Auto-classify** every question in the pillar (assign archetype A–G). Write `content/_audits/archetype_assignments.csv` (append per-pillar). Low-confidence assignments get reviewed mid-loop, not skipped.
3. **Smoke gate (§4.1)** — produce v2 for the first non-`priority_handcraft` question in the pillar. Run lint (must hit ≥ 88) + auto-critic (§4.4). If both pass, proceed. If not, retry up to 3 times. If still failing, halt this pillar (mark all remaining questions `pending_handcraft_blocked_by_smoke`) and move to the next pillar.
4. **Bulk processing** — for every remaining non-`priority_handcraft` question:
    - Read existing `speakable_answer` + `key_points` + `direct_answer` + `interviewer_intent` as raw material.
    - Refine freely. Write `speakable_v2` with `speakable_status: pending_review`.
    - Lint loop with §15.16 escape hatches: max 20 iterations OR 5-iteration plateau OR 3 critic rejections → `pending_handcraft`.
    - Update progress in `docs/speakable/PHASE-STATUS.md` after every 10 questions.
5. **Per-pillar 5% self-audit (§4.5)** — re-critique a random sample. Re-queue any failures.
6. **Commit** after each pillar:
    - `feat(speakable): Phase 3 — P0X <pillar name> migrated to pending_review`

If the run is interrupted mid-pillar, on resume you read `PHASE-STATUS.md`, find the last completed question, and continue from the next one.

### Phase 4 (target: 30 min)
Governance scaffolding. No content edits.

| # | Deliverable | Path | Acceptance |
|---|---|---|---|
| 4.1 | Pre-commit hook | `.git/hooks/pre-commit` (template at `scripts/install-hooks.sh`) | Runs `audit_speakable.py` on staged files. Blocks `fail`. |
| 4.2 | CI gate | `.github/workflows/speakable-audit.yml` | Runs the lint on every PR; comments diff in `speakable_health.md`. |
| 4.3 | New-question scaffolder | `scripts/new_question.py` | Generates a new `complete-qa.json` shell with `speakable_v2` already populated to the archetype's required beats. |
| 4.4 | Health dashboard | `content/_audits/speakable_health.md` | Final-state dashboard with by-pillar, by-archetype percentages, and counts of `legacy` / `pending_review` / `priority_handcraft` / `approved` / `pending_handcraft` / `rolled_back`. |

**Commit after Phase 4:** `feat(speakable): Phase 4 — governance hooks, CI gate, scaffolder, dashboard`

---

## 6. Self-monitoring contract

You must keep `docs/speakable/PHASE-STATUS.md` updated at all times. Format:

```markdown
# Speakable run — live status

Last update: <ISO timestamp>
Phase: <0|1|2|3|4>
Substep: <e.g. "P03 question 18 of 47">
Lint health: <% pending_review at score ≥ 80>
Items in pending_handcraft: <N>
Items in pending_handcraft_blocked_by_smoke: <N>
Items in priority_handcraft: <N>
Time elapsed: <hh:mm>

## Pillar progress
- [x] Phase 0 (8 deliverables)
- [x] Phase 1 (9 deliverables)
- [x] Phase 2 (7 golden + top-30 list)
- [ ] Phase 3
    - [x] P01 — 87 questions (3 → pending_handcraft, 84 → pending_review)
    - [ ] P02 — in progress, 12 of 38
    - ...
- [ ] Phase 4

## Open questions for human
See HUMAN-REVIEW-QUEUE.md (count: <N>)
```

Update this file:
- After each Phase 0/1/2 deliverable.
- Every 10 questions inside Phase 3.
- After each pillar in Phase 3.
- Final write at end of run.

This is the user's only window into your run. Keep it accurate.

---

## 7. Commit policy

- Commit after each named milestone (every Phase, every pillar inside Phase 3, every major Phase 1 deliverable). Use `git add` + `git commit` only — **never `git push`**.
- Commit message format: `<type>(speakable): <phase>: <short summary>`. E.g. `feat(speakable): Phase 3 — P05 architecture migrated (24 of 24 to pending_review)`.
- Never use `git commit --amend` (the user must see your full history).
- Pre-commit hook (after Phase 4.1) will start running on your own commits; that's expected and good — it gates your own work. If a commit fails because of a lint failure, fix it and commit again — never `--no-verify`.

---

## 8. Resume protocol

If you are restarted (new chat with the same repo state):

1. Read `docs/speakable/PHASE-STATUS.md` first.
2. Read `docs/SPEAKABLE-PLAN.md` second.
3. Read this prompt third.
4. Locate your last complete unit of work (the last fully-committed item in `git log`).
5. Continue from the next unit. Do not re-do completed work.

The run is **idempotent at the question level**: if a question already has a `speakable_v2` field with status `pending_review` or stricter, skip it.

---

## 9. Final report

At the end of the run, write `docs/speakable/RUN-COMPLETE-REPORT.md`:

- One row per Phase 0/1/2/4 deliverable: status (done | partial | blocked) + path.
- One row per pillar in Phase 3: questions seen / `pending_review` / `pending_handcraft` / `priority_handcraft` / `pending_handcraft_blocked_by_smoke`.
- The `HUMAN-REVIEW-QUEUE.md` count and a 1-line summary of categories.
- Any deliverable you marked `partial` or `blocked` with a 1-paragraph reason.
- Recommended next human action (e.g., "Hand-craft the top-30 list, then approve `pending_review` queue starting with P12 which is smallest").

Then update `PHASE-STATUS.md` one last time with `Phase: complete`.

---

## 10. What "done" looks like

Done is when **all of the following** are true:

1. Every Phase 0, Phase 1, Phase 2 (golden 7), Phase 4 deliverable is committed.
2. Every pillar P01–P12 in Phase 3 has been processed end-to-end (all questions in each pillar have one of these statuses: `pending_review`, `pending_handcraft`, `priority_handcraft`, `pending_handcraft_blocked_by_smoke`, `approved` (only the 7 golden), or kept as `legacy` because the file had no Speakable to begin with).
3. `RUN-COMPLETE-REPORT.md` is written and committed.
4. `PHASE-STATUS.md` shows `Phase: complete`.
5. No `complete-qa.json` shows a `speakable_status` of `approved` other than the 7 Phase-2 golden references.
6. The user's existing site visually renders unchanged (legacy fallback is intact for everything not yet approved).

When all six are true, post one message summarising what was done and what the human's next step is. Then stop. Do not start anything new.

---

## 11. One last thing — the voice you write Speakables in

You are not a teacher. You are not a coach. You are the candidate, mid-interview, in your best calm form. The Speakable text **is your spoken answer**. It does not say "you should…", "tell the interviewer…", "the candidate should…". It does not call back to where the user has read this before. It is the answer itself, in beats, with depth and rhythm and natural cadence.

Read every Speakable you write aloud in your head one time before lint. If it doesn't sound like a person speaking — if it sounds like an article, a tutorial, or a coach — it isn't done.
