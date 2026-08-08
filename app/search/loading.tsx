export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 pt-12 px-6 animate-pulse">
      <div className="w-full min-w-0 space-y-6">
        <div className="h-20 bg-background/60 rounded-2xl border border-border mx-auto max-w-md" />
        <div className="h-16 bg-background/60 rounded-2xl border border-border" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-background/60 rounded-xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
