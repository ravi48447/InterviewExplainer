# 19 — New Domain: `java-backend-beginner` (FULL SPEC)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain blueprint. Reads as the source of truth for
> the entire JBB content tree. Playbooks 20 and 21 implement the
> structure and the content respectively.

## TL;DR

- **Goal:** A locked domain for 0–2 YOE Java backend candidates that is
  obviously NOT a watered-down JBI — it answers different questions, at a
  different reading level, with a different difficulty mix.
- **Pillars used:** P01, P02, P03, P04 (subset), P06 (subset), P08, P12.
  We deliberately exclude P05, P07, P09, P10, P11 — those belong to JBI
  / JBA.
- **Target total Q at launch:** 400 (vs JBI's ~5800). Quality and clarity
  beat depth.

## Hard prerequisites

- [ ] Playbook 07 is DONE (`scripts/new_locked_domain.py` exists).
- [ ] Playbook 11 audit captured baseline.

## Why a separate domain?

A "beginner" lens is not a subset of intermediate. It needs:

1. **Different difficulty mix:** 60 % easy / 35 % medium / 5 % hard.
2. **Different vocabulary:** every Java jargon term defined on first use.
3. **Different example shape:** every code block is runnable with `main()`,
   not a snippet from a Spring controller.
4. **Different follow-ups:** "what will the interviewer probe next?" not
   "how would this scale?".
5. **Different SEO targets:** `java interview questions for freshers`,
   `core java for beginners`, `java basic interview questions`.

If we just toggle a flag on JBI, we lose all five. Hence a locked domain.

## Domain metadata

```json
{
  "domainSlug": "java-backend-beginner",
  "language": "java",
  "level": "beginner",
  "seoSlug": "java-interview-questions-for-freshers",
  "altSlugs": [
    "core-java-interview-questions-for-beginners",
    "java-basic-interview-questions",
    "java-fresher-interview-questions",
    "java-developer-interview-questions-for-freshers"
  ],
  "label": "Java Backend (Beginner)",
  "blurb": "Java backend interview prep for 0–2 YOE: fundamentals, OOP, collections, concurrency basics, JDBC, JUnit, and the behavioral questions that come up in graduate / first-job interviews.",
  "audience": "0-2 YOE Java developers, fresh grads, bootcamp completers"
}
```

## Module specification (12 modules)

| # | Module slug                       | Pillar | Min Q | Difficulty (E/M/H) | Notes                                                                       |
| - | --------------------------------- | ------ | ----- | ------------------ | --------------------------------------------------------------------------- |
| 1 | `java-syntax-essentials`          | P01    | 40    | 70/25/5           | Hello world, data types, operators, control flow, arrays, strings           |
| 2 | `java-oop-basics`                 | P01    | 35    | 60/35/5           | Class/object, encapsulation, inheritance, polymorphism, abstraction         |
| 3 | `java-collections-basics`         | P01    | 30    | 60/35/5           | List/Set/Map intuition, ArrayList, HashMap, when each                       |
| 4 | `java-exceptions-and-io`          | P01    | 25    | 60/35/5           | try-catch-finally, checked vs unchecked (just the contrast), File I/O      |
| 5 | `java-concurrency-intro`          | P01    | 20    | 60/35/5           | Thread, Runnable, synchronized — at concept level only                     |
| 6 | `jdbc-and-jpa-intro`              | P03    | 25    | 60/35/5           | JDBC connection, ResultSet, prepared statements, JPA basics                |
| 7 | `spring-boot-starter`             | P02    | 35    | 60/35/5           | Hello World REST, @RestController basics, application.properties           |
| 8 | `rest-api-basics`                 | P04    | 25    | 60/35/5           | HTTP verbs, status codes, Postman, JSON, simple controllers                |
| 9 | `git-and-build-basics`            | P09(*)| 25    | 70/30/0           | git basic commands, branching, Maven/Gradle hello world                    |
| 10| `oop-and-design-basics`           | P06    | 25    | 50/45/5           | Object design, simple LLD (Pet, Bank Account), patterns intuition only      |
| 11| `unit-testing-basics`             | P08    | 20    | 60/35/5           | JUnit 5 first test, assertions, simple mocks                                |
| 12| `behavioral-and-fresher-qa`       | P12    | 95    | 50/45/5           | Self-intro, college projects, "why Java", weakness, etc.                   |

(*) `git-and-build-basics` uses P09 pillar so it joins the same DevOps
arc but the content level stays beginner.

**Total minimum: 400 Q.**

## Content rules (different from JBI)

| Rule                                                                                            | Why                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Every jargon term is defined on first use inline ("the JVM, which is the engine that runs Java bytecode…") | Reader has zero context                          |
| Every code block has a `public static void main` entry point                                    | Reader needs to run it                            |
| Code blocks are ≤ 25 lines                                                                       | Cognitive load                                    |
| Every answer ends with "What the interviewer is really asking" — one short paragraph            | Beginner needs the meta-signal                   |
| Speakable summary is ≤ 280 chars (tighter than JBI's 320)                                       | Voice clarity                                     |
| **No** scenario archetype questions (no archetype C)                                             | Scenarios belong to JBI                          |
| Archetype mix target: A=45 % / B=30 % / D=10 % / E=5 % / F=5 % / G=5 %                          | Beginner-shaped                                   |

## Speakable / archetype distribution per module (target)

| Module                       | A (concept) | B (compare) | D (algorithm) | E (debug) | F (api/syntax) | G (story) |
| ---------------------------- | ----------- | ----------- | ------------- | --------- | -------------- | --------- |
| java-syntax-essentials       | 50 %        | 20 %        | 0 %           | 0 %       | 25 %           | 5 %       |
| java-oop-basics              | 55 %        | 30 %        | 0 %           | 0 %       | 10 %           | 5 %       |
| java-collections-basics      | 40 %        | 40 %        | 5 %           | 0 %       | 10 %           | 5 %       |
| java-exceptions-and-io       | 60 %        | 20 %        | 0 %           | 5 %       | 10 %           | 5 %       |
| java-concurrency-intro       | 65 %        | 25 %        | 0 %           | 0 %       | 5 %            | 5 %       |
| jdbc-and-jpa-intro           | 50 %        | 25 %        | 0 %           | 0 %       | 20 %           | 5 %       |
| spring-boot-starter          | 45 %        | 20 %        | 0 %           | 0 %       | 30 %           | 5 %       |
| rest-api-basics              | 45 %        | 25 %        | 0 %           | 0 %       | 25 %           | 5 %       |
| git-and-build-basics         | 30 %        | 25 %        | 0 %           | 5 %       | 40 %           | 0 %       |
| oop-and-design-basics        | 50 %        | 30 %        | 0 %           | 0 %       | 10 %           | 10 %      |
| unit-testing-basics          | 45 %        | 20 %        | 0 %           | 5 %       | 25 %           | 5 %       |
| behavioral-and-fresher-qa    | 5 %         | 0 %         | 0 %           | 0 %       | 0 %            | 95 %      |

## Search-phrase keyword map

| Search phrase                                       | Module                       |
| --------------------------------------------------- | ---------------------------- |
| `java interview questions for freshers`             | (domain landing)             |
| `core java interview questions for beginners`       | (domain landing)             |
| `basic java interview questions`                    | java-syntax-essentials       |
| `oops concepts in java interview questions`         | java-oop-basics              |
| `collections framework in java interview questions` | java-collections-basics      |
| `exception handling in java interview questions for freshers` | java-exceptions-and-io |
| `multithreading in java interview questions for freshers` | java-concurrency-intro |
| `jdbc interview questions for freshers`             | jdbc-and-jpa-intro           |
| `spring boot interview questions for freshers`      | spring-boot-starter          |
| `rest api interview questions for freshers`         | rest-api-basics              |
| `git interview questions for freshers`              | git-and-build-basics         |
| `junit interview questions for freshers`            | unit-testing-basics          |
| `behavioral interview questions for java freshers`  | behavioral-and-fresher-qa    |
| `tell me about yourself java fresher`               | behavioral-and-fresher-qa    |

## Landing intro template (for the JBB landing page)

```text
Java Backend Interview Questions for Freshers and 0–2 YOE Engineers

This page is for early-career Java developers preparing for their first or
second backend role. Every question on this page is written for someone
who has finished a CS degree, a coding bootcamp, or a year of self-study
— not someone with five years of production Spring Boot experience.
Concretely that means: every Java jargon term is defined on first use,
every code block is a complete runnable program with main(), every
answer ends with "what the interviewer is really asking", and the
difficulty mix is 60 % easy / 35 % medium / 5 % hard. The questions cover
the topics that fresher and graduate interviewers actually probe — Java
syntax, OOP, collections, exception handling, basic multithreading, JDBC
and JPA basics, a Hello-World Spring Boot REST controller, JUnit 5, Git,
and the behavioral questions ("tell me about yourself", "why Java",
"talk about a college project") that take up half of every fresher
interview. If you have 3+ years of experience, head to the intermediate
or advanced Java backend pages — the depth and style there are different.
```

## URL strategy

- App URL: `/interview/java-backend-beginner`
- Canonical SEO URL: `/java-interview-questions-for-freshers`
- 301 redirects from:
  - `/core-java-interview-questions-for-beginners` →
  - `/java-basic-interview-questions` →
  - `/java-fresher-interview-questions` →
  - `/java-developer-interview-questions-for-freshers`

## Current state

- `java-backend-beginner` does NOT exist on disk yet.
- ~145 Q exist under `content/interview/java/backend/beginner` (the
  canonical interview hub tree) — they get migrated under playbook 50,
  not copied here.

## Target state (measurable for this spec playbook)

- Domain metadata block approved + committed.
- 12-module list approved.
- Difficulty + archetype distribution targets approved.
- Search-phrase keyword map approved.
- Landing intro template approved.

## Failure modes & rollback

- **Spec proposes adding archetype C** (scenario): refuse — scenarios
  belong to JBI; JBB is fresher-shaped.
- **Spec proposes more than 5 % hard questions:** refuse — JBB target
  is 5 % hard.
- **Spec adds a pillar (P05/P07/P09/P10/P11) excluded by audience:**
  refuse — those topics are out of beginner scope.
- **A code block claims to be beginner but uses framework idioms
  without main():** rewrite as a runnable script.
- **A behavioral question for a fresher reads like an EM behavioral
  question:** rewrite to college-project / first-job framing.
- **Rollback:** revert the spec; no content yet.

## Quality gates (this playbook = spec only; no content yet)

| Gate                                                  | Threshold      |
| ----------------------------------------------------- | -------------- |
| Domain metadata block above approved and committed    | yes            |
| Module list above approved (12 modules)               | yes            |
| Archetype distribution table reviewed                 | yes            |
| Search-phrase keyword map reviewed                    | yes            |
| Landing intro template reviewed                       | yes            |

## Definition of Done

- [ ] This file lives at `expansion-plan/19-new-domain-java-backend-beginner-spec.md`.
- [ ] Domain metadata block is the canonical reference for playbook 20.
- [ ] Module spec table is the canonical reference for playbook 20.
- [ ] Archetype distribution table is the canonical reference for playbook 21.
- [ ] `00-INDEX.md` row for `19` flipped to `DONE`.

## Estimated effort

- **Ideal:** 4 hours (review + sign-off).
- **Hard stop:** 8 hours.
