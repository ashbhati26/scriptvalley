"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft, Save, ChevronRight, Tag, Cloud, CloudOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { Lesson } from "./courseTypes";
import NotesEditor from "./NotesEditor";

interface Props {
  lesson:      Lesson;
  moduleTitle: string;
  courseTitle: string;
  canEdit:     boolean;
  onBack:      () => void;
  onSave:      (updated: Lesson) => void;
}

// localStorage key for draft buffer — scoped to lesson _key so multiple lessons don't clash.
function draftKey(key: string) { return `sv-lesson-draft-${key}`; }

function loadDraft(lessonKey: string, lesson: Lesson): {
  title: string; lessonNumber: string; topicsCovered: string; content: string; hasDraft: boolean;
} {
  try {
    const raw = localStorage.getItem(draftKey(lessonKey));
    if (!raw) throw new Error("no draft");
    const parsed = JSON.parse(raw);
    // Only restore if the saved draft is newer/different from the persisted lesson
    const isDiff =
      parsed.title         !== (lesson.title         ?? "") ||
      parsed.lessonNumber  !== (lesson.lessonNumber  ?? "") ||
      parsed.topicsCovered !== (lesson.topicsCovered ?? "") ||
      parsed.content       !== (lesson.content       ?? "");
    if (!isDiff) throw new Error("same as saved");
    return { ...parsed, hasDraft: true };
  } catch {
    return {
      title:         lesson.title         ?? "",
      lessonNumber:  lesson.lessonNumber  ?? "",
      topicsCovered: lesson.topicsCovered ?? "",
      content:       lesson.content       ?? "",
      hasDraft:      false,
    };
  }
}

function clearDraft(lessonKey: string) {
  try { localStorage.removeItem(draftKey(lessonKey)); } catch {}
}

function saveDraft(lessonKey: string, data: { title: string; lessonNumber: string; topicsCovered: string; content: string }) {
  try { localStorage.setItem(draftKey(lessonKey), JSON.stringify(data)); } catch {}
}

