# MASTER ARCHITECTURE PLAN — InterviewExplainer
> **Version 2.0 · April 2025 · Living Document — The Law**
> Every architectural decision, every content standard, every SEO rule lives here.
> Read this before touching anything. When in doubt — come back here.

---

## VISION

> The single platform where any developer — regardless of language, experience level, or target company — can prepare completely for any technical interview. Free. Better than anything paid. Built to rank #1 for every search.

---

## FULL COMPETITOR MAP & HOW YOU BEAT EACH ONE

| Competitor | Monthly Traffic | What They Own | Fatal Weakness | How You Win |
|---|---|---|---|---|
| **LeetCode** | 55M | DSA problems | Zero explanations. No Q&A. No system design. No interview coaching. | `/dsa/` with line-by-line explanations + interview voice. Same problems, 10x better learning. |
| **GeeksforGeeks** | 90M | Everything shallow | No experience levels. Textbook answers. 2015 content. Ad-infested. | Experience-level filtering. Interview-framed prose. 2025 content. Clean UX. |
| **InterviewBit** | 8M | Java/Python basics | 2018 content. No experience tiers. No depth. | Modern content. 3 experience tiers. Real depth. |
| **Baeldung** | 18M | Spring/Java tutorials | Tutorial format ≠ interview format. Zero other stacks. | Interview format. All stacks. All languages. |
| **JavaTpoint** | 12M | Java breadth | Extremely shallow. Zero prose. All code dumps. | Prose-quality. Explanation-first. |
| **Guru99** | 10M | Tool-specific shallow | One tool per page. No tracks. No experience levels. | `/tools/` aggregates ALL tracks. Interview-framed. |
| **AlgoExpert** | 2M | DSA (paid $99/yr) | Paid. DSA only. No Q&A. No system design context. | Free. DSA + Q&A + System Design in one place. |
| **System Design Primer** | GitHub | System design concepts | Static GitHub README. No search. No experience. No interview coaching. | Interactive. Searchable. Levelled. Interview-framed. |
| **DesignGurus** | 1M | System design (paid) | Paid. System design only. No Q&A. No DSA. | Free. System design + Q&A + DSA. |
| **ByteByteGo** | 3M | Visual system design (paid) | Paid newsletter. Visual only. No interactive learning. | Free. Text + visual + interactive. |
| **Glassdoor** | 30M | Company Q&A | User-submitted noise. No structure. No teaching. | Curated. Structured. Quality. |
| **Pramp / Interviewing.io** | 1M | Mock interviews | No learning content. Practice only. | Content-first. Mock interviews as feature (future). |
| **Naukri/Shine** | India | Job + basic Q&A | Job platform first. Content is an afterthought. | Interview prep first. Content is the product. |
| **HackerRank** | 8M | Coding challenges | Competitive, not interview-focused. No explanations. | Interview-framed. Explanation-first. |

**The Gap Nobody Has Filled:**
No platform combines experience-level Q&A + DSA with line-by-line explanations + system design + tool aggregation + company-specific prep — all free, all SEO-optimized, all at quality that beats paid alternatives.

---

## COMPLETE SITE ARCHITECTURE

### URL Space (5+1 Hubs)

```
interviewexplainer.com/
│
├── /interview/                            HUB 1: Q&A by Lang × Track × Level
│   └── /{lang}/{track}/{level}/{stack}/{slug}
│
├── /dsa/                                  HUB 2: Problems (beats LeetCode on quality)
│   ├── /problem/{slug}/
│   ├── /{category}/
│   ├── /easy/ /medium/ /hard/
│   ├── /pattern/{pattern}/
│   └── /company/{company}/
│
├── /tools/                                HUB 3: Tool-first (beats Guru99)
│   └── /{tool}/
│
├── /topics/                               HUB 4: Concept-first (beats System Design Primer)
│   └── /{concept}/
│
├── /compare/                              HUB 5: X vs Y (captures comparison searches)
│   └── /{slug}/
│
└── /companies/                            HUB 6: Company-specific prep (high intent)
    └── /{company}/{type}/
        ├── overview/
        ├── dsa/
        ├── system-design/
        ├── behavioral/
        └── {lang}-specific/
```

---

## HUB 1 — `/interview/` Full Matrix

### Complete Lang × Track Matrix

```
java/
  backend/          ← Java Backend Engineer
  frontend/         ← Java + JSP/Thymeleaf (niche but exists)
  fullstack/        ← Java BE + React FE
  android/          ← Android (Java)

python/
  backend/          ← Django, FastAPI, Flask
  frontend/         ← Python + Jinja/HTMX (niche)
  fullstack/        ← Python BE + React/Vue FE
  data-engineering/ ← Airflow, Spark, Kafka, dbt
  ml-ai/            ← MLOps, model deployment, LLMOps

javascript/
  frontend/         ← React, Vue, Angular, Next.js
  backend/          ← Node.js, Express, NestJS
  fullstack/        ← React + Node

typescript/
  frontend/         ← React+TS, Angular
  backend/          ← NestJS, tRPC
  fullstack/

go/
  backend/          ← Go APIs, microservices

kotlin/
  android/          ← Android (Kotlin)
  backend/          ← Ktor, Spring Boot (Kotlin)

csharp/
  backend/          ← ASP.NET Core

devops/
  cicd/             ← Jenkins, GitHub Actions, GitLab CI
  cloud/            ← AWS, GCP, Azure
  infrastructure/   ← Terraform, Ansible, Helm
  sre/              ← SRE practices

ruby/
  backend/          ← Ruby on Rails, Sinatra, Sidekiq, RSpec
  fullstack/        ← Rails + Hotwire/Turbo + React

data-analyst/       ← NON-ENGINEERING ROLE (nobody covers this well)
  sql-analytics/    ← SQL coding rounds, CTEs, window functions, report queries
  python-analysis/  ← Pandas, NumPy, EDA, data cleaning
  visualization/    ← Tableau, Power BI, chart storytelling
  case-studies/     ← "Why is metric X dropping?", "How would you measure Y?"

business-analyst/   ← NON-ENGINEERING ROLE (huge untapped market)
  analysis/         ← Requirements, stakeholders, Agile, SQL basics, STAR behavioral
```

### Levels (always 3 per track)

```
beginner      (0–2 yrs)   → foundation, what/why, simple code
intermediate  (2–5 yrs)   → patterns, production, trade-offs
advanced      (5+ yrs)    → architecture, scale, failure modes
```

**Default Rule:**
- Not logged in → serve `intermediate` (most search traffic)
- Logged in → redirect to user's saved level
- URL always contains level → 3 separate indexed pages per question

---

### Java Backend — Complete Stack List

**Core Language**
```
/interview/java/backend/{level}/core-java/
/interview/java/backend/{level}/advanced-java/
/interview/java/backend/{level}/collections-data-structures/
/interview/java/backend/{level}/concurrency-multithreading/
/interview/java/backend/{level}/jvm-performance/
```

**Spring Ecosystem**
```
/interview/java/backend/{level}/spring-boot/
/interview/java/backend/{level}/spring-core/
/interview/java/backend/{level}/spring-mvc-rest/
/interview/java/backend/{level}/spring-security/
/interview/java/backend/{level}/spring-data-jpa/
/interview/java/backend/{level}/spring-cloud/
/interview/java/backend/{level}/spring-batch/
```

**Data & Persistence**
```
/interview/java/backend/{level}/postgresql/
/interview/java/backend/{level}/mysql/
/interview/java/backend/{level}/mongodb/
/interview/java/backend/{level}/redis/
/interview/java/backend/{level}/elasticsearch/
/interview/java/backend/{level}/hibernate/
/interview/java/backend/{level}/database-design/
```

**Messaging & Events**
```
/interview/java/backend/{level}/kafka/
/interview/java/backend/{level}/rabbitmq/
/interview/java/backend/{level}/spring-kafka/
/interview/java/backend/{level}/event-driven-architecture/
```

**APIs**
```
/interview/java/backend/{level}/rest-api/
/interview/java/backend/{level}/graphql/
/interview/java/backend/{level}/grpc/
/interview/java/backend/{level}/websockets/
```

**Infrastructure & DevOps**
```
/interview/java/backend/{level}/docker/
/interview/java/backend/{level}/kubernetes/
/interview/java/backend/{level}/aws/
/interview/java/backend/{level}/gcp/
/interview/java/backend/{level}/azure/
/interview/java/backend/{level}/jenkins/
/interview/java/backend/{level}/github-actions/
/interview/java/backend/{level}/terraform/
/interview/java/backend/{level}/maven/
/interview/java/backend/{level}/gradle/
```

**Architecture & Design**
```
/interview/java/backend/{level}/microservices/
/interview/java/backend/{level}/system-design/
/interview/java/backend/{level}/architecture-patterns/
/interview/java/backend/{level}/design-patterns/
/interview/java/backend/{level}/domain-driven-design/
/interview/java/backend/{level}/clean-architecture/
```

**Quality & Operations**
```
/interview/java/backend/{level}/testing/
/interview/java/backend/{level}/observability/
/interview/java/backend/{level}/security/
/interview/java/backend/{level}/performance-tuning/
/interview/java/backend/{level}/logging-monitoring/
/interview/java/backend/{level}/production-operations/
```

---

### Python Backend — Complete Stack List

**Core Language**
```
/interview/python/backend/{level}/python-fundamentals/
/interview/python/backend/{level}/python-oop/
/interview/python/backend/{level}/python-async/
/interview/python/backend/{level}/python-data-structures/
/interview/python/backend/{level}/python-typing/
```

**Frameworks**
```
/interview/python/backend/{level}/django/
/interview/python/backend/{level}/django-rest-framework/
/interview/python/backend/{level}/fastapi/
/interview/python/backend/{level}/flask/
/interview/python/backend/{level}/celery/
/interview/python/backend/{level}/pydantic/
/interview/python/backend/{level}/sqlalchemy/
```

**Data & Persistence (shared with Java via $ref)**
```
/interview/python/backend/{level}/postgresql/
/interview/python/backend/{level}/mysql/
/interview/python/backend/{level}/mongodb/
/interview/python/backend/{level}/redis/
/interview/python/backend/{level}/elasticsearch/
```

