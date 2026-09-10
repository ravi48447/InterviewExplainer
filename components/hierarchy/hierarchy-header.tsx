/**
 * hierarchy-header.tsx — Shared hierarchy page header (P05-T056..T067).
 *
 * A single header component used by domain, stack, pillar, and module pages.
 * Renders one H1, an optional supporting description, and optional metadata
 * badges. No decorative gradients, no icon walls, no competing CTAs
 * (P05-T084/T088/T116/T193).
 *
 * Server component — no client JS.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface HierarchyHeaderProps {
  /** The single H1 for the page (P05-T021/T104). */
  title: string;
  /** Supporting description shown under the H1. */
  description?: string;
  /** Optional metadata row (e.g. question count, stack count). */
  metadata?: ReactNode;
  /** Optional actions slot (CTA buttons), aligned right. */
  actions?: ReactNode;
  /** Visual variant: default (bordered) or surface (bg-surface). */
  variant?: "default" | "surface";
}

export function HierarchyHeader({
  title,
  description,
  metadata,
  actions,
  variant = "default",
}: HierarchyHeaderProps) {
  return (
    <header
      className={cn(
        "page-container py-14 sm:py-16",
        variant === "surface" && "bg-surface",
        variant === "default" && "border-b border-border/60 bg-background"
      )}
    >
      <div className="max-w-3xl">
        <h1 className="type-display text-foreground">{title}</h1>
        {description ? (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {description}
          </p>
        ) : null}
        {metadata ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {metadata}
          </div>
        ) : null}
        {actions ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
