import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./components/ConvexClientProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instructor — ScriptValley",
  description: "ScriptValley instructor workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/*
           * Runs before first paint — eliminates dark-mode flash.
           * Reads localStorage "sv-theme"; falls back to prefers-color-scheme.
           */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('sv-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
            }}
          />
        </head>
        <body>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.01em",
                boxShadow: "var(--shadow-md)",
                padding: "10px 14px",
                maxWidth: "340px",
              },
              success: { iconTheme: { primary: "var(--brand)", secondary: "#fff" } },
              error:   { iconTheme: { primary: "var(--danger)", secondary: "#fff" } },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}