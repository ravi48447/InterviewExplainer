import { cn } from "@/lib/utils";

interface ClusterProps {
  children: React.ReactNode;
  className?: string;
  /** Gap between items. `md` (default) = space-2 (0.5rem). */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Horizontal distribution. */
  justify?: "start" | "center" | "between" | "end";
  /** Vertical alignment of items within the row. */
  align?: "start" | "center" | "end" | "baseline";
}

const gapMap = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-2",
  lg: "gap-4",
  xl: "gap-6",
} as const;

const justifyMap = {
  start: "cluster-start",
  center: "cluster-center",
  between: "cluster-between",
  end: "cluster-end",
} as const;

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
} as const;

/**
 * Cluster — canonical inline/wrap primitive (P01-T111).
 *
 * Lays children out in a horizontal row that wraps, with a shared gap and
 * controllable justification. Use for button rows, tag/chip groups, and
 * inline metadata. The `cluster-*` base classes provide flex-wrap + gap;
 * this component layers gap/justify/align on top.
 */
export function Cluster({
  children,
  className,
  gap = "md",
  justify = "start",
  align = "center",
}: ClusterProps) {
  return (
    <div className={cn("cluster", justifyMap[justify], alignMap[align], gapMap[gap], className)}>
      {children}
    </div>
  );
}
