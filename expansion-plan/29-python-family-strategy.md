# 29 — Python Family: Strategy & Rollout Order

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** read-only strategy doc; canonical reference for playbooks 30–40.

## TL;DR

- **Goal:** Treat Python like a parallel Java empire — five locked
  domains, each with the same depth standards JBI / JBB / JBA hit.
- **Domains to ship (in this order):**
  1. **PBI** — `python-backend-intermediate` (3–7 YOE Python backend)
  2. **PBB** — `python-backend-beginner` (0–2 YOE Python backend)
  3. **PDE** — `python-data-engineering` (data engineering with Python)
  4. **PML** — `python-ml-ai` (ML / AI / LLM-engineering with Python)
  5. **PFS** — `python-fullstack` (Python backend + frontend, FastAPI/Django + React/Vue/HTMX)
- **Why this order:** PBI is the universal foundation; PBB and PDE
  branch from it; PML is the highest-growth-rate target; PFS is the
  bridge to fullstack search demand.

## Hard prerequisites

- [ ] Java empire is publicly live (JBI + JBB + JBA + JFI) — proves the
      pattern.
- [ ] `scripts/new_locked_domain.py` battle-tested on JBB + JBA.
- [ ] Playbook 11-style audit pattern can be reused for Python.

## Why this matters (2 sentences)

Python search volume on interview queries is ~70 % of Java's globally
and **growing faster** — particularly in data engineering, ML, and
fullstack-startup segments where Java has no foothold. Owning Python
at the same depth as Java doubles our total addressable surface and
defends against the obvious competitive risk that a Python-only
competitor (RealPython, TestDriven.io) corners the high-growth half
of interview prep.

## Search phrases to own (Python family — see per-domain playbooks for full lists)

| Search phrase                                          | Owning domain               |
| ------------------------------------------------------ | --------------------------- |
| `python interview questions`                           | PBI                         |
| `python backend interview questions`                   | PBI                         |
| `python interview questions for freshers`              | PBB                         |
| `data engineer interview questions python`             | PDE                         |
| `airflow interview questions`                          | PDE                         |
| `machine learning engineer interview questions`        | PML                         |
| `mlops interview questions`                            | PML                         |
| `pytorch interview questions`                          | PML                         |
| `langchain interview questions`                        | PML                         |
| `fastapi interview questions`                          | PBI / PFS                   |
| `django interview questions`                           | PBI / PFS                   |
| `python fullstack interview questions`                 | PFS                         |
| `staff engineer python interview questions`            | PBA                         |

## Current state

- PBI exists as a scaffolded locked domain with 35 module folders,
  ~18 questions total — heavy scaffold, almost no content.
- PBB / PDE / PML / PFS / PBA do NOT exist on disk yet.
- Public visibility OFF — none of the Python domains is in
  `LOCKED_DOMAINS` / `LAUNCH_QUICK_PATHS`.

## Target state (measurable)

- 5 Python domains shipped, each meeting its launch Q target.
- Cumulative ≥ 4700 Python Q's across the five domains.
- All five appear in `LOCKED_DOMAINS` and `LAUNCH_QUICK_PATHS`.
- Speakable per-domain pass+warn ≥ 90 %.

## Domain comparison cheat sheet

| Domain | Slug                       | Audience              | Modules | Min Q | Special angle                                          |
| ------ | -------------------------- | --------------------- | ------- | ----- | ------------------------------------------------------ |
| PBI    | `python-backend-intermediate` | 3–7 YOE Python backend | 28      | 1800   | Django + FastAPI + Flask; SQL; testing; deploy           |
| PBB    | `python-backend-beginner`     | 0–2 YOE                | 12      | 400    | Beginner tone, runnable scripts, `if __name__ == "__main__"` |
| PDE    | `python-data-engineering`     | Data engineers         | 16      | 800   | Airflow, Spark, dbt, Snowflake, Kafka                   |
| PML    | `python-ml-ai`                | ML engineers           | 18      | 1000  | PyTorch, scikit-learn, LangChain, RAG, vector DBs        |
| PFS    | `python-fullstack`            | Python + frontend       | 18     | 700   | FastAPI/Django + React/Vue/HTMX                          |

(Targets in this table are the LAUNCH minimums; ongoing growth budget
adds more.)

## Universal Python content rules

These apply to ALL five Python domains:

1. Target **Python 3.12+** by default. Mention 3.11 / 3.10 only if the
   answer materially depends on the version.
2. Use **PEP 8** style; type hints on every signature.
3. Async examples target **`asyncio`** standard library; cite when
   anyio / trio is necessary.
4. Web examples target **FastAPI (3.12+)** by default; Django/Flask only
   when explicitly the topic.
5. Linting: `ruff` (preferred) or `black + isort` shown — never both.
6. Testing: **pytest** by default; `unittest` only in beginner module
   when comparing.
7. No `print()` in production-shaped code; use `logging` (or structured
   logger).
8. No `pip install -r requirements.txt` in modern examples — show
   `uv pip install` or `poetry install` or `pip install` + `pyproject.toml`.

## Pillar reuse

