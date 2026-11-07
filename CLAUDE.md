# CLAUDE.md — Premium Minimal 3D Portfolio

## 1. Project Mission

You are a senior frontend engineer, creative developer, UI/UX designer, and interaction designer.

Build a complete, production-ready personal portfolio website using my provided JSON data and resume.

The website must have an **Apple-inspired minimalist aesthetic** with premium typography, generous whitespace, subtle 3D elements, cinematic scrolling, and smooth interactions.

The design must be original. Do not copy Apple's website, branding, imagery, or proprietary assets.

**Primary goal:** Create a portfolio that feels like a polished, premium digital product rather than a generic developer portfolio template.

## 2. Source Data

Before writing code:

1. Inspect the existing project structure.
2. Find and read my portfolio JSON file.
3. Find and read my resume, if available.
4. Extract my real name, title, bio, skills, projects, experience, education, achievements, and verified links.
5. Use the JSON as the primary structured data source.
6. Use the resume to validate and supplement the JSON.
7. Identify missing or conflicting information.

### Content Rules

- Never invent projects, experience, metrics, or achievements.
- Never create fake GitHub or demo links.
- Do not display personal addresses, phone numbers, dates of birth, or other sensitive information without explicit approval.
- Use only approved public contact information.
- Keep content data-driven and easy to update.
- If a project lacks an image, create a tasteful generic visual placeholder instead of pretending it is a real screenshot.
- If a section has no verified content, omit it.

## 3. Technology Stack

Use the following stack unless the existing project has a compatible alternative:

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- Motion for React (`motion`)
- Three.js
- React Three Fiber (`@react-three/fiber`)
- Drei (`@react-three/drei`)
- Lucide React icons

Use React Three Fiber only for the hero or another clearly justified visual element.

Avoid unnecessary dependencies, paid services, heavy animation libraries, and complex configurations.

## 4. Design System

### Visual Style

The design should feel:

- Minimal
- Premium
- Modern
- Elegant
- Calm
- Spacious
- Interactive
- Technically sophisticated

Use a light theme by default.

### Color Palette

```css
:root {
  --background: #fafaf8;
  --surface: #ffffff;
  --foreground: #171717;
  --muted: #71717a;
  --accent: #3478f6;
  --border: #e8e8e8;
}
```

Avoid neon colors, excessive gradients, and heavy glassmorphism.

### Typography

Use Geist, Inter, or a clean system sans-serif font.

Guidelines:

- Large, bold hero typography
- Tight but readable letter spacing for headings
- Comfortable line height for paragraphs
- Strong hierarchy
- Minimal font-weight variations
- Clear contrast between primary and secondary text

### Layout

- Maximum content width: approximately 1200px
- Generous section spacing
- Clean 12-column-inspired desktop layout
- Responsive grids
- Rounded project cards, approximately 20–28px radius
- Subtle borders and shadows
- Balanced asymmetrical compositions where useful

Prioritize whitespace and alignment over decoration.

## 5. Website Structure

### A. Navigation

Build a sticky or floating navigation bar with:

- My name or monogram
- About
- Projects
- Skills
- Experience, if applicable
- Contact

Design:

- Semi-transparent white surface
- Subtle backdrop blur
- Rounded shape
- Smooth anchor scrolling
- Responsive mobile menu
- Accessible keyboard navigation

### B. Hero Section

Create a memorable hero section containing:

- My real name
- My verified professional title
- A short introduction based on my data
- Primary CTA: "Explore My Work"
- Secondary CTA: "Get in Touch"
- Subtle scroll indicator

Use a strong editorial layout.

#### 3D Hero Visual

Create one elegant abstract 3D object.

Preferred concept: a translucent glass or softly reflective geometric sculpture floating in a minimal environment.

Requirements:

- Gentle idle rotation
- Subtle mouse-follow interaction
- Soft lighting
- Refined material appearance
- Minimal geometry
- No excessive particles
- No distracting animation
- No large external 3D models unless necessary

The 3D object must complement the typography, not overpower it.

On mobile or low-power devices, use a simpler rendering or static fallback.

### C. About Section

Use my actual resume information.

Include:

- Concise introduction
- Background
- Interests or specialization, if verified
- Relevant professional highlights

Avoid generic filler text.

### D. Skills Section

Group skills by actual categories such as:

- Frontend
- Backend
- Languages
- Tools
- Cloud or DevOps
- Other relevant specialties

Only display categories supported by my data.

Use minimal cards, typography, and subtle hover feedback.

Do not use arbitrary skill percentage bars.

### E. Featured Projects

This should be one of the strongest visual sections.

For each project, display:

- Project name
- Verified description
- Technology stack
- Image or placeholder
- GitHub link, if available
- Live demo link, if available

Design requirements:

- Large editorial project cards
- Alternating or well-balanced layouts
- Beautiful image framing
- Subtle elevation on hover
- Gentle image zoom
- Optional small 3D tilt
- Clear links and calls to action

Prioritize project quality and readability.

### F. Experience and Education

Use a minimal timeline or editorial two-column layout.

Display only verified information.

Use restrained scroll reveals.

### G. Achievements and Certifications

Include only when supported by the uploaded data.

### H. Contact Section

Create a memorable final section.

Suggested headline:

"Let's Build Something Meaningful."

Use verified, approved contact links.

Include a simple, accessible call to action.

### I. Footer

Include:

- My name
- Relevant public social links
- Minimal copyright text
- Optional back-to-top interaction

