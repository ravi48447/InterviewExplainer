# URL Registry & Reuse Playbook

> Single source of truth for every URL namespace the app publishes, how they
> relate to one another, and the exact recipe for adding a new track
> (e.g. `python-backend-intermediate`) or a dedicated frontend track
> (e.g. `react-intermediate`) without breaking existing URLs.

**Owner**: keep this file in lockstep with `frontend/lib/seo-slugs.ts`,
`frontend/lib/seo-pillars.ts`, `frontend/lib/content-reader.ts`,
`frontend/app/api/content/domain-stacks/route.ts`,
`frontend/app/api/content/stack-structure/route.ts`, and `frontend/proxy.ts`.
Any new locked domain or pillar hub PR must touch this doc.

---

## 1. URL namespaces at a glance

The app exposes **three parallel URL systems**, each with a distinct job:

| # | Namespace            | Shape                                           | Purpose                                       | Example                                                                 |
|---|----------------------|-------------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------------|
| 1 | **App (study path)** | `/{domainSlug}/{moduleSlug}/{questionSlug?}`    | In-app curriculum navigation (logged-in UX)   | `/java-backend-intermediate/spring-boot/autoconfiguration-vs-configuration` |
| 2 | **SEO (canonical)**  | `/{seoSlug}`                                    | Google-indexable canonical module pages       | `/spring-boot-interview-questions`                                      |
| 3 | **Pillar hub**       | `/{pillarSlug}`                                 | Topical SEO aggregator (cross-module)         | `/spring`, `/system-design`, `/devops`                                  |

Plus four **standalone hubs** (not pillar-hub-backed, they have their own
content tree and page tree):

| Hub             | Root          | Backing content                   |
|-----------------|---------------|-----------------------------------|
| DSA Problems    | `/dsa`        | `content/dsa/` (~450 problems)    |
| Companies       | `/companies`  | `content/companies/`              |
| Topics Explorer | `/topics`     | derived from module content       |
| Tools           | `/tools`      | docs-style content                |

Plus app-only namespaces (not Google-indexed as a track):
`/interview`, `/compare`, `/search`, `/dashboard`, `/mock-interviews`,
`/domains`, `/login`, `/signup`, `/profile`, `/prep`, `/about`, `/support`,
`/privacy`, `/terms`, `/cookies`.

**Canonicalization rule**: if a module lives in two tracks (e.g. reused
via `contentSource`), only the *source* track exposes an SEO URL. See §5.

---

## 2. Current live tracks (locked domains)

A "locked domain" is a content tree whose curriculum order is driven by
its own `_index.json`. Only locked domains participate in the SEO URL /
pillar hub systems.

| Domain slug                     | App root                              | Authoritative content path                      | Reuse                                   |
|---------------------------------|---------------------------------------|-------------------------------------------------|-----------------------------------------|
| `java-backend-intermediate`     | `/java-backend-intermediate`          | `content/java-backend-intermediate/`            | — (source of truth)                     |
| `java-fullstack-intermediate`   | `/java-fullstack-intermediate`        | `content/java-fullstack-intermediate/`          | Reuses JBI for backend modules via `contentSource`, owns its own frontend modules |

Both tracks are surfaced on the home page tile grid
(`frontend/app/page.tsx`) and on `/domains`.

**Legacy (pre-locked-domain) namespaces** still served for backwards
compatibility, but not the target for new content:
`/interview/*`, `/domains/*`, `content/domains/*`, `content/interview/*`.

---

## 3. Pillar hubs (registered)

Registered in `frontend/lib/seo-pillars.ts` → `PILLAR_HUBS[]`. Each renders
at `/{pillarSlug}` (browser URL) and is served by
`frontend/app/prep/[pillarSlug]/page.tsx` via internal rewrite.

As of the current revision, 13 pillar hubs are live:

