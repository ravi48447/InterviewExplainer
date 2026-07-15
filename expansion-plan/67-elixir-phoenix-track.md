# 67 — Elixir / Phoenix Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **New track** (not previously batched in playbook 58).

## TL;DR

- **Input:** Working content factory + taxonomy + Elixir idiom guide and exemplars (from playbook 53). Add Elixir to taxonomy if missing.
- **Action:** Build `content/elixir-fresher/` (~240 Q), `content/elixir-intermediate/` (~700 Q), and `content/elixir-advanced/` (~400 Q). Pillars over-index on what Elixir / Erlang / OTP / Phoenix interviews actually test in 2026: the actor model + supervision trees, immutability + pattern matching, OTP primitives (`GenServer`, `Supervisor`, `Agent`, `Task`), `Process` / messaging, BEAM scheduler basics, Phoenix LiveView, Ecto + PostgreSQL, the "let it crash" mindset, distributed Erlang for clustering.
- **Output:** Three Elixir level directories totalling ~1,340 Q, all idiomatic Elixir/OTP (pattern matching over conditionals, processes for state, supervision trees over try/rescue, `:ok` / `:error` tuple convention, pipe operator used with intent, no defensive coding), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/elixir.md` exists with sub-sections on "let it crash and supervision trees", "OTP primitives decision table", "pattern matching as control flow", "Phoenix LiveView lifecycle".
- [ ] `.cursor/content-factory/exemplars/elixir/` has ≥ 3 polished exemplars (one OTP supervisor + GenServer, one Phoenix LiveView, one Ecto schema + changeset + repo).
- [ ] `.cursor/content-factory/taxonomy.yaml` has a `language_pillar_modules.elixir.*` section (add if missing).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

Elixir (and the BEAM) own a small but extremely loyal segment of the interview market — shops like Discord, Heroku-era WhatsApp, Bleacher Report, Pinterest's notification backend, Dashbit — and Phoenix LiveView has revived interest by making it the "no-SPA-needed" stack for medium-scale web apps. A dedicated track at OTP-grade depth is differentiated against the existing prep market (which mostly covers Elixir at "syntax tour" level) and signals seriousness to the BEAM community.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/elixir.md` | Elixir idioms; pattern matching, OTP, "let it crash". |
| `.cursor/content-factory/exemplars/elixir/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.elixir.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `https://hexdocs.pm/elixir/` and `https://hexdocs.pm/phoenix/` (read-only) | Source-of-truth for current API surface. |

## Q-count targets (level × pillar)

### Fresher (`elixir-fresher`) — target 240 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | elixir-language-core, primitive-types, pattern-matching-basics, control-flow, functions-and-anonymous-fns, modules | 80 |
| immutable-data | tuples-lists-maps-keyword-lists, structs-basics, enum-module-basics | 50 |
| pipes-and-functions | pipe-operator, function-clauses-and-guards, with-statement-basics | 40 |
| error-handling | tagged-tuples (`:ok`/`:error`), basic-exceptions, try-rescue-vs-tagged-tuples | 20 |
| testing-and-tooling | exunit-basics, mix-basics, iex-basics | 20 |
| behavioral-and-interview | scenarios | 30 |

### Intermediate (`elixir-intermediate`) — target 700 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, pattern-matching-deep, protocols, behaviours, with-statement-deep, comprehensions, scenario-based | 120 |
| processes-and-otp | processes-basics, send-and-receive, links-and-monitors, genserver, supervisor, agent, task, applications, registry | 160 |
| ecto-and-postgres | ecto-schemas, changesets, repo, ecto-query-dsl, migrations, multi (transactions), embedded-schemas, postgres-specific-features | 100 |
| phoenix-core | endpoint-router-controllers, contexts, plugs-and-pipelines, channels-basics, view-and-template-or-component, error-views | 100 |
| phoenix-liveview | liveview-basics, assigns-and-temporary-assigns, events-and-jsdom, liveview-streams, components, forms-and-changesets-with-liveview, uploads | 100 |
| streams-and-data | enum-vs-stream, gen-stage-intro, flow-intro, broadway-intro | 50 |
| testing | exunit-deep, mox-mocks, property-based-stream-data, liveview-test, ecto-sandbox | 50 |
| build-and-deps | mix-deep, hex-publishing, releases-with-mix-release, runtime-config | 20 |

