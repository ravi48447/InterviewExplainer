# Migration Map — Existing Folders → Locked 34 Modules

**Source tree:** `content/domains/java/backend/intermediate/`
**Target tree:** `content/java-backend-intermediate/` (App-URL root, per ARCHITECTURE.md)

**Method:** COPY existing topic folders into their new home. Source tree is preserved until every topic is verified in the new tree. No Q&A files are deleted at any point.

---

## Summary of Operations

| Type | Count | Examples |
|---|---|---|
| Direct rename (module-level) | 8 | `collections-data-structures` → `java-collections` |
| Direct keep (no rename) | 9 | `core-java`, `spring-boot`, `microservices` |
| Split (1 source → N targets) | 6 | `advanced-java` → M03 + M04 |
| Merge (N sources → 1 target) | 5 | `database` + `postgresql` + `sql-databases` → M12 |
| New empty module (scaffold only) | 4 | M10, M11, M13, M34 |

**Net result:** 31 existing intermediate modules → 34 locked modules, every topic accounted for.

---

## Module-by-Module Plan

Legend:
- **KEEP** — topic folder moves as-is
- **RENAME** — topic folder renamed during copy
- **NEW** — topic created fresh (empty)
- `scenario-based` and `_config.json` from each source are always preserved into the target module

---

### M01 · core-java  →  `java-backend-intermediate/core-java`
**Source:** `core-java/` (partial — topics moved out to M03/M04/M18)

| Source topic | → | Target topic | Action |
|---|---|---|---|
| core-java/oop-principles | → | oop-principles | KEEP |
| core-java/generics-wildcards | → | generics-wildcards | KEEP |
| core-java/exceptions-best-practices | → | exception-handling | RENAME |
| core-java/string-handling | → | string-handling | KEEP |
| core-java/reflection-annotations | → | reflection-annotations | KEEP |
| core-java/scenario-based | → | scenario-based | KEEP |
| — | → | java-io-nio | NEW (empty) |
| — | → | comparisons | NEW (empty) |
| core-java/java-8-features | → | M03 | MOVE OUT |
| core-java/functional-programming | → | M03 | MOVE OUT |
| core-java/multithreading-concurrency | → | M04 | MOVE OUT |
| core-java/design-patterns | → | M18 | MOVE OUT |

---

### M02 · collections-data-structures  →  `java-collections`  *(rename module)*
**Source:** `collections-data-structures/`

| Source topic | → | Target topic | Action |
|---|---|---|---|
| collections-internals | → | collections-internals | KEEP |
| algorithm-complexity | → | algorithm-complexity | KEEP |
| trees-graphs | → | trees-and-graphs | RENAME |
| dynamic-programming | → | dynamic-programming | KEEP |
| problem-solving-patterns | → | problem-solving-patterns | KEEP |
| concurrent-collections | → | M04 | MOVE OUT (concurrency) |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| — | → | sorting-and-searching | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M03 · java-streams  *(NEW module, populated by splits)*  →  `java-streams`
**Sources:** `advanced-java/` (partial) + `core-java/` (partial)

| Source topic | → | Target topic | Action |
|---|---|---|---|
| advanced-java/streams-lambdas | → | streams-api | RENAME |
| advanced-java/optional-functional | → | optional-api | RENAME |
| advanced-java/modern-java-features | → | java-14-to-17-features | RENAME |
| core-java/java-8-features | → | lambdas-functional-interfaces | RENAME |
| core-java/functional-programming | → | lambdas-functional-interfaces | MERGE (combine with above) |
| — | → | java-9-to-11-features | NEW (empty) |
| — | → | java-21-features | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M04 · java-concurrency  *(NEW module, populated by splits)*  →  `java-concurrency`
**Sources:** `advanced-java/` (partial) + `core-java/` (partial) + `collections-data-structures/` (partial)

| Source topic | → | Target topic | Action |
|---|---|---|---|
| advanced-java/java-concurrency | → | threads-and-lifecycle | RENAME |
| advanced-java/completablefuture | → | completable-future | RENAME |
| core-java/multithreading-concurrency | → | synchronization-and-locks | RENAME |
| collections-data-structures/concurrent-collections | → | concurrent-collections | KEEP |
| — | → | thread-pools-and-executor | NEW (empty) |
| — | → | java-memory-model | NEW (empty) |
| — | → | virtual-threads | NEW (empty) |
| — | → | concurrency-patterns | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M05 · jvm-performance  →  `jvm-internals`  *(rename module)*
**Source:** `jvm-performance/`

