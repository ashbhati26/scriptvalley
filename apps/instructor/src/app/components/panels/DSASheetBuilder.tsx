"use client";

import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus, Trash2, GripVertical, ChevronDown, X, Link2,
  Layers, Tag, AlignLeft, Hash, StickyNote,
  FileJson, Download, RotateCcw, Save, ArrowLeft,
  Send, Eye, AlertCircle, BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterStatus = "all" | "draft" | "pending_review" | "published" | "rejected";
type Difficulty   = "Easy" | "Medium" | "Hard";

interface LinkObj  { platform: string; url: string; }
interface Question { title: string; link: LinkObj; difficulty: Difficulty; }
interface Topic    { _key: string; topic: string; questions: Question[]; }

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444",
};

const PLATFORM_OPTIONS = [
  { key: "leetcode",    label: "LeetCode"    },
  { key: "gfg",         label: "GFG"         },
  { key: "hackerrank",  label: "HackerRank"  },
  { key: "hackerearth", label: "HackerEarth" },
  { key: "codechef",    label: "CodeChef"    },
  { key: "codeforces",  label: "Codeforces"  },
  { key: "others",      label: "Others"      },
];

const CATEGORY_OPTIONS = [
  "Popular", "Complete DSA", "Quick Revision", "Topic Specific", "Interview Prep",
];

// ─── Status chip ──────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",      border: "var(--border-subtle)"  },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.20)" },
  published:      { label: "Published", color: "var(--brand)",      bg: "var(--brand-subtle)",  border: "var(--brand-border)"  },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.20)" },
};

