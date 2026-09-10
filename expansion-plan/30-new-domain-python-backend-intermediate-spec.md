# 30 — New Domain: `python-backend-intermediate` (FULL SPEC)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain blueprint. Source of truth for PBI.
> Playbooks 31–35 implement scaffold, content, launch.

## TL;DR

- **Goal:** PBI is Python's JBI — the flagship Python backend domain.
- **Audience:** 3–7 YOE Python backend (FastAPI / Django / Flask /
  Celery / postgres / Redis / Docker / K8s).
- **Pillars used:** all 12 (P01..P12), Python-flavoured.
- **Target total Q at launch:** 1800. (JBI launched in the 6 k range
  after years; PBI launches lean and grows.)

## Why this matters (2 sentences)

PBI is the **anchor of the entire Python rollout** — every later Python
domain (PBB, PBA, PDE, PML, PFS) reuses PBI modules via `contentSource`
or extends PBI's archetype set. Spec quality here decides the quality
ceiling for the next 4500+ Python questions across five domains, which
is why this playbook is spec-only (no content yet) and demands explicit
sign-off before scaffold (playbook 31) runs.

## Current state

- PBI exists on disk as a partial scaffold (35 module folders, ~18 Q
  total).
- `_index.json` declares modules but most are empty.
- Public visibility: OFF (not in `LAUNCH_QUICK_PATHS`).

## Target state (measurable for this spec playbook)

- Domain metadata block approved and committed.
- 28-module list approved.
- Per-module pillar assignment approved.
- Difficulty + archetype distribution targets approved.
- Search-phrase keyword map (40 entries) approved.
- Money comparison list approved (≥ 30 comparisons).

## Hard prerequisites

- [ ] Playbook 29 strategy approved.
- [ ] `frontend/lib/pillars.ts` carries `PYTHON_PILLARS` (or will, in
      playbook 31).

## Domain metadata

```json
{
  "domainSlug": "python-backend-intermediate",
  "language": "python",
  "level": "intermediate",
  "seoSlug": "python-interview-questions",
  "altSlugs": [
    "python-developer-interview-questions",
    "python-backend-developer-interview-questions",
    "python-interview-questions-for-experienced",
    "fastapi-interview-questions",
    "django-interview-questions",
    "flask-interview-questions"
  ],
  "label": "Python Backend (Intermediate)",
  "blurb": "Python backend interview prep for 3–7 YOE engineers: language internals, FastAPI / Django / Flask, async + concurrency, data access (SQLAlchemy + Django ORM + raw drivers), testing, observability, deploy.",
  "audience": "3-7 YOE Python backend engineers"
}
```

## Module specification (28 modules)

| #  | Module slug                          | Pillar | Min Q | Notes                                                                |
| -- | ------------------------------------ | ------ | ----- | -------------------------------------------------------------------- |
| 1  | `python-language-core`               | P01    | 80    | Data model, descriptors, MRO, mutability, GIL                          |
| 2  | `python-oop-and-design`              | P01    | 50    | Dunder methods, dataclasses, ABCs, protocols, typing                  |
| 3  | `python-functional-and-iterators`    | P01    | 50    | Iterators, generators, comprehensions, functools, itertools           |
| 4  | `python-asyncio-and-concurrency`     | P01    | 70    | asyncio, GIL, threading, multiprocessing, sync vs async                |
| 5  | `python-stdlib-deep-dive`            | P01    | 50    | collections, functools, contextlib, pathlib, datetime, re             |
| 6  | `python-modules-and-packaging`       | P01    | 40    | Imports, namespace packages, pyproject.toml, poetry, uv                |
| 7  | `python-performance-and-profiling`   | P11    | 35    | cProfile, py-spy, pyinstrument, line_profiler; CPython optimisation     |
| 8  | `python-memory-and-gc`               | P11    | 30    | Reference counting, gc module, weakref, leaks                          |
| 9  | `fastapi-fundamentals`               | P02    | 60    | Routing, deps, pydantic v2, background tasks                            |
| 10 | `fastapi-advanced`                   | P02    | 50    | Custom middleware, dependency injection, OpenAPI customisation         |
| 11 | `django-fundamentals`                | P02    | 60    | Models, views, templates, ORM, admin                                    |
| 12 | `django-advanced`                    | P02    | 50    | Custom auth, signals, middleware, channels                              |
| 13 | `django-rest-framework`              | P02    | 50    | Serializers, viewsets, permissions, pagination, throttling              |
| 14 | `flask-fundamentals`                 | P02    | 40    | Routing, blueprints, extensions, app factory                            |
| 15 | `sqlalchemy-deep-dive`               | P03    | 60    | Core vs ORM, sessions, async, query construction                        |
| 16 | `django-orm-deep-dive`               | P03    | 50    | QuerySet API, select_related vs prefetch_related, F/Q                  |
| 17 | `database-and-sql-python`            | P03    | 50    | Postgres, MySQL, transactions, isolation, drivers (psycopg, asyncpg)     |
| 18 | `caching-redis-python`               | P03    | 40    | redis-py, async client, locks, rate-limit, queues                        |
| 19 | `rest-api-design-python`             | P04    | 50    | Pagination, versioning, OpenAPI, problem+JSON                            |
| 20 | `graphql-python`                     | P04    | 30    | Strawberry, Graphene, ariadne                                            |
| 21 | `celery-and-task-queues`             | P05    | 50    | Celery, RQ, Dramatiq; retries, periodic, results, transports             |
| 22 | `kafka-with-python`                  | P05    | 40    | confluent-kafka, aiokafka, consumer groups, EOS                           |
| 23 | `python-microservices`               | P05    | 50    | Service decomposition, IPC choices, resilience patterns                  |
| 24 | `python-system-design`               | P06    | 40    | Architecture patterns Python-flavoured                                    |
| 25 | `python-application-security`        | P07    | 40    | OWASP Top 10 in Python, secrets, JWT, dependency CVEs                    |
| 26 | `python-testing-pytest`              | P08    | 60    | pytest, fixtures, parametrize, mock, hypothesis, coverage                |
| 27 | `python-devops-docker-k8s`           | P09    | 50    | Multi-stage docker, slim/distroless, K8s for Python services             |
| 28 | `python-observability-production`    | P11    | 45    | structlog, OTel-python, py-spy, prometheus_client                         |
| +  | `python-behavioral-and-stories`      | P12    | 75    | STAR with Python-specific projects                                       |

**Total minimum: ~1820 Q.**

## Difficulty distribution (per module, default)

30 % easy / 50 % medium / 20 % hard. Concurrency / async modules tilt
harder (20 / 50 / 30). Beginner-flavoured topics inside PBI don't exist
— send those readers to PBB.

## Archetype distribution (per module, default)

A = 40 %, B = 30 %, C = 15 %, D = 5 %, E = 5 %, F = 0 %, G = 5 %.
`python-behavioral-and-stories` is G = 95 %.

## Search-phrase keyword map (top 40)

| Search phrase                                          | Owner module                          |
| ------------------------------------------------------ | ------------------------------------- |
| `python interview questions`                           | (domain landing)                      |
| `python interview questions for experienced`           | (domain landing)                      |
| `python coding interview questions`                    | python-language-core                  |
| `python decorators interview questions`                | python-functional-and-iterators       |
| `python generators interview questions`                | python-functional-and-iterators       |
| `gil python interview questions`                       | python-asyncio-and-concurrency        |
| `asyncio interview questions`                          | python-asyncio-and-concurrency        |
| `multithreading vs multiprocessing python`             | python-asyncio-and-concurrency        |
| `python oop interview questions`                       | python-oop-and-design                 |
| `python dataclass interview questions`                 | python-oop-and-design                 |
| `python typing interview questions`                    | python-oop-and-design                 |
| `python design patterns interview questions`           | python-system-design                  |
| `fastapi interview questions`                          | fastapi-fundamentals                  |
| `fastapi vs django vs flask`                           | (cross-module comparisons)            |
| `pydantic interview questions`                         | fastapi-fundamentals                  |
| `django interview questions`                           | django-fundamentals                   |
| `django rest framework interview questions`            | django-rest-framework                 |
| `flask interview questions`                            | flask-fundamentals                    |
| `sqlalchemy interview questions`                       | sqlalchemy-deep-dive                  |
| `django orm interview questions`                       | django-orm-deep-dive                  |
| `n+1 problem python`                                   | sqlalchemy-deep-dive / django-orm     |
| `celery interview questions`                           | celery-and-task-queues                |
| `redis python interview questions`                     | caching-redis-python                  |
| `python microservices interview questions`             | python-microservices                  |
| `python rest api interview questions`                  | rest-api-design-python                |
| `pytest interview questions`                           | python-testing-pytest                 |
| `python testing interview questions`                   | python-testing-pytest                 |
| `python docker interview questions`                    | python-devops-docker-k8s              |
| `python kubernetes interview questions`                | python-devops-docker-k8s              |
| `python logging interview questions`                   | python-observability-production       |
| `python tracing interview questions`                   | python-observability-production       |
| `python jwt interview questions`                       | python-application-security           |
| `python security interview questions`                  | python-application-security           |
| `python performance interview questions`               | python-performance-and-profiling      |
| `python memory management interview questions`         | python-memory-and-gc                  |
| `python behavioral interview questions`                | python-behavioral-and-stories         |
| `tell me about yourself python developer`              | python-behavioral-and-stories         |

## Money comparison questions (canonical list — write EXACTLY)

Across the domain, the following pair-comparison questions MUST exist:

