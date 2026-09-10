# 80 — Content Factory v2 Graduation and Archive Policy

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** governance + meta-infrastructure. Capstone of Wave I; closes the loop on 51 (factory pilot), 52 (taxonomy + UI contract), 59 (orchestrator + review gates), 76 (analytics), 77 (A/B), 78 (monetization), 79 (i18n).

## TL;DR

- **Goal:** Graduate the content factory from "pilot + bulk-run" to a sustainable v2 platform with explicit promotion / depromotion / archive lifecycle, content-health SLAs (freshness, accuracy, deprecation), and a quarterly review cadence that prevents the content tree from rotting as it grows past ~30k Q. This playbook is the **operating model**, not a feature ship.
- **Action:** Codify a `content-lifecycle.yaml` registry, add `scripts/content_health_check.py` that runs nightly + emits `docs/content-health.md`, define the archive directory contract (`content/.archive/<YYYY-Q>/<original-path>/`), introduce a quarterly review issue template, and connect the analytics signals (low-view + low-conversion topics) to a "candidate for refresh / archive" flag.
- **Output:** Every topic is governed by an explicit lifecycle state (`draft` / `live` / `needs-refresh` / `archived`); a nightly health check writes a dashboard markdown; a quarterly review GitHub issue template ships with prefilled refresh + archive candidates; legacy / off-template / duplicate content has a clean migration path to `content/.archive/`.

## Hard prerequisites

- [ ] Playbook 51 (content factory pilot) DONE.
- [ ] Playbook 52 (taxonomy + UI contract) DONE.
- [ ] Playbook 59 (bulk-run orchestration + review gates) DONE.
- [ ] Playbook 76 (analytics) DONE — view + conversion signals required.
- [ ] At least 3 language tracks live (e.g. JBI, PBI, plus one of JS/Go/Ruby/Rust/etc.).
- [ ] `content/.archive/` directory may already exist from prior cleanup — confirm and respect contents.

## Why this matters

The content tree has gone from ~1k Q (JBI) to ~30k+ Q across all tracks (per the Wave F + Wave G plans) — at that volume, "ship and forget" produces stale, contradictory, and duplicated content that erodes search ranking and user trust. A factory-v2 governance layer that **automates** the freshness check, **gates** the archive lifecycle, and **uses analytics** to triage what to refresh vs archive is what separates a maintainable platform from a content graveyard.

## Background

This playbook implements four specific mechanisms:

1. **`content-lifecycle.yaml`**: a YAML file that defines the four lifecycle states and their allowed transitions. Every `complete-qa.json` carries a `lifecycle` block that references one of these states.
2. **`content_health_check.py`**: a nightly Python script that walks every `complete-qa.json`, cross-checks against taxonomy, checks version pins, pulls analytics signals (30-day page views + mastery rate), and emits a `docs/content-health.md` dashboard + `content-health.json` machine-readable summary.
3. **Quarterly review template**: a GitHub Issue template that auto-populates with candidates from `content-health.json` — topics that have been in `needs_refresh` > 90 days, have < 50 views/30d AND age > 90 days, or are no longer in the taxonomy.
4. **Archive contract**: archived content moves to `content/.archive/<YYYY-Q>/<original-path>/` with a `lifecycle.state: 'archived'` marker and a corresponding 301 redirect in `frontend/redirects.json`. The redirect lives for ≥ 30 days before the file path is eligible for cleanup.

The most common mistake with content governance systems is treating the health check as a blocker — if the nightly check fails because a new validator rule breaks 500 old files, the site should still build. Pin the validator version in `content-factory/version.txt` and bump it in a dedicated PR.

Files to read before executing:

| Path | Why |
|---|---|
| `.cursor/content-factory/lib/validate_qa.py` (from playbook 51) | The existing per-file validator; v2 extends it with lifecycle-state validation. |
| `.cursor/content-factory/taxonomy.yaml` (from playbook 52) | Taxonomy is the source of truth for which modules SHOULD exist; v2 cross-checks reality. |
| `.cursor/content-factory/orchestrator/` (from playbook 59) | Where the bulk-run orchestrator lives; v2 adds a `lifecycle-check` mode. |
| `expansion-plan/76-analytics-and-content-instrumentation.md` | `topic_view` + `topic_mark_mastered` are the signals for "is this topic earning its keep". |
| `expansion-plan/50-interview-migration-seo-sitemap-operations.md` | `STATUS.md` + `content-health.json` pattern this playbook formalises. |
| `content/.archive/` | Existing archive (if any); v2 enforces the YYYY-Q sub-path. |

---

## Step 1 — Codify the lifecycle registry

Add `.cursor/content-factory/content-lifecycle.yaml`:

