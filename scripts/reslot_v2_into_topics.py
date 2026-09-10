#!/usr/bin/env python3
"""
scripts/reslot_v2_into_topics.py

Rewrites every content/java-backend-intermediate/<module>/<topic>/complete-qa.json so that:
- ALL V2 questions (from content/interview/java/backend/intermediate/**) are placed into
  their CORRECT topic using a per-module keyword classifier.
- V2 questions are pulled from the V2 source tree (authoritative / richest answers).
- Phase-B (assistant-authored) questions are RETAINED ONLY for (module, topic) combos
  that have zero V2 coverage — i.e. gap-fillers. Everywhere else they are DROPPED.

The current JBI tree is archived to content/.archive/jbi-<timestamp>/ before any write.
"""

import json
import os
import re
import shutil
from collections import defaultdict
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
V2_ROOT = REPO / "content" / "interview" / "java" / "backend" / "intermediate"
JBI_ROOT = REPO / "content" / "java-backend-intermediate"
ARCHIVE_ROOT = REPO / "content" / ".archive"

# V2 source folder (relative to V2_ROOT) → target JBI module slug
V2_TO_MODULE = {
    "01-java-language/01-java-fundamentals": "core-java",
    "01-java-language/02-collections-data-structures": "java-collections",
    "01-java-language/03-java-streams-modern": "java-streams",
    "01-java-language/04-concurrency-multithreading": "java-concurrency",
    "01-java-language/05-jvm-internals-performance": "jvm-internals",
    "02-spring-ecosystem/06-spring-core": "spring-core",
    "02-spring-ecosystem/07-spring-boot": "spring-boot",
    "02-spring-ecosystem/08-data-persistence-jpa-hibernate": "spring-data-jpa",
    "02-spring-ecosystem/09-spring-security": "spring-security",
    "02-spring-ecosystem/10-spring-batch": "spring-batch",
    "03-data-persistence/10-database-design": "sql-databases",
    "03-data-persistence/10-mysql": "sql-databases",
    "03-data-persistence/10-postgresql": "sql-databases",
    "03-data-persistence/11-elasticsearch": "nosql-mongodb",
    "03-data-persistence/11-mongodb": "nosql-mongodb",
    "03-data-persistence/12-redis": "redis-caching",
    "04-apis-messaging/13-graphql": "rest-api",
    "04-apis-messaging/13-grpc": "rest-api",
    "04-apis-messaging/13-rest-apis-spring-mvc": "rest-api",
    "04-apis-messaging/14-microservices": "microservices",
    "04-apis-messaging/14-spring-cloud": "microservices",
    "04-apis-messaging/15-event-driven-architecture": "messaging-events",
    "04-apis-messaging/15-rabbitmq": "messaging-events",
    "04-apis-messaging/15-spring-kafka": "messaging-events",
    "04-apis-messaging/15-websockets": "rest-api",
    "05-architecture-design/16-design-patterns": "design-patterns",
    "05-architecture-design/17-architecture-patterns": "architecture-patterns",
    "05-architecture-design/17-clean-architecture": "architecture-patterns",
    "05-architecture-design/17-domain-driven-design": "architecture-patterns",
    "06-system-design/18-fundamentals-building-blocks": "system-design",
    "06-system-design/19-hld-design-problems": "system-design-cases",
    "06-system-design/19-lld-component-design": "system-design",
    "06-system-design/19-system-design-cases": "system-design-cases",
    "07-security/20-application-security": "application-security",
    "08-testing-quality/21-testing": "unit-testing",
    "08-testing-quality/22-advanced-testing": "advanced-testing",
    "09-devops/23-build-tools": "git-build-tools",
    "09-devops/23-git": "git-build-tools",
    "09-devops/24-ci-cd-pipelines": "cicd",
    "09-devops/24-terraform": "cicd",
    "09-devops/25-docker": "docker",
    "09-devops/26-kubernetes": "kubernetes",
    "10-cloud/27-aws": "aws-cloud",
    "10-cloud/28-azure": "aws-cloud",
    "10-cloud/28-gcp": "aws-cloud",
    "11-production/29-observability-monitoring": "observability",
    "11-production/30-performance-tuning": "production-sre",
    "11-production/30-production-operations": "production-sre",
    "12-professional/31-engineering-practices": "engineering-practices",
    "12-professional/32-behavioral": "behavioral",
}

