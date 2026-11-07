import type { ReactNode } from "react";

/*
 * Device frames. Every measurement uses container-query units (cqw = 1% of
 * the frame's own width), so proportions hold at any size. Each frame fills
 * its parent: give the parent the matching aspect ratio.
 */

/** Outer width / height of the iPhone frame (screen is 9:19.5). */
export const IPHONE_ASPECT = 0.478;
/** Outer width / height of the MacBook frame (lid + base). */
export const MACBOOK_ASPECT = 1.631;

const SIDE_BUTTON = "absolute w-[1.5cqw] bg-[linear-gradient(90deg,#7d7e83,#d6d6da_55%,#a1a2a7)]";
const ALUMINIUM = "bg-[linear-gradient(180deg,#e3e4e7,#c3c4c8_45%,#9d9ea3)]";

/**
 * Modern iPhone: thin titanium band, slim black bezel, iPhone corner radii,
 * Dynamic Island, side buttons and a faint glass reflection.
 * `children` is the screen content (e.g. a `fill` image).
 */
export function IPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="@container relative size-full">
      {/* Left: action button, volume up, volume down. Right: side button. */}
      <span className={`${SIDE_BUTTON} -left-[0.9cqw] top-[17%] h-[3.4%] rounded-l-[1cqw]`} />
      <span className={`${SIDE_BUTTON} -left-[0.9cqw] top-[23.5%] h-[6.5%] rounded-l-[1cqw]`} />
      <span className={`${SIDE_BUTTON} -left-[0.9cqw] top-[31.5%] h-[6.5%] rounded-l-[1cqw]`} />
      <span className={`${SIDE_BUTTON} -right-[0.9cqw] top-[26%] h-[10.5%] rounded-r-[1cqw]`} />

      {/* Titanium band */}
      <div className="absolute inset-0 rounded-[17cqw] bg-[linear-gradient(140deg,#e6e6e9,#9c9da2_22%,#dedee2_48%,#86878c_74%,#cbcbcf)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55),0_10px_24px_-12px_rgba(0,0,0,0.35)]" />
      {/* Bezel */}
      <div className="absolute inset-[1cqw] rounded-[16cqw] bg-[#050506] shadow-[inset_0_0_0_0.3cqw_rgba(255,255,255,0.07)]" />
      {/* Screen */}
      <div className="absolute inset-[3.2cqw] overflow-hidden rounded-[13.3cqw] bg-white">
        {children}
        {/* Dynamic Island */}
        <span className="absolute top-[2.6cqw] left-1/2 h-[8.6cqw] w-[29cqw] -translate-x-1/2 rounded-full bg-black" />
        {/* Glass reflection */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.16),rgba(255,255,255,0)_36%)]" />
      </div>
    </div>
  );
}

/**
 * MacBook Pro-style laptop: black bezel with notch, aluminium edge and base,
 * a minimal menu bar and a browser toolbar showing `url`.
 * `children` is the page content below the toolbar (e.g. a `fill` image).
 */
export function MacBookFrame({ children, url }: { children: ReactNode; url?: string }) {
  return (
    <div className="@container relative size-full">
      {/* Lid */}
      <div className="absolute top-0 left-[6cqw] h-[58.7cqw] w-[88cqw] rounded-t-[3cqw] rounded-b-[0.8cqw] bg-[#0a0a0b] shadow-[0_0_0_0.3cqw_#b5b6ba,0_40px_80px_-30px_rgba(0,0,0,0.55)]">
        {/* Screen */}
        <div className="absolute top-[1.6cqw] right-[1.6cqw] bottom-[2.8cqw] left-[1.6cqw] flex flex-col overflow-hidden rounded-[1cqw] bg-white">
          {/* Menu bar */}
          <div className="flex h-[1.9cqw] shrink-0 items-center justify-between bg-[#ececee] px-[1.6cqw]">
            <span className="flex gap-[1cqw]">
              {[2.4, 3.2, 2.6, 2.8].map((w, i) => (
                <span key={i} style={{ width: `${w}cqw` }} className="h-[0.55cqw] rounded-full bg-black/25" />
              ))}
            </span>
            <span className="flex gap-[0.9cqw]">
              {[1.2, 1.2, 3.6].map((w, i) => (
                <span key={i} style={{ width: `${w}cqw` }} className="h-[0.55cqw] rounded-full bg-black/25" />
              ))}
            </span>
          </div>
          {/* Browser toolbar */}
          <div className="flex h-[3.2cqw] shrink-0 items-center gap-[2cqw] border-b border-black/8 bg-[#f6f6f7] px-[1.6cqw]">
            <span className="flex gap-[0.6cqw]">
              <span className="size-[0.95cqw] rounded-full bg-[#ff5f57]" />
              <span className="size-[0.95cqw] rounded-full bg-[#febc2e]" />
              <span className="size-[0.95cqw] rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto flex h-[1.9cqw] w-[34cqw] items-center justify-center truncate rounded-[0.6cqw] bg-black/[0.055] px-[1cqw] text-[1.05cqw] leading-none text-black/55">
              {url ?? ""}
            </span>
            <span className="w-[3.6cqw]" />
          </div>
          {/* Page */}
          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
          {/* Glass reflection */}
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_32%)]" />
        </div>
        {/* Notch */}
        <span className="absolute top-[1.6cqw] left-1/2 h-[1.7cqw] w-[9cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-[#0a0a0b]" />
      </div>

      {/* Base */}
      <div
        className={`absolute top-[58.7cqw] left-0 h-[2.6cqw] w-full rounded-t-[0.4cqw] rounded-b-[50%_100%] ${ALUMINIUM} shadow-[0_14px_24px_-12px_rgba(0,0,0,0.45)]`}
      >
        {/* Thumb groove */}
        <span className="absolute top-0 left-1/2 h-[0.9cqw] w-[14cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-[linear-gradient(180deg,#8f9095,#b8b9bd)]" />
      </div>
    </div>
  );
}

/** "https://www.example.com/path" → "example.com" */
export function displayHost(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
