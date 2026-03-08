"use client";

import { useUser } from "@clerk/nextjs";
import { FloatingDock } from "@/components/Dock";
import {
  Home,
  FileSpreadsheet,
  SquareLibrary,
  SquareChevronRight,
  FilePenLine,
  Star,
  Calendar,
} from "lucide-react";
import HeaderProfileBtn from "./HeaderProfileBtn";

export function DockWrapper() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return null;

  const links = [
    {
      title: "Home",
      icon: <Home className="h-full w-full" />,
      href: "/dev-profile",
    },
    {
      title: "Sheets",
      icon: <FileSpreadsheet className="h-full w-full" />,
      href: "/dsa-sheet",
    },
    {
      title: "Starred",
      icon: <Star className="h-full w-full" />,
      href: "/starred",
    },
    {
      title: "Notes",
      icon: <FilePenLine className="h-full w-full" />,
      href: "/notes",
    },
    {
      title: "Snippets",
      icon: <SquareLibrary className="h-full w-full" />,
      href: "/snippets",
    },
    {
      title: "Contests",
      icon: <Calendar className="h-full w-full" />,
      href: "/contests",
    },
    {
      title: "Playground",
      icon: <SquareChevronRight className="h-full w-full" />,
      href: "/playground",
    },
    {
      title: "Profile",
      icon: (
        <div className="h-4 w-4 flex items-center justify-center">
          <HeaderProfileBtn />
        </div>
      ),
      href: "",
    },
  ];

  return (
    <FloatingDock
      items={links}
      mobileClassName="fixed bottom-4 right-4 z-50"
      desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    />
  );
}