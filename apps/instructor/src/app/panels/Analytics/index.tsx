"use client";

import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Code2, BarChart2, CheckCircle2, AlertCircle } from "lucide-react";
import { StatusChip } from "../shared/ui";

function StatCard({ label, value, sub, icon: Icon, color, i }: {
  label: string; value: number | string; sub?: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string; i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.2 }}
      className="sv-bg-elevated sv-rounded-lg"
      style={{ border: "1px solid var(--border-subtle)", padding: 20 }}
    >
      <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: `${color}14`, marginBottom: 16 }}>
        <Icon size={15} style={{ color }} />
      </div>
      <p className="text-[28px] font-bold sv-text-primary" style={{ letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
      <p className="text-[13px] sv-text-muted" style={{ marginTop: 6 }}>{label}</p>
      {sub && <p className="text-[11px] sv-text-disabled" style={{ marginTop: 3 }}>{sub}</p>}
    </motion.div>
  );
}

function ContentRow({ title, status, type, metric, metricLabel, i }: {
  title: string; status: string; type: "course" | "sheet"; metric: number; metricLabel: string; i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 + 0.15 }}
      className="flex items-center gap-3 cursor-default sv-list-row"
      style={{ padding: "13px 16px" }}
    >
      <div className="flex items-center justify-center flex-shrink-0 sv-rounded-md"
        style={{ width: 30, height: 30, background: type === "course" ? "rgba(58,94,255,0.10)" : "rgba(8,145,178,0.10)" }}>
        {type === "course" ? <BookOpen size={13} style={{ color: "var(--brand)" }} /> : <Code2 size={13} style={{ color: "#0891b2" }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium sv-text-primary sv-truncate" style={{ letterSpacing: "-0.01em" }}>{title}</p>
        <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
          <StatusChip status={status} />
          <span className="text-[11px] sv-text-disabled capitalize">{type}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.01em" }}>{metric}</p>
        <p className="text-[11px] sv-text-disabled">{metricLabel}</p>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPanel() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip = !isLoaded || !isSignedIn;
  const courses = useQuery(api.courses.getMyCourses, skip ? "skip" : undefined) as any[] | undefined;
  const sheets  = useQuery(api.sheets.getMySheets,   skip ? "skip" : undefined) as any[] | undefined;

  if (skip || courses === undefined || sheets === undefined) {
    return <div className="flex justify-center" style={{ padding: 48 }}><div className="sv-spinner sv-spinner-md" /></div>;
  }

  const myId             = user?.id;
  const myCourses        = (courses ?? []).filter((c: any) => c.createdBy === myId);
  const mySheets         = (sheets  ?? []).filter((s: any) => s.createdBy === myId);
  const publishedCourses = myCourses.filter((c: any) => c.status === "published").length;
  const publishedSheets  = mySheets.filter((s: any)  => s.status === "published").length;
  const pendingItems     = [...myCourses, ...mySheets].filter((x: any) => x.status === "pending_review").length;
  const rejectedItems    = [...myCourses, ...mySheets].filter((x: any) => x.status === "rejected").length;
  const totalModules     = myCourses.reduce((a: number, c: any) => a + (c.modules?.length ?? 0), 0);
  const totalQuestions   = mySheets.reduce((a: number, s: any) => {
    const t = s.content?.topics ?? s.topics ?? [];
    return a + t.reduce((b: number, tp: any) => b + (tp.questions?.length ?? 0), 0);
  }, 0);

  const ORDER: Record<string, number> = { published: 0, pending_review: 1, draft: 2, rejected: 3 };
  const allContent = [
    ...myCourses.map((c: any) => ({ title: c.title, status: c.status, type: "course" as const, metric: c.modules?.length ?? 0, metricLabel: "modules" })),
    ...mySheets.map((s: any) => {
      const t = s.content?.topics ?? s.topics ?? [];
      return { title: s.name, status: s.status ?? "published", type: "sheet" as const, metric: t.reduce((a: number, tp: any) => a + (tp.questions?.length ?? 0), 0), metricLabel: "questions" };
    }),
  ].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));

  const stats = [
    { label: "Published courses", value: publishedCourses, icon: BookOpen,     color: "var(--brand)", sub: `${myCourses.length} total` },
    { label: "Published sheets",  value: publishedSheets,  icon: Code2,        color: "#0891b2",      sub: `${mySheets.length} total` },
    { label: "Modules created",   value: totalModules,     icon: BarChart2,    color: "#7c3aed",      sub: "across all courses" },
    { label: "Problems curated",  value: totalQuestions,   icon: CheckCircle2, color: "#16a34a",      sub: "across all sheets" },
  ];

  return (
    <div style={{ padding: "36px 32px 80px", maxWidth: 700, width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h2 className="font-bold sv-text-primary" style={{ fontSize: "clamp(20px,4vw,24px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Analytics
        </h2>
        <p className="text-[13px] sv-text-faint" style={{ marginTop: 8 }}>Your content performance at a glance.</p>
      </div>

      {/* Alert banners */}
      {(pendingItems > 0 || rejectedItems > 0) && (
        <div className="flex flex-col gap-3" style={{ marginBottom: 36 }}>
          {pendingItems > 0 && (
            <div className="flex items-center gap-2.5 sv-rounded-lg" style={{ padding: "12px 16px", border: "1px solid var(--brand-border)", background: "var(--brand-subtle)" }}>
              <span className="flex-shrink-0 sv-pulse sv-bg-brand" style={{ width: 7, height: 7, borderRadius: "50%" }} />
              <p className="text-[13px] sv-text-secondary">
                <span className="font-semibold sv-text-primary">{pendingItems}</span>{" "}item{pendingItems !== 1 ? "s" : ""} under admin review
              </p>
            </div>
          )}
          {rejectedItems > 0 && (
            <div className="flex items-center gap-2.5 sv-rounded-lg" style={{ padding: "12px 16px", border: "1px solid var(--danger-border)", background: "var(--danger-bg)" }}>
              <AlertCircle size={14} className="sv-text-danger flex-shrink-0" />
              <p className="text-[13px] sv-text-secondary">
                <span className="font-semibold sv-text-danger">{rejectedItems}</span>{" "}item{rejectedItems !== 1 ? "s" : ""} rejected — open them to see the reason
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stat cards */}
      <section style={{ marginBottom: 40 }}>
        <p className="sv-section-label" style={{ marginBottom: 14 }}>Overview</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {stats.map((s, i) => <StatCard key={s.label} {...s} i={i} />)}
        </div>
      </section>

      {/* Content list */}
      {allContent.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <p className="sv-section-label" style={{ marginBottom: 14 }}>Your Content</p>
          <div className="sv-bg-elevated sv-rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
            {allContent.map((item, i) => (
              <div key={i} style={{ borderBottom: i < allContent.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <ContentRow {...item} i={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {allContent.length === 0 && (
        <div className="flex flex-col items-center gap-3 text-center" style={{ padding: "56px 24px" }}>
          <div className="flex items-center justify-center sv-rounded-lg sv-bg-elevated" style={{ width: 40, height: 40, border: "1px solid var(--border-subtle)" }}>
            <TrendingUp size={16} className="sv-text-disabled" />
          </div>
          <p className="text-[14px] sv-text-faint">No content yet</p>
        </div>
      )}

      {/* Coming soon */}
      <div className="sv-bg-elevated sv-rounded-lg" style={{ padding: "16px 20px", border: "1px solid var(--border-subtle)" }}>
        <p className="sv-section-label" style={{ marginBottom: 8 }}>Coming soon</p>
        <p className="text-[13px] sv-text-faint" style={{ lineHeight: 1.65 }}>
          Enrollment counts, lesson drop-off rates, and per-question solve rates will appear here once student tracking is enabled.
        </p>
      </div>
    </div>
  );
}