"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { STATUS_META } from "../DSASheetBuilder/sheetTypes";

// ─── StatusChip ──────────────────────────────────────────────────────────────
export function StatusChip({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span
      className="inline-flex items-center font-medium uppercase rounded-full whitespace-nowrap"
      style={{
        fontSize:      size === "md" ? "11px" : "10px",
        letterSpacing: "0.04em",
        padding:       size === "md" ? "2px 8px" : "1px 6px",
        lineHeight:    1.6,
        border:        `1px solid ${m.border}`,
        color:         m.color,
        background:    m.bg,
      }}
    >
      {m.label}
    </span>
  );
}

// ─── FieldLabel ──────────────────────────────────────────────────────────────
export function FieldLabel({
  icon: Icon, children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5 select-none sv-section-label">
      <Icon size={10} />
      {children}
    </label>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle }: {
  eyebrow: string; title: string; subtitle?: string;
}) {
  return (
    <div>
      <p className="sv-section-label mb-1">{eyebrow}</p>
      <h2 className="text-xl font-semibold sv-text-primary mb-0.5" style={{ letterSpacing: "-0.015em" }}>{title}</h2>
      {subtitle && <p className="text-[13px] sv-text-faint" style={{ lineHeight: 1.55 }}>{subtitle}</p>}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon: Icon, label, action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center" style={{ padding: "52px 24px" }}>
      <div
        className="sv-icon-badge sv-bg-elevated flex items-center justify-center"
        style={{ width: 38, height: 38, border: "1px solid var(--border-subtle)" }}
      >
        <Icon size={15} className="sv-text-disabled" />
      </div>
      <p className="text-[14px] sv-text-faint">{label}</p>
      {action}
    </div>
  );
}

// ─── Loader ──────────────────────────────────────────────────────────────────
export function Loader() {
  return (
    <div className="flex justify-center" style={{ padding: 48 }}>
      <div className="sv-spinner sv-spinner-md" />
    </div>
  );
}

// ─── ConfirmDeleteButton ─────────────────────────────────────────────────────
export function ConfirmDeleteButton({ onConfirm, label = "Delete" }: { onConfirm: () => void; label?: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => { onConfirm(); setConfirming(false); }}
          className="sv-btn-primary text-[11px] font-medium"
          style={{ padding: "3px 10px", borderRadius: "var(--radius-md)", background: "var(--danger)" }}
        >
          {label}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[11px] sv-text-muted sv-bg-hover cursor-pointer sv-rounded-md"
          style={{ padding: "3px 10px", border: "1px solid var(--border-subtle)" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="sv-btn-danger inline-flex items-center gap-1.5 text-[12px]"
      style={{ padding: "3px 8px" }}
    >
      <Trash2 size={11} />
      {label}
    </button>
  );
}

// ─── useDragSort ─────────────────────────────────────────────────────────────
export function useDragSort<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragging = useRef<number | null>(null);
  const lastSwap = useRef(0);
  return {
    handleDragStart: (idx: number) => { dragging.current = idx; },
    handleDragOver: (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragging.current === null || dragging.current === idx) return;
      if (Date.now() - lastSwap.current < 60) return;
      const next = [...items];
      const [item] = next.splice(dragging.current, 1);
      next.splice(idx, 0, item);
      dragging.current = idx;
      lastSwap.current = Date.now();
      onReorder(next);
    },
    handleDragEnd: () => { dragging.current = null; },
  };
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", onClick, style = {} }: {
  children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties;
}) {
  return (
    <div onClick={onClick} className={`${onClick ? "sv-card-hover" : "sv-card"} ${className}`} style={style}>
      {children}
    </div>
  );
}
export const LinearCard = Card;
export const AppleCard  = Card;

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = "primary", size = "md", disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg"; disabled?: boolean; className?: string;
}) {
  const sizeStyle =
    size === "sm" ? { fontSize: "12px", padding: "4px 10px", borderRadius: "100px" } :
    size === "lg" ? { fontSize: "14px", padding: "8px 18px", borderRadius: "var(--radius-lg)" } :
                   { fontSize: "13px", padding: "6px 14px", borderRadius: "var(--radius-md)" };

  const variantClass =
    variant === "primary"   ? "sv-btn-primary"   :
    variant === "secondary" ? "sv-btn-secondary"  :
    variant === "danger"    ? "sv-btn-danger"     :
                              "sv-btn-ghost";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${variantClass} ${disabled ? "opacity-45 cursor-not-allowed" : ""} ${className}`}
      style={{ letterSpacing: "-0.01em", ...sizeStyle }}
    >
      {children}
    </button>
  );
}
export const LinearButton = Button;
export const AppleButton  = Button;

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, disabled, type = "text", className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  disabled?: boolean; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`sv-input ${className}`}
      style={{ height: 34, padding: "0 10px", letterSpacing: "-0.01em" }}
    />
  );
}
export const LinearInput = Input;
export const AppleInput  = Input;