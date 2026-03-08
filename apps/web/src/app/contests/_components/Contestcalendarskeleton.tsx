const ContestCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-[2px] bg-[var(--bg-hover)]" />
    <div className="p-4 pt-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 rounded-md bg-[var(--bg-hover)]" />
        <div className="h-5 w-16 rounded-md bg-[var(--bg-elevated)]" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-[var(--bg-hover)] rounded" />
        <div className="h-3.5 w-4/5 bg-[var(--bg-elevated)] rounded" />
      </div>
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--bg-hover)]" />
          <div className="h-2.5 w-40 rounded bg-[var(--bg-elevated)]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--bg-hover)]" />
          <div className="h-2.5 w-20 rounded bg-[var(--bg-elevated)]" />
        </div>
      </div>
      <div className="h-3 w-24 rounded bg-[var(--bg-hover)]" />
    </div>
  </div>
);

const MonthGroupSkeleton = ({ cardCount = 3, delay = 0 }: { cardCount?: number; delay?: number }) => (
  <div className="space-y-3" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center gap-3 animate-pulse" style={{ animationDelay: `${delay}ms` }}>
      <div className="h-2.5 w-24 rounded bg-[var(--bg-hover)]" />
      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      <div className="h-2.5 w-4 rounded bg-[var(--bg-hover)]" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[...Array(cardCount)].map((_, i) => (
        <ContestCardSkeleton key={i} delay={delay + i * 40} />
      ))}
    </div>
  </div>
);

export default function ContestCalendarSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8 mb-16 space-y-8">

        <div className="space-y-2">
          <div className="h-2.5 w-16 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--bg-hover)] animate-pulse" />
            <div className="h-7 w-48 rounded bg-[var(--bg-input)] animate-pulse" />
          </div>
          <div className="h-3.5 w-56 rounded bg-[var(--bg-elevated)] animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-2.5 w-16 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex flex-wrap gap-1.5">
            {[36, 72, 68, 88, 80, 64, 60].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ width: w, animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)]" />

        <div className="space-y-10">
          <MonthGroupSkeleton cardCount={3} delay={0}   />
          <MonthGroupSkeleton cardCount={3} delay={120} />
          <MonthGroupSkeleton cardCount={2} delay={240} />
        </div>

      </div>
    </div>
  );
}