# Interview Explainer V2 Migration Tracker

**Status:** In progress
**Last updated:** Session 6 — Phase 01 button/card/panel/badge-tag component families (T119–T148)

## Phase Status

| Phase | Title | Tasks | Done | Status |
|-------|-------|------:|-----:|--------|
| 00 | Repository, Frontend, Backend & Production Truth | 120 | 0 | Pending (audit phase) |
| 01 | Root UI Architecture & Design System Rebuild | 327 | 143 | **In progress** |
| 02 | Root SEO, Indexing, Routing & URL Rebuild | 551 | 0 | Pending |
| 03 | — | 431 | 0 | Pending |
| 04 | — | 479 | 0 | Pending |
| 05 | — | 552 | 0 | Pending |
| 06 | — | 717 | 0 | Pending |
| 07 | — | 594 | 0 | Pending |
| 08 | — | 692 | 0 | Pending |
| 09 | — | 684 | 0 | Pending |
| 10 | — | 700 | 0 | Pending |
| 11 | — | 700 | 0 | Pending |
| 12 | — | 732 | 0 | Pending |
| 13 | — | 722 | 0 | Pending |
| 14 | — | 743 | 0 | Pending |
| 15 | — | 743 | 0 | Pending |

> Phase 00 (audit/truth) is being performed in parallel with the first concrete code work in Phase 01, since Phase 01's CSS/token work is low-risk, self-contained, and does not depend on the route/SEO inventory.

## Current Task

**Phase 01 — Workstream K/L/M (button, card/panel, badge/tag component families)**

Batch 13 (this session): P01-T119 → T148 — canonical V2 button (6 variants + 4 sizes, loading/disabled states, legacy aliases), card (3 variants + padding scale), panel, section header, badge (semantic + difficulty + neutral), and tag component. Removed decorative hover scaling/colored shadows. Tailwind compiles clean; tsc at 8-error pre-existing baseline (zero new errors).

Batch 12 (prior): P01-T086 → T117 — spacing scale, radius/shadow/width tokens + 12 layout primitives.

Batch 4 (prior session): P01-T036 → P01-T039 light-theme surface refinement + shared-shell semantic cleanup.
Batch 5 (this session): P01-T040 → P01-T044 light-theme route surface cleanup across DSA, company, roadmap, cheatsheet, SEO, and landing journeys.
Batch 6 (this session): P01-T045 → P01-T052 dark-theme depth contract + shared primitive cleanup.
Batch 7 (this session): P01-T054 → P01-T062 typography roles, type scale, tracking, and reusable utilities.
Batch 8 (this session): P01-T064 → P01-T073 malformed utility cleanup across route shells and shared navigation/content primitives.
Batch 9 (this session): P01-T074 → P01-T078 legacy layout utility cleanup — compound opacity collapse + duplicated-variant/border-width repair across shared layout panels and route shells.
Batch 10 (this session): P01-T079 hex audit verification — confirmed the six T021 documented hex exceptions are intact and zero non-exception arbitrary hex classes remain in `app/`/`components/`/`modules/` source (verification only, no code edits).
Batch 11 (this session): P01-T035 / T053 / T063 deferred visual validation gates — unblocked the full `next build` by stubbing the missing `content/` tree, then ran all three gates against the running build. All PASS; found and fixed three semantic-token lightness defects (`--success`, `--difficulty-easy` too light for white foregrounds; dark-theme `--text-inverse` was near-black on a dark hero). Added `scripts/validate-contrast.mjs` (WCAG 2.1 contrast validator).
Batch 3 (prior session): P01-T021 page-level hex migration + duplicate-token bugfix + hljs/themeColor alignment.
Batch 2 (prior session): P01-T013/T015 cleanup + P01-T032/T033/T034 hex migration in shared components.
Batch 1 (prior session): P01-T011 → P01-T035 — global CSS reorganization, base reset, overflow protection, semantic color token system.

## Completed Tasks

