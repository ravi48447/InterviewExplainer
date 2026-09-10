# 78 — Monetization, Pricing Page, and Premium Tier

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** product launch — paid surface. **Depends on:** 41 (interview-qa hub), 76 (analytics + signup funnel), 77 (A/B for pricing variants), 50 (sitemap + redirects).

## TL;DR

- **Goal:** Ship a sustainable paid tier on top of the existing free content layer: free remains generous (every question is readable), Premium unlocks structured courses, mark-mastered progress sync across devices, mock-interview attempts, custom roadmaps, and ad-free reading. Pricing page + Stripe checkout + entitlements + paywall component all ship in this playbook.
- **Action:** Wire Stripe Checkout + Customer Portal for two plans (monthly + annual), introduce an `entitlements` table backed by the existing auth, ship a pricing page (`/pricing`) with three tiers (Free / Premium / Premium Annual), add a `<Paywall>` React component, and gate a small list of premium-only surfaces (mock-interview attempts, structured-course completion, cross-device progress sync) behind it.
- **Output:** A live `/pricing` page, working Stripe checkout (live mode behind env flag), `entitlements.tier IN ('free','premium')` per user, paywall component gating mock-interview attempts past the first 3, weekly MRR + churn snapshot committed to `docs/monetization-status.md`.

## Hard prerequisites

- [ ] Playbook 41 (interview-qa hub) DONE — there is enough free content to make Premium a value-add rather than a bait.
- [ ] Playbook 76 (analytics) DONE — premium funnel events already in schema.
- [ ] Playbook 77 (A/B) at least scaffolded — pricing-page hero variants will run as an experiment.
- [ ] Auth context lives in `frontend/context/auth-context.tsx` and persists across sessions.
- [ ] Stripe account created; webhook endpoint reachable from production.
- [ ] Legal: privacy policy + terms of service URLs exist (or are stubs that will ship in the same PR).

## Why this matters

Without a paid tier, the platform's growth ceiling is whatever a single-operator project can sustain on personal cost; with one, every committed free user becomes a possible conversion that funds the next 10 free users. The correct approach is **not** to paywall existing free content (which would damage organic search and user trust) but to add **time-saving** surfaces (structured courses, mock interviews, progress sync, ad-free) that the most-engaged users will pay for voluntarily.

## Background

This playbook implements a Stripe-based billing system. Key design decisions:

- **Stripe Checkout** (not Elements): Checkout is PCI-compliant by default and handles card data entirely on Stripe's servers. The repo stays PCI-out-of-scope as long as no card details flow through it.
- **Stripe Customer Portal**: one-click plan change and cancellation. Hostile cancellation UX produces chargebacks that damage Stripe account health.
- **Free content stays free**: every `<Paywall>` component must wrap only the premium feature, not the underlying content. CI lint: `rg '<Paywall>' frontend/app/` must not match topic-view or hub-card surfaces.
- **Webhook idempotency**: the `stripe_processed_events` table stores processed `event.id` values. A duplicate webhook is silently ignored; a first-time webhook is processed exactly once inside a database transaction.
- **Entitlements as the canonical source of truth**: the backend `entitlements` table is authoritative. The frontend `useEntitlement()` hook is for UX only. A client-side `tier === 'free'` check that disagrees with the server-side check should log an alert — the API always enforces the server-side check.

Real anchors: Stripe API version 2024-04-10 (current as of mid-2024); `stripe-java` 25.x (Stripe Java library); `@stripe/stripe-js` 3.x (frontend); Next.js App Router API routes (`app/api/billing/`); Flyway for schema migrations (Java Spring Boot convention in this codebase).

Files to read before executing:

| Path | Why |
|---|---|
| `frontend/context/auth-context.tsx` | Where user id surfaces; entitlements must hang off this. |
| `frontend/components/mark-complete-button.tsx` | The mastery surface — its server-side sync is a Premium feature. |
| `frontend/app/dashboard/page.tsx` | Where Premium surfaces (custom roadmaps, progress) live. |
| `expansion-plan/76-analytics-and-content-instrumentation.md` | `premium_pricing_view`, `premium_checkout_start`, `premium_checkout_complete` already in schema. |
| `expansion-plan/77-ab-testing-and-personalization.md` | Add `pricing_hero_v1` experiment to registry. |

---

## Step 1 — Stripe configuration

Create two products in Stripe (in test mode first):

- `Premium Monthly` — $9 USD / month
- `Premium Annual` — $79 USD / year (≈ 27% discount vs monthly)

