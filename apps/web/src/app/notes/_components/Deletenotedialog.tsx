"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTitle: string | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

export default function DeleteNoteDialog({
  open,
  onOpenChange,
  selectedTitle,
  isDeleting,
  onConfirm,
}: DeleteNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/[0.08] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400/80" />
            </div>
            <DialogTitle className="text-[var(--text-primary)] text-sm font-medium">
              Delete Note
            </DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-[var(--text-muted)]">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>

        <div className="mt-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] px-4 py-3">
          <p className="text-sm text-[var(--text-secondary)] truncate">{selectedTitle}</p>
        </div>

        <DialogFooter className="flex gap-2 justify-end mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md px-4 py-2 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/[0.06] hover:bg-red-500/[0.12] border border-red-500/[0.15] rounded-md px-4 py-2 transition-all disabled:opacity-40 font-medium"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}