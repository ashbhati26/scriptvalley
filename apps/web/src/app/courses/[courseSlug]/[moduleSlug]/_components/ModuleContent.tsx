"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Module {
  order: number;
  title: string;
  slug: string;
  content: string;
}

interface Props {
  courseSlug: string;
  mod: Module;
  modIndex: number;
  totalModules: number;
  prevMod: Module | null;
  nextMod: Module | null;
}

export default function ModuleContent({
  courseSlug,
  mod,
  modIndex,
  totalModules,
  prevMod,
  nextMod,
}: Props) {
  return (
    <motion.div
      key={mod.slug}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col min-h-full"
    >
      {/* Module header */}
      <div className="px-6 md:px-14 pt-10 pb-4 border-b border-[var(--border-subtle)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
          Module {modIndex + 1} of {totalModules}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
          {mod.title}
        </h1>
      </div>

      {/* Rich content — same styling as ModuleEditor read-only view */}
      <div
        className="
          flex-1 px-6 md:px-14 py-8
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

          [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0
          [&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start
          [&_li[data-type=taskItem]]:gap-2 [&_li[data-type=taskItem]]:my-1
        "
        dangerouslySetInnerHTML={{
          __html: mod.content || "<p class='text-[var(--text-disabled)]'>No content yet.</p>",
        }}
      />

      {/* Prev / Next navigation */}
      <div className="px-6 md:px-14 py-8 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
        {prevMod ? (
          <Link
            href={`/courses/${courseSlug}/${prevMod.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                Previous
              </p>
              <p className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1">
                {prevMod.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextMod ? (
          <Link
            href={`/courses/${courseSlug}/${nextMod.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors group text-right"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                Next
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
              Course Complete
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
    </motion.div>
  );
}