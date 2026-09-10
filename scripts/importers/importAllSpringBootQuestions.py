#!/usr/bin/env python3
"""
Comprehensive import of ALL Spring Boot questions from content JSON files into the DB.
- Reads all subtopics from content/domains/java/backend/intermediate/spring-boot/
- For questions with complete-qa.json answers → imports with rich answer sections
- For questions without answers → imports with question text as the answer section
- Links every question to stack_id=223 with correct subcategory_slug/name
- Skips questions already in DB (by slug)

Usage:
  python3 scripts/importAllSpringBootQuestions.py [--dry-run]
"""

import json
import os
import re
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

# Maps section types from the JSON (complete-qa) to the DB enum values
SECTION_TYPE_MAP = {
    "speakable_answer":    "speakable_answer",
    "deep_explanation":    "deep_explanation",
    "common_mistakes":     "common_mistakes",
    "followup_questions":  "followup_questions",
    "code_example":        "code_example",
    "interviewer_expectation": "interviewer_expectation",
    "core_concepts":       "core_concepts",
    "important_points":    "important_points",
    "real_world_scenario": "real_world_scenario",
    "interview_tips":      "interview_tips",
    "practice_prompt":     "practice_prompt",
    "short_summary":       "short_summary",
    "detailed_explanation": "detailed_explanation",
}


def to_display_name(slug: str) -> str:
    return " ".join(w.capitalize() for w in slug.replace("-", " ").split())


def question_exists(cur, slug: str):
    cur.execute("SELECT id FROM questions WHERE slug = %s", (slug,))
    row = cur.fetchone()
    return row["id"] if row else None


def get_or_create_topic(cur, slug: str, name: str) -> int:
    cur.execute("SELECT id FROM topics WHERE slug = %s", (slug,))
    row = cur.fetchone()
    if row:
        return row["id"]
    cur.execute(
        "INSERT INTO topics (name, slug, description, created_at, updated_at, order_index) "
        "VALUES (%s, %s, %s, NOW(), NOW(), 1) RETURNING id",
        (name, slug, f"{name} interview questions"),
    )
    return cur.fetchone()["id"]


def get_next_order_index(cur, stack_id: int) -> int:
    cur.execute(
        "SELECT COALESCE(MAX(order_index), 0) + 1 AS nxt FROM question_stack_index WHERE stack_id = %s",
        (stack_id,),
    )
    return cur.fetchone()["nxt"]


def insert_question(cur, topic_id: int, q: dict, read_time: int = 5) -> int:
    difficulty = q.get("difficulty", "medium")
    if difficulty not in ("easy", "medium", "hard"):
        difficulty = "medium"
    cur.execute(
        "INSERT INTO questions (topic_id, title, slug, difficulty, estimated_read_time, is_published, created_at, updated_at) "
        "VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW()) RETURNING id",
        (topic_id, q["title"], q["slug"], difficulty, read_time, True),
    )
    return cur.fetchone()["id"]


def insert_answer_sections_from_complete_qa(cur, question_id: int, answer: dict):
    sections = answer.get("sections", [])
    for order, section in enumerate(sections, start=1):
        raw_type = section.get("type", "core_concepts")
        section_type = SECTION_TYPE_MAP.get(raw_type, raw_type)
        title = section.get("title") or ""
        content = f"# {title}\n\n" if title and title != "undefined" else ""

        if raw_type == "common_mistakes" and section.get("mistakes"):
            for m in section["mistakes"]:
                content += f"## ❌ {m.get('mistake', '')}\n\n"
                content += f"**Why it's wrong:** {m.get('why', '')}\n\n"
                content += f"**✅ Correct approach:** {m.get('correct', '')}\n\n---\n\n"
        elif raw_type == "followup_questions" and section.get("questions"):
            for fq in section["questions"]:
                content += f"### {fq.get('question', '')}\n\n"
                content += f"**Quick Answer:** {fq.get('quickAnswer', '')}\n\n"
        else:
            content += section.get("content") or ""

        cur.execute(
            "INSERT INTO answer_sections (question_id, section_type, content, section_order, created_at, updated_at) "
            "VALUES (%s, %s, %s, %s, NOW(), NOW())",
            (question_id, section_type, content, order),
        )


def insert_basic_answer_section(cur, question_id: int, question_text: str):
    """For questions without rich answers, store the question as interviewer_expectation."""
    cur.execute(
        "INSERT INTO answer_sections (question_id, section_type, content, section_order, created_at, updated_at) "
        "VALUES (%s, %s, %s, %s, NOW(), NOW())",
        (question_id, "interviewer_expectation", question_text, 1),
    )


def link_to_stack(cur, question_id: int, stack_id: int, order_idx: int,
                  subcat_slug: str, subcat_name: str):
    cur.execute(
        "INSERT INTO question_stack_index (question_id, stack_id, order_index, subcategory_slug, subcategory_name) "
        "VALUES (%s, %s, %s, %s, %s) ON CONFLICT (question_id, stack_id) DO NOTHING",
        (question_id, stack_id, order_idx, subcat_slug, subcat_name),
    )


