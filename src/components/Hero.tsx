import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { CountUp } from "@/components/interactions/CountUp";
import { Magnetic } from "@/components/interactions/Magnetic";
import { ScrollDrift } from "@/components/interactions/ScrollDrift";
import { HeroVisual } from "@/components/three/HeroVisual";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LiquidText } from "@/components/ui/liquid-text";
import { hero } from "@/data/site";
import { geistSans } from "@/lib/fonts";
import { personalInfo } from "@/lib/portfolio";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20"
    >
      <div aria-hidden className="hero-glow absolute inset-0 -z-10" />

      <div className="container-page grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
        {/* Text eases down and fades as the hero scrolls away. */}
        <ScrollDrift className="lg:col-span-7" y={70} fadeTo={0.15}>
          <Reveal y={16}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink shadow-soft backdrop-blur">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {personalInfo.title}
              <span aria-hidden className="text-line">
                /
              </span>
              <span className="text-muted">iOS · Android · Web</span>
            </p>
          </Reveal>

          {/* Real heading for search engines and screen readers. */}
          <h1 id="home-title" className="sr-only">
            {personalInfo.name}
          </h1>

          {/*
            Visual heading: the name as a viscous liquid surface (WebGL2). Drag
            through a letter to pull a bead of ink off it. Height is reserved
            up front (font size = 10.74% of the column width, height = 1.6x)
            so the page does not shift when the canvas first draws.
          */}
          <div aria-hidden className="@container mt-7">
            <div className="min-h-[min(17.2cqw,153.6px)]">
              <LiquidText
                text={personalInfo.name}
                align="left"
                fontSize={96}
                fontWeight={600}
                fontFamily={geistSans.style.fontFamily}
                accentColor="#3478F6"
                gloss={0.08}
                viscosity={0.55}
              />
            </div>
          </div>
          <noscript>
            <p aria-hidden className="mt-7 text-display font-semibold text-ink">
              {personalInfo.name}
            </p>
          </noscript>

          <Reveal delay={0.08} y={18}>
            <p className="mt-6 max-w-2xl text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-muted [text-wrap:balance]">
              {hero.lead}
            </p>
          </Reveal>

          <Reveal delay={0.16} y={18}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]">
              {hero.intro}
            </p>
          </Reveal>

          <Reveal delay={0.24} y={18}>
            <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
              <Magnetic>
              <ButtonLink href="#projects" size="lg">
                Explore My Work
                <ArrowDown
                  aria-hidden
                  className="size-4 transition-transform duration-250 group-hover/btn:translate-y-0.5"
                />
              </ButtonLink>
              </Magnetic>
              <Magnetic>
              <ButtonLink href="#contact" size="lg" variant="secondary">
                Get in Touch
                <ArrowUpRight
                  aria-hidden
                  className="size-4 text-muted transition-transform duration-250 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                />
              </ButtonLink>
              </Magnetic>
            </div>
          </Reveal>
        </ScrollDrift>

        {/* The sculpture rises and recedes slightly faster: a gentle parallax. */}
        <ScrollDrift
          className="relative h-[300px] min-[420px]:h-[360px] sm:h-[440px] lg:col-span-5 lg:h-[580px]"
          y={-50}
          scale={0.94}
          fadeTo={0.35}
        >
          <HeroVisual />
        </ScrollDrift>

        <Reveal delay={0.3} className="lg:col-span-12">
          <dl className="mt-2 grid grid-cols-3 gap-4 border-t border-line pt-7 sm:gap-8 lg:mt-6 lg:max-w-3xl">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1.5">
                <dt className="text-[0.8125rem] leading-snug text-muted">{stat.label}</dt>
                <dd className="text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] text-ink tabular-nums">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
