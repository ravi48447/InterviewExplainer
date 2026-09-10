#!/usr/bin/env python3
"""Merge Jenkins and GitHub Actions complete-qa.json into ci-cd-pipelines (dedupe jenkins-010 vs ga-009)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
JENKINS_PATH = REPO / (
    "content/interview/java/backend/intermediate/jenkins/complete-qa.json"
)
GA_PATH = REPO / (
    "content/interview/java/backend/intermediate/github-actions/complete-qa.json"
)
DEST = REPO / (
    "content/interview/java/backend/intermediate/"
    "07-devops-deployment/05-ci-cd-pipelines/complete-qa.json"
)
SKIP_JENKINS_IDS = frozenset({"jenkins-010"})


def main() -> int:
    jenkins = json.loads(JENKINS_PATH.read_text(encoding="utf-8"))
    ga = json.loads(GA_PATH.read_text(encoding="utf-8"))

    j_q = [q for q in jenkins["questions"] if q.get("id") not in SKIP_JENKINS_IDS]
    ga_q = list(ga["questions"])

    merged_questions = j_q + ga_q

    out = {
        "meta": {
            "stack": "ci-cd-pipelines",
            "description": (
                "CI/CD pipeline design with Jenkins and GitHub Actions "
                "for Java backend intermediate developers"
            ),
            "level": "intermediate",
            "lang": "java",
            "track": "backend",
            "last_updated": "2026-04-12",
        },
        "questions": merged_questions,
    }

    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(
        json.dumps(out, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    # Validate written JSON
    roundtrip = json.loads(DEST.read_text(encoding="utf-8"))
    n = len(roundtrip["questions"])
    print(f"Wrote: {DEST}")
    print(f"Question count: {n} (expected 19)")
    if n != 19:
        print("ERROR: unexpected question count", file=sys.stderr)
        return 1

    j_ids = [q["id"] for q in roundtrip["questions"][:9]]
    ga_ids = [q["id"] for q in roundtrip["questions"][9:]]
    expected_j = [f"jenkins-{i:03d}" for i in range(1, 10)]
    expected_ga = [f"ga-{i:03d}" for i in range(1, 11)]
    if j_ids != expected_j or ga_ids != expected_ga:
        print(f"ERROR: id order mismatch\n  jenkins: {j_ids}\n  ga: {ga_ids}", file=sys.stderr)
        return 1

    if any(q["id"] == "jenkins-010" for q in roundtrip["questions"]):
        print("ERROR: jenkins-010 should not appear", file=sys.stderr)
        return 1

    print("JSON valid; ordering and deduplication checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
