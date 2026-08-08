# Phase 01 Completion Report (P01-T326, T327)

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Tasks:** 327 / 327 — **COMPLETE**
**Sessions:** 1–7

## Summary

Phase 01 rebuilt the root UI architecture on a token-driven design system. The work spans seven batches:

| Batch | Session | Range | Focus |
|-------|---------|-------|-------|
| 1 | 1 | T011–T035 | Global CSS reorganization, base reset, semantic color token system |
| 2 | 2 | T013–T034 | Hex migration, shared component cleanup |
| 3 | 2 | T021 | Page-level color migration |
| 4 | 3 | T036–T039 | Light-theme surface refinement |
| 5 | 3 | T040–T044 | Light-theme route cleanup |
| 6 | 3 | T045–T052 | Dark-theme depth contract |
| 7 | 3 | T054–T062 | Typography roles + scale |
| 8 | 4 | T064–T073 | Utility hygiene |
| 9 | 4 | T074–T078 | Legacy layout cleanup |
| 10 | 4 | T079 | Hex audit verification |
| 11 | 4 | T035/T053/T063 | Visual validation (contrast) |
| 12 | 5 | T086–T117 | Spacing/radius/shadow/width tokens + 12 layout primitives |
| 13 | 6 | T119–T148 | Button, card, panel, section-header, badge, tag |
| 14 | 7 | T149–T327 | Form, nav, overlays, content, loading/empty/error, a11y, motion, theme, freeze |

## Token Substrate (frozen T320)

| Scale | Tokens | Location |
|-------|--------|----------|
| Color | `--background` → `--text-inverse`, semantic (success/warning/destructive/info), difficulty (easy/medium/hard), code, hero | `globals.css` `:root` + `.dark` |
| Radius | `--radius-xs` → `--radius-full` (8 steps) | `globals.css` + `tailwind.config.ts` |
| Spacing | `--space-0` → `--space-24` (4px base) | `globals.css` + `tailwind.config.ts` |
| Shadow | `--shadow-xs` → `--shadow-xl` (light + dark variants) | `globals.css` + `tailwind.config.ts` |
| Width | `--reading-width`, `--content-width`, `--wide-width`, `--page-gutter` | `globals.css` + `tailwind.config.ts` |
| Z-index | `--z-base` → `--z-tooltip` (10 levels) | `globals.css` + `tailwind.config.ts` |
| Motion | `--motion-duration-instant` → `--slower` + 4 easings | `globals.css` + `tailwind.config.ts` |
| Focus | `--focus-ring-width/offset/color` | `globals.css` |
| Typography | `--font-body/display/code`, tracking, leading | `globals.css` + `tailwind.config.ts` |

## Component Inventory

**Created (Batch 13–14):** Button (cva), Card (cva), Panel, SectionHeader, Badge (cva), Tag, FormField, Spinner, SearchInput, NavLink, PrevNextNav, CodeBlock (+CodeInline), Callout, Prose, ErrorState, InlineError, SuccessFeedback, TableWrapper, Figure, + 12 layout primitives (PageContainer, ReadingContainer, WideContainer, Section, Stack, Cluster, Grid, SplitLayout, StickyRegion, FullWidthBreakout, ResponsiveVisibility).

**Verified (existing, token-compliant):** input, textarea, select, checkbox, radio-group, label, skeleton, empty-state, alert, breadcrumb, pagination, tabs, accordion, dialog, drawer/sheet, dropdown-menu, popover, tooltip, toast/sonner, progress, switch, slider, toggle, scroll-area, command, context-menu, hover-card, navigation-menu, menubar, avatar, aspect-ratio, collapsible, input-otp, resizable, calendar, carousel, chart, sidebar, separator.

## Verification Gates

- **Tailwind compile:** ✅ exit 0 (one pre-existing ambiguous-duration warning, unchanged)
- **TypeScript:** ✅ 8 errors, all pre-existing in `__tests__/launch-config.test.ts` (missing test-runner types). Zero new errors across all batches.
- **WCAG contrast (T035/T053/T063):** ✅ all PASS — `scripts/validate-contrast.mjs`; token defects fixed during Batch 11
- **Review surface:** ✅ `/dev/v2` compiles and renders all components in light + dark
- **Build:** ✅ `next build` completes (84/84 pages) after content-tree stub (documented)

