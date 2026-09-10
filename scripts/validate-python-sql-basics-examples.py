#!/usr/bin/env python3
"""Validate the canonical Python fresher SQL Basics learning module."""

from __future__ import annotations

import itertools
import json
import re
import sqlite3
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = REPO_ROOT / "content"
DOMAIN_ROOT = CONTENT_ROOT / "python-backend-fresher"
MODULE_ROOT = DOMAIN_ROOT / "sql-basics"
INDEX_PATH = DOMAIN_ROOT / "_index.json"

TOPICS = [
    "select-where-order-by",
    "joins-inner-outer-left",
    "group-by-and-having",
    "aggregate-functions",
    "subqueries-basics",
    "primary-foreign-keys",
    "basic-indexes-concept",
    "comparisons",
]

SQL_BLOCK_RE = re.compile(r"```sql\n(.*?)\n```", re.DOTALL | re.IGNORECASE)
MERMAID_BLOCK_RE = re.compile(r"```mermaid\n(.*?)\n```", re.DOTALL | re.IGNORECASE)
BOLD_HEADING_RE = re.compile(r"\*\*([^*\n]+)\.\*\*")
TABLE_SEPARATOR_RE = re.compile(r"(?m)^\s*\|(?:\s*:?-{3,}:?\s*\|){2,}\s*$")
EDITORIAL_HEADING_RE = re.compile(
    r"^(?:start|begin|follow|see|know|remember|trace|how it works|plain definition|easy example|boundary to remember)\b",
    re.IGNORECASE,
)
SHELL_RE = re.compile(
    r"(?:compare the options by correctness|use it when it fits|mention one trade-off|"
    r"walk through a small example|practical understanding of|core interview concept|"
    r"how would you debug a problem involving|with an alternative)",
    re.IGNORECASE,
)

FACT_MARKERS = {
    "sql-null-comparisons-and-ordering": ["three logical outcomes", "PostgreSQL", "SQLite", "NULLS LAST"],
    "sql-full-outer-join-and-portable-emulation": ["SQLite", "3.39", "MySQL", "UNION ALL"],
    "sql-count-star-vs-column-vs-distinct": ["COUNT(*)", "COUNT(email)", "COUNT(DISTINCT email)"],
    "sql-sum-avg-null-and-coalesce": ["every selected amount is NULL", "COALESCE", "total()"],
    "sql-not-in-null-vs-not-exists": ["three-valued", "NOT EXISTS", "NOT NULL"],
    "sql-primary-key-vs-unique-constraint": ["multiple NULL", "STRICT", "WITHOUT ROWID"],
    "sql-foreign-key-referential-actions": ["PRAGMA foreign_keys = ON", "CASCADE", "SET NULL"],
    "sql-btree-index-benefits-and-limits": ["default index type", "B-tree", "EXPLAIN"],
    "sql-delete-vs-truncate-vs-drop": ["transaction-safe", "SQLite does not implement", "ACCESS EXCLUSIVE"],
}


class ValidationError(RuntimeError):
    pass


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()


def word_count(value: str) -> int:
    without_code = re.sub(r"```[\s\S]*?```", " ", value)
    return len(re.findall(r"\b[\w'-]+\b", without_code))


def shingles(value: str, size: int = 5) -> set[tuple[str, ...]]:
    words = normalize(value).split()
    return {tuple(words[index : index + size]) for index in range(max(0, len(words) - size + 1))}


def containment(left: str, right: str, size: int = 5) -> float:
    left_shingles = shingles(left, size)
    right_shingles = shingles(right, size)
    if not left_shingles or not right_shingles:
        return 0.0
    return len(left_shingles & right_shingles) / min(len(left_shingles), len(right_shingles))


def read_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValidationError(f"Cannot read {path.relative_to(REPO_ROOT)}: {error}") from error


def split_sql_statements(source: str) -> list[str]:
    statements: list[str] = []
    buffer = ""
    for line in source.splitlines():
        if line.lstrip().startswith("-- Expected result:"):
            continue
        buffer += f"{line}\n"
        if sqlite3.complete_statement(buffer):
            statement = buffer.strip()
            if statement:
                statements.append(statement)
            buffer = ""
    if buffer.strip():
        raise ValidationError(f"Incomplete SQL statement: {buffer.strip()[:100]}")
    return statements


