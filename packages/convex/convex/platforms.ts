// convex/platforms.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim();
}

function isReasonableLength(s: string, max = 2048) {
  return s.length <= max;
}

function isValidHttpUrl(value: string) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function logWarn(ctx: any, message: string, meta: any = {}) {
  try {
    ctx.debug?.log?.(message, meta);
  } catch {
    console.warn("platforms warning:", message, meta);
  }
}

export const getUserPlatformData = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = sanitizeString(args.userId);
    if (!userId) return null;

    return await ctx.db
      .query("platforms")
      .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
      .unique();
  },
});

export const updateDevStats = mutation({
  args: {
    userId: v.string(),
    platform: v.string(),
    stats: v.any(),
    idToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = sanitizeString(args.userId);
    if (!userId) throw new Error("Missing userId");

    const platform = sanitizeString(args.platform).toLowerCase();
    const stats = args.stats ?? {};

    // Use `undefined` to mean "not provided" so we don't accidentally overwrite existing fields.
    let githubUrl: string | undefined = undefined;
    let leetcodeUrl: string | undefined = undefined;

    // If client provided either full URL or username, compute the intended value.
    // We treat an explicit empty string as an intent to clear the value.
    if (platform === "github" || platform === "all") {
      const raw = (stats as any).githubUrl ?? (stats as any).githubUsername;
      if (raw !== undefined) {
        const g = sanitizeString(raw);
        if (g && !g.includes("http")) {
          githubUrl = `https://github.com/${g}`;
        } else {
          githubUrl = g; // may be "" if client intentionally cleared
        }
      }
    }

    if (platform === "leetcode" || platform === "all") {
      const raw = (stats as any).leetcodeUrl ?? (stats as any).leetcodeUsername;
      if (raw !== undefined) {
        const l = sanitizeString(raw);
        if (l && !l.includes("http")) {
          leetcodeUrl = `https://leetcode.com/u/${l}`;
        } else {
          leetcodeUrl = l;
        }
      }
    }

    const invalid: string[] = [];
    if (githubUrl !== undefined && githubUrl) {
      if (!isValidHttpUrl(githubUrl) || !isReasonableLength(githubUrl)) invalid.push("githubUrl");
    }
    if (leetcodeUrl !== undefined && leetcodeUrl) {
      if (!isValidHttpUrl(leetcodeUrl) || !isReasonableLength(leetcodeUrl)) invalid.push("leetcodeUrl");
    }

    if (invalid.length) {
      logWarn(ctx, "Rejected updateDevStats: invalid fields", { userId, invalid });
      throw new Error(`Invalid field(s): ${invalid.join(", ")}`);
    }

    if ((args as any).idToken) {
      logWarn(ctx, "updateDevStats called with idToken (not verified)", {
        userId,
        tokenPrefix: ((args as any).idToken as string).slice(0, 8) + "...",
      });
    }

    const now = new Date().toISOString();

    const payload: any = {
      userId,
      updatedAt: now,
    };

    // Only include the keys that were explicitly provided by the client.
    if (githubUrl !== undefined) {
      // githubUrl may be "" (client intentionally clears) or a non-empty URL
      payload.githubUrl = githubUrl;
    }
    if (leetcodeUrl !== undefined) {
      payload.leetcodeUrl = leetcodeUrl;
    }

    try {
      const existing = await ctx.db
        .query("platforms")
        .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, payload);
        return await ctx.db.get(existing._id);
      } else {
        return await ctx.db.insert("platforms", { ...payload, createdAt: now });
      }
    } catch (err: any) {
      logWarn(ctx, "updateDevStats DB error", { err: err?.message || err, userId, payload });
      throw new Error("Failed to save platform data (server error)");
    }
  },
});
