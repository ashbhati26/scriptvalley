"use client";

import { useRef } from "react";
import { STATUS_META } from "./courseTypes";

export function StatusChip({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  // Dynamic colors come from runtime data — inline required for border/color/bg
  return (
    <span
      className="inline-flex items-center font-medium uppercase rounded-full whitespace-nowrap leading-relaxed"
      style={{
        fontSize:      size === "md" ? "11px" : "10px",
        letterSpacing: "0.02em",
        padding:       size === "md" ? "2px 7px" : "1px 6px",
        border:        `1px solid ${m.border}`,
        color:         m.color,
        background:    m.bg,
      }}
    >
      {m.label}
    </span>
  );
}

export function useDragSort<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragging = useRef<number | null>(null);
  const lastSwap = useRef(0);
  return {
    onDragStart: (idx: number) => { dragging.current = idx; },
    onDragOver: (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragging.current === null || dragging.current === idx) return;
      if (Date.now() - lastSwap.current < 60) return;
      const next = [...items];
      const [item] = next.splice(dragging.current, 1);
      next.splice(idx, 0, item);
      dragging.current = idx;
      lastSwap.current = Date.now();
      onReorder(next);
    },
    onDragEnd: () => { dragging.current = null; },
  };
}