```yaml
# Lifecycle states for every content asset.
# A topic's state is the union of (state, last_state_change_at, owner, ttl_days).
states:
  draft:
    description: "Generated or hand-authored, not yet review-gated."
    visible_in_ui: false
    visible_in_sitemap: false
  live:
    description: "Review-gated; visible to users + crawlers."
    visible_in_ui: true
    visible_in_sitemap: true
  needs_refresh:
    description: "Live but flagged for content review (stale version pin, low analytics signal, factual drift)."
    visible_in_ui: true
    visible_in_sitemap: true
  archived:
    description: "Removed from UI + sitemap; physical files moved to content/.archive/."
    visible_in_ui: false
    visible_in_sitemap: false
    redirect_required: true   # archive triggers a 301 redirect to the replacement (or to hub if none)

transitions:
  - from: draft
    to:   live
    requires: ["review_gate_passed", "validator_clean"]
  - from: live
    to:   needs_refresh
    requires: ["analytics_signal_below_threshold OR taxonomy_version_drift OR manual_flag"]
  - from: needs_refresh
    to:   live
    requires: ["refresh_pr_merged", "validator_clean"]
  - from: needs_refresh
    to:   archived
    requires: ["quarterly_review_decision OR sustained_low_signal_180d"]
  - from: live
    to:   archived
    requires: ["quarterly_review_decision OR superseded_by_replacement"]

ttl:
  needs_refresh_days: 90    # if a topic stays in needs_refresh > 90d, the quarterly review must decide
  archive_grace_days: 30    # archived content's 301 redirect lives for 30d before the file moves
```

Add a `lifecycle` field at the top of every `complete-qa.json`:

```json
{
  "lifecycle": {
    "state": "live",
    "last_state_change_at": "2026-05-28T20:00:00Z",
    "owner": "ravi",
    "version_pin": "Java 21, Spring Boot 3.3"
  },
  "questions": [ ... ]
}
```

Backfill: a one-shot script `scripts/backfill_lifecycle.py` walks every existing `complete-qa.json` and adds `lifecycle: { state: 'live', last_state_change_at: <git log first-commit-date>, owner: '@maintainer', version_pin: 'unspecified' }`.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f .cursor/content-factory/content-lifecycle.yaml && echo "OK lifecycle yaml" || echo "MISSING lifecycle yaml"
python3 -c "import yaml; yaml.safe_load(open('.cursor/content-factory/content-lifecycle.yaml')); print('YAML valid')"
grep -c 'needs_refresh_days' .cursor/content-factory/content-lifecycle.yaml
```
Expected: `OK lifecycle yaml`; `YAML valid`; count ≥ 1.

---

## Step 2 — Nightly content-health check

Add `scripts/content_health_check.py`:

```python
#!/usr/bin/env python3
"""Walk content/**/complete-qa.json. For each file, emit:

  - lifecycle state (from `lifecycle.state` field)
  - days since last state change
  - validator pass/fail
  - taxonomy drift: is this topic still in taxonomy.yaml? Is the pillar still listed?
  - version drift: is the version_pin older than the taxonomy's current pin?
  - analytics signal: page_views_30d, mark_mastered_30d (pulled from analytics backend)
  - flags: any of `stale_version`, `low_views`, `low_mastery_rate`, `not_in_taxonomy`, `validator_failing`

Output:
  - docs/content-health.md      — human-readable markdown dashboard
  - .cursor/content-factory/content-health.json — machine-readable with summary counts
"""
```

Schedule nightly via a GH Actions workflow at 02:00 UTC. Commit the output back to repo.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f scripts/content_health_check.py && echo "OK script" || echo "MISSING script"
python3 scripts/content_health_check.py
test -s docs/content-health.md && echo "OK dashboard" || echo "MISSING dashboard"
test -s .cursor/content-factory/content-health.json && echo "OK json" || echo "MISSING json"
python3 -c "import json; d=json.load(open('.cursor/content-factory/content-health.json')); print('summary:', d.get('summary', 'MISSING'))"
```
Expected: `OK script`; `OK dashboard`; `OK json`; summary dict printed.

---

## Step 3 — Quarterly review issue template

Add `.github/ISSUE_TEMPLATE/quarterly-content-review.md`:

```markdown
---
name: Quarterly Content Review (YYYY-Q)
about: Triage needs-refresh + low-signal content
title: 'Quarterly Content Review YYYY-Q'
labels: 'content-governance, q-review'
---

## Scope

This review covers all topics with one or more flags from `docs/content-health.md`:

- [ ] `needs_refresh` for > 90 days
- [ ] `low_views` (< 50 page_views_30d) AND age > 90 days
- [ ] `low_mastery_rate` (< 10% of viewers `mark_mastered`)
- [ ] `stale_version` (version_pin older than taxonomy current)
- [ ] `not_in_taxonomy` (topic exists on disk but taxonomy doesn't reference it)

## Decisions per flagged topic

For each, pick one of: **refresh** (create a refresh PR), **archive** (move to `content/.archive/YYYY-Q/`), **keep** (mark `state: live` with justification).

## Outputs

- A PR per refresh (small, scoped).
- A single archive PR per quarter (moves all archived files + emits redirects).
- An updated `content-lifecycle.yaml` if the lifecycle policy itself needs changes.
```

