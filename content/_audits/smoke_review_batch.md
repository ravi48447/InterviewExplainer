# Phase 3a — smoke review batch (12 v2-of-v2 drafts)

Each smoke is a complete rewrite from scratch in response to the user's feedback that the prior 12 outputs felt 'same as others' despite passing lint. The v2-of-v2s commit to a sharp angle in the hook, plant a counter-intuitive depth marker in pitfalls/example/rethink_if, and end on a portable principle (per the golden bar) — not a recap.

All 12 are `speakable_status: pending_review` and held for human review per `SPEAKABLE-PHASE-3A-PROMPT.md` §8 + §10. Phase 3b is held until the 12 smokes are individually approved, rejected, or flagged for rubric tuning.

## At-a-glance

| Pillar | Slug | Archetype | Lint | Iters | File |
|---|---|---|---:|---:|---|
| P01 | `checked-vs-unchecked-exception-java-comparison` | B | 82/100 (WARN) | 4 | `content/java-backend-intermediate/core-java/comparisons/complete-qa.json` |
| P02 | `datasource-properties` | A | 100/100 (PASS) | 2 | `content/java-backend-intermediate/spring-boot/profiles-and-properties/complete-qa.json` |
| P03 | `mongodb-vs-dynamodb-managed-tradeoffs` | B | 96/100 (WARN) | 4 | `content/java-backend-intermediate/nosql-mongodb/comparisons/complete-qa.json` |
| P04 | `message-broker-vs-message-bus-vs-event-bus-semantics` | B | 92/100 (WARN) | 7 | `content/java-backend-intermediate/messaging-events/comparisons/complete-qa.json` |
| P05 | `datafetcher-and-dataloader-graphql-java` | A | 100/100 (PASS) | 2 | `content/java-backend-intermediate/graphql/graphql-fundamentals/complete-qa.json` |
| P06 | `oo-design-with-solid-and-composition` | A (override; classifier said F) | 100/100 (PASS) | 2 | `content/java-backend-intermediate/low-level-design/lld-fundamentals/complete-qa.json` |
| P07 | `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison` | B | 100/100 (PASS) | 5 | `content/java-backend-intermediate/application-security/comparisons/complete-qa.json` |
| P08 | `chaos-engineering-java-microservices-game-days` | A | 100/100 (PASS) | 2 | `content/java-backend-intermediate/unit-testing/chaos-testing/complete-qa.json` |
| P09 | `docker-vs-vm-virtualization-comparison` | E | 100/100 (PASS) | 4 | `content/java-backend-intermediate/docker/comparisons/complete-qa.json` |
| P10 | `core-gcp-services-java-backend-developer` | A | 100/100 (PASS) | 4 | `content/java-backend-intermediate/gcp/gcp-core-services/complete-qa.json` |
| P11 | `log-levels-when-to-use-each` | A (override; classifier said D) | 90/100 (WARN) | 2 | `content/java-backend-intermediate/observability/structured-logging/complete-qa.json` |
| P12 | `learn-new-technology-quickly` | G | 100/100 (PASS) | 4 | `content/java-backend-intermediate/behavioral/career-growth/complete-qa.json` |

## P01 — Java Language & Core

- Slug: `checked-vs-unchecked-exception-java-comparison`
- File: `content/java-backend-intermediate/core-java/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 82/100 (status: WARN)
- Iterations to converge: 4
- v2-of-v2 rewrite focus: Throws-metastasis depth marker + Spring's translation answer (JdbcTemplate wraps SQLException into DataAccessException; @ControllerAdvice at the boundary).

- Remaining WARNED rules:
  - 7.2.1: definition-equivalent beat (what_each_is) lacks any canonical anchor for topic 'checked-vs-unchecked-exceptions'
  - 7.3.2: Flesch-Kincaid grade 9.3 > 9 (target ≤ 9)
  - 7.4.2: only 75% of beats <= soft (need >= 80%): tiny_example 49>40

### Legacy excerpt (first 300 chars)

> The split is about **recoverability**, not severity. Checked exceptions are the ones the compiler forces callers to acknowledge, because the designer thought callers would have a distinct recovery strategy.  **Checked exceptions** - Direct subclasses of `Exception` (not `RuntimeException`): `IOExcep…

