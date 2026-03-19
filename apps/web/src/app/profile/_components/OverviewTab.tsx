"use client";

// Place at: app/(main)/dev-profile/_components/OverviewTab.tsx

import { CheckSquare, BookOpen, Layers } from "lucide-react";
import StatCard from "./StatCard";

interface Props {
  totalSolved:   number;
  easySolved:    number;
  medSolved:     number;
  hardSolved:    number;
  totalLessons:  number;
  coursesInProg: number;
}

function DiffPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ color, background: `${color}12`, borderColor: `${color}30` }}
    >
      {label} <span className="tabular-nums">{count}</span>
    </span>
  );
}

export default function OverviewTab({
  totalSolved, easySolved, medSolved, hardSolved,
  totalLessons, coursesInProg,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          At a glance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="DSA Solved"
            value={totalSolved}
            sub="questions attempted"
            icon={CheckSquare}
            color="#22c55e"
            delay={0}
          />
          <StatCard
            label="Lessons Done"
            value={totalLessons}
            sub="across all courses"
            icon={BookOpen}
            color="#3A5EFF"
            delay={0.04}
          />
          <StatCard
            label="Courses"
            value={coursesInProg}
            sub="in progress"
            icon={Layers}
            color="#8b5cf6"
            delay={0.08}
          />
        </div>
      </div>

      {/* DSA difficulty breakdown */}
      {totalSolved > 0 && (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
            DSA by difficulty
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <DiffPill label="Easy"   count={easySolved} color="#22c55e" />
            <DiffPill label="Medium" count={medSolved}  color="#f59e0b" />
            <DiffPill label="Hard"   count={hardSolved} color="#ef4444" />
          </div>
          {/* Stacked progress bar */}
          <div className="h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden flex">
            <div
              className="h-full bg-[#22c55e] transition-all duration-500"
              style={{ width: `${(easySolved / totalSolved) * 100}%` }}
            />
            <div
              className="h-full bg-[#f59e0b] transition-all duration-500"
              style={{ width: `${(medSolved  / totalSolved) * 100}%` }}
            />
            <div
              className="h-full bg-[#ef4444] transition-all duration-500"
              style={{ width: `${(hardSolved / totalSolved) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalSolved === 0 && totalLessons === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-[var(--text-faint)]">No activity yet</p>
          <p className="text-xs text-[var(--text-disabled)] mt-1">
            Start solving DSA problems or completing lessons to see stats here.
          </p>
        </div>
      )}
    </div>
  );
}