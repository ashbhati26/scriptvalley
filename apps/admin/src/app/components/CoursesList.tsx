"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trash2, BookOpen, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

type FilterStatus = "all" | "draft" | "pending_review" | "published" | "rejected";

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",       border: "var(--border-subtle)"   },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.20)"  },
  published:      { label: "Published", color: "#3A5EFF",           bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.20)"  },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.20)"  },
};

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "#22c55e",
  intermediate: "#f59e0b",
  advanced:     "#ef4444",
  "all-levels": "#3A5EFF",
};

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span
      className="inline-flex items-center text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full border uppercase"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      {m.label}
    </span>
  );
}

function CourseRow({ course, idx, onDelete }: {
  course: any;
  idx: number;
  onDelete: (id: Id<"courses">) => void;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const moduleCount = course.modules?.length ?? 0;
  const levelColor  = course.level ? LEVEL_COLORS[course.level] : undefined;

  return (
    <motion.div
      key={String(course._id)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.14, delay: idx * 0.025 }}
      className={`group px-4 py-4 hover:bg-(--bg-hover) transition-colors ${idx > 0 ? "border-t border-(--border-subtle)" : ""}`}
    >
      {/* Main row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-medium text-(--text-secondary) truncate">{course.title || "Untitled"}</p>
            <StatusChip status={course.status} />
            {course.level && (
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize"
                style={{ color: levelColor, background: `${levelColor}18`, borderColor: `${levelColor}40` }}
              >
                {course.level}
              </span>
            )}
          </div>

          {/* Slug + meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-(--text-disabled) bg-(--bg-hover) rounded px-1.5 py-0.5">
              {course.slug}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
              <BookOpen className="w-3 h-3" />{moduleCount} module{moduleCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
              <Clock className="w-3 h-3" />
              {new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Description */}
          {course.description && (
            <p className="text-xs text-(--text-disabled) mt-1 line-clamp-1">{course.description}</p>
          )}

          {/* Rejection reason */}
          {course.status === "rejected" && course.rejectionReason && (
            <p className="flex items-center gap-1 text-xs text-red-400/80 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />{course.rejectionReason}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Preview toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-elevated) transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Preview
          </button>

          {/* Delete */}
          {confirmDel ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { onDelete(course._id); setConfirmDel(false); }}
                className="px-2.5 py-1 rounded text-xs bg-red-500 text-white font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDel(false)}
                className="px-2.5 py-1 rounded text-xs border border-(--border-subtle) text-(--text-muted)"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-(--text-faint) hover:text-red-400/80 hover:bg-red-500/[0.06] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
          )}
        </div>
      </div>

      {/* JSON preview */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <pre className="text-[11px] text-(--text-faint) font-mono bg-(--bg-input) rounded-md p-3 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap break-words">
              {JSON.stringify({ ...course, modules: `[${course.modules?.length ?? 0} modules — expand in inspector]` }, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CoursesList() {
  const courses     = useQuery(api.courses.adminGetAllCourses) as any[] | undefined;
  const deleteCourse = useMutation(api.courses.adminDeleteCourse);
  const [filter, setFilter] = useState<FilterStatus>("all");

  async function handleDelete(id: Id<"courses">) {
    try {
      await deleteCourse({ id });
      toast.success("Course deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const shown = !courses ? [] :
    filter === "all" ? courses : courses.filter((c) => c.status === filter);

  const countFor = (f: FilterStatus) => {
    if (!courses) return 0;
    return f === "all" ? courses.length : courses.filter((c) => c.status === f).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
        <h2 className="text-2xl font-semibold text-(--text-primary) mb-1">Courses</h2>
        <p className="text-sm text-(--text-faint)">
          {courses === undefined ? "Loading…" : `${courses.length} course${courses.length !== 1 ? "s" : ""} across all instructors`}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-px p-1 rounded-lg bg-(--bg-input) border border-(--border-subtle) w-fit">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              filter === key
                ? "bg-(--bg-active) text-(--text-primary)"
                : "text-(--text-muted) hover:text-(--text-secondary)"
            }`}
          >
            {label}
            {courses !== undefined && (
              <span className={`ml-1 tabular-nums text-[10px] ${filter === key ? "text-(--text-muted)" : "text-(--text-disabled)"}`}>
                {countFor(key)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {courses === undefined ? (
        <div className="flex justify-center py-16">
          <div className="w-4 h-4 border-2 border-[#3A5EFF]/30 border-t-[#3A5EFF] rounded-full animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-(--text-disabled)">
          <Award className="w-7 h-7" />
          <p className="text-sm">
            {filter === "all" ? "No courses yet" : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} courses`}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-(--border-subtle) overflow-hidden">
          <AnimatePresence initial={false}>
            {shown.map((course, idx) => (
              <CourseRow
                key={String(course._id)}
                course={course}
                idx={idx}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {shown.length > 0 && (
        <p className="text-xs text-(--text-disabled) pt-2 border-t border-(--border-subtle)">
          {shown.length} course{shown.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}