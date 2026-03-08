"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./_components/Sidebar";
import BasicInfoForm from "./_components/BasicInfoForm";
import SocialForm from "./_components/SocialForm";
import PlatformForm from "./_components/PlatformForm";
import { Menu, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const TABS = [
  { label: "Basic Info", description: "Update your details to personalize your developer profile."    },
  { label: "Socials",    description: "Add links to your social media accounts for better networking." },
  { label: "Platform",   description: "Connect your coding platform to showcase your coding journey."  },
] as const;

type Tab = (typeof TABS)[number]["label"];

function EditProfileContent() {
  const [selectedTab, setSelectedTab] = useState<Tab>("Basic Info");
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  const currentTab = TABS.find((t) => t.label === selectedTab)!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] w-full pt-16 pb-10">

      {/* Mobile sticky topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] sticky top-16 z-30">
        <p className="text-sm font-medium text-[var(--text-primary)]">{currentTab.label}</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile tab strip */}
      <div className="md:hidden flex items-center gap-px px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
        {(["Basic Info", "Socials", "Platform"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs transition-colors duration-100 ${
              selectedTab === tab
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 z-50 h-full w-72 bg-[var(--bg-base)] border-r border-[var(--border-subtle)] flex flex-col overflow-hidden md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">Account</p>
                  <span className="text-sm font-medium text-[var(--text-primary)]">Edit Profile</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar
                selectedTab={selectedTab}
                setSelectedTab={(tab) => { setSelectedTab(tab); setDrawerOpen(false); }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row min-h-[80vh]">

          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0 px-4 py-8 md:px-8 md:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Account</p>
                  <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">{currentTab.label}</h1>
                  <p className="text-sm text-[var(--text-faint)]">{currentTab.description}</p>
                </div>
                <div className="border-t border-[var(--border-subtle)] mb-8" />

                {selectedTab === "Basic Info" && <BasicInfoForm />}
                {selectedTab === "Socials"    && <SocialForm />}
                {selectedTab === "Platform"   && <PlatformForm />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}