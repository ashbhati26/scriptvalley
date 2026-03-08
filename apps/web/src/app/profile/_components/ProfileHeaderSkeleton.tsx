function ProfileHeaderSkeleton() {
  return (
    <div className="relative mb-8 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-input)] rounded-2xl p-8 border border-[var(--border-subtle)] overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="relative flex items-center gap-8">
        {/* Avatar skeleton */}
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--bg-hover)] rounded-full blur-xl" />
          <div className="w-24 h-24 rounded-full bg-[var(--bg-hover)] animate-pulse relative z-10 border-4 border-[var(--border-subtle)]" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--bg-hover)] rounded-full z-20 animate-pulse" />
        </div>

        {/* User info skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-48 bg-[var(--bg-hover)] rounded animate-pulse" />
          <div className="h-5 w-32 bg-[var(--bg-hover)] rounded animate-pulse" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group relative p-4 rounded-xl bg-[var(--bg-hover)]/60 border border-[var(--border-subtle)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[var(--bg-hover)] opacity-5" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-[var(--bg-hover)] rounded animate-pulse" />
                  <div className="h-8 w-16 bg-[var(--bg-hover)] rounded animate-pulse" />
                  <div className="h-4 w-32 bg-[var(--bg-hover)] rounded animate-pulse" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] animate-pulse" />
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2">
                <div className="h-4 w-4 bg-[var(--bg-hover)] rounded animate-pulse" />
                <div className="h-4 w-20 bg-[var(--bg-hover)] rounded animate-pulse" />
                <div className="h-4 w-16 bg-[var(--bg-hover)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileHeaderSkeleton;