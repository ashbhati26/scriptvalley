"use client";

import { useState } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  ExternalLink, Link2, FileText, Lightbulb,
} from "lucide-react";
import { CodingChallenge, Difficulty, PLATFORMS, emptyCodingChallenge } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  challenges: CodingChallenge[];
  canEdit: boolean;
  onChange: (c: CodingChallenge[]) => void;
  label?: string;
  description?: string;
  single?: boolean;
}

// Difficulty metadata — dynamic colors from data, inline required
const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  easy:   { label: "Easy",   color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
  medium: { label: "Medium", color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
  hard:   { label: "Hard",   color: "var(--danger)",  bg: "var(--danger-bg)",  border: "var(--danger-border)"  },
};

// Shared label style — used for all field labels
const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: 10, fontWeight: 500,
  letterSpacing: "0.05em", textTransform: "uppercase",
  color: "var(--text-disabled)",
  marginBottom: 6,
};

// Shared input style
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-input)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  padding: "8px 10px",
  fontSize: 13, color: "var(--text-secondary)",
  outline: "none", letterSpacing: "-0.006em",
  fontFamily: "var(--font-sans)",
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "var(--brand)";
  e.currentTarget.style.boxShadow   = "0 0 0 2px var(--brand-subtle)";
};
const blurStyle  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "var(--border-default)";
  e.currentTarget.style.boxShadow   = "none";
};

