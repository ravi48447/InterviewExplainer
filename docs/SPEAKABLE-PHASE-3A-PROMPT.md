# Speakable Redesign — Phase 3a Run Prompt (preflight + 12 smoke outputs)

> **Paste this entire file into a new Cursor chat in this repo.** Phase 0 + 1 + 2 are complete (see `docs/speakable/PHASE-0-REPORT.md`, `PHASE-1-REPORT.md`, `PHASE-2-REPORT.md`). Phase 3a wires up the parallel-fan-out tooling and runs the **smoke-test gate** (§12.4 of the plan): each of the 12 pillars drafts **its first non-priority-handcraft question only** as a v2, then halts. The 12 smoke outputs go to human review before Phase 3b releases the agents on the rest of the corpus.

---

## 1. What this run does (and what it does *not* do)

You are running **Phase 3a only** of the Speakable redesign — the safety-gated half of Phase 3.

You will:
1. **Resolve DATA-1** (the only carry-over queue item that blocks classification — see §6 preflight).
2. Build **`scripts/classify_speakable.py`** — auto-classifier that walks every `complete-qa.json`, infers `archetype` per question, and writes `content/_audits/archetype_assignments.csv`.
3. Run the classifier across the corpus, commit the CSV.
4. Generate the **12 per-pillar agent briefs** at `docs/speakable/agent-briefs/P01-…md` through `P12-…md`. Each is self-contained per §12.3 of the plan.
5. Run the **smoke test** (§12.4): for each of the 12 pillars, simulate one "agent" by drafting **one** v2 — the highest-priority non-priority-handcraft, non-golden, non-legacy-empty question in that pillar — using **only the contents of that pillar's brief** as context. Iterate against the lint until lint-green or impasse (per §15.16). Set `speakable_status: pending_review`. Halt after that one question per pillar. **Total: 12 v2 drafts.**
6. Collate the 12 outputs into **`content/_audits/smoke_review_batch.md`** for human review (slug, lint score, archetype, pillar, side-by-side excerpt, lint diagnostics).
7. Write **`docs/speakable/PHASE-3A-REPORT.md`** + update `PHASE-STATUS.md`.

