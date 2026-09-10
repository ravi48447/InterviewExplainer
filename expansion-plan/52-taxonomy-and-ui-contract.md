# 52 — Taxonomy Registry and UI Contract

> **Executor:** AI coding agent operating autonomously.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** documentation + spec files. **No frontend edits, no content generation.**

## TL;DR

- **Input:** Working content factory from playbook 51, the existing `frontend/lib/content-reader.ts` `LOCKED_DOMAINS` map, and the existing layout/section-type enums established by the Java content corpus.
- **Action:** Write two normative spec files: (1) `.cursor/content-factory/taxonomy.yaml` — the master registry of every (language × level × pillar × module) the project will eventually ship, and (2) `.cursor/content-factory/UI_CONTRACT.md` — the single-source rule that **no content-writing playbook may add new schema fields, new layout types, new section types, or edit frontend renderer code**. Cross-link both from `00-INDEX.md` Universal Rules.
- **Output:** Every downstream playbook (53-80) reads `taxonomy.yaml` to know what to generate and reads `UI_CONTRACT.md` to know what stays untouchable. The current JBI flagship UX renders identically before and after this playbook.

## Hard prerequisites

- [ ] Playbook 51 DONE (factory infrastructure exists).
- [ ] `frontend/lib/content-reader.ts` exists and contains `LOCKED_DOMAINS` map.
- [ ] `frontend/lib/seo-slugs.ts` exists.
- [ ] `frontend/lib/launch-config.ts` exists.
- [ ] `git status` clean.

## Why this matters (2 sentences)

Without a master taxonomy, every new language track defines its own pillar shape ad-hoc — by the time you have 8 languages live, "compare" pages, "study plans", and SEO sitemaps cannot map across them cleanly. Without a UI contract, downstream playbooks will eventually invent a new section type or layout type for "their" language, breaking the renderer for every other language.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `frontend/lib/content-reader.ts` | Source of truth for `LOCKED_DOMAINS`, `CONTENT_*_ROOT` constants, and the per-domain `_index.json` reader. |
| `frontend/lib/seo-slugs.ts` | Maps app URLs to canonical SEO URLs; new languages register here. |
| `frontend/lib/launch-config.ts` | `ENABLED_LANGUAGES`, `ENABLED_HUBS`, `LAUNCH_QUICK_PATHS`. |
| `content/java-backend-intermediate/_index.json` | Pillar grouping pattern — each language must mirror this shape. |
| `expansion-plan/06-content-schema-and-qa-format.md` | Schema spec already documented; this playbook does not modify it. |
| `expansion-plan/49-javascript-go-ruby-language-tracks.md` | The original undersized lang-track plan; this taxonomy supersedes its per-language Q targets but does not delete file 49. |

## Execution steps

### Step 1 — Confirm current LOCKED_DOMAINS state

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
rg -n "LOCKED_DOMAINS|CONTENT_JBI_ROOT|CONTENT_JFI_ROOT|CONTENT_PBI_ROOT" \
  frontend/lib/content-reader.ts | head -20
```

**Expected output:** at least three `CONTENT_*_ROOT` constants and the `LOCKED_DOMAINS` registry. Note: PBI may or may not be in `LOCKED_DOMAINS` depending on whether playbook 36 has run.

**If it fails:** `rg` not installed → install via `brew install ripgrep` or use `grep -rn`.

### Step 2 — Confirm enum surfaces from the live corpus

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

# All distinct layout_type values across existing content
python3 - <<'PY'
import json, glob
lts = set()
for f in glob.glob('content/**/complete-qa.json', recursive=True):
    try:
        d = json.load(open(f))
        for q in d.get('questions', []):
            lts.add(q.get('layout_type', ''))
    except Exception:
        pass
print('layout_type values in corpus:')
for v in sorted(lts):
    print(f'  - {v}')
PY

# All distinct section types
python3 - <<'PY'
import json, glob
sts = set()
for f in glob.glob('content/**/complete-qa.json', recursive=True):
    try:
        d = json.load(open(f))
        for q in d.get('questions', []):
            for s in q.get('answer', {}).get('sections', []):
                sts.add(s.get('type', ''))
    except Exception:
        pass
print('section types in corpus:')
for v in sorted(sts):
    print(f'  - {v}')
PY
```

