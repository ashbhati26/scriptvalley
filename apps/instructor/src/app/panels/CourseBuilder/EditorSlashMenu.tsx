"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, Quote, Code2, Minus, Table, Image as ImageIcon,
} from "lucide-react";

interface SlashCommand {
  id: string; label: string; description: string;
  icon: React.ReactNode; keywords: string[];
}

const ALL_COMMANDS: SlashCommand[] = [
  { id: "h1",      label: "Heading 1",    description: "Large section heading",  icon: <Heading1    className="w-4 h-4" />, keywords: ["h1","heading","title","large"]           },
  { id: "h2",      label: "Heading 2",    description: "Medium section heading", icon: <Heading2    className="w-4 h-4" />, keywords: ["h2","heading","subtitle","medium"]       },
  { id: "h3",      label: "Heading 3",    description: "Small section heading",  icon: <Heading3    className="w-4 h-4" />, keywords: ["h3","heading","small"]                   },
  { id: "bullet",  label: "Bullet List",  description: "Unordered list",         icon: <List        className="w-4 h-4" />, keywords: ["bullet","list","unordered","ul"]         },
  { id: "ordered", label: "Ordered List", description: "Numbered list",          icon: <ListOrdered className="w-4 h-4" />, keywords: ["ordered","numbered","list","ol"]         },
  { id: "todo",    label: "To-do List",   description: "Checkbox task list",     icon: <CheckSquare className="w-4 h-4" />, keywords: ["todo","task","check","checkbox"]         },
  { id: "quote",   label: "Quote",        description: "Blockquote",             icon: <Quote       className="w-4 h-4" />, keywords: ["quote","blockquote","callout"]           },
  { id: "code",    label: "Code Block",   description: "Code with syntax",       icon: <Code2       className="w-4 h-4" />, keywords: ["code","block","pre","snippet"]           },
  { id: "table",   label: "Table",        description: "Insert a table",         icon: <Table       className="w-4 h-4" />, keywords: ["table","grid","rows","columns"]          },
  { id: "image",   label: "Image",        description: "Insert image",           icon: <ImageIcon   className="w-4 h-4" />, keywords: ["image","picture","photo","img"]          },
  { id: "divider", label: "Divider",      description: "Horizontal separator",   icon: <Minus       className="w-4 h-4" />, keywords: ["divider","hr","line","separator","rule"] },
];

interface Props {
  query: string;
  position: { top: number; left: number };
  onSelect: (cmd: string) => void;
  onClose: () => void;
}

export default function EditorSlashMenu({ query, position, onSelect, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = ALL_COMMANDS.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return c.label.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q));
  });

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown")  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter")     { e.preventDefault(); if (filtered[activeIdx]) onSelect(filtered[activeIdx].id); }
      else if (e.key === "Escape")    onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [filtered, activeIdx, onSelect, onClose]);

  useEffect(() => {
    menuRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (filtered.length === 0) {
    return (
      <div
        className="absolute z-50 sv-bg-elevated sv-rounded-lg sv-shadow-md sv-text-faint"
        style={{ top: position.top, left: position.left, padding: "10px 14px", fontSize: 13, border: "1px solid var(--border-subtle)" }}
      >
        No results for "{query}"
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 sv-bg-elevated sv-rounded-xl scrollbar-hide"
      style={{
        top: position.top, left: position.left,
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-xl)",
        width: 240, maxHeight: 280, overflowY: "auto",
        padding: 6,
      }}
    >
      <p className="sv-section-label" style={{ padding: "4px 10px 6px" }}>Commands</p>

      {filtered.map((cmd, idx) => {
        const isActive = idx === activeIdx;
        return (
          <button
            key={cmd.id}
            data-idx={idx}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(cmd.id); }}
            onMouseEnter={() => setActiveIdx(idx)}
            className="w-full flex items-center gap-2.5 sv-rounded-md"
            style={{
              padding: "6px 10px", border: "none", cursor: "pointer", textAlign: "left",
              background: isActive ? "var(--bg-hover)" : "transparent",
            }}
          >
            {/* Icon badge */}
            <div
              className="sv-rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                width: 30, height: 30,
                background: isActive ? "var(--brand-subtle)" : "var(--bg-hover)",
                border: `1px solid ${isActive ? "var(--brand-border)" : "var(--border-subtle)"}`,
                color: isActive ? "var(--brand)" : "var(--text-faint)",
              }}
            >
              {cmd.icon}
            </div>

            {/* Label + description */}
            <div className="min-w-0">
              <p style={{
                fontSize: 13, letterSpacing: "-0.01em", lineHeight: 1.3,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              }}>
                {cmd.label}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-disabled)", lineHeight: 1.3, marginTop: 1 }}>
                {cmd.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}