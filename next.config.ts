import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (or any static host).
 * Enabled with STATIC_EXPORT=true; the GitHub Actions workflow sets it,
 * together with NEXT_PUBLIC_BASE_PATH (e.g. "/usama_portfolio").
 * Without it, the app builds normally for a Node.js host (`npm run start`).
 */
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Partial prerendering (implied by these two) is not available in export
  // mode; the page is fully static anyway, so they are off for the export.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  ...(staticExport
    ? {
        output: "export",
        basePath,
        // Static hosts have no image optimisation server: serve files as-is.
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
