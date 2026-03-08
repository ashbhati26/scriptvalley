"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Mail, BookOpen, CheckCircle2, Circle } from "lucide-react";

interface SheetProgress {
  slug: string; name: string; category?: string;
  totalSolved: number; totalAttempted: number;
  byDifficulty: { easy: number; medium: number; hard: number };
}
interface UserReportData {
  profile?: { name?: string; email?: string };
  sheets: SheetProgress[];
}

const CATEGORY_COLORS: Record<string, string> = {
  popular: "#3A5EFF", "complete-dsa": "#818cf8",
  "quick-revision": "#4ade80", "topic-specific": "#38bdf8",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function ProgressBar({ solved, attempted, color = "#3A5EFF" }: { solved: number; attempted: number; color?: string }) {
  const pct = attempted === 0 ? 0 : Math.round((solved / attempted) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-bg-hover overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: color }}
        />
      </div>
      <span className="text-[10px] text-text-disabled w-7 text-right">{pct}%</span>
    </div>
  );
}

export default function UserReport({ userId, onBack }: { userId: string; onBack: () => void }) {
  const report = useQuery(api.progressAdmin.getIndividualReport, { userId }) as UserReportData | undefined;

  const downloadCSV = () => {
    if (!report) return;
    function csvEscape(v: unknown) {
      const s = String(v ?? "");
      return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }
    const rows: string[][] = [];
    rows.push(["User Name", report.profile?.name || ""], ["Email", report.profile?.email || ""], []);
    rows.push(["Sheet Name", "Category", "Total Solved", "Total Attempted", "Easy", "Medium", "Hard"]);
    report.sheets.forEach((s) => rows.push([s.name, s.category ?? "", String(s.totalSolved), String(s.totalAttempted), String(s.byDifficulty.easy), String(s.byDifficulty.medium), String(s.byDifficulty.hard)]));
    const blob = new Blob(["\uFEFF" + rows.map((r) => r.map(csvEscape).join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${(report.profile?.name || "user_report").replace(/\s+/g, "_")}_report.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (report === undefined) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  );
  if (!report) return <p className="text-sm text-red-400/70">No report found for this user.</p>;

  const totalSolved    = report.sheets.reduce((a, s) => a + s.totalSolved, 0);
  const totalAttempted = report.sheets.reduce((a, s) => a + s.totalAttempted, 0);
  const totalEasy      = report.sheets.reduce((a, s) => a + s.byDifficulty.easy, 0);
  const totalMedium    = report.sheets.reduce((a, s) => a + s.byDifficulty.medium, 0);
  const totalHard      = report.sheets.reduce((a, s) => a + s.byDifficulty.hard, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.14 }} className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Admin · Reports</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-1">User Report</h2>
            <p className="text-sm text-text-faint">Individual sheet-wise progress breakdown</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-faint hover:text-text-secondary hover:bg-bg-hover rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />Back
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand hover:bg-brand-hover text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-bg-hover flex items-center justify-center text-xs font-bold text-text-faint shrink-0">
          {getInitials(report.profile?.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{report.profile?.name || "—"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3 h-3 text-text-disabled" />
            <span className="text-xs text-text-faint">{report.profile?.email || "—"}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-3">Overall Progress</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Solved",    value: totalSolved,    color: "#3A5EFF" },
            { label: "Attempted", value: totalAttempted, color: "#818cf8" },
            { label: "Easy",      value: totalEasy,      color: "#22c55e" },
            { label: "Medium",    value: totalMedium,    color: "#f59e0b" },
            { label: "Hard",      value: totalHard,      color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex flex-col items-center px-4 py-2 rounded-md border min-w-15"
              style={{ background: `${color}0d`, borderColor: `${color}25` }}
            >
              <span className="text-lg font-semibold" style={{ color }}>{value}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-disabled mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-3">
          Sheet Breakdown <span className="ml-2 opacity-60">({report.sheets.length})</span>
        </p>
        {report.sheets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-text-disabled">
            <BookOpen className="w-7 h-7" />
            <span className="text-sm">No sheet activity yet</span>
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <AnimatePresence initial={false}>
              {report.sheets.map((s, idx) => {
                const accent = CATEGORY_COLORS[s.category ?? ""] ?? "var(--text-faint)";
                return (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, delay: idx * 0.03 }}
                    className={`px-4 py-4 hover:bg-bg-hover transition-colors ${idx > 0 ? "border-t border-border-subtle" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                        <span className="text-sm font-medium text-text-secondary truncate">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-brand" />
                        <span className="text-sm font-medium text-text-secondary">{s.totalSolved}</span>
                        <span className="text-xs text-text-disabled">/ {s.totalAttempted}</span>
                      </div>
                    </div>
                    <ProgressBar solved={s.totalSolved} attempted={s.totalAttempted} color={accent} />
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {[
                        { label: "Easy",   value: s.byDifficulty.easy,   color: "#22c55e" },
                        { label: "Medium", value: s.byDifficulty.medium, color: "#f59e0b" },
                        { label: "Hard",   value: s.byDifficulty.hard,   color: "#ef4444" },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1 text-[10px] rounded px-1.5 py-0.5 border"
                          style={{ background: `${color}0d`, borderColor: `${color}25`, color }}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          {value} {label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}