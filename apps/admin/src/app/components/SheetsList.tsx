"use client";

import React, { useRef, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Trash2, Layers, Clock,
  ChevronDown, ChevronUp, AlertCircle, Tag, GripVertical,
} from "lucide-react";

type FilterStatus = "all" | "draft" | "pending_review" | "published" | "rejected";

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",       border: "var(--border-subtle)"  },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.20)" },
  published:      { label: "Published", color: "#3A5EFF",           bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.20)" },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.20)" },
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  popular:          { bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.2)",  text: "#3A5EFF" },
  "complete-dsa":   { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", text: "#818cf8" },
  "quick-revision": { bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  text: "#4ade80" },
  "topic-specific": { bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.2)", text: "#38bdf8" },
};

const CATEGORY_LABELS: Record<string, string> = {
  popular: "Popular", "complete-dsa": "Complete DSA",
  "quick-revision": "Quick Revision", "topic-specific": "Topic Specific",
};

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span
      className="inline-flex items-center text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full border uppercase"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      {m.label}
    </span>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  const key   = category ?? "";
  const style = CATEGORY_COLORS[key] ?? { bg: "var(--bg-elevated)", border: "var(--border-subtle)", text: "var(--text-disabled)" };
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full border"
      style={{ background: style.bg, borderColor: style.border, color: style.text }}
    >
      <Tag className="w-2.5 h-2.5" />
      {(CATEGORY_LABELS[key] ?? key) || "—"}
    </span>
  );
}

