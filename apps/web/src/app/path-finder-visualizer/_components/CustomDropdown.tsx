"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

type Option = { value: string | number; name: string };

export function CustomDropdown({
  label, value, onChange, options, isDisabled = false,
}: {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  options: Option[];
  isDisabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1.5 relative min-w-[140px] flex-1" ref={dropdownRef}>
      <label className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] select-none">
        {label}
      </label>

      <button
        onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
        disabled={isDisabled}
        className="flex items-center justify-between h-8 px-3
          bg-[var(--bg-input)] hover:bg-[var(--bg-active)]
          border border-transparent rounded-md
          text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed w-full"
      >
        <span className="truncate text-left">{selectedOption?.name ?? "Select"}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 text-[var(--text-faint)] ml-2"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 w-full mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl py-1.5 shadow-2xl max-h-56 overflow-y-auto scrollbar-hide"
          >
            <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
              {label}
            </p>
            {options.map((opt, i) => {
              const isActive = opt.value === value;
              return (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`flex items-center justify-between w-full px-3 py-1.5 text-xs transition-colors duration-75 text-left ${
                    isActive
                      ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span>{opt.name}</span>
                  {isActive && <Check className="w-3 h-3 text-[#3A5EFF] shrink-0" />}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}