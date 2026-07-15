# 77 — A/B Testing and Personalization Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** experimentation infrastructure + first personalization slice. **Depends on:** 76 (analytics + event schema must be live first).

## TL;DR

- **Goal:** Stand up a first-party A/B experimentation surface (PostHog Feature Flags + Experiments) and ship the first two real experiments — (a) hub landing-page hero copy variants, (b) personalized home page for returning visitors based on prior topic visits — under a registry that prevents test sprawl.
- **Action:** Add `frontend/lib/experiments/registry.ts` (frozen list of running tests + targeting + metrics), add `frontend/lib/experiments/client.ts` (variant-resolution wrapper), wire to the analytics event stream from playbook 76, ship two experiments to `/` and hub landing pages, ship a `docs/experiments-status.md` weekly report.
- **Output:** Two experiments running in production with stable variant assignment per anonymous user (and stable across auth), exposure events flowing into analytics, weekly status report committed, and a documented "how to ship the third experiment" runbook.

## Hard prerequisites

- [ ] Playbook 76 (analytics) DONE — event schema + client wrapper + consent gating live.
- [ ] PostHog (or chosen tool) has Feature Flags + Experiments enabled in the project.
- [ ] At least one hub from 41/42/43/44/45/46/47/48/68–75 is live with measurable traffic.
- [ ] At least 100 unique daily visitors over the prior 7 days — below this, experiments are noise.

## Why this matters

Hub-launch decisions are currently driven by intuition about "which hero copy lands", "which CTA converts", "which recommended-topic surface returning visitors care about" — but at the content volume being built, even a 5% lift on hub-landing → topic-view is worth more than the cost of three more hubs. A disciplined experimentation surface (with a frozen registry to prevent the inevitable sprawl) turns intuition into evidence and earns the right to keep shipping.

## Background

This playbook implements two specific experiments using PostHog's Feature Flags API:

**Experiment 1 — `hero_copy_v1`**: tests whether changing hub landing page hero copy from "Master X Interviews" to "Pass Your X Interview" increases hub card click-through rate. PostHog Feature Flags serve a variant key (`control` or `variant_pass`) stably per anonymous bucket ID. The #1 trap with hero copy experiments is leaking variant content into SEO — this is prevented by client-side rendering only and never serving variant copy to the Googlebot user agent.

**Experiment 2 — `home_personalised_v1`**: tests whether a personalised home page (top 3 hubs based on prior topic visits) increases topic view rate for returning visitors. "Returning" is defined as ≥ 2 prior sessions detected via `localStorage`. The recommendation engine reads local-storage topic-visit history (anonymous) or server-side user profile (authenticated).

The experimentation decision protocol (≥ 1000 exposures per variant, ≥ 14 calendar days, 95% CI excludes zero, guardrails within threshold) is non-negotiable. The classic bug is declaring a winner at day 3 based on 50 exposures — the `docs/experiments-status.md` report must show the 14-day counter and refuse to show a verdict before it expires.

Files to read before executing:

| Path | Why |
|---|---|
| `expansion-plan/76-analytics-and-content-instrumentation.md` | Event schema; experiment exposure events must extend it. |
| `frontend/lib/analytics/events.ts` | Add `experiment_exposed` and `experiment_converted` events here. |
| `frontend/app/page.tsx` | Home page — target of experiment #2. |
| `frontend/app/[domainSlug]/page.tsx` | Hub landing pattern — target of experiment #1. |
| `frontend/context/auth-context.tsx` | User id for stable cross-device assignment post-login. |

---

## Step 1 — Extend the analytics schema

Add two events to `frontend/lib/analytics/events.ts`:

```typescript
| { name: 'experiment_exposed';   props: { experimentKey: string; variant: string; userBucketId: string } }
| { name: 'experiment_converted'; props: { experimentKey: string; variant: string; metric: string; value?: number } }
```

