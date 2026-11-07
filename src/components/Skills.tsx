import {
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
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/lib/portfolio";
import type { SkillIcon } from "@/types/portfolio";

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

export function Skills() {
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

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-5">
          {skillGroups.map((group, i) => {
            const Icon = ICONS[group.icon];
            return (
              <Reveal
                as="li"
                key={group.id}
                delay={(i % 3) * 0.06}
                className="group flex flex-col rounded-[1.5rem] border border-line bg-bg p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface hover:shadow-lift sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink transition-colors duration-300 group-hover:text-accent">
                    <Icon aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.015em] text-ink">
                  {group.title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                  {group.description}
                </p>
                <ul
                  aria-label={`${group.title} skills`}
                  className="mt-6 flex flex-wrap gap-1.5"
                >
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-surface px-3 py-1 text-[0.8125rem] leading-5 text-ink/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
