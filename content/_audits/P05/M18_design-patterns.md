# Audit — design-patterns

**Pillar:** P05 Architecture & Design
**Module:** M18 design-patterns
**Topics present:** 5 of 9 (`refactoring`, `technical-debt`, `scenario-based`, `comparisons` empty)
**Questions:** 13 (all written, no stubs)
**Benchmark sources:** "Design Patterns: Elements of Reusable Object-Oriented Software" (Gang of Four), "Head First Design Patterns" (Freeman & Freeman, 2nd ed), refactoring.guru, Baeldung design patterns series, Joshua Bloch "Effective Java" (3rd ed) — pattern references, Spring Framework reference documentation

---

## Module is the best-shaped in the whole audit

- 13 written Qs, no stubs
- **Zero MODERATE-or-higher per-question issues** — all 13 are `MINOR`
- Uniform speakable format: 13 of 13 use prose (distinct from most modules which use bulleted-subheaders — this is fine and arguably better for pattern "teach me this" questions)
- Strong code coverage — Q1 SOLID has 9 code blocks, others 2–5
- 7 of 13 Qs have detected analogies — best analogy coverage of any audited module
- Universal `interviewer_intent` + `key_points` completeness

**The only universal issue is the 13-of-13 missing bold anchors in direct answers** — a mechanical fix.

The substantive issues are at the module level: misnamed topic, GoF pattern coverage gap, 4 empty topics.

---

## Biggest finding — `design-patterns-legacy` topic is misnamed

The topic `design-patterns-legacy` contains:

- `repository-vs-dao-pattern-spring-data`
- `circuit-breaker-pattern-resilience4j-java`
- `specification-pattern-complex-queries-java`
- `cqrs-pattern-spring-java`

None of these are "legacy" patterns. They're **modern Spring/resilience/enterprise patterns**. Circuit breaker and CQRS are actively growing in relevance.

Suggested rename: `enterprise-patterns`, `spring-and-resilience-patterns`, or split into:
- `enterprise-patterns` → repository, DAO, specification
- `resilience-patterns` → circuit breaker (move to M16 microservices — already covered there)
- `architectural-patterns` → CQRS (may overlap with M19 architecture-patterns)

---

## Biggest finding — GoF pattern coverage gap

With 13 Qs across 4 pattern topics (creational 3, structural 2, behavioral 3, SOLID 1, misc 4) the module covers **7 named GoF patterns**: Singleton, Factory (Abstract + Method), Builder, Decorator, Proxy, Observer, Strategy, Template Method.

**Missing frequently-asked patterns** (by interview frequency order):

| Pattern | Category | Why it's asked |
|---|---|---|
| **Adapter** | Structural | Integration-adapter Qs common in microservices / legacy-integration |
| **Facade** | Structural | Layering / service-layer Qs |
| **Chain of Responsibility** | Behavioral | Servlet filters, Spring Security filters, middleware — cited every interview |
| **Command** | Behavioral | Undo/redo, messaging command pattern |
| **State** | Behavioral | State machines, workflow engines |
| **Composite** | Structural | Tree traversal, UI components |
| **Prototype** | Creational | Spring prototype-scoped beans |
| **Flyweight** | Structural | String pool, Integer cache — often an "explain memory optimization" Q |

Of these, **Adapter + Facade + Chain of Responsibility + Command** are the 4 most-asked missing ones.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Each pattern question follows: problem → UML sketch (or diagram phase) → code → trade-offs → when to use | Matching — Zone 3s follow this shape |
| Code shown in Java with clear pattern structure (interface, concrete types, client) | Matching — Q1–Q3 creational Qs show 2–5 code blocks each |
| Analogy almost mandatory (singleton = "one president per country", builder = "Subway sandwich builder", observer = "newsletter subscribers") | Matching on 7 of 13 Qs; 6 missing |
| Opening bolds the pattern name (`**Singleton**`, `**Builder**`, `**Observer**`) | **Failing** — 13 of 13 direct answers have zero bold anchors |
| Modern Spring patterns cross-referenced (Spring events for Observer, `JdbcTemplate` for Template Method, AOP proxy for Proxy) | **Matching** — 3 Qs explicitly tie to Spring |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | GOF COVERAGE GAP | **MAJOR** | 7 named GoF patterns covered of ~15 commonly-asked. Adapter, Facade, Chain of Responsibility, Command, State are missing |
| S2 | MISNAMED TOPIC | **MAJOR** | `design-patterns-legacy` contains modern Spring/enterprise patterns. Rename or split |
| S3 | 4 EMPTY TOPICS | **MAJOR** | `refactoring`, `technical-debt`, `scenario-based`, `comparisons` — empty. Refactoring + tech-debt are distinct arenas from GoF patterns but declared in scope |
| S4 | MODULE-WIDE ZONE 1 | MODERATE | 13 of 13 direct answers have 0 bold anchors |
| S5 | SCOPE DECISION NEEDED | MODERATE | If `refactoring` and `technical-debt` are in scope, this module becomes 25+ Qs across 6+ topics. If out of scope, drop the topics |

---

## Per-question issues

