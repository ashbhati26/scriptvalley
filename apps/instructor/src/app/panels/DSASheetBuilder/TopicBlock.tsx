"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronRight, Layers } from "lucide-react";
import { Topic, SubTopic, Question, emptyQuestion } from "./sheetTypes";
import { useDragSort } from "../shared/ui";
import QuestionRow from "./QuestionRow";
import SubTopicBlock from "./SubTopicBlock";

interface Props {
  t: Topic; ti: number;
  onUpdateName: (v: string) => void;
  onRemove: () => void;
  onToggleSubTopics: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (qi: number, p: Partial<Question>) => void;
  onRemoveQuestion: (qi: number) => void;
  onReorderQuestions: (qs: Question[]) => void;
  onAddSubTopic: () => void;
  onUpdateSubTopic: (si: number, patch: Partial<SubTopic>) => void;
  onRemoveSubTopic: (si: number) => void;
  onReorderSubTopics: (sts: SubTopic[]) => void;
  onTopicDragStart: (i: number) => void;
  onTopicDragOver: (e: React.DragEvent, i: number) => void;
  onTopicDragEnd: () => void;
}

export default function TopicBlock({
  t, ti,
  onUpdateName, onRemove, onToggleSubTopics,
  onAddQuestion, onUpdateQuestion, onRemoveQuestion, onReorderQuestions,
  onAddSubTopic, onUpdateSubTopic, onRemoveSubTopic, onReorderSubTopics,
  onTopicDragStart, onTopicDragOver, onTopicDragEnd,
}: Props) {
  const [open,    setOpen]    = useState(true);
  const [hovered, setHovered] = useState(false);

  const qDrag  = useDragSort(t.questions, onReorderQuestions);
  const stDrag = useDragSort(t.subTopics ?? [], onReorderSubTopics);

  const subTopics     = t.subTopics ?? [];
  const questionCount = t.useSubTopics
    ? subTopics.reduce((a, st) => a + st.questions.length, 0)
    : t.questions.length;

  return (
    <div
      draggable
      onDragStart={() => onTopicDragStart(ti)}
      onDragOver={(e) => onTopicDragOver(e, ti)}
      onDragEnd={onTopicDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sv-bg-elevated overflow-hidden sv-rounded-lg"
      style={{
        border: `1px solid ${hovered ? "var(--border-default)" : "var(--border-subtle)"}`,
        boxShadow: hovered ? "var(--shadow-sm)" : "none",
        transition: "border-color 80ms, box-shadow 120ms",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 sv-bg-elevated select-none"
        style={{ padding: "11px 14px", borderBottom: open ? "1px solid var(--border-subtle)" : "none" }}
      >
        <GripVertical size={12} className={`cursor-grab flex-shrink-0 ${hovered ? "sv-text-faint" : "sv-text-disabled"}`}
          style={{ transition: "color 80ms" }} onMouseDown={(e) => e.stopPropagation()} />

        <button type="button" onClick={() => setOpen((o) => !o)} onMouseDown={(e) => e.stopPropagation()}
          className="bg-transparent border-none cursor-pointer flex items-center p-0 flex-shrink-0">
          <ChevronRight size={13} className={open ? "sv-text-muted" : "sv-text-disabled"}
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
        </button>

        <input value={t.topic} onChange={(e) => onUpdateName(e.target.value)} placeholder="Topic name"
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-none outline-none text-[13px] font-semibold sv-text-primary"
          style={{ letterSpacing: "-0.01em", fontFamily: "var(--font-sans)" }} />

        {/* Sub-topics toggle */}
        <button type="button" onClick={(e) => { e.stopPropagation(); onToggleSubTopics(); }}
          onMouseDown={(e) => e.stopPropagation()}
          title={t.useSubTopics ? "Switch to flat questions" : "Enable sub-topics"}
          className="flex items-center gap-1 text-[10px] font-medium cursor-pointer flex-shrink-0"
          style={{
            padding: "3px 9px", borderRadius: "100px",
            border: `1px solid ${t.useSubTopics ? "var(--brand-border)" : "var(--border-subtle)"}`,
            background: t.useSubTopics ? "var(--brand-subtle)" : "transparent",
            color: t.useSubTopics ? "var(--brand)" : "var(--text-faint)",
            letterSpacing: "0.01em", transition: "background 80ms, color 80ms, border-color 80ms",
            fontFamily: "var(--font-sans)",
          }}>
          <Layers size={9} />{t.useSubTopics ? "Sub-topics on" : "Sub-topics"}
        </button>

        {/* Count badge */}
        <span className="text-[10px] font-medium sv-text-disabled sv-bg-active flex-shrink-0"
          style={{ borderRadius: "100px", padding: "2px 8px", letterSpacing: "0.01em", border: "1px solid var(--border-subtle)" }}>
          {questionCount}q
        </span>

        {/* Add action */}
        {t.useSubTopics ? (
          <button type="button" onClick={(e) => { e.stopPropagation(); onAddSubTopic(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="sv-btn-ghost flex items-center gap-0.5 text-[10px] flex-shrink-0"
            style={{ padding: "3px 8px", borderRadius: "var(--radius-sm)" }}>
            <Plus size={9} /> Sub-topic
          </button>
        ) : (
          <button type="button" onClick={(e) => { e.stopPropagation(); onAddQuestion(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="sv-btn-ghost flex items-center gap-0.5 text-[10px] flex-shrink-0"
            style={{ padding: "3px 8px", borderRadius: "var(--radius-sm)" }}>
            <Plus size={9} /> Add Q
          </button>
        )}

        {/* Delete */}
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="sv-btn-danger flex items-center flex-shrink-0"
          style={{ padding: 4, borderRadius: "var(--radius-xs)" }}>
          <Trash2 size={12} />
        </button>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.14 }} className="overflow-hidden">
            <div className="sv-bg-base" style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>

              {/* Flat questions */}
              {!t.useSubTopics && (
                <>
                  {t.questions.length === 0 ? (
                    <button type="button" onClick={onAddQuestion}
                      className="sv-dashed w-full flex items-center justify-center gap-2 text-[12px]"
                      style={{ padding: 18, borderRadius: "var(--radius-md)" }}>
                      <Plus size={11} />Add first question
                    </button>
                  ) : (
                    t.questions.map((q, qi) => (
                      <QuestionRow key={qi} q={q} qi={qi}
                        onUpdate={(p) => onUpdateQuestion(qi, p)}
                        onRemove={() => onRemoveQuestion(qi)}
                        onDragStart={qDrag.handleDragStart}
                        onDragOver={qDrag.handleDragOver}
                        onDragEnd={qDrag.handleDragEnd}
                      />
                    ))
                  )}
                </>
              )}

              {/* Sub-topics */}
              {t.useSubTopics && (
                <>
                  {subTopics.length === 0 ? (
                    <button type="button" onClick={onAddSubTopic}
                      className="sv-dashed w-full flex items-center justify-center gap-2 text-[12px]"
                      style={{ padding: 18, borderRadius: "var(--radius-md)" }}>
                      <Layers size={11} />Add first sub-topic
                    </button>
                  ) : (
                    <>
                      {subTopics.map((st, si) => (
                        <SubTopicBlock key={st._key} st={st} si={si}
                          onUpdateName={(v) => onUpdateSubTopic(si, { name: v })}
                          onRemove={() => onRemoveSubTopic(si)}
                          onAddQuestion={() => onUpdateSubTopic(si, { questions: [...st.questions, emptyQuestion()] })}
                          onUpdateQuestion={(qi, p) => onUpdateSubTopic(si, { questions: st.questions.map((q, j) => j === qi ? { ...q, ...p } : q) })}
                          onRemoveQuestion={(qi) => onUpdateSubTopic(si, { questions: st.questions.filter((_, j) => j !== qi) })}
                          onReorderQuestions={(qs) => onUpdateSubTopic(si, { questions: qs })}
                          onDragStart={stDrag.handleDragStart}
                          onDragOver={stDrag.handleDragOver}
                          onDragEnd={stDrag.handleDragEnd}
                        />
                      ))}
                      <button type="button" onClick={onAddSubTopic}
                        className="sv-dashed w-full flex items-center justify-center gap-1.5 text-[11px]"
                        style={{ padding: 10, borderRadius: "var(--radius-md)", marginTop: 2 }}>
                        <Plus size={10} />Add another sub-topic
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}