### v2 hook + first beat preview

> hook: The split isn't severity. It's whether the compiler makes the caller acknowledge the failure. Modern Java leans hard unchecked — and the reason's a trap throws clauses set.

> beat[0] (what_each_is, grouped_paragraphs): [Checked] Sits directly under Exception. The compiler forces a catch or a throws clause. IOException. SQLException. InterruptedExc | [Unchecked] Sits under RuntimeException. The compiler doesn't force handling. NullPointerException. IllegalArgumentException. The fa

### v2 cap (the portable principle)

> Recoverability picks the side; the compiler keeps it honest. Modern Java leans unchecked plus a global handler. Checked stays for the rare case where the caller has somewhere to go.

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P02 — Spring Ecosystem

- Slug: `datasource-properties`
- File: `content/java-backend-intermediate/spring-boot/profiles-and-properties/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- v2-of-v2 rewrite focus: Concrete (cores × 2) sizing example with RDS connection-cap math + the 3am 'Connection is closed' bug story as the depth marker.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> **The four essential properties** - URL, username, password, and driver class name - Driver is auto-detected from the URL, so usually omitted  **HikariCP — the default pool since Boot 2** - Tuning prefix: `spring.datasource.hikari.*` - Key knobs: `maximum-pool-size`, `minimum-idle`, `connection-time…

### v2 hook + first beat preview

> hook: Four properties name the database. Six more decide whether the app stays up under load — and one of those six is the bug that breaks production at 3am, nowhere else.

> beat[0] (definition, paragraph): DataSource properties are the keys under spring.datasource that tell Boot how to reach the database and how to manage its pool of long-lived connections. Boot wires the DataSource bean from these keys at startup, before any repository runs.

### v2 cap (the portable principle)

> Name the database with four keys. Tune the pool with four more. The pool's smaller than instinct says, the lifetime's tighter than the database expects, and the password lives in the platform — not the file.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P03 — Data & Persistence

- Slug: `mongodb-vs-dynamodb-managed-tradeoffs`
- File: `content/java-backend-intermediate/nosql-mongodb/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 96/100 (status: WARN)
- Iterations to converge: 4
- v2-of-v2 rewrite focus: One-way-door framing (DynamoDB locks schema to today's access patterns) + GSI-cost gotcha + hot-partition celebrity-user story.

- Remaining WARNED rules:
  - 7.4.2: only 75% of beats <= soft (need >= 80%): tiny_example 53>40

### Legacy excerpt (first 300 chars)

> **Frame both** - Atlas: managed MongoDB with rich queries, pipeline, flexible schema - DynamoDB: purpose-built KV+doc; serverless, access-pattern-first  **Call out the decision pivot** - Query flexibility + aggregation + flex schema → Atlas - Serverless scale + predictable latency + bounded access p…

### v2 hook + first beat preview

> hook: Both AWS managed NoSQL — but the choice isn't 'managed vs more managed'. It's a one-way door. DynamoDB locks the schema to today's access patterns, and migrating off when those change is the bill.

> beat[0] (what_each_is, grouped_paragraphs): [MongoDB Atlas] Managed MongoDB. Flexible schema, MQL, aggregation pipeline, change streams, plus Atlas Search and Vector Search. The bi | [DynamoDB] Serverless KV + document store. Single-digit-ms latency at any scale. The team enumerates access patterns up front; new 

### v2 cap (the portable principle)

> Pick DynamoDB only when the team owns every access pattern and AWS-native pays off. Atlas when queries will change. Getting it wrong shows up as a migration project, not a bigger bill.

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P04 — APIs / Microservices / Messaging

- Slug: `message-broker-vs-message-bus-vs-event-bus-semantics`
- File: `content/java-backend-intermediate/messaging-events/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 92/100 (status: WARN)
- Iterations to converge: 7
- v2-of-v2 rewrite focus: In-process-vs-cross-process axis (not the loose names) + outbox bridge + the @EventListener-is-sync-by-default trap.

