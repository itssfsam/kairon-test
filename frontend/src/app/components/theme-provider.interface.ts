import { ReactNode } from "react";
import { Theme } from "./theme-provider";

export interface IThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface IThemeProviderProps {
  children: ReactNode;
}