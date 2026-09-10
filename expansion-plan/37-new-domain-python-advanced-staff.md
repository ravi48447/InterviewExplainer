# 37 — New Domain: `python-backend-advanced` (FULL SPEC + ROLLOUT)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain spec + scaffold + content + launch in ONE playbook.

## TL;DR

- **Goal:** Python's JBA equivalent. Staff / Principal / EM track for
  Python engineers (8+ YOE).
- **Target Q at launch:** 600 across 14 modules.
- **Output:** Live at `/interview/python-backend-advanced`.

## Why a separate domain?

The senior Python audience interviews for:

1. Python platform engineering (tooling, build pipelines, internal SDKs).
2. Python-heavy data infra leadership (data platforms, ML platforms).
3. Mixed-language tech leads where Python is a primary stack.
4. Staff/Principal IC roles building Python services at scale.

PBI's depth is wrong for them: too much "what is X" not enough "how would
you migrate X at scale".

## Search phrases to own

| Search phrase                                          | Target page                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `senior python developer interview questions`         | (domain landing)                              |
| `staff engineer python interview questions`            | staff-engineer-leadership-python              |
| `principal engineer python interview questions`        | staff-engineer-leadership-python              |
| `python system design at scale interview questions`    | python-system-design-at-scale                 |
| `python distributed systems interview questions`       | python-distributed-systems                    |
| `engineering manager python interview questions`       | engineering-management-python                 |
| `python low latency interview questions`               | low-latency-python                            |
| `python performance interview questions`               | python-performance-deep                       |

## Current state

- `python-backend-advanced` does NOT exist on disk yet.
- Target audience (staff+ Python ICs) has weak public content — most
  staff-level interview content is Java-only.

## Target state (measurable)

- Domain scaffolded with 14 modules.
- ≥ 700 Q at launch; difficulty 10/45/45 (heavy hard).
- Speakable per-module pass+warn ≥ 90 %.

## Hard prerequisites

- [ ] Playbook 23 done (JBA pattern proven).
- [ ] PBI launched (playbook 35).

## Domain metadata

```json
{
  "domainSlug": "python-backend-advanced",
  "language": "python",
  "level": "advanced",
  "seoSlug": "python-interview-questions-for-senior-staff-engineers",
  "altSlugs": [
    "senior-python-developer-interview-questions",
    "staff-python-engineer-interview-questions",
    "principal-python-engineer-interview-questions",
    "python-architect-interview-questions",
    "python-tech-lead-interview-questions"
  ],
  "label": "Python Backend (Advanced)",
  "blurb": "Senior / Staff / Principal / EM-track Python backend interview prep — CPython internals at production depth, large-scale Python services, platform engineering, leadership.",
  "audience": "8+ YOE Python engineers; staff / principal / tech-lead / EM"
}
```

## Module specification (14 modules)

| #  | Module slug                                | Pillar | Min Q | Difficulty (E/M/H) |
| -- | ------------------------------------------ | ------ | ----- | ------------------ |
| 1  | `cpython-internals-deep`                   | P01    | 40    | 0/30/70           |
| 2  | `python-perf-at-production-scale`          | P11    | 40    | 0/30/70           |
| 3  | `python-async-and-concurrency-deep`        | P01    | 40    | 0/30/70           |
| 4  | `python-services-at-scale`                 | P02    | 50    | 0/25/75           |
| 5  | `python-data-platforms`                    | P03    | 40    | 0/30/70           |
| 6  | `python-event-driven-at-scale`             | P05    | 40    | 0/30/70           |
| 7  | `python-system-design-at-scale`            | P06    | 50    | 0/20/80           |
| 8  | `python-platform-engineering`              | P09    | 40    | 0/30/70           |
| 9  | `python-package-author-and-toolmaker`      | P09    | 30    | 0/35/65           |
| 10 | `python-distributed-systems`               | P06    | 40    | 0/25/75           |
| 11 | `python-multi-region-and-cost`             | P10    | 30    | 0/40/60           |
| 12 | `python-production-sre-deep`               | P11    | 40    | 0/30/70           |
| 13 | `staff-engineer-leadership-python`         | P12    | 70    | 0/30/70           |
| 14 | `engineering-management-python`            | P12    | 50    | 0/30/70           |

