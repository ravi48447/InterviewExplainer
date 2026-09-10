# Phase 01 Decision Log (P01-T324)

Records the significant design/engineering decisions made during Phase 01, with rationale.

## D1 — Token system uses `hsl(var(--token))` + alpha modifiers

**Decision:** All colors are HSL channel triplets stored as CSS variables, consumed via `hsl(var(--token))` or `hsl(var(--token) / alpha)`.

**Why:** HSL with separate alpha composition lets every color derive translucent variants (hover states, tints, overlays) without a separate token per opacity. Matches the shadcn convention so the existing 50+ Radix components keep working.

**Trade-off:** Slightly more verbose than `oklch`. Accepted for ecosystem compatibility.

## D2 — Layout primitives are CSS classes + React wrappers

**Decision:** Layout primitives (stack, cluster, grid, split-layout, etc.) are defined as CSS utility classes in `globals.css` and exposed as thin React components that apply the class.

**Why:** Single source of truth — the CSS class is canonical; the component is ergonomic sugar. Call sites that can't use the component (e.g. raw HTML in markdown) still get the class. Avoids duplicating layout logic in JS and CSS.

## D3 — Button keeps legacy variant aliases

**Decision:** `variant="default"`, `"accent"`, `"success"`, `"premium"`, `"shadow"` are retained as aliases mapping to `primary`.

**Why:** Three consumers (site-header, account/page, empty-state) use legacy variants. Removing them would break compilation and force a coupled migration. Aliases keep the build green; migration is a follow-up.

**Trade-off:** Slightly larger variant surface. Accepted for decoupled rollout.

## D4 — Badge and Tag are separate components

**Decision:** `Badge` (status: success/warning/destructive/info + difficulty) is separate from `Tag` (neutral content labels: java, react).

**Why:** Conflating them led to color proliferation (every content category got a colored badge). Separating them constrains color to genuine status semantics.

## D5 — CodeBlock is syntax-highlight-free

**Decision:** `CodeBlock` does not bundle a highlighter. It renders children as-is inside a styled shell with copy + overflow.

**Why:** Highlighters (shiki ~1MB, prism, highlight.js) are heavy and theme-coupled. The base component should be light; highlighting is a page-level concern applied via rehype/MDX plugins when needed.

**Trade-off:** Consumers must wire highlighting separately. Accepted; documented in the component.

## D6 — Z-index is a token scale, not magic numbers

**Decision:** `--z-base` through `--z-tooltip` (10 named levels) replace ad-hoc `z-50`/`z-[100]`.

**Why:** Overlays compose in a known stacking order. Magic numbers drift and conflict. Named tokens make the layering contract explicit and auditable.

## D7 — Focus-visible uses a single ring token

**Decision:** One `--focus-ring-*` token set drives `:focus-visible` globally. Per-component outline hacks removed.

**Why:** Consistent, high-contrast focus indication is an accessibility requirement (WCAG 2.4.7). A single source prevents the ring from drifting per component.

## D8 — Motion is tokenized and reduced-motion-safe

**Decision:** Durations (`--motion-duration-*`) and easings (`--motion-ease-*`) are tokens. The existing `prefers-reduced-motion` rule zeroes all durations centrally.

**Why:** Motion should be consistent and overridable in one place. No `transition-all`; no scale-on-hover. Restrained motion is a V2 principle.

## D9 — Review surface at /dev/v2, dev-only

**Decision:** All new components are exercised on `/dev/v2`, which is not linked from public navigation.

**Why:** Visual QA, contrast checks, and regression spotting need a single page that renders every variant. Dev-only keeps it out of the production sitemap and user flow.

## D10 — Existing token-compliant components are verified, not rebuilt

**Decision:** Components already using the token system (input, textarea, select, checkbox, radio-group, label, breadcrumb, pagination, tabs, accordion, dialog, drawer, popover, tooltip, etc.) were verified for compliance rather than rewritten.

**Why:** Rewriting working, compliant code adds risk without value. The task spec calls for standardization; if the component already meets the standard, verification satisfies it.

