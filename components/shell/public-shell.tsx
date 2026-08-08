'use client'

import { usePathname } from 'next/navigation'
import { PublicHeader } from '@/components/shell/public-header'
import { PublicFooter } from '@/components/shell/public-footer'
import { resolveShellVariant, shellHasFooter } from '@/lib/shell/shell-config'

/**
 * AppShell — the canonical application shell wrapper (P03-T001..T031).
 *
 * Single entry point for every route. It resolves the shell variant from
 * the current pathname (P03-T007) and renders the matching header/footer:
 *
 *   public    → PublicHeader + PublicFooter (T008, T009)
 *   auth      → AuthShellFrame (brand only) + no footer (AE)
 *   dashboard → DashboardShellFrame + minimal footer (AF)
 *   app       → PublicHeader + PublicFooter (deep content routes)
 *
 * Why a single resolver (not per-route layout wrappers): the shell must be
 * consistent across routes (T013, T014) and route-specific forks are
 * forbidden (T032). Per-variant behavior lives in the variant components.
 *
 * This is a client component because variant resolution needs the pathname,
 * which is only available client-side in Next.js app router without custom
 * middleware headers. The frame it renders (header, footer, main, skip-link)
 * is otherwise static markup; the interactive islands inside the header are
 * the only true client JS, and they're imported as separate 'use client'
 * modules so the shell frame stays lean.
 *
 * `children` is the page content. The shell never remounts on navigation
 * within the same variant (W070) because Next.js keeps the layout segment
 * stable; only the page segment swaps.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const variant = resolveShellVariant(pathname)
  const showFooter = shellHasFooter(variant)

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      {variant === 'public' && <PublicHeader pathname={pathname} />}
      {variant === 'auth' && <AuthShellFrame />}
      {variant === 'dashboard' && <DashboardShellFrame pathname={pathname} />}
      {variant === 'app' && <PublicHeader pathname={pathname} />}

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>

      {showFooter && (variant === 'public' || variant === 'app') && <PublicFooter />}
      {variant === 'dashboard' && <DashboardShellFooter />}
      {/* auth shell: no footer (AE). */}
    </div>
  )
}

/**
 * AuthShellFrame — minimal header for auth routes (P03-AE).
 * Brand only, no primary nav, no search. Keeps the auth flow focused and
 * prevents the public nav from leaking into the auth surface (AE005).
 */
function AuthShellFrame() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl" role="banner">
      <div className="flex h-14 items-center justify-center px-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
          aria-label="InterviewExplainer home"
        >
          <span className="font-semibold tracking-tight">InterviewExplainer</span>
        </a>
      </div>
    </header>
  )
}

/**
 * DashboardShellFrame — authenticated app header (P03-AF).
 * Separated from public nav so dashboard-only JS doesn't ship to public
 * pages (AF004). Different density (AF008). Brand + compact nav.
 */
function DashboardShellFrame({ pathname }: { pathname: string }) {
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl" role="banner">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <a
          href="/"
          className="inline-flex items-center font-semibold tracking-tight text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
          aria-label="InterviewExplainer home"
        >
          InterviewExplainer
        </a>
        <nav aria-label="Dashboard" className="ml-2 hidden items-center gap-1 sm:flex">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/dashboard/progress', label: 'Progress' },
            { href: '/dashboard/bookmarks', label: 'Bookmarks' },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
                (isActive(l.href)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground')
              }
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto" />
      </div>
    </header>
  )
}

/** Minimal dashboard footer (AF). */
function DashboardShellFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background" role="contentinfo">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-xs text-muted-foreground">
          &copy; InterviewExplainer
        </p>
      </div>
    </footer>
  )
}