**Messaging (same tools, Python angle)**
```
/interview/python/backend/{level}/kafka/
/interview/python/backend/{level}/rabbitmq/
/interview/python/backend/{level}/celery-tasks/
```

**Infrastructure**
```
/interview/python/backend/{level}/docker/
/interview/python/backend/{level}/kubernetes/
/interview/python/backend/{level}/aws/
/interview/python/backend/{level}/github-actions/
/interview/python/backend/{level}/terraform/
```

**Python-Specific**
```
/interview/python/backend/{level}/testing-pytest/
/interview/python/backend/{level}/async-programming/
/interview/python/backend/{level}/performance-optimization/
/interview/python/backend/{level}/packaging-deployment/
```

**Data Engineering Track**
```
/interview/python/data-engineering/{level}/airflow/
/interview/python/data-engineering/{level}/spark/
/interview/python/data-engineering/{level}/kafka-streams/
/interview/python/data-engineering/{level}/dbt/
/interview/python/data-engineering/{level}/pandas/
/interview/python/data-engineering/{level}/data-pipelines/
/interview/python/data-engineering/{level}/warehouse-design/
```

**ML/AI Track**
```
/interview/python/ml-ai/{level}/mlops/
/interview/python/ml-ai/{level}/model-deployment/
/interview/python/ml-ai/{level}/llm-engineering/
/interview/python/ml-ai/{level}/feature-engineering/
/interview/python/ml-ai/{level}/vector-databases/
/interview/python/ml-ai/{level}/ai-system-design/
```

---

### JavaScript Frontend — Complete Stack List

```
/interview/javascript/frontend/{level}/javascript-fundamentals/
/interview/javascript/frontend/{level}/typescript/
/interview/javascript/frontend/{level}/react/
/interview/javascript/frontend/{level}/vue/
/interview/javascript/frontend/{level}/angular/
/interview/javascript/frontend/{level}/nextjs/
/interview/javascript/frontend/{level}/html-css/
/interview/javascript/frontend/{level}/web-performance/
/interview/javascript/frontend/{level}/accessibility/
/interview/javascript/frontend/{level}/testing-jest/
/interview/javascript/frontend/{level}/state-management/
/interview/javascript/frontend/{level}/web-security/
```

---

## HUB 2 — `/dsa/` Full Architecture

### Beat LeetCode On: Quality of Explanation

LeetCode gives a solution. We give **understanding**.

```
/dsa/
├── /problem/{slug}/           ← Every problem, line-by-line
├── /easy/                     ← 150 curated easy problems
├── /medium/                   ← 200 curated medium problems
├── /hard/                     ← 100 curated hard problems
│
├── /pattern/                  ← THE SEO WEAPON
│   ├── /two-pointers/         "two pointers technique problems" → 70k/mo
│   ├── /sliding-window/       "sliding window technique" → 85k/mo
│   ├── /hash-map/             "hash map pattern interview" → 60k/mo
│   ├── /binary-search/        "binary search variations" → 65k/mo
│   ├── /fast-slow-pointers/
│   ├── /merge-intervals/
│   ├── /cyclic-sort/
│   ├── /tree-bfs/
│   ├── /tree-dfs/
│   ├── /graph-bfs-dfs/        "graph interview questions bfs dfs" → 50k/mo
│   ├── /dynamic-programming/  "dp patterns interview" → 90k/mo
│   ├── /backtracking/
│   ├── /monotonic-stack/      "monotonic stack problems" → 35k/mo
│   ├── /heap-top-k/
│   ├── /trie/
│   └── /bit-manipulation/
│
├── /category/
│   ├── /arrays/
│   ├── /strings/
│   ├── /linked-lists/
│   ├── /trees/
│   ├── /graphs/
│   ├── /stack-queue/
│   ├── /heap/
│   ├── /tries/
│   └── /math/
│
└── /company/                  ← Company-tagged problems
    ├── /amazon/
    ├── /google/
    ├── /microsoft/
    ├── /meta/
    └── /apple/
```

---

## HUB 3 — `/tools/` Full List (Every Tool = Cross-Track Page)

```
/tools/kafka/         → Java BE + Python BE + Data Eng + DevOps
/tools/redis/         → Java BE + Python BE + Node BE + DevOps
/tools/docker/        → Java BE + Python BE + JS BE + DevOps
/tools/kubernetes/    → Java BE + Python BE + DevOps + SRE
/tools/aws/           → Java BE + Python BE + DevOps + ML/AI
/tools/gcp/           → Java BE + Python BE + DevOps + Data Eng
/tools/azure/         → Java BE + Python BE + DevOps + .NET
/tools/postgresql/    → Java BE + Python BE + Data Eng + DBA
/tools/mongodb/       → Java BE + Python BE + JS BE
/tools/elasticsearch/ → Java BE + Python BE + DevOps
/tools/jenkins/       → Java BE + Python BE + DevOps
/tools/github-actions/→ All tracks
/tools/terraform/     → DevOps + Cloud
/tools/spring-boot/   → Java BE + Java Fullstack
/tools/django/        → Python BE + Python Fullstack
/tools/fastapi/       → Python BE + Python ML
/tools/react/         → JS Frontend + Fullstack
/tools/nextjs/        → JS Frontend + Fullstack + SEO
/tools/graphql/       → Java BE + Python BE + JS
/tools/grpc/          → Java BE + Python BE + Go
/tools/airflow/       → Python Data Eng
/tools/spark/         → Python Data Eng + Scala
/tools/ansible/       → DevOps
/tools/helm/          → DevOps + Kubernetes
```

---

## HUB 4 — `/topics/` Full List

```
/topics/system-design/              → 300k searches/month
/topics/microservices/              → 85k/month
/topics/distributed-systems/        → 60k/month
/topics/databases/                  → 120k/month
/topics/caching/                    → 55k/month
/topics/api-design/                 → 70k/month
/topics/concurrency/                → 65k/month
/topics/security/                   → 80k/month
/topics/observability/              → 30k/month
/topics/event-driven-architecture/  → 40k/month
/topics/clean-architecture/         → 35k/month
/topics/domain-driven-design/       → 45k/month
/topics/cap-theorem/                → 30k/month
/topics/data-modeling/              → 40k/month
/topics/cloud-native/               → 25k/month
/topics/devops/                     → 90k/month
/topics/testing/                    → 75k/month
/topics/performance/                → 50k/month
```

---

## HUB 5 — `/compare/` Full List

```
/compare/kafka-vs-rabbitmq/           → 130k/month
/compare/sql-vs-nosql/                → 150k/month
/compare/redis-vs-memcached/          → 90k/month
/compare/mysql-vs-postgresql/         → 110k/month
/compare/docker-vs-kubernetes/        → 95k/month
/compare/rest-vs-graphql/             → 70k/month
/compare/microservices-vs-monolith/   → 60k/month
/compare/aws-vs-gcp-vs-azure/         → 85k/month
/compare/spring-boot-vs-quarkus/      → 25k/month
/compare/django-vs-fastapi/           → 45k/month
/compare/maven-vs-gradle/             → 40k/month
/compare/junit-vs-testng/             → 30k/month
/compare/grpc-vs-rest/                → 45k/month
/compare/mongodb-vs-postgresql/       → 55k/month
/compare/celery-vs-rq/                → 20k/month
/compare/airflow-vs-prefect/          → 25k/month
/compare/react-vs-vue-vs-angular/     → 120k/month
/compare/nextjs-vs-nuxtjs/            → 30k/month
/compare/kubernetes-vs-docker-swarm/  → 35k/month
/compare/terraform-vs-ansible/        → 40k/month
/compare/sync-vs-async/               → 35k/month
/compare/jwt-vs-session/              → 45k/month
/compare/sql-vs-orm/                  → 30k/month
/compare/unit-vs-integration-testing/ → 35k/month
```

**Page format — NOT a blog post. Interview-framed Q&A:**
```
H1: "Kafka vs RabbitMQ — How to Answer in an Interview"
→ "If an interviewer asks you to compare Kafka and RabbitMQ, here's what they want to hear..."
→ 5 key dimensions (throughput, persistence, routing, use cases, when to choose)
→ Each dimension = one interview-answerable bullet
→ JSON-LD: FAQPage for each dimension as a question
→ Links to: /tools/kafka/, /tools/rabbitmq/, /topics/event-driven-architecture/
```

---

## HUB 6 — `/companies/` Full Architecture

```
/companies/
├── /amazon/
│   ├── /overview/            ← Amazon interview process, LP principles
│   ├── /dsa/                 ← Patterns Amazon actually tests
│   ├── /system-design/       ← Amazon SD questions (S3, DynamoDB, etc.)
│   ├── /behavioral/          ← LP-based behavioral questions
│   └── /java-backend/        ← Amazon-specific Java questions
│
├── /google/
│   ├── /overview/
│   ├── /dsa/                 ← Google DSA patterns (hard problems)
│   ├── /system-design/       ← Google SD (search, maps, YouTube)
│   └── /coding-rounds/
│
├── /microsoft/
│   ├── /dsa/
│   ├── /system-design/
│   └── /azure-specific/
│
├── /meta/
│   ├── /dsa/
│   ├── /system-design/
│   └── /react-specific/
│
└── /startups/
    ├── /seed-stage/
    ├── /series-a/
    └── /series-b-plus/
```

**SEO targets:**
```
"amazon interview questions"              → 200k/month
"google interview questions"              → 180k/month
"microsoft interview questions"           → 120k/month
"meta interview questions"                → 90k/month
"amazon leadership principles interview"  → 65k/month
"amazon system design interview"          → 55k/month
"google system design interview"          → 50k/month
"faang interview preparation"             → 80k/month
```

---

## INDEPENDENT HUBS — STANDALONE LEARNING SECTIONS

> Each hub is a **standalone product** that works independently for organic/self-learners
> AND cross-links into the interview Q&A flow. A user can land on `/system-design/`
> from Google and never touch the interview section — or they can follow links into
> language-specific Q&A. Both paths work. Both rank.

---

### HUB 7 — `/system-design/` Full Architecture

**Beats:** ByteByteGo (3M, paid), DesignGurus (1M, paid), System Design Primer (GitHub, static)

**Why we win:** Free. Interactive. Experience-leveled. Interview-framed. Searchable.
ByteByteGo is a paid newsletter with visuals. We give the same depth + interactivity + code + all levels — for free.

