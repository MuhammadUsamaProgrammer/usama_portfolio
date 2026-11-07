"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px (16–24 per the motion spec). */
  y?: number;
  as?: "div" | "li" | "article" | "header";
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView">;

/**
 * Fades content in as it enters the viewport.
 * Under `prefers-reduced-motion`, the global <MotionConfig reducedMotion="user">
 * removes the vertical travel so only a gentle fade remains.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
  ...rest
}: RevealProps) {
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
