# Phase 3a — smoke review batch (12 v2 drafts)

One section per pillar. Each smoke is `speakable_status: pending_review` and is held for human review per `SPEAKABLE-PHASE-3A-PROMPT.md` §8 + §10. Phase 3b is held until the 12 smokes are individually approved, rejected, or flagged for rubric tuning.

## At-a-glance

| Pillar | Slug | Archetype | Lint | Iters | File |
|---|---|---|---:|---:|---|
| P01 | `checked-vs-unchecked-exception-java-comparison` | B | 86/100 (WARN) | 9 | `content/java-backend-intermediate/core-java/comparisons/complete-qa.json` |
| P02 | `datasource-properties` | A | 100/100 (PASS) | 3 | `content/java-backend-intermediate/spring-boot/profiles-and-properties/complete-qa.json` |
| P03 | `mongodb-vs-dynamodb-managed-tradeoffs` | B | 100/100 (PASS) | 6 | `content/java-backend-intermediate/nosql-mongodb/comparisons/complete-qa.json` |
| P04 | `message-broker-vs-message-bus-vs-event-bus-semantics` | B | 96/100 (WARN) | 7 | `content/java-backend-intermediate/messaging-events/comparisons/complete-qa.json` |
| P05 | `datafetcher-and-dataloader-graphql-java` | A | 100/100 (PASS) | 2 | `content/java-backend-intermediate/graphql/graphql-fundamentals/complete-qa.json` |
| P06 | `oo-design-with-solid-and-composition` | A (override; classifier said F) | 100/100 (PASS) | 2 | `content/java-backend-intermediate/low-level-design/lld-fundamentals/complete-qa.json` |
| P07 | `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` | B | 100/100 (PASS) | 6 | `content/java-backend-intermediate/application-security/comparisons/complete-qa.json` |
| P08 | `chaos-engineering-java-microservices-game-days` | A | 100/100 (PASS) | 1 | `content/java-backend-intermediate/unit-testing/chaos-testing/complete-qa.json` |
| P09 | `docker-vs-vm-virtualization-comparison` | E | 96/100 (WARN) | 2 | `content/java-backend-intermediate/docker/comparisons/complete-qa.json` |
| P10 | `core-gcp-services-java-backend-developer` | A | 100/100 (PASS) | 3 | `content/java-backend-intermediate/gcp/gcp-core-services/complete-qa.json` |
| P11 | `log-levels-when-to-use-each` | A (override; classifier said D) | 90/100 (WARN) | 2 | `content/java-backend-intermediate/observability/structured-logging/complete-qa.json` |
| P12 | `learn-new-technology-quickly` | G | 100/100 (PASS) | 3 | `content/java-backend-intermediate/behavioral/career-growth/complete-qa.json` |

## P01 — Java Language & Core

- Slug: `checked-vs-unchecked-exception-java-comparison`
- File: `content/java-backend-intermediate/core-java/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 86/100 (status: WARN)
- Iterations to converge: 9
- Top 3 lint diagnostics resolved during iteration:
  - voice/sentence length (avg 24.3 → ≤16)
  - Flesch–Kincaid grade (14.4 → ≤9)
  - paragraph >60 words split into grouped_paragraphs

### Legacy excerpt (first 200 chars)

> The split is about **recoverability**, not severity. Checked exceptions are the ones the compiler forces callers to acknowledge, because the designer thought callers would have a distinct recovery str…

### v2 hook + first beat preview

> hook: The split isn't about severity. It's about whether the compiler forces the caller to acknowledge the failure.

> beat[0] (what_each_is, grouped_paragraphs): : A subclass of Exception that isn't RuntimeException. The compiler forces the caller to catch it or declare it. IOException is the poster child. | : A subclass of RuntimeException. The compiler stays quiet at the call site. NullPointerExce…

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P02 — Spring Ecosystem

- Slug: `datasource-properties`
- File: `content/java-backend-intermediate/spring-boot/profiles-and-properties/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 3
- Top 3 lint diagnostics resolved during iteration:
  - comma/semicolon density per sentence
  - Flesch–Kincaid grade tightened
  - soft-cap trims on parts_or_states + pitfalls

