# 40 — New Domain: `python-fullstack` (FULL SPEC + ROLLOUT)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked domain — spec + scaffold + content + launch.

---

## §0 — Front-matter

```yaml
playbook:    40
version:     1.0
status:      ready
wave:        D
domain:      python-fullstack
modules:     12
q_target:    500
archetypes:  A:20% B:30% C:40% G:10%
difficulty:  E:20 M:55 H:25
version_pins:
  python: "3.12"
  fastapi: "0.111"
  django: "5.0"
  react: "18.3"
  htmx: "1.9"
  vue: "3.4"
  typescript: "5.4"
  sqlalchemy: "2.0"
seo_slug:    python-fullstack-interview-questions
tag:         pfs-launch-<YYYY-MM-DD>
depends_on:  [31, 35, 39]
```

---

## §1 — TL;DR

- **Goal:** Capture fullstack-Python demand (FastAPI + React, Django +
  React, Django + HTMX, Flask + Vue).
- **Audience:** Solo founders / fullstack devs / startup engineers
  using Python on the backend and a modern frontend.
- **Target Q at launch:** 700 across 18 modules.
- **Output:** Live at `/interview/python-fullstack`.

## Hard prerequisites

- [ ] PBI launched (PFS borrows backend modules).
- [ ] JFI launched (PFS reuses the fullstack-pattern frontend modules
      with Python-specific integration topics).

## Why this matters (2 sentences)

Python-fullstack (FastAPI/Django + React/Vue/HTMX) is the **startup-engineer
stack of choice** today and has **no canonical interview content online**
— founders and small-team engineers searching "fastapi react interview
questions" land on tutorial blogs, not interview Q libraries. Owning this
combination captures a high-conversion-rate audience (small-team
engineers tend to be active job-switchers) and complements PBI / JFI
into a true fullstack-Python ecosystem.

## Search phrases to own

| Search phrase                                          | Target page                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `python fullstack interview questions`                 | (domain landing)                              |
| `fastapi react interview questions`                    | (domain landing)                              |
| `django react interview questions`                     | django-for-fullstack                          |
| `django htmx interview questions`                      | django-for-fullstack                          |
| `flask vue interview questions`                        | flask-for-fullstack                           |
| `python frontend integration interview questions`      | python-frontend-integration                   |
| `fullstack python developer interview questions`       | (domain landing)                              |

## Current state

- `python-fullstack` does NOT exist on disk yet.
- PFS borrows extensively from PBI (FastAPI, Django, Flask modules) and
  JFI (React/Angular/TypeScript) — keep them as `contentSource`
  references where possible.

## Target state (measurable)

- Domain scaffolded with 18 modules.
- ≥ 700 Q at launch (heavy reuse via `contentSource`).
- ≥ 6 native PFS modules with Python-specific integration content
  (CORS, JWT, file uploads, realtime).
- Speakable per-module pass+warn ≥ 90 %.

## Domain metadata

```json
{
  "domainSlug": "python-fullstack",
  "language": "python",
  "level": "intermediate",
  "seoSlug": "python-fullstack-interview-questions",
  "altSlugs": [
    "fastapi-react-interview-questions",
    "django-react-interview-questions",
    "flask-vue-interview-questions",
    "django-htmx-interview-questions",
    "python-fullstack-developer-interview-questions",
    "fullstack-python-interview-questions"
  ],
  "label": "Python Fullstack",
  "blurb": "Fullstack interview prep for Python + frontend stacks — FastAPI / Django / Flask backends paired with React, Vue, or HTMX, including auth, realtime, file uploads, and deployment.",
  "audience": "Solo founders, fullstack startup engineers, Python + frontend"
}
```

## Module specification (18 modules, ~700 Q)

