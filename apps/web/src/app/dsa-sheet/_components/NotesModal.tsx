"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Save } from "lucide-react";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteContent: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  initialNotes: string;
  questionTitle: string;
  isSaving: boolean;
}

export default function NotesModal({
  isOpen, onClose, onSave, onDelete,
  initialNotes, questionTitle, isSaving,
}: NotesModalProps) {
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (isOpen) setNoteContent(initialNotes || "");
  }, [isOpen, initialNotes]);

  const handleSave   = () => onSave(noteContent);
  const handleDelete = async () => { if (onDelete) await onDelete(); onClose(); };
  const isEditing    = Boolean(initialNotes?.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-[var(--bg-base)] border-l border-[var(--border-subtle)] flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">Notes</p>
                <h2 className="text-sm font-medium text-[var(--text-primary)] truncate">{questionTitle}</h2>
              </div>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100 disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-auto p-5 space-y-4">
              {/* Question label (readonly) */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1.5">Question</p>
                <div className="h-8 flex items-center px-3 rounded-md bg-[var(--bg-input)] text-xs text-[var(--text-disabled)] font-mono truncate">
                  {questionTitle}
                </div>
              </div>

              {/* Note textarea */}
              <div className="flex flex-col flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1.5">Content</p>
                <textarea
                  className="flex-1 min-h-[260px] md:min-h-[340px] px-3 py-3 rounded-md bg-[var(--bg-input)] border border-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none resize-none leading-relaxed focus:border-[var(--border-medium)] transition-colors duration-100"
                  placeholder="Write your approach, edge cases, patterns, or key ideas…"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
                  }}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[10px] text-[var(--text-disabled)]">
                    Ctrl + Enter to {isEditing ? "update" : "save"}
                  </p>
                  <span className="text-[10px] text-[var(--text-disabled)]">{noteContent.length} chars</span>
                </div>
              </div>
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
              {isEditing && onDelete ? (
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--text-faint)] hover:text-red-400/70 hover:bg-red-500/[0.06] transition-colors duration-100 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />Delete Note
                </button>
              ) : (
                <div />
              )}

              {/* Save — brand primary action, intentionally hardcoded */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-xs font-medium transition-colors duration-100 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving…" : isEditing ? "Update" : "Save"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}