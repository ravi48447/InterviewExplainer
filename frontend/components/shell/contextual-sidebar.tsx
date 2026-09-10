import { cn } from '@/lib/utils'

/**
 * ContextualSidebar — canonical right-side contextual sidebar (P03-Q, T156..T167).
 *
 * Optional (T157): only renders on routes that pass children. Hosts TOC,
 * question metadata, related links, progress — whatever the page composes.
 * Canonical container (T158), sticky (T161), collapses/repositions on
 * mobile (T162) — on mobile it renders inline after content, not fixed.
 *
 * Server-rendered container; the TOC inside is a client island (scrollspy).
 */
export function ContextualSidebar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  if (!children) return null
  return (
    <aside
      className={cn(
        'hidden w-[var(--contextual-sidebar-width,15rem)] shrink-0 xl:block',
        className,
      )}
      aria-label="Page context"
    >
      <div className="sticky top-20 z-[var(--z-sticky)] max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
        {children}
      </div>
    </aside>
  )
}
