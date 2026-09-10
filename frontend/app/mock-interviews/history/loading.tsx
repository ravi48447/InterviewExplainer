import { CardSkeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="page-container py-16">
      <div className="max-w-2xl mx-auto">
        <CardSkeleton className="p-8 min-h-[300px]" />
      </div>
    </div>
  );
}
