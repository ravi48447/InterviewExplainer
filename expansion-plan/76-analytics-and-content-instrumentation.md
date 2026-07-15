# 76 — Analytics and Content Instrumentation

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** product instrumentation + privacy-aware analytics rollout. **Cross-cutting**: every hub (41–48, 68–75) becomes measurable after this playbook lands.

## TL;DR

- **Goal:** Wire up the first-party analytics layer (PostHog Cloud or self-hosted PostHog + a thin client adapter) and instrument every hub / topic / quiz / search interaction so we can measure which content actually converts to study sessions, premium signups, and return visits — without breaking GDPR / CCPA / consent.
- **Action:** Pick an analytics backend (PostHog by default), add a TypeScript event-schema file, add a privacy-aware client wrapper, instrument the 7 most important UI surfaces, and ship a "what's getting traffic vs what's converting" weekly dashboard.
- **Output:** Every page view, search, hub click, question completion, mark-as-mastered, and signup is tracked under a frozen event schema; consent banner gates non-essential events; a `STATUS.md`-style `analytics-health.md` ships in `docs/` showing event volume per surface and last-seen timestamps.

## Hard prerequisites

- [ ] Playbook 50 (operations + sitemap) DONE — `STATUS.md` dashboard pattern established.
- [ ] At least one hub from 41/42/43/44/45/46/47/48 (or 68/69/70/71/72/73/74/75) is live so there is real traffic to instrument.
- [ ] `frontend/lib/launch-config.ts` has `ANALYTICS_PROVIDER` env-driven setting (`'posthog' | 'none'`; default `'none'`).
- [ ] A privacy / cookie consent banner is either already live or will ship in the same PR (do not instrument tracking events until consent UX is shipped).

## Why this matters

We cannot improve what we do not measure — and the expansion-plan optimism about which hubs are "high value" is a hypothesis that needs evidence (page views, scroll depth, return rate, signup attribution). Without first-party analytics, every future flag-flip is gut-feel; with it, the playbook can graduate from "ship all the content" to "double down on what's working" with real numbers.

## Background

This playbook implements PostHog Cloud as the analytics backend. PostHog is an open-source product analytics platform (posthog.com); the Cloud plan is free for < 1M events/month as of 2024. The integration uses `posthog-js` npm package (currently 1.130+) in a Next.js App Router context.

Key design decisions:
- **No autocapture**: the event schema is fully explicit. Autocapture produces unmaintainable event noise.
- **Consent-first**: the wrapper hard-returns unless `initAnalytics('granted')` has been called. This satisfies GDPR Article 7 (freely given, specific, informed consent) and CCPA opt-out requirements.
- **No session recording at launch**: too privacy-invasive for a content site; opt-in only in a follow-up.
- **PII scrubbing**: raw search queries may contain email-shaped strings; the wrapper scrubs them at the call site.

The `HubSlug` type in the event schema is the canonical list of hub identifiers. A `page_view` event carries `hub?: HubSlug` so PostHog can answer "which hub pages drive the most study-session depth".

Files to read before executing:

| Path | Why |
|---|---|
| `frontend/lib/launch-config.ts` | Feature-flag plumbing; analytics provider lives here. |
| `frontend/components/site-header.tsx`, `frontend/components/site-footer.tsx` | Where the consent banner lives (footer) and the auth state surfaces (header). |
| `frontend/app/layout.tsx` | Root layout where the analytics provider is mounted once. |
| `frontend/components/mark-complete-button.tsx` | The mastery event source; one of the highest-signal user actions. |
| `frontend/app/search/page.tsx` | Where the search event fires. |
| `docs/CONTENT-PLAN.md` and `docs/SPEAKABLE-PLAN.md` | Help decide which content events map to which goal funnels. |

---

## Step 1 — Decide the backend

Default: **PostHog Cloud** for fastest time-to-value; switch to self-hosted PostHog only if data-residency requirements demand. Store the project key in `frontend/.env.local` as `NEXT_PUBLIC_POSTHOG_KEY` and the host as `NEXT_PUBLIC_POSTHOG_HOST` (default `https://us.posthog.com`). Add the env names to `frontend/.env.example`.

