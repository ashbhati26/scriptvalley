"use client";

import { SortingAlgorithmProvider } from "./context/Visulizer";

export default function SortingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SortingAlgorithmProvider>
      {children}
    </SortingAlgorithmProvider>
  );
}
