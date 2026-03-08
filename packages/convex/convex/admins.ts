// convex/admins.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_helper";
import type { Id } from "./_generated/dataModel";

// ─── Check if current user is admin (used by AdminGuard) ─────────────────────

export const isAdmin = query({
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) return false;
    const row = await db
      .query("admins")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    return !!row;
  },
});

// ─── Get all admins ───────────────────────────────────────────────────────────

export const getAllAdmins = query({
  handler: async ({ db, auth }) => {
    await requireAdmin(db, auth);
    const rows = await db.query("admins").collect();
    return rows.map((r: any) => ({
      _id:     r._id,
      userId:  r.userId,
      email:   r.email,
      name:    r.name,
      addedAt: r.createdAt,   // alias so frontend uses consistent field name
    }));
  },
});

// ─── Add admin by email ───────────────────────────────────────────────────────

export const addAdminByEmail = mutation({
  args: { email: v.string() },
  handler: async ({ db, auth }, { email }) => {
    await requireAdmin(db, auth);

    const normalizedEmail = email.trim().toLowerCase();

    // User must already have a ScriptValley account
    const allUsers = await db.query("users").collect();
    const user = (allUsers as any[]).find(
      (u) => (u.email ?? "").toLowerCase() === normalizedEmail
    );
    if (!user) {
      throw new Error(
        `No ScriptValley account found for "${email}". The user must sign up first.`
      );
    }

    // Guard: already an admin
    const existing = await db
      .query("admins")
      .withIndex("by_user_id", (q) => q.eq("userId", user.userId))
      .unique();
    if (existing) throw new Error(`${email} is already an admin`);

    await db.insert("admins", {
      userId:    user.userId,
      email:     user.email,
      name:      user.name ?? "",
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});

// ─── Remove admin ─────────────────────────────────────────────────────────────

export const removeAdmin = mutation({
  args: { adminId: v.id("admins") },
  handler: async ({ db, auth }, { adminId }: { adminId: Id<"admins"> }) => {
    const callerId = await requireAdmin(db, auth);

    const row = await db.get(adminId);
    if (!row) throw new Error("Admin record not found");

    // Safety: cannot remove yourself
    if ((row as any).userId === callerId) {
      throw new Error("You cannot remove your own admin access");
    }

    await db.delete(adminId);
    return { ok: true };
  },
});