# 20 — JBB: Domain Scaffold & Wiring

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** scaffolding + wiring. NO content writing in this playbook —
> playbook 21 owns content.

## TL;DR

- **Input:** Playbook 19 spec is approved (the 12-module list + metadata).
- **Action:** Scaffold the locked domain `java-backend-beginner`, wire it
  into reader / SEO / LMS / launch-config / proxy, but keep `LAUNCH_QUICK_PATHS`
  pointing at JBI for now (i.e. JBB is built but hidden).
- **Output:** `npm run build` is green; `/interview/java-backend-beginner`
  responds 200; `/java-interview-questions-for-freshers` 301-redirects to
  the app URL; nothing visible on production until playbook 21 lands.

## Hard prerequisites

- [ ] Playbook 07 is DONE; `scripts/new_locked_domain.py` exists.
- [ ] Playbook 19 is DONE; spec approved.
- [ ] `npm install` ran cleanly recently (no missing modules).

## Why this matters (2 sentences)

The scaffolding step is the **deterministic, low-risk bridge** between
the spec (playbook 19) and the high-cost content batch (playbook 21).
A clean scaffold here means playbook 21 never bounces off
infrastructure issues — directory paths, `_index.json` shapes, proxy
redirects all work before any content is written, which is critical
because content is the bulk-cost path.

## Current state

- `java-backend-beginner` does NOT exist on disk.
- `LOCKED_DOMAINS` does not list it.
- `frontend/proxy.ts` does not have its altSlug redirects.

## Target state (measurable)

- 12 module folders + `_index.json` exist under
  `content/java-backend-beginner/`.
- `LOCKED_DOMAINS` includes `java-backend-beginner`.
- Proxy redirects scaffolded (altSlug → app URL).
- `LAUNCH_QUICK_PATHS` does **not** include JBB yet (hidden until 21).
- Build green, smoke 200 on the app URL.

## Execution steps

### Step 1 — Generate the domain via the scaffolder

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

python3 scripts/new_locked_domain.py \
  --slug java-backend-beginner \
  --label "Java Backend (Beginner)" \
  --language java \
  --level beginner \
  --seo-slug java-interview-questions-for-freshers \
  --alt-slug core-java-interview-questions-for-beginners \
  --alt-slug java-basic-interview-questions \
  --alt-slug java-fresher-interview-questions \
  --alt-slug java-developer-interview-questions-for-freshers \
  --modules \
    java-syntax-essentials:P01 \
    java-oop-basics:P01 \
    java-collections-basics:P01 \
    java-exceptions-and-io:P01 \
    java-concurrency-intro:P01 \
    jdbc-and-jpa-intro:P03 \
    spring-boot-starter:P02 \
    rest-api-basics:P04 \
    git-and-build-basics:P09 \
    oop-and-design-basics:P06 \
    unit-testing-basics:P08 \
    behavioral-and-fresher-qa:P12
```

**Expected effect:**

- `content/java-backend-beginner/_index.json` created with all 12 modules.
- `content/java-backend-beginner/<module>/<topic>/complete-qa.json`
  placeholder files created (one per declared topic).
- `frontend/lib/content-reader.ts` patched (new entry in `LOCKED_DOMAINS`
  and `SLUG_TO_PATH`).
- `frontend/lib/seo-slugs.ts` patched (new import + appended into the
  canonical map).
- `frontend/lib/course-lms.ts` patched (new LMS entry — language=java,
  level=beginner).

### Step 2 — Verify scaffolder output

```bash
test -f content/java-backend-beginner/_index.json && echo "INDEX OK"
jq '.modules | length' content/java-backend-beginner/_index.json
jq '.seoSlug' content/java-backend-beginner/_index.json
jq '[.modules[].topics | length] | add' content/java-backend-beginner/_index.json

# Confirm reader knows about JBB
rg -n "'java-backend-beginner'" frontend/lib/content-reader.ts

# Confirm SEO slug map knows about JBB
rg -n "java-backend-beginner" frontend/lib/seo-slugs.ts

