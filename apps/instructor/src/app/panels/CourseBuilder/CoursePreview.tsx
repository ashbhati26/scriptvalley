"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, BookOpen, ChevronDown, ChevronRight, CheckSquare, Code2, FileText } from "lucide-react";
import { CourseForm, Module, Lesson } from "./courseTypes";
import DOMPurify from "dompurify";

function LessonContent({ content }: { content: string }) {
  const safe = DOMPurify.sanitize(content || "<p style='color:var(--text-disabled);font-style:italic'>No content yet.</p>");
  return (
    <div
      className="[&_h1]:text-xl [&_h1]:font-bold [&_h1]:sv-text-primary [&_h1]:mt-5 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:sv-text-primary [&_h2]:mt-4 [&_h2]:mb-1.5 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_pre]:bg-[#0f1117] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-[#e2e8f0] [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-3"
      style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, letterSpacing: "-0.016em" }}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

function ModulePanel({ mod, defaultOpen }: { mod: Module; defaultOpen?: boolean }) {
  const [open,         setOpen]         = useState(defaultOpen ?? false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const lessonCount    = mod.lessons?.length ?? 0;
  const mcqCount       = mod.mcqQuestions?.length ?? 0;
  const challengeCount = mod.codingChallenges?.length ?? 0;

  return (
    <div className="sv-bg-elevated sv-rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer text-left sv-btn-ghost"
        style={{ padding: "12px 16px" }}>
        <span className="flex items-center justify-center flex-shrink-0 sv-bg-hover sv-rounded-md"
          style={{ width: 26, height: 26, fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
          {mod.order + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium sv-text-primary" style={{ letterSpacing: "-0.016em" }}>{mod.title || "Untitled module"}</p>
          <div className="flex gap-2 mt-0.5">
            {lessonCount    > 0 && <span className="text-[11px] sv-text-brand">{lessonCount} lesson{lessonCount !== 1 ? "s" : ""}</span>}
            {mcqCount       > 0 && <span className="text-[11px] sv-text-warning">{mcqCount} MCQ</span>}
            {challengeCount > 0 && <span className="text-[11px]" style={{ color: "var(--brand-hover)" }}>{challengeCount} challenge{challengeCount !== 1 ? "s" : ""}</span>}
          </div>
        </div>
        {open ? <ChevronDown size={16} className="sv-text-disabled flex-shrink-0" /> : <ChevronRight size={16} className="sv-text-disabled flex-shrink-0" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {(mod.lessons ?? []).map((lesson) => (
                <div key={lesson._key} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <button onClick={() => setActiveLesson(activeLesson?._key === lesson._key ? null : lesson)}
                    className="w-full flex items-center gap-2.5 bg-transparent border-none cursor-pointer text-left sv-btn-ghost"
                    style={{ padding: "10px 16px" }}>
                    <FileText size={13} className="sv-text-disabled flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] sv-text-secondary" style={{ letterSpacing: "-0.01em" }}>
                        {lesson.lessonNumber && <span className="sv-text-disabled mr-1.5">{lesson.lessonNumber}</span>}
                        {lesson.title || "Untitled lesson"}
                      </p>
                      {lesson.topicsCovered && (
                        <p className="text-[11px] sv-text-disabled sv-truncate mt-0.5">{lesson.topicsCovered}</p>
                      )}
                    </div>
                    {activeLesson?._key === lesson._key
                      ? <ChevronDown size={13} className="sv-text-disabled flex-shrink-0" />
                      : <ChevronRight size={13} className="sv-text-disabled flex-shrink-0" />}
                  </button>
                  {activeLesson?._key === lesson._key && (
                    <div className="sv-bg-hover" style={{ padding: "16px 20px" }}>
                      <LessonContent content={lesson.content ?? ""} />
                    </div>
                  )}
                </div>
              ))}

              {mcqCount > 0 && (
                <div className="flex items-center gap-2 text-[13px] sv-text-faint" style={{ padding: "10px 16px", borderBottom: challengeCount > 0 ? "1px solid var(--border-subtle)" : "none" }}>
                  <CheckSquare size={13} className="flex-shrink-0" />{mcqCount} multiple-choice question{mcqCount !== 1 ? "s" : ""}
                </div>
              )}
              {challengeCount > 0 && (
                <div className="flex items-center gap-2 text-[13px] sv-text-faint" style={{ padding: "10px 16px" }}>
                  <Code2 size={13} className="flex-shrink-0" />{challengeCount} coding challenge{challengeCount !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CoursePreview({ course, onClose }: { course: CourseForm; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", zIndex: 0 }} />

      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative flex flex-col overflow-hidden sv-bg-base"
        style={{ zIndex: 1, marginLeft: "auto", width: "100%", maxWidth: 620, height: "100%", boxShadow: "var(--shadow-xl)" }}>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 sv-bg-glass"
          style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center sv-rounded-md" style={{ width: 32, height: 32, background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
              <Eye size={16} className="sv-text-brand" />
            </div>
            <div>
              <p className="font-semibold sv-text-primary" style={{ fontSize: 15, letterSpacing: "-0.018em" }}>Student preview</p>
              <p className="text-[12px] sv-text-faint">How this course appears to students</p>
            </div>
          </div>
          <button onClick={onClose} className="sv-btn-ghost flex items-center justify-center sv-rounded-md sv-bg-hover"
            style={{ width: 32, height: 32, border: "none" }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div className="sv-bg-elevated" style={{ padding: 24, borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-start gap-3.5" style={{ marginBottom: 12 }}>
              <div className="flex items-center justify-center flex-shrink-0 sv-rounded-xl"
                style={{ width: 44, height: 44, background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
                <BookOpen size={20} className="sv-text-brand" />
              </div>
              <div>
                <h1 className="font-bold sv-text-primary" style={{ fontSize: 22, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                  {course.title || "Untitled course"}
                </h1>
                {course.level && (
                  <p className="text-[11px] font-medium sv-text-disabled uppercase mt-1" style={{ letterSpacing: "0.05em" }}>{course.level}</p>
                )}
              </div>
            </div>
            {course.description && (
              <p className="text-[14px] sv-text-faint" style={{ lineHeight: 1.6, letterSpacing: "-0.016em" }}>{course.description}</p>
            )}
            <div className="flex gap-3 text-[12px] sv-text-disabled mt-3">
              <span>{course.modules?.length ?? 0} modules</span>
              <span>·</span>
              <span>{course.modules?.reduce((a, m) => a + (m.lessons?.length ?? 0), 0) ?? 0} lessons</span>
            </div>
          </div>

          {/* Module list */}
          <div style={{ padding: "20px 24px" }}>
            <p className="sv-section-label" style={{ marginBottom: 14 }}>Course content</p>
            {(course.modules ?? []).length === 0 ? (
              <p className="text-[14px] sv-text-disabled italic text-center" style={{ padding: 32 }}>No modules added yet.</p>
            ) : (
              <div className="flex flex-col" style={{ gap: 8 }}>
                {(course.modules ?? []).map((mod, i) => <ModulePanel key={mod._key} mod={mod} defaultOpen={i === 0} />)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}