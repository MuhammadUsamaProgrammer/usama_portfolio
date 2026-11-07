"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * requestAnimationFrame loop that only runs while the element is on screen
 * and the tab is visible. `frame` receives the elapsed time in seconds
 * (clamped, so a background tab never produces a huge jump).
 */
export function useVisibleLoop(
  ref: RefObject<HTMLElement | null>,
  frame: (dt: number) => void,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const frameRef = useRef(frame);
  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let last = 0;
    let onScreen = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      frameRef.current(dt);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const update = () => (onScreen && !document.hidden ? start() : stop());

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, enabled]);
}
