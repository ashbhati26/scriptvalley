"use client";

import { useState } from "react";
import {
  ArrowLeft, Save, ChevronRight, Hash, AlignLeft, Tag,
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

export default function LessonEditor({ lesson, moduleTitle, courseTitle, canEdit, onBack, onSave }: Props) {
  const [title,         setTitle]         = useState(lesson.title         ?? "");
  const [lessonNumber,  setLessonNumber]  = useState(lesson.lessonNumber  ?? "");
  const [topicsCovered, setTopicsCovered] = useState(lesson.topicsCovered ?? "");
  const [content,       setContent]       = useState(lesson.content       ?? "");
  const [saving,        setSaving]        = useState(false);

  function save() {
    if (!title.trim()) { toast.error("Lesson title is required"); return; }
    setSaving(true);
    onSave({ ...lesson, title: title.trim(), lessonNumber: lessonNumber.trim() || undefined, topicsCovered: topicsCovered.trim() || undefined, content });
    setTimeout(() => setSaving(false), 300);
    toast.success("Lesson saved");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-(--bg-base)">

      {/* Topbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 h-12 border-b border-(--border-subtle) bg-(--bg-base)/95 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 min-w-0 text-xs text-(--text-disabled)">
          <button onClick={onBack} className="flex items-center gap-1 hover:text-(--text-muted) transition-colors shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline truncate max-w-[80px]">{moduleTitle || "Module"}</span>
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-(--text-secondary) font-medium truncate">{title || "Untitled lesson"}</span>
        </div>

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

        {/* Instruction hint for editor */}
        {canEdit && (
          <p className="text-[10px] text-(--text-disabled) leading-relaxed border-l-2 border-(--border-subtle) pl-3">
            Write the full lesson below — theory, analogies, code blocks, tips — all in one flowing article.
            Use <kbd className="bg-(--bg-input) px-1 py-0.5 rounded text-[9px] font-mono border border-(--border-subtle)">/</kbd> to insert a code block, callout, table, and more.
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="px-5 md:px-8 mt-3 mb-0">
        <div className="h-px bg-(--border-subtle) max-w-3xl" />
      </div>

      {/* Full-page TipTap editor — the lesson article */}
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
              [&_pre]:bg-(--bg-elevated) [&_pre]:border [&_pre]:border-(--border-subtle) [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto
              [&_a]:text-(--brand) [&_a]:hover:underline
              [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
              [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
              [&_td]:border [&_td]:border-(--border-subtle) [&_td]:px-3 [&_td]:py-2
              [&_th]:border [&_th]:border-(--border-subtle) [&_th]:px-3 [&_th]:py-2 [&_th]:bg-(--bg-input) [&_th]:font-semibold
              [&_hr]:border-(--border-subtle) [&_hr]:my-6
            "
            dangerouslySetInnerHTML={{ __html: content || "<p class='text-(--text-disabled) italic'>This lesson has no content yet.</p>" }}
          />
        )}

        {canEdit && (
          <div className="flex justify-end px-5 md:px-8 mt-2 pb-12">
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