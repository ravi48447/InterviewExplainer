# 75 — Database Deep-Dive Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from JBI 14 (data-persistence), PBI 33 (data-and-messaging), and new database-cross-cutting modules (PostgreSQL deep, MySQL deep, MongoDB deep, Redis deep, Cassandra/ScyllaDB, DynamoDB, vector DBs, OLAP).
> **Depends on:** 14 (JBI data-persistence), 33 (PBI data-and-messaging), 41 (interview-qa-hub pattern).

## TL;DR

- **Goal:** A single browsable hub for **database** content — relational (PostgreSQL, MySQL), document (MongoDB), key-value (Redis), wide-column (Cassandra / ScyllaDB / DynamoDB), search (Elasticsearch / OpenSearch), vector (pgvector / Pinecone / Weaviate / Qdrant), OLAP / warehouse (ClickHouse / DuckDB / Snowflake / BigQuery), plus cross-cutting concerns (transactions / isolation, indexing strategy, query planning, replication / sharding, data modeling). One URL for "postgres interview questions", "mongodb interview questions", "redis interview questions", "elasticsearch interview questions", "database interview questions".
- **Action:** Add `frontend/lib/hubs/database.ts` aggregator, build `/databases` index + up to 11 category pages, scaffold `content/database-cross-cutting/` (transactions-and-isolation, indexing-strategy, query-planning, replication-and-sharding, schema-vs-document-modeling, change-data-capture-cdc, vector-search-fundamentals, OLAP-vs-OLTP).
- **Output:** `/databases` returns 200 with grouped content; ≥ 320 database cards across categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 14 (JBI data-persistence) DONE.
- [ ] Playbook 33 (PBI data-and-messaging) at least scaffolded.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.databases` (add if missing; default `false`).

## Why this matters

Database interview demand splits cleanly across engine families that each have distinct interview vocabularies — PostgreSQL MVCC vs MySQL InnoDB, MongoDB document modeling vs Cassandra partition keys, Redis data structures vs DynamoDB single-table design, vector DB recall/latency tradeoffs — but lives buried inside backend language tracks today. A consolidated hub captures the multi-engine senior-engineer audience and the database-specialist DBA-leaning audience under one tree, with clear cross-cutting tabs (transactions, indexing, sharding) for the architect.

## Background

This hub aggregates from the following content trees:

| Content tree | Role | Engines covered |
|---|---|---|
| `content/java-backend-intermediate/` (playbook 14) | Relational + search | PostgreSQL 17, MySQL 8.4, MongoDB 7, Redis 7, Elasticsearch 8 — Java idioms (JDBC, JPA/Hibernate, Spring Data) |
| `content/python-backend-intermediate/` (playbook 33) | Relational + messaging | PostgreSQL-Python (psycopg3), MongoDB-Python (Motor/PyMongo), Redis-Python, Kafka-Python |
| `content/database-cross-cutting/` (new, this playbook) | All | PostgreSQL deep (MVCC, VACUUM, planner), MySQL deep (InnoDB, B-tree), MongoDB deep (schema patterns), Redis deep (data structures, persistence), Cassandra + ScyllaDB, DynamoDB single-table design, Elasticsearch deep + OpenSearch, pgvector, Pinecone/Weaviate/Qdrant, ClickHouse, DuckDB, Snowflake vs BigQuery vs Databricks, transactions/isolation (MVCC, 2PL, serializable snapshot isolation), indexing (B-tree, hash, GIN, GiST, composite), replication (streaming, logical), sharding (range, hash, consistent hashing), CDC |

Real anchors: PostgreSQL 17 (released September 2024); MySQL 8.4 LTS; MongoDB 7.0; Redis 7.2; Elasticsearch 8.14 / OpenSearch 2.15; Apache Cassandra 5.0; DynamoDB (AWS, no version number — uses single-table design pattern); ClickHouse (column-store, sub-second OLAP queries); DuckDB 1.0 (in-process OLAP); pgvector 0.7 (PostgreSQL extension for vector search); Pinecone / Weaviate / Qdrant (standalone vector databases). Kleppmann's "Designing Data-Intensive Applications" (O'Reilly, 2017) is the canonical reference for transactions, replication, and sharding interview vocabulary.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `database interview questions` | `/databases` |
| `postgres interview questions` | `/databases/postgres` |
| `postgresql interview questions` | `/databases/postgres` |
| `mysql interview questions` | `/databases/mysql` |
| `mongodb interview questions` | `/databases/mongodb` |
| `redis interview questions` | `/databases/redis` |
| `cassandra interview questions` | `/databases/wide-column-cassandra-dynamodb` |
| `dynamodb interview questions` | `/databases/wide-column-cassandra-dynamodb` |
| `elasticsearch interview questions` | `/databases/search-elasticsearch-opensearch` |
| `opensearch interview questions` | `/databases/search-elasticsearch-opensearch` |
| `vector database interview questions` | `/databases/vector-and-rag-databases` |
| `pinecone interview questions` | `/databases/vector-and-rag-databases` |
| `clickhouse interview questions` | `/databases/olap-and-warehouse` |
| `snowflake interview questions` | `/databases/olap-and-warehouse` |
| `bigquery interview questions` | `/databases/olap-and-warehouse` |
| `acid interview questions` | `/databases/transactions-and-isolation` |
| `isolation levels interview questions` | `/databases/transactions-and-isolation` |
| `database indexing interview questions` | `/databases/indexing-and-query-planning` |
| `database sharding interview questions` | `/databases/replication-and-sharding` |

## Current state

- JBI 14 has PostgreSQL / MongoDB / Redis Java-flavoured content.
- PBI 33 has data-and-messaging Python content.
- No vector-DB / wide-column / search / OLAP cross-cutting trees today.
- `/databases` route does NOT exist today.

## Target state (measurable)

- Up to 12 hub pages return 200 (`/databases` + up to 11 categories below).
- Hub aggregator returns ≥ 320 database cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 8 minimum at launch, up to 11)

| Category slug | Pulls from… |
|---|---|
| `postgres` | `java-backend-intermediate/postgres-*`, `python-backend-intermediate/postgres-python`, `database-cross-cutting/postgres-deep` |
| `mysql` | `java-backend-intermediate/mysql-*`, `database-cross-cutting/mysql-deep` |
| `mongodb` | `java-backend-intermediate/mongodb-*`, `python-backend-intermediate/mongodb-python`, `database-cross-cutting/mongodb-deep` |
| `redis` | `java-backend-intermediate/redis-*`, `python-backend-intermediate/redis-python`, `database-cross-cutting/redis-deep` |
| `wide-column-cassandra-dynamodb` | `database-cross-cutting/cassandra-and-scylladb`, `database-cross-cutting/dynamodb-single-table-design` |
| `search-elasticsearch-opensearch` | `java-backend-intermediate/search-elasticsearch`, `database-cross-cutting/elasticsearch-deep`, `database-cross-cutting/opensearch-deep` |
| `vector-and-rag-databases` | `database-cross-cutting/pgvector`, `database-cross-cutting/pinecone-weaviate-qdrant`, `database-cross-cutting/vector-search-fundamentals` |
| `olap-and-warehouse` | `database-cross-cutting/clickhouse-deep`, `database-cross-cutting/duckdb`, `database-cross-cutting/snowflake-vs-bigquery-vs-databricks` |
| `transactions-and-isolation` | `database-cross-cutting/transactions-and-isolation` |
| `indexing-and-query-planning` | `database-cross-cutting/indexing-strategy`, `database-cross-cutting/query-planning` |
| `replication-and-sharding` | `database-cross-cutting/replication-and-sharding`, `database-cross-cutting/cdc-fundamentals` |

**Minimum 8 frozen at launch.** `transactions-and-isolation`, `indexing-and-query-planning`, and `replication-and-sharding` may be merged into `db-fundamentals-and-architecture` if launch budget is tight. Once the launch set is chosen it is frozen — adding a 12th requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/database-cross-cutting
cat > content/database-cross-cutting/_index.json <<EOF
{
  "level": "database-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in \
  postgres-deep mysql-deep mongodb-deep redis-deep \
  cassandra-and-scylladb dynamodb-single-table-design \
  elasticsearch-deep opensearch-deep \
  pgvector pinecone-weaviate-qdrant vector-search-fundamentals \
  clickhouse-deep duckdb snowflake-vs-bigquery-vs-databricks \
  transactions-and-isolation indexing-strategy query-planning \
  replication-and-sharding cdc-fundamentals \
  schema-vs-document-modeling olap-vs-oltp; do
  mkdir -p "content/database-cross-cutting/$M"
done
```