# Per-module topic classifier. (slug_regex, target_topic) — first match wins.
# Last tuple is the default (regex `.*`) → must exist.
CLASSIFIERS = {
    "core-java": [
        (r"exception|try-with-resources", "exception-handling"),
        (r"generic", "generics-wildcards"),
        (r"^string-|-string-|stringbuilder|stringbuffer|string-pool", "string-handling"),
        (r"reflection|annotation", "reflection-annotations"),
        (r"oop|encapsulation|inheritance|polymorphism|abstraction|composition|this-vs-super|constructor-chain|object-class-methods|shallow.*deep|inner-class|abstract-class-vs-interface|method-overloading|method-overriding|static-keyword|marker-interface|\benum|immutable-class|serialization|default-static-methods", "oop-principles"),
        (r".*", "scenario-based"),
    ],
    "java-collections": [
        (r".*", "collections-internals"),
    ],
    "java-streams": [
        (r".*", "scenario-based"),
    ],
    "java-concurrency": [
        (r"virtual-thread|structured-concurrency", "virtual-threads"),
        (r"completablefuture|completable-future|\bfuture-", "completable-future"),
        (r"executorservice|threadpool|thread-pool|forkjoinpool", "thread-pools-and-executor"),
        (r"memory-model|happens-before|volatile", "java-memory-model"),
        (r"synchronized|reentrantlock|read-write-lock|stampedlock|wait-notify|condition-await", "synchronization-and-locks"),
        (r"concurrenthashmap|blockingqueue|atomicinteger|concurrent-collection", "concurrent-collections"),
        (r"countdownlatch|cyclicbarrier|semaphore|threadlocal", "concurrency-patterns"),
        (r"thread-lifecycle|thread-states|daemon-thread|thread-vs-runnable", "threads-and-lifecycle"),
        (r".*", "scenario-based"),
    ],
    "jvm-internals": [
        (r"\bgc-|garbage-collection", "garbage-collection"),
        (r"memory-leak|heap-dump|stackoverflow|outofmemoryerror", "memory-analysis"),
        (r"profiler|profiling|thread-dump|deadlock-analysis", "profiling-and-debugging"),
        (r"jvm-memory-areas|classloader|jit-compilation", "jvm-architecture"),
        (r"jvm-tuning|startup-optimization|container-settings|spring-boot-jvm", "jvm-tuning"),
        (r".*", "scenario-based"),
    ],
    "spring-core": [
        (r"\baop\b|pointcut", "aop"),
        (r"spring-events|eventlistener|applicationeventpublisher", "spring-events"),
        (r"bean-lifecycle|bean-scopes|postconstruct|predestroy|lazy-annotation|circular-dependency|prototype-in-singleton", "bean-lifecycle"),
        (r"dependency-injection|autowired|qualifier|value-annotation|constructor.*inject|field.*inject|setter.*inject|\binjection", "dependency-injection"),
        (r"component-vs-|component-scan", "custom-components"),
        (r"beanpostprocessor|beanfactory|conditional|spel|expression-language", "spring-internals"),
        (r".*", "scenario-based"),
    ],
    "spring-boot": [
        (r"actuator", "actuator"),
        (r"auto-?configur|application-annotation|startup-sequence|startup-customization|spring-factories", "auto-configuration"),
        (r"embedded-server|embedded-tomcat|embedded-jetty", "embedded-servers"),
        (r"\bprofile", "profiles-and-properties"),
        (r"configuration-propert|properties-vs-yml|logging-configuration|\byml\b", "configuration-management"),
        (r"-testing|testing-slices|slice.*test", "testing"),
        (r"graceful-shutdown|global-exception|troubleshoot", "troubleshooting"),
        (r"vs-spring-framework|vs-spring-mvc", "comparisons"),
        (r"\bstarter", "starters"),
        (r".*", "scenario-based"),
    ],
    "spring-data-jpa": [
        (r"n-plus-one|entity-graph-solving", "n-plus-one-problem"),
        (r"transactional|pessimistic-locking|optimistic-locking", "transactions"),
        (r"cascade-types|orphan-removal|onetomany|manytomany|entity-relationships|fetch-strateg", "entity-relationships"),
        (r"hibernate-caching|l1-l2-cache|query-cache", "caching"),
        (r"hibernate-sql-generation|dirty-checking|flush-modes|lazy-initialization|lazy-vs-eager|session-vs-entitymanager", "hibernate-internals"),
        (r"criteria-api|modifying-bulk|query-optimization|dto-projection", "query-optimization"),
        (r"specifications|repository-method|pagination-sorting|\bdto-", "custom-repositories"),
        (r"flyway|liquibase|database-migration", "database-migrations"),
        (r"multi-datasource|multi-tenancy", "multi-tenancy"),
        (r"jpa-entity-lifecycle|jpa-vs-hibernate|jpa-inheritance", "jpa-fundamentals"),
        (r".*", "scenario-based"),
    ],
    "spring-security": [
        (r"\bjwt", "jwt"),
        (r"oauth2?", "oauth2"),
        (r"csrf|\bcors", "cors-and-csrf"),
        (r"preauthorize|secured|rolesallowed|authorization", "authorization"),
        (r"userdetailsservice|userdetails|session.*token|token.*session|password-hashing", "authentication"),
        (r"authentication-vs-authorization|filter-chain|security-context", "security-fundamentals"),
        (r"withmockuser|security-mock-mvc", "testing"),
        (r".*", "scenario-based"),
    ],
    "spring-batch": [
        (r"vs-spring-integration", "comparisons"),
        (r"itemreader|itemprocessor|itemwriter|chunk-processing", "item-reader-writer-processor"),
        (r"retry|skip-logic|error", "batch-error-handling"),
        (r"job-parameters|restart-failed|job-and-step", "job-and-step-structure"),
        (r".*", "batch-fundamentals"),
    ],
    "rest-api": [
        (r"graphql", "graphql-with-spring"),
        (r"\bgrpc", "grpc-basics"),
        (r"versioning", "versioning"),
        (r"hateoas", "hateoas"),
        (r"openapi|swagger|springdoc", "openapi-and-swagger"),
        (r"exception-handler|error-handling|controller-advice", "error-handling"),
        (r"spring-mvc|restcontroller|handlerinterceptor|async-controller|deferred-result", "spring-mvc-controllers"),
        (r"validation|pagination|content-negotiation|response-entity|file-upload", "request-and-response-handling"),
        (r"feign|rest-client|resttemplate|webclient", "rest-client-and-feign"),
        (r"http-caching|compression", "http-caching-and-compression"),
        (r"api-design|dto-pattern", "api-design"),
        (r"restful|http-status|idempoten|put-vs-patch|http-method", "rest-fundamentals"),
        (r".*", "scenario-based"),
    ],
    "microservices": [
        (r"api-gateway|spring-cloud-gateway", "api-gateway"),
        (r"circuit-breaker|resilience4j", "circuit-breaker"),
        (r"service-discovery|eureka|consul", "service-discovery"),
        (r"service-mesh|sidecar", "service-mesh"),
        (r"config-server|config-management|cloud-config", "config-management"),
        (r"distributed-tracing|correlation-id", "distributed-tracing"),
        (r"load-balancer|loadbalancer|load-balanc", "load-balancing"),
        (r"feign|resttemplate|webclient", "feign-client"),
        (r"\bsaga", "saga-pattern"),
        (r"strangler|migration", "migration-strategies"),
        (r"database-per-microservice|service-design", "service-design"),
        (r"stream-messaging|communication|rest-vs-grpc-vs-messaging", "communication-patterns"),
        (r"microservices-vs-monolith|\bfundamental", "fundamentals"),
        (r".*", "scenario-based"),
    ],
    "messaging-events": [
        (r"rabbitmq|amqp", "rabbitmq"),
        (r"spring-kafka|cloud-stream", "spring-kafka"),
        (r"event-sourcing", "event-sourcing"),
        (r"kafka-template|kafka-listener|kafka-consumer|kafka-producer|kafka-json|kafka-headers|kafka-patterns|outbox|consumer-group-fan-out|retryable-topic|transactional-kafka|acknowledgment-mode", "kafka-patterns"),
        (r"kafka-architecture|schema-evolution|embedded-kafka-testing", "kafka-architecture"),
        (r"dead-letter|exactly-once|at-least-once|idempotent-consumer|deduplication", "message-guarantees"),
        (r"event-driven-vs-request|domain-events-vs-integration", "messaging-fundamentals"),
        (r"stream-processing", "stream-processing"),
        (r"webhook", "webhooks"),
        (r".*", "scenario-based"),
    ],
    "architecture-patterns": [
        (r"clean-architecture|use-case-interactor|rich-domain|anemic-domain|repository-pattern-clean|cross-cutting.*clean", "clean-architecture"),
        (r"ddd|domain-driven|bounded-context|entity-vs-value-object|aggregate|domain-events|ubiquitous-language|anti-corruption|domain-services|tactical-patterns|strategic-ddd", "domain-driven-design"),
        (r"hexagonal|ports-and-adapters|ports.*adapters", "hexagonal-architecture"),
        (r"cqrs|event-sourcing-pattern", "cqrs-and-event-sourcing"),
        (r"microservice|\bsaga-|strangler|shared-database|database-per-service", "microservices-patterns"),
        (r"monolith-vs|bff-pattern|service-mesh-architecture|layered-architecture", "architectural-styles"),
        (r".*", "scenario-based"),
    ],
    "design-patterns": [
        (r"solid", "solid-principles"),
        (r"singleton|factory|builder|creational", "creational-patterns"),
        (r"decorator|\bproxy|structural|adapter|facade|composite", "structural-patterns"),
        (r"observer|strategy|template-method|command|iterator|visitor|\bstate-|behavioral", "behavioral-patterns"),
        (r"refactor", "refactoring"),
        (r"technical-debt", "technical-debt"),
        (r".*", "design-patterns-legacy"),
    ],
    "system-design": [
        (r"cap-theorem", "cap-theorem"),
        (r"capacity|back-of-envelope", "capacity-planning"),
        (r"load-balanc", "load-balancing"),
        (r"scaling|scalability|horizontal-vs-vertical", "scalability"),
        (r"\bcache|caching|lru-cache|kv-store", "caching-at-scale"),
        (r"database-sharding|database-replication|database-design|sharding", "database-design-at-scale"),
        (r"event-driven|message-queue|event-streams|pubsub|event-bus|event-sourcing", "event-driven-design"),
        (r"circuit-breaker|retry-exponential-backoff|high-availability", "high-availability"),
        (r"microservice", "microservices-design"),
        (r"consistent-hashing|api-gateway|cdn-edge|design-fundamentals", "design-fundamentals"),
        (r".*", "scenario-based"),
    ],
    "system-design-cases": [
        (r"rate-limiter", "rate-limiter"),
        (r"url-shortener", "url-shortener"),
        (r"notification", "notification-service"),
        (r"search-autocomplete", "search-autocomplete"),
        (r"chat-messaging|chat-system", "chat-system"),
        (r"social-media|social-feed|\bfeed", "social-media-feed"),
        (r"payment|idempoten.*payment|order-management|ecommerce", "payment-system"),
        (r".*", "scenario-based"),
    ],
    "sql-databases": [
        (r"postgresql", "postgresql-features"),
        (r"window-function|advanced-sql", "advanced-sql-features"),
        (r"\bindex|btree|hash.*index", "indexes-and-performance"),
        (r"\bjoin|subquer", "joins-and-subqueries"),
        (r"connection-pool|hikaricp|pgbouncer", "connection-pooling"),
        (r"query-optimization|\bexplain|slow-query|query-cache", "query-optimization"),
        (r"transaction|acid|isolation|innodb-locking", "transactions-and-acid"),
        (r"sharding|partitioning", "partitioning-and-sharding"),
        (r"replication", "replication"),
        (r"migration|flyway|liquibase", "database-migrations"),
        (r"backup|recovery", "backup-recovery"),
        (r"normalization|many-to-many|sql-fundamental|sql-vs-nosql", "sql-fundamentals"),
        (r".*", "scenario-based"),
    ],
    "nosql-mongodb": [
        (r"elasticsearch|inverted-index|full-text-search", "elasticsearch-basics"),
        (r"document-model|embedding|referencing", "document-model"),
        (r"indexing|mongodb-index|compound|sparse|\bttl", "mongodb-indexes"),
        (r"spring-data-mongodb|change-streams.*spring", "mongodb-with-spring"),
        (r"mongodb", "mongodb-core"),
        (r".*", "scenario-based"),
    ],
    "redis-caching": [
        (r"rdb|aof|persistence", "redis-persistence"),
        (r"redis-cluster|sentinel|rate-limiting-redis", "redis-advanced"),
        (r"data-structures", "redis-data-structures"),
        (r"spring-cache|spring-session-redis|spring-data-redis", "spring-data-redis"),
        (r"distributed-lock|redisson", "distributed-caching"),
        (r"cache-stampede|thundering-herd|cache-patterns", "cache-patterns"),
        (r"invalidation", "cache-invalidation"),
        (r"caching-strateg|cache-strategies", "caching-strategies"),
        (r"memory-optimization|performance", "performance-optimization"),
        (r"caffeine", "caffeine-cache"),
        (r".*", "scenario-based"),
    ],
    "unit-testing": [
        (r"testcontainers", "testcontainers"),
        (r"mockito|argumentcaptor", "mocking-with-mockito"),
        (r"springboottest|mockmvc|slice-variants|slices-compari|spring-test-slice|testing-spring-security|spring-boot-testing", "spring-boot-testing"),
        (r"integration-testing|testing-kafka|embedded-kafka", "integration-testing"),
        (r"testing-async|code-coverage|jacoco|unit-testing-advanced", "unit-testing-advanced"),
        (r".*", "unit-testing-basics"),
    ],
    "git-build-tools": [
        (r"\bmaven\b|\bpom\b", "maven-build"),
        (r"gradle", "gradle-build"),
        (r"git-flow|merge-vs-rebase|resolving-merge-conflicts|git-workflow|trunk-based", "git-workflows"),
        (r"git-hooks|sonar|code-quality", "code-quality-gates"),
        (r"git-internal|interactive-rebase|cherry-pick|git-bisect|squashing-commits|monorepo-vs-polyrepo", "git-internals"),
        (r".*", "scenario-based"),
    ],
    "cicd": [
        (r"terraform|infrastructure-as-code", "infrastructure-as-code"),
        (r"jenkins", "jenkins-pipelines"),
        (r"github-actions", "github-actions"),
        (r"rollback", "rollback-strategies"),
        (r"blue-green|canary|deployment-strategy", "deployment-strategies"),
        (r".*", "cicd-fundamentals"),
    ],
    "docker": [
        (r"docker-compose", "docker-compose"),
        (r"multistage|multi-stage|layer-caching", "multi-stage-builds"),
        (r"docker-network", "docker-networking"),
        (r"docker-security|image-scanning|non-root|\bsecrets", "docker-security"),
        (r".*", "docker-fundamentals"),
    ],
    "kubernetes": [
        (r"\bhelm\b", "helm"),
        (r"kubernetes-networking|pod-networking|service-types", "kubernetes-networking"),
        (r"configmap|kubernetes-secret|namespace|\brbac", "kubernetes-configuration"),
        (r"horizontal-pod-autoscaler|autoscaling|\bhpa|kubernetes-scaling", "kubernetes-scaling"),
        (r"liveness|readiness|startup-probe|rolling-update|rollback|persistent-volume|statefulset|\bdeployment|\bpod\b|resource-request", "kubernetes-workloads"),
        (r".*", "kubernetes-fundamentals"),
    ],
    "aws-cloud": [
        (r"azure|gcp|google-cloud|cloud-run|cloud-spanner|cloud-sql|bigquery|active-directory|key-vault|blob-storage|\bgke\b|cloud-monitoring|cloud-storage|pubsub|cosmos-db|spring-apps|service-bus|event-hub|container-registry|application-insights|azure-functions|managed-identity|api-management", "gcp-and-azure-overview"),
        (r"\bs3\b", "s3-storage"),
        (r"\becs|fargate", "ecs-and-fargate"),
        (r"lambda|serverless|cloud-function", "serverless"),
        (r"\biam|secrets-manager|parameter-store", "iam-and-security"),
        (r"\bsqs|\bsns|eventbridge|aws-messaging", "aws-messaging"),
        (r"\brds|aurora|dynamodb", "rds-with-spring"),
        (r".*", "aws-core-services"),
    ],
    "observability": [
        (r"health-check|readiness-check", "health-checks-and-probes"),
        (r"prometheus|grafana", "prometheus-and-grafana"),
        (r"distributed-tracing|sleuth|zipkin|jaeger|latency-bottleneck", "distributed-tracing"),
        (r"log-aggregation|elk-stack", "distributed-log-aggregation"),
        (r"structured-log|slf4j|logback|log-levels", "structured-logging"),
        (r"micrometer|metrics|three-pillars", "metrics-and-micrometer"),
        (r"alerting|\bslo|\bsla|error-budget", "alerting"),
        (r"\bapm", "apm-tools"),
        (r".*", "scenario-based"),
    ],
    "production-sre": [
        (r"capacity-planning", "capacity-planning"),
        (r"chaos-engineering|chaos", "chaos-engineering"),
        (r"memory-leak|memory-footprint", "memory-leaks"),
        (r"runbook", "runbooks"),
        (r"performance-troubleshoot|profile.*performance|thread-pools-for-optimal|slow-database|latency-vs-throughput|benchmark|anti-pattern|json-serialization|async-processing|connection-pool.*performance", "performance-troubleshooting"),
        (r"cpu-spike|debugging-production", "debugging-production"),
        (r"feature-flag|circuit-breaker-pattern-production|zero-downtime|key-health-check|sre-vs-devops", "sre-practices"),
        (r".*", "scenario-based"),
    ],
    "behavioral": [
        (r"mentor|mentoring", "technical-leadership"),
        (r"disagreement|conflict", "conflict-resolution"),
        (r"failure|lessons-learned", "failure-and-learning"),
        (r"prioritize|under-pressure|quality-under-pressure", "delivering-under-pressure"),
        (r"learn-new|stay-current|career", "career-growth"),
        (r"agile|scrum", "agile-and-scrum"),
        (r"end-to-end|project-ownership|improve-system|code-review|technical-debt", "technical-leadership"),
        (r".*", "star-method"),
    ],
    "application-security": [(r".*", "scenario-based")],
    "advanced-testing": [(r".*", "scenario-based")],
    "engineering-practices": [(r".*", "scenario-based")],
    "cloud-native": [(r".*", "scenario-based")],
    "spring-webflux": [(r".*", "scenario-based")],
}


