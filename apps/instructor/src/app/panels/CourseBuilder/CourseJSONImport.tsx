"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, FileJson, ClipboardPaste,
  AlertCircle, CheckCircle2, Copy, ChevronDown, ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { hydrateModules } from "./courseTypes";
import type { Module, CourseTemplate, CourseLevel } from "./courseTypes";

interface ImportedCourse {
  title: string; description?: string;
  template?: CourseTemplate; level?: CourseLevel; modules: any[];
}
export interface ImportResult {
  title: string; description: string;
  template: CourseTemplate; level: CourseLevel | ""; modules: Module[];
}
interface Props { onImport: (result: ImportResult) => void; onClose: () => void; }

const SAMPLE_JSON = JSON.stringify({
  title: "Complete Java Programming",
  description: "Master Java from basics to advanced OOP concepts.",
  template: "structured", level: "beginner",
  modules: [{
    title: "Introduction to Java",
    description: "Setting up and understanding the basics.",
    lessons: [{ title: "What is Java?", lessonNumber: "1.1", topicsCovered: "History, JVM, JDK, JRE", content: "<p>Java is a high-level, object-oriented language...</p>" }],
    mcqQuestions: [{ question: "What does JVM stand for?", options: [{ text: "Java Virtual Machine", isCorrect: true }, { text: "Java Visual Model", isCorrect: false }], explanation: "JVM = Java Virtual Machine." }],
    codingChallenges: [{ title: "Print Hello World", description: "Write a Java program that prints Hello, World!", difficulty: "easy", platform: "gfg", link: "https://practice.geeksforgeeks.org/...", hint: "Use System.out.println()" }],
    miniProject: { title: "Simple Calculator", description: "Build a command-line calculator in Java.", difficulty: "medium" },
  }],
}, null, 2);

function validate(raw: any): { ok: true; data: ImportedCourse } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return { ok: false, error: "JSON must be an object at the top level." };
  if (!raw.title || typeof raw.title !== "string" || !raw.title.trim())
    return { ok: false, error: 'Missing required field: "title".' };
  if (!Array.isArray(raw.modules) || raw.modules.length === 0)
    return { ok: false, error: '"modules" must be a non-empty array.' };
  if (raw.template && !["freeform","structured"].includes(raw.template))
    return { ok: false, error: '"template" must be "freeform" or "structured".' };
  if (raw.level && !["beginner","intermediate","advanced","all-levels"].includes(raw.level))
    return { ok: false, error: '"level" must be one of: beginner, intermediate, advanced, all-levels.' };
  for (let i = 0; i < raw.modules.length; i++) {
    const m = raw.modules[i];
    if (!m.title || typeof m.title !== "string" || !m.title.trim())
      return { ok: false, error: `Module at index ${i} is missing a "title".` };
  }
  return { ok: true, data: raw as ImportedCourse };
}

