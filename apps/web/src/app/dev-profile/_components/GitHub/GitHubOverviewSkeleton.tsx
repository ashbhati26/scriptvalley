"use client";

import React from "react";

export default function GitHubOverviewSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse" aria-hidden>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div className="space-y-1.5">
          <div className="h-2.5 w-12 bg-[var(--bg-hover)] rounded" />
          <div className="h-4 w-40 bg-[var(--bg-elevated)] rounded" />
        </div>
        <div className="h-7 w-20 bg-[var(--bg-hover)] rounded-md" />
      </div>

      <div className="p-4 bg-[var(--bg-base)] space-y-4">

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-2">
              <div className="h-2.5 w-20 bg-[var(--bg-hover)] rounded" />
              <div className="h-8 w-16 bg-[var(--bg-input)] rounded" />
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border-default)]">
            <div className="h-2.5 w-28 bg-[var(--bg-hover)] rounded" />
            <div className="h-2.5 w-40 bg-[var(--bg-hover)] rounded" />
          </div>
          <div className="p-3">
            <div style={{ minWidth: 580 }} className="h-[88px] bg-[var(--bg-hover)] rounded" />
          </div>
        </div>

        {/* Languages + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-3">
            <div className="h-2.5 w-20 bg-[var(--bg-hover)] rounded" />
            <div className="h-1.5 w-full bg-[var(--bg-hover)] rounded-full" />
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-[var(--bg-hover)] rounded" />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-1">
            <div className="h-2.5 w-10 bg-[var(--bg-hover)] rounded mb-3" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-[var(--bg-hover)] rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}