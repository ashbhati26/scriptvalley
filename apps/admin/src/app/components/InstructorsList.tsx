"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Mail, Clock, Users, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type Tab = "pending" | "approved";

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs > 0) return `${hrs}h ago`;
  return "just now";
}

export default function InstructorsList() {
  const [tab, setTab] = useState<Tab>("pending");

  const all     = useQuery(api.instructors.getAllInstructors);
  const approve = useMutation(api.instructors.approveInstructor);
  const revoke  = useMutation(api.instructors.revokeInstructor);
  const remove  = useMutation(api.instructors.deleteInstructor);

  const pending  = all?.filter((i) => !i.isApproved) ?? [];
  const approved = all?.filter((i) =>  i.isApproved) ?? [];
  const shown    = tab === "pending" ? pending : approved;

  async function handleApprove(id: Id<"instructors">, name: string) {
    try { await approve({ instructorId: id }); toast.success(`${name} approved`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function handleRevoke(id: Id<"instructors">, name: string) {
    if (!confirm(`Revoke instructor access for ${name}?`)) return;
    try { await revoke({ instructorId: id }); toast.success(`${name} revoked`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function handleDelete(id: Id<"instructors">, name: string) {
    if (!confirm(`Delete application from ${name}?`)) return;
    try { await remove({ instructorId: id }); toast.success("Application deleted"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Instructor Platform</p>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Instructors</h2>
        <p className="text-sm text-text-faint">Review applications and manage instructor access.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Pending",  value: pending.length,  color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
          { label: "Approved", value: approved.length, color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.2)"   },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className="rounded-lg border p-4" style={{ background: bg, borderColor: border }}>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-text-faint mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-px border-b border-border-subtle">
        {(["pending", "approved"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`relative px-4 py-2 text-sm transition-colors capitalize ${tab === t ? "text-text-primary" : "text-text-faint hover:text-text-muted"}`}
          >
            {tab === t && <motion.span layoutId="instructorTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />}
            {t} <span className="ml-1 text-[10px] text-text-disabled">({t === "pending" ? pending.length : approved.length})</span>
          </button>
        ))}
      </div>

      {all === undefined ? (
        <div className="flex justify-center py-12">
          <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-text-disabled">
          <Users className="w-7 h-7" />
          <p className="text-sm">No {tab} instructors</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border-subtle overflow-hidden">
          <AnimatePresence initial={false}>
            {shown.map((inst, idx) => (
              <motion.div key={String(inst._id)}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.14, delay: idx * 0.03 }}
                className={`group flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 hover:bg-bg-hover transition-colors ${idx > 0 ? "border-t border-border-subtle" : ""}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-bg-hover border border-border-subtle flex items-center justify-center shrink-0 text-[11px] font-bold text-text-faint">
                    {getInitials(inst.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-secondary truncate">{inst.name || "—"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-text-disabled shrink-0" />
                      <span className="text-xs text-text-faint truncate">{inst.email || "—"}</span>
                    </div>
                    {inst.bio && <p className="text-xs text-text-disabled mt-1 line-clamp-2">{inst.bio}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-text-disabled shrink-0">
                  <Clock className="w-3 h-3" />
                  {tab === "pending" ? `Applied ${timeAgo(inst.appliedAt)}` : `Approved ${inst.approvedAt ? timeAgo(inst.approvedAt) : "—"}`}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {tab === "pending" ? (
                    <>
                      <button onClick={() => handleApprove(inst._id, inst.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.18)] border border-[rgba(34,197,94,0.25)] text-[#22c55e] text-xs font-medium transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handleDelete(inst._id, inst.name)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 text-xs transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleRevoke(inst._id, inst.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 border border-transparent hover:border-red-500/20 text-xs transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Revoke
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}