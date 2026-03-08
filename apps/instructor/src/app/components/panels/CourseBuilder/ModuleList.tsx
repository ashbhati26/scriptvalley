"use client";

import { GripVertical, Trash2, ChevronRight, Plus, BookOpen } from "lucide-react";
import { Module, makeSlug } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface Props {
  modules:       Module[];
  canEdit:       boolean;
  onReorder:     (next: Module[]) => void;
  onClickModule: (mod: Module) => void;
  onRemove:      (key: string) => void;
  onAdd:         () => void;
}

export default function ModuleList({
  modules, canEdit, onReorder, onClickModule, onRemove, onAdd,
}: Props) {
  const drag = useDragSort(modules, onReorder);

  if (modules.length === 0) {
    return (
      <button
        onClick={canEdit ? onAdd : undefined}
        className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
      >
        <BookOpen className="w-6 h-6" />
        <span className="text-sm">No modules yet — click to add one</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {modules.map((mod, idx) => (
        <div
          key={mod._key}
          draggable={canEdit}
          onDragStart={() => drag.onDragStart(idx)}
          onDragOver={(e) => drag.onDragOver(e, idx)}
          onDragEnd={drag.onDragEnd}
          className="group flex items-center gap-3 px-3 py-3 rounded-lg border border-(--border-subtle) bg-(--bg-elevated) hover:border-(--border-medium) transition-colors cursor-pointer"
          onClick={() => onClickModule(mod)}
        >
          {canEdit && (
            <GripVertical
              className="w-3.5 h-3.5 text-(--text-disabled) shrink-0 cursor-grab"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <span className="w-6 h-6 rounded-md bg-(--bg-hover) flex items-center justify-center text-[10px] font-bold text-(--text-muted) shrink-0">
            {idx + 1}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) truncate transition-colors">
              {mod.title || (
                <span className="text-(--text-disabled) italic font-normal">Untitled module</span>
              )}
            </p>
            <p className="text-[10px] font-mono text-(--text-disabled) mt-0.5">
              /{makeSlug(mod.title) || mod.slug}
              {mod.content
                ? <span className="ml-2 text-(--brand)">● has content</span>
                : ""}
            </p>
          </div>

          <div
            className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {canEdit && (
              <button
                onClick={() => onRemove(mod._key)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            <ChevronRight className="w-4 h-4 text-(--text-faint)" />
          </div>
        </div>
      ))}

      {canEdit && (
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-(--border-subtle) text-xs text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />Add another module
        </button>
      )}
    </div>
  );
}