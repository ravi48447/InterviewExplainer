# 55 — TypeScript Track

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. Uses content factory.

## TL;DR

- **Input:** Working content factory (51) + taxonomy (52) + TS idiom guide and exemplars (53). The original playbook 49 had no TS track at all.
- **Action:** Build `content/typescript-fresher/` (~400 Q) and `content/typescript-intermediate/` (~1000 Q) using the factory. Strong emphasis on TS-only topics: generics, conditional & mapped types, type narrowing, declaration merging, decorators, project references, monorepo tsconfig, advanced type tricks, and runtime/typing boundary topics. Register both roots as locked domains (flags off).
- **Output:** Two TS levels totalling ~1400 Q with idiomatic TS code (no Java-flavored syntax), all validated.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/typescript.md` and `.cursor/content-factory/exemplars/typescript/` exist.
- [ ] `cursor-agent --version` returns 3.x and authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

TypeScript interview demand has overtaken plain JS in mid-to-senior backend roles since 2024. Without a TS-specific track, the JS pages cover types only superficially — the model returns `any` everywhere, defeating the whole reason candidates buy TS interview prep.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/typescript.md` | TS-specific idioms; key sections cover generics naming, conditional/mapped patterns, declaration merging. |
| `.cursor/content-factory/exemplars/typescript/` | The two polished TS exemplars. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.typescript.*`) | Pillar→module mapping for TS. |
| `expansion-plan/07-locked-domain-pattern.md` | Registration steps. |
| `expansion-plan/54-javascript-tracks-fullsize.md` | Pattern reference; this playbook follows the same shape but smaller. |

## Q-count targets (level × pillar)

### Fresher (`typescript-fresher`) — target 400 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | ts-fundamentals, primitive-types, structural-typing-intro, type-aliases-vs-interfaces, basic-generics | 130 |
| error-handling | typed-errors, narrowing-with-instanceof, error-cause | 50 |
| io-and-streams | typed-fetch, async-with-types, json-and-zod-intro | 40 |
| testing | jest-with-ts, vitest-types, dom-testing-library-types | 50 |
| build-and-deps | tsconfig-basics, npm-with-types, declaration-files-light | 40 |
| behavioral-and-interview | scenario-debug, communication, fresher-walkthroughs | 30 |
| scenario-based | mixed | 60 |

### Intermediate (`typescript-intermediate`) — target 1000-1100 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | ts-fundamentals, generics, conditional-and-mapped-types, type-narrowing, decorators, declaration-merging, infer-keyword, satisfies-operator, branded-types | 250 |
| concurrency-and-async | typed-promises, async-iterators-with-types, abort-controller, structured-concurrency-libraries | 80 |
| memory-and-runtime | gc-edges, weakref-and-finalizationregistry, type-erasure-runtime-boundary | 50 |
| error-handling | discriminated-error-unions, neverthrow-and-result, type-guards, exhaustiveness | 70 |
| io-and-streams | streams-with-types, zod-and-runtime-validation, io-ts | 60 |
| data-and-orm | prisma-types, drizzle-with-types, type-safe-sql, kysely | 90 |
| web-frameworks | nestjs-ts, hono, trpc-server, express-with-types, fastify-types | 130 |
| apis-and-messaging | trpc, graphql-codegen, openapi-typescript, ws-with-types | 90 |
| testing | jest-with-ts, vitest, playwright-types, contract-testing-with-types | 70 |
| build-and-deps | tsconfig-deep, project-references, monorepo-tooling, vite-plugin-ts | 50 |
| devops-and-cloud | typed-aws-sdk, cdk-typescript, observability-typed | 40 |
| system-design | typed-event-buses, type-driven-api-design | 40 |
| security | typed-jwt, typed-oauth | 30 |
| behavioral-and-interview | scenarios, comms, code-review-walks | 30 |
| scenario-based | end-to-end | 80 |

## Execution steps

### Step 1 — Confirm or create the TS level shells

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in typescript-fresher typescript-intermediate; do
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
ls content/typescript-*/
```

**Expected output:** Two directories with `_index.json`.

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 54 step 2; iterate over taxonomy modules. Total ~50 module shells across two levels.

### Step 3 — Build the TS-fresher queue

Write `.cursor/content-factory/queues/ts_fresher.txt`. ~95 lines, avg 4-5 Q per topic = ~400 Q. Layouts mostly `concept-explainer` and `comparison-explainer` (TS-versus-JS pairs).

### Step 4 — Build the TS-intermediate queue

Write `.cursor/content-factory/queues/ts_intermediate.txt`. ~230 lines, avg 4-5 Q per topic = ~1000 Q. Layouts: heavy on `concept-deep-dive` for generics/conditional types; `comparison-arena` for tsc vs babel, prisma vs drizzle, etc.

### Step 5 — Dry-run both queues

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for Q in ts_fresher ts_intermediate; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

**Expected output:** Both renders show all placeholders substituted.

### Step 6 — Run TS-fresher wave

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
WAVE=ts_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected output:** ~95 topics generated, validated, committed. Wall time 6-10 hours.

### Step 7 — Run TS-intermediate wave

Same pattern, `WAVE=ts_intermediate`. Wall time 14-22 hours; split across 2-3 agent sessions if needed.

