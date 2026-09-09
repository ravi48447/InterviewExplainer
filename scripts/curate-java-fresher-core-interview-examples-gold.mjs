#!/usr/bin/env node

/**
 * Focused corrections for Java-fresher Interview Answers that already teach
 * the right concept but need an explicit, self-contained example. This also
 * fixes the database-specific DDL transaction claim in every learner-facing
 * zone of its canonical question.
 */

import fs from "node:fs";

const targets = [
  {
    file: "content/java-backend-fresher/debugging-logging/code-review-basics/complete-qa.json",
    slug: "code-review-vs-pair-programming",
    replace: [
      "You might pair program on a complex security feature",
      "For example, you might pair program on a complex security feature",
    ],
  },
  {
    file: "content/java-backend-fresher/debugging-logging/logging-overview/complete-qa.json",
    slug: "logging-vs-system-out-println-java",
    replace: [
      "A framework can also route output: to a file, as JSON, or to a centralized logging system",
      "For example, `log.info(\"Order {} created\", orderId)` records the order without building the message when that level is disabled, and the logging configuration can add the time, class, and request ID. A framework can also route output: to a file, as JSON, or to a centralized logging system",
    ],
  },
  {
    file: "content/java-backend-fresher/java-collections-fundamentals/comparisons/complete-qa.json",
    slug: "comparable-vs-comparator-java",
    replace: [
      "String sorts alphabetically and Integer sorts numerically because they implement Comparable.",
      "For example, `String` sorts alphabetically and `Integer` sorts numerically because they implement `Comparable`.",
    ],
  },
  {
    file: "content/java-backend-fresher/java-multithreading-basics/concurrency-problems/complete-qa.json",
    slug: "thread-interference-in-java",
    replace: [
      "Take counter-plus-plus.",
      "For example, take `counter++`.",
    ],
  },
  {
    file: "content/java-backend-fresher/java-multithreading-basics/concurrency-problems/complete-qa.json",
    slug: "livelock-vs-deadlock-in-java",
    replace: [
      "The classic analogy is two polite people in a hallway.",
      "For example, picture two polite people in a hallway.",
    ],
  },
  {
    file: "content/java-backend-fresher/jdbc-basics/connection-pooling/complete-qa.json",
    slug: "hikaricp-connectiontimeout-vs-idletimeout",
    replace: [
      "So in one line: connectionTimeout is the borrow-wait limit, and idleTimeout is the idle-connection lifespan.",
      "For example, suppose `maximumPoolSize` is 10 and `connectionTimeout` is 2 seconds. An eleventh request waits at most 2 seconds for a returned connection. An `idleTimeout` of 10 minutes does not stop that request or its query; it only lets HikariCP retire surplus idle connections above `minimumIdle`. So in one line: `connectionTimeout` is the borrow-wait limit, and `idleTimeout` is the idle-connection retirement setting.",
    ],
  },
  {
    file: "content/java-backend-fresher/jdbc-basics/prepared-statement/complete-qa.json",
    slug: "batch-inserts-with-preparedstatement",
    replace: [
      "So the recipe is: prepare once, addBatch per row, flush every N rows, executeBatch the rest, and commit once.",
      "For example, a 2,500-row import can call `addBatch()` for each row, `executeBatch()` after every 1,000 rows, execute the final 500, and then commit once. If any batch fails, the catch block rolls back the transaction. So the recipe is: prepare once, `addBatch()` per row, flush every sensible batch size, execute the remainder, and commit once.",
    ],
  },
];

function questionsOf(document) {
  return Array.isArray(document) ? document : document.questions;
}

for (const target of targets) {
  const document = JSON.parse(fs.readFileSync(target.file, "utf8"));
  const question = questionsOf(document).find((entry) => entry.slug === target.slug);
  if (!question) throw new Error(`Missing question ${target.slug}`);
  const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
  if (!speaking || typeof speaking.content !== "string") {
    throw new Error(`Missing Interview Answer for ${target.slug}`);
  }
  const [before, after] = target.replace;
  if (!speaking.content.includes(after)) {
    if (!speaking.content.includes(before)) {
      throw new Error(`Expected source text not found for ${target.slug}`);
    }
    speaking.content = speaking.content.replace(before, after);
  }
  fs.writeFileSync(target.file, `${JSON.stringify(document, null, 2)}\n`);
}

const sqlFile = "content/java-backend-fresher/sql-fundamentals/ddl-dml-dql/complete-qa.json";
const sqlDocument = JSON.parse(fs.readFileSync(sqlFile, "utf8"));
const sqlQuestion = questionsOf(sqlDocument).find((entry) => entry.slug === "ddl-vs-dml-vs-dql-in-sql");
if (!sqlQuestion) throw new Error("Missing DDL/DML/DQL question");

sqlQuestion.direct_answer = "SQL commands can be grouped by purpose. **DDL** defines database objects, with commands such as `CREATE`, `ALTER`, and `DROP`. **DML** changes rows with `INSERT`, `UPDATE`, and `DELETE`. **DQL** is a common teaching name for reading data with `SELECT`. These labels do not decide whether a statement auto-commits; transaction behaviour depends on the database.";
sqlQuestion.interviewer_intent = {
  testing: "Whether you can separate schema changes, row changes, and queries without turning a database-specific transaction rule into a universal SQL rule.",
  common_mistake: "Saying that DDL always auto-commits. MySQL has implicit-commit rules for many DDL statements, while PostgreSQL can roll back many schema changes.",
  to_stand_out: "Use one table to show CREATE, INSERT, and SELECT, then state that rollback behaviour must be checked for the chosen database.",
};

