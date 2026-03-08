"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotesPageSkeleton from "./_components/NotesPageSkeleton";
import NotesSidebar from "./_components/Notessidebar";
import NoteViewer from "./_components/Noteviewer";
import DeleteNoteDialog from "./_components/Deletenotedialog";
import { AnimatePresence } from "framer-motion";

function NotesContent() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [selectedTitle,   setSelectedTitle]   = useState<string | null>(null);
  const [editMode,        setEditMode]         = useState(false);
  const [editedContent,   setEditedContent]    = useState("");
  const [mobileOpen,      setMobileOpen]       = useState(false);
  const [search,          setSearch]           = useState("");
  const [deleteModalOpen, setDeleteModalOpen]  = useState(false);
  const [isDeleting,      setIsDeleting]       = useState(false);

  const allNotes   = useQuery(api.notes.getAllUserNotes, userId ? { userId } : "skip");
  const upsertNote = useMutation(api.notes.upsertNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const selectedNote = allNotes?.find((n) => n.questionTitle === selectedTitle);

  useEffect(() => {
    if (!selectedTitle && allNotes && allNotes.length > 0) {
      setSelectedTitle(allNotes[0].questionTitle);
    }
  }, [allNotes, selectedTitle]);

  useEffect(() => {
    if (selectedNote) setEditedContent(selectedNote.notes || "");
  }, [selectedNote]);

  const handleSelect = (title: string) => {
    setSelectedTitle(title);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!selectedTitle || !userId) return;
    try {
      await upsertNote({ userId, questionTitle: selectedTitle, notes: editedContent });
      toast.success("Note saved!");
      setEditMode(false);
    } catch {
      toast.error("Failed to save note.");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedTitle || !userId) return;
    setIsDeleting(true);
    try {
      await deleteNote({ userId, questionTitle: selectedTitle });
      toast.success("Note deleted!");
      setSelectedTitle(null);
      setEditMode(false);
      setDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!allNotes || !user) return <NotesPageSkeleton />;

  const filteredNotes = allNotes.filter((n) =>
    n.questionTitle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen mt-12 bg-[var(--bg-base)]">
      <NotesSidebar
        notes={allNotes}
        filteredNotes={filteredNotes}
        selectedTitle={selectedTitle}
        search={search}
        onSearchChange={setSearch}
        onSelect={handleSelect}
        mobileOpen={mobileOpen}
        onMobileOpen={() => setMobileOpen(true)}
        onMobileClose={() => setMobileOpen(false)}
        mobileTopbarOnly
      />

      <div className="grid grid-cols-12 gap-4 md:p-5 p-0 h-screen scrollbar-hide">
        <NotesSidebar
          notes={allNotes}
          filteredNotes={filteredNotes}
          selectedTitle={selectedTitle}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelect}
          mobileOpen={mobileOpen}
          onMobileOpen={() => setMobileOpen(true)}
          onMobileClose={() => setMobileOpen(false)}
          desktopOnly
        />

        <main className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="rounded-none border-0 md:rounded-lg md:border md:border-[var(--border-subtle)] h-[82vh] overflow-auto bg-[var(--bg-base)] flex flex-col">
            <AnimatePresence mode="wait">
              <NoteViewer
                selectedNote={selectedNote}
                editMode={editMode}
                editedContent={editedContent}
                onEditStart={() => {
                  setEditedContent(selectedNote?.notes || "");
                  setEditMode(true);
                }}
                onEditCancel={() => setEditMode(false)}
                onContentChange={setEditedContent}
                onSave={handleSave}
                onDeleteClick={() => setDeleteModalOpen(true)}
              />
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DeleteNoteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        selectedTitle={selectedTitle}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <NotesContent />
    </ProtectedRoute>
  );
}