| Source topic | → | Target topic | Action |
|---|---|---|---|
| jvm-architecture | → | jvm-architecture | KEEP |
| garbage-collection | → | garbage-collection | KEEP |
| jvm-tuning | → | jvm-tuning | KEEP |
| memory-analysis | → | memory-analysis | KEEP |
| profiling-debugging | → | profiling-and-debugging | RENAME |
| scenario-based | → | scenario-based | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M06 · spring-core  →  `spring-core`  *(keep)*

All topics KEEP as-is: `dependency-injection`, `bean-lifecycle`, `aop`, `spring-internals`, `custom-components`, `scenario-based`.
New empty: `spring-events`, `comparisons`.

---

### M07 · spring-boot  →  `spring-boot`  *(keep)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| auto-configuration | → | auto-configuration | KEEP |
| starters | → | starters | KEEP |
| actuator | → | actuator | KEEP |
| profiles-properties | → | profiles-and-properties | RENAME |
| application-properties | → | profiles-and-properties | MERGE (combine) |
| embedded-servers | → | embedded-servers | KEEP |
| configuration-management | → | configuration-management | KEEP |
| testing | → | testing | KEEP |
| troubleshooting | → | troubleshooting | KEEP |
| devtools-profiles | → | troubleshooting | MERGE |
| scenario-based | → | scenario-based | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M08 · spring-data-hibernate  →  `spring-data-jpa`  *(rename module)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| jpa-fundamentals | → | jpa-fundamentals | KEEP |
| hibernate-internals | → | hibernate-internals | KEEP |
| jpa-hibernate-internals | → | hibernate-internals | MERGE |
| spring-data-jpa | → | spring-data-jpa | KEEP |
| entity-relationships | → | entity-relationships | KEEP |
| transactions | → | transactions | KEEP |
| n-plus-one-problem | → | n-plus-one-problem | KEEP |
| query-optimization | → | query-optimization | KEEP |
| custom-repositories | → | custom-repositories | KEEP |
| database-migrations | → | database-migrations | KEEP |
| batch-processing | → | batch-processing | KEEP |
| multi-tenancy | → | multi-tenancy | KEEP |
| caching | → | caching | KEEP (hibernate L1/L2 cache) |
| caching-strategies | → | caching | MERGE |
| scenario-based | → | scenario-based | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M09 · spring-security  →  `spring-security`  *(keep)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| authentication | → | authentication | KEEP |
| authentication-authorization | → | authentication | MERGE |
| authorization | → | authorization | KEEP |
| jwt | → | jwt | KEEP |
| oauth2 | → | oauth2 | KEEP |
| oauth2-jwt | → | oauth2 | MERGE |
| cors-csrf | → | cors-and-csrf | RENAME |
| sso-saml | → | sso-and-saml | RENAME |
| security-config | → | security-configuration | RENAME |
| security-configuration | → | security-configuration | MERGE |
| testing | → | testing | KEEP |
| compliance | → | M22 | MOVE OUT (app-security) |
| scenario-based | → | scenario-based | KEEP |
| — | → | security-fundamentals | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M10 · spring-webflux  *(NEW, scaffold only — no existing content)*

Create empty topic folders: `reactive-programming-basics`, `mono-and-flux`, `backpressure`, `spring-webflux-setup`, `r2dbc-reactive-data`, `error-handling-reactive`, `testing-reactive`, `comparisons`.

---

### M11 · spring-batch  *(NEW, scaffold only)*

Create empty topic folders: `batch-fundamentals`, `job-and-step-structure`, `chunk-processing`, `item-reader-writer-processor`, `job-scheduling-with-quartz`, `scheduled-tasks`, `batch-error-handling`, `partitioning-and-parallel-steps`, `comparisons`.

---