| Pillar slug                   | Title                                                     | Lead modules                                                           |
|-------------------------------|-----------------------------------------------------------|------------------------------------------------------------------------|
| `/java`                       | Java Language & Core Interview Prep                       | core-java, java-collections, java-streams, java-concurrency, jvm-internals |
| `/system-design`              | System Design Interview Prep                              | system-design, system-design-cases                                     |
| `/low-level-design`           | Low-Level Design (LLD) Interview Prep                     | low-level-design, design-patterns                                      |
| `/architecture-design`        | Software Architecture & Design Patterns Interview Prep    | design-patterns, architecture-patterns                                 |
| `/spring`                     | Spring Ecosystem Interview Prep                           | spring-core, spring-boot, spring-data-jpa, spring-security, spring-webflux, spring-batch |
| `/microservices-architecture` | Microservices & APIs Interview Prep                       | rest-api, microservices, messaging-events                              |
| `/data-persistence`           | Databases & Caching Interview Prep                        | sql-databases, nosql-mongodb, redis-caching                            |
| `/devops`                     | DevOps Interview Prep                                     | git-build-tools, cicd, docker, kubernetes                              |
| `/java-testing`               | Java Testing Interview Prep                               | unit-testing, advanced-testing                                         |
| `/cloud`                      | Cloud Interview Prep                                      | aws-cloud, cloud-native                                                |
| `/sre`                        | SRE & Production Engineering Interview Prep               | observability, production-sre                                          |
| `/behavioral`                 | Behavioral & Engineering Excellence Interview Prep        | behavioral, engineering-practices                                      |
| `/security`                   | Application Security Interview Prep                       | application-security, spring-security                                  |

A pillar hub can list modules from any locked domain — the registry is
domain-agnostic. Modules absent from `SEO_MODULES` are silently skipped.

---

## 4. Module SEO slugs

Per-module canonical URLs are **auto-derived** from each locked domain's
`_index.json` at module-load time in `frontend/lib/seo-slugs.ts` →
`SEO_MODULES`. Adding or renaming a module only requires editing its
`_index.json` entry:

```jsonc
{
  "moduleNumber": "M03",
  "pillar": "P02",
  "pillarName": "Spring Ecosystem",
  "moduleSlug": "spring-boot",
  "title": "Spring Boot",
  "seoSlug": "spring-boot-interview-questions",
  "altSlugs": ["spring-boot-questions"]  // 301 → canonical
}
```

Rules enforced by `buildEntries()`:

1. Modules with `contentSource` are **skipped** from `SEO_MODULES`. The
   reusing track shares the source track's canonical URL — preventing
   duplicate-content indexing across `/spring-boot-interview-questions`
   vs. a hypothetical `/spring-boot-fullstack-interview-questions`.
2. `altSlugs[]` entries 301 → `seoSlug` via `proxy.ts`.
3. `seoSlug` must be globally unique across all tracks.

To see the full live list, run from `frontend/`:

```bash
node -e "const m = require('./lib/seo-slugs').SEO_MODULES; console.table(m.map(x => ({ seoSlug: '/' + x.seoSlug, domain: x.domainSlug, module: x.moduleSlug })));"
```

---

## 5. Content reuse pattern (`contentSource`)

A module in track `B` can transparently serve another track `A`'s content
without physically duplicating JSON files:

```jsonc
// content/java-fullstack-intermediate/_index.json
{
  "moduleNumber": "M06",
  "moduleSlug": "spring-boot",
  "title": "Spring Boot",
  "pillar": "P02",
  "pillarName": "Spring Ecosystem",
  "contentSource": {
    "domain": "java-backend-intermediate",
    "moduleSlug": "spring-boot"
  }
  // NOTE: no seoSlug when contentSource is set — SEO_MODULES skips this entry.
}
```

At runtime, `content-reader.ts` resolves the module directory by walking
`contentSource` across locked domains, so any API that reads module or
question content serves the source's `complete-qa.json` under the
reusing track's **App URL** (`/java-fullstack-intermediate/spring-boot/*`)
while the **SEO URL** remains the source's
(`/spring-boot-interview-questions`).

**When to use `contentSource`** (same-language, cross-track reuse):

- Java Backend → Java Fullstack (current): backend modules reuse JBI.
- Java Backend → future Java Advanced track: reuse foundational modules.

**When NOT to use `contentSource`** (cross-language reuse):

- Java → Python: collections/generics examples are language-specific.
  Create a sibling module in the new track (e.g. `python-collections`)
  with Python-idiomatic content and keep the Java original untouched.
- Language-specific syntax answers (HashMap internals, Stream API, etc.)
  cannot be shared. Only the *topic taxonomy* ports across languages.

