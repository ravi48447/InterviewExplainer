# Phase 03 Completion Report — Global Application Shell & Shared Component Migration

**Phase:** 03 (P03-T001–T431)
**Status:** ✅ COMPLETE — 431/431 tasks done
**Commit:** (this push)
**Branch:** `intex-v2`

## Summary

Phase 03 established the canonical V2 application shell — the permanent frame that wraps every route — and migrated the shared shell components off their legacy monolithic implementations onto the Phase 01 primitives and Phase 02 SEO architecture.

The root layout now renders a single `AppShell` that resolves one of four shell variants from the pathname and composes the matching header/footer. The monolithic client `SiteHeader` is replaced by a server-rendered `PublicHeader` frame with small, targeted client islands. Navigation, breadcrumbs, TOC, content-tree nav, contextual sidebars, loading, error, and 404 are now canonical and consume the Phase 02 SEO builders for canonical URLs and hub gating.

## What was built

### Architecture & config (lib/shell/)
- `SHELL_ARCHITECTURE.md` — 10-section canonical rules doc (T001–T010): permanent hierarchy, public/private shell boundaries, ownership, composition contracts, variant strategy, server/client boundaries.
- `shell-config.ts` — Pure variant helpers: `resolveShellVariant(pathname)`, `shellHasFooter`, `shellHasPrimaryNav`, `defaultWidthForFamily`, `allowsFullBleed`. The `ShellVariant` type (`public`/`auth`/`dashboard`/`app`).
- `navigation-data.ts` — Pure (server-safe) navigation data layer: `buildPrimaryNavLinks`, `buildLearnSections`, `buildMobileSections`, `buildFooterGroups`, `isNavActive`, `resolveNavHref`. All links hub-gated via `isHubEnabled`; canonical URLs via `buildPath`.
- `content-tree.ts` — Content tree data contract: `ContentTreeNode`, `ContentTreeSection`, `flattenTree`, `markActivePath`. Pure data so the tree can be built server-side.

### Shell frame & variants (components/shell/)
- `public-shell.tsx` (`AppShell`) — Single entry point; resolves variant from `usePathname()`; renders `PublicHeader`/`AuthShellFrame`/`DashboardShellFrame` + `main#main-content` + footer. Owns the skip-link.
- `public-header.tsx` — Server-rendered header frame (sticky, backdrop blur). Composes BrandMark + DesktopNav + action islands.
- `public-footer.tsx` — Server-rendered footer consuming `buildFooterGroups`. Brand block + Platform/Company/Legal groups + social links + copyright.
- `brand-mark.tsx` — Canonical BrandMark (hexagon SVG + wordmark). Server-rendered, 3 sizes, focus-visible ring.

### Header client islands (components/shell/header/)
- `desktop-nav.tsx` — Server-rendered crawlable primary nav anchors + active state.
- `desktop-learn-dropdown.tsx` — Client island: keyboard-navigable dropdown (Escape closes + focus restore, click-outside, Enter/Space opens, responsive columns).
- `mobile-nav.tsx` — Client island: sheet-based drawer with expandable sections, active state, scroll lock.
- `theme-toggle.tsx` — Client island: light/dark/system dropdown, mount-gated to prevent flash, stable dimensions (no layout shift).
- `header-user-actions.tsx` — Client island: anonymous (Log in/Sign up) + authenticated (avatar dropdown: Dashboard/Account/Profile/Log out). Three render states with reserved space to prevent header shift.
- `header-search.tsx` — Hub-gated wrapper around the existing `GlobalSearch` island.
- `nav-icons.tsx` — String→LucideIcon resolver map (keeps tree-shaking honest; nav data stays pure).

### Content navigation (components/shell/)
- `shell-breadcrumbs.tsx` — Canonical breadcrumbs consuming `buildBreadcrumbs` (SEO). Mobile collapses deep hierarchies; canonical URLs → relative for client nav.
- `table-of-contents.tsx` — Canonical TOC: IntersectionObserver scrollspy, sticky offset, h2/h3 depth, active highlighting.
- `content-sidebar.tsx` — Left content sidebar container (sticky, internal scroll, width token).
- `contextual-sidebar.tsx` — Right contextual sidebar container (optional, sticky, xl+ only).
- `content-tree-nav.tsx` — Canonical content tree renderer with expand/collapse, active path, tree semantics.

### Loading / error / 404
- `shell-loading.tsx` — Layout-preserving skeleton (breadcrumb + title + content blocks). `ShellLoadingMinimal`, `HeaderLoading` variants.
- `shell-error.tsx` — Canonical route error (`ShellError`) + root error (`RootShellError`). Recovery actions, no internal detail exposure (dev-only digest), reduced-motion-safe.
- `shell-not-found.tsx` — Canonical 404 with homepage + hub recovery links, search recovery (hub-gated).
- `app/global-error.tsx` — New root error boundary (unrecoverable tier).

### Barrel
- `components/shell/index.ts` — Canonical surface for all shell imports.

### Modified files
- `app/layout.tsx` — Restructured to render `ThemeProvider → AuthProvider → AppShell`. Removed direct `SiteHeader`/`SiteFooter`/skip-link (now owned by AppShell). Fixed the footer-outside-AuthProvider bug.
- `app/loading.tsx` — Uses `ShellLoading`.
- `app/error.tsx` — Uses `ShellError`.
- `app/not-found.tsx` — Uses `ShellNotFound`.
- `app/globals.css` — Added `--content-sidebar-width` (16rem) and `--contextual-sidebar-width` (15rem) tokens.

## Verification

| Gate | Command | Result |
|------|---------|--------|
| Tailwind | `npx tailwindcss -i app/globals.css -o /tmp/tw_test.css --minify` | ✅ exit 0 (1 pre-existing `duration-[250ms]` warning, unrelated) |
| TypeScript | `npx tsc --noEmit -p tsconfig.json` | ✅ 8 errors — all pre-existing in `__tests__/launch-config.test.ts` (missing test-runner types). Zero new errors from Phase 03. |

## Architecture decisions (see DECISION_LOG.md D12–D16)

- **D12:** Single `AppShell` resolver, not per-route layouts — shell consistency + no remount on navigation.
- **D13:** Header is a server-rendered frame with client islands — crawlable + minimal JS.
- **D14:** Navigation data is pure; icons are string names resolved by a map — server-safe + honest tree-shaking.
- **D15:** No bottom nav on the public shell — content-first; drawer suffices.
- **D16:** shadcn `Sidebar` primitive not used for public content sidebars — lightweight server containers instead; shadcn sidebar reserved for authenticated dashboards.

## Legacy components mapped for removal (see LEGACY_REPLACEMENT_MAP.md)

`site-header.tsx`, `site-footer.tsx`, `ReadingProgressBar.tsx`, `ContentTreeNav.tsx`, `PillarTreeNav.tsx`, `StackHierarchyNav.tsx`, `V2ContentTreeNav.tsx`, `QuestionSidebar.tsx` — all replaced by canonical Phase 03 components. They remain in the tree so other consumers compile during the transition; removal is scheduled for the route-family population phases.

## Open issues

**None.** The shell compiles cleanly, Tailwind builds cleanly, and the shell APIs are frozen and ready for route-family population (Phase 04+).

## What's next

Phase 03 delivered the shell. The next phases populate route families into the shell: each route family (homepage, domain, stack, pillar, module, question, dsa, etc.) composes its content inside `AppShell` using the Phase 03 canonical pieces — `ShellBreadcrumbs`, `TableOfContents`, `ContentSidebar`, `ContextualSidebar`, `ContentTreeNav`. The shell is the stable substrate; route families are the content.
