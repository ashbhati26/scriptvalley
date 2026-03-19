"use client";

// FILE: app/(main)/courses/[courseSlug]/[moduleSlug]/_components/CourseSidebar.tsx
// CHANGE: Added an "Overview" link at the very top of the sidebar nav.

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Check, LayoutList } from "lucide-react";
import { Course, lessonSlug } from "../../../courseTypes";

interface Props {
  course:            Course;
  activeModSlug:     string;
  activeLessonSlug?: string;
  completedSet:      Set<string>;
  onNavigate:        () => void;
}

export default function CourseSidebar({
  course, activeModSlug, activeLessonSlug, completedSet, onNavigate,
}: Props) {
  const isStructured = course.template === "structured";
  const modules      = [...(course.modules ?? [])].sort((a, b) => a.order - b.order);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([activeModSlug]));
  useEffect(() => {
    setExpanded((prev) => new Set([...prev, activeModSlug]));
  }, [activeModSlug]);

  function toggle(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  // Is the overview page active? (no moduleSlug in URL — activeModSlug will be undefined/empty)
  const isOverviewActive = !activeModSlug;

  // ── Overview link — shown on all templates ────────────────────────────────
  const OverviewLink = (
    <Link
      href={`/courses/${course.slug}`}
      onClick={onNavigate}
      className={[
        "relative flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm transition-colors mb-1",
        isOverviewActive
          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
      ].join(" ")}
    >
      {isOverviewActive && (
        <motion.span
          layoutId="sidebar-indicator"
          className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#3A5EFF] rounded-r-full"
        />
      )}
      <span className={[
        "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
        isOverviewActive ? "bg-[#3A5EFF] text-white" : "bg-[var(--bg-hover)] text-[var(--text-disabled)]",
      ].join(" ")}>
        <LayoutList className="w-3 h-3" />
      </span>
      <span className="text-xs font-medium">Course Overview</span>
    </Link>
  );

  // ── FREEFORM ──────────────────────────────────────────────────────────────
  if (!isStructured) {
    return (
      <nav className="flex-1 px-2 py-3 space-y-px">
        {OverviewLink}
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] px-2.5 mb-2 mt-2">
          Modules · {modules.length}
        </p>
        {modules.map((mod, idx) => {
          const isActive = mod.slug === activeModSlug &&
            modules.findIndex((m) => m.slug === activeModSlug) === idx;
          return (
            <Link
              key={`${mod.slug}-${idx}`}
              href={`/courses/${course.slug}/${mod.slug}`}
              onClick={onNavigate}
              className={[
                "relative flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg text-sm transition-colors group",
                isActive
                  ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#3A5EFF] rounded-r-full"
                />
              )}
              <span className={[
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-px",
                isActive ? "bg-[#3A5EFF] text-white" : "bg-[var(--bg-hover)] text-[var(--text-disabled)]",
              ].join(" ")}>
                {idx + 1}
              </span>
              <span className="leading-snug line-clamp-2 text-xs">{mod.title}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // ── STRUCTURED ────────────────────────────────────────────────────────────
  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length ?? 0), 0);

  return (
    <nav className="flex-1 px-2 py-3">
      {OverviewLink}

      <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] px-2.5 mb-2 mt-2">
        {modules.length} module{modules.length !== 1 ? "s" : ""} · {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
      </p>

      <div className="space-y-px">
        {modules.map((mod, mi) => {
          const lessons     = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
          const isModActive = mod.slug === activeModSlug;
          const isOpen      = expanded.has(mod.slug);

          const modCompleted = lessons.filter((l, li) =>
            completedSet.has(`${mod.slug}::${lessonSlug(l, li)}`)
          ).length;
          const modTotal   = lessons.length;
          const modAllDone = modTotal > 0 && modCompleted === modTotal;

          const hasMCQ        = (mod.mcqQuestions?.length     ?? 0) > 0;
          const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
          const hasMiniProj   = !!mod.miniProject?.title;
          const hasAssessments = hasMCQ || hasChallenges || hasMiniProj;

          return (
            <div key={`${mod.slug}-${mi}`}>
              {/* Module row */}
              <button
                onClick={() => toggle(mod.slug)}
                className={[
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors group text-left",
                  isModActive ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-hover)]",
                ].join(" ")}
              >
                <span className={[
                  "shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold",
                  modAllDone
                    ? "bg-emerald-500 text-white"
                    : isModActive
                      ? "bg-[#3A5EFF] text-white"
                      : "bg-[var(--bg-hover)] text-[var(--text-disabled)]",
                ].join(" ")}>
                  {modAllDone ? <Check className="w-3 h-3" /> : mi + 1}
                </span>

                <span className={[
                  "flex-1 text-xs font-medium leading-snug text-left line-clamp-2",
                  isModActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]",
                ].join(" ")}>
                  {mod.title}
                </span>

                {modTotal > 0 && (
                  <span className={`shrink-0 text-[9px] font-medium ${
                    modAllDone ? "text-emerald-500" : "text-[var(--text-disabled)]"
                  }`}>
                    {modCompleted}/{modTotal}
                  </span>
                )}

                <span className="shrink-0 text-[var(--text-disabled)]">
                  {isOpen
                    ? <ChevronDown  className="w-3 h-3" />
                    : <ChevronRight className="w-3 h-3" />}
                </span>
              </button>

              {/* Lessons list */}
              {isOpen && lessons.length > 0 && (
                <div className="ml-4 pl-3 border-l border-[var(--border-subtle)] mt-px mb-1 space-y-px">
                  {lessons.map((lesson, li) => {
                    const lSlug    = lessonSlug(lesson, li);
                    const isActive = isModActive && activeLessonSlug === lSlug;
                    const isDone   = completedSet.has(`${mod.slug}::${lSlug}`);

                    return (
                      <Link
                        key={li}
                        href={`/courses/${course.slug}/${mod.slug}/${lSlug}`}
                        onClick={onNavigate}
                        className={[
                          "relative flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors group",
                          isActive
                            ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                            : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
                        ].join(" ")}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="lesson-indicator"
                            className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#3A5EFF] rounded-r-full"
                          />
                        )}

                        <span className={[
                          "shrink-0 w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold",
                          isDone
                            ? "bg-emerald-500/20 text-emerald-500"
                            : isActive
                              ? "bg-[#3A5EFF]/20 text-[#3A5EFF]"
                              : "text-[var(--text-disabled)]",
                        ].join(" ")}>
                          {isDone
                            ? <Check className="w-2.5 h-2.5" />
                            : lesson.lessonNumber ?? `${li + 1}`}
                        </span>

                        <span className={`text-[11px] leading-snug line-clamp-2 flex-1 ${
                          isDone
                            ? "text-[var(--text-disabled)] line-through decoration-[var(--text-disabled)]"
                            : ""
                        }`}>
                          {lesson.title}
                        </span>
                      </Link>
                    );
                  })}

                  {/* Assessment row */}
                  {hasAssessments && (
                    <Link
                      href={`/courses/${course.slug}/${mod.slug}/assessments`}
                      onClick={onNavigate}
                      className={[
                        "relative flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors group",
                        isModActive && activeLessonSlug === "assessments"
                          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
                      ].join(" ")}
                    >
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center text-[9px]">🎯</span>
                      <span className="text-[11px] leading-snug flex-1">
                        Practice &amp; Assessment
                        <span className="ml-1.5 text-[9px] text-[var(--text-disabled)]">
                          {[hasMCQ && "MCQ", hasChallenges && "Code", hasMiniProj && "Project"]
                            .filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </Link>
                  )}
                </div>
              )}

              {isOpen && lessons.length === 0 && (
                <div className="ml-4 pl-3 border-l border-[var(--border-subtle)] mt-px mb-1">
                  <p className="text-[10px] text-[var(--text-disabled)] italic px-2.5 py-2">
                    No lessons yet
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}