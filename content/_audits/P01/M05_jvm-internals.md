# Audit — jvm-internals

**Pillar:** P01 Core Java
**Module:** M05 jvm-internals
**Topics present:** 7
**Questions:** 33 total → **15 written + 18 STUBS (55% unwritten)**
**Benchmark sources:** "Java Performance" (Scott Oaks), OpenJDK documentation, Aleksey Shipilev on JMM + GC, Charlie Hunt's "Java Performance", jetbrains.com/help/idea/analyze-profile, async-profiler docs, Java Flight Recorder manual

---

## Biggest finding — 55% stubs, concentrated in garbage-collection

**18 of 33 questions are stubs (55%).** Stub distribution:

- **garbage-collection: 5 of 7 stubs (71%)** — including "what is GC", generational-gc, G1-vs-CMS, ZGC/Shenandoah, full-vs-minor-gc. Modern GC choice (G1 default, ZGC for low-latency) is a top 2024+ interview topic
- **jvm-architecture: 3 of 6 stubs** — including JDK/JRE/JVM difference (textbook opener), heap-vs-stack, metaspace-vs-permgen
- **comparisons: 2 of 2 stubs (100%)**
- **scenario-based: 2 of 6 stubs** — "how to investigate OOM in production" and "how to reduce GC pause time" are both classic senior interview questions
- **memory-analysis: 2 of 4 stubs** — heap dump analysis (MAT), how to find memory leak in production
- **profiling-and-debugging: 2 of 4 stubs** — "how to profile a Java app", JFR

This is the second stub-heavy module after M04 java-concurrency (44% stubs).

---

## Biggest finding — written content is code-empty

Of the 15 written questions, **8 have zero code blocks**. For JVM content where commands, flags, and tool output are the native expression (`jstat -gc`, `-XX:+PrintGCDetails`, jcmd, jstack, async-profiler invocations), this is archetype-fail. Worst offenders:

- Q2 `jvm-memory-areas` — memory layout Q without showing `-Xmx`, `-Xms` flags or heap dump output
- Q5 `classloader-hierarchy` — 402w explaining the chain without showing a custom ClassLoader example or bootstrap/platform/app classpath output
- Q6 `jit-compilation-tiered-compilation` — 428w on JIT without showing `-XX:+PrintCompilation` output or C1/C2 flag usage
- Q3 `gc-algorithms-comparison` — 422w on GC comparison without showing GC log snippets
- Q1 memory-analysis — heap dump detection without `jmap`, `jcmd GC.heap_dump`, or OQL snippet
- Q4 scenario java-nio-vs-traditional-io — 456w comparing NIO to IO without showing the Channel/Buffer code vs InputStream code

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| JVM questions always show the relevant `-XX` / `-X` flag or `jcmd` command | **Failing** — 8 of 15 written Qs have zero code |
| GC comparison always includes GC log snippet (`[GC pause (G1 Evacuation Pause) ...]`) | **Failing** — Q3 gc-algorithms is 422w of prose with no log output |
| Memory leak questions show the `jmap -dump`, then MAT / Eclipse analysis, then the fix | **Stubbed** (Q3, Q4 memory-analysis) |
| Thread dump + deadlock content shows `jstack` output with the `Found one Java-level deadlock` marker | Q3 thread-dumps-deadlock-analysis has 2 code — matching |
| Opening bolds the JVM primitive (`**JVM**`, `**heap**`, `**stack**`, `**metaspace**`, `**G1**`, `**ZGC**`) | **Failing** — 15 of 15 direct answers have zero bold anchors |
| JVM content heavily uses analogies (heap = "warehouse", stack = "plates", class loader = "librarian with rule about who can load what", GC = "janitor clearing unused desks") | Only 2 of 15 have detected analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | STUB DEBT | **CRITICAL** | 18 of 33 stubs (55%). Garbage-collection topic is 71% stubs — worst topic-specific concentration in this module |
| S2 | CODE-EMPTY IN JVM CONTENT | **MAJOR** | 8 of 15 written questions have zero code. JVM content WITHOUT flags/commands/log output is not interview-grade |
| S3 | EMPTY COMPARISONS TOPIC | **MAJOR** | 2 of 2 stubs: `minor-gc-vs-full-gc-comparison`, `aot-vs-jit-compilation-comparison`. AOT vs JIT especially relevant in 2024+ (GraalVM native-image, Spring Boot 3 AOT) |
| S4 | MODERN GC COVERAGE GAP | **MAJOR** | ZGC + Shenandoah are stubbed. G1 is the default since Java 9 and ZGC was production-ready in Java 15; these are interview staples now |
| S5 | MODULE-WIDE ZONE 1 | MODERATE | 15 of 15 direct answers have 0 bold anchors; 4 paragraph walls |
| S6 | ANALOGY GAP | MODERATE | 2 of 15 have detected analogies. JVM/memory is the most analogy-friendly topic in Core Java after concurrency |
| S7 | SPEAKABLE LENGTHS THIN | MINOR | Speakables average 177w — shorter than most modules. Content is there but compressed |

