# 54 — JavaScript Tracks (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. Uses content factory.

## TL;DR

- **Input:** Working content factory (51) + taxonomy (52) + JS idiom guide and exemplars (53). The playbook 49 originally specified ~600 JS questions; this playbook supersedes that target with **2200-2600 questions** across fresher (~600) and intermediate (~1500-1800) levels plus a small advanced slice (~150-250).
- **Action:** Build out `content/javascript-fresher/`, `content/javascript-backend-intermediate/`, and `content/javascript-frontend-intermediate/` to full pillar coverage per `taxonomy.yaml`. Run the factory in waves, validate, smoke-test, and commit. Register all three roots as locked domains.
- **Output:** A complete JavaScript ecosystem (fresher + backend-intermediate + frontend-intermediate) with parity to JBI's depth, ~2200-2600 polished Q&A pairs, all passing the validator and renderable in the existing UI.

## Hard prerequisites

- [ ] Playbook 51 DONE.
- [ ] Playbook 52 DONE.
- [ ] Playbook 53 DONE — `.cursor/content-factory/idioms/javascript.md` and `.cursor/content-factory/exemplars/javascript/` (≥2 files) exist.
- [ ] Playbook 49 read (it set the original baseline; this playbook supersedes its JS Q-counts).
- [ ] Playbook 07 read (locked-domain registration pattern).
- [ ] `cursor-agent --version` returns 3.x and authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

JavaScript is the highest-traffic interview-language search keyword in our SEO target list. Without a Java-grade depth on JS, the site's crawl-conversion ratio for "javascript interview questions" stays under 4% — half its potential.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/taxonomy.yaml` (under `language_pillar_modules.javascript.*`) | Source of truth for which modules go in which pillar. |
| `.cursor/content-factory/idioms/javascript.md` | Idioms (var/let/const, hoisting, prototype chain, modules, etc.). |
| `.cursor/content-factory/exemplars/javascript/` | The two polished JS exemplars to anchor the bulk run. |
| `frontend/lib/content-reader.ts` | `LOCKED_DOMAINS`, `CONTENT_*_ROOT` constants. |
| `frontend/lib/seo-slugs.ts` | SEO slug mapping for JS app paths. |
| `expansion-plan/07-locked-domain-pattern.md` | Step-by-step registration pattern; obey to the letter. |
| `expansion-plan/49-javascript-go-ruby-language-tracks.md` | Original baseline, now superseded for JS. |

## Q-count targets (level × pillar)

### Fresher (`javascript-fresher`) — target 600 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | js-language-core, prototypes-and-classes, closures, scope-and-hoisting | 180 |
| error-handling | try-catch-finally, error-objects, common-runtime-errors | 60 |
| io-and-streams | dom-events-basics, fetch-and-async-io, json-handling | 60 |
| testing | jest-basics, vitest-basics, dom-testing-library-intro | 60 |
| build-and-deps | npm-and-yarn-basics, package-json, tsconfig-light | 60 |
| behavioral-and-interview | scenario-debug, communication, fresher-walkthroughs | 60 |
| scenario-based | mixed light scenarios | 120 |

### Backend-intermediate (`javascript-backend-intermediate`) — target 1100-1300 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | js-language-core, event-loop, esm-and-cjs, async-iterators, generators | 200 |
| concurrency-and-async | promises-deep, async-await-patterns, worker-threads, cluster, abort-controller | 130 |
| memory-and-runtime | v8-internals, gc, heap-snapshots, cpu-profiling | 80 |
| error-handling | error-types, async-stack-traces, error-monitoring | 70 |
| io-and-streams | streams-api, http-streams, file-streams, transform-streams | 70 |
| data-and-orm | postgres-with-pg, mongodb, prisma, drizzle, sequelize | 130 |
| web-frameworks | express, fastify, nestjs, koa, hono | 200 |
| apis-and-messaging | rest-with-express, graphql, websockets, redis-pubsub, kafka-clients | 130 |
| testing | jest, vitest, supertest, playwright-api, contract-testing-pact-js | 100 |
| build-and-deps | npm, yarn, pnpm, lockfiles, monorepo-tools | 60 |
| devops-and-cloud | docker, ecs, lambda, cloud-run, observability | 60 |
| system-design | rate-limiting, caching, scaling-node | 80 |
| security | jwt, oauth, owasp-node, secret-mgmt | 50 |
| behavioral-and-interview | scenarios, comms, code-review-walks | 60 |
| scenario-based | end-to-end scenarios | 200 |

