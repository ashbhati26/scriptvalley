"use client";

import { Search, StickyNote, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  questionTitle: string;
  notes?: string;
}

interface NotesSidebarProps {
  notes: Note[];
  filteredNotes: Note[];
  selectedTitle: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (title: string) => void;
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  mobileTopbarOnly?: boolean;
  desktopOnly?: boolean;
}

function NoteList({
  filteredNotes,
  allCount,
  selectedTitle,
  search,
  onSearchChange,
  onSelect,
}: {
  filteredNotes: Note[];
  allCount: number;
  selectedTitle: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (title: string) => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)] pointer-events-none" />
          <input
            placeholder="Search notes…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 bg-[var(--bg-input)] border border-transparent rounded-md pl-8 pr-3 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-faint)] outline-none focus:bg-[var(--bg-hover)] focus:border-[var(--border-medium)] transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide px-1.5 pb-2">
        <div className="space-y-px">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-[var(--text-disabled)]">
              <StickyNote className="w-5 h-5" />
              <span className="text-xs">No notes found</span>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const active = selectedTitle === note.questionTitle;
              return (
                <motion.button
                  key={note.questionTitle}
                  onClick={() => onSelect(note.questionTitle)}
                  className={`group w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors duration-100 ${
                    active
                      ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span className="truncate block">{note.questionTitle}</span>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
        <p className="text-[10px] text-[var(--text-disabled)] uppercase tracking-widest">
          {allCount} {allCount === 1 ? "note" : "notes"}
        </p>
      </div>
    </div>
  );
}

export default function NotesSidebar({
  notes,
  filteredNotes,
  selectedTitle,
  search,
  onSearchChange,
  onSelect,
  mobileOpen,
  onMobileOpen,
  onMobileClose,
  mobileTopbarOnly = false,
  desktopOnly = false,
}: NotesSidebarProps) {
  const handleSelect = (title: string) => {
    onSelect(title);
    onMobileClose();
  };

  if (mobileTopbarOnly) {
    return (
      <>
        {/* Mobile sticky topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] sticky top-0 z-30 bg-[var(--bg-base)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileOpen}
              className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-[var(--text-primary)]">Notes</h2>
          </div>
          <span className="text-sm text-[var(--text-faint)] truncate max-w-[160px]">
            {selectedTitle ?? "Select a note"}
          </span>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onMobileClose}
              />
              <motion.aside
                className="fixed top-0 left-0 z-50 h-full w-72 bg-[var(--bg-base)] border-r border-[var(--border-subtle)] flex flex-col overflow-hidden md:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                aria-label="Mobile notes sidebar"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Your Notes</span>
                  <button
                    onClick={onMobileClose}
                    className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <NoteList
                  filteredNotes={filteredNotes}
                  allCount={notes.length}
                  selectedTitle={selectedTitle}
                  search={search}
                  onSearchChange={onSearchChange}
                  onSelect={handleSelect}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (desktopOnly) {
    return (
      <aside className="hidden md:block md:col-span-4 lg:col-span-3">
        <div className="rounded-lg border border-[var(--border-subtle)] h-[82vh] flex flex-col bg-[var(--bg-base)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Your Notes</h3>
          </div>
          <NoteList
            filteredNotes={filteredNotes}
            allCount={notes.length}
            selectedTitle={selectedTitle}
            search={search}
            onSearchChange={onSearchChange}
            onSelect={onSelect}
          />
        </div>
      </aside>
    );
  }

  return null;
}