### Legacy excerpt (first 200 chars)

> **The four essential properties** - URL, username, password, and driver class name - Driver is auto-detected from the URL, so usually omitted **HikariCP — the default pool since Boot 2** - Tuning pref…

### v2 hook + first beat preview

> hook: Four properties name the database. Six more decide whether the app stays up under load.

> beat[0] (definition, paragraph): DataSource properties are the keys under spring.datasource that tell Boot how to reach the database and how to manage the pool of open connections to it. Boot wires the DataSource bean from these keys at startup, before any repository runs.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P03 — Data & Persistence

- Slug: `mongodb-vs-dynamodb-managed-tradeoffs`
- File: `content/java-backend-intermediate/nosql-mongodb/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 6
- Top 3 lint diagnostics resolved during iteration:
  - passive-voice ratio (27% → <10%)
  - contractions ratio (9% → ≥30%)
  - long paragraphs split, beats trimmed to soft cap

### Legacy excerpt (first 200 chars)

> **Frame both** - Atlas: managed MongoDB with rich queries, pipeline, flexible schema - DynamoDB: purpose-built KV+doc; serverless, access-pattern-first **Call out the decision pivot** - Query flexibil…

### v2 hook + first beat preview

> hook: Both run as managed NoSQL on AWS. The split sits between query flexibility and serverless scale.

> beat[0] (what_each_is, grouped_paragraphs): : Atlas runs MongoDB for you on AWS. Flexible schema, rich queries, aggregation pipeline. The bill tracks cluster tier and hours. | : AWS's serverless KV-and-document store. Latency stays single-digit-millisecond at scale. The schema mirror…

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P04 — APIs, Microservices & Messaging

- Slug: `message-broker-vs-message-bus-vs-event-bus-semantics`
- File: `content/java-backend-intermediate/messaging-events/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 96/100 (status: WARN)
- Iterations to converge: 7
- Top 3 lint diagnostics resolved during iteration:
  - Flesch–Kincaid grade (11.3 → ≤9)
  - paragraph >60 words split
  - definitions converted from paragraph → grouped_paragraphs

### Legacy excerpt (first 200 chars)

> The terminology is loose but the practical distinction is clear. - A message broker is cross-process infrastructure — Kafka, RabbitMQ, ActiveMQ, SQS — that sits between services and persists messages.…

### v2 hook + first beat preview

> hook: The terms get used loosely. The real split is cross-process vs in-process — and that one decision drives durability, network cost, and replay.

> beat[0] (what_each_is, grouped_paragraphs): : Infra between services. Kafka, RabbitMQ, SQS. Producers send over the network. The broker keeps the message and re-delivers when the consumer wakes up. | : An in-JVM pub-sub library. Spring's ApplicationEventPublisher, Guava EventBus. One…

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P05 — Architecture & Design

