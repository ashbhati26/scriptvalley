"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, ChevronRight, Upload, FileText,
  X, AlertCircle, Plus, BookOpen, HelpCircle, Code2,
  Rocket, Hash, GripVertical, Trash2, Cloud, CloudOff,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Module, Lesson, MCQQuestion, CodingChallenge,
  CourseTemplate, makeSlug, emptyLesson, emptyMCQ, emptyCodingChallenge,
} from "./courseTypes";
import NotesEditor     from "./NotesEditor";
import LessonEditor    from "./LessonEditor";
import MCQEditor       from "./McqEditor";
import ChallengeEditor from "./ChallengeEditor";
import { useDragSort } from "./CourseShared";

interface Props {
  mod:         Module;
  template:    CourseTemplate;
  courseTitle: string;
  canEdit:     boolean;
  onBack:      () => void;
  onSave:      (updated: Module) => void;
}

function textToHtml(text: string): string {
  return text.split(/\n{2,}/).map((para) => {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return "";
    if (lines.length === 1 && lines[0].length < 80 && !/[.,:;?!]$/.test(lines[0])) return `<h2>${lines[0]}</h2>`;
    return `<p>${lines.join(" ")}</p>`;
  }).filter(Boolean).join("\n");
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const result  = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

type Tab = "lessons" | "mcq" | "challenges" | "project";

const TABS: { key: Tab; label: string; Icon: any }[] = [
  { key: "lessons",    label: "Lessons",      Icon: BookOpen   },
  { key: "mcq",        label: "MCQs",         Icon: HelpCircle },
  { key: "challenges", label: "Challenges",   Icon: Code2      },
  { key: "project",    label: "Mini Project", Icon: Rocket     },
];

// localStorage draft key scoped to module _key
function draftKey(key: string) { return `sv-module-draft-${key}`; }

function saveDraft(modKey: string, data: any) {
  try { localStorage.setItem(draftKey(modKey), JSON.stringify(data)); } catch {}
}

function loadDraft(modKey: string, mod: Module, template: CourseTemplate) {
  try {
    const raw = localStorage.getItem(draftKey(modKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Compare against persisted values to see if the draft is actually different
    const isDiff =
      parsed.title   !== (mod.title       ?? "") ||
      parsed.desc    !== (mod.description  ?? "") ||
      parsed.content !== (mod.content      ?? "") ||
      JSON.stringify(parsed.lessons)          !== JSON.stringify(mod.lessons          ?? []) ||
      JSON.stringify(parsed.mcqQuestions)     !== JSON.stringify(mod.mcqQuestions     ?? []) ||
      JSON.stringify(parsed.codingChallenges) !== JSON.stringify(mod.codingChallenges ?? []) ||
      JSON.stringify(parsed.miniProject)      !== JSON.stringify(mod.miniProject);
    return isDiff ? parsed : null;
  } catch { return null; }
}

function clearDraft(modKey: string) {
  try { localStorage.removeItem(draftKey(modKey)); } catch {}
}

export default function ModuleEditor({ mod, template, courseTitle, canEdit, onBack, onSave }: Props) {
  // Try to restore a draft
  const draft = loadDraft(mod._key, mod, template);

  const [title,   setTitle]   = useState(draft?.title   ?? mod.title);
  const [desc,    setDesc]    = useState(draft?.desc     ?? mod.description ?? "");
  const [content, setContent] = useState(draft?.content ?? mod.content     ?? "");

  const [lessons,          setLessons]          = useState<Lesson[]>(
    draft?.lessons ?? (mod.lessons ?? []).map((l: any) => ({ ...l, _key: l._key ?? crypto.randomUUID() }))
  );
  const [mcqQuestions,     setMcqQuestions]     = useState<MCQQuestion[]>(
    draft?.mcqQuestions ?? mod.mcqQuestions ?? []
  );
  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>(
    draft?.codingChallenges ?? mod.codingChallenges ?? []
  );
  const [miniProject,      setMiniProject]      = useState<CodingChallenge | undefined>(
    draft?.miniProject ?? (mod.miniProject ? { ...mod.miniProject } : undefined)
  );

  const [activeTab,     setActiveTab]     = useState<Tab>("lessons");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [pasteText,     setPasteText]     = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [hasDraft,      setHasDraft]      = useState(!!draft);
  const fileRef = useRef<HTMLInputElement>(null);

  const drag = useDragSort(lessons, setLessons);

  // Track saved reference for dirty detection
  const savedRef = useRef({
    title:            mod.title       ?? "",
    desc:             mod.description ?? "",
    content:          mod.content     ?? "",
    lessons:          JSON.stringify(mod.lessons          ?? []),
    mcqQuestions:     JSON.stringify(mod.mcqQuestions     ?? []),
    codingChallenges: JSON.stringify(mod.codingChallenges ?? []),
    miniProject:      JSON.stringify(mod.miniProject),
  });

  const isDirty =
    title                                 !== savedRef.current.title           ||
    desc                                  !== savedRef.current.desc            ||
    content                               !== savedRef.current.content         ||
    JSON.stringify(lessons)          !== savedRef.current.lessons          ||
    JSON.stringify(mcqQuestions)     !== savedRef.current.mcqQuestions     ||
    JSON.stringify(codingChallenges) !== savedRef.current.codingChallenges ||
    JSON.stringify(miniProject)      !== savedRef.current.miniProject;

  // ── Auto-save draft to localStorage (debounced 3s) ────────────────────────
  useEffect(() => {
    if (!canEdit) return;
    const id = setTimeout(() => {
      saveDraft(mod._key, { title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject });
    }, 3_000);
    return () => clearTimeout(id);
  }, [canEdit, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject, mod._key]);

  // ── beforeunload warning ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Ctrl+S / Cmd+S ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject]);

  const save = useCallback(() => {
    setSaving(true);
    onSave({
      ...mod,
      title,
      slug:        makeSlug(title) || mod.slug,
      description: desc    || undefined,
      content:     template === "freeform" ? content : undefined,
      lessons:          template === "structured" ? lessons          : [],
      mcqQuestions:     template === "structured" ? mcqQuestions     : [],
      codingChallenges: template === "structured" ? codingChallenges : [],
      miniProject:      template === "structured" ? miniProject      : undefined,
    });
    savedRef.current = {
      title, desc, content,
      lessons:          JSON.stringify(lessons),
      mcqQuestions:     JSON.stringify(mcqQuestions),
      codingChallenges: JSON.stringify(codingChallenges),
      miniProject:      JSON.stringify(miniProject),
    };
    clearDraft(mod._key);
    setHasDraft(false);
    setTimeout(() => setSaving(false), 300);
    toast.success("Module saved");
  }, [mod, template, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject, onSave]);

  function discardDraft() {
    clearDraft(mod._key);
    setTitle(mod.title ?? "");
    setDesc(mod.description ?? "");
    setContent(mod.content ?? "");
    setLessons(mod.lessons ?? []);
    setMcqQuestions(mod.mcqQuestions ?? []);
    setCodingChallenges(mod.codingChallenges ?? []);
    setMiniProject(mod.miniProject ? { ...mod.miniProject } : undefined);
    setHasDraft(false);
    toast("Draft discarded");
  }

  function handleBack() {
    if (isDirty) {
      const ok = window.confirm("You have unsaved changes. Leave anyway?\n\nYour work is auto-saved locally — click Cancel to save first.");
      if (!ok) return;
    }
    clearDraft(mod._key);
    onBack();
  }

  function addLesson() {
    const l = emptyLesson(lessons.length);
    setLessons((p) => [...p, l]);
    setEditingLesson(l);
  }

  function saveLessonBack(updated: Lesson) {
    setLessons((p) => p.map((l) => l._key === updated._key ? updated : l));
    setEditingLesson(null);
  }

  function removeLesson(key: string) {
    setLessons((p) => p.filter((l) => l._key !== key));
  }

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    try {
      const html = file.name.endsWith(".docx") ? await parseDocx(file) : textToHtml(await file.text());
      setContent(html); setShowImport(false); toast.success("Imported — review and save");
    } catch { toast.error("Could not parse file"); }
    finally { setImportLoading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  function handlePasteImport() {
    if (!pasteText.trim()) { toast.error("Nothing to import"); return; }
    setContent(textToHtml(pasteText)); setPasteText(""); setShowImport(false); toast.success("Imported");
  }

  if (editingLesson) {
    return (
      <LessonEditor
        lesson={editingLesson}
        moduleTitle={title}
        courseTitle={courseTitle}
        canEdit={canEdit}
        onBack={() => setEditingLesson(null)}
        onSave={saveLessonBack}
      />
    );
  }

  const tabCounts: Record<Tab, number | undefined> = {
    lessons:    lessons.length          || undefined,
    mcq:        mcqQuestions.length     || undefined,
    challenges: codingChallenges.length || undefined,
    project:    miniProject             ? 1 : undefined,
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-(--bg-base)">
      <input ref={fileRef} type="file" accept=".docx,.txt,.md" className="hidden" onChange={handleFileImport} />

      {/* Topbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 h-12 border-b border-(--border-subtle) bg-(--bg-base)/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0 text-xs text-(--text-disabled)">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-(--text-muted) transition-colors shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline truncate max-w-[120px]">{courseTitle || "Course"}</span>
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-(--text-secondary) font-medium truncate">{title || "Untitled module"}</span>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            {/* Dirty indicator */}
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-(--text-disabled)">
              {isDirty
                ? <><CloudOff className="w-3 h-3" />Unsaved</>
                : <><Cloud className="w-3 h-3" />Saved</>
              }
            </span>

            {template === "freeform" && (
              <button
                onClick={() => { setShowImport(!showImport); setPasteText(""); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  showImport
                    ? "bg-(--bg-active) border-(--border-medium) text-(--text-primary)"
                    : "border-(--border-subtle) text-(--text-faint) hover:text-(--text-muted) hover:bg-(--bg-hover)"
                }`}
              >
                <Upload className="w-3 h-3" />Import
              </button>
            )}
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {saving ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Draft restore banner */}
      {canEdit && hasDraft && (
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-2.5 bg-amber-500/[0.06] border-b border-amber-500/15">
          <p className="text-xs text-amber-600">
            <span className="font-semibold">Unsaved draft restored</span> — auto-saved content from your last session.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={discardDraft} className="text-[10px] text-amber-600/70 hover:text-amber-600 underline">Discard</button>
            <button onClick={save} className="text-[10px] px-2 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold">Save now</button>
          </div>
        </div>
      )}

      {/* Import panel */}
      {template === "freeform" && canEdit && showImport && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
          className="border-b border-(--border-subtle) bg-(--bg-elevated) px-5 md:px-8 py-5"
        >
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-(--text-primary)">Import content</p>
                <p className="text-[10px] text-(--text-faint) mt-0.5">Upload a file or paste from Google Docs / Notion.</p>
              </div>
              <button onClick={() => { setShowImport(false); setPasteText(""); }} className="text-(--text-disabled) hover:text-(--text-muted)">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2">Upload file</p>
              <button onClick={() => fileRef.current?.click()} disabled={importLoading}
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg border border-dashed border-(--border-subtle) hover:border-(--border-medium) bg-(--bg-input) hover:bg-(--bg-hover) text-sm text-(--text-faint) hover:text-(--text-secondary) transition-colors disabled:opacity-50"
              >
                {importLoading ? <div className="w-4 h-4 border-2 border-(--brand)/30 border-t-(--brand) rounded-full animate-spin shrink-0" /> : <FileText className="w-4 h-4 shrink-0" />}
                <span>{importLoading ? "Parsing…" : "Click to upload .docx, .txt, or .md"}</span>
              </button>
              <p className="text-[10px] text-(--text-disabled) mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />Images in Word docs won't import — add them manually.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2">Paste from Google Docs / Notion</p>
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} rows={5}
                placeholder="Paste your content here…"
                className="w-full resize-none bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button onClick={handlePasteImport} disabled={!pasteText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                >
                  <Upload className="w-3 h-3" />Import text
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Module title + desc */}
      <div className="px-5 md:px-8 pt-8 pb-4 max-w-3xl w-full space-y-2">
        {canEdit ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title…"
            className="w-full text-2xl font-bold text-(--text-primary) bg-transparent border-none outline-none placeholder:text-(--text-disabled)"
          />
        ) : (
          <h1 className="text-2xl font-bold text-(--text-primary)">{title || "Untitled"}</h1>
        )}
        <p className="text-[10px] font-mono text-(--text-disabled)">/{makeSlug(title) || mod.slug}</p>
        {canEdit ? (
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Module description (optional)…"
            className="w-full text-sm text-(--text-faint) bg-transparent border-none outline-none placeholder:text-(--text-disabled)"
          />
        ) : desc ? <p className="text-sm text-(--text-faint)">{desc}</p> : null}
      </div>

      {/* ── FREEFORM ────────────────────────────────────────────────────────── */}
      {template === "freeform" && (
        <div className="flex-1 max-w-3xl w-full pb-12">
          {canEdit ? (
            <NotesEditor content={content} onChange={setContent} />
          ) : (
            <div className="px-5 md:px-8 py-6 text-sm text-(--text-secondary) leading-7
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-(--text-primary) [&_h1]:mt-8 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:mt-7 [&_h2]:mb-2.5
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-(--text-secondary) [&_h3]:mt-5 [&_h3]:mb-1.5
              [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5
              [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-(--text-muted)
              [&_code]:bg-(--bg-input) [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono
              [&_pre]:bg-[#0f1117] [&_pre]:border [&_pre]:border-white/[0.07] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-5 [&_pre]:overflow-x-auto
              [&_pre_code]:bg-transparent [&_pre_code]:text-[#e2e8f0] [&_pre_code]:text-[13px] [&_pre_code]:leading-6
              [&_a]:text-[#3A5EFF] [&_a]:hover:underline
              [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4 [&_img]:border [&_img]:border-(--border-subtle)
              [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
              [&_td]:border [&_td]:border-(--border-subtle) [&_td]:px-3 [&_td]:py-2
              [&_th]:border [&_th]:border-(--border-subtle) [&_th]:px-3 [&_th]:py-2 [&_th]:bg-(--bg-input) [&_th]:font-semibold
              [&_hr]:border-(--border-subtle) [&_hr]:my-6"
              dangerouslySetInnerHTML={{ __html: content || "<p class='text-(--text-disabled)'>No content yet.</p>" }}
            />
          )}
          {canEdit && (
            <div className="flex items-center justify-between px-5 md:px-8 mt-2">
              <p className="text-[10px] text-(--text-disabled)">{isDirty ? "● Unsaved changes" : "✓ All changes saved"}</p>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save module"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STRUCTURED ──────────────────────────────────────────────────────── */}
      {template === "structured" && (
        <div className="flex-1 flex flex-col max-w-3xl w-full pb-12">

          {/* Tab bar */}
          <div className="flex items-center gap-px px-5 md:px-8 border-b border-(--border-subtle) sticky top-12 z-10 bg-(--bg-base)">
            {TABS.map(({ key, label, Icon }) => {
              const count = tabCounts[key];
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-all ${
                    activeTab === key
                      ? "border-(--brand) text-(--brand)"
                      : "border-transparent text-(--text-muted) hover:text-(--text-secondary)"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {count !== undefined && (
                    <span className={`text-[9px] px-1 py-0.5 rounded-full font-bold ${
                      activeTab === key ? "bg-(--brand-subtle) text-(--brand)" : "bg-(--bg-hover) text-(--text-disabled)"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 px-5 md:px-8 py-6">

            {/* Lessons tab */}
            {activeTab === "lessons" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Lessons</p>
                    <p className="text-sm text-(--text-faint)">Each lesson is a full flowing article — write theory and drop code blocks inline.</p>
                  </div>
                  {canEdit && (
                    <button onClick={addLesson} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors shrink-0">
                      <Plus className="w-3 h-3" />Add Lesson
                    </button>
                  )}
                </div>

                {lessons.length === 0 ? (
                  <button onClick={canEdit ? addLesson : undefined}
                    className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm">No lessons yet — click to add one</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((lesson, li) => (
                      <div key={lesson._key}
                        draggable={canEdit}
                        onDragStart={() => drag.onDragStart(li)}
                        onDragOver={(e) => drag.onDragOver(e, li)}
                        onDragEnd={drag.onDragEnd}
                        onClick={() => setEditingLesson(lesson)}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) hover:bg-(--bg-hover) cursor-pointer transition-all"
                      >
                        {canEdit && (
                          <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 cursor-grab" onClick={(e) => e.stopPropagation()} />
                        )}
                        <div className="w-8 h-8 rounded-lg bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center shrink-0 text-[10px] font-bold text-(--text-muted)">
                          {lesson.lessonNumber || `${li + 1}`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) truncate transition-colors">
                            {lesson.title || <span className="italic font-normal text-(--text-disabled)">Untitled lesson</span>}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.topicsCovered && (
                              <p className="text-[10px] text-(--text-disabled) truncate max-w-[240px]">{lesson.topicsCovered}</p>
                            )}
                            {lesson.content
                              ? <span className="text-[9px] text-(--brand) font-medium shrink-0">● has content</span>
                              : <span className="text-[9px] text-(--text-disabled) italic shrink-0">empty</span>
                            }
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
                          {canEdit && (
                            <button onClick={() => removeLesson(lesson._key)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-(--text-faint)" />
                        </div>
                      </div>
                    ))}
                    {canEdit && (
                      <button onClick={addLesson} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
                        <Plus className="w-3.5 h-3.5" />Add another lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "mcq" && (
              <MCQEditor questions={mcqQuestions} canEdit={canEdit} onChange={setMcqQuestions} />
            )}

            {activeTab === "challenges" && (
              <ChallengeEditor
                challenges={codingChallenges} canEdit={canEdit} onChange={setCodingChallenges}
                label="Coding Challenges"
                description="Link problems from LeetCode, GFG, Coding Ninjas, or any platform."
              />
            )}

            {activeTab === "project" && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Mini Project</p>
                  <p className="text-sm text-(--text-faint)">One capstone project to consolidate everything in this module. Optional.</p>
                </div>
                {!miniProject ? (
                  canEdit ? (
                    <button
                      onClick={() => setMiniProject({ ...emptyCodingChallenge() })}
                      className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
                    >
                      <Rocket className="w-6 h-6" />
                      <span className="text-sm">No mini project yet — click to add one</span>
                    </button>
                  ) : (
                    <p className="text-sm text-(--text-disabled) italic py-8 text-center">No mini project added.</p>
                  )
                ) : (
                  <ChallengeEditor
                    challenges={[miniProject]} canEdit={canEdit}
                    onChange={(items) => setMiniProject(items[0] ?? undefined)}
                    label="Mini Project" description="The capstone for this module." single
                  />
                )}
              </div>
            )}
          </div>

          {canEdit && (
            <div className="flex items-center justify-between px-5 md:px-8 mt-2">
              <p className="text-[10px] text-(--text-disabled)">{isDirty ? "● Unsaved changes" : "✓ All changes saved"}</p>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save module"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}