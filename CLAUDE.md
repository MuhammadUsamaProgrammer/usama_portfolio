# CLAUDE.md — Muhammad Usama Portfolio

## 1. Project Overview

Build a complete, production-ready personal portfolio website based on the existing project files.

The website must deliver a premium, Apple-inspired minimalist experience with elegant typography, generous whitespace, carefully selected UI components, subtle cinematic animations, and one memorable interactive 3D element.

The result must be original, professional, responsive, accessible, fast, and visually polished.

Do not copy Apple's branding, proprietary assets, or website layouts.

### Primary Goal

Create a portfolio that looks and feels like a high-end digital product rather than a generic developer portfolio template.

The design should communicate professionalism, technical capability, creativity, and attention to detail.

---

## 2. Source Files

Read these files before implementation:

- `reference/Muhammad Usama - Resume.pdf`
- `src/data/portfolio.json`
- `public/images/profile.webp`

Inspect the repository before assuming any file or directory exists.

### Content Rules

1. Use `portfolio.json` as the primary structured content source.
2. Use the resume to validate and supplement the portfolio data.
3. Extract only verified skills, projects, experience, education, achievements, and links.
4. Never invent projects, technologies, experience, metrics, certifications, or accomplishments.
5. Do not generate fake GitHub links or project demos.
6. Do not publish private information such as phone numbers, residential addresses, dates of birth, or personal identifiers.
7. Use only approved public contact information and social links.
8. If data is missing, omit the unsupported section or ask for clarification when essential.
9. Keep portfolio content separate from presentation components.
10. Do not rewrite factual information in ways that change its meaning.

### Profile Image

Use `public/images/profile.webp` as the official professional portrait.

- Primary placement: About section
- Preserve the person's natural appearance
- Maintain the original image proportions
- Avoid stretching or excessive cropping
- Use Next.js image optimization
- Apply tasteful rounded corners and subtle framing
- Provide descriptive alt text

---

## 3. Available Skills and MCP Tools

### UI UX Pro Max Skill

Skill location:

`.claude/skills/ui-ux-pro-max/SKILL.md`

Read and use this skill when working on:

- Design systems
- Typography
- Color palettes
- Layout composition
- Responsive UI
- Accessibility
- Visual consistency
- UI/UX quality
- Interaction design

Use the skill's relevant references and resources where appropriate.

The portfolio's design requirements in this file remain the source of truth when general skill suggestions conflict with them.

### 21st.dev MCP Server

The 21st MCP server has been configured at Claude Code user scope.

When available, use its tools to:

- Discover suitable React components
- Find elegant navigation patterns
- Research hero section treatments
- Explore premium project card layouts
- Find refined interaction patterns
- Retrieve useful component implementation details

### 21st MCP Rules

1. Check whether the MCP tools are available in the current session.
2. Prefer components compatible with Next.js, React, TypeScript, and Tailwind CSS.
3. Use the MCP selectively, not for every element.
4. Adapt selected components to the project's own design system.
5. Inspect component code, dependencies, and usage terms before integration.
6. Avoid unnecessary packages, heavy effects, and unrelated visual styles.
7. Do not execute unreviewed remote installation scripts.
8. Do not expose API keys or modify MCP authentication settings.
9. If the MCP is unavailable, continue development using the existing stack.
10. Never claim an MCP tool was used unless the call actually succeeded.

### Tool Philosophy

- `CLAUDE.md` defines project requirements.
- UI UX Pro Max guides design quality.
- 21st MCP assists with component discovery.
- Claude Code implements, integrates, and verifies the website.

---

## 4. Technology Stack

Preferred stack:

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Three.js
- React Three Fiber
- Drei
- Lucide React

Use Three.js and React Three Fiber only when the visual benefit justifies the performance cost.

Prefer simple CSS and React implementations for ordinary UI elements.

Inspect the existing project and adapt it rather than unnecessarily rebuilding working infrastructure.

---

## 5. Design Direction

### Design Identity

The website should feel:

- Premium
- Minimal
- Elegant
- Modern
- Calm
- Confident
- Creative
- Technically sophisticated

Think refined editorial design, precise spacing, exceptional typography, and subtle visual depth.

### Color System

Use a light theme as the primary design.

| Token | Value |
|---|---|
| Background | `#FAFAF8` |
| Surface | `#FFFFFF` |
| Primary text | `#171717` |
| Secondary text | `#71717A` |
| Accent blue | `#3478F6` |
| Borders | `#E8E8E8` |

Use accent blue sparingly for meaningful interactive elements.

Avoid excessive gradients, neon colors, glowing borders, and overdecorated backgrounds.