**Verify:**
```bash
grep -c 'NEXT_PUBLIC_POSTHOG_KEY' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/.env.example
```
Expected: ≥ 1.

---

## Step 2 — Freeze the event schema

Add `frontend/lib/analytics/events.ts`. Every event the codebase fires must be declared here — if it's not in the schema, it doesn't exist:

```typescript
export type AnalyticsEvent =
  // page-level
  | { name: 'page_view';                      props: { path: string; referrer?: string; hub?: HubSlug } }

  // hub navigation
  | { name: 'hub_category_view';              props: { hub: HubSlug; category: string; cardCount: number } }
  | { name: 'hub_card_click';                 props: { hub: HubSlug; category: string; topicHref: string; cardIndex: number } }

  // content
  | { name: 'topic_view';                     props: { domain: string; module: string; topic: string; isCanonical: boolean } }
  | { name: 'topic_section_expand';           props: { topic: string; sectionKind: string } }
  | { name: 'topic_mark_mastered';            props: { topic: string; minutesOnPage: number } }
  | { name: 'topic_mark_unmastered';          props: { topic: string } }

  // search
  | { name: 'search_query';                   props: { q: string; resultCount: number; latencyMs: number } }
  | { name: 'search_result_click';            props: { q: string; resultHref: string; resultIndex: number } }
  | { name: 'search_zero_results';            props: { q: string } }

  // auth / signup funnel
  | { name: 'auth_signup_start';              props: { source: 'header' | 'paywall' | 'inline' } }
  | { name: 'auth_signup_complete';           props: { userId: string } }
  | { name: 'auth_login_complete';            props: { userId: string } }

  // premium funnel (depends on playbook 78 shipping)
  | { name: 'premium_pricing_view';           props: { plan?: string } }
  | { name: 'premium_checkout_start';         props: { plan: string } }
  | { name: 'premium_checkout_complete';      props: { plan: string } };

export type HubSlug =
  | 'system-design'
  | 'mobile'
  | 'data-engineering'
  | 'machine-learning'
  | 'cloud-architecture'
  | 'devops-sre'
  | 'security-engineering'
  | 'frontend-web'
  | 'databases'
  | 'interview-qa'
  | 'companies'
  | 'roadmaps';
```

The schema is **frozen** — adding a new event requires its own playbook OR a schema-bump PR in this file. Renaming an event is forbidden (rename = add new + deprecate old).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/analytics/events.ts && echo "OK schema" || echo "MISSING schema"
# Count event names to confirm at least 15 event types declared
grep -c "name: '" frontend/lib/analytics/events.ts
```
Expected: `OK schema`; count ≥ 15.

---

## Step 3 — Privacy-aware client wrapper

Add `frontend/lib/analytics/client.ts`:

```typescript
import posthog from 'posthog-js';
import type { AnalyticsEvent } from './events';

type Consent = 'granted' | 'denied' | 'unknown';

let initialised = false;

export function initAnalytics(consent: Consent) {
  if (initialised) return;
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY == null) return;
  if (consent !== 'granted') return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.posthog.com',
    capture_pageview: false,           // we fire `page_view` ourselves with hub annotations
    autocapture:      false,           // event schema is explicit; no autocapture
    person_profiles:  'identified_only',
    disable_session_recording: true,   // off by default; opt-in feature for later
  });
  initialised = true;
}

export function track<E extends AnalyticsEvent>(event: E) {
  if (!initialised) return;
  posthog.capture(event.name, event.props as Record<string, unknown>);
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (!initialised) return;
  posthog.identify(userId, traits);
}

export function reset() {
  if (!initialised) return;
  posthog.reset();
}
```

Consent flow: the cookie banner writes consent (`granted` / `denied`) to `localStorage.ie_consent`. The root layout reads it, calls `initAnalytics(consent)`. If consent toggles to denied later, call `reset()` and refresh.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/analytics/client.ts && echo "OK client" || echo "MISSING client"
grep -c 'autocapture: *false' frontend/lib/analytics/client.ts
grep -c 'disable_session_recording: *true' frontend/lib/analytics/client.ts
```
Expected: `OK client`; both counts ≥ 1.