## D11 — Phase 01 tokens and component APIs are frozen

**Decision:** As of T320–T321, the Phase 01 token substrate (color/radius/spacing/shadow/width/z/motion) and component APIs (Batch 13 + 14) are frozen.

**Why:** Downstream phases (02+) and route migrations depend on a stable contract. Freezing prevents churn during migration. Changes now require a documented decision-log entry.

---

# Phase 02 Decision Log (P02-T548)

Records the significant design/engineering decisions made during Phase 02, with rationale.

## D6 — SEO is a centralized system, not page-specific patches

**Decision:** All SEO logic (URLs, canonical, robots, sitemaps, structured data, breadcrumbs, internal links) lives in a single `lib/seo/` module tree (33 modules). No page may concatenate origin + path or emit a canonical tag directly.

**Why:** Phase 01 and earlier left ~290 scattered `SITE_URL` references and ~22 scattered `generateMetadata` functions. Inconsistent canonicals, missing robots directives, and duplicate metadata were the result. A centralized system makes SEO correctness a property of the architecture, not the author.

## D7 — RouteFamily union uses kebab-case discriminators

**Decision:** The `RouteFamily` union type uses kebab-case string literals (`'dsa-hub'`, `'dsa-problem'`, `'static-info'`) and the `ROUTE_REGISTRY` object keys match exactly.

**Why:** Kebab-case is the URL/path convention. Using it consistently across the union, the registry keys, the template maps, and the switch cases eliminates the camelCase/kebab-case mismatch that caused dozens of TypeScript errors during the build. One spelling, everywhere.

**Trade-off:** Kebab-case identifiers are slightly unusual in TS object literals; quoted keys (`'dsa-hub':`) are required. Accepted for consistency.

## D8 — `getRouteContract<T>()` is the canonical accessor

**Decision:** Consumers access route contracts via `getRouteContract(family)`, not direct `ROUTE_REGISTRY[family]` indexing.

**Why:** `ROUTE_REGISTRY` uses `as const satisfies Record<RouteFamily, RouteContract>`. The `satisfies` narrowing produces a union of specific literal object types, so optional fields like `dynamic` don't exist on every variant — direct indexing fails type-checking when the code reads `contract.dynamic`. The accessor returns `RouteContract<T>` where all optional fields are available.

## D9 — 404 vs 500 are distinguished

**Decision:** `NotFoundError` and `DataFetchError` are separate classes. Data-fetch failures return HTTP 500, not 404.

**Why:** Returning 404 for a data-fetch failure tells search engines the page doesn't exist, causing deindexing of pages that are merely temporarily broken. 500 signals "try again later" and preserves indexability (T086, T087, T527).

## D10 — Non-production environments are noindex globally

**Decision:** `getSeoEnvironment()` returns production|preview|staging|development. Any non-production environment emits `noindex, nofollow` globally and never serves as a canonical origin.

**Why:** Preview/staging/localhost URLs must never appear in search results or be declared canonical. Making this environment-aware (not page-aware) prevents leaks.

## D11 — Pagination page 2+ is noindex with canonical to page 1

**Decision:** Page 1 self-canonicalizes. Page 2+ emits `noindex, follow` with `rel prev/next` and a canonical tag pointing to page 1.

**Why:** Indexing every pagination page creates duplicate-content clutter. Canonical-to-page-1 consolidates link equity; noindex prevents indexation of thin pagination variants (T132, T680–T699).

## D12 — The application shell is a single AppShell resolver, not per-route layouts (P03-T013/T032)

**Decision:** One `AppShell` client component resolves the shell variant (`public`/`auth`/`dashboard`/`app`) from `usePathname()` and renders the matching header/footer. Route-specific shell forks are forbidden.

**Why:** Consistency across routes (T013, T014) and the shell must not remount on intra-variant navigation (W070). Per-route layout wrappers would duplicate the header/footer and drift. The variant is a property of the URL, not of the layout tree.

**How to apply:** New routes do not add a layout-level header/footer. They render inside `AppShell` (already mounted at the root). Variant-specific behavior lives in the variant components (`PublicHeader`, `AuthShellFrame`, `DashboardShellFrame`), not in route layouts.

