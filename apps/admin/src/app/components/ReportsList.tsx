"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import React from "react";
import { Search, User, Mail, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReportsListProps { onSelect: (userId: string) => void; }
interface UserItem { userId: string; name?: string; email?: string; }

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ReportsList({ onSelect }: ReportsListProps) {
  const [query, setQuery] = useState("");
  const users = useQuery(api.users.searchUsers, query ? { q: query } : "skip");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Admin · Reports</p>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">User Reports</h2>
        <p className="text-sm text-text-faint">Search a student to view their sheet-wise progress</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-faint pointer-events-none" />
        <input
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-9 bg-bg-input border border-transparent rounded-md pl-9 pr-4 text-sm text-text-secondary placeholder:text-text-disabled outline-none focus:bg-bg-hover focus:border-border-subtle transition-all"
        />
      </div>

      {!query && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-disabled">
          <User className="w-8 h-8" />
          <span className="text-sm">Start typing to find a student</span>
        </div>
      )}

      {query && users === undefined && (
        <div className="flex items-center justify-center py-12">
          <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      )}

      {query && users && users.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-text-disabled">
          <User className="w-7 h-7" />
          <span className="text-sm">No students found for &ldquo;{query}&rdquo;</span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {users && users.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-2">
              {users.length} result{users.length !== 1 ? "s" : ""}
            </p>
            <div className="rounded-lg border border-border-subtle overflow-hidden">
              {(users as UserItem[]).map((u, idx) => (
                <motion.button key={u.userId}
                  initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12, delay: idx * 0.03 }}
                  onClick={() => onSelect(u.userId)}
                  className={`w-full group flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left ${idx > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <div className="w-8 h-8 rounded-md bg-bg-hover flex items-center justify-center shrink-0 text-[10px] font-bold text-text-faint">
                    {getInitials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-secondary truncate">{u.name || "Unnamed"}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-text-disabled shrink-0" />
                      <span className="text-xs text-text-faint truncate">{u.email || "—"}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-xs text-text-faint group-hover:text-brand transition-colors">
                    View report <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}