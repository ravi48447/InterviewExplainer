#!/usr/bin/env python3
"""Generate _config.json per module and _curriculum.json from complete-qa.json counts."""

from __future__ import annotations

import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / "content" / "interview" / "java" / "backend" / "intermediate"

MODULES: list[dict] = [
    {
        "order": 1,
        "slug": "01-java-foundations",
        "title": "Java Language Foundations",
        "description": "Master core Java before touching any framework",
        "priority": "critical",
        "topics": [
            "01-java-fundamentals",
            "02-collections-data-structures",
            "03-concurrency-multithreading",
            "04-jvm-internals-performance",
        ],
    },
    {
        "order": 2,
        "slug": "02-spring-framework",
        "title": "Spring Framework & Spring Boot",
        "description": "The Spring ecosystem from core to cloud",
        "priority": "critical",
        "topics": [
            "01-spring-core",
            "02-spring-boot",
            "03-rest-apis-spring-mvc",
            "04-data-persistence-jpa-hibernate",
            "05-spring-security",
            "06-spring-cloud",
            "07-spring-kafka",
            "08-spring-batch",
        ],
    },
    {
        "order": 3,
        "slug": "03-data-storage",
        "title": "Data & Storage",
        "description": "SQL, NoSQL, and caching databases",
        "priority": "important",
        "topics": [
            "01-database-design",
            "02-mysql",
            "03-postgresql",
            "04-mongodb",
            "05-redis",
            "06-elasticsearch",
        ],
    },
    {
        "order": 4,
        "slug": "04-design-architecture",
        "title": "Design & Architecture",
        "description": "Patterns, clean code, and system design principles",
        "priority": "important",
        "topics": [
            "01-design-patterns",
            "02-clean-architecture",
            "03-domain-driven-design",
            "04-architecture-patterns",
        ],
    },
    {
        "order": 5,
        "slug": "05-distributed-systems",
        "title": "Distributed Systems & Messaging",
        "description": "Building distributed services and event-driven architectures",
        "priority": "important",
        "topics": [
            "01-microservices",
            "02-event-driven-architecture",
            "03-rabbitmq",
            "04-graphql",
            "05-grpc",
            "06-websockets",
        ],
    },
    {
        "order": 6,
        "slug": "06-testing",
        "title": "Testing",
        "description": "Unit, integration, and end-to-end testing strategies",
        "priority": "critical",
        "topics": ["01-testing"],
    },
    {
        "order": 7,
        "slug": "07-devops-deployment",
        "title": "DevOps & Deployment",
        "description": "CI/CD, containers, orchestration, and infrastructure",
        "priority": "good-to-have",
        "topics": [
            "01-git",
            "02-build-tools",
            "03-docker",
            "04-kubernetes",
            "05-ci-cd-pipelines",
            "06-terraform",
        ],
    },
    {
        "order": 8,
        "slug": "08-cloud-platforms",
        "title": "Cloud Platforms",
        "description": "AWS, Azure, and GCP for Java applications",
        "priority": "good-to-have",
        "topics": ["01-aws", "02-azure", "03-gcp"],
    },
    {
        "order": 9,
        "slug": "09-production-observability",
        "title": "Production & Observability",
        "description": "Monitoring, logging, performance, and system design for production",
        "priority": "important",
        "topics": [
            "01-observability-monitoring",
            "02-production-operations",
            "03-performance-tuning",
            "04-system-design",
        ],
    },
    {
        "order": 10,
        "slug": "10-behavioral",
        "title": "Behavioral",
        "description": "Communication, leadership, and problem-solving questions",
        "priority": "good-to-have",
        "topics": ["01-behavioral"],
    },
]

