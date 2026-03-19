"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import AuthInput    from "./AuthInput";
import GoogleButton from "./GoogleButton";
import { useAuthModal } from "@/components/providers/AuthModalProvider";

type Step = "form" | "verify";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { close, switchMode }           = useAuthModal();

  const [step,       setStep]       = useState<Step>("form");
  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [code,       setCode]       = useState("");
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async function handleGoogle() {
    if (!isLoaded) return;
    setGoogleLoad(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy:            "oauth_google",
        redirectUrl:         "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch {
      setErrors({ root: "Google sign-up failed. Please try again." });
      setGoogleLoad(false);
    }
  }

  // ── Step 1: create account ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    const errs: Record<string, string> = {};
    if (!firstName.trim())    errs.firstName = "First name is required";
    if (!email.trim())        errs.email     = "Email is required";
    if (password.length < 8)  errs.password  = "Password must be at least 8 characters";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});

    try {
      await signUp.create({
        firstName:    firstName.trim(),
        lastName:     lastName.trim() || undefined,
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { code?: string; message?: string }[] };
      const code = clerkErr?.errors?.[0]?.code;
      if (code === "form_identifier_exists") {
        setErrors({ email: "An account with this email already exists" });
      } else if (code === "form_password_pwned") {
        setErrors({ password: "This password is too common. Please choose a stronger one." });
      } else {
        setErrors({ root: clerkErr?.errors?.[0]?.message ?? "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify email code ─────────────────────────────────────────────
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    if (!code.trim()) { setErrors({ code: "Verification code is required" }); return; }

    setLoading(true);
    setErrors({});

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        close(); // ← stay on same page, just close modal
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { code?: string; message?: string }[] };
      const errCode = clerkErr?.errors?.[0]?.code;
      if (errCode === "form_code_incorrect") {
        setErrors({ code: "Incorrect code — check your email and try again" });
      } else if (errCode === "verification_expired") {
        setErrors({ code: "Code expired — go back and request a new one" });
      } else {
        setErrors({ root: clerkErr?.errors?.[0]?.message ?? "Verification failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch {
      setErrors({ root: "Could not resend code. Please try again." });
    }
  }

  // ── Verify step ───────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Back
        </button>

        <div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Check your email</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">
            We sent a 6-digit code to{" "}
            <span className="text-[var(--text-secondary)] font-medium">{email}</span>
          </p>
        </div>

        {errors.root && (
          <div className="px-3 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-border)]">
            <p className="text-xs text-red-400">{errors.root}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-3" noValidate>
          <AuthInput
            label="Verification code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => { setCode(e.target.value); setErrors({}); }}
            error={errors.code}
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--text-faint)]">
          Didn&apos;t receive it?{" "}
          <button onClick={handleResend} className="text-[var(--brand)] hover:underline font-medium">
            Resend code
          </button>
        </p>
      </div>
    );
  }

  // ── Form step ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {errors.root && (
        <div className="px-3 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-border)]">
          <p className="text-xs text-red-400">{errors.root}</p>
        </div>
      )}

      <GoogleButton onClick={handleGoogle} loading={googleLoad} label="Sign up with Google" />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">or</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <AuthInput
            label="First name"
            type="text"
            placeholder="Alex"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
            error={errors.firstName}
            autoComplete="given-name"
            autoFocus
          />
          <AuthInput
            label="Last name"
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          isPassword
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
          error={errors.password}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading || googleLoad}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-[10px] text-center text-[var(--text-disabled)] leading-relaxed">
          By continuing you agree to our Terms and Privacy Policy
        </p>
      </form>

      {/* Switch to sign in */}
      <p className="text-xs text-center text-[var(--text-faint)]">
        Already have an account?{" "}
        <button
          onClick={switchMode}
          className="text-[var(--brand)] hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}