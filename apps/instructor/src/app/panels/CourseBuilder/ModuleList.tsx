"use client";
// ─── ModuleList.tsx ──────────────────────────────────────────────────────────

import { GripVertical, Trash2, ChevronRight, Plus, BookOpen } from "lucide-react";
import { Module, makeSlug, CourseTemplate } from "./courseTypes";
import { useDragSort } from "./CourseShared";

interface ModuleListProps {
  modules: Module[]; template: CourseTemplate; canEdit: boolean;
  onReorder: (next: Module[]) => void; onClickModule: (mod: Module) => void;
  onRemove: (key: string) => void; onAdd: () => void;
}

export function ModuleList({ modules, template, canEdit, onReorder, onClickModule, onRemove, onAdd }: ModuleListProps) {
  const drag = useDragSort(modules, onReorder);

  if (modules.length === 0) {
    return (
      <button onClick={canEdit ? onAdd : undefined}
        className="w-full flex flex-col items-center justify-center gap-1.5 sv-dashed sv-text-disabled"
        style={{ padding: "28px 24px", cursor: canEdit ? "pointer" : "default" }}>
        <BookOpen size={14} />
        <span className="text-[13px]">No modules yet — click to add one</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 2 }}>
      {modules.map((mod, idx) => {
        const lessonCount    = mod.lessons?.length          ?? 0;
        const mcqCount       = mod.mcqQuestions?.length     ?? 0;
        const challengeCount = mod.codingChallenges?.length ?? 0;
        const hasMiniProject = !!mod.miniProject?.title;

        return (
          <div key={mod._key} draggable={canEdit}
            onDragStart={() => drag.onDragStart(idx)} onDragOver={(e) => drag.onDragOver(e, idx)} onDragEnd={drag.onDragEnd}
            onClick={() => onClickModule(mod)}
            className="flex items-center gap-2 sv-bg-base sv-rounded-md cursor-pointer"
            style={{ padding: "9px 10px", border: "1px solid var(--border-subtle)", transition: "background 80ms, border-color 80ms" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-base)"; }}>
            {canEdit && <GripVertical size={11} className="sv-text-disabled cursor-grab flex-shrink-0" onClick={(e) => e.stopPropagation()} />}

            <span className="flex items-center justify-center flex-shrink-0 sv-bg-hover sv-rounded-sm"
              style={{ width: 22, height: 22, fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>
              {idx + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium sv-text-primary sv-truncate" style={{ letterSpacing: "-0.008em" }}>
                {mod.title || <span className="italic sv-text-disabled font-normal">Untitled module</span>}
              </p>
              <div className="flex items-center gap-1.5 mt-px flex-wrap">
                <p className="text-[10px] sv-text-disabled" style={{ fontFamily: "var(--font-mono)" }}>
                  /{makeSlug(mod.title) || mod.slug}
                </p>
                {template === "structured" ? (
                  <>
                    {lessonCount    > 0 && <span className="text-[10px] font-medium sv-text-brand">{lessonCount}L</span>}
                    {mcqCount       > 0 && <span className="text-[10px] font-medium sv-text-warning">{mcqCount} MCQ</span>}
                    {challengeCount > 0 && <span className="text-[10px] font-medium" style={{ color: "var(--brand-hover)" }}>{challengeCount}C</span>}
                    {hasMiniProject     && <span className="text-[10px] font-medium sv-text-success">mini project</span>}
                    {!lessonCount && !mcqCount && !challengeCount && !hasMiniProject && (
                      <span className="text-[10px] sv-text-disabled italic">empty</span>
                    )}
                  </>
                ) : (
                  mod.content
                    ? <span className="text-[10px] font-medium sv-text-brand">● content</span>
                    : <span className="text-[10px] sv-text-disabled italic">no content</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {canEdit && (
                <button onClick={() => onRemove(mod._key)}
                  className="flex items-center justify-center sv-text-faint bg-transparent border-none cursor-pointer sv-rounded-xs"
                  style={{ width: 24, height: 24, transition: "color 80ms, background 80ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Trash2 size={11} />
                </button>
              )}
              <ChevronRight size={11} className="sv-text-disabled" />
            </div>
          </div>
        );
      })}

      {canEdit && (
        <button onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 sv-dashed text-[12px] sv-text-disabled"
          style={{ padding: 8, borderRadius: "var(--radius-md)", marginTop: 2 }}>
          <Plus size={11} />Add another module
        </button>
      )}
    </div>
  );
}

export default ModuleList;