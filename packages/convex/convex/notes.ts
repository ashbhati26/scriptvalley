import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update notes for a question
export const upsertNote = mutation({
  args: {
    userId: v.string(),
    questionTitle: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, questionTitle, notes } = args;

    const existingNote = await ctx.db
      .query("questionNotes")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionTitle", questionTitle)
      )
      .unique();

    const now = Date.now();

    if (existingNote) {
      if (notes.trim() === "") {
        await ctx.db.delete(existingNote._id);
        return null;
      } else {
        await ctx.db.patch(existingNote._id, {
          notes,
          updatedAt: now,
        });
        return existingNote._id;
      }
    } else {
      if (notes.trim() !== "") {
        const noteId = await ctx.db.insert("questionNotes", {
          userId,
          questionTitle,
          notes,
          createdAt: now,
          updatedAt: now,
        });
        return noteId;
      }
      return null;
    }
  },
});

// Get a single note for a question
export const getNote = query({
  args: {
    userId: v.string(),
    questionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, questionTitle } = args;

    const note = await ctx.db
      .query("questionNotes")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionTitle", questionTitle)
      )
      .unique();

    return note?.notes || "";
  },
});

// Get all notes for a user (global)
export const getAllNotes = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("questionNotes")
      .withIndex("by_user_question", (q) => q.eq("userId", args.userId))
      .collect();

    const notesMap: Record<string, string> = {};
    notes.forEach((note) => {
      notesMap[note.questionTitle] = note.notes;
    });

    return notesMap;
  },
});

// Delete a note
export const deleteNote = mutation({
  args: {
    userId: v.string(),
    questionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, questionTitle } = args;

    const note = await ctx.db
      .query("questionNotes")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionTitle", questionTitle)
      )
      .unique();

    if (note) {
      await ctx.db.delete(note._id);
      return true;
    }

    return false;
  },
});

// Get total notes count for a user
export const getNotesCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("questionNotes")
      .withIndex("by_user_question", (q) => q.eq("userId", args.userId))
      .collect();

    return notes.length;
  },
});

export const getAllUserNotes = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const notes = await ctx.db
      .query("questionNotes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return notes.map((note) => ({
      questionTitle: note.questionTitle,
      notes: note.notes,
    }));
  },
});
