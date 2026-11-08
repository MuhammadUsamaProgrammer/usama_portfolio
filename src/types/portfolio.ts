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
  /** wa.me link, e.g. "https://wa.me/923180063687". */
  whatsapp?: string;
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

/**
 * How a project's screenshots are presented:
 * - "screens": raw UI captures, shown inside a device frame (phone or browser)
 * - "artwork": store graphics or photos that already include devices, shown as-is
 */
export type MediaStyle = "screens" | "artwork";

export interface ProjectTone {
  from: string;
  to: string;
  ink: string;
}

/**
 * Optional editorial details layered on top of a JSON project.
 * Every field has a sensible default, so a new project only needs its
 * JSON entry (plus an image folder) to appear on the site.
 */
export interface ProjectExtra {
  /** Short, presentation-ready summary. Defaults to the JSON description. */
  summary?: string;
  /** Role as stated on the resume. */
  role?: string;
  /** Platforms as stated on the resume. */
  stack?: string;
  /** Defaults to "web" when the project only has a web link, else "mobile". */
  platform?: ProjectPlatform;
  /** Defaults to "screens". */
  mediaStyle?: MediaStyle;
  /** Optional verified headline metric from the JSON description. */
  metric?: { value: string; label: string };
  /**
   * Short tool names for chips, taken verbatim from the project's own
   * technology list (used when the JSON entries are long sentences).
   */
  chips?: string[];
  /** Soft backdrop tint behind the project imagery. */
  tone?: ProjectTone;
  featured?: boolean;
}

/** Shape written by scripts/generate-project-media.mjs. */
export interface MediaManifestEntry {
  slug: string;
  icon: { src: string; width: number; height: number } | null;
  screens: { src: string; caption: string; width: number; height: number }[];
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

export interface ProjectMedia {
  icon: ProjectImage | null;
  screens: ProjectImage[];
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "appStore" | "playStore" | "web";
}

export interface ShowcaseProject extends Project {
  index: number;
  slug: string;
  summary: string;
  role?: string;
  stack?: string;
  platform: ProjectPlatform;
  mediaStyle: MediaStyle;
  metric?: { value: string; label: string };
  tone: ProjectTone;
  featured: boolean;
  /** Real imagery from public/images/projects/<slug>/, if any. */
  media: ProjectMedia | null;
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
  kind: "email" | "linkedin" | "github" | "whatsapp";
  label: string;
  href: string;
  display: string;
  external: boolean;
}

/* ------------------------------------------------------------------ */
/* Certificates                                                        */
/* ------------------------------------------------------------------ */

/** One entry in src/data/certificates.json (hand-written, verified from the PDF). */
export interface CertificateEntry {
  /** File name without extension in public/pdf/certificates/. */
  file: string;
  title: string;
  /** Organisation that authorised the course, e.g. "IBM". */
  issuer: string;
  /** Where it was taken, e.g. "Coursera". */
  platform?: string;
  /** Completion date, YYYY-MM-DD. */
  date: string;
  /** Public verification page, if the issuer provides one. */
  verifyUrl?: string;
}

/** Shape written by scripts/generate-certificates.mjs. */
export interface CertificateFileInfo {
  pdf: string;
  sizeBytes: number;
  preview: { src: string; width: number; height: number } | null;
}

export interface Certificate extends CertificateEntry {
  pdf: string;
  preview: CertificateFileInfo["preview"];
  /** "Jul 24, 2026" */
  dateLabel: string;
  /** "PDF · 309 KB" */
  sizeLabel: string;
}
