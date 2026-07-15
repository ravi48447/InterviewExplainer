# Audit — observability

**Pillar:** P11 Operational Excellence
**Module:** M31 observability
**Topics present:** 7 of 10 (`apm-tools`, `scenario-based`, `comparisons` empty)
**Questions:** 14 (all written, no stubs)
**Benchmark sources:** "Distributed Systems Observability" (Cindy Sridharan), Google SRE Book (chapters on monitoring + SLOs), OpenTelemetry documentation, Micrometer reference (micrometer.io/docs), Prometheus documentation (prometheus.io/docs), Spring Boot Actuator reference, Baeldung observability series

---

## Biggest finding — 5 code-missing Qs in a code-demonstrable domain

Observability is a library-and-annotation-heavy domain: Micrometer `Counter.builder(...)`, `@Timed`, Logstash filter config, OpenTelemetry SDK setup, Logback `%X{traceId}` pattern, Spring Actuator endpoint YAML. **5 of 14 Qs have zero code blocks in Zone 3**:

| Q | Topic | Why code is essential |
|---|---|---|
| **Q2** `log-levels-when-to-use-each` | structured-logging | Should show logger calls at each level + decision matrix |
| **Q1** `log-aggregation-elk-stack-elasticsearch-logstash-kibana` (698w) | distributed-log-aggregation | Must show a Logstash pipeline config and a sample log parse |
| **Q1** `three-pillars-observability-metrics-logs-traces` (690w) | metrics-and-micrometer | Should show at least one Micrometer + one Logback + one trace example |
| **Q2** `micrometer-counters-timers-gauges-spring-boot` (673w) | metrics-and-micrometer | **Archetype fail** — a Micrometer Q must show `Counter.builder(...)`, `@Timed`, `MeterRegistry.gauge(...)` code |
| **Q3** `opentelemetry-vs-micrometer-vs-sleuth-comparison` (675w) | distributed-tracing | 3-way comparison without SDK setup code for each is weak |

Q2 `micrometer-counters-timers-gauges-spring-boot` is the most glaring — an explicit "show me Micrometer code" question with zero code is indefensible.

---

## Biggest finding — empty `apm-tools` topic

The `apm-tools` topic is empty. APM (Application Performance Monitoring) is the commercial side of observability and is standard interview content:

- `dynatrace-vs-datadog-vs-new-relic-vs-appdynamics`
- `choosing-apm-for-a-java-microservices-stack`
- `apm-agent-setup-java-application`
- `when-to-use-apm-vs-open-source-stack`

Also absent (more minor): chaos engineering, synthetic monitoring, RUM (real-user monitoring), log retention + cost strategies.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Metrics Qs show Micrometer code (`Counter.builder(...)`, `@Timed`) | **Failing on Q2 metrics** — exactly the Q that should show it |
| Logging Qs show the Logback pattern + MDC usage (`%X{traceId}`) | Matching on Q1 slf4j-logback |
| ELK/aggregation Qs include a Logstash filter example | **Failing** — Q1 ELK is 698w of prose with no config |
| Tracing Qs include a trace-id propagation example + Zipkin/Jaeger UI screenshot reference | Q1 tracing has 2 code, Q2 debugging has 2 code — matching |
| Three-pillars explainer includes a code example from each pillar | **Failing** — Q1 pillars has 0 code |
| Opening bolds the observability term (`**metrics**`, `**logs**`, `**traces**`, `**Micrometer**`, `**Prometheus**`) | **Failing** — 11 of 14 direct answers have zero bold anchors |
| Analogies common (three pillars = "medical triage: temperature, X-ray, vital signs"; traces = "GPS breadcrumb trail") | 2 of 14 have detected analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | CODE-MISSING IN LIBRARY DOMAIN | **MAJOR** | 5 of 14 Qs have 0 code. Observability libraries (Micrometer, OpenTelemetry, Logback) are the native expression for this domain |
| S2 | EMPTY APM TOPIC | **MAJOR** | `apm-tools` declared, 0 Qs. APM vendor landscape is standard interview material |
| S3 | EMPTY SCENARIO-BASED + COMPARISONS | **MAJOR** | Both declared topics empty. `opentelemetry-vs-micrometer-vs-sleuth-comparison` is misfiled in `distributed-tracing` — belongs in `comparisons` |
| S4 | Q2 MICROMETER NO-CODE | **MAJOR** | Standalone because Q2 `micrometer-counters-timers-gauges-spring-boot` is the single worst-shaped Q in the module — explicit code-request without code |
| S5 | MODULE-WIDE ZONE 1 | MODERATE | 11 of 14 direct answers have 0 bold anchors |
| S6 | ANALOGY GAP | MODERATE | 12 of 14 missing analogies in a highly analogy-friendly domain |
| S7 | CROSS-MODULE OVERLAP | MINOR | `distributed-tracing` topic (Q1, Q2, Q3) overlaps with M16 microservices distributed-tracing topic (2 Qs). Needs scope split |

