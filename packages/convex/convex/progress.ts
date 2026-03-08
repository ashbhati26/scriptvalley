// convex/progress.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get attempts for a user (by userId)
 */
export const getAttempts = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("attempts")
      .withIndex("by_user_question", (q: any) => q.eq("userId", userId))
      .collect();
  },
});

/**
 * Alias - same as getAttempts (kept for compatibility)
 */
export const getAllAttempts = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("attempts")
      .withIndex("by_user_question", (q: any) => q.eq("userId", userId))
      .collect();
  },
});

/**
 * Toggle follow/unfollow for a sheet (user-side)
 */
export const toggleFollow = mutation({
  args: {
    userId: v.string(),
    sheetSlug: v.string(),
    follow: v.boolean(),
  },
  handler: async (ctx, { userId, sheetSlug, follow }) => {
    const existing = await ctx.db
      .query("user_sheet_follow")
      .withIndex("by_user_sheet", (q: any) =>
        q.eq("userId", userId).eq("sheetSlug", sheetSlug)
      )
      .unique()
      .catch(() => null);

    if (follow && !existing) {
      await ctx.db.insert("user_sheet_follow", {
        userId,
        sheetSlug,
        followedAt: Date.now(),
      });
      return { ok: true, follow: true };
    }

    if (!follow && existing) {
      await ctx.db.delete(existing._id);
      return { ok: true, follow: false };
    }

    return { ok: true, follow };
  },
});

/**
 * Get all sheets followed by a user, returning joined sheet metadata
 */
export const getFollowedSheets = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const follows = await ctx.db
      .query("user_sheet_follow")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    const results: { id: string; name: string; topics: any[]; route: string }[] =
      [];

    for (const f of follows) {
      // join sheet metadata
      const sheet = await ctx.db
        .query("dsaSheets")
        .withIndex("by_slug", (q: any) => q.eq("slug", f.sheetSlug))
        .unique()
        .catch(() => null);

      if (sheet) {
        results.push({
          id: sheet.slug,
          name: sheet.name ?? sheet.slug,
          topics: (sheet.content as any)?.topics ?? [],
          route: `/dsa-sheet/${sheet.slug}`,
        });
      }
    }

    return results;
  },
});

/**
 * Record an attempt and update per-sheet progress summary.
 *
 * Required args:
 *  - userId
 *  - questionTitle
 *  - sheetSlug
 *  - difficulty ("Easy"|"Medium"|"Hard")
 *  - attempted (boolean)
 *
 * This will:
 *  1) upsert the attempts row (including difficulty & sheetSlug)
 *  2) recompute the sheet progress for the given user+sheet (based on attempts rows for that user & sheet)
 *  3) upsert the sheet_progress row
 */
export const recordAttempt = mutation({
  args: {
    userId: v.string(),
    questionTitle: v.string(),
    sheetSlug: v.string(),
    difficulty: v.string(),
    attempted: v.boolean(),
  },
  handler: async (
    ctx,
    { userId, questionTitle, sheetSlug, difficulty, attempted }
  ) => {
    // 1) Upsert attempt row
    const existing = await ctx.db
      .query("attempts")
      .withIndex("by_user_question", (q: any) =>
        q.eq("userId", userId).eq("questionTitle", questionTitle)
      )
      .unique()
      .catch(() => null);

    if (existing) {
      await ctx.db.patch(existing._id, {
        attempted,
        difficulty,
        sheetSlug,
      });
    } else {
      await ctx.db.insert("attempts", {
        userId,
        questionTitle,
        sheetSlug,
        difficulty,
        attempted,
      });
    }

    // 2) Recompute progress only for this user + sheet
    const userAttempts = await ctx.db
      .query("attempts")
      .withIndex("by_user_question", (q: any) => q.eq("userId", userId))
      .collect();

    // Filter attempts to only those for this sheet
    const relevant = userAttempts.filter(
      (a: any) => String(a.sheetSlug) === String(sheetSlug) && !!a.attempted
    );

    const totalSolved = relevant.length;

    const byDifficulty: { easy: number; medium: number; hard: number } = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    for (const a of relevant) {
      const d = String(a.difficulty || "medium").toLowerCase();
      if (d.startsWith("easy")) byDifficulty.easy++;
      else if (d.startsWith("hard")) byDifficulty.hard++;
      else byDifficulty.medium++;
    }

    // 3) Upsert sheet_progress for this user+sheet
    const existingProgress = await ctx.db
      .query("sheet_progress")
      .withIndex("by_user_sheet", (q: any) =>
        q.eq("userId", userId).eq("sheetSlug", sheetSlug)
      )
      .unique()
      .catch(() => null);

    const now = Date.now();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        totalAttempted: relevant.length,
        totalSolved,
        byDifficulty,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("sheet_progress", {
        userId,
        sheetSlug,
        totalAttempted: relevant.length,
        totalSolved,
        byDifficulty,
        updatedAt: now,
      });
    }

    return { ok: true, totalSolved, byDifficulty };
  },
});
