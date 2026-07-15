# 38 — New Domain: `python-data-engineering` (FULL SPEC + ROLLOUT)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked domain — spec + scaffold + content + launch.

---

## §0 — Front-matter

```yaml
playbook:    38
version:     1.0
status:      ready
wave:        D
domain:      python-data-engineering
modules:     16
q_target:    800
archetypes:  A:30% B:30% C:30% G:10%
difficulty:  E:20 M:55 H:25
version_pins:
  python: "3.12"
  apache_airflow: "2.9"
  pyspark: "3.5"
  dbt_core: "1.8"
  snowflake_connector: "3.9"
  kafka_python: "2.0"
  pandas: "2.2"
  sqlalchemy: "2.0"
seo_slug:    data-engineering-interview-questions-python
tag:         pde-launch-<YYYY-MM-DD>
depends_on:  [31, 35]
```

---

## §1 — TL;DR

- **Goal:** Capture the data-engineering search demand that is parallel
  to (and bigger than) Python backend in many markets.
- **Audience:** Data engineers, data platform engineers, analytics
  engineers using Python.
- **Target Q at launch:** 800 across 16 modules.
- **Output:** Live at `/interview/python-data-engineering`.

## Why this matters (2 sentences)

Data engineering is the **#1 highest-growth-rate job category** in
data/ML — search for *"data engineer interview questions"* alone clears
~20k monthly and is growing 30 % YoY. Owning the Python-flavoured DE
content (Airflow, Spark/PySpark, dbt, Kafka, Snowflake) captures a
specific high-intent audience that LeetCode/GfG don't address at all,
and the system-design-cases for DE pipelines have almost no
canonical answers online.

## Hard prerequisites

- [ ] Playbook 31 done (PBI scaffolding pattern proven).
- [ ] PBI launched (so PDE can cross-link).

## Domain metadata

```json
{
  "domainSlug": "python-data-engineering",
  "language": "python",
  "level": "intermediate-to-senior",
  "seoSlug": "data-engineering-interview-questions-python",
  "altSlugs": [
    "python-data-engineer-interview-questions",
    "etl-pipeline-interview-questions",
    "data-pipeline-interview-questions-python",
    "spark-python-interview-questions",
    "airflow-interview-questions",
    "dbt-interview-questions",
    "snowflake-interview-questions"
  ],
  "label": "Python Data Engineering",
  "blurb": "Data engineering interview prep with Python — Airflow, Spark, dbt, Snowflake, Kafka, data modelling, ETL/ELT, and modern data stack tooling.",
  "audience": "Data engineers and data platform engineers using Python"
}
```

## Module specification (16 modules, ~800 Q)

| #  | Module slug                              | Pillar | Min Q |
| -- | ---------------------------------------- | ------ | ----- |
| 1  | `data-engineering-fundamentals`          | P06    | 50    |
| 2  | `etl-vs-elt-and-pipeline-design`         | P06    | 50    |
| 3  | `python-for-data-engineers`              | P01    | 50    |
| 4  | `pandas-deep`                            | P01    | 50    |
| 5  | `polars-and-modern-dataframes`           | P01    | 30    |
| 6  | `pyspark-and-spark-on-python`            | P05    | 60    |
| 7  | `airflow-deep`                           | P05    | 60    |
| 8  | `dbt-deep`                               | P03    | 50    |
| 9  | `kafka-and-streaming-for-de`             | P05    | 50    |
| 10 | `data-warehouses-snowflake-bigquery`     | P03    | 50    |
| 11 | `data-modeling`                          | P03    | 50    |
| 12 | `data-quality-and-testing`               | P08    | 40    |
| 13 | `lakes-and-lakehouses-iceberg-delta`     | P03    | 40    |
| 14 | `cdc-and-realtime-pipelines`             | P05    | 40    |
| 15 | `data-engineering-system-design-cases`   | P06    | 50    |
| 16 | `data-engineer-behavioral`               | P12    | 80    |

**Total: 800 Q.**

## Search-phrase keyword map (high-value)

