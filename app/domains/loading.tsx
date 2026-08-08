import { CardSkeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function DomainsLoading() {
  return (
    <div className="w-full min-w-0 px-6 py-10 space-y-8">
      <TextSkeleton lines={2} className="max-w-md mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