### Frontend-intermediate (`javascript-frontend-intermediate`) — target 600-700 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | event-loop-frontend, modules, closures-in-ui | 100 |
| dom-and-browser | dom-api, browser-storage, web-apis, intersection-observer, web-workers | 130 |
| frameworks | react-fundamentals, react-hooks, redux-and-zustand, nextjs-app-router, vue-3-composition | 200 |
| performance | rendering, memoization, bundle-splitting, web-vitals | 80 |
| testing | rtl, cypress, playwright, msw, vitest-jsdom | 60 |
| accessibility-and-ux | wcag, aria, keyboard-nav, screen-readers | 50 |
| build-and-tooling | vite, webpack, rollup, tsconfig | 50 |
| scenario-based | feature scenarios, debugging | 100 |

(Note: `dom-and-browser`, `frameworks`, `performance`, `accessibility-and-ux`, `build-and-tooling` for frontend-intermediate are subsumed under existing pillars in `taxonomy.yaml` — for frontend-intermediate, the pillar shape is overridden in `_index.json` to expose these as sibling sections without violating the universal-pillars rule. Document the override in the level's `_index.json` only; do not edit the pillar enum in taxonomy.yaml.)

## Execution steps

### Step 1 — Confirm or create the JS level shells

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in javascript-fresher javascript-backend-intermediate javascript-frontend-intermediate; do
  mkdir -p "content/$L"
  if [ ! -f "content/$L/_index.json" ]; then
    cat > "content/$L/_index.json" <<EOF
{
  "level": "$L",
  "modules": [],
  "pillar_groups": []
}
EOF
  fi
done
ls content/javascript-*/
```

**Expected output:** Three directories exist with `_index.json` files (created or already present).

### Step 2 — Generate per-module `_config.json` files

For each module across all three levels, scaffold a `_config.json` referencing the taxonomy. This is purely a configuration file; no content yet.

**Command (parameterized):**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LEVEL=javascript-backend-intermediate
PILLAR=core-language
MODULE=event-loop

mkdir -p "content/${LEVEL}/${PILLAR}/${MODULE}"
cat > "content/${LEVEL}/${PILLAR}/${MODULE}/_config.json" <<EOF
{
  "module": "${MODULE}",
  "level": "${LEVEL}",
  "pillar": "${PILLAR}",
  "version_pin": "Node 20+ / ES2023",
  "topics": []
}
EOF
```

Repeat for every (level, pillar, module) combination from the Q-count table above. Total ~70 module shells.

### Step 3 — Build the JS-fresher queue

Write `.cursor/content-factory/queues/js_fresher.txt`. One line per topic. Topic count chosen so total Q across topics ≈ 600 (avg 4-5 Q per topic = 120-150 topic lines). Layout types: prefer `concept-explainer` for fresher.

**Sample lines:**

```
javascript-fresher/core-language/js-language-core/let-vs-const-vs-var|concept-explainer|5|javascript/event-loop-and-microtasks.json
javascript-fresher/core-language/closures/closure-fundamentals|concept-explainer|5|javascript/event-loop-and-microtasks.json
javascript-fresher/error-handling/try-catch-finally/try-catch-basics|concept-explainer|4|javascript/event-loop-and-microtasks.json
... (≈140 lines total)
```

### Step 4 — Build the JBI/JFI queues

Write `.cursor/content-factory/queues/js_backend_intermediate.txt` (~280 lines, avg 4-5 Q per topic) and `.cursor/content-factory/queues/js_frontend_intermediate.txt` (~150 lines).

### Step 5 — Dry-run all three queues

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for Q in js_fresher js_backend_intermediate js_frontend_intermediate; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

**Expected output:** Three rendered prompts shown, all placeholders substituted, no `{{` remaining.

### Step 6 — Run JS-fresher wave

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
WAVE=js_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected output:** Per topic, validator + commit. Wall time 8-14 hours typically. Failures logged but the wave continues. Final manifest printed.

**If interrupted:** factory is idempotent on already-passed topics — re-run with the same queue file.

### Step 7 — Run JBI wave (the largest)

Same shape as step 6 with `WAVE=js_backend_intermediate`. Wall time 16-26 hours. Strongly recommend running across 2-3 agent sessions; use the handoff skill if you fill the context window.

### Step 8 — Run JFI wave

Same shape with `WAVE=js_frontend_intermediate`. Wall time 8-14 hours.

### Step 9 — Validate all generated content

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
FAILED=0
for f in $(find content/javascript-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected output:** `Total failures: 0`. If non-zero, the failing files must either be regenerated or hand-fixed before proceeding. Document each fix in the wave's run dir.

### Step 10 — Locked-domain registration (the ONLY frontend edit allowed)

Follow `expansion-plan/07-locked-domain-pattern.md` precisely. Editable files: ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`. Any other frontend file is OUT-OF-CONTRACT.

**`frontend/lib/content-reader.ts`** — add three constants and three `LOCKED_DOMAINS` entries:

```typescript
export const CONTENT_JSF_ROOT = 'content/javascript-fresher';
export const CONTENT_JSBI_ROOT = 'content/javascript-backend-intermediate';
export const CONTENT_JSFI_ROOT = 'content/javascript-frontend-intermediate';

// Inside LOCKED_DOMAINS map (do not change existing entries):
'javascript-fresher': { root: CONTENT_JSF_ROOT, displayName: 'JavaScript (Fresher)', icon: 'javascript', enabled: false },
'javascript-backend-intermediate': { root: CONTENT_JSBI_ROOT, displayName: 'JavaScript Backend (Intermediate)', icon: 'javascript', enabled: false },
'javascript-frontend-intermediate': { root: CONTENT_JSFI_ROOT, displayName: 'JavaScript Frontend (Intermediate)', icon: 'javascript', enabled: false },
```

**`frontend/lib/seo-slugs.ts`** — add the canonical SEO mappings (e.g. `javascript-backend-intermediate` ↔ `javascript-backend-interview-questions`).

**`frontend/lib/launch-config.ts`** — keep all three flags FALSE for now. Flipping them is a separate launch-checklist task in ROADMAP.md.

### Step 11 — UI smoke test

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

**Expected output:** exit 0.

Then manually:

1. With `enabled: false` flags as set in step 10, confirm `/domains` does NOT show the JS cards yet.
2. Temporarily set `enabled: true` for one (e.g. `javascript-fresher`) in a local-only edit (do NOT commit), run `npm run dev`, open `/javascript-fresher-interview-questions/...` for a known topic. Confirm: page renders, code blocks render, sidebar nav works.
3. Revert local-only edit. Confirm `git diff frontend/lib/launch-config.ts` is empty.
4. Open one JBI topic. Confirm zero regression.

### Step 12 — Commit waves and locked-domain edit

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

# Content commits happen inside factory.sh per topic; here we commit any leftover module shells
git add content/javascript-fresher/ content/javascript-backend-intermediate/ content/javascript-frontend-intermediate/
git commit -m "content(javascript): finalize fresher + backend-intermediate + frontend-intermediate" --allow-empty

# Locked-domain registration commit (single, scoped to the 3 allowed files)
git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register javascript locked domains (flags off)"
```

### Step 13 — Update ROADMAP and INDEX

Add a row to `ROADMAP.md` for "JavaScript launch checklist". Mark playbook 54 DONE in `00-INDEX.md`.

```bash
git add ROADMAP.md expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 54-javascript-tracks-fullsize DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 540 | count | `find content/javascript-fresher -name complete-qa.json -exec python3 -c "import json,sys; print(len(json.load(open(sys.argv[1])).get('questions', [])))" {} \; \| awk '{s+=$1} END{print s}'` |
| Q-count JBI ≥ 1100 | count | (same shape, javascript-backend-intermediate) |
| Q-count JFI ≥ 600 | count | (same shape, javascript-frontend-intermediate) |
| Validator passes 100% of files | step 9 returns `Total failures: 0` | step 9 |
| Locked-domain edit limited to 3 allowed files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` returns empty |
| `npm run build` exits 0 | exit | `cd frontend && npm run build` |
| With flags=false, JS does not appear on `/domains` | manual check | step 11 |
| With flag temporarily true (local-only), one Q renders | manual check | step 11 |
| JBI regression: existing Java page renders identically | manual check | step 11 |
| No edits to UI components, just registration | clean diff | step 10 verification |

## Failure modes & rollback

- **A wave fails on >5% of topics**: pause, read 5 failed files in `runs/<ts>/FAILED.txt`, identify common pattern (often: missing exemplar reference for a unique layout). Fix the queue line's `<base_exemplar>` field, rerun.
- **Validator catches schema-version drift**: a generated file has a section type not in the frozen enum. Hand-fix; do NOT add the new type to the enum (UI contract). Open a separate schema-version playbook if it's a legitimate need.
- **`npm run build` fails after locked-domain edit**: typo in `LOCKED_DOMAINS` map. Read the build error, fix the entry, re-run.
- **Frontend regression on JBI page**: revert the locked-domain commit immediately (`git revert HEAD`), reproduce locally with build logs, fix in a separate commit.
- **Wall time exceeds 70 hours**: STOP. The queue is over-broad — split JBI into pillar-by-pillar mini-queues and run as separate sessions. Use the handoff skill to avoid context-window collapse mid-session.
- **Cursor-agent rate limit hits during wave**: factory is idempotent — wait, resume.

## Definition of Done

- [ ] All three JS level directories populated with the Q-count targets met or exceeded.
- [ ] 100% of generated `complete-qa.json` files pass `validate_qa.py`.
- [ ] All three roots registered in `LOCKED_DOMAINS` with `enabled: false`.
- [ ] `seo-slugs.ts` mappings present for all three.
- [ ] `launch-config.ts` flags all FALSE (a separate launch checklist will flip them).
- [ ] `npm run build` exits 0.
- [ ] Manual UI smoke test passes (existing JBI page identical, JS topic renders when flag is locally-true).
- [ ] All 10 quality gates pass.
- [ ] All commits on the active factory branch.
- [ ] `00-INDEX.md` row for `54` flipped to `DONE`.
- [ ] ROADMAP.md has a "JavaScript launch checklist" row pending.

## Estimated effort

- **Ideal:** 50 hours (8h fresher + 22h JBI + 12h JFI + 8h infra).
- **Hard stop:** 90 hours. Beyond that, queues are over-broad. Split as recommended in failure modes.
- **Recommended split:** ≥ 4 agent sessions; one per wave, plus one for locked-domain registration. Use handoff skill between sessions.

## Per-wave session pattern (use with the handoff skill)

Recommended per-session size: ≤ 12 hours of cursor-agent work. Suggested split:

| Session | Task |
|---|---|
| 1 | Steps 1-5 (scaffolding + dry runs). |
| 2-3 | Step 6 — JS-fresher wave (split if needed). |
| 4-7 | Step 7 — JBI wave, split per pillar pair. |
| 8-9 | Step 8 — JFI wave. |
| 10 | Step 9 — full corpus validation. |
| 11 | Steps 10-13 — locked-domain + UI smoke + commit + INDEX. |

Each session begins by invoking the handoff skill's RESUME protocol and ends with a fresh `bash .cursor/skills/handoff/scripts/new_handoff.sh js-tracks-session-<n>` snapshot.
