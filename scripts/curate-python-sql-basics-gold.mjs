#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/python-backend-fresher");
const moduleRoot = path.join(domainRoot, "sql-basics");
const indexPath = path.join(domainRoot, "_index.json");
const today = "2026-09-07";
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

const topicOrder = [
  "select-where-order-by",
  "joins-inner-outer-left",
  "group-by-and-having",
  "aggregate-functions",
  "subqueries-basics",
  "primary-foreign-keys",
  "basic-indexes-concept",
  "comparisons",
];

const topicTitles = {
  "select-where-order-by": "SELECT, WHERE, and ORDER BY",
  "joins-inner-outer-left": "INNER, LEFT, and OUTER JOINs",
  "group-by-and-having": "GROUP BY and HAVING",
  "aggregate-functions": "Aggregate Functions",
  "subqueries-basics": "Subquery Basics",
  "primary-foreign-keys": "Keys and Constraints",
  "basic-indexes-concept": "Index Fundamentals",
  comparisons: "Common SQL Comparisons",
};

const prose = (...parts) => parts.join("\n\n");
const table = (...rows) => rows.join("\n");
const sql = (expected, ...lines) => [
  "```sql",
  `-- Expected result: ${JSON.stringify(expected)}`,
  ...lines,
  "```",
].join("\n");
const sqlExample = (...lines) => ["```sql", ...lines, "```"].join("\n");
const mermaid = (...lines) => {
  const safeLines = lines.map((line) => line
    .replace(/\b([A-Za-z][A-Za-z0-9_]*)\[([^\]"]+)\]/g, '$1["$2"]')
    .replace(/\b([A-Za-z][A-Za-z0-9_]*)\{([^}"]+)\}/g, '$1{"$2"}'));
  return ["```mermaid", ...safeLines, "```"].join("\n");
};

const definitions = [
  {
    topic: "select-where-order-by",
    slug: "sql-logical-query-processing-order",
    question: "In what logical order does SQL process `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, and `ORDER BY`?",
    title: "Logical SQL Query Processing Order",
    direct: "A useful logical model is `FROM` and `JOIN`, then `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`, and finally row limiting. It explains which rows and names exist at each stage. The optimizer may execute a different physical plan, but it must preserve the query's defined result.",
    quick: [
      "`FROM` and `JOIN` first form the input row set.",
      "`WHERE` removes individual rows before grouping.",
      "`GROUP BY` forms groups, and `HAVING` removes completed groups.",
      "`SELECT` computes output columns; `ORDER BY` sorts the resulting rows.",
      "Logical order explains name visibility, but it is not a promise about the physical execution plan.",
    ],
    intent: {
      testing: "Whether query clauses are connected to row transformations rather than recalled as an unexplained sequence.",
      common_mistake: "Treating written order as execution order or using a `SELECT` alias inside `WHERE` and expecting portable behavior.",
      to_stand_out: "Distinguish the logical model used to reason about results from the physical plan chosen by the optimizer.",
    },
    speaking: prose(
      "SQL is written starting with `SELECT`, but a useful logical processing model begins with `FROM`. The database first identifies source tables and forms joined rows. `WHERE` then keeps only source rows whose condition is true. If the query groups data, `GROUP BY` forms those rows into groups and `HAVING` filters the completed groups.",
      "The `SELECT` list is evaluated after those row and group stages, which explains why a portable query cannot normally use a `SELECT` alias in `WHERE`: that alias does not exist at the row-filtering stage. `ORDER BY` works on the produced result and can commonly refer to an output alias. Duplicate removal and row limiting happen near the end of this logical pipeline.",
      "For example, a query can read active employees, group them by department, keep departments with at least two active employees, select the department and `COUNT(*)`, then sort by that count. Moving `COUNT(*) >= 2` into `WHERE` would be invalid because no group count exists there yet. The condition belongs in `HAVING`.",
      sqlExample(
        "SELECT department, COUNT(*) AS headcount",
        "FROM employees",
        "WHERE active = 1",
        "GROUP BY department",
        "HAVING COUNT(*) >= 2",
        "ORDER BY headcount DESC, department;"
      ),
      "This order is a reasoning model, not a claim that the engine literally performs every step in that sequence. PostgreSQL and SQLite optimizers may push predicates, use indexes, or reorder safe inner joins while preserving the same observable result. For portable syntax, string values use single quotes and standard quoted identifiers use double quotes. PostgreSQL follows that distinction strictly; SQLite retains some historical double-quoted-string compatibility, which application code should not rely on. I use the logical pipeline to place conditions correctly, then inspect the plan separately when performance matters."
    ),
    deepTitle: "Logical query processing stages",
    deep: prose(
      "**SQL logical model.** Logical query processing is a teaching model for how a SQL result is formed. It describes a sequence of intermediate row sets, even though the statement is written in a different order and the database may use another physical plan.",
      "**Clause processing sequence.** `FROM` and each `JOIN` decide which source rows are available. `WHERE` tests those rows one at a time and removes failures. `GROUP BY` collects the survivors into groups, and `HAVING` removes whole groups after their aggregates can be known. `SELECT` builds the requested output columns. `ORDER BY` arranges that output, and `LIMIT` or another row-limiting clause takes a final slice. These stages explain why an aggregate condition belongs in `HAVING` and why an output alias is not normally visible to `WHERE`.",
      mermaid(
        "flowchart LR",
        "  F[FROM and JOIN build source rows] --> W[WHERE keeps qualifying rows]",
        "  W --> G[GROUP BY forms groups]",
        "  G --> H[HAVING keeps qualifying groups]",
        "  H --> S[SELECT computes output columns]",
        "  S --> O[ORDER BY sorts output]",
        "  O --> L[LIMIT keeps the requested slice]"
      ),
      sql(
        [["engineering", 2], ["support", 2]],
        "CREATE TABLE employees (",
        "    id INTEGER PRIMARY KEY,",
        "    name TEXT NOT NULL,",
        "    department TEXT NOT NULL,",
        "    salary INTEGER NOT NULL,",
        "    active INTEGER NOT NULL",
        ");",
        "INSERT INTO employees VALUES",
        "    (1, 'Mina', 'engineering', 90000, 1),",
        "    (2, 'Omar', 'engineering', 85000, 1),",
        "    (3, 'Lee', 'engineering', 70000, 0),",
        "    (4, 'Asha', 'support', 65000, 1),",
        "    (5, 'Noah', 'support', 62000, 1);",
        "SELECT department, COUNT(*) AS headcount",
        "FROM employees",
        "WHERE active = 1",
        "GROUP BY department",
        "HAVING COUNT(*) >= 2",
        "ORDER BY headcount DESC, department ASC",
        "LIMIT 2;"
      ),
      "**Department summary query.** Five employees enter the source stage. `WHERE active = 1` removes Lee, leaving four rows. Grouping creates engineering and support groups with two rows each. Both pass `HAVING COUNT(*) >= 2`. `SELECT` turns each group into a department name and count, and the two-column ordering makes their final order predictable.",
      "**Logical and physical plan boundary.** This sequence explains meaning, not timing. An optimizer can use an index, push a safe filter closer to a table scan, or reorder compatible inner joins without changing the answer. Outer joins, NULLs, volatile functions, and vendor extensions can make transformations more delicate. Use the logical model to write a correct query, then use the target database's execution-plan tools to investigate performance. A row order is guaranteed only when the final query declares one."
    ),
    followups: [
      "Why can an output alias usually appear in `ORDER BY` but not portably in `WHERE`?",
      "Where does `DISTINCT` fit into the logical pipeline?",
      "Why can the physical execution plan differ from the logical processing order?",
    ],
  },
  {
    topic: "select-where-order-by",
    slug: "sql-null-comparisons-and-ordering",
    question: "How should you compare and sort `NULL` values in SQL?",
    title: "SQL NULL Comparisons and Ordering",
    direct: "`NULL` represents a missing or unknown value, so ordinary comparisons such as `column = NULL` do not become true; use `IS NULL` or `IS NOT NULL`. In sorting, default NULL placement differs by database, so write `NULLS FIRST` or `NULLS LAST` where supported when the position matters.",
    quick: [
      "`NULL` is not equal to anything, including another `NULL`, under ordinary comparison rules.",
      "Use `IS NULL` and `IS NOT NULL` to test missing values.",
      "`WHERE` keeps only true conditions; false and unknown are both filtered out.",
      "PostgreSQL and SQLite have different default NULL sort positions.",
      "Specify `NULLS FIRST` or `NULLS LAST`, or use a portable sort expression, when placement is part of the result contract.",
    ],
    intent: {
      testing: "Whether three-valued logic, NULL predicates, and vendor-specific ordering defaults are understood.",
      common_mistake: "Writing `value = NULL` or assuming every database places NULL at the same end of an ascending sort.",
      to_stand_out: "Explain that `WHERE` accepts only true and make NULL placement explicit instead of relying on a database default.",
    },
    speaking: prose(
      "`NULL` means a value is missing or unknown; it is not an ordinary value that can be compared with equality. An expression such as `resolved_at = NULL` evaluates to unknown, not true, even when `resolved_at` is NULL. SQL uses three logical outcomes—true, false, and unknown—and a `WHERE` clause keeps only rows whose condition is true.",
      "The dedicated predicates are `IS NULL` and `IS NOT NULL`. For example, `WHERE resolved_at IS NULL` finds unresolved tickets. The same care is needed with arithmetic and most functions because a NULL input often produces a NULL result. `COALESCE` can supply a display or calculation fallback, but replacing missing data with zero or an empty string is a business choice, not a general SQL rule.",
      "Sorting is a separate issue. PostgreSQL treats NULL as larger than any non-NULL value by default, so ascending order places NULL last and descending order places it first. SQLite treats NULL as smaller, giving the opposite defaults. Both current PostgreSQL and SQLite accept `NULLS FIRST` and `NULLS LAST`, but other engines differ. A broadly portable alternative is to sort first by `column IS NULL` and then by the column, after checking the engine's boolean ordering syntax.",
      sqlExample(
        "SELECT id, resolved_at",
        "FROM tickets",
        "WHERE resolved_at IS NULL OR resolved_at >= '2026-09-01'",
        "ORDER BY resolved_at ASC NULLS LAST, id;"
      ),
      "I make the requirement explicit: if unfinished tickets must appear last, I request that placement rather than inheriting a vendor default. I also avoid turning NULL into a sentinel date because that mixes missingness with real data and can affect indexes and comparisons. The safe interview answer is to use NULL predicates for filtering, remember unknown in Boolean expressions, and state the intended ordering explicitly."
    ),
    deepTitle: "SQL NULL comparison and ordering",
    deep: prose(
      "**NULL and unknown.** `NULL` marks the absence of a known SQL value. It is not the number zero, an empty string, or a special value equal to itself. Because the missing value is unknown, ordinary comparisons can produce a third logical result called unknown.",
      "**Three-valued filtering.** Equality and inequality need two known operands, so `value = NULL` and `value <> NULL` are unknown. A `WHERE` clause keeps only rows for which its whole condition is true; false and unknown are both discarded. SQL therefore provides `IS NULL` and `IS NOT NULL`, which answer the missingness question directly. Sorting does not use those comparison predicates in the same way: each engine defines a default position for NULL, and some provide `NULLS FIRST` or `NULLS LAST` to make the choice explicit.",
      mermaid(
        "flowchart LR",
        "  N[value is NULL] --> E{predicate used}",
        "  E -- value equals NULL --> U[unknown; WHERE removes row]",
        "  E -- value not equal NULL --> U",
        "  E -- value IS NULL --> T[true; WHERE keeps row]",
        "  E -- value IS NOT NULL --> F[false; WHERE removes row]"
      ),
      sql(
        [[1, "pending"], [3, "pending"]],
        "CREATE TABLE tickets (",
        "    id INTEGER PRIMARY KEY,",
        "    title TEXT NOT NULL,",
        "    resolved_at TEXT",
        ");",
        "INSERT INTO tickets VALUES",
        "    (1, 'Login failure', NULL),",
        "    (2, 'Update copy', '2026-09-01'),",
        "    (3, 'Slow report', NULL);",
        "SELECT id, COALESCE(resolved_at, 'pending') AS status",
        "FROM tickets",
        "WHERE resolved_at IS NULL",
        "ORDER BY id;"
      ),
      "**Pending ticket query.** Tickets 1 and 3 have no resolution timestamp. `resolved_at IS NULL` selects exactly those rows. The query then uses `COALESCE` to display the word `pending`, but it does not rewrite the stored data. Keeping filtering and display separate prevents a real timestamp or status label from being confused with missingness.",
      "**Vendor NULL-order boundary.** NULL can make compound conditions surprising: `NOT`, `AND`, `OR`, `IN`, and `NOT IN` all follow three-valued logic. Aggregates also have their own NULL rules. PostgreSQL sorts NULL after non-NULL values in ascending order by default, while SQLite sorts it before them; other systems vary. If placement matters, state it explicitly where supported or use a tested portable expression. Apply `COALESCE` only when the fallback has a real business meaning, because replacing unknown data can destroy useful information."
    ),
    followups: [
      "What happens when `NOT IN` compares against a set containing NULL?",
      "How do PostgreSQL and SQLite differ in their default ascending NULL order?",
      "When would replacing NULL with zero through `COALESCE` be misleading?",
    ],
  },
  {
    topic: "select-where-order-by",
    slug: "sql-order-by-limit-deterministic-pagination",
    question: "Why should `ORDER BY` include a unique tie-breaker when using `LIMIT` or pagination?",
    title: "Deterministic ORDER BY and Pagination",
    direct: "`LIMIT` selects from whatever order the query defines. Without `ORDER BY`, row order is unspecified; with ties, tied rows may still appear in any order. Add a stable unique tie-breaker such as the primary key. For changing datasets, keyset pagination can also avoid the shifting and scanning problems of large offsets.",
    quick: [
      "A query without `ORDER BY` does not promise a repeatable row order.",
      "Ordering by a non-unique column leaves tied rows unordered.",
      "Append a unique column such as `id` to create a total order.",
      "`LIMIT` and `OFFSET` operate after ordering in the logical query model.",
      "Keyset pagination follows the last sort key and is often steadier than a large offset on changing data.",
    ],
    intent: {
      testing: "Whether ordering is treated as part of the result contract and pagination trade-offs are understood.",
      common_mistake: "Assuming primary-key or insertion order without declaring it, or paginating tied timestamps without a second sort key.",
      to_stand_out: "Define a total order and describe when a seek predicate is preferable to a growing offset.",
    },
    speaking: prose(
      "SQL tables and query results are unordered unless an `ORDER BY` clause defines an order. A database may return rows in a convenient-looking sequence because of an index or current plan, but that sequence is not a contract. Adding `LIMIT` without ordering therefore means 'some matching rows,' not reliably the first or latest rows.",
      "Ordering also needs to be complete. If posts are sorted only by `created_at`, several posts with the same timestamp are tied. The engine may return those tied rows in either order, and a later execution or another plan may choose differently. Adding a unique tie-breaker such as `ORDER BY created_at DESC, id DESC` creates a total order that every page can follow.",
      "For example, with IDs 1 and 2 sharing one timestamp, a query using that two-column order always places ID 2 before ID 1. `LIMIT 2 OFFSET 1` then has a defined slice. PostgreSQL and SQLite both support `LIMIT` and `OFFSET`; standard SQL also has `FETCH` syntax, and details vary across vendors.",
      sqlExample(
        "SELECT id, title, created_at",
        "FROM posts",
        "ORDER BY created_at DESC, id DESC",
        "LIMIT 2 OFFSET 1;"
      ),
      "Offset pagination remains sensitive to concurrent inserts or deletes: rows can shift between page requests, causing a duplicate or skip. Large offsets may also require the engine to walk past many earlier rows. Keyset pagination instead remembers the last pair, such as `(created_at, id)`, and requests rows after that pair using the same ordering. It is not ideal for jumping directly to arbitrary page numbers, so the API requirement decides. My baseline is explicit ordering, a unique tie-breaker, and pagination semantics documented for changing data."
    ),
    deepTitle: "Deterministic SQL pagination",
    deep: prose(
      "**Total ordering.** Deterministic ordering means that every two result rows have a defined relative position. Pagination is reliable only when the query establishes that total order before it selects a page-sized slice.",
      "**Tie-breaker and pagination.** `ORDER BY created_at DESC` groups equal timestamps into a tie but does not resolve their internal order. Adding a unique key such as `id DESC` breaks every tie. `LIMIT` then keeps a requested number of rows, while `OFFSET` skips positions in that declared order. A database can change its plan and still return the same sequence because the order is complete. Keyset pagination uses the last seen ordering values in a comparison and continues after that key instead of counting through all earlier positions.",
      table(
        "| Ordering choice | What remains unspecified | Pagination risk |",
        "|---|---|---|",
        "| no `ORDER BY` | every row position | any page can change |",
        "| `created_at DESC` | rows sharing a timestamp | ties may cross pages |",
        "| `created_at DESC, id DESC` | nothing when `id` is unique | stable ordering for one snapshot |",
        "| keyset on both values | position after the last seen key | no growing offset scan |"
      ),
      sql(
        [[3, "C"], [2, "B"]],
        "CREATE TABLE posts (",
        "    id INTEGER PRIMARY KEY,",
        "    title TEXT NOT NULL,",
        "    created_at TEXT NOT NULL",
        ");",
        "INSERT INTO posts VALUES",
        "    (1, 'A', '2026-09-01T10:00:00'),",
        "    (2, 'B', '2026-09-01T10:00:00'),",
        "    (3, 'C', '2026-09-02T10:00:00'),",
        "    (4, 'D', '2026-09-03T10:00:00');",
        "SELECT id, title",
        "FROM posts",
        "ORDER BY created_at DESC, id DESC",
        "LIMIT 2 OFFSET 1;"
      ),
      "**Ordered posts query.** Posts D and C have the two newest timestamps. Posts B and A share the oldest timestamp, so their IDs decide that B precedes A. After the ordered sequence becomes D, C, B, A, `OFFSET 1 LIMIT 2` returns C and B. The result is reproducible for the same data.",
      "**Changing-data and cursor boundary.** A total order stabilizes one database snapshot, but offset pages can still shift between separate requests when rows are inserted or deleted. Keyset pagination usually handles forward movement through changing data better and avoids large offset scans, but it cannot jump naturally to an arbitrary page number. The sort direction and seek predicate must agree across every key. NULL ordering is another vendor boundary, so nullable cursor columns need an explicit policy."
    ),
    followups: [
      "Why is ordering by a timestamp alone not always deterministic?",
      "How can inserts between requests affect offset pagination?",
      "What cursor values would keyset pagination retain for this two-column order?",
    ],
  },
  {
    topic: "joins-inner-outer-left",
    slug: "sql-inner-join-vs-left-join",
    question: "What is the difference between an `INNER JOIN` and a `LEFT JOIN`?",
    title: "INNER JOIN vs LEFT JOIN",
    direct: "An `INNER JOIN` returns only row pairs that satisfy the join condition. A `LEFT JOIN` returns those matches and also preserves every row from its left input, filling right-side columns with `NULL` when no match exists. One left row can still produce several result rows when several right rows match.",
    quick: [
      "`INNER JOIN` keeps only matching row pairs.",
      "`LEFT JOIN` preserves every left row and adds matching right rows.",
      "An unmatched left row receives NULL for right-side columns.",
      "A one-to-many relationship can duplicate the left values across several result rows.",
      "The `ON` condition defines matching; the join type defines which unmatched rows survive.",
    ],
    intent: {
      testing: "Whether join matching, row preservation, NULL extension, and one-to-many cardinality are understood.",
      common_mistake: "Describing joins as set intersections without explaining duplicate matches or NULL-filled unmatched rows.",
      to_stand_out: "Predict the result row count from relationship cardinality and state which side an outer join preserves.",
    },
    speaking: prose(
      "A join combines rows from two inputs according to a condition, usually a foreign-key equality. With an `INNER JOIN`, the result contains one row for every pair that makes the `ON` condition true. Rows on either side that find no partner are absent from the result.",
      "A `LEFT JOIN`, also called `LEFT OUTER JOIN`, starts with the same matching pairs but preserves every row from the left input. If a left row has no right match, SQL emits one result row with the left columns present and the right columns set to NULL. This makes a left join useful for reports such as every customer, including customers who have placed no order.",
      "For example, if Mina has two orders, Omar has one, and Asha has none, an inner join returns three order rows and omits Asha. A left join returns four rows: two for Mina, one for Omar, and one NULL-extended row for Asha. A join does not automatically produce one row per customer; cardinality follows the data and condition.",
      sqlExample(
        "SELECT c.name, o.id AS order_id",
        "FROM customers AS c",
        "LEFT JOIN orders AS o ON o.customer_id = c.id",
        "ORDER BY c.id, o.id;"
      ),
      "Choosing the left table is therefore part of the requirement. If the requirement says 'all customers,' customers belong on the preserved side. A later `WHERE` predicate on a right-side column can accidentally remove the NULL-extended rows and make the result behave like an inner join, so outer-join filters need careful placement. `RIGHT JOIN` expresses the converse, but swapping table order and using `LEFT JOIN` is often clearer and more portable. I explain the match condition, preserved side, and expected multiplicity before writing the query."
    ),
    deepTitle: "Join matching and row preservation",
    deep: prose(
      "**Join result rules.** A join tests pairs of rows from two inputs. An inner join returns only accepted pairs. An outer join also preserves specified unmatched rows by creating result rows whose columns from the missing side are NULL.",
      "**Inner and left join mechanics.** The matching rule in `ON`, such as `orders.customer_id = customers.id`, tests each candidate pair. Each accepted pair becomes one output row. An `INNER JOIN` stops there. A `LEFT JOIN` then checks every left row; if no right row matched, it produces one NULL-extended row so that left entity remains visible. This preservation rule does not limit multiplicity. When two orders match one customer, that customer's values appear in two output rows because there are two valid pairs.",
      mermaid(
        "flowchart TD",
        "  P[candidate left-right pairs] --> O{ON condition true?}",
        "  O -- yes --> M[matching pair is returned by INNER and LEFT]",
        "  O -- no --> L{left row has any accepted match?}",
        "  L -- no in INNER JOIN --> D[unmatched left row is removed]",
        "  L -- no in LEFT JOIN --> N[left row plus right-side NULLs]"
      ),
      sql(
        [[1, "Mina", 101], [1, "Mina", 102], [2, "Omar", 103], [3, "Asha", null]],
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, status TEXT NOT NULL);",
        "INSERT INTO customers VALUES (1, 'Mina'), (2, 'Omar'), (3, 'Asha');",
        "INSERT INTO orders VALUES",
        "    (101, 1, 'paid'),",
        "    (102, 1, 'draft'),",
        "    (103, 2, 'paid');",
        "SELECT c.id, c.name, o.id AS order_id",
        "FROM customers AS c",
        "LEFT JOIN orders AS o ON o.customer_id = c.id",
        "ORDER BY c.id, o.id;"
      ),
      "**Customer-order result.** Mina owns orders 101 and 102, so the equality condition creates two pairs for her. Omar owns order 103 and creates one pair. Asha owns none. The left join still returns Asha once with a NULL order ID. Changing only the join type to inner would remove Asha while leaving the three matching rows unchanged.",
      "**Cardinality and filter boundaries.** The left side is a logical input, not necessarily the first table physically scanned. A later `WHERE` test on a right-side column can remove NULL-extended rows and undo preservation. Missing matches also make expressions such as `COUNT(*)` and `COUNT(right.id)` behave differently. Many-to-many data can multiply rows dramatically, so predict the relationship cardinality before aggregating. Use a full outer join only when unmatched rows from both inputs are genuinely required, and verify its availability in the target engine."
    ),
    followups: [
      "Why can a join return more rows than either input table?",
      "How would you find customers who have no orders?",
      "When can a right join be rewritten as a left join?",
    ],
  },
  {
    topic: "joins-inner-outer-left",
    slug: "sql-left-join-on-vs-where-filter",
    question: "How does putting a filter in `ON` instead of `WHERE` change a `LEFT JOIN`?",
    title: "LEFT JOIN Filters in ON vs WHERE",
    direct: "For a `LEFT JOIN`, a right-table condition in `ON` limits which right rows count as matches while preserving every left row. The same condition in `WHERE` is evaluated after NULL-extended rows are created; those rows usually fail the condition and disappear. The two placements therefore answer different questions.",
    quick: [
      "`ON` decides whether a left-right pair matches.",
      "A `LEFT JOIN` adds a NULL-extended result for any left row with no accepted match.",
      "`WHERE` filters the joined rows after outer-row preservation.",
      "A right-side equality in `WHERE` rejects NULL-extended rows and often acts like an inner join.",
      "Place a condition according to the question, not as a style preference.",
    ],
    intent: {
      testing: "Whether the candidate can reason about the stage at which an outer-join predicate applies.",
      common_mistake: "Moving every predicate into `WHERE` and silently dropping left rows without a qualifying right match.",
      to_stand_out: "Translate each placement into plain English and predict the NULL-extended output before running it.",
    },
    speaking: prose(
      "In an outer join, `ON` and `WHERE` are not interchangeable. The `ON` expression decides which pair of source rows counts as a match. After that matching step, a `LEFT JOIN` creates a NULL-extended result for each left row that has no accepted right match. The `WHERE` clause then filters those completed joined rows.",
      "Suppose the requirement is 'show every customer and any paid order.' The status condition belongs in `ON`: `LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'`. A customer with only draft orders has no accepted paid match, so the join still emits that customer with NULL order columns. A customer with no orders is also preserved.",
      "If the same `o.status = 'paid'` condition is placed in `WHERE`, the NULL-extended rows evaluate to unknown and are removed. The query now answers 'show customers that have a paid order.' That may be correct, but it is a different requirement and behaves like an inner join for this predicate.",
      sqlExample(
        "SELECT c.name, o.id AS paid_order_id",
        "FROM customers AS c",
        "LEFT JOIN orders AS o",
        "  ON o.customer_id = c.id AND o.status = 'paid';"
      ),
      "For inner joins, moving a simple predicate between `ON` and `WHERE` often preserves the result and the optimizer can rearrange it. That observation should not be generalized to outer joins. Conditions on the preserved left table also need intent: a `WHERE` condition removes left rows, while putting it only in `ON` does not. I state the desired population first—every left entity or only entities with a match—then place right-side qualification in `ON` when it defines an acceptable match."
    ),
    deepTitle: "Outer-join predicate stages",
    deep: prose(
      "**ON and WHERE roles.** In a `LEFT JOIN`, an `ON` predicate describes an acceptable match, while a `WHERE` predicate decides whether an already joined result row survives. Their different positions can produce different answers even when the text of the condition is identical.",
      "**Row-preservation stages.** SQL considers candidate left-right pairs and evaluates `ON`. Accepted pairs are emitted. If a left row has no accepted pair, the outer join adds one row with NULL for every right column. Only after that preservation step does `WHERE` evaluate the completed rows. A condition such as `o.status = 'paid'` in `WHERE` is unknown for a NULL-extended row, so that row disappears. Keeping the condition in `ON` rejects unsuitable orders but retains the customer.",
      mermaid(
        "flowchart TD",
        "  P[pair left and right candidates] --> O[apply the ON condition]",
        "  O --> M{accepted right match exists?}",
        "  M -- yes --> R[emit each matching joined row]",
        "  M -- no --> N[emit left row with right NULLs]",
        "  R --> W[apply WHERE to completed rows]",
        "  N --> W",
        "  W --> F[final result]"
      ),
      sql(
        [[1, "Mina", 101], [2, "Omar", null], [3, "Asha", null]],
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, status TEXT NOT NULL);",
        "INSERT INTO customers VALUES (1, 'Mina'), (2, 'Omar'), (3, 'Asha');",
        "INSERT INTO orders VALUES (101, 1, 'paid'), (102, 1, 'draft'), (103, 2, 'draft');",
        "SELECT c.id, c.name, o.id AS paid_order_id",
        "FROM customers AS c",
        "LEFT JOIN orders AS o",
        "  ON o.customer_id = c.id",
        " AND o.status = 'paid'",
        "ORDER BY c.id;"
      ),
      "**Paid-order join result.** Mina has one paid and one draft order, Omar has only a draft order, and Asha has none. The `ON` condition accepts Mina's paid order. Omar has no accepted order, and Asha has no order at all, so both receive NULL order IDs. The result therefore keeps all three customers while showing only the paid match.",
      "**Predicate-placement boundaries.** 'Every customer, with a paid order if present' uses the right-side status rule in `ON`; 'only customers with a paid order' can use a `WHERE` rule or an inner join. A left-table condition in `ON` does not filter preserved left rows, which surprises people who move it there. NULL-aware predicates such as `WHERE o.id IS NULL` are intentionally useful for anti-joins, so no single placement rule fits every condition."
    ),
    followups: [
      "Why does `WHERE o.status = 'paid'` remove an unmatched left row?",
      "How would you return only customers with no paid orders?",
      "Does the same predicate-placement difference usually affect an inner join result?",
    ],
  },
  {
    topic: "joins-inner-outer-left",
    slug: "sql-full-outer-join-and-portable-emulation",
    question: "What does a `FULL OUTER JOIN` return, and how can you emulate it when an engine does not support it?",
    title: "FULL OUTER JOIN and Portable Emulation",
    direct: "A `FULL OUTER JOIN` returns matching pairs plus unmatched rows from both inputs, filling the missing side with `NULL`. PostgreSQL and modern SQLite support the syntax, while some engines such as MySQL do not. A portable emulation combines a left join with the opposite-side unmatched rows using `UNION ALL`.",
    quick: [
      "A full outer join preserves unmatched rows from both inputs.",
      "Matched pairs appear once per matching pair; unmatched columns become NULL.",
      "PostgreSQL and SQLite 3.39 or later support native `FULL OUTER JOIN`.",
      "Support is not universal; MySQL does not provide native full outer join syntax.",
      "A safe emulation uses one left join plus an anti-matched second left join with `UNION ALL`.",
    ],
    intent: {
      testing: "Whether full row preservation and a duplicate-safe portable emulation are understood.",
      common_mistake: "Using two unrestricted left joins with `UNION ALL` and duplicating the rows that matched in both halves.",
      to_stand_out: "Explain why the second branch contains only right-side rows that found no left match.",
    },
    speaking: prose(
      "A `FULL OUTER JOIN` combines the preservation rules of left and right outer joins. Every pair satisfying the join condition appears. A left row with no partner still appears with NULL in right-side columns, and a right row with no partner appears with NULL in left-side columns. With one-to-many data, it still returns every matching pair, not one summary row per key.",
      "Native support varies. PostgreSQL supports full outer joins, and SQLite added right and full outer joins in version 3.39. Some widely used systems, including MySQL, do not support the native form. When code must cross engines, check the target rather than assuming that all SQL syntax is universal.",
      "The usual emulation has two branches. The first is `left_table LEFT JOIN right_table`, which returns all matches and all unmatched left rows. The second reverses the inputs with another left join but keeps only rows where the original left key is NULL. That anti-match condition contributes unmatched right rows without repeating the already returned matches. `UNION ALL` is then correct because the branches are intentionally disjoint.",
      "For example, if team 1 has no project, team 2 has project 20, and project 30 refers to no listed team, the result contains team 1 with a NULL project, the team 2 match, and project 30 with NULL team columns.",
      sqlExample(
        "SELECT t.id AS team_id, p.id AS project_id",
        "FROM teams AS t",
        "FULL OUTER JOIN projects AS p ON p.team_id = t.id;"
      ),
      "A bare `UNION` can hide an emulation mistake by removing duplicate result rows and can also add distinct-processing work. I use native syntax when the supported database makes it clearer. Otherwise, I document and test the two-branch emulation, especially nullable join keys and duplicate matches."
    ),
    deepTitle: "Full outer join and emulation",
    deep: prose(
      "**Full row preservation.** A full outer join keeps every matching pair and also keeps rows that have no partner on either side. Columns belonging to an absent partner are represented as NULL in the combined result.",
      "**Two-branch emulation.** Native `FULL OUTER JOIN` performs one matching operation with two preservation rules. For an emulation, the first left join produces all matches plus unmatched rows from the original left table. A second left join reverses the inputs and filters to rows where the original left key is NULL. That filter makes the second branch an anti-match containing only previously missing right rows. Because the two branches no longer overlap, `UNION ALL` can concatenate them without distinct removal.",
      table(
        "| Engine | Native `FULL OUTER JOIN` | Portable choice |",
        "|---|---|---|",
        "| PostgreSQL 18 | yes | native syntax is clear |",
        "| SQLite 3.39+ | yes | native or tested emulation |",
        "| MySQL 8.x | no | two disjoint outer-join branches |",
        "| unknown target | verify first | emulation avoids assuming support |"
      ),
      sql(
        [[1, "Red", null], [2, "Blue", 20], [null, null, 30]],
        "CREATE TABLE teams (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE projects (id INTEGER PRIMARY KEY, team_id INTEGER);",
        "INSERT INTO teams VALUES (1, 'Red'), (2, 'Blue');",
        "INSERT INTO projects VALUES (20, 2), (30, 3);",
        "SELECT team_id, team_name, project_id",
        "FROM (",
        "    SELECT t.id AS team_id, t.name AS team_name, p.id AS project_id",
        "    FROM teams AS t",
        "    LEFT JOIN projects AS p ON p.team_id = t.id",
        "    UNION ALL",
        "    SELECT t.id, t.name, p.id",
        "    FROM projects AS p",
        "    LEFT JOIN teams AS t ON t.id = p.team_id",
        "    WHERE t.id IS NULL",
        ") AS full_result",
        "ORDER BY CASE WHEN team_id IS NULL THEN 1 ELSE 0 END, team_id, project_id;"
      ),
      "**Team-project result.** Team Red has no project, so the first branch retains Red with a NULL project. Team Blue matches project 20. Project 30 points to an absent team, so only the reversed anti-match branch returns it. Project 20 is not repeated there because its joined team ID is non-NULL.",
      "**Engine and nullable-key boundaries.** PostgreSQL and SQLite 3.39 or later support native full outer joins, but support is not universal; MySQL has no native form. An emulation must choose a reliable non-NULL key for the anti-match test. Nullable join keys, duplicate keys, and many-to-many matches deserve explicit examples because they change row counts. Do not replace `UNION ALL` with `UNION` merely to hide accidental duplicates: fix the overlap rule, preserve legitimate duplicate rows, and test the target engine."
    ),
    followups: [
      "Why should the second emulation branch contain only unmatched right rows?",
      "Why is `UNION ALL` preferable once the branches are disjoint?",
      "Which current PostgreSQL and SQLite versions support native full outer joins?",
    ],
  },
  {
    topic: "group-by-and-having",
    slug: "sql-group-by-how-it-works",
    question: "How does `GROUP BY` work in SQL?",
    title: "How SQL GROUP BY Works",
    direct: "`GROUP BY` collects input rows that share the same grouping values and produces one result row per group when used with aggregates. Aggregate functions then summarize each group. In portable SQL, selected expressions should either identify the group or be calculated from the group's rows with an aggregate.",
    quick: [
      "`WHERE` first chooses the input rows that can enter groups.",
      "Rows with the same grouping key belong to one group.",
      "Each aggregate is calculated independently for that group.",
      "The result normally has one row per distinct grouping key.",
      "Select grouped columns or aggregate expressions; do not rely on an arbitrary ungrouped value.",
    ],
    intent: {
      testing: "Whether grouping is understood as partitioning rows before aggregation rather than merely removing duplicates.",
      common_mistake: "Selecting an ungrouped, non-aggregated column and assuming the database will choose a meaningful row's value.",
      to_stand_out: "Name the grouping key, predict the number of groups, and distinguish input-row filtering from group filtering.",
    },
    speaking: prose(
      "`GROUP BY` partitions a query's input rows according to one or more expressions. Rows whose grouping expressions are equal belong to the same group. Aggregate functions such as `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX` then calculate one value for each group, so the output normally contains one row per distinct grouping key.",
      "For example, `GROUP BY region` creates an east group and a west group from sales rows. `COUNT(*)` reports how many rows entered each group, while `SUM(amount)` adds that group's non-NULL amounts. Both aggregates read the same group but answer different questions. If there is no `GROUP BY`, an aggregate query treats all qualifying input rows as one group.",
      sqlExample(
        "SELECT region, COUNT(*) AS sale_count, SUM(amount) AS total",
        "FROM sales",
        "GROUP BY region",
        "ORDER BY region;"
      ),
      "In portable SQL, every selected expression should either be a grouping expression or be derived from group rows through an aggregate. Selecting `region, salesperson, SUM(amount)` while grouping only by region leaves no single salesperson value that represents the whole region. PostgreSQL generally rejects that unless a recognized functional dependency makes the value determined by the group. SQLite permits many bare columns and may choose a value from one contributing row, so relying on that permissive behavior makes the query unclear and non-portable.",
      "Grouping is not the same as ordering; add `ORDER BY` when result order matters. It is also not a substitute for `DISTINCT`: grouping is appropriate when the query computes per-group results, while `DISTINCT` removes duplicate result rows. I describe the required grain first—such as one row per region—then make that grain the group key and verify that every selected column is valid at that grain."
    ),
    deepTitle: "GROUP BY result grain",
    deep: prose(
      "**Grouping and grain.** `GROUP BY` partitions qualifying input rows into buckets whose grouping expressions are equal. In an aggregate query, each bucket becomes one output row, so the grouping key defines the result's grain.",
      "**Per-group aggregation.** Rows pass through joins and `WHERE`. SQL computes the grouping expression for each survivor and places equal keys together. Every aggregate then reads the rows in one bucket: `COUNT(*)` counts them, while `SUM(amount)` adds that bucket's non-NULL amounts. The selected grouping key labels the summary row. Adding another aggregate adds information about each bucket; it does not create another bucket. Selecting an unrelated, non-aggregated column is ambiguous because several input values may exist at the same grain.",
      mermaid(
        "flowchart LR",
        "  R[input sales rows] --> K[compute region key for each row]",
        "  K --> E[east group]",
        "  K --> W[west group]",
        "  E --> EA[count and sum east rows]",
        "  W --> WA[count and sum west rows]",
        "  EA --> O[one output row per region]",
        "  WA --> O"
      ),
      sql(
        [["east", 3, 45], ["west", 2, 15]],
        "CREATE TABLE sales (id INTEGER PRIMARY KEY, region TEXT NOT NULL, amount INTEGER);",
        "INSERT INTO sales VALUES",
        "    (1, 'east', 10), (2, 'east', 15), (3, 'east', 20),",
        "    (4, 'west', 8), (5, 'west', 7);",
        "SELECT region, COUNT(*) AS sale_count, SUM(amount) AS total_amount",
        "FROM sales",
        "GROUP BY region",
        "ORDER BY region;"
      ),
      "**Regional sales summary.** Five sales rows contain three east amounts and two west amounts. Grouping by region creates exactly two buckets. The east bucket produces a count of three and total of 45; the west bucket produces two and 15. `ORDER BY region` controls only their display order.",
      "**Portable grouping rules.** Grouping is not sorting, and it is not simply duplicate removal. A query without `GROUP BY` but with aggregates treats all qualifying rows as one group. NULL grouping keys are normally collected together, even though ordinary equality with NULL is unknown. PostgreSQL enforces standard grouping rules except for proven functional dependencies; SQLite permits bare selected columns in cases that are not portable. Write each output expression at the declared grain, and add a separate order when readers need predictable rows."
    ),
    followups: [
      "What happens when an aggregate query has no `GROUP BY`?",
      "Why is an ungrouped salesperson column ambiguous in a result grouped by region?",
      "How is `GROUP BY` different from `DISTINCT`?",
    ],
  },
  {
    topic: "group-by-and-having",
    slug: "sql-where-vs-having",
    question: "When should you use `WHERE` and when should you use `HAVING` in SQL?",
    title: "WHERE vs HAVING in SQL",
    direct: "`WHERE` filters individual source rows before grouping, so it cannot filter a group aggregate that does not exist yet. `HAVING` filters groups after `GROUP BY` and can test expressions such as `SUM(amount)` or `COUNT(*)`. Use each clause at the stage that matches the requirement.",
    quick: [
      "`WHERE` decides which source rows enter the grouping stage.",
      "`HAVING` decides which completed groups remain in the result.",
      "Row conditions such as `status = 'paid'` normally belong in `WHERE`.",
      "Aggregate conditions such as `SUM(amount) >= 100` belong in `HAVING`.",
      "Moving a condition between the clauses can change both aggregate values and returned groups.",
    ],
    intent: {
      testing: "Whether row-level and group-level filtering are placed at their correct logical stages.",
      common_mistake: "Putting an aggregate in `WHERE` or using `HAVING` for every condition without noticing that unwanted rows entered the aggregates.",
      to_stand_out: "Translate the query into 'which rows count' followed by 'which group totals qualify.'",
    },
    speaking: prose(
      "`WHERE` and `HAVING` both filter data, but they act on different units. `WHERE` evaluates each row produced by `FROM` and joins. Rows that fail never reach `GROUP BY`, so they do not contribute to `COUNT`, `SUM`, or another aggregate. `HAVING` runs after groups and their aggregate values have been formed, so it can keep or remove whole groups.",
      "Suppose the requirement is 'customers whose paid orders total at least 100.' The row rule `status = 'paid'` belongs in `WHERE`; draft and cancelled orders must not enter the total. The group rule `SUM(amount) >= 100` belongs in `HAVING` because it can be known only after paid rows are grouped by customer.",
      sqlExample(
        "SELECT customer_id, SUM(amount) AS paid_total",
        "FROM orders",
        "WHERE status = 'paid'",
        "GROUP BY customer_id",
        "HAVING SUM(amount) >= 100;"
      ),
      "Putting `SUM(amount) >= 100` in `WHERE` is invalid in a normal grouped query because the sum does not exist at that stage. Moving `status = 'paid'` to `HAVING` is also not an equivalent fix: depending on the engine and expression, it may be rejected or may inspect an arbitrary group value, while non-paid rows have already affected the aggregate.",
      "A database may allow `HAVING` without an explicit `GROUP BY`, treating qualifying input as one group, and some engines allow output aliases in `HAVING`; those details vary. The portable and readable form repeats or clearly expresses the aggregate condition. Filtering early with `WHERE` can also reduce work, but correctness is the first reason for placement. I separate the question into two statements: which individual rows are eligible, and which aggregate groups meet the final rule."
    ),
    deepTitle: "WHERE and HAVING stages",
    deep: prose(
      "**Row and group filters.** `WHERE` is a row filter, while `HAVING` is a group filter. `WHERE` controls the raw rows allowed to contribute to a summary; `HAVING` decides which completed summaries are returned.",
      "**Filtering pipeline.** After `FROM` and joins produce source rows, `WHERE` evaluates each one. Only true rows reach `GROUP BY`. SQL then forms groups and calculates aggregate expressions such as `SUM(amount)`. `HAVING` can evaluate those group-level values because they now exist. This two-stage model prevents a common mistake: an aggregate cannot normally appear in `WHERE`, and a row category placed too late may already have changed the aggregate being tested.",
      mermaid(
        "flowchart LR",
        "  O[all order rows] --> W[WHERE keeps paid rows]",
        "  W --> G[GROUP BY creates one customer bucket]",
        "  G --> S[SUM calculates each paid total]",
        "  S --> H[HAVING keeps totals at least 100]",
        "  H --> R[ORDER BY sorts retained customers]"
      ),
      sql(
        [[3, 120], [1, 110]],
        "CREATE TABLE orders (",
        "    id INTEGER PRIMARY KEY,",
        "    customer_id INTEGER NOT NULL,",
        "    status TEXT NOT NULL,",
        "    amount INTEGER NOT NULL",
        ");",
        "INSERT INTO orders VALUES",
        "    (1, 1, 'paid', 60), (2, 1, 'paid', 50), (3, 1, 'draft', 500),",
        "    (4, 2, 'paid', 80), (5, 3, 'paid', 120);",
        "SELECT customer_id, SUM(amount) AS paid_total",
        "FROM orders",
        "WHERE status = 'paid'",
        "GROUP BY customer_id",
        "HAVING SUM(amount) >= 100",
        "ORDER BY paid_total DESC, customer_id;"
      ),
      "**Paid-order totals.** Customer 1 has paid orders of 60 and 50 plus a draft of 500. The row filter removes that draft before summing, so the paid total is 110 rather than 610. Customer totals become 110, 80, and 120. `HAVING` keeps only totals of at least 100, returning customers 3 and 1 in descending order.",
      "**HAVING portability.** Some engines accept `HAVING` without an explicit `GROUP BY`, and alias visibility in `HAVING` varies. Those extensions should not replace clear, portable clause placement. A non-aggregate condition can sometimes be moved for optimization, but it may change meaning when groups, outer joins, or NULL are involved. Separate the two requirements: which individual events count, and which finished groups qualify. A test row with a large excluded value exposes incorrect placement clearly."
    ),
    followups: [
      "Why can `WHERE` not normally contain `COUNT(*) > 2`?",
      "How would moving the paid-status condition after grouping change the logic?",
      "Can an aggregate query use `HAVING` without an explicit `GROUP BY`?",
    ],
  },
  {
    topic: "group-by-and-having",
    slug: "sql-group-by-multiple-columns",
    question: "How does `GROUP BY` work with multiple columns?",
    title: "GROUP BY with Multiple Columns",
    direct: "With multiple grouping expressions, SQL creates one group for each distinct combination of their values. `GROUP BY region, category` therefore returns one row per region-category pair, not one row per region plus one per category. The selected non-aggregate columns should match that result grain.",
    quick: [
      "Multiple columns form one composite grouping key.",
      "A new group is created for each distinct value combination.",
      "`GROUP BY region, category` has a finer grain than grouping by region alone.",
      "Every selected non-aggregate expression must be valid at that composite grain.",
      "Add `ORDER BY` separately when the groups need a predictable presentation order.",
    ],
    intent: {
      testing: "Whether multi-column grouping grain and select-list validity can be predicted from sample rows.",
      common_mistake: "Thinking each grouping column is summarized independently instead of forming one combined key.",
      to_stand_out: "Describe how adding or removing a grouping column changes result grain and therefore the meaning of every aggregate.",
    },
    speaking: prose(
      "When `GROUP BY` lists more than one expression, those values form one composite grouping key. Rows belong together only when all grouping values match. `GROUP BY region, category` therefore creates groups such as `(east, books)`, `(east, games)`, and `(west, books)` rather than producing separate region and category summaries.",
      "The number and meaning of result rows are called the result grain. Grouping only by region gives one row per region and totals all categories together. Adding category makes the grain finer: one row per region-category pair. Removing a grouping column makes it coarser. Aggregate values must always be interpreted at the chosen grain.",
      "For example, two east-book sales of 10 and 15 form one group with count 2 and total 25. An east-game sale forms another group even though the region matches, because its full composite key differs. `COUNT(*)` and `SUM(amount)` are calculated separately inside each combination.",
      sqlExample(
        "SELECT region, category, COUNT(*) AS sales, SUM(amount) AS total",
        "FROM sales",
        "GROUP BY region, category",
        "ORDER BY region, category;"
      ),
      "Portable SQL selects the grouped expressions and aggregate expressions. If the query also selects a column such as salesperson without grouping or aggregating it, there may be several candidate values in one group. PostgreSQL commonly rejects that ambiguity unless it can prove a functional dependency, while SQLite may accept a bare column and choose a value from one row. I avoid depending on that vendor behavior. If subtotals at several grains are required, separate queries with `UNION ALL` are portable; advanced engines also support `ROLLUP` or grouping sets. For a fresher query, I state 'one row per region and category,' group by exactly those columns, and order them explicitly."
    ),
    deepTitle: "Composite grouping keys",
    deep: prose(
      "**Multi-column group grain.** Multiple expressions in `GROUP BY` form one composite key. A result group represents one distinct combination, such as one region together with one product category, rather than independent summaries for each column.",
      "**Tuple grouping.** SQL evaluates every grouping expression for an input row and uses the complete tuple to find its bucket. Two rows with the same region but different categories enter different buckets. Aggregates operate inside each tuple bucket, and the output normally contains one row for every distinct tuple. Adding a key makes the grain finer and usually creates more groups. Removing a key makes the grain coarser and combines rows that were previously separate.",
      mermaid(
        "flowchart LR",
        "  R[sales rows] --> K[compute region-category tuple]",
        "  K --> EB[east and books: 10, 15]",
        "  K --> EG[east and games: 20]",
        "  K --> WB[west and books: 8, 7]",
        "  EB --> EBR[count 2; total 25]",
        "  EG --> EGR[count 1; total 20]",
        "  WB --> WBR[count 2; total 15]"
      ),
      sql(
        [["east", "books", 2, 25], ["east", "games", 1, 20], ["west", "books", 2, 15]],
        "CREATE TABLE sales (id INTEGER PRIMARY KEY, region TEXT, category TEXT, amount INTEGER);",
        "INSERT INTO sales VALUES",
        "    (1, 'east', 'books', 10), (2, 'east', 'books', 15),",
        "    (3, 'east', 'games', 20), (4, 'west', 'books', 8),",
        "    (5, 'west', 'books', 7);",
        "SELECT region, category, COUNT(*) AS sale_count, SUM(amount) AS total",
        "FROM sales",
        "GROUP BY region, category",
        "ORDER BY region, category;"
      ),
      "**Region-category summary.** The two east-book rows share the tuple `(east, books)`, so they become one group with count 2 and total 25. The east-game row has the same region but a different second value and forms its own group. Two west-book rows form the third group. Ordering by both keys makes that hierarchy readable.",
      "**Grouping-key boundaries.** A selected non-aggregate value must be determined at this composite grain. Adding `id` would make every sample row its own group and destroy the intended summary. Removing `category` would merge book and game sales inside each region. NULL values in grouping expressions need deliberate interpretation, because missing categories usually form a shared group. For several subtotal levels, use separate portable queries or verify whether the target supports grouping sets or `ROLLUP`; a normal comma-separated key does not produce subtotals automatically."
    ),
    followups: [
      "How does adding category change a result previously grouped only by region?",
      "Why is selecting an ungrouped salesperson ambiguous at this grain?",
      "How could you produce both regional totals and region-category totals portably?",
    ],
  },
  {
    topic: "aggregate-functions",
    slug: "sql-count-star-vs-column-vs-distinct",
    question: "What is the difference between `COUNT(*)`, `COUNT(column)`, and `COUNT(DISTINCT column)`?",
    title: "COUNT(*) vs COUNT(column) vs COUNT(DISTINCT)",
    direct: "`COUNT(*)` counts input rows, `COUNT(column)` counts rows where that expression is not NULL, and `COUNT(DISTINCT column)` counts distinct non-NULL values. They can return different numbers from the same table, so choose the form that matches whether the requirement concerns rows, known values, or unique known values.",
    quick: [
      "`COUNT(*)` counts every qualifying row.",
      "`COUNT(expression)` ignores rows where the expression evaluates to NULL.",
      "`COUNT(DISTINCT expression)` removes duplicates and ignores NULL.",
      "All three return zero rather than NULL when no qualifying value is counted.",
      "Count the entity's non-NULL key when a join may create NULL-extended rows.",
    ],
    intent: {
      testing: "Whether row count, non-NULL count, distinct count, and outer-join counting are distinguished.",
      common_mistake: "Using `COUNT(*)` after a left join to count children and accidentally counting the preserved parent row with no child.",
      to_stand_out: "Tie the counted expression to the business entity and show why nullable data changes the answer.",
    },
    speaking: prose(
      "The `COUNT` forms answer three different questions. `COUNT(*)` counts every input row that reaches the aggregate, regardless of NULL values in its columns. `COUNT(email)` counts only rows where the email expression is not NULL. `COUNT(DISTINCT email)` first considers non-NULL email values and counts how many different values occur.",
      "For example, four contact rows containing `a@example.com`, NULL, `a@example.com`, and `b@example.com` produce counts of 4, 3, and 2. The repeated address contributes twice to `COUNT(email)` but once to the distinct form. If no rows qualify, or every email is NULL for the expression forms, `COUNT` returns zero rather than NULL.",
      sqlExample(
        "SELECT COUNT(*), COUNT(email), COUNT(DISTINCT email)",
        "FROM contacts;"
      ),
      "This distinction is especially important after an outer join. If every customer is left-joined to orders and a customer has no order, the join still creates one NULL-extended row. `COUNT(*)` reports one result row for that customer, but `COUNT(o.id)` reports zero orders because the order key is NULL. Counting a non-NULL child key expresses the intended entity count.",
      "`COUNT(DISTINCT ...)` may require extra work to track seen values, and support for distinct tuples or multiple expressions differs by engine. PostgreSQL and SQLite both support one distinct expression in the basic form used here. I do not choose among these by habit: I say whether I am counting rows, present values, or unique present values, then select an expression whose NULL behavior matches that definition."
    ),
    deepTitle: "COUNT input rules",
    deep: prose(
      "**Counting units.** `COUNT` returns how many inputs satisfy its own inclusion rule. `COUNT(*)` counts rows. `COUNT(column)` counts known values from that expression. Adding `DISTINCT` changes the unit again, from known values to different known values.",
      "**Per-aggregate inclusion.** All three aggregates can read the same filtered row set but include different inputs. NULL never removes a row from `COUNT(*)`; it removes that expression value from `COUNT(column)`. The distinct form removes NULL and then merges repeated known values. This explains the result without treating `COUNT(*)` as a count of non-NULL columns.",
      mermaid(
        "flowchart LR",
        "  I[four rows: a, NULL, a, b] --> A[COUNT star keeps all rows: 4]",
        "  I --> C[COUNT email removes NULL: 3]",
        "  I --> D[COUNT DISTINCT email removes NULL and repeated a: 2]"
      ),
      sql(
        [[4, 3, 2]],
        "CREATE TABLE contacts (id INTEGER PRIMARY KEY, email TEXT);",
        "INSERT INTO contacts VALUES",
        "    (1, 'a@example.com'),",
        "    (2, NULL),",
        "    (3, 'a@example.com'),",
        "    (4, 'b@example.com');",
        "SELECT",
        "    COUNT(*) AS row_count,",
        "    COUNT(email) AS known_email_count,",
        "    COUNT(DISTINCT email) AS unique_email_count",
        "FROM contacts;"
      ),
      "**Contact count result.** Four contact rows reach the aggregate. Three contain a known email because one row contains NULL. Those three known values contain two different addresses because `a@example.com` appears twice. The query therefore returns 4 rows, 3 known emails, and 2 unique known emails.",
      "**Outer-join and DISTINCT boundaries.** After a left join, an unmatched parent still produces one result row. `COUNT(*)` counts it, while `COUNT(child.id)` returns zero when the child key is NULL. That difference is often the correct way to count children. `COUNT(DISTINCT ...)` may need extra memory or sorting, and syntax for multiple expressions differs by engine. Define the business unit first—rows, present values, or unique present values—then count an expression that represents it."
    ),
    followups: [
      "Why can `COUNT(*)` give the wrong child count after a left join?",
      "What does each count return when the input relation has no rows?",
      "Why might `COUNT(DISTINCT column)` cost more than `COUNT(column)`?",
    ],
  },
  {
    topic: "aggregate-functions",
    slug: "sql-sum-avg-null-and-coalesce",
    question: "How do `SUM` and `AVG` handle `NULL`, and when should you use `COALESCE`?",
    title: "SUM, AVG, NULL, and COALESCE",
    direct: "`SUM(expression)` and `AVG(expression)` ignore NULL inputs. If no non-NULL value remains, both return NULL rather than zero. Use `COALESCE` only when the application's meaning defines a replacement, such as displaying zero total sales for an empty set; replacing an unknown average with zero may be misleading.",
    quick: [
      "`SUM` and `AVG` skip NULL expression values.",
      "`AVG` divides by the number of non-NULL inputs, not by all rows.",
      "With no non-NULL inputs, `SUM` and `AVG` return NULL.",
      "`COALESCE(value, fallback)` returns the first non-NULL argument.",
      "Choose a fallback from business meaning; do not erase missingness automatically.",
    ],
    intent: {
      testing: "Whether aggregate NULL rules and the semantic cost of replacing NULL are understood.",
      common_mistake: "Dividing by all rows when explaining `AVG`, or claiming an empty sum universally returns zero.",
      to_stand_out: "Distinguish 'no values' from a real total or average of zero before applying `COALESCE`.",
    },
    speaking: prose(
      "Most numeric SQL aggregates ignore NULL inputs. `SUM(amount)` adds the known amounts, and `AVG(amount)` adds those same non-NULL values and divides by their non-NULL count. A row whose amount is NULL does not contribute zero; it contributes no numeric input at all. That difference matters whenever missing and zero mean different things.",
      "For example, paid invoice amounts 40, NULL, and 60 produce a sum of 100 and an average of 50, not about 33.3. The average uses two known amounts. If a filter selects no rows, or every selected amount is NULL, PostgreSQL and SQLite return NULL for both `SUM` and `AVG`. `COUNT` is the common exception that returns zero.",
      sqlExample(
        "SELECT SUM(amount) AS total, AVG(amount) AS average",
        "FROM invoices",
        "WHERE status = 'paid';"
      ),
      "`COALESCE(SUM(amount), 0)` is appropriate when the report defines an absent total as zero—for example, no cancelled invoices means cancelled revenue of zero. `COALESCE(AVG(score), 0)` is more questionable because 'nobody has a score' is not the same observation as an average score of zero. The UI or API may need to preserve NULL as 'not available.'",
      "Return types and overflow behavior can vary by engine and input type. SQLite also offers a non-standard `total()` function that returns `0.0` for no input, while portable code uses `SUM` plus an explicit fallback. I state which rows qualify, which NULLs are ignored, and what an empty aggregate should mean for the product. Then I apply `COALESCE` at the boundary where that meaning is required rather than hiding missing data by default."
    ),
    deepTitle: "NULL-aware numeric aggregates",
    deep: prose(
      "**Aggregate NULL inputs.** `SUM` and `AVG` work only with their non-NULL input values. A missing amount is left out; it is not silently changed to zero. `AVG` therefore divides the sum by the number of known amounts.",
      "**SUM, AVG, and COALESCE.** With values 40, NULL, and 60, `SUM` adds 40 and 60, while `AVG` divides 100 by two. If no known value reaches either aggregate, its result is NULL. `COALESCE` can replace that final NULL with a chosen fallback, but the replacement belongs to the product's meaning rather than to the aggregate rule.",
      mermaid(
        "flowchart LR",
        "  R[amounts 40, NULL, 60] --> F[remove NULL aggregate inputs]",
        "  F --> K[known amounts 40 and 60]",
        "  K --> S[SUM equals 100]",
        "  K --> A[AVG equals 100 divided by 2]",
        "  E[no known values] --> N[SUM and AVG return NULL]",
        "  N --> C[COALESCE only if zero has business meaning]"
      ),
      sql(
        [[100, 50.0, null, 0]],
        "CREATE TABLE invoices (id INTEGER PRIMARY KEY, status TEXT NOT NULL, amount INTEGER);",
        "INSERT INTO invoices VALUES",
        "    (1, 'paid', 40), (2, 'paid', NULL), (3, 'paid', 60),",
        "    (4, 'draft', NULL);",
        "SELECT",
        "    SUM(CASE WHEN status = 'paid' THEN amount END) AS paid_sum,",
        "    AVG(CASE WHEN status = 'paid' THEN amount END) AS paid_average,",
        "    SUM(CASE WHEN status = 'cancelled' THEN amount END) AS cancelled_sum,",
        "    COALESCE(SUM(CASE WHEN status = 'cancelled' THEN amount END), 0) AS displayed_cancelled_sum",
        "FROM invoices;"
      ),
      "**Invoice aggregate result.** The paid rows contain amounts 40, NULL, and 60. Their sum is 100 and their average is 50. No cancelled row exists, so the raw cancelled sum is NULL. The next column wraps the same expression in `COALESCE(..., 0)` and displays zero, making the choice visible instead of hiding it.",
      "**Empty-set meaning.** A total of zero can mean no revenue, so a zero fallback may fit a report. An average of zero means measured values existed and averaged to zero; it is not the same as no measurements. PostgreSQL and SQLite both follow the NULL behavior shown, but numeric result types and overflow behavior differ. SQLite's `total()` is a non-standard alternative that returns `0.0`; portable SQL uses `SUM` and an explicit, justified fallback."
    ),
    followups: [
      "Why is the average of 40, NULL, and 60 equal to 50?",
      "What do `SUM` and `COUNT` return for an empty input set?",
      "When would `COALESCE(AVG(score), 0)` communicate the wrong meaning?",
    ],
  },
  {
    topic: "aggregate-functions",
    slug: "sql-conditional-aggregation-with-case",
    question: "How do you calculate several conditional totals in one SQL query?",
    title: "Conditional Aggregation with CASE",
    direct: "Place a `CASE` expression inside an aggregate so each row contributes a value only when its condition matches. For portable SQL, `SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)` counts paid rows, while another expression can count pending rows or sum paid amounts in the same grouped scan.",
    quick: [
      "`CASE` maps each input row to the value an aggregate should receive.",
      "Use `THEN 1 ELSE 0` inside `SUM` for a portable conditional count.",
      "Use `THEN amount ELSE 0` for a conditional total.",
      "Several conditional aggregates can share one grouping query.",
      "The `FILTER` aggregate clause is clearer in supporting engines but is not universal.",
    ],
    intent: {
      testing: "Whether CASE semantics, grouping, and multiple metrics can be combined without repeated queries.",
      common_mistake: "Omitting `ELSE 0` for a count and then misunderstanding the NULL result for a group with no matching row.",
      to_stand_out: "Explain the per-row contribution before discussing the final aggregate and mention the optional `FILTER` syntax boundary.",
    },
    speaking: prose(
      "Conditional aggregation calculates a metric from only the rows matching a condition while other rows remain available to the same group. A `CASE` expression runs for each input row and returns the value that the surrounding aggregate should receive. This lets one grouped query produce several related counts or totals.",
      "A portable paid-order count is `SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)`. Every paid row contributes one and every other row contributes zero. For paid revenue, the true branch returns `amount` instead. A second CASE can count pending orders in the same `GROUP BY customer_id` query.",
      "For example, customer 1 with one paid and one pending order produces paid count 1, pending count 1, and paid amount 50. Customer 2 with two paid orders produces 2, 0, and 100. The `ELSE 0` makes the zero-match case explicit. If it were omitted, CASE would return NULL for nonmatches; `SUM` ignores those values and a group with no match could produce NULL rather than zero.",
      sqlExample(
        "SELECT customer_id,",
        "       SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count,",
        "       SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_amount",
        "FROM orders",
        "GROUP BY customer_id;"
      ),
      "PostgreSQL and current SQLite also support aggregate `FILTER`, such as `COUNT(*) FILTER (WHERE status = 'paid')`, which can be easier to read. CASE remains useful when portability to engines without `FILTER` matters or when the contribution is more complex than row inclusion. Conditions duplicated across many reports can still become hard to maintain, so important business categories may belong in a view or tested reporting layer. I describe each row's contribution, include the zero case deliberately, and verify totals against a small hand-worked group."
    ),
    deepTitle: "Conditional aggregate contributions",
    deep: prose(
      "**CASE contributions.** Conditional aggregation lets each input row contribute a different value to an aggregate. A `CASE` expression produces that per-row value, and `SUM`, `COUNT`, or another aggregate combines the contributions inside each group.",
      "**Per-row conditional aggregation.** For a paid count, a paid row becomes 1 and every other row becomes 0. For paid revenue, a paid row becomes its amount and another status becomes 0. Several `CASE` expressions can use the same orders and grouping key, which produces related metrics in one clear result. The `ELSE` branch controls what a nonmatch contributes.",
      mermaid(
        "flowchart LR",
        "  R[one order row] --> C{status}",
        "  C -- paid --> P[paid count 1; pending count 0; paid amount equals amount]",
        "  C -- pending --> N[paid count 0; pending count 1; paid amount 0]",
        "  P --> S[SUM contributions per customer]",
        "  N --> S"
      ),
      sql(
        [[1, 1, 1, 50], [2, 2, 0, 100]],
        "CREATE TABLE orders (",
        "    id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL,",
        "    status TEXT NOT NULL, amount INTEGER NOT NULL",
        ");",
        "INSERT INTO orders VALUES",
        "    (1, 1, 'paid', 50), (2, 1, 'pending', 30),",
        "    (3, 2, 'paid', 40), (4, 2, 'paid', 60);",
        "SELECT customer_id,",
        "       SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count,",
        "       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,",
        "       SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_amount",
        "FROM orders",
        "GROUP BY customer_id",
        "ORDER BY customer_id;"
      ),
      "**Customer order metrics.** Customer 1 contributes one paid count, one pending count, and 50 paid amount. Customer 2 contributes two paid counts, no pending count, and 100 paid amount. Summing the contribution columns gives exactly the two output rows shown by the query.",
      "**CASE and FILTER boundaries.** Omitting `ELSE 0` makes nonmatches NULL. `SUM` ignores them, so a group with no match can return NULL rather than zero. PostgreSQL and current SQLite also support `COUNT(*) FILTER (WHERE status = 'paid')`, which can read more directly, but `FILTER` is not available in every database. CASE is a portable choice and is also useful when the contribution is an amount rather than simple inclusion. Repeated business rules still need shared tests or a view so reports do not drift."
    ),
    followups: [
      "What changes if the count CASE omits `ELSE 0`?",
      "How would the same paid count look with the `FILTER` clause?",
      "When should repeated conditional metrics move into a view or reporting model?",
    ],
  },
  {
    topic: "subqueries-basics",
    slug: "sql-subquery-types-and-results",
    question: "What is a subquery, and where can a subquery be used in SQL?",
    title: "SQL Subquery Types and Result Shapes",
    direct: "A subquery is a `SELECT` nested inside another SQL statement. Its location determines the required result shape: a scalar subquery supplies one value, an `IN` or comparison subquery supplies values, `EXISTS` answers whether a row exists, and a subquery in `FROM` supplies a derived table.",
    quick: [
      "A scalar subquery must produce one column and at most one row for portable behavior.",
      "`IN (subquery)` compares against the subquery's one-column result set.",
      "`EXISTS (subquery)` tests whether at least one row is produced.",
      "A subquery in `FROM` acts as a table and should receive an alias.",
      "The optimizer may transform a subquery; do not assume a literal execution sequence.",
    ],
    intent: {
      testing: "Whether the required shape and meaning of each common subquery position are understood.",
      common_mistake: "Using a multi-row result where one scalar value is required or describing every nested query as running first exactly once.",
      to_stand_out: "Name the expected result shape and separate logical dependence from the optimizer's physical plan.",
    },
    speaking: prose(
      "A subquery is a `SELECT` statement nested inside another statement. It is not one single pattern: the surrounding syntax determines what shape the nested result must have. A scalar subquery appears where one value is expected, while a derived-table subquery appears in `FROM` and supplies rows and columns like a temporary query result.",
      "`IN (subquery)` expects one comparison column and asks whether a value matches any returned value. `EXISTS (subquery)` asks only whether the nested query can produce at least one row; its selected columns do not affect that Boolean answer. A derived table should have an alias for portable, readable SQL.",
      "For example, `salary > (SELECT AVG(salary) FROM employees)` uses an uncorrelated scalar subquery. The aggregate always produces one row, so it safely supplies one average. Employees above that value are then returned. If a supposed scalar subquery produces several rows, PostgreSQL raises an error; SQLite historically takes the first row. Relying on SQLite's behavior is not portable, so the query should guarantee one row deliberately.",
      sqlExample(
        "SELECT name, salary",
        "FROM employees",
        "WHERE salary > (SELECT AVG(salary) FROM employees);"
      ),
      "It is useful to reason as if the uncorrelated average is available to the outer comparison, but the optimizer controls the physical plan. It may calculate, cache, flatten, or transform nested operations while preserving semantics. I choose a subquery when it expresses one logical input clearly, state whether it returns one value, a membership set, an existence answer, or a table, and test empty and multi-row boundaries."
    ),
    deepTitle: "Subquery result shapes",
    deep: prose(
      "**Subquery shape contracts.** A subquery is a complete query used as an input to another query. The outer syntax gives that input a contract. It may need one cell, one column of candidate values, a yes-or-no existence result, or a rectangular derived table.",
      "**Context-specific evaluation.** SQL checks the nested result according to its context. Scalar comparison needs at most one row, `IN` compares one value with a one-column set, `EXISTS` cares only whether a row exists, and `FROM` exposes named columns to later clauses. This is a logical interpretation; optimization can rearrange the work.",
      table(
        "| Subquery position | Required shape | Typical purpose |",
        "|---|---|---|",
        "| `(SELECT AVG(...))` in an expression | one value | compare with a summary |",
        "| `IN (SELECT id ...)` | one column | membership |",
        "| `EXISTS (SELECT 1 ...)` | zero or more rows | existence |",
        "| `FROM (SELECT ...) AS x` | table-shaped | query an intermediate result |"
      ),
      "**Salary comparison query.** Three salaries—90, 70, and 40—have an average of about 66.7. The scalar aggregate supplies that one number, so Mina and Omar pass the outer greater-than comparison. The output is ordered only for a predictable display; ordering does not change the average.",
      sql(
        [["Mina", 90], ["Omar", 70]],
        "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary INTEGER NOT NULL);",
        "INSERT INTO employees VALUES (1, 'Mina', 90), (2, 'Omar', 70), (3, 'Lee', 40);",
        "SELECT name, salary",
        "FROM employees",
        "WHERE salary > (SELECT AVG(salary) FROM employees)",
        "ORDER BY salary DESC, name;"
      ),
      "**Scalar cardinality boundaries.** Empty scalar subqueries yield NULL, so an ordinary comparison becomes unknown. A multi-row scalar result is an error in PostgreSQL but not in every engine. Guarantee cardinality with an aggregate or unique condition instead of adding an arbitrary `LIMIT 1`. Give derived tables aliases, and do not assume textual nesting fixes the physical evaluation order."
    ),
    followups: [
      "What happens when a scalar subquery returns no row or several rows?",
      "Why does the selected value inside `EXISTS` usually not matter?",
      "When is a subquery in `FROM` called a derived table?",
    ],
  },
  {
    topic: "subqueries-basics",
    slug: "sql-correlated-vs-uncorrelated-subquery",
    question: "What is the difference between a correlated and an uncorrelated subquery?",
    title: "Correlated vs Uncorrelated Subqueries",
    direct: "An uncorrelated subquery can run logically without values from the outer row. A correlated subquery references an outer query column, so its logical result depends on the current outer row. That dependence can be useful for per-row comparisons, although an optimizer may rewrite or decorrelate it rather than literally rerunning it row by row.",
    quick: [
      "An uncorrelated subquery has no reference to the outer query.",
      "A correlated subquery refers to one or more columns from the current outer row.",
      "Correlation expresses per-row logic such as comparing an order with that customer's average.",
      "Do not claim it always executes once per outer row; optimizers may transform it.",
      "Indexes on correlated lookup columns can matter, but the actual plan must be measured.",
    ],
    intent: {
      testing: "Whether logical dependency is distinguished from a simplistic claim about physical repeated execution.",
      common_mistake: "Calling every nested query correlated or stating that correlation always forces one complete inner scan per outer row.",
      to_stand_out: "Point out the outer reference and discuss equivalent joins or window functions only after preserving semantics.",
    },
    speaking: prose(
      "An uncorrelated subquery is self-contained: it does not refer to a column from the surrounding query. A company-wide average salary is one example. Logically, that result is the same for every outer row. A correlated subquery contains an outer reference, so its meaning changes with the current outer candidate.",
      "For example, an order query can compare each order's amount with `SELECT AVG(other.amount) FROM orders other WHERE other.customer_id = current.customer_id`. The `current.customer_id` reference creates the correlation. Customer 1's orders are compared with customer 1's average, while customer 2's orders use a different average.",
      sqlExample(
        "SELECT current.id, current.amount",
        "FROM orders AS current",
        "WHERE current.amount > (",
        "  SELECT AVG(other.amount) FROM orders AS other",
        "  WHERE other.customer_id = current.customer_id",
        ");"
      ),
      "It is common to explain the logical model as evaluating the correlated condition for each outer row, but that must not be turned into a universal performance claim. PostgreSQL and SQLite optimizers can sometimes decorrelate, cache, or otherwise transform a query. Other correlated shapes really may require repeated work. The execution plan and data distribution decide the cost.",
      "A join, grouped subquery, or window function can sometimes express the same result more efficiently or clearly, but rewrites must preserve duplicates and NULL behavior. `EXISTS` is often natural for correlated existence tests because it communicates that only a match matters. I identify correlation by the outer reference, explain the per-row business rule, then inspect `EXPLAIN` and compare a tested equivalent rather than declaring all correlated subqueries slow."
    ),
    deepTitle: "Correlated subquery data flow",
    deep: prose(
      "**Outer-row dependency.** Correlation is a dependency between query levels. The inner query reads a value supplied by the current outer row. Without that reference, the inner result is independent and is described as uncorrelated.",
      "**Per-customer evaluation.** For each logical outer candidate, substitute its referenced key into the nested condition. The inner aggregate then describes the matching group for that candidate. The database is free to implement the same meaning with a transformed plan, so correlation defines semantics rather than a guaranteed loop algorithm.",
      mermaid(
        "flowchart LR",
        "  O[read current order] --> K[pass its customer id]",
        "  K --> A[average orders for that customer]",
        "  A --> C{current amount above customer average?}",
        "  C -- yes --> R[keep order]",
        "  C -- no --> N[discard order]"
      ),
      "**Above-average orders.** Customer 1 has orders of 50 and 80, so the personal average is 65 and only order 2 qualifies. Customer 2 has 20 and 100, so the average is 60 and only order 4 qualifies. A global average would answer a different question.",
      sql(
        [[2, 1, 80], [4, 2, 100]],
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, amount INTEGER NOT NULL);",
        "INSERT INTO orders VALUES (1, 1, 50), (2, 1, 80), (3, 2, 20), (4, 2, 100);",
        "SELECT current.id, current.customer_id, current.amount",
        "FROM orders AS current",
        "WHERE current.amount > (",
        "    SELECT AVG(other.amount)",
        "    FROM orders AS other",
        "    WHERE other.customer_id = current.customer_id",
        ")",
        "ORDER BY current.id;"
      ),
      "**Optimizer and rewrite boundaries.** A missing correlated match can make a scalar aggregate NULL, and comparisons with it become unknown. Rewriting as a join may multiply rows unless the nested side is reduced to one row per key. Index usefulness and evaluation strategy differ by engine and statistics, so validate result equivalence first and performance second."
    ),
    followups: [
      "Which outer reference makes the example correlated?",
      "Can an optimizer avoid literally executing the nested query once per outer row?",
      "How might a grouped derived table rewrite this query without changing its grain?",
    ],
  },
  {
    topic: "subqueries-basics",
    slug: "sql-not-in-null-vs-not-exists",
    question: "Why can `NOT IN` fail when its subquery returns `NULL`, and when is `NOT EXISTS` safer?",
    title: "NOT IN, NULL, and NOT EXISTS",
    direct: "If a `NOT IN` subquery contains NULL, a nonmatching value is still compared with an unknown value, so the overall predicate can become unknown instead of true. `WHERE` then removes that row. A correlated `NOT EXISTS` checks for an actual matching row and is safer when the subquery column may be NULL.",
    quick: [
      "`NOT IN` is affected by SQL's three-valued NULL logic.",
      "One NULL in the candidate set can turn every otherwise nonmatching comparison into unknown.",
      "`WHERE` rejects unknown as well as false.",
      "`NOT EXISTS` asks whether a matching row is absent and does not compare against unrelated NULL values.",
      "A proven `NOT NULL` subquery key can make `NOT IN` safe, but the constraint is part of the reasoning.",
    ],
    intent: {
      testing: "Whether NULL propagation through anti-membership and a robust anti-join pattern are understood.",
      common_mistake: "Expecting `NOT IN (2, NULL)` to return every value other than 2.",
      to_stand_out: "State the NOT NULL precondition under which `NOT IN` is safe and show the equivalent correlated `NOT EXISTS` condition.",
    },
    speaking: prose(
      "`NOT IN` looks like a simple exclusion test, but it follows SQL's three-valued comparison rules. For a value to satisfy `NOT IN`, it must be unequal to every value returned by the subquery. A comparison with NULL is unknown because SQL does not know what the missing value represents.",
      "Suppose blocked customer IDs are 2 and NULL. Customer 1 is unequal to 2, but `1 <> NULL` is unknown. The combined result is unknown rather than true, and `WHERE` removes customer 1. Customer 3 has the same problem. Customer 2 produces false because an exact blocked value exists. The surprising result is no customers at all.",
      "`NOT EXISTS` expresses the anti-match directly: keep a customer when no blocked row has the same customer ID. An unrelated blocked row whose ID is NULL does not satisfy the equality condition, so it does not exclude valid customers. This form remains clear even when the nested column is nullable.",
      sqlExample(
        "SELECT c.id, c.name",
        "FROM customers AS c",
        "WHERE NOT EXISTS (",
        "  SELECT 1 FROM blocked_customers AS b",
        "  WHERE b.customer_id = c.id",
        ");"
      ),
      "If the subquery column has a trustworthy `NOT NULL` constraint, `NOT IN` can be correct and concise. Filtering `WHERE customer_id IS NOT NULL` inside the subquery can also restore the intended membership set, but the data rule should be deliberate. Optimizers may produce similar anti-join plans, so syntax alone does not determine speed. I choose `NOT EXISTS` for nullable or uncertain data and verify empty sets, NULLs, and duplicates in tests."
    ),
    deepTitle: "NOT IN and NULL logic",
    deep: prose(
      "**SQL anti-matching.** An anti-query returns outer rows for which no disqualifying match exists. `NOT IN` proves that a value differs from every candidate. `NOT EXISTS` proves that no row satisfying a correlated match condition can be found.",
      "**Unknown inside NOT IN.** With candidates 2 and NULL, the comparison for customer 1 is `1 <> 2 AND 1 <> NULL`. The first part is true; the second is unknown. True AND unknown remains unknown, and `WHERE` keeps only true. `NOT EXISTS` never needs that unrelated NULL comparison.",
      table(
        "| Customer | `NOT IN (2, NULL)` | matching blocked row exists? | `NOT EXISTS` |",
        "|---|---|---|---|",
        "| 1 | unknown | no | true |",
        "| 2 | false | yes | false |",
        "| 3 | unknown | no | true |"
      ),
      "**Blocked-customer result.** The blocked table intentionally contains one real key and one missing key. The first SELECT demonstrates the unsafe form but its empty result is not used as the lesson's final answer. The final correlated query correctly returns Mina and Asha because neither has an equal blocked row.",
      sql(
        [[1, "Mina"], [3, "Asha"]],
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE blocked_customers (customer_id INTEGER);",
        "INSERT INTO customers VALUES (1, 'Mina'), (2, 'Omar'), (3, 'Asha');",
        "INSERT INTO blocked_customers VALUES (2), (NULL);",
        "SELECT id FROM customers WHERE id NOT IN (SELECT customer_id FROM blocked_customers);",
        "SELECT c.id, c.name",
        "FROM customers AS c",
        "WHERE NOT EXISTS (",
        "    SELECT 1",
        "    FROM blocked_customers AS b",
        "    WHERE b.customer_id = c.id",
        ")",
        "ORDER BY c.id;"
      ),
      "**Nullability requirements.** NULL in the outer expression also produces unknown for `NOT IN`. Duplicates inside the subquery do not change existence, but they may affect work. If a schema guarantees the candidate column is non-NULL, document that precondition; otherwise prefer the form whose correctness does not depend on hidden data cleanliness."
    ),
    followups: [
      "What result does `1 NOT IN (2, NULL)` produce?",
      "How does a `NOT NULL` constraint change the safety of `NOT IN`?",
      "Why do duplicate rows not change the truth of `NOT EXISTS`?",
    ],
  },
  {
    topic: "primary-foreign-keys",
    slug: "sql-primary-key-vs-unique-constraint",
    question: "What is the difference between a primary key and a `UNIQUE` constraint?",
    title: "Primary Key vs UNIQUE Constraint",
    direct: "A primary key is the table's chosen row identity: it must be unique and non-NULL, and a table has only one primary-key constraint, possibly across several columns. `UNIQUE` defines additional candidate keys; a table can have several, and NULL treatment in unique constraints has vendor-specific details.",
    quick: [
      "A primary key uniquely identifies each row and is conceptually non-NULL.",
      "A table has one primary-key constraint, but it may contain multiple columns.",
      "A table may have several `UNIQUE` constraints for alternate business keys.",
      "PostgreSQL and SQLite normally allow multiple NULLs in a unique column.",
      "Declare identity and business rules explicitly instead of relying on engine quirks.",
    ],
    intent: {
      testing: "Whether row identity, candidate keys, composite keys, and NULL portability are understood.",
      common_mistake: "Saying a table can have many primary keys or assuming a nullable unique column behaves identically in every engine.",
      to_stand_out: "Separate the chosen identity from alternate keys and mention SQLite's historical primary-key NULL exception.",
    },
    speaking: prose(
      "A primary key is the column or column combination chosen as the main identity of a table row. Its values must be unique and non-NULL, and a table can declare only one primary-key constraint. That constraint can still be composite, such as `PRIMARY KEY (order_id, line_number)`.",
      "A `UNIQUE` constraint says that another value or combination must not repeat. A user table might use `id` as its primary key and email as a unique alternate key. Several unique constraints can exist because several business values may need independent protection. Foreign keys commonly reference a primary key, but engines can also allow a suitable unique candidate key.",
      sqlExample(
        "CREATE TABLE users (",
        "  id INTEGER PRIMARY KEY,",
        "  email TEXT NOT NULL UNIQUE",
        ");"
      ),
      "NULL behavior needs a vendor note. PostgreSQL and SQLite allow multiple NULL values in a unique column by default because NULL values are treated as distinct for uniqueness. PostgreSQL can request `NULLS NOT DISTINCT` in current versions; that syntax is not portable. If email is required as well as unique, declare both `NOT NULL` and `UNIQUE`.",
      "SQLite also preserves a historical quirk: in ordinary rowid tables, some non-`INTEGER PRIMARY KEY` declarations can accept NULL unless the table is `STRICT` or `WITHOUT ROWID`, or `NOT NULL` is explicit. PostgreSQL marks primary-key columns non-NULL. Portable schema design should not depend on the exception. I choose a stable row identity for the primary key, add explicit unique constraints for real alternate identifiers, and state NULL rules directly."
    ),
    deepTitle: "Primary and alternate keys",
    deep: prose(
      "**Candidate-key roles.** A candidate key is a set of columns capable of identifying a row. The primary key is the one the schema designates as its main identity. A unique constraint protects another candidate value without making it the table's primary identity.",
      "**Constraint enforcement.** On insertion or update, the database checks indexed or equivalent constraint structures for an existing equal key. Primary-key columns also carry a non-NULL identity rule in standard relational design. Unique columns may accept NULL according to engine rules because unknown values are not always considered equal.",
      mermaid(
        "flowchart TD",
        "  T[user table] --> P[PRIMARY KEY id: chosen non-NULL row identity]",
        "  T --> U[UNIQUE email: alternate non-duplicate key]",
        "  P --> PC[one primary-key constraint; one or several columns]",
        "  U --> UC[several unique constraints allowed; NULL rules vary]"
      ),
      "**User identity example.** Three users have distinct IDs. Only one has an email, while two have NULL email values. SQLite and PostgreSQL accept those two NULLs under an ordinary unique constraint. A repeated non-NULL email would fail because it represents the same known value.",
      sql(
        [[3, 1]],
        "CREATE TABLE users (",
        "    id INTEGER PRIMARY KEY,",
        "    email TEXT UNIQUE,",
        "    display_name TEXT NOT NULL",
        ");",
        "INSERT INTO users VALUES",
        "    (1, 'mina@example.com', 'Mina'),",
        "    (2, NULL, 'Omar'),",
        "    (3, NULL, 'Asha');",
        "SELECT COUNT(*) AS users, COUNT(email) AS known_unique_emails",
        "FROM users;"
      ),
      "**NULL and key-design boundaries.** Unique is not automatically required: combine it with `NOT NULL` when absence is invalid. Natural keys can change, making a generated stable ID useful as the primary key, but a surrogate ID does not replace business uniqueness. Check SQLite table mode and target-engine NULL semantics before claiming identical constraint behavior."
    ),
    followups: [
      "Can a primary key contain more than one column?",
      "Why might an email column need both `UNIQUE` and `NOT NULL`?",
      "How do PostgreSQL and SQLite normally treat multiple NULLs under a unique constraint?",
    ],
  },
  {
    topic: "primary-foreign-keys",
    slug: "sql-foreign-key-referential-actions",
    question: "What is a foreign key, and what do `ON DELETE` actions do?",
    title: "Foreign Keys and Referential Actions",
    direct: "A foreign key requires each non-NULL child key to match an allowed parent key, protecting referential integrity. `ON DELETE` defines what happens when that parent is removed: reject the deletion, cascade it to children, or set the child key to NULL when the schema permits. The correct action follows ownership semantics.",
    quick: [
      "A foreign key links child values to an existing parent candidate key.",
      "`RESTRICT` or `NO ACTION` prevents an invalid parent deletion, with timing details varying by engine.",
      "`CASCADE` deletes dependent child rows automatically.",
      "`SET NULL` requires a nullable child column and represents a surviving child without that parent.",
      "SQLite applications must enable foreign-key enforcement for each connection; PostgreSQL enforces declared keys normally.",
    ],
    intent: {
      testing: "Whether referential integrity and delete actions are connected to relationship ownership rather than memorized as syntax.",
      common_mistake: "Adding `CASCADE` everywhere without considering accidental deletion scope, or assuming SQLite enforcement is always enabled.",
      to_stand_out: "Choose the action from lifecycle rules and mention indexing child foreign-key columns for common checks and joins where appropriate.",
    },
    speaking: prose(
      "A foreign key protects a relationship between a child table and a parent table. Each non-NULL child value must match the referenced parent key, which is normally a primary key or suitable unique key. The constraint prevents an order from naming a customer that does not exist and prevents later changes from leaving an invalid reference.",
      "The `ON DELETE` action defines the parent-deletion rule. `RESTRICT` or `NO ACTION` rejects a deletion that would leave children, although exact check timing can differ. `CASCADE` deletes matching child rows. `SET NULL` keeps children but clears their reference, which works only when NULL is allowed and means something valid. `SET DEFAULT` also depends on engine support and a default that satisfies the relationship.",
      "For example, order rows owned entirely by a customer account may declare `FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE`. Deleting customer 1 then deletes that customer's orders while customer 2's order remains. For financial history, deletion might instead be prohibited or the account might be soft-deactivated; cascade is a domain decision, not a cleanup shortcut.",
      sqlExample(
        "CREATE TABLE orders (",
        "  id INTEGER PRIMARY KEY,",
        "  customer_id INTEGER NOT NULL,",
        "  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE",
        ");"
      ),
      "PostgreSQL enforces declared foreign keys. SQLite supports them but requires `PRAGMA foreign_keys = ON` for each connection unless application configuration guarantees it; code should not assume the default. Foreign keys also need compatible referenced uniqueness, types, and collations according to the engine. I explain the valid relationship first, choose the lifecycle action explicitly, enable enforcement in every environment, and test deletion as well as insertion."
    ),
    deepTitle: "Foreign-key lifecycle rules",
    deep: prose(
      "**Referential integrity.** A child reference cannot point to a missing parent. A foreign-key constraint gives the database responsibility for checking that rule across every application and maintenance path that writes the tables.",
      "**Delete-action mechanics.** When a child key is written, the engine looks for a referenced parent value. When the parent is updated or deleted, the configured action either blocks the change or transforms matching child rows. Cascading follows actual dependency paths, so one deletion can affect many rows.",
      mermaid(
        "flowchart TD",
        "  D[delete parent customer] --> A{configured ON DELETE action}",
        "  A -- RESTRICT or NO ACTION --> B[reject while children exist]",
        "  A -- CASCADE --> C[delete matching child orders]",
        "  A -- SET NULL --> N[keep children and clear nullable key]",
        "  C --> I[relationship remains valid]",
        "  N --> I"
      ),
      "**Cascading order example.** Two orders belong to customer 1 and one belongs to customer 2. With cascade configured, deleting customer 1 removes only the first two orders. The final query proves order 102 for customer 2 remains and no orphan is produced.",
      sql(
        [[102, 2]],
        "PRAGMA foreign_keys = ON;",
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE orders (",
        "    id INTEGER PRIMARY KEY,",
        "    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE",
        ");",
        "INSERT INTO customers VALUES (1, 'Mina'), (2, 'Omar');",
        "INSERT INTO orders VALUES (100, 1), (101, 1), (102, 2);",
        "DELETE FROM customers WHERE id = 1;",
        "SELECT id, customer_id FROM orders ORDER BY id;"
      ),
      "**Enforcement and cascade boundaries.** A nullable foreign key permits 'no parent' but still validates every non-NULL value. Cascades can chain and should be reviewed for destructive scope. SQLite enforcement must be enabled outside a transaction for the connection. A foreign key does not automatically create the useful child-column index in PostgreSQL or SQLite, so add one when joins, checks, or cascades need it. Constraint declarations, migrations, and test environments must agree or an apparently valid schema may not be protected."
    ),
    followups: [
      "When is `ON DELETE CASCADE` appropriate, and when is it dangerous?",
      "What must be true before `ON DELETE SET NULL` can work?",
      "What SQLite connection setting is required for foreign-key enforcement?",
    ],
  },
  {
    topic: "primary-foreign-keys",
    slug: "sql-not-null-unique-check-default-constraints",
    question: "How do `NOT NULL`, `UNIQUE`, `CHECK`, and `DEFAULT` constraints differ?",
    title: "NOT NULL, UNIQUE, CHECK, and DEFAULT",
    direct: "`NOT NULL` requires a value, `UNIQUE` prevents repeated known key values under the engine's NULL rules, and `CHECK` rejects rows whose rule is false. `DEFAULT` supplies a value only when an insert omits the column; it does not validate data and normally does not replace an explicitly supplied NULL.",
    quick: [
      "`NOT NULL` rejects a missing value in that column.",
      "`UNIQUE` protects a candidate value or column combination from duplicates.",
      "`CHECK` expresses a row-level Boolean validity rule.",
      "`DEFAULT` fills an omitted column; it is not a validation constraint.",
      "Combine constraints when a rule needs both presence and a valid range.",
    ],
    intent: {
      testing: "Whether common constraints are mapped to distinct data-quality responsibilities.",
      common_mistake: "Expecting `DEFAULT` to repair an explicit NULL or writing `CHECK (price >= 0)` without noticing that NULL can pass unless prohibited separately.",
      to_stand_out: "Explain that database constraints protect every writer while application validation supplies earlier, friendlier feedback.",
    },
    speaking: prose(
      "Constraints state which table rows are valid. `NOT NULL` requires a column value. `UNIQUE` prevents repeated candidate-key values, subject to the database's NULL semantics. `CHECK` evaluates a Boolean condition for each row, such as `price >= 0`. `DEFAULT` is different: it supplies a value when an insert omits the column.",
      "These rules often work together. A price column declared only as `CHECK (price >= 0)` may still accept NULL because a check normally rejects false but does not reject unknown. Adding `NOT NULL` expresses both presence and range. A status can have `DEFAULT 'draft'` plus a check limiting it to known values.",
      "For example, an inserted product that omits status receives `draft`. A negative price fails the check, a duplicate SKU fails unique, and a missing SKU fails not-null. Supplying `NULL` explicitly for status usually does not invoke the default; it either stores NULL or fails another constraint. Defaults are not cleanup functions.",
      sqlExample(
        "CREATE TABLE products (",
        "  sku TEXT NOT NULL UNIQUE,",
        "  price INTEGER NOT NULL CHECK (price >= 0),",
        "  status TEXT NOT NULL DEFAULT 'draft'",
        ");"
      ),
      "Constraint syntax and enforcement details differ. PostgreSQL and SQLite both support these basic forms, but unique NULL handling, type conversion, and altering existing constraints differ. Checks should use immutable row facts rather than assumptions about other table contents; cross-table rules normally need foreign keys or carefully designed transactions. Application validation is still useful for readable errors, but it cannot protect writes from every script or service. I keep durable invariants in the database, name important constraints, and test invalid inserts during migrations."
    ),
    deepTitle: "SQL data constraints",
    deep: prose(
      "**Constraint responsibilities.** A constraint is a rule the database checks when data changes. Presence, identity, allowed range, and fallback value are separate concerns, so one keyword should not be expected to provide all four.",
      "**Write-time checks and defaults.** `NOT NULL`, `UNIQUE`, and `CHECK` can reject a write. A default instead turns an omitted input into a defined value before the row is stored. Combining them gives the stored row a precise contract: a known SKU, a nonnegative price, and a status from an allowed set.",
      mermaid(
        "flowchart TD",
        "  I[new product input] --> D{status omitted?}",
        "  D -- yes --> V[DEFAULT supplies draft]",
        "  D -- no --> V2[keep supplied status]",
        "  V --> C[NOT NULL, UNIQUE, and CHECK validate stored row]",
        "  V2 --> C",
        "  C -- valid --> S[store product]",
        "  C -- invalid --> R[reject write]"
      ),
      "**Product constraint result.** Product A omits status and receives `draft`; product B supplies `active`. The final rows demonstrate defaulting without hiding either explicit value. Invalid examples are described rather than included in the executable transaction so the verified result remains deterministic.",
      sql(
        [["A-1", 25, "draft"], ["B-2", 0, "active"]],
        "CREATE TABLE products (",
        "    id INTEGER PRIMARY KEY,",
        "    sku TEXT NOT NULL UNIQUE,",
        "    price INTEGER NOT NULL CHECK (price >= 0),",
        "    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active'))",
        ");",
        "INSERT INTO products (id, sku, price) VALUES (1, 'A-1', 25);",
        "INSERT INTO products (id, sku, price, status) VALUES (2, 'B-2', 0, 'active');",
        "SELECT sku, price, status FROM products ORDER BY id;"
      ),
      "**NULL and migration boundaries.** A check that evaluates to unknown can pass, so add `NOT NULL` when missing data is invalid. Defaults apply to omitted columns, not arbitrary bad values. Existing dirty rows can make a migration fail, and engine-specific type coercion may change what reaches a check. Validate old data before enabling new rules."
    ),
    followups: [
      "Why can `CHECK (price >= 0)` still need `NOT NULL`?",
      "Does a default replace an explicitly inserted NULL?",
      "Which rules belong in database constraints instead of only application code?",
    ],
  },
  {
    topic: "basic-indexes-concept",
    slug: "sql-btree-index-benefits-and-limits",
    question: "What is a B-tree index, and which SQL queries can it help?",
    title: "B-tree Index Benefits and Limits",
    direct: "A B-tree index stores searchable keys in ordered pages with row references, giving the planner an access path that can help equality, range, and compatible ordering queries. It is not a guarantee of faster execution: the planner compares index access with alternatives, and writes must maintain the extra structure.",
    quick: [
      "B-tree keys are kept in an order that supports directed lookup and ordered scans.",
      "Equality and ranges such as `<`, `BETWEEN`, and anchored prefixes can often benefit.",
      "A compatible `ORDER BY` may be satisfied by scanning index order.",
      "The optimizer chooses an index only when its estimated plan cost is worthwhile.",
      "Indexes consume storage and add maintenance work to inserts, deletes, and key updates.",
    ],
    intent: {
      testing: "Whether an index is understood as an optional ordered access path with both read benefits and maintenance costs.",
      common_mistake: "Saying an index makes every `SELECT` fast or describing B-tree lookup as universally exact O(log n) database time.",
      to_stand_out: "Connect index ordering to specific predicates and acknowledge planner, cache, page, and data-distribution effects.",
    },
    speaking: prose(
      "A B-tree index is an auxiliary ordered structure built from one or more table expressions. Its upper pages guide the search toward a smaller key range, and leaf entries identify matching table rows or contain enough values for an index-only strategy. PostgreSQL uses B-tree as its default index type, and SQLite also stores ordinary indexes in B-tree structures.",
      "Because keys are ordered, planners can consider B-tree indexes for equality and range predicates such as `=`, `<`, `>=`, `BETWEEN`, and `IN`. An index may also deliver rows in an order compatible with `ORDER BY`, avoiding a separate sort. Prefix pattern matching can sometimes use one, but collation, operator class, and whether the pattern begins with a fixed prefix matter.",
      "For example, an index on `orders(created_at)` can help find orders in a date interval and return them by date. The query result is the same with or without the index; the index changes the available plan, not SQL semantics.",
      sqlExample(
        "CREATE INDEX orders_created_at_idx ON orders(created_at);",
        "SELECT id, created_at FROM orders",
        "WHERE created_at >= '2026-09-02' AND created_at < '2026-09-04'",
        "ORDER BY created_at;"
      ),
      "It is incorrect to promise that the index will be used or make every query faster. A large matching fraction, small table, stale statistics, cached sequential pages, expression mismatch, or incompatible sort can make another plan cheaper. Every index also needs space and maintenance during writes. PostgreSQL and SQLite expose different plan details and cost models. I propose an index from a real query pattern, verify it with the engine's `EXPLAIN` tool and representative data, and retain it only when measured benefit justifies its cost."
    ),
    deepTitle: "B-tree index access path",
    deep: prose(
      "**Ordered index structure.** A B-tree index is a separate ordered map from indexed key values to table locations. It does not rearrange the logical table result and does not change which rows are correct; it gives the optimizer another route to them.",
      "**Range-lookup mechanics.** Branch pages divide the key space into ranges. A lookup follows the range containing the requested key until it reaches leaf entries, then scans adjacent leaves for a range. If output order matches index order, that same scan can sometimes avoid a later sort.",
      mermaid(
        "flowchart LR",
        "  Q[date range predicate] --> R[root key ranges]",
        "  R --> B[matching branch range]",
        "  B --> L[first qualifying leaf entry]",
        "  L --> S[scan adjacent ordered entries]",
        "  S --> T[fetch or return matching rows]"
      ),
      "**Date-range query.** Four orders are indexed by ISO date text, whose lexical order matches chronological order in this fixed format. The query selects the September 2 through September 3 interval and returns IDs 2 and 3 in index-compatible order. SQL correctness does not depend on the planner choosing the index.",
      sql(
        [[2, "2026-09-02"], [3, "2026-09-03"]],
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, amount INTEGER NOT NULL);",
        "INSERT INTO orders VALUES",
        "    (1, '2026-09-01', 20), (2, '2026-09-02', 30),",
        "    (3, '2026-09-03', 40), (4, '2026-09-05', 50);",
        "CREATE INDEX orders_created_at_idx ON orders(created_at);",
        "SELECT id, created_at",
        "FROM orders",
        "WHERE created_at >= '2026-09-02' AND created_at < '2026-09-04'",
        "ORDER BY created_at, id;"
      ),
      "**Planner and expression boundaries.** A leading wildcard, transformed column, different collation, or wide result can change usefulness. Big-O alone omits page reads, cache, row fetches, and selectivity. PostgreSQL and SQLite planners make cost-based choices with engine-specific statistics, so use `EXPLAIN` and realistic volumes instead of treating index presence as proof."
    ),
    followups: [
      "Why can a B-tree support both equality and range predicates?",
      "When can an index help an `ORDER BY` clause?",
      "Why might the planner prefer a table scan even when a matching index exists?",
    ],
  },
  {
    topic: "basic-indexes-concept",
    slug: "sql-why-an-index-may-not-be-used",
    question: "Why might a database not use an available index?",
    title: "Why a Database May Skip an Index",
    direct: "An optimizer chooses the estimated cheapest valid plan, not every usable index. It may prefer a table scan when many rows qualify, the table is small, statistics predict low benefit, the query transforms or compares the indexed value incompatibly, or fetching table rows through the index would cost more than reading them together.",
    quick: [
      "An index is an available path, not a command to the optimizer.",
      "Low-selectivity predicates may return too much of the table to justify scattered lookups.",
      "Small tables can be cheaper to scan directly.",
      "Functions, casts, collations, or mismatched leading columns can make an index less applicable.",
      "Use `EXPLAIN` and representative statistics before changing or forcing a plan.",
    ],
    intent: {
      testing: "Whether planner choice is explained with selectivity and access cost instead of index folklore.",
      common_mistake: "Assuming the database is broken whenever `EXPLAIN` shows a scan or adding several overlapping indexes without measuring writes.",
      to_stand_out: "Separate index eligibility from estimated profitability and test with production-like distributions.",
    },
    speaking: prose(
      "A database optimizer compares possible plans and chooses the one it estimates will cost least. Creating an index makes another access path available; it does not require the engine to use it. A sequential or table scan can be the sensible choice when reading pages in bulk is cheaper than bouncing between many index entries and table rows.",
      "Selectivity is a common reason. If `status = 'active'` matches 95 percent of a table, an index on status narrows very little and may add random row fetches. A small table can also be scanned in a few pages. Statistics, row width, cached data, requested columns, and ordering all affect the estimate.",
      "The query expression must also fit the index definition and engine rules. An index on `email` may not directly serve `LOWER(email)` unless an expression index exists and matches. Implicit casts, collations, leading columns of a composite index, and wildcard patterns can matter. PostgreSQL and SQLite differ in planner details and supported index features, so broad rules need verification.",
      "For example, a status index might help when inactive rows are rare and the table is large.",
      sqlExample(
        "CREATE INDEX accounts_status_idx ON accounts(status);",
        "SELECT id FROM accounts WHERE status = 'inactive';"
      ),
      "On the tiny teaching table SQLite may still choose any correct plan. I check `EXPLAIN` or `EXPLAIN QUERY PLAN`, refresh or analyze statistics when appropriate, and measure representative workloads. I do not force an index merely to remove a scan; the goal is lower end-to-end cost while keeping write and storage overhead justified."
    ),
    deepTitle: "Index eligibility and cost choice",
    deep: prose(
      "**Indexable and worthwhile.** Index eligibility means a query can use an index without changing its answer. Plan selection is a second decision: the optimizer estimates whether that path is cheaper than scanning, sorting, or combining other paths.",
      "**Cost-estimate inputs.** The estimate combines the fraction of rows expected to match, index traversal, table-row visits, ordering needs, available statistics, and engine-specific cost assumptions. A predicate can be indexable yet still lose because it returns most rows or because each match requires another scattered page access.",
      table(
        "| Situation | Why a scan or another plan may win |",
        "|---|---|",
        "| tiny table | only a few pages need reading |",
        "| common status value | index removes little work |",
        "| `LOWER(email)` with plain email index | expression may not match index |",
        "| many output columns | repeated table fetches may dominate |",
        "| stale distribution statistics | estimated selectivity may be wrong |"
      ),
      "**Selective status query.** Five of six accounts are active and only one is inactive. The index can represent both values, but their usefulness differs. The final query returns the rare inactive account. On such a tiny table, the observed plan is not evidence for what a million-row production table will choose.",
      sql(
        [[6, "Nia"]],
        "CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL);",
        "INSERT INTO accounts VALUES",
        "    (1, 'Mina', 'active'), (2, 'Omar', 'active'),",
        "    (3, 'Asha', 'active'), (4, 'Lee', 'active'),",
        "    (5, 'Noah', 'active'), (6, 'Nia', 'inactive');",
        "CREATE INDEX accounts_status_idx ON accounts(status);",
        "SELECT id, name FROM accounts WHERE status = 'inactive' ORDER BY id;"
      ),
      "**Plan and statistics boundaries.** `EXPLAIN` output is vendor- and version-specific, and estimates can be wrong. An expression index, partial index, covering index, or refreshed statistics may help, but each adds a maintenance tradeoff. Validate the SQL result independently, then compare measured plans using realistic data rather than optimizing the six-row demonstration."
    ),
    followups: [
      "What does low selectivity mean for an indexed predicate?",
      "Why can applying a function to an indexed column affect index use?",
      "What is the difference between a query being indexable and an index plan being cheaper?",
    ],
  },
  {
    topic: "basic-indexes-concept",
    slug: "sql-composite-index-column-order",
    question: "Why does column order matter in a composite index?",
    title: "Composite Index Column Order",
    direct: "A composite B-tree orders entries first by its leading column, then uses later columns to order ties. An index on `(customer_id, created_at)` naturally groups one customer's rows in date order, so it often helps customer equality plus date range or ordering. Later-column-only queries may receive less benefit, depending on the engine and data.",
    quick: [
      "A composite index is ordered lexicographically from its first column onward.",
      "Leading equality conditions let later index columns narrow a range effectively.",
      "`(customer_id, created_at)` fits one customer's date-range query.",
      "A query only on a later column may not use the whole ordering efficiently.",
      "Skip scans and planner choices exist, so the leftmost-prefix rule is guidance rather than an absolute ban.",
    ],
    intent: {
      testing: "Whether composite ordering is connected to real filter and sort shapes without making absolute planner claims.",
      common_mistake: "Assuming `(a, b)` and `(b, a)` are interchangeable or that every query mentioning either column gets equal benefit.",
      to_stand_out: "Design column order from equality, range, ordering, selectivity, and the workload rather than one memorized rule.",
    },
    speaking: prose(
      "A composite B-tree index stores keys in lexicographic order. For `(customer_id, created_at)`, entries are ordered by customer first; dates order the entries within each customer's block. That structure is different from `(created_at, customer_id)`, which groups all customers by date first.",
      "For example, a query for customer 7's September orders fits that first order. Equality locates customer 7's block, the date column narrows a contiguous part of it, and the compatible order may reuse the same index sequence.",
      sqlExample(
        "SELECT * FROM orders",
        "WHERE customer_id = 7 AND created_at >= '2026-09-01'",
        "ORDER BY created_at;"
      ),
      "The same index can also support a query on customer alone because customer is the leading key.",
      "A query only on `created_at` cannot simply jump to one globally contiguous date range in that index because each customer has its own date sequence. It may receive limited help through a skip-scan or another optimizer technique in PostgreSQL or SQLite, depending on distinct values and statistics, but that is not the same natural fit. The familiar leftmost-prefix rule is therefore a useful design model, not a statement that later-column queries can never use the index.",
      "Column order also interacts with selectivity, sort direction, covering columns, and write cost. Adding both `(a)` and `(a, b)` may be redundant in some workloads, but not universally. I start from frequent queries, place equality and ordering/range needs deliberately, inspect engine plans with production-like distributions, and avoid creating every permutation."
    ),
    deepTitle: "Composite-index tuple order",
    deep: prose(
      "**Composite key order.** A composite index has one ordered tuple as its key. `(customer_id, created_at)` means customer ID is compared first; only entries tied on customer are then compared by time.",
      "**Leading-key interval.** An equality on the leading customer key identifies a contiguous section of the index. Inside that section, a date boundary identifies another contiguous interval, and scanning forward can return that customer's orders chronologically. Reversing column order creates different contiguous regions and supports a different workload.",
      table(
        "| Query shape for index `(customer_id, created_at)` | Natural ordering fit |",
        "|---|---|",
        "| `customer_id = 7` | leading customer block |",
        "| `customer_id = 7 AND created_at >= ...` | date range inside one block |",
        "| same filter plus `ORDER BY created_at` | may reuse block order |",
        "| `created_at >= ...` only | dates are split across customer blocks |"
      ),
      "**Customer-order range.** Customer 7 has three dated orders. The query chooses orders from September 2 onward and returns IDs 2 and 3 in time order. Customer 8 has a matching date but is outside the leading-key block and correctly does not appear.",
      sql(
        [[2, "2026-09-02"], [3, "2026-09-03"]],
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, created_at TEXT NOT NULL);",
        "INSERT INTO orders VALUES",
        "    (1, 7, '2026-09-01'), (2, 7, '2026-09-02'),",
        "    (3, 7, '2026-09-03'), (4, 8, '2026-09-02');",
        "CREATE INDEX orders_customer_date_idx ON orders(customer_id, created_at);",
        "SELECT id, created_at",
        "FROM orders",
        "WHERE customer_id = 7 AND created_at >= '2026-09-02'",
        "ORDER BY created_at, id;"
      ),
      "**Planner alternatives.** Engines may use skip scans, bitmap combinations, automatic indexes, or a plain scan, so the second column is not universally unusable on its own. Range conditions can also limit how later keys narrow a scan. Use the tuple-order model to propose an index, then verify actual plans, latency, and write overhead."
    ),
    followups: [
      "How do `(customer_id, created_at)` and `(created_at, customer_id)` serve different queries?",
      "Why can an equality on the leading column help the next range column?",
      "Why is the leftmost-prefix rule useful guidance but not a universal optimizer prohibition?",
    ],
  },
  {
    topic: "comparisons",
    slug: "sql-union-vs-union-all",
    question: "How do `UNION` and `UNION ALL` differ when combining SQL query results?",
    title: "UNION vs UNION ALL",
    direct: "Both operators append compatible query results vertically. `UNION ALL` preserves every row, including duplicates, while `UNION` applies duplicate removal to the combined result. Use `UNION ALL` when duplicates are valid or the branches are known to be disjoint; use `UNION` only when set-like uniqueness is part of the requirement.",
    quick: [
      "Both sides must return the same number of columns in compatible positions.",
      "`UNION ALL` retains duplicate rows from and across both branches.",
      "`UNION` removes duplicate result rows.",
      "Duplicate removal usually needs extra comparison, sorting, or hashing work.",
      "A final `ORDER BY` applies to the combined result, not to each branch's guaranteed output order.",
    ],
    intent: {
      testing: "Whether vertical combination, column compatibility, duplicate semantics, and cost are distinguished.",
      common_mistake: "Using `UNION` automatically and silently losing meaningful duplicate events or paying for unnecessary deduplication.",
      to_stand_out: "Choose from the data contract and prove when branches are disjoint enough for `UNION ALL`.",
    },
    speaking: prose(
      "`UNION` and `UNION ALL` combine the rows produced by two or more queries. This is a vertical operation: corresponding columns occupy the same positions, so every branch must return the same column count and values with compatible types. Output column names normally come from the first query branch.",
      "`UNION ALL` appends every row and preserves duplicates. `UNION` adds a distinct step over the combined result, so two rows that are equal across all selected columns collapse into one. It is different from a join, which combines columns from related rows horizontally.",
      "For example, a current-customer list containing Mina and Omar and an archived list containing Omar and Asha produce four rows with `UNION ALL`; Omar appears twice. `UNION` produces three unique names. Neither is automatically correct. If the report asks for source occurrences, the duplicate may carry meaning. If it asks for the set of known names, uniqueness is required.",
      sqlExample(
        "SELECT name FROM current_customers",
        "UNION ALL",
        "SELECT name FROM archived_customers;"
      ),
      "Duplicate removal generally adds work through sorting, hashing, or another engine strategy, so `UNION ALL` is often cheaper when duplicates are acceptable or impossible by design. Exact planning differs between PostgreSQL and SQLite. A single final `ORDER BY` should define presentation order for the compound result; branch ordering without branch-specific limiting does not provide a portable final-order guarantee. I state whether duplicates are data or noise, align each column deliberately, and choose the operator from that rule."
    ),
    deepTitle: "UNION duplicate behavior",
    deep: prose(
      "**Compound-result modes.** A compound query stacks one compatible result underneath another. `UNION ALL` performs the stack directly. `UNION` presents set-like output by eliminating rows that are equal in every selected column.",
      "**Column alignment and deduplication.** Each branch produces the same number of columns. The engine aligns them by position, not by matching alias text. With `UNION`, it then identifies duplicate combined rows using an engine-chosen method. With `UNION ALL`, no cross-branch identity test is required for correctness.",
      mermaid(
        "flowchart LR",
        "  C[current: Mina, Omar] --> A[UNION ALL appends every row]",
        "  H[archived: Omar, Asha] --> A",
        "  A --> AR[Mina, Omar, Omar, Asha]",
        "  C --> U[UNION appends then removes equal rows]",
        "  H --> U",
        "  U --> UR[Mina, Omar, Asha]"
      ),
      "**Combined names result.** The first compound SELECT demonstrates the four-row `UNION ALL` stream. The final query uses `UNION`, removes the repeated Omar row, and sorts the three names for deterministic verification. Deduplication considers the selected name only; adding a different source column would make the rows distinct.",
      sql(
        [["Asha"], ["Mina"], ["Omar"]],
        "CREATE TABLE current_customers (name TEXT NOT NULL);",
        "CREATE TABLE archived_customers (name TEXT NOT NULL);",
        "INSERT INTO current_customers VALUES ('Mina'), ('Omar');",
        "INSERT INTO archived_customers VALUES ('Omar'), ('Asha');",
        "SELECT name FROM current_customers UNION ALL SELECT name FROM archived_customers;",
        "SELECT name FROM current_customers",
        "UNION",
        "SELECT name FROM archived_customers",
        "ORDER BY name;"
      ),
      "**Type and grain boundaries.** Type coercion, text collation, and NULL equality during duplicate elimination follow engine rules. A `UNION` can hide an upstream duplication bug rather than fix it. Prefer `UNION ALL` when business rows must be preserved, and add a deliberate distinct operation only at the grain where uniqueness is actually defined."
    ),
    followups: [
      "Why can `UNION` be more expensive than `UNION ALL`?",
      "Which columns determine whether two union rows are duplicates?",
      "How is a union different from a join?",
    ],
  },
  {
    topic: "comparisons",
    slug: "sql-delete-vs-truncate-vs-drop",
    question: "What is the difference between `DELETE`, `TRUNCATE`, and `DROP`?",
    title: "DELETE vs TRUNCATE vs DROP",
    direct: "`DELETE` removes qualifying rows and can use `WHERE`; the table remains. `TRUNCATE` removes all rows through an engine-specific bulk operation with no row filter. `DROP TABLE` removes the table definition and its owned objects. Locking, trigger, identity, transaction, and support details differ substantially by database.",
    quick: [
      "`DELETE FROM table WHERE ...` removes selected rows; without `WHERE` it removes all rows.",
      "`TRUNCATE` targets the whole table and has no row-level `WHERE` filter.",
      "`DROP TABLE` removes the table object, not only its rows.",
      "PostgreSQL supports transactional `TRUNCATE`; SQLite has no `TRUNCATE` statement.",
      "Trigger, lock, identity, foreign-key, and rollback behavior must be checked for the target engine.",
    ],
    intent: {
      testing: "Whether row removal, bulk emptying, and schema removal are separated without repeating unsafe vendor myths.",
      common_mistake: "Claiming `TRUNCATE` can never be rolled back or always resets identity in every database.",
      to_stand_out: "Name PostgreSQL and SQLite differences and choose the operation from scope, concurrency, dependencies, and recovery needs.",
    },
    speaking: prose(
      "`DELETE` is a row-removal statement. A `WHERE` clause selects which rows to remove; omitting it removes every row while leaving the table, columns, indexes, and constraints available. Row-level delete triggers and foreign-key actions can participate according to the database.",
      "`TRUNCATE` is a whole-table emptying operation with no row filter. PostgreSQL can reclaim table storage quickly, takes an `ACCESS EXCLUSIVE` lock, has separate truncate triggers, and can optionally restart owned identities. PostgreSQL also makes truncation transaction-safe for table data, so the common claim that it can never roll back is false there. Details differ in other products.",
      "SQLite does not implement a `TRUNCATE TABLE` statement. An unqualified `DELETE` is the portable way to empty a SQLite table, and SQLite may apply its own truncate optimization internally. `DROP TABLE` goes further: it removes the table definition along with associated indexes, triggers, and constraints; dependent-object behavior and cascade syntax vary.",
      "For example, deleting archived log rows preserves the active rows and the logs table. Dropping a temporary scratch table removes that object entirely.",
      sqlExample(
        "DELETE FROM logs WHERE status = 'archived';",
        "DROP TABLE scratch_data;"
      ),
      "In production I check backups, privileges, foreign-key dependencies, locks, trigger behavior, and identity requirements before a bulk operation. I never choose from a memorized speed ranking: `DELETE` is for row scope, `TRUNCATE` is an engine-specific whole-table operation, and `DROP` is schema removal."
    ),
    deepTitle: "DELETE, TRUNCATE, and DROP scope",
    deep: prose(
      "**Data and schema scope.** These statements operate at different scopes. Delete changes a set of rows. Truncate is a database-supported bulk emptying operation. Drop removes the schema object that held the rows.",
      "**Statement behavior.** `DELETE` evaluates its predicate and removes qualifying records while retaining the table. PostgreSQL implements `TRUNCATE` without scanning individual rows and applies special locking, trigger, and identity rules. SQLite accepts only the delete and drop forms here, though it can internally optimize an unfiltered delete.",
      mermaid(
        "flowchart TD",
        "  N{required scope} --> R[selected rows]",
        "  N --> A[all rows, table retained]",
        "  N --> T[table object and its data]",
        "  R --> D[DELETE with WHERE]",
        "  A --> TR[TRUNCATE where supported; SQLite uses DELETE]",
        "  T --> DR[DROP TABLE removes schema object]"
      ),
      "**Filtered log deletion.** The logs table starts with two archived rows and one active row. A filtered delete removes only archived entries. A separate scratch table is dropped. The final query proves the logs schema and active row still exist, which would be impossible after dropping logs itself.",
      sql(
        [[3, "active"]],
        "CREATE TABLE logs (id INTEGER PRIMARY KEY, status TEXT NOT NULL);",
        "INSERT INTO logs VALUES (1, 'archived'), (2, 'archived'), (3, 'active');",
        "DELETE FROM logs WHERE status = 'archived';",
        "CREATE TABLE scratch_data (id INTEGER);",
        "DROP TABLE scratch_data;",
        "SELECT id, status FROM logs ORDER BY id;"
      ),
      "**Vendor operational boundaries.** Transaction and identity behavior differ across vendors. PostgreSQL truncation can roll back but uses strong locks and does not fire ordinary delete triggers. SQLite has no truncate statement. MySQL and other systems have their own commit and foreign-key behavior. Verify the exact engine before destructive maintenance and prefer recoverable operational procedures."
    ),
    followups: [
      "Can PostgreSQL `TRUNCATE` be rolled back inside a transaction?",
      "What should SQLite use when all rows must be removed?",
      "Why is `DROP TABLE` more destructive than an unqualified `DELETE`?",
    ],
  },
  {
    topic: "comparisons",
    slug: "sql-join-vs-subquery",
    question: "What is the difference between a join and a subquery, and how do you choose between them?",
    title: "JOIN vs Subquery",
    direct: "A join combines related row sources and can return columns from both. A subquery supplies a value, set, existence test, or derived table to another query. Neither form is universally faster. Choose the expression that matches the result grain and NULL or duplicate semantics, then compare actual plans if performance matters.",
    quick: [
      "A join describes matching rows between table sources.",
      "A subquery can return a scalar, set, existence result, or derived table.",
      "A one-to-many join can multiply outer rows; `EXISTS` returns only a Boolean test.",
      "Optimizers can rewrite joins and subqueries into related plans.",
      "Choose for correct grain and clarity first, then inspect measured plans.",
    ],
    intent: {
      testing: "Whether query shape, cardinality, existence semantics, and optimizer freedom are understood.",
      common_mistake: "Saying joins are always faster or replacing `EXISTS` with a join without handling duplicate matches.",
      to_stand_out: "Predict row multiplication and explain why existence queries often communicate intent better with `EXISTS`.",
    },
    speaking: prose(
      "A join combines table sources according to a relationship and produces columns from the matched row pairs. It is natural when the result needs order data beside customer data. A subquery is a nested query whose role can be a scalar value, membership set, existence test, or derived table.",
      "The choice changes semantics in some cases. If a customer has two orders, an inner join returns two customer-order rows. If the requirement asks only which customers have any order, a correlated `EXISTS` test keeps one customer row and answers that Boolean question directly. A join can match the same grain with `DISTINCT` or grouping, but that extra step should be deliberate.",
      "For example, a join plus `DISTINCT` and an `EXISTS` query can both return Mina and Asha as customers who have orders. The existence form does not expose or multiply order rows. If order amount or date must be selected, a join or carefully shaped subquery becomes appropriate.",
      sqlExample(
        "SELECT c.id, c.name FROM customers AS c",
        "WHERE EXISTS (",
        "  SELECT 1 FROM orders AS o WHERE o.customer_id = c.id",
        ");"
      ),
      "There is no reliable rule that a join is always faster than a subquery. PostgreSQL and SQLite optimizers can flatten, decorrelate, reorder, or choose similar physical strategies, while some query shapes resist transformation. `IN`, `EXISTS`, and joins also differ around NULLs and duplicates. I first define the desired row grain and columns, select the clearest correct construct, verify edge cases, and use the target engine's plan and realistic data for performance decisions."
    ),
    deepTitle: "JOIN and subquery result grain",
    deep: prose(
      "**Row combination and nested input.** A join makes a combined row source. A subquery makes one query an input to another. The syntax overlaps because an inner query in `FROM` is itself joinable, but the clearest form usually follows what the result must represent.",
      "**Matching-pair and existence mechanics.** A join emits one output candidate for every matching pair, so one-to-many data multiplies the parent. `EXISTS` evaluates only whether a qualifying child row exists and keeps the parent grain. A scalar subquery supplies one value, while an `IN` subquery supplies membership candidates.",
      mermaid(
        "flowchart TD",
        "  Q{required result} --> C[customer plus every order]",
        "  Q --> E[customers having any order]",
        "  Q --> A[customer plus one aggregate]",
        "  Q --> N[customers without an order]",
        "  C --> J[JOIN: one row per matching pair]",
        "  E --> EX[EXISTS: keep customer grain]",
        "  A --> G[grouped join or scalar subquery]",
        "  N --> NX[NOT EXISTS: anti-match]"
      ),
      "**Customers with orders.** Mina has two orders and Asha has one. The first join query needs `DISTINCT` to return customer grain. The final `EXISTS` query returns the same two customer IDs directly and is the result checked by the validator.",
      sql(
        [[1, "Mina"], [3, "Asha"]],
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL);",
        "INSERT INTO customers VALUES (1, 'Mina'), (2, 'Omar'), (3, 'Asha');",
        "INSERT INTO orders VALUES (10, 1), (11, 1), (12, 3);",
        "SELECT DISTINCT c.id, c.name FROM customers AS c JOIN orders AS o ON o.customer_id = c.id;",
        "SELECT c.id, c.name",
        "FROM customers AS c",
        "WHERE EXISTS (SELECT 1 FROM orders AS o WHERE o.customer_id = c.id)",
        "ORDER BY c.id;"
      ),
      "**Rewrite semantics.** Rewriting can change duplicate counts, selected columns, or NULL results even when sample output looks equal. Optimizer behavior and index choices differ by engine and version. Prove semantic equivalence for empty, duplicate, and nullable data before comparing performance; do not add `DISTINCT` only to conceal an accidental many-side join."
    ),
    followups: [
      "Why can replacing `EXISTS` with a join duplicate customer rows?",
      "When is a join necessary because the result needs child columns?",
      "Why can neither form be declared universally faster?",
    ],
  },
];

function countWords(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function metaDescription(value, limit = 158) {
  const plain = String(value).replaceAll("`", "");
  if (plain.length <= limit) return plain;
  const clipped = plain.slice(0, limit - 3).replace(/\s+\S*$/, "").trimEnd();
  return `${clipped}...`;
}

function makeQuestion(definition, order) {
  const learningWords = countWords([
    definition.direct,
    ...definition.quick,
    definition.speaking,
    definition.deep,
  ].join(" "));
  const readingMinutes = Math.max(5, Math.ceil(learningWords / 180) + 2);
  return {
    id: `sql-basics-${definition.topic}-q${String(order).padStart(3, "0")}`,
    slug: definition.slug,
    question: definition.question,
    title: definition.title,
    direct_answer: definition.direct,
    layout_type: definition.deep.includes("|---") ? "comparison" : "concept-explanation",
    difficulty: "medium",
    importance: "high",
    reading_time_minutes: readingMinutes,
    last_updated: today,
    interviewer_intent: definition.intent,
    company_tags: [],
    answer: {
      sections: [
        { type: "key_points", title: "Quick revision", items: definition.quick },
        { type: "speakable_answer", title: "Interview answer", answerSize: "standard", content: interviewProse(definition.speaking) },
        { type: "deep_explanation", title: definition.deepTitle, content: definition.deep },
      ],
    },
    followup_questions: definition.followups,
    seo: {
      metaTitle: `${definition.title} | SQL Interview Guide`,
      metaDescription: metaDescription(definition.direct),
    },
    order,
  };
}

function replaceIndexedModule(rawIndex, moduleEntry) {
  const marker = `"moduleSlug": "${moduleEntry.moduleSlug}"`;
  const markerIndex = rawIndex.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Cannot find ${moduleEntry.moduleSlug} in _index.json`);
  let start = markerIndex;
  while (start >= 0 && rawIndex[start] !== "{") start -= 1;
  if (start < 0) throw new Error("Cannot find indexed module start");
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;
  for (let index = start; index < rawIndex.length; index += 1) {
    const character = rawIndex[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error("Cannot find indexed module end");
  const replacement = JSON.stringify(moduleEntry, null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .trimStart();
  return `${rawIndex.slice(0, start)}${replacement}${rawIndex.slice(end)}`;
}

function validateDefinitions() {
  const problems = [];
  if (definitions.length !== 24) problems.push(`Expected 24 questions; found ${definitions.length}`);
  for (const topic of topicOrder) {
    const count = definitions.filter((definition) => definition.topic === topic).length;
    if (count !== 3) problems.push(`${topic} must contain exactly 3 questions; found ${count}`);
  }
  const slugs = new Set();
  for (const definition of definitions) {
    if (slugs.has(definition.slug)) problems.push(`Duplicate slug: ${definition.slug}`);
    slugs.add(definition.slug);
    if (definition.quick.length < 4 || definition.quick.length > 6) problems.push(`Quick revision count invalid: ${definition.slug}`);
    const deepHeadings = [...definition.deep.matchAll(/\*\*([^*]+)\.\*\*/g)].map((match) => match[1]);
    if (deepHeadings.length < 4) problems.push(`${definition.slug} needs four concept-specific Deep Dive headings`);
    const editorialHeading = /^(?:start|begin|follow|see|know|remember|trace|how it works|plain definition|easy example|boundary to remember)\b/i;
    for (const heading of deepHeadings) {
      if (editorialHeading.test(heading)) problems.push(`${definition.slug} uses editorial Deep Dive heading: ${heading}`);
    }
    const hasInterviewSql = /```sql\n[\s\S]*?\b(?:SELECT|CREATE|DELETE|DROP|INSERT|UPDATE)\b/i.test(definition.speaking)
      || /`(?:SELECT|FROM|WHERE|JOIN|GROUP BY|HAVING|ORDER BY|LIMIT|COUNT|SUM|AVG|CASE|COALESCE|EXISTS|NOT IN|PRIMARY KEY|FOREIGN KEY|UNIQUE|CHECK|CREATE INDEX|DELETE|TRUNCATE|DROP|UNION)[^`]*`/i.test(definition.speaking);
    if (!hasInterviewSql) {
      problems.push(`${definition.slug} needs a concrete SQL query or expression in its Interview Answer`);
    }
    if (definition.speaking.trim() === definition.deep.trim()) problems.push(`${definition.slug} reuses its Interview Answer as Deep Dive`);
    const sqlCount = (definition.deep.match(/```sql\n/g) ?? []).length;
    const visualCount = (definition.deep.match(/```mermaid\n/g) ?? []).length + (definition.deep.match(/\n\|---/g) ?? []).length;
    if (sqlCount !== 1) problems.push(`${definition.slug} must have exactly one SQL example; found ${sqlCount}`);
    if (visualCount !== 1) problems.push(`${definition.slug} must have exactly one visual; found ${visualCount}`);
    if (definition.followups.length < 3) problems.push(`Missing follow-ups: ${definition.slug}`);
  }
  if (problems.length > 0) throw new Error(problems.join("\n"));
}

function writeModule() {
  validateDefinitions();
  for (const topic of topicOrder) {
    const selected = definitions.filter((definition) => definition.topic === topic);
    const topicDir = path.join(moduleRoot, topic);
    fs.mkdirSync(topicDir, { recursive: true });
    const document = {
      topic: topicTitles[topic],
      topicSlug: topic,
      questions: selected.map((definition, index) => makeQuestion(definition, index + 1)),
    };
    fs.writeFileSync(path.join(topicDir, "complete-qa.json"), `${JSON.stringify(document, null, 2)}\n`);
  }

  const rawIndex = fs.readFileSync(indexPath, "utf8");
  const index = JSON.parse(rawIndex);
  const previous = index.modules.find((entry) => entry.moduleSlug === "sql-basics");
  if (!previous) throw new Error("Missing canonical sql-basics index entry");
  const intro = "Learn the SQL foundations expected in Python backend fresher interviews through 24 focused lessons. Build queries in logical stages, preserve rows deliberately with joins, group and aggregate without losing NULL semantics, choose safe subquery forms, enforce relationships with constraints, and reason about B-tree indexes through measured query plans. Every lesson uses portable SQL first, labels PostgreSQL and SQLite differences, and includes a verified in-memory example.";
  const moduleEntry = { ...previous, intro, questionCount: 24 };
  fs.writeFileSync(indexPath, replaceIndexedModule(rawIndex, moduleEntry));
  fs.writeFileSync(path.join(moduleRoot, "_config.json"), `${JSON.stringify({ ...moduleEntry, visible: true }, null, 2)}\n`);

  const revision = {
    title: "SQL Fundamentals — Revision",
    estimatedMinutes: 40,
    lastUpdated: today,
    status: "gold-standard",
    questionCount: 24,
    sections: [
      {
        id: "query-pipeline",
        title: "Logical query stages",
        body: "FROM and JOIN form source rows. WHERE filters them, GROUP BY forms groups, HAVING filters groups, SELECT chooses output, and ORDER BY plus LIMIT shape the final rows. This is a logical model; the optimizer may use a different physical plan while preserving the result.",
      },
      {
        id: "rows-groups-nulls",
        title: "Row, group, and NULL rules",
        body: "Outer joins preserve a named side, WHERE filters individual rows, HAVING filters completed groups, COUNT(expression) ignores NULL, and comparisons with NULL produce unknown. State the rule before writing syntax.",
      },
      {
        id: "integrity",
        title: "Database constraints and integrity",
        body: "Primary and unique keys identify rows, foreign keys protect relationships, and NOT NULL plus CHECK express valid state. Application validation improves messages; database constraints protect every write path.",
      },
      {
        id: "indexes",
        title: "B-tree access paths and planner choice",
        body: "B-tree indexes often help equality, range, and compatible ordering, but planners choose by estimated cost. Column order, selectivity, expressions, collation, table size, write cost, and engine behavior all affect the decision.",
      },
    ],
    notes: "Canonical M08 curriculum: three distinct gold-standard questions for every declared topic; all portable examples are executed against an in-memory SQLite database.",
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);
  console.log(`Wrote ${definitions.length} gold-standard SQL questions across ${topicOrder.length} topics.`);
}

writeModule();
