# Audit — production-sre

**Pillar:** P11 Operational Excellence
**Module:** M32 production-sre
**Topics present:** 7 of 12 (`thread-and-heap-dumps`, `incident-response`, `incident-management`, `root-cause-analysis`, `postmortems`, `on-call` all empty)
**Questions:** 22 (all written, no stubs)
**Benchmark sources:** Google SRE Book + SRE Workbook, "Seeking SRE" (David Blank-Edelman), "The Art of SRE" + "The Site Reliability Workbook" chapters on incident response + postmortems, Charity Majors on observability + on-call, Brendan Gregg on performance methodology, "Java Performance" (Scott Oaks) for Java-specific content

---

## Module is one of the best-authored in the audit

- 22 written Qs, no stubs
- **5 CLEAN questions** (cpu-spikes, memory-footprint, profile-bottlenecks, jmh-benchmark, anti-patterns, circuit-breaker-production) — tied with design-patterns for best CLEAN rate
- Strong Zone 3 depth (593–836w)
- Universal bulleted-subheaders speakable format (240–346w — well-sized)
- Universal `interviewer_intent` + `key_points` completeness
- Strong code coverage — most Qs have 1–7 code blocks
- Only 4 MODERATE per-question issues

**But a major structural problem**: this module declares 12 topics; **6 are completely empty — and the empty ones are the actual SRE core**.

---

## Biggest finding — the actual SRE topics are all empty

The topics that are empty are exactly the ones SRE is known for:

| Empty topic | Why it's the SRE core |
|---|---|
| `thread-and-heap-dumps` | Thread dump / heap dump analysis is the single most-asked SRE debugging skill |
| `incident-response` | Google SRE Book dedicates 2 chapters to this; core on-call skill |
| `incident-management` | War rooms, severity levels, incident commanders — mandatory at FAANG/SRE interviews |
| `root-cause-analysis` | 5-whys, fishbone, timeline reconstruction — explicit interview topic |
| `postmortems` | Blameless postmortems are the defining SRE cultural practice |
| `on-call` | On-call rotation, paging, alert fatigue, runbook usage — every SRE interview asks this |

The module is effectively **"production performance troubleshooting"** right now (22 Qs, mostly performance + 1 runbook + 1 cache stampede + 1 circuit breaker). The true SRE interview arenas — incident response, postmortems, on-call — aren't authored despite being the topics the module is named for.

This is a **scope vs. content mismatch**, not a quality issue with existing Qs.

---

## Biggest finding — cross-module overlaps

| Q in M32 | Overlaps with | Severity |
|---|---|---|
| `circuit-breaker-pattern-production-java` (sre-practices Q2) | M16 microservices circuit-breaker (2 Qs) + M18 design-patterns legacy Q2 | **Triple-covered** |
| `what-is-cache-stampede-how-to-prevent-it` (scenario Q1) | M14 redis-caching cache-patterns Q1 | High |
| `blue-green-vs-canary-deployment-difference` (scenario Q2) | M26 cicd deployment-strategies (currently empty but planned) | High |
| `zero-downtime-deployments-spring-boot` (sre-practices Q3) | M26 cicd deployment-strategies | High |
| `key-health-checks-production-java-app` (sre-practices Q4) | M31 observability `health-checks-and-probes` + M28 kubernetes probes Q | **Triple-covered** |
| `alerting-strategy-slos-slas-error-budgets` — if it existed would overlap with M31 Q1 alerting | — | — |
| `how-to-profile-java-application-performance-bottlenecks` (perf Q1) | M05 jvm-internals profiling-and-debugging | Overlap |
| `connection-pooling-improve-database-performance-java` (perf Q5) | M12 sql-databases + M08 spring-data-jpa | Overlap |
| `reduce-java-application-memory-footprint` (memory-leaks Q1) | M05 jvm-internals memory-analysis | Overlap |
| `how-to-size-thread-pools-for-optimal-throughput` (perf Q2) | M04 java-concurrency thread-pools | Overlap |

