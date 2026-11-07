"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "./hooks";

const SPRING = { stiffness: 260, damping: 18, mass: 0.5 };

type MagneticProps = {
  children: ReactNode;
  /** Share of the pointer offset the child follows (0–1). */
  strength?: number;
  /** Maximum travel in px. */
  max?: number;
  className?: string;
};

/**
 * Gently pulls its child toward the cursor while hovered. The wrapper stays
 * put (stable hit area); only the child moves. Grid layout lets the child
 * fill the wrapper when a parent stretches it (e.g. full-width mobile CTAs).
 */
export function Magnetic({ children, strength = 0.22, max = 8, className = "" }: MagneticProps) {
  const enabled = useFinePointer();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-max, Math.min(max, dx)));
    y.set(Math.max(-max, Math.min(max, dy)));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className={`grid ${className}`} onPointerMove={onPointerMove} onPointerLeave={reset}>
      <motion.div className="grid" style={enabled ? { x, y } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}