### M12 · sql-databases + postgresql + database  →  `sql-databases`  *(merge 3 → 1)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| sql-databases | sql-fundamentals | → | sql-fundamentals | KEEP |
| sql-databases | joins-subqueries | → | joins-and-subqueries | RENAME |
| sql-databases | indexes-performance | → | indexes-and-performance | RENAME |
| sql-databases | transactions-acid | → | transactions-and-acid | RENAME |
| postgresql | postgresql-basics | → | postgresql-features | MERGE |
| postgresql | advanced-features | → | postgresql-features | MERGE |
| postgresql | jsonb-queries | → | advanced-sql-features | RENAME |
| postgresql | performance-tuning | → | query-optimization | MERGE |
| database | connection-pooling | → | connection-pooling | KEEP |
| database | query-optimization | → | query-optimization | MERGE |
| database | indexing | → | indexes-and-performance | MERGE |
| database | partitioning-sharding | → | partitioning-and-sharding | RENAME |
| database | replication | → | replication | KEEP |
| database | migrations | → | database-migrations | RENAME |
| database | backup-recovery | → | backup-recovery | KEEP (bonus topic) |
| database | nosql-integration | → | M13 | MOVE OUT |
| database | scenario-based | → | scenario-based | MERGE |
| — | — | → | comparisons | NEW (empty) |

---

### M13 · nosql-mongodb  *(NEW)*

| Source | Source topic | → | Target topic |
|---|---|---|---|
| database | nosql-integration | → | mongodb-with-spring |
| — | — | → | nosql-fundamentals (NEW) |
| — | — | → | document-model (NEW) |
| — | — | → | mongodb-core (NEW) |
| — | — | → | mongodb-indexes (NEW) |
| — | — | → | nosql-patterns (NEW) |
| — | — | → | elasticsearch-basics (NEW) |
| — | — | → | comparisons (NEW) |

---

### M14 · redis + caching-performance  →  `redis-caching`  *(merge 2 → 1)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| redis | redis-data-structures | → | redis-data-structures | KEEP |
| redis | redis-advanced | → | redis-advanced | KEEP |
| redis | caching-patterns | → | cache-patterns | RENAME |
| redis | spring-data-redis | → | spring-data-redis | KEEP |
| caching-performance | cache-patterns | → | cache-patterns | MERGE |
| caching-performance | caching-strategies | → | caching-strategies | KEEP |
| caching-performance | caffeine-cache | → | caffeine-cache | KEEP |
| caching-performance | distributed-caching | → | distributed-caching | KEEP |
| caching-performance | invalidation | → | cache-invalidation | RENAME |
| caching-performance | redis | → | redis-advanced | MERGE |
| caching-performance | redis-spring | → | spring-data-redis | MERGE |
| caching-performance | cdn-optimization | → | M15 | MOVE OUT (http caching) |
| caching-performance | http-optimization | → | M15 | MOVE OUT |
| caching-performance | performance-optimization | → | performance-optimization | KEEP (bonus) |
| caching-performance | performance-tuning | → | performance-optimization | MERGE |
| caching-performance | scenario-based | → | scenario-based | MERGE |
| — | — | → | redis-persistence | NEW (empty) |
| — | — | → | comparisons | NEW (empty) |

---

### M15 · rest-api-web  →  `rest-api`  *(rename module)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| rest-fundamentals | → | rest-fundamentals | KEEP |
| spring-mvc-controllers | → | spring-mvc-controllers | KEEP |
| request-response-handling | → | request-and-response-handling | RENAME |
| api-design | → | api-design | KEEP |
| error-handling | → | error-handling | KEEP |
| exception-handling | → | error-handling | MERGE |
| api-documentation | → | openapi-and-swagger | RENAME |
| documentation-openapi | → | openapi-and-swagger | MERGE |
| hateoas-graphql | → | hateoas | RENAME (split graphql out) |
| hateoas-graphql | → | graphql-with-spring | SPLIT (graphql portion) |
| restclient-feign | → | rest-client-and-feign | RENAME |
| performance | → | http-caching-and-compression | RENAME |
| versioning | → | versioning | KEEP |
| security | → | M22 | MOVE OUT |
| security-cors-csrf | → | M09 | MOVE OUT |
| scenario-based | → | scenario-based | KEEP |
| — | → | grpc-basics | NEW (empty) |
| — | → | comparisons | NEW (empty) |
| ← caching-performance/cdn-optimization | → | http-caching-and-compression | MERGE IN |
| ← caching-performance/http-optimization | → | http-caching-and-compression | MERGE IN |

---

