# Audit — M23_unit-testing

**Pillar:** P08  
**Module:** M23 unit-testing  
**Topics:** 8  
**Questions:** 22 (22 written, 0 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | OVERLAP | MAJOR | **mocking-with-mockito**: `mockito-mock-spy-mockbean` ↔ `mockito-mock-spy-verify-argumentcaptor` — shared tokens: mock, mockito, spy (Jaccard 0.5) |

## Topic: unit-testing-basics

_8 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** unit-vs-integration-vs-e2e-testing | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** parameterized-test-method-source | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** tdd-red-green-refactor | direct_answer is 80 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** test-driven-development-tdd-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q5** junit5-assertions-assertj | ✓ | speakable is only 101 words | ✓ | MINOR |
| **Q6** parameterized-tests-junit5 | ✓ | ✓ | ✓ | CLEAN |
| **Q7** testing-exceptions-junit5 | ✓ | speakable is only 102 words | ✓ | MINOR |
| **Q8** unit-testing-best-practices-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: unit-testing-advanced

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** testing-async-completablefuture | no **bold** anchors in direct_answer | speakable is only 117 words | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** code-coverage-jacoco-spring-boot | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: mocking-with-mockito

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** mockito-mock-spy-mockbean | direct_answer is 74 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** mockito-mock-spy-verify-argumentcaptor | ✓ | speakable is only 113 words | ✓ | MINOR |

## Topic: integration-testing

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** testing-kafka-embedded-kafka | direct_answer is 61 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q2** integration-testing-spring-boot | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: spring-boot-testing

_5 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** springboottest-and-slice-variants | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** mockmvc-controller-testing | no **bold** anchors in direct_answer | speakable is only 112 words | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** spring-test-slices-comparison | direct_answer is 65 words with no bold anchors | speakable is only 116 words | substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** testing-spring-security | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q5** mockmvc-testing-controllers | ✓ | speakable is only 112 words | substantive Zone 3 with no analogies detected | MINOR |

## Topic: testcontainers

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** datajpatest-with-testcontainers | direct_answer is 61 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q2** testcontainers-real-database-integration | direct_answer is 67 words with no bold anchors | speakable is only 115 words | substantive Zone 3 with no analogies detected | MODERATE |
| **Q3** testcontainers-spring-boot | ✓ | speakable is only 115 words | substantive Zone 3 with no analogies detected | MINOR |

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
- **MODERATE:** 7
- **MINOR:** 14
- **CLEAN:** 1
- **STUBS:** 0

### Most common issue codes

- `zone3_no_analogy` × 15
- `zone2_speakable_short` × 9
- `zone1_direct_answer_no_bold_anchors` × 6
- `zone1_direct_answer_paragraph_wall` × 6
- `zone3_no_code_examples` × 1

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
