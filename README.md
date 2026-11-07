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
| `npx tsc --noEmit` | Type-check the project                  |

## Editing content

Content is kept separate from presentation:

| File | What it holds |
| --- | --- |
| `src/data/portfolio.json` | **Primary source of truth**: profile, projects, skills, experience, education, contacts |
| `src/data/site.ts` | Editorial layer: hero and about copy, project summaries, roles from the resume, skill grouping, leadership, SEO, and which contact channels are public |
| `public/images/profile.webp` | Portrait used in the About section |

- **Add a project:** add it to `portfolio.json`, then add a matching entry (same `title`) to `projectExtras` in `site.ts`. The build fails if one is missing.
- **Skills:** every skill in the JSON is shown. Skills not mapped in `skillGroups` fall into a "More" group automatically.
- **Contact privacy:** only the keys listed in `publicContactKeys` (`email`, `linkedin`, `github`) are published. The phone number and WhatsApp link are intentionally excluded.
- **Project imagery:** covers are abstract CSS artwork (`src/components/ProjectCover.tsx`). Swap in real screenshots there when available.

## Project structure

```text
src/
├── app/                 # layout, page, global styles, sitemap, robots, OG image, icon
├── components/          # page sections and UI
│   ├── animations/      # Reveal + MotionProvider (reduced-motion aware)
│   ├── three/           # HeroVisual (lazy loader), HeroScene (R3F), HeroFallback (CSS)
│   └── ui/              # ButtonLink, SectionHeading
├── data/                # portfolio.json + site.ts
├── lib/portfolio.ts     # typed, derived data for components
└── types/portfolio.ts
```

## Light and dark theme

- The theme follows the visitor's OS setting until they use the sun/moon toggle in the navbar; their choice is then saved in `localStorage`.
- An inline script in `<head>` (`src/lib/theme-script.ts`) applies the theme before first paint, so there is no flash.
- Colors are tokens in `src/app/globals.css`: light values in `@theme`, dark overrides under `[data-theme="dark"]`. Use `dark:` utilities for the rare one-off.
- The 3D glass and the CSS fallback have their own dark tuning; project mockups stay light and are slightly dimmed.

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
