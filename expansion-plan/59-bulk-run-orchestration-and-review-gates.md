# 59 — Bulk-Run Orchestration & Review Gates

> **Executor:** AI coding agent operating autonomously.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** orchestration tooling + gate definitions. Touches `.cursor/content-factory/` only. **No frontend edits, no content generation.**

## TL;DR

- **Input:** Working content factory (51), taxonomy (52), per-language exemplars (53), plus the language playbooks (54-58) which produce real bulk content.
- **Action:** Build a higher-level orchestrator on top of `factory.sh` that (a) sequences multi-language waves, (b) tracks token spend and wall time across days, (c) enforces post-wave review gates before any content is allowed to ship, (d) coordinates multiple parallel agent sessions safely with file locks.
- **Output:** A scaling layer that turns the content factory from "one-wave-at-a-time, manual" into "multi-wave, supervised auto-pilot with human approval gates". Without this layer, playbooks 54-58 stay 2-3x slower and harder to recover from failures.

## Hard prerequisites

- [ ] Playbook 51 DONE (factory exists).
- [ ] Playbook 52 DONE (taxonomy + UI contract).
- [ ] Playbook 53 DONE (per-language exemplars).
- [ ] At least one of 54-58 partially run (so we have realistic wave logs and token metrics to model from).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

`factory.sh` is single-wave and stateless across days; running JBI + JFI + Go + Ruby waves over a 2-3 week window with the same script generates a brittle paper trail and spends tokens twice when sessions overlap. This playbook adds the orchestration layer that turns 5 individual playbooks (54-58) into a single supervisable program with clear go/no-go review gates.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/factory.sh` | Single-wave executor — orchestrator wraps this. |
| `.cursor/content-factory/runs/` | Existing run logs to learn the metrics shape. |
| `.cursor/content-factory/lib/validate_qa.py` | Validator output format the orchestrator consumes. |
| `.cursor/watchdog/watchdog.sh` (skim) | Concurrency model reference. |
| `expansion-plan/00-INDEX.md` | Wave organization reference. |

## Components built in this playbook

1. **`orchestrator.py`** — multi-wave scheduler.
2. **`wave_plan.yaml`** — declarative wave definitions across all language playbooks.
3. **`gates/` directory** — post-wave gate scripts (validation, fingerprints, SEO checks, build).
4. **`metrics.py`** — token + wall-time + Q-count rollups.
5. **`session-lock/` directory** — per-wave file locks so two agent sessions can't double-run a wave.
6. **`REVIEW_GATE.md`** template — the human-approval document each wave must produce before locked-domain registration commits.

## Execution steps

### Step 1 — Scaffold the orchestrator directory

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p .cursor/content-factory/{gates,session-lock,reviews}
ls -la .cursor/content-factory/
```

**Expected output:** New `gates/`, `session-lock/`, `reviews/` directories alongside existing `schemas/`, `exemplars/`, `prompts/`, `queues/`, `runs/`, `lib/`.

### Step 2 — Write `wave_plan.yaml`

Write `.cursor/content-factory/wave_plan.yaml`. Top-level keys:

- `waves` — ordered list of wave entries. Each entry: `id`, `language`, `level`, `queue` (path to queue file), `expected_q_count`, `expected_topics`, `est_wall_hours`, `prerequisites` (list of wave IDs that must complete first), `gates` (list of gate IDs to run post-wave).
- `gates` — registry of gate scripts. Each entry: `id`, `script` (path), `description`, `severity` (`fatal` / `warn`).
- `budget` — global limits: `max_tokens_per_day`, `max_concurrent_sessions`, `max_total_wall_hours`.

A representative `waves` block (abbreviated):

