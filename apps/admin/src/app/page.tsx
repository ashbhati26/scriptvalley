"use client";

export const dynamic = "force-dynamic";

import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./components/providers/ConvexClientProvider";
import AdminGuard from "./components/providers/AdminGuard";
import AdminNavbar from "./components/AdminNavbar";
import AdminLayout from "./components/AdminLayout";

export default function Page() {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <AdminGuard>
          <div className="w-full min-h-screen">
            <AdminNavbar />
            <AdminLayout />
          </div>
        </AdminGuard>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}