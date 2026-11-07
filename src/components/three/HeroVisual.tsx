"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { HeroFallback } from "./HeroFallback";

/** Three.js / R3F are code-split and only fetched on the client, after idle. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type Capabilities = { simplified: boolean; still: boolean };

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [caps, setCaps] = useState<Capabilities | null>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const dark = useTheme() === "dark";

  // Decide whether (and how) to load 3D once the browser is idle.
  useEffect(() => {
    if (!supportsWebGL()) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px), (pointer: coarse)");

    const load = () =>
      setCaps({ simplified: small.matches, still: reduceMotion.matches });

    const onMotionChange = () =>
      setCaps((prev) => (prev ? { ...prev, still: reduceMotion.matches } : prev));
    reduceMotion.addEventListener("change", onMotionChange);

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(load, 600);
    }

    return () => {
      reduceMotion.removeEventListener("change", onMotionChange);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // Stop rendering when the hero is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative size-full" aria-hidden>
      {/* Soft contact shadow, product-photography style. */}
      <div className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-10 rounded-[100%] bg-black/10 blur-2xl dark:bg-black/70" />

      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out-soft ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <HeroFallback />
      </div>

      {caps ? (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-out-soft ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <SceneBoundary>
            <HeroScene
              simplified={caps.simplified}
              still={caps.still}
              paused={!inView}
              dark={dark}
              onReady={() => setReady(true)}
            />
          </SceneBoundary>
        </div>
      ) : null}
    </div>
  );
}