---

## Step 4 — Instrument the 7 surfaces

In this order:

1. **Root layout** — fire `page_view` on every route change with annotated `hub` slug derived from the path.
2. **Hub category pages** (`/<hub>`, `/<hub>/<category>`) — fire `hub_category_view`; fire `hub_card_click` from card components.
3. **Topic page** (`/interview/<domain>/<module>/<topic>` and SEO-slug variants) — fire `topic_view` on mount; fire `topic_section_expand` from collapsible sections; tie `topic_mark_mastered` and `topic_mark_unmastered` to `mark-complete-button.tsx`.
4. **Search page** (`/search`) — fire `search_query` on every fetch; fire `search_result_click` and `search_zero_results`.
5. **Header signup CTA** and **auth flow** — fire `auth_signup_start` from CTAs; `auth_signup_complete` / `auth_login_complete` from `context/auth-context.tsx`.
6. **Pricing page** (when playbook 78 ships) — fire `premium_pricing_view` and `premium_checkout_*` events.
7. **Quiz / mock interview** (if playbook 48 has shipped) — defer to a follow-up extension of the schema.

Each call site uses a one-line `track({ name: '...', props: {...} })` import — no inline `posthog.capture`.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
# No direct posthog.capture calls outside the wrapper
DIRECT_CAPTURES=$(rg -t ts 'posthog\.capture' frontend/ --count-matches | grep -v 'client.ts' | wc -l)
echo "Direct posthog.capture calls outside client.ts: $DIRECT_CAPTURES (want 0)"
# At least one track() call per instrumented surface
rg -t ts "track\(\{" frontend/app/layout.tsx frontend/app/search/page.tsx frontend/components/mark-complete-button.tsx | wc -l
```
Expected: `0` direct captures; ≥ 3 `track()` calls across the three instrumented files.

---

## Step 5 — Weekly dashboard

Add `scripts/build_analytics_health.py`:

```python
#!/usr/bin/env python3
"""Pull event-volume rollup for the last 7 days and write docs/analytics-health.md.

Reads from PostHog query API; falls back to a noop "instrumented but no data
yet" report if the API key is missing or returns zero events.
"""
```

Output: a markdown table per event name with last-7-days volume, last-seen timestamp, and a sparkline (text-art). Commit `docs/analytics-health.md` weekly via a scheduled GH Actions job.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f scripts/build_analytics_health.py && echo "OK script" || echo "MISSING script"
python3 scripts/build_analytics_health.py
test -s docs/analytics-health.md && echo "OK dashboard" || echo "MISSING dashboard"
wc -l docs/analytics-health.md
```
Expected: `OK script`; `OK dashboard`; line count ≥ 5.

---

## Step 6 — Verify the consent gating

Before merge, run:

1. Open `/` with consent denied → verify zero events fire (PostHog network tab empty).
2. Grant consent → verify `page_view` fires; navigate to a hub → verify `hub_category_view` and clickthrough fire.
3. Sign in → verify `auth_login_complete` fires with the user id.
4. Toggle consent back to denied → verify `reset()` was called and subsequent navigation produces no events.

**Verify (automated regression gate):**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
# Schema drift check: every track() call must reference a valid event name
python3 scripts/lint_analytics_events.sh 2>/dev/null || bash scripts/lint_analytics_events.sh
echo "Lint exit code: $?"
```
Expected: exit 0.

---

## Step 7 — Smoke + commits

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20
```

Commits (one per logical change):

