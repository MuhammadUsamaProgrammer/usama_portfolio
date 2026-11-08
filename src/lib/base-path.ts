/**
 * Sub-path the site is served from, e.g. "/usama_portfolio" on GitHub Pages
 * (https://<user>.github.io/<repo>/). Empty when served from a domain root.
 * Set at build time through NEXT_PUBLIC_BASE_PATH (see next.config.ts).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes a root-relative public path ("/images/…", "/pdf/…") with the base
 * path. Next.js does this for its own assets and static imports, but not for
 * plain string paths used in <img>, next/image `src`, links or CSS.
 */
export function withBase(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path;
}
