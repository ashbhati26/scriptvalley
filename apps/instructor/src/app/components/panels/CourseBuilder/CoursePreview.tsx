"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, ChevronRight, FileText,
  HelpCircle, Code2, Rocket, Layers, Eye,
} from "lucide-react";
import type { Module, CourseTemplate, CourseLevel } from "./courseTypes";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  title:       string;
  description: string;
  template:    CourseTemplate;
  level:       CourseLevel | "";
  modules:     Module[];
  onClose:     () => void;
}

// ── Level meta ────────────────────────────────────────────────────────────────
const LEVEL_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  beginner:     { label: "Beginner",     color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)"  },
  intermediate: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  advanced:     { label: "Advanced",     color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)"  },
  "all-levels": { label: "All Levels",   color: "#3A5EFF", bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.2)"  },
};

// ── Lesson row (read-only, mirrors student app) ───────────────────────────────
function LessonRow({
  lesson, globalIndex,
}: {
  lesson:      Module["lessons"] extends (infer L)[] | undefined ? L : never;
  globalIndex: number;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-(--bg-hover) transition-colors group cursor-default">
      <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-(--text-disabled) bg-(--bg-input) shrink-0">
        {(lesson as any).lessonNumber ?? globalIndex + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-(--text-secondary) leading-snug truncate">
          {(lesson as any).title || <span className="italic text-(--text-disabled)">Untitled lesson</span>}
        </p>
        {(lesson as any).topicsCovered && (
          <p className="text-[11px] text-(--text-disabled) mt-0.5 truncate">
            {(lesson as any).topicsCovered}
          </p>
        )}
      </div>
      <ChevronRight className="w-3 h-3 text-(--text-disabled) shrink-0" />
    </div>
  );
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({
  mod, modIndex, template, lessonOffset,
}: {
  mod:          Module;
  modIndex:     number;
  template:     CourseTemplate;
  lessonOffset: number;
}) {
  const lessons     = [...(mod.lessons     ?? [])].sort((a, b) => a.order - b.order);
  const hasMCQ      = (mod.mcqQuestions?.length     ?? 0) > 0;
  const hasCode     = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj = !!mod.miniProject?.title;
  const hasAssess   = hasMCQ || hasCode || hasMiniProj;
  const isStructured = template === "structured";

  return (
    <div className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden">
      {/* Module header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-(--border-subtle) bg-(--bg-input)">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-5 h-5 rounded bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center text-[9px] font-bold text-(--text-muted) shrink-0">
            {modIndex + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-(--text-primary) truncate">
              {mod.title || <span className="italic font-normal text-(--text-disabled)">Untitled module</span>}
            </h3>
            {mod.description && (
              <p className="text-xs text-(--text-faint) mt-0.5 line-clamp-1">{mod.description}</p>
            )}
          </div>
        </div>

        {/* Count chips */}
        <div className="flex items-center gap-1 shrink-0">
          {isStructured && lessons.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              <FileText className="w-2.5 h-2.5" />{lessons.length}
            </span>
          )}
          {hasMCQ && (
            <span className="flex items-center gap-1 text-[9px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              <HelpCircle className="w-2.5 h-2.5" />{mod.mcqQuestions!.length}
            </span>
          )}
          {hasCode && (
            <span className="flex items-center gap-1 text-[9px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              <Code2 className="w-2.5 h-2.5" />{mod.codingChallenges!.length}
            </span>
          )}
          {hasMiniProj && (
            <span className="flex items-center gap-1 text-[9px] text-(--text-disabled) bg-(--bg-hover) px-1.5 py-0.5 rounded">
              <Rocket className="w-2.5 h-2.5" />1
            </span>
          )}
        </div>
      </div>

      {/* Lesson rows — structured only */}
      {isStructured && lessons.length > 0 && (
        <div className="px-2 py-1.5 space-y-px">
          {lessons.map((lesson, li) => (
            <LessonRow key={li} lesson={lesson} globalIndex={lessonOffset + li} />
          ))}
        </div>
      )}

      {/* Freeform — single entry */}
      {!isStructured && (
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-(--text-faint) cursor-default">
            <BookOpen className="w-3.5 h-3.5 text-(--brand) shrink-0" />
            <span className="flex-1 text-sm text-(--text-secondary)">
              {mod.content ? "Has content" : <span className="italic text-(--text-disabled)">No content yet</span>}
            </span>
          </div>
        </div>
      )}

      {/* Assessment row */}
      {hasAssess && (
        <div className="px-2 pb-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-dashed border-(--border-subtle) cursor-default">
            <span className="text-sm shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-(--text-muted)">Practice &amp; Assessment</p>
              <p className="text-[10px] text-(--text-disabled) mt-0.5">
                {[hasMCQ && "MCQs", hasCode && "Challenges", hasMiniProj && "Mini project"]
                  .filter(Boolean).join(" · ")}
              </p>
            </div>
            <ChevronRight className="w-3 h-3 text-(--text-disabled) shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main preview ──────────────────────────────────────────────────────────────
export default function CoursePreview({ title, description, template, level, modules, onClose }: Props) {
  const isStructured = template === "structured";
  const sorted       = [...modules].sort((a, b) => a.order - b.order);

  const totalLessons    = isStructured
    ? sorted.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) : 0;
  const totalMCQs       = sorted.reduce((s, m) => s + (m.mcqQuestions?.length     ?? 0), 0);
  const totalChallenges = sorted.reduce(
    (s, m) => s + (m.codingChallenges?.length ?? 0) + (m.miniProject ? 1 : 0), 0
  );

  const levelMeta = level ? LEVEL_META[level] : null;

  // Per-module lesson offsets for global numbering
  const lessonOffsets: number[] = [];
  let off = 0;
  for (const m of sorted) { lessonOffsets.push(off); off += m.lessons?.length ?? 0; }

  return (
    <AnimatePresence>
      <motion.div
        key="preview-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        key="preview-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed inset-4 md:inset-8 z-50 rounded-xl border border-(--border-subtle) bg-(--bg-base) shadow-2xl shadow-black/30 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview topbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-(--border-subtle) bg-(--bg-input) shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-(--brand-subtle) border border-(--brand-border) flex items-center justify-center shrink-0">
              <Eye className="w-3.5 h-3.5 text-(--brand)" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled)">Student View</p>
              <p className="text-xs font-medium text-(--text-secondary)">Course Overview Preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:bg-(--bg-hover) transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">

            {/* Course header */}
            <header className="px-8 md:px-14 pt-10 pb-8 border-b border-(--border-subtle)">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-(--text-disabled) mb-6">
                <span className="hover:text-(--text-faint) transition-colors">Courses</span>
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span className="text-(--text-faint) truncate">{title || "Untitled Course"}</span>
              </nav>

              {/* Badges */}
              {levelMeta && (
                <div className="mb-3">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                    style={{ color: levelMeta.color, background: levelMeta.bg, borderColor: levelMeta.border }}
                  >
                    {levelMeta.label}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-(--text-primary) leading-tight tracking-tight mb-2">
                {title || <span className="text-(--text-disabled) italic">No title yet</span>}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-sm text-(--text-faint) leading-relaxed max-w-2xl mb-5">
                  {description}
                </p>
              )}

              {/* Notion-style property rows */}
              <div className="space-y-1.5 mb-6">
                {[
                  { label: "Modules",    value: String(sorted.length) },
                  isStructured && totalLessons > 0
                    ? { label: "Lessons",    value: String(totalLessons) }    : null,
                  totalMCQs > 0
                    ? { label: "MCQs",       value: String(totalMCQs) }       : null,
                  totalChallenges > 0
                    ? { label: "Challenges", value: String(totalChallenges) } : null,
                ].filter(Boolean).map((row: any) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-(--text-disabled) w-24 shrink-0">
                      {row.label}
                    </span>
                    <span className="text-xs text-(--text-secondary) font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA — disabled in preview */}
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-(--brand) text-white text-sm font-medium opacity-60 cursor-not-allowed"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Start Learning
              </button>
            </header>

            {/* Course content list */}
            <div className="px-8 md:px-14 py-8">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-(--text-disabled)">
                  Course Content
                </p>
                <span className="text-[10px] text-(--text-disabled) bg-(--bg-input) px-1.5 py-0.5 rounded">
                  {sorted.length} module{sorted.length !== 1 ? "s" : ""}
                  {isStructured && totalLessons > 0 ? ` · ${totalLessons} lessons` : ""}
                </span>
              </div>

              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                  <div className="w-10 h-10 rounded-xl bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
                    <Layers className="w-5 h-5 text-(--text-disabled)" />
                  </div>
                  <p className="text-sm text-(--text-faint)">No modules added yet.</p>
                  <p className="text-xs text-(--text-disabled)">Add modules in the editor to see them here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sorted.map((mod, mi) => (
                    <ModuleCard
                      key={mod._key}
                      mod={mod}
                      modIndex={mi}
                      template={template}
                      lessonOffset={lessonOffsets[mi]}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Preview footer */}
        <div className="shrink-0 px-5 py-3 border-t border-(--border-subtle) bg-(--bg-input) flex items-center justify-between">
          <p className="text-xs text-(--text-disabled)">
            This is a preview of how students will see the course overview page.
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-(--text-muted) hover:bg-(--bg-hover) border border-(--border-subtle) transition-colors"
          >
            <X className="w-3 h-3" />Close preview
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}