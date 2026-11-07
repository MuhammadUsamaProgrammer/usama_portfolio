import { Reveal } from "@/components/animations/Reveal";
import { TimelineProgress } from "@/components/interactions/TimelineProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/lib/portfolio";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="section-space border-y border-line bg-surface"
    >
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="experience"
              index="04"
              eyebrow="Experience"
              title="Four teams, one craft."
              description="From internship to leading delivery on production apps for international clients."
            />
          </div>
        </div>

        <ol className="relative lg:col-span-8">
          <TimelineProgress className="left-[0.3125rem] top-3 bottom-3 sm:left-[0.4375rem]" />
          {timeline.map((entry) => (
            <Reveal
              as="li"
              key={`${entry.company}-${entry.duration}`}
              className="relative pb-14 pl-9 last:pb-0 sm:pl-12"
            >
              <span
                aria-hidden
                className={`absolute left-0 top-2 grid size-[0.6875rem] place-items-center rounded-full border-2 sm:size-[0.9375rem] ${
                  entry.current
                    ? "border-accent bg-surface"
                    : "border-line-strong bg-surface"
                }`}
              >
                {entry.current ? <span className="size-1 rounded-full bg-accent sm:size-1.5" /> : null}
              </span>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-title font-semibold text-ink">{entry.company}</h3>
                <p className="flex items-center gap-2 text-sm text-muted tabular-nums">
                  {entry.current ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-strong">
                      Current
                    </span>
                  ) : null}
                  {entry.duration}
                </p>
              </div>
              <p className="mt-1.5 text-[0.9375rem] font-medium text-ink/75">{entry.title}</p>

              {entry.stages ? (
                <ol
                  aria-label={`Role progression at ${entry.company}`}
                  className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
                >
                  {entry.stages.map((stage) => (
                    <li key={stage.title} className="bg-bg px-4 py-3">
                      <p className="text-[0.8125rem] font-medium text-ink">{stage.title}</p>
                      <p className="mt-0.5 text-xs text-muted tabular-nums">{stage.period}</p>
                    </li>
                  ))}
                </ol>
              ) : null}

              <ul className="mt-5 space-y-2.5">
                {entry.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/75"
                  >
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ink/30" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 rounded-2xl bg-bg px-5 py-4 text-[0.9375rem] leading-relaxed text-ink/85 ring-1 ring-line">
                <span className="mr-2 font-medium text-ink">Impact</span>
                {entry.impact}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
