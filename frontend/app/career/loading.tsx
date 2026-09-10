export default function CareerLoading() {
  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 py-12 px-6 animate-pulse">
      <div className="w-full min-w-0 space-y-6">
        <div className="h-44 bg-background/60 rounded-2xl border border-border" />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-background/60 rounded-xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
