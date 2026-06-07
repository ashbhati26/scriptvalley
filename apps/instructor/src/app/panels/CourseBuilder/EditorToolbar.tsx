"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code,
  Link2, RemoveFormatting, Highlighter,
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
  onMouseDown: () => void; active?: boolean; title: string;
  disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      style={active ? { background: "rgba(58,94,255,0.12)", color: "#3A5EFF" } : undefined}
      className={`p-2 rounded-md transition-all disabled:opacity-25 disabled:cursor-not-allowed shrink-0 ${
        active ? "" : "sv-btn-ghost"
      }`}
    >
      {children}
    </button>
  );
}

// Sep: visible divider with proper side margins so button groups breathe
function Sep() {
  return (
    <div
      className="shrink-0"
      style={{
        width: 1,
        height: 20,
        background: "var(--border-default)",
        margin: "0 8px",
        borderRadius: 1,
      }}
    />
  );
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

  const active = editor.isActive("heading", { level: 1 }) ? "h1"
    : editor.isActive("heading", { level: 2 }) ? "h2"
    : editor.isActive("heading", { level: 3 }) ? "h3"
    : editor.isActive("blockquote") ? "quote"
    : editor.isActive("codeBlock")  ? "code"
    : "p";

  const current = BLOCK_OPTIONS.find((o) => o.value === active)!;

  const select = (value: string) => {
    const c = editor.chain().focus();
    if (value === "p")          c.setParagraph().run();
    else if (value === "h1")    c.toggleHeading({ level: 1 }).run();
    else if (value === "h2")    c.toggleHeading({ level: 2 }).run();
    else if (value === "h3")    c.toggleHeading({ level: 3 }).run();
    else if (value === "quote") c.toggleBlockquote().run();
    else if (value === "code")  c.toggleCodeBlock().run();
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 sv-btn-ghost"
        style={{ height: 32, padding: "0 12px", fontSize: 12, borderRadius: "var(--radius-md)" }}
      >
        <current.icon className="w-4 h-4" />
        <span className="max-w-[72px] truncate hidden sm:block">{current.label}</span>
        <ChevronDown
          className="w-3 h-3"
          style={{ color: "var(--text-disabled)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-xl py-1.5 shadow-2xl w-48"
          style={{ top: "calc(100% + 6px)", left: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)" }}
        >
          <p style={{ padding: "4px 12px 6px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-disabled)" }}>
            Block type
          </p>
          {BLOCK_OPTIONS.map((opt) => {
            const isAct = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); select(opt.value); }}
                className="w-full flex items-center gap-3 text-left"
                style={{
                  padding: "7px 12px",
                  background: isAct ? "var(--bg-hover)" : "transparent",
                  border: "none", cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (!isAct) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { if (!isAct) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  color: isAct ? "#3A5EFF" : "var(--text-faint)",
                }}>
                  <opt.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div style={{ fontSize: 13, lineHeight: 1.3, color: isAct ? "var(--text-primary)" : "var(--text-muted)", fontWeight: isAct ? 500 : 400 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-disabled)", lineHeight: 1.3, marginTop: 1 }}>
                    {opt.desc}
                  </div>
                </div>
                {isAct && <Check className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: "#3A5EFF" }} />}
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
  const [open,     setOpen]     = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const ref     = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const inCode  = editor.isActive("codeBlock");

  useClickOutside(ref,     () => setOpen(false));
  useClickOutside(langRef, () => setLangOpen(false));

  const currentLang = editor.getAttributes("codeBlock").language as string | undefined;
  const langLabel   = CODE_LANGUAGES.find((l) => l.value === currentLang)?.label ?? "Plain";

  const setLang = (lang: string) => {
    editor.chain().focus().updateAttributes("codeBlock", { language: lang }).run();
    setLangOpen(false);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title={inCode ? "Code block options" : "Insert code block"}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!inCode) { editor.chain().focus().toggleCodeBlock().run(); }
          else setOpen((o) => !o);
        }}
        className="p-2 rounded-md transition-all flex items-center gap-0.5"
        style={inCode ? { background: "rgba(58,94,255,0.12)", color: "#3A5EFF" } : { color: "var(--text-faint)" }}
        onMouseEnter={(e) => { if (!inCode) { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; } }}
        onMouseLeave={(e) => { if (!inCode) { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
      >
        <Code2 className="w-4 h-4" />
        {inCode && <ChevronDown className="w-3 h-3 ml-0.5" />}
      </button>

      {open && inCode && (
        <div
          className="absolute z-50 rounded-xl shadow-2xl w-48 overflow-hidden"
          style={{ top: "calc(100% + 6px)", left: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)" }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-disabled)", marginBottom: 6 }}>Language</p>
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setLangOpen((o) => !o); }}
                className="w-full flex items-center justify-between rounded-lg text-xs"
                style={{ padding: "6px 10px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; }}
              >
                <span>{langLabel}</span>
                <ChevronDown className="w-3 h-3" style={{ color: "var(--text-disabled)", transform: langOpen ? "rotate(180deg)" : undefined }} />
              </button>

              {langOpen && (
                <div
                  className="absolute z-50 rounded-xl py-1 scrollbar-hide"
                  style={{ top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", boxShadow: "var(--shadow-xl)", maxHeight: 192, overflowY: "auto" }}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setLang(""); }}
                    className="w-full text-left"
                    style={{ padding: "6px 12px", fontSize: 12, color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >Plain text</button>
                  {CODE_LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setLang(l.value); }}
                      className="w-full text-left flex items-center justify-between"
                      style={{
                        padding: "6px 12px", fontSize: 12, border: "none", cursor: "pointer",
                        fontFamily: "var(--font-mono)",
                        color: currentLang === l.value ? "#3A5EFF" : "var(--text-muted)",
                        background: currentLang === l.value ? "rgba(58,94,255,0.08)" : "transparent",
                      }}
                      onMouseEnter={(e) => { if (currentLang !== l.value) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { if (currentLang !== l.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      {l.label}
                      {currentLang === l.value && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "4px 0" }}>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); setOpen(false); }}
              className="w-full text-left flex items-center gap-2"
              style={{ padding: "6px 12px", fontSize: 12, color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Trash2 className="w-3 h-3" />Remove code block
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Table menu ───────────────────────────────────────────────────────────────

function TableMenu({ editor }: { editor: Editor }) {
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const ref     = useRef<HTMLDivElement>(null);
  const inTable = editor.isActive("table");
  useClickOutside(ref, () => setOpen(false));

  const ROWS = 6, COLS = 6;

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setOpen(false);
    setHovered(null);
  };

  const tableActions = [
    { label: "Add column before",  fn: () => editor.chain().focus().addColumnBefore().run() },
    { label: "Add column after",   fn: () => editor.chain().focus().addColumnAfter().run()  },
    { label: "Delete column",      fn: () => editor.chain().focus().deleteColumn().run(),    danger: true },
    null,
    { label: "Add row before",     fn: () => editor.chain().focus().addRowBefore().run() },
    { label: "Add row after",      fn: () => editor.chain().focus().addRowAfter().run()  },
    { label: "Delete row",         fn: () => editor.chain().focus().deleteRow().run(),   danger: true },
    null,
    { label: "Toggle header row",  fn: () => editor.chain().focus().toggleHeaderRow().run() },
    { label: "Merge cells",        fn: () => editor.chain().focus().mergeCells().run()       },
    { label: "Split cell",         fn: () => editor.chain().focus().splitCell().run()        },
    null,
    { label: "Delete table",       fn: () => editor.chain().focus().deleteTable().run(),  danger: true },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title={inTable ? "Table options" : "Insert table"}
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="p-2 rounded-md transition-all flex items-center gap-0.5"
        style={inTable ? { background: "rgba(58,94,255,0.12)", color: "#3A5EFF" } : { color: "var(--text-faint)" }}
        onMouseEnter={(e) => { if (!inTable) { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; } }}
        onMouseLeave={(e) => { if (!inTable) { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
      >
        <TableIcon className="w-4 h-4" />
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-xl shadow-2xl overflow-hidden"
          style={{ top: "calc(100% + 6px)", left: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)" }}
        >
          {!inTable ? (
            <div style={{ padding: 12 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-disabled)", marginBottom: 8 }}>Insert table</p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4 }}>
                {Array.from({ length: ROWS * COLS }, (_, i) => {
                  const r = Math.floor(i / COLS) + 1;
                  const c = (i % COLS) + 1;
                  const isHov = hovered ? r <= hovered[0] && c <= hovered[1] : false;
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHovered([r, c])}
                      onMouseLeave={() => setHovered(null)}
                      onMouseDown={(e) => { e.preventDefault(); insertTable(r, c); }}
                      style={{
                        width: 24, height: 24, borderRadius: "var(--radius-sm)", border: "1px solid",
                        cursor: "pointer", transition: "all 80ms",
                        background: isHov ? "rgba(58,94,255,0.18)" : "var(--bg-hover)",
                        borderColor: isHov ? "rgba(58,94,255,0.4)" : "var(--border-subtle)",
                      }}
                    />
                  );
                })}
              </div>
              {hovered ? (
                <p style={{ fontSize: 10, color: "#3A5EFF", marginTop: 8, fontWeight: 500, textAlign: "center" }}>{hovered[0]} × {hovered[1]} table</p>
              ) : (
                <p style={{ fontSize: 10, color: "var(--text-disabled)", marginTop: 8, textAlign: "center" }}>Hover to select size</p>
              )}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertTable(3, 3); }}
                className="w-full text-xs rounded-lg"
                style={{ marginTop: 8, padding: "6px", color: "var(--text-muted)", background: "transparent", border: "1px solid var(--border-subtle)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3A5EFF"; (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >Quick insert 3×3</button>
            </div>
          ) : (
            <div style={{ paddingTop: 6, paddingBottom: 6, width: 176 }}>
              <p style={{ padding: "4px 12px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-disabled)" }}>Table options</p>
              {tableActions.map((a, i) =>
                a === null ? (
                  <div key={i} style={{ margin: "4px 0", height: 1, background: "var(--border-subtle)" }} />
                ) : (
                  <button
                    key={a.label}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); a.fn(); setOpen(false); }}
                    className="w-full text-left"
                    style={{ padding: "6px 12px", fontSize: 12, border: "none", cursor: "pointer", background: "transparent", color: (a as any).danger ? "var(--danger)" : "var(--text-muted)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = (a as any).danger ? "var(--danger-bg)" : "var(--bg-hover)"; if (!(a as any).danger) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = (a as any).danger ? "var(--danger)" : "var(--text-muted)"; }}
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
    setOpen(false); setUrl("");
  };

  const remove = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false); setUrl("");
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <Btn onMouseDown={openPopover} active={isActive} title={isActive ? "Edit link" : "Insert link"}>
        <Link2 className="w-4 h-4" />
      </Btn>
      {open && (
        <div
          className="absolute z-50 rounded-xl shadow-2xl"
          style={{ top: "calc(100% + 6px)", right: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", padding: 12, width: 288 }}
        >
          <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-disabled)", marginBottom: 10 }}>
            {isActive ? "Edit Link" : "Insert Link"}
          </p>
          <div className="flex items-center gap-2 rounded-lg" style={{ padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-disabled)" }} />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } if (e.key === "Escape") setOpen(false); }}
              placeholder="https://example.com"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-sans)", minWidth: 0 }}
            />
            {url && (
              <button type="button" onMouseDown={(e) => { e.preventDefault(); setUrl(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-disabled)", display: "flex", padding: 0 }}>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); apply(); }}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white rounded-lg"
              style={{ padding: "6px", background: "#3A5EFF", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#4a6aff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#3A5EFF"; }}
            >
              <Check className="w-4 h-4" />{isActive ? "Update" : "Apply"}
            </button>
            {isActive && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); remove(); }}
                className="flex items-center gap-1.5 text-xs rounded-lg"
                style={{ padding: "6px 12px", color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X className="w-4 h-4" />Remove
              </button>
            )}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setOpen(false); }}
              className="text-xs rounded-lg"
              style={{ padding: "6px 12px", color: "var(--text-faint)", background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color / Highlight menu ───────────────────────────────────────────────────

const TEXT_COLORS = [
  { label: "Brand",   value: "#3A5EFF" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Rose",    value: "#f43f5e" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Gray",    value: "#71717a" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green",  value: "#bbf7d0" },
  { label: "Blue",   value: "#bfdbfe" },
  { label: "Pink",   value: "#fbcfe8" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Red",    value: "#fecaca" },
  { label: "Gray",   value: "#e5e7eb" },
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
      <button
        type="button"
        title="Text color / highlight"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="flex items-center gap-0.5 p-2 rounded-md sv-btn-ghost transition-all"
      >
        <div className="flex flex-col items-center gap-0.5">
          <Type className="w-4 h-4" />
          <div className="flex items-center gap-0.5">
            <div className="w-2.5 h-1 rounded-sm" style={{ background: currentColor || "var(--text-muted)", border: "1px solid var(--border-subtle)" }} />
            <div className="w-2.5 h-1 rounded-sm" style={{ background: currentHighlight || "transparent", border: "1px solid var(--border-subtle)" }} />
          </div>
        </div>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-xl shadow-2xl"
          style={{ top: "calc(100% + 6px)", left: 0, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", padding: 8, width: 176 }}
        >
          <div className="flex gap-1" style={{ marginBottom: 10, padding: 2, borderRadius: "var(--radius-lg)", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
            {(["text", "highlight"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setTab(t); }}
                className="flex-1 text-[10px] py-1 rounded-md capitalize font-medium"
                style={{
                  border: "none", cursor: "pointer",
                  background: tab === t ? "var(--bg-active)" : "transparent",
                  color: tab === t ? "var(--text-secondary)" : "var(--text-faint)",
                }}
              >
                {t === "text" ? "Color" : "Highlight"}
              </button>
            ))}
          </div>
          {tab === "text" ? (
            <>
              <div className="grid grid-cols-4 gap-1.5" style={{ marginBottom: 8 }}>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.label} type="button" title={c.label}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(c.value).run(); setOpen(false); }}
                    className="w-8 h-8 rounded-lg border-2 transition-all"
                    style={{ background: c.value, cursor: "pointer", borderColor: currentColor === c.value ? "#3A5EFF" : "var(--border-subtle)", transform: currentColor === c.value ? "scale(1.1)" : undefined }}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); setOpen(false); }}
                className="w-full flex items-center gap-2 rounded-lg text-xs"
                style={{ padding: "6px 8px", background: "transparent", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X className="w-3 h-3" style={{ color: "var(--text-disabled)" }} />Reset to default
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-1.5" style={{ marginBottom: 8 }}>
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.label} type="button" title={c.label}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHighlight({ color: c.value }).run(); setOpen(false); }}
                    className="w-8 h-8 rounded-lg border-2 transition-all"
                    style={{ background: c.value, cursor: "pointer", borderColor: currentHighlight === c.value ? "#3A5EFF" : "var(--border-subtle)", transform: currentHighlight === c.value ? "scale(1.1)" : undefined }}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); setOpen(false); }}
                className="w-full flex items-center gap-2 rounded-lg text-xs"
                style={{ padding: "6px 8px", background: "transparent", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X className="w-3 h-3" style={{ color: "var(--text-disabled)" }} />Remove highlight
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main toolbar ─────────────────────────────────────────────────────────────
// No sticky/background/border here — all owned by NotesEditor's wrapper div
// so paddingInline matches the editor content exactly.

interface EditorToolbarProps {
  editor: Editor;
  onOpenImageModal?: () => void;
}

export default function EditorToolbar({ editor, onOpenImageModal }: EditorToolbarProps) {
  return (
    <div
      className="flex items-center flex-wrap"
      style={{
        // gap: 2px between buttons, groups separated by Sep (which has margin: 0 6px)
        gap: 3,
        paddingTop: 9,
        paddingBottom: 9,
      }}
    >
      {/* ── Undo / Redo ── */}
      <Btn onMouseDown={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"><Undo className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"><Redo className="w-4 h-4" /></Btn>

      <Sep />

      {/* ── Block type ── */}
      <BlockSelect editor={editor} />

      <Sep />

      {/* ── Inline marks ── */}
      <Btn onMouseDown={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}      title="Bold (Ctrl+B)">      <Bold          className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}    title="Italic (Ctrl+I)">    <Italic        className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"> <UnderlineIcon className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}    title="Strikethrough">      <Strikethrough className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive("code")}      title="Inline code">        <Code          className="w-4 h-4" /></Btn>

      <Sep />

      {/* ── Color / highlight ── */}
      <ColorMenu editor={editor} />

      <Sep />

      {/* ── Alignment ── */}
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("left").run()}    active={editor.isActive({ textAlign: "left" })}    title="Align left">    <AlignLeft    className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("center").run()}  active={editor.isActive({ textAlign: "center" })}  title="Align center">  <AlignCenter  className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("right").run()}   active={editor.isActive({ textAlign: "right" })}   title="Align right">   <AlignRight   className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">        <AlignJustify className="w-4 h-4" /></Btn>

      <Sep />

      {/* ── Lists ── */}
      <Btn onMouseDown={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}  title="Bullet list">  <List        className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list"> <ListOrdered className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive("taskList")}    title="Task list">    <CheckSquare className="w-4 h-4" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive("blockquote")}  title="Blockquote">   <Quote       className="w-4 h-4" /></Btn>

      <Sep />

      {/* ── Indent / Outdent ── */}
      <Btn onMouseDown={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")} title="Indent">
        <span className="text-[11px] font-bold leading-none">→</span>
      </Btn>
      <Btn onMouseDown={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")} title="Outdent">
        <span className="text-[11px] font-bold leading-none">←</span>
      </Btn>

      <Sep />

      {/* ── Rich inserts ── */}
      <LinkPopover editor={editor} />
      <CodeBlockMenu editor={editor} onOpenImageModal={onOpenImageModal ?? (() => {})} />
      <TableMenu editor={editor} />

      {onOpenImageModal && (
        <Btn onMouseDown={() => onOpenImageModal()} title="Insert image" active={editor.isActive("image")}>
          <ImageIcon className="w-4 h-4" />
        </Btn>
      )}

      <Btn onMouseDown={() => editor.chain().focus().setHorizontalRule().run()} title="Divider line">
        <Minus className="w-4 h-4" />
      </Btn>

      <Sep />

      {/* ── Clear formatting ── */}
      <Btn onMouseDown={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
        <RemoveFormatting className="w-4 h-4" />
      </Btn>
    </div>
  );
}