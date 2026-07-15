#!/usr/bin/env python3
"""
Generate complete Java Backend Intermediate content.
Creates new stacks and enhances existing ones with complete-qa.json files.
"""
import json
import os

CONTENT_ROOT = "/Users/ravi.r_flx/IEProject/InterviewExplainer/content/domains/java/backend/3-5"

# ─── Helper ───────────────────────────────────────────────────────────────────

def write_stack(stack_slug, subcategories):
    stack_dir = os.path.join(CONTENT_ROOT, stack_slug)
    os.makedirs(stack_dir, exist_ok=True)
    for subcat_slug, subcat_data in subcategories.items():
        subcat_dir = os.path.join(stack_dir, subcat_slug)
        os.makedirs(subcat_dir, exist_ok=True)
        questions = subcat_data["questions"]
        q_index = [{
            "id": q["slug"], "title": q["title"], "slug": q["slug"],
            "question": q["question"], "difficulty": q["difficulty"],
            "importance": q.get("importance", "high"),
        } for q in questions]
        with open(os.path.join(subcat_dir, "questions.json"), "w") as f:
            json.dump(q_index, f, indent=2, ensure_ascii=False)
        complete_qa = {"topic": subcat_data["topic"], "topicSlug": subcat_slug, "questions": questions}
        with open(os.path.join(subcat_dir, "complete-qa.json"), "w") as f:
            json.dump(complete_qa, f, indent=2, ensure_ascii=False)
    print(f"✓ Stack: {stack_slug} ({len(subcategories)} subcats)")

def q(slug, title, question, difficulty, importance, expectation, spoken, deep):
    return {
        "id": slug, "title": title, "slug": slug, "question": question,
        "difficulty": difficulty, "importance": importance,
        "answer": {"sections": [
            {"type": "interviewer_expectation", "title": "What the Interviewer Wants to Hear", "content": expectation},
            {"type": "speakable_answer", "title": "Interview Answer", "content": spoken},
            {"type": "deep_explanation", "title": "Concept Explained", "content": deep},
        ]}
    }

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 1: SQL DATABASES
# ═══════════════════════════════════════════════════════════════════════════════

