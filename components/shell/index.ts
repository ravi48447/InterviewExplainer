/**
 * components/shell/index.ts — Shell barrel (P03-AB, AL).
 *
 * Canonical surface for the V2 application shell. Route layouts and pages
 * import shell pieces from here so we can evolve internals without breaking
 * call sites. Legacy header/nav/footer/sidebar components are not re-exported
 * — they're migrated to these and removed (P03-AC).
 */

// Shell frame + variants
export { AppShell } from './public-shell'
export { PublicHeader } from './public-header'
export { PublicFooter } from './public-footer'

// Brand
export { BrandMark } from './brand-mark'

// Breadcrumbs + TOC
export { ShellBreadcrumbs } from './shell-breadcrumbs'
export { TableOfContents } from './table-of-contents'
export type { TocItem } from './table-of-contents'

// Sidebars
export { ContentSidebar } from './content-sidebar'
export { ContextualSidebar } from './contextual-sidebar'

// Content tree navigation
export { ContentTreeNav } from './content-tree-nav'
export type { ContentTreeNode, ContentTreeSection } from '@/lib/shell/content-tree'

// Loading / error / not-found
export { ShellLoading, ShellLoadingMinimal, HeaderLoading } from './shell-loading'
export { ShellError, RootShellError } from './shell-error'
export { ShellNotFound } from './shell-not-found'

// Header action islands (for custom shell variants if needed)
export { ThemeToggle } from './header/theme-toggle'
export { HeaderUserActions, HeaderUserActionsCompact } from './header/header-user-actions'
export { HeaderSearch } from './header/header-search'
export { MobileNav } from './header/mobile-nav'
export { DesktopNav } from './header/desktop-nav'
