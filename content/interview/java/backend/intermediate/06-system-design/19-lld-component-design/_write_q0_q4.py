#!/usr/bin/env python3
"""Update Q0-Q4 in complete-qa.json with new Z3 + Z2 + Z1 content."""

import json
import textwrap
from pathlib import Path

CB = "```"
FILE = Path(__file__).parent / "complete-qa.json"


def count_words(text: str) -> int:
    """Count words in text."""
    return len(text.split())


# ---------------------------------------------------------------------------
# Q0 — design-job-queue-system (how-to-recipe, complexity 4, 800-1100w)
# ---------------------------------------------------------------------------

def build_q0_sections() -> list[dict]:

    overview = (
        f"Most teams start with an `ArrayBlockingQueue` for background work — "
        f"send email, resize images, generate reports. It works until the JVM "
        f"restarts and every queued job vanishes without a trace. The "
        f"application comes back clean, and nobody knows work was lost until a "
        f"customer complains about a missing confirmation email three hours "
        f"later.\n\n"
        f"**Persistent job queues** solve this by storing jobs in a durable "
        f"backing store. PostgreSQL handles small-to-medium scale with zero "
        f"infrastructure additions; dedicated systems like Redis or SQS take "
        f"over at high throughput. The critical design challenge is not storage "
        f"but **claiming** — when multiple worker threads or processes compete "
        f"for the next job, you need a mechanism that prevents double-processing "
        f"without serializing all workers behind a single lock.\n\n"
        f"PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED` is the pattern that "
        f"makes relational job queues production-viable. Each worker atomically "
        f"claims a row without blocking other workers scanning the same table. "
        f"Workers that find no unlocked rows move on immediately, and the "
        f"database handles all coordination.\n\n"
        f"The design builds on that durable foundation: retry logic with "
        f"exponential backoff for transient failures, a visibility timeout to "
        f"reclaim jobs from crashed workers, a dead-letter queue for "
        f"permanently failed jobs, and idempotent handlers that make duplicate "
        f"execution harmless."
    )

    sql_schema = textwrap.dedent("""\
        CREATE TABLE jobs (
            id           BIGSERIAL PRIMARY KEY,
            job_type     TEXT NOT NULL,
            payload      JSONB NOT NULL,
            status       TEXT DEFAULT 'pending',
            attempts     INT DEFAULT 0,
            max_attempts INT DEFAULT 3,
            run_at       TIMESTAMPTZ DEFAULT NOW(),
            locked_at    TIMESTAMPTZ,
            locked_by    TEXT,
            last_error   TEXT,
            created_at   TIMESTAMPTZ DEFAULT NOW()
        );

        -- Worker claim: safe for concurrent pollers
        UPDATE jobs
        SET status = 'running', locked_at = NOW(),
            locked_by = :workerId, attempts = attempts + 1
        WHERE id = (
            SELECT id FROM jobs
            WHERE status = 'pending' AND run_at <= NOW()
              AND attempts < max_attempts
            ORDER BY run_at, id
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        ) RETURNING *;""")

    step1 = (
        f"The job table stores the full lifecycle of each job: status tracking "
        f"from `pending` through `running` to `completed` or `failed`, an "
        f"attempt counter for retry limiting, a scheduled execution time for "
        f"delayed jobs, and error history for debugging. Workers poll this "
        f"table with a query that atomically transitions a single job from "
        f"`pending` to `running` while skipping rows locked by other workers.\n\n"
        f"**`FOR UPDATE` acquires a row-level lock** on the selected row, "
        f"preventing any other transaction from modifying it. `SKIP LOCKED` "
        f"tells PostgreSQL to silently skip rows that are already locked "
        f"instead of blocking. Together, ten concurrent workers can poll the "
        f"same table simultaneously — each grabs a different unlocked row "
        f"without contention and without double-processing.\n\n"
        f"The `run_at` column enables delayed job execution — workers filter "
        f"with `run_at <= NOW()` so future-scheduled jobs stay invisible until "
        f"their time arrives. The `locked_by` field records which worker "
        f"instance holds the job, which becomes essential when the visibility "
        f"timeout sweeper needs to identify abandoned work.\n\n"
        f"{CB}sql\n{sql_schema}\n{CB}\n\n"
        f"The `ORDER BY run_at, id` ensures FIFO within the same time bucket. "
        f"`RETURNING *` hands the worker the full job row in a single round "
        f"trip, eliminating a separate SELECT after the claim."
    )

    step2 = (
        f"A worker claims a job, starts processing, then crashes — JVM "
        f"out-of-memory, network partition, container eviction by the "
        f"orchestrator. The job row sits in `running` status with no live "
        f"worker to complete it. Without a recovery mechanism, that job is "
        f"permanently lost despite being durably stored.\n\n"
        f"**Visibility timeout** solves this by treating any job stuck in "
        f"`running` beyond a configurable threshold as abandoned. A scheduled "
        f"sweeper checks the jobs table every minute and resets rows where "
        f"`locked_at` exceeds the timeout window. Reclaimed jobs return to "
        f"`pending` status and become available to other workers on the next "
        f"poll cycle.\n\n"
        f"The timeout value requires careful tuning. Setting it too short "
        f"causes **duplicate execution** — a slow worker finishes processing "
        f"a job that the sweeper already reclaimed and another worker is now "
        f"running. Setting it too long delays recovery after real crashes. A "
        f"sensible default is 30 minutes for standard workloads, with "
        f"per-job-type overrides for operations that legitimately run longer.\n\n"
        f"**Exponential backoff** handles the retry cadence for transient "
        f"failures. Instead of retrying immediately and hammering a struggling "
        f"dependency, the next attempt schedules at "
        f"`NOW() + base \u00d7 2^attempts` — typically 1 minute, then 2, then "
        f"4, then 8. This gives downstream services breathing room to recover. "
        f"After `max_attempts` failures, the job moves to a **dead-letter "
        f"queue** with the full error chain preserved for human investigation. "
        f"Alerting on DLQ growth rate is non-negotiable — a spike signals a "
        f"systemic downstream problem, not random individual failures."
    )

    step3 = (
        f"The visibility timeout mechanism deliberately trades exactness for "
        f"availability — it guarantees every job runs **at least once** but "
        f"explicitly permits duplicate execution. The problematic scenario: a "
        f"worker completes the side effect (sends the email, charges the card), "
        f"then crashes before marking the job as `completed`. The sweeper "
        f"reclaims the job, another worker picks it up, and the customer "
        f"receives two emails or two charges.\n\n"
        f"**Idempotent handlers** are the only correct mitigation. Each job "
        f"carries a business-level idempotency key — an order ID, a payment "
        f"intent ID, a notification fingerprint. Before performing the side "
        f"effect, the handler queries a receipts table for that key. If a "
        f"receipt already exists, the handler returns success immediately "
        f"without repeating the action.\n\n"
        f"The receipt insert and the business mutation must execute within the "
        f"**same database transaction**. If the receipt writes first and the "
        f"application crashes before the mutation, the job appears completed "
        f"but the work never happened. If the mutation commits first and the "
        f"crash precedes the receipt write, the retry duplicates the work. "
        f"Wrapping both operations inside a single `@Transactional` boundary "
        f"guarantees atomicity.\n\n"
        f"For third-party APIs that lack native idempotency key support, store "
        f"the external response identifier and check it before retrying. The "
        f"practical goal is **effectively-once** semantics — the system may "
        f"attempt a job multiple times, but the user-visible side effect "
        f"occurs exactly once."
    )

    key_points = (
        f"- **SKIP LOCKED row claiming** — multiple workers poll safely "
        f"without blocking each other; the database handles concurrency "
        f"instead of application-level distributed locks\n"
        f"- **Visibility timeout at 30 min default** — sweeper reclaims stuck "
        f"`running` rows after worker death; setting it shorter than max "
        f"execution time causes duplicate processing\n"
        f"- **Exponential backoff at 2^attempt minutes** — retry intervals of "
        f"1, 2, 4, 8 minutes protect downstream services from retry storms "
        f"during transient outages\n"
        f"- **Receipts table in same transaction** — handler checks business "
        f"idempotency key before side effects; atomicity of receipt + mutation "
        f"prevents both duplication and phantom completion\n"
        f"- **DLQ after max_attempts** — permanently failed jobs parked for "
        f"human investigation; alert on growth rate as leading indicator of "
        f"systemic downstream failures"
    )

    speakable = (
        f"I start with **durability**: anything in `ArrayBlockingQueue` dies "
        f"on restart, so production queues need a persistent backing store — "
        f"PostgreSQL for most teams, SQS or Redis at high scale. Workers "
        f"claim jobs with `SELECT \u2026 FOR UPDATE SKIP LOCKED`, which lets "
        f"each worker atomically grab an unlocked row while others skip past "
        f"it. Multiple pollers run against the same table without "
        f"double-processing.\n\n"
        f"Delayed work uses a `run_at` column that the claim query filters "
        f"by. Retries schedule the next attempt with **exponential backoff** "
        f"— doubling the wait each time — so a flaky downstream API gets "
        f"breathing room instead of continuous hammering. A periodic sweeper "
        f"checks for jobs stuck in `running` past a **visibility timeout** "
        f"and resets them to `pending`, which gives at-least-once delivery "
        f"semantics even when workers crash mid-execution.\n\n"
        f"The critical follow-up detail is **idempotency**. Because the "
        f"system guarantees at-least-once and not exactly-once, every handler "
        f"must tolerate re-execution safely. I store a processed-job receipt "
        f"keyed by a business ID in the same transaction as the domain "
        f"mutation, so a duplicate run sees the existing receipt and becomes a "
        f"no-op. This is the detail interviewers always probe after the "
        f"happy-path description.\n\n"
        f"Poison messages — jobs that fail repeatedly — route to a "
        f"**dead-letter queue** after `max_attempts`. Operations teams need "
        f"dashboards on DLQ depth and queue age, plus alerting when saturation "
        f"rises. For scale beyond what PostgreSQL can handle I would graduate "
        f"to Redis streams or SQS, but the architecture stays the same: "
        f"persistent storage, safe concurrent claiming, exponential backoff, "
        f"and idempotent handlers. In practice, this design handles millions "
        f"of jobs per day before you need specialized infrastructure."
    )

    return [
        {"type": "overview",
         "title": "Why In-Memory Queues Silently Lose Your Work",
         "content": overview},
        {"type": "step",
         "title": "SKIP LOCKED — How Multiple Workers Claim Jobs "
                  "Without Collisions",
         "content": step1},
        {"type": "step",
         "title": "Visibility Timeout and Exponential Backoff — "
                  "Recovering From the Inevitable Crash",
         "content": step2},
        {"type": "step",
         "title": "Idempotency — Why At-Least-Once Delivery Demands "
                  "Duplicate-Safe Handlers",
         "content": step3},
        {"type": "key_points",
         "title": "Key Points",
         "content": key_points},
        {"type": "speakable_answer",
         "title": "How to Answer This Verbally",
         "content": speakable},
    ]