## D13 — The header is a server-rendered frame with small client islands (P03-T033/T036)

**Decision:** `PublicHeader` is a server component. Only interactive bits become client JS: mobile drawer (`MobileNav`), learn dropdown (`DesktopLearnDropdown`), theme toggle (`ThemeToggle`), user menu (`HeaderUserActions`), search modal (`HeaderSearch`). The brand and primary nav links render as crawlable `<a>` tags on the server.

**Why:** Crawlability (search engines see nav links without JS — Z057, T034) and performance (the shell frame ships near-zero JS — AA). The navigation data layer (`navigation-data.ts`) is pure (no React) specifically so the server can render the link list.

**How to apply:** Do not add `'use client'` to the header frame or nav data layer. New interactive header behavior is a new small client island imported by the frame, not a conversion of the frame to client.

## D14 — Navigation data is pure data; icons are string names resolved by a map (P03-T062/T068)

**Decision:** `navigation-data.ts` returns `ShellNavLink` objects where `icon` is a string (Lucide icon name). `nav-icons.tsx` (client) maps the string to the component. The header/nav render server-side using the string; client islands resolve the icon.

**Why:** Server components can't pass component instances through props from a pure-data module, but they can pass strings. This keeps tree-shaking honest (only used icons are imported in the resolver) and the data layer server-safe.

**How to apply:** Add new nav icons by adding the Lucide import to `nav-icons.tsx`'s map and the string name to the nav data. Never import Lucide icons in `navigation-data.ts`.

## D15 — No bottom navigation on the public shell (P03-I, T097)

**Decision:** The public content shell does not get a bottom tab bar. Mobile navigation uses the drawer (`MobileNav`). The dashboard shell may justify a bottom nav later.

**Why:** Bottom nav competes with the content for the user's attention on mobile and duplicates the drawer's destinations. The shell exists to help users find content, not to be the product. A dashboard (task-oriented, few destinations) is the right place for a bottom bar; a content site is not.

## D16 — The shadcn sidebar primitive is not used for public content sidebars (P03-O)

**Decision:** `ContentSidebar` and `ContextualSidebar` are lightweight server-rendered containers (`<aside>` + sticky + internal scroll), not the shadcn `Sidebar` primitive (which is a cookie-backed provider meant for app dashboards).

**Why:** The public content shell needs crawlable, zero-JS containers. The shadcn sidebar ships a context provider and cookie state — appropriate for a dashboard, not for content navigation that must render on the server.

**How to apply:** Use `ContentSidebar`/`ContextualSidebar` for public content routes. Reserve the shadcn `Sidebar` primitive for authenticated dashboard surfaces (Phase AF) where collapse-state persistence is desired.

## D17 — The homepage is an orientation layer, not a feature catalogue (P04-A, T001–T010)

**Decision:** The V2 homepage surfaces a *curated subset* of preparation pathways (6 of 12), four technology entry points, five featured questions (derived from canonical content), and a short footer crawl-distribution list. It does not enumerate every language, question, company, topic, feature, tool, roadmap, or statistic.

**Why:** The V1 homepage tried to display everything (90vh gradient hero, animated dashboard, feature-card walls, 8-language grid, "Built Different" section, newsletter, giant final CTA). A new visitor could not understand what the product was or where to start. The homepage's primary job is orientation; dedicated pages organize depth.

**How to apply:** Add new discovery surfaces by extending `lib/home/home-data.ts` and a bounded section in `components/home/`. Never re-add a feature-card wall, a "Built Different" superlative section, a newsletter capture, or a giant final CTA to the homepage. Curate; do not enumerate.

## D18 — Homepage featured questions are derived from canonical content, never random or fake-trending (P04-I, T097–T109, T374–T375)

**Decision:** `getHomeFeaturedQuestions(limit)` reads `getSubcategoriesWithQuestions` from the flagship Java/Python/Go tracks and takes the first question of each subcategory, memoised per-process. No random selection, no "trending"/"popular" labels without supporting logic.

