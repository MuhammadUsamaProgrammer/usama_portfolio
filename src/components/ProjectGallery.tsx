"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProjectImage } from "@/types/portfolio";

type ProjectGalleryProps = {
  title: string;
  icon: ProjectImage | null;
  screens: ProjectImage[];
  initialIndex?: number;
  onClose: () => void;
};

/**
 * Full-screen screenshot viewer. Mount it only while open: it opens itself
 * as a modal <dialog> (focus trap, Escape, focus return are native), and
 * swiping uses native scroll-snap.
 */
export function ProjectGallery({
  title,
  icon,
  screens,
  initialIndex = 0,
  onClose,
}: ProjectGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  /** Slide being scrolled to; lets rapid key presses queue up correctly. */
  const targetRef = useRef(initialIndex);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const track = trackRef.current;
    if (!dialog || !track) return;
    if (!dialog.open) dialog.showModal();
    track.scrollLeft = initialIndex * track.clientWidth;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [initialIndex]);

  // Closing via close() lets the browser restore focus to the opener.
  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(screens.length - 1, targetRef.current + delta));
      targetRef.current = target;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: target * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [screens.length],
  );

  // Keep the active slide aligned if the viewport is resized.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      track.scrollLeft = Math.round(track.scrollLeft / track.clientWidth) * track.clientWidth;
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const position = track.scrollLeft / track.clientWidth;
    setIndex(Math.round(position));
    // Once settled on a slide (including after a swipe), sync the target.
    if (Math.abs(position - Math.round(position)) < 0.01) targetRef.current = Math.round(position);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  const current = screens[index];
  const button =
    "grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-[background-color,opacity] duration-200 hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30";

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} screenshots`}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-[rgb(8_8_9/0.9)] backdrop:backdrop-blur-md open:animate-[gallery-in_0.3s_var(--ease-out-soft)] backdrop:animate-[gallery-fade_0.3s_ease-out]"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
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
              <p className="text-xs text-white/60 tabular-nums" aria-live="polite">
                {index + 1} / {screens.length}
              </p>
            </div>
          </div>
          <button type="button" onClick={close} aria-label="Close gallery" className={button} autoFocus>
            <X aria-hidden className="size-5" />
          </button>
        </header>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {screens.map((screen, i) => {
            const portrait = screen.height > screen.width;
            return (
              <div
                key={screen.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${screens.length}: ${screen.caption ?? screen.alt}`}
                onClick={(event) => event.target === event.currentTarget && close()}
                className="flex w-full shrink-0 snap-center items-center justify-center px-4 py-5 sm:px-20"
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  sizes={portrait ? "(min-width: 640px) 440px, 90vw" : "(min-width: 1280px) 1180px, 94vw"}
                  className={`h-auto max-h-[calc(100svh-10.5rem)] w-auto max-w-full object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ${
                    portrait ? "rounded-[1.5rem]" : "rounded-xl"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <footer className="flex items-center justify-between gap-4 px-4 pb-5 sm:px-8 sm:pb-7">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={index === 0}
            aria-label="Previous screenshot"
            className={button}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm text-white/80">
            {current?.caption}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={index === screens.length - 1}
            aria-label="Next screenshot"
            className={button}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </footer>
      </div>
    </dialog>
  );
}