def main(dry_run: bool = False):
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Spring Boot Full Question Importer")
    print(f"Stack ID: {SPRING_BOOT_STACK_ID}")
    print(f"Content: {CONTENT_BASE}\n")

    if not os.path.isdir(CONTENT_BASE):
        print(f"❌ Content directory not found: {CONTENT_BASE}")
        sys.exit(1)

    subtopics = sorted(
        d for d in os.listdir(CONTENT_BASE)
        if os.path.isdir(os.path.join(CONTENT_BASE, d))
    )
    print(f"Found {len(subtopics)} subtopics: {', '.join(subtopics)}\n")

    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, name FROM tech_stacks WHERE id = %s", (SPRING_BOOT_STACK_ID,))
            stack = cur.fetchone()
            if not stack:
                print(f"❌ Stack {SPRING_BOOT_STACK_ID} not found")
                sys.exit(1)
            print(f"✅ Target stack: {stack['name']}\n")

            grand_inserted = grand_skipped = grand_errors = 0

            for subtopic in subtopics:
                subtopic_dir = os.path.join(CONTENT_BASE, subtopic)
                questions_file = os.path.join(subtopic_dir, "questions.json")
                complete_qa_file = os.path.join(subtopic_dir, "complete-qa.json")

                if not os.path.isfile(questions_file):
                    print(f"  ⚠️  {subtopic}: no questions.json, skipping")
                    continue

                with open(questions_file) as f:
                    questions = json.load(f)

                # Build answer map from complete-qa.json
                answers_by_slug: dict = {}
                topic_name_from_cqa = None
                if os.path.isfile(complete_qa_file):
                    with open(complete_qa_file) as f:
                        cqa = json.load(f)
                    topic_name_from_cqa = cqa.get("topic")
                    for q in cqa.get("questions", []):
                        if "answer" in q and q["answer"]:
                            answers_by_slug[q["slug"]] = q["answer"]

                subcat_name = topic_name_from_cqa or to_display_name(subtopic)
                topic_id = get_or_create_topic(cur, subtopic, subcat_name) if not dry_run else 0

                inserted = skipped = errors = 0

                for q in questions:
                    slug = q.get("slug", "")
                    if not slug:
                        continue

                    existing_id = question_exists(cur, slug)

                    if existing_id is not None:
                        # Already exists — just ensure it's linked to this stack with subcategory
                        if not dry_run:
                            cur.execute(
                                "UPDATE question_stack_index SET subcategory_slug = %s, subcategory_name = %s "
                                "WHERE question_id = %s AND stack_id = %s",
                                (subtopic, subcat_name, existing_id, SPRING_BOOT_STACK_ID),
                            )
                            # If no index entry, create one
                            order_idx = get_next_order_index(cur, SPRING_BOOT_STACK_ID)
                            link_to_stack(cur, existing_id, SPRING_BOOT_STACK_ID, order_idx, subtopic, subcat_name)
                        skipped += 1
                        continue

                    try:
                        answer = answers_by_slug.get(slug)
                        read_time = 5
                        if answer and answer.get("metadata", {}).get("readTime"):
                            m = re.search(r"(\d+)", answer["metadata"]["readTime"])
                            if m:
                                read_time = int(m.group(1))

                        if not dry_run:
                            qid = insert_question(cur, topic_id, q, read_time)
                            if answer:
                                insert_answer_sections_from_complete_qa(cur, qid, answer)
                            else:
                                insert_basic_answer_section(cur, qid, q.get("question", q["title"]))

                            order_idx = get_next_order_index(cur, SPRING_BOOT_STACK_ID)
                            link_to_stack(cur, qid, SPRING_BOOT_STACK_ID, order_idx, subtopic, subcat_name)

                        inserted += 1
                    except Exception as e:
                        print(f"    ❌ {slug}: {e}")
                        errors += 1

                answer_info = f"{len(answers_by_slug)} with rich answers" if answers_by_slug else "question-text only"
                print(f"  [{subtopic:25s}] ✅ {inserted:3d} new | ⚠️  {skipped:3d} skip | {answer_info}")
                grand_inserted += inserted
                grand_skipped += skipped
                grand_errors += errors

            if not dry_run:
                conn.commit()
                print(f"\n✅ Committed to database")
            else:
                conn.rollback()
                print(f"\n[DRY RUN] Nothing written")

            print(f"\n{'='*50}")
            print(f"  Inserted : {grand_inserted}")
            print(f"  Skipped  : {grand_skipped}")
            print(f"  Errors   : {grand_errors}")
            print(f"{'='*50}\n")

    except Exception as e:
        conn.rollback()
        print(f"❌ Fatal: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