### Step 8 — Validate all generated content

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
FAILED=0
for f in $(find content/typescript-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected output:** `Total failures: 0`.

### Step 9 — TS-specific quality fingerprint check

Beyond Java-isms, TS code needs an extra check: the model frequently slips into `any`. Run a fingerprint check and fail the wave if `any` density is too high.

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 - <<'PY'
import json, re
from pathlib import Path

THRESHOLD = 0.05  # 5% of code-bearing Qs may use `any` (in escape-hatch contexts)
total_code_qs = 0
any_qs = 0

for f in Path("content").rglob("typescript-*/**/complete-qa.json"):
    d = json.loads(f.read_text())
    for q in d.get("questions", []):
        sections = q.get("answer", {}).get("sections", [])
        code_text = "\n".join(s.get("content", "") for s in sections if s.get("type") == "code_example")
        if "```" not in code_text:
            continue
        total_code_qs += 1
        # find ': any' or '<any>' in code blocks (rough heuristic)
        if re.search(r":\s*any\b|<any\b", code_text):
            any_qs += 1

ratio = any_qs / total_code_qs if total_code_qs else 0
print(f"Total code Qs: {total_code_qs}, with `any`: {any_qs}, ratio: {ratio:.2%}")
exit(1 if ratio > THRESHOLD else 0)
PY
```

**Expected output:** ratio ≤ 5%. If higher, regenerate the worst offenders with a tightened prompt that explicitly forbids `any`.

### Step 10 — Locked-domain registration

Follow `expansion-plan/07-locked-domain-pattern.md`. Edit ONLY:

**`frontend/lib/content-reader.ts`:**

```typescript
export const CONTENT_TSF_ROOT = 'content/typescript-fresher';
export const CONTENT_TSI_ROOT = 'content/typescript-intermediate';

// Inside LOCKED_DOMAINS (do not modify other entries):
'typescript-fresher': { root: CONTENT_TSF_ROOT, displayName: 'TypeScript (Fresher)', icon: 'typescript', enabled: false },
'typescript-intermediate': { root: CONTENT_TSI_ROOT, displayName: 'TypeScript (Intermediate)', icon: 'typescript', enabled: false },
```

**`frontend/lib/seo-slugs.ts`:** add canonical mappings.

**`frontend/lib/launch-config.ts`:** keep flags FALSE.

### Step 11 — UI smoke test

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

**Expected output:** exit 0.

Manual:

1. With flags off, TS not visible on `/domains`.
2. Locally flip `typescript-intermediate` to `enabled: true`, run dev, open one TS topic. Verify code blocks (especially TSX & generic-heavy code) render. Verify mermaid diagrams render.
3. Revert local flag flip.
4. Open one JBI topic and one JS topic — confirm zero regression.

### Step 12 — Commit and update INDEX

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/typescript-fresher/ content/typescript-intermediate/
git commit -m "content(typescript): finalize fresher + intermediate" --allow-empty

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register typescript locked domains (flags off)"

git add ROADMAP.md expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 55-typescript-track DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 360 | count | (sum questions across `content/typescript-fresher/**/complete-qa.json`) |
| Q-count intermediate ≥ 950 | count | (same shape, typescript-intermediate) |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `any` density ≤ 5% | step 9 exits 0 | step 9 |
| Locked-domain edit limited to 3 allowed files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` empty |
| `npm run build` exit 0 | exit | step 11 |
| With flags=false, TS hidden on `/domains` | manual | step 11 |
| With flag=true (local), TS topic renders | manual | step 11 |
| JBI/JS regression: existing pages render | manual | step 11 |

## Failure modes & rollback

- **`any`-density > 5%**: prompt template needs strengthening. Add to `prompts/generate_qa.md`: "Code MUST NOT use `any`. Use `unknown` + narrowing if the type is genuinely unknown. Use proper generic constraints elsewhere." Regenerate the offending topics.
- **Generated TS code uses outdated TS features** (e.g. namespaces over modules, JSX namespaces in non-React code): tighten the idiom doc and regenerate.
- **`tsc` reports type errors when extracting code blocks**: out of scope for the validator (which doesn't run tsc), but for hand-spot-checks: the prompt should emphasize that snippets must be self-contained.
- **Generic-heavy code blocks crash the markdown renderer**: extremely rare; if seen, the `<` and `>` need escaping in the JSON. The validator should catch malformed JSON; the model rarely emits unescaped angle brackets inside code fences.
- **Wall time blow >35h**: split intermediate into two waves (core+web-frameworks first, the rest second). Use handoff skill between sessions.

## Definition of Done

- [ ] Two TS level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] `any` density ≤ 5% across TS code blocks.
- [ ] Two locked-domain entries added with `enabled: false`.
- [ ] SEO slugs added.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing JBI / JS pages identical, TS topic renders when locally enabled).
- [ ] All 9 quality gates pass.
- [ ] Commits on the active factory branch.
- [ ] `00-INDEX.md` row for `55` flipped to `DONE`.
- [ ] ROADMAP.md has a "TypeScript launch checklist" row pending.

## Estimated effort

- **Ideal:** 30 hours (6h fresher + 18h intermediate + 6h infra/locked-domain/UI).
- **Hard stop:** 60 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-5 (scaffold + dry runs).
  2. Steps 6 (TS-fresher wave) and start of 7.
  3. Steps 7 continued + 8-9 (validation + `any`-check).
  4. Steps 10-12 (locked-domain + UI smoke + commits + INDEX).