---

## Per-question issues

### `structured-logging` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** slf4j-logback-structured-logging-spring-boot | 635w / 3 code / no analogy | MINOR |
| **Q2** log-levels-when-to-use-each | 380w / **0 code** / no analogy. Levels Q should show `log.trace/debug/info/warn/error` + when to use each | **MODERATE** (shorter Q but foundational) |
| **Q3** structured-logging-logback-correlation-ids | 611w / 2 code / no analogy | MINOR |

### `distributed-log-aggregation` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** log-aggregation-elk-stack-elasticsearch-logstash-kibana | 698w / **0 code** / no analogy. ELK Q must include a Logstash filter block, a Kibana index-pattern config, or a Filebeat input | **MAJOR** |
| **Q2** kubernetes-log-aggregation | 615w / 2 code / no analogy. Fluentd/Fluent Bit DaemonSet Q — should show the DaemonSet YAML | MINOR |

### `metrics-and-micrometer` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** three-pillars-observability-metrics-logs-traces | 690w / **0 code** / analogy. Should show one example per pillar | **MAJOR** |
| **Q2** micrometer-counters-timers-gauges-spring-boot | 673w / **0 code** / analogy. **Worst-shaped Q in module** — 673w explaining Micrometer types without a single `Counter.builder(...)` or `@Timed` snippet | **MAJOR** |

### `prometheus-and-grafana` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-boot-actuator-prometheus-metrics-setup | 541w / 3 code / no analogy. Shortest DA in module (18w) — could be slightly more informative | MINOR |
| **Q2** grafana-dashboards-spring-boot-service-health | 620w / 4 code / no analogy | MINOR |

### `distributed-tracing` (3 Qs) — **cross-module overlap with M16**

| Q | Issue | Severity |
|---|---|---|
| **Q1** distributed-tracing-spring-cloud-sleuth-zipkin-jaeger | 570w / 2 code / no analogy. **Overlaps with M16 Q2 distributed-tracing-micrometer-zipkin** | MINOR + OVERLAP |
| **Q2** production-debugging-distributed-traces-latency-bottlenecks | 751w / 2 code / no analogy. Strong debugging walkthrough | MINOR |
| **Q3** opentelemetry-vs-micrometer-vs-sleuth-comparison | 675w / **0 code** / analogy. **Archetype-fail** (comparison Q with no side-by-side code) **+ miscategorized** (belongs in `comparisons` topic) | **MAJOR** |

### `health-checks-and-probes` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** health-checks-vs-readiness-checks-actuator-health | 547w / 1 code / no analogy. **Overlaps with M28 kubernetes Q2 liveness-readiness-startup-probes-spring-boot** — M28 already covers this. Decide M31 = Spring Actuator angle, M28 = Kubernetes probe mapping | MINOR + OVERLAP |

### `alerting` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** alerting-strategy-slos-slas-error-budgets-java-services | 635w / 1 code / no analogy. SLO/SLI/error-budget content — strong SRE angle. Cross-module overlap with M32 production-sre | MINOR + OVERLAP |

### `apm-tools` (0 Qs) — **empty, MAJOR gap**

### `scenario-based` (0 Qs) — empty

### `comparisons` (0 Qs) — empty

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **6** | S1 code-missing pattern, S2 empty apm-tools, S3 empty scenario/comparisons, Q1 ELK, Q1+Q2 metrics, Q3 otel-comparison |
| **MODERATE** | **3** | Q2 log-levels, S5 bold, S6 analogy gap |
| **MINOR** | **9** | Well-shaped Qs needing polish + cross-module scope splits |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 11
- `zone3_no_analogy` × 12
- `zone3_no_code_examples` × 5

---

## Suggested fix order

1. **Code-inject Q2 `micrometer-counters-timers-gauges-spring-boot`** (highest priority — the Q whose entire premise demands code).
2. **Code-inject Q1 `three-pillars-observability`** — one code snippet per pillar.
3. **Code-inject Q1 `log-aggregation-elk-stack`** — Logstash filter config.
4. **Move Q3 `opentelemetry-vs-micrometer-vs-sleuth-comparison` to `comparisons` topic + add side-by-side SDK code**.
5. **Author `apm-tools` topic** — minimum 2–3 Qs on APM vendors + agent setup.
6. **Author `scenario-based` topic** — "a service is slow, how do you use metrics+logs+traces to find it", "alert fatigue — how do you fix it".
7. **Code-inject Q2 log-levels** — logger calls at each level.
8. **Resolve cross-module overlaps** (S7) with M16 (distributed-tracing) and M28 (probes) and M32 (SLO/SLA alerting). Document the scope split as a cross-module rule.
9. **Module-wide bold-anchor pass** — 11 mechanical edits.
10. **Add analogies to 12 Qs** — highest-yield ones: three-pillars (medical triage), traces (GPS breadcrumbs), metrics (dashboard gauges on a car), logs (diary entries), SLO (car maintenance schedule).
