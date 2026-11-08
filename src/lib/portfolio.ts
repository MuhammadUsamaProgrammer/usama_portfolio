import raw from "@/data/portfolio.json";
import { withBase } from "@/lib/base-path";
import mediaManifest from "@/data/project-media.json";
import {
  experienceStages,
  projectExtras,
  publicContactKeys,
  skillGroups as skillGroupDefs,
} from "@/data/site";
import type {
  ContactLink,
  MediaManifestEntry,
  PortfolioData,
  Project,
  ProjectMedia,
  ProjectTone,
  ProjectLink,
  ShowcaseProject,
  SkillGroup,
  TimelineEntry,
} from "@/types/portfolio";

export const portfolio = raw as PortfolioData;

const { personalInfo, projects, skills, experiences, contactInfo, education } =
  portfolio;

export { personalInfo, education };

/** Replace exclamation marks with full stops for a calmer editorial tone. */
export function calm(text: string): string {
  return text.replace(/!+/g, ".").replace(/\.\.+/g, ".");
}

/* ----------------------------- Projects ----------------------------- */

const SHORT_TAG_MAX = 32;

/** Neutral backdrop for projects without a custom tone. */
const DEFAULT_TONE: ProjectTone = { from: "#F1F1EE", to: "#E2E2DD", ink: "#3F3F46" };

const media = mediaManifest as Record<string, MediaManifestEntry>;

/** Same rule the media script uses to name project image folders. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectMedia(project: Project): ProjectMedia | null {
  const entry = media[project.title];
  if (!entry || (entry.screens.length === 0 && !entry.icon)) return null;
  return {
    icon: entry.icon ? { ...entry.icon, src: withBase(entry.icon.src), alt: `${project.title} app icon` } : null,
    screens: entry.screens.map((screen) => ({
      ...screen,
      src: withBase(screen.src),
      alt: `${project.title} — ${screen.caption}`,
    })),
  };
}

function projectLinks(project: Project): ProjectLink[] {
  const links: ProjectLink[] = [];
  if (project.appStoreLink)
    links.push({ label: "App Store", href: project.appStoreLink, kind: "appStore" });
  if (project.playStoreLink)
    links.push({ label: "Google Play", href: project.playStoreLink, kind: "playStore" });
  if (project.webLink)
    links.push({ label: "Visit live site", href: project.webLink, kind: "web" });
  return links;
}

export const showcaseProjects: ShowcaseProject[] = projects.map((project, i) => {
  const extra = projectExtras[project.title] ?? {};
  const webOnly = Boolean(project.webLink) && !project.appStoreLink && !project.playStoreLink;
  const longForm = project.technologies.some((t) => t.length > SHORT_TAG_MAX);

  return {
    ...project,
    index: i + 1,
    slug: slugify(project.title),
    summary: extra.summary ?? calm(project.description),
    role: extra.role,
    stack: extra.stack,
    platform: extra.platform ?? (webOnly ? "web" : "mobile"),
    mediaStyle: extra.mediaStyle ?? "screens",
    metric: extra.metric,
    tone: extra.tone ?? DEFAULT_TONE,
    featured: extra.featured ?? false,
    media: projectMedia(project),
    links: projectLinks(project),
    tags: extra.chips ?? project.technologies,
    highlights: longForm ? project.technologies : [],
  };
});

/* ------------------------------ Skills ------------------------------ */

function allJsonSkills(): string[] {
  return [
    ...skills.programmingLanguages,
    ...skills.frontend,
    ...skills.backend,
    ...skills.cloudDevOps,
    ...skills.mlTools,
    ...skills.other,
  ];
}

export const skillGroups: SkillGroup[] = (() => {
  const available = new Set(allJsonSkills());
  const used = new Set<string>();

  const groups: SkillGroup[] = skillGroupDefs.map((def) => {
    const items = def.items.filter((item) => available.has(item));
    items.forEach((item) => used.add(item));
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      items: [...items, ...(def.resume ?? [])],
    };
  });

  // Never silently drop a skill that exists in the JSON.
  const leftovers = [...available].filter((s) => !used.has(s));
  if (leftovers.length > 0) {
    groups.push({
      id: "more",
      title: "More",
      description: "Additional tools and practices.",
      icon: "layers",
      items: leftovers,
    });
  }

  return groups.filter((g) => g.items.length > 0);
})();

/* ---------------------------- Experience ---------------------------- */

const CURRENT_MARKERS = /\b(continue|present|current)\b/i;

export const timeline: TimelineEntry[] = experiences.map((exp) => {
  const current = CURRENT_MARKERS.test(exp.duration);
  return {
    ...exp,
    duration: exp.duration.replace(/\bContinue\b/i, "Present"),
    impact: calm(exp.impact),
    current,
    stages: experienceStages[exp.company],
  };
});

/* ------------------------------ Contact ----------------------------- */

/** "https://wa.me/923180063687" → "+92 318 0063687" */
function phoneFromWhatsApp(url: string): string {
  const digits = url.replace(/\D/g, "");
  return digits.startsWith("92") && digits.length === 12
    ? `+92 ${digits.slice(2, 5)} ${digits.slice(5)}`
    : `+${digits}`;
}

/** "https://github.com/user/" → "user" */
function handleFromUrl(url: string): string {
  const segments = url.replace(/\/+$/, "").split("/");
  return segments[segments.length - 1] ?? url;
}

export const contactLinks: ContactLink[] = publicContactKeys.flatMap((key): ContactLink[] => {
  const value = contactInfo[key];
  if (!value) return [];
  switch (key) {
    case "email":
      return [{ kind: "email", label: "Email", href: `mailto:${value}`, display: value, external: false }];
    case "linkedin":
      return [{ kind: "linkedin", label: "LinkedIn", href: value, display: handleFromUrl(value), external: true }];
    case "github":
      return [{ kind: "github", label: "GitHub", href: value, display: handleFromUrl(value), external: true }];
    case "whatsapp":
      return [{ kind: "whatsapp", label: "WhatsApp", href: value, display: phoneFromWhatsApp(value), external: true }];
    default:
      return [];
  }
});

export const email = contactInfo.email;
