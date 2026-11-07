"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionAllowed } from "./hooks";

const FORMAT = new Intl.NumberFormat("en-US");

/**
 * Counts a stat like "30+" or "100K+" up from zero when it scrolls into view.
 * The final value is server-rendered and announced to assistive tech as is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const allowed = useMotionAllowed();
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null || !inView || !allowed) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        el.textContent = `${FORMAT.format(Math.round(n))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, allowed, target, suffix]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