function normaliseModules(raw: any[]): Module[] {
  return hydrateModules(raw.map((m, i) => ({
    order: i, title: m.title ?? "",
    slug: (m.title ?? "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `module-${i+1}`,
    description: m.description ?? undefined, content: m.content ?? undefined,
    lessons: Array.isArray(m.lessons) ? m.lessons : [],
    mcqQuestions: Array.isArray(m.mcqQuestions) ? m.mcqQuestions : [],
    codingChallenges: Array.isArray(m.codingChallenges) ? m.codingChallenges : [],
    miniProject: m.miniProject ?? undefined,
  })));
}

type Tab = "upload" | "paste";

export default function CourseJSONImport({ onImport, onClose }: Props) {
  const [tab,          setTab]          = useState<Tab>("upload");
  const [pasteText,    setPasteText]    = useState("");
  const [error,        setError]        = useState<string | null>(null);
  const [showSample,   setShowSample]   = useState(false);
  const [sampleCopied, setSampleCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function clearError() { setError(null); }

  function process(raw: any) {
    const result = validate(raw);
    if (!result.ok) { setError(result.error); return; }
    const { data } = result;
    const modules = normaliseModules(data.modules);
    onImport({
      title: data.title.trim(),
      description: data.description?.trim() ?? "",
      template: data.template ?? "structured",
      level: (data.level ?? "") as CourseLevel | "",
      modules,
    });
    toast.success(`Imported "${data.title}" — ${modules.length} module${modules.length !== 1 ? "s" : ""}`);
    onClose();
  }

  function handleParse(text: string) {
    clearError();
    if (!text.trim()) { setError("Nothing to import — paste your JSON first."); return; }
    try { process(JSON.parse(text)); }
    catch { setError("Invalid JSON — check for missing commas, brackets, or quotes."); }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { const text = await file.text(); process(JSON.parse(text)); }
    catch { setError("Could not read file — make sure it's valid JSON."); }
    finally { if (fileRef.current) fileRef.current.value = ""; }
  }

  async function copySample() {
    await navigator.clipboard.writeText(SAMPLE_JSON);
    setSampleCopied(true);
    setTimeout(() => setSampleCopied(false), 2000);
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{
          position: "fixed", inset: 0, zIndex: 51,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", pointerEvents: "none",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: "480px",
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-hover)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "var(--radius-md)",
                background: "var(--brand-subtle)", border: "1px solid var(--brand-border)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <FileJson size={16} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  Import from JSON
                </p>
                <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>
                  Upload a <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "var(--bg-active)", padding: "1px 4px", borderRadius: "var(--radius-xs)" }}>.json</code> file or paste JSON to fill the course form instantly.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-md)", background: "var(--bg-active)", border: "none",
                cursor: "pointer", color: "var(--text-muted)", flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-active)"; }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)" }}>
            {(["upload", "paste"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); clearError(); }}
                style={{
                  flex: 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 12px",
                  fontSize: 13, fontWeight: tab === t ? 500 : 400,
                  color: tab === t ? "var(--brand)" : "var(--text-muted)",
                  background: "transparent", border: "none",
                  borderBottom: `2px solid ${tab === t ? "var(--brand)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "color 80ms, border-color 80ms",
                  marginBottom: -1,
                }}
              >
                {t === "upload" ? <Upload size={13} /> : <ClipboardPaste size={13} />}
                {t === "upload" ? "Upload file" : "Paste JSON"}
              </button>
            ))}
          </div>

          {/* Body */}
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {tab === "upload" && (
              <>
                <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleFile} />
                {/* Drop zone — fixed min-height so it feels like a real landing zone */}
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: "100%",
                    minHeight: 180,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 14,
                    borderRadius: "var(--radius-xl)",
                    border: "1.5px dashed var(--border-medium)",
                    background: "var(--bg-input)",
                    cursor: "pointer",
                    transition: "border-color 80ms, background 80ms",
                    padding: "32px 24px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-input)"; }}
                >
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: "var(--radius-xl)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Upload size={20} style={{ color: "var(--text-disabled)" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "-0.01em" }}>
                      Click to select a file
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-disabled)", marginTop: 4 }}>
                      Only <span style={{ fontFamily: "var(--font-mono)" }}>.json</span> files
                    </p>
                  </div>
                </button>
              </>
            )}

            {tab === "paste" && (
              <>
                <textarea
                  value={pasteText}
                  onChange={(e) => { setPasteText(e.target.value); clearError(); }}
                  placeholder='{ "title": "My Course", "modules": [...] }'
                  rows={8}
                  spellCheck={false}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                    outline: "none",
                    resize: "none",
                    letterSpacing: "0",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-subtle)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  onClick={() => handleParse(pasteText)}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px 16px",
                    borderRadius: "var(--radius-lg)",
                    fontSize: 14, fontWeight: 600,
                    color: "white", background: "var(--brand)", border: "none", cursor: "pointer",
                    transition: "background 80ms",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand)"; }}
                >
                  <FileJson size={16} />Import
                </button>
              </>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--danger-bg)",
                  border: "1px solid var(--danger-border)",
                }}
              >
                <AlertCircle size={14} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: "var(--danger)", lineHeight: 1.5 }}>{error}</p>
              </motion.div>
            )}

            {/* Sample JSON accordion */}
            <div style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
              <button
                onClick={() => setShowSample(p => !p)}
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "transparent", border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                  transition: "background 80ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                View sample JSON schema
                {showSample
                  ? <ChevronUp size={13} style={{ color: "var(--text-disabled)" }} />
                  : <ChevronDown size={13} style={{ color: "var(--text-disabled)" }} />}
              </button>
              {showSample && (
                <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "6px 14px", background: "var(--bg-input)",
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-disabled)" }}>Example schema</p>
                    <button
                      onClick={copySample}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 500, color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}
                    >
                      {sampleCopied
                        ? <><CheckCircle2 size={10} style={{ color: "var(--success)" }} />Copied</>
                        : <><Copy size={10} />Copy</>}
                    </button>
                  </div>
                  <pre style={{
                    padding: "12px 14px",
                    fontSize: 10, fontFamily: "var(--font-mono)",
                    color: "var(--text-faint)", lineHeight: 1.6,
                    overflowX: "auto", maxHeight: 240,
                    background: "var(--bg-base)",
                    margin: 0,
                  }}>
                    {SAMPLE_JSON}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}