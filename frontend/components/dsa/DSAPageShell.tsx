import { ReactNode } from "react";

/**
 * Standard shell for every DSA-surface page.
 *
 * Layout shapes:
 *   - No sidebars  →   single centred column (default; legacy behaviour)
 *   - sidebar      →   left nav + main (problem page, module landing)
 *   - sidebar +    →   left nav + main + right info rail
 *     rightRail
 *   - rightRail    →   main + right info rail (no left nav)
 *
 * Container width is intentionally wide. Older revisions of this shell
 * capped sidebar-only pages at 1180px, which left ~25–30% of a 1440p
 * display empty on each side — the main column only covered the middle
 * of the screen. The current problem page has enough structured content
 * (sidebar, hero, revision card, two full approach blocks with embedded
 * code + traces, mistakes) that the extra horizontal real estate is
 * actually used, so we widen to 1520px for sidebar-only and 1640px for
 * double-rail layouts. Containers still cap so extremely wide monitors
 * don't stretch line lengths to unreadable widths.
 *
 * Sidebars collapse on screens smaller than `lg` (1024px) so mobile
 * gets a single readable column.
 */
export function DSAPageShell({
  children,
  sidebar,
  rightRail,
  jsonLd,
  maxWidth,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
  rightRail?: ReactNode;
  jsonLd?: object;
  /** Override the max-width. See defaults above. */
  maxWidth?: string;
}) {
  const hasSide = Boolean(sidebar || rightRail);
  const computedMaxWidth =
    maxWidth ??
    (sidebar && rightRail ? "1640px" : hasSide ? "1520px" : "1200px");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eef0f4] to-[#f4f5f7] font-sans text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Soft violet wash up top to tie the page to the dark hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-violet-200/40 via-violet-100/15 to-transparent"
      />
      <div
        className="relative w-full mx-auto px-3 sm:px-5 lg:px-6 py-5 lg:py-6"
        style={{ maxWidth: computedMaxWidth }}
      >
        {hasSide ? (
          <div className="flex gap-5 lg:gap-7 items-start">
            {sidebar && (
              <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0 self-start sticky top-6">
                {sidebar}
              </aside>
            )}
            <main className="flex-1 min-w-0">{children}</main>
            {rightRail && (
              <aside className="hidden xl:block w-[280px] shrink-0 self-start sticky top-6">
                {rightRail}
              </aside>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