```
/system-design/
├── /fundamentals/                         ← "system design basics" → 120k/mo
│   ├── /scalability/                      ← horizontal vs vertical, load balancing
│   ├── /availability/                     ← redundancy, failover, SLAs (99.9 vs 99.99)
│   ├── /consistency/                      ← strong vs eventual, CAP theorem
│   ├── /partitioning/                     ← sharding strategies, consistent hashing
│   ├── /caching/                          ← cache-aside, write-through, TTL, eviction
│   ├── /databases/                        ← SQL vs NoSQL, replication, indexing
│   ├── /networking/                       ← DNS, CDN, TCP/UDP, HTTP/2, gRPC
│   ├── /api-design/                       ← REST, GraphQL, gRPC, rate limiting
│   ├── /message-queues/                   ← pub/sub, event streaming, dead letters
│   ├── /cap-theorem/                      ← deep-dive with real examples
│   ├── /acid-vs-base/                     ← transactions, eventual consistency
│   ├── /consensus/                        ← Raft, Paxos, leader election
│   └── /security/                         ← auth, encryption, OWASP, TLS
│
├── /building-blocks/                      ← "system design building blocks" → 80k/mo
│   ├── /load-balancer/                    ← L4 vs L7, algorithms, health checks
│   ├── /reverse-proxy/                    ← Nginx, HAProxy, API gateway
│   ├── /cache/                            ← Redis, Memcached, CDN cache, browser cache
│   ├── /database/                         ← relational, document, graph, time-series, wide-column
│   ├── /message-queue/                    ← Kafka, RabbitMQ, SQS, comparison table
│   ├── /cdn/                              ← CloudFront, Fastly, edge computing
│   ├── /blob-storage/                     ← S3, GCS, Azure Blob
│   ├── /search-engine/                    ← Elasticsearch, Solr, Algolia
│   ├── /rate-limiter/                     ← token bucket, sliding window, distributed
│   ├── /unique-id-generator/              ← UUID, Snowflake, ULID, auto-increment
│   ├── /service-discovery/                ← Consul, Eureka, DNS-based
│   ├── /heartbeat/                        ← health checks, circuit breakers
│   └── /checksum/                         ← data integrity, hash verification
│
├── /problems/                             ← "system design interview questions" → 300k/mo
│   ├── /design-url-shortener/             ← TinyURL, bit.ly
│   ├── /design-rate-limiter/              ← API rate limiting at scale
│   ├── /design-chat-system/               ← WhatsApp, Slack, Discord
│   ├── /design-news-feed/                 ← Facebook feed, Twitter timeline
│   ├── /design-notification-system/       ← push, SMS, email at scale
│   ├── /design-search-autocomplete/       ← Google search suggestions, Trie
│   ├── /design-youtube/                   ← video streaming, encoding, CDN
│   ├── /design-google-drive/              ← file storage, sync, sharing
│   ├── /design-twitter/                   ← fan-out, timeline, trending
│   ├── /design-instagram/                 ← photo sharing, stories, explore
│   ├── /design-web-crawler/               ← Googlebot, politeness, dedup
│   ├── /design-uber/                      ← ride matching, geospatial, ETA
│   ├── /design-ticketmaster/              ← seat reservation, concurrency
│   ├── /design-payment-system/            ← Stripe, idempotency, reconciliation
│   ├── /design-e-commerce/                ← Amazon, inventory, checkout
│   ├── /design-amazon-s3/                 ← object storage at scale
│   ├── /design-google-maps/               ← routing, tiles, real-time traffic
│   ├── /design-distributed-cache/         ← Redis cluster, consistent hashing
│   ├── /design-key-value-store/           ← DynamoDB, Cassandra internals
│   ├── /design-recommendation-engine/     ← collaborative filtering, ML pipeline
│   ├── /design-search-engine/             ← inverted index, ranking, crawling
│   ├── /design-email-system/              ← SMTP, IMAP, spam filtering
│   ├── /design-stock-exchange/            ← order matching, FIFO, latency
│   ├── /design-hotel-reservation/         ← booking, double-sell prevention
│   └── /design-gaming-leaderboard/        ← real-time ranking, Redis sorted sets
│
├── /case-studies/                         ← "how does X work internally" → 50k+/mo
│   ├── /how-netflix-works/
│   ├── /how-uber-works/
│   ├── /how-whatsapp-works/
│   ├── /how-instagram-works/
│   ├── /how-slack-works/
│   ├── /how-stripe-works/
│   ├── /how-google-search-works/
│   ├── /how-spotify-works/
│   └── /how-discord-works/
│
└── /cheatsheet/                           ← quick reference cards
    ├── /estimation/                       ← back-of-envelope calculations
    ├── /template/                         ← the 4-step framework
    └── /common-numbers/                   ← latency, throughput, storage numbers
```

**Content schema: System Design Problem (`/system-design/problems/{slug}.json`):**
```json
{
  "slug": "design-url-shortener",
  "title": "Design a URL Shortener",
  "difficulty": "medium",
  "frequency": "very-high",
  "companies": ["amazon", "google", "microsoft", "meta", "uber"],
  "timeEstimate": "35 min",
  "level": {
    "beginner": "Focus on basic CRUD, hashing, database schema",
    "intermediate": "Add caching, analytics, rate limiting, custom aliases",
    "advanced": "Global scale, multi-region, consistent hashing, 99.99% SLA"
  },
  "requirements": {
    "functional": ["Shorten long URL → short URL", "Redirect short → long", "Custom aliases", "Analytics"],
    "nonFunctional": ["Low latency (<100ms)", "High availability", "100M URLs/day write", "10:1 read/write ratio"]
  },
  "estimation": {
    "storage": "100M × 365 days × 5 years × 500 bytes = ~90TB",
    "qps": { "write": "~1200/s", "read": "~12000/s" },
    "bandwidth": "Read: 12000 × 500B = 6MB/s"
  },
  "highLevelDesign": { "diagram": "...", "components": ["API Gateway", "App Server", "Cache (Redis)", "Database (Cassandra)", "Zookeeper (ID gen)"] },
  "deepDives": [
    { "topic": "Hash Function", "content": "Base62 encoding of auto-increment ID. Why not MD5? Collision probability..." },
    { "topic": "Database Choice", "content": "Cassandra for write-heavy, eventual consistency acceptable for URL shortening..." },
    { "topic": "Cache Strategy", "content": "80/20 rule — 20% of URLs generate 80% of traffic. Redis with LRU eviction..." },
    { "topic": "Rate Limiting", "content": "Token bucket per API key. Prevent abuse. Sliding window for accuracy..." }
  ],
  "interviewVoice": "I'd start by clarifying requirements — how many URLs per day? Custom aliases? Analytics? Then estimate storage and QPS. For the hash, I'd use Base62 on a distributed ID generator rather than random hashing to avoid collisions...",
  "tradeoffs": [
    { "decision": "Hash vs Counter", "optionA": "Random hash — no coordination needed", "optionB": "Counter-based — guaranteed unique but needs Zookeeper" },
    { "decision": "SQL vs NoSQL", "optionA": "PostgreSQL — ACID, familiar", "optionB": "Cassandra — write-optimized, horizontally scalable" }
  ],
  "followups": ["How would you handle hot URLs?", "How to support analytics dashboard?", "How to expire URLs?", "How to handle 301 vs 302 redirects?"],
  "relatedProblems": ["design-rate-limiter", "design-key-value-store"],
  "relatedTopics": ["caching", "databases", "consistent-hashing"]
}
```

---

### HUB 8 — `/behavioral/` Full Architecture

**Beats:** Nobody does this well. Glassdoor has user noise. No platform teaches behavioral systematically.

**Why we win:** Structured STAR method. Company-specific behavioral banks. Experience-leveled. Not user-submitted noise.

```
/behavioral/
├── /star-method/                          ← "STAR method interview" → 90k/mo
│   ├── /what-is-star/
│   ├── /crafting-stories/                 ← how to build your story bank
│   ├── /common-mistakes/
│   └── /examples/                         ← 20 fully worked STAR examples
│
├── /questions/                            ← "behavioral interview questions" → 200k/mo
│   ├── /leadership/                       ← Led a team, made tough call
│   ├── /conflict-resolution/              ← Disagreement with PM/manager
│   ├── /failure/                          ← Tell me about a time you failed
│   ├── /teamwork/                         ← Cross-functional collaboration
│   ├── /initiative/                       ← Went above and beyond
│   ├── /pressure/                         ← Tight deadline, ambiguity
│   ├── /customer-obsession/               ← Customer impact stories
│   ├── /technical-challenge/              ← Hardest bug, complex system
│   ├── /mentorship/                       ← Teaching, growing others
│   └── /decision-making/                  ← Data-driven decisions, trade-offs
│
├── /company-specific/                     ← company-tailored behavioral
│   ├── /amazon-leadership-principles/     ← "amazon LP interview" → 65k/mo
│   │   ├── /customer-obsession/
│   │   ├── /ownership/
│   │   ├── /invent-and-simplify/
│   │   ├── /are-right-a-lot/
│   │   ├── /learn-and-be-curious/
│   │   ├── /hire-and-develop-the-best/
│   │   ├── /insist-on-highest-standards/
│   │   ├── /think-big/
│   │   ├── /bias-for-action/
│   │   ├── /frugality/
│   │   ├── /earn-trust/
│   │   ├── /dive-deep/
│   │   ├── /have-backbone/
│   │   └── /deliver-results/
│   ├── /google-googleyness/               ← Google culture-fit questions
│   ├── /meta-core-values/                 ← Meta move-fast culture
│   ├── /microsoft-growth-mindset/
│   └── /apple-collaboration/
│
└── /by-level/                             ← level-appropriate expectations
    ├── /junior/                           ← focus: learning, ownership, teamwork
    ├── /mid/                              ← focus: leadership, conflict, initiative
    └── /senior/                           ← focus: strategy, mentorship, org impact
```

