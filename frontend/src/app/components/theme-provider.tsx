"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IThemeContextType, IThemeProviderProps } from "./theme-provider.interface";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export default function ThemeProvider({ children }: IThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("theme") as Theme | Theme.LIGHT
    }
    catch {
      return Theme.LIGHT;
    }
  });

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
