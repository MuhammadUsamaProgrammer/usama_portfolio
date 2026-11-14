import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { Magnetic } from "@/components/interactions/Magnetic";
import { DotField } from "@/components/ui/dot-field";
import { contact } from "@/data/site";
import { geistSans } from "@/lib/fonts";
import { contactLinks, email } from "@/lib/portfolio";

/** Brand accent from the design tokens (--color-accent). */
const ACCENT = "#3478F6";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-6 pt-6 sm:pb-10">
      <div className="container-page">
        {/*
          Closing statement drawn from a field of dots. Scroll-scatter is off:
          the final call to action should stay assembled at the end of the page.
        */}
        <div className="overflow-hidden rounded-[2rem] border border-line">
          <DotField
            headline={contact.heading}
            headingLevel="h2"
            headingId="contact-title"
            eyebrow="07 · Contact"
            description={contact.body}
            accent={ACCENT}
            fontFamily={geistSans.style.fontFamily}
            fontWeight={600}
            scrollScatter={false}
            height="min(80svh, 47.5rem)"
            minHeight={520}
            maxFontSize={88}
            scaleWithRoot
            actions={
              email ? (
                <>
                  <Magnetic>
                    <a
                      href={`mailto:${email}`}
                      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-on-ink shadow-soft transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-ink-hover active:scale-[0.98]"
                    >
                      <Mail aria-hidden className="size-4" />
                      Start a conversation
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <CopyEmailButton email={email} />
                  </Magnetic>
                </>
              ) : null
            }
          />
        </div>

        <Reveal>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {contactLinks.map((link) => (
              <li key={link.label} className="min-w-0 bg-surface">
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${link.label}: ${link.display}${link.external ? " (opens in a new tab)" : ""}`}
                  className="group flex min-h-20 items-center justify-between gap-4 px-5 py-4 transition-colors duration-250 hover:bg-subtle"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{link.label}</span>
                    <span className="mt-1 block truncate text-[0.9375rem] text-ink">
                      {link.display}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted transition-transform duration-250 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
