/**
 * Types describing `src/data/portfolio.json` (the primary content source)
 * and the editorial layer in `src/data/site.ts`.
 */

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatarPath?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  appStoreLink?: string;
  playStoreLink?: string;
  webLink?: string;
}

export interface Skills {
  programmingLanguages: string[];
  frontend: string[];
  backend: string[];
  cloudDevOps: string[];
  mlTools: string[];
  other: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
  impact: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Education {
  degree: string;
  major: string;
  school: string;
  duration: string;
  coursework: string[];
  achievements: string[];
}

export interface Certification {
  name: string;
  platform: string;
  link: string | null;
  date: string;
}

export interface Leadership {
  conferences: string[];
  communities: string[];
  mentorship: string[];
  organizing: string[];
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skills;
  experiences: Experience[];
  contactInfo: ContactInfo;
  education: Education;
  certifications: Certification[];
  leadership: Leadership;
}

/* ------------------------------------------------------------------ */
/* Editorial / presentation-ready shapes                               */
/* ------------------------------------------------------------------ */

export type ProjectPlatform = "mobile" | "web";

/** Extra, resume-verified details layered on top of a JSON project. */
export interface ProjectExtra {
  /** Short, presentation-ready summary. Must preserve the JSON facts. */
  summary: string;
  /** Role as stated on the resume. */
  role: string;
  /** Platforms as stated on the resume. */
  stack: string;
  platform: ProjectPlatform;
  /** Optional verified headline metric from the JSON description. */
  metric?: { value: string; label: string };
  /**
   * Short tool names for chips, taken verbatim from the project's own
   * technology list (used when the JSON entries are long sentences).
   */
  chips?: string[];
  /** Soft tint used for the abstract cover artwork. */
  tone: { from: string; to: string; ink: string };
  featured?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "appStore" | "playStore" | "web";
}

export interface ShowcaseProject extends Project, ProjectExtra {
  index: number;
  links: ProjectLink[];
  /** Chips to render (either `chips` or the JSON technologies). */
  tags: string[];
  /** Long-form highlights, shown when JSON technologies are sentences. */
  highlights: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  icon: SkillIcon;
  items: string[];
}

export type SkillIcon =
  | "code"
  | "layout"
  | "layers"
  | "server"
  | "database"
  | "plug"
  | "cloud"
  | "scan"
  | "users";

export interface RoleStage {
  title: string;
  period: string;
}

export interface TimelineEntry extends Experience {
  current: boolean;
  /** Progression within one company, verified from the resume. */
  stages?: RoleStage[];
}

export interface ContactLink {
  label: string;
  href: string;
  display: string;
  external: boolean;
}
