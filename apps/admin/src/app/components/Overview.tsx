"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { motion } from "framer-motion";
import {
  BookOpen, Award,
  Users, UserCheck, Clock, ArrowRight, GraduationCap, CheckCircle2,
} from "lucide-react";

interface OverviewProps {
  onGoToTeam: () => void;
  onGoToContentReview: () => void;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0)  return `${days}d ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs > 0)   return `${hrs}h ago`;
  const mins = Math.floor(diff / 60_000);
  if (mins > 0)  return `${mins}m ago`;
  return "just now";
}

export default function Overview({ onGoToTeam, onGoToContentReview }: OverviewProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const skip = !isLoaded || !isSignedIn;

  const allSheets   = useQuery(api.sheets.adminGetAll,            skip ? "skip" : undefined);
  const allCourses  = useQuery(api.courses.adminGetAllCourses,    skip ? "skip" : undefined);

  const pendingSheets   = useQuery(api.sheets.getPendingSheets,       skip ? "skip" : undefined);
  const pendingCourses  = useQuery(api.courses.getPendingCourses,     skip ? "skip" : undefined);
  const instructors     = useQuery(api.instructors.getAllInstructors, skip ? "skip" : undefined);

  const pendingInstructors  = instructors?.filter((i) => !i.isApproved).length ?? 0;
  const approvedInstructors = instructors?.filter((i) =>  i.isApproved).length ?? 0;

  const totalPendingReview =
    (pendingSheets?.length  ?? 0) +
    (pendingCourses?.length ?? 0);

  const isLoading = skip || allSheets === undefined || instructors === undefined;

  const contentStats = [
    { label: "DSA Sheets", total: allSheets?.length  ?? 0, pending: pendingSheets?.length  ?? 0, Icon: BookOpen, color: "#3A5EFF" },
    { label: "Courses",    total: allCourses?.length ?? 0, pending: pendingCourses?.length ?? 0, Icon: Award,    color: "#22c55e" },
  ];

  type ActivityItem = {
    id: string; type: string; title: string;
    createdAt: number; Icon: React.ComponentType<any>; color: string;
  };

  const recentActivity: ActivityItem[] = [
    ...(pendingSheets?.map((s: any) => ({ id: String(s._id), type: "DSA Sheet", title: s.name ?? s.slug, createdAt: s.createdAt, Icon: BookOpen, color: "#3A5EFF" })) ?? []),
    ...(pendingCourses?.map((c: any) => ({ id: String(c._id), type: "Course",   title: c.title,          createdAt: c.createdAt, Icon: Award,    color: "#22c55e" })) ?? []),
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Dashboard</p>
        <h1 className="text-2xl font-semibold text-(--text-primary)">Overview</h1>
        <p className="text-sm text-text-faint mt-1">Platform health at a glance.</p>
      </div>

      {totalPendingReview > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-[rgba(58,94,255,0.25)] bg-[rgba(58,94,255,0.06)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3A5EFF] animate-pulse" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-(--text-primary)">{totalPendingReview}</span>{" "}
              item{totalPendingReview !== 1 ? "s" : ""} waiting for review
            </p>
          </div>
          <button onClick={onGoToContentReview} className="flex items-center gap-1 text-xs text-[#3A5EFF] hover:text-[#4a6aff] font-medium transition-colors shrink-0">
            Review now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-3">Content</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {contentStats.map(({ label, total, pending, Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                {pending > 0 && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                    {pending} pending
                  </span>
                )}
              </div>
              <div>
                {isLoading
                  ? <div className="h-6 w-8 bg-(--bg-hover) rounded animate-pulse" />
                  : <p className="text-xl font-bold text-(--text-primary)">{total}</p>
                }
                <p className="text-[11px] text-text-faint mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-text-faint" />
              <p className="text-sm font-medium text-text-secondary">Instructors</p>
            </div>
            <button onClick={onGoToTeam} className="text-[10px] text-[#3A5EFF] hover:text-[#4a6aff] flex items-center gap-1 transition-colors">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Approved", value: approvedInstructors, Icon: UserCheck, color: "#22c55e" },
              { label: "Pending",  value: pendingInstructors,  Icon: Clock,     color: "#f59e0b" },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="rounded-md p-3 border" style={{ background: `${color}0d`, borderColor: `${color}25` }}>
                <Icon className="w-3.5 h-3.5 mb-2" style={{ color }} />
                {isLoading
                  ? <div className="h-5 w-6 bg-(--bg-hover) rounded animate-pulse" />
                  : <p className="text-lg font-bold" style={{ color }}>{value}</p>
                }
                <p className="text-[10px] text-text-faint mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {pendingInstructors > 0 && (
            <button onClick={onGoToTeam} className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.06)] text-[#f59e0b] text-xs font-medium hover:bg-[rgba(245,158,11,0.12)] transition-colors">
              <Clock className="w-3.5 h-3.5" />
              Review {pendingInstructors} application{pendingInstructors !== 1 ? "s" : ""}
            </button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-text-faint" />
              <p className="text-sm font-medium text-text-secondary">Pending Review</p>
            </div>
            <button onClick={onGoToContentReview} className="text-[10px] text-[#3A5EFF] hover:text-[#4a6aff] flex items-center gap-1 transition-colors">
              Review all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { label: "DSA Sheets", count: pendingSheets?.length  ?? 0, color: "#3A5EFF" },
              { label: "Courses",    count: pendingCourses?.length ?? 0, color: "#22c55e" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-text-faint">{label}</span>
                </div>
                <span className="text-xs font-medium tabular-nums" style={{ color: count > 0 ? color : "var(--text-disabled)" }}>
                  {isLoading ? "—" : count}
                </span>
              </div>
            ))}
          </div>
          {totalPendingReview > 0 && (
            <div className="mt-3 pt-3 border-t border-(--border-subtle) flex items-center justify-between">
              <span className="text-xs text-text-faint">Total</span>
              <span className="text-sm font-semibold text-(--text-primary)">{totalPendingReview}</span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-text-disabled">Recent Submissions</p>
          {recentActivity.length > 0 && (
            <button onClick={onGoToContentReview} className="text-[10px] text-[#3A5EFF] hover:text-[#4a6aff] flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        {recentActivity.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center gap-2 py-12 rounded-lg border border-(--border-subtle) text-text-disabled">
            <GraduationCap className="w-7 h-7" />
            <p className="text-sm">No pending submissions</p>
          </div>
        ) : (
          <div className="rounded-lg border border-(--border-subtle) overflow-hidden divide-y divide-(--border-subtle)">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-6 h-6 rounded bg-(--bg-hover) animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-40 bg-(--bg-hover) rounded animate-pulse" />
                      <div className="h-2.5 w-24 bg-(--bg-hover) rounded animate-pulse" />
                    </div>
                  </div>
                ))
              : recentActivity.map((item, idx) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    onClick={onGoToContentReview}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-(--bg-hover) transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                      <item.Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary truncate">{item.title}</p>
                      <p className="text-[10px] text-text-disabled">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-disabled shrink-0">
                      <Clock className="w-3 h-3" />{timeAgo(item.createdAt)}
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0"
                      style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                      pending
                    </span>
                  </motion.div>
                ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}