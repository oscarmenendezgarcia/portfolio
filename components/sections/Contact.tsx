import { site } from "@/lib/site";

const email = site.socials.find((s) => s.label === "Email")?.href ?? "mailto:oscarmdzgarcia@gmail.com";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-12">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">

        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <h2
          id="contact-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary tracking-tight mb-4"
        >
          Let&apos;s work together.
        </h2>

        <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-md">
          Open to interesting projects, collaborations, and conversations.
          Reach out directly or find me on:
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={email}
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors duration-150 underline underline-offset-4 decoration-border hover:decoration-accent"
          >
            {email.replace("mailto:", "")}
          </a>

          {site.socials
            .filter((s) => s.label !== "Email")
            .map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary/60 hover:text-text-primary transition-colors duration-150"
              >
                {social.label}
              </a>
            ))}
        </div>

      </div>
    </section>
  );
}
