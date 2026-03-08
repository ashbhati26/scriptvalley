"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, Linkedin, Building2, Briefcase,
  MapPin, DollarSign, Calendar, Plus, Trash2, ChevronDown,
  Send, Loader2, CheckCircle2,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../../packages/convex/convex/_generated/dataModel";
import type {
  RoundType, Difficulty, Outcome, InterviewRound, ExperienceFormData,
} from "@/app/experiences/types/experiences";

const ROUND_TYPES: RoundType[] = [
  "Online Assessment", "Technical Interview", "System Design",
  "HR Interview", "Managerial Round", "Group Discussion",
];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const OUTCOMES: Outcome[]        = ["Selected", "Rejected", "On Hold", "Withdrew"];

const OUTCOME_ACTIVE: Record<Outcome, string> = {
  Selected:  "border-emerald-500/30 bg-emerald-500/8 text-emerald-400",
  Rejected:  "border-red-500/30    bg-red-500/8     text-red-400",
  "On Hold": "border-amber-500/30  bg-amber-500/8   text-amber-400",
  Withdrew:  "border-[var(--border-medium)] bg-[var(--bg-hover)] text-[var(--text-muted)]",
};
const DIFF_ACTIVE: Record<Difficulty, string> = {
  Easy:   "border-emerald-500/30 bg-emerald-500/8 text-emerald-400",
  Medium: "border-amber-500/30  bg-amber-500/8   text-amber-400",
  Hard:   "border-red-500/30    bg-red-500/8     text-red-400",
};

const base =
  "w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:border-[#3A5EFF] focus:ring-1 focus:ring-[#3A5EFF]/20 transition-colors";

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
        {label}{required && <span className="text-[#3A5EFF] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}

function Card({ step, title, desc, children }: {
  step: number; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <span className="w-5 h-5 rounded-md bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[10px] font-bold text-[#3A5EFF] flex items-center justify-center shrink-0 mt-px">
          {step}
        </span>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-xs text-[var(--text-disabled)] mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

function IconInput({ icon: Icon, error, ...props }: {
  icon: React.ElementType; error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-disabled)] pointer-events-none" />
      <input {...props} className={`${base} pl-8 ${error ? "border-red-500/40" : ""}`} />
    </div>
  );
}

function RoundEditor({ round, index, onChange, onRemove }: {
  round: InterviewRound; index: number;
  onChange: (r: InterviewRound) => void; onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-base)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <span className="text-xs font-medium text-[var(--text-muted)]">Round {index + 1}</span>
        <button type="button" onClick={onRemove}
          className="p-1 rounded-md text-[var(--text-disabled)] hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" required>
            <div className="relative">
              <select value={round.type}
                onChange={(e) => onChange({ ...round, type: e.target.value as RoundType })}
                className={`${base} appearance-none pr-8`}>
                {ROUND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)] pointer-events-none" />
            </div>
          </Field>
          <Field label="Duration">
            <input type="text" placeholder="e.g. 45 min"
              value={round.duration ?? ""}
              onChange={(e) => onChange({ ...round, duration: e.target.value })}
              className={base} />
          </Field>
        </div>
        <Field label="Difficulty">
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button key={d} type="button"
                onClick={() => onChange({ ...round, difficulty: d })}
                className={`flex-1 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${
                  round.difficulty === d ? DIFF_ACTIVE[d] : "border-[var(--border-subtle)] text-[var(--text-disabled)] hover:border-[var(--border-medium)]"
                }`}>
                {d}
              </button>
            ))}
          </div>
        </Field>
        <Field label="What happened?" required>
          <textarea rows={3}
            placeholder="Questions asked, format, difficulty level, feedback…"
            value={round.description}
            onChange={(e) => onChange({ ...round, description: e.target.value })}
            className={`${base} resize-none`} />
        </Field>
      </div>
    </div>
  );
}

