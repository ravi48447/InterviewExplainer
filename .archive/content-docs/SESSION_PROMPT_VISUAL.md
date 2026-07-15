# Visual Restructure — Session Prompt (LMS Deep Dive Enhancement)

Paste this at the start of a new conversation. Then say the topic + file path.
Example: `"visual 02-spring-framework/01-spring-core"`

---

## Your Role

You are restructuring existing deep dive sections into a world-class LMS experience. The content may be accurate but visually dead — walls of text, no diagrams, no real-world grounding, no rhythm.

**Do NOT change facts. Do NOT remove content. Restructure, enrich layout, add diagrams, add real scenarios, make it genuinely worth reading.**

Project: `/Users/ravi.r_flx/IEProject/InterviewExplainer`
Files: `content/interview/java/backend/intermediate/<module>/<topic>/complete-qa.json`

When the user gives a topic:
1. Read the full file
2. Identify each question's archetype and tool category
3. Apply the appropriate visual treatment
4. Write back to the file
5. Report: what structural changes you made per question

---

## The Core Problem

Right now questions about Kafka look like this:

> "Kafka is a distributed event streaming platform. It uses topics, partitions, and consumer groups. Producers write to topics. Consumers read from topics. Kafka guarantees ordering within a partition..."

This is a dictionary entry. No one learns Kafka from a dictionary entry.

What it should look like:

> **Scenario:** Your e-commerce checkout service processes 50,000 orders/day. On Black Friday, that spikes to 800,000. Your payment service can't handle that burst — it crashes.
>
> Kafka's job is to absorb that spike: the checkout service writes every order as an event, and the payment service reads at its own pace. The queue acts as a shock absorber.
>
> Here's how that flow works:
> ```
> [Checkout Service]  →  produce("orders", event)
>        │
>        ▼
>   ┌─────────────────────────────────────────┐
>   │  Kafka Broker                           │
>   │  Topic: orders  [partition 0] ████████  │
>   │                 [partition 1] ██████    │
>   │                 [partition 2] █████████ │
>   └─────────────────────────────────────────┘
>        │
>        ▼
> [Payment Service]  ←  consume at own pace (no spike exposure)
> ```

The diagram makes it click in 5 seconds. The scenario makes it relatable in 3.

---

## SECTION 1: THE VISUAL TOOLKIT

### 1.1 Section Types — Color System

| Type | Visual | Purpose |
|---|---|---|
| `overview` | White card | Mental model — "why this exists in the real world" |
| `phase` | 🔵 Blue left border | One stage in a traced mechanism |
| `step` | 🔵 Blue left border | One action in a how-to |
| `component` | 🟣 Indigo left border | One structural layer or role |
| `when_to_use` | 🟢 Green card | Decision guide |
| `problem_statement` | 🔴 Red card | Bug, failure, anti-pattern |
| `diagnosis` | 🟡 Amber card | How to detect the problem |
| `code_example` | ⚫ **Collapsed by default** | Full supplementary program only |
| `comparison_table` | White with table | Required for any X vs Y |

**IMPORTANT: code_example is COLLAPSED — readers must click to open.** Never put essential explanation inside it. Essential code goes in `phase`/`step` as inline fenced blocks.

### BANNED: Emoji signs in content — unprofessional, look AI-generated

Never use ✅ ❌ ⚠️ emoji signs inside section content. Use plain text instead:
- Table cells: write `Yes` / `No` / `Allowed` / `Not allowed` — not `✅` / `❌`
- Warnings: write `**Important:**` or `**Production note:**` — not `⚠️`
- Lists: write the sentence — not `✅ 90% of use cases`

---

### 1.2 Typography Hierarchy

```markdown
## Main Concept Break        ← New sub-topic inside a section (every 150+ words)
### Deeper Detail             ← Variant, edge case, deeper explanation
#### Production Note / Gotcha ← Very specific warning or insight
```

