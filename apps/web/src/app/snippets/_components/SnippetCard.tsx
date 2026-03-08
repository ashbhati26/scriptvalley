"use client";

import { Snippet } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Trash2, User } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import StarButton from "@/components/StarButton";

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { user } = useUser();
  const deleteSnippet = useMutation(api.snippets.deleteSnippet);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSnippet({ snippetId: snippet._id });
    } catch (error) {
      console.log("Error deleting snippet:", error);
      toast.error("Error deleting snippet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      className="group relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/snippets/${snippet._id}`} className="block h-full">
        <div className="relative h-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors duration-100 overflow-hidden">

          <div className="p-4 flex flex-col gap-3 h-full">

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[var(--bg-hover)] flex items-center justify-center shrink-0 p-1.5">
                  <Image
                    src={`/${snippet.language}.png`}
                    alt={`${snippet.language} logo`}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-disabled)] mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(snippet._creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.preventDefault()}
              >
                <StarButton snippetId={snippet._id} />

                {user?.id === snippet.userId && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-red-400/70 hover:bg-red-500/[0.06] transition-colors duration-100 disabled:opacity-40"
                  >
                    {isDeleting ? (
                      <div className="w-3.5 h-3.5 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors line-clamp-1 mb-1">
                {snippet.title}
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-faint)]">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{snippet.userName}</span>
              </div>
            </div>

            <div className="mt-auto">
              <pre className="rounded-md bg-[var(--bg-base)] border border-[var(--border-subtle)] p-3 text-[11px] font-mono text-[var(--text-muted)] leading-relaxed line-clamp-3 overflow-hidden">
                {snippet.code}
              </pre>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default SnippetCard;