### `solid-principles` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** solid-principles-java | 969w / 9 code / analogy — **strongest Q in module**. Only issue: bold anchors missing in DA | MINOR (near-CLEAN) |

### `creational-patterns` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** singleton-thread-safe-java | 535w / 3 code / no analogy. Singleton + thread-safety (DCL, enum, holder idiom) — should cite enum singleton as Bloch's recommended approach | MINOR |
| **Q2** factory-method-vs-abstract-factory-java | 648w / 2 code / analogy. Good comparison question — 2 code blocks is light for a comparison (should have both patterns shown side-by-side) | MINOR |
| **Q3** builder-pattern-fluent-api-java | 433w / 5 code / analogy. Strong | MINOR |

### `structural-patterns` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** decorator-pattern-java-behavior-without-subclassing | 571w / 4 code / analogy. Should cite `java.io.InputStream` decorator stack as classic JDK example | MINOR |
| **Q2** proxy-pattern-spring-aop-java | 609w / 4 code / no analogy. Spring-AOP proxy + JDK vs CGLIB proxy distinction — should analogize "proxy = secretary who answers your phone" | MINOR |

### `behavioral-patterns` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** observer-pattern-spring-events-java | 522w / 5 code / analogy | MINOR |
| **Q2** strategy-pattern-replace-if-else-java | 516w / 4 code / analogy. Should show the classic "replace enum switch with Strategy map" refactor | MINOR |
| **Q3** template-method-pattern-spring-jdbctemplate | 539w / 4 code / no analogy. Spring `JdbcTemplate` as canonical example — strong tie-in. Needs analogy ("recipe with blanks to fill") | MINOR |

### `design-patterns-legacy` (4 Qs) — **misnamed**

| Q | Issue | Severity |
|---|---|---|
| **Q1** repository-vs-dao-pattern-spring-data | 572w / 3 code / analogy | MINOR |
| **Q2** circuit-breaker-pattern-resilience4j-java | 572w / 5 code / analogy. **Overlaps with M16 microservices circuit-breaker topic** | MINOR + OVERLAP |
| **Q3** specification-pattern-complex-queries-java | 476w / 4 code / analogy | MINOR |
| **Q4** cqrs-pattern-spring-java | 787w / 5 code / no analogy. **Overlaps with M19 architecture-patterns** (architecture module is the correct home for CQRS; this Q duplicates coverage) | MINOR + OVERLAP |

### `refactoring` (0 Qs) — empty
Suggested: `when-to-extract-method`, `replace-conditional-with-polymorphism`, `martin-fowler-refactoring-catalog-must-knows`, `refactoring-legacy-code-safely-with-tests`.

### `technical-debt` (0 Qs) — empty
Suggested: `identifying-technical-debt-types`, `how-to-convince-management-to-allocate-time-for-debt`, `managing-debt-incrementally-in-agile`.

### `scenario-based` (0 Qs) — empty
Suggested: `you-see-nested-if-else-7-levels-deep-which-pattern-to-apply`, `growing-class-doing-too-many-things-refactoring-walkthrough`.

### `comparisons` (0 Qs) — empty
Move candidates: `factory-method-vs-abstract-factory` (already exists, could also live here), add `strategy-vs-state`, `adapter-vs-facade-vs-decorator`, `template-method-vs-strategy`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **3** | S1 GoF coverage gap, S2 misnamed topic, S3 empty topics |
| **MODERATE** | **2** | S4 module-wide bold, S5 scope decision |
| **MINOR** | **13** | All 13 Qs — bold anchors + some analogy gaps |
| **CLEAN** | **0 by auditor** (Q1 SOLID is effectively clean pending bold anchors) |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 13 (100%)
- `zone3_no_analogy` × 4 (lowest across all audited modules — good)
- `zone3_no_code_examples` × 0 (none — best in project)

---

## Suggested fix order

1. **Rename `design-patterns-legacy` topic** (S2) — rename to `enterprise-patterns` or split. Minor rename + move CQRS and circuit-breaker decisions.
2. **Decide scope for `refactoring` + `technical-debt`** (S5) — either author those topics as declared or drop them from `_index.json`.
3. **Author 4–5 highest-frequency missing GoF patterns** — Adapter, Facade, Chain of Responsibility, Command, State.
4. **Module-wide bold-anchor pass** — 13 mechanical edits.
5. **Add analogies to 4 missing Qs** — singleton ("one president per country"), proxy ("secretary answering phone"), template method ("recipe with blanks"), CQRS ("separate read and write counters at a bank").
6. **Resolve cross-module overlaps** — circuit-breaker (M16 already owns), CQRS (M19 architecture-patterns likely owns); either delete from this module or scope distinctly (M18 = pure GoF-style coverage of the pattern, others = architectural/operational coverage).
7. **Consider authoring `comparisons` topic** — pattern-vs-pattern Qs are common interview material.

---

## Overall

This is the **best-authored module in the whole audit** in terms of per-question quality (9 analogies, strong code coverage, zero empty Zone 3s, zero paragraph walls). The module-level issues are all scoping + naming + coverage-gap problems, not quality problems. Quick to fix once decisions are made.
