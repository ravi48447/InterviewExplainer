# 22 — New Domain: `java-backend-advanced` (FULL SPEC)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain blueprint. Reads as the source of truth for
> the entire JBA content tree. Playbook 23 implements scaffold +
> content + launch.

## TL;DR

- **Goal:** A locked domain for 8+ YOE Java engineers (Staff, Principal,
  Tech Lead, Engineering Manager) — the audience that JBI underserves.
- **Pillars used:** P02 (deep Spring), P05 (microservices + messaging),
  P06 (system + architecture), P09 (deep K8s + platform), P10 (cloud),
  P11 (SRE + production), P12 (leadership). Excludes P01 fundamentals
  (assumed known), P03 basic SQL, P04 REST basics — those live in JBI.
- **Target total Q at launch:** 600 high-depth questions. **Quality
  beats quantity by an even wider margin than JBB.**

## Hard prerequisites

- [ ] Playbook 19 + 20 + 21 (JBB) shipped — proves the new-domain
      pattern.
- [ ] Playbook 11 audit confirms JBI doesn't already cover the JBA
      surface area at 8+ YOE depth.

## Why a separate domain?

8+ YOE Java engineers interview for:

1. **Staff / Principal IC roles** — system design at scale, architectural
   trade-offs, multi-region, multi-tenant, large-codebase refactors.
2. **Tech Lead / EM roles** — leadership, mentoring, hiring,
   prioritisation, RFC processes.
3. **Platform / SRE roles** — production debugging, capacity planning,
   chaos engineering, deep K8s, observability.

JBI's `behavioral` and `system-design` are written for mid-level; this
audience needs:

- Multi-region, multi-tenant, multi-AZ scenarios.
- Concrete numbers — RPS, GB, p99 budgets, cost.
- "Tell me about a time you migrated 200 services" not "tell me about a
  time you fixed a bug".
- Library-level depth, not concept-level.

## Domain metadata

```json
{
  "domainSlug": "java-backend-advanced",
  "language": "java",
  "level": "advanced",
  "seoSlug": "java-interview-questions-for-experienced-senior",
  "altSlugs": [
    "java-staff-engineer-interview-questions",
    "principal-engineer-interview-questions-java",
    "java-tech-lead-interview-questions",
    "senior-java-developer-interview-questions",
    "java-architect-interview-questions"
  ],
  "label": "Java Backend (Advanced)",
  "blurb": "Staff, Principal, Tech Lead, and Engineering Manager interview prep for senior Java engineers: deep architecture, system design at scale, production SRE, leadership, and the multi-region / multi-tenant decisions that come up at 8+ YOE.",
  "audience": "8+ YOE Java engineers; staff / principal / tech-lead / EM tracks"
}
```

## Module specification (14 modules)

| #  | Module slug                              | Pillar | Min Q | Difficulty (E/M/H) | Notes                                                                       |
| -- | ---------------------------------------- | ------ | ----- | ------------------ | --------------------------------------------------------------------------- |
| 1  | `jvm-internals-deep`                     | P01    | 40    | 5/40/55            | GC tuning, escape analysis, AOT, GraalVM native, JIT pipelines              |
| 2  | `spring-internals-deep`                  | P02    | 40    | 5/40/55            | AutoConfigImportSelector, FactoryBean, BeanPostProcessor lifecycle, AOT     |
| 3  | `concurrency-and-virtual-threads-deep`   | P01    | 40    | 0/35/65            | Structured concurrency, scopes, JEP 444/453/462, JCTools, JMH               |
| 4  | `microservices-at-scale`                 | P05    | 50    | 0/30/70            | Service decomposition for 200+ services, mesh, multi-region                  |
| 5  | `event-driven-and-streaming-deep`        | P05    | 40    | 0/30/70            | Kafka tuning, EOS internals, schema registry, ksqlDB, change-data-capture   |
| 6  | `system-design-at-scale`                 | P06    | 50    | 0/20/80            | Multi-region, geo-replication, multi-tenant, cost-aware design               |
| 7  | `architecture-and-evolution`             | P06    | 40    | 0/30/70            | Strangler fig, hexagonal at scale, monolith decomposition strategies         |
| 8  | `distributed-systems-deep`               | P06    | 40    | 0/25/75            | Consensus (Raft/Paxos), Lamport clocks, CRDTs, exactly-once at the edge      |
| 9  | `data-at-scale`                          | P03    | 40    | 0/35/65            | Partitioning strategies, multi-region postgres, write-heavy workloads         |
| 10 | `kubernetes-platform-engineering`        | P09    | 40    | 0/30/70            | Operators, custom controllers, GitOps (Argo, Flux), service mesh internals  |
| 11 | `cloud-cost-and-multi-region`            | P10    | 30    | 0/40/60            | FinOps, cross-region data transfer, RPO/RTO budgets                          |
| 12 | `production-sre-deep`                    | P11    | 40    | 0/30/70            | Major incident retro patterns, chaos engineering programmes, change failure rate |
| 13 | `staff-engineer-leadership`              | P12    | 70    | 0/30/70            | Influence without authority, RFC adoption, multi-team initiatives           |
| 14 | `engineering-management-and-hiring`      | P12    | 40    | 0/30/70            | Hiring rubric, calibration, performance reviews, EM-vs-IC trade-off          |

