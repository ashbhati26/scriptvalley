// convex/instructors.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_helper";

// ─── Apply (any logged-in user) ───────────────────────────────────────────────

export const applyForInstructor = mutation({
  args: {
    bio: v.optional(v.string()),
  },
  handler: async (ctx, { bio }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const existing = await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existing) throw new Error("You have already applied");

    // Pull name + email from users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    await ctx.db.insert("instructors", {
      userId,
      email: user?.email ?? identity.email ?? "",
      name: user?.name ?? identity.name ?? "",
      bio: bio?.trim() || undefined,
      isApproved: false,
      appliedAt: Date.now(),
    });

    return { ok: true };
  },
});

// ─── Get my profile (used by instructor app layout guard) ─────────────────────

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

// ─── Update my bio ────────────────────────────────────────────────────────────

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

// ─── Admin: get all instructors ───────────────────────────────────────────────

export const getAllInstructors = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    return await ctx.db.query("instructors").collect();
  },
});

// ─── Admin: get pending applications ─────────────────────────────────────────

export const getPendingInstructors = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    const all = await ctx.db.query("instructors").collect();
    return all.filter((i) => !i.isApproved);
  },
});

// ─── Admin: add instructor directly by email (bypasses application flow) ──────

export const addInstructorByEmail = mutation({
  args: {
    email: v.string(),
    bio:   v.optional(v.string()),
  },
  handler: async (ctx, { email, bio }) => {
    await requireAdmin(ctx.db, ctx.auth);

    const normalizedEmail = email.trim().toLowerCase();

    // Find user account by email
    const allUsers = await ctx.db.query("users").collect();
    const user = (allUsers as any[]).find(
      (u) => (u.email ?? "").toLowerCase() === normalizedEmail
    );
    if (!user) {
      throw new Error(
        `No ScriptValley account found for "${email}". The user must sign up first.`
      );
    }

    // Guard: already has instructor record
    const existing = await ctx.db
      .query("instructors")
      .withIndex("by_user_id", (q) => q.eq("userId", user.userId))
      .unique();

    if (existing) {
      if (existing.isApproved) {
        throw new Error(`${email} is already an approved instructor`);
      }
      // If they applied but haven't been approved yet — approve them directly
      await ctx.db.patch(existing._id, {
        isApproved: true,
        approvedAt: Date.now(),
        bio: bio?.trim() || existing.bio,
      });
      return { ok: true, action: "approved_existing" };
    }

    // Fresh insert — approved immediately since admin is adding directly
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

// ─── Admin: approve instructor ────────────────────────────────────────────────

export const approveInstructor = mutation({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, { instructorId }) => {
    await requireAdmin(ctx.db, ctx.auth);

    const row = await ctx.db.get(instructorId);
    if (!row) throw new Error("Instructor not found");

    await ctx.db.patch(instructorId, {
      isApproved: true,
      approvedAt: Date.now(),
    });

    return { ok: true };
  },
});

// ─── Admin: revoke instructor ─────────────────────────────────────────────────

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

// ─── Admin: delete instructor application ─────────────────────────────────────

export const deleteInstructor = mutation({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, { instructorId }) => {
    await requireAdmin(ctx.db, ctx.auth);
    await ctx.db.delete(instructorId);
    return { ok: true };
  },
});