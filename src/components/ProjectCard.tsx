"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState, type PointerEvent } from "react";
import { ProjectCover } from "@/components/ProjectCover";
import type { ShowcaseProject } from "@/types/portfolio";

type ProjectCardProps = {
  project: ShowcaseProject;
  variant: "featured" | "grid";
  /** Flip the cover to the right on featured cards. */
  reverse?: boolean;
};

const SPRING = { stiffness: 220, damping: 24, mass: 0.6 };

/** Pointer tilt only for fine pointers with motion allowed. */
function useCanTilt() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduce;
}

export function ProjectCard({ project, variant, reverse = false }: ProjectCardProps) {
  const featured = variant === "featured";
  const maxTilt = featured ? 1.5 : 3;
  const canTilt = useCanTilt();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!canTilt) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * maxTilt * 2);
    rx.set(-py * maxTilt * 2);
  }

  function resetTilt() {
    rx.set(0);
    ry.set(0);
  }

  const tagLimit = featured ? 9 : 6;
  const visibleTags = project.tags.slice(0, tagLimit);
  const hiddenCount = project.tags.length - visibleTags.length;
  const titleId = `project-${project.index}-title`;

  return (
    <motion.article
      aria-labelledby={titleId}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-soft transition-[box-shadow,border-color,translate] duration-300 ease-out-soft hover:-translate-y-1 hover:border-line-strong hover:shadow-lift motion-reduce:hover:translate-y-0 ${
        featured ? "lg:grid lg:grid-cols-2" : ""
      }`}
    >
      <ProjectCover
        project={project}
        className={
          featured
            ? `aspect-[4/3] lg:aspect-auto lg:min-h-[34rem] ${reverse ? "lg:order-2" : ""}`
            : "aspect-[16/11]"
        }
      />

      <div
        className={`flex flex-1 flex-col ${
          featured ? "p-7 sm:p-10 lg:p-12 xl:p-14" : "p-7 sm:p-8"
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted">
          <span className="font-mono tabular-nums">{String(project.index).padStart(2, "0")}</span>
          <span aria-hidden className="h-px w-5 bg-line" />
          <span>{project.stack}</span>
          <span aria-hidden>·</span>
          <span>{project.role}</span>
        </div>

        <h3
          id={titleId}
          className={`mt-5 font-semibold text-ink ${
            featured ? "text-headline" : "text-title"
          }`}
        >
          {project.title}
        </h3>

        <p
          className={`mt-4 leading-relaxed text-muted ${
            featured ? "max-w-xl text-[1.0625rem] sm:text-lg" : "text-[0.9375rem]"
          }`}
        >
          {project.summary}
        </p>

        {project.metric ? (
          <p className="mt-6 flex items-baseline gap-2">
            <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
              {project.metric.value}
            </span>
            <span className="text-sm text-muted">{project.metric.label}</span>
          </p>
        ) : null}

        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-subtle px-3 py-1 text-[0.8125rem] leading-5 text-ink/80"
            >
              {tag}
            </li>
          ))}
          {hiddenCount > 0 ? (
            <li className="rounded-full px-2 py-1 text-[0.8125rem] leading-5 text-muted">
              +{hiddenCount} more
            </li>
          ) : null}
        </ul>

        {project.highlights.length > 0 ? (
          <details className="group/details mt-5 rounded-2xl border border-line">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              Key features
              <ChevronDown
                aria-hidden
                className="size-4 text-muted transition-transform duration-250 group-open/details:rotate-180"
              />
            </summary>
            <ul className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-muted">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink/30" />
                  {item}
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        {project.links.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-8">
            {project.links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — ${link.label} (opens in a new tab)`}
                className={`group/link inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-[background-color,border-color,transform] duration-250 active:scale-[0.98] ${
                  i === 0
                    ? "bg-ink text-on-ink hover:bg-ink-hover"
                    : "border border-line text-ink hover:border-line-strong hover:bg-subtle"
                }`}
              >
                {link.label}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 opacity-70 transition-transform duration-250 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
