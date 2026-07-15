#!/usr/bin/env python3
"""Scaffold a new locked domain across all six wiring points.

Usage:
  python3 scripts/new_locked_domain.py \\
    --slug python-backend-beginner \\
    --track python-backend \\
    --premium true \\
    --modules core-python-basics:P01:"Core Python":python-interview-questions-for-freshers \\
             python-oop:P02:"Python OOP":python-oop-interview-questions

Each --modules entry is: moduleSlug:pillarCode:Title:seoSlug

Exit code: 0 = success, 1 = error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = REPO_ROOT / "content"
FRONTEND_LIB = REPO_ROOT / "frontend" / "lib"
CONTENT_READER = FRONTEND_LIB / "content-reader.ts"
SEO_SLUGS = FRONTEND_LIB / "seo-slugs.ts"
COURSE_LMS = FRONTEND_LIB / "course-lms.ts"
SCHEMA_PATH = CONTENT_ROOT / "_schemas" / "complete-qa.schema.json"


def parse_module(raw: str) -> dict:
    """Parse 'moduleSlug:pillarCode:Title:seoSlug' into a dict."""
    parts = raw.split(":", 3)
    if len(parts) != 4:
        raise ValueError(f"Module arg must be slug:pillar:title:seoSlug — got: {raw!r}")
    return {
        "moduleSlug": parts[0],
        "pillar": parts[1],
        "title": parts[2],
        "seoSlug": parts[3],
    }


def slug_to_const(slug: str) -> str:
    """'python-backend-beginner' → 'PYTHON_BACKEND_BEGINNER'"""
    return slug.upper().replace("-", "_")


def write_index_json(slug: str, track: str, modules: list[dict]) -> Path:
    """Create content/<slug>/_index.json."""
    domain_dir = CONTENT_ROOT / slug
    domain_dir.mkdir(parents=True, exist_ok=True)
    index_path = domain_dir / "_index.json"
    if index_path.exists():
        print(f"  [skip] {index_path} already exists")
        return index_path

    index = {
        "domainSlug": slug,
        "track": track,
        "modules": [
            {
                "moduleSlug": m["moduleSlug"],
                "pillar": m["pillar"],
                "title": m["title"],
                "seoSlug": m["seoSlug"],
                "altSlugs": [],
                "topics": ["scaffold"],
            }
            for m in modules
        ],
    }
    index_path.write_text(json.dumps(index, indent=2))
    print(f"  [write] {index_path}")
    return index_path


def write_scaffold_qa(slug: str, module_slug: str, module_title: str) -> Path:
    """Create content/<slug>/<module>/scaffold/complete-qa.json."""
    topic_dir = CONTENT_ROOT / slug / module_slug / "scaffold"
    topic_dir.mkdir(parents=True, exist_ok=True)
    qa_path = topic_dir / "complete-qa.json"
    if qa_path.exists():
        print(f"  [skip] {qa_path} already exists")
        return qa_path

    qa = {
        "topic": f"{module_title} — Scaffold",
        "topicSlug": "scaffold",
        "questions": [
            {
                "id": "scaffold-placeholder",
                "slug": "scaffold-placeholder",
                "question": f"[TBD] Placeholder question for {module_title}",
                "title": f"{module_title} — Placeholder",
                "direct_answer": "This is a scaffold placeholder. Replace with real content before launch.",
                "layout_type": "default",
                "difficulty": "medium",
                "importance": "medium",
                "reading_time_minutes": 5,
                "last_updated": "2026-05-29",
                "interviewer_intent": {
                    "testing": "TBD — replace before launch",
                    "common_mistake": "TBD",
                    "to_stand_out": "TBD",
                },
                "company_tags": [],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Placeholder",
                            "content": "Replace this section with real content.",
                        },
                        {
                            "type": "speakable_answer",
                            "title": "How to answer verbally",
                            "content": "Replace this with a speakable answer.",
                        },
                    ]
                },
                "followup_questions": ["TBD — add real follow-ups before launch"],
                "seo": {
                    "metaTitle": f"{module_title} Interview Questions",
                    "metaDescription": f"Top interview questions about {module_title} with clear, verbal answers.",
                },
                "order": 1,
            }
        ],
    }
    qa_path.write_text(json.dumps(qa, indent=2))
    print(f"  [write] {qa_path}")
    return qa_path


def patch_content_reader(slug: str) -> None:
    """Add CONTENT_<SLUG>_ROOT constant and LOCKED_DOMAINS entry."""
    const_name = f"CONTENT_{slug_to_const(slug)}_ROOT"
    text = CONTENT_READER.read_text()

    # Add path constant after last CONTENT_*_ROOT line
    if const_name in text:
        print(f"  [skip] {const_name} already in content-reader.ts")
    else:
        # Find last CONTENT_*_ROOT = path.join line and insert after it
        last_root = list(re.finditer(r"^const CONTENT_\w+_ROOT = path\.join.*$", text, re.MULTILINE))
        if last_root:
            pos = last_root[-1].end()
            new_line = f"\nconst {const_name} = path.join(process.cwd(), '..', 'content', '{slug}');"
            text = text[:pos] + new_line + text[pos:]
            print(f"  [patch] Added {const_name} to content-reader.ts")
        else:
            print(f"  [warn] Could not find insertion point for {const_name}")

    # Add LOCKED_DOMAINS entry — find the closing }; after 'const LOCKED_DOMAINS'
    entry_check = f"'{slug}': {{"
    if entry_check in text:
        print(f"  [skip] '{slug}' already in LOCKED_DOMAINS")
    else:
        # Find position of 'const LOCKED_DOMAINS' then find next standalone '};'
        ld_start = text.find("const LOCKED_DOMAINS")
        if ld_start != -1:
            # Find the closing '};\n' that ends the LOCKED_DOMAINS block
            close_pos = text.find("\n};\n", ld_start)
            if close_pos != -1:
                entry = (
                    f"  '{slug}': {{\n"
                    f"    domainSlug: '{slug}',\n"
                    f"    rootDir: {const_name},\n"
                    f"    stackAliases: {{}},\n"
                    f"  }},\n"
                )
                text = text[:close_pos + 1] + entry + text[close_pos + 1:]
                print(f"  [patch] Added '{slug}' to LOCKED_DOMAINS")
            else:
                print(f"  [warn] Could not find end of LOCKED_DOMAINS block")
        else:
            print(f"  [warn] Could not find LOCKED_DOMAINS declaration")

    CONTENT_READER.write_text(text)


def patch_seo_slugs(slug: str) -> None:
    """Add import and SEO_MODULES entry for the new domain."""
    var_name = slug.replace("-", "_") + "Index"
    text = SEO_SLUGS.read_text()

    # Add import
    import_line = f'import {var_name} from "../../content/{slug}/_index.json";'
    if var_name in text:
        print(f"  [skip] {var_name} import already in seo-slugs.ts")
    else:
        # Insert after last import line
        last_import = list(re.finditer(r'^import .* from ".*_index\.json";$', text, re.MULTILINE))
        if last_import:
            pos = last_import[-1].end()
            text = text[:pos] + "\n" + import_line + text[pos:]
            print(f"  [patch] Added import {var_name} to seo-slugs.ts")

    # Add to SEO_MODULES array
    entry = f'  ...buildEntries({var_name} as RawIndexFile, "{slug}"),'
    if entry in text:
        print(f"  [skip] SEO_MODULES entry for '{slug}' already present")
    else:
        # Insert before the closing ]; of SEO_MODULES
        pattern = r"(export const SEO_MODULES[^[]*\[[^\]]*)\];"
        match = re.search(pattern, text, re.DOTALL)
        if match:
            insert_pos = match.end() - 2  # before ];
            text = text[:insert_pos] + "\n" + entry + "\n" + text[insert_pos:]
            print(f"  [patch] Added SEO_MODULES entry for '{slug}'")

    SEO_SLUGS.write_text(text)


def patch_course_lms(slug: str) -> None:
    """Add slug to PREMIUM_COURSE_SLUGS."""
    if not COURSE_LMS.exists():
        print(f"  [skip] course-lms.ts not found")
        return
    text = COURSE_LMS.read_text()
    entry = f'  "{slug}",'
    if f'"{slug}"' in text:
        print(f"  [skip] '{slug}' already in PREMIUM_COURSE_SLUGS")
        return
    # Insert before closing ]);
    pattern = r"(new Set<string>\(\[[^\]]*)\]\)"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        insert_pos = match.end() - 2  # before ])
        text = text[:insert_pos] + "\n" + entry + "\n" + text[insert_pos:]
        COURSE_LMS.write_text(text)
        print(f"  [patch] Added '{slug}' to PREMIUM_COURSE_SLUGS")
    else:
        print(f"  [warn] Could not find PREMIUM_COURSE_SLUGS array to patch")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--slug", required=True, help="Domain slug, e.g. python-backend-beginner")
    parser.add_argument("--track", required=True, help="Track ID, e.g. python-backend")
    parser.add_argument("--premium", choices=["true", "false"], default="false")
    parser.add_argument("--modules", nargs="+", required=True, metavar="SLUG:PILLAR:TITLE:SEOSLUG")
    args = parser.parse_args()

    try:
        modules = [parse_module(m) for m in args.modules]
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    slug = args.slug
    print(f"\nScaffolding locked domain: {slug}")
    print("=" * 50)

    # 1. Write _index.json
    write_index_json(slug, args.track, modules)

    # 2. Write scaffold Q-files
    for m in modules:
        write_scaffold_qa(slug, m["moduleSlug"], m["title"])

    # 3+4. Patch content-reader.ts
    patch_content_reader(slug)

    # 5. Patch seo-slugs.ts
    patch_seo_slugs(slug)

    # 6. Patch course-lms.ts if premium
    if args.premium == "true":
        patch_course_lms(slug)

    print("\nDone. Next steps:")
    print(f"  python3 scripts/validate_complete_qa.py content/{slug}")
    print(f"  cd frontend && npm run build")
    print(f"  Replace scaffold Q-files with real content before launch.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