**Header titles = insights, not labels:**
- Bad: `## Kafka Partitions` → Good: `## Why Partitions Are the Unit of Parallelism`
- Bad: `## Step 2` → Good: `## How the Consumer Knows Where It Last Read`
- Bad: `## AWS VPC` → Good: `## Why Your EC2 Instance Needs a Subnet to Exist`

**Bold = the key term, number, or rule (one per paragraph):**
- `**load factor 0.75**` triggers resize at 12 entries for a 16-capacity map
- Kafka guarantees ordering only **within a partition**, not across partitions
- `**min.insync.replicas=2**` is the config that actually makes `acks=all` meaningful

**Inline code = every class, method, command, config key, property:**
- `` `put()` ``, `` `HashMap` ``, `` `@Transactional` ``, `` `spring.datasource.url` ``
- `` `git rebase` ``, `` `docker run` ``, `` `kubectl apply` ``

---

### 1.3 Inline Code Blocks (Always Visible)

Inside `phase`/`step`/`overview` — always visible, always with context.

Structure:
```
One sentence setting up what we're about to see.

\```java
// Short, focused, 5–15 lines max
// Comments only on non-obvious lines
\```

One sentence explaining what changed / what it means / what breaks if you do it wrong.
```

Language tags — always include:
- ` ```java ` — Java code
- ` ```yaml ` — Spring/K8s/Docker configs
- ` ```bash ` — terminal commands
- ` ```sql ` — queries
- ` ```json ` — API payloads, configs
- ` ```text ` or ` ```ascii ` — diagrams

---

### 1.4 The Real-World Scenario Pattern

Every question with a tool (Kafka, Redis, AWS, Git, Docker, Spring, etc.) should open with a 2–4 sentence scenario that grounds the concept in a recognizable situation.

**The scenario formula:**
```
[Context: what system are we building?] + [Problem: what breaks without this?] + [Bridge: this is exactly what X solves]
```

**Examples by tool:**

Kafka:
> Your ride-sharing app dispatches 10,000 driver location updates per second. Your analytics service can only process 2,000/sec. Without buffering, you drop 80% of events or crash the analytics service. Kafka's job is to absorb that gap.

Redis:
> Your product page loads user session data from PostgreSQL on every request — 400ms per query. At 1,000 concurrent users, your DB is on fire. Redis caches the session in memory for <1ms reads. Same data, 400× faster.

Git rebase:
> Your feature branch has 12 messy commits — "fix typo", "forgot file", "actually fix it". Before merging to main, you want one clean commit that reviews like a professional PR. That's what rebase is for.

AWS VPC:
> You're deploying a 3-tier app: React frontend, Spring Boot API, RDS Postgres. You don't want the internet hitting your API directly. You don't want anything hitting your DB except the API. A VPC with public/private subnets enforces this network boundary at the infrastructure level.

Docker:
> Your app works on your laptop (macOS, Java 21, specific env vars). It fails in CI (Ubuntu, Java 17, different paths). Docker's job: package the app with exactly the environment it needs, so "works on my machine" becomes "works everywhere."

---

## SECTION 2: DIAGRAM LIBRARY

Diagrams are the highest-value addition to any tool-heavy topic. Draw one whenever the concept involves:
- How A connects to B
- What happens step by step
- Memory or state layout
- Before vs after
- Request/event flow
- System hierarchy or topology

Use ` ```text ` for all diagrams. Here is the full pattern library:

### 2.1 Event / Message Flow Diagram (Kafka, RabbitMQ, SQS)
```text
Producer                  Broker                    Consumer
─────────                 ──────────────────         ─────────────────
OrderService    ─────►  Topic: orders               PaymentService
                          ┌──────────────────┐      (reads at own pace)
                          │ partition 0: ████│ ───►  consumer-group-A
                          │ partition 1: ███ │
                          │ partition 2: ████│ ───►  consumer-group-B
                          └──────────────────┘       (analytics, separate offset)
                          
Each partition = ordered log. Ordering guaranteed within partition only.
Different consumer groups maintain independent offsets — replay is free.
```