**Expected output:** A list of layout_types (e.g. `concept-explainer`, `comparison-arena`, etc.) and section types (e.g. `overview`, `step`, `key_points`, `speakable_answer`, etc.). These two lists are the **frozen enums** that the UI contract will reference.

### Step 3 — Write the master taxonomy

Write `.cursor/content-factory/taxonomy.yaml`. Required top-level keys:

- `languages` — map of language slug → metadata. Required fields per language: `display_name`, `slug`, `versions[]` (e.g. `["3.12", "3.11"]`), `idioms_doc` (path to per-language style guide, may be TBD), `enabled` (bool — only flip when `ENABLED_LANGUAGES` allows it).
- `levels` — map of level slug → metadata. Required fields: `display_name`, `slug`, `q_count_target` (e.g. fresher → 350-450, intermediate → 800-1100, advanced → 400-600), `depth` (e.g. `concept-explainer` for fresher, `scenario+tradeoffs` for intermediate), `complexity` (`low-medium` / `medium-high`).
- `pillars` — ordered list of universal pillars that every language has. Order matters (drives nav order). Required fields per pillar: `slug`, `display_name`, `description`, `applies_to_levels` (which levels include this pillar; some pillars are intermediate-only).
- `language_pillar_modules` — nested map. Outer key: `<language>.<pillar>`. Value: ordered array of module slugs that language uses for that pillar. This is what makes taxonomy non-trivial — Java's `web-frameworks` pillar maps to spring modules; Python's maps to django/fastapi/flask; Go's maps to gin/echo/chi.

Languages to register (initial set, all enabled=false except the two already shipping):

- `java`, `python`, `javascript`, `typescript`, `go`, `ruby`, `csharp`, `php`, `rust`, `kotlin`.

Levels to register:

- `fresher`, `intermediate`, `advanced` (only Java currently has advanced via file 23).

Pillars (universal, in nav order):

1. `core-language` — syntax, types, OOP/functional, builtin types.
2. `concurrency-and-async` — threading, async/await, channels, etc.
3. `memory-and-runtime` — GC, lifetime, ownership, performance.
4. `error-handling` — exceptions / Result types / panics.
5. `io-and-streams` — file I/O, network, encoding.
6. `data-and-orm` — databases + query layers.
7. `web-frameworks` — language-specific.
8. `apis-and-messaging` — REST, GraphQL, gRPC, queues.
9. `testing` — unit, integration, snapshot, fuzz.
10. `build-and-deps` — package managers, lockfiles.
11. `devops-and-cloud` — Docker, k8s, CI/CD, observability.
12. `system-design` — language-flavored scaling patterns.
13. `security` — auth, encryption, OWASP.
14. `behavioral-and-interview` — STAR, communication, scenarios.

Document explicitly which pillars apply to fresher (typically: 1, 4, 5, 9, 14) vs intermediate (all 14) vs advanced (deeper subset of 1, 2, 3, 7, 12, 13).

### Step 4 — Write the UI Contract

Write `.cursor/content-factory/UI_CONTRACT.md`. It is a non-negotiable rule sheet. Required sections:

1. **Frozen enums.** Lists the layout_type and section type enums extracted in step 2. Header: "Adding a new value here requires a frontend renderer change AND a separate playbook approving it. No bulk-generation playbook is allowed to add new values."
2. **Frozen schema.** Reference to `.cursor/content-factory/schemas/complete_qa.schema.json`. Header: "Adding a new top-level field or per-question required field requires a schema-version bump AND a separate frontend renderer playbook. Bulk-generation playbooks 53-80 are forbidden from doing this."
3. **Frozen frontend paths.** Lists exact paths that must NOT be edited by any content-writing playbook:
   - `frontend/lib/content-reader.ts` (only edit when registering a new locked domain — and only via the prescribed pattern in playbook 07).
   - `frontend/lib/seo-slugs.ts` (same constraint).
   - `frontend/lib/launch-config.ts` (only via the smoke-checklist gate from `ROADMAP.md`).
   - `frontend/components/`, `frontend/app/`, anything else under `frontend/` — touch ONLY when an explicitly-tagged frontend playbook says so.