**Content schema: Behavioral Question:**
```json
{
  "slug": "tell-me-about-a-time-you-failed",
  "title": "Tell Me About a Time You Failed",
  "category": "failure",
  "frequency": "very-high",
  "companies": ["amazon", "google", "microsoft", "meta"],
  "whyTheyAsk": "They're testing self-awareness, growth mindset, and whether you take accountability. They do NOT want to hear 'I've never really failed'.",
  "framework": "STAR",
  "levelExpectations": {
    "junior": "Show you learned from a specific mistake. Focus on the lesson.",
    "mid": "Show you identified root cause, implemented process change, measured improvement.",
    "senior": "Show organizational impact of the failure, how you led the recovery, what you changed at the team/system level."
  },
  "exampleAnswers": [
    {
      "level": "mid",
      "situation": "Led a migration from monolith to microservices...",
      "task": "Responsible for the database migration plan...",
      "action": "Rushed the cutover without proper rollback plan...",
      "result": "2-hour outage. Implemented blue-green deployment process. Zero outages since."
    }
  ],
  "doList": ["Be specific — name the project, the mistake, the outcome", "Show what you learned", "Quantify the impact and recovery"],
  "dontList": ["Don't say you've never failed", "Don't blame others", "Don't pick a trivial failure"],
  "followups": ["What would you do differently?", "How did your team react?", "What process did you change?"]
}
```

---

### HUB 9 — `/roadmaps/` Full Architecture

**Beats:** roadmap.sh (25M, generic dev roadmaps), no interview-focused roadmaps exist

**Why we win:** Interview-focused roadmaps with week-by-week study plans. Every node links to our content.
roadmap.sh tells you WHAT to learn. We tell you what to learn FOR THE INTERVIEW and link every topic to actual questions.

```
/roadmaps/
├── /java-backend/                         ← "java backend interview roadmap" → 20k/mo
│   ├── /beginner/                         ← 4-week plan
│   ├── /intermediate/                     ← 8-week plan
│   └── /advanced/                         ← 12-week plan
│
├── /python-backend/
├── /javascript-frontend/
├── /fullstack/
├── /data-engineering/
├── /ml-ai/
├── /devops/
├── /android/
├── /system-design/                        ← "system design study plan" → 40k/mo
├── /dsa/                                  ← "leetcode study plan" → 60k/mo
│   ├── /blind-75/                         ← "blind 75 leetcode" → 55k/mo
│   ├── /neetcode-150/                     ← "neetcode 150" → 45k/mo
│   └── /grind-75/                         ← "grind 75" → 35k/mo
│
├── /faang-prep/                           ← "faang interview preparation" → 80k/mo
│   ├── /4-week-plan/
│   ├── /8-week-plan/
│   └── /12-week-plan/
│
└── /career-switch/                        ← "switch to software engineering" → 30k/mo
    ├── /non-cs-to-sde/
    ├── /frontend-to-backend/
    └── /manual-qa-to-sdet/
```

**Content schema: Roadmap (`/roadmaps/{track}/{level}.json`):**
```json
{
  "slug": "java-backend-intermediate",
  "title": "Java Backend Interview Roadmap — Intermediate (2–5 years)",
  "totalWeeks": 8,
  "hoursPerWeek": 10,
  "weeks": [
    {
      "week": 1,
      "theme": "Core Java Deep Dive",
      "topics": [
        { "name": "Collections Framework Internals", "link": "/java-backend-intermediate/core-java", "hours": 3 },
        { "name": "Concurrency & Multithreading", "link": "/java-backend-intermediate/concurrency", "hours": 4 },
        { "name": "DSA: Arrays & Hashing (10 problems)", "link": "/dsa/pattern/hash-map", "hours": 3 }
      ]
    },
    {
      "week": 2,
      "theme": "Spring Boot Mastery",
      "topics": [
        { "name": "Spring Boot Auto-configuration", "link": "/java-backend-intermediate/spring-boot", "hours": 4 },
        { "name": "Spring Security & OAuth2", "link": "/java-backend-intermediate/spring-security", "hours": 3 },
        { "name": "DSA: Two Pointers & Sliding Window (10 problems)", "link": "/dsa/pattern/two-pointers", "hours": 3 }
      ]
    }
  ],
  "milestones": [
    { "week": 4, "checkpoint": "Can answer any Core Java + Spring question at intermediate level" },
    { "week": 8, "checkpoint": "Ready for full-loop interviews at mid-level Java positions" }
  ]
}
```

---

### HUB 10 — `/cheatsheets/` Full Architecture

**Beats:** DevHints, QuickRef (generic dev cheatsheets — not interview-framed)

**Why we win:** Interview-specific cheatsheets. "What you need to KNOW for the interview" not "all commands ever".

```
/cheatsheets/
├── /java/                                 ← "java interview cheatsheet" → 30k/mo
│   ├── /collections/
│   ├── /concurrency/
│   ├── /streams/
│   ├── /jvm/
│   └── /design-patterns/
│
├── /python/
│   ├── /data-structures/
│   ├── /decorators-generators/
│   ├── /async/
│   └── /testing/
│
├── /sql/                                  ← "sql interview cheatsheet" → 45k/mo
│   ├── /joins/
│   ├── /window-functions/
│   ├── /subqueries/
│   ├── /indexing/
│   └── /query-optimization/
│
├── /system-design/                        ← "system design cheatsheet" → 35k/mo
│   ├── /estimation-numbers/               ← latency, throughput, storage
│   ├── /building-blocks/
│   ├── /template/                         ← the 4-step framework
│   └── /common-patterns/
│
├── /docker/
├── /kubernetes/
├── /git/
├── /linux/
├── /aws/
├── /react/
├── /typescript/
├── /spring-boot/
├── /django/
├── /kafka/
├── /redis/
├── /postgresql/
├── /mongodb/
├── /graphql/
├── /data-structures/                      ← "data structures cheatsheet" → 60k/mo
│   ├── /big-o/
│   ├── /arrays-vs-linked-lists/
│   ├── /trees/
│   ├── /graphs/
│   ├── /heaps/
│   └── /hash-tables/
│
└── /behavioral/                           ← "behavioral interview cheatsheet" → 20k/mo
    ├── /star-method/
    ├── /question-bank/
    └── /company-specific/
```

---

### HUB 11 — `/career/` Full Architecture

**Beats:** Glassdoor career advice (generic), Levels.fyi (compensation only)

**Why we win:** End-to-end interview lifecycle. Resume → Prep → Interview → Negotiate → Accept.
Nobody covers the FULL pipeline with quality content.

```
/career/
├── /resume/                               ← "software engineer resume" → 100k/mo
│   ├── /templates/
│   ├── /action-verbs/
│   ├── /quantifying-impact/
│   └── /ats-optimization/
│
├── /interview-process/                    ← "software engineering interview process" → 40k/mo
│   ├── /phone-screen/
│   ├── /technical-round/
│   ├── /system-design-round/
│   ├── /behavioral-round/
│   ├── /hiring-committee/
│   └── /offer-stage/
│
├── /negotiation/                          ← "salary negotiation software engineer" → 35k/mo
│   ├── /when-to-negotiate/
│   ├── /competing-offers/
│   ├── /equity-rsu-explained/
│   ├── /total-compensation/
│   └── /counter-offer-scripts/
│
├── /company-tiers/                        ← "faang vs startup" → 25k/mo
│   ├── /faang/
│   ├── /tier-2/ (Uber, Airbnb, Stripe)
│   ├── /startups/
│   └── /consulting/
│
└── /transitions/                          ← career switches
    ├── /junior-to-mid/
    ├── /mid-to-senior/
    ├── /ic-to-manager/
    └── /frontend-to-backend/
```

---

### ENHANCED DSA HUB (upgrade to existing HUB 2)

**Beats:** LeetCode (55M), AlgoExpert (2M, paid), HackerRank (8M)

**Key additions beyond the existing plan:**

```
/dsa/
├── /problem/{slug}/                       ← (existing) line-by-line explanations
│
├── /pattern/                              ← (existing) THE SEO WEAPON — expand to 20 patterns
│   ├── /two-pointers/
│   ├── /sliding-window/
│   ├── /hash-map/
│   ├── /binary-search/
│   ├── /fast-slow-pointers/
│   ├── /merge-intervals/
│   ├── /cyclic-sort/
│   ├── /tree-bfs/
│   ├── /tree-dfs/
│   ├── /graph-bfs-dfs/
│   ├── /dynamic-programming/
│   ├── /backtracking/
│   ├── /monotonic-stack/
│   ├── /heap-top-k/
│   ├── /trie/
│   ├── /bit-manipulation/
│   ├── /greedy/                           ← NEW
│   ├── /union-find/                       ← NEW
│   ├── /topological-sort/                 ← NEW
│   └── /prefix-sum/                       ← NEW
│
├── /sheets/                               ← NEW — Curated problem lists
│   ├── /blind-75/                         ← "blind 75 leetcode" → 55k/mo
│   ├── /neetcode-150/                     ← "neetcode 150" → 45k/mo
│   ├── /grind-75/                         ← "grind 75" → 35k/mo
│   ├── /top-100-liked/                    ← "top 100 leetcode" → 40k/mo
│   ├── /amazon-top-50/                    ← company-tagged curated
│   ├── /google-top-50/
│   ├── /meta-top-50/
│   └── /microsoft-top-50/
│
├── /learn/                                ← NEW — Tutorial-style DSA learning
│   ├── /arrays-101/                       ← "learn arrays" → 80k/mo
│   ├── /linked-lists-101/
│   ├── /trees-101/
│   ├── /graphs-101/
│   ├── /dynamic-programming-101/          ← "learn dynamic programming" → 90k/mo
│   ├── /recursion-101/
│   ├── /sorting-algorithms/               ← "sorting algorithms explained" → 70k/mo
│   ├── /searching-algorithms/
│   └── /big-o-notation/                   ← "big o notation explained" → 100k/mo
│
├── /category/                             ← (existing) data structure grouping
│
├── /company/                              ← (existing) company-tagged
│
└── /visualizer/                           ← NEW — Interactive algorithm visualizations
    ├── /sorting/                          ← bubble, merge, quick sort animations
    ├── /tree-traversal/                   ← BFS/DFS step-by-step
    ├── /graph-algorithms/                 ← Dijkstra, BFS, DFS visual
    └── /dp-table/                         ← DP table fill animation
```

**Enhanced DSA Problem schema (additions):**
```json
{
  "...existing fields...",
  "videoExplanation": "/videos/two-sum",
  "hints": [
    { "level": 1, "text": "Think about what operation makes lookup fast" },
    { "level": 2, "text": "For each number, what value would complete the pair?" },
    { "level": 3, "text": "Use a hash map. Key=number, Value=index" }
  ],
  "sheets": ["blind-75", "neetcode-150", "grind-75", "amazon-top-50"],
  "relatedPatterns": ["hash-map", "two-pointers"],
  "testCases": [
    { "input": "[2,7,11,15], target=9", "expected": "[0,1]" },
    { "input": "[3,2,4], target=6", "expected": "[1,2]" },
    { "input": "[3,3], target=6", "expected": "[0,1]", "edgeCase": true }
  ],
  "spaceTimeTradeoff": "O(n) time with O(n) space (hash map) vs O(n²) time with O(1) space (brute force). The hash map is always worth it for interview — interviewer expects O(n)."
}
```

---

### ENHANCED COMPANIES HUB (upgrade to existing HUB 6)

**Beats:** Glassdoor (30M, user-noise), Blind (unstructured)

```
/companies/
├── /amazon/
│   ├── /overview/                         ← process, timeline, levels (L4-L7)
│   ├── /dsa/                              ← top 50 Amazon DSA problems
│   ├── /system-design/                    ← Amazon-specific SD (S3, DynamoDB, SQS)
│   ├── /behavioral/                       ← 14 Leadership Principles deep-dive
│   ├── /compensation/                     ← TC breakdown, RSU vesting
│   └── /tips/                             ← recruiter tips, Bar Raiser, loop structure
│
├── /google/
│   ├── /overview/
│   ├── /dsa/                              ← Google-hard DSA + phone screen
│   ├── /system-design/                    ← Google-scale SD (Search, Maps, YouTube)
│   ├── /behavioral/                       ← Googleyness + Leadership
│   ├── /compensation/
│   └── /tips/                             ← hiring committee, team matching
│
├── /microsoft/
├── /meta/
├── /apple/
├── /netflix/
├── /uber/
├── /airbnb/
├── /stripe/
├── /salesforce/
├── /oracle/
├── /adobe/
├── /linkedin/
├── /twitter/
├── /spotify/
├── /walmart-labs/
├── /jpmorgan/
├── /goldman-sachs/
├── /flipkart/                             ← Indian market (huge traffic)
├── /paytm/
├── /razorpay/
├── /swiggy/
├── /zerodha/
│
└── /by-type/
    ├── /faang/                            ← aggregate FAANG prep guide
    ├── /unicorns/                         ← high-growth startups
    ├── /banks/                            ← finance/fintech interview style
    └── /indian-startups/                  ← Indian tech companies
```

---

### CROSS-HUB LINKING STRATEGY

Every independent hub links INTO interview Q&A and vice versa:

```
/system-design/problems/design-url-shortener
  → links to: /java-backend-intermediate/system-design (Java-specific SD questions)
  → links to: /tools/redis (caching deep-dive)
  → links to: /topics/caching (concept explainer)
  → links to: /companies/amazon/system-design (Amazon asks this)

/dsa/problem/two-sum
  → links to: /dsa/pattern/hash-map (pattern page)
  → links to: /dsa/sheets/blind-75 (part of this sheet)
  → links to: /companies/amazon/dsa (Amazon frequency: high)
  → links to: /roadmaps/dsa/blind-75 (week 1 of study plan)

/behavioral/questions/leadership
  → links to: /behavioral/company-specific/amazon-leadership-principles
  → links to: /companies/amazon/behavioral
  → links to: /roadmaps/faang-prep/8-week-plan (week 7: behavioral prep)

/cheatsheets/system-design/estimation-numbers
  → links to: /system-design/fundamentals/scalability
  → links to: /system-design/problems/ (every problem uses these numbers)

/career/negotiation/competing-offers
  → links to: /companies/{company}/compensation
  → links to: /career/company-tiers/faang
```

This creates a **content web** — every page has 5-10 internal links to other hubs.
Google rewards deep internal linking. Users stay longer. Both rank higher.

---

## UI ARCHITECTURE — THE DUAL-MODE PLATFORM

> The fundamental insight: **Standalone hubs are the TOP OF FUNNEL (SEO traffic).**
> **Domain-based interview prep is the CORE PRODUCT (conversion + retention).**
> Both serve the SAME content but in different frames. Write once, serve twice.

### The Two User Journeys

```
JOURNEY 1: SEO/ORGANIC (anonymous user)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Google: "design url shortener system design"
  → Lands on /system-design/problems/design-url-shortener
  → Full content visible (no paywall, no login wall)
  → Sees CTA sidebar: "This is part of Java Backend Intermediate prep"
  → Sees: "Get your complete interview path → Sign up free"
  → Signs up → Selects domain → Enters JOURNEY 2

JOURNEY 2: DOMAIN PREP (logged-in user)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User selected: "Java Backend Intermediate"
  → Dashboard shows ALL prep organized by category:
     ├── Interview Q&A (46 stacks, 400+ questions)
     ├── System Design (25 problems, leveled)
     ├── DSA Practice (Blind 75 or recommended set)
     ├── Behavioral Prep (10 categories, 50 questions)
     ├── Tools Deep Dive (Docker, Kafka, AWS, etc.)
     └── Your Roadmap (8-week personalized plan)
  → Progress tracking across all sections
  → Every item links to the same standalone page BUT with domain context
```

### The Brilliant Part: Same Content, Two Frames

The SAME JSON content file appears on TWO URL paths:

```
STANDALONE (SEO-indexed, public, canonical):
/system-design/problems/design-url-shortener
  → Full page with its own navigation, breadcrumb, related content
  → Canonical URL (gets all SEO juice)
  → CTA: "Part of: Java Backend, Python Backend, Go Backend prep"

DOMAIN-INTEGRATED (logged-in, contextual):
/java-backend-intermediate → Dashboard card links to the standalone page
  → BUT with a persistent domain breadcrumb:
     "Your Prep > Java Backend Intermediate > System Design > Design URL Shortener"
  → Progress is tracked against the user's domain
  → "Next in your path" shows the next system design problem
```

**Why this is genius for SEO:**
- No duplicate content penalty (standalone = canonical, domain links TO it)
- Standalone pages rank for specific keywords ("design url shortener")
- Domain dashboard is behind login (not indexed, no competition)
- Internal links from standalone → domain landing pages boost those too

---

### Global Navigation Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo] InterviewExplainer                                                    │
│                                                                              │
│  Interview Prep ▾  │  Learn ▾  │  Practice ▾  │  Companies ▾  │  [Login]    │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Interview Prep** (THE CORE PRODUCT — always highlighted):
```
┌─────────────────────────────────────────────┐
│ 🎯 Start Your Prep Path                     │  ← Opens selection wizard
│─────────────────────────────────────────────│
│ 📋 All Learning Paths                       │  ← /domains
│ 📊 My Dashboard                             │  ← /dashboard (logged in)
│ 🗺️ My Roadmap                               │  ← /roadmaps/{user-domain}
│─────────────────────────────────────────────│
│ By Language:                                │
│   Java • Python • JavaScript • TypeScript   │
│   Go • Kotlin • C# • Ruby                  │
│ By Role:                                    │
│   Backend • Frontend • Fullstack • Android  │
│   DevOps • Data Engineering • ML/AI         │
│   Data Analyst • Business Analyst           │
└─────────────────────────────────────────────┘
```

**Learn** (STANDALONE HUBS — SEO magnets):
```
┌─────────────────────────────────────────────┐
│ 🏗️ System Design                            │  ← /system-design
│    Fundamentals • Building Blocks           │
│    25 Real Problems • Case Studies          │
│─────────────────────────────────────────────│
│ 🧠 Behavioral Interview                     │  ← /behavioral
│    STAR Method • Question Bank              │
│    Amazon LPs • Company-Specific            │
│─────────────────────────────────────────────│
│ 📖 Topics & Concepts                        │  ← /topics
│    Microservices • Databases • Caching      │
│    Distributed Systems • API Design         │
│─────────────────────────────────────────────│
│ ⚡ Cheatsheets                               │  ← /cheatsheets
│    Java • Python • SQL • System Design      │
│─────────────────────────────────────────────│
│ 🛤️ Roadmaps & Study Plans                   │  ← /roadmaps
│    FAANG 8-Week Plan • DSA Plans            │
│─────────────────────────────────────────────│
│ 💼 Career Guide                              │  ← /career
│    Resume • Negotiation • Interview Process │
└─────────────────────────────────────────────┘
```

**Practice** (STANDALONE HUBS — hands-on):
```
┌─────────────────────────────────────────────┐
│ 💻 DSA Problems                              │  ← /dsa
│    By Pattern (20) • By Category (9)        │
│    Curated Sheets: Blind 75, NeetCode 150   │
│    Learn DSA: Arrays 101, Trees 101, DP 101 │
│─────────────────────────────────────────────│
│ 🔧 Tools Deep Dive                          │  ← /tools
│    Docker • Kafka • Redis • AWS • K8s       │
│─────────────────────────────────────────────│
│ ⚖️ Compare (X vs Y)                          │  ← /compare
│    Kafka vs RabbitMQ • SQL vs NoSQL         │
│─────────────────────────────────────────────│
│ 🎙️ Mock Interviews                          │  ← /mock-interviews
└─────────────────────────────────────────────┘
```

**Companies:**
```
┌─────────────────────────────────────────────┐
│ 🏢 Company Prep                              │
│    FAANG: Amazon • Google • Microsoft       │
│           Meta • Apple • Netflix            │
│    Unicorns: Uber • Airbnb • Stripe         │
│    India: Flipkart • Razorpay • Swiggy      │
│    Finance: JPMorgan • Goldman Sachs        │
└─────────────────────────────────────────────┘
```

---

### Homepage Layout — The Conversion Machine

