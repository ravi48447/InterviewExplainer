import { CardSkeleton, ListSkeleton } from "@/components/ui/skeleton";

/**
 * Community route loading — layout-preserving skeleton.
 */
export default function Loading() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <CardSkeleton className="mx-auto max-w-md" />
      </div>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <ListSkeleton rows={6} />
      </div>
    </main>
  );
}
