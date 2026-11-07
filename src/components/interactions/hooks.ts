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
