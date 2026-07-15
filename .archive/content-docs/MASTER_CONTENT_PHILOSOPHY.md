InterviewExplainer — Complete Architecture Tree



This is the single source of truth for all content and routing decisions.
Every new content file must fit somewhere in this tree. If it doesn't, update this doc first.



The Three-Layer Model

Layer 1: content/shared/          ← written ONCE, universal
Layer 2: content/interview/{lang} ← only what is unique to a language
Layer 3: content/dsa/             ← problems written once, tagged to appear anywhere

$ref Rule (non-negotiable): A file in interview/{lang} may $ref a file in shared/ or another interview/{lang}/ — ONLY at the SAME level. Never across levels. The 3 experience levels are 3 independent products.



LAYER 1 — content/shared/



Everything here is language-agnostic. Tools, frontend libs, architecture, behavioral.
Written once. Referenced by any language/track via $ref.
Also powers /tools/, /topics/, /compare/ hub pages directly.

content/shared/
│
├── tools/                          ← infrastructure & ops tools (same concepts across all langs)
│   ├── kafka/
│   │   ├── beginner/complete-qa.json
│   │   ├── intermediate/complete-qa.json
│   │   └── advanced/complete-qa.json
│   ├── docker/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── kubernetes/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── aws/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── gcp/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── azure/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── redis/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── postgresql/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── mysql/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── mongodb/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── elasticsearch/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── rabbitmq/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── jenkins/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── github-actions/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── gitlab-ci/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── terraform/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── ansible/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── helm/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── nginx/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── git/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── maven/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── gradle/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── prometheus-grafana/
│   │   ├── beginner/ intermediate/ advanced/
│   └── linux/
│       ├── beginner/ intermediate/ advanced/
│
├── frontend/                       ← frontend libraries (same across Java/Python/Ruby/Go fullstack)
│   ├── react/
│   │   ├── beginner/complete-qa.json
│   │   ├── intermediate/complete-qa.json
│   │   └── advanced/complete-qa.json
│   ├── nextjs/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── vue/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── angular/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── svelte/
│   │   ├── beginner/ intermediate/ advanced/
│   └── typescript-frontend/       ← TS as a frontend concern (typing, generics in UI context)
│       ├── beginner/ intermediate/ advanced/
│
├── architecture/                   ← universal design concepts
│   ├── system-design/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── design-patterns/           ← GoF, SOLID, DRY, YAGNI
│   │   ├── beginner/ intermediate/ advanced/
│   ├── microservices/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── event-driven/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── api-design/                ← REST, GraphQL, gRPC, WebSockets
│   │   ├── beginner/ intermediate/ advanced/
│   ├── clean-architecture/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── domain-driven-design/
│   │   ├── beginner/ intermediate/ advanced/
│   └── security/                  ← OAuth2, JWT, OWASP, HTTPS
│       ├── beginner/ intermediate/ advanced/
│
├── data/                           ← data concepts for DA, BA, and DE tracks
│   ├── sql-fundamentals/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── nosql-concepts/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── data-modeling/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── data-warehousing/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── etl-pipelines/
│   │   ├── beginner/ intermediate/ advanced/
│   ├── statistics-basics/         ← for DA/ML tracks
│   │   ├── beginner/ intermediate/ advanced/
│   └── spark-concepts/            ← shared across Java DE and Python DE
│       ├── beginner/ intermediate/ advanced/
│
└── behavioral/                    ← 100% universal, same for every track and language
└── all/complete-qa.json       ← STAR method, leadership principles, conflict, teamwork



LAYER 2 — content/interview/{lang}



Only what is unique to a language goes here.
Framework-specific, core language features, language ecosystem.
Tool and architecture stacks are $ref to shared/.



Java

