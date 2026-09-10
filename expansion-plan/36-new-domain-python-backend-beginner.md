# 36 — New Domain: `python-backend-beginner` (FULL SPEC + ROLLOUT)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain spec + scaffold + content + launch in ONE playbook.
> (PBB is smaller than PBI so we collapse spec/scaffold/content/launch.)

---

## §0 — Front-matter

```yaml
playbook:    36
version:     1.0
status:      ready
wave:        D
domain:      python-backend-beginner
modules:     12
q_target:    400
archetypes:  A:50% B:25% D:5% E:5% F:10% G:5%
difficulty:  E:60 M:35 H:5
version_pins:
  python: "3.12"
  flask: "3.0"
  fastapi: "0.111"
  pytest: "8.2"
  psycopg: "3.1"
seo_slug:    python-interview-questions-for-freshers
tag:         pbb-launch-<YYYY-MM-DD>
depends_on:  [30, 31]
```

---

## §1 — TL;DR

- **Goal:** Python's JBB equivalent. For 0–2 YOE Python devs.
- **Target Q at launch:** 400 across 12 modules.
- **Output:** PBB live at `/interview/python-backend-beginner`;
  `/python-interview-questions-for-freshers` redirects.

## Why this matters (2 sentences)

Python is the **#1 first-language taught in CS curricula globally** —
fresher-bucket search volume for *"python interview questions for
freshers"* and *"python basic interview questions"* combined is ~30 %
larger than the Java fresher equivalent. Owning the Python beginner
domain is a defensible top-of-funnel position because most existing
Python content online is tutorial-style, not interview-shaped —
freshers searching for interview help find blog posts, not Q libraries.

## Search phrases to own

| Search phrase                                          | Target page                           |
| ------------------------------------------------------ | ------------------------------------- |
| `python interview questions for freshers`              | (domain landing)                       |
| `python basic interview questions`                     | (domain landing)                       |
| `core python interview questions`                       | python-syntax-essentials              |
| `python oops interview questions for freshers`         | python-oop-basics                     |
| `python data structures interview questions`           | python-collections-basics             |
| `python decorators interview questions for freshers`   | python-functions-and-decorators       |
| `flask interview questions for beginners`              | flask-starter                         |
| `fastapi interview questions for beginners`            | fastapi-starter                       |
| `behavioral interview questions for python freshers`   | behavioral-and-fresher-qa-python      |
| `python project interview questions for freshers`      | behavioral-and-fresher-qa-python      |
| `tell me about yourself python developer fresher`      | behavioral-and-fresher-qa-python      |

## Current state

- `python-backend-beginner` does NOT exist on disk yet.
- Public visibility: OFF (will be flipped at the end of this playbook).

## Target state (measurable)

- Domain scaffolded with 12 modules.
- ≥ 400 Q across the modules; difficulty mix 60/35/5.
- Every code block runnable with `if __name__ == "__main__":`.
- All jargon defined inline on first use.
- Speakable per-module pass+warn ≥ 90 %.

## Hard prerequisites

- [ ] Playbooks 30 + 31 DONE (PBI base proven).
- [ ] `scripts/new_locked_domain.py` battle-tested.

## Domain metadata

```json
{
  "domainSlug": "python-backend-beginner",
  "language": "python",
  "level": "beginner",
  "seoSlug": "python-interview-questions-for-freshers",
  "altSlugs": [
    "python-basic-interview-questions",
    "python-beginner-interview-questions",
    "python-developer-interview-questions-for-freshers",
    "core-python-interview-questions-for-beginners"
  ],
  "label": "Python Backend (Beginner)",
  "blurb": "Python backend interview prep for freshers and 0–2 YOE engineers.",
  "audience": "0-2 YOE Python developers, fresh grads"
}
```

## Module spec (12 modules, ~400 Q)

