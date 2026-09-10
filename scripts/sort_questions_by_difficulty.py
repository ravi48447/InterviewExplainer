#!/usr/bin/env python3
"""Sort questions within each complete-qa.json file by difficulty: easy → medium → hard."""

import json
import glob
import sys
import os

DIFFICULTY_ORDER = {
    "easy": 0,
    "basic": 0,
    "medium": 1,
    "intermediate": 1,
    "hard": 2,
    "advanced": 2,
    "expert": 3,
}

def sort_file(fpath: str) -> bool:
    with open(fpath) as f:
        data = json.load(f)

    if isinstance(data, list):
        questions = data
        is_list = True
    else:
        questions = data.get("questions", [])
        is_list = False

    if len(questions) <= 1:
        return False

    original_ids = [q.get("id") for q in questions]
    sorted_qs = sorted(
        questions,
        key=lambda q: DIFFICULTY_ORDER.get(q.get("difficulty", "easy"), 1)
    )
    new_ids = [q.get("id") for q in sorted_qs]

    if original_ids == new_ids:
        return False  # already sorted

    if is_list:
        out = sorted_qs
    else:
        data["questions"] = sorted_qs
        out = data

    with open(fpath, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return True


def main():
    domain = sys.argv[1] if len(sys.argv) > 1 else "content/java-backend-fresher"
    pattern = os.path.join(domain, "**/complete-qa.json")
    files = sorted(glob.glob(pattern, recursive=True))

    changed = 0
    for fpath in files:
        if sort_file(fpath):
            changed += 1
            print(f"  sorted: {fpath}")

    print(f"\nDone: {changed}/{len(files)} files reordered")


if __name__ == "__main__":
    main()
