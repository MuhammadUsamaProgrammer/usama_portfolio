"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems, type SectionId } from "@/data/site";
import { personalInfo } from "@/lib/portfolio";
import { ThemeToggle } from "./ThemeToggle";

/** Sections without their own nav item map onto a parent item. */
const SECTION_ALIASES: Record<string, SectionId> = { education: "experience" };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Scroll-spy: highlight the section crossing the middle of the viewport. */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const mapped = (SECTION_ALIASES[id] ?? id) as SectionId;
          if (navItems.some((item) => item.id === mapped)) setActive(mapped);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  /* Mobile menu: Escape to close, click outside to close, focus first link. */
  useEffect(() => {
    if (!open) return;

    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        closeMenu(false);
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) closeMenu(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [open, closeMenu]);

  const desktopItems = navItems.filter((item) => item.id !== "home");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-page">
        <nav
          aria-label="Primary"
          className={`pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border pl-2 pr-2 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow,border-color] duration-300 ${
            scrolled || open
              ? "border-line/80 bg-surface/75 shadow-soft"
              : "border-transparent bg-surface/40"
          }`}
        >
          <a
            href="#home"
            className="flex min-h-11 items-center gap-2.5 rounded-full pr-3 pl-1"
            aria-label={`${personalInfo.name} — back to top`}
          >
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[0.6875rem] font-medium tracking-wider text-on-ink"
            >
              {initials(personalInfo.name)}
            </span>
            <span className="hidden text-[0.9375rem] font-medium tracking-tight text-ink sm:inline">
              {personalInfo.name}
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 md:flex">
            {desktopItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative z-10 flex h-10 items-center rounded-full px-4 text-sm transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-subtle ring-1 ring-line/70"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle className="size-11 md:size-10" />
            <a
              href="#contact"
              className="hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-on-ink transition-[background-color,transform] duration-250 hover:bg-ink-hover active:scale-[0.98] md:inline-flex"
            >
              Get in touch
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-subtle md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                ref={panelRef}
                id="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-[1.75rem] border border-line bg-surface p-2 shadow-lift md:hidden"
              >
                <ul className="flex flex-col">
                  {navItems.map((item) => {
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={isActive ? "location" : undefined}
                          onClick={() => closeMenu(false)}
                          className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-[1.0625rem] transition-colors ${
                            isActive ? "bg-subtle text-ink" : "text-ink/80 hover:bg-subtle"
                          }`}
                        >
                          {item.label}
                          {isActive ? (
                            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}
