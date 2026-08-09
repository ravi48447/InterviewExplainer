/**
 * lib/shell/content-tree.ts — Content tree navigation data contract (P03-P, T168..T175).
 *
 * The canonical data shape for stack/pillar/module/question hierarchical
 * navigation. Pure data (no React) so it can be built server-side from the
 * content API and passed into the client ContentTreeNav island.
 *
 * This consolidates the 5 legacy variants (ContentTreeNav, PillarTreeNav,
 * StackHierarchyNav, V2ContentTreeNav, QuestionSidebar) under one shape
 * (P03-AC, T175). Legacy components map to this shape and are removed.
 */

export interface ContentTreeNode {
  /** Stable id (slug). */
  id: string
  /** Canonical URL. */
  href: string
  label: string
  /** Optional short description. */
  description?: string
  /** Optional Lucide icon name. */
  icon?: string
  /** Children for nested structures (modules → questions, etc.). */
  children?: ContentTreeNode[]
  /** Whether this node is the current page. */
  current?: boolean
  /** Whether an ancestor of the current node (for default expansion). */
  activePath?: boolean
  /** Optional badge, e.g. "new" or a count. */
  badge?: string
}

export interface ContentTreeSection {
  id: string
  title?: string
  nodes: ContentTreeNode[]
}

/**
 * Flatten a tree into a list of visible hrefs for quick active-state lookup.
 * Pure helper — no React.
 */
export function flattenTree(nodes: ContentTreeNode[]): ContentTreeNode[] {
  const out: ContentTreeNode[] = []
  const walk = (ns: ContentTreeNode[]) => {
    for (const n of ns) {
      out.push(n)
      if (n.children) walk(n.children)
    }
  }
  walk(nodes)
  return out
}

/**
 * Mark the active path: sets `current` on the matching node and `activePath`
 * on its ancestors, so the renderer can default-expand the right branches
 * without tracking every node's state client-side (T171).
 */
export function markActivePath(
  nodes: ContentTreeNode[],
  currentHref: string,
): ContentTreeNode[] {
  const walk = (ns: ContentTreeNode[]): boolean => {
    let found = false
    for (const n of ns) {
      const childFound = n.children ? walk(n.children) : false
      if (n.href === currentHref) {
        n.current = true
        found = true
      }
      n.activePath = childFound || n.current === true
      if (childFound) found = true
    }
    return found
  }
  walk(nodes)
  return nodes
}
