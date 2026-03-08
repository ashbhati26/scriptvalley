"use client";

import { SquarePen, Trash2, Save, X, StickyNote, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotesEditor from "./NotesEditor";

interface Note {
  questionTitle: string;
  notes?: string;
}

interface NoteViewerProps {
  selectedNote: Note | undefined;
  editMode: boolean;
  editedContent: string;
  onEditStart: () => void;
  onEditCancel: () => void;
  onContentChange: (html: string) => void;
  onSave: () => void;
  onDeleteClick: () => void;
}

export default function NoteViewer({
  selectedNote,
  editMode,
  editedContent,
  onEditStart,
  onEditCancel,
  onContentChange,
  onSave,
  onDeleteClick,
}: NoteViewerProps) {
  if (!selectedNote) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text-disabled)]"
      >
        <div className="w-12 h-12 rounded-xl bg-[var(--bg-input)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[var(--text-faint)]" />
        </div>
        <p className="text-sm text-[var(--text-faint)]">Select a note to view it</p>
        <p className="text-xs text-[var(--text-disabled)]">Your notes will appear here</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={selectedNote.questionTitle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="flex-1 flex flex-col min-h-0 h-full"
    >
      {/* Note header */}
      <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">Note</p>
          <h1 className="text-base font-medium text-[var(--text-primary)] truncate">
            {selectedNote.questionTitle}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!editMode ? (
            <>
              <button
                onClick={onEditStart}
                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md px-3 py-1.5 transition-all"
              >
                <SquarePen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={onDeleteClick}
                className="flex items-center gap-1.5 text-xs text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.06] rounded-md px-3 py-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          ) : (
            <>
              {/* Save — brand primary action, hardcoded intentionally */}
              <button
                onClick={onSave}
                className="flex items-center gap-1.5 text-xs text-white bg-[#3A5EFF] hover:bg-[#4a6aff] rounded-md px-3 py-1.5 transition-all font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={onEditCancel}
                className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md px-3 py-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Note body */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="h-full overflow-auto scrollbar-hide"
            >
              <NotesEditor content={editedContent} onChange={onContentChange} />
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="px-7 md:px-14 py-8 overflow-auto scrollbar-hide h-full w-full"
            >
              {selectedNote.notes ? (
                <div
                  className="prose prose-invert max-w-none text-sm text-[var(--text-secondary)] leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)] [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:tracking-tight
                    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-7 [&_h2]:mb-2.5
                    [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-secondary)] [&_h3]:mt-5 [&_h3]:mb-1.5
                    [&_p]:text-[var(--text-secondary)] [&_p]:my-1.5 [&_p]:leading-7
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5
                    [&_li]:my-0.5 [&_li]:text-[var(--text-secondary)]
                    [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-[var(--text-muted)] [&_blockquote]:italic
                    [&_code]:bg-[var(--bg-input)] [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono
                    [&_pre]:bg-[var(--bg-elevated)] [&_pre]:border [&_pre]:border-[var(--border-subtle)] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto
                    [&_pre_code]:bg-transparent [&_pre_code]:text-[var(--text-faint)] [&_pre_code]:p-0
                    [&_a]:text-[#3A5EFF] [&_a]:no-underline [&_a]:hover:underline
                    [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
                    [&_td]:border [&_td]:border-[var(--border-subtle)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-[var(--text-secondary)]
                    [&_th]:border [&_th]:border-[var(--border-subtle)] [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[var(--bg-input)] [&_th]:text-xs [&_th]:font-semibold [&_th]:text-[var(--text-muted)]
                    [&_hr]:border-[var(--border-subtle)] [&_hr]:my-6
                    [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0
                    [&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2 [&_li[data-type=taskItem]]:my-1
                    [&_li[data-type=taskItem]>label>input]:accent-[#3A5EFF]
                    [&_li[data-type=taskItem][data-checked=true]>div]:line-through [&_li[data-type=taskItem][data-checked=true]>div]:text-[var(--text-disabled)]"
                  dangerouslySetInnerHTML={{ __html: selectedNote.notes }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--text-disabled)]">
                  <StickyNote className="w-7 h-7" />
                  <p className="text-sm text-[var(--text-faint)]">No content yet</p>
                  <button
                    onClick={onEditStart}
                    className="text-xs text-[#3A5EFF] hover:underline mt-1"
                  >
                    Start writing
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}