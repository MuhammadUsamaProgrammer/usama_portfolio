"use client";

import GlassFolder, {
  type ArtRecipe,
  type FolderFile,
} from "@/components/ui/glass-folder-cards";
import { useMediaQuery, useRootScale } from "@/components/interactions/hooks";
import { useTheme } from "@/lib/theme";
import type { Certificate } from "@/types/portfolio";

/** Back-panel artwork in the brand blues (generated, no image download). */
const BRAND_ART: ArtRecipe = {
  style: "streak",
  colors: ["#f5f7fb", "#d6e2f7", "#8fb3f5", "#3478f6", "#1d3a73", "#9cbcf2", "#eef3fb"],
  scale: 0.7,
  warp: 1.5,
  angle: -0.5,
  gloss: 0.2,
  veins: 0,
};

type CertificatesFolderProps = {
  certificates: Certificate[];
  /** Called when a certificate is chosen in the open folder. Defaults to opening its PDF. */
  onSelect?: (certificate: Certificate) => void;
};

/**
 * The certificates as files in a frosted-glass folder. Hover leans the glass,
 * click opens the folder and fans the certificates out; choosing one opens it.
 */
export function CertificatesFolder({ certificates, onSelect }: CertificatesFolderProps) {
  const dark = useTheme() === "dark";
  const compact = useMediaQuery("(max-width: 420px)");
  const scale = useRootScale();

  // The folder puts the last file at the front of the stack, nearest the glass:
  // reverse so the newest certificate is the one you see first.
  const ordered = [...certificates].reverse();
  const files: FolderFile[] = ordered.map((c) => ({
    name: c.title,
    meta: `${c.issuer} · ${c.date.slice(0, 4)}`,
    image: c.preview?.src,
  }));
  const count = certificates.length;

  return (
    <GlassFolder
      label="Certificates"
      meta={`${count} verified`}
      tone={dark ? "dark" : "light"}
      art={BRAND_ART}
      seed={7}
      files={files}
      action="none"
      width={Math.round((compact ? 290 : 360) * scale)}
      onFileSelect={(_, index) => {
        const certificate = ordered[index];
        if (!certificate) return;
        if (onSelect) onSelect(certificate);
        else window.open(certificate.pdf, "_blank", "noopener,noreferrer");
      }}
      style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
    />
  );
}
