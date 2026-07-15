# Audit — spring-boot

**Pillar:** P02 Spring Ecosystem
**Module:** M07 spring-boot
**Topics present:** 9 (of 10 — `starters` has 0 questions)
**Questions:** 29 (all written, no stubs)
**Benchmark sources:** Baeldung ("Spring Boot Auto-Configuration", "Spring Boot Annotations"), GeeksforGeeks ("Spring Boot Interview Questions"), Spring official reference, Java67, JavaTechOnline, HowToDoInJava

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Bold anchors in the opener — `**Auto-configuration**` / `**@SpringBootApplication**` / `**starter**` called out in the first paragraph | **Failing across the whole module** — 0 of 29 `direct_answer`s have bold anchors |
| Analogies for abstract concepts (auto-config = "chef following a recipe based on what's in your pantry", startup = "assembly line", starter = "curated shopping list") | **Failing across the whole module** — 0 of 29 Zone 3s have detected analogies |
| Code snippets on every Spring Boot concept — never prose-only | **Failing for 8 questions** — substantive Zone 3 (>400 words) with zero code blocks |
| "When you should reach for X" + "when not to" decision block | Present — the `when_to_use` section carries this well where it appears |
| Bullets-under-subheaders for "how I'd answer" content | Matches — module is consistent here (all 20 non-property Qs use this shape) |
| `profiles-and-properties` on benchmark sites is usually presented as a **table of common properties + when-to-tune** followed by individual property deep-dives, not 10 standalone questions | Our 10 property Qs are ultra-narrow (1 property each) and use a completely different schema from the rest of the module |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | SCHEMA DRIFT | **CRITICAL** | **All 10 questions in `profiles-and-properties`** use an abandoned schema: sections are `[interviewer_expectation, speakable_answer, deep_explanation]`; every other topic uses `[overview, ..., key_points, speakable_answer]`. These 10 Qs are missing `direct_answer`, `key_points`, and have incomplete `interviewer_intent`. They should either be migrated to the standard schema or consolidated into 1 "common application.properties tuning" question. |
| S2 | MISSING TOPIC | **MAJOR** | **`starters` topic has 0 questions.** Standard interview territory: "how does `spring-boot-starter-web` work, what's inside it, how do you author a custom starter". Should have at least 2 questions (what a starter is + authoring a custom one). |
| S3 | MODULE-WIDE ZONE 1 PATTERN | **MAJOR** | 29 of 29 `direct_answer`s have **zero bold anchors**. 11 of 29 are paragraph walls (>60 words, no bold). Zone 1's entire purpose is 30-second scanability — flowing prose defeats that. This is fixable as a single batch pass: add `**bold**` to the 2–3 key terms in each direct answer. |
| S4 | MODULE-WIDE ZONE 3 PATTERN | **MODERATE** | 26 of 29 Zone 3s have no analogy. For a framework module this abstract (DI lifecycle, auto-config, startup phases), analogies are how Baeldung and GFG carry the reader. Not every question needs one — but auto-config, startup sequence, and `@SpringBootApplication` definitely do. |
| S5 | MISSING COMPARISON | **MINOR** | No `spring-boot-vs-spring-cloud` question. Common interview follow-up to `spring-boot-vs-spring-framework` (Q1 in comparisons). |

---

## Per-question issues

