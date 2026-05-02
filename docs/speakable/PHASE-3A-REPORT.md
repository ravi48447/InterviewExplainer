# Speakable redesign — Phase 3a report

> Phase 3a is the **safety-gated half of Phase 3**: build the parallel-fan-out
> tooling, then run a 12-question smoke (one per pillar) and halt for human
> review. Phase 3b — the full fan-out across the remaining 957 pillar-queue
> questions — is **not** part of this report and is held until the smoke batch
> is reviewed and approved (or specific pillars are individually held).

## Preflight

| Item | Resolution | Commit |
|---|---|---|
| DATA-1 (`postgresql` module: `pillar: P06` vs `pillarName: "Data & Persistence"`) | Set `pillar: P03` for the `postgresql` module in `content/java-backend-intermediate/_index.json` so it matches `pillarName` and the fullstack mirror. No `MODULE_PILLAR_OVERRIDE` was needed in the lint script (verified by re-running `--check-fixture docs/SPEAKABLE-PLAN.md#16` — still PASS 100/100). HUMAN-REVIEW-QUEUE.md DATA-1 marked **RESOLVED**. | `1f8bf0a` |
| `scripts/classify_speakable.py` + `content/_audits/archetype_assignments.csv` | New auto-classifier walks every `complete-qa.json` under `content/java-backend-intermediate/` and infers archetype A–G per question via a 7-stage decision tree (G → F → E vs B disambiguation → D → C → A fallback). Excludes the 7 goldens (`speakable_status: approved`) and 30 priority_handcraft items, then emits 969 rows × `{pillar, module, topic, slug, title, inferred_archetype, confidence_band}`. | `929dd32` |
| 12 per-pillar agent briefs + 12 queue CSVs | New `scripts/build_agent_briefs.py` slices `archetypes.md`, `pillar-register.md`, `word-ceilings.md`, `depth-markers.md`, `lint-rules.md` §7, `visual-style-guide.md` §6, the 7 golden references, and the 3 codex JSONs into 12 self-contained briefs at `docs/speakable/agent-briefs/P0X-*.md` (each > 800 lines per the §12.3 acceptance bar) and 12 queue CSVs at `content/_audits/agent-queues/P0X-queue.csv` (sorted by `(importance desc, difficulty desc, slug)` for smoke-target selection). | `aa7b1a5` |
| 12 smoke targets recorded | `content/_audits/smoke_targets.md` documents the 12 picks with goldens-overlap and priority-handcraft-overlap checks before any v2 was drafted. | `45c9f7f` |

## Smoke outputs (12 / 12)

| Pillar | Slug | Archetype | Score | Iterations | Status | Commit |
|---|---|---|---:|---:|---|---|
| P01 | `checked-vs-unchecked-exception-java-comparison` | B | 86/100 | 9 | WARN | `1449f22` |
| P02 | `datasource-properties` | A | 100/100 | 3 | PASS | `0c83aee` |
| P03 | `mongodb-vs-dynamodb-managed-tradeoffs` | B | 100/100 | 6 | PASS | `e85154c` |
| P04 | `message-broker-vs-message-bus-vs-event-bus-semantics` | B | 96/100 | 7 | WARN | `9e99a92` |
| P05 | `datafetcher-and-dataloader-graphql-java` | A | 100/100 | 2 | PASS | `4876f6f` |
| P06 | `oo-design-with-solid-and-composition` | A (override; classifier said F) | 100/100 | 2 | PASS | `efaea97` |
| P07 | `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` | B | 100/100 | 6 | PASS | `8120577` |
| P08 | `chaos-engineering-java-microservices-game-days` | A | 100/100 | 1 | PASS | `dc45535` |
| P09 | `docker-vs-vm-virtualization-comparison` | E | 96/100 | 2 | WARN | `2ebc383` |
| P10 | `core-gcp-services-java-backend-developer` | A | 100/100 | 3 | PASS | `abca1df` |
| P11 | `log-levels-when-to-use-each` | A (override; classifier said D) | 90/100 | 2 | WARN | `3644c56` |
| P12 | `learn-new-technology-quickly` | G | 100/100 | 3 | PASS | `216b19d` |

**Aggregate**: 8 PASS + 4 WARN + 0 FAIL. Mean score = 97.0 / 100.
All 12 are `speakable_status: pending_review`.

### Per-pillar smoke notes

- **P01 (Java Language & Core)** — Pillar is dominated by A and B
  archetypes. The smoke is a B comparison (`checked vs unchecked`); the
  voice work was the hard part — legacy is dense compiler-vocab prose,
  and tightening to G2's rhythm took 9 iterations. Final WARN is a
  Flesch–Kincaid grade just over 9 with the canonical
  `IOException`/`NullPointerException` examples; further easing would
  drop technical fidelity.
