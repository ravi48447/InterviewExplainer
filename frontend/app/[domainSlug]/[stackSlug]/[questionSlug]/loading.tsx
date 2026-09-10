import { CardSkeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function QuestionLoading() {
  return (
    <div className="page-container py-12">
      <div className="flex gap-12">
        <div className="hidden lg:block w-[220px] shrink-0 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="flex-1 space-y-6">
          <TextSkeleton lines={1} className="w-24" />
          <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
          <TextSkeleton lines={6} />
          <CardSkeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}
