const DSACardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-[200px] overflow-hidden animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Top accent line */}
    <div className="h-[2px] w-1/3 bg-[var(--bg-hover)]" />
    <div className="p-4 pt-3 flex flex-col gap-2.5 h-full">
      {/* Name + badge + pct */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3.5 w-3/4 bg-[var(--bg-hover)] rounded" />
          <div className="h-5 w-20 bg-[var(--bg-elevated)] rounded-md" />
        </div>
        <div className="h-5 w-8 bg-[var(--bg-elevated)] rounded shrink-0" />
      </div>
      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-[var(--bg-elevated)] rounded" />
        <div className="h-2.5 w-4/5 bg-[var(--bg-elevated)] rounded" />
      </div>
      {/* Footer */}
      <div className="mt-auto pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between">
        <div className="h-3 w-24 bg-[var(--bg-elevated)] rounded" />
        <div className="flex gap-1.5">
          <div className="h-6 w-16 bg-[var(--bg-elevated)] rounded-md" />
          <div className="h-6 w-12 bg-[var(--bg-elevated)] rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

export default function DSASheetExploreSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8">

        {/* Page header */}
        <div className="mb-10 space-y-2">
          <div className="h-2.5 w-12 bg-[var(--bg-hover)] rounded animate-pulse" />
          <div className="h-7 w-36 bg-[var(--bg-input)] rounded animate-pulse" />
          <div className="h-3.5 w-72 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>

        {/* Filter switcher */}
        <div className="flex items-center mb-8">
          <div className="inline-flex rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-1 py-1 gap-px animate-pulse">
            <div className="h-7 w-20 rounded-md bg-[var(--bg-hover)]" />
            <div className="h-7 w-16 rounded-md bg-[var(--bg-elevated)]" />
          </div>
        </div>

        {/* Search + chips */}
        <div className="mb-8 space-y-3">
          <div className="h-9 w-full rounded-md bg-[var(--bg-input)] animate-pulse" />
          <div className="flex flex-wrap gap-2 items-center">
            <div className="h-2.5 w-10 rounded bg-[var(--bg-elevated)] animate-pulse" />
            {[48, 72, 60, 80, 56].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ width: w, animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <DSACardSkeleton key={i} delay={i * 50} />
          ))}
        </div>
      </div>
    </div>
  );
}