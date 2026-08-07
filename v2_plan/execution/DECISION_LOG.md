# Phase 01 Decision Log (P01-T324)

Records the significant design/engineering decisions made during Phase 01, with rationale.

## D1 — Token system uses `hsl(var(--token))` + alpha modifiers

**Decision:** All colors are HSL channel triplets stored as CSS variables, consumed via `hsl(var(--token))` or `hsl(var(--token) / alpha)`.

**Why:** HSL with separate alpha composition lets every color derive translucent variants (hover states, tints, overlays) without a separate token per opacity. Matches the shadcn convention so the existing 50+ Radix components keep working.

**Trade-off:** Slightly more verbose than `oklch`. Accepted for ecosystem compatibility.

## D2 — Layout primitives are CSS classes + React wrappers

**Decision:** Layout primitives (stack, cluster, grid, split-layout, etc.) are defined as CSS utility classes in `globals.css` and exposed as thin React components that apply the class.

**Why:** Single source of truth — the CSS class is canonical; the component is ergonomic sugar. Call sites that can't use the component (e.g. raw HTML in markdown) still get the class. Avoids duplicating layout logic in JS and CSS.

## D3 — Button keeps legacy variant aliases

**Decision:** `variant="default"`, `"accent"`, `"success"`, `"premium"`, `"shadow"` are retained as aliases mapping to `primary`.

**Why:** Three consumers (site-header, account/page, empty-state) use legacy variants. Removing them would break compilation and force a coupled migration. Aliases keep the build green; migration is a follow-up.

**Trade-off:** Slightly larger variant surface. Accepted for decoupled rollout.

## D4 — Badge and Tag are separate components

**Decision:** `Badge` (status: success/warning/destructive/info + difficulty) is separate from `Tag` (neutral content labels: java, react).

**Why:** Conflating them led to color proliferation (every content category got a colored badge). Separating them constrains color to genuine status semantics.

## D5 — CodeBlock is syntax-highlight-free

**Decision:** `CodeBlock` does not bundle a highlighter. It renders children as-is inside a styled shell with copy + overflow.

**Why:** Highlighters (shiki ~1MB, prism, highlight.js) are heavy and theme-coupled. The base component should be light; highlighting is a page-level concern applied via rehype/MDX plugins when needed.

**Trade-off:** Consumers must wire highlighting separately. Accepted; documented in the component.

## D6 — Z-index is a token scale, not magic numbers

**Decision:** `--z-base` through `--z-tooltip` (10 named levels) replace ad-hoc `z-50`/`z-[100]`.

**Why:** Overlays compose in a known stacking order. Magic numbers drift and conflict. Named tokens make the layering contract explicit and auditable.

## D7 — Focus-visible uses a single ring token

**Decision:** One `--focus-ring-*` token set drives `:focus-visible` globally. Per-component outline hacks removed.

**Why:** Consistent, high-contrast focus indication is an accessibility requirement (WCAG 2.4.7). A single source prevents the ring from drifting per component.

## D8 — Motion is tokenized and reduced-motion-safe

**Decision:** Durations (`--motion-duration-*`) and easings (`--motion-ease-*`) are tokens. The existing `prefers-reduced-motion` rule zeroes all durations centrally.

**Why:** Motion should be consistent and overridable in one place. No `transition-all`; no scale-on-hover. Restrained motion is a V2 principle.

## D9 — Review surface at /dev/v2, dev-only

**Decision:** All new components are exercised on `/dev/v2`, which is not linked from public navigation.

**Why:** Visual QA, contrast checks, and regression spotting need a single page that renders every variant. Dev-only keeps it out of the production sitemap and user flow.

## D10 — Existing token-compliant components are verified, not rebuilt

**Decision:** Components already using the token system (input, textarea, select, checkbox, radio-group, label, breadcrumb, pagination, tabs, accordion, dialog, drawer, popover, tooltip, etc.) were verified for compliance rather than rewritten.

**Why:** Rewriting working, compliant code adds risk without value. The task spec calls for standardization; if the component already meets the standard, verification satisfies it.

## D11 — Phase 01 tokens and component APIs are frozen

**Decision:** As of T320–T321, the Phase 01 token substrate (color/radius/spacing/shadow/width/z/motion) and component APIs (Batch 13 + 14) are frozen.

**Why:** Downstream phases (02+) and route migrations depend on a stable contract. Freezing prevents churn during migration. Changes now require a documented decision-log entry.
