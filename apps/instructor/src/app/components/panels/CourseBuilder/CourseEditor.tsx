"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import toast from "react-hot-toast";
import {
  ArrowLeft, Save, Send, RotateCcw, Trash2,
  Eye, AlertCircle, Hash, AlignLeft, Plus,
} from "lucide-react";

import { Module, CourseForm, makeSlug, emptyModule } from "./courseTypes";
import { StatusChip } from "./CourseShared";
import ModuleList   from "./ModuleList";
import ModuleEditor from "./ModuleEditor";

interface Props {
  course: CourseForm | null; // null = new course
  onBack: () => void;
}

export default function CourseEditor({ course, onBack }: Props) {
  const isNew   = course === null;
  const canEdit = true;

  const [title,       setTitle]       = useState(course?.title       ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [modules,     setModules]     = useState<Module[]>(
    (course?.modules ?? []).map((m, i) => ({
      _key:    crypto.randomUUID(),
      order:   m.order ?? i,
      title:   m.title ?? "",
      // Fix: parenthesise ?? before || to avoid mixed operator error
      slug:    (m.slug ?? makeSlug(m.title ?? "")) || `module-${i + 1}`,
      content: m.content ?? "",
    }))
  );

  const [saving,      setSaving]      = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(false);
  const [editingMod,  setEditingMod]  = useState<Module | null>(null);

  const createMut   = useMutation(api.courses.createCourse);
  const updateMut   = useMutation(api.courses.updateCourse);
  const submitMut   = useMutation(api.courses.submitCourseForReview);
  const withdrawMut = useMutation(api.courses.withdrawCourseFromReview);
  const deleteMut   = useMutation(api.courses.deleteMyCourse);

  // ── Module helpers ──────────────────────────────────────────────────────────
  function addModule() {
    const m = emptyModule(modules.length);
    setModules((prev) => [...prev, m]);
    setEditingMod(m);
  }

  function saveModuleBack(updated: Module) {
    setModules((prev) => prev.map((m) => m._key === updated._key ? updated : m));
    setEditingMod(null);
  }

  function removeModule(key: string) {
    setModules((prev) => prev.filter((m) => m._key !== key));
  }

  // ── Persist ─────────────────────────────────────────────────────────────────
  async function onSave() {
    if (!title.trim())        { toast.error("Course title is required"); return; }
    if (modules.length === 0) { toast.error("Add at least one module");  return; }
    for (const m of modules) {
      if (!m.title.trim()) { toast.error("All modules need a title"); return; }
    }
    setSaving(true);
    try {
      const payload = {
        title:       title.trim(),
        description: description.trim() || undefined,
        modules: modules.map((m, i) => ({
          order:           i,
          title:           m.title.trim(),
          slug:            makeSlug(m.title) || m.slug,
          content:         m.content,
          requireQuizPass: false,
        })),
      };
      if (isNew) { await createMut(payload as any);                        toast.success("Course created"); }
      else       { await updateMut({ id: (course as any)._id, ...payload } as any); toast.success("Saved");         }
      onBack();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit()  {
    try { await submitMut({ id: (course as any)._id });   toast.success("Submitted"); onBack(); }
    catch (e: any) { toast.error(e?.message); }
  }

  async function onWithdraw() {
    try { await withdrawMut({ id: (course as any)._id }); toast.success("Withdrawn"); onBack(); }
    catch (e: any) { toast.error(e?.message); }
  }

  async function onDelete() {
    try { await deleteMut({ id: (course as any)._id });   toast.success("Deleted");   onBack(); }
    catch (e: any) { toast.error(e?.message); }
  }

  const isPending   = course?.status === "pending_review";
  const isPublished = course?.status === "published";

  // ── If a module is open, render its full-page editor ───────────────────────
  if (editingMod) {
    return (
      <ModuleEditor
        mod={editingMod}
        courseTitle={title}
        canEdit={canEdit}
        onBack={() => setEditingMod(null)}
        onSave={saveModuleBack}
      />
    );
  }

  // ── Course editor ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)]">

      {/* Topbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 h-12 border-b border-(--border-subtle) bg-(--bg-base)/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-(--text-faint) hover:text-(--text-muted) transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Courses</span>
          </button>
          {course && (
            <>
              <span className="text-(--text-disabled)">/</span>
              <StatusChip status={course.status!} size="md" />
            </>
          )}
          <span className="text-sm font-medium text-(--text-primary) truncate hidden sm:inline">
            {title || "Untitled"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canEdit && (
            <button
              onClick={() => { setTitle(""); setDescription(""); setModules([]); }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:bg-(--bg-hover) transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />Reset
            </button>
          )}

          {course && (
            confirmDel ? (
              <div className="flex items-center gap-1.5">
                <button onClick={onDelete} className="px-2.5 py-1 rounded text-xs bg-red-500 text-white font-semibold">Delete</button>
                <button onClick={() => setConfirmDel(false)} className="px-2.5 py-1 rounded text-xs border border-(--border-subtle) text-(--text-muted)">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDel(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {isPending ? (
            <button
              onClick={onWithdraw}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs font-semibold"
            >
              <RotateCcw className="w-3 h-3" />Withdraw
            </button>
          ) : canEdit && !isNew ? (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--brand-border) text-(--brand) text-xs font-semibold hover:bg-(--brand-subtle) transition-colors"
            >
              <Send className="w-3 h-3" />{isPublished ? "Re-submit" : "Submit"}
            </button>
          ) : null}

          {canEdit && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : isNew ? "Create" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Rejection / published banners */}
      {course?.status === "rejected" && course?.rejectionReason && (
        <div className="flex items-start gap-3 mx-4 md:mx-8 mt-4 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.05]">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-px" />
          <div>
            <p className="text-xs font-semibold text-red-500">Rejected by admin</p>
            <p className="text-xs text-(--text-faint) mt-0.5">{course.rejectionReason}</p>
          </div>
        </div>
      )}
      {isPublished && (
        <div className="flex items-center gap-2.5 mx-4 md:mx-8 mt-4 px-4 py-2.5 rounded-xl border border-(--brand-border) bg-(--brand-subtle) text-(--brand) text-xs font-medium">
          <Eye className="w-3.5 h-3.5" />This course is live. Saving changes will move it back to draft for re-review.
        </div>
      )}

      {/* Body */}
      <div className="flex-1 px-5 md:px-8 py-8 max-w-2xl space-y-6">

        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Course</p>
          <h2 className="text-2xl font-bold text-(--text-primary)">
            {isNew ? "Create Course" : "Edit Course"}
          </h2>
        </div>

        {/* Title */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">
            <Hash className="w-3 h-3" />Course Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
            placeholder="e.g. Complete JavaScript Masterclass"
            className="w-full bg-(--bg-input) border border-transparent rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors"
          />
          <p className="text-[10px] font-mono text-(--text-disabled) mt-1.5">
            /courses/<span className="text-(--text-muted)">{makeSlug(title) || "auto-slug"}</span>
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">
            <AlignLeft className="w-3 h-3" />Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canEdit}
            placeholder="What will students learn in this course?"
            rows={3}
            className="w-full resize-none bg-(--bg-input) border border-transparent rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) disabled:opacity-50 transition-colors"
          />
        </div>

        {/* Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Modules</p>
              <p className="text-sm font-medium text-(--text-secondary)">
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </p>
            </div>
            {canEdit && (
              <button
                onClick={addModule}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />Add Module
              </button>
            )}
          </div>

          <ModuleList
            modules={modules}
            canEdit={canEdit}
            onReorder={setModules}
            onClickModule={setEditingMod}
            onRemove={removeModule}
            onAdd={addModule}
          />
        </div>

        {/* Footer save */}
        {canEdit && modules.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-(--border-subtle)">
            <p className="text-xs text-(--text-disabled)">{modules.length} modules</p>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : isNew ? "Create Course" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}