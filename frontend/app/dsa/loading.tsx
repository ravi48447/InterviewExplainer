export default function DSALoading() {
  return (
    <div className="min-h-screen bg-surface py-8 px-6">
      <div className="w-full min-w-0 space-y-6 animate-pulse">
        {/* breadcrumb */}
        <div className="h-4 w-48 bg-slate-200 rounded" />
        {/* hero */}
        <div className="h-44 bg-slate-200 rounded-xl" />
        {/* module cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-background border border-border rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
