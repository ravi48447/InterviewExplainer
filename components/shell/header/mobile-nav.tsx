'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Menu } from 'lucide-react'
import { buildMobileSections, isNavActive } from '@/lib/shell/navigation-data'
import { getNavIcon } from '@/components/shell/nav-icons'
import { cn } from '@/lib/utils'

/**
 * MobileNav — canonical mobile navigation drawer (P03-T082..T096).
 *
 * Uses the sheet primitive as a left-anchored drawer. Single toggle (T083).
 * Active link highlight via isNavActive (T087). Escape closes and restores
 * focus (T092). Scroll lock + internal scroll handled by the sheet
 * primitive (T091, T093). Fits short viewports via ScrollArea (T094).
 *
 * Separate from desktop nav (T095) — desktop is server-rendered crawlable
 * anchors; this is a client island because it needs open/close state and
 * the sheet primitive is client-only.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? '/'
  const sections = buildMobileSections()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav-content"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[88vw] max-w-sm flex-col gap-0 p-0"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="text-base font-semibold">
            <Link href="/" className="text-foreground hover:text-primary" onClick={() => setOpen(false)}>
              InterviewExplainer
            </Link>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <nav id="mobile-nav-content" aria-label="Mobile" className="px-3 py-3">
            {sections.map((section) => (
              <div key={section.title} className="mb-2">
                {section.title && (
                  <button
                    type="button"
                    onClick={() => setExpanded((p) => (p === section.title ? null : section.title))}
                    aria-expanded={expanded === section.title}
                    className="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    <span>{section.title}</span>
                    <span aria-hidden="true" className="text-[0.7rem]">
                      {expanded === section.title ? '−' : '+'}
                    </span>
                  </button>
                )}
                <ul className={cn('space-y-0.5', section.title && expanded !== section.title && 'hidden')}>
                  {section.items.map((link) => {
                    const Icon = getNavIcon(link.icon)
                    const href = link.href
                    const active = isNavActive(href, pathname)
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                            active
                              ? 'bg-primary/10 font-medium text-primary'
                              : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          <span className="flex-1">{link.label}</span>
                          {link.badge && (
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-primary">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
