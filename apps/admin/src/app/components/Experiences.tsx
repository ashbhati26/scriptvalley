"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Linkedin,
  Clock,
  ChevronDown,
  Search,
  Loader2,
  Users,
  BookOpen,
  ThumbsUp,
  Calendar,
  MapPin,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import type { ExpStatus } from "../../types/experiences";

const STATUS_DOT: Record<ExpStatus, string> = {
  pending: "bg-amber-400",
  published: "bg-emerald-400",
  rejected: "bg-red-400",
};

const STATUS_BADGE: Record<ExpStatus, string> = {
  pending: "text-amber-400   border-amber-500/20   bg-amber-500/[0.08]",
  published: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.08]",
  rejected: "text-red-400     border-red-500/20     bg-red-500/[0.05]",
};

const OUTCOME_BADGE: Record<string, string> = {
  Selected: "border-emerald-500/20 text-emerald-400",
  Rejected: "border-red-500/20    text-red-400",
  "On Hold": "border-amber-500/20  text-amber-400",
  Withdrew: "border-(--border-subtle) text-text-faint",
};

const DIFF_CHIP: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20",
  Medium: "text-amber-400   bg-amber-500/[0.08]   border-amber-500/20",
  Hard: "text-red-400     bg-red-500/[0.08]     border-red-500/20",
};

type Experience = {
  _id: Id<"experiences">;
  slug: string;
  name: string;
  email?: string;
  linkedinUrl: string;
  company: string;
  role: string;
  location?: string;
  package?: string;
  outcome: string;
  interviewDate: string;
  rounds: {
    type: string;
    description: string;
    duration?: string;
    difficulty?: string;
  }[];
  overview: string;
  tips?: string;
  status: string;
  createdAt: number;
  publishedAt?: number;
};

