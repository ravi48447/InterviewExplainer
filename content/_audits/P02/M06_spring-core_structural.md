# Audit — M06_spring-core

**Pillar:** P02  
**Module:** M06 spring-core  
**Topics:** 8  
**Questions:** 22 (22 written, 0 stubs)

## Module-level structural issues

_None detected by structural signals. Judgment layer may add module-level concerns._

## Topic: dependency-injection

_5 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-ioc-dependency-injection-explained | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** constructor-vs-field-vs-setter-injection | no **bold** anchors in direct_answer; key_points section missing | speakable_answer section missing or empty | substantive Zone 3 with no analogies detected | CRITICAL |
| **Q3** how-autowired-works-internally | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** qualifier-and-primary-ambiguous-injection | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q5** value-annotation-property-injection | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | substantive Zone 3 with no analogies detected | CRITICAL |

## Topic: bean-lifecycle

_6 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-bean-scopes | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** prototype-in-singleton-problem | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |
| **Q3** spring-bean-lifecycle | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q4** postconstruct-predestroy-spring | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | substantive Zone 3 with no analogies detected | CRITICAL |
| **Q5** lazy-annotation-spring | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |
| **Q6** circular-dependency-spring | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | substantive Zone 3 with no analogies detected | CRITICAL |

## Topic: aop

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** how-spring-aop-works | direct_answer is 65 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** pointcut-expressions-spring-aop | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | substantive Zone 3 with no analogies detected | CRITICAL |

## Topic: spring-internals

_4 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** beanpostprocessor-spring | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |
| **Q2** beanfactory-vs-applicationcontext | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q3** conditional-and-custom-conditions | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q4** spring-expression-language-spel | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | substantive Zone 3 with no analogies detected | CRITICAL |

## Topic: custom-components

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** component-vs-service-vs-repository-vs-controller | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** component-scan-spring | direct_answer is empty; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | CRITICAL |

## Topic: spring-events

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** spring-events-eventlistener-applicationeventpublisher | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: scenario-based

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** transactional-propagation-types | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q2** spring-profiles-profile-annotation | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: comparisons

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Tally

- **CRITICAL:** 10
- **MAJOR:** 0
- **MODERATE:** 3
- **MINOR:** 9
- **CLEAN:** 0
- **STUBS:** 0

### Most common issue codes

- `zone3_no_analogy` × 17
- `zone1_direct_answer_no_bold_anchors` × 12
- `zone1_no_direct_answer` × 9
- `zone1_interviewer_intent_incomplete` × 9
- `zone3_no_code_examples` × 2
- `zone1_no_key_points` × 1
- `zone2_no_speakable` × 1
- `zone1_direct_answer_paragraph_wall` × 1

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