### Topic: `auto-configuration` (5 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-auto-configuration-internals | Paragraph wall (62w, no bold) — `@EnableAutoConfiguration`, `spring.factories`/`AutoConfiguration.imports`, `@Conditional` should all be bold-anchored | ✓ bulleted-subheaders shape is good | **No code examples** — 686-word Zone 3 explaining `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` without showing a single `@Conditional` snippet. Every top source demonstrates these. Also missing analogy (standard one: "Spring Boot checks your pantry before picking a recipe") | **CRITICAL (content gap)** |
| **Q2** spring-boot-startup-sequence | No bold anchors (49w) — phases should be anchored (`SpringApplication.run()` → `prepareEnvironment()` → `createApplicationContext()` → `refreshContext()`) | ✓ | 651w Zone 3 with no code. Should show the `SpringApplication.run` → listeners → refresh flow, at least a `SpringApplicationRunListener` snippet. Analogy present (good) | MODERATE |
| **Q3** spring-boot-application-annotation | No bold anchors (48w) — should anchor `@SpringBootApplication` as the union of `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan` | ✓ | 578w Zone 3 with no code. Every benchmark source shows the decomposition: manually applying the three annotations vs using the meta-annotation. Must-have code. No analogy | **MAJOR** |
| **Q4** custom-auto-configuration-spring-factories | No bold anchors (51w) — `@AutoConfiguration`, `spring.factories` (Boot 2.7−), `AutoConfiguration.imports` (Boot 3+), `@AutoConfigureBefore`/`After` | ✓ | 694w Zone 3 with 3 code blocks — **best-covered question in module**. Only polish needed: the Boot 3+ migration from `spring.factories` → `META-INF/spring/…AutoConfiguration.imports` is the #1 interview trap on this topic; confirm it's called out | MINOR |
| **Q5** spring-boot-startup-customization | Paragraph wall (67w, no bold) — `SpringApplicationBuilder`, `ApplicationRunner`, `ApplicationListener`, `EnvironmentPostProcessor` should be anchored | ✓ | 691w / 1 code block — could use one more snippet showing `SpringApplicationBuilder` fluent chain alongside the runner snippet | MINOR |

### Topic: `profiles-and-properties` (10 questions)

All 10 questions share the same structural failure. Decision required before per-question review:

**Option A** — migrate schema: rewrite each question with `direct_answer`, `key_points`, the standard Zone 3 section types, and complete `interviewer_intent`. 10 × full rewrite.

**Option B** — consolidate: collapse the 10 narrow per-property questions into **2 broader questions**:
1. "How do you structure `application.properties` / YAML / env-var layering in a Spring Boot app?" (covers profiles, property sources, `@ConfigurationProperties`)
2. "How do you tune the critical Spring Boot runtime properties (HikariCP, Tomcat threads, JPA)?" (covers HikariCP pool, Tomcat `max-threads`, `max-connections`, `connection-timeout`, `ddl-auto`, `show-sql`)

The individual property questions (`server.port`, `context-path`) are too thin to stand alone and read as flashcards rather than interview-grade answers on benchmark sites.

**Recommendation: Option B.** This topic is currently 34% of the module by question count but <15% by useful content.

Per-question snapshot (all 10 share the same schema drift — no point in repeating it ten times):

| Q | Topic | Current size | Recommendation |
|---|---|---|---|
| Q1 | server-port | 84w speak / 107w deep | Merge into consolidated Q1 |
| Q2 | datasource-properties | 82w / 97w | Merge into consolidated Q1 |
| Q3 | hikari-pool-config | 137w / 111w | Merge into consolidated Q2 (has most substance) |
| Q4 | jpa-properties | 114w / 126w | Merge into consolidated Q2 |
| Q5 | ddl-auto | 133w / 183w | Merge into consolidated Q2 — keep the `create-drop` vs `none` production-safety angle |
| Q6 | context-path | 116w / 102w | Merge into consolidated Q1 |
| Q7 | max-threads | 116w / 157w | Merge into consolidated Q2 |
| Q8 | show-sql | 122w / 126w | Merge into consolidated Q2 |
| Q9 | max-connections | 128w / 150w | Merge into consolidated Q2 |
| Q10 | connection-timeout | 121w / 112w | Merge into consolidated Q2 |

### Topic: `starters` (0 questions)

