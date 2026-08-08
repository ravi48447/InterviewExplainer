/**
 * recommendations.tsx — Personalized recommendations (P09-WG, T181..T220).
 *
 * Renders the recommendation set with reason labels so the user understands
 * why each question was suggested (weak area, next in track, etc.).
 */

import Link from "next/link";
import { ArrowRight, Lightbulb, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecommendationSet } from "@/lib/dashboard";

export interface RecommendationsProps {
  set: RecommendationSet;
}

export function Recommendations({ set }: RecommendationsProps) {
  if (set.items.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Recommended for you</h2>
      </div>
      <div className="space-y-2">
        {set.items.map((item) => (
          <Link
            key={item.questionId}
            href={`/${item.domainSlug}/${item.stackSlug}/${item.slug}`}
            className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-ring transition-all"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant={`difficulty-${item.difficulty}`}>{item.difficulty}</Badge>
                {item.estimatedReadTime > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.estimatedReadTime}m
                  </span>
                )}
                {item.reasonLabel && (
                  <span className="text-xs text-muted-foreground">{item.reasonLabel}</span>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
