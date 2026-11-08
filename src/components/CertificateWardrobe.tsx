"use client";

import { ArrowUpRight, BadgeCheck, FileText, X } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SkateDeckRail, { type SkateDeck } from "@/components/ui/skate-deck-rail";
import type { Certificate } from "@/types/portfolio";

/** Fallback card shape when no preview exists (a landscape certificate). */
const DEFAULT_ASPECT = 1.294;

function escapeXml(text: string) {
  return text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** A plain paper card for certificates that have no preview image yet. */
function placeholderCard(c: Certificate): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1294 1000'>
<rect width='1294' height='1000' fill='#fbfbfa'/>
<rect x='28' y='28' width='1238' height='944' fill='none' stroke='#d6d6d6' stroke-width='4'/>
<text x='110' y='380' font-family='Georgia, serif' font-size='40' fill='#71717a'>${escapeXml(c.issuer)}</text>
<text x='110' y='480' font-family='Georgia, serif' font-size='64' fill='#171717'>${escapeXml(c.title.length > 34 ? `${c.title.slice(0, 33)}…` : c.title)}</text>
<text x='110' y='560' font-family='Georgia, serif' font-size='36' fill='#71717a'>${escapeXml(c.dateLabel)}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

type CertificateWardrobeProps = {
  certificates: Certificate[];
  /** Certificate facing the front when the wardrobe opens. */
  initialIndex?: number | null;
  onClose: () => void;
};

/**
 * Full-screen "wardrobe" of every certificate, hung on a rail. Mount it only
 * while open. Brush along the rail to face a certificate; click to lift it
 * into a detail view with the PDF and verification links.
 */
export function CertificateWardrobe({ certificates, initialIndex = null, onClose }: CertificateWardrobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const detailOpen = useRef(false);
  const [active, setActive] = useState<number | null>(initialIndex);

  const aspect = useMemo(() => {
    const preview = certificates.find((c) => c.preview)?.preview;
    return preview ? preview.width / preview.height : DEFAULT_ASPECT;
  }, [certificates]);

  const items: SkateDeck[] = useMemo(
    () =>
      certificates.map((c) => ({
        id: c.file,
        name: c.title,
        series: c.issuer,
        tag: c.date.slice(0, 4),
        description: `An online course authorised by ${c.issuer}${
          c.platform ? ` and offered through ${c.platform}` : ""
        }. Completed ${c.dateLabel}.`,
        details: [c.dateLabel, c.platform, c.sizeLabel].filter(Boolean) as string[],
        image: c.preview?.src ?? placeholderCard(c),
      })),
    [certificates],
  );

  // Modal behaviour: lock scroll, make the page behind inert, focus Close,
  // and restore everything (including focus) on unmount.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== root && !el.inert,
    );
    siblings.forEach((el) => {
      el.inert = true;
    });
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = previousOverflow;
      siblings.forEach((el) => {
        el.inert = false;
      });
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Escape closes the wardrobe, unless a certificate is lifted (the detail
  // view handles its own Escape first).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !detailOpen.current) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="All certificates"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg text-ink animate-[gallery-in_0.35s_var(--ease-out-soft)]"
    >
      <div className="flex justify-end px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink shadow-soft transition-colors duration-200 hover:bg-subtle"
        >
          <X aria-hidden className="size-4" />
          Close
          <kbd className="hidden rounded-md bg-subtle px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted sm:inline">
            Esc
          </kbd>
        </button>
      </div>

      <div className="flex flex-1 items-center">
        <SkateDeckRail
          items={items}
          aspect={aspect}
          flip={false}
          eyebrow="Certificates"
          heading="Every certificate, on the rail."
          caption="Brush along the rail to face a certificate, then click to lift it."
          active={active}
          onActiveChange={setActive}
          onOpenChange={(index) => {
            detailOpen.current = index !== null;
          }}
          labels={{ graphic: "Certificate", grip: "Back", close: "Close", open: "View" }}
          className="bg-transparent"
          detailAction={(deck) => {
            const c = certificates.find((x) => x.file === deck.id);
            if (!c) return null;
            return (
              <div className="flex flex-wrap gap-2">
                <a
                  href={c.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-on-ink shadow-soft transition-colors duration-200 hover:bg-ink-hover"
                >
                  <FileText aria-hidden className="size-4" />
                  Open PDF
                </a>
                {c.verifyUrl ? (
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-subtle"
                  >
                    <BadgeCheck aria-hidden className="size-4 text-accent-strong" />
                    Verify{c.platform ? ` on ${c.platform}` : ""}
                    <ArrowUpRight aria-hidden className="size-4 text-muted" />
                  </a>
                ) : null}
              </div>
            );
          }}
        />
      </div>
    </div>,
    document.body,
  );
}