Target counts per module: ~15-20 cards, ~350 total in the cross-cutting tree.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/database-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
MODULE_COUNT=$(find content/database-cross-cutting -mindepth 1 -maxdepth 1 -type d | wc -l)
echo "Module dirs: $MODULE_COUNT (want 21)"
```
Expected: `OK index`; module dirs = 21.

---

### Step 2 — Aggregator

`frontend/lib/hubs/database.ts`:

```typescript
export type DBCategory =
  | 'postgres'
  | 'mysql'
  | 'mongodb'
  | 'redis'
  | 'wide-column-cassandra-dynamodb'
  | 'search-elasticsearch-opensearch'
  | 'vector-and-rag-databases'
  | 'olap-and-warehouse'
  | 'transactions-and-isolation'
  | 'indexing-and-query-planning'
  | 'replication-and-sharding';

export interface DBCard {
  id:         string;
  title:      string;
  domain:     string;
  module:     string;
  topic:      string;
  href:       string;
  category:   DBCategory;
  engineTags: ('postgres' | 'mysql' | 'mongodb' | 'redis' | 'cassandra' | 'dynamodb'
              | 'elasticsearch' | 'opensearch' | 'pgvector' | 'pinecone' | 'weaviate'
              | 'qdrant' | 'clickhouse' | 'duckdb' | 'snowflake' | 'bigquery'
              | 'databricks' | 'agnostic')[];
  workload:   'oltp' | 'olap' | 'kv' | 'search' | 'vector' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DB_CATEGORY_FEEDS: Record<DBCategory, string[]> = {
  'postgres':                       ['java-backend-intermediate/postgres-fundamentals', 'java-backend-intermediate/postgres-deep', 'python-backend-intermediate/postgres-python', 'database-cross-cutting/postgres-deep'],
  'mysql':                          ['java-backend-intermediate/mysql-fundamentals', 'database-cross-cutting/mysql-deep'],
  'mongodb':                        ['java-backend-intermediate/mongodb-fundamentals', 'java-backend-intermediate/mongodb-deep', 'python-backend-intermediate/mongodb-python', 'database-cross-cutting/mongodb-deep'],
  'redis':                          ['java-backend-intermediate/redis-fundamentals', 'java-backend-intermediate/redis-deep', 'python-backend-intermediate/redis-python', 'database-cross-cutting/redis-deep'],
  'wide-column-cassandra-dynamodb': ['database-cross-cutting/cassandra-and-scylladb', 'database-cross-cutting/dynamodb-single-table-design'],
  'search-elasticsearch-opensearch':['java-backend-intermediate/search-elasticsearch', 'database-cross-cutting/elasticsearch-deep', 'database-cross-cutting/opensearch-deep'],
  'vector-and-rag-databases':       ['database-cross-cutting/pgvector', 'database-cross-cutting/pinecone-weaviate-qdrant', 'database-cross-cutting/vector-search-fundamentals'],
  'olap-and-warehouse':             ['database-cross-cutting/clickhouse-deep', 'database-cross-cutting/duckdb', 'database-cross-cutting/snowflake-vs-bigquery-vs-databricks'],
  'transactions-and-isolation':     ['database-cross-cutting/transactions-and-isolation'],
  'indexing-and-query-planning':    ['database-cross-cutting/indexing-strategy', 'database-cross-cutting/query-planning'],
  'replication-and-sharding':       ['database-cross-cutting/replication-and-sharding', 'database-cross-cutting/cdc-fundamentals'],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/database.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'DB_CATEGORY_FEEDS' frontend/lib/hubs/database.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/databases` — index of active categories with card counts + engine-mix histogram.
- `/databases/<category>` — filterable card list; engine-pill badges; workload filter.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/databases/page.tsx \
  "frontend/app/databases/[category]/page.tsx" \
  frontend/components/DBCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same template. Version pins per intro:

- **Postgres intro**: PostgreSQL 17 (released September 2024). Leads with the decision rule: "Use PostgreSQL when you need ACID transactions, complex joins, JSONB hybrid workloads, or full-text search in the same store. Use MySQL when your team is experienced on it or you're running a high-read e-commerce workload with proven MySQL tooling." Names MVCC (Multi-Version Concurrency Control) and the `VACUUM` process as the canonical PostgreSQL interview vocabulary.
- **Redis intro**: Redis 7.2. Decision rule: "Use Redis for sub-millisecond reads of hot data (sessions, leaderboards, rate-limit counters); use a persistent database for your source of truth. The classic bug is treating Redis as your primary store — a Redis restart with `appendonly no` silently drops data."
- **Transactions intro**: cites Kleppmann DDIA chapter 7 as the reference; covers Read Uncommitted / Read Committed / Repeatable Read / Serializable; names MVCC (PostgreSQL / MySQL InnoDB), Two-Phase Locking (traditional), and Serializable Snapshot Isolation (PostgreSQL 9.1+).
- **Vector intro**: decision rule "Use pgvector when your data is already in PostgreSQL and query volume is < 100 QPS; use Pinecone / Weaviate / Qdrant when you need > 100 QPS, hybrid sparse+dense search, or managed scaling. The classic bug is expecting ANN (approximate nearest neighbor) to be exact — recall@10 of 0.95 means 5% of true nearest neighbors are missed."

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
INTRO_COUNT=$(find content/database-cross-cutting -name 'intro.md' | wc -l)
echo "Intro count: $INTRO_COUNT (want ≥ 8 for minimum launch)"
```

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  databases: true,
}
```

Commit: `launch: enable databases hub`.

**Verify:**
```bash
grep -c 'databases: *true' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/launch-config.ts
```
Expected: ≥ 1.

---

### Step 6 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /databases \
  /databases/postgres \
  /databases/mysql \
  /databases/mongodb \
  /databases/redis \
  /databases/wide-column-cassandra-dynamodb \
  /databases/search-elasticsearch-opensearch \
  /databases/vector-and-rag-databases \
  /databases/olap-and-warehouse \
  /databases/transactions-and-isolation \
  /databases/indexing-and-query-planning \
  /databases/replication-and-sharding; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200` (skip deferred categories).

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `databases` flag |
| `frontend/lib/hubs/database.ts` | NEW — aggregator |
| `frontend/app/databases/page.tsx` | NEW — index |
| `frontend/app/databases/[category]/page.tsx` | NEW — category page |
| `frontend/components/DBCard.tsx` | NEW — card with engine + workload |
| `frontend/components/site-header.tsx` | add Databases nav link |
| `scripts/build_sitemap.py` | enumerate active DB hub URLs |
| `content/database-cross-cutting/` | NEW directory + 21 modules |

## Content rules

- Hub LINKS, never duplicates JBI / PBI database content.
- Cross-cutting tree holds engine-specific deep-dives (Postgres MVCC, MySQL InnoDB, MongoDB schema patterns, Redis data-structure use-cases) plus engine-agnostic concerns (transactions, indexing, replication, sharding, CDC).
- Engine tags reflect the engines a card discusses; vector-search-fundamentals carries `["pgvector", "pinecone", "weaviate", "qdrant", "agnostic"]`.
- Workload tag (`oltp`/`olap`/`kv`/`search`/`vector`/`mixed`) enables a top-of-page workload filter on the index.
- A topic appears in **only one** category by its **primary** engine (e.g. "MongoDB transactions" goes in `mongodb`, not `transactions-and-isolation`; the cross-cutting transactions page has engine-agnostic content only).
- The most common mistake: DynamoDB partition-key content belongs in `wide-column-cassandra-dynamodb` (engine-specific), not in `replication-and-sharding` (cross-cutting sharding patterns, engine-agnostic only).
- The launch category set is **frozen** — adding a 12th (e.g. `time-series-influxdb-timescale`, `graph-neo4j-arangodb`) requires its own playbook.

## SEO and URLs

- Canonical: `/databases`, `/databases/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `<Engine> Interview Questions — Database Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| All active hub pages return 200 | all of them | smoke loop (all 200) |
| Hub aggregator returns ≥ 320 cards | ≥ 320 | `console.log(listCards().length)` in aggregator; `npm run build` |
| Postgres category ≥ 60 cards | ≥ 60 | `console.log(listCards('postgres').length)` |
| MongoDB category ≥ 40 cards | ≥ 40 | `console.log(listCards('mongodb').length)` |
| Vector category ≥ 30 cards | ≥ 30 | `console.log(listCards('vector-and-rag-databases').length)` |
| OLAP/Warehouse category ≥ 30 cards | ≥ 30 | `console.log(listCards('olap-and-warehouse').length)` |
| Each active category intro ≥ 200 words | all intros | `for F in content/database-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes all active DB hub URLs | count | `grep -c '/databases' frontend/public/sitemap.xml` ≥ active-count + 1 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Engine tag present on every card | 100 % | `rg 'engineTags=\{' frontend/components/DBCard.tsx` ≥ 1 |
| Workload tag present on every card | 100 % | `rg 'workload=\{' frontend/components/DBCard.tsx` ≥ 1 |
| Site-header has Databases link | grep | `grep -c 'href="/databases"' frontend/components/site-header.tsx` ≥ 1 |

## Failure modes & rollback

- **Card count < 320**: JBI/PBI content gap + cross-cutting tree under-seeded — do not flip flag. Generate more.
- **Vector / OLAP categories thin**: acceptable to launch with a "more coming" notice. Track as follow-up.
- **Engine tag inconsistencies** (`postgresql` vs `postgres` vs `pg`): aggregator canonicalises. Add `ENGINE_CANONICAL_MAP`.
- **Cross-cutting categories (transactions/indexing/sharding) drift into engine-specific content**: every card under those slugs MUST have `engineTags` including `agnostic` OR explicitly list 3+ engines being compared. Engine-specific deep-dive goes in the engine category.
- **`replication-and-sharding` mistakenly pulls in DynamoDB partition-key content**: DynamoDB partition keys belong in `wide-column-cassandra-dynamodb` (engine-specific). The cross-cutting sharding category contains engine-agnostic sharding patterns + comparison topics only.
- **Rollback:** `ENABLED_HUBS.databases = false`.

## Definition of Done

- [ ] `grep -c 'databases: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] Smoke loop — all active category pages return 200
- [ ] `console.log(listCards().length)` ≥ 320
- [ ] `console.log(listCards('postgres').length)` ≥ 60
- [ ] `console.log(listCards('mongodb').length)` ≥ 40
- [ ] `console.log(listCards('vector-and-rag-databases').length)` ≥ 30
- [ ] `for F in content/database-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/databases' frontend/public/sitemap.xml` ≥ active-category-count + 1
- [ ] `grep -c 'href="/databases"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `rg 'engineTags=\{' frontend/components/DBCard.tsx` ≥ 1 (engine tags present in card component)

## Estimated effort

- **Ideal:** 26 hours (3h scaffold + 12h cross-cutting content + 8h hub UI + 3h intros + smoke).
- **Hard stop:** 52 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Step 3 (pages + filtering).
  3. Step 4 (intros + seed cross-cutting to ≥ 200 cards).
  4. Steps 5-6 (flag + smoke + commits + INDEX).