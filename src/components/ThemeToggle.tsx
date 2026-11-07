"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { applyTheme, getStoredTheme, useTheme } from "@/lib/theme";

const icon =
  "absolute size-[1.125rem] transition-[transform,opacity] duration-300 ease-out-soft motion-reduce:transition-none";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();

  // Until the visitor picks a theme, keep following the OS setting live.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === null) {
        applyTheme(media.matches ? "dark" : "light", { persist: false });
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const label =
    theme === null
      ? "Toggle color theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      className={`relative grid place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-subtle ${className}`}
    >
      {/* Icons swap via CSS so the correct one shows before hydration. */}
      <Moon
        aria-hidden
        data-theme-icon
        className={`${icon} rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0`}
      />
      <Sun
        aria-hidden
        data-theme-icon
        className={`${icon} rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
      />
    </button>
  );
}
