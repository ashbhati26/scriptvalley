import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ─── Users & Auth ────────────────────────────────────────────────────────────

  users: defineTable({
    userId:      v.string(),
    email:       v.string(),
    name:        v.string(),
    role:        v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    collegeName: v.optional(v.string()),
    state:       v.optional(v.string()),
    country:     v.optional(v.string()),
    createdAt:   v.optional(v.string()),
    updatedAt:   v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_role",    ["role"]),

  admins: defineTable({
    userId:    v.string(),
    email:     v.string(),
    name:      v.string(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  socials: defineTable({
    userId:    v.string(),
    linkedin:  v.optional(v.string()),
    twitter:   v.optional(v.string()),
    portfolio: v.optional(v.string()),
    resume:    v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  platforms: defineTable({
    userId:      v.string(),
    leetcodeUrl: v.optional(v.string()),
    githubUrl:   v.optional(v.string()),
    updatedAt:   v.optional(v.string()),
    createdAt:   v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  // ─── Code playground ─────────────────────────────────────────────────────────

  codeExecutions: defineTable({
    userId:   v.string(),
    language: v.string(),
    code:     v.string(),
    output:   v.optional(v.string()),
    error:    v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId:    v.string(),
    title:     v.string(),
    language:  v.string(),
    code:      v.string(),
    userName:  v.string(),
    isPrivate: v.boolean(),
  })
    .index("by_user_id",              ["userId"])
    .index("by_user_id_and_privacy",  ["userId", "isPrivate"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId:    v.string(),
    userId_:   v.optional(v.string()),
    userName:  v.string(),
    content:   v.string(),
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId:    v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id",               ["userId"])
    .index("by_snippet_id",            ["snippetId"])
    .index("by_user_id_and_snippet_id",["userId", "snippetId"]),

  // ─── DSA Sheets ──────────────────────────────────────────────────────────────

  dsaSheets: defineTable({
    slug:             v.string(),
    name:             v.string(),
    category:         v.optional(v.string()),
    description:      v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    note:             v.optional(v.any()),
    content:          v.optional(v.any()),
    createdBy:        v.optional(v.string()),
    createdAt:        v.number(),
    updatedAt:        v.optional(v.number()),
    order:            v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("published"),
      v.literal("rejected"),
    )),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_slug",      ["slug"])
    .index("by_status",    ["status"])
    .index("by_createdBy", ["createdBy"]),

  // Progress tracking
  attempts: defineTable({
    userId:        v.string(),
    questionTitle: v.string(),
    sheetSlug:     v.string(),
    difficulty:    v.string(),
    attempted:     v.boolean(),
  }).index("by_user_question", ["userId", "questionTitle"]),

  question_attempts: defineTable({
    userId:        v.string(),
    sheetSlug:     v.string(),
    questionTitle: v.string(),
    difficulty:    v.optional(v.string()),
    status:        v.optional(v.string()),
    timestamp:     v.number(),
  })
    .index("by_user",          ["userId"])
    .index("by_user_sheet",    ["userId", "sheetSlug"])
    .index("by_user_question", ["userId", "questionTitle"]),

  sheet_progress: defineTable({
    userId:         v.string(),
    sheetSlug:      v.string(),
    totalAttempted: v.number(),
    totalSolved:    v.number(),
    byDifficulty:   v.optional(v.any()),
    updatedAt:      v.number(),
  })
    .index("by_user_sheet", ["userId", "sheetSlug"])
    .index("by_sheet",      ["sheetSlug"]),

  user_sheet_follow: defineTable({
    userId:     v.string(),
    sheetSlug:  v.string(),
    followedAt: v.number(),
  })
    .index("by_user",       ["userId"])
    .index("by_sheet",      ["sheetSlug"])
    .index("by_user_sheet", ["userId", "sheetSlug"]),

  user_sheet_save: defineTable({
    userId:    v.string(),
    sheetSlug: v.string(),
    savedAt:   v.number(),
  })
    .index("by_user",       ["userId"])
    .index("by_sheet",      ["sheetSlug"])
    .index("by_user_sheet", ["userId", "sheetSlug"]),

  starred_questions: defineTable({
    userId:        v.string(),
    sheetSlug:     v.string(),
    topic:         v.string(),
    questionTitle: v.string(),
    createdAt:     v.number(),
  })
    .index("by_user",          ["userId"])
    .index("by_user_question", ["userId", "questionTitle"])
    .index("by_user_sheet",    ["userId", "sheetSlug"]),

  questionNotes: defineTable({
    userId:        v.string(),
    questionTitle: v.string(),
    notes:         v.string(),
    createdAt:     v.number(),
    updatedAt:     v.number(),
  })
    .index("by_user",          ["userId"])
    .index("by_user_question", ["userId", "questionTitle"]),

  // ─── POTD ────────────────────────────────────────────────────────────────────

  potdLogs: defineTable({
    userId:        v.string(),
    date:          v.string(),
    questionTitle: v.string(),
    sheetSlug:     v.string(),
    solved:        v.boolean(),
    emoji:         v.string(),
    count:         v.optional(v.number()),
  })
    .index("by_user",      ["userId"])
    .index("by_user_date", ["userId", "date"]),

  // ─── Experiences ─────────────────────────────────────────────────────────────

  experiences: defineTable({
    userId:        v.string(),
    slug:          v.string(),
    name:          v.string(),
    email:         v.optional(v.string()),
    linkedinUrl:   v.string(),
    company:       v.string(),
    role:          v.string(),
    location:      v.optional(v.string()),
    package:       v.optional(v.string()),
    outcome:       v.string(),
    interviewDate: v.string(),
    rounds: v.array(v.object({
      type:        v.string(),
      description: v.string(),
      duration:    v.optional(v.string()),
      difficulty:  v.optional(v.string()),
    })),
    overview:    v.string(),
    tips:        v.optional(v.string()),
    status:      v.string(),
    createdAt:   v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_slug",               ["slug"])
    .index("by_status_and_createdAt",["status", "createdAt"])
    .index("by_userId",             ["userId"]),

  // ─── Instructors ─────────────────────────────────────────────────────────────

  instructors: defineTable({
    userId:     v.string(),
    email:      v.string(),
    name:       v.string(),
    bio:        v.optional(v.string()),
    isApproved: v.boolean(),
    appliedAt:  v.number(),
    approvedAt: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),

  // ─── Courses ─────────────────────────────────────────────────────────────────
  // Each course has modules. Each module has a title, slug, and rich HTML content
  // written in the TipTap editor (ModuleEditor). No quizzes, no articles, no linking.

  courses: defineTable({
    title:       v.string(),
    slug:        v.string(),
    description: v.optional(v.string()),
    modules: v.array(v.object({
      order:   v.number(),
      title:   v.string(),
      slug:    v.string(),
      content: v.string(), // TipTap HTML written in ModuleEditor
    })),
    createdBy:       v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("published"),
      v.literal("rejected"),
    ),
    rejectionReason: v.optional(v.string()),
    createdAt:       v.number(),
    updatedAt:       v.optional(v.number()),
  })
    .index("by_slug",      ["slug"])
    .index("by_status",    ["status"])
    .index("by_createdBy", ["createdBy"]),

});