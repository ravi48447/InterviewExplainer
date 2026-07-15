# 32 — PBI Content: Language Core + Web Frameworks (DEEP)

> **Executor:** AI coding agent working across 14 parallel sub-runs.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content writing for PBI language modules (1–8) and framework
> modules (9–14). ~860 questions across 14 modules.

---

## §0 — Front-matter

```yaml
playbook:    32
version:     1.0
status:      ready
wave:        D
domain:      python-backend-intermediate
modules:     14
q_target:    860
archetypes:  A:35% B:30% C:20% G:15%
difficulty:  E:25 M:55 H:20
version_pins:
  python: "3.12"
  fastapi: "0.111"
  pydantic: "2.7"
  django: "5.0"
  djangorestframework: "3.15"
  flask: "3.0"
  sqlalchemy: "2.0"
  pytest: "8.2"
  celery: "5.4"
depends_on:  [29, 30, 31]
```

---

## §1 — TL;DR

- **Input:** PBI scaffold complete (playbook 31); 14 module placeholders.
- **Action:** Fill each module to its Q target with canonical questions
  + Python 3.12+ code samples + speakable summaries.
- **Output:** 14 modules at depth; speakable per-module pass+warn ≥ 90 %.

## Hard prerequisites

- [ ] Playbook 31 is DONE.
- [ ] Playbook 30 spec is open.
- [ ] You have read playbook 29's "Universal Python content rules".

## Why this matters (2 sentences)

This is the **largest single content batch in the Python rollout** —
14 modules × ~60 Q each, all covering high-CTR queries
(`python interview questions`, `fastapi interview questions`,
`django interview questions`). Quality here decides whether PBI
ranks against RealPython and TestDriven.io in the first 90 days
post-launch; volume without quality won't move ranking, and quality
without volume won't generate enough surface area.

## Search phrases to own

| Search phrase                                          | Owner module               |
| ------------------------------------------------------ | -------------------------- |
| `python interview questions`                           | python-language-core       |
| `python oops interview questions`                      | python-oop-and-design      |
| `python data structures interview questions`           | python-data-structures     |
| `python decorators interview questions`                | python-language-core       |
| `python generators interview questions`                | python-language-core       |
| `python async asyncio interview questions`             | async-and-concurrency-python |
| `python multithreading interview questions`            | async-and-concurrency-python |
| `gil interview questions`                              | python-language-core       |
| `fastapi interview questions`                          | fastapi                    |
| `django interview questions`                           | django                     |
| `flask interview questions`                            | flask                      |
| `pydantic interview questions`                         | fastapi                    |
| `django rest framework interview questions`            | django                     |
| `python type hints interview questions`                | python-language-core       |

## Current state

- 14 module folders exist under
  `content/python-backend-intermediate/` (post-playbook 31).
- `complete-qa.json` files are either missing or contain placeholder
  questions; total Q ≪ 100 across the batch.
- Per-module `_index.json` declares topic structure but no answers.

## Target state (measurable)

- 14 modules at depth targets in the mini-blueprints below.
- Total Q ≥ 860 across the batch.
- Speakable per-module pass+warn ≥ 90 %.
- Difficulty mix 30/50/20 (±10 %) per module.
- All canonical Python comparisons (GIL vs async vs multiprocessing,
  asyncio vs threads, FastAPI vs Django vs Flask, Django ORM vs
  SQLAlchemy) live.

## Mini-blueprints (per module)

### 32.1 — `python-language-core` (80 Q)

