"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 rounded-full text-xl bg-purple-200 dark:bg-gray-700 text-black dark:text-white shadow-md hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}