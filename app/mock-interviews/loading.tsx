import { CardSkeleton } from "@/components/ui/skeleton";

export default function MockInterviewsLoading() {
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="w-full min-w-0 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card text-primary text-xs font-bold rounded-full border border-border">
            <div className="h-3.5 w-3.5 bg-primary/30 rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
          <div className="h-10 w-80 bg-muted rounded mx-auto" />
          <div className="h-4 w-96 bg-muted rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} className="p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} className="p-6" />
          ))}
        </div>
      </div>
    </div>
  );
}
