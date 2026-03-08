"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Quote, Code2, Minus, Table, Image as ImageIcon,
} from "lucide-react";

interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
}

const ALL_COMMANDS: SlashCommand[] = [
  { id: "h1",      label: "Heading 1",    description: "Large section heading",    icon: <Heading1    className="w-4 h-4" />, keywords: ["h1", "heading", "title", "large"]               },
  { id: "h2",      label: "Heading 2",    description: "Medium section heading",   icon: <Heading2    className="w-4 h-4" />, keywords: ["h2", "heading", "subtitle", "medium"]            },
  { id: "h3",      label: "Heading 3",    description: "Small section heading",    icon: <Heading3    className="w-4 h-4" />, keywords: ["h3", "heading", "small"]                        },
  { id: "bullet",  label: "Bullet List",  description: "Unordered list",           icon: <List        className="w-4 h-4" />, keywords: ["bullet", "list", "unordered", "ul"]             },
  { id: "ordered", label: "Ordered List", description: "Numbered list",            icon: <ListOrdered className="w-4 h-4" />, keywords: ["ordered", "numbered", "list", "ol"]             },
  { id: "todo",    label: "To-do List",   description: "Checkbox task list",       icon: <CheckSquare className="w-4 h-4" />, keywords: ["todo", "task", "check", "checkbox"]             },
  { id: "quote",   label: "Quote",        description: "Blockquote",               icon: <Quote       className="w-4 h-4" />, keywords: ["quote", "blockquote", "callout"]                },
  { id: "code",    label: "Code Block",   description: "Code with syntax",         icon: <Code2       className="w-4 h-4" />, keywords: ["code", "block", "pre", "snippet"]               },
  { id: "table",   label: "Table",        description: "Insert a table",           icon: <Table       className="w-4 h-4" />, keywords: ["table", "grid", "rows", "columns"]              },
  { id: "image",   label: "Image",        description: "Insert image from URL",    icon: <ImageIcon   className="w-4 h-4" />, keywords: ["image", "picture", "photo", "img"]              },
  { id: "divider", label: "Divider",      description: "Horizontal separator",     icon: <Minus       className="w-4 h-4" />, keywords: ["divider", "hr", "line", "separator", "rule"]    },
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
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIdx]) onSelect(filtered[activeIdx].id);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [filtered, activeIdx, onSelect, onClose]);

  useEffect(() => {
    const el = menuRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (filtered.length === 0) return (
    <div
      className="absolute z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl px-3 py-2.5 shadow-2xl text-xs text-(--text-faint)"
      style={{ top: position.top, left: position.left }}
    >
      No results for &ldquo;{query}&rdquo;
    </div>
  );

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl py-1.5 shadow-2xl w-60 max-h-72 overflow-y-auto scrollbar-hide"
      style={{ top: position.top, left: position.left }}
    >
      <p className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-(--text-disabled)">
        Commands
      </p>
      {filtered.map((cmd, idx) => (
        <button
          key={cmd.id}
          data-idx={idx}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd.id); }}
          onMouseEnter={() => setActiveIdx(idx)}
          className={`w-full flex items-center gap-3 px-3 py-2 transition-all text-left ${
            idx === activeIdx ? "bg-(--bg-hover)" : "hover:bg-(--bg-elevated)"
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
            idx === activeIdx
              ? "bg-[#3A5EFF]/10 border-[#3A5EFF]/20 text-[#3A5EFF]"
              : "bg-(--bg-hover) border-(--border-subtle) text-(--text-faint)"
          }`}>
            {cmd.icon}
          </div>
          <div className="min-w-0">
            <div className={`text-sm leading-tight transition-colors ${
              idx === activeIdx ? "text-(--text-primary)" : "text-(--text-faint)"
            }`}>
              {cmd.label}
            </div>
            <div className="text-[10px] text-(--text-disabled) leading-tight mt-0.5">
              {cmd.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}