"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, ChevronRight, Upload, FileText, X,
  AlertCircle, Plus, BookOpen, HelpCircle, Code2, Rocket,
  GripVertical, Trash2, Cloud, CloudOff,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Module, Lesson, MCQQuestion, CodingChallenge, CourseTemplate,
  makeSlug, emptyLesson, emptyMCQ, emptyCodingChallenge,
} from "./courseTypes";
import NotesEditor from "./NotesEditor";
import LessonEditor from "./LessonEditor";
import MCQEditor from "./McqEditor";
import ChallengeEditor from "./ChallengeEditor";
import { useDragSort } from "./CourseShared";

interface Props {
  mod: Module; template: CourseTemplate; courseTitle: string;
  canEdit: boolean; onBack: () => void; onSave: (updated: Module) => void;
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

function draftKey(k: string)  { return `sv-module-draft-${k}`; }
function saveDraft(modKey: string, data: any) { try { localStorage.setItem(draftKey(modKey), JSON.stringify(data)); } catch {} }
function loadDraft(modKey: string, mod: Module, template: CourseTemplate) {
  try {
    const raw = localStorage.getItem(draftKey(modKey)); if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isDiff = parsed.title !== (mod.title ?? "") || parsed.desc !== (mod.description ?? "") || parsed.content !== (mod.content ?? "") ||
      JSON.stringify(parsed.lessons) !== JSON.stringify(mod.lessons ?? []) || JSON.stringify(parsed.mcqQuestions) !== JSON.stringify(mod.mcqQuestions ?? []) ||
      JSON.stringify(parsed.codingChallenges) !== JSON.stringify(mod.codingChallenges ?? []) || JSON.stringify(parsed.miniProject) !== JSON.stringify(mod.miniProject);
    return isDiff ? parsed : null;
  } catch { return null; }
}
function clearDraft(modKey: string) { try { localStorage.removeItem(draftKey(modKey)); } catch {} }

export default function ModuleEditor({ mod, template, courseTitle, canEdit, onBack, onSave }: Props) {
  const draft = loadDraft(mod._key, mod, template);

  const [title,            setTitle]            = useState(draft?.title          ?? mod.title);
  const [desc,             setDesc]             = useState(draft?.desc           ?? mod.description ?? "");
  const [content,          setContent]          = useState(draft?.content        ?? mod.content     ?? "");
  const [lessons,          setLessons]          = useState<Lesson[]>(draft?.lessons          ?? (mod.lessons ?? []).map((l: any) => ({ ...l, _key: l._key ?? crypto.randomUUID() })));
  const [mcqQuestions,     setMcqQuestions]     = useState<MCQQuestion[]>(draft?.mcqQuestions     ?? mod.mcqQuestions     ?? []);
  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>(draft?.codingChallenges ?? mod.codingChallenges ?? []);
  const [miniProject,      setMiniProject]      = useState<CodingChallenge | undefined>(draft?.miniProject ?? (mod.miniProject ? { ...mod.miniProject } : undefined));
  const [activeTab,     setActiveTab]     = useState<Tab>("lessons");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [pasteText,     setPasteText]     = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [hasDraft,      setHasDraft]      = useState(!!draft);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useDragSort(lessons, setLessons);

  const savedRef = useRef({
    title: mod.title ?? "", desc: mod.description ?? "", content: mod.content ?? "",
    lessons: JSON.stringify(mod.lessons ?? []), mcqQuestions: JSON.stringify(mod.mcqQuestions ?? []),
    codingChallenges: JSON.stringify(mod.codingChallenges ?? []), miniProject: JSON.stringify(mod.miniProject),
  });

  const isDirty = title !== savedRef.current.title || desc !== savedRef.current.desc || content !== savedRef.current.content ||
    JSON.stringify(lessons) !== savedRef.current.lessons || JSON.stringify(mcqQuestions) !== savedRef.current.mcqQuestions ||
    JSON.stringify(codingChallenges) !== savedRef.current.codingChallenges || JSON.stringify(miniProject) !== savedRef.current.miniProject;

  useEffect(() => {
    if (!canEdit) return;
    const id = setTimeout(() => { saveDraft(mod._key, { title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject }); }, 3_000);
    return () => clearTimeout(id);
  }, [canEdit, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject, mod._key]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canEdit, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject]);

