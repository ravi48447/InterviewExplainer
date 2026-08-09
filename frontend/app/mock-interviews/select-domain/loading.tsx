import { CardSkeleton } from "@/components/ui/skeleton";

export default function SelectDomainLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <CardSkeleton className="p-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} className="p-6 h-40" />
          ))}
        </div>
      </div>
    </div>
  );
}
