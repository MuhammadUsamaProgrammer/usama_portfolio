import { ArrowUpRight, BadgeCheck, FileText } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { CertificatesShowcase } from "@/components/CertificatesShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certificatesSection } from "@/data/site";
import { certificates } from "@/lib/certificates";

const linkClass =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-ink transition-colors duration-200 hover:bg-subtle";

export function Certificates() {
  if (certificates.length === 0) return null;

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="section-space border-y border-line bg-surface"
    >
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading
            id="certificates"
            index="06"
            eyebrow={certificatesSection.eyebrow}
            title={certificatesSection.title}
            description={certificatesSection.description}
          />

          {/* Plain list: readable without the folder, and indexable. */}
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {certificates.map((c, i) => (
              <Reveal as="li" key={c.file} delay={i * 0.05} className="py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <h3 className="text-[0.9375rem] font-medium leading-snug text-ink">{c.title}</h3>
                    <p className="mt-1 text-[0.8125rem] text-muted">
                      {c.issuer}
                      {c.platform ? ` · ${c.platform}` : ""}
                      <span aria-hidden> · </span>
                      <time dateTime={c.date}>{c.dateLabel}</time>
                    </p>
                  </div>
                  <div className="-ml-3 flex shrink-0 gap-1 sm:ml-0">
                    <a
                      href={c.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View certificate: ${c.title} (PDF, opens in a new tab)`}
                      className={linkClass}
                    >
                      <FileText aria-hidden className="size-3.5 text-muted" />
                      View
                    </a>
                    {c.verifyUrl ? (
                      <a
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${c.title} on ${c.platform ?? "the issuer's site"} (opens in a new tab)`}
                        className={linkClass}
                      >
                        <BadgeCheck aria-hidden className="size-3.5 text-accent-strong" />
                        Verify
                        <ArrowUpRight aria-hidden className="size-3.5 text-muted" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="flex flex-col items-center lg:col-span-5">
          <CertificatesShowcase certificates={certificates} />
        </Reveal>
      </div>
    </section>
  );
}
