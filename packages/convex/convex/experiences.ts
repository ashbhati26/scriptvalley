import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Helper ───────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Submit (user) ────────────────────────────────────────────────────────────

export const submitExperience = mutation({
  args: {
    name: v.string(),
    linkedinUrl: v.string(),
    company: v.string(),
    role: v.string(),
    location: v.optional(v.string()),
    package: v.optional(v.string()),
    outcome: v.string(),
    interviewDate: v.string(),
    rounds: v.array(
      v.object({
        type: v.string(),
        description: v.string(),
        duration: v.optional(v.string()),
        difficulty: v.optional(v.string()),
      })
    ),
    overview: v.string(),
    tips: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const email  = identity.email ?? "";

    const baseSlug = slugify(
      `${args.company}-${args.role}-${args.name}-${args.interviewDate}`
    );

    let slug = baseSlug;
    let counter = 1;

    while (
      await ctx.db
        .query("experiences")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    await ctx.db.insert("experiences", {
      userId,
      slug,
      name:          args.name,
      email,
      linkedinUrl:   args.linkedinUrl,
      company:       args.company,
      role:          args.role,
      location:      args.location,
      package:       args.package,
      outcome:       args.outcome,
      interviewDate: args.interviewDate,
      rounds:        args.rounds,
      overview:      args.overview,
      tips:          args.tips,
      status:        "pending",
      createdAt:     Date.now(),
    });

    return { success: true };
  },
});

// ─── Update (user — author only, resets to pending for re-review) ─────────────

export const updateExperience = mutation({
  args: {
    id: v.id("experiences"),
    name: v.string(),
    linkedinUrl: v.string(),
    company: v.string(),
    role: v.string(),
    location: v.optional(v.string()),
    package: v.optional(v.string()),
    outcome: v.string(),
    interviewDate: v.string(),
    rounds: v.array(
      v.object({
        type: v.string(),
        description: v.string(),
        duration: v.optional(v.string()),
        difficulty: v.optional(v.string()),
      })
    ),
    overview: v.string(),
    tips: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const exp = await ctx.db.get(id);
    if (!exp) throw new Error("Not found");
    if (exp.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.patch(id, {
      ...fields,
      // Reset to pending so admin re-reviews the edits
      status:      "pending",
      publishedAt: undefined,
    });

    return { success: true };
  },
});

// ─── Delete (user — author only) ──────────────────────────────────────────────

export const deleteExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const exp = await ctx.db.get(id);
    if (!exp) throw new Error("Not found");
    if (exp.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.delete(id);
    return { success: true };
  },
});

// ─── Get published (public listing page) ─────────────────────────────────────

export const getPublishedExperiences = query({
  handler: async (ctx) => {
    const exps = await ctx.db
      .query("experiences")
      .withIndex("by_status_and_createdAt", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    return exps.map(({ email, ...rest }) => rest);
  },
});

// ─── Get user's own experiences (any status) ─────────────────────────────────

export const getUserExperiences = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("experiences")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

// ─── Get single by slug (public detail page) ─────────────────────────────────

export const getExperienceBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const exp = await ctx.db
      .query("experiences")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!exp || exp.status !== "published") return null;

    const { email, ...rest } = exp;
    return rest;
  },
});

// ─── Get single by slug for author (any status, for edit page) ───────────────

export const getExperienceBySlugForAuthor = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const exp = await ctx.db
      .query("experiences")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!exp) return null;
    if (exp.userId !== identity.subject) return null;

    return exp;
  },
});

// ─── Get all (admin panel) ────────────────────────────────────────────────────

export const getAllExperiencesAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("experiences")
      .order("desc")
      .collect();
  },
});

// ─── Publish (admin) ──────────────────────────────────────────────────────────

export const publishExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(id, {
      status:      "published",
      publishedAt: Date.now(),
    });
  },
});

// ─── Reject (admin) ───────────────────────────────────────────────────────────

export const rejectExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(id, { status: "rejected" });
  },
});

// ─── Delete (admin — any experience, any status) ──────────────────────────────

export const adminDeleteExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Optional: add an isAdmin check here if you have a users table
    // const user = await ctx.db.query("users")
    //   .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
    //   .unique();
    // if (!user?.isAdmin) throw new Error("Forbidden");

    const exp = await ctx.db.get(id);
    if (!exp) throw new Error("Not found");

    await ctx.db.delete(id);
    return { success: true };
  },
});