import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ⭐ Toggle star / unstar
export const toggleStar = mutation({
  args: {
    userId: v.string(),
    sheetSlug: v.string(),
    topic: v.string(),
    questionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("starred_questions")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", args.userId).eq("questionTitle", args.questionTitle)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { starred: false };
    }

    await ctx.db.insert("starred_questions", {
      userId: args.userId,
      sheetSlug: args.sheetSlug,
      topic: args.topic,
      questionTitle: args.questionTitle,
      createdAt: Date.now(),
    });

    return { starred: true };
  },
});

// ⭐ Get all starred questions of user
export const getStarredByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("starred_questions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// ⭐ Check if a question is starred
export const isStarred = query({
  args: {
    userId: v.string(),
    questionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("starred_questions")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", args.userId).eq("questionTitle", args.questionTitle)
      )
      .first();

    return !!existing;
  },
});