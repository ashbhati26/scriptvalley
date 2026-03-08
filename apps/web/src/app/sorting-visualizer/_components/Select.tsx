"use client";

import { SelectOptionsType } from "../lib/types";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export const Select = ({
  options,
  defaultValue,
  onChange,
  isDisabled = false,
}: {
  options: SelectOptionsType[];
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === defaultValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        disabled={isDisabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 w-44 h-8 px-3
          bg-[var(--bg-input)] hover:bg-[var(--bg-active)]
          border border-transparent
          rounded-md text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="truncate text-left">{selected?.label ?? "Select…"}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 text-[var(--text-faint)]"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1 w-44 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl py-1.5 shadow-2xl z-50"
          >
            <p className="px-3 pt-1 pb-1.5 text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
              Algorithm
            </p>
            {options.map((option, index) => {
              const isActive = option.value === defaultValue;
              return (
                <motion.li
                  key={option.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange({ target: { value: option.value } } as React.ChangeEvent<HTMLSelectElement>);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer transition-colors duration-75 ${
                    isActive
                      ? "text-[var(--text-primary)] bg-[var(--bg-active)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span>{option.label}</span>
                  {isActive && <Check className="w-3 h-3 text-[#3A5EFF] shrink-0" />}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};