# ---------------------------------------------------------------------------
# Q1 — design-read-write-separation-cqrs (moderate-concept, complexity 3,
#       650-900w)
# ---------------------------------------------------------------------------

def build_q1_sections() -> list[dict]:

    overview = (
        f"Most Java applications start with a single database serving both "
        f"reads and writes through the same connection pool. This works until "
        f"read traffic dominates — dashboards, search results, reporting views, "
        f"autocomplete queries — and the primary database spends 90% of its "
        f"CPU on SELECT statements that could run on any copy of the data.\n\n"
        f"**Read replicas** are the first response: route read-only queries to "
        f"replica instances while writes stay on the primary. Spring Boot makes "
        f"this straightforward with `AbstractRoutingDataSource` keyed to "
        f"`@Transactional(readOnly = true)`. But replicas introduce a "
        f"consistency problem most teams discover only in production: "
        f"**replication lag**. A user creates an order, the page redirects to "
        f"the order list, the query hits a replica that hasn't received the "
        f"write yet, and the order is missing. The user panics and clicks "
        f"create again.\n\n"
        f"**CQRS** goes further by separating not just the database connection "
        f"but the entire data model. The command side keeps normalized tables "
        f"with integrity constraints for business invariants. The query side "
        f"maintains denormalized projections — pre-joined, pre-aggregated "
        f"views optimized for specific screens. This trades operational "
        f"complexity for predictable query latency, and pays off only when "
        f"read and write patterns genuinely diverge. Knowing which level of "
        f"separation your system actually needs is the core interviewer test."
    )

    routing_code = textwrap.dedent("""\
        @Service
        public class OrderService {

            @Transactional(readOnly = false)  // routes to primary
            public Order createOrder(CreateOrderRequest req) {
                return orderRepository.save(map(req));
            }

            @Transactional(readOnly = true)  // routes to replica
            public Page<OrderSummary> listOrders(Long userId,
                                                  Pageable page) {
                return orderViewRepository.findByUserId(userId, page);
            }
        }""")

    step1 = (
        f"PostgreSQL streaming replication is asynchronous by default. During "
        f"normal operation the replica trails the primary by milliseconds, but "
        f"bulk imports, schema migrations, and vacuum operations can stretch "
        f"that gap to seconds. In testing this lag is invisible; in production "
        f"it creates confusing bugs — missing records, stale counts, phantom "
        f"states.\n\n"
        f"Three patterns address **read-your-writes consistency**. **Sticky "
        f"sessions** route a user to the primary for 5-10 seconds after any "
        f"write, set via a servlet filter or Spring interceptor. **Version "
        f"tokens** work differently: the write response includes a sequence "
        f"number, and subsequent read requests include it so the routing layer "
        f"can verify the replica has caught up before forwarding. The third "
        f"approach is simplest: query-level routing via "
        f"`@Transactional(readOnly = true)`.\n\n"
        f"Spring Boot wiring defines two `DataSource` beans plus an "
        f"`AbstractRoutingDataSource` that inspects whether the current "
        f"transaction is read-only. The routing datasource selects the "
        f"appropriate connection pool based on the transaction flag, and "
        f"services annotate their read methods transparently.\n\n"
        f"{CB}java\n{routing_code}\n{CB}\n\n"
        f"Connection pools require independent sizing — write pools stay "
        f"small because writes contend on row locks, while read pools can be "
        f"larger to absorb reporting traffic. **Health checks should monitor "
        f"replica lag** as a Micrometer gauge and automatically remove "
        f"unhealthy replicas when lag exceeds the SLA threshold — that "
        f"operational detail signals production experience beyond "
        f"configuration."
    )

    step2 = (
        f"CQRS separates the write model from the read model entirely. "
        f"Commands modify a normalized domain model that enforces invariants — "
        f"uniqueness constraints, balance checks, status transitions. Queries "
        f"read from denormalized **projections** populated by domain events: "
        f"an `order_list_view` table with pre-joined user names, "
        f"pre-aggregated item counts, and computed totals designed for a "
        f"specific UI screen.\n\n"
        f"The projection is populated asynchronously. When an "
        f"`OrderCreatedEvent` fires, a listener inserts a fully denormalized "
        f"row into the view table. Reads against that table need no joins, "
        f"have no N+1 problems, and deliver predictable sub-millisecond "
        f"latency. Spring's `@EventListener` or a Kafka consumer can serve as "
        f"the projector depending on whether you need replay and durability "
        f"guarantees.\n\n"
        f"The cost surfaces quickly in real projects. You maintain **two "
        f"schemas** with separate migrations, an asynchronous sync layer that "
        f"can lag or fail silently, and event contracts that must evolve "
        f"without breaking consumers. Schema evolution is especially painful "
        f"because published events cannot be rewritten — every change needs a "
        f"new version and an upcaster that transforms old formats during "
        f"replay.\n\n"
        f"**Start with read replicas** and promote to CQRS only when a "
        f"specific bounded context has read and write patterns that genuinely "
        f"diverge — large catalogs with faceted search, financial ledgers "
        f"feeding multiple dashboards, multi-tenant SaaS where tenants need "
        f"custom materialized views. The common mistake is adopting CQRS as a "
        f"blanket architecture when a covering index and a read replica would "
        f"have solved the performance problem at a fraction of the "
        f"operational cost."
    )

    key_points = (
        f"- **Async replication lag of 1\u2013200 ms typical** — read replicas "
        f"trail the primary; a customer who just created an order may not see "
        f"it on the list page if the query hits a stale replica\n"
        f"- **`@Transactional(readOnly=true)` routing** — triggers "
        f"`AbstractRoutingDataSource` to select replicas transparently; "
        f"business code stays unaware of the split\n"
        f"- **Sticky sessions for 5\u201310 seconds post-write** — route the "
        f"user to primary after mutations; the simplest read-your-writes "
        f"consistency fix before version tokens or causal reads\n"
        f"- **CQRS command/query model split** — normalized write model "
        f"enforces invariants; denormalized query projections eliminate joins "
        f"but require separate schema migrations and event versioning\n"
        f"- **Start with replicas, not CQRS** — a covering index plus read "
        f"replicas solves most read-heavy workloads; CQRS adds value only "
        f"when read and write models genuinely diverge"
    )

    speakable = (
        f"When reads outnumber writes 10:1, the first move is **read "
        f"replicas** — route `@Transactional(readOnly=true)` queries to "
        f"replicas via `AbstractRoutingDataSource` while writes stay on the "
        f"primary. That frees the primary for mutations and scales "
        f"horizontally for years.\n\n"
        f"The catch is **replication lag**. After a user creates an order, a "
        f"read from a stale replica shows the order missing. The standard "
        f"fixes are sticky sessions — routing to the primary for a few "
        f"seconds after writes — or version tokens that let the routing "
        f"layer verify the replica has caught up.\n\n"
        f"**CQRS** is the bigger leap: maintain a normalized command model "
        f"for invariants and project denormalized **read models** fed by "
        f"domain events. An `order_list_view` table with pre-joined data "
        f"eliminates runtime joins and delivers predictable latency. The "
        f"cost is real — two schemas, async projectors that can lag, and "
        f"event contracts that must evolve without rewriting history.\n\n"
        f"I only reach for CQRS where teams can own eventual consistency, "
        f"monitor projector lag, and manage schema evolution for events. "
        f"For everything else, a covering index plus a read replica solves "
        f"the business problem with far less machinery. In practice, most "
        f"teams get years of headroom from replicas alone before CQRS "
        f"becomes a justified trade-off."
    )

    return [
        {"type": "overview",
         "title": "The Problem That Hits When a Single Database "
                  "Serves 100 Reads Per Write",
         "content": overview},
        {"type": "step",
         "title": "Replication Lag — The Consistency Risk Hiding "
                  "Behind Every Read Replica",
         "content": step1},
        {"type": "step",
         "title": "When CQRS Pays Off — and When a Read Replica Was "
                  "the Actual Answer",
         "content": step2},
        {"type": "key_points",
         "title": "Key Points",
         "content": key_points},
        {"type": "speakable_answer",
         "title": "How to Answer This Verbally",
         "content": speakable},
    ]


