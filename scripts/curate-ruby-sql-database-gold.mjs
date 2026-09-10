#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/sql-database-basics-ruby";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "ruby-sql-select-basics": {
    answerSize: "compact",
    direct: "Active Record builds SQL SELECT queries through chainable relations. `where` filters rows, `order` defines result order, `limit` bounds the count, and `select` restricts columns while still returning model-like records; `pluck` immediately returns selected scalar values instead. A relation is usually lazy until records are needed, so scopes can compose before one query runs. Values must be passed through hash or placeholder conditions rather than interpolated into SQL.",
    quick: [
      "Active Record query methods usually return lazy, chainable relations.",
      "Use `where`, `order`, and `limit` to express filtering, order, and bounds.",
      "`select` returns partially loaded records; `pluck` returns raw selected values.",
      "Use hashes or bind placeholders for values instead of SQL interpolation.",
      "Inspect generated SQL and query plans when performance matters.",
    ],
    interview: [
      "- Active Record represents a SELECT query as a relation that can be built in steps. Methods such as `where`, `order`, `limit`, and `select` return another relation, so a controller or service can add conditions without immediately loading records.",
      "- For example, `Order.where(status: :paid).where('total_cents >= ?', 5_000).order(created_at: :desc).limit(20)` expresses filtering, safe value binding, deterministic order, and a bounded result. Rails sends the SQL when the relation is enumerated or another loading operation requires the rows.",
      "- `select(:id, :total_cents)` asks for specific columns but returns Order objects with only those attributes loaded. Accessing an unselected attribute can fail. `pluck(:id, :total_cents)` executes the query and returns simple arrays, avoiding model construction when only values are required.",
      "- Conditions supplied through a hash or placeholder keep data separate from SQL syntax and prevent an input value from becoming executable SQL. Raw fragments may still be useful for a database expression, but untrusted values must never be inserted with string interpolation.",
      "- I choose columns intentionally, add a stable order before paging, and avoid loading an unbounded table with `.all.to_a`. For a slow query, I inspect `to_sql`, logs, and the database execution plan; changing Ruby syntax without checking indexes and row counts may not address the real cost.",
    ],
    deepTitle: "A relation is a composable query plan until a result is demanded",
    deep: [
      "Relation laziness lets independent layers add constraints. A base scope can express active orders, authorization can restrict account IDs, and a request can add a page limit. If one layer converts the relation to an Array too early, later filtering happens in Ruby and the database loses the chance to optimise the complete query.",
      "Projection changes the result shape. Full model loading is convenient when behaviour and associations are needed. `select` creates records with a partial attribute set, while `pluck` returns values without model callbacks or instance methods. The narrowest truthful result saves transfer and allocation but should not surprise later callers.",
      "Ordering is part of a paged query's contract. SQL does not promise row order without `ORDER BY`; applying `limit` or offset pagination without a deterministic tie-breaker can return shifting pages. A compound order such as creation time plus ID gives equal timestamps a stable sequence.",
      "The query text is only one layer of performance. Cardinality, indexes, join shape, selected columns, cache state, and database statistics determine the plan. Rails logs and `EXPLAIN` connect the relation to what the database actually executes.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A relation accumulates clauses before SQL executes",
    visual: fence("mermaid", [
      "flowchart LR",
      "  M[Order model] --> W[where status and total]",
      "  W --> O[order by created_at and id]",
      "  O --> L[limit 20]",
      "  L --> R[relation: not loaded yet]",
      "  R -->|each / to_a / first| Q[SQL sent to database]",
      "  Q --> X[records or plucked values]",
    ]),
    codeTitle: "Build a safe, bounded relation",
    code: [
      "paid_orders = Order",
      "  .where(status: :paid)",
      "  .where('total_cents >= ?', 5_000)",
      "  .order(created_at: :desc, id: :desc)",
      "  .limit(20)",
      "",
      "# Executes and returns simple arrays rather than Order instances.",
      "summaries = paid_orders.pluck(:id, :total_cents)",
      "",
      "# Unsafe: Order.where(\"email = '#{params[:email]}'\")",
      "safe_order = Order.find_by(email: params[:email])",
    ],
    followups: [
      "When does an Active Record relation actually execute its SQL?",
      "How do `select` and `pluck` differ in their returned values?",
      "Why does paginated SQL need deterministic ordering?",
    ],
  },
  "ruby-sql-joins-ruby": {
    answerSize: "standard",
    direct: "A SQL join combines rows through a relationship condition. `INNER JOIN` keeps only matching rows; `LEFT OUTER JOIN` keeps every left-side row and fills missing right-side columns with NULL. In Rails, `joins(:comments)` normally creates an inner join for filtering, while `left_joins(:comments)` preserves records without comments. A join does not automatically preload the association, and one-to-many joins can duplicate parent rows, so selection, `distinct`, grouping, and eager loading must be chosen for the actual result needed.",
    quick: [
      "An inner join returns only rows that match on both sides.",
      "A left outer join preserves all left rows, even without a match.",
      "`joins` filters through an association but does not itself preload it.",
      "One-to-many joins can repeat a parent once for every matching child.",
      "Use database foreign keys and indexes to protect and support relationships.",
    ],
    interview: [
      "- A join asks the database to combine rows from related tables using an `ON` condition, usually a foreign key to primary key relationship. An inner join returns only pairs that satisfy the condition. A left outer join also returns left-table rows with no match, using NULL for the right-side columns.",
      "- In Rails, `Post.joins(:comments)` uses the association metadata to build an inner join. It is useful for a condition such as posts with approved comments. `Post.left_joins(:comments)` preserves posts that have no comments, which enables questions such as finding rows where the joined comment ID is null.",
      "- For example, one post with three approved comments appears in three joined database rows. If the application needs unique Post objects, `distinct` may be required. If it needs counts, `group` and an aggregate express that result more directly than loading the repeated rows into Ruby.",
      "- `joins` and eager loading solve different problems. A join shapes which rows match; later calling `post.comments` can still issue another query. `preload`, `includes`, or `eager_load` loads association data, with different query shapes. I choose them based on filtering and access rather than assuming any join removes N+1 queries.",
      "- The model association is application behaviour, while a database foreign-key constraint protects referential integrity for every writer. An index on the foreign-key column often supports join lookup. I check nullability, duplicate parent rows, missing relationships, and the generated SQL before deciding the join is correct.",
    ],
    deepTitle: "Join type controls which unmatched rows survive",
    deep: [
      "Imagine the left table as the set of posts and the right table as comments. The join condition compares each relevant foreign key. An inner join discards a post when no comment satisfies it. A left join emits one row for that post anyway, with null comment columns. A condition placed in `WHERE` can accidentally remove those null rows and turn the intended outer behaviour back into inner-like filtering.",
      "Join cardinality determines result multiplication. A belongs-to join contributes at most one matched parent for each child when the key is valid. A has-many join can produce many rows for one parent. This is not a database bug; the relational result represents every matching pair.",
      "Active Record usually returns model instances from the table named before `joins`, not a new combined object containing every column. Custom projections, aggregates, or plucked values should name aliases and result shapes clearly. Loading full models after grouping can be misleading when selected columns no longer represent one complete row.",
      "Performance follows the join keys, selectivity, and query plan. A foreign key enforces validity but does not replace deliberate indexing in every database. Explain output shows whether the database scans, uses an index, changes join order, or estimates far more rows than expected.",
    ],
    visualType: "comparison_table",
    visualTitle: "Which post rows survive each join?",
    visual: "| Post | Matching comments | Inner join rows | Left join rows |\n|---|---:|---:|---:|\n| A | 2 | 2 rows for A | 2 rows for A |\n| B | 1 | 1 row for B | 1 row for B |\n| C | 0 | no row | 1 row for C with comment columns NULL |\n| Parent uniqueness | — | not guaranteed | not guaranteed |",
    codeTitle: "Use join shape to answer a specific question",
    code: [
      "# Posts having at least one approved comment, once per post.",
      "reviewed = Post",
      "  .joins(:comments)",
      "  .where(comments: { approved: true })",
      "  .distinct",
      "",
      "# Posts with no associated comments.",
      "without_comments = Post",
      "  .left_joins(:comments)",
      "  .where(comments: { id: nil })",
      "",
      "# Joining does not promise that post.comments is preloaded.",
    ],
    followups: [
      "How can a WHERE condition accidentally remove the unmatched side of a left join?",
      "Why can a has-many join duplicate parent records?",
      "What is the difference between joining an association and preloading it?",
    ],
  },
  "ruby-active-record-vs-raw-sql": {
    answerSize: "standard",
    direct: "Use Active Record relations for most Rails queries because they compose with scopes and associations, bind values safely, and return application models. Use carefully isolated SQL when the database operation is clearer or more capable in SQL—for example, a recursive CTE, window function, vendor-specific feature, bulk statement, or measured hot query that the relation API cannot express well. Raw SQL should keep values bound, define its return shape, remain adapter-aware, and be protected by focused tests; it is not a shortcut around understanding the generated query.",
    quick: [
      "Prefer Active Record for common, composable application queries.",
      "Reach for SQL when database-native behaviour is materially clearer or required.",
      "Bind every untrusted value; never interpolate it into SQL text.",
      "Keep raw SQL behind a named boundary with a documented result shape.",
      "Measure the plan and runtime before claiming SQL is the faster choice.",
    ],
    interview: [
      "- Active Record is the default query boundary in Rails. Relations compose with scopes, associations, authorization, and pagination; value conditions are bound safely; and loaded rows become models with the application's normal type casting and behaviour. That makes ordinary reads and writes understandable across the codebase.",
      "- Raw SQL is appropriate when SQL expresses the operation more honestly than a complicated relation. Examples include recursive common-table expressions, window functions, database-specific JSON or full-text operators, carefully designed bulk updates, and performance-sensitive reports whose exact query plan matters.",
      "- For example, ranking each sale within its region is naturally one query with `ROW_NUMBER() OVER (PARTITION BY region_id ORDER BY total DESC)`. Recreating that operation by loading every sale and grouping in Ruby transfers more data and loses the database's set-based execution.",
      "- Raw SQL removes some Active Record protection. Placeholders or the adapter's bind API must keep values separate from syntax. The caller also needs to know whether the result is models, `ActiveRecord::Result`, affected-row count, or scalar values, and vendor-specific syntax can reduce portability.",
      "- I keep SQL in a repository or query object named after the business result, add tests for its result and edge cases, and review the execution plan with realistic data. The choice is not ORM versus performance: it is the clearest safe boundary that lets the database do the required work and the application understand the result.",
    ],
    deepTitle: "Choose the abstraction that exposes rather than hides the query",
    deep: [
      "Active Record is strongest when the relation is still recognisable as a database operation. Scopes can add predicates, joins, projections, and ordering while preserving a relation for later composition. This also allows cross-cutting rules such as account scope to remain visible instead of being rebuilt inside a SQL string.",
      "The abstraction becomes costly when a database-native operation is broken into many round trips or large Ruby collections. A raw query can express one atomic set operation, but only if its parameters, transaction boundary, and result mapping are explicit. Moving text into a heredoc alone does not make the design safer.",
      "Safety has several dimensions. Bind parameters address injection for values, but identifiers and SQL fragments cannot generally be bound the same way and need a trusted allowlist. Read-only intent, timeouts, transaction locks, and permission boundaries still matter even when the syntax is parameterised.",
      "Performance decisions need evidence. The generated SQL from Active Record may already match the hand-written form, and a missing index will harm both. Compare query plans, rows read, allocations, and end-to-end latency before accepting the maintenance and portability cost of a specialised query.",
    ],
    visualType: "comparison_table",
    visualTitle: "Select the query boundary by the work required",
    visual: "| Need | Active Record relation | Isolated raw SQL |\n|---|---|---|\n| common CRUD and association filters | strong default | unnecessary ceremony |\n| composition with scopes and authorization | natural | must be rebuilt deliberately |\n| window, recursive, or vendor feature | may become awkward | often clearer |\n| model objects and callbacks | native result | mapping must be explicit |\n| portability | generally higher | query may be adapter-specific |\n| safety | normal bind APIs | manual bind and fragment discipline |",
    codeTitle: "Bind values and name the raw result",
    code: [
      "class RegionalSalesRanking",
      "  SQL = <<~SQL",
      "    SELECT id, region_id, total_cents,",
      "           ROW_NUMBER() OVER (",
      "             PARTITION BY region_id ORDER BY total_cents DESC",
      "           ) AS regional_rank",
      "    FROM sales",
      "    WHERE sold_at >= $1",
      "  SQL",
      "",
      "  def self.since(time)",
      "    bind = ActiveRecord::Relation::QueryAttribute.new(",
      "      'sold_at', time, ActiveRecord::Type::DateTime.new",
      "    )",
      "    ActiveRecord::Base.connection.exec_query(SQL, name, [bind])",
      "  end",
      "end",
    ],
    followups: [
      "Why can values be bound while dynamic table or column names need an allowlist?",
      "What result type does `exec_query` return?",
      "Which measurements justify accepting adapter-specific SQL?",
    ],
  },
  "ruby-migrations-and-schema": {
    answerSize: "standard",
    direct: "Rails migrations are ordered, versioned programs that move a database schema forward or backward; the schema dump records the current structure after those changes. Rails stores applied migration versions in the database and runs only pending migrations. Once a migration has reached a shared environment, create a new corrective migration instead of rewriting history. Add database constraints and indexes deliberately, make reversibility explicit, and design production changes so old and new application versions can overlap safely during deployment.",
    quick: [
      "Migrations record ordered schema changes; the schema dump records current shape.",
      "Rails tracks which migration versions each database has applied.",
      "Do not edit a shared applied migration; add a new correction.",
      "Use `change` for reversible operations or explicit `up` and `down` when needed.",
      "Plan constraints, indexes, data movement, locks, and mixed-version deployment together.",
    ],
    interview: [
      "- A Rails migration is a versioned Ruby class that describes a database change such as creating a table, adding a column, or building an index. Rails records applied versions in the database, so `bin/rails db:migrate` executes only migrations that are still pending for that database.",
      "- The migration files are change history. `db/schema.rb` or `db/structure.sql` is a snapshot of the current database structure used for inspection and fast setup; it is not a replacement for planning the next production change. Rails updates the schema dump after migrations run.",
      "- For example, adding `account_id` to orders can include a reference, an index for lookup, and a database foreign key for referential integrity. Whether the column can immediately be non-null depends on existing rows and whether an older application version can still write orders without it.",
      "- Many DSL operations in `change` are automatically reversible. For an operation Rails cannot infer, I use `reversible` or explicit `up` and `down`. A rollback is not always safe for destructive changes, large data conversions, or code already deployed against the new shape, so recovery planning is wider than writing a down method.",
      "- I never edit an already shared migration to pretend history changed. I add a new migration, test a fresh schema and an upgrade path, inspect locks and runtime on production-sized data, and deploy additive changes before code that depends on them. This keeps every environment able to reach the same understood structure.",
    ],
    deepTitle: "Treat schema change as a compatibility timeline",
    deep: [
      "A migration version marks whether one database has crossed a change, not the complete state of every record. Schema changes and data backfills can have different operational needs. A small local table alteration may lock or rewrite a large production table, so row count and database capabilities belong in the migration review.",
      "Reversibility is semantic. Rails can invert `add_column`, but removing the column later cannot recreate discarded values. Renaming or changing types may require application code that reads both forms during a transition. Explicit down code documents mechanics but cannot promise business data will return.",
      "Zero-downtime changes normally expand before they contract. Add a nullable column or new table, deploy code that can work with both shapes, backfill and verify, switch reads, then enforce constraints or remove the old shape in a later release. This sequence protects requests handled by old and new processes during rollout.",
      "Database constraints are the final shared guard because every process and script writes through the same database. Model validations improve feedback but can race and can be bypassed. A schema review therefore considers nullability, foreign keys, uniqueness, indexes, default behaviour, and how failures surface in the application.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A safe additive schema rollout",
    visual: fence("mermaid", [
      "flowchart LR",
      "  A[add compatible schema] --> C[deploy code supporting old and new]",
      "  C --> B[backfill in controlled batches]",
      "  B --> V[verify completeness and performance]",
      "  V --> S[switch reads and writes]",
      "  S --> E[enforce final constraint]",
      "  E --> R[remove old shape in later release]",
    ]),
    codeTitle: "Add a relationship with database protection",
    code: [
      "class AddAccountToOrders < ActiveRecord::Migration[8.1]",
      "  def change",
      "    add_reference :orders, :account,",
      "      null: true,",
      "      foreign_key: true,",
      "      index: true",
      "  end",
      "end",
      "",
      "# Backfill existing rows separately, deploy compatible code,",
      "# then enforce null: false in a later reviewed migration.",
    ],
    followups: [
      "How is a migration different from `schema.rb` or `structure.sql`?",
      "Why can an automatically reversible migration still lose business data?",
      "What does expand-and-contract protect during a rolling deployment?",
    ],
  },
  "ruby-n-plus-one-intro": {
    answerSize: "standard",
    direct: "An N+1 query occurs when one query loads N parent records and later association access sends another query for each parent. For example, loading ten books and then calling `book.author` in a loop can produce eleven queries. Preload the association when the page will use it: `preload` uses separate association queries, `eager_load` uses a left outer join, and `includes` chooses an eager-loading strategy based on the relation. Verify query count; `joins` alone filters rows but does not guarantee the association is loaded.",
    quick: [
      "N+1 means one parent query followed by one association query per parent.",
      "The symptom grows with result count even when the Ruby loop looks simple.",
      "Use `preload`, `includes`, or `eager_load` according to query-shape needs.",
      "`joins` can filter related rows without filling the association cache.",
      "Confirm the fix in logs or query-count tests and avoid unused eager data.",
    ],
    interview: [
      "- N+1 is a query-count pattern caused by lazy association loading inside iteration. One query returns N parent records, then touching an unloaded association sends up to one more query per parent. The page works correctly but latency and database load grow with the number of rows displayed.",
      "- For example, `books = Book.limit(10)` issues one query. Calling `book.author.name` for every book can issue ten more author queries, for eleven total. `Book.preload(:author).limit(10)` normally uses one query for books and one for all required authors, reducing query count to two.",
      "- Rails provides related strategies. `preload` uses separate queries per named association. `eager_load` builds a left outer join. `includes` can use separate loading or a joined shape depending on how the relation references associated tables. The result and conditions decide which is appropriate.",
      "- `joins(:author)` is not itself a preload; it can constrain books by author columns while later `book.author` still loads lazily. Conversely, preloading a large nested graph that the response never touches wastes memory and data transfer. The fix should match the exact access path.",
      "- I identify N+1 through development logs, query instrumentation, or a query-count test, then verify the count stays bounded as N grows. I also inspect memory and returned rows so a query-count win does not hide excessive eager loading. `strict_loading` can make accidental lazy association access raise during selected flows, turning a hidden performance regression into an explicit failure.",
    ],
    deepTitle: "Association access changes query shape after the parent query",
    deep: [
      "The parent relation does not know which associations later presentation code will read unless the query declares them. Each model object carries an association cache. The first access can query and cache its own related rows, but ten parent objects still have ten separate caches and therefore ten opportunities to query.",
      "Separate-query preloading first obtains parent keys, then fetches related rows with an `IN` condition and attaches them to the correct objects. This avoids parent row multiplication. Joined eager loading brings columns together in one result but can repeat parent data for every child and complicate limits or aggregates.",
      "Nested access multiplies the risk. Rendering books, authors, and each author's profile can create another layer of lazy loads. The eager-loading declaration should mirror the associations actually traversed, while serializers and views should avoid accessing surprise relationships far from the query owner.",
      "A bounded query count is the durable assertion. A timing measurement can vary with cache and machine speed, while a test that renders 2 and 20 records and observes the same small query count directly protects the removed growth pattern.",
    ],
    visualType: "comparison_table",
    visualTitle: "Query count before and after preloading authors",
    visual: "| Books rendered | Lazy `book.author` | `preload(:author)` | Growth |\n|---:|---:|---:|---|\n| 1 | 2 queries | 2 queries | looks harmless |\n| 10 | 11 queries | 2 queries | N+1 becomes visible |\n| 100 | 101 queries | 2 queries | database round trips dominate |\n| Caveat | only queried authors are loaded | all referenced authors are loaded | preload only what the response uses |",
    codeTitle: "Load the association used by the response",
    code: [
      "# N+1: one books query, then an author query per book.",
      "books = Book.limit(20)",
      "names = books.map { |book| book.author.name }",
      "",
      "# Separate-query eager loading: normally two queries total.",
      "books = Book.preload(:author).limit(20)",
      "names = books.map { |book| book.author.name }",
      "",
      "# During development, selected relations can reject lazy loading.",
      "books = Book.strict_loading.preload(:author).limit(20)",
    ],
    followups: [
      "How do `preload`, `eager_load`, and `includes` differ?",
      "Why does `joins(:author)` not necessarily prevent lazy author queries?",
      "How can a query-count test prove the fix still works as N grows?",
    ],
  },
};

let curated = 0;
for (const topicDirectory of fs.readdirSync(root)) {
  const file = path.join(root, topicDirectory, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence("ruby", lesson.code) },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaDescription: `Learn ${question.question} with a direct answer, query or schema model, practical boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Ruby database lessons`);
}

console.log(`Curated ${curated} canonical Ruby database questions.`);
