# _GLOSSARY — Easy-language definitions every playbook §3 inherits

> **Status:** locked source-of-truth. Every playbook's §3 glossary is built by
> (a) inheriting every term in this file that the playbook actually uses, then
> (b) adding playbook-specific terms.
>
> The lint script [`scripts/lint_playbook.py`](../scripts/lint_playbook.py)
> reads this file and asserts that any term used in §9–§14 of a playbook is
> either in the playbook's own §3 table or in this file's master table.
>
> **Rules for every entry:**
>
> 1. One sentence. If you need two, split into two terms.
> 2. Plain English first. If a definition uses a deeper jargon word, that
>    word also has an entry in this file.
> 3. Name a concrete anchor (real system, library, RFC, JEP, command) when
>    possible — the JBI corpus voice rule.
> 4. No marketing words ("world-class", "best-in-class", etc. — see
>    `_VOICE-RULES.md` §6).

---

## A — Site & content architecture

| Term | Plain-English definition |
| --- | --- |
| **Archetype** | One of 7 fixed answer shapes (A–G) defined in `docs/speakable/archetypes.md` — locks which beats the answer must contain. |
| **Beat** | A single labeled paragraph inside an answer (hook, definition, tradeoff, cap, …). |
| **Speakable** | The short, naturally-spoken version of the answer — what you'd literally say aloud in 60 seconds, lint-checked against `docs/speakable/word-ceilings.md`. |
| **Hook** | The opening line of a Speakable — sets up the answer in ≤ 35 words. |
| **Cap** | The closing line of a Speakable — lands the answer in ≤ 35 words. |
| **Beat ceiling** | The hard word-cap a single beat must not exceed; defined in `docs/speakable/word-ceilings.md`. |
| **Pillar** | One of 12 thematic groups (P01–P12) under `content/java-backend-intermediate/_index.json`. |
| **Module** | A folder under a domain that maps to one URL segment (e.g. `core-java`, `spring-boot`). |
| **Topic** | A folder inside a module that holds one `complete-qa.json`. |
| **Domain** | The top-level content bucket — `java-backend-intermediate`, `python-backend-intermediate`, etc. |
| **Q-file** | A `complete-qa.json` inside a topic — the unit of content the renderer reads. |
| **Money question** | A 1-on-1 comparison Q that pulls outsized monthly search volume (e.g. `HashMap vs ConcurrentHashMap`). |
| **Landing intro** | The hand-tuned paragraph at the top of a module page — read by the SEO crawler. |
| **Layout type** | A frozen enum (`default`, `comparison`, `system-design`, …) that tells the renderer which page template to use. |
| **Section type** | A frozen enum (`overview`, `comparison_table`, `step`, `before_code`, `after_code`, `tradeoffs`, `key_points`, `speakable_answer`, `phase`) inside an `answer.sections[]` array. |
| **UI Contract** | The frozen list of section types and layout types in `.cursor/content-factory/UI_CONTRACT.md` — any new value requires a schema-version playbook. |
| **Taxonomy Registry** | The single source of truth for pillar shape, level Q-targets, and language version pins — lives at `.cursor/content-factory/taxonomy.yaml`. |

## B — Lint, audit, and validation

| Term | Plain-English definition |
| --- | --- |
| **Schema lint** | The script that fails CI when a `complete-qa.json` doesn't match `content/_schemas/complete-qa.schema.json`. |
| **Speakable lint** | The script `scripts/audit_speakable.py` that checks every Q for beat structure, word ceilings, and banned phrases. |
| **Pass+warn** | The combined percentage of files the linter marks OK or warn-only (i.e. no FAIL). The site-wide target is ≥ 92 %. |
| **Playbook lint** | The script `scripts/lint_playbook.py` that enforces this template's 18-section structure and word rules. |
| **Gap report** | A file under `content/_audits/` listing per-module deltas vs the depth targets in playbook 11. |
| **Depth target** | The minimum Q count for a module to count as "filled" — defined per-module in playbook 11. |
| **Difficulty mix** | The target distribution of E/M/H Qs in a module — usually 30/50/20 ± 10 %. |

## C — Frontend, flags, and launch

| Term | Plain-English definition |
| --- | --- |
| **Feature flag** | A boolean in `frontend/lib/launch-config.ts` that controls whether a domain or hub is publicly visible. |
| **`hasContent` flag** | A per-domain boolean in `frontend/lib/domains.ts` that gates whether the `/domains` card is clickable. |
| **Smoke checklist** | The 5-step verification in `ROADMAP.md` that every launch playbook runs before flipping a flag. |
| **Locked domain pattern** | The frozen folder + URL + sidebar layout described in playbook 07; new domains adopt it or are rejected. |
| **Module registry** | The TypeScript map in `frontend/lib/modules.ts` that lists which modules exist per domain. |
| **Pillar nav** | The left-sidebar grouping by pillar — driven by `frontend/lib/pillars.ts` and the per-domain `_index.json`. |
| **Canonical URL** | The URL the SEO crawler should treat as the source-of-truth for a question; set via the `seo` block in each Q. |
| **`altSlug`** | An alternate URL that 301-redirects to the canonical URL — used when we re-org content. |

## D — Speakable + voice

| Term | Plain-English definition |
| --- | --- |
| **Speakable archetype A** | Conceptual question shape — "what is X?" — beats: hook, definition, why_exists, parts_or_states, example, pitfalls, cap. |
| **Speakable archetype B** | Comparison shape — "X vs Y" — beats: hook, what_each_is, differences, when_to_pick, tiny_example, cap. |
| **Speakable archetype C** | Internals shape — "how does X work under the hood?" — beats: hook, mental_model, mechanism, edge_cases, failure_mode, cap. |
| **Speakable archetype D** | Scenario shape — "you see Y in prod, what do you do?" — beats: hook, clarify, hypothesis, step_by_step, tools, tradeoff, cap. |
| **Speakable archetype E** | Design shape — "design X" — beats: hook, optimising_for, options, tradeoffs, decision, rethink_if, cap. |
| **Speakable archetype F** | System-design / LLD shape — beats: hook, requirements_fr_nfr, capacity, api, data_model, high_level, bottleneck_deep_dive, tradeoffs, cap. |
| **Speakable archetype G** | Behavioural / STAR shape — beats: hook, situation, task, action, result, reflection, cap. |
| **Depth marker** | The non-obvious nuance that distinguishes a senior answer; defined per-archetype in `docs/speakable/depth-markers.md`. |
| **Familiarity anchor** | A common-sense phrase ("blueprint vs instance", "key plus value") used to ground a definition; catalogued in `docs/speakable/familiarity-codex.md`. |

## E — Diagrams & code beats

| Term | Plain-English definition |
| --- | --- |
| **comparison_table** | A markdown table inside an `answer.sections[]` entry; the dominant diagram type in JBI today. |
| **mermaid flowchart** | A diagram written in mermaid `flowchart` syntax — used for control flow (try-catch, deploy flow). |
| **mermaid sequenceDiagram** | A diagram written in mermaid `sequenceDiagram` syntax — used for request/response order, lock acquisition, GC phases. |
| **mermaid stateDiagram-v2** | A diagram written in mermaid `stateDiagram-v2` syntax — used for lifecycle (thread states, executor states). |
| **mermaid classDiagram** | A diagram written in mermaid `classDiagram` syntax — used for OOP design (SRP/OCP refactors). |
| **before_code / after_code** | The diff-style "wrong-then-right" section pair — the dominant teaching move in JBI (e.g. `FileReader` without charset → `Files.newBufferedReader(path, UTF_8)`). |
| **step** | A labeled walkthrough beat inside an answer — usually 3–6 of these per Q. |
| **phase** | A labeled lifecycle beat — used for GC, thread lifecycle, JVM startup. |
| **key_points** | A bulleted summary section near the end of an answer — 6–9 bullets. |
| **tradeoffs** | A section labelled "when to pick / when NOT to pick" — usually two columns of bullets. |
| **followup_questions** | The 5 deeper probes at the bottom of every Q — each opens a separate Q-page. |

