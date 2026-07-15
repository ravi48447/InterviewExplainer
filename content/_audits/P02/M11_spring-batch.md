# Audit — spring-batch

**Pillar:** P02 Spring Ecosystem
**Module:** M11 spring-batch
**Topics present:** 5 of 10 with content (`chunk-processing`, `job-scheduling-with-quartz`, `scheduled-tasks`, `partitioning-and-parallel-steps`, `scenario-based` empty)
**Questions:** 5 (all written, no stubs)
**Benchmark sources:** Spring Batch reference documentation (docs.spring.io/spring-batch), Michael Minella "Pro Spring Batch", Baeldung Spring Batch series, spring.io guides (creating-batch-service, batch-services)

---

## Biggest finding — the whole module is authored at 1-question-per-topic with zero Zone 3 code

Five questions total — each in its own topic — and **every single one of them has 0 code blocks in Zone 3**. Spring Batch is a code-heavy framework (Job builders, Step builders, ItemReader/Processor/Writer classes, chunk config, `@EnableBatchProcessing`); a module where 5 of 5 long-form answers have no code is not interview-grade.

This is almost certainly a pattern-authoring artifact: the questions were drafted against a template that produced `overview` / `phase` / `step` / `benefits` sections but skipped the `code_example` section, resulting in a uniform-looking but code-empty module.

All five Zone 3s are 519–825 words — substantial prose — so the gap is specifically code, not depth.

---

## Biggest finding — five topics are empty, including core ones

The module's `_index.json` defines 10 topics but only 5 have any content. Empty topics:

- **`chunk-processing`** — chunk-oriented processing is the central Spring Batch abstraction and belongs in its own topic, not folded into the item-reader-writer-processor question
- **`job-scheduling-with-quartz`** — Quartz + Spring Batch is a standard interview scenario
- **`scheduled-tasks`** — `@Scheduled` + cron + fixedDelay/fixedRate
- **`partitioning-and-parallel-steps`** — partitioning, remote-chunking, multi-threaded step — all distinct patterns with interview weight
- **`scenario-based`** — design problems ("design a nightly ETL", "a job failed halfway through processing 1M rows")

The topics are declared, so these are planned-but-never-authored gaps, not out-of-scope.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Spring Batch questions show the `JobBuilder` / `StepBuilder` fluent API code | **Failing** — 5 of 5 have zero code |
| Reader/Processor/Writer Qs show at least an `ItemReader<Customer>` interface example | **Failing** — Q1 item-reader topic has 825w but 0 code |
| Retry/skip Qs show `.faultTolerant().retryLimit(3).retry(MyException.class)` fluent chain | **Failing** — Q1 batch-error-handling has 704w, 0 code |
| Job parameters shown as `@Value("#{jobParameters['inputFile']}")` + restart semantics | **Failing** — Q1 job-step-structure has 779w, 0 code |
| Analogies common (chunk = "assembly line with batch size", job = "recipe", step = "stage", tasklet = "one-shot task") | Only 1 of 5 (Q1 job-structure) has a detected analogy |
| Opening bolds the Spring Batch primitive (`**Job**`, `**Step**`, `**Chunk**`, `**Tasklet**`) | **Failing** — 5 of 5 direct answers have zero bold anchors |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | ZERO CODE IN ZONE 3 MODULE-WIDE | **CRITICAL** | 5 of 5 questions with 519–825w Zone 3s have 0 code blocks. For Spring Batch this is archetype-fail |
| S2 | FIVE EMPTY TOPICS | **MAJOR** | `chunk-processing`, `job-scheduling-with-quartz`, `scheduled-tasks`, `partitioning-and-parallel-steps`, `scenario-based` all empty |
| S3 | MODULE IS 1-Q-PER-TOPIC | **MAJOR** | 5 topics × 1 Q = thin coverage. Real module should be 15–20 Qs across 8–10 topics to match interview breadth |
| S4 | DIRECT ANSWER PARAGRAPH WALLS | **MODERATE** | 3 of 5 direct answers are paragraph walls (Q1 fundamentals 68w, Q1 error-handling 70w, Q1 comparisons 62w) |
| S5 | MODULE-WIDE ZONE 1 | MODERATE | 5 of 5 direct answers have 0 bold anchors |
| S6 | ANALOGY GAP | MINOR | 4 of 5 lack analogies. Spring Batch is analogy-friendly (assembly line is the classic) |
| S7 | EMPTY COMPARISONS (almost) | MINOR | Technically `comparisons` has 1 Q (`spring-batch-vs-spring-integration`), but no other comparison content like `tasklet-vs-chunk` or `job-vs-step` |