The template is filled by `scripts/open_quarterly_review.py` (run on the 1st of January/April/July/October) that pulls candidates from `content-health.json`.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f .github/ISSUE_TEMPLATE/quarterly-content-review.md && echo "OK template" || echo "MISSING template"
test -f scripts/open_quarterly_review.py && echo "OK opener" || echo "MISSING opener"
python3 scripts/open_quarterly_review.py --dry-run | head -10
```

---

## Step 4 — Archive directory contract

Hard rules in `docs/content-archive-policy.md`:

- Archived files live under `content/.archive/<YYYY-Q>/<original-path-from-content-root>/`.
- Archived files retain their `complete-qa.json` shape but with `lifecycle.state: 'archived'` and a `lifecycle.replaced_by` field pointing at the replacement URL (or `null` if none).
- A 301 redirect is added to `frontend/redirects.json` for each archived URL, valid for at least 30 days (matches `ttl.archive_grace_days`).
- After 90 days, the redirect MAY be removed. Use a cleanup script, never manual edits.
- `.archive/` content is NEVER served by the UI; the sitemap generator skips it.
- `.archive/` content is NEVER deleted from the repo; only repository-level vacuum can delete, and only by an explicit follow-up playbook.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f docs/content-archive-policy.md && echo "OK policy doc" || echo "MISSING policy doc"
# Confirm .archive directory exists
test -d content/.archive && echo "OK .archive dir" || mkdir -p content/.archive && echo "CREATED .archive dir"
# Confirm sitemap builder skips .archive
grep -c '\.archive' scripts/build_sitemap.py 2>/dev/null
```
Expected: `OK policy doc`; `.archive` dir exists; `build_sitemap.py` references `.archive` in a skip condition.

---

## Step 5 — Refresh-PR workflow

Refresh PRs follow this template:

- Title: `content(refresh): <domain>/<module>/<topic> — <reason>` (e.g. `Spring Boot 3.3 → 3.4`).
- Body: linked content-health row + brief diff summary.
- Branch: `content-refresh/<topic>-<YYYY-MM>`.
- Required checks: validator + i18n key parity (if the refresh touches catalogues) + analytics-lint (no schema drift).
- On merge: `lifecycle.state` flips back to `live`, `last_state_change_at` updated.

**Verify (template exists):**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f .github/PULL_REQUEST_TEMPLATE/content-refresh.md && echo "OK PR template" || echo "MISSING PR template"
```

---

## Step 6 — Integrate with the existing factory orchestrator

The factory orchestrator (playbook 59) gains a `--mode lifecycle-check` invocation that:

1. Pulls `content-health.json`.
2. Decides which topics warrant a refresh queue entry vs. archive candidate.
3. Writes a queue file `.cursor/content-factory/queues/<YYYY-Q>_refresh.txt`.
4. Refuses to enqueue more than 30 refresh topics per quarter (refresh capacity cap).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
ORCH=.cursor/content-factory/orchestrator/
test -d "$ORCH" && echo "OK orchestrator dir" || echo "MISSING orchestrator"
python3 "$ORCH/run.py" --mode lifecycle-check --dry-run 2>&1 | head -10
```

---

## Step 7 — Acceptance smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

# Backfill lifecycle metadata across all existing complete-qa.json
python3 scripts/backfill_lifecycle.py --dry-run | tail -20
python3 scripts/backfill_lifecycle.py --commit

# Run the nightly health check once manually
python3 scripts/content_health_check.py

# Verify outputs
test -s docs/content-health.md && echo "OK: human dashboard"
test -s .cursor/content-factory/content-health.json && echo "OK: machine dashboard"

# Run the quarterly review opener in dry-run
python3 scripts/open_quarterly_review.py --dry-run | head -40

# Frontend smoke
cd frontend
npm run build 2>&1 | tail -10
```

---

## Step 8 — Commits

```bash
git add .cursor/content-factory/content-lifecycle.yaml
git commit -m "feat(content-factory): codify v2 lifecycle states + transitions"

git add scripts/backfill_lifecycle.py
git commit -m "feat(content-factory): backfill lifecycle metadata across all complete-qa.json"

git add scripts/content_health_check.py docs/content-health.md .cursor/content-factory/content-health.json
git commit -m "feat(content-factory): nightly content-health check + dashboard"

git add .github/ISSUE_TEMPLATE/quarterly-content-review.md scripts/open_quarterly_review.py
git commit -m "feat(governance): quarterly content review template + opener bot"

