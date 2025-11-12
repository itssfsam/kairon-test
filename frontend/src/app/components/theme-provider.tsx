"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem("theme") as Theme | Theme.DARK);

  const toggleTheme = () =>
    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`min-h-screen bg-cover bg-center transition-all duration-500`}
        style={{
          backgroundImage:
            theme === Theme.DARK
              ? "url('/dark.jpg')"
              : "url('/light.jpg')",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
