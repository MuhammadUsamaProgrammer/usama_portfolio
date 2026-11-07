"use client";

import { motion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useMotionAllowed } from "./hooks";

type ScrollHighlightProps = {
  text: string;
  className?: string;
};

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // 0 → muted, 1 → ink; the color blend itself lives in CSS (.scroll-word).
  const mix = useTransform(progress, range, [0, 1]);
  return (
    <>
      <motion.span className="scroll-word" style={{ "--p": mix } as MotionStyle}>
        {word}
      </motion.span>{" "}
    </>
  );
}

/**
 * Paragraph whose words brighten from muted to ink as it scrolls through the
 * viewport. Every in-between color is a blend of two AA-compliant tokens, so
 * the text stays readable at all times, in both themes.
 */
export function ScrollHighlight({ text, className = "" }: ScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const allowed = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });

  if (!allowed) {
    return (
      <p ref={ref} className={`text-ink ${className}`}>
        {text}
      </p>
    );
  }

  const words = text.split(/\s+/);
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </p>
  );
}