### M16 · microservices  →  `microservices`  *(keep)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| fundamentals | → | fundamentals | KEEP |
| service-design | → | service-design | KEEP |
| api-gateway | → | api-gateway | KEEP |
| service-discovery | → | service-discovery | KEEP |
| circuit-breaker | → | circuit-breaker | KEEP |
| load-balancing | → | load-balancing | KEEP |
| feign-client | → | feign-client | KEEP |
| config-management | → | config-management | KEEP |
| spring-cloud-config | → | config-management | MERGE |
| distributed-tracing | → | distributed-tracing | KEEP |
| resilience-patterns | → | resilience-patterns | KEEP |
| communication-patterns | → | communication-patterns | KEEP |
| service-mesh | → | service-mesh | KEEP |
| contract-testing | → | contract-testing | KEEP |
| saga-pattern | → | saga-pattern | KEEP |
| migration | → | migration-strategies | RENAME |
| scenario-based | → | scenario-based | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M17 · kafka + event-driven + event-driven-architecture  →  `messaging-events`  *(merge 3 → 1)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| kafka | kafka-architecture | → | kafka-architecture | KEEP |
| kafka | kafka-patterns | → | kafka-patterns | KEEP |
| kafka | spring-kafka | → | spring-kafka | KEEP |
| event-driven | messaging-fundamentals | → | messaging-fundamentals | KEEP |
| event-driven | kafka | → | kafka-architecture | MERGE |
| event-driven | rabbitmq | → | rabbitmq | KEEP |
| event-driven | event-sourcing | → | event-sourcing | KEEP |
| event-driven | cqrs | → | cqrs | KEEP |
| event-driven | spring-events | → | M06 | MOVE OUT (to spring-core/spring-events) |
| event-driven | webhooks | → | webhooks | KEEP |
| event-driven | scenario-based | → | scenario-based | MERGE |
| event-driven-architecture | kafka | → | kafka-architecture | MERGE |
| event-driven-architecture | cqrs | → | cqrs | MERGE |
| event-driven-architecture | event-sourcing | → | event-sourcing | MERGE |
| event-driven-architecture | event-driven-patterns | → | M19 | MOVE OUT (arch patterns) |
| event-driven-architecture | message-guarantees | → | message-guarantees | KEEP |
| event-driven-architecture | saga-pattern | → | M16 | MOVE OUT (to microservices/saga-pattern) — MERGE |
| event-driven-architecture | stream-processing | → | stream-processing | KEEP |
| event-driven-architecture | scenario-based | → | scenario-based | MERGE |
| — | — | → | comparisons | NEW (empty) |

---

### M18 · design-patterns  *(NEW module, populated by split of `architecture-design-patterns`)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| architecture-design-patterns | design-patterns | → | (split into creational/structural/behavioral) | SPLIT BY PATTERN TYPE |
| architecture-design-patterns | solid-principles | → | solid-principles | KEEP |
| architecture-design-patterns | refactoring | → | refactoring | KEEP |
| architecture-design-patterns | technical-debt | → | technical-debt | KEEP |
| architecture-design-patterns | scenario-based | → | scenario-based | MERGE |
| core-java | design-patterns | → | (merge into creational/structural/behavioral) | MERGE |
| — | — | → | creational-patterns | NEW (seeded from above) |
| — | — | → | structural-patterns | NEW (seeded from above) |
| — | — | → | behavioral-patterns | NEW (seeded from above) |
| — | — | → | comparisons | NEW (empty) |

> **Note:** Splitting `design-patterns/` by pattern type (creational/structural/behavioral) requires reading each question's subject. Safe fallback: copy existing `design-patterns` folder intact into M18 as `design-patterns-legacy`, then manually reclassify questions in a later pass. **Recommend this fallback for the migration.**

---

### M19 · architecture-patterns  *(NEW module, populated by split)*  →  `architecture-patterns`

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| architecture-design-patterns | architectural-styles | → | architectural-styles | KEEP |
| architecture-design-patterns | architecture-styles | → | architectural-styles | MERGE |
| architecture-design-patterns | clean-architecture | → | clean-architecture | KEEP |
| architecture-design-patterns | hexagonal-clean | → | hexagonal-architecture | RENAME |
| architecture-design-patterns | domain-driven-design | → | domain-driven-design | KEEP |
| architecture-design-patterns | cqrs-event-sourcing | → | cqrs-and-event-sourcing | RENAME |
| architecture-design-patterns | event-driven-architecture | → | cqrs-and-event-sourcing | MERGE |
| architecture-design-patterns | microservices-patterns | → | microservices-patterns | KEEP |
| event-driven-architecture | event-driven-patterns | → | cqrs-and-event-sourcing | MERGE |
| — | — | → | comparisons | NEW (empty) |

