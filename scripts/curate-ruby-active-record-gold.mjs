#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/active-record-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  { source: "basic-querying", target: "crud-basics", slug: "rails-activerecord-basic-querying" },
  { source: "n-plus-1-intro", target: "associations-basics", slug: "rails-activerecord-n-plus-1-intro" },
];

for (const migration of migrations) {
  const sourceFile = path.join(root, migration.source, "complete-qa.json");
  const targetFile = path.join(root, migration.target, "complete-qa.json");
  if (!fs.existsSync(sourceFile)) continue;
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  const question = source.questions?.find((entry) => entry.slug === migration.slug);
  if (!question) throw new Error(`${sourceFile}: missing ${migration.slug}`);
  if (!target.questions.some((entry) => entry.slug === migration.slug)) {
    target.questions.push(question);
    fs.writeFileSync(targetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const lessons = {
  "rails-activerecord-crud-basics": {
    answerSize: "standard",
    direct: "CRUD means Create, Read, Update, and Delete. Active Record maps those database operations to model objects and methods: `new` builds without saving, `create` builds and attempts an INSERT, finders read rows, `update` changes attributes and attempts an UPDATE, and `destroy` removes a record while running destroy callbacks. Normal persistence methods run validations and return a result that must be checked; bang methods such as `save!` raise when persistence fails.",
    quick: [
      "`new` builds an unsaved object; `create` builds and tries to persist it.",
      "`find(id)` raises when absent; `find_by(...)` returns one record or `nil`.",
      "`save` and `update` return success status after validations and callbacks.",
      "Bang forms such as `save!` and `update!` raise on validation failure.",
      "`destroy` runs callbacks; `delete` removes directly and skips them.",
    ],
    interview: [
      "- CRUD is the basic lifecycle of persisted data: create a row, read it, update it, and delete it. Active Record exposes that lifecycle through Ruby model objects while still issuing SQL to the configured relational database.",
      "- Creation has two stages. `Article.new(attributes)` creates an in-memory object whose `persisted?` value is false. `save` then validates it and attempts an INSERT. `Article.create(attributes)` combines those steps but still returns the object even when validation prevents persistence, so the caller must check `persisted?`, the method result, or `errors`.",
      "- For example, `Article.find(7)` reads the primary-key row and raises `ActiveRecord::RecordNotFound` when it is missing. `Article.find_by(slug: 'intro')` returns the first match or `nil`. A loaded article can call `update(title: 'New')`, which assigns, validates, and attempts an UPDATE.",
      "- The non-bang methods such as `save` and `update` report validation failure with `false`; bang variants raise `ActiveRecord::RecordInvalid`. `destroy` runs the model's destroy callbacks and association rules, while `delete` skips those callbacks and should be used only when that bypass is intentional.",
      "- Active Record makes ordinary persistence readable, but each call still has database, validation, callback, and transaction behaviour. Correct code chooses the method whose failure and callback contract it is prepared to handle. Multi-record changes that must succeed together should also be wrapped in one explicit database transaction for atomicity.",
    ],
    deepTitle: "An object moves between new, persisted, changed, and destroyed states",
    deep: [
      "An Active Record instance represents one row plus in-memory state. Before the first successful save it has no database identity. A successful INSERT assigns its primary key and clears tracked changes; later assignments remain in memory until another persistence method writes an UPDATE.",
      "Validation and callback chains surround normal writes. A failed validation stops the SQL write but leaves the attempted values and error messages on the object. Bang and non-bang methods run the same model rules; they differ mainly in whether failure becomes an exception or a false return value.",
      "Finder contracts matter at control-flow boundaries. `find` is appropriate when the record must exist and absence should take an exception path. `find_by` is appropriate when absence is a normal alternative the caller will branch on. Both still issue a query when evaluated.",
      "Deletion has two meanings. Destroying asks the model to perform its lifecycle, including callbacks and configured dependent associations. Deleting issues a direct removal that bypasses that model lifecycle. The faster-looking method can leave related data or side effects inconsistent if the lifecycle was part of the contract.",
    ],
    visualType: "comparison_table",
    visualTitle: "CRUD methods and their failure contracts",
    visual: "| Goal | Method | Database effect | Failure behaviour |\n|---|---|---|---|\n| Build | `Article.new(...)` | None | Object contains validation state later |\n| Create | `Article.create(...)` | INSERT if valid | Returns object, possibly unpersisted |\n| Read required row | `Article.find(id)` | SELECT | Raises when absent |\n| Read optional row | `Article.find_by(...)` | SELECT | Returns `nil` when absent |\n| Update | `article.update(...)` | UPDATE if valid | Returns `false` on validation failure |\n| Delete with lifecycle | `article.destroy` | DELETE if allowed | Runs destroy callbacks |\n| Delete directly | `article.delete` | DELETE | Skips destroy callbacks |",
    codeTitle: "Check the result instead of assuming persistence",
    code: [
      "article = Article.new(title: 'Active Record basics')",
      "article.persisted?                         # => false",
      "",
      "if article.save",
      "  puts \"created article #{article.id}\"",
      "else",
      "  puts article.errors.full_messages",
      "end",
      "",
      "found = Article.find_by(title: 'Active Record basics')",
      "found&.update(published: true)",
      "",
      "required = Article.find(article.id)        # raises if absent",
      "required.destroy                           # runs destroy callbacks",
    ],
    followups: [
      "What is the difference between `new`, `create`, and `create!`?",
      "When should a finder return `nil`, and when should it raise?",
      "Why can replacing `destroy` with `delete` change application behaviour?",
    ],
  },
  "rails-activerecord-basic-querying": {
    answerSize: "standard",
    direct: "Active Record queries are built by chaining relation methods such as `where`, `order`, `select`, `limit`, and `joins`. Most of these return an `ActiveRecord::Relation`, which stores a query plan and can be refined before SQL is executed when records are actually needed. `find` and `find_by` return individual model objects with different missing-record behaviour. Hash conditions and placeholder parameters keep values bound safely; interpolating untrusted input into SQL can create SQL injection.",
    quick: [
      "`where` returns a chainable relation, not one model object.",
      "Relations are normally lazy until records or aggregate results are needed.",
      "`find(id)` raises when absent; `find_by(...)` returns a record or `nil`.",
      "Chain `where`, `order`, `limit`, and `select` to express one query.",
      "Bind untrusted values with hashes or placeholders instead of SQL interpolation.",
    ],
    interview: [
      "- Active Record provides a Ruby query interface that builds SQL while returning model objects. Collection methods such as `where` usually return an `ActiveRecord::Relation`, so additional filters, ordering, limits, joins, and eager-loading choices can be chained before the query is run.",
      "- Relations are lazy in common use. `scope = Article.where(published: true)` records part of a query; adding `order(created_at: :desc).limit(10)` refines it. SQL is sent when code needs rows, for example through `each`, `to_a`, `first`, or a calculation such as `count`.",
      "- For example, `Article.where(author_id: 4).order(created_at: :desc).limit(5)` expresses one bounded query and returns Article instances. `find(7)` is a primary-key lookup that raises on absence, while `find_by(slug: 'welcome')` returns the first match or `nil`.",
      "- Query construction must preserve safety and intent. `where(email: params[:email])` or `where('price >= ?', minimum)` binds values separately from SQL. Building `where(\"email = '#{params[:email]}'\")` lets input change the query and is unsafe.",
      "- A readable relation should filter and select data in the database, request only what the endpoint needs, and be inspected with logs or `to_sql` when performance or generated SQL is unclear. Pagination must include a stable order, and association access should be reviewed separately for N+1 queries because a well-shaped parent relation can still trigger repeated child queries later during rendering or serialization.",
    ],
    deepTitle: "A relation is a composable query description",
    deep: [
      "An `ActiveRecord::Relation` holds clauses and model metadata rather than immediately loading every matching row. Each chain call produces a relation with another part of the intended SQL. This lets a reusable scope contribute one condition while its caller adds pagination or ordering.",
      "Execution boundaries differ. Iteration loads records; `count`, `exists?`, and `pluck` can ask the database for a smaller result; `first` adds a limit. Calling `to_a` early replaces the database's filtering options with in-memory Ruby work and can load far more rows than necessary.",
      "Selecting columns affects the model objects returned. `pluck(:id)` returns plain values, which is efficient when no model behaviour is required. `select(:id, :title)` returns partial model instances, and reading an omitted attribute may fail, so that optimisation must stay within a narrow boundary.",
      "Query values and SQL structure are separate concerns. Bound parameters let the database adapter quote values correctly and prevent an input string from becoming executable SQL. Dynamic column names or sort directions require allowlists because placeholders bind values, not arbitrary SQL identifiers.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Build first, execute when a result is requested",
    visual: fence("mermaid", [
      "flowchart LR",
      "  M[Article model] --> W[where published: true]",
      "  W --> O[order created_at desc]",
      "  O --> L[limit 10]",
      "  L --> R[ActiveRecord::Relation: still composable]",
      "  R -->|each / to_a / first| Q[execute SQL]",
      "  Q --> A[rows become Article objects]",
      "  R -->|pluck / count / exists?| S[execute smaller specialised query]",
    ]),
    codeTitle: "Compose one safe, bounded relation",
    code: [
      "recent = Article",
      "  .where(published: true, author_id: 4)",
      "  .where('created_at >= ?', 30.days.ago)",
      "  .order(created_at: :desc)",
      "  .limit(5)",
      "",
      "recent.to_sql               # inspect the generated SQL",
      "recent.each { |article| puts article.title } # executes and loads rows",
      "",
      "Article.find(7)             # Article or RecordNotFound",
      "Article.find_by(slug: 'welcome') # Article or nil",
      "Article.where(active: true).pluck(:id) # values without full objects",
    ],
    followups: [
      "When does an Active Record relation execute its SQL?",
      "What is the difference between `select` and `pluck`?",
      "Why can bound values not safely replace dynamic column names?",
    ],
  },
  "rails-activerecord-validations-basics": {
    answerSize: "standard",
    direct: "Active Record validations check a model's application-level rules before normal create or update operations write to the database. Declarations such as `validates :name, presence: true` add errors when the rule fails; `valid?` runs the checks, `errors` explains them, `save` returns `false`, and `save!` raises `ActiveRecord::RecordInvalid`. Validations improve feedback and domain consistency, but critical guarantees such as uniqueness, foreign keys, and non-null values also need database constraints because concurrent or bypassing writes can avoid model checks.",
    quick: [
      "Validations run before normal create and update persistence paths.",
      "A failed validation adds messages to `errors` and prevents that write.",
      "`save` returns `false`; `save!` raises `ActiveRecord::RecordInvalid`.",
      "Use model rules for clear feedback and cross-field domain checks.",
      "Back critical integrity with database constraints, especially uniqueness.",
    ],
    interview: [
      "- Active Record validations express conditions a model must satisfy before ordinary persistence. Built-in validators cover presence, length, numericality, format, inclusion, uniqueness, and associations, while custom methods can evaluate rules involving several attributes.",
      "- Running `valid?`, `save`, `create`, or `update` triggers the relevant validation context. When a rule fails, Rails keeps the object in memory, records details in `errors`, and skips the INSERT or UPDATE. Non-bang persistence returns a failure value; the bang form raises `ActiveRecord::RecordInvalid`.",
      "- For example, an Account can require an email and validate its format. A failed save lets an HTML form render `account.errors.full_messages`, while an API can map the same structured errors to a 422 response. The rejected values remain available for correction.",
      "- Model validation is not the final integrity boundary. Two requests can both pass a uniqueness check before either commits, and methods such as `update_all` can bypass callbacks and validations. A unique database index, `NOT NULL`, check constraint, or foreign key protects the stored data across every writer.",
      "- The two layers complement each other: validations provide domain-aware feedback before a write, and constraints guarantee that invalid state cannot be committed even under concurrency or alternative write paths. The application should translate a constraint failure safely at the boundary when it represents a known user-correctable conflict.",
    ],
    deepTitle: "Validation produces an error object before SQL is attempted",
    deep: [
      "A validation run starts with a model's current in-memory attributes. Each applicable rule can add one or more errors keyed by attribute or by the model as a whole. `valid?` returns a boolean but does not persist; `save` combines validation with the write only when no errors remain.",
      "Conditional and contextual validations change when rules apply. They are useful for genuine lifecycle differences, but too many contexts can make the model valid in one path and invalid in another without an obvious reason. A stable invariant should normally apply on every write.",
      "The uniqueness validator performs a query; it is not a lock. Concurrent transactions may observe no matching value and then both try to insert. A unique index lets the database arbitrate the race, while the application catches and translates the resulting constraint error where appropriate.",
      "Some APIs intentionally skip the model lifecycle for bulk operations or maintenance. Their names and documentation should make that bypass visible, and the database must still protect the rules that can never be relaxed. Tests should cover both the helpful model message and the actual database constraint.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Application feedback plus database guarantee",
    visual: fence("mermaid", [
      "flowchart TD",
      "  A[model attributes assigned] --> V[run validations]",
      "  V --> D{errors empty?}",
      "  D -->|no| E[return false or raise RecordInvalid; expose errors]",
      "  D -->|yes| S[attempt INSERT or UPDATE]",
      "  S --> C{database constraints pass?}",
      "  C -->|yes| P[commit valid row]",
      "  C -->|no| X[database rejects write]",
    ]),
    codeTitle: "Pair friendly validation with a real uniqueness guarantee",
    code: [
      "# app/models/account.rb",
      "class Account < ApplicationRecord",
      "  validates :email, presence: true,",
      "                    format: { with: URI::MailTo::EMAIL_REGEXP },",
      "                    uniqueness: { case_sensitive: false }",
      "end",
      "",
      "account = Account.new(email: '')",
      "account.save                    # => false",
      "account.errors.full_messages    # readable validation feedback",
      "account.save!                   # raises ActiveRecord::RecordInvalid",
      "",
      "# A migration should also create a unique index on a normalised email",
      "# so two concurrent writes cannot commit the same identity.",
    ],
    followups: [
      "What is the difference between `save` and `save!` after validation fails?",
      "Why is `validates :email, uniqueness: true` insufficient by itself?",
      "Which Active Record write methods can bypass validations?",
    ],
  },
  "rails-activerecord-associations-basics": {
    answerSize: "standard",
    direct: "Active Record associations declare relationships between model classes and provide methods for navigating and changing related records. In a one-to-many relationship, `Post has_many :comments` and `Comment belongs_to :post`; the foreign key normally lives on the belonging table as `comments.post_id`. The Ruby declarations do not replace database design: migrations should add the reference, index, null rule, and foreign key needed for integrity, and destructive dependency behaviour such as `dependent: :destroy` must be chosen explicitly.",
    quick: [
      "`belongs_to` is declared on the model whose table holds the foreign key.",
      "`has_many` exposes the collection on the other side of a one-to-many relation.",
      "Associations add methods such as `post.comments` and `comment.post`.",
      "A migration still supplies the column, index, nullability, and foreign key.",
      "Choose `dependent` behaviour deliberately; it controls related rows on deletion.",
    ],
    interview: [
      "- Active Record associations describe how model objects relate and add a Ruby API for traversing that relationship. Common forms are `belongs_to`, `has_one`, `has_many`, and many-to-many relationships through another model.",
      "- In a blog example, `Post has_many :comments` and `Comment belongs_to :post`. The `comments` table carries `post_id`, because each comment stores which post it belongs to. Rails then provides calls such as `post.comments`, `comment.post`, and `post.comments.build(body: 'Nice')`.",
      "- The model declarations and database schema have different jobs. The association defines object behaviour and options; a migration creates the reference column and should add an index and foreign-key constraint. `null: false` expresses that a comment cannot exist without a post when that is the domain rule.",
      "- Loading an association may issue a query, so iterating through parents and reading each child collection can create an N+1 problem. Eager loading and a query-conscious response boundary are needed when related data will be used for a collection.",
      "- Deletion behaviour is also explicit. `dependent: :destroy` loads and destroys children with callbacks; other choices delete directly, nullify keys, restrict deletion, or leave rows untouched. The association should match ownership and database constraints rather than being chosen only for convenience. Both sides should agree clearly about whether orphaned rows are valid.",
    ],
    deepTitle: "The object graph sits on top of foreign-key rows",
    deep: [
      "An association method starts from key metadata. `comment.post` uses the comment's `post_id` to find the matching post primary key. `post.comments` builds the inverse condition. The returned collection is an association relation, so it can often be filtered or ordered before loading.",
      "Building through an association sets linkage in memory. `post.comments.build` assigns the post relationship to the new comment; persistence still runs the comment's validation and write lifecycle. Creating the child does not automatically make a multi-record operation atomic, so transactions matter when several writes must succeed together.",
      "Database foreign keys protect references even when SQL, background jobs, or another service writes outside the Rails model. An index on the foreign-key column supports the lookup direction. Model-level presence rules improve feedback but cannot replace those database guarantees.",
      "Dependency options encode ownership. If comments have no meaning without their post, destroying them may be correct. If records must remain for audit, cascade deletion may be destructive. Model behaviour and database `ON DELETE` actions must be designed together so they do not contradict or unexpectedly duplicate work.",
    ],
    visualType: "concept_map",
    visualTitle: "One-to-many in Ruby and in the database",
    visual: fence("mermaid", [
      "flowchart LR",
      "  P[Post model: has_many comments] -->|post.comments| C1[Comment row id 11, post_id 7]",
      "  P --> C2[Comment row id 12, post_id 7]",
      "  C1 -->|comment.post via post_id| PR[Post row id 7]",
      "  C2 -->|foreign-key constraint| PR",
    ]),
    codeTitle: "Declare both object navigation and database integrity",
    code: [
      "class Post < ApplicationRecord",
      "  has_many :comments, dependent: :destroy",
      "end",
      "",
      "class Comment < ApplicationRecord",
      "  belongs_to :post",
      "end",
      "",
      "class AddPostToComments < ActiveRecord::Migration[8.1]",
      "  def change",
      "    add_reference :comments, :post,",
      "                  null: false, foreign_key: true",
      "  end",
      "end",
      "",
      "post.comments.build(body: 'Clear explanation')",
    ],
    followups: [
      "Which table owns the foreign key in a `has_many` / `belongs_to` relationship?",
      "What is the difference between an association declaration and a database foreign key?",
      "How do `dependent: :destroy` and direct dependent deletion differ?",
    ],
  },
  "rails-activerecord-n-plus-1-intro": {
    answerSize: "standard",
    direct: "An N+1 query occurs when code runs one query for a parent collection and then one additional association query for each of its N records. For example, loading posts and calling `post.author.name` in a loop can produce one posts query plus N author queries. `includes`, `preload`, or an appropriate join can fetch the required relationship in a bounded number of queries; the right choice depends on whether the related table is only loaded or also filters the result.",
    quick: [
      "N+1 means one collection query followed by one related query per row.",
      "It often hides inside a view, serializer, or loop that reads an association.",
      "`includes` or `preload` can load associations in a bounded number of queries.",
      "Use joins when related columns participate in filtering, with care for duplicate rows.",
      "Confirm the fix through query logs, tests, strict loading, or profiling—not guesswork.",
    ],
    interview: [
      "- The N+1 problem is a database access pattern where one query loads N parent records and later code issues one more query for each parent's association. Total queries grow with the number of displayed records even though the page performs one conceptual read.",
      "- For example, `posts = Post.limit(20)` may run one SELECT. A view that calls `post.author.name` for each post then triggers up to twenty author queries if the association was not already loaded, turning one data set into twenty-one round trips.",
      "- `Post.includes(:author).limit(20)` tells Active Record that authors will be needed and commonly loads them using a bounded extra query, then connects them in memory. `preload` explicitly uses separate association queries. `eager_load` uses a left outer join, and `joins` is useful for SQL filtering but does not by itself guarantee that later association reads are already loaded.",
      "- Eager loading everything is not a universal fix. It can transfer unused columns, create large joined result sets, or increase memory. The endpoint should load the relationships it actually renders, with pagination and carefully selected nesting.",
      "- Query logs make the repeated pattern visible; tools, strict loading, or query-count tests can prevent its return. The goal is a query count that stays roughly constant as the collection grows, while still loading only the relationships the response actually uses in practice on every page.",
    ],
    deepTitle: "Association laziness turns an innocent loop into repeated I/O",
    deep: [
      "A relation can load the parent rows without loading any association. Each association proxy remembers whether its target is loaded. The first read of an unloaded `post.author` asks the database for that one post's key; repeating the read for different posts repeats the round trip.",
      "Preloading collects keys from all parents and fetches matching children together, then assigns each child to its owner in memory. This changes the number of trips from a value proportional to N to a small bounded number, often two for one association.",
      "Join-based loading solves a different shape. It lets SQL filter or order by related columns, but parent data may be duplicated once per child row and pagination can become subtle. Separate preloading avoids row multiplication, while a join may be necessary for the actual predicate.",
      "Detection belongs near the rendered access path. A controller query can look harmless until a serializer asks for two nested associations. Development logs, Bullet-like tooling, strict loading, and request-level query assertions reveal the real boundary and protect it during later view changes.",
    ],
    visualType: "comparison_table",
    visualTitle: "Query count with lazy access and preloading",
    visual: "| Posts rendered | Lazy `post.author` | Preloaded authors |\n|---:|---:|---:|\n| 1 | 1 posts + 1 author = 2 | about 2 |\n| 20 | 1 posts + 20 authors = 21 | about 2 |\n| 100 | 1 posts + 100 authors = 101 | about 2 |\n\nThe exact number can vary with caches and query shape; the key difference is growth with N versus a bounded plan.",
    codeTitle: "Load the association the serializer will read",
    code: [
      "# N+1: author may be queried once for every post",
      "posts = Post.order(created_at: :desc).limit(20)",
      "posts.each { |post| puts post.author.name }",
      "",
      "# Bounded: posts and their authors are loaded in batches",
      "posts = Post.includes(:author)",
      "            .order(created_at: :desc)",
      "            .limit(20)",
      "posts.each { |post| puts post.author.name }",
      "",
      "# A filter on authors uses a join; preload can still serve later access",
      "Post.joins(:author)",
      "    .where(authors: { active: true })",
      "    .preload(:author)",
    ],
    followups: [
      "What is the difference between `includes`, `preload`, `eager_load`, and `joins`?",
      "Why can eager-loading every association also hurt performance?",
      "How would you prevent an N+1 regression in a request or serializer?",
    ],
  },
  "rails-activerecord-migrations-basics": {
    answerSize: "standard",
    direct: "An Active Record migration is a timestamped Ruby class that describes a database schema change, such as creating a table, adding a column, index, constraint, or foreign key. `bin/rails db:migrate` applies pending versions and records them; reversible operations in `change` can be rolled back, while complex changes use explicit `up` and `down`. Once a migration has run in shared environments, create a new corrective migration instead of editing history. The schema dump records current structure, while migrations record how it evolved.",
    quick: [
      "Migrations are ordered, versioned changes to database structure.",
      "`bin/rails db:migrate` applies only versions not yet recorded as run.",
      "Use `change` for reversible operations; use `up` and `down` when needed.",
      "Create a new migration to correct deployed history instead of editing it.",
      "Commit migrations and the updated schema dump; review constraints and indexes.",
    ],
    interview: [
      "- Active Record migrations let a team evolve the database schema through versioned Ruby files. Their timestamps establish order, and Rails records applied versions so each environment can move from its current schema to the same intended state.",
      "- A migration can create or change tables, columns, indexes, foreign keys, and constraints. The `change` method is concise when Rails knows the inverse operation. For an irreversible data or SQL transformation, explicit `up` and `down` methods state what applying and rolling back mean.",
      "- For example, adding `account_id` to invoices should include the appropriate type, index, foreign key, and null policy rather than only a column. `bin/rails db:migrate` applies it and updates `db/schema.rb` or the configured SQL structure dump to describe the resulting database.",
      "- A migration already run by teammates or production is shared history. Editing that file does not rerun it in those databases and makes fresh installations differ from existing ones. A new migration records the correction consistently.",
      "- Rollback capability is useful in development, but production safety also depends on table size, locks, old application versions, backfills, and deployment order. A syntactically reversible change is not automatically an operationally safe one. Large changes are often split into compatible stages: add, deploy code that understands both shapes, backfill, enforce, and remove the old shape later in a separate deployment after traffic has moved safely.",
    ],
    deepTitle: "Migrations are an ordered log; the schema file is a snapshot",
    deep: [
      "Rails compares timestamp versions in the migration directory with versions stored in the database's schema migration metadata. Pending files run in order. This mechanism coordinates schema state; it does not compare the Ruby source of a migration that was already marked complete.",
      "Reversibility is operation-specific. Rails can invert common changes such as creating a table or adding a column when enough information is present. Removing data, executing arbitrary SQL, or transforming values may not have a truthful automatic inverse, so the author must supply one or mark the operation irreversible.",
      "The schema dump represents the current shape used for inspection and loading a fresh database. It is not a replacement for migration review and should not be manually used as a hidden migration. Both the migration and resulting dump normally belong in version control.",
      "Large production changes need staged compatibility. A new nullable column may be deployed before application code writes it, data can be backfilled in controlled batches, then constraints can be tightened later. This allows old and new application processes to operate during a rolling deploy without long locks or invalid reads.",
    ],
    visualType: "flow_diagram",
    visualTitle: "From ordered migration history to current schema",
    visual: fence("mermaid", [
      "flowchart LR",
      "  M1[001 create accounts] --> M2[002 create invoices]",
      "  M2 --> M3[003 add account reference]",
      "  M3 --> DB[(database records applied versions)]",
      "  DB --> S[db/schema.rb or structure.sql: current snapshot]",
      "  C[needed correction] --> M4[004 corrective migration, not edit 003]",
      "  M4 --> DB",
    ]),
    codeTitle: "Add the relationship with its integrity rules",
    code: [
      "class AddAccountToInvoices < ActiveRecord::Migration[8.1]",
      "  def change",
      "    add_reference :invoices, :account,",
      "                  null: false, foreign_key: true",
      "  end",
      "end",
      "",
      "# Apply pending versions:",
      "# bin/rails db:migrate",
      "",
      "# Roll back the latest reversible version in development:",
      "# bin/rails db:rollback",
    ],
    followups: [
      "What makes a `change` migration reversible?",
      "Why should an already-deployed migration not be edited?",
      "How does a migration differ from `schema.rb` or `structure.sql`?",
    ],
  },
};

const directories = ["crud-basics", "validations-basics", "associations-basics", "migrations-basics"];
let curated = 0;
for (const directory of directories) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions)) throw new Error(`${file}: missing questions`);
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = 8;
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
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Active Record lessons`);
}

console.log(`Curated ${curated} canonical Active Record questions.`);
