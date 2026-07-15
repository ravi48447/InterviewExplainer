# 46 — Roadmaps, Cheatsheets, Tools, Compare Hubs

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** four small hubs flipped together; each is a small content
> set on top of existing locked-domain data.
> **Depends on:** 28 (JFI launch), 35 (PBI launch), 21 (JBB), 23 (JBA),
> 41 (interview-qa hub for the compare auto-extraction).

---

## §0 — Front-matter

```yaml
playbook:      46
version:       1.0
status:        ready
wave:          E
type:          hub-infrastructure
hubs:
  - roadmaps
  - cheatsheets
  - tools
  - compare
depends_on:    [28, 35, 21, 23, 41]
flags:
  - ENABLED_HUBS.roadmaps
  - ENABLED_HUBS.cheatsheets
  - ENABLED_HUBS.tools
  - ENABLED_HUBS.compare
deliverables:
  roadmap_pages: 6
  cheatsheet_pages: 10
  tool_pages: 6
  compare_pages: 12
```

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **hub** | A top-level section of the site (`/roadmaps`, `/cheatsheets`, `/tools`, `/compare`) that aggregates or re-publishes content from locked domains at a different URL structure. |
| **ENABLED_HUBS** | Feature-flag map in `frontend/lib/launch-config.ts`; each key is a hub slug, each value is `boolean`. A hub with `false` returns 404 on all its routes. |
| **roadmap** | A curated long-form document (~2500 words) describing a sequenced study plan with milestones, exit criteria, and cross-links into domain content. |
| **cheatsheet** | A dense reference page (≥ 1500 words, ≥ 5 tables, ≥ 8 code snippets) for a specific technical topic; scannable, no tutorial prose. |
| **tool** | A client-side React component that provides an interactive utility (JWT decoder, cron builder, etc.) with no backend calls. |
| **compare page** | A programmatically generated page at `/compare/<a>-vs-<b>` that re-publishes an existing archetype-B question from a locked domain at a canonical comparison URL. |
| **archetype-B question** | A comparison question (see pillar system glossary) — "Use X when …; use Y when …" format; the source for all compare pages. |
| **HubFilter** | TypeScript type (defined in playbook 41) that describes a set of questions by domain, module, difficulty, language, or pillar. Compare hub uses it to locate source Qs. |
| **`content/hubs/`** | Directory for long-form hub content (roadmaps, cheatsheets) that does NOT live in `complete-qa.json`. Rendered via the markdown pipeline. |
| **`TechArticle` JSON-LD** | Structured data type applied to cheatsheet pages to signal to search engines that the page is a reference article. |
| **`SoftwareApplication` JSON-LD** | Structured data type applied to tool pages. |
| **LCP (Largest Contentful Paint)** | Core Web Vitals metric; tool pages must meet ≤ 1 s LCP threshold. |
| **print CSS** | Stylesheet rules that clean up a cheatsheet for printing or PDF export; triggered by `@media print`. |
| **sitemap section** | A `<urlset>` group of URLs in `sitemap.xml`; hub pages must appear in the sitemap for Google indexing. |

---

## §1 — TL;DR

- **Goal:** Light-weight content hubs that surface high-CTR content
  formats: **roadmaps** (study plans), **cheatsheets** (scannable
  reference), **tools** (interactive utilities), **compare** (X vs Y
  programmatic pages).
- **Action:** Build each hub on top of existing locked-domain content
  and the canonical comparison Q list; no new domains, no new pillars.
- **Output:** Four hub URLs live, each with curated content meeting
  the gates below.

## Hard prerequisites