# Confirm LMS knows about JBB
rg -n "java-backend-beginner" frontend/lib/course-lms.ts
```

**Expected output:**

- `INDEX OK`
- `12` (module count)
- `"java-interview-questions-for-freshers"`
- 12+ topic files (number depends on per-module topic count; ~30+)
- Each `rg` returns ≥ 1 match.

### Step 3 — Manually add JBB pillar audience to `frontend/lib/pillars.ts`

JBB uses `JAVA_PILLARS` already (no new pillar map needed). Confirm:

```bash
rg -n "JAVA_PILLARS" frontend/lib/pillars.ts
# Confirm pillarsFor() routes java-backend-beginner correctly
rg -n "java-" frontend/lib/pillars.ts
```

If `pillarsFor()` uses `startsWith('java-')`, JBB already routes to
`JAVA_PILLARS`. No edit needed.

### Step 4 — Add the proxy redirect for the canonical SEO slug

Open `frontend/proxy.ts`. Locate the redirect table. Append:

```typescript
// java-backend-beginner SEO + altSlug redirects
{ from: '/java-interview-questions-for-freshers',           to: '/interview/java-backend-beginner', status: 301 },
{ from: '/core-java-interview-questions-for-beginners',     to: '/interview/java-backend-beginner', status: 301 },
{ from: '/java-basic-interview-questions',                  to: '/interview/java-backend-beginner', status: 301 },
{ from: '/java-fresher-interview-questions',                to: '/interview/java-backend-beginner', status: 301 },
{ from: '/java-developer-interview-questions-for-freshers', to: '/interview/java-backend-beginner', status: 301 },
```

(The scaffolder MAY have written these. Verify they exist; if so, skip.)

### Step 5 — Add JBB to `frontend/lib/launch-config.ts` BUT leave it OFF

In `LAUNCH_QUICK_PATHS`, DO NOT add a JBB tile yet. Playbook 21
toggles JBB visible only after content depth lands.

Confirm visibility is off:

```bash
rg -n 'java-backend-beginner' frontend/lib/launch-config.ts || echo "JBB hidden — OK"
```

### Step 6 — Build & test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tee /tmp/jbb-build.log | tail -30
# Expected: no errors; warnings acceptable.

npm test -- --listTests | rg launch-config
npm test 2>&1 | tail -20
# Expected: launch-config test passes (it scans LAUNCH_QUICK_PATHS against
# the reader; since JBB is not in LAUNCH_QUICK_PATHS yet, no new test
# failure).
```

### Step 7 — Smoke-test locally

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run dev &
DEV_PID=$!
sleep 5

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/interview/java-backend-beginner
# Expected: 200

curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  http://localhost:3000/java-interview-questions-for-freshers
# Expected: 301 http://localhost:3000/interview/java-backend-beginner

curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  http://localhost:3000/java-basic-interview-questions
# Expected: 301 to /interview/java-backend-beginner

kill ${DEV_PID}
```

### Step 8 — Commit

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/java-backend-beginner \
        frontend/lib/content-reader.ts \
        frontend/lib/seo-slugs.ts \
        frontend/lib/course-lms.ts \
        frontend/proxy.ts
git commit -m "feat(jbb): scaffold java-backend-beginner locked domain (hidden)"
```

## Quality gates (measurable)

| Gate                                                  | Threshold | Verify with                                                              |
| ----------------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| `content/java-backend-beginner/_index.json` exists    | 1 file    | `test -f ... && echo OK`                                                  |
| 12 modules declared                                   | 12        | `jq '.modules \| length' content/java-backend-beginner/_index.json`      |
| Each module declares ≥ 1 topic                        | 12 of 12  | `jq '.modules[] \| select((.topics // []) \| length == 0)' content/java-backend-beginner/_index.json` → empty |
| Reader knows JBB                                      | yes       | `rg "'java-backend-beginner'" frontend/lib/content-reader.ts`            |
| SEO slugs map knows JBB                               | yes       | `rg java-backend-beginner frontend/lib/seo-slugs.ts`                     |
| `npm run build` exits 0                               | exit 0    | `echo $?` after build                                                    |
| `/interview/java-backend-beginner` returns 200        | 200       | curl                                                                      |
| 5 SEO/alt URLs 301 to app URL                         | 5 of 5    | curl loop                                                                |
| JBB NOT in `LAUNCH_QUICK_PATHS`                       | 0 matches | `rg 'java-backend-beginner' frontend/lib/launch-config.ts` → nothing      |

## Failure modes & rollback

- **`npm run build` fails on a TS error in seo-slugs.ts:** the scaffolder
  may have inserted the JBB import below the export it depends on. Open
  the file; ensure the import is at the top. Retry.
- **Reader returns 404 for `/interview/java-backend-beginner`:** open
  `frontend/lib/content-reader.ts`; confirm `LOCKED_DOMAINS` includes
  `'java-backend-beginner'` and the `SLUG_TO_PATH` mapping points at
  `content/java-backend-beginner`. Retry.
- **Redirect chain (301 → 301 → 200):** keep only the leaf hop in the
  redirect table; remove intermediate hops.

To roll back this playbook entirely:

```bash
git revert <commit-sha-from-step-8>
```

## Definition of Done

- [ ] All 9 quality gates above pass.
- [ ] One commit on a feature branch named `feature/jbb-scaffold`.
- [ ] Hand off to playbook 21 with: domain exists, hidden, building.
- [ ] `00-INDEX.md` row for `20` flipped to `DONE`.

## Estimated effort

- **Ideal:** 6 hours.
- **Hard stop:** 16 hours.