git add .github/PULL_REQUEST_TEMPLATE/content-refresh.md docs/content-archive-policy.md
git commit -m "docs(governance): archive directory contract + refresh PR template"

git add .cursor/content-factory/orchestrator/
git commit -m "feat(content-factory): orchestrator --mode lifecycle-check + refresh queue cap"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 80-content-factory-v2-graduation-and-archive-policy DONE"
```

---

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Every `complete-qa.json` has a `lifecycle` block | 100 % | `python3 scripts/check_lifecycle_coverage.py` exits 0 |
| `content-lifecycle.yaml` is parseable + complete | 1 | `python3 -c "import yaml; yaml.safe_load(open('.cursor/content-factory/content-lifecycle.yaml')); print('OK')"` |
| Nightly health check exits 0 | 0 | `python3 scripts/content_health_check.py; echo $?` |
| `docs/content-health.md` updates per nightly run | per night | `git log -1 --format=%cs -- docs/content-health.md` ≥ yesterday |
| `content-health.json` enumerates flag counts | parseable | `python3 -c "import json; d=json.load(open('.cursor/content-factory/content-health.json')); print(d['summary'])"` |
| Archive directory contract enforced | 100 % | `python3 scripts/audit_archive_paths.py` exits 0 |
| Quarterly review template renders | 1 | `test -s .github/ISSUE_TEMPLATE/quarterly-content-review.md && echo OK` |
| Refresh queue cap respected (≤ 30 per quarter) | ≤ 30 | `wc -l .cursor/content-factory/queues/*_refresh.txt \| tail -1` ≤ 30 |
| Redirects emitted for archived URLs | 100 % | `python3 -c "import json; r=json.load(open('frontend/redirects.json')); print(len([x for x in r if x.get('source','').startswith('/interview/')]),'archived redirects')"` |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| No live content with `state: archived` accidentally visible | 0 | `python3 scripts/sitemap_vs_lifecycle_cross_check.py` exits 0 |

## Failure modes & rollback

- **Backfill assigns wrong `last_state_change_at`** (uses commit timestamp of last edit, not the create date): acceptable — the most-recently-touched signal is what we actually care about for staleness.
- **Nightly health check rejects everything** (validator update breaks compatibility): freeze the validator version in `content-factory/version.txt`; nightly uses the frozen version unless explicitly bumped.
- **Quarterly review opener bot fires multiple times in the same quarter**: idempotency check — the script looks for an existing open issue with the quarter label and exits if one exists.
- **Refresh capacity cap blocks legitimate emergency refresh** (e.g. security disclosure changes Java idioms): the cap is soft; an `emergency: true` flag in the queue file bypasses it with a justifying comment.
- **Archived content's redirect points at a deleted target**: the redirect emitter verifies the target URL resolves; otherwise the redirect points at `/` with `?archived=<original-slug>` so we can see the lost traffic in analytics.
- **Storage growth from `.archive/`**: monitor via `du -sh content/.archive/`; if > 500 MB, consider extracting old quarters to a separate repo.
- **Rollback:** the lifecycle scaffolding is **additive** — every change is a new field or a new script, with no UI behaviour changes. Remove the cron schedule, ignore the dashboard, and the rest of the system runs as before.

## Definition of Done

- [ ] `test -f .cursor/content-factory/content-lifecycle.yaml && python3 -c "import yaml; yaml.safe_load(open('.cursor/content-factory/content-lifecycle.yaml')); print('OK')"` — OK
- [ ] `python3 scripts/check_lifecycle_coverage.py; echo $?` — exits 0
- [ ] `python3 scripts/content_health_check.py; echo $?` — exits 0
- [ ] `test -s docs/content-health.md && echo OK` — OK
- [ ] `python3 -c "import json; d=json.load(open('.cursor/content-factory/content-health.json')); print('OK' if 'summary' in d else 'MISSING')"` — OK
- [ ] `test -s .github/ISSUE_TEMPLATE/quarterly-content-review.md && echo OK` — OK
- [ ] `test -f docs/content-archive-policy.md && echo OK` — OK
- [ ] `wc -l .cursor/content-factory/queues/*_refresh.txt | tail -1` — ≤ 30
- [ ] `python3 scripts/sitemap_vs_lifecycle_cross_check.py; echo $?` — exits 0
- [ ] `cd frontend && npm run build; echo $?` — exits 0

## Estimated effort

- **Ideal:** 24 hours (3h lifecycle YAML + 3h backfill script + 5h health check + dashboard + 3h quarterly review template + bot + 2h archive policy doc + 4h orchestrator integration + 4h smoke + cross-checks).
- **Hard stop:** 48 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (lifecycle YAML + backfill + nightly health check).
  2. Steps 3-5 (quarterly review template + archive policy + redirects).
  3. Steps 6-8 (orchestrator integration + smoke + commits + INDEX).