"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import CodeBlock from "./CodeBlock";

type Execution = { _id: string; language: string; _creationTime: number; code: string; error?: string; output?: string };

export default function ExecutionCard({ execution: ex }: { execution: Execution }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--border-subtle)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <div className="w-7 h-7 rounded-md bg-[var(--bg-hover)] p-1.5 shrink-0">
          <Image src={`/${ex.language}.png`} alt={ex.language} width={20} height={20} className="object-contain w-full h-full" />
        </div>
        <span className="text-xs font-medium text-[var(--text-secondary)]">{ex.language.toUpperCase()}</span>
        <span className="flex items-center gap-1 text-[10px] text-[var(--text-disabled)] ml-1">
          <Clock className="w-3 h-3" />{new Date(ex._creationTime).toLocaleString()}
        </span>
        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-md border ${
          ex.error
            ? "text-red-400/80 bg-red-500/[0.06] border-red-500/20"
            : "text-[#22c55e] bg-[#22c55e0d] border-[#22c55e25]"
        }`}>
          {ex.error ? "Error" : "Success"}
        </span>
      </div>
      <div className="p-4 bg-[var(--bg-base)] space-y-3">
        <CodeBlock code={ex.code} language={ex.language} />
        {(ex.output || ex.error) && (
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] overflow-hidden">
            <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--text-disabled)] border-b border-[var(--border-default)]">
              Output
            </p>
            <pre className={`px-4 py-3 text-xs font-mono ${ex.error ? "text-red-400/80" : "text-[#22c55e]"}`}>
              {ex.error || ex.output}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}