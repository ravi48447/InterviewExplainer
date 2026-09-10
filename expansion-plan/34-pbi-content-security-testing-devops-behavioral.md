# 34 — PBI Content: Security, Testing, DevOps, Observability, Behavioral

> **Executor:** AI coding agent working across 7 parallel sub-runs.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content writing for PBI modules 24–29 (~290 questions).

---

## §0 — Front-matter

```yaml
playbook:    34
version:     1.0
status:      ready
wave:        D
domain:      python-backend-intermediate
modules:     6   # modules 24-29
q_target:    290
archetypes:  A:25% B:25% C:25% G:25%
difficulty:  E:25 M:50 H:25
version_pins:
  python: "3.12"
  fastapi: "0.111"
  pytest: "8.2"
  bandit: "1.7"
  safety: "3.2"
  docker: "26"
  kubernetes: "1.30"
  opentelemetry_sdk: "1.24"
depends_on:  [29, 30, 31, 32, 33]
```

---

## §1 — TL;DR

- **Input:** Playbooks 32 + 33 progressing or done.
- **Action:** Fill the last 7 PBI modules (system-design, security,
  testing, DevOps, observability, behavioral).
- **Output:** PBI is content-complete; ready for launch (playbook 35).

## Hard prerequisites

- [ ] Playbook 31 is DONE (scaffold).
- [ ] Playbook 29 strategy doc is read.

## Why this matters (2 sentences)

Security, testing, devops, behavioral close out PBI's depth — without
them, the domain feels like a "language-only" site and loses the
breadth signal that locks senior-IC traffic. These four pillars are
also the **cross-domain bridge content**: a Python interviewee asks
the same Docker / K8s / pytest questions as a Java interviewee, so
this batch unlocks cross-link surface area into the Java side.

## Search phrases to own

| Search phrase                                          | Owner module                |
| ------------------------------------------------------ | --------------------------- |
| `python application security interview questions`     | application-security-python |
| `owasp python interview questions`                     | application-security-python |
| `pytest interview questions`                           | testing-python              |
| `python unit testing interview questions`              | testing-python              |
| `docker python interview questions`                    | docker-python               |
| `kubernetes python interview questions`                | kubernetes-python           |
| `aws python interview questions`                       | aws-python                  |
| `python cicd interview questions`                      | cicd-python                 |
| `python observability interview questions`             | observability-python        |
| `python engineering practices interview questions`     | python-engineering-practices |
| `python behavioral interview questions`                | python-behavioral-and-stories |

## Current state

- Modules scaffolded; content thin.
- No Python-specific security examples yet (most security content
  online uses Java + Spring Security as the worked example).

## Target state (measurable)

- Module Q targets per the blueprints below.
- All examples Python 3.12+; cite library versions where relevant
  (pytest 8+, OWASP top-10 2023+, Boto3 latest).
- Speakable per-module pass+warn ≥ 90 %.
- Behavioral answers (`python-behavioral-and-stories`) all archetype G
  with metric outcomes.

## Mini-blueprints

### 34.1 — `python-system-design` (40 Q)

Topics:
- `python-stack-decisions` (6 Q): "what's the right Python stack for X service?"
- `scaling-python-services` (5 Q): GIL implications, multi-process, async
- `caching-and-databases-python` (5 Q)
- `messaging-and-async-jobs-python` (5 Q)
- `multi-tier-python-architectures` (5 Q)
- `cost-and-deploy-tradeoffs` (3 Q): serverless vs container vs VM
- `python-specific-design-cases` (5 Q): URL shortener in Python, rate-limit middleware design, queue worker design
- `comparisons` (3 Q)
- `scenario-based` (3 Q)

### 34.2 — `python-application-security` (40 Q)

