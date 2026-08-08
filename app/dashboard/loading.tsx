import { CardSkeleton, ListSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div
      className="w-full min-w-0 px-6 lg:px-12 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="h-8 w-48 rounded-lg mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <ListSkeleton rows={4} className="lg:col-span-2 h-64 rounded-2xl border border-border bg-card p-4" />
        <CardSkeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