```
┌──────────────────────────────────────────────────────────────────┐
│                         HERO SECTION                             │
│                                                                  │
│  "Master Every Technical Interview"                              │
│  "The only platform with DSA + System Design + Q&A              │
│   + Behavioral — free, experience-leveled, all languages."       │
│                                                                  │
│  [Start Your Prep Path →]   [Browse All Content]                │
│                                                                  │
│  Trusted by engineers from: [Amazon] [Google] [Microsoft] ...   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    WHAT'S INSIDE (6 pillars)                     │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ Interview │ │ System   │ │ DSA      │                        │
│  │ Q&A      │ │ Design   │ │ Problems │                        │
│  │ 400+ Qs  │ │ 25 Probs │ │ 450+     │                        │
│  │ 11 langs │ │ 3 levels │ │ Patterns │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ Behavioral│ │ Company  │ │ Career   │                        │
│  │ STAR+LP  │ │ 22 cos   │ │ Resume + │                        │
│  │ 50+ Qs   │ │ FAANG+   │ │ Negotiate│                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    HOW IT WORKS (USP section)                    │
│                                                                  │
│  1. SELECT YOUR DOMAIN                                           │
│     Pick language + track + experience level                     │
│     (e.g., Java Backend Intermediate)                            │
│                                                                  │
│  2. GET YOUR COMPLETE PREP                                       │
│     One dashboard with Q&A + System Design + DSA                │
│     + Behavioral + Tools + Roadmap — all integrated              │
│                                                                  │
│  3. TRACK YOUR PROGRESS                                          │
│     See completion %, identify gaps, follow your roadmap         │
│                                                                  │
│  [Start Free → Select Your Domain]                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    POPULAR STANDALONE SECTIONS                   │
│        (SEO bait — drives organic traffic to platform)           │
│                                                                  │
│  🏗️ System Design Problems          💻 DSA by Pattern            │
│  • Design URL Shortener            • Two Pointers (15 probs)   │
│  • Design Chat System              • Sliding Window (12 probs) │
│  • Design Uber                     • Dynamic Programming       │
│  [See all 25 →]                    [See all 450+ →]            │
│                                                                  │
│  🧠 Behavioral Interview            📋 Curated Sheets            │
│  • Amazon Leadership Principles    • Blind 75                   │
│  • Tell me about a time you failed • NeetCode 150              │
│  • STAR Method Guide               • Grind 75                   │
│  [See all →]                       [See all sheets →]          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    SELECT YOUR LANGUAGE                           │
│                                                                  │
│  [Java] [Python] [JavaScript] [TypeScript] [Go] [Kotlin]        │
│  [C#] [Ruby] [DevOps] [Data Analyst] [Business Analyst]         │
│                                                                  │
│  → Each card shows: X live paths, Y questions, Z stacks         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    VS THE COMPETITION                            │
│        (social proof — why IE beats LeetCode, Baeldung, etc.)    │
│                                                                  │
│  Feature          │ IE  │ LeetCode │ Baeldung │ ByteByteGo      │
│  ─────────────────┼─────┼──────────┼──────────┼──────────────    │
│  Interview Q&A    │ ✅  │    ❌    │   ✅     │    ❌            │
│  DSA Explanations │ ✅  │    ❌    │   ❌     │    ❌            │
│  System Design    │ ✅  │    ❌    │   ❌     │    ✅            │
│  Behavioral       │ ✅  │    ❌    │   ❌     │    ❌            │
│  Experience Levels│ ✅  │    ❌    │   ❌     │    ❌            │
│  Company Prep     │ ✅  │    ❌    │   ❌     │    ❌            │
│  Free             │ ✅  │ Partial  │   ✅     │    ❌            │
│  All Languages    │ ✅  │    ✅    │   ❌     │    ❌            │
└──────────────────────────────────────────────────────────────────┘
```

---

### Domain Dashboard Layout (Logged-in User)

The killer feature. User selects "Java Backend Intermediate" → gets ONE dashboard
with EVERYTHING they need. No jumping between sites.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Domains                                              │
│                                                                  │
│  ☕ Java Backend — Intermediate (2–5 years)                      │
│  Overall Progress: ████████░░░░░░░░░░ 45% (180/400)            │
│                                                                  │
│  [Continue Where You Left Off →]                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  TAB BAR:                                                        │
│  [📚 Q&A Stacks] [🏗️ System Design] [💻 DSA] [🧠 Behavioral]   │
│  [🔧 Tools] [🗺️ Roadmap]                                        │
└──────────────────────────────────────────────────────────────────┘

── TAB: Q&A Stacks (existing domain page stacks) ──────────────────
│ Core Java         ████████░░ 80%  22/28 Qs                      │
│ Spring Boot       ████░░░░░░ 40%  24/60 Qs                      │
│ Spring Security   ██░░░░░░░░ 20%  5/24 Qs                       │
│ PostgreSQL        ██░░░░░░░░ 15%  4/26 Qs                       │
│ Docker            ░░░░░░░░░░  0%  0/12 Qs                       │
│ ... 41 more stacks                                               │

── TAB: System Design ─────────────────────────────────────────────
│ 25 problems • Your level: Intermediate                          │
│                                                                  │
│ ✅ Design URL Shortener          Medium   Completed             │
│ 📖 Design Rate Limiter           Medium   In Progress           │
│ ⬜ Design Chat System            Hard     Not Started           │
│ ⬜ Design News Feed              Hard     Not Started           │
│ ...                                                              │
│                                                                  │
│ Each problem links to → /system-design/problems/{slug}          │
│ (same standalone page, but breadcrumb shows domain context)      │

── TAB: DSA ───────────────────────────────────────────────────────
│ Recommended for Java Backend:                                    │
│                                                                  │
│ 📋 Blind 75          ████░░░░ 12/75 solved                      │
│ 📋 Amazon Top 50     ██░░░░░░  8/50 solved                      │
│                                                                  │
│ By Pattern:                                                      │
│ Hash Map        ████████░░ 8/10   Two Pointers    ████░░░░ 4/12 │
│ Sliding Window  ██░░░░░░░░ 3/12   Binary Search   ░░░░░░░░ 0/8  │
│ Trees           ██░░░░░░░░ 2/15   Dynamic Prog    ░░░░░░░░ 0/12 │
│                                                                  │
│ Each problem links to → /dsa/problem/{slug}                     │

── TAB: Behavioral ────────────────────────────────────────────────
│ 10 categories • 50 questions                                    │
│                                                                  │
│ ✅ STAR Method Guide            Read                            │
│ 📖 Leadership                   5/12 done                       │
│ ⬜ Conflict Resolution          0/8                             │
│ ⬜ Failure & Learning           0/6                             │
│ ⬜ Amazon Leadership Principles 0/14                            │
│                                                                  │
│ Each question links to → /behavioral/questions/{category}/{slug}│

── TAB: Tools ─────────────────────────────────────────────────────
│ Tools relevant to Java Backend:                                 │
│                                                                  │
│ Docker         12 Qs  │  Kafka      5 Qs  │  Redis     18 Qs   │
│ Kubernetes     8 Qs   │  AWS       31 Qs  │  PostgreSQL 26 Qs  │
│ Jenkins        6 Qs   │  Git       12 Qs  │  Maven     12 Qs   │
│                                                                  │
│ Each tool links to → /tools/{slug}                              │

── TAB: Roadmap ───────────────────────────────────────────────────
│ Java Backend Intermediate — 8-Week Study Plan                   │
│                                                                  │
│ Week 1: Core Java Deep Dive              ✅ Complete            │
│ Week 2: Spring Boot Mastery              📖 In Progress        │
│ Week 3: Database & SQL                   ⬜ Upcoming           │
│ Week 4: System Design Fundamentals       ⬜ Upcoming           │
│ Week 5: Microservices & Architecture     ⬜ Upcoming           │
│ Week 6: DSA Sprint (Blind 75 first 40)   ⬜ Upcoming           │
│ Week 7: Behavioral + Company Prep        ⬜ Upcoming           │
│ Week 8: Mock Interviews + Review         ⬜ Upcoming           │
│                                                                  │
│ Links to → /roadmaps/java-backend/intermediate                  │
```

---

### Standalone Hub Page Layout (Public, SEO-indexed)

Every standalone page follows this template for maximum SEO + conversion:

```
┌──────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > System Design > Problems > Design URL Short. │
│                                                                  │
│ ┌──────────────────────────────────┐ ┌────────────────────────┐ │
│ │                                  │ │ SIDEBAR                │ │
│ │     MAIN CONTENT                 │ │                        │ │
│ │                                  │ │ 📋 Part of your prep: │ │
│ │  Full problem/question content   │ │ • Java Backend Inter.  │ │
│ │  visible to everyone             │ │ • Python Backend Inter.│ │
│ │  (no login wall)                 │ │ • Go Backend Inter.    │ │
│ │                                  │ │                        │ │
│ │  Experience level tabs:          │ │ [Select your domain →] │ │
│ │  [Beginner] [Intermediate] [Adv] │ │                        │ │
│ │                                  │ │ ────────────────────── │ │
│ │  Full content at selected level  │ │ 📌 Related Content:   │ │
│ │                                  │ │ • /topics/caching      │ │
│ │                                  │ │ • /tools/redis         │ │
│ │                                  │ │ • /compare/sql-vs-nosql│ │
│ │                                  │ │ • /dsa/pattern/hash-map│ │
│ │                                  │ │                        │ │
│ │                                  │ │ ────────────────────── │ │
│ │                                  │ │ 🏢 Asked at:          │ │
│ │                                  │ │ Amazon • Google • Uber │ │
│ │                                  │ │                        │ │
│ │                                  │ │ ────────────────────── │ │
│ │                                  │ │ 🎯 Login CTA:        │ │
│ │                                  │ │ "Track your progress"  │ │
│ │                                  │ │ "Get personalized      │ │
│ │                                  │ │  roadmap & prep plan"  │ │
│ │                                  │ │ [Sign up free →]       │ │
│ └──────────────────────────────────┘ └────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ BOTTOM: Related Problems / Questions                        │ │
│ │ People also study: Design Rate Limiter • Design Chat System │ │
│ │ Also in pattern: Hash Map problems • Two Pointers problems  │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

### CTA Strategy — Converting Anonymous to Logged-in

Every standalone page has **3 conversion points** (non-intrusive, value-driven):

```
1. SIDEBAR CTA (always visible):
   "This is part of Java Backend Intermediate prep.
    Get your complete path with 400+ questions, roadmap, and progress tracking."
   [Start Free →]

2. MID-CONTENT CTA (after 40% scroll):
   "💡 Enjoying this? Get a personalized study plan.
    Select your domain → Get a complete interview prep dashboard."
   [Select Your Domain →]

3. BOTTOM CTA (after content):
   "Ready to ace your interview?
    Join 50,000+ engineers preparing with InterviewExplainer.
    Complete prep: Q&A + System Design + DSA + Behavioral — all free."
   [Sign Up & Start Preparing →]
```

