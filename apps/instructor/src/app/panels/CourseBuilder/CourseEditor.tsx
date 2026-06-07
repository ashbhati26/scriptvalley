"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import toast from "react-hot-toast";
import {
  ArrowLeft, Save, Send, RotateCcw, Download,
  Eye, AlertCircle, Hash, AlignLeft, Plus,
  LayoutList, FileText, ChevronDown, FileJson,
  FileUp, Trash2, Lock, CheckCircle2, Loader2,
} from "lucide-react";
import { useRef } from "react";
import {
  Module, CourseForm, CourseTemplate, CourseLevel,
  makeSlug, emptyModule, stripKeys, hydrateModules, LEVELS,
} from "./courseTypes";
import { StatusChip } from "./CourseShared";
import ModuleList from "./ModuleList";
import ModuleEditor from "./ModuleEditor";
import CourseJSONImport from "./CourseJSONImport";
import CoursePreview from "./CoursePreview";
import CoAuthorPanel from "./CoAuthorPanel";
import type { ImportResult } from "./CourseJSONImport";

interface Props { course: CourseForm | null; canEdit: boolean; onBack: () => void; }

const LEVEL_COLORS: Record<string, string> = {
  beginner: "var(--success)", intermediate: "var(--warning)",
  advanced: "var(--danger)", "all-levels": "var(--brand)",
};


// ─── CheatSheetUploader ───────────────────────────────────────────────────────
// Inline component — lives in CourseEditor so it shares the instructor app
// design system (sv-* classes) without any extra file.

