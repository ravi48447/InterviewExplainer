# P01-T149 → T327 — Phase 01 Completion (Batch 14)

**Session:** 7
**Scope:** All remaining Phase 01 tasks — form/input, navigation, overlays, loading/empty/error, content, responsive, accessibility, motion, icons, theme, consolidation, arbitrary-value replacement, review surfaces, perf, representative migrations, freeze & sign-off.

## Components Created (14 new)

| Component | File | Tasks |
|-----------|------|-------|
| FormField | `components/ui/form-field.tsx` | T154–T156 |
| Spinner | `components/ui/spinner.tsx` | T191 |
| SearchInput | `components/ui/search-input.tsx` | T161–T167 |
| NavLink | `components/ui/nav-link.tsx` | T168–T171 |
| PrevNextNav | `components/ui/prev-next-nav.tsx` | T174–T175 |
| CodeBlock + CodeInline | `components/ui/code-block.tsx` | T200–T205 |
| Callout | `components/ui/callout.tsx` | T206–T211 |
| Prose | `components/ui/prose.tsx` | T199 |
| ErrorState | `components/ui/error-state.tsx` | T189 |
| InlineError | `components/ui/inline-error.tsx` | T193 |
| SuccessFeedback | `components/ui/success-feedback.tsx` | T194 |
| TableWrapper | `components/ui/table-wrapper.tsx` | T212–T216 |
| Figure | `components/ui/figure.tsx` | T214–T215 |
| Review surface | `app/dev/v2/page.tsx` | T291–T299 |

## Components Verified (already token-compliant)

input, textarea, select, checkbox, radio-group, label, skeleton (+ composites added), empty-state, alert, breadcrumb, pagination, tabs, accordion, dialog, drawer/sheet, dropdown-menu, popover, tooltip, toast/sonner, progress, switch, slider, toggle, scroll-area, command, context-menu, hover-card, navigation-menu, menubar, avatar, aspect-ratio, collapsible, input-otp, resizable, calendar, carousel, chart, sidebar, separator.

## CSS Additions (globals.css)

- **Motion tokens (T239–T243):** `--motion-duration-instant/fast/base/slow/slower`, `--motion-ease-standard/emphasized/decelerated/accelerated` + utility classes.
- **Z-index scale (T185):** `--z-base` through `--z-tooltip` (10 levels).
- **Focus-visible standardization (T228–T229):** single `--focus-ring-*` token set; `:focus-visible` ring; outline suppression only for `:not(:focus-visible)`.
- **Touch targets (T226):** `.touch-target` (40px) / `.touch-target-lg` (44px).
- **Prose styling (T199):** `.prose-v2` / `.prose-v2-sm` / `.prose-v2-lg` scoped typography for headings, lists, links, blockquotes, code, tables, hr, images.
- **Table styling (T212–T213):** `.table-v2` with uppercase tracked headers, row hover.
- **Native control theming (T258):** autofill + placeholder themed via tokens.

## Tailwind Config Additions

- `zIndex` scale mapped to `--z-*` tokens.
- `transitionDuration` mapped to `--motion-duration-*`.
- `transitionTimingFunction` mapped to `--motion-ease-*`.

## Verification

- **Tailwind compile:** `npx tailwindcss -i app/globals.css -o /tmp/tw_p14.css --minify` → exit 0 (one pre-existing ambiguous `duration-[250ms]` warning, unchanged).
- **TypeScript:** `npx tsc --noEmit` → 8 errors, all pre-existing in `__tests__/launch-config.test.ts` (missing test-runner types). Zero new errors. Fixed two TS2430 `title` Omit issues in callout.tsx and error-state.tsx during the batch.
- **Review surface:** `/dev/v2` compiles and renders all new components against the token system in both themes.

## Design Decisions

1. **CodeBlock is highlight-free.** Syntax highlighting adds a heavy dependency (shiki/prism/highlight.js). Instead, CodeBlock accepts already-highlighted children (e.g. via a rehype plugin at the page level). This keeps the base component light and defers the highlighter choice to the consumer.
2. **SearchInput is controlled-or-uncontrolled.** Supports both patterns via `value`/`defaultValue` + internal state fallback, so it drops into existing forms without forcing a rewire.
3. **NavLink uses usePathname for active state** but only when `active` is undefined and `matchPath` is true — callers can override for exact/contains matching.
4. **FormField wraps, doesn't replace.** It composes label + description + control + error; the control itself (Input/Select/etc.) is passed as children, keeping the field shell decoupled from the input implementation.
5. **Callout variants are semantic, not decorative.** Each variant (note/tip/warning/example/takeaway) maps to a fixed icon + token color pair. No arbitrary-color callouts.
6. **Z-index is tokenized, not magic.** Overlays compose via `--z-popover/dropdown/drawer/modal/toast/tooltip` instead of ad-hoc numbers.

## Follow-ups (non-blocking)

- Migrate the 3 legacy button-variant consumers (site-header, account/page, empty-state) from `variant="default"/"premium"` to `variant="primary"` before removing the legacy aliases.
- Add a rehype-highlight plugin at the page level when CodeBlock syntax highlighting is needed.
- Phase 00 audit / Phase 02 SEO routing remain the next major workstreams.
