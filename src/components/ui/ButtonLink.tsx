import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[transform,background-color,box-shadow,color,border-color] duration-250 ease-out-soft " +
  "active:scale-[0.98] motion-reduce:transform-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-on-ink shadow-soft hover:-translate-y-0.5 hover:bg-ink-hover hover:shadow-lift",
  secondary:
    "border border-line bg-surface text-ink shadow-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift",
  ghost: "text-ink hover:bg-subtle",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base sm:h-13 sm:px-7",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  external?: boolean;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
