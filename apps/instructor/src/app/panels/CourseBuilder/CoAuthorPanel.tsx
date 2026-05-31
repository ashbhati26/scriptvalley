"use client";
// ─── CoAuthorPanel.tsx ───────────────────────────────────────────────────────

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Mail, UserMinus, ChevronDown, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface CoAuthor { userId: string; name: string; email: string; }
interface Props { courseId: string; coAuthors: CoAuthor[]; onChange: (coAuthors: CoAuthor[]) => void; }

export default function CoAuthorPanel({ courseId, coAuthors, onChange }: Props) {
  const [open,       setOpen]       = useState(false);
  const [email,      setEmail]      = useState("");
  const [busy,       setBusy]       = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const addCoAuthor    = useMutation(api.courses.addCoAuthor);
  const removeCoAuthor = useMutation(api.courses.removeCoAuthor);

  async function handleAdd() {
    if (!email.trim() || !email.includes("@")) { toast.error("Enter a valid email address"); return; }
    setBusy(true);
    try { await addCoAuthor({ courseId: courseId as Id<"courses">, email: email.trim() }); toast.success("Co-author added"); setEmail(""); }
    catch (e: any) { toast.error(e?.message ?? "Failed to add co-author"); }
    finally { setBusy(false); }
  }

  async function handleConfirmRemove(userId: string, name: string) {
    try { await removeCoAuthor({ courseId: courseId as Id<"courses">, userId }); onChange(coAuthors.filter((a) => a.userId !== userId)); toast.success(`${name} removed`); }
    catch (e: any) { toast.error(e?.message ?? "Failed to remove co-author"); }
    finally { setRemovingId(null); }
  }

  return (
    <div className="sv-card overflow-hidden">
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between sv-btn-ghost"
        style={{ padding: "10px 14px" }}>
        <div className="flex items-center gap-2">
          <Users size={13} className="sv-text-faint" />
          <span className="text-[13px] font-medium sv-text-secondary" style={{ letterSpacing: "-0.008em" }}>Co-authors</span>
          {coAuthors.length > 0 && (
            <span className="text-[10px] sv-text-disabled sv-bg-hover sv-rounded-xs" style={{ padding: "1px 6px", border: "1px solid var(--border-subtle)" }}>
              {coAuthors.length}
            </span>
          )}
        </div>
        <ChevronDown size={12} className="sv-text-faint" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--border-subtle)" }}>

              {/* Add input */}
              <div className="flex gap-1.5" style={{ marginBottom: 10 }}>
                <div className="flex items-center gap-1.5 flex-1 sv-bg-input sv-rounded-md" style={{ padding: "0 10px", height: 32, border: "1px solid var(--border-default)" }}>
                  <Mail size={11} className="sv-text-faint flex-shrink-0" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="co-author@email.com"
                    className="flex-1 bg-transparent border-none outline-none text-[13px] sv-text-primary h-full"
                    style={{ letterSpacing: "-0.006em", fontFamily: "var(--font-sans)" }} />
                </div>
                <button onClick={handleAdd} disabled={busy || !email.trim()}
                  className={`sv-btn-primary flex items-center gap-1 text-[12px] flex-shrink-0 sv-rounded-md ${(busy || !email.trim()) ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{ padding: "0 10px", height: 32 }}>
                  <Plus size={11} />Add
                </button>
              </div>

              {/* Author list */}
              {coAuthors.length === 0 ? (
                <p className="text-[12px] sv-text-disabled italic text-center" style={{ padding: "10px 0" }}>No co-authors yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {coAuthors.map((author) => {
                    const isPending = removingId === author.userId;
                    return (
                      <div key={author.userId} className="flex items-center gap-2 sv-rounded-md"
                        style={{ padding: "8px 10px", border: `1px solid ${isPending ? "var(--danger-border)" : "var(--border-subtle)"}`, background: isPending ? "var(--danger-bg)" : "var(--bg-hover)", transition: "border-color 120ms, background 120ms" }}>
                        <div className="flex items-center justify-center text-[11px] font-semibold sv-text-brand flex-shrink-0 sv-rounded-full"
                          style={{ width: 26, height: 26, background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-medium sv-truncate ${isPending ? "sv-text-danger" : "sv-text-primary"}`}>{author.name}</p>
                          <p className={`text-[10px] sv-truncate ${isPending ? "sv-text-danger opacity-75" : "sv-text-faint"}`}>
                            {isPending ? "Remove this co-author?" : author.email}
                          </p>
                        </div>
                        {isPending ? (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handleConfirmRemove(author.userId, author.name)}
                              className="flex items-center gap-0.5 text-[11px] font-medium text-white sv-rounded-xs cursor-pointer"
                              style={{ padding: "2px 8px", background: "var(--danger)", border: "none" }}>
                              <Check size={10} />Remove
                            </button>
                            <button onClick={() => setRemovingId(null)}
                              className="text-[11px] sv-text-muted sv-bg-elevated sv-rounded-xs cursor-pointer"
                              style={{ padding: "2px 6px", border: "1px solid var(--border-default)" }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setRemovingId(author.userId)} title={`Remove ${author.name}`} className="sv-btn-danger flex items-center flex-shrink-0" style={{ padding: 3 }}>
                            <UserMinus size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] sv-text-disabled" style={{ marginTop: 10 }}>Co-authors can edit but cannot publish or delete.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}