**The rule:** NEVER gate content. Show everything free. Convert on VALUE
(progress tracking, personalized roadmap, dashboard). This is how
freeCodeCamp, Dev.to, and Stack Overflow built massive audiences.

---

### URL Architecture — Clean, SEO-Optimized

```
STANDALONE (public, indexed):
/system-design/                               ← hub landing
/system-design/fundamentals/caching           ← concept page
/system-design/problems/design-url-shortener  ← problem page
/system-design/case-studies/how-netflix-works  ← case study
/dsa/                                         ← hub landing
/dsa/problem/two-sum                          ← problem page
/dsa/pattern/two-pointers                     ← pattern page
/dsa/sheets/blind-75                          ← curated sheet
/dsa/learn/dynamic-programming-101            ← tutorial
/behavioral/                                  ← hub landing
/behavioral/questions/leadership              ← question category
/behavioral/company-specific/amazon-lps       ← company behavioral
/tools/kafka                                  ← tool page
/compare/kafka-vs-rabbitmq                    ← comparison
/companies/amazon                             ← company prep
/cheatsheets/java                             ← cheatsheet
/roadmaps/java-backend/intermediate           ← roadmap
/career/negotiation/competing-offers          ← career guide

DOMAIN PREP (primary product):
/domains                                      ← all domains browser
/{domainSlug}                                 ← domain dashboard
/{domainSlug}/{stackSlug}                     ← stack questions
/{domainSlug}/{stackSlug}/{questionSlug}      ← individual Q&A

PLATFORM:
/dashboard                                    ← user's personal dashboard
/login, /signup                               ← auth
/profile                                      ← user settings
/search                                       ← global search
```

---

### The SEO Flywheel

```
PHASE 1: STANDALONE HUBS RANK
"design url shortener" → /system-design/problems/design-url-shortener
"two sum leetcode solution" → /dsa/problem/two-sum
"kafka vs rabbitmq" → /compare/kafka-vs-rabbitmq
"amazon leadership principles interview" → /behavioral/company-specific/amazon-lps
"java interview questions" → /domains?language=Java

PHASE 2: INTERNAL LINKS BOOST EVERYTHING
System Design page links to → Topics, Tools, Compare, Companies, Interview Q&A
DSA page links to → Patterns, Sheets, Companies, Roadmaps
Each page has 5-10 internal links → Google sees deep content graph

PHASE 3: DOMAIN PAGES RANK FOR HIGH-INTENT
"java backend interview questions intermediate" → /java-backend-intermediate
"spring boot interview questions" → /java-backend-intermediate/spring-boot
"python django interview questions" → /python-backend-intermediate/django

PHASE 4: COMPOUND GROWTH
More standalone pages → More SEO traffic → More signups → More domain users
More domain users → More content engagement → Better rankings → More traffic
→ FLYWHEEL
```

---

## CONTENT FILE SYSTEM ARCHITECTURE

```
content/
│
├── interview/                         ← Q&A content (NEW canonical location)
│   └── {lang}/
│       └── {track}/
│           └── {level}/               ← beginner | intermediate | advanced
│               └── {stack}/
│                   ├── _config.json   ← stack metadata (name, icon, order, tags)
│                   └── {subcategory}/
│                       ├── _config.json
│                       ├── questions.json      ← TOC (slug list)
│                       └── complete-qa.json    ← full Q&A content
│
├── dsa/                               ← DSA problems
│   ├── _index.json
│   ├── sheets/                        ← curated lists (blind-75.json, etc.)
│   ├── learn/                         ← tutorial content
│   └── {category}/
│       └── {slug}.json                ← individual problem
│
├── system-design/                     ← System Design content
│   ├── fundamentals/
│   │   └── {slug}.json
│   ├── building-blocks/
│   │   └── {slug}.json
│   ├── problems/
│   │   └── {slug}.json
│   └── case-studies/
│       └── {slug}.json
│
├── behavioral/                        ← Behavioral interview content
│   ├── questions/
│   │   └── {category}/{slug}.json
│   ├── company-specific/
│   │   └── {company}/{slug}.json
│   └── star-method/
│       └── {slug}.json
│
├── roadmaps/                          ← Study plans
│   └── {track}/{level}.json
│
├── cheatsheets/                       ← Quick reference
│   └── {topic}/{slug}.json
│
├── career/                            ← Career guidance
│   └── {category}/{slug}.json
│
├── compare/                           ← X vs Y content
│   └── {slug}.json
│
├── topics/                            ← Concept hub content
│   └── {slug}.json
│
├── companies/                         ← Company-specific content
│   └── {company}/
│       ├── overview.json
│       ├── dsa-patterns.json
│       ├── system-design.json
│       ├── behavioral.json
│       ├── compensation.json
│       └── tips.json
│
└── shared/                            ← Reusable cross-track content
    ├── architecture/
    ├── behavioral/
    ├── data/
    ├── frontend/
    └── tools/
```

---

## COMPLETE CONTENT SCHEMAS

### Schema 1: Q&A (`complete-qa.json`)

```json
{
  "topic": "Kafka Producers",
  "topicSlug": "kafka-producers",
  "lang": "java",
  "track": "backend",
  "level": "intermediate",
  "stack": "kafka",
  "subcategory": "producers",
  "version": "2",
  "lastUpdated": "2025-04",
  "questions": [
    {
      "id": "kafka-producers-acks",
      "slug": "kafka-producers-acks-delivery-guarantees",
      "title": "Kafka Producer Acknowledgments",
      "question": "How do Kafka producer acks work and what are the trade-offs between acks=0, 1, and all?",
      "difficulty": "medium",
      "importance": "critical",
      "tags": ["kafka", "distributed-systems", "messaging", "reliability"],
      "companies": ["linkedin", "uber", "netflix"],
      "relatedToolPage": "/tools/kafka/",
      "relatedTopicPage": "/topics/distributed-systems/",
      "answer": {
        "sections": [
          { "type": "interviewer_expectation", "content": "..." },
          { "type": "speakable_answer", "content": "..." },
          { "type": "deep_explanation", "content": "..." },
          { "type": "important_points", "content": "..." },
          { "type": "practice_prompt", "content": "..." },
          { "type": "followup_questions", "questions": [...] }
        ]
      },
      "seo": {
        "metaTitle": "Kafka Producer Acks | Java Backend Intermediate | InterviewExplainer",
        "metaDescription": "...",
        "canonicalUrl": "/interview/java/backend/intermediate/kafka/kafka-producers-acks-delivery-guarantees"
      }
    }
  ]
}
```

### Schema 2: DSA Problem (`/dsa/{category}/{slug}.json`)

```json
{
  "id": "two-sum",
  "slug": "two-sum",
  "title": "Two Sum",
  "leetcodeNumber": 1,
  "difficulty": "easy",
  "category": "arrays",
  "patterns": ["hash-map"],
  "companies": ["amazon", "google", "microsoft", "meta"],
  "frequency": "very-high",
  "problemStatement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "constraints": ["2 ≤ nums.length ≤ 10⁴"],
  "examples": [
    { "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] = 9" }
  ],
  "howToThink": "When you see 'find two numbers that sum to X', ask: for each number, what do I need? The complement: target - num. Can I look it up O(1)? Yes — hash map.",
  "approaches": [
    {
      "name": "Brute Force",
      "order": 1,
      "whenToMention": "Always say this first — shows structured thinking. Then say you can do better.",
      "complexity": { "time": "O(n²)", "space": "O(1)" },
      "explanation": "Try every pair of elements. Check if they sum to target.",
      "code": {
        "java": "for (int i = 0; i < nums.length; i++) {\n  for (int j = i + 1; j < nums.length; j++) {\n    if (nums[i] + nums[j] == target) return new int[]{i, j};\n  }\n}",
        "python": "for i in range(len(nums)):\n  for j in range(i+1, len(nums)):\n    if nums[i] + nums[j] == target:\n      return [i, j]",
        "javascript": "for (let i = 0; i < nums.length; i++)\n  for (let j = i+1; j < nums.length; j++)\n    if (nums[i] + nums[j] === target) return [i, j];"
      },
      "lineByLine": {
        "java": [
          { "line": "for (int i = 0; i < nums.length; i++)", "explanation": "Outer loop: pick the first number of our pair" },
          { "line": "for (int j = i + 1; ...)", "explanation": "j starts at i+1 — prevents using same element twice" },
          { "line": "return new int[]{i, j};", "explanation": "Return INDICES not values — this is a common mistake" }
        ]
      }
    },
    {
      "name": "Hash Map — One Pass (Optimal)",
      "order": 2,
      "whenToMention": "This is the answer they want. Say: 'One pass with O(n) time using a hash map.'",
      "complexity": { "time": "O(n)", "space": "O(n)" },
      "explanation": "As we iterate, check if complement is in map. If yes — found. If no — add current.",
      "code": {
        "java": "Map<Integer, Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n  int complement = target - nums[i];\n  if (map.containsKey(complement)) return new int[]{map.get(complement), i};\n  map.put(nums[i], i);\n}",
        "python": "seen = {}\nfor i, num in enumerate(nums):\n  complement = target - num\n  if complement in seen:\n    return [seen[complement], i]\n  seen[num] = i",
        "javascript": "const map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const comp = target - nums[i];\n  if (map.has(comp)) return [map.get(comp), i];\n  map.set(nums[i], i);\n}"
      },
      "lineByLine": {
        "java": [
          { "line": "Map<Integer, Integer> map = new HashMap<>();", "explanation": "Stores number → its index. Key=number, Value=index." },
          { "line": "int complement = target - nums[i];", "explanation": "The number we NEED. If this is in the map, we're done." },
          { "line": "if (map.containsKey(complement))", "explanation": "O(1) lookup — has complement been seen before?" },
          { "line": "return new int[]{map.get(complement), i};", "explanation": "Return complement's index and current index." },
          { "line": "map.put(nums[i], i);", "explanation": "Complement not found yet. Store for future iterations." }
        ]
      }
    }
  ],
  "interviewVoice": "I'd start with brute force — check every pair, O(n²). But we can do better. For each number, I know exactly what I need: the complement, target minus current. I store seen values in a hash map. One pass, O(n) time. Trade-off is O(n) space for the map — worth it.",
  "commonMistakes": [
    "Returning values (2,7) instead of indices (0,1) — always re-read the output requirement",
    "Using j=0 instead of j=i+1 in brute force — causes using same element twice",
    "What if nums=[3,3], target=6? Hash map handles this — check BEFORE inserting."
  ],
  "patternNote": "This is the canonical Hash Map pattern. See it again in: Contains Duplicate (LC 217), Group Anagrams (LC 49), Top K Frequent (LC 347).",
  "followupVariations": [
    { "leetcodeNumber": 167, "title": "Two Sum II (Sorted Array)", "slug": "two-sum-ii", "hint": "Sorted — use two pointers, O(1) space" },
    { "leetcodeNumber": 15, "title": "3Sum", "slug": "three-sum", "hint": "Fix one, two-pointer the rest" }
  ]
}
```

