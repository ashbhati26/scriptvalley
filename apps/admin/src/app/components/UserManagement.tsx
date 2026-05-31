"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Mail, Users, ChevronRight, ArrowLeft,
  Shield, Flag, Calendar, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ─── StatBadge ────────────────────────────────────────────────────────────────
// `color` is a runtime hex — tint bg and border use inline style (justified).
function StatBadge({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 px-3 py-2 rounded-md min-w-0"
      style={{
        background:   color ? `${color}0d` : "var(--bg-elevated)",
        border:       `1px solid ${color ? `${color}25` : "var(--border-subtle)"}`,
      }}
    >
      <span
        className="text-[17px] font-bold leading-tight"
        style={{ color: color ?? "var(--text-primary)" }}
      >
        {value}
      </span>
      <span className="text-[10px] text-(--text-disabled)">{label}</span>
    </div>
  );
}

// ─── UserDetailView ───────────────────────────────────────────────────────────
function UserDetailView({ userId, onBack }: { userId: string; onBack: () => void }) {
  const detail  = useQuery(api.adminFeatures.adminGetUserDetail, { userId });
  const banMut  = useMutation(api.adminFeatures.banUser);
  const flagMut = useMutation(api.adminFeatures.flagUser);
  const [busy, setBusy] = useState(false);

  async function toggleBan() {
    if (!detail) return;
    const next = !(detail as any).banned;
    if (next && !confirm(`Ban ${detail.name}? They will not be able to sign in.`)) return;
    setBusy(true);
    try {
      await banMut({ userId, banned: next });
      toast.success(next ? `${detail.name} banned` : `${detail.name} unbanned`);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  }

  async function toggleFlag() {
    if (!detail) return;
    const next = !(detail as any).flagged;
    setBusy(true);
    try {
      await flagMut({ userId, flagged: next });
      toast.success(next ? `${detail.name} flagged for review` : "Flag removed");
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  }

  if (detail === undefined) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-4 h-4 border-2 border-[rgba(58,94,255,0.3)] border-t-[#3A5EFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return <p className="text-[13px] text-(--text-faint)">User not found.</p>;
  }

  const isBanned  = !!(detail as any).banned;
  const isFlagged = !!(detail as any).flagged;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] text-(--text-faint) hover:text-(--text-secondary) transition-colors cursor-pointer bg-transparent border-none py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to search
      </button>

      {/* Profile header */}
      <div className="flex items-start gap-3.5 p-4 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)">
        <div className="w-11 h-11 rounded-lg bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center text-[14px] font-bold text-(--text-faint) shrink-0">
          {getInitials(detail.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-[15px] font-semibold text-(--text-primary)">{detail.name || "—"}</p>
            {isBanned && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)] uppercase tracking-wide">
                Banned
              </span>
            )}
            {isFlagged && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-warning-bg text-warning border border-warning-border uppercase tracking-wide">
                Flagged
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <Mail className="w-3 h-3 text-(--text-disabled) shrink-0" />
            <span className="text-[12px] text-(--text-faint)">{detail.email || "—"}</span>
          </div>
          {detail.collegeName && (
            <p className="text-[11px] text-(--text-disabled)">
              {detail.collegeName}
              {detail.state   ? `, ${detail.state}`   : ""}
              {detail.country ? `, ${detail.country}` : ""}
            </p>
          )}
          {(detail as any).lastActive && (
            <p className="flex items-center gap-1 text-[11px] text-(--text-disabled) mt-1">
              <Calendar className="w-3 h-3" />
              Last active {(detail as any).lastActive}
            </p>
          )}
        </div>
      </div>

      {/* Activity stats */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">Activity</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBadge label="Sheets Started"    value={(detail as any).sheetsStarted    ?? 0} color="#3A5EFF" />
          <StatBadge label="Courses Started"   value={(detail as any).coursesStarted   ?? 0} color="#8b5cf6" />
          <StatBadge label="POTD Streak"       value={(detail as any).potdStreak       ?? 0} color="#22c55e" />
          <StatBadge label="Total POTD Solved" value={(detail as any).totalPotdSolved  ?? 0} color="#f59e0b" />
          <StatBadge label="Sheets Saved"      value={(detail as any).sheetsSaved      ?? 0} />
          <StatBadge label="Courses Saved"     value={(detail as any).coursesSaved     ?? 0} />
        </div>
      </div>

      {/* Account actions */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">Account Actions</p>
        <div className="flex gap-2 flex-wrap">

          {/* Flag button */}
          <button
            onClick={toggleFlag}
            disabled={busy}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] font-medium
              border transition-colors duration-75
              ${busy ? "opacity-60 cursor-wait" : "cursor-pointer"}
              ${isFlagged
                ? "bg-warning-bg border-warning-border text-warning"
                : "bg-(--bg-elevated) border-(--border-subtle) text-(--text-secondary) hover:bg-(--bg-hover)"
              }
            `}
          >
            <Flag className="w-3.5 h-3.5" />
            {isFlagged ? "Remove Flag" : "Flag Account"}
          </button>

          {/* Ban button */}
          <button
            onClick={toggleBan}
            disabled={busy}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] font-medium
              border transition-colors duration-75
              ${busy ? "opacity-60 cursor-wait" : "cursor-pointer"}
              ${isBanned
                ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.14)]"
                : "bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.14)]"
              }
            `}
          >
            <Shield className="w-3.5 h-3.5" />
            {isBanned ? "Unban User" : "Ban User"}
          </button>
        </div>

        {isBanned && (
          <p className="flex items-center gap-1 text-[11px] text-[rgba(239,68,68,0.7)] mt-2">
            <AlertTriangle className="w-3 h-3" />
            This user is banned and cannot sign in.
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── UserManagement ───────────────────────────────────────────────────────────
export default function UserManagement() {
  const [query,          setQuery]          = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const results = useQuery(api.users.searchUsers, query.trim() ? { q: query } : "skip");

  if (selectedUserId) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
          <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">User Detail</h2>
        </div>
        <UserDetailView userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
        <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">User Management</h2>
        <p className="text-[13px] text-(--text-faint)">
          Search any user to inspect or take action on their account.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--text-faint) pointer-events-none" />
        <input
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full h-9 pl-9 pr-4 text-[13px]
            bg-(--bg-input) border border-(--border-subtle) rounded-md
            text-(--text-secondary) outline-none
            focus:border-[rgba(58,94,255,0.4)]
            transition-colors duration-75
          "
        />
      </div>

      {/* Empty state */}
      {!query && (
        <div className="flex flex-col items-center gap-2 py-12 text-(--text-disabled)">
          <Users className="w-8 h-8" />
          <p className="text-[13px]">Start typing to find a user</p>
        </div>
      )}

      {/* Loading */}
      {query && results === undefined && (
        <div className="flex justify-center py-12">
          <div className="w-4 h-4 border-2 border-[rgba(58,94,255,0.3)] border-t-[#3A5EFF] rounded-full animate-spin" />
        </div>
      )}

      {/* No results */}
      {query && results && results.length === 0 && (
        <div className="flex flex-col items-center gap-1.5 py-12 text-(--text-disabled)">
          <User className="w-7 h-7" />
          <p className="text-[13px]">No users found for "{query}"</p>
        </div>
      )}

      {/* Results list */}
      <AnimatePresence initial={false}>
        {results && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="rounded-lg border border-(--border-subtle) overflow-hidden">
              {results.map((u: any, idx: number) => (
                <motion.button
                  key={u.userId}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12, delay: idx * 0.03 }}
                  onClick={() => setSelectedUserId(u.userId)}
                  className={`
                    group w-full flex items-center gap-3 px-4 py-3
                    bg-transparent hover:bg-(--bg-hover)
                    text-left cursor-pointer transition-colors duration-75
                    ${idx > 0 ? "border-t border-(--border-subtle)" : ""}
                  `}
                >
                  {/* Avatar */}
                  <div className="w-[34px] h-[34px] rounded-md bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center text-[11px] font-bold text-(--text-faint) shrink-0">
                    {getInitials(u.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-(--text-secondary) truncate">
                      {u.name || "Unnamed"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-(--text-disabled) shrink-0" />
                      <span className="text-[11px] text-(--text-faint) truncate">{u.email || "—"}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-(--text-faint) group-hover:text-[#3A5EFF] transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}