content/interview/java/
│
├── backend/
│   ├── beginner/
│   │   ├── core-java/complete-qa.json         ← unique: syntax, OOP basics, classes
│   │   ├── spring-boot/complete-qa.json       ← unique: what it is, basic setup, annotations
│   │   ├── collections/complete-qa.json       ← unique: List, Map, Set basics
│   │   ├── exceptions/complete-qa.json        ← unique: checked/unchecked, try-catch
│   │   ├── kafka/complete-qa.json             ← $ref shared/tools/kafka/beginner
│   │   ├── docker/complete-qa.json            ← $ref shared/tools/docker/beginner
│   │   ├── aws/complete-qa.json               ← $ref shared/tools/aws/beginner
│   │   ├── postgresql/complete-qa.json        ← $ref shared/tools/postgresql/beginner
│   │   ├── git/complete-qa.json               ← $ref shared/tools/git/beginner
│   │   ├── maven/complete-qa.json             ← $ref shared/tools/maven/beginner
│   │   └── behavioral/complete-qa.json        ← $ref shared/behavioral/all
│   │
│   ├── intermediate/
│   │   ├── core-java/complete-qa.json         ← unique: generics, streams, lambdas, functional
│   │   ├── advanced-java/complete-qa.json     ← unique: reflection, annotations, bytecode
│   │   ├── spring-boot/complete-qa.json       ← unique: auto-config, actuator, profiles
│   │   ├── spring-core/complete-qa.json       ← unique: IoC, DI, bean lifecycle, AOP
│   │   ├── spring-security/complete-qa.json   ← unique: filter chain, OAuth2 integration
│   │   ├── spring-data-jpa/complete-qa.json   ← unique: repositories, JPQL, N+1 problem
│   │   ├── spring-mvc-rest/complete-qa.json   ← unique: @RestController, exception handlers
│   │   ├── concurrency/complete-qa.json       ← unique: threads, executors, CompletableFuture
│   │   ├── jvm-performance/complete-qa.json   ← unique: GC, heap, JIT, profiling
│   │   ├── hibernate/complete-qa.json         ← unique: sessions, caching levels, mappings
│   │   ├── testing/complete-qa.json           ← unique: JUnit5, Mockito, TestContainers
│   │   ├── kafka/complete-qa.json             ← $ref shared/tools/kafka/intermediate
│   │   ├── docker/complete-qa.json            ← $ref shared/tools/docker/intermediate
│   │   ├── kubernetes/complete-qa.json        ← $ref shared/tools/kubernetes/intermediate
│   │   ├── aws/complete-qa.json               ← $ref shared/tools/aws/intermediate
│   │   ├── redis/complete-qa.json             ← $ref shared/tools/redis/intermediate
│   │   ├── postgresql/complete-qa.json        ← $ref shared/tools/postgresql/intermediate
│   │   ├── mongodb/complete-qa.json           ← $ref shared/tools/mongodb/intermediate
│   │   ├── elasticsearch/complete-qa.json     ← $ref shared/tools/elasticsearch/intermediate
│   │   ├── rabbitmq/complete-qa.json          ← $ref shared/tools/rabbitmq/intermediate
│   │   ├── jenkins/complete-qa.json           ← $ref shared/tools/jenkins/intermediate
│   │   ├── github-actions/complete-qa.json    ← $ref shared/tools/github-actions/intermediate
│   │   ├── terraform/complete-qa.json         ← $ref shared/tools/terraform/intermediate
│   │   ├── git/complete-qa.json               ← $ref shared/tools/git/intermediate
│   │   ├── maven/complete-qa.json             ← $ref shared/tools/maven/intermediate
│   │   ├── gradle/complete-qa.json            ← $ref shared/tools/gradle/intermediate
│   │   ├── system-design/complete-qa.json     ← $ref shared/architecture/system-design/intermediate
│   │   ├── design-patterns/complete-qa.json   ← $ref shared/architecture/design-patterns/intermediate
│   │   ├── microservices/complete-qa.json     ← $ref shared/architecture/microservices/intermediate
│   │   ├── api-design/complete-qa.json        ← $ref shared/architecture/api-design/intermediate
│   │   ├── security/complete-qa.json          ← $ref shared/architecture/security/intermediate
│   │   └── behavioral/complete-qa.json        ← $ref shared/behavioral/all
│   │
│   └── advanced/
│       ├── core-java/complete-qa.json         ← unique: memory model, VarHandle, Panama, Loom
│       ├── spring-boot/complete-qa.json       ← unique: custom starters, multi-tenant arch
│       ├── spring-cloud/complete-qa.json      ← unique: Circuit Breaker, Config Server, Gateway
│       ├── spring-batch/complete-qa.json      ← unique: chunk-oriented processing, partitioning
│       ├── concurrency/complete-qa.json       ← unique: lock-free, virtual threads, STM
│       ├── jvm-performance/complete-qa.json   ← unique: GC tuning, heap dumps, flight recorder
│       ├── kafka/complete-qa.json             ← $ref shared/tools/kafka/advanced
│       ├── kubernetes/complete-qa.json        ← $ref shared/tools/kubernetes/advanced
│       ├── aws/complete-qa.json               ← $ref shared/tools/aws/advanced
│       ├── system-design/complete-qa.json     ← $ref shared/architecture/system-design/advanced
│       ├── domain-driven-design/complete-qa.json ← $ref shared/architecture/domain-driven-design/advanced
│       ├── clean-architecture/complete-qa.json   ← $ref shared/architecture/clean-architecture/advanced
│       └── behavioral/complete-qa.json        ← $ref shared/behavioral/all
│
├── fullstack/
│   ├── beginner/
│   │   ├── spring-boot/complete-qa.json       ← unique (beginner BE side)
│   │   ├── react/complete-qa.json             ← $ref shared/frontend/react/beginner
│   │   └── behavioral/complete-qa.json        ← $ref shared/behavioral/all
│   ├── intermediate/
│   │   ├── spring-boot/complete-qa.json       ← unique (intermediate BE side)
│   │   ├── spring-security/complete-qa.json   ← unique
│   │   ├── react/complete-qa.json             ← $ref shared/frontend/react/intermediate (+ Java API context)
│   │   ├── nextjs/complete-qa.json            ← $ref shared/frontend/nextjs/intermediate
│   │   ├── postgresql/complete-qa.json        ← $ref shared/tools/postgresql/intermediate
│   │   ├── aws/complete-qa.json               ← $ref shared/tools/aws/intermediate
│   │   ├── docker/complete-qa.json            ← $ref shared/tools/docker/intermediate
│   │   └── behavioral/complete-qa.json        ← $ref shared/behavioral/all
│   └── advanced/ (same pattern)
│
├── frontend/                       ← JSP/Thymeleaf niche
│   └── intermediate/
│       ├── jsp-thymeleaf/complete-qa.json     ← unique
│       └── behavioral/complete-qa.json
│
└── android/
├── beginner/
│   ├── android-sdk/complete-qa.json       ← unique
│   ├── android-ui/complete-qa.json        ← unique
│   └── behavioral/complete-qa.json
├── intermediate/
│   ├── android-architecture/complete-qa.json ← unique: MVP, MVVM, MVI
│   ├── jetpack/complete-qa.json           ← unique: Compose, Navigation, ViewModel
│   ├── android-performance/complete-qa.json ← unique
│   └── behavioral/complete-qa.json
└── advanced/
├── android-internals/complete-qa.json ← unique
└── behavioral/complete-qa.json



Python

