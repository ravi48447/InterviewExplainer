export default function InterviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 p-6 animate-pulse">
      <div className="flex w-full min-w-0 gap-6">
        <div className="hidden lg:block w-[280px] shrink-0 space-y-4">
          <div className="h-40 bg-background/60 rounded-xl border border-border" />
          <div className="h-32 bg-background/60 rounded-xl border border-border" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-44 bg-background/60 rounded-xl border border-border" />
          <div className="h-24 bg-background/60 rounded-xl border border-border" />
          <div className="h-24 bg-background/60 rounded-xl border border-border" />
          <div className="h-24 bg-background/60 rounded-xl border border-border" />
        </div>
      </div>
    </div>
  );
}
