// Single source of truth for all site-wide configuration.
// Metadata, Navbar, Footer, and social links all read from this file.

export type NavLink = {
  label: string;
  href: `#${string}` | string;
};

export type SocialLink = {
  label: "GitHub" | "LinkedIn" | "X" | "Email";
  href: string;
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
