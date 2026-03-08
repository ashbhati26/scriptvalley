"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, ChevronDown, Copy, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RunningCodeSkeleton from "./Skeleton";

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (error || output || isRunning) setShowOutput(true);
  }, [error, output, isRunning]);

  return (
    <AnimatePresence>
      {(hasContent || isRunning) && showOutput && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed bottom-0 left-0 w-full px-4 pb-4 z-50"
        >
          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg max-w-5xl mx-auto overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-500/70" : "bg-emerald-500/70"}`} />
                <Terminal className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <span className="text-xs text-[var(--text-muted)]">Output</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-500/70" />
                      <span className="text-emerald-500/70">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowOutput(false)}
                  className="p-1 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors duration-100"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[220px] overflow-auto px-5 py-4 font-mono text-sm scrollbar-hide">
              {isRunning ? (
                <RunningCodeSkeleton />
              ) : error ? (
                <div className="flex items-start gap-3 text-red-400/80">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-red-400/50">Execution Error</div>
                    <pre className="whitespace-pre-wrap text-sm text-red-400/70">{error}</pre>
                  </div>
                </div>
              ) : output ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/50">Execution Successful</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[var(--text-secondary)] text-sm">{output}</pre>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OutputPanel;