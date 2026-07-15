# Audit — architecture-patterns

**Pillar:** P05 Patterns & Architecture
**Module:** M19 architecture-patterns
**Topics present:** 6 (of 8 — `scenario-based`, `comparisons` have 0 questions)
**Questions:** 28 (all written, no stubs)
**Benchmark sources:** Robert C. Martin "Clean Architecture", Eric Evans "DDD", Vaughn Vernon "Implementing DDD", Alistair Cockburn on hexagonal, Gregor Hohpe on integration patterns, Vlad Khononov "Learning DDD", Sam Newman on microservices

---

## Biggest finding — two questions are duplicates with Jaccard 1.0

The hexagonal-architecture topic has **two questions with identical slug tokens:**

- `hexagonal-architecture-ports-adapters`
- `ports-and-adapters-hexagonal-architecture`

Same topic, same angle, different word order. Jaccard 1.0 (identical token set after stopword removal). **Content should be compared and one merged into the other.** This is the only 1.0-Jaccard duplicate pair in the entire 34-module project.

---

## Module is substantive; issues are mostly completeness

- 28 questions, all written, 0 stubs, 0 CRITICAL
- Zone 3 depth is strong (average ~625w, several 800–975w)
- Analogy coverage is the **best in the project** — 15 of 28 questions have detected analogies (other modules average 3–5)
- Code coverage is decent — 5 of 28 Zone 3s with zero code (much better than sql-databases or spring-data-jpa)
- Speakable quality is consistent (145–266w, all prose)

Structural gaps are clustered around topic completeness + module-wide Zone 1 polish.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Architectural discussion delivered in narrative prose (not bulleted) | **Matching** — all 28 speakables are prose. Correct for architecture archetype |
| Analogies carry the weight (clean arch = "onion with the business inside", hexagonal = "plug-and-socket") | **Matching** — 15/28 have analogies |
| Code or diagram for most patterns (project structure tree, port-adapter pseudo-code, aggregate class skeleton) | **Mixed** — 23/28 have code; 5 patterns are prose-only |
| DDD content always includes Bounded Context map + example ubiquitous language | Matching on bounded context (Q1) and ubiquitous language (Q7) |
| Opening bolds the architectural term (`**Bounded Context**`, `**Aggregate Root**`, `**BFF**`, `**ACL**`) | **Failing** — 0 of 28 direct answers have bold anchors |
| CQRS and event sourcing are treated as companion patterns with separate explanations | **Failing** — topic is named `cqrs-and-event-sourcing` but has 1 Q on event sourcing, 0 on CQRS |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | DUPLICATE QUESTIONS | **CRITICAL** | **`hexagonal-architecture-ports-adapters` and `ports-and-adapters-hexagonal-architecture` are the same question.** Compare content, merge, delete one. Only 1.0-Jaccard dup pair in the project |
| S2 | MISSING CQRS QUESTION | **MAJOR** | Topic `cqrs-and-event-sourcing` has event-sourcing Q only. **CQRS** (Command Query Responsibility Segregation) is a first-class pattern that deserves its own question. Standard DDD interview territory |
| S3 | EMPTY TOPICS | **MAJOR** | `scenario-based` (0 Qs) and `comparisons` (0 Qs). Q6 clean-vs-layered, Q1 monolith-vs-microservices, Q2 shared-db-vs-db-per-service are structurally comparison questions that belong in `comparisons` |
| S4 | THIN HEXAGONAL TOPIC | **MAJOR** | After merging duplicates, hexagonal-architecture has only 1 unique question. For a pattern as interview-central as this, suggest at least one more: `hexagonal-vs-clean-architecture-comparison`, or `implementing-hexagonal-spring-boot` |
| S5 | MODULE-WIDE ZONE 1 | **MAJOR** | 28 of 28 direct answers have zero bold anchors; 9 (32%) are paragraph walls. For architecture content where concepts have memorable names, bold anchoring is especially impactful |
| S6 | CROSS-MODULE OVERLAP | **MODERATE** | `microservices-patterns` topic (3 Qs) overlaps with M16 microservices module. Strangler fig, DB-per-service, monolith-vs-microservices are all topics that appear in both modules. Needs cross-module scope decision: architecture module covers the pattern theory, microservices module covers the implementation |
| S7 | CODE-MISSING COMPARISON QUESTIONS | **MODERATE** | 4 comparison questions with 600–920w Zone 3 have zero code. Q6 clean-vs-layered (610w), Q10 strategic-ddd-context-mapping (919w), Q1 monolith-vs-microservices (617w), Q2 shared-db-vs-per-service (908w). A comparison without at least a project-tree / topology diagram (code block) is less interview-usable |

