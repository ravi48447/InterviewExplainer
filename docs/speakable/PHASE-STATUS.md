# Speakable run — live status

Last update: 2026-05-02T20:10:00+05:30
Phase: 3a — **complete (with mid-phase v2-of-v2 rewrite)** (smoke-test gate; 12 pending_review v2s held for human review)
Run mode: Phase 3a only — halted at Phase 3a completion per prompt §11
Time elapsed (this phase): ~4 hours initial smokes + ~3 hours v2-of-v2 rewrite

## Phase 0 summary (carried over)

8 deliverables done — see `PHASE-0-REPORT.md`.

## Phase 1 summary (carried over)

11 deliverables done — see `PHASE-1-REPORT.md`.

## Phase 2 summary (carried over)

19 deliverables done (7 goldens + 12 preflight/wrap items) — see `PHASE-2-REPORT.md`.

## Phase 3a progress

- [x] Preflight 6.1 — DATA-1 resolved: `_index.json` `postgresql` module flipped from `pillar: P06` → `pillar: P03` to match `pillarName: "Data & Persistence"` and the fullstack mirror; HUMAN-REVIEW-QUEUE.md DATA-1 marked **RESOLVED**. (`1f8bf0a`)
- [x] Preflight 6.3 — `scripts/classify_speakable.py` + `content/_audits/archetype_assignments.csv` (969 rows, 99.5% high+medium confidence). (`929dd32`)
- [x] Preflight 6.4 — `scripts/build_agent_briefs.py` + 12 per-pillar briefs at `docs/speakable/agent-briefs/P0X-*.md` + 12 queue CSVs at `content/_audits/agent-queues/P0X-queue.csv`. (`aa7b1a5`)
- [x] §5 / §7.2 — 12 smoke targets recorded in `content/_audits/smoke_targets.md`. (`45c9f7f`)
- [x] §7 P01 smoke (initial) — `checked-vs-unchecked-exception-java-comparison` (B), 86/100 WARN. (`1449f22`)
- [x] §7 P02 smoke (initial) — `datasource-properties` (A), 100/100 PASS. (`0c83aee`)
- [x] §7 P03 smoke (initial) — `mongodb-vs-dynamodb-managed-tradeoffs` (B), 100/100 PASS. (`e85154c`)
- [x] §7 P04 smoke (initial) — `message-broker-vs-message-bus-vs-event-bus-semantics` (B), 96/100 WARN. (`9e99a92`)
- [x] §7 P05 smoke (initial) — `datafetcher-and-dataloader-graphql-java` (A), 100/100 PASS. (`4876f6f`)
- [x] §7 P06 smoke (initial) — `oo-design-with-solid-and-composition` (A; classifier override from F), 100/100 PASS. (`efaea97`)
- [x] §7 P07 smoke (initial) — `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` (B), 100/100 PASS. (`8120577`)
- [x] §7 P08 smoke (initial) — `chaos-engineering-java-microservices-game-days` (A), 100/100 PASS. (`dc45535`)
- [x] §7 P09 smoke (initial) — `docker-vs-vm-virtualization-comparison` (E), 96/100 WARN. (`2ebc383`)
- [x] §7 P10 smoke (initial) — `core-gcp-services-java-backend-developer` (A), 100/100 PASS. (`abca1df`)
- [x] §7 P11 smoke (initial) — `log-levels-when-to-use-each` (A; classifier override from D), 90/100 WARN. (`3644c56`)
- [x] §7 P12 smoke (initial) — `learn-new-technology-quickly` (G), 100/100 PASS. (`216b19d`)
- [x] §8 (initial) — `content/_audits/smoke_review_batch.md` collated for the 12 smoke v2s. (`a1d162b`)
- [x] §9 (initial) — `--all --report` regenerated `content/_audits/speakable_health.md` (`pass=15 warn=4 fail=0 legacy=5806` of 5825 total). (`d3ad3fe`)

### Mid-phase pivot — v2-of-v2 rewrites against golden-parity bar

After human review, the initial 12 smokes were judged "lint-pass but tonally generic — same as others". Each was rewritten **from scratch** against a sharper qualitative bar: hook commits to a sharp angle / story moment (not a definition), beats plant a counter-intuitive depth marker, pitfalls are sharp edges with specific consequences, cap is a portable principle.

