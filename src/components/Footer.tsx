import { ArrowUp } from "lucide-react";
import { CurrentYear } from "@/components/CurrentYear";
import { contactLinks, personalInfo } from "@/lib/portfolio";

export function Footer() {
  return (
    <footer className="py-12 sm:py-16">
      <div className="container-page flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.9375rem] font-medium text-ink">{personalInfo.name}</p>
          <p className="mt-1 text-sm text-muted">
            © <CurrentYear /> {personalInfo.name}. {personalInfo.title}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <ul className="flex flex-wrap items-center gap-1">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex h-11 items-center rounded-full px-3.5 text-sm text-muted transition-colors duration-200 hover:bg-subtle hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#home"
            aria-label="Back to top"
            className="ml-2 grid size-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <ArrowUp aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
