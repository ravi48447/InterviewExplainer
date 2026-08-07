# P01-T086 → T117 — Spacing Scale, Surface Patterns & Layout Primitives

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Batch:** 12
**Status:** DONE
**Scope:** Foundation token scales (spacing, radius, border-width, shadow, page-width) + 12 canonical layout primitives.

## Tasks completed

### Token scales (globals.css — light `:root` + dark `.dark`)

| Task | Title | What landed |
|------|-------|-------------|
| T086 | Establish Canonical Spacing Scale | `--space-0` … `--space-24` (4px-base modular scale, 15 steps). Theme-independent. |
| T100 | Establish Border Width Rules | `--border-w-0/1/2/4` scale. |
| T101 | Establish Radius Scale | `--radius-xs/sm/md/lg/xl/2xl/3xl/full` + `--radius` alias. |
| T103 | Establish Shadow Scale | `--shadow-xs/sm/md/lg/xl` (light: semi-transparent black; dark: stronger depth). |
| T071 | Define Canonical Reading Width | `--reading-width: 42rem` (~672px, ~66 chars). |
| T072 | Define Wide Content Width | `--wide-width: 90rem` (~1440px). |
| T073 | Define Standard Page Width | `--content-width: 72rem` (~1152px). |
| T075 | Separate Reading Width from Page Width | Three distinct width tokens; reading ≠ page. |
| T090 | Establish Page Edge Padding | `--page-gutter: 1rem`, responsive bumps at sm/lg/xl via `.page-container` media queries. |

### Tailwind config (tailwind.config.ts)

Extended `theme.extend` so the token scales are usable as utilities:
- `borderRadius` → `rounded-xs/sm/md/lg/xl/2xl/3xl/full` resolve to `--radius-*`.
- `borderWidth` → `border/0/2/4` resolve to `--border-w-*`.
- `spacing` → `p-*/m-*/gap-*` (0.5–24) resolve to `--space-*`.
- `maxWidth` → `max-w-reading/content/wide` resolve to width tokens.
- `boxShadow` → `shadow-xs/sm/md/lg/xl` resolve to `--shadow-*`.

### Layout primitives (components/layouts/ + components/page-container.tsx)

| Task | Title | File | API |
|------|-------|------|-----|
| T106 | Build Canonical Page Container | `components/page-container.tsx` | `wide`, `reading`, `noPadding` |
| T107 | Build Canonical Reading container | `components/layouts/reading-container.tsx` | `noPadding` |
| T108 | Build Canonical Wide Container | `components/layouts/wide-container.tsx` | `noPadding` |
| T109 | Build Canonical Section Component | `components/layouts/section.tsx` | `spacing=sm/md/lg/xl/none`, `as` |
| T110 | Build Canonical Stack Layout Primitive | `components/layouts/stack.tsx` | `gap=xs–2xl`, `align` |
| T111 | Build Canonical Inline Layout Primitive | `components/layouts/cluster.tsx` | `gap`, `justify`, `align` |
| T112 | Build Canonical Grid Primitive | `components/layouts/grid.tsx` | `cols=1–4/auto`, `minItemWidth` |
| T113 | Build Canonical Split Layout | `components/layouts/split-layout.tsx` | `sidebarSide`, `sidebarWidth`, `gap`, `renderSidebar` |
| T114 | Build Canonical Sidebar Layout | `components/layouts/split-layout.tsx` | (same — sidebar is a SplitLayout variant) |
| T115 | Build Canonical Sticky Region Primitive | `components/layouts/sticky-region.tsx` | `top`, `maxHeight` |
| T116 | Build Canonical Full-Width Breakout | `components/layouts/full-width-breakout.tsx` | — |
| T117 | Build Canonical Responsive Visibility Utilities | `components/layouts/responsive-visibility.tsx` | `showOn=mobile/desktop/both` |

### CSS layout-primitive classes (globals.css `@layer utilities`)

`.page-container`, `.reading-container`, `.wide-container`, `.stack[-sm/md/lg/xl]`, `.cluster[-start/center/between/end]`, `.grid-auto`, `.grid-2/3/4`, `.split-layout[-sidebar-left]`, `.sticky-region`, `.full-width-breakout`, `.hidden-mobile`, `.hidden-desktop`.

## Verification

- **Tailwind compile:** `npx tailwindcss -i app/globals.css -o /tmp/tw_test.css --minify` → exit 0 (Done in 2434ms). Zero new warnings.
- **TypeScript:** `npx tsc --noEmit -p tsconfig.json` → 0 errors in any new/modified file. 8 pre-existing errors remain (all in `__tests__`/`lib`, unrelated to this batch).
- **Token-driven:** every utility resolves through a CSS variable, so a future token freeze (T320) is a single-value change.

## Notes

- Spacing/width tokens are theme-independent (identical in `:root` and `.dark`); only the shadow scale differs (dark uses stronger alpha for visible depth on dark surfaces).
- `PageContainer` now supports `wide` and `reading` props; existing call sites using the default width are unaffected.
- The `full-width-breakout` relies on the global `overflow-x: clip` (T020) to avoid horizontal scroll — already in place.
- `SplitLayout` collapses to single-column below `lg`; the sidebar reflows below main on mobile (no horizontal scroll).