Capture the price IDs. Add to `frontend/.env.example`:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_ANNUAL=price_...
NEXT_PUBLIC_PRICING_LIVE=false   # gates the live "Buy" button; true only after webhook works end-to-end in prod
```

**Verify:**
```bash
grep -c 'STRIPE_SECRET_KEY' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/.env.example
grep -c 'NEXT_PUBLIC_PRICING_LIVE' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/.env.example
```
Expected: each ≥ 1.

---

## Step 2 — Backend entitlements

Add a Flyway migration (next available `V` number — likely `V006__entitlements.sql`):

```sql
CREATE TABLE entitlements (
  user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tier                 TEXT NOT NULL CHECK (tier IN ('free', 'premium')) DEFAULT 'free',
  stripe_customer_id   TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  current_period_end   TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX entitlements_tier_idx ON entitlements (tier) WHERE tier = 'premium';

CREATE TABLE stripe_processed_events (
  event_id   TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Backend service: `backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/` with:

- `EntitlementsService.getOrCreate(userId)` — returns `{tier, currentPeriodEnd}`.
- `StripeWebhookController` — handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. On each, upsert into `entitlements`. Idempotency check against `stripe_processed_events`.
- `BillingController.createCheckoutSession(userId, plan)` — returns a Stripe Checkout URL.
- `BillingController.createPortalSession(userId)` — returns a Stripe Customer Portal URL.

The Java module follows the same shape as `modules/auth/` and `modules/content/`.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
MIGRATION_FILE=$(find backend/src/main/resources/db/migration -name 'V006__entitlements.sql' 2>/dev/null | head -1)
test -n "$MIGRATION_FILE" && echo "OK migration" || echo "MISSING migration"
test -d backend/src/main/java/com/interviewexplainer/backendapi/modules/billing && echo "OK billing module" || echo "MISSING billing module"
grep -c 'verifyWebhookSignature\|constructEvent' \
  backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/StripeWebhookController.java 2>/dev/null || echo "(webhook file not yet present)"
```

---

## Step 3 — Pricing page

`frontend/app/pricing/page.tsx`:

- Three columns: Free / Premium Monthly / Premium Annual.
- Free column lists ALL the things that stay free (read every question, search, full hub access, etc.) — be generous.
- Premium columns list the Premium-only surfaces (see Step 5).
- "Most popular" badge on Premium Annual.
- CTA button → calls `/api/billing/checkout` → redirects to Stripe Checkout.
- Hero copy wrapped by `variant('pricing_hero_v1')` (defined in Step 8 and playbook 77).
- "Compare plans" expandable detail table below the three columns.
- FAQ section addressing the three top objections: "Will free content stay free?" (yes), "Can I cancel anytime?" (yes, via Customer Portal), "Do you offer student / open-source discounts?" (yes, link to an apply form).
- Display prices read from `formatAmount(price_id)` helper that fetches Stripe's `unit_amount` at build time — never hardcode display prices.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/app/pricing/page.tsx && echo "OK pricing page" || echo "MISSING pricing page"
grep -c 'pricing_hero_v1' frontend/app/pricing/page.tsx
grep -c 'formatAmount\|unit_amount' frontend/app/pricing/page.tsx
```
Expected: `OK pricing page`; each count ≥ 1.

---

## Step 4 — Paywall component

`frontend/components/Paywall.tsx`:

```tsx
'use client';
import { useEntitlement } from '@/lib/billing/use-entitlement';
import { track } from '@/lib/analytics/client';

export function Paywall({
  feature,
  children,
  preview,
}: {
  feature: 'mock-interview-extra' | 'progress-sync' | 'structured-course';
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  const { tier, isLoading } = useEntitlement();
  if (isLoading) return null;
  if (tier === 'premium') return <>{children}</>;
  return (
    <div className="paywall">
      {preview}
      <div className="paywall-cta">
        <p>Unlock <strong>{feature.replaceAll('-', ' ')}</strong> with Premium.</p>
        <a
          href={`/pricing?ref=${encodeURIComponent(feature)}`}
          onClick={() => track({ name: 'premium_pricing_view', props: { plan: undefined } })}
        >
          See plans
        </a>
      </div>
    </div>
  );
}
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/components/Paywall.tsx && echo "OK paywall" || echo "MISSING paywall"
# Confirm <Paywall> is NOT wrapping topic-view or hub-card surfaces
PAYWALL_MISUSES=$(rg '<Paywall' frontend/app/interview/ frontend/app/databases/ frontend/app/cloud-architecture/ 2>/dev/null | wc -l)
echo "Paywall misuses on content pages: $PAYWALL_MISUSES (want 0)"
```
Expected: `OK paywall`; misuses = 0.

---

## Step 5 — Premium-only surfaces (initial set, deliberately small)

1. **Mock-interview attempts past the first 3 per month** — Paywall on the 4th attempt button.
2. **Cross-device progress sync** — mark-mastered server-side persistence; free users get local-storage only.
3. **Structured-course completion certificates** — free users can read every lesson; only Premium can mark a course "completed" and download a PDF certificate.

Resist the temptation to add more surfaces in v1 — every extra paywall is a place the value prop frays.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
# All three premium surfaces have a <Paywall> wrapper
grep -rn "mock-interview-extra" frontend/ | wc -l
grep -rn "progress-sync" frontend/components/mark-complete-button.tsx | wc -l
grep -rn "structured-course" frontend/ | wc -l
```
Expected: each ≥ 1.

---

## Step 6 — Server-side entitlement check on protected endpoints

For each protected endpoint (e.g. `POST /api/mock-interviews/start` past the monthly limit):

1. Verify the auth token.
2. Look up `entitlements.tier` for the user.
3. If `tier = 'free'` AND the per-feature counter exceeds the free limit, return `402 Payment Required`.
4. The frontend translates `402` into a Paywall display.

Add a `BillingGate` annotation (or interceptor) so every premium-gated controller method declares its feature key.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
grep -rn '402\|BillingGate\|Payment Required' backend/src/main/ | wc -l
```
Expected: ≥ 1.

---

## Step 7 — Webhook verification + idempotency

The Stripe webhook handler must:

- Verify the `Stripe-Signature` header with `STRIPE_WEBHOOK_SECRET` via `Webhook.constructEvent()`.
- Idempotency-key against `event.id` (store processed events in `stripe_processed_events` table; reject duplicates).
- Update `entitlements` in a single transaction.
- Log every event for audit (separate `stripe_event_log` table or existing structured logs).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
WEBHOOK_CONTROLLER=backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/StripeWebhookController.java
test -f "$WEBHOOK_CONTROLLER" && echo "OK webhook controller" || echo "MISSING webhook controller"
grep -c 'stripe_processed_events\|idempotent\|processedEvents' "$WEBHOOK_CONTROLLER" 2>/dev/null
```

---

## Step 8 — Pricing-page A/B (extends playbook 77)

Add `pricing_hero_v1` to `frontend/lib/experiments/registry.ts`:

- Control: "Master interviews with structured prep."
- Variant: "Save 100 hours. Pass your next interview."
- Primary metric: `premium_checkout_complete`.
- Guardrail: `premium_pricing_view` rate (don't lose top-of-funnel).

**Verify:**
```bash
grep -c 'pricing_hero_v1' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/experiments/registry.ts
```
Expected: ≥ 1.

---

## Step 9 — Monthly status report

Add `scripts/build_monetization_status.py`:

```python
#!/usr/bin/env python3
"""Pull Stripe Subscriptions API for active / canceled / past_due subs; compute
MRR, ARR, churn, paid-conversion rate (vs total signups from analytics).
Write docs/monetization-status.md.
"""
```

Output: MRR, ARR, churn % monthly, free-to-paid conversion % monthly, top-3 cancellation reasons (from Stripe Customer Portal cancellation survey).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f scripts/build_monetization_status.py && echo "OK script" || echo "MISSING script"
python3 scripts/build_monetization_status.py
test -s docs/monetization-status.md && echo "OK report" || echo "MISSING report"
```

---

## Step 10 — Smoke + commits + go-live checklist

**Pre-flight before flipping `NEXT_PUBLIC_PRICING_LIVE=true`:**

1. Stripe in **test mode**: complete checkout end-to-end with a test card (`4242 4242 4242 4242`); verify webhook arrives; verify `entitlements.tier='premium'` in DB; verify Paywall component lifts.
2. Cancel the test subscription via Customer Portal; verify webhook + `tier` back to `'free'`.
3. Switch Stripe to **live mode** in env; flip `NEXT_PUBLIC_PRICING_LIVE=true`; complete one $1 test subscription (using a real card on a Premium Annual price temporarily lowered to $1), then refund and delete.
4. Verify `docs/monetization-status.md` shows the test purchase and refund.

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20
```

Commits:

```bash
git add backend/src/main/resources/db/migration/V006__entitlements.sql
git commit -m "infra(billing): entitlements table + stripe_processed_events idempotency table"

git add backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/
git commit -m "feat(billing): EntitlementsService + Stripe webhook + checkout/portal"

git add frontend/app/pricing/ frontend/components/Paywall.tsx frontend/lib/billing/
git commit -m "feat(billing): pricing page + Paywall component + entitlement hook"

git add frontend/lib/experiments/registry.ts
git commit -m "feat(experiments): add pricing_hero_v1 experiment"

git add frontend/app/mock-interviews/ frontend/components/mark-complete-button.tsx
git commit -m "feat(billing): gate mock-interview-4th-attempt + progress-sync behind Paywall"

git add scripts/build_monetization_status.py docs/monetization-status.md
git commit -m "docs(monetization): monthly MRR + churn report"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 78-monetization-pricing-and-premium-tier DONE"
```

---

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Free content stays free | 100 % | `rg '<Paywall' frontend/app/interview/ frontend/app/databases/ 2>/dev/null \| wc -l` = 0 |
| Stripe webhook signature verified | always | `grep -c 'constructEvent\|verifyWebhookSignature' backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/StripeWebhookController.java` ≥ 1 |
| Webhook idempotency enforced | always | `grep -c 'stripe_processed_events' backend/src/main/java/com/interviewexplainer/backendapi/modules/billing/StripeWebhookController.java` ≥ 1 |
| `entitlements.tier` transitions on subscription create / cancel | manual | DB inspection after test purchase/cancel |
| `402 Payment Required` returned by backend when free user exceeds quota | manual | `curl -X POST /api/mock-interviews/start -H 'Authorization: Bearer <free-user-token>'` past quota |
| Paywall component shows preview + CTA when `tier = 'free'` | manual | open mock-interview 4th attempt as free user |
| Stripe customer portal works (plan change + cancel) | manual | round-trip in test mode |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Pricing page in sitemap | 1 | `grep -c '/pricing' frontend/public/sitemap.xml` ≥ 1 |
| Pricing-page A/B running | 1 | `grep -c 'pricing_hero_v1' frontend/lib/experiments/registry.ts` ≥ 1 |
| `docs/monetization-status.md` exists and parseable | 1 | `wc -l docs/monetization-status.md` ≥ 1 |
| Privacy policy + ToS URLs reachable from pricing footer | 2 | manual click |

## Failure modes & rollback

- **Webhook lag**: a user pays but `entitlements.tier` stays `'free'` for 30s. Poll `/api/billing/me` for 60s after `checkout.session.completed` and optimistically upgrade in-memory until the webhook lands.
- **Webhook missed**: cron job nightly reconciles `entitlements` against Stripe Subscriptions API; any drift logs an audit entry.
- **User pays but ToS / privacy policy not updated for paid users**: blocker — pre-flight requires updated docs.
- **Dollar amounts in code drift from Stripe Dashboard**: the `formatAmount(price_id)` helper fetches Stripe's `unit_amount` at build time. Never hardcode display prices.
- **PCI scope creep**: never touch card data; Stripe Checkout handles it. The repo is PCI-out-of-scope only as long as no card details flow through it.
- **Rollback:** set `NEXT_PUBLIC_PRICING_LIVE=false` → pricing page shows "Coming soon" + email-capture; existing premium users retain entitlements until natural renewal cycle.

## Definition of Done

- [ ] `grep -c 'STRIPE_SECRET_KEY' frontend/.env.example` ≥ 1
- [ ] `test -f frontend/app/pricing/page.tsx && echo OK` — OK
- [ ] `test -f frontend/components/Paywall.tsx && echo OK` — OK
- [ ] `rg '<Paywall' frontend/app/interview/ 2>/dev/null | wc -l` = 0 (free content stays free)
- [ ] `grep -c 'constructEvent\|verifyWebhookSignature' backend/.../StripeWebhookController.java` ≥ 1
- [ ] `grep -c 'stripe_processed_events' backend/.../StripeWebhookController.java` ≥ 1
- [ ] `grep -c '/pricing' frontend/public/sitemap.xml` ≥ 1
- [ ] `grep -c 'pricing_hero_v1' frontend/lib/experiments/registry.ts` ≥ 1
- [ ] `test -s docs/monetization-status.md && echo OK` — OK
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] Manual: Stripe test-mode checkout → tier upgrade → cancel → tier downgrade all verified end-to-end

## Estimated effort

- **Ideal:** 36 hours (4h Stripe setup + 6h migration + backend service + 6h pricing page + 4h Paywall + 4h entitlement hook + 4h webhook + 4h A/B wire + 4h smoke + status report).
- **Hard stop:** 80 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-2 (Stripe + migration + entitlements service).
  2. Steps 3-5 (pricing page + Paywall + premium-only surfaces).
  3. Steps 6-7 (server-side gates + webhook hardening).
  4. Steps 8-10 (A/B + status + smoke + commits + INDEX + go-live).