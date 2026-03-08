"use client";

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { Shield, Bell } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const skip = !isLoaded || !isSignedIn;

  const pendingSheets = useQuery(
    api.sheets.getPendingSheets,
    skip ? "skip" : undefined,
  );
  const pendingCourses = useQuery(
    api.courses.getPendingCourses,
    skip ? "skip" : undefined,
  );
  const instructors = useQuery(
    api.instructors.getAllInstructors,
    skip ? "skip" : undefined,
  );

  const pendingReview =
    (pendingSheets?.length ?? 0) + (pendingCourses?.length ?? 0);

  const pendingInstructors =
    instructors?.filter((i) => !i.isApproved).length ?? 0;
  const totalAlerts = pendingReview + pendingInstructors;

  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Read initial theme
    const stored = localStorage.getItem("sv-admin-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDark(stored ? stored === "dark" : prefersDark);

    // Watch for theme changes via class on <html>
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
          <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[rgba(58,94,255,0.1)] border border-[rgba(58,94,255,0.2)] text-[#3A5EFF] uppercase tracking-widest">
            Admin
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {totalAlerts > 0 && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-7 h-7 flex items-center justify-center rounded-md text-text-faint hover:text-text-muted hover:bg-(--bg-hover) transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#3A5EFF] flex items-center justify-center text-[8px] font-bold text-white leading-none">
                {totalAlerts > 9 ? "9+" : totalAlerts}
              </span>
            </motion.button>
          )}

          <div className="w-px h-4 bg-(--border-subtle) mx-1" />
          <ThemeToggle />
          <div className="w-px h-4 bg-(--border-subtle) mx-1" />

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-7 w-7",
                avatarImage: "h-7 w-7 rounded-md",
                userButtonTrigger:
                  "focus:shadow-none focus:outline-none rounded-md",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
