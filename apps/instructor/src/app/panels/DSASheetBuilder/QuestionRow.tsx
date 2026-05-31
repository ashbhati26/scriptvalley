"use client";

import { GripVertical, X, Link2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Question, Difficulty, DIFFICULTY_COLOR, PLATFORM_OPTIONS } from "./sheetTypes";

interface Props {
  q: Question; qi: number;
  onUpdate: (patch: Partial<Question>) => void;
  onRemove: () => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDragEnd: () => void;
}

const DIFF_CONFIG: Record<Difficulty, { bg: string; border: string; text: string }> = {
  Easy:   { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  text: "#22a55b" },
  Medium: { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  text: "#d97706" },
  Hard:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", text: "#e53935" },
};

export default function QuestionRow({ q, qi, onUpdate, onRemove, onDragStart, onDragOver, onDragEnd }: Props) {
  const [showNotes, setShowNotes] = useState(!!q.notes);
  const [hovered,  setHovered]   = useState(false);
  const diff = DIFF_CONFIG[q.difficulty];

  return (
    <div
      draggable
      onDragStart={() => onDragStart(qi)}
      onDragOver={(e) => onDragOver(e, qi)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden sv-rounded-md"
      style={{
        border: `1px solid ${hovered ? "var(--border-default)" : "var(--border-subtle)"}`,
        background: hovered ? "var(--bg-elevated)" : "var(--bg-base)",
        transition: "border-color 80ms, background 80ms",
      }}
    >
      {/* Left accent bar */}
      <div className="absolute" style={{
        left: 0, top: 8, bottom: 8, width: 3,
        borderRadius: "0 3px 3px 0",
        background: DIFFICULTY_COLOR[q.difficulty],
        opacity: hovered ? 0.9 : 0.5,
        transition: "opacity 80ms",
      }} />

      {/* Row 1: grip + title + notes toggle + remove */}
      <div className="flex items-center gap-1.5" style={{ padding: "10px 12px 6px 16px" }}>
        <GripVertical size={12} className="cursor-grab flex-shrink-0"
          style={{ color: hovered ? "var(--text-faint)" : "var(--text-disabled)", opacity: hovered ? 1 : 0, transition: "opacity 80ms" }}
          onMouseDown={(e) => e.stopPropagation()} />

        <input value={q.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Problem title"
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium sv-text-primary"
          style={{ letterSpacing: "-0.008em", fontFamily: "var(--font-sans)" }} />

        <button type="button" onClick={() => setShowNotes((p) => !p)} onMouseDown={(e) => e.stopPropagation()}
          title={showNotes ? "Hide note" : "Add note"}
          className="flex items-center flex-shrink-0 cursor-pointer"
          style={{
            padding: "2px 5px", borderRadius: "var(--radius-xs)",
            background: showNotes ? "var(--brand-subtle)" : "transparent",
            border: showNotes ? "1px solid var(--brand-border)" : "1px solid transparent",
            color: showNotes ? "var(--brand)" : "var(--text-disabled)",
            opacity: showNotes ? 1 : (hovered ? 0.8 : 0), transition: "opacity 80ms, background 80ms",
          }}>
          <ChevronDown size={10} style={{ transform: showNotes ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 120ms" }} />
        </button>

        <button type="button" onClick={onRemove} onMouseDown={(e) => e.stopPropagation()}
          className="sv-btn-danger flex items-center flex-shrink-0"
          style={{ padding: 3, borderRadius: "var(--radius-xs)", opacity: hovered ? 1 : 0, transition: "opacity 80ms" }}>
          <X size={12} />
        </button>
      </div>

      {/* Row 2: URL + platform + difficulty */}
      <div className="flex items-center flex-wrap gap-1.5" style={{ padding: "0 12px 10px 16px" }}>
        <div className="flex items-center gap-1.5 flex-1 sv-bg-hover sv-rounded-sm"
          style={{ minWidth: 140, padding: "5px 9px", border: "1px solid transparent", transition: "border-color 80ms" }}
          onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; }}
          onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}>
          <Link2 size={10} className="sv-text-faint flex-shrink-0" />
          <input value={q.link?.url || ""} onChange={(e) => onUpdate({ link: { ...(q.link || { platform: "leetcode" }), url: e.target.value } })}
            onMouseDown={(e) => e.stopPropagation()} placeholder="Problem URL"
            className="bg-transparent border-none outline-none text-[11px] sv-text-muted w-full"
            style={{ letterSpacing: "-0.003em", fontFamily: "var(--font-sans)" }} />
        </div>

        <select value={q.link?.platform || "leetcode"} onChange={(e) => onUpdate({ link: { ...(q.link || { url: "" }), platform: e.target.value } })}
          onMouseDown={(e) => e.stopPropagation()}
          className="sv-text-muted sv-bg-hover sv-rounded-sm outline-none cursor-pointer text-[11px]"
          style={{ height: 30, padding: "0 9px", border: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)" }}>
          {PLATFORM_OPTIONS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
        </select>

        <select value={q.difficulty} onChange={(e) => onUpdate({ difficulty: e.target.value as Difficulty })}
          onMouseDown={(e) => e.stopPropagation()}
          className="outline-none cursor-pointer text-[11px] font-semibold sv-rounded-sm"
          style={{ height: 30, padding: "0 9px", background: diff.bg, border: `1px solid ${diff.border}`, color: diff.text, fontFamily: "var(--font-sans)" }}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Row 3: Notes */}
      {showNotes && (
        <div style={{ padding: "0 12px 10px 16px" }}>
          <input value={q.notes ?? ""} onChange={(e) => onUpdate({ notes: e.target.value || undefined })}
            onMouseDown={(e) => e.stopPropagation()} placeholder="Note for this problem…"
            className="w-full sv-text-muted text-[11px] sv-bg-hover sv-rounded-sm outline-none"
            style={{ border: "1px solid var(--border-subtle)", padding: "5px 10px", fontFamily: "var(--font-sans)", transition: "border-color 80ms, box-shadow 80ms" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-subtle)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.boxShadow = "none"; }} />
        </div>
      )}
    </div>
  );
}