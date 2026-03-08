import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone: string) {
  if (!phone) return true;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^[+0-9]{7,15}$/.test(cleaned);
}

function isReasonableName(name: string) {
  const len = name.trim().length;
  return len >= 2 && len <= 120;
}

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = sanitizeString(userId);
    if (!uid) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", uid))
      .unique();
  },
});

export const updateBasicInfo = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    collegeName: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    idToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = sanitizeString(args.userId);
    const name = sanitizeString(args.name);
    const email = sanitizeString(args.email);
    const phoneNumber = sanitizeString(args.phoneNumber ?? "");
    const collegeName = sanitizeString(args.collegeName ?? "");
    const state = sanitizeString(args.state ?? "");
    const country = sanitizeString(args.country ?? "");

    if (!userId) throw new Error("Missing userId");
    if (!isReasonableName(name)) throw new Error("Invalid name");
    if (!isValidEmail(email)) throw new Error("Invalid email");
    if (!isValidPhone(phoneNumber)) throw new Error("Invalid phone number");

    const now = new Date().toISOString();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name,
        email,
        phoneNumber: phoneNumber || undefined,
        collegeName: collegeName || undefined,
        state: state || undefined,
        country: country || undefined,
        updatedAt: now,
      });

      return await ctx.db.get(existing._id);
    }

    return await ctx.db.insert("users", {
      userId,
      name,
      email,
      phoneNumber: phoneNumber || undefined,
      collegeName: collegeName || undefined,
      state: state || undefined,
      country: country || undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});