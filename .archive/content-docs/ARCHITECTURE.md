# InterviewExplainer — Locked Architecture

**Scope:** Java Backend Intermediate
**Status:** FINAL — single source of truth. Do not change module slugs or SEO URLs without updating this file first.

---

## URL Pattern Legend

```
[app]       /java-backend-intermediate/<module-slug>           ← study path (logged-in users)
[seo]       /<technology>-interview-questions                  ← canonical, Google indexed
[alt]       /<alias>-interview-questions                       ← 301 redirect to [seo]
[topic]     /<seo-url>/<topic-slug>
[question]  /<seo-url>/<question-slug>
```

**Relationship:** App URL and SEO URL serve the same content. Canonical tag on every page points App → SEO.

---

## Totals

| | Count |
|---|---|
| Pillars | 12 |
| Modules | 34 |
| Topics (approx) | ~280 |
| URL forms per module | 3 (app + seo + alts) |
| Cross-module page types | 4 (master, top-50, experience, comparisons) |

---

## Pillar 01 — Java Language & Core

### M01 · Core Java & OOP
- `[app]` `/java-backend-intermediate/core-java`
- `[seo]` `/core-java-interview-questions`
- `[alt]` `/java-oop-interview-questions`
- **Topics:** oop-principles, generics-wildcards, exception-handling, string-handling, reflection-annotations, java-io-nio, comparisons
- **Sample Q:** `/core-java-interview-questions/what-is-polymorphism-in-java`

### M02 · Java Collections & Algorithms
- `[app]` `/java-backend-intermediate/java-collections`
- `[seo]` `/java-collections-interview-questions`
- `[alt]` `/java-data-structures-interview-questions`
- **Topics:** collections-internals, algorithm-complexity, sorting-and-searching, trees-and-graphs, dynamic-programming, problem-solving-patterns, comparisons
- **Sample Q:** `/java-collections-interview-questions/how-does-hashmap-work-internally-in-java`

### M03 · Java Streams, Lambdas & Modern Java
- `[app]` `/java-backend-intermediate/java-streams`
- `[seo]` `/java-streams-interview-questions`
- `[alt]` `/java-8-interview-questions`, `/java-17-interview-questions`, `/java-21-interview-questions`, `/java-lambda-interview-questions`
- **Topics:** lambdas-functional-interfaces, streams-api, optional-api, java-9-to-11-features, java-14-to-17-features, java-21-features, comparisons
- **Sample Q:** `/java-streams-interview-questions/difference-between-map-and-flatmap-in-java`

### M04 · Java Concurrency & Multithreading
- `[app]` `/java-backend-intermediate/java-concurrency`
- `[seo]` `/java-concurrency-interview-questions`
- `[alt]` `/java-multithreading-interview-questions`, `/java-thread-interview-questions`
- **Topics:** threads-and-lifecycle, synchronization-and-locks, thread-pools-and-executor, completable-future, concurrent-collections, java-memory-model, virtual-threads, concurrency-patterns, comparisons
- **Sample Q:** `/java-concurrency-interview-questions/difference-between-thread-and-runnable`

### M05 · JVM Internals & Performance
- `[app]` `/java-backend-intermediate/jvm-internals`
- `[seo]` `/jvm-interview-questions`
- `[alt]` `/java-jvm-interview-questions`, `/java-garbage-collection-interview-questions`
- **Topics:** jvm-architecture, garbage-collection, jvm-tuning, memory-analysis, profiling-and-debugging, comparisons
- **Sample Q:** `/jvm-interview-questions/how-does-garbage-collection-work-in-java`

---

## Pillar 02 — Spring Ecosystem

### M06 · Spring Core & IoC
- `[app]` `/java-backend-intermediate/spring-core`
- `[seo]` `/spring-core-interview-questions`
- `[alt]` `/spring-ioc-interview-questions`, `/spring-dependency-injection-interview-questions`
- **Topics:** dependency-injection, bean-lifecycle, aop, spring-internals, custom-components, spring-events, comparisons
- **Sample Q:** `/spring-core-interview-questions/difference-between-beanfactory-and-applicationcontext`

### M07 · Spring Boot   *(highest traffic)*
- `[app]` `/java-backend-intermediate/spring-boot`
- `[seo]` `/spring-boot-interview-questions`
- **Topics:** auto-configuration, starters, actuator, profiles-and-properties, embedded-servers, configuration-management, testing, troubleshooting, comparisons
- **Sample Q:** `/spring-boot-interview-questions/what-is-spring-boot-auto-configuration`

