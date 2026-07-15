#!/usr/bin/env python3
"""
reorder_jfi_modules.py

Re-orders content/java-fullstack-intermediate/_index.json into the curriculum
sequence a Java Fullstack Intermediate (2-5 yrs) candidate is actually tested
on. Ordering is driven by interview-frequency signals (top-Google lists,
role-specific patterns) and by learning flow — language fundamentals first,
then framework ecosystems, then integration, architecture, quality, delivery,
and soft/professional topics last.

What it does
============
* Reads _index.json (54+ modules, reused + new).
* Applies MODULE_SEQUENCE below (authoritative list of moduleSlugs in order).
* Renumbers moduleNumber to M01..MNN in that order (pillar IDs untouched).
* Preserves every other field (pillar, topics, contentSource, SEO slugs).
* Validates every existing module appears in the sequence (no silent drops).

Idempotent: safe to re-run. Sequence in-file simply becomes MODULE_SEQUENCE.
"""

from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
JFI_INDEX = REPO_ROOT / "content" / "java-fullstack-intermediate" / "_index.json"


# ── Curriculum sequence (54/56 entries) ──────────────────────────────────────
# Pillars kept intact; only the moduleSlug order changes. Rationale per block:
#
#   P01 Java Language & Core        — every interview starts here.
#   P14 JavaScript & TypeScript     — JS is tier-1 for any FS role; TS is
#                                     required by ~80% of Indian FS listings.
#   P13 Frontend UI Foundations     — HTML/CSS/browser before frameworks.
#   P02 Spring Ecosystem            — backend framework core; reused from JBI.
#   P15 React Ecosystem             — primary UI framework in product cos.
#   P16 Angular Ecosystem           — still dominant in services/enterprise.
#   P03 Data & Persistence          — SQL always asked; Mongo/Redis mid-sr.
#   P04 API, Microservices, Events  — REST first (every interview), then μsvc.
#   P17 Fullstack Integration       — the "glue" a JFI owns end-to-end.
#   P05 Architecture & Design       — design-patterns before system design.
#   P06 System Design               — fundamentals → LLD → case studies.
#   P07 Security                    — OWASP & application security.
#   P08 Testing & Quality           — unit first, then advanced strategies.
#   P09 DevOps                      — Git/Maven/Gradle → CI/CD → Docker → K8s.
#   P18 Frontend Build & Delivery   — bundlers (Webpack/Vite), SSR, CDN.
#   P10 Cloud                       — AWS, cloud-native.
#   P11 Production                  — observability, SRE.
#   P12 Professional                — engineering practices, behavioural.
MODULE_SEQUENCE: list[str] = [
    # P01 ── Java Language & Core ─────────────────────────────────────────────
    "core-java",
    "java-collections",
    "java-streams",
    "java-concurrency",
    "jvm-internals",

    # P14 ── JavaScript & TypeScript Foundations ─────────────────────────────
    "javascript-core",
    "javascript-advanced",
    "typescript-essentials",

    # P13 ── Frontend UI Foundations ─────────────────────────────────────────
    "html-accessibility",
    "css-modern-layouts",
    "browser-internals",
    "web-performance-seo",

    # P02 ── Spring Ecosystem ────────────────────────────────────────────────
    "spring-core",
    "spring-boot",
    "spring-data-jpa",
    "spring-security",
    "spring-webflux",
    "spring-batch",

    # P15 ── React Ecosystem ─────────────────────────────────────────────────
    "react-core",
    "react-state-data",
    "react-routing-forms",
    "react-performance-patterns",
    "react-testing",

    # P16 ── Angular Ecosystem ───────────────────────────────────────────────
    "angular-core",
    "angular-rxjs",
    "angular-forms-router",
    "angular-state-testing",

    # P03 ── Data & Persistence ──────────────────────────────────────────────
    "sql-databases",
    "nosql-mongodb",
    "redis-caching",

    # P04 ── API, Microservices, Messaging ───────────────────────────────────
    "rest-api",
    "microservices",
    "messaging-events",

    # P17 ── Fullstack Integration ───────────────────────────────────────────
    "api-integration",
    "auth-flows-frontend",
    "realtime-uploads",

    # P05 ── Architecture & Design ───────────────────────────────────────────
    "design-patterns",
    "architecture-patterns",

    # P06 ── System Design ───────────────────────────────────────────────────
    "system-design",
    "low-level-design",
    "system-design-cases",

    # P07 ── Security ────────────────────────────────────────────────────────
    "application-security",

    # P08 ── Testing & Quality ───────────────────────────────────────────────
    "unit-testing",
    "advanced-testing",

    # P09 ── DevOps (source control → CI/CD → containers → orchestration) ───
    "git-build-tools",
    "cicd",
    "docker",
    "kubernetes",

    # P18 ── Frontend Build & Delivery ───────────────────────────────────────
    "frontend-build-tools",
    "frontend-devops-ssr",

    # P10 ── Cloud ───────────────────────────────────────────────────────────
    "aws-cloud",
    "cloud-native",

    # P11 ── Production ──────────────────────────────────────────────────────
    "observability",
    "production-sre",

    # P12 ── Professional ────────────────────────────────────────────────────
    "engineering-practices",
    "behavioral",
]


def main() -> None:
    raw = json.loads(JFI_INDEX.read_text(encoding="utf-8"))
    modules = raw.get("modules") or []
    by_slug = {m["moduleSlug"]: m for m in modules}

    # Validate sequence coverage.
    have = set(by_slug.keys())
    want = set(MODULE_SEQUENCE)
    extra = sorted(have - want)
    missing = sorted(want - have)
    if extra:
        raise SystemExit(
            f"Modules present in _index.json but missing from MODULE_SEQUENCE "
            f"(refusing to silently drop them): {extra}"
        )
    if missing:
        raise SystemExit(
            f"Modules listed in MODULE_SEQUENCE but missing from _index.json "
            f"(typo or forgotten seed run?): {missing}"
        )
    if len(MODULE_SEQUENCE) != len(set(MODULE_SEQUENCE)):
        dupes = sorted({s for s in MODULE_SEQUENCE if MODULE_SEQUENCE.count(s) > 1})
        raise SystemExit(f"Duplicates in MODULE_SEQUENCE: {dupes}")

    reordered: list[dict] = []
    for idx, slug in enumerate(MODULE_SEQUENCE, start=1):
        entry = dict(by_slug[slug])          # copy so we don't mutate input
        entry["moduleNumber"] = f"M{idx:02d}"
        reordered.append(entry)

    raw["modules"] = reordered
    raw["totalModules"] = len(reordered)

    JFI_INDEX.write_text(
        json.dumps(raw, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"Reordered {len(reordered)} modules in {JFI_INDEX.relative_to(REPO_ROOT)}"
    )

    # Keep each NEW module's _config.json in sync with the new sequence number.
    # Reused modules live in the source domain and don't have a local folder.
    synced = 0
    for entry in reordered:
        if entry.get("contentSource"):
            continue
        cfg_path = (
            REPO_ROOT / "content" / "java-fullstack-intermediate"
            / entry["moduleSlug"] / "_config.json"
        )
        if not cfg_path.exists():
            continue
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
        if cfg.get("moduleNumber") == entry["moduleNumber"]:
            continue
        cfg["moduleNumber"] = entry["moduleNumber"]
        cfg_path.write_text(
            json.dumps(cfg, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        synced += 1
    if synced:
        print(f"Synced moduleNumber in {synced} _config.json file(s).")


if __name__ == "__main__":
    main()
