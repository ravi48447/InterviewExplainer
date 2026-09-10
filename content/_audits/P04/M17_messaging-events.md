# Audit — messaging-events

**Pillar:** P04 Web & Distributed
**Module:** M17 messaging-events
**Topics present:** 11 (of 13 — `cqrs`, `stream-processing`, `webhooks`, `comparisons` are empty)
**Questions:** 34 (all written, no stubs)
**Benchmark sources:** Confluent Kafka docs, RabbitMQ official tutorials (6 parts), Chris Richardson "Microservices Patterns" (messaging chapters), Gwen Shapira "Kafka: The Definitive Guide", Spring for Apache Kafka reference, Spring AMQP reference

---

## Biggest finding — topic structure is heavily imbalanced

**Kafka vs RabbitMQ balance is good (12 vs 9), but `kafka-architecture` topic is mislabeled:**

| Topic | Qs | Content |
|---|---|---|
| `kafka-architecture` | 2 | Schema evolution + embedded testing — neither is about Kafka's actual architecture (broker, partitioning, replication, ISR, controller) |
| `kafka-patterns` | 12 | The Kafka content is all here |
| `spring-kafka` | 1 | Spring Cloud Stream only — no Spring Kafka configuration patterns |
| `rabbitmq` | 9 | Well-organized, strong content |

**Real Kafka architecture topics are missing** — no questions on broker internals, partition leadership, ISR (in-sync replicas), controller election, log compaction, KRaft mode vs ZooKeeper. Topic is effectively empty of its own name's content.

---

## Second finding — speakable format splits by topic

- Topics using `bulleted-subheaders` speakables: messaging-fundamentals, kafka-architecture Q1, spring-kafka, rabbitmq, event-sourcing, message-guarantees, scenario-based (mostly) — **25 Qs**
- Topics using `prose` speakables: kafka-patterns Q3–Q12, kafka-architecture Q2, scenario-based Q4 — **9 Qs**

All 9 prose-format speakables are in the `kafka-patterns` topic + related. This looks like **a topic authored in a different pass** with different style guidelines. For consistency, should be brought into line with the rest of the module (or — if prose is preferred for configuration-style content — the other topics should be moved to prose).

---

## Third finding — kafka-patterns topic is configuration-heavy but code-empty

10 of 12 questions in `kafka-patterns` have 260–350w Zone 3 with **zero code**, covering topics that are **entirely configuration-driven**:

- Q3 KafkaTemplate + producer factory — config (ProducerFactory, DefaultKafkaProducerFactory beans)
- Q4 `@KafkaListener` + partitions + groupId + concurrency — all annotation attributes
- Q5 acknowledgment mode (manual vs auto) — `AckMode.MANUAL`, `ContainerProperties.AckMode`
- Q6 retryable topic + non-blocking retry — `@RetryableTopic` annotation config
- Q7 transactional Kafka producers — `transactional.id` config + `@Transactional` + `KafkaTransactionManager`
- Q8 JSON/Avro serialization — `Serializer<T>` impl + schema registry config
- Q9 consumer group rebalancing — `partition.assignment.strategy`, cooperative rebalance config
- Q10 producer batching + compression — `linger.ms`, `batch.size`, `compression.type` properties
- Q11 consumer lag monitoring — Micrometer metrics + `consumer.fetcher.records-lag-max`
- Q12 Kafka headers + message metadata — `MessageHeaders`, `ConsumerRecord.headers()`

