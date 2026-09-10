> **Superseded — do not use for launch decisions.** This file predates `scripts/out/audit_v3/P01/`.
> Trust `scripts/out/audit_v3/P01/` only. Regenerated banner: 2026-05-19.

# Audit — M01_core-java

**Pillar:** P01  
**Module:** M01 core-java  
**Topics:** 8  
**Questions:** 78 (54 written, 24 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | STUB | CRITICAL | **oop-principles/Q11 diamond-problem-java-interfaces** — stub, no content |
| S2 | STUB | CRITICAL | **oop-principles/Q15 equals-and-hashcode-contract-java** — stub, no content |
| S3 | STUB | CRITICAL | **oop-principles/Q21 anonymous-inner-class-vs-lambda-java** — stub, no content |
| S4 | STUB | CRITICAL | **generics-wildcards/Q1 generics-in-java-introduction-and-benefits** — stub, no content |
| S5 | STUB | CRITICAL | **generics-wildcards/Q3 bounded-vs-unbounded-wildcards-java** — stub, no content |
| S6 | STUB | CRITICAL | **generics-wildcards/Q4 pecs-principle-producer-extends-consumer-super** — stub, no content |
| S7 | STUB | CRITICAL | **generics-wildcards/Q5 why-cant-create-generic-array-java** — stub, no content |
| S8 | STUB | CRITICAL | **exception-handling/Q3 throw-vs-throws-java-difference** — stub, no content |
| S9 | STUB | CRITICAL | **exception-handling/Q6 finally-block-execution-rules-java** — stub, no content |
| S10 | STUB | CRITICAL | **exception-handling/Q8 best-practices-for-exception-handling-java** — stub, no content |
| S11 | STUB | CRITICAL | **string-handling/Q1 why-string-is-immutable-in-java** — stub, no content |
| S12 | STUB | CRITICAL | **string-handling/Q4 string-intern-method-java-explained** — stub, no content |
| S13 | STUB | CRITICAL | **string-handling/Q5 string-equals-vs-contentequals-java** — stub, no content |
| S14 | STUB | CRITICAL | **reflection-annotations/Q1 what-is-reflection-in-java-use-cases** — stub, no content |
| S15 | STUB | CRITICAL | **reflection-annotations/Q3 reflection-performance-cost-java** — stub, no content |
| S16 | STUB | CRITICAL | **reflection-annotations/Q5 meta-annotations-retention-target** — stub, no content |
| S17 | STUB | CRITICAL | **java-io-nio/Q1 java-io-streams-overview-byte-vs-character** — stub, no content |
| S18 | STUB | CRITICAL | **java-io-nio/Q2 java-nio-vs-io-comparison** — stub, no content |
| S19 | STUB | CRITICAL | **java-io-nio/Q3 channels-and-buffers-java-nio** — stub, no content |
| S20 | STUB | CRITICAL | **java-io-nio/Q4 how-to-read-large-file-efficiently-java** — stub, no content |
| S21 | STUB | CRITICAL | **java-io-nio/Q5 serialization-vs-externalizable-java** — stub, no content |
| S22 | STUB | CRITICAL | **comparisons/Q1 abstract-class-vs-interface-java-comparison** — stub, no content |
| S23 | STUB | CRITICAL | **comparisons/Q2 checked-vs-unchecked-exception-java-comparison** — stub, no content |
| S24 | STUB | CRITICAL | **comparisons/Q3 heap-vs-stack-memory-java-comparison** — stub, no content |
| S25 | OVERLAP | MAJOR | **oop-principles**: `inheritance-super-keyword-java` ↔ `this-vs-super-keyword-java` — shared tokens: java, keyword, super (Jaccard 0.6) |

## Topic: oop-principles

_23 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** oop-four-pillars-java | ✓ | ✓ | ✓ | CLEAN |
| **Q2** encapsulation-access-modifiers-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** inheritance-super-keyword-java | ✓ | ✓ | ✓ | CLEAN |
| **Q4** this-vs-super-keyword-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q5** constructor-chaining-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q6** method-overloading-vs-overriding-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q7** compile-time-vs-runtime-polymorphism | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q8** abstraction-abstract-class-vs-interface | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q9** abstract-class-vs-interface-java-when-to-use | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q10** java-default-static-methods-interfaces | direct_answer is 62 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q11** diamond-problem-java-interfaces | — | — | — | STUB |
| **Q12** composition-vs-inheritance-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q13** association-aggregation-composition | ✓ | ✓ | ✓ | CLEAN |
| **Q14** object-class-methods-java | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q15** equals-and-hashcode-contract-java | — | — | — | STUB |
| **Q16** shallow-vs-deep-copy-java | ✓ | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q17** how-to-create-immutable-class-java | direct_answer is 65 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q18** static-keyword-java-explained | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q19** enums-in-java | ✓ | ✓ | ✓ | CLEAN |
| **Q20** inner-classes-java | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q21** anonymous-inner-class-vs-lambda-java | — | — | — | STUB |
| **Q22** marker-interfaces-java | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q23** serialization-serialversionuid-java | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |

## Topic: generics-wildcards

_5 questions (4 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** generics-in-java-introduction-and-benefits | — | — | — | STUB |
| **Q2** java-generics-type-erasure-explained | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** bounded-vs-unbounded-wildcards-java | — | — | — | STUB |
| **Q4** pecs-principle-producer-extends-consumer-super | — | — | — | STUB |
| **Q5** why-cant-create-generic-array-java | — | — | — | STUB |

## Topic: exception-handling

_8 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** exception-hierarchy-java | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** checked-vs-unchecked-exceptions-java-when-to-use | no **bold** anchors in direct_answer | speakable is only 110 words | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** throw-vs-throws-java-difference | — | — | — | STUB |
| **Q4** custom-exceptions-java | ✓ | ✓ | ✓ | CLEAN |
| **Q5** try-with-resources-autocloseable | direct_answer is 61 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q6** finally-block-execution-rules-java | — | — | — | STUB |
| **Q7** java-optional-prevent-null-pointer-exception | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q8** best-practices-for-exception-handling-java | — | — | — | STUB |

## Topic: string-handling

_5 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** why-string-is-immutable-in-java | — | — | — | STUB |
| **Q2** string-vs-stringbuilder-vs-stringbuffer-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q3** string-pool-interning | direct_answer is 64 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** string-intern-method-java-explained | — | — | — | STUB |
| **Q5** string-equals-vs-contentequals-java | — | — | — | STUB |

## Topic: reflection-annotations

_6 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** what-is-reflection-in-java-use-cases | — | — | — | STUB |
| **Q2** reflection-basics | direct_answer is empty; key_points section missing; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |
| **Q3** reflection-performance-cost-java | — | — | — | STUB |
| **Q4** custom-annotations | direct_answer is empty; key_points section missing; interviewer_intent missing one of testing/common_mistake/to_stand_out | speakable is only 116 words | ✓ | CRITICAL |
| **Q5** meta-annotations-retention-target | — | — | — | STUB |
| **Q6** annotation-processing | direct_answer is empty; key_points section missing; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |

## Topic: java-io-nio

_5 questions (5 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** java-io-streams-overview-byte-vs-character | — | — | — | STUB |
| **Q2** java-nio-vs-io-comparison | — | — | — | STUB |
| **Q3** channels-and-buffers-java-nio | — | — | — | STUB |
| **Q4** how-to-read-large-file-efficiently-java | — | — | — | STUB |
| **Q5** serialization-vs-externalizable-java | — | — | — | STUB |

## Topic: scenario-based

_23 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** java-pass-by-value-not-reference | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q2** difference-between-equals-and-double-equals-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** final-finally-finalize-java-difference | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q4** type-casting-widening-narrowing | ✓ | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q5** varargs-java | ✓ | ✓ | ✓ | CLEAN |
| **Q6** java-autoboxing-unboxing-integer-cache | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q7** how-does-hashmap-work-internally-java | direct_answer is 61 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q8** hashmap-resize-rehash-internals | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q9** java-date-time-api | ✓ | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q10** predicate-consumer-supplier-function | no **bold** anchors in direct_answer | speakable is only 109 words | ✓ | MINOR |
| **Q11** java-functional-interfaces-lambdas-explained | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q12** java-method-references-four-types | no **bold** anchors in direct_answer | speakable is only 117 words | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q13** java-streams-lazy-evaluation-common-operations | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q14** java-stream-map-vs-flatmap-difference | no **bold** anchors in direct_answer | speakable is only 104 words | ✓ | MINOR |
| **Q15** java-stream-collectors-groupingby-tomap | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q16** parallel-streams-java | ✓ | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q17** stream-collectors-joining-reducing | ✓ | speakable is only 117 words | substantive Zone 3 with zero code examples | MODERATE |
| **Q18** java-var-local-variable-type-inference-limitations | no **bold** anchors in direct_answer | ✓ | only 1 deep-dive section(s) | MODERATE |
| **Q19** java-record-classes-what-they-are-when-to-use | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q20** java-records-generated-code | direct_answer is 61 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q21** sealed-classes-pattern-matching | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q22** how-java-garbage-collection-works | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q23** weak-soft-phantom-references | direct_answer is 62 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |

## Topic: comparisons

_3 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** abstract-class-vs-interface-java-comparison | — | — | — | STUB |
| **Q2** checked-vs-unchecked-exception-java-comparison | — | — | — | STUB |
| **Q3** heap-vs-stack-memory-java-comparison | — | — | — | STUB |

## Tally

- **CRITICAL:** 3
- **MAJOR:** 0
- **MODERATE:** 24
- **MINOR:** 21
- **CLEAN:** 6
- **STUBS:** 24

### Most common issue codes

- `zone3_no_analogy` × 25
- `zone1_direct_answer_no_bold_anchors` × 24
- `zone3_no_code_examples` × 17
- `zone1_direct_answer_paragraph_wall` × 7
- `zone2_speakable_short` × 6
- `zone1_no_direct_answer` × 3
- `zone1_no_key_points` × 3
- `zone1_interviewer_intent_incomplete` × 3

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