4. **Locked-domain registration pattern.** When a new language goes live, the only allowed frontend edits are: (a) add a new `CONTENT_<LANG>_<LEVEL>_ROOT` constant, (b) add an entry to `LOCKED_DOMAINS`, (c) add a row to `seo-slugs.ts`, (d) flip the flag in `launch-config.ts`. Any other frontend edit fails the UI contract.
5. **Smoke checklist after every content batch.** `npm run build` exit 0; `/domains` opens every card; one Q from the new language renders; one Q from JBI still renders identically. If any fails, the batch is reverted.
6. **Version pin policy.** Every Q's content must specify language version (e.g. "Python 3.12", "Go 1.22"). The validator already checks this implicitly via `last_updated` and content-rules in playbook 51.
7. **Out-of-contract escape valves.** If a downstream playbook genuinely needs a new section type, the procedure is: (a) STOP, (b) write a new schema-version playbook (numbered in the high 90s), (c) get human approval, (d) only then update enums. Never sneak it in.

### Step 5 — Cross-link from the index

Update `expansion-plan/00-INDEX.md` Universal Rules section. Add a new rule (numbered after the existing 8):

> 9. **Read the UI Contract** at `.cursor/content-factory/UI_CONTRACT.md` before starting any content-writing playbook. Adding new layout types, section types, or schema fields is forbidden without an explicit schema-version playbook.

Also add a row in the "Where to put new work that doesn't fit" section:

> - **New language or level** → add an entry to `.cursor/content-factory/taxonomy.yaml` AND create a new playbook (`56-…` etc.). Never add a language by editing existing playbooks.

### Step 6 — UI smoke test (regression check)

This playbook does not write content, but it does write spec files; confirm nothing accidentally got into `frontend/`.

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git diff --name-only main...HEAD | grep '^frontend/' && echo "FAIL: frontend changes present" || echo "OK: no frontend changes"
cd frontend && npm run build
```

**Expected output:** First command echoes `OK: no frontend changes`. Build exits 0.

**If it fails:** Frontend was edited despite the contract → revert those files with `git restore frontend/`.

### Step 7 — Commit

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add .cursor/content-factory/taxonomy.yaml \
        .cursor/content-factory/UI_CONTRACT.md \
        expansion-plan/00-INDEX.md
git commit -m "docs(factory): taxonomy registry + UI contract"
```

**Expected output:** One commit with three files changed.

### Step 8 — Mark playbook 52 DONE

**Command:**

```bash
# Edit expansion-plan/00-INDEX.md to flip Status for row 52
git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 52-taxonomy-and-ui-contract DONE"
```

## Copy-paste templates

### taxonomy.yaml skeleton