### M08 · Spring Data, JPA & Hibernate
- `[app]` `/java-backend-intermediate/spring-data-jpa`
- `[seo]` `/hibernate-interview-questions`
- `[alt]` `/spring-data-jpa-interview-questions`, `/jpa-interview-questions`
- **Topics:** jpa-fundamentals, hibernate-internals, spring-data-jpa, entity-relationships, transactions, n-plus-one-problem, query-optimization, custom-repositories, database-migrations, batch-processing, multi-tenancy, comparisons
- **Sample Q:** `/hibernate-interview-questions/what-is-n-plus-one-problem-in-hibernate`

### M09 · Spring Security & Identity
- `[app]` `/java-backend-intermediate/spring-security`
- `[seo]` `/spring-security-interview-questions`
- `[alt]` `/oauth2-interview-questions`, `/jwt-interview-questions`
- **Topics:** security-fundamentals, authentication, authorization, jwt, oauth2, cors-and-csrf, sso-and-saml, security-configuration, testing, comparisons
- **Sample Q:** `/spring-security-interview-questions/how-does-jwt-authentication-work`

### M10 · Spring WebFlux & Reactive Programming
- `[app]` `/java-backend-intermediate/spring-webflux`
- `[seo]` `/spring-webflux-interview-questions`
- `[alt]` `/reactive-programming-interview-questions`, `/project-reactor-interview-questions`
- **Topics:** reactive-programming-basics, mono-and-flux, backpressure, spring-webflux-setup, r2dbc-reactive-data, error-handling-reactive, testing-reactive, comparisons
- **Sample Q:** `/spring-webflux-interview-questions/difference-between-mono-and-flux`

### M11 · Spring Batch & Scheduling
- `[app]` `/java-backend-intermediate/spring-batch`
- `[seo]` `/spring-batch-interview-questions`
- `[alt]` `/spring-scheduling-interview-questions`
- **Topics:** batch-fundamentals, job-and-step-structure, chunk-processing, item-reader-writer-processor, job-scheduling-with-quartz, scheduled-tasks, batch-error-handling, partitioning-and-parallel-steps, comparisons
- **Sample Q:** `/spring-batch-interview-questions/what-is-chunk-oriented-processing-in-spring-batch`

---

## Pillar 03 — Data & Persistence

### M12 · SQL & Relational Databases
- `[app]` `/java-backend-intermediate/sql-databases`
- `[seo]` `/sql-interview-questions`
- `[alt]` `/postgresql-interview-questions`, `/database-interview-questions`
- **Topics:** sql-fundamentals, joins-and-subqueries, indexes-and-performance, transactions-and-acid, postgresql-features, advanced-sql-features, connection-pooling, query-optimization, partitioning-and-sharding, replication, database-migrations, comparisons
- **Sample Q:** `/sql-interview-questions/difference-between-clustered-and-nonclustered-index`

### M13 · NoSQL & MongoDB
- `[app]` `/java-backend-intermediate/nosql-mongodb`
- `[seo]` `/mongodb-interview-questions`
- `[alt]` `/nosql-interview-questions`, `/elasticsearch-interview-questions`
- **Topics:** nosql-fundamentals, document-model, mongodb-core, mongodb-with-spring, mongodb-indexes, nosql-patterns, elasticsearch-basics, comparisons
- **Sample Q:** `/mongodb-interview-questions/difference-between-sql-and-nosql-database`

### M14 · Redis & Caching
- `[app]` `/java-backend-intermediate/redis-caching`
- `[seo]` `/redis-interview-questions`
- `[alt]` `/caching-interview-questions`, `/spring-cache-interview-questions`
- **Topics:** redis-data-structures, redis-advanced, redis-persistence, spring-data-redis, cache-patterns, caching-strategies, caffeine-cache, distributed-caching, cache-invalidation, comparisons
- **Sample Q:** `/redis-interview-questions/difference-between-cache-aside-and-write-through`

---

## Pillar 04 — APIs, Microservices & Messaging

