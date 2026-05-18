// Server Component — no client-side JS required.
import { site } from "@/lib/site";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="contact-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-6"
        >
          Get in Touch
        </h2>

        <p className="text-base text-text-secondary leading-relaxed mb-10 max-w-md">
          Have a project idea or just want to chat? Reach out via email or
          connect on social.
        </p>

        <div className="flex flex-wrap gap-6" role="list" aria-label="Contact links">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              role="listitem"
              className="text-accent hover:text-accent-hover hover:underline underline-offset-4 transition-colors text-sm font-medium min-h-[44px] flex items-center"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
