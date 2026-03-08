"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Code, Link2, RemoveFormatting, Highlighter,
} from "lucide-react";
import EditorSlashMenu from "./EditorSlashMenu";
import EditorToolbar from "./EditorToolbar";

interface NotesEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function InlineBubbleMenu({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { from, to, empty } = editor.state.selection;
      if (empty) { setPos(null); return; }
      const start  = editor.view.coordsAtPos(from);
      const end    = editor.view.coordsAtPos(to);
      const parent = editor.view.dom.closest(".relative") as HTMLElement | null;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const midX = (start.left + end.left) / 2;
      setPos({
        top:  start.top - rect.top  - 46,
        left: midX      - rect.left - 130,
      });
    };
    editor.on("selectionUpdate", update);
    editor.on("transaction",     update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction",     update);
    };
  }, [editor]);

  if (!editor || !pos) return null;

  const items = [
    { icon: Bold,          fn: () => editor.chain().focus().toggleBold().run(),                          active: editor.isActive("bold"),      title: "Bold"      },
    { icon: Italic,        fn: () => editor.chain().focus().toggleItalic().run(),                        active: editor.isActive("italic"),    title: "Italic"    },
    { icon: UnderlineIcon, fn: () => editor.chain().focus().toggleUnderline().run(),                     active: editor.isActive("underline"), title: "Underline" },
    { icon: Strikethrough, fn: () => editor.chain().focus().toggleStrike().run(),                        active: editor.isActive("strike"),    title: "Strike"    },
    { icon: Code,          fn: () => editor.chain().focus().toggleCode().run(),                          active: editor.isActive("code"),      title: "Code"      },
    { icon: Highlighter,   fn: () => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run(), active: editor.isActive("highlight"), title: "Highlight" },
  ];

  return (
    <div
      ref={ref}
      className="absolute z-50 flex items-center gap-0.5 bg-(--bg-elevated) border border-(--border-medium) rounded-lg px-2 py-1.5 shadow-2xl pointer-events-auto"
      style={{ top: pos.top, left: Math.max(8, pos.left) }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {items.map(({ icon: Icon, fn, active, title }) => (
        <button
          key={title}
          type="button"
          title={title}
          onMouseDown={(e) => { e.preventDefault(); fn(); }}
          className={`p-1.5 rounded-md transition-all ${
            active
              ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
              : "text-(--text-faint) hover:text-(--text-primary) hover:bg-(--bg-hover)"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
      <div className="w-px h-4 bg-(--border-subtle) mx-0.5" />
      <button
        type="button"
        title="Link"
        onMouseDown={(e) => {
          e.preventDefault();
          if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); return; }
          const url = window.prompt("URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`p-1.5 rounded-md transition-all ${
          editor.isActive("link")
            ? "bg-[#3A5EFF]/15 text-[#3A5EFF]"
            : "text-(--text-faint) hover:text-(--text-primary) hover:bg-(--bg-hover)"
        }`}
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-(--border-subtle) mx-0.5" />
      <button
        type="button"
        title="Clear formatting"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}
        className="p-1.5 rounded-md text-(--text-faint) hover:text-(--text-primary) hover:bg-(--bg-hover) transition-all"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function NotesEditor({ content, onChange }: NotesEditorProps) {
  const [slashOpen,  setSlashOpen]  = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashPos,   setSlashPos]   = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#3A5EFF] no-underline hover:underline cursor-pointer" },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Heading";
          return "Type '/' for commands, or start writing…";
        },
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass:   "is-empty",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: [
          "outline-none min-h-full px-7 md:px-14 py-8 scrollbar-hide max-w-3xl",
          // Base text — theme-aware
          "text-sm text-(--text-secondary) leading-7",
          // Headings — theme-aware
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-(--text-primary) [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:tracking-tight",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-(--text-primary) [&_h2]:mt-7 [&_h2]:mb-2.5",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-(--text-secondary) [&_h3]:mt-5 [&_h3]:mb-1.5",
          // Paragraph
          "[&_p]:my-1.5 [&_p]:text-(--text-secondary) [&_p]:leading-7",
          // Lists
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5",
          "[&_li]:my-0.5 [&_li]:text-(--text-secondary)",
          // Task list
          "[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0",
          "[&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2 [&_li[data-type=taskItem]]:my-1",
          "[&_li[data-type=taskItem]>label]:flex [&_li[data-type=taskItem]>label]:items-center [&_li[data-type=taskItem]>label]:pt-0.5",
          "[&_li[data-type=taskItem]>label>input[type=checkbox]]:accent-[#3A5EFF] [&_li[data-type=taskItem]>label>input[type=checkbox]]:w-3.5 [&_li[data-type=taskItem]>label>input[type=checkbox]]:h-3.5 [&_li[data-type=taskItem]>label>input[type=checkbox]]:cursor-pointer",
          "[&_li[data-type=taskItem][data-checked=true]>div]:line-through [&_li[data-type=taskItem][data-checked=true]>div]:text-(--text-disabled)",
          // Blockquote — brand blue accent kept intentionally
          "[&_blockquote]:border-l-[3px] [&_blockquote]:border-[#3A5EFF]/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-(--text-muted) [&_blockquote]:italic",
          // Inline code — brand color for text, surface-aware bg
          "[&_code]:bg-(--bg-input) [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[#3A5EFF] [&_code]:text-xs [&_code]:font-mono",
          // Code block — elevated surface, surface-aware
          "[&_pre]:bg-(--bg-elevated) [&_pre]:border [&_pre]:border-(--border-subtle) [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto",
          "[&_pre_code]:bg-transparent [&_pre_code]:text-(--text-faint) [&_pre_code]:p-0 [&_pre_code]:text-xs",
          // Links
          "[&_a]:text-[#3A5EFF] [&_a]:no-underline [&_a]:hover:underline",
          // Images
          "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4 [&_img]:border [&_img]:border-(--border-subtle)",
          // Table
          "[&_table]:border-collapse [&_table]:w-full [&_table]:my-4",
          "[&_td]:border [&_td]:border-(--border-subtle) [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-(--text-secondary) [&_td]:align-top",
          "[&_th]:border [&_th]:border-(--border-subtle) [&_th]:px-3 [&_th]:py-2 [&_th]:bg-(--bg-input) [&_th]:text-xs [&_th]:font-semibold [&_th]:text-(--text-muted)",
          // HR
          "[&_hr]:border-(--border-subtle) [&_hr]:my-6",
          // Placeholder
          "[&_.is-editor-empty:first-child::before]:text-(--text-disabled)",
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.is-editor-empty:first-child::before]:float-left",
          "[&_.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.is-editor-empty:first-child::before]:h-0",
          "[&_.is-empty::before]:text-(--text-disabled)",
          "[&_.is-empty::before]:content-[attr(data-placeholder)]",
          "[&_.is-empty::before]:float-left",
          "[&_.is-empty::before]:pointer-events-none",
          "[&_.is-empty::before]:h-0",
        ].join(" "),
      },
      handleKeyDown(view, event) {
        if (event.key === "/") {
          setTimeout(() => {
            const { from }   = view.state.selection;
            const coords     = view.coordsAtPos(from);
            const editorRect = editorRef.current?.getBoundingClientRect();
            if (!editorRect) return;
            setSlashPos({
              top:  coords.bottom - editorRect.top  + 4,
              left: coords.left   - editorRect.left,
            });
            setSlashQuery("");
            setSlashOpen(true);
          }, 0);
        }
        if (event.key === "Escape") setSlashOpen(false);
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor || !slashOpen) return;
    const handler = () => {
      const { $from } = editor.state.selection;
      const text = $from.nodeBefore?.text ?? "";
      const slashIdx = text.lastIndexOf("/");
      if (slashIdx === -1) { setSlashOpen(false); return; }
      setSlashQuery(text.slice(slashIdx + 1));
    };
    editor.on("update", handler);
    return () => { editor.off("update", handler); };
  }, [editor, slashOpen]);

  useEffect(() => {
    if (!editor) return;
    const incoming = content || "";
    if (incoming !== editor.getHTML()) editor.commands.setContent(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  const execSlashCommand = (cmd: string) => {
    const { from } = editor.state.selection;
    const deleteLen = slashQuery.length + 1;
    editor.chain().focus().deleteRange({ from: from - deleteLen, to: from }).run();
    switch (cmd) {
      case "h1":      editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
      case "h2":      editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
      case "h3":      editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
      case "bullet":  editor.chain().focus().toggleBulletList().run();          break;
      case "ordered": editor.chain().focus().toggleOrderedList().run();         break;
      case "todo":    editor.chain().focus().toggleTaskList().run();            break;
      case "quote":   editor.chain().focus().toggleBlockquote().run();         break;
      case "code":    editor.chain().focus().toggleCodeBlock().run();           break;
      case "divider": editor.chain().focus().setHorizontalRule().run();        break;
      case "table":   editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
      case "image": {
        const url = window.prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
        break;
      }
    }
    setSlashOpen(false);
  };

  return (
    <div className="flex flex-col rounded-none overflow-visible">
      <EditorToolbar editor={editor} />
      <div className="relative" ref={editorRef}>
        <EditorContent editor={editor} />
        <InlineBubbleMenu editor={editor} />
        {slashOpen && (
          <EditorSlashMenu
            query={slashQuery}
            position={slashPos}
            onSelect={execSlashCommand}
            onClose={() => setSlashOpen(false)}
          />
        )}
      </div>
    </div>
  );
}