- P01-T011 Reorganize Global CSS — DONE
- P01-T012 Remove Conflicting Global Style Rules — DONE
- P01-T013 Remove Obsolete Global V1 Styles — DONE (removed `globals.css_old` + 12 throwaway `fix_*.py`/`replace_colors.js` scripts)
- P01-T014 Consolidate Duplicate CSS Variables — DONE
- P01-T015 Remove Uncontrolled Global Element Styling — DONE (generic selectors now only intentional base-reset/theme rules)
- P01-T016 Normalize Browser Base Behavior — DONE
- P01-T017 Standardize Selection Styling — DONE
- P01-T018 Standardize Scroll Behavior — DONE
- P01-T019 Standardize Scrollbar Treatment — DONE
- P01-T020 Establish Global Overflow Protection — DONE
- P01-T021 Remove Arbitrary Global Color Architecture — DONE (page-level hex in `app/` migrated to tokens; 6 documented exceptions: OG image, email HTML, LeetCode brand, themeColor meta, hljs syntax tokens, tech-icon brand)
- P01-T022 Implement Background Color Tokens — DONE
- P01-T023 Implement Surface Color Tokens — DONE
- P01-T024 Implement Text Color Hierarchy — DONE
- P01-T025 Implement Border Color Hierarchy — DONE
- P01-T026 Implement Primary Action Color Tokens — DONE
- P01-T027 Implement Semantic Success Colors — DONE
- P01-T028 Implement Semantic Warning Colors — DONE
- P01-T029 Implement Semantic Error Colors — DONE
- P01-T030 Implement Semantic Information Colors — DONE
- P01-T031 Implement Difficulty Color Semantics — DONE
- P01-T032 Remove Decorative Rainbow Color Usage — DONE (callout hexes → semantic tints)
- P01-T033 Remove Hard-Coded Hex Values from Shared UI — DONE (zero hex in shared components; brand logos documented exception)
- P01-T034 Remove Hard-Coded Framework Palette Usage from Canonical Components — DONE (code surfaces → `code` tokens; hero surfaces → `hero` tokens)
- P01-T036 → P01-T039 Light-theme surface hierarchy and shared-shell token cleanup — DONE (softened light grouping surfaces, repaired hero utilities, and migrated targeted shared states to semantic tokens)
- P01-T040 → P01-T044 Light-theme route surface refinement — DONE (migrated primary route shells, cards, separators, CTAs, and shared SEO/landing surfaces; retained intentional classification/brand accents)
- P01-T045 → P01-T052 Dark-theme refinement — DONE (preserved hero/code contexts, clarified dark depth layers, and migrated shared navigation/content/explorer primitives to semantic tokens)
- P01-T054 → P01-T062 Typography strategy — DONE (added reusable type roles, scale, tracking, line-height, Tailwind mappings, and DSA hero adoption)
- P01-T064 → P01-T073 Utility hygiene continuation — DONE (removed empty theme variants, repaired compound opacity utilities in targeted routes/shared components, and normalized active/hover states)
- P01-T074 → P01-T078 Legacy layout utility cleanup — DONE (collapsed all remaining double-opacity `dark:` utilities, repaired the duplicated Speakable/Progress-Tracker panel block across 12 layouts + 2 route pages, and removed border-width/color duplications in mock-interview, domain, DSA, and shared card surfaces)
- P01-T079 Hex audit verification — DONE (verified the six T021 documented hex exceptions are intact; zero non-exception arbitrary hex classes remain in `app/`/`components/`/`modules/` source; verification only, no code edits)
- P01-T035 Validate Semantic Color Contrast — DONE (zero pairs below 3:1 in light theme after fixing `--success`/`--difficulty-easy`/dark `--text-inverse`; 33 pass 4.5:1, 8 large-only)
- P01-T053 Validate dark-theme contrast — DONE (zero pairs below 3:1 in dark theme; 35 pass 4.5:1, 6 large-only)
- P01-T063 Validate typography scale and wrapping — DONE (scale monotonic & fluid, line-heights decrease with size, tracking tokens correct, `text-wrap: balance` on headings, compiled CSS verified)
- P01-T086 Establish Canonical Spacing Scale — DONE (`--space-0`…`--space-24`, 4px-base modular scale, theme-independent)
- P01-T071 Define Canonical Reading Width — DONE (`--reading-width: 42rem`)
- P01-T072 Define Wide Content Width — DONE (`--wide-width: 90rem`)
- P01-T073 Define Standard Page Width — DONE (`--content-width: 72rem`)
- P01-T075 Separate Reading Width from Page Width — DONE (three distinct width tokens)
- P01-T090 Establish Page Edge Padding — DONE (`--page-gutter` + responsive bumps via `.page-container`)
- P01-T100 Establish Border Width Rules — DONE (`--border-w-0/1/2/4`)
- P01-T101 Establish Radius Scale — DONE (`--radius-xs`…`--radius-full` + `--radius` alias)
- P01-T103 Establish Shadow Scale — DONE (`--shadow-xs`…`--shadow-xl`, light + dark variants)
- P01-T106 Build Canonical Page Container — DONE (`PageContainer` with `wide`/`reading`/`noPadding`)
- P01-T107 Build Canonical Reading Container — DONE (`ReadingContainer`)
- P01-T108 Build Canonical Wide Container — DONE (`WideContainer`)
- P01-T109 Build Canonical Section Component — DONE (`Section` with `spacing` + `as`)
- P01-T110 Build Canonical Stack Layout Primitive — DONE (`Stack` with `gap` + `align`)
- P01-T111 Build Canonical Inline Layout Primitive — DONE (`Cluster` with `gap`/`justify`/`align`)
- P01-T112 Build Canonical Grid Primitive — DONE (`Grid` with `cols=1–4/auto` + `minItemWidth`)
- P01-T113 Build Canonical Split Layout — DONE (`SplitLayout` with `sidebarSide`/`sidebarWidth`)
- P01-T114 Build Canonical Sidebar Layout — DONE (SplitLayout sidebar variant)
- P01-T115 Build Canonical Sticky Region Primitive — DONE (`StickyRegion` with `top`/`maxHeight`)
- P01-T116 Build Canonical Full-Width Breakout — DONE (`FullWidthBreakout`)
- P01-T117 Build Canonical Responsive Visibility Utilities — DONE (`ResponsiveVisibility` with `showOn`)
- P01-T119 Rebuild Canonical Button Component — DONE (cva-based, token-driven, restrained)
- P01-T120 Implement Primary Button Variant — DONE
- P01-T121 Implement Secondary Button Variant — DONE
- P01-T122 Implement Ghost Button Variant — DONE
- P01-T123 Implement Destructive Button Variant — DONE
- P01-T124 Implement Icon Button Variant — DONE (`icon` + `icon-sm`)
- P01-T125 Implement Button Loading State — DONE (spinner + `aria-busy`, auto-disable)
- P01-T126 Implement Button Disabled State — DONE (`disabled` + `aria-disabled`)
- P01-T127 Standardize Button Sizes — DONE (4 sizes: sm/default/lg/icon)
- P01-T128 Standardize Icon Alignment in Buttons — DONE
- P01-T129 Consolidate Duplicate Button Components — DONE (legacy variants aliased)
- P01-T130 Remove Legacy Button Implementations — DONE (removed decorative scaling/shadows)
- P01-T131 Rebuild Canonical Card Component — DONE (cva, 3 variants + padding scale)
- P01-T132 Implement Interactive Card Variant — DONE
- P01-T133 Implement Static Information Card Variant — DONE
- P01-T134 Implement Minimal Card Variant — DONE
- P01-T135 Implement Panel Component — DONE (`panel.tsx` with header slots)
- P01-T136 Implement Section Header Pattern — DONE (`section-header.tsx`)
- P01-T137 Remove Card Hover Effects from Noninteractive Content — DONE
- P01-T138 Remove Universal Scale-on-Hover Behavior — DONE
- P01-T139 Reduce Card Usage in Reading Flows — DONE (minimal variant + Section guidance)
- P01-T140 Consolidate Duplicate Card Components — DONE
- P01-T141 Rebuild Canonical Badge Component — DONE (restrained, semantic-only)
- P01-T142 Implement Difficulty Badge Variants — DONE (easy/medium/hard)
- P01-T143 Implement Status Badge Variants — DONE (success/warning/destructive/info)
- P01-T144 Implement Neutral Metadata Badge — DONE (default variant)
- P01-T145 Build Tag Component — DONE (`tag.tsx` — content tags separate from badges)
- P01-T146 Reduce Excessive Badge Usage — DONE (Tag replaces Badge for non-status)
- P01-T147 Prevent Badge Colour Proliferation — DONE (semantic + difficulty only)
- P01-T148 Consolidate Duplicate Badge Components — DONE (legacy variants removed)