Topics:
- `owasp-top-10-python` (10 Q): one Q per item with Python-flavoured fix
- `auth-and-jwt-python` (6 Q): JOSE libs, key rotation, refresh
- `secrets-management-python` (4 Q): hvac (Vault), AWS Secrets Manager via boto
- `password-hashing-python` (3 Q): bcrypt, argon2-cffi, passlib
- `csrf-cors-headers-python` (4 Q)
- `dependency-supply-chain` (4 Q): pip-audit, safety, sbom
- `injection-vectors-python` (4 Q): SQL injection in raw psycopg, command injection via subprocess
- `comparisons` (3 Q)
- `scenario-based` (2 Q)

### 34.3 — `python-testing-pytest` (60 Q)

Topics:
- `pytest-fundamentals` (8 Q): test discovery, naming, assertions, conftest
- `fixtures-deep` (10 Q): scopes, finalisation, parametrize fixtures, autouse, fixture composition
- `parametrize-deep` (5 Q): id, indirect, multiple params
- `markers-and-skipping` (4 Q): xfail, skipif, marker filtering
- `mocking-deep` (8 Q): unittest.mock, AsyncMock, monkeypatch, pytest-mock, freezegun
- `hypothesis-and-property-based` (5 Q)
- `coverage-and-mutation` (4 Q): coverage.py, mutmut
- `async-testing-pytest-asyncio` (5 Q)
- `testing-databases-and-containers` (4 Q): pytest-postgresql, testcontainers-py
- `comparisons` (4 Q)
- `scenario-based` (3 Q)

Money: `unittest vs pytest`, `mock vs MagicMock vs AsyncMock`.

### 34.4 — `python-devops-docker-k8s` (50 Q)

Topics:
- `docker-for-python` (10 Q): multi-stage builds, slim vs alpine vs distroless, non-root, healthcheck
- `kubernetes-for-python` (8 Q): pods + deployments for Python, env injection, secrets
- `wsgi-asgi-servers` (8 Q): gunicorn workers + threads + worker class; uvicorn + uvloop
- `cicd-for-python` (6 Q): GitHub Actions, GitLab, common build matrices
- `package-publishing-and-private-indexes` (4 Q)
- `pyproject-and-modern-builds-deploy` (4 Q)
- `terraform-for-python-stacks` (3 Q)
- `comparisons` (4 Q)
- `scenario` (3 Q)

Money: `Gunicorn vs Uvicorn vs Hypercorn`, `WSGI vs ASGI`, `slim vs alpine vs distroless`.

### 34.5 — `python-observability-production` (45 Q)

Topics:
- `structured-logging-python` (8 Q): logging stdlib config, structlog, loguru
- `metrics-prometheus-client` (6 Q)
- `tracing-otel-python` (8 Q): OTel SDK, instrumentations, propagation
- `profiling-prod-python` (4 Q): py-spy, austin, continuous profiling
- `error-tracking-sentry-python` (3 Q)
- `health-and-readiness-probes` (4 Q)
- `oom-and-crash-debugging` (3 Q): faulthandler, tracemalloc
- `feature-flags-python` (3 Q)
- `comparisons` (3 Q)
- `scenario` (3 Q)

Money: `logging vs structlog vs loguru`.

### 34.6 — `python-behavioral-and-stories` (75 Q — archetype G dominant)

Topics:
- `tell-me-about-yourself-python` (10 Q variants)
- `python-project-stories` (12 Q)
- `migration-and-modernisation` (8 Q): Py2→3, sync→async, monolith→microservices
- `conflict-and-collaboration-python` (8 Q)
- `production-incident-stories-python` (8 Q): memory leaks, GIL surprises, async deadlocks
- `mentoring-and-influence` (6 Q)
- `tradeoff-decisions-python` (8 Q): "why FastAPI over Django", "why Celery over RQ"
- `career-and-five-years` (5 Q)
- `meta-and-followups` (5 Q)
- `comparisons` (5 Q)

Voice rules:
- Every Action paragraph names ≥ 1 Python-specific decision (library, tool, config).
- Every Result paragraph cites a metric (latency, throughput, errors, cost, deploy frequency).
- Speakable ≤ 320 chars, first-person.

Worked example:

