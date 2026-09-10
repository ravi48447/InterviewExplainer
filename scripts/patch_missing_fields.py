#!/usr/bin/env python3
"""
Patch speakable_v2 blocks missing audience_assumption, voice, standard_example.
Only modifies questions that have speakable_v2 with archetype set but are missing
one or more of these three required fields.
"""
import json, glob, sys

# Module → standard_example string
MODULE_EXAMPLES = {
    "core-java":           "Java 17 app with a service and repository layer",
    "java-collections":    "Java 17 app processing a list of orders",
    "java-concurrency":    "Java 17 multi-threaded service handling concurrent requests",
    "java-oop":            "Java 17 e-commerce domain model with inheritance",
    "java-streams":        "Java 17 stream pipeline over a list of products",
    "jvm-internals":       "Java 17 Spring Boot app running in production on JVM 17",
    "spring-boot":         "Spring Boot 3.2 REST API with JPA repository",
    "spring-core":         "Spring Boot 3.2 app with @Service and @Repository beans",
    "spring-data-jpa":     "Spring Boot 3.2 app with Hibernate and PostgreSQL",
    "spring-security":     "Spring Boot 3.2 REST API with JWT-based authentication",
    "spring-webflux":      "Spring WebFlux reactive API with Reactor",
    "spring-batch":        "Spring Batch job processing 1M records nightly",
    "rest-api":            "Spring Boot 3.2 REST API serving a mobile client",
    "graphql":             "Spring Boot GraphQL API with DGS framework",
    "grpc":                "Spring Boot gRPC service with Protocol Buffers",
    "microservices":       "3-service Spring Boot system: orders, payments, inventory",
    "messaging-events":    "Spring Boot app publishing domain events to Kafka",
    "rabbitmq":            "Spring Boot app with RabbitMQ for async order processing",
    "architecture-patterns": "Spring Boot modular monolith with DDD aggregates",
    "design-patterns":     "Spring Boot app applying design patterns to a cart service",
    "system-design":       "Distributed Java system handling 10k requests per second",
    "system-design-cases": "URL shortener designed for 100M reads per day",
    "low-level-design":    "Java class hierarchy for a payment gateway",
    "postgresql":          "Spring Boot app with PostgreSQL and connection pooling",
    "nosql-mongodb":       "Spring Boot app with MongoDB for product catalogue",
    "sql-databases":       "Spring Boot app with JPA over a relational database",
    "redis-caching":       "Spring Boot app using Redis for session and cache",
    "aws-cloud":           "Spring Boot app deployed on AWS ECS with RDS",
    "azure":               "Spring Boot app deployed on Azure App Service",
    "gcp":                 "Spring Boot app deployed on GCP Cloud Run",
    "cloud-native":        "Spring Boot app containerised and running on Kubernetes",
    "docker":              "Spring Boot app packaged as a Docker image",
    "kubernetes":          "Spring Boot app deployed as a Kubernetes Deployment",
    "cicd":                "Spring Boot app with GitHub Actions CI/CD pipeline",
    "jenkins":             "Spring Boot app built and deployed via Jenkins pipeline",
    "git-build-tools":     "Java project managed with Git and Gradle",
    "java-build-tools":    "Maven multi-module Spring Boot project",
    "terraform":           "AWS infrastructure for a Spring Boot app managed with Terraform",
    "observability":       "Spring Boot app with Micrometer and OpenTelemetry",
    "production-sre":      "Spring Boot app running in production with Prometheus/Grafana",
    "unit-testing":        "Spring Boot service class tested with JUnit 5 and Mockito",
    "application-security": "Spring Boot app with OWASP-compliant input validation",
    "engineering-practices": "Java team following clean code and SOLID principles",
    "behavioral":          "Senior Java developer in a backend interview context",
    "ai-llm-java":         "Spring Boot 3.2 app with Spring AI and OpenAI integration",
}

DEFAULT_EXAMPLE = "Java 17 Spring Boot 3.2 application in a production environment"
AUDIENCE = "familiar"
VOICE = "friendly"


def patch_file(fpath: str) -> tuple[int, int]:
    """Returns (questions_patched, questions_skipped)."""
    with open(fpath) as f:
        data = json.load(f)

    module = fpath.replace("content/java-backend-intermediate/", "").split("/")[0]
    std_ex = MODULE_EXAMPLES.get(module, DEFAULT_EXAMPLE)

    patched = 0
    skipped = 0
    questions = data if isinstance(data, list) else data.get("questions", [])
    for q in questions:
        sv = q.get("speakable_v2")
        if not sv or not sv.get("archetype"):
            skipped += 1
            continue

        changed = False
        if "audience_assumption" not in sv:
            sv["audience_assumption"] = AUDIENCE
            changed = True
        if "voice" not in sv:
            sv["voice"] = VOICE
            changed = True
        if "standard_example" not in sv or not sv["standard_example"]:
            sv["standard_example"] = std_ex
            changed = True

        if changed:
            patched += 1
        else:
            skipped += 1

    if patched > 0:
        with open(fpath, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    return patched, skipped


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "content/java-backend-intermediate"
    files = glob.glob(f"{target}/**/complete-qa.json", recursive=True)
    total_patched = 0
    total_skipped = 0
    files_changed = 0
    for fpath in sorted(files):
        p, s = patch_file(fpath)
        total_patched += p
        total_skipped += s
        if p > 0:
            files_changed += 1
            print(f"  patched {p:3d}  {fpath}")

    print(f"\nDone: {total_patched} questions patched across {files_changed} files ({total_skipped} skipped)")


if __name__ == "__main__":
    main()
