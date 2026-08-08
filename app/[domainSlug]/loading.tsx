import { CardSkeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function DomainLoading() {
  return (
    <div className="page-container">
      <div className="mb-6 space-y-3">
        <TextSkeleton lines={2} className="max-w-xl" />
      </div>
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
