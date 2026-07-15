# Audit — unit-testing

**Pillar:** P08 Testing Strategy
**Module:** M23 unit-testing
**Topics present:** 6 of 8 (`scenario-based`, `comparisons` empty)
**Questions:** 22 (all written, no stubs)
**Benchmark sources:** "Effective Unit Testing" (Lasse Koskela), "Growing Object-Oriented Software, Guided by Tests" (GOOS — Freeman & Pryce), Baeldung JUnit 5 / Mockito / Testcontainers series, junit.org/junit5 user guide, site.mockito.org, testcontainers.com/guides, Martin Fowler on TestPyramid + TestDouble

---

## Biggest finding — likely duplicate questions hiding behind different slugs

Auditor flagged only 1 overlap (`mockito-mock-spy-mockbean` vs `mockito-mock-spy-verify-argumentcaptor`, Jaccard 0.5). But the signals show **at least 4 more duplicate-looking pairs** where two Qs have identical Zone 3 word count and code-block count — a strong fingerprint of "same content, different slug":

| Pair | Shared Zone 3 shape | Topic | Verdict |
|---|---|---|---|
| Q3 `tdd-red-green-refactor` + Q4 `test-driven-development-tdd-java` | 489w / 2 code — identical | unit-testing-basics | **Very likely duplicate** |
| Q2 `parameterized-test-method-source` + Q6 `parameterized-tests-junit5` | 377w / 3 code — identical | unit-testing-basics | **Very likely duplicate** |
| Q2 `mockmvc-controller-testing` + Q5 `mockmvc-testing-controllers` | 438w / 2 code — identical | spring-boot-testing | **Very likely duplicate** |
| Q2 `testcontainers-real-database-integration` + Q3 `testcontainers-spring-boot` | 443w / 1 code — identical | testcontainers | **Very likely duplicate** |
| Q1 `mockito-mock-spy-mockbean` + Q2 `mockito-mock-spy-verify-argumentcaptor` (auto-detected) | 449w/3 vs 357w/2 | mocking-with-mockito | Topic overlap — separate verdicts possible |

These pairs share exact Zone 3 word counts and code-block counts which almost certainly means identical content was saved under two slugs. Needs manual diff + consolidation. If confirmed, the real module question count is **17–18, not 22**.

---

## Biggest finding — module-wide Zone 2 shorts

**9 of 22 Qs have `zone2_speakable_short`** (speakable under ~130w). For a domain where the interview answer is "what's your testing strategy?" and "walk me through your mocking approach", 101–130w speakables are too compressed. Typical internet-tone benchmark answers (Baeldung, GOOS): 180–260w speakable covering the what / example / when to use.

---

## Biggest finding — thin Mockito coverage

Mockito is the single most-asked Java testing library in interviews. The `mocking-with-mockito` topic has only **2 Qs** (and they overlap). Missing standard Qs:

- `mockito-when-thenreturn-vs-doreturn-when`
- `mockito-verify-times-inorder-atleast`
- `mockito-argumentcaptor-vs-argumentmatcher`
- `mockito-mock-static-methods-mockito-inline`
- `mockito-anti-patterns-over-mocking-mocking-immutables`