**Total minimum: 600 Q.**

## Content rules (different from JBI and JBB)

| Rule                                                                                                             | Why                                                |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Every answer cites a concrete number (RPS, GB/day, ms, $/month) where applicable                                  | Senior interviewers test sense of scale           |
| Every system-design case has multi-region OR multi-tenant OR cost-aware variant in `follow-ups`                  | Audience won't be tested on basic scaling          |
| Every behavioral answer cites org-scope (people, teams, dollars, time)                                            | Staff/EM signal                                    |
| Speakable summary ≤ 320 chars (same as JBI)                                                                       | Voice                                              |
| Code blocks may omit `main()` — assume reader knows boilerplate                                                   | Reading speed                                      |
| Allowed archetypes: A (concept), B (compare), C (scenario), E (debug), G (story). NO D (algorithm) / F (api ref) | Staff interviews don't test algorithms or syntax    |
| At least 1 trade-off paragraph per question (banned: "it depends" without naming the constraint)                 | Senior signal                                      |
| Every staff-leadership story names at least 2 stakeholders by role                                                | Authenticity                                       |

## Archetype distribution per module (target)

| Module                                  | A    | B    | C    | E    | G    |
| --------------------------------------- | ---- | ---- | ---- | ---- | ---- |
| jvm-internals-deep                      | 50 % | 25 % | 10 % | 10 % | 5 %  |
| spring-internals-deep                   | 55 % | 20 % | 10 % | 10 % | 5 %  |
| concurrency-and-virtual-threads-deep    | 45 % | 25 % | 15 % | 10 % | 5 %  |
| microservices-at-scale                  | 25 % | 20 % | 40 % | 10 % | 5 %  |
| event-driven-and-streaming-deep         | 30 % | 20 % | 30 % | 15 % | 5 %  |
| system-design-at-scale                  | 10 % | 10 % | 70 % | 5 %  | 5 %  |
| architecture-and-evolution              | 20 % | 15 % | 50 % | 10 % | 5 %  |
| distributed-systems-deep                | 50 % | 20 % | 20 % | 5 %  | 5 %  |
| data-at-scale                           | 30 % | 20 % | 35 % | 10 % | 5 %  |
| kubernetes-platform-engineering         | 35 % | 20 % | 30 % | 10 % | 5 %  |
| cloud-cost-and-multi-region             | 30 % | 25 % | 35 % | 5 %  | 5 %  |
| production-sre-deep                     | 30 % | 15 % | 30 % | 20 % | 5 %  |
| staff-engineer-leadership               | 5 %  | 5 %  | 10 % | 0 %  | 80 % |
| engineering-management-and-hiring       | 10 % | 10 % | 10 % | 0 %  | 70 % |

## Search-phrase keyword map

