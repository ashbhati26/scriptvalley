"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Save, ChevronRight, Tag, Cloud, CloudOff } from "lucide-react";
import toast from "react-hot-toast";
import { Lesson } from "./courseTypes";
import NotesEditor from "./NotesEditor";

interface Props {
  lesson: Lesson; moduleTitle: string; courseTitle: string;
  canEdit: boolean; onBack: () => void; onSave: (updated: Lesson) => void;
}

function draftKey(key: string) { return `sv-lesson-draft-${key}`; }

function loadDraft(lessonKey: string, lesson: Lesson) {
  try {
    const raw = localStorage.getItem(draftKey(lessonKey));
    if (!raw) throw new Error();
    const p = JSON.parse(raw);
    const isDiff =
      p.title         !== (lesson.title         ?? "") ||
      p.lessonNumber  !== (lesson.lessonNumber   ?? "") ||
      p.topicsCovered !== (lesson.topicsCovered  ?? "") ||
      p.content       !== (lesson.content        ?? "");
    if (!isDiff) throw new Error();
    return { ...p, hasDraft: true };
  } catch {
    return {
      title: lesson.title ?? "", lessonNumber: lesson.lessonNumber ?? "",
      topicsCovered: lesson.topicsCovered ?? "", content: lesson.content ?? "",
      hasDraft: false,
    };
  }
}

function clearDraft(k: string) { try { localStorage.removeItem(draftKey(k)); } catch {} }
function saveDraft(k: string, d: { title: string; lessonNumber: string; topicsCovered: string; content: string }) {
  try { localStorage.setItem(draftKey(k), JSON.stringify(d)); } catch {}
}

