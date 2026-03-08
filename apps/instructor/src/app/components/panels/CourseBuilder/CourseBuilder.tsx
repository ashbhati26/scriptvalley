"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, AlertCircle, ChevronRight } from "lucide-react";

import { FilterKey, CourseForm } from "./courseTypes";
import { StatusChip }            from "./CourseShared";
import CourseEditor              from "./CourseEditor";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

export default function CourseBuilder() {
  const { isLoaded, isSignedIn } = useAuth();
  const skip  = !isLoaded || !isSignedIn;
  const certs = useQuery(api.courses.getMyCourses, skip ? "skip" : undefined) as any[] | undefined;

  const [editing, setEditing] = useState<CourseForm | "new" | null>(null);
  const [filter,  setFilter]  = useState<FilterKey>("all");

  if (editing !== null) {
    return (
      <CourseEditor
        course={editing === "new" ? null : (editing as CourseForm)}
        onBack={() => setEditing(null)}
      />
    );
  }

  const shown    = filter === "all" ? (certs ?? []) : (certs ?? []).filter((c: any) => c.status === filter);
  const countFor = (f: FilterKey) => {
    if (!certs) return 0;
    return f === "all" ? certs.length : certs.filter((c: any) => c.status === f).length;
  };

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 max-w-3xl space-y-8">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Content</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-(--text-primary) mb-1">Courses</h2>
            <p className="text-sm text-(--text-faint)">
              Create courses with modules. Write rich content in each module.
            </p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors shrink-0"
          >
            <Plus className="w-3 h-3" />New Course
          </button>
        </div>
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
            {certs !== undefined && (
              <span className={`ml-1 tabular-nums text-[10px] ${
                filter === key ? "text-(--text-muted)" : "text-(--text-disabled)"
              }`}>
                {countFor(key)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {certs === undefined ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg border border-(--border-subtle) bg-(--bg-elevated) animate-pulse" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-(--text-disabled)">
          <div className="w-10 h-10 rounded-lg bg-(--bg-hover) flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-sm">
            {filter === "all"
              ? "No courses yet"
              : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} courses`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => setEditing("new")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3 h-3" />Create first course
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {shown.map((c: any, i: number) => (
              <motion.div
                key={String(c._id)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: i * 0.03 }}
                onClick={() => setEditing(c as CourseForm)}
                className="group flex items-center gap-4 px-4 py-4 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) hover:bg-(--bg-hover) cursor-pointer transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-(--brand-subtle) border border-(--brand-border) flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-(--brand)" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <StatusChip status={c.status} />
                    <span className="text-[9px] text-(--text-disabled)">
                      {c.modules?.length ?? 0} module{(c.modules?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-(--text-secondary) group-hover:text-(--text-primary) transition-colors truncate">
                    {c.title}
                  </p>
                  {c.description && (
                    <p className="text-xs text-(--text-faint) mt-0.5 truncate">{c.description}</p>
                  )}
                  {c.status === "rejected" && c.rejectionReason && (
                    <p className="text-xs text-red-500/80 mt-0.5 flex items-center gap-1 truncate">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {c.rejectionReason}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-(--text-disabled) shrink-0" />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {shown.length > 0 && (
        <p className="text-xs text-(--text-disabled) pt-2 border-t border-(--border-subtle)">
          {shown.length} course{shown.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}