```yaml
version: 1
last_updated: 2026-05-28

languages:
  java:
    display_name: Java
    slug: java
    versions: ["JDK 21", "JDK 17"]
    idioms_doc: ".cursor/content-factory/idioms/java.md"
    enabled: true
  python:
    display_name: Python
    slug: python
    versions: ["3.12", "3.11"]
    idioms_doc: ".cursor/content-factory/idioms/python.md"
    enabled: true
  javascript: { display_name: JavaScript, slug: javascript, versions: ["Node 20+", "ES2023"], enabled: false }
  typescript: { display_name: TypeScript, slug: typescript, versions: ["5.x"], enabled: false }
  go: { display_name: Go, slug: go, versions: ["1.22"], enabled: false }
  ruby: { display_name: Ruby, slug: ruby, versions: ["3.3", "Rails 7"], enabled: false }
  csharp: { display_name: "C#", slug: csharp, versions: [".NET 8", "C# 12"], enabled: false }
  php: { display_name: PHP, slug: php, versions: ["8.3", "Laravel 11"], enabled: false }
  rust: { display_name: Rust, slug: rust, versions: ["1.75"], enabled: false }
  kotlin: { display_name: Kotlin, slug: kotlin, versions: ["1.9", "Spring Boot Kotlin"], enabled: false }

levels:
  fresher: { display_name: Fresher, slug: fresher, q_count_target: 400, depth: concept-explainer, complexity: low-medium }
  intermediate: { display_name: Intermediate, slug: intermediate, q_count_target: 1000, depth: scenario+tradeoffs, complexity: medium-high }
  advanced: { display_name: Advanced, slug: advanced, q_count_target: 500, depth: deep-dive, complexity: high }

pillars:
  - { slug: core-language, display_name: "Core Language", applies_to_levels: [fresher, intermediate, advanced] }
  - { slug: concurrency-and-async, display_name: "Concurrency & Async", applies_to_levels: [intermediate, advanced] }
  - { slug: memory-and-runtime, display_name: "Memory & Runtime", applies_to_levels: [intermediate, advanced] }
  - { slug: error-handling, display_name: "Error Handling", applies_to_levels: [fresher, intermediate, advanced] }
  - { slug: io-and-streams, display_name: "I/O & Streams", applies_to_levels: [fresher, intermediate] }
  - { slug: data-and-orm, display_name: "Databases & ORM", applies_to_levels: [intermediate, advanced] }
  - { slug: web-frameworks, display_name: "Web Frameworks", applies_to_levels: [intermediate, advanced] }
  - { slug: apis-and-messaging, display_name: "APIs & Messaging", applies_to_levels: [intermediate, advanced] }
  - { slug: testing, display_name: "Testing", applies_to_levels: [fresher, intermediate, advanced] }
  - { slug: build-and-deps, display_name: "Build & Dependencies", applies_to_levels: [fresher, intermediate] }
  - { slug: devops-and-cloud, display_name: "DevOps & Cloud", applies_to_levels: [intermediate, advanced] }
  - { slug: system-design, display_name: "System Design", applies_to_levels: [intermediate, advanced] }
  - { slug: security, display_name: "Security", applies_to_levels: [intermediate, advanced] }
  - { slug: behavioral-and-interview, display_name: "Behavioral & Interview", applies_to_levels: [fresher, intermediate, advanced] }

language_pillar_modules:
  java.core-language: [core-java, oop-classes, collections-framework, generics-wildcards, streams-and-lambdas, string-handling, exception-handling, io-and-nio, java-modules, scenario-based]
  python.core-language: [core-python, oop-classes, builtin-types, generators-iterators, decorators, context-managers, comprehensions, typing-and-annotations, scenario-based]
  javascript.core-language: [js-language-core, prototypes-and-classes, closures, event-loop, esm-and-cjs, async-iterators, generators, scenario-based]
  typescript.core-language: [ts-fundamentals, generics, conditional-and-mapped-types, type-narrowing, decorators, declaration-merging, tsconfig, scenario-based]
  go.core-language: [go-language-core, types-and-interfaces, goroutines-and-channels, generics, error-handling-go, packages, scenario-based]
  ruby.core-language: [ruby-language-core, classes-modules-mixins, blocks-procs-lambdas, metaprogramming, enumerable, scenario-based]
  csharp.core-language: [csharp-fundamentals, generics, linq, async-await, records-and-pattern-matching, nullable-reference-types, scenario-based]
  php.core-language: [php-fundamentals, oop-namespaces, traits, type-system-modern, error-handling, composer, scenario-based]
  rust.core-language: [rust-fundamentals, ownership-and-borrowing, lifetimes, traits-and-generics, error-handling-rust, async-rust, scenario-based]
  kotlin.core-language: [kotlin-fundamentals, null-safety, coroutines-intro, data-classes, sealed-classes, extension-functions, scenario-based]

  # Web frameworks per language
  java.web-frameworks: [spring-core, spring-boot, spring-mvc, spring-data-jpa, spring-security, spring-webflux]
  python.web-frameworks: [django, fastapi, flask, starlette]
  javascript.web-frameworks: [express, fastify, nestjs, koa]
  typescript.web-frameworks: [nestjs-ts, hono, trpc-server, express-with-types]
  go.web-frameworks: [net-http-stdlib, gin, echo, chi, fiber]
  ruby.web-frameworks: [rails-core, rails-action-controller, rails-active-record, sinatra, hanami]
  csharp.web-frameworks: [aspnet-core-mvc, minimal-apis, blazor-server, signalr]
  php.web-frameworks: [laravel-core, symfony, slim, lumen]
  rust.web-frameworks: [actix-web, axum, rocket]
  kotlin.web-frameworks: [spring-boot-kotlin, ktor]

  # ... (all other pillar/language combinations follow same shape)
```

### UI_CONTRACT.md skeleton