### M15 · REST API & Spring MVC
- `[app]` `/java-backend-intermediate/rest-api`
- `[seo]` `/rest-api-interview-questions`
- `[alt]` `/spring-mvc-interview-questions`, `/graphql-interview-questions`, `/grpc-interview-questions`
- **Topics:** rest-fundamentals, spring-mvc-controllers, request-and-response-handling, api-design, error-handling, openapi-and-swagger, hateoas, rest-client-and-feign, http-caching-and-compression, versioning, graphql-with-spring, grpc-basics, comparisons
- **Sample Q:** `/rest-api-interview-questions/difference-between-put-and-patch-in-rest`

### M16 · Microservices Architecture
- `[app]` `/java-backend-intermediate/microservices`
- `[seo]` `/microservices-interview-questions`
- `[alt]` `/spring-cloud-interview-questions`, `/service-mesh-interview-questions`
- **Topics:** fundamentals, service-design, api-gateway, service-discovery, circuit-breaker, load-balancing, feign-client, config-management, distributed-tracing, resilience-patterns, communication-patterns, service-mesh, contract-testing, saga-pattern, migration-strategies, comparisons
- **Sample Q:** `/microservices-interview-questions/what-is-circuit-breaker-pattern-in-microservices`

### M17 · Messaging & Event-Driven Architecture
- `[app]` `/java-backend-intermediate/messaging-events`
- `[seo]` `/kafka-interview-questions`
- `[alt]` `/rabbitmq-interview-questions`, `/event-driven-architecture-interview-questions`, `/event-sourcing-interview-questions`
- **Topics:** messaging-fundamentals, kafka-architecture, kafka-patterns, spring-kafka, rabbitmq, event-sourcing, cqrs, message-guarantees, stream-processing, webhooks, comparisons
- **Sample Q:** `/kafka-interview-questions/how-does-kafka-consumer-group-work`

---

## Pillar 05 — Architecture & Design

### M18 · Design Patterns & SOLID
- `[app]` `/java-backend-intermediate/design-patterns`
- `[seo]` `/design-patterns-interview-questions`
- `[alt]` `/solid-principles-interview-questions`, `/java-design-patterns-interview-questions`
- **Topics:** solid-principles, creational-patterns, structural-patterns, behavioral-patterns, refactoring, technical-debt, comparisons
- **Sample Q:** `/design-patterns-interview-questions/what-is-singleton-pattern-in-java`

### M19 · Architecture Patterns & Principles
- `[app]` `/java-backend-intermediate/architecture-patterns`
- `[seo]` `/software-architecture-interview-questions`
- `[alt]` `/clean-architecture-interview-questions`, `/domain-driven-design-interview-questions`, `/ddd-interview-questions`
- **Topics:** architectural-styles, clean-architecture, hexagonal-architecture, domain-driven-design, cqrs-and-event-sourcing, microservices-patterns, comparisons
- **Sample Q:** `/software-architecture-interview-questions/what-is-hexagonal-architecture`

---

## Pillar 06 — System Design

### M20 · System Design Fundamentals
- `[app]` `/java-backend-intermediate/system-design`
- `[seo]` `/system-design-interview-questions`
- **Topics:** design-fundamentals, scalability, high-availability, cap-theorem, capacity-planning, database-design-at-scale, caching-at-scale, load-balancing, event-driven-design, microservices-design, comparisons
- **Sample Q:** `/system-design-interview-questions/how-to-design-a-scalable-system`

### M21 · System Design Case Studies
- `[app]` `/java-backend-intermediate/system-design-cases`
- `[seo]` `/system-design-problems`
- `[alt]` `/system-design-case-studies`
- **Topics:** url-shortener, notification-service, payment-system, social-media-feed, rate-limiter, chat-system, search-autocomplete
- **Sample Q:** `/system-design-problems/how-to-design-url-shortener-like-bitly`

---

## Pillar 07 — Security

### M22 · Application Security & OWASP
- `[app]` `/java-backend-intermediate/application-security`
- `[seo]` `/application-security-interview-questions`
- `[alt]` `/owasp-interview-questions`, `/web-security-interview-questions`
- **Topics:** owasp-top-10, encryption, secure-coding, secrets-management, security-architecture, security-testing, vulnerability-scanning, compliance, comparisons
- **Sample Q:** `/application-security-interview-questions/what-is-sql-injection-and-how-to-prevent`

---

## Pillar 08 — Testing & Quality

### M23 · Unit & Integration Testing
- `[app]` `/java-backend-intermediate/unit-testing`
- `[seo]` `/java-testing-interview-questions`
- `[alt]` `/junit-interview-questions`, `/mockito-interview-questions`
- **Topics:** unit-testing-basics, unit-testing-advanced, mocking-with-mockito, integration-testing, spring-boot-testing, testcontainers, comparisons
- **Sample Q:** `/java-testing-interview-questions/difference-between-mock-stub-and-spy-in-mockito`

