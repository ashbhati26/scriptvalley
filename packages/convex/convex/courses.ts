// Everything related to courses — CRUD, review workflow, lesson progress, and saved courses.
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireInstructor, makeSlug } from "./_helper";

// Validators mirroring schema.ts — defined here so mutations can accept nested objects.
const mcqOptionV = v.object({ text: v.string(), isCorrect: v.boolean() });

const mcqQuestionV = v.object({
  question:    v.string(),
  options:     v.array(mcqOptionV),
  explanation: v.optional(v.string()),
});

const codingChallengeV = v.object({
  title:       v.string(),
  description: v.string(),
  difficulty:  v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  platform:    v.optional(v.string()),
  link:        v.optional(v.string()),
  hint:        v.optional(v.string()),
});

const lessonV = v.object({
  order:         v.number(),
  lessonNumber:  v.optional(v.string()),
  title:         v.string(),
  topicsCovered: v.optional(v.string()),
  content:       v.optional(v.string()),
});

const moduleV = v.object({
  order:            v.number(),
  title:            v.string(),
  slug:             v.string(),
  description:      v.optional(v.string()),
  content:          v.optional(v.string()),
  lessons:          v.optional(v.array(lessonV)),
  mcqQuestions:     v.optional(v.array(mcqQuestionV)),
  codingChallenges: v.optional(v.array(codingChallengeV)),
  miniProject:      v.optional(codingChallengeV),
});

const levelV = v.optional(v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("all-levels"),
));

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

// ─── Returns ALL courses visible to instructors (not just the caller's own).
// The UI shows a "created by" label so instructors know who owns each course.
export const getMyCourses = query({
  handler: async (ctx) => {
    await requireInstructor(ctx.db, ctx.auth);
    return await ctx.db.query("courses").collect();
  },
});

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

export const createCourse = mutation({
  args: {
    title:       v.string(),
    slug:        v.optional(v.string()),
    description: v.optional(v.string()),
    template:    v.optional(v.union(v.literal("freeform"), v.literal("structured"))),
    level:       levelV,
    modules:     v.array(moduleV),
  },
  handler: async (ctx, args) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const computedSlug = makeSlug(args.slug ?? args.title);
    const exists = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", computedSlug))
      .unique();
    if (exists) throw new Error("A course with this slug already exists");

    await ctx.db.insert("courses", {
      title:         args.title.trim(),
      slug:          computedSlug,
      description:   args.description?.trim(),
      template:      args.template ?? "freeform",
      level:         args.level,
      schemaVersion: 1,
      modules:       [...args.modules].sort((a, b) => a.order - b.order),
      createdBy:     userId,
      status:        "draft",
      createdAt:     Date.now(),
    });

    return { ok: true };
  },
});

// ─── Any instructor can edit any course.
// Published courses remain live while being edited (status not reset).
// Only pending_review courses get pulled back to draft on edit.
export const updateCourse = mutation({
  args: {
    id:          v.id("courses"),
    title:       v.optional(v.string()),
    description: v.optional(v.string()),
    template:    v.optional(v.union(v.literal("freeform"), v.literal("structured"))),
    level:       levelV,
    modules:     v.optional(v.array(moduleV)),
  },
  handler: async (ctx, args) => {
    await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(args.id);
    if (!course) throw new Error("Course not found");

    const patch: Record<string, any> = { updatedAt: Date.now() };
    if (args.title       !== undefined) patch.title       = args.title.trim();
    if (args.description !== undefined) patch.description = args.description?.trim();
    if (args.template    !== undefined) patch.template    = args.template;
    if (args.level       !== undefined) patch.level       = args.level;
    if (args.modules     !== undefined) patch.modules     = [...args.modules].sort((a, b) => a.order - b.order);

    // Only pull back from pending_review — published courses stay live while being edited.
    if (course.status === "pending_review") patch.status = "draft";

    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const submitCourseForReview = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireInstructor(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (!["draft", "rejected", "published"].includes(course.status))
      throw new Error("Only draft, rejected, or published courses can be submitted");
    if (course.modules.length === 0)
      throw new Error("Add at least one module before submitting");

    if (course.template === "structured") {
      for (const mod of course.modules) {
        if (!mod.lessons || mod.lessons.length === 0)
          throw new Error(`Module "${mod.title}" has no lessons`);
      }
    }

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
    await requireInstructor(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (course.status !== "pending_review") throw new Error("Course is not under review");
    await ctx.db.patch(id, { status: "draft", updatedAt: Date.now() });
    return { ok: true };
  },
});

// ─── Delete is blocked for published courses — only drafts/rejected can be deleted
// by any instructor. Admins use adminDeleteCourse if they need to force-delete.
export const deleteMyCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireInstructor(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    if (course.status === "published")
      throw new Error("Published courses cannot be deleted. Ask an admin to unpublish it first.");
    await ctx.db.delete(id);
    return { ok: true };
  },
});