```markdown
# UI Contract

This document is **non-negotiable**. Every content-writing playbook (53-80) MUST obey these rules. If you find yourself wanting to break a rule, STOP and open a separate schema-version playbook in the 90s instead.

## Frozen layout_type enum

Allowed values (and only these):
- default
- concept-explainer
- comparison-arena
- comparison-explainer
- recipe-builder
- scenario-walkthrough
- reference-cards
- sql-playground
- problem-detective
- concept-deep-dive

## Frozen section type enum

Allowed values (and only these):
- overview, step, key_points, speakable_answer, tradeoffs, comparison_table, code_example, architecture_diagram, when_to_use, component, reference_group, phase

## Frozen schema

The JSON Schema at `.cursor/content-factory/schemas/complete_qa.schema.json` is the contract. Adding a top-level field or per-Q required field is a schema-version change.

## Frozen frontend paths

These files are TOUCHED ONLY by playbooks explicitly tagged "frontend":
- frontend/lib/content-reader.ts (only via locked-domain registration pattern in playbook 07)
- frontend/lib/seo-slugs.ts (only when adding canonical SEO slugs for a new language)
- frontend/lib/launch-config.ts (only via smoke checklist in ROADMAP.md)
- frontend/components/, frontend/app/, frontend/styles/ — never via content playbooks

## Smoke checklist (every content batch)

1. `cd frontend && npm run build` exits 0.
2. `/domains` opens every card with `hasContent: true` without 404.
3. One Q from the newly added content renders end-to-end.
4. One Q from JBI renders identically (regression check).
5. ROADMAP.md updated if any flag flipped.
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| `taxonomy.yaml` exists with all required top-level keys | 4 keys: languages, levels, pillars, language_pillar_modules | `python3 -c "import yaml; d=yaml.safe_load(open('.cursor/content-factory/taxonomy.yaml')); assert all(k in d for k in ['languages','levels','pillars','language_pillar_modules'])"` |
| `taxonomy.yaml` lists ≥10 languages | count check | `python3 -c "import yaml; print(len(yaml.safe_load(open('.cursor/content-factory/taxonomy.yaml'))['languages']))"` ≥ 10 |
| `UI_CONTRACT.md` lists frozen enums | both enum sections present | `grep -c "## Frozen layout_type enum\|## Frozen section type enum" .cursor/content-factory/UI_CONTRACT.md` → 2 |
| `00-INDEX.md` references UI contract | new universal rule added | `grep -c "UI_CONTRACT.md\|UI Contract" expansion-plan/00-INDEX.md` ≥ 1 |
| No frontend edits in this playbook's commit | clean diff | `git diff --name-only HEAD~1 HEAD \| grep '^frontend/'` returns empty |
| Build still passes | exit 0 | `cd frontend && npm run build` |

## Failure modes & rollback

- **`pyyaml` not installed** for the validation step: install via `pip3 install pyyaml` OR rewrite the verifier to a regex grep on the YAML keys.
- **Existing `00-INDEX.md` already has 9+ universal rules** and adding a new one creates a numbering conflict: append as rule 10+ or merge into the relevant existing rule rather than insert.
- **The taxonomy yaml grows beyond 500 lines** because every pillar/language combo is enumerated: split into `taxonomy.yaml` (top-level languages/levels/pillars) + `taxonomy_modules.yaml` (the language_pillar_modules map). Both files committed together.
- **A reviewer wants to change a frozen enum**: STOP. Open a new playbook (e.g. `90-schema-version-bump-add-X-section.md`) and follow the schema-version process there.

## Definition of Done

- [ ] `.cursor/content-factory/taxonomy.yaml` exists with ≥10 languages, ≥3 levels, ≥14 pillars.
- [ ] `.cursor/content-factory/UI_CONTRACT.md` exists with the 7 required sections.
- [ ] `00-INDEX.md` Universal Rules section references the UI contract.
- [ ] All 6 quality gates pass.
- [ ] One commit on `content-factory/<date>` branch (or whatever the active factory branch is).
- [ ] `00-INDEX.md` row for `52` flipped to `DONE`.
- [ ] `npm run build` exits 0 with no frontend edits.

## Estimated effort

- **Ideal:** 4 hours.
- **Hard stop:** 8 hours. If exceeded, the taxonomy is being over-specified — defer the per-language module lists to a follow-up playbook and ship the skeleton.
