const CardSkeleton = () => (
  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden h-[200px] animate-pulse">
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--bg-hover)]" />
          <div className="space-y-1.5">
            <div className="w-16 h-2.5 bg-[var(--bg-hover)] rounded" />
            <div className="w-20 h-2 bg-[var(--bg-elevated)] rounded" />
          </div>
        </div>
        <div className="w-12 h-6 bg-[var(--bg-hover)] rounded-md" />
      </div>

      <div className="space-y-1.5">
        <div className="w-3/4 h-3.5 bg-[var(--bg-hover)] rounded" />
        <div className="w-1/3 h-2.5 bg-[var(--bg-elevated)] rounded" />
      </div>

      <div className="rounded-md bg-[var(--bg-base)] border border-[var(--border-subtle)] p-3 space-y-2">
        <div className="w-full h-2.5 bg-[var(--bg-elevated)] rounded" />
        <div className="w-3/4 h-2.5 bg-[var(--bg-elevated)] rounded" />
        <div className="w-1/2 h-2.5 bg-[var(--bg-elevated)] rounded" />
      </div>
    </div>
  </div>
);

export default function SnippetsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8">

        <div className="mb-10 space-y-2">
          <div className="w-12 h-2.5 bg-[var(--bg-hover)] rounded animate-pulse" />
          <div className="w-40 h-6 bg-[var(--bg-input)] rounded animate-pulse" />
          <div className="w-72 h-3.5 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>

        <div className="flex items-center mb-8">
          <div className="inline-flex rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-1 py-1 gap-px animate-pulse">
            {[56, 52, 44].map((w, i) => (
              <div key={i} className="h-7 rounded-md bg-[var(--bg-hover)]" style={{ width: w }} />
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <div className="h-9 w-full rounded-md bg-[var(--bg-input)] animate-pulse" />
          <div className="flex gap-2">
            <div className="w-10 h-2.5 rounded bg-[var(--bg-elevated)] animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}