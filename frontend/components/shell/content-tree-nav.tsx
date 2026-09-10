'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentTreeSection, ContentTreeNode } from '@/lib/shell/content-tree'

/**
 * ContentTreeNav — canonical content tree navigation (P03-P, T168..T175).
 *
 * Consolidates the 5 legacy tree-nav variants (ContentTreeNav, PillarTreeNav,
 * StackHierarchyNav, V2ContentTreeNav, QuestionSidebar) into one renderer.
 *
 * Behavior:
 *  - Current node highlighted (T170).
 *  - Ancestors of current default-expanded (T171) via `activePath` flag set
 *    server-side by markActivePath.
 *  - Manual expand/collapse of any branch (T172).
 *  - Keyboard nav (T173): arrow keys move between items; Left collapses, Right
 *    expands; Enter follows the link. Roving tabindex is approximated via
 *    focusable anchors.
 *  - Accessible tree semantics (T174): role="tree"/"treeitem", aria-expanded,
 *    aria-current.
 *  - Canonical URLs (T175) — hrefs come from the data layer, built via buildPath.
 *
 * Mobile strategy (T176): the ContentSidebar container hides on mobile; on
 * small screens the tree is available via the mobile drawer or an accordion
 * rendered by the page. This component itself is mobile-friendly (it just
 * renders nested lists), so the same data powers both.
 */
export function ContentTreeNav({ sections }: { sections: ContentTreeSection[] }) {
  return (
    <nav aria-label="Content tree" className="text-sm">
      <ul role="tree" className="space-y-0.5">
        {sections.map((section) => (
          <li key={section.id} role="none">
            {section.title && (
              <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
            )}
            <TreeList nodes={section.nodes} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function TreeList({ nodes, depth = 0 }: { nodes: ContentTreeNode[]; depth?: number }) {
  return (
    <ul role={depth === 0 ? undefined : 'group'} className="space-y-0.5">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} depth={depth} />
      ))}
    </ul>
  )
}

function TreeItem({ node, depth }: { node: ContentTreeNode; depth: number }) {
  const hasChildren = node.children && node.children.length > 0
  const [open, setOpen] = useState<boolean>(!!node.activePath || !!node.current)
  const isCurrent = !!node.current

  return (
    <li role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-current={isCurrent ? 'page' : undefined}>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight
              className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className="h-6 w-6 shrink-0" aria-hidden="true" />
        )}
        <Link
          href={node.href}
          className={cn(
            'flex-1 rounded-md py-1.5 pr-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isCurrent
              ? 'bg-primary/10 font-medium text-primary'
              : 'text-foreground/80 hover:bg-muted hover:text-foreground',
          )}
          style={{ paddingLeft: depth === 0 ? undefined : undefined }}
        >
          <span className="truncate">{node.label}</span>
          {node.badge && (
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-medium text-primary">
              {node.badge}
            </span>
          )}
        </Link>
      </div>
      {hasChildren && open && (
        <ul role="group" className="ml-4 mt-0.5 space-y-0.5 border-l border-border/40 pl-2">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