- Remaining WARNED rules:
  - 7.3.2: Flesch-Kincaid grade 9.1 > 9 (target ≤ 9)
  - 7.4.2: only 50% of beats <= soft (need >= 80%): what_each_is 59>50, tiny_example 57>40

### Legacy excerpt (first 300 chars)

> The terminology is loose but the practical distinction is clear. - A message broker is cross-process infrastructure — Kafka, RabbitMQ, ActiveMQ, SQS — that sits between services and persists messages. - A message bus or event bus is an in-process publish-subscribe library — Spring's `ApplicationEven…

### v2 hook + first beat preview

> hook: The names are loose. The axis is sharp. A broker's cross-process infra. A bus stays in-process. Treating ApplicationEventPublisher like Kafka is the most common bug here.

> beat[0] (what_each_is, grouped_paragraphs): [Message broker] Separate infra — Kafka, RabbitMQ, SQS. Services talk to it over the network. It keeps the messages and survives consumer | [In-process bus] A pub/sub library inside one JVM. Spring's ApplicationEventPublisher. Guava EventBus. Just method calls. No network. No 

### v2 cap (the portable principle)

> Pick by topology, not by name. Same JVM, same risk-of-loss tolerance — bus. Cross-service or durable — broker. Outbox is how you cross the gap without losing events.

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P05 — Architecture & Design

- Slug: `datafetcher-and-dataloader-graphql-java`
- File: `content/java-backend-intermediate/graphql/graphql-fundamentals/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- v2-of-v2 rewrite focus: Silent-data-corruption sharp edge (DataLoader maps results by array INDEX, not by key) + position-is-the-contract cap.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> DataFetcher is the resolver primitive in graphql-java — every single field in your schema has one, whether you wrote it explicitly or Spring registered it through `@QueryMapping`. For simple scalar fields like `title`, the default `PropertyDataFetcher` calls the getter. For relational fields like `B…

### v2 hook + first beat preview

> hook: Every field has a DataFetcher. DataLoader turns 51 round-trips into 2. The trap — the batch must return values by input-key position, or every book silently gets the wrong author.

> beat[0] (definition, paragraph): A DataFetcher's the resolver behind one schema field. The default PropertyDataFetcher reads scalars via getters. DataLoader wraps a batch function that takes many keys and returns the matching values in one call.

### v2 cap (the portable principle)

> Position is the contract. The cache is per-request. Forget either, and the bug is silent — the only kind of GraphQL bug that survives staging.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P06 — System Design + LLD

- Slug: `oo-design-with-solid-and-composition`
- File: `content/java-backend-intermediate/low-level-design/lld-fundamentals/complete-qa.json`
- Archetype: A (override; classifier said F)
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- v2-of-v2 rewrite focus: Forces-not-recipe framing + concrete refactor (PaymentProcessor if-else → PaymentMethod interface) with the 'tests for credit_card never change again' OCP win.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> **Why SOLID and composition matter**  Most LLD anti-patterns come from two failures:  1. Mixing responsibilities — one class does too much, changes ripple unpredictably (violates SRP, OCP) 2. Inheriting for code reuse — deep extends chains, subclasses can't substitute parents (violates LSP, makes ch…

### v2 hook + first beat preview

> hook: SOLID isn't a checklist to recite. It's the set of forces that show up when one class does too much — or when an inheritance chain breaks the moment a piece needs to swap.

> beat[0] (definition, paragraph): SOLID is five constraints — single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion. Composition is the structural choice that makes the constraints easy to honor.

### v2 cap (the portable principle)

> SOLID's a noticing tool, not a recipe. The interviewer's listening for one thing — a refactor where the violation got spotted and fixed. Reach for composition first.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P07 — Security

