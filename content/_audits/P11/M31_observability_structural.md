# Audit — M31_observability

**Pillar:** P11  
**Module:** M31 observability  
**Topics:** 10  
**Questions:** 14 (14 written, 0 stubs)

## Module-level structural issues

_None detected by structural signals. Judgment layer may add module-level concerns._

## Topic: structured-logging

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** slf4j-logback-structured-logging-spring-boot | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** log-levels-when-to-use-each | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** structured-logging-logback-correlation-ids | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: distributed-log-aggregation

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** log-aggregation-elk-stack-elasticsearch-logstash-kibana | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** kubernetes-log-aggregation | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: metrics-and-micrometer

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** three-pillars-observability-metrics-logs-traces | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q2** micrometer-counters-timers-gauges-spring-boot | ✓ | ✓ | substantive Zone 3 with zero code examples | MODERATE |

## Topic: prometheus-and-grafana

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-actuator-prometheus-metrics-setup | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** grafana-dashboards-spring-boot-service-health | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: distributed-tracing

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** distributed-tracing-spring-cloud-sleuth-zipkin-jaeger | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** production-debugging-distributed-traces-latency-bottlenecks | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** opentelemetry-vs-micrometer-vs-sleuth-comparison | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |

## Topic: health-checks-and-probes

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** health-checks-vs-readiness-checks-actuator-health | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: alerting

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** alerting-strategy-slos-slas-error-budgets-java-services | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: apm-tools

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: scenario-based

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: comparisons

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Tally

- **CRITICAL:** 0
- **MAJOR:** 0
- **MODERATE:** 5
- **MINOR:** 9
- **CLEAN:** 0
- **STUBS:** 0

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 11
- `zone3_no_analogy` × 10
- `zone3_no_code_examples` × 5

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
