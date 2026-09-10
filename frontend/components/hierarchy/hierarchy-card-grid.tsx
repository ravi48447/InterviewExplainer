/**
 * hierarchy-card-grid.tsx — Shared card grid for hierarchy child discovery
 * (P05-T068..T075, T108..T115).
 *
 * Renders a list of child entities (stacks/pillars/modules) as whole-card links.
 * Each card has a title, an optional description, an optional count, and
 * an arrow affordance. No hover scaling, no decorative icon walls
 * (P05-T084/T088/T193/T237).
 *
 * The grid is responsive: 1 column on mobile, 2 at sm, 3 at lg.
 * Server component — no client JS.
 */

import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export interface HierarchyCardItem {
  title: string;
  description?: string;
  href: string;
  /** Optional count badge (e.g. "12 questions"). */
  count?: number;
  countLabel?: string;
}

export interface HierarchyCardGridProps {
  items: HierarchyCardItem[];
  /** Column layout: default 3-col, or 2-col for wider cards. */
  columns?: 2 | 3;
  /** Optional empty state message. */
  emptyMessage?: string;
}

export function HierarchyCardGrid({
  items,
  columns = 3,
  emptyMessage = "No content available yet.",
}: HierarchyCardGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Layers className="h-6 w-6" />}
        title="No content yet"
        description={emptyMessage}
      />
    );
  }

  const colsClass =
    columns === 2
      ? "grid gap-4 sm:grid-cols-2"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <ul className={colsClass}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "group flex h-full flex-col gap-2 rounded-lg border border-border/60 bg-card p-5",
              "transition-colors duration-200 ease-out hover:border-primary/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            {item.description ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            ) : null}
            {item.count !== undefined ? (
              <p className="mt-auto text-xs text-muted-foreground">
                {item.count} {item.countLabel ?? "questions"}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