**Why:** Random or fake-trending featured content misleads users and search engines, and decouples the homepage from real content depth. Deriving from canonical content keeps the homepage honest and automatically reflects content changes.

**How to apply:** To feature a different question set, change the `FEATURED_SEEDS` array in `lib/home/home-data.ts`. Never introduce a random picker or a hard-coded "trending" badge on the homepage.

## D19 — Homepage search is gated by the `search` hub flag and dynamically imported with no SSR (P04-E, T049–T066, T289)

**Decision:** `HomeSearchEntry` is a client component that returns `null` when `isHubEnabled("search")` is false. `app/page.tsx` imports it via `next/dynamic` with `{ ssr: false }`.

**Why:** The search indexer is not populated for launch scope (`search: false` in `launch-config`). Loading the search dataset into the initial homepage bundle would inflate payload and block first render for a feature that is not live. The gate + dynamic no-SSR import means the homepage ships zero search JS until the hub is enabled.

**How to apply:** When search is launch-ready, flip `search: true` in `lib/launch-config.ts`; the homepage search entry appears automatically. Do not import `GlobalSearch` directly into `app/page.tsx`.

## D20 — Homepage content statistics are derived from canonical data, never hard-coded or animated (P04-M, T139–T145)

**Decision:** `getHomeContentStats()` derives live language names from `ENABLED_LANGUAGES` and question counts from `getSubcategoriesWithQuestions`. Stats are rendered as plain text, never animated counters, and sit in the restrained trust section — not as the primary homepage message.

**Why:** Hard-coded counts drift from reality and become misleading. Animated counters delay content visibility and violate reduced-motion. Statistics as the primary message read as marketing, not orientation.

**How to apply:** Add a stat by extending `getHomeContentStats()` with a canonical-data-derived value. Never hard-code a number in `app/page.tsx` or a home section component.

## D21 — Hierarchy resolution is owned by a single canonical resolver layer, not scattered across content-reader/seo-pillars/seo-slugs (P05-A/B, T021–T031)

**Decision:** `lib/hierarchy/hierarchy-resolver.ts` is the ONE place that resolves domain → stack → pillar → module → question. All V2 discovery pages import from `@/lib/hierarchy`, never from `@/lib/content-reader` or `@/lib/seo-pillars` directly for hierarchy resolution.

**Why:** Before V2, hierarchy knowledge was spread across content-reader (`getVisibleStackSlugs`, `getSubcategoriesWithQuestions`), seo-pillars (`PILLAR_HUBS`), and seo-slugs (`SEO_MODULES`). Pages reached into all three, producing competing definitions and inconsistent breadcrumbs. A single resolver layer gives one unambiguous convention and one place to add caching/validation.

**How to apply:** When building a discovery page, call `resolveDomain`/`resolveStack`/`resolvePillar`/`resolveModule`/`resolveBreadcrumbs` from `@/lib/hierarchy`. Do not import `PILLAR_HUBS` or `SEO_MODULES` directly in a route or component — go through the resolver.

## D22 — Question page data is adapted from QuestionPagePayload through a single canonical adapter, never consumed raw (P06-A/B, T041–T060)

**Decision:** `lib/question/question-data.ts` `resolveQuestionPageData()` is the ONE adapter between content-reader's `QuestionPagePayload` (api.ts) and the V2 question page. All question-v2 components consume `QuestionPageData`, never the raw payload.

**Why:** The API's `QuestionPagePayload` has a storage-oriented shape (`answerSections` with `sectionType`/`content`/`sectionTitle` strings). The rendering layer needs structured sections (prose/code/callout/table/figure/heading). Coupling components to the API shape would force every component to re-parse markdown and would break if the API schema changes. The adapter absorbs that coupling in one place.

**How to apply:** When building question page UI, call `resolveQuestionPageData(domain, stack, question)` and pass the resulting `QuestionPageData` to components. Do not import `getQuestionPagePayload` or `QuestionPagePayload` directly in a component.

## D23 — HierarchyPath.module is optional because a question may not belong to a resolvable module (P05-B, T030)

