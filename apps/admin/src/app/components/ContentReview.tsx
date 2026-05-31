"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Award, CheckCircle2, XCircle, Clock, LayoutList, Trash2,
  ChevronRight, ChevronDown, X, FileText, Code2, HelpCircle, Layers,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type ContentTab = "sheets" | "courses";

const TABS: { key: ContentTab; label: string; Icon: React.ComponentType<any> }[] = [
  { key: "sheets",  label: "DSA Sheets", Icon: BookOpen },
  { key: "courses", label: "Courses",    Icon: Award    },
];

// ─── Shared helpers ────────────────────────────────────────────────────────────

function Loader() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-4 h-4 border-2 border-[rgba(58,94,255,0.3)] border-t-[#3A5EFF] rounded-full animate-spin" />
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-(--text-disabled)">
      <LayoutList className="w-7 h-7" />
      <p className="text-sm">No pending {label}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">
      {children}
    </p>
  );
}

// ─── ModuleAccordion ──────────────────────────────────────────────────────────

function ModuleAccordion({ mod }: { mod: any }) {
  const [open, setOpen] = useState(false);
  const lessonCount    = mod.lessons?.length        ?? 0;
  const mcqCount       = mod.mcqQuestions?.length   ?? 0;
  const challengeCount = mod.codingChallenges?.length ?? 0;

  return (
    <div className="rounded-lg border border-(--border-subtle) overflow-hidden mb-1.5">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-(--bg-elevated) border-none cursor-pointer text-left hover:bg-(--bg-hover) transition-colors"
      >
        <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-[rgba(58,94,255,0.1)]">
          <Layers className="w-3 h-3 text-[#3A5EFF]" />
        </div>
        <span className="flex-1 text-[13px] font-medium text-(--text-primary) truncate">
          {mod.title}
        </span>
        <div className="flex items-center gap-1.5">
          {lessonCount > 0 && (
            <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              {lessonCount} lessons
            </span>
          )}
          {mcqCount > 0 && (
            <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              {mcqCount} MCQs
            </span>
          )}
          {challengeCount > 0 && (
            <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              {challengeCount} challenges
            </span>
          )}
          {open
            ? <ChevronDown className="w-3.5 h-3.5 text-(--text-faint)" />
            : <ChevronRight className="w-3.5 h-3.5 text-(--text-faint)" />
          }
        </div>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 py-3 border-t border-(--border-subtle) bg-(--bg-base) flex flex-col gap-3.5">

              {/* Lessons */}
              {mod.lessons && mod.lessons.length > 0 && (
                <div>
                  <SectionLabel>Lessons</SectionLabel>
                  <div className="flex flex-col gap-1">
                    {mod.lessons.map((lesson: any, i: number) => (
                      <div
                        key={i}
                        className="px-2.5 py-2 rounded-md border border-(--border-subtle) bg-(--bg-elevated)"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText className="w-3 h-3 text-(--text-faint) shrink-0" />
                          <span className="text-[12px] font-medium text-(--text-secondary) flex-1">
                            {lesson.title}
                          </span>
                          {lesson.lessonNumber && (
                            <span className="text-[10px] text-(--text-disabled) ml-auto">
                              #{lesson.lessonNumber}
                            </span>
                          )}
                        </div>
                        {lesson.content && (
                          <div
                            className="text-[12px] text-(--text-muted) leading-relaxed max-h-[120px] overflow-hidden"
                            style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent)" }}
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Freeform module content */}
              {!mod.lessons?.length && mod.content && (
                <div>
                  <SectionLabel>Content</SectionLabel>
                  <div
                    className="text-[12px] text-(--text-muted) leading-relaxed max-h-[160px] overflow-hidden px-2.5 py-2 bg-(--bg-elevated) rounded-md border border-(--border-subtle)"
                    style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent)" }}
                    dangerouslySetInnerHTML={{ __html: mod.content }}
                  />
                </div>
              )}

              {/* MCQs */}
              {mod.mcqQuestions && mod.mcqQuestions.length > 0 && (
                <div>
                  <SectionLabel>MCQ Questions</SectionLabel>
                  <div className="flex flex-col gap-1.5">
                    {mod.mcqQuestions.map((q: any, qi: number) => (
                      <div
                        key={qi}
                        className="px-3 py-2.5 rounded-md border border-(--border-subtle) bg-(--bg-elevated)"
                      >
                        <div className="flex gap-1.5 mb-2">
                          <HelpCircle className="w-3 h-3 shrink-0 mt-0.5 text-warning" />
                          <span className="text-[12px] font-medium text-(--text-secondary)">
                            {qi + 1}. {q.question}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 pl-4">
                          {q.options?.map((opt: any, oi: number) => (
                            <div
                              key={oi}
                              className={`text-[11px] px-2 py-0.5 rounded ${
                                opt.isCorrect
                                  ? "bg-[rgba(34,197,94,0.08)] text-[#22c55e] border border-[rgba(34,197,94,0.2)] font-medium"
                                  : "text-(--text-muted)"
                              }`}
                            >
                              {opt.isCorrect ? "✓ " : ""}{opt.text}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[11px] text-(--text-disabled) mt-1.5 pl-4 italic">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coding Challenges */}
              {mod.codingChallenges && mod.codingChallenges.length > 0 && (
                <div>
                  <SectionLabel>Coding Challenges</SectionLabel>
                  <div className="flex flex-col gap-1">
                    {mod.codingChallenges.map((ch: any, ci: number) => {
                      // diffColor is runtime — inline justified
                      const diffColor =
                        ch.difficulty === "hard"   ? "#ef4444" :
                        ch.difficulty === "medium" ? "#f59e0b" : "#22c55e";
                      return (
                        <div
                          key={ci}
                          className="flex gap-2 items-start px-3 py-2 rounded-md border border-(--border-subtle) bg-(--bg-elevated)"
                        >
                          <Code2 className="w-3 h-3 shrink-0 mt-0.5 text-(--text-faint)" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[12px] font-medium text-(--text-secondary)">
                                {ch.title}
                              </span>
                              {ch.difficulty && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded border"
                                  style={{
                                    color:       diffColor,
                                    background:  `${diffColor}18`,
                                    borderColor: `${diffColor}30`,
                                  }}
                                >
                                  {ch.difficulty}
                                </span>
                              )}
                            </div>
                            {ch.description && (
                              <p className="text-[11px] text-(--text-muted) mt-0.5 leading-relaxed">
                                {ch.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CoursePreviewPanel ────────────────────────────────────────────────────────

function CoursePreviewPanel({ course, onClose, onPublish, onReject }: {
  course: any;
  onClose: () => void;
  onPublish: () => void;
  onReject: (reason: string) => void;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason,     setReason]     = useState("");
  const [busy,       setBusy]       = useState(false);

  // levelColor is a runtime lookup — inline style justified
  const levelColor: Record<string, string> = {
    beginner: "#22c55e", intermediate: "#f59e0b",
    advanced: "#ef4444", "all-levels": "#3A5EFF",
  };

  async function handlePublish() {
    setBusy(true);
    try { await onPublish(); } finally { setBusy(false); }
  }

  async function handleReject() {
    setBusy(true);
    try { await onReject(reason); } finally { setBusy(false); }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-50"
      />

      {/* Slide panel */}
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 bottom-0 z-[51] flex flex-col bg-(--bg-base) border-l border-(--border-subtle) shadow-lg"
        style={{ width: "min(640px, 100vw)" }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-(--border-subtle) shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-[16px] font-semibold text-(--text-primary)">{course.title}</h2>
              {course.level && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded capitalize border"
                  style={{
                    color:       levelColor[course.level] ?? "#3A5EFF",
                    background:  `${levelColor[course.level] ?? "#3A5EFF"}18`,
                    borderColor: `${levelColor[course.level] ?? "#3A5EFF"}30`,
                  }}
                >
                  {course.level}
                </span>
              )}
            </div>
            {course.description && (
              <p className="text-[12px] text-(--text-muted) leading-relaxed">{course.description}</p>
            )}
            <div className="flex gap-3 mt-1.5">
              <span className="text-[11px] text-(--text-disabled)">
                {course.modules?.length ?? 0} modules
              </span>
              <span className="text-[11px] text-(--text-disabled)">
                Submitted {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) rounded-md cursor-pointer shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable modules */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {(!course.modules || course.modules.length === 0) ? (
            <div className="flex flex-col items-center gap-2 py-10 text-(--text-disabled) text-center">
              <Layers className="w-8 h-8" />
              <p className="text-[13px]">No modules in this course</p>
            </div>
          ) : (
            <>
              <SectionLabel>Modules ({course.modules.length})</SectionLabel>
              {course.modules
                .slice()
                .sort((a: any, b: any) => a.order - b.order)
                .map((mod: any, i: number) => (
                  <ModuleAccordion key={i} mod={mod} />
                ))}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-(--border-subtle) bg-(--bg-elevated) shrink-0">
          <AnimatePresence mode="wait">
            {rejectMode ? (
              <motion.div
                key="reject"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              >
                <p className="text-[12px] text-(--text-muted) mb-2">
                  Provide a rejection reason (optional):
                </p>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Content too thin, needs more lessons…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")  handleReject();
                      if (e.key === "Escape") { setRejectMode(false); setReason(""); }
                    }}
                    className="flex-1 h-[34px] px-3 text-[13px] bg-(--bg-input) border border-(--border-subtle) rounded-md text-(--text-primary) outline-none focus:border-[rgba(58,94,255,0.4)] transition-colors"
                  />
                  <button
                    onClick={handleReject}
                    disabled={busy}
                    className={`px-3.5 h-[34px] rounded-md text-[12px] font-medium border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-[#ef4444] cursor-pointer transition-colors hover:bg-[rgba(239,68,68,0.16)] ${busy ? "opacity-60 cursor-wait" : ""}`}
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => { setRejectMode(false); setReason(""); }}
                    className="px-3 h-[34px] rounded-md text-[12px] border border-(--border-subtle) text-(--text-muted) bg-transparent hover:bg-(--bg-hover) cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-(--text-disabled) mt-1">
                  Enter to confirm · Escape to cancel
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex gap-2"
              >
                <button
                  onClick={handlePublish}
                  disabled={busy}
                  className={`flex-1 h-9 rounded-md flex items-center justify-center gap-1.5 text-[13px] font-medium border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.16)] cursor-pointer transition-colors ${busy ? "opacity-60 cursor-wait" : ""}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Publish Course
                </button>
                <button
                  onClick={() => setRejectMode(true)}
                  disabled={busy}
                  className={`flex-1 h-9 rounded-md flex items-center justify-center gap-1.5 text-[13px] font-medium border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.12)] cursor-pointer transition-colors ${busy ? "opacity-60" : ""}`}
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// ─── SheetRow ──────────────────────────────────────────────────────────────────

function SheetRow({ item, onPublish, onReject, onDelete }: {
  item: any;
  onPublish: () => void;
  onReject: (reason: string) => void;
  onDelete: () => void;
}) {
  const [rejecting,  setRejecting]  = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [reason,     setReason]     = useState("");
  const topicCount = item.content?.topics?.length ?? 0;

  return (
    <div className="px-4 py-3.5 hover:bg-(--bg-hover) transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <p className="text-[13px] font-medium text-(--text-secondary) truncate">
              {item.name ?? "Untitled"}
            </p>
            <span className="text-[9px] font-mono text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              {item.slug}
            </span>
            {item.category && (
              <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
                {item.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
              <Clock className="w-3 h-3" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span className="text-[10px] text-(--text-disabled)">{topicCount} topics</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.16)] cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Publish
          </button>
          <button
            onClick={() => setRejecting(!rejecting)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-(--text-faint) hover:text-red-400/70 hover:bg-red-500/[0.06] hover:border-red-500/20 border border-transparent cursor-pointer transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          {confirmDel ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(); setConfirmDel(false); }}
                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#ef4444] text-white cursor-pointer border-none"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDel(false)}
                className="px-2.5 py-1 rounded text-[11px] border border-(--border-subtle) text-(--text-muted) bg-transparent cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              className="flex items-center gap-1 p-1.5 rounded-md text-(--text-faint) hover:text-red-400/70 hover:bg-red-500/[0.06] cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reject inline input */}
      <AnimatePresence>
        {rejecting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2.5"
          >
            <div className="flex gap-2">
              <input
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason (optional)…"
                onKeyDown={(e) => {
                  if (e.key === "Enter")  { onReject(reason); setRejecting(false); setReason(""); }
                  if (e.key === "Escape") { setRejecting(false); setReason(""); }
                }}
                className="flex-1 h-8 px-3 text-[12px] bg-(--bg-input) border border-(--border-subtle) rounded-md text-(--text-secondary) outline-none focus:border-[rgba(58,94,255,0.4)] transition-colors"
              />
              <button
                onClick={() => { onReject(reason); setRejecting(false); setReason(""); }}
                className="px-3 h-8 rounded-md text-[11px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#ef4444] cursor-pointer hover:bg-[rgba(239,68,68,0.16)] transition-colors"
              >
                Confirm
              </button>
            </div>
            <p className="text-[10px] text-(--text-disabled) mt-1">Enter to confirm · Escape to cancel</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CourseRow ─────────────────────────────────────────────────────────────────

function CourseRow({ course, onPublish, onReject, onDelete }: {
  course: any;
  onPublish: () => void;
  onReject: (reason: string) => void;
  onDelete: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(false);

  return (
    <>
      <div className="px-4 py-3.5 hover:bg-(--bg-hover) transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <p className="text-[13px] font-medium text-(--text-secondary) truncate">
                {course.title ?? "Untitled"}
              </p>
              <span className="text-[9px] font-mono text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
                {course.slug}
              </span>
              {course.level && (
                <span className="text-[10px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded capitalize">
                  {course.level}
                </span>
              )}
            </div>
            {course.description && (
              <p className="text-[11px] text-(--text-disabled) mb-1 line-clamp-1">
                {course.description}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                <Clock className="w-3 h-3" />
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-(--text-disabled)">
                {course.modules?.length ?? 0} modules
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-(--bg-elevated) border border-(--border-subtle) text-(--text-secondary) hover:bg-(--bg-hover) cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            {confirmDel ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { onDelete(); setConfirmDel(false); }}
                  className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#ef4444] text-white cursor-pointer border-none"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDel(false)}
                  className="px-2.5 py-1 rounded text-[11px] border border-(--border-subtle) text-(--text-muted) bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDel(true)}
                className="flex items-center gap-1 p-1.5 rounded-md text-(--text-faint) hover:text-red-400/70 hover:bg-red-500/[0.06] cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && (
          <CoursePreviewPanel
            course={course}
            onClose={() => setPreviewOpen(false)}
            onPublish={async () => { await onPublish(); setPreviewOpen(false); }}
            onReject={async (reason) => { await onReject(reason); setPreviewOpen(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── SheetsReview ─────────────────────────────────────────────────────────────

function SheetsReview() {
  const sheets  = useQuery(api.sheets.getPendingSheets);
  const publish = useMutation(api.sheets.publishSheet);
  const reject  = useMutation(api.sheets.rejectSheet);
  const del     = useMutation(api.sheets.remove);

  if (sheets === undefined) return <Loader />;
  if (sheets.length === 0)  return <Empty label="DSA sheets" />;

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-(--text-disabled)">
        {sheets.length} pending review
      </p>
      <div className="rounded-lg border border-(--border-subtle) overflow-hidden divide-y divide-(--border-subtle)">
        {sheets.map((s: any) => (
          <SheetRow
            key={String(s._id)}
            item={s}
            onPublish={async () => {
              try { await publish({ id: s._id as Id<"dsaSheets"> }); toast.success(`"${s.name}" published`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
            onReject={async (reason) => {
              try { await reject({ id: s._id as Id<"dsaSheets">, reason }); toast.success(`"${s.name}" rejected`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
            onDelete={async () => {
              try { await del({ id: s._id as Id<"dsaSheets"> }); toast.success(`"${s.name}" deleted`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CoursesReview ────────────────────────────────────────────────────────────

function CoursesReview() {
  const courses = useQuery(api.courses.getPendingCourses);
  const publish = useMutation(api.courses.publishCourse);
  const reject  = useMutation(api.courses.rejectCourse);
  const del     = useMutation(api.courses.adminDeleteCourse);

  if (courses === undefined) return <Loader />;
  if (courses.length === 0)  return <Empty label="courses" />;

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-(--text-disabled)">
        {courses.length} pending review
      </p>
      <div className="rounded-lg border border-(--border-subtle) overflow-hidden divide-y divide-(--border-subtle)">
        {courses.map((c: any) => (
          <CourseRow
            key={String(c._id)}
            course={c}
            onPublish={async () => {
              try { await publish({ id: c._id as Id<"courses"> }); toast.success(`"${c.title}" published`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
            onReject={async (reason) => {
              try { await reject({ id: c._id as Id<"courses">, reason }); toast.success(`"${c.title}" rejected`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
            onDelete={async () => {
              try { await del({ id: c._id as Id<"courses"> }); toast.success(`"${c.title}" deleted`); }
              catch (e: any) { toast.error(e?.message ?? "Failed"); }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function ContentReview() {
  const [tab, setTab] = useState<ContentTab>("sheets");

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">
          Instructor Platform
        </p>
        <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">Content Review</h2>
        <p className="text-[13px] text-(--text-faint)">
          Review and publish instructor-submitted content.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-(--border-subtle) overflow-x-auto">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`
              relative flex items-center gap-1.5 px-4 py-2.5 text-[13px]
              bg-transparent border-none cursor-pointer whitespace-nowrap shrink-0
              transition-colors duration-75
              ${tab === key ? "text-(--text-primary)" : "text-(--text-faint) hover:text-(--text-muted)"}
            `}
          >
            {tab === key && (
              <motion.span
                layoutId="contentTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5EFF] rounded-t-full"
              />
            )}
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
        >
          {tab === "sheets"  && <SheetsReview />}
          {tab === "courses" && <CoursesReview />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}