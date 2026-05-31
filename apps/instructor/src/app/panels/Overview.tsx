"use client";

import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion } from "framer-motion";
import { BookOpen, Code2, Clock, AlertCircle, ArrowRight, Sparkles, Plus } from "lucide-react";
import type { Mode } from "../components/InstructorLayout";
import { StatusChip } from "./shared/ui";

function StatCard({ label, total, mine, pending, rejected, color, Icon, onClick, delay }: {
  label: string; total: number; mine: number; pending: number; rejected: number;
  color: string; Icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  onClick: () => void; delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="sv-card-hover w-full text-left"
      style={{ padding: 20 }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="sv-icon-badge flex items-center justify-center" style={{ width: 32, height: 32, background: `${color}14` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <ArrowRight size={13} className="sv-text-disabled" />
      </div>
      <p className="text-[28px] font-bold sv-text-primary" style={{ letterSpacing: "-0.03em", lineHeight: 1 }}>{total}</p>
      <p className="text-[13px] sv-text-muted" style={{ marginTop: 6 }}>{label}</p>
      <p className="text-[11px] sv-text-disabled" style={{ marginTop: 3 }}>{mine} by you</p>
      {(pending > 0 || rejected > 0) && (
        <div className="flex items-center gap-2.5" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
          {pending  > 0 && <span className="flex items-center gap-1 text-[11px] sv-text-warning"><Clock size={10} />{pending} pending</span>}
          {rejected > 0 && <span className="flex items-center gap-1 text-[11px] sv-text-danger"><AlertCircle size={10} />{rejected} rejected</span>}
        </div>
      )}
    </motion.button>
  );
}

function QuickAction({ label, color, Icon, onClick, delay }: {
  label: string; color: string;
  Icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  onClick: () => void; delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.18 }}
      className="sv-card-hover flex items-center w-full text-left"
      style={{ gap: 12, padding: "14px 16px" }}
    >
      <div className="sv-icon-badge flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: `${color}14` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <span className="text-[13px] font-medium sv-text-secondary" style={{ letterSpacing: "-0.01em" }}>{label}</span>
    </motion.button>
  );
}

export default function Overview({ onNavigate }: { onNavigate: (m: Mode) => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip    = !isLoaded || !isSignedIn;
  const profile = useQuery(api.instructors.getMyProfile, skip ? "skip" : undefined) as any;
  const courses = useQuery(api.courses.getMyCourses,      skip ? "skip" : undefined) as any[] | undefined;
  const sheets  = useQuery(api.sheets.getMySheets,        skip ? "skip" : undefined) as any[] | undefined;

  const isLoading      = skip || courses === undefined || sheets === undefined;
  const myId           = user?.id;
  const myCoursesItems = (courses ?? []).filter((c: any) => c.createdBy === myId);
  const mySheetsItems  = (sheets  ?? []).filter((s: any) => s.createdBy === myId);

  const CARDS = [
    { key: "courses" as Mode, label: "Courses",    Icon: BookOpen, color: "var(--brand)", items: courses ?? [], mine: myCoursesItems },
    { key: "sheets"  as Mode, label: "DSA Sheets", Icon: Code2,    color: "#0891b2",      items: sheets  ?? [], mine: mySheetsItems  },
  ];

  const recentItems = [
    ...(courses?.map((c: any) => ({ ...c, _kind: "Course",  color: "var(--brand)", Icon: BookOpen })) ?? []),
    ...(sheets?.map((s: any)  => ({ ...s, title: s.name,   _kind: "DSA Sheet",   color: "#0891b2", Icon: Code2 })) ?? []),
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

  const totalPending = CARDS.reduce((n, c) => n + c.items.filter((i: any) => i.status === "pending_review").length, 0);
  const firstName    = profile?.name?.split(" ")[0] ?? "";

  return (
    <div style={{ padding: "36px 32px 80px", maxWidth: 700, width: "100%" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ marginBottom: 36 }}>
        <h1 className="font-bold sv-text-primary" style={{ fontSize: "clamp(20px,4vw,24px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {firstName ? `Hey, ${firstName} 👋` : "Overview"}
        </h1>
        <p className="text-[13px] sv-text-faint" style={{ marginTop: 8 }}>Here's what's happening with your content.</p>
      </motion.div>

      {/* Pending banner */}
      {!isLoading && totalPending > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="sv-banner-brand" style={{ marginBottom: 32 }}>
          <span className="sv-bg-brand sv-pulse flex-shrink-0" style={{ width: 7, height: 7, borderRadius: "50%" }} />
          <p className="text-[13px] sv-text-secondary">
            <span className="font-semibold sv-text-primary">{totalPending}</span>{" "}
            item{totalPending !== 1 ? "s" : ""} under admin review
          </p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <section style={{ marginBottom: 40 }}>
        <p className="sv-section-label" style={{ marginBottom: 14 }}>Quick Actions</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))" }}>
          <QuickAction label="New Course"    color="var(--brand)" Icon={Plus}  onClick={() => onNavigate("courses")} delay={0.04} />
          <QuickAction label="New DSA Sheet" color="#0891b2"      Icon={Code2} onClick={() => onNavigate("sheets")}  delay={0.07} />
        </div>
      </section>

      {/* Your Content */}
      <section style={{ marginBottom: 40 }}>
        <p className="sv-section-label" style={{ marginBottom: 14 }}>Your Content</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}>
          {CARDS.map((c, i) =>
            isLoading ? (
              <div key={i} className="sv-card sv-pulse" style={{ height: 140 }} />
            ) : (
              <StatCard
                key={c.key} label={c.label} total={c.items.length}
                pending={c.items.filter((x: any) => x.status === "pending_review").length}
                rejected={c.items.filter((x: any) => x.status === "rejected").length}
                mine={c.mine.length} color={c.color} Icon={c.Icon}
                onClick={() => onNavigate(c.key)} delay={i * 0.05 + 0.08}
              />
            )
          )}
        </div>
      </section>

      {/* Recent */}
      {recentItems.length > 0 && (
        <section>
          <p className="sv-section-label" style={{ marginBottom: 14 }}>Recent</p>
          <div className="sv-card overflow-hidden">
            {recentItems.map((item: any, i) => (
              <motion.div
                key={String(item._id)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 + 0.12 }}
                className="sv-list-row"
                style={{ padding: "13px 16px", borderBottom: i < recentItems.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
              >
                <div className="sv-icon-badge flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: `${item.color}14` }}>
                  <item.Icon size={13} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium sv-text-primary sv-truncate" style={{ letterSpacing: "-0.01em" }}>{item.title}</p>
                  <p className="text-[11px] sv-text-disabled" style={{ marginTop: 3 }}>{item._kind}</p>
                </div>
                <StatusChip status={item.status} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!isLoading && recentItems.length === 0 && (
        <div className="flex flex-col items-center gap-4 text-center" style={{ padding: "64px 24px" }}>
          <div className="sv-icon-badge sv-bg-elevated flex items-center justify-center" style={{ width: 48, height: 48, border: "1px solid var(--border-subtle)" }}>
            <Sparkles size={20} className="sv-text-disabled" />
          </div>
          <div>
            <p className="text-[15px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.01em" }}>Your workspace is empty</p>
            <p className="text-[13px] sv-text-faint" style={{ marginTop: 6, lineHeight: 1.65 }}>Start by creating a course or a DSA sheet.</p>
          </div>
          <button onClick={() => onNavigate("courses")} className="sv-btn-primary flex items-center gap-1.5 text-[13px]" style={{ padding: "9px 20px", borderRadius: "var(--radius-md)" }}>
            <Plus size={13} />Create your first course
          </button>
        </div>
      )}
    </div>
  );
}