# ---------------------------------------------------------------------------
# Q2 — design-event-sourcing-audit-log (moderate-concept, complexity 3,
#       650-900w)
# ---------------------------------------------------------------------------

def build_q2_sections() -> list[dict]:

    overview = (
        f"The most common audit log failure is treating it as a column "
        f"problem. A developer adds `updated_by` and `updated_at` to the "
        f"orders table, the team considers auditing done, and six months "
        f"later a compliance investigation asks \u201cwhat was this order's "
        f"shipping address at 3 PM last Thursday?\u201d There is no answer — "
        f"the UPDATE overwrote the previous state, and the only record is "
        f"the current one.\n\n"
        f"**Append-only audit tables** fix this by recording every mutation "
        f"as a new immutable row in a separate table. Each row captures who "
        f"changed what, when, and preserves both the before and after state "
        f"as JSONB snapshots. The entity table stays unchanged; the audit "
        f"table grows alongside it as a parallel history. This approach is "
        f"cheap, straightforward, and satisfies most compliance requirements "
        f"— SOC 2, PCI, HIPAA — without restructuring the application.\n\n"
        f"**Event Sourcing** takes the concept to its logical conclusion: the "
        f"append-only event log becomes the sole source of truth, and the "
        f"entity's current state is derived by replaying all its events in "
        f"order. This enables **temporal queries** — reconstructing the exact "
        f"state of any entity at any historical point. But it brings "
        f"significant operational cost: snapshot management for long-lived "
        f"aggregates, schema evolution challenges on immutable events, and "
        f"CQRS projections for queries that don't fit single-aggregate "
        f"replay.\n\n"
        f"Most applications need audit logging. Fewer need Event Sourcing. "
        f"Knowing where the line falls is the real interview question."
    )

    audit_sql = textwrap.dedent("""\
        CREATE TABLE audit_events (
            id             BIGSERIAL PRIMARY KEY,
            entity_type    TEXT NOT NULL,
            entity_id      BIGINT NOT NULL,
            action         TEXT NOT NULL,       -- created/updated/deleted
            actor_id       BIGINT NOT NULL,
            before_state   JSONB,
            after_state    JSONB,
            changed_fields TEXT[],              -- which fields changed
            created_at     TIMESTAMPTZ DEFAULT NOW()
        ) PARTITION BY RANGE (created_at);

        -- Investigation indexes
        CREATE INDEX idx_audit_entity
            ON audit_events (entity_type, entity_id, created_at);
        CREATE INDEX idx_audit_actor
            ON audit_events (actor_id, created_at);""")

    step1 = (
        f"The audit events table captures actor, action, entity reference, "
        f"state snapshots, and timestamp. It lives in the same database as "
        f"the domain tables for transactional consistency, never receives "
        f"UPDATE or DELETE operations, and is partitioned by time for "
        f"retention management.\n\n"
        f"Capture should be centralized through an AOP aspect or a Hibernate "
        f"event listener. An `@Auditable` annotation on service methods "
        f"triggers automatic recording of the before state, the after state, "
        f"the authenticated user, and a correlation ID. Teams that skip "
        f"centralization inevitably miss auditing on new endpoints — a gap "
        f"that surfaces during SOC 2 reviews.\n\n"
        f"The schema design determines query performance for investigations. "
        f"Two indexes cover the primary access patterns: entity history and "
        f"actor activity tracking. The `changed_fields` array lets "
        f"investigators filter for specific field modifications without "
        f"parsing JSONB diffs at query time.\n\n"
        f"{CB}sql\n{audit_sql}\n{CB}\n\n"
        f"**Partition by month** and archive cold partitions to object "
        f"storage with immutability locks when regulators require WORM "
        f"semantics. Retention policies differ by domain — financial records "
        f"may require seven years, application telemetry 90 days. Automate "
        f"legal holds so partition drops respect ongoing litigation freezes."
    )

    step2 = (
        f"Event Sourcing promotes the audit log to the system of truth. "
        f"Instead of storing current state and logging changes separately, "
        f"the application stores only events — `AccountOpened`, "
        f"`MoneyDeposited`, `MoneyWithdrawn`. Current state is computed by "
        f"replaying all events for an aggregate from the beginning.\n\n"
        f"The decisive advantage is **temporal queries**. \u201cWhat was this "
        f"account's balance at 3 PM last Tuesday?\u201d Replay events up to "
        f"that timestamp and you have an exact, provably correct answer. No "
        f"UPDATE-based schema can provide this without maintaining a complete "
        f"change log — which is Event Sourcing by another name.\n\n"
        f"The performance objection is the most common concern. An account "
        f"with 10,000 transactions requires replaying all 10,000 events to "
        f"compute the current balance. **Snapshots** solve this — "
        f"periodically serialize the aggregate state at a known event "
        f"version. Loading the account becomes: fetch the latest snapshot, "
        f"then replay only events published after that version. Snapshot "
        f"frequency is a tuning knob between storage cost and load latency.\n\n"
        f"**Schema evolution** is the operational challenge that breaks naive "
        f"implementations. Once an event is published, it cannot be rewritten "
        f"— consumers may have already processed it and built state from it. "
        f"Version your event schemas from day one and write **upcasters** "
        f"that transform old event formats to new ones during replay. "
        f"Skipping this discipline creates a ticking time bomb that "
        f"eventually requires rebuilding the entire event store.\n\n"
        f"Event Sourcing is justified when history is the product: financial "
        f"ledgers, trading systems, healthcare records, legal document "
        f"workflows. For standard CRUD applications, an append-only audit "
        f"table delivers 80% of the value at 20% of the operational cost — "
        f"and that pragmatic assessment is what interviewers want to hear."
    )

    key_points = (
        f"- **Append-only with JSONB before/after diffs** — immutable rows "
        f"capturing state snapshots satisfy SOC 2 and PCI without Event "
        f"Sourcing complexity; never UPDATE or DELETE the audit table\n"
        f"- **AOP-centralized capture via `@Auditable`** — annotation on "
        f"endpoints ensures no team forgets manual logging; coverage gaps "
        f"surface embarrassingly during compliance audits\n"
        f"- **Temporal queries by event replay** — Event Sourcing "
        f"reconstructs exact state at any historical timestamp; impossible "
        f"with UPDATE-based schemas that overwrite previous values\n"
        f"- **Snapshots every N events** — periodic aggregate snapshots let "
        f"loading skip thousands of events; tune frequency as a trade-off "
        f"between storage cost and aggregate load latency\n"
        f"- **Event schema versioning from day one** — published events are "
        f"immutable history; upcasters transform old formats during replay "
        f"because rewriting the log is operationally impossible"
    )

    speakable = (
        f"Most teams need an **append-only audit log** — a separate table "
        f"recording who changed which entity, with before/after JSONB "
        f"snapshots, actor IDs, and correlation IDs. I centralize capture "
        f"with an AOP aspect or `@Auditable` annotation so new endpoints "
        f"automatically get audited instead of relying on developers to "
        f"remember.\n\n"
        f"**Event Sourcing** goes further: the event log becomes the source "
        f"of truth, and current state is derived by replaying events. The "
        f"killer feature is **temporal queries** — \u201cwhat was this "
        f"account's balance last Tuesday?\u201d You replay events up to that "
        f"timestamp and get an exact answer. No `UPDATE`-based schema can "
        f"reconstruct that without maintaining a complete history, which is "
        f"Event Sourcing with extra steps.\n\n"
        f"The trade-off is real. Event Sourcing forces you to handle replay "
        f"performance with **snapshots**, manage schema evolution with "
        f"versioned events and upcasters, and build read models via CQRS "
        f"projections for any query beyond single-aggregate replay. It is "
        f"justified for money-like domains — ledgers, trading, healthcare — "
        f"where provable history is a product requirement.\n\n"
        f"For most CRUD applications I recommend the append-only audit table. "
        f"It satisfies compliance, supports debugging, and costs a fraction "
        f"of the operational overhead. I explain this honestly in interviews: "
        f"auditing is incremental complexity, Event Sourcing is a "
        f"product-level architecture decision. In practice, start with audit "
        f"and graduate to Event Sourcing only when temporal queries become a "
        f"concrete business need."
    )

    return [
        {"type": "overview",
         "title": "The Mistake That Destroys Your Audit Trail "
                  "Before You Need It",
         "content": overview},
        {"type": "step",
         "title": "Append-Only Events — The 80% Solution for "
                  "Compliance and Debugging",
         "content": step1},
        {"type": "step",
         "title": "When Event Sourcing Becomes the Right Answer — "
                  "and the Cost You Accept",
         "content": step2},
        {"type": "key_points",
         "title": "Key Points",
         "content": key_points},
        {"type": "speakable_answer",
         "title": "How to Answer This Verbally",
         "content": speakable},
    ]


