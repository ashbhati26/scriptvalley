"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion } from "framer-motion";
import { Bell, BookOpen, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function InstructorNavbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const skip = !isLoaded || !isSignedIn;

  const courses = useQuery(api.courses.getMyCourses,     skip ? "skip" : undefined);
  const sheets  = useQuery(api.sheets.getMySheets,       skip ? "skip" : undefined);
  const profile = useQuery(api.instructors.getMyProfile, skip ? "skip" : undefined);

  const pendingCount =
    ((courses as any[])?.filter((c) => c.status === "pending_review").length ?? 0) +
    ((sheets  as any[])?.filter((s) => s.status === "pending_review").length ?? 0);

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sv-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sv-theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--border-subtle) bg-(--bg-base)/90 backdrop-blur-md">
      <div className="flex items-center justify-between h-12 px-4 md:px-6">

        {/* Brand — logo swaps based on theme */}
        <div className="flex items-center gap-2.5">
          <Image
            src={dark ? "/dark-logo.png" : "/light-logo.png"}
            alt="ScriptValley"
            width={64}
            height={64}
            className="w-auto object-contain"
            priority
          />
          <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-(--brand-subtle) border border-(--brand-border) text-(--brand) uppercase tracking-widest">
            Instructor
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {pendingCount > 0 && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              title={`${pendingCount} items under admin review`}
              className="relative w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-(--brand) flex items-center justify-center text-[8px] font-bold text-white leading-none">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            </motion.button>
          )}

          {profile && !(profile as any).isApproved && (
            <span className="hidden sm:flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 uppercase tracking-widest">
              Pending approval
            </span>
          )}

          <div className="w-px h-4 bg-(--border-subtle) mx-1" />

          {/* Theme toggle — same pattern as admin */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="w-px h-4 bg-(--border-subtle) mx-1" />

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox:  "h-7 w-7",
                avatarImage:          "h-7 w-7 rounded-md",
                userButtonTrigger:    "focus:shadow-none focus:outline-none rounded-md",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="← ScriptValley"
                labelIcon={<BookOpen className="w-3.5 h-3.5" />}
                href="https://scriptvalley.com"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}