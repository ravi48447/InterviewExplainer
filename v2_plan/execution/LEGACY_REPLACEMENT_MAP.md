# Legacy → V2 Replacement Map (P01-T259, T322)

Maps legacy V1 patterns to their canonical V2 replacements. Use this when migrating existing surfaces.

## Button variants

| Legacy (V1) | V2 canonical | Notes |
|-------------|-------------|-------|
| `variant="default"` | `variant="primary"` | Alias retained for compat; maps to primary |
| `variant="accent"` | `variant="primary"` | Alias retained |
| `variant="success"` | `variant="primary"` | Alias retained; use Badge variant="success" for status |
| `variant="premium"` | `variant="primary"` | Alias retained; no separate premium button |
| `variant="shadow"` | `variant="primary"` | Alias retained |
| `variant="secondary"` (old) | `variant="secondary"` | Kept as canonical |
| `variant="ghost"` | `variant="ghost"` | Kept |
| `variant="outline"` | `variant="outline"` | Kept |
| `variant="destructive"` | `variant="destructive"` | Kept |
| `variant="link"` | `variant="link"` | Kept |
| `variant="icon"` | `variant="icon"` | Kept; requires `aria-label` |

## Card variants

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| ad-hoc `content-card` / `content-card-hover` CSS classes | `<Card>` / `<Card variant="interactive">` | cva-based; use the component |
| `hover:shadow-lg` cards | `variant="interactive"` (hover:shadow-md) | Restrained elevation |
| scale-on-hover | removed | No scale transforms |
| `text-2xl` card titles | `text-lg font-semibold` (CardTitle) | Proportional |

## Badge / Tag

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| `variant="premium"` badge | removed; use `variant="primary"` | No premium badge |
| `variant="secondary"` badge | removed; use default | Consolidated |
| arbitrary-color badges | semantic + difficulty only | No `bg-blue-500` etc. |
| Badge used as a content label | `<Tag>` | Tags are neutral; badges are status |

## Form

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| inline label/input/error layout | `<FormField>` | Associates label/description/error |
| `variant="default"` on EmptyState's Button | `variant="primary"` | Legacy alias handles it |
| manual search input | `<SearchInput>` | Icon/clear/loading/shortcut/mobile |

## Layout

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| `max-w-4xl mx-auto px-4` | `.page-container` / `<PageContainer>` | Tokenized gutters |
| `max-w-2xl` prose | `.reading-container` / `<ReadingContainer>` | `--reading-width` |
| ad-hoc `flex flex-col gap-X` | `.stack` / `<Stack>` | `--stack-gap` |
| ad-hoc `flex flex-wrap gap-X` | `.cluster` / `<Cluster>` | `--cluster-gap` |
| ad-hoc `grid grid-cols-X` | `.grid-auto` / `.grid-2/3/4` / `<Grid>` | Responsive collapse |
| `lg:grid-cols-[20rem_1fr]` sidebar | `.split-layout` / `<SplitLayout>` | `--split-side` |

## Overlays

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| ad-hoc `z-50` / `z-[100]` | `z-popover` / `z-dropdown` / `z-modal` etc. | `--z-*` tokens |
| `transition-all` | `transition-colors` / `transition` | No transition-all |
| scale-in animations | fade/slide via Radix data-state | No scale transforms |

## Content

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| `<pre>` with manual copy | `<CodeBlock>` | Header + copy + overflow |
| ad-hoc alert/note boxes | `<Callout variant="note/tip/warning/example/takeaway">` | Semantic |
| raw `<table>` overflow | `<TableWrapper>` | Scroll + caption |
| `<figure>` hand-rolled | `<Figure>` | Caption container |
| `.markdown-body` prose | `<Prose>` + `.prose-v2` | Scoped tokens |

## Motion

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| `transition-all duration-300` | `transition-colors motion-duration-base` | Tokenized |
| `hover:scale-105` | removed | No hover scaling |
| arbitrary easing | `ease-standard` / `ease-emphasized` | Tokenized |

## Theme

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| hex colors in components | `hsl(var(--token))` | Semantic tokens |
| `bg-white` / `bg-gray-900` | `bg-background` / `bg-surface` | Theme-aware |
| `text-gray-500` | `text-muted-foreground` | Theme-aware |
| hardcoded shadow | `shadow-sm` / `shadow-md` | Tokenized |

## Shell (Phase 03)

| Legacy | V2 canonical | Notes |
|--------|-------------|-------|
| `components/site-header.tsx` | `components/shell/public-header.tsx` | Monolithic client header → server frame + client islands |
| `components/site-footer.tsx` | `components/shell/public-footer.tsx` | Hand-rolled link groups → buildFooterGroups (SEO + gating) |
| `components/ReadingProgressBar.tsx` | `components/shell/table-of-contents.tsx` | Progress bar folded into TOC scrollspy |
| `components/ContentTreeNav.tsx` | `components/shell/content-tree-nav.tsx` | One of 5 legacy tree-navs → canonical |
| `components/PillarTreeNav.tsx` | `components/shell/content-tree-nav.tsx` | Consolidated |
| `components/StackHierarchyNav.tsx` | `components/shell/content-tree-nav.tsx` | Consolidated |
| `components/V2ContentTreeNav.tsx` | `components/shell/content-tree-nav.tsx` | Consolidated |
| `components/QuestionSidebar.tsx` | `components/shell/content-tree-nav.tsx` + `contextual-sidebar.tsx` | Split content tree vs contextual |
| `app/loading.tsx` spinner + "Loading…" | `components/shell/shell-loading.tsx` | Layout-preserving skeleton |
| `app/error.tsx` inline markup | `components/shell/shell-error.tsx` | Canonical route error |
| `app/not-found.tsx` inline markup | `components/shell/shell-not-found.tsx` | Canonical 404 |
| header theme toggle (in site-header) | `components/shell/header/theme-toggle.tsx` | One placement, 3 modes |
| header user menu (in site-header) | `components/shell/header/header-user-actions.tsx` | Consolidated, no layout shift |
| header search button (in site-header) | `components/shell/header/header-search.tsx` | Hub-gated wrapper around GlobalSearch |
| header mobile nav (in site-header) | `components/shell/header/mobile-nav.tsx` | Sheet-based drawer |
