"use client";

// Place at: app/sso-callback/page.tsx
// Clerk redirects here after Google OAuth completes.
// AuthenticateWithRedirectCallback finishes the token exchange automatically.

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-5 h-5 text-[var(--text-disabled)] animate-spin" />
        <p className="text-xs text-[var(--text-faint)]">Completing sign in…</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}