| Search phrase                                          | Owner                                |
| ------------------------------------------------------ | ------------------------------------ |
| `data engineering interview questions`                 | (domain landing)                     |
| `python data engineer interview questions`             | (domain landing)                     |
| `pyspark interview questions`                          | pyspark-and-spark-on-python          |
| `airflow interview questions`                          | airflow-deep                         |
| `dbt interview questions`                              | dbt-deep                             |
| `snowflake interview questions`                        | data-warehouses-snowflake-bigquery   |
| `data modeling interview questions`                    | data-modeling                         |
| `star schema vs snowflake schema`                      | data-modeling                         |
| `etl vs elt interview questions`                       | etl-vs-elt-and-pipeline-design       |
| `slowly changing dimensions interview questions`       | data-modeling                         |
| `pandas interview questions`                           | pandas-deep                          |
| `polars vs pandas`                                     | polars-and-modern-dataframes         |
| `delta lake interview questions`                       | lakes-and-lakehouses-iceberg-delta   |
| `iceberg vs delta vs hudi`                             | lakes-and-lakehouses-iceberg-delta   |

## Money comparison questions (canonical, write EXACTLY)

1. `ETL vs ELT`
2. `Star schema vs snowflake schema`
3. `OLTP vs OLAP`
4. `Pandas vs Polars vs PySpark`
5. `Spark RDD vs DataFrame vs Dataset`
6. `Airflow vs Prefect vs Dagster`
7. `Snowflake vs BigQuery vs Redshift`
8. `Iceberg vs Delta Lake vs Hudi`
9. `Type 1 vs Type 2 vs Type 6 SCD`
10. `Lambda vs Kappa architecture`
11. `Fact table vs dimension table`
12. `Batch vs streaming pipelines`
13. `dbt models vs traditional ETL scripts`
14. `Data lake vs data warehouse vs lakehouse`

## Per-module highlights

### 38.1 — `data-engineering-fundamentals` (50 Q)

Topics: what-is-de, modern-data-stack, dimensional-modeling-intuition,
data-pipelines-overview, batch-vs-stream, data-storage-formats (parquet/orc/avro),
file vs database, scheduling, comparisons, scenarios.

### 38.4 — `pandas-deep` (50 Q)

Topics: `series-vs-dataframe`, `indexing-loc-iloc-at`, `groupby-and-aggregations`,
`joins-and-merges`, `pivot-and-unpivot`, `time-series-pandas`,
`pandas-performance`, `pandas-and-arrow`, `comparisons`, `scenario`.

### 38.6 — `pyspark-and-spark-on-python` (60 Q)

Topics: `spark-execution-model`, `rdd-vs-dataframe-vs-dataset`,
`transformations-and-actions`, `partitioning-and-shuffles`,
`broadcast-joins-and-skew`, `udfs-pandas-vs-python`,
`structured-streaming`, `delta-on-spark`, `tuning-spark-jobs`,
`spark-on-kubernetes`, `comparisons`, `scenario`.

### 38.7 — `airflow-deep` (60 Q)

Topics: `dag-anatomy`, `operators-and-hooks`, `taskflow-api`,
`scheduling-and-backfills`, `executors-deep` (LocalExecutor, CeleryExecutor,
KubernetesExecutor), `xcom-deep`, `sensors-and-deferrable-operators`,
`testing-airflow-dags`, `airflow-2-vs-3`, `comparisons`, `scenario`.

### 38.8 — `dbt-deep` (50 Q)

Topics: `dbt-models-and-materialisations`, `dbt-sources-and-refs`,
`tests-and-data-quality`, `macros-and-jinja`, `incremental-models`,
`snapshots-and-scd2`, `seeds-and-analyses`, `dbt-cloud-vs-core`,
`dbt-and-cicd`, `comparisons`, `scenario`.

### 38.11 — `data-modeling` (50 Q)

Topics: `dimensional-modeling-kimball`, `data-vault`, `slowly-changing-dimensions`,
`fact-vs-dimension-tables`, `surrogate-vs-natural-keys`,
`star-vs-snowflake-schema`, `late-arriving-data`,
`partitioning-and-clustering-strategies`, `comparisons`, `scenario`.

### 38.15 — `data-engineering-system-design-cases` (50 Q ≈ 12 cases)

Cases (each `complete-qa.json` with mermaid + numbers):