### M24 · Advanced Testing Strategies
- `[app]` `/java-backend-intermediate/advanced-testing`
- `[seo]` `/advanced-testing-interview-questions`
- `[alt]` `/tdd-interview-questions`, `/testcontainers-interview-questions`, `/contract-testing-interview-questions`
- **Topics:** tdd-practices, test-automation, contract-testing, performance-testing, chaos-testing, testing-strategies, comparisons
- **Sample Q:** `/advanced-testing-interview-questions/what-is-test-driven-development-tdd`

---

## Pillar 09 — DevOps

### M25 · Git & Build Tools
- `[app]` `/java-backend-intermediate/git-build-tools`
- `[seo]` `/git-interview-questions`
- `[alt]` `/maven-interview-questions`, `/gradle-interview-questions`
- **Topics:** git-internals, git-workflows, maven-build, gradle-build, code-quality-gates, comparisons
- **Sample Q:** `/git-interview-questions/difference-between-git-merge-and-git-rebase`

### M26 · CI/CD Pipelines
- `[app]` `/java-backend-intermediate/cicd`
- `[seo]` `/cicd-interview-questions`
- `[alt]` `/jenkins-interview-questions`, `/github-actions-interview-questions`, `/devops-interview-questions`
- **Topics:** cicd-fundamentals, jenkins-pipelines, github-actions, infrastructure-as-code, deployment-strategies, rollback-strategies, comparisons
- **Sample Q:** `/cicd-interview-questions/difference-between-continuous-delivery-and-deployment`

### M27 · Docker & Containerization
- `[app]` `/java-backend-intermediate/docker`
- `[seo]` `/docker-interview-questions`
- `[alt]` `/containerization-interview-questions`
- **Topics:** docker-fundamentals, docker-compose, docker-networking, docker-security, multi-stage-builds, comparisons
- **Sample Q:** `/docker-interview-questions/difference-between-docker-image-and-container`

### M28 · Kubernetes & Orchestration
- `[app]` `/java-backend-intermediate/kubernetes`
- `[seo]` `/kubernetes-interview-questions`
- `[alt]` `/k8s-interview-questions`, `/helm-interview-questions`
- **Topics:** kubernetes-fundamentals, kubernetes-workloads, kubernetes-configuration, kubernetes-networking, kubernetes-scaling, helm, comparisons
- **Sample Q:** `/kubernetes-interview-questions/difference-between-deployment-and-statefulset`

---

## Pillar 10 — Cloud

### M29 · AWS & Cloud Platforms
- `[app]` `/java-backend-intermediate/aws-cloud`
- `[seo]` `/aws-interview-questions`
- `[alt]` `/cloud-computing-interview-questions`, `/gcp-interview-questions`
- **Topics:** aws-core-services, ecs-and-fargate, rds-with-spring, s3-storage, iam-and-security, aws-messaging, serverless, gcp-and-azure-overview, comparisons
- **Sample Q:** `/aws-interview-questions/difference-between-sqs-and-sns-in-aws`

### M30 · Cloud-Native & Infrastructure as Code
- `[app]` `/java-backend-intermediate/cloud-native`
- `[seo]` `/cloud-native-interview-questions`
- `[alt]` `/terraform-interview-questions`, `/infrastructure-as-code-interview-questions`
- **Topics:** 12-factor-app, cloud-design-patterns, deployment-strategies, disaster-recovery, multi-region-architecture, cost-optimization, comparisons
- **Sample Q:** `/cloud-native-interview-questions/what-is-12-factor-app-methodology`

---

## Pillar 11 — Production

### M31 · Observability & Monitoring
- `[app]` `/java-backend-intermediate/observability`
- `[seo]` `/observability-interview-questions`
- `[alt]` `/monitoring-interview-questions`, `/prometheus-interview-questions`, `/distributed-tracing-interview-questions`
- **Topics:** structured-logging, distributed-log-aggregation, metrics-and-micrometer, prometheus-and-grafana, distributed-tracing, health-checks-and-probes, alerting, apm-tools, comparisons
- **Sample Q:** `/observability-interview-questions/difference-between-monitoring-and-observability`

