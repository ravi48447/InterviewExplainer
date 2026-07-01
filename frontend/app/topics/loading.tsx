export default function TopicsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 py-12 px-6 animate-pulse">
      <div className="w-full min-w-0 space-y-6">
        <div className="h-44 bg-background/60 rounded-2xl border border-border" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-40 bg-background/60 rounded-xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
