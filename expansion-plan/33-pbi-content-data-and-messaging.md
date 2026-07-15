# 33 — PBI Content: Data, APIs, Messaging (DEEP)

> **Executor:** AI coding agent working across 8 parallel sub-runs.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content writing for PBI modules 15–23 (~370 questions).

---

## §0 — Front-matter

```yaml
playbook:    33
version:     1.0
status:      ready
wave:        D
domain:      python-backend-intermediate
modules:     9   # modules 15-23
q_target:    370
archetypes:  A:30% B:30% C:30% G:10%
difficulty:  E:20 M:55 H:25
version_pins:
  python: "3.12"
  sqlalchemy: "2.0"
  alembic: "1.13"
  redis_py: "5.0"
  kafka_python: "2.0"
  celery: "5.4"
  httpx: "0.27"
  pydantic: "2.7"
depends_on:  [29, 30, 31, 32]
```

---

## §1 — TL;DR

- **Input:** Playbook 32 underway / done.
- **Action:** Fill 8 data/API/messaging modules.
- **Output:** Each module meets Q target + lint clean; cross-links to PBI
  language modules where natural.

## Why this matters (2 sentences)

Data persistence + messaging are the **highest-value mid-funnel content
in PBI** — once a user finds the language-core page, they immediately
need PostgreSQL / Redis / Kafka content tuned for Python (SQLAlchemy
patterns, asyncpg vs psycopg, aiokafka). Owning these queries with
Python-native examples (not Java translations) is what separates a
Python-native content site from a generic "interview questions" aggregator.

## Search phrases to own

| Search phrase                                          | Owner module               |
| ------------------------------------------------------ | -------------------------- |
| `sqlalchemy interview questions`                       | sqlalchemy-orm-python      |
| `python postgresql interview questions`                | postgresql-python          |
| `asyncpg interview questions`                          | postgresql-python          |
| `python mongodb interview questions`                   | mongodb-python             |
| `python redis interview questions`                     | redis-python               |
| `celery interview questions`                           | celery-and-task-queues     |
| `python kafka interview questions`                     | kafka-python               |
| `aiokafka interview questions`                         | kafka-python               |
| `rabbitmq python interview questions`                  | rabbitmq-python            |
| `python rest api interview questions`                  | python-rest-api            |
| `python graphql interview questions`                   | python-graphql             |
| `python grpc interview questions`                      | python-grpc                |
| `python microservices interview questions`             | python-microservices       |

## Current state

- Module folders exist (post-31); content thin.
- No Python-specific data-access code samples yet.

## Target state (measurable)

- Module Q targets per mini-blueprints below.
- All examples use Python-native libraries (asyncpg, motor, aiokafka,
  aioredis) where async is appropriate; sync libs only where
  realistic.
- Speakable per-module pass+warn ≥ 90 %.

## Hard prerequisites

- [ ] Playbook 31 is DONE (scaffold).
- [ ] Playbook 30 spec open.

## Mini-blueprints

### 33.1 — `sqlalchemy-deep-dive` (60 Q)

Topics:
- `core-vs-orm` (5 Q)
- `engines-and-connections` (5 Q): pooling, NullPool, lifecycle
- `sessions-and-units-of-work` (6 Q): autoflush, autoupgrade, scoped session
- `query-construction-2-0` (8 Q): select() style, execute()/scalars(), fetch modes
- `relationships-and-loading` (8 Q): joined / selectin / subquery / lazy
- `async-sqlalchemy` (6 Q): create_async_engine, AsyncSession
- `migrations-with-alembic` (4 Q)
- `events-and-hooks` (3 Q)
- `bulk-operations` (4 Q)
- `comparisons` (6 Q)
- `scenario-based` (5 Q)

Money: `SQLAlchemy Core vs ORM`, `selectinload vs joinedload`, `Async SA vs sync SA`.

Worked example (async session + selectinload):

