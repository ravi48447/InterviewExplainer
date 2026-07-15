# 69 — Data Engineering Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-language content aggregation. Pulls from PDE (playbook 38), Scala (playbook 66), and new mid-cross-cutting modules introduced here.
> **Depends on:** 38 (PDE track), 66 (Scala FP/JVM track — for Spark idioms), 41 (interview-qa-hub rollout pattern), 06 (content-schema).

## TL;DR

- **Goal:** A single browsable hub for **data engineering** content — Spark, Flink, Kafka, Airflow, dbt, lakehouse, streaming patterns, dimensional modelling, CDC — pulling from PDE (Python), Scala (Spark), and new tool-agnostic modules. One URL for "data engineer interview questions", "spark interview questions", "kafka interview questions", "airflow interview questions".
- **Action:** Add `frontend/lib/hubs/data-engineering.ts` aggregator, build `/data-engineering` index + 7 category pages, scaffold one new cross-cutting content tree at `content/data-engineering-cross-cutting/` (dimensional-modelling, lakehouse-architecture, streaming-vs-batch, cdc-patterns).
- **Output:** `/data-engineering` returns 200 with grouped content by topic; ≥ 350 DE-specific cards across 7 categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 38 (Python Data Engineering track) at least scaffolded — Spark/Airflow/Flink/dbt modules referenced from hub.
- [ ] Playbook 66 (Scala FP/JVM track) at least scaffolded — Spark-Scala pillar referenced from hub.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE — hub-page pattern established.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.dataEngineering` (add if missing; default `false`).

## Why this matters

Data engineering is the single highest-paying non-ML / non-staff role family in 2026 (Levels.fyi senior DE: $260-340k base), and its interview vocabulary is sprawled across Python, Scala/Spark, Kafka, Airflow, dbt, and warehouse-specific dialects (Snowflake, BigQuery, Databricks). A consolidated hub that organises content by *concept* (streaming vs batch, dimensional modelling, CDC) rather than *language* is differentiated against language-track-only competitors and matches how DE candidates actually search.

## Background

This hub aggregates from the following content trees:

| Content tree | Role | Key tools covered |
|---|---|---|
| `content/python-data-engineering/` (playbook 38) | Primary | Spark/PySpark, Kafka, Flink, Airflow, Dagster, Prefect, dbt, Snowflake, BigQuery, Databricks |
| `content/scala-intermediate/spark-and-bigdata/` (playbook 66) | Secondary | Spark-Scala, Spark Structured Streaming, Delta Lake |
| `content/data-engineering-cross-cutting/` (new, this playbook) | Cross-cutting | Dimensional modelling, lakehouse architecture, streaming-vs-batch patterns, CDC, file formats (Parquet / Iceberg / Delta), data quality and contracts |

The hub LINKS to language tracks for language-specific content. PySpark deep-dives live in PDE; Spark-Scala lives in Scala-intermediate. The cross-cutting tree holds only tool-agnostic concept content.

Real anchors: Apache Spark 3.5 (latest stable as of 2024), Apache Kafka 3.7, Apache Flink 1.19, Apache Airflow 2.9, dbt-core 1.8, Apache Iceberg 1.5 (table format), Delta Lake 3.1, Apache Parquet (columnar format). Snowflake and BigQuery are the dominant cloud warehouse targets.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `data engineer interview questions` | `/data-engineering` |
| `senior data engineer interview questions` | `/data-engineering` |
| `spark interview questions` | `/data-engineering/spark` |
| `pyspark interview questions` | `/data-engineering/spark` (PySpark sub-section) |
| `kafka interview questions` | `/data-engineering/streaming-and-kafka` |
| `airflow interview questions` | `/data-engineering/orchestration` |
| `dbt interview questions` | `/data-engineering/warehouse-and-dbt` |
| `data warehouse interview questions` | `/data-engineering/warehouse-and-dbt` |
| `dimensional modelling interview questions` | `/data-engineering/modelling-and-architecture` |
| `lakehouse interview questions` | `/data-engineering/modelling-and-architecture` |
| `cdc interview questions` | `/data-engineering/streaming-and-kafka` (CDC subsection) |
| `flink interview questions` | `/data-engineering/streaming-and-flink` |

## Current state

- PDE content lives (or will live) under `content/python-data-engineering/` (playbook 38).
- Spark-Scala content lives under `content/scala-intermediate/spark-and-bigdata/` (playbook 66).
- No cross-cutting modelling / lakehouse / CDC content exists today as its own tree.
- `/data-engineering` route does NOT exist today.

## Target state (measurable)

- 8 hub pages return 200 (`/data-engineering` + 7 categories below).
- Hub aggregator returns ≥ 350 DE cards.
- All hub URLs appear in `sitemap.xml`.
- Each category page shows source-language badges (Python / Scala / SQL) per card.

## Categories (canonical — 7 frozen at launch)

| Category slug | Pulls from… |
|---|---|
| `spark` | `python-data-engineering/spark-*`, `scala-intermediate/spark-and-bigdata/*` |
| `streaming-and-kafka` | `python-data-engineering/kafka-*`, `python-data-engineering/streaming-*`, CDC sub-section |
| `streaming-and-flink` | `python-data-engineering/flink-*` (or stubs); cross-link to Spark Structured Streaming |
| `orchestration` | `python-data-engineering/airflow-*`, `python-data-engineering/dagster-*`, `prefect-*` |
| `warehouse-and-dbt` | `python-data-engineering/dbt-*`, `python-data-engineering/snowflake-*`, `bigquery-*`, `databricks-*` |
| `modelling-and-architecture` | `content/data-engineering-cross-cutting/dimensional-modelling`, `lakehouse-architecture`, `streaming-vs-batch` |
| `system-design` | `python-data-engineering/data-engineering-system-design-cases/*` + cross-link to `/system-design/data-engineering` |

**These 7 categories are frozen at launch.** Adding an 8th (e.g. `lake-formation-cdp`) requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/data-engineering-cross-cutting
cat > content/data-engineering-cross-cutting/_index.json <<EOF
{
  "level": "data-engineering-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in dimensional-modelling lakehouse-architecture streaming-vs-batch cdc-patterns data-quality-and-contracts file-formats-parquet-iceberg-delta; do
  mkdir -p "content/data-engineering-cross-cutting/$M"
done
```

Target counts per module: ~20-25 cards each, ~120 total in the cross-cutting tree.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/data-engineering-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
for M in dimensional-modelling lakehouse-architecture streaming-vs-batch cdc-patterns data-quality-and-contracts file-formats-parquet-iceberg-delta; do
  test -d "content/data-engineering-cross-cutting/$M" && echo "OK $M" || echo "MISSING $M"
done
```
Expected: 7 `OK` lines.

---

### Step 2 — Aggregator

`frontend/lib/hubs/data-engineering.ts`:

```typescript
export type DECategory =
  | 'spark'
  | 'streaming-and-kafka'
  | 'streaming-and-flink'
  | 'orchestration'
  | 'warehouse-and-dbt'
  | 'modelling-and-architecture'
  | 'system-design';

export interface DECard {
  id:        string;
  title:     string;
  domain:    string;
  module:    string;
  topic:     string;
  href:      string;
  category:  DECategory;
  language:  ('python' | 'scala' | 'sql' | 'kotlin' | 'java')[];
  difficulty:'easy' | 'medium' | 'hard';
}

export const DE_CATEGORY_FEEDS: Record<DECategory, string[]> = {
  'spark': [
    'python-data-engineering/spark-fundamentals',
    'python-data-engineering/pyspark-deep',
    'python-data-engineering/spark-streaming',
    'scala-intermediate/spark-and-bigdata',
  ],
  'streaming-and-kafka': [
    'python-data-engineering/kafka-fundamentals',
    'python-data-engineering/kafka-streams',
    'python-data-engineering/streaming-patterns',
    'data-engineering-cross-cutting/cdc-patterns',
  ],
  'streaming-and-flink': ['python-data-engineering/flink-fundamentals'],
  'orchestration': [
    'python-data-engineering/airflow-fundamentals',
    'python-data-engineering/airflow-deep',
    'python-data-engineering/dagster',
    'python-data-engineering/prefect',
  ],
  'warehouse-and-dbt': [
    'python-data-engineering/dbt-fundamentals',
    'python-data-engineering/dbt-deep',
    'python-data-engineering/snowflake',
    'python-data-engineering/bigquery',
    'python-data-engineering/databricks-sql',
  ],
  'modelling-and-architecture': [
    'data-engineering-cross-cutting/dimensional-modelling',
    'data-engineering-cross-cutting/lakehouse-architecture',
    'data-engineering-cross-cutting/streaming-vs-batch',
    'data-engineering-cross-cutting/file-formats-parquet-iceberg-delta',
    'data-engineering-cross-cutting/data-quality-and-contracts',
  ],
  'system-design': ['python-data-engineering/data-engineering-system-design-cases'],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/data-engineering.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'DE_CATEGORY_FEEDS' frontend/lib/hubs/data-engineering.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/data-engineering` — index of 7 categories with card counts and language-mix histogram.
- `/data-engineering/<category>` — filterable card list; language pill badges (Py / Scala / SQL).
- Card click goes to existing module URLs — hub LINKS only.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/data-engineering/page.tsx \
  "frontend/app/data-engineering/[category]/page.tsx" \
  frontend/components/DECard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each, 7 total)

Same shape as playbook 44 step 3. Each intro names the source modules and the language mix. The Spark intro names Spark 3.5 and differentiates PySpark (Python API) from Spark-Scala (native API). The Kafka intro names Kafka 3.7 and the consumer-group rebalance protocol. The dbt intro names dbt-core 1.8 and the "transform in the warehouse" pattern vs ETL.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for SLUG in spark streaming-and-kafka streaming-and-flink orchestration warehouse-and-dbt modelling-and-architecture system-design; do
  INTRO="content/data-engineering-cross-cutting/${SLUG}-intro.md"
  [ -f "$INTRO" ] && WC=$(wc -w < "$INTRO") || WC=0
  [ "$WC" -ge 200 ] && echo "OK $SLUG ($WC words)" || echo "SHORT $SLUG ($WC words)"
done
```
Expected: 7 `OK` lines (or equivalent intro path convention chosen in implementation).

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  dataEngineering: true,
}
```

Commit: `launch: enable dataEngineering hub`.

**Verify:**
```bash
grep -c 'dataEngineering: *true' \
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
  /data-engineering \
  /data-engineering/spark \
  /data-engineering/streaming-and-kafka \
  /data-engineering/streaming-and-flink \
  /data-engineering/orchestration \
  /data-engineering/warehouse-and-dbt \
  /data-engineering/modelling-and-architecture \
  /data-engineering/system-design; do
  printf "%-50s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200`.

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `dataEngineering` flag |
| `frontend/lib/hubs/data-engineering.ts` | NEW — aggregator |
| `frontend/app/data-engineering/page.tsx` | NEW — index |
| `frontend/app/data-engineering/[category]/page.tsx` | NEW — category page |
| `frontend/components/DECard.tsx` | NEW — card with language badge |
| `frontend/components/site-header.tsx` | add Data Engineering nav link |
| `scripts/build_sitemap.py` | enumerate 8 DE hub URLs |
| `content/data-engineering-cross-cutting/` | NEW directory + 6 module sub-trees |

## Content rules

- Hub LINKS to language tracks for language-specific content (PySpark deep-dive lives in PDE; Spark-Scala lives in Scala-intermediate). Hub does NOT duplicate.
- Each card carries a language-mix array (e.g. `["python", "scala"]`) reflecting the languages used in its code examples.
- The cross-cutting tree holds *only* concept content (dimensional modelling, file formats, lakehouse). Tool-specific content (Spark, Kafka, Airflow, dbt) lives in the language track.
- The most common mistake is feeding Scala language-fundamentals (FP concepts, type system) from `scala-intermediate` into the Spark category — only the `spark-and-bigdata` sub-pillar belongs here.
- The 7 categories are **frozen** — adding an 8th (e.g. `lake-formation-cdp`) requires its own playbook.

## SEO and URLs

- Canonical: `/data-engineering`, `/data-engineering/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `Data Engineering Interview Questions — <Category> | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| 8 hub pages return 200 | 8 of 8 | `for url in /data-engineering /data-engineering/spark /data-engineering/streaming-and-kafka /data-engineering/streaming-and-flink /data-engineering/orchestration /data-engineering/warehouse-and-dbt /data-engineering/modelling-and-architecture /data-engineering/system-design; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` |
| Hub aggregator returns ≥ 350 cards | ≥ 350 | `console.log(listCards().length)` temporarily in aggregator; `npm run build` |
| Spark category ≥ 100 cards | ≥ 100 | `console.log(listCards('spark').length)` in aggregator |
| Each category intro ≥ 200 words | 7 of 7 | `for F in content/data-engineering-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes 8 DE hub URLs | 8 | `grep -c '/data-engineering' frontend/public/sitemap.xml` ≥ 8 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Language badge present on every card | 100 % | inspect rendered HTML; `rg 'language=\{' frontend/components/DECard.tsx` ≥ 1 |
| Existing PDE / Scala pages: zero regression | manual | open one PDE topic + one Scala-Spark topic |
| Site-header has Data Engineering link | grep | `grep -c 'href="/data-engineering"' frontend/components/site-header.tsx` ≥ 1 |

## Failure modes & rollback

- **Card count < 350**: PDE / Scala content gap — do not flip flag. Generate more in the thinnest pillar before launch.
- **Flink section empty**: acceptable at launch; mark `flink` sub-category with a "coming soon" notice that still returns 200. Track as a follow-up issue.
- **Language badges miscounted** (e.g. a PySpark card tagged `python` only when it has both `python` and Scala counterparts): aggregator language-detection bug; fix the heuristic (parse `language` field from `complete-qa.json` sections).
- **System-design sub-category duplicates `/system-design/data-engineering`**: hub should LINK to the dedicated SD hub, not re-render cases. Verify the SD category page only contains the cross-link block + a "go to system-design hub" CTA.
- **Rollback:** `ENABLED_HUBS.dataEngineering = false`.

## Definition of Done

- [ ] `grep -c 'dataEngineering: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] `for url in /data-engineering /data-engineering/spark /data-engineering/streaming-and-kafka /data-engineering/streaming-and-flink /data-engineering/orchestration /data-engineering/warehouse-and-dbt /data-engineering/modelling-and-architecture /data-engineering/system-design; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` — all 200
- [ ] `console.log(listCards().length)` ≥ 350
- [ ] `console.log(listCards('spark').length)` ≥ 100
- [ ] `for F in content/data-engineering-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/data-engineering' frontend/public/sitemap.xml` ≥ 8
- [ ] `grep -c 'href="/data-engineering"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `test -f content/data-engineering-cross-cutting/_index.json && echo OK` — OK
- [ ] Cross-link to `/system-design/data-engineering` present in system-design category page; `grep -c '/system-design/data-engineering' frontend/app/data-engineering/\[category\]/page.tsx` ≥ 1

## Estimated effort

- **Ideal:** 18 hours (3h scaffold + 6h cross-cutting content seed + 7h hub UI + 2h intros + smoke).
- **Hard stop:** 36 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Steps 3-4 (pages + intros + seed cross-cutting modules to ≥ 80 cards).
  3. Steps 5-6 (flag + smoke + commits + INDEX).