| #  | Module slug                            | Pillar | Min Q | Notes                                                    |
| -- | -------------------------------------- | ------ | ----- | -------------------------------------------------------- |
| 1  | `python-syntax-essentials`             | P01    | 50    | Hello world, types, control flow, strings                  |
| 2  | `python-data-structures-basics`        | P01    | 35    | list, tuple, set, dict at beginner level                   |
| 3  | `python-functions-and-scope`           | P01    | 25    | def, args, scope LEGB intuition, return values             |
| 4  | `python-oop-basics`                    | P01    | 35    | class, object, attributes, simple inheritance              |
| 5  | `python-exceptions-and-files`          | P01    | 25    | try/except/finally; open(), context managers (with)        |
| 6  | `python-stdlib-essentials`             | P01    | 25    | os, sys, json, random, datetime                            |
| 7  | `python-pip-and-venv`                  | P01    | 20    | venv, pip install, requirements.txt                        |
| 8  | `intro-to-flask-or-fastapi-hello-world`| P02    | 30    | Hello-world REST app, return JSON                          |
| 9  | `rest-api-basics-python`               | P04    | 25    | HTTP verbs, status codes, JSON, Postman                    |
| 10 | `intro-to-databases-sqlite-psycopg`    | P03    | 25    | Connect, INSERT, SELECT; PreparedStatement intuition       |
| 11 | `pytest-basics`                        | P08    | 20    | First test, assertions, fixtures intuition                  |
| 12 | `behavioral-and-fresher-qa-python`     | P12    | 85    | Tell me about yourself, college projects, why Python       |

## Content rules (same shape as JBB)

1. Define every Python jargon term on first use.
2. Every code block runnable as a script with `if __name__ == "__main__":`.
3. Every answer ends with `kind: "interviewer-intent"` section.
4. Speakable ≤ 280 chars.
5. NO archetype C scenarios.
6. Archetype mix: A=50 % / B=25 % / D=5 % / E=5 % / F=10 % / G=5 % per module
   (override: behavioral module is G=95 %).
7. Difficulty: 60 / 35 / 5 (per module).

## Worked example (`python-syntax-essentials/hello-world-and-basics/complete-qa.json`)

```json
{
  "module": "python-syntax-essentials",
  "topic": "hello-world-and-basics",
  "questions": [
    {
      "id": "first-python-program-hello-world",
      "title": "How do you write your first Python program (Hello World)?",
      "difficulty": "easy",
      "archetype": "A",
      "tags": ["python", "syntax", "fresher"],
      "sections": [
        { "kind": "headline", "value": "A Python program is just a file ending in .py; you write code top-to-bottom, save it, and run it with the python command — there is no class or main method like in Java." },
        { "kind": "why",      "value": "Python is a scripting language with a simple execution model: when you run `python hello.py`, the Python interpreter reads the file from top to bottom and executes each statement. For larger programs you'll wrap the entry-point logic in `if __name__ == \"__main__\":`, which is a check that says 'run this only when this file is the program being executed, not when it's imported as a library'." },
        { "kind": "code", "language": "python", "value": "# hello.py\ndef main():\n    print(\"Hello, World!\")\n\nif __name__ == \"__main__\":\n    main()\n\n# Run with: python hello.py" },
        { "kind": "interviewer-intent", "value": "What the interviewer is really asking: do you know how Python files are organised, what `__name__ == '__main__'` means, and that Python's entry-point story is different from Java's main method." },
        { "kind": "followups", "value": [
          "What does `if __name__ == \"__main__\":` mean?",
          "Can you run a Python file without that guard?",
          "What is `print` actually doing under the hood?"
        ]}
      ],
      "speakable": { "summary": "A Python program is a .py file you run with the python command. Code runs top to bottom. For larger programs, wrap entry-point logic in `if __name__ == \"__main__\":` so the code runs only when the file is the entry point, not when it's imported as a library.", "isCanonical": true }
    }
  ]
}
```

## Execution steps

### Step A — Scaffold

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 scripts/new_locked_domain.py \
  --slug python-backend-beginner \
  --label "Python Backend (Beginner)" \
  --language python --level beginner \
  --seo-slug python-interview-questions-for-freshers \
  --alt-slug python-basic-interview-questions \
  --alt-slug python-beginner-interview-questions \
  --alt-slug python-developer-interview-questions-for-freshers \
  --alt-slug core-python-interview-questions-for-beginners \
  --modules \
    python-syntax-essentials:P01 \
    python-data-structures-basics:P01 \
    python-functions-and-scope:P01 \
    python-oop-basics:P01 \
    python-exceptions-and-files:P01 \
    python-stdlib-essentials:P01 \
    python-pip-and-venv:P01 \
    intro-to-flask-or-fastapi-hello-world:P02 \
    rest-api-basics-python:P04 \
    intro-to-databases-sqlite-psycopg:P03 \
    pytest-basics:P08 \
    behavioral-and-fresher-qa-python:P12

# Build + smoke
cd frontend && npm run build 2>&1 | tail -5
```