- [ ] At least JBI + PBI live so roadmaps and cheatsheets can link to
      depth.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.roadmaps`,
      `cheatsheets`, `tools`, `compare` (add if missing; default
      `false` each).
- [ ] Playbook 41 (Interview Q&A hub) is DONE — the `compare` hub
      auto-extracts from its archetype-B questions.

## Why this matters (2 sentences)

These four hubs **multiply organic surface area cheaply** — each is a
small content set (6-12 pages) but each targets a separate, ranking-friendly
content format (study plan → "java roadmap", cheatsheet → "java
collections cheatsheet pdf", tool → "jwt decoder", compare → "kafka
vs rabbitmq"). Cheatsheets specifically are **dwell-time gold** —
they keep users on the page 4-6x longer than a single-question page,
which compounds into ranking lift across the rest of the site.

## Search phrases to own

| Hub          | Search phrase                                          | Target page                                |
| ------------ | ------------------------------------------------------ | ------------------------------------------ |
| Roadmaps     | `java backend roadmap`                                 | `/roadmaps/java-backend-3-year`            |
| Roadmaps     | `python backend roadmap`                               | `/roadmaps/python-backend-3-year`          |
| Roadmaps     | `how to become a staff engineer`                       | `/roadmaps/staff-engineer-12-month`        |
| Roadmaps     | `ml engineer roadmap`                                  | `/roadmaps/ml-engineer-from-scratch`       |
| Roadmaps     | `data engineer roadmap`                                | `/roadmaps/data-engineer-from-scratch`     |
| Roadmaps     | `fullstack developer roadmap`                          | `/roadmaps/fullstack-from-scratch`         |
| Cheatsheets  | `java collections cheatsheet`                          | `/cheatsheets/java-collections-cheatsheet` |
| Cheatsheets  | `spring boot annotations cheatsheet`                   | `/cheatsheets/spring-boot-annotations-cheatsheet` |
| Cheatsheets  | `python iterators generators cheatsheet`               | `/cheatsheets/python-iterators-and-generators-cheatsheet` |
| Cheatsheets  | `sql joins cheatsheet`                                 | `/cheatsheets/sql-joins-cheatsheet`        |
| Cheatsheets  | `http status codes cheatsheet`                         | `/cheatsheets/http-status-codes-cheatsheet`|
| Cheatsheets  | `kubectl cheatsheet`                                   | `/cheatsheets/kubernetes-kubectl-cheatsheet` |
| Tools        | `jwt decoder online`                                   | `/tools/jwt-decoder`                       |
| Tools        | `cron expression builder`                              | `/tools/cron-builder`                      |
| Tools        | `regex tester`                                         | `/tools/regex-tester`                      |
| Tools        | `uuid generator`                                       | `/tools/uuid-generator`                    |
| Compare      | `spring boot vs django`                                | `/compare/spring-boot-vs-django`           |
| Compare      | `fastapi vs django`                                    | `/compare/fastapi-vs-django`               |
| Compare      | `pytorch vs tensorflow`                                | `/compare/pytorch-vs-tensorflow`           |
| Compare      | `kafka vs rabbitmq`                                    | `/compare/kafka-vs-rabbitmq`               |
| Compare      | `postgresql vs mongodb`                                | `/compare/postgresql-vs-mongodb`           |
| Compare      | `airflow vs prefect vs dagster`                        | `/compare/airflow-vs-prefect-vs-dagster`   |

## Current state

- No `/roadmaps`, `/cheatsheets`, `/tools`, `/compare` routes today.
- Comparison answers DO exist as archetype-B questions across many
  modules — `compare` hub re-publishes them at canonical URLs.
- Tools that exist (if any) may be scattered or unpolished — audit
  before reuse.

## Target state (measurable)

- **Roadmaps:** 6 pages live, each with ≥ 8 milestones and ≥ 30
  cross-links into module content.
- **Cheatsheets:** 10 pages live, each ≥ 1500 words, dense tables /
  snippets / no fluff.
- **Tools:** 6 client-side React utilities live; each loads in ≤ 1 s
  and handles edge cases without backend calls.
- **Compare:** ≥ 12 comparison pages live, auto-generated from
  archetype-B questions.

## Hub specs

### 46.1 — `/roadmaps`

Curated 6 roadmap pages, each is one long markdown document with a
sequenced milestone list:

| Slug                                  | Length target | Persona                           |
| ------------------------------------- | ------------- | --------------------------------- |
| `roadmaps/java-backend-3-year`        | 2,500 words   | grad → mid → senior in 3 years    |
| `roadmaps/python-backend-3-year`      | 2,500 words   | grad → mid → senior in 3 years    |
| `roadmaps/staff-engineer-12-month`    | 3,000 words   | senior IC → staff in 12 months    |
| `roadmaps/ml-engineer-from-scratch`   | 3,000 words   | data scientist → MLE              |
| `roadmaps/data-engineer-from-scratch` | 2,500 words   | SWE → DE pivot                    |
| `roadmaps/fullstack-from-scratch`     | 2,500 words   | BE-only → fullstack pivot         |

Each page structure:

1. **Who this roadmap is for** (200 words)
2. **Milestones (≥ 8 numbered)** — each with: exit criteria, recommended
   reading from JBI / PBI / hubs, sample interview questions.
3. **Common mistakes** (5 bullets)
4. **Where to go next** (cross-links to other roadmaps + hubs)

### 46.2 — `/cheatsheets`

10 cheatsheet pages — short, scannable, dense tables, no prose:

| Slug                                                     | Topic                           |
| -------------------------------------------------------- | ------------------------------- |
| `cheatsheets/java-collections-cheatsheet`                | List/Set/Map + Big-O            |
| `cheatsheets/spring-boot-annotations-cheatsheet`         | Every Spring annotation         |
| `cheatsheets/python-iterators-and-generators-cheatsheet` | iter, gen, yield, asend         |
| `cheatsheets/sql-joins-cheatsheet`                       | All join types with diagrams    |
| `cheatsheets/http-status-codes-cheatsheet`               | 1xx-5xx + use cases             |
| `cheatsheets/git-commands-cheatsheet`                    | Common git + recovery flows     |
| `cheatsheets/kubernetes-kubectl-cheatsheet`              | kubectl + manifest patterns     |
| `cheatsheets/docker-cli-cheatsheet`                      | docker + compose CLI            |
| `cheatsheets/regex-cheatsheet`                           | Common patterns + lookarounds   |
| `cheatsheets/pytest-cheatsheet`                          | Fixtures, marks, parametrize    |

Each cheatsheet rule of thumb:

- **≥ 1500 words** (SEO floor for ranking on cheatsheet queries)
- ≥ 5 dense tables / reference blocks
- ≥ 8 copy-paste snippets
- **No tutorial-style narration** — this is reference, not a blog
- "Printable PDF" link (generates a clean print-CSS view)

### 46.3 — `/tools`

6 small interactive utilities, all client-side React (no backend):

| Slug                              | Behaviour                                                       |
| --------------------------------- | --------------------------------------------------------------- |
| `tools/jwt-decoder`               | Decode header + payload; warn on `none` algorithm                |
| `tools/cron-builder`              | Build & validate cron; show next 5 runs                         |
| `tools/regex-tester`              | Live match; capture groups; flag toggles                        |
| `tools/uuid-generator`            | v1/v4/v7 toggle; batch generate                                  |
| `tools/base64-encoder`            | Encode/decode; URL-safe toggle                                   |
| `tools/jvm-options-builder`       | Pick GC + heap + flags; export as -Xms/-Xmx string               |

Each tool:

- Loads in ≤ 1 second (LCP).
- Works offline (no network calls).
- Has a "How does this work?" expand-link cross-linking the matching
  Q on the locked domain.

### 46.4 — `/compare`

Programmatic comparison pages — `compare/<a>-vs-<b>` — auto-generated
from archetype-B questions in the locked domains. The hub does NOT
write new comparisons; it surfaces existing ones at canonical URLs.

Launch list (≥ 12; auto-extracted from existing money-comparison
questions across JBI / PBI / PML / PDE):

| Slug                                  | Source Q (domain/module/topic)                                                |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `compare/spring-boot-vs-django`       | comparisons in JBI spring-boot + PBI django                                   |
| `compare/fastapi-vs-django`           | comparisons in PBI fastapi                                                    |
| `compare/pytorch-vs-tensorflow`       | comparisons in PML deep-learning-and-pytorch                                  |
| `compare/kafka-vs-rabbitmq`           | comparisons in JBI messaging-events                                           |
| `compare/postgresql-vs-mongodb`       | comparisons in JBI sql-databases                                               |
| `compare/redis-vs-memcached`          | comparisons in JBI redis-caching                                              |
| `compare/airflow-vs-prefect-vs-dagster`| comparisons in PDE workflow-orchestration                                    |
| `compare/g1-vs-zgc-vs-parallel`       | comparisons in JBI jvm-internals                                              |
| `compare/synchronized-vs-reentrantlock`| comparisons in JBI java-concurrency                                          |
| `compare/asyncio-vs-celery-vs-threads`| comparisons in PBI async-and-concurrency-python                               |
| `compare/rest-vs-graphql-vs-grpc`     | comparisons in JBI rest-api / graphql / grpc                                  |
| `compare/optimistic-vs-pessimistic-locking` | comparisons in JBI sql-databases                                       |

## Step 1 — Add hubs registry

`frontend/lib/hubs/roadmaps.ts`, `cheatsheets.ts`, `tools.ts`, `compare.ts`
— each exports a list of slugs + metadata. `compare.ts` walks
locked-domain content for archetype-B questions and auto-publishes
them at canonical URLs.

## Step 2 — Write content

For roadmaps (6) and cheatsheets (10): hand-write each markdown
document. These do NOT live in `complete-qa.json` — they're long-form
MD documents under `content/hubs/<hub>/<slug>.md` rendered via the
markdown pipeline.

For tools (6): build React components under `frontend/components/tools/`.

For compare (12+): auto-extract; no hand-writing in this playbook.

## Step 3 — Routes

```
frontend/app/roadmaps/page.tsx
frontend/app/roadmaps/[slug]/page.tsx