---

### M20 · system-design  →  `system-design`  *(keep, case studies moved out)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| design-fundamentals | → | design-fundamentals | KEEP |
| scalability | → | scalability | KEEP |
| high-availability | → | high-availability | KEEP |
| consistency-cap | → | cap-theorem | RENAME |
| capacity-planning | → | capacity-planning | KEEP |
| database-design | → | database-design-at-scale | RENAME |
| caching-strategy | → | caching-at-scale | RENAME |
| load-balancing | → | load-balancing | KEEP |
| event-driven-design | → | event-driven-design | KEEP |
| microservices-design | → | microservices-design | KEEP |
| api-design | → | M15 | MOVE OUT (rest-api already has api-design) — MERGE |
| design-notification | → | M21 | MOVE OUT |
| design-payment-system | → | M21 | MOVE OUT |
| design-social-media | → | M21 | MOVE OUT |
| design-url-shortener | → | M21 | MOVE OUT |
| scenario-based | → | scenario-based | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M21 · system-design-cases  *(NEW)*  →  `system-design-cases`

| Source topic | → | Target topic |
|---|---|---|
| system-design/design-url-shortener | → | url-shortener |
| system-design/design-notification | → | notification-service |
| system-design/design-payment-system | → | payment-system |
| system-design/design-social-media | → | social-media-feed |
| — | → | rate-limiter (NEW) |
| — | → | chat-system (NEW) |
| — | → | search-autocomplete (NEW) |

---

### M22 · security  →  `application-security`  *(rename module)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| owasp-threats | → | owasp-top-10 | RENAME |
| encryption | → | encryption | KEEP |
| secure-coding | → | secure-coding | KEEP |
| secrets-management | → | secrets-management | KEEP |
| security-architecture | → | security-architecture | KEEP |
| security-testing | → | security-testing | KEEP |
| vulnerability-scanning | → | vulnerability-scanning | KEEP |
| compliance | → | compliance | KEEP |
| authentication | → | M09 | MOVE OUT (spring-security) |
| authorization | → | M09 | MOVE OUT |
| penetration-testing | → | security-testing | MERGE |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| ← rest-api-web/security | → | secure-coding | MERGE IN |
| ← spring-security/compliance | → | compliance | MERGE IN |
| — | → | comparisons | NEW (empty) |

---

### M23 · testing (unit/integration subset)  →  `unit-testing`  *(split of `testing`)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| unit-testing | → | unit-testing-basics | RENAME |
| unit-testing-advanced | → | unit-testing-advanced | KEEP |
| mocking-frameworks | → | mocking-with-mockito | RENAME |
| integration-testing | → | integration-testing | KEEP |
| spring-test | → | spring-boot-testing | RENAME |
| test-containers | → | testcontainers | RENAME |
| scenario-based | → | scenario-based | SPLIT (share with M24) — COPY to both |
| — | → | comparisons | NEW (empty) |

---

### M24 · testing (advanced subset)  →  `advanced-testing`  *(split of `testing`)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| tdd-practices | → | tdd-practices | KEEP |
| test-automation | → | test-automation | KEEP |
| contract-testing | → | contract-testing | KEEP |
| performance-testing | → | performance-testing | KEEP |
| chaos-testing | → | chaos-testing | KEEP |
| testing-strategies | → | testing-strategies | KEEP |
| scenario-based | → | scenario-based | COPY (shared with M23) |
| — | → | comparisons | NEW (empty) |

---

### M25 · git + maven-gradle + devops-cicd(partial)  →  `git-build-tools`  *(merge 2+1)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| git | git-internals | → | git-internals | KEEP |
| git | git-workflows | → | git-workflows | KEEP |
| devops-cicd | git-workflows | → | git-workflows | MERGE |
| maven-gradle | maven | → | maven-build | RENAME |
| maven-gradle | gradle | → | gradle-build | RENAME |
| devops-cicd | build-tools | → | maven-build | MERGE (split maven vs gradle content) |
| — | — | → | code-quality-gates | NEW (empty) |
| — | — | → | comparisons | NEW (empty) |

---

