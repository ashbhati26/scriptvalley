"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import QuestionRow from "./QuestionRow";
import toast from "react-hot-toast";

interface Question {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  link: { platform: string; url: string };
}

interface Attempt {
  questionTitle: string;
  attempted: boolean;
}

interface Topic {
  topic: string;
  questions: Question[];
}

interface TopicSectionProps {
  topic: Topic;
  index: number;
  isOpen: boolean;
  toggleTopic: (topic: string) => void;
  attempts: Attempt[];
  localAttempts: Record<string, boolean>;
  handleToggle: (
    e: React.ChangeEvent<HTMLInputElement>,
    topic: string,
    questionTitle: string,
    difficulty: string,
  ) => void;
  filter: "All" | "Easy" | "Medium" | "Hard";
  sheetId: string;
  isLoggedIn: boolean;
  onNotesUpdate: (topic: string, questionTitle: string, notes: string) => Promise<void>;
  isSaving: boolean;
  getNotes: (questionTitle: string) => string | undefined;
}

export default function TopicSection({
  topic,
  index,
  isOpen,
  toggleTopic,
  attempts,
  localAttempts,
  handleToggle,
  filter,
  sheetId,
  isLoggedIn,
}: TopicSectionProps) {
  const filteredQuestions = topic.questions.filter(
    (q) => filter === "All" || q.difficulty === filter,
  );

  const attemptedCount = filteredQuestions.filter((q) => {
    const key = `${topic.topic}_${q.title}`;
    return (
      localAttempts[key] ??
      attempts.some((a) => a.questionTitle === q.title && a.attempted)
    );
  }).length;

  const totalQ = filteredQuestions.length;
  const pct    = totalQ === 0 ? 0 : Math.round((attemptedCount / totalQ) * 100);

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">

      {/* Topic header */}
      <button
        onClick={() => toggleTopic(topic.topic)}
        className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-[var(--bg-input)] hover:bg-[var(--bg-elevated)] transition-colors duration-100 text-left"
      >
        <div className="flex items-center gap-2.5">
          <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.15 }}>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
            Step {index + 1}
          </span>
          <span className="text-sm font-medium text-[var(--text-secondary)]">{topic.topic}</span>
        </div>

        <div className="flex items-center gap-3 pl-6 sm:pl-0">
          <span className="text-[10px] text-[var(--text-disabled)]">{attemptedCount}/{totalQ}</span>
          {/* Progress bar — brand blue fill intentionally hardcoded */}
          <div className="w-32 h-1 rounded-full bg-[var(--bg-hover)] overflow-hidden">
            <div
              className="h-full bg-[#3A5EFF] rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-[var(--text-disabled)] w-7 text-right">{pct}%</span>
        </div>
      </button>

      {/* Questions table */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              {filteredQuestions.map((q, i) => (
                <QuestionRow
                  key={q.title}
                  question={q}
                  topic={topic.topic}
                  sheetId={sheetId}
                  isLoggedIn={isLoggedIn}
                  isLast={i === filteredQuestions.length - 1}
                  attempted={
                    localAttempts[`${topic.topic}_${q.title}`] ??
                    attempts.find((a) => a.questionTitle === q.title)?.attempted ??
                    false
                  }
                  handleToggle={(e, questionTitle) => {
                    if (!isLoggedIn) {
                      toast.error("Login to track your progress");
                      return;
                    }
                    handleToggle(e, topic.topic, questionTitle, q.difficulty);
                  }}
                />
              ))}

              {filteredQuestions.length === 0 && (
                <div className="py-8 text-center text-sm text-[var(--text-disabled)] border-t border-[var(--border-default)]">
                  No {filter} problems in this topic
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}