/** Light or dark rendering of the liquid surface. */
export type BjorkTone = "light" | "dark";

/** Ink colours per tone, matching the site's `--color-ink` token in each theme. */
export const BJORK_PALETTE: Record<BjorkTone, { text: string; background: string }> = {
  light: { text: "#171717", background: "#fafaf8" },
  dark: { text: "#f5f5f4", background: "#0b0b0c" },
};
