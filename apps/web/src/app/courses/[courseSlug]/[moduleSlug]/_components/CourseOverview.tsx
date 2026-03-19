"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  Code2,
  Rocket,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Course, CourseModule, Lesson, lessonSlug } from "../../../courseTypes";

const LEVEL_META: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  beginner: {
    label: "Beginner",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  intermediate: {
    label: "Intermediate",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  advanced: {
    label: "Advanced",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  "all-levels": {
    label: "All Levels",
    color: "#3A5EFF",
    bg: "rgba(58,94,255,0.08)",
    border: "rgba(58,94,255,0.2)",
  },
};

// ── Lesson row ────────────────────────────────────────────────────────────────
function LessonRow({
  courseSlug,
  moduleSlug,
  lesson,
  lessonIndex,
  globalIndex,
}: {
  courseSlug: string;
  moduleSlug: string;
  lesson: Lesson;
  lessonIndex: number;
  globalIndex: number;
}) {
  const lSlug = lessonSlug(lesson, lessonIndex);

  return (
    <Link
      href={`/courses/${courseSlug}/${moduleSlug}/${lSlug}`}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--bg-hover)] transition-colors"
    >
      {/* Number */}
      <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-disabled)] bg-[var(--bg-input)] shrink-0 group-hover:text-[#3A5EFF] group-hover:bg-[rgba(58,94,255,0.08)] transition-colors">
        {lesson.lessonNumber ?? globalIndex + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug truncate">
          {lesson.title}
        </p>
        {lesson.topicsCovered && (
          <p className="text-[11px] text-[var(--text-disabled)] mt-0.5 truncate">
            {lesson.topicsCovered}
          </p>
        )}
      </div>

      <ChevronRight className="w-3 h-3 text-[var(--text-disabled)] group-hover:text-[#3A5EFF] group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

// ── Module section ────────────────────────────────────────────────────────────
function ModuleSection({
  course,
  mod,
  modIndex,
  lessonOffset,
}: {
  course: Course;
  mod: CourseModule;
  modIndex: number;
  lessonOffset: number;
}) {
  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const hasMCQ = (mod.mcqQuestions?.length ?? 0) > 0;
  const hasCode = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj = !!mod.miniProject?.title;
  const hasAssess = hasMCQ || hasCode || hasMiniProj;
  const isStructured = course.template === "structured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, delay: modIndex * 0.04, ease: "easeOut" }}
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden"
    >
      {/* Module header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-5 h-5 rounded bg-[var(--bg-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-[9px] font-bold text-[var(--text-muted)] shrink-0">
            {modIndex + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {mod.title}
            </h3>
            {mod.description && (
              <p className="text-xs text-[var(--text-faint)] mt-0.5 line-clamp-1">
                {mod.description}
              </p>
            )}
          </div>
        </div>

        {/* Count chips */}
        <div className="flex items-center gap-1 shrink-0">
          {isStructured && lessons.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] text-[var(--text-disabled)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
              <FileText className="w-2.5 h-2.5" />
              {lessons.length}
            </span>
          )}
          {hasMCQ && (
            <span className="flex items-center gap-1 text-[9px] text-[var(--text-disabled)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
              <HelpCircle className="w-2.5 h-2.5" />
              {mod.mcqQuestions!.length}
            </span>
          )}
          {hasCode && (
            <span className="flex items-center gap-1 text-[9px] text-[var(--text-disabled)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
              <Code2 className="w-2.5 h-2.5" />
              {mod.codingChallenges!.length}
            </span>
          )}
          {hasMiniProj && (
            <span className="flex items-center gap-1 text-[9px] text-[var(--text-disabled)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
              <Rocket className="w-2.5 h-2.5" />1
            </span>
          )}
        </div>
      </div>

      {/* Structured: lesson rows */}
      {isStructured && lessons.length > 0 && (
        <div className="px-2 py-1.5 space-y-px">
          {lessons.map((lesson, li) => (
            <LessonRow
              key={li}
              courseSlug={course.slug}
              moduleSlug={mod.slug}
              lesson={lesson}
              lessonIndex={li}
              globalIndex={lessonOffset + li}
            />
          ))}
        </div>
      )}

      {/* Freeform: single read link */}
      {!isStructured && (
        <div className="px-2 py-1.5">
          <Link
            href={`/courses/${course.slug}/${mod.slug}`}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-[var(--bg-hover)] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3A5EFF] shrink-0" />
            <span className="flex-1 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              Start reading
            </span>
            <ArrowRight className="w-3 h-3 text-[var(--text-disabled)] group-hover:text-[#3A5EFF] transition-colors" />
          </Link>
        </div>
      )}

      {/* Assessment row */}
      {hasAssess && (
        <div className="px-2 pb-1.5">
          <Link
            href={`/courses/${course.slug}/${mod.slug}/assessments`}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-dashed border-[var(--border-subtle)] hover:border-[rgba(58,94,255,0.25)] hover:bg-[rgba(58,94,255,0.03)] transition-all"
          >
            <span className="text-sm shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                Practice &amp; Assessment
              </p>
              <p className="text-[10px] text-[var(--text-disabled)] mt-0.5">
                {[
                  hasMCQ && "MCQs",
                  hasCode && "Challenges",
                  hasMiniProj && "Mini project",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <ChevronRight className="w-3 h-3 text-[var(--text-disabled)] group-hover:text-[#3A5EFF] transition-colors shrink-0" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CourseOverview({ course }: { course: Course }) {
  const isStructured = course.template === "structured";
  const modules = [...(course.modules ?? [])].sort((a, b) => a.order - b.order);
  const totalLessons = isStructured
    ? modules.reduce((s, m) => s + (m.lessons?.length ?? 0), 0)
    : 0;
  const totalMCQs = modules.reduce(
    (s, m) => s + (m.mcqQuestions?.length ?? 0),
    0,
  );
  const totalChallenges = modules.reduce(
    (s, m) => s + (m.codingChallenges?.length ?? 0) + (m.miniProject ? 1 : 0),
    0,
  );
  const levelMeta = course.level ? LEVEL_META[course.level] : null;

  // Cumulative lesson offset per module for global numbering
  const lessonOffsets: number[] = [];
  let off = 0;
  for (const m of modules) {
    lessonOffsets.push(off);
    off += m.lessons?.length ?? 0;
  }

  // Deep-link to first lesson for CTA
  const firstMod = modules[0];
  let startHref = `/courses/${course.slug}`;
  if (firstMod) {
    startHref =
      isStructured && firstMod.lessons?.[0]
        ? `/courses/${course.slug}/${firstMod.slug}/${lessonSlug(firstMod.lessons[0], 0)}`
        : `/courses/${course.slug}/${firstMod.slug}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col min-h-full"
    >
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <header className="px-8 md:px-14 pt-10 pb-8 border-b border-[var(--border-subtle)]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-disabled)] mb-6">
          <Link
            href="/courses"
            className="hover:text-[var(--text-faint)] transition-colors"
          >
            Courses
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[var(--text-faint)] truncate">
            {course.title}
          </span>
        </nav>

        {/* Badges */}
        {(levelMeta || course.category) && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {course.category && (
              <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded bg-[rgba(58,94,255,0.08)] border border-[rgba(58,94,255,0.2)] text-[#3A5EFF]">
                {course.category}
              </span>
            )}
            {levelMeta && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                style={{
                  color: levelMeta.color,
                  background: levelMeta.bg,
                  borderColor: levelMeta.border,
                }}
              >
                {levelMeta.label}
              </span>
            )}
          </div>
        )}

        {/* Title — Notion page-title style */}
        <h1 className="text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight mb-2">
          {course.title}
        </h1>

        {course.description && (
          <p className="text-sm text-[var(--text-faint)] leading-relaxed max-w-2xl mb-5">
            {course.description}
          </p>
        )}

        {/* Notion-style property rows */}
        <div className="space-y-1.5 mb-6">
          {(
            [
              { label: "Modules", value: String(modules.length) },
              isStructured && totalLessons > 0
                ? { label: "Lessons", value: String(totalLessons) }
                : null,
              totalMCQs > 0
                ? { label: "MCQs", value: String(totalMCQs) }
                : null,
              totalChallenges > 0
                ? { label: "Challenges", value: String(totalChallenges) }
                : null,
            ] as { label: string; value: string }[]
          )
            .filter(
              (row): row is { label: string; value: string } => row !== null,
            )
            .map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] w-24 shrink-0">
                  {row.label}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {row.value}
                </span>
              </div>
            ))}
        </div>

        {/* Start button */}
        <Link
          href={startHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#3A5EFF] hover:bg-[#2d4ee0] text-white text-sm font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Start Learning
        </Link>
      </header>

      {/* ── Content list ──────────────────────────────────────────────────── */}
      <div className="flex-1 px-8 md:px-14 py-8">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-disabled)]">
            Course Content
          </p>
          <span className="text-[10px] text-[var(--text-disabled)] bg-[var(--bg-input)] px-1.5 py-0.5 rounded">
            {modules.length} module{modules.length !== 1 ? "s" : ""}
            {isStructured && totalLessons > 0
              ? ` · ${totalLessons} lessons`
              : ""}
          </span>
        </div>

        {modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <BookOpen className="w-8 h-8 text-[var(--text-disabled)]" />
            <p className="text-sm text-[var(--text-faint)]">
              No modules yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {modules.map((mod, mi) => (
              <ModuleSection
                key={`${mod.slug}-${mi}`}
                course={course}
                mod={mod}
                modIndex={mi}
                lessonOffset={lessonOffsets[mi]}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
