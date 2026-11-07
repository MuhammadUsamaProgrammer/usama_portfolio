"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { IPhoneFrame, MacBookFrame, displayHost } from "@/components/devices";
import { useMotionAllowed } from "@/components/interactions/hooks";
import type { ProjectImage, ShowcaseProject } from "@/types/portfolio";

/* ------------------------------------------------------------------ */
/* Real imagery                                                        */
/* ------------------------------------------------------------------ */

const PHONE_SIZES = "(min-width: 1024px) 300px, (min-width: 640px) 30vw, 40vw";
const BROWSER_SIZES = "(min-width: 1024px) 560px, 90vw";

/** Fanned layouts. Heights are relative to the cover; widths follow each image's aspect. */
const LAYOUTS = {
  two: [
    { className: "left-1/2 top-[15%] h-[78%] -translate-x-[8%] rotate-[5deg]", back: true },
    { className: "left-1/2 top-[8%] h-[86%] -translate-x-[88%] -rotate-[3deg]", back: false },
  ],
  three: [
    { className: "left-1/2 top-[17%] h-[70%] -translate-x-[138%] -rotate-[6deg]", back: true },
    { className: "left-1/2 top-[17%] h-[70%] translate-x-[38%] rotate-[6deg]", back: true },
    { className: "left-1/2 top-[9%] h-[82%] -translate-x-1/2", back: false },
  ],
} as const;

/** Raw UI capture shown on an iPhone. */
function PhoneShot({ image, className }: { image: ProjectImage; className: string }) {
  return (
    <div className={`absolute aspect-[0.478] ${className}`}>
      <IPhoneFrame>
        <Image src={image.src} alt="" fill sizes={PHONE_SIZES} className="object-cover object-top" />
      </IPhoneFrame>
    </div>
  );
}

/** Store graphic or photo that already contains a device. */
function ArtworkShot({ image, className }: { image: ProjectImage; className: string }) {
  return (
    <div
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      className={`absolute overflow-hidden rounded-[1.1rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 ${className}`}
    >
      <Image src={image.src} alt="" fill sizes={PHONE_SIZES} className="object-cover" />
    </div>
  );
}

function LaptopShot({ image, url }: { image: ProjectImage; url?: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 aspect-[1.631] w-[84%] -translate-x-1/2 -translate-y-[47%]">
      <MacBookFrame url={url}>
        <Image
          src={image.src}
          alt=""
          fill
          sizes={BROWSER_SIZES}
          className="object-cover object-top transition-[object-position] duration-[4s] ease-in-out group-hover:object-bottom motion-reduce:transition-none motion-reduce:group-hover:object-top"
        />
      </MacBookFrame>
    </div>
  );
}

function MediaArt({ project, rich }: { project: ShowcaseProject; rich: boolean }) {
  const screens = project.media?.screens ?? [];

  if (project.platform === "web") {
    return <LaptopShot image={screens[0]} url={displayHost(project.webLink)} />;
  }

  const layout = rich && screens.length >= 3 ? LAYOUTS.three : LAYOUTS.two;
  // Front image is screens[0]; back images take the next ones in order.
  const backs = screens.slice(1, layout.length);
  const Shot = project.mediaStyle === "artwork" ? ArtworkShot : PhoneShot;

  let backIndex = 0;
  return (
    <>
      {layout.map((slot, i) => {
        const image = slot.back ? backs[backIndex++] : screens[0];
        if (!image) return null;
        return <Shot key={i} image={image} className={slot.className} />;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Abstract fallback (projects without images yet)                     */
/* ------------------------------------------------------------------ */

function monogram(title: string) {
  const words = title.replace(/web app/i, "").trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const capitals = words[0].match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) return capitals.slice(0, 2).join("");
  return words[0].slice(0, 2).toUpperCase();
}

function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`block rounded-full bg-[var(--ink)]/12 ${className}`} />;
}

function AbstractPhone({ title, className }: { title: string; className: string }) {
  return (
    <div className={`absolute aspect-[0.478] ${className}`}>
    <IPhoneFrame>
      <div className="flex h-full flex-col gap-3 bg-[#fbfbfa] p-[9%] pt-[22%]">
        <div className="flex items-center gap-2.5">
          <span className="grid aspect-square w-[28%] place-items-center rounded-[28%] bg-[var(--ink)] text-[0.7rem] font-semibold text-white">
            {monogram(title)}
          </span>
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-1.5 w-4/5" />
            <Skeleton className="h-1.5 w-1/2 opacity-60" />
          </div>
        </div>
        <div className="aspect-[16/10] rounded-xl bg-[linear-gradient(135deg,var(--from),var(--to))]" />
        {["w-[90%]", "w-[65%]", "w-[80%]"].map((width) => (
          <Skeleton key={width} className={`h-1.5 ${width}`} />
        ))}
        <div className="mt-auto h-7 rounded-full bg-[var(--ink)]/85" />
      </div>
    </IPhoneFrame>
    </div>
  );
}

function AbstractArt({ project }: { project: ShowcaseProject }) {
  return (
    <>
      <AbstractPhone title={project.title} className="left-1/2 top-[15%] h-[78%] -translate-x-[8%] rotate-[5deg] opacity-80" />
      <AbstractPhone title={project.title} className="left-1/2 top-[8%] h-[86%] -translate-x-[88%] -rotate-[3deg]" />
    </>
  );
}

/* ------------------------------------------------------------------ */

type ProjectCoverProps = {
  project: ShowcaseProject;
  /** Larger layout (three screens) for featured cards. */
  rich?: boolean;
  className?: string;
};

/** Decorative cover: real screenshots when available, abstract artwork otherwise. */
export function ProjectCover({ project, rich = false, className = "" }: ProjectCoverProps) {
  const style = {
    "--from": project.tone.from,
    "--to": project.tone.to,
    "--ink": project.tone.ink,
  } as CSSProperties;
  const hasScreens = (project.media?.screens.length ?? 0) > 0;

  // Imagery drifts slightly against the card while scrolling, for depth.
  const ref = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = rich ? 32 : 22;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={style}
      className={`overflow-hidden bg-[linear-gradient(160deg,var(--from),var(--to))] dark:bg-[linear-gradient(160deg,color-mix(in_oklab,var(--ink)_38%,#141416),color-mix(in_oklab,var(--ink)_14%,#111113))] ${className}`}
    >
      {/* Soft top light; screenshots above always stay true to color. */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_0%,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(80%_60%_at_70%_0%,rgba(255,255,255,0.08),transparent_70%)]" />
      <motion.div className="absolute inset-0" style={allowed ? { y } : undefined}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out-soft group-hover:scale-[1.035] motion-reduce:transform-none">
          {hasScreens ? <MediaArt project={project} rich={rich} /> : <AbstractArt project={project} />}
        </div>
      </motion.div>
    </div>
  );
}