Bump the schema-version comment at the top of `events.ts` (e.g. `// schema v2 (adds experiment_exposed / experiment_converted)`).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
grep -c 'experiment_exposed' frontend/lib/analytics/events.ts
grep -c 'experiment_converted' frontend/lib/analytics/events.ts
grep -c 'schema v2' frontend/lib/analytics/events.ts
```
Expected: each ≥ 1.

---

## Step 2 — Freeze the experiment registry

Add `frontend/lib/experiments/registry.ts`. Every running experiment must be declared here:

```typescript
export type ExperimentKey =
  | 'hero_copy_v1'
  | 'home_personalised_v1';

export interface ExperimentSpec {
  key:          ExperimentKey;
  description:  string;
  variants:     { key: string; weight: number }[];   // weights sum to 100
  targeting:    {
    paths?:        string[];
    audience?:     'all' | 'returning' | 'new';
    minSessions?:  number;
  };
  primaryMetric: {
    eventName: 'topic_view' | 'auth_signup_complete' | 'hub_card_click' | 'premium_checkout_complete';
    direction: 'increase' | 'decrease';
  };
  guardrails: {
    eventName: 'search_zero_results' | 'topic_section_expand';
    threshold: number;
  }[];
  start: string;   // ISO date
  end:   string;   // ISO date — hard kill switch
  owner: string;
}

export const EXPERIMENTS: ExperimentSpec[] = [
  {
    key:          'hero_copy_v1',
    description:  'Hero copy on hub landing pages: "Master <Topic> Interviews" (control) vs "Pass Your <Topic> Interview" (variant).',
    variants:     [{ key: 'control', weight: 50 }, { key: 'variant_pass', weight: 50 }],
    targeting:    { paths: ['/databases', '/cloud-architecture', '/devops-sre', '/security-engineering', '/frontend-web', '/mobile', '/data-engineering', '/machine-learning'], audience: 'all' },
    primaryMetric:{ eventName: 'hub_card_click', direction: 'increase' },
    guardrails:   [{ eventName: 'search_zero_results', threshold: 0.05 }],
    start: '2026-06-01',
    end:   '2026-07-15',
    owner: 'growth',
  },
  {
    key:          'home_personalised_v1',
    description:  'Home page for returning visitors: control (default home) vs variant_recommend (top 3 hubs based on prior topic visits).',
    variants:     [{ key: 'control', weight: 50 }, { key: 'variant_recommend', weight: 50 }],
    targeting:    { paths: ['/'], audience: 'returning', minSessions: 2 },
    primaryMetric:{ eventName: 'topic_view', direction: 'increase' },
    guardrails:   [{ eventName: 'search_zero_results', threshold: 0.05 }],
    start: '2026-06-15',
    end:   '2026-08-15',
    owner: 'growth',
  },
];
```

Adding a new experiment **must** include all fields; CI lint rejects partial entries.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/experiments/registry.ts && echo "OK registry" || echo "MISSING registry"
grep -c 'ExperimentSpec' frontend/lib/experiments/registry.ts
# Weights on each experiment must sum to 100
node -e "
const r = require('./frontend/lib/experiments/registry.ts');
r.EXPERIMENTS.forEach(e => {
  const sum = e.variants.reduce((s,v)=>s+v.weight,0);
  console.log(e.key, 'weights sum:', sum, sum === 100 ? 'OK' : 'FAIL');
});
" 2>/dev/null || echo "(node check skipped — run manually after ts-node install)"
```
Expected: `OK registry`; `ExperimentSpec` count ≥ 1.

---

## Step 3 — Variant resolution wrapper

Add `frontend/lib/experiments/client.ts`:

