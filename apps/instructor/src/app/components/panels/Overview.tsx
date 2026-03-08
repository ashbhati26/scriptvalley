"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion } from "framer-motion";
import { BookOpen, Code2, Clock, XCircle, ArrowRight, Sparkles, Plus } from "lucide-react";
import type { Mode } from "../InstructorLayout";

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",      border: "var(--border-subtle)"  },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.20)" },
  published:      { label: "Published", color: "var(--brand)",      bg: "var(--brand-subtle)",  border: "var(--brand-border)"  },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.20)" },
};

function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className="inline-flex items-center text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full border uppercase"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      {m.label}
    </span>
  );
}

function StatCard({ label, total, pending, rejected, color, Icon, onClick }: {
  label: string; total: number; pending: number; rejected: number;
  color: string; Icon: React.FC<{ className?: string }>; onClick: () => void;
}) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
      className="group text-left w-full rounded-xl border border-(--border-subtle) bg-(--bg-elevated) p-4 hover:border-(--border-medium) transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <span style={{ color }}><Icon className="w-4 h-4" /></span>
        </div>
        <ArrowRight className="w-3 h-3 text-(--text-disabled) group-hover:text-(--text-faint) transition-colors" />
      </div>
      <p className="text-2xl font-bold text-(--text-primary) tabular-nums">{total}</p>
      <p className="text-[11px] text-(--text-faint) mt-0.5">{label}</p>
      {(pending > 0 || rejected > 0) && (
        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-(--border-subtle)">
          {pending  > 0 && <span className="flex items-center gap-1 text-[9px] text-amber-500"><Clock   className="w-2.5 h-2.5" />{pending} pending</span>}
          {rejected > 0 && <span className="flex items-center gap-1 text-[9px] text-red-400"><XCircle className="w-2.5 h-2.5" />{rejected} rejected</span>}
        </div>
      )}
    </motion.button>
  );
}

function QuickAction({ label, color, Icon, onClick }: {
  label: string; color: string; Icon: React.FC<{ className?: string }>; onClick: () => void;
}) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:bg-(--bg-hover) transition-colors text-left w-full">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <span style={{ color }}><Icon className="w-3.5 h-3.5" /></span>
      </div>
      <span className="text-xs font-medium text-(--text-secondary)">{label}</span>
    </motion.button>
  );
}

export default function Overview({ onNavigate }: { onNavigate: (m: Mode) => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  const skip = !isLoaded || !isSignedIn;

  const profile = useQuery(api.instructors.getMyProfile,  skip ? "skip" : undefined) as any;
  const courses = useQuery(api.courses.getMyCourses, skip ? "skip" : undefined) as any[] | undefined;
  const sheets  = useQuery(api.sheets.getMySheets,        skip ? "skip" : undefined) as any[] | undefined;

  const isLoading = skip || courses === undefined || sheets === undefined;

  const CARDS = [
    { key: "courses" as Mode, label: "Courses",    Icon: BookOpen, color: "var(--brand)", items: courses ?? [] },
    { key: "sheets"  as Mode, label: "DSA Sheets", Icon: Code2,    color: "#0891b2",      items: sheets  ?? [] },
  ];

  const recentItems = [
    ...(courses?.map((c: any) => ({ ...c,                _kind: "Course",    color: "var(--brand)", Icon: BookOpen })) ?? []),
    ...(sheets?.map((s: any)  => ({ ...s, title: s.name, _kind: "DSA Sheet", color: "#0891b2",      Icon: Code2    })) ?? []),
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

  const totalPending = CARDS.reduce(
    (n, c) => n + c.items.filter((i: any) => i.status === "pending_review").length, 0
  );

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 max-w-3xl space-y-10">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">Dashboard</p>
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          {isLoading ? "Loading…" : profile ? `Welcome back, ${profile.name.split(" ")[0]}` : "Overview"}
        </h1>
        {profile?.bio && <p className="text-sm text-(--text-faint) mt-1.5 max-w-lg leading-relaxed">{profile.bio}</p>}
      </div>

      {/* Pending approval */}
      {profile && !profile.isApproved && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-px" />
          <div>
            <p className="text-xs font-semibold text-amber-500">Account pending admin approval</p>
            <p className="text-xs text-(--text-faint) mt-0.5">
              You can create content now — nothing goes live until an admin approves your account.
            </p>
          </div>
        </motion.div>
      )}

      {/* Under review banner */}
      {totalPending > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-(--brand-border) bg-(--brand-subtle)">
          <span className="w-1.5 h-1.5 rounded-full bg-(--brand) animate-pulse shrink-0" />
          <p className="text-sm text-(--text-secondary)">
            <span className="font-semibold text-(--text-primary)">{totalPending}</span>{" "}
            item{totalPending !== 1 ? "s" : ""} under admin review
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-3">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <QuickAction label="New Course"    color="var(--brand)" Icon={Plus}   onClick={() => onNavigate("courses")} />
          <QuickAction label="New DSA Sheet" color="#0891b2"      Icon={Code2}  onClick={() => onNavigate("sheets")}  />
        </div>
      </div>

      {/* Stat cards */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-3">Your Content</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CARDS.map((c, i) =>
            isLoading ? (
              <div key={i} className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) h-28 animate-pulse" />
            ) : (
              <StatCard key={c.key} label={c.label} total={c.items.length}
                pending={c.items.filter((x: any)  => x.status === "pending_review").length}
                rejected={c.items.filter((x: any) => x.status === "rejected").length}
                color={c.color} Icon={c.Icon} onClick={() => onNavigate(c.key)} />
            )
          )}
        </div>
      </div>

      {/* Recent */}
      {recentItems.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-3">Recent</p>
          <div className="rounded-xl border border-(--border-subtle) overflow-hidden divide-y divide-(--border-subtle)">
            {recentItems.map((item: any, i) => (
              <motion.div key={String(item._id)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-(--bg-hover) transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}18` }}>
                  <span style={{ color: item.color }}><item.Icon className="w-3.5 h-3.5" /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-secondary) truncate">{item.title}</p>
                  <p className="text-[10px] text-(--text-disabled)">{item._kind}</p>
                </div>
                <StatusChip status={item.status} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && recentItems.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-(--text-disabled)" />
          </div>
          <div>
            <p className="text-sm font-semibold text-(--text-secondary)">Your workspace is empty</p>
            <p className="text-xs text-(--text-faint) mt-1">Start by creating a course or a DSA sheet.</p>
          </div>
          <button onClick={() => onNavigate("courses")}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />Create your first course
          </button>
        </div>
      )}
    </div>
  );
}