### 2.2 Request Flow / API Chain (Spring MVC, API Gateway, Microservices)
```text
HTTP Request
     │
     ▼
DispatcherServlet  ──► HandlerMapping  ──► finds @GetMapping("/users")
     │
     ▼
HandlerAdapter  ──► calls UserController.getUser()
     │
     ▼
UserController  ──► UserService.findById()  ──► UserRepository.findById()
     │                                              │
     │                                              ▼
     │                                         SQL: SELECT * FROM users WHERE id=?
     │                                              │
     ▼                                              ▼
ResponseEntity  ◄─────────────────── User entity (mapped from ResultSet)
     │
     ▼
HttpMessageConverter  ──► serialize to JSON  ──► HTTP 200 response
```

### 2.3 Infrastructure / Network Topology (AWS, K8s, Docker)
```text
                          AWS Region: us-east-1
  ┌─────────────────────────────────────────────────────────────┐
  │  VPC (10.0.0.0/16)                                          │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐ │
  │  │  Public Subnet        │  │  Private Subnet              │ │
  │  │  10.0.1.0/24          │  │  10.0.2.0/24                 │ │
  │  │                       │  │                              │ │
  │  │  [ALB]                │  │  [EC2: Spring Boot API]      │ │
  │  │  [NAT Gateway]        │  │  [RDS: PostgreSQL]           │ │
  │  │                       │  │  [ElastiCache: Redis]        │ │
  │  └──────────┬────────────┘  └──────────────────────────────┘ │
  │             │                         ▲                       │
  └─────────────┼─────────────────────────┼───────────────────────┘
                │                         │
          Internet Gateway          (no direct internet access)
                │
           [Internet]
```

### 2.4 State Transition Diagram (GC, Thread States, Circuit Breaker)
```text
Circuit Breaker States:

              failure rate > threshold
  [CLOSED] ─────────────────────────────► [OPEN]
  (normal traffic)                        (all requests fail-fast)
       ▲                                       │
       │                          after timeout│
       │                                       ▼
       │   success rate OK              [HALF-OPEN]
       └────────────────────────── (probe requests allowed)
                                       │         │
                                 success ✓   failure ✗
                                       │         │
                                   [CLOSED]   [OPEN]
```

### 2.5 Memory / Object Layout (JVM, Heap, Cache)
```text
JVM Memory Regions:

  ┌─────────────────────────────────────────────────────────┐
  │  Heap                                                    │
  │  ┌──────────────────────┐  ┌──────────────────────────┐ │
  │  │  Young Generation    │  │  Old Generation           │ │
  │  │  ┌──────┐ ┌────────┐ │  │  (long-lived objects)    │ │
  │  │  │ Eden │ │Survivor│ │  │  GC: Major/Full GC        │ │
  │  │  │      │ │ S0  S1 │ │  │  (stop-the-world)         │ │
  │  │  └──────┘ └────────┘ │  └──────────────────────────┘ │
  │  │  GC: Minor (fast)    │                                │
  │  └──────────────────────┘                                │
  ├─────────────────────────────────────────────────────────┤
  │  Metaspace (class metadata, no fixed cap by default)    │
  ├─────────────────────────────────────────────────────────┤
  │  Stack (per thread: frames, local vars, references)     │
  └─────────────────────────────────────────────────────────┘
```

### 2.6 Git Branch / Commit Graph
```text
  main:    A ── B ── C ──────────────── G (merge commit)
                      \               /
  feature:             D ── E ── F ──
  
  After rebase:
  main:    A ── B ── C ── D' ── E' ── F' ── G
                                             
  D' E' F' are NEW commits — same changes, different SHA.
  History is linear. main history is clean.
```

