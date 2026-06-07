"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Lock, Download, Eye, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  courseSlug: string;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, threshold }: { pct: number; threshold: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        {/* Completed portion */}
        <div
          className="h-full bg-[#3A5EFF] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Threshold marker label */}
      <span className="text-[10px] text-[var(--text-disabled)] shrink-0 tabular-nums">
        {pct}% / {threshold}%
      </span>
    </div>
  );
}

// ── PDF viewer (iframe embed) ─────────────────────────────────────────────────
function PDFViewer({ url, fileName }: { url: string; fileName: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-[var(--text-disabled)]" />
          <span className="text-[11px] text-[var(--text-faint)] truncate max-w-[200px]">
            {fileName}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open in new tab
        </a>
      </div>
      {/* Embedded PDF — browser renders this natively */}
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        className="w-full"
        style={{ height: 520 }}
        title={fileName}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CheatSheetPanel({ courseSlug }: Props) {
  const { user, isLoaded } = useUser();
  const [viewerOpen, setViewerOpen] = useState(false);

  const access = useQuery(
    api.courses.getCheatSheetAccess,
    isLoaded ? { courseSlug } : "skip",
  ) as {
    hasSheet:    boolean;
    accessLevel: "none" | "view" | "download";
    url:         string | null;
    fileName:    string | null;
    pct?:        number;
    threshold?:  number | null;
  } | undefined;

  // Don't render anything if loading or no sheet uploaded
  if (!access || !access.hasSheet) return null;

  const { accessLevel, url, fileName, pct = 0, threshold } = access;
  const displayName = fileName ?? "cheatsheet.pdf";

  // ── Locked state — < 40% ─────────────────────────────────────────────────
  if (accessLevel === "none") {
    return (
      <div className="max-w-2xl mt-8 pt-8 border-t border-[var(--border-subtle)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          Cheat Sheet
        </p>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
          <div className="flex items-start gap-3 px-4 py-4">
            {/* Lock icon */}
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-[var(--text-disabled)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-0.5">
                {displayName}
              </p>
              <p className="text-xs text-[var(--text-faint)] mb-3">
                {!user
                  ? "Sign in and complete 40% of this course to unlock the cheat sheet preview."
                  : `Complete ${threshold ?? 40}% of the course to unlock the preview.`
                }
              </p>
              {/* Progress bar — only shown for signed-in users */}
              {user && typeof pct === "number" && (
                <ProgressBar pct={pct} threshold={threshold ?? 40} />
              )}
              {/* Sign in nudge */}
              {!user && isLoaded && (
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#3A5EFF] hover:underline font-medium"
                >
                  Sign in to track progress →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── View state — 40–49% ───────────────────────────────────────────────────
  if (accessLevel === "view") {
    return (
      <div className="max-w-2xl mt-8 pt-8 border-t border-[var(--border-subtle)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          Cheat Sheet
        </p>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-[#3A5EFF] shrink-0" />
              <span className="text-sm font-medium text-[var(--text-secondary)] truncate">
                {displayName}
              </span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[rgba(58,94,255,0.08)] border border-[rgba(58,94,255,0.2)] text-[#3A5EFF] uppercase tracking-wide shrink-0">
                Preview
              </span>
            </div>
            <button
              onClick={() => setViewerOpen((p) => !p)}
              className="flex items-center gap-1 text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
            >
              {viewerOpen
                ? <><ChevronUp   className="w-3.5 h-3.5" />Hide</>
                : <><Eye        className="w-3.5 h-3.5" />View</>
              }
            </button>
          </div>

          {/* Download locked nudge */}
          <div className="px-4 py-2.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-[var(--text-disabled)] shrink-0" />
              <span className="text-[11px] text-[var(--text-faint)]">
                Download unlocks at {threshold ?? 50}% —
              </span>
              {typeof pct === "number" && (
                <div className="flex-1">
                  <ProgressBar pct={pct} threshold={threshold ?? 50} />
                </div>
              )}
            </div>
          </div>

          {/* PDF viewer */}
          <AnimatePresence>
            {viewerOpen && url && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3">
                  <PDFViewer url={url} fileName={displayName} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── Download state — 50%+ ─────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mt-8 pt-8 border-t border-[var(--border-subtle)]">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
        Cheat Sheet
      </p>
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-[#3A5EFF] shrink-0" />
            <span className="text-sm font-medium text-[var(--text-secondary)] truncate">
              {displayName}
            </span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] text-[#22c55e] uppercase tracking-wide shrink-0">
              Unlocked
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* View toggle */}
            <button
              onClick={() => setViewerOpen((p) => !p)}
              className="flex items-center gap-1 text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {viewerOpen
                ? <><ChevronUp  className="w-3.5 h-3.5" />Hide</>
                : <><Eye       className="w-3.5 h-3.5" />View</>
              }
            </button>
            {/* Download button */}
            {url && (
              <a
                href={url}
                download={displayName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            )}
          </div>
        </div>

        {/* PDF viewer */}
        <AnimatePresence>
          {viewerOpen && url && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3">
                <PDFViewer url={url} fileName={displayName} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}