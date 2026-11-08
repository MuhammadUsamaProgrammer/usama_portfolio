#!/usr/bin/env node
/**
 * Pairs the entries in src/data/certificates.json with their files in
 * public/pdf/certificates/ and writes src/data/certificate-files.json, which
 * the site reads at build time.
 *
 * Convention (see README → "Adding a certificate"):
 *   public/pdf/certificates/
 *     <file>.pdf      the certificate (required); <file> is lower-case-with-dashes
 *     <file>.webp     preview of page 1 (optional; .webp .png .jpg .jpeg)
 *
 * Each JSON entry: { file, title, issuer, platform?, date (YYYY-MM-DD), verifyUrl? }
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * Run manually with `npm run certificates`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "./lib/image-size.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(root, "public", "pdf", "certificates");
const DATA = path.join(root, "src", "data", "certificates.json");
const OUTPUT = path.join(root, "src", "data", "certificate-files.json");
const PUBLIC_PREFIX = "/pdf/certificates";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PREVIEW = /\.(webp|png|jpe?g)$/i;

const warnings = [];
const errors = [];

const entries = JSON.parse(fs.readFileSync(DATA, "utf8"));
if (!Array.isArray(entries)) {
  console.error("[certificates] error: certificates.json must be an array");
  process.exit(1);
}

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => !f.startsWith(".")) : [];
const pdfs = new Set(files.filter((f) => f.toLowerCase().endsWith(".pdf")).map((f) => f.slice(0, -4)));
const previews = new Map(
  files.filter((f) => PREVIEW.test(f)).map((f) => [f.replace(PREVIEW, ""), f]),
);

const out = {};
const seen = new Set();

for (const [i, entry] of entries.entries()) {
  const where = `entry ${i + 1}${entry?.file ? ` ("${entry.file}")` : ""}`;
  if (!entry || typeof entry !== "object") {
    errors.push(`${where}: not an object`);
    continue;
  }
  const { file, title, issuer, date, verifyUrl } = entry;
  if (!file || !SLUG.test(file)) {
    errors.push(`${where}: "file" must be lower-case words joined by "-", e.g. "ai-foundations"`);
    continue;
  }
  if (seen.has(file)) errors.push(`${where}: duplicate "file"`);
  seen.add(file);
  if (!title) errors.push(`${where}: missing "title"`);
  if (!issuer) errors.push(`${where}: missing "issuer"`);
  if (!date || !DATE.test(date) || Number.isNaN(Date.parse(date))) {
    errors.push(`${where}: "date" must be YYYY-MM-DD`);
  }
  if (verifyUrl && !/^https?:\/\//.test(verifyUrl)) {
    errors.push(`${where}: "verifyUrl" must start with https://`);
  }
  if (!pdfs.has(file)) {
    errors.push(`${where}: public/pdf/certificates/${file}.pdf not found`);
    continue;
  }

  const pdfPath = path.join(DIR, `${file}.pdf`);
  const preview = previews.get(file);
  out[file] = {
    pdf: `${PUBLIC_PREFIX}/${file}.pdf`,
    sizeBytes: fs.statSync(pdfPath).size,
    preview: preview
      ? { src: `${PUBLIC_PREFIX}/${preview}`, ...imageSize(path.join(DIR, preview), root) }
      : null,
  };
  if (!preview) warnings.push(`"${file}" has no preview image (optional). Add ${file}.webp for a nicer card.`);
}

for (const slug of pdfs) {
  if (seen.has(slug)) continue;
  const valid = SLUG.test(slug);
  warnings.push(
    `${slug}.pdf is not listed in src/data/certificates.json${
      valid ? "" : ` (rename it to lower-case-with-dashes first, e.g. "${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf")`
    }. Add:\n  { "file": "${valid ? slug : "your-file-name"}", "title": "", "issuer": "", "platform": "", "date": "YYYY-MM-DD", "verifyUrl": "" }`,
  );
}
for (const [slug, f] of previews) {
  if (!pdfs.has(slug)) warnings.push(`${f} has no matching PDF`);
}

for (const w of warnings) console.warn(`[certificates] warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`[certificates] error: ${e}`);
  process.exit(1);
}

const json = `${JSON.stringify(out, null, 2)}\n`;
const previous = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
if (json !== previous) fs.writeFileSync(OUTPUT, json);
console.log(`[certificates] ${Object.keys(out).length} certificates → ${path.relative(root, OUTPUT)}`);
