"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useMediaQuery, useMotionAllowed } from "@/components/interactions/hooks";
import type { ProjectImage } from "@/types/portfolio";

type ProjectGalleryProps = {
  title: string;
  icon: ProjectImage | null;
  screens: ProjectImage[];
  initialIndex?: number;
  onClose: () => void;
};

type Size = { width: number; height: number };
type SlideBox = { left: number; width: number; height: number };

const SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;
const INSTANT = { duration: 0 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/** "Customer · Instant login" → { group: "Customer", text: "Instant login" } */
function splitCaption(caption?: string) {
  if (!caption) return { group: null, text: "" };
  const [first, ...rest] = caption.split(" · ");
  return rest.length > 0 ? { group: first, text: rest.join(" · ") } : { group: null, text: first };
}

/** Visual state of a slide by its distance from the active one. */
function slideState(distance: number) {
  if (distance === 0) return { scale: 1, opacity: 1 };
  if (distance === 1) return { scale: 0.86, opacity: 0.5 };
  if (distance === 2) return { scale: 0.78, opacity: 0.22 };
  return { scale: 0.72, opacity: 0 };
}

/**
 * Full-screen screenshot carousel. Mount it only while open: it opens itself
 * as a modal <dialog> (focus trap, Escape and focus return are native).
 *
 * - Active screen centred, neighbours visible (click to jump), drag/swipe
 * - Large arrow buttons, thumbnail strip, animated caption and progress
 * - Keyboard: ← → Home End, Esc to close
 */
export function ProjectGallery({
  title,
  icon,
  screens,
  initialIndex = 0,
  onClose,
}: ProjectGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const positioned = useRef(false);

  const [index, setIndex] = useState(initialIndex);
  const [stage, setStage] = useState<Size | null>(null);
  const motionAllowed = useMotionAllowed();
  const touch = useMediaQuery("(pointer: coarse)");
  const x = useMotionValue(0);
  const last = screens.length - 1;

  /* Open as a modal and lock page scroll while mounted. */
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  /* Measure the stage; slides are sized to fit it. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!stage) return null;
    const compact = stage.width < 640;
    const gap = compact ? 14 : 28;
    const maxHeight = stage.height;
    let left = 0;
    const slides: SlideBox[] = screens.map((screen) => {
      const aspect = screen.width / screen.height;
      // Wide (desktop) screenshots get more room on phones; neighbours still peek.
      const maxWidth = stage.width * (compact ? (aspect > 1 ? 0.88 : 0.78) : 0.6);
      let height = maxHeight;
      let width = height * aspect;
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspect;
      }
      const box = { left, width, height };
      left += width + gap;
      return box;
    });
    return { slides, compact };
  }, [stage, screens]);

  const offsetFor = useCallback(
    (i: number) => {
      if (!layout || !stage) return 0;
      const box = layout.slides[i];
      return stage.width / 2 - (box.left + box.width / 2);
    },
    [layout, stage],
  );

  /* Glide the track to the active slide (instant on first paint). */
  useEffect(() => {
    if (!layout) return;
    const target = offsetFor(index);
    if (!positioned.current) {
      x.jump(target);
      positioned.current = true;
      return;
    }
    const controls = animate(x, target, motionAllowed ? SPRING : INSTANT);
    return () => controls.stop();
  }, [index, layout, offsetFor, motionAllowed, x]);

  /* Keep the active thumbnail centred in the strip. */
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,
      behavior: motionAllowed ? "smooth" : "auto",
    });
  }, [index, motionAllowed]);

  const goTo = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(last, next))),
    [last],
  );

  const close = useCallback(() => dialogRef.current?.close(), []);

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => goTo(index + 1),
      ArrowLeft: () => goTo(index - 1),
      Home: () => goTo(0),
      End: () => goTo(last),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    const swiped = Math.abs(offset.x) > 60 || Math.abs(velocity.x) > 500;
    const next = swiped ? index + (offset.x < 0 ? 1 : -1) : index;
    const clamped = Math.max(0, Math.min(last, next));
    if (clamped !== index) setIndex(clamped);
    else animate(x, offsetFor(index), motionAllowed ? SPRING : INSTANT);
    // The click that follows a drag must not count as a tap.
    requestAnimationFrame(() => {
      dragged.current = false;
    });
  }

  /* Clicking empty space around the slides closes the viewer. */
  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    if (dragged.current) return;
    if (event.target === event.currentTarget || event.target === trackRef.current) close();
  }

  const current = screens[index];
  const { group, text } = splitCaption(current?.caption);
  const transition = motionAllowed ? SPRING : INSTANT;

  const arrow =
    "absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-[background-color,opacity,transform] duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:size-14";

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} screenshots`}
      aria-roledescription="carousel"
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden bg-[#09090b] p-0 text-white backdrop:bg-black/80 open:animate-[gallery-in_0.35s_var(--ease-out-soft)]"
    >
      {/* Ambient glow taken from the active screenshot. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {current ? (
            <motion.div
              key={current.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={current.src}
                alt=""
                fill
                sizes="64px"
                className="scale-125 object-cover blur-3xl saturate-150"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent,rgba(9,9,11,0.85))]" />
      </div>

      <div className="relative flex h-full flex-col">
        {/* Progress */}
        <div aria-hidden className="h-0.5 w-full bg-white/10">
          <motion.div
            className="h-full origin-left bg-white/80"
            animate={{ scaleX: (index + 1) / screens.length }}
            transition={transition}
          />
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-5">
          <div className="flex min-w-0 items-center gap-3">
            {icon ? (
              <Image
                src={icon.src}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-[22%] ring-1 ring-white/15"
              />
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-medium">{title}</p>
              <p className="font-mono text-xs text-white/55 tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(screens.length).padStart(2, "0")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            autoFocus
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 pr-4 pl-3 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
          >
            <X aria-hidden className="size-4" />
            Close
            <kbd className="hidden rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.6875rem] text-white/60 sm:inline">
              Esc
            </kbd>
          </button>
        </header>

        {/* Stage */}
        <div className="relative min-h-0 flex-1 py-4 sm:py-6">
          <div ref={stageRef} className="relative size-full" onClick={onStageClick}>
            {layout && stage ? (
              <motion.div
                ref={trackRef}
                className="absolute inset-y-0 left-0 cursor-grab touch-pan-y active:cursor-grabbing"
                style={{ x, width: layout.slides[last].left + layout.slides[last].width }}
                drag="x"
                dragMomentum={false}
                dragElastic={0.12}
                dragConstraints={{ left: offsetFor(last), right: offsetFor(0) }}
                onDragStart={() => {
                  dragged.current = true;
                }}
                onDragEnd={onDragEnd}
              >
                {screens.map((screen, i) => {
                  const box = layout.slides[i];
                  const distance = Math.abs(i - index);
                  const active = distance === 0;
                  const portrait = screen.height > screen.width;
                  return (
                    <motion.div
                      key={screen.src}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} of ${screens.length}: ${screen.caption ?? screen.alt}`}
                      aria-hidden={!active}
                      onClick={() => {
                        if (!dragged.current && !active) goTo(i);
                      }}
                      className={`absolute ${active ? "" : "cursor-pointer"}`}
                      style={{
                        left: box.left,
                        top: (stage.height - box.height) / 2,
                        width: box.width,
                        height: box.height,
                      }}
                      initial={motionAllowed ? { opacity: 0, scale: 0.9 } : false}
                      animate={slideState(distance)}
                      transition={transition}
                    >
                      <Image
                        src={screen.src}
                        alt={screen.alt}
                        width={screen.width}
                        height={screen.height}
                        sizes={`${Math.ceil(box.width)}px`}
                        loading={distance <= 1 ? "eager" : "lazy"}
                        draggable={false}
                        className={`size-full select-none object-contain ring-1 ring-white/10 transition-shadow duration-500 ${
                          portrait
                            ? layout.compact
                              ? "rounded-[1.25rem]"
                              : "rounded-[1.75rem]"
                            : "rounded-xl"
                        } ${active ? "shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" : ""}`}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : null}

            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous screenshot"
              className={`${arrow} left-3 sm:left-8`}
            >
              <ChevronLeft aria-hidden className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === last}
              aria-label="Next screenshot"
              className={`${arrow} right-3 sm:right-8`}
            >
              <ChevronRight aria-hidden className="size-5 sm:size-6" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="flex min-h-14 items-center justify-center px-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={motionAllowed ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={motionAllowed ? { opacity: 0, y: -8 } : undefined}
              transition={{ duration: 0.22, ease: EASE }}
              className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center"
            >
              {group ? (
                <span className="rounded-full bg-white/12 px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.06em] text-white/80 uppercase ring-1 ring-white/10">
                  {group}
                </span>
              ) : null}
              <span className="text-[0.9375rem] font-medium sm:text-base">{text}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        <div
          ref={stripRef}
          className="relative overflow-x-auto px-4 pt-2 pb-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-max gap-2 py-1.5">
            {screens.map((screen, i) => {
              const active = i === index;
              return (
                <button
                  key={screen.src}
                  type="button"
                  data-thumb={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to screenshot ${i + 1}: ${screen.caption ?? screen.alt}`}
                  aria-current={active ? "true" : undefined}
                  style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
                  className={`relative h-12 shrink-0 rounded-lg transition-[opacity,transform] duration-300 sm:h-16 ${
                    active ? "opacity-100" : "opacity-40 hover:-translate-y-0.5 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={screen.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="rounded-lg object-cover"
                  />
                  {active ? (
                    <motion.span
                      layoutId="gallery-thumb"
                      aria-hidden
                      transition={transition}
                      className="absolute -inset-1 rounded-[0.7rem] ring-2 ring-white"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <p className="pb-4 text-center text-xs text-white/45 sm:pb-5">
          {touch ? "Swipe or tap a thumbnail to browse" : "Use ← → keys, drag, or click a screen to browse"}
        </p>
      </div>
    </dialog>
  );
}
