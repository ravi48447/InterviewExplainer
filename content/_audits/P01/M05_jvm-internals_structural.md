> **Superseded — do not use for launch decisions.** This file predates `scripts/out/audit_v3/P01/`.
> Trust `scripts/out/audit_v3/P01/` only. Regenerated banner: 2026-05-19.

# Audit — M05_jvm-internals

**Pillar:** P01  
**Module:** M05 jvm-internals  
**Topics:** 7  
**Questions:** 33 (15 written, 18 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | STUB | CRITICAL | **jvm-architecture/Q1 jvm-jre-jdk-difference** — stub, no content |
| S2 | STUB | CRITICAL | **jvm-architecture/Q3 heap-vs-stack-memory-java** — stub, no content |
| S3 | STUB | CRITICAL | **jvm-architecture/Q4 metaspace-vs-permgen-java-8** — stub, no content |
| S4 | STUB | CRITICAL | **garbage-collection/Q1 what-is-garbage-collection-java** — stub, no content |
| S5 | STUB | CRITICAL | **garbage-collection/Q2 generational-gc-young-old-java** — stub, no content |
| S6 | STUB | CRITICAL | **garbage-collection/Q4 g1-vs-cms-gc-java** — stub, no content |
| S7 | STUB | CRITICAL | **garbage-collection/Q5 zgc-shenandoah-low-latency-gc-java** — stub, no content |
| S8 | STUB | CRITICAL | **garbage-collection/Q7 full-gc-vs-minor-gc-java** — stub, no content |
| S9 | STUB | CRITICAL | **jvm-tuning/Q1 jvm-flags-xms-xmx-java** — stub, no content |
| S10 | STUB | CRITICAL | **jvm-tuning/Q4 tuning-jvm-microservices-containers-java** — stub, no content |
| S11 | STUB | CRITICAL | **memory-analysis/Q3 heap-dump-analysis-mat-eclipse-java** — stub, no content |
| S12 | STUB | CRITICAL | **memory-analysis/Q4 how-to-find-memory-leak-java-production** — stub, no content |
| S13 | STUB | CRITICAL | **profiling-and-debugging/Q1 how-to-profile-java-application** — stub, no content |
| S14 | STUB | CRITICAL | **profiling-and-debugging/Q4 jfr-java-flight-recorder** — stub, no content |
| S15 | STUB | CRITICAL | **scenario-based/Q1 how-to-investigate-oom-in-production-java** — stub, no content |
| S16 | STUB | CRITICAL | **scenario-based/Q2 how-to-reduce-gc-pause-time-java** — stub, no content |
| S17 | STUB | CRITICAL | **comparisons/Q1 minor-gc-vs-full-gc-comparison** — stub, no content |
| S18 | STUB | CRITICAL | **comparisons/Q2 aot-vs-jit-compilation-comparison** — stub, no content |

## Topic: jvm-architecture

_6 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** jvm-jre-jdk-difference | — | — | — | STUB |
| **Q2** jvm-memory-areas | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** heap-vs-stack-memory-java | — | — | — | STUB |
| **Q4** metaspace-vs-permgen-java-8 | — | — | — | STUB |
| **Q5** classloader-hierarchy | direct_answer is 69 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q6** jit-compilation-tiered-compilation | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |

## Topic: garbage-collection

_7 questions (5 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-garbage-collection-java | — | — | — | STUB |
| **Q2** generational-gc-young-old-java | — | — | — | STUB |
| **Q3** gc-algorithms-comparison | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** g1-vs-cms-gc-java | — | — | — | STUB |
| **Q5** zgc-shenandoah-low-latency-gc-java | — | — | — | STUB |
| **Q6** gc-tuning-gclog-analysis | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q7** full-gc-vs-minor-gc-java | — | — | — | STUB |

## Topic: jvm-tuning

_4 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** jvm-flags-xms-xmx-java | — | — | — | STUB |
| **Q2** jvm-startup-optimization-virtual-threads | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** spring-boot-jvm-container-settings | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** tuning-jvm-microservices-containers-java | — | — | — | STUB |

## Topic: memory-analysis

_4 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** memory-leak-detection-heap-dump | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** java-stackoverflow-vs-outofmemoryerror | direct_answer is 64 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q3** heap-dump-analysis-mat-eclipse-java | — | — | — | STUB |
| **Q4** how-to-find-memory-leak-java-production | — | — | — | STUB |

## Topic: profiling-and-debugging

_4 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** how-to-profile-java-application | — | — | — | STUB |
| **Q2** java-profiling-async-profiler | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** thread-dumps-deadlock-analysis | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** jfr-java-flight-recorder | — | — | — | STUB |

## Topic: scenario-based

_6 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** how-to-investigate-oom-in-production-java | — | — | — | STUB |
| **Q2** how-to-reduce-gc-pause-time-java | — | — | — | STUB |
| **Q3** java-reflection-performance | direct_answer is 65 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q4** java-nio-vs-traditional-io | direct_answer is 71 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q5** java-module-system-jpms | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q6** annotation-processing-runtime | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: comparisons

_2 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** minor-gc-vs-full-gc-comparison | — | — | — | STUB |
| **Q2** aot-vs-jit-compilation-comparison | — | — | — | STUB |

## Tally

- **CRITICAL:** 0
- **MAJOR:** 0
- **MODERATE:** 8
- **MINOR:** 7
- **CLEAN:** 0
- **STUBS:** 18

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 11
- `zone3_no_analogy` × 8
- `zone3_no_code_examples` × 7
- `zone1_direct_answer_paragraph_wall` × 4

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
