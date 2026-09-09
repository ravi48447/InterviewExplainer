#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/active-record-basics/crud-basics/complete-qa.json",
    slug: "rails-activerecord-crud-basics",
    question: "What is CRUD and how does ActiveRecord do it?",
    answerSize: "compact",
    redundantVisualType: "comparison_table",
    beats: [
      {
        cue: "Define CRUD as the stored record lifecycle",
        stage: "CRUD is a row lifecycle",
        spokenText: "CRUD means Create, Read, Update, and Delete. Active Record maps those database operations to Ruby model objects and methods. The API is convenient, but each method still has a clear persistence, validation, callback, and failure contract that the caller must understand.",
      },
      {
        cue: "Separate building an object from successfully storing it",
        stage: "Create can fail validation",
        spokenText: "`Article.new(...)` builds an in-memory object and does not insert a row. `save` validates it and returns `true` or `false`; `save!` raises on validation failure. `Article.create(...)` combines building and saving but can still return an invalid, unpersisted object, so check the result rather than assuming success.",
        support: {
          type: "code",
          title: "Build first, then choose how failure should be reported",
          language: "ruby",
          code: "article = Article.new(title: \"Active Record basics\")\n\nif article.save\n  puts \"created #{article.id}\"\nelse\n  puts article.errors.full_messages\nend",
          caption: "The non-bang save path keeps validation errors on the object and reports failure without raising.",
        },
      },
      {
        cue: "Connect common methods to their missing or invalid result",
        stage: "Methods define failure",
        spokenText: "For reading, `Article.find(id)` returns the required primary-key record or raises `RecordNotFound`; `find_by(...)` returns one match or `nil`. `update(...)` validates and returns a Boolean, while `update!(...)` raises when the write is invalid. Pick the form that matches normal versus exceptional control flow.",
        support: {
          type: "comparison",
          title: "Choose the CRUD method with the failure contract you need",
          items: [
            {
              label: "new / create",
              value: "build only / build and save",
              detail: "create still returns the object when validation blocks persistence.",
              tone: "blue",
            },
            {
              label: "find / find_by",
              value: "raise / return nil",
              detail: "Use required-record and optional-record paths deliberately.",
              tone: "green",
            },
            {
              label: "save / save!",
              value: "false / exception",
              detail: "Both run normal validations; failure reporting differs.",
              tone: "orange",
            },
            {
              label: "destroy / delete",
              value: "lifecycle / direct removal",
              detail: "Delete bypasses destroy callbacks and association handling.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain update and deletion as lifecycle choices rather than shorthand",
        stage: "Writes keep model rules",
        spokenText: "A loaded record can call `update(title: \"Revised\")`, which assigns values, validates, runs callbacks, and attempts an UPDATE. `destroy` runs the destroy lifecycle and configured association behavior. `delete` removes directly and skips that lifecycle, so it belongs only in code that intentionally accepts those missing callbacks.",
      },
      {
        cue: "Close with the transaction boundary for related writes",
        stage: "Several writes need a boundary",
        spokenText: "CRUD methods make one-record work readable; they do not make a multi-record business operation atomic by themselves. If an article and its audit row must both change or neither may change, wrap them in one database transaction and use a failure form that causes the transaction to roll back.",
        recallRule: "Choose each CRUD method by when it writes, how it reports failure, and whether it runs the model lifecycle.",
      },
    ],
    codeTitle: "Complete Rails example: create, find, update, and destroy one article",
    code: "```ruby\nclass Article < ApplicationRecord\n  validates :title, presence: true\nend\n\narticle = Article.new(title: \"Active Record basics\")\nif article.save\n  puts \"created #{article.id}\"\nelse\n  abort article.errors.full_messages.join(\", \")\nend\n\nfound = Article.find(article.id)\nfound.update!(published: true)\nputs found.published?\n\nfound.destroy\nputs found.destroyed?\n```",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/crud-basics/complete-qa.json",
    slug: "rails-activerecord-basic-querying",
    question: "How do you query records with ActiveRecord?",
    answerSize: "compact",
    redundantVisualType: "flow_diagram",
    beats: [
      {
        cue: "Define a Relation as a query description that remains composable",
        stage: "Relations hold a query plan",
        spokenText: "Active Record builds database queries with chainable methods such as `where`, `order`, `limit`, `select`, and `joins`. Most collection methods return an `ActiveRecord::Relation`: a description that can be refined and passed to another method before matching rows are loaded.",
      },
      {
        cue: "Build one bounded query while keeping values separate from SQL",
        stage: "Chain the database work",
        spokenText: "`Article.where(published: true).order(created_at: :desc).limit(5)` expresses filtering, ordering, and limiting in one relation. Use hash conditions or placeholders such as `where(\"price >= ?\", minimum)` for input values. String interpolation lets untrusted text change SQL and can create injection vulnerabilities.",
        support: {
          type: "code",
          title: "Compose one safe and bounded article query",
          language: "ruby",
          code: "recent = Article\n  .where(published: true, author_id: author_id)\n  .where(\"created_at >= ?\", since)\n  .order(created_at: :desc)\n  .limit(5)",
          caption: "Each chain adds one database clause; values stay bound separately from SQL structure.",
        },
      },
      {
        cue: "Show the moment a lazy relation asks the database for a result",
        stage: "Execution happens at use",
        spokenText: "A relation is usually lazy until code needs a result. Calling `each`, `to_a`, or `first` loads records; operations such as `count`, `exists?`, and `pluck(:id)` run smaller specialised queries. Calling `to_a` too early moves later filtering into Ruby and may load far more data than necessary.",
        support: {
          type: "trace",
          title: "Follow a relation from clauses to the smallest useful result",
          items: [
            {
              label: "where",
              value: "record conditions",
              detail: "The relation is still open to more database clauses.",
              tone: "blue",
            },
            {
              label: "order and limit",
              value: "shape the result",
              detail: "Stable ordering makes a bounded page predictable.",
              tone: "green",
            },
            {
              label: "each or to_a",
              value: "load model objects",
              detail: "SQL runs because complete records are now needed.",
              tone: "orange",
            },
            {
              label: "pluck or exists?",
              value: "return a smaller answer",
              detail: "Ask the database only for the value the caller needs.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Separate collection relations from single-record finder contracts",
        stage: "Finders end the query",
        spokenText: "`find(id)` returns a required primary-key record and raises when it is absent. `find_by(slug: value)` returns the first match or `nil`; add an order when several rows could match and the chosen row matters. Inspect `to_sql` and query logs when generated SQL or performance is unclear.",
      },
      {
        cue: "Keep association loading and pagination visible at the response boundary",
        stage: "Rendering can add queries",
        spokenText: "A good parent relation can still create N+1 queries if a view later reads unloaded associations. Load only the relationships the response uses and give pagination a stable order. Query construction should reduce database work while still returning the exact model objects or scalar values the caller needs.",
        recallRule: "Compose a lazy relation, bind values safely, and execute only the smallest result the caller needs.",
      },
    ],
    codeTitle: "Complete Rails example: return recent articles for one author",
    code: "```ruby\nclass RecentArticles\n  def self.for_author(author_id:, since:, limit: 5)\n    Article\n      .where(published: true, author_id: author_id)\n      .where(\"created_at >= ?\", since)\n      .order(created_at: :desc)\n      .limit(limit)\n  end\nend\n\nrecent = RecentArticles.for_author(\n  author_id: 4,\n  since: 30.days.ago,\n  limit: 5\n)\n\nputs recent.to_sql\nrecent.each { |article| puts article.title }\n```",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/migrations-basics/complete-qa.json",
    slug: "rails-activerecord-migrations-basics",
    question: "What are ActiveRecord migrations and how do you write one?",
    answerSize: "compact",
    redundantVisualType: "flow_diagram",
    beats: [
      {
        cue: "Define a migration as ordered database history rather than a model file",
        stage: "Migrations record change",
        spokenText: "An Active Record migration is a timestamped Ruby class that describes one database schema change. Rails runs pending versions in timestamp order and records which versions succeeded. That shared history lets development, test, and production databases move toward the same structure from their current version.",
      },
      {
        cue: "Explain change and explicit up down by truthfully reversible behavior",
        stage: "Reversal must be truthful",
        spokenText: "Put operations in `change` when Rails has enough information to reverse them. Use explicit `up` and `down` when applying and undoing require different instructions. Removing data or running arbitrary SQL may have no honest inverse, even when the Ruby syntax itself is valid.",
      },
      {
        cue: "Show a complete integrity-minded table migration in a small fragment",
        stage: "Schema rules belong together",
        spokenText: "A useful migration defines more than column names. A reference may need `null: false` and `foreign_key: true`; lookup or identity columns may need indexes. The example creates invoices with their account relationship and unique invoice number so the database can enforce those rules for every writer.",
        support: {
          type: "code",
          title: "Describe an invoice table and its integrity rules",
          language: "ruby",
          code: "create_table :invoices do |t|\n  t.string :number, null: false\n  t.references :account, null: false, foreign_key: true\n  t.integer :total_cents, null: false\n  t.timestamps\nend\nadd_index :invoices, :number, unique: true",
          caption: "Columns, reference integrity, and the unique lookup rule are reviewed in one schema change.",
        },
      },
      {
        cue: "Trace how migration history and the schema snapshot serve different jobs",
        stage: "History creates a snapshot",
        spokenText: "`bin/rails db:migrate` runs pending files, records their versions, and updates the configured schema dump. Migrations explain how the database changed; `db/schema.rb` or `structure.sql` describes its current shape. The database itself remains the source of truth for the structure that is actually running.",
        support: {
          type: "trace",
          title: "Follow a migration from source control to current schema",
          items: [
            {
              label: "Timestamped file",
              value: "pending schema change",
              detail: "Source control preserves the ordered instruction.",
              tone: "blue",
            },
            {
              label: "db:migrate",
              value: "run pending version",
              detail: "Rails applies the change against the current database.",
              tone: "green",
            },
            {
              label: "Applied version",
              value: "recorded in database",
              detail: "Rails will not silently rerun an already recorded migration.",
              tone: "orange",
            },
            {
              label: "Schema dump",
              value: "current structure snapshot",
              detail: "Fresh setup can inspect or load the resulting shape.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Protect shared history and stage production changes for compatibility",
        stage: "Deployed history stays fixed",
        spokenText: "After a migration reaches teammates or production, fix it with a new migration instead of editing the old file; applied databases would not rerun that version. For large tables, reversibility is not enough. Add compatible structure, deploy code, backfill safely, enforce constraints, and remove the old shape in later steps.",
        recallRule: "Migrations are ordered history; schema files are snapshots; deployed history is corrected with a new version.",
      },
    ],
    codeTitle: "Complete migration: create invoices with database guarantees",
    code: "```ruby\nclass CreateInvoices < ActiveRecord::Migration[8.1]\n  def change\n    create_table :invoices do |t|\n      t.string :number, null: false\n      t.references :account, null: false, foreign_key: true\n      t.integer :total_cents, null: false\n      t.timestamps\n    end\n\n    add_index :invoices, :number, unique: true\n  end\nend\n```",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/validations-basics/complete-qa.json",
    slug: "rails-activerecord-validations-basics",
    question: "What are ActiveRecord validations and how do you use them?",
    answerSize: "compact",
    redundantVisualType: "flow_diagram",
    beats: [
      {
        cue: "Define validations as application checks before ordinary persistence",
        stage: "Validations check model state",
        spokenText: "Active Record validations express rules that model values should satisfy before a normal create or update writes to the database. Built-in validators cover presence, length, numericality, format, inclusion, uniqueness, and associations. Custom validation methods can express a clear rule involving several attributes.",
      },
      {
        cue: "Show what an invalid object contains and how save variants report it",
        stage: "Failure stays on the object",
        spokenText: "Calling `valid?`, `save`, `create`, or `update` runs the relevant checks. A failure adds structured entries to `errors` and prevents that INSERT or UPDATE. `save` returns `false`, while `save!` raises `ActiveRecord::RecordInvalid`; both leave the rejected values available for a form or API error response.",
        support: {
          type: "code",
          title: "Declare a rule and read its useful validation error",
          language: "ruby",
          code: "class Account < ApplicationRecord\n  validates :email, presence: true, uniqueness: true\nend\n\naccount = Account.new(email: \"\")\nputs account.errors.full_messages unless account.save",
          caption: "The non-bang path returns false and keeps readable errors on the same in-memory object.",
        },
      },
      {
        cue: "Connect helpful model feedback with an authoritative database guarantee",
        stage: "Database guards every write",
        spokenText: "A uniqueness validation performs a query and improves feedback, but two concurrent requests can both pass before either commits. A unique database index decides that race. `NOT NULL`, check constraints, and foreign keys likewise protect data written through bulk SQL, maintenance scripts, or code paths that skip validations.",
        support: {
          type: "trace",
          title: "Follow values through both integrity layers",
          items: [
            {
              label: "Assigned values",
              value: "in-memory model",
              detail: "The learner can still correct the submitted attributes.",
              tone: "blue",
            },
            {
              label: "Model validation",
              value: "friendly rule check",
              detail: "Failure fills errors before the normal write.",
              tone: "green",
            },
            {
              label: "Database write",
              value: "INSERT or UPDATE",
              detail: "Only a model that passed proceeds through this path.",
              tone: "orange",
            },
            {
              label: "Database constraint",
              value: "final integrity guard",
              detail: "Concurrent and bypassing writers must obey the same invariant.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain conditional rules and bypass paths as deliberate exceptions",
        stage: "Some writes bypass validation",
        spokenText: "Use conditions or validation contexts only for real lifecycle differences; too many contexts make validity depend on a hidden call path. Bulk methods such as `update_all` intentionally skip model validations and callbacks. Critical rules therefore belong in the database as well as in the model's learner-friendly feedback.",
      },
      {
        cue: "Close with how a boundary reports both model and constraint failures",
        stage: "Translate known conflicts",
        spokenText: "An HTML form can render `errors.full_messages`, while an API can return structured field errors, often with status 422. If a database uniqueness constraint wins a race, translate that known conflict safely too. The two layers complement each other: clear feedback before the write and guaranteed integrity at commit.",
        recallRule: "Use validations for clear model feedback and database constraints for guarantees no writer can bypass.",
      },
    ],
    codeTitle: "Complete Rails example: pair validation feedback with a unique index",
    code: "```ruby\nclass Account < ApplicationRecord\n  validates :email, presence: true, uniqueness: true\nend\n\nclass AddUniqueIndexToAccounts < ActiveRecord::Migration[8.1]\n  def change\n    add_index :accounts, :email, unique: true\n  end\nend\n\naccount = Account.new(email: \"\")\nunless account.save\n  puts account.errors.full_messages.join(\", \")\nend\n```",
  },
];

const byFile = Map.groupBy(presentations, (presentation) => presentation.file);

for (const [relativeFile, filePresentations] of byFile) {
  const absolutePath = path.join(repoRoot, relativeFile);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== filePresentations.length) {
    throw new Error(`Expected exactly ${filePresentations.length} questions in ${relativeFile}`);
  }

  for (const presentation of filePresentations) {
    const question = questions.find((candidate) => candidate.slug === presentation.slug);
    if (!question || question.question !== presentation.question) {
      throw new Error(`Question identity changed for ${presentation.slug}`);
    }

    const sections = question.answer?.sections;
    if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
    for (const requiredType of ["key_points", "speakable_answer", "deep_explanation", "code_example"]) {
      if (sections.filter((section) => section.type === requiredType).length !== 1) {
        throw new Error(`${presentation.slug} needs one ${requiredType} section`);
      }
    }

    const redundantVisuals = sections.filter(
      (section) => section.type === presentation.redundantVisualType,
    );
    if (redundantVisuals.length > 1) {
      throw new Error(`${presentation.slug} has duplicate ${presentation.redundantVisualType} sections`);
    }
    if (redundantVisuals.length === 1) {
      sections.splice(sections.indexOf(redundantVisuals[0]), 1);
    }

    const speakable = sections.find((section) => section.type === "speakable_answer");
    speakable.answerSize = presentation.answerSize;
    speakable.beats = presentation.beats;
    speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");

    const codeExample = sections.find((section) => section.type === "code_example");
    codeExample.title = presentation.codeTitle;
    codeExample.content = presentation.code;
    console.log(`Curated ${presentation.slug}`);
  }

  fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
}
