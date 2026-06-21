export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 pt-12 px-6 animate-pulse">
      <div className="w-full min-w-0 space-y-6">
        <div className="h-20 bg-white/60 rounded-2xl border border-slate-200 mx-auto max-w-md" />
        <div className="h-16 bg-white/60 rounded-2xl border border-slate-200" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/60 rounded-xl border border-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
