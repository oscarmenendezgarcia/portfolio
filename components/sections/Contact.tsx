// Server Component — no client-side JS required.
// Wireframe spec: agent-docs/contact/wireframes.md
// Visual reference: agent-docs/contact/wireframes-stitch.md
import { site } from "@/lib/site";

// The email link is surfaced as the dominant CTA; filter it from the
// secondary socials row so it isn't duplicated.
const SOCIAL_LINKS = site.socials.filter((s) => s.label !== "Email");

// Extract the canonical email href from site data so there is a single
// source of truth — changing lib/site.ts propagates everywhere.
const emailSocial = site.socials.find((s) => s.label === "Email");
const EMAIL_HREF = emailSocial?.href ?? "mailto:oscarmdzgarcia@gmail.com";
// Strip the mailto: prefix to display a clean address to screen readers
// and sighted users alike.
const EMAIL_ADDRESS = EMAIL_HREF.replace(/^mailto:/, "");

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 lg:py-32 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">

        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <h2
          id="contact-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-6"
        >
          Get in Touch
        </h2>

        {/* ── Warm intro paragraph ────────────────────────────────────────── */}
        {/* max-w-md keeps line length ≤60 ch on desktop for readability */}
        <p className="text-base text-text-secondary leading-relaxed mb-10 max-w-md">
          Have a project idea? I&rsquo;m fascinated by systems, clarity, and
          delightful user experiences. Let&rsquo;s explore collaboration.
        </p>

        {/* ── Primary email CTA ───────────────────────────────────────────── */}
        {/* min-h-[44px] + flex items-center satisfies WCAG 2.5.5 touch target */}
        <a
          href={EMAIL_HREF}
          className="
            inline-flex items-center
            font-mono text-lg
            text-accent hover:underline underline-offset-4
            transition-colors duration-200 ease-in-out
            min-h-[44px] mb-8
            focus-visible:outline-none focus-visible:ring-0
          "
        >
          {EMAIL_ADDRESS}
        </a>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        {/* aria-hidden: presentational separator, no semantic meaning */}
        <hr
          aria-hidden="true"
          className="border-border mb-8"
        />

        {/* ── Secondary social links ──────────────────────────────────────── */}
        {/* role="list" restores list semantics removed by CSS reset in some
            browsers when list-style is absent. */}
        <div
          role="list"
          aria-label="Social profiles"
          className="flex flex-wrap gap-6"
        >
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              className="
                inline-flex items-center
                font-mono text-sm
                text-text-secondary
                hover:text-text-primary hover:underline underline-offset-4
                transition-colors duration-200 ease-in-out
                min-h-[44px]
                focus-visible:outline-none focus-visible:ring-0
              "
            >
              {social.label}
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
