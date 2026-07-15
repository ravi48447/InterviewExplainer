# 74 — Frontend Web Frameworks Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from JFI 24-27 (React / Angular / TypeScript-CSS-JS / fullstack integration), Wave F's `54-javascript-tracks-fullsize.md` + `55-typescript-track.md`, and new frontend-cross-cutting modules.
> **Depends on:** 24 (JFI React), 25 (JFI Angular), 26 (JFI TS-Tailwind), 27 (JFI fullstack integration), 54 (JS tracks), 55 (TS track), 41 (interview-qa-hub pattern).

## TL;DR

- **Goal:** A single browsable hub for **frontend / web frameworks** content — React (Hooks, RSC, Server Actions), Angular, Vue, Svelte/SvelteKit, Next.js, Remix/React Router 7, Nuxt, plus cross-cutting concerns (state management, performance & Core Web Vitals, accessibility/a11y, browser internals, modern CSS, animation). One URL for "react interview questions", "next js interview questions", "angular interview questions", "vue interview questions", "frontend developer interview questions".
- **Action:** Add `frontend/lib/hubs/frontend-web.ts` aggregator, build `/frontend-web` index + up to 10 category pages, scaffold `content/frontend-cross-cutting/` (performance & CWV, a11y, browser internals, modern CSS / Tailwind / styling, animation, state-management patterns).
- **Output:** `/frontend-web` returns 200 with grouped content; ≥ 400 frontend cards across categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbooks 24, 25, 26, 27 (JFI frontend modules) DONE.
- [ ] Playbook 54 (JS tracks fullsize) at least scaffolded.
- [ ] Playbook 55 (TypeScript track) at least scaffolded.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.frontendWeb` (add if missing; default `false`).

## Why this matters

Frontend interview demand splits across at least eight distinct framework communities (React, Next.js, Angular, Vue, Svelte, Remix, plus cross-framework concerns) and currently lives scattered across JFI playbooks and the JS/TS language tracks — meaning a "next.js interview questions" searcher lands on a JS-language page that doesn't surface RSC / Server Actions content. A consolidated frontend hub organises by **framework + concern**, surfaces the right content for each search, and serves both framework-specialist candidates and cross-framework / system-design-of-the-frontend candidates.

## Background

This hub aggregates from the following content trees:

| Content tree | Frameworks covered |
|---|---|
| `content/java-fullstack-intermediate/` (playbooks 24-27) | React (Hooks + class), Angular (v17+ standalone + signals), TypeScript (strict mode), fullstack integration |
| `content/javascript-intermediate/` (playbook 54) | JavaScript (ES2023+), React pillars |
| `content/typescript-intermediate/` (playbook 55) | TypeScript 5.x strict, utility types, decorators |
| `content/frontend-cross-cutting/` (new, this playbook) | Next.js 14 App Router, React Server Components, Vue 3.4+ Composition API, Nuxt 3, Svelte 5 runes, SvelteKit 2, Redux Toolkit 2, Zustand 4, Jotai 2, TanStack Query v5, Core Web Vitals, WCAG 2.2, modern CSS |

The hub separates React (library layer) from Next.js (framework layer). Use React when you need the library itself — Hooks, context, component patterns; use Next.js when you need the framework — App Router, RSC, Server Actions, file-based routing. A searcher for "react interview questions" wants Hooks and state patterns; a searcher for "next js interview questions" wants App Router and RSC.

Real anchors: React 18.3, Next.js 14 (App Router stable since Next.js 13.4, May 2023), Angular 17 (standalone components + signals, November 2023), Vue 3.4 (Composition API + `defineModel`, January 2024), Svelte 5 (runes preview), TypeScript 5.4. Core Web Vitals (LCP / INP / CLS — INP replaced FID in March 2024 as the third Core Web Vital).

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `frontend developer interview questions` | `/frontend-web` |
| `senior frontend interview questions` | `/frontend-web` |
| `react interview questions` | `/frontend-web/react` |
| `react hooks interview questions` | `/frontend-web/react` |
| `next js interview questions` | `/frontend-web/nextjs-and-react-server` |
| `react server components interview` | `/frontend-web/nextjs-and-react-server` |
| `angular interview questions` | `/frontend-web/angular` |
| `vue interview questions` | `/frontend-web/vue-and-nuxt` |
| `svelte interview questions` | `/frontend-web/svelte-and-sveltekit` |
| `web performance interview questions` | `/frontend-web/performance-and-core-web-vitals` |
| `core web vitals interview` | `/frontend-web/performance-and-core-web-vitals` |
| `accessibility interview questions` | `/frontend-web/accessibility-a11y` |
| `a11y interview questions` | `/frontend-web/accessibility-a11y` |
| `state management interview questions` | `/frontend-web/state-and-architecture` |
| `redux interview questions` | `/frontend-web/state-and-architecture` |
| `tanstack query interview` | `/frontend-web/state-and-architecture` |
| `css interview questions` | `/frontend-web/css-and-modern-styling` |
| `tailwind interview questions` | `/frontend-web/css-and-modern-styling` |
| `browser internals interview questions` | `/frontend-web/browser-and-platform` |

## Current state

- JFI react / angular / TS-Tailwind / fullstack-integration content exists under JFI tree.
- JS/TS tracks (Wave F) cover the language layer.
- No cross-framework hub or cross-cutting frontend tree (perf, a11y, browser, CSS) today.
- `/frontend-web` route does NOT exist today.

## Target state (measurable)

- Up to 11 hub pages return 200 (`/frontend-web` + up to 10 categories).
- Hub aggregator returns ≥ 400 frontend cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 8 minimum at launch, up to 10)

| Category slug | Pulls from… |
|---|---|
| `react` | `java-fullstack-intermediate/react-*`, `javascript-intermediate/react-pillars` |
| `nextjs-and-react-server` | `frontend-cross-cutting/nextjs-app-router`, `frontend-cross-cutting/react-server-components`, `frontend-cross-cutting/server-actions` |
| `angular` | `java-fullstack-intermediate/angular-*` |
| `vue-and-nuxt` | `frontend-cross-cutting/vue-fundamentals`, `frontend-cross-cutting/vue-composition-api`, `frontend-cross-cutting/nuxt-essentials` |
| `svelte-and-sveltekit` | `frontend-cross-cutting/svelte-fundamentals`, `frontend-cross-cutting/sveltekit-essentials` |
| `state-and-architecture` | `frontend-cross-cutting/state-management-patterns`, `frontend-cross-cutting/redux-deep`, `frontend-cross-cutting/zustand-jotai`, `frontend-cross-cutting/tanstack-query`, `frontend-cross-cutting/frontend-architecture` |
| `performance-and-core-web-vitals` | `frontend-cross-cutting/core-web-vitals`, `frontend-cross-cutting/bundle-optimisation`, `frontend-cross-cutting/rendering-perf`, `java-fullstack-intermediate/react-performance` |
| `accessibility-a11y` | `frontend-cross-cutting/a11y-fundamentals`, `frontend-cross-cutting/a11y-wcag-aria`, `frontend-cross-cutting/screen-reader-testing` |
| `css-and-modern-styling` | `frontend-cross-cutting/css-fundamentals`, `frontend-cross-cutting/tailwind-deep`, `frontend-cross-cutting/css-modules-css-in-js`, `frontend-cross-cutting/css-animations` |
| `browser-and-platform` | `frontend-cross-cutting/browser-rendering`, `frontend-cross-cutting/event-loop-frontend`, `frontend-cross-cutting/service-workers-pwa`, `frontend-cross-cutting/web-apis-storage-and-streams` |

**Minimum 8 frozen at launch.** `css-and-modern-styling` and `browser-and-platform` may be deferred to follow-up playbooks if the launch budget is tight. Once the launch set is chosen, it is frozen — adding an 11th requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/frontend-cross-cutting
cat > content/frontend-cross-cutting/_index.json <<EOF
{
  "level": "frontend-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in \
  nextjs-app-router react-server-components server-actions \
  vue-fundamentals vue-composition-api nuxt-essentials \
  svelte-fundamentals sveltekit-essentials \
  state-management-patterns redux-deep zustand-jotai tanstack-query frontend-architecture \
  core-web-vitals bundle-optimisation rendering-perf \
  a11y-fundamentals a11y-wcag-aria screen-reader-testing \
  css-fundamentals tailwind-deep css-modules-css-in-js css-animations \
  browser-rendering event-loop-frontend service-workers-pwa web-apis-storage-and-streams; do
  mkdir -p "content/frontend-cross-cutting/$M"
done
```

Target counts: ~12-15 cards per cross-cutting module, ~350 total.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/frontend-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
MODULE_COUNT=$(find content/frontend-cross-cutting -mindepth 1 -maxdepth 1 -type d | wc -l)
echo "Module dirs: $MODULE_COUNT (want 27)"
```
Expected: `OK index`; module dirs = 27.

---

### Step 2 — Aggregator

`frontend/lib/hubs/frontend-web.ts`:

```typescript
export type FECategory =
  | 'react'
  | 'nextjs-and-react-server'
  | 'angular'
  | 'vue-and-nuxt'
  | 'svelte-and-sveltekit'
  | 'state-and-architecture'
  | 'performance-and-core-web-vitals'
  | 'accessibility-a11y'
  | 'css-and-modern-styling'
  | 'browser-and-platform';

export interface FECard {
  id:        string;
  title:     string;
  domain:    string;
  module:    string;
  topic:     string;
  href:      string;
  category:  FECategory;
  framework: ('react' | 'angular' | 'vue' | 'svelte' | 'nextjs' | 'nuxt' | 'sveltekit' | 'agnostic')[];
  difficulty:'easy' | 'medium' | 'hard';
}

export const FE_CATEGORY_FEEDS: Record<FECategory, string[]> = {
  'react':                         ['java-fullstack-intermediate/react-fundamentals', 'java-fullstack-intermediate/react-hooks', 'javascript-intermediate/react-pillars'],
  'nextjs-and-react-server':       ['frontend-cross-cutting/nextjs-app-router', 'frontend-cross-cutting/react-server-components', 'frontend-cross-cutting/server-actions'],
  'angular':                        ['java-fullstack-intermediate/angular-fundamentals', 'java-fullstack-intermediate/angular-deep'],
  'vue-and-nuxt':                   ['frontend-cross-cutting/vue-fundamentals', 'frontend-cross-cutting/vue-composition-api', 'frontend-cross-cutting/nuxt-essentials'],
  'svelte-and-sveltekit':           ['frontend-cross-cutting/svelte-fundamentals', 'frontend-cross-cutting/sveltekit-essentials'],
  'state-and-architecture':         ['frontend-cross-cutting/state-management-patterns', 'frontend-cross-cutting/redux-deep', 'frontend-cross-cutting/zustand-jotai', 'frontend-cross-cutting/tanstack-query', 'frontend-cross-cutting/frontend-architecture'],
  'performance-and-core-web-vitals':['frontend-cross-cutting/core-web-vitals', 'frontend-cross-cutting/bundle-optimisation', 'frontend-cross-cutting/rendering-perf', 'java-fullstack-intermediate/react-performance'],
  'accessibility-a11y':             ['frontend-cross-cutting/a11y-fundamentals', 'frontend-cross-cutting/a11y-wcag-aria', 'frontend-cross-cutting/screen-reader-testing'],
  'css-and-modern-styling':         ['frontend-cross-cutting/css-fundamentals', 'frontend-cross-cutting/tailwind-deep', 'frontend-cross-cutting/css-modules-css-in-js', 'frontend-cross-cutting/css-animations'],
  'browser-and-platform':           ['frontend-cross-cutting/browser-rendering', 'frontend-cross-cutting/event-loop-frontend', 'frontend-cross-cutting/service-workers-pwa', 'frontend-cross-cutting/web-apis-storage-and-streams'],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/frontend-web.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'FE_CATEGORY_FEEDS' frontend/lib/hubs/frontend-web.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/frontend-web` — index of active categories with card counts + framework-mix histogram.
- `/frontend-web/<category>` — filterable card list; framework-pill badges.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/frontend-web/page.tsx \
  "frontend/app/frontend-web/[category]/page.tsx" \
  frontend/components/FECard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same template. Version pins per intro:

- **React intro**: React 18.3, Hooks (useState/useEffect/useReducer/useContext/useMemo/useCallback), Server Components (introduced in React 18). Decision rule: "Use `useMemo` / `useCallback` when profiling shows a re-render hot path; don't add them preemptively — the memoization overhead costs more than it saves in most components."
- **Next.js intro**: Next.js 14, App Router (stable since Next.js 13.4). Decision rule: "Use App Router for all new projects in 2024+; use Pages Router only when migrating an existing Pages-based codebase. The classic bug is mixing `'use client'` and `'use server'` directives incorrectly — a Server Component cannot import a Client Component's non-exported internals."
- **Angular intro**: Angular 17 (standalone components, new control flow, signals). Decision rule: "Use Angular signals (available since Angular 17) for reactive state over `Subject`/`BehaviorSubject` in new code; use RxJS for async streams (HTTP, WebSocket) — they're complementary, not interchangeable."
- **Performance intro**: INP (Interaction to Next Paint) replaced FID as a Core Web Vital in March 2024; covers LCP, INP, CLS.
- **a11y intro**: WCAG 2.2 (October 2023) adds new SC 2.4.11–2.4.13 (focus appearance). References MDN accessibility docs and axe-core for automated testing.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
INTRO_COUNT=$(find content/frontend-cross-cutting -name 'intro.md' | wc -l)
echo "Intro count: $INTRO_COUNT (want ≥ 8 for minimum launch)"
```

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  frontendWeb: true,
}
```

Commit: `launch: enable frontendWeb hub`.

**Verify:**
```bash
grep -c 'frontendWeb: *true' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/launch-config.ts
```
Expected: ≥ 1.

---

### Step 6 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /frontend-web \
  /frontend-web/react \
  /frontend-web/nextjs-and-react-server \
  /frontend-web/angular \
  /frontend-web/vue-and-nuxt \
  /frontend-web/svelte-and-sveltekit \
  /frontend-web/state-and-architecture \
  /frontend-web/performance-and-core-web-vitals \
  /frontend-web/accessibility-a11y \
  /frontend-web/css-and-modern-styling \
  /frontend-web/browser-and-platform; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200` (skip deferred categories).

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `frontendWeb` flag |
| `frontend/lib/hubs/frontend-web.ts` | NEW — aggregator |
| `frontend/app/frontend-web/page.tsx` | NEW — index |
| `frontend/app/frontend-web/[category]/page.tsx` | NEW — category page |
| `frontend/components/FECard.tsx` | NEW — card with framework-pill |
| `frontend/components/site-header.tsx` | add Frontend Web nav link |
| `scripts/build_sitemap.py` | enumerate active FE hub URLs |
| `content/frontend-cross-cutting/` | NEW directory + 27 modules |

