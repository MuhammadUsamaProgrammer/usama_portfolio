/**
 * Editorial content layer.
 *
 * `portfolio.json` stays the primary source of truth. This file only holds
 * presentation-ready copy and resume-verified extras. Every statement here
 * is derived from `portfolio.json` or `reference/Muhammad Usama - Resume.pdf`.
 * Do not add facts that are not present in those two sources.
 */
import type { ProjectExtra, RoleStage, SkillIcon } from "@/types/portfolio";

export const site = {
  /** Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-domain.com). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  seo: {
    title: "Muhammad Usama — Flutter Developer",
    description:
      "Flutter developer with 3+ years of experience and 30+ production apps on the App Store and Google Play. Cross-platform apps for iOS, Android and the web.",
    keywords: [
      "Muhammad Usama",
      "Flutter Developer",
      "Mobile App Developer",
      "Dart",
      "iOS",
      "Android",
      "Flutter Web",
      "Portfolio",
    ],
  },
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export const hero = {
  lead: "Flutter developer crafting beautiful, high‑performance apps for iOS, Android and the web.",
  intro:
    "3+ years of hands-on experience and 30+ production apps live on the App Store and Google Play — from Coca‑Cola’s Coke D2H to real-time vehicle recovery and booking platforms.",
  stats: [
    { value: "3+", label: "Years of Flutter experience" },
    { value: "30+", label: "Production apps shipped" },
    { value: "100K+", label: "Users across both stores" },
  ],
};

export const about = {
  heading: "Turning ideas into apps people rely on.",
  paragraphs: [
    "I’m Muhammad Usama, a Flutter developer with over three years of hands-on experience building cross-platform applications for iOS, Android and the web. I’ve delivered 30+ production-ready apps that are live on the App Store and Google Play — including brand work such as Coca‑Cola’s Coke D2H.",
    "My work centres on clean architecture and dependable delivery: MVVM and proven design patterns, state management with GetX, Provider, Riverpod and Bloc, and integrations spanning REST, GraphQL and WebSockets, real-time GPS tracking, live chat, and payments with Stripe, Apple Pay and Google Pay.",
    "Beyond code, I’ve led development teams, coordinated sprints with remote teams across time zones, and turned tight deadlines into successful launches — while pursuing a BS in Information Technology at Bahria University Lahore.",
  ],
  focus: [
    "Cross-platform apps with Flutter",
    "Clean architecture & design patterns",
    "Real-time features & payments",
    "Team leadership & delivery",
  ],
  beyond: [
    "Mobile Team Co-Lead, GDGoC Bahria University",
    "Flutter bootcamps for students",
    "Volleyball, representing university teams",
  ],
};

/**
 * Optional, resume-verified details per project, keyed by the exact JSON
 * title. Summaries keep the JSON facts in a calmer editorial tone. A project
 * without an entry still renders (the summary falls back to the JSON
 * description). Images live in public/images/projects/<slug>/.
 */
export const projectExtras: Record<string, ProjectExtra> = {
  "All Out Adventures": {
    summary:
      "A complete booking management system for the UAE’s top entertainment and adventure activities — seamless booking with real-time availability and instant confirmations.",
    role: "Mobile Developer (Solo)",
    stack: "iOS & Android",
    platform: "mobile",
    metric: { value: "30,000+", label: "downloads" },
    tone: { from: "#E8F1FC", to: "#CFE1F6", ink: "#1F5FA8" },
    mediaStyle: "artwork",
    featured: true,
  },
  GotStuck: {
    summary:
      "A vehicle recovery and roadside-assistance platform with real-time GPS tracking, a number plate scanner and integrated payments — four apps in total, Customer and Provider on both platforms.",
    role: "Mobile Developer (Team)",
    stack: "iOS & Android",
    platform: "mobile",
    metric: { value: "2,000+", label: "downloads" },
    tone: { from: "#FBF4DF", to: "#F2E1AE", ink: "#6E5512" },
    mediaStyle: "artwork",
    featured: true,
  },
  "Coke D2H": {
    summary:
      "A beverage ordering app for the Coca‑Cola brand — buy your favourite Coca‑Cola products through a seamless ordering experience.",
    role: "Mobile Developer (Solo)",
    stack: "iOS & Android",
    platform: "mobile",
    tone: { from: "#F9E9E7", to: "#EFCFCB", ink: "#8E2A22" },
  },
  Denowatts: {
    summary:
      "A technician app for Deno setup and configuration, with multi-threading, real-time hardware tracking and GraphQL integration — built for demanding performance requirements.",
    role: "Mobile Developer (Solo)",
    stack: "iOS & Android",
    platform: "mobile",
    tone: { from: "#E8EDF7", to: "#CFD9EE", ink: "#24427A" },
  },
  "MerchMint Web App": {
    summary:
      "A fully responsive Flutter eCommerce web app with Stripe payments, a Firebase backend and an admin panel — customers explore products and variants, while admins manage companies, products and variant pricing.",
    role: "Full Stack Flutter Web Developer (Solo)",
    stack: "Web — desktop, tablet & mobile",
    platform: "web",
    tone: { from: "#F0EEEB", to: "#DDD8D1", ink: "#3A3530" },
  },
  "Wird Book": {
    summary:
      "A spiritual app providing daily Islamic litanies (wird) based on Prophetic traditions, guiding users in structured remembrance and connection with Allah.",
    role: "Mobile Developer (Team)",
    stack: "iOS & Android",
    platform: "mobile",
    chips: [
      "Riverpod",
      "Dio + Retrofit",
      "Freezed",
      "AudioService",
      "JustAudio",
      "SQLite",
    ],
    tone: { from: "#E9F0E7", to: "#D1E0CD", ink: "#2F5530" },
  },
};

/**
 * Skill grouping. Items reference exact strings from `portfolio.json`
 * (any JSON skill not listed here is appended to a final group
 * automatically, so nothing is silently dropped). Entries marked
 * `resume` are verified from the resume.
 */
export const skillGroups: {
  id: string;
  title: string;
  description: string;
  icon: SkillIcon;
  items: string[];
  resume?: string[];
}[] = [
  {
    id: "languages",
    title: "Languages",
    description: "Dart first, with native platform languages when needed.",
    icon: "code",
    items: ["Dart", "JavaScript", "Java", "Kotlin", "Swift"],
  },
  {
    id: "frontend",
    title: "Frontend & UI",
    description: "Pixel-perfect, responsive interfaces across platforms.",
    icon: "layout",
    items: [
      "Flutter (iOS & Android)",
      "Flutter Web",
      "Responsive Design",
      "Material Design",
      "Cupertino Design",
      "Custom UI/UX",
    ],
  },
  {
    id: "architecture",
    title: "Architecture & State",
    description: "Scalable structure and predictable state.",
    icon: "layers",
    items: [
      "MVC & MVVM Architecture",
      "GetX State Management",
      "Provider",
      "Riverpod",
      "Bloc",
      "Flutter Gen, Freezed and Code Gen",
      "Multi-threading (Isolates)",
    ],
  },
  {
    id: "apis",
    title: "APIs & Backend",
    description: "Robust networking and Firebase-powered backends.",
    icon: "server",
    items: [
      "REST APIs",
      "GraphQL APIs",
      "WebSockets",
      "Interceptors",
      "Firebase Realtime DB",
      "Firebase Firestore",
      "Firebase Authentication",
      "Swagger",
      "Postman",
    ],
  },
  {
    id: "data",
    title: "Data & Offline",
    description: "Apps that keep working when the network doesn’t.",
    icon: "database",
    items: [
      "Local Database (Hive, SQLite)",
      "Offline Caching and Download Manager Patterns",
      "Background Services",
      "PDF Handling",
    ],
  },
  {
    id: "integrations",
    title: "Real-time & Integrations",
    description: "Maps, live tracking, native channels and payments.",
    icon: "plug",
    items: [
      "Google Maps Integration",
      "GPS Real-time Tracking",
      "Real-Time Chat",
      "Firebase Notifications (FCM)",
      "Platform-Specific Integration (Method Channels)",
      "In-App Purchases (Apple/Google Pay)",
      "Stripe Payment Gateway",
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "From version control to store release.",
    icon: "cloud",
    items: [
      "Firebase",
      "Google Cloud",
      "CI/CD",
      "GitHub",
      "BitBucket",
      "Version Control",
    ],
    resume: ["Play Store / App Store Deployment"],
  },
  {
    id: "ml",
    title: "Machine Learning",
    description: "On-device recognition for practical features.",
    icon: "scan",
    items: ["Firebase ML Kit", "Number Plate Scanner", "Image Recognition"],
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "Teams, timelines and stakeholders.",
    icon: "users",
    items: ["Team Leadership", "Project Management"],
  },
];

/** Role progression within a company, verified from the resume. */
export const experienceStages: Record<string, RoleStage[]> = {
  BuiltInSoft: [
    { title: "Flutter Developer Intern", period: "Oct 2022 – Jan 2023" },
    { title: "Flutter Developer (Onsite)", period: "Jan 2023 – Apr 2024" },
    { title: "Flutter Developer (Remote)", period: "Apr 2024 – Aug 2024" },
  ],
};

export const leadership = {
  heading: "Leadership & community",
  items: [
    {
      title: "Mobile Team Co-Lead",
      org: "GDGoC Bahria University",
      detail:
        "Guiding students in their tech journey and organizing workshops and events.",
    },
    {
      title: "Flutter Bootcamps",
      org: "Bahria University",
      detail: "Trained 50+ students in mobile app development.",
    },
    {
      title: "Mentorship",
      org: "BuiltInSoft & Blue Bit Bite",
      detail:
        "Mentored team members and interns, with code reviews and technical guidance.",
    },
    {
      title: "Knowledge Sharing",
      org: "Internal tech talks",
      detail: "Shared Flutter best practices, state management and architecture patterns.",
    },
  ],
};

/**
 * Public contact channels. The phone number and the WhatsApp link stored in
 * `contactInfo.twitter` are intentionally NOT published (private info).
 */
export const publicContactKeys = ["email", "linkedin", "github"] as const;

export const contact = {
  heading: "Let’s Build Something Meaningful.",
  body: "Have an app idea, a product to scale, or a team that needs a dependable Flutter developer? I’d love to hear about it.",
};
