"use client";
import React from "react";
import { Keyboard } from "../_components/Keyboard";
import { Highlighter } from "../_components/Highligher";

export function KeyboardWithPreview() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center py-10 bg-[var(--bg-base)]">
      <div className="text-center mb-8">
        <p className="leading-relaxed text-[var(--text-primary)]">
          Your{" "}
          <Highlighter action="underline" color="#FF9800">
            keyboard is the only tool you need.
          </Highlighter>{" "}
          From instant{" "}
          <Highlighter action="highlight" color="#87CEFA">
            compilation to structured DSA sheets
          </Highlighter>{" "}
          everything, built in.
        </p>
      </div>
      <Keyboard enableSound showPreview />
    </div>
  );
}