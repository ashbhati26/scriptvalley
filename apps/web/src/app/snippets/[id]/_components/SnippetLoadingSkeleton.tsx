function SnippetLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="max-w-4xl mx-auto mt-20 px-4 sm:px-6 pb-16">
        <div className="space-y-4">

          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-5 sm:p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-[var(--bg-hover)] shrink-0" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-[var(--bg-hover)] rounded" />
                  <div className="flex gap-3">
                    <div className="h-3 w-20 bg-[var(--bg-elevated)] rounded" />
                    <div className="h-3 w-16 bg-[var(--bg-elevated)] rounded" />
                    <div className="h-3 w-18 bg-[var(--bg-elevated)] rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-7 w-20 bg-[var(--bg-hover)] rounded-md" />
                <div className="h-7 w-16 bg-[var(--bg-hover)] rounded-md" />
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] animate-pulse">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
              <div className="h-3 w-20 bg-[var(--bg-hover)] rounded" />
              <div className="h-6 w-6 bg-[var(--bg-hover)] rounded" />
            </div>
            <div className="h-[520px] bg-[var(--bg-elevated)]" />
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse">
            <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
              <div className="h-4 w-32 bg-[var(--bg-hover)] rounded" />
            </div>
            <div className="p-5 space-y-6">
              <div className="rounded-md border border-[var(--border-subtle)] h-[140px] bg-[var(--bg-elevated)]" />

              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 bg-[var(--bg-hover)] rounded" />
                    <div className="h-3 w-full bg-[var(--bg-elevated)] rounded" />
                    <div className="h-3 w-3/4 bg-[var(--bg-elevated)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SnippetLoadingSkeleton;