import { CardSkeleton } from "@/components/ui/skeleton";

/**
 * Company intelligence route loading — skeleton matching the page layout.
 */
export default function Loading() {
  return (
    <main className="page-container py-12 space-y-4">
      <CardSkeleton className="p-6" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </main>
  );
}
