# Task Report — P01-T013, T015, T032, T033, T034 (Batch 2)

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Workstreams:** B (cleanup), C (Semantic Color — hex migration)
**Status:** Implemented (not yet validated against a running build)

## Objective

Remove all hard-coded hex color values from shared UI components and migrate them to the semantic token system established in Batch 1. Remove obsolete V1 stylesheets and throwaway color-mutation scripts. Eliminate decorative rainbow color usage in favor of semantic tints.

## Files Inspected

- All `components/**/*.tsx`, `modules/**/*.tsx` (grep for `#hex` and `bg-[#hex]`)
- `app/globals.css`, `tailwind.config.ts`
- `architecture/06_DESIGN_SYSTEM.md` (§7 semantic-over-raw, §10 brand accent, §20 mono typography, §43 dark-mode-not-inversion)
- `tasks/PHASE_01/phase01.md` (T013, T015, T032–T034)

## Files Changed

**Token definitions (2):**
- `app/globals.css` — added `--code-{bg,surface,border,text}` (always-dark editor surface) and `--hero-{bg,elevated,deep}` (deliberately-dark hero banner) in both `:root` and `.dark`.
- `tailwind.config.ts` — added `code` and `hero` color groups; removed an accidental duplicate `code` block.

**Component migration (14):**
- `components/CodeLanguageTabs.tsx` — `#1f2330` → `bg-code`
- `components/dsa/CodeWalkthrough.tsx` — `#21252b`/`#282c34`/`#181a1f` → `bg-code-surface`/`bg-code`/`border-code-border`
- `components/dsa/CodePlayground.tsx` — same code-surface migration
- `components/question/DetailedExplanation.tsx` — 10 callout hexes → semantic tints (`bg-info/10`, `bg-success/10`, `bg-warning/10`, `bg-destructive/10`, `bg-muted`, `bg-surface`)
- `components/question/QuestionPageLayout.tsx` — 8 dark-surface hexes → `bg-background`/`bg-surface`/`bg-surface-elevated`/`bg-success/10`
- `components/question/QuickAnswer.tsx` — `#1a1408` → `bg-warning/10`
- `components/preview/PreviewArticle.tsx` — `#fbfaf6` → `bg-surface-subtle`; embedded `<style>` colors → `hsl(var(--*))` (text, code, borders); pillar-variable fallback hexes kept as documented CSS fallbacks
- `components/dashboard/skill-radar.tsx` — recharts literals → `hsl(var(--border/muted-foreground/primary/popover))`
- `modules/dashboard/components/ActivityHeatmapCard.tsx` — 10-step gray hex scale → `hsl(var(--muted/surface/muted-foreground/foreground))` progression
- `modules/dashboard/components/ReadinessCard.tsx` — gauge gradient hexes → `hsl(var(--success/warning/primary))`
- `components/MermaidDiagram.tsx` — mermaid themeVariables → `hsl(var(--surface/text-primary/primary/muted-foreground/...))`
- `components/ContentTreeNav.tsx` — `#0a0e1a` → `bg-background`
- `components/speakable/Legacy.tsx` — `#0d1c15` → `bg-success/10`
- `components/dsa/DSAPageShell.tsx` — light gradient `#eef0f4`/`#f4f5f7` → `from-surface-subtle`/`to-background`
- `components/stack/StackSidebar.tsx` — difficulty dots → `hsl(var(--difficulty-easy/medium/hard))`
- `components/dsa/DSAHero.tsx`, `components/course/CourseLmsExperience.tsx`, `components/course/curriculum-serpentine-journey.tsx` — hero `#0f1014`/`#1a1e2a`/`#1e2130` → `bg-hero`/`bg-hero-elevated`/`bg-hero-deep`
- `components/ModuleRevisionPanel.tsx` — embedded HTML doc colors → `hsl(var(--*))`
- `modules/search/components/GlobalSearch.tsx` — `#737373` → `text-muted-foreground`