**What DOES port across languages** (language-agnostic content):

- Data structures & algorithms (covered by the standalone `/dsa` hub).
- System design, LLD, microservices, behavioral, engineering practices,
  cloud (AWS), DevOps (Docker/K8s/Git), SRE, security concepts.
- A future Python/Node/Go track SHOULD `contentSource` these from JBI
  rather than duplicating them, unless the answer explicitly involves
  Java-specific tooling (JUnit, Spring, JVM, etc.).

---

## 6. Reserved top-level slugs (can't use for new tracks)

From `frontend/proxy.ts` → `SKIP_PREFIXES`, plus `PILLAR_HUB_SLUGS`:

```
/api  /_next  /favicon  /robots  /sitemap  /not-found  /error  /loading
/dsa  /tools  /topics  /compare  /companies
/dashboard  /login  /signup  /profile  /domains  /search
/mock-interviews  /about  /support  /privacy  /terms  /cookies
/prep  /interview

# Plus all pillar hub slugs (see §3):
/java  /system-design  /low-level-design  /architecture-design  /spring
/microservices-architecture  /data-persistence  /devops  /java-testing
/cloud  /sre  /behavioral  /security
```

New domain slugs must take the shape `{lang}-{track}-{level}` with ≥ 3
hyphen-separated parts (enforced by `parseDomainSlug()` in `proxy.ts`).
Reserved top-levels above are *fine* to parse as `{lang}` never matches
them (no collision in practice), but **never name a top-level hub or
pillar** with one of the reserved slugs.

---

## 7. Recipe — adding a new locked domain track

Adding `python-backend-intermediate` (example). Every step is required;
the app won't lift the new track without all six touch-points.

### 7.1 Create the content tree

```
content/python-backend-intermediate/
├── _index.json                 # curriculum + module metadata
├── <moduleSlug>/
│   └── <topicSlug>/
│       └── complete-qa.json    # authoritative Q&A
└── …
```

The `_index.json` shape:

```jsonc
{
  "appRoot": "/python-backend-intermediate",
  "modules": [
    {
      "moduleNumber": "M01",
      "pillar": "P01",
      "pillarName": "Python Language & Core",
      "moduleSlug": "python-core",
      "title": "Python Language Essentials",
      "seoSlug": "python-interview-questions",
      "altSlugs": ["python-language-interview-questions"],
      "topics": [ /* … */ ]
    },
    // Reused module from a sibling track:
    {
      "moduleNumber": "M20",
      "pillar": "P05",
      "pillarName": "System Design",
      "moduleSlug": "system-design",
      "title": "System Design",
      "contentSource": {
        "domain": "java-backend-intermediate",
        "moduleSlug": "system-design"
      }
      // NO seoSlug — inherits /system-design-interview-questions from JBI.
    }
  ]
}
```

### 7.2 Register in 5 code files

| File                                                            | What to add                                                                 |
|-----------------------------------------------------------------|-----------------------------------------------------------------------------|
| `frontend/lib/seo-slugs.ts`                                     | `import pythonIndex from "../../content/python-backend-intermediate/_index.json"` + spread into `SEO_MODULES`. |
| `frontend/lib/content-reader.ts`                                | Add entry to `LOCKED_DOMAINS` map (domainSlug, rootDir, stackAliases — `{}` for greenfield). |
| `frontend/app/api/content/domain-stacks/route.ts`               | Add entry to `LOCKED_DOMAIN_ROOTS`.                                         |
| `frontend/app/api/content/stack-structure/route.ts`             | Add entry to `LOCKED_DOMAIN_CONFIGS`.                                       |
| `frontend/proxy.ts`                                             | Add `"python-backend-intermediate": {}` to `LEGACY_STACK_ALIASES` (empty unless migrating legacy URLs). |

### 7.3 Surface the new track

- **Home page tile**: add an entry to the tile grid in `frontend/app/page.tsx` (optional; user-controlled flag).
- **Site header**: add to the desktop/mobile nav in `frontend/components/site-header.tsx`.
- **Sitemap**: tracks are auto-picked up by `frontend/app/sitemap.ts` via `SEO_MODULES`; verify after first deploy.
- **Pillar hubs**: if the new track's modules should appear in a pillar hub (e.g. `/system-design`, `/devops`), add their `moduleSlug`s to the relevant `PILLAR_HUBS[].moduleSlugs` array.

