# 35 — PBI: Public Launch

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** flip + verify. NO new content.

---

## §0 — Front-matter

```yaml
playbook:    35
version:     1.0
status:      ready
wave:        D
type:        launch-flip
domain:      python-backend-intermediate
depends_on:  [30, 31, 32, 33, 34]
flags:
  - LAUNCH_QUICK_PATHS (add PBI tile)
tag:         pbi-launch-<YYYY-MM-DD>
```

---

## §1 — TL;DR

- **Input:** Playbooks 31–34 done. PBI has 29 modules at content depth.
- **Action:** Add PBI to `LAUNCH_QUICK_PATHS`, smoke-test all SEO URLs,
  verify cross-link integrity.
- **Output:** PBI live on the homepage; canonical SEO URL ranks; analytics
  start populating.

## Why this matters (2 sentences)

PBI launch is the **first non-Java domain shipping publicly** — it
proves the multi-language thesis and unlocks the rest of the Python
empire (every later Python domain depends on PBI being live for
cross-link credibility). It's also the moment we publicly commit to
the "MVP promise" on the home page (Python card linking somewhere
real), so the launch checklist is non-negotiable.

## Search phrases the launch targets (validated post-launch)

| Search phrase                                          | Target page                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `python interview questions`                           | `/python-interview-questions`                 |
| `python backend interview questions`                   | `/python-backend-interview-questions`         |
| `python interview questions for experienced`           | `/python-interview-questions-for-experienced` |
| `python developer interview questions`                 | `/python-developer-interview-questions`       |
| `senior python developer interview questions`          | `/senior-python-developer-interview-questions` |

## Current state

- PBI content exists (post-32-34) and audits pass per-module.
- `LOCKED_DOMAINS` includes PBI (post-31).
- `LAUNCH_QUICK_PATHS` does NOT yet include PBI — this playbook adds it.

## Target state (measurable)

- PBI tile visible on home + `/domains`.
- All 5 altSlugs 301 to canonical SEO URL.
- Canonical SEO URL returns 200.
- Build + tests pass.
- Tag `pbi-launch-<DATE>` exists.

## Hard prerequisites

- [ ] Playbooks 31–34 DONE.
- [ ] Domain-wide speakable pass+warn: ≥ 90 %.
- [ ] `npm test` and `npm run build` both green.

## Step 1 — Final domain-wide audit

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 scripts/audit_speakable.py --domain python-backend-intermediate --report \
  2>&1 | tee "content/_audits/pbi-launch-readiness-$(date +%F).md" | tail -10

python3 scripts/validate_complete_qa.py content/python-backend-intermediate \
  2>&1 | tail -5
```

**Expected output:**
- Speakable: `pass+warn ≥ 90 %`, `fail = 0`.
- Schema: `0 failed`.

If either fails, STOP. Fix in the relevant playbook (32/33/34). Do not
launch with red gates.

## Step 2 — Cross-link audit

```bash
# PBI → PBI internal links (sanity)
total=$(find content/python-backend-intermediate -name 'complete-qa.json' | wc -l)
linked=$(rg -l '/interview/python-backend-intermediate' content/python-backend-intermediate | wc -l)
echo "PBI internal cross-link coverage: $linked / $total files contain at least one /interview/python-backend-intermediate/* link"
# Expected: > 30%
```

## Step 3 — Flip the tile

Open `frontend/lib/launch-config.ts`. In `LAUNCH_QUICK_PATHS`, append:

```typescript
{
  title:      'Python Backend',
  audience:   'intermediate',
  language:   'python',
  href:       '/interview/python-backend-intermediate',
  description:'Python backend interview prep for 3–7 YOE engineers — FastAPI, Django, async, SQLAlchemy, testing, deploy.',
},
```

In `ENABLED_LANGUAGES`, ensure `'python'` is present (it should already be
because of `interviewByLang` hub).

In `ENABLED_HUBS`, no change required.

## Step 4 — Smoke-test SEO URLs

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run dev &
DEV_PID=$!
sleep 5

declare -a tests=(
  "python-interview-questions"
  "python-developer-interview-questions"
  "python-backend-developer-interview-questions"
  "python-interview-questions-for-experienced"
  "fastapi-interview-questions"
  "django-interview-questions"
  "flask-interview-questions"
)
for slug in "${tests[@]}"; do
  printf "%-60s -> " "/${slug}"
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "http://localhost:3000/${slug}"
done

curl -s -o /dev/null -w "App URL: %{http_code}\n" \
  http://localhost:3000/interview/python-backend-intermediate

kill ${DEV_PID}
```

**Expected output:**
- 4 domain-level altSlugs → `301 …/interview/python-backend-intermediate`.
- 3 framework-specific altSlugs → `301 …/interview/python-backend-intermediate/<module>`.
- App URL → `200`.

## Step 5 — Build + test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -10
npm test 2>&1 | tail -10
```

Both exit 0.

## Step 6 — Commit + tag

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add frontend/lib/launch-config.ts
git commit -m "feat(pbi): launch python-backend-intermediate publicly"
git tag pbi-launch-$(date +%F)
```

## Quality gates

| Gate                                          | Threshold        | Verify with                                                              |
| --------------------------------------------- | ---------------- | ------------------------------------------------------------------------ |
| Speakable domain-wide pass+warn               | ≥ 90 %           | audit                                                                    |
| Schema validation                             | 0 failures       | validate                                                                 |
| Cross-link coverage                           | ≥ 30 % of files  | rg                                                                       |
| All 7 SEO/alt URLs 301                        | 7 of 7           | curl loop                                                                |
| App URL returns 200                           | 200              | curl                                                                      |
| Build exit 0                                  | exit 0           | npm run build                                                            |
| Tests pass                                    | pass             | npm test                                                                  |
| Tag created                                   | yes              | `git tag -l "pbi-launch-*"`                                              |

## Failure modes & rollback

- **A framework altSlug deep-links to a missing module:** verify the
  module landing page resolves. The redirect target must be a real URL.
- **`npm test` fails on `launch-config.test.ts`:** the test validates
  every `LAUNCH_QUICK_PATHS.href` against known reader slugs — PBI must
  be in `content-reader.ts`'s `LOCKED_DOMAINS`. Confirm playbook 31
  patched it.

Rollback:

```bash
git revert <commit-step-6>
```

## Definition of Done

- [ ] All 8 quality gates pass.
- [ ] Tag `pbi-launch-<YYYY-MM-DD>` created.
- [ ] PBI tile visible on homepage.
- [ ] `00-INDEX.md` row for `35` flipped to `DONE`.

## Estimated effort

- **Ideal:** 4 hours.
- **Hard stop:** 12 hours.