| Search phrase                                          | Module                              |
| ------------------------------------------------------ | ----------------------------------- |
| `java staff engineer interview questions`              | staff-engineer-leadership / domain  |
| `principal engineer interview questions java`          | (domain landing)                    |
| `java architect interview questions`                   | architecture-and-evolution          |
| `tech lead interview questions java`                   | staff-engineer-leadership           |
| `engineering manager interview questions java`         | engineering-management-and-hiring   |
| `jvm tuning interview questions`                       | jvm-internals-deep                  |
| `garbage collection tuning interview`                  | jvm-internals-deep                  |
| `kafka exactly once semantics interview`               | event-driven-and-streaming-deep     |
| `distributed systems interview questions`              | distributed-systems-deep            |
| `consensus algorithms interview`                       | distributed-systems-deep            |
| `kubernetes operators interview`                       | kubernetes-platform-engineering     |
| `multi region architecture interview questions`        | cloud-cost-and-multi-region         |
| `aws cost optimization interview questions`            | cloud-cost-and-multi-region         |
| `chaos engineering interview questions`                | production-sre-deep                 |
| `hiring rubric interview questions`                    | engineering-management-and-hiring   |
| `staff project interview questions`                    | staff-engineer-leadership           |
| `spring boot internals interview questions`            | spring-internals-deep               |
| `virtual threads java interview deep`                  | concurrency-and-virtual-threads-deep|

## Landing intro template

```text
Java Backend Interview Questions for Senior / Staff / Principal Engineers (8+ YOE)

This page is for senior Java engineers preparing for Staff IC, Principal,
Tech Lead, or Engineering Manager interviews. The bar for this audience
is different in kind, not just degree: interviewers no longer ask "what
is a HashMap" — they ask "walk me through how you'd shard a 50-TB
PostgreSQL primary across three regions while keeping p99 read latency
under 80 ms and cross-region transfer cost under $40 k / month". This
page is structured around that bar. Every answer cites concrete numbers
where applicable, every system-design case has a multi-region or
multi-tenant variant in the follow-up section, every behavioral answer
names org-scope (people, teams, dollars, time), and every architecture
trade-off paragraph names the specific constraint it's optimising for.
Topics include JVM internals at production depth (GC tuning, GraalVM
native, AOT), Spring internals (auto-configuration import selectors,
FactoryBean lifecycle, BeanPostProcessor ordering), Project Loom and
structured concurrency, microservices at 200+ service scale, event-driven
architectures with exactly-once semantics, system design at multi-region
scale, Kubernetes platform engineering (operators, GitOps, service mesh
internals), production SRE (chaos engineering, change-failure-rate
budgets), and the staff / EM leadership questions that decide promotions.
If you have 3–7 years of Java experience, head to the intermediate page;
the depth here will exhaust you before it informs you.
```

## URL strategy

- App URL: `/interview/java-backend-advanced`
- Canonical SEO URL: `/java-interview-questions-for-experienced-senior`
- 301 redirects from:
  - `/java-staff-engineer-interview-questions` →
  - `/principal-engineer-interview-questions-java` →
  - `/java-tech-lead-interview-questions` →
  - `/senior-java-developer-interview-questions` →
  - `/java-architect-interview-questions`

## Current state

- `java-backend-advanced` does NOT exist on disk yet.
- Public visibility: OFF.
- Senior-IC Java interview content online is heavy on system design,
  light on staff-level leadership questions — clear differentiation gap.

## Target state (measurable for this spec playbook)

- Domain metadata block approved + committed.
- 14-module list approved with pillar assignments.
- Difficulty + archetype distribution targets approved (heavy hard).
- Search-phrase keyword map approved.
- Landing intro template approved.

## Failure modes & rollback

- **Spec proposes a "JBI advanced" relabel** rather than a distinct
  audience: refuse — JBA is for **staff+ leadership** questions, not
  just "harder Java".
- **Difficulty mix drifts toward medium:** refuse — JBA target is
  10/45/45 (40 %+ hard).
- **Spec proposes more than 14 modules:** trim — JBA is opinionated;
  more modules means thinner content.
- **A behavioral question is graded at "mid-level IC":** rewrite for
  staff/principal/EM framing (leadership, mentorship, influence).
- **Rollback:** revert the spec; no content yet.

## Quality gates (spec only)

| Gate                                                  | Threshold      |
| ----------------------------------------------------- | -------------- |
| Domain metadata block approved                        | yes            |
| 14 modules listed with pillar + Q targets             | yes            |
| Archetype distribution table reviewed                 | yes            |
| Search-phrase keyword map reviewed                    | yes            |
| Landing intro reviewed                                | yes            |

## Definition of Done

- [ ] This file lives at `expansion-plan/22-new-domain-java-backend-advanced-spec.md`.
- [ ] Spec is the canonical reference for playbook 23.
- [ ] `00-INDEX.md` row for `22` flipped to `DONE`.

## Estimated effort

- **Ideal:** 4 hours (review + sign-off).
- **Hard stop:** 8 hours.
