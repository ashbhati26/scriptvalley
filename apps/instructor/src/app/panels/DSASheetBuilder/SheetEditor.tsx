"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Send, AlertCircle, FileJson, Download, Plus, Layers, Hash, Tag, AlignLeft, Upload } from "lucide-react";
import {
  Topic, SubTopic, Question,
  emptyTopic, emptyQuestion,
  makeSlug, stripSheetKeys, hydrateTopics, countQuestions, CATEGORY_OPTIONS,
} from "./sheetTypes";
import { StatusChip, FieldLabel, useDragSort } from "../shared/ui";
import TopicBlock from "./TopicBlock";
import BulkImport from "./BulkImport";

interface Props { sheet: any | null; canEdit: boolean; onBack: () => void; }

export default function SheetEditor({ sheet, canEdit, onBack }: Props) {
  const isNew   = sheet === null;
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name,        setName]        = useState(sheet?.name        ?? "");
  const [category,    setCategory]    = useState(sheet?.category    ?? "");
  const [description, setDescription] = useState(sheet?.description ?? "");
  const [notes,       setNotes]       = useState<string[]>(sheet?.notes ?? sheet?.note ?? []);
  const [topics,      setTopics]      = useState<Topic[]>(hydrateTopics(sheet?.content?.topics ?? sheet?.topics ?? []));
  const [saving,      setSaving]      = useState(false);
  const [showBulk,    setShowBulk]    = useState(false);

  const totalQ    = countQuestions(topics);
  const topicDrag = useDragSort(topics, setTopics);

  const createMut   = useMutation(api.sheets.createDraftSheet);
  const updateMut   = useMutation(api.sheets.updateDraftSheet);
  const submitMut   = useMutation(api.sheets.submitSheetForReview);
  const withdrawMut = useMutation(api.sheets.withdrawSheetFromReview);

  function addTopic()                                      { setTopics([...topics, emptyTopic()]); }
  function removeTopic(i: number)                          { setTopics(topics.filter((_, j) => j !== i)); }
  function patchTopic(i: number, p: Partial<Topic>)        { setTopics(topics.map((t, j) => j === i ? { ...t, ...p } : t)); }
  function updateTopicName(i: number, v: string)           { patchTopic(i, { topic: v }); }
  function toggleSubTopics(i: number)                      { patchTopic(i, { useSubTopics: !topics[i].useSubTopics }); }
  function addQuestion(ti: number)                         { patchTopic(ti, { questions: [...topics[ti].questions, emptyQuestion()] }); }
  function updateQuestion(ti: number, qi: number, p: Partial<Question>) { patchTopic(ti, { questions: topics[ti].questions.map((q, j) => j === qi ? { ...q, ...p } : q) }); }
  function removeQuestion(ti: number, qi: number)          { patchTopic(ti, { questions: topics[ti].questions.filter((_, j) => j !== qi) }); }
  function reorderQuestions(ti: number, qs: Question[])    { patchTopic(ti, { questions: qs }); }
  function addSubTopic(ti: number)                         { patchTopic(ti, { subTopics: [...(topics[ti].subTopics ?? []), { _key: crypto.randomUUID(), name: "New Sub-topic", questions: [] }] }); }
  function updateSubTopic(ti: number, si: number, p: Partial<SubTopic>) { patchTopic(ti, { subTopics: (topics[ti].subTopics ?? []).map((st, j) => j === si ? { ...st, ...p } : st) }); }
  function removeSubTopic(ti: number, si: number)          { patchTopic(ti, { subTopics: (topics[ti].subTopics ?? []).filter((_, j) => j !== si) }); }
  function reorderSubTopics(ti: number, sts: SubTopic[])   { patchTopic(ti, { subTopics: sts }); }

  function handleBulkImport(questions: Question[]) {
    const t = emptyTopic(); t.topic = "Imported Questions"; t.questions = questions;
    setTopics([...topics, t]); toast.success(`Imported ${questions.length} questions`);
  }

  function onJsonImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const p = JSON.parse(String(r.result || "{}"));
        setName(p.name ?? ""); setCategory(p.category ?? ""); setDescription(p.description ?? "");
        setNotes(p.notes ?? p.note ?? []); setTopics(hydrateTopics(p.topics ?? p.content?.topics ?? []));
        toast.success("Imported JSON");
      } catch { toast.error("Invalid JSON"); }
      finally { if (fileRef.current) fileRef.current.value = ""; }
    };
    r.readAsText(f);
  }

  function onExport() {
    const blob = new Blob([JSON.stringify({ name, category, description, notes, topics: stripSheetKeys(topics) }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = `${makeSlug(name) || "sheet"}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  async function handleSave() {
    if (!name.trim()) { toast.error("Sheet name is required"); return; }
    setSaving(true);
    try {
      const payload = { name: name.trim(), category: category.trim() || undefined, description: description.trim() || undefined, note: notes.filter(Boolean), content: { topics: stripSheetKeys(topics) } };
      if (isNew) { await createMut(payload as any); toast.success("Saved as draft"); }
      else       { await updateMut({ id: sheet._id, ...payload } as any); toast.success("Updated"); }
      onBack();
    } catch (e: any) { toast.error(e?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  async function handleSubmit()  { try { await submitMut({ id: sheet._id }); toast.success("Submitted for review"); onBack(); } catch (e: any) { toast.error(e?.message ?? "Submit failed"); } }
  async function handleWithdraw() { try { await withdrawMut({ id: sheet._id }); toast.success("Withdrawn"); onBack(); } catch (e: any) { toast.error(e?.message ?? "Withdraw failed"); } }

  const isPending   = sheet?.status === "pending_review";
  const isPublished = sheet?.status === "published";

  return (
    <>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onJsonImport} />
      <AnimatePresence>{showBulk && <BulkImport onImport={handleBulkImport} onClose={() => setShowBulk(false)} />}</AnimatePresence>

      <div style={{ padding: "36px 32px 88px", maxWidth: 720, width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5" style={{ marginBottom: 16 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-[12px] sv-text-faint sv-btn-ghost" style={{ padding: "3px 6px 3px 0" }}>
              <ArrowLeft size={12} />DSA Sheets
            </button>
            {sheet && (<><span className="sv-text-disabled text-[12px]">/</span><StatusChip status={sheet.status} /></>)}
          </div>

          {/* Title + toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold sv-text-primary" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>
              {isNew ? "New Sheet" : "Edit Sheet"}
            </h2>
            <div className="flex items-center gap-1.5">
              {canEdit && [
                { Icon: Upload,   label: "Bulk import",  onClick: () => setShowBulk(true) },
                { Icon: FileJson, label: "Import JSON",  onClick: () => fileRef.current?.click() },
                { Icon: Download, label: "Export",       onClick: onExport },
              ].map(({ Icon, label, onClick }) => (
                <button key={label} onClick={onClick} className="sv-btn-ghost flex items-center gap-1.5 text-[12px]"
                  style={{ padding: "5px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <Icon size={11} />{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Read-only banner */}
        {!canEdit && !isNew && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", marginBottom: 20, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
              <path d="M10 5.5V4a3.5 3.5 0 00-7 0v1.5A1.5 1.5 0 001.5 7v4A1.5 1.5 0 003 12.5h7a1.5 1.5 0 001.5-1.5V7A1.5 1.5 0 0010 5.5zM5 4a1.5 1.5 0 013 0v1.5H5V4z" fill="var(--text-disabled)" />
            </svg>
            <p style={{ fontSize: 12, color: "var(--text-disabled)" }}>
              <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Read-only</span> — only the sheet owner can edit this sheet.
            </p>
          </div>
        )}

        {/* Rejection reason */}
        {sheet?.status === "rejected" && sheet?.rejectionReason && (
          <div className="flex items-start gap-2.5 sv-rounded-lg" style={{ padding: "12px 16px", marginBottom: 28, border: "1px solid var(--danger-border)", background: "var(--danger-bg)" }}>
            <AlertCircle size={14} className="sv-text-danger flex-shrink-0 mt-px" />
            <div>
              <p className="text-[12px] font-semibold sv-text-danger" style={{ marginBottom: 3 }}>Rejected by admin</p>
              <p className="text-[12px] sv-text-danger" style={{ opacity: 0.85 }}>{sheet.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Metadata card */}
        <div className="sv-bg-elevated sv-rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)", marginBottom: 28 }}>
          <div className="sv-bg-hover" style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
            <p className="sv-section-label">Details</p>
          </div>
          <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <FieldLabel icon={Hash}>Sheet Name *</FieldLabel>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Striver's A2Z Sheet" className="sv-input" style={{ height: 36 }} />
            </div>
            <div>
              <FieldLabel icon={AlignLeft}>Description</FieldLabel>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this sheet about?" rows={2}
                className="sv-input resize-none" style={{ height: "auto", padding: "9px 11px", lineHeight: 1.6 }} />
            </div>
            <div>
              <FieldLabel icon={Tag}>Category</FieldLabel>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="sv-input"
                style={{ height: 36, appearance: "none", paddingRight: 24, cursor: "pointer" }}>
                <option value="">— None —</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Topics section */}
        <div style={{ marginBottom: 28 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <div>
              <p className="sv-section-label" style={{ marginBottom: 4 }}>Topics</p>
              <p className="text-[13px] font-medium sv-text-secondary" style={{ letterSpacing: "-0.008em" }}>
                {topics.length} topic{topics.length !== 1 ? "s" : ""} · {countQuestions(topics)} question{countQuestions(topics) !== 1 ? "s" : ""}
              </p>
            </div>
            {canEdit && (
              <button onClick={addTopic} className="sv-btn-secondary flex items-center gap-1 text-[12px] font-medium"
                style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)" }}>
                <Plus size={11} />Add Topic
              </button>
            )}
          </div>

          {topics.length === 0 ? (
            <button onClick={addTopic} className="sv-dashed w-full flex items-center justify-center gap-3" style={{ padding: "36px 24px" }}>
              <div className="flex items-center justify-center sv-rounded-md sv-bg-elevated" style={{ width: 36, height: 36, border: "1px solid var(--border-subtle)" }}>
                <Layers size={15} className="sv-text-disabled" />
              </div>
              <span className="text-[13px] sv-text-faint">No topics yet — click to add one</span>
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topics.map((t, ti) => (
                <TopicBlock
                  key={t._key} t={t} ti={ti}
                  onUpdateName={(v)         => updateTopicName(ti, v)}
                  onRemove={()              => removeTopic(ti)}
                  onToggleSubTopics={()     => toggleSubTopics(ti)}
                  onAddQuestion={()         => addQuestion(ti)}
                  onUpdateQuestion={(qi, p) => updateQuestion(ti, qi, p)}
                  onRemoveQuestion={(qi)    => removeQuestion(ti, qi)}
                  onReorderQuestions={(qs)  => reorderQuestions(ti, qs)}
                  onAddSubTopic={()         => addSubTopic(ti)}
                  onUpdateSubTopic={(si, p) => updateSubTopic(ti, si, p)}
                  onRemoveSubTopic={(si)    => removeSubTopic(ti, si)}
                  onReorderSubTopics={(sts) => reorderSubTopics(ti, sts)}
                  onTopicDragStart={topicDrag.handleDragStart}
                  onTopicDragOver={topicDrag.handleDragOver}
                  onTopicDragEnd={topicDrag.handleDragEnd}
                />
              ))}
              <button onClick={addTopic} className="sv-dashed flex items-center justify-center gap-1.5 text-[12px]" style={{ padding: 11, marginTop: 2 }}>
                <Plus size={11} />Add another topic
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4" style={{ paddingTop: 24, marginTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-[12px] sv-text-disabled" style={{ letterSpacing: "-0.003em" }}>
            {topics.length} topic{topics.length !== 1 ? "s" : ""} · {totalQ} question{totalQ !== 1 ? "s" : ""}
          </p>
          {canEdit && (
            <div className="flex gap-2 items-center">
              {isPending ? (
                <button onClick={handleWithdraw} className="flex items-center gap-1.5 text-[13px] font-medium sv-text-warning cursor-pointer sv-rounded-md"
                  style={{ padding: "8px 14px", background: "var(--warning-bg)", border: "1px solid var(--warning-border)" }}>
                  Withdraw
                </button>
              ) : !isNew ? (
                <button onClick={handleSubmit} className="flex items-center gap-1.5 text-[13px] font-medium sv-text-brand cursor-pointer sv-rounded-md"
                  style={{ padding: "8px 14px", background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
                  <Send size={12} />{isPublished ? "Re-submit" : "Submit for review"}
                </button>
              ) : null}
              <button onClick={handleSave} disabled={saving} className="sv-btn-primary flex items-center gap-1.5 text-[13px] font-medium"
                style={{ padding: "8px 18px", borderRadius: "var(--radius-md)", letterSpacing: "-0.006em", boxShadow: "0 1px 3px rgba(58,94,255,0.25)", opacity: saving ? 0.75 : 1, cursor: saving ? "wait" : "pointer" }}>
                {saving
                  ? <div className="sv-spinner" style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  : <Save size={12} />}
                {saving ? "Saving…" : isNew ? "Create Sheet" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}