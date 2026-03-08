"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  filter: "All" | "Easy" | "Medium" | "Hard";
  setFilter: (value: "All" | "Easy" | "Medium" | "Hard") => void;
};

// Difficulty text colors are semantic data colors — kept hardcoded
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:   "text-[#22c55e]",
  Medium: "text-[#f59e0b]",
  Hard:   "text-red-400",
};

type BtnPos = { left: number; width: number };

export default function FilterTabs({ filter, setFilter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, BtnPos>>({});

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const next: Record<string, BtnPos> = {};
      ["All", "Easy", "Medium", "Hard"].forEach((lvl) => {
        const btn = containerRef.current!.querySelector(
          `[data-lvl="${lvl}"]`,
        ) as HTMLElement | null;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        next[lvl] = { left: r.left - container.left, width: r.width };
      });
      setPositions(next);
    };
    requestAnimationFrame(() => requestAnimationFrame(update));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const active = positions[filter];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <span className="text-sm font-medium text-[var(--text-secondary)]">All Problems</span>

      <div
        ref={containerRef}
        className="inline-flex items-center relative bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-md px-1 py-1 gap-px"
      >
        {/* Sliding indicator */}
        {active && (
          <motion.div
            className="absolute rounded-md bg-[var(--bg-active)]"
            animate={{ left: active.left, width: active.width }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ top: 4, bottom: 4, height: "calc(100% - 8px)" }}
          />
        )}

        {(["All", "Easy", "Medium", "Hard"] as const).map((lvl) => (
          <button
            key={lvl}
            data-lvl={lvl}
            onClick={() => setFilter(lvl)}
            className={`relative z-10 px-3 py-1.5 rounded-md text-xs transition-colors duration-100 ${
              filter === lvl
                ? `${DIFFICULTY_COLORS[lvl] ?? "text-[var(--text-primary)]"}`
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}