**Total minimum: 600 Q.**

## Content rules (same as JBA + Python-specific)

- Every answer cites a number where applicable.
- Every behavioral story names ≥ 2 stakeholders by role.
- No archetype D (algorithms) or F (api ref).
- Python 3.12+ default; explicit annotations on what's 3.13 / free-threaded only.
- CPython internals references cite specific CPython files / PEP numbers
  where useful (e.g. "ceval.c", "PEP 703", "PEP 684").

## Module mini-blueprints

### 37.1 — `cpython-internals-deep` (40 Q)

Topics:
- `cpython-execution-model` (6 Q): ceval.c, bytecode, frame objects
- `gil-implementation` (6 Q): refcount lock, GIL release points, PEP 703
- `subinterpreters` (4 Q): PEP 684, PEP 734
- `garbage-collector-deep` (6 Q): gen-counts, cycle collector, gc.callbacks
- `c-api-and-extensions` (5 Q): writing C extensions, capsules, ABI vs API
- `import-system-internals` (4 Q): finders, loaders, namespace packages
- `optimisations` (5 Q): peephole, specializing adaptive interpreter (3.11+)
- `comparisons` (4 Q): CPython vs PyPy vs Pyston vs RustPython

### 37.2 — `python-perf-at-production-scale` (40 Q)

Topics:
- `profiling-prod-deep` (8 Q): continuous profiling, sampling vs deterministic
- `c-acceleration` (5 Q): Cython, mypyc, pybind11, ctypes, cffi
- `numpy-and-vectorisation` (5 Q)
- `pypy-decision-criteria` (4 Q)
- `gil-bound-vs-cpu-bound-vs-io-bound` (5 Q)
- `memory-budget-tuning` (5 Q): __slots__, weakref, gc tuning
- `comparisons` (4 Q)
- `scenario` (4 Q)

### 37.3 — `python-async-and-concurrency-deep` (40 Q)

Topics:
- `asyncio-internals` (8 Q): event loop, selectors, transports, tasks
- `structured-concurrency-deep` (6 Q): TaskGroup, cancellation, exception groups
- `trio-anyio-vs-asyncio` (5 Q)
- `gil-free-threaded-3-13` (5 Q): PEP 703, when to switch
- `process-pools-at-scale` (4 Q)
- `mixing-async-and-sync-in-prod` (5 Q)
- `comparisons` (4 Q): asyncio vs trio vs anyio
- `scenario` (3 Q)

### 37.4 — `python-services-at-scale` (50 Q)

Topics:
- `fastapi-at-scale` (8 Q): worker model, async DB pool sizing, lifespan
- `django-at-scale` (8 Q): channels, async views, scaling synchronous Django
- `service-decomposition-python` (6 Q)
- `library-vs-service-decisions` (5 Q)
- `multi-tenancy-python-services` (6 Q)
- `python-and-graphql-at-scale` (5 Q)
- `migrating-from-flask-to-fastapi` (4 Q)
- `comparisons` (5 Q)
- `scenario` (3 Q)

### 37.5 — `python-data-platforms` (40 Q)

Topics:
- `python-and-data-warehouses` (5 Q): Snowflake, BigQuery, Redshift from Python
- `dbt-with-python` (4 Q)
- `spark-python-pyspark` (8 Q): RDD vs DataFrame, UDFs, Pandas-on-Spark
- `airflow-deep` (6 Q): DAGs, operators, executors, K8s executor
- `prefect-and-dagster` (4 Q)
- `data-quality-tools` (4 Q): great-expectations, pandera
- `comparisons` (5 Q): Airflow vs Prefect vs Dagster; Spark vs Dask vs Ray
- `scenario` (4 Q)

