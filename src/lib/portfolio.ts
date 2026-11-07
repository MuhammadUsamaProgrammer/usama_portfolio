import raw from "@/data/portfolio.json";
import {
  experienceStages,
  projectExtras,
  publicContactKeys,
  skillGroups as skillGroupDefs,
} from "@/data/site";
import type {
  ContactLink,
  PortfolioData,
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

export const showcaseProjects: ShowcaseProject[] = projects.map((project, i) => {
  const extra = projectExtras[project.title];
  if (!extra) {
    throw new Error(
      `Missing editorial entry for project "${project.title}" in src/data/site.ts`,
    );
  }

  const links: ProjectLink[] = [];
  if (project.appStoreLink)
    links.push({ label: "App Store", href: project.appStoreLink, kind: "appStore" });
  if (project.playStoreLink)
    links.push({ label: "Google Play", href: project.playStoreLink, kind: "playStore" });
  if (project.webLink)
    links.push({ label: "Visit live site", href: project.webLink, kind: "web" });

  const longForm = project.technologies.some((t) => t.length > SHORT_TAG_MAX);

  return {
    ...project,
    ...extra,
    index: i + 1,
    links,
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
      return [{ label: "Email", href: `mailto:${value}`, display: value, external: false }];
    case "linkedin":
      return [{ label: "LinkedIn", href: value, display: handleFromUrl(value), external: true }];
    case "github":
      return [{ label: "GitHub", href: value, display: handleFromUrl(value), external: true }];
    default:
      return [];
  }
});

export const email = contactInfo.email;