def execute_statements(connection: sqlite3.Connection, statements: list[str]) -> list[list[Any]] | None:
    last_rows: list[list[Any]] | None = None
    for statement in statements:
        cursor = connection.execute(statement)
        if cursor.description is not None:
            last_rows = [list(row) for row in cursor.fetchall()]
    return last_rows


def execute_deep_example(slug: str, block: str) -> tuple[list[str], list[list[Any]]]:
    first_line = block.splitlines()[0] if block.splitlines() else ""
    marker = re.fullmatch(r"-- Expected result: (.+)", first_line)
    if marker is None:
        raise ValidationError(f"{slug}: Deep Dive SQL needs an Expected result JSON comment")
    try:
        expected = json.loads(marker.group(1))
    except json.JSONDecodeError as error:
        raise ValidationError(f"{slug}: invalid Expected result JSON: {error}") from error
    statements = split_sql_statements(block)
    with sqlite3.connect(":memory:") as connection:
        actual = execute_statements(connection, statements)
    if actual != expected:
        raise ValidationError(f"{slug}: expected {expected!r}, received {actual!r}")
    return statements, actual


def statement_kind(statement: str) -> str:
    cleaned = re.sub(r"^\s*(?:--[^\n]*\n\s*)+", "", statement)
    match = re.match(r"([A-Za-z]+(?:\s+[A-Za-z]+)?)", cleaned)
    return match.group(1).upper() if match else ""


def execute_interview_example(slug: str, block: str, deep_statements: list[str]) -> None:
    interview_statements = split_sql_statements(block)
    if not interview_statements:
        raise ValidationError(f"{slug}: empty Interview Answer SQL example")

    interview_has_query = any(statement_kind(item).startswith("SELECT") for item in interview_statements)
    interview_only_creates = all(statement_kind(item).startswith("CREATE TABLE") for item in interview_statements)

    with sqlite3.connect(":memory:") as connection:
        if not interview_only_creates:
            interview_creates_index = any(statement_kind(item).startswith("CREATE INDEX") for item in interview_statements)
            for statement in deep_statements:
                kind = statement_kind(statement)
                if kind.startswith("CREATE TABLE") or kind.startswith("INSERT") or kind.startswith("PRAGMA"):
                    connection.execute(statement)
                elif kind.startswith("CREATE INDEX") and not interview_creates_index:
                    connection.execute(statement)
        result = execute_statements(connection, interview_statements)

    if interview_has_query and result is None:
        raise ValidationError(f"{slug}: Interview Answer query produced no readable result")


def validate_markdown_tables(slug: str, deep: str) -> None:
    lines = deep.splitlines()
    for index, line in enumerate(lines):
        if not re.fullmatch(r"\s*\|(?:\s*:?-{3,}:?\s*\|){2,}\s*", line):
            continue
        if index == 0 or index + 1 >= len(lines):
            raise ValidationError(f"{slug}: incomplete Markdown table")
        expected_columns = line.count("|") - 1
        table_index = index - 1
        while table_index >= 0 and lines[table_index].strip().startswith("|"):
            if lines[table_index].count("|") - 1 != expected_columns:
                raise ValidationError(f"{slug}: inconsistent Markdown table columns")
            table_index -= 1
        table_index = index + 1
        while table_index < len(lines) and lines[table_index].strip().startswith("|"):
            if lines[table_index].count("|") - 1 != expected_columns:
                raise ValidationError(f"{slug}: inconsistent Markdown table columns")
            table_index += 1


def iter_active_questions() -> list[tuple[Path, dict[str, Any]]]:
    entries: list[tuple[Path, dict[str, Any]]] = []
    for path in CONTENT_ROOT.rglob("complete-qa.json"):
        if ".archive" in path.parts:
            continue
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        questions = document if isinstance(document, list) else document.get("questions", [])
        if not isinstance(questions, list):
            continue
        for question in questions:
            if isinstance(question, dict):
                entries.append((path, question))
    return entries