**Every one of these is all-config, no-code.** Top Kafka tutorials show the Spring config snippet for each. This is archetype-fail for configuration-heavy content.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Every Kafka/RabbitMQ configuration concept shown with annotation + properties | **Failing in kafka-patterns** (10/12 code-missing); **matching in rabbitmq** (avg 2–5 code blocks per Q) |
| Outbox pattern, saga, idempotent consumers, DLQ always include code snippet for the pattern | Matching — outbox Q has 3 code blocks, idempotent consumer has 4, dead-letter has 3 |
| Opening bolds messaging primitive (`**topic**`, `**partition**`, `**consumer group**`, `**exchange**`, `**routing key**`, `**DLQ**`) | **Failing** — 0 of 34 direct answers have bold anchors |
| Analogies common (Kafka partition = "lane on a highway", consumer group = "team splitting the inbox", exchange = "mail sorter") | **Matching** — 18 of 34 have detected analogies — best coverage in the project outside architecture-patterns |
| RabbitMQ content always shows exchange+queue+binding setup | Matching — rabbitmq topic Qs have 540–940w Zone 3 with 1–5 code blocks |
| CQRS paired with event sourcing in every messaging prep source | **Failing** — cqrs topic empty, event-sourcing has 1 Q |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | KAFKA-ARCHITECTURE MISLABELED | **MAJOR** | Topic `kafka-architecture` has 2 questions that aren't about Kafka architecture. Real architecture content (broker/partitioning/replication/ISR/controller/KRaft/log compaction) is missing entirely |
| S2 | KAFKA-PATTERNS CODE-EMPTY | **MAJOR** | 10 of 12 questions are configuration-centric but have zero code. The biggest single authoring gap in the module |
| S3 | EMPTY TOPICS | **MAJOR** | `cqrs` (0 Qs — paired with event-sourcing, standard interview companion), `stream-processing` (0 Qs — Kafka Streams, KStream/KTable, windows are standard interview territory), `webhooks` (0 Qs — distinct topic from message brokers, own patterns), `comparisons` (0 Qs) |
| S4 | FORMAT INCONSISTENCY | **MODERATE** | 9 prose speakables clustered in kafka-patterns vs 25 bulleted-subheader speakables elsewhere. Pick one per module |
| S5 | MODULE-WIDE ZONE 1 | **MODERATE** | 34 of 34 direct answers have 0 bold anchors; 1 paragraph wall (rabbitmq Q7 publisher-confirms 63w) |
| S6 | SHORT SPEAKABLES | MINOR | 4 sub-120w speakables (Q3 KafkaTemplate 108w, Q10 batching 114w, Q12 headers 118w, scenario Q4 default-error-handler 118w). All in the prose-format cluster |
| S7 | CROSS-MODULE OVERLAP | MODERATE | `event-sourcing-storing-state-as-events` here (601w) vs `event-sourcing-pattern` in architecture-patterns (975w) — decide scope. `saga-pattern-distributed-transactions-choreography` here — likely duplicated in microservices module |
| S8 | INTRA-MODULE NEAR-DUPLICATE | MINOR | `dead-letter-queue-spring-kafka-rabbitmq` (rabbitmq Q1, 707w) vs `dead-letter-exchange-retry` (message-guarantees Q3, 710w) — two DLQ questions in different topics, similar scope. Verify distinct angles or merge |

---

## Per-question issues

### `messaging-fundamentals` (2 Qs)

Both structurally fine. Q2 missing analogy.

### `kafka-architecture` (2 Qs) — **topic mislabeled**

| Q | Issue | Severity |
|---|---|---|
| **Q1** event-schema-evolution-backward-compatibility | 599w / 2 code / analogy — good content, but belongs under `kafka-patterns` or a dedicated `schema-evolution` topic | MINOR + MOVE |
| **Q2** embedded-kafka-testing-spring-boot | 274w / **0 code** — testing content without showing `@EmbeddedKafka` annotation + `TestContainers<KafkaContainer>` is off-brand. Also belongs under `spring-kafka` topic | MODERATE + MOVE |

**Missing from topic (add as new questions):**
- `kafka-broker-architecture` — broker, topic, partition, offset, segment, ISR
- `kafka-replication-isr` — replication, leader election, `min.insync.replicas`, `acks=all` semantics
- `kafka-kraft-vs-zookeeper` — KRaft mode (Kafka 3.3+ production, 3.5+ default) replacing ZooKeeper
- `kafka-log-compaction` — compacted topics, retention semantics

### `kafka-patterns` (12 Qs) — code + format issues

