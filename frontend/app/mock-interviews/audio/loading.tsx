import { CardSkeleton } from "@/components/ui/skeleton";

export default function AudioLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <CardSkeleton className="p-8" />
        <CardSkeleton className="p-4" />
      </div>
    </div>
  );
}
