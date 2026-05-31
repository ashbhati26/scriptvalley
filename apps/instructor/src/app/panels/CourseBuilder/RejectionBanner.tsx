"use client";
// ─── RejectionBanner.tsx ─────────────────────────────────────────────────────

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, ChevronRight } from "lucide-react";
import { useState } from "react";

interface RBProps { onNavigate: (mode: "courses" | "sheets") => void; }

export function RejectionBanner({ onNavigate }: RBProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const skip = !isLoaded || !isSignedIn;
  const courses = useQuery(api.courses.getMyCourses, skip ? "skip" : undefined) as any[] | undefined;
  const sheets  = useQuery(api.sheets.getMySheets,   skip ? "skip" : undefined) as any[] | undefined;
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  const rejectedCourses = (courses ?? []).filter((c: any) => c.status === "rejected");
  const rejectedSheets  = (sheets  ?? []).filter((s: any) => s.status === "rejected");
  const total = rejectedCourses.length + rejectedSheets.length;
  if (total === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
        className="sv-banner-danger"
      >
        <div className="sv-icon-badge sv-icon-badge-danger flex items-center justify-center flex-shrink-0" style={{ width: 24, height: 24 }}>
          <AlertCircle size={11} className="sv-text-danger" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium sv-text-danger" style={{ letterSpacing: "-0.003em" }}>
            {total} item{total !== 1 ? "s" : ""} rejected by admin
          </p>
          <div className="flex flex-col" style={{ gap: 2, marginTop: 4 }}>
            {rejectedCourses.map((c: any) => (
              <button key={String(c._id)} onClick={() => onNavigate("courses")}
                className="sv-btn-ghost flex items-center gap-1 text-[11px] sv-text-faint text-left p-0">
                <ChevronRight size={10} className="sv-text-danger flex-shrink-0" />
                <span className="sv-truncate">{c.title}</span>
                {c.rejectionReason && <span className="sv-text-danger flex-shrink-0 opacity-60">— {c.rejectionReason}</span>}
              </button>
            ))}
            {rejectedSheets.map((s: any) => (
              <button key={String(s._id)} onClick={() => onNavigate("sheets")}
                className="sv-btn-ghost flex items-center gap-1 text-[11px] sv-text-faint text-left p-0">
                <ChevronRight size={10} className="sv-text-danger flex-shrink-0" />
                <span className="sv-truncate">{s.name}</span>
                {s.rejectionReason && <span className="sv-text-danger flex-shrink-0 opacity-60">— {s.rejectionReason}</span>}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="sv-btn-danger flex items-center justify-center flex-shrink-0 sv-rounded-xs" style={{ width: 22, height: 22 }}>
          <X size={11} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default RejectionBanner;