```typescript
import posthog from 'posthog-js';
import { EXPERIMENTS, type ExperimentKey } from './registry';
import { track } from '../analytics/client';

function getOrCreateBucketId(): string {
  const existing = typeof window !== 'undefined' && localStorage.getItem('ie_bucket');
  if (existing) return existing;
  const id = crypto.randomUUID();
  if (typeof window !== 'undefined') localStorage.setItem('ie_bucket', id);
  return id;
}

export function variant(key: ExperimentKey, defaultVariant: string = 'control'): string {
  const spec = EXPERIMENTS.find(e => e.key === key);
  if (!spec) return defaultVariant;

  const now = new Date().toISOString();
  if (now < spec.start || now > spec.end) return defaultVariant;

  if (typeof window !== 'undefined' && spec.targeting.paths != null) {
    if (!spec.targeting.paths.some(p => window.location.pathname.startsWith(p))) {
      return defaultVariant;
    }
  }

  const ph = (posthog as any).getFeatureFlag(key) as string | undefined;
  if (ph == null) return defaultVariant;

  if (typeof sessionStorage !== 'undefined') {
    const sessionKey = `ie_exp_seen_${key}`;
    if (!sessionStorage.getItem(sessionKey)) {
      track({ name: 'experiment_exposed', props: { experimentKey: key, variant: ph, userBucketId: getOrCreateBucketId() } });
      sessionStorage.setItem(sessionKey, '1');
    }
  }
  return ph;
}

export function convert(key: ExperimentKey, metric: string, value?: number) {
  const ph = (posthog as any).getFeatureFlag(key) as string | undefined;
  if (ph == null) return;
  track({ name: 'experiment_converted', props: { experimentKey: key, variant: ph, metric, value } });
}
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/experiments/client.ts && echo "OK client" || echo "MISSING client"
grep -c 'experiment_exposed' frontend/lib/experiments/client.ts
grep -c 'sessionStorage' frontend/lib/experiments/client.ts
```
Expected: `OK client`; each count ≥ 1.

---

## Step 4 — Ship the two experiments

**Experiment 1 — hero copy on hub landing pages**

In `frontend/app/[domainSlug]/page.tsx` (or whichever component renders the hub hero):

```tsx
const heroCopyVariant = variant('hero_copy_v1');
const headline = heroCopyVariant === 'variant_pass'
  ? `Pass Your ${displayName} Interview`
  : `Master ${displayName} Interviews`;
```

**Experiment 2 — personalised home for returning visitors**

In `frontend/app/page.tsx`:

```tsx
const homeVariant = variant('home_personalised_v1');
if (homeVariant === 'variant_recommend') {
  return <PersonalisedHome recommendations={recommend(userTopicHistory)} />;
}
return <DefaultHome />;
```

`recommend()` reads from local-storage topic-visit history (anonymous) or server-side user profile (authenticated). Cap recommendations to no more than 3 hubs; require recommendation diversity score > 0.5.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
grep -c "variant('hero_copy_v1')" frontend/app/\[domainSlug\]/page.tsx 2>/dev/null || \
  grep -rn "variant('hero_copy_v1')" frontend/app/ | wc -l
grep -c "variant('home_personalised_v1')" frontend/app/page.tsx
```
Expected: each ≥ 1.

---

## Step 5 — Weekly status report

Add `scripts/build_experiments_status.py`:

```python
#!/usr/bin/env python3
"""For every experiment in the registry, pull exposure + conversion counts
from PostHog for the prior 7 days. Compute lift + 95% CI. Write
docs/experiments-status.md.

Decision protocol header (printed verbatim in the output):

  An experiment is declared only when ALL of:
  - >= 1000 exposures per variant
  - >= 14 calendar days since start
  - 95% CI on primary metric excludes zero
  - All guardrails within threshold
"""
```

Output table: per experiment → exposures per variant → conversions per metric → lift % → significance (Y/N, with "not enough data" when n < 1000 per variant). Commit weekly via scheduled CI.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f scripts/build_experiments_status.py && echo "OK script" || echo "MISSING script"
python3 scripts/build_experiments_status.py
test -s docs/experiments-status.md && echo "OK report" || echo "MISSING report"
grep -c '1000 exposures' docs/experiments-status.md
```
Expected: `OK script`; `OK report`; `1000 exposures` count ≥ 1.

---

## Step 6 — Decision protocol

