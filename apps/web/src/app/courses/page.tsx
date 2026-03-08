"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, X, Tag } from "lucide-react";
import { useState } from "react";
import CourseCard from "./_components/CourseCard";
import CoursesPageSkeleton from "./_components/CoursesPageSkeleton";

interface CourseModule {
  title: string;
  slug: string;
  order: number;
  content: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  modules: CourseModule[];
  status: string;
}

export default function CoursesPage() {
  const courses = useQuery(api.courses.getAllCourses) as Course[] | undefined;

  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (courses === undefined) return <CoursesPageSkeleton />;

  const allCategories = Array.from(
    new Set(courses.map((c) => c.category ?? "").filter(Boolean))
  ) as string[];

  const filtered = courses.filter((course) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(q) ||
      (course.description ?? "").toLowerCase().includes(q) ||
      (course.modules ?? []).some((m: CourseModule) => m.title.toLowerCase().includes(q));
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8">

        {/* Page header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1"
          >
            Library
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="text-2xl font-semibold text-[var(--text-primary)] mb-2"
          >
            Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-sm text-[var(--text-muted)]"
          >
            Structured courses built by instructors — learn concepts step by step.
          </motion.p>
        </div>

        {/* Search + category chips */}
        <div className="mb-8 space-y-3">
          <div className="relative flex items-center h-9 bg-[var(--bg-input)] rounded-md px-3 focus-within:bg-[var(--bg-hover)] transition-colors duration-100">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course, module title…"
              className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-sm text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category chips */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                <Tag className="w-3 h-3" />
                Filter
              </div>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat === selectedCategory ? null : cat)
                  }
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors duration-100 ${
                    selectedCategory === cat
                      ? "bg-[var(--bg-hover)] border-[var(--border-medium)] text-[var(--text-secondary)]"
                      : "border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-xs text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Count */}
        <div className="flex items-center mb-6">
          <span className="ml-auto text-xs text-[var(--text-disabled)]">
            {filtered.length} course{filtered.length !== 1 && "s"}
          </span>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-24 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--text-disabled)]" />
              </div>
              <p className="text-sm text-[var(--text-faint)]">No courses found</p>
              <p className="text-xs text-[var(--text-disabled)]">
                Try a different search or clear the filter
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}