### 2.7 Docker / Container Layering
```text
  [Container: running instance]
  ┌─────────────────────────────────┐
  │  Read-Write Layer (thin)        │  ← your running app writes here
  ├─────────────────────────────────┤
  │  Image Layer 4: COPY app.jar    │  \
  ├─────────────────────────────────┤   \
  │  Image Layer 3: RUN mvn package │    ├── image layers (read-only, shared)
  ├─────────────────────────────────┤   /
  │  Image Layer 2: COPY pom.xml    │  /
  ├─────────────────────────────────┤
  │  Image Layer 1: FROM eclipse-   │  ← base image (pulled from registry)
  │                 temurin:21      │
  └─────────────────────────────────┘
  
  Layers are cached. Only changed layers rebuild. This is why layer order matters.
```

### 2.8 Before / After Code State
```text
  BEFORE (N+1 query problem):          AFTER (JOIN FETCH):
  ──────────────────────────           ──────────────────────────
  SELECT * FROM orders                 SELECT o.*, i.*
  → 1 query, returns 100 orders        FROM orders o
                                       JOIN FETCH o.items i
  For each order:                      → 1 query, all data loaded
  SELECT * FROM items WHERE order_id=?
  → 100 more queries                   99 queries eliminated.
  
  Total: 101 queries                   Total: 1 query
```

### 2.9 Comparison Side-by-Side
```text
  Synchronized (intrinsic lock)        ReentrantLock (explicit)
  ─────────────────────────────        ─────────────────────────
  synchronized(this) {                 lock.lock();
    // critical section                try {
  }                                      // critical section
                                       } finally {
  ✓ Simple, automatic unlock             lock.unlock();
  ✗ No timeout, no try-lock           }
  ✗ Can't interrupt waiting thread
                                       ✓ tryLock(timeout)
                                       ✓ lockInterruptibly()
                                       ✓ Condition variables
                                       ✗ More verbose
```

---

## SECTION 3: TOOL-SPECIFIC BLUEPRINTS

Different tools need completely different presentation. A Kafka question should NOT be formatted like a Java OOP question.

---

### 3.1 Kafka / Event-Driven / Messaging Tools

**The mental model that must appear in every Kafka question:**
- Producer, Broker, Consumer as the three roles
- Topic → Partitions → Offsets as the storage model
- Consumer groups as the scaling unit
- Diagram first, config second

**Blueprint:**
```
overview:     Real-world scenario + producer-broker-consumer diagram
phase 1:      The unit of storage (topic → partition → offset diagram)
phase 2:      The guarantee (ordering, durability — what the configs actually mean)
phase 3:      The failure mode (what breaks and why)
code_example: Full producer/consumer config (collapsed, supplementary)
```

**Mandatory diagram for any Kafka question:**
```text
Producer                 Kafka Cluster               Consumer Group
─────────                ─────────────────────       ──────────────────
OrderService             Broker 1                    PaymentService
  produce()     ──────►  Topic: orders               consumer-1
                          partition 0: [0][1][2][3]  offset: 3 ──► reads [3]
                          partition 1: [0][1][2]     
                         Broker 2                    consumer-2
                          partition 2: [0][1][2][3]  offset: 4 ──► reads [4]

Key: Each consumer in a group owns specific partitions.
     Two consumer groups = two independent read positions (replay is free).
```

**Config tables are mandatory for Kafka:**
```markdown
| Config | Default | Safe Production Value | Why |
|---|---|---|---|
| `acks` | `1` | `all` | Leader + all ISRs confirm write |
| `min.insync.replicas` | `1` | `2` | "all" without this = hollow guarantee |
| `enable.idempotence` | `false` | `true` | Prevents duplicate on retry |
| `replication.factor` | `1` | `3` | Survives 2 broker failures |
```

---

### 3.2 AWS (Cloud Infrastructure)

**AWS questions are almost entirely diagrams.** The concept IS the topology.

