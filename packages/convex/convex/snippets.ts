// Code snippets — create, delete, star, comment, and query.
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSnippet = mutation({
  args: {
    title:     v.string(),
    language:  v.string(),
    code:      v.string(),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("snippets", {
      userId:    identity.subject,
      userName:  user.name,
      title:     args.title,
      language:  args.language,
      code:      args.code,
      isPrivate: args.isPrivate,
    });
  },
});

// Deletes the snippet along with its comments and stars.
export const deleteSnippet = mutation({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const snippet = await ctx.db.get(snippetId);
    if (!snippet) throw new Error("Snippet not found");
    if (snippet.userId !== identity.subject) throw new Error("Not authorized");

    const comments = await ctx.db
      .query("snippetComments")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), snippetId))
      .collect();
    for (const c of comments) await ctx.db.delete(c._id);

    const stars = await ctx.db
      .query("stars")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), snippetId))
      .collect();
    for (const s of stars) await ctx.db.delete(s._id);

    await ctx.db.delete(snippetId);
  },
});

export const starSnippet = mutation({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("stars")
      .withIndex("by_user_id_and_snippet_id")
      .filter((q) =>
        q.eq(q.field("userId"), identity.subject) && q.eq(q.field("snippetId"), snippetId)
      )
      .first();

    if (existing) { await ctx.db.delete(existing._id); }
    else           { await ctx.db.insert("stars", { userId: identity.subject, snippetId }); }
  },
});

export const addComment = mutation({
  args: { snippetId: v.id("snippets"), content: v.string() },
  handler: async (ctx, { snippetId, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("snippetComments", {
      snippetId,
      userId:   identity.subject,
      userName: user.name,
      content,
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("snippetComments") },
  handler: async (ctx, { commentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const comment = await ctx.db.get(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== identity.subject) throw new Error("Not authorized");

    await ctx.db.delete(commentId);
  },
});

// Public listing — only shows non-private snippets.
export const getSnippets = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("snippets")
      .filter((q) => q.eq(q.field("isPrivate"), false))
      .order("desc")
      .collect();
  },
});

// Returns all snippets for the logged-in user, including private ones.
export const getUserSnippets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("snippets")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});

export const getSnippetById = query({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    const snippet = await ctx.db.get(snippetId);
    if (!snippet) throw new Error("Snippet not found");

    if (snippet.isPrivate) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || snippet.userId !== identity.subject) throw new Error("Access denied");
    }

    return snippet;
  },
});

export const getComments = query({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    return await ctx.db
      .query("snippetComments")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), snippetId))
      .order("desc")
      .collect();
  },
});

export const isSnippetStarred = query({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const star = await ctx.db
      .query("stars")
      .withIndex("by_user_id_and_snippet_id")
      .filter((q) =>
        q.eq(q.field("userId"), identity.subject) && q.eq(q.field("snippetId"), snippetId)
      )
      .first();

    return !!star;
  },
});

export const getSnippetStarCount = query({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, { snippetId }) => {
    const stars = await ctx.db
      .query("stars")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), snippetId))
      .collect();
    return stars.length;
  },
});

export const getStarredSnippets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const stars = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const snippets = await Promise.all(stars.map((s) => ctx.db.get(s.snippetId)));
    return snippets.filter(Boolean);
  },
});

export const getPrivateSnippets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("snippets")
      .withIndex("by_user_id_and_privacy", (q) =>
        q.eq("userId", identity.subject).eq("isPrivate", true)
      )
      .order("desc")
      .collect();
  },
});

export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const executions = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const starredSnippets = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const snippetDetails = await Promise.all(
      starredSnippets.map((s) => ctx.db.get(s.snippetId))
    );

    const starredLanguages = snippetDetails.filter(Boolean).reduce(
      (acc, curr) => {
        if (curr?.language) acc[curr.language] = (acc[curr.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const languageStats = executions.reduce(
      (acc, curr) => { acc[curr.language] = (acc[curr.language] || 0) + 1; return acc; },
      {} as Record<string, number>
    );

    const languages = Object.keys(languageStats);
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
      : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount:  languages.length,
      languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});