**CRITICAL — missing topic content.** Suggest authoring 2 questions:
- `spring-boot-starter-internals` — what a starter is, how `spring-boot-starter-web` pulls in Tomcat + Jackson + Spring MVC, how starters compose with auto-configuration
- `authoring-a-custom-starter` — the 3 pieces: autoconfig class, `AutoConfiguration.imports`, the starter POM that pulls in the autoconfig jar + dependencies

### Topic: `actuator` (1 question)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-actuator-endpoints-security | Paragraph wall (61w, no bold) — `/actuator/health`, `/actuator/info`, `/actuator/metrics`, `management.endpoints.web.exposure.include`, `management.endpoint.health.show-details` should be anchored | ✓ | 547w / 1 code block — good. Needs one more snippet: a Spring Security config that protects `/actuator/**` while leaving `/actuator/health` open — the #1 production pattern | MODERATE |

**Module gap:** only one actuator question in a topic that has easily 3–4 standard interview angles. Consider adding:
- Custom `@Endpoint` / `@ReadOperation` question
- Actuator in production behind Prometheus / Micrometer (overlaps with observability module — check before writing)

### Topic: `embedded-servers` (1 question)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-embedded-server-configuration | Paragraph wall (68w, no bold) — `Tomcat` (default), `Jetty`, `Undertow`, `server.port`, `server.tomcat.*`, `WebServerFactoryCustomizer` should be anchored | ✓ | 634w / 1 code block — good comparison table. Analogy missing (helpful here: "embedded server is the app bringing its own kitchen instead of renting one") | MODERATE |

### Topic: `configuration-management` (3 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** application-properties-vs-yml-vs-env-vars | Paragraph wall (70w, no bold) | ✓ | 521w / **0 code blocks** — a property-file comparison with zero examples of the three formats side-by-side is the one thing a reader needs. Must-have fix | **MAJOR** |
| **Q2** configuration-properties-vs-value | Paragraph wall (64w, no bold) — `@ConfigurationProperties`, `@Value`, `@Validated`, `@ConstructorBinding` | ✓ | 409w / **0 code blocks** — same problem as Q1. Every benchmark source side-by-sides a `@Value("${x}")` field with a `@ConfigurationProperties("app")` record. Must-have fix | **MAJOR** |
| **Q3** spring-boot-logging-configuration | No bold anchors (50w) — `Logback` (default), `logging.level.*`, `logging.pattern.*`, `logback-spring.xml` | ✓ | 495w / 2 code blocks — good. Missing analogy but not critical here | MINOR |

### Topic: `testing` (1 question)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-testing-slices-context-caching | Paragraph wall (71w, no bold) — `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, `@MockBean` vs `@Mock`, context cache | ✓ | 502w / **0 code blocks** — testing content with zero test-method examples. `@WebMvcTest` + `MockMvc` snippet is the table-stakes demonstration here | **MAJOR** |

**Module gap:** only one testing question in Spring Boot. Testcontainers integration (`@Testcontainers`, `@DynamicPropertySource`) is a top interview topic and belongs here or in `advanced-testing` (M24, currently empty). Decide now to avoid cross-module duplication later.

### Topic: `troubleshooting` (2 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-graceful-shutdown | Paragraph wall (64w, no bold) — `server.shutdown=graceful`, `spring.lifecycle.timeout-per-shutdown-phase`, `@PreDestroy`, `SmartLifecycle` | ✓ | 694w / 1 code block — good depth. Missing analogy | MINOR |
| **Q2** global-exception-handling-spring-boot | No bold anchors (53w) — `@ControllerAdvice`, `@RestControllerAdvice`, `@ExceptionHandler`, `ResponseEntityExceptionHandler`, `ProblemDetail` (Boot 3+) | ✓ | 508w / 2 code blocks — solid. `ProblemDetail` / RFC 7807 is the current best-practice angle — check it's called out | MINOR |

