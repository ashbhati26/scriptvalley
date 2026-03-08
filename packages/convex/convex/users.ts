import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, { userId, email, name, role }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    const now = new Date().toISOString();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId,
        email: email ?? "",
        name: name ?? "",
        role: typeof role === "undefined" ? "user" : role,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const patch: Record<string, any> = {};
      if (email && email !== existingUser.email) patch.email = email;
      if (name && name !== existingUser.name) patch.name = name;
      if (typeof role !== "undefined" && role !== existingUser.role)
        patch.role = role;

      if (Object.keys(patch).length > 0) {
        patch.updatedAt = now;
        await ctx.db.patch(existingUser._id, patch);
      }
    }

    return { ok: true };
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
  },
});

// Search users by name or email
export const searchUsers = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    const lower = q.toLowerCase();
    const users = await ctx.db.query("users").collect();

    return users
      .filter(
        (u) =>
          u.name?.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower)
      )
      .map((u) => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
      }));
  },
});