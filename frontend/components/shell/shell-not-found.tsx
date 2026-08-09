import Link from 'next/link'
import { SearchX, Home, Compass, Code2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { isHubEnabled } from '@/lib/launch-config'

/**
 * ShellNotFound — canonical 404 content (P03-V, T238..T247).
 *
 * V2-consistent design, homepage recovery (T239), optional search recovery
 * (T240, hub-gated), major hub links (T241), avoids overload (T242) —
 * three recovery paths max. Correct HTTP status (T243): the route returns a
 * 404 via `notFound()`. Prevents indexing (T244): the page metadata is
 * noindex (handled by buildNoindexMetadata in the route file).
 *
 * Consolidates the legacy not-found page (T247).
 */
export function ShellNotFound() {
  const hubLinks: { href: string; label: string; icon: typeof Compass; show: boolean }[] = [
    { href: '/domains', label: 'Browse Domains', icon: Compass, show: isHubEnabled('interviewQA') },
    { href: '/dsa', label: 'DSA Problems', icon: Code2, show: isHubEnabled('dsa') },
    { href: '/prep', label: 'Prep by Topic', icon: BookOpen, show: isHubEnabled('prepCategories') },
  ]
  const visible = hubLinks.filter((h) => h.show)

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={<SearchX />}
        title="We couldn't find that page"
        description="The page may have moved or never existed. Here are some places to go next."
      />

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
        </Button>
        {visible.map((h) => (
          <Button asChild key={h.href} variant="outline">
            <Link href={h.href}>
              <h.icon className="mr-2 h-4 w-4" aria-hidden="true" />
              {h.label}
            </Link>
          </Button>
        ))}
      </div>

      {isHubEnabled('search') && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Or{' '}
          <Link href="/search" className="font-medium text-foreground underline-offset-4 hover:underline">
            search for what you need
          </Link>
          .
        </p>
      )}
    </div>
  )
}
