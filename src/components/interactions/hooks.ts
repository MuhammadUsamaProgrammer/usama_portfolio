"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result. During SSR and hydration it returns
 * `serverValue`, then switches to the real value, so server and client
 * markup always match.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const subscribeResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const readRootScale = () =>
  (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) / 16;

/**
 * Root font size ÷ 16: 1 up to 1440px wide, larger on big screens (see the
 * `html` rule in globals.css). Multiply px sizes by it so they grow with the
 * rest of the rem-based design. 1 during SSR and hydration.
 */
export function useRootScale(): number {
  return useSyncExternalStore(subscribeResize, readRootScale, () => 1);
}

/** True when motion is allowed (no `prefers-reduced-motion`). Hydration-safe. */
export function useMotionAllowed(): boolean {
  return !useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True for a mouse or trackpad with motion allowed. Pointer-driven effects
 * (tilt, magnetic, cursor labels) are disabled on touch devices.
 */
export function useFinePointer(): boolean {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const motionAllowed = useMotionAllowed();
  return fine && motionAllowed;
}
