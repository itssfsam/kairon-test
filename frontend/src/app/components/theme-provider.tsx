"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
    // TODO: hook up these toasts to buy sell and errors
    toast.success('🦄 Wow so easy!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    toast.error('🦄 Wow so easy!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
