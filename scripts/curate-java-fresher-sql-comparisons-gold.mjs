#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/sql-fundamentals/comparisons/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const paragraphs = (...parts) => parts.join("\n\n");

const lessons = {
  "union-vs-union-all-in-sql": {
    question: "What is the difference between UNION and UNION ALL in SQL?",
    title: "UNION vs UNION ALL in SQL",
    direct: "`UNION` combines compatible query results and removes duplicate rows from the final result. `UNION ALL` keeps every row, including duplicates, so it avoids duplicate-elimination work and is usually the right choice when duplicates are valid.",
    difficulty: "easy",
    minutes: 7,
    quick: [
      "Both operators stack result rows; they do not join columns side by side.",
      "Each query must return the same number of columns with compatible types.",
      "`UNION` removes duplicate rows across the complete selected row.",
      "`UNION ALL` preserves duplicates and is normally cheaper to execute.",
      "Neither operator guarantees output order; apply one final `ORDER BY` when order matters.",
    ],
    interview: paragraphs(
      "`UNION` and `UNION ALL` combine the rows produced by two or more queries. Each query must return the same number of columns, and columns in the same position must have compatible data types.",
      "The difference is duplicate handling. `UNION` removes repeated result rows, while `UNION ALL` keeps every row. If a current-orders query returns customer `42` twice and an archive query returns it once, `UNION ALL` keeps three rows. `UNION` returns one row when customer ID is the only selected column.",
      "Removing duplicates takes extra work, usually through a sort, hash, or another database strategy. I use `UNION ALL` when every source row matters or the sources cannot overlap. I use `UNION` only when the required answer is a distinct set.",
      "Duplicate identity is based on every selected column, and neither operator guarantees output order. Adding an order ID may make similar rows distinct, while a final `ORDER BY` is required when the combined result needs a stable order.",
    ),
    deepTitle: "Duplicate identity comes from the selected row",
    deep: "Duplicate elimination sees the projected result, not the hidden source records. Selecting only `email` may collapse several accounts that share an address, while selecting `account_id, email` keeps them separate. The chosen columns therefore define what `UNION` considers one row.\n\nSet operations happen after each input query has produced its own result. A clause such as `LIMIT` or `ORDER BY` intended for one input may need parentheses; otherwise it can apply to the combined result or be rejected by the database.\n\nExecution plans are implementation choices, so “UNION always sorts” is too strong. What is guaranteed is distinct output; the engine may use sorting, hashing, or another strategy to achieve it.",
    visualTitle: "Rows kept by each operator",
    visual: "| Left result | Right result | `UNION ALL` | `UNION` |\n|---|---|---|---|\n| `(1, 'Ada')` | `(1, 'Ada')` | Two rows | One row |\n| `(1, 'Ada')` | `(2, 'Ada')` | Two rows | Two rows |\n| `(1)` twice | `(1)` once | Three rows | One row |",
    codeTitle: "Combine active and archived events",
    code: "```sql\nSELECT event_id, occurred_at, 'active' AS source\nFROM active_events\n\nUNION ALL\n\nSELECT event_id, occurred_at, 'archive' AS source\nFROM archived_events\nORDER BY occurred_at DESC;\n```\n\n`UNION ALL` preserves each event. The literal source column also makes records from the two tables distinguishable.",
    practiceTitle: "Change the selected columns",
    practice: "If `UNION` unexpectedly removes rows, run each input separately and compare every selected column. Add a stable record identifier only when the business result needs record identity, not merely to defeat duplicate removal.",
    followups: [
      "What makes two rows duplicates for `UNION`?",
      "Why is `UNION ALL` usually cheaper?",
      "Where should `ORDER BY` go for the combined result?",
    ],
  },
  "delete-vs-truncate-vs-drop-in-sql": {
    question: "What is the difference between DELETE, TRUNCATE, and DROP in SQL?",
    title: "DELETE vs TRUNCATE vs DROP in SQL",
    direct: "`DELETE` removes selected rows and can use `WHERE`; `TRUNCATE` empties a table without processing a normal row deletion for each row; `DROP` removes the table definition as well as its data. Transaction rollback, logging, identity or sequence reset, trigger behaviour, locking, and foreign-key restrictions vary by database. PostgreSQL and SQL Server can roll back `TRUNCATE` inside a transaction, while MySQL makes it an implicit commit, so those details must be checked for the actual database.",
    layout: "comparison-arena",
    difficulty: "easy",
    minutes: 8,
    quick: [
      "`DELETE` removes rows and may use a `WHERE` condition.",
      "`TRUNCATE` empties the table but keeps its definition.",
      "`DROP` removes the table object, including its stored data.",
      "`TRUNCATE` normally avoids row-by-row deletion work and may take a strong table lock.",
      "Rollback, identity reset, triggers, and foreign-key rules are database-specific.",
    ],
    interview: paragraphs(
      "`DELETE`, `TRUNCATE`, and `DROP` change different scopes. `DELETE` removes rows, `TRUNCATE` empties a complete table while keeping its definition, and `DROP` removes the table object as well as its data.",
      "For example, `DELETE FROM orders WHERE status = 'CANCELLED'` removes selected orders. `TRUNCATE TABLE staging_orders` clears every staging row without a `WHERE` clause. `DROP TABLE old_orders` removes the table definition after the application no longer needs it.",
      "`DELETE` follows the normal row-deletion path, so deleting many rows can create substantial index and transaction-log work. `TRUNCATE` can reset table storage more directly and is often faster for a complete reset, but it may need stronger locks or privileges and can be blocked by foreign keys.",
      "Rollback, triggers, and generated-number reset are database-specific. PostgreSQL and SQL Server can roll back a truncate inside a transaction, while MySQL performs an implicit commit. I choose the least destructive statement that matches the required scope and check the target database before relying on recovery behaviour.",
    ),
    deepTitle: "The same three words cross different database layers",
    deep: "A row deletion keeps the relation itself available. The database locates qualifying rows, updates indexes, enforces constraints, and records enough transactional information for its storage engine. Under multi-version concurrency control, old row versions may remain until cleanup. A `WHERE` clause gives `DELETE` its selective power, but it also means the cost follows the number of affected rows and indexes.\n\nTruncation asks the engine to make the entire relation empty. It generally avoids the normal per-row path, but that does not make it a universal constant-time or non-logged operation. Engines still record metadata or allocation changes, coordinate replicas, and acquire locks. Delete triggers may not run because rows are not deleted through the normal operation; dedicated truncate triggers exist in PostgreSQL, while MySQL says ordinary `ON DELETE` triggers do not fire.\n\nTransaction and sequence rules are dialect features. PostgreSQL documents `TRUNCATE` as transaction-safe and makes `RESTART IDENTITY` explicit. SQL Server also documents rollback support and resets an identity to its seed. MySQL performs an implicit commit and resets `AUTO_INCREMENT`. A correct production answer therefore names the database before promising rollback or the next generated key.\n\nDropping changes the schema rather than only its contents. Views, foreign keys, permissions, prepared statements, migrations, and application deployments may depend on that object. Safe work starts by confirming the intended scope, inspecting dependencies, taking the required backup or snapshot, rehearsing recovery, and using the least destructive statement that satisfies the requirement.",
    visualTitle: "Portable distinction and vendor boundary",
    visual: "| Question | `DELETE` | `TRUNCATE` | `DROP` |\n|---|---|---|---|\n| What changes? | Matching rows | All rows | Table object and its data |\n| Row filter? | `WHERE` is allowed | No | Not applicable |\n| Table remains? | Yes | Yes | No |\n| Typical work | Normal row-delete path | Storage/allocation reset | Schema removal |\n| Rollback? | Usually inside a transaction | PostgreSQL/SQL Server: yes; MySQL: implicit commit | Database-specific |\n| Generated-number reset? | Usually continues | Database and option-specific | Object no longer exists |",
    codeTitle: "Choose the operation from the intended scope",
    code: "```sql\n-- Remove only selected rows; the table remains.\nDELETE FROM orders\nWHERE status = 'CANCELLED';\n\n-- Empty the complete staging table; details vary by database.\nTRUNCATE TABLE staging_orders;\n\n-- Remove an obsolete table after its dependencies are migrated.\nDROP TABLE old_orders;\n```\n\nThe statements are not simply faster versions of the same operation. They express three different changes, so recovery, constraints, locks, and dependencies should be checked first.",
    followups: [
      "Why can TRUNCATE be faster than deleting every row?",
      "Can TRUNCATE be rolled back in PostgreSQL, SQL Server, and MySQL?",
      "Which dependencies should be checked before dropping a table?",
    ],
  },
  "where-vs-having-in-sql-row-vs-group-filtering": {
    question: "What is the difference between WHERE and HAVING in SQL?",
    title: "WHERE vs HAVING in SQL",
    direct: "`WHERE` filters source rows before grouping, while `HAVING` filters groups after `GROUP BY` and aggregate calculation. Put ordinary row conditions in `WHERE` and use `HAVING` for conditions about a group such as `COUNT(*) >= 5`.",
    difficulty: "easy",
    minutes: 7,
    quick: [
      "`WHERE` decides which input rows reach grouping and aggregation.",
      "`HAVING` decides which completed groups remain in the result.",
      "Aggregate conditions such as `SUM(amount) > 1000` belong in `HAVING`.",
      "A query may use both clauses because they answer different questions.",
      "Moving a condition across the grouping boundary can change both totals and returned groups.",
    ],
    interview: paragraphs(
      "`WHERE` and `HAVING` both filter data, but they work at different stages. `WHERE` filters individual source rows before grouping. `HAVING` filters completed groups after `GROUP BY` and aggregate values have been calculated.",
      "For example, `WHERE status = 'PAID'` removes unpaid orders before any total is calculated. After the remaining orders are grouped by customer, `HAVING SUM(total) > 10000` keeps only customers whose paid-order total is above 10,000. One query can therefore use both clauses.",
      "This order affects the result. A date or status condition in `WHERE` changes which rows contribute to `COUNT`, `SUM`, or `AVG`. An aggregate condition belongs in `HAVING` because that value does not exist at the `WHERE` stage.",
      "The simple rule is to ask what the condition describes. A fact about one row normally belongs in `WHERE`; a fact about a completed group belongs in `HAVING`. Some databases allow extra `HAVING` forms, but they should not replace a clear row filter.",
    ),
    deepTitle: "Logical SQL Query Order",
    deep: "A useful logical model is `FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`. Database engines may physically reorder safe operations, but the result must behave as though these stages occurred in that order.\n\nThis explains why a `SELECT` alias often cannot be used in `WHERE`: the select list has not logically produced it yet, and alias rules vary between products. A repeated aggregate expression in `HAVING`, a subquery, or a common table expression can make the stage explicit.\n\nWithout `GROUP BY`, some databases allow `HAVING` to filter one implicit aggregate group. That is valid in particular dialects but does not turn `HAVING` into a general replacement for `WHERE`.",
    visualTitle: "Two filters at two stages",
    visual: "```mermaid\nflowchart LR\n  A[Rows from FROM and JOIN] --> B[WHERE: keep qualifying rows]\n  B --> C[GROUP BY and aggregates]\n  C --> D[HAVING: keep qualifying groups]\n  D --> E[SELECT result]\n```",
    codeTitle: "Filter paid rows, then high-value customers",
    code: "```sql\nSELECT customer_id, COUNT(*) AS paid_orders, SUM(total) AS revenue\nFROM orders\nWHERE status = 'PAID'\n  AND order_date >= DATE '2026-01-01'\nGROUP BY customer_id\nHAVING COUNT(*) >= 5\n   AND SUM(total) > 10000\nORDER BY revenue DESC;\n```\n\nOnly paid 2026 orders enter the aggregates; the two `HAVING` predicates then test each customer's completed group.",
    practiceTitle: "Name the subject of each predicate",
    practice: "In `status = 'PAID'`, `status` belongs to one order row. In `COUNT(*) >= 5`, the count belongs to a customer group. That subject test normally identifies the correct clause.",
    followups: [
      "Can a query contain both `WHERE` and `HAVING`?",
      "Why can an aggregate not normally appear in `WHERE`?",
      "How does moving a date filter after grouping change a total?",
    ],
  },
  "char-vs-varchar-in-sql-fixed-vs-variable-length": {
    question: "What is the difference between CHAR and VARCHAR in SQL?",
    title: "CHAR vs VARCHAR in SQL",
    direct: "`CHAR(n)` represents fixed-length character data and normally pads shorter values, while `VARCHAR(n)` represents variable-length character data up to a limit. Exact length, storage, trailing-space, Unicode, and comparison rules depend on the database and collation.",
    difficulty: "easy",
    minutes: 8,
    quick: [
      "`CHAR(n)` is fixed length; shorter values are normally space-padded to the declared width.",
      "`VARCHAR(n)` stores variable-length values up to the declared limit.",
      "Choose `CHAR` only when values truly have a stable fixed width, such as some codes.",
      "Choose `VARCHAR` for names, email addresses, titles, and most varying text.",
      "Check the actual database for byte/character limits, trailing spaces, collations, and Unicode types.",
    ],
    interview: paragraphs(
      "`CHAR(n)` stores fixed-length character data, while `VARCHAR(n)` stores character data whose length can vary up to a limit. A shorter `CHAR` value is normally padded to its declared width; `VARCHAR` keeps a varying length.",
      "A two-letter country code is a reasonable `CHAR(2)` example because every valid value has the same width. Names, email addresses, and product titles vary naturally, so `VARCHAR` is usually a better match for them.",
      "The type should describe the data rather than follow a speed slogan. A large `CHAR` can waste space and introduce surprising trailing-space behaviour. `VARCHAR` has some length metadata, but that small cost rarely makes fixed-width storage correct for changing text.",
      "Exact rules differ by database. The declared limit may involve characters or bytes, and collation affects equality and sorting. Unicode support and trailing-space behaviour also vary, so I choose from the data contract first and verify those details in the target database.",
    ),
    deepTitle: "A type declaration is also a data contract",
    deep: "Length is only one part of character storage. The character set determines how text maps to bytes, and the collation determines equality and order. A declaration that works for ASCII codes may behave differently for multilingual user text.\n\nPadding is especially easy to misunderstand. The stored representation, retrieved value, and comparison behavior are not identical concepts, and products expose different rules. Tests should include the maximum length, multibyte characters, trailing spaces, and values that differ only by case when those details matter.\n\nFor most changing business text, `VARCHAR` or the product's unconstrained text type expresses intent better. A constraint can separately enforce an exact code shape.",
    visualTitle: "Choose from the data contract",
    visual: "| Requirement | Typical starting type | Verify in the target database |\n|---|---|---|\n| Exactly two-character code | `CHAR(2)` or constrained `VARCHAR(2)` | Padding and comparison rules |\n| Name or email with varying length | `VARCHAR(n)` | Character versus byte limit |\n| Large free-form text | Product-specific text type | Size, indexing, and row limits |\n| Multilingual text | Unicode-capable configuration/type | Encoding and collation |",
    codeTitle: "Declare fixed and varying domains explicitly",
    code: "```sql\nCREATE TABLE customer_profile (\n    customer_id BIGINT PRIMARY KEY,\n    country_code CHAR(2) NOT NULL,\n    display_name VARCHAR(120) NOT NULL,\n    email_address VARCHAR(254) NOT NULL,\n    CONSTRAINT country_code_width\n        CHECK (CHAR_LENGTH(TRIM(country_code)) = 2)\n);\n```\n\nThe constraint states the meaningful width. Function names and trailing-space behavior should still be checked for the chosen database.",
    practiceTitle: "Test the dialect boundary",
    practice: "Before migrating schemas, insert a multibyte name and values with trailing spaces, then inspect length, byte length, equality, and retrieval in the destination database. Do not infer those results from the type names alone.",
    followups: [
      "How can a multibyte character set change the meaning of a length limit?",
      "Why are trailing spaces a portability concern?",
      "When can a constrained `VARCHAR` be clearer than `CHAR`?",
    ],
  },
  "join-vs-subquery-in-sql": {
    question: "What is the difference between a JOIN and a subquery in SQL?",
    title: "JOIN vs Subquery in SQL",
    direct: "A `JOIN` combines related row sources into one table expression, while a subquery supplies a derived table, scalar value, or existence/set test to another query. Choose the form that expresses the required relationship; the optimizer may transform equivalent forms.",
    difficulty: "medium",
    minutes: 9,
    quick: [
      "A join matches rows from two table expressions and can return columns from both.",
      "A subquery can return a table, one value, or a result used by `EXISTS`, `IN`, or a comparison.",
      "Use `EXISTS` when the question is only whether at least one related row exists.",
      "A join can multiply rows when one left row matches several right rows.",
      "Do not assume every subquery is slower; inspect the execution plan for the real database and data.",
    ],
    interview: paragraphs(
      "A `JOIN` combines related row sources, while a subquery is a query used inside another statement. A subquery can supply a table, one value, or a set used by `EXISTS`, `IN`, or a comparison. They solve overlapping problems, but they do not always produce the same shape of result.",
      "For example, a report that needs each order and its customer name naturally uses a join. A query that only needs customers who have at least one paid order can use `EXISTS`. That form asks a yes-or-no question and returns each customer once, while a join may repeat a customer for every matching order.",
      "The choice comes from the required output and row count. Use a join when columns from related rows are needed, `EXISTS` for presence, a scalar subquery for one value, and a derived subquery when aggregation should produce one row per key before another step.",
      "A subquery is not automatically slower than a join. Database optimizers can transform many equivalent forms, and performance depends on indexes, data size, selectivity, and statistics. I choose the clearest correct form, then inspect the execution plan for an important query.",
    ),
    deepTitle: "Cardinality is the hidden decision",
    deep: "Before choosing syntax, write the expected number of rows at each boundary. A customer-to-orders join is one-to-many, so customer columns repeat. `EXISTS` is a semi-join idea: it returns the outer customer once when any matching order exists and does not expose the matching order rows.\n\nScalar subqueries require at most one row; more than one normally causes an error. `IN` and `NOT IN` have three-valued logic around `NULL`, making `NOT EXISTS` a safer anti-match expression in many cases.\n\nPerformance depends on indexes, selectivity, statistics, data volume, and optimizer transformations. Equivalent logical forms can share a plan, while small wording changes can produce very different work.",
    visualTitle: "Select the form from the required result",
    visual: "```mermaid\nflowchart TD\n  A[What must the outer result learn?] --> B{Columns from related rows?}\n  B -- Yes --> J[JOIN]\n  B -- No --> C{Only whether a match exists?}\n  C -- Yes --> E[EXISTS / NOT EXISTS]\n  C -- No --> D{One value or a derived grouped table?}\n  D -- One value --> S[Scalar subquery]\n  D -- Derived rows --> F[Subquery in FROM, then join/filter]\n```",
    codeTitle: "Return details or test existence",
    code: "```sql\n-- Need columns from both tables\nSELECT o.order_id, c.customer_name\nFROM orders AS o\nJOIN customers AS c ON c.customer_id = o.customer_id;\n\n-- Need each qualifying customer once\nSELECT c.customer_id, c.customer_name\nFROM customers AS c\nWHERE EXISTS (\n    SELECT 1\n    FROM orders AS o\n    WHERE o.customer_id = c.customer_id\n      AND o.status = 'PAID'\n);\n```",
    practiceTitle: "Predict row multiplication",
    practice: "If one customer has three paid orders, the join can produce three customer-order rows. The `EXISTS` query still produces one customer row. Choose based on which result the application needs.",
    followups: [
      "Why can a join produce duplicate-looking outer rows?",
      "When is `EXISTS` clearer than a join?",
      "Why is `NOT IN` risky when the subquery can return `NULL`?",
    ],
  },
  "inner-join-vs-where-for-multi-table-queries": {
    question: "How do explicit INNER JOIN ... ON and comma joins with WHERE differ?",
    title: "Explicit INNER JOIN vs Comma Join Syntax",
    direct: "For a two-table inner join, `FROM a JOIN b ON ...` and `FROM a, b WHERE ...` can return the same rows. Explicit `JOIN ... ON` separates relationships from result filters, scales better to several tables, and reduces accidental Cartesian products.",
    difficulty: "medium",
    minutes: 8,
    quick: [
      "A comma-separated `FROM` list first represents a cross join; `WHERE` then filters its row pairs.",
      "An explicit inner join puts the row relationship in `ON` and other filters in `WHERE`.",
      "For a simple inner join, the two forms can be logically equivalent.",
      "Explicit joins are easier to review and safer as more tables are added.",
      "For outer joins, moving a right-side predicate between `ON` and `WHERE` can change the result.",
    ],
    interview: paragraphs(
      "For a simple inner join, `FROM orders o, customers c WHERE o.customer_id = c.customer_id` can return the same rows as `FROM orders o JOIN customers c ON o.customer_id = c.customer_id`. The first is older comma syntax; the second states the join explicitly.",
      "Explicit syntax is clearer because `ON` shows how the tables are related and `WHERE` shows which joined rows should remain. With several tables, keeping each relationship beside its table makes a missing condition easier to find.",
      "For example, forgetting the relationship in comma syntax pairs every order with every customer. That is a Cartesian product. If every combination is intentional, `CROSS JOIN` says so directly; otherwise `JOIN ... ON` makes the expected relationship visible.",
      "The distinction matters even more with outer joins. A right-table condition in `ON` controls matching while preserving an unmatched left row, but the same condition in `WHERE` can remove that row. Equivalent inner-join forms usually have similar plans, so explicit joins are preferred mainly for clarity and safer maintenance.",
    ),
    deepTitle: "Relationship and filtering are separate responsibilities",
    deep: "A query becomes easier to reason about when the join tree is complete before result filters are considered. Each `JOIN` introduces a row source and its matching rule. The `WHERE` clause then narrows the virtual table produced by those joins.\n\nFor inner joins, a predicate can often move between `ON` and `WHERE` without changing rows. Outer joins introduce unmatched rows, so the stage becomes observable. A predicate in `ON` can prevent a right-side match while preserving the left row; the same predicate in `WHERE` can reject the preserved row because its right-side columns are `NULL`.\n\nThis is why comma syntax is more than old-fashioned formatting: it removes the visible boundary that becomes essential for outer joins.",
    visualTitle: "Where a predicate acts",
    visual: "| Form | Relationship location | Result filters | Main boundary |\n|---|---|---|---|\n| `a JOIN b ON relation WHERE filter` | Beside joined table | Separate `WHERE` | Clear for inner and outer joins |\n| `a, b WHERE relation AND filter` | Mixed into `WHERE` | Same clause | Easy to omit or obscure a relationship |\n| `a CROSS JOIN b` | Intentional all-pairs relationship | Optional `WHERE` | Makes Cartesian product explicit |",
    codeTitle: "Keep relationship beside the table",
    code: "```sql\n-- Preferred explicit inner join\nSELECT o.order_id, c.customer_name\nFROM orders AS o\nJOIN customers AS c\n  ON c.customer_id = o.customer_id\nWHERE o.status = 'PAID';\n\n-- Equivalent for this inner-join case, but harder to maintain\nSELECT o.order_id, c.customer_name\nFROM orders AS o, customers AS c\nWHERE c.customer_id = o.customer_id\n  AND o.status = 'PAID';\n```",
    practiceTitle: "Protect the outer-join meaning",
    practice: "For a left join that must retain customers with no paid order, put the paid-order requirement in the `ON` clause. Putting `o.status = 'PAID'` in `WHERE` removes rows whose joined order columns are `NULL`.",
    followups: [
      "What happens when a comma-join condition is omitted?",
      "Why can moving a predicate change a left join?",
      "When should `CROSS JOIN` be written explicitly?",
    ],
  },
};

