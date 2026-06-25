import { ReactNode } from "react";
import { ContentThemeProvider } from "@/components/question/ThemeContext";

/**
 * LeetCode-style two-pane layout for problem detail pages.
 *
 * LEFT PANE  (42%): Problem statement, examples, constraints — sticky,
 *                   scrolls independently. Reader can study the problem
 *                   while the solution is visible.
 *
 * RIGHT PANE (58%): All solution content — approaches, code, playground,
 *                   mistakes. Scrolls independently.
 *
 * Both panes are `h-[calc(100vh-56px)]` (full viewport minus the global
 * header) with `overflow-y-auto`, so each scrolls without the other
 * moving. This is the core UX win vs. the old single-column layout.
 *
 * On screens < lg (1024px) the layout collapses to a single column,
 * left pane first, matching LeetCode's mobile behaviour.
 *
 * jsonLd is optional structured data injected as a <script> tag.
 */
export function DSAProblemTwoPaneShell({
  leftPane,
  rightPane,
  jsonLd,
}: {
  leftPane: ReactNode;
  rightPane: ReactNode;
  jsonLd?: object;
}) {
  return (
    // The DSA pages are a single light-themed surface (no dark toggle). Pin the
    // content theme to "light" so theme-aware children like <MarkdownContent>
    // render the light palette instead of the provider's "dark" default — which
    // otherwise painted near-white text on these white panes.
    <ContentThemeProvider forcedTheme="light">
    <div className="min-h-screen bg-[#f4f5f7] font-sans text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Two-pane split — collapses to single column on mobile */}
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-56px)]">
        {/* LEFT PANE — problem statement */}
        <div
          className={[
            // Desktop: fixed-width, scrollable independently
            "lg:w-[42%] lg:max-w-[580px] lg:shrink-0",
            "lg:overflow-y-auto lg:border-r lg:border-border",
            // Light background to distinguish from the right pane
            "bg-background",
            // Mobile: just a normal block
            "px-5 py-6 lg:px-7 lg:py-7",
          ].join(" ")}
        >
          {leftPane}
        </div>

        {/* RIGHT PANE — solution content */}
        <div
          className={[
            "flex-1 min-w-0",
            "lg:overflow-y-auto",
            // Slightly off-white to contrast against the code blocks
            "bg-[#f4f5f7]",
            "px-5 py-6 lg:px-8 lg:py-7",
          ].join(" ")}
        >
          {rightPane}
        </div>
      </div>
    </div>
    </ContentThemeProvider>
  );
}