**At least 10 cross-module overlaps**. Many Qs live here appropriately as "operational / production" angles on concepts that have pattern/fundamentals coverage elsewhere — but a clear scope rule ("M32 covers operational/production angle") should be written down.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Performance Qs walk through the debugging methodology (observe → hypothesize → measure → fix) | Matching — Q1 cpu-spikes is CLEAN with 5 code blocks |
| Thread/heap dump content shows `jstack`, `jmap`, `jcmd` commands + output | **Absent** — topic is empty |
| Incident response content shows timeline + severity matrix + comms template | **Absent** — topic is empty |
| Postmortem content shows a template structure (impact, timeline, root cause, remediation, action items) | **Absent** — topic is empty |
| Opening bolds the operational primitive (`**SLO**`, `**runbook**`, `**circuit breaker**`, `**feature flag**`) | Mostly failing — but DA bold anchor failures only flagged on 2 Qs (Q5 sre-practices, Q2 scenario). Most DAs are 23–31w short and may naturally have anchors |
| Analogies common (circuit breaker = "fuse", feature flag = "dimmer switch", canary = "taste test") | 5 of 22 have detected analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | ACTUAL SRE TOPICS EMPTY | **CRITICAL** | 6 of 12 topics empty, and the empty ones (thread-and-heap-dumps, incident-response, incident-management, root-cause-analysis, postmortems, on-call) are the SRE core. The module as authored is "performance troubleshooting" with SRE labeling |
| S2 | CROSS-MODULE OVERLAPS (10+) | **MAJOR** | Circuit-breaker (triple-covered), health-checks (triple-covered), cache-stampede, deployment strategies, profiling, connection pooling, thread-pool sizing all overlap with other modules. Needs operational-angle scope rule |
| S3 | 4 CODE-MISSING IN OPERATIONAL CONTENT | MODERATE | Q4 latency-vs-throughput (721w/0c), Q5 sre-vs-devops (762w/0c), Q1 runbook-process (831w/0c), Q2 blue-green-vs-canary (797w/0c). Operational content should have at least a runbook template, a comparison matrix, or a benchmark |
| S4 | MODULE-WIDE ZONE 1 | MODERATE | Most DAs are short (23–32w) — a positive — but 2 have 0 bold anchors. Pattern is healthier than other modules |
| S5 | ANALOGY GAP | MODERATE | 15 of 22 missing analogies |

---

## Per-question issues

### `debugging-production` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** cpu-spikes-java-applications-debugging | 593w / 5 code / analogy — **CLEAN** | CLEAN |

### `thread-and-heap-dumps` (0 Qs) — **empty, CRITICAL gap**

### `memory-leaks` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** reduce-java-application-memory-footprint | 704w / 1 code / analogy — **CLEAN**. Overlap with M05 jvm-internals | CLEAN + OVERLAP |

### `performance-troubleshooting` (9 Qs) — the rich topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** how-to-profile-java-application-performance-bottlenecks | 691w / 2 code / analogy — **CLEAN**. Overlaps with M05 | CLEAN + OVERLAP |
| **Q2** how-to-size-thread-pools-for-optimal-throughput | 772w / 2 code / no analogy. Overlap with M04 concurrency | MINOR + OVERLAP |
| **Q3** diagnose-and-fix-slow-database-query-spring-boot | 596w / 7 code / no analogy — strong code coverage | MINOR |
| **Q4** latency-vs-throughput-optimization-java | 721w / **0 code** / no analogy. Operational comparison Q needs a benchmark table or JMH example | **MODERATE** |
| **Q5** connection-pooling-improve-database-performance-java | 752w / 1 code / no analogy. Overlap with M12/M08 | MINOR + OVERLAP |
| **Q6** how-to-benchmark-java-code-with-jmh | 670w / 2 code / analogy — **CLEAN** | CLEAN |
| **Q7** common-spring-boot-performance-anti-patterns | 686w / 1 code / analogy — **CLEAN** | CLEAN |
| **Q8** optimize-json-serialization-deserialization-java | 665w / 3 code / no analogy | MINOR |
| **Q9** async-processing-improve-api-response-time-java | 673w / 2 code / no analogy | MINOR |

### `incident-response` / `incident-management` / `root-cause-analysis` / `postmortems` / `on-call` (0 Qs each) — **5 empty topics**

### `chaos-engineering` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** chaos-engineering-what-is-it-how-to-apply | 669w / 1 code / no analogy | MINOR |