### M26 · devops-cicd  →  `cicd`  *(rename + split out k8s/docker)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| cicd-pipelines | → | cicd-fundamentals | RENAME |
| jenkins-pipelines | → | jenkins-pipelines | KEEP |
| continuous-deployment | → | cicd-fundamentals | MERGE |
| automation | → | cicd-fundamentals | MERGE |
| deployment-strategies | → | deployment-strategies | KEEP |
| rollback-strategies | → | rollback-strategies | KEEP |
| infrastructure-as-code | → | infrastructure-as-code | KEEP |
| monitoring | → | M31 | MOVE OUT (observability) |
| build-tools | → | M25 | MOVE OUT |
| git-workflows | → | M25 | MOVE OUT |
| docker-containers | → | M27 | MOVE OUT |
| docker-kubernetes | → | M28 | MOVE OUT (k8s part) / M27 (docker part) — SPLIT |
| container-orchestration | → | M28 | MOVE OUT |
| kubernetes | → | M28 | MOVE OUT |
| helm-gitops | → | M28 | MOVE OUT |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| — | → | github-actions | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M27 · docker  →  `docker`  *(keep, enrich from devops-cicd)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| docker | docker-fundamentals | → | docker-fundamentals | KEEP |
| docker | docker-compose | → | docker-compose | KEEP |
| devops-cicd | docker-containers | → | docker-fundamentals | MERGE |
| devops-cicd | docker-kubernetes | → | docker-fundamentals | MERGE (docker portion) |
| — | — | → | docker-networking | NEW (empty) |
| — | — | → | docker-security | NEW (empty) |
| — | — | → | multi-stage-builds | NEW (empty) |
| — | — | → | comparisons | NEW (empty) |

---

### M28 · kubernetes  *(NEW, populated from devops-cicd + cloud-deployment)*  →  `kubernetes`

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| devops-cicd | kubernetes | → | kubernetes-fundamentals | RENAME |
| devops-cicd | container-orchestration | → | kubernetes-workloads | RENAME |
| devops-cicd | helm-gitops | → | helm | RENAME |
| devops-cicd | docker-kubernetes | → | kubernetes-fundamentals | MERGE (k8s portion) |
| cloud-deployment | container-services | → | kubernetes-workloads | MERGE |
| — | — | → | kubernetes-configuration | NEW (empty) |
| — | — | → | kubernetes-networking | NEW (empty) |
| — | — | → | kubernetes-scaling | NEW (empty) |
| — | — | → | comparisons | NEW (empty) |

---

### M29 · aws + cloud-deployment(partial)  →  `aws-cloud`  *(merge)*

| Source | Source topic | → | Target topic | Action |
|---|---|---|---|---|
| aws | aws-core | → | aws-core-services | RENAME |
| aws | ecs-deployment | → | ecs-and-fargate | RENAME |
| aws | rds-spring | → | rds-with-spring | RENAME |
| aws | s3-storage | → | s3-storage | KEEP |
| aws | iam-security | → | iam-and-security | RENAME |
| cloud-deployment | aws-services | → | aws-core-services | MERGE |
| cloud-deployment | azure-services | → | gcp-and-azure-overview | RENAME |
| cloud-deployment | serverless | → | serverless | KEEP |
| — | — | → | aws-messaging | NEW (empty) |
| — | — | → | comparisons | NEW (empty) |

---

### M30 · cloud-deployment(remainder)  →  `cloud-native`  *(rename the leftovers)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| cloud-native | → | 12-factor-app | RENAME (content = cloud-native fundamentals → 12-factor) |
| cloud-design-patterns | → | cloud-design-patterns | KEEP |
| cloud-patterns | → | cloud-design-patterns | MERGE |
| infrastructure | → | (goes to M30 as part of IaC theme) → deployment-strategies | RENAME |
| deployment-strategies | → | deployment-strategies | KEEP |
| disaster-recovery | → | disaster-recovery | KEEP |
| multi-region | → | multi-region-architecture | RENAME |
| cost-optimization | → | cost-optimization | KEEP |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| — | → | comparisons | NEW (empty) |

---

### M31 · observability  →  `observability`  *(keep)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| logging | → | structured-logging | RENAME |
| logging-distributed | → | distributed-log-aggregation | RENAME |
| metrics | → | metrics-and-micrometer | RENAME |
| metrics-monitoring | → | metrics-and-micrometer | MERGE |
| monitoring | → | prometheus-and-grafana | RENAME |
| distributed-tracing | → | distributed-tracing | KEEP |
| alerting | → | alerting | KEEP |
| apm-tools | → | apm-tools | KEEP |
| incident-management | → | M32 | MOVE OUT (SRE) |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| ← devops-cicd/monitoring | → | prometheus-and-grafana | MERGE IN |
| — | → | health-checks-and-probes | NEW (empty) |
| — | → | comparisons | NEW (empty) |

