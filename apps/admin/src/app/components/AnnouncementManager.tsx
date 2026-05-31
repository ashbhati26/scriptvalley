"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, X, Info, AlertTriangle, CheckCircle2, Trash2, Power } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type AnnouncementType = "info" | "warning" | "success";

const TYPE_META: Record<AnnouncementType, {
  label: string;
  Icon: React.ComponentType<any>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
}> = {
  info: {
    label: "Info", Icon: Info,
    colorClass:   "text-[#3A5EFF]",
    bgClass:      "bg-[rgba(58,94,255,0.08)]",
    borderClass:  "border-[rgba(58,94,255,0.2)]",
    iconBgClass:  "bg-[rgba(58,94,255,0.08)] border-[rgba(58,94,255,0.2)]",
  },
  warning: {
    label: "Warning", Icon: AlertTriangle,
    colorClass:   "text-warning",
    bgClass:      "bg-warning-bg",
    borderClass:  "border-warning-border",
    iconBgClass:  "bg-warning-bg border-warning-border",
  },
  success: {
    label: "Success", Icon: CheckCircle2,
    colorClass:   "text-success",
    bgClass:      "bg-success-bg",
    borderClass:  "border-success-border",
    iconBgClass:  "bg-success-bg border-success-border",
  },
};

function TypeButton({ type, selected, onSelect }: {
  type: AnnouncementType; selected: boolean; onSelect: () => void;
}) {
  const m = TYPE_META[type];
  return (
    <button
      onClick={onSelect}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer
        border transition-all duration-75
        ${selected
          ? `${m.bgClass} ${m.borderClass} ${m.colorClass}`
          : "bg-transparent border-(--border-subtle) text-(--text-faint) hover:text-(--text-muted)"
        }
      `}
    >
      <m.Icon className="w-3 h-3" />
      {m.label}
    </button>
  );
}

function AnnouncementBanner({ announcement }: { announcement: any }) {
  const m = TYPE_META[announcement.type as AnnouncementType] ?? TYPE_META.info;
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-md border ${m.bgClass} ${m.borderClass}`}>
      <m.Icon className={`w-4 h-4 shrink-0 mt-0.5 ${m.colorClass}`} />
      <p className="flex-1 text-[13px] text-(--text-secondary) leading-relaxed">{announcement.message}</p>
    </div>
  );
}

export default function AnnouncementManager() {
  const announcements = useQuery(api.adminFeatures.getAllAnnouncements);
  const createMut     = useMutation(api.adminFeatures.createAnnouncement);
  const deactivateMut = useMutation(api.adminFeatures.deactivateAnnouncement);
  const deleteMut     = useMutation(api.adminFeatures.deleteAnnouncement);

  const [message,   setMessage]   = useState("");
  const [type,      setType]      = useState<AnnouncementType>("info");
  const [expiresAt, setExpiresAt] = useState("");
  const [busy,      setBusy]      = useState(false);
  const [showForm,  setShowForm]  = useState(false);

  const active   = (announcements ?? []).filter((a: any) => a.active && (!a.expiresAt || a.expiresAt > Date.now()));
  const inactive = (announcements ?? []).filter((a: any) => !a.active || (a.expiresAt && a.expiresAt <= Date.now()));

  async function handleCreate() {
    if (!message.trim()) { toast.error("Message is required"); return; }
    setBusy(true);
    try {
      await createMut({
        message: message.trim(),
        type,
        expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
      });
      toast.success("Announcement created");
      setMessage(""); setExpiresAt(""); setShowForm(false);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  }

  async function handleDeactivate(id: any) {
    try { await deactivateMut({ id }); toast.success("Deactivated"); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  }

  async function handleDelete(id: any) {
    if (!confirm("Delete this announcement?")) return;
    try { await deleteMut({ id }); toast.success("Deleted"); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
          <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">Announcements</h2>
          <p className="text-[13px] text-(--text-faint)">Create banners that appear on the user app.</p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium cursor-pointer
            shrink-0 transition-colors duration-75
            ${showForm
              ? "bg-(--bg-hover) text-(--text-secondary) border border-(--border-subtle)"
              : "bg-[#3A5EFF] hover:bg-[#4a6aff] text-white border border-transparent"
            }
          `}
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancel" : "New"}
        </button>
      </div>

      {/* ── Create form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)">
              <p className="text-[12px] font-medium text-(--text-secondary)">New Announcement</p>

              {/* Type selector */}
              <div>
                <p className="text-[11px] text-(--text-disabled) mb-1.5">Type</p>
                <div className="flex gap-1.5">
                  {(["info", "warning", "success"] as AnnouncementType[]).map((t) => (
                    <TypeButton key={t} type={t} selected={type === t} onSelect={() => setType(t)} />
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-[11px] text-(--text-disabled) mb-1.5">Message</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. We're currently performing maintenance on the code execution service…"
                  rows={3}
                  className="
                    w-full px-3 py-2 text-[13px] leading-relaxed resize-vertical
                    bg-(--bg-input) border border-(--border-subtle) rounded-md
                    text-(--text-primary) outline-none
                    focus:border-[rgba(58,94,255,0.4)] focus:ring-0
                    transition-colors duration-75
                    font-sans
                  "
                />
              </div>

              {/* Expiry */}
              <div>
                <p className="text-[11px] text-(--text-disabled) mb-1.5">Expires at (optional)</p>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="
                    h-[34px] px-3 text-[12px]
                    bg-(--bg-input) border border-(--border-subtle) rounded-md
                    text-(--text-primary) outline-none
                    focus:border-[rgba(58,94,255,0.4)]
                    transition-colors duration-75
                  "
                />
              </div>

              {/* Preview */}
              {message.trim() && (
                <div>
                  <p className="text-[11px] text-(--text-disabled) mb-1.5">Preview</p>
                  <AnnouncementBanner announcement={{ message, type }} />
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleCreate}
                disabled={busy || !message.trim()}
                className={`
                  self-end px-4 py-2 rounded-md text-[12px] font-medium text-white
                  bg-[#3A5EFF] hover:bg-[#4a6aff] transition-colors duration-75
                  ${(busy || !message.trim()) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {busy ? "Creating…" : "Create Announcement"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active announcements ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">
          Active ({active.length})
        </p>

        {announcements === undefined ? (
          <div className="flex justify-center py-8">
            <div className="w-4 h-4 border-2 border-[rgba(58,94,255,0.3)] border-t-[#3A5EFF] rounded-full animate-spin" />
          </div>
        ) : active.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-7 text-(--text-disabled) border border-dashed border-(--border-subtle) rounded-lg">
            <Megaphone className="w-6 h-6" />
            <p className="text-[12px]">No active announcements</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {active.map((a: any) => {
              const m = TYPE_META[a.type as AnnouncementType] ?? TYPE_META.info;
              return (
                <motion.div
                  key={String(a._id)}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="rounded-lg border border-(--border-subtle) overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 px-3.5 py-3 bg-(--bg-elevated)">
                    {/* Type icon */}
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border ${m.iconBgClass}`}>
                      <m.Icon className={`w-3 h-3 ${m.colorClass}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-(--text-secondary) leading-relaxed">{a.message}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-(--text-disabled)">
                          Created {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                        {a.expiresAt && (
                          <span className="text-[10px] text-(--text-disabled)">
                            Expires {new Date(a.expiresAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDeactivate(a._id)}
                        title="Deactivate"
                        className="
                          flex items-center gap-1 px-2 py-1 rounded text-[11px]
                          text-(--text-faint) border border-(--border-subtle) bg-transparent
                          hover:bg-(--bg-hover) transition-colors duration-75 cursor-pointer
                        "
                      >
                        <Power className="w-3 h-3" /> Off
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        title="Delete"
                        className="
                          flex items-center p-1.5 rounded text-(--text-faint)
                          hover:text-red-400/70 hover:bg-red-500/[0.06]
                          transition-colors duration-75 cursor-pointer
                        "
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Inactive / expired ── */}
      {inactive.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2.5">
            Inactive / Expired ({inactive.length})
          </p>
          <div className="flex flex-col gap-1 opacity-50">
            {inactive.map((a: any) => {
              const m = TYPE_META[a.type as AnnouncementType] ?? TYPE_META.info;
              return (
                <div
                  key={String(a._id)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-(--bg-elevated) border border-(--border-subtle)"
                >
                  <m.Icon className="w-3.5 h-3.5 shrink-0 text-(--text-disabled)" />
                  <p className="flex-1 text-[12px] text-(--text-faint) truncate">{a.message}</p>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="p-0.5 text-(--text-disabled) hover:text-red-400/70 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}