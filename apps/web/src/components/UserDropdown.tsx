"use client";

import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Sun, Moon, ChevronDown, LayoutDashboard, BookOpen } from "lucide-react";
import { useAuthModal } from "@/components/providers/AuthModalProvider";

interface Props {
  variant?:    "student" | "instructor" | "admin";
  signInLabel?: string;
}

export default function UserDropdown({
  variant      = "student",
  signInLabel  = "Sign in",
}: Props) {
  const { user, isLoaded } = useUser();
  const { signOut }        = useClerk();
  const { openSignIn }     = useAuthModal();

  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Sync dark state
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sv-theme", next ? "dark" : "light");
  }

  async function handleSignOut() {
    setOpen(false);
    await signOut();
  }

  // Avatar component
  function Avatar() {
    if (user?.imageUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.imageUrl}
          alt={user.fullName ?? "Avatar"}
          className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)]"
        />
      );
    }
    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") || "?";
    return (
      <span className="w-7 h-7 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand-border)] flex items-center justify-center text-[10px] font-semibold text-[var(--brand)]">
        {initials}
      </span>
    );
  }

  if (!isLoaded) {
    return <div className="w-7 h-7 rounded-full bg-[var(--bg-hover)] animate-pulse" />;
  }

  return (
    <>
      {/* ── Signed in ──────────────────────────────────────────────────── */}
      <SignedIn>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Avatar />
            <ChevronDown className={`w-3 h-3 text-[var(--text-faint)] transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0,   y: 6, scale: 0.97 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-xl shadow-black/10 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
                  <Avatar />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user?.fullName ?? user?.firstName ?? "User"}
                    </p>
                    <p className="text-[10px] text-[var(--text-disabled)] truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5 px-1.5 space-y-px">

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                    Profile
                  </Link>

                  {variant === "instructor" && (
                    <Link
                      href="/instructor"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                      Instructor Dashboard
                    </Link>
                  )}

                  {variant === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                      Admin Dashboard
                    </Link>
                  )}

                  {(variant === "instructor" || variant === "admin") && (
                    <a
                      href="https://scriptvalley.com"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                      Script Valley
                    </a>
                  )}

                  <div className="h-px bg-[var(--border-subtle)] mx-1 my-1" />

                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {dark
                      ? <Sun  className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                      : <Moon className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                    }
                    {dark ? "Light mode" : "Dark mode"}
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SignedIn>

      {/* ── Signed out — opens modal instead of linking to /sign-in ──────── */}
      <SignedOut>
        <button
          onClick={openSignIn}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] transition-colors"
        >
          {signInLabel}
        </button>
      </SignedOut>
    </>
  );
}