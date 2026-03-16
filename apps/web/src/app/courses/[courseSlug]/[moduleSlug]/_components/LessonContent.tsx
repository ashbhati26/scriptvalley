"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";
import { CourseModule, Lesson, lessonSlug } from "../../../courseTypes";
import toast from "react-hot-toast";

interface Props {
  courseSlug: string;
  mod: CourseModule;
  modIndex: number;
  totalModules: number;
  lesson: Lesson;
  lessonIndex: number;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  prevMod: CourseModule | null;
  nextMod: CourseModule | null;
  isCompleted: boolean;
}

const richContentCls = `
  flex-1 px-8 md:px-16 py-8
  text-sm text-[var(--text-secondary)] leading-[1.85]

  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)]
  [&_h1]:mt-10 [&_h1]:mb-3 [&_h1]:tracking-tight

  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)]
  [&_h2]:mt-8 [&_h2]:mb-2

  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-secondary)]
  [&_h3]:mt-6 [&_h3]:mb-1.5

  [&_p]:my-2 [&_p]:leading-[1.85]

  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
  [&_li]:my-1

  [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50
  [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:italic
  [&_blockquote]:text-[var(--text-muted)] [&_blockquote]:bg-[rgba(58,94,255,0.03)]
  [&_blockquote]:py-2 [&_blockquote]:rounded-r-md

  [&_code]:bg-[var(--bg-input)] [&_code]:rounded
  [&_code]:px-1.5 [&_code]:py-0.5
  [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono

  [&_pre]:bg-[var(--bg-elevated)] [&_pre]:border
  [&_pre]:border-[var(--border-subtle)] [&_pre]:rounded-xl
  [&_pre]:p-5 [&_pre]:my-5 [&_pre]:overflow-x-auto

  [&_pre_code]:bg-transparent [&_pre_code]:text-[var(--text-faint)]
  [&_pre_code]:p-0 [&_pre_code]:text-xs [&_pre_code]:leading-relaxed

  [&_a]:text-[#3A5EFF] [&_a]:hover:underline

  [&_table]:border-collapse [&_table]:w-full [&_table]:my-5
  [&_td]:border [&_td]:border-[var(--border-subtle)]
  [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:align-top
  [&_th]:border [&_th]:border-[var(--border-subtle)]
  [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[var(--bg-input)]
  [&_th]:text-xs [&_th]:font-semibold

  [&_hr]:border-[var(--border-subtle)] [&_hr]:my-8

  [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-5
  [&_img]:border [&_img]:border-[var(--border-subtle)]
`;