1. Build a daily batch pipeline from 50 source tables to a star schema
2. Real-time pipeline for clickstream → analytics warehouse
3. Slowly-changing dimensions (SCD Type 2) at scale
4. ETL → ELT migration plan for a 5-TB warehouse
5. Build a data quality framework (great-expectations or custom)
6. Streaming CDC from Postgres to Snowflake via Debezium + Kafka
7. Data-lakehouse design (Iceberg on S3 + Snowflake external tables)
8. Cost-aware data pipeline (cut spend 60 % without breaking SLAs)
9. Multi-region data pipeline with residency constraints
10. Backfill strategy for a 6-month broken pipeline
11. Schema-evolution policy across producers and consumers
12. Replatform from Airflow to Dagster (or Prefect): rollout plan

## Content rules

- Python 3.12+; type hints throughout.
- Spark examples target PySpark 3.5+.
- Airflow examples target 2.9+ (TaskFlow API preferred).
- dbt examples target 1.7+.
- Snowflake/BigQuery examples show real SQL, not pseudocode.
- Every data-modeling answer includes a small ASCII table or mermaid ER diagram.

## Execution steps

### Step A — Scaffold

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 scripts/new_locked_domain.py \
  --slug python-data-engineering \
  --label "Python Data Engineering" \
  --language python --level intermediate \
  --seo-slug data-engineering-interview-questions-python \
  --alt-slug python-data-engineer-interview-questions \
  --alt-slug etl-pipeline-interview-questions \
  --alt-slug data-pipeline-interview-questions-python \
  --alt-slug spark-python-interview-questions \
  --alt-slug airflow-interview-questions \
  --alt-slug dbt-interview-questions \
  --alt-slug snowflake-interview-questions \
  --modules \
    data-engineering-fundamentals:P06 \
    etl-vs-elt-and-pipeline-design:P06 \
    python-for-data-engineers:P01 \
    pandas-deep:P01 \
    polars-and-modern-dataframes:P01 \
    pyspark-and-spark-on-python:P05 \
    airflow-deep:P05 \
    dbt-deep:P03 \
    kafka-and-streaming-for-de:P05 \
    data-warehouses-snowflake-bigquery:P03 \
    data-modeling:P03 \
    data-quality-and-testing:P08 \
    lakes-and-lakehouses-iceberg-delta:P03 \
    cdc-and-realtime-pipelines:P05 \
    data-engineering-system-design-cases:P06 \
    data-engineer-behavioral:P12
```

### Step B — Write content

Apply per-module blueprints; meet Q targets; lint + validate.

### Step C — Cross-links

PDE → PBI: every "python-for-data-engineers" topic links to a PBI
language module. Other PDE modules link to PBI sparingly (audience
mostly doesn't overlap).

### Step D — Launch

```typescript
{
  title:      'Python Data Engineering',
  audience:   'intermediate',
  language:   'python',
  href:       '/interview/python-data-engineering',
  description:'Data engineering with Python — Airflow, Spark, dbt, Snowflake, data modelling, modern data stack.',
},
```

## Quality gates

| Gate                                          | Threshold     |
| --------------------------------------------- | ------------- |
| 16 modules at Q target                        | 16 of 16      |
| 12 system-design cases with mermaid           | 12 of 12      |
| All 14 money comparisons live                 | 14 of 14      |
| Speakable domain pass+warn                    | ≥ 90 %        |
| 7 SEO/alt URLs 301                            | 7 of 7        |

## Failure modes & rollback

- **Airflow example uses Airflow 1.x patterns** (PythonOperator with
  side effects, no TaskFlow API): update to Airflow 2.7+ TaskFlow API.
- **Spark example is RDD-only:** add DataFrame/Spark SQL primary path;
  RDD is legacy.
- **dbt example uses `dbt run` without `dbt test` or sources:**
  add the data-quality dimension; interview answers always probe it.
- **System-design case skips capacity sizing** (events/sec, TB/day,
  fan-out): add the back-of-envelope; this is what DE interviewers
  grade.
- **Snowflake example confuses warehouse / database / schema:** clarify;
  this is a common interview probe.
- **You hit hard stop with modules thin:** record per-module Q count;
  surface to user.
- **Rollback:** remove the domain from `LOCKED_DOMAINS` /
  `LAUNCH_QUICK_PATHS`; content stays on disk.

## Definition of Done

- [ ] All gates green.
- [ ] Tag `pde-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `38` flipped to `DONE`.

## Estimated effort

- **Ideal:** 120 hours.
- **Hard stop:** 180 hours.