TOPIC_TITLES: dict[str, str] = {
    "01-java-fundamentals": "Java Fundamentals",
    "02-collections-data-structures": "Collections & Data Structures",
    "03-concurrency-multithreading": "Concurrency & Multithreading",
    "04-jvm-internals-performance": "JVM Internals & Performance",
    "01-spring-core": "Spring Core",
    "02-spring-boot": "Spring Boot",
    "03-rest-apis-spring-mvc": "REST APIs & Spring MVC",
    "04-data-persistence-jpa-hibernate": "Data Persistence with JPA & Hibernate",
    "05-spring-security": "Spring Security",
    "06-spring-cloud": "Spring Cloud",
    "07-spring-kafka": "Spring Kafka",
    "08-spring-batch": "Spring Batch",
    "01-database-design": "Database Design",
    "02-mysql": "MySQL",
    "03-postgresql": "PostgreSQL",
    "04-mongodb": "MongoDB",
    "05-redis": "Redis",
    "06-elasticsearch": "Elasticsearch",
    "01-design-patterns": "Design Patterns",
    "02-clean-architecture": "Clean Architecture",
    "03-domain-driven-design": "Domain-Driven Design",
    "04-architecture-patterns": "Architecture Patterns",
    "01-microservices": "Microservices",
    "02-event-driven-architecture": "Event-Driven Architecture",
    "03-rabbitmq": "RabbitMQ",
    "04-graphql": "GraphQL",
    "05-grpc": "gRPC",
    "06-websockets": "WebSockets",
    "01-testing": "Testing",
    "01-git": "Git",
    "02-build-tools": "Build Tools (Maven & Gradle)",
    "03-docker": "Docker",
    "04-kubernetes": "Kubernetes",
    "05-ci-cd-pipelines": "CI/CD Pipelines (Jenkins & GitHub Actions)",
    "06-terraform": "Terraform",
    "01-aws": "AWS",
    "02-azure": "Azure",
    "03-gcp": "GCP",
    "01-observability-monitoring": "Observability & Monitoring",
    "02-production-operations": "Production Operations",
    "03-performance-tuning": "Performance Tuning",
    "04-system-design": "System Design",
    "01-behavioral": "Behavioral",
}


def count_questions(qa_path: Path) -> int:
    with qa_path.open(encoding="utf-8") as f:
        data = json.load(f)
    questions = data.get("questions")
    if not isinstance(questions, list):
        return 0
    return len(questions)


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    path.write_text(text, encoding="utf-8")


def main() -> int:
    if not BASE.is_dir():
        print(f"Base path not found: {BASE}", file=sys.stderr)
        return 1

    curriculum_modules: list[dict] = []
    total_topics = 0
    total_questions = 0

    for mod in MODULES:
        module_dir = BASE / mod["slug"]
        topic_rows: list[dict] = []
        mod_q = 0

        for i, topic_slug in enumerate(mod["topics"], start=1):
            if topic_slug not in TOPIC_TITLES:
                print(f"Missing title mapping for topic slug: {topic_slug}", file=sys.stderr)
                return 1

            qa_path = module_dir / topic_slug / "complete-qa.json"
            if not qa_path.is_file():
                print(f"Missing complete-qa.json: {qa_path}", file=sys.stderr)
                return 1

            n = count_questions(qa_path)
            topic_rows.append(
                {
                    "order": i,
                    "slug": topic_slug,
                    "title": TOPIC_TITLES[topic_slug],
                    "question_count": n,
                }
            )
            mod_q += n
            total_topics += 1

        total_questions += mod_q

        module_config = {
            "module": {
                "order": mod["order"],
                "slug": mod["slug"],
                "title": mod["title"],
                "description": mod["description"],
                "priority": mod["priority"],
                "topic_count": len(mod["topics"]),
                "question_count": mod_q,
            }
        }
        write_json(module_dir / "_config.json", module_config)

        curriculum_modules.append(
            {
                "order": mod["order"],
                "slug": mod["slug"],
                "title": mod["title"],
                "description": mod["description"],
                "priority": mod["priority"],
                "topics": topic_rows,
            }
        )

    curriculum = {
        "curriculum": {
            "stack": "java-backend",
            "level": "intermediate",
            "version": "2.0",
            "total_modules": len(MODULES),
            "total_topics": total_topics,
            "total_questions": total_questions,
            "study_sequence_logic": "Foundations first, then framework, then specializations",
        },
        "modules": curriculum_modules,
    }
    write_json(BASE / "_curriculum.json", curriculum)

    # Verify: re-read written curriculum and cross-check sums
    loaded = json.loads((BASE / "_curriculum.json").read_text(encoding="utf-8"))
    cfg_sum = 0
    for d in MODULES:
        cfg = json.loads((BASE / d["slug"] / "_config.json").read_text(encoding="utf-8"))
        cfg_sum += cfg["module"]["question_count"]

    topics_from_cur = sum(len(m["topics"]) for m in loaded["modules"])
    q_from_cur = sum(t["question_count"] for m in loaded["modules"] for t in m["topics"])
    assert topics_from_cur == loaded["curriculum"]["total_topics"]
    assert q_from_cur == loaded["curriculum"]["total_questions"]
    assert cfg_sum == loaded["curriculum"]["total_questions"]

    print(f"OK: wrote {len(MODULES)} module _config.json files and _curriculum.json under {BASE}")
    print(f"total_topics={total_topics} total_questions={total_questions}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