### 37.6 — `python-event-driven-at-scale` (40 Q)

Topics:
- `kafka-python-at-scale` (8 Q): consumer pool sizing, async vs sync clients
- `event-sourcing-python` (6 Q)
- `outbox-pattern-python` (4 Q)
- `schema-registry-strategy-python` (4 Q)
- `cdc-with-python` (4 Q)
- `streaming-pipelines-python` (6 Q)
- `comparisons` (4 Q)
- `scenario` (4 Q)

### 37.7 — `python-system-design-at-scale` (50 Q, 80 % archetype C)

20 cases × ~2.5 Q each (one main case Q + supporting). Cases:

1. Real-time analytics ingestion (Python + Kafka + ClickHouse)
2. Multi-tenant FastAPI SaaS at 50 k tenants
3. ML feature store with Python serving
4. Real-time recommendation service in Python
5. Geo-distributed FastAPI with Postgres
6. Background-job orchestration at 10 M jobs/day
7. Notification platform built in Python (Email + SMS + push)
8. Search service in Python (Elasticsearch + Python)
9. Distributed scheduler in Python (Airflow alternative)
10. Idempotent payment processor in FastAPI
11. CDC pipeline with Debezium + Python consumers
12. Logging pipeline built in Python (10 TB/day)
13. Multi-region writeback (eventual consistency reconciliation)
14. Hot-key cache strategy with Python services
15. Webhook delivery service at scale
16. Audit log infrastructure in Python
17. ETL platform for B2B SaaS (multi-tenant)
18. Real-time fraud scoring with Python
19. Image / video processing pipeline (Python + workers)
20. Multi-cloud deploy strategy for Python services

Each: capacity calc + mermaid + cost section + multi-region follow-up.

### 37.8 — `python-platform-engineering` (40 Q)

Topics:
- `internal-sdks-and-codegen-python` (6 Q)
- `python-build-systems-at-scale` (6 Q): Bazel, monorepos, sccache
- `dependency-management-at-scale` (5 Q): private indices, version policy
- `docker-images-at-scale-python` (5 Q): base-image strategy, security
- `kubernetes-platform-for-python` (6 Q)
- `developer-experience-and-tooling` (4 Q)
- `comparisons` (4 Q)
- `scenario` (4 Q)

### 37.9 — `python-package-author-and-toolmaker` (30 Q)

Topics:
- `building-and-publishing` (6 Q)
- `pyproject-toml-mastery` (6 Q)
- `entry-points-and-plugins` (4 Q)
- `version-and-release-strategies` (4 Q)
- `compatibility-policy` (3 Q)
- `documentation-tooling` (3 Q): sphinx, mkdocs
- `comparisons` (2 Q)
- `scenario` (2 Q)

### 37.10 — `python-distributed-systems` (40 Q)

Same shape as JBA `distributed-systems-deep`. Pillars: consensus
(Raft, Paxos), time/ordering, CRDTs, distributed transactions,
quorum tuning. Examples cite Python libs (etcd-py, kazoo, raftos).

### 37.11 — `python-multi-region-and-cost` (30 Q)

Topics: finops basics, cross-region data transfer, RPO/RTO, lambda vs
container cost in Python, data residency. Examples cite Python-AWS cost
patterns (boto3 + Lambda layer sizes etc.).

### 37.12 — `python-production-sre-deep` (40 Q)

Same shape as JBA `production-sre-deep`. Python-flavoured stories.

### 37.13 — `staff-engineer-leadership-python` (70 Q — 80 % G)

Topics: Same as JBA 23.13. Voice rules identical. Stories must be
Python-specific (e.g. "I led a 4-team migration from Django to FastAPI"
or "I drove adoption of mypy strict across 90 services").

