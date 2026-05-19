import { projects as siteProjects, type ProjectCard } from "@/lib/site";

const STATUS_LABEL: Record<ProjectCard["status"], string> = {
  "in-progress": "In progress",
  launched: "Launched",
  archived: "Archived",
};

function statusClasses(status: ProjectCard["status"]): string {
  switch (status) {
    // #166534 on #dcfce7 → ~7:1 contrast (AAA)
    case "in-progress": return "text-[#166534] bg-[#dcfce7]";
    // text-secondary on surface-elevated → ≥4.5:1 on light
    case "launched":    return "text-text-secondary bg-surface-elevated";
    case "archived":    return "text-text-secondary/60 bg-transparent";
  }
}

interface WorkProps {
  projects?: ProjectCard[];
  maxProjects?: number;
}

export default function Work({ projects = siteProjects, maxProjects = 4 }: WorkProps) {
  const displayed = projects.slice(0, maxProjects);

  return (
    <section id="work" aria-labelledby="work-heading" className="py-12">
      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-10">
        <h2
          id="work-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary tracking-tight mb-8"
        >
          Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayed.map((project, index) => {
            const number = String(index + 1).padStart(2, "0");
            const isExternal = project.href.startsWith("http");

            return (
              <div
                key={project.id}
                className="p-[1px] rounded-[calc(var(--radius-md)+1px)] bg-gradient-to-b from-black/[0.05] to-transparent hover:from-black/[0.09] transition-all duration-200 group"
              >
                <article className="flex flex-col bg-surface rounded-[var(--radius-md)] p-5 h-full group-hover:bg-surface-elevated transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-mono text-accent/60 leading-none">
                      {number}
                    </span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 tracking-wide uppercase ${statusClasses(project.status)}`}>
                      {STATUS_LABEL[project.status]}
                    </span>
                  </div>

                  <a
                    href={project.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="block mb-2"
                  >
                    <h3 className="text-base font-semibold text-text-primary leading-snug hover:text-accent transition-colors duration-150">
                      {project.title}
                    </h3>
                  </a>

                  <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                      {project.stack.slice(0, 3).map((tech) => (
                        <li key={tech} className="text-[11px] font-mono text-text-secondary/60 border border-border/40 rounded-full px-2 py-0.5">
                          {tech}
                        </li>
                      ))}
                      {project.stack.length > 3 && (
                        <li className="text-[11px] font-mono text-text-secondary/40">+{project.stack.length - 3}</li>
                      )}
                    </ul>
                    <span className="text-[11px] text-text-secondary/40 shrink-0 text-right">
                      {project.role}
                    </span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
