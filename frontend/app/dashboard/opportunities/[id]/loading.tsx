import { CardSkeleton } from "@/components/ui/skeleton";

/**
 * Opportunity detail route loading (P12-WF, C11).
 * Skeleton placeholders — no full-section spinner (T222).
 */
export default function Loading() {
  return (
    <main className="page-container py-12">
      <div className="space-y-4" aria-live="polite">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </main>
  );
}
