const CourseCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-[200px] overflow-hidden animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-[2px] w-full bg-[var(--bg-hover)]" />
    <div className="p-4 pt-3 flex flex-col gap-2.5 h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3.5 w-3/4 bg-[var(--bg-hover)] rounded" />
          <div className="h-5 w-20 bg-[var(--bg-elevated)] rounded-md" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] shrink-0" />
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-[var(--bg-elevated)] rounded" />
        <div className="h-2.5 w-4/5 bg-[var(--bg-elevated)] rounded" />
      </div>
      <div className="mt-auto pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between">
        <div className="h-3 w-24 bg-[var(--bg-elevated)] rounded" />
        <div className="h-3 w-20 bg-[var(--bg-elevated)] rounded" />
      </div>
    </div>
  </div>
);

export default function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <div className="h-2.5 w-12 bg-[var(--bg-hover)] rounded animate-pulse" />
          <div className="h-7 w-32 bg-[var(--bg-input)] rounded animate-pulse" />
          <div className="h-3.5 w-80 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>
        {/* Search */}
        <div className="mb-8">
          <div className="h-9 w-full rounded-md bg-[var(--bg-input)] animate-pulse" />
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} delay={i * 50} />
          ))}
        </div>
      </div>
    </div>
  );
}