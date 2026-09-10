#!/usr/bin/env python3
"""Register any on-disk DSA problem files that are missing from content/dsa/_index.json.

Index entries are derived from each problem file's own metadata, matching the
conventions already present in the index (see category->module map below). This
is idempotent: already-registered slugs are left untouched. Run after every
authoring wave.
"""
import json
import os
import glob
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DSA = os.path.join(ROOT, "content", "dsa")
INDEX = os.path.join(DSA, "_index.json")

CATEGORIES = [
    "arrays", "backtracking", "binary-search", "bit-manipulation",
    "dynamic-programming", "graphs", "greedy", "heap", "intervals",
    "linked-lists", "math-geometry", "stack-queue", "strings", "trees", "tries",
]

# Dominant moduleSlug per category, derived from existing index entries.
CATEGORY_MODULE = {
    "arrays": "arrays-and-hashing",
    "backtracking": "backtracking",
    "binary-search": "binary-search",
    "bit-manipulation": "bit-manipulation",
    "dynamic-programming": "dynamic-programming",
    "graphs": "graphs",
    "greedy": "greedy",
    "heap": "heap-and-priority-queue",
    "intervals": "intervals",
    "linked-lists": "linked-list",
    "math-geometry": "math-and-number-theory",
    "stack-queue": "stack-and-queue",
    "strings": "arrays-and-hashing",
    "trees": "trees-and-bst",
    "tries": "tries",
}

LEVEL_TAGS = {
    "easy": ["beginner"],
    "medium": ["intermediate"],
    "hard": ["intermediate", "advanced"],
}

CORE_REQUIRED = {
    "slug", "title", "difficulty", "category", "directAnswer",
    "problemStatement", "clarifyingQuestions", "examples", "approaches", "seo",
}


def derive_entry(d):
    cat = d["category"]
    return {
        "slug": d["slug"],
        "title": d["title"],
        "difficulty": d["difficulty"],
        "category": cat,
        "moduleSlug": CATEGORY_MODULE.get(cat, cat),
        "patterns": d.get("patterns", []),
        "level_tags": LEVEL_TAGS.get(d["difficulty"], ["intermediate"]),
        "track_tags": ["backend", "fullstack"],
        "lang_tags": ["any"],
        "company_tags": [c.lower() for c in d.get("companies", [])],
    }


def main():
    idx = json.load(open(INDEX))
    indexed = {p["slug"] for p in idx["problems"]}

    new_entries = []
    problems_seen = []
    for cat in CATEGORIES:
        for f in sorted(glob.glob(os.path.join(DSA, cat, "*.json"))):
            slug = os.path.basename(f)[:-5]
            if slug in indexed:
                continue
            d = json.load(open(f))
            missing = CORE_REQUIRED - set(d.keys())
            if missing:
                print(f"  SKIP (missing {missing}): {cat}/{slug}")
                continue
            if d.get("slug") != slug:
                print(f"  SKIP (slug mismatch {d.get('slug')} != {slug}): {f}")
                continue
            new_entries.append(derive_entry(d))
            problems_seen.append(slug)

    if not new_entries:
        print("Nothing to register — all on-disk problem files already indexed.")
        return 0

    # Backup then write.
    json.dump(idx, open(INDEX + ".bak", "w"), indent=2, ensure_ascii=False)
    idx["problems"].extend(new_entries)
    with open(INDEX, "w") as fh:
        json.dump(idx, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"Registered {len(new_entries)} new problems "
          f"({len(indexed)} -> {len(idx['problems'])} total).")
    for s in problems_seen:
        print("  +", s)
    return 0


if __name__ == "__main__":
    sys.exit(main())
