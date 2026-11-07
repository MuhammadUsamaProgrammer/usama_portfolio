import { Reveal } from "@/components/animations/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { showcaseProjects } from "@/lib/portfolio";

export function Projects() {
  const featured = showcaseProjects.filter((p) => p.featured);
  const rest = showcaseProjects.filter((p) => !p.featured);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-space">
      <div className="container-page">
        <SectionHeading
          id="projects"
          index="03"
          eyebrow="Selected work"
          title="Products in the hands of real users."
          description="A selection of apps I’ve built and shipped — live on the App Store, Google Play and the web."
        />

        <div className="mt-16 space-y-6 lg:mt-20 lg:space-y-8">
          {featured.map((project, i) => (
            <Reveal key={project.title}>
              <ProjectCard project={project} variant="featured" reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>

        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-8 lg:gap-8">
          {rest.map((project, i) => (
            <Reveal as="li" key={project.title} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} variant="grid" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
