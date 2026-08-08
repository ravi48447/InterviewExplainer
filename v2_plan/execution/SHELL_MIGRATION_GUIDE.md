# Shell Migration Guide (Phase 03)

**Audience:** Developers populating route families into the V2 shell (Phase 04+).
**Purpose:** How to compose page content inside the canonical `AppShell` using the Phase 03 pieces.

## The shell is already mounted

The root `app/layout.tsx` renders `AppShell`. You do **not** add a layout-level header, footer, skip-link, or `<main>` — the shell owns them. Your route's `page.tsx` renders only the page content; the shell wraps it.

```tsx
// app/[domainSlug]/page.tsx — you only write this
export default function DomainPage({ params }) {
  return <DomainContent ... />
}
```

The header, footer, skip-link, and `<main id="main-content">` are all rendered by `AppShell`. Do not duplicate them.

## Shell variants

`AppShell` resolves the variant from the pathname automatically:

| Variant | Routes | Header | Footer |
|---------|--------|--------|--------|
| `public` | homepage, domains, dsa, prep, topics, tools, etc. | `PublicHeader` (full nav) | `PublicFooter` |
| `auth` | `/login`, `/signup`, `/forgot-password`, `/reset-password` | `AuthShellFrame` (brand only) | none |
| `dashboard` | `/dashboard`, `/account`, `/profile`, `/admin` | `DashboardShellFrame` | minimal |
| `app` | deep content routes (fallback for content) | `PublicHeader` | `PublicFooter` |

You don't choose the variant — `resolveShellVariant(pathname)` does. To add a new auth route, it just needs to start with one of the `AUTH_PREFIXES`; to add a dashboard route, start with a `DASHBOARD_PREFIXES`. See `lib/shell/shell-config.ts`.

## Canonical pieces — import from the barrel

```ts
import {
  ShellBreadcrumbs,
  TableOfContents,
  ContentSidebar,
  ContextualSidebar,
  ContentTreeNav,
  ShellLoading,
  ShellError,
  ShellNotFound,
  PageContainer, // from Phase 01 — still the width container
} from '@/components/shell'
```

### Breadcrumbs

```tsx
import { ShellBreadcrumbs } from '@/components/shell'
import { buildBreadcrumbs } from '@/lib/seo'

export default function Page({ params }) {
  const items = buildBreadcrumbs('domain', params, { domainName: 'Java Backend' })
  return (
    <PageContainer>
      <ShellBreadcrumbs items={items} className="mb-6" />
      <h1>...</h1>
    </PageContainer>
  )
}
```

`buildBreadcrumbs` returns `BreadcrumbItem[]` with canonical absolute URLs. `ShellBreadcrumbs` converts them to relative paths for client nav and handles mobile collapsing.

### Table of contents

```tsx
import { TableOfContents, type TocItem } from '@/components/shell'

const headings: TocItem[] = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'approach', text: 'Approach', level: 2 },
  { id: 'complexity', text: 'Complexity', level: 3 },
]

<TableOfContents headings={headings} />
```

Pass explicit headings collected from your page's semantic structure (don't crawl the DOM at runtime). The TOC handles scrollspy + active highlighting.

### Content sidebar (left) + content tree

```tsx
import { ContentSidebar, ContentTreeNav } from '@/components/shell'
import { markActivePath, type ContentTreeSection } from '@/lib/shell/content-tree'

const sections: ContentTreeSection[] = markActivePath([...], currentHref)

<ContentSidebar title="Module contents">
  <ContentTreeNav sections={sections} />
</ContentSidebar>
```

Build the tree server-side from your content API; `markActivePath` sets `current`/`activePath` so the right branches expand by default.

### Contextual sidebar (right)

```tsx
import { ContextualSidebar } from '@/components/shell'

<ContextualSidebar>
  <TableOfContents headings={headings} />
  {/* or related links, question metadata, progress */}
</ContextualSidebar>
```

Optional — only renders if you pass children. `xl+` only on desktop; repositions inline on mobile.

### Page width

Use `PageContainer` (Phase 01) with the right tier:

```tsx
<PageContainer>           {/* default — 72rem */}
<PageContainer width="wide">    {/* hubs — 90rem */}
<PageContainer width="reading"> {/* questions/articles — 42rem */}
```

`defaultWidthForFamily(family)` tells you the canonical width for a route family.

## Loading & error

- **Route loading:** add `app/[segment]/loading.tsx` → `export default function Loading() { return <ShellLoading /> }`. The shell stays mounted.
- **Route error:** add `app/[segment]/error.tsx` → `'use client'; export default function Error({ error, reset }) { return <ShellError error={error} reset={reset} /> }`.
- **404:** call `notFound()` in a server component; the root `not-found.tsx` renders `ShellNotFound`.

## What NOT to do

- ❌ Don't add a `<header>`, `<footer>`, skip-link, or `<main id="main-content">` in your route — the shell owns them.
- ❌ Don't import `site-header` or `site-footer` — use the shell.
- ❌ Don't hand-add nav links — they live in `navigation-data.ts` (hub-gated).
- ❌ Don't add a second theme toggle, user menu, or search — one canonical placement each.
- ❌ Don't use the shadcn `Sidebar` primitive for public content — use `ContentSidebar`/`ContextualSidebar`.
- ❌ Don't make `PublicHeader` or `navigation-data.ts` client components — they're server-rendered by design.

## Frozen APIs (P03-T428)

The following are frozen for Phase 04+:
- `AppShell` props/behavior
- `ShellVariant` union
- `ShellNavLink` / `NavSection` / `FooterLink` / `FooterGroup` shapes
- `ContentTreeNode` / `ContentTreeSection` shapes
- `TocItem` shape
- `ShellBreadcrumbs` / `TableOfContents` / `ContentSidebar` / `ContextualSidebar` / `ContentTreeNav` props
- `ShellLoading` / `ShellError` / `ShellNotFound` props

Internal implementation may evolve; these public contracts won't (without a versioned deprecation).
