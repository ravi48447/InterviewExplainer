/**
 * daily-prep.tsx — Daily recommended queue (P09-WD, T101..T140).
 *
 * The "prep for today" card. Shows a small set of recommended questions
 * with the reasoning label so the user knows why each was picked.
 */

import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DailyQueue } from "@/lib/dashboard";

export interface DailyPrepProps {
  queue: DailyQueue;
}

export function DailyPrep({ queue }: DailyPrepProps) {
  if (queue.items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Today&apos;s prep</h2>
        <span className="text-xs text-muted-foreground ml-auto">{queue.date}</span>
      </div>
      <div className="space-y-2">
        {queue.items.map((item) => (
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
                {item.reason && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    {item.reason}
                  </span>
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
