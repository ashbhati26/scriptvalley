"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lightbulb, Bug, CheckCircle2, Loader2 } from "lucide-react";

type ReportType = "bug" | "feature" | "feedback";

const TYPES: { id: ReportType; label: string; icon: typeof Bug; desc: string }[] = [
  { id: "bug",      label: "Bug report",       icon: Bug,           desc: "Something isn&apos;t working correctly"     },
  { id: "feature",  label: "Feature request",  icon: Lightbulb,     desc: "Suggest something new or improved"    },
  { id: "feedback", label: "General feedback", icon: AlertTriangle, desc: "Share thoughts on your experience"    },
];

const SEVERITY = ["Low", "Medium", "High", "Critical"];

type Status = "idle" | "loading" | "success";

const inputBase =
  "w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:border-[#3A5EFF] focus:ring-1 focus:ring-[#3A5EFF]/20 transition-colors duration-100";

export default function FeedbackForm() {
  const [type, setType]         = useState<ReportType>("bug");
  const [severity, setSeverity] = useState("Medium");
  const [title, setTitle]       = useState("");
  const [steps, setSteps]       = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual]     = useState("");
  const [message, setMessage]   = useState("");
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState<Status>("idle");

  const selectedType = TYPES.find((t) => t.id === type)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("loading");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, severity, title, steps, expected, actual, message, email }),
      });
      if (!response.ok) throw new Error("Failed to submit report");
      setStatus("success");
      setTitle(""); setSteps(""); setExpected(""); setActual(""); setMessage(""); setEmail("");
      setSeverity("Medium"); setType("bug");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="px-6 py-5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)] flex items-start gap-3">
        <Bug className="w-4 h-4 text-[#3A5EFF] shrink-0 mt-[3px]" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Feedback</p>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Report a Bug / Feedback</h2>
          <p className="mt-1.5 text-sm text-[var(--text-faint)] leading-relaxed">
            Found something broken? Have a suggestion? Every report is read and considered.
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-[#3A5EFF]" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">Report received</p>
              <p className="text-xs text-[var(--text-faint)] max-w-xs">
                Thank you. We&apos;ll investigate and follow up if we need more details.
              </p>
              <button
                onClick={() => { setTitle(""); setSteps(""); setExpected(""); setActual(""); setMessage(""); setStatus("idle"); }}
                className="mt-2 text-xs text-[#3A5EFF] hover:text-[#4a6aff] transition-colors"
              >
                Submit another →
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Report type</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TYPES.map(({ id, label, icon: Icon, desc }) => {
                    const active = type === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setType(id)}
                        className={`flex flex-col gap-1 px-3 py-2.5 rounded-md border text-left transition-colors duration-100 ${
                          active
                            ? "border-[#3A5EFF]/40 bg-[#3A5EFF]/5"
                            : "border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--border-medium)]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3 h-3 ${active ? "text-[#3A5EFF]" : "text-[var(--text-disabled)]"}`} />
                          <span className={`text-xs font-medium ${active ? "text-[var(--text-secondary)]" : "text-[var(--text-faint)]"}`}>
                            {label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-disabled)] leading-tight">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Title <span className="text-[#3A5EFF]">*</span>
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === "bug" ? "e.g. AI Fix button throws 500 on Python runs"
                    : type === "feature" ? "e.g. Dark/light theme toggle in editor"
                    : "Brief summary of your feedback"
                  }
                  className={inputBase}
                />
              </div>

              <AnimatePresence initial={false}>
                {type === "bug" && (
                  <motion.div
                    key="bug-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Severity</label>
                      <div className="flex gap-2">
                        {SEVERITY.map((s) => {
                          const active = severity === s;
                          const accent =
                            s === "Critical" ? "border-red-500/40 bg-red-500/5 text-red-400"
                            : s === "High"   ? "border-orange-500/30 bg-orange-500/5 text-orange-400"
                            : s === "Medium" ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
                            : "border-[var(--border-subtle)] bg-[var(--bg-hover)] text-[var(--text-muted)]";
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSeverity(s)}
                              className={`px-3 py-1 rounded-md border text-[11px] font-medium transition-colors duration-100 ${
                                active ? accent : "border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-disabled)] hover:border-[var(--border-medium)]"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Steps to reproduce</label>
                      <textarea
                        rows={3}
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        placeholder={"1. Go to the Compiler\n2. Select Python\n3. Click Run\n4. Click AI Fix"}
                        className={`${inputBase} resize-none font-mono text-xs`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Expected behaviour</label>
                        <textarea rows={2} value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="What should have happened?" className={`${inputBase} resize-none`} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Actual behaviour</label>
                        <textarea rows={2} value={actual} onChange={(e) => setActual(e.target.value)} placeholder="What actually happened?" className={`${inputBase} resize-none`} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  {type === "bug" ? "Additional context" : "Details"}{" "}
                  {type !== "bug" && <span className="text-[#3A5EFF]">*</span>}
                </label>
                <textarea
                  rows={4}
                  required={type !== "bug"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "bug" ? "Browser, OS, any other context that might help…"
                    : type === "feature" ? "Describe the feature in as much detail as you&apos;d like…"
                    : "Share whatever is on your mind…"
                  }
                  className={`${inputBase} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Email <span className="text-[var(--text-disabled)]">(optional, for follow-up)</span>
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputBase} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-[var(--text-disabled)]">All reports are reviewed by the team.</p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] disabled:opacity-50 text-white text-xs font-medium transition-colors duration-100"
                >
                  {status === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <selectedType.icon className="w-3.5 h-3.5" />}
                  {status === "loading" ? "Submitting…" : "Submit report"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}