"""Append new questions to existing complete-qa.json topic files.

Usage:
    python3 scripts/append_new_questions.py <file_path> <questions_json_path>
The questions JSON should be a list of question dicts.
"""
import json
import sys


def append_questions(file_path: str, new_questions: list) -> None:
    with open(file_path, "r") as fp:
        data = json.load(fp)
    existing_slugs = {q.get("slug") for q in data.get("questions", [])}
    added = 0
    for q in new_questions:
        if q.get("slug") in existing_slugs:
            print(f"  skip (exists): {q.get('slug')}")
            continue
        data["questions"].append(q)
        added += 1
    with open(file_path, "w") as fp:
        json.dump(data, fp, indent=2, ensure_ascii=False)
    print(f"  added {added} questions; total now {len(data['questions'])}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    file_path = sys.argv[1]
    questions_json_path = sys.argv[2]
    with open(questions_json_path, "r") as fp:
        new_questions = json.load(fp)
    print(f"Appending to {file_path}")
    append_questions(file_path, new_questions)
