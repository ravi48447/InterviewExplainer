# 31 — PBI: Scaffold & Wiring

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** scaffolding + wiring. NO content writing.

## TL;DR

- **Input:** Playbook 30 spec approved.
- **Action:** Scaffold PBI locked domain + wire reader/SEO/LMS + add
  `PYTHON_PILLARS` map. Domain hidden behind launch flag.
- **Output:** `npm run build` green; `/interview/python-backend-intermediate`
  returns 200; canonical SEO + altSlugs 301; no public tile.

## Why this matters (2 sentences)

The scaffold is the **mechanical step that takes PBI from "spec on
paper" to "writable on disk"** — every Python content playbook
(32-34) depends on the directory tree, `_index.json` shape, and
pillar wiring this playbook produces. A bad scaffold here cascades
into 100+ hours of content rework, which is why the scaffolder is
a script (deterministic) and not done by hand.

## Current state

- PBI has a partial scaffold (35 dirs, ~18 Q's). Some folders may
  carry stale or wrongly-named topics.
- Scaffolder script may have been run previously with a stale spec.

## Target state (measurable)

- 28 modules under `content/python-backend-intermediate/`, each with
  a valid `_index.json` and topic folders.
- `frontend/proxy.ts` has PBI altSlug → app URL redirects scaffolded
  (but not flipped on).
- PBI is in `LOCKED_DOMAINS` array but NOT in `LAUNCH_QUICK_PATHS`
  (hidden).
- Build still passes (`npm run build` exit 0).

## Hard prerequisites

- [ ] Playbook 30 is DONE.
- [ ] `scripts/new_locked_domain.py` is battle-tested on JBB + JBA.

## Step 1 — Add `PYTHON_PILLARS` to `pillars.ts`

Open `frontend/lib/pillars.ts`. Paste the `PYTHON_PILLARS` block from
playbook 29. Update `pillarsFor()`:

```typescript
export function pillarsFor(domainSlug: string): Record<PillarId, PillarMeta> {
  if (domainSlug.startsWith('python-')) return PYTHON_PILLARS;
  return JAVA_PILLARS;
}
```

Verify:

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npx tsc --noEmit -p tsconfig.json 2>&1 | head
```

Expect zero errors.

## Step 2 — Run the scaffolder

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

python3 scripts/new_locked_domain.py \
  --slug python-backend-intermediate \
  --label "Python Backend (Intermediate)" \
  --language python \
  --level intermediate \
  --seo-slug python-interview-questions \
  --alt-slug python-developer-interview-questions \
  --alt-slug python-backend-developer-interview-questions \
  --alt-slug python-interview-questions-for-experienced \
  --alt-slug fastapi-interview-questions \
  --alt-slug django-interview-questions \
  --alt-slug flask-interview-questions \
  --modules \
    python-language-core:P01 \
    python-oop-and-design:P01 \
    python-functional-and-iterators:P01 \
    python-asyncio-and-concurrency:P01 \
    python-stdlib-deep-dive:P01 \
    python-modules-and-packaging:P01 \
    python-performance-and-profiling:P11 \
    python-memory-and-gc:P11 \
    fastapi-fundamentals:P02 \
    fastapi-advanced:P02 \
    django-fundamentals:P02 \
    django-advanced:P02 \
    django-rest-framework:P02 \
    flask-fundamentals:P02 \
    sqlalchemy-deep-dive:P03 \
    django-orm-deep-dive:P03 \
    database-and-sql-python:P03 \
    caching-redis-python:P03 \
    rest-api-design-python:P04 \
    graphql-python:P04 \
    celery-and-task-queues:P05 \
    kafka-with-python:P05 \
    python-microservices:P05 \
    python-system-design:P06 \
    python-application-security:P07 \
    python-testing-pytest:P08 \
    python-devops-docker-k8s:P09 \
    python-observability-production:P11 \
    python-behavioral-and-stories:P12
```

## Step 3 — Verify scaffold output

```bash
test -f content/python-backend-intermediate/_index.json && echo "INDEX OK"
jq '.modules | length' content/python-backend-intermediate/_index.json
# Expected: 29 (28 + behavioral)

jq '.seoSlug' content/python-backend-intermediate/_index.json
# Expected: "python-interview-questions"

rg -n "'python-backend-intermediate'" frontend/lib/content-reader.ts
rg -n 'python-backend-intermediate' frontend/lib/seo-slugs.ts
rg -n 'python-backend-intermediate' frontend/lib/course-lms.ts
# Each prints ≥ 1 match.
```

## Step 4 — Proxy redirects

Open `frontend/proxy.ts`. Append (scaffolder may have done this):

```typescript
// python-backend-intermediate SEO + altSlug redirects
{ from: '/python-interview-questions',                   to: '/interview/python-backend-intermediate', status: 301 },
{ from: '/python-developer-interview-questions',         to: '/interview/python-backend-intermediate', status: 301 },
{ from: '/python-backend-developer-interview-questions', to: '/interview/python-backend-intermediate', status: 301 },
{ from: '/python-interview-questions-for-experienced',   to: '/interview/python-backend-intermediate', status: 301 },
{ from: '/fastapi-interview-questions',                  to: '/interview/python-backend-intermediate/fastapi-fundamentals', status: 301 },
{ from: '/django-interview-questions',                   to: '/interview/python-backend-intermediate/django-fundamentals',  status: 301 },
{ from: '/flask-interview-questions',                    to: '/interview/python-backend-intermediate/flask-fundamentals',   status: 301 },
```

Note the framework-specific altSlugs deep-link into the relevant module
landing pages, not the domain root. This is a deliberate SEO choice for
`fastapi-interview-questions` etc.

## Step 5 — Confirm visibility off

```bash
rg -n 'python-backend-intermediate' frontend/lib/launch-config.ts \
  || echo "PBI hidden — OK"
```

Expected: `PBI hidden — OK`.

## Step 6 — Build + smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20  # exit 0
npm test 2>&1 | tail -10        # tests pass

npm run dev &
DEV_PID=$!
sleep 5

curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/interview/python-backend-intermediate
# Expected: 200

curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  http://localhost:3000/python-interview-questions
# Expected: 301 …/python-backend-intermediate

curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  http://localhost:3000/fastapi-interview-questions
# Expected: 301 …/python-backend-intermediate/fastapi-fundamentals

kill ${DEV_PID}
```

## Step 7 — Commit

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/python-backend-intermediate \
        frontend/lib/content-reader.ts \
        frontend/lib/seo-slugs.ts \
        frontend/lib/course-lms.ts \
        frontend/lib/pillars.ts \
        frontend/proxy.ts
git commit -m "feat(pbi): scaffold python-backend-intermediate locked domain (hidden) + PYTHON_PILLARS"
```

## Quality gates

| Gate                                                  | Threshold | Verify with                                                              |
| ----------------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| `_index.json` exists with 29 modules                  | 29        | jq                                                                       |
| `PYTHON_PILLARS` exported from `pillars.ts`           | yes       | `rg 'export const PYTHON_PILLARS' frontend/lib/pillars.ts`               |
| Reader / SEO / LMS know PBI                           | yes       | rg                                                                       |
| `npm run build` exits 0                               | exit 0    | log                                                                      |
| `npm test` passes                                     | pass      | log                                                                      |
| `/interview/python-backend-intermediate` returns 200  | 200       | curl                                                                      |
| 7 SEO/alt URLs 301                                    | 7 of 7    | curl loop                                                                 |
| PBI NOT in `LAUNCH_QUICK_PATHS`                       | 0         | rg                                                                       |

## Failure modes & rollback

- **`pillarsFor()` returns Java pillars for PBI:** confirm the
  `startsWith('python-')` branch is reached. Add a unit test.
- **Reader returns 404:** check `LOCKED_DOMAINS` array and `SLUG_TO_PATH`.

Rollback:

```bash
git revert <commit-from-step-7>
```

## Definition of Done

- [ ] All 8 quality gates pass.
- [ ] Hidden domain shipped on `feature/pbi-scaffold`.
- [ ] `00-INDEX.md` row for `31` flipped to `DONE`.

## Estimated effort

- **Ideal:** 8 hours.
- **Hard stop:** 16 hours.
