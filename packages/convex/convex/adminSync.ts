import { mutation } from "./_generated/server";

export const syncAdminsFromUsers = mutation({
  handler: async ({ db }) => {
    const adminUsers = await db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    const existingAdmins = await db.query("admins").collect();
    const existingAdminMap = new Map(existingAdmins.map(a => [a.userId, a]));

    for (const u of adminUsers) {
      const a = existingAdminMap.get(u.userId);
      if (!a) {
        await db.insert("admins", {
          userId: u.userId,
          email: u.email ?? "",
          name: u.name ?? "",
          createdAt: Date.now(),
        });
      } else {
        const patch: Record<string, any> = {};
        if ((u.email ?? "") !== (a.email ?? "")) patch.email = u.email ?? "";
        if ((u.name ?? "") !== (a.name ?? "")) patch.name = u.name ?? "";
        if (Object.keys(patch).length) {
          await db.patch(a._id, patch);
        }
      }
    }

    const adminUserIds = new Set(adminUsers.map(u => u.userId));
    for (const a of existingAdmins) {
      if (!adminUserIds.has(a.userId)) {
        await db.delete(a._id);
      }
    }

    return { ok: true, syncedCount: adminUsers.length };
  },
});