**Blueprint:**
```
overview:     Real workload scenario + architecture diagram
phase 1:      The core service role (what problem it solves in the system)
phase 2:      Configuration that matters (not all configs — the ones that break things)
phase 3:      The failure mode + cost trap
code_example: Terraform/CloudFormation snippet (collapsed)
```

**Every AWS question must have an infrastructure diagram.** Examples:

For VPC/networking:
```text
Internet ──► [Route 53] ──► [CloudFront CDN]
                                  │
                                  ▼
                        ┌─── VPC: 10.0.0.0/16 ───┐
                        │  Public Subnet           │
                        │  [ALB] [NAT GW]          │
                        │         │                │
                        │  Private Subnet          │
                        │  [ECS Tasks / EC2]       │
                        │         │                │
                        │  DB Subnet               │
                        │  [RDS Primary] [Standby] │
                        └──────────────────────────┘
```

For S3:
```text
S3 Object URL structure:
https://bucket-name.s3.region.amazonaws.com/prefix/object-key.jpg
         ─────────── ─────────────────────  ──────────────────────
         bucket          endpoint              object path (key)

Storage classes by cost vs access speed:
Standard ──► Standard-IA ──► Glacier Instant ──► Glacier ──► Deep Archive
(frequent)  (infrequent)    (millisecond)    (minutes)  (hours, cheapest)
```

**The cost/gotcha callout is mandatory for AWS (use bold text, not emoji):**
```
**Cost trap:** NAT Gateway charges $0.045/GB of data processed.
An EC2 instance downloading packages through NAT Gateway can generate
unexpected hundreds of dollars/month. Use VPC endpoints for S3/DynamoDB
to bypass NAT Gateway entirely for those services.
```

---

### 3.3 Git

**Git questions are commit graphs.** Every concept maps to a branch diagram.

**Blueprint:**
```
overview:     1-sentence scenario + commit graph
phase/step:   Command with before-state → after-state diagram
phase/step:   The safety rule (when this is safe, when it destroys history)
code_example: Full command sequence with terminal output (collapsed)
```

**Commit graph template (every Git question needs this):**
```text
Before rebase:
main:    A ── B ── C
                    \
feature:             D ── E ── F   (3 commits ahead)

git checkout feature
git rebase main

After rebase:
main:    A ── B ── C
                    \
feature:             D' ── E' ── F'   (same changes, new SHAs, linear history)
```

**The safety/danger callout is mandatory for Git destructive operations:**
```
>  **Golden Rule of Rebase:** Never rebase commits that have been pushed
> to a shared branch. Rebase rewrites history (new SHAs). If teammates have
> pulled the old commits, their history diverges from yours — force-push
> required, conflicts guaranteed.
```

**Terminal command blocks — always show before + after state:**
```bash
# Before: messy feature branch
git log --oneline
# f3a2b1c fix typo
# e9d4a2b forgot to add file  
# c8b3f1a actually fix the thing
# a1b2c3d first attempt (broken)

git rebase -i HEAD~4  # squash 4 commits into 1

# After: clean single commit
git log --oneline
# 7c9d1e2 Add OAuth2 login with Google provider
```

---

### 3.4 Docker / Kubernetes

**Docker = layering and isolation. K8s = topology and scheduling.**

Docker blueprint:
```
overview:     "works on my machine" scenario + layer diagram
phase 1:      The image (layers, cache, why order matters)
phase 2:      The container (process isolation, not a VM)
phase 3:      The gotcha (layer cache invalidation, multi-stage builds)
code_example: Full Dockerfile with comments (collapsed)
```

**K8s mandatory topology diagram:**
```text
Kubernetes Cluster
┌─────────────────────────────────────────────────────────┐
│  Control Plane                                          │
│  [API Server] [etcd] [Scheduler] [Controller Manager]  │
├─────────────────────────────────────────────────────────┤
│  Node 1                    Node 2                       │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │ Pod: api-server      │  │ Pod: api-server          │  │
│  │  container: [app]   │  │  container: [app]        │  │
│  │  container: [sidecar│  │                          │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│  [kubelet] [kube-proxy]    [kubelet] [kube-proxy]       │
└─────────────────────────────────────────────────────────┘
             ▲
     [kubectl apply -f deployment.yaml]
```