### M32 · Production Operations & SRE
- `[app]` `/java-backend-intermediate/production-sre`
- `[seo]` `/sre-interview-questions`
- `[alt]` `/production-operations-interview-questions`, `/site-reliability-engineering-interview-questions`
- **Topics:** debugging-production, thread-and-heap-dumps, memory-leaks, performance-troubleshooting, incident-response, incident-management, root-cause-analysis, postmortems, chaos-engineering, sre-practices, capacity-planning, runbooks, on-call
- **Sample Q:** `/sre-interview-questions/what-is-error-budget-in-sre`

---

## Pillar 12 — Interview Readiness

### M33 · Engineering Practices
- `[app]` `/java-backend-intermediate/engineering-practices`
- `[seo]` `/engineering-practices-interview-questions`
- `[alt]` `/code-review-interview-questions`, `/software-engineering-best-practices-interview-questions`
- **Topics:** code-review, architecture-decisions, technical-documentation, technical-debt, team-collaboration, knowledge-sharing, mentoring
- **Sample Q:** `/engineering-practices-interview-questions/how-do-you-approach-code-review`

### M34 · Behavioral & Leadership
- `[app]` `/java-backend-intermediate/behavioral`
- `[seo]` `/behavioral-interview-questions-software-engineer`
- `[alt]` `/java-developer-behavioral-interview-questions`, `/technical-leadership-interview-questions`
- **Topics:** star-method, conflict-resolution, technical-leadership, agile-and-scrum, delivering-under-pressure, failure-and-learning, career-growth
- **Sample Q:** `/behavioral-interview-questions-software-engineer/tell-me-about-a-time-you-failed`

---

## Cross-Module SEO Pages

### Master Lists (aggregate multiple modules)
- `/java-interview-questions` — M01–M05
- `/spring-interview-questions` — M06–M11
- `/java-backend-interview-questions` — all 34 modules

### Top-50 Pages (auto-generated from `importance: high`)
- `/top-50-java-interview-questions`
- `/top-50-spring-boot-interview-questions`
- `/top-50-microservices-interview-questions`
- `/top-50-hibernate-interview-questions`
- `/top-50-system-design-interview-questions`
- `/top-50-kafka-interview-questions`
- `/top-50-kubernetes-interview-questions`
- `/top-50-docker-interview-questions`
- `/top-50-spring-security-interview-questions`
- `/top-50-redis-interview-questions`

### Experience-Level Pages (auto-filtered by difficulty)
- `/java-interview-questions-2-years-experience`
- `/java-interview-questions-3-years-experience`
- `/java-interview-questions-5-years-experience`
- `/java-backend-interview-questions-senior-developer`
- `/spring-boot-interview-questions-experienced`

### Comparison Pages (standalone X vs Y)
- `/microservices-vs-monolith`
- `/spring-boot-vs-spring-mvc`
- `/hibernate-vs-jpa`
- `/kafka-vs-rabbitmq`
- `/jwt-vs-session-authentication`
- `/resttemplate-vs-webclient`
- `/sql-vs-nosql`
- `/docker-vs-kubernetes`
- `/redis-vs-memcached`
- `/maven-vs-gradle`
- `/spring-mvc-vs-spring-webflux`
- `/junit4-vs-junit5`
- `/mockito-vs-powermock`

---

## URL Rules

1. **App URL** always starts with the domain slug: `/java-backend-intermediate/<module-slug>/<question-slug>`
2. **SEO URL** is technology-first and flat: `/<technology>-interview-questions/<question-slug>`
3. **Canonical** tag on every question page points App → SEO.
4. **Module slug** in App URL is short and clean (e.g. `spring-data-jpa` not `spring-data-jpa-and-hibernate`).
5. **Question slug** = the question itself, lowercase, hyphenated (e.g. `what-is-n-plus-one-problem-in-hibernate`, never `q-123`).
6. **Alt SEO URLs** 301-redirect to the primary SEO URL.
7. **Comparison pages** are always standalone (`/kafka-vs-rabbitmq`, never nested).
8. **Top-50 / experience pages** are server-rendered from metadata — no separate content files.

---

## On-Disk Layout

Content lives under the App-URL root:

```
content/java-backend-intermediate/
  <module-slug>/
    <topic-slug>/
      questions.json        ← array of question metadata
      complete-qa.json      ← full Q&A bundle
      answers/
        <question-slug>.json
```

The SEO URL is derived at build time from each module's `seoSlug` and `altSlugs` in `_config.json`.
