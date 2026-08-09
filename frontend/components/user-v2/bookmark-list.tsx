/**
 * bookmark-list.tsx — Bookmark list display (P08-WD, T141..T180).
 *
 * Renders the user's saved questions. Guest bookmarks show IDs only when
 * metadata isn't available; authenticated bookmarks resolve to full rows
 * via fetchBookmarks(). Used on /account and /profile.
 */

"use client";

import Link from "next/link";
import { Bookmark, Clock, ArrowRight, BookmarkX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { useBookmarks } from "@/lib/user";
import type { BookmarkEntry } from "@/lib/user";
import type { Difficulty } from "@/lib/api";

export interface BookmarkListProps {
  isAuthenticated: boolean;
  /** Resolved bookmark entries (for authenticated users). */
  entries?: BookmarkEntry[];
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const DIFFICULTY_BADGE: Record<Difficulty, BadgeVariant> = {
  easy: "difficulty-easy",
  medium: "difficulty-medium",
  hard: "difficulty-hard",
};

export function BookmarkList({ isAuthenticated, entries = [] }: BookmarkListProps) {
  const { bookmarkIds, ready } = useBookmarks(isAuthenticated);

  if (!ready) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (bookmarkIds.length === 0) {
    return (
      <div className="text-center py-10 rounded-lg border border-border bg-card">
        <BookmarkX className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground font-semibold">No bookmarks yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Save questions by tapping the bookmark icon on any question page.
        </p>
      </div>
    );
  }

  // Authenticated: render resolved entries.
  if (isAuthenticated && entries.length > 0) {
    return (
      <div className="space-y-2">
        {entries.map((entry) => (
          <Link
            key={entry.questionId}
            href={`/${entry.domainSlug}/${entry.stackSlug}/${entry.slug}`}
            className="group flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-ring transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Bookmark className="h-3.5 w-3.5 text-primary shrink-0" />
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                  {entry.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={DIFFICULTY_BADGE[entry.difficulty] ?? "default"}>
                  {entry.difficulty}
                </Badge>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    );
  }

  // Guest: show count + hint to log in for full metadata.
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        You have {bookmarkIds.length} bookmarked question{bookmarkIds.length !== 1 ? "s" : ""}.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Log in to view your saved questions
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
