"use client";

import { useState } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  ExternalLink, Link2, FileText, Lightbulb,
} from "lucide-react";
import { CodingChallenge, Difficulty, PLATFORMS, emptyCodingChallenge } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  challenges:  CodingChallenge[];
  canEdit:     boolean;
  onChange:    (c: CodingChallenge[]) => void;
  label?:      string;
  description?: string;
  single?:     boolean; // mini project mode — hide multi-add
}

const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy:   { label: "Easy",   color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  hard:   { label: "Hard",   color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
};

export default function ChallengeEditor({ challenges, canEdit, onChange, label = "Coding Challenges", description, single }: Props) {
  const [expanded, setExpanded] = useState<string | null>(challenges[0]?._key ?? null);
  const drag = useDragSort(challenges, onChange);

  function add() {
    const c = emptyCodingChallenge();
    onChange([...challenges, c]);
    setExpanded(c._key);
  }

  function remove(key: string) {
    onChange(challenges.filter((c) => c._key !== key));
    if (expanded === key) setExpanded(null);
  }

  function update(key: string, patch: Partial<CodingChallenge>) {
    onChange(challenges.map((c) => c._key === key ? { ...c, ...patch } : c));
  }

  if (challenges.length === 0) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">{label}</p>
          {description && <p className="text-sm text-(--text-faint)">{description}</p>}
        </div>
        {canEdit ? (
          <button onClick={add}
            className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">No {label.toLowerCase()} yet — click to add one</span>
          </button>
        ) : (
          <p className="text-sm text-(--text-disabled) italic py-8 text-center">No {label.toLowerCase()} added.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">{label}</p>
          {description && <p className="text-sm text-(--text-faint)">{description}</p>}
        </div>
        {canEdit && !single && (
          <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors">
            <Plus className="w-3 h-3" />Add
          </button>
        )}
      </div>

      <div className="space-y-2">
        {challenges.map((c, ci) => {
          const isOpen = expanded === c._key;
          const diffMeta = c.difficulty ? DIFFICULTY_META[c.difficulty] : null;

          return (
            <div key={c._key}
              draggable={canEdit && !isOpen && !single}
              onDragStart={() => drag.onDragStart(ci)}
              onDragOver={(e) => drag.onDragOver(e, ci)}
              onDragEnd={drag.onDragEnd}
              className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setExpanded(isOpen ? null : c._key)}>
                {canEdit && !single && (
                  <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 cursor-grab" onClick={(e) => e.stopPropagation()} />
                )}
                {!single && (
                  <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0">
                    {ci + 1}
                  </span>
                )}
                <p className="flex-1 text-sm text-(--text-secondary) truncate">
                  {c.title || <span className="italic text-(--text-disabled)">Untitled challenge</span>}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {diffMeta && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ color: diffMeta.color, background: diffMeta.bg }}>
                      {diffMeta.label}
                    </span>
                  )}
                  {c.link && <ExternalLink className="w-3 h-3 text-(--text-disabled)" />}
                  {canEdit && !single && (
                    <button onClick={(e) => { e.stopPropagation(); remove(c._key); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-(--text-disabled) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-(--text-disabled)" /> : <ChevronDown className="w-3.5 h-3.5 text-(--text-disabled)" />}
                </div>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="px-4 pb-5 space-y-4 border-t border-(--border-subtle)">

                  {/* Title */}
                  <div className="pt-4">
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 block">Title</label>
                    {canEdit ? (
                      <input
                        value={c.title} onChange={(e) => update(c._key, { title: e.target.value })}
                        placeholder="e.g. Two Sum, Bank Account System…"
                        className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-(--text-secondary)">{c.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 block flex items-center gap-1">
                      <FileText className="w-3 h-3" />Description
                    </label>
                    {canEdit ? (
                      <textarea
                        value={c.description} onChange={(e) => update(c._key, { description: e.target.value })}
                        placeholder="Brief description of what the student needs to build or solve…" rows={3}
                        className="w-full resize-none bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                      />
                    ) : c.description ? (
                      <p className="text-sm text-(--text-faint)">{c.description}</p>
                    ) : null}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2 block">Difficulty</label>
                    <div className="flex gap-2">
                      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                        const m = DIFFICULTY_META[d];
                        const active = c.difficulty === d;
                        return (
                          <button key={d} onClick={() => canEdit && update(c._key, { difficulty: active ? undefined : d })}
                            disabled={!canEdit}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                            style={active
                              ? { color: m.color, background: m.bg, borderColor: m.color + "50" }
                              : { color: "var(--text-disabled)", background: "var(--bg-input)", borderColor: "var(--border-subtle)" }
                            }
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Platform + Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 block">Platform</label>
                      {canEdit ? (
                        <select
                          value={c.platform ?? ""} onChange={(e) => update(c._key, { platform: e.target.value || undefined })}
                          className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) outline-none focus:border-(--border-medium) transition-colors"
                        >
                          <option value="">— Platform —</option>
                          {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      ) : c.platform ? (
                        <p className="text-sm text-(--text-secondary)">{PLATFORMS.find((p) => p.value === c.platform)?.label ?? c.platform}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 flex items-center gap-1">
                        <Link2 className="w-3 h-3" />External Link
                      </label>
                      {canEdit ? (
                        <input
                          value={c.link ?? ""} onChange={(e) => update(c._key, { link: e.target.value || undefined })}
                          placeholder="https://leetcode.com/problems/…"
                          className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                        />
                      ) : c.link ? (
                        <a href={c.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-(--brand) hover:underline"
                        >
                          Solve it here <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Hint */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />Hint <span className="normal-case">(optional)</span>
                    </label>
                    {canEdit ? (
                      <textarea
                        value={c.hint ?? ""} onChange={(e) => update(c._key, { hint: e.target.value || undefined })}
                        placeholder="Optional hint for students who are stuck…" rows={2}
                        className="w-full resize-none bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                      />
                    ) : c.hint ? (
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-(--bg-input) border border-(--border-subtle)">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-(--text-faint) italic">{c.hint}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canEdit && !single && (
        <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
          <Plus className="w-3.5 h-3.5" />Add another challenge
        </button>
      )}
    </div>
  );
}