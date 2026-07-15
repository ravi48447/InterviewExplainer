"""
Phase B + C — Copy existing Q&A content into the new tree, then verify.

Phase B:
    For every mapping row below, copy the source topic folder's
    questions.json / complete-qa.json / answers/*.json into its target
    topic folder under content/java-backend-intermediate/.

    - KEEP/RENAME  : straight copy
    - MERGE         : concat JSON arrays by unique id; don't overwrite answers/*
    - COPY_BOTH     : same source copied into two different targets
                       (used for testing/scenario-based into M23 + M24, and
                        a few other safely-duplicated moves)

Phase C:
    Count source and target answer files + question ids, write a report to
    content/MIGRATION_REPORT.md, and fail loudly if the new tree has fewer
    unique question ids than the old tree.

Nothing is ever deleted. The old tree lives on until Phase D (archive).
"""

from __future__ import annotations

import json
import shutil
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = REPO_ROOT / "content" / "domains" / "java" / "backend" / "intermediate"
DST_ROOT = REPO_ROOT / "content" / "java-backend-intermediate"
REPORT_PATH = REPO_ROOT / "content" / "MIGRATION_REPORT.md"

# ---------------------------------------------------------------------------
# Full mapping table.
#
# Each row:  (source_module, source_topic, target_module, target_topic)
#
# A source may appear multiple times (SPLIT / COPY_BOTH).
# A target may appear multiple times (MERGE).
# ---------------------------------------------------------------------------

