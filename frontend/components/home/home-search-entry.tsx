"use client";

import { isHubEnabled } from "@/lib/launch-config";
import { GlobalSearch } from "@/modules/search/components/GlobalSearch";

/**
 * HomeSearchEntry — homepage search entry (P04-T049..T066).
 *
 * The homepage search role is to *help a visitor who already knows what they're
 * looking for* jump straight to it (P04-T049). It is secondary to the primary
 * orientation flow (P04-T016/T017) and is gated behind the `search` hub flag
 * so an unlaunched indexer never ships its client JS to the homepage
 * (P04-T065/T289). When search is not enabled, this component renders null
 * and adds zero client JS — the homepage stays fully server-rendered
 * (P04-T282).
 *
 * Behaviour rules encoded:
 *   - Search results use canonical URLs (P04-T058) — handled by GlobalSearch.
 *   - Empty/error/loading states are owned by the search modal (P04-T059..T061).
 *   - Keyboard navigation + screen-reader support (P04-T062/T063) — GlobalSearch.
 *   - The search dataset is NOT loaded into the initial homepage bundle
 *     (P04-T065/T289) — the modal fetches on open.
 *   - Search is noindex (P04-T066) — query explosion is prevented by the
 *     robots policy + the modal-only rendering.
 *
 * This is the only client component on the homepage besides the shell's own
 * islands (P04-T281/T282). app/page.tsx imports it directly; Next.js draws
 * the client boundary automatically, and this component returns null when
 * the search hub is disabled so it never blocks first render and adds no
 * client JS in that case (P04-T283/T290).
 */
export function HomeSearchEntry() {
  if (!isHubEnabled("search")) return null;
  return <GlobalSearch />;
}
