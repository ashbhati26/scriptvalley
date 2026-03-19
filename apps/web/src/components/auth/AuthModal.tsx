"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal() {
  const { isOpen, mode, close } = useAuthModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal card */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0,   scale: 0.97, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm pointer-events-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">
                    Script Valley
                  </p>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    {mode === "signIn" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-xs text-[var(--text-faint)] mt-0.5">
                    {mode === "signIn"
                      ? "Sign in to continue learning"
                      : "Start learning DSA and programming today"
                    }
                  </p>
                </div>

                <button
                  onClick={close}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-faint)] hover:bg-[var(--bg-hover)] transition-colors shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form content — animates when mode switches */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === "signIn" ? -12 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0,   x: mode === "signIn" ? 12 : -12 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {mode === "signIn" ? <SignInForm /> : <SignUpForm />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}