Topics:
- `data-model-and-dunder` (10 Q): `__repr__`, `__hash__`, `__eq__`, sequence/mapping protocols
- `mutability-and-identity` (8 Q): is vs ==, hashable, mutable defaults pitfall
- `scopes-and-closures` (6 Q): LEGB, nonlocal, late binding closure pitfall
- `references-and-copy` (5 Q): shallow / deep / view semantics
- `exception-handling` (6 Q): `except*`, exception groups, contextmanagers in error paths
- `string-handling` (6 Q): f-strings, encoding, `str.format` vs % vs f-string
- `bytes-and-buffers` (4 Q): bytes vs bytearray vs memoryview
- `import-system` (5 Q): module cache, circular imports, lazy import patterns
- `descriptors-and-metaclasses` (8 Q): descriptor protocol, `__set_name__`, metaclass use cases
- `comparisons` (12 Q): the money pair-comparison set
- `scenario-based` (10 Q): multi-step, real-world

**Money comparisons live here:** list, tuple, set, dict; is vs ==; shallow vs deep copy;
mutable vs immutable; *args vs **kwargs; classmethod vs staticmethod vs instance.

Worked example (descriptor protocol):

```json
{
  "id": "what-is-a-descriptor-in-python",
  "title": "What is a descriptor in Python and how is it used?",
  "difficulty": "hard",
  "archetype": "A",
  "tags": ["python", "descriptors", "data-model"],
  "sections": [
    { "kind": "headline", "value": "A descriptor is any object that defines __get__, __set__, or __delete__ — Python uses descriptors to implement attribute access for methods, properties, classmethod, staticmethod, and slots." },
    { "kind": "why",      "value": "When you write obj.attr, CPython routes the lookup through the descriptor protocol: if type(obj).__mro__ contains a data descriptor (one with __set__ or __delete__) for that attribute, it wins over the instance __dict__. This is how @property short-circuits attribute writes into your setter and how methods get bound to instances." },
    { "kind": "code", "language": "python", "value": "class Validated:\n    def __init__(self, min_value):\n        self.min_value = min_value\n\n    def __set_name__(self, owner, name):\n        self.private = f'_{name}'\n\n    def __get__(self, obj, objtype=None):\n        return getattr(obj, self.private)\n\n    def __set__(self, obj, value):\n        if value < self.min_value:\n            raise ValueError(f'must be >= {self.min_value}')\n        setattr(obj, self.private, value)\n\nclass Account:\n    balance: int = Validated(min_value=0)\n\nacc = Account()\nacc.balance = 10   # ok\nacc.balance = -5   # raises ValueError" },
    { "kind": "tradeoffs","value": "Descriptors are the right tool when validation/computation must run on every read or write of an attribute across many classes. For per-class validation, @property is simpler and reads identically. For data containers, prefer pydantic or attrs unless you're writing a framework." },
    { "kind": "followups", "value": [
      "What is the difference between a data descriptor and a non-data descriptor?",
      "How is @classmethod implemented as a descriptor?",
      "When would you reach for a metaclass instead of a descriptor?"
    ]}
  ],
  "speakable": {
    "summary": "A descriptor is any object that defines __get__, __set__, or __delete__. Python routes obj.attr lookups through the descriptor protocol; this is how @property, @classmethod, @staticmethod, slots, and methods are implemented. Use descriptors for cross-class attribute validation; otherwise @property is simpler.",
    "isCanonical": true
  }
}
```

### 32.2 — `python-oop-and-design` (50 Q)

Topics:
- `classes-instances-and-attrs` (8 Q): class vs instance attribute, `__slots__`
- `inheritance-and-mro` (6 Q): C3 linearisation, super(), multiple inheritance
- `abc-and-protocols` (6 Q): abc, runtime_checkable, structural typing with Protocol
- `dataclass-vs-pydantic` (6 Q): frozen, slots=True, post_init, comparison vs Pydantic v2
- `typing-deep` (8 Q): TypeVar, ParamSpec, Self, Literal, overload
- `design-patterns-pythonic` (5 Q): Singleton via module, Strategy via callable, Factory via __new__
- `comparisons` (6 Q): typed-dataclass-pydantic comparison hot questions
- `scenario-based` (5 Q)

### 32.3 — `python-functional-and-iterators` (50 Q)

