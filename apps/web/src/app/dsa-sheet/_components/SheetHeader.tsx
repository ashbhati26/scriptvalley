"use client";

import { Printer } from "lucide-react";

interface Sheet {
  name: string;
  description?: string;
  note?: string[];
  credit?: {
    name: string;
    profile: string;
  };
}

interface Props {
  sheet: Sheet;
  showDownload?: boolean; // only true when user is logged in and sheet is loaded
}

export default function SheetHeader({ sheet, showDownload = false }: Props) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Flat page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
            DSA Sheet
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            {sheet.name}
          </h1>
          {sheet.description && (
            <p
              className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: sheet.description }}
            />
          )}
        </div>

        {/* Download PDF button — only shown when data is ready */}
        {showDownload && (
          <button
            onClick={handlePrint}
            className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-md text-xs border border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors shrink-0 mt-1"
            title="Download as PDF / Print"
          >
            Download PDF
            <Printer className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Note block */}
      {sheet.note && sheet.note.length > 0 && (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden sv-print-hide">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
            <span className="text-[10px] uppercase tracking-widest text-red-400/70">
              Note
            </span>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {sheet.note.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[var(--text-faint)]"
              >
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--text-disabled)] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credit */}
      {sheet.credit && (
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] sv-print-hide">
          Credit{" "}
          <a
            href={sheet.credit.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
          >
            {sheet.credit.name}
          </a>
        </p>
      )}
    </div>
  );
}
