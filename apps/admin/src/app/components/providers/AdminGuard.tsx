"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Lock, ShieldOff } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();

  const isAdmin = useQuery(api.admins.isAdmin, isSignedIn ? {} : "skip");
  const debug = useQuery(api.admins.debugAuth);
  console.log("DEBUG AUTH:", debug);

  // Still loading auth
  if (!isLoaded || (isSignedIn && isAdmin === undefined)) return null;

  // Signed in + confirmed admin → render the app
  if (isSignedIn && isAdmin) return <>{children}</>;

  // ── Signed in but NOT admin ────────────────────────────────────────────────
  if (isSignedIn && isAdmin === false) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-(--bg-base)">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-sm rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="px-6 py-5 bg-bg-input border-b border-(--border-subtle) flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                <ShieldOff className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-0.5">
                  Access Denied
                </p>
                <h2 className="text-sm font-semibold text-(--text-primary)">
                  Not an admin
                </h2>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-text-faint leading-relaxed">
                Your account doesn't have admin access to ScriptValley. If you
                think this is a mistake, ask an existing admin to add your
                email.
              </p>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-(--border-subtle) bg-(--bg-hover)">
                <UserButton afterSignOutUrl="/" />
                <div className="min-w-0">
                  <p className="text-xs text-text-secondary font-medium">
                    Signed in as
                  </p>
                  <p className="text-[11px] text-text-faint truncate">
                    wrong account? sign out above
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-(--border-subtle) bg-bg-input">
              <p className="text-[10px] text-text-disabled text-center">
                Need access?{" "}
                <a
                  href="mailto:admin@scriptvalley.com"
                  className="text-[#3A5EFF] hover:text-[#4a6aff] transition-colors"
                >
                  Contact us
                </a>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Not signed in → show sign-in card over blurred children ───────────────
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred background hint of the app */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{ filter: "blur(12px)", opacity: 0.2 }}
      >
        {children}
      </div>

      <div className="absolute inset-0 bg-(--bg-base)/70" />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-sm rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="px-6 py-5 bg-bg-input border-b border-(--border-subtle) flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-(--bg-hover) border border-(--border-subtle)">
                <Lock className="w-3.5 h-3.5 text-[#3A5EFF]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-0.5">
                  Restricted
                </p>
                <h2 className="text-sm font-semibold text-(--text-primary)">
                  Admin access only
                </h2>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-text-faint leading-relaxed">
                This panel is restricted to ScriptValley administrators. Sign in
                with your admin account to continue.
              </p>

              <ul className="flex flex-col gap-2">
                {[
                  "Admin accounts only — not open to the public",
                  "Sign in with your Google account",
                  "Access is granted by existing admins",
                ].map((hint) => (
                  <li
                    key={hint}
                    className="flex items-center gap-2 text-xs text-text-disabled"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#3A5EFF] shrink-0" />
                    {hint}
                  </li>
                ))}
              </ul>

              <SignInButton mode="modal">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-sm font-medium transition-colors duration-150">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </button>
              </SignInButton>
            </div>

            <div className="px-6 py-3 border-t border-(--border-subtle) bg-bg-input">
              <p className="text-[10px] text-text-disabled text-center">
                ScriptValley Admin Panel — internal use only
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
