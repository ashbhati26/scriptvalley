"use client";

import React, { useState, type SVGProps } from "react";
import ReportsList from "./ReportsList";
import UserReport from "./UserReport";
import ExperienceAdminPanel from "./Experiences";
import TeamManager from "./TeamManager";
import ContentReview from "./ContentReview";
import Overview from "./Overview";
import {
  LayoutDashboard,
  FileTextIcon,
  ChevronLeftIcon,
  GraduationCap,
  UsersRound,
  LayoutList,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "overview" | "reports" | "experiences" | "team" | "content-review";

export default function AdminLayout() {
  const [mode, setMode] = useState<Mode>("overview");
  const [reportUserId, setReportUserId] = useState<string | null>(null);

  type NavItem = {
    key: Mode;
    label: string;
    Icon: LucideIcon;
  };

  const coreNav: NavItem[] = [
    { key: "overview", label: "Overview", Icon: LayoutDashboard },
    { key: "reports", label: "User Reports", Icon: FileTextIcon },
    { key: "experiences", label: "Experiences", Icon: GraduationCap },
  ];

  const platformNav: NavItem[] = [
    { key: "team", label: "Team", Icon: UsersRound },
    { key: "content-review", label: "Content Review", Icon: LayoutList },
  ];

  function handleNavClick(key: Mode) {
    if (key === "reports") {
      setMode("reports");
      setReportUserId(null);
      return;
    }
    setMode(key);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-3rem)]">
      {/* ── Mobile tabs ───────────────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center gap-px px-3 py-2 border-b border-(--border-subtle) bg-(--bg-base) overflow-x-auto sticky top-12 z-20">
        {[...coreNav, ...platformNav].map((it) => (
          <button
            key={it.key}
            onClick={() => handleNavClick(it.key)}
            className={`shrink-0 px-3 py-1.5 rounded-md text-xs transition-colors ${
              mode === it.key
                ? "bg-(--bg-active) text-(--text-primary)"
                : "text-text-faint hover:text-text-muted hover:bg-(--bg-hover)"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>

      {/* ── Desktop sidebar ───────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-(--border-subtle) sticky top-12 h-[calc(100vh-3rem)]">
        {/* Sidebar header */}
        <div className="px-4 py-3 border-b border-(--border-subtle)">
          <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-0.5">
            Dashboard
          </p>
          <h2 className="text-sm font-medium text-(--text-primary)">
            Admin Panel
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-1.5 py-2">
          <div className="space-y-px">
            {coreNav.map((it) => (
              <NavButton
                key={it.key}
                it={it}
                mode={mode}
                onClick={() => handleNavClick(it.key)}
              />
            ))}
          </div>

          <div className="my-3 px-2">
            <p className="text-[9px] uppercase tracking-widest text-text-disabled mb-2">
              Instructor Platform
            </p>
            <div className="h-px bg-(--border-subtle)" />
          </div>

          <div className="space-y-px">
            {platformNav.map((it) => (
              <NavButton
                key={it.key}
                it={it}
                mode={mode}
                onClick={() => handleNavClick(it.key)}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-(--border-subtle)">
          <Link
            href="https://scriptvalley.com"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-disabled hover:text-text-muted transition-colors"
          >
            <ChevronLeftIcon className="w-3 h-3" /> ScriptValley
          </Link>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 px-4 py-8 md:px-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + (reportUserId ?? "")}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            {mode === "overview" && (
              <Overview
                onGoToTeam={() => setMode("team")}
                onGoToContentReview={() => setMode("content-review")}
              />
            )}
            {mode === "reports" && !reportUserId && (
              <ReportsList onSelect={(uid) => setReportUserId(uid)} />
            )}
            {mode === "reports" && reportUserId && (
              <UserReport
                userId={reportUserId}
                onBack={() => setReportUserId(null)}
              />
            )}
            {mode === "experiences" && (
              <div>
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">
                    Moderation
                  </p>
                  <h2 className="text-xl font-semibold text-(--text-primary)">
                    Interview Experiences
                  </h2>
                  <p className="mt-1 text-sm text-text-faint">
                    Review and publish submitted interview experiences.
                  </p>
                </div>
                <ExperienceAdminPanel />
              </div>
            )}
            {mode === "team" && <TeamManager />}
            {mode === "content-review" && <ContentReview />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavButton({
  it,
  mode,
  onClick,
}: {
  it: {
    key: string;
    label: string;
    Icon: LucideIcon;
  };
  mode: string;
  onClick: () => void;
}) {
  const active = mode === it.key;
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-(--bg-active) text-(--text-primary)"
          : "text-text-muted hover:bg-(--bg-hover) hover:text-text-secondary"
      }`}
    >
      {active && (
        <motion.span
          layoutId="adminNav"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.75 bg-[#3A5EFF] rounded-r-full"
        />
      )}
      <it.Icon
        className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#3A5EFF]" : "text-text-faint"}`}
      />
      <span className="truncate">{it.label}</span>
    </button>
  );
}
