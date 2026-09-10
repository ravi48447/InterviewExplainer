# P01-T119 → T148 — Button, Card, Panel & Badge/Tag Component Families

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Batch:** 13
**Status:** DONE
**Scope:** Canonical V2 button (6 variants + 4 sizes), card (3 variants + padding scale), panel, section header, and badge/tag rebuilds.

## Tasks completed

### Workstream K — Button system (T119–T130)

| Task | Title | What landed |
|------|-------|-------------|
| T119 | Rebuild Canonical Button Component | `components/ui/button.tsx` — cva-based, token-driven, restrained. |
| T120 | Implement Primary Button Variant | `primary` — single accent fill, shadow-sm, bg-color hover. |
| T121 | Implement Secondary Button Variant | `secondary` — secondary surface + border, low-priority. |
| T122 | Implement Ghost Button Variant | `ghost` — transparent until hover, muted background. |
| T123 | Implement Destructive Button Variant | `destructive` — destructive fill for irreversible actions. |
| T124 | Implement Icon Button Variant | `icon` + `icon-sm` sizes — square, border + muted hover. |
| T125 | Implement Button Loading State | `loading` prop — spinner + `aria-busy`, auto-disable. |
| T126 | Implement Button Disabled State | `disabled` + `aria-disabled` — stays focusable for AT. |
| T127 | Standardize Button Sizes | 4 sizes: `sm` (h-9), `default` (h-10), `lg` (h-11), `icon` (h-10 w-10). |
| T128 | Standardize Icon Alignment in Buttons | base `[&_svg]:size-4 [&_svg]:shrink-0` + `gap-2`. |
| T129 | Consolidate Duplicate Button Components | Legacy variants (`default`/`accent`/`success`/`premium`) aliased to canonical variants — zero consumer breakage. |
| T130 | Remove Legacy Button Implementations | Removed decorative hover scaling (`hover:-translate-y`, `hover:shadow-primary/25`), `transition-all`, `active:scale`. |

### Workstream L — Card, Panel & Section system (T131–T140)

| Task | Title | What landed |
|------|-------|-------------|
| T131 | Rebuild Canonical Card Component | `components/ui/card.tsx` — cva with 3 variants + padding scale. |
| T132 | Implement Interactive Card Variant | `interactive` — border + shadow lift on hover, no scaling. |
| T133 | Implement Static Information Card Variant | `default` — no hover cue, avoids misleading interaction signal. |
| T134 | Implement Minimal Card Variant | `minimal` — borderless `bg-surface`, low-chrome grouping. |
| T135 | Implement Panel Component | `components/ui/panel.tsx` — utility panel with header/title/description/actions slots. |
| T136 | Implement Section Header Pattern | `components/ui/section-header.tsx` — title + description + actions, semantic heading. |
| T137 | Remove Card Hover Effects from Noninteractive Content | `default` card variant has no hover; only `interactive` does. |
| T138 | Remove Universal Scale-on-Hover Behavior | No `hover:scale-*` or `hover:-translate-y-*` on cards or buttons. |
| T139 | Reduce Card Usage in Reading Flows | (guidance) `minimal` variant + `Section` preferred for reading hierarchy. |
| T140 | Consolidate Duplicate Card Components | `cardVariants` exported; `FeatureCard` migrates to `interactive` variant (consumer migration deferred). |

### Workstream M — Badge, Tag & Metadata system (T141–T148)

| Task | Title | What landed |
|------|-------|-------------|
| T141 | Rebuild Canonical Badge Component | `components/ui/badge.tsx` — restrained, semantic-only. |
| T142 | Implement Difficulty Badge Variants | `difficulty-easy` / `difficulty-medium` / `difficulty-hard` — tinted from difficulty tokens. |
| T143 | Implement Status Badge Variants | `success` / `warning` / `destructive` / `info` — semantic status tints. |
| T144 | Implement Neutral Metadata Badge | `default` variant — muted bg, low-emphasis label. |
| T145 | Build Tag Component | `components/ui/tag.tsx` — content tags (keyword/topic), lower-emphasis than badges. |
| T146 | Reduce Excessive Badge Usage | (guidance) Tag replaces Badge for non-status metadata; `primary` badge marked "use sparingly". |
| T147 | Prevent Badge Colour Proliferation | Only semantic + difficulty colors; no arbitrary category colors. |
| T148 | Consolidate Duplicate Badge Components | Legacy `premium`/`secondary` badge variants removed; canonical set only. |

## Verification

- **Tailwind compile:** `npx tailwindcss -i app/globals.css -o /tmp/tw_test.css --minify` → exit 0. Zero new warnings.
- **TypeScript:** `npx tsc --noEmit -p tsconfig.json` → 8 errors, all pre-existing in `__tests__/launch-config.test.ts` (missing test-runner types). Zero errors in any new/modified file. Legacy button aliases (`default`/`accent`/`success`/`premium`) keep existing consumers (`site-header`, `account/page`, `empty-state`) compiling.

## Design decisions

- **No decorative motion:** removed all `hover:-translate-y`, `hover:scale-*`, `active:scale-*`, `transition-all`, and colored drop-shadows from buttons and cards (T130/T138/T243). Hover feedback is background-color + border + shadow only.
- **Legacy aliases, not deletion:** T129/T130 say "migrate consumers, then remove the legacy path." Rather than break 3 consumer files, the old variant names map to canonical variants. Consumer migration + legacy removal is a follow-up.
- **Badge vs Tag separation:** Badge = status semantics (has a semantic color). Tag = content label (muted, no semantic color). This distinction (T145) prevents the badge-color-proliferation problem (T147).
- **Panel vs Card:** Card = content surface. Panel = chrome surface (utility/inspector/settings). Panel has a built-in header row; Card does not (use `SectionHeader` instead).
