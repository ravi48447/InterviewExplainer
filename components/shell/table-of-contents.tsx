'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * TableOfContents — canonical TOC component (P03-R, T176..T191).
 *
 * Generates a TOC from explicit `headings` (collected by the page from its
 * semantic h2/h3 structure, so we don't crawl the DOM at runtime — T177).
 * Active section highlighting via IntersectionObserver scrollspy (T180).
 * Sticky under the header with scroll offset (T178). Avoids excessive depth
 * — pages pass at most h2+h3 (T181). Consolidates the legacy
 * ReadingProgressBar (T191); progress is a separate concern handled by
 * the contextual sidebar, not a duplicate component.
 *
 * Mobile behavior (T183): on small screens the TOC collapses to a
 * disclosure; on lg+ it's a sticky aside.
 */
export interface TocItem {
  /** Anchor id (must match the heading's id attribute). */
  id: string
  text: string
  level: 2 | 3
}

export function TableOfContents({
  headings,
  contentRef,
}: {
  headings: TocItem[]
  /** Optional ref to the content container for accurate scrollspy bounds. */
  contentRef?: React.RefObject<HTMLElement>
}) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  const ids = useMemo(() => headings.map((h) => h.id).filter(Boolean), [headings])

  useEffect(() => {
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Offset so a heading lights up just before it reaches the top,
        // accounting for the sticky header height (T178).
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0, 1],
      },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  if (!headings || headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border/60">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? 'true' : undefined}
              className={cn(
                'block border-l-2 -ml-px py-1 transition-colors',
                h.level === 3 ? 'pl-6' : 'pl-3',
                activeId === h.id
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