content/interview/python/
│
├── backend/
│   ├── beginner/
│   │   ├── python-fundamentals/complete-qa.json ← unique: syntax, types, functions, modules
│   │   ├── python-oop/complete-qa.json           ← unique: classes, magic methods, inheritance
│   │   ├── django/complete-qa.json               ← unique: what it is, MTV, basic ORM
│   │   ├── fastapi/complete-qa.json              ← unique: what it is, basic routes, types
│   │   ├── postgresql/complete-qa.json           ← $ref shared/tools/postgresql/beginner
│   │   ├── docker/complete-qa.json               ← $ref shared/tools/docker/beginner
│   │   ├── aws/complete-qa.json                  ← $ref shared/tools/aws/beginner
│   │   ├── git/complete-qa.json                  ← $ref shared/tools/git/beginner
│   │   └── behavioral/complete-qa.json           ← $ref shared/behavioral/all
│   │
│   ├── intermediate/
│   │   ├── python-fundamentals/complete-qa.json  ← unique: decorators, generators, context mgrs
│   │   ├── python-async/complete-qa.json         ← unique: asyncio, event loop, coroutines
│   │   ├── python-typing/complete-qa.json        ← unique: type hints, Protocol, TypeVar
│   │   ├── django/complete-qa.json               ← unique: ORM depth, signals, middleware, caching
│   │   ├── django-rest-framework/complete-qa.json ← unique: serializers, viewsets, permissions
│   │   ├── fastapi/complete-qa.json              ← unique: DI, async endpoints, Pydantic
│   │   ├── flask/complete-qa.json                ← unique: app factory, blueprints, extensions
│   │   ├── celery/complete-qa.json               ← unique: tasks, beat, flower, chains
│   │   ├── sqlalchemy/complete-qa.json           ← unique: sessions, relationships, migrations
│   │   ├── testing-pytest/complete-qa.json       ← unique: fixtures, parametrize, mocks
│   │   ├── kafka/complete-qa.json                ← $ref shared/tools/kafka/intermediate (+ confluent-kafka-python)
│   │   ├── docker/complete-qa.json               ← $ref shared/tools/docker/intermediate
│   │   ├── kubernetes/complete-qa.json           ← $ref shared/tools/kubernetes/intermediate
│   │   ├── aws/complete-qa.json                  ← $ref shared/tools/aws/intermediate (+ boto3)
│   │   ├── redis/complete-qa.json                ← $ref shared/tools/redis/intermediate
│   │   ├── postgresql/complete-qa.json           ← $ref shared/tools/postgresql/intermediate
│   │   ├── mongodb/complete-qa.json              ← $ref shared/tools/mongodb/intermediate
│   │   ├── github-actions/complete-qa.json       ← $ref shared/tools/github-actions/intermediate
│   │   ├── system-design/complete-qa.json        ← $ref shared/architecture/system-design/intermediate
│   │   ├── api-design/complete-qa.json           ← $ref shared/architecture/api-design/intermediate
│   │   ├── microservices/complete-qa.json        ← $ref shared/architecture/microservices/intermediate
│   │   └── behavioral/complete-qa.json           ← $ref shared/behavioral/all
│   │
│   └── advanced/ (same pattern + performance, ML integration, distributed systems)
│
├── fullstack/
│   ├── intermediate/
│   │   ├── django/complete-qa.json              ← unique (fullstack Django angle)
│   │   ├── react/complete-qa.json               ← $ref shared/frontend/react/intermediate
│   │   ├── nextjs/complete-qa.json              ← $ref shared/frontend/nextjs/intermediate
│   │   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   │   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   │   └── behavioral/complete-qa.json
│   └── beginner/ advanced/
│
├── data-engineering/
│   ├── beginner/
│   │   ├── python-for-de/complete-qa.json       ← unique: pandas basics, file I/O, ETL basics
│   │   ├── sql-fundamentals/complete-qa.json    ← $ref shared/data/sql-fundamentals/beginner
│   │   ├── data-modeling/complete-qa.json       ← $ref shared/data/data-modeling/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── airflow/complete-qa.json             ← unique: DAGs, operators, hooks, sensors
│   │   ├── spark/complete-qa.json               ← unique: RDD, DataFrames, PySpark, shuffling
│   │   ├── dbt/complete-qa.json                 ← unique: models, tests, lineage, macros
│   │   ├── pandas-numpy/complete-qa.json        ← unique: vectorization, memory, performance
│   │   ├── data-quality/complete-qa.json        ← unique: Great Expectations, testing pipelines
│   │   ├── kafka/complete-qa.json               ← $ref shared/tools/kafka/intermediate (streaming DE context)
│   │   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   │   ├── aws/complete-qa.json                 ← $ref shared/tools/aws/intermediate (S3, Glue, EMR, Redshift)
│   │   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   │   ├── spark-concepts/complete-qa.json      ← $ref shared/data/spark-concepts/intermediate
│   │   ├── data-warehousing/complete-qa.json    ← $ref shared/data/data-warehousing/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/ (same pattern + streaming at scale, data mesh, lakehouse)
│
└── ml-ai/
├── beginner/
│   ├── ml-fundamentals/complete-qa.json     ← unique: supervised/unsupervised, bias/variance
│   ├── python-for-ml/complete-qa.json       ← unique: numpy, matplotlib, scikit basics
│   └── behavioral/complete-qa.json
├── intermediate/
│   ├── model-training/complete-qa.json      ← unique: training loops, optimizers, loss fns
│   ├── feature-engineering/complete-qa.json ← unique: encoding, scaling, selection
│   ├── mlops/complete-qa.json               ← unique: experiment tracking, model registry
│   ├── pytorch/complete-qa.json             ← unique: tensors, autograd, DataLoader
│   ├── scikit-learn/complete-qa.json        ← unique: pipelines, cross-validation, metrics
│   ├── llm-ops/complete-qa.json             ← unique: RAG, fine-tuning, prompt engineering
│   ├── model-deployment/complete-qa.json    ← unique: FastAPI serving, latency, batching
│   ├── aws/complete-qa.json                 ← $ref shared/tools/aws/intermediate (+ SageMaker)
│   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   ├── kubernetes/complete-qa.json          ← $ref shared/tools/kubernetes/intermediate
│   └── behavioral/complete-qa.json
└── advanced/



