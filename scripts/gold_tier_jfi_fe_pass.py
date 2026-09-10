#!/usr/bin/env python3
"""
Gold-tier pass for Java Fullstack *frontend* modules (pillars P13–P18).

Writes the standard answer shape for every question in those modules:
  answer.sections: overview, deep dive, architecture_diagram (Mermaid),
  comparison_table, tradeoffs, key_points, speakable_answer — plus
  direct_answer, seo floor, reading_time_minutes.

By default **every question is rewritten** (no “already gold” skip). Use
`--skip-already-gold` only if you want an idempotent second pass.

  python3 scripts/gold_tier_jfi_fe_pass.py
  python3 scripts/gold_tier_jfi_fe_pass.py --dry-run

  Run from the **repository root** (InterviewExplainer/). A trailing word `run`
  is accepted and ignored (e.g. `--dry-run run`).
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "content" / "java-fullstack-intermediate"
INDEX = ROOT / "_index.json"

FE_PILLARS = frozenset({"P13", "P14", "P15", "P16", "P17", "P18"})


def fe_modules() -> list[str]:
    data = json.loads(INDEX.read_text(encoding="utf-8"))
    out: list[str] = []
    for m in data.get("modules") or []:
        if m.get("pillar") in FE_PILLARS and not m.get("contentSource"):
            slug = m.get("moduleSlug")
            if slug:
                out.append(slug)
    return sorted(set(out))


def section_text_total(sections: list) -> int:
    n = 0
    for s in sections or []:
        if isinstance(s, dict):
            n += len(s.get("content") or "")
    return n


def has_mermaid(sections: list) -> bool:
    blob = json.dumps(sections, ensure_ascii=False)
    return "mermaid" in blob.lower()


def already_gold(sections: list) -> bool:
    """Heuristic: long author cards OR prior gold-pass OR strong HTML/CSS-style cards."""
    if not isinstance(sections, list) or len(sections) < 4:
        return False
    t = section_text_total(sections)
    kinds = {s.get("type") for s in sections if isinstance(s, dict)}
    titles = " ".join((s.get("title") or "") for s in sections if isinstance(s, dict))
    mer = has_mermaid(sections)

    # Idempotent: this script already ran on the card.
    if "Why this question matters" in titles and mer:
        return True

    # Reference-depth cards (core-java / system-design style).
    if t >= 7000:
        return True
    if t >= 3500 and bool(kinds & {"comparison_table", "concept_map"}):
        return True
    if mer and t >= 2200 and bool(kinds & {"before_code", "after_code"}):
        return True

    # Hand-authored FE pages: mermaid + substantive overview title not from our intent enricher.
    if mer and t >= 2000:
        if "Interview angle" not in titles and "Why this question matters" not in titles:
            return True

    return False


def esc(s: str) -> str:
    return (s or "").replace('"', "'")[:120]


def diagram_for(module_slug: str, topic_slug: str, title: str) -> str:
    ms, ts = module_slug.lower(), topic_slug.lower()
    label = esc(title)

    if "auth" in ms or "jwt" in ts or "oauth" in ts or "csrf" in ts or "saml" in ts:
        return """```mermaid
sequenceDiagram
    autonumber
    participant U as Browser (SPA)
    participant I as Identity Provider
    participant B as BFF / API
    participant R as Resource API
    U->>I: Authorize (PKCE / code)
    I-->>U: Authorization code
    U->>B: Exchange code (server-side)
    B->>I: Token endpoint + client auth
    I-->>B: Access + refresh (optional)
    B-->>U: HttpOnly session cookie
    U->>R: API call (credentials include)
    Note over U,R: Tokens never in localStorage when using BFF pattern
```"""

    if "api-integration" in ms or "fetch" in ts or "axios" in ts or "graphql" in ts:
        return """```mermaid
flowchart TB
    subgraph Client["Browser / SPA"]
        UI[UI layer]
        CF[fetch / axios client]
        IC[Interceptors]
        AC[AbortController / cancel]
    end
    subgraph Edge["Edge concerns"]
        CORS[CORS preflight]
        CACHE[HTTP cache + ETags]
        RETRY[Retry + backoff + jitter]
    end
    API[(REST / GraphQL API)]
    UI --> CF --> IC --> CORS
    IC --> RETRY
    CF --> AC
    CORS --> API
    CACHE --> API
    RETRY --> API
```"""

    if "realtime" in ms or "websocket" in ts or "sse" in ts or "stomp" in ts:
        return """```mermaid
stateDiagram-v2
    [*] --> Connecting
    Connecting --> Open: handshake OK
    Open --> Degraded: heartbeat missed
    Degraded --> Reconnecting: backoff + jitter
    Reconnecting --> Open: resume / replay
    Open --> Closed: app teardown
    Reconnecting --> Closed: max attempts
    Closed --> [*]
```"""

    if "frontend-build" in ms or "babel" in ts or "webpack" in ts or "vite" in ts or "pnpm" in ts:
        return """```mermaid
flowchart LR
    SRC[Source TS/JS/JSX] --> TRANS[Transform (Babel / SWC)]
    TRANS --> BUNDLE[Bundler graph resolve]
    BUNDLE --> TREE[Tree-shake unused exports]
    TREE --> SPLIT[Code-split async chunks]
    SPLIT --> OUT[dist/ assets + hashes]
    OUT --> CDN[CDN / cache headers]
```"""

    if "frontend-devops" in ms or "ssr" in ts or "next" in ts or "nginx" in ts or "docker" in ts:
        return """```mermaid
flowchart TB
    REQ[Incoming request] --> EDGE[CDN / reverse proxy]
    EDGE -->|static assets| OBJ[(Object store / CDN)]
    EDGE -->|HTML / SSR| SSR[Node or edge SSR]
    SSR --> RSC[Render + data fetch]
    RSC --> CACHE[Set cache-control / surrogate keys]
    CACHE --> RESP[Response to browser]
    RESP --> HYDR[Client hydrate / islands]
```"""

    if "react" in ms:
        return """```mermaid
flowchart TB
    EVT[Event / state change] --> SCHED[Scheduler schedules update]
    SCHED --> DIFF[React reconciles virtual DOM]
    DIFF --> COMMIT[Commit DOM mutations]
    COMMIT --> FX[useLayoutEffect]
    COMMIT --> EF[useEffect after paint]
    subgraph Memo["Performance hooks"]
        MEMO[memo / useMemo / useCallback]
    end
    DIFF --> MEMO
```"""

    if "angular" in ms:
        return """```mermaid
flowchart TB
    INP[Input change / events] --> CD{Change detection run}
    CD -->|Default| TREE[Walk component tree]
    CD -->|OnPush| SUB[Inputs ref + async pipe + markForCheck]
    TREE --> VIEW[Update DOM bindings]
    SUB --> VIEW
    VIEW --> HOOKS[Lifecycle hooks order]
```"""

    if "typescript" in ms or "javascript" in ms:
        return """```mermaid
flowchart LR
    SRC[.ts / .tsx sources] --> SCAN[Typecheck + narrowing]
    SCAN --> EMIT[Emit JS + declarations]
    EMIT --> BUNDLE[Bundled for browser]
    BUNDLE --> MAP[Source maps for debugging]
    subgraph Safety["Interview story"]
        GUARD[Type guards / discriminated unions]
    end
    SCAN --> GUARD
```"""

    if any(x in ms for x in ("html", "css", "browser", "web-performance", "accessibility")):
        return """```mermaid
flowchart TB
    NET[HTML + CSS + JS download] --> PARSE[Parse DOM + CSSOM]
    PARSE --> TREE[Render tree + layout]
    TREE --> PAINT[Paint + composite layers]
    PAINT --> LCP[LCP element timing]
    subgraph Perf["Performance hooks"]
        PRE[preload / prefetch]
        LAZY[lazy images + code-split]
    end
    NET --> PRE
    TREE --> LAZY
```"""

    # default: interview answer architecture
    return f"""```mermaid
flowchart TB
    Q["{label}"] --> DEF[Define terms in one sentence]
    DEF --> MECH[Explain mechanism / API]
    MECH --> TRADE[Trade-offs + when NOT to use]
    TRADE --> PROD[Production: metrics, security, DX]
    PROD --> PIT[Pitfall you have seen]
    PIT --> CLOSE[Close with follow-up angle]
```"""


def comparison_table(title: str, testing: str, mistake: str, stand: str) -> str:
    return (
        "| Angle | What a strong answer includes |\n"
        "|---|---|\n"
        f"| **What interviewers probe** | {testing} |\n"
        f"| **Weak signal (avoid)** | {mistake} |\n"
        f"| **Differentiator** | {stand} |\n"
        "| **Proof you shipped it** | Metrics (LCP, error rate), tests, DevTools trace, or incident story |\n"
    )


def gold_sections(q: dict, module_slug: str, topic_slug: str) -> list[dict]:
    intent = q.get("interviewer_intent") or {}
    testing = (intent.get("testing") or "mechanism, API boundaries, and trade-offs in real apps").strip()
    mistake = (intent.get("common_mistake") or "vague lists with no example or failure mode").strip()
    stand = (intent.get("to_stand_out") or "one concrete tool, metric, or diagram walk-through").strip()
    tit = (q.get("title") or "Topic").strip()
    qu = (q.get("question") or "").strip()

    overview = (
        f"This question — **{tit}** — shows up constantly in **frontend / fullstack** interviews because it separates "
        f"candidates who memorized docs from candidates who can **reason about real systems**.\n\n"
        f"**Restate the prompt:** {qu}\n\n"
        "A gold-level answer does four things in order:\n\n"
        "1. **Define** the terms in plain English (what it is / what problem it solves).\n"
        "2. **Explain the mechanism** (what runs when: browser, bundler, framework, network).\n"
        "3. **Compare trade-offs** (speed vs correctness vs security vs DX) with **when you would not use** the default.\n"
        "4. **Ground it in production** — caching, auth, observability, tests, or an incident you handled.\n\n"
        f"Interviewers are listening for: **{testing}**.\n\n"
        f"The fastest way to lose points is: **{mistake}**.\n\n"
        f"If you only add one “senior” layer, make it: **{stand}**."
    )

    deep = (
        "### What to explain (middle of the answer)\n\n"
        f"- **Core mechanics:** {testing}\n"
        "- **Concrete shape:** give a small code or config snippet *only if it clarifies* (5–15 lines max).\n"
        "- **Interviewer follow-ups:** expect “what breaks in production?”, “how do you debug?”, "
        "“what would you measure?” — answer them proactively.\n\n"
        "### How to sound senior (without rambling)\n\n"
        "- Tie the feature to **user-visible outcomes** (performance, accessibility, security).\n"
        "- Mention **one failure mode** you have actually seen (race, stale cache, hydration mismatch, flaky test).\n"
        "- Close with **one decision rule** (“choose X when …; choose Y when …”).\n"
    )

    trade = (
        "### Trade-offs interviewers expect you to name\n\n"
        "- **Speed vs safety** (types, runtime checks, validation).\n"
        "- **DX vs constraints** (framework magic vs explicit wiring).\n"
        "- **SEO / first paint vs interactivity** (SSR/SSG/CSR choices where relevant).\n"
        "- **Security vs convenience** (tokens, cookies, localStorage, third-party scripts).\n\n"
        "### What “book answer” misses\n\n"
        f"- **Book answer:** repeats definitions.\n"
        f"- **Strong answer:** names **{mistake.lower()[:1]}{mistake[1:] if mistake else 'the pitfall'}** and what you do instead.\n"
    )

    diagram = {
        "type": "architecture_diagram",
        "title": "Mental model (flowchart)",
        "content": diagram_for(module_slug, topic_slug, tit),
    }

    table = {
        "type": "comparison_table",
        "title": "Answer scaffold (what to cover vs what to avoid)",
        "content": comparison_table(tit, testing, mistake, stand),
    }

    keys = (
        "- **Headline definition** in one sentence.\n"
        f"- **Mechanism:** {testing}\n"
        f"- **Pitfall:** {mistake}\n"
        f"- **Differentiator:** {stand}\n"
        "- **Proof:** DevTools / Network / Performance trace, test strategy, or metric.\n"
        "- **Close:** decision rule + sensible follow-up question back to the interviewer.\n"
    )

    speak = (
        "**Open (15–20 seconds):** Restate the question and give the one-sentence definition.\n\n"
        f"**Body (45–60 seconds):** Walk through **{testing}** as a story: what runs, what breaks, what you log/measure.\n\n"
        f"**Pitfall (15 seconds):** Call out **{mistake}** — interviewers reward honesty about real bugs.\n\n"
        f"**Finish (15–20 seconds):** Add **{stand}**, then offer a trade-off question back (“do you optimize for TTFB or TTI here?”).\n"
    )

    return [
        {"type": "overview", "title": "Why this question matters", "content": overview},
        {"type": "step", "title": "Deep dive — what to say", "content": deep},
        diagram,
        table,
        {"type": "tradeoffs", "title": "Trade-offs & senior signal", "content": trade},
        {"type": "key_points", "title": "Key points (memorize this list)", "content": keys},
        {"type": "speakable_answer", "title": "How to answer verbally (timed)", "content": speak},
    ]


def polish_direct_answer(q: dict, module_slug: str) -> None:
    intent = q.get("interviewer_intent") or {}
    testing = (intent.get("testing") or "").strip().rstrip(".")
    mistake = (intent.get("common_mistake") or "").strip().rstrip(".")
    stand = (intent.get("to_stand_out") or "").strip().rstrip(".")
    qu = (q.get("question") or "").strip()
    ms = module_slug.lower()
    if "typescript" in ms or "javascript" in ms:
        realm = "the type checker, emit pipeline, and how types line up with runtime JS"
    elif "react" in ms or "angular" in ms:
        realm = "the framework runtime (render, reconciliation, DI, CD) and the browser"
    elif "frontend-build" in ms or "frontend-devops" in ms:
        realm = "the build graph, bundler/runtime split, and deploy path"
    elif "auth" in ms or "api-integration" in ms or "realtime" in ms:
        realm = "the browser, network, and server contract (headers, cookies, streams)"
    else:
        realm = "the browser pipeline, framework hooks, and user-visible outcomes"

    parts: list[str] = []
    if qu:
        qline = qu if qu.endswith(("?", ".", "!")) else qu + "?"
        parts.append(qline)
    parts.append(
        f"**In one line:** name the mechanism, where it applies ({realm}), and the user-visible outcome."
    )
    if testing:
        parts.append(f"**Interviewers dig into:** {testing}.")
    if mistake:
        parts.append(f"**Classic weak answer:** {mistake}.")
    if stand:
        parts.append(f"**Senior finish:** {stand}.")
    text = "\n\n".join(parts)
    if len(text) > 2600:
        text = text[:2597] + "…"
    q["direct_answer"] = text


def polish_seo(q: dict) -> None:
    seo = q.get("seo")
    if not isinstance(seo, dict):
        seo = {}
    tit = (q.get("title") or "").strip()
    intent = q.get("interviewer_intent") or {}
    testing = (intent.get("testing") or "")[:120]
    desc = (seo.get("metaDescription") or "").strip()
    if len(desc) < 120:
        seo["metaDescription"] = (
            f"{tit}: interview-ready breakdown — {testing}. Trade-offs, pitfalls, production tips, and verbal script."
        )[:300]
    if not seo.get("metaTitle"):
        seo["metaTitle"] = f"{tit} (2026) — Interview Answer"
    q["seo"] = seo


def process_file(path: Path, dry: bool, skip_if_gold: bool) -> tuple[int, int]:
    data = json.loads(path.read_text(encoding="utf-8"))
    topic_slug = data.get("topicSlug") or path.parent.name
    qs = data.get("questions") or []
    changed = 0
    skipped = 0
    module_slug = path.relative_to(ROOT).parts[0]

    for q in qs:
        if not isinstance(q, dict):
            continue
        ans = q.get("answer")
        if not isinstance(ans, dict):
            q["answer"] = {}
            ans = q["answer"]
        secs = ans.get("sections")
        if not isinstance(secs, list):
            secs = []
        if skip_if_gold and already_gold(secs):
            skipped += 1
            continue
        q["answer"] = {"sections": gold_sections(q, module_slug, topic_slug)}
        polish_direct_answer(q, module_slug)
        polish_seo(q)
        q["reading_time_minutes"] = max(int(q.get("reading_time_minutes") or 0), 8)
        q["last_updated"] = "2026-04-24"
        changed += 1

    if changed and not dry:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed, skipped


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Gold-tier scaffolding pass for JFI frontend (P13–P18) complete-qa.json files.",
        epilog="Run from repo root:\n  python3 scripts/gold_tier_jfi_fe_pass.py\n  python3 scripts/gold_tier_jfi_fe_pass.py --dry-run",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("--dry-run", action="store_true", help="Print what would change; do not write files")
    ap.add_argument(
        "--skip-already-gold",
        action="store_true",
        help="Skip questions that already match the gold scaffold (idempotent re-run)",
    )
    args, rest = ap.parse_known_args()
    skip_if_gold = args.skip_already_gold
    for token in rest:
        if token != "run":
            ap.error(f"unrecognized arguments: {' '.join(rest)!r} (use only --dry-run, optional trailing 'run')")

    if not INDEX.is_file():
        raise SystemExit(
            f"Cannot find {INDEX}. Run this script from the repository root, e.g.:\n"
            f"  cd /path/to/InterviewExplainer && python3 scripts/gold_tier_jfi_fe_pass.py [--dry-run]"
        )

    modules = fe_modules()
    print("FE modules:", ", ".join(modules))

    total_changed = total_skipped = total_files = 0
    for mod in modules:
        mod_dir = ROOT / mod
        if not mod_dir.is_dir():
            continue
        for topic_dir in sorted(mod_dir.iterdir()):
            if not topic_dir.is_dir() or topic_dir.name.startswith("_"):
                continue
            qa = topic_dir / "complete-qa.json"
            if not qa.exists():
                continue
            c, s = process_file(qa, args.dry_run, skip_if_gold)
            if c or s:
                total_files += 1
                total_changed += c
                total_skipped += s
                rel = qa.relative_to(REPO)
                print(f"  {rel}: upgraded={c} skipped_already_gold={s}" + (" (dry-run)" if args.dry_run else ""))

    print(f"\nSummary: files touched={total_files}, questions upgraded={total_changed}, skipped={total_skipped}")


if __name__ == "__main__":
    main()
