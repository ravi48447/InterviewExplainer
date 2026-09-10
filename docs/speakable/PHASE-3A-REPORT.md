# Speakable redesign — Phase 3a report

> Phase 3a is the **safety-gated half of Phase 3**: build the parallel-fan-out
> tooling, then run a 12-question smoke (one per pillar) and halt for human
> review. Phase 3b — the full fan-out across the remaining 957 pillar-queue
> questions — is **not** part of this report and is held until the smoke batch
> is reviewed and approved (or specific pillars are individually held).

> **Mid-phase pivot.** After the first 12 smokes shipped within the lint
> targets, the user reported that the outputs felt "same as others" — lint-
> pass had not translated to interview-quality. Each of the 12 smokes was
> then **rewritten from scratch** (v2-of-v2) against a sharper qualitative
> bar derived from the goldens: hook commits to a sharp angle, beats plant
> a counter-intuitive depth marker, pitfalls are sharp edges with
> consequences, cap is a portable principle (not a recap). The "Smoke
> outputs" table below reflects the **v2-of-v2** results.

## Preflight

| Item | Resolution | Commit |
|---|---|---|
| DATA-1 (`postgresql` module: `pillar: P06` vs `pillarName: "Data & Persistence"`) | Set `pillar: P03` for the `postgresql` module in `content/java-backend-intermediate/_index.json` so it matches `pillarName` and the fullstack mirror. No `MODULE_PILLAR_OVERRIDE` was needed in the lint script (verified by re-running `--check-fixture docs/SPEAKABLE-PLAN.md#16` — still PASS 100/100). HUMAN-REVIEW-QUEUE.md DATA-1 marked **RESOLVED**. | `1f8bf0a` |
| `scripts/classify_speakable.py` + `content/_audits/archetype_assignments.csv` | New auto-classifier walks every `complete-qa.json` under `content/java-backend-intermediate/` and infers archetype A–G per question via a 7-stage decision tree (G → F → E vs B disambiguation → D → C → A fallback). Excludes the 7 goldens (`speakable_status: approved`) and 30 priority_handcraft items, then emits 969 rows × `{pillar, module, topic, slug, title, inferred_archetype, confidence_band}`. | `929dd32` |
| 12 per-pillar agent briefs + 12 queue CSVs | New `scripts/build_agent_briefs.py` slices `archetypes.md`, `pillar-register.md`, `word-ceilings.md`, `depth-markers.md`, `lint-rules.md` §7, `visual-style-guide.md` §6, the 7 golden references, and the 3 codex JSONs into 12 self-contained briefs at `docs/speakable/agent-briefs/P0X-*.md` (each > 800 lines per the §12.3 acceptance bar) and 12 queue CSVs at `content/_audits/agent-queues/P0X-queue.csv` (sorted by `(importance desc, difficulty desc, slug)` for smoke-target selection). | `aa7b1a5` |
| 12 smoke targets recorded | `content/_audits/smoke_targets.md` documents the 12 picks with goldens-overlap and priority-handcraft-overlap checks before any v2 was drafted. | `45c9f7f` |

## Smoke outputs (12 / 12 — v2-of-v2)

| Pillar | Slug | Archetype | Score | Iters | Status | v2-of-v2 commit | v2-of-v2 rewrite focus |
|---|---|---|---:|---:|---|---|---|
| P01 | `checked-vs-unchecked-exception-java-comparison` | B | 82/100 | 4 | WARN | `c9d9e13` | throws-metastasis depth marker + Spring's translation answer |
| P02 | `datasource-properties` | A | 100/100 | 2 | PASS | `57fd203` | (cores × 2) sizing example with RDS-cap math + 3am bug story |
| P03 | `mongodb-vs-dynamodb-managed-tradeoffs` | B | 96/100 | 4 | WARN | `e5141b7` | one-way-door framing + GSI-cost gotcha + hot-partition story |
| P04 | `message-broker-vs-message-bus-vs-event-bus-semantics` | B | 92/100 | 7 | WARN | `1e0d8b7` | in-process-vs-cross-process axis + outbox bridge + sync-by-default trap |
| P05 | `datafetcher-and-dataloader-graphql-java` | A | 100/100 | 2 | PASS | `0e4ba60` | silent-data-corruption sharp edge + position-is-the-contract cap |
| P06 | `oo-design-with-solid-and-composition` | A (override; classifier said F) | 100/100 | 2 | PASS | `d8da3b6` | forces-not-recipe framing + concrete refactor + OCP win |
| P07 | `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` | B | 100/100 | 5 | PASS | `a8e9c86` | SCA-first framing + Log4Shell story + reachability gotcha |
| P08 | `chaos-engineering-java-microservices-game-days` | A | 100/100 | 2 | PASS | `c641239` | hypothesis-not-theatre framing + concrete game-day shape |
| P09 | `docker-vs-vm-virtualization-comparison` | E | 100/100 | 4 | PASS | `bbfdb57` | containers-INSIDE-VMs framing + Firecracker third option |
| P10 | `core-gcp-services-java-backend-developer` | A | 100/100 | 4 | PASS | `8df5cca` | default-vs-escalation pivot + cold-start sharp edge + 14× Spanner cost |
| P11 | `log-levels-when-to-use-each` | A (override; classifier said D) | 90/100 | 2 | WARN | `0582f25` | pager-contract framing + parameterized-logging depth marker |
| P12 | `learn-new-technology-quickly` | G | 100/100 | 4 | PASS | `e18dda4` | story-commit hook + day-4-evening human moment + portable principle |

