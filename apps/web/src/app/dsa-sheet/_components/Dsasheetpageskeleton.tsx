const TopicRowSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-input)]">
      <div className="flex items-center gap-2.5">
        <div className="w-3.5 h-3.5 rounded bg-[var(--bg-hover)]" />
        <div className="w-8 h-2.5 rounded bg-[var(--bg-hover)]" />
        <div className="w-32 h-3.5 rounded bg-[var(--bg-input)]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-2.5 rounded bg-[var(--bg-hover)]" />
        <div className="w-32 h-1 rounded-full bg-[var(--bg-hover)]" />
        <div className="w-6 h-2.5 rounded bg-[var(--bg-hover)]" />
      </div>
    </div>
  </div>
);

export default function DSASheetPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 mt-14 mb-16 space-y-8">

        {/* Sheet header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-2.5 w-16 bg-[var(--bg-hover)] rounded animate-pulse" />
            <div className="h-7 w-64 bg-[var(--bg-input)] rounded animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-[var(--bg-elevated)] rounded animate-pulse" />
              <div className="h-3.5 w-4/5 bg-[var(--bg-elevated)] rounded animate-pulse" />
            </div>
          </div>
          {/* Note block */}
          <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-disabled)]" />
              <div className="h-2.5 w-8 rounded bg-[var(--bg-hover)]" />
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="h-3 w-full bg-[var(--bg-elevated)] rounded" />
              <div className="h-3 w-3/4 bg-[var(--bg-elevated)] rounded" />
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse">
          <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
            <div className="h-2.5 w-24 rounded bg-[var(--bg-hover)]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-5">
            {/* Donut */}
            <div className="w-[88px] h-[88px] rounded-full border-4 border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0" />
            <div className="hidden sm:block h-16 w-px bg-[var(--border-subtle)]" />
            {/* Bars */}
            <div className="flex flex-col sm:flex-row flex-1 gap-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-10 rounded bg-[var(--bg-hover)]" />
                    <div className="h-3 w-8 rounded bg-[var(--bg-elevated)]" />
                  </div>
                  <div className="h-1 w-full rounded-full bg-[var(--bg-hover)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics covered chips */}
        <div className="space-y-2">
          <div className="h-2.5 w-24 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex flex-wrap gap-1.5">
            {[64, 80, 56, 96, 72, 60, 88].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ width: w, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Filter tabs + count */}
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-1 py-1 gap-px animate-pulse">
            {[36, 40, 52, 36].map((w, i) => (
              <div key={i} className="h-7 rounded-md bg-[var(--bg-hover)]" style={{ width: w }} />
            ))}
          </div>
          <div className="h-2.5 w-6 rounded bg-[var(--bg-hover)] animate-pulse" />
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* Topic rows */}
        <div className="space-y-2">
          {[0, 80, 160, 240, 320, 400].map((delay) => (
            <TopicRowSkeleton key={delay} delay={delay} />
          ))}
        </div>

      </div>
    </div>
  );
}