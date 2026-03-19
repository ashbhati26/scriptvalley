export default function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 mt-8 space-y-8 animate-pulse">

      {/* Page header */}
      <div className="space-y-2">
        <div className="h-2.5 w-12 bg-[var(--bg-hover)] rounded" />
        <div className="h-7 w-28 bg-[var(--bg-input)] rounded" />
      </div>

      {/* Identity card */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-input)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--bg-hover)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 bg-[var(--bg-hover)] rounded" />
            <div className="h-3 w-48 bg-[var(--bg-elevated)] rounded" />
            <div className="h-5 w-16 bg-[var(--bg-elevated)] rounded-full" />
          </div>
          <div className="h-7 w-24 bg-[var(--bg-hover)] rounded-lg shrink-0" />
        </div>
        {/* Property rows */}
        <div className="px-5 py-4 space-y-3">
          {[120, 160, 100, 140, 180].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-2.5 w-28 bg-[var(--bg-hover)] rounded shrink-0" />
              <div className="h-3 bg-[var(--bg-elevated)] rounded" style={{ width: w }} />
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-px p-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] w-fit">
        <div className="h-7 w-24 rounded-md bg-[var(--bg-hover)]" />
        <div className="h-7 w-28 rounded-md bg-[var(--bg-elevated)]" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-16 bg-[var(--bg-hover)] rounded" />
              <div className="w-6 h-6 bg-[var(--bg-hover)] rounded-md" />
            </div>
            <div className="h-7 w-10 bg-[var(--bg-input)] rounded" />
            <div className="h-2 w-20 bg-[var(--bg-elevated)] rounded" />
          </div>
        ))}
      </div>

    </div>
  );
}