function StatusChip({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center font-semibold tracking-wide rounded-full border uppercase ${size === "md" ? "text-[10px] px-2 py-0.5" : "text-[9px] px-1.5 py-0.5"}`}
      style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      {m.label}
    </span>
  );
}

function FieldLabel({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">
      <Icon className="w-3 h-3" />{children}
    </label>
  );
}

function useDragSort<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragging = useRef<number | null>(null);
  return {
    handleDragStart: (idx: number) => { dragging.current = idx; },
    handleDragOver:  (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragging.current === null || dragging.current === idx) return;
      const next = [...items];
      const [item] = next.splice(dragging.current, 1);
      next.splice(idx, 0, item);
      dragging.current = idx;
      onReorder(next);
    },
    handleDragEnd: () => { dragging.current = null; },
  };
}

function makeSlug(v = "") {
  return v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function emptyQuestion(): Question {
  return { title: "", link: { platform: "leetcode", url: "" }, difficulty: "Medium" };
}

function emptyTopic(): Topic {
  return { _key: crypto.randomUUID(), topic: "New Topic", questions: [] };
}

// ─── Question row — exact SheetForm QuestionRow ───────────────────────────────
function QuestionRow({ q, qi, onUpdate, onRemove, onDragStart, onDragOver, onDragEnd }: {
  q: Question; qi: number;
  onUpdate: (patch: Partial<Question>) => void; onRemove: () => void;
  onDragStart: (i: number) => void; onDragOver: (e: React.DragEvent, i: number) => void; onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(qi)}
      onDragOver={(e) => onDragOver(e, qi)}
      onDragEnd={onDragEnd}
      className="group relative rounded-md border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) transition-colors duration-100"
    >
      {/* Difficulty accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full"
        style={{ background: DIFFICULTY_COLOR[q.difficulty] }} />

      <div className="pl-4 pr-3 py-2.5 space-y-2">
        {/* Row 1: grip + title + delete */}
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) group-hover:text-(--text-faint) shrink-0 cursor-grab active:cursor-grabbing transition-colors"
            onMouseDown={(e) => e.stopPropagation()} />
          <input
            value={q.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Problem title"
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-sm text-(--text-secondary) placeholder:text-(--text-disabled) border-0 outline-none"
          />
          <button type="button" onClick={onRemove} onMouseDown={(e) => e.stopPropagation()}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-(--text-disabled) hover:text-red-400 hover:bg-red-500/[0.06]">
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Row 2: URL + platform + difficulty */}
        <div className="flex flex-wrap gap-2 pl-5">
          <div className="flex items-center gap-1.5 flex-1 min-w-[160px] bg-(--bg-hover) rounded-md px-2.5 py-1.5">
            <Link2 className="w-3 h-3 text-(--text-faint) shrink-0" />
            <input
              value={q.link?.url || ""}
              onChange={(e) => onUpdate({ link: { ...(q.link || { platform: "leetcode" }), url: e.target.value } })}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Problem URL"
              className="bg-transparent text-xs text-(--text-muted) placeholder:text-(--text-disabled) border-0 outline-none w-full"
            />
          </div>

          {/* Platform select */}
          <select
            value={q.link?.platform || "leetcode"}
            onChange={(e) => onUpdate({ link: { ...(q.link || { url: "" }), platform: e.target.value } })}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-7 px-2 rounded-md bg-(--bg-hover) border-transparent text-xs text-(--text-muted) outline-none cursor-pointer"
          >
            {PLATFORM_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Difficulty select */}
          <select
            value={q.difficulty}
            onChange={(e) => onUpdate({ difficulty: e.target.value as Difficulty })}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-7 px-2 rounded-md border text-xs font-semibold outline-none cursor-pointer"
            style={{
              background:   `${DIFFICULTY_COLOR[q.difficulty]}0d`,
              borderColor:  `${DIFFICULTY_COLOR[q.difficulty]}30`,
              color:         DIFFICULTY_COLOR[q.difficulty],
            }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Topic block — exact SheetForm TopicBlock ─────────────────────────────────
function TopicBlock({ t, ti, onUpdateName, onRemove, onAddQuestion, onUpdateQuestion, onRemoveQuestion, onReorderQuestions, onTopicDragStart, onTopicDragOver, onTopicDragEnd }: {
  t: Topic; ti: number;
  onUpdateName: (v: string) => void; onRemove: () => void; onAddQuestion: () => void;
  onUpdateQuestion: (qi: number, p: Partial<Question>) => void; onRemoveQuestion: (qi: number) => void;
  onReorderQuestions: (qs: Question[]) => void;
  onTopicDragStart: (i: number) => void; onTopicDragOver: (e: React.DragEvent, i: number) => void; onTopicDragEnd: () => void;
}) {
  const [open, setOpen] = useState(true);
  const qDrag = useDragSort(t.questions, onReorderQuestions);

  return (
    <div
      draggable
      onDragStart={() => onTopicDragStart(ti)}
      onDragOver={(e) => onTopicDragOver(e, ti)}
      onDragEnd={onTopicDragEnd}
      className="rounded-lg border border-(--border-subtle) overflow-hidden hover:border-(--border-medium) transition-colors duration-100"
    >
      {/* Topic header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-(--bg-input)">
        <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) hover:text-(--text-faint) shrink-0 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()} />
        <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => setOpen((o) => !o)}
          className="shrink-0 text-(--text-disabled) hover:text-(--text-muted) transition-colors">
          <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.15 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>
        <input
          value={t.topic}
          onChange={(e) => onUpdateName(e.target.value)}
          placeholder="Topic name"
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-sm font-medium text-(--text-secondary) placeholder:text-(--text-disabled) border-0 outline-none"
        />
        <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) rounded-full px-2 py-0.5 shrink-0">
          {t.questions.length}q
        </span>
        <button type="button" onClick={(e) => { e.stopPropagation(); onAddQuestion(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="shrink-0 flex items-center gap-1 text-[10px] text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) rounded-md px-2 py-1 transition-colors">
          <Plus className="w-3 h-3" /><span className="hidden sm:inline">Add Q</span>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="shrink-0 p-1 rounded text-(--text-disabled) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden">
            <div className="px-3 pb-3 pt-2 space-y-1.5 bg-(--bg-base)">
              {t.questions.length === 0 ? (
                <button type="button" onClick={onAddQuestion}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-md border border-dashed border-(--border-subtle) text-sm text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
                  <Plus className="w-3.5 h-3.5" />Add first question
                </button>
              ) : (
                t.questions.map((q, qi) => (
                  <QuestionRow key={qi} q={q} qi={qi}
                    onUpdate={(p) => onUpdateQuestion(qi, p)}
                    onRemove={() => onRemoveQuestion(qi)}
                    onDragStart={qDrag.handleDragStart}
                    onDragOver={qDrag.handleDragOver}
                    onDragEnd={qDrag.handleDragEnd}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET EDITOR — SheetForm pattern
// ═══════════════════════════════════════════════════════════════════════════════
function SheetEditor({ sheet, onBack }: { sheet: any | null; onBack: () => void }) {
  const isNew    = sheet === null;
  const canEdit  = true; // instructor can always edit — saving resets published to draft for re-review

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name,        setNameRaw]     = useState(sheet?.name        ?? "");
  const [category,    setCategory]    = useState(sheet?.category    ?? "");
  const [description, setDescription] = useState(sheet?.description ?? "");
  const [notes,       setNotes]       = useState<string[]>(sheet?.note ?? []);
  const [topics,      setTopics]      = useState<Topic[]>(
    (sheet?.content?.topics ?? sheet?.topics ?? []).map((t: any) => ({
      _key:      crypto.randomUUID(),
      topic:     t.topic ?? t.name ?? "",
      questions: (t.questions ?? []).map((q: any) => ({
        title:      q.title ?? "",
        link:       q.link  ?? { platform: q.platform ?? "leetcode", url: q.url ?? "" },
        difficulty: (q.difficulty ?? "Medium") as Difficulty,
      })),
    }))
  );
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  function setName(v: string) { setNameRaw(v); }

  // Topic helpers
  function addTopic()                               { setTopics([...topics, emptyTopic()]); }
  function removeTopic(i: number)                   { setTopics(topics.filter((_, j) => j !== i)); }
  function updateTopicName(i: number, v: string)    { setTopics(topics.map((t, j) => j === i ? { ...t, topic: v } : t)); }
  function reorderTopics(next: Topic[])             { setTopics(next); }
  function addQuestion(ti: number)                  { setTopics(topics.map((t, i) => i === ti ? { ...t, questions: [...t.questions, emptyQuestion()] } : t)); }
  function updateQuestion(ti: number, qi: number, p: Partial<Question>) { setTopics(topics.map((t, i) => i === ti ? { ...t, questions: t.questions.map((q, j) => j === qi ? { ...q, ...p } : q) } : t)); }
  function removeQuestion(ti: number, qi: number)   { setTopics(topics.map((t, i) => i === ti ? { ...t, questions: t.questions.filter((_, j) => j !== qi) } : t)); }
  function reorderQuestions(ti: number, qs: Question[]) { setTopics(topics.map((t, i) => i === ti ? { ...t, questions: qs } : t)); }

  const topicDrag = useDragSort(topics, reorderTopics);
  const totalQ    = topics.reduce((a, t) => a + t.questions.length, 0);

  // JSON import
  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const p = JSON.parse(String(r.result || "{}"));
        setNameRaw(p.name ?? "");
        setCategory(p.category ?? "");
        setDescription(p.description ?? "");
        setNotes(p.note ?? p.notes ?? []);
        setTopics((p.topics ?? p.content?.topics ?? []).map((t: any) => ({
          _key:      crypto.randomUUID(),
          topic:     t.topic ?? t.name ?? "",
          questions: (t.questions ?? []).map((q: any) => ({
            title:      q.title ?? "",
            link:       q.link ?? { platform: q.platform ?? "leetcode", url: q.url ?? "" },
            difficulty: (q.difficulty ?? "Medium") as Difficulty,
          })),
        })));
        toast.success("Imported JSON");
      } catch { toast.error("Invalid JSON"); }
      finally { if (fileRef.current) fileRef.current.value = ""; }
    };
    r.readAsText(f);
  }

  // JSON export
  function onExport() {
    const out = { name, category, description, note: notes, topics: topics.map(t => ({ topic: t.topic, questions: t.questions })) };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${makeSlug(name) || "sheet"}.json`;
    a.click();
  }

  const createMut   = useMutation(api.sheets.createDraftSheet);
  const updateMut   = useMutation(api.sheets.updateDraftSheet);
  const submitMut   = useMutation(api.sheets.submitSheetForReview);
  const withdrawMut = useMutation(api.sheets.withdrawSheetFromReview);
  const deleteMut   = useMutation(api.sheets.deleteMySheet);

  async function handleSave() {
    if (!name.trim()) { toast.error("Sheet name is required"); return; }
    setSaving(true);
    try {
      const payload = {
        name:        name.trim(),
        category:    category.trim() || undefined,
        description: description.trim() || undefined,
        note:        notes.filter(Boolean),
        content: {
          topics: topics.map((t) => ({
            topic:     t.topic.trim(),
            questions: t.questions.filter(q => q.title.trim()).map(q => ({
              title:      q.title.trim(),
              link:       q.link,
              difficulty: q.difficulty,
            })),
          })),
        },
      };
      if (isNew) { await createMut(payload as any);                               toast.success("Saved as draft"); }
      else       { await updateMut({ id: sheet._id, ...payload } as any);         toast.success("Updated");        }
      onBack();
    } catch (e: any) { toast.error(e?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  async function handleSubmit()  { try { await submitMut({ id: sheet._id });   toast.success("Submitted"); onBack(); } catch (e: any) { toast.error(e?.message); } }
  async function handleWithdraw(){ try { await withdrawMut({ id: sheet._id }); toast.success("Withdrawn"); onBack(); } catch (e: any) { toast.error(e?.message); } }
  async function handleDelete()  { try { await deleteMut({ id: sheet._id });   toast.success("Deleted");   onBack(); } catch (e: any) { toast.error(e?.message); } }

  const isPending   = sheet?.status === "pending_review";
  const isPublished = sheet?.status === "published";

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 max-w-4xl space-y-8">

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />

      {/* Page header — exact SheetForm header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">DSA Sheets</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-(--text-faint) hover:text-(--text-muted) transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />Sheets
              </button>
              {sheet && <><span className="text-(--text-disabled)">/</span><StatusChip status={sheet.status} size="md" /></>}
            </div>
            <h2 className="text-2xl font-semibold text-(--text-primary) mb-1">
              {isNew ? "Create New Sheet" : "Edit Sheet"}
            </h2>
            <p className="text-sm text-(--text-faint)">Configure metadata, topics and questions</p>
          </div>

          {/* Toolbar — Import / Export / Reset / Delete */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            {[
              { label: "Import", Icon: FileJson,  fn: () => fileRef.current?.click() },
              { label: "Export", Icon: Download,  fn: onExport },
              ...(canEdit ? [{ label: "Reset",  Icon: RotateCcw, fn: () => { setNameRaw(""); setCategory(""); setDescription(""); setNotes([]); setTopics([]); } }] : []),
            ].map(({ label, Icon, fn }) => (
              <button key={label} type="button" onClick={fn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) transition-colors">
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
            {sheet && (
              confirmDel ? (
                <div className="flex items-center gap-1.5">
                  <button onClick={handleDelete} className="px-2.5 py-1 rounded text-xs bg-red-500 text-white font-semibold">Delete</button>
                  <button onClick={() => setConfirmDel(false)} className="px-2.5 py-1 rounded text-xs border border-(--border-subtle) text-(--text-muted)">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDel(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />Delete
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Banners */}
      {sheet?.status === "rejected" && sheet?.rejectionReason && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.05]">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-px" />
          <div><p className="text-xs font-semibold text-red-500">Rejected by admin</p><p className="text-xs text-(--text-faint) mt-0.5">{sheet.rejectionReason}</p></div>
        </div>
      )}
      {isPublished && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-(--brand-border) bg-(--brand-subtle) text-(--brand) text-xs font-medium">
          <Eye className="w-3.5 h-3.5 shrink-0" />
          This sheet is live. Saving changes will move it back to draft for re-review.
        </div>
      )}

      {/* ── Metadata fields — exact SheetForm grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel icon={Hash}>Sheet Name *</FieldLabel>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit}
            placeholder="e.g. Striver A2Z Sheet"
            className="w-full h-8 bg-(--bg-input) border border-transparent rounded-md px-3 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors" />
        </div>

        <div>
          <FieldLabel icon={Hash}>Auto Slug</FieldLabel>
          <div className="h-8 flex items-center px-3 rounded-md bg-(--bg-elevated) text-xs font-mono text-(--text-disabled) overflow-hidden">
            {makeSlug(name) || <span className="italic">auto-generated</span>}
          </div>
        </div>

        <div>
          <FieldLabel icon={Tag}>Category</FieldLabel>
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={!canEdit}
            className="w-full h-8 bg-(--bg-input) border border-transparent rounded-md px-2 text-sm text-(--text-secondary) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors">
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((o) => <option key={o} value={o.toLowerCase().replace(/\s+/g, "-")}>{o}</option>)}
          </select>
        </div>

        <div>
          <FieldLabel icon={Layers}>Description</FieldLabel>
          <input value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit}
            placeholder="Short description of this sheet"
            className="w-full h-8 bg-(--bg-input) border border-transparent rounded-md px-3 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors" />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel icon={StickyNote}>Notes (one per line)</FieldLabel>
          <textarea
            value={notes.join("\n")}
            onChange={(e) => setNotes(e.target.value.split("\n"))}
            disabled={!canEdit}
            placeholder="Each line becomes a note shown on the sheet page…"
            rows={2}
            className="w-full resize-none bg-(--bg-input) border border-transparent rounded-md px-3 py-2 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors"
          />
        </div>
      </div>

      {/* ── Topics section — exact SheetForm topics layout ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Content</p>
            <p className="text-sm font-medium text-(--text-secondary)">
              Topics
              <span className="ml-2 text-xs text-(--text-disabled)">{topics.length}t · {totalQ}q</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {topics.length > 0 && canEdit && (
              <button type="button" onClick={() => setTopics([])}
                className="flex items-center gap-1 text-xs text-(--text-faint) hover:text-red-400 transition-colors">
                <Trash2 className="w-3 h-3" />Clear all
              </button>
            )}
            {canEdit && (
              <button type="button" onClick={addTopic}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors">
                <Plus className="w-3 h-3" />Add Topic
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {topics.length === 0 ? (
            <button type="button" onClick={canEdit ? addTopic : undefined}
              className="w-full flex flex-col items-center justify-center gap-2 py-10 rounded-lg border border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
              <div className="w-8 h-8 rounded-md bg-(--bg-hover) flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm">No topics yet — click to add one</span>
            </button>
          ) : (
            topics.map((t, ti) => (
              <TopicBlock
                key={t._key} t={t} ti={ti}
                onUpdateName={(v) => updateTopicName(ti, v)}
                onRemove={() => removeTopic(ti)}
                onAddQuestion={() => addQuestion(ti)}
                onUpdateQuestion={(qi, p) => updateQuestion(ti, qi, p)}
                onRemoveQuestion={(qi) => removeQuestion(ti, qi)}
                onReorderQuestions={(qs) => reorderQuestions(ti, qs)}
                onTopicDragStart={topicDrag.handleDragStart}
                onTopicDragOver={topicDrag.handleDragOver}
                onTopicDragEnd={topicDrag.handleDragEnd}
              />
            ))
          )}
        </div>

        {topics.length > 0 && canEdit && (
          <button type="button" onClick={addTopic}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
            <Plus className="w-3.5 h-3.5" />Add another topic
          </button>
        )}
      </div>

      {/* ── Save footer — exact SheetForm footer ── */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-(--border-subtle)">
        <p className="text-xs text-(--text-disabled)">{topics.length} topics · {totalQ} questions</p>
        <div className="flex items-center gap-2">
          {isPending ? (
            <button onClick={handleWithdraw}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs font-semibold">
              Withdraw
            </button>
          ) : canEdit && !isNew ? (
            <button onClick={handleSubmit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--brand-border) text-(--brand) text-xs font-semibold hover:bg-(--brand-subtle) transition-colors">
              <Send className="w-3 h-3" />{isPublished ? "Re-submit" : "Submit for review"}
            </button>
          ) : null}
          {canEdit && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-medium disabled:opacity-50 transition-colors">
              {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : isNew ? "Create Sheet" : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET LIST
// ═══════════════════════════════════════════════════════════════════════════════
const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

export default function DSASheetBuilder() {
  const { isLoaded, isSignedIn } = useAuth();
  const skip   = !isLoaded || !isSignedIn;
  const sheets = useQuery(api.sheets.getMySheets, skip ? "skip" : undefined) as any[] | undefined;
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [filter,  setFilter]  = useState<FilterStatus>("all");

  if (editing !== null) return <SheetEditor sheet={editing === "new" ? null : editing} onBack={() => setEditing(null)} />;

  const shown    = filter === "all" ? (sheets ?? []) : (sheets ?? []).filter((s: any) => (s.status ?? "published") === filter);
  const countFor = (f: FilterStatus) => !sheets ? 0 : f === "all" ? sheets.length : sheets.filter((s: any) => (s.status ?? "published") === f).length;

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 max-w-4xl space-y-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Content</p>
          <h2 className="text-2xl font-semibold text-(--text-primary)">DSA Sheets</h2>
          <p className="text-xs text-(--text-faint) mt-1">Curate problem sets grouped by topic — LeetCode, GFG, etc.</p>
        </div>
        <button onClick={() => setEditing("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold transition-colors shrink-0">
          <Plus className="w-4 h-4" />New Sheet
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-(--bg-elevated) border border-(--border-subtle) w-fit">
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === key ? "bg-(--bg-base) text-(--text-primary) shadow-sm" : "text-(--text-faint) hover:text-(--text-muted)"
            }`}>
            {label}
            {sheets !== undefined && (
              <span className={`ml-1 tabular-nums ${filter === key ? "text-(--text-muted)" : "text-(--text-disabled)"}`}>
                {countFor(key)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {sheets === undefined ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) h-24 animate-pulse" />)}</div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-(--text-disabled)">
          <Layers className="w-8 h-8" />
          <p className="text-sm">{filter === "all" ? "No DSA sheets yet" : `No ${FILTERS.find(f => f.key === filter)?.label.toLowerCase()} sheets`}</p>
          {filter === "all" && (
            <button onClick={() => setEditing("new")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-semibold transition-colors">
              <Plus className="w-3.5 h-3.5" />Build your first sheet
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {shown.map((sheet: any, i: number) => {
              const topicCount = sheet.content?.topics?.length ?? sheet.topics?.length ?? 0;
              const qCount     = (sheet.content?.topics ?? sheet.topics ?? []).reduce((n: number, t: any) => n + (t.questions?.length ?? 0), 0);
              return (
                <motion.div key={String(sheet._id)}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03, duration: 0.15 }}
                  onClick={() => setEditing(sheet)}
                  className="group rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) hover:bg-(--bg-hover) p-5 cursor-pointer transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <StatusChip status={sheet.status ?? "published"} />
                        {sheet.category && <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-(--border-subtle) bg-(--bg-input) text-(--text-disabled)">{sheet.category}</span>}
                        <span className="text-[9px] text-(--text-disabled)">{topicCount} topic{topicCount !== 1 ? "s" : ""}</span>
                        <span className="text-[9px] text-(--text-disabled)">{qCount} question{qCount !== 1 ? "s" : ""}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-(--text-primary) group-hover:text-(--brand) transition-colors">{sheet.name}</h3>
                      {sheet.description && <p className="text-xs text-(--text-faint) mt-1 line-clamp-1">{sheet.description}</p>}
                      {sheet.status === "rejected" && sheet.rejectionReason && (
                        <p className="mt-2 text-xs text-red-500/80 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />{sheet.rejectionReason}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-(--text-disabled) shrink-0">
                      {new Date(sheet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
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