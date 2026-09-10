# Audit — M12_sql-databases

**Pillar:** P03  
**Module:** M12 sql-databases  
**Topics:** 14  
**Questions:** 38 (38 written, 0 stubs)

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | OVERLAP | MAJOR | **transactions-and-acid**: `transaction-isolation-levels-sql` ↔ `mysql-transaction-isolation-levels` — shared tokens: isolation, levels, transaction (Jaccard 0.6) |
| S2 | OVERLAP | MAJOR | **query-optimization**: `sql-explain-plan-query-optimization` ↔ `mysql-explain-query-optimization` — shared tokens: explain, optimization, query (Jaccard 0.5) |
| S3 | OVERLAP | MAJOR | **query-optimization**: `mysql-explain-query-optimization` ↔ `mysql-query-cache-query-optimization` — shared tokens: mysql, optimization, query (Jaccard 0.6) |

## Topic: sql-fundamentals

_4 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** database-normalization-forms | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q2** sql-vs-nosql-databases | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** many-to-many-relationship-modeling | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** database-normalization-1nf-2nf-3nf | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |

## Topic: joins-and-subqueries

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** sql-joins-inner-outer-cross-self | direct_answer is 67 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q2** sql-subqueries-vs-joins | direct_answer is 66 words with no bold anchors | ✓ | ✓ | MODERATE |

## Topic: indexes-and-performance

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** database-indexes-types | direct_answer is 63 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** database-indexes-btree-hash | direct_answer is 85 words with no bold anchors | ✓ | ✓ | MODERATE |
| **Q3** mysql-index-types-btree-fulltext-composite | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |

## Topic: transactions-and-acid

_4 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** acid-properties-transactions | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q2** transaction-isolation-levels-sql | direct_answer is 63 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q3** mysql-transaction-isolation-levels | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |
| **Q4** innodb-locking-row-gap-next-key | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |

## Topic: postgresql-features

_11 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** mysql-vs-postgresql-java-developers | direct_answer is 61 words with no bold anchors; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MODERATE |
| **Q2** postgresql-window-functions | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q3** postgresql-explain-analyze | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q4** postgresql-indexes-btree-gin-gist | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q5** postgresql-transactions-isolation-levels | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q6** postgresql-jsonb-queries-indexing | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with no analogies detected | MINOR |
| **Q7** postgresql-connection-pooling-pgbouncer | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q8** postgresql-locking-deadlocks | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q9** postgresql-partitioning-large-tables | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q10** postgresql-query-optimization-n-plus-one | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |
| **Q11** postgresql-full-text-search | no **bold** anchors in direct_answer | ✓ | ✓ | MINOR |

## Topic: advanced-sql-features

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** sql-window-functions-row-number-rank | direct_answer is 69 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |

## Topic: connection-pooling

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** database-connection-pooling | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** spring-boot-mysql-connection-pool-tuning | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |

## Topic: query-optimization

_3 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** sql-explain-plan-query-optimization | direct_answer is 61 words with no bold anchors | ✓ | substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** mysql-explain-query-optimization | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |
| **Q3** mysql-query-cache-query-optimization | direct_answer is 61 words with no bold anchors; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MODERATE |

## Topic: partitioning-and-sharding

_2 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** database-sharding | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** mysql-partitioning | direct_answer is 70 words with no bold anchors; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MODERATE |

## Topic: replication

_1 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** mysql-replication-primary-replica | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |

## Topic: database-migrations

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: backup-recovery

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Topic: scenario-based

_5 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** oltp-vs-olap | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q2** high-read-throughput-design | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples | MODERATE |
| **Q3** soft-deletes-database-design | direct_answer is 62 words with no bold anchors | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q4** eventual-consistency-design | no **bold** anchors in direct_answer | ✓ | substantive Zone 3 with zero code examples; substantive Zone 3 with no analogies detected | MODERATE |
| **Q5** innodb-vs-myisam-storage-engines | no **bold** anchors in direct_answer; interviewer_intent missing one of testing/common_mistake/to_stand_out | ✓ | ✓ | MINOR |

## Topic: comparisons

_0 questions (0 stubs)._

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|

## Tally

- **CRITICAL:** 0
- **MAJOR:** 0
- **MODERATE:** 18
- **MINOR:** 20
- **CLEAN:** 0
- **STUBS:** 0

### Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 27
- `zone3_no_analogy` × 13
- `zone1_direct_answer_paragraph_wall` × 11
- `zone1_interviewer_intent_incomplete` × 10
- `zone3_no_code_examples` × 9

---

_This is a structural-signal report produced by the v3 auditor. A judgment layer (analogies, standard interview facts, tone calibration against top internet sources) will be layered on top per module as needed._
