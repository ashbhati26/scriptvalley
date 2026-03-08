"use client";

import React from "react";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BookmarkX, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type ProgressData = {
  total:  { completed: number; total: number };
  easy:   { completed: number; total: number };
  medium: { completed: number; total: number };
  hard:   { completed: number; total: number };
};
type Topic = { topic: string; questions: { title: string }[] };
type Props  = {
  id?: string; route?: string; sheetName?: string;
  progress: ProgressData; topics?: Topic[];
  onUnfollow?: (id?: string) => void;
};

// Semantic difficulty colors — intentionally hardcoded
const DIFF = [
  { key: "easy"   as const, label: "Easy",   color: "#22c55e" },
  { key: "medium" as const, label: "Medium", color: "#f59e0b" },
  { key: "hard"   as const, label: "Hard",   color: "#ef4444" },
];

function DiffBar({ label, completed, total, color }: { label: string; completed: number; total: number; color: string }) {
  const pct = Math.round((completed / Math.max(1, total)) * 100) || 0;
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
        <span className="text-[10px] text-[var(--text-disabled)]">
          {completed}<span className="text-[var(--text-disabled)] opacity-60">/{total}</span>
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-[var(--bg-hover)]">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function SheetProgress({ id, route, sheetName, progress, topics = [], onUnfollow }: Props) {
  const totalPct = Math.round((progress.total.completed / Math.max(1, progress.total.total)) * 100) || 0;

  const normalizedRoute = (() => {
    if (!route) return undefined;
    if (/^https?:\/\//i.test(route)) return route;
    return route.startsWith("/") ? route : `/${route}`;
  })();

  const handleUnfollow = () => {
    try {
      const raw = localStorage.getItem("followedSheets");
      const map = raw ? JSON.parse(raw) : {};
      if (id && map[id]) { delete map[id]; localStorage.setItem("followedSheets", JSON.stringify(map)); }
      window.dispatchEvent(new CustomEvent("dsa:follow-change", { detail: { id } }));
    } catch { /* noop */ }
    onUnfollow?.(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14 }}
      className="rounded-lg border border-[var(--border-subtle)] overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div>
          {sheetName && <p className="text-sm font-medium text-[var(--text-primary)]">{sheetName}</p>}
          <p className="text-[10px] text-[var(--text-disabled)] mt-0.5">{progress.total.completed} / {progress.total.total} completed</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUnfollow}
            className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-red-400/70 hover:bg-red-500/[0.06] transition-colors duration-100"
            title="Unfollow sheet"
          >
            <BookmarkX className="w-3.5 h-3.5" />
          </button>
          {normalizedRoute && (
            /^https?:\/\//i.test(normalizedRoute) ? (
              <a
                href={normalizedRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-xs font-medium transition-colors duration-100"
              >
                Access <ArrowRight className="w-3 h-3" />
              </a>
            ) : (
              <Link
                href={normalizedRoute}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-xs font-medium transition-colors duration-100"
              >
                Access <ArrowRight className="w-3 h-3" />
              </Link>
            )
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 bg-[var(--bg-base)] space-y-5">
        {/* Donut + diff bars */}
        <div className="flex items-center gap-5">
          <div className="w-[68px] h-[68px] shrink-0">
            <CircularProgressbar
              value={totalPct}
              text={`${totalPct}%`}
              styles={buildStyles({
                pathColor:  "#3A5EFF",
                textColor:  "var(--text-primary)"  as string,
                trailColor: "var(--bg-hover)"      as string,
                textSize:   "22px",
              })}
            />
          </div>

          <div className="hidden sm:block h-10 w-px bg-[var(--border-subtle)] shrink-0" />

          <div className="flex flex-1 flex-col sm:flex-row gap-4 min-w-0">
            {DIFF.map(({ key, label, color }) => (
              <DiffBar
                key={key}
                label={label}
                completed={progress[key].completed}
                total={progress[key].total}
                color={color}
              />
            ))}
          </div>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t, i) => (
                <span key={i} className="text-xs text-[var(--text-faint)] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-md px-2 py-0.5">
                  {t.topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}