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
 * Light learning-site treatment: the page background is a flat
 * `bg-background` with no violet wash — the old wash existed only to tie
 * the page to a dark hero that is no longer used. Containers still cap so
 * extremely wide monitors don't stretch line lengths to unreadable widths.
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
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div
        className="relative w-full mx-auto px-3 sm:px-5 lg:px-6 py-5 lg:py-6"
        style={{ maxWidth: computedMaxWidth }}
      >
        {hasSide ? (
          <div className="flex gap-5 lg:gap-7 items-start">
            {sidebar && (
              <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
                {sidebar}
              </aside>
            )}
            <main className="flex-1 min-w-0">{children}</main>
            {rightRail && (
              <aside className="hidden xl:block w-[280px] shrink-0 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
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
