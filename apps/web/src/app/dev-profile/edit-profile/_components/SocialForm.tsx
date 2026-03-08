"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Linkedin, Twitter, Globe, FileText, Save } from "lucide-react";

const FIELDS = [
  { label: "LinkedIn", name: "linkedin",  icon: Linkedin, placeholder: "https://linkedin.com/in/johndoe"     },
  { label: "Twitter",  name: "twitter",   icon: Twitter,  placeholder: "https://twitter.com/johndoe"         },
  { label: "Website",  name: "portfolio", icon: Globe,    placeholder: "https://yourportfolio.com"            },
  { label: "Resume",   name: "resume",    icon: FileText, placeholder: "https://drive.google.com/file/xyz"   },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];
type UserSocials = { linkedin?: string | null; twitter?: string | null; portfolio?: string | null; resume?: string | null; [k: string]: unknown };
type UpdateSocialsPayload = { userId: string; linkedin?: string; twitter?: string; portfolio?: string; resume?: string; idToken?: string };

const isValidUrl = (v: string) => {
  if (!v) return true;
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; }
  catch { return false; }
};

export default function SocialForm() {
  const { user, isSignedIn } = useUser();
  const { getToken }         = useAuth();
  const userId               = user?.id ?? "";

  const userData      = useQuery(api.socials.getUserSocialLinks, userId ? { userId } : "skip");
  const updateSocials = useMutation(api.socials.updateSocialLinks);

  const [formData, setFormData] = useState<Record<FieldName, string>>({
    linkedin: "", twitter: "", portfolio: "", resume: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userData) return;
    const ud = userData as unknown as UserSocials;
    setFormData({ linkedin: ud.linkedin ?? "", twitter: ud.twitter ?? "", portfolio: ud.portfolio ?? "", resume: ud.resume ?? "" });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["linkedin", "twitter", "portfolio", "resume"].includes(name)) {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !userId) { toast.error("Please sign in."); return; }
    for (const key of Object.keys(formData) as FieldName[]) {
      if (formData[key] && !isValidUrl(formData[key])) { toast.error(`Valid URL required for ${key}`); return; }
    }
    setIsSaving(true);
    try {
      let idToken: string | undefined;
      try { const t = await getToken({ template: "convex" }); idToken = t ?? undefined; } catch { /* noop */ }
      const payload: UpdateSocialsPayload = {
        userId,
        linkedin:  formData.linkedin  || undefined,
        twitter:   formData.twitter   || undefined,
        portfolio: formData.portfolio || undefined,
        resume:    formData.resume    || undefined,
        idToken,
      };
      await updateSocials(payload);
      toast.success("Social links updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
    } finally { setIsSaving(false); }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="max-w-xl space-y-3"
    >
      {FIELDS.map(({ name, label, icon: Icon, placeholder }, idx) => {
        const invalid = Boolean(formData[name] && !isValidUrl(formData[name]));
        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: idx * 0.04 }}
            className={`rounded-lg border overflow-hidden transition-colors duration-100 ${
              invalid ? "border-red-500/30" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
            }`}
          >
            {/* Header row */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-input)] border-b border-[var(--border-default)]">
              <div className="w-6 h-6 rounded-md bg-[var(--bg-hover)] flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3 text-[var(--text-faint)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">{label}</p>
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-base)]">
              <input
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label={label}
                className="flex-1 h-8 bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none"
              />
            </div>

            {invalid && (
              <p className="text-[10px] text-red-400/70 px-3 pb-2 bg-[var(--bg-base)]">
                Enter a valid https:// URL
              </p>
            )}
          </motion.div>
        );
      })}

      <div className="flex items-center gap-3 pt-2">
        {/* Save — brand primary action, intentionally hardcoded */}
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#3A5EFF] hover:bg-[#4a6aff] text-white text-sm font-medium transition-colors duration-100 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
        <p className="text-xs text-[var(--text-disabled)]">Help employers find you</p>
      </div>
    </motion.form>
  );
}