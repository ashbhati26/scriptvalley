"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Code, Star, Terminal, XCircle, Zap } from "lucide-react";
import { useMemo } from "react";

type Execution = { _id: string; language: string; _creationTime: number; code: string; error?: string; output?: string };
type UserStats  = { totalExecutions: number; languagesCount: number; last24Hours: number; favoriteLanguage: string; languageStats: Record<string, number>; mostStarredLanguage: string };

const LANG_COLORS: Record<string, string> = {
  javascript: "#f7df1e", typescript: "#3178c6", python: "#3572a5",
  rust: "#dea584", go: "#00add8", java: "#b07219", cpp: "#f34b7d",
  c: "#555", csharp: "#178600", ruby: "#701516", swift: "#f05138",
};
const langColor = (l: string) => LANG_COLORS[l.toLowerCase()] ?? "#444";

function Sparkline({ executions }: { executions: Execution[] }) {
  const buckets = useMemo(() => {
    const DAY = 86_400_000;
    const now  = Date.now();
    return Array.from({ length: 14 }, (_, i) => {
      const start = now - (13 - i) * DAY;
      const count = executions.filter((e) => e._creationTime >= start && e._creationTime < start + DAY);
      return { ok: count.filter((e) => !e.error).length, err: count.filter((e) => e.error).length };
    });
  }, [executions]);
  const max = Math.max(...buckets.map((b) => b.ok + b.err), 1);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {buckets.map((b, i) => {
        const total = b.ok + b.err;
        const h = total ? Math.max((total / max) * 40, 4) : 2;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: h,
              backgroundColor: total === 0 ? "var(--bg-hover)" : b.err ? "#ef4444" : "#3A5EFF",
            }}
          />
        );
      })}
    </div>
  );
}

function LangBar({ stats }: { stats: Record<string, number> }) {
  const total  = Object.values(stats).reduce((s, v) => s + v, 0) || 1;
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
        {sorted.map(([lang, n]) => (
          <div key={lang} style={{ width: `${(n / total) * 100}%`, backgroundColor: langColor(lang) }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
        {sorted.map(([lang, n]) => (
          <span key={lang} className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langColor(lang) }} />
            {lang} <span className="text-[var(--text-disabled)]">{Math.round((n / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 mb-6 animate-pulse">
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[var(--bg-hover)]" />
        <div className="h-4 w-24 bg-[var(--bg-hover)] rounded" />
        <div className="h-3 w-32 bg-[var(--bg-hover)] rounded" />
        {[...Array(4)].map((_, i) => <div key={i} className="w-full h-7 bg-[var(--bg-hover)] rounded-md" />)}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-28" />
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-28" />
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-20" />
      </div>
    </div>
  );
}

export default function ProfileOverview({ userStats, userData, user, isReady, starredCount, executions }: {
  userStats:    UserStats | undefined;
  userData:     { name: string; email: string } | undefined | null;
  user:         { imageUrl?: string } | null;
  isReady:      boolean;
  starredCount: number;
  executions:   Execution[];
}) {
  if (!isReady || !userStats || !userData) return <Skeleton />;

  const profileSrc   = user?.imageUrl || "/default-avatar.png";
  const successCount = executions.filter((e) => !e.error).length;
  const errorCount   = executions.filter((e) =>  e.error).length;
  const successRate  = executions.length ? Math.round((successCount / executions.length) * 100) : 0;
  const hasLangs     = Object.keys(userStats.languageStats).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4 mb-6">

      {/* Identity card */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden flex flex-col">
        <div className="flex flex-col items-center gap-2.5 px-5 py-5 border-b border-[var(--border-subtle)] text-center">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[var(--border-subtle)]">
            <Image src={profileSrc} alt="avatar" width={56} height={56} unoptimized className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{userData.name}</p>
            <p className="text-[11px] text-[var(--text-disabled)] mt-0.5 truncate max-w-[160px]">{userData.email}</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-default)] flex-1">
          {[
            { label: "Total runs", value: userStats.totalExecutions, icon: Terminal },
            { label: "Starred",    value: starredCount,              icon: Star     },
            { label: "Languages",  value: userStats.languagesCount,  icon: Code     },
            { label: "Last 24 h",  value: userStats.last24Hours,     icon: Zap      },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5">
              <span className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
                <Icon className="w-3 h-3 text-[var(--text-disabled)]" />{label}
              </span>
              <span className="text-xs font-semibold text-[var(--text-secondary)] tabular-nums">{value}</span>
            </div>
          ))}
        </div>
        <Link
          href="/dev-profile"
          className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)] text-[10px] uppercase tracking-widest text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
        >
          Dev Profile <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Right dashboard */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          {/* Run outcomes */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">Run outcomes</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] mb-2 tabular-nums">{successRate}%</p>
            <div className="h-1 w-full rounded-full bg-[var(--bg-hover)] mb-3">
              <div className="h-full rounded-full bg-[#3A5EFF]" style={{ width: `${successRate}%` }} />
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                <CheckCircle2 className="w-3 h-3 text-[#22c55e]" />{successCount} ok
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                <XCircle className="w-3 h-3 text-red-400/70" />{errorCount} err
              </span>
            </div>
          </div>

          {/* 14-day activity */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">14-day activity</p>
            <Sparkline executions={executions} />
            <div className="flex gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)]">
                <span className="w-2 h-2 rounded-sm bg-[#3A5EFF]" />ok
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)]">
                <span className="w-2 h-2 rounded-sm bg-red-400/70" />err
              </span>
            </div>
          </div>
        </div>

        {/* Language breakdown */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Languages</p>
            {userStats.favoriteLanguage && (
              <span className="text-[10px] text-[var(--text-disabled)]">
                Top — <strong className="text-[var(--text-faint)]">{userStats.favoriteLanguage}</strong>
              </span>
            )}
          </div>
          {hasLangs
            ? <LangBar stats={userStats.languageStats} />
            : <p className="text-xs text-[var(--text-disabled)]">Run some code to see your breakdown.</p>
          }
        </div>
      </div>

    </div>
  );
}