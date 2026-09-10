export default function Loading() {
  return (
    <div className="min-h-screen bg-background py-12 px-6 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-4 w-64 bg-surface rounded" />
        <div className="space-y-4 pt-8">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 bg-surface border border-border rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
