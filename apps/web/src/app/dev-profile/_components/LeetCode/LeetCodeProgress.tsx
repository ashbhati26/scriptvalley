"use client";

import React from "react";
import LeetCodePieChart from "./LeetCodePieChart";

type Props = {
  easy: number; medium: number; hard: number;
  total?: number; className?: string; showLabels?: boolean;
};

// Semantic difficulty colors — intentionally hardcoded
const DIFF = [
  { key: "easy"   as const, label: "Easy",   color: "#22c55e" },
  { key: "medium" as const, label: "Medium", color: "#f59e0b" },
  { key: "hard"   as const, label: "Hard",   color: "#ef4444" },
];

export default function LeetCodeProgress({ easy, medium, hard, total, className = "", showLabels = true }: Props) {
  const vals = { easy, medium, hard };
  const sum  = easy + medium + hard;

  return (
    <div className={`flex items-center gap-5 w-full ${className}`}>
      {/* Pie chart */}
      <div className="shrink-0">
        <LeetCodePieChart
          data={{ easySolved: easy, mediumSolved: medium, hardSolved: hard }}
          totalOverride={typeof total !== "undefined" ? total : undefined}
        />
      </div>

      <div className="hidden sm:block h-16 w-px bg-[var(--border-subtle)] shrink-0" />

      {/* Diff bars */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {DIFF.map(({ key, label, color }) => {
          const pct = Math.round((vals[key] / Math.max(1, sum)) * 100) || 0;
          return (
            <div key={key} className="flex items-center gap-3 min-w-0">
              {showLabels && (
                <span className="text-[10px] uppercase tracking-widest w-11 shrink-0" style={{ color }}>
                  {label}
                </span>
              )}
              <div className="flex-1 h-1 rounded-full bg-[var(--bg-hover)] min-w-0">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)] w-5 text-right shrink-0 tabular-nums">
                {vals[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}