frontend/app/cheatsheets/page.tsx
frontend/app/cheatsheets/[slug]/page.tsx

frontend/app/tools/page.tsx
frontend/app/tools/[slug]/page.tsx

frontend/app/compare/page.tsx
frontend/app/compare/[slug]/page.tsx
```

## Step 4 — Flip flags

```typescript
// frontend/lib/launch-config.ts
ENABLED_HUBS: {
  ...,
  roadmaps:     true,
  cheatsheets:  true,
  tools:        true,
  compare:      true,
};
```

Commit per hub flip — 4 separate commits — so we can revert one without
the others.

## Step 5 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /roadmaps /roadmaps/java-backend-3-year /roadmaps/ml-engineer-from-scratch \
  /cheatsheets /cheatsheets/java-collections-cheatsheet /cheatsheets/sql-joins-cheatsheet \
  /tools /tools/jwt-decoder /tools/cron-builder \
  /compare /compare/kafka-vs-rabbitmq /compare/pytorch-vs-tensorflow; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200`.

## Files and code to touch

| Path                                                  | Change                          |
| ----------------------------------------------------- | ------------------------------- |
| `frontend/lib/launch-config.ts`                       | 4 new flags                     |
| `frontend/lib/hubs/roadmaps.ts`                       | NEW                             |
| `frontend/lib/hubs/cheatsheets.ts`                    | NEW                             |
| `frontend/lib/hubs/tools.ts`                          | NEW                             |
| `frontend/lib/hubs/compare.ts`                        | NEW — auto-extract from arch B  |
| `content/hubs/roadmaps/<slug>.md` × 6                 | NEW                             |
| `content/hubs/cheatsheets/<slug>.md` × 10             | NEW                             |
| `frontend/components/tools/*.tsx` × 6                 | NEW                             |
| `frontend/app/{roadmaps,cheatsheets,tools,compare}/`  | NEW route folders               |
| `scripts/build_sitemap.ts`                            | enumerate ~34 hub URLs          |
| `frontend/components/Header.tsx`                      | add 4 nav links                 |

