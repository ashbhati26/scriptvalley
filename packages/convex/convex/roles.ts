// Sets a user's role and keeps the admins table in sync when role = "admin".
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setUserRole = mutation({
  args: {
    targetUserId: v.string(),
    role:         v.optional(v.string()),
  },
  handler: async ({ db, auth }, { targetUserId, role }) => {
    const now = new Date().toISOString();

    const existingUser = await db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", targetUserId))
      .unique();

    if (existingUser) {
      await db.patch(existingUser._id, { role, updatedAt: now });
    } else {
      await db.insert("users", {
        userId:    targetUserId,
        email:     "",
        name:      "",
        role,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Keep the admins table in sync so isAdmin() queries stay accurate.
    const existingAdmin = await db
      .query("admins")
      .withIndex("by_user_id", (q) => q.eq("userId", targetUserId))
      .unique();

    const email = existingUser?.email ?? "";
    const name  = existingUser?.name  ?? "";

    if (role === "admin") {
      if (!existingAdmin) {
        await db.insert("admins", { userId: targetUserId, email, name, createdAt: Date.now() });
      } else {
        const patch: Record<string, string> = {};
        if (existingAdmin.email !== email) patch.email = email;
        if (existingAdmin.name  !== name)  patch.name  = name;
        if (Object.keys(patch).length) await db.patch(existingAdmin._id, patch);
      }
    } else if (existingAdmin) {
      await db.delete(existingAdmin._id);
    }

    return { ok: true };
  },
});