export const publishCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course) throw new Error("Course not found");
    await ctx.db.patch(id, { status: "published", rejectionReason: undefined, updatedAt: Date.now() });
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

// Returns all completed lesson slugs for the current user in a given course.
export const getLessonProgress = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, { courseSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return await ctx.db
      .query("lesson_progress")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseSlug", courseSlug)
      )
      .collect();
  },
});

// Idempotent — safe to call multiple times for the same lesson.
export const markLessonComplete = mutation({
  args: { courseSlug: v.string(), moduleSlug: v.string(), lessonSlug: v.string() },
  handler: async (ctx, { courseSlug, moduleSlug, lessonSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("lesson_progress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId)
         .eq("courseSlug", courseSlug)
         .eq("moduleSlug", moduleSlug)
         .eq("lessonSlug", lessonSlug)
      )
      .unique();

    if (existing) return { ok: true, alreadyDone: true };

    await ctx.db.insert("lesson_progress", {
      userId,
      courseSlug,
      moduleSlug,
      lessonSlug,
      completedAt: Date.now(),
    });
    return { ok: true, alreadyDone: false };
  },
});

export const getSavedCourses = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return await ctx.db
      .query("saved_courses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const saveOrUnsaveCourse = mutation({
  args: { courseSlug: v.string(), save: v.boolean() },
  handler: async (ctx, { courseSlug, save }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("saved_courses")
      .withIndex("by_user_slug", (q) =>
        q.eq("userId", userId).eq("courseSlug", courseSlug)
      )
      .unique();

    if (save && !existing)  await ctx.db.insert("saved_courses", { userId, courseSlug, savedAt: Date.now() });
    if (!save && existing)  await ctx.db.delete(existing._id);
    return { ok: true };
  },
});

// Returns a map of courseSlug → completedLessonCount — used on the course listing page.
export const getAllLessonProgressCounts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {};
    const userId = identity.subject;
    const rows = await ctx.db
      .query("lesson_progress")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.courseSlug] = (counts[row.courseSlug] ?? 0) + 1;
    }
    return counts;
  },
});

// Wipes all lesson progress for a course — used by the full course reset button.
export const resetCourseProgress = mutation({
  args: { courseSlug: v.string() },
  handler: async (ctx, { courseSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");
    const userId = identity.subject;

    const rows = await ctx.db
      .query("lesson_progress")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseSlug", courseSlug)
      )
      .collect();

    await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
    return { ok: true, deleted: rows.length };
  },
});

// Wipes progress for a single module — used by the per-module reset button in the sidebar.
export const resetModuleProgress = mutation({
  args: { courseSlug: v.string(), moduleSlug: v.string() },
  handler: async (ctx, { courseSlug, moduleSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");
    const userId = identity.subject;

    const rows = await ctx.db
      .query("lesson_progress")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseSlug", courseSlug)
      )
      .collect();

    const toDelete = rows.filter((r) => r.moduleSlug === moduleSlug);
    await Promise.all(toDelete.map((r) => ctx.db.delete(r._id)));
    return { ok: true, deleted: toDelete.length };
  },
});

// Step 1 — frontend asks for a short-lived upload URL.
export const generateImageUploadUrl = mutation({
  handler: async (ctx) => {
    await requireInstructor(ctx.db, ctx.auth);
    return await ctx.storage.generateUploadUrl();
  },
});

// Step 2 — after the PUT succeeds, exchange the storageId for a permanent URL.
export const saveUploadedImage = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    await requireInstructor(ctx.db, ctx.auth);
    const url = await ctx.storage.getUrl(storageId as any);
    return url;
  },
});