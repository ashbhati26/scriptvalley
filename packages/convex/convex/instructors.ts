// Instructor applications, approvals, and admin management.
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_helper";

// Any logged-in student can apply to become an instructor.
export const applyForInstructor = mutation({
  args: { bio: v.optional(v.string()) },
  handler: async (ctx, { bio }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const existing = await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    if (existing) throw new Error("You have already applied");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    await ctx.db.insert("instructors", {
      userId,
      email:      user?.email      ?? identity.email ?? "",
      name:       user?.name       ?? identity.name  ?? "",
      bio:        bio?.trim()      || undefined,
      isApproved: false,
      appliedAt:  Date.now(),
    });

    return { ok: true };
  },
});

// Used by the instructor app layout to decide whether to let the user in.
export const getMyProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const updateMyBio = mutation({
  args: { bio: v.string() },
  handler: async (ctx, { bio }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const row = await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    if (!row) throw new Error("Not an instructor");

    await ctx.db.patch(row._id, { bio: bio.trim() });
    return { ok: true };
  },
});

export const getAllInstructors = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    return await ctx.db.query("instructors").collect();
  },
});

export const getPendingInstructors = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    const all = await ctx.db.query("instructors").collect();
    return all.filter((i) => !i.isApproved);
  },
});

// Admin can add an instructor directly by email, bypassing the application flow.
export const addInstructorByEmail = mutation({
  args: { email: v.string(), bio: v.optional(v.string()) },
  handler: async (ctx, { email, bio }) => {
    await requireAdmin(ctx.db, ctx.auth);

    const normalizedEmail = email.trim().toLowerCase();

    const allUsers = await ctx.db.query("users").collect();
    const user = (allUsers as any[]).find(
      (u) => (u.email ?? "").toLowerCase() === normalizedEmail
    );
    if (!user)
      throw new Error(`No account found for "${email}". The user must sign up first.`);

    const existing = await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", user.userId))
      .unique();

    if (existing) {
      if (existing.isApproved) throw new Error(`${email} is already an approved instructor`);
      await ctx.db.patch(existing._id, {
        isApproved: true,
        approvedAt: Date.now(),
        bio:        bio?.trim() || existing.bio,
      });
      return { ok: true, action: "approved_existing" };
    }

    const now = Date.now();
    await ctx.db.insert("instructors", {
      userId:     user.userId,
      email:      user.email,
      name:       user.name ?? "",
      bio:        bio?.trim() || undefined,
      isApproved: true,
      appliedAt:  now,
      approvedAt: now,
    });

    return { ok: true, action: "created" };
  },
});

export const approveInstructor = mutation({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, { instructorId }) => {
    await requireAdmin(ctx.db, ctx.auth);
    const row = await ctx.db.get(instructorId);
    if (!row) throw new Error("Instructor not found");
    await ctx.db.patch(instructorId, { isApproved: true, approvedAt: Date.now() });
    return { ok: true };
  },
});

export const revokeInstructor = mutation({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, { instructorId }) => {
    await requireAdmin(ctx.db, ctx.auth);
    const row = await ctx.db.get(instructorId);
    if (!row) throw new Error("Instructor not found");
    await ctx.db.patch(instructorId, { isApproved: false });
    return { ok: true };
  },
});

export const deleteInstructor = mutation({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, { instructorId }) => {
    await requireAdmin(ctx.db, ctx.auth);
    await ctx.db.delete(instructorId);
    return { ok: true };
  },
});