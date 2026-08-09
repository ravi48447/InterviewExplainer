import { cn } from '@/lib/utils'

/**
 * ContentSidebar — canonical left/content sidebar container (P03-O, P143..T155).
 *
 * A light, sticky, internally-scrollable container for content-tree
 * navigation. Deliberately NOT the shadcn sidebar primitive: that primitive
 * is a heavy cookie-backed provider meant for app dashboards; the public
 * content shell needs a lean, server-rendered, crawlable container with
 * no client JS by default. Interactive bits (expand/collapse) live in the
 * child ContentTreeNav island (Workstream P).
 *
 * Width token: --content-sidebar-width (T148). Sticky under header (T149).
 * Internal scroll (T150). Collapses to a drawer/accordion on mobile (T151).
 */
export function ContentSidebar({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string
  title?: string
}) {
  return (
    <aside
      className={cn(
        'hidden w-[var(--content-sidebar-width,16rem)] shrink-0 lg:block',
        className,
      )}
      aria-label={title ?? 'Content navigation'}
    >
      <div className="sticky top-20 z-[var(--z-sticky)] max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
        {title && (
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
        )}
        {children}
      </div>
    </aside>
  )
}
