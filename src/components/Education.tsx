import { GraduationCap, Users } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadership } from "@/data/site";
import { education } from "@/lib/portfolio";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="section-space">
      <div className="container-page">
        <SectionHeading
          id="education"
          index="05"
          eyebrow="Education & community"
          title="Learning, then giving back."
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Education */}
          <Reveal className="flex flex-col rounded-[1.75rem] border border-line bg-surface p-7 shadow-soft sm:p-10 lg:col-span-5">
            <span className="grid size-10 place-items-center rounded-xl border border-line text-ink">
              <GraduationCap aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
            </span>
            <p className="eyebrow mt-8">{education.duration}</p>
            <h3 className="mt-2 text-title font-semibold text-ink">
              {education.degree} in {education.major}
            </h3>
            <p className="mt-2 text-[0.9375rem] text-muted">{education.school}</p>

            <h4 className="eyebrow mt-10">Relevant coursework</h4>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {education.coursework.map((course) => (
                <li
                  key={course}
                  className="rounded-full bg-subtle px-3 py-1 text-[0.8125rem] leading-5 text-ink/80"
                >
                  {course}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Leadership */}
          <Reveal
            delay={0.08}
            className="rounded-[1.75rem] border border-line bg-surface p-7 shadow-soft sm:p-10 lg:col-span-7"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-line text-ink">
              <Users aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
            </span>
            <h3 className="mt-8 text-title font-semibold text-ink">{leadership.heading}</h3>

            <ul className="mt-8 divide-y divide-line border-t border-line">
              {leadership.items.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-1 py-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6"
                >
                  <div>
                    <p className="text-[0.9375rem] font-medium text-ink">{item.title}</p>
                    <p className="text-[0.8125rem] text-muted">{item.org}</p>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
