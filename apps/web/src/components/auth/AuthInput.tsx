"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:       string;
  error?:      string;
  isPassword?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, isPassword, className, type, ...props }, ref) => {
    const [showPwd, setShowPwd] = useState(false);

    return (
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-widest text-[var(--text-disabled)] font-medium">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPwd ? "text" : "password") : type}
            {...props}
            className={[
              "w-full px-3 py-2.5 rounded-lg text-sm",
              "bg-[var(--bg-input)] border",
              "text-[var(--text-secondary)]",
              "placeholder:text-[var(--text-disabled)]",
              "outline-none transition-colors duration-100",
              error
                ? "border-[rgba(239,68,68,0.4)] focus:border-[rgba(239,68,68,0.7)]"
                : "border-[var(--border-subtle)] focus:border-[var(--border-medium)]",
              isPassword ? "pr-10" : "",
              className ?? "",
            ].join(" ")}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] hover:text-[var(--text-faint)] transition-colors"
            >
              {showPwd
                ? <EyeOff className="w-3.5 h-3.5" />
                : <Eye    className="w-3.5 h-3.5" />
              }
            </button>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-400 leading-snug">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;