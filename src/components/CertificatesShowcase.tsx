"use client";

import { Layers } from "lucide-react";
import { useState } from "react";
import { CertificateWardrobe } from "@/components/CertificateWardrobe";
import { CertificatesFolder } from "@/components/CertificatesFolder";
import type { Certificate } from "@/types/portfolio";

/**
 * The glass folder plus the full wardrobe. Choosing a certificate in the open
 * folder (or "View all certificates") opens the wardrobe on the rail.
 */
export function CertificatesShowcase({ certificates }: { certificates: Certificate[] }) {
  // `undefined` = closed; a number = open with that certificate facing front.
  const [wardrobe, setWardrobe] = useState<number | null | undefined>(undefined);

  return (
    <>
      <CertificatesFolder
        certificates={certificates}
        onSelect={(certificate) => setWardrobe(certificates.indexOf(certificate))}
      />
      <button
        type="button"
        onClick={() => setWardrobe(null)}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink shadow-soft transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-subtle active:scale-[0.98]"
      >
        <Layers aria-hidden className="size-4 text-muted" />
        View all certificates
      </button>
      <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
        Click the folder · pick a certificate
      </p>

      {wardrobe !== undefined ? (
        <CertificateWardrobe
          certificates={certificates}
          initialIndex={wardrobe}
          onClose={() => setWardrobe(undefined)}
        />
      ) : null}
    </>
  );
}
