"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGA, logPageView } from "@/lib/ga";

export default function ClientAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  return null;
}
