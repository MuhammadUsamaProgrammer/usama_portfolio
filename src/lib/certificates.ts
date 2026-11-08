import entries from "@/data/certificates.json";
import fileInfo from "@/data/certificate-files.json";
import { withBase } from "@/lib/base-path";
import type { Certificate, CertificateEntry, CertificateFileInfo } from "@/types/portfolio";

const files = fileInfo as Record<string, CertificateFileInfo>;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function sizeLabel(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `PDF · ${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `PDF · ${Math.round(bytes / 1024)} KB`;
}

/**
 * Verified certificates, newest first. Entries without a PDF are skipped
 * (the build script reports them), so the site never links to a missing file.
 */
export const certificates: Certificate[] = (entries as CertificateEntry[])
  .flatMap((entry): Certificate[] => {
    const info = files[entry.file];
    if (!info) return [];
    return [
      {
        ...entry,
        pdf: withBase(info.pdf),
        preview: info.preview ? { ...info.preview, src: withBase(info.preview.src) } : null,
        dateLabel: DATE_FORMAT.format(new Date(`${entry.date}T00:00:00Z`)),
        sizeLabel: sizeLabel(info.sizeBytes),
      },
    ];
  })
  .sort((a, b) => b.date.localeCompare(a.date));
