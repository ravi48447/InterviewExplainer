# Speakable run — live status

Last update: 2026-05-02T17:55:00+05:30
Phase: 3a — **complete** (smoke-test gate; 12 pending_review v2s held for human review)
Run mode: Phase 3a only — halted at Phase 3a completion per prompt §11
Time elapsed (this phase): ~4 hours

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
- [x] §7 P01 smoke — `checked-vs-unchecked-exception-java-comparison` (B), 86/100 WARN. (`1449f22`)
- [x] §7 P02 smoke — `datasource-properties` (A), 100/100 PASS. (`0c83aee`)
- [x] §7 P03 smoke — `mongodb-vs-dynamodb-managed-tradeoffs` (B), 100/100 PASS. (`e85154c`)
- [x] §7 P04 smoke — `message-broker-vs-message-bus-vs-event-bus-semantics` (B), 96/100 WARN. (`9e99a92`)
- [x] §7 P05 smoke — `datafetcher-and-dataloader-graphql-java` (A), 100/100 PASS. (`4876f6f`)
- [x] §7 P06 smoke — `oo-design-with-solid-and-composition` (A; classifier override from F), 100/100 PASS. (`efaea97`)
- [x] §7 P07 smoke — `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` (B), 100/100 PASS. (`8120577`)
- [x] §7 P08 smoke — `chaos-engineering-java-microservices-game-days` (A), 100/100 PASS. (`dc45535`)
- [x] §7 P09 smoke — `docker-vs-vm-virtualization-comparison` (E), 96/100 WARN. (`2ebc383`)
- [x] §7 P10 smoke — `core-gcp-services-java-backend-developer` (A), 100/100 PASS. (`abca1df`)
- [x] §7 P11 smoke — `log-levels-when-to-use-each` (A; classifier override from D), 90/100 WARN. (`3644c56`)
- [x] §7 P12 smoke — `learn-new-technology-quickly` (G), 100/100 PASS. (`216b19d`)
- [x] §8 — `content/_audits/smoke_review_batch.md` collated for the 12 smoke v2s. (`a1d162b`)
- [x] §9 — `--all --report` regenerated `content/_audits/speakable_health.md` (`pass=15 warn=4 fail=0 legacy=5806` of 5825 total). (`d3ad3fe`)
- [x] §10 — `PHASE-3A-REPORT.md` written + this file updated. (this commit)

## Open items routed to human

1. **Smoke batch review** — `content/_audits/smoke_review_batch.md` (the artefact a human reviews in one sitting per plan §12.4 step 3). For each of the 12 pillars: approve, reject (with notes), or flag as "rubric needs tuning".
2. **Two classifier overrides applied during the smoke** — P06 F→A (`oo-design-with-solid-and-composition`) and P11 D→A (`log-levels-when-to-use-each`). Suggested heuristic refinements documented in PHASE-3A-REPORT.md "Classifier health" — recommend a Phase 3b warm-up.
3. **C-archetype absent from the smoke batch** — under the `(importance, difficulty, slug)` selection rule, no C-classified question bubbled to the top of any pillar's queue. Documented in `content/_audits/smoke_targets.md`. C gets full coverage in Phase 3b.
4. **HUMAN-REVIEW-QUEUE.md** — DATA-1 marked **RESOLVED** in this phase. E-1, F-1, G-1, L1-1, AUTH-1, AUDIO-1 carry over from earlier phases unchanged. No new items added.

## Hard boundaries reasserted (per Phase 3a prompt §3)

- No `git push`. All 53 commits ahead of `origin/main` stay local.
- Touched only the 12 smoke-target files in `content/` plus the audit + brief + queue artefacts. No 7 goldens touched. No 30 priority_handcraft touched.
- No schema / codex / lint-semantics / renderer / TTS modifications. The only "tooling" added in Phase 3a is two new scripts (`scripts/classify_speakable.py` + `scripts/build_agent_briefs.py`) plus their generated artefacts (CSV + briefs + queues + smoke_targets.md + smoke_review_batch.md + refreshed health snapshot).
- Stage explicit paths only — never `git add .`.
- `pending_review` lock honoured: every smoke v2 is `speakable_status: "pending_review"`. None approved by the run.

## Health snapshot

| Bucket | Count |
|---|---:|
| approved (the 7 golden references) | 7 |
| priority_handcraft (the top-30 list) | 30 |
| pending_review (the 12 Phase 3a smokes) | 12 |
| legacy (no v2 yet) | 5 776 |
| **Total** | **5 825** |

Lint summary across the 19 v2 questions audited: `pass = 15`, `warn = 4`, `fail = 0`. (Goldens: 7 PASS. Smokes: 8 PASS + 4 WARN + 0 FAIL, mean score 97.0/100.) All Phase 3a stop conditions §11.1–§11.11 satisfied.

## Next phase

**Phase 3b** — full parallel agent fan-out across 12 pillars (957 questions across the 12 queues). Held until the user reviews `content/_audits/smoke_review_batch.md` and approves all 12 pillars (or holds specific pillars). Phase 3b is **one prompt per pillar** (12 prompts total, runnable in parallel chats). The schema, codex, lint, and renderer remain locked through Phase 3b unless a real bug surfaces.
