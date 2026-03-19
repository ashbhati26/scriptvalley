"use client";

import { motion } from "framer-motion";

interface Props {
  label:  string;
  value:  number | string;
  sub?:   string;
  icon:   React.FC<{ className?: string; style?: React.CSSProperties }>;
  color?: string;
  delay?: number;
}

export default function StatCard({
  label, value, sub, icon: Icon, color = "#3A5EFF", delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, delay, ease: "easeOut" }}
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
          {label}
        </p>
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-3 h-3" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums leading-none">
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-[var(--text-disabled)] leading-snug">{sub}</p>
      )}
    </motion.div>
  );
}