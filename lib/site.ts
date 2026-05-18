// Single source of truth for all site-wide configuration.
// Metadata, Navbar, Footer, social links, project and career data all read from this file.

export type NavLink = {
  label: string;
  href: `#${string}` | string;
};

export type SocialLink = {
  label: "GitHub" | "LinkedIn" | "Email";
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
  /** Discriminator so Work adapters can union with Role. */
  kind?: "project";
};

export type RoleStatus = "current" | "past";

export type Role = {
  /** Stable kebab-case ID used as React key — e.g. "empathy-senior-2023". */
  id: string;
  company: string;
  /** Job title at that company. */
  title: string;
  /** ISO YYYY-MM (no day needed). */
  startDate: string;
  /** ISO YYYY-MM, or null for "Present". */
  endDate: string | null;
  /** Pre-formatted human range, e.g. "Apr 2023 — Present". */
  dateRange: string;
  location: string;
  status: RoleStatus;
  /** 1-line summary (≤120 chars) shown under the title in the card. */
  summary: string;
  /** Bullet list of responsibilities — rendered as <ul> in the card body. */
  responsibilities: string[];
  /** Technologies used, ordered by relevance. */
  stack: string[];
};

export type Education = {
  institution: string;
  degree: string;
  /** Display string, e.g. "2011 — 2017". */
  period: string;
  location?: string;
};

export const site = {
  name: "Oscar Menéndez García",
  role: "Senior Backend Engineer @ empathy.co",
  location: "Gijón, Spain",
  /** Canonical URL. Override with NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.local",
  /** ≤160 characters — used in <meta name="description"> and OpenGraph */
  description:
    "Senior Backend Engineer specialising in cloud-native microservices with Java, Spring and Micronaut. Building reliable, observable systems at empathy.co.",
  /** 2-sentence narrative for the Hero section. */
  bio: "I design and run cloud-native microservices for empathy.co, where I've spent the last seven years scaling search-relevance infrastructure. I care about CI/CD that gets out of the way, observability that pages the right person, and code a teammate can read without a tour guide.",
  /** Short tagline rendered between the role line and bio in Hero. */
  tagline: "Cloud-native systems · Java · Micronaut · Kubernetes",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Writing", href: "#writing" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavLink[],
  socials: [
    { label: "GitHub", href: "https://github.com/oscarmenendezgarcia" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/oscar-men%C3%A9ndez-garc%C3%ADa-81341740",
    },
    { label: "Email", href: "mailto:oscarmdzgarcia@gmail.com" },
  ] satisfies SocialLink[],
  cvPath: "/cv.pdf",
} as const;

// ─── Projects ─────────────────────────────────────────────────────────────────
// Personal / open-source projects shown in the Work grid alongside career roles.

export const projects: ProjectCard[] = [
  {
    id: "01",
    kind: "project",
    title: "OPTCG Search",
    description:
      "Card search engine for the One Piece Card Game. Fast full-text and filter-based lookup across the full card catalogue.",
    role: "Author & maintainer",
    href: "https://optcg-search.vercel.app/",
    status: "launched",
    stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    id: "02",
    kind: "project",
    title: "Prism — Local Kanban + Agent Pipeline",
    description:
      "Local-first kanban board with a pluggable agent pipeline (architect → UX → dev → QA). Node.js + SQLite backend, React + Tailwind frontend.",
    role: "Author & maintainer",
    href: "https://github.com/oscarmenendezgarcia/prism",
    status: "in-progress",
    stack: ["Node.js", "SQLite", "React 19", "TypeScript", "Tailwind"],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────
// Professional roles, newest-first. Used by the Work section hybrid grid.

export const experience: Role[] = [
  {
    id: "empathy-senior-2023",
    company: "Empathy.co",
    title: "Senior Backend Software Engineer",
    startDate: "2023-04",
    endDate: null,
    dateRange: "Apr 2023 — Present",
    location: "Gijón, Spain",
    status: "current",
    summary: "Scaling search-relevance microservices on GCP/Kubernetes.",
    responsibilities: [
      "Design and implementation of scalable microservices.",
      "Performance optimisation and efficiency in cloud environments.",
      "Automation of CI/CD processes for rapid and reliable delivery.",
      "Analysis and resolution of complex problems.",
      "Effective collaboration in cross-functional teams.",
    ],
    stack: ["Java", "Micronaut", "Spring", "Kubernetes", "Helm", "ArgoCD", "GCP"],
  },
  {
    id: "empathy-backend-2019",
    company: "Empathy.co",
    title: "Backend Software Engineer",
    startDate: "2019-06",
    endDate: "2023-04",
    dateRange: "Jun 2019 — Apr 2023",
    location: "Gijón, Spain",
    status: "past",
    summary: "Backend foundations for empathy.co's search platform.",
    responsibilities: [
      "Built and maintained Java/Spring services powering search-as-a-service products.",
      "Integrated MongoDB, Elasticsearch and Kafka pipelines.",
      "Contributed to the migration of legacy services to a microservices architecture.",
    ],
    stack: ["Java", "Spring", "MongoDB", "Elasticsearch", "Docker", "AWS"],
  },
  {
    id: "dxc-2018",
    company: "DXC Technology",
    title: "Backend Engineer",
    startDate: "2018-09",
    endDate: "2019-04",
    dateRange: "Sep 2018 — Apr 2019",
    location: "Avilés, Spain",
    status: "past",
    summary: "Multi-language backend engineering across enterprise projects.",
    responsibilities: [
      "Joined as a Java/.NET engineer; contributed across projects in multiple languages and stacks.",
      "Delivered backend features in enterprise client environments.",
    ],
    stack: ["Java", ".NET", "SQL"],
  },
  {
    id: "alavista-2017",
    company: "Alavista Studio (ArcelorMittal)",
    title: "R&D Engineer",
    startDate: "2017-02",
    endDate: "2018-09",
    dateRange: "Feb 2017 — Sep 2018",
    location: "Avilés, Spain",
    status: "past",
    summary: "Industrial-process optimisation software for steel siderurgy.",
    responsibilities: [
      "Automated industrial processes for steel siderurgy at ArcelorMittal's CDT.",
      "Implemented concurrent algorithms and metaheuristics to solve steel-production optimisation problems.",
      "Built the solution on the .NET platform.",
    ],
    stack: [".NET", "C#", "Concurrent programming", "Metaheuristics"],
  },
];

// ─── Education ────────────────────────────────────────────────────────────────

export const education: Education[] = [
  {
    institution: "Universidad de Oviedo",
    degree: "B.Sc. in Informatics Engineering",
    period: "2011 — 2017",
    location: "Oviedo, Spain",
  },
];