MAPPINGS: list[tuple[str, str, str, str]] = [
    # ===== M01 core-java =====
    ("core-java", "oop-principles",            "core-java", "oop-principles"),
    ("core-java", "generics-wildcards",        "core-java", "generics-wildcards"),
    ("core-java", "exceptions-best-practices", "core-java", "exception-handling"),
    ("core-java", "string-handling",           "core-java", "string-handling"),
    ("core-java", "reflection-annotations",    "core-java", "reflection-annotations"),
    ("core-java", "scenario-based",            "core-java", "scenario-based"),

    # ===== M02 java-collections =====
    ("collections-data-structures", "collections-internals",   "java-collections", "collections-internals"),
    ("collections-data-structures", "algorithm-complexity",    "java-collections", "algorithm-complexity"),
    ("collections-data-structures", "trees-graphs",            "java-collections", "trees-and-graphs"),
    ("collections-data-structures", "dynamic-programming",     "java-collections", "dynamic-programming"),
    ("collections-data-structures", "problem-solving-patterns","java-collections", "problem-solving-patterns"),
    ("collections-data-structures", "scenario-based",          "java-collections", "scenario-based"),

    # ===== M03 java-streams (split of advanced-java + pulls from core-java) =====
    ("advanced-java", "streams-lambdas",        "java-streams", "streams-api"),
    ("advanced-java", "optional-functional",    "java-streams", "optional-api"),
    ("advanced-java", "modern-java-features",   "java-streams", "java-14-to-17-features"),
    ("core-java",     "java-8-features",        "java-streams", "lambdas-functional-interfaces"),
    ("core-java",     "functional-programming", "java-streams", "lambdas-functional-interfaces"),

    # ===== M04 java-concurrency (split of advanced-java + pulls) =====
    ("advanced-java",               "java-concurrency",        "java-concurrency", "threads-and-lifecycle"),
    ("advanced-java",               "completablefuture",       "java-concurrency", "completable-future"),
    ("core-java",                   "multithreading-concurrency","java-concurrency","synchronization-and-locks"),
    ("collections-data-structures", "concurrent-collections",  "java-concurrency", "concurrent-collections"),

    # ===== M05 jvm-internals =====
    ("jvm-performance", "jvm-architecture",      "jvm-internals", "jvm-architecture"),
    ("jvm-performance", "garbage-collection",    "jvm-internals", "garbage-collection"),
    ("jvm-performance", "jvm-tuning",            "jvm-internals", "jvm-tuning"),
    ("jvm-performance", "memory-analysis",       "jvm-internals", "memory-analysis"),
    ("jvm-performance", "profiling-debugging",   "jvm-internals", "profiling-and-debugging"),
    ("jvm-performance", "scenario-based",        "jvm-internals", "scenario-based"),

    # ===== M06 spring-core =====
    ("spring-core",   "dependency-injection", "spring-core", "dependency-injection"),
    ("spring-core",   "bean-lifecycle",       "spring-core", "bean-lifecycle"),
    ("spring-core",   "aop",                  "spring-core", "aop"),
    ("spring-core",   "spring-internals",     "spring-core", "spring-internals"),
    ("spring-core",   "custom-components",    "spring-core", "custom-components"),
    ("spring-core",   "scenario-based",       "spring-core", "scenario-based"),
    ("event-driven",  "spring-events",        "spring-core", "spring-events"),

    # ===== M07 spring-boot =====
    ("spring-boot", "auto-configuration",       "spring-boot", "auto-configuration"),
    ("spring-boot", "starters",                 "spring-boot", "starters"),
    ("spring-boot", "actuator",                 "spring-boot", "actuator"),
    ("spring-boot", "profiles-properties",      "spring-boot", "profiles-and-properties"),
    ("spring-boot", "application-properties",   "spring-boot", "profiles-and-properties"),
    ("spring-boot", "embedded-servers",         "spring-boot", "embedded-servers"),
    ("spring-boot", "configuration-management", "spring-boot", "configuration-management"),
    ("spring-boot", "testing",                  "spring-boot", "testing"),
    ("spring-boot", "troubleshooting",          "spring-boot", "troubleshooting"),
    ("spring-boot", "devtools-profiles",        "spring-boot", "troubleshooting"),
    ("spring-boot", "scenario-based",           "spring-boot", "scenario-based"),

    # ===== M08 spring-data-jpa =====
    ("spring-data-hibernate", "jpa-fundamentals",         "spring-data-jpa", "jpa-fundamentals"),
    ("spring-data-hibernate", "hibernate-internals",      "spring-data-jpa", "hibernate-internals"),
    ("spring-data-hibernate", "jpa-hibernate-internals",  "spring-data-jpa", "hibernate-internals"),
    ("spring-data-hibernate", "spring-data-jpa",          "spring-data-jpa", "spring-data-jpa"),
    ("spring-data-hibernate", "entity-relationships",     "spring-data-jpa", "entity-relationships"),
    ("spring-data-hibernate", "transactions",             "spring-data-jpa", "transactions"),
    ("spring-data-hibernate", "n-plus-one-problem",       "spring-data-jpa", "n-plus-one-problem"),
    ("spring-data-hibernate", "query-optimization",       "spring-data-jpa", "query-optimization"),
    ("spring-data-hibernate", "custom-repositories",      "spring-data-jpa", "custom-repositories"),
    ("spring-data-hibernate", "database-migrations",      "spring-data-jpa", "database-migrations"),
    ("spring-data-hibernate", "batch-processing",         "spring-data-jpa", "batch-processing"),
    ("spring-data-hibernate", "multi-tenancy",            "spring-data-jpa", "multi-tenancy"),
    ("spring-data-hibernate", "caching",                  "spring-data-jpa", "caching"),
    ("spring-data-hibernate", "caching-strategies",       "spring-data-jpa", "caching"),
    ("spring-data-hibernate", "scenario-based",           "spring-data-jpa", "scenario-based"),

    # ===== M09 spring-security =====
    ("spring-security", "authentication",               "spring-security", "authentication"),
    ("spring-security", "authentication-authorization", "spring-security", "authentication"),
    ("spring-security", "authorization",                "spring-security", "authorization"),
    ("spring-security", "jwt",                          "spring-security", "jwt"),
    ("spring-security", "oauth2",                       "spring-security", "oauth2"),
    ("spring-security", "oauth2-jwt",                   "spring-security", "oauth2"),
    ("spring-security", "cors-csrf",                    "spring-security", "cors-and-csrf"),
    ("spring-security", "sso-saml",                     "spring-security", "sso-and-saml"),
    ("spring-security", "security-config",              "spring-security", "security-configuration"),
    ("spring-security", "security-configuration",       "spring-security", "security-configuration"),
    ("spring-security", "testing",                      "spring-security", "testing"),
    ("spring-security", "scenario-based",               "spring-security", "scenario-based"),
    ("rest-api-web",    "security-cors-csrf",           "spring-security", "cors-and-csrf"),
    ("security",        "authentication",               "spring-security", "authentication"),
    ("security",        "authorization",                "spring-security", "authorization"),

    # ===== M10 spring-webflux : empty =====
    # ===== M11 spring-batch   : empty =====

    # ===== M12 sql-databases (merge sql-databases + postgresql + database) =====
    ("sql-databases", "sql-fundamentals",     "sql-databases", "sql-fundamentals"),
    ("sql-databases", "joins-subqueries",     "sql-databases", "joins-and-subqueries"),
    ("sql-databases", "indexes-performance",  "sql-databases", "indexes-and-performance"),
    ("sql-databases", "transactions-acid",    "sql-databases", "transactions-and-acid"),
    ("postgresql",    "postgresql-basics",    "sql-databases", "postgresql-features"),
    ("postgresql",    "advanced-features",    "sql-databases", "postgresql-features"),
    ("postgresql",    "jsonb-queries",        "sql-databases", "advanced-sql-features"),
    ("postgresql",    "performance-tuning",   "sql-databases", "query-optimization"),
    ("database",      "connection-pooling",   "sql-databases", "connection-pooling"),
    ("database",      "query-optimization",   "sql-databases", "query-optimization"),
    ("database",      "indexing",             "sql-databases", "indexes-and-performance"),
    ("database",      "partitioning-sharding","sql-databases", "partitioning-and-sharding"),
    ("database",      "replication",          "sql-databases", "replication"),
    ("database",      "migrations",           "sql-databases", "database-migrations"),
    ("database",      "backup-recovery",      "sql-databases", "backup-recovery"),
    ("database",      "scenario-based",       "sql-databases", "scenario-based"),

    # ===== M13 nosql-mongodb =====
    ("database", "nosql-integration", "nosql-mongodb", "mongodb-with-spring"),

    # ===== M14 redis-caching (merge redis + caching-performance) =====
    ("redis",               "redis-data-structures",   "redis-caching", "redis-data-structures"),
    ("redis",               "redis-advanced",          "redis-caching", "redis-advanced"),
    ("redis",               "caching-patterns",        "redis-caching", "cache-patterns"),
    ("redis",               "spring-data-redis",       "redis-caching", "spring-data-redis"),
    ("caching-performance", "cache-patterns",          "redis-caching", "cache-patterns"),
    ("caching-performance", "caching-strategies",      "redis-caching", "caching-strategies"),
    ("caching-performance", "caffeine-cache",          "redis-caching", "caffeine-cache"),
    ("caching-performance", "distributed-caching",     "redis-caching", "distributed-caching"),
    ("caching-performance", "invalidation",            "redis-caching", "cache-invalidation"),
    ("caching-performance", "redis",                   "redis-caching", "redis-advanced"),
    ("caching-performance", "redis-spring",            "redis-caching", "spring-data-redis"),
    ("caching-performance", "performance-optimization","redis-caching", "performance-optimization"),
    ("caching-performance", "performance-tuning",      "redis-caching", "performance-optimization"),
    ("caching-performance", "scenario-based",          "redis-caching", "scenario-based"),

    # ===== M15 rest-api =====
    ("rest-api-web",        "rest-fundamentals",         "rest-api", "rest-fundamentals"),
    ("rest-api-web",        "spring-mvc-controllers",    "rest-api", "spring-mvc-controllers"),
    ("rest-api-web",        "request-response-handling", "rest-api", "request-and-response-handling"),
    ("rest-api-web",        "api-design",                "rest-api", "api-design"),
    ("rest-api-web",        "error-handling",            "rest-api", "error-handling"),
    ("rest-api-web",        "exception-handling",        "rest-api", "error-handling"),
    ("rest-api-web",        "api-documentation",         "rest-api", "openapi-and-swagger"),
    ("rest-api-web",        "documentation-openapi",     "rest-api", "openapi-and-swagger"),
    ("rest-api-web",        "hateoas-graphql",           "rest-api", "hateoas"),
    ("rest-api-web",        "restclient-feign",          "rest-api", "rest-client-and-feign"),
    ("rest-api-web",        "performance",               "rest-api", "http-caching-and-compression"),
    ("rest-api-web",        "versioning",                "rest-api", "versioning"),
    ("rest-api-web",        "scenario-based",            "rest-api", "scenario-based"),
    ("caching-performance", "cdn-optimization",          "rest-api", "http-caching-and-compression"),
    ("caching-performance", "http-optimization",         "rest-api", "http-caching-and-compression"),
    ("system-design",       "api-design",                "rest-api", "api-design"),

    # ===== M16 microservices =====
    ("microservices",             "fundamentals",           "microservices", "fundamentals"),
    ("microservices",             "service-design",         "microservices", "service-design"),
    ("microservices",             "api-gateway",            "microservices", "api-gateway"),
    ("microservices",             "service-discovery",      "microservices", "service-discovery"),
    ("microservices",             "circuit-breaker",        "microservices", "circuit-breaker"),
    ("microservices",             "load-balancing",         "microservices", "load-balancing"),
    ("microservices",             "feign-client",           "microservices", "feign-client"),
    ("microservices",             "config-management",      "microservices", "config-management"),
    ("microservices",             "spring-cloud-config",    "microservices", "config-management"),
    ("microservices",             "distributed-tracing",    "microservices", "distributed-tracing"),
    ("microservices",             "resilience-patterns",    "microservices", "resilience-patterns"),
    ("microservices",             "communication-patterns", "microservices", "communication-patterns"),
    ("microservices",             "service-mesh",           "microservices", "service-mesh"),
    ("microservices",             "contract-testing",       "microservices", "contract-testing"),
    ("microservices",             "saga-pattern",           "microservices", "saga-pattern"),
    ("microservices",             "migration",              "microservices", "migration-strategies"),
    ("microservices",             "scenario-based",         "microservices", "scenario-based"),
    ("event-driven-architecture", "saga-pattern",           "microservices", "saga-pattern"),

    # ===== M17 messaging-events (merge kafka + event-driven + event-driven-architecture) =====
    ("kafka",                     "kafka-architecture",   "messaging-events", "kafka-architecture"),
    ("kafka",                     "kafka-patterns",       "messaging-events", "kafka-patterns"),
    ("kafka",                     "spring-kafka",         "messaging-events", "spring-kafka"),
    ("event-driven",              "messaging-fundamentals","messaging-events", "messaging-fundamentals"),
    ("event-driven",              "kafka",                "messaging-events", "kafka-architecture"),
    ("event-driven",              "rabbitmq",             "messaging-events", "rabbitmq"),
    ("event-driven",              "event-sourcing",       "messaging-events", "event-sourcing"),
    ("event-driven",              "cqrs",                 "messaging-events", "cqrs"),
    ("event-driven",              "webhooks",             "messaging-events", "webhooks"),
    ("event-driven",              "scenario-based",       "messaging-events", "scenario-based"),
    ("event-driven-architecture", "kafka",                "messaging-events", "kafka-architecture"),
    ("event-driven-architecture", "cqrs",                 "messaging-events", "cqrs"),
    ("event-driven-architecture", "event-sourcing",       "messaging-events", "event-sourcing"),
    ("event-driven-architecture", "message-guarantees",   "messaging-events", "message-guarantees"),
    ("event-driven-architecture", "stream-processing",    "messaging-events", "stream-processing"),
    ("event-driven-architecture", "scenario-based",       "messaging-events", "scenario-based"),

    # ===== M18 design-patterns =====
    ("architecture-design-patterns", "design-patterns",   "design-patterns", "design-patterns-legacy"),
    ("architecture-design-patterns", "solid-principles",  "design-patterns", "solid-principles"),
    ("architecture-design-patterns", "refactoring",       "design-patterns", "refactoring"),
    ("architecture-design-patterns", "technical-debt",    "design-patterns", "technical-debt"),
    ("architecture-design-patterns", "scenario-based",    "design-patterns", "scenario-based"),
    ("core-java",                    "design-patterns",   "design-patterns", "design-patterns-legacy"),

    # ===== M19 architecture-patterns =====
    ("architecture-design-patterns", "architectural-styles",      "architecture-patterns", "architectural-styles"),
    ("architecture-design-patterns", "architecture-styles",       "architecture-patterns", "architectural-styles"),
    ("architecture-design-patterns", "clean-architecture",        "architecture-patterns", "clean-architecture"),
    ("architecture-design-patterns", "hexagonal-clean",           "architecture-patterns", "hexagonal-architecture"),
    ("architecture-design-patterns", "domain-driven-design",      "architecture-patterns", "domain-driven-design"),
    ("architecture-design-patterns", "cqrs-event-sourcing",       "architecture-patterns", "cqrs-and-event-sourcing"),
    ("architecture-design-patterns", "event-driven-architecture", "architecture-patterns", "cqrs-and-event-sourcing"),
    ("architecture-design-patterns", "microservices-patterns",    "architecture-patterns", "microservices-patterns"),
    ("event-driven-architecture",    "event-driven-patterns",     "architecture-patterns", "cqrs-and-event-sourcing"),

    # ===== M20 system-design =====
    ("system-design", "design-fundamentals",  "system-design", "design-fundamentals"),
    ("system-design", "scalability",          "system-design", "scalability"),
    ("system-design", "high-availability",    "system-design", "high-availability"),
    ("system-design", "consistency-cap",      "system-design", "cap-theorem"),
    ("system-design", "capacity-planning",    "system-design", "capacity-planning"),
    ("system-design", "database-design",      "system-design", "database-design-at-scale"),
    ("system-design", "caching-strategy",     "system-design", "caching-at-scale"),
    ("system-design", "load-balancing",       "system-design", "load-balancing"),
    ("system-design", "event-driven-design",  "system-design", "event-driven-design"),
    ("system-design", "microservices-design", "system-design", "microservices-design"),
    ("system-design", "scenario-based",       "system-design", "scenario-based"),

    # ===== M21 system-design-cases =====
    ("system-design", "design-url-shortener",  "system-design-cases", "url-shortener"),
    ("system-design", "design-notification",   "system-design-cases", "notification-service"),
    ("system-design", "design-payment-system", "system-design-cases", "payment-system"),
    ("system-design", "design-social-media",   "system-design-cases", "social-media-feed"),

    # ===== M22 application-security =====
    ("security",        "owasp-threats",          "application-security", "owasp-top-10"),
    ("security",        "encryption",             "application-security", "encryption"),
    ("security",        "secure-coding",          "application-security", "secure-coding"),
    ("security",        "secrets-management",     "application-security", "secrets-management"),
    ("security",        "security-architecture",  "application-security", "security-architecture"),
    ("security",        "security-testing",       "application-security", "security-testing"),
    ("security",        "vulnerability-scanning", "application-security", "vulnerability-scanning"),
    ("security",        "compliance",             "application-security", "compliance"),
    ("security",        "penetration-testing",    "application-security", "security-testing"),
    ("security",        "scenario-based",         "application-security", "scenario-based"),
    ("spring-security", "compliance",             "application-security", "compliance"),
    ("rest-api-web",    "security",               "application-security", "secure-coding"),

    # ===== M23 unit-testing =====
    ("testing", "unit-testing",          "unit-testing", "unit-testing-basics"),
    ("testing", "unit-testing-advanced", "unit-testing", "unit-testing-advanced"),
    ("testing", "mocking-frameworks",    "unit-testing", "mocking-with-mockito"),
    ("testing", "integration-testing",   "unit-testing", "integration-testing"),
    ("testing", "spring-test",           "unit-testing", "spring-boot-testing"),
    ("testing", "test-containers",       "unit-testing", "testcontainers"),
    ("testing", "scenario-based",        "unit-testing", "scenario-based"),

    # ===== M24 advanced-testing (scenario-based intentionally also copied here) =====
    ("testing", "tdd-practices",       "advanced-testing", "tdd-practices"),
    ("testing", "test-automation",     "advanced-testing", "test-automation"),
    ("testing", "contract-testing",    "advanced-testing", "contract-testing"),
    ("testing", "performance-testing", "advanced-testing", "performance-testing"),
    ("testing", "chaos-testing",       "advanced-testing", "chaos-testing"),
    ("testing", "testing-strategies",  "advanced-testing", "testing-strategies"),
    ("testing", "scenario-based",      "advanced-testing", "scenario-based"),

    # ===== M25 git-build-tools =====
    ("git",          "git-internals", "git-build-tools", "git-internals"),
    ("git",          "git-workflows", "git-build-tools", "git-workflows"),
    ("devops-cicd",  "git-workflows", "git-build-tools", "git-workflows"),
    ("maven-gradle", "maven",         "git-build-tools", "maven-build"),
    ("maven-gradle", "gradle",        "git-build-tools", "gradle-build"),
    ("devops-cicd",  "build-tools",   "git-build-tools", "maven-build"),

    # ===== M26 cicd =====
    ("devops-cicd", "cicd-pipelines",         "cicd", "cicd-fundamentals"),
    ("devops-cicd", "jenkins-pipelines",      "cicd", "jenkins-pipelines"),
    ("devops-cicd", "continuous-deployment",  "cicd", "cicd-fundamentals"),
    ("devops-cicd", "automation",             "cicd", "cicd-fundamentals"),
    ("devops-cicd", "deployment-strategies",  "cicd", "deployment-strategies"),
    ("devops-cicd", "rollback-strategies",    "cicd", "rollback-strategies"),
    ("devops-cicd", "infrastructure-as-code", "cicd", "infrastructure-as-code"),
    ("devops-cicd", "scenario-based",         "cicd", "scenario-based"),

    # ===== M27 docker =====
    ("docker",      "docker-fundamentals",  "docker", "docker-fundamentals"),
    ("docker",      "docker-compose",       "docker", "docker-compose"),
    ("devops-cicd", "docker-containers",    "docker", "docker-fundamentals"),
    ("devops-cicd", "docker-kubernetes",    "docker", "docker-fundamentals"),

    # ===== M28 kubernetes =====
    ("devops-cicd",      "kubernetes",              "kubernetes", "kubernetes-fundamentals"),
    ("devops-cicd",      "container-orchestration", "kubernetes", "kubernetes-workloads"),
    ("devops-cicd",      "helm-gitops",             "kubernetes", "helm"),
    ("devops-cicd",      "docker-kubernetes",       "kubernetes", "kubernetes-fundamentals"),
    ("cloud-deployment", "container-services",      "kubernetes", "kubernetes-workloads"),

    # ===== M29 aws-cloud =====
    ("aws",              "aws-core",       "aws-cloud", "aws-core-services"),
    ("aws",              "ecs-deployment", "aws-cloud", "ecs-and-fargate"),
    ("aws",              "rds-spring",     "aws-cloud", "rds-with-spring"),
    ("aws",              "s3-storage",     "aws-cloud", "s3-storage"),
    ("aws",              "iam-security",   "aws-cloud", "iam-and-security"),
    ("cloud-deployment", "aws-services",   "aws-cloud", "aws-core-services"),
    ("cloud-deployment", "azure-services", "aws-cloud", "gcp-and-azure-overview"),
    ("cloud-deployment", "serverless",     "aws-cloud", "serverless"),

    # ===== M30 cloud-native =====
    ("cloud-deployment", "cloud-native",           "cloud-native", "12-factor-app"),
    ("cloud-deployment", "cloud-design-patterns",  "cloud-native", "cloud-design-patterns"),
    ("cloud-deployment", "cloud-patterns",         "cloud-native", "cloud-design-patterns"),
    ("cloud-deployment", "infrastructure",         "cloud-native", "deployment-strategies"),
    ("cloud-deployment", "deployment-strategies",  "cloud-native", "deployment-strategies"),
    ("cloud-deployment", "disaster-recovery",      "cloud-native", "disaster-recovery"),
    ("cloud-deployment", "multi-region",           "cloud-native", "multi-region-architecture"),
    ("cloud-deployment", "cost-optimization",      "cloud-native", "cost-optimization"),
    ("cloud-deployment", "scenario-based",         "cloud-native", "scenario-based"),

    # ===== M31 observability =====
    ("observability", "logging",             "observability", "structured-logging"),
    ("observability", "logging-distributed", "observability", "distributed-log-aggregation"),
    ("observability", "metrics",             "observability", "metrics-and-micrometer"),
    ("observability", "metrics-monitoring",  "observability", "metrics-and-micrometer"),
    ("observability", "monitoring",          "observability", "prometheus-and-grafana"),
    ("observability", "distributed-tracing", "observability", "distributed-tracing"),
    ("observability", "alerting",            "observability", "alerting"),
    ("observability", "apm-tools",           "observability", "apm-tools"),
    ("observability", "scenario-based",      "observability", "scenario-based"),
    ("devops-cicd",   "monitoring",          "observability", "prometheus-and-grafana"),

    # ===== M32 production-sre =====
    ("production-operations", "debugging",                  "production-sre", "debugging-production"),
    ("production-operations", "debugging-production",       "production-sre", "debugging-production"),
    ("production-operations", "thread-heap-dumps",          "production-sre", "thread-and-heap-dumps"),
    ("production-operations", "memory-leaks",               "production-sre", "memory-leaks"),
    ("production-operations", "performance-troubleshooting","production-sre", "performance-troubleshooting"),
    ("production-operations", "incident-response",          "production-sre", "incident-response"),
    ("production-operations", "incident-management",        "production-sre", "incident-management"),
    ("production-operations", "root-cause-analysis",        "production-sre", "root-cause-analysis"),
    ("production-operations", "postmortems",                "production-sre", "postmortems"),
    ("production-operations", "chaos-engineering",          "production-sre", "chaos-engineering"),
    ("production-operations", "sre-practices",              "production-sre", "sre-practices"),
    ("production-operations", "capacity-planning",          "production-sre", "capacity-planning"),
    ("production-operations", "runbooks",                   "production-sre", "runbooks"),
    ("production-operations", "on-call",                    "production-sre", "on-call"),
    ("production-operations", "scenario-based",             "production-sre", "scenario-based"),
    ("observability",         "incident-management",        "production-sre", "incident-management"),

    # ===== M33 engineering-practices =====
    ("engineering-practices", "code-review",            "engineering-practices", "code-review"),
    ("engineering-practices", "architecture-decisions", "engineering-practices", "architecture-decisions"),
    ("engineering-practices", "documentation",          "engineering-practices", "technical-documentation"),
    ("engineering-practices", "team-collaboration",     "engineering-practices", "team-collaboration"),
    ("engineering-practices", "knowledge-sharing",      "engineering-practices", "knowledge-sharing"),
    ("engineering-practices", "mentoring",              "engineering-practices", "mentoring"),
    ("engineering-practices", "scenario-based",         "engineering-practices", "scenario-based"),

    # ===== M34 behavioral : empty =====
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_json(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise RuntimeError(f"invalid JSON in {path}: {e}") from e


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def merge_list_by_id(existing, new, log: dict) -> list:
    """Merge two lists of dicts, deduplicating by 'id'. Preserves first-seen order."""
    result: list = []
    seen: set = set()
    for src in (existing or []):
        key = src.get("id") if isinstance(src, dict) else None
        if key is None:
            result.append(src)
            continue
        if key in seen:
            log["duplicates_existing"].append(key)
            continue
        seen.add(key)
        result.append(src)
    for src in (new or []):
        key = src.get("id") if isinstance(src, dict) else None
        if key is None:
            result.append(src)
            continue
        if key in seen:
            log["duplicates_merged"].append(key)
            continue
        seen.add(key)
        result.append(src)
    return result


def copy_topic(src_topic_dir: Path, dst_topic_dir: Path, log: dict) -> None:
    """Copy/merge one source topic into one destination topic."""
    if not src_topic_dir.exists():
        log["missing_sources"].append(str(src_topic_dir.relative_to(REPO_ROOT)))
        return

    dst_topic_dir.mkdir(parents=True, exist_ok=True)
    (dst_topic_dir / "answers").mkdir(parents=True, exist_ok=True)

    src_q = load_json(src_topic_dir / "questions.json")
    if src_q is not None:
        dst_path = dst_topic_dir / "questions.json"
        existing = load_json(dst_path)
        merged = merge_list_by_id(existing, src_q, log)
        write_json(dst_path, merged)
        log["questions_files_merged"] += 1

    src_c = load_json(src_topic_dir / "complete-qa.json")
    if src_c is not None:
        dst_path = dst_topic_dir / "complete-qa.json"
        existing = load_json(dst_path)
        merged = merge_list_by_id(existing, src_c, log)
        write_json(dst_path, merged)
        log["complete_qa_files_merged"] += 1

    src_answers = src_topic_dir / "answers"
    if src_answers.exists():
        dst_answers = dst_topic_dir / "answers"
        for answer_file in src_answers.iterdir():
            if not answer_file.is_file() or answer_file.suffix != ".json":
                continue
            target = dst_answers / answer_file.name
            if target.exists():
                log["answers_skipped_preexisting"].append(str(target.relative_to(REPO_ROOT)))
                continue
            shutil.copy2(answer_file, target)
            log["answers_copied"] += 1


# ---------------------------------------------------------------------------
# Phase B
# ---------------------------------------------------------------------------

def run_phase_b() -> dict:
    log = {
        "rows_processed": 0,
        "missing_sources": [],
        "answers_copied": 0,
        "answers_skipped_preexisting": [],
        "questions_files_merged": 0,
        "complete_qa_files_merged": 0,
        "duplicates_existing": [],
        "duplicates_merged": [],
    }
    for src_mod, src_topic, dst_mod, dst_topic in MAPPINGS:
        src_dir = SRC_ROOT / src_mod / src_topic
        dst_dir = DST_ROOT / dst_mod / dst_topic
        copy_topic(src_dir, dst_dir, log)
        log["rows_processed"] += 1
    return log


# ---------------------------------------------------------------------------
# Phase C — Verification
# ---------------------------------------------------------------------------

def count_answer_ids(root: Path):
    """Walk a tree. Returns (total_answer_files, set_of_keys, per-module counts).
    key = module/topic/stem so we can locate questions."""
    total = 0
    ids: set = set()
    per_module: dict = defaultdict(int)
    if not root.exists():
        return total, ids, dict(per_module)
    for module_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        for topic_dir in sorted(p for p in module_dir.iterdir() if p.is_dir()):
            answers_dir = topic_dir / "answers"
            if not answers_dir.exists():
                continue
            for f in answers_dir.glob("*.json"):
                total += 1
                per_module[module_dir.name] += 1
                ids.add(f"{module_dir.name}/{topic_dir.name}/{f.stem}")
    return total, ids, dict(per_module)


def run_phase_c(b_log: dict) -> str:
    src_total, src_ids, src_per_mod = count_answer_ids(SRC_ROOT)
    dst_total, dst_ids, dst_per_mod = count_answer_ids(DST_ROOT)

    def unique_stems(ids):
        return {i.split("/")[-1] for i in ids}

    src_unique_stems = unique_stems(src_ids)
    dst_unique_stems = unique_stems(dst_ids)
    missing_stems = sorted(src_unique_stems - dst_unique_stems)

    lines: list = []
    lines.append("# Migration Report")
    lines.append("")
    lines.append("Generated by `scripts/migrate_phase_b_and_c.py`.")
    lines.append("")
    lines.append("## Totals")
    lines.append("")
    lines.append(f"- Mapping rows processed: **{b_log['rows_processed']}**")
    lines.append(f"- Source `answers/*.json` files: **{src_total}**")
    lines.append(f"- Target `answers/*.json` files: **{dst_total}**")
    lines.append(f"- Source unique question stems: **{len(src_unique_stems)}**")
    lines.append(f"- Target unique question stems: **{len(dst_unique_stems)}**")
    lines.append(f"- Answer files copied this run: **{b_log['answers_copied']}**")
    lines.append(f"- Answer files skipped (pre-existing in target): **{len(b_log['answers_skipped_preexisting'])}**")
    lines.append(f"- `questions.json` files merged: **{b_log['questions_files_merged']}**")
    lines.append(f"- `complete-qa.json` files merged: **{b_log['complete_qa_files_merged']}**")
    lines.append(f"- Duplicate IDs dropped during merge: **{len(b_log['duplicates_merged'])}**")
    lines.append(f"- Source folders referenced but missing: **{len(b_log['missing_sources'])}**")
    lines.append("")
    lines.append("## Zero-loss check")
    lines.append("")
    if missing_stems:
        lines.append(f"WARNING — **{len(missing_stems)}** question stems present in source but NOT in target:")
        lines.append("")
        for stem in missing_stems[:100]:
            lines.append(f"- `{stem}`")
        if len(missing_stems) > 100:
            lines.append(f"- ...and {len(missing_stems) - 100} more")
    else:
        lines.append("PASS — every source question stem is present in the target tree.")
    lines.append("")
    lines.append("## Per-module answer counts")
    lines.append("")
    lines.append("### Source tree (content/domains/java/backend/intermediate/)")
    lines.append("")
    lines.append("| Module | Answer files |")
    lines.append("|---|---:|")
    for mod in sorted(src_per_mod):
        lines.append(f"| `{mod}` | {src_per_mod[mod]} |")
    lines.append("")
    lines.append("### Target tree (content/java-backend-intermediate/)")
    lines.append("")
    lines.append("| Module | Answer files |")
    lines.append("|---|---:|")
    for mod in sorted(dst_per_mod):
        lines.append(f"| `{mod}` | {dst_per_mod[mod]} |")
    lines.append("")

    if b_log["missing_sources"]:
        lines.append("## Source folders referenced in mapping but missing on disk")
        lines.append("")
        for m in b_log["missing_sources"]:
            lines.append(f"- `{m}`")
        lines.append("")

    if b_log["answers_skipped_preexisting"]:
        lines.append("## Answer files skipped (pre-existing at target)")
        lines.append("")
        lines.append(f"_{len(b_log['answers_skipped_preexisting'])} files — first 50 shown_")
        lines.append("")
        for m in b_log["answers_skipped_preexisting"][:50]:
            lines.append(f"- `{m}`")
        lines.append("")

    if b_log["duplicates_merged"]:
        lines.append("## Duplicate question IDs dropped during merge")
        lines.append("")
        counts: dict = defaultdict(int)
        for d in b_log["duplicates_merged"]:
            counts[d] += 1
        for qid in sorted(counts, key=lambda k: -counts[k])[:50]:
            lines.append(f"- `{qid}` x{counts[qid]}")
        lines.append("")

    report = "\n".join(lines) + "\n"
    REPORT_PATH.write_text(report, encoding="utf-8")
    return report


if __name__ == "__main__":
    print("[phase-b] copying source topics into target tree...")
    b_log = run_phase_b()
    print(f"[phase-b] rows processed   : {b_log['rows_processed']}")
    print(f"[phase-b] answers copied   : {b_log['answers_copied']}")
    print(f"[phase-b] answers skipped  : {len(b_log['answers_skipped_preexisting'])}")
    print(f"[phase-b] missing sources  : {len(b_log['missing_sources'])}")
    print(f"[phase-b] dups on merge    : {len(b_log['duplicates_merged'])}")

    print("[phase-c] running verification + writing report...")
    report = run_phase_c(b_log)
    print(f"[phase-c] report written   : {REPORT_PATH.relative_to(REPO_ROOT)}")
    print()
    print(report.split("## Per-module answer counts")[0])
