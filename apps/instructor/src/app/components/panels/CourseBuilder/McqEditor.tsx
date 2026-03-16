"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { MCQQuestion, MCQOption, emptyMCQ } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  questions: MCQQuestion[];
  canEdit:   boolean;
  onChange:  (q: MCQQuestion[]) => void;
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
    onChange(questions.filter((q) => q._key !== key));
    if (expanded === key) setExpanded(null);
  }

  function updateQuestion(key: string, text: string) {
    onChange(questions.map((q) => q._key === key ? { ...q, question: text } : q));
  }

  function updateExplanation(key: string, text: string) {
    onChange(questions.map((q) => q._key === key ? { ...q, explanation: text } : q));
  }

  function updateOption(qKey: string, oi: number, field: keyof MCQOption, value: any) {
    onChange(questions.map((q) => {
      if (q._key !== qKey) return q;
      const options = q.options.map((o, i) => i === oi ? { ...o, [field]: value } : o);
      return { ...q, options };
    }));
  }

  function addOption(qKey: string) {
    onChange(questions.map((q) =>
      q._key === qKey ? { ...q, options: [...q.options, { text: "", isCorrect: false }] } : q
    ));
  }

  function removeOption(qKey: string, oi: number) {
    onChange(questions.map((q) => {
      if (q._key !== qKey) return q;
      if (q.options.length <= 2) return q; // min 2
      return { ...q, options: q.options.filter((_, i) => i !== oi) };
    }));
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">MCQ Questions</p>
          <p className="text-sm text-(--text-faint)">Multiple-choice questions for this module. Students answer after completing all lessons.</p>
        </div>
        {canEdit ? (
          <button onClick={add}
            className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">No MCQs yet — click to add one</span>
          </button>
        ) : (
          <p className="text-sm text-(--text-disabled) italic py-8 text-center">No MCQ questions added.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">MCQ Questions</p>
          <p className="text-sm text-(--text-faint)">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
        </div>
        {canEdit && (
          <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-medium transition-colors">
            <Plus className="w-3 h-3" />Add Question
          </button>
        )}
      </div>

      <div className="space-y-2">
        {questions.map((q, qi) => {
          const hasCorrect = q.options.some((o) => o.isCorrect);
          const isOpen = expanded === q._key;

          return (
            <div key={q._key}
              draggable={canEdit && !isOpen}
              onDragStart={() => drag.onDragStart(qi)}
              onDragOver={(e) => drag.onDragOver(e, qi)}
              onDragEnd={drag.onDragEnd}
              className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden"
            >
              {/* Question header */}
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setExpanded(isOpen ? null : q._key)}>
                {canEdit && (
                  <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 cursor-grab" onClick={(e) => e.stopPropagation()} />
                )}
                <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0">
                  {qi + 1}
                </span>
                <p className="flex-1 text-sm text-(--text-secondary) truncate">
                  {q.question || <span className="italic text-(--text-disabled)">Untitled question</span>}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasCorrect
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    : <AlertCircle  className="w-3.5 h-3.5 text-amber-400" />
                  }
                  {canEdit && (
                    <button onClick={(e) => { e.stopPropagation(); remove(q._key); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-(--text-disabled) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-(--text-disabled)" /> : <ChevronDown className="w-3.5 h-3.5 text-(--text-disabled)" />}
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-(--border-subtle)">
                  {/* Question text */}
                  <div className="pt-4">
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 block">Question</label>
                    {canEdit ? (
                      <textarea
                        value={q.question} onChange={(e) => updateQuestion(q._key, e.target.value)}
                        placeholder="Enter the question…" rows={2}
                        className="w-full resize-none bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-(--text-secondary)">{q.question}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] uppercase tracking-widest text-(--text-disabled)">Options</label>
                      {canEdit && (
                        <button onClick={() => addOption(q._key)} className="text-[10px] text-(--brand) hover:underline font-medium">
                          + Add option
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors ${
                            opt.isCorrect
                              ? "border-emerald-500/30 bg-emerald-500/[0.05]"
                              : "border-(--border-subtle) bg-(--bg-input)"
                          }`}
                        >
                          {/* Correct toggle */}
                          <button
                            onClick={() => canEdit && updateOption(q._key, oi, "isCorrect", !opt.isCorrect)}
                            disabled={!canEdit}
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              opt.isCorrect
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-(--border-medium) hover:border-emerald-500/50"
                            } ${!canEdit ? "cursor-default" : "cursor-pointer"}`}
                          >
                            {opt.isCorrect && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </button>

                          {/* Option text */}
                          {canEdit ? (
                            <input
                              value={opt.text} onChange={(e) => updateOption(q._key, oi, "text", e.target.value)}
                              placeholder={`Option ${oi + 1}`}
                              className={`flex-1 text-sm bg-transparent outline-none placeholder:text-(--text-disabled) ${
                                opt.isCorrect ? "text-emerald-600 font-medium" : "text-(--text-secondary)"
                              }`}
                            />
                          ) : (
                            <span className={`flex-1 text-sm ${opt.isCorrect ? "text-emerald-600 font-medium" : "text-(--text-secondary)"}`}>
                              {opt.text || `Option ${oi + 1}`}
                            </span>
                          )}

                          {canEdit && q.options.length > 2 && (
                            <button onClick={() => removeOption(q._key, oi)}
                              className="w-5 h-5 flex items-center justify-center rounded text-(--text-disabled) hover:text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {!hasCorrect && canEdit && (
                      <p className="text-[10px] text-amber-500 flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />Mark at least one correct answer
                      </p>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5 block">
                      Explanation <span className="normal-case">(optional)</span>
                    </label>
                    {canEdit ? (
                      <textarea
                        value={q.explanation ?? ""} onChange={(e) => updateExplanation(q._key, e.target.value)}
                        placeholder="Explain why the answer is correct — shown after student answers…" rows={2}
                        className="w-full resize-none bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                      />
                    ) : q.explanation ? (
                      <p className="text-sm text-(--text-faint) italic">{q.explanation}</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canEdit && (
        <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
          <Plus className="w-3.5 h-3.5" />Add another question
        </button>
      )}
    </div>
  );
}