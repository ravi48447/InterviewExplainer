const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function uniqueSlug(client, base) {
  let slug = base, n = 2;
  while (true) {
    const r = await client.query('SELECT id FROM questions WHERE slug=$1', [slug]);
    if (r.rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

async function getOrCreateConcept(client, name) {
  const slug = toSlug(name);
  const existing = await client.query('SELECT id FROM concepts WHERE slug=$1', [slug]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const r = await client.query('INSERT INTO concepts(name,slug) VALUES($1,$2) RETURNING id', [name, slug]);
  return r.rows[0].id;
}

const QUESTIONS = {
  'postgresql': [
    {
      title: 'What are the main differences between PostgreSQL and MySQL',
      metaTitle: 'PostgreSQL vs MySQL: Key Differences for Backend Developers',
      metaDesc: 'Compare PostgreSQL and MySQL, focusing on ACID compliance, JSON support, performance, and features like Materialized Views.',
      concepts: ['PostgreSQL', 'MySQL', 'Relational Databases'],
      quiz: { q: 'Which database is generally considered to have better support for complex analytical queries and JSON processing?', opts: ['MySQL', 'PostgreSQL', 'SQLite', 'MariaDB'], ans: 'PostgreSQL' },
      sections: {
        interviewer_expectation: `This question evaluates if a candidate understands *why* a team might choose one RDBMS over another, rather than just knowing how to write SQL.\n\nExpectations:\n- Knowing that Postgres is an Object-Relational Database Management System (ORDBMS).\n- Highlighting Postgres's strictness with data integrity.\n- Mentioning advanced features (JSONB, Materialized Views, PostGIS).\n- Understanding MySQL's historical advantage in simple read-heavy web apps.`,
        core_concepts: `**PostgreSQL (Postgres):**\nPostgres is an advanced, open-source Object-Relational Database. It prides itself on standards compliance, data integrity, and extensibility. It supports advanced data types (Arrays, UUIDs, JSONB) and advanced indexing (GiST, GIN). It is often chosen for complex analytical workloads and systems where data correctness is paramount.\n\n**MySQL:**\nMySQL is a purely Relational Database Management System. Historically, it was optimized for extreme read-speed in simple web applications (LAMP stack). While modern MySQL (8.0+) has closed the gap significantly regarding features like window functions and CTEs, it still defaults to being slightly more forgiving with invalid data compared to Postgres's strict type checking.`,
        important_points: `- **JSON Support:** Postgres's \`JSONB\` format is highly optimized. You can index JSON fields and query them almost as fast as native columns. MySQL supports JSON, but Postgres's implementation is generally considered more robust.\n- **Concurrency:** Postgres uses Multi-Version Concurrency Control (MVCC) brilliantly, meaning reads almost never block writes, and writes never block reads.\n- **Features:** Postgres supports Materialized Views (caching complex query results), Partial Indexes (indexing only a subset of data), and has a massive extension ecosystem (like PostGIS for geospatial data).\n- **Strictness:** Postgres will immediately throw an error if you try to insert a string into an integer column. Older MySQL versions would attempt to truncate or silently cast it, which could lead to data corruption.`,
        code_example: `\`\`\`sql
-- PostgreSQL advanced feature examples:

-- 1. Using JSONB and querying inside the JSON document
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    profile JSONB
);

INSERT INTO users (profile) VALUES ('{"name": "Alice", "tags": ["developer", "java"]}');

-- Querying inside the JSONB column directly
SELECT profile->>'name' FROM users WHERE profile @> '{"tags": ["java"]}';

-- 2. Partial Index (Saves disk space and speeds up specific queries)
-- Only indexes active users, ignoring the millions of inactive ones
CREATE INDEX idx_active_users ON users (id) WHERE profile->>'status' = 'ACTIVE';

-- 3. Arrays (Postgres supports arrays natively)
CREATE TABLE posts (
    title VARCHAR(100),
    tags TEXT[] -- Array of strings
);
INSERT INTO posts VALUES ('Learn Spring', ARRAY['java', 'spring']);
\`\`\``,
        speakable_answer: `While both are excellent open-source relational databases, they have historically served different philosophies. MySQL was built for speed and simplicity, dominating the early read-heavy web. PostgreSQL was built for standards compliance, ACID guarantees, and complex data processing.\n\nPostgres is actually an Object-Relational database. It supports advanced data types like native Arrays, UUIDs, and most notably, JSONB. The JSONB support in Postgres is so good that many teams use it as a hybrid NoSQL document store, because you can fully index the JSON keys and query them rapidly.\n\nPostgres is also much stricter. If you try to insert bad data, it throws an error immediately, whereas MySQL historically tried to coerce data types to make the insert work. Furthermore, Postgres supports advanced features that backend developers love, such as Materialized Views for caching expensive analytics, Partial Indexes to save disk space, and extensions like PostGIS for location-based queries. Because of this robustness, Postgres is usually the default choice for modern, complex backend architectures.`,
        followup_questions: `- What is MVCC (Multi-Version Concurrency Control) and how does it prevent locking?\n- What is a Materialized View in PostgreSQL and how does it differ from a standard View?\n- How does the \`JSONB\` data type differ from the standard \`JSON\` data type in Postgres?\n- Can you explain what the PostGIS extension does?`,
      }
    },
    {
      title: 'What is MVCC (Multi-Version Concurrency Control) in PostgreSQL',
      metaTitle: 'Understanding MVCC (Multi-Version Concurrency Control) in PostgreSQL',
      metaDesc: 'Deep dive into MVCC in PostgreSQL, explaining how it handles concurrent transactions without locking and the importance of the VACUUM process.',
      concepts: ['MVCC', 'Concurrency', 'Transactions', 'VACUUM'],
      quiz: { q: 'In PostgreSQL MVCC, what happens when a row is updated?', opts: ['The existing row is overwritten immediately', 'A new version of the row is created, and the old one is marked as dead', 'The entire table is locked until the update finishes', 'The update is written to a separate change-log table'], ans: 'A new version of the row is created, and the old one is marked as dead' },
      sections: {
        interviewer_expectation: `This is a senior-level database question. Interviewers want to know if you understand how databases handle thousands of simultaneous connections without grinding to a halt.\n\nExpectations:\n- Explaining the core concept: "Readers don't block writers, and writers don't block readers."\n- Understanding how Postgres achieves this (creating new versions of rows instead of overwriting).\n- Knowing the side-effect of MVCC (dead tuples/bloat).\n- Explaining the role of the \`VACUUM\` process.`,
        core_concepts: `**The Problem with traditional Locking:**\nIf Transaction A is updating Row 1, and Transaction B wants to read Row 1, traditional locking databases would make Transaction B wait until A finishes to ensure it doesn't read half-written data. In high-traffic systems, this causes massive bottlenecks.\n\n**The MVCC Solution:**\nMulti-Version Concurrency Control (MVCC) solves this by keeping multiple versions of the same row. \nWhen a row is updated in Postgres, it is **not overwritten**. Instead, Postgres creates a brand new row (a new tuple) with the updated data and marks the old row as "expired" or "dead" for future transactions. \n\nBecause the old row still exists on disk, Transaction B (which started before the update finished) can simply read the old version of the row. Thus, **readers never block writers, and writers never block readers**.`,
        important_points: `- **Transaction IDs (XID):** Every transaction in Postgres gets a unique incremental ID. Every row has \`xmin\` (the ID of the transaction that created it) and \`xmax\` (the ID of the transaction that deleted/updated it). This is how Postgres determines which version of a row a specific transaction is allowed to see (Transaction Isolation).\n- **Dead Tuples:** Because updates create new rows and deletes just mark rows with an \`xmax\`, the database accumulates "dead tuples" over time. This leads to "Table Bloat," which hurts performance.\n- **VACUUM:** To fix table bloat, Postgres runs a background process called \`AUTO VACUUM\`. It scans tables, finds dead tuples that are no longer visible to any active transactions, and marks that disk space as available for future inserts/updates.`,
        code_example: `\`\`\`sql
-- Visualizing how MVCC works under the hood

-- 1. Create a simple table
CREATE TABLE bank_account (
    id SERIAL PRIMARY KEY,
    balance INT
);

-- 2. Insert initial data
-- Postgres secretly adds system columns: xmin (creation TxID)
INSERT INTO bank_account (balance) VALUES (100); 
-- Let's say this was Transaction ID 100.
-- Tuple 1: [balance: 100, xmin: 100, xmax: null]

-- 3. Update the data
UPDATE bank_account SET balance = 150 WHERE id = 1;
-- Let's say this is Transaction ID 101.
-- Postgres DOES NOT overwrite Tuple 1. 
-- Instead, it sets Tuple 1's xmax = 101 (marking it deleted by Tx 101)
-- And creates Tuple 2: [balance: 150, xmin: 101, xmax: null]

-- Result on disk simultaneously:
-- Tuple 1 (Dead): [balance: 100, xmin: 100, xmax: 101]
-- Tuple 2 (Live): [balance: 150, xmin: 101, xmax: null]

-- 4. A long-running analytics query (TxID 99) reads the table.
-- Because 99 < 101, it is allowed to see Tuple 1, even though it's "dead" to new queries!

-- 5. Eventually, AUTO_VACUUM runs and physically deletes Tuple 1 
-- once no active transactions need to see it anymore.
\`\`\``,
        speakable_answer: `Multi-Version Concurrency Control, or MVCC, is the engine that allows PostgreSQL to handle massive concurrent traffic efficiently. Its primary motto is: "Readers don't block writers, and writers don't block readers."\n\nIn older databases, if an update was happening on a row, a read query would be locked and forced to wait. MVCC avoids this by never actually overwriting data. When you execute an UPDATE statement, Postgres actually inserts a completely new version of the row with the new data, and marks the old version as 'dead'. \n\nBecause the old version is still sitting there on the disk, any read queries that started before the update happened can just look at the old data. They don't have to wait for the update lock to release.\n\nHowever, this architecture has a side effect: table bloat. Every update and delete leaves behind dead rows, known as dead tuples, which consume disk space and slow down sequential scans. To solve this, Postgres relies on a background daemon called Auto-Vacuum, which periodically sweeps through the tables, identifies dead tuples that are no longer visible to any active transactions, and reclaims that disk space so it can be reused.`,
        followup_questions: `- What is "Table Bloat" and how does the \`VACUUM FULL\` command differ from standard \`VACUUM\`?\n- Explain the four Transaction Isolation levels and how MVCC handles them.\n- How does Postgres use the \`xmin\` and \`xmax\` hidden columns?\n- What happens if the Auto-Vacuum process is turned off or cannot keep up with the write load?`,
      }
    },
    {
      title: 'Explain different types of Indexes in PostgreSQL and when to use them',
      metaTitle: 'PostgreSQL Indexes Explained: B-Tree, Hash, GIN, and GiST',
      metaDesc: 'A guide to optimizing PostgreSQL queries using different index types, covering B-Trees, GIN for JSONB, GiST, and Partial Indexes.',
      concepts: ['Indexes', 'B-Tree', 'GIN', 'Performance Optimization'],
      quiz: { q: 'Which index type is specifically designed for indexing composite types like JSONB documents and Arrays in Postgres?', opts: ['B-Tree', 'Hash', 'GIN (Generalized Inverted Index)', 'BRIN'], ans: 'GIN (Generalized Inverted Index)' },
      sections: {
        interviewer_expectation: `Creating an index is easy, but knowing *which* index to create requires expertise. Interviewers want to see that you look past the default B-Tree.\n\nExpectations:\n- Understanding that B-Tree is the default and good for equality/range queries.\n- Giving examples of advanced indexes like GIN for JSONB/Arrays.\n- Explaining Partial Indexes to save space.\n- Explaining Composite (Multi-column) Indexes and the importance of column order.`,
        core_concepts: `**1. B-Tree (Balanced Tree):**\nThis is the default index type in almost all databases. It is highly optimized for equality (\`=\`) and range queries (\`<\`, \`>\`, \`BETWEEN\`, \`IN\`). It keeps data sorted, making it ideal for \`ORDER BY\` operations.\n\n**2. GIN (Generalized Inverted Index):**\nGIN is designed for handling values that contain multiple elements, like Arrays, JSONB documents, and Full-Text Search. If you have a JSONB column and want to find rows where a specific key exists inside the JSON, a B-Tree won't help; you need a GIN index.\n\n**3. GiST (Generalized Search Tree):**\nUsed primarily for complex geometric and spatial data (like PostGIS finding "points within a polygon") and full-text search proximity.\n\n**4. BRIN (Block Range Index):**\nDesigned for massive tables (terabytes in size) where data is naturally naturally sorted physically on the disk (e.g., time-series data with a timestamp column). It stores the min/max values for blocks of pages, making it incredibly small and fast for time-range queries on huge datasets.`,
        important_points: `- **Partial Indexes:** You can add a \`WHERE\` clause to your index creation. If you have 10 million users but only 10,000 are "active", you can create an index *only* on the active users (\`CREATE INDEX idx_active ON users (id) WHERE status = 'active'\`). This makes the index tiny, fast, and cheap to maintain.\n- **Composite Indexes:** An index on \`(last_name, first_name)\` will speed up queries filtering by \`last_name\`, or by both. It will **NOT** help queries filtering *only* by \`first_name\`. Order matters immensely (Left-most prefix rule).\n- **Index Overhead:** Every index slows down \`INSERT\`, \`UPDATE\`, and \`DELETE\` operations because the index data structure must also be updated. Never over-index a table.`,
        code_example: `\`\`\`sql
-- 1. Standard B-Tree Index (Default)
-- Good for fast lookups by email
CREATE INDEX idx_users_email ON users (email);

-- 2. GIN Index for JSONB data
-- Allows extremely fast searching inside the JSON document
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    metadata JSONB
);
-- Using the jsonb_ops operator class
CREATE INDEX idx_orders_metadata ON orders USING GIN (metadata);

-- Query that will use the GIN index to find orders shipped to NY
SELECT * FROM orders WHERE metadata @> '{"shipping_state": "NY"}';

-- 3. Partial Index
-- We only ever query for Unprocessed events. No need to index the millions of processed ones.
CREATE INDEX idx_unprocessed_events ON webhooks (created_at) 
WHERE status = 'UNPROCESSED';

-- 4. Composite (Multi-Column) Index
-- Speeds up queries like: WHERE last_name = 'Smith' AND dept = 'Sales'
CREATE INDEX idx_employees_name_dept ON employees (last_name, department);
-- WARNING: Will NOT help a query like: WHERE department = 'Sales'
\`\`\``,
        speakable_answer: `While the standard B-Tree index is perfect for 90% of use cases—handling equality, range checks, and sorting—PostgreSQL shines because of its specialized index types.\n\nFor example, if you are storing JSONB data or native Arrays, you should use a GIN index, or Generalized Inverted Index. GIN allows Postgres to look inside the JSON document and quickly find rows containing specific keys or values, which turns Postgres into a highly capable document database.\n\nFor massive, terabyte-scale tables handling time-series data, you might use a BRIN index. Instead of indexing every single row, BRIN just stores the minimum and maximum timestamp values for blocks of data on the disk, making the index incredibly small and fast to update.\n\nPostgres also supports Partial Indexes. Rather than indexing an entire table, you can attach a WHERE clause to the index creation. If you frequently query a 'users' table only for users whose status is 'active', you can index just those rows. This saves massive amounts of disk space and memory compared to indexing millions of inactive users.\n\nFinally, it's crucial to remember that while indexes dramatically speed up SELECT queries, they penalize INSERTs and UPDATEs, so you must carefully balance your write-load against your read-load.`,
        followup_questions: `- What is the "Left-most prefix rule" in relation to Composite Indexes?\n- How do you figure out if PostgreSQL is actually using the index you created?\n- What is the difference between an Index Scan and a Bitmap Index Scan in an \`EXPLAIN\` plan?\n- How does a \`UNIQUE\` index differ conceptually from a standard B-Tree index?`,
      }
    },
    {
      title: 'How do you analyze and optimize a slow query in PostgreSQL',
      metaTitle: 'PostgreSQL Query Optimization: Using EXPLAIN ANALYZE',
      metaDesc: 'A step-by-step guide to debugging slow PostgreSQL queries using EXPLAIN ANALYZE, understanding query plans, and identifying missing indexes.',
      concepts: ['EXPLAIN ANALYZE', 'Query Optimization', 'Seq Scan'],
      quiz: { q: 'What is the primary difference between EXPLAIN and EXPLAIN ANALYZE in Postgres?', opts: ['There is no difference', 'EXPLAIN ANALYZE actually executes the query to get real timing data', 'EXPLAIN ANALYZE formats the output as JSON', 'EXPLAIN requires superuser privileges'], ans: 'EXPLAIN ANALYZE actually executes the query to get real timing data' },
      sections: {
        interviewer_expectation: `You will inevitably write a slow query in your career. Interviewers want to know your debugging methodology. "I add an index to everything" is the wrong answer.\n\nExpectations:\n- Knowing the command \`EXPLAIN ANALYZE\`.\n- Understanding the difference between a Sequential Scan (Seq Scan) and an Index Scan.\n- Identifying common bottlenecks (missing indexes, bad joins, sorting in memory).\n- Knowing how to read the cost and timing metrics.`,
        core_concepts: `**1. The Query Planner:**\nBefore Postgres executes a query, the Query Planner generates a "plan". It looks at table statistics (row counts, data distribution) and decides whether to use an index, how to join tables (Hash Join vs Nested Loop), and how to sort data.\n\n**2. EXPLAIN vs EXPLAIN ANALYZE:**\n- \`EXPLAIN select ...\` shows the *estimated* execution plan based on statistics. It does not run the query.\n- \`EXPLAIN ANALYZE select ...\` **actually executes the query** (be careful with UPDATE/DELETE!). It shows the estimated plan alongside the *actual* execution times and row counts.\n\n**3. Scan Types to look for:**\n- **Seq Scan (Sequential Scan):** The database reads every single row in the table from disk to find matches. This is terrible for large tables and usually indicates a missing index.\n- **Index Scan:** The database uses an index to find the exact disk locations of the requested rows, then fetches them. Highly efficient.\n- **Index Only Scan:** The query only asked for columns that are already present inside the index itself. The database doesn't even need to look at the main table data. This is the fastest possible scan.`,
        important_points: `- A \`Seq Scan\` is not *always* bad. If a table is very small (e.g., 50 rows), or if your query returns 90% of a large table, Postgres knows that doing a Seq Scan is actually faster than reading the index and then jumping around the disk to fetch rows.\n- Look at the **Actual time** vs estimated **Cost**. Cost is an arbitrary unit used by the planner; time is what matters to users.\n- Look for **"Sort Method: external merge Disk"**. This means your \`ORDER BY\` required more memory than \`work_mem\` allowed, so Postgres had to write temporary files to the hard drive, which is incredibly slow. Increase \`work_mem\` or add an index that pre-sorts the data.`,
        code_example: `\`\`\`sql
-- 1. Run EXPLAIN ANALYZE on a slow query
EXPLAIN ANALYZE 
SELECT email, last_login 
FROM users 
WHERE status = 'ACTIVE' 
ORDER BY last_login DESC 
LIMIT 10;

/* Sample Output Analysis:

Limit  (cost=1000.00..1000.10 rows=10 width=40) (actual time=500.2..500.3 rows=10 loops=1)
  -> Sort  (cost=1000.00..1050.00 rows=50000 width=40) (actual time=500.1..500.2 rows=10 loops=1)
        Sort Key: last_login DESC
        Sort Method: quicksort  Memory: 3000kB
        -> Seq Scan on users  (cost=0.00..800.00 rows=50000 width=40) (actual time=0.05..300.5 rows=50000 loops=1)
              Filter: ((status)::text = 'ACTIVE'::text)
              Rows Removed by Filter: 950000

THE DIAGNOSIS:
1. "Seq Scan on users": It read all 1,000,000 rows to find the 50,000 active ones.
2. "Rows Removed by Filter: 950000": Wasted massive I/O reading irrelevant data.
3. Time: It took 300ms just to do the scan.
*/

-- 2. The Fix: Create a composite index to handle the filter AND the sort
CREATE INDEX idx_users_status_login ON users (status, last_login DESC);

-- 3. Run EXPLAIN ANALYZE again
-- The output will now likely show an "Index Scan" taking 0.5ms instead of 500ms.
\`\`\``,
        speakable_answer: `When confronted with a slow query, my immediate first step is to prefix the query with EXPLAIN ANALYZE. Unlike a standard EXPLAIN which just gives the planner's estimates, EXPLAIN ANALYZE actually executes the query and provides the real execution time and row counts for each step of the plan.\n\nI read the output from the bottom up, looking for specific red flags. The most common offender is a Sequential Scan (Seq Scan) on a large table, especially if I see a high number of 'Rows Removed by Filter'. This indicates the database is reading thousands of rows from the hard drive only to immediately throw them away, which is a classic sign of a missing index.\n\nAnother thing I look for is 'External Merge Disk' during a sort operation. This means the query's ORDER BY clause ran out of RAM—specifically, the 'work_mem' setting—and had to write temporary sorting data to the hard disk, which causes a massive performance hit.\n\nOnce I identify the bottleneck, I'll typically add a B-Tree index on the filtered columns. If the query does both filtering and sorting, I'll create a composite index that covers the WHERE clause first and the ORDER BY clause second to satisfy the entire query efficiently space.`,
        followup_questions: `- What is an "Index Only Scan" and why is it faster than an "Index Scan"?\n- In what scenario would the query planner intentionally choose a Seq Scan over an existing Index Scan?\n- What does the \`ANALYZE\` command (run by itself, not with EXPLAIN) do in PostgreSQL?\n- How does a Hash Join work compared to a Nested Loop Join?`,
      }
    },
    {
      title: 'What connection pooling mechanisms are typically used with PostgreSQL',
      metaTitle: 'PostgreSQL Connection Pooling: PgBouncer and HikariCP',
      metaDesc: 'Understand why PostgreSQL struggles with high connection counts and how to solve it using application-level (HikariCP) and external (PgBouncer) connection pools.',
      concepts: ['Connection Pooling', 'PgBouncer', 'HikariCP'],
      quiz: { q: 'Because PostgreSQL forks a new OS process for every connection, what is the best practice for handling thousands of client connections?', opts: ['Increase the max_connections setting in postgresql.conf to 10,000', 'Use a connection pooler like PgBouncer in front of the database', 'Switch to a NoSQL database', 'Use persistent HTTP keep-alives'], ans: 'Use a connection pooler like PgBouncer in front of the database' },
      sections: {
        interviewer_expectation: `This question tests system design and DevOps awareness. Postgres handles connections differently than some other DBs, and naive scaling leads to immediate crashes.\n\nExpectations:\n- Explaining the Postgres connection model (Process per connection).\n- Understanding the overhead of opening/closing connections.\n- Differentiating between Application-level pooling (HikariCP in Spring) and External pooling (PgBouncer).\n- Knowing why cranking up \`max_connections\` is a bad idea.`,
        core_concepts: `**The PostgreSQL Connection Model:**\nUnlike MySQL or MongoDB which use lightweight threads for connections, PostgreSQL forks a completely new Operating System **process** for every single client connection. This consumes significant RAM (roughly 5-10MB per connection) and CPU context-switching overhead. If you have 2,000 microservices all opening direct connections, Postgres will run out of memory and crash.\n\n**Application-Level Pooling (HikariCP):**\nIn a Java/Spring Boot app, opening a TCP connection to the DB for every HTTP request takes hundreds of milliseconds. We use libraries like **HikariCP** to maintain a small pool of open connections (e.g., 10 per application instance). When a request comes in, it borrows a connection from the pool, runs the query, and returns it. This eliminates TCP handshake overhead.\n\n**External Pooling (PgBouncer):**\nIf you horizontal-scale your application to 100 instances, and each has a Hikari pool of 20, you suddenly have 2,000 connections hitting Postgres. To solve this, you place a lightweight middleware tool called **PgBouncer** between the apps and the database. PgBouncer holds exactly 2,000 lightweight connections from the apps, but funnels them all down into a small, highly efficient pool of just 50 actual heavy processes connected to Postgres.`,
        important_points: `- **Never solve scale by editing postgresql.conf:** Increasing \`max_connections\` from 100 to 5000 is a classic rookie mistake. The database will spend all its CPU time context-switching between 5000 processes rather than actually executing queries (thrashing). Keep \`max_connections\` low (e.g., a few hundred) and use a pooler.\n- **Transaction vs Session pooling in PgBouncer:**\n  - *Session pooling:* A connection is assigned to a client for the duration of its session. Safe, but doesn't scale as high.\n  - *Transaction pooling:* A connection is assigned to a client *only* for a single transaction, then immediately handed to another client. Enables massive scaling, but breaks features that rely on session state (like prepared statements or temp tables).`,
        code_example: `\`\`\`yaml
# Spring Boot application.yml configuring Application-Level Pooling (HikariCP)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: myuser
    password: password
    hikari:
      # Maximum number of actual connections to the DB this instance will hold
      maximum-pool-size: 15
      
      # How long to wait for a connection before failing the request
      connection-timeout: 30000 
      
      # How long a connection can sit idle in the pool before being retired
      idle-timeout: 600000

---
# Architecture Concept:

[ App Instance 1 (Hikari: 15 open) ] \\
[ App Instance 2 (Hikari: 15 open) ] --- (45 TCP Conns) ---> [ PgBouncer ] 
[ App Instance 3 (Hikari: 15 open) ]                         |
                                                             | (Multiplexes 45 down to 10)
                                                             v
                                                   [ PostgreSQL Server ]
                                                   (Only manages 10 heavy processes)
\`\`\``,
        speakable_answer: `Connection pooling is critical for PostgreSQL because of its architectural design. Unlike databases that use lightweight threads, Postgres forks a completely new OS process for every incoming connection. Each process consumes several megabytes of RAM. If you allow thousands of direct connections, the server will quickly exhaust its memory and spend all its CPU cycles context-switching rather than executing queries.\n\nWe solve this at two levels. First, at the application level in Spring Boot, we use a connection pool like HikariCP. Instead of opening and closing a TCP connection for every web request—which is very slow—Hikari maintains a small, persistent pool of connections, reusing them across requests.\n\nHowever, in a microservices environment where you might have dozens of application instances, the total number of connections can still overwhelm Postgres. The second level of defense is an external pooler, typically PgBouncer. You place PgBouncer in front of the database. The applications connect to PgBouncer, which handles thousands of lightweight connections effortlessly, and PgBouncer multiplexes those requests down a small pipe of maybe 50 heavy, actual connections into PostgreSQL.`,
        followup_questions: `- What happens if a Spring Boot application requests a database connection but the Hikari pool is exhausted?\n- Explain the difference between PgBouncer's 'Transaction Pooling' and 'Session Pooling' modes.\n- Why might Java Prepared Statements cause issues when using PgBouncer in Transaction mode?\n- How does HikariCP validate that a connection is still alive before handing it to the application?`,
      }
    }
  ],
  'redis': [
    {
      title: 'What is Redis and what are its primary use cases in a backend architecture',
      metaTitle: 'Introduction to Redis: Real-World Backend Use Cases',
      metaDesc: 'Discover what Redis is (an in-memory data store) and explore its most common architectural use cases: Caching, Session Management, and Pub/Sub.',
      concepts: ['Redis', 'In-Memory Database', 'Caching', 'Architecture'],
      quiz: { q: 'Which of the following is NOT a typical use case for Redis?', opts: ['Caching API responses', 'Storing complex relational data with foreign keys', 'Managing distributed user sessions', 'Implementing a real-time leaderboard'], ans: 'Storing complex relational data with foreign keys' },
      sections: {
        interviewer_expectation: `This checks foundational knowledge. Candidates should know Redis is more than just a "cache" and understand where it fits in a broader system.\n\nExpectations:\n- Defining Redis as an in-memory, key-value data store.\n- Highlighting speed (RAM vs Disk).\n- Listing primary use cases (Caching, Session Store, Leaderboards, Pub/Sub, Rate Limiting).`,
        core_concepts: `**What is Redis?**\nRemote Dictionary Server (Redis) is an open-source, in-memory, key-value data store. Because it stores all data in RAM (Random Access Memory) rather than on spinning disks or SSDs, its read and write operations are incredibly fast, often responding in under a millisecond.\n\n**Data Structures:**\nUnlike Memcached, which only stores strings, Redis supports advanced data structures like Lists, Sets, Sorted Sets, Hashes, and Geographic indexes.\n\n**Primary Use Cases:**\n1.  **Database Caching:** Sitting in front of a slow database (like PostgreSQL) to store frequently accessed data. If a query takes 200ms in Postgres, Redis can return the cached result in 1ms.\n2.  **Session Management:** In stateless microservices, storing user session IDs and login state globally so any server instance can authenticate the user instantly.\n3.  **Rate Limiting:** Using Redis's atomic increment commands and Time-To-Live (TTL) feature to count API requests per IP address to prevent abuse.\n4.  **Gaming Leaderboards:** Using Redis "Sorted Sets" (\`ZSET\`) to maintain millions of player scores perfectly sorted in real-time.\n5.  **Pub/Sub Messaging:** Acting as a lightweight message broker for real-time notifications or chat features between different backend instances.`,
        important_points: `- **Volatility:** Because data lives in RAM, if the server crashes or loses power, data *can* be lost. It should not be used as the primary source of truth for critical transactional data without careful persistence configuration (AOF/RDB).\n- **Single-Threaded:** Redis executes commands using a single event loop thread. This guarantees atomicity (no race conditions for simple commands), but means a long-running command (like \`KEYS *\`) will block all other connections.`,
        code_example: `\`\`\`java
// A conceptual Spring Boot Service demonstrating Redis Use Cases
@Service
public class RedisDemoService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 1. CACHING 
    public String getProductDetails(String productId) {
        String cacheKey = "product:" + productId;
        
        // Check Redis first
        String cachedData = redisTemplate.opsForValue().get(cacheKey);
        if (cachedData != null) {
            return cachedData; // Super fast return
        }
        
        // Cache miss: Hit the slow database
        String dbData = fetchFromSlowDatabase(productId);
        
        // Save to Redis with a 1-hour Time-To-Live (TTL)
        redisTemplate.opsForValue().set(cacheKey, dbData, 1, TimeUnit.HOURS);
        return dbData;
    }

    // 2. RATE LIMITING (e.g., 5 requests per minute)
    public boolean isRateLimited(String ipAddress) {
        String key = "rate_limit:" + ipAddress;
        
        // Atomic increment. Returns the new value.
        Long requests = redisTemplate.opsForValue().increment(key);
        
        if (requests == 1) {
            // First request, set expiration for 1 minute
            redisTemplate.expire(key, 1, TimeUnit.MINUTES);
        }
        
        return requests > 5; // Block if over 5
    }

    // 3. LEADERBOARD (Using Sorted Sets)
    public void addPlayerScore(String player, double score) {
        redisTemplate.opsForZSet().add("game:leaderboard", player, score);
    }
}
\`\`\``,
        speakable_answer: `Redis is an incredibly fast, open-source, in-memory data structure store. Unlike traditional relational databases that write data to a hard drive, Redis keeps everything in RAM, allowing it to process millions of requests a second with sub-millisecond latency.\n\nWhile it is technically a key-value store, it supports rich data structures like Hashes, Lists, and Sorted Sets. \n\nIts most common architectural use case is Database Caching. By placing Redis in front of a primary database like PostgreSQL, you can cache the results of expensive queries. Subsequent requests hit Redis instead of the database, vastly reducing load and latency.\n\nBeyond caching, Redis is the industry standard for distributed Session Management in microservices architectures. It's also widely used for Rate Limiting API endpoints using its atomic increment functions paired with Time-to-Live expirations. Finally, its Sorted Set data structure makes it the premier tool for building real-time gaming leaderboards, and it offers lightweight Pub/Sub capabilities for real-time messaging.`,
        followup_questions: `- What is the fundamental architectural difference between Redis and Memcached?\n- Because Redis is an in-memory store, how does it handle data persistence in case the server crashes?\n- Explain why the single-threaded nature of Redis is both a massive benefit and a potential hazard.\n- How does Redis's Eviction Policy work when the server runs out of RAM?`,
      }
    },
    {
      title: 'Explain Caching Strategies like Cache-Aside, Read-Through, and Write-Through',
      metaTitle: 'Redis Caching Strategies: Cache-Aside vs Write-Through',
      metaDesc: 'Compare the most common caching patterns used with Redis in backend architectures, including their pros, cons, and implementation complexity.',
      concepts: ['Cache-Aside', 'Read-Through', 'Write-Through', 'Write-Behind'],
      quiz: { q: 'In the Cache-Aside pattern, who is responsible for fetching data from the database upon a cache miss?', opts: ['The Redis Server', 'The Database Server', 'The Application Code', 'The Network Router'], ans: 'The Application Code' },
      sections: {
        interviewer_expectation: `This tests system design patterns. Throwing Redis into an architecture without a strategy leads to stale data and cache stampedes.\n\nExpectations:\n- Defining Cache-Aside (Lazy Loading) as the most common pattern.\n- Explaining Write-Through (proactive caching).\n- Understanding the trade-offs regarding data staleness and application complexity.`,
        core_concepts: `**1. Cache-Aside (Lazy Loading):**\n- **How it works:** The application asks the Cache for data. If it's a "hit", it returns the data. If it's a "miss", the *application* connects to the Database, retrieves the data, returns it to the user, and then saves it in the Cache for the next time.\n- **Pros:** Only requested data is cached (saves RAM). Cache failures don't break the app (it just falls back to the DB).\n- **Cons:** The first request is always slow (cache miss penalty). Data can become stale if the DB is updated without invalidating the cache.\n\n**2. Read-Through / Write-Through:**\n- **How it works:** The application *only* talks to the Cache. The Cache provider itself (or a framework layer doing it transparently) handles reading from and writing to the database synchronously.\n- **Write-Through:** When saving data, the app writes to the Cache, which immediately writes to the DB. Both must succeed before returning success to the user.\n- **Pros:** Data in the cache is **never stale**. No cache misses for updated data.\n- **Cons:** Writes are slower because they must hit two systems synchronously. Most data written might never actually be read, wasting RAM.\n\n**3. Write-Behind (Write-Back):**\n- **How it works:** The app writes data to the Cache and immediately returns success to the user. The Cache asynchronously writes the data to the Database in the background.\n- **Pros:** Incredibly fast writes. Great for write-heavy applications.\n- **Cons:** High risk of data loss. If the Cache server crashes before syncing to the DB, the data is gone forever.`,
        important_points: `- Spring Boot's \`@Cacheable\` abstraction implements the **Cache-Aside** pattern natively.\n- **Cache Invalidation:** The hardest problem in caching. If you use Cache-Aside, you must ensure that when an \`UPDATE\` happens in the database, you either delete that specific key from Redis or overwrite it with the new data to prevent serving stale information.\n- **Time-To-Live (TTL):** Every cached item should have a TTL. This acts as a safety net against stale data and prevents the cache from infinitely growing and running out of memory.`,
        code_example: `\`\`\`java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @Autowired
    private ObjectMapper mapper;

    // --- MANUAL CACHE-ASIDE PATTERN ---
    public User getUser(Long id) throws Exception {
        String key = "user:" + id;
        
        // 1. Read from Cache
        String cachedValue = redisTemplate.opsForValue().get(key);
        if (cachedValue != null) {
            return mapper.readValue(cachedValue, User.class); // Cache HIT
        }
        
        // 2. Cache MISS: Read from DB
        User user = userRepository.findById(id).orElseThrow();
        
        // 3. Write to Cache with a TTL (Safety net for staleness & memory)
        redisTemplate.opsForValue().set(key, mapper.writeValueAsString(user), 15, TimeUnit.MINUTES);
        
        return user;
    }

    // --- CACHE INVALIDATION ON UPDATE ---
    public User updateUser(Long id, String newName) {
        User user = userRepository.findById(id).orElseThrow();
        user.setName(newName);
        User saved = userRepository.save(user);
        
        // CRITICAL: Must invalidate the cache so the next read fetches the fresh DB data
        redisTemplate.delete("user:" + id);
        
        return saved;
    }
}
\`\`\``,
        speakable_answer: `When integrating Redis, you have to choose a caching strategy to handle how data flows between the application, the cache, and the database.\n\nThe most prominent strategy is Cache-Aside, also known as Lazy Loading. In this pattern, the application code is in charge. It queries Redis first. If the data isn't there, the application queries the database, returns the result, and then actively stores a copy in Redis. The major benefit is that we only cache data that users actually request, saving RAM. The drawback is that data can become stale if the database is updated directly, unless we implement careful cache invalidation logic on our write endpoints.\n\nAn alternative is the Write-Through pattern. Here, the application writes data to the cache, and the cache layer synchronously writes it to the database before acknowledging success. This guarantees that the cache and database are always in perfect sync and data is never stale. However, it means writes are slightly slower, and you end up storing data in volatile memory that might never actually be read.\n\nA third approach is Write-Behind, where the application writes to Redis and returns immediately, and Redis flushes the data to the database asynchronously. This offers extreme write performance, but carries a high risk of permanent data loss if the Redis node crashes before synchronizing.`,
        followup_questions: `- How does Spring Boot's \`@Cacheable\` annotation simplify the Cache-Aside pattern?\n- What is a "Cache Stampede" (or Thundering Herd), and how do you prevent it?\n- If you choose a Write-Through strategy, how do you handle scaling the cache instances?\n- Why is "Cache Invalidation" often jokingly called one of the two hardest problems in computer science?`,
      }
    },
    {
      title: 'How does Spring Boot integrate with Redis using Spring Data Redis and @Cacheable',
      metaTitle: 'Spring Boot Redis Integration: @Cacheable and RedisTemplate',
      metaDesc: 'Learn the idiomatic ways to integrate Redis in a Spring Boot application using Spring Data Redis abstractions and Cache annotations.',
      concepts: ['Spring Data Redis', '@Cacheable', 'RedisTemplate'],
      quiz: { q: 'Which Spring Boot annotation automatically intercepts a method call, checks the cache for a result, and only executes the method logic on a cache miss?', opts: ['@CachePut', '@Transactional', '@Cacheable', '@RedisCached'], ans: '@Cacheable' },
      sections: {
        interviewer_expectation: `This tests framework-specific knowledge. A good Spring developer shouldn't be writing manual boilerplate code for standard caching operations.\n\nExpectations:\n- Knowing the starter dependency (\`spring-boot-starter-data-redis\`).\n- Explaining the declarative approach: \`@EnableCaching\` + \`@Cacheable\`, \`@CacheEvict\`, \`@CachePut\`.\n- Explaining the programmatic approach: \`RedisTemplate\` / \`StringRedisTemplate\` for complex data structures (Lists, ZSets).`,
        core_concepts: `**1. The Declarative Approach (Cache Abstraction):**\nSpring provides an elegant AOP-based abstraction for caching. You add \`@EnableCaching\` to your main class, and then annotate methods.\n- **\`@Cacheable("users")\`:** Before the method executes, Spring checks Redis. If the result is there, the method *is completely bypassed* and the cached data is returned. If missing, the method runs, and Spring automatically stores the return value in Redis.\n- **\`@CachePut("users")\`:** Always executes the method and updates the cache with the new return value. Useful for update operations.\n- **\`@CacheEvict("users")\`:** Removes data from the cache. Used on delete/update methods to prevent stale data.\n\n**2. The Programmatic Approach (RedisTemplate):**\nThe \`@Cacheable\` abstraction only works for simple key-value string caching. If you need to use Redis's advanced data structures (Lists, Hashes, Sorted Sets for leaderboards), you must inject the \`RedisTemplate\` bean. \`StringRedisTemplate\` is a specialized version optimized for String keys and values, which avoids Java serialization complexities.`,
        important_points: `- **Keys in @Cacheable:** By default, Spring uses the method parameters to generate the Redis key. You can customize this using SpEL (e.g., \`@Cacheable(value = "users", key = "#id")\`).\n- **Serialization:** When storing Java objects via \`@Cacheable\`, Spring needs to serialize them. By default, it uses Java's native serialization (which is binary, unreadable, and coupled to the class definition). It is highly recommended to configure a \`GenericJackson2JsonRedisSerializer\` to store data as human-readable JSON.\n- **Proxy Limitations:** Because \`@Cacheable\` uses Spring AOP proxies, calling a \`@Cacheable\` method from *within the same class* bypasses the proxy, meaning the cache will not be checked or updated.`,
        code_example: `\`\`\`java
@SpringBootApplication
@EnableCaching // 1. CRITICAL: Enables the annotation processing
public class MyApplication {}

@Service
public class UserService {

    // --- DECLARATIVE METHOD (Simple Key-Value) ---

    // Checks Redis key "users::{id}". Bypasses method if found.
    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        System.out.println("Cache miss! Hitting database...");
        return userRepository.findById(id).orElseThrow();
    }

    // Always runs, then deletes the key from Redis to prevent stale data
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    // Always runs, updates the cache with the new returned User object
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }


    // --- PROGRAMMATIC METHOD (Advanced Data Structures) ---
    
    @Autowired
    private StringRedisTemplate redisTemplate;

    public void logUserAction(String username, String action) {
        // Pushes an item onto a Redis List (LPUSH)
        redisTemplate.opsForList().leftPush("recent_actions:" + username, action);
        
        // Keeps only the 10 most recent actions (LTRIM)
        redisTemplate.opsForList().trim("recent_actions:" + username, 0, 9);
    }
}
\`\`\``,
        speakable_answer: `Spring Boot makes configuring Redis incredibly easy through the spring-boot-starter-data-redis dependency. There are two primary ways to interact with it.\n\nThe most idiomatic way for simple caching is using Spring's declarative Cache Abstraction. You add @EnableCaching to the application, and then use annotations like @Cacheable on your service methods. When a request comes in, Spring uses an AOP proxy to intercept the call. It checks Redis for the key based on the method parameters. If the data is found, the method is skipped entirely and the cached data is returned. If not, the method executes, and Spring automatically stores the result in Redis. You pair this with @CacheEvict on your update or delete methods to clear the cache and prevent stale data.\n\nHowever, @Cacheable is limited to simple key-value storage. If you want to leverage Redis's powerful data structures—like pushing data to a List for a message queue, or adding scores to a Sorted Set for a leaderboard—you use the programmatic approach. You inject a bean called StringRedisTemplate into your service, which provides specialized methods like opsForSet() or opsForList() to interact with Redis commands directly from Java.`,
        followup_questions: `- What serialize does Spring Data Redis use by default for Java objects, and why should you usually change it to JSON?\n- If two threads call a \`@Cacheable\` method simultaneously and there is a cache miss, how many database calls are made?\n- Explain why calling a \`@Cacheable\` method from another method within the same service class doesn't work.\n- How do you configure a global Time-To-Live (TTL) for all caches created by \`@Cacheable\`?`,
      }
    },
    {
      title: 'How does Redis handle data persistence (RDB vs AOF)',
      metaTitle: 'Redis Persistence Mechanisms: RDB Snapshots vs AOF Logs',
      metaDesc: 'Understand how an in-memory database like Redis prevents data loss during crashes using RDB (Redis Database) snapshots and AOF (Append Only File) logging.',
      concepts: ['Redis Persistence', 'RDB (Redis Database)', 'AOF (Append Only File)'],
      quiz: { q: 'Which Redis persistence method logs every single write operation received by the server to a file, allowing for the highest level of durability?', opts: ['RDB (Redis Database snapshots)', 'LRU Eviction', 'AOF (Append Only File)', 'Write-Behind caching'], ans: 'AOF (Append Only File)' },
      sections: {
        interviewer_expectation: `This dives into DevOps and reliability. If a candidate thinks "in-memory" strictly means "data is lost on reboot," they don't know Redis deeply.\n\nExpectations:\n- Explaining that Redis *can* persist data to disk.\n- Differentiating between RDB (point-in-time snapshots) and AOF (continuous transaction log).\n- Weighing the pros and cons of both (Recovery speed vs Data safety).`,
        core_concepts: `**The Volatility Problem:**\nAs an in-memory database, everything in Redis lives in RAM. If the server process dies, the OS reboots, or power is lost, RAM is wiped. Redis offers two persistence mechanisms to write data to the hard drive to survive restarts.\n\n**1. RDB (Redis Database - Snapshots):**\nRDB takes a point-in-time snapshot of the entire dataset and saves it to a binary file (\`dump.rdb\`) on disk at specified intervals (e.g., every 5 minutes if at least 100 keys changed). \n- Redis achieves this by forking a child process. The child process writes the memory to disk while the parent process continues serving client requests without blocking.\n\n**2. AOF (Append Only File - Logs):**\nAOF logs every single write operation (every \`SET\`, \`INCR\`, etc.) received by the server to a text-like log file. When Redis restarts, it literally replays the entire log from top to bottom to rebuild the dataset in memory.`,
        important_points: `- **RDB Pros/Cons:** Pros: Snapshots are compact, maximize Redis performance (since disk I/O is handled by a child process), and are incredibly fast to load on restart. Cons: Data loss. If it snapshots every 5 minutes and crashes at minute 4:59, you lose 4 minutes and 59 seconds of data.\n- **AOF Pros/Cons:** Pros: Much higher durability. You can configure it to \`fsync\` to disk every single second, meaning you'd lose a maximum of 1 second of data. Cons: The log file becomes absolutely massive over time, and restarting the server takes a very long time because it has to replay millions of commands.\n- **AOF Rewrite:** To solve the file size issue, Redis continuously runs an "AOF Rewrite" process in the background. If you increment a counter 100 times, the log has 100 entries. The rewrite process compresses this into a single \`SET\` command, shrinking the file.\n- **The Hybrid Approach:** In production, you typically enable both. Redis will use AOF for the safest reconstruction on restart, but you keep RDB enabled to easily copy the snapshot files for off-site disaster recovery backups.`,
        code_example: `\`\`\`conf
# Snippets from redis.conf showing persistence configuration

# --- RDB CONFIGURATION ---
# Save a snapshot if the given seconds and number of writes occurred
# Save after 900 sec (15 min) if at least 1 key changed
save 900 1
# Save after 300 sec (5 min) if at least 10 keys changed
save 300 10
# Save after 60 sec if at least 10000 keys changed
save 60 10000

# The name of the snapshot file
dbfilename dump.rdb


# --- AOF CONFIGURATION ---
# Turn AOF on (Disabled by default)
appendonly yes
# The name of the log file
appendfilename "appendonly.aof"

# How often to sync the log to the physical hard drive (Durability)
# options: always | everysec | no
# 'everysec' is the industry standard compromise between performance and data safety.
appendfsync everysec

# Auto-rewrite AOF file if it grows 100% larger than its previous base size
auto-aof-rewrite-percentage 100
\`\`\``,
        speakable_answer: `Even though Redis is an in-memory database, it provides robust ways to persist data to the hard drive so it doesn't get wiped out if the server crashes. There are two main mechanisms: RDB and AOF. \n\nRDB stands for Redis Database. It takes point-in-time snapshots of the entire memory dataset at configured intervals—say, every 5 minutes—and saves it as a compact binary file. Because Redis forks a child process to do the disk writing, it doesn't interrupt the main thread serving clients. RDB files are great for backups and restart very quickly, but if a crash happens between snapshots, you lose minutes of data.\n\nTo prevent data loss, you use AOF, or the Append Only File. AOF logs every single write command—like every SET or DEL—to a file on disk. You usually configure this to sync to the disk every second. If the server crashes, you lose a maximum of one second of data. When Redis reboots, it reads the log and replays the commands to rebuild the memory state. \n\nBecause AOF logs can grow endlessly, Redis performs background rewrites to compress the file. In serious production environments, you typically enable both: AOF guarantees data durability, while RDB snapshots provide easily transportable files for off-site disaster recovery.`,
        followup_questions: `- Explain how the \`fork()\` system call works when Redis creates an RDB snapshot.\n- What is the performance impact of setting AOF fsync to \`always\` versus \`everysec\`?\n- If both RDB and AOF are enabled, which one does Redis use to reconstruct memory on startup and why?\n- Explain what an AOF Rewrite does to save disk space.`,
      }
    },
    {
      title: 'What happens when Redis runs out of memory (Eviction Policies)',
      metaTitle: 'Redis Memory Management: Eviction Policies Explained',
      metaDesc: 'Learn how Redis behaves when RAM is full, explaining the maxmemory setting and various eviction policies like LRU (Least Recently Used) and LFU.',
      concepts: ['Eviction Policies', 'Memory Management', 'LRU (Least Recently Used)'],
      quiz: { q: 'Which Redis eviction policy removes the keys that have been idle (unused) for the longest amount of time?', opts: ['allkeys-random', 'volatile-ttl', 'allkeys-lru', 'noeviction'], ans: 'allkeys-lru' },
      sections: {
        interviewer_expectation: `Memory is expensive and finite. A backend engineer must know what happens to the system when the cache hits 100% capacity.\n\nExpectations:\n- Knowing the \`maxmemory\` directive.\n- Understanding that default behavior is usually an error (OOM).\n- Defining LRU (Least Recently Used) vs LFU (Least Frequently Used).\n- Differentiating between evicting *any* key vs only keys with a TTL (\`volatile\`).`,
        core_concepts: `**The Memory Limit:**\nUnlike a hard drive that can hold terabytes, a Redis instance is strictly limited by the physical RAM on the server (or a configured \`maxmemory\` limit). When Redis reaches that limit, it needs a rule on what to do next. \n\n**OOM (Out Of Memory) - The \`noeviction\` Default:**\nIf you don't configure a policy, Redis defaults to \`noeviction\`. It will successfully serve read commands (like \`GET\`), but any command that uses more memory (like \`SET\` or \`INCR\`) will fail and return an OOM error to your application, potentially breaking the architecture.\n\n**Eviction Policies:**\nTo make Redis act as a true cache, you configure an eviction policy. When memory fills up, Redis will actively delete old data to make room for new data based on specific algorithms: LRU (Time-based), LFU (Frequency-based), Random, or TTL-based.`,
        important_points: `- **LRU (Least Recently Used):** Tracks the *time* since the key was last accessed. The key that hasn't been touched in the longest amount of time is deleted.\n- **LFU (Least Frequently Used):** Tracks the *number of times* a key was accessed. The keys with the lowest hit counts are deleted, regardless of when they were last touched.\n- **Volatile vs AllKeys:** \n  - Policies starting with \`allkeys-\` (e.g., \`allkeys-lru\`) will evict *any* key in the database.\n  - Policies starting with \`volatile-\` (e.g., \`volatile-lru\`) will *only* evict keys that were explicitly given a Time-To-Live (TTL) expiration. Keys without an expiration are considered permanent and are safe from eviction.\n- If you use Redis as both a Cache and a Session Store on the same instance, using \`allkeys\` might accidentally delete active user sessions. Using \`volatile\` ensures only temporary cache data is purged.`,
        code_example: `\`\`\`conf
# redis.conf memory constraints

# 1. Set a hard limit on RAM usage (e.g., 2 Gigabytes)
# Once this is reached, the eviction policy activates
maxmemory 2gb

# 2. Choose the Eviction Policy (maxmemory-policy)

# Option A: The Default. Returns errors on new writes. Never deletes data.
# maxmemory-policy noeviction

# Option B: The Standard Cache approach.
# Evicts the least recently used keys out of ALL keys.
# maxmemory-policy allkeys-lru

# Option C: The Safe Cache approach.
# Evicts least recently used keys, but ONLY those with an expiration set.
# Safe when combining cache data with permanent data (like user profiles).
# maxmemory-policy volatile-lru

# Option D: Frequency based.
# Evicts the least frequently used keys (tracks usage counts).
maxmemory-policy allkeys-lfu
\`\`\``,
        speakable_answer: `Because Redis stores data entirely in RAM, it will eventually hit a physical memory limit. How it reacts is determined by its configured 'maxmemory-policy'.\n\nBy default, Redis is configured with the 'noeviction' policy. This means when RAM is full, it won't delete anything, but it will start returning Out Of Memory errors to your application whenever you try to write new data. This is catastrophic for a caching layer.\n\nTo make it function as a true cache, we usually change the policy to LRU—Least Recently Used. With 'allkeys-lru', Redis tracks when a key was last accessed. When memory fills up, it deletes the data that has sat idle the longest to make room for the new data. There is also an LFU policy—Least Frequently Used—which deletes data that gets requested the least amount of times historically.\n\nYou also have to choose between 'allkeys' and 'volatile'. An 'allkeys' policy will delete anything in the database to free up space. A 'volatile' policy will only evaporate keys that were specifically given a Time-To-Live expiration when they were created. This is vital if you use the same Redis instance for temporary cache data and permanent application state, ensuring critical persistent data isn't unexpectedly purged due to memory pressure.`,
        followup_questions: `- What is the difference between LRU (Least Recently Used) and LFU (Least Frequently Used)?\n- In a microservice architecture, why is it risky to use the same Redis cluster for both temporary page caching and critical user session management?\n- How does the \`volatile-ttl\` policy choose which keys to evict?\n- Explain what Redis does behind the scenes to approximate LRU behavior without consuming massive CPU overhead.`,
      }
    }
  ]
};

async function insertContent() {
  const client = await pool.connect();
  try {
    const domainRes = await client.query("SELECT id FROM domains WHERE slug = 'java-backend-1-3'");
    if (!domainRes.rows.length) return;
    const domainId = domainRes.rows[0].id;

    const stacksRes = await client.query(
      `SELECT ts.id, ts.slug, ts.name FROM domain_stack_map dsm
       JOIN tech_stacks ts ON ts.id = dsm.stack_id
       JOIN domains d ON d.id = dsm.domain_id
       WHERE d.slug = 'java-backend-1-3' ORDER BY dsm.display_order`
    );
    const stackMap = {};
    for (const s of stacksRes.rows) stackMap[s.slug] = s;

    const qsiRes = await client.query(
      `SELECT qsi.stack_id, COUNT(*) as cnt FROM question_stack_index qsi GROUP BY qsi.stack_id`
    );
    const existingCounts = {};
    for (const r of qsiRes.rows) existingCounts[r.stack_id] = parseInt(r.cnt);

    for (const [stackSlug, questions] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      let orderIndex = (existingCounts[stackId] || 0) + 1;

      console.log(`\n▶ Processing stack: ${stackSlug} (id=${stackId})`);

      for (const q of questions) {
        await client.query('BEGIN');
        try {
          const baseSlug = toSlug(q.title);
          const slug = await uniqueSlug(client, baseSlug);

          const qRes = await client.query(
            `INSERT INTO questions(title, slug, difficulty, estimated_read_time, meta_title, meta_description)
             VALUES($1,$2,'medium',4,$3,$4) RETURNING id`,
            [q.title, slug, q.metaTitle, q.metaDesc]
          );
          const questionId = qRes.rows[0].id;
          console.log(`  ✓ Question [${questionId}]: ${q.title.substring(0, 50)}...`);

          await client.query(
            `INSERT INTO question_stack_index(stack_id, question_id, order_index) VALUES($1,$2,$3)`,
            [stackId, questionId, orderIndex++]
          );

          const sectionTypes = [
            'interviewer_expectation', 'core_concepts', 'important_points',
            'code_example', 'speakable_answer', 'followup_questions'
          ];
          for (let i = 0; i < sectionTypes.length; i++) {
            const sType = sectionTypes[i];
            const content = q.sections[sType];
            await client.query(
              `INSERT INTO answer_sections(question_id, section_type, section_order, content) VALUES($1,$2::answer_section_enum,$3,$4)`,
              [questionId, sType, i + 1, content]
            );
          }

          for (const cName of q.concepts) {
            const cId = await getOrCreateConcept(client, cName);
            try {
              await client.query(
                `INSERT INTO question_concepts(question_id, concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
                [questionId, cId]
              );
            } catch (_) {}
          }

          const optionsJson = JSON.stringify(q.quiz.opts);
          await client.query(
            `INSERT INTO question_quizzes(question_id, quiz_question, options, correct_answer) VALUES($1,$2,$3,$4)`,
            [questionId, q.quiz.q, optionsJson, q.quiz.ans]
          );

          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`    ✗ ROLLBACK for "${q.title}": ${err.message}`);
        }
      }
    }

    console.log('\n▶ Adding question relations...');
    for (const [stackSlug] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      const qInStack = await client.query(
        `SELECT question_id FROM question_stack_index WHERE stack_id = $1 ORDER BY order_index DESC LIMIT 10`,
        [stackId]
      );
      const ids = qInStack.rows.map(r => BigInt(r.question_id));
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        const related1 = ids[(i + 1) % ids.length];
        const related2 = ids[(i + 2) % ids.length];
        for (const relId of [related1, related2]) {
          if (relId === ids[i]) continue;
          try {
            await client.query(
              `INSERT INTO question_relations(question_id, related_question_id, relation_type)
               VALUES($1,$2,'related'::relation_type_enum) ON CONFLICT DO NOTHING`,
              [ids[i].toString(), relId.toString()]
            );
          } catch (_) {}
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

insertContent().catch(console.error);
