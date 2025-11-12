import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./components/theme-provider";
import ThemeToggleButton from "./components/theme-toggle-button.tsx";

export const metadata: Metadata = {
  title: "Kaitest",
  description: "Tech Assignment",
};

export enum theme {
  LIGHT = "light",
  DARK = "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}<ThemeToggleButton /></ThemeProvider>

      </body>
    </html>
  );
}
