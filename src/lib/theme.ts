"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Current theme on the client; `null` during server render and hydration. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null);
}

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function flip(next: Theme) {
  const root = document.documentElement;
  // Suspend CSS transitions so every surface changes in the same frame.
  root.setAttribute("data-theme-switching", "");
  root.dataset.theme = next;
  root.style.colorScheme = next;
  void root.offsetWidth;
  requestAnimationFrame(() => root.removeAttribute("data-theme-switching"));
}

/** Apply a theme, optionally persisting it, with a soft cross-fade where supported. */
export function applyTheme(next: Theme, { persist = true } = {}) {
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Storage unavailable (private mode): the theme still applies for this visit. */
    }
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && typeof document.startViewTransition === "function") {
    try {
      document.startViewTransition(() => flip(next));
      return;
    } catch {
      /* Fall through to an instant switch. */
    }
  }
  flip(next);
}
