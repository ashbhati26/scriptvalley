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

// ── The shape we accept in JSON ───────────────────────────────────────────────
// This is intentionally loose — we validate and fill defaults below.
interface ImportedCourse {
  title:        string;
  description?: string;
  template?:    CourseTemplate;
  level?:       CourseLevel;
  modules:      any[];
}

// ── What we hand back to CourseEditor on success ──────────────────────────────
export interface ImportResult {
  title:       string;
  description: string;
  template:    CourseTemplate;
  level:       CourseLevel | "";
  modules:     Module[];
}

interface Props {
  onImport: (result: ImportResult) => void;
  onClose:  () => void;
}

// ── Sample JSON the instructor can copy ──────────────────────────────────────
const SAMPLE_JSON = JSON.stringify(
  {
    title:       "Complete Java Programming",
    description: "Master Java from basics to advanced OOP concepts.",
    template:    "structured",
    level:       "beginner",
    modules: [
      {
        title:       "Introduction to Java",
        description: "Setting up and understanding the basics.",
        lessons: [
          {
            title:          "What is Java?",
            lessonNumber:   "1.1",
            topicsCovered:  "History, JVM, JDK, JRE",
            content:        "<p>Java is a high-level, object-oriented language...</p>",
          },
          {
            title:         "Your First Java Program",
            lessonNumber:  "1.2",
            topicsCovered: "Hello World, main method, compilation",
            content:       "<p>Let's write our first program...</p>",
          },
        ],
        mcqQuestions: [
          {
            question: "What does JVM stand for?",
            options: [
              { text: "Java Virtual Machine", isCorrect: true  },
              { text: "Java Visual Model",    isCorrect: false },
              { text: "Java Variable Method", isCorrect: false },
              { text: "None of the above",   isCorrect: false },
            ],
            explanation: "JVM stands for Java Virtual Machine.",
          },
        ],
        codingChallenges: [
          {
            title:       "Print Hello World",
            description: "Write a Java program that prints Hello, World!",
            difficulty:  "easy",
            platform:    "gfg",
            link:        "https://practice.geeksforgeeks.org/...",
            hint:        "Use System.out.println()",
          },
        ],
        miniProject: {
          title:       "Simple Calculator",
          description: "Build a command-line calculator in Java.",
          difficulty:  "medium",
        },
      },
    ],
  },
  null,
  2
);

// ── Validation ────────────────────────────────────────────────────────────────
function validate(raw: any): { ok: true; data: ImportedCourse } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return { ok: false, error: "JSON must be an object at the top level." };

  if (!raw.title || typeof raw.title !== "string" || !raw.title.trim())
    return { ok: false, error: 'Missing required field: "title".' };

  if (!Array.isArray(raw.modules) || raw.modules.length === 0)
    return { ok: false, error: '"modules" must be a non-empty array.' };

  const VALID_TEMPLATES = ["freeform", "structured"];
  if (raw.template && !VALID_TEMPLATES.includes(raw.template))
    return { ok: false, error: `"template" must be "freeform" or "structured".` };

  const VALID_LEVELS = ["beginner", "intermediate", "advanced", "all-levels"];
  if (raw.level && !VALID_LEVELS.includes(raw.level))
    return { ok: false, error: `"level" must be one of: ${VALID_LEVELS.join(", ")}.` };

  for (let i = 0; i < raw.modules.length; i++) {
    const m = raw.modules[i];
    if (!m.title || typeof m.title !== "string" || !m.title.trim())
      return { ok: false, error: `Module at index ${i} is missing a "title".` };
  }

  return { ok: true, data: raw as ImportedCourse };
}