### Step B — Write content per the 12-module spec

Apply the same rules as playbook 21 (JBB), but with Python idioms. Per
module, hit the Q target with archetype + difficulty mix.

Commit per ~15 Q: `content(pbb/<module>): +N questions covering <topic>`.

### Step C — Cross-link to PBI

Every PBB module must include at least 2 inline links to its PBI
counterpart. Verify:

```bash
rg -c '/interview/python-backend-intermediate' content/python-backend-beginner/ | awk -F: '$2<2'
# Expected: empty
```

### Step D — Flip launch

```typescript
// frontend/lib/launch-config.ts — append:
{
  title:      'Python for Freshers',
  audience:   'beginner',
  language:   'python',
  href:       '/interview/python-backend-beginner',
  description:'Python backend interview prep for 0–2 YOE engineers and freshers.',
},
```

### Step E — Smoke-test, commit, tag

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run dev &
DEV_PID=$!
sleep 5
for slug in python-interview-questions-for-freshers python-basic-interview-questions python-beginner-interview-questions python-developer-interview-questions-for-freshers core-python-interview-questions-for-beginners; do
  printf "%-60s -> " "/${slug}"
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "http://localhost:3000/${slug}"
done
curl -s -o /dev/null -w "App URL: %{http_code}\n" http://localhost:3000/interview/python-backend-beginner
kill ${DEV_PID}

cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add -A
git commit -m "feat(pbb): launch python-backend-beginner publicly"
git tag pbb-launch-$(date +%F)
```

## Quality gates

| Gate                                          | Threshold     | Verify                                                              |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| 12 modules at Q target                        | 12 of 12      | jq                                                                  |
| Per-module archetype mix ±5 % of spec         | 12 of 12      | jq                                                                  |
| Per-module difficulty mix ±10 % of spec       | 12 of 12      | jq                                                                  |
| Speakable domain pass+warn                    | ≥ 90 %        | audit                                                               |
| Every PBB module ≥ 2 cross-links to PBI       | 12 of 12      | rg                                                                  |
| 5 SEO/alt URLs 301                            | 5 of 5        | curl                                                                |
| Tile present                                  | yes           | rg                                                                  |

## Failure modes & rollback

- **A Q's code uses advanced Python features** (generators, decorators,
  async) without inline definition: this is the beginner domain;
  define the concept before using it.
- **A code block omits `if __name__ == "__main__":` for runnable
  scripts:** add it; this is the beginner-domain rule.
- **A topic claims fresher-appropriate but is actually intermediate**
  (e.g. metaclasses, `__slots__`): move it to PBI.
- **Speakable summary > 280 chars** (the beginner tighter cap):
  rewrite shorter.
- **Q ships with no "what the interviewer is really asking"
  paragraph:** add it; this is the beginner-domain rule.
- **You hit hard stop with topics still thin:** record progress per
  topic; surface to user before exit.
- **Rollback:** remove the new-domain entry from `LOCKED_DOMAINS`
  and `LAUNCH_QUICK_PATHS`; content stays on disk.

## Definition of Done

- [ ] All 7 quality gates green.
- [ ] Tag `pbb-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `36` flipped to `DONE`.

## Estimated effort

- **Ideal:** 60 hours (parallel across 12 modules).
- **Hard stop:** 90 hours.
