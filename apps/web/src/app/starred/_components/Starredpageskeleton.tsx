const QuestionRowSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border-default)] animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-3.5 h-3.5 rounded-sm bg-[var(--bg-hover)] shrink-0" />
    <div className="flex-1 h-3.5 rounded bg-[var(--bg-input)]" style={{ maxWidth: `${55 + (delay % 5) * 8}%` }} />
    <div className="w-6 h-6 rounded-md bg-[var(--bg-hover)] shrink-0" />
    <div className="w-6 h-6 rounded-md bg-[var(--bg-hover)] shrink-0" />
    <div className="w-6 h-6 rounded-md bg-[var(--bg-hover)] shrink-0" />
    <div className="w-12 h-5 rounded-md bg-[var(--bg-hover)] shrink-0" />
  </div>
);

export default function StarredPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8 mb-16 space-y-8">

        {/* Page header */}
        <div className="space-y-2">
          <div className="h-2.5 w-8 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--bg-hover)] animate-pulse" />
            <div className="h-7 w-48 rounded bg-[var(--bg-input)] animate-pulse" />
          </div>
          <div className="h-3.5 w-40 rounded bg-[var(--bg-elevated)] animate-pulse" />
        </div>

        {/* Sheet filter group */}
        <div className="space-y-2">
          <div className="h-2.5 w-10 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex flex-wrap gap-1.5">
            {[36, 80, 96, 72, 60].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ width: w, animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Topic filter group */}
        <div className="space-y-2">
          <div className="h-2.5 w-10 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex flex-wrap gap-1.5">
            {[36, 56, 72, 64, 80, 48, 60].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-md bg-[var(--bg-elevated)] animate-pulse"
                style={{ width: w, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* Question list */}
        <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
          {/* Column header */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--bg-input)] border-b border-[var(--border-default)] animate-pulse">
            <div className="flex-1 h-2.5 w-16 rounded bg-[var(--bg-hover)]" />
            {[48, 36, 28, 52].map((w, i) => (
              <div key={i} className="h-2.5 rounded bg-[var(--bg-hover)] shrink-0" style={{ width: w }} />
            ))}
          </div>

          {/* Rows */}
          {[0, 60, 120, 180, 240, 300, 360, 420].map((delay) => (
            <QuestionRowSkeleton key={delay} delay={delay} />
          ))}
        </div>

      </div>
    </div>
  );
}