## Content rules

- Hub LINKS, never duplicates JFI / JS / TS content.
- Cross-cutting tree holds framework-agnostic (perf, a11y, CSS, browser) and framework-specific-but-no-existing-home content (Next.js / Vue / Svelte deep-dives that JFI doesn't cover).
- React + Next.js are separate categories — `react` is for the library + hooks + state-management patterns INSIDE React; `nextjs-and-react-server` is for the framework, RSC, Server Actions, App Router.
- A topic appears in **only one** category; cross-pollination (e.g. "perf in Next.js") goes in `performance-and-core-web-vitals` with a framework tag.
- The most common mistake is routing Next.js App Router content into the `react` category — RSC / Server Actions are Next.js-specific, not React library primitives. The aggregator should detect by topic title prefix (`server-action-*`, `rsc-*`, `app-router-*`) and route to `nextjs-and-react-server`.
- The launch category set is **frozen** — adding a new one requires its own playbook.

## SEO and URLs

- Canonical: `/frontend-web`, `/frontend-web/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `<Framework> Interview Questions — Frontend Web Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| All active category hub pages return 200 | all of them | smoke loop (all 200) |
| Hub aggregator returns ≥ 400 cards | ≥ 400 | `console.log(listCards().length)` in aggregator; `npm run build` |
| React category ≥ 80 cards | ≥ 80 | `console.log(listCards('react').length)` |
| Next.js + RSC category ≥ 50 cards | ≥ 50 | `console.log(listCards('nextjs-and-react-server').length)` |
| Performance category ≥ 50 cards | ≥ 50 | `console.log(listCards('performance-and-core-web-vitals').length)` |
| A11y category ≥ 30 cards | ≥ 30 | `console.log(listCards('accessibility-a11y').length)` |
| Each active category intro ≥ 200 words | all intros | `for F in content/frontend-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes all active FE hub URLs | count | `grep -c '/frontend-web' frontend/public/sitemap.xml` ≥ active-count + 1 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Framework tag present on every card | 100 % | `rg 'framework=\{' frontend/components/FECard.tsx` ≥ 1 |
| Existing JFI pages: zero regression | manual | open one React + one Angular topic |
| Site-header has Frontend Web link | grep | `grep -c 'href="/frontend-web"' frontend/components/site-header.tsx` ≥ 1 |

## Failure modes & rollback

- **React + Next.js split confused**: cards land in `react` when they're Server Actions / RSC content. Aggregator detects by topic title prefix and routes to `nextjs-and-react-server`.
- **Vue / Svelte content thin**: acceptable to launch at lower counts; mark thin categories with "more coming" banner. Both are differentiating long-term but neither is search-volume critical at launch.
- **Framework tag inconsistency** (`React` / `react` / `reactjs` → `react`): aggregator must canonicalise. Add `FRAMEWORK_CANONICAL_MAP`.
- **a11y content shallow**: fewer high-quality a11y cards are better than a wall of "use semantic HTML" platitudes. Do not launch a11y with < 20 cards.
- **Rollback:** `ENABLED_HUBS.frontendWeb = false`.

## Definition of Done

- [ ] `grep -c 'frontendWeb: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] Smoke loop — all active category pages return 200
- [ ] `console.log(listCards().length)` ≥ 400
- [ ] `console.log(listCards('react').length)` ≥ 80
- [ ] `console.log(listCards('nextjs-and-react-server').length)` ≥ 50
- [ ] `console.log(listCards('performance-and-core-web-vitals').length)` ≥ 50
- [ ] `console.log(listCards('accessibility-a11y').length)` ≥ 30
- [ ] `for F in content/frontend-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/frontend-web' frontend/public/sitemap.xml` ≥ active-category-count + 1
- [ ] `grep -c 'href="/frontend-web"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0

## Estimated effort

- **Ideal:** 28 hours (3h scaffold + 14h cross-cutting content + 8h hub UI + 3h intros + smoke).
- **Hard stop:** 56 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Step 3 (pages + filtering).
  3. Step 4 (intros + seed cross-cutting to ≥ 200 cards).
  4. Steps 5-6 (flag + smoke + commits + INDEX).