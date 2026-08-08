'use client'

import { isHubEnabled } from '@/lib/launch-config'
import { GlobalSearch } from '@/modules/search/components/GlobalSearch'

/**
 * HeaderSearch — canonical header search entry (P03-T097..T106).
 *
 * Thin shell-side wrapper around the existing GlobalSearch island. It:
 *  - Respects the `search` hub gate so the entry only renders when search is
 *    launched (T100, launch-config). This keeps unlaunched search from
 *    shipping its client JS to public pages (AA, T318).
 *  - Owns the accessible label contract (T101).
 *
 * The keyboard shortcut (Ctrl/Cmd+K), desktop input, mobile icon button, and
 * modal live in GlobalSearch — we don't duplicate them (T104, AB). The modal
 * renders canonical URLs in its results (T102) via the SearchModal layer.
 */
export function HeaderSearch() {
  if (!isHubEnabled('search')) return null
  return <GlobalSearch />
}
