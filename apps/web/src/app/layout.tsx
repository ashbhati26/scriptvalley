import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";
import ClientAnalytics from "@/components/ClientAnalytics";
import UserSyncProvider from "@/components/providers/UserSyncProvider";
import { DockWrapper } from "@/components/DockWrapper";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Script Valley",
  description:
    "the code one is a smarter, efficient code assistant that helps developers write cleaner, optimized code with a seamless and intuitive experience. Focus on building—let us handle the rest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var saved = localStorage.getItem('sv-theme');
                    if (saved === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body
          className={`${inter.variable} antialiased min-h-screen flex flex-col`}
          style={{
            fontFamily: "var(--font-inter), var(--font-sans)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-secondary)",
          }}
        >
          <ConvexClientProvider>
            <UserSyncProvider />
            <Navbar />
            {children}
            <DockWrapper />
            <Footer />
          </ConvexClientProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                fontSize: "13px",
                fontFamily: "var(--font-inter), sans-serif",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              },
              success: {
                iconTheme: {
                  primary: "#3A5EFF",
                  secondary: "var(--bg-elevated)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "var(--bg-elevated)",
                },
              },
            }}
          />
          <ClientAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}