Topics:
- `iterators-and-iterables` (6 Q)
- `generators-and-yield-from` (8 Q)
- `comprehensions-and-genexps` (5 Q)
- `decorators-deep` (8 Q): with args, class decorators, functools.wraps, stacking order
- `functools-and-itertools` (6 Q)
- `partial-and-currying` (3 Q)
- `pattern-matching` (4 Q): structural `match` statement
- `comparisons` (6 Q)
- `scenario-based` (4 Q)

Money comparisons: generator function vs generator expression; iterators vs generators; decorators vs context managers.

### 32.4 — `python-asyncio-and-concurrency` (70 Q — HEAVIEST)

Topics:
- `gil-internals` (8 Q): refcount lock, when it bites, free-threaded 3.13
- `threading-and-locks` (8 Q): Lock, RLock, Condition, Event, ThreadPoolExecutor
- `multiprocessing` (8 Q): Process, Pool, Queue, shared memory, fork vs spawn
- `asyncio-fundamentals` (10 Q): event loop, coroutine, task, gather, wait_for, timeouts
- `asyncio-patterns` (8 Q): backpressure, semaphores, cancellation, structured concurrency (TaskGroup)
- `asyncio-libraries` (4 Q): httpx, aiohttp, asyncpg, aiokafka
- `mixing-sync-and-async` (5 Q): to_thread, run_in_executor, anyio
- `concurrent-futures` (4 Q): ThreadPoolExecutor vs ProcessPoolExecutor vs asyncio
- `comparisons` (8 Q)
- `scenario-based` (7 Q)

Money comparisons: threading vs multiprocessing vs asyncio; async def vs def in FastAPI; GIL vs no-GIL.

Worked example (TaskGroup / structured concurrency):

```json
{
  "id": "asyncio-taskgroup-structured-concurrency",
  "title": "What is asyncio.TaskGroup and how does it improve concurrent code?",
  "difficulty": "hard",
  "archetype": "A",
  "tags": ["python", "asyncio", "concurrency"],
  "sections": [
    { "kind": "headline", "value": "asyncio.TaskGroup (3.11+) provides structured concurrency: it spawns tasks within an async-with block, awaits all of them on exit, and cancels siblings when one raises — replacing the manual loop-of-gather() patterns that leak tasks on failure." },
    { "kind": "why",      "value": "Before TaskGroup, asyncio.gather() with return_exceptions=False would leave siblings running when one failed; you had to wrap everything in try/finally and explicitly cancel. TaskGroup makes the lifetime of every task identical to the scope, which mirrors how try/except already binds blocks to scopes. The result is fewer leaks, fewer orphan tasks, fewer 'pending task was destroyed' warnings." },
    { "kind": "code", "language": "python", "value": "import asyncio, httpx\n\nasync def fetch(client, url):\n    r = await client.get(url, timeout=2)\n    r.raise_for_status()\n    return r.json()\n\nasync def fan_out(urls: list[str]) -> list[dict]:\n    async with httpx.AsyncClient() as client:\n        async with asyncio.TaskGroup() as tg:\n            tasks = [tg.create_task(fetch(client, u)) for u in urls]\n        # all tasks are done when we exit the TaskGroup\n        return [t.result() for t in tasks]" },
    { "kind": "tradeoffs","value": "Use TaskGroup whenever you'd reach for gather(). The main behavioural difference is fail-fast: TaskGroup cancels siblings on the first exception. If you need 'collect all results, including exceptions', use gather(return_exceptions=True) — TaskGroup deliberately doesn't model that." },
    { "kind": "followups", "value": [
      "How does TaskGroup handle exceptions from multiple tasks?",
      "When would you reach for asyncio.gather instead of TaskGroup?",
      "How do you cancel a TaskGroup cleanly from the outside?"
    ]}
  ],
  "speakable": { "summary": "asyncio.TaskGroup (3.11+) gives structured concurrency: tasks live within an async-with block, are awaited on exit, and siblings are cancelled when one raises. It replaces error-prone gather patterns. Use it whenever you'd reach for gather; use gather only when you specifically need return_exceptions=True.", "isCanonical": true }
}
```

