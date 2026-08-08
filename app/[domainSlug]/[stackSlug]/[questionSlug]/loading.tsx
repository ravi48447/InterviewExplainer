export default function QuestionLoading() {
  return (
    <div className="w-full min-w-0 px-4 sm:px-6 py-12 animate-pulse">
      <div className="flex gap-12">
        <div className="hidden lg:block w-[220px] shrink-0">
          <div className="h-4 bg-muted rounded w-3/4 mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded mb-3" />
          ))}
        </div>
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-24 mb-4" />
          <div className="h-10 bg-muted rounded w-3/4 mb-6" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
            ))}
          </div>
          <div className="mt-8 h-48 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
