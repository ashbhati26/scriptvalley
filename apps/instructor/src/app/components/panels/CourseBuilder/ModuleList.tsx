"use client";

import { GripVertical, Trash2, ChevronRight, Plus, BookOpen } from "lucide-react";
import { Module, makeSlug, CourseTemplate } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  modules:       Module[];
  template:      CourseTemplate;
  canEdit:       boolean;
  onReorder:     (next: Module[]) => void;
  onClickModule: (mod: Module) => void;
  onRemove:      (key: string) => void;
  onAdd:         () => void;
}

export default function ModuleList({ modules, template, canEdit, onReorder, onClickModule, onRemove, onAdd }: Props) {
  const drag = useDragSort(modules, onReorder);

  if (modules.length === 0) {
    return (
      <button onClick={canEdit ? onAdd : undefined}
        className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
      >
        <BookOpen className="w-6 h-6" />
        <span className="text-sm">No modules yet — click to add one</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {modules.map((mod, idx) => {
        const lessonCount    = mod.lessons?.length          ?? 0;
        const mcqCount       = mod.mcqQuestions?.length     ?? 0;
        const challengeCount = mod.codingChallenges?.length ?? 0;
        const hasMiniProject = !!mod.miniProject?.title;

        return (
          <div key={mod._key}
            draggable={canEdit}
            onDragStart={() => drag.onDragStart(idx)}
            onDragOver={(e) => drag.onDragOver(e, idx)}
            onDragEnd={drag.onDragEnd}
            onClick={() => onClickModule(mod)}
            className="group flex items-center gap-3 px-3 py-3 rounded-lg border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) transition-colors cursor-pointer"
          >
            {canEdit && (
              <GripVertical className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 cursor-grab" onClick={(e) => e.stopPropagation()} />
            )}
            <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0">
              {idx + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) truncate transition-colors">
                {mod.title || <span className="italic font-normal text-(--text-disabled)">Untitled module</span>}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-[10px] font-mono text-(--text-disabled)">/{makeSlug(mod.title) || mod.slug}</p>
                {template === "structured" ? (
                  <>
                    {lessonCount > 0    && <span className="text-[9px] text-(--brand) font-medium">{lessonCount} lesson{lessonCount !== 1 ? "s" : ""}</span>}
                    {mcqCount > 0       && <span className="text-[9px] text-amber-500 font-medium">{mcqCount} MCQ{mcqCount !== 1 ? "s" : ""}</span>}
                    {challengeCount > 0 && <span className="text-[9px] text-cyan-500 font-medium">{challengeCount} challenge{challengeCount !== 1 ? "s" : ""}</span>}
                    {hasMiniProject     && <span className="text-[9px] text-purple-400 font-medium">mini project</span>}
                    {lessonCount === 0 && mcqCount === 0 && challengeCount === 0 && !hasMiniProject && (
                      <span className="text-[9px] text-(--text-disabled) italic">empty</span>
                    )}
                  </>
                ) : (
                  mod.content
                    ? <span className="text-[9px] text-(--brand) font-medium">● has content</span>
                    : <span className="text-[9px] text-(--text-disabled) italic">no content</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              {canEdit && (
                <button onClick={() => onRemove(mod._key)} className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <ChevronRight className="w-4 h-4 text-(--text-faint)" />
            </div>
          </div>
        );
      })}

      {canEdit && (
        <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors">
          <Plus className="w-3.5 h-3.5" />Add another module
        </button>
      )}
    </div>
  );
}