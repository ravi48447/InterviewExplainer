import { CardSkeleton } from "@/components/ui/skeleton";

/**
 * Question detail route loading — skeleton matching the page layout.
 */
export default function Loading() {
  return (
    <main className="page-container py-12 space-y-4">
      <CardSkeleton className="p-6" />
      <CardSkeleton className="p-6" />
      <CardSkeleton className="p-5" />
    </main>
  );
}