export default function LessonEditor({ lesson, moduleTitle, courseTitle, canEdit, onBack, onSave }: Props) {
  const initial = loadDraft(lesson._key, lesson);

  const [title,         setTitle]         = useState(initial.title);
  const [lessonNumber,  setLessonNumber]  = useState(initial.lessonNumber);
  const [topicsCovered, setTopicsCovered] = useState(initial.topicsCovered);
  const [content,       setContent]       = useState(initial.content);
  const [saving,        setSaving]        = useState(false);
  const [hasDraft,      setHasDraft]      = useState(initial.hasDraft);

  // Track dirty state (unsaved changes relative to last explicit save)
  const savedRef = useRef({ title: lesson.title ?? "", lessonNumber: lesson.lessonNumber ?? "", topicsCovered: lesson.topicsCovered ?? "", content: lesson.content ?? "" });
  const isDirty  = title !== savedRef.current.title || lessonNumber !== savedRef.current.lessonNumber || topicsCovered !== savedRef.current.topicsCovered || content !== savedRef.current.content;

  // ── Auto-save to localStorage every 10 seconds when dirty ────────────────
  useEffect(() => {
    if (!canEdit || !isDirty) return;
    const id = setInterval(() => {
      saveDraft(lesson._key, { title, lessonNumber, topicsCovered, content });
      setHasDraft(true);
    }, 10_000);
    return () => clearInterval(id);
  }, [canEdit, isDirty, title, lessonNumber, topicsCovered, content, lesson._key]);

  // Also auto-save immediately when content changes (debounced 3s)
  useEffect(() => {
    if (!canEdit) return;
    const id = setTimeout(() => {
      saveDraft(lesson._key, { title, lessonNumber, topicsCovered, content });
    }, 3_000);
    return () => clearTimeout(id);
  }, [canEdit, title, lessonNumber, topicsCovered, content, lesson._key]);

  // ── beforeunload warning when dirty ──────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Ctrl+S / Cmd+S shortcut ───────────────────────────────────────────────
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, title, lessonNumber, topicsCovered, content]);

  const save = useCallback(() => {
    if (!title.trim()) { toast.error("Lesson title is required"); return; }
    setSaving(true);
    const updated = { ...lesson, title: title.trim(), lessonNumber: lessonNumber.trim() || undefined, topicsCovered: topicsCovered.trim() || undefined, content };
    onSave(updated);
    // Update the saved reference so dirty tracking resets
    savedRef.current = { title: title.trim(), lessonNumber: lessonNumber.trim(), topicsCovered: topicsCovered.trim(), content };
    clearDraft(lesson._key);
    setHasDraft(false);
    setTimeout(() => setSaving(false), 300);
    toast.success("Lesson saved");
  }, [lesson, title, lessonNumber, topicsCovered, content, onSave]);

  function discardDraft() {
    clearDraft(lesson._key);
    setTitle(lesson.title ?? "");
    setLessonNumber(lesson.lessonNumber ?? "");
    setTopicsCovered(lesson.topicsCovered ?? "");
    setContent(lesson.content ?? "");
    setHasDraft(false);
    toast("Draft discarded");
  }

  function handleBack() {
    if (isDirty) {
      const ok = window.confirm("You have unsaved changes. Leave anyway?\n\nYour work is auto-saved locally — click Cancel to save it first.");
      if (!ok) return;
    }
    clearDraft(lesson._key);
    onBack();
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-(--bg-base)">

      {/* Topbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 h-12 border-b border-(--border-subtle) bg-(--bg-base)/95 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 min-w-0 text-xs text-(--text-disabled)">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-(--text-muted) transition-colors shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline truncate max-w-[80px]">{moduleTitle || "Module"}</span>
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-(--text-secondary) font-medium truncate">{title || "Untitled lesson"}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Draft / dirty indicator */}
          {canEdit && (
            <div className="hidden sm:flex items-center gap-1 text-[10px]">
              {isDirty ? (
                <span className="flex items-center gap-1 text-(--text-disabled)">
                  <CloudOff className="w-3 h-3" />Unsaved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-(--text-disabled)">
                  <Cloud className="w-3 h-3" />Saved
                </span>
              )}
            </div>
          )}

          {canEdit && (
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3 h-3" />}
              {saving ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Draft restore banner */}
      {canEdit && hasDraft && (
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-2.5 bg-amber-500/[0.06] border-b border-amber-500/15">
          <p className="text-xs text-amber-600">
            <span className="font-semibold">Unsaved draft restored</span> — this is auto-saved content from your last session that wasn't saved to the course.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={discardDraft} className="text-[10px] text-amber-600/70 hover:text-amber-600 underline transition-colors">
              Discard
            </button>
            <button onClick={save} className="text-[10px] px-2 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">
              Save now
            </button>
          </div>
        </div>
      )}

      {/* Meta fields */}
      <div className="px-5 md:px-8 pt-8 pb-2 max-w-3xl w-full space-y-4">

        {/* Lesson number + Title row */}
        <div className="flex items-start gap-3">
          {canEdit ? (
            <input
              value={lessonNumber} onChange={(e) => setLessonNumber(e.target.value)}
              placeholder="1.1"
              className="w-16 shrink-0 text-center text-sm font-bold text-(--text-muted) bg-(--bg-input) border border-(--border-subtle) rounded-lg px-2 py-2.5 outline-none focus:border-(--border-medium) transition-colors placeholder:text-(--text-disabled)"
            />
          ) : lessonNumber ? (
            <span className="w-16 shrink-0 text-center text-sm font-bold text-(--text-muted) bg-(--bg-input) border border-(--border-subtle) rounded-lg px-2 py-2.5">
              {lessonNumber}
            </span>
          ) : null}

          {canEdit ? (
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title…"
              className="flex-1 text-2xl font-bold text-(--text-primary) bg-transparent border-none outline-none placeholder:text-(--text-disabled)"
            />
          ) : (
            <h1 className="flex-1 text-2xl font-bold text-(--text-primary)">{title || "Untitled"}</h1>
          )}
        </div>

        {/* Topics covered */}
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-(--text-disabled) shrink-0" />
          {canEdit ? (
            <input
              value={topicsCovered} onChange={(e) => setTopicsCovered(e.target.value)}
              placeholder="Topics covered (e.g. constructors, this keyword, overloading) — optional"
              className="flex-1 text-sm text-(--text-faint) bg-transparent border-none outline-none placeholder:text-(--text-disabled)"
            />
          ) : topicsCovered ? (
            <p className="text-sm text-(--text-faint)">{topicsCovered}</p>
          ) : null}
        </div>

        {/* Instruction hint */}
        {canEdit && (
          <p className="text-[10px] text-(--text-disabled) leading-relaxed border-l-2 border-(--border-subtle) pl-3">
            Write the full lesson below — theory, analogies, code blocks, tips — all in one flowing article.
            Use <kbd className="bg-(--bg-input) px-1 py-0.5 rounded text-[9px] font-mono border border-(--border-subtle)">/</kbd> to insert a code block, callout, table, and more.
            Press <kbd className="bg-(--bg-input) px-1 py-0.5 rounded text-[9px] font-mono border border-(--border-subtle)">Ctrl+S</kbd> to save.
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="px-5 md:px-8 mt-3 mb-0">
        <div className="h-px bg-(--border-subtle) max-w-3xl" />
      </div>

      {/* Full-page TipTap editor */}
      <div className="flex-1 max-w-3xl w-full">
        {canEdit ? (
          <NotesEditor content={content} onChange={setContent} />
        ) : (
          <div
            className="
              px-5 md:px-8 py-6 text-sm text-(--text-secondary) leading-7
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-(--text-primary) [&_h1]:mt-8 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:mt-7 [&_h2]:mb-2.5
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-(--text-secondary) [&_h3]:mt-5 [&_h3]:mb-1.5
              [&_p]:my-1.5
              [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5
              [&_blockquote]:border-l-[3px] [&_blockquote]:border-(--brand)/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-(--text-muted)
              [&_code]:bg-(--bg-input) [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-(--brand) [&_code]:text-xs [&_code]:font-mono
              [&_pre]:bg-[#0f1117] [&_pre]:border [&_pre]:border-white/[0.07] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-5 [&_pre]:overflow-x-auto
              [&_pre_code]:bg-transparent [&_pre_code]:text-[#e2e8f0] [&_pre_code]:text-[13px] [&_pre_code]:leading-6
              [&_a]:text-(--brand) [&_a]:hover:underline
              [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4 [&_img]:border [&_img]:border-(--border-subtle)
              [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
              [&_td]:border [&_td]:border-(--border-subtle) [&_td]:px-3 [&_td]:py-2
              [&_th]:border [&_th]:border-(--border-subtle) [&_th]:px-3 [&_th]:py-2 [&_th]:bg-(--bg-input) [&_th]:font-semibold
              [&_hr]:border-(--border-subtle) [&_hr]:my-6
            "
            dangerouslySetInnerHTML={{ __html: content || "<p class='text-(--text-disabled) italic'>This lesson has no content yet.</p>" }}
          />
        )}

        {canEdit && (
          <div className="flex items-center justify-between px-5 md:px-8 mt-2 pb-12">
            <p className="text-[10px] text-(--text-disabled)">
              {isDirty ? "● Unsaved changes" : "✓ All changes saved"}
            </p>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save lesson"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}