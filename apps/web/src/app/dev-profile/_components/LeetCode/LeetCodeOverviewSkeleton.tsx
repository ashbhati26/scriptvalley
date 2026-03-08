"use client";

import React from "react";

export default function LeetCodeOverviewSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden animate-pulse" aria-hidden>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 bg-[var(--bg-hover)] rounded" />
          <div className="h-4 w-52 bg-[var(--bg-elevated)] rounded" />
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

        {/* Progress */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border-default)]">
            <div className="h-2.5 w-36 bg-[var(--bg-hover)] rounded" />
            <div className="h-2.5 w-28 bg-[var(--bg-hover)] rounded" />
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-[88px] h-[88px] rounded-full bg-[var(--bg-hover)] shrink-0" />
            <div className="flex-1 space-y-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2.5 w-16 bg-[var(--bg-hover)] rounded" />
                  <div className="h-1 w-full bg-[var(--bg-input)] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[var(--border-default)]">
              <div className="h-2.5 w-14 bg-[var(--bg-hover)] rounded" />
            </div>
            <div className="p-3">
              <div style={{ minWidth: 320 }} className="h-24 bg-[var(--bg-hover)] rounded" />
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[var(--border-default)]">
              <div className="h-2.5 w-16 bg-[var(--bg-hover)] rounded" />
            </div>
            <div className="divide-y divide-[var(--border-default)]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5">
                  <div className="h-3 w-28 bg-[var(--bg-hover)] rounded" />
                  <div className="h-3 w-8 bg-[var(--bg-hover)] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}