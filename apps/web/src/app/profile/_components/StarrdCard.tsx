"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Snippet = { _id: string; language: string; title: string; _creationTime: number; code: string };

export default function StarredCard({ snippet: s, starButton }: { snippet: Snippet; starButton: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-medium)] bg-[var(--bg-elevated)] overflow-hidden transition-colors duration-100"
    >
      <Link href={`/snippets/${s._id}`} className="block">
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
          <div className="w-7 h-7 rounded-md bg-[var(--bg-hover)] p-1.5 shrink-0">
            <Image src={`/${s.language}.png`} alt={s.language} width={20} height={20} className="object-contain w-full h-full" />
          </div>
          <p className="flex-1 text-xs font-medium text-[var(--text-primary)] truncate group-hover:text-[#3A5EFF] transition-colors">
            {s.title}
          </p>
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)] shrink-0">
            <Clock className="w-3 h-3" />{new Date(s._creationTime).toLocaleDateString()}
          </span>
        </div>
        <div className="px-4 py-3">
          <pre className="text-xs text-[var(--text-disabled)] font-mono line-clamp-3 leading-relaxed">{s.code}</pre>
        </div>
      </Link>
      <div className="absolute top-2.5 right-10 z-10" onClick={(e) => e.preventDefault()}>
        {starButton}
      </div>
    </motion.div>
  );
}