// src/components/ThemeProvider.tsx
"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// 1️⃣ Define Theme enum
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

// 2️⃣ Define the context type
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 3️⃣ Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4️⃣ Create a custom hook for easier usage
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// 5️⃣ Define the provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// 6️⃣ Create ThemeProvider
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
