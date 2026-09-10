# 50 — Migration, SEO, Sitemap & Ongoing Operations

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** ops + SEO infrastructure. The final playbook; closes the loop.

---

## §0 — Front-matter

```yaml
playbook:      50
version:       1.0
status:        ready
wave:          E
type:          ops-infrastructure
depends_on:    [01..49]   # all prior playbooks shipped or scaffolded
deliverables:
  scripts:
    - scripts/build_sitemap.py
    - scripts/audit_redirects.py
    - scripts/audit_broken_links.py
    - scripts/build_content_health.py
  files:
    - frontend/public/sitemap.xml
    - STATUS.md
    - docs/CONTENT-CADENCE.md
    - Makefile (root)
```

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **sitemap.xml** | XML file at `frontend/public/sitemap.xml` listing every canonical URL on the site; submitted to Google Search Console so Googlebot can discover all pages. |
| **`<urlset>`** | Root element of `sitemap.xml`; Google limits each sitemap to 50k URLs / ~50MB uncompressed. Split into a sitemap index if you exceed this. |
| **sitemap index** | A `sitemapindex.xml` file that references multiple child sitemaps; used when the total URL count exceeds one file's 50k limit. |
| **redirect inventory** | Consolidated mapping of every source slug → canonical app URL. Lives in `frontend/lib/redirects-inventory.ts` and is used by both Next.js and the redirect auditor. |
| **redirect chain** | A → B → C where A redirects to B and B redirects to C. Chains consume a second HTTP round-trip and dilute PageRank. All chains must be collapsed to A → C. |
| **`altSlugs`** | Field in `_index.json` listing variant URL slugs that 301 to the canonical `seoSlug`. Each altSlug must be a redirect source, not a 200 endpoint. |
| **`seoSlug`** | The primary canonical URL slug for a domain; e.g. `"java-interview-questions-for-experienced"` → `/java-interview-questions-for-experienced`. |
| **broken-link auditor** | `scripts/audit_broken_links.py` — scans all `complete-qa.json` files for internal `/interview/*` links that don't correspond to a valid domain/module/topic path. |
| **content health dashboard** | `STATUS.md` + `content/_audits/content-health-<DATE>.json` — per-domain Q count vs target, speakable ratios, difficulty mix, and last write date. |
| **content freshness cadence** | Schedule in `docs/CONTENT-CADENCE.md` defining how often each content category must be reviewed (quarterly, monthly, yearly). |
| **`Makefile`** | Root-level build file with targets `sitemap`, `audit-redirects`, `audit-links`, `content-health`, `all-audits` for local + CI runs. |
| **`STATUS.md`** | Human-readable content health table at the repo root; updated on every `make content-health` run. |
| **orphan question** | A question in a `complete-qa.json` with no cross-links in or out and no `company_tags`; flagged by content health script as a potential dead-end. |
| **stale answer** | A question where `last_updated` is more than N days old AND the topic is in a fast-moving category (e.g. LLM / cloud pricing); flagged for review, not auto-deleted. |
| **CI hook** | GitHub Actions (or equivalent) job that runs `make all-audits` on every PR; fails the build on FAIL from redirect auditor, broken-link auditor, or global speakable fail > 0. |
| **`content/_audits/`** | Directory for snapshot outputs: sitemap URL count files, content health JSON, speakable reports. Not committed unless the PR explicitly includes an audit run. |

---

## §1 — TL;DR

- **Input:** All 49 playbooks before this one have shipped (or are
  shipping in parallel).
- **Action:** Wire up the ongoing-ops surface — sitemap generation,
  redirect inventory, broken-link auditor, dashboards for content
  health, content-freshness cadence — so the empire stays correct as it
  grows.
- **Output:** The site has a generated `sitemap.xml` covering every
  canonical URL; a `redirects.json` consolidated table; a
  `content-health.json` snapshot run weekly; a `STATUS.md` dashboard at
  the repo root.

## Why this matters (2 sentences)

Operations is the **forever-cost of growth** — sitemaps, redirects,
broken-link checks, content health dashboards. Without this playbook,
every new domain launch silently introduces dead links, sitemap holes,
or stale redirects that compound into ranking decay; with it, the
expansion is self-monitoring and an AI agent can confidently launch a
new domain knowing the ops checks will catch regressions.

## Current state

- Sitemap generator may not exist or is partial.
- Redirect map is scattered between `frontend/proxy.ts` entries and
  ad-hoc `next.config.js` rules.
- No broken-link auditor in CI.
- No content-health dashboard.

## Target state (measurable)

- Sitemap regenerates from a single source of truth (locked domains +
  hubs + interview hub).
- Single consolidated redirect file.
- Broken-link auditor runs nightly + on PR.
- Content-health dashboard surfaces: orphan questions, stale answers
  (no edits in N days), low-speakable-score Qs, missing seo fields.
- Ops scripts wired into `Makefile` or `package.json` scripts.

## Hard prerequisites

- [ ] All locked domains are live or scaffolded (their `_index.json`
      files exist).
- [ ] All hub flags are flipped to their intended state.

## Step 1 — Generate the sitemap

Add `scripts/build_sitemap.py`:

```python
#!/usr/bin/env python3
"""Generate sitemap.xml from every canonical URL on the site.

Walks:
  - content/<domain>/_index.json (locked domains)
  - content/<domain>/<module>/<topic>/complete-qa.json
  - expansion-plan/_hubs/*.json   (hub URL inventories)
  - content/companies/<slug>/profile.json
  - content/dsa/<pattern>/<problem>/complete-qa.json

Writes:
  - frontend/public/sitemap.xml
  - content/_audits/sitemap-urlcount-<DATE>.txt
"""

from __future__ import annotations
import json
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT  = REPO / "frontend" / "public" / "sitemap.xml"
BASE = "https://interviewexplainer.com"  # adjust if needed

def discover_urls() -> list[str]:
    urls: list[str] = [BASE + "/"]
    # locked domains
    for idx in (REPO / "content").glob("*/_index.json"):
        domain = idx.parent.name
        data   = json.loads(idx.read_text())
        seo    = data.get("seoSlug")
        if seo:
            urls.append(f"{BASE}/{seo}")
        urls.append(f"{BASE}/interview/{domain}")
        for mod in data.get("modules", []):
            slug = mod.get("moduleSlug")
            if slug:
                urls.append(f"{BASE}/interview/{domain}/{slug}")
                for topic in mod.get("topics", []) or []:
                    if isinstance(topic, dict): topic = topic.get("topicSlug")
                    if topic:
                        urls.append(f"{BASE}/interview/{domain}/{slug}/{topic}")
    # hubs (paste hub URL lists per playbook 41/42/43/44/45/46/47/48)
    hub_inventory = REPO / "expansion-plan" / "_hubs" / "url-inventory.json"
    if hub_inventory.exists():
        for u in json.loads(hub_inventory.read_text()):
            urls.append(f"{BASE}{u}")
    # de-dupe + sort
    return sorted(set(urls))

def main() -> int:
    urls = discover_urls()
    today = date.today().isoformat()
    lines = ["<?xml version='1.0' encoding='UTF-8'?>",
             "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>"]
    for u in urls:
        lines += ["  <url>",
                  f"    <loc>{u}</loc>",
                  f"    <lastmod>{today}</lastmod>",
                  "  </url>"]
    lines.append("</urlset>")
    OUT.write_text("\n".join(lines))
    counter = REPO / "content" / "_audits" / f"sitemap-urlcount-{today}.txt"
    counter.write_text(f"{len(urls)} URLs\n")
    print(f"Wrote {OUT} with {len(urls)} URLs.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

Make executable + run:

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
chmod +x scripts/build_sitemap.py
python3 scripts/build_sitemap.py
head frontend/public/sitemap.xml
```

Expected output: file exists; URL count ≥ 5000 once all empires shipped.

## Step 2 — Consolidate redirects

Build `frontend/lib/redirects-inventory.ts` by reading every
`_index.json`'s `seoSlug` + `altSlugs` and listing canonical → app
mappings.

Add `scripts/audit_redirects.py`:

```python
#!/usr/bin/env python3
"""Audit redirect chains: every altSlug must point at a 200 destination,
not at another redirect."""
import json, sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

def main() -> int:
    sources = set()
    targets = set()
    for idx in (REPO / "content").glob("*/_index.json"):
        d = json.loads(idx.read_text())
        domain = idx.parent.name
        app_url = f"/interview/{domain}"
        targets.add(app_url)
        for s in [d.get("seoSlug")] + (d.get("altSlugs") or []):
            if s:
                sources.add(f"/{s}")
    overlap = sources & targets
    if overlap:
        print(f"FAIL: source URL also a target: {overlap}", file=sys.stderr)
        return 1
    print(f"OK: {len(sources)} redirect sources, {len(targets)} app targets, no chains.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

Run:

```bash
python3 scripts/audit_redirects.py
```

Expected: `OK: <N> redirect sources, <M> app targets, no chains.`

## Step 3 — Broken-link auditor

`scripts/audit_broken_links.py` (skeleton):

```python
#!/usr/bin/env python3
"""Find dead /interview/* links inside content/ JSON files."""
import json, re, sys
from pathlib import Path
REPO = Path(__file__).resolve().parents[1]

# Build the set of valid app URLs from each domain's _index.json + topics.
def valid_app_urls() -> set[str]:
    urls: set[str] = set()
    for idx in (REPO / "content").glob("*/_index.json"):
        d = json.loads(idx.read_text())
        dom = idx.parent.name
        urls.add(f"/interview/{dom}")
        for m in d.get("modules", []):
            s = m.get("moduleSlug")
            if s: urls.add(f"/interview/{dom}/{s}")
            for t in m.get("topics", []) or []:
                if isinstance(t, dict): t = t.get("topicSlug")
                if t and s: urls.add(f"/interview/{dom}/{s}/{t}")
    return urls

