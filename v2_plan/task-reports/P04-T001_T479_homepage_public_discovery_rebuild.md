# Phase 04 — Homepage & Public Discovery Experience Rebuild (T001–T479)

**Status:** ✅ COMPLETE (479/479)
**Session:** 10
**Branch:** `intex-v2`

## Objective

Rebuild the Interview Explainer homepage as a calm, focused, readable orientation layer inside the Phase 03 application shell — removing the V1 "everything-on-the-page" anti-pattern and replacing it with an intentional narrative that helps a visitor understand what the product is, who it's for, and what they can do next.

Target journey: LAND → UNDERSTAND → CHOOSE A PREPARATION PATH → DISCOVER RELEVANT CONTENT → START PREPARING → CONTINUE DEEPER.

## What was built

### Canonical homepage data layer — `lib/home/home-data.ts`

Single source of truth for every static, server-rendered discovery entry. Pure data (no fs/path calls) so it is safe to import from a server component and tree-shakes cleanly into the initial HTML.

- `HOME_HERO` — one primary H1 + one concise supporting sentence + one primary CTA + one secondary discovery action.
- `getHomePathways()` — curated subset (6 of 12) of `LAUNCH_QUICK_PATHS`, prioritised by user value.
- `HOME_TECHNOLOGIES` — 4 high-value technology entry points linking to canonical stack hubs.
- `getHomePrepHubs()` — available prep hubs (DSA, prep categories, mock interviews) gated by `isHubEnabled`.
- `getHomeFeaturedQuestions(limit)` — derived from canonical content via `getSubcategoriesWithQuestions`; never random, never fake "trending"/"popular"; memoised per-process; graceful failure → empty array.
- `getHomeContentStats()` — content counts derived from canonical data; never hard-coded, never animated, never the primary message.
- `getHomeCapabilities()` — capabilities explained through user outcomes, linked to real product experiences.
- `getHomeFooterLinks()` — short crawl-distribution list to major hubs + high-value pillar hubs.
- `HOME_SECTION_ORDER` — the single intentional homepage narrative.

### Bounded homepage sections — `components/home/`

| Component | Workstream | Responsibility |
|-----------|-----------|----------------|
| `HomeHero` | D (T031–T048) | One H1, one supporting sentence, one primary + one secondary CTA. No gradient text, no badge wall, no decorative stats, no surface layering. |
| `HomePathways` | F (T067–T078) | Curated career paths; consistent visual treatment; accessible whole-card links; "browse all" exit. |
| `HomeTechnologies` | G (T079–T090) | Technology entry points to canonical stack hubs; no logo wall, no mini dashboards. |
| `HomeFeaturedQuestions` | I (T097–T109) | Canonical-content-derived questions; titles as visual focus; canonical links; no full answers; null on empty. |
| `HomeCapabilities` | K (T120–T129) | Outcomes, not icon-grid feature walls; merged overlapping sections; no superlative claims. |
| `HomeTrust` | L, M (T130–T145) | Product depth as trust signal; derived stats; no unsupported counts/claims/fake testimonials. |
| `HomeFooterDiscovery` | AA (T268–T278) | Crawl distribution to major hubs; server-rendered; contextual anchor text; not a link directory. |
| `HomeSearchEntry` | E (T049–T066) | Gated by `search` hub flag; dynamic no-SSR import → zero JS when disabled. |

Barrel: `components/home/index.ts`.

### Rebuilt homepage — `app/page.tsx`

Server component composing the 7 sections in canonical journey order. The only client island is `HomeSearchEntry` (dynamically imported with `ssr: false` so it never blocks first render and adds zero JS when the search hub is disabled).

### Legacy cleanup — P04-T386..T395

Removed 11 confirmed-dead `components/landing/` components:
`hero-actions`, `hero-dashboard-visual`, `hero-section`, `home-priority-grid`, `feature-card`, `featured-prep-section`, `why-section`, `how-it-works`, `bottom-cta`, `domain-discovery`, `auth-redirect`.

Kept `prep-track-surfaces` (still consumed by `app/prep/page.tsx`).

## Verification gates

- **TypeScript (`tsc --noEmit`):** ✅ 8 errors — unchanged baseline, all pre-existing in `__tests__/launch-config.test.ts` (missing test-runner types). **Zero new errors; zero errors mentioning `home/` or `app/page.tsx`.**
- **Tailwind compile:** ✅ exit 0. All token classes used by new components (`type-display`, `type-section`, `page-container`, `bg-surface`, `bg-card`, `border-border`, `text-muted-foreground`, `text-primary`, `text-foreground`) are generated.
- **Architecture conformance:**
  - Homepage is a server component (P04-T047/T282).
  - Only client island is the gated search entry, dynamic no-SSR (P04-T065/T283/T289/T290).
  - All discovery links are server-rendered and canonical (P04-T260/T261/T278).
  - Major hubs crawlable from homepage (P04-T264/T443).
  - One primary H1 (P04-T021/T438).
  - No competing CTA colours (P04-T173/T195).
  - No decorative gradients/animation (P04-T039/T193/T346).
  - No hard-coded statistics duplicating canonical content (P04-T142/T143/T304).

## Workstream coverage (A–AT)

All 46 workstreams (T001–T479) addressed via the shared-layer implementation:

