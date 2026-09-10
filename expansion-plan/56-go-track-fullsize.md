# 56 — Go Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration.

## TL;DR

- **Input:** Working content factory + taxonomy + Go idiom guide and exemplars.
- **Action:** Build out `content/go-fresher/` (~350 Q) and `content/go-intermediate/` (~950-1100 Q). Pillars emphasize what Go is famous for: goroutines/channels, error wrapping, simple-stdlib-first networking, struct embedding, generics, packaging.
- **Output:** Two Go levels totalling ~1300-1450 Q, all idiomatic Go (no try/catch, no class, no Optional), validated and registered.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/go.md` and `.cursor/content-factory/exemplars/go/` exist.
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

Go interview demand is steady and high in cloud-native and SRE roles. The original playbook 49 allocated only ~600 Q for Go — too thin to compete with go-by-example or 100-go-puzzles content; this playbook lifts the target to Java-grade depth.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/go.md` | Go-specific idioms; emphasis on no `try/catch`, error returns, channel patterns, lowercase package names. |
| `.cursor/content-factory/exemplars/go/` | Two polished Go exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.go.*`) | Pillar→module mapping for Go. |
| `expansion-plan/07-locked-domain-pattern.md` | Registration steps. |

## Q-count targets (level × pillar)

### Fresher (`go-fresher`) — target 350 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | go-language-core, types-and-interfaces (basics), packages-and-imports, slices-and-maps, struct-fundamentals | 110 |
| concurrency-and-async (lite) | goroutines-basics, channels-basics, select-basics | 60 |
| error-handling | errors-package, errors-as-values, common-runtime-errors | 50 |
| io-and-streams | os-file-io, bufio, json-encoding | 40 |
| testing | testing-package-basics, table-driven-tests-intro | 30 |
| build-and-deps | go-mod-basics, go-build, go-fmt | 30 |
| behavioral-and-interview | scenarios | 30 |

### Intermediate (`go-intermediate`) — target 950-1100 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | go-language-core, types-and-interfaces, generics, embedding-and-composition, struct-tags, scenario-based | 200 |
| concurrency-and-async | goroutines-and-channels, select-patterns, context-package, sync-mutex-rwmutex, sync-once, sync-pool, errgroup, semaphore-patterns | 180 |
| memory-and-runtime | escape-analysis, gc, scheduler, pprof, race-detector | 80 |
| error-handling | error-wrapping, errors-is-as, sentinel-vs-typed-errors, error-design | 60 |
| io-and-streams | net-http-stdlib, io-package, encoding-json, encoding-binary, gob, io-copy-patterns | 70 |
| data-and-orm | database-sql, sqlx, gorm, ent, pgx, query-builders | 90 |
| web-frameworks | net-http-stdlib, gin, echo, chi, fiber, gorilla-mux | 110 |
| apis-and-messaging | rest-with-stdlib, grpc-go, graphql-gqlgen, kafka-clients, nats | 90 |
| testing | testing-package, testify, gomock, table-driven, race-flag, integration | 70 |
| build-and-deps | go-mod, go-work, go-tools, vendoring | 30 |
| devops-and-cloud | docker-go, k8s-operators-go, observability-otel-go | 30 |
| system-design | scaling-with-go, idiomatic-services, rate-limiting, caching-patterns | 50 |
| security | jwt-go, owasp-go-considerations, secret-mgmt | 30 |
| behavioral-and-interview | scenarios | 30 |

## Execution steps

### Step 1 — Confirm or create the Go level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in go-fresher go-intermediate; do
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
```

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 54 step 2; iterate over taxonomy modules. Total ~50 module shells across both levels. Pin every config's `version_pin` to `"Go 1.22"` (or whatever taxonomy.yaml specifies).

### Step 3 — Build the Go-fresher queue

Write `.cursor/content-factory/queues/go_fresher.txt`. ~85 lines, avg ~4 Q per topic. Layouts: heavy `concept-explainer`; one or two `comparison-explainer` for goroutines-vs-threads etc.

### Step 4 — Build the Go-intermediate queue

Write `.cursor/content-factory/queues/go_intermediate.txt`. ~220-240 lines. Layouts: `concept-deep-dive` for concurrency, `comparison-arena` for ORM/router comparisons, `scenario-walkthrough` for system-design pillar.

### Step 5 — Dry-run both queues

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for Q in go_fresher go_intermediate; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 6 — Run Go-fresher wave

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
WAVE=go_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~85 topics generated, validated, committed. Wall time 5-9 hours.

### Step 7 — Run Go-intermediate wave

