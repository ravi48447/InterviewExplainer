# Speakable lint rubric

> Mirrors `SPEAKABLE-PLAN.md` §7 in full. The lint script `scripts/audit_speakable.py` (Phase 1.1) is the executable form of this doc; this doc is the human-readable spec the script must implement. A Speakable v2 is **done** when the script exits 0 against it.
>
> Locked decisions reflected here: §15.7 (per-beat ceilings), §15.12 (lint score floor ≥ 80 absolute, no comparison to legacy), §15.16 (agent autonomy on re-runs — see Appendix A), §15.17 (Layer 3 banned vocab), §15.18 (visual rhythm rules).

Each rule below has a **pass criterion** (single line, mechanically checkable) and a **fail mode example** (single line, what the rule catches). No prose paragraphs masquerading as rules.

---

## 7.1 Structural rules

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.1.1 | `archetype` is one of `A B C D E F G`. | `archetype: conceptual_lite` → fail. |
| 7.1.2 | `pillar` is one of `P01`–`P12`. | `pillar: P13` → fail. |
| 7.1.3 | All beats listed as **required** for this archetype are present (see `archetypes.md` per-archetype table). **Recommended beats** (currently archetype A's `how_to_use`) carry zero score penalty for absence — they are quality signals the agent should consider when the topic warrants but never gate-blocking. (Resolution of HUMAN-REVIEW-QUEUE §3-vs-§16 — Phase 2 preflight: `how_to_use` is recommended for archetype A, not required.) The `SOFT_REQUIRED_BEATS` dict in `audit_speakable.py` is intentionally empty post-Phase-2; future soft-required beats (warn-level penalty) can land there without a refactor. | Archetype B missing `differences` beat → fail. Archetype A missing `how_to_use` → no penalty (it is recommended, not required). |
| 7.1.4 | No beat listed as **forbidden** for this archetype is present. | Archetype B carrying a `parts_or_states` beat → fail. |
| 7.1.5 | `hook` is non-empty and within the hook word cap (35 hard, see `word-ceilings.md`). | Empty hook, or 60-word hook → fail. |
| 7.1.6 | `cap` is non-empty and within the cap word cap (35 hard). | Empty cap → fail. |
| 7.1.7 | `followup_handoff` has ≥ 2 items. | One follow-up only → fail. |
| 7.1.8 | The whole document validates against `scripts/speakable_schema.json` (JSON Schema 2020-12). | `layout: bullets` with no `items[]` payload → fail (caught here and again at 7.5.5). |
| 7.1.9 | `speakable_status` is one of `legacy / pending_review / approved / rolled_back / priority_handcraft / pending_handcraft / pending_handcraft_blocked_by_smoke`. | `speakable_status: in_progress` → fail. |

---

## 7.2 Familiarity rules

The familiarity rules enforce **invisible familiarity** (principle 2.3) and the **no-coaching** discipline (principle 2.7). They are the gate against the Speakable sounding either novel-where-it-should-be-canonical, or instructional-where-it-should-be-direct.

The three banned-vocabulary layers are sourced from `codex/banned.json`; the Phase 0 seed list lives there.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.2.1 | The definition-equivalent beat (`definition` for A, `mental_model` for C, `what_each_is` for B, `clarify`+`hypothesis` for D, `optimising_for` for E, `requirements_fr_nfr` for F, `situation` for G) contains ≥ 1 canonical anchor from `codex/phrasings.json` for the question's topic. | OOP definition beat with no "data plus the methods", "blueprint", "instance", or other canonical anchor → fail. |
| 7.2.2 | If the question's topic has a standard example in `codex/examples.json`, the example beat uses it — unless `familiarity_override: true` is set with a `familiarity_override_reason`. | Inheritance example using `Truck extends Vehicle` instead of the standard `Dog extends Animal` without override → fail. |
| 7.2.3 | **Layer 2 banned vocabulary — meta-references.** Zero hits. One match = fail. | Any of: `you've seen this`, `the textbook line`, `the famous example`, `every tutorial`, `as you've read`, `as we all know`, `you may have heard`, `the classic line`, etc. |
| 7.2.4 | **Layer 3 banned vocabulary — coaching / instructional phrasing.** Zero hits. One match = fail. (Principle 2.7.) | Any of: `you should say`, `tell the interviewer`, `in your answer`, `the candidate should`, `to impress the interviewer`, `make sure to mention`, `your reply should`, etc. |
| 7.2.5 | **Layer 1 banned vocabulary — generic hi-tech.** ≤ 2 hits per 1000 words across the whole Speakable. | Three "leverage" + one "battle-tested" in a 600-word answer → fail. |
| 7.2.6 | No Speakable beat addresses the reader as "you should", "you can", "you might want to", "remember to", or any second-person imperative directed at the reader. (See 7.3.5; this rule is the familiarity-side complement.) | "Remember to mention encapsulation here." → fail (also caught by 7.3.5). |

---

## 7.3 Voice rules

Mechanically-checkable spoken-English voice. The script tokenises the cleaned text (markdown stripped, code identifiers replaced with their TTS overrides, spoken-form text only) before scoring.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.3.1 | Average sentence length ≤ 16 words (across the whole Speakable, after cleaning). | A 28-word average → fail (essay voice). |
| 7.3.2 | Flesch-Kincaid Grade ≤ 9. | Grade 12 → fail (textbook voice). |
| 7.3.3 | Contractions ratio ≥ 30 % (count of `n't`/`'s`/`'re`/`'ll`/`'ve`/`'d` divided by qualifying verb forms). | "Do not", "it is", "you will" everywhere → fail. |
| 7.3.4 | Active voice ratio ≥ 90 % (passive constructions detected via "be + past participle" heuristic with auxiliary detection). | "The hashcode is computed by the JVM and is then used to ..." → fail. |
| 7.3.5 | Zero second-person imperatives directed at the reader (`notice that`, `remember to`, `consider this`, `keep in mind`, `bear in mind`, `note that`). | "Notice how Spring resolves the bean lazily." → fail. |
| 7.3.6 | One concept per sentence (heuristic: ≤ 2 commas plus zero semicolons in any single sentence, or warn if exceeded). | "HashMap is an array of buckets, and when collisions happen, which they do under high load, the bucket switches from a list to a tree, but only past threshold 8." → warn or fail. |
| 7.3.7 | Pronoun policy: `we` and `you` are allowed (declarative, not directive); `one` and `the developer` are not. | "One should always close the resource." → fail. |

---

## 7.4 Tightness rules

Length is controlled per-beat (see `word-ceilings.md`). Total length emerges from the per-beat sum.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.4.1 | Every beat is ≤ its hard cap from `word-ceilings.md`. | A 200-word `definition` beat in archetype A (cap 80) → fail. |
| 7.4.2 | ≥ 80 % of the beats sit at or below their soft ceiling. | 4 of 7 beats at the hard cap and only 3 at the soft → fail. |
| 7.4.3 | Total Speakable word count is within the archetype's expected range (between the summed-soft and summed-hard totals from `word-ceilings.md`). | Archetype B coming in at 750 words (expected ~290–430) → fail. |
| 7.4.4 | Every `differences` axis in archetype B is ≤ 45 words (per-axis hard cap). | One axis runs 80 words → fail. |

---

## 7.5 Visual rhythm rules

The "no walls of text" gate. Principle 2.8 is enforced here. The data model carries the `layout` field per beat; this section validates each layout choice.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.5.1 | **Paragraph length:** no single paragraph (in any beat, regardless of `layout`) exceeds 60 words. | A 90-word block in a `paragraph` beat → fail (must split to `paragraphs` or `grouped_paragraphs`). |
| 7.5.2 | **List-when-many:** any beat enumerating 3+ semantic items must use `bullets`, `ordered_list`, `mini_table`, or `grouped_paragraphs`. | Four pillars of OOP rendered as one prose paragraph in a `parts_or_states` beat with `layout: paragraph` → fail. |
| 7.5.3 | **Comparison gate:** in archetype B, the `differences` beat with 3+ axes must use `layout: mini_table`. | `differences` rendered as bullets with 4 axes → fail. |
| 7.5.4 | **Sequence gate:** `step_by_step` (archetype D) and any `parts_or_states` whose content implies order (lifecycle / phases / pipeline stages) must use `layout: ordered_list`. | Thread-lifecycle states rendered as bullets → fail. |
| 7.5.5 | **Layout-payload consistency:** the `layout` value and its payload field must match (`bullets` ⇒ `items[]`; `mini_table` ⇒ `columns[]` + `rows[]`; `ordered_list` ⇒ `steps[]`; `grouped_paragraphs` ⇒ `groups[]`; `paragraph` ⇒ `text`; `paragraphs` ⇒ `paragraphs[]`; `callout` ⇒ `text`). Schema-validated at 7.1.8. | `layout: mini_table` with no `columns[]` → fail. |
| 7.5.6 | **Visual variety:** within a single Speakable, beats use ≥ 2 distinct layout kinds across the full beat list. | Every beat in the answer is `layout: paragraph` → fail (whether wall-of-text or wall-of-bullets). |
| 7.5.7 | **Code density per beat:** ≤ 3 inline code identifiers (` `code` `) per beat, and zero multi-line code blocks. | A `mechanism` beat with 8 inline-code identifiers → fail. |
| 7.5.8 | **Callout discipline:** the `callout` layout is reserved for the depth-marker beat (or its archetype-equivalent) — at most one `callout` per Speakable. | Three callouts in one answer → fail (loses meaning). |

---

## 7.6 Depth rules

The depth marker is the proof-of-non-superficiality. Mandatory for A/B/C/D/E, recommended for G, equivalent for F. Full mapping in `docs/speakable/depth-markers.md`.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.6.1 | **A:** the topic-tagged depth-marker signal phrase from the codex is present in the `parts_or_states`, `pitfalls`, or `example` beat. | Thread answer that never names the lifecycle states → fail. |
| 7.6.2 | **B:** the gotcha phrase (codex-tagged) is present in the `differences`, `when_to_pick`, or `tiny_example` beat. | `==` vs `equals` answer that never mentions the String pool → fail. |
| 7.6.3 | **C:** the `failure_mode` beat is non-empty and contains a named failure-mode signal from the codex (resize storm / N+1 / rebalance / split-brain / deadlock / etc.). | HashMap internals answer with empty failure_mode beat → fail. |
| 7.6.4 | **D:** the `tools` beat names ≥ 2 concrete tools or outputs from the codex (jstack, EXPLAIN, async-profiler, dashboards, MDC, etc.). | Tools beat that says only "I'd check the logs" → fail. |
| 7.6.5 | **E:** the `rethink_if` beat is present and contains an "if"-style trigger plus a concrete threshold. | `rethink_if: "depends on context"` → fail. |
| 7.6.6 | **F:** the `capacity` and `bottleneck_deep_dive` beats each contain ≥ 1 numeric value with a unit (req/s, GB, ms, K, M, %). | Capacity beat that says "lots of users" → fail. |
| 7.6.7 | **G:** the `reflection` beat is non-empty. **Warn-only**, not fail (per §15.8). | Empty reflection → warn, included in the report, doesn't block lint-green. |

---

## 7.7 TTS-cleanness rules

The Speakable must read aloud cleanly via the Phase 1 TTS serialiser (`frontend/lib/speakable/toSpeech.ts`). The lint script applies `tts_overrides`, then strips markdown, then validates the spoken surface.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.7.1 | After TTS-serialisation, the text contains zero raw `*`, no backticks, no `_`, no `#`, no `>` block markers. | Bold `**inheritance**` left in the spoken stream → fail. |
| 7.7.2 | Every code identifier in the original text either has a TTS override entry (`tts_overrides`) or is a plain English word the TTS can handle. | `List<String>` with no override → fail. |
| 7.7.3 | Multi-line code blocks are not present in any beat (caught at 7.5.7); single-line code identifiers are summarised in spoken form when they are the focus of the beat. | A 6-line method signature inside a beat → fail. |
| 7.7.4 | List-typed beats render with natural enumeration cues in TTS ("first... second... third..." for `ordered_list`; pause-and-then for `bullets`). The serialiser owns this; the lint validates the output contains the cues. | An `ordered_list` that reads as a single run-on prose blob in TTS → fail. |
| 7.7.5 | `mini_table` reads row-by-row with the axis name pronounced ("on memory layout, ArrayList is array under the hood, while LinkedList is nodes with pointers"), not as a literal grid. | Mini-table read as "ArrayList LinkedList memory layout array under the hood nodes with pointers" → fail. |
| 7.7.6 | The hook and cap each end on a punctuation boundary the TTS recognises (`.` `?` `!`); no trailing comma or em-dash. | `cap: "and that's roughly the shape —"` → fail. |

---

## 7.8 Reporting

The script's output and aggregation contract.

| # | Pass criterion | Fail mode example |
|---|---|---|
| 7.8.1 | Per-question result is one of `pass / warn / fail`, with itemised reasons. | Any other status → script bug. |
| 7.8.2 | Each result includes a numeric **score 0–100** weighted as: structural 30, familiarity 20, depth 20, voice 20, tightness 10. | Missing score → script bug. |
| 7.8.3 | **Score floor: any v2 with score < 80 absolute is rejected** (per §15.12). The legacy score is **not** the comparison point — there is no "≥ legacy" rule. | Score 78 → fail. |
| 7.8.4 | Aggregate report at `content/_audits/speakable_health.md` shows: % passing per pillar (P01–P12), % passing per archetype (A–G), and the drift since the previous run committed to git. | Health report missing pillar-level breakdown → script bug. |
| 7.8.5 | CI mode (`--fail-on warn`) treats warnings as failures; default mode treats only `fail` as failures. | CI mode silently passing on warnings → script bug. |
| 7.8.6 | Per-question output records: `question_path`, `archetype`, `pillar`, `score`, `score_breakdown`, `failed_rules[]`, `warned_rules[]`, `iteration_count` (when produced by an agent loop), `final_status`. The JSON keeps the `failed_rules[]` name for backward compatibility; the human-text rendering labels this list as `violations (N)` (Phase 2 preflight 6.4b) because the array contains both zero-tolerance violations (which produce overall FAIL) and non-zero-tolerance ones (which only deduct score and may still PASS). | Output without `failed_rules[]` array → script bug. |
| 7.8.7 | When invoked with `--check <path>` against a file that is not a `complete-qa.json` (no top-level `questions` array, or unreadable JSON), the script prints `error: <path> does not look like a complete-qa.json (no top-level "questions" array)` to stderr and exits with code 2 — not the empty summary that would otherwise look like a clean pass. (Phase 2 preflight 6.4a.) | A blob with a top-level `question` (singular) returns exit 2 and a clear error message. |
| 7.8.8 | Topic resolution (`resolve_topic_id`, used by §7.2.1 and §7.2.2) prefers the codex topic with the highest **shared-token count** with the question slug, breaking ties by **Jaccard similarity** (intersection / union). This avoids codex iteration order silently picking the wrong topic when two candidates tie on raw overlap (Phase 2 preflight 6.4c — the `difference-between-equals-and-double-equals-java` slug ties at 2 tokens between the correct `equals-vs-double-equals` and the unrelated `equals-and-hashcode-contract`; Jaccard prefers the first because its smaller token set is more fully covered by the slug). | Slug `difference-between-equals-and-double-equals-java` resolves to `equals-vs-double-equals` (Jaccard 2/7), not `equals-and-hashcode-contract` (Jaccard 2/8). |

---

## Appendix A — Agent loop policy

This appendix documents the agent autonomy contract from `SPEAKABLE-PLAN.md` §15.16 and §15B.2. It defines exactly when an agent stops iterating and writes a `pending_handcraft` status instead of pushing for a higher score.

### A.1 Loop shape

For each question in the agent's queue, the agent:

1. Reads the legacy material (`speakable_answer`, `key_points`, `direct_answer`, `interviewer_intent`, etc.) as raw input.
2. Drafts a v2 in the structured shape, with explicit `layout` per beat.
3. Runs `audit_speakable.py` against the v2.
4. If the lint passes (score ≥ 80, zero `fail` rules, all `warn` items optional): writes `speakable_status: pending_review`, moves to the next question.
5. If the lint fails: reads the `failed_rules[]` and `warned_rules[]`, revises the draft, re-runs the lint. **This is one iteration.**
6. Iterations continue until one of the escape conditions in A.2 fires.

### A.2 Escape conditions (locked: §15.16, §15B.2)

The agent **must** exit the loop and mark the question `speakable_status: pending_handcraft` when any of:

| # | Condition | Trigger | Status written |
|---|---|---|---|
| A.2.1 | **Iteration cap** | 20 lint-correction iterations completed without lint-green. | `pending_handcraft`, with `escape_reason: iteration_cap`, `last_score`, and `failed_rules[]` recorded. |
| A.2.2 | **Plateau** | Score has not improved across 5 consecutive iterations (delta < 1 point each). | `pending_handcraft`, with `escape_reason: plateau`, `plateau_score`, and the failing rules. |
| A.2.3 | **Critic rejections** (post-lint) | Reviewer has rejected this question 3 times after lint-green was achieved. | `pending_handcraft`, with `escape_reason: critic_rejected`, the three reviewer notes attached. |

The intent is: agents iterate as long as quality is moving toward the bar. They escape only on genuine impasse — never on a fixed re-attempt cap that fires while progress is being made.

### A.3 The smoke-test gate halts iteration

After the **first question** in the pillar — regardless of which iteration the lint passes on — the agent halts and emits its output for human review (§12.4). It does **not** proceed to question 2 until cleared. Smoke-test rejection writes `speakable_status: pending_handcraft_blocked_by_smoke` for the first question and freezes the pillar's queue until the rubric or the brief is updated.

### A.4 Audit trail

Every iteration writes a row to `content/_audits/agent_iterations.csv`:

```
question_path, iteration_n, score, score_delta, failed_rules_count, warned_rules_count, status_at_end
```

This audit trail is what reviewers use to spot agents that are looping near the floor (e.g. score oscillating 78–82 without convergence) and tighten the brief or the rubric in response.

### A.5 What the agent never does

- Never modifies the legacy `speakable_answer` field. v2 is always additive.
- Never edits `audit_speakable.py` or any rubric file to make its own output pass.
- Never disables a rule locally; if a rule looks wrong, the agent files a note in `docs/speakable/HUMAN-REVIEW-QUEUE.md` and proceeds.
- Never crosses pillar boundaries; each agent is scoped to its own pillar's queue.