LINK_RE = re.compile(r"/interview/[a-z0-9\-/]+")

def main() -> int:
    valid = valid_app_urls()
    bad: list[tuple[Path, str]] = []
    for cq in (REPO / "content").rglob("complete-qa.json"):
        text = cq.read_text()
        for link in LINK_RE.findall(text):
            if link.rstrip("/") not in valid:
                bad.append((cq, link))
    if bad:
        for f, link in bad[:50]:
            print(f"DEAD: {f}: {link}")
        print(f"\n{len(bad)} dead links")
        return 1
    print("OK: no dead /interview/* links")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

## Step 4 — Content health dashboard

`scripts/build_content_health.py` aggregates:
- Per-domain question count vs target
- Per-domain speakable pass/warn/fail ratios
- Per-domain difficulty mix
- Last-content-write date per domain

Writes:
- `content/_audits/content-health-<DATE>.json`
- `STATUS.md` at repo root (human-readable summary)

`STATUS.md` template:

```markdown
# Content health — <YYYY-MM-DD>

| Domain                          | Q count | Target | Speakable pass+warn | Last write |
| ------------------------------- | ------- | ------ | ------------------- | ---------- |
| java-backend-intermediate       | 5832    | 5800   | 94 %                | 2026-05-28 |
| java-backend-beginner           |  410    |  400   | 92 %                | 2026-05-27 |
| ...                             | ...     | ...    | ...                 | ...        |
```

## Step 5 — Cadence

Define a content-freshness cadence:

| Domain category              | Refresh cadence                                      |
| ---------------------------- | ---------------------------------------------------- |
| Locked domain landing intros | Quarterly                                            |
| Per-module top-10 Qs         | Quarterly speakable re-lint + content sanity check    |
| LLM / RAG / agents content   | Monthly (ecosystem moves fastest)                     |
| Cloud cost / pricing answers | Quarterly                                            |
| Behavioral stories           | Yearly                                                |
| Cheatsheets                  | Quarterly                                            |
| Roadmaps                     | Yearly                                                |

Capture this table in `docs/CONTENT-CADENCE.md` and reference it from
`STATUS.md`.

## Step 6 — Wire the scripts into ops

Add to `package.json` (frontend) or a root `Makefile`:

```makefile
.PHONY: sitemap audit-redirects audit-links content-health all-audits

sitemap:
	python3 scripts/build_sitemap.py

audit-redirects:
	python3 scripts/audit_redirects.py

audit-links:
	python3 scripts/audit_broken_links.py

content-health:
	python3 scripts/build_content_health.py

all-audits: audit-redirects audit-links content-health sitemap
	@echo "All audits complete."
```

Run from repo root: `make all-audits`.

## Step 7 — Optional CI hook

If you run CI (GitHub Actions etc.), add a job that runs `make all-audits`
on every PR. Fail the build on:
- Any FAIL from `audit_redirects.py`
- Any FAIL from `audit_broken_links.py`
- Speakable global `fail > 0`

## Quality gates

| Gate                                                  | Threshold                      | Verify with                                                              |
| ----------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `frontend/public/sitemap.xml` exists                  | yes                            | ls                                                                       |
| Sitemap URL count                                     | ≥ 5000 (when all empires shipped) | wc                                                                    |
| `audit_redirects.py` passes                            | OK                             | exit code 0                                                              |
| `audit_broken_links.py` passes                         | OK                             | exit code 0                                                              |
| `STATUS.md` exists with per-domain rows               | yes                            | grep                                                                     |
| `docs/CONTENT-CADENCE.md` exists                       | yes                            | ls                                                                       |

## Failure modes & rollback

- **Sitemap explodes past 50k URLs:** split into sitemap index +
  per-domain sitemaps. Google's limit is 50k per sitemap, ~50MB
  uncompressed.
- **Redirect chain (A → B → C)** introduced by accident: collapse
  to A → C; chains hurt SEO.
- **Broken-link auditor reports false positives** for in-page anchor
  links: tune the auditor to skip `#`-only anchors.
- **Content-health dashboard tags > 10 % of Q's as "stale":** investigate
  before mass-rewriting; "stale" by date alone isn't sufficient signal.
- **Rollback:** ops scripts are idempotent; rolling back means
  re-running the previous version of the script. The sitemap is
  rebuilt fresh on every run.

## Definition of Done

- [ ] 4 ops scripts checked in.
- [ ] `frontend/public/sitemap.xml` generated.
- [ ] `STATUS.md` populated at the repo root.
- [ ] `docs/CONTENT-CADENCE.md` committed.
- [ ] `Makefile` (or `package.json` scripts) carries `make all-audits`.
- [ ] CI hook configured (or recorded as a follow-up if CI isn't ready).
- [ ] `00-INDEX.md` row for `50` flipped to `DONE`.

## Estimated effort

- **Ideal:** 24 hours.
- **Hard stop:** 40 hours.
