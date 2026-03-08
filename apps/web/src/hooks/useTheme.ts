"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync initial value from the DOM
    setIsDark(document.documentElement.classList.contains("dark"));

    // Keep in sync with any future class changes (toggle from any component)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sv-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sv-theme", "light");
    }
  };

  return { isDark, toggle };
}