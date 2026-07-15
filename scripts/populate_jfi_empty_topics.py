#!/usr/bin/env python3
"""One-shot: fill empty complete-qa.json topics under java-fullstack-intermediate."""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "content" / "java-fullstack-intermediate"
LAST = "2026-04-24"
TAGS = ["google", "meta", "microsoft", "uber", "flipkart", "razorpay", "swiggy"]


def sec(t: str, title: str, content: str) -> dict:
    return {"type": t, "title": title, "content": content}


def pack(
    *,
    oid: str,
    slug: str,
    question: str,
    title: str,
    direct: str,
    testing: str,
    mistake: str,
    stand_out: str,
    overview: str,
    deep: str,
    pitfalls: str,
    keys: str,
    verbal: str,
    followups: list[str],
    meta_title: str,
    meta_desc: str,
    layout: str = "default",
    difficulty: str = "medium",
    importance: str = "high",
    minutes: int = 6,
    order: int = 1,
) -> dict:
    return {
        "id": oid,
        "slug": slug,
        "question": question,
        "title": title,
        "direct_answer": direct,
        "layout_type": layout,
        "difficulty": difficulty,
        "importance": importance,
        "reading_time_minutes": minutes,
        "last_updated": LAST,
        "interviewer_intent": {
            "testing": testing,
            "common_mistake": mistake,
            "to_stand_out": stand_out,
        },
        "company_tags": TAGS,
        "answer": {
            "sections": [
                sec("overview", "Framing", overview),
                sec("step", "Walkthrough", deep),
                sec("pitfalls", "Pitfalls", pitfalls),
                sec(
                    "key_points",
                    "Key points",
                    keys,
                ),
                sec("speakable_answer", "Verbal answer", verbal),
            ]
        },
        "followup_questions": followups,
        "seo": {"metaTitle": meta_title, "metaDescription": meta_desc},
        "order": order,
    }


def write_topic(rel: str, topic: str, topic_slug: str, questions: list[dict]) -> None:
    path = ROOT / rel / "complete-qa.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(
            {"topic": topic, "topicSlug": topic_slug, "questions": questions},
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print("wrote", path.relative_to(REPO))


