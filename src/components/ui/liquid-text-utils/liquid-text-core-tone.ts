"use client";

import { useTheme } from "@/lib/theme";
import type { BjorkTone } from "./liquid-text-core-palette";

/**
 * Resolves the tone: an explicit `tone` prop wins; otherwise it follows the
 * site's light/dark theme (light during server render and hydration).
 */
export function useBjorkTone(tone?: BjorkTone): BjorkTone {
  const theme = useTheme();
  return tone ?? theme ?? "light";
}
