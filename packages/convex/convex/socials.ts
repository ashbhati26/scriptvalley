import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim();
}

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isReasonableUrlLength(value: string) {
  return value.length <= 2048;
}

function logWarning(ctx: any, message: string, meta: any = {}) {
  try {
    ctx.debug?.log?.(message, meta);
  } catch {
    console.warn("socials warning:", message, meta);
  }
}

export const getUserSocialLinks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = sanitizeString(args.userId);
    if (!userId) return null;

    return await ctx.db
      .query("socials")
      .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
      .unique();
  },
});

export const updateSocialLinks = mutation({
  args: {
    userId: v.string(),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    portfolio: v.optional(v.string()),
    resume: v.optional(v.string()),
    idToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = sanitizeString(args.userId);
    if (!userId) throw new Error("Missing userId");

    const linkedin = sanitizeString(args.linkedin ?? "");
    const twitter = sanitizeString(args.twitter ?? "");
    const portfolio = sanitizeString(args.portfolio ?? "");
    const resume = sanitizeString(args.resume ?? "");

    // Basic validation
    const invalidFields: string[] = [];
    for (const [k, v] of [
      ["linkedin", linkedin],
      ["twitter", twitter],
      ["portfolio", portfolio],
      ["resume", resume],
    ] as const) {
      if (v) {
        if (!isValidUrl(v) || !isReasonableUrlLength(v)) {
          invalidFields.push(k);
        }
      }
    }

    if (invalidFields.length) {
      logWarning(ctx, "Rejected updateSocialLinks: invalid URLs", {
        userId,
        invalidFields,
      });
      throw new Error(`Invalid URL(s) for: ${invalidFields.join(", ")}`);
    }

    if (args.idToken) {
      logWarning(ctx, "updateSocialLinks called with idToken (not verified)", {
        userId,
        tokenPrefix: (args.idToken as string).slice(0, 8) + "...",
      });
    }

    const now = new Date().toISOString();
    const payload: any = {
      userId,
      linkedin: linkedin || "",
      twitter: twitter || "",
      portfolio: portfolio || "",
      resume: resume || "",
      updatedAt: now,
    };

    try {
      const existing = await ctx.db
        .query("socials")
        .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, payload);
        return await ctx.db.get(existing._id);
      } else {
        return await ctx.db.insert("socials", { ...payload, createdAt: now });
      }
    } catch (err: any) {
      logWarning(ctx, "updateSocialLinks DB error", { err: err?.message || err, userId });
      throw new Error("Failed to save social links (server error)");
    }
  },
});
