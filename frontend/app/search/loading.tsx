import { TextSkeleton, ListSkeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-surface pt-12 px-6">
      <div className="w-full min-w-0 space-y-6" aria-hidden="true">
        {/* Heading + subtitle skeleton */}
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="h-10 w-2/3 mx-auto rounded-lg bg-muted animate-pulse" />
          <TextSkeleton lines={2} className="max-w-md mx-auto" />
        </div>

        {/* Search input skeleton */}
        <div className="mx-auto max-w-2xl">
          <div className="h-12 w-full rounded-lg border border-border bg-card animate-pulse" />
        </div>

        {/* Popular search chips skeleton */}
        <div className="mx-auto max-w-2xl">
          <div className="h-3 w-32 mb-3 rounded bg-muted animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Quick links list skeleton */}
        <div className="mx-auto max-w-2xl">
          <ListSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}
