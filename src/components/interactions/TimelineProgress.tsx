"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useMotionAllowed } from "./hooks";

/**
 * Vertical timeline rail: a thin neutral line with an accent fill that grows
 * as the timeline scrolls past the middle of the viewport.
 */
export function TimelineProgress({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const allowed = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <span ref={ref} aria-hidden className={`absolute w-px bg-line ${className}`}>
      {allowed ? (
        <motion.span
          style={{ scaleY }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/40"
        />
      ) : null}
    </span>
  );
}