JavaScript

content/interview/javascript/
│
├── frontend/
│   ├── beginner/
│   │   ├── js-fundamentals/complete-qa.json    ← unique: var/let/const, hoisting, DOM basics
│   │   ├── js-async/complete-qa.json           ← unique: callbacks, Promises, async/await
│   │   ├── react/complete-qa.json              ← $ref shared/frontend/react/beginner
│   │   ├── git/complete-qa.json                ← $ref shared/tools/git/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── js-fundamentals/complete-qa.json    ← unique: closures, prototypes, event loop
│   │   ├── js-performance/complete-qa.json     ← unique: V8 internals, memory, profiling
│   │   ├── js-patterns/complete-qa.json        ← unique: module patterns, composition, pub/sub
│   │   ├── react/complete-qa.json              ← $ref shared/frontend/react/intermediate
│   │   ├── nextjs/complete-qa.json             ← $ref shared/frontend/nextjs/intermediate
│   │   ├── vue/complete-qa.json                ← $ref shared/frontend/vue/intermediate
│   │   ├── typescript-frontend/complete-qa.json ← $ref shared/frontend/typescript-frontend/intermediate
│   │   ├── testing/complete-qa.json            ← unique: Jest, Testing Library, Playwright
│   │   ├── aws/complete-qa.json                ← $ref shared/tools/aws/intermediate (CDN, Lambda@Edge)
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│       ├── js-internals/complete-qa.json       ← unique: spec reading, TC39, engines
│       ├── react/complete-qa.json              ← $ref shared/frontend/react/advanced
│       └── behavioral/complete-qa.json
│
├── backend/
│   ├── beginner/
│   │   ├── nodejs-fundamentals/complete-qa.json ← unique: event loop, non-blocking I/O, npm
│   │   ├── express/complete-qa.json             ← unique: routes, middleware, error handling
│   │   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/beginner
│   │   ├── mongodb/complete-qa.json             ← $ref shared/tools/mongodb/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── nodejs-fundamentals/complete-qa.json ← unique: streams, worker threads, cluster
│   │   ├── nodejs-performance/complete-qa.json  ← unique: profiling, memory leaks, libuv
│   │   ├── express/complete-qa.json             ← unique: production patterns, security
│   │   ├── nestjs/complete-qa.json              ← unique: modules, guards, interceptors
│   │   ├── kafka/complete-qa.json               ← $ref shared/tools/kafka/intermediate (+ kafkajs)
│   │   ├── redis/complete-qa.json               ← $ref shared/tools/redis/intermediate
│   │   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   │   ├── mongodb/complete-qa.json             ← $ref shared/tools/mongodb/intermediate
│   │   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   │   ├── aws/complete-qa.json                 ← $ref shared/tools/aws/intermediate
│   │   ├── api-design/complete-qa.json          ← $ref shared/architecture/api-design/intermediate
│   │   ├── system-design/complete-qa.json       ← $ref shared/architecture/system-design/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── fullstack/
├── intermediate/
│   ├── nodejs-fundamentals/complete-qa.json ← unique
│   ├── react/complete-qa.json               ← $ref shared/frontend/react/intermediate
│   ├── nextjs/complete-qa.json              ← $ref shared/frontend/nextjs/intermediate
│   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   └── behavioral/complete-qa.json
└── beginner/ advanced/



TypeScript

content/interview/typescript/
│
├── frontend/
│   ├── beginner/
│   │   ├── ts-fundamentals/complete-qa.json    ← unique: types, interfaces, enums, narrowing
│   │   ├── react/complete-qa.json              ← $ref shared/frontend/react/beginner (+ TS overrides)
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── ts-advanced/complete-qa.json        ← unique: mapped types, conditionals, decorators
│   │   ├── react/complete-qa.json              ← $ref shared/frontend/react/intermediate (+ TS types)
│   │   ├── angular/complete-qa.json            ← $ref shared/frontend/angular/intermediate (+ TS)
│   │   ├── nextjs/complete-qa.json             ← $ref shared/frontend/nextjs/intermediate (+ TS)
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
├── backend/
│   ├── intermediate/
│   │   ├── ts-fundamentals/complete-qa.json    ← unique: strict mode, declaration files, paths
│   │   ├── nestjs/complete-qa.json             ← unique: decorators, providers, TS-first DI
│   │   ├── trpc/complete-qa.json               ← unique: type-safe APIs, routers, procedures
│   │   ├── kafka/complete-qa.json              ← $ref shared/tools/kafka/intermediate
│   │   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/intermediate
│   │   ├── redis/complete-qa.json              ← $ref shared/tools/redis/intermediate
│   │   ├── docker/complete-qa.json             ← $ref shared/tools/docker/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── fullstack/
└── intermediate/
├── ts-fundamentals/complete-qa.json    ← unique
├── react/complete-qa.json              ← $ref shared/frontend/react/intermediate (+ TS)
├── nextjs/complete-qa.json             ← $ref shared/frontend/nextjs/intermediate (+ TS)
└── behavioral/complete-qa.json



Go