---

### 3.5 Spring Framework / Spring Boot

**Spring questions = wiring diagrams and lifecycle flows.**

```
overview:     The pain Spring solves (XML era, DI problem) + container diagram
phase 1:      What happens at startup (bean lifecycle diagram)
phase 2:      The specific feature (with config snippet showing minimal setup)
phase 3:      The footgun (circular dependency, proxy limitation, etc.)
code_example: Full working example (collapsed)
```

**Spring container diagram:**
```text
Application Context (IoC Container)
┌─────────────────────────────────────────────────────┐
│  Bean: UserService          ◄── @Service             │
│    depends on:                                       │
│      Bean: UserRepository   ◄── @Repository          │
│        depends on:                                   │
│          DataSource         ◄── @Bean in Config      │
│                                                      │
│  Bean: SecurityConfig       ◄── @Configuration       │
│    depends on:                                       │
│      Bean: UserService      (Spring wires this)      │
└─────────────────────────────────────────────────────┘
Spring resolves the dependency graph and injects everything.
You write the edges (@Autowired), Spring does the wiring.
```

---

### 3.6 Redis / Caching

**Redis questions = data structure diagrams + latency numbers.**

**Latency comparison (mandatory in most Redis questions):**
```text
  Operation              Latency        Relative
  ─────────────────────────────────────────────
  L1 cache hit           0.5 ns         1×
  RAM access             100 ns         200×
  Redis GET              <1 ms          2,000,000×
  PostgreSQL query       1–10 ms        2M–20M×
  Network round-trip     1–10 ms        same as DB

  Redis sits between RAM and DB — 100–10,000× faster than a DB query.
```

**Cache pattern diagrams (cache-aside, write-through, write-behind):**
```text
  Cache-Aside (most common):

  App  ──► Redis GET ──► HIT? ──► YES ──► return cached value
   │                      │
   │                      NO
   │                      │
   └──────────────────► DB query ──► store in Redis ──► return value

  Write-Through:
  App  ──► write to Redis ──► Redis writes to DB synchronously
         (always in sync, slower writes, never stale)
```

---

### 3.7 SQL / Database Design

**SQL questions = query plans and data model diagrams.**

**Entity relationship for design questions:**
```text
  User (1) ──────────── (N) Order
    │                         │
    │                         │ (1)
    │                         │
   (N)                        │ (N)
  Address                  OrderItem
                              │ (N)
                              │
                             (1)
                           Product
```

**Query execution plan for performance questions:**
```text
  SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id = u.id
  WHERE o.status = 'PENDING' ORDER BY o.created_at DESC LIMIT 10;

  Without index:                     With index on (status, created_at):
  ─────────────────────────          ─────────────────────────────────────
  Full table scan: orders            Index range scan: idx_orders_status_created
  → read all 10M rows                → read ~100 rows (filtered)
  → filter PENDING (99% thrown out)  → fetch 10 rows
  → sort 100K remaining              → no sort needed (index is sorted)
  → return 10                        → return 10
  
  Cost: seconds                      Cost: milliseconds
```

---

## SECTION 4: THE RESTRUCTURING PROCESS

### Step 1: Classify Every Question

Before touching anything, classify each question:

| Archetype | Signals | Blueprint |
|---|---|---|
| `internals` | "how does X work", "what happens when" | overview → phase → phase → phase |
| `comparison` | "X vs Y", "difference between", "when to use" | overview → comparison_table → when_to_use |
| `config-tool` | Kafka configs, Spring properties, AWS settings | overview → step → step → (config table) |
| `infrastructure` | AWS, K8s, Docker, VPC, networking | overview (diagram) → component → component |
| `debugging` | "N+1 problem", "deadlock", "memory leak" | problem_statement → diagnosis → step (fix) |
| `how-to` | "how to configure", "how to implement" | overview → step → step → step |
| `architecture` | design patterns, clean arch, DDD | overview → component → component → code_example |
| `git-workflow` | any Git topic | overview (commit graph) → step → step |