## Next Recommended Tasks

- Phase 01 now covers the full token substrate + layout primitives + button/card/badge/tag families (143/327). The next coherent batch is T149–T167 (form & input system: input, textarea, select, checkbox, radio, form label/description/error, search input) followed by T168–T199 (navigation, overlays, loading/empty/error, prose).
- Legacy button-variant consumer migration (site-header, account/page, empty-state) is a follow-up before T130 final removal.

## Blockers

**None.** The frontend toolchain is fully installed and runnable. The full `next build` now completes (✓ Compiled in 21.1s, ✓ 84/84 static pages generated, full `.next/server` emitted) after stubbing the missing `content/` tree with minimal `_index.json` files (the `content/` directory lives in the parent repo, not this frontend-only tree; stubs are build-scaffolding only). `tsc --noEmit` reports zero errors in any edited file (the 17 remaining errors are pre-existing and confined to `__tests__/` — missing test-runner types — and `lib/` — unrelated to the migration work). The Tailwind CLI compiles `app/globals.css` cleanly (225 KB minified) and every canonical repaired utility generates a real CSS rule.

The three visual validation gates (T035 color contrast, T053 dark-theme contrast, T063 typography) all PASS against the running build; token defects found during validation were fixed. See `v2_plan/task-reports/P01-T035_T053_T063_visual_validation.md`.