```yaml
version: 1
budget:
  max_tokens_per_day: 8000000
  max_concurrent_sessions: 2
  max_total_wall_hours: 400

gates:
  validate_schema:
    script: .cursor/content-factory/gates/validate_schema.sh
    description: All complete-qa.json files pass validate_qa.py.
    severity: fatal
  java_isms:
    script: .cursor/content-factory/gates/java_isms.sh
    description: Non-Java languages contain zero Java-flavored syntax.
    severity: fatal
  build_ok:
    script: .cursor/content-factory/gates/build_ok.sh
    description: frontend/ npm run build exit 0.
    severity: fatal
  language_fingerprint:
    script: .cursor/content-factory/gates/language_fingerprint.sh
    description: Per-language anti-pattern check with documented thresholds.
    severity: warn
  review_packet:
    script: .cursor/content-factory/gates/review_packet.sh
    description: Auto-generates REVIEW_GATE.md for human approval.
    severity: fatal

waves:
  - id: pilot
    language: python
    level: backend-intermediate
    queue: .cursor/content-factory/queues/pilot.txt
    expected_q_count: 10
    expected_topics: 3
    est_wall_hours: 2
    prerequisites: []
    gates: [validate_schema, build_ok, review_packet]

  - id: js_fresher
    language: javascript
    level: fresher
    queue: .cursor/content-factory/queues/js_fresher.txt
    expected_q_count: 600
    expected_topics: 140
    est_wall_hours: 12
    prerequisites: [pilot]
    gates: [validate_schema, java_isms, language_fingerprint, build_ok, review_packet]

  - id: js_backend_intermediate
    language: javascript
    level: backend-intermediate
    queue: .cursor/content-factory/queues/js_backend_intermediate.txt
    expected_q_count: 1200
    expected_topics: 280
    est_wall_hours: 22
    prerequisites: [js_fresher]
    gates: [validate_schema, java_isms, language_fingerprint, build_ok, review_packet]

  # ... continue for ts, go, ruby, csharp, php, rust, kotlin (per playbooks 55-58)
```

### Step 3 — Build the orchestrator (`orchestrator.py`)

Write `.cursor/content-factory/orchestrator.py`. Python stdlib + `pyyaml` only. Required behavior:

- `python3 orchestrator.py status` — print wave-by-wave status table (id, language, level, status: pending|running|gates_failed|done, q_count_actual, wall_hours_so_far, last_gate_result).
- `python3 orchestrator.py next` — print the next wave that satisfies all prerequisites and is `pending`.
- `python3 orchestrator.py run <wave_id>` — acquire `.session-lock/<wave_id>.lock`, invoke `factory.sh` with the wave's queue, capture metrics, run all gates, write a fresh `reviews/<ts>_<wave_id>/` directory with REVIEW_GATE.md.
- `python3 orchestrator.py run --next` — orchestrator picks the next eligible wave automatically. Useful for the auto-failover path.
- `python3 orchestrator.py rollup` — print global token spend, wall time, Q-count totals across waves; flag any budget overage.
- Concurrency: file lock under `.session-lock/<wave_id>.lock` (atomic create with `O_CREAT|O_EXCL`). Stale locks (mtime > 24h) get warned about; the script does NOT auto-break them — human must.
- State: orchestrator persists per-wave state in `.cursor/content-factory/.state/<wave_id>.json` (status, last_run_at, q_count, wall_seconds, gate_results). State is stable across crashes and shell sessions.

### Step 4 — Write each gate script

Each gate is a bash script returning exit 0 on pass, non-zero on fail, and writing a one-line summary to stdout that the orchestrator captures.

**`gates/validate_schema.sh`:** runs `validate_qa.py` over every `content/<L>/**/complete-qa.json` for the wave's language/level pair.

**`gates/java_isms.sh`:** runs the Java-isms regex check from playbook 53 step 6, scoped to the wave's language/level pair.

**`gates/build_ok.sh`:** `cd frontend && npm run build`. Exit 0 on success.

**`gates/language_fingerprint.sh`:** dispatches to per-language fingerprint check (e.g. `gates/_fingerprint_python.py`, `_fingerprint_go.py`, etc.) based on the wave's language. Severity is `warn` so it doesn't block the wave; the orchestrator logs the fingerprint output into the review packet.

**`gates/review_packet.sh`:** writes `reviews/<ts>_<wave_id>/REVIEW_GATE.md` from the template. Fatal if the template can't render.

All scripts: `chmod +x .cursor/content-factory/gates/*.sh`.

