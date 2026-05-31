"use client";

import { Component, useState } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Code2, User, BarChart2,
  Menu, ChevronLeft, PanelLeftClose, PanelLeftOpen,
  AlertTriangle, RotateCcw,
} from "lucide-react";
import InstructorNavbar from "./InstructorNavbar";
import Overview from "../panels/Overview";
import CourseBuilder from "../panels/CourseBuilder/CourseBuilder";
import DSASheetBuilder from "../panels/DSASheetBuilder/index";
import ProfilePanel from "../panels/ProfilePanel";
import AnalyticsPanel from "../panels/Analytics/index";
import RejectionBanner from "../panels/CourseBuilder/RejectionBanner";
import type { LucideProps } from "lucide-react";

export type Mode = "overview" | "courses" | "sheets" | "profile" | "analytics";

const NAV: { key: Mode; label: string; Icon: React.FC<LucideProps> }[] = [
  { key: "overview",  label: "Overview",   Icon: LayoutDashboard },
  { key: "courses",   label: "Courses",    Icon: BookOpen },
  { key: "sheets",    label: "DSA Sheets", Icon: Code2 },
  { key: "analytics", label: "Analytics",  Icon: BarChart2 },
  { key: "profile",   label: "Profile",    Icon: User },
];

// ─── Error Boundary ───────────────────────────────────────────────────────────
class PanelErrorBoundary extends Component<
  { children: ReactNode; panelKey: Mode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("[PanelErrorBoundary]", error, info); }
  componentDidUpdate(prev: any) {
    if (prev.panelKey !== this.props.panelKey && this.state.hasError)
      this.setState({ hasError: false, error: null });
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center gap-3.5 text-center" style={{ padding: "64px 24px", minHeight: 320 }}>
        <div className="sv-icon-badge sv-icon-badge-danger flex items-center justify-center" style={{ width: 44, height: 44 }}>
          <AlertTriangle size={20} className="sv-text-danger" />
        </div>
        <div>
          <p className="text-[15px] font-semibold sv-text-primary mb-1" style={{ letterSpacing: "-0.01em" }}>
            Something went wrong
          </p>
          <p className="text-[13px] sv-text-faint" style={{ lineHeight: 1.6 }}>
            This panel ran into an error. Your work is auto-saved locally.
          </p>
          {this.state.error?.message && (
            <p
              className="text-[11px] font-mono sv-text-danger sv-bg-danger-bg sv-rounded-sm inline-block mt-1.5"
              style={{ padding: "4px 10px" }}
            >
              {this.state.error.message}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="sv-btn-secondary text-[13px]"
            style={{ padding: "7px 14px", borderRadius: "var(--radius-md)" }}
          >
            <RotateCcw size={13} /> Try again
          </button>
          <button
            onClick={this.props.onReset}
            className="sv-btn-primary text-[13px]"
            style={{ padding: "7px 14px", borderRadius: "var(--radius-md)" }}
          >
            Go to Overview
          </button>
        </div>
      </div>
    );
  }
}