content/interview/go/
│
└── backend/
├── beginner/
│   ├── go-fundamentals/complete-qa.json    ← unique: syntax, types, structs, pointers
│   ├── go-functions/complete-qa.json       ← unique: first-class functions, closures, defer
│   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/beginner
│   ├── docker/complete-qa.json             ← $ref shared/tools/docker/beginner
│   └── behavioral/complete-qa.json
├── intermediate/
│   ├── go-concurrency/complete-qa.json     ← unique: goroutines, channels, select, sync
│   ├── go-interfaces/complete-qa.json      ← unique: implicit implementation, composition
│   ├── go-error-handling/complete-qa.json  ← unique: error wrapping, sentinel errors, Is/As
│   ├── go-performance/complete-qa.json     ← unique: pprof, escape analysis, GC tuning
│   ├── gin-framework/complete-qa.json      ← unique: routing, middleware, binding
│   ├── grpc-go/complete-qa.json            ← unique: proto files, streaming, interceptors
│   ├── kafka/complete-qa.json              ← $ref shared/tools/kafka/intermediate (+ sarama/franz-go)
│   ├── redis/complete-qa.json              ← $ref shared/tools/redis/intermediate
│   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/intermediate
│   ├── mongodb/complete-qa.json            ← $ref shared/tools/mongodb/intermediate
│   ├── docker/complete-qa.json             ← $ref shared/tools/docker/intermediate
│   ├── kubernetes/complete-qa.json         ← $ref shared/tools/kubernetes/intermediate
│   ├── aws/complete-qa.json                ← $ref shared/tools/aws/intermediate
│   ├── system-design/complete-qa.json      ← $ref shared/architecture/system-design/intermediate
│   ├── microservices/complete-qa.json      ← $ref shared/architecture/microservices/intermediate
│   └── behavioral/complete-qa.json
└── advanced/
├── go-runtime/complete-qa.json         ← unique: runtime scheduler, GC internals
├── go-concurrency/complete-qa.json     ← unique: lock-free, atomic, memory model
├── system-design/complete-qa.json      ← $ref shared/architecture/system-design/advanced
└── behavioral/complete-qa.json



Kotlin

content/interview/kotlin/
│
├── android/
│   ├── beginner/
│   │   ├── kotlin-fundamentals/complete-qa.json ← unique: null safety, data classes, extensions
│   │   ├── android-basics/complete-qa.json      ← unique: activities, fragments, intents
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── coroutines/complete-qa.json          ← unique: suspend fns, scopes, flows, channels
│   │   ├── jetpack-compose/complete-qa.json     ← unique: composables, state, recomposition
│   │   ├── android-architecture/complete-qa.json ← unique: MVVM, ViewModel, Repository, Hilt
│   │   ├── android-performance/complete-qa.json  ← unique: profiler, memory, rendering
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── backend/
├── intermediate/
│   ├── kotlin-fundamentals/complete-qa.json ← unique: DSL, inline fns, sealed classes
│   ├── ktor/complete-qa.json                ← unique: routing, plugins, serialization
│   ├── spring-boot-kotlin/complete-qa.json  ← unique: Spring with Kotlin extensions
│   ├── coroutines-backend/complete-qa.json  ← unique: reactive Kotlin, Flow
│   ├── kafka/complete-qa.json               ← $ref shared/tools/kafka/intermediate
│   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   ├── system-design/complete-qa.json       ← $ref shared/architecture/system-design/intermediate
│   └── behavioral/complete-qa.json
└── advanced/



C#

content/interview/csharp/
│
└── backend/
├── beginner/
│   ├── csharp-fundamentals/complete-qa.json ← unique: syntax, OOP, LINQ basics, async/await
│   ├── aspnet-basics/complete-qa.json       ← unique: controllers, routing, middleware
│   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/beginner
│   └── behavioral/complete-qa.json
├── intermediate/
│   ├── csharp-advanced/complete-qa.json     ← unique: generics, delegates, Expression trees
│   ├── dotnet-core/complete-qa.json         ← unique: DI, configuration, hosting
│   ├── aspnet-core/complete-qa.json         ← unique: filters, auth, health checks
│   ├── entity-framework/complete-qa.json    ← unique: migrations, query optimization, tracking
│   ├── csharp-async/complete-qa.json        ← unique: Task, async/await, ConfigureAwait
│   ├── testing/complete-qa.json             ← unique: xUnit, Moq, FluentAssertions
│   ├── kafka/complete-qa.json               ← $ref shared/tools/kafka/intermediate (+ Confluent .NET)
│   ├── redis/complete-qa.json               ← $ref shared/tools/redis/intermediate
│   ├── postgresql/complete-qa.json          ← $ref shared/tools/postgresql/intermediate
│   ├── docker/complete-qa.json              ← $ref shared/tools/docker/intermediate
│   ├── aws/complete-qa.json                 ← $ref shared/tools/aws/intermediate
│   ├── system-design/complete-qa.json       ← $ref shared/architecture/system-design/intermediate
│   ├── design-patterns/complete-qa.json     ← $ref shared/architecture/design-patterns/intermediate
│   └── behavioral/complete-qa.json
└── advanced/



Ruby

content/interview/ruby/
│
├── backend/
│   ├── beginner/
│   │   ├── ruby-fundamentals/complete-qa.json  ← unique: blocks, procs, lambdas, symbols
│   │   ├── rails-basics/complete-qa.json       ← unique: MVC, routes, conventions, scaffold
│   │   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── ruby-fundamentals/complete-qa.json  ← unique: metaprogramming, mixins, open class
│   │   ├── rails/complete-qa.json              ← unique: ActiveRecord, callbacks, concerns, STI
│   │   ├── rails-api/complete-qa.json          ← unique: serializers, token auth, versioning
│   │   ├── sidekiq/complete-qa.json            ← unique: workers, retries, scheduler
│   │   ├── rspec/complete-qa.json              ← unique: matchers, shared examples, factories
│   │   ├── activerecord/complete-qa.json       ← unique: N+1, eager loading, raw SQL
│   │   ├── kafka/complete-qa.json              ← $ref shared/tools/kafka/intermediate (+ ruby-kafka)
│   │   ├── redis/complete-qa.json              ← $ref shared/tools/redis/intermediate
│   │   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/intermediate
│   │   ├── docker/complete-qa.json             ← $ref shared/tools/docker/intermediate
│   │   ├── aws/complete-qa.json                ← $ref shared/tools/aws/intermediate
│   │   ├── system-design/complete-qa.json      ← $ref shared/architecture/system-design/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── fullstack/
├── beginner/
│   ├── rails-basics/complete-qa.json       ← unique
│   ├── react/complete-qa.json              ← $ref shared/frontend/react/beginner
│   └── behavioral/complete-qa.json
├── intermediate/
│   ├── rails/complete-qa.json              ← unique (fullstack angle)
│   ├── hotwire-turbo/complete-qa.json      ← unique: Turbo Frames, Stimulus, broadcasts
│   ├── react/complete-qa.json              ← $ref shared/frontend/react/intermediate
│   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/intermediate
│   ├── redis/complete-qa.json              ← $ref shared/tools/redis/intermediate
│   ├── docker/complete-qa.json             ← $ref shared/tools/docker/intermediate
│   └── behavioral/complete-qa.json
└── advanced/



