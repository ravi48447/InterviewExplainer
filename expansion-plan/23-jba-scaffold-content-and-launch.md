# 23 — JBA: Scaffold, Content & Launch

> **Executor:** AI coding agent operating across 14 parallel per-module
> sub-runs.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain scaffold + content (~600 high-depth Q) +
> public launch.

## TL;DR

- **Input:** Playbook 22 spec is approved.
- **Action:** Scaffold + wire + write 600 Q + flip launch flag.
- **Output:** JBA live on the public site; tile on the homepage points
  the senior-engineer audience to `/interview/java-backend-advanced`.

## Hard prerequisites

- [ ] Playbook 22 is DONE.
- [ ] Playbooks 20+21 (JBB) shipped successfully — same pattern.

## Why this matters (2 sentences)

JBA is the **highest-paying-interview surface in the entire Java empire**
— "staff engineer interview questions java" + "principal engineer
interview questions java" + "java system design at scale" combined
target the candidates who pay $500+ courses (Educative, ByteByteGo).
Shipping JBA at full quality (600+ heavy-hard Qs, leadership content,
multi-region SD cases) graduates us from a "fresher/mid prep site"
to a "career platform" with senior-IC and EM users — the highest LTV
segment.

## Search phrases the launch targets

| Search phrase                                          | Target page                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `staff engineer java interview questions`              | `/staff-engineer-java-interview-questions`   |
| `senior java developer interview questions`            | `/senior-java-developer-interview-questions` |
| `principal java engineer interview questions`          | (alt → app URL)                              |
| `java system design at scale interview questions`      | `/interview/java-backend-advanced/system-design-at-scale` |
| `java distributed systems interview questions`         | `/interview/java-backend-advanced/distributed-systems-deep` |
| `engineering manager java interview questions`         | `/interview/java-backend-advanced/engineering-management-and-hiring` |
| `java low latency interview questions`                 | `/interview/java-backend-advanced/low-latency-jvm` |

## Current state

- `java-backend-advanced` does NOT exist on disk.
- Public visibility OFF.

## Target state (measurable)

- 14 modules scaffolded; 600+ Q at launch; difficulty 10/45/45.
- Speakable per-module pass+warn ≥ 90 %.
- All altSlugs 301 to canonical SEO URL.
- Tile in `LAUNCH_QUICK_PATHS` visible.
- Tag `jba-launch-<DATE>` exists.

## Step 1 — Scaffold via the scaffolder

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

python3 scripts/new_locked_domain.py \
  --slug java-backend-advanced \
  --label "Java Backend (Advanced)" \
  --language java \
  --level advanced \
  --seo-slug java-interview-questions-for-experienced-senior \
  --alt-slug java-staff-engineer-interview-questions \
  --alt-slug principal-engineer-interview-questions-java \
  --alt-slug java-tech-lead-interview-questions \
  --alt-slug senior-java-developer-interview-questions \
  --alt-slug java-architect-interview-questions \
  --modules \
    jvm-internals-deep:P01 \
    spring-internals-deep:P02 \
    concurrency-and-virtual-threads-deep:P01 \
    microservices-at-scale:P05 \
    event-driven-and-streaming-deep:P05 \
    system-design-at-scale:P06 \
    architecture-and-evolution:P06 \
    distributed-systems-deep:P06 \
    data-at-scale:P03 \
    kubernetes-platform-engineering:P09 \
    cloud-cost-and-multi-region:P10 \
    production-sre-deep:P11 \
    staff-engineer-leadership:P12 \
    engineering-management-and-hiring:P12