### Topic: `scenario-based` (5 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-docker-layered-jars | Paragraph wall (67w, no bold) — `spring-boot-maven-plugin`, `layertools`, `Dockerfile` multi-stage | ✓ | 764w / 1 code block — good. Missing analogy | MINOR |
| **Q2** scheduled-annotation-spring-boot | No bold anchors (60w) — `@Scheduled`, `@EnableScheduling`, `fixedRate` vs `fixedDelay` vs `cron`, `TaskScheduler` vs `ScheduledExecutorService` | ✓ | 736w / 2 code blocks — solid. Missing the "default thread pool is 1 thread" trap | MINOR |
| **Q3** async-annotation-spring-boot | Paragraph wall (65w, no bold) — `@Async`, `@EnableAsync`, `ThreadPoolTaskExecutor`, `Future`/`CompletableFuture`, self-invocation trap | ✓ | 733w / 1 code block — good. Missing analogy | MINOR |
| **Q4** commandlinerunner-applicationrunner | No bold anchors (48w) — `CommandLineRunner`, `ApplicationRunner`, `@Order` | ✓ (has recommendation + analogy — **best-shaped question in module**) | ✓ 468w / 1 code block / analogy present | MINOR |
| **Q5** spring-boot-devtools | No bold anchors (58w) — `spring-boot-devtools`, `LiveReload`, restart classloader, `spring.devtools.restart.exclude` | ✓ | 506w / **0 code blocks** — DevTools is primarily configured in `pom.xml` + `application.properties`; showing the dependency declaration + exclude config is standard | MODERATE |

### Topic: `comparisons` (1 question)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-boot-vs-spring-framework-difference | No bold anchors (57w) — `Spring Framework` vs `Spring Boot`, opinionated auto-config, embedded server, starters | ✓ 200w + analogy | 560w / 1 code block — solid | MINOR |

**Missing comparison:** `spring-boot-vs-spring-cloud` (flagged in S5).

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL (content-breaking)** | **11** | 10 from `profiles-and-properties` schema drift (S1) + Q1 auto-config missing code |
| **MAJOR** | **5** | Q3 `@SpringBootApplication` no code, Q1/Q2 config-mgmt no code, Q1 testing no code, S2 starters topic empty |
| **MODERATE** | **5** | Q2 startup-sequence, Q1 actuator, Q1 embedded-servers, Q5 devtools, S4 module-wide analogy gap |
| **MINOR** | **9** | Various polish — mostly bold-anchor additions and one-snippet additions |
| **CLEAN** | **0** | No question is currently free of at least a minor issue |

## Most common issue codes (auto-detected)

- `zone3_no_analogy` × 26
- `zone1_direct_answer_paragraph_wall` × 11
- `zone1_direct_answer_no_bold_anchors` × 10
- `zone1_no_direct_answer` × 10 (all in `profiles-and-properties`)
- `zone1_no_key_points` × 10 (all in `profiles-and-properties`)
- `zone1_interviewer_intent_incomplete` × 10 (all in `profiles-and-properties`)
- `zone3_no_code_examples` × 8

---

## Suggested fix order

1. **Decide on `profiles-and-properties`** — merge down to 2 consolidated questions or migrate all 10 to standard schema. I recommend merging. This alone removes 30 of the 76 structural issues in this module.
2. **Author `starters` topic** (2 new questions) — fills a real interview gap.
3. **Fix the 4 CRITICAL/MAJOR code-missing Zone 3s** — auto-config-internals, `@SpringBootApplication`, config format comparison, testing-slices. These are where reading the answer without code leaves the reader unable to actually use the concept.
4. **Module-wide bold-anchor pass** — for the remaining 19 questions after step 1, single-pass fix of Zone 1 bold anchors using the bolded terms I listed above. Mechanical, high-impact, ~30 min of work.
5. **Analogy additions** — only where the abstraction genuinely benefits (auto-config, startup sequence, embedded servers, `@SpringBootApplication`). Don't force analogies into concrete topics like `@Scheduled` or devtools.
6. **Missing comparison + testcontainers question** — at author's discretion; calling out for tracking.
