"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "./hooks";

const SPRING = { stiffness: 200, damping: 22, mass: 0.6 };

type TiltFrameProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
};

/** Subtle 3D tilt with a soft glare that follows the cursor (fine pointers only). */
export function TiltFrame({ children, className = "", max = 4 }: TiltFrameProps) {
  const enabled = useFinePointer();
  const rx = useSpring(useMotionValue(0), SPRING);
  const ry = useSpring(useMotionValue(0), SPRING);
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glareOpacity = useSpring(useMotionValue(0), SPRING);
  const glare = useMotionTemplate`radial-gradient(60% 50% at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 70%)`;

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    glareOpacity.set(1);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 1200 } : undefined}
      className={`relative ${className}`}
    >
      {children}
      {enabled ? (
        <motion.div
          aria-hidden
          style={{ backgroundImage: glare, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
        />
      ) : null}
    </motion.div>
  );
}
