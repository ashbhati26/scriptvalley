"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Pencil, Trash2, Layers, Tag, Hash } from "lucide-react";

interface Sheet {
  _id: Id<"dsaSheets">;
  slug: string; name: string; category?: string;
  description?: string; shortDescription?: string; order?: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  popular:          { bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.2)",  text: "#3A5EFF"  },
  "complete-dsa":   { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", text: "#818cf8"  },
  "quick-revision": { bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  text: "#4ade80"  },
  "topic-specific": { bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.2)", text: "#38bdf8"  },
};
const CATEGORY_LABELS: Record<string, string> = {
  popular: "Popular", "complete-dsa": "Complete DSA",
  "quick-revision": "Quick Revision", "topic-specific": "Topic Specific",
};

function CategoryBadge({ category }: { category?: string }) {
  const key   = category ?? "";
  const style = CATEGORY_COLORS[key] ?? { bg: "var(--bg-elevated)", border: "var(--border-subtle)", text: "var(--text-disabled)" };
  return (
    <span
      className="text-[10px] uppercase tracking-widest rounded-md px-2 py-0.5 border whitespace-nowrap"
      style={{ background: style.bg, borderColor: style.border, color: style.text }}
    >
      {(CATEGORY_LABELS[key] ?? key) || "—"}
    </span>
  );
}

export default function SheetsList({ onEdit, onCreate }: { onEdit: (slug: string) => void; onCreate: () => void }) {
  const sheets      = useQuery(api.sheets.adminGetAll) as Sheet[] | undefined;
  const removeSheet = useMutation(api.sheets.remove);

  if (sheets === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  async function handleDelete(id: Id<"dsaSheets">) {
    if (!confirm("Delete this sheet? This action cannot be undone.")) return;
    try { await removeSheet({ id }); toast.success("Sheet deleted"); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Admin</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">DSA Sheets</h1>
            <p className="text-sm text-text-faint">
              {sheets.length} {sheets.length === 1 ? "sheet" : "sheets"} · manage and organise DSA problem sets
            </p>
          </div>
          <button
            onClick={onCreate}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand hover:bg-brand-hover text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Sheet
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border-subtle overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-2.5 border-b border-border-subtle bg-bg-input">
          {[{ Icon: BookOpen, label: "Name" }, { Icon: Tag, label: "Category" }, { Icon: Hash, label: "ID" }]
            .map(({ Icon, label }) => (
              <span key={label} className="text-[10px] uppercase tracking-widest text-text-disabled flex items-center gap-1.5">
                <Icon className="w-3 h-3" />{label}
              </span>
            ))}
          <span className="text-[10px] uppercase tracking-widest text-text-disabled">Actions</span>
        </div>

        {sheets.length === 0 ? (
          <button
            onClick={onCreate}
            className="w-full flex flex-col items-center justify-center gap-2 py-16 text-text-disabled hover:text-text-faint transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-bg-hover flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-sm">No sheets yet — click to create one</span>
          </button>
        ) : (
          <AnimatePresence initial={false}>
            {sheets.map((s, idx) => (
              <motion.div
                key={String(s._id)}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.14, delay: idx * 0.025 }}
                className="group flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-4 py-3.5 border-t border-border-subtle hover:bg-bg-hover transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-secondary truncate">{s.name}</div>
                  {(s.description || s.shortDescription) && (
                    <div className="text-xs text-text-disabled mt-0.5 line-clamp-1">
                      {(s.description || s.shortDescription || "").replace(/<[^>]*>/g, "")}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                    <CategoryBadge category={s.category} />
                    <span className="text-[10px] font-mono text-text-disabled">{s.slug}</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <CategoryBadge category={s.category} />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-mono text-text-faint bg-bg-hover rounded px-2 py-1">{s.slug}</span>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => onEdit(s.slug)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs text-text-faint hover:text-text-secondary hover:bg-bg-elevated rounded-md px-2.5 py-1.5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs text-text-faint hover:text-red-400/70 hover:bg-red-500/6 rounded-md px-2.5 py-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}