---

## Per-question issues

### `batch-fundamentals` → `spring-batch-core-concepts-job-step-chunk-tasklet`

- Paragraph-wall direct answer (68w)
- 800w Zone 3 with **0 code**
- No analogy
- **Must show**: `JobBuilder` chain creating a Job with a Step, a chunk-oriented `Step` with reader/processor/writer + chunk size, a Tasklet-style Step for contrast
- Severity: **MAJOR** (largest Zone 3 in module with no code)

### `job-and-step-structure` → `spring-batch-job-parameters-restart-failed-jobs`

- 779w Zone 3 with **0 code**, analogy present
- **Must show**: `@Value("#{jobParameters['inputFile']}")` injection, `JobLauncher` with `JobParametersBuilder`, Job `RestartableJobFailedException` / `preventRestart()` / restart semantics with execution ID
- Severity: **MAJOR**

### `item-reader-writer-processor` → `spring-batch-itemreader-itemprocessor-itemwriter-chunk-processing`

- 825w Zone 3 with **0 code**, no analogy
- **Must show**: a `FlatFileItemReader<Customer>` with `LineMapper`, a custom `ItemProcessor<Customer,Customer>` filtering/transforming, a `JdbcBatchItemWriter` + chunk-size config
- Severity: **MAJOR**

### `batch-error-handling` → `spring-batch-retry-skip-logic`

- Paragraph-wall (70w), 704w Zone 3 with **0 code**, no analogy
- **Must show**: `.faultTolerant().retryLimit(3).retry(IOException.class).skipLimit(10).skip(FlatFileParseException.class)` + `SkipListener` / `RetryListener` hooks
- Severity: **MAJOR**

### `comparisons` → `spring-batch-vs-spring-integration`

- Paragraph-wall (62w), 519w Zone 3 with **0 code**, no analogy
- **Must show**: a Spring Batch Job snippet vs a Spring Integration flow (`IntegrationFlows.from(...).handle(...)`) to make the comparison concrete
- Severity: **MAJOR** (comparison questions without side-by-side artifacts fail the archetype)

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 module-wide zero-code pattern |
| **MAJOR** | **7** | S2 empty topics, S3 1-Q-per-topic thinness, + 5 per-question code-missing |
| **MODERATE** | **2** | S4 paragraph walls, S5 bold anchors |
| **MINOR** | **2** | S6 analogies, S7 near-empty comparisons |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone3_no_code_examples` × 5 (100% of written Qs)
- `zone1_direct_answer_no_bold_anchors` × 5
- `zone3_no_analogy` × 4
- `zone1_direct_answer_paragraph_wall` × 3

---

## Suggested fix order

1. **Code-inject all 5 existing questions** — each needs 1–3 code blocks matching the archetype (JobBuilder + StepBuilder fluent chains). This alone raises the module from unusable to interview-credible.
2. **Author `chunk-processing` topic** — the single most important missing Spring Batch topic (chunk vs tasklet, commit interval, chunk listener).
3. **Author `partitioning-and-parallel-steps` topic** — 2–3 Qs (partitioned step, multi-threaded step, remote chunking).
4. **Author `job-scheduling-with-quartz` + `scheduled-tasks`** — 2–3 Qs combined (cron scheduling, `@EnableScheduling`, Quartz integration).
5. **Author `scenario-based` topic** — 2–3 Qs ("design a nightly ETL", "job failed at row 500k of 1M how do you restart", "add retry/skip for flaky external API").
6. **Fix Zone 1 paragraph walls + add bold anchors** (5 mechanical edits).
7. **Add analogies** — assembly-line (chunk), recipe (job), stage (step), one-shot (tasklet), checkpoint (commit interval).

---

## Scope decision needed

Spring Batch has 5 Qs in this module vs Spring Core (22), Spring Boot (29), Spring Data JPA (25). If Spring Batch is deemed a **nice-to-know** for a Java Backend Intermediate target, the module is understandably thin. If it's **must-know** (enterprise-batch-heavy shops — banks, telcos, insurance), it needs 15–20 Qs across 8–10 topics. Recommend discussing target scope before authoring more content here.
