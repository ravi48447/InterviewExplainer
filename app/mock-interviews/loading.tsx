export default function Loading() {
  return (
    <div className="min-h-screen bg-[#121110] py-12 px-6 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="h-8 w-40 bg-[#1a1917] rounded" />
        <div className="h-4 w-64 bg-[#141311] rounded" />
        <div className="space-y-4 pt-8">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 bg-[#141311] border border-[#1f1d18] rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
