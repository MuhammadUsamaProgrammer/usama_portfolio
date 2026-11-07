# Muhammad Usama — Portfolio

A minimalist, editorial portfolio built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, Motion, and React Three Fiber.

## Quick start

Requires Node.js 20.9+ (developed on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start the development server              |
| `npm run build`  | Create an optimized production build      |
| `npm run start`  | Serve the production build                |
| `npm run lint`   | Run ESLint                                |
| `npm run media`  | Re-scan project images (also runs automatically before `dev` and `build`) |
| `npx tsc --noEmit` | Type-check the project                  |

## Editing content

Content is kept separate from presentation:

| File | What it holds |
| --- | --- |
| `src/data/portfolio.json` | **Primary source of truth**: profile, projects, skills, experience, education, contacts |
| `src/data/site.ts` | Editorial layer: hero and about copy, project summaries, roles from the resume, skill grouping, leadership, SEO, and which contact channels are public |
| `public/images/profile.webp` | Portrait used in the About section |

- **Skills:** every skill in the JSON is shown. Skills not mapped in `skillGroups` fall into a "More" group automatically.
- **Contact privacy:** only the keys listed in `publicContactKeys` (`email`, `linkedin`, `github`) are published. The phone number and WhatsApp link are intentionally excluded.

## Adding a project

1. **Add it to `src/data/portfolio.json`** (title, description, technologies, store or web links).
2. **Add its images** to `public/images/projects/<project-slug>/`. The slug is the title in lower case with words joined by `-`:
   `"All Out Adventures"` → `all-out-adventures/`, `"MerchMint Web App"` → `merchmint-web-app/`.
3. *(Optional)* add an entry with the same `title` to `projectExtras` in `src/data/site.ts` for a shorter summary, role, platforms, headline metric, backdrop tint, `featured: true`, or `mediaStyle`.

Then run `npm run dev`; the project appears with its cover, icon and gallery. Without step 3 it still renders (the summary falls back to the JSON description); without step 2 it shows abstract artwork.

### Project images

```text
public/images/projects/gotstuck/
├── icon.webp                              app icon / logo (square, optional)
├── 01-customer--instant-login.webp        → "Customer · Instant login"
├── 02-customer--recovery-or-car-report.webp
└── 06-provider--dashboard-and-stats.webp  → "Provider · Dashboard and stats"
```

- **Order:** the leading number. Gaps are fine (`01`, `02`, `05`…), so you can insert screens later without renaming everything.
- **Caption and alt text:** the words after the number, lower-case and joined by `-`. A double dash `--` adds a group label, e.g. `customer--login` → "Customer · Login".
- **Cover:** the first screenshot is the hero image of the card; featured cards also fan out the 2nd and 3rd.
- **Formats:** `.webp` (preferred), `.png` or `.jpg`.
- **Presentation** (`mediaStyle` in `site.ts`):
  - `"screens"` (default): raw UI captures, shown on an iPhone (or a MacBook when `platform` is `"web"`), both on the card and in the gallery. Phone shots look best at 9:19.5; tall web shots scroll inside the laptop screen. Frames live in `src/components/devices.tsx`.
  - `"artwork"`: store graphics or photos that already include a device, shown as they are.

`npm run media` writes `src/data/project-media.json` (commit it). It warns about misnamed files or folders that match no project, and fails on duplicate numbers.

## Project structure

```text
src/
├── app/                 # layout, page, global styles, sitemap, robots, OG image, icon
├── components/          # page sections and UI
│   ├── animations/      # Reveal + MotionProvider (reduced-motion aware)
│   ├── three/           # HeroVisual (lazy loader), HeroScene (R3F), HeroFallback (CSS)
│   └── ui/              # ButtonLink, SectionHeading
├── data/                # portfolio.json, site.ts, project-media.json (generated)
├── lib/portfolio.ts     # typed, derived data for components
└── types/portfolio.ts
scripts/generate-project-media.mjs   # scans public/images/projects/
```

## Light and dark theme

- The theme follows the visitor's OS setting until they use the sun/moon toggle in the navbar; their choice is then saved in `localStorage`.
- An inline script in `<head>` (`src/lib/theme-script.ts`) applies the theme before first paint, so there is no flash.
- Colors are tokens in `src/app/globals.css`: light values in `@theme`, dark overrides under `[data-theme="dark"]`. Use `dark:` utilities for the rare one-off.
- The 3D glass and the CSS fallback have their own dark tuning; project backdrops switch to a dark tint of each project's color, while screenshots stay untouched.

## Interactions

Reusable pieces live in `src/components/interactions/`:

| Component | Where | What it does |
| --- | --- | --- |
| `ScrollDrift` | Hero | Text and sculpture drift, scale and fade as the hero scrolls away |
| `ScrollHighlight` | About lead | Words blend from muted to ink while scrolling (always AA contrast) |
| `TimelineProgress` | Experience | Accent fill grows down the timeline rail |
| `CountUp` | Hero stats | Numbers count up once when they come into view |
| `ScrollProgressButton` | Global | Floating back-to-top with a scroll-progress ring |
| `Magnetic` | Hero and contact CTAs | Buttons lean toward the cursor (max 8px) |
| `SpotlightGroup` + `.spotlight` | Skills | Cursor light inside cards and along neighbouring borders |
| `TiltFrame` | About portrait | Subtle 3D tilt with a soft glare |
| `ui/liquid-text` | Hero name | Name rendered as a viscous WebGL2 surface; drag through a letter to pull ink off it. Real `<h1>` kept for SEO; plain-text fallback without WebGL |
| `ui/dot-field` | Contact | Closing headline assembled from a dot grid; cursor pushes the dots (canvas, no dependencies) |

Project cards also tilt, show a "View" label that follows the cursor over the cover, and their imagery drifts slightly on scroll; the navbar has a hover pill that slides between links.

All pointer effects are limited to mouse/trackpad (`useFinePointer`), and every effect turns off under `prefers-reduced-motion` (`useMotionAllowed`, hydration-safe). Nothing hijacks scrolling.

## 3D hero

- Three.js / R3F are code-split and only loaded on the client when the browser is idle.
- A static CSS rendition is shown first and remains if WebGL is unavailable or errors.
- Rendering pauses when the hero is off-screen.
- On small or touch devices, geometry and pixel ratio are reduced and pointer tracking is off.
- With `prefers-reduced-motion`, the sculpture renders once without idle motion.

## Deployment

Set the public URL so canonical links, Open Graph, the sitemap, and robots point at your domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). The framework is detected automatically.
3. Add the `NEXT_PUBLIC_SITE_URL` environment variable, then deploy.

### Any Node.js host

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
npm run start -- -p 3000
```

Cache Components is enabled in `next.config.ts`, which requires the Node.js runtime (not Edge).