### Typography

Use Geist, Inter, or a similarly refined sans-serif typeface.

Requirements:

- Large editorial hero headline
- Clear visual hierarchy
- Carefully controlled letter spacing
- Comfortable paragraph line height
- Strong contrast
- Minimal font-weight variation
- Responsive typography using CSS `clamp()` where useful

### Layout

- Maximum content width around 1200–1280px
- Generous section spacing
- Balanced grid layouts
- Responsive containers
- Consistent spacing scale
- Rounded cards around 20–28px
- Subtle shadows
- Thin borders
- High-quality alignment

Use whitespace as a major design element.

---

## 6. Website Sections

### Navigation

Create a floating or sticky minimalist navbar.

Include relevant links:

- Home
- About
- Skills
- Projects
- Experience
- Contact

Requirements:

- Semi-transparent surface
- Subtle backdrop blur
- Smooth section navigation
- Active and focus states
- Accessible mobile menu
- Responsive behavior

### Hero Section

Create a striking full-screen or near-full-screen hero.

Include:

- Verified name
- Verified professional title
- Concise personal introduction
- Primary CTA: Explore My Work
- Secondary CTA: Get in Touch
- One elegant abstract 3D visual

The hero should be visually memorable without becoming cluttered.

#### Interactive 3D Hero

Preferred direction:

A softly reflective or translucent abstract geometric sculpture, inspired by premium product photography.

Requirements:

- Smooth, slow idle rotation
- Gentle pointer-based interaction
- Soft realistic lighting
- Restrained materials
- Minimal geometry
- Lightweight rendering
- Responsive sizing
- Lazy loading
- Static or CSS fallback
- Reduced-motion support

Do not use excessive particles, intense glow, complicated scenes, or distracting motion.

The 3D object should support the typography rather than compete with it.

### About Section

Create a premium editorial two-column layout.

Use:

- Actual biography derived from verified files
- Professional profile image
- Concise career or academic background
- Relevant interests or specializations

Keep the layout calm, readable, and professional.

### Skills Section

Organize verified skills into meaningful categories.

Possible categories:

- Programming Languages
- Frontend
- Backend
- Databases
- Tools
- Cloud and DevOps
- AI or Other Specializations

Only include categories supported by the user's actual data.

Use elegant skill cards, typography, and restrained hover effects.

Do not use arbitrary percentage-based skill bars.

### Projects Section

This should be one of the website's strongest sections.

Each verified project may include:

- Project title
- Description
- Technologies
- Project image or tasteful placeholder
- GitHub link, if verified
- Live demo, if verified

Design:

- Large editorial cards
- Strong image presentation
- Responsive grids
- Subtle hover elevation
- Gentle image zoom
- Optional very small pointer tilt
- Clear calls to action

Avoid generic repeated card layouts if a more thoughtful editorial presentation improves the result.

### Experience and Education

Use verified information from the resume and JSON.

Present it using a refined timeline or clean editorial layout.

Only include supported entries.

### Achievements and Certifications

Include only when verified.

### Contact Section

Create a strong, minimal closing section.

Suggested heading:

"Let's Build Something Meaningful."

Include approved public contact links and a clear call to action.

Do not expose private resume contact information without approval.

### Footer

Include:

- Name
- Approved public social links
- Minimal copyright text
- Optional back-to-top interaction

---

## 7. Animation and Interaction Standards

Use Motion for React when animation adds meaningful value.

### Scroll Reveals

- Fade in smoothly
- Vertical movement approximately 16–24px
- Duration around 0.5–0.8 seconds
- Gentle easing
- Small stagger between related elements

### Buttons

- Transition duration around 0.2–0.3 seconds
- Subtle elevation or scale
- Clear hover, focus, and active states
- No exaggerated bounce

### Project Cards

- Small hover elevation
- Gentle image zoom
- Optional tilt limited to approximately 3 degrees
- Disable pointer-dependent effects on touch devices

### Navigation

- Smooth anchor navigation
- Subtle active-state indicators
- Accessible mobile interactions

### General Motion Rules

- Do not animate every element.
- Avoid scroll-jacking.
- Do not hide essential content behind animation.
- Respect `prefers-reduced-motion`.
- Prefer smooth, restrained transitions.
- Keep interactions responsive and performant.

---

## 8. Responsive Design

Build mobile-first.

Support:

- Small mobile screens from 320px
- Standard phones
- Tablets
- Laptops
- Large desktop displays

Requirements:

