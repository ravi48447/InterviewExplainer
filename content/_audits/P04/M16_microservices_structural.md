# Audit — M16_microservices

**Pillar:** P04  
**Module:** M16 microservices  
**Topics:** 17  
**Questions:** 18 (18 written, 0 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | OVERLAP | MAJOR | **circuit-breaker**: `circuit-breaker-resilience4j` ↔ `resilience4j-circuit-breaker-spring-cloud` — shared tokens: breaker, circuit, resilience4j (Jaccard 0.6) |

## Topic: fundamentals

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** microservices-vs-monolith-when-to-split | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |

## Topic: service-design

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** database-per-microservice-patterns | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: api-gateway

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** api-gateway-spring-cloud-gateway | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** spring-cloud-gateway-routing-filters | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: service-discovery

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** eureka-service-discovery-vs-consul | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |

## Topic: circuit-breaker

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** circuit-breaker-resilience4j | ✓ | ✓ | ✓ | CLEAN |
| **Q2** resilience4j-circuit-breaker-spring-cloud | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: load-balancing

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-cloud-loadbalancer-client-side | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: feign-client

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** feign-client-vs-resttemplate-vs-webclient | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: config-management

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-cloud-config-server-centralized-configuration | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** spring-cloud-config-profiles-environment-specific-configuration | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |

## Topic: distributed-tracing

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** distributed-tracing-correlation-id | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** distributed-tracing-micrometer-zipkin | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: resilience-patterns

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: communication-patterns

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** rest-vs-grpc-vs-messaging-interservice | ✓ | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q2** spring-cloud-stream-messaging-abstraction | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: service-mesh

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** sidecar-pattern-service-mesh | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: contract-testing

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: saga-pattern

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** saga-pattern-distributed-transactions | ✓ | ✓ | ✓ | CLEAN |

## Topic: migration-strategies

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** strangler-fig-pattern-monolith-migration | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

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
- **MODERATE:** 4
- **MINOR:** 12
- **CLEAN:** 2
- **STUBS:** 0

### Most common issue codes

- `zone3_no_analogy` × 13
- `zone1_direct_answer_no_bold_anchors` × 12
- `zone3_no_code_examples` × 4

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