### `sre-practices` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** how-to-implement-feature-flag-system | 757w / 1 code / analogy | MINOR |
| **Q2** circuit-breaker-pattern-production-java | 677w / 2 code / analogy — **CLEAN**. **Triple-covered** (M16 + M18 + M32) | CLEAN + OVERLAP |
| **Q3** zero-downtime-deployments-spring-boot | 772w / 2 code / no analogy. Overlap with M26 cicd | MINOR + OVERLAP |
| **Q4** key-health-checks-production-java-app | 765w / 3 code / no analogy. **Triple-covered** with M31 + M28 | MINOR + OVERLAP |
| **Q5** sre-vs-devops-difference | 762w / **0 code** / analogy. Comparison Q without a role/responsibility matrix | **MODERATE** |

### `capacity-planning` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** capacity-planning-backend-service | 836w / 1 code / no analogy. Overlap with M20 system-design capacity-planning topic | MINOR + OVERLAP |

### `runbooks` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** production-incident-runbook-and-process | 831w / **0 code** / analogy. **A runbook Q without an example runbook structure/template is archetype-fail** | **MODERATE** |

### `scenario-based` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** what-is-cache-stampede-how-to-prevent-it | 763w / 3 code / no analogy. Overlap with M14 redis-caching cache-patterns | MINOR + OVERLAP |
| **Q2** blue-green-vs-canary-deployment-difference | 797w / **0 code** / no analogy. Comparison Q without a deployment YAML or sequence diagram. Overlap with M26 cicd | **MODERATE** |
| **Q3** database-schema-migrations-production-flyway-liquibase | 770w / 3 code / no analogy | MINOR |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 SRE-core topics empty |
| **MAJOR** | **1** | S2 cross-module overlaps |
| **MODERATE** | **7** | S3 4 code-missing, S4 bold, S5 analogy, Q4 latency, Q5 sre-vs-devops, Q1 runbook, Q2 blue-green-vs-canary |
| **MINOR** | **~14** | Well-shaped Qs needing polish + many are cross-module overlaps |
| **CLEAN** | **5** | Q1 cpu-spikes, Q1 memory-leaks, Q1 profile-bottlenecks, Q6 jmh, Q7 anti-patterns, Q2 circuit-breaker-production (6 total; 5 highlighted as best-shaped) |

## Most common issue codes

- `zone3_no_analogy` × 15
- `zone3_no_code_examples` × 4
- `zone1_direct_answer_no_bold_anchors` × 2

---

## Suggested fix order

1. **Rename or split the module** (S1). The current content is "performance troubleshooting + some SRE practices". Options:
   - (a) Rename to `production-performance-tuning` and drop the 6 empty SRE topics
   - (b) Keep the name and author the 6 empty SRE topics (~15–20 new Qs)
   - (c) Split into `M32a production-performance` + `M32b sre-and-incident-response`
2. **Cross-module scope rule** (S2). Document: circuit-breaker lives in M16; pattern theory in M18; **M32 owns the "operational angle / production tuning" of these concepts only** and should cross-link rather than duplicate. Same for health-checks (M31 Actuator-specific, M28 k8s-specific, M32 production-tuning-specific).
3. **Author `thread-and-heap-dumps` topic** — highest-priority SRE gap (3–4 Qs: how to take a thread dump, how to read a deadlock in jstack output, heap dump analysis with MAT, memory-leak detection walkthrough).
4. **Author `postmortems` topic** — cultural SRE staple (2–3 Qs: blameless postmortem template, 5-whys vs fishbone, turning postmortems into action items).
5. **Author `incident-response` + `incident-management`** — 4–5 Qs combined (severity levels, incident commander role, comms templates, war-room flow, recovering-from-major-incident walkthrough).
6. **Author `on-call` topic** — 2 Qs (on-call rotation design, alert fatigue reduction).
7. **Fix 4 code-missing Qs** — Q4 latency-vs-throughput (JMH benchmark), Q5 sre-vs-devops (role matrix), Q1 runbook (actual runbook template), Q2 blue-green-vs-canary (deployment YAML / sequence diagram).
8. **Add analogies to 15 Qs** — runbook ("pilot's checklist"), feature flag ("dimmer switch"), canary ("taste test before serving"), cache stampede ("taco-truck rush"), SLO ("car maintenance schedule"), chaos engineering ("fire drill").

---

## Overall

This is **two modules stuck in one slot**. The "performance troubleshooting" half is one of the best-authored areas in the audit (5 CLEAN, strong code, strong depth). The "SRE practices" half is mostly unauthored. A scope decision resolves the biggest issue; the remaining fixes are polish-level.