---

## Per-question issues

### `architectural-styles` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** backend-for-frontend-bff-pattern | Paragraph wall (66w). 856w / 1 code / analogy. Standard BFF analogy ("personal concierge per client type") — verify present | MINOR |
| **Q2** service-mesh-architecture | 837w / 1 code / analogy — good. Service mesh could use a sidecar-diagram-as-ASCII snippet | MINOR |
| **Q3** layered-architecture-spring-boot | 720w / 3 code / analogy — **best-shaped question in topic** | MINOR |

### `clean-architecture` (9 Qs) — strong topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** clean-architecture-layers-dependency-rule | 543w / 3 code / no analogy. Missing the canonical "onion" analogy | MINOR |
| **Q2** use-case-interactor-pattern-java | 485w / **5 code** / analogy — **best code coverage in topic** | MINOR |
| **Q3** spring-boot-clean-architecture-project-structure | 451w / 5 code / recommendation closer | MINOR |
| **Q4** rich-domain-model-vs-anemic-domain-model | Paragraph wall (62w). 555w / 1 code / no analogy. Martin Fowler's original ["Anemic Domain Model"](https://martinfowler.com/bliki/AnemicDomainModel.html) post is the canonical reference — cite style-wise | MINOR |
| **Q5** unit-testing-clean-architecture-java | 506w / 3 code / recommendation closer / no analogy | MINOR |
| **Q6** clean-architecture-vs-layered-architecture | 610w / **0 code** / no analogy. **Most comparison-y question in topic without comparative project-structure code.** Must show: clean-arch project tree (`domain/`, `application/`, `infrastructure/`) vs layered project tree (`controller/`, `service/`, `repository/`) | **MAJOR** |
| **Q7** cross-cutting-concerns-clean-architecture | 581w / 4 code / no analogy | MINOR |
| **Q8** repository-pattern-clean-architecture | 507w / 1 code / no analogy. Overlaps with DDD Q5 `repository-pattern-ddd` — different lens (clean arch = port in application layer; DDD = part of aggregate). Scope is probably OK, but flag if answers drift | MINOR + OVERLAP |
| **Q9** when-not-to-use-clean-architecture | Paragraph wall (62w). 637w / **0 code** / no analogy. "When not to use" content is inherently prose; acceptable without code | MODERATE |

### `hexagonal-architecture` (2 Qs) — **duplicate issue**

| Q | Issue | Severity |
|---|---|---|
| **Q1** hexagonal-architecture-ports-adapters | Paragraph wall (66w). 633w / 4 code / no analogy | **CRITICAL (duplicate)** |
| **Q2** ports-and-adapters-hexagonal-architecture | 605w / 2 code / analogy | **CRITICAL (duplicate)** |

**Action:** read both, keep the stronger (Q1 has more code, Q2 has analogy — best outcome may be to merge the two). Then replace with a distinct second question.

### `domain-driven-design` (10 Qs) — **strongest topic in module**

Rich content, analogies in 6 of 10, average Zone 3 ~650w.

| Q | Issue | Severity |
|---|---|---|
| **Q1** bounded-context-ddd | Paragraph wall (70w — module max). 709w / 1 code / analogy | MINOR |
| **Q2** entity-vs-value-object-ddd | Paragraph wall (62w). 640w / 1 code / analogy | MINOR |
| **Q3** aggregate-aggregate-root-ddd | 803w / 1 code / no analogy. Aggregate example could use a slightly fuller Java class (ID, invariants, command methods) | MINOR |
| **Q4** domain-events-ddd-java | 663w / 2 code / analogy | MINOR |
| **Q5** repository-pattern-ddd | 558w / 2 code / no analogy | MINOR |
| **Q6** domain-services-vs-application-services-ddd | 468w / 1 code / no analogy. This is the Q where analogy would help most ("application service = orchestrator / waiter, domain service = chef") | MODERATE |
| **Q7** ubiquitous-language-ddd | Paragraph wall (63w). Speakable short-ish (145w). 438w / 1 code / analogy | MINOR |
| **Q8** anti-corruption-layer-ddd | 749w / 1 code / no analogy. ACL analogy missing ("translator at a border crossing") | MINOR |
| **Q9** ddd-tactical-patterns-spring-boot | 526w / 3 code / analogy | MINOR |
| **Q10** strategic-ddd-context-mapping-patterns | 919w / **0 code** / no analogy / recommendation closer. **Highest Zone 3 word count in module with zero code.** Context mapping patterns (Partnership, Customer/Supplier, Conformist, ACL, OHS, Published Language, Shared Kernel, Separate Ways) beg for a visual. At least show the map notation or ASCII diagram | **MAJOR** |

