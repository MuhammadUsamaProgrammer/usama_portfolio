"use client";

import { useEffect, useState, type RefObject } from "react";

/** Device-pixel-ratio ceiling: crisp on desktop, lighter on touch devices. */
export function defaultMaxDpr(): number {
  if (typeof window === "undefined") return 2;
  return window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2;
}

/**
 * Sizes a canvas's backing store for the device pixel ratio while keeping its
 * CSS size at `width` x `height`. Returns the ratio that was applied.
 */
export function sizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  maxDpr = 2,
): number {
  const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return dpr;
}

/** Live content-box size of an element (0 x 0 until first measured). */
export function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
