"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { motion } from "framer-motion";
import { BookOpen, Award, Zap, TrendingUp, CheckCircle2, Users } from "lucide-react";

// ─── StatCard ─────────────────────────────────────────────────────────────────
// `color` is a runtime hex value used for the icon tint — inline style justified.
function StatCard({ label, value, sub, Icon, color, delay = 0 }: {
  label: string; value: number | string; sub?: string;
  Icon: React.ComponentType<any>; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.15 }}
      className="flex flex-col gap-2.5 p-4 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)"
    >
      <div className="flex items-center justify-between">
        {/* Icon badge — tint is runtime, inline justified */}
        <div
          className="w-[30px] h-[30px] rounded-md flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        {sub && (
          <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-(--text-primary) leading-none">{value}</p>
        <p className="text-[11px] text-(--text-faint) mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── RankedList ───────────────────────────────────────────────────────────────
// `color` is a runtime hex — progress bar fill and count text use inline style.
function RankedList({ title, items, valueLabel, color, Icon }: {
  title: string;
  items: { name?: string; title?: string; slug: string; count: number }[];
  valueLabel: string;
  color: string;
  Icon: React.ComponentType<any>;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="p-4 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <div
          className="w-[26px] h-[26px] rounded-md flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <p className="text-[13px] font-medium text-(--text-secondary)">{title}</p>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0.5">
        {items.map((item, i) => {
          const pct = Math.round((item.count / items[0].count) * 100);
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-2.5 py-2 rounded-md bg-(--bg-base) border border-(--border-subtle)"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-(--text-disabled) w-4 shrink-0">
                  #{i + 1}
                </span>
                <span className="flex-1 text-[12px] font-medium text-(--text-secondary) truncate">
                  {item.name ?? item.title ?? item.slug}
                </span>
                <span className="text-[11px] font-semibold shrink-0" style={{ color }}>
                  {item.count}{" "}
                  <span className="font-normal text-[10px] text-(--text-disabled)">{valueLabel}</span>
                </span>
              </div>
              {/* Progress bar — fill color is runtime */}
              <div className="h-[3px] bg-(--bg-hover) rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)">
      <div className="w-[30px] h-[30px] rounded-md bg-(--bg-hover) mb-3 animate-pulse" />
      <div className="h-6 w-12 bg-(--bg-hover) rounded mb-1.5 animate-pulse" />
      <div className="h-[11px] w-20 bg-(--bg-hover) rounded animate-pulse" />
    </div>
  );
}

// ─── PlatformStats ────────────────────────────────────────────────────────────
export default function PlatformStats() {
  const stats     = useQuery(api.adminFeatures.getPlatformStats);
  const isLoading = stats === undefined;

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Dashboard</p>
        <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">Platform Stats</h2>
        <p className="text-[13px] text-(--text-faint)">Real-time numbers across the entire platform.</p>
      </div>

      {/* ── User stat cards ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">Users</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (
              <>
                <StatCard label="Total Users"          value={stats.totalUsers}          Icon={Users}        color="#3A5EFF" delay={0}    />
                <StatCard label="Approved Instructors" value={stats.approvedInstructors} Icon={CheckCircle2} color="#22c55e" delay={0.05} sub={`${stats.pendingInstructors} pending`} />
                <StatCard label="Published Courses"    value={stats.publishedCourses}    Icon={Award}        color="#8b5cf6" delay={0.1}  sub={`${stats.totalCourses} total`} />
                <StatCard label="Published Sheets"     value={stats.publishedSheets}     Icon={BookOpen}     color="#f59e0b" delay={0.15} sub={`${stats.totalSheets} total`} />
              </>
            )
          }
        </div>
      </div>

      {/* ── POTD cards ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">
          Problem of the Day
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : (
              <>
                <StatCard label="Solved Today" value={stats.todayPotdSolves}      Icon={Zap}        color="#22c55e" />
                <StatCard label="Solve Rate"   value={`${stats.potdSolveRate}%`}  Icon={TrendingUp} color="#3A5EFF" sub="of all users" />
              </>
            )
          }
        </div>
      </div>

      {/* ── Ranked lists ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">Top Content</p>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-[200px] rounded-lg bg-(--bg-elevated) border border-(--border-subtle) animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <RankedList
              title="Top Sheets by Progress"
              items={stats.topSheets}
              valueLabel="users"
              color="#3A5EFF"
              Icon={BookOpen}
            />
            <RankedList
              title="Top Courses by Enrollment"
              items={stats.topCourses.map((c) => ({ ...c, name: c.title }))}
              valueLabel="users"
              color="#8b5cf6"
              Icon={Award}
            />
          </div>
        )}
      </div>

      {/* Loading footer */}
      {isLoading && (
        <p className="text-[12px] text-(--text-disabled) text-center pt-2">
          Loading platform data…
        </p>
      )}
    </div>
  );
}