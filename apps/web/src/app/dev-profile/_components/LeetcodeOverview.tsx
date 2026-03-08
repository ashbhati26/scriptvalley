"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import LeetCodeCalendar from "./LeetCode/LeetCodeCalendar";
import LeetCodeProgress from "./LeetCode/LeetCodeProgress";
import { safeFetchJSON } from "@/lib/safeFetch";
import LeetCodeOverviewSkeleton from "./LeetCode/LeetCodeOverviewSkeleton";
import { RefreshCw } from "lucide-react";

type SubmissionCalendar = Record<string, number>;
type LCOverview = {
  username: string | null; totalSolved: number; totalSubmissions: number;
  totalQuestions: number; easySolved: number; mediumSolved: number; hardSolved: number;
  submissionCalendar: SubmissionCalendar; recentSubmissions: unknown[];
  profile: Record<string, unknown> | null; badges: unknown[];
  totalActiveDays: number; fetchedAt: string; source: string;
};

function normalizeHandle(input?: string | null) {
  if (!input) return null;
  const s = String(input).trim();
  if (!s.includes("http")) return s.replace(/^@/, "").trim() || null;
  try {
    const u = new URL(s);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts[0]?.toLowerCase() === "u" && parts[1]) return parts[1];
    if (parts[0]?.toLowerCase() === "users" && parts[1]) return parts[1];
    return parts[0] || null;
  } catch { return null; }
}

export default function LeetCodeOverview() {
  const { user }  = useUser();
  const userId    = user?.id ?? "";
  const platform  = useQuery(api.platforms.getUserPlatformData, userId ? { userId } : "skip");

  const [data,            setData]            = useState<LCOverview | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [lastFetchedAt,   setLastFetchedAt]   = useState<string | null>(null);
  const [refreshDisabled, setRefreshDisabled] = useState(false);

  const leetcodeUrlRaw = (platform as unknown as Record<string, unknown> | null)?.leetcodeUrl;
  const handle = useMemo(
    () => normalizeHandle(typeof leetcodeUrlRaw === "string" ? leetcodeUrlRaw : ""),
    [leetcodeUrlRaw],
  );

  const fetchOverview = async (username: string) => {
    setLoading(true);
    try {
      const { ok, json } = await safeFetchJSON(
        `/api/leetcode/overview?user=${encodeURIComponent(username)}`, { cache: "no-store" },
      );
      const j = (json ?? {}) as Record<string, unknown>;
      if (ok && j) {
        const g = (k: string, fb = 0) => Number(j[k] ?? fb);
        const submissionCalendar =
          j.submissionCalendar && typeof j.submissionCalendar === "object"
            ? (j.submissionCalendar as SubmissionCalendar) : {};
        const mapped: LCOverview = {
          username: (j.username as string) ?? username,
          totalSolved: g("totalSolved"), totalSubmissions: g("totalSubmissions"),
          totalQuestions: g("totalQuestions"), easySolved: g("easySolved"),
          mediumSolved: g("mediumSolved"), hardSolved: g("hardSolved"),
          submissionCalendar,
          recentSubmissions: Array.isArray(j.recentSubmissions) ? j.recentSubmissions as unknown[] : [],
          profile: j.profile && typeof j.profile === "object" ? j.profile as Record<string, unknown> : null,
          badges: Array.isArray(j.badges) ? j.badges as unknown[] : [],
          totalActiveDays: Number(j.totalActiveDays ?? Object.keys(submissionCalendar ?? {}).length),
          fetchedAt: (j.fetchedAt as string) ?? new Date().toISOString(),
          source: (j.source as string) ?? "leetscan",
        };
        setData(mapped);
        setLastFetchedAt(mapped.fetchedAt);
      } else { setData(null); }
    } catch (err) { console.error("fetchOverview error", err); setData(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (handle) fetchOverview(handle); }, [handle]);

  const onRefresh = async () => {
    if (!handle) return;
    setRefreshDisabled(true);
    await fetchOverview(handle);
    setTimeout(() => setRefreshDisabled(false), 3000);
  };

  if (!handle) return null;
  if (loading && !data) return <LeetCodeOverviewSkeleton />;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">LeetCode</p>
          <h2 className="text-sm font-medium text-[var(--text-primary)]">Problem Solving Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          {lastFetchedAt && (
            <span className="text-[10px] text-[var(--text-disabled)] hidden sm:block">
              {new Date(lastFetchedAt).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={refreshDisabled || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100 disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-[var(--bg-base)] space-y-4">
        {!data ? (
          <p className="text-sm text-[var(--text-faint)] py-8 text-center">No data available.</p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1.5">Total Solved</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{data.totalSolved}</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1.5">Active Days</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{data.totalActiveDays}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border-default)]">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Difficulty Breakdown</p>
                <div className="flex items-center gap-3 text-[10px]">
                  {/* Difficulty count labels — semantic colors, intentionally hardcoded */}
                  <span style={{ color: "#22c55e" }}>Easy <strong className="text-[var(--text-secondary)]">{data.easySolved}</strong></span>
                  <span style={{ color: "#f59e0b" }}>Medium <strong className="text-[var(--text-secondary)]">{data.mediumSolved}</strong></span>
                  <span style={{ color: "#ef4444" }}>Hard <strong className="text-[var(--text-secondary)]">{data.hardSolved}</strong></span>
                </div>
              </div>
              <div className="p-4">
                <LeetCodeProgress
                  easy={data.easySolved}
                  medium={data.mediumSolved}
                  hard={data.hardSolved}
                  total={data.totalSolved}
                />
              </div>
            </div>

            {/* Calendar + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[var(--border-default)]">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Activity</p>
                </div>
                <div className="p-3 overflow-x-auto">
                  <LeetCodeCalendar calendar={data.submissionCalendar} monthsToShow={6} squareSize={12} />
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[var(--border-default)]">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Summary</p>
                </div>
                <div className="divide-y divide-[var(--border-default)]">
                  {[
                    { label: "Total submissions", value: data.totalSubmissions },
                    { label: "Total questions",   value: data.totalQuestions   },
                    { label: "Badges",            value: data.badges?.length ?? 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-xs text-[var(--text-muted)]">{label}</span>
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}