"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, AlertTriangle } from "lucide-react";

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  onConfirm: () => void;
  loading:   boolean;
  type:      "course" | "module";
  name:      string;
}

export default function ResetProgressModal({
  isOpen, onClose, onConfirm, loading, type, name,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="reset-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="reset-modal"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0,   scale: 0.97, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm pointer-events-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Reset {type === "course" ? "course" : "module"} progress
                    </p>
                    <p className="text-xs text-[var(--text-faint)] mt-0.5 line-clamp-1">
                      {name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--bg-hover)] transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-[var(--text-faint)] leading-relaxed">
                  All completed lessons in{" "}
                  <span className="text-[var(--text-secondary)] font-medium">{name}</span>{" "}
                  will be marked as incomplete. This cannot be undone.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <RotateCcw className="w-3.5 h-3.5" />
                    }
                    {loading ? "Resetting…" : "Reset progress"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}