export default function ChallengeEditor({
  challenges, canEdit, onChange,
  label = "Coding Challenges", description, single,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(challenges[0]?._key ?? null);
  const drag = useDragSort(challenges, onChange);

  function add()  { const c = emptyCodingChallenge(); onChange([...challenges, c]); setExpanded(c._key); }
  function remove(key: string) { onChange(challenges.filter(c => c._key !== key)); if (expanded === key) setExpanded(null); }
  function update(key: string, patch: Partial<CodingChallenge>) { onChange(challenges.map(c => c._key === key ? { ...c, ...patch } : c)); }

  if (challenges.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <p style={fieldLabel}>{label}</p>
          {description && <p style={{ fontSize: 13, color: "var(--text-faint)" }}>{description}</p>}
        </div>
        {canEdit ? (
          <button
            onClick={add}
            style={{
              width: "100%", minHeight: 120,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, borderRadius: "var(--radius-xl)",
              border: "1.5px dashed var(--border-medium)",
              background: "transparent", cursor: "pointer", color: "var(--text-disabled)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Plus size={22} />
            <span style={{ fontSize: 13 }}>No {label.toLowerCase()} yet — click to add one</span>
          </button>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-disabled)", fontStyle: "italic", textAlign: "center", padding: "32px 0" }}>
            No {label.toLowerCase()} added.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <p style={fieldLabel}>{label}</p>
          {description && <p style={{ fontSize: 13, color: "var(--text-faint)" }}>{description}</p>}
        </div>
        {canEdit && !single && (
          <button
            onClick={add}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 11px",
              borderRadius: "var(--radius-md)",
              fontSize: 12, fontWeight: 500,
              color: "var(--text-secondary)",
              background: "transparent",
              border: "1px solid var(--border-default)",
              cursor: "pointer", flexShrink: 0, marginTop: 2,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; }}
          >
            <Plus size={12} />Add
          </button>
        )}
      </div>

      {/* Challenge cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {challenges.map((c, ci) => {
          const isOpen   = expanded === c._key;
          const diffMeta = c.difficulty ? DIFFICULTY_META[c.difficulty] : null;

          return (
            <div
              key={c._key}
              draggable={canEdit && !isOpen && !single}
              onDragStart={() => drag.onDragStart(ci)}
              onDragOver={(e) => drag.onDragOver(e, ci)}
              onDragEnd={drag.onDragEnd}
              style={{
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isOpen ? null : c._key)}
              >
                {canEdit && !single && (
                  <GripVertical size={13} style={{ color: "var(--text-disabled)", cursor: "grab", flexShrink: 0 }} onClick={(e) => e.stopPropagation()} />
                )}
                {!single && (
                  <span style={{
                    width: 24, height: 24, borderRadius: "var(--radius-md)",
                    background: "var(--bg-hover)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: "var(--text-muted)", flexShrink: 0,
                  }}>
                    {ci + 1}
                  </span>
                )}
                <p style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.title || <span style={{ fontStyle: "italic", color: "var(--text-disabled)" }}>Untitled challenge</span>}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {/* Difficulty badge — dynamic data color */}
                  {diffMeta && (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: "var(--radius-xs)", color: diffMeta.color, background: diffMeta.bg }}>
                      {diffMeta.label}
                    </span>
                  )}
                  {c.link && <ExternalLink size={12} style={{ color: "var(--text-disabled)" }} />}
                  {canEdit && !single && (
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(c._key); }}
                      style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-disabled)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-disabled)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  {isOpen ? <ChevronUp size={13} style={{ color: "var(--text-disabled)" }} /> : <ChevronDown size={13} style={{ color: "var(--text-disabled)" }} />}
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Title */}
                  <div style={{ paddingTop: 14 }}>
                    <label style={fieldLabel}>Title</label>
                    {canEdit ? (
                      <input value={c.title} onChange={(e) => update(c._key, { title: e.target.value })} placeholder="e.g. Two Sum, Bank Account System…" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    ) : (
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{c.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={10} />Description
                    </label>
                    {canEdit ? (
                      <textarea
                        value={c.description}
                        onChange={(e) => update(c._key, { description: e.target.value })}
                        placeholder="Brief description of what the student needs to build or solve…"
                        rows={3}
                        style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    ) : c.description ? (
                      <p style={{ fontSize: 13, color: "var(--text-faint)" }}>{c.description}</p>
                    ) : null}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label style={fieldLabel}>Difficulty</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                        const m      = DIFFICULTY_META[d];
                        const active = c.difficulty === d;
                        return (
                          <button
                            key={d}
                            onClick={() => canEdit && update(c._key, { difficulty: active ? undefined : d })}
                            disabled={!canEdit}
                            style={{
                              padding: "5px 12px",
                              borderRadius: "var(--radius-md)",
                              fontSize: 12, fontWeight: 600,
                              border: `1px solid ${active ? m.border : "var(--border-subtle)"}`,
                              color:  active ? m.color  : "var(--text-disabled)",
                              background: active ? m.bg : "var(--bg-input)",
                              cursor: canEdit ? "pointer" : "default",
                              transition: "all 80ms",
                            }}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Platform + Link */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={fieldLabel}>Platform</label>
                      {canEdit ? (
                        <select
                          value={c.platform ?? ""}
                          onChange={(e) => update(c._key, { platform: e.target.value || undefined })}
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={focusStyle} onBlur={blurStyle}
                        >
                          <option value="">— Platform —</option>
                          {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      ) : c.platform ? (
                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                          {PLATFORMS.find(p => p.value === c.platform)?.label ?? c.platform}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: 4 }}>
                        <Link2 size={10} />External Link
                      </label>
                      {canEdit ? (
                        <input
                          value={c.link ?? ""}
                          onChange={(e) => update(c._key, { link: e.target.value || undefined })}
                          placeholder="https://leetcode.com/problems/…"
                          style={inputStyle}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      ) : c.link ? (
                        <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--brand)", textDecoration: "none" }}>
                          Solve it here <ExternalLink size={12} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Hint */}
                  <div>
                    <label style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: 4 }}>
                      <Lightbulb size={10} />Hint <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                    </label>
                    {canEdit ? (
                      <textarea
                        value={c.hint ?? ""}
                        onChange={(e) => update(c._key, { hint: e.target.value || undefined })}
                        placeholder="Optional hint for students who are stuck…"
                        rows={2}
                        style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    ) : c.hint ? (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-md)", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                        <Lightbulb size={13} style={{ color: "var(--warning)", marginTop: 1, flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: "var(--text-faint)", fontStyle: "italic" }}>{c.hint}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add another */}
      {canEdit && !single && (
        <button
          onClick={add}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-default)",
            background: "transparent", cursor: "pointer",
            fontSize: 12, color: "var(--text-disabled)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; (e.currentTarget as HTMLElement).style.color = "var(--text-disabled)"; }}
        >
          <Plus size={13} />Add another challenge
        </button>
      )}
    </div>
  );
}