def validate_source_of_truth(target_files: set[Path], target_questions: list[dict[str, Any]]) -> None:
    index = read_json(INDEX_PATH)
    matching_modules = [item for item in index.get("modules", []) if item.get("moduleSlug") == "sql-basics"]
    if len(matching_modules) != 1:
        raise ValidationError(f"Expected one indexed sql-basics module; found {len(matching_modules)}")
    module = matching_modules[0]
    if module.get("topics") != TOPICS or module.get("questionCount") != 24:
        raise ValidationError("Indexed SQL Basics topic order or question count is incorrect")

    config = read_json(MODULE_ROOT / "_config.json")
    if config.get("topics") != TOPICS or config.get("questionCount") != 24 or config.get("visible") is not True:
        raise ValidationError("SQL Basics config does not match the canonical index")
    revision = read_json(MODULE_ROOT / "_revision.json")
    if revision.get("questionCount") != 24 or revision.get("status") != "gold-standard":
        raise ValidationError("SQL Basics revision metadata is stale")

    noncanonical_python_mirrors = [
        path for path in CONTENT_ROOT.glob("interview/python/**/sql-basics/**/complete-qa.json")
        if path not in target_files and ".archive" not in path.parts
    ]
    if noncanonical_python_mirrors:
        display = ", ".join(str(path.relative_to(REPO_ROOT)) for path in noncanonical_python_mirrors)
        raise ValidationError(f"Active noncanonical Python SQL Basics answers remain: {display}")

    active = iter_active_questions()
    target_ids = {item["id"] for item in target_questions}
    target_slugs = {item["slug"] for item in target_questions}
    target_wording = {normalize(item["question"]) for item in target_questions}
    collisions: list[str] = []
    for path, question in active:
        if path in target_files:
            continue
        if question.get("id") in target_ids:
            collisions.append(f"id {question.get('id')} in {path.relative_to(REPO_ROOT)}")
        if question.get("slug") in target_slugs:
            collisions.append(f"slug {question.get('slug')} in {path.relative_to(REPO_ROOT)}")
        wording = normalize(str(question.get("question", "")))
        if wording and wording in target_wording:
            collisions.append(f"question {question.get('question')} in {path.relative_to(REPO_ROOT)}")
    if collisions:
        raise ValidationError("Global SQL Basics collisions:\n" + "\n".join(collisions))


