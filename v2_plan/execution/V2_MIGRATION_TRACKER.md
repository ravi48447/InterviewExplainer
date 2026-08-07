# Interview Explainer V2 Migration Tracker

**Status:** In progress
**Last updated:** Session 5 — Phase 01 deferred visual validation gates (T035/T053/T063) — PASSED, token defects fixed

## Phase Status

| Phase | Title | Tasks | Done | Status |
|-------|-------|------:|-----:|--------|
| 00 | Repository, Frontend, Backend & Production Truth | 120 | 0 | Pending (audit phase) |
| 01 | Root UI Architecture & Design System Rebuild | 327 | 92 | **In progress** |
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

**Phase 01 — Workstream F (typography strategy) + deferred visual validation**

Batch 4 (this session): P01-T036 → P01-T039 light-theme surface refinement + shared-shell semantic cleanup.
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

## Next Recommended Tasks

- Phase 01's deferred validation gates (T035/T053/T063) are complete. The build-independent cleanup trajectory (T064–T079) and the visual validation gates are all DONE. Remaining Phase 01 work is the broader task list in `tasks/PHASE_01/phase01.md` (not present in this frontend-only tree) plus a human screenshot regression pass on representative routes (home, DSA, a question page, a course module) to close the perceptual layer.
- Recommend proceeding to Phase 02 (Root SEO, Indexing, Routing & URL Rebuild) once the perceptual pass is cleared.

## Blockers

**None.** The frontend toolchain is fully installed and runnable. The full `next build` now completes (✓ Compiled in 21.1s, ✓ 84/84 static pages generated, full `.next/server` emitted) after stubbing the missing `content/` tree with minimal `_index.json` files (the `content/` directory lives in the parent repo, not this frontend-only tree; stubs are build-scaffolding only). `tsc --noEmit` reports zero errors in any edited file (the 17 remaining errors are pre-existing and confined to `__tests__/` — missing test-runner types — and `lib/` — unrelated to the migration work). The Tailwind CLI compiles `app/globals.css` cleanly (225 KB minified) and every canonical repaired utility generates a real CSS rule.

The three visual validation gates (T035 color contrast, T053 dark-theme contrast, T063 typography) all PASS against the running build; token defects found during validation were fixed. See `v2_plan/task-reports/P01-T035_T053_T063_visual_validation.md`.
