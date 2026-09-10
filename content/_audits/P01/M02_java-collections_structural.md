> **Superseded — do not use for launch decisions.** This file predates `scripts/out/audit_v3/P01/`.
> Trust `scripts/out/audit_v3/P01/` only. Regenerated banner: 2026-05-19.

# Audit — M02_java-collections

**Pillar:** P01  
**Module:** M02 java-collections  
**Topics:** 8  
**Questions:** 51 (21 written, 30 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | STUB | CRITICAL | **algorithm-complexity/Q1 big-o-notation-introduction-java** — stub, no content |
| S2 | STUB | CRITICAL | **algorithm-complexity/Q2 time-complexity-common-operations-java** — stub, no content |
| S3 | STUB | CRITICAL | **algorithm-complexity/Q3 amortized-complexity-arraylist-hashmap-java** — stub, no content |
| S4 | STUB | CRITICAL | **algorithm-complexity/Q4 how-to-analyze-recursive-algorithm-complexity-java** — stub, no content |
| S5 | STUB | CRITICAL | **sorting-and-searching/Q1 java-sorting-algorithms-overview** — stub, no content |
| S6 | STUB | CRITICAL | **sorting-and-searching/Q2 sorting-custom-objects-java-comparator** — stub, no content |
| S7 | STUB | CRITICAL | **sorting-and-searching/Q3 timsort-java-collections-sort** — stub, no content |
| S8 | STUB | CRITICAL | **sorting-and-searching/Q4 binary-search-java-collections** — stub, no content |
| S9 | STUB | CRITICAL | **trees-and-graphs/Q1 binary-tree-vs-binary-search-tree-java** — stub, no content |
| S10 | STUB | CRITICAL | **trees-and-graphs/Q2 tree-traversal-inorder-preorder-postorder-java** — stub, no content |
| S11 | STUB | CRITICAL | **trees-and-graphs/Q3 bfs-vs-dfs-java** — stub, no content |
| S12 | STUB | CRITICAL | **trees-and-graphs/Q4 graph-representation-adjacency-list-matrix-java** — stub, no content |
| S13 | STUB | CRITICAL | **trees-and-graphs/Q5 dijkstra-shortest-path-java** — stub, no content |
| S14 | STUB | CRITICAL | **dynamic-programming/Q1 dynamic-programming-introduction-java** — stub, no content |
| S15 | STUB | CRITICAL | **dynamic-programming/Q2 memoization-vs-tabulation-java** — stub, no content |
| S16 | STUB | CRITICAL | **dynamic-programming/Q3 fibonacci-dp-java** — stub, no content |
| S17 | STUB | CRITICAL | **dynamic-programming/Q4 knapsack-01-dp-java** — stub, no content |
| S18 | STUB | CRITICAL | **problem-solving-patterns/Q1 sliding-window-technique-java** — stub, no content |
| S19 | STUB | CRITICAL | **problem-solving-patterns/Q2 two-pointers-technique-java** — stub, no content |
| S20 | STUB | CRITICAL | **problem-solving-patterns/Q3 fast-and-slow-pointers-java** — stub, no content |
| S21 | STUB | CRITICAL | **problem-solving-patterns/Q4 top-k-elements-heap-java** — stub, no content |
| S22 | STUB | CRITICAL | **problem-solving-patterns/Q5 backtracking-java-pattern** — stub, no content |
| S23 | STUB | CRITICAL | **scenario-based/Q1 reverse-linked-list-java-iterative-recursive** — stub, no content |
| S24 | STUB | CRITICAL | **scenario-based/Q2 detect-loop-in-linked-list-java** — stub, no content |
| S25 | STUB | CRITICAL | **scenario-based/Q3 two-sum-problem-java** — stub, no content |
| S26 | STUB | CRITICAL | **scenario-based/Q4 lru-cache-implementation-java** — stub, no content |
| S27 | STUB | CRITICAL | **scenario-based/Q5 check-anagram-java** — stub, no content |
| S28 | STUB | CRITICAL | **comparisons/Q1 array-vs-arraylist-java-comparison** — stub, no content |
| S29 | STUB | CRITICAL | **comparisons/Q2 hashmap-vs-concurrenthashmap-comparison** — stub, no content |
| S30 | STUB | CRITICAL | **comparisons/Q3 stack-vs-queue-java-comparison** — stub, no content |

## Topic: collections-internals

_21 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** list-vs-set-vs-map-overview | direct_answer is empty | ✓ | substantive Zone 3 with zero code examples | CRITICAL |
| **Q2** arraylist-vs-linkedlist | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q3** hashmap-vs-treemap-vs-linkedhashmap | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q4** how-hashset-works-internally-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q5** hashmap-collision-handling | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q6** hashmap-vs-hashtable-vs-concurrenthashmap-java | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q7** priorityqueue-heap-structure | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q8** arraydeque-vs-linkedlist-queue-stack | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q9** comparable-vs-comparator | no **bold** anchors in direct_answer | speakable is only 106 words | ✓ | MINOR |
| **Q10** comparator-thencomparing-reversed | no **bold** anchors in direct_answer | speakable is only 113 words | ✓ | MINOR |
| **Q11** fail-fast-vs-fail-safe-iterators-java | no **bold** anchors in direct_answer | speakable is only 117 words | substantive Zone 3 with no analogies detected | MINOR |
| **Q12** iterator-vs-listiterator-java | direct_answer is empty | speakable is only 103 words | ✓ | CRITICAL |
| **Q13** treeset-treemap-navigable | direct_answer is empty | ✓ | ✓ | CRITICAL |
| **Q14** enummap-enumset-performance | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q15** weakhashmap-gc-cache | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q16** copyonwritearraylist-when-and-why | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q17** unmodifiable-list-vs-list-of-vs-list-copyof | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q18** choosing-the-right-collection | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q19** collections-utility-class-methods | direct_answer is empty | ✓ | ✓ | CRITICAL |
| **Q20** map-compute-merge-methods | direct_answer is empty | ✓ | ✓ | CRITICAL |
| **Q21** stream-api-with-collections | direct_answer is empty | ✓ | ✓ | CRITICAL |

## Topic: algorithm-complexity

_4 questions (4 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** big-o-notation-introduction-java | — | — | — | STUB |
| **Q2** time-complexity-common-operations-java | — | — | — | STUB |
| **Q3** amortized-complexity-arraylist-hashmap-java | — | — | — | STUB |
| **Q4** how-to-analyze-recursive-algorithm-complexity-java | — | — | — | STUB |

## Topic: sorting-and-searching

_4 questions (4 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** java-sorting-algorithms-overview | — | — | — | STUB |
| **Q2** sorting-custom-objects-java-comparator | — | — | — | STUB |
| **Q3** timsort-java-collections-sort | — | — | — | STUB |
| **Q4** binary-search-java-collections | — | — | — | STUB |

## Topic: trees-and-graphs

_5 questions (5 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** binary-tree-vs-binary-search-tree-java | — | — | — | STUB |
| **Q2** tree-traversal-inorder-preorder-postorder-java | — | — | — | STUB |
| **Q3** bfs-vs-dfs-java | — | — | — | STUB |
| **Q4** graph-representation-adjacency-list-matrix-java | — | — | — | STUB |
| **Q5** dijkstra-shortest-path-java | — | — | — | STUB |

## Topic: dynamic-programming

_4 questions (4 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** dynamic-programming-introduction-java | — | — | — | STUB |
| **Q2** memoization-vs-tabulation-java | — | — | — | STUB |
| **Q3** fibonacci-dp-java | — | — | — | STUB |
| **Q4** knapsack-01-dp-java | — | — | — | STUB |

## Topic: problem-solving-patterns

_5 questions (5 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** sliding-window-technique-java | — | — | — | STUB |
| **Q2** two-pointers-technique-java | — | — | — | STUB |
| **Q3** fast-and-slow-pointers-java | — | — | — | STUB |
| **Q4** top-k-elements-heap-java | — | — | — | STUB |
| **Q5** backtracking-java-pattern | — | — | — | STUB |

## Topic: scenario-based

_5 questions (5 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** reverse-linked-list-java-iterative-recursive | — | — | — | STUB |
| **Q2** detect-loop-in-linked-list-java | — | — | — | STUB |
| **Q3** two-sum-problem-java | — | — | — | STUB |
| **Q4** lru-cache-implementation-java | — | — | — | STUB |
| **Q5** check-anagram-java | — | — | — | STUB |

## Topic: comparisons

_3 questions (3 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** array-vs-arraylist-java-comparison | — | — | — | STUB |
| **Q2** hashmap-vs-concurrenthashmap-comparison | — | — | — | STUB |
| **Q3** stack-vs-queue-java-comparison | — | — | — | STUB |

## Tally

- **CRITICAL:** 6
- **MAJOR:** 0
- **MODERATE:** 6
- **MINOR:** 9
- **CLEAN:** 0
- **STUBS:** 30

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 15
- `zone3_no_code_examples` × 7
- `zone1_no_direct_answer` × 6
- `zone3_no_analogy` × 5
- `zone2_speakable_short` × 4

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