# ---------------------------------------------------------------------------
# Q3 — design-thread-safe-lru-cache-java (internals/how-to-recipe,
#       complexity 4, 800-1100w)
# ---------------------------------------------------------------------------

def build_q3_sections() -> list[dict]:

    overview = (
        f"`LinkedHashMap` with `removeEldestEntry` is the textbook LRU cache "
        f"— override one method, set a capacity, and you have working "
        f"eviction. Then you deploy it in a multi-threaded server and things "
        f"break: corrupted linked-list pointers cause infinite loops, entries "
        f"vanish, `ConcurrentModificationException` surfaces during "
        f"iteration.\n\n"
        f"The instinctive fix — "
        f"`Collections.synchronizedMap(new LinkedHashMap<>())` — wraps every "
        f"operation in a single monitor. This preserves correctness but "
        f"**serializes every read**, turning the cache into a throughput "
        f"bottleneck exactly where caches matter most: read-heavy workloads. "
        f"On a 16-core server, 15 threads wait while one thread reads a "
        f"cached value.\n\n"
        f"The correct design separates two concerns: **lookup** and "
        f"**ordering**. A `ConcurrentHashMap` provides O(1) key lookup with "
        f"internal striping that allows concurrent reads without contention. "
        f"A **doubly-linked list** tracks recency order for O(1) eviction. "
        f"The challenge is that even a cache `get` must update the list — "
        f"moving the accessed node to the head — which mutates shared state "
        f"during what should be a read-only operation.\n\n"
        f"Production caches like **Caffeine** solve this with an MPSC ring "
        f"buffer that decouples access recording from list reordering. In an "
        f"interview you build the simpler version — `ConcurrentHashMap` plus "
        f"a write-locked linked list — then describe how Caffeine improves "
        f"on it."
    )

    node_code = textwrap.dedent("""\
        public class LRUCache<K, V> {
            private final int capacity;
            private final ConcurrentHashMap<K, Node<K, V>> map;
            private final ReentrantReadWriteLock lock =
                new ReentrantReadWriteLock();
            private final Node<K, V> head = new Node<>(null, null);
            private final Node<K, V> tail = new Node<>(null, null);

            public LRUCache(int capacity) {
                this.capacity = capacity;
                this.map = new ConcurrentHashMap<>(capacity);
                head.next = tail;
                tail.prev = head;
            }

            private static class Node<K, V> {
                final K key;
                volatile V value;
                Node<K, V> prev, next;
                Node(K key, V value) {
                    this.key = key;
                    this.value = value;
                }
            }
        }""")

    step1 = (
        f"The cache interface exposes three operations: `get`, `put`, and "
        f"`size`. Internally, each entry lives in a `Node` carrying "
        f"`prev`/`next` pointers for the linked list plus the key itself. "
        f"Storing the key inside the node is essential — during eviction you "
        f"remove the tail node from the list and need its key to also remove "
        f"the entry from the hash map. Without it you need a reverse-lookup "
        f"map or an O(n) scan.\n\n"
        f"**Sentinel nodes** for head and tail eliminate null-check branches "
        f"in every list operation. The most-recently-used entry sits at "
        f"`head.next`; the eviction candidate sits at `tail.prev`. Insert, "
        f"remove, and move-to-head all follow the same pointer-swap pattern "
        f"— no special cases for empty lists or boundary nodes.\n\n"
        f"The `ConcurrentHashMap` maps keys to nodes for O(1) lookup. A "
        f"`ReentrantReadWriteLock` protects the doubly-linked list from "
        f"concurrent mutation. Node values are marked `volatile` for safe "
        f"cross-thread publication without requiring the caller to hold a "
        f"lock for reads.\n\n"
        f"{CB}java\n{node_code}\n{CB}\n\n"
        f"The constructor wires `head.next \u2192 tail` and "
        f"`tail.prev \u2192 head`, creating an empty list. Every subsequent "
        f"operation inserts between these sentinels, so removal never needs "
        f"to check for null neighbors."
    )

    getput_code = textwrap.dedent("""\
        public V get(K key) {
            Node<K, V> node = map.get(key);  // lock-free lookup
            if (node == null) return null;
            lock.writeLock().lock();
            try { moveToHead(node); }
            finally { lock.writeLock().unlock(); }
            return node.value;
        }

        public void put(K key, V value) {
            Node<K, V> existing = map.get(key);
            if (existing != null) {
                existing.value = value;
                lock.writeLock().lock();
                try { moveToHead(existing); }
                finally { lock.writeLock().unlock(); }
                return;
            }
            Node<K, V> node = new Node<>(key, value);
            lock.writeLock().lock();
            try {
                addAfterHead(node);
                map.put(key, node);
                if (map.size() > capacity) {
                    Node<K, V> lru = tail.prev;
                    removeNode(lru);
                    map.remove(lru.key);  // key stored in node
                }
            } finally { lock.writeLock().unlock(); }
        }

        private void moveToHead(Node<K, V> n) {
            removeNode(n);
            addAfterHead(n);
        }
        private void removeNode(Node<K, V> n) {
            n.prev.next = n.next;
            n.next.prev = n.prev;
        }
        private void addAfterHead(Node<K, V> n) {
            n.prev = head;
            n.next = head.next;
            head.next.prev = n;
            head.next = n;
        }""")

    step2 = (
        f"The cache `get` starts with a lock-free lookup in "
        f"`ConcurrentHashMap`. If the key exists, the node must move to the "
        f"head of the linked list to mark it as most-recently-used. This "
        f"list mutation requires the write lock — the fundamental tension in "
        f"the design. Even a read operation must acquire exclusive access to "
        f"the eviction chain.\n\n"
        f"The `put` operation checks for an existing entry first — if found, "
        f"it updates the value in place and moves the node to head. For new "
        f"entries, it creates a node, inserts after the head sentinel, adds "
        f"to the map, and checks capacity. When the cache exceeds capacity, "
        f"eviction removes `tail.prev` from both the list and the map. All "
        f"linked-list helpers assume the caller holds the write lock, keeping "
        f"the locking contract explicit and centralized in the public "
        f"methods.\n\n"
        f"{CB}java\n{getput_code}\n{CB}\n\n"
        f"Both `get` and `put` are O(1) — hash map lookup and linked-list "
        f"pointer swaps are constant-time operations. Space overhead is "
        f"O(capacity) with one node and one map entry per cached value."
    )

    step3 = (
        f"The implementation above works correctly but has a fundamental "
        f"throughput problem: every `get` acquires the write lock to call "
        f"`moveToHead`. On a 16-core server running a read-heavy workload — "
        f"the exact scenario where caches are most valuable — threads "
        f"serialize behind that lock. A cache that makes reads as expensive "
        f"as writes defeats its own purpose.\n\n"
        f"**Caffeine** eliminates this bottleneck with a write-behind "
        f"strategy. Reads are entirely lock-free. Instead of immediately "
        f"moving the node, Caffeine records the access event in a "
        f"**multi-producer single-consumer (MPSC) ring buffer**. A single "
        f"maintenance thread periodically drains the buffer and replays the "
        f"access events to reorder the eviction list.\n\n"
        f"The trade-off is that eviction ordering is slightly stale — a "
        f"recently accessed entry might sit closer to the tail than it "
        f"should for a few milliseconds. Since LRU is already a heuristic, "
        f"this staleness is acceptable.\n\n"
        f"**Striped locking** is a middle-ground approach used by Guava "
        f"Cache. The key space is partitioned into N segments, each with its "
        f"own linked list and lock. Contention drops roughly linearly with "
        f"segment count, but cross-segment eviction decisions become "
        f"approximate. Guava defaults to 4 segments.\n\n"
        f"In an interview, present the clean read-write-lock version first, "
        f"then describe Caffeine's buffer approach and explain why the read "
        f"lock is the bottleneck. That progression — correctness first, then "
        f"optimization — demonstrates exactly the engineering maturity "
        f"interviewers look for."
    )

    key_points = (
        f"- **ConcurrentHashMap + doubly-linked list** — the canonical O(1) "
        f"get/put/evict structure; the map indexes nodes, the list tracks "
        f"recency, both must stay in sync under a single lock\n"
        f"- **Sentinel head/tail nodes** — eliminate all null-check branches "
        f"in insert, remove, and move-to-head; every list operation follows "
        f"the same pointer-swap pattern\n"
        f"- **Every get() takes the write lock** — `moveToHead` mutates the "
        f"list even on reads, serializing all operations; this is the "
        f"bottleneck production caches like Caffeine solve\n"
        f"- **Node stores the key, not just the value** — without the key in "
        f"the evicted tail node, removing the map entry requires a reverse "
        f"lookup or O(n) scan\n"
        f"- **Caffeine's MPSC ring buffer** — decouples access recording "
        f"from list reordering; reads become lock-free and eviction order is "
        f"only slightly stale, acceptable for an LRU heuristic"
    )

    speakable = (
        f"An LRU cache needs two cooperating structures: a **hash map** for "
        f"O(1) lookup and a **doubly-linked list** for O(1) eviction "
        f"ordering. The list head is the most-recently-used entry, the tail "
        f"is the eviction candidate. Every `get` moves the accessed node to "
        f"head; every `put` inserts at head and evicts from tail when "
        f"capacity is exceeded.\n\n"
        f"The concurrency challenge is that reads mutate the list through "
        f"`moveToHead`. The naive approach — "
        f"`Collections.synchronizedMap(new LinkedHashMap<>())` — serializes "
        f"every operation including reads, which destroys throughput on "
        f"read-heavy workloads. My implementation uses "
        f"**ConcurrentHashMap** for the index paired with a "
        f"**ReentrantReadWriteLock** around the linked list. Map lookups "
        f"are lock-free; only the list reorder takes the write lock.\n\n"
        f"This is still not ideal at high concurrency because every `get` "
        f"grabs the write lock. Production libraries like **Caffeine** solve "
        f"this by buffering access events in a lock-free MPSC ring buffer "
        f"and draining them with a single background thread. Reads never "
        f"touch the list lock at all. The eviction order is slightly stale, "
        f"but since LRU is already a heuristic, that staleness is harmless.\n\n"
        f"One detail people miss: the **Node must store the key**, not just "
        f"the value. When you evict from the tail you need the key to remove "
        f"the corresponding entry from the hash map. Without it you need a "
        f"reverse lookup or a linear scan. In practice, I always reach for "
        f"Caffeine directly — building a custom cache is an interview "
        f"exercise, not a production recommendation."
    )

    return [
        {"type": "overview",
         "title": "Why LinkedHashMap Falls Apart Under Concurrency "
                  "\u2014 and What Replaces It",
         "content": overview},
        {"type": "step",
         "title": "Sentinel Nodes and the Data Structure Contract",
         "content": step1},
        {"type": "step",
         "title": "Get and Put — Why Every Read Requires a Write Lock",
         "content": step2},
        {"type": "step",
         "title": "Beyond the Interview Version — How Caffeine Avoids "
                  "the Read Lock Bottleneck",
         "content": step3},
        {"type": "key_points",
         "title": "Key Points",
         "content": key_points},
        {"type": "speakable_answer",
         "title": "How to Answer This Verbally",
         "content": speakable},
    ]


