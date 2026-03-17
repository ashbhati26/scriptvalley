"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, HelpCircle, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { CourseModule, lessonSlug } from "../../../courseTypes";

interface Props {
  courseSlug:   string;
  mod:          CourseModule;
  modIndex:     number;
  totalModules: number;
  prevMod:      CourseModule | null;
  nextMod:      CourseModule | null;
  isStructured: boolean;
}

export default function ModuleContent({
  courseSlug, mod, modIndex, totalModules, isStructured,
}: Props) {
  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const hasMCQ        = (mod.mcqQuestions?.length     ?? 0) > 0;
  const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj   = !!mod.miniProject?.title;
  const hasAssessments = hasMCQ || hasChallenges || hasMiniProj;

  return (
    <motion.div
      key={mod.slug}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col min-h-full"
    >
      {/* Header */}
      <header className="px-8 md:px-14 pt-10 pb-7 border-b border-(--border-subtle)">
        <p className="text-[10px] font-medium uppercase tracking-widest text-(--text-disabled) mb-3">
          Module {modIndex + 1} of {totalModules}
        </p>
        <h1 className="text-3xl font-bold text-(--text-primary) leading-tight tracking-tight">
          {mod.title}
        </h1>
        {mod.description && (
          <p className="text-sm text-(--text-faint) mt-2 leading-relaxed">{mod.description}</p>
        )}
      </header>

      {/* Freeform */}
      {!isStructured && (
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
            [&_blockquote]:border-l-2 [&_blockquote]:border-(--brand)/40 [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:text-(--text-muted)
            [&_code]:font-mono [&_code]:text-xs [&_code]:bg-(--bg-input) [&_code]:text-(--brand) [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md
            [&_pre]:bg-(--bg-elevated) [&_pre]:border [&_pre]:border-(--border-subtle) [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:text-xs
            [&_pre_code]:bg-transparent [&_pre_code]:text-(--text-faint) [&_pre_code]:p-0 [&_pre_code]:leading-relaxed
            [&_a]:text-(--brand) [&_a]:underline [&_a]:underline-offset-2
            [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-(--border-subtle) [&_hr]:my-10
            [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-6 [&_img]:border [&_img]:border-(--border-subtle)"
          dangerouslySetInnerHTML={{
            __html: mod.content || "<p class='italic'>No content yet.</p>",
          }}
        />
      )}

      {/* Structured lesson list */}
      {isStructured && (
        <div className="flex-1 px-8 md:px-14 py-10">
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div className="w-10 h-10 rounded-xl bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-(--text-disabled)" />
              </div>
              <p className="text-sm text-(--text-faint)">No lessons in this module yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-(--text-disabled) mb-1">
                  Lessons
                </p>
                <p className="text-sm text-(--text-muted)">
                  {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this module
                </p>
              </div>

              <div className="space-y-2">
                {lessons.map((lesson, li) => {
                  const lSlug = lessonSlug(lesson, li);
                  return (
                    <Link
                      key={li}
                      href={`/courses/${courseSlug}/${mod.slug}/${lSlug}`}
                      className="group flex items-center gap-4 px-4 py-4 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:bg-(--bg-hover) hover:border-(--border-medium) transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center shrink-0 text-xs font-bold text-(--text-muted) group-hover:bg-(--brand)/[0.08] group-hover:border-(--brand)/20 group-hover:text-(--brand) transition-colors">
                        {lesson.lessonNumber ?? `${li + 1}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                          {lesson.title}
                        </p>
                        {lesson.topicsCovered && (
                          <p className="text-xs text-(--text-disabled) mt-0.5 truncate">
                            {lesson.topicsCovered}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {lesson.content
                          ? <span className="text-[9px] text-(--brand) font-medium hidden sm:inline">Read</span>
                          : <span className="text-[9px] text-(--text-disabled) italic hidden sm:inline">Coming soon</span>
                        }
                        <ArrowRight className="w-3.5 h-3.5 text-(--text-disabled) group-hover:text-(--brand) group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {hasAssessments && (
                <div className="pt-6 border-t border-(--border-subtle)">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-(--text-disabled) mb-3">
                    Module Assessments
                  </p>
                  <Link
                    href={`/courses/${courseSlug}/${mod.slug}/assessments`}
                    className="group flex items-center gap-4 px-4 py-4 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:bg-(--bg-hover) hover:border-(--border-medium) transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-(--brand)/[0.06] border border-(--brand)/15 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-(--brand)" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                        Practice &amp; Assessment
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {hasMCQ && (
                          <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                            <HelpCircle className="w-3 h-3" />
                            {mod.mcqQuestions!.length} MCQ{mod.mcqQuestions!.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {hasChallenges && (
                          <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                            <Code2 className="w-3 h-3" />
                            {mod.codingChallenges!.length} challenge{mod.codingChallenges!.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {hasMiniProj && (
                          <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                            <Rocket className="w-3 h-3" />
                            Mini project
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-(--text-disabled) group-hover:text-(--brand) group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}