### Step 2: Apply Visual Treatment

For each section, run through this checklist:

**Paragraphs:**
- Max 3–4 sentences, then blank line
- One `**bold**` per paragraph (key term, number, rule)
- Every code name in backticks

**Diagrams — ADD one if:**
- The concept involves A → B flow
- There's a before/after state
- There's a hierarchy or topology
- There's a sequence of operations
- The concept has named components with relationships

**Scenarios — ADD one if:**
- It's a tool question (Kafka, Redis, AWS, Git, Docker)
- The abstract concept only clicks with a concrete example
- The question answers "why would I use this"

**Tables — ADD/CONVERT one if:**
- Two or more things are compared in prose
- There are config options with their trade-offs
- There's a decision (when to use X vs Y)

**Callouts — ADD one per section max:**
```
>  **Production Gotcha:** specific warning
>  **Mental Model:** concrete analogy
>  **Common Mistake:** what gets wrong and why
```

### Step 3: Section Titles

Every section title must be an insight:
- **phase title** = what the reader will understand after reading this phase
- **step title** = what the reader will be able to do after this step
- **component title** = what role this component plays in the system

Never:
- "Phase 1 — Introduction"
- "Overview of Kafka"
- "Code Example"

Always:
- "Why Partitions Are the Unit of Parallelism (And Why You Can't Add More Later)"
- "The Offset: How Kafka Knows Where Each Consumer Left Off"
- "The acks=all Trap: Why the Default Config Silently Loses Data"

---

## SECTION 5: SELF-CHECK

**Before submitting each question:**

Structure:
- [ ] Section types match content purpose
- [ ] No `code_example` contains essential explanation
- [ ] Section titles are insights, not labels

Typography:
- [ ] Every section over 150 words has `##` sub-headers
- [ ] Max 3–4 sentences per paragraph
- [ ] `**bold**` on one key term per paragraph
- [ ] Every code reference in backticks

Diagrams:
- [ ] Tool questions (Kafka, Git, AWS, Docker, K8s, Spring) have at least one diagram
- [ ] Any "how things connect" concept has a flow/topology diagram
- [ ] Any before/after state has a split diagram
- [ ] Git questions have a commit graph

Real-world grounding:
- [ ] Tool questions open with a 2–4 sentence relatable scenario
- [ ] Abstract concepts have at least one concrete example ("at 10M orders/day...")

Tables:
- [ ] All X vs Y comparisons are `comparison_table` type
- [ ] Config-heavy topics have a config table with defaults + safe values + why

Code:
- [ ] Essential code is in phase/step as inline blocks (not only in code_example)
- [ ] All inline code blocks have setup before + follow-up after
- [ ] Language tags on all fenced blocks

---

## SECTION 6: THE TARGET EXPERIENCE

A developer should open a question and experience this:

1. **Scenario** (2 sentences) — "Oh, I know this situation. I've hit this."
2. **Diagram** — "Ah, so THAT's how it connects. I get it now."
3. **Phase 1** — reads 2 paragraphs, sees 10-line code block, understands the mechanism
4. **Phase 2** — sees the config table or comparison, understands the trade-offs
5. **Phase 3** — sees the `>` callout, understands the gotcha
6. **Code example** — optionally expands the full working program

Total reading time: 3–5 minutes. Total understanding gained: what takes most developers weeks to learn through trial and error.

The experience should feel like reading a chapter from "Designing Data-Intensive Applications" — every diagram earns its place, every example is from a real system, every gotcha is one you'd actually hit.