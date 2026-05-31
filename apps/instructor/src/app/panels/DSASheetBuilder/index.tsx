"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layers, AlertCircle, ChevronRight } from "lucide-react";
import { FilterStatus, countQuestions, hydrateTopics } from "./sheetTypes";
import { StatusChip, EmptyState, Loader } from "../shared/ui";
import SheetEditor from "./SheetEditor";

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

export default function DSASheetBuilder() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip   = !isLoaded || !isSignedIn;
  const sheets = useQuery(api.sheets.getMySheets, skip ? "skip" : undefined) as any[] | undefined;
  const myUserId = user?.id;

  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [filter,  setFilter]  = useState<FilterStatus>("all");

  if (editing !== null) {
    const editingSheet = editing !== "new" ? editing : null;
    const sheetCanEdit = editing === "new" ? true : editingSheet?.createdBy === myUserId;
    return <SheetEditor sheet={editing === "new" ? null : editing} canEdit={sheetCanEdit} onBack={() => setEditing(null)} />;
  }

  const shown    = filter === "all" ? (sheets ?? []) : (sheets ?? []).filter((s: any) => (s.status ?? "published") === filter);
  const countFor = (f: FilterStatus) => !sheets ? 0 : f === "all" ? sheets.length : sheets.filter((s: any) => (s.status ?? "published") === f).length;

  return (
    <div style={{ padding: "36px 32px 80px", maxWidth: 720, width: "100%" }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 32 }}>
        <div>
          <p className="sv-section-label" style={{ marginBottom: 8 }}>Instructor Workspace</p>
          <h2 className="font-bold sv-text-primary" style={{ fontSize: "clamp(20px,4vw,24px)", letterSpacing: "-0.022em", lineHeight: 1.2 }}>
            DSA Sheets
          </h2>
          <p className="text-[13px] sv-text-faint" style={{ marginTop: 8, letterSpacing: "-0.003em" }}>
            Curate problem sets — supports sub-topics for Striver-style sheets.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="sv-btn-primary flex items-center gap-1.5 flex-shrink-0 text-[13px]"
          style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", letterSpacing: "-0.008em", boxShadow: "0 1px 3px rgba(58,94,255,0.25)", marginTop: 2 }}
        >
          <Plus size={13} strokeWidth={2.5} />New Sheet
        </button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-px w-fit"
        style={{ marginBottom: 24, padding: 3, background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          const count  = sheets !== undefined ? countFor(key) : null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 text-[12px] cursor-pointer whitespace-nowrap ${active ? "sv-tab-active" : "sv-tab-inactive"}`}
              style={{ padding: "5px 12px", letterSpacing: "-0.003em" }}
            >
              {label}
              {count !== null && count > 0 && (
                <span className={`sv-badge ${active ? "sv-badge-active" : "sv-badge-inactive"}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sheet list */}
      {sheets === undefined ? (
        <Loader />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={Layers}
          label={filter === "all" ? "No DSA sheets yet" : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} sheets`}
          action={filter === "all" ? (
            <button onClick={() => setEditing("new")} className="sv-btn-primary flex items-center gap-1.5 text-[13px]"
              style={{ padding: "8px 16px", borderRadius: "var(--radius-md)" }}>
              <Plus size={12} />Build your first sheet
            </button>
          ) : undefined}
        />
      ) : (
        <div className="sv-card overflow-hidden sv-shadow-xs" style={{ borderRadius: "var(--radius-xl)" }}>
          <AnimatePresence initial={false}>
            {shown.map((sheet: any, i: number) => {
              const rawTopics  = sheet.content?.topics ?? sheet.topics ?? [];
              const topicCount = rawTopics.length;
              const qCount     = countQuestions(hydrateTopics(rawTopics));
              return (
                <motion.div
                  key={String(sheet._id)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.15 }}
                  onClick={() => setEditing(sheet)}
                  className="sv-list-row"
                  style={{ padding: "14px 18px", borderBottom: i < shown.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                >
                  <div className="sv-rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ width: 34, height: 34, background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.15)" }}>
                    <Layers size={14} style={{ color: "#0891b2" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
                      <p className="text-[13px] font-medium sv-text-primary sv-truncate" style={{ letterSpacing: "-0.01em" }}>{sheet.name}</p>
                      <StatusChip status={sheet.status ?? "published"} />
                      {sheet.createdBy !== myUserId && (
                        <span className="text-[10px] sv-text-disabled sv-bg-hover sv-rounded-xs"
                          style={{ padding: "1px 5px", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 2 }}>
                          <svg width="9" height="9" viewBox="0 0 13 13" fill="none"><path d="M10 5.5V4a3.5 3.5 0 00-7 0v1.5A1.5 1.5 0 001.5 7v4A1.5 1.5 0 003 12.5h7a1.5 1.5 0 001.5-1.5V7A1.5 1.5 0 0010 5.5zM5 4a1.5 1.5 0 013 0v1.5H5V4z" fill="currentColor"/></svg>
                          View only
                        </span>
                      )}
                      {sheet.category && (
                        <span className="text-[10px] sv-text-disabled sv-bg-hover sv-rounded-xs"
                          style={{ padding: "1px 6px", border: "1px solid var(--border-subtle)", letterSpacing: "0.01em" }}>
                          {sheet.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] sv-text-disabled" style={{ letterSpacing: "-0.003em" }}>
                        {topicCount} topic{topicCount !== 1 ? "s" : ""} · {qCount} question{qCount !== 1 ? "s" : ""}
                      </p>
                      {sheet.status === "rejected" && sheet.rejectionReason && (
                        <p className="flex items-center gap-0.5 text-[11px] sv-text-danger">
                          <AlertCircle size={9} className="flex-shrink-0" />{sheet.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] sv-text-disabled">
                      {new Date(sheet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <ChevronRight size={13} className="sv-text-disabled" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}