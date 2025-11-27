export default function ProductSkeletonGrid({ count = 8 }) {
  if (count <= 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 animate-pulse">
          <div className="h-40 rounded-xl bg-slate-800 mb-3" />
          <div className="h-3 w-3/4 rounded-full bg-slate-800 mb-2" />
          <div className="h-3 w-1/2 rounded-full bg-slate-800 mb-4" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-12 rounded-full bg-slate-800" />
            <div className="h-8 w-20 rounded-full bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
