# Phase 3a — smoke targets (1 per pillar)

Selection rule per `SPEAKABLE-PHASE-3A-PROMPT.md` §5: filter the pillar's
queue to questions with non-empty legacy `speakable_answer` material
(after excluding the 7 goldens and 30 priority_handcraft items), then
pick row 1 of the queue ordered by `(importance desc, difficulty desc,
slug)`.

12 targets selected. Phase 3a draft loop is one v2 per target → halt for
human review. Phase 3b (separate prompt, post-approval) fans out to the
remaining 957 questions across the 12 pillar queues.

| Pillar | Target slug | Archetype | Confidence | Importance | Difficulty | Module / topic |
|---|---|---|---|---|---|---|
| P01 | `checked-vs-unchecked-exception-java-comparison` | B | high | high | easy | `core-java/exception-handling` |
| P02 | `datasource-properties` | A | medium | high | easy | `spring-boot/profiles-and-properties` |
| P03 | `mongodb-vs-dynamodb-managed-tradeoffs` | B | high | high | medium | `nosql-mongodb/dynamodb-fundamentals` |
| P04 | `message-broker-vs-message-bus-vs-event-bus-semantics` | B | high | high | medium | `messaging-events/messaging-foundations` |
| P05 | `datafetcher-and-dataloader-graphql-java` | A | medium | high | intermediate | `graphql/graphql-java-implementation` |
| P06 | `oo-design-with-solid-and-composition` | F | high | (none) | intermediate | `low-level-design/lld-fundamentals` |
| P07 | `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` | B | high | (none) | medium | `application-security/security-tooling` |
| P08 | `chaos-engineering-java-microservices-game-days` | A | medium | (none) | medium | `unit-testing/chaos-engineering` |
| P09 | `docker-vs-vm-virtualization-comparison` | E | high | (none) | easy | `docker/container-fundamentals` |
| P10 | `core-gcp-services-java-backend-developer` | A | medium | (none) | easy | `gcp/gcp-fundamentals` |
| P11 | `log-levels-when-to-use-each` | D | medium | (none) | easy | `observability/structured-logging` |
| P12 | `learn-new-technology-quickly` | G | high | (none) | medium | `behavioral/career-growth` |

## Archetype distribution across the 12 smoke picks

- **A — Conceptual:** 4 (P02, P05, P08, P10)
- **B — Comparison:** 4 (P01, P03, P04, P07)
- **C — Internals:** 0
- **D — Scenario:** 1 (P11)
- **E — Design:** 1 (P09)
- **F — System Design / LLD:** 1 (P06)
- **G — Behavioural / STAR:** 1 (P12)

All 7 archetypes except C are exercised in the smoke. C didn't bubble to
the top of any pillar's queue under the (importance, difficulty, slug)
sort — the C goldens sit in `java-collections/collections-internals` and
`jvm-internals` topics whose top-ranked questions there are A or B
under the classifier. C-archetype refinement gets full coverage in
Phase 3b. (Documented for the human reviewer — if C-coverage is
wanted in the smoke batch, a P01 alternate pick of the highest-ranked
C-classified question can be substituted before Phase 3b kicks off.)

## Goldens-overlap check

None of the 12 picks collides with the 7 golden references:

- `java-thread-lifecycle-states` (G-A) — not picked.
- `difference-between-equals-and-double-equals-java` (G-B) — not picked.
- `hashmap-collision-handling` (G-C) — not picked.
- `cpu-spikes-java-applications-debugging` (G-D) — not picked. P11 picked
  `log-levels-when-to-use-each` instead.
- `abstract-class-vs-interface-java-when-to-use` (G-E) — not picked. P09
  picked `docker-vs-vm-virtualization-comparison` instead.
- `design-url-shortener` (G-F) — not picked. P06 picked
  `oo-design-with-solid-and-composition` instead.
- `handle-technical-disagreements` (G-G) — not picked. P12 picked
  `learn-new-technology-quickly` instead.

## Priority-handcraft overlap check

None of the 12 picks collides with any of the 30 `priority_handcraft`
items (the queue filter in `build_agent_briefs.py` excludes them
upstream).
