# Task Report — P01-T036 → P01-T039 (Batch 4)

## Scope

Light-theme refinement for the semantic surface hierarchy and shared shell/primitives, continuing the approved Phase 01 migration after Batch 3.

## Changes

- Refined the light token layers in `app/globals.css`:
  - softened `--surface` and `--card` to avoid an all-white grouping layer;
  - preserved pure white for elevated/popover surfaces where separation is intentional;
  - strengthened the light hover and sidebar layers without introducing a new accent color;
  - slightly increased sidebar boundary definition for navigation readability.
- Repaired `components/dsa/DSAHero.tsx`:
  - replaced invalid `bg-[bg-hero]` and `from-[bg-hero]` utilities with `bg-hero` and `from-hero`;
  - replaced hero text and accent states with the semantic code/primary tokens;
  - kept the dark hero treatment and decorative grid/glow as intentional visual exceptions.
- Cleaned shared primitive states:
  - `components/ui/button.tsx` now uses `success-foreground` rather than a raw white text utility;
  - `components/ui/resizable-layout.tsx` uses the primary token for resize interaction states;
  - `components/site-footer.tsx` uses semantic primary tokens for the “Soon” badge;
  - `components/StackHierarchyNav.tsx` uses semantic primary states for active/hover navigation rows.

## Validation

- `rg` found no remaining `bg-[bg-hero]` utilities in `uploads/work/frontend`.
- The targeted shared files contain no remaining `bg-blue-50`, `bg-blue-500 dark:bg-blue-800`, or `bg-blue-600 text-white` patterns.
- `npm run build` was attempted, but could not start because `node_modules` is absent and `cross-env` is unavailable in the environment.

## Follow-up

Route-specific raw palette cleanup remains for the next batch. A full build and visual light/dark contrast pass should run after dependencies are installed.
