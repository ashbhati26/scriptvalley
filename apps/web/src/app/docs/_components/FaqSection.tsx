"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

type FaqItem = { q: string; a: string };

const FAQS: FaqItem[] = [
  {
    q: "What exactly is Script Valley?",
    a: "Script Valley is a free, unified developer platform. You get a multi-language online compiler with AI debugging, curated DSA sheets with progress tracking, personal notes, snippet sharing, a developer profile that pulls GitHub and LeetCode data, and an aggregated contest calendar — all in one place.",
  },
  {
    q: "Which programming languages are supported?",
    a: "The compiler supports JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Swift, and Ruby. More languages are added over time. You can switch languages instantly from the dropdown in the editor.",
  },
  {
    q: "Do I need an account to use Script Valley?",
    a: "You can browse public snippets and the landing page without signing in. Everything else — running code, tracking DSA progress, managing notes, saving snippets, and viewing your dev profile — requires a free account via Google sign-in.",
  },
  {
    q: "Is it really free?",
    a: "Yes. All core features are completely free with no subscriptions, no hidden charges, and no credit card required. We may introduce optional paid tiers in the future, but the core will always remain free.",
  },
  {
    q: "What does the AI assistant actually do?",
    a: "The AI assistant reads your current code and the error output, explains what went wrong in plain English, and returns a corrected version — all with one click. There's also an optimise mode that refactors working code for readability or performance.",
  },
  {
    q: "What are DSA Sheets?",
    a: "DSA Sheets are curated problem sets (similar to Striver's SDE Sheet or NeetCode 150) with topic breakdowns and per-question progress tracking. Follow a sheet, mark questions as solved, attempted, or skipped, and watch your progress update on your dev profile.",
  },
  {
    q: "Can I share my code snippets?",
    a: "Yes. Snippets can be public (visible to everyone, searchable by language) or private (only you). Public snippets can be starred by others and support code-block comments. Each snippet gets a permanent shareable URL.",
  },
  {
    q: "How does the developer profile work?",
    a: "Your dev profile combines three sources: DSA sheet progress, GitHub activity (contribution heatmap, language breakdown, streaks), and LeetCode stats (submission calendar, difficulty breakdown). Connect your handles from Edit Profile → Platforms and the profile updates automatically.",
  },
  {
    q: "Where can I report a bug or request a feature?",
    a: "Use the feedback form linked in the footer and in the docs sidebar. Every submission is read and genuinely considered.",
  },
];

function FaqItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border-subtle)] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left group"
      >
        <span className="w-5 h-5 rounded-md bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-disabled)] flex items-center justify-center shrink-0 mt-[2px] group-hover:border-[var(--border-medium)] transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-sm font-medium transition-colors duration-100 ${
            open ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
          }`}
        >
          {item.q}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 mt-[2px] transition-all duration-200 ${
            open ? "rotate-180 text-[#3A5EFF]" : "text-[var(--text-disabled)]"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 pl-[calc(1.25rem+0.75rem+0.75rem)] pr-5 text-sm text-[var(--text-faint)] leading-[1.8]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="px-6 py-5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)] flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-[#3A5EFF] shrink-0 mt-[3px]" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
            FAQ
          </p>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-faint)] leading-relaxed">
            Quick answers to the questions we get asked most.
          </p>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {FAQS.map((item, i) => (
          <FaqItem key={item.q} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}