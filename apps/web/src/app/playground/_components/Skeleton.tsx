import { Terminal } from "lucide-react";

// ── Running code skeleton (inside output panel) ───────────────────────────────
const RunningCodeSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[0.75, 0.5, 0.85, 0.6, 0.9, 0.55].map((w, i) => (
      <div
        key={i}
        className="h-3 rounded bg-[var(--bg-hover)]"
        style={{ width: `${w * 100}%`, animationDelay: `${i * 60}ms` }}
      />
    ))}
  </div>
);

export default RunningCodeSkeleton;

// ── Editor panel skeleton ────────────────────────────────────────────────────
export function EditorPanelSkeleton() {
  return (
    <div className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[var(--bg-hover)]" />
          <div className="hidden md:flex flex-col gap-1.5">
            <div className="h-2 w-8 rounded bg-[var(--bg-hover)]" />
            <div className="h-3 w-20 rounded bg-[var(--bg-input)]" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-8 w-24 rounded-md bg-[var(--bg-hover)]" />
          <div className="h-8 w-24 rounded-md bg-[var(--bg-hover)]" />
          <div className="w-px h-5 bg-[var(--border-subtle)] mx-1" />
          <div className="h-8 w-7 rounded-md bg-[var(--bg-hover)]" />
          <div className="h-8 w-7 rounded-md bg-[var(--bg-hover)]" />
          <div className="h-8 w-7 rounded-md bg-[var(--bg-hover)]" />
          <div className="w-px h-5 bg-[var(--border-subtle)] mx-1" />
          {/* Run button placeholder — brand color hint, intentionally hardcoded */}
          <div className="h-8 w-16 rounded-md bg-[#3A5EFF]/20" />
        </div>
      </div>

      {/* Editor lines */}
      <div className="p-6 space-y-3">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-7 h-3 rounded bg-[var(--bg-elevated)] shrink-0" />
            <div
              className="h-3 rounded bg-[var(--bg-elevated)]"
              style={{ width: `${Math.max(15, (i % 7) * 12 + 15)}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Output panel skeleton ────────────────────────────────────────────────────
export function OutputPanelSkeleton() {
  return (
    <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg animate-pulse overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-medium)]" />
          <Terminal className="w-3.5 h-3.5 text-[var(--text-disabled)]" />
          <div className="h-3 w-12 rounded bg-[var(--bg-hover)]" />
        </div>
        <div className="h-6 w-14 rounded-md bg-[var(--bg-hover)]" />
      </div>
      <div className="h-[220px] p-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 mx-auto rounded-md bg-[var(--bg-hover)]" />
          <div className="h-3 w-32 mx-auto rounded bg-[var(--bg-hover)]" />
        </div>
      </div>
    </div>
  );
}

// ── Combined view skeleton ────────────────────────────────────────────────────
export function EditorViewSkeleton() {
  return (
    <div className="space-y-4 p-4 mt-12">
      <EditorPanelSkeleton />
      <OutputPanelSkeleton />
    </div>
  );
}