### 37.14 — `engineering-management-python` (50 Q)

Topics: Hiring rubrics for Python roles, calibration, performance reviews,
EM-vs-IC track, org design for Python platform vs product teams.

## Execution steps

### Step A — Scaffold

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 scripts/new_locked_domain.py \
  --slug python-backend-advanced \
  --label "Python Backend (Advanced)" \
  --language python --level advanced \
  --seo-slug python-interview-questions-for-senior-staff-engineers \
  --alt-slug senior-python-developer-interview-questions \
  --alt-slug staff-python-engineer-interview-questions \
  --alt-slug principal-python-engineer-interview-questions \
  --alt-slug python-architect-interview-questions \
  --alt-slug python-tech-lead-interview-questions \
  --modules \
    cpython-internals-deep:P01 \
    python-perf-at-production-scale:P11 \
    python-async-and-concurrency-deep:P01 \
    python-services-at-scale:P02 \
    python-data-platforms:P03 \
    python-event-driven-at-scale:P05 \
    python-system-design-at-scale:P06 \
    python-platform-engineering:P09 \
    python-package-author-and-toolmaker:P09 \
    python-distributed-systems:P06 \
    python-multi-region-and-cost:P10 \
    python-production-sre-deep:P11 \
    staff-engineer-leadership-python:P12 \
    engineering-management-python:P12
```

### Step B — Content

Write 600 Q per the blueprints above, archetype + difficulty correct.

### Step C — Cross-links

PBA → PBI on every module that overlaps:

| PBA module                       | Cross-link target (PBI)              |
| -------------------------------- | ------------------------------------ |
| cpython-internals-deep           | python-language-core                  |
| python-perf-at-production-scale  | python-performance-and-profiling      |
| python-async-and-concurrency-deep| python-asyncio-and-concurrency        |
| python-services-at-scale         | fastapi-fundamentals / django-fundamentals |
| python-system-design-at-scale    | python-system-design                  |
| python-production-sre-deep       | python-observability-production       |

### Step D — Launch

```typescript
{
  title:      'Python for Staff / Principal',
  audience:   'advanced',
  language:   'python',
  href:       '/interview/python-backend-advanced',
  description:'Staff, Principal, EM track Python prep — CPython internals, services at scale, leadership.',
},
```

Commit + tag `pba-launch-<YYYY-MM-DD>`.

## Quality gates

| Gate                                                  | Threshold     |
| ----------------------------------------------------- | ------------- |
| 14 modules at Q target                                | 14 of 14      |
| 20 system-design cases with mermaid                   | 20 of 20      |
| Behavioral G archetype                                | ≥ 80 %        |
| Behavioral stories cite Python decision               | spot 10/10    |
| Speakable domain pass+warn                            | ≥ 88 %        |
| 5 SEO/alt URLs 301                                    | 5 of 5        |
| Tile live                                             | yes           |

## Failure modes & rollback

- **Difficulty mix drifts toward medium** (40 %+ medium): block —
  PBA is staff-level; the target is 10/45/45 with hard ≥ 40 %.
- **Staff-leadership Q drifts to a tech-only answer:** add the
  leadership dimension (mentorship, RFC influence, hiring).
- **A "system design at scale" Q copies the JBI case** without
  Python-specific notes (asyncio, GIL, gunicorn workers): rewrite
  with Python production realities.
- **Speakable lint fails on a Q with embedded mermaid:** keep mermaid
  in the `diagram` section; in `speakable.summary` use prose.
- **You hit hard stop with modules thin:** record per-module Q count;
  surface to user.
- **Rollback:** remove the domain from `LOCKED_DOMAINS` /
  `LAUNCH_QUICK_PATHS`; content stays on disk.

## Definition of Done

- [ ] All quality gates pass.
- [ ] Tag `pba-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `37` flipped to `DONE`.

## Estimated effort

- **Ideal:** 140 hours.
- **Hard stop:** 200 hours.