Python uses the same 12-pillar system (P01..P12) as Java, but the
content of pillars differs (e.g. P01 "language fundamentals" is
Python-language for PBI; pillars table for each Python domain lives in
that domain's spec playbook).

Add to `frontend/lib/pillars.ts`:

```typescript
export const PYTHON_PILLARS: Record<PillarId, PillarMeta> = {
  P01: { id: 'P01', name: 'Python Language Core',              seoSlug: 'python-language-core',                blurb: 'Syntax, data structures, OO, functional, errors.' },
  P02: { id: 'P02', name: 'Web Frameworks',                    seoSlug: 'python-web-frameworks',               blurb: 'FastAPI, Django, Flask.' },
  P03: { id: 'P03', name: 'Data & Storage',                    seoSlug: 'python-data-storage',                 blurb: 'SQL, ORMs (SQLAlchemy, Django ORM), NoSQL.' },
  P04: { id: 'P04', name: 'APIs & Protocols',                  seoSlug: 'python-apis-protocols',               blurb: 'REST, GraphQL (Strawberry), gRPC.' },
  P05: { id: 'P05', name: 'Async, Messaging, Workers',         seoSlug: 'python-async-messaging-workers',      blurb: 'asyncio, Celery, RQ, Kafka.' },
  P06: { id: 'P06', name: 'System & Application Design',       seoSlug: 'python-system-design',                blurb: 'Architecture for Python services.' },
  P07: { id: 'P07', name: 'Security',                          seoSlug: 'python-security',                     blurb: 'Auth, secrets, supply-chain.' },
  P08: { id: 'P08', name: 'Testing & Quality',                 seoSlug: 'python-testing-quality',              blurb: 'pytest, mypy, ruff, hypothesis.' },
  P09: { id: 'P09', name: 'DevOps & Build',                    seoSlug: 'python-devops-build',                 blurb: 'Poetry, Docker, CI/CD for Python.' },
  P10: { id: 'P10', name: 'Cloud & Serverless',                seoSlug: 'python-cloud-serverless',              blurb: 'AWS Lambda, GCP Functions, container deploy.' },
  P11: { id: 'P11', name: 'Observability & Production',        seoSlug: 'python-observability-production',     blurb: 'Logs, metrics, traces, profiling.' },
  P12: { id: 'P12', name: 'Behavioral & Engineering Practices', seoSlug: 'python-behavioral-engineering',       blurb: 'STAR + Python-specific stories.' },
};
```

(Playbook 30 lands this map.)

## Cross-domain map

| Direction                       | Required cross-links                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| PBB → PBI                        | Every PBB module deep-link to its PBI counterpart                                    |
| PBI → PBB                        | Each PBI module headline-link "new to Python? → PBB"                                 |
| PBI → PDE                        | data-storage / db-internals → PDE                                                   |
| PBI → PML                        | nothing — they overlap minimally on the language side                                |
| PDE → PBI                        | python-basics topics → PBI                                                          |
| PML → PBI                        | language fundamentals → PBI                                                         |
| PFS → PBI                        | backend modules → PBI                                                               |

## Hard rule — content drift

After PBI is at depth, JBI and PBI should NOT diverge on the
architecture-level topics (system-design, microservices, observability).
The Python-specific angle is in the code samples, NOT the conceptual answer.

If a system-design question is answered differently in JBI vs PBI for
reasons other than "Python idioms", flag and reconcile.

## SEO strategy across the Python empire

| Domain | Canonical SEO slug                                | Alt slugs (examples)                                                              |
| ------ | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| PBI    | `python-interview-questions`                      | python-developer-interview-questions, python-backend-developer-interview-questions |
| PBB    | `python-interview-questions-for-freshers`         | python-basic-interview-questions, python-beginner-interview-questions             |
| PDE    | `data-engineering-interview-questions-python`     | python-data-engineer-interview-questions, etl-pipeline-interview-questions          |
| PML    | `machine-learning-interview-questions-python`     | ml-engineer-interview-questions, deep-learning-interview-questions                |
| PFS    | `python-fullstack-interview-questions`            | fastapi-react-interview-questions, django-react-interview-questions                |

## Pipeline (timeline)

1. **30** — PBI spec sign-off.
2. **31** — PBI scaffold + wire (hidden).
3. **32–34** — PBI content depth across 28 modules.
4. **35** — PBI launch (flip flag + redirects).
5. **36–37** — PBB spec + scaffold + content + launch.
6. **38** — PDE spec + scaffold + content + launch.
7. **39** — PML spec + scaffold + content + launch.
8. **40** — PFS spec + scaffold + content + launch.

Treat each domain as its own "JBI rollout" — the same effort budget.

## Quality gates (strategy doc only)

| Gate                                                  | Threshold      |
| ----------------------------------------------------- | -------------- |
| 5 Python domains identified with audience + module count | yes         |
| `PYTHON_PILLARS` map drafted above                    | yes            |
| Universal content rules section approved              | yes            |
| Cross-domain link map approved                        | yes            |

## Failure modes & rollback

- **PBI content drifts in voice** away from JBI (chattier, less
  interview-shaped): per-module audit catches this; rewrite to match
  archetype + voice rules in playbook 06.
- **A Python domain ships before PBI** by accident (e.g. PML
  jumps the queue): block at PR review — PBI must be DONE first
  (it's the reuse anchor for PML's `python-language-core` cross-links).
- **Pillar drift** (someone proposes a Python-only pillar P13): refuse —
  the pillar system stays at 12; new Python topics fold into existing
  pillars (mostly P02 for FastAPI / Django).
- **Speakable lint floor drops below 90 %** on any Python domain:
  blocker. Do not flip the matching launch flag until the lint passes.
- **Two Python domains contradict each other** (e.g. PBI says "use
  async by default", PBA says "use threads for CPU-bound"): contradictions
  are fine if they're justified per audience; if not, the cross-domain
  link map (above) must be updated to lock the canonical position.
- **Rollback per domain:** set the matching `LAUNCH_QUICK_PATHS` entry
  off in `launch-config.ts`; content stays on disk.

## Definition of Done

- [ ] This file is the canonical reference for playbooks 30–40.
- [ ] `00-INDEX.md` row for `29` flipped to `DONE`.

## Estimated effort

- **Ideal:** 4 hours.
- **Hard stop:** 8 hours.
