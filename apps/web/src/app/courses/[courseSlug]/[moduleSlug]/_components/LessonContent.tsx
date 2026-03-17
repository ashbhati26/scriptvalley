"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Tag, CheckCircle2, Circle, BookOpen, Target } from "lucide-react";
import { motion } from "framer-motion";
import { CourseModule, Lesson, lessonSlug } from "../../../courseTypes";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  courseSlug:   string;
  mod:          CourseModule;
  modIndex:     number;
  totalModules: number;
  lesson:       Lesson;
  lessonIndex:  number;
  prevLesson:   Lesson | null;
  nextLesson:   Lesson | null;
  isCompleted:  boolean;
}

export default function LessonContent({
  courseSlug, mod,
  lesson, lessonIndex, nextLesson,
  isCompleted,
}: Props) {
  const router     = useRouter();
  const { user }   = useUser();
  const markComplete = useMutation(api.courses.markLessonComplete);
  const [marking, setMarking] = useState(false);
  const [done,    setDone]    = useState(isCompleted);

  const currentLSlug = lessonSlug(lesson, lessonIndex);

  function nextHref(): string | null {
    if (nextLesson) return `/courses/${courseSlug}/${mod.slug}/${lessonSlug(nextLesson, lessonIndex + 1)}`;
    const hasMCQ        = (mod.mcqQuestions?.length     ?? 0) > 0;
    const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
    const hasMiniProj   = !!mod.miniProject?.title;
    if (hasMCQ || hasChallenges || hasMiniProj) return `/courses/${courseSlug}/${mod.slug}/assessments`;
    return null;
  }

  async function handleMarkComplete() {
    if (!user) { toast.error("Sign in to track progress"); return; }
    if (done) return;
    setMarking(true);
    try {
      await markComplete({ courseSlug, moduleSlug: mod.slug, lessonSlug: currentLSlug });
      setDone(true);
      toast.success("Lesson complete!");
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

  const isLastLesson   = !nextLesson;
  const hasMCQ         = (mod.mcqQuestions?.length     ?? 0) > 0;
  const hasChallenges  = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj    = !!mod.miniProject?.title;
  const hasAssessments = hasMCQ || hasChallenges || hasMiniProj;

  return (
    <motion.article
      key={`${mod.slug}-${lessonIndex}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col min-h-full"
    >
      {/* Header */}
      <header className="px-8 md:px-14 pt-10 pb-7 border-b border-(--border-subtle)">
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-(--text-disabled) mb-4">
          <BookOpen className="w-3 h-3 shrink-0" />
          <span>{mod.title}</span>
          <span className="opacity-40 mx-0.5">/</span>
          <span className="text-(--text-faint)">
            Lesson {lesson.lessonNumber ?? lessonIndex + 1}
          </span>
          {done && (
            <span className="flex items-center gap-1 text-emerald-500 ml-2 normal-case tracking-normal font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-(--text-primary) leading-tight tracking-tight">
          {lesson.title}
        </h1>

        {lesson.topicsCovered && (
          <div className="flex items-start gap-2 mt-3">
            <Tag className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 mt-0.5" />
            <p className="text-xs text-(--text-disabled) leading-relaxed">{lesson.topicsCovered}</p>
          </div>
        )}
      </header>

      {/* Article body */}
      <div
        className="flex-1 px-8 md:px-14 py-10 text-sm text-(--text-secondary) leading-relaxed
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-(--text-primary) [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:tracking-tight
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:mt-9 [&_h2]:mb-3
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-(--text-secondary) [&_h3]:mt-7 [&_h3]:mb-2
          [&_p]:my-3 [&_p]:leading-[1.85]
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1
          [&_li]:text-(--text-secondary) [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-(--text-primary)
          [&_em]:italic [&_em]:text-(--text-muted)
          [&_blockquote]:border-l-2 [&_blockquote]:border-(--brand)/40 [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:text-(--text-muted) [&_blockquote]:bg-(--brand)/[0.02] [&_blockquote]:py-1 [&_blockquote]:rounded-r-md
          [&_code]:font-mono [&_code]:text-xs [&_code]:bg-(--bg-input) [&_code]:text-(--brand) [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md
          [&_pre]:bg-(--bg-elevated) [&_pre]:border [&_pre]:border-(--border-subtle) [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:text-xs
          [&_pre_code]:bg-transparent [&_pre_code]:text-(--text-faint) [&_pre_code]:p-0 [&_pre_code]:leading-relaxed
          [&_a]:text-(--brand) [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-(--brand)/30 [&_a]:hover:decoration-(--brand) [&_a]:transition-all
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-sm
          [&_thead_tr]:border-b [&_thead_tr]:border-(--border-subtle)
          [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-(--text-muted) [&_th]:uppercase [&_th]:tracking-wide
          [&_td]:px-3 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-(--border-subtle) [&_td]:text-(--text-secondary) [&_td]:align-top
          [&_tr:last-child_td]:border-0
          [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-(--border-subtle) [&_hr]:my-10
          [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-6 [&_img]:border [&_img]:border-(--border-subtle)"
        dangerouslySetInnerHTML={{
          __html: lesson.content || "<p class='italic'>No content yet.</p>",
        }}
      />

      {/* Assessment nudge — last lesson only */}
      {isLastLesson && hasAssessments && (
        <div className="px-8 md:px-14 pb-4">
          <Link
            href={`/courses/${courseSlug}/${mod.slug}/assessments`}
            className="flex items-center gap-3 px-5 py-4 rounded-xl border border-(--brand)/20 bg-(--brand)/[0.03] hover:bg-(--brand)/[0.06] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-(--brand)/10 border border-(--brand)/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-(--brand)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                Ready to practice?
              </p>
              <p className="text-xs text-(--text-disabled) mt-0.5">
                {[hasMCQ && "MCQs", hasChallenges && "Coding challenges", hasMiniProj && "Mini project"]
                  .filter(Boolean).join(" · ")}
              </p>
            </div>
            <span className="text-[10px] font-semibold text-(--brand) opacity-0 group-hover:opacity-100 transition-opacity">
              Start →
            </span>
          </Link>
        </div>
      )}

      {/* Mark complete footer */}
      <footer className="px-8 md:px-14 py-8 border-t border-(--border-subtle)">
        {user ? (
          <button
            onClick={handleMarkComplete}
            disabled={marking || done}
            className={[
              "w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 select-none",
              done
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 cursor-default"
                : marking
                  ? "bg-(--brand) text-white opacity-60 cursor-not-allowed"
                  : "bg-(--brand) hover:opacity-90 active:scale-[0.99] text-white cursor-pointer",
            ].join(" ")}
          >
            {done ? (
              <><CheckCircle2 className="w-4 h-4" />Lesson Completed</>
            ) : marking ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            ) : (
              <><Circle className="w-4 h-4" />Mark as Complete</>
            )}
          </button>
        ) : (
          <p className="text-center text-xs text-(--text-disabled)">
            <Link href="/sign-in" className="text-(--brand) hover:underline font-medium">Sign in</Link>
            {" "}to track your progress
          </p>
        )}
      </footer>
    </motion.article>
  );
}