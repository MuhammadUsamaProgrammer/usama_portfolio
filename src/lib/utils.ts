/**
 * Joins class names, skipping falsy values. Mirrors the signature of
 * shadcn/ui's `cn` so shadcn-style components work unchanged. (shadcn's
 * version also de-duplicates conflicting Tailwind classes via
 * tailwind-merge; add that dependency if a component relies on it.)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
