#!/usr/bin/env python3
"""Merge spring-kafka and kafka complete-qa.json into one combined file."""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SPRING_KAFKA = (
    REPO
    / "content/interview/java/backend/intermediate/spring-kafka/complete-qa.json"
)
KAFKA = REPO / "content/interview/java/backend/intermediate/kafka/complete-qa.json"
DEST = (
    REPO
    / "content/interview/java/backend/intermediate/02-spring-framework/07-spring-kafka/complete-qa.json"
)

MERGED_DESCRIPTION = (
    "Spring Kafka for Spring Boot services plus core Kafka fundamentals "
    "(producers, consumers, partitioning) for Java backend intermediate developers."
)


def main() -> int:
    spring = json.loads(SPRING_KAFKA.read_text(encoding="utf-8"))
    kafka_pack = json.loads(KAFKA.read_text(encoding="utf-8"))

    spring_q = spring.get("questions") or []
    kafka_q = kafka_pack.get("questions") or []

    meta = dict(spring.get("meta") or {})
    meta["stack"] = "spring-kafka"
    meta["description"] = MERGED_DESCRIPTION

    merged = {"meta": meta, "questions": list(spring_q) + list(kafka_q)}

    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(
        json.dumps(merged, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    # Validate written file
    roundtrip = json.loads(DEST.read_text(encoding="utf-8"))
    n = len(roundtrip.get("questions") or [])
    print(f"Wrote: {DEST}")
    print(f"Question count: {n}")
    if n != 15:
        print(f"ERROR: expected 15 questions, got {n}", file=sys.stderr)
        return 1
    print("JSON is well-formed; question count matches expected total (15).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