DevOps

content/interview/devops/
│
├── cicd/
│   ├── beginner/
│   │   ├── cicd-fundamentals/complete-qa.json  ← unique: what is CI/CD, pipeline basics
│   │   ├── jenkins/complete-qa.json            ← $ref shared/tools/jenkins/beginner
│   │   ├── github-actions/complete-qa.json     ← $ref shared/tools/github-actions/beginner
│   │   ├── docker/complete-qa.json             ← $ref shared/tools/docker/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── cicd-advanced/complete-qa.json      ← unique: branching strategy, deployment patterns
│   │   ├── jenkins/complete-qa.json            ← $ref shared/tools/jenkins/intermediate
│   │   ├── github-actions/complete-qa.json     ← $ref shared/tools/github-actions/intermediate
│   │   ├── gitlab-ci/complete-qa.json          ← $ref shared/tools/gitlab-ci/intermediate
│   │   ├── docker/complete-qa.json             ← $ref shared/tools/docker/intermediate
│   │   ├── kubernetes/complete-qa.json         ← $ref shared/tools/kubernetes/intermediate
│   │   ├── terraform/complete-qa.json          ← $ref shared/tools/terraform/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
├── cloud/
│   ├── beginner/
│   │   ├── cloud-fundamentals/complete-qa.json ← unique: IaaS/PaaS/SaaS, regions, availability
│   │   ├── aws/complete-qa.json                ← $ref shared/tools/aws/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── cloud-architecture/complete-qa.json ← unique: multi-region, HA, disaster recovery
│   │   ├── aws/complete-qa.json                ← $ref shared/tools/aws/intermediate
│   │   ├── gcp/complete-qa.json                ← $ref shared/tools/gcp/intermediate
│   │   ├── azure/complete-qa.json              ← $ref shared/tools/azure/intermediate
│   │   ├── kubernetes/complete-qa.json         ← $ref shared/tools/kubernetes/intermediate
│   │   ├── terraform/complete-qa.json          ← $ref shared/tools/terraform/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
├── infrastructure/
│   ├── intermediate/
│   │   ├── infra-fundamentals/complete-qa.json ← unique: networking, DNS, load balancing
│   │   ├── terraform/complete-qa.json          ← $ref shared/tools/terraform/intermediate
│   │   ├── ansible/complete-qa.json            ← $ref shared/tools/ansible/intermediate
│   │   ├── helm/complete-qa.json               ← $ref shared/tools/helm/intermediate
│   │   ├── kubernetes/complete-qa.json         ← $ref shared/tools/kubernetes/intermediate
│   │   ├── nginx/complete-qa.json              ← $ref shared/tools/nginx/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── sre/
├── intermediate/
│   ├── sre-principles/complete-qa.json     ← unique: SLO/SLI/SLA, error budgets, toil
│   ├── incident-management/complete-qa.json ← unique: on-call, postmortems, runbooks
│   ├── chaos-engineering/complete-qa.json  ← unique: fault injection, GameDay
│   ├── observability/complete-qa.json      ← $ref shared/architecture/observability/intermediate (+ Datadog, PagerDuty)
│   ├── kubernetes/complete-qa.json         ← $ref shared/tools/kubernetes/intermediate
│   ├── prometheus-grafana/complete-qa.json ← $ref shared/tools/prometheus-grafana/intermediate
│   ├── aws/complete-qa.json                ← $ref shared/tools/aws/intermediate
│   └── behavioral/complete-qa.json
└── advanced/



Data Analyst

content/interview/data-analyst/
│
├── sql-analytics/
│   ├── beginner/
│   │   ├── sql-basics/complete-qa.json         ← unique: SELECT, JOIN, GROUP BY, filtering
│   │   ├── sql-fundamentals/complete-qa.json   ← $ref shared/data/sql-fundamentals/beginner
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── sql-advanced/complete-qa.json       ← unique: window functions, CTEs, recursive, pivots
│   │   ├── query-optimization/complete-qa.json ← unique: EXPLAIN, indexes, query plans
│   │   ├── analytical-mindset/complete-qa.json ← unique: metric decomposition, cohort analysis
│   │   ├── postgresql/complete-qa.json         ← $ref shared/tools/postgresql/intermediate (analytics angle)
│   │   ├── sql-fundamentals/complete-qa.json   ← $ref shared/data/sql-fundamentals/intermediate
│   │   ├── data-modeling/complete-qa.json      ← $ref shared/data/data-modeling/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│       ├── sql-expert/complete-qa.json         ← unique: advanced optimizations, execution plans
│       ├── statistics/complete-qa.json         ← $ref shared/data/statistics-basics/advanced
│       └── behavioral/complete-qa.json
│
├── python-analysis/
│   ├── beginner/
│   │   ├── pandas-basics/complete-qa.json      ← unique: DataFrames, Series, read_csv, basic ops
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── pandas-advanced/complete-qa.json    ← unique: groupby, pivot, merge, performance
│   │   ├── numpy/complete-qa.json              ← unique: vectorization, broadcasting
│   │   ├── eda/complete-qa.json                ← unique: exploration, outliers, distributions
│   │   ├── statistics/complete-qa.json         ← $ref shared/data/statistics-basics/intermediate
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
├── visualization/
│   ├── beginner/
│   │   ├── viz-fundamentals/complete-qa.json   ← unique: chart types, when to use what
│   │   └── behavioral/complete-qa.json
│   ├── intermediate/
│   │   ├── tableau/complete-qa.json            ← unique: calculated fields, LOD, dashboard design
│   │   ├── power-bi/complete-qa.json           ← unique: DAX, relationships, bookmarks
│   │   ├── chart-storytelling/complete-qa.json ← unique: choosing chart, narrative, color
│   │   └── behavioral/complete-qa.json
│   └── advanced/
│
└── case-studies/
├── intermediate/
│   ├── metric-analysis/complete-qa.json    ← unique: "why is metric X dropping?", root cause
│   ├── ab-testing/complete-qa.json         ← unique: experiment design, stat significance
│   ├── business-metrics/complete-qa.json   ← unique: DAU/MAU, retention, LTV, funnel
│   └── behavioral/complete-qa.json
└── advanced/