- Slug: `datafetcher-and-dataloader-graphql-java`
- File: `content/java-backend-intermediate/graphql/graphql-fundamentals/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- Top 3 lint diagnostics resolved during iteration:
  - pitfalls beat over hard cap (91 → ≤90)
  - contractions added to hook + cap
  - anchor / standard_example phrasings tightened

### Legacy excerpt (first 200 chars)

> DataFetcher is the resolver primitive in graphql-java — every single field in your schema has one, whether you wrote it explicitly or Spring registered it through `@QueryMapping`. For simple scalar fi…

### v2 hook + first beat preview

> hook: Every field in a graphql-java schema has a DataFetcher, and DataLoader's the batching layer that turns 51 round-trips into 2.

> beat[0] (definition, paragraph): A DataFetcher is the resolver behind one schema field. The engine calls it during execution, and a default PropertyDataFetcher reads scalar fields via getters. DataLoader wraps a batch function that takes many keys and returns the matching …

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P06 — System Design / LLD

- Slug: `oo-design-with-solid-and-composition`
- File: `content/java-backend-intermediate/low-level-design/lld-fundamentals/complete-qa.json`
- Archetype: A (override; classifier said F)
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- Top 3 lint diagnostics resolved during iteration:
  - classifier override (F→A) — conceptual taxonomy, no capacity numbers
  - soft-cap trims on parts_or_states (5 SOLID principles)
  - contractions ratio raised

### Legacy excerpt (first 200 chars)

> **Why SOLID and composition matter** Most LLD anti-patterns come from two failures: 1. Mixing responsibilities — one class does too much, changes ripple unpredictably (violates SRP, OCP) 2. Inheriting…

### v2 hook + first beat preview

> hook: SOLID isn't a checklist to recite. It's a set of forces, and composition over inheritance is the structural choice that lets you honor them.

> beat[0] (definition, paragraph): SOLID names five constraints on object-oriented design. Composition over inheritance is the related rule that says behavior variation belongs in fields, not in subclasses. Together they keep classes small, swappable, and easy to change with…

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P07 — Security

- Slug: `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison`
- File: `content/java-backend-intermediate/application-security/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 6
- Top 3 lint diagnostics resolved during iteration:
  - collapsed legacy 7-way → 4-way (SAST, SCA, DAST, IAST) for B-shape
  - contractions ratio raised
  - mini_table tightened to single static-vs-runtime decision axis

### Legacy excerpt (first 200 chars)

> Each scanner finds a different bug class. None is sufficient alone. More tools without triage is security theater. **Scanner map** - SAST (Semgrep, SonarQube, CodeQL) — source pattern analysis — fast,…

### v2 hook + first beat preview

> hook: Each scanner finds a different bug class. Stacking eight without triage doesn't make you safer — it buries the real bugs in noise.

> beat[0] (what_each_is, grouped_paragraphs): : Static source analysis. Semgrep, CodeQL. Catches injection patterns and crypto misuse at PR time. | : Scans deps for known CVEs. Snyk, Dependabot. Highest-ROI — real incidents come from deps. | : Probes the running app. ZAP, Burp. Catches…

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P08 — Testing & Quality

- Slug: `chaos-engineering-java-microservices-game-days`
- File: `content/java-backend-intermediate/unit-testing/chaos-testing/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 1
- Top 3 lint diagnostics resolved during iteration:
  - PASSED first iteration; no diagnostics resolved
  - ordered_list chosen for the maturity ladder (game-day cadence)
  - tts_overrides covered Hystrix / Litmus / Toxiproxy noise

### Legacy excerpt (first 200 chars)

> Chaos engineering is the discipline of injecting failure deliberately to verify that systems behave as designed under stress. **Origin** - Popularized by Netflix's Chaos Monkey - Now formalized by Pri…

### v2 hook + first beat preview

> hook: Chaos engineering isn't 'kill random pods in prod'. It's a hypothesis-driven experiment with a small blast radius and an explicit abort.

> beat[0] (definition, paragraph): Chaos engineering is the discipline of injecting failure on purpose to confirm a system behaves the way the design says it will. Each experiment carries a hypothesis, a measurable steady state, an abort threshold, and a contained blast radi…

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P09 — DevOps

- Slug: `docker-vs-vm-virtualization-comparison`
- File: `content/java-backend-intermediate/docker/comparisons/complete-qa.json`
- Archetype: E
- Lint score: 96/100 (status: WARN)
- Iterations to converge: 2
- Top 3 lint diagnostics resolved during iteration:
  - Flesch–Kincaid grade (9.9 → ≤9)
  - options + decision beats trimmed to soft caps
  - rethink_if callout chosen as depth marker

### Legacy excerpt (first 200 chars)

> Containers and VMs solve different problems and in production they are usually used together — not as alternatives. **Architectural difference** - A VM virtualizes the entire hardware stack: hyperviso…

### v2 hook + first beat preview

> hook: Containers and VMs aren't competitors. Containers are process isolation; VMs are hardware virtualization, and most production stacks use both.

> beat[0] (optimising_for, paragraph): Pick the lightest unit of compute that meets the isolation, startup, and density needs — without weakening the security boundary the workload actually requires.

### Imitation target

GE — `abstract-class-vs-interface-java-when-to-use`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P10 — Cloud

- Slug: `core-gcp-services-java-backend-developer`
- File: `content/java-backend-intermediate/gcp/gcp-core-services/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 3
- Top 3 lint diagnostics resolved during iteration:
  - contractions ratio (8% → ≥30%)
  - comma density per sentence reduced
  - parts_or_states + pitfalls trimmed to soft caps