| #  | Module slug                                | Pillar | Min Q |
| -- | ------------------------------------------ | ------ | ----- |
| 1  | `python-fullstack-fundamentals`            | P06    | 30    |
| 2  | `fastapi-for-fullstack`                    | P02    | 40    |
| 3  | `django-for-fullstack`                     | P02    | 40    |
| 4  | `flask-for-fullstack`                      | P02    | 30    |
| 5  | `react-with-python-backend`                | P02    | 50    |
| 6  | `vue-with-python-backend`                  | P02    | 40    |
| 7  | `htmx-with-django-flask`                   | P02    | 40    |
| 8  | `typescript-for-python-devs`               | P02    | 30    |
| 9  | `tailwind-with-python-templates`           | P02    | 30    |
| 10 | `fullstack-auth-jwt-oauth-session`         | P07    | 50    |
| 11 | `fullstack-file-uploads`                   | P02    | 30    |
| 12 | `fullstack-realtime-websockets-sse`        | P02    | 40    |
| 13 | `fullstack-forms-and-validation`           | P02    | 40    |
| 14 | `fullstack-testing-end-to-end`             | P08    | 40    |
| 15 | `fullstack-deployment-and-cicd`            | P09    | 40    |
| 16 | `fullstack-system-design-cases`            | P06    | 40    |
| 17 | `fullstack-performance-and-seo`            | P11    | 30    |
| 18 | `fullstack-behavioral-and-projects`        | P12    | 60    |

**Total: 700 Q.**

## Money comparison questions (canonical)

1. `FastAPI + React vs Django + React`
2. `Django templates + HTMX vs Django + React`
3. `JWT vs cookie session for Python + SPA`
4. `WebSocket vs SSE for Python backend`
5. `Django REST Framework vs FastAPI for SPA backend`
6. `React vs Vue vs HTMX for Python apps`
7. `Pydantic validation vs frontend Yup/Zod`
8. `Server-side rendering (Django templates) vs SPA`
9. `Direct upload to backend vs presigned S3 from frontend`
10. `Django + React monorepo vs separate repos`

## Per-module highlights

### 40.5 — `react-with-python-backend` (50 Q)

Topics:
- `proxying-in-dev` (4 Q): Vite proxy to FastAPI; CRA proxy to Django
- `api-typing-and-codegen` (5 Q): OpenAPI → TS types
- `auth-flow-react-fastapi` (8 Q): JWT in HttpOnly cookie + Bearer flows
- `state-libs-and-server-state` (6 Q): TanStack Query / SWR + Python APIs
- `forms-with-pydantic-validation` (5 Q): client + server validation
- `realtime-react-from-fastapi` (5 Q): WS, SSE
- `file-upload-react-to-python` (4 Q)
- `deploy-monorepo-strategies` (4 Q)
- `comparisons` (5 Q)
- `scenario` (4 Q)

### 40.7 — `htmx-with-django-flask` (40 Q)

Topics: `htmx-fundamentals`, `partials-and-fragments`, `forms-with-htmx`,
`progressive-enhancement`, `polling-and-sse-with-htmx`,
`alpine-js-for-interactivity`, `when-htmx-beats-react`, `comparisons`, `scenario`.

### 40.10 — `fullstack-auth-jwt-oauth-session` (50 Q)

Topics:
- `cookie-session-django` (5 Q)
- `jwt-fastapi-react` (8 Q): full pattern
- `oauth2-providers-from-python` (6 Q): authlib, fastapi-users, django-allauth
- `social-login` (5 Q)
- `mfa` (5 Q)
- `rbac-and-permissions` (6 Q)
- `csrf-with-python-spa` (5 Q)
- `password-storage` (4 Q)
- `comparisons` (3 Q)
- `scenario` (3 Q)

### 40.16 — `fullstack-system-design-cases` (40 Q ≈ 10 cases)

Cases (each mermaid + numbers):

