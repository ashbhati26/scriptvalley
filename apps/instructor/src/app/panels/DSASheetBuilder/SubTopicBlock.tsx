"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { SubTopic, Question } from "./sheetTypes";
import { useDragSort } from "../shared/ui";
import QuestionRow from "./QuestionRow";

interface Props {
  st: SubTopic; si: number;
  onUpdateName: (v: string) => void;
  onRemove: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (qi: number, p: Partial<Question>) => void;
  onRemoveQuestion: (qi: number) => void;
  onReorderQuestions: (qs: Question[]) => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDragEnd: () => void;
}

export default function SubTopicBlock({
  st, si, onUpdateName, onRemove, onAddQuestion,
  onUpdateQuestion, onRemoveQuestion, onReorderQuestions,
  onDragStart, onDragOver, onDragEnd,
}: Props) {
  const [open,    setOpen]    = useState(true);
  const [hovered, setHovered] = useState(false);
  const qDrag = useDragSort(st.questions, onReorderQuestions);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(si)}
      onDragOver={(e) => onDragOver(e, si)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sv-rounded-md overflow-hidden"
      style={{ border: `1px solid ${hovered ? "var(--border-default)" : "var(--border-subtle)"}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sv-bg-hover"
        style={{ padding: "8px 12px", borderBottom: open ? "1px solid var(--border-subtle)" : "none" }}>
        <GripVertical size={10} className={`cursor-grab flex-shrink-0 ${hovered ? "sv-text-faint" : "sv-text-disabled"}`}
          onMouseDown={(e) => e.stopPropagation()} />

        <button type="button" onClick={() => setOpen((o) => !o)} onMouseDown={(e) => e.stopPropagation()}
          className="sv-btn-ghost p-0 flex items-center sv-text-disabled flex-shrink-0">
          <ChevronRight size={11} className={open ? "sv-text-muted" : "sv-text-disabled"}
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
        </button>

        <input value={st.name} onChange={(e) => onUpdateName(e.target.value)} placeholder="Sub-topic name"
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium sv-text-secondary"
          style={{ letterSpacing: "-0.005em", fontFamily: "var(--font-sans)" }} />

        <span className="text-[10px] font-medium sv-text-disabled sv-bg-active sv-rounded-full flex-shrink-0"
          style={{ padding: "2px 7px", border: "1px solid var(--border-subtle)" }}>
          {st.questions.length}q
        </span>

        <button type="button" onClick={(e) => { e.stopPropagation(); onAddQuestion(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="sv-btn-ghost flex items-center gap-0.5 text-[10px] sv-text-faint flex-shrink-0"
          style={{ padding: "2px 7px", borderRadius: "var(--radius-xs)" }}>
          <Plus size={9} /> Add Q
        </button>

        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="sv-btn-danger flex items-center flex-shrink-0" style={{ padding: 3, borderRadius: "var(--radius-xs)" }}>
          <Trash2 size={11} />
        </button>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.12 }} className="overflow-hidden">
            <div className="sv-bg-base" style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {st.questions.length === 0 ? (
                <button type="button" onClick={onAddQuestion}
                  className="sv-dashed w-full flex items-center justify-center gap-1.5 text-[11px]"
                  style={{ padding: 14, borderRadius: "var(--radius-sm)" }}>
                  <Plus size={10} /> Add first question
                </button>
              ) : (
                st.questions.map((q, qi) => (
                  <QuestionRow key={qi} q={q} qi={qi}
                    onUpdate={(p) => onUpdateQuestion(qi, p)}
                    onRemove={() => onRemoveQuestion(qi)}
                    onDragStart={qDrag.handleDragStart}
                    onDragOver={qDrag.handleDragOver}
                    onDragEnd={qDrag.handleDragEnd}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}