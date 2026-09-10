#!/usr/bin/env python3
"""
Populates the question_text column in the questions table
using the 'question' field from each subtopic's questions.json file.

Covers ALL spring-boot subtopics. Can be extended for other domains.
"""

import json, os, sys
import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    "host": "localhost", "port": 5432,
    "database": "interviewexplainer",
    "user": "interviewexplainer", "password": "changeme",
}

# 3-tier experience bands: canonical content directory names
# Matches the Java ExperienceBand enum and frontend ExperienceLevelKey type.
EXPERIENCE_BANDS = {
    "beginner":     "beginner",     # 0–2 years
    "intermediate": "intermediate", # 2–5 years
    "advanced":     "advanced",     # 5+ years
}

_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_ROOTS = [
    os.path.join(_BASE, "content", "domains", "java", "backend",
                 EXPERIENCE_BANDS["intermediate"], "spring-boot"),
]


def main(dry_run: bool = False):
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Question Text Populator")

    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            updated = skipped = 0

            for content_root in CONTENT_ROOTS:
                subtopics = sorted(
                    d for d in os.listdir(content_root)
                    if os.path.isdir(os.path.join(content_root, d))
                )
                print(f"\nStack: {os.path.basename(content_root)} ({len(subtopics)} subtopics)")

                for subtopic in subtopics:
                    qfile = os.path.join(content_root, subtopic, "questions.json")
                    if not os.path.isfile(qfile):
                        continue

                    with open(qfile) as f:
                        questions = json.load(f)

                    sub_updated = sub_skipped = 0
                    for q in questions:
                        slug = q.get("slug", "")
                        question_text = q.get("question", "").strip()
                        if not slug or not question_text:
                            sub_skipped += 1
                            continue

                        cur.execute("SELECT id, question_text FROM questions WHERE slug = %s", (slug,))
                        row = cur.fetchone()
                        if row is None:
                            sub_skipped += 1
                            continue

                        if row["question_text"] == question_text:
                            sub_skipped += 1
                            continue

                        if not dry_run:
                            cur.execute(
                                "UPDATE questions SET question_text = %s WHERE id = %s",
                                (question_text, row["id"])
                            )
                        sub_updated += 1

                    print(f"  [{subtopic:25s}] updated={sub_updated:3d}  skipped={sub_skipped}")
                    updated += sub_updated
                    skipped += sub_skipped

            print(f"\nTotal updated : {updated}")
            print(f"Total skipped : {skipped}")

            if not dry_run:
                conn.commit()
                print("✅ Committed")
            else:
                conn.rollback()
                print("[DRY RUN] Nothing written")

    except Exception as e:
        conn.rollback()
        print(f"❌ {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
