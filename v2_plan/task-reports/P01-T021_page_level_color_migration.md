# Task Report — P01-T021 + Workstream D/E Foundations (Batch 3)

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Workstream:** C (Semantic Color — page-level), D/E (theme application foundations)
**Status:** Implemented (not yet validated against a running build)

## Objective

Remove arbitrary page-level color decisions (hard-coded hex in `app/` pages) and migrate them to the semantic token system. Fix a duplicate-token bug introduced in Batch 2. Align the `hljs` code-block surface and browser `themeColor` meta with the real V2 theme values.

## Bug Fix

- **`app/globals.css` `:root`** — the `--code-*` block was duplicated (appeared twice) due to an edit merge error in Batch 2. Removed the duplicate. `--code-bg` now correctly appears exactly twice (once `:root`, once `.dark`).

## Files Changed (app/ page-level migration — P01-T021)

**DSA hub pages (4 files, shared pattern):**
- `app/dsa/page.tsx` — `from-[#eef0f4] to-[#f4f5f7]` → `from-surface-subtle to-background`; `bg-[#0f1014]` hero → `bg-hero` (2 occurrences)
- `app/dsa/basic-100/page.tsx` — same page gradient + hero migration
- `app/dsa/module/[slug]/page.tsx` — same page gradient + hero migration
- `app/dsa/sheet/[slug]/page.tsx` — page gradient + hero + bottom-fade gradient + CTA card (`bg-[#0f1014] hover:bg-[#15161c]` → `bg-hero hover:bg-hero-elevated`)

**Interview pages (4 files):**
- `app/interview/page.tsx` — `LEVEL_META` colors `#10b981/#f59e0b/#ef4444` → `hsl(var(--difficulty-easy/medium/hard))`; `colorClass` emerald/amber/red arbitrary classes → `bg-success/10` etc.; `bg-[#f8f9fa]` → `bg-surface-subtle`; `text-[#2e64e5]` → `text-primary`; `border-slate-100 dark:border-slate-800/60` → `border-border`
- `app/interview/[lang]/[track]/[level]/page.tsx` — same `LEVEL_META` + `difficultyColor()` migration; `#2e64e5` → `primary` (5 occurrences); `#f8f9fa` → `surface-subtle` (2)
- `app/interview/[lang]/[track]/[level]/[stack]/page.tsx` — same `difficultyColor()` + `LEVEL_META` migration; `#2e64e5` → `primary` (3)
- `app/dev/speakable-primitives/page.tsx` — `#101113`/`#ffffff` → `hsl(var(--surface))`

**Auth pages (2 files):**
- `app/signup/page.tsx` — gradient `from-[#2563EB] to-[#7C3AED]` → `from-primary to-primary`; rgba shadows → `hsl(var(--primary)/…)`; `bg-[#0A0A0A]` → `bg-background` (2)
- `app/login/page.tsx` — same gradient migration; `from-slate-50 to-slate-200/80 dark:to-[#0A0A0A]/80` → `from-surface-subtle to-muted dark:to-background/80`

**Mock interview pages (3 files):**
- `app/mock-interviews/page.tsx` — hero `bg-[#0f1014]` → `bg-hero`
- `app/mock-interviews/history/page.tsx` — recharts `#3b82f6` → `hsl(var(--primary))`; `#e2e8f0` grid → `hsl(var(--border))`; `#64748b` axes → `hsl(var(--muted-foreground))`; tooltip `#fff`/`#e2e8f0` → `hsl(var(--popover))`/`hsl(var(--border))`
- `app/mock-interviews/results/page.tsx` — recharts radar `#3b82f6` → `hsl(var(--primary))`; `#e2e8f0` grid → `hsl(var(--border))`

**Domains page (1 file):**
- `app/domains/page.tsx` — `trackColor` map of 14 decorative hexes → `hsl(var(--chart-1..5))` categorical palette (indigo/green/amber/violet/rose, mapped by track family); fallback `#64748b` → `hsl(var(--muted-foreground))`

**Layout + globals (2 files):**
- `app/layout.tsx` — `themeColor` meta values aligned to real theme: `#f5f7fa`→`#f7f8fa` (light, matches `--background 220 14% 98%`), `#000000`→`#0f1117` (dark, matches `--background 226 21% 7%`)
- `app/globals.css` — `hljs` code block: `#1e1e2e`/`#d6deeb` → `hsl(var(--code-bg))`/`hsl(var(--code-text))`; `.dark pre code.hljs` now uses the same `--code-*` surface (consistent always-dark code)

