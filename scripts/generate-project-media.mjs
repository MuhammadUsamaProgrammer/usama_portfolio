#!/usr/bin/env node
/**
 * Scans public/images/projects/<project-slug>/ and writes
 * src/data/project-media.json, which the site reads at build time.
 *
 * Folder convention (see README → "Project images"):
 *   <project-slug>/         slug of the project title in portfolio.json,
 *                           e.g. "All Out Adventures" → all-out-adventures
 *     icon.webp             app icon / logo (optional; .webp .png .jpg .jpeg)
 *     01-home.webp          screenshots: two-digit order + caption words
 *     02-customer--login.webp   "--" adds a group label → "Customer · Login"
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * Run manually with `npm run media`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_DIR = path.join(root, "public", "images", "projects");
const PORTFOLIO = path.join(root, "src", "data", "portfolio.json");
const OUTPUT = path.join(root, "src", "data", "project-media.json");
const PUBLIC_PREFIX = "/images/projects";

const IMAGE_EXT = /\.(webp|png|jpe?g)$/i;
const ICON = /^icon\.(webp|png|jpe?g)$/i;
const SCREEN = /^(\d{1,3})-([a-z0-9]+(?:-{1,2}[a-z0-9]+)*)\.(webp|png|jpe?g)$/;

/** Must match how folders are named: lower-case, words joined by "-". */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Read width/height from PNG, JPEG or WebP headers (no dependencies). */
function imageSize(file) {
  const buf = fs.readFileSync(file);
  // PNG
  if (buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk segments to the first SOFn marker.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      const length = buf.readUInt16BE(offset + 2);
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSOF) {
        return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  // WebP
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const b = buf.subarray(21, 25);
      return {
        width: 1 + (((b[1] & 0x3f) << 8) | b[0]),
        height: 1 + (((b[3] & 0x0f) << 10) | (b[2] << 2) | ((b[1] & 0xc0) >> 6)),
      };
    }
    if (chunk === "VP8X") {
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
  }
  throw new Error(`Unsupported or corrupt image: ${path.relative(root, file)}`);
}

/** "customer--track-your-provider" → "Customer · Track your provider" */
function captionFromSlug(slug) {
  return slug
    .split("--")
    .map((part) => {
      const text = part.replace(/-/g, " ");
      return text.charAt(0).toUpperCase() + text.slice(1);
    })
    .join(" · ");
}

const portfolio = JSON.parse(fs.readFileSync(PORTFOLIO, "utf8"));
const titlesBySlug = new Map(portfolio.projects.map((p) => [slugify(p.title), p.title]));

const warnings = [];
const errors = [];
const media = {};

const folders = fs.existsSync(MEDIA_DIR)
  ? fs
      .readdirSync(MEDIA_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
  : [];

for (const folder of folders) {
  const title = titlesBySlug.get(folder);
  if (!title) {
    warnings.push(
      `"${folder}/" does not match any project title. Expected one of: ${[...titlesBySlug.keys()].join(", ")}`,
    );
    continue;
  }

  const dir = path.join(MEDIA_DIR, folder);
  const files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  const entry = { slug: folder, icon: null, screens: [] };
  const seenOrder = new Map();

  for (const file of files) {
    const full = path.join(dir, file);
    const src = `${PUBLIC_PREFIX}/${folder}/${file}`;

    if (ICON.test(file)) {
      if (entry.icon) errors.push(`${folder}/: more than one icon file`);
      entry.icon = { src, ...imageSize(full) };
      continue;
    }

    const match = SCREEN.exec(file);
    if (!match) {
      warnings.push(
        IMAGE_EXT.test(file)
          ? `${folder}/${file}: skipped. Rename to "NN-caption-words.ext" (lower-case, no spaces), e.g. "01-home.webp"`
          : `${folder}/${file}: skipped (not a .webp, .png or .jpg image)`,
      );
      continue;
    }

    const order = Number(match[1]);
    if (seenOrder.has(order)) {
      errors.push(`${folder}/: "${file}" and "${seenOrder.get(order)}" share the number ${match[1]}`);
    }
    seenOrder.set(order, file);
    entry.screens.push({ order, src, caption: captionFromSlug(match[2]), ...imageSize(full) });
  }

  entry.screens.sort((a, b) => a.order - b.order);
  for (const screen of entry.screens) delete screen.order;
  media[title] = entry;
}

for (const [slug, title] of titlesBySlug) {
  if (!media[title]) {
    warnings.push(`"${title}" has no images yet. Add them to public/images/projects/${slug}/`);
  }
}

for (const w of warnings) console.warn(`[media] warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`[media] error: ${e}`);
  process.exit(1);
}

const json = `${JSON.stringify(media, null, 2)}\n`;
const previous = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
if (json !== previous) fs.writeFileSync(OUTPUT, json);

const count = Object.values(media).reduce((n, m) => n + m.screens.length, 0);
console.log(
  `[media] ${Object.keys(media).length} projects, ${count} screenshots → ${path.relative(root, OUTPUT)}`,
);
