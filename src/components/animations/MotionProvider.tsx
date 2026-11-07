"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honors the OS-level reduced-motion preference for every Motion component. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