- Slug: `sast-vs-dast-vs-iast-vs-sca-security-scanning-comparison`
- File: `content/java-backend-intermediate/application-security/comparisons/complete-qa.json`
- Archetype: B
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 5
- v2-of-v2 rewrite focus: SCA-first framing (Log4Shell, Spring4Shell are dependency CVEs not SAST findings) + reachability gotcha (Snyk/Endor cuts noise 50-80%).

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> Each scanner finds a different bug class. None is sufficient alone. More tools without triage is security theater.  **Scanner map** - SAST (Semgrep, SonarQube, CodeQL) — source pattern analysis — fast, PR-time, noisy - SCA (Snyk, Dependabot, OSV-Scanner, Trivy) — dependency CVEs — highest ROI; real …

### v2 hook + first beat preview

> hook: Most candidates name SAST first. The trap — the interviewer's listening for SCA. Log4Shell, Spring4Shell, and most real incidents are dependency CVEs, not code anyone wrote.

> beat[0] (what_each_is, grouped_paragraphs): [SAST] Static source analysis. Semgrep, CodeQL. Catches injection, crypto misuse. Fast, noisy. | [SCA] Dependency CVE check. Snyk, Dependabot, OSV-Scanner. The scanner that catches Log4Shell.

### v2 cap (the portable principle)

> More scanners doesn't mean safer. Pick the ones whose findings someone triages this sprint. Start with SCA — the bugs it catches are the ones that actually ship.

### Imitation target

GB — `difference-between-equals-and-double-equals-java`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P08 — Testing & Quality