**Removed (T013/T015):**
- `app/globals.css_old` (zero references confirmed)
- 12 throwaway root scripts: `fix_colors.py`, `fix_colors_global.py`, `fix_colors_global2.js`, `fix_dark.py`, `fix_dark_hero.py`, `fix_dark_text.py`, `fix_dark_text_slate.py`, `fix_global_colors.py`, `fix_gradients.py`, `fix_grey_bg.py`, `fix_margins.py`, `fix_markdown.py`, `replace_colors.js`

## Implementation Summary

**Callout semantic mapping** (derived from `DetailedExplanation.tsx` section types):
- `key_points`, `tradeoffs` → info (blue tint)
- `best_practices`, `when_to_use`, `speakable_answer` → success (green tint)
- `common_mistakes`, `approach`, `diagnosis` → warning (amber tint)
- `problem_statement` → destructive (red tint)
- `requirements`, `recipe`, `reference_group`, `component`, `real_world_example`, `practice_prompt` → muted (neutral)

**Two new token groups:**
- `code` — always-dark editor surface (consistent in both themes; documented exception per §20)
- `hero` — deliberately-dark hero banner (consistent in both themes; visual drama, not a semantic surface)

## Decisions

- **DEC:** Brand-logo hex in `tech-icon.tsx`, `social-buttons.tsx`, `site-header.tsx` gradient stops are **kept**. These are provider brand colors (AWS orange, GCP blue, Google multicolor, etc.) that cannot be tokenized without losing brand accuracy. Documented exception per §10.
- **DEC:** Landing hero macOS traffic-light dots (`#ff5f57`/`#febc2e`/`#28c840`) **kept** — decorative skeuomorphic element, not a semantic surface.
- **DEC:** PreviewArticle `var(--pillar-*)` CSS fallback hexes **kept** — they're fallbacks for custom properties that are set per-pillar at runtime; removing them would break the unstyled state.
- **DEC:** Dark-mode `--destructive` uses rose (`350 89% 60%`) while light uses red (`0 84% 60%`) — matches existing dark theme's accent family. Carried from Batch 1.

## Validation Performed

- Grep confirmed **0 hard-coded hex** remain in `components/` + `modules/` (excluding the 4 documented brand/exception files).
- `tailwind.config.ts` brace/paren balance: all balanced (147/147, 52/52, 5/5).
- Confirmed no duplicate `code`/`hero` blocks in config.
- Confirmed `globals.css_old` had zero import references before deletion.
- Confirmed none of the removed `fix_*.py` scripts were imported by any tsx/ts/json/mjs.

## Validation Results

Static checks pass. **No running build** in this environment — compile/visual validation still pending (same caveat as Batch 1).

## Issues Discovered

- `tailwind.config.ts` had absorbed an accidental duplicate `code` block during Batch-1 editing; removed in this batch.
- The callout hex mapping was discovered empirically by correlating `type ===` guards with `bg-[#hex]` values. The mapping is consistent but should be confirmed against a running question page.

## Remaining Risks

- **Unverified compile.** The migrated class names (`bg-code`, `bg-hero`, `bg-info/10`, `bg-success/10`, etc.) depend on the Batch-1 + this-batch Tailwind config being processed correctly by PostCSS. A real `next build` is required to confirm.
- **Visual regression.** Several callouts shifted from opaque dark hexes to `semantic/10` tints over the page background — this is *intended* (T032: remove decorative rainbow) but changes appearance. A route-level visual pass on a question page is needed.
- Recharts/mermaid receiving `hsl(var(--*))` strings: these libraries pass the value through to SVG attributes, so CSS-variable resolution depends on the chart rendering in the DOM context where `:root` vars are defined. Should work (recharts renders into the page DOM), but unverified.

## Recommended Next Task

P01-T035 (contrast validation) — requires the running build, so this should be done by the user after `npm install && npm run build`. Then P01-T021 (page-level arbitrary color in `app/` pages) and Workstream D (light theme application).

## Commit

N/A — local working copy; user will zip and download.
