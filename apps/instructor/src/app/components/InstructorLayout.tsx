"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Code2, User,
  ChevronLeft, Menu,
} from "lucide-react";
import InstructorNavbar  from "./InstructorNavbar";
import Overview          from "./panels/Overview";
import CourseBuilder     from "./panels/CourseBuilder/CourseBuilder";
import DSASheetBuilder   from "./panels/DSASheetBuilder";
import ProfilePanel      from "./panels/ProfilePanel";

export type Mode = "overview" | "courses" | "sheets" | "profile";

const NAV: { key: Mode; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "overview", label: "Overview",   Icon: LayoutDashboard },
  { key: "courses",  label: "Courses",    Icon: BookOpen        },
  { key: "sheets",   label: "DSA Sheets", Icon: Code2           },
  { key: "profile",  label: "Profile",    Icon: User            },
];

/* ─── Layout ─────────────────────────────────────────────────────────────── */
export default function InstructorLayout() {
  const [mode,       setMode]   = useState<Mode>("overview");
  const [drawerOpen, setDrawer] = useState(false);

  function navigate(m: Mode) { setMode(m); setDrawer(false); }

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-base)">
      <InstructorNavbar />
      <div className="flex flex-1 min-h-0">

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="bd"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
                className="fixed inset-0 z-30 bg-black/40 md:hidden"
              />
              <motion.aside
                key="dr"
                initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed left-0 top-12 bottom-0 z-40 w-56 bg-(--bg-base) border-r border-(--border-subtle) flex flex-col md:hidden"
              >
                <Sidebar mode={mode} navigate={navigate} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-(--border-subtle) sticky top-12 h-[calc(100vh-3rem)]">
          <Sidebar mode={mode} navigate={navigate} />
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile topbar */}
          <div className="md:hidden flex items-center gap-2 px-4 h-10 border-b border-(--border-subtle) bg-(--bg-base) sticky top-0 z-20">
            <button
              onClick={() => setDrawer(true)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:bg-(--bg-hover) transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-(--text-muted)">
              {NAV.find((n) => n.key === mode)?.label}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.13, ease: "easeOut" }}
            >
              {mode === "overview" && <Overview onNavigate={navigate} />}
              {mode === "courses"  && <CourseBuilder />}
              {mode === "sheets"   && <DSASheetBuilder />}
              {mode === "profile"  && <ProfilePanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  mode, navigate,
}: {
  mode: Mode; navigate: (m: Mode) => void;
}) {
  return (
    <>
      <div className="px-4 py-3 border-b border-(--border-subtle)">
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Workspace</p>
        <h2 className="text-sm font-medium text-(--text-primary)">Instructor Panel</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-1.5 py-2 space-y-px scrollbar-hide">
        {NAV.map(({ key, label, Icon }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              onClick={() => navigate(key)}
              className={[
                "relative w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-sm transition-colors text-left",
                active
                  ? "bg-(--bg-active) text-(--text-primary)"
                  : "text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-secondary)",
              ].join(" ")}
            >
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-(--brand) rounded-r-full"
                />
              )}
              <Icon className={["w-3.5 h-3.5 shrink-0", active ? "text-(--brand)" : "text-(--text-faint)"].join(" ")} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-1.5 py-2 border-t border-(--border-subtle) space-y-px">
        <a
          href="https://scriptvalley.com"
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-sm text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 shrink-0 text-(--text-faint)" />
          <span>ScriptValley</span>
        </a>
      </div>
    </>
  );
}