def classify(module: str, slug: str) -> str:
    rules = CLASSIFIERS.get(module)
    if not rules:
        return "scenario-based"
    for pat, topic in rules:
        if re.search(pat, slug):
            return topic
    return rules[-1][1]


def load_v2_questions():
    """Returns (list of tuples, set of slugs)."""
    v2 = []
    slugs = set()
    for src_folder, mod in V2_TO_MODULE.items():
        qa = V2_ROOT / src_folder / "complete-qa.json"
        if not qa.exists():
            continue
        try:
            d = json.loads(qa.read_text())
        except Exception as e:
            print(f"  ! skip {src_folder}: {e}")
            continue
        qs = d.get("questions", []) if isinstance(d, dict) else d
        for q in qs:
            slug = q.get("slug") or q.get("id")
            if not slug:
                continue
            v2.append((src_folder, mod, slug, q))
            slugs.add(slug)
    return v2, slugs


def load_current_jbi():
    cur = defaultdict(list)
    for m_dir in sorted(JBI_ROOT.iterdir()):
        if not m_dir.is_dir() or m_dir.name.startswith("_") or m_dir.name.startswith("."):
            continue
        for t_dir in sorted(m_dir.iterdir()):
            if not t_dir.is_dir():
                continue
            qa = t_dir / "complete-qa.json"
            if not qa.exists():
                continue
            try:
                d = json.loads(qa.read_text())
            except Exception:
                continue
            qs = d.get("questions", []) if isinstance(d, dict) else d
            for q in qs:
                cur[(m_dir.name, t_dir.name)].append(q)
    return cur


