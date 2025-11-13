"use client";

import { Theme, useTheme } from "./theme-provider";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 rounded-full text-4xl hover:scale-200 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === Theme.LIGHT ? "🌞" : "🌙"}
    </button>
  );
}