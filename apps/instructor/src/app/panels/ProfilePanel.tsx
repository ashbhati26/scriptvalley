"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import toast from "react-hot-toast";
import { User, Mail, CheckCircle2, Clock, Pencil, X, CalendarDays, Shield } from "lucide-react";

export default function ProfilePanel() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip      = !isLoaded || !isSignedIn;
  const profile   = useQuery(api.instructors.getMyProfile, skip ? "skip" : undefined) as any | null | undefined;
  const updateBio = useMutation(api.instructors.updateMyBio);

  const [editingBio, setEditingBio] = useState(false);
  const [bio,        setBio]        = useState("");
  const [saving,     setSaving]     = useState(false);

  function startEdit() { setBio(profile?.bio ?? ""); setEditingBio(true); }

  async function saveBio() {
    setSaving(true);
    try { await updateBio({ bio: bio.trim() }); toast.success("Bio updated"); setEditingBio(false); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setSaving(false); }
  }

  if (profile === undefined) {
    return (
      <div style={{ padding: "36px 32px 80px", maxWidth: 560 }}>
        {[80, 60, 120].map((h, i) => <div key={i} className="sv-card sv-pulse" style={{ height: h, marginBottom: 12 }} />)}
      </div>
    );
  }
  if (!profile) return null;

  const approvedDate = profile.approvedAt
    ? new Date(profile.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;
  const appliedDate = profile.appliedAt
    ? new Date(profile.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  const accountRows = [
    { label: "Member since", Icon: CalendarDays, value: appliedDate ?? "—",    valueColor: "var(--text-secondary)" },
    { label: "Status",       Icon: Shield,       value: profile.isApproved ? "Approved" : "Pending", valueColor: profile.isApproved ? "var(--success)" : "var(--warning)" },
    { label: "Email",        Icon: Mail,         value: profile.email,          valueColor: "var(--text-secondary)" },
  ];

  return (
    <div style={{ padding: "36px 32px 80px", maxWidth: 560, width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="font-bold sv-text-primary" style={{ fontSize: "clamp(20px,4vw,24px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Profile
        </h2>
        <p className="text-[13px] sv-text-faint" style={{ marginTop: 8 }}>Your instructor identity on ScriptValley.</p>
      </div>

      {/* Status banner */}
      {profile.isApproved ? (
        <div className="sv-banner-success" style={{ marginBottom: 28 }}>
          <div className="sv-icon-badge sv-icon-badge-success flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28 }}>
            <CheckCircle2 size={14} className="sv-text-success" />
          </div>
          <div>
            <p className="text-[13px] font-semibold sv-text-success">Account approved</p>
            {approvedDate && <p className="text-[11px] sv-text-muted" style={{ marginTop: 3 }}>Approved {approvedDate}</p>}
          </div>
        </div>
      ) : (
        <div className="sv-banner-warning" style={{ marginBottom: 28 }}>
          <Clock size={14} className="sv-text-warning flex-shrink-0" style={{ marginTop: 1 }} />
          <div>
            <p className="text-[13px] font-semibold sv-text-warning">Pending admin approval</p>
            <p className="text-[12px] sv-text-muted" style={{ marginTop: 3, lineHeight: 1.55 }}>You can create content — nothing goes live until approved.</p>
          </div>
        </div>
      )}

      {/* Identity card */}
      <p className="sv-section-label" style={{ marginBottom: 12 }}>Identity</p>
      <div className="sv-card" style={{ marginBottom: 28 }}>
        {/* Avatar + name */}
        <div className="flex items-center gap-4" style={{ padding: "18px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={profile.name} className="object-cover flex-shrink-0"
              style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }} />
          ) : (
            <div className="sv-bg-hover flex items-center justify-center flex-shrink-0"
              style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <User size={20} className="sv-text-disabled" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold sv-text-primary sv-truncate" style={{ letterSpacing: "-0.01em" }}>{profile.name}</p>
            <p className="text-[12px] sv-text-faint flex items-center gap-1.5" style={{ marginTop: 4 }}>
              <Mail size={11} />{profile.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div style={{ padding: "16px 20px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <p className="sv-section-label">Bio</p>
            {!editingBio && (
              <button onClick={startEdit} className="sv-btn-ghost flex items-center gap-1 text-[12px] sv-text-faint sv-rounded-full" style={{ padding: "3px 8px" }}>
                <Pencil size={10} />Edit
              </button>
            )}
          </div>

          {editingBio ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={bio} onChange={(e) => setBio(e.target.value)}
                rows={4} maxLength={300} placeholder="Tell students about yourself…"
                className="sv-input resize-none"
                style={{ padding: "10px 12px", fontSize: 13, lineHeight: 1.65, fontFamily: "var(--font-sans)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] sv-text-disabled">{bio.length}/300</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingBio(false)}
                    className="flex items-center gap-1 text-[12px] sv-text-muted sv-bg-hover cursor-pointer sv-rounded-full"
                    style={{ padding: "5px 12px", border: "1px solid var(--border-default)" }}>
                    <X size={10} />Cancel
                  </button>
                  <button onClick={saveBio} disabled={saving}
                    className="sv-btn-primary flex items-center gap-1 text-[12px] sv-rounded-full"
                    style={{ padding: "5px 14px", opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer" }}>
                    {saving && <div className="sv-spinner sv-spinner-sm" style={{ borderColor: "rgba(255,255,255,0.35)", borderTopColor: "white" }} />}
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[13px]" style={{ letterSpacing: "-0.01em", lineHeight: 1.65, color: profile.bio ? "var(--text-secondary)" : "var(--text-disabled)", fontStyle: profile.bio ? "normal" : "italic" }}>
              {profile.bio ?? "No bio yet — click Edit to add one."}
            </p>
          )}
        </div>
      </div>

      {/* Account details */}
      <p className="sv-section-label" style={{ marginBottom: 12 }}>Account Details</p>
      <div className="sv-card">
        {accountRows.map(({ label, Icon, value, valueColor }, i, arr) => (
          <div key={label} className="flex items-center justify-between gap-2"
            style={{ padding: "12px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
            <span className="flex items-center gap-2 text-[13px] sv-text-faint flex-shrink-0" style={{ letterSpacing: "-0.01em" }}>
              <Icon size={12} className="flex-shrink-0" />{label}
            </span>
            <span className="text-[13px] font-medium sv-truncate text-right" style={{ maxWidth: 200, letterSpacing: "-0.01em", color: valueColor }}>{value}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] sv-text-disabled" style={{ marginTop: 16, letterSpacing: "-0.003em", lineHeight: 1.6 }}>
        Name and email are managed in your Clerk account settings.
      </p>
    </div>
  );
}