### `cqrs-and-event-sourcing` (1 Q) — **missing CQRS**

| Q | Issue | Severity |
|---|---|---|
| **Q1** event-sourcing-pattern | Paragraph wall (64w). 975w / 1 code / no analogy. Substantive. Event-sourcing analogy missing ("accounting ledger — you never erase, only append") | MODERATE |

**Topic gap:** add `cqrs-pattern-java-spring-boot` — Command Query Responsibility Segregation with separate read/write models, integration with event sourcing, Axon Framework or hand-rolled example.

### `microservices-patterns` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** monolith-vs-microservices-vs-modular-monolith | 617w / **0 code** / analogy. 3-way comparison without code. A minimal project-structure per style would land this | MODERATE |
| **Q2** shared-database-vs-database-per-service | 908w / **0 code** / no analogy. Data ownership pattern without at least a simple diagram or outbox-table schema | **MAJOR** |
| **Q3** strangler-fig-pattern-migration | Paragraph wall (69w). 927w / 2 code / analogy — good depth | MODERATE |

**Cross-module note:** these 3 Qs overlap with M16 microservices module. Decide scope split.

### `scenario-based` (0 Qs) — topic empty

Suggested content:
- `choosing-architecture-for-new-service` — decision framework: team size, domain complexity, deploy needs
- `refactoring-god-class-to-aggregates` — DDD-driven refactor of a monolithic entity
- `splitting-a-monolith-by-bounded-context` — step-by-step extraction strategy

### `comparisons` (0 Qs) — topic empty

Move candidates from existing topics:
- `clean-architecture-vs-layered-architecture` (clean-architecture Q6)
- `monolith-vs-microservices-vs-modular-monolith` (microservices-patterns Q1)
- `shared-database-vs-database-per-service` (microservices-patterns Q2)

Plus new: `hexagonal-vs-onion-vs-clean-architecture` (common 3-way confusion), `saga-vs-two-phase-commit`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 duplicate hexagonal Qs |
| **MAJOR** | **5** | S2 missing CQRS, S3 empty topics, S4 thin hexagonal, S5 module-wide bold, Q6 clean-vs-layered, Q10 context-mapping, Q2 shared-db |
| **MODERATE** | **8** | Q9 when-not-to-use, Q6 domain-services, Q1 monolith comparison, Q3 strangler, Q1 event-sourcing, S6 cross-module overlap, S7 comparison code gap |
| **MINOR** | **18** | Majority of questions — bold + optional analogy polish only |
| **CLEAN** | **0** | No question passes every check, but module is closest-to-clean of any audited so far |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 19
- `zone1_direct_answer_paragraph_wall` × 9
- `zone3_no_analogy` × 13
- `zone3_no_code_examples` × 5

---

## Suggested fix order

1. **Resolve the duplicate hexagonal questions** (S1). Compare content, merge, author a genuinely distinct second question for the topic.
2. **Add the CQRS question** (S2).
3. **Decide microservices-patterns cross-module scope** with M16 microservices module before doing any content work there.
4. **Add code/diagrams to the 4 code-missing comparison questions** (Q6 clean-vs-layered project tree, Q10 DDD context-map, Q1 monolith structure comparison, Q2 DB-per-service topology).
5. **Move the 3 comparison questions** into `comparisons` topic once created (or author 3–4 comparisons natively).
6. **Author `scenario-based` topic** (2–3 Qs minimum).
7. **Module-wide bold-anchor + paragraph-wall fix pass** — 28 direct answers, mechanical.
8. **Add selective analogies** — anti-corruption layer, event sourcing, application-vs-domain services, clean-arch onion, ACL border-crossing.
