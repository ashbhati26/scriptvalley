"use client";

import { useState } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle2,
} from "lucide-react";
import { MCQQuestion, MCQOption, emptyMCQ } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  questions: MCQQuestion[];
  canEdit: boolean;
  onChange: (q: MCQQuestion[]) => void;
}

export default function MCQEditor({ questions, canEdit, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(questions[0]?._key ?? null);
  const drag = useDragSort(questions, onChange);

  function add() {
    const q = emptyMCQ();
    onChange([...questions, q]);
    setExpanded(q._key);
  }

  function remove(key: string) {
    onChange(questions.filter(q => q._key !== key));
    if (expanded === key) setExpanded(null);
  }

  function updateQuestion(key: string, text: string) {
    onChange(questions.map(q => q._key === key ? { ...q, question: text } : q));
  }

  function updateExplanation(key: string, text: string) {
    onChange(questions.map(q => q._key === key ? { ...q, explanation: text } : q));
  }

  function updateOption(qKey: string, oi: number, field: keyof MCQOption, value: any) {
    onChange(questions.map(q => {
      if (q._key !== qKey) return q;
      const options = q.options.map((o, i) => i === oi ? { ...o, [field]: value } : o);
      return { ...q, options };
    }));
  }

  function addOption(qKey: string) {
    onChange(questions.map(q =>
      q._key === qKey
        ? { ...q, options: [...q.options, { text: "", isCorrect: false }] }
        : q,
    ));
  }

  function removeOption(qKey: string, oi: number) {
    onChange(questions.map(q => {
      if (q._key !== qKey) return q;
      if (q.options.length <= 2) return q;
      return { ...q, options: q.options.filter((_, i) => i !== oi) };
    }));
  }

  // ── Shared field label style
  const fieldLabel: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-disabled)",
    marginBottom: 6,
  };

  // ── Shared textarea style
  const textareaStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-input)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-md)",
    padding: "8px 10px",
    fontSize: 13,
    color: "var(--text-secondary)",
    outline: "none",
    resize: "none",
    lineHeight: 1.6,
    fontFamily: "var(--font-sans)",
    letterSpacing: "-0.006em",
  };

  if (questions.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p style={fieldLabel}>MCQ Questions</p>
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>
            Multiple-choice questions for this module. Students answer after completing all lessons.
          </p>
        </div>
        {canEdit ? (
          <button
            onClick={add}
            style={{
              width: "100%", minHeight: 120,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8,
              borderRadius: "var(--radius-xl)",
              border: "1.5px dashed var(--border-medium)",
              background: "transparent", cursor: "pointer",
              color: "var(--text-disabled)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Plus size={22} />
            <span style={{ fontSize: 13 }}>No MCQs yet — click to add one</span>
          </button>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-disabled)", fontStyle: "italic", textAlign: "center", padding: "32px 0" }}>
            No MCQ questions added.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={fieldLabel}>MCQ Questions</p>
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canEdit && (
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
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; }}
          >
            <Plus size={12} />Add question
          </button>
        )}
      </div>

      {/* Question cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {questions.map((q, qi) => {
          const hasCorrect = q.options.some(o => o.isCorrect);
          const isOpen     = expanded === q._key;

          return (
            <div
              key={q._key}
              draggable={canEdit && !isOpen}
              onDragStart={() => drag.onDragStart(qi)}
              onDragOver={(e) => drag.onDragOver(e, qi)}
              onDragEnd={drag.onDragEnd}
              style={{
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                overflow: "hidden",
              }}
            >
              {/* Question row */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isOpen ? null : q._key)}
              >
                {canEdit && (
                  <GripVertical
                    size={13}
                    style={{
                      color: "var(--text-disabled)",
                      cursor: isOpen ? "not-allowed" : "grab",
                      opacity: isOpen ? 0.3 : 1,
                      flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span style={{
                  width: 24, height: 24, borderRadius: "var(--radius-md)",
                  background: "var(--bg-hover)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "var(--text-muted)", flexShrink: 0,
                }}>
                  {qi + 1}
                </span>
                <p style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {q.question || <span style={{ fontStyle: "italic", color: "var(--text-disabled)" }}>Untitled question</span>}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {hasCorrect
                    ? <CheckCircle2 size={13} style={{ color: "var(--success)" }} />
                    : <AlertCircle  size={13} style={{ color: "var(--warning)" }} />}
                  {canEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(q._key); }}
                      style={{
                        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "var(--radius-sm)", background: "transparent", border: "none",
                        cursor: "pointer", color: "var(--text-disabled)",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-disabled)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  {isOpen
                    ? <ChevronUp   size={13} style={{ color: "var(--text-disabled)" }} />
                    : <ChevronDown size={13} style={{ color: "var(--text-disabled)" }} />}
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Question text */}
                  <div style={{ paddingTop: 14 }}>
                    <label style={fieldLabel}>Question</label>
                    {canEdit ? (
                      <textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(q._key, e.target.value)}
                        placeholder="Enter the question…"
                        rows={2}
                        style={textareaStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-subtle)"; }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    ) : (
                      <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{q.question}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <label style={fieldLabel}>Options</label>
                      {canEdit && (
                        <button
                          onClick={() => addOption(q._key)}
                          style={{ fontSize: 11, fontWeight: 500, color: "var(--brand)", background: "none", border: "none", cursor: "pointer" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
                        >
                          + Add option
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "8px 12px",
                            borderRadius: "var(--radius-md)",
                            border: `1px solid ${opt.isCorrect ? "var(--success-border)" : "var(--border-subtle)"}`,
                            background: opt.isCorrect ? "var(--success-bg)" : "var(--bg-input)",
                          }}
                        >
                          {/* Radio button */}
                          <button
                            onClick={() => canEdit && updateOption(q._key, oi, "isCorrect", !opt.isCorrect)}
                            disabled={!canEdit}
                            style={{
                              width: 16, height: 16, borderRadius: "50%",
                              border: `2px solid ${opt.isCorrect ? "var(--success)" : "var(--border-medium)"}`,
                              background: opt.isCorrect ? "var(--success)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: canEdit ? "pointer" : "default", flexShrink: 0,
                              padding: 0,
                            }}
                          >
                            {opt.isCorrect && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                          </button>

                          {/* Option text */}
                          {canEdit ? (
                            <input
                              value={opt.text}
                              onChange={(e) => updateOption(q._key, oi, "text", e.target.value)}
                              placeholder={`Option ${oi + 1}`}
                              style={{
                                flex: 1, background: "transparent", border: "none", outline: "none",
                                fontSize: 13,
                                color: opt.isCorrect ? "var(--success)" : "var(--text-secondary)",
                                fontWeight: opt.isCorrect ? 500 : 400,
                                fontFamily: "var(--font-sans)",
                              }}
                            />
                          ) : (
                            <span style={{ flex: 1, fontSize: 13, color: opt.isCorrect ? "var(--success)" : "var(--text-secondary)", fontWeight: opt.isCorrect ? 500 : 400 }}>
                              {opt.text || `Option ${oi + 1}`}
                            </span>
                          )}

                          {/* Remove option */}
                          {canEdit && q.options.length > 2 && (
                            <button
                              onClick={() => removeOption(q._key, oi)}
                              style={{
                                width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: "var(--radius-xs)", background: "transparent", border: "none",
                                cursor: "pointer", color: "var(--text-disabled)", flexShrink: 0,
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-disabled)"; }}
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {!hasCorrect && canEdit && (
                      <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--warning)", marginTop: 6 }}>
                        <AlertCircle size={11} />Mark at least one correct answer
                      </p>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label style={fieldLabel}>
                      Explanation <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                    </label>
                    {canEdit ? (
                      <textarea
                        value={q.explanation ?? ""}
                        onChange={(e) => updateExplanation(q._key, e.target.value)}
                        placeholder="Explain why the answer is correct — shown after student answers…"
                        rows={2}
                        style={textareaStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-subtle)"; }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    ) : q.explanation ? (
                      <p style={{ fontSize: 13, color: "var(--text-faint)", fontStyle: "italic" }}>{q.explanation}</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add another question */}
      {canEdit && (
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
          <Plus size={13} />Add another question
        </button>
      )}
    </div>
  );
}