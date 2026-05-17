// Server Component — no interactivity needed for the scaffold.
// Scroll-spy (active link tracking) is a future enhancement.
import { site } from "@/lib/site";

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center justify-between h-full max-w-[900px] mx-auto px-6 lg:px-10"
    >
      {/* Logo / initials */}
      <a
        href="#hero"
        aria-label={`${site.name} — back to top`}
        className="text-text-primary font-semibold text-sm tracking-widest uppercase hover:text-accent transition-colors"
      >
        OM
      </a>

      {/* Nav links — horizontal on all viewports for the scaffold.
          Hamburger menu is a future enhancement (wireframes §13, Option A chosen). */}
      <ul className="flex items-center gap-6 list-none m-0 p-0" role="list">
        {site.nav.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-text-secondary text-sm hover:text-accent transition-colors focus-visible:text-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
