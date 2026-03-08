"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser, useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";
import toast from "react-hot-toast";
import { SiGithub, SiLeetcode } from "react-icons/si";
import { Trash2, Link2 } from "lucide-react";

const PLATFORM_KEY_TO_FORM_FIELD = {
  leetcode: "leetcodeUsername",
  github:   "githubUsername",
} as const;

type PlatformKey   = keyof typeof PLATFORM_KEY_TO_FORM_FIELD;
type PlatformField = (typeof PLATFORM_KEY_TO_FORM_FIELD)[PlatformKey];

const PREFIXES: Record<PlatformKey, string> = {
  github:   "https://github.com/",
  leetcode: "https://leetcode.com/u/",
};

type UserPlatformData   = { githubUrl?: string | null; leetcodeUrl?: string | null; [k: string]: unknown };
type UpdateStatsPayload = { userId: string; platform: PlatformKey; stats: { githubUrl?: string; leetcodeUrl?: string } | Record<string, unknown>; idToken?: string };

const SECTIONS: {
  heading: string;
  items: { label: string; key: PlatformKey; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  { heading: "Development",     items: [{ label: "GitHub",   key: "github",   icon: SiGithub   }] },
  { heading: "Problem Solving", items: [{ label: "LeetCode", key: "leetcode", icon: SiLeetcode }] },
];

export default function PlatformForm() {
  const { user, isSignedIn } = useUser();
  const { getToken }         = useAuth();
  const userId               = user?.id ?? "";

  const userData    = useQuery(api.platforms.getUserPlatformData, userId ? { userId } : "skip");
  const updateStats = useMutation(api.platforms.updateDevStats);
  const [connecting, setConnecting] = useState<PlatformKey | null>(null);

  const [formData, setFormData] = useState<Record<PlatformField, string>>({
    leetcodeUsername: "",
    githubUsername:   "",
  });

  useEffect(() => {
    if (!userData) return;
    const ud = userData as unknown as UserPlatformData;
    setFormData({
      leetcodeUsername: ud.leetcodeUrl ? String(ud.leetcodeUrl).replace(/^https?:\/\/leetcode\.com\/u\//, "")   : "",
      githubUsername:   ud.githubUrl   ? String(ud.githubUrl).replace(/^https?:\/\/(www\.)?github\.com\//, "") : "",
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "leetcodeUsername" || name === "githubUsername") {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const getStats = (key: PlatformKey): { githubUrl?: string; leetcodeUrl?: string } => {
    const raw = formData[PLATFORM_KEY_TO_FORM_FIELD[key]] ?? "";
    if (!raw) return {};
    const url = raw.startsWith("http") ? raw : `${PREFIXES[key]}${raw}`;
    return key === "github" ? { githubUrl: url } : { leetcodeUrl: url };
  };

  const handleConnect = async (key: PlatformKey) => {
    if (!isSignedIn || !userId) { toast.error("Please sign in."); return; }
    setConnecting(key);
    try {
      let idToken: string | undefined;
      try { const t = await getToken({ template: "convex" }); idToken = t ?? undefined; } catch { /* noop */ }
      await updateStats({ userId, platform: key, stats: getStats(key), idToken } as UpdateStatsPayload);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} connected`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to connect ${key}`);
    } finally { setConnecting(null); }
  };

  const handleDelete = async (key: PlatformKey) => {
    if (!isSignedIn || !userId) { toast.error("Please sign in."); return; }
    const field = PLATFORM_KEY_TO_FORM_FIELD[key];
    setFormData((p) => ({ ...p, [field]: "" }));
    try {
      let idToken: string | undefined;
      try { const t = await getToken({ template: "convex" }); idToken = t ?? undefined; } catch { /* noop */ }
      const stats = key === "github" ? { githubUrl: "" } : { leetcodeUrl: "" };
      await updateStats({ userId, platform: key, stats, idToken } as UpdateStatsPayload);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} disconnected`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to disconnect ${key}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="max-w-xl space-y-8"
    >
      {SECTIONS.map(({ heading, items }) => (
        <div key={heading} className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">{heading}</p>

          {items.map(({ key, label, icon: Icon }, idx) => {
            const field        = PLATFORM_KEY_TO_FORM_FIELD[key];
            const isConnecting = connecting === key;
            const hasValue     = Boolean(formData[field]);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14, delay: idx * 0.04 }}
                className="rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors duration-100 overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-input)] border-b border-[var(--border-default)]">
                  <div className="w-6 h-6 rounded-md bg-[var(--bg-hover)] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] flex-1">{label}</p>
                  {hasValue && (
                    /* Connected badge — semantic success color, intentionally hardcoded */
                    <span className="text-[10px] text-[#22c55e] bg-[#22c55e0d] border border-[#22c55e25] rounded-md px-2 py-0.5">
                      Connected
                    </span>
                  )}
                </div>

                {/* Input + actions row */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-base)]">
                  <span className="text-xs text-[var(--text-disabled)] shrink-0 select-none">{PREFIXES[key]}</span>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder="username"
                    className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Connect — brand primary action, intentionally hardcoded */}
                    <button
                      type="button"
                      onClick={() => handleConnect(key)}
                      disabled={isConnecting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-xs font-medium transition-colors duration-100 disabled:opacity-50"
                    >
                      <Link2 className="w-3 h-3" />
                      {isConnecting ? "…" : "Connect"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(key)}
                      className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-red-400/70 hover:bg-red-500/[0.06] transition-colors duration-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}