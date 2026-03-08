// convex/_helper.ts

// ─── Existing helpers (unchanged) ────────────────────────────────────────────

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
      error:
        "phoneNumber must contain only digits and optional leading + and be 7-15 digits long.",
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
        return {
          ok: false,
          error: `URL must be from one of: ${domainWhitelist.join(", ")}`,
        };
    } catch {
      return { ok: false, error: "Invalid URL." };
    }
  }
  return { ok: true };
}

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
      if (platform === "github") {
        if (!host.includes("github.com"))
          return { ok: false, error: "URL must be a github.com URL." };
      } else if (platform === "leetcode") {
        if (!host.includes("leetcode.com"))
          return { ok: false, error: "URL must be a leetcode.com URL." };
      } else {
        return { ok: false, error: "Unsupported platform." };
      }
      const normalized = u.href.replace(/\/+$/, "");
      return { ok: true, url: normalized };
    } catch {
      return { ok: false, error: "Invalid URL." };
    }
  }

  const username = raw.replace(/^@/, "").trim();
  if (!/^[A-Za-z0-9_.\-]+$/.test(username)) {
    return {
      ok: false,
      error: "Platform username contains invalid characters.",
    };
  }

  if (platform === "github") {
    return { ok: true, url: `https://github.com/${username}` };
  } else if (platform === "leetcode") {
    return { ok: true, url: `https://leetcode.com/u/${username}` };
  } else {
    return { ok: false, error: "Unsupported platform." };
  }
}

// ─── NEW: Role-based auth helpers ────────────────────────────────────────────

/**
 * Require the caller to be an admin.
 * Throws if not authenticated or not in the admins table.
 * Returns the caller's userId.
 */
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

/**
 * Require the caller to be an approved instructor.
 * Throws if not authenticated, not in the instructors table, or not approved.
 * Returns the caller's userId.
 */
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

/**
 * Require the caller to be either an admin OR an approved instructor.
 * Returns { userId, role: "admin" | "instructor" }
 */
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

  if (instructorRow && instructorRow.isApproved)
    return { userId, role: "instructor" };

  throw new Error("Forbidden: admins or approved instructors only");
}

/**
 * Shared slug generator used across content types.
 */
export function makeSlug(input: string): string {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Content status type shared across sheets, articles, quizzes, certs.
 */
export type ContentStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected";