For comparison: Baeldung has ~40 Mockito articles; top sites rank Mockito questions as the 2nd most-asked Java interview topic after collections.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Unit test Qs show a test method with `@Test`, Arrange-Act-Assert structure | Matching — 15 of 22 have code |
| Mockito Qs show `when().thenReturn()` + `verify()` paired | Matching on the 2 mocking Qs (2–3 code each) |
| Testcontainers Qs show the `@Container`, JUnit 5 `@Testcontainers` annotation + static initializer | Matching |
| Comparison Qs (unit vs integration vs e2e) show a table of boundary/speed/isolation | **Failing** — Q1 `unit-vs-integration-vs-e2e-testing` has 486w + 0 code |
| Opening bolds the test primitive (`**unit test**`, `**mock**`, `**spy**`, `**@SpringBootTest**`) | **Failing** — 15 of 22 direct answers have zero bold anchors |
| Analogies common (mock = "stunt double", spy = "partial stunt double", test pyramid = "wide base, narrow top") | Only 1 of 22 has detected analogy (Q1 testcontainers) — weakest coverage in audit |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | LIKELY DUPLICATE QUESTIONS | **CRITICAL** | 4 probable duplicate pairs identified by identical Zone 3 shape. If confirmed, module drops from 22 → 17–18 Qs. Needs content-diff audit |
| S2 | THIN MOCKITO COVERAGE | **MAJOR** | 2 Qs (both overlap) for Java's most-asked test library. Should be 5–7 Qs minimum |
| S3 | Q1 COMPARISON NO CODE | **MAJOR** | `unit-vs-integration-vs-e2e-testing` is 486w of prose with no code or table — a comparison Q without a comparison artifact |
| S4 | EMPTY SCENARIO + COMPARISONS | **MAJOR** | Both declared topics empty. Scenarios ("my test is flaky", "my coverage is high but bugs happen", "mocking breaks when I refactor") are standard |
| S5 | MODULE-WIDE SPEAKABLE SHORTS | MODERATE | 9 of 22 speakables under 130w — too compressed for testing answers |
| S6 | MODULE-WIDE ZONE 1 | MODERATE | 15 of 22 direct answers have 0 bold anchors; 6 paragraph walls |
| S7 | ANALOGY GAP | MODERATE | Only 1 of 22 has detected analogy — worst analogy coverage of any audited module in a highly analogy-friendly domain |

---

## Per-question issues

### `unit-testing-basics` (8 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** unit-vs-integration-vs-e2e-testing | 486w / **0 code** / no analogy. Comparison Q with no comparison table/diagram | **MAJOR** |
| **Q2** parameterized-test-method-source | 377w / 3 code. **Very likely dup with Q6** | DUP? |
| **Q3** tdd-red-green-refactor | DA wall (80w). 489w / 2 code. **Very likely dup with Q4** | DUP? + DA wall |
| **Q4** test-driven-development-tdd-java | 489w / 2 code. **Very likely dup with Q3** | DUP? |
| **Q5** junit5-assertions-assertj | 328w / 3 code / analogy-ish. **Zone 2 short (101w)** | MINOR |
| **Q6** parameterized-tests-junit5 | 377w / 3 code — **CLEAN** by auditor. Very likely dup with Q2 | CLEAN + DUP? |
| **Q7** testing-exceptions-junit5 | 358w / 5 code. **Zone 2 short (102w)** | MINOR |
| **Q8** unit-testing-best-practices-java | 457w / 2 code / no analogy | MINOR |

### `unit-testing-advanced` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** testing-async-completablefuture | 406w / 2 code / no analogy. Zone 2 short (117w) | MINOR |
| **Q2** code-coverage-jacoco-spring-boot | 451w / 1 code / no analogy | MINOR |

### `mocking-with-mockito` (2 Qs) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** mockito-mock-spy-mockbean | DA wall (74w). 449w / 3 code / no analogy. **Overlaps 0.5 with Q2** | MODERATE (wall) + OVERLAP |
| **Q2** mockito-mock-spy-verify-argumentcaptor | 357w / 2 code / no analogy. **Overlaps with Q1** | MINOR + OVERLAP |

### `integration-testing` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** testing-kafka-embedded-kafka | DA wall (61w). 471w / 1 code / analogy | MODERATE |
| **Q2** integration-testing-spring-boot | 490w / 1 code / no analogy | MINOR |

