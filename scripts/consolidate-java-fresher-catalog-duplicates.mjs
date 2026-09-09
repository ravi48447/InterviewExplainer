#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/java-backend-fresher");
const archiveRoot = path.join(
  repoRoot,
  "content/.archive/source-of-truth-2026-09-05/java-backend-fresher/catalog-duplicates",
);

const duplicates = [
  {
    moduleSlug: "java-syntax-basics",
    topicSlug: "arrays-basics",
    questionSlug: "arrayindexoutofboundsexception-in-java",
  },
  {
    moduleSlug: "debugging-logging",
    topicSlug: "common-java-exceptions",
    questionSlug: "concurrentmodificationexception-java",
  },
  {
    moduleSlug: "debugging-logging",
    topicSlug: "common-java-exceptions",
    questionSlug: "creating-custom-exceptions",
  },
  {
    moduleSlug: "spring-boot-intro",
    topicSlug: "component-scan",
    questionSlug: "component-vs-service-vs-repository-vs-controller",
  },
  {
    moduleSlug: "sql-fundamentals",
    topicSlug: "ddl-dml-dql",
    questionSlug: "delete-vs-truncate-vs-drop-in-sql-2",
  },
  {
    moduleSlug: "sql-fundamentals",
    topicSlug: "where-clause",
    questionSlug: "where-vs-having-in-sql",
  },
  {
    moduleSlug: "mockito-basics",
    topicSlug: "mockito-setup",
    questionSlug: "mockito-verify-never-java-fresher-interview",
  },
  {
    moduleSlug: "spring-security-fresher",
    topicSlug: "authentication-vs-authorization",
    questionSlug: "authentication-vs-authorization-in-spring-security",
  },
  {
    moduleSlug: "spring-boot-intro",
    topicSlug: "rest-controller-basics",
    questionSlug: "pathvariable-vs-requestparam-in-spring-boot",
  },
  {
    moduleSlug: "web-security-basics",
    topicSlug: "sql-injection",
    questionSlug: "how-preparedstatement-prevents-sql-injection-java-guide",
  },
  {
    moduleSlug: "jdbc-basics",
    topicSlug: "sql-injection-jdbc",
    questionSlug: "sql-injection-attack-how-it-works",
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function questionsOf(document) {
  return Array.isArray(document) ? document : (document.questions ?? []);
}

let archived = 0;
for (const duplicate of duplicates) {
  const sourceFile = path.join(
    domainRoot,
    duplicate.moduleSlug,
    duplicate.topicSlug,
    "complete-qa.json",
  );
  const archiveFile = path.join(
    archiveRoot,
    duplicate.moduleSlug,
    duplicate.topicSlug,
    "complete-qa.json",
  );
  const document = readJson(sourceFile);
  const questions = questionsOf(document);
  const index = questions.findIndex(
    (question) => question.slug === duplicate.questionSlug,
  );

  if (index >= 0) {
    const [question] = questions.splice(index, 1);
    const archivedDocument = fs.existsSync(archiveFile)
      ? readJson(archiveFile)
      : {
          topic: document.topic,
          topicSlug: document.topicSlug ?? duplicate.topicSlug,
          archiveReason: "Duplicate learner route consolidated into the canonical module named in content/source-of-truth.json.",
          questions: [],
        };
    if (!archivedDocument.questions.some((entry) => entry.slug === question.slug)) {
      archivedDocument.questions.push(question);
    }
    writeJson(archiveFile, archivedDocument);
    questions
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
      .forEach((questionEntry, order) => {
        questionEntry.order = order + 1;
      });
    writeJson(sourceFile, document);
    archived += 1;
  } else if (!fs.existsSync(archiveFile)) {
    throw new Error(`Missing both active and archived copy of ${duplicate.questionSlug}`);
  }
}

for (const moduleSlug of [
  "java-syntax-basics",
  "java-oop-fundamentals",
  "sql-fundamentals",
]) {
  const file = path.join(domainRoot, moduleSlug, "comparisons/complete-qa.json");
  const document = readJson(file);
  for (const question of document.questions ?? []) {
    const match = /^comparisons-(\d+)$/.exec(question.id ?? "");
    if (match) question.id = `${moduleSlug}-comparisons-${match[1]}`;
  }
  writeJson(file, document);
}

for (const { moduleSlug, prefix } of [
  {
    moduleSlug: "web-security-basics",
    prefix: "web-security-basics-authentication-vs-authorization",
  },
  {
    moduleSlug: "spring-security-fresher",
    prefix: "spring-security-fresher-authentication-vs-authorization",
  },
]) {
  const file = path.join(
    domainRoot,
    moduleSlug,
    "authentication-vs-authorization/complete-qa.json",
  );
  const document = readJson(file);
  for (const question of questionsOf(document)) {
    const match = /^authentication-vs-authorization-(\d+)$/.exec(question.id ?? "");
    if (match) question.id = `${prefix}-${match[1]}`;
  }
  writeJson(file, document);
}

const sqlComparisonsFile = path.join(
  domainRoot,
  "sql-fundamentals/comparisons/complete-qa.json",
);
const sqlComparisons = readJson(sqlComparisonsFile);
const removalQuestion = sqlComparisons.questions.find(
  (question) => question.slug === "delete-vs-truncate-vs-drop-in-sql",
);
if (!removalQuestion) throw new Error("Missing DELETE/TRUNCATE/DROP comparison");
removalQuestion.direct_answer = "`DELETE` removes selected rows and can use `WHERE`; `TRUNCATE` empties a table without processing a normal row deletion for each row; `DROP` removes the table definition as well as its data. Transaction rollback, logging, identity or sequence reset, trigger behaviour, locking, and foreign-key restrictions vary by database. PostgreSQL and SQL Server can roll back `TRUNCATE` inside a transaction, while MySQL makes it an implicit commit, so those details must be checked for the actual database.";
removalQuestion.reading_time_minutes = 8;
removalQuestion.last_updated = "2026-09-07";
removalQuestion.interviewer_intent = {
  testing: "Whether row removal, whole-table emptying, and object removal are separated without presenting one vendor's transaction rules as universal SQL.",
  common_mistake: "Claiming that TRUNCATE can never be rolled back or always resets an identity in every database.",
  to_stand_out: "State the portable difference first, then name PostgreSQL or SQL Server versus MySQL as a vendor-specific boundary.",
};
removalQuestion.answer.sections = [
  {
    type: "key_points",
    title: "Quick revision",
    items: [
      "`DELETE` removes rows and may use a `WHERE` condition.",
      "`TRUNCATE` empties the table but keeps its definition.",
      "`DROP` removes the table object, including its stored data.",
      "`TRUNCATE` normally avoids row-by-row deletion work and takes a strong table lock.",
      "Rollback, identity reset, triggers, and foreign-key rules are database-specific.",
    ],
  },
  {
    type: "speakable_answer",
    title: "Interview answer",
    answerSize: "standard",
    content: "- `DELETE`, `TRUNCATE`, and `DROP` differ mainly in scope. `DELETE` is a row-removal statement, `TRUNCATE` is a whole-table emptying operation, and `DROP` removes the table as a database object. That portable distinction is more reliable than memorising one vendor's DDL and transaction labels.\n\n- `DELETE FROM orders WHERE status = 'CANCELLED'` can remove only matching rows. It follows the database's ordinary row-deletion rules, so constraints and delete triggers can participate, and a transaction can normally roll it back on a transactional engine. Deleting millions of rows may produce substantial row-version, index, and log work.\n\n- `TRUNCATE TABLE staging_orders` has no row filter. A database can release or recreate table storage rather than execute a normal delete for every row, which is why it is commonly faster for resetting a complete staging table. It may require stronger privileges and locking, and foreign keys can restrict it.\n\n- The important boundary is vendor behaviour. For example, PostgreSQL and SQL Server allow a truncate inside a transaction to be rolled back. MySQL treats `TRUNCATE TABLE` as DDL that causes an implicit commit. PostgreSQL resets owned sequences only with `RESTART IDENTITY`, while MySQL and SQL Server reset their auto-increment or identity counter as part of truncation.\n\n- `DROP TABLE staging_orders` removes the definition, data, indexes, and dependent metadata according to the database's dependency rules. I choose `DELETE` for selected rows, `TRUNCATE` for a deliberate whole-table reset, and `DROP` only when the table should stop existing; before either destructive operation, I verify the production database's documentation and recovery plan.",
  },
  {
    type: "deep_explanation",
    title: "The same three words cross different database layers",
    content: "A row deletion keeps the relation itself available. The database locates qualifying rows, updates indexes, enforces constraints, and records enough transactional information for its storage engine. Under multi-version concurrency control, old row versions may remain until cleanup. A `WHERE` clause gives `DELETE` its selective power, but it also means the cost follows the number of affected rows and indexes.\n\nTruncation asks the engine to make the entire relation empty. It generally avoids the normal per-row path, but that does not make it a universal constant-time or non-logged operation. Engines still record metadata or allocation changes, coordinate replicas, and acquire locks. Delete triggers may not run because rows are not deleted through the normal operation; dedicated truncate triggers exist in PostgreSQL, while MySQL says ordinary `ON DELETE` triggers do not fire.\n\nTransaction and sequence rules are dialect features. PostgreSQL documents `TRUNCATE` as transaction-safe and makes `RESTART IDENTITY` explicit. SQL Server also documents rollback support and resets an identity to its seed. MySQL performs an implicit commit and resets `AUTO_INCREMENT`. A correct production answer therefore names the database before promising rollback or the next generated key.\n\nDropping changes the schema rather than only its contents. Views, foreign keys, permissions, prepared statements, migrations, and application deployments may depend on that object. Safe work starts by confirming the intended scope, inspecting dependencies, taking the required backup or snapshot, rehearsing recovery, and using the least destructive statement that satisfies the requirement.",
  },
  {
    type: "comparison_table",
    title: "Portable distinction and vendor boundary",
    content: "| Question | `DELETE` | `TRUNCATE` | `DROP` |\n|---|---|---|---|\n| What changes? | Matching rows | All rows | Table object and its data |\n| Row filter? | `WHERE` is allowed | No | Not applicable |\n| Table remains? | Yes | Yes | No |\n| Typical work | Normal row-delete path | Storage/allocation reset | Schema removal |\n| Rollback? | Usually within a transaction | PostgreSQL/SQL Server: yes; MySQL: implicit commit | Database-specific |\n| Generated-number reset? | Usually continues | Database and option-specific | Object no longer exists |",
  },
  {
    type: "code_example",
    title: "Choose the operation from the intended scope",
    content: "```sql\n-- Remove only completed temporary rows; the table stays populated otherwise.\nDELETE FROM import_jobs\nWHERE state = 'DONE' AND finished_at < CURRENT_DATE;\n\n-- Empty the complete staging table; transaction behaviour is vendor-specific.\nTRUNCATE TABLE staging_orders;\n\n-- Remove an obsolete table definition after its dependencies are migrated.\nDROP TABLE legacy_orders;\n```\nThe three statements are not faster versions of one another: they express three different changes. Test rollback, identity, trigger, lock, and foreign-key behaviour on the production database engine.",
  },
];
removalQuestion.followup_questions = [
  "Why can TRUNCATE be faster than deleting every row?",
  "Can TRUNCATE be rolled back in PostgreSQL, SQL Server, and MySQL?",
  "Which dependencies should be checked before dropping a table?",
];
delete removalQuestion.speakable_v2;
writeJson(sqlComparisonsFile, sqlComparisons);

const jdbcFile = path.join(domainRoot, "jdbc-basics/jdbc-overview/complete-qa.json");
const jdbcDocument = readJson(jdbcFile);
const springJdbcQuestion = jdbcDocument.questions.find(
  (question) => question.slug === "jdbc-in-spring-boot-architecture",
);
if (!springJdbcQuestion) throw new Error("Missing jdbc-in-spring-boot-architecture");

const springJdbcDeep = springJdbcQuestion.answer.sections.find(
  (section) => section.type === "deep_explanation",
);
if (!springJdbcDeep) throw new Error("Spring JDBC question has no Deep Dive");
springJdbcDeep.title = "A Query Through the Spring Boot Data Layer";
springJdbcDeep.content = "Spring Boot first creates a `DataSource` from explicit application configuration and classpath conditions. In the usual JDBC starter, HikariCP provides the pool. Borrowing a `Connection` from that pool is different from opening a brand-new database socket for every repository call; closing the connection returns it to the pool.\n\n`JdbcTemplate` works directly above JDBC. It obtains a connection, prepares and executes SQL, turns each `ResultSet` row into an application value, translates many `SQLException` values into Spring's data-access exception hierarchy, and releases resources. Application code still owns the SQL and row mapping.\n\nJPA adds another layer. A Spring Data repository delegates to a JPA provider such as Hibernate, which maps entity operations to SQL. The provider still reaches the database through JDBC and the same `DataSource`. That means pool exhaustion, transaction boundaries, database locks, and slow SQL remain relevant even when no repository method contains JDBC code.\n\nFor a request such as `GET /orders/42`, the useful trace is controller → service → repository or template → transaction-bound connection → JDBC driver → database. The return path maps rows or entities back to the service and response. The abstraction changes who writes SQL and mapping code; it does not remove the database protocol beneath it.";

const springJdbcTradeoff = springJdbcQuestion.answer.sections.find(
  (section) => section.type === "tradeoffs",
);
if (springJdbcTradeoff) {
  springJdbcTradeoff.title = "Choose the highest layer that keeps the query clear";
  springJdbcTradeoff.content = "Spring Data JPA removes routine repository code and is convenient for entity-oriented work. `JdbcTemplate` keeps SQL visible and gives direct control over query shape and row mapping. Raw JDBC is useful for learning and for narrow low-level integrations, but it carries the most resource and error-handling code. All three still depend on sound transactions, bounded connection pools, parameterized SQL, and database-aware tests.";
}
springJdbcQuestion.last_updated = "2026-09-07";
writeJson(jdbcFile, jdbcDocument);

console.log(
  `Java Fresher catalog consolidated: ${archived} newly archived duplicate lessons; generic comparison IDs normalized; JDBC Deep Dive separated.`,
);