You will **not**:
- Touch any question outside the 12 smoke targets (no full fan-out — that's Phase 3b).
- Modify the 7 golden references (locked, `speakable_status: approved` is sacred).
- Modify the 30 `priority_handcraft` items (humans hand-craft those separately).
- Change the schema, codex, lint rules' semantics, or renderer (locked since Phase 1).
- Approve any of your own smoke outputs (only `pending_review` — humans approve in the next step).
- `git push`.

Expected wall time: **3–4 hours**. Most of it is the 12 lint-iterate loops in §11.

---

## 2. Read these references first (in this order)

Before writing a single line of code or content:

1. **`docs/SPEAKABLE-PLAN.md`** — re-skim §2 (principles, especially 2.6/2.7/2.8), §3 (archetypes), §4 (pillar register), §5 (data model + layouts), §11 (Phase 3 placement), **§12 in full** (this is the section you're executing), §15A (locked decisions, especially 15.3, 15.14, 15.16).
2. **`docs/speakable/PHASE-0-REPORT.md`** + **`PHASE-1-REPORT.md`** + **`PHASE-2-REPORT.md`** — what's been built; the final report is the single richest doc on the system's current state.
3. **`docs/speakable/archetypes.md`**, **`pillar-register.md`**, **`familiarity-codex.md`**, **`word-ceilings.md`**, **`depth-markers.md`**, **`lint-rules.md`**, **`visual-style-guide.md`**.
4. **`codex/banned.json`**, **`codex/phrasings.json`**, **`codex/examples.json`** — the 3 codex JSONs the lint reads.
5. **`scripts/audit_speakable.py`** + **`scripts/data/word-ceilings.json`** + **`scripts/data/depth-markers.json`** — the lint executable spec; especially the `MODULE_PILLAR_OVERRIDE`, `BAN_LAYER_2`, `BAN_LAYER_3`, `SOFT_REQUIRED_BEATS`, and topic-resolver code.
6. **`frontend/lib/speakable/schema.ts`** — the exact JSON shape every v2 must take.
7. **The 7 golden references** (read all 7 v2 fields end-to-end — these are your imitation targets):
   - `content/java-backend-intermediate/java-concurrency/threads-and-lifecycle/complete-qa.json` → `java-thread-lifecycle-states` (A)
   - `content/java-backend-intermediate/core-java/scenario-based/complete-qa.json` → `difference-between-equals-and-double-equals-java` (B)
   - `content/java-backend-intermediate/java-collections/collections-internals/complete-qa.json` → `hashmap-collision-handling` (C)
   - `content/java-backend-intermediate/production-sre/debugging-production/complete-qa.json` → `cpu-spikes-java-applications-debugging` (D)
   - `content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json` → `abstract-class-vs-interface-java-when-to-use` (E)
   - `content/java-backend-intermediate/system-design-cases/url-shortener/complete-qa.json` → `design-url-shortener` (F)
   - `content/java-backend-intermediate/behavioral/conflict-resolution/complete-qa.json` → `handle-technical-disagreements` (G)
8. **`docs/speakable/HUMAN-REVIEW-QUEUE.md`** — DATA-1 is the only item you'll resolve in §6.

After reading, validate the toolchain is wired:

```bash
python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16
# expect: PASS, 100/100
python3 scripts/audit_speakable.py --check content/java-backend-intermediate/java-collections/collections-internals/complete-qa.json
# expect: 1 PASS (G3 = hashmap-collision-handling), 20 LEGACY
```

If either fails, **STOP** — Phase 1 / Phase 2 didn't land cleanly and you should escalate before proceeding.

---

## 3. Hard boundaries

These are non-negotiable. If a task in this prompt seems to require violating one, log it in `HUMAN-REVIEW-QUEUE.md` and route around it.

1. **Schema lock.** `frontend/lib/speakable/schema.ts` and `scripts/speakable_schema.json` are frozen. The v2 you produce conforms to them; you do not change them.
2. **Codex lock.** `codex/banned.json`, `codex/phrasings.json`, `codex/examples.json` are frozen for content-quality calibration. The classifier may consult them; agent briefs may quote them; **you do not modify them**. (Exception: if a smoke run surfaces a codex bug — e.g. a phrasing that's literally wrong — log it in HUMAN-REVIEW-QUEUE and DO NOT auto-fix; defer to a separate codex-review PR.)
3. **Lint semantics lock.** `scripts/audit_speakable.py` rule weights, banned-vocab matchers, ceilings, depth markers — all frozen. You may add **classifier-side** code to `scripts/classify_speakable.py` (a new file). You may add small UX-only flags or output formats to the audit script if they're strictly additive (e.g. a `--smoke-batch` JSON exporter), but no rule-semantics changes. Document any addition in the report.
4. **Renderer lock.** `frontend/components/speakable/*` and `frontend/lib/speakable/toSpeech.ts` are frozen.
5. **Golden reference lock.** The 7 questions listed in §2.7 above are sacrosanct. Their `speakable_v2` and `speakable_status: approved` MUST NOT be touched.
6. **Priority handcraft lock.** The 30 questions with `speakable_status: priority_handcraft` MUST NOT receive a v2 from this run. Skip them entirely. (Verify by running `rg '"speakable_status":\s*"priority_handcraft"' content/ --json | wc -l` → 30 before AND after your run; same for `approved` → 7.)
7. **Smoke gate lock.** Each pillar produces **exactly one** v2 in this run. Not zero (failure to skip the gate); not two (don't get ambitious). One per pillar = 12 total.
8. **`pending_review` lock.** Every v2 you produce gets `speakable_status: "pending_review"`. Never `approved`. Never `legacy`. Approval is for humans only, post-smoke.
9. **No `git push`.** All commits stay local.
10. **Legacy field lock.** Never overwrite, modify, or delete the existing `speakable_answer` (or any other legacy field). v2 is **additive**, sitting next to legacy. Side-by-side coexistence per §14.1.

---

## 4. Quality bar (smoke outputs only — Phase 3b will be much stricter at scale)

Each of the 12 smoke outputs must:

- **Lint score ≥ 80** (the absolute floor per §14.2). Aim for 90+; lower is acceptable here only if the impasse loop honestly plateaus and the question is genuinely hard. If a smoke score falls below 80, the impasse rules in §15.16 apply: mark `speakable_status: pending_handcraft` with a structured diagnosis in `_speakable_v2_diagnosis` (a sibling field, not part of v2) and log to `HUMAN-REVIEW-QUEUE`. **Do not lower the bar by stopping iteration prematurely.**
- **Status = `pending_review`** (the renderer ignores it; legacy still serves users).
- **Be a refinement, not a transcription.** Read the legacy `speakable_answer` + `key_points` + `direct_answer` + `interviewer_intent` as raw material. Drop, restructure, or replace anything that doesn't earn its place under the plan. Imitate the golden reference for that archetype's voice and visual rhythm.
- **Sit next to legacy.** Add `speakable_v2` to the question object; do not alter `speakable_answer` or any other field.
- **Imitate the right golden.** A's smoke uses G1's voice and rhythm; B's uses G2's; etc. The brief makes this explicit.
- **Pass the structural smell test:** every beat declares `layout`; no paragraph > 60 words; lists when >2 items; mini-table when >2 comparison axes; ordered list for sequences; no Layer 2 / Layer 3 banned phrases anywhere.
- **Be TTS-friendly.** Define `tts_overrides` for noisy identifiers / acronyms / code symbols, mirroring the goldens.

---

## 5. The 12 pillars and how to pick the smoke target

The 12 pillars per `content/java-backend-intermediate/_index.json`:

| Pillar | Name | Notes for smoke target selection |
|---|---|---|
| P01 | Java Language & Core | Lots of A/B/C archetypes. Avoid topics already covered by G1 (threads), G2 (==/equals), G5 (abstract vs interface). |
| P02 | Spring Ecosystem | Spring Core, Boot, MVC, Data, Security, WebFlux, Batch. Spring-Core is a safe smoke pick (broadest exposure). |
| P03 | Data & Persistence | JPA/Hibernate, transactions, locking, Postgres, NoSQL. After DATA-1 fix, Postgres modules are P03. |
| P04 | APIs, Microservices & Messaging | REST, gRPC, GraphQL, Kafka, RabbitMQ. Avoid topics already covered by G6 (system design URL shortener). |
| P05 | Architecture & Design | Design patterns, SOLID, layered architectures. Don't overlap with G5 (abstract vs interface). |
| P06 | System Design / LLD | Avoid `design-url-shortener` (G6); pick another canonical Q (e.g. `design-rate-limiter` if present). |
| P07 | Security | OWASP, OAuth, JWT, encryption. |
| P08 | Testing & Quality | JUnit, Mockito, integration tests, mutation testing. |
| P09 | DevOps | CI/CD, Docker, Kubernetes basics. |
| P10 | Cloud | AWS/Azure/GCP services, cloud patterns. |
| P11 | Production / SRE | Avoid `cpu-spikes-java-applications-debugging` (G4); pick another debug/observability Q. |
| P12 | Interview Readiness | Behavioural + engineering practices. Avoid `handle-technical-disagreements` (G7); pick another STAR-flavoured Q. |

**Smoke-target selection rule** (mechanical, in your classifier output):

1. Take all questions in the pillar.
2. Filter out: any with `speakable_status` in `{approved, priority_handcraft}`.
3. Filter out: any with no legacy `speakable_answer` (no raw material to refine).
4. Sort by `(interviewFrequency desc, importance desc, key_points length desc)` using the existing question metadata.
5. Pick the top one.

If a pillar has zero candidates after the filters (unlikely), log to `HUMAN-REVIEW-QUEUE` as `SMOKE-<pillar>-empty` and skip — that pillar's smoke is "no-op, deferred to Phase 3b first slot."

Record the 12 picks in `content/_audits/smoke_targets.md` before drafting any v2.

---

## 6. Preflight — DATA-1 + classifier + briefs

### 6.1 Resolve DATA-1

The carry-over item from Phase 0:

> The `postgresql` module in `content/java-backend-intermediate/_index.json` carries `pillar: P06` but `pillarName: "Data & Persistence"` (which is P03). The data file disagrees with itself.

**Resolution.** Edit `_index.json`: change the `pillar` field from `P06` to `P03` for every entry where `pillarName === "Data & Persistence"`. Verify with:

```bash
python3 -c "
import json
data = json.load(open('content/java-backend-intermediate/_index.json'))
for m in data['modules']:
    if m.get('pillarName') == 'Data & Persistence' and m.get('pillar') != 'P03':
        print('STILL WRONG:', m)
"
# expect: no output
```

Also update `scripts/audit_speakable.py`'s `MODULE_PILLAR_OVERRIDE` if it carried a workaround for the postgresql case (search for `postgresql` or `P06` in the file). Run `python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` after; it must still PASS 100/100.

Update `HUMAN-REVIEW-QUEUE.md` to mark DATA-1 RESOLVED with the resolution.

Commit: `chore(speakable): Phase 3a preflight — resolve DATA-1 (postgresql P06→P03)`.

### 6.2 Carry-over items that stay deferred (do NOT resolve in this run)

These are tracked in HUMAN-REVIEW-QUEUE but out of scope for Phase 3a:

- **E-1 / F-1 / G-1** (per-beat ceilings for E/F/G archetypes). Phase 0 derived them; they passed Phase 1 + Phase 2 smoke (all 7 goldens scored 100). No action; deferred to a Phase-4-governance review.
- **L1-1** (Layer-1 vocab "blast radius" in spec docs). Cosmetic; no action.
- **AUTH-1** (admin review UI auth). Pre-launch concern, not a Phase 3 blocker.
- **AUDIO-1** (ReadAloudButton placement). Works as designed; no action.

### 6.3 Build `scripts/classify_speakable.py`

A new Python script (NOT a modification to `audit_speakable.py`) that:

- Walks every `complete-qa.json` under `content/java-backend-intermediate/`.
- For each question, reads its slug, title, `direct_answer`, `key_points`, `interviewer_intent`, plus the host file's pillar/module/topic.
- Infers `archetype` from heuristics (signal phrases the agent briefs will reuse):
  - **G** Behavioural — slug or title contains "tell me", "describe a time", "handle / disagree / conflict / failure / challenge", or sits under `behavioral/*`.
  - **F** System Design — sits under `system-design-cases/*`, `low-level-design/*`, `system-design/*`, or slug starts with `design-`.
  - **E** Design — title matches `* vs *` AND the question asks "when to use", "which to choose", "trade-off". Or sits under design-patterns and asks for a recommendation.
  - **B** Comparison — title matches `* vs *` AND the question asks "what's the difference", "compare", "differentiate". Or sits under `*/comparisons/*`.
  - **D** Scenario — sits under `*/scenario-based/*`, or slug contains "debug-", "troubleshoot-", "what-would-you-do-when-", "how-do-you-handle-".
  - **C** Internals — slug or title contains "how does X work", "internals", "mechanism", "under the hood". Or sits under `*-internals/*`.
  - **A** Conceptual — fallback. "What is X", "explain X".
- Outputs `content/_audits/archetype_assignments.csv` with columns: `pillar,module,topic,slug,title,inferred_archetype,confidence_band` (band = `high` / `medium` / `low`).
  - **`high`**: matched a structural rule (path or strong slug pattern).
  - **`medium`**: matched only a slug/title keyword.
  - **`low`**: fell through to A as fallback **and** the question's title doesn't begin with "What".
- Excludes the 7 goldens + 30 priority_handcraft from output (they're already classified).
- Idempotent — re-running produces an identical CSV.

Acceptance: total CSV row count ≈ 5 825 − 7 − 30 = 5 788. ≥ 60% should be `high` confidence; ≥ 90% should be `high` or `medium`.

Commit: `feat(speakable): Phase 3a — classify_speakable.py + archetype_assignments.csv`.

### 6.4 Build `docs/speakable/agent-briefs/P0X-…md` × 12

Per §12.3 of the plan. Each brief is **self-contained** — an agent reading only this brief plus `audit_speakable.py`, the codex JSONs, and the 7 goldens must be able to refine that pillar's questions to lint-green output.

**Brief template** (write a generator at `scripts/build_agent_briefs.py` that emits all 12 from one template + per-pillar slices, then run it):

```
# Pillar P0X — <Name> agent brief

## Identity & scope
- Pillar: P0X / <name>
- Number of questions in scope (excl. goldens + priority_handcraft + already-approved): <N>
- Question list: see content/_audits/agent-queues/P0X-queue.csv (slug,archetype,topic,file)

## The plan extract — what your output must satisfy

### Archetypes you will encounter (with required + forbidden beats and required visual rhythm cues)
[insert archetypes.md slice for the archetypes that appear in this pillar]

### This pillar's voice register
[insert pillar-register.md slice for P0X]

### Data-model shape
[insert SPEAKABLE-PLAN.md §5 + frontend/lib/speakable/schema.ts excerpt]

### Codex slice for the topics in this pillar
- Canonical phrasings:    [filter codex/phrasings.json by topic_id matching topics in scope]
- Standard examples:       [filter codex/examples.json same way]
- Banned vocabulary:       Layer 1 / Layer 2 / Layer 3 (full lists, all three)

### Lint rules — the gate
[insert lint-rules.md §7 in full — too small to slice]

### Word ceilings — the tightness control
[insert word-ceilings.md slice for the archetypes in this pillar]

### Depth markers — the seniority signal
[insert depth-markers.md slice for the archetypes in this pillar]

### Layout primitives the renderer supports
[insert visual-style-guide.md §6 in full]

## The 7 golden references — IMITATE THESE
For each archetype A–G, a full v2 example:
[embed all 7 v2 JSON blobs as fenced ```json blocks, in archetype order]

## The forbidden list (Layer 2 + Layer 3 — zero tolerance)
[embed banned.json's layer_2 and layer_3 arrays in full]

## The voice mandate (principle 2.7)
The Speakable text addresses no one. It does not say "you should…", "tell the interviewer…",
"in your answer…", "this is how you'd say it…", "make sure to mention…". It is read as
**study material, not coaching**. Internet-canonical knowledge is silently echoed; no
meta acknowledgement of where it came from. The reader internalises by reading.

## The visual mandate (principle 2.8)
Every beat declares a `layout`. No paragraph > 60 words. ≥ 3 items become a list. ≥ 3
comparison axes become a mini_table. Sequences become ordered_list. The output must be
visually scannable on mobile (no walls of text).

## The work loop (per question)
1. Read legacy speakable_answer + key_points + direct_answer + interviewer_intent.
2. Refine freely (refinement, not preservation — drop, restructure, replace anything
   that doesn't earn its place).
3. Choose a `layout` for each beat: paragraph for prose, bullets for lists, mini_table
   for comparisons, ordered_list for sequences, grouped_paragraphs for items-with-
   subheadings, callout for failure modes / reflections.
4. Write the structured shape to `speakable_v2` on the question (additive — leave the
   legacy field alone).
5. Set `speakable_status: "pending_review"`.
6. Run audit_speakable.py against the v2; self-correct and iterate until lint-green.
   No fixed re-attempt cap. Halt only when (a) lint passes, (b) score plateaus for 5
   iterations, or (c) per-question budget hit (see §15B.2).
7. In cases (b) or (c), set `speakable_status: "pending_handcraft"` with a structured
   diagnosis in `_speakable_v2_diagnosis` (sibling field). Continue to the next question.

## Output format
- Add the v2 as a sibling field on the question object.
- The legacy `speakable_answer` and every other field stays untouched.
- Schema is `frontend/lib/speakable/schema.ts` SpeakableV2 union.

## Stop rules
- Never set `speakable_status: "approved"`. Humans approve in /admin/speakable-review.
- Never modify questions in `priority_handcraft` or `approved` state.
- Never modify the 7 golden references (they are `approved`).
- If the lint script breaks, halt and write to HUMAN-REVIEW-QUEUE — do not work around it.
- If a question's legacy is empty / placeholder, mark `speakable_status: "pending_handcraft"`
  with diagnosis "no raw material" and skip.

## Smoke-test gate
After your **first question** in this pillar, halt. Emit the slug, lint score, and
the v2 JSON to a smoke-batch file. Wait for human review. (Phase 3a stops here for
each pillar.)
```

The generator script reads each pillar's question list (filtered by classifier) and queue and renders one brief per pillar.

Acceptance:
- 12 files at `docs/speakable/agent-briefs/P01-java-core.md` … `P12-interview-readiness.md`.
- Each ≥ 800 lines (the 7 embedded goldens alone are large).
- Each contains every lint rule (search the brief for "7.5" — must hit the visual rhythm rules).
- Each lists the actual queue: `wc -l docs/speakable/agent-briefs/P0X-…md` ≥ briefs are not stub-shaped.

Also write **`content/_audits/agent-queues/P0X-queue.csv`** for each pillar, listing the questions in scope sorted as in §5 (selection rule). Phase 3b will iterate this file.

Commit: `feat(speakable): Phase 3a — 12 per-pillar agent briefs + queues`.

---

## 7. The smoke run (one v2 per pillar, sequentially in this single chat)

After preflight, you run **12 simulated agents** sequentially. For each pillar:

### 7.1 Bind the agent context

Treat yourself, for each pillar, as a fresh agent whose only context is:
- The pillar's brief at `docs/speakable/agent-briefs/P0X-…md`.
- The codex JSONs.
- The lint script.
- The 7 goldens (already in the brief).

**Do not** carry over knowledge across pillars (e.g. "I already wrote the Spring smoke, so for Spring Boot I'll reuse the framing"). Each smoke is independent. This is what a parallel fan-out would look like; we're sequencing it here for cost reasons but the **shape** must match.

### 7.2 Pick the smoke target

Apply the §5 selection rule. Confirm:
- Not in goldens.
- Not in priority_handcraft.
- Has a non-empty legacy `speakable_answer`.
- Top of pillar's queue by `(interviewFrequency, importance, key_points length)`.

Record the picked slug in `content/_audits/smoke_targets.md` BEFORE drafting.

### 7.3 Draft, lint-iterate, halt

For the picked question:

1. Load legacy `speakable_answer`, `key_points`, `direct_answer`, `interviewer_intent`, plus the `_index.json` topic intro for the module.
2. Identify the archetype (use the classifier's CSV; if low-confidence, fall back to manual judgement using `archetypes.md`'s decision tree).
3. Identify the topic_id by mapping the question's title against `codex/phrasings.json` and `codex/examples.json`. Use the audit script's `_resolve_topic_id` logic if needed (it's exported).
4. Draft the `speakable_v2` per the brief:
   - hook → familiarity_anchors → standard_example → beats (with layouts) → cap → followup_handoff → tts_overrides.
   - Imitate the matching golden's voice, rhythm, depth.
5. Add it to the question object. Set `speakable_status: "pending_review"`.
6. Run `python3 scripts/audit_speakable.py --check <file>`. Read the JSON output.
7. If status PASS and score ≥ 80: done; record score, slug, archetype, pillar in the smoke batch. Move on.
8. If status WARN/FAIL or score < 80: read every violation, fix them, re-lint. Repeat.
9. After 5 consecutive iterations with no score improvement, mark `speakable_status: "pending_handcraft"`, write `_speakable_v2_diagnosis` (struct: `{rounds, last_score, top_violations: [...], suspected_cause}`), and move on.
10. Per-question budget cap: if iteration count > 12 OR token spend > one budget-unit (use judgement), same as step 9.

Commit each smoke individually:
`feat(speakable): Phase 3a smoke — P0X — <slug> (score N/100)`.

12 commits, one per pillar.

### 7.4 If a pillar smoke triggers a "rubric needs tuning" signal

Per §12.4: if you find a lint rule is producing **systematically wrong** signals — e.g. flagging `tiny_example` as too long when it's clearly fine, or refusing canonical phrasings — log to HUMAN-REVIEW-QUEUE as a `RUBRIC-TUNE-<pillar>-<rule>` item and continue with what you can. Do **not** auto-edit the lint script. Phase 3b is held until rubric is reviewed.

---

## 8. Collate the smoke review batch

After all 12 smokes commit, write **`content/_audits/smoke_review_batch.md`** with one section per pillar:

```
## P0X — <Name>

- Slug: <slug>
- File: <path>
- Archetype: <X>
- Lint score: <N/100>  (status: PASS / WARN / pending_handcraft)
- Iterations to converge: <K>
- Top 3 lint diagnostics resolved during iteration: <list>

### Legacy excerpt (first 200 chars)
> ...

### v2 hook + first beat preview
> hook: ...
> beat[0] (<kind>, <layout>): ...

### Imitation target
G<X> — <golden slug>

### Reviewer questions
- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?
```

This is the artefact a human reviews in one sitting (~30 min) per §12.4, step 3.

Commit: `feat(speakable): Phase 3a — smoke_review_batch.md collated`.

---

## 9. Final verification before report

Mechanical sanity checks (all must pass before §10):

```bash
# Exactly 12 new pending_review v2s
test "$(rg '"speakable_status":\s*"pending_review"' content/ --json | jq -s 'length')" = "12"

# 7 approved + 30 priority_handcraft unchanged
test "$(rg -c '"speakable_status":\s*"approved"' content/java-backend-intermediate/ --type json | awk -F: '{s+=$NF} END {print s}')" = "7"
test "$(rg -c '"speakable_status":\s*"priority_handcraft"' content/java-backend-intermediate/ --type json | awk -F: '{s+=$NF} END {print s}')" = "30"

# All 12 smokes lint at ≥ 80 (or are pending_handcraft with diagnosis)
python3 scripts/audit_speakable.py --all --report  # writes content/_audits/speakable_health.md

# No git push
git rev-list --count origin/main..HEAD  # > 0 (Phase 3a commits added on top of Phase 2)

# DATA-1 resolved
python3 -c "
import json
data = json.load(open('content/java-backend-intermediate/_index.json'))
bad = [m for m in data['modules'] if m.get('pillarName') == 'Data & Persistence' and m.get('pillar') != 'P03']
assert not bad, bad
print('DATA-1 OK')
"
```

If any check fails, fix it before writing the report.

---

## 10. The Phase 3a report

Write **`docs/speakable/PHASE-3A-REPORT.md`** with this skeleton:

```
# Speakable redesign — Phase 3a report

## Preflight
| Item | Resolution | Commit |
|---|---|---|
| DATA-1 | ... | ... |
| classify_speakable.py | ... | ... |
| 12 agent briefs | ... | ... |

## Smoke outputs (12 / 12)
| Pillar | Slug | Archetype | Score | Iterations | Status | Commit |
|---|---|---|---|---:|---|---|
| P01 | ... | A | 92 | 4 | PASS | abc123 |
| ... |

### Per-pillar smoke notes (1 paragraph each)
- **P01**: what archetype mix the pillar has; how the smoke felt; surprises.
- ...

## Quality bar gates (per Phase 3a prompt §4)
| Gate | Status | Notes |
|---|---|---|
| All 12 lint ≥ 80 | ... |
| Status = pending_review on all 12 | ... |
| Goldens untouched (still 7 approved) | ... |
| Priority handcraft untouched (still 30) | ... |
| No git push | ... |

## Classifier health
- Total questions classified: <N>
- High-confidence: <%>
- Medium: <%>
- Low: <%>
- Top-3 ambiguous slugs (call-outs for human review): ...

## What this run did NOT do
- No full fan-out (Phase 3b).
- No approvals.
- No schema / codex / lint-semantics / renderer changes (lint UX-only additions, if any, listed here with rationale).
- No legacy field modifications.

## Open items routed to human
- Updated HUMAN-REVIEW-QUEUE.md entries.
- Specifically: smoke-batch review at content/_audits/smoke_review_batch.md.

## Recommended next step
Read smoke_review_batch.md. For each of the 12 pillars: approve, reject (with notes),
or "rubric needs tuning". Once 12 approvals are in, Phase 3b prompt fans out the
agents to the rest of each pillar's queue. If any pillar is rejected or tuning-flagged,
that pillar is held while others may proceed.
```

Update `docs/speakable/PHASE-STATUS.md` with Phase 3a completion + commit hashes.

Commit: `docs(speakable): Phase 3a final report + PHASE-STATUS update`.

---

## 11. Stop conditions

You are done with Phase 3a when ALL of these are true:

1. DATA-1 resolved + verified.
2. `scripts/classify_speakable.py` exists, runs, produces `archetype_assignments.csv` with ≥ 90% high-or-medium confidence.
3. 12 per-pillar agent briefs exist at `docs/speakable/agent-briefs/`.
4. 12 per-pillar queue CSVs exist at `content/_audits/agent-queues/`.
5. 12 smoke v2s committed; each lints ≥ 80 OR is `pending_handcraft` with diagnosis.
6. `content/_audits/smoke_review_batch.md` collates all 12 with reviewer prompts.
7. `content/_audits/speakable_health.md` regenerated and committed.
8. `docs/speakable/PHASE-3A-REPORT.md` + `PHASE-STATUS.md` written.
9. `git status` clean (or only the auto-generated dashboard untracked).
10. `git rev-list --count origin/main..HEAD` shows the Phase 3a commits added on top of Phase 2 — none pushed.
11. **Approved count = 7. Priority_handcraft count = 30. Pending_review count = 12.** (Mechanical invariant.)

If any condition fails, fix it before declaring done. If a condition can't be met (e.g. classifier confidence too low), document the deviation in the report and route to HUMAN-REVIEW-QUEUE — don't paper over it.

---

## 12. Time budget

| Block | Estimate |
|---|---|
| §2 references read + toolchain validation | 15 min |
| §6.1 DATA-1 fix + verify | 10 min |
| §6.3 classify_speakable.py + run | 30 min |
| §6.4 build_agent_briefs.py + 12 briefs + queues | 45 min |
| §7 12 smoke runs (~12 min/each incl. 3–5 lint iterations) | 2.5 h |
| §8 collate smoke_review_batch.md | 15 min |
| §9 verifications | 10 min |
| §10 report + status | 20 min |
| **Total** | **~3.5–4 h** |

If you blow past 5 hours, halt at a clean commit boundary and write a partial-Phase-3a report — never burn budget on the wrong axis.

---

## 13. After this run

You stop. Phase 3b is a **separate prompt**, run only after the user reviews `smoke_review_batch.md` and approves all 12 pillars (or holds specific pillars). Phase 3b is **one prompt per pillar** (12 prompts total, runnable in parallel chats), drafting v2 for the rest of each pillar's queue.

Do not start Phase 3b. Do not approve any of your own smokes. Do not push.