```json
{
  "id": "tell-me-about-migrating-celery-to-arq",
  "title": "Tell me about a time you migrated a background-job system in Python.",
  "difficulty": "medium",
  "archetype": "G",
  "tags": ["python", "behavioral", "celery", "migration"],
  "sections": [
    { "kind": "headline", "value": "I led the migration of a Celery + RabbitMQ pipeline (~250k jobs/day) to arq on Redis to cut p95 enqueue latency from 220 ms to 9 ms and remove one operational dependency." },
    { "kind": "why",      "value": "Situation: We ran ~250k jobs/day across 18 queues; RabbitMQ ops took ~6 hrs/week of engineer time and p95 enqueue latency had crept to 220 ms.\n\nTask: Reduce operational burden without losing the task semantics (retries, scheduled jobs, dead-letter inspection).\n\nAction: I wrote a 3-page RFC comparing Celery+Redis, arq, and Dramatiq on (a) async-native API, (b) operational surface, (c) migration cost. arq won on (a) and (b). I designed a dual-write window where producers wrote to BOTH systems for 2 weeks; built an arq worker pool sized to match peak from Datadog; wrote a custom DLQ inspector to replace Flower; ran a 10 %, then 50 %, then 100 % rollout per queue.\n\nResult: p95 enqueue 220 ms → 9 ms; ops burden 6 hrs/week → 30 mins/week; one dependency (RabbitMQ) removed; zero job loss across the 6-week migration window." },
    { "kind": "interviewer-intent", "value": "What the interviewer is really asking: do you make decisions with evidence (an RFC, a benchmark, a rollout plan), do you protect production during the migration, and can you name the trade-off you accepted (more Redis load, async-only API)." },
    { "kind": "followups", "value": [
      "What did the RFC look like — what trade-offs did you call out?",
      "How did you validate zero job loss during the dual-write window?",
      "If you had to do it again, what would you change?"
    ]}
  ],
  "speakable": { "summary": "I led the migration of a 250k-jobs-per-day pipeline from Celery on RabbitMQ to arq on Redis. p95 enqueue latency dropped from 220 to 9 ms, ops burden fell from 6 hours per week to 30 minutes, and we removed one infrastructure dependency without losing a single job.", "isCanonical": true }
}
```

## Quality gates

| Gate                                          | Threshold     | Verify with                                                              |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| 7 module Q targets met                        | 7 of 7        | jq                                                                       |
| Per-module speakable pass+warn                | ≥ 90 %        | `audit_speakable.py --module`                                            |
| Behavioral G-archetype share                  | ≥ 90 %        | jq tally                                                                  |
| Every behavioral Result paragraph has a metric | ≥ 80 %       | manual sample of 10                                                       |
| pytest examples don't use `unittest.TestCase` outside the comparison topic | yes | rg                                                              |
| No `python:alpine` images in docker examples (security CVE issues + slow Python) | 0 | `rg 'python:.*alpine' content/python-backend-intermediate/python-devops-docker-k8s/` → 0 |

## Failure modes & rollback

- **OWASP example uses generic Java/Spring code:** rewrite using a
  Python web framework (FastAPI default).
- **pytest example uses unittest-style** (`self.assertEqual`):
  rewrite as pytest-native (`assert` + fixtures + parametrize).
- **Docker example targets `python:latest` base image** with no
  slim / distroless discussion: add it; image-size is a real interview
  topic.
- **K8s example uses outdated apiVersion** (`apps/v1beta1`): bump to
  current stable API.
- **Behavioral Q drifts to "we"** instead of "I" or lacks a metric in
  Result: rewrite (this is the playbook 18 voice rule applied to
  Python).
- **AWS example assumes Boto3 v1 idioms** that were updated in v2:
  cite version and update.
- **Speakable lint fails on Q with table in summary:** convert to
  prose.
- **Rollback (per module):** revert the most recent N commits on the
  module path.

## Definition of Done

- [ ] All 7 modules at depth.
- [ ] `00-INDEX.md` row for `34` flipped to `DONE`.

## Estimated effort

- **Ideal:** 60 hours.
- **Hard stop:** 90 hours.