---

## Stub map — priority

### Tier 1: Core interview content

| Stub slug | Topic | Why |
|---|---|---|
| `g1-vs-cms-gc-java` | garbage-collection | **Top GC interview question** (why G1 replaced CMS as default in Java 9) |
| `zgc-shenandoah-low-latency-gc-java` | garbage-collection | 2020+ sub-ms GC — heavy interview topic |
| `full-gc-vs-minor-gc-java` | garbage-collection | Foundational |
| `generational-gc-young-old-java` | garbage-collection | Foundational |
| `how-to-investigate-oom-in-production-java` | scenario-based | **Classic senior interview question** — jmap/jcmd/heap dump flow |
| `how-to-reduce-gc-pause-time-java` | scenario-based | Heavy interview question — flags, GC choice, heap sizing |
| `heap-vs-stack-memory-java` | jvm-architecture | Textbook — allocation, GC, thread safety |
| `metaspace-vs-permgen-java-8` | jvm-architecture | Java 8 transition — interview staple |
| `aot-vs-jit-compilation-comparison` | comparisons | GraalVM-era question — hot topic |

### Tier 2: Important but secondary

| Stub slug | Topic |
|---|---|
| `jvm-jre-jdk-difference` | jvm-architecture (topic opener) |
| `what-is-garbage-collection-java` | garbage-collection (topic opener) |
| `jvm-flags-xms-xmx-java` | jvm-tuning (foundational flags) |
| `tuning-jvm-microservices-containers-java` | jvm-tuning (container-aware JVM — Java 10+ behavior) |
| `heap-dump-analysis-mat-eclipse-java` | memory-analysis (MAT tool usage) |
| `how-to-find-memory-leak-java-production` | memory-analysis (production debugging) |
| `how-to-profile-java-application` | profiling-and-debugging (topic opener) |
| `jfr-java-flight-recorder` | profiling-and-debugging (JDK 11+ free, replaces paid JFR) |
| `minor-gc-vs-full-gc-comparison` | comparisons (dup with full-vs-minor above — consolidate) |

---

## Per-question issues — written questions only

### `jvm-architecture` (3 written of 6)

| Q | Issue | Severity |
|---|---|---|
| **Q2** jvm-memory-areas | 375w / **0 code** / no analogy. Must show: `-Xmx`, `-Xms`, `-XX:MetaspaceSize` flags + a mental-model diagram | **MAJOR** |
| **Q5** classloader-hierarchy | Paragraph wall (69w). 402w / **0 code** / analogy present. Must show: bootstrap/platform/application paths, custom ClassLoader example | **MAJOR** |
| **Q6** jit-compilation-tiered-compilation | 428w / **0 code** / no analogy. Must show: `-XX:+PrintCompilation`, C1/C2 distinction, tiered levels 0–4 | **MAJOR** |

### `garbage-collection` (2 written of 7)

| Q | Issue | Severity |
|---|---|---|
| **Q3** gc-algorithms-comparison | 422w / **0 code** / no analogy. A GC comparison with zero GC log snippet or JVM flag example is archetype-fail | **MAJOR** |
| **Q6** gc-tuning-gclog-analysis | 356w / 1 code / no analogy. GC log analysis without a log snippet in Zone 3 is ironic | MODERATE |

