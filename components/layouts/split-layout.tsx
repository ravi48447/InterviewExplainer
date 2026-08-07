import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Position of the sidebar. Default places sidebar on the right. */
  sidebarSide?: "left" | "right";
  /** Sidebar width (CSS length). Default `20rem` (320px). */
  sidebarWidth?: string;
  /** Gap between main and sidebar. Default `1.5rem`. */
  gap?: "sm" | "md" | "lg";
  /** Which child is the sidebar. Use the `sidebar` prop on the slot. */
  renderSidebar?: (slots: { main: React.ReactNode; sidebar: React.ReactNode }) => React.ReactNode;
}

const gapMap = {
  sm: "0.75rem",
  md: "1.5rem",
  lg: "2rem",
} as const;

/**
 * SplitLayout — canonical main + sidebar layout (P01-T113/T114).
 *
 * Single-column on mobile, two-column from `lg` up. The sidebar collapses
 * below the main content on narrow screens. For a sticky sidebar, wrap the
 * sidebar slot in `StickyRegion`.
 *
 * Usage with the default slot convention (children = [main, sidebar]):
 *   <SplitLayout sidebarSide="left">{main}{sidebar}</SplitLayout>
 * Or use `renderSidebar` for explicit slot mapping.
 */
export function SplitLayout({
  children,
  className,
  sidebarSide = "right",
  sidebarWidth = "20rem",
  gap = "md",
  renderSidebar,
}: SplitLayoutProps) {
  const style = {
    "--split-side": sidebarWidth,
    "--split-gap": gapMap[gap],
  } as React.CSSProperties;

  if (renderSidebar) {
    const arr = Array.isArray(children) ? children : [children];
    const main = arr[0];
    const sidebar = arr[1];
    return (
      <div
        className={cn(
          "split-layout",
          sidebarSide === "left" && "split-layout-sidebar-left",
          className,
        )}
        style={style}
      >
        {renderSidebar({ main, sidebar })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "split-layout",
        sidebarSide === "left" && "split-layout-sidebar-left",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
