import { CodeIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import CommentContent from "./CommentContent";

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting: boolean;
}

function CommentForm({ isSubmitting, onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newComment = comment.substring(0, start) + "  " + comment.substring(end);
      setComment(newComment);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment);
    setComment("");
    setIsPreview(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <div className="flex justify-end px-3 pt-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors duration-100 ${
              isPreview
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {isPreview ? (
          <div className="min-h-[120px] px-4 py-3 text-sm text-[var(--text-secondary)]">
            {comment.trim()
              ? <CommentContent content={comment} />
              : <p className="text-[var(--text-disabled)]">Nothing to preview yet.</p>
            }
          </div>
        ) : (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add to the discussion…"
            className="w-full border-0 outline-none resize-none min-h-[120px] px-4 py-3 font-mono text-sm bg-transparent text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)]"
          />
        )}

        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-[var(--border-subtle)]">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--text-disabled)]">
            <CodeIcon className="w-3 h-3" />
            <span>Format code with ```language · Tab inserts spaces</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              text-white bg-[#3A5EFF] hover:bg-[#4a6aff]
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <SendIcon className="w-3 h-3" />
                Comment
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;