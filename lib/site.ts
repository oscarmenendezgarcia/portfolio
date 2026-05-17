// Single source of truth for all site-wide configuration.
// Metadata, Navbar, Footer, social links, and project data all read from this file.

export type NavLink = {
  label: string;
  href: `#${string}` | string;
};

export type SocialLink = {
  label: "GitHub" | "LinkedIn" | "X" | "Email";
  href: string;
};

export type ProjectStatus = "in-progress" | "launched" | "archived";

export type ProjectCard = {
  /** Two-digit numeric ID: "01", "02", etc. */
  id: string;
  title: string;
  /** Max ~100 chars for compact card display. */
  description: string;
  /** Portfolio owner's role on this project. */
  role: string;
  /** Absolute URL to repo, case study, or demo. */
  href: string;
  status: ProjectStatus;
  /** Technologies used, ordered by importance. */
  stack: string[];
};

export const site = {
  name: "Oscar Menéndez García",
  role: "Full-stack engineer & product thinker",
  location: "Spain",
  /** Canonical URL. Override with NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.local",
  /** ≤160 characters — used in <meta name="description"> and OpenGraph */
  description:
    "Full-stack engineer fascinated by systems, clarity, and delightful user experiences. Building products that matter.",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Writing", href: "#writing" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavLink[],
  socials: [
    { label: "GitHub", href: "https://github.com/oscarmenendezgarcia" },
    { label: "LinkedIn", href: "https://linkedin.com/in/oscarmenendezgarcia" },
    { label: "X", href: "https://x.com/oscarmenendez" },
    { label: "Email", href: "mailto:oscarmdzgarcia@gmail.com" },
  ] satisfies SocialLink[],
  cvPath: "/cv.pdf",
} as const;

// ─── Project Data ─────────────────────────────────────────────────────────────
// Add, remove, or reorder items here to update the Work section on the homepage.
// Numbering (01/, 02/, …) is auto-generated from the array index in the component.

export const projects: ProjectCard[] = [
  {
    id: "01",
    title: "Prism — Kanban Board",
    description:
      "Local task management tool with kanban columns, agent pipelines, and real-time collaboration.",
    role: "Full-stack Engineer",
    href: "https://github.com/oscarmenendezgarcia/prism",
    status: "launched",
    stack: ["React", "TypeScript", "Node.js", "SQLite"],
  },
  {
    id: "02",
    title: "AI Research Platform",
    description:
      "Real-time AI analysis engine for structured data extraction from unstructured sources.",
    role: "Lead Engineer",
    href: "https://github.com/oscarmenendezgarcia",
    status: "in-progress",
    stack: ["Python", "FastAPI", "PostgreSQL", "LLM APIs"],
  },
  {
    id: "03",
    title: "Design System Library",
    description:
      "Reusable component library with design tokens for consistent brand experiences at scale.",
    role: "Design Engineer",
    href: "https://github.com/oscarmenendezgarcia",
    status: "archived",
    stack: ["Figma", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "04",
    title: "Data Visualization Tool",
    description:
      "Interactive charts and real-time dashboards for operational metrics and business intelligence.",
    role: "Product Engineer",
    href: "https://github.com/oscarmenendezgarcia",
    status: "launched",
    stack: ["D3.js", "React", "Node.js", "MongoDB"],
  },
];