## F — Java / Spring / JVM (used heavily in playbooks 11–28, 41–47)

| Term | Plain-English definition |
| --- | --- |
| **JBI** | Java-Backend-Intermediate — the flagship domain at `content/java-backend-intermediate/`. |
| **JBB** | Java-Backend-Beginner — the entry-level Java domain (playbooks 19–21). |
| **JBA** | Java-Backend-Advanced — the staff-level Java domain (playbooks 22–23). |
| **JFI** | Java-Fullstack-Intermediate — the fullstack Java domain (playbooks 24–28). |
| **Bytecode** | The platform-neutral instructions the JVM interprets or JIT-compiles. |
| **JIT compilation** | "Just-in-time" compilation — the JVM converts hot bytecode to native machine code while the program runs. |
| **AOT compilation** | "Ahead-of-time" compilation — native code is produced before run (GraalVM native image). |
| **Garbage collector** | The JVM subsystem that reclaims memory of objects no application code can reach. |
| **Generational GC** | A GC design that splits the heap into young / old regions because most objects die young. |
| **G1 / ZGC / Shenandoah / Parallel** | The four production-grade Java garbage collectors as of JDK 21. |
| **Happens-before** | The Java Memory Model's ordering guarantee — one action's effects are visible to another. |
| **Virtual thread** | A lightweight thread introduced in JEP 444 (Java 21) — millions can run on a handful of OS threads. |
| **Reactive streams** | The standard for non-blocking, backpressure-aware async streaming — implemented by Project Reactor (Spring WebFlux). |
| **Spring Bean** | An object whose lifecycle Spring manages, declared via `@Component`/`@Bean`/etc. |
| **`@Transactional`** | Spring's annotation that wraps a method call in a database transaction. |
| **N+1 query** | The anti-pattern where loading a parent triggers one extra SQL per child — JPA's most-asked interview trap. |
| **Outbox pattern** | A reliable-messaging pattern: persist the event in the same DB transaction as the business write, then publish from a polling job. |
| **Saga** | A long-running multi-service transaction implemented as a chain of compensating actions. |
| **Circuit breaker** | A library (Resilience4j, Hystrix) that fails fast when a downstream dependency is unhealthy. |

## G — Python (used in playbooks 29–40, 42–47)

| Term | Plain-English definition |
| --- | --- |
| **PBI** | Python-Backend-Intermediate — the intermediate Python domain (playbooks 30–35). |
| **PBB** | Python-Backend-Beginner — entry-level Python (playbook 36). |
| **PBA** | Python-Backend-Advanced — staff-level Python (playbook 37). |
| **PDE** | Python-Data-Engineering (playbook 38). |
| **PML** | Python-ML/AI (playbook 39). |
| **PFS** | Python-Fullstack (playbook 40). |
| **GIL** | Python's "Global Interpreter Lock" — only one thread executes Python bytecode at a time in CPython. |
| **asyncio** | Python's standard-library async runtime — single-threaded, event-loop-based concurrency. |
| **uvloop** | A faster event loop that replaces asyncio's default — used by FastAPI/Sanic production deployments. |
| **WSGI / ASGI** | The two Python web-server protocols — WSGI is sync (Flask, Django), ASGI is async (FastAPI, Starlette). |
| **`@dataclass`** | A Python decorator that auto-generates `__init__`, `__repr__`, `__eq__` for a class. |
| **Pydantic v2** | The data-validation library FastAPI uses; v2 is Rust-backed and significantly faster than v1. |
| **`async`/`await`** | Python keywords for declaring and awaiting coroutines. |

## H — DevOps, cloud, observability (used in playbooks 16–17, 21, 23, 34, 41, 47)