### 32.5 — `python-stdlib-deep-dive` (50 Q)

Topics: `collections-module` (8), `functools-deep` (6), `contextlib-deep` (5),
`pathlib` (5), `datetime-and-zoneinfo` (5), `re-regex` (6), `subprocess` (4),
`asyncio-stdlib-pieces` (3), `logging-stdlib` (4), `comparisons` (4).

### 32.6 — `python-modules-and-packaging` (40 Q)

Topics: `imports-and-namespaces` (6), `pyproject-toml-modern` (6),
`pip-poetry-uv` (8), `building-distributions` (5), `entry-points` (3),
`virtual-envs` (5), `wheels-and-eggs-and-sdists` (3), `comparisons` (4).

Money: `pip vs poetry vs uv`.

### 32.7 — `python-performance-and-profiling` (35 Q)

Topics: `cprofile-and-pstats` (5), `py-spy-and-pyinstrument` (5),
`line-profiler-and-memory-profiler` (4), `optimisation-techniques` (5),
`c-extensions-cython-pybind11` (4), `pypy` (3), `numpy-and-vectorisation` (4),
`comparisons` (3), `scenario-debug` (2).

### 32.8 — `python-memory-and-gc` (30 Q)

Topics: `reference-counting` (6), `gc-module` (5), `weakref` (4),
`memory-leaks-detection` (5), `slots-and-immortal-objects` (3),
`memoryview-and-buffer-protocol` (3), `comparisons` (2), `scenario` (2).

### 32.9 — `fastapi-fundamentals` (60 Q)

Topics:
- `routing-and-path-ops` (8 Q)
- `pydantic-v2-models` (8 Q): models, validators, serializers, model_config
- `dependency-injection-deep` (8 Q): Depends, sub-dependencies, yield deps
- `request-and-response` (5 Q)
- `background-tasks` (3 Q)
- `error-handling-and-exception-handlers` (4 Q)
- `cors-and-middleware` (4 Q)
- `openapi-and-docs` (5 Q)
- `async-vs-sync-routes` (4 Q)
- `comparisons` (6 Q)
- `scenario-based` (5 Q)

Money: `async def vs def in FastAPI route`; `Depends vs middleware`; `Pydantic v1 vs v2`.

### 32.10 — `fastapi-advanced` (50 Q)

Topics: `custom-middleware-deep` (6), `dependency-graphs` (6),
`websockets-fastapi` (5), `sse-streaming` (4), `oauth2-and-jwt-fastapi` (8),
`testing-fastapi` (6), `production-deploy-fastapi` (5),
`openapi-customisation` (4), `comparisons` (3), `scenario-based` (3).

### 32.11 — `django-fundamentals` (60 Q)

Topics: `models-and-fields` (8), `views-and-urls` (6), `templates-and-tags` (5),
`forms-deep` (6), `admin-customisation` (5), `auth-and-users` (6),
`migrations` (6), `signals` (4), `settings-and-environments` (4),
`comparisons` (5), `scenario-based` (5).

### 32.12 — `django-advanced` (50 Q)

Topics: `custom-managers-and-querysets` (5), `class-based-views-deep` (6),
`async-django` (5), `channels-and-websockets` (5),
`custom-auth-backends` (4), `middleware-deep` (4),
`caching-strategies-django` (5), `internationalisation` (3),
`performance-django` (5), `comparisons` (4), `scenario-based` (4).

### 32.13 — `django-rest-framework` (50 Q)

Topics: `serializers-deep` (8), `viewsets-and-routers` (6),
`permissions-and-throttling` (6), `pagination` (5), `authentication-drf` (6),
`filter-backends` (4), `nested-and-writable-serializers` (4),
`testing-drf` (4), `comparisons` (4), `scenario` (3).

