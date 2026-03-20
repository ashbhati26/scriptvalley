// Shared utilities and auth guards used across all Convex functions.

export function normalizePhone(phone: string | undefined | null): string | null {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[\s\-()]/g, "");
  return cleaned === "" ? null : cleaned;
}

export function validatePhone(
  phone: string | undefined | null,
): { ok: true } | { ok: false; error: string } {
  if (!phone) return { ok: true };
  const normalized = normalizePhone(phone);
  if (!normalized) return { ok: true };
  if (!/^[+0-9]{7,15}$/.test(normalized)) {
    return {
      ok: false,
      error: "Phone must contain only digits with an optional leading + and be 7–15 digits long.",
    };
  }
  return { ok: true };
}

export function isAbsoluteHttpUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSocialUrl(
  url: string | undefined | null,
  domainWhitelist?: string[],
): { ok: true } | { ok: false; error: string } {
  if (!url || url.trim() === "") return { ok: true };
  if (!isAbsoluteHttpUrl(url))
    return { ok: false, error: "URL must be an absolute http/https URL." };

  if (domainWhitelist && domainWhitelist.length > 0) {
    try {
      const host = new URL(url).host.toLowerCase();
      const matched = domainWhitelist.some((d) => host.includes(d));
      if (!matched)
        return { ok: false, error: `URL must be from one of: ${domainWhitelist.join(", ")}` };
    } catch {
      return { ok: false, error: "Invalid URL." };
    }
  }
  return { ok: true };
}

// Converts a raw username or full URL into a canonical platform URL.
export function normalizePlatformUrl(
  platform: string,
  value: string | undefined | null,
): { ok: true; url: string | null } | { ok: false; error: string } {
  if (!value || value.trim() === "") return { ok: true, url: null };
  const raw = value.trim();

  if (isAbsoluteHttpUrl(raw)) {
    try {
      const u = new URL(raw);
      const host = u.host.toLowerCase();
      if (platform === "github" && !host.includes("github.com"))
        return { ok: false, error: "URL must be a github.com URL." };
      if (platform === "leetcode" && !host.includes("leetcode.com"))
        return { ok: false, error: "URL must be a leetcode.com URL." };
      if (platform !== "github" && platform !== "leetcode")
        return { ok: false, error: "Unsupported platform." };
      return { ok: true, url: u.href.replace(/\/+$/, "") };
    } catch {
      return { ok: false, error: "Invalid URL." };
    }
  }

  const username = raw.replace(/^@/, "").trim();
  if (!/^[A-Za-z0-9_.\-]+$/.test(username))
    return { ok: false, error: "Platform username contains invalid characters." };

  if (platform === "github") return { ok: true, url: `https://github.com/${username}` };
  if (platform === "leetcode") return { ok: true, url: `https://leetcode.com/u/${username}` };
  return { ok: false, error: "Unsupported platform." };
}

// Throws if the caller is not in the admins table. Returns their userId.
export async function requireAdmin(db: any, auth: any): Promise<string> {
  const identity = await auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const row = await db
    .query("admins")
    .withIndex("by_user_id", (q: any) => q.eq("userId", identity.subject))
    .unique();

  if (!row) throw new Error("Forbidden: admins only");
  return identity.subject;
}

// Throws if the caller is not an approved instructor. Returns their userId.
export async function requireInstructor(db: any, auth: any): Promise<string> {
  const identity = await auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const row = await db
    .query("instructors")
    .withIndex("by_user_id", (q: any) => q.eq("userId", identity.subject))
    .unique();

  if (!row) throw new Error("Forbidden: not an instructor");
  if (!row.isApproved) throw new Error("Forbidden: instructor not yet approved");
  return identity.subject;
}

// Returns the caller's userId and role. Throws if neither admin nor approved instructor.
export async function requireAdminOrInstructor(
  db: any,
  auth: any,
): Promise<{ userId: string; role: "admin" | "instructor" }> {
  const identity = await auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const userId = identity.subject;

  const adminRow = await db
    .query("admins")
    .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
    .unique();

  if (adminRow) return { userId, role: "admin" };

  const instructorRow = await db
    .query("instructors")
    .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
    .unique();

  if (instructorRow?.isApproved) return { userId, role: "instructor" };

  throw new Error("Forbidden: admins or approved instructors only");
}

// Turns any string into a URL-safe slug.
export function makeSlug(input: string): string {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
}

export type ContentStatus = "draft" | "pending_review" | "published" | "rejected";

// Reusable helper to upsert sheet_progress for a user + sheet combo.
// Used by both progress.ts and potd.ts to keep progress writes consistent.
export async function upsertSheetProgress(
  db: any,
  userId: string,
  sheetSlug: string,
  relevant: { difficulty: string; attempted: boolean }[],
) {
  const solved = relevant.filter((a) => a.attempted);

  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const a of solved) {
    const d = String(a.difficulty || "medium").toLowerCase();
    if (d.startsWith("easy"))      byDifficulty.easy++;
    else if (d.startsWith("hard")) byDifficulty.hard++;
    else                           byDifficulty.medium++;
  }

  const existing = await db
    .query("sheet_progress")
    .withIndex("by_user_sheet", (q: any) =>
      q.eq("userId", userId).eq("sheetSlug", sheetSlug)
    )
    .unique()
    .catch(() => null);

  const now = Date.now();
  const payload = {
    totalAttempted: solved.length,
    totalSolved:    solved.length,
    byDifficulty,
    updatedAt:      now,
  };

  if (existing) {
    await db.patch(existing._id, payload);
  } else {
    await db.insert("sheet_progress", { userId, sheetSlug, ...payload });
  }
}