function Success({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden"
      >
        <div className="px-8 py-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#3A5EFF]/10 border border-[#3A5EFF]/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#3A5EFF]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              Updated & Under Review
            </h2>
            <p className="text-sm text-[var(--text-disabled)] leading-relaxed">
              Your changes have been submitted for review. We&apos;ll notify you at{" "}
              <span className="text-[var(--text-secondary)]">{email}</span> once it&apos;s published.
            </p>
          </div>
          <Link href="/experiences"
            className="mt-1 px-4 py-2 rounded-md border border-[var(--border-subtle)] text-xs text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            Browse experiences →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

type Err = Partial<Record<string, string>>;
const blank = (): InterviewRound => ({ type: "Technical Interview", description: "" });

export default function EditExperiencePage() {
  const { user, isLoaded } = useUser();
  const router  = useRouter();
  const params  = useParams();
  const slug    = params.slug as string;

  const exp = useQuery(api.experiences.getExperienceBySlugForAuthor, { slug });
  const updateMutation = useMutation(api.experiences.updateExperience);

  const [form,    setForm]    = useState<Partial<ExperienceFormData>>({});
  const [errors,  setErrors]  = useState<Err>({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [seeded,  setSeeded]  = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-in");
  }, [isLoaded, user, router]);

  // Pre-fill form once data loads
  useEffect(() => {
    if (exp && !seeded) {
      setForm({
        name:          exp.name,
        linkedinUrl:   exp.linkedinUrl,
        company:       exp.company,
        role:          exp.role,
        location:      exp.location ?? "",
        package:       exp.package ?? "",
        outcome:       exp.outcome as Outcome,
        interviewDate: exp.interviewDate,
        rounds:        exp.rounds as InterviewRound[],
        overview:      exp.overview,
        tips:          exp.tips ?? "",
      });
      setSeeded(true);
    }
  }, [exp, seeded]);

  // Not the author or not found
  useEffect(() => {
    if (exp === null) router.push("/experiences");
  }, [exp, router]);

  if (!isLoaded || !user || !seeded) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-[var(--text-disabled)] animate-spin" />
      </div>
    );
  }

  const set = (k: keyof ExperienceFormData, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = (): Err => {
    const e: Err = {};
    if (!form.name?.trim())        e.name          = "Required";
    if (!form.linkedinUrl?.trim()) e.linkedinUrl   = "Required";
    if (!form.company?.trim())     e.company       = "Required";
    if (!form.role?.trim())        e.role          = "Required";
    if (!form.interviewDate)       e.interviewDate = "Required";
    if (!form.overview?.trim())    e.overview      = "Required";
    if (!form.rounds?.length)      e.rounds        = "Add at least one round";
    form.rounds?.forEach((r, i) => {
      if (!r.description.trim()) e[`r${i}`] = "Description required";
    });
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await updateMutation({
        id:            exp!._id as Id<"experiences">,
        name:          form.name!,
        linkedinUrl:   form.linkedinUrl!,
        company:       form.company!,
        role:          form.role!,
        location:      form.location,
        package:       form.package,
        outcome:       form.outcome!,
        interviewDate: form.interviewDate!,
        rounds:        form.rounds!,
        overview:      form.overview!,
        tips:          form.tips,
      });
      setDone(true);
    } catch (err) {
      console.error("Update failed:", err);
      setErrors({ _root: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (done) return <Success email={user.primaryEmailAddress?.emailAddress ?? ""} />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-6">

        <div className="mt-8 mb-6">
          <Link href={`/experiences/${slug}`}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to experience
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Edit Experience</h1>
            <span className="px-2 py-0.5 rounded-md border border-amber-500/20 bg-amber-500/8 text-amber-400 text-[10px] font-medium">
              Will go back to review
            </span>
          </div>
          <p className="mt-1.5 text-sm text-[var(--text-disabled)] leading-relaxed">
            Update your experience. It will be re-reviewed before going live again.
          </p>
        </div>
        <div className="border-t border-[var(--border-subtle)] mb-6" />

        {errors._root && (
          <div className="mb-4 px-4 py-3 rounded-md border border-red-500/20 bg-red-500/5 text-xs text-red-400">
            {errors._root}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">

          <Card step={1} title="About you" desc="Shown publicly on your published experience">
            <Field label="Full name" required error={errors.name}>
              <IconInput icon={User} type="text" placeholder="Your name"
                value={form.name ?? ""} error={!!errors.name}
                onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="LinkedIn URL" required error={errors.linkedinUrl}>
              <IconInput icon={Linkedin} type="url" placeholder="https://linkedin.com/in/yourhandle"
                value={form.linkedinUrl ?? ""} error={!!errors.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)} />
            </Field>
          </Card>

          <Card step={2} title="Job details" desc="The role you interviewed for">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company" required error={errors.company}>
                <IconInput icon={Building2} type="text" placeholder="e.g. Google"
                  value={form.company ?? ""} error={!!errors.company}
                  onChange={(e) => set("company", e.target.value)} />
              </Field>
              <Field label="Role" required error={errors.role}>
                <IconInput icon={Briefcase} type="text" placeholder="e.g. Software Engineer"
                  value={form.role ?? ""} error={!!errors.role}
                  onChange={(e) => set("role", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location">
                <IconInput icon={MapPin} type="text" placeholder="e.g. Bangalore, Remote"
                  value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
              </Field>
              <Field label="Package (CTC)">
                <IconInput icon={DollarSign} type="text" placeholder="e.g. 24 LPA"
                  value={form.package ?? ""} onChange={(e) => set("package", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Interview month" required error={errors.interviewDate}>
                <IconInput icon={Calendar} type="month"
                  value={form.interviewDate ?? ""} error={!!errors.interviewDate}
                  onChange={(e) => set("interviewDate", e.target.value)} />
              </Field>
              <Field label="Outcome" required>
                <div className="flex flex-wrap gap-1.5">
                  {OUTCOMES.map((o) => (
                    <button key={o} type="button" onClick={() => set("outcome", o)}
                      className={`px-3 py-1.5 rounded-md border text-[11px] font-medium transition-colors ${
                        form.outcome === o
                          ? OUTCOME_ACTIVE[o]
                          : "border-[var(--border-subtle)] text-[var(--text-disabled)] hover:border-[var(--border-medium)]"
                      }`}>
                      {o}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          <Card step={3} title="Interview rounds" desc="One entry per round — be as specific as possible">
            {errors.rounds && <p className="text-[10px] text-red-400">{errors.rounds}</p>}
            <AnimatePresence initial={false}>
              {(form.rounds ?? []).map((round, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                  <RoundEditor round={round} index={i}
                    onChange={(r) => {
                      const rounds = [...(form.rounds ?? [])];
                      rounds[i] = r;
                      set("rounds", rounds);
                    }}
                    onRemove={() =>
                      set("rounds", (form.rounds ?? []).filter((_, j) => j !== i))
                    }
                  />
                  {errors[`r${i}`] && (
                    <p className="text-[10px] text-red-400 mt-1 pl-1">{errors[`r${i}`]}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button type="button"
              onClick={() => set("rounds", [...(form.rounds ?? []), blank()])}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-md border border-dashed border-[var(--border-medium)] text-xs text-[var(--text-disabled)] hover:text-[var(--text-muted)] hover:border-[var(--border-medium)] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add round
            </button>
          </Card>

          <Card step={4} title="Your write-up" desc="The main content shown on your published card">
            <Field label="Overview" required error={errors.overview}>
              <textarea rows={5}
                placeholder="Overall process — timeline, communication, culture, what stood out…"
                value={form.overview ?? ""}
                onChange={(e) => set("overview", e.target.value)}
                className={`${base} resize-none ${errors.overview ? "border-red-500/40" : ""}`} />
            </Field>
            <Field label="Tips for future candidates">
              <textarea rows={3}
                placeholder="Resources that helped, what you'd do differently, prep advice…"
                value={form.tips ?? ""}
                onChange={(e) => set("tips", e.target.value)}
                className={`${base} resize-none`} />
            </Field>
          </Card>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-[var(--text-disabled)]">
              Edits are reviewed before going live again.
            </p>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Send className="w-4 h-4" />Save & Resubmit</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}