| Term | Plain-English definition |
| --- | --- |
| **OpenTelemetry / OTel** | The vendor-neutral standard for traces, metrics, and logs — used by Java, Python, Go, Node clients. |
| **RED metrics** | Rate, Errors, Duration — the three signals every service exposes. |
| **USE metrics** | Utilisation, Saturation, Errors — the three signals every resource (CPU, disk) exposes. |
| **SLO / SLI / SLA** | Service-level objective (target), indicator (measurement), agreement (contractual promise). |
| **Blue-green deploy** | Run the new version alongside the old, swap traffic atomically; instant rollback. |
| **Canary deploy** | Send a small fraction of traffic to the new version, observe, then ramp up. |
| **HPA** | Kubernetes Horizontal Pod Autoscaler — adds pods when CPU/RPS crosses a threshold. |
| **Sidecar** | A second container in the same pod that handles cross-cutting concerns (logs, mesh, secrets). |
| **12-factor app** | The 12 rules from heroku.com/12factor that make cloud-deployable services predictable. |
| **IaC** | Infrastructure as Code — Terraform / Pulumi / CDK. |

## I — Frontend (used in playbooks 24–28, 40)

| Term | Plain-English definition |
| --- | --- |
| **SSR** | Server-Side Rendering — Next.js renders the HTML on the server per request. |
| **SSG** | Static Site Generation — Next.js renders HTML at build time. |
| **ISR** | Incremental Static Regeneration — Next.js re-renders specific pages after a TTL. |
| **MDX** | Markdown + JSX — the format we use for hub pages so React components inline inside prose. |
| **App Router** | Next.js's modern routing system (files-in-`app/`) — replaces the legacy `pages/`. |
| **RSC** | React Server Component — runs on the server only, never ships JavaScript to the browser. |
| **Tailwind** | The utility-class CSS framework used across the site. |

## J — Operations of the playbook itself

| Term | Plain-English definition |
| --- | --- |
| **Hard prerequisites** | The checklist at §4 of every playbook — if any item is false, STOP and run the upstream playbook. |
| **Definition of Done** | The checklist at §16 — every box must tick for the playbook to be marked DONE in `00-INDEX.md`. |
| **Hard stop** | The wall-clock limit in §17 — if exceeded, surface a blocker instead of improvising. |
| **Conventional commit** | A commit message in `<type>: <subject>` format (e.g. `content: write JBI core-java exception-handling Q's`). |
| **Wave** | A grouping of playbooks (A through F) that share dependencies and can ship together. |
| **Smoke test** | The 5-step manual check from `ROADMAP.md` that every launch playbook runs before declaring victory. |
| **Audit log** | A file under `content/_audits/` recording when an audit ran and what it found. |
| **Handoff** | A structured snapshot under `.cursor/handoffs/` that lets a fresh chat tab pick up where this one stopped. |

---

## How to use this glossary in a playbook

1. While writing the playbook, every time you introduce a domain term in
   §9–§14, check whether it's in this file.
2. If it is, just **use it** — the lint passes because the term is
   defined globally.
3. If it isn't, **add a row to the playbook's own §3** table. Do not
   silently add it to this global file; that requires a separate
   "glossary update" commit so the diff is reviewable.
4. After writing, run `scripts/lint_playbook.py expansion-plan/NN-*.md`.
   The lint asserts every non-trivial noun-phrase in §9 either appears in
   §3 of the playbook or in this file's master table.

## How to extend this glossary

This file grows by **explicit, reviewed commit**, not by drift. The
procedure:

1. A playbook author finds a term used in ≥ 3 playbooks that's not yet
   in this file.
2. Author opens a one-line PR adding the term to the right alphabetical
   section above.
3. PR is reviewed by anyone with merge rights; merged in ≤ 24 hours.
4. Author re-runs the lint on every playbook that used the term to
   confirm the new entry resolves the lint.

Reject entries that:

- Use marketing language.
- Are longer than one sentence.
- Fail to name a concrete anchor when one is obvious.
- Duplicate a term already in this file (search before adding).