| Q | Issue | Severity |
|---|---|---|
| **Q1** outbox-pattern-reliable-event-publishing | 740w / 3 code / analogy — **best-shaped Q in topic** | MINOR |
| **Q2** consumer-group-fan-out-event-patterns | 636w / 1 code / analogy | MINOR |
| **Q3** kafka-template-producer-factory-config | 263w / **0 code** / prose speakable (108w short). Config-heavy Q with no config shown | **MAJOR** |
| **Q4** kafka-listener-partitions-groupid-concurrency | 267w / **0 code**. `@KafkaListener(topics=..., groupId=..., concurrency=...)` attributes must be shown | **MAJOR** |
| **Q5** acknowledgment-mode-manual-vs-auto | 303w / **0 code** / analogy. `AckMode.MANUAL`, `AckMode.BATCH`, `AckMode.RECORD` enum + `Acknowledgment.acknowledge()` call | **MAJOR** |
| **Q6** retryable-topic-non-blocking-retry | 301w / **0 code**. `@RetryableTopic(backoff = @Backoff(delay=...), attempts=...)` annotation is the entire point | **MAJOR** |
| **Q7** transactional-kafka-producers-spring | 330w / **0 code**. Transactional producer config (`transactional.id`, `KafkaTransactionManager`) + `@Transactional` method on `KafkaTemplate` | **MAJOR** |
| **Q8** kafka-json-avro-serialization-spring | 259w / **0 code**. `JsonSerializer` / `KafkaAvroSerializer` + schema registry URL config | **MAJOR** |
| **Q9** kafka-consumer-group-rebalancing | 287w / **0 code**. `partition.assignment.strategy` values, cooperative sticky config, rebalance listener hooks | MODERATE |
| **Q10** kafka-producer-batching-compression | 280w / **0 code**. `linger.ms`, `batch.size`, `compression.type=gzip/snappy/lz4/zstd` — pure properties-based content | **MAJOR** |
| **Q11** kafka-consumer-lag-monitoring | 348w / **0 code**. Should show: `kafka-consumer-groups.sh --describe --group...`, Micrometer `kafka_consumer_records_lag_max` metric | MODERATE |
| **Q12** kafka-headers-message-metadata | 281w / **0 code**. `ProducerRecord.headers().add()`, `@Header` parameter on `@KafkaListener` method | MODERATE |

### `spring-kafka` (1 Q) — **thin topic**

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-cloud-stream-event-driven-microservices | 555w / 2 code / no analogy. Topic is thin — only 1 Q for Spring Kafka integration | MINOR + THIN TOPIC |

**Missing from topic:** `spring-kafka-listener-container-factory-config`, `spring-kafka-error-handling-container-vs-listener`, `spring-kafka-transactions-with-db` (KafkaTransactionManager + JpaTransactionManager chaining).

### `rabbitmq` (9 Qs) — **strongest topic in module**

All 9 well-written with 540–940w Zone 3, code coverage, analogies. Universal "no bold anchors" and occasional missing analogies are the only issues.

| Q | Issue | Severity |
|---|---|---|
| Q1 dead-letter-queue | 707w / 3 code / no analogy | MINOR |
| Q2 rabbitmq-exchange-types | 660w / 1 code / analogy — good | MINOR |
| Q3 rabbitmq-vs-kafka | 691w / **0 code** / analogy. A head-to-head comparison with zero code — at least show the config or publishing-call side-by-side | **MAJOR** |
| Q4 spring-amqp-setup | 654w / **5 code** / no analogy — best code coverage in module | MINOR |
| Q5 rabbitmq-acknowledgment-modes | 613w / 2 code / analogy | MINOR |
| Q6 rabbitmq-message-durability | 721w / 1 code / analogy | MINOR |
| Q7 rabbitmq-publisher-confirms | Paragraph wall (63w). 546w / 3 code / no analogy | MODERATE |
| Q8 rabbitmq-clustering-ha | 938w / 4 code / analogy — longest Zone 3 in topic | MINOR |
| Q9 spring-amqp-testing-embedded | 735w / 4 code / analogy | MINOR |

### `event-sourcing` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** event-sourcing-storing-state-as-events | 601w / 1 code / no analogy. Overlaps with architecture-patterns module — decide scope | MINOR + OVERLAP |

**Topic gap:** add a companion Q on event store implementation choices (PostgreSQL event table vs dedicated event store vs Kafka compacted topic).

### `cqrs` (0 Qs) — **empty**

