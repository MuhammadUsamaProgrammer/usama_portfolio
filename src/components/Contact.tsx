import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { contact } from "@/data/site";
import { contactLinks, email } from "@/lib/portfolio";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-6 pt-6 sm:pb-10">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-panel px-6 py-20 text-white sm:px-12 sm:py-24 lg:px-20 lg:py-32 dark:ring-1 dark:ring-line">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(52,120,246,0.28),transparent_60%),radial-gradient(40%_60%_at_0%_100%,rgba(255,255,255,0.06),transparent_70%)]"
          />

          <p className="flex items-center gap-3 text-[0.8125rem] font-medium text-white/60">
            <span className="font-mono text-xs tabular-nums">06</span>
            <span aria-hidden className="h-px w-8 bg-white/20" />
            Contact
          </p>

          <h2
            id="contact-title"
            className="mt-6 max-w-4xl text-[clamp(2.5rem,1.4rem+4.6vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] [text-wrap:balance]"
          >
            {contact.heading}
          </h2>
          <p className="mt-6 max-w-xl text-lede text-white/65">{contact.body}</p>

          {email ? (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${email}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[0.9375rem] font-medium text-panel transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-white/90 active:scale-[0.98] sm:h-13 sm:px-7"
              >
                <Mail aria-hidden className="size-4" />
                Start a conversation
              </a>
              <CopyEmailButton email={email} />
            </div>
          ) : null}

          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {contactLinks.map((link) => (
              <li key={link.label} className="min-w-0 bg-panel">
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${link.label}: ${link.display}${link.external ? " (opens in a new tab)" : ""}`}
                  className="group flex min-h-20 items-center justify-between gap-4 px-5 py-4 transition-colors duration-250 hover:bg-white/[0.04]"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-white/50">{link.label}</span>
                    <span className="mt-1 block truncate text-[0.9375rem] text-white/90">
                      {link.display}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-white/50 transition-transform duration-250 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
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
