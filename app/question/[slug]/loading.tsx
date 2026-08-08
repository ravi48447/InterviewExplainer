import { CardSkeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function QuestionLoading() {
  return (
    <div className="page-container py-12">
      <TextSkeleton lines={1} className="w-24 mb-6" />
      <div className="h-10 bg-muted rounded animate-pulse w-3/4 mb-6" />
      <TextSkeleton lines={6} />
      <CardSkeleton className="h-48 mt-8" />
    </div>
  );
}
