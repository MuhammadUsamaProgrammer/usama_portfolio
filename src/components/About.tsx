import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/data/site";
import { education, personalInfo } from "@/lib/portfolio";
import profile from "../../public/images/profile.webp";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-space">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Portrait */}
        <Reveal className="lg:col-span-5">
          <figure className="mx-auto max-w-md lg:sticky lg:top-28 lg:max-w-none">
            <div className="rounded-[1.75rem] border border-line bg-surface p-2 shadow-soft">
              <Image
                src={profile}
                alt={`Portrait of ${personalInfo.name}, a ${personalInfo.title}, wearing a white shirt and dark tie with arms crossed against a light grey backdrop.`}
                placeholder="blur"
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, (min-width: 448px) 448px, 100vw"
                className="h-auto w-full rounded-[1.25rem]"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between px-2 text-[0.8125rem] text-muted">
              <span className="font-medium text-ink">{personalInfo.name}</span>
              <span>{personalInfo.title}</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Biography */}
        <div className="lg:col-span-7 lg:pt-4">
          <SectionHeading id="about" index="01" eyebrow="About" title={about.heading} />

          <div className="mt-10 space-y-6 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-lg">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2">
            <div className="bg-surface p-6 sm:p-7">
              <h3 className="eyebrow">Focus areas</h3>
              <ul className="mt-4 space-y-2.5">
                {about.focus.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface p-6 sm:p-7">
              <h3 className="eyebrow">Beyond work</h3>
              <ul className="mt-4 space-y-2.5">
                {about.beyond.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface p-6 sm:col-span-2 sm:p-7">
              <h3 className="eyebrow">Education</h3>
              <p className="mt-3 text-[0.9375rem] text-ink">
                {education.degree} in {education.major}
                <span className="text-muted"> — {education.school}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