### Advanced (`elixir-advanced`) — target 400 Q

| Pillar | Modules | Q target |
|---|---|---|
| otp-deep | supervision-strategies-deep, hot-code-reloading, dynamic-supervisor-patterns, registry-deep, partition-supervisor, custom-genserver-callbacks | 100 |
| distributed-erlang | clustering-with-libcluster, distributed-genserver, swarm-and-horde, pg (process groups), distribution-protocol, cap-on-the-beam | 90 |
| performance-and-runtime | beam-scheduler, reductions, garbage-collection-per-process, ets-and-mnesia, profiling (`:observer`, `:fprof`) | 80 |
| phoenix-deep | liveview-internals, channels-deep, presence, async-render-patterns, multi-tenant-phoenix | 60 |
| messaging-and-architecture | broadway-deep, phoenix-pubsub-distributed, event-sourcing-elixir, ddd-elixir | 40 |
| nif-and-interop | rustler (rust-nifs), zigler (zig-nifs), ports-vs-nifs, safety-and-scheduling-implications | 30 |

## Execution steps

### Step 1 — Confirm or create the three Elixir level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in elixir-fresher elixir-intermediate elixir-advanced; do
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

Same pattern as playbook 56 step 2. ~50 module shells. Pin `version_pin: "Elixir 1.17, Erlang/OTP 27"` and `phoenix_version: "1.7"`.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/elixir_fresher.txt` (~60 lines).
- `.cursor/content-factory/queues/elixir_intermediate.txt` (~175 lines).
- `.cursor/content-factory/queues/elixir_advanced.txt` (~100 lines).

Layouts: `concept-explainer` for fresher; `concept-deep-dive` + `comparison-arena` (Enum vs Stream, GenServer vs Agent vs Task, Phoenix views vs LiveView) for intermediate; `architecture-explainer` + `scenario-walkthrough` (distributed cluster topology, hot-code-reload deployment, supervision-tree design) for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in elixir_fresher elixir_intermediate elixir_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=elixir_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~60 topics. Wall time 3-6 hours.

### Step 6 — Run the intermediate wave

`WAVE=elixir_intermediate`. Wall time 10-15 hours; split if needed (language+otp+ecto first, phoenix+liveview+streams+test second).

### Step 7 — Run the advanced wave

`WAVE=elixir_advanced`. Wall time 7-10 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/elixir-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Elixir anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "defensive_try_rescue": r"try\s+do[\s\S]{0,200}rescue",
    "if_else_chain_over_pattern_match": r"if\s+[^d]+do[\s\S]{0,200}else[\s\S]{0,200}end[\s\S]{0,200}if\s+",
    "bang_function_in_pipeline": r"\|>\s*[A-Z][\w.]*!\(",
    "imperative_for_loop_simulation": r"Enum\.each\s*\(\s*[\d:]+\.\.\d+",
    "manual_send_without_link": r"\bsend\s*\(\s*pid",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("elixir-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

Defensive `try/rescue` is anti-Elixir — supervision trees handle failure. `if/else` chains where pattern matching with multi-clause function heads would be cleaner — flag and review. Bang functions (`!`) in pipelines bypass the `:ok`/`:error` convention — review per topic.

### Step 10 — Locked-domain registration

```typescript
export const CONTENT_ELXF_ROOT = 'content/elixir-fresher';
export const CONTENT_ELXI_ROOT = 'content/elixir-intermediate';
export const CONTENT_ELXA_ROOT = 'content/elixir-advanced';