def main() -> None:
    # --- web-performance-seo / scenario-based ---
    write_topic(
        "web-performance-seo/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="perf-scn-lcp-regression",
                slug="perf-scn-lcp-regression",
                question="After a release, LCP regressed on mobile. How do you investigate end-to-end?",
                title="LCP Regression After Deploy — Investigation Playbook",
                direct="Start by confirming the regression in **field data** (RUM) vs **lab** (Lighthouse/WebPageTest). Segment by **device, geography, connection**, and **page template**. In lab, use **Performance panel** filmstrip, **network dependency tree**, and **LCP element** attribution. Common causes are **hero image without priority hints**, **render-blocking JS/CSS**, **font swap layout**, or **client-only hydration** moving the LCP element.",
                testing="RUM vs lab, LCP element attribution, INP interaction, regressions tied to deploy diff (bundle size, third parties)",
                mistake="Optimizing CLS or FID when the metric that moved is LCP — chasing the wrong Core Web Vital",
                stand_out="Mention **fetchpriority=high**, **preload** for critical LCP image, **HTTP cache/CDN** for HTML, and **feature flag rollback** while you bisect",
                overview="Senior interviewers want a **methodical** story: verify → isolate template → tie to release artifact → fix and guard in CI.",
                deep="### Steps\n1. **RUM dashboards** — p75 LCP by route and device; compare to previous version.\n2. **Reproduce in lab** with throttled CPU/network; record trace.\n3. **Largest Contentful Paint** candidate — which DOM node, which resource?\n4. **Diff deploy** — bundle analyzer, new third-party tag, image pipeline.\n5. **Mitigation** — preload/priority, code-split below fold, defer non-critical JS.\n6. **Prevent** — performance budget in CI, RUM alerts on LCP regression.",
                pitfalls="### Pitfalls\n- Ignoring **element timing** and guessing from bundle size alone.\n- Testing only on fast office Wi-Fi.\n- Shipping **soft navigations** (SPA) without checking LCP on route transitions.",
                keys="- Segment field vs lab\n- Attribute the **LCP element**\n- Tie to **release diff**\n- Guard with **budgets + RUM**",
                verbal="I’d confirm in RUM that LCP actually moved for the same routes and devices, reproduce with a trace, read which element is LCP and what resource blocked it, then diff the release for images, fonts, and JS. I’d roll forward a targeted fix—usually image priority or render-blocking—and add a CI budget or RUM alert so it doesn’t slip again.",
                followups=[
                    "How does INP relate to LCP investigations?",
                    "What is element timing?",
                    "How do you set performance budgets in CI?",
                ],
                meta_title="LCP Regression Investigation (2026) | Web Performance Interview",
                meta_desc="Field vs lab, LCP element attribution, deploy bisection, and prevention with budgets and RUM.",
            ),
            pack(
                oid="perf-scn-seo-spa",
                slug="perf-scn-seo-spa",
                question="We ship a large SPA. How do you balance SEO and client-side performance?",
                title="SEO + SPA — Prerender, SSR, and Crawl Budget",
                direct="Pure CSR hurts **first meaningful HTML** for crawlers and slow users. Options: **prerender** critical routes, **SSR/SSG** for marketing and listing pages, **dynamic rendering** only when required, and **clean URLs + meta** per route. Balance **TTFB vs TTI**: more SSR improves HTML but can shift cost to the server and complicate caching.",
                testing="When CSR is acceptable, hybrid models (SSG islands + SPA shell), canonical/hreflang, structured data delivery",
                mistake="Duplicating thin pages for every query string without canonicals — SEO noise and crawl waste",
                stand_out="Reference **meta rendering in RSC/App Router**, **edge SSR**, and **partial prerendering** as modern hybrids",
                overview="Show you can split **public indexable surfaces** from **authenticated app** shells.",
                deep="### Approach\n- **Inventory** which routes must rank vs app-only.\n- **SSG/SSR** for landing, docs, product grids; CSR for post-login console.\n- **Meta & JSON-LD** delivered in first HTML for bots.\n- **Performance**: stream HTML, defer hydration, lazy third parties.\n- **Measure** with Search Console + CWV.",
                pitfalls="### Pitfalls\n- Client-only `document.title` updates without SSR for first hit.\n- Infinite facet URLs without `noindex` or canonical discipline.",
                keys="- Hybrid rendering by route\n- First HTML carries **meta + structured data**\n- Watch **TTFB vs TTI** trade-offs",
                verbal="I’d separate marketing routes that need SEO from the authenticated SPA. For SEO routes I’d ship real HTML with meta and schema—SSG or SSR at the edge where it helps—and keep heavy interactivity client-side with deferred hydration. I’d enforce canonicals and watch Core Web Vitals so we don’t win crawl but lose ranking on experience.",
                followups=[
                    "What is dynamic rendering?",
                    "How does React Server Components change this?",
                    "How do you handle hreflang in SPAs?",
                ],
                meta_title="SEO and SPA Trade-offs (2026) | Fullstack Interview",
                meta_desc="Hybrid SSR/SSG, prerender, canonical discipline, and performance balance for SPAs.",
                order=2,
            ),
        ],
    )

    # react-routing-forms / scenario-based
    write_topic(
        "react-routing-forms/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="rrf-scn-wizard",
                slug="rrf-scn-wizard",
                question="Design a multi-step checkout wizard with React Router v6 and preserved state on refresh.",
                title="Multi-Step Wizard — Router State, Persistence, and UX",
                direct="Use **nested routes** per step, **Outlet** for step layout, and **loader/action** (or a data layer) to fetch step prerequisites. Persist draft to **sessionStorage** or the **server** keyed by checkout id in the URL (`/checkout/:id/step`). On refresh, **rehydrate** from storage/API. Avoid losing progress by coupling **URL step** with **server-side session** for payment compliance.",
                testing="Nested routes, URL as source of truth, persistence strategy, back/forward behavior, validation per step",
                mistake="Storing PCI-sensitive fields in localStorage or putting secrets only in client state",
                stand_out="Mention **useBlocker** for unsaved changes and **transition pending UI** during navigation",
                overview="Interviewers listen for **URL design**, **persistence**, and **safe handling** of payments data.",
                deep="### Design\n- `/checkout/:id/contact` → `payment` → `confirm` nested under a layout route.\n- **Loader** validates step access (paid? cart empty?).\n- **State**: server session + minimal client cache; `sessionStorage` for non-sensitive UX drafts.\n- **Refresh**: read `id` from URL, pull server snapshot.\n- **Validation**: step-level schema (Zod) before `navigate` forward.",
                pitfalls="### Pitfalls\n- Giant single route with hidden steps — breaks deep links and analytics.\n- Skipping **idempotency** on payment submission.",
                keys="- Nested routes + **loaders**\n- **URL id** for rehydrate\n- Sensitive data **never** in localStorage",
                verbal="I’d model each step as a nested route under a checkout id in the URL, use loaders to gate steps, and persist non-sensitive draft state to sessionStorage while the canonical cart lives on the server. On refresh I’d reload by id so users don’t lose progress, and I’d block navigation if a step is dirty.",
                followups=[
                    "How do React Router loaders compare to Remix?",
                    "How do you handle browser back on step 3?",
                ],
                meta_title="Multi-Step React Router Wizard (2026) | Interview",
                meta_desc="Nested routes, loaders, persistence on refresh, and safe checkout patterns.",
                order=1,
            ),
            pack(
                oid="rrf-scn-guard-loader",
                slug="rrf-scn-guard-loader",
                question="How do you protect a route that needs the user AND preloaded account data before render?",
                title="Protected Routes — Loaders, Redirects, and Error Boundaries",
                direct="Use a **parent loader** that reads the session token, fetches `/me`, and **throws redirect** to login if 401. Child routes inherit resolved context via **useRouteLoaderData**. For errors, map **403** to a fallback page and surface **retry** affordances. Keep token refresh **out of render**—in the loader or a dedicated auth provider.",
                testing="Loader-based auth, redirect vs render-null flash, caching loader data, SSR considerations if any",
                mistake="Checking auth only in `useEffect` so protected content flashes before redirect",
                stand_out="Note **cookie-based auth** vs `Authorization` header for SSR and CSRF implications",
                overview="Strong answers center **loaders as the gate** before UI paints.",
                deep="### Pattern\n- Root loader: session + user profile.\n- Protected layout: `if (!user) throw redirect('/login')`.\n- Child loaders assume user exists and fetch domain data.\n- Optional **errorElement** on the protected branch for 403/500.\n- Client-only apps still benefit from loader ordering vs effect chains.",
                pitfalls="### Pitfalls\n- Double-fetching `/me` on every child navigation without defer/reuse.",
                keys="- **Loader-first** auth\n- **redirect** not conditional render flash\n- Centralized **errorElement**",
                verbal="I’d put auth in a parent route loader so we never paint protected UI without a user. The loader would fetch profile or throw redirect to login, and children would read loader data instead of duplicating fetches. I’d attach an error boundary route for forbidden states.",
                followups=[
                    "How does this map to Next.js middleware?",
                    "Where do you refresh tokens?",
                ],
                meta_title="React Router Protected Routes & Loaders (2026)",
                meta_desc="Loader gating, redirects, profile preload, and error boundaries for protected areas.",
                order=2,
            ),
        ],
    )

    # react-testing / e2e-with-cypress + scenario-based
    write_topic(
        "react-testing/e2e-with-cypress",
        "E2E with Cypress",
        "e2e-with-cypress",
        [
            pack(
                oid="cypress-selectors-network",
                slug="cypress-selectors-network",
                question="How do you write stable Cypress tests for a React app with dynamic data-testid vs role-based queries?",
                title="Cypress Selectors — data-cy vs Testing Library Queries",
                direct="Prefer **accessible queries** (`findByRole`, `findByLabelText`) where they reflect user behavior. Use **`data-cy`** when roles are ambiguous (maps, charts) or when third-party widgets lack labels. **Never** select on CSS classes or implementation details that churn. Combine with **network stubs** (`cy.intercept`) for deterministic data.",
                testing="Selector strategy, retries, intercept patterns, flake reduction",
                mistake="Chaining long XPath/CSS paths that break on any style refactor",
                stand_out="Mention **Cypress component testing** for isolating complex widgets before E2E",
                overview="Interviewers want **stability philosophy**, not just API names.",
                deep="### Strategy\n- Default to **role + name** aligned with RTL.\n- Add `data-cy` for canvas/svg-heavy UI.\n- Centralize selectors in **page objects**.\n- Stub slow or flaky APIs; seed **fixtures**.\n- Use **should with implicit retries** correctly—avoid fixed waits.",
                pitfalls="### Pitfalls\n- `cy.wait(3000)` everywhere.\n- Assertions before async UI settles.",
                keys="- **Role-first**, `data-cy` when needed\n- **intercept** for determinism\n- Avoid arbitrary **timeouts**",
                verbal="I default to role and label queries like I would in RTL so tests track user intent. When that’s brittle—charts or custom widgets—I add data-cy hooks. I stub network with intercept and page objects so refactors don’t break selectors.",
                followups=[
                    "How do you avoid flake on animations?",
                    "Cypress vs Playwright trade-offs?",
                ],
                meta_title="Cypress Stable Selectors & Network Stubbing (2026)",
                meta_desc="data-cy vs role queries, intercept, and flake reduction for React E2E.",
            ),
            pack(
                oid="cypress-ci-parallel",
                slug="cypress-ci-parallel",
                question="How do you run Cypress in CI with parallelization and artifacts when tests fail?",
                title="Cypress in CI — Parallel Runs, Videos, and Traces",
                direct="Split specs across **parallel CI jobs** (Cypress Dashboard or shard matrix). Record **videos/screenshots** on failure only to save time. Pin **browser version**, use **docker** image matching local, and cache **node_modules**. Fail fast on **smoke** suite then run full nightly.",
                testing="Sharding, deterministic seeds, artifact policy, retries ethics",
                mistake="Retrying flaky tests indefinitely without fixing root cause",
                stand_out="Mention **record key** security and **splitting by timing** to balance shards",
                overview="Show you treat E2E as **engineering product**, not a local script.",
                deep="### CI layout\n- Job 1: install + build + serve static or start dev server.\n- Matrix: shard by spec pattern.\n- Upload **mochawesome** or Cypress cloud traces.\n- Env: `CYPRESS_baseUrl`, secrets via CI vault.\n- Quarantine **known flake** with owner and deadline.",
                pitfalls="### Pitfalls\n- Running E2E against production-like data without anonymization.",
                keys="- **Shard** specs\n- **Artifacts on fail**\n- Pin **browser** + Docker",
                verbal="I’d parallelize by sharding specs in CI, record screenshots or traces on failure, and pin the browser in Docker so local matches CI. I’m cautious with automatic retries—I use them sparingly and track flakes as debt.",
                followups=[
                    "How do you seed data for E2E?",
                    "What is your smoke vs full suite split?",
                ],
                meta_title="Cypress CI Parallelization & Artifacts (2026)",
                meta_desc="Sharding Cypress in CI, artifacts on failure, Docker parity, and flake policy.",
                order=2,
            ),
        ],
    )

    write_topic(
        "react-testing/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="rtl-msw-scenario",
                slug="rtl-msw-scenario",
                question="Walk through testing a data table that fetches paginated users with MSW and React Testing Library.",
                title="RTL + MSW — Paginated Table Integration Test",
                direct="**MSW** stubs `GET /users?page=` with deterministic JSON. Render with RTL, **await** rows with `findByRole`, assert **loading then success** states. Simulate **next page** click and expect new rows from handler. Keep handlers colocated in `handlers.ts` and reset server per test.",
                testing="MSW setup, async queries, pagination behavior, error path",
                mistake="Using `getBy` immediately without awaiting network—false failures",
                stand_out="Show **server.use** override for a 500 case and assert error UI",
                overview="This is the standard **integration** pattern senior FE interviews expect.",
                deep="### Flow\n1. `setupServer().listen()` in setupTests.\n2. Handler returns page 1 then page 2 based on query.\n3. Render `<UserTable />`.\n4. `expect(await screen.findByText('Alice'))`.\n5. `await user.click(nextPage)`.\n6. `await screen.findByText('Zara')`.\n7. Error: override handler to 500, assert alert region.",
                pitfalls="### Pitfalls\n- Sharing mutable global state between tests without reset.\n- Coupling tests to exact row order when sort is non-deterministic.",
                keys="- **MSW** deterministic API\n- **`findBy`** for async\n- **Per-test reset**",
                verbal="I’d stub the paginated API with MSW, render the table, wait for the first page with findBy queries, click next, and assert the second page payload shows. I’d also override the handler to simulate a 500 and assert the error state. I reset handlers after each test to avoid bleed.",
                followups=[
                    "MSW vs mocking axios directly?",
                    "How do you test infinite scroll?",
                ],
                meta_title="RTL + MSW Paginated Table Test (2026)",
                meta_desc="Integration testing with MSW handlers, async RTL queries, and error paths.",
            ),
        ],
    )

    # angular-core / comparisons
    write_topic(
        "angular-core/comparisons",
        "Comparisons",
        "comparisons",
        [
            pack(
                oid="angular-onpush-vs-default",
                slug="angular-onpush-vs-default",
                question="ChangeDetectionStrategy.Default vs OnPush — when and why?",
                title="Angular Change Detection — Default vs OnPush",
                direct="**Default** checks the component subtree whenever Angular runs change detection globally—more work, simpler mental model. **OnPush** runs when **inputs change by reference**, **events** originating in the template, **async pipe** emissions, or **manual markForCheck**. OnPush reduces cycles and aligns with **immutable inputs**.",
                testing="Input reference equality, async pipe, markForCheck vs detectChanges, performance implications",
                mistake="Mutating `@Input` object fields without changing reference—OnPush misses updates",
                stand_out="Mention **signals** changing how often you need markForCheck in modern Angular",
                overview="Classic Angular senior topic—tie strategy to **data flow**.",
                deep="### Default\n- Predictable but can be hot on large trees.\n### OnPush\n- Coerce immutable `@Input()` data.\n- Prefer `async` pipe over manual subscription + CD.\n- Use `ChangeDetectorRef.markForCheck` when bridging zoneless/async boundaries carefully.",
                pitfalls="### Pitfalls\n- Calling `detectChanges` everywhere—defeats OnPush benefits and can cause hard-to-debug loops.",
                keys="- OnPush + **immutable inputs**\n- **Async pipe** ties CD to stream\n- Avoid **deep mutation** of inputs",
                verbal="Default runs CD whenever Angular ticks, which is easy but expensive. OnPush limits checks to input reference changes, template events, async pipe updates, or explicit markForCheck. I use OnPush for most feature components with immutable state and async pipe, and I’m careful not to mutate input objects in place.",
                followups=[
                    "What triggers CD with signals?",
                    "OnPush with NgRx selectors?",
                ],
                meta_title="Angular OnPush vs Default Change Detection (2026)",
                meta_desc="When to use OnPush, immutability, async pipe, and markForCheck patterns.",
            ),
            pack(
                oid="angular-standalone-vs-ngmodule",
                slug="angular-standalone-vs-ngmodule",
                question="Standalone components vs NgModules — how do you decide in a brownfield app?",
                title="Standalone vs NgModules — Migration and Boundaries",
                direct="**Standalone** components declare imports directly—fewer barrels, better tree-shaking ergonomics, aligns with **router lazy loading** and **signal-first** docs. **NgModules** still appear in legacy apps for shared `SharedModule` patterns. Pragmatic approach: **new code standalone**, migrate hotspots incrementally, use **`importProvidersFrom`** for DI bridging.",
                testing="Routing standalone, DI providers scope, testing story, migration risk",
                mistake="Duplicating provider registrations in every standalone component—use `ApplicationConfig` or feature providers",
                stand_out="Reference **`bootstrapApplication`** and **route-level providers** for boundaries",
                overview="Show migration **judgement**, not 'modules are dead'.",
                deep="### Guidance\n- Greenfield: standalone + route providers.\n- Brownfield: extract leaf components first; keep root `AppModule` until routing migrated.\n- Shared UI: `export` arrays become direct `imports` arrays.\n- Third-party libs still sometimes need `importProvidersFrom`.",
                pitfalls="### Pitfalls\n- Wild cross-import graphs after deleting `SharedModule` discipline.",
                keys="- **New code** → standalone\n- **importProvidersFrom** for libs\n- Incremental **migration**",
                verbal="For new Angular work I go standalone with explicit imports per component. In brownfields I migrate leaf features first and keep NgModules where they still add clarity, using importProvidersFrom when a library expects a module. I watch provider scope so we don’t accidentally create multiple singletons.",
                followups=[
                    "How do environment providers differ?",
                    "How do you lazy load standalone routes?",
                ],
                meta_title="Angular Standalone vs NgModules (2026) | Interview",
                meta_desc="Migration strategy, DI boundaries, importProvidersFrom, and brownfield pragmatism.",
                order=2,
            ),
        ],
    )

    # angular-rxjs / scenario-based
    write_topic(
        "angular-rxjs/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="rxjs-scn-typeahead",
                slug="rxjs-scn-typeahead",
                question="Build a typeahead search that cancels in-flight HTTP calls when the user types quickly.",
                title="Typeahead with switchMap — Cancel Stale HTTP Requests",
                direct="Model input as **`Subject` or `fromEvent`**, **`debounceTime`** to reduce chatter, **`distinctUntilChanged`**, then **`switchMap`** to the HTTP observable so each new emission **unsubscribes** the prior inner subscription—canceled XHR with `switchMap` semantics. Handle errors inside the inner stream with **`catchError`** returning `EMPTY` or a fallback.",
                testing="switchMap vs mergeMap, debounce tuning, error handling, unsubscribed requests",
                mistake="Using mergeMap for typeahead—shows stale results out of order",
                stand_out="Mention **`exhaustMap`** for submit buttons and **`takeUntil`** teardown pattern",
                overview="Classic RxJS scenario—prove you know **cancellation**.",
                deep="### Pipeline\n`input$.pipe(debounceTime(200), distinctUntilChanged(), switchMap(term => this.api.search(term).pipe(catchError(() => EMPTY))))`.\n- `switchMap` unsubscribes previous inner observable.\n- Add `finalize` for loading spinner.\n- Test with marble diagrams or HttpTestingController.",
                pitfalls="### Pitfalls\n- Forgetting `distinctUntilChanged` → redundant identical searches.\n- Swallowing errors without user feedback.",
                keys="- **`switchMap`** cancels stale\n- **debounce** + **distinct**\n- **`catchError`** per inner emission",
                verbal="I’d pipe the input through debounce and distinctUntilChanged, then switchMap into the HTTP call so only the latest request matters. switchMap unsubscribes the previous request, which avoids stale results. I handle errors inside the inner observable so one failure doesn’t kill the whole stream.",
                followups=[
                    "When would you use exhaustMap in search?",
                    "How do you test this with HttpClientTestingModule?",
                ],
                meta_title="RxJS Typeahead switchMap Pattern (2026) | Angular Interview",
                meta_desc="debounceTime, distinctUntilChanged, switchMap for cancelable HTTP typeahead.",
            ),
        ],
    )

    # angular-forms-router / scenario-based
    write_topic(
        "angular-forms-router/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="afr-scn-async-validator",
                slug="afr-scn-async-validator",
                question="Username availability must hit the API. How do you implement an async validator without hammering the server?",
                title="Async Validator — Debounce, Switch, and UX States",
                direct="Use **`AsyncValidatorFn`** returning `Observable<ValidationErrors | null>`. Debounce value changes (**`debounceTime`** in the stream or `updateOn: 'blur'` / `pendingChangeEvent` strategies), **`switchMap`** to the HTTP check, and map **409** to `{ taken: true }`. Show **pending** state in template with `pending` flag from `statusChanges`.",
                testing="AsyncValidatorFn, debounce strategy, cancelation, error mapping, pending UI",
                mistake="Firing API on every keystroke without debounce or switch—rate limits and janky UI",
                stand_out="Mention **`distinctUntilChanged`** and server-side **slugify** validation consistency",
                overview="Forms + HTTP + RxJS integration is a common **fullstack Angular** scenario.",
                deep="### Implementation notes\n- `AbstractControl` async validators run after sync validators pass.\n- Prefer **debounced** value pipeline or blur-triggered validation for expensive checks.\n- `switchMap` ensures only the latest username check applies.\n- Surface `pending` via `control.pending` in UI.\n- On destroy, rely on HttpClient cancelation from `switchMap` unsubscribe.",
                pitfalls="### Pitfalls\n- Returning thrown errors instead of `ValidationErrors`—breaks form state.\n- Not handling **slow network** UX (spinner vs disabled submit).",
                keys="- **`AsyncValidatorFn` + debounce**\n- **`switchMap`** latest only\n- **`pending`** UI",
                verbal="I’d add an async validator on the username control that pipes value changes with debounce and switchMap into an HTTP uniqueness check, mapping a 409 to a taken error. I’d show pending state while validating and cancel stale checks automatically when switchMap unsubscribes the prior request.",
                followups=[
                    "updateOn blur vs change for async validators?",
                    "How do you unit test async validators?",
                ],
                meta_title="Angular Async Validator Debounce Pattern (2026)",
                meta_desc="AsyncValidatorFn with debounceTime, switchMap, pending UI, and error mapping.",
            ),
        ],
    )

    # angular-state-testing — akita, component-testing, e2e cypress, scenario
    write_topic(
        "angular-state-testing/akita-and-alternatives",
        "Akita & Alternatives",
        "akita-and-alternatives",
        [
            pack(
                oid="akita-vs-ngrx",
                slug="akita-vs-ngrx",
                question="When would you pick Akita or NgRx Component Store over full NgRx store?",
                title="Akita vs NgRx — Feature State and Boilerplate Trade-offs",
                direct="**Full NgRx** shines for large apps needing **devtools**, **entity** patterns, **effects**, and strict **unidirectional** flow. **Component Store** (or **SignalStore**) is great for **localized feature state** with less boilerplate. **Akita** offers **active entity** patterns and **Query** observables with a smaller ceremony than classic NgRx—good for CRUD-heavy modules if your team already adopted it.",
                testing="State scope, team familiarity, testability, migration from services-with-subjects",
                mistake="Introducing global store for a single screen’s transient UI state",
                stand_out="Mention **SignalStore** as the modern default for many new Angular codebases",
                overview="Judgement call: **scope + team + tooling**.",
                deep="### Heuristics\n- Cross-feature shared cache with time-travel debugging → **NgRx Store**.\n- Single smart component island → **Component Store / signals**.\n- Legacy Akita codebases → lean on **Query.select** patterns; avoid mixing three paradigms without boundaries.",
                pitfalls="### Pitfalls\n- Two sources of truth for the same entity in Akita **and** NgRx simultaneously.",
                keys="- **Global** vs **local** state\n- **Devtools** requirement\n- Prefer **one** dominant pattern per feature",
                verbal="I pick NgRx store when multiple features need the same normalized entities and we want devtools and strict side effects in effects. For contained widgets I’d use Component Store or SignalStore. Akita can be a pragmatic fit if the team already invested in it—I'd avoid mixing stores for the same domain without clear boundaries.",
                followups=[
                    "How does SignalStore compare?",
                    "How do you test NgRx effects?",
                ],
                meta_title="Akita vs NgRx vs Component Store (2026) | Angular Interview",
                meta_desc="Choosing state libraries by scope, boilerplate, devtools, and team familiarity.",
            ),
        ],
    )

    write_topic(
        "angular-state-testing/component-testing",
        "Component Testing",
        "component-testing",
        [
            pack(
                oid="angular-shallow-vs-integration",
                slug="angular-shallow-vs-integration",
                question="Shallow vs integration component tests in Angular — how do you balance speed and confidence?",
                title="Angular Component Tests — Shallow vs Integration",
                direct="**Shallow** tests **`NO_ERRORS_SCHEMA`** or **stub child components** to isolate the unit—fast, brittle to template refactors if over-stubbed. **Integration** uses **TestBed** with **real child components** and sometimes **HttpTestingController**—slower, catches wiring bugs. Use shallow for algorithmic/pure UI; integration for **smart containers** and **router outlets**.",
                testing="TestBed configuration, overrideComponent, fixture.detectChanges, async stability",
                mistake="Over-mocking the template so the test never fails when bindings break",
                stand_out="Mention **Harnesses** for Material components for stable interaction",
                overview="Balance **speed vs realism** with clear rules.",
                deep="### Shallow\n- `CUSTOM_ELEMENTS_SCHEMA` cautiously.\n- Stub heavy children with `component` class doubles.\n### Integration\n- `RouterTestingModule`, `ReactiveFormsModule` real wiring.\n- Prefer user-centric queries (`debugElement.query(By.css('[data-testid]'))` or harness).\n- `fixture.whenStable()` for async.",
                pitfalls="### Pitfalls\n- Testing private methods instead of observable outputs.",
                keys="- **Shallow** for pure units\n- **Integration** for containers\n- **Harnesses** for Material",
                verbal="I use shallow tests when I want to focus on a component’s logic with children stubbed out for speed. For containers that coordinate router, forms, and services, I prefer integration tests with TestBed and real child wiring so we catch binding mistakes. For Material I’d reach for component harnesses to avoid brittle selectors.",
                followups=[
                    "How do you test standalone components?",
                    "What is ComponentFixtureAutoDetect?",
                ],
                meta_title="Angular Shallow vs Integration Tests (2026)",
                meta_desc="TestBed strategies, stubbing children, harnesses, and when to integrate.",
            ),
        ],
    )

    write_topic(
        "angular-state-testing/e2e-with-cypress",
        "E2E with Cypress",
        "e2e-with-cypress",
        [
            pack(
                oid="angular-cypress-config",
                slug="angular-cypress-config",
                question="How do you configure Cypress for an Angular CLI app served on a non-default port with API intercepts?",
                title="Cypress + Angular CLI — baseUrl, DevServer, and cy.intercept",
                direct="Set **`baseUrl`** in `cypress.config.ts` to `http://localhost:4200` (or your port). Use **`devServerTarget`** (component testing) or start **`ng serve`** in CI before `cypress run`. Centralize **`cy.intercept`** in support files; align with **`environment.ts`** API base paths.",
                testing="Config separation, waiting for dev server, intercept glob patterns, auth headers",
                mistake="Hardcoding absolute URLs in every spec—breaks preview environments",
                stand_out="Mention **`task`** for DB seeding or calling a small Node helper in CI",
                overview="Practical wiring question for **Angular shops** using Cypress.",
                deep="### Setup\n- `baseUrl` + `viewportWidth` defaults.\n- CI: `start-server-and-test` pattern.\n- `intercept('**/api/**')` with static JSON fixtures.\n- Mirror Angular `environment.apiUrl` in Cypress env via `CYPRESS_` vars.",
                pitfalls="### Pitfalls\n- Forgetting to **`visit`** after `localStorage` seed for auth stubs.",
                keys="- **`baseUrl`** per env\n- **`intercept`** mirrors API\n- CI **serve + test** orchestration",
                verbal="I set Cypress baseUrl to the ng serve URL and in CI I orchestrate start-server-and-test so Cypress waits for the app. I centralize cy.intercept patterns for our API base path from Angular environments and avoid hardcoding hosts in specs by using relative paths.",
                followups=[
                    "Cypress component testing with Angular?",
                    "How do you stub Angular HTTP interceptors?",
                ],
                meta_title="Cypress Config for Angular Apps (2026) | Interview",
                meta_desc="baseUrl, dev server orchestration, cy.intercept, and environment alignment.",
            ),
        ],
    )

    write_topic(
        "angular-state-testing/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="ngrx-scn-effect-test",
                slug="ngrx-scn-effect-test",
                question="An NgRx effect loads users; how do you test success and failure without hitting the real API?",
                title="Testing NgRx Effects — Marble or HttpMock",
                direct="Use **`provideMockActions`** with a hot/cold **actions** stream, **`cold('-a', {a: loadUsers})`**, subscribe to the effect output, and assert **`toBeObservable`** expected actions. Alternatively **`HttpTestingController`** if the effect calls `HttpClient` directly. Flush errors with **`flushError`** to assert **`loadUsersFailure`**.",
                testing="Marble testing, provideMockActions, scheduler, error path",
                mistake="Subscribing to the real store in unit tests—slow and flaky",
                stand_out="Mention **`@ngrx/operators`** `concatLatestFrom` testing considerations",
                overview="Demonstrate **deterministic** effect testing.",
                deep="### Pattern\n- Arrange actions in with `hot`/`cold`.\n- Use `TestScheduler` for time-based operators.\n- Mock `UsersService` with `of` / `throwError`.\n- Expect `loadUsersSuccess` or `loadUsersFailure`.\n- `HttpTestingController` when effect uses HttpClient directly.",
                pitfalls="### Pitfalls\n- Not flushing HTTP when using HttpTestingController—open requests leak.",
                keys="- **provideMockActions**\n- **toBeObservable** / marbles\n- **HttpTestingController** alternative",
                verbal="I’d test effects by providing mock actions as marbles and asserting the dispatched output actions. If the effect calls HttpClient, I can use HttpTestingController to simulate success and error responses. I avoid bootstrapping the full store so the test stays fast and deterministic.",
                followups=[
                    "How do you test `concatLatestFrom`?",
                    "Functional vs class-based effects?",
                ],
                meta_title="Test NgRx Effects Without Real API (2026)",
                meta_desc="provideMockActions, marbles, HttpTestingController for success and failure paths.",
            ),
        ],
    )

    # auth-flows-frontend / scenario-based
    write_topic(
        "auth-flows-frontend/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="auth-scn-pkce-bff",
                slug="auth-scn-pkce-bff",
                question="Describe securing a SPA that calls a Java API using OAuth2 Authorization Code + PKCE with a BFF cookie session.",
                title="SPA + PKCE + BFF — Tokens Never in localStorage",
                direct="Browser performs **PKCE** code flow against IdP; **BFF** exchanges code server-side and stores **HttpOnly Secure SameSite** session cookie. SPA calls **same-site BFF** which attaches tokens or calls API with **mTLS / private network**. Tokens never touch **`localStorage`**, reducing **XSS** blast radius. CSRF protections required for **cookie** sessions.",
                testing="PKCE steps, BFF responsibilities, CSRF double-submit or SameSite=Lax patterns, refresh rotation",
                mistake="Returning access tokens to the SPA for storage in localStorage while claiming 'secure'",
                stand_out="Mention **token binding** / **DPoP** if interviewer goes deep on mobile + web parity",
                overview="Modern **fullstack auth** best practice narrative.",
                deep="### Flow\n1. SPA navigates to authorize with `code_challenge`.\n2. IdP returns `code` to BFF callback.\n3. BFF exchanges code + `code_verifier`.\n4. BFF sets session cookie; stores refresh server-side.\n5. SPA uses `fetch('/api', {credentials:'include'})`.\n6. BFF proxies to resource server with bearer from server session.",
                pitfalls="### Pitfalls\n- Missing **CSRF** on state-changing cookie endpoints.\n- Misconfigured **CORS credentials** blocking cookies.",
                keys="- **PKCE** public clients\n- **HttpOnly** session cookie\n- **BFF** token custody\n- **CSRF** discipline",
                verbal="I’d use authorization code with PKCE initiated from the SPA but complete the code exchange in a BFF so tokens live server-side behind an HttpOnly cookie. The SPA calls our own origin with credentials, and the BFF attaches the access token to upstream API calls. I’d implement CSRF defenses on mutating routes and rotate refresh tokens carefully.",
                followups=[
                    "What breaks if SameSite=None without Secure?",
                    "How does silent refresh work with BFF?",
                ],
                meta_title="PKCE SPA with BFF Cookie Session (2026) | Auth Interview",
                meta_desc="OAuth2 PKCE, BFF token custody, HttpOnly cookies, CSRF, and API proxying.",
            ),
        ],
    )

    # realtime-uploads / scenario-based
    write_topic(
        "realtime-uploads/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="rtu-scn-ws-reconnect",
                slug="rtu-scn-ws-reconnect",
                question="WebSocket drops on mobile networks. What is your client reconnection and message delivery strategy?",
                title="WebSocket Reconnect — Backoff, Idempotency, and Missed Messages",
                direct="Implement **exponential backoff** with **jitter**, cap max delay, and **resume** with **`Last-Event-ID`** or **cursor** ack from server if protocol supports it. Treat messages as **idempotent** where possible. Fall back to **HTTP long poll** when sockets blocked. Surface **offline** UX and **replay** buffer on reconnect.",
                testing="Backoff, heartbeat/ping-pong, dedupe keys, ordering guarantees, STOMP if applicable",
                mistake="Reconnecting instantly in a tight loop—DoS your own gateway",
                stand_out="Mention **circuit breaker** on server and **rate limits** for reconnect storms after deploy",
                overview="Production **real-time** hygiene.",
                deep="### Client\n- Track `readyState`; on close, schedule reconnect.\n- Maintain **monotonic sequence** per topic from server.\n- On open, send **resume token**.\n- Buffer unsent while offline; flush with backoff.\n### Server\n- Expire stale sessions; idempotent handlers.\n- Optional **Redis pub/sub** fanout behind gateway.",
                pitfalls="### Pitfalls\n- Assuming **exactly-once** delivery without server dedupe and client idempotency keys.",
                keys="- **Backoff + jitter**\n- **Resume cursor**\n- **Idempotent** handlers\n- **User-visible** offline state",
                verbal="I’d reconnect with exponential backoff and jitter to avoid hammering the gateway. I’d negotiate a resume cursor with the server so after reconnect we fetch missed events. I’d design handlers to be idempotent with client-generated keys for actions, and I’d degrade to long polling if WebSockets are blocked.",
                followups=[
                    "How does STOMP handle receipts?",
                    "What about ordering across shards?",
                ],
                meta_title="WebSocket Reconnection Strategy (2026) | Realtime Interview",
                meta_desc="Backoff, resume tokens, idempotency, and fallback when WebSockets drop.",
            ),
        ],
    )

    # frontend-build-tools / scenario-based
    write_topic(
        "frontend-build-tools/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="fbt-scn-webpack-vite",
                slug="fbt-scn-webpack-vite",
                question="The team wants to migrate from Webpack to Vite for a large React app. What is your risk-managed plan?",
                title="Webpack → Vite Migration — Phasing, Plugins, and CI",
                direct="Start with **inventory**: custom loaders, **Module Federation**, Node polyfills, **SSR** entry if any. Spike **Vite config** with **`@vitejs/plugin-react`**, replace loaders with **esbuild**/`rollup` plugins. Migrate **dev first** (fast HMR win), keep **production** parity tests. Run **bundle diff** and **Lighthouse CI**. Consider **dual build** temporarily for critical release branch.",
                testing="Plugin parity, env variables, dynamic imports, public assets path, Jest → Vitest optional",
                mistake="Assuming `require.context` webpackisms work unchanged",
                stand_out="Mention **`server.fs.allow`** monorepo roots and **pnpm** symlinks pitfalls",
                overview="Shows **engineering program management**, not zealotry.",
                deep="### Phases\n1. **Discovery** workshop + build graph.\n2. **Spike** one route slice on Vite dev.\n3. **Plugin mapping** table.\n4. **CI** matrix builds both until confidence.\n5. **Cutover** with feature flag on artifact choice if needed.\n6. **Post-cut** monitoring for asset 404s and env regressions.",
                pitfalls="### Pitfalls\n- Missing **BASE_URL** differences breaking router `homepage`.\n- **SSR** frameworks not 1:1 with plain Vite assumptions.",
                keys="- **Inventory** webpack-only features\n- **Dev-first** migration\n- **CI diff** + **Lighthouse**",
                verbal="I’d inventory webpack-only features like federation and custom loaders, then spike Vite on a slice of the app for dev while measuring prod bundles for parity. I’d map each loader to a Vite or Rollup plugin, adjust public path and env handling, and run dual CI until Lighthouse and smoke tests match. I’d watch monorepo symlink issues with server.fs.allow.",
                followups=[
                    "How do you handle Module Federation on Vite?",
                    "Vitest vs Jest migration?",
                ],
                meta_title="Webpack to Vite Migration Plan (2026) | Frontend Build Interview",
                meta_desc="Phased migration, plugin parity, CI safety, and monorepo pitfalls.",
            ),
        ],
    )

    # frontend-devops-ssr / comparisons + scenario-based
    write_topic(
        "frontend-devops-ssr/comparisons",
        "Comparisons",
        "comparisons",
        [
            pack(
                oid="fdd-ssr-csr-ssg-isr-compare",
                slug="fdd-ssr-csr-ssg-isr-compare",
                question="Compare SSR, CSR, SSG, and ISR for a content-heavy marketing site vs a logged-in dashboard.",
                title="Rendering Models — Marketing vs Dashboard",
                direct="**Marketing** benefits from **SSG/ISR** for SEO, fast TTFB at CDN edge, and predictable cache. **Dashboards** prioritize **CSR** or **SSR+hydration** for personalization and live data—SEO less relevant. **ISR** bridges freshness for semi-static catalogs without rebuilding entire site each minute.",
                testing="Cache keys, personalization vs edge cache, auth cookies with CDN, RSC note",
                mistake="ISR-stamping private user-specific HTML at the edge—cache poisoning risk",
                stand_out="Mention **partial prerendering** and **edge middleware** for auth gating",
                overview="Map **user + data sensitivity** to **rendering** choice.",
                deep="### Marketing\n- SSG for stable pages; ISR for product grids with `revalidate`.\n- CDN cache `s-maxage`, stale-while-revalidate.\n### Dashboard\n- CSR shell + client data fetching OR SSR for first paint with cookie session.\n- Avoid caching authenticated HTML at shared CDN without **private** mode.",
                pitfalls="### Pitfalls\n- Mixing **`Cache-Control: public`** with session-bound HTML.",
                keys="- **SSG/ISR** for SEO surfaces\n- **CSR/SSR** for personalized app\n- Watch **CDN cache** + **auth**",
                verbal="For marketing I’d default to SSG with ISR where freshness matters, so we get great SEO and edge performance. For logged-in dashboards I’d lean CSR or targeted SSR for first paint, and I’d never cache personalized HTML publicly at the CDN. ISR is great for catalogs that change often without full rebuilds.",
                followups=[
                    "What is stale-while-revalidate?",
                    "How does Next.js ISR differ from SSG?",
                ],
                meta_title="SSR vs CSR vs SSG vs ISR for Marketing vs App (2026)",
                meta_desc="Choosing rendering models for SEO, personalization, CDN caching, and dashboards.",
            ),
            pack(
                oid="fdd-next-vs-angular-universal",
                slug="fdd-next-vs-angular-universal",
                question="How does Next.js App Router SSR differ from Angular Universal in operational complexity?",
                title="Next.js App Router vs Angular Universal — Ops and Mental Model",
                direct="**Next** integrates routing, data fetching (`fetch` cache tags), and deployment **Vercel/Node** assumptions—great DX, opinionated cache layers. **Angular Universal** adds SSR to **CLI** builds with **platform-server**; ops often pair with **custom Node** or **NGINX** and handle **Zone.js** + hydration carefully. Both need **memory/CPU** planning for SSR; Next’s caching primitives are more **first-class** in 2026 docs mindshare.",
                testing="Caching tags, incremental adoption, deployment targets, transferState",
                mistake="Ignoring **double data fetch** without `transferState` in Angular SSR",
                stand_out="Mention **Resumability** / **partial hydration** trends at high level",
                overview="Compare **framework integration** and **SSR pitfalls**.",
                deep="### Next App Router\n- Server Components default boundaries; cache directives.\n- Edge vs Node runtimes.\n### Angular Universal\n- `AngularNodeAppEngine`, `provideClientHydration`.\n- `TransferState` to avoid refetch.\n### Ops\n- Cold starts, per-request heap, logging, tracing across SSR + API.",
                pitfalls="### Pitfalls\n- **Hydration mismatch** from `Date.now()` or random IDs without client-only guards.",
                keys="- Next **cache primitives**\n- Angular **TransferState**\n- Shared **SSR ops** concerns",
                verbal="Next’s App Router bakes in server components and fetch caching with clear deployment stories, which lowers glue code. Angular Universal gives SSR via platform-server but I need to wire TransferState to avoid double fetch and watch Zone/hydration mismatches. Operationally both need SSR sizing, logging, and careful cache headers.",
                followups=[
                    "What causes hydration errors?",
                    "How do you deploy Universal behind NGINX?",
                ],
                meta_title="Next App Router vs Angular Universal SSR (2026)",
                meta_desc="Caching, TransferState, hydration, and operational differences.",
                order=2,
            ),
        ],
    )

    write_topic(
        "frontend-devops-ssr/scenario-based",
        "Scenario-Based",
        "scenario-based",
        [
            pack(
                oid="fdd-scn-next-k8s",
                slug="fdd-scn-next-k8s",
                question="You deploy a Next.js SSR app to Kubernetes. What health checks, probes, and resource limits do you set?",
                title="Next.js on Kubernetes — Probes, Concurrency, and Graceful Shutdown",
                direct="Expose **`/health`** separate from deep readiness if needed. **`readinessProbe`** hits a cheap route once server listens; **`livenessProbe`** avoids SSR-heavy paths. Set **CPU/memory requests+limits** from load test p95; tune **`max_old_space_size`** if Node heap spikes. **`preStop` hook** + **`terminationGracePeriodSeconds`** drain in-flight SSR during rollouts.",
                testing="Startup vs readiness, SSR latency under load, HPA signals, zero-downtime deploy",
                mistake="Probing `/` which triggers expensive SSR causing kube to kill healthy pods",
                stand_out="Mention **PDB** `maxUnavailable` and **ingress** timeouts aligned with SSR p99",
                overview="Connect **frontend SSR** to **SRE** basics.",
                deep="### Probes\n- Readiness: lightweight route or TCP if only verifying bind early.\n- Liveness: same but conservative thresholds.\n### Resources\n- Load test SSR RPS → CPU.\n- Horizontal Pod Autoscaler on CPU + custom metrics (queue depth) if available.\n### Rollouts\n- `preStop` sleep to let LB drain.\n- Configure **keep-alive** between ingress and pod.",
                pitfalls="### Pitfalls\n- **OOME** during traffic spikes—requests limits too tight without HPA headroom.",
                keys="- **Cheap** health endpoints\n- **preStop** drain\n- Right-size **heap** + **HPA**",
                verbal="I’d add a cheap health endpoint for readiness and avoid probing heavy SSR routes for liveness. I’d size requests and limits from load tests of SSR concurrency and set Node heap flags if needed. For rollouts I’d use preStop and a reasonable termination grace so in-flight requests finish before the pod dies, and I’d align ingress timeouts with SSR tail latency.",
                followups=[
                    "How do you debug SSR memory leaks in kube?",
                    "What metrics do you alert on?",
                ],
                meta_title="Next.js SSR on Kubernetes Probes (2026) | Interview",
                meta_desc="readiness/liveness probes, preStop drain, heap sizing, and HPA for Next SSR.",
            ),
        ],
    )

    print("done")


if __name__ == "__main__":
    main()