## Issue Log (T325)

**Open issues:** None.

**Resolved during Phase 01:**
- Duplicate `--card-indigo` decorative tint variables → removed (T021)
- Malformed utility classes across route shells → repaired (T064–T078)
- Light-theme `--success`/`--difficulty-easy` too light for white foregrounds → fixed (T053)
- Dark-theme `--text-inverse` near-black on dark hero → fixed (T053)
- `DEFAULT_2` duplicate key in tailwind borderWidth → removed (Batch 12)
- PageContainer double-applying max-width → fixed with widthClass ternary (Batch 12)
- Panel/SectionHeader/Callout/ErrorState TS2430 `title` conflicts → fixed with `Omit<…, 'title'>` (Batch 13/14)
- Legacy button variant consumers breaking after variant removal → fixed with aliases (Batch 13)

**Known follow-ups (non-blocking):**
- Migrate 3 legacy button-variant consumers (site-header, account/page, empty-state) to `variant="primary"` before removing aliases.
- Wire a rehype-highlight plugin at the page level when CodeBlock syntax highlighting is needed.
- The `content/` directory lives in the parent repo; the frontend tree uses build stubs (documented in tracker).

## Freeze (T320–T323)

- **Design tokens:** frozen — color, radius, spacing, shadow, width, z-index, motion, focus, typography scales.
- **Component APIs:** frozen — all Batch 13 + 14 component props/interfaces.
- **Legacy mapping:** published — `LEGACY_REPLACEMENT_MAP.md`.
- **Decision log:** published — `DECISION_LOG.md`.

## Approval (T327)

Phase 01 is self-approved and ready for review. The token substrate and component APIs are stable for downstream phases (02+: SEO/routing/URL rebuild) and route migrations.

**Next:** Phase 00 (audit/truth) or Phase 02, pending product direction.

---

# Phase 04 Completion Report (P04-T478, T479)

**Phase:** 04 — Homepage & Public Discovery Experience Rebuild
**Tasks:** 479 / 479 — **COMPLETE**
**Session:** 10

## Summary

Phase 04 rebuilt the homepage as a calm, focused, readable orientation layer inside the Phase 03 application shell, removing the V1 "everything-on-the-page" anti-pattern.

## What changed

- **`lib/home/home-data.ts`** — canonical homepage data layer: hero, curated pathways (6/12), technologies, featured questions (canonical-derived), content stats (canonical-derived), capabilities (outcomes), footer crawl links. Pure data, server-safe.
- **`components/home/`** — 8 bounded section components + barrel: `HomeHero`, `HomePathways`, `HomeTechnologies`, `HomeFeaturedQuestions`, `HomeCapabilities`, `HomeTrust`, `HomeFooterDiscovery`, `HomeSearchEntry`.
- **`app/page.tsx`** — rebuilt server component composing 7 sections in journey order; only client island is the gated, dynamic no-SSR search entry.
- **Legacy cleanup** — removed 11 dead `components/landing/` components; kept `prep-track-surfaces` (still used by `/prep`).

## Verification gates

- **TypeScript:** ✅ 8 errors (unchanged baseline — pre-existing test-runner types). Zero new errors; zero errors in `home/` or `app/page.tsx`.
- **Tailwind:** ✅ compiles clean; all token classes generated.
- **Architecture:** server-rendered discovery; gated no-SSR search; canonical links; one H1; no competing CTA colours; no decorative gradients/animation; no hard-coded stats.

## Freeze

Homepage IA, hero, discovery, search entry, CTA hierarchy, SEO contract, and data contracts are frozen. See `v2_plan/task-reports/P04-T001_T479_homepage_public_discovery_rebuild.md` for full workstream coverage.

## Approval (T479)

Phase 04 is self-approved and ready for review. The homepage is a calm, focused, readable orientation layer. The V1 "everything-on-the-page" anti-pattern is removed. The homepage introduces; dedicated pages organize.
