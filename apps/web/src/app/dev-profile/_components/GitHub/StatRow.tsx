"use client";

import React from "react";

const ICONS: Record<string, string> = { Stars: "⭐", Commits: "📦", PRs: "🔀", Issues: "🐞" };

export default function StatRow({ label, value }: { icon?: React.ReactNode; label: string; value: number }) {
  const emoji = ICONS[label] ?? "⭐";
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-hover)] transition-colors duration-100">
      <span className="text-base shrink-0 opacity-60">{emoji}</span>
      <span className="text-xs text-[var(--text-muted)] flex-1">{label}</span>
      <span className="text-sm font-medium text-[var(--text-secondary)] tabular-nums">{value}</span>
    </div>
  );
}