### `spring-boot-testing` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** springboottest-and-slice-variants | 490w / 1 code / no analogy. Should show `@SpringBootTest` vs `@WebMvcTest` vs `@DataJpaTest` side-by-side | MINOR |
| **Q2** mockmvc-controller-testing | 438w / 2 code. Zone 2 short (112w). **Very likely dup with Q5** | DUP? |
| **Q3** spring-test-slices-comparison | DA wall (65w). 476w / 1 code / no analogy. Zone 2 short (116w). **Comparison Q with 1 code** | MODERATE |
| **Q4** testing-spring-security | 425w / 2 code / no analogy | MINOR |
| **Q5** mockmvc-testing-controllers | 438w / 2 code. Zone 2 short. **Very likely dup with Q2** | DUP? |

### `testcontainers` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** datajpatest-with-testcontainers | DA wall (61w). 407w / 2 code / analogy | MODERATE |
| **Q2** testcontainers-real-database-integration | DA wall (67w). 443w / 1 code / no analogy. Zone 2 short (115w). **Very likely dup with Q3** | MODERATE + DUP? |
| **Q3** testcontainers-spring-boot | 443w / 1 code. Zone 2 short (115w). **Very likely dup with Q2** | DUP? |

### `scenario-based` (0 Qs) — **empty**

Suggested: `flaky-test-how-to-diagnose`, `test-coverage-high-but-bugs-happen`, `slow-test-suite-how-to-speed-up`, `test-breaks-every-time-i-refactor-what-went-wrong`.

### `comparisons` (0 Qs) — **empty**

Move candidates: `unit-vs-integration-vs-e2e-testing` (Q1 basics), `spring-test-slices-comparison` (Q3 spring-boot-testing). Add: `mockito-vs-easymock-vs-powermock`, `junit4-vs-junit5`, `assertj-vs-hamcrest-vs-junit-assertions`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 likely duplicate questions (4 pairs) — needs diff audit to confirm |
| **MAJOR** | **3** | S2 thin Mockito, S3 Q1 comparison no code, S4 empty topics |
| **MODERATE** | **8** | S5 Zone 2 shorts, S6 bold + paragraph walls, S7 analogy gap, Q1 mockito (DA wall), Q1 integration (DA wall), Q3 spring-slices, Q1/Q2 testcontainers DA walls |
| **MINOR** | **~15** | Well-shaped Qs needing polish |
| **CLEAN** | **1** | Q6 parameterized-tests-junit5 (pending dup confirmation) |

## Most common issue codes

- `zone3_no_analogy` × 15
- `zone1_direct_answer_no_bold_anchors` × 15
- `zone2_speakable_short` × 9
- `zone1_direct_answer_paragraph_wall` × 6

---

## Suggested fix order

1. **Confirm + consolidate the 4 duplicate pairs** (S1). Content-diff each pair; if duplicate, keep one slug and delete the other. This alone could shrink the module from 22 to 17–18 Qs and raise apparent quality dramatically.
2. **Expand Mockito topic to 5–7 Qs** (S2). Add: `when-thenreturn-vs-doreturn-when`, `verify-inorder-times`, `argumentcaptor-vs-argumentmatcher`, `mockito-inline-static-mocking`, `over-mocking-anti-patterns`.
3. **Add comparison table or code to Q1 `unit-vs-integration-vs-e2e-testing`** — speed/boundary/isolation matrix + an example test per tier.
4. **Author `comparisons` topic** — move existing comparison Qs + add JUnit 4 vs 5, AssertJ vs Hamcrest.
5. **Author `scenario-based` topic** — flaky tests, coverage-vs-bugs, slow suites, refactor-breaks-tests.
6. **Expand short speakables** (9 Qs) from 101–130w to 170–220w — adds example + when-to-use paragraphs.
7. **Fix 6 paragraph-wall DAs** + module-wide bold-anchor pass.
8. **Add analogies** — mock ("stunt double"), spy ("partial stunt double"), test pyramid ("wide base narrow top"), TDD ("write the bill before cooking the meal"), testcontainer ("real oven for baking test"), parameterized test ("one recipe with different ingredients").
