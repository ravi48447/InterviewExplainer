#!/usr/bin/env python3
"""
Fix the order_index and subcategory assignments for all Spring Boot questions
so they match the order defined in each subtopic's questions.json.

Problems this script solves:
1. Original 3 questions (auto-configuration) got wrong order_index values
2. Questions are not in JSON order within their subtopics
3. Duplicate slugs (e.g., spring-factories) across subtopics: first-wins strategy
4. Question counts per subtopic should match questions.json

Usage:
  python3 scripts/fixQuestionOrdering.py [--dry-run]
"""

import json
import os
import sys
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

SPRING_BOOT_STACK_ID = 223
CONTENT_BASE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "content", "domains", "java", "backend",
    EXPERIENCE_BANDS["intermediate"],
    "spring-boot"
)

def to_display_name(slug: str) -> str:
    return " ".join(w.capitalize() for w in slug.replace("-", " ").split())


def main(dry_run: bool = False):
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Spring Boot Question Order Fixer")
    print(f"Content: {CONTENT_BASE}\n")

    subtopics = sorted(d for d in os.listdir(CONTENT_BASE) if os.path.isdir(os.path.join(CONTENT_BASE, d)))

    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Build a global map: slug -> question_id (from DB)
            cur.execute("SELECT id, slug FROM questions")
            slug_to_id = {row["slug"]: row["id"] for row in cur.fetchall()}

            # Current stack index map: question_id -> row
            cur.execute(
                "SELECT question_id, order_index, subcategory_slug FROM question_stack_index WHERE stack_id = %s",
                (SPRING_BOOT_STACK_ID,)
            )
            stack_index = {row["question_id"]: row for row in cur.fetchall()}

            global_order = 1
            seen_slugs = set()  # track which slugs we've already assigned to a subtopic
            
            total_updates = 0
            total_missing = 0
            issues = []

            for subtopic in subtopics:
                questions_file = os.path.join(CONTENT_BASE, subtopic, "questions.json")
                if not os.path.isfile(questions_file):
                    continue

                with open(questions_file) as f:
                    questions = json.load(f)

                # Get display name from complete-qa.json if available
                cqa_file = os.path.join(CONTENT_BASE, subtopic, "complete-qa.json")
                subcat_name = to_display_name(subtopic)
                if os.path.isfile(cqa_file):
                    with open(cqa_file) as f:
                        cqa = json.load(f)
                    subcat_name = cqa.get("topic") or subcat_name

                print(f"  [{subtopic:25s}] ({len(questions)} questions in JSON)")

                for pos, q in enumerate(questions, start=1):
                    slug = q.get("slug", "")
                    if not slug:
                        continue

                    if slug in seen_slugs:
                        print(f"    ⚠️  Skipping duplicate slug '{slug}' (already assigned to earlier subtopic)")
                        issues.append(f"Duplicate slug '{slug}' in {subtopic} skipped")
                        continue

                    qid = slug_to_id.get(slug)
                    if qid is None:
                        print(f"    ❌ Not in DB: '{slug}' (title={q['title']})")
                        total_missing += 1
                        issues.append(f"Missing from DB: '{slug}' in {subtopic}")
                        global_order += 1
                        continue

                    seen_slugs.add(slug)
                    current = stack_index.get(qid)

                    if current is None:
                        # Not linked to this stack at all
                        if not dry_run:
                            cur.execute(
                                "INSERT INTO question_stack_index (question_id, stack_id, order_index, subcategory_slug, subcategory_name) "
                                "VALUES (%s, %s, %s, %s, %s) ON CONFLICT (question_id, stack_id) DO UPDATE "
                                "SET order_index = EXCLUDED.order_index, subcategory_slug = EXCLUDED.subcategory_slug, subcategory_name = EXCLUDED.subcategory_name",
                                (qid, SPRING_BOOT_STACK_ID, global_order, subtopic, subcat_name)
                            )
                        print(f"    ➕ {global_order:3d} INSERT: {slug} → {subtopic}")
                        total_updates += 1
                    elif current["order_index"] != global_order or current["subcategory_slug"] != subtopic:
                        # Needs update
                        old_order = current["order_index"]
                        old_subcat = current["subcategory_slug"]
                        if not dry_run:
                            cur.execute(
                                "UPDATE question_stack_index SET order_index = %s, subcategory_slug = %s, subcategory_name = %s "
                                "WHERE question_id = %s AND stack_id = %s",
                                (global_order, subtopic, subcat_name, qid, SPRING_BOOT_STACK_ID)
                            )
                        change = []
                        if old_order != global_order:
                            change.append(f"order {old_order}→{global_order}")
                        if old_subcat != subtopic:
                            change.append(f"subcat {old_subcat}→{subtopic}")
                        print(f"    ✏️  {global_order:3d} UPDATE {slug}: {', '.join(change)}")
                        total_updates += 1

                    global_order += 1

            print(f"\n  Summary:")
            print(f"  Updated : {total_updates}")
            print(f"  Missing : {total_missing}")
            if issues:
                print(f"\n  Issues:")
                for iss in issues:
                    print(f"    - {iss}")

            if not dry_run:
                conn.commit()
                print(f"\n✅ Committed")
            else:
                conn.rollback()
                print(f"\n[DRY RUN] Nothing written")

    except Exception as e:
        conn.rollback()
        print(f"❌ Fatal: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