```json
{
  "id": "sqlalchemy-async-session-with-selectinload",
  "title": "How do you fetch a parent with its children efficiently in async SQLAlchemy 2.0?",
  "difficulty": "medium",
  "archetype": "A",
  "tags": ["sqlalchemy", "async", "python"],
  "sections": [
    { "kind": "headline", "value": "Use AsyncSession with selectinload() in the query so SQLAlchemy issues a single follow-up SELECT for the children, avoiding the N+1 problem and avoiding lazy I/O outside the session." },
    { "kind": "why",      "value": "Async sessions can't trigger lazy I/O outside an explicit await, so default lazy loading raises. selectinload() eagerly loads the relationship with a separate IN-list query — much faster than joinedload() for one-to-many on large rowcounts and works cleanly with async." },
    { "kind": "code", "language": "python", "value": "from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine\nfrom sqlalchemy import select\nfrom sqlalchemy.orm import selectinload\n\nengine = create_async_engine('postgresql+asyncpg://...', pool_size=10)\nSession = async_sessionmaker(engine, expire_on_commit=False)\n\nasync def get_user_with_orders(user_id: int):\n    async with Session() as s:\n        stmt = (\n            select(User)\n            .options(selectinload(User.orders))\n            .where(User.id == user_id)\n        )\n        return (await s.execute(stmt)).scalar_one_or_none()" },
    { "kind": "tradeoffs", "value": "joinedload() is one SELECT with a LEFT JOIN — better for one-to-one or many-to-one but bloats result sets for one-to-many (Cartesian product). selectinload() is two queries but the second is O(parents) IN — almost always faster for one-to-many." },
    { "kind": "followups", "value": [
      "What is the N+1 problem and how does SQLAlchemy detect it at dev time?",
      "When would you prefer joinedload over selectinload?",
      "How do you stream very large result sets in async SQLAlchemy?"
    ]}
  ],
  "speakable": { "summary": "Use AsyncSession with selectinload to fetch parent + children in two queries; avoid lazy I/O outside the session and the N+1 trap. joinedload uses one query with a LEFT JOIN but bloats one-to-many results. selectinload almost always wins for one-to-many.", "isCanonical": true }
}
```

### 33.2 — `django-orm-deep-dive` (50 Q)

Topics: `queryset-fundamentals` (6), `select-related-vs-prefetch-related` (6),
`f-q-expressions` (5), `annotations-and-aggregations` (5),
`raw-and-extra` (3), `transactions-and-atomic` (5),
`prefetch-objects-advanced` (4), `index-and-constraints` (4),
`querycount-and-debug` (3), `comparisons` (5), `scenario-based` (4).

Money: `select_related vs prefetch_related`.

### 33.3 — `database-and-sql-python` (50 Q)

Topics:
- `psycopg-vs-asyncpg` (6 Q)
- `transactions-and-isolation` (6 Q)
- `connection-pooling` (5 Q): pgbouncer modes, pool sizes
- `prepared-statements` (4 Q)
- `bulk-inserts` (4 Q): COPY vs execute_values vs ORM bulk_insert
- `json-and-jsonb-python` (5 Q)
- `postgres-specifics-from-python` (6 Q): LISTEN/NOTIFY, advisory locks
- `mysql-and-mariadb-from-python` (3 Q)
- `sqlite-from-python` (3 Q): WAL mode, in-memory test DB
- `comparisons` (4 Q)
- `scenario-based` (4 Q)

Money: `psycopg vs asyncpg vs SQLAlchemy`.

### 33.4 — `caching-redis-python` (40 Q)

Topics: `redis-py-basics` (6), `async-redis-py` (5), `data-types-from-python` (4),
`pipelines-and-transactions` (4), `pubsub-from-python` (3),
`distributed-locks-redis-py` (5), `rate-limiting-redis-py` (4),
`celery-and-redis` (3), `caching-patterns-python` (5),
`comparisons` (3), `scenario` (3).

### 33.5 — `rest-api-design-python` (50 Q)

Topics:
- `http-and-status-codes-python` (5 Q)
- `pagination-cursor-vs-offset` (5 Q)
- `versioning` (4 Q)
- `errors-and-problem-details` (5 Q): RFC 7807 from FastAPI/DRF
- `idempotency` (5 Q): Idempotency-Key in FastAPI, DRF
- `pagination-libraries` (3 Q)
- `openapi-and-schema-design` (5 Q)
- `rate-limiting-python` (4 Q)
- `webhooks-and-async` (5 Q)
- `comparisons` (5 Q)
- `scenario-based` (4 Q)

