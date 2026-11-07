"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type SpotlightGroupProps = {
  children: ReactNode;
  className?: string;
  as?: "ul" | "div";
};

/**
 * Feeds the cursor position to every `.spotlight` card inside, so a soft
 * light follows the pointer and also catches the borders of nearby cards.
 * Purely visual: styles live in globals.css (fine pointers only).
 */
export function SpotlightGroup({ children, className, as: Tag = "ul" }: SpotlightGroupProps) {
  const frame = useRef(0);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const container = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      container.querySelectorAll<HTMLElement>(".spotlight").forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${clientX - rect.left}px`);
        card.style.setProperty("--my", `${clientY - rect.top}px`);
      });
    });
  }

  return (
    <Tag data-spotlight-group className={className} onPointerMove={onPointerMove}>
      {children}
    </Tag>
  );
}
