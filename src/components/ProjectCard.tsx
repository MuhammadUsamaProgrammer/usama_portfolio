"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronDown, Images } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, type PointerEvent } from "react";
import { useFinePointer } from "@/components/interactions/hooks";
import { displayHost } from "@/components/devices";
import { ProjectCover } from "@/components/ProjectCover";
import { ProjectGallery } from "@/components/ProjectGallery";
import type { ShowcaseProject } from "@/types/portfolio";

type ProjectCardProps = {
  project: ShowcaseProject;
  variant: "featured" | "grid";
  /** Flip the cover to the right on featured cards. */
  reverse?: boolean;
};

const SPRING = { stiffness: 220, damping: 24, mass: 0.6 };
const CURSOR_SPRING = { stiffness: 520, damping: 42, mass: 0.35 };

export function ProjectCard({ project, variant, reverse = false }: ProjectCardProps) {
  const featured = variant === "featured";
  const maxTilt = featured ? 1.5 : 3;
  // Tilt and the cursor label only run for mouse/trackpad with motion allowed.
  const canTilt = useFinePointer();

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

  /* "View" label that follows the cursor over the cover. */
  const labelX = useSpring(useMotionValue(0), CURSOR_SPRING);
  const labelY = useSpring(useMotionValue(0), CURSOR_SPRING);
  const [coverHover, setCoverHover] = useState(false);

  function placeLabel(event: PointerEvent<HTMLElement>, jump: boolean) {
    if (!canTilt) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (jump) {
      labelX.jump(x);
      labelY.jump(y);
    } else {
      labelX.set(x);
      labelY.set(y);
    }
  }

  const tagLimit = featured ? 9 : 6;
  const visibleTags = project.tags.slice(0, tagLimit);
  const hiddenCount = project.tags.length - visibleTags.length;
  const titleId = `project-${project.slug}-title`;
  const screens = project.media?.screens ?? [];
  const icon = project.media?.icon ?? null;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const meta = [project.stack, project.role].filter(Boolean);

  const coverLayout = featured
    ? `aspect-[4/3] lg:aspect-auto lg:min-h-[34rem] ${reverse ? "lg:order-2" : ""}`
    : "aspect-[16/11]";

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
      {screens.length > 0 ? (
        <button
          type="button"
          onClick={() => setGalleryOpen(true)}
          aria-label={`View ${screens.length} screenshots of ${project.title}`}
          onPointerEnter={(event) => {
            placeLabel(event, true);
            setCoverHover(true);
          }}
          onPointerMove={(event) => placeLabel(event, false)}
          onPointerLeave={() => setCoverHover(false)}
          className={`relative block w-full overflow-hidden ${canTilt ? "cursor-none" : "cursor-zoom-in"} text-left focus-visible:outline-offset-[-6px] focus-visible:rounded-[1.75rem] ${coverLayout}`}
        >
          <ProjectCover project={project} rich={featured} className="absolute inset-0" />
          <span className="absolute bottom-4 left-4 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/85 px-3 text-xs font-medium text-[#171717] shadow-soft ring-1 ring-black/5 backdrop-blur transition-colors duration-200 group-hover:bg-white">
            <Images aria-hidden className="size-3.5" />
            {screens.length} screens
          </span>
          {canTilt ? (
            <motion.span
              aria-hidden
              style={{ x: labelX, y: labelY }}
              className="pointer-events-none absolute left-0 top-0 z-10"
            >
              <span className="block -translate-x-1/2 -translate-y-1/2">
                <motion.span
                  initial={false}
                  animate={coverHover ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-11 items-center gap-1.5 rounded-full bg-ink pr-3.5 pl-4 text-sm font-medium text-on-ink shadow-lift"
                >
                  View
                  <ArrowUpRight className="size-4" />
                </motion.span>
              </span>
            </motion.span>
          ) : null}
        </button>
      ) : (
        <ProjectCover project={project} rich={featured} className={`relative ${coverLayout}`} />
      )}

      <div
        className={`flex flex-1 flex-col ${
          featured ? "p-7 sm:p-10 lg:p-12 xl:p-14" : "p-7 sm:p-8"
        }`}
      >
        <div className="flex items-center gap-4">
          {icon ? (
            <Image
              src={icon.src}
              alt={icon.alt}
              width={featured ? 56 : 48}
              height={featured ? 56 : 48}
              className={`shrink-0 rounded-[22%] shadow-soft ring-1 ring-line ${
                featured ? "size-14" : "size-12"
              }`}
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted">
            <span className="font-mono tabular-nums">{String(project.index).padStart(2, "0")}</span>
            {meta.map((item) => (
              <span key={item} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-5 bg-line" />
                {item}
              </span>
            ))}
          </div>
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

        {project.links.length > 0 || screens.length > 0 ? (
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
            {screens.length > 0 ? (
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-ink transition-[background-color,transform] duration-250 hover:bg-subtle active:scale-[0.98]"
              >
                <Images aria-hidden className="size-4 opacity-70" />
                View screens
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {galleryOpen ? (
        <ProjectGallery
          title={project.title}
          icon={icon}
          screens={screens}
          device={
            project.platform === "web"
              ? "macbook"
              : project.mediaStyle === "screens"
                ? "iphone"
                : null
          }
          url={displayHost(project.webLink)}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </motion.article>
  );
}