1. Build a SaaS dashboard (FastAPI + React + Postgres + Redis)
2. Build a multi-tenant blog (Django + HTMX)
3. Build a real-time chat (FastAPI + WebSockets + React)
4. Build an internal admin tool (Django Admin extended)
5. Build a file-collaboration app (uploads, realtime)
6. Build a CMS (Django + React frontend)
7. Build a small e-commerce stack (Django + React + Stripe)
8. Build a project-management tool (FastAPI + Vue)
9. Build a real-time dashboard (Python + SSE)
10. Migrate Django templates to React without downtime

## Execution steps

### Step A — Scaffold

```bash
python3 scripts/new_locked_domain.py \
  --slug python-fullstack \
  --label "Python Fullstack" \
  --language python --level intermediate \
  --seo-slug python-fullstack-interview-questions \
  --alt-slug fastapi-react-interview-questions \
  --alt-slug django-react-interview-questions \
  --alt-slug flask-vue-interview-questions \
  --alt-slug django-htmx-interview-questions \
  --alt-slug python-fullstack-developer-interview-questions \
  --alt-slug fullstack-python-interview-questions \
  --modules \
    python-fullstack-fundamentals:P06 \
    fastapi-for-fullstack:P02 \
    django-for-fullstack:P02 \
    flask-for-fullstack:P02 \
    react-with-python-backend:P02 \
    vue-with-python-backend:P02 \
    htmx-with-django-flask:P02 \
    typescript-for-python-devs:P02 \
    tailwind-with-python-templates:P02 \
    fullstack-auth-jwt-oauth-session:P07 \
    fullstack-file-uploads:P02 \
    fullstack-realtime-websockets-sse:P02 \
    fullstack-forms-and-validation:P02 \
    fullstack-testing-end-to-end:P08 \
    fullstack-deployment-and-cicd:P09 \
    fullstack-system-design-cases:P06 \
    fullstack-performance-and-seo:P11 \
    fullstack-behavioral-and-projects:P12
```

### Step B — Content

Every integration topic shows BOTH Python backend AND frontend code, like
JFI playbook 27. Don't ship a Python-only or frontend-only answer in this
domain.

### Step C — Launch

```typescript
{
  title:      'Python Fullstack',
  audience:   'intermediate',
  language:   'python',
  href:       '/interview/python-fullstack',
  description:'Python + frontend fullstack prep — FastAPI / Django / Flask + React / Vue / HTMX with auth, realtime, forms.',
},
```

## Quality gates

| Gate                                          | Threshold     |
| --------------------------------------------- | ------------- |
| 18 modules at Q target                        | 18 of 18      |
| 10 system-design cases with mermaid            | 10 of 10      |
| All 10 money comparisons live                 | 10 of 10      |
| Every integration Q shows BOTH-side code      | spot 15/15    |
| Speakable domain pass+warn                    | ≥ 90 %        |
| 6 SEO/alt URLs 301                            | 6 of 6        |

## Failure modes & rollback

- **A "Python fullstack" answer ignores Python-specific patterns**
  (e.g. Django + HTMX hyperscript flow): generic React-only answers
  are JFI's job; here we need the Python-specific seam.
- **CORS Q uses Spring-style CORS config:** replace with FastAPI's
  `CORSMiddleware` / Django's `django-cors-headers`.
- **Auth Q ignores Pydantic / DRF serializers** for token payload
  shape: add it; this is the Python-fullstack tell.
- **A `contentSource` reuse points to a non-existent PBI / JFI module:**
  the build will fail; fix the path or move the topic to native PFS.
- **PFS launch flips before PBI is DONE:** PFS depends on PBI reuse —
  block at PR review.
- **Rollback:** remove the domain from `LOCKED_DOMAINS` /
  `LAUNCH_QUICK_PATHS`; content stays on disk.

## Definition of Done

- [ ] All gates green.
- [ ] Tag `pfs-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `40` flipped to `DONE`.

## Estimated effort

- **Ideal:** 110 hours.
- **Hard stop:** 160 hours.
