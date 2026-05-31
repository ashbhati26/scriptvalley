"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, AlertCircle, ChevronRight } from "lucide-react";
import { FilterKey, CourseForm } from "./courseTypes";
import { StatusChip } from "./CourseShared";
import CourseEditor from "./CourseEditor";

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function avatarColor(userId: string): { bg: string; text: string } {
  const PAIRS = [
    { bg: "rgba(58,94,255,0.12)",  text: "#3A5EFF" },
    { bg: "rgba(8,145,178,0.12)",  text: "#0891b2" },
    { bg: "rgba(124,58,237,0.12)", text: "#7c3aed" },
    { bg: "rgba(22,163,74,0.12)",  text: "#16a34a" },
    { bg: "rgba(217,119,6,0.12)",  text: "#d97706" },
    { bg: "rgba(220,38,38,0.12)",  text: "#dc2626" },
    { bg: "rgba(236,72,153,0.12)", text: "#ec4899" },
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return PAIRS[hash % PAIRS.length];
}

interface AvatarPerson { userId: string; name: string; role?: string; }

function SingleAvatar({ person, size = 22, overlap }: {
  person: AvatarPerson; size?: number; overlap?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { bg, text } = avatarColor(person.userId);
  return (
    <div
      style={{ position: "relative", display: "inline-block", marginLeft: overlap ? -6 : 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, border: "1.5px solid var(--bg-base)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 700, color: text,
        flexShrink: 0, cursor: "default",
        boxShadow: hovered ? `0 0 0 1.5px ${text}` : "none",
        transition: "box-shadow 80ms",
      }}>
        {getInitials(person.name)}
      </div>
      {hovered && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 5px)", left: "50%",
          transform: "translateX(-50%)",
          background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
          borderRadius: 5, padding: "3px 8px",
          fontSize: 11, fontWeight: 500, color: "var(--text-secondary)",
          whiteSpace: "nowrap", zIndex: 50,
          boxShadow: "var(--shadow-md)", pointerEvents: "none",
        }}>
          {person.name}
          {person.role && (
            <span style={{ marginLeft: 4, fontSize: 10, color: "var(--text-disabled)", fontWeight: 400 }}>
              {person.role}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function AuthorAvatars({ createdBy, coAuthors, myName }: {
  createdBy: string;
  coAuthors?: { userId: string; name: string; email: string }[];
  myName: string;
}) {
  const owner: AvatarPerson = { userId: createdBy, name: myName || "You", role: "owner" };
  const coList: AvatarPerson[] = (coAuthors ?? []).map(a => ({
    userId: a.userId, name: a.name, role: "co-author",
  }));
  const MAX_SHOWN = 3;
  const all = [owner, ...coList];
  const shown = all.slice(0, MAX_SHOWN);
  const overflow = all.length - MAX_SHOWN;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((person, i) => (
        <SingleAvatar key={person.userId} person={person} size={20} overlap={i > 0} />
      ))}
      {overflow > 0 && (
        <div style={{
          width: 20, height: 20, borderRadius: "50%", marginLeft: -6,
          background: "var(--bg-hover)", border: "1.5px solid var(--bg-base)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 700, color: "var(--text-faint)",
        }}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",            label: "All"       },
  { key: "draft",          label: "Drafts"    },
  { key: "pending_review", label: "In Review" },
  { key: "published",      label: "Published" },
  { key: "rejected",       label: "Rejected"  },
];

export default function CourseBuilder() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip  = !isLoaded || !isSignedIn;
  const certs = useQuery(api.courses.getMyCourses, skip ? "skip" : undefined) as any[] | undefined;

  const [editing, setEditing] = useState<CourseForm | "new" | null>(null);
  const [filter,  setFilter]  = useState<FilterKey>("all");

  const myUserId = user?.id;

  // ─── FIX: derive canEdit before rendering CourseEditor ───────────────────
  if (editing !== null) {
    const course = editing === "new" ? null : (editing as CourseForm);
    const canEdit =
      editing === "new" ||
      (course as any)?.createdBy === myUserId ||
      ((course as any)?.coAuthors ?? []).some((a: any) => a.userId === myUserId);

    return (
      <CourseEditor
        course={course}
        canEdit={!!canEdit}
        onBack={() => setEditing(null)}
      />
    );
  }

  const shown    = filter === "all" ? (certs ?? []) : (certs ?? []).filter((c: any) => c.status === filter);
  const countFor = (f: FilterKey) => !certs ? 0 : f === "all" ? certs.length : certs.filter((c: any) => c.status === f).length;

  return (
    <div style={{ padding: "36px 32px 80px", maxWidth: 700, width: "100%" }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 32 }}>
        <div>
          <h2 className="font-bold sv-text-primary" style={{ fontSize: "clamp(20px,4vw,24px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Courses
          </h2>
          <p className="text-[13px] sv-text-faint" style={{ marginTop: 8 }}>
            Create and manage your courses. Modules, lessons, MCQs and challenges.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="sv-btn-primary flex items-center gap-1.5 flex-shrink-0 text-[13px] font-medium"
          style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", letterSpacing: "-0.006em", marginTop: 2, boxShadow: "0 1px 3px rgba(58,94,255,0.25)" }}
        >
          <Plus size={13} />New Course
        </button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-px w-fit"
        style={{ marginBottom: 24, padding: 3, background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          const count  = certs !== undefined ? countFor(key) : null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 text-[12px] cursor-pointer whitespace-nowrap ${active ? "sv-tab-active" : "sv-tab-inactive"}`}
              style={{ padding: "5px 12px", letterSpacing: "-0.003em" }}
            >
              {label}
              {count !== null && count > 0 && (
                <span className={`sv-badge ${active ? "sv-badge-active" : "sv-badge-inactive"}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {certs === undefined ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="sv-card sv-pulse" style={{ height: 68 }} />)}
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center" style={{ padding: "56px 24px" }}>
          <div className="sv-icon-badge sv-bg-elevated flex items-center justify-center" style={{ width: 38, height: 38, border: "1px solid var(--border-subtle)" }}>
            <BookOpen size={15} className="sv-text-disabled" />
          </div>
          <p className="text-[13px] sv-text-faint">
            {filter === "all" ? "No courses yet" : `No ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} courses`}
          </p>
          {filter === "all" && (
            <button onClick={() => setEditing("new")} className="sv-btn-primary flex items-center gap-1.5 text-[13px]"
              style={{ padding: "8px 16px", borderRadius: "var(--radius-md)" }}>
              <Plus size={13} />Create first course
            </button>
          )}
        </div>
      ) : (
        <div className="sv-card overflow-hidden">
          <AnimatePresence mode="popLayout">
            {shown.map((c: any, i: number) => {
              const isOwn       = c.createdBy === myUserId;
              const isPublished = c.status === "published";
              return (
                <motion.div
                  key={String(c._id)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12, delay: i * 0.02 }}
                  onClick={() => setEditing(c as CourseForm)}
                  className="sv-list-row"
                  style={{ padding: "13px 16px", borderBottom: i < shown.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                >
                  <div className="sv-rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 34, height: 34,
                      background: isOwn ? "var(--brand-subtle)" : "var(--bg-hover)",
                      border: `1px solid ${isOwn ? "var(--brand-border)" : "var(--border-subtle)"}`,
                    }}>
                    <BookOpen size={14} className={isOwn ? "sv-text-brand" : "sv-text-faint"} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 4 }}>
                      <p className="text-[13px] font-medium sv-text-primary sv-truncate min-w-0 shrink" style={{ letterSpacing: "-0.008em" }}>
                        {c.title}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
                        <StatusChip status={c.status} />
                        {isPublished && (
                          <span className="text-[10px] font-medium sv-text-brand sv-bg-brand-subtle sv-rounded-xs"
                            style={{ padding: "1px 5px", border: "1px solid var(--brand-border)" }}>Live</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 3 }}>
                      <p className="text-[11px] sv-text-disabled">
                        {c.modules?.length ?? 0} module{(c.modules?.length ?? 0) !== 1 ? "s" : ""}
                        {c.description ? ` · ${c.description.slice(0, 60)}${c.description.length > 60 ? "…" : ""}` : ""}
                      </p>
                      {c.createdBy && (
                        <AuthorAvatars
                          createdBy={c.createdBy}
                          coAuthors={c.coAuthors}
                          myName={isOwn ? (user?.fullName ?? user?.firstName ?? "You") : "Instructor"}
                        />
                      )}
                    </div>
                    {c.status === "rejected" && c.rejectionReason && (
                      <p className="flex items-center gap-1 text-[11px] sv-text-danger" style={{ marginTop: 4 }}>
                        <AlertCircle size={10} className="flex-shrink-0" />{c.rejectionReason}
                      </p>
                    )}
                  </div>

                  <ChevronRight size={13} className="sv-text-disabled flex-shrink-0" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {shown.length > 0 && (
        <p className="text-[11px] sv-text-disabled" style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          {shown.length} course{shown.length !== 1 ? "s" : ""}
          {certs && myUserId && ` · ${certs.filter((c: any) => c.createdBy === myUserId).length} created by you`}
        </p>
      )}
    </div>
  );
}