**Aggregate (v2-of-v2)**: 8 PASS + 4 WARN + 0 FAIL. Mean score = 96.7 / 100.
All 12 are `speakable_status: pending_review`. Mean iterations down to 3.5 (from 4.2 in the first batch) — sharper angles converged faster despite the higher qualitative bar.

### Per-pillar v2-of-v2 notes

Where the first-batch smokes were "competent process notes", the v2-of-v2 rewrites
each commit to a sharp angle in the hook, plant a counter-intuitive depth
marker in pitfalls / example / rethink_if, and end on a portable principle
quotable beyond the question itself.

- **P01 (Java Language & Core)** — B (`checked-vs-unchecked-exception`). Hook
  keeps the recoverability pivot but ends on the hook ("modern Java leans hard
  unchecked — the reason's a trap throws clauses set"). tiny_example carries
  the throws-metastasis depth marker plus Spring's modern answer (JdbcTemplate
  wraps `SQLException` into `DataAccessException`; `@ControllerAdvice` at the
  boundary). Cap: "Recoverability picks the side; the compiler keeps it honest.
  Modern Java leans unchecked plus a global handler." WARN at 82/100; FK 9.3
  driven by 4-syllable exception type names that can't slim further.
- **P02 (Spring Ecosystem)** — A (`datasource-properties`). Hook keeps the
  4-vs-6 framing but ends on the production sting ("one of those six is the
  bug that breaks production at 3am, nowhere else"). example beat upgraded
  from naming property values to telling the (cores × 2) sizing story
  (4-core SSD → pool of 10 → 30 across 3 replicas → under the RDS
  db.t3.medium 100-conn cap), then the 3am 'Connection is closed' story as
  the depth marker. PASS 100/100.
- **P03 (Data & Persistence)** — B (`mongodb-vs-dynamodb-managed-tradeoffs`).
  Hook commits to the one-way-door framing ("DynamoDB locks the schema to
  today's access patterns, and migrating off when those change is the bill").
  tiny_example is a real hybrid shape (DynamoDB hot path with userId PK; Atlas
  reporting plane) plus the GSI-cost gotcha (each GSI write doubles cost) and
  the celebrity-user hot-partition story. WARN at 96/100; one soft cap
  preserves the GSI + hot-partition specifics.
- **P04 (APIs / Microservices / Messaging)** — B (`message-broker-vs-message-bus-vs-event-bus`).
  Hook commits to the in-process-vs-cross-process axis ("treating
  ApplicationEventPublisher like Kafka is the most common bug here").
  tiny_example carries the canonical hybrid pattern (in-JVM listeners on
  `@TransactionalEventListener AFTER_COMMIT` + outbox row → Kafka relay) plus
  the trap candidates miss (`@EventListener` is sync in the caller thread).
  WARN at 92/100; FK 9.1 + soft caps reflect infra-vocabulary density that
  can't slim without losing accuracy.
- **P05 (Architecture & Design)** — A (`datafetcher-and-dataloader-graphql-java`).
  Hook keeps the "51 → 2" surprise but adds the silent-corruption trap ("every
  book silently gets the wrong author"). example beat carries the depth marker
  from the legacy: DataLoader maps results by ARRAY INDEX not key lookup; input
  keys [3,1,7], return sorted as [author-1, author-3, author-7], data silently
  corrupts. Cap: "Position is the contract. The cache is per-request. Forget
  either, and the bug is silent — the only kind of GraphQL bug that survives
  staging." PASS 100/100.
- **P06 (System Design / LLD)** — A override (classifier said F). Hook commits
  to the forces-not-recipe framing ("SOLID isn't a checklist to recite; it's
  the set of forces that show up when one class does too much"). example beat
  carries a real refactor — `PaymentProcessor` if-else chain → `PaymentMethod`
  interface per implementation, with the "the tests for credit_card never
  change again" OCP win. PASS 100/100. Override rationale documented for the
  classifier-tuning queue.
- **P07 (Security)** — B (`sast-vs-dast-vs-iast-vs-sca`). Hook commits to the
  trap most candidates fall into ("most candidates name SAST first; the
  interviewer's listening for SCA"). when_to_pick lands the SCA-first
  principle. tiny_example is the Log4Shell story (Dec 2021, log4j2 2.14.x,
  CVE-2021-44228 — SCA catches it, SAST stays silent) + the reachability
  gotcha (Snyk/Endor cuts noise 50-80%). PASS 100/100.
- **P08 (Testing & Quality)** — A (`chaos-engineering-java-microservices-game-days`).
  Hook reframes the discipline as evidence generation ("an experiment with no
  hypothesis and no abort is just an outage with a fancy name"). example beat
  carries a real game-day shape (steady-state baseline → kill 50% of
  order-service pods → hypothesis: K8s reschedules in 30s, p99 stays under
  1.5s → abort: error rate over 5% for 2 minutes or p99 over 5s). PASS
  100/100.
- **P09 (DevOps)** — E (`docker-vs-vm-virtualization-comparison`). Hook flips
  the framing ("Containers vs VMs sounds like a fork in the road. In cloud
  it's a stack — containers run inside VMs"). options layer adds the third
  option (Firecracker / Kata microVMs powering Lambda + Fargate). tradeoffs
  is a real mini_table with concrete numbers per side (50ms-2s vs 30-60s;
  50-500 vs 5-20 per host). rethink_if names three sharp moments. PASS
  100/100.
- **P10 (Cloud)** — A (`core-gcp-services-java-backend-developer`). Hook
  commits to what the interviewer's actually testing ("not memorising 200
  services… picking the cheapest service that fits, then defending it when
  the team reaches for the flagship"). parts_or_states uses
  `grouped_paragraphs` to make default→escalate pivots explicit per layer
  with concrete prices ($50/mo Cloud SQL vs $700/mo Spanner ≈ 14×).
  example beat carries the JVM-cold-start sharp edge (6-10s on Cloud Run;
  CPU-always-allocated or GraalVM native image). PASS 100/100.
- **P11 (Production / SRE)** — A override (classifier said D). Hook reframes
  log levels as a pager contract ("not a developer convenience"). example
  beat carries the parameterized-logging depth marker —
  `log.debug("rows=" + count)` allocates the string even when DEBUG is off;
  `log.debug("rows={}", count)` doesn't — plus the runtime tuning trick
  (POST to `/actuator/loggers/<package>` with `configuredLevel=DEBUG`,
  no redeploy). WARN at 90/100 — sole warn is the locked-codex anchor for
  topic `log-levels-and-structured-logging` (out of scope per Phase 3a §3
  codex lock).
- **P12 (Behavioural & Engineering Practices)** — G (`learn-new-technology-quickly`).
  Hook commits to a SPECIFIC story moment ("the only Kafka-experienced
  engineer left three weeks before launch") instead of announcing a process.
  action beat plants a real human moment ("Day 4 evening: caught myself in
  circles. Honest read — I was treating 'figure it out alone' as proof I
  deserved the role"). reflection extracts the INSIGHT not the process tweak.
  Cap: "Under deadline, the bottleneck's rarely the docs — it's how late you
  let yourself ask. Schedule the pair on the calendar, not in your head."
  PASS 100/100.

## Quality bar gates (per Phase 3a prompt §4)

| Gate | Status | Notes |
|---|---|---|
| All 12 lint ≥ 80 | PASS | Min 82 (P01), max 100 (8 of 12), mean 96.7. |
| Status = pending_review on all 12 | PASS | Verified via `grep '"speakable_status": "pending_review"'` → 12. |
| Goldens untouched (still 7 approved) | PASS | Verified via `grep '"speakable_status": "approved"'` → 7. |
| Priority handcraft untouched (still 30) | PASS | Verified via `grep '"speakable_status": "priority_handcraft"'` → 30. |
| No `git push` | PASS | `git rev-list --count origin/main..HEAD` = 53; all local. |
| DATA-1 resolved | PASS | `_index.json` `postgresql` → `pillar: P03`; lint sanity script returns "DATA-1 OK". |
| `--all --report` regenerated | PASS | `pass=15 warn=4 fail=0 legacy=5806` (commit `d3ad3fe`); refreshed post-rewrite (`pass=15 warn=4 fail=0 legacy=5806`). |
| Qualitative bar (golden-parity rewrite) | PASS | Each of the 12 v2-of-v2s commits to a sharp angle in the hook, plants a counter-intuitive depth marker (carried in `example` / `tiny_example` / `pitfalls` / `rethink_if`), sharpens pitfalls into specific consequences, and ends on a portable principle. |

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
- **No `git push`.** All commits stay local.

### Notes on the v2-of-v2 rewrite

- Each of the 12 was rewritten from scratch (not patched) against a
  golden-parity bar derived from G1–G7. The first batch's "lint-pass
  but tonally generic" outputs were replaced wholesale.
- Where a depth marker collided with a soft cap (P03 `tiny_example`,
  P04 `tiny_example`, P11 `tts_overrides`, P01 FK), the depth marker
  was kept and the WARN was accepted. None of these crossed a hard
  cap in the schema.
- Codex JSONs (`anchors`, `phrasings`, `examples`, `banned`) were
  **not** modified during the rewrite — the one persistent codex-anchor
  warning (P11) is documented above and routed for Phase 3b.
- `priority_handcraft` and `approved` (golden) status counts were
  re-verified after the rewrite: **30 priority_handcraft** and
  **7 approved** — unchanged.

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