'elixir-fresher':      { root: CONTENT_ELXF_ROOT, displayName: 'Elixir (Fresher)',      icon: 'elixir', enabled: false },
'elixir-intermediate': { root: CONTENT_ELXI_ROOT, displayName: 'Elixir (Intermediate)', icon: 'elixir', enabled: false },
'elixir-advanced':     { root: CONTENT_ELXA_ROOT, displayName: 'Elixir (Advanced)',     icon: 'elixir', enabled: false },
```

SEO slugs: `elixir-interview-questions-for-freshers`, `elixir-phoenix-interview-questions`, `senior-elixir-otp-interview-questions`.

All three flags FALSE.

### Step 11 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Elixir cards hidden on `/domains`.
2. Local-only flip `elixir-intermediate` to enabled; open `processes-and-otp/genserver`; verify supervision example present, no defensive `try/rescue`, mermaid renders.
3. Revert local flip.
4. Open existing pages — confirm no regression.

### Step 12 — Commit and update INDEX

```bash
git add content/elixir-fresher/ content/elixir-intermediate/ content/elixir-advanced/
git commit -m "content(elixir): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register elixir locked domains (flags off)"

git add .cursor/content-factory/taxonomy.yaml
git commit -m "chore(taxonomy): add elixir language_pillar_modules" --allow-empty

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 67-elixir-phoenix-track DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 220 | count | sum questions in `content/elixir-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 660 | count | sum questions in `content/elixir-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 370 | count | sum questions in `content/elixir-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| Defensive `try/rescue` in non-counterexample code ≤ 5 | step 9 + review | step 9 |
| Bang functions in `:ok`/`:error` pipelines ≤ 10 (review per occurrence) | step 9 + review | step 9 |
| Elixir anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Locked-domain edit limited to 3 files | clean diff | step 10 diff check |
| `npm run build` exits 0 | exit | step 11 |
| With flags=false, Elixir hidden on `/domains` | manual | step 11 |
| With flag=true (local), Elixir topic renders | manual | step 11 |
| Existing pages: zero regression | manual | step 11 |
| Taxonomy has `language_pillar_modules.elixir.*` populated | grep | `grep -c '^\s*elixir:' .cursor/content-factory/taxonomy.yaml` ≥ 1 |
| Phoenix LiveView pillar ≥ 80 Q (intermediate) | count | per-pillar count |

## Failure modes & rollback

- **Defensive `try/rescue` everywhere**: prompt must say "Elixir embraces 'let it crash'. Errors are typically modelled as `:ok`/`:error` tuples and handled with `case` / `with`; `try/rescue` is only for genuinely-recoverable runtime errors at process boundaries. Most error handling lives in supervision trees."
- **Bang functions (`!`) used to bypass tuple-error handling**: prompt must say "Bang functions raise on failure; only use them at supervised boundaries or in scripts where crashing is acceptable. In data pipelines that compose with `with`, prefer the non-bang variant returning `{:ok, _}`/`{:error, _}`."
- **Pattern matching avoided in favor of conditionals**: every topic where multi-clause function heads, `case`, or `with` would be cleaner than nested `if/cond` should regenerate.
- **OTP topics that use raw `spawn` / `send` / `receive` instead of `GenServer`**: acceptable in topics specifically teaching the primitives; flag in topics that should model real services.
- **LiveView topics that simulate React lifecycle vocabulary instead of LiveView's own**: regenerate with LiveView-native terms (`mount`, `handle_event`, `handle_info`, `assigns`, `temporary_assigns`).
- **Wall time blow > 35h**: split intermediate; advanced last. Use handoff skill.

## Definition of Done

- [ ] Three Elixir level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Elixir anti-pattern fingerprint reviewed; defensive `try/rescue` count below threshold.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] Taxonomy `language_pillar_modules.elixir.*` populated and committed.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Elixir topic renders when flag locally true).
- [ ] All 14 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `67` flipped to `DONE`.
- [ ] ROADMAP.md has "Elixir launch checklist" row pending.

## Estimated effort

- **Ideal:** 25 hours (3h fresher + 12h intermediate + 7h advanced + 3h infra/taxonomy/locked-domain).
- **Hard stop:** 50 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-4 (taxonomy + scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate).
  4. Steps 7-12 (advanced + validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions.
