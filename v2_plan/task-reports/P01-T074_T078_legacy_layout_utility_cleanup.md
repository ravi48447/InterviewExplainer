# Task Report — P01-T074 → P01-T078 (Batch 9)

## Scope

Targeted cleanup of the legacy compound opacity and duplicated-variant utility strings that the P01-T064 → P01-T073 hygiene batch explicitly deferred for a later pass. Covers the shared "Speakable"/"Progress Tracker" panel block duplicated across layout components, plus border-duplication defects in route shells.

## Changes

- Collapsed every malformed double-opacity `dark:` utility (e.g. `dark:bg-red-950/20/40`, `dark:border-default/20/60`) to a valid single-opacity utility, retaining the trailing opacity per the panel convention (`/40` panels, `/50` header strips, `/60` emphasis, `/90` revision group). Applied across `components/`, `app/`, and `modules/` in one pass.
- Repaired the duplicated "Speakable" panel block shared by 12 layout files (`FlowDiagram`, `ArchitectureMap`, `SqlPlayground`, `DesignWhiteboard`, `LifecycleTimeline`, `RecipeBuilder`, `CodeWorkshop`, `InternalsDeepDive`, `ProblemDetective`, `ReferenceCards`, `ConceptExplainer`, `ComparisonArena`) and the "Progress Tracker" block in 2 app pages (`interview/[lang]/[track]/[level]`, `[domainSlug]`):
  - removed the `border-2 … border` width conflict and duplicate `border-default`;
  - removed the conflicting duplicate `dark:border-default/30 dark:border-default/60` (kept a single `dark:border-default/20`);
  - removed the dead `dark:to-teal-950/40` stop (no `bg-gradient-to-*` was present on these panels);
  - normalized the emerald header strip to `border-b border-default dark:border-default/20`.
- Repaired border-duplication defects in route shells: `mock-interviews` (page, results, select-domain), `[domainSlug]/[stackSlug]` (completion banner + the `hover: hover: hover:` triplet), `dsa/sheet`, `dsa/problem` swatch, `landing/hero-dashboard-visual`, and the shared `QuestionPageLayout` card variants and `curriculum-serpentine-journey` active node.
- Preserved legitimate gradient stops: `dark:to-teal-950/40` in `dsa/page.tsx` (composed into `bg-gradient-to-r`) and `roadmaps/page.tsx` (`bg-gradient-to-br`) remain untouched.

## Validation

- `rg` confirms zero remaining double-opacity `dark:` utilities, zero duplicate same-property `dark:` variants on a single element, zero `border border-X border border-Y` duplications, zero dead `dark:to-teal-950/40` without a gradient, zero `hover: hover:` triplets, and zero `border-2 … border` width conflicts across `app/`, `components/`, and `modules/`.
- The two remaining `dark:to-teal-950/40` occurrences are both legitimate gradient stops paired with `bg-gradient-to-*` and `from-*`.
- CSS brace balance is unchanged: `app/globals.css` remains `81/81`; `test.css` remains `3036/3036`. Double-quote balance is even in all edited files.
- The build remains unavailable because dependencies are not installed (`cross-env: not found`); full visual validation is still deferred to the runnable-build gate.