- Slug: `chaos-engineering-java-microservices-game-days`
- File: `content/java-backend-intermediate/unit-testing/chaos-testing/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 2
- v2-of-v2 rewrite focus: Hypothesis-not-theatre framing + concrete game-day shape (kill 50% of order-service pods; abort if error >5% for 2min OR p99 >5s).

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> Chaos engineering is the discipline of injecting failure deliberately to verify that systems behave as designed under stress.  **Origin** - Popularized by Netflix's Chaos Monkey - Now formalized by Principles of Chaos Engineering  **The mistake** - Starting with 'kill random pods in prod'  **The rig…

### v2 hook + first beat preview

> hook: Chaos engineering's mistake isn't breaking things. It's running an experiment with no hypothesis and no abort. That's just an outage with a fancy name.

> beat[0] (definition, paragraph): Chaos engineering is the discipline of injecting failure deliberately to generate evidence that the system behaves the way it's claimed to. Hypothesis first, blast radius bounded, abort criteria written down before anyone touches a button.

### v2 cap (the portable principle)

> An experiment without a hypothesis is theatre. With one, every game day either confirms a resilience claim or produces a runbook. Both outcomes ship value.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P09 — DevOps

- Slug: `docker-vs-vm-virtualization-comparison`
- File: `content/java-backend-intermediate/docker/comparisons/complete-qa.json`
- Archetype: E
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 4
- v2-of-v2 rewrite focus: Containers-INSIDE-VMs framing (cloud production pattern) + Firecracker microVM as the third option + rethink_if covers tenant code, block-I/O saturation, database in container.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> Containers and VMs solve different problems and in production they are usually used together — not as alternatives.  **Architectural difference** - A VM virtualizes the entire hardware stack: hypervisor, virtual CPU, virtual memory, virtual disk, and a complete guest operating system; each VM runs i…

### v2 hook + first beat preview

> hook: Containers vs VMs sounds like a fork in the road. In cloud, it's a stack — containers run inside VMs.

> beat[0] (optimising_for, paragraph): It's rarely 'one or the other'. The real call is how hard a boundary the workload needs, and where the speed and density numbers have to land.

### v2 cap (the portable principle)

> Pick both. Containers buy density and startup speed; the VM underneath buys the kernel boundary. The interviewer's listening for which boundary the workload actually needs.

### Imitation target

(no E golden — built fresh per pillar P09 brief; archetype E shape per archetypes.md)

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P10 — Cloud

- Slug: `core-gcp-services-java-backend-developer`
- File: `content/java-backend-intermediate/gcp/gcp-core-services/complete-qa.json`
- Archetype: A
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 4
- v2-of-v2 rewrite focus: Default-vs-escalation pivot per layer + cold-start sharp edge (JVM cold start on Cloud Run runs 6-10s) + Spanner-as-flagship costs ~14× Cloud SQL.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> GCP for Java backend work organizes around the same three layers as other clouds — compute, data storage, and messaging — but GCP's standout services are Cloud Run for containerized serverless compute and BigQuery for analytics.  **Compute — from most managed to most controlled** - Cloud Run runs Do…

### v2 hook + first beat preview

> hook: GCP interviews aren't testing memorisation of 200 services. They're testing one thing — picking the cheapest service that fits, then defending it when the team reaches for the flagship.

> beat[0] (definition, paragraph): GCP exposes the standard cloud building blocks. For a Java backend, the surface that actually matters is small — a handful of services tied together by IAM.

### v2 cap (the portable principle)

> Default to the cheapest managed option that fits today's load. Escalate only with a concrete limit to point at. The interviewer's listening for the second sentence.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P11 — Observability & Production

- Slug: `log-levels-when-to-use-each`
- File: `content/java-backend-intermediate/observability/structured-logging/complete-qa.json`
- Archetype: A (override; classifier said D)
- Lint score: 90/100 (status: WARN)
- Iterations to converge: 2
- v2-of-v2 rewrite focus: Pager-contract framing + parameterized-logging depth marker (log.debug("x={}", v) skips allocation when DEBUG off) + /actuator/loggers runtime trick.

- Remaining WARNED rules:
  - 7.2.1: definition-equivalent beat (definition) lacks any canonical anchor for topic 'log-levels-and-structured-logging'

### Legacy excerpt (first 300 chars)

> Log levels define a contract with whoever is on call — ERROR means a human should look at this now; DEBUG means this is noise in production. Getting levels wrong creates either alarm fatigue or silent failures.  **ERROR — requires human attention** - ERROR means something failed that affects user ex…

### v2 hook + first beat preview

> hook: Log levels aren't a developer convenience. They're a contract with whoever's holding the pager.

> beat[0] (definition, paragraph): A log level's the severity tag on one statement. Five levels run TRACE, DEBUG, INFO, WARN, ERROR. The level decides who looks, when, and whether the line even leaves the process in production.

### v2 cap (the portable principle)

> Treat the level as a pager contract. ERROR pages, WARN signals drift, INFO tells the story, DEBUG and TRACE are diagnostic. The noisier the level, the cheaper the on-call's attention.

### Imitation target

GA — `java-thread-lifecycle-states`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

## P12 — Behavioural & Engineering Practices

- Slug: `learn-new-technology-quickly`
- File: `content/java-backend-intermediate/behavioral/career-growth/complete-qa.json`
- Archetype: G
- Lint score: 100/100 (status: PASS)
- Iterations to converge: 4
- v2-of-v2 rewrite focus: Story-commit hook (Kafka engineer left 3 weeks before launch) + human moment in action (Day 4 evening — 'treating figure-it-out-alone as proof I deserved the role') + portable-principle cap.

- Lint clean — no remaining failed or warned rules.

### Legacy excerpt (first 300 chars)

> I learn new stacks with a deliberate sprint: enough depth to ship safely, then backfill theory afterward. My rule is never stay solo longer than two days before scheduling a pairing session with someone who has operated the technology in production, because solo exploration has sharply diminishing r…

### v2 hook + first beat preview

> hook: I'll take the time the only Kafka-experienced engineer on the team left three weeks before launch. I'd never written a producer.

> beat[0] (situation, paragraph): We were halfway through migrating a Spring Boot monolith to event-driven. The senior who owned all our Kafka knowledge took a counter-offer with three weeks left on the clock. I'd shipped RabbitMQ before, but the producer and consumer code in our repo was effectively a black box 

### v2 cap (the portable principle)

> Under deadline, the bottleneck's rarely the docs. It's how late you let yourself ask. Schedule the pair on the calendar, not in your head.

### Imitation target

GG — `handle-technical-disagreements`

### Reviewer questions

- Does the hook commit to a sharp angle (not just restate the question)?
- Is the depth marker counter-intuitive enough that an interviewer would press on it?
- Are the pitfalls sharp edges with consequences (not textbook mistakes)?
- Is the cap a portable principle (quotable beyond this question), not a recap?
- Does it sound like the golden's voice without parroting it?