**Decision:** `HierarchyPath.module` is `ModuleEntity?` (optional), not required. `resolveHierarchyPath` returns `{ domain, stack }` (no module) when the question's subcategory cannot be resolved.

**Why:** Some questions live in the `_root` subcategory or have slug mismatches between `questions.json` and `complete-qa.json`. Forcing a module would either 404 valid questions or require a synthetic "uncategorized" module entity. Making it optional lets the path degrade gracefully — breadcrumbs and structured data still render with domain → stack → question.

**How to apply:** Consumers of `resolveHierarchyPath` must handle the no-module case. Do not assume `path.module` is non-null.

## D24 — Search engine is client-side in-memory, not a server endpoint (P07, T188..T260)

**Decision:** `lib/search/search-engine.ts` runs `normalizeQuery` + `search` against an in-memory index built by `getSearchIndex()` (cached per process). No `/api/search` dependency for the canonical input.

**Why:** The content set is static and small enough to build client-side; an in-memory index gives instant results with zero network latency and zero infra. The legacy `app/search` hit `/api/search?q=...`; the canonical `SearchInput` calls `search()` directly. The `/api/search` route remains for backward compatibility but is no longer the canonical path.

**How to apply:** Use `import { search, normalizeQuery } from "@/lib/search"` in search UIs. Do not fetch `/api/search` from new code.

## D25 — Guest (anonymous) is a first-class auth state, not a fallback (P08, T001..T040)

**Decision:** `AuthStatus` includes `"guest"` explicitly. `useUserState` returns `status: "guest"` when `hasGuestData()` is true and no user is authenticated. Bookmarks and progress transparently use guest localStorage in that state and the server when authenticated.

**Why:** The product lets visitors bookmark and track progress before signing up, then merges that data on login. Treating guest as an explicit state (rather than "unauthenticated + secretly using localStorage") makes the UI honest about what's happening and makes the merge prompt actionable.

**How to apply:** Branch on `status`, not on `user === null`. Use `useBookmarks(isAuthenticated)` / `useProgress(isAuthenticated)` — they handle both stores. Prompt merge via `useGuestData()` when `status === "guest"`.

## D26 — Dashboard shell composes canonical sections; legacy modular cards stay in the legacy glue (P09, T241..T280)

**Decision:** `components/dashboard-v2/dashboard-shell.tsx` composes the new canonical sections (ContinuePrep, DailyPrep, Recommendations, EmptyState) plus a lightweight summary header and quick stats. The richer existing modular cards (`SkillRadarCard`, `ActivityHeatmapCard`, `AchievementsCard`, etc.) remain composed by the legacy `app/dashboard` glue logic and are NOT re-wrapped by the new shell.

**Why:** The legacy cards take granular props (e.g. `StatsGrid` needs `done`, `total`, `fmtTime`, `fmtAvg`) with ~400 lines of formatter glue. Reverse-engineering every formatter into the new shell would risk regressions and duplicate logic. The canonical shell owns the data flow + new prep surfaces; the existing cards continue to work where their glue already lives.

**How to apply:** Import the new sections from `@/components/dashboard-v2`. The dashboard route renders `<DashboardShell/>`. If you need a legacy card in the new layout, pass it the same granular props the legacy page does.

## D27 — Interview sessions persist in sessionStorage, not a server API (P10, T181..T260)

**Decision:** `useInterviewSession` stores the in-flight session in `sessionStorage` (`ie_interview_session`) so a refresh mid-interview restores the current question and answers. Evaluation still hits `/api/mock-interviews/evaluate`. History has no persistence API yet.

**Why:** There is no server-side session-store endpoint. `sessionStorage` survives refreshes within the tab without persisting abandoned sessions forever (cleared on tab close). The `finish()` path clears the key after evaluation. History is shown as an empty-state CTA until a persistence API exists.

**How to apply:** Use `useInterviewSession()` for the full lifecycle. Do not read `sessionStorage` directly. History routes should show an empty state, not mock data.

## D28 — Data layers use the default `apiClient`, not a named `apiFetch` (P11, T…data-layer)

