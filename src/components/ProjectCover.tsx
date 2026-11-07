import type { CSSProperties } from "react";
import type { ShowcaseProject } from "@/types/portfolio";

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

function PhoneScreen({ title, primary }: { title: string; primary?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3 p-[9%] pt-[16%]">
      <div className="flex items-center gap-2.5">
        <span className="grid aspect-square w-[28%] place-items-center rounded-[28%] bg-[var(--ink)] text-[0.7rem] font-semibold tracking-wide text-white shadow-[0_8px_16px_-8px_var(--ink)] sm:text-xs">
          {primary ? monogram(title) : null}
        </span>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-1.5 w-4/5" />
          <Skeleton className="h-1.5 w-1/2 opacity-60" />
        </div>
      </div>
      <div className="mt-1 aspect-[16/10] rounded-xl bg-[linear-gradient(135deg,var(--from),var(--to))] ring-1 ring-[var(--ink)]/10" />
      <div className="space-y-2">
        {["w-[90%]", "w-[65%]", "w-[80%]"].map((width) => (
          <div key={width} className="flex items-center gap-2">
            <span className="size-4 shrink-0 rounded-md bg-[var(--ink)]/10" />
            <Skeleton className={`h-1.5 ${width}`} />
          </div>
        ))}
      </div>
      <div className="mt-auto h-7 rounded-full bg-[var(--ink)]/85" />
    </div>
  );
}

function Phone({
  title,
  primary,
  className,
}: {
  title: string;
  primary?: boolean;
  className: string;
}) {
  return (
    <div
      className={`absolute aspect-[9/19] rounded-[14%/6.5%] border border-white/70 bg-white/90 p-[3%] shadow-[0_40px_80px_-30px_rgba(23,23,23,0.35)] ${className}`}
    >
      <div className="relative h-full overflow-hidden rounded-[11%/5%] bg-[#fbfbfa]">
        <span className="absolute left-1/2 top-[2.5%] h-[3%] w-[30%] -translate-x-1/2 rounded-full bg-ink/90" />
        <PhoneScreen title={title} primary={primary} />
      </div>
    </div>
  );
}

function Browser({ title }: { title: string }) {
  return (
    <div className="absolute inset-x-[9%] top-[16%] bottom-[-6%] rounded-t-2xl border border-white/70 bg-white/90 p-1.5 shadow-[0_40px_80px_-30px_rgba(23,23,23,0.35)]">
      <div className="flex h-full flex-col overflow-hidden rounded-t-xl bg-[#fbfbfa]">
        <div className="flex items-center gap-1.5 border-b border-ink/5 px-3 py-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-ink/12" />
          ))}
          <span className="ml-3 h-4 flex-1 rounded-full bg-ink/5" />
        </div>
        <div className="flex items-center justify-between px-[5%] py-3">
          <span className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-[var(--ink)] text-[0.55rem] font-semibold text-white">
              {monogram(title)}
            </span>
            <Skeleton className="h-1.5 w-14" />
          </span>
          <span className="flex gap-2">
            <Skeleton className="h-1.5 w-8" />
            <Skeleton className="h-1.5 w-8" />
            <Skeleton className="h-1.5 w-8" />
          </span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-[3%] px-[5%]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square rounded-lg bg-[linear-gradient(135deg,var(--from),var(--to))] ring-1 ring-[var(--ink)]/10" />
              <Skeleton className="h-1.5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ProjectCoverProps = {
  project: ShowcaseProject;
  className?: string;
};

/** Decorative artwork; real screenshots can replace this later. */
export function ProjectCover({ project, className = "" }: ProjectCoverProps) {
  const style = {
    "--from": project.tone.from,
    "--to": project.tone.to,
    "--ink": project.tone.ink,
    // Mockups always use light-theme ink, independent of the page theme.
    "--color-ink": "#171717",
  } as CSSProperties;

  return (
    <div
      aria-hidden
      style={style}
      className={`relative overflow-hidden bg-[linear-gradient(160deg,var(--from),var(--to))] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_0%,rgba(255,255,255,0.7),transparent_70%)]" />
      <div className="absolute inset-0 transition-transform duration-700 ease-out-soft group-hover:scale-[1.035] motion-reduce:transform-none">
        {project.platform === "web" ? (
          <Browser title={project.title} />
        ) : (
          <>
            <Phone
              title={project.title}
              className="left-[50%] top-[18%] w-[30%] -translate-x-[5%] rotate-[6deg] opacity-80"
            />
            <Phone
              title={project.title}
              primary
              className="left-[50%] top-[12%] w-[32%] -translate-x-[78%] -rotate-[3deg]"
            />
          </>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 hidden bg-black/20 dark:block" />
    </div>
  );
}
