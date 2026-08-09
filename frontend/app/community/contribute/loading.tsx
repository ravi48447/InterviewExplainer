import { CardSkeleton } from "@/components/ui/skeleton";

/**
 * Contribution route loading — skeleton matching the form layout.
 */
export default function Loading() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <CardSkeleton className="mx-auto max-w-md" />
      </div>
      <div className="max-w-2xl mx-auto">
        <CardSkeleton className="p-6" />
      </div>
    </main>
  );
}
