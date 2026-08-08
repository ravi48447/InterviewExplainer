/**
 * continue-prep.tsx — "Continue where you left off" (P09-WC, T061..T100).
 *
 * Renders the user's in-progress questions so they can resume immediately.
 * Falls back gracefully to an empty hint when there is nothing to resume.
 */

import Link from "next/link";
import { Clock, Play, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ContinuePrepItem } from "@/lib/dashboard";

export interface ContinuePrepProps {
  items: ContinuePrepItem[];
}

export function ContinuePrep({ items }: ContinuePrepProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Continue where you left off</h2>
        <p className="text-sm text-muted-foreground">
          Questions you start will show up here so you can resume instantly.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Continue where you left off</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.questionId}
            href={`/${item.domainSlug}/${item.stackSlug}/${item.slug}`}
            className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-ring transition-all"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={`difficulty-${item.difficulty}`}>{item.difficulty}</Badge>
                {item.estimatedReadTime > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.estimatedReadTime}m
                  </span>
                )}
                {item.progress != null && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(item.progress * 100)}% done
                  </span>
                )}
              </div>
            </div>
            <span className="flex items-center gap-1 text-primary shrink-0">
              <Play className="h-4 w-4" />
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