// ── Normalise raw modules → instructor Module[] via hydrateModules ────────────
function normaliseModules(raw: any[]): Module[] {
  // hydrateModules already handles missing fields gracefully and adds _keys
  return hydrateModules(
    raw.map((m, i) => ({
      order:            i,
      title:            m.title ?? "",
      slug:             (m.title ?? "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `module-${i + 1}`,
      description:      m.description ?? undefined,
      content:          m.content     ?? undefined,
      lessons:          Array.isArray(m.lessons)          ? m.lessons          : [],
      mcqQuestions:     Array.isArray(m.mcqQuestions)     ? m.mcqQuestions     : [],
      codingChallenges: Array.isArray(m.codingChallenges) ? m.codingChallenges : [],
      miniProject:      m.miniProject ?? undefined,
    }))
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
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
    const modules  = normaliseModules(data.modules);

    onImport({
      title:       data.title.trim(),
      description: data.description?.trim() ?? "",
      template:    data.template ?? "structured",
      level:       (data.level ?? "") as CourseLevel | "",
      modules,
    });

    toast.success(`Imported "${data.title}" — ${modules.length} module${modules.length !== 1 ? "s" : ""}`);
    onClose();
  }

  function handleParse(text: string) {
    clearError();
    if (!text.trim()) { setError("Nothing to import — paste your JSON first."); return; }
    try {
      process(JSON.parse(text));
    } catch {
      setError("Invalid JSON — check for missing commas, brackets, or quotes.");
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    clearError();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) { setError("Only .json files are supported."); return; }
    try {
      const text = await file.text();
      process(JSON.parse(text));
    } catch {
      setError("Could not read file — make sure it's valid JSON.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
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
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div
          className="w-full max-w-lg rounded-xl border border-(--border-subtle) bg-(--bg-elevated) shadow-2xl shadow-black/20 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-(--border-subtle) bg-(--bg-input)">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-(--brand-subtle) border border-(--brand-border) flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4 text-(--brand)" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-(--text-primary)">Import from JSON</h2>
                <p className="text-xs text-(--text-faint) mt-0.5">
                  Upload a <code className="font-mono text-[10px] bg-(--bg-hover) px-1 py-0.5 rounded">.json</code> file or paste JSON to fill the course form instantly.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:bg-(--bg-hover) transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-(--border-subtle)">
            {(["upload", "paste"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); clearError(); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-(--brand) text-(--brand)"
                    : "border-transparent text-(--text-muted) hover:text-(--text-secondary)"
                }`}
              >
                {t === "upload"
                  ? <><Upload className="w-3.5 h-3.5" />Upload file</>
                  : <><ClipboardPaste className="w-3.5 h-3.5" />Paste JSON</>
                }
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">

            {/* Upload tab */}
            {tab === "upload" && (
              <>
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-(--border-subtle) text-(--text-disabled) hover:text-(--text-faint) hover:border-(--border-medium) hover:bg-(--bg-hover) transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-(--text-muted)">Click to select a file</p>
                    <p className="text-xs text-(--text-disabled) mt-0.5">Only <span className="font-mono">.json</span> files</p>
                  </div>
                </button>
              </>
            )}

            {/* Paste tab */}
            {tab === "paste" && (
              <>
                <textarea
                  value={pasteText}
                  onChange={(e) => { setPasteText(e.target.value); clearError(); }}
                  placeholder='{ "title": "My Course", "modules": [...] }'
                  rows={8}
                  spellCheck={false}
                  className="w-full resize-none font-mono text-xs bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--border-medium) transition-colors"
                />
                <button
                  onClick={() => handleParse(pasteText)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold transition-colors"
                >
                  <FileJson className="w-4 h-4" />
                  Import
                </button>
              </>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border border-red-500/20 bg-red-500/[0.05]"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Sample JSON accordion */}
            <div className="rounded-lg border border-(--border-subtle) overflow-hidden">
              <button
                onClick={() => setShowSample((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
              >
                <span className="font-medium">View sample JSON schema</span>
                {showSample
                  ? <ChevronUp   className="w-3.5 h-3.5 text-(--text-disabled)" />
                  : <ChevronDown className="w-3.5 h-3.5 text-(--text-disabled)" />
                }
              </button>

              {showSample && (
                <div className="border-t border-(--border-subtle)">
                  <div className="flex items-center justify-between px-4 py-2 bg-(--bg-input)">
                    <p className="text-[10px] uppercase tracking-widest text-(--text-disabled)">
                      Example schema
                    </p>
                    <button
                      onClick={copySample}
                      className="flex items-center gap-1 text-[10px] font-medium text-(--text-faint) hover:text-(--brand) transition-colors"
                    >
                      {sampleCopied
                        ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" />Copied</>
                        : <><Copy className="w-3 h-3" />Copy</>
                      }
                    </button>
                  </div>
                  <pre className="px-4 py-3 text-[10px] font-mono text-(--text-faint) leading-relaxed overflow-x-auto max-h-64 bg-(--bg-base)">
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