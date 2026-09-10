# Global Shell Architecture — Phase 03 Canonical Rules

> Encoding for P03-T001 … T010. This is the single source of truth for the
> global application shell hierarchy. Later route-family phases (04+) must
> consume these contracts, not re-derive their own shell.

## 1. Permanent Hierarchy (P03-T001)

```
ROOT LAYOUT (app/layout.tsx)
        ↓  — genuinely global only: <html>, fonts, theme, metadata, providers
GLOBAL PROVIDERS
        ↓  — ThemeProvider → AuthProvider (outer→inner, explicit deps)
PUBLIC / PRIVATE LAYOUT BOUNDARY
        ↓  — classifyRoute(pathname) picks the shell variant
GLOBAL SHELL (PublicShell | AuthShell | DashboardShell)
        ↓  — owns Header + Footer + main landmark + slot composition
HEADER + NAVIGATION
        ↓  — one canonical header (server shell, client islands)
PAGE-SPECIFIC LAYOUT (route-family layouts)
        ↓  — width tier, sidebars, breadcrumbs — opt-in slots
PAGE CONTENT
        ↓  — the interview-prep content; the product
CONTEXTUAL NAVIGATION
        ↓  — TOC / related / prev-next — opt-in
FOOTER
```

**Core principle:** THE USER CAME FOR THE CONTENT. The shell exists to help
them find it, understand where they are, move through it, and return to it.
The shell is **not** the product and must not compete with the content.

## 2. Public / Private Shell Boundaries (P03-T002)

| Surface            | Shell variant      | Routes (prefix)                          | Visibility |
|--------------------|--------------------|-------------------------------------------|------------|
| Public SEO pages   | `PublicShell`      | `/`, `/domains`, `/dsa`, `/prep`, …      | `public`   |
| Authentication     | `AuthShell`        | `/login`, `/signup`, `/forgot-password`… | `private`  |
| Dashboard / app    | `DashboardShell`   | `/dashboard`, `/account`, `/profile`     | `private`  |
| Future interview app | `AppShell` (reserved) | `/interview/*` practice surfaces      | `private`  |

Classification uses `classifyRoute(pathname)` from `lib/seo/route-registry`.
Unknown paths fall back to the public shell so deep-linkable content stays
crawlable.

## 3. Shell Ownership Responsibilities (P03-T003)

| Element      | Owned by            | Notes                                                    |
|--------------|---------------------|----------------------------------------------------------|
| `<html>`/fonts/metadata | Root layout | Never in a shell variant.                       |
| Theme provider | Root layout       | One provider, system default, no flash.                  |
| Header       | Shell variant       | `PublicHeader` / `DashboardHeader` — shared brand island. |
| Footer       | Shell variant       | `PublicFooter` only; auth/dashboard omit it.            |
| Primary nav  | Header              | Desktop + mobile drawers are header-owned.               |
| Breadcrumbs  | Page (via slot)     | Generated from `buildBreadcrumbs`; placed by the page.  |
| Left sidebar | Page (via slot)     | Content tree / app nav — opt-in, not forced.            |
| Right sidebar| Page (via slot)     | Contextual info / TOC — opt-in, not mandatory.         |
| Theme toggle | Header action island | Client island; one placement only.                    |
| Search entry | Header action island | Desktop input + mobile icon trigger; modal is client.  |
| User actions | Header action island | Anonymous: Log in / Sign up; Authed: avatar menu.      |

## 4. Prevent Route Pages from Rebuilding Shell (P03-T004)

Pages MUST consume the shell. A page file renders **only**:
- `content` (required) — the page body.
- `breadcrumbs` (optional) — when the page opts into breadcrumbs.
- `leftSidebar` / `rightSidebar` (optional) — when the page needs sidebars.
- `containerWidth` (optional) — `'default' | 'wide' | 'reading' | 'full'`.

Pages MUST NOT render their own `<header>`, `<footer>`, top-level `<nav>`,
skip-link, or another `<main>` landmark. The shell owns those.

## 5. Nested Layout Strategy (P03-T005)

- Root layout: providers + `<html>` + fonts + metadata only.
- Shell layout (public): header + main + footer. This is the *only* layer
  that renders the global header/footer.
- Route-family layouts (04+): may wrap children with width containers,
  sidebars, or breadcrumbs — never header/footer.
- Avoid nesting a shell inside a shell. One shell per route tree.

## 6. Supported Composition Contracts (P03-T006)

```
<PublicShell>                      // header + main + footer
  <PublicShell.Content>            // → children (default slot)
    <PageContainer wide>…</PageContainer>
  </PublicShell.Content>
  <PublicShell.Breadcrumbs>…</PublicShell.Breadcrumbs>   // optional slot
  <PublicShell.LeftSidebar>…</PublicShell.LeftSidebar>  // optional slot
  <PublicShell.RightSidebar>…</PublicShell.RightSidebar>// optional slot
</PublicShell>
```

Equivalent prop-based API on the `PublicShell` component:
`children`, `breadcrumbs?`, `leftSidebar?`, `rightSidebar?`, `containerWidth?`.

## 7. Shell Variant Strategy (P03-T007)

Four legitimate variants; no per-route forks:

1. **Public content** — full header + footer, reading/wide/hub widths.
2. **Marketing** — public shell + wider hero region (uses the same shell;
   marketing pages are just public pages with full-bleed sections).
3. **Application (dashboard)** — denser header, app sidebar, no public footer.
4. **Authentication** — minimal centered card, brand mark only, no nav/footer.

## 8. Prevent Unlimited Shell Variants (P03-T008)

Adding a shell variant requires:
1. A new entry in the boundary table (§2).
2. A `classifyRoute` branch.
3. A documented product reason in this file's changelog.

Routes may NOT introduce "private" shell forks. Width/sidebar differences are
expressed through slots, not new shell components.

## 9. Global Shell Server/Client Boundaries (P03-T009)

- **Server-rendered by default.** The shell frame (`<header>`, `<footer>`,
  `<main>`, skip-link, brand, nav link list) is a server component.
- **Client islands** (marked `'use client'`, isolated to the smallest
  subtree): mobile drawer toggle, theme toggle, search modal trigger,
  user menu dropdown, active-path detection for nav links.
- The root layout is a **server component**. `ThemeProvider` and
  `AuthProvider` are client components but are thin wrappers; they do not
  force the whole tree client-side.
- Never mark the shell frame itself `'use client'`.

## 10. Documentation Record (P03-T010)

This file IS the canonical record. Route-family migrations (Phase 04+)
reference this document and the `lib/shell/shell-config.ts` helper for
slot/width decisions. Exceptions are recorded in the V2 Decision Log.
