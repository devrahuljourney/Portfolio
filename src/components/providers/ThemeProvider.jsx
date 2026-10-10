"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Class-based theme switching (adds `.dark` / `.light` to <html>). */
export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