export default function LessonContent({
  courseSlug,
  mod,
  modIndex,
  lesson,
  lessonIndex,
  prevLesson,
  nextLesson,
  nextMod,
  isCompleted,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const markComplete = useMutation(api.courses.markLessonComplete);
  const [marking, setMarking] = useState(false);
  const [done, setDone] = useState(isCompleted);

  // Build the next destination — next lesson or assessments or next module
  const currentLSlug = lessonSlug(lesson, lessonIndex);

  function nextHref(): string | null {
    if (nextLesson)
      return `/courses/${courseSlug}/${mod.slug}/${lessonSlug(nextLesson, lessonIndex + 1)}`;
    const hasMCQ = (mod.mcqQuestions?.length ?? 0) > 0;
    const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
    const hasMiniProj = !!mod.miniProject?.title;
    if (hasMCQ || hasChallenges || hasMiniProj)
      return `/courses/${courseSlug}/${mod.slug}/assessments`;
    if (nextMod) return `/courses/${courseSlug}/${nextMod.slug}`;
    return null;
  }

  async function handleMarkComplete() {
    if (!user) {
      toast.error("Sign in to track progress");
      return;
    }
    if (done) return;

    setMarking(true);
    try {
      await markComplete({
        courseSlug,
        moduleSlug: mod.slug,
        lessonSlug: currentLSlug,
      });
      setDone(true);
      toast.success("Lesson complete!");

      // Auto-advance after a short visual pause
      setTimeout(() => {
        const dest = nextHref();
        if (dest) router.push(dest);
      }, 600);
    } catch {
      toast.error("Could not save progress");
    } finally {
      setMarking(false);
    }
  }

  function lessonHref(l: Lesson, li: number) {
    return `/courses/${courseSlug}/${mod.slug}/${lessonSlug(l, li)}`;
  }

  const isLastLesson = !nextLesson;
  const hasMCQ = (mod.mcqQuestions?.length ?? 0) > 0;
  const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj = !!mod.miniProject?.title;
  const hasAssessments = hasMCQ || hasChallenges || hasMiniProj;

  return (
    <motion.div
      key={`${mod.slug}-${lessonIndex}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col min-h-full max-w-4xl mx-auto w-full"
    >
      {/* Lesson header */}
      <div className="px-8 md:px-16 pt-10 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-disabled)] mb-3 flex-wrap">
          <span>Module {modIndex + 1}</span>
          <span>/</span>
          <span className="text-[var(--text-faint)]">{mod.title}</span>
          <span>/</span>
          <span className="text-[var(--text-faint)]">
            Lesson {lesson.lessonNumber ?? `${lessonIndex + 1}`}
          </span>
          {done && (
            <span className="flex items-center gap-1 text-emerald-500 font-medium ml-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <div className="flex items-start gap-3">
          {lesson.lessonNumber && (
            <span className="mt-1 shrink-0 text-[10px] font-mono font-bold text-[var(--text-disabled)] bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-md px-2 py-1">
              {lesson.lessonNumber}
            </span>
          )}
          <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
            {lesson.title}
          </h1>
        </div>

        {lesson.topicsCovered && (
          <div className="flex items-start gap-1.5 mt-3">
            <Tag className="w-3.5 h-3.5 text-[var(--text-disabled)] shrink-0 mt-px" />
            <p className="text-xs text-[var(--text-disabled)] leading-relaxed">
              {lesson.topicsCovered}
            </p>
          </div>
        )}
      </div>

      {/* Full flowing article */}
      <div
        className={richContentCls}
        dangerouslySetInnerHTML={{
          __html:
            lesson.content ||
            "<p class='italic text-[var(--text-disabled)]'>This lesson has no content yet.</p>",
        }}
      />

      {/* ── Bottom actions ────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-8 border-t border-[var(--border-subtle)] space-y-5">
        {/* Assessment nudge — only on last lesson */}
        {isLastLesson && hasAssessments && (
          <Link
            href={`/courses/${courseSlug}/${mod.slug}/assessments`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(58,94,255,0.2)] bg-[rgba(58,94,255,0.04)] hover:bg-[rgba(58,94,255,0.08)] transition-colors group"
          >
            <span className="text-lg shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                Ready to practice?
              </p>
              <p className="text-xs text-[var(--text-disabled)]">
                This module has MCQs, coding challenges
                {hasMiniProj ? ", and a mini project" : ""}.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#3A5EFF] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        )}

        {/* Mark complete + prev/next row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Prev */}
          {prevLesson ? (
            <Link
              href={lessonHref(prevLesson, lessonIndex - 1)}
              className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Previous
                </p>
                <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                  {prevLesson.title}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href={`/courses/${courseSlug}/${mod.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Module
                </p>
                <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                  {mod.title}
                </p>
              </div>
            </Link>
          )}

          {/* Mark Complete — center */}
          {user && (
            <button
              onClick={handleMarkComplete}
              disabled={marking || done}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                done
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 cursor-default"
                  : marking
                    ? "bg-[var(--brand)] text-white opacity-60 cursor-not-allowed"
                    : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
              }`}
            >
              {done ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </>
              ) : marking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  Mark as Complete
                </>
              )}
            </button>
          )}

          {/* Next */}
          {nextLesson ? (
            <Link
              href={lessonHref(nextLesson, lessonIndex + 1)}
              className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group text-right"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Next
                </p>
                <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                  {nextLesson.title}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : nextMod ? (
            <Link
              href={`/courses/${courseSlug}/${nextMod.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group text-right"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Next module
                </p>
                <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                  {nextMod.title}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                Course Complete 🎉
              </p>
              <Link
                href="/courses"
                className="text-xs text-[#3A5EFF] hover:underline"
              >
                Browse more courses →
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
