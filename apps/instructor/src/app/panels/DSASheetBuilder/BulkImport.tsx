"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Question, Difficulty, DIFFICULTY_COLOR } from "./sheetTypes";

interface ParsedQuestion { title: string; url: string; platform: string; difficulty: Difficulty; valid: boolean; error?: string; }

function detectPlatform(url: string): string {
  if (url.includes("leetcode.com"))      return "leetcode";
  if (url.includes("geeksforgeeks.org")) return "gfg";
  if (url.includes("hackerrank.com"))    return "hackerrank";
  if (url.includes("hackerearth.com"))   return "hackerearth";
  if (url.includes("codechef.com"))      return "codechef";
  if (url.includes("codeforces.com"))    return "codeforces";
  return "others";
}

function extractTitle(url: string): string {
  try {
    const u = new URL(url);
    const leet = u.pathname.match(/\/problems\/([^/]+)/);
    if (leet) return leet[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length) return parts[parts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {}
  return "";
}

function parseLines(raw: string): ParsedQuestion[] {
  return raw.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    let title = "", url = "", difficulty: Difficulty = "Medium";
    if (parts.length >= 2) {
      title = parts[0]; url = parts[1];
      if (parts[2] && ["Easy", "Medium", "Hard"].includes(parts[2].trim())) difficulty = parts[2].trim() as Difficulty;
    } else { url = parts[0]; title = extractTitle(url); }
    let valid = true, error: string | undefined;
    try { new URL(url); } catch { valid = false; error = "Invalid URL"; }
    return { title: title || extractTitle(url) || url, url, platform: detectPlatform(url), difficulty, valid, error };
  });
}

interface Props { onImport: (questions: Question[]) => void; onClose: () => void; }

export default function BulkImport({ onImport, onClose }: Props) {
  const [raw,    setRaw]    = useState("");
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [step,   setStep]   = useState<"input" | "preview">("input");

  function handleParse() { setParsed(parseLines(raw)); setStep("preview"); }
  function handleImport() {
    onImport(parsed.filter((p) => p.valid).map((p) => ({ title: p.title, difficulty: p.difficulty, link: { platform: p.platform, url: p.url } })));
    onClose();
  }

  const validCount   = parsed.filter((p) => p.valid).length;
  const invalidCount = parsed.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
        className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full sv-bg-elevated overflow-hidden"
        style={{ maxWidth: 520, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-xl)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between sv-bg-hover"
          style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 sv-rounded-sm"
              style={{ width: 30, height: 30, background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}>
              <Download size={13} className="sv-text-brand" />
            </div>
            <div>
              <p className="text-[13px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.01em" }}>Bulk Import</p>
              <p className="text-[11px] sv-text-faint" style={{ marginTop: 2 }}>Paste URLs or: Title | URL | Difficulty</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center flex-shrink-0 sv-text-muted sv-bg-active sv-rounded-sm cursor-pointer"
            style={{ width: 28, height: 28, border: "1px solid var(--border-subtle)" }}>
            <X size={13} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: 20 }}>
          <AnimatePresence mode="wait">

            {/* Input step */}
            {step === "input" && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={9}
                  placeholder={`Paste URLs or use format:\nTwo Sum | https://leetcode.com/problems/two-sum/ | Easy\nhttps://leetcode.com/problems/merge-intervals/`}
                  className="w-full resize-none sv-bg-input sv-text-secondary outline-none sv-rounded-lg"
                  style={{ border: "1px solid var(--border-default)", padding: "12px 14px", fontSize: 12, fontFamily: "var(--font-mono)", lineHeight: 1.7, transition: "border-color 80ms, box-shadow 80ms" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-subtle)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }} />
                <div className="flex justify-end">
                  <button onClick={handleParse} disabled={!raw.trim()} className="sv-btn-primary flex items-center gap-1.5 text-[13px] font-medium"
                    style={{ padding: "8px 18px", borderRadius: "var(--radius-md)", opacity: raw.trim() ? 1 : 0.45, cursor: raw.trim() ? "pointer" : "not-allowed", boxShadow: raw.trim() ? "0 1px 3px rgba(58,94,255,0.25)" : "none" }}>
                    <Download size={11} />Parse
                  </button>
                </div>
              </motion.div>
            )}

            {/* Preview step */}
            {step === "preview" && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Summary */}
                <div className="flex items-center gap-3 sv-bg-hover sv-rounded-md"
                  style={{ padding: "10px 14px", border: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center gap-1.5 text-[12px]">
                    <CheckCircle2 size={13} className="sv-text-success flex-shrink-0" />
                    <span className="font-medium sv-text-success">{validCount} valid</span>
                  </div>
                  {invalidCount > 0 && (
                    <>
                      <div className="flex-shrink-0" style={{ width: 1, height: 14, background: "var(--border-subtle)" }} />
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <AlertCircle size={13} className="sv-text-danger flex-shrink-0" />
                        <span className="font-medium sv-text-danger">{invalidCount} invalid — skipped</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Preview list */}
                <div className="sv-bg-input sv-rounded-lg overflow-y-auto"
                  style={{ maxHeight: 240, padding: 10, border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 4 }}>
                  {parsed.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] sv-rounded-sm"
                      style={{ padding: "7px 10px", background: p.valid ? "var(--bg-elevated)" : "var(--danger-bg)", border: `1px solid ${p.valid ? "var(--border-subtle)" : "var(--danger-border)"}` }}>
                      <span className="flex-shrink-0 text-[10px] font-medium"
                        style={{ padding: "2px 7px", borderRadius: "100px", color: DIFFICULTY_COLOR[p.difficulty], background: `${DIFFICULTY_COLOR[p.difficulty]}14`, border: `1px solid ${DIFFICULTY_COLOR[p.difficulty]}30` }}>
                        {p.difficulty}
                      </span>
                      <span className="flex-1 sv-text-secondary sv-truncate" style={{ letterSpacing: "-0.005em" }}>{p.title}</span>
                      <span className="flex-shrink-0 text-[10px] sv-text-disabled uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}>{p.platform}</span>
                      {!p.valid && <span className="flex-shrink-0 text-[10px] sv-text-danger">{p.error}</span>}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep("input")} className="flex items-center gap-1 text-[12px] sv-text-faint sv-btn-ghost" style={{ padding: "4px 0" }}>
                    <ArrowLeft size={11} />Edit input
                  </button>
                  <div className="flex gap-2">
                    <button onClick={onClose} className="text-[12px] sv-text-muted sv-bg-hover sv-rounded-md cursor-pointer"
                      style={{ padding: "7px 14px", border: "1px solid var(--border-default)" }}>
                      Cancel
                    </button>
                    <button onClick={handleImport} disabled={validCount === 0} className="sv-btn-primary text-[12px] font-medium"
                      style={{ padding: "7px 16px", borderRadius: "var(--radius-md)", opacity: validCount === 0 ? 0.4 : 1, cursor: validCount === 0 ? "not-allowed" : "pointer", boxShadow: validCount > 0 ? "0 1px 3px rgba(58,94,255,0.25)" : "none" }}>
                      Import {validCount} question{validCount !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}