# ---------------------------------------------------------------------------
# Q4 — design-task-scheduler-job-queue-java (how-to-recipe/internals,
#       complexity 4, 800-1100w)
# ---------------------------------------------------------------------------

def build_q4_sections() -> list[dict]:

    overview = (
        f"The most common broken scheduler is a while-loop with "
        f"`Thread.sleep()` that checks a list of tasks on every iteration. "
        f"It works in a demo. Under load, the sleep interval either wastes "
        f"CPU by waking too frequently or misses deadlines by waking too "
        f"late. Clock drift compounds — after hours of running, scheduled "
        f"times slip by seconds. The busy thread burns a core doing nothing "
        f"useful between checks.\n\n"
        f"The correct approach uses a **blocking priority queue** — "
        f"specifically Java's `DelayQueue` — where the dispatcher thread "
        f"sleeps until the next task is mathematically ready, waking at "
        f"exactly the right moment with zero polling overhead. The queue is "
        f"backed by a binary heap ordered by execution time, so the "
        f"next-to-fire task is always at the root.\n\n"
        f"A scheduler must solve three distinct sub-problems: **when** to "
        f"run a task (delay and period), **which** task to run next (priority "
        f"ordering within the same time window), and **how many** tasks to "
        f"run concurrently (thread pool sizing and saturation control). The "
        f"JDK's `ScheduledThreadPoolExecutor` solves all three with a "
        f"**leader-follower** pattern that reduces unnecessary context "
        f"switches. Building a simpler version from scratch exposes these "
        f"design decisions and prepares you to discuss the JDK internals "
        f"when the interviewer probes deeper."
    )

    task_code = textwrap.dedent("""\
        public class ScheduledTask implements Delayed,
                                               Comparable<ScheduledTask> {
            private final String taskId;
            private final Runnable command;
            private final int priority;          // lower = higher urgency
            private long nextExecutionNanos;
            private final long periodNanos;       // 0 = one-shot
            private volatile boolean cancelled;

            public ScheduledTask(String id, Runnable cmd,
                                 int priority, long delayMs,
                                 long periodMs) {
                this.taskId = id;
                this.command = cmd;
                this.priority = priority;
                this.nextExecutionNanos = System.nanoTime()
                    + TimeUnit.MILLISECONDS.toNanos(delayMs);
                this.periodNanos =
                    TimeUnit.MILLISECONDS.toNanos(periodMs);
            }

            @Override
            public long getDelay(TimeUnit unit) {
                return unit.convert(
                    nextExecutionNanos - System.nanoTime(),
                    TimeUnit.NANOSECONDS);
            }

            @Override
            public int compareTo(ScheduledTask other) {
                int cmp = Long.compare(this.nextExecutionNanos,
                                        other.nextExecutionNanos);
                return cmp != 0 ? cmp
                    : Integer.compare(this.priority, other.priority);
            }

            boolean isPeriodic() { return periodNanos > 0; }
            void advanceExecution() { nextExecutionNanos += periodNanos; }
            void cancel() { cancelled = true; }
            boolean isCancelled() { return cancelled; }
            Runnable getCommand() { return command; }
        }""")

    step1 = (
        f"The `ScheduledTask` wraps a `Runnable` with scheduling metadata. "
        f"It implements `Delayed` for `DelayQueue` compatibility and "
        f"`Comparable` for priority ordering. The execution time uses "
        f"`System.nanoTime()` rather than `System.currentTimeMillis()` to "
        f"avoid clock skew from NTP adjustments — wall-clock corrections can "
        f"make scheduled times jump forward or backward.\n\n"
        f"The `compareTo` method defines the heap ordering: primary sort by "
        f"execution time, secondary sort by priority within the same time "
        f"window. A task due in 5 seconds always fires before one due in 10, "
        f"regardless of priority. But when two tasks are due at the same "
        f"instant, the lower priority value (higher urgency) wins.\n\n"
        f"Periodic tasks call `advanceExecution()` after each run, adding "
        f"the period to the scheduled time. This implements **fixed-rate** "
        f"scheduling — the next execution is relative to the planned time, "
        f"not the actual completion time. For **fixed-delay** scheduling you "
        f"would set `nextExecutionNanos = System.nanoTime() + periodNanos` "
        f"after each run completes, guaranteeing a minimum gap between "
        f"executions.\n\n"
        f"{CB}java\n{task_code}\n{CB}\n\n"
        f"The `cancelled` flag is `volatile` so the dispatcher thread sees "
        f"cancellation immediately without explicit synchronization. Using "
        f"`nanoTime` also avoids the granularity limitations of "
        f"`currentTimeMillis`, which on some platforms only updates every "
        f"10-15 milliseconds."
    )

    dispatcher_code = textwrap.dedent("""\
        public class TaskScheduler {
            private final DelayQueue<ScheduledTask> queue =
                new DelayQueue<>();
            private final ExecutorService workers;
            private volatile boolean running = true;

            public TaskScheduler(int poolSize) {
                this.workers =
                    Executors.newFixedThreadPool(poolSize);
                Thread dispatcher = new Thread(this::loop,
                    "scheduler-dispatcher");
                dispatcher.setDaemon(true);
                dispatcher.start();
            }

            public void schedule(ScheduledTask task) {
                queue.put(task);  // thread-safe, non-blocking
            }

            private void loop() {
                while (running) {
                    try {
                        ScheduledTask task = queue.take(); // blocks
                        if (task.isCancelled()) continue;
                        workers.submit(() -> {
                            try {
                                task.getCommand().run();
                            } catch (Exception e) {
                                System.err.println("Task failed: " + e);
                            } finally {
                                if (!task.isCancelled()
                                        && task.isPeriodic()) {
                                    task.advanceExecution();
                                    queue.put(task); // re-enqueue
                                }
                            }
                        });
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }

            public void shutdown() {
                running = false;
                workers.shutdown();
            }
        }""")

    step2 = (
        f"The dispatcher is a single daemon thread whose sole job is "
        f"draining the `DelayQueue` and submitting ready tasks to a worker "
        f"thread pool. The `take()` call blocks until the head task's delay "
        f"expires, eliminating all polling overhead — the thread consumes "
        f"zero CPU while waiting.\n\n"
        f"When a task fires, the dispatcher submits it to an "
        f"`ExecutorService` for execution. Separating dispatch from execution "
        f"ensures that long-running tasks do not block other tasks from "
        f"firing on time. **Error handling is critical**: every "
        f"`Runnable.run()` call is wrapped in try-catch so a single poisoned "
        f"task cannot crash the dispatcher or prevent other tasks from "
        f"executing.\n\n"
        f"Periodic tasks re-enqueue themselves in the `finally` block after "
        f"each run, calling `advanceExecution()` to compute the next fire "
        f"time. The re-enqueue happens regardless of success or failure — if "
        f"a periodic task should stop after errors, that logic belongs in "
        f"the task itself via a separate failure counter.\n\n"
        f"{CB}java\n{dispatcher_code}\n{CB}\n\n"
        f"The daemon flag ensures the scheduler does not prevent JVM "
        f"shutdown. The `InterruptedException` handler restores the interrupt "
        f"flag and exits the loop cleanly, which is the correct pattern for "
        f"interruptible blocking operations."
    )

    step3 = (
        f"The implementation above uses a single dispatcher thread, which "
        f"works but has a subtle limitation. If the dispatcher is busy "
        f"submitting a task to the thread pool — even briefly — it is not "
        f"blocked on `take()`, and another task that becomes ready during "
        f"that window waits slightly longer than it should. Under high "
        f"task-arrival rates this micro-delay accumulates.\n\n"
        f"The JDK's `ScheduledThreadPoolExecutor` solves this with the "
        f"**leader-follower pattern**. Multiple threads share the queue, but "
        f"only one — the \u201cleader\u201d — calls `take()` on the delay "
        f"queue head. When the leader wakes and submits a task, it "
        f"immediately promotes another idle thread to become the new leader "
        f"before processing the task. This minimizes the window where no "
        f"thread is waiting on the queue, reducing missed-deadline jitter.\n\n"
        f"**Persistence** is the other production gap. The in-memory "
        f"`DelayQueue` loses all pending tasks on JVM restart. For durable "
        f"schedulers, persist accepted tasks to a `scheduled_tasks` table "
        f"with a `run_at` column, and on startup reload all tasks where "
        f"`run_at` is in the past or near future. This is exactly how Quartz "
        f"Scheduler works with its `QRTZ_TRIGGERS` table — the database is "
        f"the durable backing store, and the in-memory queue is a "
        f"performance optimization.\n\n"
        f"Mentioning both the leader-follower pattern and persistence lifts "
        f"the answer from a textbook exercise to a production-aware design "
        f"in the interviewer's assessment."
    )

    key_points = (
        f"- **DelayQueue backed by a binary heap** — `take()` blocks until "
        f"the head task's delay expires with zero polling; eliminates the "
        f"CPU waste and clock drift of `Thread.sleep()` loops\n"
        f"- **Fixed-rate vs fixed-delay scheduling** — fixed-rate adds "
        f"period to the scheduled time, risking overlap if tasks run long; "
        f"fixed-delay adds period to completion time, guaranteeing a minimum "
        f"gap\n"
        f"- **`System.nanoTime()` not `currentTimeMillis()`** — monotonic "
        f"clock immune to NTP adjustments; wall-clock corrections can make "
        f"scheduled times jump forward or backward\n"
        f"- **Error isolation per task** — wrap every `run()` in try-catch "
        f"inside the worker; one poisoned task must never crash the "
        f"dispatcher thread or block periodic re-enqueue\n"
        f"- **Leader-follower in ScheduledThreadPoolExecutor** — only one "
        f"thread waits on the queue head at a time; promoting a new leader "
        f"immediately after wake-up minimizes missed-deadline jitter"
    )

    speakable = (
        f"The core of a task scheduler is a **DelayQueue** backed by a "
        f"binary heap ordered by next-execution time. A single dispatcher "
        f"thread calls `take()`, which blocks until the head task's delay "
        f"expires — no polling, no wasted CPU, no clock drift from "
        f"`Thread.sleep()` intervals. When a task fires, the dispatcher "
        f"submits it to a **fixed thread pool** for execution, separating "
        f"scheduling from processing.\n\n"
        f"Delayed tasks set a future `nextExecutionNanos` using "
        f"`System.nanoTime()` to avoid NTP clock adjustments. Periodic tasks "
        f"call `advanceExecution()` after each run and re-enqueue themselves. "
        f"Priority is a secondary sort key in `compareTo`, so tasks due at "
        f"the same instant run in priority order.\n\n"
        f"Thread safety comes largely for free — `DelayQueue` is internally "
        f"synchronized, the dispatcher is a single thread, and workers touch "
        f"only their own task instance. The `cancelled` flag is `volatile` "
        f"so the dispatcher sees cancellation immediately.\n\n"
        f"The gap between this and the JDK's `ScheduledThreadPoolExecutor` "
        f"is the **leader-follower** pattern. Instead of a single dispatcher, "
        f"multiple threads share the queue but only one waits on the head at "
        f"a time. When the leader wakes, it promotes another thread to "
        f"leader before processing the task, minimizing jitter under high "
        f"task-arrival rates.\n\n"
        f"For persistence I would add a `scheduled_tasks` table — write "
        f"tasks on `schedule()`, delete on completion, replay missed tasks "
        f"on startup. That bridges the gap between an in-memory exercise and "
        f"a production-ready system. In practice, I prefer "
        f"`ScheduledThreadPoolExecutor` for simple scheduling and Quartz for "
        f"anything that must survive restarts."
    )

    return [
        {"type": "overview",
         "title": "Why Thread.sleep() Kills Your Scheduler Before "
                  "Load Does",
         "content": overview},
        {"type": "step",
         "title": "Task Abstraction — Delay, Priority, and the "
                  "Comparable Contract",
         "content": step1},
        {"type": "step",
         "title": "The Dispatcher Loop — Block Until the Next Task "
                  "Is Ready",
         "content": step2},
        {"type": "step",
         "title": "Leader-Follower and the Gap Between Interview "
                  "and Production",
         "content": step3},
        {"type": "key_points",
         "title": "Key Points",
         "content": key_points},
        {"type": "speakable_answer",
         "title": "How to Answer This Verbally",
         "content": speakable},
    ]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    data = json.loads(FILE.read_text(encoding="utf-8"))

    builders = [
        build_q0_sections,
        build_q1_sections,
        build_q2_sections,
        build_q3_sections,
        build_q4_sections,
    ]

    for i, builder in enumerate(builders):
        data["questions"][i]["answer"]["sections"] = builder()

    FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print("=" * 60)
    print("WORD COUNT SUMMARY")
    print("=" * 60)

    for i in range(5):
        q = data["questions"][i]
        sections = q["answer"]["sections"]
        z3 = [s for s in sections
              if s["type"] not in ("key_points", "speakable_answer")]
        z2 = [s for s in sections
              if s["type"] == "speakable_answer"]
        z1 = [s for s in sections
              if s["type"] == "key_points"]

        z3w = sum(count_words(s["content"]) for s in z3)
        z2w = sum(count_words(s["content"]) for s in z2)
        z1b = sum(s["content"].count("- **") for s in z1)

        print(f"Q{i} ({q['slug']}):")
        print(f"  Z3 (deep dive):  {z3w} words")
        print(f"  Z2 (speakable):  {z2w} words")
        print(f"  Z1 (key points): {z1b} bullets")
        print()

    print("=" * 60)
    print("Done. Updated complete-qa.json in place.")


if __name__ == "__main__":
    main()