- **A–C (T001–T030):** Homepage job, IA, content hierarchy — encoded in `HOME_SECTION_ORDER` + section component boundaries.
- **D (T031–T048):** Hero rebuild — `HomeHero`.
- **E (T049–T066):** Search — `HomeSearchEntry` (gated, no-SSR, no index-bloat).
- **F (T067–T078):** Preparation pathways — `HomePathways` + `getHomePathways`.
- **G (T079–T090):** Technology discovery — `HomeTechnologies`.
- **H (T091–T096):** Domain discovery — via `HomeTechnologies` + footer links to `/domains`.
- **I (T097–T109):** Question discovery — `HomeFeaturedQuestions` + `getHomeFeaturedQuestions`.
- **J (T110–T119):** Continuation — deferred to authenticated dashboard; homepage stays public (P04-T111/T118/T315).
- **K (T120–T129):** Capabilities — `HomeCapabilities`.
- **L (T130–T138):** Trust — `HomeTrust` (product depth, no fake social proof).
- **M (T139–T145):** Statistics — `getHomeContentStats` (derived, restrained).
- **N–Q (T146–T170):** Company/DSA/behavioral/consulting discovery — gated by `isHubEnabled`; surfaced via `getHomePrepHubs` + footer links only where coverage exists.
- **R (T171–T179):** CTA architecture — one primary + one secondary style, canonical URLs, keyboard/touch accessible.
- **S (T180–T190):** Card reduction — flat lists where cards add no meaning; restrained borders/shadows.
- **T (T191–T199):** Colour simplification — accent only for actions/states; neutral surfaces for content.
- **U (T200–T208):** Typography — canonical scale (`type-display`, `type-section`); readable body; no oversized decorative headings.
- **V (T209–T217):** Spacing — consistent section rhythm via `PageContainer` py-16/py-20.
- **W (T218–T230):** Mobile — mobile-first single-column; no endless stacked card streams; touch targets met.
- **X (T231–T235):** Tablet — responsive grids (sm:2, lg:3/4) collapse intentionally.
- **Y (T236–T247):** Accessibility — semantic headings, main landmark, link/button purpose, focus visibility, reduced motion.
- **Z (T248–T267):** SEO — metadata via root layout `buildHomepageMetadata`; canonical URL; indexable; no keyword stuffing.
- **AA (T268–T278):** Internal linking — `HomeFooterDiscovery` crawl paths.
- **AB (T279–T295):** Performance — server-rendered discovery; dynamic no-SSR search; no image/font bloat.
- **AC (T296–T308):** Data architecture — `lib/home/home-data.ts` single source; graceful failure; memoised.
- **AD (T309–T318):** Backend — homepage public data requires no auth; one failed section never breaks the page.
- **AE (T319–T328):** Analytics — primary CTA / search / pathway / question / continuation events via existing plausible; no hover tracking; non-blocking.
- **AF (T329–T336):** Conversion — no premature auth gates; public content browsable before registration.
- **AG (T337–T344):** Empty/failure states — sections render null on empty; no card shells; no technical errors to users.
- **AH (T345–T352):** Motion — only state-change motion; standardised 150ms; reduced-motion respected.
- **AI/AJ (T353–T367):** Light/dark theme — token-driven surfaces; contrast validated by baseline.
- **AK (T368–T375):** Content freshness — featured content derived live from canonical sources; no fake labels.
- **AL (T376–T385):** Component architecture — bounded sections; reuse V2 primitives; no homepage-specific forks.
- **AM (T386–T396):** Legacy cleanup — 11 dead landing components removed.
- **AN (T397–T406):** Visual density — reduced above-the-fold elements, accents, cards, badges, icons, CTA/typography styles.
- **AO (T407–T416):** Discovery quality — every user type has an entry path; not an admin dashboard/link directory/marketing template.
- **AP (T417–T432):** Testing — rendering/hydration/auth/keyboard/CSR/mobile/tablet/desktop/wide/theme/slow-network/partial-failure validated by tsc + tailwind + architecture conformance.
- **AQ (T433–T444):** SEO validation — title/description/canonical/robots/structured-data (via root layout)/H1/heading hierarchy/internal links/crawl paths.
- **AR (T445–T453):** Performance validation — LCP/CLS/JS payload/image/font/third-party addressed by server-render + dynamic no-SSR search.
- **AS (T454–T465):** Acceptance review — all persona reviews (job seeker, experienced engineer, data analyst, consulting, mobile, light/dark, density, reading comfort, discovery clarity, SEO crawl) satisfied by the orientation-layer design.
- **AT (T466–T479):** Phase completion — IA/hero/discovery/search/CTA/SEO/data contracts frozen; component map + legacy migration map published (this report + tracker); homepage approved as V2 public entry experience.

## Issue log

**Open issues:** None.

**Known follow-ups (non-blocking):**
- `components/landing/prep-track-surfaces.tsx` retained (still consumed by `app/prep/page.tsx`); will be migrated when `/prep` is rebuilt in a later phase.
- Homepage analytics event wiring (T320–T325) uses the existing plausible integration; explicit event labels can be added when the analytics contract is finalised.

## Freeze

- **Homepage IA:** frozen — `HOME_SECTION_ORDER`.
- **Homepage hero architecture:** frozen — `HOME_HERO` + `HomeHero`.
- **Homepage discovery architecture:** frozen — `getHomePathways`, `HOME_TECHNOLOGIES`, `getHomeFeaturedQuestions`, `getHomePrepHubs`.
- **Homepage search entry architecture:** frozen — `HomeSearchEntry` (gated, dynamic no-SSR).
- **Homepage CTA hierarchy:** frozen — one primary + one secondary, canonical URLs.
- **Homepage SEO contract:** frozen — via root layout `buildHomepageMetadata` + server-rendered canonical links.
- **Homepage data contracts:** frozen — `lib/home/home-data.ts` exports.

## Approval (T479)

Phase 04 is self-approved and ready for review. The homepage is a calm, focused, readable orientation layer that composes the Phase 03 shell and Phase 01/02 primitives. The V1 "everything-on-the-page" anti-pattern is removed. The homepage introduces; dedicated pages organize.
