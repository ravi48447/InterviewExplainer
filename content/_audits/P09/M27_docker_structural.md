# Audit — M27_docker

**Pillar:** P09  
**Module:** M27 docker  
**Topics:** 7  
**Questions:** 12 (12 written, 0 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | OVERLAP | MAJOR | **docker-fundamentals**: `jvm-memory-docker-container-limits` ↔ `docker-container-resource-limits-jvm` — shared tokens: container, docker, jvm, limits (Jaccard 0.67) |

## Topic: docker-fundamentals

_5 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** jvm-memory-docker-container-limits | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q2** docker-volumes-named-vs-bind-mounts | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** docker-health-checks-spring-boot | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** debugging-spring-boot-in-docker | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q5** docker-container-resource-limits-jvm | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: docker-compose

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** docker-compose-spring-boot-postgres-redis | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: docker-networking

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** docker-networking-bridge-host-overlay | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: docker-security

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** docker-non-root-user-java-security | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** docker-image-scanning-security-best-practices | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** docker-environment-variables-vs-secrets | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: multi-stage-builds

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** multistage-dockerfile-spring-boot | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** docker-layer-caching-optimization | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

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
- **MODERATE:** 0
- **MINOR:** 12
- **CLEAN:** 0
- **STUBS:** 0

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 12
- `zone3_no_analogy` × 7

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
