import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin — ScriptValley",
  description: "ScriptValley admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}