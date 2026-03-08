"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Lock, ShieldOff, Loader2 } from "lucide-react";

export default function InstructorGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  const profile = useQuery(
    api.instructors.getMyProfile,
    isLoaded && isSignedIn ? undefined : "skip"
  );

  // ── Clerk not ready ────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-base)">
        <Loader2 className="w-5 h-5 text-(--text-disabled) animate-spin" />
      </div>
    );
  }

  // ── Signed in, waiting for Convex profile ─────────────────────────────────
  if (isSignedIn && profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-base)">
        <Loader2 className="w-5 h-5 text-(--text-disabled) animate-spin" />
      </div>
    );
  }

  // ── Signed in + instructor record → show app ──────────────────────────────
  if (isSignedIn && profile) {
    return <>{children}</>;
  }

  // ── Signed in but not an instructor ───────────────────────────────────────
  if (isSignedIn && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-(--bg-base)">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-sm rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden shadow-2xl shadow-black/10"
          >
            <div className="px-6 py-5 bg-(--bg-input) border-b border-(--border-subtle) flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-red-500/10 border border-red-500/20 shrink-0">
                <ShieldOff className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Access Denied</p>
                <h2 className="text-sm font-semibold text-(--text-primary)">Not an instructor</h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-(--text-faint) leading-relaxed">
                Your account doesn't have instructor access. Apply from the main ScriptValley platform or contact an admin.
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-(--border-subtle) bg-(--bg-hover)">
                <UserButton afterSignOutUrl="/" />
                <p className="text-xs text-(--text-faint)">Wrong account? Sign out above.</p>
              </div>
              <a
                href="https://scriptvalley.com"
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-medium transition-colors"
              >
                Apply on ScriptValley →
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div aria-hidden className="pointer-events-none select-none" style={{ filter: "blur(14px)", opacity: 0.15 }}>
        {children}
      </div>
      <div className="absolute inset-0 bg-(--bg-base)/75" />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-sm rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden shadow-2xl shadow-black/10"
          >
            <div className="px-6 py-5 bg-(--bg-input) border-b border-(--border-subtle) flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-(--bg-hover) border border-(--border-subtle) shrink-0">
                <Lock className="w-3.5 h-3.5 text-(--brand)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-0.5">Instructor Workspace</p>
                <h2 className="text-sm font-semibold text-(--text-primary)">Sign in to continue</h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-(--text-faint) leading-relaxed">
                Access your instructor dashboard to build DSA sheets and manage content.
              </p>
              <ul className="space-y-2">
                {[
                  "Curate DSA problem sheets",
                  "Group questions by topic",
                  "Submit for admin review",
                  "Track publish status",
                ].map((hint) => (
                  <li key={hint} className="flex items-center gap-2 text-xs text-(--text-disabled)">
                    <span className="w-1 h-1 rounded-full bg-(--brand) shrink-0" />
                    {hint}
                  </li>
                ))}
              </ul>
              <SignInButton mode="modal">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold transition-colors">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </button>
              </SignInButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}