### Schema 3: Comparison (`/compare/{slug}.json`)

```json
{
  "slug": "kafka-vs-rabbitmq",
  "title": "Kafka vs RabbitMQ",
  "h1": "Kafka vs RabbitMQ — How to Answer in an Interview",
  "intro": "When an interviewer asks you to compare Kafka and RabbitMQ, they're testing whether you understand distributed messaging trade-offs.",
  "summary": "Kafka is a distributed log — high throughput, replay, multiple consumers. RabbitMQ is a message broker — complex routing, lower latency, task queues.",
  "whenToUse": {
    "a": { "name": "Kafka", "conditions": ["High-throughput event streaming", "Audit logs / replay needed", "Multiple consumer groups", "Event sourcing / CQRS"] },
    "b": { "name": "RabbitMQ", "conditions": ["Task queues / work distribution", "Complex routing (topic/fanout/direct)", "Lower latency needed", "Request-reply patterns"] }
  },
  "comparison": [
    { "aspect": "Message Persistence", "a": "Log-based, configurable retention (days/size)", "b": "Queue — deleted after consumption by default" },
    { "aspect": "Throughput", "a": "Millions/sec — designed for streaming", "b": "Thousands/sec — designed for reliability" },
    { "aspect": "Consumer Model", "a": "Pull — consumers control offset position", "b": "Push — broker delivers to consumers" },
    { "aspect": "Routing", "a": "Topic + partition only", "b": "Exchanges: direct, fanout, topic, headers" },
    { "aspect": "Replay", "a": "Built-in — seek to any offset", "b": "Not supported natively" }
  ],
  "interviewTips": [
    "Lead with use case: 'Kafka for streaming/replay, RabbitMQ for task queues/routing'",
    "Mention the pull vs push model — this is a key architectural difference most miss",
    "If they ask about ordering: Kafka guarantees per-partition, RabbitMQ per-queue"
  ],
  "relatedTools": ["kafka", "rabbitmq"],
  "relatedComparisons": ["sync-vs-async", "rest-vs-graphql"]
}
```

---

## CONTENT REUSE SYSTEM

### Cross-Language Reuse (`$ref`)

Same concept, different language code:

```json
{
  "$ref": "/interview/java/backend/intermediate/kafka/producers/complete-qa.json#kafka-producers-acks",
  "overrides": {
    "seo": { "metaTitle": "Kafka Producer Acks | Python Backend | InterviewExplainer" },
    "answer": {
      "sections": [{
        "type": "deep_explanation",
        "replaceSection": true,
        "content": "...Python kafka-python / confluent-kafka code..."
      }]
    }
  }
}
```

### Cross-Level Reuse

```json
{
  "$ref": "/interview/java/backend/beginner/kafka/producers/complete-qa.json#kafka-producers-acks",
  "overrides": {
    "difficulty": "hard",
    "answer": { "sections": [{ "type": "deep_explanation", "replaceSection": true, "content": "...idempotent producers, exactly-once semantics..." }] }
  }
}
```

### DSA to Interview Track Reuse

```json
{
  "$includeDSA": "/dsa/arrays/two-sum.json",
  "trackContext": "java",
  "interviewContext": "In Java interviews, follow-up is: 'What's HashMap.get() complexity?' — Amortized O(1), worst O(n) due to hash collision."
}
```

---

## SEO TECHNICAL ARCHITECTURE

### JSON-LD Per Page Type

**Question page:** `FAQPage` + `BreadcrumbList` + `Article`
**DSA problem page:** `TechArticle` + `FAQPage` + `BreadcrumbList`
**Compare page:** `FAQPage` + `Article` + `BreadcrumbList`
**Hub pages:** `WebPage` + `BreadcrumbList`

### Meta Formula (Max 60 chars title, 155 chars desc)

```
Question:  "{Question Title} | {Stack} {Level} Interview | InterviewExplainer"
Stack hub: "{Lang} {Track} {Level} Interview Questions — {Stack} | InterviewExplainer"
DSA:       "{Problem Title} — Line by Line | Java Python | InterviewExplainer"
Compare:   "{A} vs {B} — Interview Answer | InterviewExplainer"
Topic:     "{Topic} Interview Questions — All Languages | InterviewExplainer"
Company:   "{Company} Interview Prep — DSA, System Design | InterviewExplainer"
```

### Sitemap Architecture (Split by Hub)

```
/sitemap.xml                     ← sitemap index file
  /sitemap-hub.xml               ← all hub/index pages (priority 0.9–1.0)
  /sitemap-java.xml              ← all java question pages (priority 0.6)
  /sitemap-python.xml            ← all python question pages (priority 0.6)
  /sitemap-javascript.xml        ← all JS question pages (priority 0.6)
  /sitemap-dsa.xml               ← all DSA problem pages (priority 0.7)
  /sitemap-tools.xml             ← all /tools/ pages (priority 0.8)
  /sitemap-topics.xml            ← all /topics/ pages (priority 0.8)
  /sitemap-compare.xml           ← all /compare/ pages (priority 0.8)
  /sitemap-companies.xml         ← all /companies/ pages (priority 0.9)
```

---

## SCALABILITY TO OTHER LANGUAGES

The architecture is language-agnostic by design. Adding Go means:

```
1. Create content/interview/go/backend/beginner|intermediate|advanced/
2. Reuse tool content (Docker, Kubernetes, gRPC) via $ref from Java/Python
3. Go-specific stacks: goroutines, channels, interfaces, error-handling, context
4. All URLs, schemas, SEO patterns identical — no frontend code changes
```

Future languages: Go, Kotlin, Rust, C#, Scala, Swift, Ruby, PHP — all pluggable.

---

## PHILOSOPHY — HOW WE WRITE CONTENT

### The North Star
> Every question page is a **mini-article by a senior engineer** — not a textbook, not a Stack Overflow dump. It reads like a smart colleague explaining something over coffee.

### The Three Laws
1. **Never show three answers on one page.** One question. One answer. The right one for the viewer's experience level. Default = intermediate.
2. **Code is proof, not explanation.** Write the explanation first. Add code only to prove a point already made in prose.
3. **Every answer must survive the "random reader test."** Someone stumbles in from Google, reads the answer without context — and leaves knowing something real.

### Experience Level Rules

| Level | Years | Speakable Answer | Deep Explanation | Code |
|---|---|---|---|---|
| Beginner | 0–2 yrs | 250 words | What + Why. Simple code. No perf trade-offs. | 5–10 line snippets |
| Intermediate | 2–5 yrs | 300–350 words | How it works under the hood. Production patterns. | Real framework patterns |
| Advanced | 5+ yrs | 350–400 words | Failure modes, scale, alternatives, architecture decisions. | Full system snippets |

---

## THE 10 RULES WE NEVER BREAK

1. **One answer per experience level.** Never show three answers on one page.
2. **Default is always intermediate.** Non-logged-in users see intermediate content.
3. **Code needs prose before it.** Never orphan a code block without explanation.
4. **Start with a sentence.** Every section opens with prose, never a heading or code block.
5. **SEO is architecture.** Every URL, every h1, every meta tag is a deliberate decision.
6. **The `question` field is a real interview question.** A sentence with "?" or implied question.
7. **Canonical URL on every page.** No exceptions.
8. **Reuse before duplicating.** Use `$ref` if content already exists in another level/lang.
9. **Every new stack needs questions before answers.** Build the TOC first.
10. **Quality over quantity.** One great answer beats ten shallow ones. Always.

---

## IMPLEMENTATION ROADMAP

### Sprint 1 — Foundation ✅ DONE
- Fix all broken JSON files
- Fix sitemap (include all question pages)
- Add JSON-LD to question pages
- Fix canonical URLs
- Fix meta title formula
- Fix AnswerSectionType union
- Fix _subcatCache bug
- Add practice_prompt renderer

### Sprint 2 — URL Architecture ✅ DONE
- /interview/{lang}/{track}/{level}/{stack}/{slug} route hierarchy
- 301 redirects from old URLs (middleware.ts)
- Experience-level routing (default intermediate)
- Hub pages: /interview/, /interview/[lang], /interview/[lang]/[track]

### Sprint 3 — New Hubs ✅ DONE
- /tools/ pages (20 tools)
- /topics/ pages (16 topics)
- /compare/ pages (20 comparisons)

### Sprint 4 — DSA Hub ✅ DONE (architecture)
- /dsa/ hub + /dsa/[category] + /dsa/problem/[slug] + /dsa/pattern/[slug]
- First 50 problems needed (content Sprint 6)

### Sprint 5 — Companies Hub ✅ DONE (architecture)
- /companies/[company] hub pages
- /companies/[company]/[type] sub-pages → IN PROGRESS

### Sprint 6 — Content Volume 🔄 IN PROGRESS
- Python BE intermediate — all stacks (django, fastapi, celery, redis, kafka, postgresql, testing)
- JS Frontend intermediate — React, TypeScript, Next.js
- Data Engineering track (Python/Airflow/Spark)
- Fill all Java BE empty subcategories (security, devops-cicd, architecture, microservices)
- DSA problems with full schemas (first 50)

### Sprint 7 — Scale 📋 PLANNED
- Go backend track
- Kotlin Android track
- ML/AI track (Python)
- Mock interview integration (use existing /mock-interviews/)
- Company-specific DSA problem tagging
- Multi-sitemap split (sitemap-java.xml, sitemap-python.xml, etc.)

---

*This document is the law. When in doubt, come back here.*