- [x] §7 P01 v2-of-v2 — `checked-vs-unchecked-exception-java-comparison` (B), 82/100 WARN — throws-metastasis depth marker + Spring's translation answer. (`c9d9e13`)
- [x] §7 P02 v2-of-v2 — `datasource-properties` (A), 100/100 PASS — (cores × 2) sizing example with RDS-cap math + 3am bug story. (`57fd203`)
- [x] §7 P03 v2-of-v2 — `mongodb-vs-dynamodb-managed-tradeoffs` (B), 96/100 WARN — one-way-door framing + GSI-cost gotcha + hot-partition story. (`e5141b7`)
- [x] §7 P04 v2-of-v2 — `message-broker-vs-message-bus-vs-event-bus-semantics` (B), 92/100 WARN — in-process-vs-cross-process axis + outbox bridge + sync-by-default trap. (`1e0d8b7`)
- [x] §7 P05 v2-of-v2 — `datafetcher-and-dataloader-graphql-java` (A), 100/100 PASS — silent-data-corruption sharp edge + position-is-the-contract cap. (`0e4ba60`)
- [x] §7 P06 v2-of-v2 — `oo-design-with-solid-and-composition` (A), 100/100 PASS — forces-not-recipe framing + concrete refactor + OCP win. (`d8da3b6`)
- [x] §7 P07 v2-of-v2 — `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` (B), 100/100 PASS — SCA-first framing + Log4Shell story + reachability gotcha. (`a8e9c86`)
- [x] §7 P08 v2-of-v2 — `chaos-engineering-java-microservices-game-days` (A), 100/100 PASS — hypothesis-not-theatre framing + concrete game-day shape. (`c641239`)
- [x] §7 P09 v2-of-v2 — `docker-vs-vm-virtualization-comparison` (E), 100/100 PASS — containers-INSIDE-VMs framing + Firecracker third option. (`bbfdb57`)
- [x] §7 P10 v2-of-v2 — `core-gcp-services-java-backend-developer` (A), 100/100 PASS — default-vs-escalation pivot + cold-start sharp edge + 14× Spanner cost. (`8df5cca`)
- [x] §7 P11 v2-of-v2 — `log-levels-when-to-use-each` (A), 90/100 WARN — pager-contract framing + parameterized-logging depth marker. (`0582f25`)
- [x] §7 P12 v2-of-v2 — `learn-new-technology-quickly` (G), 100/100 PASS — story-commit hook + day-4-evening human moment + portable principle cap. (`e18dda4`)
- [x] §8 + §9 (v2-of-v2) — `content/_audits/smoke_review_batch.md` regenerated reflecting v2-of-v2 outputs (rewrite focuses, new hook + cap previews, sharpened reviewer questions, lint deltas) **and** `--all --report` re-run; `content/_audits/speakable_health.md` refreshed (`pass=15 warn=4 fail=0 legacy=5806` of 5825). (`59eecda`)
- [x] §10 — `PHASE-3A-REPORT.md` updated with mid-phase pivot, v2-of-v2 results table + per-pillar focuses + reasserted boundaries; this file updated. (this commit)

## Open items routed to human

1. **Smoke batch review (v2-of-v2)** — `content/_audits/smoke_review_batch.md` (the artefact a human reviews in one sitting per plan §12.4 step 3). For each of the 12 pillars: approve, reject (with notes), or flag as "rubric needs tuning". The current contents reflect the **v2-of-v2 rewrites**, not the initial smokes.
2. **Two classifier overrides applied during the smoke** — P06 F→A (`oo-design-with-solid-and-composition`) and P11 D→A (`log-levels-when-to-use-each`). Suggested heuristic refinements documented in PHASE-3A-REPORT.md "Classifier health" — recommend a Phase 3b warm-up.
3. **C-archetype absent from the smoke batch** — under the `(importance, difficulty, slug)` selection rule, no C-classified question bubbled to the top of any pillar's queue. Documented in `content/_audits/smoke_targets.md`. C gets full coverage in Phase 3b.
4. **HUMAN-REVIEW-QUEUE.md** — DATA-1 marked **RESOLVED** in this phase. E-1, F-1, G-1, L1-1, AUTH-1, AUDIO-1 carry over from earlier phases unchanged. No new items added.
5. **Persistent WARN sources (post-v2-of-v2)** — 4 WARNs remain by intentional trade: P01 FK 9.3 (4-syllable exception type names), P03 `tiny_example` soft cap (preserves GSI-cost + hot-partition story), P04 FK 9.1 + soft caps (preserves outbox / `@TransactionalEventListener` specifics), P11 codex anchor (no `log-levels-and-structured-logging` topic in `phrasings.json` — codex locked per Phase 3a §3). All four are documented per-pillar in PHASE-3A-REPORT.md.

## Hard boundaries reasserted (per Phase 3a prompt §3)

- No `git push`. All commits stay local.
- Touched only the 12 smoke-target files in `content/` plus the audit + brief + queue artefacts. No 7 goldens touched. No 30 priority_handcraft touched (counts re-verified post-v2-of-v2: still 7 approved, still 30 priority_handcraft).
- No schema / codex / lint-semantics / renderer / TTS modifications — including across the v2-of-v2 rewrite. The only "tooling" added in Phase 3a is two new scripts (`scripts/classify_speakable.py` + `scripts/build_agent_briefs.py`) plus their generated artefacts (CSV + briefs + queues + smoke_targets.md + smoke_review_batch.md + refreshed health snapshot).
- Stage explicit paths only — never `git add .`.
- `pending_review` lock honoured: every smoke v2 is `speakable_status: "pending_review"` after the rewrite (verified by `grep '"speakable_status": "pending_review"' content/java-backend-intermediate -r | wc -l` → 12). None approved by the run.

## Health snapshot (post v2-of-v2)

| Bucket | Count |
|---|---:|
| approved (the 7 golden references) | 7 |
| priority_handcraft (the top-30 list) | 30 |
| pending_review (the 12 Phase 3a smokes — v2-of-v2) | 12 |
| legacy (no v2 yet) | 5 776 |
| **Total** | **5 825** |

Lint summary across the 19 v2 questions audited: `pass = 15`, `warn = 4`, `fail = 0`. (Goldens: 7 PASS. Smokes: 8 PASS + 4 WARN + 0 FAIL, mean score 96.7/100 across the v2-of-v2 batch — see PHASE-3A-REPORT.md table for per-pillar breakdown.) All Phase 3a stop conditions §11.1–§11.11 satisfied, plus the qualitative golden-parity bar applied during the mid-phase rewrite.

## Next phase

**Phase 3b** — full parallel agent fan-out across 12 pillars (957 questions across the 12 queues). Held until the user reviews `content/_audits/smoke_review_batch.md` (now the v2-of-v2 contents) and approves all 12 pillars (or holds specific pillars). Phase 3b is **one prompt per pillar** (12 prompts total, runnable in parallel chats). The schema, codex, lint, and renderer remain locked through Phase 3b unless a real bug surfaces. The 5-point qualitative bar applied in the v2-of-v2 rewrite (sharp hook / depth marker / sharp pitfalls / portable cap / story commitment) carries forward as the operating standard for Phase 3b agents.