SQL_DATABASES = {
    "sql-fundamentals": {
        "topic": "SQL Fundamentals",
        "questions": [
            q("sql-select-clauses",
              "SQL Query Clauses and Execution Order",
              "Explain the main SQL SELECT clauses and in what order SQL executes them.",
              "medium", "high",
              """- Know the **logical execution order**: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
- Distinguish WHERE (filters rows before grouping) from HAVING (filters after grouping)
- Understand aliases defined in SELECT are not available in WHERE (execution order reason)
- Know that ORDER BY is the last logical step — most expensive for large result sets
- Red flag: confusing WHERE and HAVING, or not knowing why you can't use SELECT aliases in WHERE""",
              """SQL executes your query in a specific logical order that often surprises developers who read it top-down. The engine starts with FROM and JOIN to build the full dataset, then WHERE to filter individual rows, then GROUP BY to aggregate, then HAVING to filter those aggregated groups. Only after all that does SELECT determine which columns to return, followed by ORDER BY and LIMIT.

This matters practically. If you write WHERE salary > AVG(salary), it fails because WHERE runs before aggregation — you need HAVING or a subquery. Similarly, you can't reference a SELECT alias in a WHERE clause because SELECT hasn't executed yet at that point.

Understanding this order helps you write correct queries the first time and debug wrong ones faster.""",
              """## Logical Execution Order

```sql
SELECT department, AVG(salary) AS avg_sal   -- 6: compute columns
FROM employees                               -- 1: start here
JOIN departments USING (dept_id)            -- 2: join
WHERE hire_date > '2020-01-01'              -- 3: row filter (before grouping)
GROUP BY department                         -- 4: aggregate
HAVING AVG(salary) > 80000                  -- 5: filter groups (after aggregating)
ORDER BY avg_sal DESC                       -- 7: sort
LIMIT 10;                                   -- 8: cut results
```

**Common gotchas:**
- `WHERE` cannot reference aggregate functions — use `HAVING`
- `WHERE` cannot reference SELECT aliases — execution happens before SELECT
- `DISTINCT` is evaluated as part of SELECT (step 6)
- Window functions (`OVER()`) execute after WHERE/GROUP BY but before ORDER BY

**Performance tip:** Push as much filtering as possible into WHERE, not HAVING. Filtering before grouping reduces the rows the database has to aggregate."""),

            q("sql-joins-explained",
              "SQL JOINs",
              "What are the different types of SQL JOINs and when do you use each?",
              "easy", "high",
              """- INNER JOIN: only matching rows from both tables — most common
- LEFT JOIN: all rows from left table, nulls for unmatched right rows
- RIGHT JOIN: opposite of LEFT (usually rewrite as LEFT for readability)
- FULL OUTER JOIN: all rows from both tables, nulls where no match
- CROSS JOIN: cartesian product — every combination (use with caution)
- Self JOIN: joining a table to itself (org hierarchies, comparisons)
- Explain the ON vs USING vs natural join difference
- Red flag: not knowing LEFT JOIN includes NULLs for unmatched rows""",
              """An INNER JOIN returns only rows where the join condition matches in both tables — it's what most people mean when they just say "join." A LEFT JOIN returns every row from the left table regardless of whether there's a match on the right; unmatched right columns come back as NULL. This is the one you reach for when you want "all orders, with customer details if available."

A FULL OUTER JOIN combines both sides — rows from both tables regardless of matching, with NULLs where there's no counterpart. It's useful for finding differences between two tables, like "which customers have no orders AND which orders have no customer."

The practical reality is that INNER and LEFT JOINs cover 95% of real-world use cases. RIGHT JOIN is almost always rewritten as a LEFT JOIN by swapping table order. CROSS JOINs are rare and can accidentally generate millions of rows.""",
              """## Visual Guide

```
Table A: [1, 2, 3]    Table B: [2, 3, 4]

INNER JOIN → [2, 3]           (only matches)
LEFT JOIN  → [1, 2, 3]        (all of A, nulls for 1)
RIGHT JOIN → [2, 3, 4]        (all of B, nulls for 4)
FULL JOIN  → [1, 2, 3, 4]     (everything, nulls where no match)
```

## Common Patterns

```sql
-- Find customers with no orders (LEFT JOIN + NULL check)
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- Self join: find employees who earn more than their manager
SELECT e.name, e.salary, m.name AS manager, m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

## Performance Note
Joins on indexed columns are fast. Always ensure the join columns (especially foreign keys) have indexes. The query optimizer chooses the join algorithm (nested loop, hash join, merge join) based on data size and available indexes."""),

            q("sql-aggregate-window",
              "Aggregate vs Window Functions",
              "What is the difference between aggregate functions and window functions in SQL?",
              "medium", "high",
              """- Aggregate functions collapse multiple rows into one (GROUP BY required)
- Window functions compute across a set of rows but **keep each row** — no collapsing
- OVER() clause defines the window: PARTITION BY divides groups, ORDER BY adds sequence
- ROW_NUMBER(), RANK(), DENSE_RANK() for numbering
- LAG(), LEAD() for accessing previous/next row values
- SUM() OVER (PARTITION BY ...) for running totals
- Red flag: not being able to write a query to get the top-N per group""",
              """The key difference is what happens to your rows. Aggregate functions like SUM, COUNT, AVG collapse a group of rows down to a single row — you lose individual row data. Window functions compute across a group of rows but return a value for every individual row, keeping the full dataset intact.

This makes window functions powerful for ranked lists, running totals, and comparing each row to a group aggregate. The OVER clause is what makes it a window function. PARTITION BY works like GROUP BY but doesn't collapse — it just defines which rows each function "sees." ORDER BY inside OVER defines the frame for running calculations.

In practice, window functions replace dozens of self-joins and subqueries that were needed to get ranked or running aggregate results in older SQL patterns.""",
              """## Aggregate vs Window Comparison

```sql
-- Aggregate: one row per department
SELECT department, AVG(salary) AS dept_avg
FROM employees
GROUP BY department;

-- Window: one row per employee, but with dept average alongside
SELECT name, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS dept_avg,
       salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM employees;
```

## Ranking Functions

```sql
-- ROW_NUMBER: unique number, no ties
-- RANK: ties get same rank, next rank skips (1,1,3)
-- DENSE_RANK: ties get same rank, no gaps (1,1,2)
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

## Top-N Per Group (Classic Interview Pattern)

```sql
-- Top 3 earners per department
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
    FROM employees
) ranked
WHERE rn <= 3;
```

## Running Total

```sql
SELECT date, revenue,
       SUM(revenue) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) AS running_total
FROM daily_sales;
```"""),

            q("sql-indexes-performance",
              "SQL Indexes and Query Performance",
              "How do indexes work in SQL and when should you add or avoid them?",
              "medium", "high",
              """- Index is a separate data structure (usually B-tree) that allows O(log n) lookups instead of O(n) scans
- Speeds up SELECT/WHERE/JOIN, but slows INSERT/UPDATE/DELETE (index must be updated)
- Composite indexes: column order matters — leftmost prefix rule
- Covering index: includes all columns a query needs, avoids table lookup
- When NOT to index: low-cardinality columns (boolean, status), heavily written tables, small tables
- Use EXPLAIN/EXPLAIN ANALYZE to see if indexes are being used
- Red flag: indexing everything, or not knowing why an index might not be used""",
              """An index is a sorted data structure built alongside your table that lets the database find rows without scanning every single one. Think of it like a book index — instead of reading every page to find "transactions," you look up T in the index and go directly to the right pages. For large tables, this is the difference between milliseconds and minutes.

The tradeoff is write performance. Every INSERT, UPDATE, or DELETE must update all affected indexes. A table with 10 indexes takes 10 times longer to write to than one with no indexes. So you index columns you query frequently, not everything.

The most common mistake is creating indexes on every column "just in case." You should index foreign keys, columns in WHERE clauses, and columns used for sorting. You shouldn't index columns with few distinct values, like a boolean flag, because the database might decide a full table scan is actually faster than using the index for half the rows.""",
              """## How B-tree Index Works

An index stores column values in sorted order with pointers to the actual rows. When you query `WHERE email = 'user@example.com'`, the database binary-searches the index (O(log n)) instead of scanning every row (O(n)).

## Index Types

| Type | Use Case |
|------|----------|
| B-tree (default) | Equality, range queries, sorting |
| Hash | Equality only, faster for exact match |
| GIN | Full-text search, arrays (PostgreSQL) |
| Partial | Index only a subset of rows |

## Composite Index Column Order Matters

```sql
CREATE INDEX idx_emp ON employees (department, salary, hire_date);

-- Uses index: query matches leftmost prefix
SELECT * FROM employees WHERE department = 'Engineering';
SELECT * FROM employees WHERE department = 'Engineering' AND salary > 90000;

-- Does NOT use index: skipped left column
SELECT * FROM employees WHERE salary > 90000;
```

## EXPLAIN to Check Index Usage

```sql
EXPLAIN ANALYZE
SELECT * FROM employees WHERE department = 'Engineering' AND salary > 90000;
-- Look for "Index Scan" vs "Seq Scan"
-- Check "rows" estimate vs "actual rows" — large differences = stale statistics
```

## Covering Index (No Table Lookup Needed)

```sql
-- Query only needs dept and salary — covering index avoids heap fetch
CREATE INDEX idx_covering ON employees (department, salary);
SELECT department, salary FROM employees WHERE department = 'Engineering';
```"""),

            q("sql-transactions-acid",
              "Transactions and ACID Properties",
              "What are ACID properties in databases, and how do transaction isolation levels work?",
              "medium", "high",
              """- **Atomicity**: all or nothing — either all statements commit or all roll back
- **Consistency**: transaction takes DB from one valid state to another
- **Isolation**: concurrent transactions don't see each other's intermediate state
- **Durability**: once committed, data survives crashes (written to disk)
- Isolation levels from weakest to strongest: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE
- Problems they solve: dirty read, non-repeatable read, phantom read
- Spring `@Transactional` defaults to database default (usually READ COMMITTED)
- Red flag: not knowing the difference between isolation levels or what problems they prevent""",
              """ACID is the set of guarantees that make a database reliable. Atomicity means a transaction is all-or-nothing — if you're transferring money from account A to B, either both the debit and credit happen, or neither does. No partial state. Consistency means every transaction leaves the database in a valid state according to your rules (constraints, foreign keys, etc.). Isolation means concurrent transactions don't interfere with each other's work. Durability means once a transaction commits, the data is permanently saved even if the server crashes a millisecond later.

Isolation is the most nuanced because different levels trade correctness for performance. READ COMMITTED (PostgreSQL default) prevents dirty reads but allows non-repeatable reads — a value you read twice in one transaction might change between reads. REPEATABLE READ guarantees the same data if you read the same row twice, but allows phantom reads where new rows can appear. SERIALIZABLE is the strongest — it behaves as if transactions ran one after another, but it's the most expensive.

In practice, READ COMMITTED is fine for most web applications. You'd step up to SERIALIZABLE only for financial transactions or any operation where the correctness of decisions depends on consistent snapshots.""",
              """## ACID Breakdown

| Property | Guarantee | Mechanism |
|----------|-----------|-----------|
| Atomicity | All-or-nothing | Rollback log (undo log) |
| Consistency | Valid state always | Constraints, triggers, application logic |
| Isolation | Concurrent transparency | Locks, MVCC |
| Durability | Survives crashes | Write-ahead log (WAL) |

## Isolation Levels and Anomalies

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | ✗ Prevented | Possible | Possible |
| REPEATABLE READ | ✗ | ✗ Prevented | Possible |
| SERIALIZABLE | ✗ | ✗ | ✗ Prevented |

## Spring @Transactional

```java
// Default isolation: READ_COMMITTED (inherits from DB)
@Transactional
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    Account from = accountRepo.findById(fromId).orElseThrow();
    Account to = accountRepo.findById(toId).orElseThrow();
    from.debit(amount);    // debit
    to.credit(amount);     // credit
    // If any exception: both operations roll back
}

// Serializable for critical financial operations
@Transactional(isolation = Isolation.SERIALIZABLE)
public void processPayment(Long accountId, BigDecimal amount) {
    // ...
}
```

## Deadlocks
Two transactions each holding a lock the other needs. Databases detect and kill one. Prevention: always acquire locks in consistent order (always lock account with smaller ID first)."""),
        ]
    },

    "sql-joins-subqueries": {
        "topic": "SQL Joins, Subqueries, and CTEs",
        "questions": [
            q("cte-common-table-expressions",
              "Common Table Expressions (CTEs)",
              "What are CTEs in SQL and how do they differ from subqueries?",
              "medium", "high",
              """- CTE (WITH clause) creates a named, temporary result set for the duration of the query
- Makes complex queries readable by naming intermediate steps
- Recursive CTEs traverse hierarchical data (org charts, trees, graphs)
- Performance: in PostgreSQL CTEs are an optimization fence (materialized by default), subqueries inline
- Use CTEs for readability and recursion; use subqueries when optimizer can benefit from inlining
- Multiple CTEs in one WITH clause, can reference earlier ones""",
              """A CTE, written with the WITH keyword, gives you a named temporary result set you can reference just like a table in the same query. The big benefit is readability — you break a complex query into named, logical steps instead of nesting subqueries four levels deep. Another developer (or future you) can read "monthly_totals" and immediately understand what that data represents.

Recursive CTEs are a separate superpower for hierarchical data. They let you walk a tree structure — like an org chart where each employee has a manager — using SQL without needing application-level recursion or multiple database roundtrips.

The performance nuance: in PostgreSQL, a CTE is by default "materialized," meaning it runs once and the result is stored temporarily. This can be faster if the CTE is referenced multiple times, but slower if the optimizer could have pushed a filter into the CTE. You can override with `MATERIALIZED` or `NOT MATERIALIZED` hints.""",
              """## CTE vs Nested Subquery — Same Result, Different Readability

```sql
-- Hard to read: nested subqueries
SELECT * FROM (
    SELECT department, AVG(salary) AS avg_sal
    FROM (SELECT * FROM employees WHERE hire_date > '2020-01-01') recent
    GROUP BY department
) dept_avgs
WHERE avg_sal > 80000;

-- Clear: CTE with named steps
WITH recent_hires AS (
    SELECT * FROM employees WHERE hire_date > '2020-01-01'
),
dept_averages AS (
    SELECT department, AVG(salary) AS avg_sal
    FROM recent_hires
    GROUP BY department
)
SELECT * FROM dept_averages WHERE avg_sal > 80000;
```

## Recursive CTE — Org Chart Traversal

```sql
WITH RECURSIVE org_tree AS (
    -- Base case: top-level managers (no manager above them)
    SELECT id, name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive step: find direct reports of current level
    SELECT e.id, e.name, e.manager_id, ot.level + 1
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT level, name FROM org_tree ORDER BY level, name;
```

## Multiple CTEs

```sql
WITH
  monthly_revenue AS (SELECT month, SUM(amount) AS revenue FROM sales GROUP BY month),
  monthly_costs   AS (SELECT month, SUM(cost) AS costs FROM expenses GROUP BY month)
SELECT mr.month, mr.revenue, mc.costs, (mr.revenue - mc.costs) AS profit
FROM monthly_revenue mr
JOIN monthly_costs mc USING (month);
```"""),

            q("sql-subquery-types",
              "Subquery Types",
              "What are the different types of subqueries in SQL and when do you use each?",
              "medium", "medium",
              """- Scalar subquery: returns a single value, usable anywhere a value is expected
- Column subquery: returns a single column (used with IN, ANY, ALL)
- Row subquery: returns a single row
- Table subquery: returns multiple rows and columns (used in FROM)
- Correlated subquery: references outer query's row — runs once per outer row (can be slow)
- EXISTS vs IN: EXISTS short-circuits, better for large inner datasets; IN better for small lists
- Red flag: using a correlated subquery where a JOIN would be much more efficient""",
              """Subqueries are queries nested inside another query. The type depends on what they return and where they're used. A scalar subquery returns exactly one value and can appear anywhere you'd use a constant — like `WHERE price > (SELECT AVG(price) FROM products)`. A table subquery in the FROM clause acts like a temporary table, which is exactly what a CTE does with a name.

The important distinction is correlated vs uncorrelated. An uncorrelated subquery runs once and its result is reused. A correlated subquery references a value from the outer query, so it reruns for every single row the outer query processes. This can turn a fast query into a slow one — 10,000 rows means 10,000 subquery executions.

EXISTS is special: it stops as soon as it finds one matching row. When checking "does a customer have any orders," EXISTS is faster than IN with a large orders table because it stops at the first match.""",
              """## Subquery Types by Return Shape

```sql
-- Scalar: returns one value
SELECT name, salary,
       (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees;

-- Column: returns one column (with IN)
SELECT * FROM employees
WHERE department_id IN (SELECT id FROM departments WHERE location = 'NYC');

-- Table (inline view): returns a result set
SELECT dept_name, max_sal FROM (
    SELECT d.name AS dept_name, MAX(e.salary) AS max_sal
    FROM employees e JOIN departments d ON e.dept_id = d.id
    GROUP BY d.name
) dept_stats WHERE max_sal > 100000;
```

## Correlated Subquery (runs per outer row)

```sql
-- Find employees earning more than their department average
-- Runs once per employee row — can be slow on large tables
SELECT name, salary, department
FROM employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department = e.department  -- ← references outer query
);
```

## EXISTS vs IN

```sql
-- IN: collects all matching IDs first, then filters
SELECT * FROM customers c
WHERE c.id IN (SELECT customer_id FROM orders);

-- EXISTS: stops at first match per customer — faster for large orders table
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

**Rule of thumb:** Use EXISTS for "has any" checks on large tables, IN for small enumerated lists."""),
        ]
    },

    "transactions-concurrency": {
        "topic": "Transactions and Concurrency Control",
        "questions": [
            q("optimistic-pessimistic-locking",
              "Optimistic vs Pessimistic Locking",
              "What is the difference between optimistic and pessimistic locking, and when do you use each?",
              "hard", "high",
              """- Pessimistic locking: lock the row on read, hold until transaction ends (SELECT FOR UPDATE)
- Optimistic locking: no lock on read — check version/timestamp at write time, retry if conflict
- Pessimistic: right choice for high-contention scenarios (many updates to same rows)
- Optimistic: right choice for low-contention (most reads don't have competing writes)
- JPA: `@Version` field for optimistic locking, LockModeType.PESSIMISTIC_WRITE for pessimistic
- OptimisticLockException thrown when version mismatch — must handle with retry""",
              """Pessimistic locking says "I assume someone else will try to change this data while I'm working with it, so I'll lock it immediately on read." Using SELECT FOR UPDATE, the row is locked from when you read it until your transaction commits. Other transactions trying to modify that row wait. It prevents conflicts entirely but reduces concurrency — everyone queues up for the lock.

Optimistic locking takes the opposite bet: "conflicts are rare, so I won't lock anything. I'll just check at write time whether the data changed since I read it." This is done with a version number. You read the row with version 5, do your work, and on update you say "update this row WHERE version = 5." If someone else updated it first, version is now 6, your WHERE clause matches nothing, and you know you have a conflict and need to retry.

The choice comes down to contention. Bank account transfers — high contention, use pessimistic. User profile updates — low contention, use optimistic. Optimistic locking scales much better because no locks means no waiting.""",
              """## Optimistic Locking with JPA @Version

```java
@Entity
public class Product {
    @Id
    private Long id;
    private int quantity;

    @Version
    private Long version;  // JPA manages this automatically
}

// Usage: JPA adds WHERE id = ? AND version = ? to UPDATE
@Transactional
public void decrementStock(Long productId, int amount) {
    Product p = repo.findById(productId).orElseThrow();
    if (p.getQuantity() < amount) throw new InsufficientStockException();
    p.setQuantity(p.getQuantity() - amount);
    // JPA update: UPDATE product SET quantity=?, version=6 WHERE id=? AND version=5
    // If another transaction updated it first: OptimisticLockException
}
```

## Pessimistic Locking

```java
// SELECT ... FOR UPDATE — row locked until transaction ends
@Transactional
public void transferFunds(Long fromId, Long toId, BigDecimal amount) {
    Account from = em.find(Account.class, fromId, LockModeType.PESSIMISTIC_WRITE);
    Account to = em.find(Account.class, toId, LockModeType.PESSIMISTIC_WRITE);
    from.debit(amount);
    to.credit(amount);
}
```

## When to Use Which

| Scenario | Recommendation |
|----------|---------------|
| Banking / inventory with concurrent writes | Pessimistic |
| User profiles, settings, product catalog | Optimistic |
| Long-running operations (multi-screen forms) | Optimistic |
| Short transactions, heavily contested rows | Pessimistic |"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 2: POSTGRESQL
# ═══════════════════════════════════════════════════════════════════════════════

POSTGRESQL = {
    "postgresql-fundamentals": {
        "topic": "PostgreSQL Fundamentals",
        "questions": [
            q("postgres-vs-mysql",
              "PostgreSQL vs MySQL",
              "What are the key differences between PostgreSQL and MySQL, and why might you choose PostgreSQL for a Java backend?",
              "easy", "high",
              """- PostgreSQL: full ACID, advanced types (JSONB, arrays, UUID), window functions, CTEs, full-text search
- PostgreSQL follows SQL standard more strictly; MySQL has more flexibility/quirks
- PostgreSQL handles complex queries better; MySQL traditionally better for simple high-volume reads
- JSONB in PostgreSQL is a first-class data type with indexing — MySQL's JSON support came later
- PostgreSQL is the preferred choice for most modern Java/Spring applications
- Both supported well by Spring Data JPA, Hibernate, JDBC""",
              """PostgreSQL and MySQL are both excellent relational databases, but they have a different design philosophy. PostgreSQL is built for correctness and feature richness — it closely follows the SQL standard, has stronger ACID guarantees, and provides sophisticated data types like JSONB (indexed JSON), arrays, ranges, and even custom types. MySQL historically prioritized read-heavy workloads and simplicity, which made it dominant in web applications during the LAMP stack era.

For modern Java backends, PostgreSQL is usually the better choice. Spring Boot and Hibernate work equally well with both, but PostgreSQL's JSONB support lets you store semi-structured data without a separate NoSQL database. Its window functions, CTEs, and full-text search are more mature. AWS RDS and Google Cloud both offer managed PostgreSQL, making it easy to run in production without managing your own server.

MySQL still makes sense when you need maximum read throughput with simple queries, have an existing MySQL infrastructure, or are on a team where MySQL expertise is strong.""",
              """## Feature Comparison

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| ACID compliance | Full | Full (InnoDB) |
| JSONB with indexing | Native, excellent | Good (5.7+) |
| Arrays | Native | No |
| Full-text search | Built-in | Basic |
| Window functions | Full support | Full (8.0+) |
| CTEs | Full, recursive | Full (8.0+) |
| Partitioning | Declarative, mature | Available |
| Replication | Streaming, logical | Row/statement based |

## Spring Boot Configuration

```yaml
# PostgreSQL
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USER}
    password: ${DB_PASS}
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate  # production: validate against schema, never create
```

## PostgreSQL-Specific Features Used Often

```sql
-- JSONB column with GIN index
ALTER TABLE users ADD COLUMN metadata JSONB;
CREATE INDEX idx_metadata ON users USING GIN (metadata);
SELECT * FROM users WHERE metadata @> '{"plan": "premium"}';

-- UUID as primary key (common in Java microservices)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```"""),

            q("jsonb-postgresql",
              "JSONB in PostgreSQL",
              "What is JSONB in PostgreSQL and how do you use it effectively in a Java application?",
              "medium", "high",
              """- JSONB stores JSON as a binary format — parsed on insert, fast to query
- JSON stores as text — cheaper insert, but slower queries (must parse each time)
- JSONB supports GIN indexing for fast @> containment queries
- Query operators: `->>` for text value, `->` for JSON value, `#>>` for path
- Spring Boot: use `@JdbcTypeCode(SqlTypes.JSON)` or `AttributeConverter` to map JSONB to Java POJOs
- Avoid: storing all data as JSONB — only for genuinely variable/semi-structured data""",
              """JSONB is PostgreSQL's binary JSON type that's stored in a decomposed binary format. When you insert JSON, PostgreSQL parses it, validates it, and stores it efficiently — removing duplicate keys, normalizing whitespace, and ordering keys. Queries against JSONB are fast because the data is pre-parsed. The JSON type (without the B) stores raw text and must reparse on every query, making it much slower for reads.

In Java backends, JSONB is useful when different records of the same entity have different attributes — like product specifications that vary by product category, or user preferences that evolve over time without requiring schema migrations. You can store a Java object as JSONB and query on its fields from SQL, which is a nice middle ground between rigid relational schemas and MongoDB-style documents.

The power comes from GIN indexes. With one index, you can do containment queries like "find all users whose metadata contains `{plan: 'premium'}`" in milliseconds, even on millions of rows.""",
              """## JSONB vs JSON

```sql
-- JSON: stored as text, whitespace preserved, no indexing
CREATE TABLE logs (payload JSON);

-- JSONB: stored binary, ordered, fast queries, indexable
CREATE TABLE users (preferences JSONB);
```

## Common JSONB Operators

```sql
-- -> returns JSON, ->> returns text
SELECT preferences -> 'theme'           -- returns JSON: "dark"
SELECT preferences ->> 'theme'          -- returns text: dark
SELECT preferences -> 'notifications' ->> 'email'  -- nested

-- Containment: find users with premium plan
SELECT * FROM users WHERE preferences @> '{"plan": "premium"}';

-- Key exists
SELECT * FROM users WHERE preferences ? 'phone_number';

-- Path query
SELECT preferences #>> '{address, city}' AS city FROM users;
```

## Spring Boot + JSONB

```java
@Entity
@Table(name = "products")
public class Product {
    @Id private Long id;
    private String name;

    // Map JSONB column to Java object
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> specifications;
}
```

## GIN Index for Performance

```sql
-- Index the entire JSONB column for containment queries
CREATE INDEX idx_prefs_gin ON users USING GIN (preferences);

-- More targeted: index specific path
CREATE INDEX idx_plan ON users USING GIN ((preferences -> 'plan'));
```

**When to use JSONB:** Variable attributes across records, configuration blobs, audit logs, external API responses you need to store and search."""),

            q("postgres-explain-analyze",
              "PostgreSQL EXPLAIN ANALYZE",
              "How do you use EXPLAIN ANALYZE in PostgreSQL to diagnose slow queries?",
              "medium", "high",
              """- EXPLAIN shows the query plan without executing; EXPLAIN ANALYZE runs the query and shows actual times
- Key things to look for: Sequential Scan on large tables, high row estimates vs actuals
- Node types: Seq Scan (bad for large tables), Index Scan, Bitmap Index Scan, Hash Join, Nested Loop
- Cost units are arbitrary but comparable within one query plan
- Buffers: show cache hit ratio (`EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)`)
- High rows estimate mismatch means stale statistics — run ANALYZE""",
              """EXPLAIN shows you the query plan — how PostgreSQL intends to execute your query, what indexes it will use, what join strategy it will employ, and estimated costs. EXPLAIN ANALYZE actually runs the query and adds real timings alongside the estimates. This comparison is gold for debugging: when estimates wildly differ from actuals, that tells you the query planner has bad statistics and is making poor decisions.

The most important thing to watch for is a Sequential Scan on a large table when you expect an Index Scan. This means either no index exists, the index can't be used for that query shape (maybe you're calling a function on the indexed column), or the planner thinks a scan is faster than the index (rare, but happens for very non-selective predicates).

Running `ANALYZE tablename` after large data loads updates the statistics the planner uses to make decisions. In production, `autovacuum` handles this automatically, but a large import might need a manual ANALYZE to prevent bad plans.""",
              """## Reading EXPLAIN Output

```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'pending'
  AND o.created_at > NOW() - INTERVAL '7 days';
```

**Sample output:**
```
Hash Join  (cost=150.00..3200.00 rows=500 width=200)
           (actual time=12.5..45.3 rows=487 loops=1)
  Hash Cond: (o.customer_id = c.id)
  ->  Seq Scan on orders o  (cost=0.00..2000.00 rows=500 width=100)
                             (actual time=0.1..25.0 rows=487 loops=1)
        Filter: (status = 'pending' AND created_at > ...)
        Rows Removed by Filter: 15213
  ->  Hash  (cost=100.00..100.00 rows=4000 width=100)
        ->  Seq Scan on customers c
```

**What this tells us:**
- Seq Scan on orders with 15,213 rows removed — add index on `(status, created_at)`
- Seq Scan on customers — likely fine if customers is small

## Useful EXPLAIN Options

```sql
-- Full information: plan + actual timing + buffer cache info
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT ...;

-- Check if your index is used
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- Should show: Index Scan using orders_customer_id_idx

-- If it shows Seq Scan instead, the index might not exist or
-- the column might be wrapped in a function:
-- BAD:  WHERE LOWER(email) = 'user@example.com'  (function prevents index use)
-- GOOD: CREATE INDEX ON users (LOWER(email))       (functional index)
```"""),
        ]
    },

    "postgresql-advanced": {
        "topic": "Advanced PostgreSQL Features",
        "questions": [
            q("postgres-partitioning",
              "Table Partitioning in PostgreSQL",
              "What is table partitioning in PostgreSQL and when should you use it?",
              "hard", "medium",
              """- Partitioning splits a large table into smaller physical partitions based on a key
- Partition types: RANGE (dates), LIST (categories), HASH (even distribution)
- Partition pruning: queries touching only one partition skip others entirely
- Benefit: archive old partitions (detach and drop) without locking the whole table
- Each partition is a regular table and can have its own indexes
- Best for: time-series data, logs, tables you need to archive by date""",
              """Table partitioning is the solution to the "my table has 500 million rows and queries are slow" problem. Instead of one massive table, PostgreSQL manages multiple smaller physical tables (partitions) that look like one logical table from the application's perspective. Your Java code and queries don't change — PostgreSQL routes each query to the right partition automatically.

The most common use case is time-series data. An events table partitioned by month means a query for "events from last month" only scans that month's partition — maybe 10 million rows instead of 500 million. Archiving is also much cleaner: you can detach an old month's partition and drop it instantly, whereas deleting 50 million rows from a non-partitioned table can lock up your database for hours.

The setup requires thinking about your partition key upfront. Range partitioning on a timestamp column is the most common pattern. The key downside is that queries that span many partitions (like "give me all events ever") don't benefit and might even be slightly slower due to partition overhead.""",
              """## Range Partitioning by Date

```sql
-- Create partitioned parent table
CREATE TABLE events (
    id          BIGSERIAL,
    occurred_at TIMESTAMPTZ NOT NULL,
    event_type  VARCHAR(50),
    payload     JSONB
) PARTITION BY RANGE (occurred_at);

-- Create monthly partitions
CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Each partition gets its own index
CREATE INDEX ON events_2024_01 (event_type, occurred_at);
CREATE INDEX ON events_2024_02 (event_type, occurred_at);
```

## Partition Pruning in Action

```sql
-- PostgreSQL only scans events_2024_01 — partition pruning
EXPLAIN SELECT * FROM events
WHERE occurred_at BETWEEN '2024-01-01' AND '2024-01-31';
-- Expect: Append → only events_2024_01, not all partitions

-- Archiving: detach a partition (instant, no lock)
ALTER TABLE events DETACH PARTITION events_2022_01;
DROP TABLE events_2022_01;  -- physical delete
```

## Spring Boot Consideration

No changes needed in Spring/Hibernate — the partitioned table looks like a normal table. Just ensure your queries include the partition key in WHERE clauses so pruning activates."""),

            q("postgres-full-text-search",
              "PostgreSQL Full-Text Search",
              "How does full-text search work in PostgreSQL, and how do you implement it in a Spring Boot application?",
              "medium", "medium",
              """- Full-text search uses `tsvector` (indexed tokens) and `tsquery` (search terms)
- `to_tsvector()` converts text to tokens; `to_tsquery()` converts search terms
- GIN index on tsvector column makes search fast
- Supports ranking results with `ts_rank()`
- Supports stemming (search for "run" finds "running", "runner")
- Good for: article search, product search — not for exact match or substring search
- Spring: use native queries or Spring Data JPA with `@Query`""",
              """PostgreSQL's full-text search converts your text into normalized tokens (called a tsvector) that the database can match efficiently against search queries (tsquery). Unlike a LIKE query which looks for exact character sequences, full-text search understands language — it normalizes words to their root form, ignores stop words like "the" and "a," and supports relevance ranking.

In practice, you create a column of type tsvector on your table (or compute it at query time), add a GIN index on it, and then query using the @@ operator. A GIN index is a generalized inverted index — it maps each token to the rows containing it, which is exactly how search engines work internally.

For a Spring Boot application, you write native queries to leverage PostgreSQL's full-text search. Hibernate doesn't generate these queries automatically because they're database-specific. The benefit over a general-purpose search engine like Elasticsearch is zero additional infrastructure for moderate-scale search needs.""",
              """## Setting Up Full-Text Search

```sql
-- Add a tsvector column for precomputed search tokens
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Populate it (run once, then keep in sync via trigger)
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || body);

-- GIN index for fast search
CREATE INDEX idx_search ON articles USING GIN (search_vector);

-- Keep in sync with trigger
CREATE TRIGGER update_search_vector
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION
    tsvector_update_trigger(search_vector, 'pg_catalog.english', title, body);
```

## Searching and Ranking

```sql
-- Basic search
SELECT title FROM articles
WHERE search_vector @@ to_tsquery('english', 'java & spring');

-- Phrase search
WHERE search_vector @@ phraseto_tsquery('english', 'spring boot');

-- Ranked results
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'java & microservices') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

## Spring Boot Native Query

```java
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query(value = """
        SELECT * FROM articles
        WHERE search_vector @@ plainto_tsquery('english', :searchTerm)
        ORDER BY ts_rank(search_vector, plainto_tsquery('english', :searchTerm)) DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Article> fullTextSearch(@Param("searchTerm") String searchTerm,
                                  @Param("limit") int limit);
}
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 3: AWS FOR JAVA DEVELOPERS
# ═══════════════════════════════════════════════════════════════════════════════

AWS = {
    "aws-core-services": {
        "topic": "AWS Core Services for Java Developers",
        "questions": [
            q("aws-ec2-fundamentals",
              "AWS EC2 Fundamentals",
              "What is Amazon EC2 and how does it fit into a Java backend deployment?",
              "easy", "high",
              """- EC2 = Elastic Compute Cloud: virtual servers in the cloud
- Instance types: t3 (burstable, dev/low traffic), m5 (general purpose), c5 (CPU intensive)
- Key concepts: AMI (machine image template), Security Groups (firewall rules), Key Pairs (SSH access)
- Auto Scaling Groups: automatically add/remove instances based on load
- For Java backends: typically behind a load balancer (ALB), in private subnets
- Modern trend: EC2 being replaced by ECS/EKS for containerized workloads""",
              """EC2 is Amazon's virtual server service — you're essentially renting a computer that runs in AWS data centers. For a Java backend, you'd deploy your Spring Boot JAR on EC2, usually behind an Application Load Balancer that distributes traffic across multiple EC2 instances for high availability.

Instance types let you choose the right hardware profile. T3 instances are good for development environments and applications with variable traffic — they can burst CPU for short periods. M5 instances are the workhorses for production Java applications, providing balanced CPU and memory. If your Spring Boot app is CPU-intensive (complex computations, encryption), C5 instances offer more CPU for the money.

In modern architectures, EC2 is increasingly wrapped by services like Auto Scaling Groups (automatically add servers when load spikes, remove them when it drops) or replaced entirely by ECS (managed containers) or EKS (Kubernetes). Raw EC2 still makes sense for long-running stateful workloads or when you need specific OS-level configurations that containers don't provide.""",
              """## EC2 in a Java Backend Architecture

```
Internet → Route 53 (DNS)
         → ALB (Application Load Balancer)
         → EC2 Auto Scaling Group (private subnet)
              ├── EC2 Instance: Spring Boot app (port 8080)
              ├── EC2 Instance: Spring Boot app (port 8080)
              └── EC2 Instance: Spring Boot app (port 8080)
         → RDS PostgreSQL (private subnet)
         → ElastiCache Redis (private subnet)
```

## Spring Boot on EC2 — systemd Service

```bash
# /etc/systemd/system/myapp.service
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=ec2-user
ExecStart=/usr/bin/java -jar /opt/myapp/myapp.jar \
  --spring.profiles.active=prod
EnvironmentFile=/opt/myapp/.env
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Instance Type Selection Guide

| Workload | Instance Type | Reason |
|----------|--------------|--------|
| Dev/test, low traffic | t3.small / t3.medium | Burstable, cheap |
| Standard REST API | m5.large / m5.xlarge | Balanced |
| High-traffic, CPU-bound | c5.xlarge | More CPU per cost |
| Memory-intensive (caching) | r5.large | More RAM |

## Key Security Group Rules for Spring Boot

```
Inbound: port 8080 from ALB security group only
Outbound: port 5432 to RDS security group
          port 6379 to ElastiCache security group
          port 443 to 0.0.0.0 (HTTPS for external APIs)
```"""),

            q("aws-s3-java",
              "AWS S3 with Java",
              "How do you use Amazon S3 in a Spring Boot application for file storage?",
              "medium", "high",
              """- S3 = Simple Storage Service: object storage for files, images, documents, backups
- Key concepts: buckets (containers), objects (files), keys (paths), ACLs/policies (permissions)
- AWS SDK v2 for Java: `S3Client` for synchronous, `S3AsyncClient` for async operations
- Presigned URLs: let users upload/download directly to S3 without routing through your server
- Spring Cloud AWS: higher-level abstraction over SDK (auto-configures from application.yaml)
- Multipart upload: for files > 5GB or to improve upload speed""",
              """S3 is AWS's object storage service — think of it as a filesystem in the cloud with virtually unlimited capacity. Each file is an "object" stored in a "bucket," identified by a key that looks like a file path. In Java backends, S3 is the standard solution for storing user uploads, generated reports, application assets, and backups.

The most important pattern to understand is presigned URLs. Instead of uploading files to your Spring Boot server (which then relays them to S3), you generate a presigned URL — a time-limited URL that lets the client upload directly to S3. This eliminates the network hop through your server, dramatically reducing your server's bandwidth and memory usage for file uploads. The flow is: client asks your API for an upload URL → your API generates a presigned URL using the SDK → client uploads directly to S3 → client notifies your API when done.

For downloads, the same pattern applies. Generate a presigned download URL with a short expiry (minutes for sensitive files, longer for public assets). This offloads bandwidth from your server to S3's globally distributed infrastructure.""",
              """## AWS SDK v2 Setup

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.21.0</version>
</dependency>
```

## S3 Service in Spring Boot

```java
@Service
public class S3StorageService {

    private final S3Client s3Client;
    private final S3Presigner presigner;

    @Value("${aws.s3.bucket}") private String bucket;

    // Upload a file (server-side)
    public String upload(String key, InputStream content, long size, String contentType) {
        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucket).key(key)
                .contentType(contentType)
                .contentLength(size)
                .build(),
            RequestBody.fromInputStream(content, size)
        );
        return key;
    }

    // Generate presigned upload URL (client uploads directly to S3)
    public String generatePresignedUploadUrl(String key, String contentType, Duration expiry) {
        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(b -> b
            .signatureDuration(expiry)
            .putObjectRequest(r -> r.bucket(bucket).key(key).contentType(contentType))
        );
        return presignedRequest.url().toString();
    }

    // Generate presigned download URL
    public String generatePresignedDownloadUrl(String key, Duration expiry) {
        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(b -> b
            .signatureDuration(expiry)
            .getObjectRequest(r -> r.bucket(bucket).key(key))
        );
        return presignedRequest.url().toString();
    }

    // Delete
    public void delete(String key) {
        s3Client.deleteObject(b -> b.bucket(bucket).key(key));
    }
}
```

## Presigned URL Flow

```
Client → POST /api/files/upload-url?filename=report.pdf
       ← { uploadUrl: "https://bucket.s3.amazonaws.com/...", key: "uploads/uuid/report.pdf" }
Client → PUT {uploadUrl} (with file bytes directly to S3)
Client → POST /api/files/confirm { key: "uploads/uuid/report.pdf" }
Server → saves key to database, returns file ID
```"""),

            q("aws-rds-spring",
              "AWS RDS with Spring Boot",
              "How do you connect a Spring Boot application to Amazon RDS in production?",
              "medium", "high",
              """- RDS = Relational Database Service: managed PostgreSQL/MySQL/Aurora running on AWS
- Multi-AZ deployment: automatic failover to standby replica in another availability zone
- Connection via JDBC URL with RDS endpoint + IAM authentication or secrets
- AWS Secrets Manager: store DB credentials, rotate automatically, retrieve at startup
- Connection pooling: HikariCP (Spring Boot default) — tune pool size for RDS limits
- Parameter groups: tune PostgreSQL settings without SSH access
- Key security: RDS in private subnet, access only from EC2/ECS security group""",
              """RDS is managed PostgreSQL (or MySQL, Oracle, etc.) that AWS operates for you — they handle backups, patching, monitoring, and failover. You get a hostname endpoint like `mydb.cluster-abc.us-east-1.rds.amazonaws.com` that your Spring Boot app connects to just like any JDBC URL.

The critical production patterns are: credentials via AWS Secrets Manager (not hardcoded), Multi-AZ enabled (auto-failover takes 1-2 minutes during AZ failure), and connection pool tuning. HikariCP is Spring Boot's default connection pool and is excellent, but you need to size the maximum pool connections carefully. RDS has a maximum connection limit based on instance size — if 5 pods each have a pool of 20 connections, you're using 100 connections. RDS t3.micro only supports ~85 connections, so you'd exceed the limit.

IAM database authentication is an increasingly popular alternative to password-based auth — your app requests a short-lived token from AWS IAM that works as a database password, eliminating stored secrets entirely.""",
              """## Spring Boot + RDS Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${RDS_ENDPOINT}:5432/${DB_NAME}?ssl=true&sslmode=require
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10       # tune based on RDS instance size
      minimum-idle: 2
      connection-timeout: 20000   # 20 seconds
      idle-timeout: 600000        # 10 minutes
      max-lifetime: 1800000       # 30 minutes
```

## AWS Secrets Manager Integration

```java
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(SecretsManagerClient secretsClient) {
        String secretJson = secretsClient.getSecretValue(b ->
            b.secretId("prod/myapp/db")).secretString();

        ObjectMapper mapper = new ObjectMapper();
        JsonNode secret = mapper.readTree(secretJson);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://" + secret.get("host").asText() +
                          ":5432/" + secret.get("dbname").asText());
        config.setUsername(secret.get("username").asText());
        config.setPassword(secret.get("password").asText());
        return new HikariDataSource(config);
    }
}
```

## RDS Connection Limits by Instance

| Instance | Max Connections |
|----------|----------------|
| db.t3.micro | ~85 |
| db.t3.small | ~150 |
| db.m5.large | ~650 |
| db.m5.xlarge | ~1300 |

Use **PgBouncer** connection pooler in front of RDS when you need more than the instance limit can handle."""),

            q("aws-iam-spring",
              "AWS IAM for Java Developers",
              "How does AWS IAM work and how do you authenticate your Spring Boot app to AWS services?",
              "medium", "high",
              """- IAM = Identity and Access Management: who can do what on which AWS resources
- Key concepts: Users, Groups, Roles, Policies (JSON permission documents)
- EC2/ECS best practice: use IAM Roles attached to instances — no access keys needed
- Least privilege principle: grant only the exact permissions the app needs
- Spring Boot: AWS SDK auto-discovers credentials from environment, roles, or ~/.aws/credentials
- Never hardcode access keys in application.properties — use roles in production""",
              """IAM is AWS's permission system. It controls which AWS services and resources can be accessed by whom and what actions they can take. For your Java application, IAM determines whether your Spring Boot app can read from S3, write to SQS, or access Secrets Manager.

The right pattern for applications running on AWS infrastructure is IAM Roles, not access keys. You attach a role to your EC2 instance or ECS task, and the AWS SDK automatically discovers those credentials from the instance metadata service. This means no credentials are stored in your code, config files, or environment variables. If your instance is compromised, the role can be revoked immediately without changing any application credentials. Access keys, by contrast, must be manually rotated and can be accidentally committed to code repositories.

The principle of least privilege is critical. Your application's role should only have permissions it actually needs. If your app reads from one specific S3 bucket, grant `s3:GetObject` on that one bucket's ARN, not `s3:*` on `*`. This contains the blast radius if credentials are compromised.""",
              """## IAM Role for Spring Boot on ECS

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-app-uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789:secret:prod/myapp/*"
    }
  ]
}
```

## SDK Credential Chain

The AWS SDK tries credentials in this order:
1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. Java system properties
3. AWS credentials profile file (`~/.aws/credentials`)
4. **ECS task role** (when running on ECS)
5. **EC2 instance profile role** (when running on EC2)

In production, step 4 or 5 is used — no credentials anywhere in your application.

## Spring Boot AWS Client Config

```java
@Configuration
public class AwsConfig {

    // SDK auto-discovers credentials from the role attached to the instance/task
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .region(Region.US_EAST_1)
            // No credentials() call needed — uses instance role automatically
            .build();
    }

    @Bean
    public SecretsManagerClient secretsClient() {
        return SecretsManagerClient.builder()
            .region(Region.US_EAST_1)
            .build();
    }
}
```"""),
        ]
    },

    "aws-deployment": {
        "topic": "AWS Deployment and Containers",
        "questions": [
            q("ecs-spring-boot",
              "Deploying Spring Boot to AWS ECS",
              "What is AWS ECS and how do you deploy a Spring Boot application to it?",
              "medium", "high",
              """- ECS = Elastic Container Service: runs Docker containers without managing Kubernetes
- Key components: Cluster → Service → Task Definition → Container
- Fargate: serverless ECS — no EC2 instances to manage, AWS handles server infrastructure
- Task Definition: blueprint for your container (image, CPU, memory, env vars, port mappings)
- Service: runs N copies of your task, integrates with ALB, handles rolling deployments
- Health checks: ALB checks your `/actuator/health` endpoint before routing traffic""",
              """ECS is AWS's way to run containerized applications without managing the underlying servers. You build a Docker image of your Spring Boot app, push it to ECR (Elastic Container Registry), and ECS runs that container according to a Task Definition — a blueprint that specifies the image, how much CPU and memory to allocate, environment variables, port mappings, and logging configuration.

A Service is what keeps your application running. You tell ECS "run 3 copies of this task definition" and it maintains that. When you deploy a new version, ECS does a rolling deployment: it starts new containers, waits for them to pass health checks, then stops old ones. If the new containers fail health checks, the deployment stops and your old version keeps running. This zero-downtime deployment is automatic.

Fargate is the ECS mode where you don't provision EC2 instances at all. You just specify CPU and memory in the task definition and AWS figures out where to run it. It costs a bit more per unit of compute than EC2, but eliminates all instance management overhead — no patching, no sizing, no AMI updates.""",
              """## ECS Architecture for Spring Boot

```
ECR (Docker Registry)
   └── myapp:1.2.3 (image)

ECS Cluster
   └── ECS Service: myapp-prod
        ├── Task: myapp (running)
        ├── Task: myapp (running)
        └── Task: myapp (running)
              └── Container: spring-boot (port 8080)
                   ├── IAM Task Role
                   ├── CloudWatch Logs
                   └── Health: /actuator/health

ALB → Target Group → ECS Tasks (port 8080)
```

## Task Definition (simplified JSON)

```json
{
  "family": "myapp",
  "cpu": "512",
  "memory": "1024",
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::...:role/ecs-execution-role",
  "taskRoleArn": "arn:aws:iam::...:role/myapp-task-role",
  "containerDefinitions": [{
    "name": "myapp",
    "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.2.3",
    "portMappings": [{"containerPort": 8080}],
    "environment": [
      {"name": "SPRING_PROFILES_ACTIVE", "value": "prod"}
    ],
    "secrets": [
      {"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:...:secret:prod/db:password::"}
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"],
      "interval": 30, "timeout": 5, "retries": 3
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/myapp",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
```

## CI/CD Deployment Flow

```
Git push → GitHub Actions
         → docker build -t myapp:$SHA .
         → docker push ECR
         → aws ecs update-service --force-new-deployment
         → ECS rolling update (new containers pass health checks → old ones stop)
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 4: ADVANCED JAVA (Java 8-21 Features)
# ═══════════════════════════════════════════════════════════════════════════════

ADVANCED_JAVA = {
    "streams-lambdas": {
        "topic": "Java Streams and Lambda Expressions",
        "questions": [
            q("stream-api-fundamentals",
              "Java Stream API",
              "How does the Java Stream API work, and what are its key operations?",
              "medium", "high",
              """- Streams are a pipeline of operations on a data source (collections, arrays, I/O)
- Lazy evaluation: intermediate operations (map, filter) don't execute until a terminal operation runs
- Two operation types: intermediate (return Stream, lazy) and terminal (trigger execution)
- Common intermediate ops: filter, map, flatMap, distinct, sorted, peek, limit, skip
- Common terminal ops: collect, forEach, reduce, count, findFirst, anyMatch, min, max
- Parallel streams: use ForkJoinPool, beneficial only for CPU-bound operations on large datasets
- Not reusable: once a terminal operation runs, the stream is consumed""",
              """The Stream API, introduced in Java 8, provides a declarative way to process sequences of data. Instead of writing loops and accumulating results manually, you describe what you want: filter these elements, transform each one, collect the results. The code reads like the intent rather than the implementation.

The key characteristic is lazy evaluation. When you call filter() and map() on a stream, nothing actually runs — they just describe transformations to apply. Only when you call a terminal operation like collect() or forEach() does the pipeline execute. This laziness enables optimizations: if you have filter().map().findFirst(), the stream stops as soon as one element passes the filter and gets mapped, rather than processing the entire collection.

The mental model to understand is a conveyor belt. Each intermediate operation puts a processing step on the belt. The terminal operation starts the belt moving. Elements flow through each step one at a time (for sequential streams), and the pipeline short-circuits where possible.""",
              """## Stream Pipeline Structure

```java
List<String> result = employees.stream()           // 1. Create stream from source
    .filter(e -> e.getDepartment().equals("Eng"))  // 2. Intermediate: filter
    .map(Employee::getName)                         // 3. Intermediate: transform
    .sorted()                                       // 4. Intermediate: sort
    .collect(Collectors.toList());                  // 5. Terminal: trigger execution
```

## Key Operations with Examples

```java
List<Order> orders = orderRepository.findAll();

// Grouping — most useful Collector
Map<String, List<Order>> byStatus = orders.stream()
    .collect(Collectors.groupingBy(Order::getStatus));

// Counting per group
Map<String, Long> countByStatus = orders.stream()
    .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

// Sum total revenue per customer
Map<Long, BigDecimal> revenueByCustomer = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getCustomerId,
        Collectors.reducing(BigDecimal.ZERO, Order::getAmount, BigDecimal::add)
    ));

// flatMap: flatten nested lists
List<String> allTags = articles.stream()
    .flatMap(a -> a.getTags().stream())   // List<List<String>> → Stream<String>
    .distinct()
    .collect(Collectors.toList());

// Reduce: fold into single value
Optional<BigDecimal> total = orders.stream()
    .map(Order::getAmount)
    .reduce(BigDecimal::add);
```

## Parallel Streams — When to Use

```java
// Good: CPU-bound work on large datasets
long count = largeList.parallelStream()
    .filter(this::expensiveComputation)
    .count();

// Bad: I/O-bound work, shared mutable state, small datasets
// parallelStream() uses ForkJoinPool.commonPool() — can starve other tasks
```

**Rule:** Default to sequential streams. Use parallel only when profiling shows a bottleneck and the operation is truly CPU-bound with no shared state."""),

            q("completablefuture-async",
              "CompletableFuture and Async Programming",
              "How does CompletableFuture work in Java and when should you use it in a Spring Boot application?",
              "hard", "high",
              """- CompletableFuture represents a future computation — can be completed manually or chained
- `thenApply` transforms result synchronously on completion thread
- `thenApplyAsync` runs transformation on a different thread (ForkJoinPool or custom executor)
- `thenCombine` / `allOf` / `anyOf` for combining multiple futures
- `exceptionally` / `handle` for error handling in the chain
- In Spring: use `@Async` on methods for automatic CompletableFuture wrapping
- Never use in Spring MVC for I/O parallelism — use WebFlux or virtual threads for that""",
              """CompletableFuture is Java's way to write asynchronous code that can be composed and chained. Unlike Future, which required blocking with get() to retrieve a result, CompletableFuture lets you say "when this completes, do this next, and if it fails, do that instead" — all without blocking any thread.

The typical use case in backend code is parallelizing independent I/O operations. If your endpoint needs to fetch user data, fetch order history, and fetch recommendation scores — all from different services — you can fire all three concurrently and wait for all to complete, instead of running them sequentially. This turns three 200ms requests into one ~200ms total wait.

The important caveat is thread pool management. By default, thenApplyAsync uses ForkJoinPool.commonPool(), which is shared across the JVM. For I/O-heavy tasks (HTTP calls, DB queries), you should supply a dedicated thread pool to avoid saturating the common pool and starving other tasks.""",
              """## Parallel Service Calls

```java
@Service
public class DashboardService {

    private final UserService userService;
    private final OrderService orderService;
    private final RecommendationService recService;

    // Sequential: 3 × 200ms = ~600ms total
    public Dashboard buildDashboardSlow(Long userId) {
        User user = userService.getUser(userId);            // 200ms
        List<Order> orders = orderService.getOrders(userId); // 200ms
        List<Item> recs = recService.getRecommendations(userId); // 200ms
        return new Dashboard(user, orders, recs);
    }

    // Parallel: all run concurrently ~200ms total
    public Dashboard buildDashboardFast(Long userId) throws Exception {
        CompletableFuture<User> userFuture =
            CompletableFuture.supplyAsync(() -> userService.getUser(userId), ioExecutor);

        CompletableFuture<List<Order>> ordersFuture =
            CompletableFuture.supplyAsync(() -> orderService.getOrders(userId), ioExecutor);

        CompletableFuture<List<Item>> recsFuture =
            CompletableFuture.supplyAsync(() -> recService.getRecommendations(userId), ioExecutor);

        // Wait for all three
        CompletableFuture.allOf(userFuture, ordersFuture, recsFuture).join();

        return new Dashboard(userFuture.get(), ordersFuture.get(), recsFuture.get());
    }
}
```

## Error Handling

```java
CompletableFuture<String> result = CompletableFuture
    .supplyAsync(() -> callExternalService())
    .thenApply(response -> processResponse(response))
    .exceptionally(ex -> {
        log.error("Failed: {}", ex.getMessage());
        return "default-value";  // fallback
    });

// handle(): runs whether success or failure
.handle((result, ex) -> {
    if (ex != null) return handleError(ex);
    return result;
});
```

## Spring @Async

```java
@Async("ioTaskExecutor")
public CompletableFuture<List<Order>> getOrdersAsync(Long userId) {
    return CompletableFuture.completedFuture(orderService.getOrders(userId));
}
```"""),

            q("optional-java",
              "Java Optional",
              "What is Java Optional and how should it be used correctly in a Spring Boot application?",
              "easy", "high",
              """- Optional wraps a value that may or may not be present — explicit null representation
- Encourages callers to handle absence explicitly rather than risk NullPointerException
- Correct use: return value from methods where absence is expected (repository.findById)
- Incorrect use: method parameters, fields, collections — these should use regular null checks or be non-null
- `orElse` always evaluates the default; `orElseGet` lazily evaluates — prefer orElseGet for expensive defaults
- `map`, `filter`, `flatMap` for transforming without null checks
- `ifPresent`, `ifPresentOrElse` for side effects""",
              """Optional is a container object that may or may not hold a value. The point is to make the possibility of absence explicit in the type signature. When a method returns `Optional<User>` instead of `User`, callers know they must handle the "not found" case rather than assuming the value is always present.

The most common correct use is in repository methods: `findById()` returns `Optional<T>` in Spring Data JPA, and that's exactly right — a record with that ID might not exist. The worst things you can do are call `.get()` without checking first (defeats the entire purpose, throws NoSuchElementException), use Optional as a method parameter (just use null checks or `@Nullable`), or put Optional in a collection or as a field.

The `orElse` vs `orElseGet` distinction matters when the fallback is expensive. `orElse(expensiveOperation())` always calls `expensiveOperation()` even if the Optional has a value. `orElseGet(() -> expensiveOperation())` only calls it when the Optional is empty. Always use `orElseGet` with method calls.""",
              """## Correct Optional Usage

```java
// ✓ Good: returning Optional where absence is meaningful
public Optional<User> findUserByEmail(String email) {
    return userRepository.findByEmail(email);
}

// ✓ Good: chaining operations without null checks
public String getUserDisplayName(Long userId) {
    return userRepository.findById(userId)
        .map(User::getFullName)
        .filter(name -> !name.isBlank())
        .orElse("Anonymous");
}

// ✓ Good: orElseGet for lazy evaluation of expensive default
public UserProfile getOrCreateProfile(Long userId) {
    return profileRepository.findByUserId(userId)
        .orElseGet(() -> createDefaultProfile(userId));  // only called if empty
}

// ✓ Good: orElseThrow for mandatory resources
public Order getOrderById(Long id) {
    return orderRepository.findById(id)
        .orElseThrow(() -> new OrderNotFoundException("Order not found: " + id));
}
```

## Common Mistakes

```java
// ✗ Bad: defeats the purpose — throws NoSuchElementException if empty
User user = userRepository.findById(id).get();

// ✗ Bad: Optional as parameter (just use @Nullable or overload)
void sendEmail(String to, Optional<String> subject) { ... }

// ✗ Bad: Optional in collection (just use empty list or filter nulls)
List<Optional<User>> users = ...;

// ✗ Bad: isPresent() + get() — use map/orElse instead
if (optional.isPresent()) {
    process(optional.get());
}
// ✓ Good: use ifPresent
optional.ifPresent(this::process);
```"""),

            q("modern-java-records",
              "Modern Java Features: Records, Sealed Classes, Pattern Matching",
              "What are Java Records, Sealed Classes, and Pattern Matching, and when do you use them?",
              "medium", "high",
              """- **Records** (Java 16): immutable data carriers — auto-generates constructor, getters, equals, hashCode, toString
- **Sealed classes** (Java 17): restricts which classes can extend/implement — enables exhaustive pattern matching
- **Pattern matching for instanceof** (Java 16): eliminates manual cast after instanceof check
- **Text blocks** (Java 15): multi-line strings without escape sequences
- **Switch expressions** (Java 14): switch as an expression returning a value, with arrow syntax
- Records ideal for DTOs, value objects, response objects — not for entities""",
              """Records are the answer to "I need a class that just holds data without all the boilerplate." Before records, a simple data carrier required you to write private final fields, a constructor, getters, equals, hashCode, and toString. Records generate all of that from a one-line declaration. They're immutable by design, which makes them safe to share across threads and use as map keys.

Sealed classes are a way to define a closed set of subtypes that the compiler knows about. This enables exhaustive pattern matching — when you switch on a sealed type, the compiler can verify you've handled every case, like an enum but with full class capabilities. This is especially useful for modeling domain states that have different data: a Payment can be a CreditCardPayment, BankTransfer, or Refund, each with different fields.

Pattern matching for instanceof eliminates the tedious cast after a type check. Instead of `if (obj instanceof String) { String s = (String) obj; }` you write `if (obj instanceof String s)` and use s directly. Small but eliminates a whole class of bugs where the variable name changes between the check and the cast.""",
              """## Records as DTOs

```java
// Record: replaces 50+ lines of boilerplate
public record UserResponse(
    Long id,
    String name,
    String email,
    Instant createdAt
) {}

// Compact constructor for validation
public record CreateUserRequest(String name, String email) {
    public CreateUserRequest {  // compact constructor
        Objects.requireNonNull(name, "name is required");
        if (!email.contains("@")) throw new IllegalArgumentException("Invalid email");
        name = name.trim();    // normalize
    }
}

// Records as map keys (immutable, correct equals/hashCode)
Map<UserResponse, List<Order>> ordersByUser = ...;
```

## Sealed Classes for Domain Modeling

```java
public sealed interface PaymentResult
    permits PaymentSuccess, PaymentFailure, PaymentPending {}

public record PaymentSuccess(String transactionId, BigDecimal amount) implements PaymentResult {}
public record PaymentFailure(String errorCode, String message) implements PaymentResult {}
public record PaymentPending(String referenceId, Duration expectedDelay) implements PaymentResult {}

// Exhaustive switch — compiler error if you miss a case
public String handlePayment(PaymentResult result) {
    return switch (result) {
        case PaymentSuccess s -> "Paid: " + s.transactionId();
        case PaymentFailure f -> "Failed: " + f.message();
        case PaymentPending p -> "Pending: " + p.referenceId();
        // No default needed — compiler verified all cases are covered
    };
}
```

## Pattern Matching

```java
// Old: verbose double-mention of the type
if (shape instanceof Circle) {
    Circle c = (Circle) shape;  // redundant cast
    return Math.PI * c.radius() * c.radius();
}

// New: pattern variable in one step
if (shape instanceof Circle c) {
    return Math.PI * c.radius() * c.radius();
}

// Switch pattern matching (Java 21)
double area = switch (shape) {
    case Circle c    -> Math.PI * c.radius() * c.radius();
    case Rectangle r -> r.width() * r.height();
    case Triangle t  -> 0.5 * t.base() * t.height();
};
```"""),
        ]
    },

    "java-concurrency-advanced": {
        "topic": "Advanced Java Concurrency",
        "questions": [
            q("java-memory-model",
              "Java Memory Model and Visibility",
              "What is the Java Memory Model and how do volatile and synchronized ensure visibility?",
              "hard", "high",
              """- JMM defines how threads interact through memory — governs visibility and ordering
- Without synchronization, threads may see stale values from CPU caches
- `volatile`: guarantees visibility (writes immediately visible to all threads), but not atomicity
- `synchronized`: guarantees both visibility AND atomicity for compound actions
- Happens-before relationship: any action before unlock is visible to any action after lock
- `AtomicInteger`, `AtomicReference`: lock-free atomic operations using CAS (Compare-And-Swap)
- Double-checked locking: requires volatile for correct lazy initialization""",
              """The Java Memory Model defines the rules for how threads share data through memory. The problem it addresses is that modern CPUs and JVMs don't always read from and write to main memory directly — they use caches, registers, and compiler reorderings for performance. Without explicit synchronization, thread A's update to a variable might sit in A's CPU cache and never be seen by thread B.

The volatile keyword tells the JVM: every write to this variable must be immediately flushed to main memory, and every read must fetch the latest value from main memory. This solves visibility. But volatile doesn't solve atomicity — a volatile long++ is still three operations (read, increment, write) that can interleave with another thread's operations. For compound operations, you need synchronized or the Atomic classes.

The happens-before relationship is the formal foundation. Any action that "happens before" another is guaranteed to be visible. A write before a synchronized block's unlock happens-before the next thread that acquires the same lock. This is why releasing a lock flushes all writes to memory and acquiring a lock refreshes the cache.""",
              """## Visibility Problem

```java
// Without volatile: flag update may NEVER be seen by the worker thread
// (compiler/CPU may cache 'running' in a register)
class Worker implements Runnable {
    private boolean running = true;  // ← not volatile

    public void stop() { running = false; }

    @Override
    public void run() {
        while (running) {  // may loop forever despite stop() being called
            doWork();
        }
    }
}

// With volatile: stop() write is immediately visible to the worker thread
private volatile boolean running = true;
```

## volatile vs synchronized vs Atomic

```java
// volatile: visibility only — fine for flags and single-write patterns
private volatile boolean initialized = false;

// AtomicInteger: thread-safe counter without locking (CAS-based)
private final AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();       // atomic: read + increment + write
counter.compareAndSet(5, 6);    // CAS: set to 6 only if current value is 5

// synchronized: for compound actions that must be atomic
private final Map<String, Integer> counts = new HashMap<>();

public synchronized void increment(String key) {
    counts.merge(key, 1, Integer::sum);  // read-modify-write is safe
}
```

## Double-Checked Locking (Singleton) — Requires volatile

```java
public class ConnectionPool {
    // volatile required: without it, partially constructed object can be seen
    private static volatile ConnectionPool instance;

    public static ConnectionPool getInstance() {
        if (instance == null) {                    // first check (no lock)
            synchronized (ConnectionPool.class) {
                if (instance == null) {            // second check (with lock)
                    instance = new ConnectionPool();
                }
            }
        }
        return instance;
    }
}
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 5: REDIS
# ═══════════════════════════════════════════════════════════════════════════════

REDIS = {
    "redis-fundamentals": {
        "topic": "Redis Fundamentals",
        "questions": [
            q("redis-data-structures",
              "Redis Data Structures",
              "What are the core Redis data structures and when do you use each?",
              "medium", "high",
              """- **String**: the foundation — text, numbers, binary data. GET/SET/INCR/EXPIRE
- **Hash**: map of field-value pairs. Perfect for objects (user profiles, sessions)
- **List**: ordered sequence with head/tail access. Use for queues and recent items
- **Set**: unordered collection of unique strings. Union/intersection/difference operations
- **Sorted Set (ZSet)**: set with a score per member. Rankings, leaderboards, time-based queries
- **Stream**: append-only log with consumer groups. Better than List for event streaming
- Each data structure has O(1) or O(log n) operations — understanding complexity matters in interviews""",
              """Redis is often called a data structures server rather than just a cache. This distinction matters because each data structure unlocks different use cases that you can't do efficiently with a simple key-value store.

Strings are the simplest — any value up to 512MB per key, with atomic operations like INCR for counters. Hashes are like objects: instead of serializing your entire user object to a JSON string, you can store each field separately and update individual fields without reading the whole thing. Lists with LPUSH/RPOP give you a queue — you push to one end, pop from the other. Sets are perfect for things like "which users have seen this notification" — fast SADD and SISMEMBER with automatic deduplication.

Sorted Sets are the most powerful. Each member has a score, and members are always kept sorted by score. This makes leaderboards trivial: ZADD scores userId points, ZRANGEBYSCORE to fetch top players. But you can also use it for rate limiting (score = timestamp), delayed queues, or expiring items in order.""",
              """## Data Structure Cheat Sheet

| Structure | Use Case | Key Commands |
|-----------|----------|-------------|
| String | Counters, flags, cached values | GET, SET, INCR, EXPIRE |
| Hash | Objects, sessions, user profiles | HGET, HSET, HMGET, HDEL |
| List | Queues, recent items, chat history | LPUSH, RPOP, LRANGE |
| Set | Unique items, tags, online users | SADD, SISMEMBER, SUNION |
| Sorted Set | Leaderboards, rate limiting, rankings | ZADD, ZRANGEBYSCORE, ZRANK |
| Stream | Event log, message queue | XADD, XREAD, XGROUP |

## Practical Examples

```
# String: page view counter
INCR page:views:article:123   → returns new count (atomic)
EXPIRE page:views:article:123 86400  → reset daily

# Hash: user session
HSET session:abc123 userId 42 email user@ex.com lastSeen 1700000000
HGET session:abc123 email   → "user@ex.com"
HGETALL session:abc123      → all fields

# Sorted Set: leaderboard
ZADD leaderboard 2500 "player:alice"
ZADD leaderboard 1800 "player:bob"
ZRANGEBYSCORE leaderboard +inf -inf WITHSCORES LIMIT 0 10  → top 10

# Set: who's online
SADD online:users 42 88 99
SISMEMBER online:users 42  → 1 (online)
SMEMBERS online:users      → {42, 88, 99}
```"""),

            q("spring-data-redis-setup",
              "Spring Data Redis Setup and Usage",
              "How do you configure and use Redis in a Spring Boot application?",
              "medium", "high",
              """- Spring Boot auto-configures Redis via `spring.data.redis.*` properties
- `RedisTemplate<K, V>` is the main client — operations by data type via `.opsForValue()`, `.opsForHash()`, etc.
- `StringRedisTemplate` is a pre-configured RedisTemplate<String, String>
- Spring Cache integration: `@EnableCaching` + `@Cacheable`, `@CachePut`, `@CacheEvict`
- RedisSerializer: by default uses JDK serialization — should configure Jackson/JSON serializer
- Connection pool: Lettuce (default, non-blocking) or Jedis (thread-per-connection)""",
              """Spring Boot's Redis integration has two levels. The low level is RedisTemplate, which gives you direct access to all Redis data structures. You call template.opsForValue() for string operations, template.opsForHash() for hash maps, template.opsForZSet() for sorted sets — each method returns an operations object that mirrors the Redis command set.

The higher level is Spring Cache, which is a caching abstraction that can use Redis (or other backends) transparently. You annotate a method with @Cacheable, and Spring automatically caches its return value. The next call with the same arguments returns the cached value without executing the method body. This is perfect for expensive database queries or external service calls that return stable data.

The most important configuration detail is the serializer. By default, RedisTemplate uses Java serialization, which is opaque binary data that can't be read in Redis CLI and breaks if your class changes. You should configure a Jackson-based JSON serializer so keys and values are readable strings, making debugging much easier.""",
              """## Spring Boot Configuration

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: 6379
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 16
          max-idle: 8
          min-idle: 2
```

## RedisTemplate with JSON Serialization

```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Use String for keys
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Use JSON for values — human-readable and schema-flexible
        Jackson2JsonRedisSerializer<Object> jsonSerializer =
            new Jackson2JsonRedisSerializer<>(Object.class);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new Jackson2JsonRedisSerializer<>(Object.class)));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

## @Cacheable Usage

```java
@Service
public class ProductService {

    // Cache result for 30 min; cache key = "products::" + id
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElseThrow();  // only called on cache miss
    }

    // Update cache when product changes
    @CachePut(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    // Evict when deleted
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```"""),

            q("redis-distributed-lock",
              "Distributed Locking with Redis",
              "How do you implement distributed locking with Redis in a Spring Boot application?",
              "hard", "high",
              """- Distributed lock coordinates access across multiple application instances (can't use JVM synchronized)
- Redis SET NX EX: atomically set key only if not exists, with expiry (prevents deadlock)
- Release lock: check that the lock belongs to you before deleting (use Lua script for atomicity)
- Redisson: Java client that implements distributed locks correctly (RedLock algorithm)
- Pitfalls: lock expiry shorter than operation → another process gets lock while operation is running
- Use case: exactly-once scheduled jobs, inventory reservations, API rate limiting""",
              """A distributed lock solves the problem of coordinating across multiple instances of your application. Java's synchronized keyword or ReentrantLock only works within one JVM — if you have 5 pods running the same Spring Boot app and all might try to process the same order simultaneously, you need a lock that all 5 instances respect. Redis, being a shared external system, is the natural choice.

The implementation uses Redis's `SET key value NX EX seconds` command. NX means "only set if Not eXists" — this is the lock acquisition. EX is the expiry — this prevents deadlocks if your process crashes while holding the lock. The value should be a unique identifier (like a UUID) for your process, so you only release locks you acquired.

The danger zone is operation duration vs lock TTL. If your lock expires in 10 seconds but the operation takes 15, another process acquires the lock while you're still running — now you have two processes in the critical section. Solutions include: extending the lock TTL before it expires (Redisson's watchdog does this automatically), or designing your operations to be idempotent so concurrent execution doesn't cause data corruption.""",
              """## Basic Distributed Lock

```java
@Service
public class DistributedLockService {

    private final StringRedisTemplate redisTemplate;

    public boolean acquireLock(String lockKey, String lockValue, Duration ttl) {
        Boolean acquired = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, ttl);  // SET key value NX EX
        return Boolean.TRUE.equals(acquired);
    }

    // IMPORTANT: verify we own the lock before releasing (prevents releasing another's lock)
    public void releaseLock(String lockKey, String lockValue) {
        String script = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
            """;
        redisTemplate.execute(
            new DefaultRedisScript<>(script, Long.class),
            List.of(lockKey),
            lockValue
        );
    }
}
```

## Using Redisson (Recommended for Production)

```java
@Service
public class OrderProcessor {

    private final RedissonClient redisson;

    public void processOrder(Long orderId) {
        RLock lock = redisson.getLock("order:lock:" + orderId);
        try {
            // Acquires lock; watchdog extends TTL automatically if operation takes longer
            lock.lock(30, TimeUnit.SECONDS);
            try {
                // Critical section — only one process executes this at a time
                Order order = orderRepository.findById(orderId).orElseThrow();
                if (order.getStatus() == PENDING) {
                    processPayment(order);
                    order.setStatus(PROCESSING);
                    orderRepository.save(order);
                }
            } finally {
                lock.unlock();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 6: APACHE KAFKA
# ═══════════════════════════════════════════════════════════════════════════════

KAFKA = {
    "kafka-fundamentals": {
        "topic": "Apache Kafka Fundamentals",
        "questions": [
            q("kafka-architecture",
              "Kafka Architecture",
              "How does Apache Kafka work, and what are its core components?",
              "medium", "high",
              """- Kafka is a distributed event streaming platform — persistent, ordered, replicated log
- **Broker**: server that stores and serves messages
- **Topic**: named log — you publish to a topic, subscribe from a topic
- **Partition**: topics split into partitions for parallelism; each partition is an ordered log
- **Offset**: position of a message in a partition — consumers track this to know where they are
- **Producer**: publishes messages; chooses partition by key hash or round-robin
- **Consumer Group**: group of consumers that collectively read a topic — each partition assigned to one consumer
- **Zookeeper/KRaft**: cluster coordination (KRaft replaces Zookeeper in Kafka 3+)""",
              """Kafka is fundamentally a distributed commit log. Producers append messages to the end of a topic, and consumers read from wherever they left off — tracked by an offset. Unlike a traditional message queue where messages are deleted after consumption, Kafka keeps messages for a configurable retention period (default 7 days), meaning you can replay events, add new consumers that start from the beginning, and maintain an audit trail.

Partitions are the key to Kafka's scalability. A topic with 12 partitions can be consumed by up to 12 consumers in a group simultaneously — each consumer gets some partitions exclusively. If you have more consumers than partitions, the extras sit idle. Partitions also determine ordering: Kafka guarantees order within a partition, not across partitions. This is why message keys matter — if you want all events for a given user in order, you hash the user ID to always route to the same partition.

Replication makes Kafka fault-tolerant. Each partition has a leader broker and N-1 replicas. Producers and consumers always talk to the leader. If the leader fails, one of the replicas automatically becomes the new leader.""",
              """## Core Architecture

```
Producers → Topic (3 partitions, replication factor 3) → Consumers

Topic: "order-events" (3 partitions)
│
├── Partition 0: [offset 0: order-1] [offset 1: order-4] [offset 2: order-7] ...
│     Leader: Broker 1, Replicas: [Broker 2, Broker 3]
├── Partition 1: [offset 0: order-2] [offset 1: order-5] [offset 3: order-8] ...
│     Leader: Broker 2, Replicas: [Broker 1, Broker 3]
└── Partition 2: [offset 0: order-3] [offset 1: order-6] [offset 2: order-9] ...
      Leader: Broker 3, Replicas: [Broker 1, Broker 2]

Consumer Group "order-service" (3 consumers):
  Consumer A → Partition 0
  Consumer B → Partition 1
  Consumer C → Partition 2
```

## Key Kafka Properties

| Property | Default | Meaning |
|----------|---------|---------|
| `retention.ms` | 7 days | How long to keep messages |
| `replication.factor` | 1 | Number of copies |
| `min.insync.replicas` | 1 | Min replicas that must ack write |
| `acks` | 1 | Producer durability (0=fire&forget, 1=leader only, all=full durability) |

## Ordering Guarantee

```java
// Same key → same partition → ordered delivery
producer.send(new ProducerRecord<>("orders", userId.toString(), orderEvent));
// All events for userId=42 always go to the same partition (by key hash)
// → guaranteed ordering for that user's events
```"""),

            q("spring-kafka-producer-consumer",
              "Spring Kafka Producer and Consumer",
              "How do you implement a Kafka producer and consumer in Spring Boot?",
              "medium", "high",
              """- Spring Kafka: `KafkaTemplate` for producing, `@KafkaListener` for consuming
- `@KafkaListener` annotates a method to consume from a topic — Spring manages the consumer lifecycle
- Manual offset commit: `AckMode.MANUAL` gives you control over when to commit
- Error handling: `DefaultErrorHandler` with `DeadLetterPublishingRecoverer` for failed messages
- Deserialization: configure key/value deserializers in `ConsumerConfig`
- `@EnableKafka` on a `@Configuration` class enables Kafka listener support""",
              """Spring Kafka's programming model is straightforward. On the producer side, you inject KafkaTemplate and call send() with a topic name, optional key, and the message. Spring handles serialization, batching, and retries. On the consumer side, you annotate a method with @KafkaListener and Spring creates the consumer, subscribes to the topic, calls your method for each message, and commits the offset.

The key configuration decisions are around error handling and offset management. By default, Spring Kafka uses auto-commit — offsets are committed periodically regardless of whether your processing succeeded. For transactional systems, you want manual acknowledgment: only commit the offset after your business logic succeeds. This prevents message loss at the cost of possible duplicate processing on failure (at-least-once semantics).

For failed messages, the standard pattern is a Dead Letter Topic. Spring Kafka's DefaultErrorHandler can be configured to send messages that fail N times to a separate DLT topic, where you can inspect, alert on, or replay them later.""",
              """## Producer Configuration

```java
@Configuration
public class KafkaProducerConfig {
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(ProducerFactory<String, Object> factory) {
        return new KafkaTemplate<>(factory);
    }
}

// application.yaml
spring.kafka:
  bootstrap-servers: ${KAFKA_BROKERS:localhost:9092}
  producer:
    key-serializer: org.apache.kafka.common.serialization.StringSerializer
    value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    acks: all          # wait for all in-sync replicas
    retries: 3
```

## Producing Messages

```java
@Service
public class OrderEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order.getId(), order.getStatus(), Instant.now());
        kafkaTemplate.send("order-events", order.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) log.error("Failed to publish order event", ex);
                else log.debug("Published to partition {} offset {}",
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
            });
    }
}
```

## Consumer with Error Handling

```java
@Component
@Slf4j
public class OrderEventConsumer {

    @KafkaListener(
        topics = "order-events",
        groupId = "inventory-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderCreated(OrderCreatedEvent event, Acknowledgment ack) {
        try {
            inventoryService.reserveStock(event.orderId());
            ack.acknowledge();  // only commit offset after successful processing
        } catch (Exception e) {
            log.error("Failed to process order {}: {}", event.orderId(), e.getMessage());
            throw e;  // re-throw → DefaultErrorHandler retries, then sends to DLT
        }
    }
}

@Bean
public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
    var recoverer = new DeadLetterPublishingRecoverer(template,
        (record, ex) -> new TopicPartition(record.topic() + ".DLT", record.partition()));
    return new DefaultErrorHandler(recoverer, new FixedBackOff(1000L, 3));  // 3 retries, 1s apart
}
```"""),

            q("kafka-consumer-groups",
              "Kafka Consumer Groups and Partition Assignment",
              "How do consumer groups work in Kafka, and what happens during a rebalance?",
              "medium", "high",
              """- Consumer group: a named group of consumers that collectively read a topic
- Each partition is assigned to exactly one consumer in a group at a time
- Horizontal scaling: add more consumers (up to partition count) to increase throughput
- Rebalance: triggered when consumers join/leave the group — partitions reassigned
- Rebalance causes brief pause in consumption (stop-the-world)
- Cooperative rebalancing (Kafka 2.4+): reduces pause — only reassigned partitions stop
- Offset commit lag: gap between latest offset and consumer's committed offset — key monitoring metric""",
              """Consumer groups are Kafka's built-in way to scale message processing. You have one topic, 12 partitions, and a consumer group named "order-processor" with 3 instances of your Spring Boot service. Kafka assigns 4 partitions to each instance — each partition exclusively owned by one consumer within the group. Messages flow in parallel across all 3 instances, tripling your throughput.

When consumers join or leave, Kafka triggers a rebalance to redistribute partitions fairly. During a rebalance, all consumers in the group briefly stop processing — the "stop the world" period. Cooperative incremental rebalancing (available in newer Kafka versions) reduces this by only pausing the consumers that are giving up or gaining partitions, not all of them.

The separate consumer group concept is powerful for multiple subscribers. If you have both "email-service" and "analytics-service" as separate consumer groups, both receive every message independently. This is fundamentally different from competing consumers — separate groups are separate subscribers, same group members share the work.""",
              """## Consumer Group Partition Assignment

```
Topic "orders" (6 partitions)

Consumer Group "fulfillment-service" (2 consumers):
  Consumer 1 → P0, P1, P2 (gets 3 partitions)
  Consumer 2 → P3, P4, P5 (gets 3 partitions)

Scale up to 3 consumers (rebalance triggered):
  Consumer 1 → P0, P1
  Consumer 2 → P2, P3
  Consumer 3 → P4, P5

Consumer Group "analytics-service" (1 consumer):
  Consumer A → P0, P1, P2, P3, P4, P5 (all 6 — different group, gets all)
```

## Monitoring Consumer Lag

```bash
# Check how far behind consumers are
kafka-consumer-groups.sh --bootstrap-server kafka:9092 \
  --describe --group fulfillment-service

# Output:
GROUP                TOPIC    PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
fulfillment-service  orders   0          12500           12503           3
fulfillment-service  orders   1          11200           11215           15  ← lagging!
```

## Spring Kafka Manual Partition Assignment

```java
// When you need more control over partition assignment
@KafkaListener(
    topicPartitions = @TopicPartition(
        topic = "orders",
        partitionOffsets = {
            @PartitionOffset(partition = "0", initialOffset = "0"),
            @PartitionOffset(partition = "1", initialOffset = "0")
        }
    ),
    groupId = "special-consumer"
)
public void consumeSpecificPartitions(OrderEvent event) { ... }
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 7: DOCKER FOR JAVA DEVELOPERS
# ═══════════════════════════════════════════════════════════════════════════════

DOCKER = {
    "docker-fundamentals": {
        "topic": "Docker Fundamentals for Java Developers",
        "questions": [
            q("docker-core-concepts",
              "Docker Core Concepts",
              "What is Docker and what are the key concepts every Java developer should know?",
              "easy", "high",
              """- **Image**: read-only template — layers of filesystem changes
- **Container**: running instance of an image — isolated process
- **Dockerfile**: script to build an image — FROM, RUN, COPY, EXPOSE, CMD
- **Docker Hub / ECR**: registries to store and pull images
- **Docker Compose**: define multi-container applications in YAML
- **Volumes**: persist data outside containers — survives container restart/removal
- **Networks**: containers communicate on same Docker network by service name""",
              """Docker solves the "it works on my machine" problem by packaging your application and all its dependencies — JDK version, system libraries, configuration files — into a single portable unit called an image. Wherever you run that image (your laptop, a CI server, AWS), it behaves identically because it carries its environment with it.

An image is immutable and layered. Each instruction in your Dockerfile adds a layer. Layers are cached — if you haven't changed your pom.xml, Docker reuses the Maven download layer. This is why you should COPY your dependency file and run your build before copying your source code — source changes don't invalidate the dependency cache. A container is simply a running image — it's the live process with its own isolated filesystem, network, and process space.

For Java developers, Docker primarily addresses deployment consistency and local development. Instead of telling your team to install Java 17, PostgreSQL 15, and Redis 7.2, you write a docker-compose.yml and they run `docker compose up`. Everything they need starts instantly, identically to production.""",
              """## Dockerfile for Spring Boot

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -q    # Download deps (cached layer)
COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2: Runtime (smaller image — no JDK, just JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /build/target/myapp.jar app.jar
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -q -O- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "app.jar"]
```

## Common Docker Commands

```bash
docker build -t myapp:1.0 .          # Build image
docker run -p 8080:8080 myapp:1.0    # Run container
docker ps                             # List running containers
docker logs -f container_name         # Follow logs
docker exec -it container_name bash  # Shell into container
docker stop container_name            # Stop gracefully
docker rmi myapp:1.0                  # Remove image
```

## docker-compose.yml for Local Development

```yaml
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/mydb
      - SPRING_DATA_REDIS_HOST=redis
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```"""),

            q("java-docker-optimization",
              "Docker Optimization for Java",
              "How do you optimize a Docker image for a Spring Boot application?",
              "medium", "high",
              """- Multi-stage builds: separate build stage (Maven + JDK) from runtime (JRE only)
- Alpine-based images: 5-10x smaller than full images (eclipse-temurin:17-jre-alpine)
- JVM container awareness: `-XX:+UseContainerSupport` (default JDK 11+) reads cgroup limits
- Layer caching: copy pom.xml and download dependencies before copying source code
- Spring Boot Layered JARs: split JAR into layers for better Docker layer caching
- JVM memory flags: set MaxRAMPercentage instead of -Xmx for container-aware sizing""",
              """Docker image optimization for Java has two dimensions: image size and build speed. A full JDK + Maven image can be 600MB+. By using multi-stage builds — one stage for compiling with Maven and JDK, a second stage with only the JRE to run the app — you can get down to 100-150MB. That's 6x smaller, which means faster pulls from your container registry and less attack surface.

Build speed matters for CI/CD. Docker layer caching is your friend here. If you copy your pom.xml first, run `mvn dependency:go-offline`, and THEN copy your source code, your dependency download step only reruns when pom.xml changes. Most builds only change source code, so the dependency layer stays cached and your build goes from 5 minutes to 30 seconds.

JVM memory configuration in containers has a history of problems. Older JVMs didn't understand cgroup limits and would see the host machine's full RAM. If the host has 32GB but your container limit is 512MB, the JVM would size its heap based on 32GB and immediately OOM. UseContainerSupport (on by default in JDK 11+) reads the container's memory limit. Use `-XX:MaxRAMPercentage=75` rather than a hardcoded `-Xmx` so the heap scales correctly across different container sizes.""",
              """## Spring Boot Layered JAR

```properties
# application.properties — enable layered jar
spring.layers.enabled=true
```

```dockerfile
FROM eclipse-temurin:17-jre-alpine AS layers
WORKDIR /app
COPY target/myapp.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN adduser -S -u 1001 spring
USER spring

# Copy layers in order — most stable layers first
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./

# Only the 'application' layer changes between builds
# All dependency layers are cached!

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

## JVM Memory Settings for Containers

```dockerfile
# Option 1: percentage-based (adapts to any container size)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Option 2: G1GC tuning for microservices
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75 -XX:+HeapDumpOnOutOfMemoryError"
```

## Image Size Comparison

| Approach | Size |
|----------|------|
| maven:3.9 (build + runtime) | ~650 MB |
| eclipse-temurin:17-jdk | ~400 MB |
| eclipse-temurin:17-jre-alpine | ~185 MB |
| eclipse-temurin:17-jre-alpine + multi-stage | ~185 MB (only runtime) |"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 8: GIT
# ═══════════════════════════════════════════════════════════════════════════════

GIT = {
    "git-workflows": {
        "topic": "Git Workflows and Branching Strategies",
        "questions": [
            q("git-branching-strategies",
              "Git Branching Strategies",
              "What are the main Git branching strategies and which is best for a Java microservices team?",
              "medium", "high",
              """- **GitFlow**: main + develop + feature/release/hotfix branches — good for versioned releases
- **GitHub Flow**: main + short-lived feature branches, deploy from main — simple, good for continuous deployment
- **Trunk-Based Development**: all developers commit to main daily, feature flags for incomplete features
- **GitFlow drawbacks**: complex, long-lived branches → merge conflicts, delayed integration
- **Trunk-Based**: preferred for CI/CD, microservices, teams with good test coverage
- Key principle: small, frequent merges to main trunk reduces integration pain""",
              """GitFlow was designed for software with explicit versioning and scheduled releases — like a library or desktop app with v1.2 and v1.3 release cycles. It gives you dedicated branches for features, releases, and hotfixes, with a develop branch as integration ground before things reach main. The cost is complexity: developers manage multiple long-lived branches, merge conflicts accumulate, and the gap between development and production can grow for weeks.

GitHub Flow simplifies this to just main plus short-lived feature branches. You create a branch, do your work, open a pull request, get it reviewed, and merge. Main is always deployable. This works well for web services with continuous deployment.

Trunk-based development takes simplicity further: everyone commits to main (the trunk) daily. Incomplete features are hidden behind feature flags in code. This sounds risky but is actually what high-performing engineering teams like Google and Netflix use. The key insight is that long-lived branches are the problem — they defer integration pain. The longer a branch lives, the worse the merge gets. Small daily commits to trunk keeps the integration surface tiny.""",
              """## Strategy Comparison

| Strategy | Branch Lifespan | CI/CD Fit | Team Size | When to Use |
|----------|----------------|-----------|-----------|-------------|
| GitFlow | Weeks | Poor | Any | Versioned software, scheduled releases |
| GitHub Flow | Days | Good | Small-Medium | Continuous deployment, web services |
| Trunk-Based | Hours | Excellent | Any | High-frequency deployment, mature testing |

## Trunk-Based with Feature Flags

```java
@Service
public class CheckoutService {

    @Value("${feature.new-payment-flow.enabled:false}")
    private boolean newPaymentFlowEnabled;

    public PaymentResult processPayment(Order order) {
        if (newPaymentFlowEnabled) {
            return newPaymentFlow.process(order);   // new code, deployed but hidden
        }
        return legacyPaymentFlow.process(order);    // old code still runs
    }
}
```

```yaml
# application.yaml — toggle per environment
feature:
  new-payment-flow:
    enabled: ${FEATURE_NEW_PAYMENT:false}  # false in prod, true in staging
```

## Recommended Workflow for Microservices Team

```bash
# Daily workflow in trunk-based development
git checkout main
git pull origin main
git checkout -b fix/order-null-check   # short-lived branch
# ... small change, tested locally
git push origin fix/order-null-check
# Create PR → automated tests run → teammate reviews → merge to main
# CI/CD auto-deploys main to staging, then production

# Hotfix is the same flow — no special branches needed
# Just make the fix, PR to main, deploy
```"""),

            q("git-rebase-vs-merge",
              "Git Rebase vs Merge",
              "What is the difference between git rebase and git merge, and when should you use each?",
              "medium", "high",
              """- **Merge**: creates a merge commit, preserves full history including branch structure
- **Rebase**: replays commits onto a new base, creates linear history, rewrites commit SHAs
- Merge for public branches (main, develop) — never rewrite shared history
- Rebase for local feature branches before merging — clean, linear history
- Squash merge: combines all branch commits into one commit on main — great for messy WIP commits
- Golden rule: never rebase commits that have been pushed and shared with others""",
              """Merge preserves the true story of what happened: when you merged this feature branch into main, you see a merge commit that shows two parent commits — the branch and the previous main. The history is accurate but can look busy with many feature branches all merging in at different times.

Rebase rewrites history to look linear: it takes your feature branch commits and replays them as if they were always built on top of the current main. The resulting history is clean and easy to read with git log — a straight line of commits with no merge commits. The tradeoff is that the commit SHAs change, so anyone who was working from the old branch SHA is now out of sync.

The practical rule: rebase your local feature branch on top of main before you create a pull request, so your changes apply cleanly on the latest code. But once you've pushed a branch and opened a PR, avoid force-pushing rebased commits because it breaks other reviewers' local checkouts. On main and any shared branch, always merge.""",
              """## Visualizing Merge vs Rebase

```
Initial state:
  main:    A → B → C
  feature:         └ → D → E

git merge feature:
  main: A → B → C → M  (M is merge commit with parents C and E)
                ↗
           D → E

git rebase main (on feature branch):
  feature: A → B → C → D' → E'  (D,E replayed on top of C, new SHAs)
  Then fast-forward merge: main: A → B → C → D' → E'  (linear, no merge commit)
```

## Daily Workflow

```bash
# Before opening a PR: rebase onto latest main for clean history
git checkout feature/my-feature
git fetch origin
git rebase origin/main      # replay my commits on top of latest main
git push --force-with-lease  # ok: haven't shared this with others yet

# Squash messy WIP commits before merging
git rebase -i origin/main   # interactive rebase
# In editor: squash all into one meaningful commit

# After PR approved: GitHub usually offers "Squash and Merge" button
# This creates one clean commit on main regardless of how many WIP commits you made
```

## When to Use What

| Scenario | Use |
|----------|-----|
| Updating your local feature branch with latest main | Rebase |
| Cleaning up WIP commits before PR | Interactive rebase / squash |
| Merging a feature PR to main | Squash merge or merge commit |
| Hotfix to production | Cherry-pick or direct branch from main |
| Never | Rebase after sharing/pushing with others |"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# STACK 9: MAVEN AND GRADLE
# ═══════════════════════════════════════════════════════════════════════════════

MAVEN_GRADLE = {
    "maven-fundamentals": {
        "topic": "Maven Build Tool",
        "questions": [
            q("maven-lifecycle",
              "Maven Build Lifecycle",
              "How does Maven's build lifecycle work, and what are the key phases?",
              "easy", "high",
              """- Maven has 3 lifecycles: default (build), clean (delete output), site (docs)
- Default lifecycle phases in order: validate → compile → test → package → verify → install → deploy
- Each phase runs all previous phases first — `mvn package` also runs validate, compile, test
- Plugins bind to lifecycle phases — maven-compiler-plugin binds to compile, surefire to test
- Skip phases selectively: `mvn package -DskipTests` (skip test execution, not compilation)
- `mvn install` puts the JAR in local ~/.m2 repository; `mvn deploy` pushes to remote repository""",
              """Maven's build lifecycle is a series of phases that always run in order. When you run `mvn package`, Maven doesn't just package — it first validates the project, compiles the source code, runs unit tests, and then packages. You can't skip to package without compile running first.

This sequencing is why you'll often see `mvn clean package` in CI scripts. The clean part deletes the target directory (previous build output), then package rebuilds everything fresh. Without clean, you might accidentally ship stale compiled classes if your source files were moved or renamed.

The lifecycle is extensible through plugins. When Maven needs to compile Java, it uses the maven-compiler-plugin bound to the compile phase. When it needs to run tests, it uses maven-surefire-plugin bound to the test phase. You can add your own plugins bound to any lifecycle phase — this is how code coverage tools, static analysis, and Docker image builders integrate with Maven.""",
              """## Default Lifecycle Phases

| Phase | What Happens |
|-------|-------------|
| validate | Verify project is correct |
| compile | Compile source code |
| test | Run unit tests (surefire) |
| package | Create JAR/WAR |
| verify | Run integration tests (failsafe) |
| install | Install to local ~/.m2 |
| deploy | Push to remote repository |

## Common Maven Commands

```bash
mvn clean package              # Clean + build JAR
mvn clean package -DskipTests # Build without running tests
mvn test                       # Run unit tests only
mvn verify                     # Run unit + integration tests
mvn install                    # Build + install to local repo
mvn dependency:tree            # Show dependency tree
mvn dependency:analyze         # Find unused/undeclared deps
mvn versions:display-dependency-updates  # Check for newer dependency versions
```

## pom.xml Key Sections

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>my-service</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Compile scope (default): on classpath at compile and runtime -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Test scope: only in test classpath -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Provided: available at compile time, not packaged (e.g., servlet container) -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```"""),
        ]
    },

    "gradle-fundamentals": {
        "topic": "Gradle Build Tool",
        "questions": [
            q("gradle-vs-maven",
              "Gradle vs Maven",
              "What are the key differences between Gradle and Maven, and when should you choose Gradle?",
              "medium", "medium",
              """- **Maven**: XML-based, convention over configuration, stable and predictable
- **Gradle**: Groovy/Kotlin DSL, programmatic, highly flexible, incremental builds
- **Gradle incremental builds**: only rebuild what changed — significantly faster for large projects
- **Gradle build cache**: cache outputs, share across machines (critical for large CI pipelines)
- **Gradle better for**: Android (required), large multi-module projects, custom build logic
- **Maven better for**: teams that prefer stability, existing Maven infrastructure, Spring Boot tutorials""",
              """Maven and Gradle take opposite design philosophies. Maven is declarative and convention-heavy: you declare what you want (dependencies, plugins) in XML, and Maven follows its lifecycle. This makes Maven predictable and easy to understand for newcomers, but it's inflexible when you need custom build behavior.

Gradle is programmatic: your build file is actual code (Kotlin or Groovy), so you can express any build logic you need. More importantly, Gradle's incremental build system tracks exactly which files changed and only recompiles what's affected. In large projects with hundreds of modules, Gradle builds can be 10-100x faster than Maven because they skip already-up-to-date tasks.

For Spring Boot projects starting today, either works fine. Maven has more tutorials and Spring documentation examples. Gradle is required for Android and preferred by teams that hit Maven's limitations. Kotlin DSL (build.gradle.kts instead of build.gradle) adds type safety and IDE auto-completion, which makes the more complex Gradle syntax much more manageable.""",
              """## Gradle Spring Boot build.gradle.kts

```kotlin
plugins {
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.20"
    kotlin("plugin.spring") version "1.9.20"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}
```

## Gradle Incremental Builds

```bash
# First build: compiles everything
./gradlew build  → 45 seconds

# Change one source file and rebuild
./gradlew build  → 8 seconds (only recompiles changed module + dependents)

# No changes at all
./gradlew build  → 2 seconds (UP-TO-DATE — everything cached)
```

## Gradle vs Maven Summary

| Aspect | Maven | Gradle |
|--------|-------|--------|
| Config format | XML (pom.xml) | Kotlin/Groovy DSL |
| Build speed | OK for small projects | Faster for large (incremental) |
| Learning curve | Gentle | Steeper |
| Flexibility | Limited without plugins | Full programming power |
| Multi-module | Good | Excellent |
| Android | Not supported | Required |"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# ENHANCE EXISTING: CORE JAVA - Add new subcategories
# ═══════════════════════════════════════════════════════════════════════════════

CORE_JAVA_ENHANCEMENTS = {
    "string-handling": {
        "topic": "String Handling in Java",
        "questions": [
            q("string-immutability",
              "String Immutability and String Pool",
              "Why are Java Strings immutable, and how does the String pool work?",
              "easy", "high",
              """- Strings are immutable: once created, the char[] content cannot change
- Immutability enables the String pool (interned strings) — multiple references can point to the same object safely
- String pool: the JVM maintains a pool of string literals; identical literals share one object
- `new String("hello")` bypasses the pool — creates a new object in heap
- `intern()` method explicitly puts a string into the pool
- Thread safety: immutable objects are inherently thread-safe
- Security: immutable strings prevent modification of passwords/class names after validation""",
              """String immutability is a deliberate design choice that enables several important guarantees. Because a String's content can never change after creation, multiple variables can safely reference the same String object. This is the foundation of the String pool — the JVM maintains a cache of string literals, and when you write two string literals with the same content, they reference the same object in memory rather than creating two separate objects.

Immutability also makes Strings inherently thread-safe. In a multithreaded application, you can pass a String to any number of threads with no risk of one thread corrupting the data another thread is reading. This is why Strings are used everywhere as map keys, class names, and security credentials.

The practical implication is performance: if you're building a string by concatenating in a loop, each concatenation creates a new String object. Use StringBuilder inside loops because it modifies an internal char array in place without creating intermediate String objects. String concatenation with + is fine for a small, fixed number of concatenations — the compiler converts it to StringBuilder anyway.""",
              """## String Pool Behavior

```java
String a = "hello";          // from string pool
String b = "hello";          // same object from pool
String c = new String("hello"); // new heap object, not from pool

System.out.println(a == b);  // true  (same pool object)
System.out.println(a == c);  // false (different objects)
System.out.println(a.equals(c)); // true (same content)

// intern(): bring heap string into pool
String d = c.intern();
System.out.println(a == d);  // true (d is now the pool object)
```

## StringBuilder vs String Concatenation

```java
// Bad: O(n²) — creates new String on each iteration
String result = "";
for (String item : list) {
    result += item + ", ";  // creates new String every time
}

// Good: O(n) — modifies internal buffer in place
StringBuilder sb = new StringBuilder();
for (String item : list) {
    sb.append(item).append(", ");
}
String result = sb.toString();

// For simple non-loop concatenation: fine to use +
// Compiler converts to StringBuilder automatically
String message = "Hello, " + name + "! You have " + count + " messages.";
```

## When Immutability Matters

```java
// Safe to share a String as a HashMap key
Map<String, User> userCache = new HashMap<>();
String key = "user:42";
userCache.put(key, user);
key = "something-else";  // reassign variable — doesn't affect the map key
// Map still has "user:42" as the key — the original String object is unchanged
```"""),
        ]
    },

    "design-patterns-java": {
        "topic": "Design Patterns in Java",
        "questions": [
            q("singleton-pattern",
              "Singleton Pattern",
              "How do you implement a thread-safe Singleton in Java, and when should you avoid it?",
              "medium", "medium",
              """- Singleton ensures only one instance exists; provides global access point
- Thread-safe implementations: synchronized method (slow), double-checked locking (fast with volatile), enum singleton (best)
- Enum singleton: inherently thread-safe, serialization-safe, concise
- Spring beans are singletons by default — usually no need to implement your own
- When to avoid: testing (hard to mock), hidden coupling (acts like global state), violates SRP when overused""",
              """A Singleton ensures exactly one instance of a class exists in your application and provides a global access point to it. The challenge is making it thread-safe — a naive implementation has a race condition where two threads might both see a null instance and both create new ones simultaneously.

The cleanest modern Java approach is an enum singleton. Enums are instantiated exactly once by the JVM during class loading, which is inherently thread-safe. They're also safe from serialization attacks (deserializing a regular singleton would create a second instance). For most Java developers today, you'll rarely write your own singletons because Spring's IoC container handles singleton beans automatically.

The reasons to avoid Singleton as a pattern: it's essentially a global variable, which makes code hard to test (you can't easily inject a mock) and creates invisible dependencies between classes. If your "singleton" is a Spring bean, you get singleton scope plus the ability to swap implementations in tests.""",
              """## Thread-Safe Singleton Implementations

```java
// Option 1: Enum singleton — BEST modern approach
// Thread-safe, serialization-safe, concise
public enum DatabaseConnectionPool {
    INSTANCE;

    private final HikariDataSource dataSource;

    DatabaseConnectionPool() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(System.getenv("DB_URL"));
        this.dataSource = new HikariDataSource(config);
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
// Usage: DatabaseConnectionPool.INSTANCE.getConnection()

// Option 2: Double-checked locking with volatile
public class ConfigManager {
    private static volatile ConfigManager instance;  // volatile is REQUIRED

    private ConfigManager() { loadConfig(); }

    public static ConfigManager getInstance() {
        if (instance == null) {                    // first check (no lock)
            synchronized (ConfigManager.class) {
                if (instance == null) {            // second check (with lock)
                    instance = new ConfigManager();
                }
            }
        }
        return instance;
    }
}

// Option 3: Initialization-on-demand holder (lazy, thread-safe, no sync overhead)
public class AppConfig {
    private AppConfig() {}

    private static class Holder {
        static final AppConfig INSTANCE = new AppConfig();  // JVM guarantees one-time init
    }

    public static AppConfig getInstance() { return Holder.INSTANCE; }
}
```

## In Spring (Preferred Approach)

```java
// Spring beans are singleton-scoped by default — no custom Singleton needed
@Service  // @Scope("singleton") is the default
public class PaymentGatewayService {
    // Spring creates one instance, injects it everywhere it's needed
    // Easy to mock in tests: @MockBean PaymentGatewayService mockService
}
```"""),

            q("builder-pattern",
              "Builder Pattern",
              "What is the Builder pattern and when do you use it in Java?",
              "easy", "high",
              """- Builder separates complex object construction from its representation
- Use when: constructor has many parameters (>4), object has optional fields, object should be immutable after creation
- Java implementations: traditional inner static Builder class, Lombok @Builder, record + builder()
- Fluent API: builder methods return 'this' for method chaining
- Distinct from Telescoping Constructors anti-pattern — eliminate multiple overloaded constructors
- Common in Spring: MockMvcRequestBuilders, UriComponentsBuilder, HttpHeaders""",
              """The Builder pattern solves the readability problem with complex constructors. When a class has 6-10 parameters, a constructor call like `new User(null, "John", "Doe", null, 25, "ACTIVE", null, true)` is incomprehensible — you have to count parameters to know what each null means. The Builder gives each parameter a name: `User.builder().firstName("John").lastName("Doe").age(25).active(true).build()`.

Builders are also the right tool for immutable objects with optional fields. An immutable object can't use setters, and having 15 constructor overloads for every combination of optional parameters (telescoping constructors) is unmaintainable. The Builder collects all optional parameters first, then creates the fully initialized immutable object in one build() call.

Lombok's @Builder annotation generates the Builder code automatically, which is what most Spring Boot teams use today. For complex domain objects you might still write builders manually to add validation in the build() method.""",
              """## Traditional Builder Implementation

```java
public class EmailMessage {
    // All fields final — immutable after construction
    private final String to;
    private final String from;
    private final String subject;
    private final String body;
    private final List<String> cc;
    private final boolean highPriority;

    private EmailMessage(Builder builder) {
        this.to = Objects.requireNonNull(builder.to, "to is required");
        this.from = Objects.requireNonNull(builder.from, "from is required");
        this.subject = builder.subject != null ? builder.subject : "(no subject)";
        this.body = builder.body;
        this.cc = Collections.unmodifiableList(builder.cc);
        this.highPriority = builder.highPriority;
    }

    public static Builder builder(String to, String from) {
        return new Builder(to, from);
    }

    public static class Builder {
        private final String to, from;
        private String subject, body;
        private List<String> cc = new ArrayList<>();
        private boolean highPriority;

        private Builder(String to, String from) { this.to = to; this.from = from; }
        public Builder subject(String s) { this.subject = s; return this; }
        public Builder body(String b) { this.body = b; return this; }
        public Builder cc(String... addresses) { cc.addAll(Arrays.asList(addresses)); return this; }
        public Builder highPriority() { this.highPriority = true; return this; }
        public EmailMessage build() { return new EmailMessage(this); }
    }
}

// Usage — readable and self-documenting
EmailMessage msg = EmailMessage.builder("cto@company.com", "system@company.com")
    .subject("Deployment Alert")
    .body("Production deployment successful")
    .cc("devops@company.com", "monitoring@company.com")
    .highPriority()
    .build();
```

## Lombok @Builder (Most Common in Practice)

```java
@Builder
@Value  // makes all fields final, immutable
public class CreateOrderRequest {
    @NonNull String customerId;
    @NonNull List<OrderItem> items;
    @Builder.Default String currency = "USD";  // default value
    String discountCode;
    String shippingAddress;
}

// Usage
CreateOrderRequest request = CreateOrderRequest.builder()
    .customerId("cust-123")
    .items(cartItems)
    .discountCode("SAVE10")
    .build();
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# ENHANCE EXISTING: CACHING PERFORMANCE - Add complete-qa content
# ═══════════════════════════════════════════════════════════════════════════════

CACHING_PERFORMANCE_CONTENT = {
    "caching-strategies": {
        "topic": "Caching Strategies",
        "questions": [
            q("cache-aside-pattern",
              "Cache-Aside Pattern",
              "What is the cache-aside (lazy loading) pattern and how do you implement it in Spring Boot?",
              "medium", "high",
              """- Cache-aside (lazy loading): application manages the cache directly — read from cache first, load from DB on miss, then populate cache
- Opposite of cache-through where cache layer handles DB interaction automatically
- Cache miss: first request always hits DB; subsequent requests hit cache
- Stale data risk: cache and DB can diverge until TTL expires or explicit invalidation
- Spring @Cacheable implements cache-aside automatically
- Good for: read-heavy workloads, data that doesn't change frequently
- Resilient: if cache fails, system continues to work (just slower)""",
              """Cache-aside is the most common caching pattern. The application looks in the cache first. On a hit, it returns the cached value. On a miss, it fetches from the database, stores the result in the cache, then returns it. The application owns both the database and cache interactions explicitly.

The major advantage is resilience. If Redis is down, your application continues working — it just falls back to the database for every request until Redis recovers. The cache is a performance optimization, not a hard dependency. This is why you should set a cache timeout and let the application handle CacheExceptions gracefully.

The tradeoff is stale data. When you update a record in the database, the cached version remains until the TTL expires or you explicitly evict it. For product catalogs or reference data that changes rarely, stale data for a few minutes is acceptable. For financial balances or inventory counts, you need aggressive eviction or a different strategy like write-through.""",
              """## Manual Cache-Aside

```java
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final RedisTemplate<String, Product> cache;

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);
    private static final String CACHE_KEY_PREFIX = "product:";

    public Product getProduct(Long id) {
        String key = CACHE_KEY_PREFIX + id;

        // 1. Check cache
        Product cached = cache.opsForValue().get(key);
        if (cached != null) {
            return cached;  // cache hit
        }

        // 2. Load from DB (cache miss)
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        // 3. Store in cache
        cache.opsForValue().set(key, product, CACHE_TTL);
        return product;
    }

    // Invalidate on update
    public Product updateProduct(Long id, UpdateProductRequest req) {
        Product updated = productRepository.save(applyUpdate(id, req));
        cache.delete(CACHE_KEY_PREFIX + id);  // evict stale cache entry
        return updated;
    }
}
```

## Spring @Cacheable (Declarative Cache-Aside)

```java
@Service
public class CatalogService {

    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product findProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = "products", key = "#id")
    public void evictProduct(Long id) {}

    // Evict all products cache
    @CacheEvict(value = "products", allEntries = true)
    @Scheduled(cron = "0 0 * * * *")  // hourly cleanup
    public void evictProductCache() {}
}
```

## Pattern Comparison

| Pattern | Who manages cache? | Stale data risk | DB fallback | Best for |
|---------|-------------------|-----------------|-------------|----------|
| Cache-aside | Application | Yes (until TTL) | Yes | Read-heavy, resilient systems |
| Write-through | Cache | No | No | Write-heavy, consistency critical |
| Write-behind | Cache | Temporarily | No | High-write, eventual consistency ok |"""),

            q("cache-invalidation",
              "Cache Invalidation Strategies",
              "What are the main cache invalidation strategies and how do you choose between them?",
              "medium", "high",
              """- **TTL-based expiry**: simplest — data expires after N seconds; balance freshness vs performance
- **Event-driven invalidation**: explicit eviction when data changes — consistent but adds coupling
- **Cache versioning**: append version to cache key — invalidate by version bump without scanning keys
- **Write-through**: update cache and DB simultaneously on write — always consistent, double write cost
- **Cache aside with eviction**: write to DB, then delete cache key — next read repopulates
- Famous Phil Karlton quote: "There are only two hard things in CS: cache invalidation and naming things"
- Anti-pattern: long TTL with no explicit eviction on updates = stale data""",
              """Cache invalidation is genuinely hard because it's a distributed consistency problem. Your database is the source of truth, and your cache is a copy. Keeping that copy fresh requires coordination between every write and every cache.

The simplest strategy is TTL-based expiry — data expires after 5 minutes and gets refreshed on the next read. It works for any data that can tolerate some staleness, and it requires zero coordination between writes and cache. The cost is either serving stale data (if TTL is long) or high cache miss rates (if TTL is short). Finding the right TTL requires understanding your data's change frequency and your business tolerance for stale information.

Explicit eviction on write is more precise — when you update a product, you delete its cache key immediately. The next read repopulates from the fresh database value. This requires that every write path knows which cache keys to invalidate, which creates coupling. When a product update affects multiple cached aggregations (product detail page, category listing, search results), you might need to evict from multiple caches, which quickly gets complex.""",
              """## TTL-Based Strategy

```java
// TTL appropriate for each data type
cache.opsForValue().set("product:" + id, product, Duration.ofMinutes(30));     // Product catalog
cache.opsForValue().set("user-profile:" + id, profile, Duration.ofHours(1));   // User profiles
cache.opsForValue().set("exchange-rate:USD", rate, Duration.ofMinutes(5));      // Frequently updated
cache.opsForValue().set("config:feature-flags", flags, Duration.ofSeconds(30)); // Near real-time
```

## Event-Driven Invalidation

```java
@Service
@Transactional
public class ProductService {

    // Transactional: DB update and cache eviction happen together
    public Product updateProduct(Long id, UpdateProductRequest req) {
        Product updated = productRepository.save(applyUpdate(id, req));

        // Evict all related cache keys
        cacheManager.getCache("products").evict(id);
        cacheManager.getCache("product-list").clear();     // invalidate list caches
        cacheManager.getCache("category-products").clear(); // category aggregations

        // Publish event for other services to invalidate their caches
        eventPublisher.publishEvent(new ProductUpdatedEvent(id));

        return updated;
    }
}
```

## Cache Versioning (Avoids Mass Eviction)

```java
// Store version in Redis
public String getCacheKey(String entityType, Long id) {
    Long version = redisTemplate.opsForValue()
        .get("version:" + entityType);  // e.g., version:product = 42
    return entityType + ":" + id + ":v" + version;
}

// Invalidate entire entity type by incrementing version — old keys are orphaned
public void invalidateAllProducts() {
    redisTemplate.opsForValue().increment("version:product");
    // Old keys like "product:1:v41" are never read again, expire naturally
}
```"""),
        ]
    },

    "performance-tuning": {
        "topic": "Application Performance Tuning",
        "questions": [
            q("n-plus-one-query",
              "The N+1 Query Problem",
              "What is the N+1 query problem in Hibernate and how do you fix it?",
              "medium", "high",
              """- N+1 problem: fetching N parent entities, then executing N additional queries for each entity's lazy collection
- Root cause: default LAZY loading in Hibernate — collections loaded on access, one query per entity
- Detection: enable SQL logging (spring.jpa.show-sql=true), Hibernate Statistics, p6spy
- Solutions: JOIN FETCH in JPQL, EntityGraph, batch fetching, DTO projections
- JOIN FETCH: loads parent and children in a single SQL JOIN query
- Batch size: Hibernate loads N lazy collections in one IN query instead of N queries
- EAGER loading is NOT the solution — it causes over-fetching everywhere""",
              """The N+1 problem is one of the most common performance killers in Hibernate applications. You load a list of 100 orders (1 query), and then access `order.getItems()` on each order — Hibernate fires a separate SQL query for each order's items (100 more queries). You started with 1 query intention and ended with 101 database roundtrips.

It happens because Hibernate's default fetch type for collections is LAZY — the collection isn't loaded until you access it. This is usually the right default (you don't always need the children), but when you do need them, you must explicitly tell Hibernate to fetch them in the same query using JOIN FETCH or EntityGraph.

The deceptive part is that it works correctly — just slowly. All 100 orders and their items are loaded, but with 101 roundtrips instead of 1. In development with a local database this might be invisible, but in production with network latency, 100 extra queries can turn a 50ms request into a 2-second one.""",
              """## Detecting N+1 (Enable SQL Logging)

```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        generate_statistics: true  # logs query count per session
logging:
  level:
    org.hibernate.stat: DEBUG
```

## The Problem

```java
// This triggers N+1 queries if Order has a lazy List<OrderItem> items
List<Order> orders = orderRepository.findByStatus("PENDING");
for (Order order : orders) {
    log.info("Total items: {}", order.getItems().size()); // ← N queries here!
}
// SQL log will show: SELECT * FROM orders (1 query)
// Then: SELECT * FROM order_items WHERE order_id=1
//       SELECT * FROM order_items WHERE order_id=2
//       ... 99 more queries
```

## Fix 1: JOIN FETCH

```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
    List<Order> findByStatusWithItems(@Param("status") String status);
    // Single SQL: SELECT o.*, oi.* FROM orders o JOIN order_items oi ON o.id = oi.order_id
}
```

## Fix 2: EntityGraph

```java
@EntityGraph(attributePaths = {"items", "items.product"})
List<Order> findByStatus(String status);
// Auto-generates JOIN FETCH for 'items' and 'items.product'
```

## Fix 3: DTO Projection (Most Efficient — Only Fetch What You Need)

```java
@Query("""
    SELECT new com.example.dto.OrderSummary(
        o.id, o.status, COUNT(oi))
    FROM Order o LEFT JOIN o.items oi
    WHERE o.status = :status
    GROUP BY o.id, o.status
    """)
List<OrderSummary> findOrderSummaries(@Param("status") String status);
// No entity loading at all — pure projection
```"""),
        ]
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# RUN ALL GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("Generating Java Backend Intermediate content...\n")

    write_stack("sql-databases", SQL_DATABASES)
    write_stack("postgresql", POSTGRESQL)
    write_stack("aws", AWS)
    write_stack("advanced-java", ADVANCED_JAVA)
    write_stack("redis", REDIS)
    write_stack("kafka", KAFKA)
    write_stack("docker", DOCKER)
    write_stack("git", GIT)
    write_stack("maven-gradle", MAVEN_GRADLE)

    # Add new subcategories to existing core-java stack
    for subcat_slug, subcat_data in CORE_JAVA_ENHANCEMENTS.items():
        subcat_dir = os.path.join(CONTENT_ROOT, "core-java", subcat_slug)
        os.makedirs(subcat_dir, exist_ok=True)
        questions = subcat_data["questions"]
        q_index = [{
            "id": q["slug"], "title": q["title"], "slug": q["slug"],
            "question": q["question"], "difficulty": q["difficulty"],
        } for q in questions]
        with open(os.path.join(subcat_dir, "questions.json"), "w") as f:
            json.dump(q_index, f, indent=2, ensure_ascii=False)
        complete_qa = {"topic": subcat_data["topic"], "topicSlug": subcat_slug, "questions": questions}
        with open(os.path.join(subcat_dir, "complete-qa.json"), "w") as f:
            json.dump(complete_qa, f, indent=2, ensure_ascii=False)
    print("✓ Enhanced: core-java (string-handling, design-patterns-java)")

    # Add caching content to caching-performance stack
    for subcat_slug, subcat_data in CACHING_PERFORMANCE_CONTENT.items():
        subcat_dir = os.path.join(CONTENT_ROOT, "caching-performance", subcat_slug)
        os.makedirs(subcat_dir, exist_ok=True)
        questions = subcat_data["questions"]
        q_index = [{
            "id": q["slug"], "title": q["title"], "slug": q["slug"],
            "question": q["question"], "difficulty": q["difficulty"],
        } for q in questions]
        with open(os.path.join(subcat_dir, "questions.json"), "w") as f:
            json.dump(q_index, f, indent=2, ensure_ascii=False)
        complete_qa = {"topic": subcat_data["topic"], "topicSlug": subcat_slug, "questions": questions}
        with open(os.path.join(subcat_dir, "complete-qa.json"), "w") as f:
            json.dump(complete_qa, f, indent=2, ensure_ascii=False)
    print("✓ Enhanced: caching-performance (caching-strategies, performance-tuning)")

    # Make devops-cicd visible by removing _config.json
    config_path = os.path.join(CONTENT_ROOT, "devops-cicd", "_config.json")
    if os.path.exists(config_path):
        os.remove(config_path)
        print("✓ Made devops-cicd visible (removed _config.json)")

    print("\n✅ All content generated successfully!")
    print("\nNew stacks added:")
    for s in ["sql-databases", "postgresql", "aws", "advanced-java", "redis", "kafka", "docker", "git", "maven-gradle"]:
        print(f"  - {s}")