- **P02 (Spring Ecosystem)** — A (`datasource-properties`) classified
  medium-confidence and ran clean. Spring property naming is heavy with
  identifiers (`spring.datasource.url`, `hikari`, `jpa.show-sql`), so
  `tts_overrides` did most of the polishing work. The legacy already
  matched a parts-of-a-thing shape; the v2 mostly added structure and
  trimmed fillers.
- **P03 (Data & Persistence)** — B (`mongodb-vs-dynamodb-managed-tradeoffs`).
  Cloud-tradeoff B's are passive-voice landmines ("DynamoDB is fully
  managed by AWS…"); 27% passive ratio in iter 1 needed an aggressive
  active-voice rewrite. After 6 iters, PASS 100/100 — the
  `mini_table` collapsed 5 tradeoff axes into a single billing-and-ops
  decision pivot.
- **P04 (APIs, Microservices & Messaging)** — B
  (`message-broker-vs-message-bus-vs-event-bus-semantics`). Three-way
  comparisons are hard to make terse without losing the "broker is a
  process; bus is in-process" pivot. Iterated to a clean two-axis
  `mini_table` (transport, ownership) plus a tiny example. Final WARN
  is one paragraph just over the soft cap that contains the central
  semantic distinction — splitting it would lose the through-line.
- **P05 (Architecture & Design)** — A
  (`datafetcher-and-dataloader-graphql-java`). The smoke validated the
  `ordered_list` parts_or_states layout for "named pieces with order
  meaning" (resolver execution order). Two iterations to PASS.
- **P06 (System Design / LLD)** — A override (classifier said F).
  Question is conceptual ("OO design with SOLID and composition"), not
  a system-design problem with capacity numbers, so it doesn't fit F.
  Documented the override in the commit message and queued a
  classifier-tuning note for Phase 3b. PASS 100/100.
- **P07 (Security)** — B (`SAST vs DAST vs IAST vs SCA`). Legacy was a
  7-way scanner taxonomy; collapsed to the canonical 4-way to fit
  archetype B's two-thing-per-axis rhythm. The dropped categories
  (RASP, secrets-scanning, container-scanning) belong in their own A
  questions. PASS 100/100 in 6 iters.
- **P08 (Testing & Quality)** — A
  (`chaos-engineering-java-microservices-game-days`). PASSED on the
  first iteration — the legacy already had a clean
  scope-progression-evidence shape, so the v2 mostly applied the
  layout vocabulary and `tts_overrides` for tool names.
- **P09 (DevOps)** — E (`docker-vs-vm-virtualization-comparison`).
  E archetype was exercised once. The decision-frame template
  (optimising-for / options / tradeoffs / decision / rethink-if)
  matched the legacy "when to pick" framing. Final WARN is Flesch
  grade just under 10.
- **P10 (Cloud)** — A
  (`core-gcp-services-java-backend-developer`). Cloud-services
  questions tend toward catalogue-prose; v2 used the
  default-and-escalation map (Cloud Run for the default, GKE/Compute
  for escalation paths) to keep it scannable. PASS 100/100.
- **P11 (Production / SRE)** — A override (classifier said D). Legacy
  is a 5-level taxonomy of log severities, not a debug scenario.
  Override documented; final WARN is the locked-codex anchor (no
  `log-levels-and-structured-logging` topic in `phrasings.json`).
- **P12 (Interview Readiness)** — G
  (`learn-new-technology-quickly`). The STAR-R template (situation /
  task / action / result / reflection) matched the legacy's existing
  structure. PASS 100/100. The `action` beat hit the hard cap at 105
  words on iter 1 and was tightened to soft-cap (≤70) by iter 3.

## Quality bar gates (per Phase 3a prompt §4)

| Gate | Status | Notes |
|---|---|---|
| All 12 lint ≥ 80 | PASS | Min 86 (P01), max 100 (8 of 12), mean 97.0. |
| Status = pending_review on all 12 | PASS | Verified via `grep '"speakable_status": "pending_review"'` → 12. |
| Goldens untouched (still 7 approved) | PASS | Verified via `grep '"speakable_status": "approved"'` → 7. |
| Priority handcraft untouched (still 30) | PASS | Verified via `grep '"speakable_status": "priority_handcraft"'` → 30. |
| No `git push` | PASS | `git rev-list --count origin/main..HEAD` = 53; all local. |
| DATA-1 resolved | PASS | `_index.json` `postgresql` → `pillar: P03`; lint sanity script returns "DATA-1 OK". |
| `--all --report` regenerated | PASS | `pass=15 warn=4 fail=0 legacy=5806` (commit `d3ad3fe`). |

## Classifier health

- Total questions classified: **969** (1 006 corpus minus 7 goldens minus
  30 priority_handcraft).
- High-confidence: **261 (26.9%)**.
- Medium-confidence: **703 (72.5%)**.
- Low-confidence: **5 (0.5%)**.
- High+medium combined: **964 / 969 = 99.5%** — meets the §11.2 stop
  condition floor of ≥ 90%.
