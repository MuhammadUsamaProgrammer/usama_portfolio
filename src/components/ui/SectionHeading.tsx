import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";

type SectionHeadingProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <Reveal as="header" className={`max-w-3xl ${className}`}>
      <p className="eyebrow flex items-center gap-3">
        <span className="font-mono text-xs tabular-nums text-muted">{index}</span>
        <span aria-hidden className="h-px w-8 bg-line" />
        <span>{eyebrow}</span>
      </p>
      <h2
        id={`${id}-title`}
        className="mt-5 text-headline font-semibold text-balance-safe text-ink"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-lede text-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
