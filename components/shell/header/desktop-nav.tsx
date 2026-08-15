import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  buildPrimaryNavLinks,
  buildLearnSections,
  hasLearnMenu,
  isNavActive,
  resolveNavHref,
  type ShellNavLink,
} from '@/lib/shell/navigation-data'
import { getNavIcon } from '@/components/shell/nav-icons'
import { DesktopLearnDropdown } from '@/components/shell/header/desktop-learn-dropdown'

/**
 * DesktopNav — canonical desktop primary navigation (P03-T059..T070).
 *
 * Server-rendered. Renders crawlable <a> tags for every primary destination
 * (T064). The Learn dropdown is a small client island (open/close, keyboard,
 * escape, focus restoration) but its link list is server-rendered so search
 * engines see the links without JS (T075).
 *
 * Active state (T060) is computed from the pathname prop passed down from the
 * header — kept server-side so the initial HTML is correct.
 */
export function DesktopNav({ pathname }: { pathname: string }) {
  const primary = buildPrimaryNavLinks()
  const learnSections = buildLearnSections()
  const showLearn = hasLearnMenu()

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:flex items-center gap-1 ml-2"
    >
      {showLearn && <DesktopLearnDropdown sections={learnSections} pathname={pathname} />}

      {primary.map((link) => {
        const active = isNavActive(resolveNavHref(link), pathname)
        return (
          <Link
            key={link.href}
            href={resolveNavHref(link)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex items-center rounded-lg h-9 px-3 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              active
                ? 'text-primary bg-primary/10'
                : 'text-foreground/75 hover:text-primary hover:bg-primary/5',
            )}
          >
            <span>{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/** A server-rendered direct link used for hubs that don't need a dropdown. */
export function DesktopDirectLink({
  link,
  pathname,
}: {
  link: ShellNavLink
  pathname: string
}) {
  const Icon = getNavIcon(link.icon)
  const active = isNavActive(resolveNavHref(link), pathname)
  return (
    <Link
      href={resolveNavHref(link)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md h-9 px-3 text-sm font-semibold transition-colors whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span>{link.label}</span>
      {link.badge === 'Soon' && (
        <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
          {link.badge}
        </span>
      )}
    </Link>
  )
}
