"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Id } from "../../../../../../../packages/convex/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import LoginButton from "@/components/LoginButton";

function Comments({ snippetId }: { snippetId: Id<"snippets"> }) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const comments = useQuery(api.snippets.getComments, { snippetId }) || [];
  const addComment = useMutation(api.snippets.addComment);
  const deleteComment = useMutation(api.snippets.deleteComment);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      await addComment({ snippetId, content });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: Id<"snippetComments">) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment({ commentId });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)] flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-[var(--text-faint)]" />
        <span className="text-xs text-[var(--text-muted)]">Discussion</span>
        <span className="text-[10px] text-[var(--text-disabled)] ml-0.5">({comments.length})</span>
      </div>

      <div className="p-5 space-y-5">
        {user ? (
          <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
        ) : (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Sign in to join the discussion
            </p>
            <SignInButton mode="modal">
              <LoginButton name="Sign in" />
            </SignInButton>
          </div>
        )}

        <div className="space-y-1">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              isDeleting={deletingCommentId === comment._id}
              currentUserId={user?.id}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-xs text-[var(--text-disabled)] text-center py-4">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comments;