function CheatSheetUploader({
  courseId, existingStorageId, existingFileName, canEdit,
}: {
  courseId:          string;
  existingStorageId?: string;
  existingFileName?:  string;
  canEdit:           boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing,  setRemoving]  = useState(false);
  const [localFile, setLocalFile] = useState<{ storageId: string; fileName: string } | null>(null);

  const genUrlMut  = useMutation(api.courses.generateCheatSheetUploadUrl);
  const saveMut    = useMutation(api.courses.saveCheatSheet);
  const removeMut  = useMutation(api.courses.removeCheatSheet);

  const activeStorageId = localFile?.storageId ?? existingStorageId;
  const activeFileName  = localFile?.fileName  ?? existingFileName;
  const hasSheet        = !!activeStorageId;

  async function handleFileSelect(file: File) {
    if (!file || file.type !== "application/pdf") {
      toast.error("Only PDF files are supported"); return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("PDF must be under 20 MB"); return;
    }
    setUploading(true);
    try {
      // Step 1 — get upload URL
      const uploadUrl = await genUrlMut();
      // Step 2 — PUT the file directly to Convex storage
      const res = await fetch(uploadUrl, {
        method:  "POST",
        headers: { "Content-Type": file.type },
        body:    file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      // Step 3 — save storageId to the course
      await saveMut({ courseId: courseId as any, storageId, fileName: file.name });
      setLocalFile({ storageId, fileName: file.name });
      toast.success("Cheat sheet uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Remove the cheat sheet PDF from this course?")) return;
    setRemoving(true);
    try {
      await removeMut({ courseId: courseId as any });
      setLocalFile(null);
      toast.success("Cheat sheet removed");
    } catch (e: any) {
      toast.error(e?.message ?? "Remove failed");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div style={{ marginTop: 28 }}>
      <p className="sv-section-label" style={{ marginBottom: 4 }}>Cheat Sheet / Revision PDF</p>
      <p className="text-[11px] sv-text-disabled" style={{ marginBottom: 12 }}>
        Students unlock <strong>preview</strong> at 40% progress and <strong>download</strong> at 50%.
      </p>

      <div className="sv-card overflow-hidden">
        {/* Header */}
        <div className="sv-bg-hover flex items-center justify-between gap-2"
          style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <FileUp size={13} className="sv-text-faint" />
            <span className="text-[13px] font-medium sv-text-secondary" style={{ letterSpacing: "-0.008em" }}>
              {hasSheet ? activeFileName : "No PDF uploaded"}
            </span>
          </div>
          {hasSheet && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] sv-text-success">
                <CheckCircle2 size={10} />Uploaded
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "12px 14px" }}>
          {!hasSheet ? (
            // Upload state
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
              {canEdit ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="sv-btn-secondary flex items-center gap-1.5 text-[12px]"
                  style={{ padding: "7px 14px", borderRadius: "var(--radius-md)", opacity: uploading ? 0.6 : 1 }}
                >
                  {uploading
                    ? <><Loader2 size={11} className="sv-spin-slow" />Uploading…</>
                    : <><FileUp size={11} />Upload PDF</>
                  }
                </button>
              ) : (
                <p className="text-[12px] sv-text-disabled italic">No cheat sheet uploaded yet.</p>
              )}
              <p className="text-[10px] sv-text-disabled" style={{ marginTop: 6 }}>
                Max 20 MB · PDF only
              </p>
            </div>
          ) : (
            // Uploaded state
            <div className="flex flex-col gap-3">
              {/* Access thresholds */}
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: Lock,         label: "Preview unlocks at",  value: "40% progress", color: "var(--warning)"  },
                  { icon: CheckCircle2, label: "Download unlocks at", value: "50% progress", color: "var(--success)"  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-2 text-[11px]">
                    <Icon size={10} style={{ color }} />
                    <span className="sv-text-disabled">{label}</span>
                    <span className="font-medium sv-text-secondary">{value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading || removing}
                    className="sv-btn-secondary flex items-center gap-1.5 text-[11px]"
                    style={{ padding: "5px 10px", borderRadius: "var(--radius-sm)", opacity: (uploading || removing) ? 0.6 : 1 }}
                  >
                    {uploading
                      ? <><Loader2 size={10} className="sv-spin-slow" />Uploading…</>
                      : <><FileUp size={10} />Replace</>
                    }
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={uploading || removing}
                    className="sv-btn-danger flex items-center gap-1.5 text-[11px]"
                    style={{ padding: "5px 10px", borderRadius: "var(--radius-sm)", opacity: (uploading || removing) ? 0.6 : 1 }}
                  >
                    {removing
                      ? <><Loader2 size={10} className="sv-spin-slow" />Removing…</>
                      : <><Trash2 size={10} />Remove</>
                    }
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourseEditor({ course, canEdit, onBack }: Props) {
  const isNew = course === null;

  const [title,       setTitle]       = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [template,    setTemplate]    = useState<CourseTemplate>(course?.template ?? "freeform");
  const [level,       setLevel]       = useState<CourseLevel | "">(course?.level ?? "");
  const [modules,     setModules]     = useState<Module[]>(isNew ? [] : hydrateModules(course?.modules ?? []));
  const [saving,      setSaving]      = useState(false);
  const [editingMod,  setEditingMod]  = useState<Module | null>(null);
  const [showImport,  setShowImport]  = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coAuthors,   setCoAuthors]   = useState<{ userId: string; name: string; email: string }[]>(
    (course as any)?.coAuthors ?? []
  );

  const createMut   = useMutation(api.courses.createCourse);
  const updateMut   = useMutation(api.courses.updateCourse);
  const submitMut   = useMutation(api.courses.submitCourseForReview);
  const withdrawMut = useMutation(api.courses.withdrawCourseFromReview);

  function addModule() { const m = emptyModule(modules.length); setModules((p) => [...p, m]); setEditingMod(m); }
  function saveModuleBack(updated: Module) { setModules((p) => p.map((m) => m._key === updated._key ? updated : m)); setEditingMod(null); }
  function handleImport(result: ImportResult) { setTitle(result.title); setDescription(result.description); setTemplate(result.template); setLevel(result.level); setModules(result.modules); }

  async function onSave() {
    if (!title.trim()) { toast.error("Course title is required"); return; }
    if (modules.length > 0) { for (const m of modules) { if (!m.title.trim()) { toast.error("All modules need a title"); return; } } }
    setSaving(true);
    try {
      const payload = { title: title.trim(), description: description.trim() || undefined, template, level: level || undefined, modules: stripKeys(modules) as any };
      if (isNew) { await createMut(payload as any); toast.success("Course created"); }
      else       { await updateMut({ id: (course as any)._id, ...payload } as any); toast.success("Saved"); }
      onBack();
    } catch (e: any) { toast.error(e?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  async function onSubmit() {
    if (!modules.length) { toast.error("Add at least one module before submitting"); return; }
    try { await submitMut({ id: (course as any)._id }); toast.success("Submitted"); onBack(); }
    catch (e: any) { toast.error(e?.message); }
  }

  async function onWithdraw() {
    try { await withdrawMut({ id: (course as any)._id }); toast.success("Withdrawn"); onBack(); }
    catch (e: any) { toast.error(e?.message); }
  }

  function handleExport() {
    if (!title.trim() && !modules.length) { toast.error("Nothing to export"); return; }
    const blob = new Blob([JSON.stringify({ title: title.trim() || "Untitled", description: description.trim() || undefined, template, level: level || undefined, modules: stripKeys(modules) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${makeSlug(title) || "course"}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success("Exported");
  }

  const isPending   = course?.status === "pending_review";
  const isPublished = course?.status === "published";

  if (editingMod) return (
    <ModuleEditor mod={editingMod} template={template} courseTitle={title} canEdit={canEdit} onBack={() => setEditingMod(null)} onSave={saveModuleBack} />
  );

  return (
    <>
      {showImport && <CourseJSONImport onImport={handleImport} onClose={() => setShowImport(false)} />}
      {showPreview && (
        <CoursePreview
          course={{ title, description, template, level: level || undefined, modules, slug: makeSlug(title), status: course?.status }}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="flex flex-col" style={{ minHeight: "calc(100vh - var(--navbar-height))" }}>

        {/* Topbar */}
        <div
          className="flex items-center justify-between gap-3 sv-bg-glass"
          style={{ position: "sticky", top: "var(--navbar-height)", zIndex: 20, padding: "0 20px", height: 44, borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <button onClick={onBack} className="sv-btn-ghost flex items-center gap-1 text-[12px] sv-text-faint flex-shrink-0" style={{ letterSpacing: "-0.003em" }}>
              <ArrowLeft size={12} />Courses
            </button>
            {course && (<><span className="sv-text-disabled text-[12px]">/</span><StatusChip status={course.status ?? "draft"} /></>)}
            {title && (<><span className="sv-text-disabled text-[12px]">/</span><span className="text-[12px] sv-text-muted sv-truncate">{title}</span></>)}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Preview always visible */}
            <button onClick={() => setShowPreview(true)} className="sv-btn-ghost flex items-center gap-1 text-[12px]"
              style={{ padding: "4px 9px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <Eye size={11} />Preview
            </button>

            {/* Edit-only actions */}
            {canEdit && (
              <>
                {[
                  { Icon: FileJson, label: "Import", onClick: () => setShowImport(true) },
                  { Icon: Download, label: "Export",  onClick: handleExport },
                ].map(({ Icon, label, onClick }) => (
                  <button key={label} onClick={onClick} className="sv-btn-ghost flex items-center gap-1 text-[12px]"
                    style={{ padding: "4px 9px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                    <Icon size={11} />{label}
                  </button>
                ))}

                {isPending ? (
                  <button onClick={onWithdraw} className="flex items-center gap-1 text-[12px] font-medium sv-text-warning cursor-pointer sv-rounded-md"
                    style={{ padding: "4px 10px", background: "var(--warning-bg)", border: "1px solid var(--warning-border)" }}>
                    <RotateCcw size={11} />Withdraw
                  </button>
                ) : !isNew ? (
                  <button onClick={onSubmit} className="flex items-center gap-1 text-[12px] font-medium sv-text-brand cursor-pointer sv-rounded-md"
                    style={{ padding: "4px 10px", background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
                    <Send size={11} />{isPublished ? "Re-submit" : "Submit"}
                  </button>
                ) : null}

                <button onClick={onSave} disabled={saving} className="sv-btn-primary flex items-center gap-1 text-[12px] font-medium"
                  style={{ padding: "4px 12px", borderRadius: "var(--radius-md)", opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer" }}>
                  {saving ? <div className="sv-spinner" style={{ width: 10, height: 10, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> : <Save size={11} />}
                  {saving ? "Saving…" : isNew ? "Create" : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Read-only banner */}
        {!canEdit && !isNew && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)" }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6.5 1.5a5 5 0 100 10 5 5 0 000-10zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3a.75.75 0 01-1.5 0v-2a.75.75 0 011.5 0v2z" fill="var(--text-disabled)" />
            </svg>
            <p style={{ fontSize: 12, color: "var(--text-disabled)" }}>
              <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Read-only</span> — you are not the owner or a co-author of this course.
            </p>
          </div>
        )}

        {/* Rejection banner */}
        {course?.status === "rejected" && course?.rejectionReason && (
          <div className="flex items-start gap-2.5" style={{ padding: "10px 20px", background: "var(--danger-bg)", borderBottom: "1px solid var(--danger-border)" }}>
            <AlertCircle size={13} className="sv-text-danger flex-shrink-0 mt-px" />
            <p className="text-[12px] sv-text-danger">
              <span className="font-semibold">Rejected:</span> {course.rejectionReason}
            </p>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, padding: "36px 28px 80px", maxWidth: 640, width: "100%" }}>

          <div style={{ marginBottom: 28 }}>
            <h2 className="font-semibold sv-text-primary" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>
              {isNew ? "New Course" : "Edit Course"}
            </h2>
          </div>

          {/* Metadata card */}
          <div className="sv-bg-elevated sv-rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)", marginBottom: 28 }}>
            <div className="sv-bg-hover" style={{ padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <p className="sv-section-label">Metadata</p>
            </div>
            <div className="sv-bg-base flex flex-col" style={{ padding: "20px 16px", gap: 20 }}>

              {/* Title */}
              <div>
                <label className="sv-section-label flex items-center gap-1" style={{ marginBottom: 8 }}>
                  <Hash size={10} />Course Title *
                </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete Java Programming Course"
                  className="sv-input w-full" style={{ height: 34 }} />
                <p className="text-[10px] sv-text-disabled mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                  /courses/<span className="sv-text-muted">{makeSlug(title) || "auto-slug"}</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="sv-section-label flex items-center gap-1" style={{ marginBottom: 8 }}>
                  <AlignLeft size={10} />Description
                </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn?" rows={2}
                  className="sv-input w-full resize-none" style={{ height: "auto", padding: "9px 10px", lineHeight: 1.6 }} />
              </div>

              {/* Template + Level */}
              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <p className="sv-section-label" style={{ marginBottom: 8 }}>Template</p>
                  <div className="flex gap-0.5" style={{ padding: 2, borderRadius: "var(--radius-sm)", background: "var(--bg-hover)", border: "1px solid var(--border-subtle)" }}>
                    {(["freeform", "structured"] as CourseTemplate[]).map((t) => (
                      <button key={t} onClick={() => setTemplate(t)}
                        className="flex-1 flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                        style={{
                          padding: "4px 6px", borderRadius: "var(--radius-xs)", border: "none",
                          fontWeight: template === t ? 500 : 400,
                          color: template === t ? "var(--text-primary)" : "var(--text-muted)",
                          background: template === t ? "var(--bg-elevated)" : "transparent",
                          transition: "all 80ms",
                        }}>
                        {t === "freeform" ? <FileText size={10} /> : <LayoutList size={10} />}
                        {t === "freeform" ? "Freeform" : "Structured"}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] sv-text-disabled mt-1">
                    {template === "freeform" ? "One editor per module." : "Lessons + assessments per module."}
                  </p>
                </div>

                <div>
                  <p className="sv-section-label" style={{ marginBottom: 8 }}>Level</p>
                  <div className="relative">
                    <select value={level} onChange={(e) => setLevel(e.target.value as CourseLevel | "")}
                      className="sv-input w-full" style={{ height: 34, appearance: "none", paddingRight: 24, cursor: "pointer" }}>
                      <option value="">— Not specified —</option>
                      {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 sv-text-disabled pointer-events-none" />
                  </div>
                  {level && (
                    <p className="text-[10px] font-semibold mt-1" style={{ color: LEVEL_COLORS[level] }}>
                      ● {LEVELS.find((l) => l.value === level)?.label}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modules section */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div>
                <p className="sv-section-label" style={{ marginBottom: 4 }}>Modules</p>
                <p className="text-[13px] font-medium sv-text-secondary" style={{ letterSpacing: "-0.008em" }}>
                  {modules.length} module{modules.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button onClick={addModule} className="sv-btn-secondary flex items-center gap-1 text-[12px] font-medium"
                style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)" }}>
                <Plus size={11} />Add Module
              </button>
            </div>

            <div className="sv-bg-elevated sv-rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-default)", padding: 6 }}>
              <ModuleList modules={modules} template={template} canEdit={canEdit}
                onReorder={setModules}
                onClickModule={setEditingMod}
                onRemove={(key) => setModules((p) => p.filter((m) => m._key !== key))}
                onAdd={addModule}
              />
            </div>
          </div>

          {/* Co-authors — only available after course is saved (has an _id) */}
          {canEdit && !isNew && (course as any)?._id && (
            <div style={{ marginTop: 28 }}>
              <p className="sv-section-label" style={{ marginBottom: 12 }}>Collaboration</p>
              <CoAuthorPanel
                courseId={(course as any)._id}
                coAuthors={coAuthors}
                onChange={setCoAuthors}
              />
              <p className="text-[11px] sv-text-disabled" style={{ marginTop: 8 }}>
                Co-authors can edit this course but cannot publish or delete it.
              </p>
            </div>
          )}

          {/* Cheat Sheet PDF — only for saved courses */}
          {!isNew && (course as any)?._id && (
            <CheatSheetUploader
              courseId={(course as any)._id}
              existingStorageId={(course as any)?.cheatSheetStorageId}
              existingFileName={(course as any)?.cheatSheetFileName}
              canEdit={canEdit}
            />
          )}

          {/* Bottom save row */}
          {canEdit && modules.length > 0 && (
            <div className="flex items-center justify-between" style={{ paddingTop: 20, marginTop: 28, borderTop: "1px solid var(--border-subtle)" }}>
              <p className="text-[11px] sv-text-disabled">{modules.length} module{modules.length !== 1 ? "s" : ""}</p>
              <button onClick={onSave} disabled={saving} className="sv-btn-primary flex items-center gap-1.5 text-[13px] font-medium"
                style={{ padding: "8px 18px", borderRadius: "var(--radius-md)", opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer", boxShadow: "0 1px 3px rgba(58,94,255,0.25)" }}>
                {saving ? <div className="sv-spinner" style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> : <Save size={12} />}
                {saving ? "Saving…" : isNew ? "Create Course" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}