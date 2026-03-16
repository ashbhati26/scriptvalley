// convex/courses.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireInstructor, makeSlug } from "./_helper";

// ─── Sub-validators (mirror schema.ts) ────────────────────────────────────────

const mcqOptionV = v.object({
  text:      v.string(),
  isCorrect: v.boolean(),
});

const mcqQuestionV = v.object({
  question:    v.string(),
  options:     v.array(mcqOptionV),
  explanation: v.optional(v.string()),
});

const codingChallengeV = v.object({
  title:       v.string(),
  description: v.string(),
  difficulty:  v.optional(v.union(
    v.literal("easy"),
    v.literal("medium"),
    v.literal("hard"),
  )),
  platform: v.optional(v.string()),
  link:     v.optional(v.string()),
  hint:     v.optional(v.string()),
});

const lessonV = v.object({
  order:         v.number(),
  lessonNumber:  v.optional(v.string()),
  title:         v.string(),
  topicsCovered: v.optional(v.string()),
  content:       v.optional(v.string()),   // TipTap HTML — full flowing article
});

const moduleV = v.object({
  order:            v.number(),
  title:            v.string(),
  slug:             v.string(),
  description:      v.optional(v.string()),
  content:          v.optional(v.string()), // freeform fallback
  lessons:          v.optional(v.array(lessonV)),
  mcqQuestions:     v.optional(v.array(mcqQuestionV)),
  codingChallenges: v.optional(v.array(codingChallengeV)),
  miniProject:      v.optional(codingChallengeV),
});

// ─── Public queries ────────────────────────────────────────────────────────────

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

// ─── Instructor queries ────────────────────────────────────────────────────────

export const getMyCourses = query({
  handler: async (ctx) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);
    return await ctx.db
      .query("courses")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

// ─── Admin queries ─────────────────────────────────────────────────────────────

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

// ─── Instructor mutations ──────────────────────────────────────────────────────

export const createCourse = mutation({
  args: {
    title:       v.string(),
    slug:        v.optional(v.string()),
    description: v.optional(v.string()),
    template:    v.optional(v.union(v.literal("freeform"), v.literal("structured"))),
    level:       v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("all-levels"),
    )),
    modules: v.array(moduleV),
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

export const updateCourse = mutation({
  args: {
    id:          v.id("courses"),
    title:       v.optional(v.string()),
    description: v.optional(v.string()),
    template:    v.optional(v.union(v.literal("freeform"), v.literal("structured"))),
    level:       v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("all-levels"),
    )),
    modules: v.optional(v.array(moduleV)),
  },
  handler: async (ctx, args) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);

    const course = await ctx.db.get(args.id);
    if (!course)                    throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden: not your course");

    const patch: Record<string, any> = { updatedAt: Date.now() };
    if (args.title       !== undefined) patch.title       = args.title.trim();
    if (args.description !== undefined) patch.description = args.description?.trim();
    if (args.template    !== undefined) patch.template    = args.template;
    if (args.level       !== undefined) patch.level       = args.level;
    if (args.modules     !== undefined) {
      patch.modules = [...args.modules].sort((a, b) => a.order - b.order);
    }

    // Published courses stay live while the instructor edits.
    // They re-submit explicitly when ready for another admin review.
    // Only pull back to draft if the course is currently in pending_review.
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
    if (!course)                    throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");
    if (course.status !== "draft" && course.status !== "rejected" && course.status !== "published")
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
    const userId = await requireInstructor(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course)                    throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");
    if (course.status !== "pending_review") throw new Error("Course is not under review");
    await ctx.db.patch(id, { status: "draft", updatedAt: Date.now() });
    return { ok: true };
  },
});

export const deleteMyCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const userId = await requireInstructor(ctx.db, ctx.auth);
    const course = await ctx.db.get(id);
    if (!course)                    throw new Error("Course not found");
    if (course.createdBy !== userId) throw new Error("Forbidden");
    await ctx.db.delete(id);
    return { ok: true };
  },
});

// ─── Admin mutations ───────────────────────────────────────────────────────────

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

// ─── Lesson Progress ───────────────────────────────────────────────────────────

// Returns all completed lesson slugs for the current user in a given course.
// Shape: [{ moduleSlug, lessonSlug, completedAt }]
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

// Mark a lesson complete. Idempotent — safe to call multiple times.
export const markLessonComplete = mutation({
  args: {
    courseSlug:  v.string(),
    moduleSlug:  v.string(),
    lessonSlug:  v.string(),
  },
  handler: async (ctx, { courseSlug, moduleSlug, lessonSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");
    const userId = identity.subject;

    // Check if already marked — avoid duplicate rows
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

// ─── Saved Courses ────────────────────────────────────────────────────────────

// Returns all saved course slugs for the current user.
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

// Toggle save / unsave a course.
export const saveOrUnsaveCourse = mutation({
  args: {
    courseSlug: v.string(),
    save:       v.boolean(),
  },
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

    if (save && !existing) {
      await ctx.db.insert("saved_courses", { userId, courseSlug, savedAt: Date.now() });
    } else if (!save && existing) {
      await ctx.db.delete(existing._id);
    }
    return { ok: true };
  },
});

// Returns a map of courseSlug → completedLessonCount for the current user.
// Used by the courses list page to show progress on each CourseCard.
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