## Documented Exceptions (hex retained intentionally)

1. **`app/[domainSlug]/[stackSlug]/[questionSlug]/opengraph-image.tsx`** — rendered by Next.js `ImageResponse` (SVG/PNG raster, no CSS variables available). Inline hex is required.
2. **`app/api/newsletter/route.ts`** — HTML email body. Email clients strip CSS variables; inline hex is the only reliable option.
3. **`app/dsa/problem/[slug]/page.tsx`** — LeetCode brand orange (`#ffa116`). External-link brand color, analogous to the Codeforces/CodeChef brand orange in `tech-icon.tsx`.
4. **`app/layout.tsx` `themeColor`** — browser-chrome meta requires a literal hex.
5. **`app/globals.css` hljs syntax tokens** — the highlighter's syntax palette (keyword purple, string green, etc.). These are *content syntax colors*, not UI chrome.
6. **`components/tech-icon.tsx`, `components/landing/hero-section.tsx`** — Codeforces/CodeChef brand orange and macOS traffic-light dots (carried from Batch 2).

## Validation Performed

- Grep confirms **0 non-exception hex** remain in `app/` page files. The only hex matches are the 6 documented exceptions above + CSS comments in `globals.css` that record the HSL→hex reference.
- Grep confirms **0 arbitrary `bg-[#hex]`/`text-[#hex]`/`border-[#hex]` Tailwind classes** in `components/` + `modules/` (only the 2 brand-icon exceptions).
- `tailwind.config.ts` brace/paren/bracket balance: 52/52, 147/147, 5/5.
- `globals.css`: duplicate `--code-*` block removed; `--code-bg` count = 2 (correct: `:root` + `.dark`).
- `app/interview/page.tsx` `border-slate-100 dark:border-slate-800/60` (Tailwind palette leak) also caught and replaced with `border-border` during this pass.

## Decisions

- **DEC:** `trackColor` in `domains/page.tsx` migrated to the 5-token `--chart-*` palette rather than left as unique per-domain hexes. The V1 design used 14 near-duplicate decorative colors; the V2 approach collapses them into 5 categorical hues mapped by track family (frontend/backend/cloud → indigo; cicd/infra/sre → green; data/sql/python → amber; fullstack/viz → violet; ml-ai/analysis → rose). This loses per-domain distinctiveness but gains theme-awareness and brand consistency. Trade-off documented; reversible by expanding `--chart-*` if more distinction is needed later.
- **DEC:** Auth-page gradient `from-[#2563EB] to-[#7C3AED]` (indigo→violet) simplified to `from-primary to-primary`. The V2 system uses a single accent; the two-stop gradient was decorative. The `hover:from-primary/90` preserves a subtle hover shift.
- **DEC:** `difficultyColor()` helpers now return `hsl(var(--difficulty-*))` strings. These are consumed by inline `style={{color}}` and `backgroundColor` — CSS variables resolve correctly in inline styles.

## Validation Results

Static checks pass. **No running build** in this environment — compile/visual validation still pending (same caveat as Batches 1–2).

## Remaining Risks

- **Unverified compile.** The new Tailwind classes (`bg-hero`, `bg-surface-subtle`, `bg-success/10`, `text-primary`, `from-primary`, `hsl(var(--primary)/0.39)` shadow) depend on the Tailwind config + PostCSS pipeline. A real `next build` is required to confirm all utilities generate.
- **recharts + CSS variables.** `hsl(var(--primary))` passed to recharts `stroke`/`fill`/`stopColor`: these become SVG attribute values. Resolution depends on the chart rendering in a DOM context where `:root` vars exist. Should work (recharts renders into the page DOM), but unverified at runtime.
- **`trackColor` categorical collapse** is a visible change on `/domains` — 14 distinct colors → 5. Confirm this is acceptable; it's intentional per §10 single-accent, but it's a design decision worth a visual check.

## Recommended Next Tasks

- **P01-T035** (contrast validation) — still needs a running build; defer to user.
- **Workstream D (P01-T036–T044)** — light theme application. Much of the structural work is now done via these migrations; the remaining D tasks are about *refining* the light token values (e.g., T043 "remove pure-white surface overuse" — `--surface` is currently `0 0% 100%`, may need softening).
- **Workstream E (P01-T045–T053)** — dark theme refinement (T052 "remove near-black layer proliferation" — `--background` is `226 21% 7%` (#0F1117), already not pure black; review for near-black stacking).

## Commit

N/A — local working copy; user will zip and download.