### `jvm-tuning` (2 written of 4)

| Q | Issue | Severity |
|---|---|---|
| **Q2** jvm-startup-optimization-virtual-threads | 447w / 1 code / no analogy. AppCDS, tiered compilation, module graph — good JVM-level startup content | MINOR |
| **Q3** spring-boot-jvm-container-settings | 460w / 1 code / analogy — OK | MINOR |

### `memory-analysis` (2 written of 4)

| Q | Issue | Severity |
|---|---|---|
| **Q1** memory-leak-detection-heap-dump | 416w / **0 code** / no analogy. Must show: `jmap -dump:live,format=b,file=heap.hprof <pid>` or `jcmd <pid> GC.heap_dump` | **MAJOR** |
| **Q2** java-stackoverflow-vs-outofmemoryerror | Paragraph wall (64w). 476w / **0 code** / no analogy. Must show: stack-overflow-triggering recursive method + the `OutOfMemoryError: Java heap space` vs `: Metaspace` vs `: GC overhead limit` distinctions | **MAJOR** |

### `profiling-and-debugging` (2 written of 4)

| Q | Issue | Severity |
|---|---|---|
| **Q2** java-profiling-async-profiler | 428w / 2 code / no analogy. Async-profiler commands + flame graph mention — good | MINOR |
| **Q3** thread-dumps-deadlock-analysis | 436w / 2 code / analogy — **well-shaped** | MINOR |

### `scenario-based` (4 written of 6)

| Q | Issue | Severity |
|---|---|---|
| **Q3** java-reflection-performance | Paragraph wall (65w). 343w / 2 code / analogy | MINOR |
| **Q4** java-nio-vs-traditional-io | Paragraph wall (71w). 456w / **0 code** / no analogy. Must show: NIO Channel/Buffer vs classic InputStream code side-by-side | **MAJOR** |
| **Q5** java-module-system-jpms | 375w / 1 code / no analogy. Cross-module overlap with M03 streams java-9 topic | MINOR + OVERLAP |
| **Q6** annotation-processing-runtime | 588w / 1 code / no analogy | MINOR |

### `comparisons` (0 written of 2) — empty

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 stub debt (module-level) |
| **MAJOR** | **8** | S2 code-empty pattern, S3 empty comparisons, S4 modern GC coverage, Q2 memory-areas, Q5 classloader, Q6 JIT, Q3 GC algorithms, Q1 memory-leak, Q2 stackoverflow-vs-oom, Q4 NIO-vs-IO |
| **MODERATE** | **3** | Q6 gc-tuning, S5 bold, S6 analogy |
| **MINOR** | **6** | Well-shaped written questions needing polish |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 15
- `zone3_no_code_examples` × 8
- `zone3_no_analogy` × 13
- `zone1_direct_answer_paragraph_wall` × 4

---

## Suggested fix order

1. **Write Tier 1 stubs** — especially the GC cluster (G1 vs CMS, ZGC/Shenandoah, generational, full-vs-minor) + the 2 scenario-based senior-interview questions (OOM investigation, GC pause reduction).
2. **Add code to the 6 code-empty MAJOR-severity written questions** — memory-areas flags, classloader custom impl, JIT flags, GC algorithms logs, memory-leak jmap commands, NIO-vs-IO code.
3. **Resolve the `minor-gc-vs-full-gc` duplicate** — stub in comparisons topic likely duplicates `full-gc-vs-minor-gc-java` stub in garbage-collection topic. One should be deleted.
4. **Write `aot-vs-jit-compilation-comparison`** — GraalVM-era hot topic.
5. **Fill the 4 memory-analysis + profiling stubs** — heap dump MAT analysis, memory leak production debugging, profiling intro, JFR.
6. **Module-wide bold-anchor pass** — 15 mechanical fixes.
7. **Add analogies to 8–10 questions** — heap, stack, classloader, GC, JIT are the top candidates.
