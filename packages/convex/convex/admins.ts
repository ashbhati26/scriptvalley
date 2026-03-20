// Admin management — checking admin status, listing, adding and removing admins.
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_helper";
import type { Id } from "./_generated/dataModel";

// Used by AdminGuard on the admin app to decide whether to render or redirect.
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

export const getAllAdmins = query({
  handler: async ({ db, auth }) => {
    await requireAdmin(db, auth);
    const rows = await db.query("admins").collect();
    return rows.map((r: any) => ({
      _id:     r._id,
      userId:  r.userId,
      email:   r.email,
      name:    r.name,
      addedAt: r.createdAt,
    }));
  },
});

// Adds an admin by email. The user must already have a ScriptValley account.
export const addAdminByEmail = mutation({
  args: { email: v.string() },
  handler: async ({ db, auth }, { email }) => {
    await requireAdmin(db, auth);

    const normalizedEmail = email.trim().toLowerCase();

    const allUsers = await db.query("users").collect();
    const user = (allUsers as any[]).find(
      (u) => (u.email ?? "").toLowerCase() === normalizedEmail
    );
    if (!user)
      throw new Error(`No account found for "${email}". The user must sign up first.`);

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

// Admins cannot remove themselves — that guard is enforced here.
export const removeAdmin = mutation({
  args: { adminId: v.id("admins") },
  handler: async ({ db, auth }, { adminId }: { adminId: Id<"admins"> }) => {
    const callerId = await requireAdmin(db, auth);

    const row = await db.get(adminId);
    if (!row) throw new Error("Admin record not found");

    if ((row as any).userId === callerId)
      throw new Error("You cannot remove your own admin access");

    await db.delete(adminId);
    return { ok: true };
  },
});