### Step 5 — Write `metrics.py`

Write `.cursor/content-factory/lib/metrics.py`. Stdlib-only. Functions:

- `count_questions(level_root: Path) -> int` — sum across all `complete-qa.json`.
- `wall_seconds_from_log(run_log: Path) -> int` — parse `wall.log` for start/end timestamps.
- `tokens_from_log(run_log: Path) -> dict` — parse cursor-agent's per-run token output (input/output/total). If the format isn't reliable, fall back to a length-based estimate.
- `rollup_across_waves(state_dir: Path) -> dict` — sum across all `.state/<wave_id>.json`.
- CLI shape: `python3 metrics.py rollup` prints a table.

### Step 6 — Write the REVIEW_GATE.md template

Write `.cursor/content-factory/gates/REVIEW_GATE.template.md`. Required sections:

1. **Wave summary**: id, language, level, queue, expected vs actual Q-count, wall hours, est tokens spent.
2. **Gate results table**: each gate id with status, severity, output snippet.
3. **Generated content sample**: 3 random Q files quoted by path with their `direct_answer` and one `code_example` excerpt.
4. **Anti-pattern fingerprint output** (full).
5. **Validator output** (full, even when passing — usually `OK` per file).
6. **Manual quality review checklist**:
   - [ ] Spot-checked 5+ topics for code correctness.
   - [ ] Spot-checked 3+ topics for `speakable_answer` fluency.
   - [ ] Spot-checked 1+ mermaid diagram per language for valid syntax.
   - [ ] Confirmed no Java-flavored idioms in non-Java languages.
   - [ ] Confirmed code blocks have realistic, runnable examples (no `// ...` placeholders).
7. **Approval block**: reviewer signs off (`reviewer: <name>`, `approved_at: <ts>`, `notes: <free-form>`).
8. **Decision**: `APPROVE` (proceed to locked-domain registration) / `REJECT` (rollback wave) / `CONDITIONAL` (specific topics to regenerate before approval).

### Step 7 — Write README for the orchestration layer

Write `.cursor/content-factory/README.md` (new or expanded). Document:

- The 6 components built here.
- The relationship to `factory.sh` (orchestrator wraps it).
- How to start/stop a wave.
- How to interpret gate results.
- How review gates feed back into the locked-domain registration step in language playbooks (54-58).
- The hard concurrency rule: at most `max_concurrent_sessions` from `wave_plan.yaml` may be active simultaneously.

### Step 8 — Smoke-test orchestrator

Run a tiny dry-run wave to confirm the orchestrator works without spending real tokens.

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

python3 .cursor/content-factory/orchestrator.py status
python3 .cursor/content-factory/orchestrator.py next
# Should report: pilot is the next eligible wave
```

**Expected output:** Status table renders. `next` returns `pilot` (or whichever wave is first with no satisfied prerequisites).

### Step 9 — Run the orchestrator on the existing pilot

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 .cursor/content-factory/orchestrator.py run pilot
```

**Expected:** Re-runs the pilot via factory.sh, runs all gates, writes `reviews/<ts>_pilot/REVIEW_GATE.md`, exits 0.

If the pilot was already complete from playbook 51, the orchestrator should detect the existing complete content and run gates only — not regenerate. Add idempotency check at the top of `orchestrator.py run`: if `expected_q_count` is already present and validator passes, skip generation and run gates only.

### Step 10 — Verify a multi-wave plan compiles

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 .cursor/content-factory/orchestrator.py status
```

**Expected:** All waves listed; pilot shows `done` (or `gates_passed`); `js_fresher` shows `pending`; correct prerequisite resolution; budget rollup shown at bottom.

### Step 11 — UI smoke test (regression)

This playbook should not touch frontend/.

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git diff --name-only main...HEAD | grep '^frontend/' && echo "FAIL: frontend changes" || echo "OK"
cd frontend && npm run build
```

**Expected:** `OK` and exit 0.

### Step 12 — Commit and update INDEX

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add .cursor/content-factory/orchestrator.py \
        .cursor/content-factory/wave_plan.yaml \
        .cursor/content-factory/gates/ \
        .cursor/content-factory/lib/metrics.py \
        .cursor/content-factory/README.md