## Content rules

- **Roadmaps:** narrative + sequenced milestones, ≥ 30 cross-links to
  module pages. NOT a long blog.
- **Cheatsheets:** reference, no tutorial voice. Tables and snippets only.
- **Tools:** client-side, offline-capable, ≤ 1 s LCP.
- **Compare:** strictly auto-generated from archetype-B questions. Do
  not hand-write parallel content.

## SEO and URLs

- Each hub has its own sitemap section.
- `/compare/<a>-vs-<b>` canonical points at itself. Reverse
  (`/compare/<b>-vs-<a>`) 301s to canonical (or doesn't exist).
- Cheatsheets emit `TechArticle` JSON-LD.
- Tools emit `SoftwareApplication` JSON-LD.

## Quality gates

| Gate                                          | Threshold     | Verify with                                                              |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| 6 roadmap pages live                          | 6 of 6        | smoke loop                                                                |
| Each roadmap ≥ 2500 words                     | 6 of 6        | `wc -w content/hubs/roadmaps/*.md`                                       |
| 10 cheatsheet pages live, ≥ 1500 words each   | 10 of 10      | `wc -w content/hubs/cheatsheets/*.md`                                    |
| 6 tools pages live, ≤ 1 s LCP                 | 6 of 6        | Lighthouse on each                                                        |
| ≥ 12 compare pages live                       | ≥ 12          | `compare.ts` output                                                       |
| All hub pages return 200                      | yes           | smoke loop                                                                |
| Sitemap includes all hub URLs                 | yes           | `grep -cE '/(roadmaps|cheatsheets|tools|compare)/' frontend/public/sitemap.xml` ≥ 34 |
| `npm run build` exit 0                        | 0             | build log                                                                  |

## Failure modes & rollback

- **A cheatsheet drifts under 1500 words:** SEO under-floor. Expand
  before ship.
- **Compare hub auto-extraction picks up < 12 comparisons:** archetype-B
  coverage is thin. Surface a count per source module; either add Qs
  upstream (playbook 12-17) or wait.
- **A tool calls the network** (against the offline rule): refactor
  out before launch.
- **A roadmap milestone links to a 404'd module:** add a runtime
  check; build fails on missing links.
- **Rollback (per hub):** flip the matching `ENABLED_HUBS` flag back
  to `false`. Each hub flips independently — you can roll back tools
  without touching cheatsheets.

## Definition of Done

- [ ] All 4 `ENABLED_HUBS` flags flipped (in 4 separate commits).
- [ ] All quality gates green.
- [ ] All hub URLs in sitemap.
- [ ] Header has 4 new nav entries.
- [ ] `00-INDEX.md` row for `46` flipped to `DONE`.

## Estimated effort

- **Ideal:** 50 hours (split: 12 h roadmaps + 18 h cheatsheets + 12 h
  tools + 8 h compare).
- **Hard stop:** 80 hours.
