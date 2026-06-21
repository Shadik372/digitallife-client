"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl border border-[--border]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        w-10
        h-10
        rounded-xl
        border
        border-[--border]
        hover:bg-[--bg-secondary]
        transition-all
        duration-300
      "
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}