Business Analyst

content/interview/business-analyst/
│
└── analysis/
├── beginner/
│   ├── ba-fundamentals/complete-qa.json    ← unique: role of BA, stakeholder mapping, SDLC
│   ├── requirements-basics/complete-qa.json ← unique: functional vs non-functional, user stories
│   ├── sql-basics/complete-qa.json         ← $ref shared/data/sql-fundamentals/beginner
│   └── behavioral/complete-qa.json         ← $ref shared/behavioral/all
├── intermediate/
│   ├── requirements-engineering/complete-qa.json ← unique: BRD, FRD, use cases, wireframes
│   ├── stakeholder-management/complete-qa.json   ← unique: RACI, conflict resolution, comms
│   ├── agile-scrum/complete-qa.json              ← unique: ceremonies, backlog, acceptance criteria
│   ├── process-design/complete-qa.json           ← unique: BPMN, as-is/to-be, process mapping
│   ├── jira-confluence/complete-qa.json          ← unique: project tracking, documentation
│   ├── sql-analytics/complete-qa.json            ← $ref shared/data/sql-fundamentals/intermediate
│   └── behavioral/complete-qa.json               ← $ref shared/behavioral/all
└── advanced/
├── enterprise-analysis/complete-qa.json      ← unique: capability modeling, gap analysis
├── change-management/complete-qa.json        ← unique: Kotter, ADKAR, adoption metrics
├── sql-advanced/complete-qa.json             ← $ref shared/data/sql-fundamentals/advanced
└── behavioral/complete-qa.json



LAYER 3 — content/dsa/



Problems written once. Tagged to appear inside interview pages via _index.json queries.
Also powers the standalone /dsa/ hub.

content/dsa/
│
├── _index.json                     ← master problem list
│   {
│     slug, title, difficulty, category,
│     patterns: ["hash-map", "two-pointers"],
│     level_tags: ["beginner", "intermediate"],
│     track_tags: ["backend", "frontend", "fullstack"],
│     lang_tags: ["any"],            ← or ["java", "python"] for lang-specific problems
│     company_tags: ["amazon", "google", "microsoft"]
│   }
│
├── arrays/
│   ├── two-sum.json
│   ├── best-time-to-buy-stock.json
│   ├── product-of-array-except-self.json
│   ├── maximum-subarray.json
│   └── container-with-most-water.json
│
├── strings/
│   ├── valid-anagram.json
│   ├── longest-substring-without-repeat.json
│   └── group-anagrams.json
│
├── linked-lists/
│   ├── reverse-linked-list.json
│   ├── detect-cycle.json
│   └── merge-two-sorted-lists.json
│
├── trees/
│   ├── binary-tree-traversal.json
│   ├── validate-bst.json
│   ├── lowest-common-ancestor.json
│   └── serialize-deserialize.json
│
├── graphs/
│   ├── number-of-islands.json
│   ├── course-schedule.json
│   └── word-ladder.json
│
├── dynamic-programming/
│   ├── climbing-stairs.json
│   ├── coin-change.json
│   ├── longest-common-subsequence.json
│   └── word-break.json
│
├── stack-queue/
│   ├── valid-parentheses.json
│   ├── min-stack.json
│   └── sliding-window-maximum.json
│
├── binary-search/
│   ├── search-in-rotated-sorted-array.json
│   └── find-minimum-in-rotated-array.json
│
└── heap/
├── top-k-frequent-elements.json
└── find-median-from-data-stream.json



content/compare/ and content/topics/

content/compare/
├── kafka-vs-rabbitmq.json
├── sql-vs-nosql.json
├── rest-vs-graphql.json
├── docker-vs-kubernetes.json
├── mysql-vs-postgresql.json
├── django-vs-fastapi.json
├── redis-vs-memcached.json
├── microservices-vs-monolith.json
├── jwt-vs-session.json
└── maven-vs-gradle.json

content/topics/
├── system-design.json
├── caching.json
├── microservices.json
├── api-design.json
├── databases.json
├── concurrency.json
├── security.json
└── event-driven-architecture.json

content/companies/
├── amazon/ overview.json dsa.json behavioral.json java-specific.json python-specific.json
├── google/ overview.json dsa.json system-design.json behavioral.json
├── microsoft/ overview.json dsa.json behavioral.json dotnet-specific.json
├── meta/ overview.json dsa.json behavioral.json
└── netflix/ overview.json java-specific.json python-specific.json system-design.json



Reuse Map — What Powers What

