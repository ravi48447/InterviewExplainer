import { CardSkeleton } from "@/components/ui/skeleton";

export default function StartLoading() {
  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="h-8 w-64 bg-muted rounded mx-auto" />
          <div className="h-4 w-96 bg-muted rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} className="p-4 h-28" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardSkeleton className="h-10" />
          <CardSkeleton className="h-10" />
        </div>
      </div>
    </div>
  );
}