Hard rule (in this playbook AND in `docs/experiments-status.md`'s header): an experiment is **declared** only when:

- ≥ 1000 exposures per variant, AND
- 14 calendar days have elapsed since start, AND
- The 95% CI on the primary metric does not include zero, AND
- All guardrails are within threshold.

Otherwise, the verdict is "extend" or "kill" — never "ship the winner by gut feel". Every declared experiment writes its outcome (winner, lift, CI) back into `registry.ts` as a comment and into ROADMAP.md.

---

## Step 7 — Smoke + commits

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

# Manually click through both target pages with PostHog devtools open
# and verify exposures fire once per session.
```

Commits:

```bash
git add frontend/lib/analytics/events.ts
git commit -m "feat(analytics): add experiment_exposed + experiment_converted events (schema v2)"

git add frontend/lib/experiments/
git commit -m "feat(experiments): registry + variant resolution wrapper"

git add frontend/app/page.tsx frontend/app/[domainSlug]/page.tsx
git commit -m "feat(experiments): ship hero_copy_v1 + home_personalised_v1"

git add scripts/build_experiments_status.py docs/experiments-status.md
git commit -m "docs(experiments): weekly status report scaffolding"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 77-ab-testing-and-personalization DONE"
```

---

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Registry has every running experiment; no `variant('X')` call without X in registry | 100 % | `rg -t ts "variant\('([^']+)" frontend/` cross-checked against `EXPERIMENTS` keys |
| Variant assignment is stable across page navigations | manual | reload 5 times; same variant each time |
| Variant assignment is stable post-signup (anonymous → logged-in) | manual | sign in mid-session; same variant |
| Exposure event fires once per session per experiment | 1 per session | PostHog event volume vs unique visitors |
| Conversion event fires on the primary metric | manual | click target CTA + observe event |
| Guardrail event fires and is monitored | manual | check `docs/experiments-status.md` |
| Hard kill on `end` date (variant returns default) | manual | clock forward; variant returns 'control' |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Existing pages: zero regression | manual | open hub + home with experiments disabled (flag off) |
| `docs/experiments-status.md` contains decision-protocol header | grep | `grep -c '1000 exposures' docs/experiments-status.md` ≥ 1 |
| Variants do not alter URL structure (SEO safety) | grep | `rg "window\.location" frontend/lib/experiments/client.ts` = 0 URL mutations |

## Failure modes & rollback

- **Sample-ratio mismatch** (50/50 split actually 60/40): bucketing bug; PostHog usually handles this correctly, but if you're using a hashed user id, ensure good hash distribution. Add an SRM check to the weekly report.
- **Peeking** (declaring a winner at day 3): forbidden. The 14-day + 1000-exposures rule is non-negotiable. The status report must show the counter and refuse to print a verdict before it expires.
- **Guardrail blown** (variant increases `search_zero_results` > 5%): kill the experiment immediately, document in `docs/experiments-status.md`.
- **Experiment outlives its `end` date silently**: the wrapper hard-defaults to `control` after `end`; the variant code paths can be deleted in a follow-up PR.
- **Variants leak into SEO** (Google sees `variant_pass` and `variant_control` as duplicate pages): use client-side variant rendering only; never alter URLs per variant; never serve variant content to the Googlebot user agent.
- **Personalised home over-recommends one hub**: cap to 3 hubs; require diversity score > 0.5.
- **Rollback:** delete the variant code path and ship `control`-only, OR set the registry entry's `end` date to today. Both are non-destructive.

## Definition of Done

- [ ] `grep -c 'experiment_exposed' frontend/lib/analytics/events.ts` ≥ 1
- [ ] `grep -c 'experiment_converted' frontend/lib/analytics/events.ts` ≥ 1
- [ ] `test -f frontend/lib/experiments/registry.ts && echo OK` — OK
- [ ] `test -f frontend/lib/experiments/client.ts && echo OK` — OK
- [ ] `grep -rn "variant('hero_copy_v1')" frontend/app/ | wc -l` ≥ 1
- [ ] `grep -c "variant('home_personalised_v1')" frontend/app/page.tsx` ≥ 1
- [ ] `test -s docs/experiments-status.md && echo OK` — OK
- [ ] `grep -c '1000 exposures' docs/experiments-status.md` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] Manual: exposure event fires once per session per experiment in PostHog live view

## Estimated effort

- **Ideal:** 16 hours (2h schema + 3h wrapper + 4h ship 2 experiments + 3h weekly report + 2h consent/SRM QA + 2h smoke).
- **Hard stop:** 32 hours.
- **Recommended split:** 2 agent sessions:
  1. Steps 1-4 (schema + wrapper + ship experiments).
  2. Steps 5-7 (status report + QA + smoke + commits + INDEX).