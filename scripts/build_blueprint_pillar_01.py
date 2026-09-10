#!/usr/bin/env python3
"""build_blueprint_pillar_01.py — TIGHT CURATION PASS

Generates content/blueprints/pillar-01-java-language.json.

Philosophy (per user feedback):
  - FOCUSED, not over-filled. 5–8 questions per topic on average.
  - Only must-ask / high-SEO / genuine-coverage-gap questions.
  - No redundant "comparisons" that repeat topic-specific content.
  - No trivial filler ("can we override private methods" style).

Guiding rubric per stub:
  * Would a mid-level Java interviewer actually ask it?
  * Is it a high-volume Google query for Java interview prep?
  * Does it fill a real conceptual gap the other topics don't cover?
  If the answer to all three is NO — drop it.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "blueprints" / "pillar-01-java-language.json"


def q(slug: str, title: str | None = None, question: str | None = None,
      difficulty: str = "medium", importance: str = "high") -> dict[str, Any]:
    entry: dict[str, Any] = {"slug": slug}
    if title:
        entry["title"] = title
    if question:
        entry["question"] = question
    if difficulty:
        entry["difficulty"] = difficulty
    if importance:
        entry["importance"] = importance
    return entry


# ═══════════════════════════════════════════════════════════════════════════
# MODULE 01 — CORE JAVA & OOP
# ═══════════════════════════════════════════════════════════════════════════

CORE_JAVA = {
    "moduleSlug": "core-java",
    "topicOrder": [
        "oop-principles",
        "exception-handling",
        "string-handling",
        "generics-wildcards",
        "reflection-annotations",
        "java-io-nio",
        "scenario-based",
        "comparisons",
    ],
    "topics": {
        # 1.1 OOP Principles — 20 existing + 3 essential stubs = 23
        "oop-principles": {
            "title": "OOP Principles",
            "questions": [
                q("oop-four-pillars-java"),
                q("encapsulation-access-modifiers-java"),
                q("inheritance-super-keyword-java"),
                q("this-vs-super-keyword-java"),
                q("constructor-chaining-java"),
                q("method-overloading-vs-overriding-java"),
                q("compile-time-vs-runtime-polymorphism"),
                q("abstraction-abstract-class-vs-interface"),
                q("abstract-class-vs-interface-java-when-to-use"),
                q("java-default-static-methods-interfaces"),
                q("diamond-problem-java-interfaces",
                  "How does Java solve the diamond problem with default methods?",
                  "What is the diamond problem in multiple inheritance, and how does Java 8+ solve it for interfaces with default methods?",
                  difficulty="medium"),
                q("composition-vs-inheritance-java"),
                q("association-aggregation-composition"),
                q("object-class-methods-java"),
                q("equals-and-hashcode-contract-java",
                  "What is the equals() and hashCode() contract in Java?",
                  "Explain the contract between equals() and hashCode(). What breaks if you violate it when using HashMap/HashSet?",
                  difficulty="medium"),
                q("shallow-vs-deep-copy-java"),
                q("how-to-create-immutable-class-java"),
                q("static-keyword-java-explained"),
                q("enums-in-java"),
                q("inner-classes-java"),
                q("anonymous-inner-class-vs-lambda-java",
                  "What is the difference between an anonymous inner class and a lambda in Java?",
                  "Compare anonymous inner classes and lambda expressions in Java — scoping, `this`, bytecode, and when to use each.",
                  difficulty="medium"),
                q("marker-interfaces-java"),
                q("serialization-serialversionuid-java"),
            ],
        },
        # 1.2 Exception Handling — 5 existing + 3 must-ask stubs = 8
        "exception-handling": {
            "title": "Exception Handling",
            "questions": [
                q("exception-hierarchy-java"),
                q("checked-vs-unchecked-exceptions-java-when-to-use"),
                q("throw-vs-throws-java-difference",
                  "What is the difference between throw and throws in Java?",
                  "Explain `throw` vs `throws` in Java with examples. When do you use each?",
                  difficulty="easy"),
                q("custom-exceptions-java"),
                q("try-with-resources-autocloseable"),
                q("finally-block-execution-rules-java",
                  "When does the finally block NOT execute in Java?",
                  "Is finally guaranteed to execute? List all the cases where a finally block can be skipped.",
                  difficulty="medium"),
                q("java-optional-prevent-null-pointer-exception"),
                q("best-practices-for-exception-handling-java",
                  "What are the best practices for exception handling in Java?",
                  "List the top exception-handling anti-patterns and their fixes (swallowing, generic catch, throw Exception, etc.).",
                  difficulty="medium"),
            ],
        },
        # 1.3 String Handling — 2 existing + 3 essentials = 5
        "string-handling": {
            "title": "String Handling",
            "questions": [
                q("why-string-is-immutable-in-java",
                  "Why is String immutable in Java?",
                  "Why did Java make String immutable? Cover security, hashing, string pool, and thread-safety.",
                  difficulty="easy"),
                q("string-vs-stringbuilder-vs-stringbuffer-java"),
                q("string-pool-interning"),
                q("string-intern-method-java-explained",
                  "How does the String.intern() method work in Java?",
                  "Explain String.intern() and the string pool. When should you call intern() and what are the trade-offs?",
                  difficulty="medium"),
                q("string-equals-vs-contentequals-java",
                  "What is the difference between equals() and contentEquals() on String?",
                  "Compare `String.equals()`, `String.equalsIgnoreCase()`, and `String.contentEquals()` with examples.",
                  difficulty="easy"),
            ],
        },
        # 1.4 Generics & Wildcards — 1 existing + 4 core gaps = 5
        "generics-wildcards": {
            "title": "Generics & Wildcards",
            "questions": [
                q("generics-in-java-introduction-and-benefits",
                  "What are generics in Java and why do we use them?",
                  "Introduce Java generics — problem they solve, type safety benefits, and the cost of type erasure.",
                  difficulty="easy"),
                q("java-generics-type-erasure-explained"),
                q("bounded-vs-unbounded-wildcards-java",
                  "What is the difference between bounded and unbounded wildcards in Java?",
                  "Cover `?`, `? extends T`, and `? super T` with real examples and when to use each.",
                  difficulty="medium"),
                q("pecs-principle-producer-extends-consumer-super",
                  "What is the PECS principle in Java generics?",
                  "Explain Producer-Extends, Consumer-Super (PECS) with `Collections.copy()` as an example.",
                  difficulty="medium"),
                q("why-cant-create-generic-array-java",
                  "Why can't you create a generic array in Java?",
                  "Why is `new T[]` illegal in Java? Explain reifiable vs non-reifiable types and workarounds.",
                  difficulty="hard"),
            ],
        },
        # 1.5 Reflection & Annotations — 3 existing + 2 essentials = 5
        "reflection-annotations": {
            "title": "Reflection & Annotations",
            "questions": [
                q("what-is-reflection-in-java-use-cases",
                  "What is reflection in Java and when do we use it?",
                  "Introduce Java reflection API. Cover real use cases (frameworks, serialization, testing) and risks.",
                  difficulty="easy"),
                q("reflection-basics"),
                q("reflection-performance-cost-java",
                  "What is the performance cost of Java reflection?",
                  "Explain why reflection is slow, how much slower it is vs direct calls, and how MethodHandle helps.",
                  difficulty="hard"),
                q("custom-annotations"),
                q("meta-annotations-retention-target",
                  "What are meta-annotations in Java? (@Retention, @Target, @Documented)",
                  "Explain meta-annotations and the retention policies (SOURCE, CLASS, RUNTIME).",
                  difficulty="medium"),
                q("annotation-processing"),
            ],
        },
        # 1.6 Java I/O & NIO — empty topic, 5 essentials from scratch
        "java-io-nio": {
            "title": "Java I/O & NIO",
            "questions": [
                q("java-io-streams-overview-byte-vs-character",
                  "Java I/O streams — byte streams vs character streams",
                  "Overview of Java I/O: byte streams (InputStream/OutputStream) vs character streams (Reader/Writer). When to use each?",
                  difficulty="easy"),
                q("java-nio-vs-io-comparison",
                  "Java NIO vs IO — what's the difference?",
                  "Compare Java IO and NIO: blocking vs non-blocking, streams vs channels/buffers, when to choose each.",
                  difficulty="medium"),
                q("channels-and-buffers-java-nio",
                  "What are channels and buffers in Java NIO?",
                  "Explain channels (FileChannel, SocketChannel) and ByteBuffer in Java NIO with a read/write example.",
                  difficulty="medium"),
                q("how-to-read-large-file-efficiently-java",
                  "How do you read a large file efficiently in Java?",
                  "Compare BufferedReader line-by-line, Files.lines() Stream, and memory-mapped files for large file reads.",
                  difficulty="medium"),
                q("serialization-vs-externalizable-java",
                  "Serializable vs Externalizable in Java — what's the difference?",
                  "Compare `Serializable` and `Externalizable`. When would you implement Externalizable for performance?",
                  difficulty="medium"),
            ],
        },
        # 1.7 Scenario-based — keep all 23 existing (user wants V2 preserved)
        "scenario-based": {
            "title": "Scenario-based",
            "questions": [
                q("java-pass-by-value-not-reference"),
                q("difference-between-equals-and-double-equals-java"),
                q("final-finally-finalize-java-difference"),
                q("type-casting-widening-narrowing"),
                q("varargs-java"),
                q("java-autoboxing-unboxing-integer-cache"),
                q("how-does-hashmap-work-internally-java"),
                q("hashmap-resize-rehash-internals"),
                q("java-date-time-api"),
                q("predicate-consumer-supplier-function"),
                q("java-functional-interfaces-lambdas-explained"),
                q("java-method-references-four-types"),
                q("java-streams-lazy-evaluation-common-operations"),
                q("java-stream-map-vs-flatmap-difference"),
                q("java-stream-collectors-groupingby-tomap"),
                q("parallel-streams-java"),
                q("stream-collectors-joining-reducing"),
                q("java-var-local-variable-type-inference-limitations"),
                q("java-record-classes-what-they-are-when-to-use"),
                q("java-records-generated-code"),
                q("sealed-classes-pattern-matching"),
                q("how-java-garbage-collection-works"),
                q("weak-soft-phantom-references"),
            ],
        },
        # 1.8 Comparisons — only high-SEO must-ask (not duplicates of topic Qs)
        "comparisons": {
            "title": "Comparisons",
            "questions": [
                q("abstract-class-vs-interface-java-comparison",
                  "Abstract class vs Interface in Java — detailed comparison",
                  "Java 8+ abstract class vs interface: fields, constructors, default/static methods, multiple inheritance.",
                  difficulty="easy"),
                q("checked-vs-unchecked-exception-java-comparison",
                  "Checked vs Unchecked exceptions in Java — comparison",
                  "Detailed comparison of checked vs unchecked exceptions: hierarchy, compiler rules, design guidance.",
                  difficulty="easy"),
                q("heap-vs-stack-memory-java-comparison",
                  "Heap vs Stack memory in Java — comparison",
                  "Compare heap and stack memory in the JVM: what lives where, lifetime, OOM vs StackOverflow.",
                  difficulty="medium"),
            ],
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# MODULE 02 — JAVA COLLECTIONS & ALGORITHMS
# ═══════════════════════════════════════════════════════════════════════════

JAVA_COLLECTIONS = {
    "moduleSlug": "java-collections",
    "topicOrder": [
        "collections-internals",
        "algorithm-complexity",
        "sorting-and-searching",
        "trees-and-graphs",
        "dynamic-programming",
        "problem-solving-patterns",
        "scenario-based",
        "comparisons",
    ],
    "topics": {
        # 21 existing — keep all; very mature coverage
        "collections-internals": {
            "title": "Collections Internals",
            "questions": [
                q("list-vs-set-vs-map-overview"),
                q("arraylist-vs-linkedlist"),
                q("hashmap-vs-treemap-vs-linkedhashmap"),
                q("how-hashset-works-internally-java"),
                q("hashmap-collision-handling"),
                q("hashmap-vs-hashtable-vs-concurrenthashmap-java"),
                q("priorityqueue-heap-structure"),
                q("arraydeque-vs-linkedlist-queue-stack"),
                q("comparable-vs-comparator"),
                q("comparator-thencomparing-reversed"),
                q("fail-fast-vs-fail-safe-iterators-java"),
                q("iterator-vs-listiterator-java"),
                q("treeset-treemap-navigable"),
                q("enummap-enumset-performance"),
                q("weakhashmap-gc-cache"),
                q("copyonwritearraylist-when-and-why"),
                q("unmodifiable-list-vs-list-of-vs-list-copyof"),
                q("choosing-the-right-collection"),
                q("collections-utility-class-methods"),
                q("map-compute-merge-methods"),
                q("stream-api-with-collections"),
            ],
        },
        # Empty → 4 fundamentals
        "algorithm-complexity": {
            "title": "Algorithm Complexity",
            "questions": [
                q("big-o-notation-introduction-java",
                  "What is Big-O notation?",
                  "Introduce Big-O notation. Compare O(1), O(log n), O(n), O(n log n), O(n²) with Java examples.",
                  difficulty="easy"),
                q("time-complexity-common-operations-java",
                  "Time complexity of common Java collection operations",
                  "List time complexity of get/add/remove/contains for ArrayList, LinkedList, HashMap, TreeMap, HashSet.",
                  difficulty="easy"),
                q("amortized-complexity-arraylist-hashmap-java",
                  "What is amortized complexity? (ArrayList.add, HashMap.put)",
                  "Explain amortized complexity. Why is ArrayList.add() amortized O(1)?",
                  difficulty="medium"),
                q("how-to-analyze-recursive-algorithm-complexity-java",
                  "How to analyze the time complexity of a recursive algorithm?",
                  "Introduce the master theorem and recursion-tree method. Apply to merge sort and binary search.",
                  difficulty="hard"),
            ],
        },
        # Empty → 4 essentials
        "sorting-and-searching": {
            "title": "Sorting & Searching",
            "questions": [
                q("java-sorting-algorithms-overview",
                  "Java sorting algorithms — overview",
                  "Overview of sorting in Java: merge sort, quicksort, Timsort — complexity, stability, memory.",
                  difficulty="easy"),
                q("sorting-custom-objects-java-comparator",
                  "How do you sort custom objects in Java?",
                  "Sort custom objects via Comparable, Comparator, and `Comparator.comparing()`. Chain with thenComparing.",
                  difficulty="easy"),
                q("timsort-java-collections-sort",
                  "What is Timsort and why does Java use it?",
                  "Explain Timsort — Java's sort algorithm. Why was it chosen and what are its characteristics?",
                  difficulty="medium"),
                q("binary-search-java-collections",
                  "How do you do binary search in Java?",
                  "Implement binary search iteratively and recursively. Use Collections.binarySearch correctly.",
                  difficulty="easy"),
            ],
        },
        # Empty → 5 essentials
        "trees-and-graphs": {
            "title": "Trees & Graphs",
            "questions": [
                q("binary-tree-vs-binary-search-tree-java",
                  "Binary tree vs binary search tree in Java",
                  "Compare binary trees and BSTs. Properties, complexity, and when each is used.",
                  difficulty="easy"),
                q("tree-traversal-inorder-preorder-postorder-java",
                  "Tree traversal in Java — inorder, preorder, postorder",
                  "Implement DFS tree traversals — recursive and iterative with a stack.",
                  difficulty="medium"),
                q("bfs-vs-dfs-java",
                  "BFS vs DFS in Java — when to use each?",
                  "Compare breadth-first and depth-first search. Complexity, use cases, memory trade-offs.",
                  difficulty="medium"),
                q("graph-representation-adjacency-list-matrix-java",
                  "Graph representation in Java — adjacency list vs matrix",
                  "Compare adjacency list and adjacency matrix. Space/time trade-offs for sparse vs dense graphs.",
                  difficulty="medium"),
                q("dijkstra-shortest-path-java",
                  "Implement Dijkstra's shortest-path algorithm in Java",
                  "Shortest path in a weighted graph using Dijkstra with a PriorityQueue. Complexity analysis.",
                  difficulty="hard"),
            ],
        },
        # Empty → 4 core DP problems
        "dynamic-programming": {
            "title": "Dynamic Programming",
            "questions": [
                q("dynamic-programming-introduction-java",
                  "What is dynamic programming? (Java introduction)",
                  "Introduce DP: optimal substructure and overlapping subproblems. Recognize when to apply DP.",
                  difficulty="easy"),
                q("memoization-vs-tabulation-java",
                  "Memoization vs tabulation in DP — what's the difference?",
                  "Compare top-down (memoization) and bottom-up (tabulation) DP with Java examples.",
                  difficulty="medium"),
                q("fibonacci-dp-java",
                  "Fibonacci series using DP in Java",
                  "Implement Fibonacci naive recursion, memoization, tabulation, and O(1) space versions.",
                  difficulty="easy"),
                q("knapsack-01-dp-java",
                  "0/1 Knapsack problem using DP in Java",
                  "Implement 0/1 Knapsack with DP. Compare with fractional knapsack (greedy).",
                  difficulty="hard"),
            ],
        },
        # Empty → 5 key patterns
        "problem-solving-patterns": {
            "title": "Problem-Solving Patterns",
            "questions": [
                q("sliding-window-technique-java",
                  "Sliding window technique in Java",
                  "Fixed vs variable-size sliding window. Solve max-sum subarray and longest-substring-without-repeat.",
                  difficulty="medium"),
                q("two-pointers-technique-java",
                  "Two-pointers technique in Java",
                  "Two-pointer pattern — opposite ends and same direction. Solve two-sum sorted, container-with-most-water.",
                  difficulty="medium"),
                q("fast-and-slow-pointers-java",
                  "Fast and slow pointers (Floyd's cycle detection) in Java",
                  "Tortoise and hare for cycle detection in linked lists. Find cycle start. Middle of list.",
                  difficulty="medium"),
                q("top-k-elements-heap-java",
                  "Top-K elements using a heap in Java",
                  "Top-K frequent elements, K closest points — min-heap pattern with O(n log k).",
                  difficulty="medium"),
                q("backtracking-java-pattern",
                  "Backtracking pattern in Java",
                  "Backtracking template. Solve N-queens, subsets, permutations, combination sum.",
                  difficulty="hard"),
            ],
        },
        # Empty → 5 classic high-SEO coding questions
        "scenario-based": {
            "title": "Scenario-based",
            "questions": [
                q("reverse-linked-list-java-iterative-recursive",
                  "Reverse a linked list in Java — iterative and recursive",
                  "Reverse a singly linked list iteratively and recursively. Walk through the pointer mechanics.",
                  difficulty="medium"),
                q("detect-loop-in-linked-list-java",
                  "Detect a loop in a linked list in Java",
                  "Floyd's cycle detection. Find cycle length and cycle start node.",
                  difficulty="medium"),
                q("two-sum-problem-java",
                  "Two Sum problem in Java",
                  "Two-sum with HashMap O(n). Two-pointer when sorted. Variants.",
                  difficulty="easy"),
                q("lru-cache-implementation-java",
                  "Implement an LRU Cache in Java",
                  "LRU cache via LinkedHashMap (accessOrder=true) and via HashMap + doubly-linked list.",
                  difficulty="hard"),
                q("check-anagram-java",
                  "How do you check if two strings are anagrams in Java?",
                  "Sort + compare vs frequency counter. Complexity trade-offs and edge cases.",
                  difficulty="easy"),
            ],
        },
        # Empty → only non-redundant comparisons
        "comparisons": {
            "title": "Comparisons",
            "questions": [
                q("array-vs-arraylist-java-comparison",
                  "Array vs ArrayList in Java — comparison",
                  "Primitives vs generics, fixed vs dynamic, resize cost, and API surface.",
                  difficulty="easy"),
                q("hashmap-vs-concurrenthashmap-comparison",
                  "HashMap vs ConcurrentHashMap — comparison",
                  "Thread-safety, lock striping vs synchronization, iteration guarantees, null support.",
                  difficulty="medium"),
                q("stack-vs-queue-java-comparison",
                  "Stack vs Queue in Java — comparison",
                  "LIFO vs FIFO. Why Stack class is legacy. Deque / ArrayDeque recommendation.",
                  difficulty="easy"),
            ],
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# MODULE 03 — JAVA STREAMS, LAMBDAS & MODERN JAVA
# ═══════════════════════════════════════════════════════════════════════════

JAVA_STREAMS = {
    "moduleSlug": "java-streams",
    "topicOrder": [
        "lambdas-functional-interfaces",
        "streams-api",
        "optional-api",
        "java-9-to-11-features",
        "java-14-to-17-features",
        "java-21-features",
        "scenario-based",
        "comparisons",
    ],
    "topics": {
        # 1 existing + 4 essentials = 5
        "lambdas-functional-interfaces": {
            "title": "Lambdas & Functional Interfaces",
            "questions": [
                q("what-is-lambda-expression-java",
                  "What is a lambda expression in Java?",
                  "Introduce lambda expressions. Syntax, scoping rules, and what they compile to.",
                  difficulty="easy"),
                q("functional-interface-java-explained",
                  "What is a functional interface in Java?",
                  "Explain functional interfaces and @FunctionalInterface. Requirements and common examples.",
                  difficulty="easy"),
                q("lambdas-functional-interfaces"),
                q("predicate-function-consumer-supplier-java",
                  "Predicate, Function, Consumer, Supplier in Java",
                  "Explain the four core functional interfaces with signatures, combinators, and typical usage.",
                  difficulty="easy"),
                q("method-references-java-four-types",
                  "Method references in Java — four types",
                  "Four method-reference forms: static, bound, unbound, and constructor.",
                  difficulty="medium"),
            ],
        },
        # 3 existing + 6 essentials = 9
        "streams-api": {
            "title": "Streams API",
            "questions": [
                q("what-is-java-stream-api",
                  "What is the Java Stream API?",
                  "Introduce the Stream API — declarative pipelines, sources, intermediate and terminal operations.",
                  difficulty="easy"),
                q("intermediate-vs-terminal-operations-java",
                  "Intermediate vs terminal operations in Java Streams",
                  "Categorize stream operations. Why are intermediate ops lazy? Can a stream be consumed twice?",
                  difficulty="easy"),
                q("stream-api-operations"),
                q("lazy-evaluation-streams-java",
                  "How does lazy evaluation work in Java Streams?",
                  "Explain stream laziness and short-circuiting with examples (filter + findFirst).",
                  difficulty="medium"),
                q("flatmap-vs-map-java-streams",
                  "flatMap vs map in Java Streams — what's the difference?",
                  "Explain flatMap with concrete examples (List<List<X>> → List<X>, Optional chaining).",
                  difficulty="medium"),
                q("collectors-groupingby-partitioningby-java",
                  "Collectors.groupingBy and partitioningBy in Java",
                  "Group-by with downstream collectors. When to use partitioningBy vs groupingBy.",
                  difficulty="medium"),
                q("collectors-advanced"),
                q("parallel-stream-when-to-use-java",
                  "When should you use parallel streams in Java?",
                  "Parallel stream trade-offs: splittability, statefulness, shared forkjoin pool, ordering.",
                  difficulty="medium"),
                q("stream-performance"),
                q("reduce-vs-collect-java-streams",
                  "reduce() vs collect() in Java Streams",
                  "When to use reduce (immutable accumulator) vs collect (mutable container). Examples.",
                  difficulty="medium"),
            ],
        },
        # Empty → 4 essentials
        "optional-api": {
            "title": "Optional API",
            "questions": [
                q("what-is-optional-in-java",
                  "What is Optional in Java and why was it added?",
                  "Optional motivation, API overview, and what it is NOT (generic Maybe / field type).",
                  difficulty="easy"),
                q("optional-of-ofNullable-empty-java",
                  "Optional.of vs ofNullable vs empty in Java",
                  "Three ways to create Optional. When each throws NPE.",
                  difficulty="easy"),
                q("optional-orelse-vs-orelseget-java",
                  "Optional.orElse vs orElseGet — what's the difference?",
                  "orElse always evaluates its arg; orElseGet is lazy. Performance implications.",
                  difficulty="medium"),
                q("optional-as-return-type-best-practices-java",
                  "Should Optional be used as a return type? (Best practices)",
                  "Brian Goetz guidance. Do NOT use Optional as a field, param, or in collections.",
                  difficulty="medium"),
            ],
        },
        # Empty → 4 impactful features
        "java-9-to-11-features": {
            "title": "Java 9–11 Features",
            "questions": [
                q("java-9-module-system-jpms",
                  "What is the Java 9 Module System (JPMS)?",
                  "Java 9 modules: motivation, module-info.java, exports/requires, migration challenges.",
                  difficulty="medium"),
                q("java-9-factory-methods-list-of-set-of-map-of",
                  "Java 9 factory methods — List.of, Set.of, Map.of",
                  "Immutable collection factories. Compare with Collections.unmodifiableList().",
                  difficulty="easy"),
                q("java-10-var-local-variable-type-inference",
                  "Java 10 `var` — local variable type inference",
                  "var rules, where it can and can't be used. Readability trade-offs.",
                  difficulty="easy"),
                q("java-11-http-client-api",
                  "Java 11 HttpClient API",
                  "Modern HTTP client replacing HttpURLConnection. Sync, async, WebSocket. HTTP/2 support.",
                  difficulty="medium"),
            ],
        },
        # 6 existing + 1 essential = 7
        "java-14-to-17-features": {
            "title": "Java 14–17 Features",
            "questions": [
                q("switch-expressions"),
                q("pattern-matching-instanceof-java",
                  "Pattern matching for instanceof in Java",
                  "Java 16 instanceof pattern. Cleaner downcasting without redundant cast.",
                  difficulty="easy"),
                q("text-blocks-string-templates"),
                q("java-records"),
                q("sealed-classes"),
                q("functional-interfaces-lambda"),
                q("optional-best-practices"),
            ],
        },
        # Empty → 4 key Java 21 features
        "java-21-features": {
            "title": "Java 21 Features",
            "questions": [
                q("virtual-threads-java-21",
                  "Virtual threads in Java 21 — what are they?",
                  "Project Loom virtual threads — how they differ from platform threads. Carrier threads and pinning.",
                  difficulty="medium"),
                q("structured-concurrency-java-21",
                  "Structured concurrency in Java 21",
                  "StructuredTaskScope API for concurrent task management. Comparison with ExecutorService.",
                  difficulty="hard"),
                q("pattern-matching-for-switch-java-21",
                  "Pattern matching for switch in Java 21",
                  "Type patterns, deconstruction patterns, and guards in switch expressions.",
                  difficulty="medium"),
                q("sequenced-collections-java-21",
                  "Sequenced collections in Java 21",
                  "SequencedCollection, SequencedSet, SequencedMap — first(), last(), reversed() contract.",
                  difficulty="easy"),
            ],
        },
        # Empty → 4 highest-SEO stream recipes
        "scenario-based": {
            "title": "Scenario-based",
            "questions": [
                q("group-objects-by-field-java-streams",
                  "How do you group objects by a field using Java Streams?",
                  "Collectors.groupingBy — single field, multi-level, with downstream counting/summing.",
                  difficulty="easy"),
                q("convert-list-to-map-java-streams",
                  "How do you convert a List to a Map in Java Streams?",
                  "Collectors.toMap with duplicate key handling. LinkedHashMap supplier for ordering.",
                  difficulty="easy"),
                q("flatten-list-of-lists-java-streams",
                  "Flatten a list of lists using Java Streams",
                  "stream.flatMap(List::stream) — idiomatic flattening.",
                  difficulty="easy"),
                q("parallel-vs-sequential-stream-decision-java",
                  "When to use parallel vs sequential streams in Java",
                  "Decision criteria: data size, per-element cost, splittability, side effects, pool contention.",
                  difficulty="hard"),
            ],
        },
        # Empty → 3 non-redundant comparisons
        "comparisons": {
            "title": "Comparisons",
            "questions": [
                q("stream-vs-collection-java-comparison",
                  "Stream vs Collection in Java — comparison",
                  "Streams are not data structures. Lazy vs eager, consumption, and parallelism.",
                  difficulty="easy"),
                q("optional-vs-null-java-comparison",
                  "Optional vs null in Java — comparison",
                  "When to use Optional; when null (or @Nullable) is still fine.",
                  difficulty="easy"),
                q("imperative-vs-functional-java-comparison",
                  "Imperative vs functional Java code — comparison",
                  "Loops vs stream pipelines — readability, performance, and debuggability trade-offs.",
                  difficulty="medium"),
            ],
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# MODULE 04 — JAVA CONCURRENCY & MULTITHREADING
# ═══════════════════════════════════════════════════════════════════════════

JAVA_CONCURRENCY = {
    "moduleSlug": "java-concurrency",
    "topicOrder": [
        "threads-and-lifecycle",
        "synchronization-and-locks",
        "java-memory-model",
        "thread-pools-and-executor",
        "completable-future",
        "concurrent-collections",
        "concurrency-patterns",
        "virtual-threads",
        "scenario-based",
        "comparisons",
    ],
    "topics": {
        # 3 existing + 4 essentials = 7
        "threads-and-lifecycle": {
            "title": "Threads & Lifecycle",
            "questions": [
                q("what-is-thread-in-java",
                  "What is a thread in Java?",
                  "Introduction to threads: Thread class vs Runnable, daemon vs user threads.",
                  difficulty="easy"),
                q("thread-vs-runnable-vs-callable"),
                q("java-thread-lifecycle-states"),
                q("thread-start-vs-run-java",
                  "Thread.start() vs Thread.run() in Java",
                  "Why calling run() directly is a bug. What start() actually does under the hood.",
                  difficulty="easy"),
                q("daemon-threads-java-explained"),
                q("thread-sleep-vs-wait-java",
                  "Thread.sleep() vs Object.wait() in Java",
                  "Critical differences: lock release, recipient of the call, static vs instance.",
                  difficulty="easy"),
                q("thread-interrupt-mechanism-java",
                  "Thread interruption in Java — interrupt, isInterrupted, interrupted",
                  "Interruption as a cooperative mechanism. How to correctly respond to interrupts.",
                  difficulty="medium"),
            ],
        },
        # 6 existing + 2 essentials = 8
        "synchronization-and-locks": {
            "title": "Synchronization & Locks",
            "questions": [
                q("what-is-synchronization-java",
                  "What is synchronization in Java?",
                  "Why synchronization is needed. Mutual exclusion and visibility guarantees.",
                  difficulty="easy"),
                q("synchronized-keyword-monitors"),
                q("synchronized-method-vs-block-java",
                  "Synchronized method vs synchronized block in Java",
                  "Trade-offs: granularity, `this` lock vs custom lock, static synchronized (class lock).",
                  difficulty="easy"),
                q("synchronized-vs-reentrantlock"),
                q("reentrant-read-write-lock"),
                q("stampedlock-optimistic-reads"),
                q("wait-notify-vs-condition-await-signal"),
                q("atomicinteger-vs-synchronized"),
            ],
        },
        # 2 existing + 3 essentials = 5
        "java-memory-model": {
            "title": "Java Memory Model",
            "questions": [
                q("what-is-java-memory-model-jmm",
                  "What is the Java Memory Model (JMM)?",
                  "JMM fundamentals: why it exists, what it guarantees, what happens without it.",
                  difficulty="medium"),
                q("java-memory-model-happens-before"),
                q("volatile-visibility-guarantee"),
                q("volatile-vs-atomic-java",
                  "volatile vs Atomic variables in Java",
                  "volatile provides visibility but not atomicity of compound actions. Atomic* gives both.",
                  difficulty="medium"),
                q("data-race-vs-race-condition-java",
                  "Data race vs race condition — are they the same?",
                  "Data races (memory) vs race conditions (logical ordering). Code examples of each.",
                  difficulty="medium"),
            ],
        },
        # 3 existing + 3 essentials = 6
        "thread-pools-and-executor": {
            "title": "Thread Pools & Executor",
            "questions": [
                q("why-use-thread-pool-java",
                  "Why use thread pools in Java?",
                  "Thread creation cost, bounded concurrency, graceful shutdown — why pools replace new Thread().",
                  difficulty="easy"),
                q("executorservice-thread-pool-types"),
                q("fixed-vs-cached-vs-single-threadpool-java",
                  "FixedThreadPool vs CachedThreadPool vs SingleThreadExecutor",
                  "Compare Executors factories. When each is appropriate (or dangerous).",
                  difficulty="medium"),
                q("threadpool-sizing-cpu-io-bound"),
                q("rejectedexecutionhandler-java",
                  "RejectedExecutionHandler in Java thread pools",
                  "Four built-in rejection policies. When to use each and how to build a custom handler.",
                  difficulty="medium"),
                q("forkjoinpool-recursive-task"),
            ],
        },
        # 2 existing + 3 essentials = 5
        "completable-future": {
            "title": "CompletableFuture",
            "questions": [
                q("what-is-completablefuture-java",
                  "What is CompletableFuture in Java?",
                  "CompletableFuture motivation — from Future to fluent, composable async.",
                  difficulty="easy"),
                q("java-future-vs-completablefuture-comparison"),
                q("completablefuture-chains"),
                q("thencompose-vs-thencombine-java",
                  "thenCompose vs thenCombine in CompletableFuture",
                  "Sequential dependent futures vs independent futures combined.",
                  difficulty="medium"),
                q("completablefuture-exception-handling-java",
                  "Exception handling in CompletableFuture",
                  "handle, exceptionally, whenComplete — differences and chaining with failures.",
                  difficulty="medium"),
            ],
        },
        # 2 existing + 2 essentials = 4
        "concurrent-collections": {
            "title": "Concurrent Collections",
            "questions": [
                q("why-concurrent-collections-java",
                  "Why do we need concurrent collections in Java?",
                  "Thread-safety problems with HashMap/ArrayList. Why Collections.synchronizedMap isn't enough.",
                  difficulty="easy"),
                q("concurrenthashmap-internals"),
                q("blockingqueue-producer-consumer"),
                q("linkedblockingqueue-vs-arrayblockingqueue-java",
                  "LinkedBlockingQueue vs ArrayBlockingQueue in Java",
                  "Bounded vs unbounded, locking strategy, throughput.",
                  difficulty="medium"),
            ],
        },
        # 2 existing + 3 essentials = 5
        "concurrency-patterns": {
            "title": "Concurrency Patterns",
            "questions": [
                q("producer-consumer-pattern-java",
                  "Producer-consumer pattern in Java",
                  "Implement producer-consumer using BlockingQueue and via wait/notify.",
                  difficulty="medium"),
                q("countdownlatch-vs-cyclicbarrier-vs-semaphore"),
                q("threadlocal-use-cases-pitfalls"),
                q("double-checked-locking-java",
                  "Double-checked locking pattern in Java",
                  "DCL pitfalls pre-Java 5, the volatile fix, and modern alternatives (Holder idiom).",
                  difficulty="hard"),
                q("thread-safe-singleton-patterns-java",
                  "Thread-safe singleton patterns in Java",
                  "Enum singleton, initialization-on-demand holder, DCL, eager init — trade-offs.",
                  difficulty="medium"),
            ],
        },
        # 1 existing + 3 essentials = 4
        "virtual-threads": {
            "title": "Virtual Threads",
            "questions": [
                q("what-are-virtual-threads-java-21",
                  "What are virtual threads in Java 21?",
                  "Project Loom introduction. Lightweight threads scheduled by JVM onto carrier threads.",
                  difficulty="medium"),
                q("java21-virtual-threads-structured-concurrency"),
                q("when-to-use-virtual-threads-java",
                  "When should you use virtual threads in Java?",
                  "Best-fit workloads (blocking I/O, high concurrency); bad fits (CPU-bound, synchronized blocks).",
                  difficulty="medium"),
                q("virtual-threads-pinning-problem-java",
                  "Virtual threads pinning problem in Java",
                  "When virtual threads pin to a carrier (synchronized, native frames) and how to avoid.",
                  difficulty="hard"),
            ],
        },
        # 3 existing + 2 essentials = 5
        "scenario-based": {
            "title": "Scenario-based",
            "questions": [
                q("parallel-streams-when-they-help-vs-hurt"),
                q("race-condition-identify-and-fix"),
                q("liveness-hazards-deadlock-livelock-starvation"),
                q("how-to-detect-deadlock-java-thread-dump",
                  "How do you detect deadlock in Java using a thread dump?",
                  "Reading jstack / kill -3 output to find deadlocks. JMX ThreadMXBean APIs.",
                  difficulty="medium"),
                q("how-to-avoid-deadlock-java",
                  "How do you avoid deadlock in Java?",
                  "Lock ordering, tryLock with timeout, open calls, design techniques.",
                  difficulty="medium"),
            ],
        },
        # Empty → 3 non-redundant comparisons
        "comparisons": {
            "title": "Comparisons",
            "questions": [
                q("future-vs-completablefuture-comparison",
                  "Future vs CompletableFuture — comparison",
                  "Blocking vs non-blocking, composition, exception handling.",
                  difficulty="medium"),
                q("volatile-vs-synchronized-comparison",
                  "volatile vs synchronized — comparison",
                  "Visibility vs atomicity. When volatile is enough and when it isn't.",
                  difficulty="medium"),
                q("virtual-vs-platform-threads-comparison",
                  "Virtual threads vs platform threads — comparison",
                  "Full side-by-side comparison: footprint, cost, compatibility.",
                  difficulty="medium"),
            ],
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# MODULE 05 — JVM INTERNALS & PERFORMANCE
# ═══════════════════════════════════════════════════════════════════════════

JVM_INTERNALS = {
    "moduleSlug": "jvm-internals",
    "topicOrder": [
        "jvm-architecture",
        "garbage-collection",
        "memory-analysis",
        "jvm-tuning",
        "profiling-and-debugging",
        "scenario-based",
        "comparisons",
    ],
    "topics": {
        # 3 existing + 3 essentials = 6
        "jvm-architecture": {
            "title": "JVM Architecture",
            "questions": [
                q("jvm-jre-jdk-difference",
                  "What is the difference between JVM, JRE, and JDK?",
                  "Disambiguate JVM vs JRE vs JDK with a clear diagram.",
                  difficulty="easy"),
                q("jvm-memory-areas"),
                q("heap-vs-stack-memory-java",
                  "Heap vs stack memory in the JVM",
                  "What lives in heap vs stack. Lifetime, OOM vs StackOverflow.",
                  difficulty="easy"),
                q("metaspace-vs-permgen-java-8",
                  "Metaspace vs PermGen in Java 8",
                  "Why PermGen was removed and what Metaspace does differently.",
                  difficulty="medium"),
                q("classloader-hierarchy"),
                q("jit-compilation-tiered-compilation"),
            ],
        },
        # 2 existing + 4 essentials = 6
        "garbage-collection": {
            "title": "Garbage Collection",
            "questions": [
                q("what-is-garbage-collection-java",
                  "What is garbage collection in Java?",
                  "Why Java has GC. Reachability, strong/weak/soft references overview.",
                  difficulty="easy"),
                q("generational-gc-young-old-java",
                  "Generational garbage collection in Java (young vs old gen)",
                  "Weak generational hypothesis. Eden, Survivor, Tenured. Promotion criteria.",
                  difficulty="medium"),
                q("gc-algorithms-comparison"),
                q("g1-vs-cms-gc-java",
                  "G1 GC vs CMS GC in Java",
                  "Region-based G1 vs mostly-concurrent CMS. Why CMS was deprecated.",
                  difficulty="hard"),
                q("zgc-shenandoah-low-latency-gc-java",
                  "ZGC and Shenandoah — low-latency GC in Java",
                  "Concurrent compaction and sub-millisecond pauses. Configuration basics.",
                  difficulty="hard"),
                q("gc-tuning-gclog-analysis"),
                q("full-gc-vs-minor-gc-java",
                  "Full GC vs Minor GC in Java — what's the difference?",
                  "Minor, major, and full GC semantics. How to spot each in GC logs.",
                  difficulty="medium"),
            ],
        },
        # 2 existing + 2 essentials = 4
        "memory-analysis": {
            "title": "Memory Analysis",
            "questions": [
                q("memory-leak-detection-heap-dump"),
                q("java-stackoverflow-vs-outofmemoryerror"),
                q("heap-dump-analysis-mat-eclipse-java",
                  "Heap dump analysis with Eclipse MAT",
                  "How to take and analyze heap dumps. Dominator tree and leak suspects.",
                  difficulty="hard"),
                q("how-to-find-memory-leak-java-production",
                  "How do you find a memory leak in Java production?",
                  "Systematic leak hunt: GC logs → heap dump → dominator tree → fix verification.",
                  difficulty="hard"),
            ],
        },
        # 2 existing + 2 essentials = 4
        "jvm-tuning": {
            "title": "JVM Tuning",
            "questions": [
                q("jvm-flags-xms-xmx-java",
                  "JVM flags — -Xms, -Xmx, and friends",
                  "Essential heap-sizing flags. -XX flags categories and how to inspect effective values.",
                  difficulty="easy"),
                q("jvm-startup-optimization-virtual-threads"),
                q("spring-boot-jvm-container-settings"),
                q("tuning-jvm-microservices-containers-java",
                  "Tuning JVM for microservices in containers",
                  "Container awareness flags, MaxRAMPercentage, and CPU quota interactions.",
                  difficulty="hard"),
            ],
        },
        # 2 existing + 2 essentials = 4
        "profiling-and-debugging": {
            "title": "Profiling & Debugging",
            "questions": [
                q("how-to-profile-java-application",
                  "How do you profile a Java application?",
                  "Sampling vs instrumenting profilers. Async-profiler quickstart.",
                  difficulty="medium"),
                q("java-profiling-async-profiler"),
                q("thread-dumps-deadlock-analysis"),
                q("jfr-java-flight-recorder",
                  "Java Flight Recorder (JFR) — what is it?",
                  "JFR for continuous profiling with minimal overhead. Capturing and analyzing recordings.",
                  difficulty="medium"),
            ],
        },
        # 4 existing + 2 essentials = 6
        "scenario-based": {
            "title": "Scenario-based",
            "questions": [
                q("how-to-investigate-oom-in-production-java",
                  "How do you investigate an OutOfMemoryError in production?",
                  "Playbook: logs → heap dump on OOM → MAT analysis → reproduce → fix.",
                  difficulty="hard"),
                q("how-to-reduce-gc-pause-time-java",
                  "How do you reduce GC pause times in Java?",
                  "Allocation reduction, GC algorithm choice (G1/ZGC), heap sizing, tuning flags.",
                  difficulty="hard"),
                q("java-reflection-performance"),
                q("java-nio-vs-traditional-io"),
                q("java-module-system-jpms"),
                q("annotation-processing-runtime"),
            ],
        },
        # Empty → 2 non-redundant comparisons
        "comparisons": {
            "title": "Comparisons",
            "questions": [
                q("minor-gc-vs-full-gc-comparison",
                  "Minor GC vs Full GC — comparison",
                  "Scope, pause duration, causes, log signatures.",
                  difficulty="medium"),
                q("aot-vs-jit-compilation-comparison",
                  "AOT vs JIT compilation — comparison",
                  "Startup time, peak throughput, memory, and development trade-offs.",
                  difficulty="medium"),
            ],
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════

def main() -> None:
    blueprint = {
        "pillarNumber": 1,
        "pillarName": "Java Language",
        "domainSlug": "java-backend-intermediate",
        "description": "Foundational Java — OOP, collections, streams, concurrency, JVM. Focused, not filler.",
        "modules": [
            CORE_JAVA,
            JAVA_COLLECTIONS,
            JAVA_STREAMS,
            JAVA_CONCURRENCY,
            JVM_INTERNALS,
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(blueprint, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    total_q = 0
    for m in blueprint["modules"]:
        mq = sum(len(t["questions"]) for t in m["topics"].values())
        total_q += mq
        per_topic = ", ".join(f"{t}={len(m['topics'][t]['questions'])}" for t in m["topicOrder"])
        print(f"  {m['moduleSlug']:18s}  total={mq:>3}  ({per_topic})")
    print(f"\n  Pillar 1 total: {total_q} questions")
    print(f"  wrote: {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