Cross-module note: architecture-patterns M19 has this as a gap too. Suggest: authoring CQRS here (messaging angle: command handler → event → read-model projector), with link to an architecture-level CQRS Q in M19.

### `message-guarantees` (3 Qs) — all well-shaped

All 3 are CLEAN apart from bold anchors + 1 missing analogy. Standard interview content (exactly-once vs at-least-once, idempotent consumers, DLX retry). Highest average Zone 3 in module (~728w).

### `stream-processing` (0 Qs) — **empty**

Standard topic coverage: `kafka-streams-kstream-vs-ktable`, `kafka-streams-windowing`, `kafka-streams-stateful-vs-stateless-processing`, `kafka-streams-vs-ksqldb`.

### `webhooks` (0 Qs) — **empty**

Distinct from broker messaging — own patterns: `webhook-delivery-reliability`, `webhook-signature-verification-hmac`, `webhook-retry-policy-backoff`, `webhook-vs-polling-vs-websockets` (or move last into comparisons).

### `scenario-based` (4 Qs)

| Q | Issue | Severity |
|---|---|---|
| Q1 saga-choreography | 684w / 2 code / analogy. Cross-module overlap risk with microservices | MINOR + OVERLAP |
| Q2 eventual-consistency-race-conditions | 723w / 3 code / no analogy | MINOR |
| Q3 competing-consumers-pattern | 560w / 2 code / analogy | MINOR |
| Q4 default-error-handler-seek-to-current | 294w / **0 code** / prose speakable short (118w). `DefaultErrorHandler` + `SeekToCurrentErrorHandler` config | MODERATE |

### `comparisons` (0 Qs) — **empty**

Move candidates: `rabbitmq-vs-kafka` (rabbitmq Q3), `exactly-once-vs-at-least-once-delivery` (message-guarantees Q1). Plus new: `kafka-vs-pulsar`, `webhook-vs-message-queue-vs-websocket`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | No stubs, no broken schema |
| **MAJOR** | **9** | S1 kafka-architecture mislabeled, S2 kafka-patterns code-empty (pattern issue), S3 empty topics, kafka-patterns Q3/Q4/Q5/Q6/Q7/Q8/Q10 code-missing, Q3 rabbitmq-vs-kafka code-missing |
| **MODERATE** | **9** | Q2 embedded-kafka-testing, Q9/Q11/Q12 kafka-patterns (partial code justification), Q7 rabbitmq publisher-confirms paragraph wall, Q4 default-error-handler, S4 format inconsistency, S5 bold anchors, S7 cross-module overlap |
| **MINOR** | **16** | Remaining rabbitmq + message-guarantees + scenario-based Qs — well-shaped, need only bold + selective analogy |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 34
- `zone3_no_code_examples` × 11
- `zone3_no_analogy` × 12
- `zone2_speakable_short` × 4
- `zone1_direct_answer_paragraph_wall` × 1

---

## Suggested fix order

1. **Decide kafka-architecture topic scope** (S1) — author 3–4 real Kafka architecture questions (broker/partitioning/replication/ISR/KRaft) and move Q1 schema-evolution + Q2 embedded-testing to their correct topics.
2. **Batch code-addition pass on kafka-patterns** (S2) — 10 questions with mechanical config-snippet additions. Fastest ROI in the module.
3. **Unify speakable format** (S4) — pick bulleted-subheaders (matches 74% of module) and convert the 9 kafka-patterns prose speakables, or vice versa.
4. **Decide cross-module scope** with M19 architecture-patterns for event-sourcing + CQRS, and with M16 microservices for saga.
5. **Author `cqrs` topic** — 1–2 questions, companion to event-sourcing.
6. **Author `stream-processing` topic** — 3 questions minimum on Kafka Streams.
7. **Author `webhooks` topic** — distinct pattern area, 3 questions minimum.
8. **Expand `spring-kafka` topic** — 2–3 more questions on container factory, error handling, DB+Kafka transactions.
9. **Resolve DLQ near-duplicate** (S8) — rabbitmq Q1 vs message-guarantees Q3. Sharpen scopes: rabbitmq one = exchange+queue config mechanics; message-guarantees one = the retry-then-DLQ strategy + dedup.
10. **Module-wide bold-anchor pass** — 34 mechanical fixes.