def archive_jbi():
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    dest = ARCHIVE_ROOT / f"jbi-{ts}"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(JBI_ROOT, dest)
    return dest


def write_topic(module: str, topic: str, questions: list):
    d = JBI_ROOT / module / topic
    d.mkdir(parents=True, exist_ok=True)
    title = topic.replace("-", " ").title()
    envelope = {"topic": title, "topicSlug": topic, "questions": questions}
    (d / "complete-qa.json").write_text(json.dumps(envelope, indent=2))


def main():
    print("==== RESLOT V2 → correct topics ====")
    print(f"V2 root : {V2_ROOT}")
    print(f"JBI root: {JBI_ROOT}\n")

    archive = archive_jbi()
    print(f"Archived current JBI → {archive}\n")

    v2_all, v2_slugs = load_v2_questions()
    cur = load_current_jbi()
    before_total = sum(len(v) for v in cur.values())
    print(f"V2 source questions : {len(v2_all)}")
    print(f"Current JBI before  : {before_total} Q\n")

    # Classify V2
    new_v2_bucket = defaultdict(list)
    seen = set()
    classification_log = []
    for src_folder, module, slug, q in v2_all:
        if slug in seen:
            continue
        seen.add(slug)
        topic = classify(module, slug)
        new_v2_bucket[(module, topic)].append(q)
        classification_log.append((module, topic, slug, src_folder))

    # Merge Phase-B gap-fillers
    new_final = dict(new_v2_bucket)
    for (module, topic), qs in cur.items():
        if (module, topic) in new_v2_bucket:
            continue
        keep = [q for q in qs if (q.get("slug") or q.get("id")) not in v2_slugs]
        if keep:
            new_final[(module, topic)] = keep

    # Wipe + rewrite
    for m_dir in JBI_ROOT.iterdir():
        if not m_dir.is_dir() or m_dir.name.startswith("_") or m_dir.name.startswith("."):
            continue
        for t_dir in m_dir.iterdir():
            if not t_dir.is_dir():
                continue
            qa = t_dir / "complete-qa.json"
            title = t_dir.name.replace("-", " ").title()
            qa.write_text(json.dumps({"topic": title, "topicSlug": t_dir.name, "questions": []}, indent=2))

    total = 0
    v2_total = 0
    phaseB_total = 0
    for (module, topic), qs in sorted(new_final.items()):
        write_topic(module, topic, qs)
        v2_count = sum(1 for q in qs if (q.get("slug") or q.get("id")) in v2_slugs)
        total += len(qs)
        v2_total += v2_count
        phaseB_total += (len(qs) - v2_count)

    print(f"After reslot → {total} Q  (V2: {v2_total}, Phase-B kept: {phaseB_total})")
    print(f"Phase-B dropped: {before_total - len(v2_all) - phaseB_total + (len(v2_all) - v2_total)}")

    # Per-module report
    print("\n==== FINAL PER-MODULE BREAKDOWN ====")
    by_mod = defaultdict(list)
    for (m, t), qs in new_final.items():
        v2c = sum(1 for q in qs if (q.get("slug") or q.get("id")) in v2_slugs)
        by_mod[m].append((t, len(qs), v2c))
    for m in sorted(by_mod):
        tot = sum(c for _, c, _ in by_mod[m])
        v2c = sum(v for _, _, v in by_mod[m])
        print(f"\n[{m}] — {tot} Q (V2: {v2c}, Phase-B: {tot - v2c})")
        for t, c, v in sorted(by_mod[m]):
            tag = "V2" if v == c else ("V2+PB" if v > 0 else "PB")
            print(f"   {t:40s} {c:3d}  ({tag})")

    # Write report file
    report = REPO / "content" / "MIGRATION_REPORT.md"
    lines = []
    lines.append("\n## Phase E Reslot (auto-generated)\n")
    lines.append(f"_Run at: {datetime.now().isoformat()}_\n")
    lines.append(f"- V2 source questions: **{len(v2_all)}**")
    lines.append(f"- JBI before reslot: **{before_total} Q**")
    lines.append(f"- JBI after reslot: **{total} Q** (V2: {v2_total}, Phase-B kept as gap-filler: {phaseB_total})")
    lines.append(f"- Archive: `{archive.relative_to(REPO)}`\n")
    lines.append("### Per-module after reslot\n")
    for m in sorted(by_mod):
        tot = sum(c for _, c, _ in by_mod[m])
        v2c = sum(v for _, _, v in by_mod[m])
        lines.append(f"\n**{m}** — {tot} Q (V2: {v2c}, Phase-B: {tot - v2c})")
        for t, c, v in sorted(by_mod[m]):
            tag = "V2" if v == c else ("V2+PB" if v > 0 else "PB")
            lines.append(f"- `{t}` — {c} ({tag})")
    existing = report.read_text() if report.exists() else "# Migration Report\n"
    report.write_text(existing + "\n" + "\n".join(lines) + "\n")
    print(f"\nWrote report → {report.relative_to(REPO)}")


if __name__ == "__main__":
    main()
