"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import toast from "react-hot-toast";
import {
  User, Mail, CheckCircle2, Clock,
  Pencil, X, BookOpen, CalendarDays,
} from "lucide-react";

export default function ProfilePanel() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const skip = !isLoaded || !isSignedIn;

  const profile   = useQuery(api.instructors.getMyProfile, skip ? "skip" : undefined) as any | null | undefined;
  const updateBio = useMutation(api.instructors.updateMyBio);

  const [editingBio, setEditingBio] = useState(false);
  const [bio,        setBio]        = useState("");
  const [saving,     setSaving]     = useState(false);

  function startEdit() {
    setBio(profile?.bio ?? "");
    setEditingBio(true);
  }

  async function saveBio() {
    setSaving(true);
    try {
      await updateBio({ bio: bio.trim() });
      toast.success("Bio updated");
      setEditingBio(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update bio");
    } finally {
      setSaving(false);
    }
  }

  if (profile === undefined) {
    return (
      <div className="px-5 py-10 md:px-8 max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-(--bg-elevated) border border-(--border-subtle) animate-pulse" />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const approvedDate = profile.approvedAt
    ? new Date(profile.approvedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const appliedDate = profile.appliedAt
    ? new Date(profile.appliedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 max-w-2xl space-y-6">

      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Account</p>
        <h2 className="text-2xl font-semibold text-(--text-primary)">Profile</h2>
        <p className="text-xs text-(--text-faint) mt-1">Your instructor identity on ScriptValley.</p>
      </div>

      {/* Status banner */}
      {profile.isApproved ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-(--brand-border) bg-(--brand-subtle)">
          <CheckCircle2 className="w-4 h-4 text-(--brand) shrink-0" />
          <div>
            <p className="text-xs font-semibold text-(--brand)">Account approved</p>
            {approvedDate && <p className="text-[10px] text-(--text-faint) mt-0.5">Approved on {approvedDate}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-500">Pending admin approval</p>
            <p className="text-[10px] text-(--text-faint) mt-0.5">
              Your account is under review. You can create content, but nothing goes live until approval.
            </p>
          </div>
        </div>
      )}

      {/* Identity card */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border-subtle) bg-(--bg-input)">
          <p className="text-xs font-semibold text-(--text-secondary)">Identity</p>
          <p className="text-[10px] text-(--text-disabled) mt-0.5">
            Name and email are managed in your Clerk account settings.
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={profile.name}
                className="w-14 h-14 rounded-xl border border-(--border-subtle) object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl border border-(--border-subtle) bg-(--bg-hover) flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-(--text-disabled)" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-lg font-semibold text-(--text-primary) leading-tight truncate">
                {profile.name}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-(--text-faint) mt-1">
                <Mail className="w-3 h-3 shrink-0" />
                {profile.email}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-widest text-(--text-disabled)">Bio</label>
              {!editingBio && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1 text-[10px] text-(--text-faint) hover:text-(--brand) transition-colors"
                >
                  <Pencil className="w-2.5 h-2.5" />Edit
                </button>
              )}
            </div>

            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={300}
                  placeholder="Tell students about yourself…"
                  className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--brand-border) resize-none transition-colors"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-(--text-disabled)">{bio.length}/300</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingBio(false)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-(--border-subtle) text-xs text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
                    >
                      <X className="w-3 h-3" />Cancel
                    </button>
                    <button
                      onClick={saveBio}
                      disabled={saving}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {saving
                        ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        : <BookOpen className="w-3 h-3" />}
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className={`text-sm leading-relaxed ${profile.bio ? "text-(--text-secondary)" : "text-(--text-disabled) italic"}`}>
                {profile.bio ?? "No bio yet — click Edit to add one."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) p-5">
        <p className="text-xs font-semibold text-(--text-secondary) mb-4">Account Details</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-(--text-faint)">
              <CalendarDays className="w-3.5 h-3.5" />Member since
            </span>
            <span className="text-(--text-secondary) font-medium">{appliedDate ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-(--text-faint)">
              <CheckCircle2 className="w-3.5 h-3.5" />Status
            </span>
            <span className={`text-xs font-semibold ${profile.isApproved ? "text-(--brand)" : "text-amber-500"}`}>
              {profile.isApproved ? "Approved" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-(--text-faint)">
              <Mail className="w-3.5 h-3.5" />Email
            </span>
            <span className="text-(--text-secondary) font-medium text-xs truncate max-w-[200px]">
              {profile.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}