export default function LessonEditor({ lesson, moduleTitle, courseTitle, canEdit, onBack, onSave }: Props) {
  const initial = loadDraft(lesson._key, lesson);

  const [title,         setTitle]         = useState(initial.title);
  const [lessonNumber,  setLessonNumber]  = useState(initial.lessonNumber);
  const [topicsCovered, setTopicsCovered] = useState(initial.topicsCovered);
  const [content,       setContent]       = useState(initial.content);
  const [saving,        setSaving]        = useState(false);
  const [hasDraft,      setHasDraft]      = useState(initial.hasDraft);

  const savedRef = useRef({
    title: lesson.title ?? "", lessonNumber: lesson.lessonNumber ?? "",
    topicsCovered: lesson.topicsCovered ?? "", content: lesson.content ?? "",
  });

  const isDirty =
    title         !== savedRef.current.title         ||
    lessonNumber  !== savedRef.current.lessonNumber  ||
    topicsCovered !== savedRef.current.topicsCovered ||
    content       !== savedRef.current.content;

  // ── saveRef: always holds current values so Cmd+S doesn't capture stale closure
  const saveRef = useRef({ title, lessonNumber, topicsCovered, content });
  useEffect(() => { saveRef.current = { title, lessonNumber, topicsCovered, content }; }, [title, lessonNumber, topicsCovered, content]);

  // 3s debounce draft save
  useEffect(() => {
    if (!canEdit) return;
    const id = setTimeout(() => {
      saveDraft(lesson._key, { title, lessonNumber, topicsCovered, content });
      setHasDraft(true);
    }, 3_000);
    return () => clearTimeout(id);
  }, [canEdit, title, lessonNumber, topicsCovered, content, lesson._key]);

  useEffect(() => {
    if (!isDirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [isDirty]);

  const save = useCallback(async () => {
    const { title: t, lessonNumber: ln, topicsCovered: tc, content: ct } = saveRef.current;
    setSaving(true);
    try {
      const updated: Lesson = { ...lesson, title: t.trim(), lessonNumber: ln.trim() || undefined, topicsCovered: tc.trim() || undefined, content: ct };
      onSave(updated);
      savedRef.current = { title: t, lessonNumber: ln, topicsCovered: tc, content: ct };
      clearDraft(lesson._key);
      setHasDraft(false);
      toast.success("Lesson saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }, [lesson, onSave]);

  const handleBack = useCallback(() => {
    if (isDirty && !confirm("You have unsaved changes. Leave anyway?")) return;
    onBack();
  }, [isDirty, onBack]);

  function discardDraft() {
    clearDraft(lesson._key);
    setTitle(lesson.title ?? "");
    setLessonNumber(lesson.lessonNumber ?? "");
    setTopicsCovered(lesson.topicsCovered ?? "");
    setContent(lesson.content ?? "");
    setHasDraft(false);
  }

  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canEdit, save]);

  // Shared horizontal padding — consistent across all content rows
  const hPad = "clamp(24px, 5vw, 56px)";

  const ghostBtn: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "5px 10px", borderRadius: "var(--radius-md)", fontSize: "12px",
    color: "var(--text-faint)", background: "transparent",
    border: "none", cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - var(--navbar-height))", background: "var(--bg-base)" }}>

      {/* ── Sticky topbar ─────────────────────────────────────────────────────── */}
      {/* FIX: was top: "49px" — navbar is var(--navbar-height) = 44px */}
      <div style={{
        position: "sticky", top: "var(--navbar-height)", zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "12px", height: "44px", flexShrink: 0,
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border-subtle)",
        paddingInline: hPad,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden", fontSize: "12px", color: "var(--text-disabled)" }}>
          <button
            onClick={handleBack}
            style={ghostBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline" style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {moduleTitle || "Module"}
            </span>
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span style={{ color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title || "Untitled lesson"}
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {canEdit && (
            <span className="hidden sm:flex items-center gap-1" style={{ fontSize: "11px", color: "var(--text-disabled)" }}>
              {isDirty ? <><CloudOff className="w-3 h-3" />Unsaved</> : <><Cloud className="w-3 h-3" />Saved</>}
            </span>
          )}
          {canEdit && (
            <button
              onClick={save} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 600, color: "white", background: "var(--brand)", border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.background = "var(--brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand)"; }}
            >
              {saving ? <div style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <Save className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* ── Draft banner ──────────────────────────────────────────────────────── */}
      {canEdit && hasDraft && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", padding: `8px ${hPad}`,
          background: "var(--warning-bg)", borderBottom: "1px solid var(--warning-border)",
        }}>
          <p style={{ fontSize: "13px", color: "var(--warning)" }}>
            <span style={{ fontWeight: 600 }}>Unsaved draft restored</span> — auto-saved content from your last session.
          </p>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={discardDraft} style={{ fontSize: "12px", color: "var(--warning)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Discard</button>
            <button onClick={save} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "var(--radius-sm)", background: "var(--warning)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>Save now</button>
          </div>
        </div>
      )}

      {/* ── Lesson metadata ───────────────────────────────────────────────────── */}
      {/*
        FIX: was padding: "48px 64px 24px" — 48px top created a huge dead gap
        between the topbar and the lesson title. Reduced to 24px top.
        Horizontal padding uses clamp() so it scales with viewport.
      */}
      <div style={{ paddingTop: 24, paddingBottom: 16, paddingInline: hPad, maxWidth: 860, width: "100%" }}>

        {/* Lesson number + title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
          {canEdit ? (
            <input
              value={lessonNumber}
              onChange={(e) => setLessonNumber(e.target.value)}
              placeholder="1.1"
              style={{
                width: "52px", flexShrink: 0, textAlign: "center",
                fontSize: "14px", fontWeight: 700, color: "var(--text-muted)",
                background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)", padding: "6px 4px", outline: "none",
                boxShadow: "var(--shadow-xs)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
            />
          ) : lessonNumber ? (
            <span style={{ width: "52px", flexShrink: 0, textAlign: "center", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "6px 4px" }}>
              {lessonNumber}
            </span>
          ) : null}

          {canEdit ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title…"
              style={{ flex: 1, fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", background: "transparent", border: "none", outline: "none", lineHeight: 1.2 }}
            />
          ) : (
            <h1 style={{ flex: 1, fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.2 }}>
              {title || "Untitled"}
            </h1>
          )}
        </div>

        {/* Topics covered */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
          <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-disabled)" }} />
          {canEdit ? (
            <input
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              placeholder="Topics covered — optional"
              style={{ flex: 1, fontSize: "13px", letterSpacing: "-0.01em", color: "var(--text-faint)", background: "transparent", border: "none", outline: "none" }}
            />
          ) : topicsCovered ? (
            <p style={{ fontSize: "13px", color: "var(--text-faint)" }}>{topicsCovered}</p>
          ) : null}
        </div>

        {/* Hint text */}
        {canEdit && (
          <p style={{ fontSize: "12px", color: "var(--text-disabled)", lineHeight: 1.6, paddingLeft: "10px", borderLeft: "2px solid var(--border-default)" }}>
            Write the full lesson below. Use{" "}
            <kbd style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "4px", padding: "1px 4px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>/</kbd>{" "}
            for commands. Press{" "}
            <kbd style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "4px", padding: "1px 4px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>Ctrl+S</kbd>{" "}
            to save.
          </p>
        )}
      </div>

      {/* Divider — matches content padding */}
      <div style={{ height: "1px", background: "var(--border-subtle)", marginInline: hPad }} />

      {/* ── Editor ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: 860, width: "100%" }}>
        {canEdit ? (
          <NotesEditor content={content} onChange={setContent} />
        ) : (
          <div
            style={{ padding: `24px ${hPad}`, fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.75, letterSpacing: "-0.016em" }}
            className="[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_pre]:bg-[#0f1117] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre_code]:text-[#e2e8f0]"
            dangerouslySetInnerHTML={{ __html: content || "<p style='color:var(--text-disabled);font-style:italic'>This lesson has no content yet.</p>" }}
          />
        )}

        {/* Bottom save row */}
        {canEdit && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: hPad, paddingTop: 16, paddingBottom: 56 }}>
            <p style={{ fontSize: "12px", color: "var(--text-disabled)" }}>
              {isDirty ? "● Unsaved changes" : "✓ All changes saved"}
            </p>
            <button
              onClick={save} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 20px", borderRadius: "var(--radius-lg)", fontSize: "14px", fontWeight: 600, color: "white", background: "var(--brand)", border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 2px 8px rgba(58,94,255,0.25)" }}
              onMouseEnter={(e) => { if (!saving) { (e.currentTarget as HTMLElement).style.background = "var(--brand-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(58,94,255,0.35)"; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(58,94,255,0.25)"; }}
            >
              {saving ? <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save lesson"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}