1. `Python list vs tuple vs set vs dict` (python-language-core)
2. `is vs == in Python` (python-language-core)
3. `Shallow copy vs deep copy in Python` (python-language-core)
4. `Mutable vs immutable types in Python` (python-language-core)
5. `Decorators vs context managers` (python-functional-and-iterators)
6. `Iterators vs generators` (python-functional-and-iterators)
7. `Generator function vs generator expression` (python-functional-and-iterators)
8. `*args vs **kwargs` (python-language-core)
9. `Classmethod vs staticmethod vs instance method` (python-oop-and-design)
10. `@property vs descriptor protocol` (python-oop-and-design)
11. `Dataclass vs NamedTuple vs TypedDict vs Pydantic BaseModel` (python-oop-and-design)
12. `Threading vs multiprocessing vs asyncio` (python-asyncio-and-concurrency)
13. `GIL vs no GIL (3.13+ free-threaded build)` (python-asyncio-and-concurrency)
14. `async def vs def in FastAPI route` (fastapi-fundamentals)
15. `FastAPI vs Django vs Flask` (cross-module — pick one home, link from others)
16. `Django REST Framework vs FastAPI` (django-rest-framework)
17. `SQLAlchemy Core vs ORM` (sqlalchemy-deep-dive)
18. `select_related vs prefetch_related (Django)` (django-orm-deep-dive)
19. `Async SQLAlchemy vs sync SQLAlchemy` (sqlalchemy-deep-dive)
20. `psycopg vs asyncpg vs SQLAlchemy` (database-and-sql-python)
21. `Celery vs RQ vs Dramatiq` (celery-and-task-queues)
22. `Kafka vs RabbitMQ for Python services` (kafka-with-python)
23. `unittest vs pytest` (python-testing-pytest)
24. `mock vs MagicMock vs AsyncMock` (python-testing-pytest)
25. `pip vs poetry vs uv` (python-modules-and-packaging)
26. `Gunicorn vs Uvicorn vs Hypercorn` (python-devops-docker-k8s)
27. `WSGI vs ASGI` (python-devops-docker-k8s)
28. `logging vs structlog vs loguru` (python-observability-production)

## Landing intro template

```text
Python Interview Questions for 3–7 YOE Backend Engineers

This page covers what real Python backend interviews actually probe in
2026 — the Python data model and CPython internals (descriptors, MRO,
reference counting, the GIL and 3.13's free-threaded build), the three
production web frameworks engineers are hired around (FastAPI for new
services, Django for product-shaped CRUD, Flask for surface APIs), the
database layer most teams actually run (SQLAlchemy or Django ORM over
PostgreSQL with Redis for caching and Celery or Kafka for async work),
and the production realities — pytest test suites, OpenTelemetry-Python
tracing, Docker + Kubernetes deploys, OWASP-aware security. Every answer
targets Python 3.12+ with type hints, async-aware code, and the
benchmarking honesty that production Python demands ("yes the GIL is
real, here's when it bites you, and here's when it doesn't"). For
freshers we have a separate Python Beginner page; for data engineering,
ML, or fullstack Python we have dedicated pages too. This page is for
the Python backend engineer who is already shipping services and now
needs to interview at the next tier.
```

## URL strategy

- App URL: `/interview/python-backend-intermediate`
- Canonical SEO URL: `/python-interview-questions`
- 301 from:
  - `/python-developer-interview-questions`
  - `/python-backend-developer-interview-questions`
  - `/python-interview-questions-for-experienced`
  - `/fastapi-interview-questions`
  - `/django-interview-questions`
  - `/flask-interview-questions`

## Quality gates (spec)

| Gate                                                | Threshold |
| --------------------------------------------------- | --------- |
| Domain metadata block approved                      | yes       |
| 28 modules listed with pillar + Q targets           | yes       |
| Difficulty + archetype distribution table reviewed  | yes       |
| Money comparison list reviewed                      | yes       |

## Failure modes & rollback

- **Spec approves a module not in JBI's pillar map** (e.g. a P13
  pillar): refuse — Python stays on the 12-pillar system.
- **Spec approves a Python-only library version** that's unstable
  (e.g. pre-release pydantic v3): pin to current stable.
- **Search-phrase map collides with JBI's** (e.g. claims
  "interview questions" generic page): each domain owns level + language
  pages — the generic "interview questions" page lives at the JBI level.
- **Difficulty mix drifts toward easy** (40 % easy or more): block —
  PBI is intermediate; the target is 30/50/20.
- **Rollback:** revert the spec; no content yet, so revert is cheap.

## Definition of Done

- [ ] Spec is the canonical reference for playbooks 31–35.
- [ ] `00-INDEX.md` row for `30` flipped to `DONE`.

## Estimated effort

- **Ideal:** 8 hours.
- **Hard stop:** 16 hours.
