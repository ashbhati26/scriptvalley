"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { Bell, Sun, Moon, X, Clock, AlertCircle, CheckCircle2, BookOpen, Code2, RotateCcw } from "lucide-react";

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("sv-theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("sv-theme", "light"); }
  }, [dark]);
  return [dark, setDark] as const;
}

// ─── Notification item ────────────────────────────────────────────────────────

function NotifItem({ icon: Icon, iconColor, iconBg, title, sub, meta, border }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconColor: string; iconBg: string;
  title: string; sub?: string; meta?: string;
  border?: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 14px",
      borderTop: border ?? "1px solid var(--border-subtle)",
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={12} style={{ color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.005em" }}>
          {title}
        </p>
        {sub && (
          <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2, lineHeight: 1.4, letterSpacing: "-0.003em" }}>
            {sub}
          </p>
        )}
      </div>
      {meta && (
        <p style={{ fontSize: 10, color: "var(--text-disabled)", flexShrink: 0, marginTop: 1 }}>{meta}</p>
      )}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function NotifSection({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ padding: "8px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-disabled)" }}>
        {label}
      </p>
      <span style={{ fontSize: 10, color: "var(--text-disabled)", background: "var(--bg-hover)", padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border-subtle)" }}>
        {count}
      </span>
    </div>
  );
}

// ─── Date helper ─────────────────────────────────────────────────────────────

function timeAgoShort(ts: number) {
  const diff = Date.now() - ts;
  const d = Math.floor(diff / 86_400_000);
  if (d > 30)  return `${Math.floor(d / 30)}mo`;
  if (d >= 1)  return `${d}d`;
  const h = Math.floor(diff / 3_600_000);
  if (h >= 1)  return `${h}h`;
  const m = Math.floor(diff / 60_000);
  if (m >= 1)  return `${m}m`;
  return "now";
}

// ─── Real notification panel ──────────────────────────────────────────────────

function NotifPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const courses = useQuery(api.courses.getMyCourses) as any[] | undefined;
  const sheets  = useQuery(api.sheets.getMySheets) as any[] | undefined;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const isLoading = courses === undefined || sheets === undefined;

  // Filter to items owned by this user only
  const myCourses = (courses ?? []).filter((c: any) => c.createdBy === userId);
  const mySheets  = (sheets  ?? []).filter((s: any) => s.createdBy === userId);

  const rejected = [
    ...myCourses.filter((c: any) => c.status === "rejected").map((c: any) => ({ type: "Course" as const,    title: c.title,  reason: c.rejectionReason, ts: c.updatedAt ?? c.createdAt })),
    ...mySheets.filter((s: any)  => s.status === "rejected").map((s: any) => ({ type: "DSA Sheet" as const, title: s.name,   reason: s.rejectionReason, ts: s.updatedAt ?? s.createdAt })),
  ].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));

  const pending = [
    ...myCourses.filter((c: any) => c.status === "pending_review").map((c: any) => ({ type: "Course" as const,    title: c.title, ts: c.updatedAt ?? c.createdAt })),
    ...mySheets.filter((s: any)  => s.status === "pending_review").map((s: any) => ({ type: "DSA Sheet" as const, title: s.name,  ts: s.updatedAt ?? s.createdAt })),
  ].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));

  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const published = [
    ...myCourses.filter((c: any) => c.status === "published" && (c.updatedAt ?? c.createdAt) > sevenDaysAgo).map((c: any) => ({ type: "Course" as const,    title: c.title, ts: c.updatedAt ?? c.createdAt })),
    ...mySheets.filter((s: any)  => s.status === "published"  && (s.updatedAt ?? s.createdAt) > sevenDaysAgo).map((s: any) => ({ type: "DSA Sheet" as const, title: s.name,  ts: s.updatedAt ?? s.createdAt })),
  ].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));

  const isEmpty = !isLoading && rejected.length === 0 && pending.length === 0 && published.length === 0;

  return (
    <div
      style={{
        position: "absolute", zIndex: 100,
        top: "calc(100% + 8px)", right: 0,
        width: "min(320px, calc(100vw - 24px))",
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Notifications
        </span>
        <button onClick={onClose} aria-label="Close"
          style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", borderRadius: 5 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Body */}
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {isLoading ? (
          <div style={{ padding: "28px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[80, 60, 90].map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0" }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-hover)", flexShrink: 0 }} className="sv-pulse" />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 12, width: `${w}%`, background: "var(--bg-hover)", borderRadius: 3, marginBottom: 5 }} className="sv-pulse" />
                  <div style={{ height: 10, width: "50%", background: "var(--bg-hover)", borderRadius: 3 }} className="sv-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div style={{ padding: "36px 16px", textAlign: "center" }}>
            <Bell size={22} style={{ color: "var(--text-disabled)", margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 3 }}>You're all caught up</p>
            <p style={{ fontSize: 11, color: "var(--text-disabled)" }}>Review updates will appear here</p>
          </div>
        ) : (
          <>
            {/* Rejected — needs action */}
            {rejected.length > 0 && (
              <>
                <NotifSection label="Needs attention" count={rejected.length} />
                {rejected.map((item, i) => (
                  <NotifItem
                    key={i}
                    icon={AlertCircle}
                    iconColor="var(--danger)"
                    iconBg="var(--danger-bg)"
                    title={item.title}
                    sub={item.reason ? `Rejected: ${item.reason}` : "Rejected by admin — open to resubmit"}
                    meta={item.ts ? timeAgoShort(item.ts) : undefined}
                    border={i === 0 ? "none" : "1px solid var(--border-subtle)"}
                  />
                ))}
              </>
            )}

            {/* In review */}
            {pending.length > 0 && (
              <>
                <NotifSection label="Under review" count={pending.length} />
                {pending.map((item, i) => (
                  <NotifItem
                    key={i}
                    icon={RotateCcw}
                    iconColor="var(--warning)"
                    iconBg="var(--warning-bg)"
                    title={item.title}
                    sub={`${item.type} · Waiting for admin review`}
                    meta={item.ts ? timeAgoShort(item.ts) : undefined}
                    border={i === 0 ? "none" : "1px solid var(--border-subtle)"}
                  />
                ))}
              </>
            )}

            {/* Recently published */}
            {published.length > 0 && (
              <>
                <NotifSection label="Recently published" count={published.length} />
                {published.map((item, i) => (
                  <NotifItem
                    key={i}
                    icon={CheckCircle2}
                    iconColor="var(--success)"
                    iconBg="var(--success-bg)"
                    title={item.title}
                    sub={`${item.type} · Published and live`}
                    meta={item.ts ? timeAgoShort(item.ts) : undefined}
                    border={i === 0 ? "none" : "1px solid var(--border-subtle)"}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function InstructorNavbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const profile  = useQuery(api.instructors.getMyProfile, isLoaded && isSignedIn ? undefined : "skip") as any | undefined;
  const courses   = useQuery(api.courses.getMyCourses,    isLoaded && isSignedIn ? undefined : "skip") as any[] | undefined;
  const sheets    = useQuery(api.sheets.getMySheets, isLoaded && isSignedIn ? undefined : "skip") as any[] | undefined;
  const [dark, setDark] = useDarkMode();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userId = user?.id ?? "";
  const badgeCount = [
    ...(courses ?? []).filter((c: any) => c.createdBy === userId && (c.status === "rejected" || c.status === "pending_review")),
    ...(sheets  ?? []).filter((s: any) => s.createdBy === userId && (s.status === "rejected" || s.status === "pending_review")),
  ].length;

  useEffect(() => {
    function h(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    if (notifOpen) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [notifOpen]);

  return (
    <header
      className="sv-bg-base sv-navbar-height sv-sticky-top flex items-center justify-between flex-shrink-0 gap-3"
      style={{ borderBottom: "1px solid var(--border-subtle)", paddingInline: "clamp(12px,3vw,20px)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <div
          className="sv-bg-brand flex items-center justify-center flex-shrink-0 sv-rounded-md"
          style={{ width: 22, height: 22 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 6L5 9.5L10.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span
          className="text-[14px] font-bold sv-text-primary urbanist flex-shrink-0"
          style={{ letterSpacing: "-0.02em" }}
        >
          ScriptValley
        </span>
        <span id="nb-slash" className="text-[14px] sv-text-disabled select-none flex-shrink-0 hidden">
          /
        </span>
        <span id="nb-section" className="text-[13px] sv-text-muted sv-truncate hidden" style={{ letterSpacing: "-0.01em" }}>
          Instructor
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {profile && !profile.isApproved && (
          <div
            id="nb-pending"
            className="hidden items-center gap-1.5 sv-rounded-full sv-bg-warning-bg"
            style={{ padding: "3px 9px", border: "1px solid var(--warning-border)", marginRight: 6 }}
          >
            <Clock size={10} className="sv-text-warning flex-shrink-0" />
            <span className="text-[11px] font-medium sv-text-warning whitespace-nowrap" style={{ letterSpacing: "0.01em" }}>
              Pending approval
            </span>
          </div>
        )}
        {profile?.name && (
          <span
            id="nb-uname"
            className="text-[13px] sv-text-faint sv-truncate hidden"
            style={{ marginRight: 4, maxWidth: 110, letterSpacing: "-0.01em" }}
          >
            {profile.name}
          </span>
        )}

        {/* Divider */}
        <div className="flex-shrink-0" style={{ width: 1, height: 16, background: "var(--border-subtle)", marginInline: 3 }} />

        {/* Dark mode */}
        <button
          onClick={() => setDark((d) => !d)}
          title={dark ? "Light mode" : "Dark mode"}
          className="sv-btn-ghost flex items-center justify-center sv-rounded-lg flex-shrink-0"
          style={{ width: 30, height: 30 }}
        >
          {dark ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <div className="flex-shrink-0" style={{ width: 1, height: 16, background: "var(--border-subtle)", marginInline: 3 }} />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            title="Notifications"
            className="sv-btn-ghost flex items-center justify-center sv-rounded-lg flex-shrink-0"
            style={{ width: 30, height: 30, background: notifOpen ? "var(--bg-active)" : undefined, position: "relative" }}
          >
            <Bell size={15} />
            {badgeCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                width: 15, height: 15, borderRadius: "50%",
                background: "var(--danger)", border: "1.5px solid var(--bg-base)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 700, color: "white", pointerEvents: "none",
                lineHeight: 1,
              }}>
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            )}
          </button>
          {notifOpen && <NotifPanel userId={userId} onClose={() => setNotifOpen(false)} />}
        </div>

        <div className="flex-shrink-0" style={{ width: 1, height: 16, background: "var(--border-subtle)", marginInline: 3 }} />

        <UserButton afterSignOutUrl="/" />
      </div>

      <style>{`
        @media (min-width: 640px) {
          #nb-slash   { display: inline      !important; }
          #nb-section { display: inline      !important; }
          #nb-uname   { display: inline      !important; }
          #nb-pending { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}