git commit -m "factory: orchestrator + wave plan + review gates"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 59-bulk-run-orchestration-and-review-gates DONE"
```

## Quality gates (for THIS playbook itself)

| Gate | Threshold | Verify with |
|---|---|---|
| `wave_plan.yaml` lists every wave from playbooks 54-58 | each language fresher + intermediate is a wave | grep wave IDs |
| `orchestrator.py status` runs without errors | exit 0 | `python3 .cursor/content-factory/orchestrator.py status` |
| Idempotency: re-running an already-complete wave does NOT regenerate | manual test | step 9 |
| Concurrency: two simultaneous `run <id>` invocations on the same wave: second one fails with lock-busy error | manual test | run two terminals |
| All 5 gates exist as scripts and exit reasonably | exit 0 on a clean tree | `bash .cursor/content-factory/gates/<name>.sh` for each |
| No edits in `frontend/`, `backend/`, `content/` | clean diff | `git diff --name-only HEAD~2 HEAD \| grep -v -E '^(\.cursor/content-factory/\|expansion-plan/00-INDEX)' ` empty |
| `npm run build` exits 0 (regression) | exit | step 11 |

## Failure modes & rollback

- **`pyyaml` missing**: `pip3 install pyyaml`. Document in README.
- **`factory.sh` interface drifts** (e.g. expects different env vars than orchestrator passes): bump `factory.sh --version` and have orchestrator assert minimum version. Fix interface mismatch in a single commit.
- **Gate script exits non-zero spuriously** (e.g. timing-sensitive grep): add retries with backoff in the gate, log the retries, mark severity `warn` if it can't be made stable.
- **Concurrency lock left stale** after a kill: orchestrator detects stale (>24h) locks and warns but does NOT auto-break. Operator runs `python3 orchestrator.py unlock <wave_id>` after confirming no other session is active.
- **Token budget exceeded**: orchestrator refuses to start new waves until `--force` flag passed. Logs warning with daily/cumulative breakdowns.
- **`reviews/<ts>_<wave_id>/REVIEW_GATE.md` not approved within 7 days**: orchestrator does NOT auto-approve. The next wave that depends on this one stays `pending` until the REVIEW_GATE has an `APPROVE` decision section filled in. The orchestrator reads that section as a structured approval signal.

## Definition of Done

- [ ] `.cursor/content-factory/orchestrator.py` exists and runs.
- [ ] `.cursor/content-factory/wave_plan.yaml` exists and includes all waves from 51 + 54-58.
- [ ] `.cursor/content-factory/gates/` has the 5 gate scripts; all exit reasonably.
- [ ] `.cursor/content-factory/lib/metrics.py` exists.
- [ ] `.cursor/content-factory/gates/REVIEW_GATE.template.md` exists.
- [ ] `.cursor/content-factory/README.md` documents the orchestration layer.
- [ ] Orchestrator smoke test passes.
- [ ] Idempotency confirmed.
- [ ] Lock-based concurrency confirmed.
- [ ] No edits in frontend/, backend/, content/.
- [ ] `npm run build` exits 0.
- [ ] All 7 quality gates pass.
- [ ] Two commits on factory branch.
- [ ] `00-INDEX.md` row for `59` flipped to `DONE`.

## Estimated effort

- **Ideal:** 12 hours (4h orchestrator, 3h gates, 2h wave_plan, 2h metrics, 1h docs).
- **Hard stop:** 24 hours.
- **Recommended split:** 2-3 agent sessions:
  1. Steps 1-5 (orchestrator + wave plan + gates).
  2. Steps 6-8 (review template + smoke test).
  3. Steps 9-12 (full smoke + docs + commit).

After this playbook: playbooks 54-58 should be re-run THROUGH the orchestrator (not standalone), so each wave gets a `REVIEW_GATE.md` with explicit human approval before locked-domain commits land. The locked-domain commit at the end of each language playbook becomes gated on the wave's REVIEW_GATE having an `APPROVE` decision.