def main() -> None:
    problems: list[str] = []
    questions: list[dict[str, Any]] = []
    target_files: set[Path] = set()
    interview_words: list[int] = []
    deep_words: list[int] = []
    visual_counts = {"mermaid": 0, "table": 0}
    example_results = 0

    for topic in TOPICS:
        path = MODULE_ROOT / topic / "complete-qa.json"
        target_files.add(path)
        try:
            document = read_json(path)
        except ValidationError as error:
            problems.append(str(error))
            continue
        entries = document.get("questions", [])
        if document.get("topicSlug") != topic:
            problems.append(f"{topic}: topicSlug does not match its directory")
        if len(entries) != 3:
            problems.append(f"{topic}: expected 3 questions; found {len(entries)}")

        for expected_order, question in enumerate(entries, 1):
            slug = str(question.get("slug", f"{topic}-missing-slug"))
            questions.append(question)
            try:
                expected_id = f"sql-basics-{topic}-q{expected_order:03d}"
                if question.get("id") != expected_id or question.get("order") != expected_order:
                    raise ValidationError(f"{slug}: ID or order is not deterministic")
                if SHELL_RE.search(f"{question.get('question', '')} {question.get('direct_answer', '')}"):
                    raise ValidationError(f"{slug}: generated-shell wording remains")
                if len(str(question.get("direct_answer", "")).strip()) < 80:
                    raise ValidationError(f"{slug}: direct answer is not self-contained")

                sections = question.get("answer", {}).get("sections", [])
                section_types = [section.get("type") for section in sections]
                if section_types != ["key_points", "speakable_answer", "deep_explanation"]:
                    raise ValidationError(f"{slug}: learner phases are not exactly Quick, Interview, Deep Dive")

                quick = sections[0].get("items", [])
                if not 4 <= len(quick) <= 6 or len({normalize(item) for item in quick}) != len(quick):
                    raise ValidationError(f"{slug}: Quick Revision needs 4–6 distinct exact points")
                if any(len(normalize(item).split()) < 5 for item in quick):
                    raise ValidationError(f"{slug}: Quick Revision contains an unexplained fragment")

                speaking = str(sections[1].get("content", ""))
                deep = str(sections[2].get("content", ""))
                if sections[1].get("answerSize") != "standard":
                    raise ValidationError(f"{slug}: Interview Answer must use standard presentation")
                if SHELL_RE.search(speaking) or SHELL_RE.search(deep):
                    raise ValidationError(f"{slug}: generic shell language remains in a learner phase")

                interview_blocks = SQL_BLOCK_RE.findall(speaking)
                deep_blocks = SQL_BLOCK_RE.findall(deep)
                if len(interview_blocks) != 1:
                    raise ValidationError(f"{slug}: Interview Answer needs one focused SQL example")
                if len(deep_blocks) != 1:
                    raise ValidationError(f"{slug}: Deep Dive needs one complete SQL example")

                headings = BOLD_HEADING_RE.findall(deep)
                if len(headings) < 4 or len(set(headings)) != len(headings):
                    raise ValidationError(f"{slug}: Deep Dive needs distinct concept-specific headings")
                if any(EDITORIAL_HEADING_RE.search(heading) for heading in headings):
                    raise ValidationError(f"{slug}: editorial Deep Dive heading remains")
                if EDITORIAL_HEADING_RE.search(str(sections[2].get("title", ""))):
                    raise ValidationError(f"{slug}: editorial Deep Dive title remains")

                mermaids = len(MERMAID_BLOCK_RE.findall(deep))
                tables = len(TABLE_SEPARATOR_RE.findall(deep))
                if mermaids + tables != 1:
                    raise ValidationError(f"{slug}: expected one meaningful visual; found {mermaids + tables}")
                visual_counts["mermaid"] += mermaids
                visual_counts["table"] += tables
                validate_markdown_tables(slug, deep)

                deep_statements, _ = execute_deep_example(slug, deep_blocks[0])
                execute_interview_example(slug, interview_blocks[0], deep_statements)
                example_results += 1

                if containment(speaking, deep) >= 0.55:
                    raise ValidationError(f"{slug}: Interview Answer is substantially reused in Deep Dive")
                interview_words.append(word_count(speaking))
                deep_words.append(word_count(deep))

                combined = f"{speaking}\n{deep}"
                for marker in FACT_MARKERS.get(slug, []):
                    if marker not in combined:
                        raise ValidationError(f"{slug}: required verified fact marker is missing: {marker}")
            except (ValidationError, sqlite3.Error) as error:
                problems.append(f"{slug}: {error}")

    ids = [str(question.get("id", "")) for question in questions]
    slugs = [str(question.get("slug", "")) for question in questions]
    wording = [normalize(str(question.get("question", ""))) for question in questions]
    if len(questions) != 24:
        problems.append(f"Module total is {len(questions)} instead of 24")
    if len(set(ids)) != len(ids):
        problems.append("Duplicate IDs exist inside SQL Basics")
    if len(set(slugs)) != len(slugs):
        problems.append("Duplicate slugs exist inside SQL Basics")
    if len(set(wording)) != len(wording):
        problems.append("Duplicate normalized questions exist inside SQL Basics")

    answer_pairs = []
    for left, right in itertools.combinations(questions, 2):
        left_text = str(left.get("answer", {}).get("sections", [{}, {}, {}])[1].get("content", ""))
        right_text = str(right.get("answer", {}).get("sections", [{}, {}, {}])[1].get("content", ""))
        score = containment(left_text, right_text)
        if score >= 0.45:
            answer_pairs.append(f"{left.get('slug')} / {right.get('slug')} ({score:.2f})")
    if answer_pairs:
        problems.append("Cross-question Interview Answer duplication:\n" + "\n".join(answer_pairs))

    try:
        validate_source_of_truth(target_files, questions)
    except ValidationError as error:
        problems.append(str(error))

    if problems:
        raise SystemExit("SQL Basics validation failed:\n- " + "\n- ".join(problems))

    print(f"SQLite {sqlite3.sqlite_version}: executed {example_results} Deep Dive result checks and {example_results} Interview Answer examples.")
    print(f"Validated 24 questions across 8 topics; visuals: {visual_counts['mermaid']} Mermaid, {visual_counts['table']} tables.")
    print(f"Interview Answer prose range: {min(interview_words)}–{max(interview_words)} words (reported, not used as a target).")
    print(f"Deep Dive prose range: {min(deep_words)}–{max(deep_words)} words (reported, not used as a target).")
    print("IDs, slugs, normalized questions, source-of-truth, shell wording, and similarity checks passed.")


if __name__ == "__main__":
    main()
