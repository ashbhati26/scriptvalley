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

  /* Clerk not ready */
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center sv-bg-base">
        <Loader2 className="w-[18px] h-[18px] sv-text-disabled sv-spin-slow" />
      </div>
    );
  }

  /* Waiting for Convex profile */
  if (isSignedIn && profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center sv-bg-base">
        <Loader2 className="w-[18px] h-[18px] sv-text-disabled sv-spin-slow" />
      </div>
    );
  }

  /* Signed in + instructor */
  if (isSignedIn && profile) return <>{children}</>;

  /* Signed in but NOT an instructor */
  if (isSignedIn && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sv-bg-base">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[340px] sv-card sv-shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 sv-bg-elevated"
              style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="sv-icon-badge sv-icon-badge-danger flex items-center justify-center flex-shrink-0"
                style={{ width: 28, height: 28 }}>
                <ShieldOff className="w-[13px] h-[13px] sv-text-danger" />
              </div>
              <div>
                <p className="sv-section-label">Access Denied</p>
                <h2 className="text-[13px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.012em", marginTop: 1 }}>
                  Not an instructor
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3" style={{ padding: "14px 16px 16px" }}>
              <p className="text-[13px] sv-text-muted" style={{ lineHeight: 1.6 }}>
                Your account doesn't have instructor access. Apply from the main ScriptValley platform or contact an admin.
              </p>
              <div className="flex items-center gap-2.5 sv-rounded-md sv-bg-hover"
                style={{ padding: "8px 10px", border: "1px solid var(--border-subtle)" }}>
                <UserButton afterSignOutUrl="/" />
                <p className="text-[12px] sv-text-faint">Wrong account? Sign out above.</p>
              </div>
              <a
                href="https://scriptvalley.com"
                className="sv-btn-primary flex items-center justify-center w-full text-[13px] no-underline"
                style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", letterSpacing: "-0.008em" }}
              >
                Apply on ScriptValley →
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* Not signed in — blurred background + modal */
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred preview */}
      <div
        aria-hidden
        className="pointer-events-none select-none"
        style={{ filter: "blur(16px)", opacity: 0.12 }}
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 sv-bg-glass" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[340px] sv-card sv-shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 sv-bg-elevated"
              style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="sv-icon-badge sv-icon-badge-brand flex items-center justify-center flex-shrink-0"
                style={{ width: 28, height: 28 }}>
                <Lock className="w-[13px] h-[13px] sv-text-brand" />
              </div>
              <div>
                <p className="sv-section-label">Instructor Workspace</p>
                <h2 className="text-[13px] font-semibold sv-text-primary" style={{ letterSpacing: "-0.012em", marginTop: 1 }}>
                  Sign in to continue
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3" style={{ padding: "14px 16px 16px" }}>
              <p className="text-[13px] sv-text-muted" style={{ lineHeight: 1.6 }}>
                Access your instructor dashboard to build DSA sheets and manage content.
              </p>

              <ul className="flex flex-col gap-1.5">
                {[
                  "Curate DSA problem sheets",
                  "Group questions by topic",
                  "Submit for admin review",
                  "Track publish status",
                ].map((hint) => (
                  <li key={hint} className="flex items-center gap-2 text-[12px] sv-text-faint">
                    <span className="w-1 h-1 rounded-full sv-bg-brand flex-shrink-0" />
                    {hint}
                  </li>
                ))}
              </ul>

              <SignInButton mode="modal">
                <button
                  className="sv-btn-primary flex items-center justify-center gap-1.5 text-[13px]"
                  style={{
                    width: "fit-content",
                    alignSelf: "flex-start",
                    padding: "8px 20px",
                    borderRadius: "var(--radius-md)",
                    letterSpacing: "-0.008em",
                    marginTop: 2,
                  }}
                >
                  <LogIn className="w-[13px] h-[13px]" />
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