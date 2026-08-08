import { BrandMark } from '@/components/shell/brand-mark'
import { DesktopNav } from '@/components/shell/header/desktop-nav'
import { MobileNav } from '@/components/shell/header/mobile-nav'
import { HeaderSearch } from '@/components/shell/header/header-search'
import { HeaderUserActions } from '@/components/shell/header/header-user-actions'
import { ThemeToggle } from '@/components/shell/header/theme-toggle'

/**
 * PublicHeader — canonical public-site header (P03-T032..T056, T031).
 *
 * Server-rendered frame + small client islands. Renders crawlable brand +
 * nav anchors on the server so search engines see them without JS (T033,
 * T034, Z057). Only interactive bits become client JS: mobile drawer, learn
 * dropdown open state, theme toggle, user menu, search modal (T036).
 *
 * Receives `pathname` from its client-shell parent (AppShell) so active-state
 * is correct on first render; DesktopNav also owns its own client-aware
 * active detection for inter-navigation updates.
 *
 * Responsive:
 *   <lg  → mobile drawer toggle + brand + actions (T053)
 *   lg+  → brand + desktop nav + search + actions + theme
 *
 * Stability: `sticky top-0 z-50` with backdrop blur (T054, W). The shell
 * always renders; auth/search never block the frame (T051).
 *
 * Ownership: the ONLY public header. Route-specific forks are forbidden
 * (T032) — variant differences live in the shell variants.
 */
export function PublicHeader({ pathname = '/' }: { pathname?: string }) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
      role="banner"
    >
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:gap-3">
        {/* Mobile drawer (client island) */}
        <div className="lg:hidden">
          <MobileNav />
        </div>

        {/* Brand (server) */}
        <BrandMark size="md" />

        {/* Desktop primary nav (server-rendered crawlable anchors + dropdown island) */}
        <DesktopNav pathname={pathname} />

        {/* Spacer pushes actions right */}
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {/* Search (client island, hub-gated) */}
          <div className="hidden md:block">
            <HeaderSearch />
          </div>

          {/* Theme (client island) */}
          <ThemeToggle />

          {/* User actions (client island) */}
          <HeaderUserActions />
        </div>
      </div>

      {/* Mobile search row: on small screens where the inline search doesn't
          fit, render it in a secondary row under the bar (T053, T099). */}
      <div className="border-t border-border/60 px-4 py-2 md:hidden lg:hidden">
        <HeaderSearch />
      </div>
    </header>
  )
}