for (const entry of document.questions) {
  const lesson = lessons[entry.slug];
  if (!lesson) continue;

  entry.question = lesson.question;
  entry.title = lesson.title;
  entry.direct_answer = lesson.direct;
  entry.layout_type = lesson.layout ?? (lesson.difficulty === "medium" ? "comparison-and-decision" : "comparison");
  entry.difficulty = lesson.difficulty;
  entry.importance = "high";
  entry.reading_time_minutes = lesson.minutes;
  delete entry.interviewer_intent;
  delete entry.speakable_v2;
  entry.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: "compact",
        content: lesson.interview,
      },
      { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
      {
        type: lesson.visual.startsWith("```mermaid") ? "flow_diagram" : "comparison_table",
        title: lesson.visualTitle,
        content: lesson.visual,
      },
      { type: "code_example", title: lesson.codeTitle, content: lesson.code },
      ...(lesson.practice
        ? [{ type: "practice_prompt", title: lesson.practiceTitle, content: lesson.practice }]
        : []),
    ],
  };
  entry.followup_questions = lesson.followups;
  entry.seo = {
    metaTitle: `${lesson.title} | InterviewExplainer`,
    metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
  };
}

const missing = Object.keys(lessons).filter(
  (slug) => !document.questions.some((entry) => entry.slug === slug),
);
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${Object.keys(lessons).length} SQL comparison lessons; preserved IDs, slugs, and order.`);
