import { CardSkeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <CardSkeleton className="p-16" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(2)].map((_, i) => (
              <CardSkeleton key={i} className="p-8 h-72" />
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <CardSkeleton key={i} className="p-6 h-48" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