const quick = sqlQuestion.answer.sections.find((section) => section.type === "key_points");
quick.title = "Quick Revision";
quick.content = [
  "**DDL defines structure:** `CREATE`, `ALTER`, and `DROP` work with database objects.",
  "**DML changes rows:** `INSERT`, `UPDATE`, and `DELETE` modify stored data.",
  "**DQL reads rows:** `SELECT` is commonly placed in this learning category.",
  "The categories describe purpose; they do not create one universal commit rule.",
  "Check the chosen database before assuming that a DDL statement can or cannot be rolled back.",
];

const speaking = sqlQuestion.answer.sections.find((section) => section.type === "speakable_answer");
speaking.title = "Interview Answer";
speaking.answerSize = "compact";
speaking.content = "DDL, DML, and DQL group SQL statements by the job they perform. **DDL**, or Data Definition Language, defines database objects. `CREATE TABLE`, `ALTER TABLE`, and `DROP TABLE` change the schema. **DML**, or Data Manipulation Language, changes the rows stored inside those objects. Its common commands are `INSERT`, `UPDATE`, and `DELETE`. **DQL**, or Data Query Language, is the common teaching name for reading rows with `SELECT`.\n\nFor example, `CREATE TABLE products (...)` is DDL because it creates structure. `INSERT INTO products ...` is DML because it adds a row. `SELECT * FROM products` is DQL because it reads those rows. DCL is often used for permission commands such as `GRANT` and `REVOKE`, while TCL covers transaction commands such as `COMMIT` and `ROLLBACK`.\n\nOne important boundary is transaction behaviour. The DDL, DML, and DQL labels describe purpose, not one universal commit rule. MySQL implicitly commits around many DDL statements, but PostgreSQL allows many schema changes inside a transaction and can roll them back. So I would never say “DDL always auto-commits” without naming the database.";

const deep = sqlQuestion.answer.sections.find((section) => section.type === "deep_explanation");
deep.title = "SQL Command Families and Transaction Boundaries";
deep.content = "**Command families describe intent**\n\nDDL changes definitions in the database catalog: tables, columns, indexes, and other objects. DML changes the rows held by those objects. DQL reads a result set. The names make a long SQL script easier to discuss, but vendors and textbooks do not always classify every command in exactly the same way. For example, `TRUNCATE` may be grouped with DDL even though its visible result is removing rows.\n\n**One products table**\n\n`CREATE TABLE products (...)` creates the structure. `INSERT INTO products ...` stores a product. `SELECT id, name FROM products` reads it. The three statements work on the same data, but each has a different purpose.\n\n**Transaction behaviour belongs to the database**\n\nDo not infer commit behaviour only from the family name. MySQL documents implicit commits for many DDL statements. PostgreSQL supports transactional handling for many schema changes, so a `CREATE TABLE` can be undone with `ROLLBACK` in ordinary cases. Some operations and database products have different limits. Always check the documentation for the database and command you are using.";

const conceptMap = sqlQuestion.answer.sections.find((section) => section.type === "concept_map");
conceptMap.content = "blue|DDL|~defines objects|CREATE ALTER DROP|schema and catalog|commit rules vary by database\nemerald|DML|~changes rows|INSERT UPDATE DELETE|normally used inside transactions|affects stored data\namber|DQL|~reads rows|SELECT|returns a result set|common teaching category\nrose|DCL / TCL|~permissions + transactions|GRANT REVOKE|COMMIT ROLLBACK|related command families";

const codeExample = sqlQuestion.answer.sections.find((section) => section.type === "code_example");
codeExample.content = "```sql\n-- DDL: define structure\nCREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(80));\n\n-- DML: change rows\nINSERT INTO products VALUES (1, 'Phone');\nUPDATE products SET name = 'Smartphone' WHERE id = 1;\n\n-- DQL: read rows\nSELECT id, name FROM products;\n```\n\nThe command family is the same across common relational databases. Whether the DDL can be rolled back is a separate, database-specific question.";

const mistakes = sqlQuestion.answer.sections.find((section) => section.type === "common_mistakes");
mistakes.content = "- **Saying DDL always auto-commits:** that is true for many statements in some databases, not a universal SQL rule.\n- **Calling every SQL statement DML:** schema changes and reads have different jobs.\n- **Assuming every source uses exactly the same categories:** DQL is common teaching vocabulary, while some documentation discusses `SELECT` within a broader SQL data language.\n- **Ignoring the database version:** transaction support can differ by product and by command.";

if (sqlQuestion.speakable_v2) {
  sqlQuestion.speakable_v2.speakable_status = "pending_review";
  sqlQuestion.speakable_v2.hook = "DDL defines database objects, DML changes their rows, and DQL reads rows with SELECT.";
  sqlQuestion.speakable_v2.cap = "The names classify purpose. Commit and rollback behaviour still belongs to the chosen database.";
  sqlQuestion.speakable_v2.beats = [];
}
sqlQuestion.last_updated = "2026-09-08";

fs.writeFileSync(sqlFile, `${JSON.stringify(sqlDocument, null, 2)}\n`);
console.log(`Updated ${targets.length + 1} question(s).`);