- No horizontal overflow
- Readable responsive typography
- Touch-friendly controls
- Accessible navigation
- Appropriate image crops
- Simplified 3D on mobile
- Functional layouts without hover
- Consistent spacing at every breakpoint

---

## 9. Accessibility and Performance

### Accessibility

Implement:

- Semantic HTML
- Correct heading hierarchy
- Keyboard navigation
- Visible focus indicators
- Accessible labels
- Descriptive alt text
- Adequate color contrast
- Reduced-motion support
- Touch-friendly targets

### Performance

Implement:

- Optimized images
- Lazy-loaded 3D
- Minimal unnecessary JavaScript
- Efficient animation loops
- Code splitting where useful
- Appropriate static fallbacks
- Lightweight components
- Fast initial rendering

### SEO

Implement:

- Relevant page title
- Meta description
- Open Graph metadata
- Semantic document structure
- Sitemap and robots configuration where appropriate

---

## 10. Suggested Architecture

Use a maintainable project structure similar to:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── ProjectCard.tsx
│   ├── Experience.tsx
│   ├── Education.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── animations/
│   │   └── Reveal.tsx
│   └── three/
│       └── HeroScene.tsx
├── data/
│   └── portfolio.json
├── lib/
│   └── portfolio.ts
└── types/
    └── portfolio.ts
```

This is a suggested architecture, not a requirement to recreate existing files.

Prefer reusable components and strongly typed data.

---

## 11. Implementation Workflow

### Phase 1 — Inspect

1. Inspect the repository.
2. Read `CLAUDE.md`.
3. Read the UI UX Pro Max skill.
4. Read the portfolio JSON.
5. Read the resume.
6. Inspect the profile image.
7. Check available dependencies.
8. Check whether 21st MCP tools are available.
9. Identify missing or conflicting data.

Provide a concise summary of verified content and a short implementation plan.

Do not stop after planning unless essential information or permission is required.

### Phase 2 — Design System

- Establish fonts and colors.
- Define layout containers and spacing.
- Plan responsive typography.
- Create reusable UI primitives.
- Use the UI UX Pro Max skill for design guidance.
- Use 21st MCP selectively to find suitable components.

### Phase 3 — Implement Website

- Build navigation.
- Build hero.
- Build About section with profile image.
- Build skills and projects.
- Build verified experience and education sections.
- Build contact and footer.
- Connect all content to actual data.

### Phase 4 — Add Interactions and 3D

- Add scroll reveals.
- Add refined hover interactions.
- Implement responsive navigation.
- Add the lightweight 3D hero.
- Implement reduced-motion and mobile fallbacks.

### Phase 5 — Polish

Review:

- Typography
- Spacing
- Alignment
- Color consistency
- Card layouts
- Image presentation
- Mobile responsiveness
- Interaction quality
- Loading performance
- Accessibility

### Phase 6 — Verify

Run available project checks, such as:

```bash
npm run lint
npm run build
```

Only execute scripts supported by the actual project configuration.

Fix errors found during verification.

If browser-testing tools are available, use them to inspect desktop and mobile layouts.

Never claim tests passed unless they actually ran.

---

## 12. Claude Code Working Rules

1. Read existing files before editing them.
2. Preserve useful existing code.
3. Make actual code changes instead of only explaining solutions.
4. Prefer clean, maintainable TypeScript.
5. Avoid unnecessary dependencies.
6. Keep content separate from presentation.
7. Never invent personal information.
8. Do not modify or expose MCP credentials.
9. Do not recreate `.mcp.json` unless explicitly requested.
10. Ask permission before destructive operations.
11. Review third-party code before integrating it.
12. Keep the design visually consistent.
13. Do not stop after generating a plan.
14. Fix build and type errors when possible.
15. Summarize completed work and remaining limitations.

---

## 13. Definition of Done

The project is complete when:

- [ ] Verified JSON and resume content is integrated
- [ ] Professional profile image is displayed correctly
- [ ] Premium minimalist design is implemented
- [ ] Relevant portfolio sections are complete
- [ ] Navigation works
- [ ] Project links are valid or omitted
- [ ] Interactive 3D hero works with fallbacks
- [ ] Animations respect reduced-motion settings
- [ ] Mobile and desktop layouts are responsive
- [ ] Accessibility fundamentals are implemented
- [ ] SEO metadata is configured
- [ ] Available build checks pass
- [ ] Website can be launched locally
- [ ] Deployment instructions are documented

## Final Design Principle

**Make it feel premium through simplicity.**

Use exceptional typography, deliberate whitespace, authentic content, elegant interactions, carefully selected components, and one memorable 3D visual.

The result should feel original, sophisticated, fast, accessible, and personal.