### 7.4 Smoke test checklist

1. `npm run dev` and visit `/python-backend-intermediate` — track landing renders modules.
2. Visit an SEO slug you just authored (`/python-interview-questions`) — canonical page renders.
3. Visit a **reused** module via the new track (`/python-backend-intermediate/system-design`) — serves JBI content, breadcrumb stays in python track, `<link rel="canonical">` points to `/system-design-interview-questions`.
4. `curl /sitemap.xml | grep python` — new SEO slugs listed.

---

## 8. Recipe — adding a new pillar hub

Pillar hubs are pure SEO surfaces — no content files needed, only a
registry entry.

1. Pick a unique, short `pillarSlug` that:
   - Is NOT in §6's reserved list.
   - Is NOT a `seoSlug` or `altSlug` in `SEO_MODULES`.
   - Has search intent (Google "<topic> interview questions" first).
2. Append a new entry to `PILLAR_HUBS` in `frontend/lib/seo-pillars.ts`:
   - `pillarSlug`, `title`, `tagline`, `heroBlurb` (~40–60 words, hand-authored).
   - `moduleSlugs[]` — one or more live modules from ANY locked domain.
   - `metaDescription` (≤ 160 chars).
   - `relatedPillars[]` — cross-links to 2–3 sibling hubs.
3. `PILLAR_HUB_SLUGS` is derived — no other file change needed.
4. Update §3 of this doc with the new row.
5. Cross-link: add the new slug to at least 2 existing hubs' `relatedPillars`.

---

## 9. Recipe — shared pillar content reused across languages

Use-case: Java, Python, and TypeScript tracks all need "DSA & algorithms"
content. **Don't** duplicate — use the standalone `/dsa` hub.

Current state: `/dsa` is a fully built hub (`content/dsa/`, ~450 problems
by pattern) that is **language-agnostic** and serves multiple language
code tabs for each problem (Java, Python, JavaScript). It is the
canonical destination for DSA content on the site.

**Integration recipe for new language tracks:**

1. In your track's `_index.json`, author a *language-specific* collections
   module (e.g. `python-collections`) covering:
   - Language's native data structures (list, dict, set, tuple for Python).
   - Language-specific complexity characteristics (Python list vs. deque).
   - *Don't* redo sorting/searching/trees/DP — those go on `/dsa`.
2. On your collections module landing page, add a call-out linking to
   `/dsa` for the language-agnostic algorithm practice.
3. In the `/dsa` standalone hub, ensure the language tab for your new
   language is live (it already is for Java/Python/JavaScript).

There is **no** plan to create a pillar hub named `/dsa` — the slug is
reserved by the existing standalone hub. Pillar hubs that benefit from
cross-linking to `/dsa` (Java, System Design, LLD, Behavioral) should
add an external-hub callout in their page copy; see §11 for tracking.

---

## 10. Known URL-layer gotchas & invariants

