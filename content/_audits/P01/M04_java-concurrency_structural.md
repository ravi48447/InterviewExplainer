> **Superseded — do not use for launch decisions.** This file predates `scripts/out/audit_v3/P01/`.
> Trust `scripts/out/audit_v3/P01/` only. Regenerated banner: 2026-05-19.

# Audit — M04_java-concurrency

**Pillar:** P01  
**Module:** M04 java-concurrency  
**Topics:** 10  
**Questions:** 52 (24 written, 28 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | STUB | CRITICAL | **threads-and-lifecycle/Q1 what-is-thread-in-java** — stub, no content |
| S2 | STUB | CRITICAL | **threads-and-lifecycle/Q4 thread-start-vs-run-java** — stub, no content |
| S3 | STUB | CRITICAL | **threads-and-lifecycle/Q6 thread-sleep-vs-wait-java** — stub, no content |
| S4 | STUB | CRITICAL | **threads-and-lifecycle/Q7 thread-interrupt-mechanism-java** — stub, no content |
| S5 | STUB | CRITICAL | **synchronization-and-locks/Q1 what-is-synchronization-java** — stub, no content |
| S6 | STUB | CRITICAL | **synchronization-and-locks/Q3 synchronized-method-vs-block-java** — stub, no content |
| S7 | STUB | CRITICAL | **thread-pools-and-executor/Q1 why-use-thread-pool-java** — stub, no content |
| S8 | STUB | CRITICAL | **thread-pools-and-executor/Q3 fixed-vs-cached-vs-single-threadpool-java** — stub, no content |
| S9 | STUB | CRITICAL | **thread-pools-and-executor/Q5 rejectedexecutionhandler-java** — stub, no content |
| S10 | STUB | CRITICAL | **completable-future/Q1 what-is-completablefuture-java** — stub, no content |
| S11 | STUB | CRITICAL | **completable-future/Q4 thencompose-vs-thencombine-java** — stub, no content |
| S12 | STUB | CRITICAL | **completable-future/Q5 completablefuture-exception-handling-java** — stub, no content |
| S13 | STUB | CRITICAL | **concurrent-collections/Q1 why-concurrent-collections-java** — stub, no content |
| S14 | STUB | CRITICAL | **concurrent-collections/Q4 linkedblockingqueue-vs-arrayblockingqueue-java** — stub, no content |
| S15 | STUB | CRITICAL | **java-memory-model/Q1 what-is-java-memory-model-jmm** — stub, no content |
| S16 | STUB | CRITICAL | **java-memory-model/Q4 volatile-vs-atomic-java** — stub, no content |
| S17 | STUB | CRITICAL | **java-memory-model/Q5 data-race-vs-race-condition-java** — stub, no content |
| S18 | STUB | CRITICAL | **virtual-threads/Q1 what-are-virtual-threads-java-21** — stub, no content |
| S19 | STUB | CRITICAL | **virtual-threads/Q3 when-to-use-virtual-threads-java** — stub, no content |
| S20 | STUB | CRITICAL | **virtual-threads/Q4 virtual-threads-pinning-problem-java** — stub, no content |
| S21 | STUB | CRITICAL | **concurrency-patterns/Q1 producer-consumer-pattern-java** — stub, no content |
| S22 | STUB | CRITICAL | **concurrency-patterns/Q4 double-checked-locking-java** — stub, no content |
| S23 | STUB | CRITICAL | **concurrency-patterns/Q5 thread-safe-singleton-patterns-java** — stub, no content |
| S24 | STUB | CRITICAL | **scenario-based/Q4 how-to-detect-deadlock-java-thread-dump** — stub, no content |
| S25 | STUB | CRITICAL | **scenario-based/Q5 how-to-avoid-deadlock-java** — stub, no content |
| S26 | STUB | CRITICAL | **comparisons/Q1 future-vs-completablefuture-comparison** — stub, no content |
| S27 | STUB | CRITICAL | **comparisons/Q2 volatile-vs-synchronized-comparison** — stub, no content |
| S28 | STUB | CRITICAL | **comparisons/Q3 virtual-vs-platform-threads-comparison** — stub, no content |

## Topic: threads-and-lifecycle

_7 questions (4 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-thread-in-java | — | — | — | STUB |
| **Q2** thread-vs-runnable-vs-callable | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** java-thread-lifecycle-states | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** thread-start-vs-run-java | — | — | — | STUB |
| **Q5** daemon-threads-java-explained | no **bold** anchors in direct_answer | speakable is only 111 words | ✓ | MINOR |
| **Q6** thread-sleep-vs-wait-java | — | — | — | STUB |
| **Q7** thread-interrupt-mechanism-java | — | — | — | STUB |

## Topic: synchronization-and-locks

_8 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-synchronization-java | — | — | — | STUB |
| **Q2** synchronized-keyword-monitors | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** synchronized-method-vs-block-java | — | — | — | STUB |
| **Q4** synchronized-vs-reentrantlock | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q5** reentrant-read-write-lock | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q6** stampedlock-optimistic-reads | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q7** wait-notify-vs-condition-await-signal | no **bold** anchors in direct_answer | speakable is only 115 words | ✓ | MINOR |
| **Q8** atomicinteger-vs-synchronized | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: thread-pools-and-executor

_6 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** why-use-thread-pool-java | — | — | — | STUB |
| **Q2** executorservice-thread-pool-types | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** fixed-vs-cached-vs-single-threadpool-java | — | — | — | STUB |
| **Q4** threadpool-sizing-cpu-io-bound | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q5** rejectedexecutionhandler-java | — | — | — | STUB |
| **Q6** forkjoinpool-recursive-task | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: completable-future

_5 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-completablefuture-java | — | — | — | STUB |
| **Q2** java-future-vs-completablefuture-comparison | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** completablefuture-chains | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** thencompose-vs-thencombine-java | — | — | — | STUB |
| **Q5** completablefuture-exception-handling-java | — | — | — | STUB |

## Topic: concurrent-collections

_4 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** why-concurrent-collections-java | — | — | — | STUB |
| **Q2** concurrenthashmap-internals | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** blockingqueue-producer-consumer | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** linkedblockingqueue-vs-arrayblockingqueue-java | — | — | — | STUB |

## Topic: java-memory-model

_5 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-java-memory-model-jmm | — | — | — | STUB |
| **Q2** java-memory-model-happens-before | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** volatile-visibility-guarantee | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** volatile-vs-atomic-java | — | — | — | STUB |
| **Q5** data-race-vs-race-condition-java | — | — | — | STUB |

## Topic: virtual-threads

_4 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-are-virtual-threads-java-21 | — | — | — | STUB |
| **Q2** java21-virtual-threads-structured-concurrency | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** when-to-use-virtual-threads-java | — | — | — | STUB |
| **Q4** virtual-threads-pinning-problem-java | — | — | — | STUB |

## Topic: concurrency-patterns

_5 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** producer-consumer-pattern-java | — | — | — | STUB |
| **Q2** countdownlatch-vs-cyclicbarrier-vs-semaphore | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** threadlocal-use-cases-pitfalls | direct_answer is 72 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q4** double-checked-locking-java | — | — | — | STUB |
| **Q5** thread-safe-singleton-patterns-java | — | — | — | STUB |

## Topic: scenario-based

_5 questions (2 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** parallel-streams-when-they-help-vs-hurt | direct_answer is 72 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q2** race-condition-identify-and-fix | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** liveness-hazards-deadlock-livelock-starvation | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** how-to-detect-deadlock-java-thread-dump | — | — | — | STUB |
| **Q5** how-to-avoid-deadlock-java | — | — | — | STUB |

## Topic: comparisons

_3 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** future-vs-completablefuture-comparison | — | — | — | STUB |
| **Q2** volatile-vs-synchronized-comparison | — | — | — | STUB |
| **Q3** virtual-vs-platform-threads-comparison | — | — | — | STUB |

## Tally

- **CRITICAL:** 0
- **MAJOR:** 0
- **MODERATE:** 4
- **MINOR:** 20
- **CLEAN:** 0
- **STUBS:** 28

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 22
- `zone2_speakable_short` × 2
- `zone3_no_code_examples` × 2
- `zone1_direct_answer_paragraph_wall` × 2
- `zone3_no_analogy` × 1

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
