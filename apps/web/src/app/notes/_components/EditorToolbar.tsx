"use client";

import { useRef, useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Code, Link2, RemoveFormatting, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote,
  Undo, Redo, Minus, ChevronDown, Type,
  Table as TableIcon, Check, X, ExternalLink,
  Heading1, Heading2, Heading3, Type as TypeIcon,
  Code2,
} from "lucide-react";

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
          : "text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-[var(--border-subtle)] mx-0.5 shrink-0" />;
}

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

  const active =
    editor.isActive("heading", { level: 1 }) ? "h1"    :
    editor.isActive("heading", { level: 2 }) ? "h2"    :
    editor.isActive("heading", { level: 3 }) ? "h3"    :
    editor.isActive("blockquote")            ? "quote" :
    editor.isActive("codeBlock")             ? "code"  : "p";

  const current = BLOCK_OPTIONS.find((o) => o.value === active)!;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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
        className="flex items-center gap-1.5 h-7 px-2.5 hover:bg-[var(--bg-hover)] rounded-md text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-all"
      >
        <current.icon className="w-3.5 h-3.5" />
        <span className="max-w-[72px] truncate hidden sm:block">{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--text-disabled)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl py-1.5 shadow-2xl w-48">
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-medium uppercase tracking-widest text-[var(--text-disabled)]">
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
                  isActive ? "bg-[var(--bg-hover)]" : "hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "text-[#3A5EFF]" : "text-[var(--text-faint)] group-hover:text-[var(--text-muted)]"
                }`}>
                  <opt.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm leading-tight ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                    {opt.label}
                  </div>
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

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url,  setUrl]  = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ref      = useRef<HTMLDivElement>(null);
  const isActive = editor.isActive("link");

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const openPopover = () => {
    const existing = editor.getAttributes("link").href ?? "";
    setUrl(existing);
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

  const remove = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
    setUrl("");
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <Btn onMouseDown={openPopover} active={isActive} title={isActive ? "Edit link" : "Insert link"}>
        <Link2 className="w-3.5 h-3.5" />
      </Btn>

      {open && (
        <div className="absolute top-full right-0 mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl p-3 shadow-2xl w-68">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-disabled)] mb-2.5">
            {isActive ? "Edit Link" : "Insert Link"}
          </p>
          <div className="flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 focus-within:border-[#3A5EFF]/30 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-disabled)] shrink-0" />
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
              className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-disabled)] outline-none min-w-0"
            />
            {url && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setUrl(""); }}
                className="text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
              >
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
                className="flex items-center justify-center gap-1.5 text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/[0.06] rounded-lg px-3 py-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setOpen(false); }}
              className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded-lg px-3 py-1.5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TEXT_COLORS = [
  { label: "Default", value: ""         },
  { label: "Blue",    value: "#3A5EFF"  },
  { label: "Green",   value: "#22c55e"  },
  { label: "Amber",   value: "#f59e0b"  },
  { label: "Red",     value: "#ef4444"  },
  { label: "Purple",  value: "#a855f7"  },
  { label: "Gray",    value: "#71717a"  },
];
const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green",  value: "#bbf7d0" },
  { label: "Blue",   value: "#bfdbfe" },
  { label: "Pink",   value: "#fbcfe8" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Orange", value: "#fed7aa" },
];

function ColorMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<"text" | "highlight">("text");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title="Text color / highlight"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-0.5"
      >
        <Type className="w-3.5 h-3.5" />
        <ChevronDown className="w-2.5 h-2.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl p-2 shadow-2xl w-40">
          <div className="flex gap-1 mb-2">
            {(["text", "highlight"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setTab(t); }}
                className={`flex-1 text-[10px] py-1 rounded-md transition-all capitalize ${
                  tab === t
                    ? "bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                    : "text-[var(--text-faint)] hover:text-[var(--text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "text" ? (
            <div className="space-y-0.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (c.value) { editor.chain().focus().setColor(c.value).run(); }
                    else         { editor.chain().focus().unsetColor().run(); }
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs text-[var(--text-muted)] transition-all"
                >
                  <span className="w-3 h-3 rounded-full border border-[var(--border-default)] shrink-0" style={{ background: c.value || "var(--text-muted)" }} />
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs text-[var(--text-muted)] transition-all"
              >
                <span className="w-3 h-3 rounded-full border border-[var(--border-default)] bg-transparent shrink-0" />
                None
              </button>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHighlight({ color: c.value }).run(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs text-[var(--text-muted)] transition-all"
                >
                  <span className="w-3 h-3 rounded-full border border-[var(--border-default)] shrink-0" style={{ background: c.value }} />
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TableMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const inTable = editor.isActive("table");

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const actions = [
    { label: "Add column before", fn: () => editor.chain().focus().addColumnBefore().run() },
    { label: "Add column after",  fn: () => editor.chain().focus().addColumnAfter().run()  },
    { label: "Delete column",     fn: () => editor.chain().focus().deleteColumn().run()     },
    { label: "Add row before",    fn: () => editor.chain().focus().addRowBefore().run()     },
    { label: "Add row after",     fn: () => editor.chain().focus().addRowAfter().run()      },
    { label: "Delete row",        fn: () => editor.chain().focus().deleteRow().run()        },
    { label: "Toggle header row", fn: () => editor.chain().focus().toggleHeaderRow().run()  },
    { label: "Merge cells",       fn: () => editor.chain().focus().mergeCells().run()       },
    { label: "Split cell",        fn: () => editor.chain().focus().splitCell().run()        },
    { label: "Delete table",      fn: () => editor.chain().focus().deleteTable().run(), danger: true },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        title={inTable ? "Table options" : "Insert table"}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!inTable) { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); }
          else setOpen((o) => !o);
        }}
        className={`p-1.5 rounded-md transition-all flex items-center gap-0.5 ${
          inTable
            ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
            : "text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
        }`}
      >
        <TableIcon className="w-3.5 h-3.5" />
        {inTable && <ChevronDown className="w-2.5 h-2.5" />}
      </button>

      {open && inTable && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-xl py-1.5 shadow-2xl w-44">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); a.fn(); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-all hover:bg-[var(--bg-hover)] ${
                ("danger" in a && a.danger)
                  ? "text-red-400/70 hover:text-red-300"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
      <Btn onMouseDown={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
        <Undo className="w-3.5 h-3.5" />
      </Btn>
      <Btn onMouseDown={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
        <Redo className="w-3.5 h-3.5" />
      </Btn>
      <Sep />

      <BlockSelect editor={editor} />
      <Sep />

      <Btn onMouseDown={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}      title="Bold (Ctrl+B)">      <Bold          className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}    title="Italic (Ctrl+I)">    <Italic        className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"> <UnderlineIcon className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}    title="Strikethrough">      <Strikethrough className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive("code")}      title="Inline code">        <Code          className="w-3.5 h-3.5" /></Btn>
      <Sep />

      <ColorMenu editor={editor} />
      <Btn onMouseDown={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()} active={editor.isActive("highlight")} title="Quick highlight">
        <Highlighter className="w-3.5 h-3.5" />
      </Btn>
      <Sep />

      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("left").run()}    active={editor.isActive({ textAlign: "left" })}    title="Align left">    <AlignLeft    className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("center").run()}  active={editor.isActive({ textAlign: "center" })}  title="Align center">  <AlignCenter  className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("right").run()}   active={editor.isActive({ textAlign: "right" })}   title="Align right">   <AlignRight   className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">        <AlignJustify className="w-3.5 h-3.5" /></Btn>
      <Sep />

      <Btn onMouseDown={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}  title="Bullet list">   <List        className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">  <ListOrdered className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive("taskList")}    title="Task list">     <CheckSquare className="w-3.5 h-3.5" /></Btn>
      <Btn onMouseDown={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive("blockquote")}  title="Blockquote">    <Quote       className="w-3.5 h-3.5" /></Btn>
      <Sep />

      <Btn onMouseDown={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")} title="Indent">
        <span className="text-[11px] font-bold leading-none">→</span>
      </Btn>
      <Btn onMouseDown={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")} title="Outdent">
        <span className="text-[11px] font-bold leading-none">←</span>
      </Btn>
      <Sep />

      <LinkPopover editor={editor} />
      <TableMenu editor={editor} />
      <Btn onMouseDown={() => editor.chain().focus().setHorizontalRule().run()} title="Divider line">
        <Minus className="w-3.5 h-3.5" />
      </Btn>
      <Sep />

      <Btn onMouseDown={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
        <RemoveFormatting className="w-3.5 h-3.5" />
      </Btn>
    </div>
  );
}