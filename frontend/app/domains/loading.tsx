export default function DomainsLoading() {
  return (
    <div className="w-full min-w-0 px-6 py-10 animate-pulse">
      <div className="h-10 w-64 bg-muted rounded-lg mb-4 mx-auto" />
      <div className="h-5 w-96 bg-muted rounded mb-10 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
