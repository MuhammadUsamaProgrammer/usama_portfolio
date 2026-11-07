"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useMotionAllowed } from "./hooks";

type ScrollDriftProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px over `distance` px of page scroll. */
  y?: number;
  /** Scale reached at the end of the range. */
  scale?: number;
  /** Opacity reached at the end of the range. */
  fadeTo?: number;
  /** Scroll distance (px from the top of the page) the effect spans. */
  distance?: number;
};

/**
 * Scroll-linked drift for above-the-fold content: as the page scrolls away,
 * the element moves, scales and fades slightly. Never blocks scrolling.
 */
export function ScrollDrift({
  children,
  className,
  y = 60,
  scale = 1,
  fadeTo = 1,
  distance = 700,
}: ScrollDriftProps) {
  const allowed = useMotionAllowed();
  const { scrollY } = useScroll();
  const translateY = useTransform(scrollY, [0, distance], [0, y], { clamp: true });
  const scaleValue = useTransform(scrollY, [0, distance], [1, scale], { clamp: true });
  const opacity = useTransform(scrollY, [0, distance], [1, fadeTo], { clamp: true });

  return (
    <motion.div
      className={className}
      style={allowed ? { y: translateY, scale: scaleValue, opacity } : undefined}
    >
      {children}
    </motion.div>
  );
}