// ─── Root layout ──────────────────────────────────────────────────────────────
export default function InstructorLayout() {
  const [mode,      setMode]      = useState<Mode>("overview");
  const [drawerOpen, setDrawer]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function navigate(m: Mode) { setMode(m); setDrawer(false); }

  return (
    <div className="flex flex-col min-h-screen sv-bg-base">
      <InstructorNavbar />
      <RejectionBanner onNavigate={(m) => navigate(m as Mode)} />

      <div className="flex flex-1 min-h-0">

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="bd"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setDrawer(false)}
                className="fixed inset-0 z-30"
                style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(2px)" }}
              />
              <motion.aside
                key="drawer"
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: "tween", duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed left-0 bottom-0 z-40 sv-bg-sidebar flex flex-col"
                style={{
                  top: "var(--navbar-height)",
                  width: "var(--sidebar-width)",
                  borderRight: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <Sidebar mode={mode} navigate={navigate} collapsed={false} onCollapse={() => {}} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside
          id="desktop-sidebar"
          className="hidden flex-col sv-bg-sidebar sv-sticky-below-nb flex-shrink-0 overflow-hidden"
          style={{
            width: collapsed ? "52px" : "var(--sidebar-width)",
            height: "calc(100vh - var(--navbar-height))",
            borderRight: "1px solid var(--border-subtle)",
            transition: "width 200ms cubic-bezier(.4,0,.2,1)",
          }}
        >
          <Sidebar mode={mode} navigate={navigate} collapsed={collapsed} onCollapse={() => setCollapsed((c) => !c)} />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden sv-bg-base">
          {/* Mobile topbar */}
          <div
            id="mobile-topbar"
            className="flex items-center gap-2.5 sticky top-0 z-20 sv-bg-glass"
            style={{ padding: "0 16px", height: 40, borderBottom: "1px solid var(--border-subtle)" }}
          >
            <button
              onClick={() => setDrawer(true)}
              className="sv-btn-ghost flex items-center justify-center sv-rounded-md sv-bg-hover"
              style={{ width: 28, height: 28 }}
              aria-label="Open navigation"
            >
              <Menu size={14} />
            </button>
            <span className="text-[13px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.015em" }}>
              {NAV.find((n) => n.key === mode)?.label}
            </span>
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
            >
              <PanelErrorBoundary panelKey={mode} onReset={() => navigate("overview")}>
                {mode === "overview"  && <Overview onNavigate={navigate} />}
                {mode === "courses"   && <CourseBuilder />}
                {mode === "sheets"    && <DSASheetBuilder />}
                {mode === "analytics" && <AnalyticsPanel />}
                {mode === "profile"   && <ProfilePanel />}
              </PanelErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          #desktop-sidebar { display: flex !important; }
          #mobile-topbar   { display: none  !important; }
        }
        @media (max-width: 767px) {
          #desktop-sidebar { display: none  !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ mode, navigate, collapsed, onCollapse }: {
  mode: Mode; navigate: (m: Mode) => void; collapsed: boolean; onCollapse: () => void;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        id="collapse-row"
        className="flex"
        style={{ padding: "8px 8px 4px", justifyContent: collapsed ? "center" : "flex-end" }}
      >
        <button
          onClick={onCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="sv-btn-ghost flex items-center justify-center"
          style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
        >
          {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ padding: collapsed ? "4px 6px" : "4px 8px" }}
      >
        {!collapsed && (
          <div style={{ padding: "6px 8px" }}>
            <span className="sv-section-label">Workspace</span>
          </div>
        )}
        <div className="flex flex-col" style={{ gap: 1 }}>
          {NAV.map(({ key, label, Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => navigate(key)}
                title={collapsed ? label : undefined}
                className={`sv-nav-item relative ${active ? "active" : ""}`}
                style={{ padding: collapsed ? "7px" : "6px 9px", justifyContent: collapsed ? "center" : "flex-start" }}
              >
                {active && !collapsed && (
                  <span
                    className="absolute"
                    style={{
                      left: 1, top: "50%", transform: "translateY(-50%)",
                      width: 2, height: 14, borderRadius: 2, background: "var(--brand)",
                    }}
                  />
                )}
                <Icon size={14} className={active ? "sv-text-brand" : "sv-text-faint"} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ padding: collapsed ? "6px" : "6px 8px", borderTop: "1px solid var(--border-subtle)" }}>
        <a
          href="https://scriptvalley.com"
          title={collapsed ? "Back to ScriptValley" : undefined}
          className="sv-btn-ghost flex items-center overflow-hidden whitespace-nowrap no-underline"
          style={{
            padding: collapsed ? "7px" : "5px 8px",
            gap: 6,
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
          }}
        >
          <ChevronLeft size={11} className="sv-text-disabled" style={{ flexShrink: 0 }} />
          {!collapsed && "Back to ScriptValley"}
        </a>
      </div>

      <style>{`@media (max-width: 767px) { #collapse-row { display: none !important; } }`}</style>
    </div>
  );
}