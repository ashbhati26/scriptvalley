"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import AuthInput    from "./AuthInput";
import GoogleButton from "./GoogleButton";
import { useAuthModal } from "@/components/providers/AuthModalProvider";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { close, switchMode }           = useAuthModal();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async function handleGoogle() {
    if (!isLoaded) return;
    setGoogleLoad(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy:            "oauth_google",
        redirectUrl:         "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch {
      setErrors({ root: "Google sign-in failed. Please try again." });
      setGoogleLoad(false);
    }
  }

  // ── Email + password ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    const errs: Record<string, string> = {};
    if (!email.trim())    errs.email    = "Email is required";
    if (!password.trim()) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        close(); // ← stay on same page, just close modal
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { code?: string; message?: string }[] };
      const code = clerkErr?.errors?.[0]?.code;
      if (code === "form_identifier_not_found") {
        setErrors({ email: "No account found with this email" });
      } else if (code === "form_password_incorrect") {
        setErrors({ password: "Incorrect password" });
      } else {
        setErrors({ root: clerkErr?.errors?.[0]?.message ?? "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* Root error */}
      {errors.root && (
        <div className="px-3 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-border)]">
          <p className="text-xs text-red-400">{errors.root}</p>
        </div>
      )}

      {/* Google */}
      <GoogleButton onClick={handleGoogle} loading={googleLoad} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">or</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />
        <AuthInput
          label="Password"
          isPassword
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
          error={errors.password}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading || googleLoad}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* Switch to sign up */}
      <p className="text-xs text-center text-[var(--text-faint)]">
        Don&apos;t have an account?{" "}
        <button
          onClick={switchMode}
          className="text-[var(--brand)] hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}