function SheetRow({
  sheet, idx, onDelete,
  isDraggable, onDragStart, onDragOver, onDragEnd, isDragging,
}: {
  sheet:       any;
  idx:         number;
  onDelete:    (id: Id<"dsaSheets">) => void;
  isDraggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver:  (e: React.DragEvent) => void;
  onDragEnd:   () => void;
  isDragging:  boolean;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const topicCount = sheet.content?.topics?.length ?? sheet.topics?.length ?? 0;
  const qCount     = (sheet.content?.topics ?? sheet.topics ?? [])
    .reduce((n: number, t: any) => n + (t.questions?.length ?? 0), 0);
  const status = sheet.status ?? "published";

  return (
    <div
      draggable={isDraggable}
      onDragStart={isDraggable ? onDragStart : undefined}
      onDragOver={isDraggable ? onDragOver : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      className={[
        "group px-4 py-4 select-none transition-colors duration-75",
        idx > 0 ? "border-t border-(--border-subtle)" : "",
        isDragging ? "opacity-40 bg-(--bg-hover)" : "hover:bg-(--bg-hover)",
        isDraggable ? "cursor-grab active:cursor-grabbing" : "",
      ].join(" ")}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {isDraggable && (
          <div className="hidden sm:flex items-center self-center text-(--text-disabled) shrink-0 mt-0.5">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isDraggable && (
              <span className="text-[9px] font-bold text-(--text-disabled) bg-(--bg-hover) border border-(--border-subtle) rounded px-1.5 py-0.5 tabular-nums shrink-0">
                #{idx + 1}
              </span>
            )}
            <p className="text-sm font-medium text-(--text-secondary) truncate">{sheet.name || "Untitled"}</p>
            <StatusChip status={status} />
            {sheet.category && <CategoryBadge category={sheet.category} />}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-(--text-disabled) bg-(--bg-hover) rounded px-1.5 py-0.5">{sheet.slug}</span>
            <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
              <Layers className="w-3 h-3" />{topicCount} topic{topicCount !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] text-(--text-disabled)">{qCount} question{qCount !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
              <Clock className="w-3 h-3" />
              {new Date(sheet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {sheet.description && <p className="text-xs text-(--text-disabled) mt-1 line-clamp-1">{sheet.description}</p>}
          {status === "rejected" && sheet.rejectionReason && (
            <p className="flex items-center gap-1 text-xs text-red-400/80 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />{sheet.rejectionReason}
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0"
          onDragStart={(e) => e.stopPropagation()}
          onClick={(e)  => e.stopPropagation()}
        >
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-elevated) transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Preview
          </button>

          {confirmDel ? (
            <div className="flex items-center gap-1.5">
              <button onClick={() => { onDelete(sheet._id); setConfirmDel(false); }} className="px-2.5 py-1 rounded text-xs bg-red-500 text-white font-semibold">Delete</button>
              <button onClick={() => setConfirmDel(false)} className="px-2.5 py-1 rounded text-xs border border-(--border-subtle) text-(--text-muted)">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-red-400/80 hover:bg-red-500/[0.06] transition-colors">
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
            <pre className="text-[11px] text-(--text-faint) font-mono bg-(--bg-input) rounded-md p-3 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap break-words">
              {JSON.stringify({ ...sheet, content: `{topics: [${topicCount} topics, ${qCount} questions total]}` }, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DSASheetsList() {
  const sheets      = useQuery(api.sheets.adminGetAll) as any[] | undefined;
  const deleteSheet = useMutation(api.sheets.remove);
  const reorderMut  = useMutation(api.sheets.reorderSheets);

  const [filter,      setFilter]      = useState<FilterStatus>("all");
  const [localOrder,  setLocalOrder]  = useState<any[] | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const dragSrcIdx  = useRef<number | null>(null);
  const lastSwapRef = useRef<number>(0);

  async function handleDelete(id: Id<"dsaSheets">) {
    try { await deleteSheet({ id }); toast.success("Sheet deleted"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  }

  const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData("text/plain", String(idx));
    e.dataTransfer.effectAllowed = "move";
    dragSrcIdx.current = idx;
    setDraggingIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragSrcIdx.current === null || dragSrcIdx.current === idx) return;
    const now = Date.now();
    if (now - lastSwapRef.current < 100) return;
    lastSwapRef.current = now;

    setLocalOrder((prev) => {
      const base = prev ?? [...(sheets ?? [])]
        .filter((s: any) => (s.status ?? "published") === "published")
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      const next    = [...base];
      const [moved] = next.splice(dragSrcIdx.current!, 1);
      next.splice(idx, 0, moved);
      dragSrcIdx.current = idx;
      return next;
    });
  }, [sheets]);

  const handleDragEnd = useCallback(() => {
    dragSrcIdx.current = null;
    setDraggingIdx(null);
  }, []);

  async function handleSaveOrder() {
    if (!localOrder) return;
    setSavingOrder(true);
    try {
      await reorderMut({ orderedIds: localOrder.map((s: any) => s._id) });
      toast.success("Order saved");
      setLocalOrder(null);
      setReorderMode(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save order");
    } finally { setSavingOrder(false); }
  }

  function handleCancelReorder() {
    setLocalOrder(null); setReorderMode(false);
    dragSrcIdx.current = null; setDraggingIdx(null);
  }

  function resetFilter(key: FilterStatus) {
    setFilter(key); setReorderMode(false);
    setLocalOrder(null); dragSrcIdx.current = null; setDraggingIdx(null);
  }

  const publishedSheets = (sheets ?? [])
    .filter((s: any) => (s.status ?? "published") === "published")
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  const orderedPublished  = localOrder ?? publishedSheets;
  const isDraggingEnabled = filter === "published" && reorderMode;

  const shown = !sheets ? [] :
    filter === "all"
      ? [...sheets].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      : sheets.filter((s: any) => (s.status ?? "published") === filter);

  const shownWithOrder = filter === "published" ? orderedPublished : shown;

  const countFor = (f: FilterStatus) => !sheets ? 0 :
    f === "all" ? sheets.length :
    sheets.filter((s: any) => (s.status ?? "published") === f).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-1">DSA Sheets</h2>
          <p className="text-sm text-(--text-faint)">
            {sheets === undefined ? "Loading…" : `${sheets.length} sheet${sheets.length !== 1 ? "s" : ""} across all instructors`}
          </p>
        </div>
        {filter === "published" && !reorderMode && publishedSheets.length > 1 && (
          <button onClick={() => setReorderMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-(--border-subtle) text-(--text-muted) hover:bg-(--bg-hover) transition-colors shrink-0">
            <GripVertical className="w-3.5 h-3.5" />Reorder
          </button>
        )}
      </div>

      {reorderMode && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-[rgba(58,94,255,0.06)] border border-[rgba(58,94,255,0.2)]">
          <div className="flex items-center gap-2">
            <GripVertical className="w-3.5 h-3.5 text-[#3A5EFF]" />
            <p className="text-sm text-(--text-secondary)">Drag rows to set the order students see on the explore page.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleCancelReorder} disabled={savingOrder} className="px-3 py-1.5 rounded-md text-xs border border-(--border-subtle) text-(--text-muted) hover:bg-(--bg-hover) transition-colors">Cancel</button>
            <button onClick={handleSaveOrder} disabled={savingOrder || !localOrder} className={`px-3 py-1.5 rounded-md text-xs font-medium bg-[#3A5EFF] hover:bg-[#4a6aff] text-white transition-colors ${!localOrder || savingOrder ? "opacity-50 cursor-not-allowed" : ""}`}>
              {savingOrder ? "Saving…" : "Save Order"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-px p-1 rounded-lg bg-(--bg-input) border border-(--border-subtle) w-fit">
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => resetFilter(key)} className={`px-3 py-1.5 rounded-md text-xs transition-colors ${filter === key ? "bg-(--bg-active) text-(--text-primary)" : "text-(--text-muted) hover:text-(--text-secondary)"}`}>
            {label}
            {sheets !== undefined && (
              <span className={`ml-1 tabular-nums text-[10px] ${filter === key ? "text-(--text-muted)" : "text-(--text-disabled)"}`}>{countFor(key)}</span>
            )}
          </button>
        ))}
      </div>

      {sheets === undefined ? (
        <div className="flex justify-center py-16"><div className="w-4 h-4 border-2 border-[#3A5EFF]/30 border-t-[#3A5EFF] rounded-full animate-spin" /></div>
      ) : shownWithOrder.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-(--text-disabled)">
          <BookOpen className="w-7 h-7" />
          <p className="text-sm">{filter === "all" ? "No sheets yet" : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} sheets`}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-(--border-subtle) overflow-hidden">
          {shownWithOrder.map((sheet: any, idx: number) => (
            <SheetRow
              key={String(sheet._id)}
              sheet={sheet}
              idx={idx}
              onDelete={handleDelete}
              isDraggable={isDraggingEnabled}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e)  => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              isDragging={draggingIdx === idx}
            />
          ))}
        </div>
      )}

      {shownWithOrder.length > 0 && !reorderMode && (
        <p className="text-xs text-(--text-disabled) pt-2 border-t border-(--border-subtle)">
          {shownWithOrder.length} sheet{shownWithOrder.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}