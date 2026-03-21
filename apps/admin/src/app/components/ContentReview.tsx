"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, LayoutList, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type ContentTab = "sheets" | "courses";

const TABS: { key: ContentTab; label: string; Icon: React.ComponentType<any> }[] = [
  { key: "sheets",  label: "DSA Sheets", Icon: BookOpen },
  { key: "courses", label: "Courses",    Icon: Award    },
];

export default function ContentReview() {
  const [tab, setTab] = useState<ContentTab>("sheets");
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-disabled mb-1">Instructor Platform</p>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Content Review</h2>
        <p className="text-sm text-text-faint">Review and publish instructor-submitted content.</p>
      </div>

      <div className="flex gap-px border-b border-border-subtle overflow-x-auto">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors shrink-0 ${tab === key ? "text-text-primary" : "text-text-faint hover:text-text-muted"}`}
          >
            {tab === key && <motion.span layoutId="contentTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />}
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}>
          {tab === "sheets"  && <SheetsReview />}
          {tab === "courses" && <CoursesReview />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ReviewRow({ item, onPublish, onReject, onDelete, meta }: {
  item: { _id: any; title?: string; name?: string; slug: string; createdAt: number; description?: string; summary?: string; [key: string]: any };
  onPublish: () => void;
  onReject: (reason: string) => void;
  onDelete: () => void;
  meta?: React.ReactNode;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [rejecting,  setRejecting]  = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [reason,     setReason]     = useState("");
  const displayName = item.title ?? item.name ?? "Untitled";

  return (
    <div className="px-4 py-4 hover:bg-bg-hover transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-text-secondary truncate">{displayName}</p>
            <span className="text-[9px] font-mono text-text-disabled bg-bg-hover rounded px-1.5 py-0.5">{item.slug}</span>
          </div>
          {(item.description || item.summary) && (
            <p className="text-xs text-text-disabled mt-0.5 line-clamp-2">{item.description ?? item.summary}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-text-disabled">
              <Clock className="w-3 h-3" />{new Date(item.createdAt).toLocaleDateString()}
            </span>
            {meta}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-text-faint hover:text-text-secondary hover:bg-bg-elevated transition-colors">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />} Preview
          </button>
          <button onClick={onPublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.18)] border border-[rgba(34,197,94,0.25)] text-[#22c55e] text-xs font-medium transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" /> Publish
          </button>
          <button onClick={() => setRejecting(!rejecting)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 border border-transparent hover:border-red-500/20 text-xs transition-colors">
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          {confirmDel ? (
            <div className="flex items-center gap-1.5">
              <button onClick={() => { onDelete(); setConfirmDel(false); }}
                className="px-2.5 py-1 rounded text-xs bg-red-500 text-white font-semibold">
                Delete
              </button>
              <button onClick={() => setConfirmDel(false)}
                className="px-2.5 py-1 rounded text-xs border border-(--border-subtle) text-(--text-muted)">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-text-faint hover:text-red-400/70 hover:bg-red-500/6 text-xs transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {rejecting && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
            <div className="flex gap-2">
              <input autoFocus value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason (optional)…"
                className="flex-1 h-8 bg-bg-input border border-border-subtle rounded-md px-3 text-xs text-text-secondary placeholder:text-text-disabled outline-none focus:border-red-500/40 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { onReject(reason); setRejecting(false); setReason(""); }
                  if (e.key === "Escape") { setRejecting(false); setReason(""); }
                }}
              />
              <button onClick={() => { onReject(reason); setRejecting(false); setReason(""); }}
                className="px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400/80 text-xs hover:bg-red-500/20 transition-colors">
                Confirm
              </button>
            </div>
            <p className="text-[10px] text-text-disabled mt-1">Enter to confirm · Escape to cancel</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
            <pre className="text-[11px] text-text-faint font-mono bg-bg-input rounded-md p-3 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap wrap-break-word">
              {JSON.stringify(item, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-text-disabled">
      <LayoutList className="w-7 h-7" />
      <p className="text-sm">No pending {label}</p>
    </div>
  );
}

function Loader() {
  return <div className="flex justify-center py-12"><div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" /></div>;
}

function ReviewList({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-text-disabled">{count} pending review</p>
      <div className="rounded-lg border border-border-subtle overflow-hidden divide-y divide-border-subtle">
        {children}
      </div>
    </div>
  );
}

function SheetsReview() {
  const sheets  = useQuery(api.sheets.getPendingSheets);
  const publish = useMutation(api.sheets.publishSheet);
  const reject  = useMutation(api.sheets.rejectSheet);
  const del     = useMutation(api.sheets.remove);
  if (sheets === undefined) return <Loader />;
  if (sheets.length === 0)  return <Empty label="DSA sheets" />;
  return (
    <ReviewList count={sheets.length}>
      {sheets.map((s: any) => (
        <ReviewRow key={String(s._id)} item={{ ...s, title: s.name }}
          onPublish={async () => { try { await publish({ id: s._id as Id<"dsaSheets"> }); toast.success(`"${s.name}" published`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          onReject={async (reason) => { try { await reject({ id: s._id as Id<"dsaSheets">, reason }); toast.success(`"${s.name}" rejected`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          onDelete={async () => { try { await del({ id: s._id as Id<"dsaSheets"> }); toast.success(`"${s.name}" deleted`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          meta={s.category ? <span className="text-[10px] text-text-disabled bg-bg-hover rounded px-1.5 py-0.5">{s.category}</span> : null}
        />
      ))}
    </ReviewList>
  );
}

function CoursesReview() {
  const courses = useQuery(api.courses.getPendingCourses);
  const publish = useMutation(api.courses.publishCourse);
  const reject  = useMutation(api.courses.rejectCourse);
  const del     = useMutation(api.courses.adminDeleteCourse);
  if (courses === undefined) return <Loader />;
  if (courses.length === 0)  return <Empty label="courses" />;
  return (
    <ReviewList count={courses.length}>
      {courses.map((c: any) => (
        <ReviewRow key={String(c._id)} item={c}
          onPublish={async () => { try { await publish({ id: c._id as Id<"courses"> }); toast.success(`"${c.title}" published`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          onReject={async (reason) => { try { await reject({ id: c._id as Id<"courses">, reason }); toast.success(`"${c.title}" rejected`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          onDelete={async () => { try { await del({ id: c._id as Id<"courses"> }); toast.success(`"${c.title}" deleted`); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}
          meta={<span className="text-[10px] text-text-disabled">{c.modules?.length ?? 0} modules</span>}
        />
      ))}
    </ReviewList>
  );
}