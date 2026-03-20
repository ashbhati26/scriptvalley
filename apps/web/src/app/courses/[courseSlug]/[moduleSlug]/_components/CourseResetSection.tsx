"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import ResetProgressModal from "./ResetProgressModal";

interface Props {
  courseSlug:       string;
  courseTitle:      string;
  completedLessons: number;
}

export default function CourseResetSection({
  courseSlug, courseTitle, completedLessons,
}: Props) {
  const [open,      setOpen]      = useState(false);
  const [resetting, setResetting] = useState(false);

  const resetMut = useMutation(api.courses.resetCourseProgress);

  async function handleReset() {
    setResetting(true);
    try {
      const result = await resetMut({ courseSlug });
      toast.success(`Reset ${result.deleted} lesson${result.deleted !== 1 ? "s" : ""}`);
      setOpen(false);
    } catch {
      toast.error("Failed to reset progress");
    } finally {
      setResetting(false);
    }
  }

  if (completedLessons === 0) return null;

  return (
    <>
      <div className="border-t border-[var(--border-subtle)] pt-8 mt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          Danger zone
        </p>
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] px-4 py-3.5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Reset course progress
            </p>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">
              Marks all {completedLessons} completed lesson{completedLessons !== 1 ? "s" : ""} as incomplete. Cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400 text-xs font-medium hover:bg-red-500/[0.08] transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <ResetProgressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReset}
        loading={resetting}
        type="course"
        name={courseTitle}
      />
    </>
  );
}