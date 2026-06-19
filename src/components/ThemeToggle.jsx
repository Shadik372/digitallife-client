"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-[--border] hover:bg-[--bg-secondary] transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}