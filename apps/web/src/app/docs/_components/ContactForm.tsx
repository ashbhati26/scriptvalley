"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, Loader2 } from "lucide-react";

type Field = {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
};

const FIELDS: Field[] = [
  { id: "name",    label: "Name",  placeholder: "Your name",       required: true },
  { id: "email",   label: "Email", placeholder: "you@example.com", type: "email", required: true },
  { id: "subject", label: "Subject", placeholder: "What&apos;s this about?" },
];

type Status = "idle" | "loading" | "success" | "error";

const inputBase =
  "w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:border-[#3A5EFF] focus:ring-1 focus:ring-[#3A5EFF]/20 transition-colors duration-100";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus("success");
  };

  return (
    <div id="contact" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="px-6 py-5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)] flex items-start gap-3">
        <Mail className="w-4 h-4 text-[#3A5EFF] shrink-0 mt-[3px]" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Contact</p>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Get in Touch</h2>
          <p className="mt-1.5 text-sm text-[var(--text-faint)] leading-relaxed">
            Have a question not covered in the docs? Send us a message and we&apos;ll get back to you.
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
              <p className="text-sm font-medium text-[var(--text-secondary)]">Message sent</p>
              <p className="text-xs text-[var(--text-faint)] max-w-xs">
                We&apos;ve received your message and will reply to your email shortly.
              </p>
              <button
                onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle"); }}
                className="mt-2 text-xs text-[#3A5EFF] hover:text-[#4a6aff] transition-colors"
              >
                Send another →
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELDS.slice(0, 2).map((f) => (
                  <div key={f.id} className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                      {f.label}{" "}
                      {f.required && <span className="text-[#3A5EFF]">*</span>}
                    </label>
                    <input
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      value={form[f.id as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                      className={`${inputBase} ${errors[f.id as keyof typeof errors] ? "border-red-500/40" : ""}`}
                    />
                    {errors[f.id as keyof typeof errors] && (
                      <p className="text-[10px] text-red-400">{errors[f.id as keyof typeof errors]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Subject</label>
                <input
                  type="text"
                  placeholder="What&apos;s this about?"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
                  Message <span className="text-[#3A5EFF]">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your question or issue in detail..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className={`${inputBase} resize-none ${errors.message ? "border-red-500/40" : ""}`}
                />
                {errors.message && <p className="text-[10px] text-red-400">{errors.message}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-[var(--text-disabled)]">We typically reply within 1–2 business days.</p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] disabled:opacity-50 text-white text-xs font-medium transition-colors duration-100"
                >
                  {status === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}