**Decision:** Every Phase 11–13 data layer (`lib/resume`, `lib/opportunity`, `lib/community`) imports `apiClient` as the default export from `@/lib/api-client` and calls `apiClient.get/post/patch`, returning `res.data ?? null`.

**Why:** `lib/api-client.ts` only exports a default axios instance. An earlier draft imported a non-existent named `apiFetch`, which fails tsc. The default instance already carries baseURL `/api`, `withCredentials`, and the JWT interceptor, so data-layer paths must NOT repeat the `/api` prefix (e.g. `/resume`, `/opportunities`, `/community`).

**How to apply:** `import apiClient from "@/lib/api-client"`; `const res = await apiClient.get<T>("/resume", { params }); return res.data ?? null;`. Never prefix data paths with `/api`.

## D29 — Community UGC pages are indexable; contribution + moderation are noindex (P13, SEO split)

**Decision:** Public community surfaces — company intelligence (`/community/companies/[company]`) and reported questions (`/community/questions/[id]`) — are indexable discovery pages (RouteFamily `company`/`question`). The contribution form (`/community/contribute`) and any moderation surface are `noindex, follow` (RouteFamily `dashboard`/`internal`).

**Why:** Company/question pages are legitimate search-landing surfaces that help candidates research employers and questions. The contribution form and moderation tools are authenticated, non-public workflows that should never be indexed.

**How to apply:** Public community routes use `buildCompanyIntelligenceMetadata`/`buildReportedQuestionMetadata` (indexable, `revalidate: 3600`). Contribution/moderation use their `noindex` variants with `robots: { index: false, follow: true }`.

## D30 — Platform layer is dependency-free and edge-safe (P14, T026..T238)

**Decision:** `lib/platform/` ships zero runtime dependencies (no zod, no Redis client, no logger framework). The rate-limit store is an interface (`RateLimitStore`) with an in-memory default; the logger writes JSON lines to stdout/stderr directly.

**Why:** The platform layer must run in the Next.js edge runtime (middleware) and be unit-testable in isolation. Any dependency pulled in here is forced into the edge bundle. Keeping it dependency-free preserves a small, auditable security/auth/cache surface and makes the Redis-backed rate-limit store a drop-in swap for multi-instance production.

**How to apply:** Import from `@/lib/platform`. For multi-instance production, implement `RateLimitStore` against Redis and pass it to `checkRateLimit`; do not edit the core. Add zod at the route handler layer, not in `lib/platform/validation`.

## D31 — Security headers are split between next.config and middleware, no duplication (P14, T101..T108)

**Decision:** `next.config.mjs` keeps owning the four headers it already set (`X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). `middleware.ts` layers the headers next.config did not own — CSP, HSTS, COOP, CORP — sourced from `buildSecurityHeaders()`.

**Why:** next.config's `X-Frame-Options: DENY` is stricter than middleware's `SAMEORIGIN`; duplicating it would create ambiguity. Splitting by ownership avoids redundant header writes while still completing the full P14-T101..T108 header set on every response.

**How to apply:** Do not re-set the four next.config headers in middleware. To change CSP/HSTS/COOP/CORP, edit `lib/platform/security-headers.ts` only.

## D32 — V2 program is declared complete; remaining work converts to the product backlog (P15, T742..T743)

**Decision:** All 16 phases (00–15) are marked complete in this tracker. Operational/release runbooks that are not frontend code (env definitions, secret rotation, backup/DR, analytics, search-console, launch smoke tests, post-launch monitoring windows) are recorded as contracts in `lib/platform/` and the Phase 15 report, and converted into normal product backlog items rather than blocking the migration program.

**Why:** The frontend migration's deliverable — the canonical v2 architecture, all product surfaces, and the shared platform layer — is complete and tsc-clean. Holding the program open for infrastructure/ops runbooks that live outside this repo would prevent closure. P15-T742/T743 explicitly call for converting remaining work to the backlog and declaring the program complete.

**How to apply:** New production-readiness work is sized and prioritized as normal product tickets against `lib/platform/` contracts, not as V2 migration tasks.
