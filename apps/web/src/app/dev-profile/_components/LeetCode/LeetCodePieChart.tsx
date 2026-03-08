"use client";

import React, { useMemo, useRef, useState } from "react";

type Props = {
  data: { easySolved: number | string; mediumSolved: number | string; hardSolved: number | string };
  totalOverride?: number | string;
};

const SIZE    = 88;
const OUTER_R = 36;
const INNER_R = 27;
// Semantic data colors — intentionally hardcoded
const COLORS  = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" };

function arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const s = toXY(endAngle), e = toXY(startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} L ${cx} ${cy} Z`;
}

export default function LeetCodePieChart({ data, totalOverride }: Props) {
  const easy   = Math.max(0, Math.floor(Number(data?.easySolved   ?? 0) || 0));
  const medium = Math.max(0, Math.floor(Number(data?.mediumSolved ?? 0) || 0));
  const hard   = Math.max(0, Math.floor(Number(data?.hardSolved   ?? 0) || 0));
  const sum    = easy + medium + hard;
  const total  = typeof totalOverride !== "undefined"
    ? Math.max(0, Math.floor(Number(totalOverride) || 0))
    : sum;

  const cx = SIZE / 2, cy = SIZE / 2;

  const segments = useMemo(() => {
    const out: { start: number; end: number; color: string; label: string; value: number }[] = [];
    let cursor = 0;
    const add = (v: number, color: string, label: string) => {
      if (!v || !sum) return;
      const angle = (v / sum) * 360;
      out.push({ start: cursor, end: cursor + angle, color, label, value: v });
      cursor += angle;
    };
    add(easy, COLORS.easy, "Easy");
    add(medium, COLORS.medium, "Medium");
    add(hard, COLORS.hard, "Hard");
    return out;
  }, [easy, medium, hard, sum]);

  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="relative inline-block" role="img" aria-label={`${easy} easy, ${medium} medium, ${hard} hard`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        {sum === 0 ? (
          <circle cx={cx} cy={cy} r={OUTER_R} fill="var(--bg-hover)" />
        ) : (
          segments.map((s, i) => (
            <path
              key={i}
              d={arc(cx, cy, OUTER_R, s.start, s.end)}
              fill={s.color}
              onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect();
                setTip({ x: e.clientX - (rect?.left ?? 0) + 8, y: e.clientY - (rect?.top ?? 0) + 8, text: `${s.label}: ${s.value}` });
              }}
              onMouseLeave={() => setTip(null)}
            />
          ))
        )}
        {/* Inner fill uses CSS variable via a foreignObject trick — inline style string */}
        <circle cx={cx} cy={cy} r={INNER_R} fill="var(--bg-base)" />
        <text
          x={cx} y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: 14, fontWeight: 700, fill: "var(--text-primary)" }}
        >
          {total}
        </text>
      </svg>

      {tip && (
        <div
          style={{ position: "absolute", left: tip.x, top: tip.y }}
          className="pointer-events-none z-50 text-[10px] rounded-md px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-secondary)] shadow-lg whitespace-nowrap"
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}