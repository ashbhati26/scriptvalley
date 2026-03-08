import { query } from "./_generated/server";
import { v } from "convex/values";

export const getIndividualReport = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    const follows = await ctx.db
      .query("user_sheet_follow")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const progressRows = await ctx.db
      .query("sheet_progress")
      .withIndex("by_user_sheet", (q) => q.eq("userId", userId))
      .collect();

    const sheets: {
      slug: string;
      name: string;
      category?: string;
      totalSolved: number;
      totalAttempted: number;
      byDifficulty: { easy: number; medium: number; hard: number };
    }[] = [];

    for (const f of follows) {
      const sheet = await ctx.db
        .query("dsaSheets")
        .withIndex("by_slug", (q) => q.eq("slug", f.sheetSlug))
        .unique();
      if (sheet) {
        const progress = progressRows.find((p: any) => p.sheetSlug === f.sheetSlug);
        sheets.push({
          slug: sheet.slug,
          name: sheet.name,
          category: sheet.category,
          totalSolved: progress?.totalSolved ?? 0,
          totalAttempted: progress?.totalAttempted ?? 0,
          byDifficulty: progress?.byDifficulty ?? { easy: 0, medium: 0, hard: 0 },
        });
      }
    }

    return {
      profile,
      sheets,
    };
  },
});

