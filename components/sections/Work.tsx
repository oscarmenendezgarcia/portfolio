// Server Component — placeholder stub. Content populated in the Work feature task.

type ProjectCard = {
  title: string;
  description: string;
  href: string;
};

const PLACEHOLDER_PROJECTS: ProjectCard[] = [
  {
    title: "Prism — Kanban Board",
    description:
      "A local task management tool with kanban columns, pipelines, and real-time collaboration.",
    href: "https://github.com/oscarmenendezgarcia/prism",
  },
  {
    title: "Project Two",
    description: "Brief description of the second project. Coming soon.",
    href: "#",
  },
  {
    title: "Project Three",
    description: "Brief description of the third project. Coming soon.",
    href: "#",
  },
  {
    title: "Project Four",
    description: "Brief description of the fourth project. Coming soon.",
    href: "#",
  },
];

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-20 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="work-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-10"
        >
          Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLACEHOLDER_PROJECTS.map((project) => (
            <article
              key={project.title}
              className="bg-surface border border-border rounded-[var(--radius-md)] p-6 hover:bg-surface-elevated transition-colors"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {project.description}
              </p>
              <a
                href={project.href}
                target={project.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  project.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                View &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
