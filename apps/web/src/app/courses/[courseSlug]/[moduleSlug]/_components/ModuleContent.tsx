"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight, HelpCircle, Code2, Rocket } from "lucide-react";
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

const richContentCls = `
  flex-1 px-8 md:px-16 py-8
  text-sm text-[var(--text-secondary)] leading-7

  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)]
  [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:tracking-tight

  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)]
  [&_h2]:mt-7 [&_h2]:mb-2.5

  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-secondary)]
  [&_h3]:mt-5 [&_h3]:mb-1.5

  [&_p]:my-1.5 [&_p]:leading-7

  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5
  [&_li]:my-0.5

  [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50
  [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic
  [&_blockquote]:text-[var(--text-muted)]

  [&_code]:bg-[var(--bg-input)] [&_code]:rounded
  [&_code]:px-1.5 [&_code]:py-0.5
  [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono

  [&_pre]:bg-[var(--bg-elevated)] [&_pre]:border
  [&_pre]:border-[var(--border-subtle)] [&_pre]:rounded-lg
  [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto

  [&_pre_code]:bg-transparent [&_pre_code]:text-[var(--text-faint)]
  [&_pre_code]:p-0 [&_pre_code]:text-xs

  [&_a]:text-[#3A5EFF] [&_a]:hover:underline

  [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
  [&_td]:border [&_td]:border-[var(--border-subtle)]
  [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:align-top
  [&_th]:border [&_th]:border-[var(--border-subtle)]
  [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[var(--bg-input)]
  [&_th]:text-xs [&_th]:font-semibold

  [&_hr]:border-[var(--border-subtle)] [&_hr]:my-6

  [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
  [&_img]:border [&_img]:border-[var(--border-subtle)]
`;

function ModuleNav({ courseSlug, prevMod, nextMod, isStructured }: {
  courseSlug: string;
  prevMod: CourseModule | null;
  nextMod: CourseModule | null;
  isStructured: boolean;
}) {
  function modHref(m: CourseModule) {
    if (isStructured) {
      const firstLesson = m.lessons?.[0];
      if (firstLesson) {
        const lSlug = lessonSlug(firstLesson, 0);
        return `/courses/${courseSlug}/${m.slug}/${lSlug}`;
      }
      return `/courses/${courseSlug}/${m.slug}`;
    }
    return `/courses/${courseSlug}/${m.slug}`;
  }

  return (
    <div className="px-8 md:px-16 py-8 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
      {prevMod ? (
        <Link href={modHref(prevMod)} className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Previous module</p>
            <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">{prevMod.title}</p>
          </div>
        </Link>
      ) : <div />}

      {nextMod ? (
        <Link href={modHref(nextMod)} className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group text-right">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Next module</p>
            <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">{nextMod.title}</p>
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Course Complete</p>
          <Link href="/courses" className="text-xs text-[#3A5EFF] hover:underline">Browse more courses →</Link>
        </div>
      )}
    </div>
  );
}

export default function ModuleContent({ courseSlug, mod, modIndex, totalModules, prevMod, nextMod, isStructured }: Props) {
  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const hasMCQ        = (mod.mcqQuestions?.length     ?? 0) > 0;
  const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
  const hasMiniProj   = !!mod.miniProject?.title;
  const hasAssessments = hasMCQ || hasChallenges || hasMiniProj;

  return (
    <motion.div
      key={mod.slug}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col min-h-full max-w-4xl mx-auto w-full"
    >
      {/* Module header */}
      <div className="px-8 md:px-16 pt-10 pb-6 border-b border-[var(--border-subtle)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
          Module {modIndex + 1} of {totalModules}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight mb-1">
          {mod.title}
        </h1>
        {mod.description && (
          <p className="text-sm text-[var(--text-faint)] mt-1">{mod.description}</p>
        )}
      </div>

      {!isStructured && (
        <>
          <div
            className={richContentCls}
            dangerouslySetInnerHTML={{
              __html: mod.content || "<p class='text-[var(--text-disabled)]'>No content yet.</p>",
            }}
          />
          <ModuleNav courseSlug={courseSlug} prevMod={prevMod} nextMod={nextMod} isStructured={false} />
        </>
      )}

      {isStructured && (
        <>
          <div className="flex-1 px-8 md:px-16 py-8">
            {lessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[var(--text-disabled)]" />
                </div>
                <p className="text-sm text-[var(--text-faint)]">No lessons in this module yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Lessons</p>
                  <p className="text-sm text-[var(--text-muted)]">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this module</p>
                </div>

                {/* Lesson cards */}
                <div className="space-y-2">
                  {lessons.map((lesson, li) => {
                    const lSlug = lessonSlug(lesson, li);
                    const href  = `/courses/${courseSlug}/${mod.slug}/${lSlug}`;
                    return (
                      <Link key={li} href={href}
                        className="group flex items-center gap-4 px-4 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors"
                      >
                        {/* Number badge */}
                        <div className="w-9 h-9 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-xs font-bold text-[var(--text-muted)] group-hover:bg-[rgba(58,94,255,0.08)] group-hover:border-[rgba(58,94,255,0.2)] group-hover:text-[#3A5EFF] transition-colors">
                          {lesson.lessonNumber ?? `${li + 1}`}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            {lesson.title}
                          </p>
                          {lesson.topicsCovered && (
                            <p className="text-xs text-[var(--text-disabled)] mt-0.5 truncate">
                              {lesson.topicsCovered}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {lesson.content
                            ? <span className="text-[9px] text-[var(--brand)] font-medium hidden sm:inline">Read</span>
                            : <span className="text-[9px] text-[var(--text-disabled)] italic hidden sm:inline">Coming soon</span>
                          }
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--text-disabled)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Assessments card — shown if module has any */}
                {hasAssessments && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">Module Assessments</p>
                    <Link
                      href={`/courses/${courseSlug}/${mod.slug}/assessments`}
                      className="group flex items-center gap-4 px-4 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[rgba(58,94,255,0.06)] border border-[rgba(58,94,255,0.15)] flex items-center justify-center shrink-0">
                        <span className="text-base">🎯</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                          Practice &amp; Assessment
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {hasMCQ && (
                            <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)]">
                              <HelpCircle className="w-3 h-3" />{mod.mcqQuestions!.length} MCQ{mod.mcqQuestions!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {hasChallenges && (
                            <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)]">
                              <Code2 className="w-3 h-3" />{mod.codingChallenges!.length} challenge{mod.codingChallenges!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {hasMiniProj && (
                            <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)]">
                              <Rocket className="w-3 h-3" />Mini project
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-disabled)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <ModuleNav courseSlug={courseSlug} prevMod={prevMod} nextMod={nextMod} isStructured />
        </>
      )}
    </motion.div>
  );
}