flowchart TD
RB["shared/frontend/react/intermediate"]
KB["shared/tools/kafka/intermediate"]
AWS["shared/tools/aws/intermediate"]
SD["shared/architecture/system-design/intermediate"]
BEH["shared/behavioral/all"]
SQL["shared/data/sql-fundamentals/intermediate"]

    RB -->|"$ref"| JFS["java/fullstack/intermediate/react"]
    RB -->|"$ref"| PFS["python/fullstack/intermediate/react"]
    RB -->|"$ref"| RBFS["ruby/fullstack/intermediate/react"]
    RB -->|"$ref"| JSFE["javascript/frontend/intermediate/react"]
    RB -->|"$ref"| TSFE["typescript/frontend/intermediate/react"]

    KB -->|"$ref + Java code"| JBE["java/backend/intermediate/kafka"]
    KB -->|"$ref + Python code"| PBE["python/backend/intermediate/kafka"]
    KB -->|"$ref + Go code"| GBE["go/backend/intermediate/kafka"]
    KB -->|"$ref + Ruby code"| RBBE["ruby/backend/intermediate/kafka"]
    KB -->|"$ref + JS code"| JSBE["javascript/backend/intermediate/kafka"]

    AWS -->|"$ref"| JBE2["java/backend/intermediate/aws"]
    AWS -->|"$ref + boto3"| PBE2["python/backend/intermediate/aws"]
    AWS -->|"$ref"| GBE2["go/backend/intermediate/aws"]
    AWS -->|"$ref"| DevCloud["devops/cloud/intermediate/aws"]

    SD -->|"$ref"| JBE3["java/backend/intermediate/system-design"]
    SD -->|"$ref"| PBE3["python/backend/intermediate/system-design"]
    SD -->|"$ref"| GBE3["go/backend/intermediate/system-design"]

    BEH -->|"$ref"| AllTracks["every track/level behavioral"]

    SQL -->|"$ref"| DA["data-analyst/sql-analytics/intermediate"]
    SQL -->|"$ref"| BA["business-analyst/analysis/intermediate"]



Content Resolution Chain (content-reader.ts)

function resolveStackContent(lang, track, level, stack) {
// Step 1: Language-specific file (may contain $ref)
const interviewPath = `content/interview/${lang}/${track}/${level}/${stack}/complete-qa.json`;
if (exists(interviewPath)) {
const file = readJson(interviewPath);
return file.questions.map(q => resolveRef(q)); // resolves any $ref inline
}

// Step 2: Shared tool (direct, no $ref file needed)
const sharedToolPath = `content/shared/tools/${stack}/${level}/complete-qa.json`;
if (exists(sharedToolPath)) return readJson(sharedToolPath);

// Step 3: Shared frontend lib (for fullstack tracks)
const sharedFrontendPath = `content/shared/frontend/${stack}/${level}/complete-qa.json`;
if (exists(sharedFrontendPath)) return readJson(sharedFrontendPath);

// Step 4: Shared architecture concepts
const sharedArchPath = `content/shared/architecture/${stack}/${level}/complete-qa.json`;
if (exists(sharedArchPath)) return readJson(sharedArchPath);

// Step 5: Shared data concepts (for DA/BA/DE tracks)
const sharedDataPath = `content/shared/data/${stack}/${level}/complete-qa.json`;
if (exists(sharedDataPath)) return readJson(sharedDataPath);

// Step 6: Legacy fallback
const legacyPath = `content/domains/${legacySlug}/${stack}/`;
return exists(legacyPath) ? readLegacy(legacyPath) : null;
}



URL to Content Mapping







URL



Content Source



Notes





/interview/java/backend/intermediate/kafka/



interview/java/backend/intermediate/kafka/ → $ref shared/tools/kafka/intermediate/



Java code examples





/interview/python/backend/intermediate/kafka/



interview/python/backend/intermediate/kafka/ → $ref shared/tools/kafka/intermediate/



Python code examples





/interview/ruby/fullstack/intermediate/react/



interview/ruby/fullstack/intermediate/react/ → $ref shared/frontend/react/intermediate/



Ruby/Rails context





/interview/java/fullstack/intermediate/react/



interview/java/fullstack/intermediate/react/ → $ref shared/frontend/react/intermediate/



Java API context





/interview/data-analyst/sql-analytics/intermediate/sql-advanced/



interview/data-analyst/sql-analytics/intermediate/sql-advanced/



Unique DA content





/tools/kafka/



Reads shared/tools/kafka/ directly, aggregates all levels



No $ref needed





/tools/react/



Reads shared/frontend/react/ directly, aggregates all levels



No $ref needed





/dsa/arrays/



Reads dsa/_index.json filtered by category



With problem links





/interview/java/backend/intermediate/



Lists all stacks + pulls DSA from _index.json (level: intermediate, track: backend)



DSA section on hub



Implementation Order

Sprint 0 — Directory Skeleton + Seed Content

Create all content/shared/ directories. Write 3 seed files:





content/shared/tools/kafka/intermediate/complete-qa.json (8 questions, full content)



content/shared/frontend/react/intermediate/complete-qa.json (8 questions, full content)



content/shared/behavioral/all/complete-qa.json (10 questions, full content)
Then write $ref pointer files to prove the chain works before touching any frontend code.

Sprint 1 — content-reader + Canonical URL Flip (4 files)

Full resolution chain. /interview/ pages render. Old /{domainSlug}/ pages 301 redirect.

Sprint 2 — SEO Layer (5 files)

FAQPage JSON-LD, BreadcrumbList, SSG, sitemap with /interview/ URLs and lastmod.

Sprint 3 — Product Features (7 files)

Practice mode, progress tracking, company tags, direct_answer callout, interviewer_intent, DSA section on level hub pages.

Sprint 4 — $ref Resolution (1 file + content seeds)

resolveRef() + deepMergeWithOverrides(). Prove with Java/Python/Go/Ruby Kafka all pulling from shared.

Sprint 5 — Hub Pages Live (4 files + 15 content files)

/tools/ aggregates real questions. DSA pattern pages. Compare + topics content files.