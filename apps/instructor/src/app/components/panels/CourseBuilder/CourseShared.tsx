"use client";

import { useRef } from "react";
import { STATUS_META } from "./courseTypes";

export function StatusChip({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide rounded-full border uppercase ${
        size === "md" ? "text-[10px] px-2 py-0.5" : "text-[9px] px-1.5 py-0.5"
      }`}
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      {m.label}
    </span>
  );
}

export function useDragSort<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragging = useRef<number | null>(null);
  return {
    onDragStart: (idx: number) => { dragging.current = idx; },
    onDragOver:  (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragging.current === null || dragging.current === idx) return;
      const next = [...items];
      const [item] = next.splice(dragging.current, 1);
      next.splice(idx, 0, item);
      dragging.current = idx;
      onReorder(next);
    },
    onDragEnd: () => { dragging.current = null; },
  };
}