---

### M32 · production-operations  →  `production-sre`  *(rename)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| debugging | → | debugging-production | MERGE |
| debugging-production | → | debugging-production | KEEP |
| thread-heap-dumps | → | thread-and-heap-dumps | RENAME |
| memory-leaks | → | memory-leaks | KEEP |
| performance-troubleshooting | → | performance-troubleshooting | KEEP |
| incident-response | → | incident-response | KEEP |
| incident-management | → | incident-management | KEEP |
| root-cause-analysis | → | root-cause-analysis | KEEP |
| postmortems | → | postmortems | KEEP |
| chaos-engineering | → | chaos-engineering | KEEP |
| sre-practices | → | sre-practices | KEEP |
| capacity-planning | → | capacity-planning | KEEP |
| runbooks | → | runbooks | KEEP |
| on-call | → | on-call | KEEP |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| ← observability/incident-management | → | incident-management | MERGE IN |

---

### M33 · engineering-practices  →  `engineering-practices`  *(keep)*

| Source topic | → | Target topic | Action |
|---|---|---|---|
| code-review | → | code-review | KEEP |
| architecture-decisions | → | architecture-decisions | KEEP |
| documentation | → | technical-documentation | RENAME |
| team-collaboration | → | team-collaboration | KEEP |
| knowledge-sharing | → | knowledge-sharing | KEEP |
| mentoring | → | mentoring | KEEP |
| scenario-based | → | scenario-based | KEEP |
| _config.json | → | _config.json | KEEP |
| ← architecture-design-patterns/technical-debt | → | technical-debt | ADD (if not already in M18) |

---

### M34 · behavioral  *(NEW, scaffold only)*  →  `behavioral`

Create empty topic folders: `star-method`, `conflict-resolution`, `technical-leadership`, `agile-and-scrum`, `delivering-under-pressure`, `failure-and-learning`, `career-growth`.

---

## Execution Plan (once approved)

**Phase A — Scaffold new tree**
1. Create `content/java-backend-intermediate/` with 34 module folders.
2. For each module, create every target topic folder per the tables above (empty placeholders for NEW topics).
3. Write a `_config.json` in every module with `{ moduleSlug, seoSlug, altSlugs[], pillar, title }` drawn from ARCHITECTURE.md.

**Phase B — Copy content**
1. Walk the tables above top-to-bottom, copying each source topic folder (with its `questions.json`, `complete-qa.json`, and `answers/*.json`) into its target location.
2. Where multiple sources map to the same target (MERGE), concatenate `questions.json` arrays and `complete-qa.json` arrays, preserving all unique question IDs. Never overwrite an existing `answers/<slug>.json`.

**Phase C — Verify**
1. Count `answers/*.json` files in old tree and new tree — must be ≥ old count in new tree.
2. Count distinct question IDs per module before/after.
3. Output a verification report at `content/MIGRATION_REPORT.md`.

**Phase D — Remove legacy (only after sign-off on the report)**
1. Delete the old `content/domains/java/backend/intermediate/` tree.
2. Keep `content/domains/java/backend/beginner/` untouched (not part of this migration).

---

## Open Decisions Needed From You

| # | Decision | Recommendation |
|---|---|---|
| 1 | M18 design-patterns: split by creational/structural/behavioral *now* vs copy intact and reclassify *later*? | **Copy intact as `design-patterns-legacy`, reclassify in a later pass.** Safer. |
| 2 | `testing/scenario-based`: copy into both M23 and M24, or only into M23? | **Copy into both** so every scenario stays accessible under both modules. |
| 3 | Hibernate caching content (`spring-data-hibernate/caching`) vs general Redis caching (M14): where? | **Hibernate-specific cache Qs → M08/caching**, general cache patterns → M14. Keep both. |
| 4 | Delete old `content/domains/java/backend/intermediate/` after Phase D? | **Yes, delete** once MIGRATION_REPORT verifies zero data loss. |
| 5 | Beginner tree (`content/domains/java/backend/beginner/`) — migrate now too, or later? | **Later.** This map covers intermediate only. |
