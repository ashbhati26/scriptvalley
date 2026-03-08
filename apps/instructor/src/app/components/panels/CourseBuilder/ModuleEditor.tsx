"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ChevronRight, Upload, FileText, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Module, makeSlug } from "./courseTypes";

// ── Import the exact same editor stack from your Notes section ──
import NotesEditor from "./NotesEditor";

interface Props {
  mod:         Module;
  courseTitle: string;
  canEdit:     boolean;
  onBack:      () => void;
  onSave:      (updated: Module) => void;
}

// ── Convert plain text / Google Docs paste to basic HTML ─────────────────────
function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => {
      const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return "";
      if (lines.length === 1 && lines[0].length < 80 && !/[.,:;?!]$/.test(lines[0])) {
        return `<h2>${lines[0]}</h2>`;
      }
      return `<p>${lines.join(" ")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

// ── Parse .docx via mammoth (dynamic import) ──────────────────────────────────
async function parseDocx(file: File): Promise<string> {
  // ✅ CORRECT: import "mammoth" directly — NOT "mammoth/mammoth.browser"
  // "mammoth/mammoth.browser" does not exist and crashes at runtime
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

export default function ModuleEditor({ mod, courseTitle, canEdit, onBack, onSave }: Props) {
  const [title,         setTitle]         = useState(mod.title);
  const [content,       setContent]       = useState(mod.content);
  const [saving,        setSaving]        = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [pasteText,     setPasteText]     = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function save() {
    setSaving(true);
    const slug = makeSlug(title) || mod.slug;
    onSave({ ...mod, title, slug, content });
    setTimeout(() => setSaving(false), 300);
    toast.success("Module saved");
  }

  // ── File import ───────────────────────────────────────────────────────────
  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    try {
      let html = "";
      if (file.name.endsWith(".docx")) {
        html = await parseDocx(file);
      } else {
        html = textToHtml(await file.text());
      }
      setContent(html);
      setShowImport(false);
      toast.success("Content imported — review and save");
    } catch {
      toast.error("Could not parse file");
    } finally {
      setImportLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ── Paste import (Google Docs / Notion) ───────────────────────────────────
  function handlePasteImport() {
    if (!pasteText.trim()) { toast.error("Nothing to import"); return; }
    setContent(textToHtml(pasteText));
    setPasteText("");
    setShowImport(false);
    toast.success("Content imported — review and save");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-[var(--bg-base)]">

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept=".docx,.txt,.md" className="hidden" onChange={handleFileImport} />

      {/* ── Topbar ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0 text-xs text-[var(--text-disabled)]">
          <button onClick={onBack} className="flex items-center gap-1 hover:text-[var(--text-muted)] transition-colors shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline truncate max-w-[120px]">{courseTitle || "Course"}</span>
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[var(--text-secondary)] font-medium truncate">{title || "Untitled module"}</span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setShowImport(!showImport); setPasteText(""); }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showImport
                  ? "bg-[var(--bg-active)] border-[var(--border-medium)] text-[var(--text-primary)]"
                  : "border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Upload className="w-3 h-3" />Import
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3 h-3" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* ── Import panel ─────────────────────────────────────────────────── */}
      {canEdit && showImport && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-5 md:px-8 py-5"
        >
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Import content</p>
                <p className="text-[10px] text-[var(--text-faint)] mt-0.5">
                  Upload a file or paste text from Google Docs, Notion, or anywhere.
                </p>
              </div>
              <button
                onClick={() => { setShowImport(false); setPasteText(""); }}
                className="text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File upload */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">Upload file</p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={importLoading}
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg border border-dashed border-[var(--border-subtle)] hover:border-[var(--border-medium)] bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] text-sm text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-50"
              >
                {importLoading
                  ? <div className="w-4 h-4 border-2 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin shrink-0" />
                  : <FileText className="w-4 h-4 shrink-0" />}
                <span>{importLoading ? "Parsing file…" : "Click to upload .docx, .txt, or .md"}</span>
              </button>
              <p className="text-[10px] text-[var(--text-disabled)] mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Images inside Word docs won't import — add them manually after.
              </p>
            </div>

            {/* Paste area */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">
                Paste from Google Docs / Notion
              </p>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={6}
                placeholder="Copy your content (Ctrl+A → Ctrl+C) from Google Docs or Notion and paste it here…"
                className="w-full resize-none bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none focus:border-[var(--border-medium)] transition-colors"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-[var(--text-disabled)]">Headings and paragraphs will be preserved.</p>
                <button
                  onClick={handlePasteImport}
                  disabled={!pasteText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                >
                  <Upload className="w-3 h-3" />Import text
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Module title ─────────────────────────────────────────────────── */}
      <div className="px-7 md:px-14 pt-10 pb-2 max-w-3xl w-full">
        {canEdit ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Module title…"
            className="w-full text-3xl font-bold text-[var(--text-primary)] bg-transparent border-none outline-none placeholder:text-[var(--text-disabled)]"
          />
        ) : (
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{title || "Untitled"}</h1>
        )}
        <p className="text-[10px] font-mono text-[var(--text-disabled)] mt-2">
          /{makeSlug(title) || mod.slug}
        </p>
      </div>

      {/* ── TipTap Editor ────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-3xl w-full pb-12">
        {canEdit ? (
          <NotesEditor content={content} onChange={setContent} />
        ) : (
          <div
            className="px-7 md:px-14 py-6 text-sm text-[var(--text-secondary)] leading-7
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)] [&_h1]:mt-8 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-7 [&_h2]:mb-2.5
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-secondary)] [&_h3]:mt-5 [&_h3]:mb-1.5
              [&_p]:my-1.5 [&_p]:leading-7
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5
              [&_li]:my-0.5
              [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-muted)]
              [&_code]:bg-[var(--bg-input)] [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono
              [&_pre]:bg-[var(--bg-elevated)] [&_pre]:border [&_pre]:border-[var(--border-subtle)] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto
              [&_a]:text-[#3A5EFF] [&_a]:hover:underline
              [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
              [&_td]:border [&_td]:border-[var(--border-subtle)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
              [&_th]:border [&_th]:border-[var(--border-subtle)] [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[var(--bg-input)] [&_th]:text-xs [&_th]:font-semibold
              [&_hr]:border-[var(--border-subtle)] [&_hr]:my-6
              [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4"
            dangerouslySetInnerHTML={{ __html: content || "<p class='text-[var(--text-disabled)]'>No content yet.</p>" }}
          />
        )}

        {canEdit && (
          <div className="flex justify-end px-7 md:px-14 mt-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save module"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}