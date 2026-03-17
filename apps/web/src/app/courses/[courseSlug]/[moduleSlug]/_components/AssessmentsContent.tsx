"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft, ExternalLink, Lightbulb,
  CheckCircle2, XCircle, HelpCircle, Code2, Rocket,
} from "lucide-react";
import {
  CourseModule, MCQQuestion, CodingChallenge,
  DIFFICULTY_META, PLATFORM_LABELS, lessonSlug,
} from "../../../courseTypes";

interface Props {
  courseSlug:   string;
  mod:          CourseModule;
  modIndex:     number;
  totalModules: number;
  prevMod:      CourseModule | null;
  nextMod:      CourseModule | null;
}

function MCQSection({ questions }: { questions: MCQQuestion[] }) {
  const [answers,  setAnswers]  = useState<Record<number, number | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function pick(qi: number, oi: number) {
    if (revealed[qi]) return;
    setAnswers((p) => ({ ...p, [qi]: oi }));
  }

  function reveal(qi: number) {
    if (answers[qi] == null) return;
    setRevealed((p) => ({ ...p, [qi]: true }));
  }

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const chosen  = answers[qi] ?? null;
        const isShown = revealed[qi] ?? false;

        return (
          <div key={qi} className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden">
            <div className="px-5 py-4 border-b border-(--border-subtle)">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0 mt-0.5">
                  {qi + 1}
                </span>
                <p className="text-sm font-medium text-(--text-secondary) leading-relaxed">{q.question}</p>
              </div>
            </div>

            <div className="px-5 py-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen  = chosen === oi;
                const isCorrect = opt.isCorrect;
                let cls = "border-(--border-subtle) bg-(--bg-input)";
                if (isShown) {
                  if (isCorrect) cls = "border-emerald-500/30 bg-emerald-500/[0.05]";
                  else if (isChosen) cls = "border-red-400/30 bg-red-500/[0.04]";
                } else if (isChosen) {
                  cls = "border-(--brand)/30 bg-(--brand)/[0.04]";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    disabled={isShown}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${cls} ${!isShown ? "hover:border-(--border-medium) cursor-pointer" : "cursor-default"}`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isShown && isCorrect ? "border-emerald-500 bg-emerald-500"
                        : isShown && isChosen ? "border-red-400 bg-red-400"
                          : isChosen ? "border-(--brand) bg-(--brand)"
                            : "border-(--border-medium)"
                    }`}>
                      {(isShown || isChosen) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={`text-sm flex-1 ${
                      isShown && isCorrect ? "text-emerald-600 font-medium"
                        : isShown && isChosen ? "text-red-400"
                          : isChosen ? "text-(--brand)"
                            : "text-(--text-secondary)"
                    }`}>
                      {opt.text}
                    </span>
                    {isShown && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isShown && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="px-5 pb-4">
              {!isShown ? (
                <button
                  onClick={() => reveal(qi)}
                  disabled={chosen == null}
                  className="text-xs font-medium text-(--text-faint) hover:text-(--text-secondary) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Check answer →
                </button>
              ) : q.explanation ? (
                <div className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-lg bg-(--bg-hover) border border-(--border-subtle)">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-(--text-faint) leading-relaxed">{q.explanation}</p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChallengeCard({ challenge, index }: { challenge: CodingChallenge; index: number }) {
  const [showHint, setShowHint] = useState(false);
  const diffMeta = challenge.difficulty ? DIFFICULTY_META[challenge.difficulty] : null;

  return (
    <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0 mt-0.5">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-(--text-secondary)">{challenge.title}</p>
              {challenge.description && (
                <p className="text-xs text-(--text-faint) mt-1 leading-relaxed">{challenge.description}</p>
              )}
            </div>
          </div>
          {diffMeta && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 border"
              style={{ color: diffMeta.color, background: diffMeta.bg, borderColor: diffMeta.border }}
            >
              {diffMeta.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {challenge.link && (
            <a
              href={challenge.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:opacity-90 text-white text-xs font-medium transition-opacity"
            >
              {challenge.platform ? (PLATFORM_LABELS[challenge.platform] ?? challenge.platform) : "Solve"}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {challenge.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--border-subtle) text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) text-xs transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
        </div>

        {showHint && challenge.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-(--text-faint) italic leading-relaxed">{challenge.hint}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentsContent({ courseSlug, mod, nextMod }: Props) {
  const mcqs       = mod.mcqQuestions     ?? [];
  const challenges = mod.codingChallenges ?? [];
  const miniProject = mod.miniProject;

  const lessons    = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const lastLesson = lessons[lessons.length - 1];

  return (
    <motion.div
      key={`${mod.slug}-assessments`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col min-h-full"
    >
      {/* Header */}
      <header className="px-8 md:px-14 pt-10 pb-7 border-b border-(--border-subtle)">
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-(--text-disabled) mb-4">
          <span>{mod.title}</span>
          <span className="opacity-40 mx-0.5">/</span>
          <span className="text-(--text-faint)">Assessment</span>
        </div>
        <h1 className="text-3xl font-bold text-(--text-primary) leading-tight tracking-tight">
          Practice &amp; Assessment
        </h1>
        <p className="text-sm text-(--text-faint) mt-2">
          Test your understanding of {mod.title}
        </p>
      </header>

      {/* Body */}
      <div className="flex-1 px-8 md:px-14 py-10 space-y-10">

        {mcqs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-(--text-muted)" />
              </div>
              <h2 className="text-sm font-semibold text-(--text-secondary)">Multiple Choice Questions</h2>
              <span className="text-[10px] text-(--text-disabled) bg-(--bg-input) px-1.5 py-0.5 rounded-md font-medium">
                {mcqs.length}
              </span>
            </div>
            <MCQSection questions={mcqs} />
          </section>
        )}

        {challenges.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-(--text-muted)" />
              </div>
              <h2 className="text-sm font-semibold text-(--text-secondary)">Coding Challenges</h2>
              <span className="text-[10px] text-(--text-disabled) bg-(--bg-input) px-1.5 py-0.5 rounded-md font-medium">
                {challenges.length}
              </span>
            </div>
            <div className="space-y-3">
              {challenges.map((c, i) => <ChallengeCard key={i} challenge={c} index={i} />)}
            </div>
          </section>
        )}

        {miniProject && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-(--bg-elevated) border border-(--border-subtle) flex items-center justify-center">
                <Rocket className="w-3.5 h-3.5 text-(--text-muted)" />
              </div>
              <h2 className="text-sm font-semibold text-(--text-secondary)">Mini Project</h2>
            </div>
            <div className="rounded-xl border border-(--brand)/20 bg-(--brand)/[0.02] overflow-hidden">
              <ChallengeCard challenge={miniProject} index={0} />
            </div>
          </section>
        )}
      </div>

      {/* Nav footer */}
      <footer className="px-8 md:px-14 py-8 border-t border-(--border-subtle) flex items-center justify-between gap-4">
        {lastLesson ? (
          <Link
            href={`/courses/${courseSlug}/${mod.slug}/${lessonSlug(lastLesson, lessons.length - 1)}`}
            className="flex items-center gap-2 text-sm text-(--text-faint) hover:text-(--text-secondary) transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled)">Back to lesson</p>
              <p className="text-xs font-medium text-(--text-muted) group-hover:text-(--text-secondary) transition-colors line-clamp-1">
                {lastLesson.title}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}/${mod.slug}`}
            className="flex items-center gap-2 text-sm text-(--text-faint) hover:text-(--text-secondary) transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs">Back to module</span>
          </Link>
        )}

        {nextMod ? (
          <Link
            href={`/courses/${courseSlug}/${nextMod.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--brand) hover:opacity-90 text-white text-xs font-semibold transition-opacity"
          >
            Next module
            <span className="text-white/60">·</span>
            <span className="max-w-[120px] truncate">{nextMod.title}</span>
          </Link>
        ) : (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Module complete</p>
            <Link href="/courses" className="text-xs font-medium text-(--brand) hover:underline">
              Browse more courses →
            </Link>
          </div>
        )}
      </footer>
    </motion.div>
  );
}