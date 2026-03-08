"use client";

import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import ProtectedRoute from "@/components/ProtectedRoute";

function PlaygroundContent() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-base)]">
      <div className="w-full mx-auto px-4 py-6 mt-12">
        <EditorPanel />
        <OutputPanel />
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <ProtectedRoute>
      <PlaygroundContent />
    </ProtectedRoute>
  );
}