  const save = useCallback(() => {
    setSaving(true);
    onSave({ ...mod, title, slug: makeSlug(title) || mod.slug, description: desc || undefined,
      content: template === "freeform" ? content : undefined,
      lessons: template === "structured" ? lessons : [],
      mcqQuestions: template === "structured" ? mcqQuestions : [],
      codingChallenges: template === "structured" ? codingChallenges : [],
      miniProject: template === "structured" ? miniProject : undefined,
    });
    savedRef.current = { title, desc, content, lessons: JSON.stringify(lessons), mcqQuestions: JSON.stringify(mcqQuestions), codingChallenges: JSON.stringify(codingChallenges), miniProject: JSON.stringify(miniProject) };
    clearDraft(mod._key); setHasDraft(false); setTimeout(() => setSaving(false), 300); toast.success("Module saved");
  }, [mod, template, title, desc, content, lessons, mcqQuestions, codingChallenges, miniProject, onSave]);

  function discardDraft() { clearDraft(mod._key); setTitle(mod.title ?? ""); setDesc(mod.description ?? ""); setContent(mod.content ?? ""); setLessons(mod.lessons ?? []); setMcqQuestions(mod.mcqQuestions ?? []); setCodingChallenges(mod.codingChallenges ?? []); setMiniProject(mod.miniProject ? { ...mod.miniProject } : undefined); setHasDraft(false); toast("Draft discarded"); }
  function handleBack() { if (isDirty) { const ok = window.confirm("You have unsaved changes. Leave anyway?\n\nYour work is auto-saved locally — click Cancel to save first."); if (!ok) return; } clearDraft(mod._key); onBack(); }
  function addLesson() { const l = emptyLesson(lessons.length); setLessons((p) => [...p, l]); setEditingLesson(l); }
  function saveLessonBack(updated: Lesson) { setLessons((p) => p.map((l) => (l._key === updated._key ? updated : l))); setEditingLesson(null); }
  function removeLesson(key: string) { setLessons((p) => p.filter((l) => l._key !== key)); }

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
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

  if (editingLesson) return (
    <LessonEditor lesson={editingLesson} moduleTitle={title} courseTitle={courseTitle} canEdit={canEdit}
      onBack={() => setEditingLesson(null)} onSave={saveLessonBack} />
  );

  const tabCounts: Record<Tab, number | undefined> = {
    lessons: lessons.length || undefined, mcq: mcqQuestions.length || undefined,
    challenges: codingChallenges.length || undefined, project: miniProject ? 1 : undefined,
  };

  const TOPBAR_H = 48;
  const TAB_TOP  = `calc(var(--navbar-height) + ${TOPBAR_H}px)`;