## 6. Animation and Interaction Guidelines

Use Motion for React for UI animation.

### Scroll Reveals

- Fade from opacity 0 to 1
- Translate upward approximately 16–24px
- Duration: 0.5–0.8 seconds
- Gentle easing
- Small stagger between related elements

### Buttons

- Transition duration: 0.2–0.3 seconds
- Subtle elevation or scale
- Clear focus and active states
- No exaggerated bounce

### Project Cards

- Maximum tilt: 3 degrees
- Smooth pointer tracking
- Gentle shadow change
- Small image scale effect
- Disable tilt for touch-only devices

### 3D Object

- Slow idle rotation
- Smooth pointer-based movement
- No sudden jumps
- Pause or reduce animation when offscreen
- Respect reduced-motion preferences

### Navigation

- Smooth section scrolling
- Subtle hover indicators
- Clear active and focus states

### Important

Do not animate everything.

Motion should support the content and never interfere with usability.

Respect `prefers-reduced-motion`.

## 7. Responsive Design

Build mobile-first and support:

- Small mobile screens from 320px
- Standard phones
- Tablets
- Laptops
- Large desktop screens

Mobile requirements:

- Readable typography
- Single-column project cards when appropriate
- Touch-friendly navigation
- No horizontal overflow
- Simplified 3D
- No hover-dependent functionality
- Appropriate spacing and button sizes

## 8. Accessibility

Implement:

- Semantic HTML
- Keyboard-accessible navigation
- Visible focus indicators
- Sufficient color contrast
- Descriptive image alt text
- Accessible button labels
- Reduced-motion support
- Proper heading hierarchy
- No essential content hidden behind animations

## 9. Performance and SEO

Prioritize real-world performance.

Implement:

- Lazy-loaded 3D scene
- Client-only loading where browser APIs are required
- Optimized images using `next/image` where appropriate
- Responsive image sizes
- Minimal unnecessary JavaScript
- Efficient animation loops
- Appropriate loading states and fallbacks
- SEO title and description
- Open Graph metadata
- Sitemap and robots configuration when appropriate

Avoid hydration errors and unnecessary re-renders.

## 10. Suggested Folder Structure

```text
portfolio/
├── CLAUDE.md
├── package.json
├── public/
│   ├── images/
│   └── resume/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Experience.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── animations/
│   │   │   └── Reveal.tsx
│   │   └── three/
│   │       └── HeroScene.tsx
│   ├── data/
│   │   └── portfolio.json
│   ├── lib/
│   │   └── portfolio.ts
│   └── types/
│       └── portfolio.ts
└── README.md
```

This is a suggested structure. Adapt it to the existing project instead of unnecessarily replacing files.

## 11. Implementation Workflow

### Phase 1 — Inspect and Plan

Before implementation:

1. Inspect the repository.
2. Read available JSON and resume files.
3. Check installed dependencies.
4. Identify the actual portfolio content.
5. Propose a short implementation plan.

If essential files are missing, ask me to provide them.

### Phase 2 — Build the Foundation

- Set up or adapt Next.js.
- Configure fonts and design tokens.
- Create the responsive layout.
- Implement navigation and core sections.
- Connect components to real portfolio data.

### Phase 3 — Add Interactions

- Scroll reveals
- Button hover states
- Project card interactions
- Navigation transitions
- Responsive mobile menu

### Phase 4 — Add 3D

- Implement the hero scene.
- Optimize rendering.
- Add pointer interaction.
- Provide mobile and reduced-motion fallbacks.

### Phase 5 — Polish

Review:

- Typography
- Spacing
- Alignment
- Responsive layouts
- Color consistency
- Animation timing
- Accessibility
- Loading performance

Remove unnecessary visual clutter.

### Phase 6 — Verify

Run the project's available checks, such as:

```bash
npm run lint
npm run build
```

Only run commands supported by the actual `package.json`.

Fix errors found during verification.

Do not claim tests passed unless they actually ran successfully.

## 12. Working Rules for Claude Code

When implementing:

1. Read existing files before editing them.
2. Preserve useful existing functionality.
3. Prefer small, reusable components.
4. Use strict TypeScript types.
5. Avoid `any` unless justified.
6. Keep content separate from UI components.
7. Use semantic HTML.
8. Avoid placeholder content in the final website unless clearly identified.
9. Do not introduce dependencies without a reason.
10. Do not overwrite user files unnecessarily.
11. Make actual code changes rather than only describing them.
12. Explain any blockers clearly.
13. Summarize changed files after implementation.
14. Provide commands to run and preview the website.

## 13. Definition of Done

The portfolio is complete when:

- [ ] Real portfolio JSON data is integrated
- [ ] Resume information has been reviewed
- [ ] All relevant sections are implemented
- [ ] The design is original and premium
- [ ] Desktop and mobile layouts work
- [ ] Navigation works
- [ ] Project links are valid or omitted
- [ ] 3D hero has a suitable fallback
- [ ] Reduced-motion support works
- [ ] Keyboard accessibility is supported
- [ ] No obvious horizontal overflow exists
- [ ] Available build and lint checks pass
- [ ] The project can be run locally
- [ ] Deployment instructions are documented

## Final Design Principle

**Make it feel expensive through simplicity.**

Use beautiful typography, carefully balanced whitespace, polished project showcases, subtle interaction, and one memorable 3D hero.

Avoid making the portfolio look like a generic template or an overloaded animation demo.

The finished website should be elegant, personal, fast, accessible, and memorable.