Money: `DRF vs FastAPI`.

### 32.14 — `flask-fundamentals` (40 Q)

Topics: `routing-and-app-factory` (6), `blueprints` (4),
`request-and-response-flask` (5), `templates-jinja2` (5),
`sessions-and-cookies-flask` (4), `flask-extensions` (5),
`testing-flask` (4), `async-flask` (3), `comparisons` (2), `scenario` (2).

## Code-shape requirements

- Python 3.12+ syntax (PEP 695 generic syntax welcome where natural).
- Every example has full type hints.
- Async examples use `asyncio.TaskGroup`, not bare `gather()`.
- Pydantic examples use v2 (`@field_validator`, `model_config`, etc.).
- Django examples use 5.x (auto-fields, `GeneratedField` where natural).
- FastAPI examples use latest stable; deps via `Depends()` with type hints.

## Execution loop

Per module:

1. Open the topic's `complete-qa.json`.
2. Add canonical questions in archetype + difficulty shape.
3. Validate: `python3 scripts/validate_complete_qa.py <file>`.
4. Lint: `python3 scripts/audit_speakable.py <file>` → PASS/WARN.
5. Commit per ~15 Q: `content(pbi/<module>/<topic>): +N questions`.

## Quality gates

| Gate                                                  | Threshold           | Verify with                                                              |
| ----------------------------------------------------- | ------------------- | ------------------------------------------------------------------------ |
| Per-module Q counts                                   | meet 32.1..32.14    | jq aggregated                                                            |
| Speakable per-module pass+warn                        | ≥ 90 % each         | `audit_speakable.py --module`                                            |
| Schema clean                                           | 0 failures          | `validate_complete_qa.py content/python-backend-intermediate/<module>`   |
| Money comparisons present                              | 100 %               | manual grep                                                              |
| No Python 2 idioms (`print x`, `urllib2`, `xrange`)   | 0                   | `rg -n 'xrange\|urllib2\|print\\s+[^(\\n]' content/python-backend-intermediate/` → empty |
| Async examples use TaskGroup or gather, not raw create_task | spot check ≥ 8/10 | spot check                                                               |
| Pydantic examples use v2 syntax                        | spot check ≥ 8/10  | `rg -n 'class Config:' content/python-backend-intermediate/fastapi-*/` → near zero |

## Failure modes & rollback

- **A Python answer reads like Java translated to Python** (e.g. uses
  `getter`/`setter` style instead of `@property`; uses `interface`
  metaphor instead of duck-typing / Protocol): rewrite to idiomatic
  Python.
- **`async def` example without `await`** or with blocking calls
  (`time.sleep`, sync DB calls) inside an async function: this is the
  most-flagged Python-async mistake. Rewrite with `asyncio.sleep`
  and async-aware drivers (asyncpg, motor, httpx).
- **FastAPI example without Pydantic models** for request / response:
  add them. Interviewers grade up answers that show typed I/O.
- **Django example uses ancient patterns** (function-based views only,
  no ORM): upgrade to current Django 4.2+ / 5+ patterns.
- **Speakable lint fails on a Q with embedded code snippets in the
  summary:** prose only in `speakable.summary`; the code goes in the
  `code` section.
- **You hit the hard stop with modules still thin:** record per-module
  Q count in `content/_audits/pbi-content-progress-<DATE>.md` and
  surface to user before exit.
- **Rollback (per module):** revert the most recent N commits on that
  module's path; speakable + schema validators must remain green on
  the resulting state.

## Definition of Done

- [ ] 14 modules meet Q + lint gates.
- [ ] One commit per ~15 Q; final commit `content(pbi): language + frameworks depth complete`.
- [ ] `00-INDEX.md` row for `32` flipped to `DONE`.

## Estimated effort

- **Ideal:** 100 hours.
- **Hard stop:** 140 hours.