  return (
    <div className="flex flex-col sv-bg-base" style={{ minHeight: "calc(100vh - var(--navbar-height))" }}>
      <input ref={fileRef} type="file" accept=".docx,.txt,.md" className="hidden" onChange={handleFileImport} />

      {/* Topbar */}
      <div className="flex items-center justify-between gap-3 sv-bg-base"
        style={{ position: "sticky", top: "var(--navbar-height)", zIndex: 20, padding: "0 20px", height: TOPBAR_H, borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2 min-w-0 flex-1 text-xs sv-text-disabled">
          <button onClick={handleBack} className="flex items-center gap-1 flex-shrink-0 sv-btn-ghost sv-text-disabled">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline sv-truncate max-w-[100px]">{courseTitle || "Course"}</span>
          </button>
          <ChevronRight size={12} className="flex-shrink-0" />
          <span className="sv-truncate min-w-0 font-medium sv-text-secondary">{title || "Untitled module"}</span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-[10px] sv-text-disabled">
              {isDirty ? <><CloudOff size={12} />Unsaved</> : <><Cloud size={12} />Saved</>}
            </span>
            {template === "freeform" && (
              <button onClick={() => { setShowImport(!showImport); setPasteText(""); }}
                className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer"
                style={{
                  padding: "5px 10px", borderRadius: "var(--radius-md)",
                  border: showImport ? "1px solid var(--border-medium)" : "1px solid var(--border-subtle)",
                  background: showImport ? "var(--bg-active)" : "transparent",
                  color: showImport ? "var(--text-primary)" : "var(--text-faint)",
                }}>
                <Upload size={12} />Import
              </button>
            )}
            <button onClick={save} disabled={saving} className="sv-btn-primary flex items-center gap-1.5 text-[12px] font-semibold"
              style={{ padding: "5px 12px", borderRadius: "var(--radius-md)", opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer" }}>
              {saving ? <div className="sv-spinner" style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> : <Save size={12} />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Draft banner */}
      {canEdit && hasDraft && (
        <div className="flex items-center justify-between gap-3" style={{ padding: "10px 20px", background: "var(--warning-bg)", borderBottom: "1px solid var(--warning-border)" }}>
          <p className="text-[12px] sv-text-warning">
            <span className="font-semibold">Unsaved draft restored</span> — auto-saved content from your last session.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={discardDraft} className="text-[11px] sv-text-warning underline bg-transparent border-none cursor-pointer">Discard</button>
            <button onClick={save} className="text-[11px] font-semibold text-white cursor-pointer sv-rounded-sm"
              style={{ padding: "3px 8px", background: "var(--warning)", border: "none" }}>Save now</button>
          </div>
        </div>
      )}

      {/* Import panel */}
      {template === "freeform" && canEdit && showImport && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
          className="sv-bg-elevated" style={{ borderBottom: "1px solid var(--border-subtle)", padding: 20 }}>
          <div className="flex flex-col" style={{ maxWidth: 600, gap: 20 }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold sv-text-primary">Import content</p>
                <p className="text-[11px] sv-text-faint" style={{ marginTop: 3 }}>Upload a file or paste from Google Docs / Notion.</p>
              </div>
              <button onClick={() => { setShowImport(false); setPasteText(""); }} className="sv-text-disabled bg-transparent border-none cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div>
              <p className="sv-section-label" style={{ marginBottom: 8 }}>Upload file</p>
              <button onClick={() => fileRef.current?.click()} disabled={importLoading}
                className="flex items-center gap-2.5 w-full text-[13px] sv-text-faint cursor-pointer sv-rounded-lg sv-bg-input"
                style={{ padding: "12px 16px", border: "1px dashed var(--border-subtle)", cursor: importLoading ? "wait" : "pointer" }}>
                {importLoading
                  ? <div className="sv-spinner flex-shrink-0" style={{ width: 16, height: 16, borderWidth: 2, borderColor: "rgba(58,94,255,0.3)", borderTopColor: "var(--brand)" }} />
                  : <FileText size={16} className="flex-shrink-0" />}
                {importLoading ? "Parsing…" : "Click to upload .docx, .txt, or .md"}
              </button>
              <p className="flex items-center gap-1 text-[10px] sv-text-disabled mt-1.5">
                <AlertCircle size={11} />Images in Word docs won't import — add them manually.
              </p>
            </div>

            <div>
              <p className="sv-section-label" style={{ marginBottom: 8 }}>Paste from Google Docs / Notion</p>
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} rows={5}
                placeholder="Paste your content here…"
                className="w-full resize-none sv-bg-input sv-text-secondary outline-none sv-rounded-lg"
                style={{ border: "1px solid var(--border-subtle)", padding: "10px 12px", fontSize: 13, fontFamily: "var(--font-sans)", transition: "border-color 80ms" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }} />
              <div className="flex justify-end mt-2">
                <button onClick={handlePasteImport} disabled={!pasteText.trim()} className="sv-btn-primary flex items-center gap-1.5 text-[12px] font-semibold"
                  style={{ padding: "6px 12px", borderRadius: "var(--radius-md)", opacity: !pasteText.trim() ? 0.4 : 1, cursor: !pasteText.trim() ? "not-allowed" : "pointer" }}>
                  <Upload size={12} />Import text
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Module title + slug + desc */}
      <div style={{ padding: "32px 24px 20px", maxWidth: 800, width: "100%" }}>
        {canEdit ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title…"
            className="w-full bg-transparent border-none outline-none sv-text-primary"
            style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em", marginBottom: 4 }} />
        ) : (
          <h1 className="sv-text-primary" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{title || "Untitled"}</h1>
        )}
        <p className="text-[10px] sv-text-disabled" style={{ fontFamily: "var(--font-mono)", marginBottom: 12 }}>/{makeSlug(title) || mod.slug}</p>
        {canEdit ? (
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Module description (optional)…"
            className="w-full bg-transparent border-none outline-none text-[13px] sv-text-faint"
            style={{ fontFamily: "var(--font-sans)" }} />
        ) : desc ? (
          <p className="text-[13px] sv-text-faint">{desc}</p>
        ) : null}
      </div>

      {/* FREEFORM */}
      {template === "freeform" && (
        <div className="flex-1 w-full" style={{ maxWidth: 800, paddingBottom: 64 }}>
          {canEdit ? (
            <NotesEditor content={content} onChange={setContent} />
          ) : (
            <div className="sv-text-secondary" style={{ padding: "0 24px 32px", fontSize: 14, lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: content || "<p style='color:var(--text-disabled)'>No content yet.</p>" }} />
          )}
          {canEdit && (
            <div className="flex items-center justify-between" style={{ padding: "16px 24px" }}>
              <p className="text-[10px] sv-text-disabled">{isDirty ? "● Unsaved changes" : "✓ All changes saved"}</p>
              <button onClick={save} disabled={saving} className="sv-btn-primary flex items-center gap-2 text-[14px] font-semibold"
                style={{ padding: "8px 20px", borderRadius: "var(--radius-lg)", opacity: saving ? 0.5 : 1, cursor: saving ? "wait" : "pointer" }}>
                {saving ? <div className="sv-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> : <Save size={16} />}
                {saving ? "Saving…" : "Save module"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STRUCTURED */}
      {template === "structured" && (
        <div className="flex-1 flex flex-col w-full" style={{ maxWidth: 800, paddingBottom: 64 }}>

          {/* Tab bar */}
          <div className="flex items-center sv-bg-base" style={{ padding: "0 24px", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: TAB_TOP, zIndex: 10 }}>
            {TABS.map(({ key, label, Icon }) => {
              const count  = tabCounts[key];
              const active = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className="flex items-center gap-1.5 cursor-pointer bg-transparent border-none text-[12px]"
                  style={{
                    padding: "10px 12px", fontWeight: active ? 600 : 400,
                    color: active ? "var(--brand)" : "var(--text-muted)",
                    borderBottom: `2px solid ${active ? "var(--brand)" : "transparent"}`,
                    marginBottom: -1, transition: "color 80ms, border-color 80ms",
                  }}>
                  <Icon size={14} />{label}
                  {count !== undefined && (
                    <span className="text-[10px] font-semibold text-center flex-shrink-0"
                      style={{ marginLeft: 2, lineHeight: "16px", padding: "0 5px", borderRadius: "100px", minWidth: 16, background: active ? "var(--brand)" : "var(--bg-active)", color: active ? "white" : "var(--text-muted)" }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab body */}
          <div style={{ flex: 1, padding: "24px 24px 16px" }}>

            {/* Lessons tab */}
            {activeTab === "lessons" && (
              <div className="flex flex-col" style={{ gap: 20 }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="sv-section-label" style={{ marginBottom: 4 }}>Lessons</p>
                    <p className="text-[13px] sv-text-faint">Each lesson is a full flowing article — write theory and drop code blocks inline.</p>
                  </div>
                  {canEdit && (
                    <button onClick={addLesson} className="sv-btn-secondary flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0"
                      style={{ padding: "6px 12px", borderRadius: "var(--radius-md)" }}>
                      <Plus size={12} />Add Lesson
                    </button>
                  )}
                </div>

                {lessons.length === 0 ? (
                  <button onClick={canEdit ? addLesson : undefined}
                    className="w-full flex flex-col items-center justify-center gap-2.5 sv-dashed sv-text-disabled"
                    style={{ padding: "48px 24px", borderRadius: "var(--radius-xl)", cursor: canEdit ? "pointer" : "default" }}>
                    <BookOpen size={22} />
                    <span className="text-[13px]">No lessons yet — click to add one</span>
                  </button>
                ) : (
                  <div className="flex flex-col" style={{ gap: 6 }}>
                    {lessons.map((lesson, li) => (
                      <div key={lesson._key} draggable={canEdit}
                        onDragStart={() => drag.onDragStart(li)} onDragOver={(e) => drag.onDragOver(e, li)} onDragEnd={drag.onDragEnd}
                        onClick={() => setEditingLesson(lesson)}
                        className="flex items-center gap-3 sv-bg-elevated sv-rounded-lg cursor-pointer"
                        style={{ padding: "12px 14px", border: "1px solid var(--border-subtle)", transition: "border-color 80ms, background 80ms" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; }}>
                        {canEdit && <GripVertical size={13} className="sv-text-disabled cursor-grab flex-shrink-0" onClick={(e) => e.stopPropagation()} />}

                        <div className="flex items-center justify-center flex-shrink-0 sv-rounded-md sv-bg-hover"
                          style={{ width: 32, height: 32, border: "1px solid var(--border-subtle)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
                          {lesson.lessonNumber || li + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium sv-text-secondary sv-truncate" style={{ letterSpacing: "-0.008em" }}>
                            {lesson.title || <span className="italic font-normal sv-text-disabled">Untitled lesson</span>}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.topicsCovered && (
                              <p className="text-[11px] sv-text-disabled sv-truncate" style={{ maxWidth: 280 }}>{lesson.topicsCovered}</p>
                            )}
                            {lesson.content
                              ? <span className="text-[11px] font-medium sv-text-brand flex-shrink-0">● has content</span>
                              : <span className="text-[11px] sv-text-disabled italic flex-shrink-0">empty</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {canEdit && (
                            <button onClick={() => removeLesson(lesson._key)}
                              className="flex items-center justify-center sv-rounded-md sv-text-faint bg-transparent border-none cursor-pointer"
                              style={{ width: 28, height: 28, transition: "color 80ms, background 80ms" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                              <Trash2 size={13} />
                            </button>
                          )}
                          <ChevronRight size={14} className="sv-text-faint" />
                        </div>
                      </div>
                    ))}

                    {canEdit && (
                      <button onClick={addLesson}
                        className="w-full flex items-center justify-center gap-1.5 sv-dashed text-[12px] sv-text-disabled"
                        style={{ padding: 10, borderRadius: "var(--radius-lg)", marginTop: 2 }}>
                        <Plus size={12} />Add another lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "mcq"        && <MCQEditor questions={mcqQuestions} canEdit={canEdit} onChange={setMcqQuestions} />}
            {activeTab === "challenges" && <ChallengeEditor challenges={codingChallenges} canEdit={canEdit} onChange={setCodingChallenges} label="Coding Challenges" description="Link problems from LeetCode, GFG, Coding Ninjas, or any platform." />}

            {activeTab === "project" && (
              <div className="flex flex-col" style={{ gap: 20 }}>
                <div>
                  <p className="sv-section-label" style={{ marginBottom: 4 }}>Mini Project</p>
                  <p className="text-[13px] sv-text-faint">One capstone project to consolidate everything in this module. Optional.</p>
                </div>
                {!miniProject ? (
                  canEdit ? (
                    <button onClick={() => setMiniProject({ ...emptyCodingChallenge() })}
                      className="w-full flex flex-col items-center justify-center gap-2.5 sv-dashed sv-text-disabled"
                      style={{ padding: "48px 24px", borderRadius: "var(--radius-xl)" }}>
                      <Rocket size={22} />
                      <span className="text-[13px]">No mini project yet — click to add one</span>
                    </button>
                  ) : (
                    <p className="text-[13px] sv-text-disabled italic text-center" style={{ padding: "32px 0" }}>No mini project added.</p>
                  )
                ) : (
                  <ChallengeEditor challenges={[miniProject]} canEdit={canEdit}
                    onChange={(items) => setMiniProject(items[0] ?? undefined)}
                    label="Mini Project" description="The capstone for this module." single />
                )}
              </div>
            )}
          </div>

          {/* Bottom save */}
          {canEdit && (
            <div className="flex items-center justify-between" style={{ padding: "16px 24px", marginTop: 16 }}>
              <p className="text-[10px] sv-text-disabled">{isDirty ? "● Unsaved changes" : "✓ All changes saved"}</p>
              <button onClick={save} disabled={saving} className="sv-btn-primary flex items-center gap-2 text-[14px] font-semibold"
                style={{ padding: "8px 20px", borderRadius: "var(--radius-lg)", opacity: saving ? 0.5 : 1, cursor: saving ? "wait" : "pointer" }}>
                {saving ? <div className="sv-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> : <Save size={16} />}
                {saving ? "Saving…" : "Save module"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}