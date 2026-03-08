"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { X, Lock, Globe, Check } from "lucide-react";
import toast from "react-hot-toast";

function ShareSnippetDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useCodeEditorStore();
  const createSnippet = useMutation(api.snippets.createSnippet);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);
    try {
      const code = getCode();
      await createSnippet({ title, language, code, isPrivate });
      onClose();
      setTitle("");
      setIsPrivate(false);
      toast.success(`Snippet ${isPrivate ? "saved privately" : "shared publicly"}`);
    } catch (error) {
      console.error("Error creating snippet:", error);
      toast.error("Error creating snippet");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Snippet</p>
            <h2 className="text-sm font-medium text-[var(--text-primary)] leading-tight">Save Snippet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleShare} className="p-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter snippet title…"
              required
              className="w-full h-8 px-3 bg-[var(--bg-input)] border border-transparent rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none focus:border-[#3A5EFF]/30 transition-colors duration-100"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">
              Visibility
            </label>
            <div className="space-y-1.5">
              {[
                { value: false, icon: Globe, label: "Public",  desc: "Share with the community" },
                { value: true,  icon: Lock,  label: "Private", desc: "Only visible to you"      },
              ].map(({ value, icon: Icon, label, desc }) => {
                const isSelected = isPrivate === value;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setIsPrivate(value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors duration-100 ${
                      isSelected
                        ? "bg-[var(--bg-hover)] border-[var(--border-medium)]"
                        : "bg-transparent border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[var(--text-secondary)]">{label}</div>
                      <div className="text-[10px] text-[var(--text-faint)]">{desc}</div>
                    </div>
                    {isSelected && <Check className="w-3 h-3 text-[#3A5EFF] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-8 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors duration-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSharing}
              className="flex-1 h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#3A5EFF] hover:bg-[#4a6aff] rounded-md transition-colors duration-100 disabled:opacity-40"
            >
              {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {isSharing ? "Saving…" : isPrivate ? "Save Private" : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareSnippetDialog;