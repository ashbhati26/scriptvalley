"use client";

import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  modules: { title: string; slug: string }[];
  status: string;
  category?: string;
}

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const moduleCount = course.modules?.length ?? 0;

  // Pick first module slug for deep link
  const firstSlug = course.modules?.[0]?.slug ?? "";
  const href = firstSlug
    ? `/courses/${course.slug}/${firstSlug}`
    : `/courses/${course.slug}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="group"
    >
      <Link href={href} className="block h-full">
        <div className="relative h-[200px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors duration-100 overflow-hidden flex flex-col">

          {/* Top accent bar — brand blue */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[#3A5EFF]/30">
            <div className="h-full bg-[#3A5EFF] w-full" />
          </div>

          <div className="p-4 flex flex-col gap-2.5 h-full pt-5">

            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1">
                <h2 className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                  {course.title}
                </h2>
                {course.category && (
                  <span className="inline-flex text-[10px] uppercase tracking-widest rounded-md px-2 py-0.5 border bg-[rgba(58,94,255,0.08)] border-[rgba(58,94,255,0.2)] text-[#3A5EFF]">
                    {course.category}
                  </span>
                )}
              </div>
              {/* Module icon */}
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand-border)] flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-[#3A5EFF]" />
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--text-faint)] line-clamp-2 leading-relaxed">
              {course.description ?? "No description provided."}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-disabled)]">
                <Layers className="w-3.5 h-3.5" />
                <span>{moduleCount} module{moduleCount !== 1 ? "s" : ""}</span>
              </div>

              <span className="text-[10px] text-[#3A5EFF] font-medium group-hover:underline">
                Start learning →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}