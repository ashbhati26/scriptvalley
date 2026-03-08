"use client";

export default function NotesPageSkeleton() {
  return (
    <div className="min-h-screen mt-12 bg-[var(--bg-base)]" aria-hidden>

      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] sticky top-0 z-30 bg-[var(--bg-base)]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-[var(--bg-hover)] animate-pulse" />
          <div className="h-4 w-14 rounded bg-[var(--bg-input)] animate-pulse" />
        </div>
        <div className="h-3.5 w-28 rounded bg-[var(--bg-hover)] animate-pulse" />
      </div>

      <div className="grid grid-cols-12 gap-4 md:p-5 p-0 h-[calc(100vh-3rem)]">

        {/* Sidebar */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3">
          <div className="rounded-lg border border-[var(--border-subtle)] h-[82vh] overflow-hidden flex flex-col bg-[var(--bg-base)]">

            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
              <div className="h-4 w-20 rounded bg-[var(--bg-input)] animate-pulse" />
            </div>

            {/* Search */}
            <div className="px-3 py-2.5">
              <div className="h-8 w-full rounded-md bg-[var(--bg-hover)] animate-pulse" />
            </div>

            {/* Note rows */}
            <div className="flex-1 overflow-hidden px-1.5 pt-1 space-y-px">

              {/* Active note */}
              <div className="flex items-center px-2.5 py-2 rounded-md bg-[var(--bg-active)] animate-pulse">
                <div className="h-3.5 w-40 rounded bg-[var(--bg-hover)]" />
              </div>

              {/* Inactive notes */}
              {[
                { w: "w-48", delay: "60ms"  },
                { w: "w-32", delay: "120ms" },
                { w: "w-44", delay: "180ms" },
                { w: "w-36", delay: "240ms" },
                { w: "w-52", delay: "300ms" },
                { w: "w-40", delay: "360ms" },
                { w: "w-28", delay: "420ms" },
              ].map(({ w, delay }, i) => (
                <div
                  key={i}
                  className="flex items-center px-2.5 py-2 rounded-md animate-pulse"
                  style={{ animationDelay: delay }}
                >
                  <div className={`h-3.5 ${w} rounded bg-[var(--bg-hover)]`} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
              <div className="h-2.5 w-12 rounded bg-[var(--bg-hover)] animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="rounded-none md:rounded-lg border-0 md:border md:border-[var(--border-subtle)] h-[82vh] bg-[var(--bg-base)] flex flex-col overflow-hidden">

            {/* Note header */}
            <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b border-[var(--border-subtle)]">
              <div className="space-y-1.5 min-w-0">
                <div className="h-2 w-8 rounded bg-[var(--bg-hover)] animate-pulse" />
                <div className="h-4 w-56 rounded bg-[var(--bg-input)] animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 ml-4 shrink-0">
                <div className="h-7 w-14 rounded-md bg-[var(--bg-hover)] animate-pulse" />
                <div className="h-7 w-14 rounded-md bg-[var(--bg-hover)] animate-pulse" />
              </div>
            </div>

            {/* Toolbar placeholder */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-subtle)]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-md bg-[var(--bg-hover)] animate-pulse shrink-0"
                  style={{ animationDelay: `${i * 30}ms` }}
                />
              ))}
              <div className="h-6 w-px bg-[var(--border-subtle)] mx-1 shrink-0" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i + 10}
                  className="h-6 w-6 rounded-md bg-[var(--bg-hover)] animate-pulse shrink-0"
                  style={{ animationDelay: `${(i + 10) * 30}ms` }}
                />
              ))}
            </div>

            {/* Note body */}
            <div className="flex-1 px-7 md:px-14 py-8 space-y-3 overflow-hidden max-w-3xl">
              {/* Title line */}
              <div className="h-5 w-52 rounded bg-[var(--bg-hover)] animate-pulse mb-5" />
              {/* Paragraph lines */}
              {[
                { w: "w-full",  delay: "40ms"  },
                { w: "w-[93%]", delay: "80ms"  },
                { w: "w-[87%]", delay: "120ms" },
                { w: "w-3/4",   delay: "160ms" },
                { w: "w-full",  delay: "240ms" },
                { w: "w-[88%]", delay: "280ms" },
                { w: "w-[72%]", delay: "320ms" },
              ].map(({ w, delay }, i) => (
                <div
                  key={i}
                  className={`h-3.5 ${w} rounded bg-[var(--bg-input)] animate-pulse`}
                  style={{ animationDelay: delay }}
                />
              ))}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}