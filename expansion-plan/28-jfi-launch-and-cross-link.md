# 28 — JFI: Public Launch & Cross-Link Wiring

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** launch flip + cross-link wiring across JBI / JBB / JFI.

---

## §0 — Front-matter

```yaml
playbook:    28
version:     1.0
status:      ready
wave:        C
type:        launch-flip
domain:      java-fullstack-intermediate
depends_on:  [24, 25, 26, 27]
flags:
  - LAUNCH_QUICK_PATHS (add JFI tile)
alt_slugs:
  - fullstack-java-interview-questions
  - java-react-interview-questions
  - spring-boot-react-interview-questions
  - spring-boot-angular-interview-questions
  - java-fullstack-developer-interview-questions
tag:         jfi-launch-<YYYY-MM-DD>
```

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **`LAUNCH_QUICK_PATHS`** | Array in `frontend/lib/launch-config.ts` listing the domains that appear as tiles on the homepage; adding a domain here makes it publicly visible. |
| **`ENABLED_HUBS`** | Feature flag map in `frontend/lib/launch-config.ts`; `interviewByLang: true` enables the language-filtered interview browsing hub. |
| **altSlug** | A variant URL slug in `_index.json` that 301-redirects to the canonical app URL (`/interview/java-fullstack-intermediate`). |
| **seoSlug** | The primary canonical slug for a domain's SEO URL (e.g. `fullstack-java-interview-questions`); also 301s to the app URL. |
| **cross-link** | An internal link from a JFI question's `tradeoffs` or `followups` section to a JBI question page; builds internal link equity and guides users to depth. |
| **`contentSource`** | Field in a JFI module declaration that points to a JBI module as the source of reused questions; allows JFI to import JBI questions without duplicating content. |
| **speakable lint** | `python3 scripts/audit_speakable.py` — checks that every question's `speakable.summary` is ≤ 320 chars and contains no markdown. Pass+warn ≥ 90 % per module is required before launch. |
| **`npm run build`** | Production build command; the launch is blocked if this exits non-zero. |
| **`npx tsc --noEmit`** | TypeScript type-check without emitting files; catches type errors introduced by launch-config changes. |
| **`git tag jfi-launch-<DATE>`** | A signed git tag marking the commit at which JFI went public; used for auditability and rollback reference. |
| **rollback** | `git revert <tile-commit>` — reverts the `LAUNCH_QUICK_PATHS` addition; JFI content remains but is no longer visible on the homepage. |

---

## §1 — TL;DR

- **Input:** Playbooks 24, 25, 26, 27 DONE — JFI has depth.
- **Action:** Flip the JFI flag on, wire cross-links between Java domains,
  smoke-test SEO URLs.
- **Output:** JFI tile visible on homepage; canonical SEO URL +
  altSlugs all 301 to the app URL; cross-link audit clean.

## Hard prerequisites

- [ ] Playbooks 24–27 are DONE.
- [ ] JFI's speakable lint domain-wide pass+warn ≥ 90 %:
      `python3 scripts/audit_speakable.py --domain java-fullstack-intermediate --report`.

## Why this matters (2 sentences)

Launching JFI is the **first hub flip after JBI** — it doubles the
public domain count and validates the locked-domain reuse pattern
(JFI imports many JBI modules via `contentSource`). Cross-link wiring
matters because the JFI/JBI overlap is real: a user lands on JFI
React, needs Spring REST depth, and we must seamlessly send them to
JBI without breaking SEO canonical structure.

## Search phrases to own (validated post-launch)

| Search phrase                                          | Target page                                |
| ------------------------------------------------------ | ------------------------------------------ |
| `fullstack java interview questions`                   | `/interview/java-fullstack-intermediate`   |
| `java react interview questions`                       | `/interview/java-fullstack-intermediate`   |
| `spring boot react interview questions`                | `/interview/java-fullstack-intermediate/spring-boot-frontend-integration` |
| `spring boot angular interview questions`              | `/interview/java-fullstack-intermediate/spring-boot-frontend-integration` |
| `java fullstack developer interview questions`         | `/interview/java-fullstack-intermediate`   |

## Current state

- JFI content exists post-24-27.
- The tile may or may not be in `LAUNCH_QUICK_PATHS` — this playbook
  adds it.
- Proxy redirects (altSlug → app URL) may exist for some slugs but
  not all five.

## Target state (measurable)

- JFI tile visible on homepage.
- All 5 altSlugs 301 to `/interview/java-fullstack-intermediate`.
- Cross-link audit ≥ 3 JBI references per integration module.
- Build + tests pass.
- Tag `jfi-launch-<DATE>` exists.

## Step 1 — Final per-module audits

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for m in react angular typescript tailwind-and-css build-tools-frontend \
         spring-boot-frontend-integration realtime-and-files \
         frontend-testing-with-java-apis; do
  echo "=== $m ==="
  python3 scripts/audit_speakable.py --module "$m" --report 2>&1 | tail -3
done
```

**Expected output:** each module reports `pass+warn ≥ 90 %`, `fail = 0`.

## Step 2 — Cross-link audit

JFI ↔ JBI cross-links (mandatory):

| JFI module                              | Must cross-link to (JBI)                   |
| --------------------------------------- | ------------------------------------------ |
| spring-boot-frontend-integration        | spring-boot, spring-security               |
| realtime-and-files                      | spring-webflux                              |
| frontend-testing-with-java-apis         | unit-testing                                |
| react / angular                         | rest-api                                    |

Verify:

```bash
for path in spring-boot-frontend-integration realtime-and-files frontend-testing-with-java-apis; do
  hits=$(rg -c '/interview/java-backend-intermediate' \
    content/java-fullstack-intermediate/${path}/*/complete-qa.json 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
  echo "$path : $hits cross-links to JBI"
done
```

**Expected output:** each ≥ 3.

**If less:** add cross-links inline as markdown in the `tradeoffs` or
`followups` sections, e.g.:

```json
{ "kind": "tradeoffs", "value": "… For more on Spring Boot's auto-config of the CORS filter, see [Spring Boot CORS interview questions](/interview/java-backend-intermediate/spring-boot/cors-configuration/)." }
```

## Step 3 — Flip the JFI tile

Open `frontend/lib/launch-config.ts`. Find `LAUNCH_QUICK_PATHS`. Add (if
not already there):

```typescript
{
  title:      'Fullstack Java + React/Angular',
  audience:   'intermediate',
  language:   'java',
  href:       '/interview/java-fullstack-intermediate',
  description:'Fullstack Java interview prep — Spring Boot + React/Angular, TypeScript, fullstack auth and realtime patterns.',
},
```

In `ENABLED_HUBS`, confirm `interviewByLang: true`.

## Step 4 — Verify the SEO redirects

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run dev &
DEV_PID=$!
sleep 5

for slug in \
  fullstack-java-interview-questions \
  java-react-interview-questions \
  spring-boot-react-interview-questions \
  spring-boot-angular-interview-questions \
  java-fullstack-developer-interview-questions \
; do
  printf "%-50s -> " "/${slug}"
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "http://localhost:3000/${slug}"
done

curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/interview/java-fullstack-intermediate
kill ${DEV_PID}
```

**Expected output:** each altSlug returns `301 …/interview/java-fullstack-intermediate`;
the app URL returns `200`.

**If any returns 200 directly (no redirect):** open `frontend/proxy.ts`
and ensure the entry exists.

## Step 5 — Build + tests

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -10
# exit 0

npm test 2>&1 | tail -10
# tests pass, including launch-config.test.ts
```

## Step 6 — Commit + tag

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add frontend/lib/launch-config.ts
git add -A content/java-fullstack-intermediate
git commit -m "feat(jfi): launch java-fullstack-intermediate publicly"
git tag jfi-launch-$(date +%F)
```

## Quality gates

| Gate                                                  | Threshold     | Verify with                                                              |
| ----------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| Per-module speakable pass+warn                        | ≥ 90 % each   | `audit_speakable.py --module`                                            |
| Cross-link audit                                       | each ≥ 3      | rg count                                                                 |
| JFI tile in `LAUNCH_QUICK_PATHS`                       | present       | `rg java-fullstack-intermediate frontend/lib/launch-config.ts`           |
| 5 altSlugs 301 to app URL                              | 5 of 5        | curl loop                                                                |
| App URL returns 200                                    | 200           | curl                                                                      |
| `npm run build` exits 0                                | exit 0        | build log                                                                |
| `npm test` passes                                      | pass          | test log                                                                 |

## Failure modes & rollback

- **Cross-link audit fails:** the executor under-cross-linked. Add inline
  markdown links to JBI in the most relevant sections. Re-run audit.
- **Build fails:** the launch-config entry has a malformed key. Open the
  file, run `npx tsc --noEmit -p frontend/tsconfig.json` to see the
  precise line.

To unlaunch:

```bash
git revert <commit-of-step-6>
```

## Definition of Done

- [ ] All 7 quality gates green.
- [ ] Tag `jfi-launch-<YYYY-MM-DD>` exists.
- [ ] `00-INDEX.md` row for `28` flipped to `DONE`.

## Estimated effort

- **Ideal:** 6 hours.
- **Hard stop:** 16 hours.
