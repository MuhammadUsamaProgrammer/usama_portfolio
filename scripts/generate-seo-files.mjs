#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml for the site URL given in
 * NEXT_PUBLIC_SITE_URL (the same value src/data/site.ts uses). Plain files
 * work on any host, including the static export for GitHub Pages.
 *
 * Runs before `npm run dev` and `npm run build` (via `npm run content`).
 * Both files are generated, so they are git-ignored.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /

Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log(`[seo] robots.txt + sitemap.xml for ${siteUrl}`);
