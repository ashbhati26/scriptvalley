// convex/courses.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireInstructor, makeSlug } from "./_helper";

// ─── Module validator ─────────────────────────────────────────────────────────
// Each module has a title, a slug, and rich HTML content (TipTap).
// No quizzes, no articles, no external linking.

const moduleValidator = v.object({
  order:   v.number(),
  title:   v.string(),
  slug:    v.string(),
  content: v.string(), // TipTap HTML from ModuleEditor
});

// ─── Public queries ───────────────────────────────────────────────────────────

export const getAllCourses = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const getCourseBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!course || course.status !== "published") return null;
    return course;
  },
});

// ─── Instructor queries ───────────────────────────────────────────────────────

export const getMyCourses = query({
  handler: async (ctx) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);
    return await ctx.db
      .query("courses")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

// ─── Admin queries ────────────────────────────────────────────────────────────

export const getPendingCourses = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    return await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .collect();
  },
});

export const adminGetAllCourses = query({
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.auth);
    return await ctx.db.query("courses").collect();
  },
});

// ─── Instructor mutations ─────────────────────────────────────────────────────

export const createCourse = mutation({
  args: {
    title:       v.string(),
    slug:        v.optional(v.string()),
    description: v.optional(v.string()),
    modules:     v.array(moduleValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const computedSlug = makeSlug(args.slug ?? args.title);
    const exists = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", computedSlug))
      .unique();
    if (exists) throw new Error("A course with this slug already exists");

    const sorted = [...args.modules].sort((a, b) => a.order - b.order);

    await ctx.db.insert("courses", {
      title:       args.title.trim(),
      slug:        computedSlug,
      description: args.description?.trim(),
      modules:     sorted,
      createdBy:   userId,
      status:      "draft",
      createdAt:   Date.now(),
    });

    return { ok: true };
  },
});

export const updateCourse = mutation({
  args: {
    id:          v.id("courses"),
    title:       v.optional(v.string()),
    description: v.optional(v.string()),
    modules:     v.optional(v.array(moduleValidator)),
  },
  handler: async (ctx, args) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(args.id);
    if (!course) throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden: not your course");

    const patch: Record<string, any> = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title.trim();
    if (typeof args.description !== "undefined") patch.description = args.description?.trim();
    if (typeof args.modules     !== "undefined") {
      patch.modules = [...args.modules].sort((a, b) => a.order - b.order);
    }

    // If published, reset to draft so admin re-reviews the updated content
    if (course.status === "published") {
      patch.status = "draft";
      patch.rejectionReason = undefined;
    }
    // If pending review, withdraw first before allowing edit
    if (course.status === "pending_review") {
      patch.status = "draft";
    }

    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const submitCourseForReview = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");
    if (course.status !== "draft" && course.status !== "rejected")
      throw new Error("Only draft or rejected courses can be submitted");
    if (course.modules.length === 0)
      throw new Error("Course must have at least one module before submitting");

    await ctx.db.patch(id, {
      status:          "pending_review",
      rejectionReason: undefined,
      updatedAt:       Date.now(),
    });
    return { ok: true };
  },
});

export const withdrawCourseFromReview = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");
    if (course.status !== "pending_review")
      throw new Error("Course is not under review");

    await ctx.db.patch(id, { status: "draft", updatedAt: Date.now() });
    return { ok: true };
  },
});

export const deleteMyCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");

    await ctx.db.delete(id);
    return { ok: true };
  },
});

// ─── Admin mutations ──────────────────────────────────────────────────────────

export const publishCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    await ctx.db.patch(id, {
      status:          "published",
      rejectionReason: undefined,
      updatedAt:       Date.now(),
    });
    return { ok: true };
  },
});

export const rejectCourse = mutation({
  args: { id: v.id("courses"), reason: v.optional(v.string()) },
  handler: async (ctx, { id, reason }) => {
    await requireAdmin(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    await ctx.db.patch(id, {
      status:          "rejected",
      rejectionReason: reason ?? "No reason provided",
      updatedAt:       Date.now(),
    });
    return { ok: true };
  },
});

export const adminDeleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx.db, ctx.auth);
    await ctx.db.delete(id);
    return { ok: true };
  },
});