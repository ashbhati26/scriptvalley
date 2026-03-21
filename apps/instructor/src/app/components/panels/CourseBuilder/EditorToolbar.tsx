"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Code, Link2, RemoveFormatting, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote,
  Undo, Redo, Minus, ChevronDown, Type,
  Table as TableIcon, Check, X, ExternalLink,
  Heading1, Heading2, Heading3, Type as TypeIcon,
  Code2, Image as ImageIcon, Plus, Trash2,
} from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Btn({
  onMouseDown, active, title, disabled, children,
}: {
  onMouseDown: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      className={`p-1.5 rounded-md transition-all disabled:opacity-25 disabled:cursor-not-allowed shrink-0 ${
        active
          ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
          : "text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover)"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-(--border-subtle) mx-0.5 shrink-0" />;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fn(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, fn]);
}

// ─── Block type selector ──────────────────────────────────────────────────────

const BLOCK_OPTIONS = [
  { value: "p",     label: "Text",       icon: TypeIcon, desc: "Default paragraph"   },
  { value: "h1",    label: "Heading 1",  icon: Heading1, desc: "Large section title"  },
  { value: "h2",    label: "Heading 2",  icon: Heading2, desc: "Medium section title" },
  { value: "h3",    label: "Heading 3",  icon: Heading3, desc: "Small section title"  },
  { value: "quote", label: "Quote",      icon: Quote,    desc: "Blockquote"           },
  { value: "code",  label: "Code block", icon: Code2,    desc: "Monospace code"       },
];

function BlockSelect({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const active =
    editor.isActive("heading", { level: 1 }) ? "h1"    :
    editor.isActive("heading", { level: 2 }) ? "h2"    :
    editor.isActive("heading", { level: 3 }) ? "h3"    :
    editor.isActive("blockquote")            ? "quote" :
    editor.isActive("codeBlock")             ? "code"  : "p";

  const current = BLOCK_OPTIONS.find((o) => o.value === active)!;

  const select = (value: string) => {
    const c = editor.chain().focus();
    if      (value === "p")     { c.setParagraph().run(); }
    else if (value === "h1")    { c.toggleHeading({ level: 1 }).run(); }
    else if (value === "h2")    { c.toggleHeading({ level: 2 }).run(); }
    else if (value === "h3")    { c.toggleHeading({ level: 3 }).run(); }
    else if (value === "quote") { c.toggleBlockquote().run(); }
    else if (value === "code")  { c.toggleCodeBlock().run(); }
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 h-7 px-2.5 hover:bg-(--bg-hover) rounded-md text-xs text-(--text-faint) hover:text-(--text-secondary) transition-all"
      >
        <current.icon className="w-3.5 h-3.5" />
        <span className="max-w-[72px] truncate hidden sm:block">{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-(--text-disabled) transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl py-1.5 shadow-2xl w-48">
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-medium uppercase tracking-widest text-(--text-disabled)">
            Block type
          </p>
          {BLOCK_OPTIONS.map((opt) => {
            const isActive = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); select(opt.value); }}
                className={`w-full flex items-center gap-3 px-3 py-2 transition-all text-left group ${
                  isActive ? "bg-(--bg-hover)" : "hover:bg-(--bg-elevated)"
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "text-[#3A5EFF]" : "text-(--text-faint) group-hover:text-(--text-muted)"
                }`}>
                  <opt.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm leading-tight ${isActive ? "text-(--text-primary)" : "text-(--text-muted)"}`}>
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-(--text-disabled) leading-tight mt-0.5">{opt.desc}</div>
                </div>
                {isActive && <Check className="w-3 h-3 text-[#3A5EFF] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Code block with language selector ───────────────────────────────────────

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python",     label: "Python"     },
  { value: "java",       label: "Java"       },
  { value: "cpp",        label: "C++"        },
  { value: "c",          label: "C"          },
  { value: "csharp",     label: "C#"         },
  { value: "go",         label: "Go"         },
  { value: "rust",       label: "Rust"       },
  { value: "sql",        label: "SQL"        },
  { value: "html",       label: "HTML"       },
  { value: "css",        label: "CSS"        },
  { value: "bash",       label: "Bash"       },
  { value: "json",       label: "JSON"       },
  { value: "yaml",       label: "YAML"       },
  { value: "markdown",   label: "Markdown"   },
];

function CodeBlockMenu({ editor, onOpenImageModal }: { editor: Editor; onOpenImageModal: () => void }) {
  const [open, setOpen]         = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const ref     = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const inCode  = editor.isActive("codeBlock");

  useClickOutside(ref, () => setOpen(false));
  useClickOutside(langRef, () => setLangOpen(false));

  const currentLang = editor.getAttributes("codeBlock").language as string | undefined;
  const langLabel   = CODE_LANGUAGES.find((l) => l.value === currentLang)?.label ?? "Plain";

  const setLang = (lang: string) => {
    // Stores the language as a data attribute on the code block node.
    // Used for display in the toolbar and can be read by a renderer for
    // client-side highlighting (e.g. via a useEffect + highlight.js on the
    // student-facing side). No runtime highlighting in the editor itself.
    editor.chain().focus().updateAttributes("codeBlock", { language: lang }).run();
    setLangOpen(false);
    setOpen(false);
  };

  const insertCode = () => {
    editor.chain().focus().toggleCodeBlock().run();
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title={inCode ? "Code block options" : "Insert code block"}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!inCode) { insertCode(); }
          else setOpen((o) => !o);
        }}
        className={`p-1.5 rounded-md transition-all flex items-center gap-0.5 ${
          inCode
            ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
            : "text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover)"
        }`}
      >
        <Code2 className="w-3.5 h-3.5" />
        {inCode && <ChevronDown className="w-2.5 h-2.5 ml-0.5" />}
      </button>

      {open && inCode && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl shadow-2xl w-48 overflow-hidden">
          {/* Language picker trigger */}
          <div className="px-3 py-2.5 border-b border-(--border-subtle)">
            <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1.5">Language</p>
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setLangOpen((o) => !o); }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-(--bg-input) border border-(--border-subtle) hover:border-(--border-medium) text-xs text-(--text-secondary) transition-colors"
              >
                <span className="font-mono">{langLabel}</span>
                <ChevronDown className={`w-3 h-3 text-(--text-disabled) transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl py-1 shadow-2xl max-h-48 overflow-y-auto scrollbar-hide">
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setLang(""); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-(--text-muted) hover:bg-(--bg-hover) transition-colors font-mono"
                  >
                    Plain text
                  </button>
                  {CODE_LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setLang(l.value); }}
                      className={`w-full text-left flex items-center justify-between px-3 py-1.5 text-xs transition-colors font-mono ${
                        currentLang === l.value
                          ? "text-[#3A5EFF] bg-[#3A5EFF]/08"
                          : "text-(--text-muted) hover:bg-(--bg-hover)"
                      }`}
                    >
                      {l.label}
                      {currentLang === l.value && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); setOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
            >
              <Trash2 className="w-3 h-3" />Remove code block
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Table with grid insert picker ───────────────────────────────────────────

function TableMenu({ editor }: { editor: Editor }) {
  const [open,     setOpen]     = useState(false);
  const [hovered,  setHovered]  = useState<[number, number] | null>(null);
  const ref     = useRef<HTMLDivElement>(null);
  const inTable = editor.isActive("table");
  useClickOutside(ref, () => setOpen(false));

  const ROWS = 6;
  const COLS = 6;

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setOpen(false);
    setHovered(null);
  };

  const tableActions = [
    { label: "Add column before",  fn: () => editor.chain().focus().addColumnBefore().run()  },
    { label: "Add column after",   fn: () => editor.chain().focus().addColumnAfter().run()   },
    { label: "Delete column",      fn: () => editor.chain().focus().deleteColumn().run(),     danger: true },
    null, // divider
    { label: "Add row before",     fn: () => editor.chain().focus().addRowBefore().run()      },
    { label: "Add row after",      fn: () => editor.chain().focus().addRowAfter().run()       },
    { label: "Delete row",         fn: () => editor.chain().focus().deleteRow().run(),         danger: true },
    null,
    { label: "Toggle header row",  fn: () => editor.chain().focus().toggleHeaderRow().run()  },
    { label: "Merge cells",        fn: () => editor.chain().focus().mergeCells().run()        },
    { label: "Split cell",         fn: () => editor.chain().focus().splitCell().run()         },
    null,
    { label: "Delete table",       fn: () => editor.chain().focus().deleteTable().run(),       danger: true },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title={inTable ? "Table options" : "Insert table"}
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className={`p-1.5 rounded-md transition-all flex items-center gap-0.5 ${
          inTable
            ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
            : "text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover)"
        }`}
      >
        <TableIcon className="w-3.5 h-3.5" />
        <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl shadow-2xl overflow-hidden">
          {!inTable ? (
            /* Grid picker for new tables */
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-2">Insert table</p>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {Array.from({ length: ROWS * COLS }, (_, i) => {
                  const r = Math.floor(i / COLS) + 1;
                  const c = (i % COLS) + 1;
                  const isHovered = hovered ? r <= hovered[0] && c <= hovered[1] : false;
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHovered([r, c])}
                      onMouseLeave={() => setHovered(null)}
                      onMouseDown={(e) => { e.preventDefault(); insertTable(r, c); }}
                      className={`w-6 h-6 rounded border transition-all ${
                        isHovered
                          ? "bg-[#3A5EFF]/20 border-[#3A5EFF]/40"
                          : "bg-(--bg-hover) border-(--border-subtle) hover:border-(--border-medium)"
                      }`}
                    />
                  );
                })}
              </div>
              {hovered ? (
                <p className="text-[10px] text-[#3A5EFF] mt-2 font-medium text-center">
                  {hovered[0]} × {hovered[1]} table
                </p>
              ) : (
                <p className="text-[10px] text-(--text-disabled) mt-2 text-center">
                  Hover to select size
                </p>
              )}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertTable(3, 3); }}
                className="mt-2 w-full text-xs text-(--text-muted) hover:text-(--brand) hover:bg-(--brand-subtle) rounded-lg py-1.5 transition-colors border border-(--border-subtle)"
              >
                Quick insert 3×3
              </button>
            </div>
          ) : (
            /* Edit-mode actions */
            <div className="py-1.5 w-44">
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-(--text-disabled)">Table options</p>
              {tableActions.map((a, i) =>
                a === null ? (
                  <div key={i} className="my-1 border-t border-(--border-subtle)" />
                ) : (
                  <button
                    key={a.label}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); a.fn(); setOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-all hover:bg-(--bg-hover) ${
                      a.danger ? "text-red-400/70 hover:text-red-400" : "text-(--text-muted) hover:text-(--text-secondary)"
                    }`}
                  >
                    {a.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Link popover ─────────────────────────────────────────────────────────────

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url,  setUrl]  = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ref      = useRef<HTMLDivElement>(null);
  const isActive = editor.isActive("link");
  useClickOutside(ref, () => setOpen(false));

  const openPopover = () => {
    setUrl(editor.getAttributes("link").href ?? "");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const apply = () => {
    if (!url.trim()) { editor.chain().focus().unsetLink().run(); }
    else {
      const href = url.startsWith("http") ? url : `https://${url}`;
      editor.chain().focus().setLink({ href, target: "_blank" }).run();
    }
    setOpen(false);
    setUrl("");
  };

  const remove = () => { editor.chain().focus().unsetLink().run(); setOpen(false); setUrl(""); };

  return (
    <div className="relative shrink-0" ref={ref}>
      <Btn onMouseDown={openPopover} active={isActive} title={isActive ? "Edit link" : "Insert link"}>
        <Link2 className="w-3.5 h-3.5" />
      </Btn>

      {open && (
        <div className="absolute top-full right-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl p-3 shadow-2xl w-72">
          <p className="text-[10px] font-medium uppercase tracking-widest text-(--text-disabled) mb-2.5">
            {isActive ? "Edit Link" : "Insert Link"}
          </p>
          <div className="flex items-center gap-2 bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2 focus-within:border-[#3A5EFF]/30 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-(--text-disabled) shrink-0" />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")  { e.preventDefault(); apply(); }
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="https://example.com"
              className="flex-1 bg-transparent text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none min-w-0"
            />
            {url && (
              <button type="button" onMouseDown={(e) => { e.preventDefault(); setUrl(""); }} className="text-(--text-disabled) hover:text-(--text-muted) transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); apply(); }}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#3A5EFF] hover:bg-[#4a6aff] rounded-lg py-1.5 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              {isActive ? "Update" : "Apply"}
            </button>
            {isActive && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); remove(); }}
                className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/[0.06] rounded-lg px-3 py-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />Remove
              </button>
            )}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setOpen(false); }}
              className="text-xs text-(--text-faint) hover:text-(--text-muted) hover:bg-(--bg-hover) rounded-lg px-3 py-1.5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color menu — improved swatches ──────────────────────────────────────────

const TEXT_COLORS = [
  { label: "Default",  value: ""        },
  { label: "Brand",    value: "#3A5EFF" },
  { label: "Emerald",  value: "#10b981" },
  { label: "Amber",    value: "#f59e0b" },
  { label: "Rose",     value: "#f43f5e" },
  { label: "Purple",   value: "#a855f7" },
  { label: "Cyan",     value: "#06b6d4" },
  { label: "Gray",     value: "#71717a" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow",  value: "#fef08a" },
  { label: "Green",   value: "#bbf7d0" },
  { label: "Blue",    value: "#bfdbfe" },
  { label: "Pink",    value: "#fbcfe8" },
  { label: "Purple",  value: "#e9d5ff" },
  { label: "Orange",  value: "#fed7aa" },
  { label: "Red",     value: "#fecaca" },
  { label: "Gray",    value: "#e5e7eb" },
];

function ColorMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<"text" | "highlight">("text");
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const currentColor     = editor.getAttributes("textStyle").color as string | undefined;
  const currentHighlight = editor.getAttributes("highlight").color as string | undefined;

  return (
    <div className="relative shrink-0" ref={ref}>
      {/* Trigger — shows active color swatch */}
      <button
        type="button"
        title="Text color / highlight"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="flex items-center gap-0.5 p-1.5 rounded-md text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) transition-all"
      >
        <div className="flex flex-col items-center gap-0.5">
          <Type className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <div
              className="w-2.5 h-1 rounded-sm border border-(--border-subtle)"
              style={{ background: currentColor || "var(--text-muted)" }}
            />
            <div
              className="w-2.5 h-1 rounded-sm border border-(--border-subtle)"
              style={{ background: currentHighlight || "transparent" }}
            />
          </div>
        </div>
        <ChevronDown className="w-2.5 h-2.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-(--bg-elevated) border border-(--border-medium) rounded-xl p-2 shadow-2xl w-44">
          {/* Tab switcher */}
          <div className="flex gap-1 mb-2.5 p-0.5 rounded-lg bg-(--bg-input) border border-(--border-subtle)">
            {(["text", "highlight"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setTab(t); }}
                className={`flex-1 text-[10px] py-1 rounded-md transition-all capitalize font-medium ${
                  tab === t
                    ? "bg-(--bg-active) text-(--text-secondary)"
                    : "text-(--text-faint) hover:text-(--text-muted)"
                }`}
              >
                {t === "text" ? "Color" : "Highlight"}
              </button>
            ))}
          </div>

          {tab === "text" ? (
            <>
              {/* Swatch grid */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {TEXT_COLORS.filter((c) => c.value).map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().setColor(c.value).run();
                      setOpen(false);
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      currentColor === c.value ? "border-[#3A5EFF] scale-110" : "border-(--border-subtle) hover:border-(--border-medium)"
                    }`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
              {/* Reset */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-(--bg-hover) text-xs text-(--text-muted) transition-all border border-(--border-subtle)"
              >
                <X className="w-3 h-3 text-(--text-disabled)" />
                Reset to default
              </button>
            </>
          ) : (
            <>
              {/* Highlight swatch grid */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().setHighlight({ color: c.value }).run();
                      setOpen(false);
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      currentHighlight === c.value ? "border-[#3A5EFF] scale-110" : "border-(--border-subtle) hover:border-(--border-medium)"
                    }`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
              {/* Remove highlight */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-(--bg-hover) text-xs text-(--text-muted) transition-all border border-(--border-subtle)"
              >
                <X className="w-3 h-3 text-(--text-disabled)" />
                Remove highlight
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main toolbar ─────────────────────────────────────────────────────────────

interface EditorToolbarProps {
  editor:           Editor;
  onOpenImageModal?: () => void;  // optional — passed from NotesEditor
}

export default function EditorToolbar({ editor, onOpenImageModal }: EditorToolbarProps) {
  return (
    <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-(--border-subtle) bg-(--bg-input) sticky top-0 z-10">
      {/* Undo / Redo */}
      <Btn onMouseDown={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
        <Undo className="w-3.5 h-3.5" />
      </Btn>
      <Btn onMouseDown={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
        <Redo className="w-3.5 h-3.5" />
      </Btn>
      <Sep />

      {/* Block type */}
      <BlockSelect editor={editor} />
      <Sep />

      {/* Inline marks */}
      <Btn onMouseDown={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}      title="Bold (Ctrl+B)">      <Bold          className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}    title="Italic (Ctrl+I)">    <Italic        className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"> <UnderlineIcon className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}    title="Strikethrough">      <Strikethrough className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive("code")}      title="Inline code">        <Code          className="w-3.5 h-3.5" /></Btn>
      <Sep />

      {/* Color */}
      <ColorMenu editor={editor} />
      <Sep />

      {/* Alignment */}
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("left").run()}    active={editor.isActive({ textAlign: "left" })}    title="Align left">    <AlignLeft    className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("center").run()}  active={editor.isActive({ textAlign: "center" })}  title="Align center">  <AlignCenter  className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("right").run()}   active={editor.isActive({ textAlign: "right" })}   title="Align right">   <AlignRight   className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">        <AlignJustify className="w-3.5 h-3.5" /></Btn>
      <Sep />

      {/* Lists */}
      <Btn onMouseDown={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}  title="Bullet list">  <List        className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list"> <ListOrdered className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive("taskList")}    title="Task list">    <CheckSquare className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive("blockquote")}  title="Blockquote">   <Quote       className="w-3.5 h-3.5" /></Btn>
      <Sep />

      {/* Indent */}
      <Btn onMouseDown={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")} title="Indent">
        <span className="text-[11px] font-bold leading-none">→</span>
      </Btn>
      <Btn onMouseDown={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")} title="Outdent">
        <span className="text-[11px] font-bold leading-none">←</span>
      </Btn>
      <Sep />

      {/* Rich inserts */}
      <LinkPopover editor={editor} />
      <CodeBlockMenu editor={editor} onOpenImageModal={onOpenImageModal ?? (() => {})} />
      <TableMenu editor={editor} />

      {/* Image — opens modal if handler provided, falls back to prompt */}
      {onOpenImageModal && (
        <Btn
          onMouseDown={() => onOpenImageModal()}
          title="Insert image"
          active={editor.isActive("image")}
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </Btn>
      )}

      <Btn onMouseDown={() => editor.chain().focus().setHorizontalRule().run()} title="Divider line">
        <Minus className="w-3.5 h-3.5" />
      </Btn>
      <Sep />

      {/* Clear */}
      <Btn onMouseDown={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
        <RemoveFormatting className="w-3.5 h-3.5" />
      </Btn>
    </div>
  );
}