- **`moduleSlug` uniqueness**: each locked domain's modules must have unique
  `moduleSlug`s within that track. `moduleSlug` can repeat *across* tracks
  (that's how `contentSource` reuse works).
- **`seoSlug` uniqueness**: globally unique. Never reused.
- **Reused modules MUST NOT set `seoSlug`**. `seo-slugs.ts` skips entries
  with `contentSource`, but an authored `seoSlug` will create a phantom
  duplicate canonical if the filter is ever relaxed.
- **App URLs for reused modules** still route through the reusing track
  (`/java-fullstack-intermediate/spring-boot/…`). Breadcrumbs,
  "up next", and sidebar stay in the reusing track's context.
- **Canonical link tag** on reused-module pages points to the source
  track's SEO URL — verify after adding a new reuse entry.
- **`moduleNumber`** is display-only. Don't write runtime logic against
  it; sort by authored array order in `_index.json` instead
  (`domain-stacks/route.ts` already does this).
- **Stack aliases** (`JBI_STACK_ALIAS`) map *legacy* URL slugs to *new*
  module slugs. Greenfield tracks should start with an empty `{}` alias
  map — no legacy URLs to preserve.

---

## 11. Change log of URL-structural decisions

Track here any decision that affects the URL layout, so future agents
don't re-open settled questions.

| Date       | Decision                                                                                                    |
|------------|-------------------------------------------------------------------------------------------------------------|
| 2026-04-23 | JFI reuses JBI via `contentSource` per-module; no new track-level content duplication.                      |
| 2026-04-23 | JFI modules carry distinct App URLs under `/java-fullstack-intermediate/*` but share SEO URLs with JBI.     |
| 2026-04-23 | Added pillar hubs: `/java`, `/java-testing`, `/sre`, `/behavioral` (now 13 total).                          |
| 2026-04-23 | `/dsa` is reserved for the standalone DSA hub; never create a pillar hub with this slug.                    |
| 2026-04-23 | JFI `_index.json` `moduleNumber`s renumbered M01–M56 to match interview-priority order (not pillar-alpha).  |
| 2026-04-23 | Scaffolded-but-empty modules render a "Content in progress" banner on their module landing page instead of an empty Q&A list. |
| 2026-04-23 | Language-specific collections modules (`java-collections`, future `python-collections`) stay in their tracks; language-agnostic algorithm content belongs on `/dsa`. |
| 2026-04-23 | **PR-A (DSA hub credibility fix)**: `/dsa` landing page replaced fake hardcoded counts (e.g. "450+ problems", "15 Two Pointers") with live counts derived from `content/dsa/_index.json`. Added featured-problems section gated by on-disk authored JSON, live difficulty + company facets, FAQ with JSON-LD FAQPage, and BreadcrumbList + CollectionPage JSON-LD graph. Study-plan cards now show "Coming soon" badge unless `content/dsa/sheets/<slug>/index.json` exists. No URL changes. |
| 2026-04-23 | **PR-B (DSA pillar + modules data layer)**: `content/dsa/_index.json` gained a sibling `modules[]` array (18 curriculum modules, M01–M18) and each entry in `problems[]` gained a `moduleSlug` back-reference. `DSAModule` and `DSAProblemIndex.moduleSlug` added to `frontend/lib/contentV2-types.ts`. Loader helpers `getDSAModules`, `getDSAModule`, `getDSAProblemsByModule`, `getDSAModuleProblemCounts` exposed from `frontend/lib/contentV2.ts`. Additive schema change only — no URL impact yet; module pages arrive in PR-C. |
| 2026-04-23 | **PR-C (DSA module landing pages)**: `/dsa/module/[slug]` route shipped. Authored `DSALearnPage` content for 3 exemplar modules (`complexity-big-o`, `arrays-and-hashing`, `two-pointers`). Hub curriculum grouped into 4 phases with module cards linking to module pages and a "Theory" badge on authored ones. |
| 2026-04-23 | **PR-F (content plan + DSA problem master list + sheets)**: `docs/CONTENT-PLAN.md` published with competitor analysis, keyword buckets, URL inventory, and phased roadmap. `content/dsa/_index.json` `problems[]` expanded from 16 to 106 curated, high-SEO interview problems (metadata only — rich problem JSONs authored per slug later). `DSASheet` schema added to `contentV2-types.ts`; `getDSASheet` + `listDSASheets` loaders added to `contentV2.ts`. Sheets authored for `blind-75`, `neetcode-150`, `grind-75` under `content/dsa/sheets/<slug>/index.json`. New route `/dsa/sheet/[slug]/page.tsx` renders the sheet landing with grouped problem list, progress bar, BreadcrumbList + ItemList + Course JSON-LD. Hub sheet cards automatically flip from "Coming soon" to live links. No URL breakage. |
| 2026-04-23 | **DSA surface harmonisation + canonicalisation + PR-G**: shared DSA UI primitives introduced in `frontend/components/dsa/` (`DSAPageShell`, `DSABreadcrumb`, `DSAHero` + `DSAStatCard`, `DSAPills` + `DifficultyPill` + `LevelPill`, `DSAProblemRow` + `DSAProblemList`, `DSAExploreBar`, `DSADifficultyPage`). Every DSA page now uses the same 1100 px shell, violet-accent palette, consistent breadcrumbs, and emits `BreadcrumbList` JSON-LD. Previously hardcoded stubs rewritten as data-driven pages: `/dsa/easy`, `/dsa/medium`, `/dsa/hard` (filter on `problems[].difficulty`, group by module, sibling difficulty switcher), `/dsa/pattern/[slug]` (live problem count, grouped by module, sibling patterns), `/dsa/company/[company]` (all companies indexed via new `getDSACompanies`, patterns-they-test chip row, grouped problem list). `/dsa/[category]` harmonised with shared sidebar + shell. `/dsa/[category]/[slug]` reduced to a `permanentRedirect` to `/dsa/problem/<slug>` — one canonical URL per problem, eliminating a duplicate-content trap. `/dsa/problem/[slug]` rewritten on top of the proper `getDSAProblemBySlug` loader, renders the full schema (problem statement, examples, how-to-think, approaches with complexity pill and language tabs, interview voice, pattern note, common mistakes, follow-ups), and navigates prev/next within the owning curriculum module. **PR-G:** `DSA_SEO_MODULES` registry added to `frontend/lib/seo-slugs.ts`; proxy gained Branch 0e that rewrites `/<dsa-module-seoSlug>` → `/dsa/module/<moduleSlug>` and 301s alt-slugs to canonical. `/big-o-interview-questions` etc. now resolve to the canonical module page without exposing the `/dsa/module/...` prefix. |

---

## 12. DSA pillar architecture

`/dsa` is a **standalone hub with pillar-like modules layered on top**. It
is treated as a first-class "domain" for SEO purposes — every curriculum
module, theory page, sheet, and problem has its own canonical URL, meta,
and (where applicable) JSON-LD — but its content tree is not a locked
domain (§2). The index file keeps its ContentV2 schema.

### 12.1 Content structure

```
content/dsa/
  _index.json              # modules[] + problems[] (sibling arrays)
  arrays/
    two-sum.json           # rich DSAProblem schema (already exists)
    <slug>.json            # future problems go here
  strings/
  linked-lists/
  trees/
  graphs/
  dynamic-programming/
  stack-queue/
  heap/
  binary-search/
  learn/                   # (proposed, PR-C) per-module theory pages
    <moduleSlug>/
      index.json           # DSALearnPage schema
  sheets/                  # (proposed, PR-C) curated problem lists
    blind-75/
      index.json           # DSASheet schema
    neetcode-150/
    grind-75/
```

### 12.2 Schemas

**`DSAIndex.modules[]`** (additive overlay, authoritative for curriculum order):

| Field               | Required | Notes                                                                 |
|---------------------|----------|-----------------------------------------------------------------------|
| `moduleNumber`      | ✅       | Display string, e.g. `"M01"`. Never used in logic.                    |
| `moduleSlug`        | ✅       | Kebab-case, globally unique within `modules[]`. Used as path segment. |
| `title`             | ✅       | Display title.                                                        |
| `seoSlug`           | ✅       | Root-level canonical, e.g. `arrays-and-hashing-interview-questions`.  |
| `tagline`           | ✅       | Single-line hook for cards + meta description fallback.               |
| `shortDescription`  | ✅       | 1–2 sentence blurb, surfaced in cards and JSON-LD.                    |
| `level`             | ✅       | `beginner` \| `intermediate` \| `advanced`.                           |
| `focus`             | ✅       | `theory` \| `practice` \| `mixed`.                                    |
| `prerequisites[]`   | optional | Other `moduleSlug`s the learner should finish first.                  |

**`DSAProblemIndex.moduleSlug`** (new, optional for back-compat): kebab
ID matching one of `modules[].moduleSlug`. Powers "which module does this
problem belong to" lookups and the featured/related-problems rails on
module pages.

### 12.3 URL inventory

Canonical URLs that `/dsa` will expose (existing + proposed). Anything
under `/dsa/*` is registered in `proxy.ts` `SKIP_PREFIXES` already.

| Pattern                                      | Status   | Canonical target                             |
|----------------------------------------------|----------|----------------------------------------------|
| `/dsa`                                       | Live     | `/dsa` (hub landing)                         |
| `/dsa/[category]`                            | Live     | `/dsa/[category]` (data-structure browse)    |
| `/dsa/problem/[slug]`                        | Live     | Canonical for individual problems            |
| `/dsa/pattern/[slug]`                        | Live     | Canonical for pattern browse                 |
| `/dsa/company/[slug]`                        | Live     | Canonical for company browse                 |
| `/dsa/[difficulty]` (`easy`/`medium`/`hard`) | Live     | Canonical for difficulty browse              |
| `/dsa/module/[moduleSlug]`                   | Live     | Curriculum module landing (theory + practice combined) |
| `/dsa/sheet/[sheetSlug]`                     | Live     | Curated problem sheet (Blind 75, NeetCode 150, Grind 75) |
| `/dsa/learn/[moduleSlug]`                    | Not built — folded into `/dsa/module/[moduleSlug]`. | Theory content ships on the module page directly. |
| `/{module.seoSlug}` (e.g. `/arrays-and-hashing-interview-questions`) | Proposed | Root-level SEO canonical for each DSA module, registered in `SEO_MODULES`. Renders via rewrite to `/dsa/module/[moduleSlug]` or serves directly — TBD in PR-C. |

**Reserved `/dsa/*` segments** (do not use as category slugs):
`problem`, `pattern`, `company`, `module`, `learn`, `sheet`, `easy`,
`medium`, `hard`. All categories in `content/dsa/*/` must avoid these
names.

### 12.4 Cross-track reuse (`externalSource`, proposed)

Other locked domains (JBI, JFI, Python) embed DSA modules **by reference**
rather than by copying content. Proposed mechanism (PR-D):

```jsonc
// content/java-backend-intermediate/_index.json
{
  "modules": [
    {
      "moduleSlug": "dsa-arrays-and-hashing",      // track-local slug
      "moduleNumber": "M42",
      "externalSource": {
        "domain": "dsa",
        "moduleSlug": "arrays-and-hashing"          // target in content/dsa
      }
      // NO seoSlug — canonical stays on /dsa
    }
  ]
}
```

Semantics (contrast with §5's `contentSource`):

- `contentSource` embeds content from another **locked domain** (same
  schema, same loader).
- `externalSource` embeds content from a **non-locked hub** like `/dsa`
  (ContentV2 schema). The track resolver recognises `externalSource` and
  dispatches to the appropriate loader (`contentV2.getDSAProblemsByModule`
  for DSA). Canonical URL still points to the source hub
  (`/dsa/module/<slug>` or the module's `seoSlug`).

Not implemented yet. Added here so the design isn't re-litigated.

### 12.5 SEO integration plan (PR-C)

1. Extend `frontend/lib/seo-slugs.ts` with a dynamic loader that reads
   `content/dsa/_index.json` `modules[]` and registers each module's
   `seoSlug` in `SEO_MODULES` with a synthetic domain key (`dsa-pillar`)
   so sitemap + canonicalization pick it up.
2. Per-module landing (`/dsa/module/[slug]` or rewritten from the
   seoSlug) emits `CollectionPage` + `BreadcrumbList` JSON-LD and links
   the module's featured problems + theory page + parent `/dsa`.
3. Individual problem pages (`/dsa/problem/[slug]`) gain a "Part of
   module X" crumb and a "Up next in module" rail driven by
   `getDSAProblemsByModule(p.moduleSlug)`.
4. Theory pages (`/dsa/learn/[slug]`) emit `Article` + `BreadcrumbList`
   JSON-LD and link back to the parent module + cross-link to other
   theory pages in the curriculum.
5. Sheet pages (`/dsa/sheet/[slug]`) emit `ItemList` + `BreadcrumbList`
   JSON-LD listing the problem slugs in order.

### 12.6 Phase plan

| PR   | Scope                                                                                          | Status   |
|------|------------------------------------------------------------------------------------------------|----------|
| PR-A | Hub credibility fix (live counts, FAQ, featured problems, sheet gating, JSON-LD).              | ✅ Done  |
| PR-B | Data layer: `modules[]` overlay in `_index.json`, back-reference on problems, loader helpers. | ✅ Done  |
| PR-C | Module/theory/sheet page routes + `SEO_MODULES` registration for DSA modules.                 | Pending  |
| PR-D | `externalSource` resolver in track loader + embed DSA modules in JBI/JFI/Python.              | Pending  |
| PR-E | Bulk problem authoring (Blind-75 first) using the established rich problem schema.            | Pending  |

