import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  RAIL_LOGOS,
  SKILL_LOGOS,
  isDarkBrand,
  logoForSkill,
  type SkillLogo,
} from "@/data/skill-logos";
import { skillGroups } from "@/lib/portfolio";
import type { SkillIcon } from "@/types/portfolio";
import {
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Layers,
  LayoutTemplate,
  Plug,
  ScanLine,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

const ICONS: Record<SkillIcon, LucideIcon> = {
  code: Code2,
  layout: LayoutTemplate,
  layers: Layers,
  server: Server,
  database: Database,
  plug: Plug,
  cloud: Cloud,
  scan: ScanLine,
  users: Users,
};

/**
 * Brand colour goes in --brand (inline); --logo is what gets painted. It is set
 * by class so near-black brands (GitHub, Java, SQLite) can switch to ink in dark mode.
 */
function logoStyle(logo: SkillLogo): CSSProperties {
  return { ["--brand" as string]: logo.hex };
}
function logoClass(logo: SkillLogo): string {
  return isDarkBrand(logo.hex)
    ? "[--logo:var(--brand)] dark:[--logo:var(--color-ink)]"
    : "[--logo:var(--brand)]";
}

function LogoGlyph({ logo, className }: { logo: SkillLogo; className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`fill-[var(--logo)] ${className}`}>
      <path d={logo.path} />
    </svg>
  );
}

/** One app-icon tile with its name underneath. */
function LogoTile({ logo }: { logo: SkillLogo }) {
  return (
    <li
      style={logoStyle(logo)}
      className={`group/tile mr-4 flex w-20 shrink-0 flex-col items-center gap-2.5 sm:mr-5 ${logoClass(logo)}`}
    >
      <span className="grid size-16 place-items-center rounded-[1.15rem] border border-line bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out-soft group-hover/tile:-translate-y-1 group-hover/tile:border-[color-mix(in_oklab,var(--logo)_35%,var(--color-line))] group-hover/tile:shadow-[0_14px_30px_-12px_color-mix(in_oklab,var(--logo)_55%,transparent)] motion-reduce:transform-none">
        <LogoGlyph logo={logo} className="size-8" />
      </span>
      <span className="text-center text-[0.75rem] leading-tight text-muted transition-colors duration-300 group-hover/tile:text-ink">
        {logo.title}
      </span>
    </li>
  );
}

export function Skills() {
  const logos = RAIL_LOGOS.map((key) => SKILL_LOGOS[key]);
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="section-space border-y border-line bg-surface"
    >
      <div className="container-page">
        <SectionHeading
          id="skills"
          index="02"
          eyebrow="Skills"
          title="A complete toolkit for shipping production apps."
          description="From the first widget to store release — the languages, frameworks and practices I use every day."
        />
      </div>

      {/* Logo rail: glides slowly, pauses on hover; static and wrapped with reduced motion. */}
      <Reveal className="mt-14 lg:mt-16">
        <div className="group/rail relative overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]">
          <div className="flex w-max animate-[marquee_60s_linear_infinite] group-hover/rail:[animation-play-state:paused] motion-reduce:container-page motion-reduce:w-auto motion-reduce:animate-none">
            <ul aria-label="Technologies I work with" className="flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6">
              {logos.map((logo) => (
                <LogoTile key={logo.title} logo={logo} />
              ))}
            </ul>
            {/* Second copy makes the loop seamless; hidden from assistive tech. */}
            <ul aria-hidden className="flex motion-reduce:hidden">
              {logos.map((logo) => (
                <LogoTile key={logo.title} logo={logo} />
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/*
        Every JSON skill, grouped. Folded by default to keep the section short;
        <details> keeps it in the page for search engines and screen readers.
      */}
      <div className="container-page">
        <details className="group/all mt-10 lg:mt-12">
          <summary className="mx-auto flex h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-bg px-5 text-sm font-medium text-ink shadow-soft transition-[background-color,transform] duration-250 hover:-translate-y-0.5 hover:bg-subtle [&::-webkit-details-marker]:hidden">
            <span className="group-open/all:hidden">Show all skills</span>
            {/* <span className="group-open/all:hidden">Show all {total} skills</span> */}
            <span className="hidden group-open/all:inline">Hide the full list</span>
            <ChevronDown
              aria-hidden
              className="size-4 text-muted transition-transform duration-300 group-open/all:rotate-180"
            />
          </summary>
        <ul className="mt-10 grid animate-[gallery-fade_0.4s_ease-out] gap-x-10 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = ICONS[group.icon];
            return (
              <li key={group.id} className="border-t border-line py-6">
                <h3 className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
                  <Icon aria-hidden className="size-4 text-muted" strokeWidth={1.75} />
                  {group.title}
                  <span className="ml-auto font-mono text-xs tabular-nums text-muted">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </h3>
                <ul aria-label={`${group.title} skills`} className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => {
                    const key = logoForSkill(item);
                    const logo = key ? SKILL_LOGOS[key] : null;
                    return (
                      <li
                        key={item}
                        style={logo ? logoStyle(logo) : undefined}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 text-[0.8125rem] leading-5 text-ink/85 ${logo ? logoClass(logo) : ""}`}
                      >
                        {logo ? <LogoGlyph logo={logo} className="size-3.5 shrink-0" /> : null}
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        </details>
      </div>
    </section>
  );
}