```bash
git add frontend/lib/analytics/events.ts frontend/lib/analytics/client.ts
git commit -m "feat(analytics): freeze event schema + privacy-aware client wrapper"

git add frontend/app/layout.tsx frontend/components/site-header.tsx frontend/components/mark-complete-button.tsx
git commit -m "feat(analytics): instrument layout, header CTAs, mark-complete (consent-gated)"

git add frontend/app/search/page.tsx
git commit -m "feat(analytics): instrument search query + click + zero-result events"

git add frontend/lib/hubs/*.ts frontend/components/*Card.tsx
git commit -m "feat(analytics): instrument hub card-click + category-view across all hubs"

git add scripts/build_analytics_health.py docs/analytics-health.md
git commit -m "docs(analytics): add weekly analytics-health.md dashboard"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 76-analytics-and-content-instrumentation DONE"
```

---

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Event schema is exhaustive (every `track()` call uses a schema event name) | 100 % | `rg -t ts "track\(\{" frontend/` cross-checked against schema names |
| Consent denied → zero events fire | 0 | manual; PostHog network tab |
| Consent granted → `page_view` fires per route change | every route | manual + PostHog live events view |
| `autocapture` is disabled | true | `grep -c 'autocapture: *false' frontend/lib/analytics/client.ts` ≥ 1 |
| `session_recording` is disabled | true | `grep -c 'disable_session_recording: *true' frontend/lib/analytics/client.ts` ≥ 1 |
| No `posthog.capture` outside the wrapper | 0 | `rg -t ts 'posthog\.capture' frontend/` returns only `client.ts` |
| `topic_mark_mastered` fires on the mark-complete button | manual | click + PostHog live |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Existing pages: zero regression with consent denied | manual | open one of every hub |
| `docs/analytics-health.md` exists and is parseable | 1 | `wc -l docs/analytics-health.md` ≥ 1 |

## Failure modes & rollback

- **Events fire before consent is granted**: critical privacy bug. The wrapper must hard-return on `initialised === false`. Add a regression test that simulates "no consent" and asserts `posthog.capture` was never called.
- **Schema drift** (someone added an inline `posthog.capture('arbitrary_event_name')`): CI lint must fail the build. Add `scripts/lint_analytics_events.sh` that greps for `posthog\.capture` outside `client.ts` and exits 1 if found.
- **PostHog dashboard out of sync with `docs/analytics-health.md`**: stale snapshot; re-run the weekly job. Pin job to Sunday 02:00 UTC.
- **PII leaks** (e.g. raw search query containing email-like strings): scrub at the wrapper level (regex replace email-shaped substrings with `[redacted]`).
- **Performance regression** (PostHog script delays LCP): wrapper must lazy-load `posthog-js` after consent; defer init by `requestIdleCallback`.
- **Rollback:** flip `NEXT_PUBLIC_POSTHOG_KEY` to unset → wrapper no-ops → no events fire. Schema and instrumentation stay in code (cost: ~0 KB after tree-shake of `posthog-js`).

## Definition of Done

- [ ] `test -f frontend/lib/analytics/events.ts && echo OK` — OK
- [ ] `test -f frontend/lib/analytics/client.ts && echo OK` — OK
- [ ] `grep -c 'autocapture: *false' frontend/lib/analytics/client.ts` ≥ 1
- [ ] `grep -c 'disable_session_recording: *true' frontend/lib/analytics/client.ts` ≥ 1
- [ ] `rg -t ts 'posthog\.capture' frontend/ | grep -v 'client.ts' | wc -l` = 0 (no raw captures outside wrapper)
- [ ] `test -s docs/analytics-health.md && echo OK` — OK
- [ ] `test -f scripts/lint_analytics_events.sh && bash scripts/lint_analytics_events.sh; echo $?` — exits 0
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `grep -c 'NEXT_PUBLIC_POSTHOG_KEY' frontend/.env.example` ≥ 1
- [ ] Manual consent-gating QA passes (deny → 0 events, grant → page_view fires)

## Estimated effort

- **Ideal:** 14 hours (2h schema + 2h wrapper + 4h instrumentation + 2h consent QA + 2h dashboard script + 2h smoke).
- **Hard stop:** 28 hours.
- **Recommended split:** 2 agent sessions:
  1. Steps 1-4 (schema + wrapper + instrumentation of layout/hub/topic/search/auth).
  2. Steps 5-7 (dashboard script + consent QA + smoke + commits + INDEX).