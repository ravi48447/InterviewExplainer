import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { BreadcrumbItem as SeoBreadcrumbItem } from '@/lib/seo/breadcrumbs'
import { cn } from '@/lib/utils'

/**
 * ShellBreadcrumbs — canonical breadcrumb component (P03-N, T132..T142).
 *
 * Consumes BreadcrumbItem[] from the Phase 02 SEO `buildBreadcrumbs` helper.
 * Canonical URLs (T133), placement is at the top of page content with
 * standard spacing (T134), mobile collapses deep hierarchies (T135, T136),
 * and we prevent duplication by being the single breadcrumb source (T138,
 * T139) — nested layouts must not render their own breadcrumbs.
 *
 * Server-rendered (no client state) so it's crawlable (Z057, T137).
 *
 * `items` already carries `current: true` on the last item — we honor that
 * rather than re-deriving, so the SEO layer stays the single source of truth.
 */
export function ShellBreadcrumbs({
  items,
  className,
}: {
  items: SeoBreadcrumbItem[]
  className?: string
}) {
  if (!items || items.length === 0) return null

  // Collapse the middle when deep (T136): keep first, ellipsis, last two.
  const showEllipsis = items.length > 4
  const visible = showEllipsis
    ? [items[0], null, ...items.slice(-2)]
    : items

  return (
    <Breadcrumb className={cn('w-full', className)}>
      <BreadcrumbList>
        {visible.map((item, i) => {
          if (item === null) {
            return (
              <BreadcrumbItem key={`ellipsis-${i}`}>
                <span className="text-muted-foreground" aria-hidden="true">
                  &hellip;
                </span>
                {i < visible.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            )
          }
          // Items carry absolute URLs (buildAbsoluteUrl). For internal links
          // we render a relative path so Next.js client-nav applies (T133).
          const href = toRelative(item.url)
          const isLast = i === visible.length - 1
          return (
            <BreadcrumbItem key={item.url + i}>
              {item.current || isLast ? (
                <BreadcrumbPage className="text-foreground font-medium truncate max-w-[40vw] sm:max-w-none">
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground truncate max-w-[40vw] sm:max-w-none"
                  >
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/** Convert an absolute canonical URL to a relative path for client nav. */
function toRelative(absolute: string): string {
  try {
    const u = new URL(absolute)
    return u.pathname + u.search
  } catch {
    return absolute
  }
}