### Legacy excerpt (first 200 chars)

> GCP for Java backend work organizes around the same three layers as other clouds — compute, data storage, and messaging — but GCP's standout services are Cloud Run for containerized serverless compute…

### v2 hook + first beat preview

> hook: Treat GCP as three layers — compute, data, integration. Each has a default and a specialist, and knowing when to escalate is the real skill.

> beat[0] (definition, paragraph): Core GCP for Java work is the small set of services that hold the JVM, the data, the messages, and the secrets. The catalog's huge, but a Spring Boot service touches the same eight or ten boxes most days.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P11 — Production / SRE

- Slug: `log-levels-when-to-use-each`
- File: `content/java-backend-intermediate/observability/structured-logging/complete-qa.json`
- Archetype: A (override; classifier said D)
- Lint score: 90/100 (status: WARN)
- Iterations to converge: 2
- Top 3 lint diagnostics resolved during iteration:
  - classifier override (D→A) — conceptual 5-level taxonomy, not a debug scenario
  - contractions ratio raised (0% → ≥30%)
  - remaining warn (7.2.1 missing canonical anchor) is locked-codex out of scope

### Legacy excerpt (first 200 chars)

> Log levels define a contract with whoever is on call — ERROR means a human should look at this now; DEBUG means this is noise in production. Getting levels wrong creates either alarm fatigue or silent…

### v2 hook + first beat preview

> hook: Log levels are a contract with on-call. Get them wrong and you either page the team for nothing or lose the real outage in noise.

> beat[0] (definition, paragraph): A log level's the severity tag attached to one log statement. The five levels run TRACE, DEBUG, INFO, WARN, ERROR. It's the level that decides who looks, when, and whether the line even leaves the process in production.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?

## P12 — Interview Readiness

- Slug: `learn-new-technology-quickly`
- File: `content/java-backend-intermediate/behavioral/career-growth/complete-qa.json`
- Archetype: G
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 3
- Top 3 lint diagnostics resolved during iteration:
  - action beat hard cap (105 → ≤100, then trimmed to soft 70)
  - comma/semicolon density per sentence reduced via short fragments
  - reflection callout trimmed to soft cap

### Legacy excerpt (first 200 chars)

> I learn new stacks with a deliberate sprint: enough depth to ship safely, then backfill theory afterward. My rule is never stay solo longer than two days before scheduling a pairing session with someo…

### v2 hook + first beat preview

> hook: Learning a new tech under deadline runs on structure, not luck. Mine: docs first, throwaway prototype, pair early, then ship.

> beat[0] (situation, paragraph): We were migrating a Spring Boot monolith to an event-driven architecture. Three weeks before the feature deadline, the only Kafka-experienced engineer on the team left. I'd used RabbitMQ before but had never written a Kafka producer or cons…

### Imitation target

GG — `handle-technical-disagreements`

### Reviewer questions

- Does the v2 sound like the golden's voice?
- Is the depth appropriate for this pillar's audience?
- Does it imitate without parroting?
- Layout choices natural?
