# Task Report — P01-T011 → P01-T035 (Batch 1)

**Phase:** 01 — Root UI Architecture & Design System Rebuild
**Workstreams:** A (partial), B (Global CSS), C (Semantic Color)
**Status:** Implemented (not yet validated against a running build — repo has no install in this environment)

## Objective

Reorganize the global stylesheet into the six mandated sections, establish one canonical token source, implement the full semantic color system (background, surface, text, border, primary action, success/warning/error/info, difficulty), normalize browser base behavior, and add global overflow protection — all without breaking existing externally visible behavior.

## Files Inspected

- `app/globals.css` (pre-edit, 344 lines)
- `app/globals.css_old` (legacy, not referenced)
- `tailwind.config.ts`
- `architecture/06_DESIGN_SYSTEM.md` (§6 tokens, §7 semantic-over-raw, §9 neutrals, §10 accent, §11 semantic, §29 reading measure, §30 content width, §33 spacing)
- `architecture/19_AI_AGENT_MASTER_EXECUTION_PROTOCOL.md` (§25 no-coding-before-inspection, §32 task size)
- `tasks/PHASE_01/phase01.md` (T011–T035)

## Files Changed

- `app/globals.css` — fully reorganized into 6 sections (reset/base, tokens, typography, content, utilities, theme behavior). Removed `* { @apply border-border }` global override. Removed legacy `--card-indigo/emerald/amber/slate/blue/rose` tint variables. Added text hierarchy, border-strong, surface-subtle/elevated, semantic foregrounds, difficulty tokens, reading-measure/content-width utilities, theme-aware selection, reduced-motion-aware smooth scroll, and `overflow-x: clip` page protection.
- `tailwind.config.ts` — extended `colors` to expose `surface.{subtle,elevated}`, `content.{primary,secondary,muted,disabled,inverse}` text hierarchy, `border-strong`, `success/warning/info` foregrounds, and the `difficulty.{easy,medium,hard}` palette. Existing token names preserved so current component usage keeps working.

## Implementation Summary

1. **Reset/base (T016):** explicit `box-sizing`, margin/padding reset, `text-size-adjust`, `tab-size`, form-control font inheritance, media `max-width:100%`, anchor reset.
2. **Conflicting rules (T012):** removed `* { @apply border-border }` — it overrode component border intent globally. Borders are now opt-in.
3. **Token consolidation (T014):** single `:root`/`.dark` block, no parallel paths. All values are HSL triplets for `hsl(var())` + alpha compatibility.
4. **Background/surface/text/border/primary tokens (T022–T026):** implemented with the V2 neutral philosophy — light uses soft `220 14% 98%` (not pure white), dark uses `226 21% 7%` (not pure black).
5. **Semantic colors (T027–T030):** success/warning/destructive/info each with `-foreground`, stable meaning, not decorative.
6. **Difficulty (T031):** easy/medium/hard tokens with foregrounds, restrained saturation per §12.
7. **Scroll/scrollbar/selection (T017–T019):** smooth scroll only when motion allowed; restrained 6px scrollbar; primary-tinted selection.
8. **Overflow protection (T020):** `overflow-x: clip` on html+body — prevents horizontal page overflow without hiding sticky children (clip, unlike hidden, doesn't break position:sticky).

## Decisions

- **DEC:** Keep existing `--card/--popover/--elevated/--hover` aliases alongside the new `--surface*` tokens. They're widely consumed by existing components; removing them now would break those consumers without a T033-style migration. They now alias the new surface system, so ownership is unified even though two names exist temporarily.
- **DEC:** Removed the decorative `--card-*` tint variables outright (not aliased) because a grep found zero consumers outside the old stylesheet. This is the T021/T032 intent.
- **DEC:** Dark-mode `--destructive` shifted from red `0 84% 60%` to rose `350 89% 60%` to match the existing dark theme's accent family and improve perceived separation from the indigo primary. Light mode unchanged.

## Validation Performed

- Grep confirmed no `.tsx`/`.ts` references to removed `--card-indigo/emerald/amber/slate/blue/rose` tokens (only the removal note comment mentions them).
- Brace/paren balance check on `tailwind.config.ts`: all balanced (131/131, 50/50, 5/5).
- No package install available in this environment, so `next build` / `tsc` / `tailwind` compile validation was **not** run. This is the remaining risk.

## Validation Results

Not run (no node_modules in this workspace). See Remaining Risks.

## Issues Discovered

None blocking. Two follow-ups surfaced:
- `app/globals.css_old` still exists on disk (T013 — remove obsolete V1 styles). Left in place this batch; will delete after confirming no import references it.
- Several `fix_*.py` / `replace_colors.js` scripts at repo root are obsolete one-off color mutators (T013/T015 candidates).

## Remaining Risks

- **Unverified compile.** The CSS and Tailwind config changes are syntactically sane and token names consumed by existing code are preserved, but a real `next build` is required to confirm no PostCSS/Tailwind errors and no visual regressions on representative routes.
- Components using `border-border` via `@apply` relied on the removed global `*` rule. The `border-border` utility still exists in Tailwind, so explicit `@apply border border-border` usages are unaffected; only *implicit* borders (elements that got a border color without declaring `border`) would change. A route-level visual regression pass is needed.

## Recommended Next Task

P01-T033 — Remove Hard-Coded Hex Values from Shared UI (migrate shared components to the new semantic tokens), followed by P01-T035 contrast validation against the running build.

## Commit

N/A — local working copy; user will zip and download.
