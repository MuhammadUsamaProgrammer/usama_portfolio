"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

/**
 * Floating back-to-top button whose ring shows how far down the page you are.
 * Appears once the hero is mostly out of view.
 */
export function ScrollProgressButton() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 0.8;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href="#home"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border border-line bg-surface/80 text-ink shadow-soft backdrop-blur-xl transition-shadow duration-250 hover:shadow-lift sm:right-6 sm:bottom-6"
        >
          <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp
            aria-hidden
            className="size-4 transition-transform duration-250 group-hover:-translate-y-0.5"
          />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
