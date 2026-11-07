import { Geist, Geist_Mono } from "next/font/google";

/**
 * Self-hosted fonts, defined once. Import from here (not next/font directly)
 * when a component needs the real family name, e.g. canvas text:
 * `geistSans.style.fontFamily`.
 */
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