### 33.6 — `graphql-python` (30 Q)

Topics: `strawberry-fundamentals` (6), `graphene-fundamentals` (5),
`ariadne-and-schema-first` (3), `n-plus-one-and-dataloader-python` (5),
`schema-design-python-graphql` (4), `subscriptions-graphql-python` (3),
`comparisons` (2), `scenario` (2).

### 33.7 — `celery-and-task-queues` (50 Q)

Topics:
- `celery-fundamentals` (8 Q): brokers (Redis, RabbitMQ), result backends, workers
- `tasks-and-routing` (6 Q): bind, retry, autoretry_for, exponential backoff
- `periodic-and-beat` (5 Q): celery beat, schedules
- `result-backends-deep` (4 Q): ignore_result, expiry
- `monitoring-celery` (4 Q): flower, prometheus exporter
- `rq-fundamentals` (5 Q)
- `dramatiq-fundamentals` (4 Q)
- `task-design-patterns` (6 Q): idempotency, fan-out, chains/groups/chords
- `comparisons` (5 Q): Celery vs RQ vs Dramatiq
- `scenario-based` (3 Q)

### 33.8 — `kafka-with-python` (40 Q)

Topics: `confluent-kafka-vs-aiokafka-vs-kafka-python` (5),
`producers-and-delivery-guarantees` (5),
`consumers-and-consumer-groups` (6),
`exactly-once-from-python` (4),
`schema-registry-with-python` (4),
`serialisation-avro-json-protobuf-python` (4),
`error-handling-and-dlq-from-python` (4),
`backpressure-from-python` (3),
`comparisons` (3), `scenario` (2).

### 33.9 — `python-microservices` (50 Q)

Topics: `service-decomposition-python` (6),
`inter-service-communication-python` (6) — REST vs gRPC vs message queue,
`api-gateways-python` (4) — Kong, Traefik, custom FastAPI gateway,
`resilience-patterns-python` (6) — tenacity, circuit breaker libs,
`distributed-tracing-python` (5) — OTel-python,
`service-discovery-python` (3),
`config-and-secrets-python` (4),
`mesh-and-sidecars-from-python` (3),
`saga-orchestration-python` (4),
`comparisons` (4), `scenario` (5).

## Quality gates

| Gate                                          | Threshold     | Verify with                                                              |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| 8 module Q targets met                        | 8 of 8        | jq                                                                       |
| Per-module speakable pass+warn                | ≥ 90 %        | `audit_speakable.py --module`                                            |
| All money comparisons live                    | 100 %         | manual                                                                   |
| SA 2.0 style examples (`select()`, not `query`) | 100 %       | `rg -n 'session\\.query\\(' content/python-backend-intermediate/sqlalchemy-deep-dive/` → only comparison topic |
| asyncpg / psycopg3 syntax (not psycopg2)      | ≥ 90 %        | `rg -n 'import psycopg2' content/python-backend-intermediate/database-and-sql-python/` → only comparison topic |

## Failure modes & rollback

- **SQLAlchemy example mixes 1.x and 2.x syntax** (e.g.
  `Session.query()` alongside `session.execute(select(...))`):
  pick 2.x exclusively. Note 1.x → 2.x migration in a separate Q.
- **Postgres example uses psycopg2** in an async function: rewrite
  with `asyncpg` (the canonical async Postgres driver) or call out
  the explicit reason for blocking driver.
- **Kafka example uses sync `kafka-python` in an asyncio app:**
  rewrite with `aiokafka`.
- **Redis example doesn't address pipelining / connection-pool
  sizing:** add it; these are the most-asked Python-Redis production
  trade-offs.
- **MongoDB example shows pymongo only**, ignoring `motor` for async:
  add a motor section for the async-context Q.
- **Celery example omits broker / result-backend distinction:** add
  it; this is a top mistake in Celery interviews.
- **You hit the hard stop with modules still thin:** record per-module
  Q count and surface.
- **Rollback (per module):** revert the most recent N commits on that
  module path.

## Definition of Done

- [ ] 8 modules meet Q + lint gates.
- [ ] `00-INDEX.md` row for `33` flipped to `DONE`.

## Estimated effort

- **Ideal:** 60 hours.
- **Hard stop:** 90 hours.
