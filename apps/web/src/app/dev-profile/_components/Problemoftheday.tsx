"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Flame,
  Zap, BookOpen, Shuffle, Globe,
  Trophy as TrophyIcon, RefreshCw, Star, ArrowRight,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import Link from "next/link";

type SourceReason = "followed" | "other_sheets" | "global" | "all_done";

interface PotdData {
  date: string; title: string; difficulty: string; topic: string;
  platform: string; url: string; sheetName: string; sheetSlug: string;
  streak: number; totalPool: number; isAllDone: boolean; sourceReason: SourceReason;
}

const DIFF: Record<string, { text: string; bg: string; border: string }> = {
  Easy:   { text: "text-emerald-400", bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/20" },
  Medium: { text: "text-amber-400",   bg: "bg-amber-500/[0.08]",   border: "border-amber-500/20"   },
  Hard:   { text: "text-red-400",     bg: "bg-red-500/[0.08]",     border: "border-red-500/20"     },
};

const PLATFORM_LABEL: Record<string, string> = {
  leetcode: "LeetCode", gfg: "GFG", hackerrank: "HackerRank",
  codeforces: "Codeforces", codechef: "CodeChef", hackerearth: "HackerEarth", others: "Practice",
};

const SOURCE_CONFIG: Record<SourceReason, {
  icon: React.ComponentType<{ className?: string }>; label: string; cls: string;
}> = {
  followed:     { icon: Star,        label: "From your sheet",              cls: "text-[var(--text-disabled)] bg-[var(--bg-hover)] border-[var(--border-subtle)]"  },
  other_sheets: { icon: TrophyIcon,  label: "Your sheets done! Others",     cls: "text-amber-400 bg-amber-500/[0.06] border-amber-500/20"                          },
  global:       { icon: Globe,       label: "Picking globally",             cls: "text-[#3A5EFF] bg-[#3A5EFF]/[0.06] border-[#3A5EFF]/20"                         },
  all_done:     { icon: RefreshCw,   label: "All done! Repeating",          cls: "text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/20"                    },
};

function SolvedBurst() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 rounded-xl bg-emerald-500/10 pointer-events-none"
    />
  );
}

function Skeleton() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 animate-pulse h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded-full bg-[var(--bg-hover)]" />
        <div className="h-3 w-32 rounded bg-[var(--bg-hover)]" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex gap-2"><div className="h-4 w-14 rounded bg-[var(--bg-hover)]" /><div className="h-4 w-16 rounded bg-[var(--bg-hover)]" /></div>
        <div className="h-5 w-48 rounded bg-[var(--bg-hover)]" />
        <div className="h-3 w-36 rounded bg-[var(--bg-hover)]" />
      </div>
    </div>
  );
}

export default function ProblemOfTheDay() {
  const { user }   = useUser();
  const userId     = user?.id ?? "";
  const potd       = useQuery(api.potd.getPersonalizedPotd, userId ? { userId } : "skip") as PotdData | null | undefined;
  const isSolved   = useQuery(api.potd.isSolvedToday,       userId ? { userId } : "skip") as boolean | undefined;
  const markSolved = useMutation(api.potd.markSolvedToday);

  const [celebrating, setCelebrating] = useState(false);
  const [optimistic,  setOptimistic]  = useState<boolean | null>(null);
  const solved = optimistic !== null ? optimistic : (isSolved ?? false);

  async function handleToggle() {
    if (!potd || !userId) return;
    const next = !solved;
    setOptimistic(next);
    if (next) { setCelebrating(true); setTimeout(() => setCelebrating(false), 600); }
    try {
      await markSolved({ userId, questionTitle: potd.title, sheetSlug: potd.sheetSlug, difficulty: potd.difficulty, solved: next });
    } catch { setOptimistic(!next); }
  }

  if (!userId || potd === undefined || isSolved === undefined) return <Skeleton />;

  // No questions at all
  if (potd === null) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 flex flex-col items-center justify-center gap-2 h-full text-center">
        <BookOpen className="w-5 h-5 text-[var(--text-disabled)]" />
        <p className="text-xs text-[var(--text-faint)]">No problem yet.</p>
        <Link href="/dsa-sheet" className="text-[10px] text-[#3A5EFF] hover:underline">Browse sheets →</Link>
      </div>
    );
  }

  const diff = DIFF[potd.difficulty] ?? DIFF.Medium;
  const src  = SOURCE_CONFIG[potd.sourceReason];
  const SrcIcon = src.icon;

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-xl border transition-colors duration-300 h-full flex flex-col ${
        solved ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
      }`}
    >
      <AnimatePresence>{celebrating && <SolvedBurst />}</AnimatePresence>

      <div className="p-3 flex flex-col gap-3 flex-1">

        {/* Top: POTD label + streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#3A5EFF]" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-[#3A5EFF]">Problem of the Day</span>
          </div>
          {potd.streak > 0 && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-2.5 h-2.5 text-orange-400" />
              <span className="text-[9px] font-bold text-orange-400">{potd.streak}d</span>
            </div>
          )}
        </div>

        {/* Middle: the question — flex-1 so it fills available space */}
        <div className="flex-1 flex flex-col justify-center gap-2">

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${diff.text} ${diff.bg} ${diff.border}`}>
              {potd.difficulty}
            </span>
            <span className="text-[9px] text-[var(--text-disabled)] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
              {potd.topic}
            </span>
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] ${src.cls}`}>
              <SrcIcon className="w-2 h-2" />{src.label}
            </span>
          </div>

          {/* Title */}
          <p className={`text-sm font-semibold leading-snug transition-all duration-200 ${
            solved ? "text-[var(--text-muted)] line-through decoration-emerald-400/50" : "text-[var(--text-primary)]"
          }`}>
            {potd.title}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-[var(--text-disabled)] flex items-center gap-1">
              <Star className="w-2.5 h-2.5" />
              <a href={`/dsa-sheet/${potd.sheetSlug}`} className="hover:text-[#3A5EFF] transition-colors truncate max-w-[100px]">
                {potd.sheetName}
              </a>
              <span className="opacity-40">·</span>
              {PLATFORM_LABEL[potd.platform] ?? potd.platform}
            </span>
            {!potd.isAllDone && (
              <span className="text-[9px] text-[var(--text-disabled)] flex items-center gap-0.5">
                <Shuffle className="w-2 h-2" />{potd.totalPool} left
              </span>
            )}
          </div>
        </div>

        {/* Bottom: actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-default)]">

          {/* Checkbox toggle */}
          <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 flex-1 min-w-0 group focus:outline-none"
            aria-label={solved ? "Mark unsolved" : "Mark solved"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {solved ? (
                <motion.div key="c" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </motion.div>
              ) : (
                <motion.div key="u" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}>
                  <Circle className="w-4 h-4 text-[var(--text-disabled)] group-hover:text-[var(--text-muted)] transition-colors shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className={`text-xs font-medium transition-colors ${
              solved ? "text-emerald-400" : "text-[var(--text-faint)] group-hover:text-[var(--text-secondary)]"
            }`}>
              {solved ? "Solved!" : "Mark as solved"}
            </span>
          </button>

          {/* Solve + open links */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={potd.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-0.5 px-2 py-1 rounded-md border border-[var(--border-subtle)] text-[9px] font-medium text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors"
            >
              Solve <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Solved bar */}
      <AnimatePresence>
        {solved && (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }} style={{ originX: 0 }}
            className="h-[2px] bg-gradient-to-r from-emerald-500/70 via-emerald-400/40 to-transparent absolute bottom-0 left-0 right-0"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}