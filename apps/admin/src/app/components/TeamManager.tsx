"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Shield, Plus, Trash2, Mail,
  Clock, CheckCircle2, XCircle, UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type Tab = "instructors" | "admins";

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0)  return `${days}d ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs > 0)   return `${hrs}h ago`;
  return "just now";
}

function AddUserForm({
  placeholder, buttonLabel, onAdd, loading,
}: {
  placeholder: string;
  buttonLabel: string;
  onAdd: (email: string) => Promise<void>;
  loading?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [busy,  setBusy]  = useState(false);

  async function handleSubmit() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) { toast.error("Enter a valid email address"); return; }
    setBusy(true);
    try { await onAdd(trimmed); setEmail(""); } finally { setBusy(false); }
  }

  return (
    <div className="flex gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        className="flex-1 h-9 bg-bg-input border border-border-subtle rounded-md px-3 text-sm text-text-secondary placeholder:text-text-disabled outline-none focus:border-brand-border transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={busy || loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors shrink-0"
      >
        {busy ? (
          <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
        {buttonLabel}
      </button>
    </div>
  );
}

function InstructorsTab() {
  const all        = useQuery(api.instructors.getAllInstructors);
  const addByEmail = useMutation(api.instructors.addInstructorByEmail);
  const approve    = useMutation(api.instructors.approveInstructor);
  const revoke     = useMutation(api.instructors.revokeInstructor);
  const remove     = useMutation(api.instructors.deleteInstructor);

  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  const pending  = all?.filter((i) => !i.isApproved) ?? [];
  const approved = all?.filter((i) =>  i.isApproved) ?? [];
  const shown    =
    filter === "all"      ? (all ?? []) :
    filter === "approved" ? approved    :
    pending;

  async function handleAdd(email: string) {
    try { await addByEmail({ email }); toast.success(`${email} added as instructor`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to add"); }
  }
  async function handleApprove(id: Id<"instructors">, name: string) {
    try { await approve({ instructorId: id }); toast.success(`${name} approved`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function handleRevoke(id: Id<"instructors">, name: string) {
    if (!confirm(`Revoke instructor access for ${name}?`)) return;
    try { await revoke({ instructorId: id }); toast.success(`${name} revoked`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function handleRemove(id: Id<"instructors">, name: string) {
    if (!confirm(`Remove ${name} from instructors entirely?`)) return;
    try { await remove({ instructorId: id }); toast.success(`${name} removed`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: (all?.length ?? 0), color: "#3A5EFF", bg: "rgba(58,94,255,0.08)",  border: "rgba(58,94,255,0.2)"  },
          { label: "Approved", value: approved.length,    color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)"  },
          { label: "Pending",  value: pending.length,     color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className="rounded-lg border p-3" style={{ background: bg, borderColor: border }}>
            <p className="text-xl font-bold" style={{ color }}>{all === undefined ? "—" : value}</p>
            <p className="text-[10px] text-text-faint mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Add by email */}
      <div className="rounded-lg border border-border-subtle bg-bg-elevated p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-0.5">Add instructor directly</p>
          <p className="text-[11px] text-text-faint">Bypasses the application flow — user gets instructor access immediately.</p>
        </div>
        <AddUserForm placeholder="instructor@email.com" buttonLabel="Add Instructor" onAdd={handleAdd} loading={all === undefined} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-px border-b border-border-subtle">
        {(["all", "approved", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-2 text-sm transition-colors capitalize ${
              filter === f ? "text-text-primary" : "text-text-faint hover:text-text-muted"
            }`}
          >
            {filter === f && (
              <motion.span layoutId="instrFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
            )}
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {all === undefined ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Empty label={`${filter === "all" ? "" : filter} instructors`} Icon={Users} />
      ) : (
        <div className="rounded-lg border border-border-subtle overflow-hidden">
          <AnimatePresence initial={false}>
            {shown.map((inst, idx) => (
              <motion.div
                key={String(inst._id)}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.13, delay: idx * 0.025 }}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 hover:bg-bg-hover transition-colors ${
                  idx > 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-bg-hover border border-border-subtle flex items-center justify-center shrink-0 text-[11px] font-bold text-text-faint">
                    {getInitials(inst.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-secondary truncate">{inst.name || "—"}</p>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0"
                        style={
                          inst.isApproved
                            ? { color: "#22c55e", background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }
                            : { color: "#f59e0b", background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }
                        }
                      >
                        {inst.isApproved ? "approved" : "pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-text-disabled shrink-0" />
                      <span className="text-xs text-text-faint truncate">{inst.email || "—"}</span>
                    </div>
                    {inst.bio && <p className="text-xs text-text-disabled mt-1 line-clamp-1">{inst.bio}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-text-disabled shrink-0">
                  <Clock className="w-3 h-3" />
                  {inst.isApproved
                    ? `Approved ${inst.approvedAt ? timeAgo(inst.approvedAt) : "—"}`
                    : `Applied ${timeAgo(inst.appliedAt)}`}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!inst.isApproved && (
                    <button
                      onClick={() => handleApprove(inst._id, inst.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.18)] border border-[rgba(34,197,94,0.25)] text-[#22c55e] text-xs font-medium transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {inst.isApproved && (
                    <button
                      onClick={() => handleRevoke(inst._id, inst.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-text-faint hover:text-amber-400/70 hover:bg-amber-500/6 border border-transparent hover:border-amber-500/20 text-xs transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Revoke
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(inst._id, inst.name)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function AdminsTab() {
  const admins      = useQuery(api.admins.getAllAdmins);
  const addAdmin    = useMutation(api.admins.addAdminByEmail);
  const removeAdmin = useMutation(api.admins.removeAdmin);

  async function handleAdd(email: string) {
    try { await addAdmin({ email }); toast.success(`${email} added as admin`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to add"); }
  }
  async function handleRemove(id: Id<"admins">, email: string) {
    if (!confirm(`Remove admin access for ${email}? They will lose all admin privileges.`)) return;
    try { await removeAdmin({ adminId: id }); toast.success(`${email} removed from admins`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="space-y-6">

      {/* Warning banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-amber-500/20 bg-amber-500/6">
        <Shield className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-amber-400/90 mb-0.5">Admin access is powerful</p>
          <p className="text-[11px] text-text-faint">
            Admins can publish/reject all content, approve instructors, and add other admins. Only add people you fully trust.
          </p>
        </div>
      </div>

      {/* Add admin */}
      <div className="rounded-lg border border-border-subtle bg-bg-elevated p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-0.5">Add admin by email</p>
          <p className="text-[11px] text-text-faint">The user must already have a ScriptValley account. Access is granted instantly.</p>
        </div>
        <AddUserForm placeholder="admin@email.com" buttonLabel="Add Admin" onAdd={handleAdd} loading={admins === undefined} />
      </div>

      {/* Admins list */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-3">
          {admins === undefined ? "—" : admins.length} admin{admins?.length !== 1 ? "s" : ""}
        </p>

        {admins === undefined ? (
          <Loader />
        ) : admins.length === 0 ? (
          <Empty label="admins" Icon={Shield} />
        ) : (
          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <AnimatePresence initial={false}>
              {admins.map((admin, idx) => (
                <motion.div
                  key={String(admin._id)}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.13, delay: idx * 0.025 }}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-bg-hover transition-colors ${
                    idx > 0 ? "border-t border-border-subtle" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-md bg-[rgba(58,94,255,0.1)] border border-[rgba(58,94,255,0.2)] flex items-center justify-center shrink-0 text-[10px] font-bold text-brand">
                    {getInitials(admin.name ?? admin.email)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-secondary truncate">
                        {admin.name ?? admin.email ?? "—"}
                      </p>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0"
                        style={{ color: "#3A5EFF", background: "rgba(58,94,255,0.08)", borderColor: "rgba(58,94,255,0.2)" }}
                      >
                        admin
                      </span>
                    </div>
                    {admin.name && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-text-disabled shrink-0" />
                        <span className="text-xs text-text-faint truncate">{admin.email ?? "—"}</span>
                      </div>
                    )}
                  </div>

                  {admin.addedAt && (
                    <div className="flex items-center gap-1 text-[10px] text-text-disabled shrink-0">
                      <Clock className="w-3 h-3" />
                      Added {timeAgo(admin.addedAt)}
                    </div>
                  )}

                  <button
                    onClick={() => handleRemove(admin._id, admin.email ?? "this admin")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 text-xs transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  );
}

function Empty({ label, Icon }: { label: string; Icon: React.ComponentType<any> }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-text-disabled">
      <Icon className="w-7 h-7" />
      <p className="text-sm">No {label} yet</p>
    </div>
  );
}

export default function TeamManager() {
  const [tab, setTab] = useState<Tab>("instructors");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Management</p>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Team</h2>
        <p className="text-sm text-text-faint">Manage instructors and admin access.</p>
      </div>

      <div className="flex gap-px border-b border-border-subtle">
        {([
          { key: "instructors", label: "Instructors", Icon: UserCheck },
          { key: "admins",      label: "Admins",      Icon: Shield    },
        ] as { key: Tab; label: string; Icon: React.ComponentType<any> }[]).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
              tab === key ? "text-text-primary" : "text-text-faint hover:text-text-muted"
            }`}
          >
            {tab === key && (
              <motion.span layoutId="teamTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
            )}
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
        >
          {tab === "instructors" && <InstructorsTab />}
          {tab === "admins"      && <AdminsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}