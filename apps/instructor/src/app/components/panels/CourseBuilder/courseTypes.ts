// ─── Types ────────────────────────────────────────────────────────────────────
export type FilterKey = "all" | "draft" | "pending_review" | "published" | "rejected";

export interface Module {
  _key:    string;
  order:   number;
  title:   string;
  slug:    string;
  content: string; // TipTap HTML
}

export interface CourseForm {
  _id?:             string;
  title:            string;
  slug:             string;
  description:      string;
  status?:          string;
  modules:          Module[];
  createdAt?:       number;
  rejectionReason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function makeSlug(v = "") {
  return v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function emptyModule(order: number): Module {
  return {
    _key:    crypto.randomUUID(),
    order,
    title:   "",
    slug:    `module-${order + 1}`,
    content: "",
  };
}

// ─── Status meta ──────────────────────────────────────────────────────────────
export const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",      border: "var(--border-subtle)"  },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.20)" },
  published:      { label: "Published", color: "var(--brand)",      bg: "var(--brand-subtle)",  border: "var(--brand-border)"  },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.20)" },
};