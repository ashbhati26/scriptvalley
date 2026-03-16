"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Lightbulb, CheckCircle2, XCircle, HelpCircle, Code2, Rocket } from "lucide-react";
import { CourseModule, MCQQuestion, CodingChallenge, DIFFICULTY_META, PLATFORM_LABELS, lessonSlug } from "../../../courseTypes";

interface Props {
  courseSlug:   string;
  mod:          CourseModule;
  modIndex:     number;
  totalModules: number;
  prevMod:      CourseModule | null;
  nextMod:      CourseModule | null;
}

// ── MCQ Section ───────────────────────────────────────────────────────────────
function MCQSection({ questions }: { questions: MCQQuestion[] }) {
  const [answers, setAnswers]   = useState<Record<number, number | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function pick(qi: number, oi: number) {
    if (revealed[qi]) return;
    setAnswers((p) => ({ ...p, [qi]: oi }));
  }

  function reveal(qi: number) {
    if (answers[qi] === undefined || answers[qi] === null) return;
    setRevealed((p) => ({ ...p, [qi]: true }));
  }

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const chosen   = answers[qi] ?? null;
        const isShown  = revealed[qi] ?? false;

        return (
          <div key={qi} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-[var(--bg-hover)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] shrink-0 mt-0.5">
                  {qi + 1}
                </span>
                <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">{q.question}</p>
              </div>
            </div>

            <div className="px-5 py-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen  = chosen === oi;
                const isCorrect = opt.isCorrect;
                let cls = "border-[var(--border-subtle)] bg-[var(--bg-input)]";
                if (isShown) {
                  if (isCorrect) cls = "border-emerald-500/40 bg-emerald-500/[0.06]";
                  else if (isChosen && !isCorrect) cls = "border-red-400/40 bg-red-500/[0.05]";
                } else if (isChosen) {
                  cls = "border-[#3A5EFF]/40 bg-[rgba(58,94,255,0.06)]";
                }

                return (
                  <button key={oi} onClick={() => pick(qi, oi)} disabled={isShown}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${cls} ${!isShown ? "hover:border-[var(--border-medium)] cursor-pointer" : "cursor-default"}`}
                  >
                    {/* Indicator */}
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isShown && isCorrect
                        ? "border-emerald-500 bg-emerald-500"
                        : isShown && isChosen && !isCorrect
                          ? "border-red-400 bg-red-400"
                          : isChosen
                            ? "border-[#3A5EFF] bg-[#3A5EFF]"
                            : "border-[var(--border-medium)]"
                    }`}>
                      {(isShown || isChosen) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={`text-sm flex-1 ${
                      isShown && isCorrect ? "text-emerald-600 font-medium"
                        : isShown && isChosen && !isCorrect ? "text-red-400"
                          : isChosen ? "text-[#3A5EFF]"
                            : "text-[var(--text-secondary)]"
                    }`}>
                      {opt.text}
                    </span>
                    {isShown && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isShown && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Check + explanation */}
            <div className="px-5 pb-4">
              {!isShown ? (
                <button onClick={() => reveal(qi)} disabled={chosen === null}
                  className="text-xs font-medium text-[var(--text-faint)] hover:text-[var(--text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Check answer →
                </button>
              ) : q.explanation ? (
                <div className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-faint)] leading-relaxed">{q.explanation}</p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Challenge card ─────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, index }: { challenge: CodingChallenge; index: number }) {
  const [showHint, setShowHint] = useState(false);
  const diffMeta = challenge.difficulty ? DIFFICULTY_META[challenge.difficulty] : null;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-[var(--bg-hover)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] shrink-0 mt-0.5">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">{challenge.title}</p>
              {challenge.description && (
                <p className="text-xs text-[var(--text-faint)] mt-1 leading-relaxed">{challenge.description}</p>
              )}
            </div>
          </div>
          {diffMeta && (
            <span className="text-[10px] px-2 py-1 rounded-md font-semibold shrink-0"
              style={{ color: diffMeta.color, background: diffMeta.bg, border: `1px solid ${diffMeta.border}` }}>
              {diffMeta.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {challenge.link && (
            <a href={challenge.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A5EFF] hover:bg-[#2a4eef] text-white text-xs font-medium transition-colors"
            >
              {challenge.platform ? PLATFORM_LABELS[challenge.platform] ?? challenge.platform : "Solve"}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {challenge.hint && (
            <button onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] text-xs transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
        </div>

        {showHint && challenge.hint && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
            <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-faint)] italic leading-relaxed">{challenge.hint}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentsContent({ courseSlug, mod, modIndex, nextMod }: Props) {
  const mcqs        = mod.mcqQuestions     ?? [];
  const challenges  = mod.codingChallenges ?? [];
  const miniProject = mod.miniProject;

  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const lastLesson = lessons[lessons.length - 1];

  return (
    <motion.div
      key={`${mod.slug}-assessments`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col min-h-full max-w-4xl mx-auto w-full"
    >
      {/* Header */}
      <div className="px-8 md:px-16 pt-10 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-disabled)] mb-3 flex-wrap">
          <span>Module {modIndex + 1}</span>
          <span>/</span>
          <Link href={`/courses/${courseSlug}/${mod.slug}`} className="hover:text-[var(--text-faint)] transition-colors">{mod.title}</Link>
          <span>/</span>
          <span className="text-[var(--text-faint)]">Assessment</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">Practice &amp; Assessment</h1>
        <p className="text-sm text-[var(--text-faint)] mt-1">Test your understanding of {mod.title}</p>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 md:px-16 py-8 space-y-10">

        {/* MCQs */}
        {mcqs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[var(--text-disabled)]" />
              <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Multiple Choice Questions</h2>
              <span className="text-[10px] text-[var(--text-disabled)] bg-[var(--bg-input)] px-1.5 py-0.5 rounded">
                {mcqs.length} question{mcqs.length !== 1 ? "s" : ""}
              </span>
            </div>
            <MCQSection questions={mcqs} />
          </section>
        )}

        {/* Coding Challenges */}
        {challenges.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-[var(--text-disabled)]" />
              <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Coding Challenges</h2>
              <span className="text-[10px] text-[var(--text-disabled)] bg-[var(--bg-input)] px-1.5 py-0.5 rounded">
                {challenges.length}
              </span>
            </div>
            <div className="space-y-3">
              {challenges.map((c, i) => <ChallengeCard key={i} challenge={c} index={i} />)}
            </div>
          </section>
        )}

        {/* Mini Project */}
        {miniProject && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 text-[var(--text-disabled)]" />
              <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Mini Project</h2>
            </div>
            <div className="rounded-xl border border-[rgba(58,94,255,0.2)] bg-[rgba(58,94,255,0.03)] overflow-hidden">
              <ChallengeCard challenge={miniProject} index={0} />
            </div>
          </section>
        )}
      </div>

      {/* Nav */}
      <div className="px-8 md:px-16 py-8 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
        {/* Back to last lesson */}
        {lastLesson ? (
          <Link
            href={`/courses/${courseSlug}/${mod.slug}/${lessonSlug(lastLesson, lessons.length - 1)}`}
            className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Last lesson</p>
              <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                {lastLesson.title}
              </p>
            </div>
          </Link>
        ) : (
          <Link href={`/courses/${courseSlug}/${mod.slug}`} className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs">Back to module</span>
          </Link>
        )}

        {nextMod ? (
          <Link
            href={`/courses/${courseSlug}/${nextMod.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group text-right"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Next module</p>
              <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                {nextMod.title}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Module Complete 🎉</p>
            <Link href="/courses" className="text-xs text-[#3A5EFF] hover:underline">Browse more courses →</Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}