Same shape, `WAVE=go_intermediate`. Wall time 14-22 hours; split across 2-3 sessions if needed.

### Step 8 — Validate all generated content

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
FAILED=0
for f in $(find content/go-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Go-specific anti-pattern fingerprint

Beyond Java-isms (no `try`, no `class`, no `Optional`), check for:

- `panic` used as a normal control-flow tool (should be rare; only in unrecoverable bugs).
- Code that uses `fmt.Errorf("...")` without `%w` wrapping when wrapping is appropriate.
- Code that uses `interface{}` instead of `any` (Go 1.18+ idiom).
- Code that doesn't `defer` resource cleanup (`f.Close()`, `mu.Unlock()`).

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 - <<'PY'
import json, re
from pathlib import Path

flags = {
    "non_idiomatic_panic": r"\bpanic\(",
    "interface_empty_instead_of_any": r"interface\{\}",
    "open_without_defer_close": r'\b(os\.Open|os\.Create)\([^)]*\)(?![\s\S]{0,200}defer)',
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("go-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

The goal isn't zero — `panic` is legitimate in some contexts. Read the report and decide which topics to regenerate. Document the threshold decisions in the wave's run-dir log.

### Step 10 — Locked-domain registration

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`.

**`frontend/lib/content-reader.ts`:**

```typescript
export const CONTENT_GOF_ROOT = 'content/go-fresher';
export const CONTENT_GOI_ROOT = 'content/go-intermediate';

// In LOCKED_DOMAINS:
'go-fresher': { root: CONTENT_GOF_ROOT, displayName: 'Go (Fresher)', icon: 'go', enabled: false },
'go-intermediate': { root: CONTENT_GOI_ROOT, displayName: 'Go (Intermediate)', icon: 'go', enabled: false },
```

**`frontend/lib/seo-slugs.ts`:** add canonical mappings (`go-intermediate` ↔ `golang-interview-questions`, etc.).

**`frontend/lib/launch-config.ts`:** keep flags FALSE.

### Step 11 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Go cards hidden on `/domains`.
2. Local-only flip `go-intermediate` to enabled, run dev, open one Go topic. Verify code (no try/catch, defer present where expected), mermaid renders.
3. Revert local flip.
4. Open existing JBI/JS/TS topic — zero regression.

### Step 12 — Commit and update INDEX

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/go-fresher/ content/go-intermediate/
git commit -m "content(go): finalize fresher + intermediate" --allow-empty

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register go locked domains (flags off)"

git add ROADMAP.md expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 56-go-track-fullsize DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 320 | count | sum questions in `content/go-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 900 | count | sum questions in `content/go-intermediate/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| Go anti-pattern fingerprint reviewed and documented | manual review | step 9 |
| Locked-domain edit limited to 3 files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` empty |
| `npm run build` exits 0 | exit | step 11 |
| With flags=false, Go hidden on `/domains` | manual | step 11 |
| With flag=true (local), Go topic renders | manual | step 11 |
| Existing language pages: zero regression | manual | step 11 |

## Failure modes & rollback

- **`panic`-heavy code generated**: tighten idiom doc and prompt template explicitly: "Use error returns. `panic` is reserved for truly unrecoverable bugs; do not use it for input validation or business errors."
- **`interface{}` instead of `any`**: prompt template should say "Use `any` (Go 1.18+) instead of `interface{}` in code examples."
- **Missing `defer` on resource cleanup**: prompt should say "All resource acquisitions (file open, mutex lock, http response body) must `defer` their cleanup."
- **Generics in fresher level**: the fresher topic list deliberately omits generics. If a generated fresher Q drifts into generics, regenerate that topic with a tighter prompt scope.
- **Wall time blow >35h**: split intermediate into two halves (core+concurrency+web-frameworks first, the rest second). Use handoff skill.

## Definition of Done

- [ ] Two Go level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Go anti-pattern fingerprint reviewed; any threshold-violating topics regenerated.
- [ ] Two locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Go topic renders when flag locally true).
- [ ] All 9 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `56` flipped to `DONE`.
- [ ] ROADMAP.md has "Go launch checklist" row pending.

## Estimated effort

- **Ideal:** 28 hours (5h fresher + 18h intermediate + 5h infra/locked-domain).
- **Hard stop:** 55 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-5 (scaffold + dry runs).
  2. Step 6 (Go-fresher wave).
  3. Step 7 (Go-intermediate wave; possibly split into 2 sessions).
  4. Steps 8-12 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions; each ends with `bash .cursor/skills/handoff/scripts/new_handoff.sh go-track-session-<n>`.
