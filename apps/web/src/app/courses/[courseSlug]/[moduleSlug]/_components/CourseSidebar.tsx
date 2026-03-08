"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Module {
  order: number;
  title: string;
  slug: string;
  content: string;
}

interface Course {
  slug: string;
  modules: Module[];
}

interface Props {
  course: Course;
  activeSlug: string;
  onNavigate: () => void;
}

export default function CourseSidebar({ course, activeSlug, onNavigate }: Props) {
  const modules = [...(course.modules ?? [])].sort((a, b) => a.order - b.order);

  return (
    <nav className="flex-1 px-2 py-3 space-y-px">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] px-2.5 mb-2">
        Modules · {modules.length}
      </p>

      {modules.map((mod, idx) => {
        // Use both slug AND index to determine active — avoids false matches
        // when two modules share the same slug
        const isActive = mod.slug === activeSlug && 
          modules.findIndex((m) => m.slug === activeSlug) === idx;
        return (
          <Link
            key={`${mod.slug}-${idx}`}
            href={`/courses/${course.slug}/${mod.slug}`}
            onClick={onNavigate}
            className={[
              "relative flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg text-sm transition-colors group",
              isActive
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
            ].join(" ")}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.span
                layoutId="sidebar-indicator"
                className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#3A5EFF] rounded-r-full"
              />
            )}

            {/* Step number / check */}
            <span
              className={[
                "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-px",
                isActive
                  ? "bg-[#3A5EFF] text-white"
                  : "bg-[var(--bg-hover)] text-[var(--text-disabled)] group-hover:bg-[var(--bg-active)]",
              ].join(" ")}
            >
              {idx + 1}
            </span>

            {/* Title */}
            <span className="leading-snug line-clamp-2 text-xs">
              {mod.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}