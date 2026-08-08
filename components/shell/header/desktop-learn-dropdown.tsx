'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  isNavActive,
  resolveNavHref,
  type NavSection,
} from '@/lib/shell/navigation-data'
import { getNavIcon } from '@/components/shell/nav-icons'

/**
 * DesktopLearnDropdown — the one canonical nav dropdown (P03-T073..T081).
 *
 * Client island (open/close, keyboard, escape, focus restoration). Its link
 * list is passed in as props (server-rendered upstream) so crawlers see the
 * links without JS.
 *
 * Accessibility (T076..T079):
 *  - Opens on click AND on Enter/Space (not hover-only).
 *  - Escape closes (T077) and restores focus to the trigger (T078).
 *  - Click-outside closes.
 *  - Hover is a progressive enhancement, never the only path (T079).
 *
 * Curation (T080): the group list is curated upstream in navigation-data; we
 * just render it. No giant link dumps.
 */

interface Props {
  sections: NavSection[]
  pathname: string
}

export function DesktopLearnDropdown({ sections, pathname }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Escape closes + restores focus (T077, T078)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  // Click-outside closes (T079 — not hover-only)
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const activeColumns = sections.filter((s) => s.items.length).length
  const widthClass =
    activeColumns === 1 ? 'w-[240px]' : activeColumns === 2 ? 'w-[460px]' : 'w-[640px]'
  const gridClass =
    activeColumns === 1 ? 'grid-cols-1' : activeColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md h-9 px-3 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          open ? 'text-foreground bg-muted/60' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        )}
      >
        <span>Learn</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className={cn(
            'absolute left-0 top-full mt-1 rounded-xl border border-border bg-popover text-popover-foreground shadow-md z-50',
            'animate-in fade-in-0 zoom-in-95',
            widthClass,
          )}
        >
          <div className={cn('grid gap-5 p-4', gridClass)}>
            {sections.map((section) => (
              <div key={section.title}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = getNavIcon(item.icon)
                    const active = isNavActive(resolveNavHref(item), pathname)
                    return (
                      <li key={item.href}>
                        <Link
                          href={resolveNavHref(item)}
                          role="menuitem"
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'group flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          )}
                        >
                          {Icon && (
                            <span className="mt-0.5 shrink-0 text-primary">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground leading-tight">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-xs text-muted-foreground leading-snug">
                                {item.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