function Row({
  exp,
  onPublish,
  onReject,
  onDelete,
  actioning,
}: {
  exp: Experience;
  onPublish: (id: Id<"experiences">) => void;
  onReject: (id: Id<"experiences">) => void;
  onDelete: (id: Id<"experiences">) => void;
  actioning: "publish" | "reject" | "delete" | null;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submitted = new Date(exp.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const month = exp.interviewDate
    ? new Date(exp.interviewDate + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";
  const status = exp.status as ExpStatus;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(exp._id);
  };

  return (
    <div className="border-b border-border-default last:border-0">
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-(--bg-elevated) transition-colors select-none"
        onClick={() => setOpen((p) => !p)}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status]}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium text-text-secondary truncate">
              {exp.company}
            </p>
            <span
              className={`px-1.5 py-0.5 rounded border text-[9px] font-medium ${OUTCOME_BADGE[exp.outcome] ?? "border-(--border-subtle) text-text-faint"}`}
            >
              {exp.outcome}
            </span>
          </div>
          <p className="text-xs text-text-disabled truncate">
            {exp.role} · {exp.name}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-[10px] text-text-disabled">
            <Clock className="w-3 h-3" />
            {submitted}
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[9px] font-medium ${STATUS_BADGE[status]}`}
          >
            {status}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-text-disabled shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 bg-(--bg-elevated) border-t border-border-default space-y-4 pt-4">
              {/* Author + meta */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center text-sm font-semibold text-text-faint">
                    {exp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-secondary">
                      {exp.name}
                    </p>
                    {exp.email && (
                      <p className="text-[10px] text-text-disabled">
                        {exp.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                  {exp.location && (
                    <span className="flex items-center gap-1 text-[10px] text-text-disabled">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  )}
                  {exp.package && (
                    <span className="text-[10px] text-text-disabled">
                      · {exp.package}
                    </span>
                  )}
                  {month && (
                    <span className="flex items-center gap-1 text-[10px] text-text-disabled">
                      <Calendar className="w-3 h-3" />
                      {month}
                    </span>
                  )}
                  <a
                    href={exp.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[10px] text-text-disabled hover:text-[#0077b5] transition-colors"
                  >
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </a>
                </div>
              </div>

              {/* Overview */}
              <div>
                <p className="text-[9px] uppercase tracking-widest text-text-disabled mb-1.5">
                  Overview
                </p>
                <p className="text-xs text-text-faint leading-relaxed">
                  {exp.overview}
                </p>
              </div>

              {/* Rounds */}
              <div>
                <p className="text-[9px] uppercase tracking-widest text-text-disabled mb-2">
                  Rounds ({exp.rounds.length})
                </p>
                <div className="space-y-2.5">
                  {exp.rounds.map((r, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="w-4 h-4 rounded bg-(--bg-hover) border border-(--border-subtle) text-[9px] font-bold text-text-disabled flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-[10px] font-semibold text-text-muted">
                            {r.type}
                          </p>
                          {r.difficulty && (
                            <span
                              className={`px-1 py-0.5 rounded border text-[8px] font-medium ${DIFF_CHIP[r.difficulty] ?? "border-(--border-subtle) text-text-disabled"}`}
                            >
                              {r.difficulty}
                            </span>
                          )}
                          {r.duration && (
                            <span className="text-[9px] text-text-disabled">
                              {r.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-faint leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {exp.tips && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-text-disabled mb-1.5">
                    Tips
                  </p>
                  <p className="text-xs text-text-faint leading-relaxed">
                    {exp.tips}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {status === "pending" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublish(exp._id);
                      }}
                      disabled={!!actioning}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-400 hover:bg-emerald-500/15 disabled:opacity-50 transition-colors"
                    >
                      {actioning === "publish" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      Publish
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(exp._id);
                      }}
                      disabled={!!actioning}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-red-500/20 bg-red-500/5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    >
                      {actioning === "reject" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Reject
                    </button>
                  </>
                )}

                {status === "published" && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Published
                  </span>
                )}
                {status === "rejected" && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400">
                    <XCircle className="w-3 h-3" /> Rejected
                  </span>
                )}

                {/* Delete — available for all statuses */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDeleteClick}
                    disabled={actioning === "delete"}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs transition-colors disabled:opacity-50 ${
                      confirmDelete
                        ? "border-red-500/40 bg-red-500/10 text-red-400"
                        : "border-(--border-subtle) text-text-disabled hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
                    }`}
                  >
                    {actioning === "delete" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    {confirmDelete ? "Confirm delete?" : "Delete"}
                  </button>
                  {confirmDelete && actioning !== "delete" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(false);
                      }}
                      className="text-[9px] text-text-disabled hover:text-text-muted"
                    >
                      cancel
                    </button>
                  )}
                </div>

                <a
                  href={`/experiences/${exp.slug}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto flex items-center gap-1 text-[10px] text-text-disabled hover:text-text-muted transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  {status === "published" ? "View live" : "Preview"}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type TabId = ExpStatus | "all";

export default function ExperienceAdminPanel() {
  const allExperiences = useQuery(api.experiences.getAllExperiencesAdmin) ?? [];
  const publishMutation = useMutation(api.experiences.publishExperience);
  const rejectMutation = useMutation(api.experiences.rejectExperience);
  const deleteMutation = useMutation(api.experiences.adminDeleteExperience);

  const [tab, setTab] = useState<TabId>("pending");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<{
    id: Id<"experiences">;
    type: "publish" | "reject" | "delete";
  } | null>(null);

  const handlePublish = async (id: Id<"experiences">) => {
    setActing({ id, type: "publish" });
    try {
      await publishMutation({ id });
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id: Id<"experiences">) => {
    setActing({ id, type: "reject" });
    try {
      await rejectMutation({ id });
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (id: Id<"experiences">) => {
    setActing({ id, type: "delete" });
    try {
      await deleteMutation({ id });
    } finally {
      setActing(null);
    }
  };

  const pending = allExperiences.filter((e) => e.status === "pending").length;
  const published = allExperiences.filter(
    (e) => e.status === "published",
  ).length;
  const rejected = allExperiences.filter((e) => e.status === "rejected").length;

  const filtered = useMemo(
    () =>
      allExperiences.filter((e) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          [e.company, e.role, e.name].some((s) => s.toLowerCase().includes(q));
        const matchTab = tab === "all" || e.status === tab;
        return matchSearch && matchTab;
      }),
    [allExperiences, tab, search],
  );

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: "All", count: allExperiences.length },
    { id: "pending", label: "Pending", count: pending },
    { id: "published", label: "Published", count: published },
    { id: "rejected", label: "Rejected", count: rejected },
  ];

  const isLoading = allExperiences === undefined;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Users,
            label: "Total",
            v: allExperiences.length,
            c: "text-text-secondary",
          },
          { icon: BookOpen, label: "Pending", v: pending, c: "text-amber-400" },
          {
            icon: ThumbsUp,
            label: "Published",
            v: published,
            c: "text-emerald-400",
          },
        ].map(({ icon: Icon, label, v, c }) => (
          <div
            key={label}
            className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) px-4 py-3 flex items-center gap-3"
          >
            <Icon className={`w-4 h-4 ${c} shrink-0`} />
            <div>
              <p className={`text-lg font-semibold ${c}`}>{v}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-disabled">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Panel */}
      <div className="rounded-lg border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-border-default bg-bg-input flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex gap-px flex-wrap">
            {TABS.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  tab === id
                    ? "bg-(--bg-active) text-text-primary"
                    : "text-text-faint hover:text-text-secondary hover:bg-(--bg-hover)"
                }`}
              >
                {label}
                <span className="ml-1.5 text-[9px] text-text-disabled">
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative sm:ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-disabled pointer-events-none" />
            <input
              type="text"
              placeholder="Search company, role, name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-(--bg-base) border border-(--border-subtle) rounded-md pl-7 pr-3 py-1.5 text-xs text-text-secondary placeholder:text-text-disabled focus:outline-none focus:border-[#3A5EFF]/40 w-52 transition-colors"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:flex items-center gap-3 px-5 py-2 border-b border-border-default bg-bg-input">
          <span className="w-2" />
          <span className="flex-1 text-[9px] uppercase tracking-widest text-text-disabled">
            Company / Author
          </span>
          <span className="w-28 text-[9px] uppercase tracking-widest text-text-disabled">
            Submitted
          </span>
          <span className="w-20 text-[9px] uppercase tracking-widest text-text-disabled">
            Status
          </span>
          <span className="w-4" />
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="py-14 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-text-disabled animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-2">
            <BookOpen className="w-6 h-6 text-text-disabled" />
            <p className="text-xs text-text-faint">
              {search
                ? "No results for your search"
                : `No ${tab === "all" ? "" : tab} experiences`}
            </p>
          </div>
        ) : (
          filtered.map((exp) => (
            <Row
              key={exp._id}
              exp={exp as Experience}
              onPublish={handlePublish}
              onReject={handleReject}
              onDelete={handleDelete}
              actioning={acting?.id === exp._id ? acting.type : null}
            />
          ))
        )}
      </div>
    </div>
  );
}