```

Verify:

```bash
jq '.modules | length' content/java-backend-advanced/_index.json   # 14
rg "'java-backend-advanced'" frontend/lib/content-reader.ts          # present
```

## Step 2 — Per-module content blueprints

For EACH of the 14 modules, here's the canonical question/topic list.
Audience: 8+ YOE Java. Tone: deep, concrete, numbered.

### 23.1 — `jvm-internals-deep` (40 Q)

Topics:
- `gc-deep` (10 Q): G1 internals, ZGC pause budgets, GraalVM native vs HotSpot, ergonomic defaults vs explicit tuning, Shenandoah, Epsilon
- `memory-model` (6 Q): JMM happens-before, safe publication, false sharing, cache coherence
- `jit-and-aot` (8 Q): C1/C2 tiered, inlining heuristics, escape analysis, AOT compilation, GraalVM native image trade-offs
- `class-loading-deep` (6 Q): Module system, jlink, custom class loaders, classloader leaks
- `tuning-and-troubleshooting-prod` (6 Q): async-profiler, JFR, heap dump triage, OOM debugging
- `comparisons` (4 Q): G1 vs ZGC vs Shenandoah vs Parallel; HotSpot vs OpenJ9 vs GraalVM

Money questions:
1. How would you tune ZGC for a service with a 50-GB heap and a p99 ≤ 50 ms pause budget?
2. When does GraalVM native image win over HotSpot — and when does it lose?
3. Walk me through how the JIT decides to inline a method.
4. How would you debug a slow-leak OOM in production on a 32-GB heap?

### 23.2 — `spring-internals-deep` (40 Q)

Topics:
- `auto-config-internals` (8 Q)
- `bean-lifecycle-deep` (6 Q): BeanPostProcessor ordering, FactoryBean, ObjectProvider lazy patterns
- `aop-internals` (6 Q): proxy types (JDK vs CGLIB), pointcut compilation, self-invocation explained
- `spring-boot-aot-and-native` (6 Q): @AotProcessor, runtime hints, native-image readiness
- `transaction-internals` (6 Q): PlatformTransactionManager dispatch, propagation algorithm, JTA vs Spring TX
- `observability-instrumentation` (4 Q): Micrometer Observation, ObservationRegistry, OTel bridge
- `comparisons` (4 Q): WebMvc vs WebFlux at scale; AOT vs JIT for Spring

### 23.3 — `concurrency-and-virtual-threads-deep` (40 Q)

Topics:
- `jmm-and-happens-before` (6 Q)
- `virtual-threads-jep-444` (8 Q): mounting, pinning, scope, cost
- `structured-concurrency-jep-462` (6 Q)
- `scoped-values-jep-446` (4 Q)
- `lock-free-and-cas` (6 Q): JCTools, ConcurrentHashMap internals after JDK 8, LongAdder
- `jmh-benchmarking` (5 Q)
- `comparisons` (5 Q): virtual threads vs reactive vs platform threads at scale

Money questions:
1. When would you choose virtual threads over reactive WebFlux?
2. What is pinning in virtual threads and how do you detect it?
3. Walk me through ConcurrentHashMap internals after the JDK 8 redesign.

### 23.4 — `microservices-at-scale` (50 Q)

Topics:
- `decomposition-at-scale` (10 Q): event storming, bounded contexts, anti-patterns
- `service-mesh-internals` (8 Q): Istio control plane, Envoy filter chain, mTLS rotation
- `inter-service-comms` (8 Q): sync vs async at 1000 RPS, fan-out limits, hedged requests
- `resilience-at-scale` (8 Q): adaptive concurrency, load shedding, circuit breaker tuning
- `tracing-at-scale` (6 Q): tail-based sampling, head-based sampling, OTel collector tuning
- `multi-region-microservices` (5 Q)
- `comparisons` (5 Q): Spring Cloud vs Service Mesh; Eureka vs Consul vs DNS-only

Money questions:
1. You inherit 200 microservices and an SLO breach per week. Where do you start?
2. Design the rollout plan for migrating from Spring Cloud Netflix to Istio.
3. How do you decide whether a feature is "one service" or "two services"?

### 23.5 — `event-driven-and-streaming-deep` (40 Q)

Topics:
- `kafka-internals-deep` (10 Q): replication protocol, ISR, KRaft (no ZK), tiered storage
- `eos-and-transactions` (8 Q): producer transactions, read-process-write, idempotent producer
- `schema-evolution` (6 Q): Avro vs Protobuf vs JSON Schema, registry strategies
- `change-data-capture` (6 Q): Debezium, outbox, transactional log shipping
- `kafka-tuning` (5 Q): batch.size, linger.ms, compression, partition count for throughput
- `comparisons` (5 Q): Kafka vs Pulsar vs Kinesis; KStreams vs Flink

### 23.6 — `system-design-at-scale` (50 Q — 70 % archetype C)

20 deep case studies + 30 supporting concept Qs.

**Cases to write (one `complete-qa.json` each):**

1. Multi-region URL shortener (1B redirects/day)
2. Global ad-bidding pipeline (100 k RPS, < 50 ms p99)
3. Multi-tenant SaaS data isolation strategies
4. Geo-distributed cache with eventual consistency
5. Distributed counter / leaderboard at 100 M users
6. Live video streaming pipeline
7. Real-time fraud detection (sub-second decisioning)
8. Search system at 50 B docs (sharding + ranking)
9. Multi-region payment processing (idempotency + dispute)
10. Object storage with multi-region replication (S3-clone deeper than playbook 16)
11. Distributed scheduler (Airflow-style)
12. Time-series store for observability (Prometheus-class)
13. Multi-region eventual-consistency reconciliation
14. Hot-key handling at scale (Redis cluster)
15. Large-scale notification fanout (10 M users / event)
16. Cross-region data residency / GDPR-aware storage
17. Audit log infrastructure with tamper-evidence
18. Massive log ingest pipeline (10 TB/day)
19. Hot/cold data tiering for cost
20. Disaster recovery design (RPO=15 min, RTO=1 h)

Each case must have:
- A mermaid diagram
- A capacity calculation block with numbers
- A multi-region OR multi-tenant variant in `follow-ups`
- A cost section (rough $/month estimate)

### 23.7 — `architecture-and-evolution` (40 Q)

Topics:
- `strangler-fig` (6 Q)
- `monolith-to-microservices` (8 Q): rollout strategies, dual-write windows
- `domain-driven-design` (6 Q): ubiquitous language, anti-corruption layers
- `hexagonal-at-scale` (4 Q)
- `cqrs-event-sourcing-deep` (6 Q): snapshot strategies, replay performance
- `large-codebase-refactor` (4 Q): module boundaries, ratchets
- `comparisons` (6 Q): Hexagonal vs Onion vs Clean

### 23.8 — `distributed-systems-deep` (40 Q)

Topics:
- `consensus` (10 Q): Raft, Paxos, leader election, lease-based leadership
- `time-and-ordering` (6 Q): Lamport clocks, vector clocks, hybrid logical clocks
- `crdts` (6 Q): G-Counter, OR-Set, LWW-Element-Set
- `replication-models` (6 Q): single-leader, multi-leader, leaderless; quorum tuning
- `distributed-transactions` (6 Q): 2PC, 3PC, saga, TCC, percolator
- `comparisons` (6 Q): Raft vs Paxos; strong vs causal vs eventual consistency

### 23.9 — `data-at-scale` (40 Q)

Topics:
- `sharding-strategies` (8 Q): hash, range, geo; rebalancing
- `multi-region-postgres` (6 Q): logical replication, partitioning, citus
- `nosql-at-scale` (6 Q): DynamoDB partition keys, hot shards, GSIs
- `analytical-stores` (6 Q): ClickHouse, BigQuery, Snowflake (when each)
- `cost-aware-data` (6 Q): tiered storage, lifecycle policies, compaction
- `data-migration` (4 Q): dual-write, backfill, cutover
- `comparisons` (4 Q): row vs columnar; OLTP vs OLAP at PB scale

### 23.10 — `kubernetes-platform-engineering` (40 Q)

Topics:
- `operators-and-crd` (8 Q): controller pattern, reconciliation loops, Kubebuilder
- `gitops` (6 Q): Argo CD, Flux, app-of-apps
- `multi-tenancy` (6 Q): namespace isolation, hierarchical namespaces, OPA/Kyverno
- `service-mesh-deep` (6 Q): Istio vs Linkerd internals
- `cluster-autoscaling-deep` (5 Q): Karpenter, KEDA, dynamic provisioning
- `security-and-policy` (5 Q): admission controllers, pod security standards, Kyverno
- `comparisons` (4 Q): Argo CD vs Flux; Istio vs Linkerd

### 23.11 — `cloud-cost-and-multi-region` (30 Q)

Topics:
- `finops-fundamentals` (6 Q)
- `cost-attribution` (4 Q)
- `cross-region-transfer-cost` (4 Q)
- `rpo-rto-budgets` (4 Q)
- `compute-cost-strategies` (5 Q): RI vs Savings Plan vs Spot
- `data-residency` (3 Q): GDPR, data sovereignty
- `comparisons` (4 Q): active-active vs active-passive multi-region

### 23.12 — `production-sre-deep` (40 Q)

Topics:
- `major-incident-management` (8 Q)
- `chaos-engineering-programmes` (6 Q): game days at scale, fault injection
- `error-budgets-and-burn-rate` (5 Q)
- `change-failure-rate` (4 Q): DORA metrics in depth
- `capacity-planning-at-scale` (5 Q): headroom, forecasting, autoscaling vs static
- `post-incident-learning` (5 Q): blameless retros at scale, action-item closure
- `comparisons` (7 Q): on-call models, SLI vs SLO vs SLA in depth

### 23.13 — `staff-engineer-leadership` (70 Q — 80 % archetype G)

Topics:
- `tell-me-about-a-staff-project` (10 Q variants)
- `multi-team-influence` (10 Q)
- `rfc-and-design-doc-adoption` (8 Q)
- `dealing-with-disagreement-at-scale` (8 Q)
- `tech-debt-prioritisation` (8 Q)
- `mentoring-and-coaching` (8 Q)
- `staff-vs-em-decision` (5 Q)
- `cross-org-projects` (8 Q)
- `comparisons-and-meta` (5 Q)

Voice rules:
- Every story names ≥ 2 stakeholders by role (e.g. "the platform PM and
  the head of infra").
- Every Result paragraph names dollars OR people OR time-to-resolution OR % outage reduction.
- Banned: "we" without explanation of YOUR specific contribution.

### 23.14 — `engineering-management-and-hiring` (40 Q)

Topics:
- `hiring-rubric-design` (6 Q)
- `interviewer-calibration` (5 Q)
- `performance-reviews` (6 Q)
- `growth-paths-and-promo-packets` (5 Q)
- `org-design` (5 Q): team size, spans, structures
- `headcount-and-budget` (4 Q)
- `em-vs-ic-track` (4 Q)
- `comparisons` (5 Q): manager-of-managers vs IC track

## Step 3 — Execution loop (per module)

For each of the 14 modules:

1. Open the topic files.
2. Write archetype-correct, depth-correct questions from the canonical
   list.
3. Validate + lint per file.
4. Commit per ~15 questions: `content(jba/<module>): +N depth questions`.
5. After module hits target: run pillar lint + difficulty mix check.

## Step 4 — Cross-link map (mandatory)

JBA cross-links INTO JBI for fundamentals. JBI does NOT cross-link to
JBA (we want JBI users to see JBA tile only on the homepage).

Required JBA → JBI cross-links per module:

| JBA module                              | Cross-links into JBI                       |
| --------------------------------------- | ------------------------------------------ |
| jvm-internals-deep                      | jvm-internals (basics)                     |
| spring-internals-deep                   | spring-core / spring-boot                  |
| concurrency-and-virtual-threads-deep    | java-concurrency                           |
| microservices-at-scale                  | microservices                              |
| event-driven-and-streaming-deep         | messaging-events                           |
| system-design-at-scale                  | system-design-cases                        |
| kubernetes-platform-engineering         | kubernetes                                 |
| production-sre-deep                     | production-sre                             |

Verify:

```bash
rg -c '/interview/java-backend-intermediate' content/java-backend-advanced/ | awk -F: '$2>0'
# Expect each JBA module to have cross-links to JBI
```

## Step 5 — Flip launch

Same as JBB Step "Flip launch flags":

```typescript
// frontend/lib/launch-config.ts — append:
{
  title:      'Java for Staff / Principal',
  audience:   'advanced',
  language:   'java',
  href:       '/interview/java-backend-advanced',
  description:'Senior, staff, principal, and EM Java interview prep — deep architecture, multi-region scale, leadership.',
},
```

## Quality gates

| Gate                                                  | Threshold     | Verify with                                                              |
| ----------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| Per-module Q targets met                              | 14 of 14      | jq counts                                                                |
| Per-module archetype mix within ±5 %                  | 14 of 14      | jq aggregated                                                            |
| Per-module difficulty mix within ±10 %                | 14 of 14      | jq aggregated                                                            |
| 20 case-study files exist under system-design-at-scale | 20           | `ls content/java-backend-advanced/system-design-at-scale/*/complete-qa.json \| wc -l` ≥ 20 |
| Every case has mermaid                                 | 20 of 20      | `grep -l '"kind": "diagram"' content/java-backend-advanced/system-design-at-scale/*/complete-qa.json \| wc -l` → 20 |
| Speakable pass+warn domain-wide                       | ≥ 88 %        | `python3 scripts/audit_speakable.py --domain java-backend-advanced --report` |
| Behavioral G-archetype stories cite ≥ 2 stakeholders  | 95 % sampled  | manual on 20 random Qs                                                   |
| Every system-design case has multi-region OR multi-tenant variant | 20 of 20 | manual on each follow-up section                                          |
| `/interview/java-backend-advanced` returns 200        | 200           | curl                                                                      |
| 6 SEO/alt URLs 301                                    | 6 of 6        | curl loop                                                                 |
| JBA tile present on homepage                          | yes           | manual visual                                                             |

## Failure modes & rollback

- **System-design case has no numbers:** rewrite with capacity calc.
- **Behavioral story uses "we" everywhere:** rewrite to first person; staff
  signal lost.

To unlaunch:

```bash
git revert <commit-of-tile-add>
```

## Definition of Done

- [ ] All 14 modules hit per-module gates.
- [ ] Domain speakable pass+warn ≥ 88 %.
- [ ] 20 system-design cases live with mermaid + numbers.
- [ ] JBA tile live on homepage.
- [ ] Tag `jba-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `23` flipped to `DONE`.

## Estimated effort

- **Ideal:** 120 hours.
- **Hard stop:** 180 hours.
