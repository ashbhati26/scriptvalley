import { Trash2Icon, UserIcon } from "lucide-react";
import { Id } from "../../../../../../../packages/convex/convex/_generated/dataModel";
import CommentContent from "./CommentContent";

interface CommentProps {
  comment: {
    _id: Id<"snippetComments">;
    _creationTime: number;
    userId: string;
    userName: string;
    snippetId: Id<"snippets">;
    content: string;
  };
  onDelete: (commentId: Id<"snippetComments">) => void;
  isDeleting: boolean;
  currentUserId?: string;
}

function Comment({ comment, currentUserId, isDeleting, onDelete }: CommentProps) {
  return (
    <div className="group rounded-md px-3 py-3 hover:bg-[var(--bg-elevated)] transition-colors duration-100">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full bg-[var(--bg-hover)]">
            <UserIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>
          <div>
            <span className="block text-xs font-medium text-[var(--text-secondary)] truncate">
              {comment.userName}
            </span>
            <span className="block text-[10px] text-[var(--text-disabled)]">
              {new Date(comment._creationTime).toLocaleDateString()}
            </span>
          </div>
        </div>

        {comment.userId === currentUserId && (
          <button
            onClick={() => onDelete(comment._id)}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[var(--text-disabled)] hover:text-red-400/70 hover:bg-red-500/[0.06] transition-all duration-100 disabled:opacity-40"
            title="Delete comment"
          >
            <Trash2Icon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="pl-9">
        <CommentContent content={comment.content} />
      </div>
    </div>
  );
}

export default Comment;