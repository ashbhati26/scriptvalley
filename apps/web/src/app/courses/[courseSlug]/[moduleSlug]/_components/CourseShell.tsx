"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import CourseSidebar from "./CourseSidebar";
import { Course } from "../../../courseTypes";

interface Props {
  course:   Course;
  children: React.ReactNode;
}

export default function CourseShell({ course, children }: Props) {
  const params           = useParams();
  const activeModSlug    = params.moduleSlug   as string;
  const activeLessonSlug = params.lessonSlug   as string | undefined;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const progressRows = useQuery(
    api.courses.getLessonProgress,
    { courseSlug: course.slug }
  ) ?? [];

  // Build a Set of "moduleSlug::lessonSlug" for O(1) lookups in sidebar
  const completedSet = new Set<string>(
    progressRows.map((r: { moduleSlug: string; lessonSlug: string }) =>
      `${r.moduleSlug}::${r.lessonSlug}`
    )
  );

  const sidebarProps = {
    course,
    activeModSlug,
    activeLessonSlug,
    completedSet,
    onNavigate: () => {},
  };

  return (
    <div className="flex mt-16 overflow-hidden min-h-[calc(100vh-3rem)] bg-[var(--bg-base)]">

      {/* ── Mobile drawer backdrop ───────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-100 w-72 bg-[var(--bg-base)] border-r border-[var(--border-subtle)] md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-medium text-[var(--text-muted)] truncate">{course.title}</span>
                <button onClick={() => setDrawerOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--bg-hover)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CourseSidebar {...sidebarProps} onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-[var(--border-subtle)] sticky top-0 h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hide">
        <div className="px-4 py-4 border-b border-[var(--border-subtle)] sticky top-0 bg-[var(--bg-base)] z-10">
          <Link href="/courses"
            className="flex items-center gap-1.5 text-[10px] text-[var(--text-disabled)] hover:text-[var(--text-faint)] transition-colors mb-2">
            <ChevronLeft className="w-3 h-3" />All Courses
          </Link>
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[rgba(58,94,255,0.08)] border border-[rgba(58,94,255,0.2)] flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-[#3A5EFF]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">Course</p>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{course.title}</h2>
            </div>
          </div>

          {/* Overall progress bar */}
          {course.template === "structured" && (() => {
            const total = (course.modules ?? []).reduce((s, m) => s + (m.lessons?.length ?? 0), 0);
            const done  = completedSet.size;
            const pct   = total > 0 ? Math.floor((done / total) * 100) : 0;
            return total > 0 ? (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[var(--text-disabled)]">Progress</span>
                  <span className="text-[10px] font-medium text-[var(--text-faint)]">{done}/{total}</span>
                </div>
                <div className="h-1 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                  <div
                    className="h-full bg-[#3A5EFF] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ) : null;
          })()}
        </div>

        <CourseSidebar {...sidebarProps} />
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-2 px-4 h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] sticky top-0 z-20">
          <button onClick={() => setDrawerOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--bg-hover)]">
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-[var(--text-muted)] truncate">{course.title}</span>
        </div>

        <div className="max-w-3xl mx-auto w-full mt-0 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}