- Archetype mix: A = 524, B = 232, D = 110, F = 34, C = 27, E = 24,
  G = 18. The corpus skews heavily conceptual-A, which is consistent
  with the brief: behavioural pillars are smaller and the strict
  C/E/F/G shapes only fire when their structural signals are present.
- Top-5 ambiguous slugs (the 5 `low` rows — call-outs for human review,
  worth a glance before Phase 3b kicks off):
  1. `try-with-resources-autocloseable` (P01 / `core-java/exception-handling`) → A
  2. `forkjoinpool-recursive-task` (P01 / `java-concurrency/thread-pools-and-executor`) → A
  3. `dynamodb-single-table-design-patterns` (P03 / `nosql-mongodb/nosql-patterns`) → A
  4. `service-mesh-architecture` (P05 / `architecture-patterns/architectural-styles`) → A
  5. `how-to-test-terraform-configurations` (P09 / `terraform/terraform-core`) → A
  All five are short noun-phrase titles with no decision verb / vs-pivot
  / debugging signal — the classifier's A fallback is the safest
  default; a human reviewer may want to nudge `service-mesh-architecture`
  toward C-internals or E-design depending on the planned answer.
- **Two pillar-level overrides applied during the smoke**, both
  documented in the commit messages and worth feeding back into the
  classifier in a Phase 3b warm-up:
  - P06 `oo-design-with-solid-and-composition` — classifier said F
    (system design), human override said A (conceptual taxonomy of
    SOLID + composition). Suggested rule: F should require an
    explicit capacity / scale signal in the title, not just a
    `low-level-design` topic adjacency.
  - P11 `log-levels-when-to-use-each` — classifier said D (scenario,
    via `production-sre` adjacency), human override said A (5-level
    taxonomy). Suggested rule: D should require an explicit failure /
    debug / incident signal in the title, not just a topic-folder
    match.

## What this run did NOT do

- **No full fan-out (Phase 3b).** Each pillar produced exactly one v2.
- **No approvals.** All 12 smokes are `pending_review`. The 7 goldens
  remain the only `approved` v2s.
- **No schema / codex / lint-semantics / renderer changes.** No
  changes to `frontend/lib/speakable/schema.ts`,
  `scripts/speakable_schema.json`, `codex/*.json`,
  `scripts/audit_speakable.py`, `scripts/data/word-ceilings.json`,
  `scripts/data/depth-markers.json`, `frontend/components/speakable/*`,
  or `frontend/lib/speakable/toSpeech.ts`. The only "tooling" added in
  Phase 3a is **two new scripts** (`scripts/classify_speakable.py` and
  `scripts/build_agent_briefs.py`) plus their generated artefacts.
- **No legacy field modifications.** Every smoke's `speakable_v2`
  sits next to the existing `speakable_answer` (and other legacy
  fields) — strictly additive.
- **No `git push`.** All 53 commits ahead of `origin/main` stay local.

## Open items routed to human

1. **Smoke batch review** — `content/_audits/smoke_review_batch.md`
   collates all 12 smokes (slug, archetype, lint score, iteration
   count, top-3 diagnostics resolved, legacy excerpt, v2 hook + first
   beat preview, imitation-target golden, reviewer questions). This
   is the artefact a human reviews in one sitting (~30 min) per
   plan §12.4 step 3.
2. **Two classifier overrides** noted above (P06 F→A, P11 D→A) —
   recommend a Phase 3b warm-up to refine F and D heuristics before
   the full fan-out.
3. **C-archetype absence in the smoke batch** — under the
   `(importance, difficulty, slug)` selection rule, no C-classified
   question bubbled to the top of any pillar's queue. The C goldens
   sit in `java-collections/collections-internals` and
   `jvm-internals` topics whose top-ranked questions there are A or B
   under the classifier. C-archetype refinement gets full coverage in
   Phase 3b. If C-coverage is wanted in the smoke batch, the P01
   pick can be substituted with the highest-ranked C-classified
   question before Phase 3b kicks off.
4. **`HUMAN-REVIEW-QUEUE.md`** — DATA-1 marked **RESOLVED** in this
   phase (commit `1f8bf0a`). E-1, F-1, G-1, L1-1, AUTH-1, AUDIO-1
   carry over from earlier phases unchanged. No new items added.

## Recommended next step

Read `content/_audits/smoke_review_batch.md`. For each of the 12
pillars: **approve**, **reject** (with notes), or flag as **"rubric
needs tuning"**. Once 12 approvals are in, the **Phase 3b prompt** fans
out the agents to the rest of each pillar's queue (957 questions
across 12 pillars, runnable in parallel chats — one prompt per
pillar). If any pillar is rejected or tuning-flagged, that pillar is
**held** while others may proceed.
